/**
 * music21j -- Javascript reimplementation of Core music21 features.
 * music21/pitch -- pitch routines
 *
 * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
 *
 * pitch module.  See {@link music21.pitch} namespace
 * Pitch related objects and methods
 *
 * @exports music21/pitch
 * @namespace music21.pitch
 * @memberof music21
 * @requires music21/prebase
 */
import { Music21Exception } from './exceptions21.js';

import * as prebase from './prebase.js';
import { common } from './common.js';

/**
 * @class Accidental
 * @memberof music21.pitch
 * @param {string|number} accName - an accidental name
 * @property {number} alter
 * @property {string} displayType
 * @property {boolean|undefined} displayStatus
 * @extends music21.prebase.ProtoM21Object
 */
export class Accidental extends prebase.ProtoM21Object {
    constructor(accName) {
        super();
        this._name = '';
        /**
         *
         * @type {number}
         * @private
         */
        this._alter = 0.0;
        /**
         *
         * @type {string}
         * @private
         */
        this._modifier = '';
        /**
         *
         * @type {string}
         * @private
         */
        this._unicodeModifier = '';
        this.displayType = 'normal'; // "normal", "always" supported currently
        this.displayStatus = undefined; // true, false, undefined
        this.set(accName);
    }

    /**
     *
     * @returns {string}
     */
    stringInfo() {
        return this.name;
    }


    /**
     * Sets a parameter of the accidental and updates name, alter, and modifier to suit.
     *
     * @param {number|string} accName - the name, number, or modifier to set
     * @returns {undefined}
     */
    set(accName) {
        if (accName !== undefined && accName.toLowerCase !== undefined) {
            accName = accName.toLowerCase();
        }

        if (
            accName === 'natural'
            || accName === 'n'
            || accName === 0
            || accName === undefined
        ) {
            this._name = 'natural';
            this._alter = 0.0;
            this._modifier = '';
            this._unicodeModifier = '♮';
        } else if (accName === 'sharp' || accName === '#' || accName === 1) {
            this._name = 'sharp';
            this._alter = 1.0;
            this._modifier = '#';
            this._unicodeModifier = '♯';
        } else if (
            accName === 'flat'
            || accName === '-'
            || accName === 'b'
            || accName === -1
        ) {
            this._name = 'flat';
            this._alter = -1.0;
            this._modifier = '-';
            this._unicodeModifier = '♭';
        } else if (
            accName === 'double-flat'
            || accName === '--'
            || accName === -2
        ) {
            this._name = 'double-flat';
            this._alter = -2.0;
            this._modifier = '--';
            this._unicodeModifier = '&#x1d12b;';
        } else if (
            accName === 'double-sharp'
            || accName === '##'
            || accName === 2
        ) {
            this._name = 'double-sharp';
            this._alter = 2.0;
            this._modifier = '##';
            this._unicodeModifier = '&#x1d12a;';
        } else if (
            accName === 'triple-flat'
            || accName === '---'
            || accName === -3
        ) {
            this._name = 'triple-flat';
            this._alter = -3.0;
            this._modifier = '---';
            this._unicodeModifier = '♭&#x1d12b;';
        } else if (
            accName === 'triple-sharp'
            || accName === '###'
            || accName === 3
        ) {
            this._name = 'triple-sharp';
            this._alter = 3.0;
            this._modifier = '###';
            this._unicodeModifier = '&#x1d12a;';
        } else if (
            accName === 'quadruple-flat'
            || accName === '----'
            || accName === -4
        ) {
            this._name = 'quadruple-flat';
            this._alter = -4.0;
            this._modifier = '----';
            this._unicodeModifier = '♭&#x1d12b;';
        } else if (
            accName === 'quadruple-sharp'
            || accName === '####'
            || accName === 4
        ) {
            this._name = 'quadruple-sharp';
            this._alter = 4.0;
            this._modifier = '####';
            this._unicodeModifier = '&#x1d12a;';
        } else {
            throw new Music21Exception('Accidental is not supported: ' + accName);
        }

    }

    /**
     * Return or set the name of the accidental ('flat', 'sharp', 'natural', etc.);
     *
     * When set, updates alter and modifier.
     *
     * @type {string} name
     */
    get name() {
        return this._name;
    }

    set name(n) {
        this.set(n);
    }

    /**
     * Return or set the alter of the accidental
     *
     * When set, updates name and modifier.
     *
     * @type {number} alter
     */
    get alter() {
        return this._alter;
    }

    set alter(alter) {
        this.set(alter);
    }

    /**
     * Return or set the modifier ('-', '#', '')
     *
     * When set, updates alter and name.
     *
     * @type {string} modifier
     */
    get modifier() {
        return this._modifier;
    }

    set modifier(modifier) {
        this.set(modifier);
    }

    /**
     * Returns the modifier for vexflow ('b', '#', 'n')
     *
     * @type {string} vexflowModifier
     * @readonly
     */
    get vexflowModifier() {
        // todo -- rewrite with mapping.
        const m = this.modifier;
        if (m === '') {
            return 'n';
        } else if (m === '#') {
            return '#';
        } else if (m === '-') {
            return 'b';
        } else if (m === '##') {
            return '##';
        } else if (m === '--') {
            return 'bb';
        } else if (m === '###') {
            return '###';
        } else if (m === '---') {
            return 'bbb';
        } else {
            throw new Music21Exception('Vexflow does not support: ' + m);
        }
    }

