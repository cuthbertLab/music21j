/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/meter -- TimeSignature objects
 *
 *
 * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
 *
 */
import * as Vex from 'vexflow';

import { base } from './base.js';
import { beam } from './beam.js';
import { common } from './common.js';
import { duration } from './duration.js';

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

const beamableDurationTypes = [
    duration.typeFromNumDict[8],
    duration.typeFromNumDict[16], duration.typeFromNumDict[32],
    duration.typeFromNumDict[64], duration.typeFromNumDict[128],
    duration.typeFromNumDict[256],    
];

/**
 * A MUCH simpler version of the music21p TimeSignature object.
 *
 * @class TimeSignature
 * @memberof music21.meter
 * @param {string} meterString - a string ("4/4", "3/8" etc.) to initialize the TimeSignature.
 * @property {Int} [numerator=4]
 * @property {Int} [denominator=4]
 * @property {Array<Array<Int>>} beatGroups - groupings of beats; inner arrays are numerator, denominator
 * @property {string} ratioString - a string like "4/4"
 * @property {music21.duration.Duration} barDuration - a Duration object representing the expressed total length of the TimeSignature.
 */
export class TimeSignature extends base.Music21Object {
    static _naiveBeams(srcList) {
        const beamsList = [];
        for (const el of srcList) {
            if (!beamableDurationTypes.includes(el.duration.type)) {
                beamsList.push(undefined);
            } else if (el.isRest) {
                beamsList.push(undefined);
            } else {
                const b = new beam.Beams();
                b.fill(el.duration.type);
                beamsList.push(b);
            }
        }
        return beamsList;
    }
    
    static _removeSandwichedUnbeamables(beamsList) {
        let beamLast;
        let beamNext;
        for (let i = 0; i < beamsList.length; i++) {
            if (i !== beamsList.length - 1) {
                beamNext = beamsList[i + 1];
            } else {
                beamNext = undefined;
            }
            if (beamLast === undefined && beamNext === undefined) {
                beamsList[i] = undefined;
            }
            beamLast = beamsList[i];
        }
        return beamsList;
    }
    
    static _sanitizePartialBeams(beamsList) {
        for (let i = 0; i < beamsList.length; i++) {
            if (beamsList[i] === undefined) {
                continue;
            }
            const allTypes = beamsList[i].getTypes();
            if (!allTypes.includes('start') 
                    && !allTypes.includes('stop')
                    && !allTypes.includes('continue')) {
                // nothing but partials;
                beamsList[i] = undefined;
                continue;
            }
            let hasStart = false;
            let hasStop = false;
            for (const b of beamsList[i].beamsList) {
                if (b.type === 'start') {
                    hasStart = true;
                    continue;
                }
                if (b.type === 'stop') {
                    hasStop = true;
                    continue;
                }
                if (hasStart && b.type === 'partial' && b.direction === 'left') {
                    b.direction = 'right';
                } else if (hasStop && b.type === 'partial' && b.direction === 'right') {
                    b.direction = 'left';
                }
            }
        }
        return beamsList;
    }
    
    static _mergeConnectingPartialBeams(beamsList) {
        for (let i = 0; i < beamsList.length - 1; i++) {
            const bThis = beamsList[i];
            const bNext = beamsList[i + 1];
            if (!bThis || !bNext) {
                continue;
            }
            const bThisNum = bThis.getNumbers();
            if (!bThisNum || bThisNum.length === 0) {
                continue;
            }
            for (const thisNum of bThisNum) {
                const thisBeam = bThis.getByNumber(thisNum);
                if (thisBeam.type !== 'partial' || thisBeam.direction !== 'right') {
                    continue;
                }
                if (!(bNext.getNumbers().includes(thisNum))) {
                    continue;
                }
                const nextBeam = bNext.getByNumber(thisNum);
                if (nextBeam.type === 'partial' || nextBeam.direction === 'right') {
                    continue;
                }
                if (nextBeam.type === 'continue' || nextBeam.type === 'stop') {
                    // should not happen.
                    continue;
                }
                thisBeam.type = 'start';
                thisBeam.direction = undefined;
                if (nextBeam.type === 'partial') {
                    nextBeam.type = 'stop';
                } else if (nextBeam.type === 'start') {
                    nextBeam.type = 'continue';
                }
                nextBeam.direction = undefined;
            }
        }
        // now fix partial-lefts that follow stops:
        for (let i = 1; i < beamsList.length; i++) {
            const bThis = beamsList[i];
            const bPrev = beamsList[i - 1];
            if (!bThis || !bPrev) {
                continue;
            }
            const bThisNum = bThis.getNumbers();
            if (!bThisNum || bThisNum.length === 0) {
                continue;
            }
            for (const thisNum of bThisNum) {
                const thisBeam = bThis.getByNumber(thisNum);
                if (thisBeam.type !== 'partial' || thisBeam.direction !== 'left') {
                    continue;
                }
                if (!(bPrev.getNumbers().includes(thisNum))) {
                    continue;
                }
                const prevBeam = bPrev.getByNumber(thisNum);
                if (prevBeam.type !== 'stop') {
                    continue;
                }
                thisBeam.type = 'stop';
                thisBeam.direction = undefined;
                prevBeam.type = 'continue';
            }
        }
        return beamsList;
    }
    
    constructor(meterString) {
        super();
        this._numerator = 4;
        this._denominator = 4;
        this._beatGroups = [];
        this._overwrittenBeatCount = undefined;
        this._overwrittenBeatDuration = undefined;
        if (typeof meterString === 'string') {
            this.ratioString = meterString;
        }
    }
    get numerator() {
        return this._numerator;
    }
    set numerator(s) {
        this._numerator = s;
    }
    get denominator() {
        return this._denominator;
    }
    set denominator(s) {
        this._denominator = s;
    }
    get ratioString() {
        return this.numerator.toString() + '/' + this.denominator.toString();
    }
    set ratioString(meterString) {
        const meterList = meterString.split('/');
        this.numerator = parseInt(meterList[0]);
        this.denominator = parseInt(meterList[1]);
        this._beatGroups = [];
    }
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
     * @memberof music21.meter.TimeSignature
     * @returns {Array<Array<Int>>} a list of numerator and denominators, find a list of beat groups.
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
     * @param {Iterable} srcStream - a stream of elements.
     * @param {object} options - an object with measureStartOffset
     */
    getBeams(srcStream, options) {
        const params = { measureStartOffset: 0.0 };
        common.merge(params, options);
        const measureStartOffset = params.measureStartOffset;
        let beamsList = TimeSignature._naiveBeams(srcStream);
        beamsList = TimeSignature._removeSandwichedUnbeamables(beamsList);
        const fixBeamsOneElementDepth = (i, el, depth) => {
            const beams = beamsList[i];
            if (!beams || beams === undefined) {
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
            } else if (beamPrevious !== undefined 
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
        
        for (let depth = 0; depth < beamableDurationTypes.length; depth++) {
            let i = 0;
            for (const el of srcStream) {
                fixBeamsOneElementDepth(i, el, depth);
                i += 1;
            }
        }
        
        beamsList = TimeSignature._sanitizePartialBeams(beamsList);
        beamsList = TimeSignature._mergeConnectingPartialBeams(beamsList);
        return beamsList;
    }
    
    /**
     * Compute the Beat Group according to this time signature for VexFlow. For beaming.
     *
     * @memberof music21.meter.TimeSignature
     * @param {Vex} Vex - a reference to the Vex object
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
