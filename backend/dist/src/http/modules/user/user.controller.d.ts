import { UserLoginDto } from "./user-login.dto";
import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    login(userLoginDto: UserLoginDto): Promise<{
        token: string;
    }>;
}
