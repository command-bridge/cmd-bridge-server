import { JwtTokenType } from "./jwt-token-type.enum";

export class JwtTokenPayloadDto {
    id: number;
    environment_id: number;
    type: JwtTokenType;
}