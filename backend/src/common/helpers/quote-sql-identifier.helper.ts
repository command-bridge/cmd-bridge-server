import { DataSource } from "typeorm";

/**
 * Quotes a string to safely use as an identifier (e.g., table or database name) in a query.
 * @param dataSource - The TypeORM DataSource to determine the database engine.
 * @param identifier - The string to be quoted as an identifier.
 * @returns The quoted identifier.
 */
export function quoteSqlIdentifier(
    dataSource: DataSource,
    identifier: string,
): string {
    // Validate the identifier
    if (!/^[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*$/.test(identifier)) {
        throw new Error(
            "Invalid identifier. Only letters, numbers, underscores and single hyphen are allowed.",
        );
    }

    // Determine the database type from the dataSource
    const dbType = dataSource.options.type;

    // Quote based on the database type
    switch (dbType) {
        case "mysql":
        case "mariadb":
            return `\`${identifier}\``; // Backticks for MySQL and MariaDB
        case "postgres":
            return `"${identifier}"`; // Double quotes for PostgreSQL
        case "mssql":
            return `[${identifier}]`; // Square brackets for SQL Server
        default:
            throw new Error(`Unsupported database type: ${dbType}`);
    }
}
