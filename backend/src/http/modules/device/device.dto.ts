import { IsString, Length } from "class-validator";

export class DeviceActivationDto {
    @IsString()
    @Length(6)
    activation_code: string;

    @IsString()
    device_hash: string;
}

export class DeviceLoginDto {
    @IsString()
    @Length(32)
    integration_token: string;

    @IsString()
    environment: string;

    @IsString()
    device_hash: string;
}
