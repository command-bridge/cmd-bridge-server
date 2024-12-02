import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PackageItemDto } from "./device-packages.dto";
import { eq } from "semver";
import { join } from "path";
import { existsSync, readdirSync, readFileSync } from "fs";
import { Cron } from "@nestjs/schedule";
import { PackageItem } from "./device-package.type";

@Injectable()
export class PackagesManagerService implements OnModuleInit {
    private globalLatestPackages: PackageItem[] = [];

    async onModuleInit() {
        this.refreshLoadedPackagesMetadata();
    }

    @Cron("*/5 * * * *")
    public refreshLoadedPackagesMetadata() {
        const packageDirectories = this.getPackageDirectories();

        this.globalLatestPackages = packageDirectories
            .map(this.loadLatestJsonFile)
            .filter((entry) => entry !== null);

        Logger.log(
            `Loaded global packages: ${this.globalLatestPackages.length}`,
            PackagesManagerService.name,
        );
    }

    public loadLatestJsonFile(dir: string) {
        const latestJsonPath = join(
            process.env.ASSETS_DIR,
            "packages",
            "global",
            dir,
            "latest.json",
        );

        if (existsSync(latestJsonPath)) {
            const content = readFileSync(latestJsonPath, "utf-8");
            try {
                const parsedContent = JSON.parse(content);
                return {
                    name: dir,
                    version: parsedContent.version,
                    asarFile: parsedContent.asarFile,
                    checksum: parsedContent.checksum,
                    releaseDate: parsedContent.releaseDate,
                } as PackageItem;
            } catch (err) {
                Logger.error(
                    `Failed parsing latest.json for /packages/global/${dir}.`,
                    err,
                );
                return null;
            }
        }

        return null;
    }

    public getPackageDirectories() {
        const packagesDir = join(process.env.ASSETS_DIR, "packages", "global");
        const entries = readdirSync(packagesDir, { withFileTypes: true });

        return entries
            .filter((entry) => entry.isDirectory()) // Filtrar apenas diretórios
            .map((entry) => entry.name); // Retornar apenas os nomes
    }

    public getMissingPackages(knownPackages: PackageItemDto[]) {
        const missing = this.globalLatestPackages.filter((item) => {
            const found = knownPackages.find(
                (knownItem) => knownItem.name === item.name,
            );

            return found ? false : true;
        });

        return missing;
    }

    public isLatest(
        localPackage: PackageItemDto,
        clientPackage: PackageItemDto,
    ) {
        return eq(clientPackage.version, localPackage.version);
    }

    public isDeprecated(localPackage: PackageItemDto | null) {
        return localPackage === null;
    }

    public getLocal(name: string) {
        const localPackage = this.globalLatestPackages.find(
            (item) => item.name === name,
        );

        return localPackage;
    }
}
