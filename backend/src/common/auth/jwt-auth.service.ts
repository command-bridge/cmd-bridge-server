import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtTokenPayloadDto } from "./jwt-token-payload.dto";
import { JwtTokenType } from "./jwt-token-type.enum";

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateToken(payload: JwtTokenPayloadDto) {
        return this.jwtService.sign(payload);
    }

    generateTokenPair(payload: Omit<JwtTokenPayloadDto, 'type'>) {
        // Access token (uses default module configuration)
        const accessToken = this.jwtService.sign(
            { ...payload, type: payload.id ? JwtTokenType.User : JwtTokenType.Device }
        );

        // Refresh token (long-lived: 30 days for web "keep connected")
        const refreshToken = this.jwtService.sign(
            { 
                id: payload.id, 
                type: JwtTokenType.RefreshToken,
                tokenVersion: Date.now() // Simple version for invalidation
            },
            { expiresIn: '30d' }
        );

        return { accessToken, refreshToken };
    }

    refreshAccessToken(refreshToken: string, userPayload: Omit<JwtTokenPayloadDto, 'type'>) {
        try {
            const decoded = this.jwtService.verify<JwtTokenPayloadDto>(refreshToken);
            
            if (decoded.type !== JwtTokenType.RefreshToken) {
                throw new UnauthorizedException("Invalid refresh token");
            }

            // Generate new access token with user data (uses default module configuration)
            return this.jwtService.sign(
                { ...userPayload, type: userPayload.id ? JwtTokenType.User : JwtTokenType.Device }
            );
        } catch {
            throw new UnauthorizedException("Invalid refresh token");
        }
    }

    validateToken(token: string) {
        try {
            return this.jwtService.verify<JwtTokenPayloadDto>(token);
        } catch {
            throw new UnauthorizedException("Invalid token");
        }
    }
}
