import * as note from './note';
import * as prebase from './prebase';
import * as pitch from './pitch';
/**
 * Interval Directions as an Object/map
 *
 * @memberof music21.interval
 * @example
 * if (music21.interval.Direction.OBLIQUE >
 *     music21.interval.Direction.ASCENDING ) {
 *    console.log(music21.interval.Direction.DESCENDING);
 * }
 *
 */
export declare const Direction: {
    DESCENDING: number;
    OBLIQUE: number;
    ASCENDING: number;
};
/**
 * N.B. a dict in music21p -- the indexes here let Direction call them + 1
 *
 * @memberof music21.interval
 * @example
 * console.log(music21.interval.IntervalDirectionTerms[music21l.interval.Direction.OBLIQUE + 1])
 * // "Oblique"
 */
export declare const IntervalDirectionTerms: string[];
/**
 * ordinals for music terms...
 *
 * @memberof music21.interval
 * @example
 * for (var i = 1; // N.B. 0 = undefined
 *      i < music21.interval.MusicOrdinals.length;
 *      i++) {
 *     console.log(i, music21.interval.MusicOrdinals[i]);
 * }
 * // 1, Unison
 * // 2, Second
 * // 3, Third
 * // ...
 * // 8, Octave
 * // ...
 * // 15, Double Octave
 */
export declare const MusicOrdinals: string[];
/**
 * Represents an interval such as unison, second, etc.
 *
 * Properties are demonstrated below.
 *
 * @class GenericInterval
 * @memberof music21.interval
 * @param {number} [gi=1] - generic interval (1 or higher, or -2 or lower)
 * @example
 * var gi = new music21.interval.GenericInterval(-14)
 * gi.value
 * // -14
 * gi.directed
 * // -14
 * gi.undirected
 * // 14
 * gi.direction == music21.interval.Direction.DESCENDING
 * // true
 * gi.isSkip
 * // true
 * gi.isStep
 * // false
 * gi.isDiatonicStep
 * // false  // augmented unisons are not diatonicSteps but can't tell yet..
 * gi.isUnison
 * // false
 * gi.simpledDirected
 * // -7
 * gi.simpleUndirected
 * // 7
 * gi.undirectedOctaves
 * // 1
 * gi.semiSimpleUndirected
 * // 7  -- semiSimple distinguishes between 8 and 1; that's all
 * gi.semiSimpleDirected
 * // 7  -- semiSimple distinguishes between 8 and 1; that's all
 * gi.perfectable
 * // false
 * gi.niceName
 * // "Fourteenth"
 * gi.directedNiceName
 * // "Descending Fourteenth"
 * gi.simpleNiceName
 * // "Seventh"
 * gi.staffDistance
 * // -13
 * gi.mod7inversion
 * // 2  // sevenths invert to seconds
 *
 */
