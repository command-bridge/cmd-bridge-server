import { RequestWithPayload } from "@common/auth/jwt-auth.middlewere";
import {
    OnlineDevice,
    OnlineDevicesRepository,
} from "@common/shared-memory/environment-memory/repositories/online-devices.memory";
import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DeviceEventsEmitters } from "./device-events-emitters.enum";

@Injectable()
export class DeviceEventsActionSerivce {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly onlineDevicesRepository: OnlineDevicesRepository,
    ) {}

    public onReady(req: RequestWithPayload) {
        const onlineDevice = this.onlineDevicesRepository.get(req.payload.id);

        Logger.log(
            `Client ${onlineDevice.environmentId}:${onlineDevice.device.device_hash} is ready.`,
            DeviceEventsActionSerivce.name,
        );
        this.eventEmitter.emit(DeviceEventsEmitters.Ready, onlineDevice);
    }

    public onConnected(onlineDevice: OnlineDevice) {
        Logger.log(
            `Client ${onlineDevice.environmentId}:${onlineDevice.device.device_hash} connected (${onlineDevice.clientVersion})`,
            DeviceEventsActionSerivce.name,
        );

        this.eventEmitter.emit(DeviceEventsEmitters.Connected, onlineDevice);
    }
}
