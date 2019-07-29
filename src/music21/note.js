/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/note -- Note, Rest, NotRest, GeneralNote
 *
 * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (music21p), Copyright (c) 2006–19, Michael Scott Cuthbert and cuthbertLab
 *
 * Module for note classes. See the namespace {@link music21.note}
 *
 * @requires music21/common
 * @requires music21/prebase
 * @requires music21/base
 * @requires music21/pitch
 * @requires music21/beam
 * @exports music21/note
 * Namespace for notes (single pitch) or rests, and some things like Lyrics that go on notes.
 *
 * @namespace music21.note
 * @memberof music21
 * @property {string[]} noteheadTypeNames - an Array of allowable notehead names.
 * @property {string[]} stemDirectionNames - an Array of allowable stemDirection names.
 */
import Vex from 'vexflow';
import * as MIDI from 'midicube';

import * as prebase from './prebase.js';
import * as base from './base.js';
import { debug } from './debug.js';
import * as pitch from './pitch.js';
import { beam } from './beam.js';
import * as common from './common.js';
import { Music21Exception } from './exceptions21.js';

export class NotRestException extends Music21Exception {
    // no need
}

export const noteheadTypeNames = [
    'arrow down',
    'arrow up',
    'back slashed',
    'circle dot',
    'circle-x',
    'circled',
    'cluster',
    'cross',
    'diamond',
    'do',
    'fa',
    'inverted triangle',
    'la',
    'left triangle',
    'mi',
    'none',
    'normal',
    'other',
    're',
    'rectangle',
    'slash',
    'slashed',
    'so',
    'square',
    'ti',
    'triangle',
    'x',
];

export const stemDirectionNames = [
    'double',
    'down',
    'noStem',
    'none',
    'unspecified',
    'up',
];

/**
 * Class for a single Lyric attached to a {@link music21.note.GeneralNote}
 *
 * @class Lyric
 * @memberOf music21.note
 * @extends music21.prebase.ProtoM21Object
 * @param {string} text - the text of the lyric
 * @param {number} number=1 - the lyric number
 * @param {string} syllabic=undefined - placement of the syllable ('begin', 'middle', 'end', 'single'); undefined = interpret from text
 * @param {boolean} applyRaw=false - true = display the text exactly as it is or, false = use "-" etc. to determine syllabic
 * @param {string} identifier=undefined - identifier for the lyric.
 * @property {string} lyricConnector='-' - what to place between two lyrics that are syllabic.
 * @property {string} text - the text of the lyric syllable.
 * @property {string} syllabic - see above
 * @property {boolean} applyRaw - see above
 * @property {string} identifier - see above; gets .number if undefined
 * @property {number} number - see above
 * @property {string} rawText - text + any connectors
 */
export class Lyric extends prebase.ProtoM21Object {
    constructor(text, number = 1, syllabic, applyRaw, identifier) {
        super();
        this.lyricConnector = '-'; // override to place something else between two notes...
        this.text = text;
        this._number = number;
        this.syllabic = syllabic;
        this.applyRaw = applyRaw || false;
        this.setTextAndSyllabic(this.text, this.applyRaw);
        this._identifier = identifier;
        this.style = {
            fillStyle: 'black',
            strokeStyle: 'black',
            fontFamily: 'Serif',
            fontSize: 12,
            fontWeight: '',
        };
    }

    get identifier() {
        return this._identifier || this._number;
    }

    set identifier(i) {
        this._identifier = i;
    }

    // a property just to match m21p
    get number() {
        return this._number;
    }

    set number(n) {
        this._number = n;
    }

    /**
     * get rawText - gets the raw text.
     *
     * @return {string}  raw text
     */
    get rawText() {
        if (this.syllabic === 'begin') {
            return this.text + this.lyricConnector;
        } else if (this.syllabic === 'middle') {
            return this.lyricConnector + this.text + this.lyricConnector;
        } else if (this.syllabic === 'end') {
            return this.lyricConnector + this.text;
        } else {
            return this.text;
        }
    }

    set rawText(t) {
        this.setTextAndSyllabic(t, true);
    }

