import { JwtTokenType } from "./jwt-token-type.enum";

export class JwtTokenPayloadDto {
    id: number;
    type: JwtTokenType;
}
