/// <reference types="jquery" />
import * as prebase from './prebase';
import * as base from './base';
import * as duration from './duration';
import { Music21Exception } from './exceptions21';
export declare class TempoException extends Music21Exception {
}
/**
 * Object mapping names to tempo values
 *
 * x = music21.tempo.defaultTempoValues.grave
 * // x = 40
 */
export declare const defaultTempoValues: Record<string, number>;
export declare const baseTempo = 60;
/**
 * Metronome object
 */
export declare class Metronome extends prebase.ProtoM21Object {
    static get className(): string;
    _tempo: number;
    numBeatsPerMeasure: number;
    minTempo: number;
    maxTempo: number;
    beat: number;
    /**
     * index of a window.SetTimeout object for chirping
     */
    chirpTimeout: number;
    /**
     * if true, counts silently
     */
    silent: boolean;
    /**
     * should the tempo flash
     */
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
     * Increase the metronome tempo one or more "clicks".
     *
     * Value changes depending on the current tempo.  Uses standard metronome guidelines.
     *
     * n is the number of clicks to the right
     *
     * To change the tempo, just set this.tempo = n
     *
     * returns new tempo
     */
    increaseSpeed(n?: number): number;
    /**
     * Decrease the metronome tempo one or more "clicks"
     *
     * To change the tempo, just set this.tempo = n
     *
     * n is the number of clicks to the left
     *
     * returns new tempo
     */
    decreaseSpeed(n?: number): number;
    /**
     * add a Metronome interface onto the DOM at where
     * returns a JQuery div holding the metronome.
     */
    addDiv(where?: JQuery | HTMLElement): JQuery;
}
declare class TempoText {
    text: string;
    constructor(text?: string);
}
interface MetronomeMarkOptions {
    text?: string;
    number?: number;
    referent?: duration.Duration;
    parentheses?: boolean;
}
export declare class MetronomeMark extends base.Music21Object {
    static get className(): string;
    protected _number: number;
    numberImplicit: boolean;
    protected _tempoText: TempoText;
    textImplicit: any;
    protected _referent: any;
    parentheses: boolean;
    constructor({ text, number, referent, parentheses, }?: MetronomeMarkOptions);
    _updateNumberFromText(): void;
    _updateTextFromNumber(): void;
    get text(): undefined | string | TempoText;
    set text(value: undefined | string | TempoText);
    /**
     * Tempo in beats per minute.
     */
    get number(): number;
    set number(value: number);
    get referent(): any;
    set referent(value: any);
    _getDefaultNumber(tempoText: any): any;
    _getDefaultText(n: number | string, spread?: number): string;
}
export {};
//# sourceMappingURL=tempo.d.ts.map