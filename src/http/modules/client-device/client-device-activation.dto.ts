import { IsString, Length, IsNumberString } from "class-validator";

export class ClientActivationDto {
    @IsNumberString()
    @Length(6)
    activationCode: string;

    @IsString()
    device_hash: string;
}
