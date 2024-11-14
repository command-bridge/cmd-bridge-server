import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { ClientActivationDto } from "./client-device-activation.dto";
import { ClientDeviceService } from "./client-device.service";

@Controller("client-device")
export class ClientDeviceController {
    constructor(
        private readonly clientActivationService: ClientDeviceService,
    ) {}

    @Post("activate")
    @UsePipes(new ValidationPipe({ transform: true }))
    public activate(@Body() clientActivationDto: ClientActivationDto) {
        return this.clientActivationService.deviceActivation(
            clientActivationDto,
        );
    }
}