    /**
     * Returns the modifier in unicode or
     * for double and triple accidentals, as a hex escape
     *
     * @type {string} unicodeModifier
     * @readonly
     */
    get unicodeModifier() {
        return this._unicodeModifier;
    }
}

/**
 *
 * @type {{A: number, B: number, C: number, D: number, E: number, F: number, G: number}}
 */
export const nameToMidi = {
    C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
};

/**
 *
 * @type {{A: number, B: number, C: number, D: number, E: number, F: number, G: number}}
 */
export const nameToSteps = {
    C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6,
};

/**
 *
 * @type {string[]}
 */
export const stepsToName = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 *
 * @type {string[]}
 */
export const midiToName = [
    'C',
    'C#',
    'D',
    'E-',
    'E',
    'F',
    'F#',
    'G',
    'A-',
    'A',
    'B-',
    'B',
];

/**
 * Pitch objects are found in {@link music21.note.Note} objects, and many other places.
 *
 * They do not have a {@link music21.duration.Duration} associated with them, so they
 * cannot be placed inside {@link music21.stream.Stream} objects.
 *
 * Valid pitch name formats are
 * - "C", "D', etc. ("B" = American B; "H" is not allowed)
 * - "C#", "C-" (C-flat; do not use "b" for flat), "C##", "C###", "C--" etc.
 * - Octave may be specified after the name + accidental: "C#4" etc.
 * - Octave can be arbitrarily high ("C10") but only as low as "C0" because "C-1" would be interpreted as C-flat octave 1; shift octave later for very low notes.
 * - If octave is not specified, the system will usually use octave 4, but might adjust according to context. If you do not like this behavior, give an octave always.
 * - Microtones are not supported in music21j (they are in music21p)
 *
 * @class Pitch
 * @memberof music21.pitch
 * @param {string} pn - name of the pitch, with or without octave, see above.
 * @extends music21.prebase.ProtoM21Object
 * @property {music21.pitch.Accidental|undefined} accidental - link to an accidental
 * @property {number} diatonicNoteNum - diatonic number of the pitch, where 29 = C4, C#4, C-4, etc.; 30 = D-4, D4, D#4, etc. updates other properties.
 * @property {number} midi - midi number of the pitch (C4 = 60); readonly. See {@link music21.pitch.Pitch#ps} for setable version.
 * @property {string} name - letter name of pitch + accidental modifier; e.g., B-flat = 'B-'; changes automatically w/ step and accidental
 * @property {string} nameWithOctave - letter name of pitch + accidental modifier + octave; changes automatically w/ step, accidental, and octave
 * @property {number} octave - number for the octave, where middle C = C4, and octaves change between B and C; default 4
 * @property {number} ps - pitch space number, like midi number but floating point and w/ no restriction on range. C4 = 60.0
 * @property {string} step - letter name for the pitch (C-G, A, B), without accidental; default 'C'
 */
export class Pitch extends prebase.ProtoM21Object {
    constructor(pn='C') {
        super();
        this._step = 'C';
        this._octave = 4;
        /**
         *
         * @type {music21.pitch.Accidental|undefined}
         * @private
         */
        this._accidental = undefined;
        this.spellingIsInferred = false;

        /* pn can be a nameWithOctave */
        if (typeof pn === 'number') {
            if (pn < 12) {
                pn += 60; // pitchClass
            }
            this.ps = pn;
        } else if (pn.match(/\d+/)) {
            this.nameWithOctave = pn;
        } else {
            this.name = pn;
        }
    }

    /**
     *
     * @returns {string}
     */
    stringInfo() {
        return this.nameWithOctave;
    }

    // N.B. cannot use transpose here, because of circular import.

    /**
     *
     * @type {string}
     */
    get step() {
        return this._step;
    }

    set step(s) {
        if (s === '') {
            throw new TypeError('All notes must have a step');
        }
        if (typeof s !== 'string') {
            throw new TypeError('Steps must be strings');
        }
        s = s.toUpperCase();
        if (!stepsToName.includes(s)) {
            throw new TypeError(`${s} is not a valid step name.`);
        }
        this._step = s;
        this.spellingIsInferred = false;
    }

    /**
     *
     * @type {number}
     */
    get octave() {
        return this._octave;
    }

    set octave(o) {
        this._octave = o;
    }

    /**
     *
     * @type {number}
     */
    get implicitOctave() {
        const o = this._octave;
        if (o === undefined) {
            return 4; // TODO(msc): get from defaults.
        } else {
            return o;
        }
    }

    /**
     *
     * @type {music21.pitch.Accidental|undefined}
     */
    get accidental() {
        return this._accidental;
    }

    set accidental(a) {
        if (typeof a !== 'object' && a !== undefined) {
            a = new Accidental(a);
        }
        this._accidental = a;
        this.spellingIsInferred = false;
    }

