import * as chord from './chord';
import * as figuredBass from './figuredBass';
import * as harmony from './harmony';
import * as interval from './interval';
import * as key from './key';
import * as pitch from './pitch';
import * as scale from './scale';
export declare const figureShorthands: {
    '53': string;
    '3': string;
    '63': string;
    '753': string;
    '75': string;
    '73': string;
    '9753': string;
    '975': string;
    '953': string;
    '97': string;
    '95': string;
    '93': string;
    '653': string;
    '6b53': string;
    '643': string;
    '642': string;
    bb7b5b3: string;
    bb7b53: string;
    b7b5b3: string;
};
export declare const functionalityScores: {
    I: number;
    i: number;
    V7: number;
    V: number;
    V65: number;
    I6: number;
    V6: number;
    V43: number;
    I64: number;
    IV: number;
    i6: number;
    viio7: number;
    V42: number;
    viio65: number;
    viio6: number;
    '#viio65': number;
    ii: number;
    '#viio6': number;
    ii65: number;
    ii43: number;
    ii42: number;
    IV6: number;
    ii6: number;
    VI: number;
    '#VI': number;
    vi: number;
    viio: number;
    '#viio': number;
    iio: number;
    iio42: number;
    bII6: number;
    iio43: number;
    iio65: number;
    '#vio': number;
    '#vio6': number;
    III: number;
    v: number;
    VII: number;
    VII7: number;
    IV65: number;
    IV7: number;
    iii: number;
    iii6: number;
    vi6: number;
};
/**
 * expandShortHand - expand a string of numbers into an array
 *
 * N.B. this is NOT where abbreviations get expanded
 *
 * @memberof music21.roman
 * @param  {string} shorthand string of a figure w/o roman to parse
 * @return {Array<string>}           array of shorthands
 */
export declare function expandShortHand(shorthand: any): any[];
/**
 * correctSuffixForChordQuality - Correct a given inversionString suffix given a
 *     chord of various qualities.
 *
 * @memberof music21.roman
 * @param  {chord.Chord} chordObj
 * @param  {string} inversionString a string like '6' to fix.
 * @return {string}           corrected inversionString
  */
export declare function correctSuffixForChordQuality(chordObj: chord.Chord, inversionString: string): string;
/**
 * maps an index number to a roman numeral in lowercase
 *
 * @memberof music21.roman
 * @example
 * music21.roman.romanToNumber[4]
 * // 'iv'
 */
export declare const romanToNumber: string[];
/**
 * Represents a RomanNumeral.  By default, capital Roman Numerals are
 * major chords; lowercase are minor.
 *
 * @class RomanNumeral
 * @memberof music21.roman
 * @param {string} figure - the roman numeral as a string, e.g., 'IV', 'viio', 'V7'
 * @param {string|music21.key.Key} [keyStr='C']
 * @property {Array<music21.pitch.Pitch>} scale - (readonly) returns the scale
 *     associated with the roman numeral
 * @property {music21.key.Key} key - the key associated with the
 *     RomanNumeral (not allowed to be undefined yet)
 * @property {string} figure - the figure as passed in
 * @property {string} degreeName - the name associated with the scale degree,
 *     such as "mediant" etc., scale 7 will be "leading tone" or
 *     "subtonic" appropriately
 * @property {int} scaleDegree
 * @property {string|undefined} impliedQuality - "major", "minor", "diminished", "augmented"
 * @property {music21.roman.RomanNumeral|undefined} secondaryRomanNumeral
 * @property {music21.key.Key|undefined} secondaryRomanNumeralKey
 * @property {string|undefined} frontAlterationString
 * @property {music21.interval.Interval|undefined} frontAlterationTransposeInterval
 * @property {music21.pitch.Accidental|undefined} frontAlterationAccidental
 * @property {string|undefined} romanNumeralAlone
 * @property {scale.Scale|boolean|undefined} impliedScale
 * @property {music21.interval.Interval|undefined} scaleOffset
 * @property {Array<music21.pitch.Pitch>} pitches - RomanNumerals
 *     are Chord objects, so .pitches will work for them also.
 */
export declare class RomanNumeral extends harmony.Harmony {
    static get className(): string;
    _parsingComplete: boolean;
    primaryFigure: any;
    secondaryRomanNumeral: RomanNumeral;
    secondaryRomanNumeralKey: key.Key;
    pivotChord: any;
    scaleCardinality: number;
    _figure: string;
    caseMatters: boolean;
    scaleDegree: number;
    frontAlterationString: string;
    frontAlterationTransposeInterval: interval.Interval;
    frontAlterationAccidental: pitch.Accidental;
    romanNumeralAlone: any;
    quality: any;
    impliedQuality: any;
    impliedScale: any;
    scaleOffset: any;
    useImpliedScale: boolean;
    bracketedAlterations: any;
    omittedSteps: any;
    followsKeyChange: boolean;
    protected _functionalityScore: number;
    protected _scale: scale.ConcreteScale;
    protected _tempRoot: pitch.Pitch;
    numbers: number;
    figuresNotationObj: figuredBass.Notation;
    constructor(figure?: string, keyStr?: key.Key | string | undefined, { parseFigure, updatePitches, }?: {
        parseFigure?: boolean;
        updatePitches?: boolean;
    });
    stringInfo(): string;
    _parseFigure(): void;
    _parseFrontAlterations(workingFigure: any): any;
    _correctBracketedPitches(): void;
    _setImpliedQualityFromString(workingFigure: any): any;
    _fixMinorVIandVII(useScale: any): void;
    _parseRNAloneAmidstAug6(workingFigure: any, useScale: any): any[];
    /**
     * get romanNumeral - return either romanNumeralAlone (II) or with frontAlterationAccidental (#II)
     *
     * @return {string}  new romanNumeral;
     */
    get romanNumeral(): any;
    get scale(): scale.ConcreteScale;
    get key(): key.Key;
    set key(keyOrScale: key.Key);
    get figure(): string;
    set figure(newFigure: string);
    get figureAndKey(): string;
    get degreeName(): string;
    /**
     * Update the .pitches array.  Called at instantiation, but not automatically afterwards.
     *
     */
    _updatePitches(): void;
    bassScaleDegreeFromNotation(notationObject: any): number;
    _matchAccidentalsToQuality(impliedQuality: any): void;
    _correctForSecondaryRomanNumeral(useScale: any, figure?: any): any[];
    _parseOmittedSteps(workingFigure: any): any;
    _parseBracketedAlterations(workingFigure: any): any;
    _findSemitoneSizeForQuality(impliedQuality: any): any;
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
    asString(displayType: string, inversion?: number): string;
}
//# sourceMappingURL=roman.d.ts.map