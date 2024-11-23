"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIntegrationToken = generateIntegrationToken;
const crypto_1 = require("crypto");
const hash_string_helper_1 = require("./hash-string.helper");
function generateIntegrationToken() {
    const integration_token = (0, crypto_1.randomBytes)(32).toString("hex");
    return {
        integration_token,
        hash: (0, hash_string_helper_1.hashString)(integration_token),
    };
}
//# sourceMappingURL=generate-integration-token.helper.js.map