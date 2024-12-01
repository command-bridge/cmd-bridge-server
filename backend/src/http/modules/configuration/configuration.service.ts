import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigurationDto } from "./configuration.dto";
import { DataSource } from "typeorm";
import { UserEntity } from "@common/entities/admin/user.entity";
import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { hashString } from "@common/helpers/hash-string.helper";
import { hashPassword } from "@common/helpers/hash-password.helper";
import { join } from "path";
import { writeFileSync } from "fs";
import { quoteSqlIdentifier } from "@common/helpers/quote-sql-identifier.helper";
import { generateEnvironmentPrefix } from "@common/helpers/generate-environment-prefix.helper";
import {
    DatabaseConnectionOptions,
    testDatabaseConnection,
} from "@common/helpers/test-database-connection.helper";
import { randomBytes } from "crypto";

const DEFAULT_COMMAND_BRIDGE_DB_NAME = "command-bridge";

@Injectable()
export class ConfigurationService {
    constructor() {}

    public async saveConfig(configs: ConfigurationDto) {
        await this.initiateDatabaseCreation(configs);
        await this.populateInitialData(configs);

        return this.persistEnvFile(configs);
    }

    private async initiateDatabaseCreation(configs: ConfigurationDto) {
        const { connection, environmentConnection } =
            await this.performConnections(configs);

        await this.createAdminDatabase(connection);
        await this.createEnvironmentDatabase(
            connection,
            generateEnvironmentPrefix(1, configs.ENVIRONMENT_PREFIX),
        );

        connection.destroy();
        environmentConnection.destroy();
    }

    private async populateInitialData(configs: ConfigurationDto) {
        const { connection, environmentConnection } =
            await this.performConnections(configs, false);

        await this.createEnvironment(connection, configs);
        await this.createAdminUser(connection, configs);

        connection.destroy();
        environmentConnection.destroy();
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
            "ENVIRONMENT_PREFIX",
        ] as (keyof ConfigurationDto)[];

        const jwtSecretKey = randomBytes(32).toString("hex");

        let envContent = `DB_NAME=${DEFAULT_COMMAND_BRIDGE_DB_NAME}\n`;
        envContent += `JWT_SECRET=${jwtSecretKey}\n`;

        for (const key of configsToPersist) {
            if (key === "DB_URL") {
                const [host, port] = configs.DB_URL.split(":");

                envContent += `DB_HOST=${host}\n`;

                if (port) {
                    envContent += `DB_PORT=${Number(port)}\n`;
                }

                continue;
            }

            envContent += `${key}=${configs[key]}\n`;
        }

        const envPath = join(process.env.ASSETS_DIR, ".env");

        try {
            Logger.log(`Writing .env file at ${envPath}`);
            writeFileSync(envPath, envContent, "utf8");
            return "Configuration saved successfully!";
        } catch (error) {
            Logger.error("Error saving .env file:", error);
            throw new Error("Failed to save configuration");
        }
    }

    private async createAdminUser(
        connection: DataSource,
        configs: ConfigurationDto,
    ) {
        const user: Partial<UserEntity> = {
            user_name: configs.ADMIN_USERNAME,
            password: await hashPassword(configs.ADMIN_PASSWORD),
            name: configs.ADMIN_NAME,
            environment_id: 1,
            group_id: 0,
            is_admin: true,
        };

        await connection.getRepository(UserEntity).save(user);
    }

    private async createEnvironment(
        connection: DataSource,
        configs: ConfigurationDto,
    ) {
        const environmentConnectionOptions = this.parseEnvironmentOptions(
            configs,
            false,
        );

        await connection.getRepository(EnvironmentEntity).save({
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

    private async createAdminDatabase(connection: DataSource) {
        try {
            const dbName = quoteSqlIdentifier(
                connection,
                DEFAULT_COMMAND_BRIDGE_DB_NAME,
            );

            await connection.query(`CREATE DATABASE ${dbName}`);
        } catch (error) {
            Logger.error(error);

            throw new BadRequestException({
                statusCode: 400,
                message: ["Failed to create admin database."],
                error: "Bad Request",
            });
        }
    }

    private async createEnvironmentDatabase(
        connection: DataSource,
        database: string,
    ) {
        try {
            const dbName = quoteSqlIdentifier(connection, database);

            await connection.query(`CREATE DATABASE ${dbName}`);
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
            : generateEnvironmentPrefix(1, configs.ENVIRONMENT_PREFIX);

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
        const { errorMessage, connection } = await testDatabaseConnection(
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
        } = await testDatabaseConnection(
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

        return { connection, environmentConnection };
    }
}
