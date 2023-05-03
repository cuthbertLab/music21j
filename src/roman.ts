/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/roman -- roman.RomanNumeral -- Chord subclass
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * Roman numeral module. See  namespace
 * music21.roman -- namespace for dealing with RomanNumeral analysis.
 */
import { Music21Exception } from './exceptions21';

import * as chord from './chord';
import * as common from './common';
import * as figuredBass from './figuredBass';
import * as harmony from './harmony';
import * as interval from './interval';
import * as key from './key';
import * as pitch from './pitch';
import * as scale from './scale';

export const figureShorthands = {
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
    b7b5b3: 'ø7',
};

// noinspection SpellCheckingInspection
export const functionalityScores = {
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
 * @param  {string} shorthand string of a figure w/o roman to parse
 * @return {Array<string>}           array of shorthands
 */
export function expandShortHand(shorthand) {
    shorthand = shorthand.replace('/', '');
    if (shorthand.match(/[b-]$/)) {
        shorthand += '3';
    }
    shorthand = shorthand.replace('11', 'x');
    shorthand = shorthand.replace('13', 'y');
    shorthand = shorthand.replace('15', 'z');
    const rx = /#*-*b*o*[1-9xyz]/g;
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
    for (const sh of shorthandGroups) {
        let sh2 = sh.replace('x', '11');
        sh2 = sh2.replace('y', '13');
        sh2 = sh2.replace('z', '15');
        shGroupOut.push(sh2);
    }
    return shGroupOut;
}

/**
 * correctSuffixForChordQuality - Correct a given inversionString suffix given a
 *     chord of various qualities.
 *
 * @param  {chord.Chord} chordObj
 * @param  {string} inversionString a string like '6' to fix.
 * @return {string}           corrected inversionString
  */
export function correctSuffixForChordQuality(
    chordObj: chord.Chord,
    inversionString: string
): string {
    const fifthType = chordObj.semitonesFromChordStep(5);
    let qualityName = '';
    if (fifthType === 6) {
        qualityName = 'o';
    } else if (fifthType === 8) {
        qualityName = '+';
    }

    if (
        inversionString !== undefined
        && (inversionString.startsWith('o')
            || inversionString.startsWith('/o')
            || inversionString.startsWith('ø')
        )
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
            qualityName = 'ø';
        } else if (seventhType !== 9) {
            // do something for very odd chords built on diminished triad.
        }
    }
    return qualityName + inversionString;
}

/**
 * maps an index number to a roman numeral in lowercase
 *
 * @example
 * music21.roman.romanToNumber[4]
 * // 'iv'
 */
