import { Module } from "@nestjs/common";
import { DevicePackagesController } from "./device-packages.controller";
import { DevicePackagesService } from "./device-packages.service";
import { PackagesManagerService } from "./packages-manager.service";

@Module({
    providers: [DevicePackagesService, PackagesManagerService],
    controllers: [DevicePackagesController],
})
export class DevicePackagesModule {}
