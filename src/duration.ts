/**
 * music21j -- Javascript reimplementation of Core music21 features.
 * music21/duration -- duration routines
 *
 * Copyright (c) 2013-23, Michael Scott Asato Cuthbert
 * Based on music21, Copyright (c) 2006-23, Michael Scott Asato Cuthbert
 *
 * Duration module.
 *
 */
import { Music21Exception } from './exceptions21';

import * as common from './common';
import { debug } from './debug';
import * as prebase from './prebase';

/**
 * Object mapping int to name, as in `{1: 'whole'}` etc.
 */
export const typeFromNumDict = {
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
    2048: '2048th',  // if extended, update beam.beamableDurationTypes
    0: 'zero',
    '0.5': 'breve',
    '0.25': 'longa',
    '0.125': 'maxima',
    '0.0625': 'duplex-maxima',
};

export const quarterTypeIndex = 6; // where is quarter in the following array.

export const ordinalTypeFromNum = [
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
    '2048th',
];

export const vexflowDurationArray = [
    undefined,
    undefined,
    undefined,
    '1/2',
    'w',
    'h',
    'q',
    '8',
    '16',
    '32',
    '64',
    '128',
    '256',
    undefined,
    undefined,
    undefined,
];

/**
 * Duration object; found as the `.duration` attribute on Music21Object instances
 * such as music21.note.Note
 */
export class Duration extends prebase.ProtoM21Object {
    static get className() { return 'music21.duration.Duration'; }
    isGrace: boolean = false;
    linked: boolean = true;
    protected _quarterLength: number = 0.0;
    protected _dots: number = 0;
    protected _durationNumber = undefined;
    protected _type: string = 'zero';
    protected _tuplets: Tuplet[] = [];


    constructor(ql: string|number = 0.0) {
        super();
        if (typeof ql === 'string') {
            this.type = ql;
        } else if (ql !== undefined) {
            this.quarterLength = ql;
        }
        this._cloneCallbacks._tuplets = this.cloneCallbacksTupletFunction;
    }

    stringInfo(): string {
        return this.quarterLength.toString();
    }

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
    get dots(): number {
        return this._dots;
    }

    set dots(numDots: number) {
        this._dots = numDots;
        if (this.linked) {
            this.updateQlFromFeatures();
        }
    }

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
    get quarterLength(): number {
        return this._quarterLength;
    }

    set quarterLength(ql: number) {
        if (ql === undefined) {
            ql = 1.0;
        }
        ql = common.opFrac(ql);
        this._quarterLength = ql;
        if (this.linked) {
            this.updateFeaturesFromQl();
        }
    }

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
    get type(): string {
        return this._type;
    }

    set type(typeIn: string) {
        const typeNumber = ordinalTypeFromNum.indexOf(typeIn);
        if (typeNumber === -1) {
            console.log('invalid type ' + typeIn);
            throw new Music21Exception('invalid type ' + typeIn);
        }
        this._type = typeIn;
        if (this.linked) {
            this.updateQlFromFeatures();
        }
    }

    /**
     * Reads the tuplet Array for the duration.
     *
     * The tuplet array should be considered Read Only.
     * Use music21.duration.Duration#appendTuplet to
     * add a tuplet (no way to remove yet)
     */
    get tuplets(): Tuplet[] {
        return this._tuplets;
    }

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
    get vexflowDuration(): string {
        const typeNumber = ordinalTypeFromNum.indexOf(this.type);
        let vd = vexflowDurationArray[typeNumber];
        if (this.dots > 0) {
            for (let i = 0; i < this.dots; i++) {
                vd += 'd'; // vexflow does not handle double dots .. or does it???
            }
        }
        return vd;
    }

    cloneCallbacksTupletFunction(tupletKey, ret, obj, deep, memo) {
        // make sure that tuplets clone properly
        const newTuplets = [];
        for (let i = 0; i < obj[tupletKey].length; i++) {
            const newTuplet = obj[tupletKey][i].clone();
            // console.log('cloning tuplets', obj[tupletKey][i], newTuplet);
            newTuplets.push(newTuplet);
        }
        ret[tupletKey] = newTuplets;
    }

