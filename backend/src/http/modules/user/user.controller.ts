import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { UserLoginDto } from "./user-login.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("login")
    @UsePipes(new ValidationPipe({ transform: true }))
    public login(@Body() userLoginDto: UserLoginDto) {
        return this.userService.login(userLoginDto);
    }
}
