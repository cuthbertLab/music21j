/// <reference types="jquery" />
import * as prebase from './prebase';
import * as base from './base';
import { Music21Exception } from './exceptions21';
export declare class TempoException extends Music21Exception {
}
/**
 * Object mapping names to tempo values
 *
 * @name music21.tempo.defaultTempoValues
 * @memberof music21.tempo
 * @example
 * music21.tempo.defaultTempoValues.grave
 * // 40
 */
export declare const defaultTempoValues: {
    larghissimo: number;
    largamente: number;
    grave: number;
    'molto adagio': number;
    largo: number;
    lento: number;
    adagio: number;
    slow: number;
    langsam: number;
    larghetto: number;
    adagietto: number;
    andante: number;
    andantino: number;
    'andante moderato': number;
    maestoso: number;
    moderato: number;
    moderate: number;
    allegretto: number;
    animato: number;
    'allegro moderato': number;
    allegro: number;
    fast: number;
    schnell: number;
    allegrissimo: number;
    'molto allegro': number;
    'tr\u00E8s vite': number;
    vivace: number;
    vivacissimo: number;
    presto: number;
    prestissimo: number;
};
export declare const baseTempo = 60;
/**
 *
 * @class Metronome
 * @memberof music21.tempo
 * @extends music21.prebase.ProtoM21Object
 * @param {number} [tempo=music21.tempo.baseTempo] - the tempo of the metronome to start
 * @property {number} tempo
 * @property {number} [numBeatsPerMeasure=4]
 * @property {number} [minTempo=10]
 * @property {number} [maxTempo=600]
 * @property {boolean} [flash=false] - flash the tempo
 * @property {boolean} [silent=false] - play silently
 * @property {number} beat - current beat number
 * @property {number} chirpTimeout - an index of a timeout object for chirping
 */
export declare class Metronome extends prebase.ProtoM21Object {
    static get className(): string;
    _tempo: number;
    numBeatsPerMeasure: number;
    minTempo: number;
    maxTempo: number;
    beat: number;
    chirpTimeout: number;
    silent: boolean;
    flash: boolean;
    tempoRanges: number[];
    tempoIncreases: number[];
    $metronomeDiv: JQuery;
    constructor(tempoInt?: number);
    get tempo(): number;
    set tempo(t: number);
    get beatLength(): number;
    _silentFlash(flashColor: any): void;
    /**
     * Play a note (a higher one on the downbeat) and start the metronome chirping.
     */
    chirp(): void;
    /**
     * Stop the metronome from chirping.
     */
    stopChirp(): void;
    /**
     * Increase the metronome tempo one "click".
     *
     * Value changes depending on the current tempo.  Uses standard metronome guidelines.
     *
     * To change the tempo, just set this.tempo = n
     *
     * @param {int} [n=1 - number of clicks to the right
     * @returns {number} new tempo
     */
    increaseSpeed(n?: number): number;
    /**
     * Decrease the metronome tempo one "click"
     *
     * To change the tempo, just set this.tempo = n
     *
     * @param {int} [n=1] - number of clicks to the left
     * @returns {number} new tempo
     */
    decreaseSpeed(n?: number): number;
    /**
     * add a Metronome interface onto the DOM at where
     *
     * @param {jQuery|HTMLElement} [where]
     * @returns {jQuery} - a div holding the metronome.
     */
    addDiv(where: any): JQuery<HTMLElement>;
}
declare class TempoText {
    text: string;
    constructor(text?: string);
}
/**
 *
 * @class MetronomeMark
 * @memberof music21.tempo
 * @extends base.Music21Object
 * @param {Object} metronome - metronome
 * @param {string} metronome.text - tempo text
 * @param {number} metronome.number - beats per minute
 * @param {number|music21.duration.Duration} metronome.referent - duration value of tempo
 * @param {boolean} metronome.parentheses - ???
 * @property {string} text - tempo text
 * @property {number} number - beats per minute
 * @property {music21.duration.Duration} referent - duration value of tempo
 */
export declare class MetronomeMark extends base.Music21Object {
    static get className(): string;
    protected _number: number;
    numberImplicit: boolean;
    protected _tempoText: TempoText;
    textImplicit: any;
    protected _referent: any;
    parentheses: boolean;
    constructor({ text, number, referent, parentheses, }?: {
        text?: any;
        number?: any;
        referent?: any;
        parentheses?: boolean;
    });
    _updateNumberFromText(): void;
    _updateTextFromNumber(): void;
    get text(): undefined | string | TempoText;
    set text(value: undefined | string | TempoText);
    get number(): number;
    set number(value: number);
    get referent(): any;
    set referent(value: any);
    _getDefaultNumber(tempoText: any): any;
    _getDefaultText(number: any, spread?: number): string;
}
export {};
//# sourceMappingURL=tempo.d.ts.map