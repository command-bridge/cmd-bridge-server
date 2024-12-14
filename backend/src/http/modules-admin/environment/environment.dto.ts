import { IsValidName } from "@common/decorators/custom-class-validators/is-valid-name.decorator";
import { DatabaseSupportedEngines } from "@common/enums/database-supported-engines.enum";
import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsString,
    IsUrl,
    ValidateIf,
} from "class-validator";

export class EnvironmentCreateDto {
    @IsValidName()
    name: string;

    @IsBoolean()
    useDefaultDbCredentials: boolean;

    @IsString()
    @IsUrl({ require_tld: false, require_protocol: false })
    @ValidateIf((o) => o.useDefaultDbCredentials === false)
    db_url: string;

    @IsEnum(DatabaseSupportedEngines, {
        message: "db_type Unknown database type",
    })
    @ValidateIf((o) => o.ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS === false)
    db_type: DatabaseSupportedEngines;

    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => o.ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS === false)
    db_user: string;

    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => o.ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS === false)
    db_password: string;
}

export class EnvironmentUseDto {
    @IsNumberString()
    environment_id: number;
}
