"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashString = hashString;
const crypto_1 = require("crypto");
function hashString(string) {
    return (0, crypto_1.createHash)("sha256").update(string).digest("hex");
}
//# sourceMappingURL=hash-string.helper.js.map