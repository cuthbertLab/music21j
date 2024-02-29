// this is not completely working properly...
class ExtendableError extends Error {
    constructor(message: string) {
        super();
        // restore prototype chain
        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, actualProto);
        this.name = this.constructor.name;
        this.message = message;
        this.stack = new Error(message).stack;
        // until this lands in Node
        // if (typeof Error.captureStackTrace === 'function') {
        //     Error.captureStackTrace(this, this.constructor);
        // } else {
        //     this.stack = new Error(message).stack;
        // }
    }
}

export class Music21Exception extends ExtendableError {}

export class StreamException extends Music21Exception {}
