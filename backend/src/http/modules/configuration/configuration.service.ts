import { DatabaseSupportedEngines } from "@common/enums/database-supported-engines.enum";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigurationDto } from "./configuration.dto";
import { DataSource } from "typeorm";
import {
    ConnectionManagerService,
    DatabaseEnginesOptions,
} from "@common/connections/connection-manager.service";
import {
    ADMIN_ENTITIES,
    ADMIN_MEMORY_ENTITIES,
    ENVIRONMENT_ENTITIES,
    ENVIRONMENT_MEMORY_ENTITIES,
} from "@common/entities";
import { UserEntity } from "@common/entities/admin/user.entity";
import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { hashString } from "@common/helpers/hash-string.helper";
import { hashPassword } from "@common/helpers/hash-password.helper";
import { join } from "path";
import { writeFileSync } from "fs";
import { quoteSqlIdentifier } from "@common/helpers/quote-sql-identifier.helper";

type DatabaseConnectionOptions = {
    type: DatabaseSupportedEngines;
    host: string;
    port?: number;
    username: string;
    password: string;
    database?: string;
};

type ConnectionTestResult = {
    connection?: DataSource;
    errorMessage?: string;
};

const DEFAULT_COMMAND_BRIDGE_DB_NAME = "command-bridge";

@Injectable()
export class ConfigurationService {
    private adminConnection: DataSource;
    private environmentConnection: DataSource;

    constructor(
        private readonly connectionManagerService: ConnectionManagerService,
    ) {}

    public async saveConfig(configs: ConfigurationDto) {
        await this.performConnections(configs);
        await this.createAdminDatabase();
        await this.createEnvironmentDatabase(
            configs.ENVIRONMENT_PREFIX.replaceAll("$id", "1"),
        );

        await this.connectionManagerService.closeConnections();
        this.adminConnection = null;
        this.environmentConnection = null;

        await this.performConnections(configs, false);
        await this.createEnvironment(configs);
        await this.createAdminUser(configs);

        return this.persistEnvFile(configs);
    }

    private persistEnvFile(configs: ConfigurationDto) {
        const configsToPersist = [
            "DB_PASSWORD",
            "DB_TYPE",
            "DB_USERNAME",
            "DB_PASSWORD",
            "DB_URL",
            "SERVER_MEMORY_ENGINE",
            "SERVER_BACKEND_URL",
            "APPLICATION_NAME",
        ] as (keyof ConfigurationDto)[];

        let envContent = `DB_NAME=${DEFAULT_COMMAND_BRIDGE_DB_NAME}\n`;

        for (const key of configsToPersist) {
            envContent += `${key}=${configs[key]}\n`;
        }

        const envPath = join(process.cwd(), ".env"); // Adjust this path as needed

        try {
            Logger.log(`Writing .env file at ${envPath}`);
            writeFileSync(envPath, envContent, "utf8");
            return "Configuration saved successfully!";
        } catch (error) {
            Logger.error("Error saving .env file:", error);
            throw new Error("Failed to save configuration");
        }
    }

    private async createAdminUser(configs: ConfigurationDto) {
        const user: Partial<UserEntity> = {
            user_name: configs.ADMIN_USERNAME,
            password: await hashPassword(configs.ADMIN_PASSWORD),
            name: configs.ADMIN_NAME,
            environment_id: 1,
            group_id: 0,
            is_admin: true,
        };

        await this.adminConnection.getRepository(UserEntity).save(user);
    }

    private async createEnvironment(configs: ConfigurationDto) {
        const environmentConnectionOptions = this.parseEnvironmentOptions(
            configs,
            false,
        );

        await this.adminConnection.getRepository(EnvironmentEntity).save({
            name: configs.ENVIRONMENT_NAME,
            db_database: environmentConnectionOptions.database,
            db_host: environmentConnectionOptions.host,
            db_password: environmentConnectionOptions.password,
            db_type: environmentConnectionOptions.type,
            db_user: environmentConnectionOptions.username,
            db_port: environmentConnectionOptions.port,
            hashed_id: hashString("1"),
        });
    }

    private async createAdminDatabase() {
        try {
            const dbName = quoteSqlIdentifier(
                this.adminConnection,
                DEFAULT_COMMAND_BRIDGE_DB_NAME,
            );

            await this.adminConnection.query(`CREATE DATABASE ${dbName}`);
        } catch (error) {
            Logger.error(error);

            throw new BadRequestException({
                statusCode: 400,
                message: ["Failed to create admin database."],
                error: "Bad Request",
            });
        }
    }