    /**
     * setTextAndSyllabic - Given a setting for rawText and applyRaw,
     *     sets the syllabic type for a lyric based on the rawText
     *
     * @param  {string} rawText text
     * @param  {boolean} applyRaw = false if hyphens should not be applied
     * @return {this}
     */
    setTextAndSyllabic(rawText, applyRaw = false) {
        if (rawText === undefined) {
            this.text = undefined;
            return this;
        }

        if (
            !applyRaw
            && rawText.indexOf(this.lyricConnector) === 0
            && rawText.slice(-1) === this.lyricConnector
        ) {
            this.text = rawText.slice(1, -1);
            this.syllabic = 'middle';
        } else if (!applyRaw && rawText.indexOf(this.lyricConnector) === 0) {
            this.text = rawText.slice(1);
            this.syllabic = 'end';
        } else if (!applyRaw && rawText.slice(-1) === this.lyricConnector) {
            this.text = rawText.slice(0, -1);
            this.syllabic = 'begin';
        } else {
            this.text = rawText;
            if (this.syllabic === undefined) {
                this.syllabic = 'single';
            }
        }
        return this;
    }
}

/* Notes and rests etc... */

/**
 * Superclass for all Note values
 *
 * @class GeneralNote
 * @memberof music21.note
 * @extends music21.base.Music21Object
 * @param {(number|undefined)} [ql=1.0] - quarterLength of the note
 * @property {boolean} [isChord=false] - is this a chord
 * @property {number} quarterLength - shortcut to `.duration.quarterLength`
 * @property {Vex.Flow.StaveNote} [activeVexflowNote] - most recent Vex.Flow.StaveNote object to be made from this note (could change); default, undefined
 * @property {Array<music21.expressions.Expression>} expressions - array of attached expressions
 * @property {Array<music21.articulations.Articulation>} articulations - array of attached articulations
 * @property {string} lyric - the text of the first {@link music21.note.Lyric} object; can also set one.
 * @property {Array<music21.note.Lyric>} lyrics - array of attached lyrics
 * @property {number} [volume=60] - how loud is this note, 0-127, before articulations
 * @property {number} midiVolume - how loud is this note, taking into account articulations
 * @property {music21.tie.Tie|undefined} [tie=undefined] - a tie object
 */
export class GeneralNote extends base.Music21Object {
    constructor(ql) {
        super();
        this.isChord = false;
        if (ql !== undefined) {
            this.duration.quarterLength = ql;
        } else {
            this.duration.quarterLength = 1.0;
        }
        this.volume = 60;
        this.activeVexflowNote = undefined;
        this.expressions = [];
        this.articulations = [];
        this.lyrics = [];
        this.tie = undefined;
        /* TODO: editorial objects, color, addLyric, insertLyric, hasLyrics */
        /* Later: augmentOrDiminish, getGrace, */
    }

    get lyric() {
        if (this.lyrics.length > 0) {
            return this.lyrics[0].text;
        } else {
            return undefined;
        }
    }

    set lyric(value) {
        this.lyrics = [];
        if (value !== undefined && value !== false) {
            this.lyrics.push(new Lyric(value));
        }
    }

    get midiVolume() {
        let volume = this.volume;
        if (volume === undefined) {
            volume = 60;
        }
        if (this.articulations !== undefined) {
            this.articulations.forEach(a => {
                volume *= a.dynamicScale;
                if (volume > 127) {
                    volume = 127;
                } else if (Number.isNaN(volume)) {
                    volume = 60;
                }
            });
        }
        volume = Math.floor(volume);
        return volume;
    }

