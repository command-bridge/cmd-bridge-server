import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtTokenPayloadDto } from "./jwt-token-payload.dto";

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) { }

    generateToken(payload: JwtTokenPayloadDto) {
        return this.jwtService.sign(payload);
    }

    validateToken(token: string) {
        try {
            return this.jwtService.verify<JwtTokenPayloadDto>(token);
        } catch (e) {
            throw new UnauthorizedException("Invalid token");
        }
    }
}
