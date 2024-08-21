/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/clef -- Clef objects
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 * Clef related objects and properties
 *
 */
import * as base from './base';
import * as pitch from './pitch';
import type { Stream } from './stream';
type ClefName = 'treble' | 'soprano' | 'mezzo-soprano' | 'alto' | 'tenor' | 'bass' | 'percussion';
export declare const lowestLines: Record<ClefName, number>;
export declare const nameToLine: Record<ClefName, number>;
export declare const nameToSign: Record<ClefName, string>;
/**
 * Clef name can be one of
 * "treble", "bass", "soprano", "mezzo-soprano", "alto", "tenor", "percussion"
 *
 * lowestLine - diatonicNoteNum (C4 = 29) for the
 *     lowest line (in a five-line staff)
 * lowestLineTrebleOffset - difference between the first line
 *     of this staff and the first line in treble clef
 * octaveChange
 */
export declare class Clef extends base.Music21Object {
    static get className(): string;
    name: string;
    sign: string;
    line: number;
    octaveChange: number;
    lowestLine: number;
    lowestLineTrebleOffset: number;
    constructor(name?: ClefName, octaveChange?: number);
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
 */
export declare class TrebleClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A TrebleClef down an octave (same as new music21.clef.Clef('treble', -1))
 *
 * Unlike music21p, currently not a subclass of TrebleClef.
 */
export declare class Treble8vbClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A TrebleClef up an octave (same as new music21.clef.Clef('treble', 1))
 */
export declare class Treble8vaClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A BassClef (same as new music21.clef.Clef('bass'))
 */
export declare class BassClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A BassClef down an octave (same as new music21.clef.Clef('bass', -1))
 */
export declare class Bass8vbClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * An AltoClef (same as new music21.clef.Clef('alto'))
 */
export declare class AltoClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A Tenor Clef (same as new music21.clef.Clef('tenor'))
 */
export declare class TenorClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A Soprano Clef (same as new music21.clef.Clef('soprano'))
 */
export declare class SopranoClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A Mezzo-Soprano Clef (same as new music21.clef.Clef('mezzo-soprano'))
 */
export declare class MezzoSopranoClef extends Clef {
    static get className(): string;
    constructor();
}
/**
 * A Percussion Clef (same as new music21.clef.Clef('percussion'))
 *
 * First line is treated as if it's treble clef. Not available as "bestClef"
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
 */
export declare function clefFromString(clefString: string, octaveShift?: number): Clef;
export {};
//# sourceMappingURL=clef.d.ts.map