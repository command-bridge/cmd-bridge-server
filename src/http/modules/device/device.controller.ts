import {
    Body,
    Controller,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { DeviceActivationDto, DeviceLoginDto } from "./device.dto";
import { DeviceService } from "./device.service";
import { JwtAuthGuard } from "@http/core/auth/jwt-auth.guard";

@Controller("device")
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {}

    @Post("login")
    @UsePipes(new ValidationPipe({ transform: true }))
    public login(@Body() deviceLoginDto: DeviceLoginDto) {
        return this.deviceService.login(deviceLoginDto);
    }

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