export declare class GenericInterval extends prebase.ProtoM21Object {
    static get className(): string;
    value: number;
    directed: number;
    undirected: number;
    direction: number;
    isSkip: boolean;
    isDiatonicStep: boolean;
    isStep: boolean;
    isUnison: boolean;
    simpleUndirected: number;
    undirectedOctaves: number;
    semiSimpleUndirected: number;
    octaves: number;
    simpleDirected: number;
    semiSimpleDirected: number;
    perfectable: boolean;
    niceName: string;
    simpleNiceName: string;
    semiSimpleNiceName: string;
    staffDistance: number;
    mod7inversion: number;
    mod7: number;
    constructor(gi: number);
    /**
     * Returns a new GenericInterval which is the mod7inversion; 3rds (and 10ths etc.) to 6ths, etc.
     *
     * @returns {music21.interval.GenericInterval}
     */
    complement(): GenericInterval;
    /**
     * Returns a new GenericInterval which has the opposite direction
     * (descending becomes ascending, etc.)
     *
     * @returns {music21.interval.GenericInterval}
     */
    reverse(): GenericInterval;
    /**
     * Given a specifier, return a new DiatonicInterval with this generic.
     *
     * @param {string|number} specifier - a specifier such as "P", "m", "M", "A", "dd" etc.
     * @returns {music21.interval.DiatonicInterval}
     */
    getDiatonic(specifier: string | number): DiatonicInterval;
    /**
     * Transpose a pitch by this generic interval, maintaining accidentals
     *
     * @param {music21.pitch.Pitch} p
     * @returns {music21.pitch.Pitch}
     */
    transposePitch(p: pitch.Pitch): pitch.Pitch;
}
export declare const IntervalSpecifiersEnum: {
    PERFECT: number;
    MAJOR: number;
    MINOR: number;
    AUGMENTED: number;
    DIMINISHED: number;
    DBLAUG: number;
    DBLDIM: number;
    TRPAUG: number;
    TRPDIM: number;
    QUADAUG: number;
    QUADDMIN: number;
};
export declare const IntervalNiceSpecNames: string[];
export declare const IntervalPrefixSpecs: string[];
export declare const IntervalOrderedPerfSpecs: string[];
export declare const IntervalPerfSpecifiers: number[];
export declare const IntervalPerfOffset = 4;
export declare const IntervalOrderedImperfSpecs: string[];
export declare const IntervalSpecifiers: number[];
export declare const IntervalMajOffset = 5;
export declare const IntervalSemitonesGeneric: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
};
export declare const IntervalAdjustPerfect: {
    P: number;
    A: number;
    AA: number;
    AAA: number;
    AAAA: number;
    d: number;
    dd: number;
    ddd: number;
    dddd: number;
};
export declare const IntervalAdjustImperf: {
    M: number;
    m: number;
    A: number;
    AA: number;
    AAA: number;
    AAAA: number;
    d: number;
    dd: number;
    ddd: number;
    dddd: number;
};
/**
 * Represents a Diatonic interval.  See example for usage.
 *
 * @class DiatonicInterval
 * @memberof music21.interval
 * @param {string|number|undefined} [specifier='P'] - a specifier such as "P", "d", "m", "M" etc.
 * @param {music21.interval.GenericInterval|number} [generic=1] - a `GenericInterval`
 *              object or a number to be converted to one
 * @example
 * var di = new music21.interval.DiatonicInterval("M", 10);
 * di.generic.isClassOrSubclass('GenericInterval');
 * // true
 * di.specifierAbbreviation;
 * // 'M'
 * di.name;
 * // 'M10'
 * di.direction == music21.interval.Direction.ASCENDING;
 * // true
 * di.niceName
 * // "Major Tenth"
 *
 * // See music21p for more possibilities.
 */
export declare class DiatonicInterval extends prebase.ProtoM21Object {
    static get className(): string;
    name: string;
    specifier: number;
    generic: GenericInterval;
    direction: number;
    niceName: string;
    simpleName: string;
    simpleNiceName: string;
    semiSimpleName: string;
    semiSimpleNiceName: string;
    directedName: string;
    directedNiceName: string;
    directedSimpleName: string;
    directedSimpleNiceName: string;
    directedSemiSimpleNiceName: string;
    directedSemiSimpleName: string;
    specificName: string;
    perfectable: boolean;
    isDiatonicStep: boolean;
    isStep: boolean;
    isSkip: boolean;
    orderedSpecifierIndex: number;
    invertedOrderedSpecIndex: number;
    invertedOrderedSpecifier: string;
    mod7inversion: string;
    constructor(specifier: string | number, generic: any);
    /**
     * Returns a ChromaticInterval object of the same size.
     *
     * @returns {music21.interval.ChromaticInterval}
     */
    getChromatic(): ChromaticInterval;
    /**
     *
     * @param {music21.pitch.Pitch} p
     * @returns {music21.pitch.Pitch}
     */
    transposePitch(p: pitch.Pitch): pitch.Pitch;
    /**
     *
     * @type {string}
     */
    get specifierAbbreviation(): string;
    /**
     *
     * @returns {number}
     */
    get cents(): number;
}
/**
 * @class ChromaticInterval
 * @memberof music21.interval
 * @param {number} value - number of semitones (positive or negative)
 * @property {number} cents
 * @property {number} value
 * @property {number} undirected - absolute value of value
 * @property {number} mod12 - reduction to one octave
 * @property {number} intervalClass - reduction to within a tritone (11 = 1, etc.)
 *
 */
