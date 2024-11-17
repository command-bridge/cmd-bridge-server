import { randomBytes } from "crypto";
import { hashString } from "./hash-string.helper";

export function generateIntegrationToken() {
    const integration_token = randomBytes(32).toString("hex");

    return {
        integration_token,
        hash: hashString(integration_token),
    };
}
