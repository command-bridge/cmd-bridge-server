import { IsString, Length, IsNotEmpty } from "class-validator";

export class UserLoginDto {
    @IsString()
    @IsNotEmpty({ message: "Username must not be empty" })
    @Length(3, 50, { message: "Username must be between 3 and 50 characters" })
    user_name: string;

    @IsString()
    @Length(8, 100, {
        message: "Password must be between 8 and 100 characters",
    })
    password: string;
}
