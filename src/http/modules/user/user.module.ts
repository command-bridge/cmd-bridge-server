import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserEntity } from "@common/entities/user.entity";
import { JwtAuthModule } from "@common/auth/jwt.module";

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [JwtAuthModule, TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
