import { IsNumberString, IsString, IsUUID, MinLength } from "class-validator";
import { UUID } from "crypto";

export class DeviceSubscribeDto {
    @IsString()
    @MinLength(5)
    version: string;
}

export class DeviceIdParam {
    @IsNumberString()
    device_id: number;
}

export class DeviceLogDownloadParam {
    @IsUUID()
    uuid: UUID;
}

export class DeviceReceiveLogsParam {
    @IsUUID()
    uuid: string;

    @IsString()
    logs: string;
}
