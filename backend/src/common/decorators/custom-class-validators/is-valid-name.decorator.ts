import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from "class-validator";

export function IsValidName(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidName",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'’\- ]{2,50}$/;
                    return (
                        typeof value === "string" &&
                        nameRegex.test(value.trim())
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    // If message is a function, execute it; otherwise, use the default message
                    return typeof validationOptions?.message === "function"
                        ? validationOptions.message(args)
                        : validationOptions?.message ||
                              `${propertyName} Invalid name. Names can only include letters, spaces, hyphens, and apostrophes.`;
                },
            },
        });
    };
}
