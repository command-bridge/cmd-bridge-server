import { Module } from "@nestjs/common";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";
import { SharedMemoryModule } from "@common/shared-memory/shared-memory.module";
import { ConnectionsModule } from "@common/connections/connections.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { EnvironmentMemoryModule } from "@common/shared-memory/environment-memory/environment-memory.module";

@Module({
    controllers: [DeviceController],
    providers: [DeviceService],
    imports: [
        SharedMemoryModule,
        EnvironmentMemoryModule,
        TypeOrmModule.forFeature([EnvironmentEntity]),
        ConnectionsModule,
    ],
})
export class DeviceModule {}
