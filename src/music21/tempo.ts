/**
 * music21j -- Javascript reimplementation of Core music21 features.
 * music21/tempo -- tempo and (not in music21p) metronome objects
 *
 * Copyright (c) 2013-18, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
 *
 * tempo module, see {@link music21.tempo}
 *
 * @exports music21/tempo
 * @namespace music21.tempo
 * @memberof music21
 * @requires music21/duration
 * @requires music21/prebase
 * @requires music21/base
 * @requires MIDI
 * @property {number} [baseTempo=60] - basic tempo
 */
import * as $ from 'jquery';
import * as MIDI from 'midicube';

import * as prebase from './prebase';
import * as base from './base';
import * as duration from './duration';

import { Music21Exception } from './exceptions21';

export class TempoException extends Music21Exception {}

// noinspection JSNonASCIINames,NonAsciiCharacters
/**
 * Object mapping names to tempo values
 *
 * @name music21.tempo.defaultTempoValues
 * @memberof music21.tempo
 * @example
 * music21.tempo.defaultTempoValues.grave
 * // 40
 */
export const defaultTempoValues = {
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

/* --------- metronome ---------- */
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
export class Metronome extends prebase.ProtoM21Object {
    static get className() { return 'music21.tempo.Metronome'; }

    _tempo: number = baseTempo;
    numBeatsPerMeasure: number = 4;
    minTempo: number = 10;
    maxTempo: number = 600;
    beat: number = 4;
    chirpTimeout: number;
    silent: boolean = false;
    flash: boolean = false;
    tempoRanges = [0, 40, 60, 72, 120, 144, 240, 999];
    tempoIncreases = [0, 1, 2, 3, 4, 6, 8, 15, 100];
    $metronomeDiv: JQuery;

    constructor(tempoInt: number = baseTempo) {
        super();
        if (tempoInt === undefined) {
            this.tempo = baseTempo;
        } else {
            this.tempo = tempoInt;
        }
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

    _silentFlash(flashColor) {
        this.$metronomeDiv
            .find('.metroFlash')
            .css('background-color', flashColor)
            .fadeOut(this.beatLength * 1000 / 4, function silentFadeOut() {
                $(this)
                    .css('background-color', '#ffffff')
                    .fadeIn(1);
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
     * Increase the metronome tempo one "click".
     *
     * Value changes depending on the current tempo.  Uses standard metronome guidelines.
     *
     * To change the tempo, just set this.tempo = n
     *
     * @param {int} [n=1 - number of clicks to the right
     * @returns {number} new tempo
     */
    increaseSpeed(n=1) {
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
     * Decrease the metronome tempo one "click"
     *
     * To change the tempo, just set this.tempo = n
     *
     * @param {int} [n=1] - number of clicks to the left
     * @returns {number} new tempo
     */
    decreaseSpeed(n=1) {
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
     *
     * @param {jQuery|HTMLElement} [where]
     * @returns {jQuery} - a div holding the metronome.
     */
    addDiv(where) {
        /**
         * @type {jQuery}
         */
        let $where;
        if (where !== undefined && where instanceof $) {
            $where = where;
        } else if (where !== undefined && !(where instanceof $)) {
            $where = $(where);
        } else {
            $where = $('body');
        }
        const metroThis = this;
        /**
         *
         * @type {jQuery}
         */
        const $tempoHolder = $(
            '<span class="tempoHolder">' + this.tempo.toString() + '</span>'
        );
        $tempoHolder.css({
            'font-size': '24px',
            'padding-left': '10px',
            'padding-right': '10px',
        });
        /**
         *
         * @type {jQuery}
         */
        const $newDiv = $('<div class="metronomeRendered"></div>');
        $newDiv.append($tempoHolder);

        /**
         *
         * @type {jQuery}
         */
        const b1 = $('<button>start</button>');
        b1.on('click', () => {
            metroThis.chirp();
        });

        /**
         *
         * @type {jQuery}
         */
        const b2 = $('<button>stop</button>');
        b2.on('click', () => {
            metroThis.stopChirp();
        });
        $newDiv.prepend(b2);
        $newDiv.prepend(b1);
        /**
         *
         * @type {jQuery}
         */
        const b3 = $('<button>up</button>');
        b3.on('click', function increaseSpeedButton() {
            metroThis.increaseSpeed();
            $(this)
                .prevAll('.tempoHolder')
                .html(metroThis.tempo.toString());
        });
        /**
         *
         * @type {jQuery}
         */
        const b4 = $('<button>down</button>');
        b4.on('click', function decreaseSpeedButton() {
            metroThis.decreaseSpeed();
            $(this)
                .prevAll('.tempoHolder')
                .html(metroThis.tempo.toString());
        });
        $newDiv.append(b3);
        $newDiv.append(b4);
        /**
         *
         * @type {jQuery}
         */
        const $flash = $(
            '<span class="metroFlash">'
                + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'
        );
        $flash.css('margin-left', '40px');
        $flash.css('height', '40px');

        $newDiv.append($flash);

        $where.append($newDiv);

        this.$metronomeDiv = $newDiv;
        return $newDiv;
    }
}

class TempoText {
    text: string;
    constructor(text: string = '') {
        this.text = text;
    }
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
export class MetronomeMark extends base.Music21Object {
    static get className() { return 'music21.tempo.MetronomeMark'; }

    protected _number: number;
    numberImplicit: boolean;
    protected _tempoText: TempoText;
    textImplicit;
    protected _referent;
    parentheses: boolean = false;

    constructor({
        text=undefined,
        number=undefined,
        referent=undefined,
        parentheses=false,
    } = {}) {
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

    // sigh, again the TypeScript limitation...
    get text(): undefined|string|TempoText {
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

    get number() {
        return this._number;
    }

    set number(value) {
        if (typeof value !== 'number') {
            throw new TempoException('cannot set number to a string');
        }
        this._number = value;
        this.numberImplicit = false;
    }

    get referent() {
        return this._referent;
    }

    set referent(value) {
        if (value === undefined) {
            this._referent = new duration.Duration(1);
        } else if (['number', 'string'].includes(typeof value)) {
            this._referent = new duration.Duration(value);
        } else if (value.classes.includes('Duration')) {
            this._referent = value;
        } else if (value.duration) {
            this._referent = value.duration;
        } else {
            throw new TempoException(`Cannot get a Duration from the supplied object: ${value}`);
        }
    }

    _getDefaultNumber(tempoText) {
        const tempoStr = tempoText instanceof TempoText ? tempoText.text : tempoText;
        let post;
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

    _getDefaultText(number, spread=2) {
        const tempoNumber = typeof number === 'number' ? number : parseFloat(number);
        return Object.keys(defaultTempoValues).find(tempoName => {
            const tempoValue = defaultTempoValues[tempoName];
            return ((tempoValue - spread) <= tempoNumber
                && (tempoValue + spread) >= tempoNumber);
        });
    }
}

