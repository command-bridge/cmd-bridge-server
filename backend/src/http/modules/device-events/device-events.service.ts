import { ConnectionRepositoryService } from "@common/connections/connection-repository.service";
import { DeviceEntity } from "@common/entities/environment/device.entity";
import {
    OnlineDevice,
    OnlineDevicesRepository,
    SubjectMessage,
} from "@common/shared-memory/environment-memory/repositories/online-devices.memory";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { DeviceSubscribeDto } from "./device-events.dto";
import { map, Subject } from "rxjs";
import { RequestWithPayload } from "@common/auth/jwt-auth.middlewere";

@Injectable()
export class DeviceEventsService {
    constructor(
        private readonly onlineDevicesRepository: OnlineDevicesRepository,
        private readonly environmentConnection: ConnectionRepositoryService,
    ) {}

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
            throw new BadRequestException("Unauthorized access");
        }

        onlineDevice.subject = new Subject<SubjectMessage>();

        req.on("close", () => {
            Logger.log(
                `Client ${onlineDevice.environmentId}:${onlineDevice.device.device_hash} disconnected`,
                DeviceEventsService.name,
            );

            onlineDevice.subject.complete();
            this.onlineDevicesRepository.remove(onlineDevice.device.id);
        });

        Logger.log(
            `Client ${onlineDevice.environmentId}:${onlineDevice.device.device_hash} connected (${onlineDevice.clientVersion})`,
            DeviceEventsService.name,
        );

        setTimeout(() => {
            onlineDevice.subject.next({
                action: "send-packages",
            });
        }, 50);

        return onlineDevice.subject
            .asObservable()
            .pipe(map((message) => ({ data: message })));
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
