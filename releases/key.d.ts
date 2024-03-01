import * as base from './base';
import * as pitch from './pitch';
import * as scale from './scale';
export declare const modeSharpsAlter: {
    major: number;
    minor: number;
    dorian: number;
    phrygian: number;
    lydian: number;
    mixolydian: number;
    locrian: number;
};
export declare function convertKeyStringToMusic21KeyString(textString: string): string;
/**
 * @description Represents a key signature
 * @param {int} [sharps=0] -- the number of sharps (negative for flats)
 * @property {int} [sharps=0] -- number of sharps (negative for flats)
 * @property {string[]} flatMapping -- flat signatures 0-12 flats
 * @property {string[]} sharpMapping -- sharp signatures 0-12 sharps
 * @example
 * var ks = new music21.key.KeySignature(-3); //E-flat major or c minor
 * var s = new music21.stream.Stream();
 * s.keySignature = ks;
 * var n = new music21.note.Note('A-'); // A-flat
 * s.append(n);
 * s.appendNewDOM();
 */
export declare class KeySignature extends base.Music21Object {
    static get className(): string;
    protected _sharps: number;
    protected _alteredPitchesCache: pitch.Pitch[];
    flatMapping: string[];
    sharpMapping: string[];
    constructor(sharps?: number);
    stringInfo(): string;
    get sharps(): number;
    set sharps(s: number);
    /**
     * Gives the width in pixels necessary to represent the key signature.
     */
    get width(): number;
    /**
     * An Array of Altered Pitches in KeySignature order (i.e., for flats, Bb, Eb, etc.)
     *
     * @readonly
     * @example
     * var ks = new music21.key.KeySignature(3)
     * var ap = ks.alteredPitches
     * var apName = [];
     * for (var i = 0; i < ap.length; i++) {
     *     apName.push(ap[i].name);
     * }
     * apName
     * // ["F#", "C#", "G#"]
     */
    get alteredPitches(): pitch.Pitch[];
    /**
     * Return the name of the major key with this many sharps
     *
     * @returns {(string|undefined)} name of key
     * @example
     * var ks = new music21.key.KeySignature(-3)
     * ks.majorName()
     * // "E-"
     */
    majorName(): string;
    /**
     * Return the name of the minor key with this many sharps
     * @returns {(string|undefined)}
     */
    minorName(): string;
    /**
     * returns the vexflow name (just the `majorName()` with "b" for "-") for
     * the key signature.  Does not create the object.
     *
     * Deprecated.
     *
     * @returns {string}
     */
    vexflow(): string;
    /**
     * Returns the accidental associated with a step in this key, or undefined if none.
     *
     * step - a valid step name such as "C","D", etc., but not "C#" etc.
     */
    accidentalByStep(step: string): pitch.Accidental | undefined;
    /**
     * Takes a pitch in C major and transposes it so that it has
     * the same step position in the current key signature.
     *
     * Does not support inPlace unlike music21p v6.
     *
     * @example
     * var ks = new music21.key.KeySignature(-3)
     * var p1 = new music21.pitch.Pitch('B')
     * var p2 = ks.transposePitchFromC(p1)
     * p2.name
     * // "D"
     * var p3 = new music21.pitch.Pitch('G-')
     * var p4 = ks.transposePitchFromC(p3)
     * p4.name
     * // "B--"
     */
    transposePitchFromC(p: pitch.Pitch): pitch.Pitch;
}
/**
 * Create a Key object. Like a KeySignature but with ideas about Tonic, Dominant, etc.
 *
 * TODO: allow keyName to be a music21.pitch.Pitch
 * TODO: Scale mixin.
 *
 * @param {string} keyName -- a pitch name representing the key (w/ "-" for flat)
 * @param {string} [mode] -- if not given then the CASE of the keyName will be used ("C" => "major", "c" => "minor")
 */
export declare class Key extends KeySignature {
    static get className(): string;
    tonic: pitch.Pitch;
    mode: string;
    _scale: scale.ConcreteScale;
    constructor(keyName?: string, mode?: any);
    stringInfo(): string;
    get tonicPitchNameWithCase(): string;
    /**
     * returns a music21.scale.MajorScale or music21.scale.MinorScale
     * or another similar scale
     * object from the pitch object.
     *
     * [scaleType=this.mode] - the type of scale, or the mode.
     */
    getScale(scaleType?: string): scale.ConcreteScale;
    get isConcrete(): boolean;
    getPitches(...args: any[]): pitch.Pitch[];
    pitchFromDegree(degree: any, ...args: any[]): pitch.Pitch;
    getScaleDegreeFromPitch(pitchTarget: any, ...args: any[]): number;
}
//# sourceMappingURL=key.d.ts.map