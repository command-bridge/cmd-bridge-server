import { InjectRepository } from "@nestjs/typeorm";
import { UserLoginDto } from "./user-login.dto";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";
import { JwtAuthService } from "@common/auth/jwt-auth.service";
import { UserEntity } from "@common/entities/admin/user.entity";
import { comparePassword } from "@common/helpers/hash-password.helper";
import { JwtTokenType } from "@common/auth/jwt-token-type.enum";

export class UserService {
    constructor(
        private readonly jwtService: JwtAuthService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    public async login(userLoginDto: UserLoginDto) {
        const { user_name, password, keepConnected } = userLoginDto;

        const user = await this.userRepository.findOne({
            select: ["id", "password", "environment_id", "is_admin"],
            where: { user_name },
        });

        if (!user || !(await comparePassword(password, user.password))) {
            throw new UnauthorizedException("Invalid username or password");
        }

        const payload = {
            id: user.id,
            environment_id: user.environment_id,
            is_admin: user.is_admin,
        };

        // If keepConnected is requested, provide refresh token
        if (keepConnected) {
            const { accessToken, refreshToken } = this.jwtService.generateTokenPair(payload);
            return {
                token: accessToken,
                refreshToken,
            };
        } else {
            // Regular login - just access token (12h, compatible with Electron)
            const token = this.jwtService.generateToken({
                ...payload,
                type: JwtTokenType.User,
            });
            return { token };
        }
    }

    public async refreshToken(refreshToken: string) {
        try {
            const decoded = this.jwtService.validateToken(refreshToken);
            
            if (decoded.type !== "refresh") {
                throw new UnauthorizedException("Invalid refresh token");
            }

            // Get fresh user data
            const user = await this.userRepository.findOne({
                select: ["id", "environment_id", "is_admin"],
                where: { id: decoded.id },
            });

            if (!user) {
                throw new UnauthorizedException("User not found");
            }

            const newAccessToken = this.jwtService.refreshAccessToken(refreshToken, {
                id: user.id,
                environment_id: user.environment_id,
                is_admin: user.is_admin,
            });

            return { token: newAccessToken };
        } catch {
            throw new UnauthorizedException("Invalid refresh token");
        }
    }
}
