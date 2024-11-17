import { DeviceEntity } from "./environment/device.entity";
import { UserEntity } from "./admin/user.entity";
import { MemoryDeviceActivation } from "./admin/memory-device-activation.entity";
import { EnvironmentEntity } from "./admin/environment.entity";

export const ENVIRONMENT_MEMORY_ENTITIES = [];
export const ENVIRONMENT_ENTITIES = [DeviceEntity];
export const ADMIN_MEMORY_ENTITIES = [MemoryDeviceActivation];
export const ADMIN_ENTITIES = [UserEntity, EnvironmentEntity];