    /**
     *
     * @param {number} ql
     * @returns {number}
     * @private
     */
    _findDots(ql) {
        if (ql === 0) {
            return 0;
        } // zero length stream probably;
        const typeNumber = ordinalTypeFromNum.indexOf(this._type);
        const powerOfTwo = 2 ** (quarterTypeIndex - typeNumber);
        // alert(undottedQL * 1.5 + " " + ql)
        // console.log('find dots called on ql: ', ql, typeNumber, powerOfTwo);
        for (let dotsNum = 0; dotsNum <= 4; dotsNum++) {
            const dotMultiplier
                = ((2 ** dotsNum) - 1.0) / 2 ** dotsNum;
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
        const typeNumber = ordinalTypeFromNum.indexOf(this._type); // must be set property
        if (typeNumber === -1) {
            return;  // e.g. "zero" type
        }
        const undottedQuarterLength = (
            2 ** (quarterTypeIndex - typeNumber)
        );
        const dottedMultiplier
            = 1 + ((2 ** this._dots) - 1.0) / (2 ** this._dots);
        const unTupletedQl = undottedQuarterLength * dottedMultiplier;
        let tupletCorrectedQl = unTupletedQl;
        this._tuplets.forEach(tuplet => {
            tupletCorrectedQl *= tuplet.tupletMultiplier();
        });
        this._quarterLength = common.opFrac(tupletCorrectedQl);
    }

    updateFeaturesFromQl() {
        const ql = this._quarterLength;
        this._tuplets = [];
        if (ql === 0) {
            this._type = 'zero';
            this._dots = 0;
            return;
        }
        const powerOfTwo = Math.floor(Math.log2(ql + 0.00001));
        let typeNumber = quarterTypeIndex - powerOfTwo;
        this._type = ordinalTypeFromNum[typeNumber];
        // console.log(this._findDots);
        this._dots = this._findDots(ql);

        const undottedQuarterLength = (
            2 ** (quarterTypeIndex - typeNumber)
        );
        const dottedMultiplier
            = 1 + (2 **  this._dots - 1) / 2 ** this._dots;
        let unTupletedQl = undottedQuarterLength * dottedMultiplier;
        if (unTupletedQl !== ql && ql !== 0) {
            typeNumber -= 1;
            this._type = ordinalTypeFromNum[typeNumber]; // increase type: eighth to quarter etc.
            unTupletedQl *= 2;
            const tupletRatio = ql / unTupletedQl;
            const ratioRat = common.rationalize(tupletRatio);
            if (ratioRat === undefined) {
                // probably a Stream with a length that is inexpressable;
            } else {
                const t = new Tuplet(
                    ratioRat.denominator,
                    ratioRat.numerator,
                    new Duration(unTupletedQl)
                );
                this.appendTuplet(t, true); // skipUpdateQl
            }
            // console.log(ratioRat, ql, unTupletedQl);
        }
    }

    /**
     * Add a tuplet to music21j
     *
     * @param {Tuplet} newTuplet - tuplet to add to `.tuplets`
     * @param {boolean} [skipUpdateQl=false] - update the quarterLength afterwards?
     * @returns {this}
     */
    appendTuplet(newTuplet: Tuplet, skipUpdateQl=false) {
        newTuplet.frozen = true;
        this._tuplets.push(newTuplet);
        if (skipUpdateQl !== true && this.linked) {
            this.updateQlFromFeatures();
        }
        return this;
    }
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
export class Tuplet extends prebase.ProtoM21Object {
    static get className() { return 'music21.duration.Tuplet'; }
    numberNotesActual: number;
    numberNotesNormal: number;
    durationActual: Duration;
    durationNormal: Duration;
    frozen: boolean = false;
    type;
    bracket: boolean = true;
    placement: string = 'above';
    tupletActualShow: string;
    tupletNormalShow: string;

    constructor(
        numberNotesActual: number = 3,
        numberNotesNormal: number = 2,
        durationActual: Duration|number = undefined,
        durationNormal: Duration|number = undefined,
    ) {
        super();
        this.numberNotesActual = numberNotesActual;
        this.numberNotesNormal = numberNotesNormal;
        if (typeof durationActual === 'number') {
            durationActual = new Duration(durationActual);
        }
        this.durationActual = durationActual || new Duration(0.5);
        if (typeof durationNormal === 'number') {
            durationNormal = new Duration(durationNormal);
        }
        this.durationNormal = durationNormal || this.durationActual;

        this.frozen = false;
        this.type = undefined;
        /**
         * Show a bracket above the tuplet
         */
        this.bracket = true;
        /**
         * Bracket placement. Options are `above` or `below`.
         */
        this.placement = 'above';

        /**
         * What to show above the Tuplet. Options are `number`, `type`, or (string) `none`.
         *
         * @property {string} tupletActualShow
         * @default 'number'
         */
        this.tupletActualShow = 'number';
        this.tupletNormalShow = undefined; // undefined, 'ratio' for ratios, 'type' for ratioed notes (does not work)
    }

    /**
     * A nice name for the tuplet.
     *
     * @type {string}
     * @readonly
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
     * type - a duration type, such as `half`, `quarter`
     * returns A converted music21.duration.Duration matching `type`
     */
    setDurationType(type: string): Duration {
        if (this.frozen === true) {
            throw new Music21Exception(
                'A frozen tuplet (or one attached to a duration) is immutable'
            );
        }
        this.durationActual = new Duration(type);
        this.durationNormal = this.durationActual;
        return this.durationActual;
    }

    /**
     * Sets the tuplet ratio.
     *
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
     * @returns {Number} A quarter length.
     */
    totalTupletLength() {
        return this.numberNotesNormal * this.durationNormal.quarterLength;
    }

    /**
     * The amount by which each quarter length is multiplied to get
     * the tuplet. For instance, in a normal triplet, this is 0.666
     *
     * @returns {Number} A float of the multiplier
     */
    tupletMultiplier() {
        const lengthActual = this.durationActual.quarterLength;
        return (
            this.totalTupletLength() / (this.numberNotesActual * lengthActual)
        );
    }
}
