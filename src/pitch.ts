/**
 * music21j -- Javascript reimplementation of Core music21 features.
 * music21/pitch -- pitch routines
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21, Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * Pitch related objects and methods
 */
import { Music21Exception } from './exceptions21';

import * as prebase from './prebase';
import * as common from './common';

import type * as clef from './clef';


interface UpdateAccidentalDisplayParams {
    pitchPast?: Pitch[],
    pitchPastMeasure?: Pitch[],
    alteredPitches?: Pitch[],
    cautionaryPitchClass?: boolean,
    cautionaryAll?: boolean,
    overrideStatus?: boolean,
    cautionaryNotImmediateRepeat?: boolean,
    lastNoteWasTied?: boolean,
}



/**
 * @class Accidental
 * @memberof music21.pitch
 * @param {string|number} accName - an accidental name
 * @property {number} alter
 * @property {string} displayType
 * @property {boolean|undefined} displayStatus
 */
export class Accidental extends prebase.ProtoM21Object {
    static get className() { return 'music21.pitch.Accidental'; }

    protected _name: string = '';
    protected _alter: number = 0.0;
    protected _modifier: string = '';
    protected _unicodeModifier: string = '';
    displayType: string = 'normal';  // "normal", "always" supported currently
    displayStatus: boolean = undefined;  // true, false, undefined

    constructor(accName: string|number) {
        super();
        this.set(accName);
    }

    stringInfo(): string {
        return this.name;
    }


