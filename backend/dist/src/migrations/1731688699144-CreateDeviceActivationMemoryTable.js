"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDeviceActivationMemoryTable1731688699144 = void 0;
class CreateDeviceActivationMemoryTable1731688699144 {
    async up(queryRunner) {
        const dbType = queryRunner.connection.options.type;
        const queryDbType = {
            mysql: `
                CREATE TABLE mem_device_creation (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    activation_code VARCHAR(255) NOT NULL,
                    expires_in DATETIME NOT NULL,
                    environment_id INT NOT NULL
                ) ENGINE=MEMORY;
            `,
            postgres: `
                CREATE UNLOGGED TABLE mem_device_creation (
                    id SERIAL PRIMARY KEY,
                    activation_code TEXT NOT NULL,
                    expires_in TIMESTAMP NOT NULL,
                    environment_id INT NOT NULL
                );
            `,
            mssql: `
                CREATE TABLE mem_device_creation (
                    id INT IDENTITY(1,1) PRIMARY KEY NONCLUSTERED,
                    activation_code NVARCHAR(255) NOT NULL,
                    expires_in DATETIME2 NOT NULL,
                    environment_id INT NOT NULL
                ) WITH (MEMORY_OPTIMIZED = ON, DURABILITY = SCHEMA_AND_DATA);
            `,
        };
        await queryRunner.query(queryDbType[dbType]);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE mem_device_creation`);
    }
}
exports.CreateDeviceActivationMemoryTable1731688699144 = CreateDeviceActivationMemoryTable1731688699144;
//# sourceMappingURL=1731688699144-CreateDeviceActivationMemoryTable.js.map