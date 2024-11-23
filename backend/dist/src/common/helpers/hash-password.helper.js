"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt_1 = require("bcrypt");
const ROUNDS = 12;
function hashPassword(plainText) {
    return (0, bcrypt_1.hash)(plainText, ROUNDS);
}
function comparePassword(plainText, hash) {
    return (0, bcrypt_1.compare)(plainText, hash);
}
//# sourceMappingURL=hash-password.helper.js.map