import { ConnectionManagerService } from "./connection-manager.service";
import { GenericEntity } from "@common/entities/generic-entity.type";
import { RequestWithPayload } from "@http/core/auth/jwt-auth.guard";
import { ConnectionConfigService } from "./connection-config.service";
export declare function InjectEnvironmentRepository<T>(entity: GenericEntity<T>): PropertyDecorator & ParameterDecorator;
export declare class ConnectionRepositoryService {
    private readonly request;
    private readonly connectionManager;
    private readonly connectionConfigsService;
    constructor(request: RequestWithPayload, connectionManager: ConnectionManagerService, connectionConfigsService: ConnectionConfigService);
    getRepository<T>(entity: GenericEntity<T>, environment_id?: number): Promise<import("typeorm").Repository<T>>;
    private getEnvironmentIdFromRequest;
    private getEnvironmentDbConfig;
}
