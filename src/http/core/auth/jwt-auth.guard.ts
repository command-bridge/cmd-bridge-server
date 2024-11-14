import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthService } from "../../../common/auth/jwt-auth.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(private readonly jwtAuthService: JwtAuthService) {
        super();
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            throw new UnauthorizedException("Missing token");
        }

        const user = this.jwtAuthService.validateToken(token);
        request.user = user;
        return true;
    }
}
