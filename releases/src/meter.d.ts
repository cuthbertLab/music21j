/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/meter -- TimeSignature objects
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 */
import { Fraction as VFFraction } from 'vexflow';
import * as base from './base';
import * as beam from './beam';
import * as duration from './duration';
import * as stream from './stream';
import { Music21Object } from './base';
/**
 * A MUCH simpler version of the music21p TimeSignature object.
 * divisions is currently not used.
 *
 * @param {string} meterString - a string ("4/4", "3/8" etc.) to initialize the TimeSignature.
 * @property {int} [numerator=4]
 * @property {int} [denominator=4]
 * @property {number[][]} beatGroups - groupings of beats; inner arrays are numerator, denominator
 * @property {string} ratioString - a string like "4/4"
 */
export declare class TimeSignature extends base.Music21Object {
    static get className(): string;
    _numerator: number;
    _denominator: number;
    _overwrittenBarDuration: duration.Duration;
    symbol: string;
    symbolizeDenominator: boolean;
    _beatGroups: number[][];
    _overwrittenBeatCount: number;
    _overwrittenBeatDuration: duration.Duration;
    constructor(value?: string, divisions?: any);
    stringInfo(): string;
    resetValues(value?: string, divisions?: any): void;
    load(value: string, divisions?: any): void;
    get numerator(): number;
    set numerator(s: number);
    get denominator(): number;
    set denominator(s: number);
    get ratioString(): string;
    set ratioString(meterString: string);
    get barDuration(): duration.Duration;
    set barDuration(value: duration.Duration);
    get beatGroups(): number[][];
    set beatGroups(newGroups: number[][]);
    /**
     *  Get the beatCount from the numerator, assuming fast 6/8, etc.
     *  unless .beatCount has been set manually.
     */
    get beatCount(): number;
    /**
     *  Manually set the beatCount to an int.
     */
    set beatCount(overwrite: number);
    /**
     * Gets a single duration.Duration object representing
     * the length of a beat in this time signature (using beatCount)
     * or, if set manually, it can return a list of Durations For
     * asymmetrical meters.
     */
    get beatDuration(): duration.Duration;
    /**
     * Set beatDuration to a duration.Duration object or
     * if the client can handle it, a list of Duration objects...
     */
    set beatDuration(overwrite: duration.Duration);
    /**
     * Compute the Beat Group according to this time signature.
     *
     * returns a list of numerator and denominators,
     *     find a list of beat groups.
     */
    computeBeatGroups(): number[][];
    _beat_group_as_ql(beatGroup: number[]): number;
    _beat_groups_to_fill_bar(): number[][];
    offsetToIndex(qLenPos: number, { includeCoincidentBoundaries }?: {
        includeCoincidentBoundaries?: boolean;
    }): number;
    /**
     * Return a span of [start, end] for the current beat/beam grouping
     */
    offsetToSpan(offset: number): number[];
    /**
     * srcStream - a stream of elements.
     * options - an object with measureStartOffset
     */
    getBeams(srcStream: stream.Stream, options?: {}): beam.Beams[];
    /**
     *  Return the measure offset based on a Measure, if it exists,
     *  otherwise based on meter modulus of the TimeSignature.
     */
    getMeasureOffsetOrMeterModulusOffset(el: Music21Object): number;
    /**
     *  Given a quarter length position into the meter, return a numerical progress
        through the beat (where beats count from one) with a floating-point or fractional value
        between 0 and 1 appended to this value that gives the proportional progress into the beat.

        For faster, integer values, use simply `.getBeat()`

        NOTE: currently returns floats only, no fractions.

        TODO: this does not allow for irregular beat proportions
     */
    getBeatProportion(qLenPos: number): number;
    /**
     * Compute the Beat Group according to this time signature for VexFlow. For beaming.
     *
     * returns a list of numerator and denominator groups, for VexFlow, as Vex.Flow.Fraction[]
     */
    vexflowBeatGroups(): VFFraction[];
}
//# sourceMappingURL=meter.d.ts.map