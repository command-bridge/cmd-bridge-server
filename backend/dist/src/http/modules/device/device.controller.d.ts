import { DeviceActivationDto, DeviceLoginDto } from "./device.dto";
import { DeviceService } from "./device.service";
export declare class DeviceController {
    private readonly deviceService;
    constructor(deviceService: DeviceService);
    login(deviceLoginDto: DeviceLoginDto): Promise<{
        token: string;
    }>;
    activate(deviceActivationDto: DeviceActivationDto): Promise<{
        integration_token: string;
        environment: string;
    }>;
    create(): Promise<{
        activation_code: string;
        environment_id: number;
        expires_in: Date;
    } & import("../../../common/entities/admin/memory-device-activation.entity").MemoryDeviceActivation>;
}