export declare class ChromaticInterval extends prebase.ProtoM21Object {
    static get className(): string;
    semitones: number;
    cents: number;
    directed: number;
    undirected: number;
    direction: number;
    mod12: number;
    simpleUndirected: number;
    simpleDirected: number;
    intervalClass: number;
    isChromaticStep: boolean;
    constructor(value?: number);
    /**
     *
     * @returns {music21.interval.ChromaticInterval}
     */
    reverse(): ChromaticInterval;
    /**
     * Transposes pitches but does not maintain accidentals, etc.
     *
     * @property {music21.pitch.Pitch} p - pitch to transpose
     * @returns {music21.pitch.Pitch}
     */
    transposePitch(p: pitch.Pitch): pitch.Pitch;
}
export declare const IntervalStepNames: string[];
/**
 * @function music21.interval.convertDiatonicNumberToStep
 * @memberof music21.interval
 * @param {number} dn - diatonic number, where 29 = C4, C#4 etc.
 * @returns {Array} two element array of {string} stepName and {number} octave
 */
export declare function convertDiatonicNumberToStep(dn: number): [string, number];
/**
 * This is the main, powerful Interval class.
 *
 * Instantiate with either a string ("M3") or two {@link music21.pitch.Pitch} or two {@link music21.note.Note}
 *
 * See music21p instructions for usage.
 *
 * @class Interval
 * @memberof music21.interval
 * @example
 * var n1 = new music21.note.Note("C4");
 * var n2 = new music21.note.Note("F#5");
 * var iv = new music21.interval.Interval(n1, n2);
 * iv.isConsonant();
 * // false
 * iv.semitones;
 * // 18
 * iv.niceName
 * // "Augmented Eleventh"
 */
export declare class Interval extends prebase.ProtoM21Object {
    static get className(): string;
    diatonic: DiatonicInterval;
    generic: GenericInterval;
    chromatic: ChromaticInterval;
    protected _noteStart: note.Note;
    protected _noteEnd: note.Note;
    direction: number;
    specifier: number;
    diatonicType: number;
    name: string;
    niceName: string;
    simpleName: string;
    simpleNiceName: string;
    semiSimpleName: string;
    semiSimpleNiceName: string;
    directedName: string;
    directedNiceName: string;
    directedSimpleName: string;
    directedSimpleNiceName: string;
    isDiatonicStep: boolean;
    isChromaticStep: boolean;
    semitones: number;
    intervalClass: number;
    cents: number;
    isStep: boolean;
    isSkip: boolean;
    constructor(...restArgs: any[]);
    /**
     *
     * @returns {music21.interval.Interval}
     */
    get complement(): Interval;
    reinit(): void;
    /**
     *
     * @type {music21.note.Note|undefined}
     */
    get noteStart(): note.Note;
    set noteStart(n: note.Note);
    /**
     *
     * @type {music21.note.Note|undefined}
     */
    get noteEnd(): note.Note;
    set noteEnd(n: note.Note);
    /**
     * @returns {Boolean}
     */
    isConsonant(): boolean;
    /**
     * TODO: maxAccidental
     *
     * @param {music21.pitch.Pitch} p - pitch to transpose
     * @param {Object} config - configuration
     * @param {boolean} [config.reverse=false] -- reverse direction
     * @param {number} [config.maxAccidental=4] -- maximum accidentals to retain (unused)
     * @returns {music21.pitch.Pitch}
     */
    transposePitch(p: any, { reverse, maxAccidental }?: {
        reverse?: boolean;
        maxAccidental?: number;
    }): pitch.Pitch;
}
export declare function intervalFromGenericAndChromatic(gInt: any, cInt: any): Interval;
/**
 * Convert two notes or pitches to a GenericInterval;
 */
export declare function notesToGeneric(n1: any, n2: any): GenericInterval;
export declare function convertStaffDistanceToInterval(staffDist: any): any;
export declare function notesToChromatic(n1: any, n2: any): ChromaticInterval;
export declare function intervalsToDiatonic(gInt: any, cInt: any): DiatonicInterval;
export declare function _getSpecifierFromGenericChromatic(gInt: any, cInt: any): number;
/**
 *
 * @param {music21.interval.Interval[]} intervalList
 * @returns {music21.interval.Interval}
 */
export declare function add(intervalList: any): Interval;
//# sourceMappingURL=interval.d.ts.map