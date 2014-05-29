/**
 * music21j -- Javascript reimplementation of Core music21 features.  
 * music21/metronome -- metronome objects (not in music21p)
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

/* a Music21Object in m21p; the overhead is too high here to follow ... */
define(function(require) {
    var metronome = {};

    metronome.tempo = 60;
    metronome.numBeatsPerMeasure = 4;
    metronome.beat = metronome.numBeatsPerMeasure;
    metronome.chirpTimeout = undefined;
    
    /* --------- metronome ---------- */
    metronome.chirp = function () {
        metronome.beat += 1;
        if (metronome.beat > metronome.numBeatsPerMeasure) {
            metronome.beat = 1;
            music21.MIDI.noteOn(0, 96, 100, 0);
            music21.MIDI.noteOff(0, 96, .1);
        } else {
            music21.MIDI.noteOn(0, 84, 70, 0);
            music21.MIDI.noteOff(0, 84, .1);
        }
        metronome.chirpTimeout = setTimeout(metronome.chirp, 1000*60/metronome.tempo);
    };
    metronome.stopChirp = function () {
        if (this.chirpTimeout != undefined) {
            clearTimeout(this.chirpTimeout);
            this.chirpTimeout = undefined;
        }
    };
    
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.metronome = metronome;
    }
    return metronome;   
});
