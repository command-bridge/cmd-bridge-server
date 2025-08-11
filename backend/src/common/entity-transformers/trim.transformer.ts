import { ValueTransformer } from "typeorm";

export const TrimTransformer: ValueTransformer = {
    to(value: any): string | null {
        if (value === null || value === undefined) {
            return null;
        }
        
        const stringValue = String(value);
        return stringValue.trim();
    },
    from(value: string): string {
        return value;
    },
};
