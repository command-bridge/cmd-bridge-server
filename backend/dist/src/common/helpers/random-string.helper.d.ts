export type RandomStringMode = {
    upperCase: boolean;
    lowerCase: boolean;
    numbers: boolean;
    specialCharacters: boolean;
};
export declare function randomString(length: number, mode?: RandomStringMode): string;
