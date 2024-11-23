import { hash, compare } from "bcrypt";

const ROUNDS = 12;

export function hashPassword(plainText: string) {
    return hash(plainText, ROUNDS);
}

export function comparePassword(plainText: string, hash: string) {
    return compare(plainText, hash);
}
