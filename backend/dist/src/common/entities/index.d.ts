import { DeviceEntity } from "./environment/device.entity";
import { UserEntity } from "./admin/user.entity";
import { MemoryDeviceActivation } from "./admin/memory-device-activation.entity";
import { EnvironmentEntity } from "./admin/environment.entity";
export declare const ENVIRONMENT_MEMORY_ENTITIES: any[];
export declare const ENVIRONMENT_ENTITIES: (typeof DeviceEntity)[];
export declare const ADMIN_MEMORY_ENTITIES: (typeof MemoryDeviceActivation)[];
export declare const ADMIN_ENTITIES: (typeof UserEntity | typeof EnvironmentEntity)[];
