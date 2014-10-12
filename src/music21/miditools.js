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

define(['jquery', './note', './chord', 'MIDI', 'Base64', 'base64binary'],         
       /**
         * @exports music21/miditools
         */
        function($, note, chord, MIDI) {
    /** @namespace music21.miditools 
     *  @memberof music21 
     */
    var miditools = {};
    
    miditools.transposeOctave = 0;
    /**
     * @class Event 
     * @memberof music21.miditools
     * @param {number} t - timing information
     * @param {number} a - midi data 1 (N.B. a >> 4 = midiCommand )
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
            this.midiNote = this.data2 + 12 * miditools.transposeOctave;
            this.velocity = this.data3;
        }        
    };

    /**
     * Calls {@link music21.MIDI.noteOn} or {@link music21.MIDI.noteOff} for the Note
     * represented by the event (if appropriate)
     * 
     * @memberof music21.miditools.Event
     * @returns {undefined}
     */
    miditools.Event.prototype.sendToMIDIjs = function () {
        if (MIDI !== undefined) {
            if (this.noteOn) {
                MIDI.noteOn(0, this.midiNote, this.velocity, 0);
            } else if (this.noteOff) {
                MIDI.noteOff(0, this.midiNote, 0);      
            }
        } else {
            console.warn('could not playback note because no MIDIout defined');
        };
    };
    /**
     * Makes a {@link music21.note.Note} object from the event's midiNote number.
     * 
     * @memberof music21.miditools.Event
     * @returns {note.Note} - the {@link music21.note.Note} object represented by Event.midiNote
     */
    miditools.Event.prototype.music21Note = function () {
        var m21n = new note.Note();
        m21n.pitch.ps = this.midiNote;
        return m21n;
    }; 
    
    /**
     * How long to wait in milliseconds before deciding that a note belongs to another chord. Default 100ms
     * 
     * @memberof music21.miditools
     * @type {number}
     */
    miditools.maxDelay = 100; // in ms
    miditools.heldChordTime = 0;
    miditools.heldChordNotes = undefined;

    /**
     * When, in MS since Jan 1, 1970, was the last {@link music21.note.Note} played.
     * Defaults to the time that the module was loaded.
     * 
     * @memberof music21.miditools
     * @type {number}
     */   
    miditools.timeOfLastNote = Date.now(); // in ms
    
    miditools._baseTempo = 60;
    /**
     * Assign (or quiery) a Metronome object to run all timing information.
     * 
     * @memberof music21.miditools
     * @type {music21.tempo.Metronome}
     */   
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
     *  
     *  @memberof music21.miditools
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
     *  @param {music21.miditools.Event} jEvent 
     *  @memberof music21.miditools
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
     * Take the list of Notes and makes a chord out of it, if appropriate and call 
     * {@link music21.jazzMidi.callBacks.sendOutChord} callback with the Chord or Note as a parameter.
     * 
     * @memberof music21.miditools
     * @param {Array<music21.note.Note>} chordNoteList - an Array of {@link music21.note.Note} objects
     * @returns {(music21.note.Note|music21.    chord.Chord|undefined)} A {@link music21.chord.Chord} object, 
     * most likely, but maybe a {@link music21.note.Note} object)
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
     * 
     * @memberof music21.miditools
     * @param {note.GeneralNote} lastElement - A {@link music21.note.Note} to be quantized
     * @returns {note.GeneralNote} The same {@link music21.note.Note} object passed in with 
     * duration quantized
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
        lastElement.duration.quarterLength = roundedQuarterLength;
        return lastElement;
    };
    
    /* ----------- callbacks --------- */
    /**
     * @param {miditools.Event} midiEvent - event to send out.
     * @returns undefined
     */
    miditools.sendToMIDIjs = function(midiEvent) {
        midiEvent.sendToMIDIjs();
    };
    
    /* ------------ MIDI.js ----------- */
    miditools.loadedSoundfonts = {};

    miditools.postLoadCallback = function (soundfont, callback) {
        // this should be bound to MIDI
        
        if (music21.debug) {
            console.log('soundfont loaded about to execute callback.');
            console.log('first playing two notes very softly -- seems to flush the buffer.');            
        }
        $(".loadingSoundfont").remove();

        var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
        var isAudioTag = (MIDI.technology == 'HTML Audio Tag');
        var instrumentObj = music21.instrument.find(soundfont);
        if (instrumentObj != undefined) {
            MIDI.programChange(instrumentObj.midiChannel, instrumentObj.midiProgram);
            if (music21.debug) {
                console.log(soundfont + ' (' + instrumentObj.midiProgram + ') loaded on ', instrumentObj.midiChannel);
            }
            if ((isFirefox == false) && (isAudioTag == false)) {  
                var c = instrumentObj.midiChannel;
                     // Firefox ignores sound volume! so don't play! as does IE and others using HTML audio tag.
                MIDI.noteOn(c, 36, 1, 0);     // if no notes have been played before then
                MIDI.noteOff(c, 36, 1, 0.1);  // the second note to be played is always
                MIDI.noteOn(c, 48, 1, 0.2);   // very clipped (on Safari at least)
                MIDI.noteOff(c, 48, 1, 0.3);  // this helps a lot.
                MIDI.noteOn(c, 60, 1, 0.3);   // chrome needs three?
                MIDI.noteOff(c, 60, 1, 0.4);                      
            }
        }
        if (callback !== undefined) {
            callback(instrumentObj);
        }
        miditools.loadedSoundfonts[soundfont] = true;                
    };

    
    // method to load soundfonts while waiting for other processes that need them
    // to load first.  will be available as music21.miditools.loadSoundfont()
    miditools.loadSoundfont = function(soundfont, callback) {
        
        if (miditools.loadedSoundfonts[soundfont] == true) {
            if (callback !== undefined) {
                var instrumentObj = music21.instrument.find(soundfont);
                callback(instrumentObj);
            }
        } else if (miditools.loadedSoundfonts[soundfont] == 'loading'){
            var waitThenCall = undefined;
            waitThenCall = function() {
                if (miditools.loadedSoundfonts[soundfont] == true) {
                    if (music21.debug) {
                        console.log('other process has finished loading; calling callback');
                    }
                    if (callback !== undefined) {
                        var instrumentObj = music21.instrument.find(soundfont);
                        callback(instrumentObj);
                    }
                } else {
                    if (music21.debug) {
                        console.log('waiting for other process load');                        
                    }
                    setTimeout(waitThenCall, 100);
                }
            };
            waitThenCall();
        } else {
            miditools.loadedSoundfonts[soundfont] = "loading";
            if (music21.debug) {                
                console.log('waiting for document ready');
            }
            $(document).ready( function() {
                if (music21.debug) {
                    console.log('document ready, waiting to load soundfont');                    
                }
                $(document.body).append($("<div class='loadingSoundfont'><b>Loading MIDI Instrument</b>: " +
                        "audio will begin when this message disappears.</div>"));                            
                MIDI.loadPlugin({
                    soundfontUrl: music21.soundfontUrl,
                    instrument: soundfont,
                    callback: miditools.postLoadCallback.bind(MIDI, soundfont, callback),
                });
            });
        }
    };


    // end of define
    if (typeof(music21) != "undefined") {
        music21.miditools = miditools;
    }       
    return miditools;
});