    private async createEnvironmentDatabase(database: string) {
        try {
            const dbName = quoteSqlIdentifier(this.adminConnection, database);

            await this.environmentConnection.query(`CREATE DATABASE ${dbName}`);
        } catch (error) {
            Logger.error(error);

            throw new BadRequestException({
                statusCode: 400,
                message: ["Failed to create environment database."],
                error: "Bad Request",
            });
        }
    }

    private parseMainConnectionOptions(
        configs: ConfigurationDto,
        connectOnly: boolean,
    ) {
        const [host, port] = configs.DB_URL.split(":");
        const mainConnectionOptions = {
            type: configs.DB_TYPE,
            host,
            port: port ? Number(port) : undefined,
            username: configs.DB_USERNAME,
            password: configs.DB_PASSWORD,
            database: connectOnly ? undefined : "command-bridge",
        } as DatabaseConnectionOptions;

        return mainConnectionOptions;
    }

    private parseEnvironmentOptions(
        configs: ConfigurationDto,
        connectOnly: boolean,
    ) {
        const environmentConnectionOptions = this.parseMainConnectionOptions(
            configs,
            connectOnly,
        );

        environmentConnectionOptions.database = connectOnly
            ? undefined
            : configs.ENVIRONMENT_PREFIX.replaceAll("$id", "1");

        if (!configs.ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS) {
            const [env_host, env_port] = configs.ENVIRONMENT_DB_URL.split(":");

            environmentConnectionOptions.type = configs.ENVIRONMENT_DB_TYPE;
            environmentConnectionOptions.host = env_host;
            environmentConnectionOptions.port = Number(env_port);
            environmentConnectionOptions.username =
                configs.ENVIRONMENT_DB_USERNAME;
            environmentConnectionOptions.password =
                configs.ENVIRONMENT_DB_PASSWORD;
        }

        return environmentConnectionOptions;
    }

    private async performConnections(
        configs: ConfigurationDto,
        connectOnly: boolean = true,
    ) {
        const mainConnectionOptions = this.parseMainConnectionOptions(
            configs,
            connectOnly,
        );
        const { errorMessage, connection } =
            await this.connectDatabaseFromConfigs(
                mainConnectionOptions,
                false,
                connectOnly,
            );

        if (errorMessage) {
            Logger.error(errorMessage);

            throw new BadRequestException({
                statusCode: 400,
                message: ["Failed to connect to database."],
                error: "Bad Request",
            });
        }

        const environmentConnectionOptions = this.parseEnvironmentOptions(
            configs,
            connectOnly,
        );
        const {
            errorMessage: environmentErrorMessage,
            connection: environmentConnection,
        } = await this.connectDatabaseFromConfigs(
            environmentConnectionOptions,
            true,
            connectOnly,
        );

        if (environmentErrorMessage) {
            Logger.error(environmentErrorMessage);

            throw new BadRequestException({
                statusCode: 400,
                message: ["Failed to connect to environment database."],
                error: "Bad Request",
            });
        }

        this.environmentConnection = environmentConnection;
        this.adminConnection = connection;
    }

    private async connectDatabaseFromConfigs(
        options: DatabaseConnectionOptions,
        isEnvironment: boolean,
        connectOnly: boolean,
    ) {
        const result: ConnectionTestResult = {};

        const extendedParameters: Partial<DatabaseEnginesOptions> = connectOnly
            ? {}
            : {
                  synchronize: true,
                  entities: !isEnvironment
                      ? [...ADMIN_ENTITIES, ...ADMIN_MEMORY_ENTITIES]
                      : [
                            ...ENVIRONMENT_ENTITIES,
                            ...ENVIRONMENT_MEMORY_ENTITIES,
                        ],
              };

        try {
            result.connection =
                await this.connectionManagerService.getConnection({
                    type: options.type,
                    host: options.host,
                    port: options.port,
                    username: options.username,
                    password: options.password,
                    database: options.database,
                    ...extendedParameters,
                } as DatabaseEnginesOptions);
        } catch (error) {
            result.errorMessage = error.message;
        } finally {
            return result;
        }
    }
}
