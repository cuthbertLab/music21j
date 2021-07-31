import type * as stream from './stream';
/**
 *
 * @property {boolean} debug
 * @property {Array<string>} knownUnparsables - list of classes that cannot be parsed
 * @property {Object} handlers - object mapping string names of classes to a set of
 * function calls to perform when restoring or post-restoring.
 * (too complicated to explain; read the code)
 */
export declare class Converter {
    debug: boolean;
    knownUnparsables: string[];
    handlers: any;
    currentPart: any;
    lastClef: any;
    lastKeySignature: any;
    lastTimeSignature: any;
    constructor();
    /**
     * Fixes up some references that cannot be unpacked from jsonpickle.
     *
     * s - stream after unpacking from jsonpickle
     */
    streamPostRestore(s: stream.Stream): stream.Stream;
    /**
     * Run the main decoder
     */
    run(jss: any): any;
}
//# sourceMappingURL=fromPython.d.ts.map