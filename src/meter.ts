/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/meter -- TimeSignature objects
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 */
import { Fraction } from 'vexflow';

import * as base from './base';
import * as beam from './beam';
import * as common from './common';
import * as duration from './duration';

// imports for typing
import * as stream from './stream';
import {Music21Object} from './base';
import { Music21Exception } from './exceptions21';

/**
 * A MUCH simpler version of the music21p TimeSignature object.
 *
 * @param {string} meterString - a string ("4/4", "3/8" etc.) to initialize the TimeSignature.
 * @property {int} [numerator=4]
 * @property {int} [denominator=4]
 * @property {number[][]} beatGroups - groupings of beats; inner arrays are numerator, denominator
 * @property {string} ratioString - a string like "4/4"
 */
export class TimeSignature extends base.Music21Object {
    static get className() { return 'music21.meter.TimeSignature'; }

    _numerator: number = 4;
    _denominator: number = 4;
    _overwrittenBarDuration;
    symbol: string = '';
    symbolizeDenominator: boolean = false;

    // music21j simple attributes;
    _beatGroups: number[][] = [];
    _overwrittenBeatCount;
    _overwrittenBeatDuration;

    constructor(value: string = '4/4', divisions?) {
        super();
        this.classSortOrder = 4;
        this.resetValues(value, divisions);
    }

    stringInfo(): string {
        return this.ratioString;
    }

    resetValues(value: string = '4/4', divisions?) {
        this.symbol = '';
        this.symbolizeDenominator = false;
        this._overwrittenBarDuration = undefined;

        // m21j only, simple functions
        this._beatGroups = [];
        this._overwrittenBeatCount = undefined;
        this._overwrittenBeatDuration = undefined;

        this.load(value, divisions);
    }

    load(value: string, divisions?) {
        const valueLower = value.toLowerCase();
        if (valueLower === 'common' || valueLower === 'c') {
            value = '4/4';
            this.symbol = 'common';
        } else if (valueLower === 'cut' || valueLower === 'allabreve') {
            value = '2/2';
            this.symbol = 'cut';
        }
        const meterList = value.split('/');
        this.numerator = parseInt(meterList[0]);
        this.denominator = parseInt(meterList[1]);
    }

    // loadRatio is deprecated in m21p so not implemented here.

    get numerator(): number {
        return this._numerator;
    }

    set numerator(s: number) {
        this._numerator = s;
    }

    get denominator(): number {
        return this._denominator;
    }

    set denominator(s: number) {
        this._denominator = s;
    }

    get ratioString(): string {
        return this.numerator.toString() + '/' + this.denominator.toString();
    }

    set ratioString(meterString: string) {
        this.resetValues(meterString);
    }

    get barDuration(): duration.Duration {
        if (this._overwrittenBarDuration) {
            return this._overwrittenBarDuration;
        }
        const ql = 4.0 * this._numerator / this._denominator;
        return new duration.Duration(ql);
    }

    set barDuration(value: duration.Duration) {
        this._overwrittenBarDuration = value;
    }

    get beatGroups(): number[][] {
        if (this._beatGroups.length === 0) {
            this._beatGroups = this.computeBeatGroups();
        }
        return this._beatGroups;
    }

    set beatGroups(newGroups: number[][]) {
        this._beatGroups = newGroups;
    }

    /**
     *  Get the beatCount from the numerator, assuming fast 6/8, etc.
     *  unless .beatCount has been set manually.
     */
    get beatCount(): number {
        if (this._overwrittenBeatCount !== undefined) {
            return this._overwrittenBeatCount;
        }
        if (this.numerator % 3 === 0) {
            if (this.numerator > 3 || this.denominator >= 8) {
                // 6/8, 9/8, 12/8, and 6/4, 6/2, 9/2, etc.
                // and 3/8, 3/16, 3/32 but not 3/4, 3/2, etc.
                return this.numerator / 3;
            } else {
                return this.numerator;
            }
        } else {
            return this.numerator;
        }
    }

    /**
     *  Manually set the beatCount to an int.
     */
    set beatCount(overwrite: number) {
        this._overwrittenBeatCount = overwrite;
    }

    /**
     * Gets a single duration.Duration object representing
     * the length of a beat in this time signature (using beatCount)
     * or, if set manually, it can return a list of Durations For
     * asymmetrical meters.
     */
    get beatDuration(): duration.Duration {
        const dur = this.barDuration;
        dur.quarterLength /= this.beatCount;
        return dur;
    }

