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
exports.DeviceService = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_service_1 = require("../../../common/auth/jwt-auth.service");
const device_activation_repostiory_1 = require("../../../common/shared-memory/memory-repositories/device-activation.repostiory");
const device_entity_1 = require("../../../common/entities/environment/device.entity");
const connection_repository_service_1 = require("../../../common/connections/connection-repository.service");
const generate_integration_token_helper_1 = require("../../../common/helpers/generate-integration-token.helper");
const hash_string_helper_1 = require("../../../common/helpers/hash-string.helper");
const typeorm_1 = require("typeorm");
const environment_entity_1 = require("../../../common/entities/admin/environment.entity");
const typeorm_2 = require("@nestjs/typeorm");
const jwt_token_type_enum_1 = require("../../../common/auth/jwt-token-type.enum");
let DeviceService = class DeviceService {
    constructor(connectionRepositoryService, memoryActivationRepository, environmentRepository, jwtAuthService) {
        this.connectionRepositoryService = connectionRepositoryService;
        this.memoryActivationRepository = memoryActivationRepository;
        this.environmentRepository = environmentRepository;
        this.jwtAuthService = jwtAuthService;
    }
    async activate(deviceActivationDto) {
        const memoryDeviceActivation = await this.memoryActivationRepository.validate(deviceActivationDto.activation_code);
        if (!memoryDeviceActivation) {
            throw new common_1.BadRequestException("Activation token is invalid");
        }
        const { environment_id } = memoryDeviceActivation;
        const deviceRepository = await this.connectionRepositoryService.getRepository(device_entity_1.DeviceEntity, environment_id);
        const token = (0, generate_integration_token_helper_1.generateIntegrationToken)();
        const device = {
            device_hash: deviceActivationDto.device_hash,
            integration_token: token.hash,
        };
        await deviceRepository.save(device);
        return {
            integration_token: token.integration_token,
            environment: (0, hash_string_helper_1.hashString)(environment_id.toString()),
        };
    }
    create() {
        return this.memoryActivationRepository.create();
    }
    async login(deviceLoginDto) {
        const { environment: hashed_id, device_hash, integration_token, } = deviceLoginDto;
        const environment = await this.environmentRepository.findOneByOrFail({
            hashed_id,
        });
        const deviceRepository = await this.connectionRepositoryService.getRepository(device_entity_1.DeviceEntity, environment.id);
        const device = await deviceRepository.findOneByOrFail({
            device_hash,
            integration_token: (0, hash_string_helper_1.hashString)(integration_token),
        });
        return {
            token: this.jwtAuthService.generateToken({
                environment_id: environment.id,
                id: device.id,
                type: jwt_token_type_enum_1.JwtTokenType.Device,
            }),
        };
    }
};
exports.DeviceService = DeviceService;
exports.DeviceService = DeviceService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_2.InjectRepository)(environment_entity_1.EnvironmentEntity)),
    __metadata("design:paramtypes", [connection_repository_service_1.ConnectionRepositoryService,
        device_activation_repostiory_1.MemoryDeviceActivationRepository,
        typeorm_1.Repository,
        jwt_auth_service_1.JwtAuthService])
], DeviceService);
//# sourceMappingURL=device.service.js.map