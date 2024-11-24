import { Module } from "@nestjs/common";
import { ConfigurationController } from "./configuration.controller";
import { ConfigurationService } from "./configuration.service";
import { ConnectionManagerService } from "@common/connections/connection-manager.service";

@Module({
    controllers: [ConfigurationController],
    providers: [ConfigurationService, ConnectionManagerService],
})
export class ConfigurationModule {}
