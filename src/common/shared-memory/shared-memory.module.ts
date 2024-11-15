import { Module } from "@nestjs/common";
import { MemoryDeviceActivationRepository } from "./memory-repositories/device-activation.repostiory";
import { MemoryDeviceActivation } from "./memory-entities/device-activation.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    providers: [MemoryDeviceActivationRepository],
    exports: [MemoryDeviceActivationRepository],
    imports: [TypeOrmModule.forFeature([MemoryDeviceActivation])],
})
export class SharedMemoryModule {}
