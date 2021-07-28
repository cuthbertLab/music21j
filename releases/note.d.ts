/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/note -- Note, Rest, NotRest, GeneralNote
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * Module for note classes. See the namespace {@link music21.note}
 *
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
import * as prebase from './prebase';
import * as base from './base';
import * as pitch from './pitch';
import * as beam from './beam';
import { Music21Exception } from './exceptions21';
import type * as articulations from './articulations';
import type * as expressions from './expressions';
import type * as instrument from './instrument';
export declare class NotRestException extends Music21Exception {
}
export declare const noteheadTypeNames: string[];
export declare const stemDirectionNames: string[];
/**
 * Class for a single Lyric attached to a {@link GeneralNote}
 *
 * @class Lyric
 * @memberOf music21.note
 * @param {string} text - the text of the lyric
 * @param {number} number=1 - the lyric number
 * @param {string} syllabic=undefined - placement of the syllable
 *     ('begin', 'middle', 'end', 'single'); undefined = interpret from text
 * @param {boolean} applyRaw=false - true = display the text exactly as it
 *     is or, false = use "-" etc. to determine syllabic
 * @param {string} identifier=undefined - identifier for the lyric.
 * @property {string} lyricConnector='-' - what to place between two
 *     lyrics that are syllabic.
 * @property {string} text - the text of the lyric syllable.
 * @property {string} syllabic - see above
 * @property {boolean} applyRaw - see above
 * @property {string} identifier - see above; gets .number if undefined
 * @property {number} number - see above
 * @property {string} rawText - text + any connectors
 */
export declare class Lyric extends prebase.ProtoM21Object {
    static get className(): string;
    lyricConnector: string;
    text: string;
    protected _number: number;
    protected _identifier: string | number;
    syllabic: string;
    applyRaw: boolean;
    style: any;
    constructor(text: string, number?: number, syllabic?: any, applyRaw?: boolean, identifier?: string | number);
    get identifier(): string | number;
    set identifier(i: string | number);
    get number(): number;
    set number(n: number);
    /**
     * get rawText - gets the raw text.
     *
     * @return {string}  raw text
     */
    get rawText(): string;
    set rawText(t: string);
    /**
     * setTextAndSyllabic - Given a setting for rawText and applyRaw,
     *     sets the syllabic type for a lyric based on the rawText
     *
     * @param  {string} rawText text
     * @param  {boolean} applyRaw = false if hyphens should not be applied
     * @return {this}
     */
    setTextAndSyllabic(rawText: any, applyRaw?: boolean): this;
}
/**
 * Superclass for all Note values
 *
 * @class GeneralNote
 * @memberof music21.note
 * @param {(number|undefined)} [ql=1.0] - quarterLength of the note
 * @property {boolean} [isChord=false] - is this a chord
 * @property {number} quarterLength - shortcut to `.duration.quarterLength`
 * @property {Vex.Flow.StaveNote} [activeVexflowNote] - most recent
 *     Vex.Flow.StaveNote object to be made from this note (could change);
 *     default: undefined
 * @property {Array<music21.expressions.Expression>} expressions - array
 *     of attached expressions
 * @property {Array<music21.articulations.Articulation>} articulations - array
 *     of attached articulations
 * @property {string} lyric - the text of the first
 *     {@link Lyric} object; can also set one.
 * @property {Array<Lyric>} lyrics - array of attached lyrics
 * @property {number} [volume=60] - how loud is this note, 0-127, before
 *     articulations
 * @property {number} midiVolume - how loud is this note, taking into
 *     account articulations
 * @property {music21.tie.Tie|undefined} [tie=undefined] - a tie object
 */
export declare class GeneralNote extends base.Music21Object {
    static get className(): string;
    isNote: boolean;
    isRest: boolean;
    isChord: boolean;
    volume: number;
    expressions: expressions.Expression[];
    articulations: articulations.Articulation[];
    lyrics: Lyric[];
    tie: any;
    activeVexflowNote: Vex.Flow.Note;
    constructor(ql?: number);
    get lyric(): string;
    set lyric(value: string);
    get midiVolume(): number;
    /**
     * Add a {@link Lyric} object to the Note
     *
     * @param {string} text - text to be added
     * @param {number} [lyricNumber] - integer specifying lyric (defaults to the current `.lyrics.length` + 1)
     * @param {boolean} [applyRaw=false] - if `true`, do not parse the text for cluses about syllable placement.
     * @param {string} [lyricIdentifier] - an optional identifier
     */
    addLyric(text: any, lyricNumber: any, applyRaw: boolean, lyricIdentifier: any): void;
    /**
     * Change stem direction according to clef. Does nothing for GeneralNote; overridden in subclasses.
     *
     * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
     * @returns {this}
     */
    setStemDirectionFromClef(clef: any): this;
    getStemDirectionFromClef(clef: any): any;
    /**
     * Sets the vexflow accidentals (if any) and the dots
     *
     * @param {Vex.Flow.StaveNote} vfn - a Vex.Flow note
     * @param {Object} options -- a set of Vex Flow options
     */
    vexflowAccidentalsAndDisplay(vfn: any, options?: {}): void;
    /**
     * Return the active channel for the instrument or activeSite's instrument
     */
    activeChannel(instrument?: instrument.Instrument): number;
    /**
     * Play the current element as a MIDI note.
     *
     * For a general note -- same as a rest -- doesn't make a sound.  :-)
     *
     * @param {number} [tempo=120] - tempo in bpm
     * @param {base.Music21Object} [nextElement] - for determining
     *     the length to play in case of tied notes, etc.
     * @param {Object} [options] - other options (currently just
     *     `{instrument: {@link music21.instrument.Instrument} }`)
     * @returns {number} - delay time in milliseconds until the next element (may be ignored)
     */
    playMidi(tempo: number, nextElement: any, { instrument, channel }?: {
        instrument?: any;
        channel?: any;
    }): number;
}
/**
 * Specifies that a GeneralNote is not a rest (Unpitched, Note, Chord).
 *
 * @param {number} [ql=1.0] - length in quarter notes
 * @property {music21.beam.Beams} beams - a link to a beam object
 * @property {string} [notehead='normal'] - notehead type
 * @property {string} [noteheadFill='default'] - notehead fill (to be moved to style...)
 * @property {string|undefined} [noteheadColor=undefined] - notehead color
 * @property {boolean} [noteheadParenthesis=false] - put a parenthesis around the notehead?
 * @property {string|undefined} [stemDirection=undefined] - One of
 *     ['up','down','noStem', undefined] -- 'double' not supported
 */
