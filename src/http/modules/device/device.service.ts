import { BadRequestException, Injectable } from "@nestjs/common";
import { DeviceActivationDto } from "./device-activation.dto";
import { JwtAuthService } from "@common/auth/jwt-auth.service";
import { JwtTokenType } from "@common/auth/jwt-token-type.enum";
import { MemoryDeviceActivationRepository } from "@common/shared-memory/memory-repositories/device-activation.repostiory";
import { DeviceEntity } from "@common/entities/environment/device.entity";
import { ConnectionRepositoryService } from "@common/connections/connection-repository.service";

@Injectable()
export class DeviceService {
    constructor(
        private readonly jwtService: JwtAuthService,
        private readonly connectionRepositoryService: ConnectionRepositoryService,
        private readonly memoryActivationRepository: MemoryDeviceActivationRepository,
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

        const client = await deviceRepository.save(
            deviceActivationDto as unknown as DeviceEntity,
        );

        return {
            token: this.jwtService.generateToken({
                id: client.id,
                environment_id,
                type: JwtTokenType.Device,
            }),
        };
    }

    public create() {
        return this.memoryActivationRepository.create();
    }
}
