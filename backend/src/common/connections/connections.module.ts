import { Module } from "@nestjs/common";
import { ConnectionManagerService } from "./connection-manager.service";
import { ConnectionRepositoryService } from "./connection-repository.service";
import { ConnectionConfigService } from "./connection-config.service";
import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    providers: [
        ConnectionManagerService,
        ConnectionRepositoryService,
        ConnectionConfigService,
    ],
    imports: [TypeOrmModule.forFeature([EnvironmentEntity])],
    exports: [ConnectionRepositoryService, ConnectionManagerService],
})
export class ConnectionsModule {}
