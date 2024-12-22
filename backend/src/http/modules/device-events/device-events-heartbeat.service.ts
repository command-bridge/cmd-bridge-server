import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { OnlineDevicesRepository } from "@common/shared-memory/environment-memory/repositories/online-devices.memory";
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeviceEventsEmitters } from "./device-events-emitters.enum";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class DeviceEventsHeartbeatService {
    constructor(
        @InjectRepository(EnvironmentEntity)
        private readonly environmentRepository: Repository<EnvironmentEntity>,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @Cron("*/15 * * * * *")
    public async heartbeatEvent() {
        const environments = await this.environmentRepository.find({
            select: ["id"],
        });

        for (const { id } of environments) {
            this.heartbeatEnvironmentDevices(id);
        }
    }

    private async heartbeatEnvironmentDevices(environment_id: number) {
        const onlineDevicesRepository =
            OnlineDevicesRepository.getInstance(environment_id);

        const devices = onlineDevicesRepository.all();

        if (!devices.length) {
            return;
        }

        for (const device of devices) {
            const timestamp = new Date().toISOString();

            if (!device.subject) {
                Logger.warn(
                    `Device ${device.environmentId}:${device.device.device_hash} connection not ready (subject is empty)`,
                );
                continue;
            }

            device.subject.next({
                action: "heartbeat",
                payload: { timestamp },
            });

            this.eventEmitter.emit(DeviceEventsEmitters.Heartbeat, device);
        }
    }
}
