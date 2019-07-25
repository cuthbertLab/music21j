// not working properly...

class ExtendableError extends Error {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(message).stack;
        }
    }
}

export class Music21Exception extends ExtendableError {}

export class StreamException extends Music21Exception {}
