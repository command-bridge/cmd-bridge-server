import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { EnvironmentController } from "./environment.controller";
import { EnvironmentService } from "./environment.service";
import { JwtAuthModule } from "@common/auth/jwt.module";

@Module({
    controllers: [EnvironmentController],
    providers: [EnvironmentService],
    imports: [TypeOrmModule.forFeature([EnvironmentEntity]), JwtAuthModule],
})
export class EnvironmentModule {}
