import { ExecutionContext } from "@nestjs/common";
import { JwtAuthService } from "../../../common/auth/jwt-auth.service";
import { Request } from "express";
import { JwtTokenPayloadDto } from "src/common/auth/jwt-token-payload.dto";
export type RequestWithPayload = Request & {
    payload: JwtTokenPayloadDto;
};
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly jwtAuthService;
    constructor(jwtAuthService: JwtAuthService);
    canActivate(context: ExecutionContext): boolean;
}
export {};
