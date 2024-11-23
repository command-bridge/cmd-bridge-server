import { MemoryDeviceActivation } from "../../entities/admin/memory-device-activation.entity";
import { Repository } from "typeorm";
import { RequestWithPayload } from "@http/core/auth/jwt-auth.guard";
export declare class MemoryDeviceActivationRepository {
    private readonly request;
    private readonly memoryDeviceActivationRepository;
    constructor(request: RequestWithPayload, memoryDeviceActivationRepository: Repository<MemoryDeviceActivation>);
    create(): Promise<{
        activation_code: string;
        environment_id: number;
        expires_in: Date;
    } & MemoryDeviceActivation>;
    validate(activation_code: string): Promise<MemoryDeviceActivation>;
}
