/**
 * music21j -- Javascript reimplementation of Core music21 features.
 * music21/pitch -- pitch routines
 *
 * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
 *
 */
import { Music21Exception } from './exceptions21';

import { prebase } from './prebase';
/**
 * pitch module.  See {@link music21.pitch} namespace
 *
 * @exports music21/pitch
 */
/**
 * Pitch related objects and methods
 *
 * @namespace music21.pitch
 * @memberof music21
 * @requires music21/prebase
 */
export const pitch = {};
/**
 * @class Accidental
 * @memberof music21.pitch
 * @param {string|number} accName - an accidental name
 * @extends music21.prebase.ProtoM21Object
 */
export class Accidental extends prebase.ProtoM21Object {
    constructor(accName) {
        super();
        this.classes.push('Accidental');
        this._name = '';
        this._alter = 0.0;
        this._modifier = '';
        this._unicodeModifier = '';
        this.displayType = 'normal'; // "normal", "always" supported currently
        this.displayStatus = undefined; // true, false, undefined
        this.init(accName);
    }
    /**
     * Sets a parameter of the accidental and updates name, alter, and modifier to suit.
     *
     * @memberof music21.pitch.Accidental
     * @param {number|string} accName - the name, number, or modifier to set
     * @returns {undefined}
     */
    init(accName) {
        if ((accName !== undefined) && (accName.toLowerCase !== undefined)) {
            accName = accName.toLowerCase();
        }

        if (accName === 'natural' || accName === 'n' || accName === 0 || accName === undefined) {
            this._name = 'natural';
            this._alter = 0.0;
            this._modifier = '';
            this._unicodeModifier = '♮';
        } else if (accName === 'sharp' || accName === '#' || accName === 1) {
            this._name = 'sharp';
            this._alter = 1.0;
            this._modifier = '#';
            this._unicodeModifier = '♯';
        } else if (accName === 'flat' || accName === '-' || accName === -1) {
            this._name = 'flat';
            this._alter = -1.0;
            this._modifier = '-';
            this._unicodeModifier = '♭';
        } else if (accName === 'double-flat' || accName === '--' || accName === -2) {
            this._name = 'double-flat';
            this._alter = -2.0;
            this._modifier = '--';
            this._unicodeModifier = '&#x1d12b;';
        } else if (accName === 'double-sharp' || accName === '##' || accName === 2) {
            this._name = 'double-sharp';
            this._alter = 2.0;
            this._modifier = '##';
            this._unicodeModifier = '&#x1d12a;';
        } else if (accName === 'triple-flat' || accName === '---' || accName === -3) {
            this._name = 'triple-flat';
            this._alter = -3.0;
            this._modifier = '---';
            this._unicodeModifier = '♭&#x1d12b;';
        } else if (accName === 'triple-sharp' || accName === '###' || accName === 3) {
            this._name = 'triple-sharp';
            this._alter = 3.0;
            this._modifier = '###';
            this._unicodeModifier = '&#x1d12a;';
        }
    }
    /**
     * Return or set the name of the accidental ('flat', 'sharp', 'natural', etc.);
     *
     * When set, updates alter and modifier.
     *
     * @memberof music21.pitch.Accidental#
     * @var {string} name
     */
    get name() {
        return this._name;
    }
    set name(n) {
        this.init(n);
    }
    /**
     * Return or set the alteration amount (-1.0 = flat; 1.0 = sharp; etc.)
     *
     * When set, updates name and modifier.
     *
     * @memberof music21.pitch.Accidental#
     * @var {number} alter
     */
    get alter() {
        return this._alter;
    }
    set alter(alter) {
        this.init(alter);
    }
    /**
     * Return or set the modifier ('-', '#', '')
     *
     * When set, updates alter and name.

     * @memberof music21.pitch.Accidental#
     * @var {string} modifier
     */
    get modifier() {
        return this._modifier;
    }
    set modifier(modifier) {
        this.init(modifier);
    }
    /**
     * Returns the modifier for vexflow ('b', '#', 'n')
     *
     * @memberof music21.pitch.Accidental#
     * @var {string} vexflowModifier
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
     * @memberof music21.pitch.Accidental#
     * @var {string} unicodeModifier
     * @readonly
     */
    get unicodeModifier() {
        return this._unicodeModifier;
    }
}
pitch.Accidental = Accidental;


