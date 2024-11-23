import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ConnectionConfigService {
    private configs: Map<number, EnvironmentEntity> = new Map();

    constructor(
        @InjectRepository(EnvironmentEntity)
        private readonly environmentRepository: Repository<EnvironmentEntity>,
    ) {}

    public async get(environment_id: number) {
        if (this.configs.has(environment_id)) {
            return this.configs.get(environment_id);
        }

        const configs = await this.environmentRepository.findOneByOrFail({
            id: environment_id,
        });

        this.configs.set(environment_id, configs);

        return configs;
    }
}
