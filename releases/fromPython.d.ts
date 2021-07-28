/**
 *
 * @class Converter
 * @memberof music21.fromPython
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
     * @param {music21.stream.Stream} s - stream after unpacking from jsonpickle
     * @returns {music21.stream.Stream}
     */
    streamPostRestore(s: any): any;
    /**
     * Run the main decoder
     *
     * @param {string} jss - stream encoded as JSON
     * @returns {music21.stream.Stream}
     */
    run(jss: any): any;
}
//# sourceMappingURL=fromPython.d.ts.map