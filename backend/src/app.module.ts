import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "@http/modules/user/user.module";
import { ADMIN_ENTITIES, ADMIN_MEMORY_ENTITIES } from "@common/entities";
import { JwtAuthModule } from "@common/auth/jwt.module";
import { DeviceModule } from "@http/modules/device/device.module";
import { SharedMemoryModule } from "@common/shared-memory/shared-memory.module";
import { ConnectionsModule } from "@common/connections/connections.module";
import { EnvironmentModule } from "@http/modules-admin/environment/environment.module";

@Module({
    imports: [
        ConfigModule.forRoot(), // Load environment variables
        TypeOrmModule.forRoot({
            type: (process.env.DB_TYPE as any) || "mysql",
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 3306,
            username: process.env.DB_USERNAME || "root",
            password: process.env.DB_PASSWORD || "password",
            database: process.env.DB_NAME || "your_database",
            entities: [...ADMIN_ENTITIES, ...ADMIN_MEMORY_ENTITIES],
            synchronize: true, // Use cautiously in production
        }),
        ConnectionsModule,
        JwtAuthModule,
        SharedMemoryModule,
        DeviceModule,
        UserModule,
        EnvironmentModule,
    ],
})
export class AppModule {}
