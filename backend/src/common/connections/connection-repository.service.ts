import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import {
    ENVIRONMENT_ENTITIES,
    ENVIRONMENT_MEMORY_ENTITIES,
} from "@common/entities";
import { ConnectionManagerService } from "./connection-manager.service";
import { GenericEntity } from "@common/entities/generic-entity.type";
import { RequestWithPayload } from "@http/core/auth/jwt-auth.guard";
import { ConnectionConfigService } from "./connection-config.service";

export function InjectEnvironmentRepository<T>(entity: GenericEntity<T>) {
    const token = `ENVIRONMENT_REPOSITORY_${entity.name}`;
    return Inject(token);
}

@Injectable({ scope: Scope.REQUEST })
export class ConnectionRepositoryService {
    constructor(
        @Inject(REQUEST) private readonly request: RequestWithPayload,
        private readonly connectionManager: ConnectionManagerService,
        private readonly connectionConfigsService: ConnectionConfigService,
    ) {}

    async getRepository<T>(entity: GenericEntity<T>, environment_id?: number) {
        const environmentId =
            environment_id || this.getEnvironmentIdFromRequest();

        const config = await this.getEnvironmentDbConfig(environmentId);
        const connection = await this.connectionManager.getConnection(config);

        return connection.getRepository(entity);
    }

    private getEnvironmentIdFromRequest() {
        const tokenPayload = this.request.payload;

        if (!tokenPayload || !tokenPayload.environment_id) {
            throw new Error("Environment ID not found in request");
        }

        return tokenPayload.environment_id;
    }

    private async getEnvironmentDbConfig(environmentId: number): Promise<any> {
        const { db_host, db_password, db_port, db_type, db_user, db_database } =
            await this.connectionConfigsService.get(environmentId);

        return {
            type: db_type,
            host: db_host,
            port: db_port,
            username: db_user,
            password: db_password,
            database: db_database,
            entities: [...ENVIRONMENT_ENTITIES, ...ENVIRONMENT_MEMORY_ENTITIES],
            synchronize: true, // Use cautiously in production
        };
    }
}
