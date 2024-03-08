import * as prebase from './prebase';
import type * as clef from './clef';
interface UpdateAccidentalDisplayParams {
    pitchPast?: Pitch[];
    pitchPastMeasure?: Pitch[];
    otherSimultaneousPitches?: Pitch[];
    alteredPitches?: Pitch[];
    cautionaryPitchClass?: boolean;
    cautionaryAll?: boolean;
    overrideStatus?: boolean;
    cautionaryNotImmediateRepeat?: boolean;
    lastNoteWasTied?: boolean;
}
/**
 * @param {string|number} accName - an accidental name
 * @property {number} alter
 * @property {string} displayType
 * @property {boolean|undefined} displayStatus
 */
export declare class Accidental extends prebase.ProtoM21Object {
    static get className(): string;
    protected _name: string;
    protected _alter: number;
    protected _modifier: string;
    protected _unicodeModifier: string;
    displayType: string;
    displayStatus: boolean;
    constructor(accName: string | number);
    stringInfo(): string;
    eq(other: Accidental): boolean;
    /**
     * Sets a parameter of the accidental and updates name, alter, and modifier to suit.
     *
     * accName - the name, number, or modifier to set
     */
    set(accName: number | string): void;
    /**
     * Return or set the name of the accidental ('flat', 'sharp', 'natural', etc.);
     *
     * When set, updates alter and modifier.
     *
     * @type {string}
     */
    get name(): string;
    set name(n: string);
    /**
     * Return or set the alter of the accidental
     *
     * When set, updates name and modifier.
     *
     * @type {number}
     */
    get alter(): number;
    set alter(alter: number);
    /**
     * Return or set the modifier ('-', '#', '')
     *
     * When set, updates alter and name.
     *
     * @type {string}
     */
    get modifier(): string;
    set modifier(modifier: string);
    /**
     * Returns the modifier for vexflow ('b', '#', 'n')
     *
     * @type {string}
     * @readonly
     */
    get vexflowModifier(): "n" | "#" | "##" | "###" | "bb" | "b" | "bbb";
    /**
     * Returns the modifier in unicode or
     * for double and triple accidentals, as a hex escape
     *
     * @type {string}
     * @readonly
     */
    get unicodeModifier(): string;
}
/**
 *
 * @type {{A: number, B: number, C: number, D: number, E: number, F: number, G: number}}
 */
export declare const nameToMidi: {
    C: number;
    D: number;
    E: number;
    F: number;
    G: number;
    A: number;
    B: number;
};
/**
 *
 * @type {{A: number, B: number, C: number, D: number, E: number, F: number, G: number}}
 */
export declare const nameToSteps: {
    C: number;
    D: number;
    E: number;
    F: number;
    G: number;
    A: number;
    B: number;
};
/**
 *
 * @type {string[]}
 */
export declare const stepsToName: string[];
/**
 *
 * @type {string[]}
 */
export declare const midiToName: string[];
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
export declare class Pitch extends prebase.ProtoM21Object {
    static get className(): string;
    protected _step: string;
    protected _octave: number;
    protected _accidental: Accidental | undefined;
    spellingIsInferred: boolean;
    microtone: any;
    constructor(pn?: string | number);
    stringInfo(): string;
    eq(other: Pitch): boolean;
    get step(): string;
    set step(s: string);
    get octave(): number;
    set octave(o: number);
    get implicitOctave(): number;
    get accidental(): Accidental | undefined;
    set accidental(a: Accidental | undefined);
    get name(): string;
    set name(nn: string);
    get nameWithOctave(): string;
    set nameWithOctave(pn: string);
    /**
     *
     * @type {number}
     * @readonly
     */
    get pitchClass(): number;
    /**
     *
     * @type {number}
     */
    get diatonicNoteNum(): any;
    set diatonicNoteNum(newDNN: any);
    /**
     *
     * @type {number}
     * @readonly
     */
    get frequency(): number;
    /**
     *
     * @type {number}
     * @readonly
     */
    get midi(): number;
    /**
     *
     * @type {number}
     */
    get ps(): any;
    set ps(ps: any);
    /**
     * @type {string}
     * @readonly
     */
    get unicodeName(): string;
    /**
     * @type {string}
     * @readonly
     */
    get unicodeNameWithOctave(): string;
    /**
     * @param {boolean} inPlace
     * @param {int} directionInt -- -1 = down, 1 = up
     * @returns {Pitch}
     */
    _getEnharmonicHelper(inPlace?: boolean, directionInt?: number): this;
    /**
     *
     * @param {boolean} [inPlace=false]
     * @returns {Pitch}
     */
    getHigherEnharmonic(inPlace?: boolean): this;
    /**
     *
     * @param {boolean} [inPlace=false]
     * @returns {Pitch}
     */
    getLowerEnharmonic(inPlace?: boolean): this;
    protected _nameInKeySignature(alteredPitches: Pitch[]): boolean;
    protected _stepInKeySignature(alteredPitches: Pitch[]): boolean;
    updateAccidentalDisplay({ pitchPast, pitchPastMeasure, otherSimultaneousPitches, alteredPitches, cautionaryPitchClass, cautionaryAll, overrideStatus, cautionaryNotImmediateRepeat, lastNoteWasTied, }?: UpdateAccidentalDisplayParams): void;
    /**
     * Returns the vexflow name for the pitch in the given clef.
     *
     * if clefObj is undefined, then the clef is treated as TrebleClef.
     *
     * [clefObj] - the active music21.clef.Clef object
     */
    vexflowName(clefObj?: clef.Clef): string;
}
export {};
//# sourceMappingURL=pitch.d.ts.map