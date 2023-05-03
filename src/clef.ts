/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/clef -- Clef objects
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * Clef related objects and properties
 *
 */
import * as base from './base';
import * as pitch from './pitch';
import { Stream } from './stream'; // for typing only

/*  music21.Clef
    must be defined before Stream since Stream subclasses call new music21.Clef...
 */

// TODO: Fix to newest Vexflow format...

type ClefName = 'treble'|'soprano'|'mezzo-soprano'|'alto'|'tenor'|'bass'|'percussion';

export const lowestLines: Record<ClefName, number> = {
    treble: 31,
    soprano: 29,
    'mezzo-soprano': 27,
    alto: 25,
    tenor: 23,
    bass: 19,
    percussion: 31,
};

export const nameToLine: Record<ClefName, number> = {
    treble: 2,
    soprano: 1,
    'mezzo-soprano': 2,
    alto: 3,
    tenor: 4,
    bass: 4,
    percussion: 3,
};

export const nameToSign: Record<ClefName, string> = {
    treble: 'G',
    soprano: 'C',
    'mezzo-soprano': 'C',
    alto: 'C',
    tenor: 'C',
    bass: 'F',
    percussion: 'percussion',
};

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
export class Clef extends base.Music21Object {
    static get className() { return 'music21.clef.Clef'; }

    name: string = undefined;
    sign: string = undefined;
    line: number = 1;
    octaveChange: number;
    lowestLine: number = lowestLines.treble;
    lowestLineTrebleOffset: number = 0;

    constructor(name?: ClefName, octaveChange: number = 0) {
        super();
        this.classSortOrder = 0;

        if (name !== undefined) {
            name = name.toLowerCase() as ClefName;
            this.name = name;
            this.lowestLine = lowestLines[name];
            this.sign = nameToSign[name];
            this.line = nameToLine[name] || 1;
            this.lowestLineTrebleOffset
                = lowestLines.treble - this.lowestLine;
        }

        this.octaveChange = octaveChange;
        this.lowestLine += 7 * octaveChange;
        this.lowestLineTrebleOffset -= 7 * octaveChange;
    }

    stringInfo() {
        return '';
    }

    /**
     * returns a new pitch object if the clef name is not Treble
     * designed so it would look the same as it would in treble clef.
     * for instance, bass-clef 2nd-space C# becomes treble clef 2nd-space A#
     * used for Vex.Flow which requires all pitches to be input as if they
     * are in treble clef.
     */
    convertPitchToTreble(p: pitch.Pitch): pitch.Pitch {
        if (this.lowestLine === undefined) {
            console.log('no first line defined for clef', this.name, this);
            return p; // error
        }
        const lowestLineDifference = this.lowestLineTrebleOffset;
        const tempPitch = new pitch.Pitch(p.step);
        tempPitch.octave = p.octave;
        tempPitch.diatonicNoteNum += lowestLineDifference;
        tempPitch.accidental = p.accidental;
        return tempPitch;
    }

    getStemDirectionForPitches(
        pitchList: pitch.Pitch|pitch.Pitch[],
        {
            firstLastOnly=true,
            extremePitchOnly=true,
        }: {
            firstLastOnly?: boolean,
            extremePitchOnly?: boolean,
        } = {},
    ): string {
        let pitchRealList: pitch.Pitch[];
        if (!(pitchList instanceof Array)) {
            pitchRealList = [pitchList as pitch.Pitch];
        } else {
            pitchRealList = pitchList as pitch.Pitch[];
        }

        if (!pitchRealList.length) {
            throw new Error('getStemDirectionForPitches cannot operate on an empty Array');
        }

        let relevantPitches: pitch.Pitch[];
        if (extremePitchOnly) {
            pitchRealList.sort((a, b) => a.diatonicNoteNum - b.diatonicNoteNum);
            const pitchMin = pitchRealList[0];
            const pitchMax = pitchRealList[pitchRealList.length - 1];
            relevantPitches = [pitchMin, pitchMax];
        } else if (firstLastOnly) {
            relevantPitches = [pitchRealList[0], pitchRealList[pitchRealList.length - 1]];
        } else {
            relevantPitches = pitchRealList;
        }

        let differenceSum = 0;
        const midLine = this.lowestLine + 4;
        for (const p of relevantPitches) {
            differenceSum += p.diatonicNoteNum - midLine;
        }

        if (differenceSum >= 0) {
            return 'down';
        } else {
            return 'up';
        }
    }
}

/**
 * A TrebleClef (same as new music21.clef.Clef('treble'))
 */
export class TrebleClef extends Clef {
    static get className() { return 'music21.clef.TrebleClef'; }

    constructor() {
        super('treble');
        this.sign = 'G';
        this.line = 2;
    }
}

/**
 * A TrebleClef down an octave (same as new music21.clef.Clef('treble', -1))
 *
 * Unlike music21p, currently not a subclass of TrebleClef.
 */
export class Treble8vbClef extends Clef {
    static get className() { return 'music21.clef.Treble8vbClef'; }

    constructor() {
        super('treble', -1);
    }
}

/**
 * A TrebleClef up an octave (same as new music21.clef.Clef('treble', 1))
 */
export class Treble8vaClef extends Clef {
    static get className() { return 'music21.clef.Treble8vaClef'; }

    constructor() {
        super('treble', 1);
    }
}

/**
 * A BassClef (same as new music21.clef.Clef('bass'))
 */
export class BassClef extends Clef {
    static get className() { return 'music21.clef.BassClef'; }

    constructor() {
        super('bass');
        this.sign = 'F';
        this.line = 4;
    }
}

