import { IsValidName } from "@common/decorators/custom-class-validators/is-valid-name.decorator";
import { DatabaseSupportedEngines } from "@common/enums/database-supported-engines.enum";
import { SharedMemoryEngine } from "@common/shared-memory/shared-memory.enum";
import {
    IsAlphanumeric,
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    IsUrl,
    Matches,
    MaxLength,
    MinLength,
    ValidateIf,
} from "class-validator";

export class ConfigurationDto {
    @IsString()
    @IsUrl({ require_tld: false, require_protocol: false })
    DB_URL: string;

    @IsEnum(DatabaseSupportedEngines, {
        message: "DB_TYPE Unknown database type",
    })
    DB_TYPE: DatabaseSupportedEngines;

    @IsString()
    @IsNotEmpty()
    DB_USERNAME: string;

    @IsString()
    @IsNotEmpty()
    DB_PASSWORD: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(12)
    @Matches(/^[a-zA-Z]+([_-]?[a-zA-Z]+)*-\$id$/, {
        message:
            'ENVIRONMENT_PREFIX Invalid format. Only letters and at most one "_" or "-" are allowed and it must end with "-$id"',
    })
    ENVIRONMENT_PREFIX: string;

    @IsValidName()
    ENVIRONMENT_NAME: string;

    @IsBoolean()
    ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS: boolean;

    @IsString()
    @IsUrl({ require_tld: false, require_protocol: false })
    @ValidateIf((o) => o.ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS === false)
    ENVIRONMENT_DB_URL: string;

    @IsEnum(DatabaseSupportedEngines, {
        message: "ENVIRONMENT_DB_TYPE Unknown database type",
    })
    @ValidateIf((o) => o.ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS === false)
    ENVIRONMENT_DB_TYPE: DatabaseSupportedEngines;

    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => o.ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS === false)
    ENVIRONMENT_DB_USERNAME: string;

    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => o.ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS === false)
    ENVIRONMENT_DB_PASSWORD: string;

    @IsString()
    @MinLength(8)
    @IsEmail()
    ADMIN_USERNAME: string;

    @IsValidName()
    ADMIN_NAME: string;

    @IsStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    ADMIN_PASSWORD: string;

    @IsValidName()
    APPLICATION_NAME: string;

    @IsUrl({ require_tld: false })
    SERVER_BACKEND_URL: string;

    @IsEnum(SharedMemoryEngine, {
        message:
            "SERVER_MEMORY_ENGINE Server memory engine must be one of: Database, In Memory, Redis or Mongodb",
    })
    SERVER_MEMORY_ENGINE: SharedMemoryEngine;
}
