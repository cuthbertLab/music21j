/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/meter -- TimeSignature objects
 *
 *
 * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
 *
 */
import * as Vex from 'vexflow';

import { base } from './base.js';
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
    constructor(meterString) {
        super();
        this.classes.push('TimeSignature');
        this._numerator = 4;
        this._denominator = 4;
        this.beatGroups = [];
        if (typeof (meterString) === 'string') {
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
    }
    get barDuration() {
        const ql = 4.0 * this._numerator / this._denominator;
        return new duration.Duration(ql);
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
        } else { // 4/4, 2/4, 3/4, standard stuff
            tempBeatGroups.push([2, 8]);
        }
        return tempBeatGroups;
    }
    /**
     * Compute the Beat Group according to this time signature for VexFlow. For beaming.
     *
     * @memberof music21.meter.TimeSignature
     * @param {Vex} Vex - a reference to the Vex object
     * @returns {Array<Vex.Flow.Fraction>} a list of numerator and denominator groups, for VexFlow
     */
    vexflowBeatGroups() {
        let tempBeatGroups;
        if (this.beatGroups.length > 0) {
            tempBeatGroups = this.beatGroups;
        } else {
            tempBeatGroups = this.computeBeatGroups();
        }
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
