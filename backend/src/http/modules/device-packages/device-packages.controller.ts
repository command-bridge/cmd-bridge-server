import { DeviceGuard } from "@http/core/auth/device.guard";
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { DeviceKnownPackagesDto } from "./device-packages.dto";
import { DevicePackagesService } from "./device-packages.service";
import { Response } from "express";
import { DownloadType } from "./device-package.type";

@Controller("device-packages")
@UseGuards(DeviceGuard)
export class DevicePackagesController {
    constructor(
        private readonly devicePackagesService: DevicePackagesService,
    ) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    public getUpdates(@Body() devicePackages: DeviceKnownPackagesDto) {
        return this.devicePackagesService.getUpdates(devicePackages);
    }

    @Get(":name/:downloadType")
    async downloadPackage(
        @Param("name") name: string,
        @Param("downloadType") downloadType: DownloadType,
        @Res() res: Response,
    ) {
        this.devicePackagesService.manageDownload(name, downloadType, res);
    }
}
