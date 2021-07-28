/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/clef -- Clef objects
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * Clef module, see {@link music21.clef} for namespace
 * Clef related objects and properties
 *
 * @exports music21/clef
 * @namespace music21.clef
 * @memberof music21
 * @requires music21/base
 * @requires music21/pitch
 */
import * as base from './base';
import * as pitch from './pitch';
import { Stream } from './stream';
/**
 *
 * @type {
 *     {bass: number, soprano: number, tenor: number, percussion: number,
 *     'mezzo-soprano': number, alto: number, treble: number}}
 */
export declare const lowestLines: {
    treble: number;
    soprano: number;
    'mezzo-soprano': number;
    alto: number;
    tenor: number;
    bass: number;
    percussion: number;
};
/**
 *
 * @type {
 *     {bass: number, soprano: number, tenor: number, percussion: number,
 *     'mezzo-soprano': number, alto: number, treble: number}}
 */
export declare const nameToLine: {
    treble: number;
    soprano: number;
    'mezzo-soprano': number;
    alto: number;
    tenor: number;
    bass: number;
    percussion: number;
};
/**
 *
 * @type {
 *     {bass: string, soprano: string, tenor: string, percussion: string,
 *     'mezzo-soprano': string, alto: string, treble: string}}
 */
export declare const nameToSign: {
    treble: string;
    soprano: string;
    'mezzo-soprano': string;
    alto: string;
    tenor: string;
    bass: string;
    percussion: string;
};
/**
 * Clef name can be one of
 * "treble", "bass", "soprano", "mezzo-soprano", "alto", "tenor", "percussion"
 *
 * @param {string} name - clef name
 * @param {number} [octaveChange=0] - ottava
 * @property {string} [name]
 * @property {number} lowestLine - diatonicNoteNum (C4 = 29) for the
 *     lowest line (in a five-line staff)
 * @property {number} lowestLineTrebleOffset - difference between the first line
 *     of this staff and the first line in treble clef
 * @property {number} octaveChange
 */
export declare class Clef extends base.Music21Object {
    static get className(): string;
    name: string;
    sign: string;
    line: number;
    octaveChange: number;
    lowestLine: number;
    lowestLineTrebleOffset: number;
    constructor(name?: string, octaveChange?: number);
    stringInfo(): string;
    /**
     * returns a new pitch object if the clef name is not Treble
     * designed so it would look the same as it would in treble clef.
     * for instance, bass-clef 2nd-space C# becomes treble clef 2nd-space A#
     * used for Vex.Flow which requires all pitches to be input as if they
     * are in treble clef.
     */
    convertPitchToTreble(p: pitch.Pitch): pitch.Pitch;
    getStemDirectionForPitches(pitchList: pitch.Pitch | pitch.Pitch[], { firstLastOnly, extremePitchOnly, }?: {
        firstLastOnly?: boolean;
        extremePitchOnly?: boolean;
    }): string;
}
/**
 * A TrebleClef (same as new music21.clef.Clef('treble'))
 *
 * @class TrebleClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export declare class TrebleClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A TrebleClef down an octave (same as new music21.clef.Clef('treble', -1))
 *
 * Unlike music21p, currently not a subclass of TrebleClef.
 *
 * @class Treble8vbClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export declare class Treble8vbClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A TrebleClef up an octave (same as new music21.clef.Clef('treble', 1))
 *
 * @class Treble8vaClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export declare class Treble8vaClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A BassClef (same as new music21.clef.Clef('bass'))
 *
 * @class BassClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export declare class BassClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A BassClef down an octave (same as new music21.clef.Clef('bass', -1))
 *
 * @class Bass8vbClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export declare class Bass8vbClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * An AltoClef (same as new music21.clef.Clef('alto'))
 *
 * @class AltoClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export declare class AltoClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A Tenor Clef (same as new music21.clef.Clef('tenor'))
 *
 * @class TenorClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export declare class TenorClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A Soprano Clef (same as new music21.clef.Clef('soprano'))
 *
 * @class SopranoClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export declare class SopranoClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A Mezzo-Soprano Clef (same as new music21.clef.Clef('mezzo-soprano'))
 *
 * @class MezzoSopranoClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export declare class MezzoSopranoClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A Percussion Clef (same as new music21.clef.Clef('percussion'))
 *
 * First line is treated as if it's treble clef. Not available as "bestClef"
 *
 * @class PercussionClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export declare class PercussionClef extends Clef {
    static get className(): string;
    constructor();
}
export declare const all_clefs: {
    TrebleClef: typeof TrebleClef;
    Treble8vbClef: typeof Treble8vbClef;
    Treble8vaClef: typeof Treble8vaClef;
    BassClef: typeof BassClef;
    Bass8vbClef: typeof Bass8vbClef;
    AltoClef: typeof AltoClef;
    TenorClef: typeof TenorClef;
    SopranoClef: typeof SopranoClef;
    MezzoSopranoClef: typeof MezzoSopranoClef;
    PercussionClef: typeof PercussionClef;
};
/**
 * Looks at the pitches in a Stream and returns the best clef
 * of Treble and Bass
 *
 */
export declare function bestClef(st: Stream, { recurse }?: {
    recurse?: boolean;
}): Clef;
/**
 *
 * @param {string} clefString
 * @param {number} [octaveShift=0]
 * @returns {music21.clef.Clef}
 */
export declare function clefFromString(clefString: any, octaveShift?: number): any;
//# sourceMappingURL=clef.d.ts.map