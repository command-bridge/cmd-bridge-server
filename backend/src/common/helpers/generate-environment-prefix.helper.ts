export function generateEnvironmentPrefix(id: number, _prefix?: string) {
    const prefix = _prefix || process.env.ENVIRONMENT_PREFIX || "db-env-$id";

    return prefix.replaceAll("$id", id.toString());
}
