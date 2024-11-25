import { Module } from "@nestjs/common";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";
import { JwtAuthModule } from "@common/auth/jwt.module";
import { SharedMemoryModule } from "@common/shared-memory/shared-memory.module";
import { ConnectionsModule } from "@common/connections/connections.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvironmentEntity } from "@common/entities/admin/environment.entity";

@Module({
    controllers: [DeviceController],
    providers: [DeviceService],
    imports: [
        JwtAuthModule,
        ConnectionsModule,
        SharedMemoryModule,
        TypeOrmModule.forFeature([EnvironmentEntity]),
        ConnectionsModule,
    ],
})
export class DeviceModule {}
