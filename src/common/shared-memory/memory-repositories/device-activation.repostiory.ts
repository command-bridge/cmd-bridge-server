import { InjectRepository } from "@nestjs/typeorm";
import { MemoryDeviceActivation } from "../../entities/admin/memory-device-activation.entity";
import { randomString } from "@common/helpers/random-string.helper";
import { Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { RequestWithPayload } from "@http/core/auth/jwt-auth.guard";

@Injectable()
export class MemoryDeviceActivationRepository {
    constructor(
        @Inject(REQUEST) private readonly request: RequestWithPayload,
        @InjectRepository(MemoryDeviceActivation)
        private readonly memoryDeviceActivationRepository: Repository<MemoryDeviceActivation>,
    ) {}

    public create() {
        const activation_code = randomString(6, {
            lowerCase: false,
            upperCase: false,
            numbers: true,
            specialCharacters: false,
        });

        return this.memoryDeviceActivationRepository.save({
            activation_code,
            environment_id: this.request.payload.environment_id,
            expires_in: new Date(Date.now() + 15 * 60 * 1000),
        });
    }

    public async validate(activation_code: string) {
        const params = { where: { activation_code } };

        const found =
            await this.memoryDeviceActivationRepository.findOne(params);

        if (!found) {
            return null;
        }

        await this.memoryDeviceActivationRepository.remove(found);

        return found;
    }
}