    /**
     * Add a {@link music21.note.Lyric} object to the Note
     *
     * @param {string} text - text to be added
     * @param {number} [lyricNumber] - integer specifying lyric (defaults to the current `.lyrics.length` + 1)
     * @param {boolean} [applyRaw=false] - if `true`, do not parse the text for cluses about syllable placement.
     * @param {string} [lyricIdentifier] - an optional identifier
     */
    addLyric(text, lyricNumber, applyRaw = false, lyricIdentifier) {
        if (lyricNumber === undefined) {
            const maxLyrics = this.lyrics.length + 1;
            const newLyric = new Lyric(
                text,
                maxLyrics,
                undefined,
                applyRaw,
                lyricIdentifier
            );
            this.lyrics.push(newLyric);
        } else {
            let foundLyric = false;
            for (let i = 0; i < this.lyrics.length; i++) {
                const thisLyric = this.lyrics[i];
                if (thisLyric.number === lyricNumber) {
                    thisLyric.text = text;
                    foundLyric = true;
                    break;
                }
            }
            if (foundLyric === false) {
                const newLyric = new Lyric(
                    text,
                    lyricNumber,
                    undefined,
                    applyRaw,
                    lyricIdentifier
                );
                this.lyrics.push(newLyric);
            }
        }
    }

    /**
     * Change stem direction according to clef. Does nothing for GeneralNote; overridden in subclasses.
     *
     * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
     * @returns {this}
     */
    setStemDirectionFromClef(clef) {
        return this;
    }

    getStemDirectionFromClef(clef) {
        return undefined;
    }

    /**
     * Sets the vexflow accidentals (if any), the dots, and the stem direction
     *
     * @param {Vex.Flow.StaveNote} vfn - a Vex.Flow note
     * @param {Object} options -- a set of Vex Flow options
     */
    vexflowAccidentalsAndDisplay(vfn, options) {
        if (this.duration.dots > 0) {
            for (let i = 0; i < this.duration.dots; i++) {
                vfn.addDotToAll();
            }
        }
        if (debug) {
            console.log(this.stemDirection);
        }
        if (this.stemDirection === 'noStem') {
            vfn.hasStem = () => false; // need to override...
            // vfn.render_options.stem_height = 0;
        } else {
            // correct VexFlow stem length for notes far from the center line;
            let staveDNNSpacing = 5;
            if (options.stave) {
                staveDNNSpacing = Math.floor(
                    options.stave.options.spacing_between_lines_px / 2
                );
            }
            if (options.clef !== undefined && this.pitch !== undefined) {
                const midLine = options.clef.lowestLine + 4;
                // console.log(midLine);
                const absDNNfromCenter = Math.abs(
                    this.pitch.diatonicNoteNum - midLine
                );
                const absOverOctave = absDNNfromCenter - 7;
                // console.log(absOverOctave);
                if (absOverOctave > 0 && vfn.getStemLength !== undefined) {
                    const stemHeight
                        = absOverOctave * staveDNNSpacing + vfn.getStemLength();
                    vfn.setStemLength(stemHeight);
                }
            }
        }
    }

    /**
     * Play the current element as a MIDI note.
     *
     * @param {number} [tempo=120] - tempo in bpm
     * @param {music21.base.Music21Object} [nextElement] - for determining the length to play in case of tied notes, etc.
     * @param {Object} [options] - other options (currently just `{instrument: {@link music21.instrument.Instrument} }`)
     * @returns {Number} - delay time in milliseconds until the next element (may be ignored)
     */
    playMidi(tempo=120, nextElement, options) {
        // returns the number of milliseconds to the next element in
        // case that can't be determined otherwise.
        if (options === undefined) {
            let inst;
            if (this.activeSite !== undefined) {
                inst = this.activeSite.instrument;
            }
            options = { instrument: inst };
        }

        const volume = this.midiVolume;
        let channel = 0;
        if (options.instrument !== undefined) {
            channel = options.instrument.midiChannel;
        }
        const ql = this.duration.quarterLength;
        const milliseconds = 60 * ql * 1000 / tempo;
        let midNum;
        if (this.isClassOrSubclass('Note')) {
            // Note, not rest
            midNum = this.pitch.midi;
            let stopTime = milliseconds / 1000;
            if (nextElement instanceof base.Music21Object
                && nextElement.isClassOrSubclass('Note')
            ) {
                if (nextElement.pitch.midi !== this.pitch.midi) {
                    stopTime += 60 * 0.25 / tempo; // legato -- play 16th note longer
                } else if (
                    this.tie !== undefined
                    && (this.tie.type === 'start' || this.tie.type === 'continue')
                ) {
                    stopTime += 60 * nextElement.duration.quarterLength / tempo;
                    // this does not take into account 3 or more notes tied.
                    // TODO: look ahead at next nexts, etc.
                }
            } else if (nextElement === undefined) {
                // let last note ring an extra beat...
                stopTime += 60 / tempo;
            }
            // console.log(stopTime);
            // console.log(this.tie);
            if (this.tie === undefined || this.tie.type === 'start') {
                // console.log(volume);
                try {
                    MIDI.noteOn(channel, midNum, volume, 0);
                    MIDI.noteOff(channel, midNum, stopTime);
                } catch (e) {
                    // do nothing -- might not have an output channel because of audio not connected
                }
            } // else { console.log ('not going to play ', this.nameWithOctave); }
        } else if (this.isClassOrSubclass('Chord')) {
            // TODO: Tied Chords.
            for (let j = 0; j < this._notes.length; j++) {
                midNum = this._notes[j].pitch.midi;
                try {
                    MIDI.noteOn(channel, midNum, volume, 0);
                    MIDI.noteOff(channel, midNum, milliseconds / 1000);
                } catch (e) {
                    // do nothing -- might not have an output channel because of audio not connected
                }
            }
        } // it's a note.Rest -- do nothing -- milliseconds takes care of it...
        return milliseconds;
    }
}

