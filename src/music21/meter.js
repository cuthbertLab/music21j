/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/meter -- TimeSignature objects
 *
 *
 * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
 *
 */
import Vex from 'vexflow';

import { base } from './base.js';
import { beam } from './beam.js';
import { common } from './common.js';
import * as duration from './duration.js';

/**
 * meter module. See {@link music21.meter} namespace for details.
 *
 * @exports music21/meter
 */

/**
 * Meter and TimeSignature Classes (esp. {@link music21.meter.TimeSignature} ) and methods.
 *
 * @namespace music21.meter
 * @memberof music21
 * @requires music21/base
 * @requires music21/duration
 */
export const meter = {};

/**
 * A MUCH simpler version of the music21p TimeSignature object.
 *
 * @class TimeSignature
 * @memberof music21.meter
 * @extends music21.base.Music21Object
 * @param {string} meterString - a string ("4/4", "3/8" etc.) to initialize the TimeSignature.
 * @property {int} [numerator=4]
 * @property {int} [denominator=4]
 * @property {int[][]} beatGroups - groupings of beats; inner arrays are numerator, denominator
 * @property {string} ratioString - a string like "4/4"
 * @property {music21.duration.Duration} barDuration - a Duration object representing the expressed total length of the TimeSignature.
 */
export class TimeSignature extends base.Music21Object {
    constructor(meterString) {
        super();
        this.classSortOrder = 4;

        this._numerator = 4;
        this._denominator = 4;
        this._beatGroups = [];
        this._overwrittenBeatCount = undefined;
        this._overwrittenBeatDuration = undefined;
        if (typeof meterString === 'string') {
            this.ratioString = meterString;
        }
    }

    /**
     *
     * @returns {string}
     */
    stringInfo() {
        return this.ratioString;
    }

    /**
     *
     * @type {number}
     */
    get numerator() {
        return this._numerator;
    }

    set numerator(s) {
        this._numerator = s;
    }

    /**
     *
     * @type {number}
     */
    get denominator() {
        return this._denominator;
    }

    set denominator(s) {
        this._denominator = s;
    }

    /**
     *
     * @type {string}
     */
    get ratioString() {
        return this.numerator.toString() + '/' + this.denominator.toString();
    }

    set ratioString(meterString) {
        const meterList = meterString.split('/');
        this.numerator = parseInt(meterList[0]);
        this.denominator = parseInt(meterList[1]);
        this._beatGroups = [];
    }

    /**
     *
     * @type {music21.duration.Duration}
     */
    get barDuration() {
        const ql = 4.0 * this._numerator / this._denominator;
        return new duration.Duration(ql);
    }

    get beatGroups() {
        if (this._beatGroups.length === 0) {
            this._beatGroups = this.computeBeatGroups();
        }
        return this._beatGroups;
    }

    set beatGroups(newGroups) {
        this._beatGroups = newGroups;
    }

    /**
     *  Get the beatCount from the numerator, assuming fast 6/8, etc.
     *  unless .beatCount has been set manually.
     *  @type {number}
     */
    get beatCount() {
        if (this._overwrittenBeatCount !== undefined) {
            return this._overwrittenBeatCount;
        }
        if (this.numerator > 3 && this.numerator % 3 === 0) {
            return this.numerator / 3;
        } else {
            return this.numerator;
        }
    }

    /**
     *  Manually set the beatCount to an int.
     */
    set beatCount(overwrite) {
        this._overwrittenBeatCount = overwrite;
        return overwrite;
    }

    /**
     * Gets a single duration.Duration object representing
     * the length of a beat in this time signature (using beatCount)
     * or, if set manually, it can return a list of Durations For
     * asymmetrical meters.
     */
    get beatDuration() {
        const dur = this.barDuration;
        dur.quarterLength /= this.beatCount;
        return dur;
    }

    /**
     * Set beatDuration to a duration.Duration object or
     * if the client can handle it, a list of Duration objects...
     */
    set beatDuration(overwrite) {
        this._overwrittenBeatDuration = overwrite;
    }

    /**
     * Compute the Beat Group according to this time signature.
     *
     * @returns {Array<Array<int>>} a list of numerator and denominators, find a list of beat groups.
     */
    computeBeatGroups() {
        const tempBeatGroups = [];
        let numBeats = this.numerator;
        let beatValue = this.denominator;
        if (beatValue < 8 && numBeats >= 5) {
            const beatsToEighthNoteRatio = 8 / beatValue; // hopefully Int -- right Brian Ferneyhough?
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

    /**
     * Return a span of [start, end] for the current beat/beam grouping
     */
    offsetToSpan(offset) {
        const beatDuration = this.beatDuration.quarterLength;
        const beatsFromStart = Math.floor(offset / beatDuration);
        const start = beatsFromStart * beatDuration;
        const end = start + beatDuration;
        return [start, end];
    }

    /**
     * @param {music21.stream.Stream} srcStream - a stream of elements.
     * @param {Object} options - an object with measureStartOffset
     */
    getBeams(srcStream, options) {
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
            if (start === archetypeSpanStart && end === archetypeSpanEnd) {
                beamsList[i] = undefined;
                return;
            }

            let beamType;
            if (isFirst) {
                beamType = 'start';
                if (beamNext === undefined || !(beamNext.getNumbers().includes(beamNumber))) {
                    beamType = 'partial-right';
                }
            } else if (isLast) {
                beamType = 'start';
                if (beamPrevious === undefined || !beamPrevious.getNumbers().includes(beamNumber)) {
                    beamType = 'partial-left';
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

        for (let depth = 0; depth < beam.beamableDurationTypes.length; depth++) {
            let i = 0;
            for (const el of srcStream) {
                fixBeamsOneElementDepth(i, el, depth);
                i += 1;
            }
        }

        beamsList = beam.Beams.sanitizePartialBeams(beamsList);
        beamsList = beam.Beams.mergeConnectingPartialBeams(beamsList);
        return beamsList;
    }

    /**
     * Compute the Beat Group according to this time signature for VexFlow. For beaming.
     *
     * @returns {Array<Vex.Flow.Fraction>} a list of numerator and denominator groups, for VexFlow
     */
    vexflowBeatGroups() {
        const tempBeatGroups = this.beatGroups;
        // console.log(tempBeatGroups);
        const vfBeatGroups = [];
        for (let i = 0; i < tempBeatGroups.length; i++) {
            const bg = tempBeatGroups[i];
            vfBeatGroups.push(new Vex.Flow.Fraction(bg[0], bg[1]));
        }
        return vfBeatGroups;

        //  if (numBeats % 3 == 0 && beatValue < 4) {
        //  // 6/8, 3/8, 9/8, etc.
        //  numBeats = numBeats / 3;
        //  beatValue = beatValue / 3;
        //  }
    }
}

meter.TimeSignature = TimeSignature;
