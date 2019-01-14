/**
 * music21j -- Javascript reimplementation of Core music21 features.
 * music21/duration -- duration routines
 *
 * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006-18, Michael Scott Cuthbert and cuthbertLab
 *
 */
import { Music21Exception } from './exceptions21.js';

import { common } from './common.js';
import { debug } from './debug.js';
import { prebase } from './prebase.js';
/**
 * Duration module. See {@link music21.duration}
 *
 * @requires music21/common
 * @requires music21/prebase
 * @exports music21/duration
 */
/**
 * Module that holds **music21** classes and
 * tools for dealing with durations, especially
 * the {@link music21.duration.Duration} class.
 *
 * @namespace music21.duration
 * @memberof music21
 */
export const duration = {};

/**
 * Object mapping int to name, as in `{1: 'whole'}` etc.
 *
 * @memberof music21.duration
 * @type {object}
 */
duration.typeFromNumDict = {
    1: 'whole',
    2: 'half',
    4: 'quarter',
    8: 'eighth',
    16: '16th',
    32: '32nd',
    64: '64th',
    128: '128th',
    256: '256th',
    512: '512th',
    1024: '1024th',
    0: 'zero',
    '0.5': 'breve',
    '0.25': 'longa',
    '0.125': 'maxima',
    '0.0625': 'duplex-maxima',
};
duration.quarterTypeIndex = 6; // where is quarter in the following array.
duration.ordinalTypeFromNum = [
    'duplex-maxima',
    'maxima',
    'longa',
    'breve',
    'whole',
    'half',
    'quarter',
    'eighth',
    '16th',
    '32nd',
    '64th',
    '128th',
    '256th',
    '512th',
    '1024th',
];
duration.vexflowDurationArray = [
    undefined,
    undefined,
    undefined,
    undefined,
    'w',
    'h',
    'q',
    '8',
    '16',
    '32',
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
];

/**
 * Duration object; found as the `.duration` attribute on {@link music21.base.Music21Object} instances
 * such as {@link music21.note.Note}
 *
 * @class Duration
 * @memberof music21.duration
 * @extends music21.prebase.ProtoM21Object
 * @param {(number|undefined)} ql - quarterLength (default 1.0)
 */
export class Duration extends prebase.ProtoM21Object {
    constructor(ql) {
        super();
        this._quarterLength = 0.0;
        this._dots = 0;
        this._durationNumber = undefined;
        this._type = 'zero';
        this._tuplets = [];
        if (typeof ql === 'string') {
            this.type = ql;
        } else if (ql !== undefined) {
            this.quarterLength = ql;
        }
        this._cloneCallbacks._tuplets = this.cloneCallbacksTupletFunction;
    }
    
    stringInfo() {
        return this.quarterLength.toString();
    }
    
