import { Module } from "@nestjs/common";
import { DeviceEventsController } from "./device-events.controller";
import { DeviceEventsService } from "./device-events.service";
import { ConnectionsModule } from "@common/connections/connections.module";
import { EnvironmentMemoryModule } from "@common/shared-memory/environment-memory/environment-memory.module";
import { DeviceEventsPendingMessagesService } from "./device-events-pending-messages.service";
import { DeviceEventsActionSerivce } from "./device-events-actions.service";

@Module({
    providers: [
        DeviceEventsService,
        DeviceEventsPendingMessagesService,
        DeviceEventsActionSerivce,
    ],
    controllers: [DeviceEventsController],
    imports: [EnvironmentMemoryModule, ConnectionsModule],
    exports: [DeviceEventsPendingMessagesService],
})
export class DeviceEventsModule {}
