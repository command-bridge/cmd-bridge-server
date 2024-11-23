import { UserLoginDto } from "./user-login.dto";
import { Repository } from "typeorm";
import { JwtAuthService } from "@common/auth/jwt-auth.service";
import { UserEntity } from "@common/entities/admin/user.entity";
export declare class UserService {
    private readonly jwtService;
    private userRepository;
    constructor(jwtService: JwtAuthService, userRepository: Repository<UserEntity>);
    login(userLoginDto: UserLoginDto): Promise<{
        token: string;
    }>;
}
