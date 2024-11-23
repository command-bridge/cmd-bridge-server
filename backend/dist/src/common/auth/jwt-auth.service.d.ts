import { JwtService } from "@nestjs/jwt";
import { JwtTokenPayloadDto } from "./jwt-token-payload.dto";
export declare class JwtAuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateToken(payload: JwtTokenPayloadDto): string;
    validateToken(token: string): JwtTokenPayloadDto;
}
