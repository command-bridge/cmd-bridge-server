"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ENTITIES = exports.ADMIN_MEMORY_ENTITIES = exports.ENVIRONMENT_ENTITIES = exports.ENVIRONMENT_MEMORY_ENTITIES = void 0;
const device_entity_1 = require("./environment/device.entity");
const user_entity_1 = require("./admin/user.entity");
const memory_device_activation_entity_1 = require("./admin/memory-device-activation.entity");
const environment_entity_1 = require("./admin/environment.entity");
exports.ENVIRONMENT_MEMORY_ENTITIES = [];
exports.ENVIRONMENT_ENTITIES = [device_entity_1.DeviceEntity];
exports.ADMIN_MEMORY_ENTITIES = [memory_device_activation_entity_1.MemoryDeviceActivation];
exports.ADMIN_ENTITIES = [user_entity_1.UserEntity, environment_entity_1.EnvironmentEntity];
//# sourceMappingURL=index.js.map