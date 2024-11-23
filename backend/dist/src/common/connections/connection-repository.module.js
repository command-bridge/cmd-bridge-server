"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ConnectionRepositoryModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionRepositoryModule = void 0;
const common_1 = require("@nestjs/common");
const connection_repository_service_1 = require("./connection-repository.service");
let ConnectionRepositoryModule = ConnectionRepositoryModule_1 = class ConnectionRepositoryModule {
    static forEntity(entity) {
        const token = `ENVIRONMENT_REPOSITORY_${entity.name}`;
        const provider = {
            provide: token,
            useFactory: async (connectionRepositoryService) => {
                return await connectionRepositoryService.getRepository(entity);
            },
            inject: [connection_repository_service_1.ConnectionRepositoryService],
        };
        return {
            module: ConnectionRepositoryModule_1,
            providers: [provider],
            exports: [provider],
        };
    }
};
exports.ConnectionRepositoryModule = ConnectionRepositoryModule;
exports.ConnectionRepositoryModule = ConnectionRepositoryModule = ConnectionRepositoryModule_1 = __decorate([
    (0, common_1.Module)({})
], ConnectionRepositoryModule);
//# sourceMappingURL=connection-repository.module.js.map