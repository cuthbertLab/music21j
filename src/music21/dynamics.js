/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/dynamics -- Dynamics
 *
 * note that Vex.Flow does not support Dynamics yet and we do not support MIDI dynamics,
 *  so currently of limited value...
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * dynamics Module. See {@link music21.dynamics} for namespace
 *
 * Dynamics related objects.
 *
 * Currently do not export to Vexflow.  :-(
 *
 * @exports music21/dynamics
 * @namespace music21.dynamics
 * @memberof music21
 * @requires music21/base
 */
import * as base from './base';

// noinspection SpellCheckingInspection
export const shortNames = [
    'pppppp',
    'ppppp',
    'pppp',
    'ppp',
    'pp',
    'p',
    'mp',
    'mf',
    'f',
    'fp',
    'sf',
    'ff',
    'fff',
    'ffff',
    'fffff',
    'ffffff',
];

// noinspection SpellCheckingInspection
export const longNames = {
    ppp: ['pianississimo'],
    pp: ['pianissimo'],
    p: ['piano'],
    mp: ['mezzopiano'],
    mf: ['mezzoforte'],
    f: ['forte'],
    fp: ['fortepiano'],
    sf: ['sforzando'],
    ff: ['fortissimo'],
    fff: ['fortississimo'],
};

export const englishNames = {
    ppp: ['extremely soft'],
    pp: ['very soft'],
    p: ['soft'],
    mp: ['moderately soft'],
    mf: ['moderately loud'],
    f: ['loud'],
    ff: ['very loud'],
    fff: ['extremely loud'],
};

export const dynamicStrToScalar = {
    None: [0.5], // default value
    n: [0.0],
    pppp: [0.1],
    ppp: [0.15],
    pp: [0.25],
    p: [0.35],
    mp: [0.45],
    mf: [0.55],
    f: [0.7],
    fp: [0.75],
    sf: [0.85],
    ff: [0.85],
    fff: [0.9],
    ffff: [0.95],
};

/**
 * A representation of a dynamic.
 *
 * @class Dynamic
 * @memberof music21.dynamics
 * @extends music21.base.Music21Object
 * @param {number|string} value - either a number between 0 and 1 or a dynamic mark such as "ff" or "mp"
 * @property {string|undefined} value - a name such as "pp" etc.
 * @property {string|undefined} longName - a longer name such as "pianissimo"
 * @property {string|undefined} englishName - a name such as "very soft"
 * @property {number} volumeScalar - a number between 0 and 1.
 */
export class Dynamic extends base.Music21Object {
    static get className() { return 'music21.dynamics.Dynamic'; }

    constructor(value) {
        super();
        /**
         *
         * @type {string|undefined}
         * @private
         */
        this._value = undefined;
        /**
         *
         * @type {number|undefined}
         * @private
         */
        this._volumeScalar = undefined;
        this.longName = undefined;
        this.englishName = undefined;
        this.value = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        if (typeof value !== 'string') {
            // assume number
            this._volumeScalar = value;
            if (value <= 0) {
                this._value = 'n';
            } else if (value < 0.11) {
                this._value = 'pppp';
            } else if (value < 0.16) {
                this._value = 'ppp';
            } else if (value < 0.26) {
                this._value = 'pp';
            } else if (value < 0.36) {
                this._value = 'p';
            } else if (value < 0.5) {
                this._value = 'mp';
            } else if (value < 0.65) {
                this._value = 'mf';
            } else if (value < 0.8) {
                this._value = 'f';
            } else if (value < 0.9) {
                this._value = 'ff';
            } else {
                this._value = 'fff';
            }
        } else {
            this._value = value;
            this._volumeScalar = undefined;
        }
        if (this._value in longNames) {
            this.longName = longNames[this._value][0];
        } else {
            this.longName = '';
        }
        if (this._value in englishNames) {
            this.englishName = englishNames[this._value][0];
        } else {
            this.englishName = '';
        }
    }

    get volumeScalar() {
        if (this._volumeScalar !== undefined) {
            return this._volumeScalar;
        } else if (this._value in dynamicStrToScalar) {
            return dynamicStrToScalar[this._value][0];
        } else {
            return 0.5;
        }
    }

    set volumeScalar(value) {
        if (typeof value === 'number' && value <= 1 && value >= 0) {
            this._volumeScalar = value;
        }
    }
}
