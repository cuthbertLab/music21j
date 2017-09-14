/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/key -- KeySignature and Key objects
 *
 * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
 *
 */
import { Music21Exception } from './exceptions21.js';

import { base } from './base.js';
import { debug } from './debug.js';
import { interval } from './interval.js';
import { pitch } from './pitch.js';
import { scale } from './scale.js';

/**
 * key and keysignature module. See {@link music21.key} namespace for details
 *
 * @exports music21/key
 */
/**
 * Key and KeySignature related objects and methods
 *
 * @namespace music21.key
 * @memberof music21
 * @requires music21/base
 * @requires music21/pitch
 * @requires music21/interval
 * @requires music21/scale
 */
export const key = {};

key.modeSharpsAlter = {
    'major': 0,
    'minor': -3,
    'dorian': -2,
    'phrygian': -4,
    'lydian': 1,
    'mixolydian': -1,
    'locrian': -5,
};

/**
 * @class KeySignature
 * @memberof music21.key
 * @description Represents a key signature
 * @param {Int} [sharps=0] -- the number of sharps (negative for flats)
 * @property {Int} [sharps=0] -- number of sharps (negative for flats)
 * @extends music21.base.Music21Object
 * @example
 * var ks = new music21.key.KeySignature(-3); //E-flat major or c minor
 * var s = new music21.stream.Stream();
 * s.keySignature = ks;
 * var n = new music21.note.Note('A-'); // A-flat
 * s.append(n);
 * s.appendNewCanvas();
 */
