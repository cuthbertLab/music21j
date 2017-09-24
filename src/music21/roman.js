/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/roman -- roman.RomanNumberal -- Chord subclass
 *
 * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
 *
 */
import { Music21Exception } from './exceptions21.js';

import { chord } from './chord.js';
import { debug } from './debug.js';
import { key } from './key.js';
import { pitch } from './pitch.js';
import { interval } from './interval.js';

/**
 * Roman numeral module. See {@link music21.roman} namespace
 *
 * @exports music21/roman
 */
/**
 * music21.roman -- namespace for dealing with RomanNumeral analysis.
 *
 * @namespace music21.roman
 * @memberof music21
 * @requires music21/chord
 * @requires music21/key
 * @requires music21/pitch
 * @requires music21/interval
 */
export const roman = {};

roman.figureShorthands = {
    '53': '',
    '3': '',
    '63': '6',
    '753': '7',
    '75': '7', // controversial perhaps
    '73': '7', // controversial perhaps
    '9753': '9',
    '975': '9', // controversial perhaps
    '953': '9', // controversial perhaps
    '97': '9', // controversial perhaps
    '95': '9', // controversial perhaps
    '93': '9', // controversial perhaps
    '653': '65',
    '6b53': '6b5',
    '643': '43',
    '642': '42',
    bb7b5b3: 'o7',
    bb7b53: 'o7',
    // '6b5bb3': 'o65',
    b7b5b3: '/o7',
};

roman.functionalityScores = {
    I: 100,
    i: 90,
    V7: 80,
    V: 70,
    V65: 68,
    I6: 65,
    V6: 63,
    V43: 61,
    I64: 60,
    IV: 59,
    i6: 58,
    viio7: 57,
    V42: 55,
    viio65: 53,
    viio6: 52,
    '#viio65': 51,
    ii: 50,
    '#viio6': 49,
    ii65: 48,
    ii43: 47,
    ii42: 46,
    IV6: 45,
    ii6: 43,
    VI: 42,
    '#VI': 41,
    vi: 40,
    viio: 39,
    '#viio': 39,
    iio: 37, // common in Minor
    iio42: 36,
    bII6: 35, // Neapolitan
    iio43: 32,
    iio65: 31,
    '#vio': 28,
    '#vio6': 28,
    III: 22,
    v: 20,
    VII: 19,
    VII7: 18,
    IV65: 17,
    IV7: 16,
    iii: 15,
    iii6: 12,
    vi6: 10,
};

/**
 * expandShortHand - expand a string of numbers into an array
 *
 * N.B. this is NOT where abbreviations get expanded
 *
 * @memberof music21.roman
 * @param  {string} shorthand string of a figure w/o roman to parse
 * @return {Array[string]}           array of shorthands
 */

roman.expandShortHand = function expandShortHand(shorthand) {
    shorthand = shorthand.replace('/', '');
    if (shorthand.match(/[b-]$/)) {
        shorthand += '3';
    }
    shorthand = shorthand.replace('11', 'x');
    shorthand = shorthand.replace('13', 'y');
    shorthand = shorthand.replace('15', 'z');
    const rx = new RegExp('#*-*b*o*[1-9xyz]', 'g');
    let shorthandGroups = [];
    let match = rx.exec(shorthand);
    while (match !== null) {
        shorthandGroups.push(match[0]);
        match = rx.exec(shorthand);
    }
    if (shorthandGroups.length === 1 && shorthandGroups[0].endsWith('3')) {
        shorthandGroups = ['5', shorthandGroups[0]];
    }
    const shGroupOut = [];
    for (let sh of shorthandGroups) {
        sh = sh.replace('x', '11');
        sh = sh.replace('y', '13');
        sh = sh.replace('z', '15');
        shGroupOut.push(sh);
    }
    return shGroupOut;
};

/**
 * correctSuffixForChordQuality - Correct a given inversionString suffix given a
 *     chord of various qualities.
 *
 * @memberof music21.roman
 * @param  {music21.chord.Chord} chordObj
 * @param  {string} inversionString a string like '6' to fix.
 * @return {string}           corrected inversionString
  */

