export class UnrecognizedCharacterException extends Error {
    constructor(message: string, index: number) {
        super(`[UnrecognizedCharacter]: ${message} at: [${index}]`);
    }
}

export class InvalidNumberException extends Error {
    constructor(message: string, index: number) {
        super(`[InvalidNumber]: ${message} at: [${index}]`);
    }
}

export class InvalidExpressionException extends Error {
    constructor(message: string) {
        super(`[InvalidExpression]: Invalid token: ${message}`);
    }
}