export class KeySignature extends base.Music21Object {
    constructor(sharps) {
        super();
        this.classes.push('KeySignature');
        this._sharps = sharps || 0; // if undefined
        this._alteredPitchesCache = undefined;

        // 12 flats/sharps enough for now...
        this.flatMapping = [
            'C', 'F', 'B-', 'E-', 'A-', 'D-', 'G-',
            'C-', 'F-', 'B--', 'E--', 'A--', 'D--'];
        this.sharpMapping = [
            'C', 'G', 'D', 'A', 'E', 'B', 'F#',
            'C#', 'G#', 'D#', 'A#', 'E#', 'B#'];
    }
    get sharps() {
        return this._sharps;
    }
    set sharps(s) {
        this._alteredPitchesCache = [];
        this._sharps = s;
    }
    /**
     * Gives the width in pixels necessary to represent the key signature.
     *
     * @memberof music21.key.KeySignature#
     * @var {number} width
     * @readonly
     */
    get width() {
        if (this.sharps === 0) {
            return 0;
        } else { // add 6 to add extra space after the KS...
            return 12 * Math.abs(this.sharps) + 6;
        }
    }
     /**
      * An Array of Altered Pitches in KeySignature order (i.e., for flats, Bb, Eb, etc.)
      *
      * @memberof music21.key.KeySignature#
      * @var {Array<music21.pitch.Pitch>} alteredPitches
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
    get alteredPitches() {
        if (this._alteredPitchesCache !== undefined) {
            return this._alteredPitchesCache;
        }
        let transStr = 'P5';
        let startPitch = 'B';
        if (this.sharps < 0) {
            transStr = 'P4';
            startPitch = 'F';
        }
        const transInterval = new interval.Interval(transStr);
        const post = [];
        let pKeep = new pitch.Pitch(startPitch);
        for (let i = 0; i < Math.abs(this.sharps); i++) {
            pKeep = transInterval.transposePitch(pKeep);
            pKeep.octave = 4;
            post.push(pKeep);
        }
        this._alteredPitchesCache = post;
        return post;
    }
     /**
      * Return the name of the major key with this many sharps
      *
      * @memberof music21.key.KeySignature
      * @returns {(string|undefined)} name of key
      * @example
      * var ks = new music21.key.KeySignature(-3)
      * ks.majorName()
      * // "E-"
      */
    majorName() {
        if (this.sharps >= 0) {
            return this.sharpMapping[this.sharps];
        } else {
            return this.flatMapping[Math.abs(this.sharps)];
        }
    }
     /**
      * Return the name of the minor key with this many sharps
      * @memberof music21.key.KeySignature
      * @returns {(string|undefined)}
      */
    minorName() {
        const tempSharps = this.sharps + 3;
        if (tempSharps >= 0) {
            return this.sharpMapping[tempSharps];
        } else {
            return this.flatMapping[Math.abs(tempSharps)];
        }
    }
     /**
      * returns the vexflow name (just the `majorName()` with "b" for "-") for
      * the key signature.  Does not create the object.
      *
      * Deprecated.
      *
      * @memberof music21.key.KeySignature
      * @returns {string}
      */
    vexflow() {
        console.log('calling deprecated function KeySignature.vexflow');
        const tempName = this.majorName();
        return tempName.replace(/-/g, 'b');
    }
     /**
      * Returns the accidental associated with a step in this key, or undefined if none.
      *
      * @memberof music21.key.KeySignature
      * @param {string} step - a valid step name such as "C","D", etc., but not "C#" etc.
      * @returns {(music21.pitch.Accidental|undefined)}
      */
    accidentalByStep(step) {
        const aps = this.alteredPitches;
        for (let i = 0; i < aps.length; i++) {
            if (aps[i].step === step) {
                if (aps[i].accidental === undefined) {
                    return undefined;
                }
                 // make a new accidental;
                return new pitch.Accidental(aps[i].accidental.alter);
            }
        }
        return undefined;
    }
     /**
      * Takes a pitch in C major and transposes it so that it has
      * the same step position in the current key signature.
      *
      * @memberof music21.key.KeySignature
      * @returns {music21.pitch.Pitch}
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
    transposePitchFromC(p) {
        let transInterval;
        let transTimes;
        if (this.sharps === 0) {
            return new pitch.Pitch(p.nameWithOctave);
        } else if (this.sharps < 0) {
            transTimes = Math.abs(this.sharps);
            transInterval = new interval.Interval('P4');
        } else {
            transTimes = this.sharps;
            transInterval = new interval.Interval('P5');
        }
        let newPitch = p;
        for (let i = 0; i < transTimes; i++) {
            newPitch = transInterval.transposePitch(newPitch);
            if ((i % 2) === 1) {
                newPitch.octave -= 1;
            }
        }
        return newPitch;
    }
}
key.KeySignature = KeySignature;


/**
 * Create a Key object. Like a KeySignature but with ideas about Tonic, Dominant, etc.
 *
 * TODO: allow keyName to be a {@link music21.pitch.Pitch}
 *
 * @class Key
 * @memberof music21.key
 * @extends music21.key.KeySignature
 * @param {string} keyName -- a pitch name representing the key (w/ "-" for flat)
 * @param {string} [mode] -- if not given then the CASE of the keyName will be used ("C" => "major", "c" => "minor")
 */
export class Key extends KeySignature {
    constructor(keyName, mode) {
        if (keyName === undefined) {
            keyName = 'C';
        }
        if (mode === undefined) {
            const lowerCase = keyName.toLowerCase();
            if (keyName === lowerCase) {
                mode = 'minor';
            } else {
                mode = 'major';
            }
        }

        const sharpsArray = 'A-- E-- B-- F- C- G- D- A- E- B- F C G D A E B F# C# G# D# A# E# B#'.split(' ');
        const sharpsIndex = sharpsArray.indexOf(keyName.toUpperCase());
        if (sharpsIndex === -1) {
            throw new Music21Exception('Cannot find the key for ' + keyName);
        }
        const modeShift = key.modeSharpsAlter[mode] || 0;
        const sharps = sharpsIndex + modeShift - 11;
        if (debug) {
            console.log('Found sharps ' + sharps + ' for key: ' + keyName);
        }
        super(sharps);
        this.tonic = keyName;
        this.mode = mode;
    }
    /**
     * returns a {@link music21.scale.ScaleSimpleMajor} or {@link music21.scale.ScaleSimpleMinor}
     * object from the pitch object.
     *
     * @memberof music21.key.Key
     * @param {string|undefined} [scaleType=this.mode] - the type of scale, or the mode.
     * @returns {object} A music21.scale.Scale subclass.
     */
    getScale(scaleType) {
        if (scaleType === undefined) {
            scaleType = this.mode;
        }
        const pitchObj = new pitch.Pitch(this.tonic);
        if (scaleType === 'major') {
            return scale.ScaleSimpleMajor(pitchObj);
        } else {
            return scale.ScaleSimpleMinor(pitchObj, scaleType);
        }
    }
}
key.Key = Key;
