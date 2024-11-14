import { Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { JwtAuthService } from "./jwt-auth.service";

@Module({
    imports: [
        NestJwtModule.register({
            secret: process.env.JWT_SECRET || "yourSecretKey",
            signOptions: { expiresIn: "1h" },
        }),
    ],
    providers: [JwtAuthService],
    exports: [JwtAuthService],
})
export class JwtAuthModule {}
