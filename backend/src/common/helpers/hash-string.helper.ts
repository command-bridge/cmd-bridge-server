import { createHash } from "crypto";

export function hashString(string: string) {
    return createHash("sha256").update(string).digest("hex");
}