    /**
     * Read or sets the number of dots on the duration.
     *
     * Updates the quarterLength
     *
     * @type Number
     * @instance
     * @default 0
     * @memberof music21.duration.Duration
     * @example
     * var d = new music21.duration.Duration(2);
     * d.dots === 0; // true
     * d.dots = 1;
     * d.quarterLength == 3; // true;
     */
    get dots() {
        return this._dots;
    }
    set dots(numDots) {
        this._dots = numDots;
        this.updateQlFromFeatures();
    }
    /**
     * Read or sets the quarterLength of the Duration
     *
     * Updates the type, dots, tuplets(?)
     *
     * @type Number
     * @instance
     * @default 1.0
     * @memberof music21.duration.Duration
     * @example
     * var d = new music21.duration.Duration(2);
     * d.quarterLength == 2.0; // true;
     * d.quarterLength = 1.75;
     * d.dots == 2; // true
     * d.type == 'quarter'; // true
     */
    get quarterLength() {
        return this._quarterLength;
    }
    set quarterLength(ql) {
        if (ql === undefined) {
            ql = 1.0;
        }
        this._quarterLength = ql;
        this.updateFeaturesFromQl();
    }
    /**
     * Read or sets the type of the duration.
     *
     * Updates the quarterLength
     *
     * @type String
     * @instance
     * @default 'quarter'
     * @memberof music21.duration.Duration
     * @example
     * var d = new music21.duration.Duration(2);
     * d.type == 'half; // true
     * d.type = 'breve';
     * d.quarterLength == 8.0; // true
     * d.dots = 1;
     * d.type = 'quarter'; // will not change dots
     * d.quarterLength == 1.5; // true
     */
    get type() {
        return this._type;
    }
    set type(typeIn) {
        const typeNumber = duration.ordinalTypeFromNum.indexOf(typeIn);
        if (typeNumber === -1) {
            console.log('invalid type ' + typeIn);
            throw new Music21Exception('invalid type ' + typeIn);
        }
        this._type = typeIn;
        this.updateQlFromFeatures();
    }
    /**
     * Reads the tuplet Array for the duration.
     *
     * The tuplet array should be considered Read Only.
     * Use {@link music21.duration.Duration#appendTuplet} to
     * add a tuplet (no way to remove yet)
     *
     * @type Array<music21.duration.Tuplet>
     * @instance
     * @default []
     * @memberof music21.duration.Duration
     */
    get tuplets() {
        return this._tuplets;
    }
    /**
     * Read-only: the duration expressed for VexFlow
     *
     * @type String
     * @instance
     * @default 'd'
     * @memberof music21.duration.Duration
     * @example
     * var d = new music21.duration.Duration(2);
     * d.vexflowDuration == 'h'; // true;
     * d.dots = 2;
     * d.vexflowDuration == 'hdd'; // true;
     */
    get vexflowDuration() {
        const typeNumber = duration.ordinalTypeFromNum.indexOf(this.type);
        let vd = duration.vexflowDurationArray[typeNumber];
        if (this.dots > 0) {
            for (let i = 0; i < this.dots; i++) {
                vd += 'd'; // vexflow does not handle double dots .. or does it???
            }
        }
        return vd;
    }
    cloneCallbacksTupletFunction(tupletKey, ret, obj) {
        // make sure that tuplets clone properly
        const newTuplets = [];
        for (let i = 0; i < obj[tupletKey].length; i++) {
            const newTuplet = obj[tupletKey][i].clone();
            // console.log('cloning tuplets', obj[tupletKey][i], newTuplet);
            newTuplets.push(newTuplet);
        }
        ret[tupletKey] = newTuplets;
    }
    _findDots(ql) {
        if (ql === 0) {
            return 0;
        } // zero length stream probably;
        const typeNumber = duration.ordinalTypeFromNum.indexOf(this._type);
        const powerOfTwo = Math.pow(2, duration.quarterTypeIndex - typeNumber);
        // alert(undottedQL * 1.5 + " " + ql)
        // console.log('find dots called on ql: ', ql, typeNumber, powerOfTwo);
        for (let dotsNum = 0; dotsNum <= 4; dotsNum++) {
            const dotMultiplier
                = (Math.pow(2, dotsNum) - 1.0) / Math.pow(2, dotsNum);
            const durationMultiplier = 1 + dotMultiplier;
            if (Math.abs(powerOfTwo * durationMultiplier - ql) < 0.0001) {
                return dotsNum;
            }
        }
        if (debug) {
            console.log('no dots available for ql; probably a tuplet', ql);
        }
        return 0;
    }
    updateQlFromFeatures() {
        const typeNumber = duration.ordinalTypeFromNum.indexOf(this._type); // must be set property
        const undottedQuarterLength = Math.pow(
            2,
            duration.quarterTypeIndex - typeNumber
        );
        const dottedMultiplier
            = 1 + (Math.pow(2, this._dots) - 1) / Math.pow(2, this._dots);
        const unTupletedQl = undottedQuarterLength * dottedMultiplier;
        let tupletCorrectedQl = unTupletedQl;
        this._tuplets.forEach(tuplet => {
            tupletCorrectedQl *= tuplet.tupletMultiplier();
        });
        this._quarterLength = tupletCorrectedQl;
    }
    updateFeaturesFromQl() {
        const ql = this._quarterLength;
        this._tuplets = [];
        if (ql === 0) {
            this._type = 'zero';
            this._dots = 0;
            return;
        }
        const powerOfTwo = Math.floor(Math.log(ql + 0.00001) / Math.log(2));
        let typeNumber = duration.quarterTypeIndex - powerOfTwo;
        this._type = duration.ordinalTypeFromNum[typeNumber];
        // console.log(this._findDots);
        this._dots = this._findDots(ql);

        const undottedQuarterLength = Math.pow(
            2,
            duration.quarterTypeIndex - typeNumber
        );
        const dottedMultiplier
            = 1 + (Math.pow(2, this._dots) - 1) / Math.pow(2, this._dots);
        let unTupletedQl = undottedQuarterLength * dottedMultiplier;
        if (unTupletedQl !== ql && ql !== 0) {
            typeNumber -= 1;
            this._type = duration.ordinalTypeFromNum[typeNumber]; // increase type: eighth to quarter etc.
            unTupletedQl *= 2;
            const tupletRatio = ql / unTupletedQl;
            const ratioRat = common.rationalize(tupletRatio);
            if (ratioRat === undefined) {
                // probably a Stream with a length that is inexpressable;
            } else {
                const t = new duration.Tuplet(
                    ratioRat.denominator,
                    ratioRat.numerator,
                    new duration.Duration(unTupletedQl)
                );
                this.appendTuplet(t, true); // skipUpdateQl
            }
            // console.log(ratioRat, ql, unTupletedQl);
        }
        return;
    }
    /**
     * Add a tuplet to music21j
     *
     * @memberof music21.duration.Duration
     * @param {music21.duration.Tuplet} newTuplet - tuplet to add to `.tuplets`
     * @param {boolean} [skipUpdateQl=false] - update the quarterLength afterwards?
     */
    appendTuplet(newTuplet, skipUpdateQl) {
        newTuplet.frozen = true;
        this._tuplets.push(newTuplet);
        if (skipUpdateQl !== true) {
            this.updateQlFromFeatures();
        }
    }
}

