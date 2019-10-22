/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/key -- KeySignature and Key objects
 *
 * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
 *
 * key and key signature module. See {@link music21.key} namespace for details
 * Key and KeySignature related objects and methods
 *
 * @exports music21/key
 *
 * @namespace music21.key
 * @memberof music21
 * @requires music21/base
 * @requires music21/pitch
 * @requires music21/interval
 * @requires music21/scale
 */
import { Music21Exception } from './exceptions21.js';
import { debug } from './debug.js';

import * as base from './base.js';
import * as interval from './interval.js';
import * as pitch from './pitch.js';
import * as scale from './scale.js';

export const modeSharpsAlter = {
    major: 0,
    minor: -3,
    dorian: -2,
    phrygian: -4,
    lydian: 1,
    mixolydian: -1,
    locrian: -5,
};

/**
 *
 * @param {string} textString
 * @returns {string}
 */
export function convertKeyStringToMusic21KeyString(textString) {
    if (textString === 'bb') {
        textString = 'b-';
    } else if (textString === 'Bb') {
        textString = 'B-';
    } else if (textString.endsWith('b') && !textString.startsWith('b')) {
        textString = textString.replace(/b$/, '-');
    }
    return textString;
}

/**
 * @class KeySignature
 * @memberof music21.key
 * @description Represents a key signature
 * @param {int} [sharps=0] -- the number of sharps (negative for flats)
 * @property {int} [sharps=0] -- number of sharps (negative for flats)
 * @property {string[]} flatMapping -- flat signatures 0-12 flats
 * @property {string[]} sharpMapping -- sharp signatures 0-12 sharps
 * @extends music21.base.Music21Object
 * @example
 * var ks = new music21.key.KeySignature(-3); //E-flat major or c minor
 * var s = new music21.stream.Stream();
 * s.keySignature = ks;
 * var n = new music21.note.Note('A-'); // A-flat
 * s.append(n);
 * s.appendNewDOM();
 */
export class KeySignature extends base.Music21Object {
    static get className() { return 'music21.key.KeySignature'; }

    constructor(sharps) {
        super();
        this.classSortOrder = 2;

        this._sharps = sharps || 0; // if undefined

        /**
         * @type {music21.pitch.Pitch[]}
         */
        this._alteredPitchesCache = undefined;

        // 12 flats/sharps enough for now...
        this.flatMapping = [
            'C',
            'F',
            'B-',
            'E-',
            'A-',
            'D-',
            'G-',
            'C-',
            'F-',
            'B--',
            'E--',
            'A--',
            'D--',
        ];
        this.sharpMapping = [
            'C',
            'G',
            'D',
            'A',
            'E',
            'B',
            'F#',
            'C#',
            'G#',
            'D#',
            'A#',
            'E#',
            'B#',
        ];
    }

    /**
     * @return string
     */
    stringInfo() {
        if (this.sharps === 0) {
            return 'of no sharps or flats';
        } else if (this.sharps === -1) {
            return 'of 1 flat';
        } else if (this.sharps === 1) {
            return 'of 1 sharp';
        } else if (this.sharps < 0) {
            return `of ${Math.abs(this.sharps)} flats`;
        } else {
            return `of ${this.sharps} sharps`;
        }
    }

    /**
     * @type {int}
     */
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
     * @type {number}
     * @readonly
     */
    get width() {
        if (this.sharps === 0) {
            return 0;
        } else {
            // add 6 to add extra space after the KS...
            return 12 * Math.abs(this.sharps) + 6;
        }
    }

    /**
     * An Array of Altered Pitches in KeySignature order (i.e., for flats, Bb, Eb, etc.)
     *
     * @type {music21.pitch.Pitch[]}
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
     * Does not support inPlace unlike music21p v6.
     *
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
        const originalOctave = p.octave;
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
            /**
             *
             * @type {music21.pitch.Pitch}
             */
            newPitch = transInterval.transposePitch(newPitch);
        }
        newPitch.octave = originalOctave;
        return newPitch;
    }
}

/**
 * Create a Key object. Like a KeySignature but with ideas about Tonic, Dominant, etc.
 *
 * TODO: allow keyName to be a {@link music21.pitch.Pitch}
 * TODO: Scale mixin.
 *
 * @class Key
 * @memberof music21.key
 * @extends music21.key.KeySignature
 * @param {string} keyName -- a pitch name representing the key (w/ "-" for flat)
 * @param {string} [mode] -- if not given then the CASE of the keyName will be used ("C" => "major", "c" => "minor")
 */
export class Key extends KeySignature {
    static get className() { return 'music21.key.Key'; }

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

        const sharpsArray = 'A-- E-- B-- F- C- G- D- A- E- B- F C G D A E B F# C# G# D# A# E# B#'.split(
            ' '
        );
        const sharpsIndex = sharpsArray.indexOf(keyName.toUpperCase());
        if (sharpsIndex === -1) {
            throw new Music21Exception('Cannot find the key for ' + keyName);
        }
        const modeShift = modeSharpsAlter[mode] || 0;
        const sharps = sharpsIndex + modeShift - 11;
        if (debug) {
            console.log('Found sharps ' + sharps + ' for key: ' + keyName);
        }
        super(sharps);

        this.tonic = new pitch.Pitch(keyName);
        this.mode = mode;
        this._scale = this.getScale();
    }

    stringInfo() {
        return this.tonicPitchNameWithCase + ' ' + this.mode;
    }

    get tonicPitchNameWithCase() {
        let tonicName = this.tonic.name;
        if (this.mode === 'major') {
            tonicName = tonicName.toUpperCase();
        } else if (this.mode === 'minor') {
            tonicName = tonicName.toLowerCase();
        }
        return tonicName;
    }

    /**
     * returns a {@link music21.scale.MajorScale} or {@link music21.scale.MinorScale}
     * object from the pitch object.
     *
     * @param {string|undefined} [scaleType=this.mode] - the type of scale, or the mode.
     * @returns {Object} A music21.scale.Scale subclass.
     */
    getScale(scaleType) {
        if (scaleType === undefined) {
            scaleType = this.mode;
        }
        const pitchObj = this.tonic;
        if (scaleType === 'major') {
            return new scale.MajorScale(pitchObj);
        } else if (scaleType === 'minor') {
            return new scale.MinorScale(pitchObj);
        } else if (['harmonic minor', 'harmonic-minor'].includes(scaleType)) {
            return new scale.HarmonicMinorScale(pitchObj);
        } else if (['melodic minor', 'melodic-minor'].includes(scaleType)) {
            return new scale.AscendingMelodicMinorScale(pitchObj);
        } else {
            return new scale.ConcreteScale(pitchObj);
        }
    }

    // when scale.js adds functionality, it must be added here.
    get isConcrete() {
        return this._scale.isConcrete;
    }

    getPitches(...args) {
        return this._scale.getPitches(...args);
    }

    pitchFromDegree(...args) {
        return this._scale.pitchFromDegree(...args);
    }

    getScaleDegreeFromPitch(...args) {
        return this._scale.getScaleDegreeFromPitch(...args);
    }
}

