import { Module } from "@nestjs/common";
import { ClientDeviceController } from "./client-device.controller";
import { ClientDeviceService } from "./client-device.service";
import { JwtAuthModule } from "../../../common/auth/jwt.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientEntity } from "src/common/entities/client.entity";

@Module({
    controllers: [ClientDeviceController],
    providers: [ClientDeviceService],
    imports: [JwtAuthModule, TypeOrmModule.forFeature([ClientEntity])],
})
export class ClientDeviceModule {}
