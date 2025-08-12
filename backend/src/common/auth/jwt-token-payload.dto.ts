import { JwtTokenType } from "./jwt-token-type.enum";

export class JwtTokenPayloadDto {
    id: number;
    environment_id?: number;
    is_admin: boolean;
    type: JwtTokenType;
    tokenVersion?: number; // For refresh token invalidation
}
