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
import { DeviceEventsActionSerivce } from "./device-events-actions.service";
import { DeviceEventsPendingMessagesService } from "./device-events-pending-messages.service";
import { UUID } from "crypto";

export interface IPackageMethodResponse {
    success: boolean;
    error?: string;
    response?: any;
    uuid: UUID;
}

@Controller("device-events")
export class DeviceEventsController {
    constructor(
        private readonly deviceEventsService: DeviceEventsService,
        private readonly deviceEventsActionService: DeviceEventsActionSerivce,
        private readonly pendingMessagesService: DeviceEventsPendingMessagesService,
    ) {}

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

    @Post("on-ready")
    public onReady(@Req() req) {
        return this.deviceEventsActionService.onReady(req);
    }

    @Post("response")
    handleResponse(@Body() packageResponse: IPackageMethodResponse) {
        if (this.pendingMessagesService.hasPendingMessage(packageResponse)) {
            this.pendingMessagesService.resolvePendingMessage(packageResponse);
        } else {
            console.warn(
                `No pending message found for id: ${packageResponse.uuid}`,
            );
        }
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
