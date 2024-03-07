import * as prebase from './prebase';
/**
 * Object mapping int to name, as in `{1: 'whole'}` etc.
 */
export declare const typeFromNumDict: {
    1: string;
    2: string;
    4: string;
    8: string;
    16: string;
    32: string;
    64: string;
    128: string;
    256: string;
    512: string;
    1024: string;
    2048: string;
    0: string;
    '0.5': string;
    '0.25': string;
    '0.125': string;
    '0.0625': string;
};
export declare const quarterTypeIndex = 6;
export declare const ordinalTypeFromNum: string[];
export declare const vexflowDurationArray: string[];
/**
 * Duration object; found as the `.duration` attribute on Music21Object instances
 * such as music21.note.Note
 */
export declare class Duration extends prebase.ProtoM21Object {
    static get className(): string;
    isGrace: boolean;
    linked: boolean;
    protected _quarterLength: number;
    protected _dots: number;
    protected _durationNumber: any;
    protected _type: string;
    protected _tuplets: Tuplet[];
    constructor(ql?: string | number);
    stringInfo(): string;
    /**
     * Read or sets the number of dots on the duration.
     *
     * Updates the quarterLength
     *
     * @type {number}
     * @default 0
     * @example
     * var d = new music21.duration.Duration(2);
     * d.dots === 0; // true
     * d.dots = 1;
     * d.quarterLength == 3; // true;
     */
    get dots(): number;
    set dots(numDots: number);
    /**
     * Read or sets the quarterLength of the Duration
     *
     * Updates the type, dots, tuplets(?)
     *
     * @type {number}
     * @default 1.0
     * @example
     * var d = new music21.duration.Duration(2);
     * d.quarterLength == 2.0; // true;
     * d.quarterLength = 1.75;
     * d.dots == 2; // true
     * d.type == 'quarter'; // true
     */
    get quarterLength(): number;
    set quarterLength(ql: number);
    /**
     * Read or sets the type of the duration.
     *
     * Updates the quarterLength
     *
     * @type {string}
     * @default 'quarter'
     * @example
     * var d = new music21.duration.Duration(2);
     * d.type == 'half; // true
     * d.type = 'breve';
     * d.quarterLength == 8.0; // true
     * d.dots = 1;
     * d.type = 'quarter'; // will not change dots
     * d.quarterLength == 1.5; // true
     */
    get type(): string;
    set type(typeIn: string);
    /**
     * Reads the tuplet Array for the duration.
     *
     * The tuplet array should be considered Read Only.
     * Use music21.duration.Duration#appendTuplet to
     * add a tuplet (no way to remove yet)
     */
    get tuplets(): Tuplet[];
    /**
     * Read-only: the duration expressed for VexFlow
     *
     * @type {string}
     * @default 'd'
     * @readonly
     * @example
     * var d = new music21.duration.Duration(2);
     * d.vexflowDuration == 'h'; // true;
     * d.dots = 2;
     * d.vexflowDuration == 'hdd'; // true;
     */
    get vexflowDuration(): string;
    _findDots(ql: number): number;
    updateQlFromFeatures(): void;
    updateFeaturesFromQl(): void;
    /**
     * Add a tuplet to music21j
     *
     * newTuplet - tuplet to add to `.tuplets`
     * [skipUpdateQl=false] - update the quarterLength afterward?
     */
    appendTuplet(newTuplet: Tuplet, skipUpdateQl?: boolean): this;
}
/**
 * Represents a Tuplet; found in music21.duration.Duration#tuplets
 *
 * [numberNotesActual=3] - numerator of the tuplet
 * [numberNotesNormal=2] - denominator of the tuplet
 * [durationActual] - duration or
 *     quarterLength of duration type, default music21.duration.Duration(0.5)
 * [durationNormal] - unused;
 *     see music21p for description
 */
export declare class Tuplet extends prebase.ProtoM21Object {
    static get className(): string;
    numberNotesActual: number;
    numberNotesNormal: number;
    durationActual: Duration;
    durationNormal: Duration;
    frozen: boolean;
    type: string;
    bracket: boolean;
    placement: string;
    tupletActualShow: string;
    tupletNormalShow: string;
    constructor(numberNotesActual?: number, numberNotesNormal?: number, durationActual?: Duration | number, durationNormal?: Duration | number);
    /**
     * A nice name for the tuplet.
     *
     * @type {string}
     * @readonly
     */
    get fullName(): string;
    /**
     * Set both durationActual and durationNormal for the tuplet.
     *
     * type - a duration type, such as `half`, `quarter`
     * returns A converted music21.duration.Duration matching `type`
     */
    setDurationType(type: string): Duration;
    /**
     * Sets the tuplet ratio.
     *
     * actual - number of notes in actual (e.g., 3)
     * normal - number of notes in normal (e.g., 2)
     */
    setRatio(actual: number, normal: number): void;
    /**
     * Get the quarterLength corresponding to the total length that
     * the completed tuplet (i.e., 3 notes in a triplet) would occupy.
     */
    totalTupletLength(): number;
    /**
     * The amount by which each quarter length is multiplied to get
     * the tuplet. For instance, in a normal triplet, this is 0.666
     *
     * Returns a float of the multiplier
     */
    tupletMultiplier(): number;
}
//# sourceMappingURL=duration.d.ts.map