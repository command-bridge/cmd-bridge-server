import { InjectRepository } from "@nestjs/typeorm";
import { MemoryDeviceActivation } from "../memory-entities/device-activation.entity";
import { randomString } from "@common/helpers/random-string.helper";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MemoryDeviceActivationRepository {
    constructor(
        @InjectRepository(MemoryDeviceActivation)
        private readonly memoryDeviceActivationRepository: Repository<MemoryDeviceActivation>,
    ) {}

    public create() {
        const activation_code = randomString(6);

        return this.memoryDeviceActivationRepository.save({
            activation_code,
            expires_in: new Date(Date.now() + 15 * 60 * 1000),
        });
    }

    public async validate(activation_code: string) {
        const params = { where: { activation_code } };

        const found =
            await this.memoryDeviceActivationRepository.findOne(params);

        if (!found) {
            return false;
        }

        await this.memoryDeviceActivationRepository.remove(found);

        return true;
    }
}
