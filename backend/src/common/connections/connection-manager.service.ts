import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { SqlServerConnectionOptions } from "typeorm/driver/sqlserver/SqlServerConnectionOptions";

export type DatabaseEnginesOptions =
    | MysqlConnectionOptions
    | PostgresConnectionOptions
    | SqlServerConnectionOptions;

@Injectable()
export class ConnectionManagerService {
    private connections: Map<string, DataSource> = new Map();

    async getConnection(config: DatabaseEnginesOptions): Promise<DataSource> {
        const key = `${config.type}-${config.host}-${config.database}`;

        if (!this.connections.has(key)) {
            const dataSource = new DataSource(config);

            await dataSource.initialize();

            this.connections.set(key, dataSource);
        }

        return this.connections.get(key)!;
    }

    async closeConnections() {
        for (const connection of this.connections.values()) {
            await connection.destroy();
        }
        this.connections.clear();
    }
}
