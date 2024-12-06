/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export interface DataGridOptions {
    title: string;
}

export interface DatagridColumn {
    key: string;
    title: string;
}

export function DataGrid(options: DataGridOptions): PropertyDecorator {
    return (target, propertyKey) => {
        const existingColumns =
            Reflect.getMetadata("datagrid:columns", target.constructor) || [];

        Reflect.defineMetadata(
            "datagrid:columns",
            [...existingColumns, { propertyKey, options }],
            target.constructor,
        );
    };
}

export function getDataGridColumns(entity: Function): Array<DatagridColumn> {
    const columns = Reflect.getMetadata("datagrid:columns", entity) || [];

    return columns.map(({ propertyKey, options }: any) => ({
        key: propertyKey,
        title: options.title,
    }));
}
