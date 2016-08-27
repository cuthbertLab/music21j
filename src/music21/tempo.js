/**
 * music21j -- Javascript reimplementation of Core music21 features.  
 * music21/tempo -- tempo and (not in music21p) metronome objects
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
import { MIDI } from 'MIDI';
import { prebase } from './prebase';
import { base } from './base';

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
export    var tempo = {};

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
            'larghissimo': 16, 
            'largamente': 32, 
            'grave': 40, 
            'molto adagio': 40,
            'largo': 46, 
            'lento': 52, 
            'adagio': 56,
            'slow': 56,
            'langsam': 56,
            'larghetto': 60, 
            'adagietto': 66, 
            'andante': 72,
            'andantino': 80, 
            'andante moderato': 83,
            'maestoso': 88,
            'moderato': 92, 
            'moderate': 92,
            'allegretto': 108,
            'animato': 120,
            'allegro moderato': 128,
            'allegro': 132,
            'fast': 132,
            'schnell': 132,
            'allegrissimo': 140, 
            'molto allegro': 144,
            'très vite': 144,
            'vivace': 160, 
            'vivacissimo': 168, 
            'presto': 184, 
            'prestissimo': 208,
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
     * @property {Int} [numBeatsPerMeasure=4]
     * @property {number} [minTempo=10]
     * @property {number} [maxTempo=600]
     * @property {bool} [flash=false] - flash the tempo
     * @property {bool} [silent=false] - play silently
     * @property {Int} beat - current beat number
     * @property {Int} chirpTimeout - an index of a timeout object for chirping
     */
    tempo.Metronome = function (tempoInt) {
        prebase.ProtoM21Object.call(this);
        this.classes.push('Metronome');
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
        
        Object.defineProperties(this, {
           'tempo': {
             enumerable: true,
             get: function() { return this._tempo; },
             set: function(t) { 
                 this._tempo = t;
                 if (this._tempo > this.maxTempo) {
                     this._tempo = this.maxTempo;
                 } else if (this._tempo < this.minTempo) {
                     this._tempo = this.minTempo;
                 }
             }
           },
           'beatLength': {
               enumerable: true,
               get: function() {
                   return 60.0/this.tempo;
               }
           }
               
        });

    };
    
    tempo.Metronome.prototype = new prebase.ProtoM21Object();
    tempo.Metronome.prototype.constructor = tempo.Metronome;
    
    tempo.Metronome.prototype._silentFlash = function(flashColor) {
        this.$metronomeDiv.find('.metroFlash').css('background-color', flashColor).fadeOut(this.beatLength*1000*1/4, function() {
            $(this).css('background-color', '#ffffff').fadeIn(1);
        });
    }

    
    /**
     * Play a note (a higher one on the downbeat) and start the metronome chirping.
     * 
     * @memberof music21.tempo.Metronome
     */    
    tempo.Metronome.prototype.chirp = function () {
        this.beat += 1;
        if (this.beat > this.numBeatsPerMeasure) {
            this.beat = 1;
            if (this.silent != true) {
                music21.MIDI.noteOn(0, 96, 100, 0);
                music21.MIDI.noteOff(0, 96, .1);                
            }
            if (this.flash == true) {
                this._silentFlash('#0000f0');
            }
        } else {
            if (this.silent != true) {
                music21.MIDI.noteOn(0, 84, 70, 0);
                music21.MIDI.noteOff(0, 84, .1);
            }
            if (this.flash == true) {
                this._silentFlash('#ff0000');
            }
        }
        var that = this;
        this.chirpTimeout = setTimeout(function () { that.chirp(); }, 
                1000*60/this.tempo);
    };

    
    /**
     * Stop the metronome from chirping.
     * 
     * @memberof music21.tempo.Metronome
     */
    tempo.Metronome.prototype.stopChirp = function () {
        if (this.chirpTimeout != undefined) {
            clearTimeout(this.chirpTimeout);
            this.chirpTimeout = undefined;
        }
    };
    tempo.Metronome.prototype.tempoRanges =     [0, 40, 60, 72, 120, 144, 240, 999];
    tempo.Metronome.prototype.tempoIncreases = [0, 1,  2,  3,  4,   6,   8,  15, 100];

    
    /**
     * Increase the metronome tempo one "click".
     * 
     * Value changes depending on the current tempo.  Uses standard metronome guidelines.
     * 
     * To change the tempo, just set this.tempo = n
     * 
     * @memberof music21.tempo.Metronome
     * @param {Int} n - number of clicks to the right
     * @returns {number} new tempo
     */
    tempo.Metronome.prototype.increaseSpeed = function(n) {
        // increase by one metronome 'click' for every n
        if (n === undefined) { n = 1; }
        for (var i = 0; i < n; i ++ ) {
            t = this.tempo;
            for (var tr = 0; tr < this.tempoRanges.length; tr++) {
                var tempoExtreme = this.tempoRanges[tr];
                var tempoIncrease = this.tempoIncreases[tr];
                if (t < tempoExtreme) {
                    t += tempoIncrease;
                    t = tempoIncrease * Math.round(t/tempoIncrease);
                    break;
                }
            }
            //console.log(t);
            this.tempo = t;
        }
        return this.tempo;
    };
    
    /**
     * Decrease the metronome tempo one "click"
     * 
     * To change the tempo, just set this.tempo = n
     * 
     * @memberof music21.tempo.Metronome
     * @param {Int} n - number of clicks to the left
     * @returns {number} new tempo
     */   
    tempo.Metronome.prototype.decreaseSpeed = function(n) {
        if (n === undefined) { n = 1; }
        for (var i = 0; i < n; i ++ ) {
            t = this.tempo;
            trL = this.tempoRanges.length;
            for (var tr = 1; tr <= trL; tr++) {
                var tempoExtreme = this.tempoRanges[trL - tr];
                var tempoIncrease = this.tempoIncreases[trL - tr + 1];
                if (t > tempoExtreme) {
                    t -= tempoIncrease;
                    t = tempoIncrease * Math.floor(t/tempoIncrease);
                    break;
                }
            }
            //console.log(t);
            this.tempo = t;
        }
    };
    
    /**
     * add a Metronome interface onto the DOM at where
     * 
     * @memberof music21.tempo.Metronome
     * @param {JQueryDOMObject|DOMObject} [where='body']
     * @returns {JQueryDOMObject} - a div holding the metronome.
     */
    tempo.Metronome.prototype.addDiv = function(where) {
        var jWhere = undefined;
        if (where !== undefined && where.jquery !== undefined) {
            jWhere = where;
        } else if (where !== undefined) {
            jWhere = $(where);
        } else {
            jWhere = $('body');
        }
        var metroThis = this;
        var tempoHolder = $('<span class="tempoHolder">' + this.tempo.toString() + 
                   '</span>').css({
                       'font-size': '24px',
                       'padding-left': '10px',
                       'padding-right': '10px',
                       });
        var newDiv = $('<div class="metronomeRendered"></div>');
        newDiv.append(tempoHolder);
        var b1 = $('<button>start</button>');
        b1.on('click', function() { metroThis.chirp(); });
        var b2 = $('<button>stop</button>');
        b2.on('click', function() { metroThis.stopChirp(); });
        newDiv.prepend(b2);
        newDiv.prepend(b1);
        var b3 = $('<button>up</button>');
        b3.on('click', function() { metroThis.increaseSpeed(); $(this).prevAll('.tempoHolder').html(metroThis.tempo.toString()); });
        var b4 = $('<button>down</button>');
        b4.on('click', function() { metroThis.decreaseSpeed(); $(this).prevAll('.tempoHolder').html(metroThis.tempo.toString()); });
        newDiv.append(b3);
        newDiv.append(b4);
        var $flash = $('<span class="metroFlash">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>')
        $flash.css('margin-left', '40px').css('height','40px');
        newDiv.append($flash);
        
        jWhere.append(newDiv);
        this.$metronomeDiv = newDiv;
        return newDiv;
    };
    
