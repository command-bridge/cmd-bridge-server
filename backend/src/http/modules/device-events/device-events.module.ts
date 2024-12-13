import { Module } from "@nestjs/common";
import { DeviceEventsController } from "./device-events.controller";
import { DeviceEventsService } from "./device-events.service";
import { ConnectionsModule } from "@common/connections/connections.module";
import { EnvironmentMemoryModule } from "@common/shared-memory/environment-memory/environment-memory.module";
import { DeviceEventsPendingMessagesService } from "./device-events-pending-messages.service";
import { DeviceEventsActionSerivce } from "./device-events-actions.service";
import { DeviceEventsHeartbeatService } from "./device-events-heartbeat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvironmentEntity } from "@common/entities/admin/environment.entity";

@Module({
    providers: [
        DeviceEventsService,
        DeviceEventsPendingMessagesService,
        DeviceEventsActionSerivce,
        DeviceEventsHeartbeatService,
    ],
    controllers: [DeviceEventsController],
    imports: [
        EnvironmentMemoryModule,
        ConnectionsModule,
        TypeOrmModule.forFeature([EnvironmentEntity]),
    ],
    exports: [DeviceEventsPendingMessagesService],
})
export class DeviceEventsModule {}