    /**
     *
      * @type {string}
     */
    get name() {
        if (this.accidental === undefined) {
            return this.step;
        } else {
            return this.step + this.accidental.modifier;
        }
    }

    set name(nn) {
        this.step = nn.slice(0, 1);
        const tempAccidental = nn.slice(1);
        if (tempAccidental) {
            // not the empty string
            this.accidental = tempAccidental; // converts automatically
        } else {
            this.accidental = undefined;
        }
    }

    /**
     * @type {string}
     */
    get nameWithOctave() {
        return this.name + this.octave.toString();
    }

    set nameWithOctave(pn) {
        const storedOctave = pn.match(/\d+/);
        if (storedOctave !== undefined) {
            pn = pn.replace(/\d+/, '');
            this.octave = parseInt(storedOctave);
            this.name = pn;
        } else {
            this.name = pn;
        }
    }

    /**
     *
     * @type {number}
     * @readonly
     */
    get pitchClass() {
        return common.posMod(Math.round(this.ps), 12);
    }

    /**
     *
     * @type {number}
     */
    get diatonicNoteNum() {
        return this.octave * 7 + nameToSteps[this.step] + 1;
    }

    set diatonicNoteNum(newDNN) {
        newDNN -= 1; // makes math easier
        this.octave = Math.floor(newDNN / 7);
        const mod7DNN = common.posMod(Math.round(newDNN), 7);
        this.step = stepsToName[mod7DNN];
    }

    /**
     *
     * @type {number}
     * @readonly
     */
    get frequency() {
        return 440 * (2 ** (this.ps - 69) / 12);
    }

    /**
     *
     * @type {number}
     * @readonly
     */
    get midi() {
        return Math.floor(this.ps);
    }

    /**
     *
     * @type {number}
     */
    get ps() {
        let accidentalAlter = 0;
        if (this.accidental !== undefined) {
            accidentalAlter = this.accidental.alter;
        }
        return (
            (this.octave + 1) * 12
            + nameToMidi[this.step]
            + accidentalAlter
        );
    }

    set ps(ps) {
        this.name = midiToName[common.posMod(ps, 12)];
        this.octave = Math.floor(ps / 12) - 1;
        this.spellingIsInferred = true;
    }

    /**
     * @type {string}
     * @readonly
     */
    get unicodeName() {
        if (this.accidental !== undefined) {
            return this.step + this.accidental.unicodeModifier();
        } else {
            return this.step;
        }
    }

    /**
     * @type {string}
     * @readonly
     */
    get unicodeNameWithOctave() {
        if (this.octave === undefined) {
            return this.unicodeName;
        } else {
            return this.unicodeName + this.octave.toString();
        }
    }

    /**
     * @param {boolean} inPlace
     * @param {int} directionInt -- -1 = down, 1 = up
     * @returns {music21.pitch.Pitch}
     */
    _getEnharmonicHelper(inPlace=false, directionInt) {
        // differs from Python version because
        // cannot import interval here.
        let octaveStored = true;
        if (this.octave === undefined) {
            octaveStored = false;
        }
        const p = this.clone();
        p.diatonicNoteNum += directionInt;
        if (p.accidental === undefined) {
            p.accidental = new Accidental(0);
        }
        while (p.ps % 12 !== this.ps % 12) { // octaveless
            p.accidental.alter += -1 * directionInt;
        }

        if (!inPlace) {
            return p;
        }
        this.step = p.step;
        this.accidental = p.accidental;
        if (p.microtone === undefined) {
            this.microtone = p.microtone;
        }
        if (!octaveStored) {
            this.octave = undefined;
        } else {
            this.octave = p.octave;
        }
        return p;
    }

    /**
     *
     * @param {boolean} [inPlace=false]
     * @returns {music21.pitch.Pitch}
     */
    getHigherEnharmonic(inPlace=false) {
        return this._getEnharmonicHelper(inPlace, 1);
    }

    /**
     *
     * @param {boolean} [inPlace=false]
     * @returns {music21.pitch.Pitch}
     */
    getLowerEnharmonic(inPlace=false) {
        return this._getEnharmonicHelper(inPlace, -1);
    }
    /* TODO: isEnharmonic, getEnharmonic, getAllCommonEnharmonics */

    /**
     * Returns the vexflow name for the pitch in the given clef.
     *
     * @param {music21.clef.Clef} [clefObj] - the active {@link music21.clef.Clef} object
     * @returns {string} - representation in vexflow
     */
    vexflowName(clefObj) {
        // returns a vexflow Key name for this pitch.
        let tempPitch = this;
        if (clefObj !== undefined) {
            try {
                tempPitch = clefObj.convertPitchToTreble(this);
            } catch (e) {
                console.log(e, clefObj);
            }
        }
        let accidentalType = 'n';
        if (this.accidental !== undefined) {
            if ([0, -1, -2, 1, 2].includes(this.accidental.alter)) {
                accidentalType = this.accidental.vexflowModifier;
            } else {
                console.warn('unsupported accidental: ' + this.accidental);
            }
        }
        const outName
            = tempPitch.step + accidentalType + '/' + tempPitch.octave;
        return outName;
    }
}