export declare class NotRest extends GeneralNote {
    static get className(): string;
    notehead: string;
    noteheadFill: string;
    noteheadColor: string;
    noteheadParenthesis: boolean;
    volume: number;
    beams: beam.Beams;
    protected _stemDirection: string;
    constructor(ql?: number);
    get pitches(): pitch.Pitch[];
    set pitches(_value: pitch.Pitch[]);
    get stemDirection(): string;
    set stemDirection(direction: string);
    /**
     * Returns a `Vex.Flow.StaveNote` that approximates this note.
     *
     * @param {Object} [options={}] - `{clef: {@link music21.clef.Clef} }`
     * clef to set the stem direction of.
     * @returns {Vex.Flow.StaveNote}
     */
    vexflowNote({ clef }?: {
        clef?: any;
    }): Vex.Flow.StaveNote;
}
/**
 * A very, very important class! music21.note.Note objects combine a {@link music21.pitch.Pitch}
 * object to describe pitch (highness/lowness) with a {@link music21.duration.Duration} object
 * that defines length, with additional features for drawing the Note, playing it back, etc.
 *
 * Together with {@link Stream} one of the two most important
 * classes in `music21`.
 *
 * See {@link NotRest}, {@link GeneralNote},
 * {@link base.Music21Object}
 * and {@link prebase.ProtoM21Object} (or in general, the **extends** list below) for other
 * things you can do with a `Note` object.
 *
 * Missing from music21p: `transpose(), fullName`.  Transpose cannot be added because of circular imports
 *
 * @class Note
 * @memberof music21.note
 */
export declare class Note extends NotRest {
    static get className(): string;
    isNote: boolean;
    isRest: boolean;
    pitch: pitch.Pitch;
    /**
     *
     * @param {(string|music21.pitch.Pitch|undefined)} [nn='C4'] - pitch
     *     name ("C", "D#", "E-") w/ or w/o octave ("C#4"), or a pitch.Pitch object
     * @param {(number|undefined)} [ql=1.0] - length in quarter notes
     * @property {boolean} [isNote=true] - is it a Note? Yes!
     * @property {boolean} [isRest=false] - is it a Rest? No!
     * @property {music21.pitch.Pitch} pitch - the {@link music21.pitch.Pitch} associated with the Note.
     * @property {string} name - shortcut to `.pitch.name`
     * @property {string} nameWithOctave - shortcut to `.pitch.nameWithOctave`
     * @property {string} step - shortcut to `.pitch.step`
     * @property {number} octave - shortcut to `.pitch.octave`
     */
    constructor(nn?: string | pitch.Pitch, ql?: number);
    stringInfo(): string;
    get name(): string;
    set name(nn: string);
    get nameWithOctave(): string;
    set nameWithOctave(nn: string);
    get step(): string;
    set step(nn: string);
    get octave(): number;
    set octave(nn: number);
    get pitches(): pitch.Pitch[];
    set pitches(value: pitch.Pitch[]);
    /**
     * Change stem direction according to clef.
     *
     * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
     * @returns {this} Original object, for chaining methods
     */
    setStemDirectionFromClef(clef: any): this;
    /**
     * Same as setStemDirectionFromClef, but do not set the note, just return it.
     */
    getStemDirectionFromClef(clef: any): string;
    vexflowAccidentalsAndDisplay(vfn: any, { stave, clef }?: {
        stave?: any;
        clef?: any;
    }): void;
    playMidi(tempo?: number, nextElement?: any, { instrument, channel, playLegato, }?: {
        instrument?: any;
        channel?: any;
        playLegato?: boolean;
    }): number;
}
/**
 * Represents a musical rest.
 *
 * @class Rest
 * @memberof music21.note
 * @param {number} [ql=1.0] - length in number of quarterNotes
 * @property {Boolean} [isNote=false]
 * @property {Boolean} [isRest=true]
 * @property {string} [name='rest']
 * @property {number} [lineShift=undefined] - number of lines to shift up or down from default
 * @property {string|undefined} [color='black'] - color of the rest
 */
export declare class Rest extends GeneralNote {
    static get className(): string;
    isNote: boolean;
    isRest: boolean;
    name: string;
    lineShift: number;
    color: string;
    volume: number;
    constructor(ql?: number);
    /**
     *
     * @returns {string}
     */
    stringInfo(): string;
    /**
     * Returns a `Vex.Flow.StaveNote` that approximates this rest.
     * Corrects for bug in VexFlow that renders a whole rest too low.
     *
     * @param {Object} options -- vexflow options
     * @returns {Vex.Flow.StaveNote}
     */
    vexflowNote(options: any): any;
}
//# sourceMappingURL=note.d.ts.map