    /**
     * Sets a parameter of the accidental and updates name, alter, and modifier to suit.
     *
     * @param {number|string} accName - the name, number, or modifier to set
     * @returns {undefined}
     */
    set(accName: number|string) {
        if (typeof accName === 'string') {
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
     * @type {string}
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
     * @type {number}
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
     * @type {string}
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
     * @type {string}
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
     * @type {string}
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
 * Pitch objects are found in music21.note.Note objects, and many other places.
 *
 * They do not have a music21.duration.Duration associated with them, so they
 * cannot be placed inside music21.stream.Stream objects.
 *
 * Valid pitch name formats are
 * - "C", "D', etc. ("B" = American B; "H" is not allowed)
 * - "C#", "C-" (C-flat; do not use "b" for flat), "C##", "C###", "C--" etc.
 * - Octave may be specified after the name + accidental: "C#4" etc.
 * - Octave can be arbitrarily high ("C10") but only as low as "C0" because
 *     "C-1" would be interpreted as C-flat octave 1; shift octave later for very low notes.
 * - If octave is not specified, the system will usually use octave 4, but might
 *     adjust according to context. If you do not like this behavior, give an octave always.
 * - Microtones are not supported in music21j (they are in music21p)
 *
 * @class Pitch
 * @memberof music21.pitch
 * @param {string|number} pn - name of the pitch, with or without octave, see above.
 * @property {Accidental|undefined} accidental - link to an accidental
 * @property {number} diatonicNoteNum - diatonic number of the pitch,
 *     where 29 = C4, C#4, C-4, etc.; 30 = D-4, D4, D#4, etc. updates other properties.
 * @property {number} midi - midi number of the pitch (C4 = 60); readonly.
 *     See {@link Pitch#ps} for settable version.
 * @property {string} name - letter name of pitch + accidental modifier;
 *     e.g., B-flat = 'B-'; changes automatically w/ step and accidental
 * @property {string} nameWithOctave - letter name of pitch + accidental
 *     modifier + octave; changes automatically w/ step, accidental, and octave
 * @property {number} octave - number for the octave, where middle C = C4, and
 *     octaves change between B and C; default 4
 * @property {number} ps - pitch space number, like midi number but floating
 *     point and w/ no restriction on range. C4 = 60.0
 * @property {string} step - letter name for the pitch (C-G, A, B),
 *     without accidental; default 'C'
 */
export class Pitch extends prebase.ProtoM21Object {
    static get className() { return 'music21.pitch.Pitch'; }
    protected _step: string = 'C';
    protected _octave: number = 4;
    protected _accidental: Accidental|undefined;
    spellingIsInferred: boolean = false;
    microtone = undefined;

    constructor(pn: string|number='C') {
        super();

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

    stringInfo(): string {
        return this.nameWithOctave;
    }

    // N.B. cannot use transpose here, because of circular import.

    get step(): string {
        return this._step;
    }

    set step(s: string) {
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

    get octave(): number {
        return this._octave;
    }

    set octave(o: number) {
        this._octave = o;
    }

    get implicitOctave(): number {
        const o = this._octave;
        if (o === undefined) {
            return 4; // TODO(msc): get from defaults.
        } else {
            return o;
        }
    }

    get accidental(): Accidental|undefined {
        return this._accidental;
    }

    set accidental(a: Accidental|undefined) {
        this._accidental = a;
        this.spellingIsInferred = false;
    }

    get name(): string {
        const a = this.accidental;
        if (a === undefined) {
            return this.step;
        } else {
            return this.step + a.modifier;
        }
    }

    set name(nn: string) {
        this.step = nn.slice(0, 1);
        const tempAccidental = nn.slice(1);
        if (tempAccidental) {
            // not the empty string
            this.accidental = new Accidental(tempAccidental);
        } else {
            this.accidental = undefined;
        }
    }

    get nameWithOctave(): string {
        return this.name + this.octave.toString();
    }

    set nameWithOctave(pn: string) {
        const storedOctave = pn.match(/\d+/);
        if (storedOctave !== undefined) {
            pn = pn.replace(/\d+/, '');
            this.octave = parseInt(storedOctave[0]);
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
            return this.step + this.accidental.unicodeModifier;
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
     * @returns {Pitch}
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
            // again a JSDoc choke
            // eslint-disable-next-line operator-assignment
            p.accidental.alter = p.accidental.alter + (-1 * directionInt);
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
     * @returns {Pitch}
     */
    getHigherEnharmonic(inPlace=false) {
        return this._getEnharmonicHelper(inPlace, 1);
    }

    /**
     *
     * @param {boolean} [inPlace=false]
     * @returns {Pitch}
     */
    getLowerEnharmonic(inPlace=false) {
        return this._getEnharmonicHelper(inPlace, -1);
    }
    /* TODO: isEnharmonic, getEnharmonic, getAllCommonEnharmonics */

    protected _nameInKeySignature(alteredPitches: Pitch[]) : boolean {
        for (const p of alteredPitches) {  // all are altered tones, must have acc
            if (p.step === this.step) {  // A# to A or A# to A-, etc
                if (p.accidental.name === this.accidental.name) {
                    return true;
                }
            }
        }
        return false;
    }

    protected _stepInKeySignature(alteredPitches: Pitch[]) : boolean {
        for (const p of alteredPitches) {  // all are altered tones, must have acc
            if (p.step === this.step) {  // A# to A or A# to A-, etc
                return true;
            }
        }
        return false;
    }

    // noinspection PointlessBooleanExpressionJS
    updateAccidentalDisplay(
        {
            pitchPast = [],
            pitchPastMeasure = [],
            alteredPitches = [],
            cautionaryPitchClass = true,
            cautionaryAll = false,
            overrideStatus = false,
            cautionaryNotImmediateRepeat = true,
            lastNoteWasTied = false,
        }: UpdateAccidentalDisplayParams = {}
    ) {
        // TODO: this presently deals with chords as simply a list
        //   we might permit pitchPast to contain a list of pitches, to represent
        //    a simultaneity?

        // should we display accidental if no previous accidentals have been displayed
        // i.e. if it's the first instance of an accidental after a tie
        let displayAccidentalIfNoPreviousAccidentals = false;
        const pitchPastAll: Pitch[] = [...pitchPastMeasure, ...pitchPast];
        const acc_orig: Accidental | undefined = this.accidental;
        const display_orig = (
            this.accidental !== undefined
                ? this.accidental.displayStatus
                : undefined
        );
        let continuousRepeatsInMeasure = false;

        if (overrideStatus === false) {  // go with what we have defined
            if (acc_orig === undefined) {
                // no accidental defined; we may need to add one
            } else if (display_orig === undefined) {
                // not set; need to set
                // configure based on displayStatus alone, continue w/ normal
            } else if (display_orig === true || display_orig === false) {
                return;  // exit: already set, do not override
            }
        }
        if (lastNoteWasTied === true) {
            if (this.accidental !== undefined) {
                if (this.accidental.displayType !== 'even-tied') {
                    this.accidental.displayStatus = false;
                } else {
                    this.accidental.displayStatus = true;
                }
                return;
            } else {
                return;  // exit: nothing more to do
            }
        }

        // no pitches in past...
        // noinspection PointlessBooleanExpressionJS
        if (pitchPastAll.length === 0) {
            // if we have no past, we always need to show the accidental,
            // unless this accidental is in the alteredPitches list
            if (acc_orig !== undefined
                && (display_orig === false
                    || display_orig === undefined)) {
                if (!this._nameInKeySignature(alteredPitches)) {
                    this.accidental.displayStatus = true;
                } else {
                    this.accidental.displayStatus = false;
                }
            } else if (this.accidental?.displayStatus === true
                && this._nameInKeySignature(alteredPitches)) {
                // in case display set to true and in alteredPitches, make false
                this.accidental.displayStatus = false;

            } else if ((this.accidental === undefined
                          || this.accidental.name === 'natural')
                        && this._stepInKeySignature(alteredPitches)) {
                // if no accidental or natural but matches step in key sig
                // we need to show or add or an accidental
                // noinspection PointlessBooleanExpressionJS
                if (this.accidental === undefined) {
                    this.accidental = new Accidental('natural');
                }
                this.accidental.displayStatus = true;
            }
            return; // do not search past
        }

        // pitches in past... first search if last pitch in measure
        // at this octave contradicts this pitch.  if so then no matter what
        // we need an accidental.
        for (let i = pitchPast.length - 1; i >= 0; i--) {
            const thisPPast = pitchPast[i];
            if (thisPPast === undefined) {
                throw new Error(`PitchPast was undefined ${i}`);
            }

            if (thisPPast.step === this.step && thisPPast.octave === this.octave) {
                if (thisPPast.name !== this.name) {  // conflicting alters, need accidental and return
                    if (this.accidental === undefined) {
                        this.accidental = new Accidental('natural');
                    }
                    this.accidental.displayStatus = true;
                    return;
                } else {  // names are the same, skip this line of questioning
                    break;
                }
            }
        }
        // nope, no previous pitches in this octave and register, now more complex things...

        // here tied and always are treated the same; we assume that
        // making ties sets the displayStatus, and thus we would not be
        // overriding that display status here
        if (cautionaryAll === true
            || (this.accidental !== undefined
                && ['even-tied', 'always'].includes(this.accidental.displayType))) {
            // show all no matter
            if (this.accidental === undefined) {
                this.accidental = new Accidental('natural');
            }
            // show all accidentals, even if past encountered
            this.accidental.displayStatus = true;
            return;  // do not search past
        }

        // store if a match was found and display set from past pitches
        let setFromPitchPast = false;

        let pSelf: Pitch;
        if (cautionaryPitchClass === true) {  // warn no mater what octave; thus create new without oct
            pSelf = new Pitch(this.name);
            pSelf.accidental = this.accidental;
        } else {
            pSelf = this;
        }
        // where does the line divide between in measure and out of measure
        const outOfMeasureLength = pitchPastMeasure.length;

        // need to step through pitchPast in reverse
        // comparing this pitch to the past pitches; if we find a match
        // in terms of name, then decide what to do

        // are we only comparing a list of past pitches all of
        // which are the same as this one and in the same measure?
        // if so, set continuousRepeatsInMeasure to true
        // else, set to false

        // figure out if this pitch is in the measure (pPastInMeasure = true)
        // or not.
        for (let i = pitchPastAll.length - 1; i >= 0; i--) {
            // is the past pitch in the measure or out of the measure?
            let pPastInMeasure: boolean;

            if (i < outOfMeasureLength) {
                pPastInMeasure = false;
                continuousRepeatsInMeasure = false;
            } else {
                pPastInMeasure = true;
                let broken = false;  // did we break out of the measure...
                for (let j = i; j < pitchPastAll.length; j++) {
                    // do we have a continuous stream of the same note leading up to this one...
                    if (pitchPastAll[j].nameWithOctave !== this.nameWithOctave) {
                        continuousRepeatsInMeasure = false;
                        broken = true;
                        break;
                    }
                }
                if (!broken) {
                    continuousRepeatsInMeasure = true;
                }
            }
            // if the pitch is the first of a measure, has an accidental,
            // it is not an altered key signature pitch,
            // and it is not a natural, it should always be set to display
            if (pPastInMeasure === false
                    && this.accidental !== undefined
                    && !this._nameInKeySignature(alteredPitches)) {
                this.accidental.displayStatus = true;
                return;  // do not search past
            }
            // create Pitch objects for comparison; remove pitch space
            // information if we are only doing a pitch class comparison
            let pPast: Pitch;

            if (cautionaryPitchClass === true) {  // no octave; create new without oct
                pPast = new Pitch(pitchPastAll[i].name);
                // must manually assign reference to the same accidentals
                // as name alone will not transfer display status
                pPast.accidental = pitchPastAll[i].accidental;
            } else {  // cautionary in terms of pitch space; must match exact
                pPast = pitchPastAll[i];
            }
            // if we do not match steps (A and A#), we can continue
            if (pPast.step !== pSelf.step) {
                continue;
            }
            // store whether these match at the same octave; needed for some
            // comparisons even if not matching pitchSpace
            let octaveMatch: boolean;
            if (this.octave === pitchPastAll[i].octave) {
                octaveMatch = true;
            } else {
                octaveMatch = false;
            }
            // repeats of the same pitch immediately following, in the same measure
            // where one previous pitch has displayStatus = true; don't display
            if (continuousRepeatsInMeasure === true
                && pPast.accidental !== undefined
                && pPast.accidental.displayStatus === true) {
                // only needed if one has a natural and this does not
                if (pSelf.accidental !== undefined) {
                    if (this.accidental !== undefined) {
                        this.accidental.displayStatus = false;
                    }
                }
                return;

            } else if (continuousRepeatsInMeasure === true
                        && pPast.accidental !== undefined
                        && pSelf.accidental !== undefined
                        && pPast.accidental.name === pSelf.accidental.name) {
                // repeats of the same accidentally immediately following
                // if An to An or A# to A#: do not need unless repeats requested,
                // regardless of if 'unless-repeated' is set, this will catch
                // a repeated case

                // BUG! what about C#4 C#5 C#4 C#5 -- last C#4 and C#5
                //   should not show accidental if cautionaryNotImmediateRepeat is false

                // if not in the same octave, and not in the key sig, do show accidental
                if (this._nameInKeySignature(alteredPitches) === false
                    && (octaveMatch === false
                        || pPast.accidental.displayStatus === false)) {
                    displayAccidentalIfNoPreviousAccidentals = true;
                    // noinspection UnnecessaryContinueJS
                    continue;  // end of loop
                } else {
                    this.accidental.displayStatus = false;
                    setFromPitchPast = true;
                    break;
                }
                // if An to A: do not need another natural
                // yet, if we are against the key sig, then we need another natural if in another octave
            } else if (pPast.accidental !== undefined
                        && pPast.accidental.name === 'natural'
                        && (pSelf.accidental === undefined
                            || pSelf.accidental.name === 'natural')) {
                if (continuousRepeatsInMeasure === true) {  // an immediate repeat; do not show
                    // unless we are altering the key signature and in
                    // a different register
                    if (this._stepInKeySignature(alteredPitches) === true
                        && octaveMatch === false) {
                        if (this.accidental === undefined) {
                            this.accidental = new Accidental('natural');
                        }
                        this.accidental.displayStatus = true;
                    } else {
                        if (this.accidental !== undefined) {
                            this.accidental.displayStatus = false;
                        }
                    }
                    // if we match the step in a key signature and we want
                    // cautionary not immediate repeated
                } else if (this._stepInKeySignature(alteredPitches) === true
                    && cautionaryNotImmediateRepeat === true) {
                    if (this.accidental === undefined) {
                        this.accidental = new Accidental('natural');
                    }
                    this.accidental.displayStatus = true;

                    // cautionaryNotImmediateRepeat is false
                    // but the previous note was not in this measure,
                    // so do the previous step anyhow
                } else if (this._stepInKeySignature(alteredPitches) === true
                    && cautionaryNotImmediateRepeat === false
                    && pPastInMeasure === false) {
                    if (this.accidental === undefined) {
                        this.accidental = new Accidental('natural');
                    }
                    this.accidental.displayStatus = true;

                    // other cases: already natural in past usage, do not need
                    // natural again (and not in key sig)
                } else {
                    if (this.accidental !== undefined) {
                        this.accidental.displayStatus = false;
                    }
                }
                setFromPitchPast = true;
                break;

                // if A# to A, or A- to A, but not A# to A#
                // we use step and octave though not necessarily a ps comparison
            } else if (pPast.accidental !== undefined
                        && pPast.accidental.name !== 'natural'
                        && (pSelf.accidental === undefined
                            || pSelf.accidental.displayStatus === false)) {
                if (octaveMatch === false && cautionaryPitchClass === false) {
                    continue;
                }
                if (this.accidental === undefined) {
                    this.accidental = new Accidental('natural');
                }
                this.accidental.displayStatus = true;
                setFromPitchPast = true;
                break;

                // if An or A to A#: need to make sure display is set
            } else if ((pPast.accidental === undefined
                            || pPast.accidental.name === 'natural')
                        && pSelf.accidental !== undefined
                        && pSelf.accidental.name !== 'natural') {
                // noinspection JSObjectNullOrUndefined
                this.accidental.displayStatus = true;  // accidental is never undefined/natural
                setFromPitchPast = true;
                break;

                // if A- or An to A#: need to make sure display is set
            } else if (pPast.accidental !== undefined
                        && pSelf.accidental !== undefined
                        && pPast.accidental.name !== pSelf.accidental.name) {
                // noinspection JSObjectNullOrUndefined
                this.accidental.displayStatus = true;  // accidental is never undefined/natural
                setFromPitchPast = true;
                break;

                // going from a natural to an accidental, we should already be
                // showing the accidental, but just to check
                // if A to A#, or A to A-, but not A# to A
            } else if (pPast.accidental === undefined && pSelf.accidental !== undefined) {
                // noinspection JSObjectNullOrUndefined
                this.accidental.displayStatus = true;  // accidental is never undefined/natural
                // environLocal.printDebug(['match previous no mark'])
                setFromPitchPast = true;
                break;

                // if A# to A# and not immediately repeated:
                // default is to show accidental
                // if cautionaryNotImmediateRepeat is false, will not be shown
            } else if (continuousRepeatsInMeasure === false
                        && pPast.accidental !== undefined
                        && pSelf.accidental !== undefined
                        && pPast.accidental.name === pSelf.accidental.name
                        && octaveMatch === true) {
                if (cautionaryNotImmediateRepeat === false
                        && pPast.accidental.displayStatus !== false) {
                    // do not show (unless previous note's accidental wasn't displayed
                    // because of a tie or some other reason)
                    // result will be false, do not need to check altered tones
                    // noinspection JSObjectNullOrUndefined
                    this.accidental.displayStatus = false;
                    displayAccidentalIfNoPreviousAccidentals = false;
                    setFromPitchPast = true;
                    break;
                } else if (pPast.accidental.displayStatus === false) {
                    // in case of ties...
                    displayAccidentalIfNoPreviousAccidentals = true;
                } else {
                    if (!this._nameInKeySignature(alteredPitches)) {
                        this.accidental.displayStatus = true;
                    } else {
                        this.accidental.displayStatus = false;
                    }
                    setFromPitchPast = true;
                    return;
                }
            }
        }
        // if we have no previous matches for this pitch and there is
        // an accidental: show, unless in alteredPitches
        // cases of displayAlways and related are matched above
        if (displayAccidentalIfNoPreviousAccidentals === true) {
            // not the first pitch of this nameWithOctave in the measure
            // but, because of ties, the first to be displayed
            if (this._nameInKeySignature(alteredPitches) === false) {
                if (this.accidental === undefined) {
                    this.accidental = new Accidental('natural');
                }
                this.accidental.displayStatus = true;
            } else {
                this.accidental.displayStatus = false;
            }
            // displayAccidentalIfNoPreviousAccidentals = false  // just to be sure
        } else if (!setFromPitchPast && this.accidental !== undefined) {
            if (!this._nameInKeySignature(alteredPitches)) {
                this.accidental.displayStatus = true;
            } else {
                this.accidental.displayStatus = false;
            }
            // if we have natural that alters the key sig, create a natural
        } else if (!setFromPitchPast && this.accidental === undefined) {
            if (this._stepInKeySignature(alteredPitches)) {
                this.accidental = new Accidental('natural');
                this.accidental.displayStatus = true;
            }
        }
    }



    /**
     * Returns the vexflow name for the pitch in the given clef.
     *
     * if clefObj is undefined, then the clef is treated as TrebleClef.
     *
     * [clefObj] - the active music21.clef.Clef object
     */
    vexflowName(clefObj?: clef.Clef): string {
        // returns a vexflow Key name for this pitch.
        let tempPitch: Pitch = this;
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
