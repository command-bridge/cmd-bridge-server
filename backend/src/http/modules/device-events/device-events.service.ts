import { ConnectionRepositoryService } from "@common/connections/connection-repository.service";
import { DeviceEntity } from "@common/entities/environment/device.entity";
import {
    OnlineDevice,
    OnlineDevicesRepository,
    SubjectMessage,
} from "@common/shared-memory/environment-memory/repositories/online-devices.memory";
import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
} from "@nestjs/common";
import {
    DeviceReceiveLogsParam,
    DeviceSubscribeDto,
} from "./device-events.dto";
import { map, Subject } from "rxjs";
import { RequestWithPayload } from "@common/auth/jwt-auth.middlewere";
import { DeviceEventsActionSerivce } from "./device-events-actions.service";
import { randomUUID, UUID } from "crypto";
import { join } from "path";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import { Response } from "express";

const LOGS_DIR = join(process.env.ASSETS_DIR, "logs");

@Injectable()
export class DeviceEventsService {
    constructor(
        private readonly onlineDevicesRepository: OnlineDevicesRepository,
        private readonly environmentConnection: ConnectionRepositoryService,
        private readonly deviceEventsActionService: DeviceEventsActionSerivce,
    ) { }

    public async subscribe(
        deviceSubscribeDto: DeviceSubscribeDto,
        req: RequestWithPayload,
    ) {
        await this.upsertSubscribedDevice(
            req.payload.id,
            req.payload.environment_id,
            deviceSubscribeDto.version,
        );

        return { subscribed: true };
    }

    public waitForMessage(req: RequestWithPayload) {
        const onlineDevice = this.onlineDevicesRepository.get(req.payload.id);

        if (!onlineDevice || onlineDevice.subject) {
            Logger.log(
                `Rejecting ${onlineDevice.environmentId}:${onlineDevice.device.device_hash}. Already connected`,
                DeviceEventsService.name,
            );

            throw new BadRequestException("Unauthorized access");
        }

        onlineDevice.subject = new Subject<SubjectMessage>();

        req.on("close", () => {
            this.handleDisconnect(onlineDevice);
        });

        req.socket.on("end", () => {
            this.handleDisconnect(onlineDevice);
        });

        this.deviceEventsActionService.onConnected(onlineDevice);

        setTimeout(() => {
            onlineDevice.subject.next({
                action: "send-packages",
            });
        }, 50);

        return onlineDevice.subject
            .asObservable()
            .pipe(map((message) => ({ data: message })));
    }

    private handleDisconnect(onlineDevice: OnlineDevice) {
        if (!this.onlineDevicesRepository.get(onlineDevice.device.id)) {
            return;
        }

        Logger.log(
            `Client ${onlineDevice.environmentId}:${onlineDevice.device.device_hash} disconnected`,
            DeviceEventsService.name,
        );

        onlineDevice.subject.complete();
        this.onlineDevicesRepository.remove(onlineDevice.device.id);
    }

    public checkUpdates(id?: number) {
        const devices = id
            ? [this.onlineDevicesRepository.get(id)]
            : this.onlineDevicesRepository.allFromEnvironment();

        this.sendMessages(devices, {
            action: "check-updates",
        });

        return true;
    }

    public restart(id?: number) {
        const devices = id
            ? [this.onlineDevicesRepository.get(id)]
            : this.onlineDevicesRepository.allFromEnvironment();

        this.sendMessages(devices, {
            action: "restart",
        });

        return true;
    }

    public requestLogs(id?: number) {
        const devices = id
            ? [this.onlineDevicesRepository.get(id)]
            : this.onlineDevicesRepository.allFromEnvironment();

        const uuid = randomUUID();

        this.sendMessages(devices, {
            action: "logs",
            payload: { uuid },
        });

        return { uuid };
    }

    public receiveLogs(params: DeviceReceiveLogsParam) {
        if (!existsSync(LOGS_DIR)) {
            mkdirSync(LOGS_DIR, { recursive: true });
        }

        const logFilePath = join(LOGS_DIR, `${params.uuid}.log`);

        writeFileSync(logFilePath, params.logs);
    }

    public downloadLogs(device_id: number, uuid: UUID, res: Response) {
        const logFilePath = join(LOGS_DIR, `${uuid}.log`);

        if (!existsSync(logFilePath)) {
            throw new HttpException("Log not found", HttpStatus.NOT_FOUND);
        }

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${uuid}.log"`,
        );
        res.setHeader("Content-Type", "text/plain");

        res.sendFile(logFilePath, (err) => {
            if (err) {
                console.error("Failed to send file:", err);
            } else {
                unlinkSync(logFilePath);
            }
        });
    }

    private sendMessages(devices: OnlineDevice[], message: SubjectMessage) {
        for (const device of devices) {
            device.subject.next(message);
        }
    }

    private async upsertSubscribedDevice(
        id: number,
        environmentId: number,
        clientVersion: string,
    ) {
        let onlineDevice = this.onlineDevicesRepository.get(id);

        if (onlineDevice) {
            onlineDevice.clientVersion = clientVersion;

            return;
        }

        const repository =
            await this.environmentConnection.getRepository(DeviceEntity);

        const device = await repository.findOneOrFail({ where: { id } });

        onlineDevice = {
            device,
            clientVersion,
            lastLogin: new Date(),
            environmentId,
        } as OnlineDevice;

        this.onlineDevicesRepository.add(id, onlineDevice);

        Logger.log(
            `Client ${environmentId}:${device.device_hash} arriving`,
            DeviceEventsService.name,
        );

        return onlineDevice;
    }
}
