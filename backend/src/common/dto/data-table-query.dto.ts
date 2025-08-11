import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class BaseDataTableQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @Type(() => Boolean)
    sortDesc?: boolean;

    @IsOptional()
    @IsString()
    filter?: string;
}

/**
 * Factory to create specific DTOs extending the base class
 */
export function createDataTableDto(columnFilters: string[] = [], dateColumns: string[] = []) {
    class DataTableQueryDto extends BaseDataTableQueryDto {}

    // Add column filters dynamically
    columnFilters.forEach(column => {
        const decorator = IsOptional();
        const stringDecorator = IsString();
        
        Object.defineProperty(DataTableQueryDto.prototype, column, {
            value: undefined,
            writable: true,
            enumerable: true,
            configurable: true
        });

        // Apply decorators
        decorator(DataTableQueryDto.prototype, column);
        stringDecorator(DataTableQueryDto.prototype, column);
    });

    // Add date filters dynamically
    dateColumns.forEach(dateColumn => {
        const startField = `${dateColumn}_start`;
        const endField = `${dateColumn}_end`;

        [startField, endField].forEach(field => {
            const decorator = IsOptional();
            const stringDecorator = IsString();
            
            Object.defineProperty(DataTableQueryDto.prototype, field, {
                value: undefined,
                writable: true,
                enumerable: true,
                configurable: true
            });

            // Apply decorators
            decorator(DataTableQueryDto.prototype, field);
            stringDecorator(DataTableQueryDto.prototype, field);
        });
    });

    return DataTableQueryDto;
} 