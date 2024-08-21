/**
 * music21j -- Javascript reimplementation of Core music21 features.
 * music21/tempo -- tempo and (not in music21p) metronome objects
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21, Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 * tempo module,
 *
 */
import * as MIDI from 'midicube';

import * as prebase from './prebase';
import * as base from './base';
import * as duration from './duration';

import { Music21Exception } from './exceptions21';
import {common} from './main';
import {sleep, to_el} from './common';

export class TempoException extends Music21Exception {}

// noinspection JSNonASCIINames,NonAsciiCharacters
/**
 * Object mapping names to tempo values
 *
 * x = music21.tempo.defaultTempoValues.grave
 * // x = 40
 */
export const defaultTempoValues: Record<string, number> = {
    larghissimo: 16,
    largamente: 32,
    grave: 40,
    'molto adagio': 40,
    largo: 46,
    lento: 52,
    adagio: 56,
    slow: 56,
    langsam: 56,
    larghetto: 60,
    adagietto: 66,
    andante: 72,
    andantino: 80,
    'andante moderato': 83,
    maestoso: 88,
    moderato: 92,
    moderate: 92,
    allegretto: 108,
    animato: 120,
    'allegro moderato': 128,
    allegro: 132,
    fast: 132,
    schnell: 132,
    allegrissimo: 140,
    'molto allegro': 144,
    'très vite': 144,
    vivace: 160,
    vivacissimo: 168,
    presto: 184,
    prestissimo: 208,
};

export const baseTempo = 60;

/**
 * Metronome object
 */
export class Metronome extends prebase.ProtoM21Object {
    static get className() { return 'music21.tempo.Metronome'; }

    _tempo: number = baseTempo;
    numBeatsPerMeasure: number = 4;
    minTempo: number = 10;
    maxTempo: number = 600;
    beat: number = 4;

    /**
     * index of a window.SetTimeout object for chirping
     */
    chirpTimeout: number;

    /**
     * if true, counts silently
     */
    silent: boolean = false;

    /**
     * should the tempo flash
     */
    flash: boolean = false;
    tempoRanges = [0, 40, 60, 72, 120, 144, 240, 999];
    tempoIncreases = [0, 1, 2, 3, 4, 6, 8, 15, 100];
    metronomeDiv: HTMLDivElement;

    constructor(tempoInt: number = baseTempo) {
        super();
        this.tempo = tempoInt;
    }

    get tempo(): number {
        return this._tempo;
    }

    set tempo(t: number) {
        this._tempo = t;
        if (this._tempo > this.maxTempo) {
            this._tempo = this.maxTempo;
        } else if (this._tempo < this.minTempo) {
            this._tempo = this.minTempo;
        }
    }

    get beatLength(): number {
        return 60.0 / this.tempo;
    }

    _silentFlash(flashColor: string): void {
        const fm = <HTMLSpanElement> this.metronomeDiv.querySelector('.metroFlash');
        fm.style.transition = 'background-color ' + (this.beatLength/4).toString() + 's ease-in-out';
        fm.style.backgroundColor = flashColor;
        sleep(this.beatLength*1000/4).then(() => {
            fm.style.backgroundColor = '#ffffff';
        });
    }

    /**
     * Play a note (a higher one on the downbeat) and start the metronome chirping.
     */
    chirp() {
        this.beat += 1;
        if (this.beat > this.numBeatsPerMeasure) {
            this.beat = 1;
            if (this.silent !== true) {
                MIDI.noteOn(0, 96, 100, 0);
                MIDI.noteOff(0, 96, 0.1);
            }
            if (this.flash === true) {
                this._silentFlash('#0000f0');
            }
        } else {
            if (this.silent !== true) {
                MIDI.noteOn(0, 84, 70, 0);
                MIDI.noteOff(0, 84, 0.1);
            }
            if (this.flash === true) {
                this._silentFlash('#ff0000');
            }
        }
        const that = this;
        this.chirpTimeout = window.setTimeout(() => {
            that.chirp();
        }, 1000 * 60 / this.tempo);
    }

