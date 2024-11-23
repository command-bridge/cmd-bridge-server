import { randomBytes } from "crypto";

export type RandomStringMode = {
    upperCase: boolean;
    lowerCase: boolean;
    numbers: boolean;
    specialCharacters: boolean;
};

export function randomString(
    length: number,
    mode: RandomStringMode = {
        upperCase: true,
        lowerCase: true,
        numbers: true,
        specialCharacters: false,
    },
) {
    const charSets: Record<keyof RandomStringMode, string> = {
        upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowerCase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        specialCharacters: "!@#$%&",
    };

    // Dynamically build the character pool based on the mode
    const chars = Object.entries(mode)
        .filter(([key, isEnabled]) => isEnabled)
        .map(([key]) => charSets[key as keyof RandomStringMode])
        .join("");

    if (!chars) {
        throw new Error("At least one character set must be enabled.");
    }

    const bytes = randomBytes(length);

    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
    }

    return result;
}
