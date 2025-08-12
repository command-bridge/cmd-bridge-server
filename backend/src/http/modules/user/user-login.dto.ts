import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";

export class UserLoginDto {
    @IsNotEmpty()
    @IsString()
    user_name: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsBoolean()
    keepConnected?: boolean; // Request refresh token for "keep connected" feature
}