    /**
     * Stop the metronome from chirping.
     */
    stopChirp() {
        if (this.chirpTimeout !== undefined) {
            clearTimeout(this.chirpTimeout);
            this.chirpTimeout = undefined;
        }
    }

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
    increaseSpeed(n: number = 1): number {
        // increase by one metronome 'click' for every n
        for (let i = 0; i < n; i++) {
            let t = this.tempo;
            for (let tr = 0; tr < this.tempoRanges.length; tr++) {
                const tempoExtreme = this.tempoRanges[tr];
                const tempoIncrease = this.tempoIncreases[tr];
                if (t < tempoExtreme) {
                    t += tempoIncrease;
                    t = tempoIncrease * Math.round(t / tempoIncrease);
                    break;
                }
            }
            // console.log(t);
            this.tempo = t;
        }
        return this.tempo;
    }

    /**
     * Decrease the metronome tempo one or more "clicks"
     *
     * To change the tempo, just set this.tempo = n
     *
     * n is the number of clicks to the left
     *
     * returns new tempo
     */
    decreaseSpeed(n: number = 1): number {
        for (let i = 0; i < n; i++) {
            let t = this.tempo;
            const trL = this.tempoRanges.length;
            for (let tr = 1; tr <= trL; tr++) {
                const tempoExtreme = this.tempoRanges[trL - tr];
                const tempoIncrease = this.tempoIncreases[trL - tr + 1];
                if (t > tempoExtreme) {
                    t -= tempoIncrease;
                    t = tempoIncrease * Math.floor(t / tempoIncrease);
                    break;
                }
            }
            // console.log(t);
            this.tempo = t;
        }
        return this.tempo;
    }

    /**
     * add a Metronome interface onto the DOM at where
     * returns a JQuery div holding the metronome.
     */
    addDiv(where?: HTMLElement): HTMLElement {
        where = <HTMLElement> common.coerceHTMLElement(where);
        const tempoHolder: HTMLSpanElement = to_el(
            '<span class="tempoHolder">' + this.tempo.toString() + '</span>'
        );
        tempoHolder.style.fontSize = '24px';
        tempoHolder.style.paddingLeft = '10px';
        tempoHolder.style.paddingRight = '10px';
        const newDiv = <HTMLDivElement> to_el('<div class="metronomeRendered"></div>');
        const b1 = <HTMLButtonElement> to_el('<button>start</button>');
        b1.addEventListener('click', () => {
            this.chirp();
        });
        const b2 = <HTMLButtonElement> to_el('<button>stop</button>');
        b2.addEventListener('click', () => {
            this.stopChirp();
        });
        newDiv.appendChild(b1);
        newDiv.appendChild(b2);
        newDiv.appendChild(tempoHolder);

        const b3 = <HTMLButtonElement> to_el('<button>up</button>');
        b3.addEventListener('click', () => {
            this.increaseSpeed();
            b3.parentElement.querySelector('.tempoHolder').innerHTML = this.tempo.toString();
        });
        const b4 = <HTMLButtonElement> to_el('<button>down</button>');
        b4.addEventListener('click', () => {
            this.decreaseSpeed();
            b4.parentElement.querySelector('.tempoHolder').innerHTML = this.tempo.toString();
        });
        newDiv.appendChild(b3);
        newDiv.appendChild(b4);
        const flash = <HTMLSpanElement> to_el(
            '<span class="metroFlash">'
                + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'
        );
        flash.style.marginLeft = '40px';
        flash.style.height = '40px';

        newDiv.appendChild(flash);
        where.appendChild(newDiv);

        this.metronomeDiv = newDiv;
        return newDiv;
    }
}

class TempoText {
    text: string;
    constructor(text: string = '') {
        this.text = text;
    }
}

interface MetronomeMarkOptions {
    text?: string;
    number?: number;  // beats per minute
    referent?: duration.Duration;
    parentheses?: boolean;
}

