import { Module } from "@nestjs/common";
import {
    ONLINE_DEVICES_REPOSITORY_PROVIDER,
    OnlineDevicesRepository,
} from "./repositories/online-devices.memory";

@Module({
    providers: [ONLINE_DEVICES_REPOSITORY_PROVIDER],
    exports: [OnlineDevicesRepository],
})
export class EnvironmentMemoryModule {}
