import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) { }

    generateToken(payload: any) {
        return this.jwtService.sign(payload);
    }

    validateToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (e) {
            throw new UnauthorizedException("Invalid token");
        }
    }
}
