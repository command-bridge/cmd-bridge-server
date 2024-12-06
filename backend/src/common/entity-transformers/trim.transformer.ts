import { ValueTransformer } from "typeorm";

export const TrimTransformer: ValueTransformer = {
    to(value: string): string {
        return value?.trim();
    },
    from(value: string): string {
        return value;
    },
};
