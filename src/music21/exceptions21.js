/**
 * @namespace music21.exceptions21
 */

// this is not completely working properly...

/**
 * @memberof music21.exceptions21
 */
class ExtendableError extends Error {
    constructor(message) {
        super();
        // restore prototype chain
        const actualProto = new.target.prototype;

        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        } else {
            this.__proto__ = actualProto;
        }
        this.name = this.constructor.name;
        this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(message).stack;
        }
    }
}

/**
 * @memberof music21.exceptions21
 */
export class Music21Exception extends ExtendableError {}

/**
 * @memberof music21.exceptions21
 */
export class StreamException extends Music21Exception {}
