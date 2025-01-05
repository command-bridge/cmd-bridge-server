export abstract class MemoryRepository<T> {
    private storage = new Map<string, T>();

    constructor(private readonly environmentId?: number) {}

    add(key: string | number, value: T): void {
        this.storage.set(this.parseKey(key), value);
    }

    findBy(predicate: (value: T) => boolean): T[] {
        return Array.from(this.storage.values()).filter(predicate);
    }

    get(key: string | number): T | null {
        return this.storage.get(this.parseKey(key));
    }

    remove(key: string | number): void {
        this.storage.delete(this.parseKey(key));
    }

    all(): T[] {
        return Array.from(this.storage.values());
    }

    allFromEnvironment(): T[] {
        const environmentId = this.environmentId;

        return Array.from(this.storage.entries())
            .filter(([key]) => key.startsWith(`${environmentId}:`))
            .map(([, value]) => value);
    }

    private parseKey(key: string | number) {
        const environmentId = this.environmentId;

        if (!environmentId) {
            return key.toString();
        }

        if (typeof key === "number") key = key.toString();

        return `${environmentId}:${key}`;
    }
}
