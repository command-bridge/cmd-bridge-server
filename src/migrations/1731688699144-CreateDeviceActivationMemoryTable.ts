import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDeviceActivationMemoryTable1731688699144
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner) {
        const dbType = queryRunner.connection.options.type;

        const queryDbType = {
            mysql: `
                CREATE TABLE mem_device_creation (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    activation_code VARCHAR(255) NOT NULL,
                    expires_in DATETIME NOT NULL
                ) ENGINE=MEMORY;
            `,
            postgres: `
                CREATE UNLOGGED TABLE mem_device_creation (
                    id SERIAL PRIMARY KEY,
                    activation_code TEXT NOT NULL,
                    expires_in TIMESTAMP NOT NULL
                );
            `,
            mssql: `                
                CREATE TABLE mem_device_creation (
                    id INT IDENTITY(1,1) PRIMARY KEY NONCLUSTERED,
                    activation_code NVARCHAR(255) NOT NULL,
                    expires_in DATETIME2 NOT NULL
                ) WITH (MEMORY_OPTIMIZED = ON, DURABILITY = SCHEMA_AND_DATA);
            `,
        };

        await queryRunner.query(queryDbType[dbType]);
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`DROP TABLE mem_device_creation`);
    }
}
