import { BadRequestException, Injectable } from "@nestjs/common";
import { DeviceActivationDto } from "./device-activation.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtAuthService } from "@common/auth/jwt-auth.service";
import { DeviceEntity } from "@common/entities/device.entity";
import { JwtTokenType } from "@common/auth/jwt-token-type.enum";
import { MemoryDeviceActivationRepository } from "@common/shared-memory/memory-repositories/device-activation.repostiory";

@Injectable()
export class DeviceService {
    constructor(
        private readonly jwtService: JwtAuthService,
        @InjectRepository(DeviceEntity)
        private readonly deviceRepository: Repository<DeviceEntity>,
        private readonly memoryActivationRepository: MemoryDeviceActivationRepository
    ) {}

    public async activate(deviceActivationDto: DeviceActivationDto) {
        if (
            !(await this.memoryActivationRepository.validate(
                deviceActivationDto.activation_code,
            ))
        ) {
            throw new BadRequestException("Activation token is invalid");
        }

        const client = await this.deviceRepository.save(
            deviceActivationDto as unknown as DeviceEntity,
        );

        return {
            token: this.jwtService.generateToken({
                id: client.id,
                type: JwtTokenType.Device,
            }),
        };
    }

    public create() {
        return this.memoryActivationRepository.create();
    }
}
