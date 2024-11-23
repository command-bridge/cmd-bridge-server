"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = randomString;
const crypto_1 = require("crypto");
function randomString(length, mode = {
    upperCase: true,
    lowerCase: true,
    numbers: true,
    specialCharacters: false,
}) {
    const charSets = {
        upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowerCase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        specialCharacters: "!@#$%&",
    };
    const chars = Object.entries(mode)
        .filter(([key, isEnabled]) => isEnabled)
        .map(([key]) => charSets[key])
        .join("");
    if (!chars) {
        throw new Error("At least one character set must be enabled.");
    }
    const bytes = (0, crypto_1.randomBytes)(length);
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return result;
}
//# sourceMappingURL=random-string.helper.js.map