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
exports.ConnectionConfigService = void 0;
const environment_entity_1 = require("../entities/admin/environment.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ConnectionConfigService = class ConnectionConfigService {
    constructor(environmentRepository) {
        this.environmentRepository = environmentRepository;
        this.configs = new Map();
    }
    async get(environment_id) {
        if (this.configs.has(environment_id)) {
            return this.configs.get(environment_id);
        }
        const configs = await this.environmentRepository.findOneByOrFail({
            id: environment_id,
        });
        this.configs.set(environment_id, configs);
        return configs;
    }
};
exports.ConnectionConfigService = ConnectionConfigService;
exports.ConnectionConfigService = ConnectionConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(environment_entity_1.EnvironmentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConnectionConfigService);
//# sourceMappingURL=connection-config.service.js.map