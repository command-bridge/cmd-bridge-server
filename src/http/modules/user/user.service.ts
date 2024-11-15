import { InjectRepository } from "@nestjs/typeorm";
import { UserLoginDto } from "./user-login.dto";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";
import { JwtAuthService } from "@common/auth/jwt-auth.service";
import { UserEntity } from "@common/entities/user.entity";
import {
    comparePassword,
    hashPassword,
} from "@common/helpers/hash-password.helper";
import { JwtTokenType } from "@common/auth/jwt-token-type.enum";

export class UserService {
    constructor(
        private readonly jwtService: JwtAuthService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    public async login(userLoginDto: UserLoginDto) {
        const { user_name, password } = userLoginDto;

        console.log(await hashPassword(password));

        const user = await this.userRepository.findOne({
            select: ["password"],
            where: { user_name },
        });

        if (!user || !(await comparePassword(password, user.password))) {
            throw new UnauthorizedException("Invalid username or password");
        }

        return {
            token: this.jwtService.generateToken({
                id: user.id,
                type: JwtTokenType.User,
            }),
        };
    }
}
