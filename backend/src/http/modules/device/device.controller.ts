import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { DeviceActivationDto, DeviceLoginDto } from "./device.dto";
import { DeviceService } from "./device.service";
import { UserGuard } from "@http/core/auth/user-guard";
import { DeviceIdParam } from "../device-events/device-events.dto";

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
    @UseGuards(UserGuard)
    public create() {
        return this.deviceService.create();
    }

    @Get()
    @UseGuards(UserGuard)
    public getAll() {
        return this.deviceService.getAll();
    }

    @Get("/:device_id")
    @UseGuards(UserGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    public getOne(@Param() param: DeviceIdParam) {
        return this.deviceService.getOne(param.device_id);
    }
}