duration.Duration = Duration;

/**
 * Represents a Tuplet; found in {@link music21.duration.Duration#tuplets}
 *
 * @class Tuplet
 * @memberof music21.duration
 * @extends music21.prebase.ProtoM21Object
 * @param {number} numberNotesActual - numerator of the tuplet, default 3
 * @param {number} numberNotesNormal - denominator of the tuplet, default 2
 * @param {(music21.duration.Duration|number)} durationActual - duration or quarterLength of duration type, default music21.duration.Duration(0.5)
 * @param {(music21.duration.Duration|number)} durationNormal - unused; see music21p for description
 */
export class Tuplet extends prebase.ProtoM21Object {
    constructor(
        numberNotesActual,
        numberNotesNormal,
        durationActual,
        durationNormal
    ) {
        super();
        this.numberNotesActual = numberNotesActual || 3;
        this.numberNotesNormal = numberNotesNormal || 2;
        this.durationActual = durationActual || new duration.Duration(0.5);
        if (typeof this.durationActual === 'number') {
            this.durationActual = new duration.Duration(this.durationActual);
        }
        this.durationNormal = durationNormal || this.durationActual;

        this.frozen = false;
        this.type = undefined;
        /**
         * Show a bracket above the tuplet
         *
         * @memberof music21.duration.Tuplet#
         * @member {Boolean} bracket
         * @default true
         */
        this.bracket = true;
        /**
         * Bracket placement. Options are `above` or `below`.
         *
         * @memberof music21.duration.Tuplet#
         * @member {String} placement
         * @default 'above'
         */
        this.placement = 'above';

        /**
         * What to show above the Tuplet. Options are `number`, `type`, or (string) `none`.
         *
         * @memberof music21.duration.Tuplet#
         * @member {String} tupletActualShow
         * @default 'number'
         */
        this.tupletActualShow = 'number';
        this.tupletNormalShow = undefined; // undefined, 'ratio' for ratios, 'type' for ratioed notes (does not work)
    }
    /**
     * A nice name for the tuplet.
     *
     * @type String
     * @instance
     * @readonly
     * @memberof music21.duration.Tuplet
     */
    get fullName() {
        // actual is what is presented to viewer
        const numActual = this.numberNotesActual;
        const numNormal = this.numberNotesNormal;

        if (numActual === 3 && numNormal === 2) {
            return 'Triplet';
        } else if (numActual === 5 && (numNormal === 4 || numNormal === 2)) {
            return 'Quintuplet';
        } else if (numActual === 6 && numNormal === 4) {
            return 'Sextuplet';
        }
        const ordStr = common.ordinalAbbreviation(numNormal, true); // plural
        return (
            'Tuplet of '
            + numActual.toString()
            + '/'
            + numNormal.toString()
            + ordStr
        );
    }
    /**
     * Set both durationActual and durationNormal for the tuplet.
     *
     * @memberof music21.duration.Tuplet
     * @param {string} type - a duration type, such as `half`, `quarter`
     * @returns {music21.duration.Duration} A converted {@link music21.duration.Duration} matching `type`
     */
    setDurationType(type) {
        if (this.frozen === true) {
            throw new Music21Exception(
                'A frozen tuplet (or one attached to a duration) is immutable'
            );
        }
        this.durationActual = new duration.Duration(type);
        this.durationNormal = this.durationActual;
        return this.durationActual;
    }
    /**
     * Sets the tuplet ratio.
     *
     * @memberof music21.duration.Tuplet
     * @param {Number} actual - number of notes in actual (e.g., 3)
     * @param {Number} normal - number of notes in normal (e.g., 2)
     * @returns {undefined}
     */
    setRatio(actual, normal) {
        if (this.frozen === true) {
            throw new Music21Exception(
                'A frozen tuplet (or one attached to a duration) is immutable'
            );
        }
        this.numberNotesActual = actual || 3;
        this.numberNotesNormal = normal || 2;
    }
    /**
     * Get the quarterLength corresponding to the total length that
     * the completed tuplet (i.e., 3 notes in a triplet) would occupy.
     *
     * @memberof music21.duration.Tuplet
     * @returns {Number} A quarter length.
     */
    totalTupletLength() {
        return this.numberNotesNormal * this.durationNormal.quarterLength;
    }
    /**
     * The amount by which each quarter length is multiplied to get
     * the tuplet. For instance, in a normal triplet, this is 0.666
     *
     * @memberof music21.duration.Tuplet
     * @returns {Number} A float of the multiplier
     */
    tupletMultiplier() {
        const lengthActual = this.durationActual.quarterLength;
        return (
            this.totalTupletLength() / (this.numberNotesActual * lengthActual)
        );
    }
}
duration.Tuplet = Tuplet;
