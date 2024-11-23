"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./http/modules/user/user.module");
const entities_1 = require("./common/entities");
const jwt_module_1 = require("./common/auth/jwt.module");
const device_module_1 = require("./http/modules/device/device.module");
const shared_memory_module_1 = require("./common/shared-memory/shared-memory.module");
const connections_module_1 = require("./common/connections/connections.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: "mysql",
                host: process.env.DB_HOST || "localhost",
                port: Number(process.env.DB_PORT) || 3306,
                username: process.env.DB_USERNAME || "root",
                password: process.env.DB_PASSWORD || "password",
                database: process.env.DB_NAME || "your_database",
                entities: [...entities_1.ADMIN_ENTITIES, ...entities_1.ADMIN_MEMORY_ENTITIES],
                synchronize: true,
            }),
            connections_module_1.ConnectionsModule,
            jwt_module_1.JwtAuthModule,
            shared_memory_module_1.SharedMemoryModule,
            device_module_1.DeviceModule,
            user_module_1.UserModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map