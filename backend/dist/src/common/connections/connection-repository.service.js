"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionRepositoryService = void 0;
exports.InjectEnvironmentRepository = InjectEnvironmentRepository;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const entities_1 = require("../entities");
const connection_manager_service_1 = require("./connection-manager.service");
const connection_config_service_1 = require("./connection-config.service");
function InjectEnvironmentRepository(entity) {
    const token = `ENVIRONMENT_REPOSITORY_${entity.name}`;
    return (0, common_1.Inject)(token);
}
let ConnectionRepositoryService = class ConnectionRepositoryService {
    constructor(request, connectionManager, connectionConfigsService) {
        this.request = request;
        this.connectionManager = connectionManager;
        this.connectionConfigsService = connectionConfigsService;
    }
    async getRepository(entity, environment_id) {
        const environmentId = environment_id || this.getEnvironmentIdFromRequest();
        const config = await this.getEnvironmentDbConfig(environmentId);
        const connection = await this.connectionManager.getConnection(config);
        return connection.getRepository(entity);
    }
    getEnvironmentIdFromRequest() {
        const tokenPayload = this.request.payload;
        if (!tokenPayload || !tokenPayload.environment_id) {
            throw new Error("Environment ID not found in request");
        }
        return tokenPayload.environment_id;
    }
    async getEnvironmentDbConfig(environmentId) {
        const { db_host, db_password, db_port, db_type, db_user, db_database } = await this.connectionConfigsService.get(environmentId);
        return {
            type: db_type,
            host: db_host,
            port: db_port,
            username: db_user,
            password: db_password,
            database: db_database,
            entities: [...entities_1.ENVIRONMENT_ENTITIES, ...entities_1.ENVIRONMENT_MEMORY_ENTITIES],
            synchronize: true,
        };
    }
};
exports.ConnectionRepositoryService = ConnectionRepositoryService;
exports.ConnectionRepositoryService = ConnectionRepositoryService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, connection_manager_service_1.ConnectionManagerService,
        connection_config_service_1.ConnectionConfigService])
], ConnectionRepositoryService);
//# sourceMappingURL=connection-repository.service.js.map