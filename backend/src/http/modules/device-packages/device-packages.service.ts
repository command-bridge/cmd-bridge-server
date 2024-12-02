import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";
import { DeviceKnownPackagesDto } from "./device-packages.dto";
import { PackagesManagerService } from "./packages-manager.service";
import { DownloadType } from "./device-package.type";
import { join } from "path";
import { createReadStream, existsSync, statSync } from "fs";
import { Response } from "express";

@Injectable()
export class DevicePackagesService {
    constructor(
        private readonly packagesManagerService: PackagesManagerService,
    ) {}

    public getUpdates(devicePackages: DeviceKnownPackagesDto) {
        const toUpdate = [];
        const toRemove = [];
        const toDownload = [];

        console.log(devicePackages);

        for (const clientPackage of devicePackages.packages) {
            const localPackage = this.packagesManagerService.getLocal(
                clientPackage.name,
            );

            if (!localPackage) {
                toRemove.push(clientPackage);
                continue;
            }

            if (
                !this.packagesManagerService.isLatest(
                    localPackage,
                    clientPackage,
                )
            ) {
                toUpdate.push(localPackage);
                continue;
            }
        }

        toDownload.push(
            ...this.packagesManagerService.getMissingPackages(
                devicePackages.packages,
            ),
        );

        return {
            toUpdate,
            toDownload,
            toRemove,
        };
    }

    public manageDownload(
        packageName: string,
        type: DownloadType,
        res: Response,
    ) {
        try {
            const localPackage =
                this.packagesManagerService.getLocal(packageName);

            if (!localPackage) {
                throw new HttpException(
                    "Package not found",
                    HttpStatus.NOT_FOUND,
                );
            }

            const { name, asarFile } = localPackage;

            const filePath = join(
                process.env.ASSETS_DIR,
                "packages",
                "global",
                name,
                type === "latest" ? "latest.json" : asarFile,
            );

            if (!existsSync(filePath)) {
                throw new InternalServerErrorException(
                    `${filePath} not exists`,
                );
            }

            const stats = statSync(filePath);
            if (!stats.isFile()) {
                throw new InternalServerErrorException(
                    `${filePath} is not a file`,
                );
            }

            res.setHeader(
                "Content-Type",
                type === "latest"
                    ? "application/json"
                    : "application/octet-stream",
            );
            res.setHeader("Content-Length", stats.size);

            const fileStream = createReadStream(filePath);
            fileStream.pipe(res);

            fileStream.on("end", () => {
                Logger.log(
                    `File downloaded successfully ${filePath}.`,
                    DevicePackagesService.name,
                );
            });

            fileStream.on("error", (err) => {
                Logger.error(
                    `(File stream error) ${err.name} ${err.message}.`,
                    DevicePackagesService.name,
                );
                res.status(500).send("Failed to stream file.");
            });

            res.on("close", () => {
                Logger.warn(
                    `Connection aborted by client when downloading ${packageName} ${type}.`,
                    DevicePackagesService.name,
                );
                fileStream.destroy(); // Certifique-se de destruir o stream
            });
        } catch (err) {
            if (err instanceof Error) {
                Logger.error(
                    `[${err.name}] ${err.message}`,
                    DevicePackagesService.name,
                );
                console.error(err.stack);
            }
        }
    }
}
