import { DeviceActivationDto, DeviceLoginDto } from "./device.dto";
import { JwtAuthService } from "@common/auth/jwt-auth.service";
import { MemoryDeviceActivationRepository } from "@common/shared-memory/memory-repositories/device-activation.repostiory";
import { ConnectionRepositoryService } from "@common/connections/connection-repository.service";
import { Repository } from "typeorm";
import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
export declare class DeviceService {
    private readonly connectionRepositoryService;
    private readonly memoryActivationRepository;
    private readonly environmentRepository;
    private readonly jwtAuthService;
    constructor(connectionRepositoryService: ConnectionRepositoryService, memoryActivationRepository: MemoryDeviceActivationRepository, environmentRepository: Repository<EnvironmentEntity>, jwtAuthService: JwtAuthService);
    activate(deviceActivationDto: DeviceActivationDto): Promise<{
        integration_token: string;
        environment: string;
    }>;
    create(): Promise<{
        activation_code: string;
        environment_id: number;
        expires_in: Date;
    } & import("../../../common/entities/admin/memory-device-activation.entity").MemoryDeviceActivation>;
    login(deviceLoginDto: DeviceLoginDto): Promise<{
        token: string;
    }>;
}
