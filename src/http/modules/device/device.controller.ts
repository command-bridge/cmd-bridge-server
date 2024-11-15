import {
    Body,
    Controller,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { DeviceActivationDto } from "./device-activation.dto";
import { DeviceService } from "./device.service";
import { JwtAuthGuard } from "@http/core/auth/jwt-auth.guard";

@Controller("device")
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {}

    @Post("activate")
    @UsePipes(new ValidationPipe({ transform: true }))
    public activate(@Body() deviceActivationDto: DeviceActivationDto) {
        return this.deviceService.activate(deviceActivationDto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    public create() {
        return this.deviceService.create();
    }
}
