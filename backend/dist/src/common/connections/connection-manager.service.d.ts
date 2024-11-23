import { DataSource } from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { SqlServerConnectionOptions } from "typeorm/driver/sqlserver/SqlServerConnectionOptions";
export type DatabaseEnginesOptions = MysqlConnectionOptions | PostgresConnectionOptions | SqlServerConnectionOptions;
export declare class ConnectionManagerService {
    private connections;
    getConnection(config: DatabaseEnginesOptions): Promise<DataSource>;
    closeConnections(): Promise<void>;
}
