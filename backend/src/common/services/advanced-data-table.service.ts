import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { getDataGridColumns } from '@common/decorators/datagrid.decorator';

export interface DataTableQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDesc?: boolean;
    filter?: string;
    [key: string]: any; // For dynamic column filters
}

export interface DataTableConfig {
    entity: any;
    alias: string;
    searchableColumns: string[];
    sortableColumns: string[];
    dateColumns?: string[];
    defaultSort?: string;
}

export interface DataTableResult<T> {
    columns: Array<{ title: string; key: string }>;
    data: T[];
    total: number;
}

@Injectable()
export class AdvancedDataTableService {
    /**
     * Applies filters, sorting and pagination to a data-table query
     */
    public async getDataTable<T>(
        repository: Repository<T>,
        query: DataTableQuery,
        config: DataTableConfig
    ): Promise<DataTableResult<T>> {
        const qb = repository.createQueryBuilder(config.alias);

        // Apply filters
        this.applyFilters(qb, query, config);

        // Apply sorting
        this.applyOrdering(qb, query, config);

        // Apply pagination
        this.applyPagination(qb, query);

        // Execute query
        const [data, total] = await qb.getManyAndCount();

        return {
            columns: getDataGridColumns(config.entity),
            data,
            total,
        };
    }

    /**
     * Applies general and column-specific filters
     */
    private applyFilters<T>(
        qb: SelectQueryBuilder<T>,
        query: DataTableQuery,
        config: DataTableConfig
    ): void {
        let hasFilters = false;

        // General search filter
        if (query.filter && config.searchableColumns.length > 0) {
            const searchConditions = config.searchableColumns
                .map(column => `${config.alias}.${column} LIKE :globalFilter`)
                .join(' OR ');
            
            qb.where(`(${searchConditions})`, { 
                globalFilter: `%${query.filter}%` 
            });
            hasFilters = true;
        }

        // Column-specific filters
        config.searchableColumns.forEach(column => {
            if (query[column]) {
                const value = `%${query[column]}%`;
                const paramName = `filter_${column}`;
                
                if (hasFilters) {
                    qb.andWhere(`${config.alias}.${column} LIKE :${paramName}`, { 
                        [paramName]: value 
                    });
                } else {
                    qb.where(`${config.alias}.${column} LIKE :${paramName}`, { 
                        [paramName]: value 
                    });
                    hasFilters = true;
                }
            }
        });

        // Date filters
        if (config.dateColumns) {
            config.dateColumns.forEach(dateColumn => {
                const startParam = `${dateColumn}_start`;
                const endParam = `${dateColumn}_end`;

                if (query[startParam]) {
                    if (hasFilters) {
                        qb.andWhere(`${config.alias}.${dateColumn} >= :${startParam}`, {
                            [startParam]: query[startParam]
                        });
                    } else {
                        qb.where(`${config.alias}.${dateColumn} >= :${startParam}`, {
                            [startParam]: query[startParam]
                        });
                        hasFilters = true;
                    }
                }

                if (query[endParam]) {
                    if (hasFilters) {
                        qb.andWhere(`${config.alias}.${dateColumn} <= :${endParam}`, {
                            [endParam]: query[endParam]
                        });
                    } else {
                        qb.where(`${config.alias}.${dateColumn} <= :${endParam}`, {
                            [endParam]: query[endParam]
                        });
                        hasFilters = true;
                    }
                }
            });
        }
    }

    /**
     * Applies sorting
     */
    private applyOrdering<T>(
        qb: SelectQueryBuilder<T>,
        query: DataTableQuery,
        config: DataTableConfig
    ): void {
        const sortBy = query.sortBy && config.sortableColumns.includes(query.sortBy)
            ? query.sortBy
            : (config.defaultSort || config.sortableColumns[0]);

        if (sortBy) {
            qb.orderBy(
                `${config.alias}.${sortBy}`,
                query.sortDesc ? 'DESC' : 'ASC'
            );
        }
    }

    /**
     * Applies pagination
     */
    private applyPagination<T>(
        qb: SelectQueryBuilder<T>,
        query: DataTableQuery
    ): void {
        const page = query.page || 1;
        const limit = query.limit || 10;

        qb.skip((page - 1) * limit).take(limit);
    }

    /**
     * Creates default configuration based on entity
     */
    public static createConfig(
        entity: any,
        alias: string,
        options: {
            searchableColumns?: string[];
            sortableColumns?: string[];
            dateColumns?: string[];
            defaultSort?: string;
        } = {}
    ): DataTableConfig {
        // Extract columns from entity using decorators
        const columns = getDataGridColumns(entity);
        const columnKeys = columns.map(col => col.key);

        return {
            entity,
            alias,
            searchableColumns: options.searchableColumns || columnKeys,
            sortableColumns: options.sortableColumns || columnKeys,
            dateColumns: options.dateColumns || [],
            defaultSort: options.defaultSort,
        };
    }
} 