roman.correctSuffixForChordQuality = function correctSuffixForChordQuality(
    chordObj,
    inversionString
) {
    const fifthType = chordObj.semitonesFromChordStep(5);
    let qualityName = '';
    if (fifthType === 6) {
        qualityName = 'o';
    } else if (fifthType === 8) {
        qualityName = '+';
    }

    if (
        inversionString !== undefined
        && (inversionString.startsWith('o') || inversionString.startsWith('/o'))
    ) {
        if (qualityName === 'o') {
            // don't call viio7, viioo7.
            qualityName = '';
        }
    }

    const seventhType = chordObj.semitonesFromChordStep(7);
    if (seventhType !== undefined && fifthType === 6) {
        // there is a seventh and this is a diminished 5
        if (seventhType === 10 && qualityName === 'o') {
            qualityName = '/o';
        } else if (seventhType !== 9) {
            // do something for very odd chords built on diminished triad.
        }
    }
    return qualityName + inversionString;
};

/**
 * maps an index number to a roman numeral in lowercase
 *
 * @memberof music21.roman
 * @example
 * music21.roman.romanToNumber[4]
 * // 'iv'
 */
roman.romanToNumber = [undefined, 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

/**
 * Represents a RomanNumeral.  By default, capital Roman Numerals are
 * major chords; lowercase are minor.
 *
 * see music21p's roman module for better instructions.
 *
 * current limitations:
 *
 * no inversions
 * no numeric figures except 7
 * no d7 = dominant 7
 * no frontAlterationAccidentals
 * no secondary dominants
 * no Aug6th chords
 *
 * @class RomanNumeral
 * @memberof music21.roman
 * @extends music21.chord.Chord
 * @param {string} figure - the roman numeral as a string, e.g., 'IV', 'viio', 'V7'
 * @param {string|music21.key.Key} [keyStr='C']
 * @property {Array<music21.pitch.Pitch>} scale - (readonly) returns the scale associated with the roman numeral
 * @property {music21.key.Key} key - the key associated with the RomanNumeral (not allowed to be undefined yet)
 * @property {string} figure - the figure as passed in
 * @property {string} degreeName - the name associated with the scale degree, such as "mediant" etc., scale 7 will be "leading tone" or "subtonic" appropriately
 * @property {Int} scaleDegree
 * @property {string} impliedQuality - "major", "minor", "diminished", "augmented"
 * @property {Array<music21.pitch.Pitch>} pitches - RomanNumerals are Chord objects, so .pitches will work for them also.
 */
export class RomanNumeral extends chord.Chord {
    constructor(figure, keyStr) {
        super();
        this.classes.push('RomanNumeral');
        this.figure = figure;
        this._scale = undefined;
        this._key = undefined;
        this.key = keyStr;
        let currentFigure = figure;

        let impliedQuality = 'major';
        const lowercase = currentFigure.toLowerCase();
        if (currentFigure.match('/o')) {
            impliedQuality = 'half-diminished';
            currentFigure = currentFigure.replace('/o', '');
        } else if (currentFigure.match('o')) {
            impliedQuality = 'diminished';
            currentFigure = currentFigure.replace('o', '');
        } else if (currentFigure === lowercase) {
            impliedQuality = 'minor';
        }

        const numbersArr = currentFigure.match(/\d+/);
        this.numbers = undefined;
        if (numbersArr != null) {
            currentFigure = currentFigure.replace(/\d+/, '');
            this.numbers = parseInt(numbersArr[0]);
        }

        const scaleDegree = roman.romanToNumber.indexOf(
            currentFigure.toLowerCase()
        );
        if (scaleDegree === -1) {
            throw new Music21Exception(
                'Cannot make a romanNumeral from ' + currentFigure
            );
        }
        this.scaleDegree = scaleDegree;
        this._tempRoot = this.scale.pitchFromDegree(this.scaleDegree);

        if (
            this.key.mode === 'minor'
            && (this.scaleDegree === 6 || this.scaleDegree === 7)
        ) {
            if (
                ['minor', 'diminished', 'half-diminished'].indexOf(
                    impliedQuality
                ) !== -1
            ) {
                const raiseTone = new interval.Interval('A1');
                this._tempRoot = raiseTone.transposePitch(this._tempRoot);
                if (debug) {
                    console.log(
                        'raised root because minor/dim on scaleDegree 6 or 7'
                    );
                }
            }
        }

        /* temp hack */
        if (this.numbers === 7) {
            if (scaleDegree === 5 && impliedQuality === 'major') {
                impliedQuality = 'dominant-seventh';
            } else {
                impliedQuality += '-seventh';
            }
        }

        this.impliedQuality = impliedQuality;
        this.updatePitches();
    }
    get scale() {
        if (this._scale !== undefined) {
            return this._scale;
        } else {
            this._scale = this.key.getScale();
            return this._scale;
        }
    }
    get key() {
        return this._key;
    }
    set key(keyStr) {
        if (typeof keyStr === 'string') {
            this._key = new key.Key(keyStr);
        } else if (typeof keyStr === 'undefined') {
            this._key = new key.Key('C');
        } else {
            this._key = keyStr;
        }
    }
    get degreeName() {
        if (this.scaleDegree < 7) {
            return [
                undefined,
                'Tonic',
                'Supertonic',
                'Mediant',
                'Subdominant',
                'Dominant',
                'Submediant',
            ][this.scaleDegree];
        } else {
            const tonicPitch = new pitch.Pitch(this.key.tonic);
            let diffRootToTonic = (tonicPitch.ps - this.root().ps) % 12;
            if (diffRootToTonic < 0) {
                diffRootToTonic += 12;
            }
            if (diffRootToTonic === 1) {
                return 'Leading-tone';
            } else {
                return 'Subtonic';
            }
        }
    }

    /**
     * Update the .pitches array.  Called at instantiation, but not automatically afterwards.
     *
     * @memberof music21.roman.RomanNumeral
     */
    updatePitches() {
        const impliedQuality = this.impliedQuality;
        const chordSpacing = chord.chordDefinitions[impliedQuality];
        const chordPitches = [this._tempRoot];
        let lastPitch = this._tempRoot;
        for (let j = 0; j < chordSpacing.length; j++) {
            // console.log('got them', lastPitch);
            const thisTransStr = chordSpacing[j];
            const thisTrans = new interval.Interval(thisTransStr);
            const nextPitch = thisTrans.transposePitch(lastPitch);
            chordPitches.push(nextPitch);
            lastPitch = nextPitch;
        }
        this.pitches = chordPitches;
        this.root(this._tempRoot);
    }

    /**
     * Gives a string display.  Note that since inversion is not yet supported
     * it needs to be given separately.
     *
     * Inverting 7th chords does not work.
     *
     * @memberof music21.roman.RomanNumeral
     * @param {string} displayType - ['roman', 'bassName', 'nameOnly', other]
     * @param {Int} [inversion=0]
     * @returns {String}
     */
    asString(displayType, inversion) {
        const keyObj = this.key;
        const tonic = keyObj.tonic;
        const mode = keyObj.mode;

        if (inversion === undefined) {
            inversion = 0;
        }
        let inversionName = '';
        if (inversion === 1) {
            if (displayType === 'roman') {
                inversionName = '6';
            } else {
                inversionName = ' (first inversion)';
            }
        } else if (inversion === 2) {
            if (displayType === 'roman') {
                inversionName = '64';
            } else {
                inversionName = ' (second inversion)';
            }
        }
        let fullChordName;
        let connector = ' in ';
        let suffix = '';
        if (displayType === 'roman') {
            fullChordName = this.figure;
        } else if (displayType === 'nameOnly') {
            // use only with only choice being TONIC
            fullChordName = '';
            connector = '';
            suffix = ' triad';
        } else if (displayType === 'bassName') {
            fullChordName = this.bass().name.replace(/-/, 'b');
            connector = ' in ';
            suffix = '';
        } else {
            // "default" submediant, etc...
            fullChordName = this.degreeName;
            if (this.numbers !== undefined) {
                fullChordName += ' ' + this.numbers.toString();
            }
        }
        let tonicDisplay = tonic.replace(/-/, 'b');
        if (mode === 'minor') {
            tonicDisplay = tonicDisplay.toLowerCase();
        }
        const chordStr
            = fullChordName
            + inversionName
            + connector
            + tonicDisplay
            + ' '
            + mode
            + suffix;
        return chordStr;
    }
}
roman.RomanNumeral = RomanNumeral;
