import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { Repository } from "typeorm";
export declare class ConnectionConfigService {
    private readonly environmentRepository;
    private configs;
    constructor(environmentRepository: Repository<EnvironmentEntity>);
    get(environment_id: number): Promise<EnvironmentEntity>;
}
