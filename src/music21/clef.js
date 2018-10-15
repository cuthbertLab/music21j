/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/clef -- Clef objects
 *
 * note: only defines a single Clef object for now
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 *
 */
import { base } from './base.js';
import { pitch } from './pitch.js';

/**
 * Clef module, see {@link music21.clef} for namespace
 *
 * @exports music21/clef
 */
/**
 * Clef related objects and properties
 *
 * @namespace music21.clef
 * @memberof music21
 * @requires music21/base
 * @requires music21/pitch
 */
export const clef = {};
/*  music21.Clef
	must be defined before Stream since Stream subclasses call new music21.Clef...
 */
// TODO: Fix to newest Vexflow format...
clef.lowestLines = {
    treble: 31,
    soprano: 29,
    'mezzo-soprano': 27,
    alto: 25,
    tenor: 23,
    bass: 19,
    percussion: 31,
};

clef.nameToLine = {
    treble: 2,
    soprano: 1,
    'mezzo-soprano': 2,
    alto: 3,
    tenor: 4,
    bass: 4,
    percussion: 3,
};

clef.nameToSign = {
    treble: 'G',
    soprano: 'C',
    'mezzo-soprano': 'C',
    alto: 'C',
    tenor: 'C',
    bass: 'F',
    percussion: 'percussion',
};

/**
 * Clefname can be one of
 * "treble", "bass", "soprano", "mezzo-soprano", "alto", "tenor", "percussion"
 *
 * @class Clef
 * @memberof music21.clef
 * @extends music21.base.Music21Object
 * @param {string} name - clef name
 * @param {Int} [octaveChange=0] - ottava
 * @property {string|undefined} name
 * @property {Int} lowestLine - diatonicNoteNum (C4 = 29) for the lowest line (in a five-line staff)
 * @property {Int} lowestLineTrebleOffset - difference between the first line of this staff and the first line in treble clef
 * @property {Int} octaveChange
 */
