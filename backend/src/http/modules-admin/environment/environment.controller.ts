import { AdminGuard } from "@http/core/auth/admin.guard";
import { UserGuard } from "@http/core/auth/user-guard";
import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { EnvironmentService } from "./environment.service";
import { EnvironmentCreateDto } from "./environment.dto";

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
}
