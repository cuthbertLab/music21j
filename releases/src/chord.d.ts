/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/chord -- Chord
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 * Chord related objects (esp. music21.chord.Chord) and methods.
 *
 */
import { StaveNote as VFStaveNote } from 'vexflow';
import * as note from './note';
import * as chordTables from './chordTables';
import type * as clef from './clef';
import type * as instrument from './instrument';
import type * as pitch from './pitch';
import { VexflowNoteOptions } from './note';
export { chordTables };
/**
 * @param {Array<string|note.Note|pitch.Pitch>} [notes] -
 *     an Array of strings
 *     or pitch.Pitch objects.
 * @property {number} length - the number of pitches in the Chord (readonly)
 * @property {Pitch[]} pitches - an Array of Pitch objects in the
 *     chord. (Consider the Array read only and pass in a new Array to change)
 * @property {Boolean} [isChord=true]
 * @property {Boolean} [isNote=false]
 * @property {Boolean} [isRest=false]
 */
export declare class Chord extends note.NotRest {
    static get className(): string;
    protected _notes: note.Note[];
    isChord: boolean;
    isNote: boolean;
    isRest: boolean;
    _overrides: any;
    _cache: any;
    protected _chordTablesAddress: any;
    protected _chordTablesAddressNeedsUpdating: boolean;
    constructor(notes?: string | string[] | note.Note | note.Note[] | pitch.Pitch | pitch.Pitch[]);
    stringInfo(): string;
    get length(): number;
    get pitches(): pitch.Pitch[];
    set pitches(tempPitches: (pitch.Pitch | string | note.Note)[]);
    get notes(): note.Note[];
    set notes(newNotes: note.Note[]);
    vexflowNote(options?: VexflowNoteOptions): VFStaveNote;
    get orderedPitchClasses(): number[];
    get chordTablesAddress(): any;
    get commonName(): string;
    get forteClass(): string;
    get forteClassNumber(): any;
    get forteClassTnI(): string;
    get(i: number): note.Note;
    [Symbol.iterator](): Generator<note.Note, void, unknown>;
    areZRelations(other: Chord): boolean;
    getZRelation(): Chord;
    get hasZRelation(): boolean;
    get intervalVector(): any;
    setStemDirectionFromClef(clef?: clef.Clef): this;
    /**
     * Adds a note or Array of notes to the chord, sorting the note array
     *
     * runSort - Sort after running (default true)
     */
    add(n: string | string[] | note.Note | note.Note[] | pitch.Pitch | pitch.Pitch[], runSort?: boolean): this;
    sortPitches(): void;
    /**
     * Removes any pitches that appear more than once (in any octave),
     * removing the higher ones, and returns a new Chord.
     *
     * returns A new Chord object with duplicate pitches removed.
     */
    removeDuplicatePitches(): Chord;
    /**
     * Finds the Root of the chord, or sets it as an override.
     */
    root(newroot?: pitch.Pitch): pitch.Pitch;
    /**
     * Returns the number of semitones above the root that a given chordstep is.
     *
     * For instance, in a G dominant 7th chord (G, B, D, F), would
     * return 4 for chordStep=3, since the third of the chord (B) is four semitones above G.
     *
     * chordStep - the step to find, e.g., 1, 2, 3, etc.
     * [testRoot] - the pitch to temporarily consider the root.
     * returns Number of semitones above the root for this
     *     chord step or undefined if no pitch matches that chord step.
     */
    semitonesFromChordStep(chordStep: number, testRoot?: pitch.Pitch): number | undefined;
    /**
     * Gets the lowest note (based on .ps not name) in the chord.
     *
     * return bass pitch or undefined
     */
    bass(newBass?: pitch.Pitch): pitch.Pitch | undefined;
    /**
     * Counts the number of non-duplicate pitch MIDI Numbers in the chord.
     *
     * Call after "closedPosition()" to get Forte style cardinality disregarding octave.
     */
    cardinality(): number;
    isMajorTriad(): boolean;
    isMinorTriad(): boolean;
    isDiminishedTriad(): boolean;
    isAugmentedTriad(): boolean;
    isDominantSeventh(): boolean;
    isDiminishedSeventh(): boolean;
    isSeventhOfType(intervalArray: number[]): boolean;
    /**
     * canBeDominantV - Returns true if the chord is a Major Triad or a Dominant Seventh
     */
    canBeDominantV(): boolean;
    /**
     * Returns true if the chord is a major or minor triad
     */
    canBeTonic(): boolean;
    /**
     * Returns the inversion of the chord as a number (root-position = 0)
     *
     * Unlike music21p version, cannot set the inversion, yet.
     *
     * TODO: add.
     */
    inversion(): number;
    playMidi(tempo?: number, nextElement?: any, { instrument, channel, playLegato, }?: {
        instrument?: instrument.Instrument;
        channel?: number;
        playLegato?: boolean;
    }): number;
    /**
     * Returns the Pitch object that is a Generic interval (2, 3, 4, etc., but not 9, 10, etc.) above
     * the `.root()`
     *
     * In case there is more than one note with that designation (e.g., `[A-C-C#-E].getChordStep(3)`)
     * the first one in `.pitches` is returned.
     */
    getChordStep(chordStep: number, testRoot?: pitch.Pitch): pitch.Pitch | undefined;
    get third(): pitch.Pitch | undefined;
    get fifth(): pitch.Pitch | undefined;
    get seventh(): pitch.Pitch | undefined;
}
export declare const chordDefinitions: {
    major: string[];
    minor: string[];
    diminished: string[];
    augmented: string[];
    'major-seventh': string[];
    'dominant-seventh': string[];
    'minor-seventh': string[];
    'diminished-seventh': string[];
    'half-diminished-seventh': string[];
};
//# sourceMappingURL=chord.d.ts.map