export const romanToNumber = [undefined, 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

/**
 * Represents a RomanNumeral.  By default, capital Roman Numerals are
 * major chords; lowercase are minor.
 *
 * figure - the roman numeral as a string, e.g., 'IV', 'viio', 'V7'
 * [keyStr='C']
 * @property scale - (readonly) returns the scale
 *     associated with the roman numeral
 * @property key - the key associated with the
 *     RomanNumeral (not allowed to be undefined yet)
 * @property {string} figure - the figure as passed in
 * @property {string} degreeName - the name associated with the scale degree,
 *     such as "mediant" etc., scale 7 will be "leading tone" or
 *     "subtonic" appropriately
 * @property {int} scaleDegree
 * @property {string|undefined} impliedQuality - "major", "minor", "diminished", "augmented"
 * @property {string|undefined} frontAlterationString
 * @property {string|undefined} romanNumeralAlone
 */
export class RomanNumeral extends harmony.Harmony {
    static get className() { return 'music21.roman.RomanNumeral'; }

    // do not set up initial values here because super is not first.
    _parsingComplete: boolean;
    primaryFigure;
    secondaryRomanNumeral: RomanNumeral;
    secondaryRomanNumeralKey: key.Key;
    pivotChord;
    scaleCardinality: number;
    _figure: string;
    caseMatters: boolean;
    scaleDegree: number;
    frontAlterationString: string;
    frontAlterationTransposeInterval: interval.Interval;
    frontAlterationAccidental: pitch.Accidental;
    romanNumeralAlone;
    quality;
    impliedQuality;
    impliedScale: key.Key;
    scaleOffset: interval.Interval;
    useImpliedScale: boolean;
    bracketedAlterations;
    omittedSteps;
    followsKeyChange: boolean;
    protected _functionalityScore: number;
    protected _scale: scale.ConcreteScale;
    protected _tempRoot: pitch.Pitch;
    numbers: number;
    figuresNotationObj: figuredBass.Notation;

    constructor(
        figure: string = '',
        keyStr: key.Key|string|undefined = undefined,
        {
            parseFigure=false,
            updatePitches=false,
        }={}
    ) {
        super(figure, { updatePitches, parseFigure });

        // immediately fix low-preference figures
        figure = figure.replace('0', 'o');
        figure = figure.replace('/o', 'ø');

        // end immediate fixes

        this._parsingComplete = false;

        // not yet used...
        this.primaryFigure = undefined;
        this.secondaryRomanNumeral = undefined;
        this.secondaryRomanNumeralKey = undefined;

        this.pivotChord = undefined;
        this.scaleCardinality = 7;
        this._figure = undefined;

        this.caseMatters = true;
        if (typeof figure === 'number') {
            this.caseMatters = false;
        }

        this.scaleDegree = undefined;
        this.frontAlterationString = undefined;
        this.frontAlterationTransposeInterval = undefined;
        this.frontAlterationAccidental = undefined;
        this.romanNumeralAlone = undefined;

        // TODO(msc) -- this is never defined.
        this.quality = undefined;

        this.impliedQuality = undefined;
        this.impliedScale = undefined;
        this.scaleOffset = undefined;
        this.useImpliedScale = false;
        this.bracketedAlterations = [];
        this.omittedSteps = [];
        this.followsKeyChange = false;
        this._functionalityScore = undefined;
        this._scale = undefined; // the Key

        this.figure = figure;

        if (typeof keyStr === 'string') {
            this.key = new key.Key(keyStr);
        } else {
            this.key = keyStr;
        }

        // to remove...
        this.numbers = undefined;

        if (figure !== '') {
            this._parseFigure();
            this._parsingComplete = true;
            this._updatePitches();
        }
    }

    stringInfo() {
        return this.figure + ' in ' + this.key.stringInfo();
    }

    _parseFigure() {
        let workingFigure;
        let useScale = this.impliedScale;
        if (!this.useImpliedScale) {
            useScale = this.key;
        }
        [workingFigure, useScale] = this._correctForSecondaryRomanNumeral(
            useScale
        );

        if (workingFigure === 'Cad64') {
            // useScale might be a Scale, not Key. TODO: NO!
            if ((useScale as key.Key).mode === 'minor') {
                workingFigure = 'i64';
            } else {
                workingFigure = 'I64';
            }
        }

        this.primaryFigure = workingFigure;

        workingFigure = this._parseOmittedSteps(workingFigure);
        workingFigure = this._parseBracketedAlterations(workingFigure);
        workingFigure = workingFigure.replace(/^N6/, 'bII6');
        workingFigure = workingFigure.replace(/^N/, 'bII6');
        workingFigure = this._parseFrontAlterations(workingFigure);
        [workingFigure, useScale] = this._parseRNAloneAmidstAug6(
            workingFigure,
            useScale
        );
        workingFigure = this._setImpliedQualityFromString(workingFigure);

        this._tempRoot = useScale.pitchFromDegree(this.scaleDegree);
        this._fixMinorVIandVII(useScale);
        const expandedFigure = expandShortHand(workingFigure);
        this.figuresNotationObj = new figuredBass.Notation(
            expandedFigure.toString()
        );

        const numbersArr = workingFigure.match(/\d+/);
        if (numbersArr != null) {
            // noinspection JSUnusedAssignment
            workingFigure = workingFigure.replace(/\d+/, '');
            this.numbers = parseInt(numbersArr[0]);
        }
    }

    _parseFrontAlterations(workingFigure) {
        let frontAlterationString = '';
        let frontAlterationTransposeInterval;
        let frontAlterationAccidental;
        const _alterationRegex = /^(b+|-+|#+)/;
        const match = _alterationRegex.exec(workingFigure);
        if (match != null) {
            const group = match[1];
            let alteration = group.length;
            if (group[0] === 'b' || group[0] === '-') {
                alteration *= -1;
            }
            frontAlterationTransposeInterval = interval.intervalFromGenericAndChromatic(
                1,
                alteration
            );
            frontAlterationAccidental = new pitch.Accidental(alteration);
            frontAlterationString = group;
            workingFigure = workingFigure.replace(_alterationRegex, '');
        }
        this.frontAlterationString = frontAlterationString;
        this.frontAlterationTransposeInterval = frontAlterationTransposeInterval;
        this.frontAlterationAccidental = frontAlterationAccidental;
        return workingFigure;
    }

    _correctBracketedPitches() {
        for (const innerAlteration of this.bracketedAlterations) {
            const [alterNotation, chordStep] = innerAlteration;
            const alterPitch = this.getChordStep(chordStep);
            if (alterPitch === undefined) {
                continue;
            }
            const newAccidental = new pitch.Accidental(alterNotation);
            if (alterPitch.accidental === undefined) {
                alterPitch.accidental = newAccidental;
            } else {
                alterPitch.accidental.set(
                    alterPitch.accidental.alter + newAccidental.alter
                );
            }
        }
    }

    _setImpliedQualityFromString(workingFigure) {
        let impliedQuality = '';
        if (workingFigure.startsWith('o')) {
            impliedQuality = 'diminished';
            workingFigure = workingFigure.replace(/^o/, '');
        } else if (workingFigure.startsWith('/o')) {
            impliedQuality = 'half-diminished';
            workingFigure = workingFigure.replace(/^\/o/, '');
        } else if (workingFigure.startsWith('ø')) {
            impliedQuality = 'half-diminished';
            workingFigure = workingFigure.replace(/^ø/, '');
        } else if (workingFigure.startsWith('+')) {
            impliedQuality = 'augmented';
            workingFigure = workingFigure.replace(/^\+/, '');
        } else if (workingFigure.endsWith('d7')) {
            impliedQuality = 'dominant-seventh';
            workingFigure = workingFigure.replace(/d7$/, '7');
        } else if (
            this.caseMatters
            && this.romanNumeralAlone.toUpperCase() === this.romanNumeralAlone
        ) {
            impliedQuality = 'major';
        } else if (
            this.caseMatters
            && this.romanNumeralAlone.toLowerCase() === this.romanNumeralAlone
        ) {
            impliedQuality = 'minor';
        }
        this.impliedQuality = impliedQuality;
        return workingFigure;
    }

    _fixMinorVIandVII(useScale) {
        if (useScale.mode !== 'minor') {
            return;
        }
        if (!this.caseMatters) {
            return;
        }
        if (this.scaleDegree !== 6 && this.scaleDegree !== 7) {
            return;
        }
        if (
            !['minor', 'diminished', 'half-diminished'].includes(
                this.impliedQuality
            )
        ) {
            return;
        }

        const fati = this.frontAlterationTransposeInterval;
        if (fati !== undefined) {
            const newFati = interval.add([fati, new interval.Interval('A1')]);
            this.frontAlterationTransposeInterval = newFati;
            this.frontAlterationAccidental.alter += 1;
        } else {
            this.frontAlterationTransposeInterval = new interval.Interval('A1');
            this.frontAlterationAccidental = new pitch.Accidental(1);
        }

        this._tempRoot = this.frontAlterationTransposeInterval.transposePitch(
            this._tempRoot
        );
    }

    _parseRNAloneAmidstAug6(workingFigure, useScale) {
        let romanNumeralAlone = '';
        const _romanNumeralAloneRegex = /^(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2}|N)/;
        const _augmentedSixthRegex = /^(It|Ger|Fr|Sw)/;
        const rm = _romanNumeralAloneRegex.exec(workingFigure);
        const a6match = _augmentedSixthRegex.exec(workingFigure);
        if (rm === null && a6match === null) {
            throw new Music21Exception(
                `No roman numeral found in ${workingFigure}.`
            );
        }
        if (a6match !== null) {
            if (useScale.mode === 'major') {
                useScale = new key.Key(useScale.tonic.name, 'minor');
                this.impliedScale = useScale;
                this.useImpliedScale = true;
            }
            romanNumeralAlone = a6match[1];
            if (['It', 'Ger'].includes(romanNumeralAlone)) {
                this.scaleDegree = 4;
            } else {
                this.scaleDegree = 2;
            }
            workingFigure = workingFigure.replace(_augmentedSixthRegex, '');
            this.romanNumeralAlone = romanNumeralAlone;
            if (romanNumeralAlone !== 'Fr') {
                this.bracketedAlterations.push(['#', 1]);
            }
            if (romanNumeralAlone === 'Fr' || romanNumeralAlone === 'Sw') {
                this.bracketedAlterations.push(['#', 3]);
            }
        } else {
            romanNumeralAlone = rm[1];
            this.scaleDegree = common.fromRoman(romanNumeralAlone);
            workingFigure = workingFigure.replace(_romanNumeralAloneRegex, '');
            this.romanNumeralAlone = romanNumeralAlone;
        }
        return [workingFigure, useScale];
    }

    /**
     * get romanNumeral - return either romanNumeralAlone (II) or with frontAlterationAccidental (#II)
     *
     * @return {string}  new romanNumeral;
     */

    get romanNumeral() {
        if (this.frontAlterationAccidental === undefined) {
            return this.romanNumeralAlone;
        } else {
            return (
                this.frontAlterationAccidental.modifier + this.romanNumeralAlone
            );
        }
    }

    get scale() {
        if (this._scale !== undefined) {
            return this._scale;
        } else {
            this._scale = this.key.getScale();
            return this._scale;
        }
    }

    get key(): key.Key {
        return this._key;
    }

    set key(keyOrScale: key.Key) {
        if (typeof keyOrScale === 'string') {
            this._key = new key.Key(keyOrScale);
        } else if (typeof keyOrScale === 'undefined') {
            this._key = new key.Key('C');
        } else {
            this._key = keyOrScale;
        }
        if (keyOrScale === undefined) {
            this.useImpliedScale = true;
            this.impliedScale = new key.Key('C');
        } else {
            this.useImpliedScale = false;
            this.impliedScale = undefined;
        }
        if (this._parsingComplete) {
            this._updatePitches();
        }
    }

    get figure() {
        return this._figure;
    }

    set figure(newFigure) {
        this._figure = newFigure;
        if (this._parsingComplete) {
            this._parseFigure();
            this._updatePitches();
        }
    }

    get figureAndKey() {
        let tonicName = this.key.tonic.name;
        let mode = '';
        if (this.key.mode !== undefined) {
            mode = ' ' + this.key.mode;
        }

        if (mode === ' minor') {
            tonicName = tonicName.toLowerCase();
        } else if (mode === ' major') {
            tonicName = tonicName.toUpperCase();
        }
        return this.figure + ' in ' + tonicName + mode;
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
            const tonicPitch = this.key.tonic;
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
     */
    _updatePitches() {
        let useScale;
        if (this.secondaryRomanNumeralKey !== undefined) {
            useScale = this.secondaryRomanNumeralKey;
        } else if (!this.useImpliedScale) {
            useScale = this.key;
        } else {
            useScale = this.impliedScale;
        }

        this.scaleCardinality = 7; // simple speedup;
        const bassScaleDegree = this.bassScaleDegreeFromNotation(
            this.figuresNotationObj
        );
        const bassPitch = useScale.pitchFromDegree(
            bassScaleDegree,
            'ascending'
        );
        const pitches = [bassPitch];
        let lastPitch = bassPitch;
        const numberNotes = this.figuresNotationObj.numbers.length;

        for (let j = 0; j < numberNotes; j++) {
            const i = numberNotes - j - 1;
            const thisScaleDegree
                = bassScaleDegree + this.figuresNotationObj.numbers[i] - 1;
            const newPitch = useScale.pitchFromDegree(
                thisScaleDegree,
                'ascending'
            );
            const pitchName = this.figuresNotationObj.modifiers[
                i
            ].modifyPitchName(newPitch.name);
            const newNewPitch = new pitch.Pitch(pitchName);
            newNewPitch.octave = newPitch.octave;
            if (newNewPitch.ps < lastPitch.ps) {
                newNewPitch.octave += 1;
            }
            pitches.push(newNewPitch);
            lastPitch = newNewPitch;
        }
        if (this.frontAlterationTransposeInterval !== undefined) {
            const newPitches = [];
            for (const thisPitch of pitches) {
                const newPitch = this.frontAlterationTransposeInterval.transposePitch(
                    thisPitch
                );
                newPitches.push(newPitch);
            }
            this.pitches = newPitches;
        } else {
            this.pitches = pitches;
        }

        this._matchAccidentalsToQuality(this.impliedQuality);

        this.scaleOffset = this.frontAlterationTransposeInterval;

        if (this.omittedSteps.length) {
            const omittedPitches = [];
            for (const thisCS of this.omittedSteps) {
                const p = this.getChordStep(thisCS);
                if (p !== undefined) {
                    omittedPitches.push(p.name);
                }
            }
            const newPitches = [];
            for (const thisPitch of pitches) {
                if (!omittedPitches.includes(thisPitch.name)) {
                    newPitches.push(thisPitch);
                }
            }
            this.pitches = newPitches;
            // do something...
        }
        this._correctBracketedPitches();
    }

    bassScaleDegreeFromNotation(notationObject) {
        const c = new pitch.Pitch('C3');
        const cDNN = c.diatonicNoteNum; // always 22
        const pitches = [c];
        for (const i of notationObject.numbers) {
            const distanceToMove = i - 1;
            const newDiatonicNumber = cDNN + distanceToMove;
            const [newStep, newOctave] = interval.convertDiatonicNumberToStep(
                newDiatonicNumber
            );
            const newPitch = new pitch.Pitch('C3');
            newPitch.step = newStep;
            newPitch.octave = newOctave;
            pitches.push(newPitch);
        }
        const tempChord = new chord.Chord(pitches);
        const rootDNN = tempChord.root().diatonicNoteNum;
        const staffDistanceFromBassToRoot = rootDNN - cDNN;
        let bassSD = common.posMod(
            this.scaleDegree - staffDistanceFromBassToRoot,
            7
        );
        if (bassSD === 0) {
            bassSD = 7;
        }
        return bassSD;
    }

    _matchAccidentalsToQuality(impliedQuality) {
        const correctSemitones = this._findSemitoneSizeForQuality(
            impliedQuality
        );
        const chordStepsToExamine = [3, 5, 7];
        for (let i = 0; i < chordStepsToExamine.length; i++) {
            const thisChordStep = chordStepsToExamine[i];
            const thisCorrect = correctSemitones[i];
            const thisSemis = this.semitonesFromChordStep(thisChordStep);
            if (thisCorrect === undefined) {
                continue;
            }
            if (thisSemis === undefined) {
                continue;
            }
            if (thisSemis === thisCorrect) {
                continue;
            }

            let correctedSemis = thisCorrect - thisSemis;
            if (correctedSemis >= 6) {
                correctedSemis = -1 * (12 - correctedSemis);
            } else if (correctedSemis <= -6) {
                correctedSemis += 12;
            }

            const faultyPitch = this.getChordStep(thisChordStep);
            // TODO: check for faultyPitch is undefined

            if (faultyPitch.accidental === undefined) {
                faultyPitch.accidental = new pitch.Accidental(correctedSemis);
            } else {
                const acc = faultyPitch.accidental;
                correctedSemis += acc.alter;
                if (correctedSemis >= 6) {
                    correctedSemis = -1 * (12 - correctedSemis);
                } else if (correctedSemis <= -6) {
                    correctedSemis += 12;
                }
                acc.set(correctedSemis);
            }
        }
    }

    _correctForSecondaryRomanNumeral(useScale, figure=undefined) {
        if (figure === undefined) {
            figure = this._figure;
        }
        let workingFigure = figure;
        const rx = /(.*?)\/([#a-np-zA-NP-Z].*)/;
        const match = rx.exec(figure);
        if (match !== null) {
            const primaryFigure = match[1];
            const secondaryFigure = match[2];
            const secondaryRomanNumeral = new RomanNumeral(
                secondaryFigure,
                useScale,
            );
            this.secondaryRomanNumeral = secondaryRomanNumeral;
            let secondaryMode;
            if (secondaryRomanNumeral.quality === 'minor') {
                secondaryMode = 'minor';
            } else if (secondaryRomanNumeral.quality === 'major') {
                secondaryMode = 'minor';
            } else if (secondaryRomanNumeral.semitonesFromChordStep(3) === 3) {
                secondaryMode = 'minor';
            } else {
                secondaryMode = 'major';
            }
            this.secondaryRomanNumeralKey = new key.Key(
                secondaryRomanNumeral.root().name,
                secondaryMode
            );
            useScale = this.secondaryRomanNumeralKey;
            workingFigure = primaryFigure;
        }
        return [workingFigure, useScale];
    }

    _parseOmittedSteps(workingFigure) {
        const omittedSteps = [];
        const rx = /\[no(\d+)]s*/;
        let match = rx.exec(workingFigure);
        while (match !== null) {
            const thisStepStr = match[1];
            let thisStep = parseInt(thisStepStr);
            thisStep = thisStep % 7 || 7;
            omittedSteps.push(thisStep);
            workingFigure = workingFigure.replace(rx, '');
            match = rx.exec(workingFigure);
        }
        this.omittedSteps = omittedSteps;
        return workingFigure;
    }

    _parseBracketedAlterations(workingFigure) {
        const bracketedAlterations = this.bracketedAlterations;
        const rx =/\[(b+|-+|#+)(\d+)]/;
        let match = rx.exec(workingFigure);
        while (match !== null) {
            const matchAlteration = match[1];
            const matchDegree = parseInt(match[2]);
            bracketedAlterations.push([matchAlteration, matchDegree]);
            workingFigure = workingFigure.replace(rx, '');
            match = rx.exec(workingFigure);
        }
        return workingFigure;
    }

    _findSemitoneSizeForQuality(impliedQuality) {
        let correctSemitones;
        if (impliedQuality === 'major') {
            correctSemitones = [4, 7];
        } else if (impliedQuality === 'minor') {
            correctSemitones = [3, 7];
        } else if (impliedQuality === 'diminished') {
            correctSemitones = [3, 6, 9];
        } else if (impliedQuality === 'half-diminished') {
            correctSemitones = [3, 6, 10];
        } else if (impliedQuality === 'augmented') {
            correctSemitones = [4, 8];
        } else if (impliedQuality === 'dominant-seventh') {
            correctSemitones = [4, 7, 10];
        } else {
            correctSemitones = [];
        }

        return correctSemitones;
    }

    /**
     * Gives a string display.  Note that since inversion is not yet supported
     * it needs to be given separately.
     *
     * Inverting 7th chords does not work.
     *
     * @param {string} displayType - ['roman', 'bassName', 'nameOnly', other]
     * @param {number} [inversion=0]
     * @returns {string}
     */
    asString(displayType: string, inversion: number = 0): string {
        const keyObj = this.key;
        const tonicName = keyObj.tonic.name;
        const mode = keyObj.mode;

        // specifying inversion is for backwards compatibility only.
        if (inversion === undefined) {
            inversion = this.inversion();
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
            fullChordName = fullChordName.replace('/o', 'ø');
        } else if (displayType === 'nameOnly') {
            // use only with only choice being tonicName
            fullChordName = '';
            connector = '';
            suffix = ' triad';
        } else if (displayType === 'bassName') {
            fullChordName = this.bass().name.replace(/-/, 'b');
        } else {
            // "default" or "degreeName" submediant, etc...
            fullChordName = this.degreeName;
            if (this.numbers !== undefined) {
                fullChordName += ' ' + this.numbers.toString();
            }
        }
        let tonicDisplay = tonicName.replace(/-/, 'b');
        if (mode === 'minor') {
            tonicDisplay = tonicDisplay.toLowerCase();
        }
        const chordStr = fullChordName
            + inversionName
            + connector
            + tonicDisplay
            + ' '
            + mode
            + suffix;
        return chordStr;
    }
}
