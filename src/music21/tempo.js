/**
 * music21j -- Javascript reimplementation of Core music21 features.
 * music21/tempo -- tempo and (not in music21p) metronome objects
 *
 * Copyright (c) 2013-18, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
 *
 */
import * as $ from 'jquery';
// import * as MIDI from '../ext/midijs/build/MIDI.min.js';

import { prebase } from './prebase.js';

const MIDI = window.MIDI;

/* a Music21Object in m21p; the overhead is too high here to follow ... */
/**
 * tempo module, see {@link music21.tempo}
 *
 * @exports music21/tempo
 */
/**
 * tempo namespace
 *
 * @namespace music21.tempo
 * @memberof music21
 * @requires music21/prebase
 * @requires music21/base
 * @requires MIDI
 * @property {number} [baseTempo=60] - basic tempo
 */
export const tempo = {};

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
tempo.defaultTempoValues = {
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

tempo.baseTempo = 60;

/* --------- metronome ---------- */
/**
 *
 * @class Metronome
 * @memberof music21.tempo
 * @extends music21.prebase.ProtoM21Object
 * @param {number} [tempo=music21.tempo.baseTempo] - the tempo of the metronome to start
 * @property {number} tempo
 * @property {int} [numBeatsPerMeasure=4]
 * @property {number} [minTempo=10]
 * @property {number} [maxTempo=600]
 * @property {bool} [flash=false] - flash the tempo
 * @property {bool} [silent=false] - play silently
 * @property {int} beat - current beat number
 * @property {int} chirpTimeout - an index of a timeout object for chirping
 */
export class Metronome extends prebase.ProtoM21Object {
    constructor(tempoInt) {
        super();
        this._tempo = 60; // overridden by music21.tempo.baseTempo;
        if (tempoInt === undefined) {
            this.tempo = tempo.baseTempo;
        } else {
            this.tempo = tempoInt;
        }
        this.numBeatsPerMeasure = 4;
        this.minTempo = 10;
        this.maxTempo = 600;
        this.beat = this.numBeatsPerMeasure;
        this.chirpTimeout = undefined;
        this.silent = false;
        this.flash = false;
        this.tempoRanges = [0, 40, 60, 72, 120, 144, 240, 999];
        this.tempoIncreases = [0, 1, 2, 3, 4, 6, 8, 15, 100];
    }
    get tempo() {
        return this._tempo;
    }
    set tempo(t) {
        this._tempo = t;
        if (this._tempo > this.maxTempo) {
            this._tempo = this.maxTempo;
        } else if (this._tempo < this.minTempo) {
            this._tempo = this.minTempo;
        }
    }
    get beatLength() {
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
        this.chirpTimeout = setTimeout(() => {
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
    }

    /**
     * add a Metronome interface onto the DOM at where
     *
     * @param {jQuery|Node} [where='body']
     * @returns {jQuery} - a div holding the metronome.
     */
    addDiv(where) {
        let jWhere;
        if (where !== undefined && where.jquery !== undefined) {
            jWhere = where;
        } else if (where !== undefined) {
            jWhere = $(where);
        } else {
            jWhere = $('body');
        }
        const metroThis = this;
        const tempoHolder = $(
            '<span class="tempoHolder">' + this.tempo.toString() + '</span>'
        );
        tempoHolder.css({
            'font-size': '24px',
            'padding-left': '10px',
            'padding-right': '10px',
        });
        const newDiv = $('<div class="metronomeRendered"></div>');
        newDiv.append(tempoHolder);

        const b1 = $('<button>start</button>');
        b1.on('click', () => {
            metroThis.chirp();
        });
        const b2 = $('<button>stop</button>');
        b2.on('click', () => {
            metroThis.stopChirp();
        });
        newDiv.prepend(b2);
        newDiv.prepend(b1);
        const b3 = $('<button>up</button>');
        b3.on('click', function increaseSpeedButton() {
            metroThis.increaseSpeed();
            $(this)
                .prevAll('.tempoHolder')
                .html(metroThis.tempo.toString());
        });
        const b4 = $('<button>down</button>');
        b4.on('click', function decreaseSpeedButton() {
            metroThis.decreaseSpeed();
            $(this)
                .prevAll('.tempoHolder')
                .html(metroThis.tempo.toString());
        });
        newDiv.append(b3);
        newDiv.append(b4);
        const $flash = $(
            '<span class="metroFlash">'
                + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'
        );
        $flash.css('margin-left', '40px');
        $flash.css('height', '40px');

        newDiv.append($flash);

        jWhere.append(newDiv);

        this.$metronomeDiv = newDiv;
        return newDiv;
    }
}
tempo.Metronome = Metronome;
