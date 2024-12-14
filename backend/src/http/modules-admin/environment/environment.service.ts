import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { EnvironmentCreateDto } from "./environment.dto";
import { generateEnvironmentPrefix } from "@common/helpers/generate-environment-prefix.helper";
import { hashString } from "@common/helpers/hash-string.helper";
import { quoteSqlIdentifier } from "@common/helpers/quote-sql-identifier.helper";
import { ConnectionRepositoryService } from "@common/connections/connection-repository.service";
import {
    DatabaseConnectionOptions,
    testDatabaseConnection,
} from "@common/helpers/test-database-connection.helper";
import { DatabaseSupportedEngines } from "@common/enums/database-supported-engines.enum";
import { JwtAuthService } from "@common/auth/jwt-auth.service";
import { RequestWithPayload } from "@common/auth/jwt-auth.middlewere";
import { JwtTokenType } from "@common/auth/jwt-token-type.enum";

@Injectable()
export class EnvironmentService {
    constructor(
        @InjectRepository(EnvironmentEntity)
        private readonly environmentRepository: Repository<EnvironmentEntity>,
        private readonly environmentConnection: ConnectionRepositoryService,
        private readonly jwtService: JwtAuthService,
    ) {}

    public getAll() {
        return this.environmentRepository.find();
    }

    public async upsert(environment: EnvironmentCreateDto) {
        let environmentConnection: DataSource = null;

        const create = new EnvironmentEntity();

        create.name = environment.name;

        if (environment.useDefaultDbCredentials) {
            create.db_type = process.env.DB_TYPE;
            create.db_user = process.env.DB_USERNAME;
            create.db_host = process.env.DB_HOST;
            create.db_password = process.env.DB_PASSWORD;

            if (process.env.DB_PORT) {
                create.db_port = Number(process.env.DB_PORT);
            }
        } else {
            create.db_type = environment.db_type;
            create.db_user = environment.db_user;
            create.db_password = environment.db_password;

            const [host, port] = environment.db_url.split(":");

            create.db_host = host;

            if (port) create.db_port = Number(port);

            const options: DatabaseConnectionOptions = {
                host,
                port: create.db_port,
                type: create.db_type as DatabaseSupportedEngines,
                username: create.db_user,
                password: create.db_user,
            };

            const { errorMessage, connection } = await testDatabaseConnection(
                options,
                true,
            );

            if (errorMessage) {
                Logger.error(errorMessage);

                throw new BadRequestException({
                    statusCode: 400,
                    message: ["Failed to connect to database."],
                    error: "Bad Request",
                });
            }

            environmentConnection = connection;
        }

        const created = await this.environmentRepository.save(create);

        created.db_database = generateEnvironmentPrefix(created.id);
        created.hashed_id = hashString(created.id.toString());

        if (!environmentConnection) {
            environmentConnection =
                await this.environmentConnection.getConnection(created.id);
        }

        await this.createEnvironmentDatabase(
            environmentConnection,
            created.db_database,
        );

        return this.environmentRepository.save(created);
    }

    public async use(environment_id: number, req: RequestWithPayload) {
        const { id } = req.payload;

        return {
            token: this.jwtService.generateToken({
                id: id,
                environment_id: environment_id,
                type: JwtTokenType.User,
                is_admin: true,
            }),
        };
    }

    private async createEnvironmentDatabase(
        dataSource: DataSource,
        database: string,
    ) {
        try {
            const dbName = quoteSqlIdentifier(dataSource, database);

            await dataSource.query(`CREATE DATABASE ${dbName}`);
        } catch (error) {
            Logger.error(error);

            throw new BadRequestException({
                statusCode: 400,
                message: ["Failed to create environment database."],
                error: "Bad Request",
            });
        }
    }
}
