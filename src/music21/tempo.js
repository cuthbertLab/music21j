/**
 * music21j -- Javascript reimplementation of Core music21 features.  
 * music21/tempo -- tempo and (not in music21p) metronome objects
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

/* a Music21Object in m21p; the overhead is too high here to follow ... */
define(['./prebase', './base', 'loadMIDI'], function(prebase, base, MIDI) {
    var tempo = {};

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
    tempo.Metronome = function (tempo) {
        prebase.ProtoM21Object.call(this);
        this.classes.push('Metronome');
        if (tempo === undefined) {
            this.tempo = music21.tempo.baseTempo;
        } else {
            this.tempo = tempo;
        }
        this._tempo = 60; // overridden by music21.tempo.baseTempo;
        this.numBeatsPerMeasure = 4;
        this.minTempo = 10;
        this.maxTempo = 600;
        this.beat = this.numBeatsPerMeasure;
        this.chirpTimeout = undefined;
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
               
        });

    };
    
    tempo.Metronome.prototype = new prebase.ProtoM21Object();
    tempo.Metronome.prototype.constructor = tempo.Metronome;
    tempo.Metronome.prototype.chirp = function () {
        this.beat += 1;
        if (this.beat > this.numBeatsPerMeasure) {
            this.beat = 1;
            music21.MIDI.noteOn(0, 96, 100, 0);
            music21.MIDI.noteOff(0, 96, .1);
        } else {
            music21.MIDI.noteOn(0, 84, 70, 0);
            music21.MIDI.noteOff(0, 84, .1);
        }
        var that = this;
        this.chirpTimeout = setTimeout(function () { that.chirp(); }, 
                1000*60/this.tempo);
    };
    tempo.Metronome.prototype.stopChirp = function () {
        if (this.chirpTimeout != undefined) {
            clearTimeout(this.chirpTimeout);
            this.chirpTimeout = undefined;
        }
    };
    tempo.Metronome.prototype.tempoRanges =     [0, 40, 60, 72, 120, 144, 240, 999];
    tempo.Metronome.prototype.tempoIncreases = [0, 1,  2,  3,  4,   6,   8,  15, 100];
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
    };
    tempo.Metronome.prototype.decreaseSpeed = function(n) {
        // increase by one metronome 'click' for every n
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
    tempo.Metronome.prototype.addDiv = function(where) {
        var jWhere = undefined;
        if (where.jquery !== undefined) {
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
        jWhere.append(newDiv);
    };
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.tempo = tempo;
    }
    return tempo;   
});
