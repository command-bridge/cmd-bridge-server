import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "@http/modules/user/user.module";
import { ENTITIES } from "@common/entities";
import { JwtAuthModule } from "@common/auth/jwt.module";
import { DeviceModule } from "@http/modules/device/device.module";
import { SharedMemoryModule } from "@common/shared-memory/shared-memory.module";
import { MEMORY_ENTITIES } from "@common/shared-memory/memory-entities";

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
            entities: [...ENTITIES, ...MEMORY_ENTITIES],
            synchronize: true, // Use cautiously in production
        }),
        JwtAuthModule,
        SharedMemoryModule,
        DeviceModule,
        UserModule,
    ],
})
export class AppModule {}
