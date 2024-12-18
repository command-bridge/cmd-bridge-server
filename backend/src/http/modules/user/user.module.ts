import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserEntity } from "@common/entities/admin/user.entity";

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