    /**
     * Set beatDuration to a duration.Duration object or
     * if the client can handle it, a list of Duration objects...
     */
    set beatDuration(overwrite: duration.Duration) {
        this._overwrittenBeatDuration = overwrite;
    }

    /**
     * Compute the Beat Group according to this time signature.
     *
     * returns a list of numerator and denominators,
     *     find a list of beat groups.
     */
    computeBeatGroups(): number[][] {
        const tempBeatGroups = [];
        let numBeats = this.numerator;
        let beatValue = this.denominator;
        if (beatValue < 8 && numBeats >= 5) {
            const beatsToEighthNoteRatio = 8 / beatValue;
            // hopefully beatValue is an int -- right Brian Ferneyhough?
            beatValue = 8;
            numBeats *= beatsToEighthNoteRatio;
        }

        if (beatValue >= 8) {
            while (numBeats >= 5) {
                tempBeatGroups.push([3, beatValue]);
                numBeats -= 3;
            }
            if (numBeats === 4) {
                tempBeatGroups.push([2, beatValue]);
                tempBeatGroups.push([2, beatValue]);
            } else if (numBeats > 0) {
                tempBeatGroups.push([numBeats, beatValue]);
            }
        } else if (beatValue === 2) {
            tempBeatGroups.push([1, 2]);
        } else if (beatValue <= 1) {
            tempBeatGroups.push([1, 1]);
        } else {
            // 4/4, 2/4, 3/4, standard stuff
            tempBeatGroups.push([2, 8]);
        }
        return tempBeatGroups;
    }

    offsetToIndex(
        qLenPos: number,
        {includeCoincidentBoundaries = false}: {includeCoincidentBoundaries?: boolean} = {},
    ): number {
        // This should be a method on a MeterSequence.
        if (qLenPos >= this.barDuration.quarterLength || qLenPos < 0) {
            throw new Music21Exception(
                `cannot access from qLenPos ${qLenPos} `
                + `where total duration is ${this.barDuration.quarterLength}`
            );
        }
        // DOES NOT SUPPORT irregular beats yet...
        const beatDuration = this.beatDuration;
        // does not support includeCoincidentBoundaries yet.
        return Math.floor(qLenPos / beatDuration.quarterLength);
    }

    /**
     * Return a span of [start, end] for the current beat/beam grouping
     */
    offsetToSpan(offset: number): number[] {
        const beatDuration = this.beatDuration.quarterLength;
        const beatsFromStart = Math.floor(offset / beatDuration);
        const start = beatsFromStart * beatDuration;
        const end = start + beatDuration;
        return [start, end];
    }

