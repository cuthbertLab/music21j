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
import { base } from './base';
import { pitch } from './pitch';

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
export	const clef = {};
/*  music21.Clef
	must be defined before Stream since Stream subclasses call new music21.Clef...
 */
// TODO: Fix to newest Vexflow format...
clef.lowestLines = {
        'treble': 31,
        'soprano': 29,
        'mezzo-soprano': 27,
        'alto': 25,
        'tenor': 23,
        'bass': 19,
        'percussion': 31,
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
clef.Clef = function(name, octaveChange) {
    base.Music21Object.call(this);
    this.classes.push('Clef');
    if (name != undefined) {
        name = name.toLowerCase();
        this.name = name;
        this.lowestLine = clef.lowestLines[name];
        this.lowestLineTrebleOffset = clef.lowestLines['treble'] - this.lowestLine;
    } else {
        this.name = undefined;
        this.lowestLine = clef.lowestLines['treble'];
        this.lowestLineTrebleOffset = 0;
    }
    if (octaveChange === undefined) {
        this.octaveChange = 0;
    } else {
        this.octaveChange = octaveChange;
        this.lowestLine = this.lowestLine + (7 * octaveChange);
        this.lowestLineTrebleOffset = this.lowestLineTrebleOffset - (7 * octaveChange);
    }
};

clef.Clef.prototype = new base.Music21Object();
clef.Clef.prototype.constructor = clef.Clef;

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
clef.Clef.prototype.convertPitchToTreble = function(p) {
    if (this.lowestLine == undefined) {
        console.log('no first line defined for clef', this.name, this);
        return p; // error
    }
    const lowestLineDifference = this.lowestLineTrebleOffset;
    const tempPitch = new pitch.Pitch(p.step);
    tempPitch.octave = p.octave;
    tempPitch.diatonicNoteNum += lowestLineDifference;
    tempPitch.accidental = p.accidental;
    return tempPitch;
};

/**
 * A TrebleClef (same as new music21.clef.Clef('treble')
 *
 * @class TrebleClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
clef.TrebleClef = function() {
    clef.Clef.call(this, 'treble');
    this.classes.push('TrebleClef');
};
clef.TrebleClef.prototype = new clef.Clef();
clef.TrebleClef.prototype.constructor = clef.TrebleClef;

/**
 * A TrebleClef down an octave (same as new music21.clef.Clef('treble', -1)
 *
 * @class Treble8vbClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
clef.Treble8vbClef = function() {
    clef.Clef.call(this, 'treble', -1);
    this.classes.push('Treble8vbClef');
};
clef.Treble8vbClef.prototype = new clef.Clef();
clef.Treble8vbClef.prototype.constructor = clef.Treble8vbClef;

/**
 * A TrebleClef up an octave (same as new music21.clef.Clef('treble', 1)
 *
 * @class Treble8vaClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
clef.Treble8vaClef = function() {
    // Fixed in cuthbert Vex.Flow -- pull #235
    clef.Clef.call(this, 'treble', 1);
    this.classes.push('Treble8vaClef');
};
clef.Treble8vaClef.prototype = new clef.Clef();
clef.Treble8vaClef.prototype.constructor = clef.Treble8vaClef;

/**
 * A BassClef (same as new music21.clef.Clef('bass')
 *
 * @class BassClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
clef.BassClef = function() {
    clef.Clef.call(this, 'bass');
    this.classes.push('BassClef');
};
clef.BassClef.prototype = new clef.Clef();
clef.BassClef.prototype.constructor = clef.BassClef;

/**
 * An AltoClef (same as new music21.clef.Clef('alto')
 *
 * @class AltoClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
clef.AltoClef = function() {
    clef.Clef.call(this, 'alto');
    this.classes.push('AltoClef');
};
clef.AltoClef.prototype = new clef.Clef();
clef.AltoClef.prototype.constructor = clef.AltoClef;

/**
 * A Tenor Clef (same as new music21.clef.Clef('tenor')
 *
 * @class TenorClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
clef.TenorClef = function() {
    clef.Clef.call(this, 'tenor');
    this.classes.push('TenorClef');
};
clef.TenorClef.prototype = new clef.Clef();
clef.TenorClef.prototype.constructor = clef.TenorClef;

/**
 * A Soprano Clef (same as new music21.clef.Clef('soprano')
 *
 * @class SopranoClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
clef.SopranoClef = function() {
    clef.Clef.call(this, 'soprano');
    this.classes.push('SopranoClef');
};
clef.SopranoClef.prototype = new clef.Clef();
clef.SopranoClef.prototype.constructor = clef.SopranoClef;

/**
 * A Mezzo-Soprano Clef (same as new music21.clef.Clef('mezzo-soprano')
 *
 * @class MezzoSopranoClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
clef.MezzoSopranoClef = function() {
    clef.Clef.call(this, 'mezzo-soprano');
    this.classes.push('MezzoSopranoClef');
};
clef.MezzoSopranoClef.prototype = new clef.Clef();
clef.MezzoSopranoClef.prototype.constructor = clef.MezzoSopranoClef;

/**
 * A Percussion Clef (same as new music21.clef.Clef('percussion')
 *
 * First line is treated as if it's treble clef. Not available as "bestClef"
 *
 * @class PercussionClef
 * @memberof music21.clef
 * @extends music21.clef.Clef
 */
clef.PercussionClef = function() {
    clef.Clef.call(this, 'percussion');
    this.classes.push('PercussionClef');
};
clef.PercussionClef.prototype = new clef.Clef();
clef.PercussionClef.prototype.constructor = clef.PercussionClef;

/**
 * Looks at the pitches in a Stream and returns the best clef
 * of Treble and Bass
 *
 * @function music21.clef.bestClef
 * @memberof music21.clef
 * @param {music21.stream.Stream} st
 * @returns {music21.clef.Clef}
 */
clef.bestClef = function(st) {
    // console.log('calling flat on stream: ', st.elements.length, st.classes[st.classes.length - 1]);
    const stFlat = st.flat;
    let totalNotes = 0;
    let totalPitch = 0.0;
    for (let i = 0; i < stFlat.length; i++) {
        const el = stFlat.get(i);
        if (el.pitch != undefined) {
            totalNotes += 1;
            totalPitch += el.pitch.diatonicNoteNum;
        } else if (el.pitches != undefined) {
            for (let j = 0; j < el.pitches.length; j++) {
                totalNotes += 1;
                totalPitch += el.pitches[j].diatonicNoteNum;
            }
        }
    }
    let averageHeight;
    if (totalNotes == 0) {
        averageHeight = 29;
    } else {
        averageHeight = totalPitch / totalNotes;
    }
    // console.log('bestClef: average height', averageHeight);
    if (averageHeight > 28) {    // 29 = c4
        return new clef.TrebleClef();
    } else {
        return new clef.BassClef();
    }
};

// tests
clef.tests = function() {
    test('music21.clef.Clef', function() {
        const c1 = new music21.clef.Clef();
        equal(c1.isClassOrSubclass('Clef'), true, 'clef is a Clef');

        const ac = new music21.clef.AltoClef();
        equal(ac.lowestLine, 25, 'first line set');
        const n = new music21.note.Note('C#4');
        n.setStemDirectionFromClef(ac);
        equal(n.stemDirection, 'down', 'stem direction set');
        n.pitch.diatonicNoteNum -= 1;
        n.setStemDirectionFromClef(ac);
        equal(n.stemDirection, 'up', 'stem direction set');
        n.pitch.diatonicNoteNum += 1;
        const p2 = ac.convertPitchToTreble(n.pitch);
        equal(p2.nameWithOctave, 'B#4', 'converted to treble');
    });
    test('music21.clef.Clef 8va', function() {
        const ac = new music21.clef.Treble8vaClef();
        equal(ac.lowestLine, 38, 'first line set');
        const n = new music21.note.Note('C#5');
        n.setStemDirectionFromClef(ac);
        equal(n.stemDirection, 'up', 'stem direction set');
        const p2 = ac.convertPitchToTreble(n.pitch);
        equal(p2.nameWithOctave, 'C#4', 'converted to treble');
        const s = new music21.stream.Stream();
        s.clef = ac;
        s.append(n);
        s.appendNewCanvas($('body'));
    });
};