export class MetronomeMark extends base.Music21Object {
    static get className() { return 'music21.tempo.MetronomeMark'; }

    protected _number: number;
    numberImplicit: boolean;
    protected _tempoText: TempoText;
    textImplicit: boolean;
    protected _referent: duration.Duration;
    parentheses: boolean = false;

    constructor({
        text=undefined,
        number=undefined,
        referent=undefined,
        parentheses=false,
    }: MetronomeMarkOptions = {}) {
        super();

        this._number = number;
        if (this._number !== undefined) {
            this.numberImplicit = false;
        }

        this._tempoText = undefined;
        this.textImplicit = undefined;
        this.text = text;

        this._referent = undefined;
        this.referent = referent;

        this.parentheses = parentheses;

        this._updateNumberFromText();
        this._updateTextFromNumber();
    }

    _updateNumberFromText() {
        if (this._number === undefined && this._tempoText !== undefined) {
            this._number = this._getDefaultNumber(this._tempoText);
            if (this._number !== undefined) {
                this.numberImplicit = true;
            }
        }
    }

    _updateTextFromNumber() {
        if (this._tempoText === undefined && this._number !== undefined) {
            this.text = this._getDefaultText(this._number);
            if (this.text !== undefined) {
                this.textImplicit = true;
            }
        }
    }

    get text(): undefined|string {
        if (this._tempoText === undefined) {
            return undefined;
        }
        return this._tempoText.text;
    }

    set text(value: undefined|string|TempoText) {
        if (value === undefined) {
            this._tempoText = undefined;
        } else if (value instanceof TempoText) {
            this._tempoText = value;
            this.textImplicit = false;
        } else {
            this._tempoText = new TempoText(value);
            // if (this.hasStyleInformation) { // TODO: where is this?
            //     this._tempoText.style = this.style;
            // } else {
            //     this.style = this._tempoText.style;
            // }
            this.textImplicit = false;
        }
    }

    /**
     * Tempo in beats per minute.
     */
    get number(): number {
        return this._number;
    }

    set number(value: number) {
        if (typeof value !== 'number') {
            throw new TempoException('cannot set number to a string');
        }
        this._number = value;
        this.numberImplicit = false;
    }

    get referent(): duration.Duration|undefined {
        return this._referent;
    }

    set referent(value: string|number|duration.Duration|base.Music21Object) {
        if (value === undefined) {
            this._referent = new duration.Duration(1);
        } else if (typeof value === 'number') {
            this._referent = new duration.Duration(value);
        } else if (typeof value === 'string') {
            this._referent = new duration.Duration(value);
        } else if (value instanceof duration.Duration) {
            this._referent = value;
        } else if (value instanceof base.Music21Object) {
            this._referent = value.duration;
        } else {
            throw new TempoException(`Cannot get a Duration from the supplied object: ${value}`);
        }
    }

    _getDefaultNumber(tempoText: string|TempoText): number {
        const tempoStr = tempoText instanceof TempoText ? tempoText.text : tempoText;
        let post: number;
        const tempoNames = Object.keys(defaultTempoValues);
        if (tempoNames.includes(tempoStr.toLowerCase())) {
            post = defaultTempoValues[tempoStr.toLowerCase()];
        } else if (tempoNames.includes(tempoStr)) {
            post = defaultTempoValues[tempoStr];
        } else {
            for (const word of tempoStr.split(' ')) {
                if (tempoNames.includes(word.toLowerCase())) {
                    post = defaultTempoValues[tempoStr.toLowerCase()];
                }
            }
        }
        return post;
    }

    _getDefaultText(n: number|string, spread: number = 2) {
        const tempoNumber = typeof n === 'number' ? n : parseFloat(n);
        return Object.keys(defaultTempoValues).find(tempoName => {
            const tempoValue = defaultTempoValues[tempoName];
            return ((tempoValue - spread) <= tempoNumber
                && (tempoValue + spread) >= tempoNumber);
        });
    }
}

