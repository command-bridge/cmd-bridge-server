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
exports.MemoryDeviceActivationRepository = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const memory_device_activation_entity_1 = require("../../entities/admin/memory-device-activation.entity");
const random_string_helper_1 = require("../../helpers/random-string.helper");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let MemoryDeviceActivationRepository = class MemoryDeviceActivationRepository {
    constructor(request, memoryDeviceActivationRepository) {
        this.request = request;
        this.memoryDeviceActivationRepository = memoryDeviceActivationRepository;
    }
    create() {
        const activation_code = (0, random_string_helper_1.randomString)(6, {
            lowerCase: false,
            upperCase: false,
            numbers: true,
            specialCharacters: false,
        });
        return this.memoryDeviceActivationRepository.save({
            activation_code,
            environment_id: this.request.payload.environment_id,
            expires_in: new Date(Date.now() + 15 * 60 * 1000),
        });
    }
    async validate(activation_code) {
        const params = { where: { activation_code } };
        const found = await this.memoryDeviceActivationRepository.findOne(params);
        if (!found) {
            return null;
        }
        await this.memoryDeviceActivationRepository.remove(found);
        return found;
    }
};
exports.MemoryDeviceActivationRepository = MemoryDeviceActivationRepository;
exports.MemoryDeviceActivationRepository = MemoryDeviceActivationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(memory_device_activation_entity_1.MemoryDeviceActivation)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository])
], MemoryDeviceActivationRepository);
//# sourceMappingURL=device-activation.repostiory.js.map