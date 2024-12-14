import { AdminGuard } from "@http/core/auth/admin.guard";
import { UserGuard } from "@http/core/auth/user-guard";
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { EnvironmentService } from "./environment.service";
import { EnvironmentCreateDto, EnvironmentUseDto } from "./environment.dto";
import { RequestWithPayload } from "@common/auth/jwt-auth.middlewere";

@Controller("admin/environment")
@UseGuards(UserGuard, AdminGuard)
export class EnvironmentController {
    constructor(private readonly environmentService: EnvironmentService) {}

    @Get()
    public getAll() {
        return this.environmentService.getAll();
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    public upsert(@Body() environment: EnvironmentCreateDto) {
        return this.environmentService.upsert(environment);
    }

    @Get("/:environment_id/use")
    @UsePipes(new ValidationPipe({ transform: true }))
    public useEnvironment(
        @Param() { environment_id }: EnvironmentUseDto,
        @Req() req: RequestWithPayload,
    ) {
        return this.environmentService.use(environment_id, req);
    }
}
