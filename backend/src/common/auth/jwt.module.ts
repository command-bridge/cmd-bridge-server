import { Global, Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { JwtAuthService } from "./jwt-auth.service";

@Global()
@Module({
    imports: [
        NestJwtModule.register({
            secret: process.env.JWT_SECRET || "yourSecretKey",
            signOptions: { expiresIn: "12h" },
        }),
    ],
    providers: [JwtAuthService],
    exports: [JwtAuthService],
})
export class JwtAuthModule {}
