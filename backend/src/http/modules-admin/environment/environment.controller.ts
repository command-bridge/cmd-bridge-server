import { AdminGuard } from "@http/core/auth/admin.guard";
import { JwtAuthGuard } from "@http/core/auth/jwt-auth.guard";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { EnvironmentService } from "./environment.service";

@Controller("admin/environment")
@UseGuards(JwtAuthGuard, AdminGuard)
export class EnvironmentController {
    constructor(private readonly environmentService: EnvironmentService) {}

    @Get()
    public getAll() {
        return this.environmentService.getAll();
    }
}
