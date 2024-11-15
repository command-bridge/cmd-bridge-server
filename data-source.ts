import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as "mysql" | "postgres" | "mssql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, // Always use migrations for production
    logging: true,
    entities: ["dist/**/*.entity.js"],
    migrations: ["src/migrations/*.ts"],
});
