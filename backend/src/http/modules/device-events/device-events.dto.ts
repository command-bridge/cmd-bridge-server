import { IsNumberString, IsString, MinLength } from "class-validator";

export class DeviceSubscribeDto {
    @IsString()
    @MinLength(5)
    version: string;
}

export class DeviceIdParam {
    @IsNumberString()
    device_id: number;
}
