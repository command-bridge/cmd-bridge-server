import {
    Body,
    Controller,
    Param,
    Post,
    Req,
    Sse,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { DeviceEventsService } from "./device-events.service";
import { UserGuard } from "@http/core/auth/user-guard";
import { DeviceIdParam, DeviceSubscribeDto } from "./device-events.dto";
import { RequestWithPayload } from "@common/auth/jwt-auth.middlewere";
import { DeviceGuard } from "@http/core/auth/device.guard";

@Controller("device-events")
export class DeviceEventsController {
    constructor(private readonly deviceEventsService: DeviceEventsService) {}

    @UseGuards(DeviceGuard)
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    public subscribe(
        @Body() deviceSubscribeDto: DeviceSubscribeDto,
        @Req() req: RequestWithPayload,
    ) {
        return this.deviceEventsService.subscribe(deviceSubscribeDto, req);
    }

    @Sse("stream")
    @UseGuards(DeviceGuard)
    public devicesPool(@Req() req) {
        return this.deviceEventsService.waitForMessage(req);
    }

    @UseGuards(UserGuard)
    @Post("/:device_id/check-updates")
    @UsePipes(new ValidationPipe({ transform: true }))
    public checkUpdates(@Param() param: DeviceIdParam) {
        return this.deviceEventsService.checkUpdates(param.device_id);
    }

    @UseGuards(UserGuard)
    @Post("/:device_id/restart")
    @UsePipes(new ValidationPipe({ transform: true }))
    public restart(@Param() param: DeviceIdParam) {
        return this.deviceEventsService.restart(param.device_id);
    }
}