pitch.nameToMidi = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
pitch.nameToSteps = { 'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6 };
pitch.stepsToName = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
pitch.midiToName = ['C', 'C#', 'D', 'E-', 'E', 'F', 'F#', 'G', 'A-', 'A', 'B-', 'B'];

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
    constructor(pn) {
        super();
        this.classes.push('Pitch');
        if (pn === undefined) {
            pn = 'C';
        }
        this._step = 'C';
        this._octave = 4;
        this._accidental = undefined;

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


    get step() { return this._step; }
    set step(s) { this._step = s; }
    get octave() { return this._octave; }
    set octave(o) { this._octave = o; }
    get accidental() { return this._accidental; }
    set accidental(a) {
        if (typeof (a) !== 'object' && a !== undefined) {
            a = new pitch.Accidental(a);
        }
        this._accidental = a;
    }
    get name() {
        if (this.accidental === undefined) {
            return this.step;
        } else {
            return this.step + this.accidental.modifier;
        }
    }
    set name(nn) {
        this.step = nn.slice(0, 1).toUpperCase();
        const tempAccidental = nn.slice(1);
        if (tempAccidental !== undefined) {
            this.accidental = tempAccidental; // converts automatically
        } else {
            this.accidental = undefined;
        }
    }
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
    get diatonicNoteNum() {
        return (this.octave * 7) + pitch.nameToSteps[this.step] + 1;
    }
    set diatonicNoteNum(newDNN) {
        newDNN -= 1; // makes math easier
        this.octave = Math.floor(newDNN / 7);
        this.step = pitch.stepsToName[newDNN % 7];
    }
    get frequency() {
        return 440 * Math.pow(2, (this.ps - 69) / 12);
    }
    get midi() {
        return Math.floor(this.ps);
    }
    get ps() {
        let accidentalAlter = 0;
        if (this.accidental !== undefined) {
            accidentalAlter = parseInt(this.accidental.alter);
        }
        return (this.octave + 1) * 12 + pitch.nameToMidi[this.step] + accidentalAlter;
    }
    set ps(ps) {
        this.name = pitch.midiToName[ps % 12];
        this.octave = Math.floor(ps / 12) - 1;
    }

    /**
     * Returns the vexflow name for the pitch in the given clef.
     *
     * @memberof music21.pitch.Pitch#
     * @param {clef.Clef} clefObj - the active {@link music21.clef.Clef} object
     * @returns {String} - representation in vexflow
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
            accidentalType = this.accidental.vexflowModifier;
        }
        const outName = tempPitch.step + accidentalType + '/' + tempPitch.octave;
        return outName;
    }
}
pitch.Pitch = Pitch;


pitch.tests = () => {
    QUnit.test('music21.pitch.Accidental', (assert) => {
        const a = new music21.pitch.Accidental('-');
        assert.equal(a.alter, -1.0, 'flat alter passed');
        assert.equal(a.name, 'flat', 'flat name passed');
    });

    QUnit.test('music21.pitch.Pitch', (assert) => {
        const p = new music21.pitch.Pitch('D#5');
        assert.equal(p.name, 'D#', 'Pitch Name set to D#');
        assert.equal(p.step, 'D',  'Pitch Step set to D');
        assert.equal(p.octave, 5, 'Pitch octave set to 5');
        const c = new music21.clef.AltoClef();
        const vfn = p.vexflowName(c);
        assert.equal(vfn, 'C#/6', 'Vexflow name set');
    });
};