/**
 * Specifies that a GeneralNote is not a rest (Unpitched, Note, Chord).
 *
 * @class NotRest
 * @memberof music21.note
 * @extends music21.note.GeneralNote
 * @param {number} [ql=1.0] - length in quarter notes
 * @property {music21.beam.Beams} beams - a link to a beam object
 * @property {string} [notehead='normal'] - notehead type
 * @property {string} [noteheadFill='default'] - notehead fill (to be moved to style...)
 * @property {string|undefined} [noteheadColor=undefined] - notehead color
 * @property {boolean} [noteheadParenthesis=false] - put a parenthesis around the notehead?
 * @property {string|undefined} [stemDirection=undefined] - One of ['up','down','noStem', undefined] -- 'double' not supported
 */
export class NotRest extends GeneralNote {
    constructor(ql) {
        super(ql);
        this.notehead = 'normal';
        this.noteheadFill = 'default';
        this.noteheadColor = 'black';
        this.noteheadParenthesis = false;
        this.volume = undefined; // not a real object yet.
        this.beams = new beam.Beams();
        /* TODO: this.duration.linkage -- need durationUnits */
        this._stemDirection = 'unspecified';
        /* TODO: check notehead, noteheadFill, noteheadParentheses */
    }

    get stemDirection() {
        return this._stemDirection;
    }

    set stemDirection(direction) {
        if (direction === undefined) {
            direction = 'unspecified';
        } else if (direction === 'none') {
            direction = 'noStem';
        } else if (!stemDirectionNames.includes(direction)) {
            throw new NotRestException(`not a valid stem direction name: ${direction}`);
        }
        this._stemDirection = direction;
    }

}

/* ------- Note ----------- */
/**
 * A very, very important class! music21.note.Note objects combine a {@link music21.pitch.Pitch}
 * object to describe pitch (highness/lowness) with a {@link music21.duration.Duration} object
 * that defines length, with additional features for drawing the Note, playing it back, etc.
 *
 * Together with {@link music21.stream.Stream} one of the two most important
 * classes in `music21`.
 *
 * See {@link music21.note.NotRest}, {@link music21.note.GeneralNote}, {@link music21.base.Music21Object}
 * and {@link music21.prebase.ProtoM21Object} (or in general, the **extends** list below) for other
 * things you can do with a `Note` object.
 *
 * Missing from music21p: `transpose(), fullName`.  Transpose cannot be added because of circular imports
 *
 * @class Note
 * @memberof music21.note
 * @extends music21.note.NotRest
 */
