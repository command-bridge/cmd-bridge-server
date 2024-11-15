import { IsString, Length } from "class-validator";

export class DeviceActivationDto {
    @IsString()
    @Length(6)
    activation_code: string;

    @IsString()
    device_hash: string;
}
