import { DatabaseEnginesOptions } from "@common/connections/connection-manager.service";

export function specificDatabaseEngineConfigs(db_type: string) {
    const engines = {
        mssql: {
            extra: {
                trustServerCertificate: true,
            },
        },
    };

    return { ...engines[db_type] } as Partial<DatabaseEnginesOptions>;
}
