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
        const connection = await this.getConnection(environment_id);

        return connection.getRepository(entity);
    }

    async getConnection(environment_id?: number) {
        const environmentId =
            environment_id || this.getEnvironmentIdFromRequest();

        const config = await this.getEnvironmentDbConfig(environmentId);

        return this.connectionManager.getConnection(config);
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

        const environmentEntities = [
            ...ENVIRONMENT_ENTITIES,
            ...ENVIRONMENT_MEMORY_ENTITIES,
        ];

        return {
            type: db_type,
            host: db_host,
            port: db_port,
            username: db_user,
            password: db_password,
            database: db_database ? db_database : undefined,
            entities: db_database ? environmentEntities : undefined,
            synchronize: db_database && db_database.length ? true : false, // Use cautiously in production
        };
    }
}
