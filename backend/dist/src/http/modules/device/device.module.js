"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceModule = void 0;
const common_1 = require("@nestjs/common");
const device_controller_1 = require("./device.controller");
const device_service_1 = require("./device.service");
const jwt_module_1 = require("../../../common/auth/jwt.module");
const shared_memory_module_1 = require("../../../common/shared-memory/shared-memory.module");
const connections_module_1 = require("../../../common/connections/connections.module");
const typeorm_1 = require("@nestjs/typeorm");
const environment_entity_1 = require("../../../common/entities/admin/environment.entity");
let DeviceModule = class DeviceModule {
};
exports.DeviceModule = DeviceModule;
exports.DeviceModule = DeviceModule = __decorate([
    (0, common_1.Module)({
        controllers: [device_controller_1.DeviceController],
        providers: [device_service_1.DeviceService],
        imports: [
            jwt_module_1.JwtAuthModule,
            connections_module_1.ConnectionsModule,
            shared_memory_module_1.SharedMemoryModule,
            typeorm_1.TypeOrmModule.forFeature([environment_entity_1.EnvironmentEntity]),
        ],
    })
], DeviceModule);
//# sourceMappingURL=device.module.js.map