export class Clef extends base.Music21Object {
    constructor(name, octaveChange) {
        super();
        this.classSortOrder = 0;

        this.sign = undefined;
        this.line = 1;
        if (name !== undefined) {
            name = name.toLowerCase();
            this.name = name;
            this.lowestLine = clef.lowestLines[name];
            this.sign = clef.nameToSign[name];
            this.line = clef.nameToLine[name] || 1;
            this.lowestLineTrebleOffset
                = clef.lowestLines.treble - this.lowestLine;
        } else {
            this.name = undefined;
            this.lowestLine = clef.lowestLines.treble;
            this.lowestLineTrebleOffset = 0;
        }
        if (octaveChange === undefined) {
            this.octaveChange = 0;
        } else {
            this.octaveChange = octaveChange;
            this.lowestLine += 7 * octaveChange;
            this.lowestLineTrebleOffset -= 7 * octaveChange;
        }
    }
    /**
     * returns a new pitch object if the clef name is not Treble
     * designed so it would look the same as it would in treble clef.
     * for instance, bass-clef 2nd-space C# becomes treble clef 2nd-space A#
     * used for Vex.Flow which requires all pitches to be input as if they
     * are in treble clef.
     *
     * @memberof music21.clef.Clef
     * @param {music21.pitch.Pitch} p
     * @returns {music21.pitch.Pitch} new pitch
     */
    convertPitchToTreble(p) {
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
}

clef.Clef = Clef;

/**
 * A TrebleClef (same as new music21.clef.Clef('treble')
 *
 * @class TrebleClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export class TrebleClef extends Clef {
    constructor() {
        super('treble');
        this.sign = 'G';
        this.line = 2;
    }
}
clef.TrebleClef = TrebleClef;
/**
 * A TrebleClef down an octave (same as new music21.clef.Clef('treble', -1)
 *
 * Unlike music21p, currently not a subclass of TrebleClef.
 *
 * @class Treble8vbClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export class Treble8vbClef extends Clef {
    constructor() {
        super('treble', -1);
    }
}
clef.Treble8vbClef = Treble8vbClef;

/**
 * A TrebleClef up an octave (same as new music21.clef.Clef('treble', 1)
 *
 * @class Treble8vaClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export class Treble8vaClef extends Clef {
    constructor() {
        super('treble', 1);
    }
}
clef.Treble8vaClef = Treble8vaClef;

/**
 * A BassClef (same as new music21.clef.Clef('bass')
 *
 * @class BassClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export class BassClef extends Clef {
    constructor() {
        super('bass');
        this.sign = 'F';
        this.line = 4;
    }
}
clef.BassClef = BassClef;


/**
 * An AltoClef (same as new music21.clef.Clef('alto')
 *
 * @class AltoClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export class AltoClef extends Clef {
    constructor() {
        super('alto');
        this.sign = 'C';
        this.line = 3;
    }
}
clef.AltoClef = AltoClef;

/**
 * A Tenor Clef (same as new music21.clef.Clef('tenor')
 *
 * @class TenorClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export class TenorClef extends Clef {
    constructor() {
        super('tenor');
        this.sign = 'C';
        this.line = 4;
    }
}
clef.TenorClef = TenorClef;
/**
 * A Soprano Clef (same as new music21.clef.Clef('soprano')
 *
 * @class SopranoClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export class SopranoClef extends Clef {
    constructor() {
        super('soprano');
        this.sign = 'C';
        this.line = 1;
    }
}
clef.SopranoClef = SopranoClef;

/**
 * A Mezzo-Soprano Clef (same as new music21.clef.Clef('mezzo-soprano')
 *
 * @class MezzoSopranoClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export class MezzoSopranoClef extends Clef {
    constructor() {
        super('mezzo-soprano');
        this.sign = 'C';
        this.line = 2;
    }
}
clef.MezzoSopranoClef = MezzoSopranoClef;

/**
 * A Percussion Clef (same as new music21.clef.Clef('percussion')
 *
 * First line is treated as if it's treble clef. Not available as "bestClef"
 *
 * @class PercussionClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
export class PercussionClef extends Clef {
    constructor() {
        super('percussion');
        this.sign = 'percussion';
        this.line = 3;
    }
}
clef.PercussionClef = PercussionClef;

/**
 * Looks at the pitches in a Stream and returns the best clef
 * of Treble and Bass
 *
 * @function music21.clef.bestClef
 * @memberof music21.clef
 * @param {music21.stream.Stream} st
 * @returns {music21.clef.Clef}
 */
clef.bestClef = function bestClef(st, { recurse=true }={}) {
    // console.log('calling flat on stream: ', st.elements.length, st.classes[st.classes.length - 1]);
    const stFlat = st.flat;
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
        return new clef.TrebleClef();
    } else {
        return new clef.BassClef();
    }
};

clef.clefFromString = function clefFromString(clefString, octaveShift) {
    if (octaveShift === undefined) {
        octaveShift = 0;
    }
    const xnStr = clefString.trim();
    let thisType;
    let lineNum;
    if (xnStr.toLowerCase() === 'percussion') {
        return new clef.PercussionClef(clefString, octaveShift);
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
    }

    const arrayEqual = (a, b) =>
        a.length === b.length && a.every((el, ix) => el === b[ix]);

    const params = [thisType, lineNum, octaveShift];
    if (arrayEqual(params, ['G', 2, 0])) {
        return new clef.TrebleClef();
    } else if (arrayEqual(params, ['G', 2, -1])) {
        return new clef.Treble8vbClef();
    } else if (arrayEqual(params, ['G', 2, 1])) {
        return new clef.Treble8vaClef();
    } else if (arrayEqual(params, ['F', 4, 0])) {
        return new clef.BassClef();
    } else if (arrayEqual(params, ['F', 4, -1])) {
        return new clef.Bass8vbClef();
    } else if (arrayEqual(params, ['C', 3, 0])) {
        return new clef.AltoClef();
    } else if (arrayEqual(params, ['C', 4, 0])) {
        return new clef.TenorClef();
    } else {
        return new clef.Clef(xnStr, octaveShift);
    }
};
