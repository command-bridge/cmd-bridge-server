import { BadRequestException, Injectable } from "@nestjs/common";
import { DeviceActivationDto, DeviceLoginDto } from "./device.dto";
import { JwtAuthService } from "@common/auth/jwt-auth.service";
import { MemoryDeviceActivationRepository } from "@common/shared-memory/memory-repositories/device-activation.repostiory";
import { DeviceEntity } from "@common/entities/environment/device.entity";
import { ConnectionRepositoryService } from "@common/connections/connection-repository.service";
import { generateIntegrationToken } from "@common/helpers/generate-integration-token.helper";
import { hashString } from "@common/helpers/hash-string.helper";
import { Repository } from "typeorm";
import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtTokenType } from "@common/auth/jwt-token-type.enum";
import { DeviceRepository } from "./device.repository";

@Injectable()
export class DeviceService {
    constructor(
        private readonly connectionRepositoryService: ConnectionRepositoryService,
        private readonly memoryActivationRepository: MemoryDeviceActivationRepository,
        @InjectRepository(EnvironmentEntity)
        private readonly environmentRepository: Repository<EnvironmentEntity>,
        private readonly jwtAuthService: JwtAuthService,
        private readonly deviceRepository: DeviceRepository,
    ) {}

    public async activate(deviceActivationDto: DeviceActivationDto) {
        const memoryDeviceActivation =
            await this.memoryActivationRepository.validate(
                deviceActivationDto.activation_code,
            );

        if (!memoryDeviceActivation) {
            throw new BadRequestException("Activation token is invalid");
        }

        const { environment_id } = memoryDeviceActivation;

        const deviceRepository =
            await this.connectionRepositoryService.getRepository(
                DeviceEntity,
                environment_id,
            );

        const token = generateIntegrationToken();

        const device =
            (await deviceRepository.findOne({
                where: { device_hash: deviceActivationDto.device_hash },
            })) || ({} as DeviceEntity);

        device.device_hash = deviceActivationDto.device_hash;
        device.integration_token = token.hash;

        await deviceRepository.save(device);

        return {
            integration_token: token.integration_token,
            environment: hashString(environment_id.toString()),
        };
    }

    public create() {
        return this.memoryActivationRepository.create();
    }

    public async login(deviceLoginDto: DeviceLoginDto) {
        const {
            environment: hashed_id,
            device_hash,
            integration_token,
        } = deviceLoginDto;

        const environment = await this.environmentRepository.findOneByOrFail({
            hashed_id,
        });

        const deviceRepository =
            await this.connectionRepositoryService.getRepository(
                DeviceEntity,
                environment.id,
            );

        const device = await deviceRepository.findOneByOrFail({
            device_hash,
            integration_token: hashString(integration_token),
        });

        return {
            token: this.jwtAuthService.generateToken({
                environment_id: environment.id,
                id: device.id,
                type: JwtTokenType.Device,
                is_admin: false,
            }),
        };
    }

    public async getOne(id: number) {
        return this.deviceRepository.getOne(id);
    }

    public async getAll() {
        return this.deviceRepository.getAll();
    }
}
