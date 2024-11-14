import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ClientEntity } from "./common/entities/client.entity";
import { ClientDeviceModule } from "./http/modules/client-device/client-device.module";
import { JwtAuthModule } from "./common/auth/jwt.module";

@Module({
    imports: [
        ConfigModule.forRoot(), // Load environment variables
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 3306,
            username: process.env.DB_USERNAME || "root",
            password: process.env.DB_PASSWORD || "password",
            database: process.env.DB_NAME || "your_database",
            entities: [ClientEntity],
            synchronize: true, // Use cautiously in production
        }),
        JwtAuthModule,
        ClientDeviceModule,
    ],
})
export class AppModule {}