    /**
     * srcStream - a stream of elements.
     * options - an object with measureStartOffset
     */
    getBeams(srcStream: stream.Stream, options={}) {
        const params = { measureStartOffset: 0.0 };
        common.merge(params, options);
        const measureStartOffset = params.measureStartOffset;
        let beamsList = beam.Beams.naiveBeams(srcStream);
        beamsList = beam.Beams.removeSandwichedUnbeamables(beamsList);
        const fixBeamsOneElementDepth = (i, el, depth) => {
            const beams = beamsList[i];
            if (!beams) {
                return;
            }

            if (el.duration.quarterLength >= this.beatDuration.quarterLength) {
                beamsList[i] = undefined;
                return;
            }

            const beamNumber = depth + 1;
            if (!(beams.getNumbers().includes(beamNumber))) {
                return;
            }
            const dur = el.duration;
            const pos = el.offset + measureStartOffset;

            const start = pos; // opFrac
            const end = pos + dur.quarterLength; // opFrac;
            const startNext = end;
            const isLast = (i === srcStream.length - 1);
            const isFirst = (i === 0);
            let beamNext;
            let beamPrevious;
            if (!isFirst) {
                beamPrevious = beamsList[i - 1];
            }
            if (!isLast) {
                beamNext = beamsList[i + 1];
            }
            const [archetypeSpanStart, archetypeSpanEnd] = this.offsetToSpan(start);
            let archetypeSpanNextStart = 0.0;
            if (beamNext !== undefined) {
                archetypeSpanNextStart = this.offsetToSpan(startNext)[0];
            }
            if (end === archetypeSpanEnd && (
                start === archetypeSpanStart || (beamPrevious === undefined && beamNumber === 1))) {
                beamsList[i] = undefined;
                return;
            }

            let beamType;
            if (isFirst && measureStartOffset === 0.0) {
                beamType = 'start';
                if (beamNext === undefined || !(beamNext.getNumbers().includes(beamNumber))) {
                    beamType = 'partial-right';
                }
            } else if (isLast) {
                beamType = 'stop';
                if (beamPrevious === undefined || !beamPrevious.getNumbers().includes(beamNumber)) {
                    beamType = 'partial-left';
                } else if (beamPrevious && beamPrevious.getTypeByNumber(beamNumber) === 'stop') {
                    beamsList[i] = undefined;
                }
            } else if (beamPrevious === undefined || !beamPrevious.getNumbers().includes(beamNumber)) {
                if (beamNumber === 1 && beamNext === undefined) {
                    beamsList[i] = undefined;
                    return;
                } else if (beamNext === undefined && beamNumber > 1) {
                    beamType = 'partial-left';
                } else if (startNext >= archetypeSpanEnd) {
                    beamType = 'partial-left';
                } else if (beamNext === undefined || !(beamNext.getNumbers().includes(beamNumber))) {
                    beamType = 'partial-right';
                } else {
                    beamType = 'start';
                }
            } else if (beamPrevious
                        && beamPrevious.getNumbers().includes(beamNumber)
                        && ['stop', 'partial-left'].includes(beamPrevious.getTypeByNumber(beamNumber))
            ) {
                if (beamNext !== undefined) {
                    beamType = 'start';
                } else {
                    beamType = 'partial-left';
                }
            } else if (beamNext === undefined || !beamNext.getNumbers().includes(beamNumber)) {
                beamType = 'stop';
            } else if (startNext < archetypeSpanEnd) {
                beamType = 'continue';
            } else if (startNext >= archetypeSpanNextStart) {
                beamType = 'stop';
            } else {
                console.warn('Cannot match beamType');
                return;
            }
            beams.setByNumber(beamNumber, beamType);
        };

        const elList = Array.from(srcStream);
        for (let depth = 0; depth < beam.beamableDurationTypes.length; depth++) {
            for (let i = 0; i < elList.length; i++) {
                const el = elList[i];
                fixBeamsOneElementDepth(i, el, depth);
            }
        }

        beamsList = beam.Beams.sanitizePartialBeams(beamsList);
        beamsList = beam.Beams.mergeConnectingPartialBeams(beamsList);
        return beamsList;
    }

    /**
     *  Return the measure offset based on a Measure, if it exists,
     *  otherwise based on meter modulus of the TimeSignature.
     */
    getMeasureOffsetOrMeterModulusOffset(el: Music21Object) {
        const mOffset = el._getMeasureOffset();
        const tsMeasureOffset = this._getMeasureOffset({includeMeasurePadding: false});
        if ((mOffset + tsMeasureOffset) < this.barDuration.quarterLength) {
            return mOffset;
        } else {
            const post = common.posMod((mOffset - tsMeasureOffset), this.barDuration.quarterLength);
            return post;
        }
    }

    /**
     *  Given a quarter length position into the meter, return a numerical progress
        through the beat (where beats count from one) with a floating-point or fractional value
        between 0 and 1 appended to this value that gives the proportional progress into the beat.

        For faster, integer values, use simply `.getBeat()`

        NOTE: currently returns floats only, no fractions.

        TODO: this does not allow for irregular beat proportions
     */
    getBeatProportion(qLenPos: number): number {
        const beatIndex = this.offsetToIndex(qLenPos);
        const [start, end] = this.offsetToSpan(qLenPos);
        const totalRange = end - start;
        const progress = qLenPos - start;
        return beatIndex + 1 + (progress / totalRange);
    }

    /**
     * Compute the Beat Group according to this time signature for VexFlow. For beaming.
     *
     * returns a list of numerator and denominator groups, for VexFlow, as Vex.Flow.Fraction[]
     */
    vexflowBeatGroups(): Fraction[] {
        const tempBeatGroups = this.beatGroups;
        const vfBeatGroups = [];
        for (let i = 0; i < tempBeatGroups.length; i++) {
            const [bg_numerator, bg_denominator] = tempBeatGroups[i];
            vfBeatGroups.push(new Fraction(bg_numerator, bg_denominator));
        }
        return vfBeatGroups;

        //  if (numBeats % 3 == 0 && beatValue < 4) {
        //  // 6/8, 3/8, 9/8, etc.
        //  numBeats = numBeats / 3;
        //  beatValue = beatValue / 3;
        //  }
    }
}
