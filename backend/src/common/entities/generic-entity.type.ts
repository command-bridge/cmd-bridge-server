export type GenericEntity<T> = {
    new (...args: any[]): T;
};