export class Note extends NotRest {
    /**
     *
     * @param {(string|music21.pitch.Pitch|undefined)} [nn='C4'] - pitch name ("C", "D#", "E-") w/ or w/o octave ("C#4"), or a pitch.Pitch object
     * @param {(number|undefined)} [ql=1.0] - length in quarter notes
     * @property {Boolean} [isNote=true] - is it a Note? Yes!
     * @property {Boolean} [isRest=false] - is it a Rest? No!
     * @property {music21.pitch.Pitch} pitch - the {@link music21.pitch.Pitch} associated with the Note.
     * @property {string} name - shortcut to `.pitch.name`
     * @property {string} nameWithOctave - shortcut to `.pitch.nameWithOctave`
     * @property {string} step - shortcut to `.pitch.step`
     * @property {number} octave - shortcut to `.pitch.octave`
     */
    constructor(nn, ql) {
        super(ql);
        this.isNote = true; // for speed
        this.isRest = false; // for speed
        if (nn instanceof pitch.Pitch) {
            this.pitch = nn;
        } else {
            this.pitch = new pitch.Pitch(nn);
        }
    }

    /**
     *
     * @returns {string}
     */
    stringInfo() {
        return this.name;
    }

    /**
     *
     * @type {string}
     */
    get name() {
        return this.pitch.name;
    }

    set name(nn) {
        this.pitch.name = nn;
    }

    /**
     *
     * @type {string}
     */
    get nameWithOctave() {
        return this.pitch.nameWithOctave;
    }

    set nameWithOctave(nn) {
        this.pitch.nameWithOctave = nn;
    }

    /**
     *
     * @type {string}
     */
    get step() {
        return this.pitch.step;
    }

    set step(nn) {
        this.pitch.step = nn;
    }

    /**
     *
     * @type {number}
     */
    get octave() {
        return this.pitch.octave;
    }

    set octave(nn) {
        this.pitch.octave = nn;
    }

    /**
     *
     * @returns {music21.pitch.Pitch[]}
     */
    get pitches() {
        return [this.pitch];
    }

    set pitches(value) {
        this.pitch = value[0];
        // TODO: raise NoteException on index error.
    }


    /* TODO: transpose, fullName */


    /**
     * Change stem direction according to clef.
     *
     * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
     * @returns {this} Original object, for chaining methods
     */
    setStemDirectionFromClef(clef) {
        if (clef !== undefined) {
            this.stemDirection = this.getStemDirectionFromClef(clef);
        }
        return this;
    }

    /**
     * Same as setStemDirectionFromClef, but do not set the note, just return it.
     */
    getStemDirectionFromClef(clef) {
        if (clef === undefined) {
            return undefined;
        }
        const midLine = clef.lowestLine + 4;
        const DNNFromCenter = this.pitch.diatonicNoteNum - midLine;
        // console.log(DNNFromCenter, this.pitch.nameWithOctave);
        if (DNNFromCenter >= 0) {
            return 'down';
        } else {
            return 'up';
        }
    }

