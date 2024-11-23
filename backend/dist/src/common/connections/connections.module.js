"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionsModule = void 0;
const common_1 = require("@nestjs/common");
const connection_manager_service_1 = require("./connection-manager.service");
const connection_repository_service_1 = require("./connection-repository.service");
const connection_config_service_1 = require("./connection-config.service");
const environment_entity_1 = require("../entities/admin/environment.entity");
const typeorm_1 = require("@nestjs/typeorm");
let ConnectionsModule = class ConnectionsModule {
};
exports.ConnectionsModule = ConnectionsModule;
exports.ConnectionsModule = ConnectionsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            connection_manager_service_1.ConnectionManagerService,
            connection_repository_service_1.ConnectionRepositoryService,
            connection_config_service_1.ConnectionConfigService,
        ],
        imports: [typeorm_1.TypeOrmModule.forFeature([environment_entity_1.EnvironmentEntity])],
        exports: [connection_repository_service_1.ConnectionRepositoryService],
    })
], ConnectionsModule);
//# sourceMappingURL=connections.module.js.map