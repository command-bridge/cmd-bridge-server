import { Module } from "@nestjs/common";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceEntity } from "@common/entities/device.entity";
import { JwtAuthModule } from "@common/auth/jwt.module";
import { SharedMemoryModule } from "@common/shared-memory/shared-memory.module";

@Module({
    controllers: [DeviceController],
    providers: [DeviceService],
    imports: [
        JwtAuthModule,
        TypeOrmModule.forFeature([DeviceEntity]),
        SharedMemoryModule,
    ],
})
export class DeviceModule {}
