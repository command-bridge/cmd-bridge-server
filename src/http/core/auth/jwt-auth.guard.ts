import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthService } from "../../../common/auth/jwt-auth.service";
import { Request } from "express";
import { JwtTokenPayloadDto } from "src/common/auth/jwt-token-payload.dto";

export type RequestWithPayload = Request & { payload: JwtTokenPayloadDto };

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(private readonly jwtAuthService: JwtAuthService) {
        super();
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<RequestWithPayload>();
        const authHeader = request.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            throw new UnauthorizedException("Missing token");
        }

        const payload = this.jwtAuthService.validateToken(token);
        request.payload = payload;

        return true;
    }
}
