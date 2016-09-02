// not working properly...

class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message; 
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else { 
            this.stack = (new Error(message)).stack; 
        }
    }
}    

export class Music21Exception extends ExtendableError {
    constructor(message) {
        super(message);
    }
}

export class StreamException extends Music21Exception {
    constructor(message) {
        super(message);
    }
}

