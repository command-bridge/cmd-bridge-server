import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

export class PackageItemDto {
    @IsString()
    name: string;

    @IsString()
    version: string;
}

export class DeviceKnownPackagesDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PackageItemDto)
    packages: PackageItemDto[];
}
