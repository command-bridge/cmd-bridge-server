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
exports.UserService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
const jwt_auth_service_1 = require("../../../common/auth/jwt-auth.service");
const user_entity_1 = require("../../../common/entities/admin/user.entity");
const hash_password_helper_1 = require("../../../common/helpers/hash-password.helper");
const jwt_token_type_enum_1 = require("../../../common/auth/jwt-token-type.enum");
let UserService = class UserService {
    constructor(jwtService, userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }
    async login(userLoginDto) {
        const { user_name, password } = userLoginDto;
        console.log(await (0, hash_password_helper_1.hashPassword)(password));
        const user = await this.userRepository.findOne({
            select: ["password", "environment_id"],
            where: { user_name },
        });
        if (!user || !(await (0, hash_password_helper_1.comparePassword)(password, user.password))) {
            throw new common_1.UnauthorizedException("Invalid username or password");
        }
        return {
            token: this.jwtService.generateToken({
                id: user.id,
                environment_id: user.environment_id,
                type: jwt_token_type_enum_1.JwtTokenType.User,
            }),
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [jwt_auth_service_1.JwtAuthService,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map