/**
 * A BassClef down an octave (same as new music21.clef.Clef('bass', -1))
 */
export class Bass8vbClef extends Clef {
    static get className() { return 'music21.clef.Bass8vbClef'; }

    constructor() {
        super('bass', -1);
        this.sign = 'F';
        this.line = 4;
    }
}

/**
 * An AltoClef (same as new music21.clef.Clef('alto'))
 */
export class AltoClef extends Clef {
    static get className() { return 'music21.clef.AltoClef'; }

    constructor() {
        super('alto');
        this.sign = 'C';
        this.line = 3;
    }
}

/**
 * A Tenor Clef (same as new music21.clef.Clef('tenor'))
 */
export class TenorClef extends Clef {
    static get className() { return 'music21.clef.TenorClef'; }

    constructor() {
        super('tenor');
        this.sign = 'C';
        this.line = 4;
    }
}

/**
 * A Soprano Clef (same as new music21.clef.Clef('soprano'))
 */
export class SopranoClef extends Clef {
    static get className() { return 'music21.clef.SopranoClef'; }

    constructor() {
        super('soprano');
        this.sign = 'C';
        this.line = 1;
    }
}

/**
 * A Mezzo-Soprano Clef (same as new music21.clef.Clef('mezzo-soprano'))
 */
export class MezzoSopranoClef extends Clef {
    static get className() { return 'music21.clef.MezzoSopranoClef'; }

    constructor() {
        super('mezzo-soprano');
        this.sign = 'C';
        this.line = 2;
    }
}

/**
 * A Percussion Clef (same as new music21.clef.Clef('percussion'))
 *
 * First line is treated as if it's treble clef. Not available as "bestClef"
 */
export class PercussionClef extends Clef {
    static get className() { return 'music21.clef.PercussionClef'; }

    constructor() {
        super('percussion');
        this.sign = 'percussion';
        this.line = 3;
    }
}

export const all_clefs = {
    TrebleClef,
    Treble8vbClef,
    Treble8vaClef,
    BassClef,
    Bass8vbClef,
    AltoClef,
    TenorClef,
    SopranoClef,
    MezzoSopranoClef,
    PercussionClef,
};

/**
 * Looks at the pitches in a Stream and returns the best clef
 * of Treble and Bass
 *
 */
export function bestClef(st: Stream, { recurse=true }={}): Clef {
    // console.log('calling flatten on stream: ', st.elements.length, st.classes[st.classes.length - 1]);
    let stFlat;
    if (recurse) {
        stFlat = st.flatten();
    } else {
        stFlat = st;
    }
    let totalNotes = 0;
    let totalPitch = 0.0;
    for (let i = 0; i < stFlat.length; i++) {
        const el = stFlat.get(i);
        if (el.pitch !== undefined) {
            totalNotes += 1;
            totalPitch += el.pitch.diatonicNoteNum;
        } else if (el.pitches !== undefined) {
            for (let j = 0; j < el.pitches.length; j++) {
                totalNotes += 1;
                totalPitch += el.pitches[j].diatonicNoteNum;
            }
        }
    }
    let averageHeight;
    if (totalNotes === 0) {
        averageHeight = 29;
    } else {
        averageHeight = totalPitch / totalNotes;
    }
    // console.log('bestClef: average height', averageHeight);
    if (averageHeight > 28) {
        // 29 = c4
        return new TrebleClef();
    } else {
        return new BassClef();
    }
}

/**
 */
export function clefFromString(clefString: string, octaveShift: number = 0): Clef {
    const xnStr = clefString.trim();
    let thisType;
    let lineNum;
    if (xnStr.toLowerCase() === 'percussion') {
        return new PercussionClef();
    } // todo: tab, none, jianpu

    if (xnStr.length === 2) {
        thisType = xnStr[0].toUpperCase();
        lineNum = parseInt(xnStr[1]);
    } else if (xnStr.length === 1) {
        thisType = xnStr[0].toUpperCase();
        if (thisType === 'G') {
            lineNum = 2;
        } else if (thisType === 'F') {
            lineNum = 4;
        } else if (thisType === 'C') {
            lineNum = 3;
        } else {
            lineNum = 0;
        }
    } else if (xnStr.length > 2) {
        // try to get any clef in the module
        const searchLower = xnStr.toLowerCase();
        for (const clefKey of Object.keys(all_clefs)) {
            const clefLower = clefKey.toLowerCase();
            const potentialClass = all_clefs[clefKey];
            if (typeof potentialClass !== 'function') {
                continue;
            }
            if (clefLower !== searchLower && clefLower !== searchLower + 'clef') {
                continue;
            }
            return new potentialClass();
        }
    }

    const arrayEqual = (a, b) => a.length === b.length && a.every((el, ix) => el === b[ix]);

    const params = [thisType, lineNum, octaveShift];
    if (arrayEqual(params, ['G', 2, 0])) {
        return new TrebleClef();
    } else if (arrayEqual(params, ['G', 2, -1])) {
        return new Treble8vbClef();
    } else if (arrayEqual(params, ['G', 2, 1])) {
        return new Treble8vaClef();
    } else if (arrayEqual(params, ['F', 4, 0])) {
        return new BassClef();
    } else if (arrayEqual(params, ['F', 4, -1])) {
        return new Bass8vbClef();
    } else if (arrayEqual(params, ['C', 3, 0])) {
        return new AltoClef();
    } else if (arrayEqual(params, ['C', 4, 0])) {
        return new TenorClef();
    } else {
        return new Clef(xnStr as ClefName, octaveShift);
    }
}
