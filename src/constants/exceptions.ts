export class InvalidStateException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidStateException";
    }
}

export class DuplicateModelException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DuplicateModelException";
    }
}

export class ValidationException extends Error {
    error: Object

    constructor(message: string, error: Object) {
        super(message);
        this.name = "ValidationException";
        this.error = error;
    }
}


export class NotFoundException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundException";
    }
}