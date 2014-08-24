/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/jazzMidi -- wrapper around the Jazz Plugin
 * 
 * Uses the cross-platform, cross-browser plugin from 
 * http://jazz-soft.net/doc/Jazz-Plugin/Plugin.html
 * P.S. by the standards of divinity of most major religions, Sema Kachalo is a god.
 *
 * Copyright (c) 2014, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 * @author Michael Scott Cuthbert
 */

define(['jquery', './note', './chord'], function($, note, chord) {
    /**
     * @exports music21/miditools
     */
    miditools = {};
    /**
     * @memberof music21
     * @constructor
     * @param {number} t - timing information
     * @param {number} a - midi data 1 ( a >> 4 = midiCommand )
     * @param {number} b - midi data 2
     * @param {number} c - midi data 3
     */
    miditools.Event = function (t, a, b, c) {
        this.timing = t;
        this.data1 = a; 
        this.data2 = b; 
        this.data3 = c; 
        this.midiCommand = (a >> 4);
        
        this.noteOff = (this.midiCommand == 8);
        this.noteOn = (this.midiCommand == 9);
        
        this.midiNote = undefined;
        if (this.noteOn || this.noteOff) {
            this.midiNote = this.data2;
            this.velocity = this.data3;
        }
    };
    miditools.Event.prototype.noteInfo = function () {
        if (this.noteOn) {
            console.log('Note on: ' + this.midiNote + " ; Velocity: " + this.velocity);
        }
    };
    miditools.Event.prototype.sendToMIDIjs = function () {
        if (music21.MIDI !== undefined) {
            if (this.noteOn) {
                music21.MIDI.noteOn(0, this.midiNote, this.velocity, 0);
            } else if (this.noteOff) {
                music21.MIDI.noteOff(0, this.midiNote, 0);      
            }
        } else {
            console.warn('could not playback note because no MIDIout defined');
        };
    };
    /**
     * 
     * @returns {note.Note}
     */
    miditools.Event.prototype.music21Note = function () {
        var m21n = new note.Note();
        m21n.pitch.ps = this.midiNote;
        return m21n;
    };    
    miditools.maxDelay = 100; // in ms
    miditools.heldChordTime = 0;
    miditools.heldChordNotes = undefined;
    miditools.timeOfLastNote = Date.now(); // in ms
    
    miditools._baseTempo = 60;
    miditools.metronome = undefined;
    
    Object.defineProperties(miditools, {
       'tempo': {
           enumerable: true,
           get: function() {
               if (this.metronome === undefined) {
                   return this._baseTempo;
               } else {
                   return this.metronome.tempo;
               }
           },
           set: function(t) {
               if (this.metronome === undefined) {
                   this._baseTempo = t;
               } else {
                   this.metronome.tempo = t;
               }
           }
       },
    });
    
    /* --------- chords ------------- */
    /**
     *  Clears chords that are older than miditools.heldChordTime
     *  
     *  Runs a setTimeout on itself.
     *  Calls miditools.sendOutChord
     */
    miditools.clearOldChords = function () {
        // clear out notes that may be a chord...
        var nowInMs = Date.now(); // in ms
        if ((miditools.heldChordTime + 
                miditools.maxDelay) < nowInMs) {
            miditools.heldChordTime = nowInMs;
            if (miditools.heldChordNotes !== undefined) {
                //console.log('to send out chords');
                miditools.sendOutChord(miditools.heldChordNotes);
                miditools.heldChordNotes = undefined;
            }           
        }
        setTimeout(miditools.clearOldChords, miditools.maxDelay);
    };
    /**
     *  Take a series of jEvent noteOn objects and convert them to a single Chord object
     *  so long as they are all sounded within miditools.maxDelay milliseconds of each other.
     *  this method stores notes in miditools.heldChordNotes (Array).
     *
     *  @param {miditools.Event} jEvent 
     *  @returns undefined
     */
    miditools.makeChords = function (jEvent) { // jEvent is a miditools.Event object
        if (jEvent.noteOn) {
            var m21n = jEvent.music21Note();
            if (miditools.heldChordNotes === undefined) {
                miditools.heldChordNotes = [m21n];
            } else {
                for (var i = 0; i < miditools.heldChordNotes.length; i++) {
                    var foundNote = miditools.heldChordNotes[i];
                    if (foundNote.pitch.ps == m21n.pitch.ps) {
                        return;  // no duplicates
                    }
                }
                miditools.heldChordNotes.push(m21n);
            }
        }
    };

    miditools.lastElement = undefined;
    
    /**
     * 
     * @param {Array<note.Note>} chordNoteList - a list of notes
     * @returns {(note.Note|chord.Chord|undefined)} - (probably a music21.chord.Chord but maybe a music21.note.Note object)
     * 
     * 
     */
    miditools.sendOutChord = function (chordNoteList) {
        var appendObject = undefined;
        if (chordNoteList.length > 1) {
            //console.log(chordNoteList[0].name, chordNoteList[1].name);
            appendObject = new chord.Chord(chordNoteList);
        } else if (chordNoteList.length == 1) {
            appendObject = chordNoteList[0]; // note object
        } else {
            return undefined;
        }
        appendObject.stemDirection = 'noStem';
        miditools.quantizeLastNote();
        miditools.lastElement = appendObject;
        if (music21.jazzMidi.callBacks.sendOutChord !== undefined) {            
            music21.jazzMidi.callBacks.sendOutChord(appendObject);
        } else {
            return appendObject;
        }
    };

    /**
     * @param {note.GeneralNote} lastElement - note to be quantized
     */
    miditools.quantizeLastNote = function (lastElement) {
        if (lastElement === undefined) {
            lastElement = this.lastElement;
            if (lastElement === undefined) {
                return;
            }
        }
        lastElement.stemDirection = undefined;
        var nowInMS = Date.now();
        var msSinceLastNote = nowInMS - this.timeOfLastNote;
        this.timeOfLastNote = nowInMS;
        var normalQuarterNoteLength = 1000*60 / this.tempo;
        var numQuarterNotes = msSinceLastNote / normalQuarterNoteLength;
        var roundedQuarterLength = Math.round(4 * numQuarterNotes) / 4;
        if (roundedQuarterLength >= 4) {
            roundedQuarterLength = 4;
        } else if (roundedQuarterLength >= 3) {
            roundedQuarterLength = 3;
        } else if (roundedQuarterLength > 2) {
            roundedQuarterLength = 2;
        } else if (roundedQuarterLength == 1.25) {
            roundedQuarterLength = 1;
        } else if (roundedQuarterLength == 0.75) {
            roundedQuarterLength = 0.5;
        } else if (roundedQuarterLength == 0) {
            roundedQuarterLength = 0.125;
        }
        //console.log(roundedQuarterLength);
        lastElement.duration.quarterLength = roundedQuarterLength;
    };
    
    /* ----------- callbacks --------- */
    /**
     * @param {miditools.Event} midiEvent - event to send out.
     * @returns undefined
     */
    
    miditools.sendToMIDIjs = function(midiEvent) {
        midiEvent.sendToMIDIjs();
    };

    // end of define
    if (typeof(music21) != "undefined") {
        music21.miditools = miditools;
    }       
    return miditools;
});
