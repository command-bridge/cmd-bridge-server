import { Module } from "@nestjs/common";
import { DeviceEventsController } from "./device-events.controller";
import { DeviceEventsService } from "./device-events.service";
import { ConnectionsModule } from "@common/connections/connections.module";
import { EnvironmentMemoryModule } from "@common/shared-memory/environment-memory/environment-memory.module";

@Module({
    providers: [DeviceEventsService],
    controllers: [DeviceEventsController],
    imports: [EnvironmentMemoryModule, ConnectionsModule],
})
export class DeviceEventsModule {}
