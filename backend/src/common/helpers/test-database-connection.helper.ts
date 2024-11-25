import { DatabaseEnginesOptions } from "@common/connections/connection-manager.service";
import {
    ADMIN_ENTITIES,
    ADMIN_MEMORY_ENTITIES,
    ENVIRONMENT_ENTITIES,
    ENVIRONMENT_MEMORY_ENTITIES,
} from "@common/entities";
import { DatabaseSupportedEngines } from "@common/enums/database-supported-engines.enum";
import { DataSource } from "typeorm";

export type DatabaseConnectionOptions = {
    type: DatabaseSupportedEngines;
    host: string;
    port?: number;
    username: string;
    password: string;
    database?: string;
};

export type ConnectionTestResult = {
    connection?: DataSource;
    errorMessage?: string;
};

/**
 * Test an connection with given configurations. If connectOnly is set to true (default), perform an simple connection without specify database, entities or anything else.
 */
export async function testDatabaseConnection(
    options: DatabaseConnectionOptions,
    isEnvironment: boolean,
    connectOnly: boolean = true,
) {
    const result: ConnectionTestResult = {};

    const extendedParameters: Partial<DatabaseEnginesOptions> = connectOnly
        ? {}
        : {
              synchronize: true,
              entities: !isEnvironment
                  ? [...ADMIN_ENTITIES, ...ADMIN_MEMORY_ENTITIES]
                  : [...ENVIRONMENT_ENTITIES, ...ENVIRONMENT_MEMORY_ENTITIES],
          };

    try {
        result.connection = new DataSource({
            type: options.type,
            host: options.host,
            port: options.port,
            username: options.username,
            password: options.password,
            database: options.database,
            ...extendedParameters,
        } as DatabaseEnginesOptions);

        await result.connection.initialize();
    } catch (error) {
        result.errorMessage = error.message;
    } finally {
        return result;
    }
}