    /**
     * Returns a `Vex.Flow.StaveNote` that approximates this note.
     *
     * @param {Object} [options={}] - `{clef: {@link music21.clef.Clef} }`
     * clef to set the stem direction of.
     * @returns {Vex.Flow.StaveNote}
     */
    vexflowNote(options) {
        const params = {};
        common.merge(params, options);
        const clef = params.clef;

        let useStemDirection = this.stemDirection;

        // fixup stem direction -- must happen before Vex.Flow.Note is created...
        if (
            this.activeSite !== undefined
            && this.activeSite.renderOptions.stemDirection !== undefined
            && stemDirectionNames.includes(
                this.activeSite.renderOptions.stemDirection
            )
        ) {
            useStemDirection = this.activeSite.renderOptions.stemDirection;
        } else if (
            [undefined, 'unspecified'].includes(this.stemDirection)
            && options.clef !== undefined
        ) {
            useStemDirection = this.getStemDirectionFromClef(options.clef);
        }

        if (this.duration === undefined) {
            // console.log(this);
            return undefined;
        }
        const vfd = this.duration.vexflowDuration;
        if (vfd === undefined) {
            return undefined;
        }
        const vexflowKey = this.pitch.vexflowName(clef);

        // Not supported: Double;  None is done elsewhere?
        const vfnStemDirection
            = useStemDirection === 'down'
                ? Vex.Flow.StaveNote.STEM_DOWN
                : Vex.Flow.StaveNote.STEM_UP;

        const vfn = new Vex.Flow.StaveNote({
            keys: [vexflowKey],
            duration: vfd,
            stem_direction: vfnStemDirection,
        });
        this.vexflowAccidentalsAndDisplay(vfn, params); // clean up stuff...
        if (this.pitch.accidental !== undefined) {
            if (
                this.pitch.accidental.vexflowModifier !== 'n'
                && this.pitch.accidental.displayStatus !== false
            ) {
                vfn.addAccidental(
                    0,
                    new Vex.Flow.Accidental(
                        this.pitch.accidental.vexflowModifier
                    )
                );
            } else if (
                this.pitch.accidental.displayType === 'always'
                || this.pitch.accidental.displayStatus === true
            ) {
                vfn.addAccidental(
                    0,
                    new Vex.Flow.Accidental(
                        this.pitch.accidental.vexflowModifier
                    )
                );
            }
        }

        if (this.articulations[0] !== undefined) {
            for (let i = 0; i < this.articulations.length; i++) {
                const art = this.articulations[i];
                // 0 refers to the first pitch (for chords etc.)...
                vfn.addArticulation(0, art.vexflow());
            }
        }
        if (this.expressions[0] !== undefined) {
            for (let j = 0; j < this.expressions.length; j++) {
                const exp = this.expressions[j];
                // 0 refers to the first pitch (for chords etc.)...
                vfn.addArticulation(0, exp.vexflow());
            }
        }
        if (this.noteheadColor !== undefined) {
            vfn.setStyle({ fillStyle: this.noteheadColor, strokeStyle: this.noteheadColor });
        }
        this.activeVexflowNote = vfn;
        return vfn;
    }
}

/* ------ TODO: Unpitched ------ */

/* ------ Rest ------ */

/**
 * Represents a musical rest.
 *
 * @class Rest
 * @memberof music21.note
 * @extends music21.note.GeneralNote
 * @param {number} [ql=1.0] - length in number of quarterNotes
 * @property {Boolean} [isNote=false]
 * @property {Boolean} [isRest=true]
 * @property {string} [name='rest']
 * @property {number} [lineShift=undefined] - number of lines to shift up or down from default
 * @property {string|undefined} [color='black'] - color of the rest
 */
export class Rest extends GeneralNote {
    constructor(ql) {
        super(ql);
        this.isNote = false; // for speed
        this.isRest = true; // for speed
        this.name = 'rest'; // for note compatibility
        this.lineShift = undefined;
        this.color = 'black';
    }

    /**
     *
     * @returns {string}
     */
    stringInfo() {
        return this.duration.quarterLength.toString();
    }


    /**
     * Returns a `Vex.Flow.StaveNote` that approximates this rest.
     * Corrects for bug in VexFlow that renders a whole rest too low.
     *
     * @param {Object} options -- vexflow options
     * @returns {Vex.Flow.StaveNote}
     */
    vexflowNote(options) {
        let keyLine = 'b/4';
        if (this.duration.type === 'whole') {
            if (
                this.activeSite !== undefined
                && this.activeSite.renderOptions.staffLines !== 1
            ) {
                keyLine = 'd/5';
            }
        }
        if (this.lineShift !== undefined) {
            const p = new pitch.Pitch('B4');
            let ls = this.lineShift;
            if (this.duration.type === 'whole') {
                ls += 2;
            }
            p.diatonicNoteNum += ls;
            keyLine = p.vexflowName(undefined);
        }

        const vfn = new Vex.Flow.StaveNote({
            keys: [keyLine],
            duration: this.duration.vexflowDuration + 'r',
        });
        if (this.duration.dots > 0) {
            for (let i = 0; i < this.duration.dots; i++) {
                vfn.addDotToAll();
            }
        }
        if (this.color !== undefined) {
            vfn.setStyle({ fillStyle: this.color, strokeStyle: this.color });
        }
        this.activeVexflowNote = vfn;
        return vfn;
    }
}

/* ------ TODO(msc): SpacerRest  or remove from music21p ------ */
