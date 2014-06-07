/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/note -- Note, Rest, NotRest, GeneralNote
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */


define(['music21/base', 'music21/pitch', 'vexflow'], 
        /**
         * Module for note classes
         * 
         * @exports music21/note
         */  
        function(base, pitch, Vex) {
	var note = {};

	note.noteheadTypeNames = [
          'arrow down',
          'arrow up',
          'back slashed',
          'circle dot',
          'circle-x',
          'cluster',
          'cross',
          'diamond',
          'do',
          'fa',
          'inverted triangle',
          'la',
          'left triangle',
          'mi',
          'none',
          'normal',
          're',
          'rectangle',
          'slash',
          'slashed',
          'so',
          'square',
          'ti',
          'triangle',
          'x',
          ];
	
	note.stemDirectionNames = [
	                           'double',
	                           'down',
	                           'noStem',
	                           'none',
	                           'unspecified',
	                           'up',
	                           ];

	/* TODO: convert Lyric */
	
	/* Notes and rests etc... */

	/**
	 * Superclass for all Note values
	 * 
	 * @class GeneralNote
	 * @constructor
	 * @memberof music21
	 * @extends base.Music21Object
	 * @param {(number|undefined=1)} ql - quarterLength of the note
	 */
	note.GeneralNote = function (ql) {
		base.Music21Object.call(this);
		this.classes.push('GeneralNote');
		this.isChord = false;
        if (ql != undefined) {
            this.duration.quarterLength = ql;
        }

	    this.activeVexflowNote = undefined;
        this.expressions = [];
        this.articulations = [];
        this.tie = undefined;
        
        /* TODO: editoral objects, color, lyric, addLyric, insertLyric, hasLyrics */
		/* Later: augmentOrDiminish, getGrace, */
        
        Object.defineProperties(this, {
            'quarterLength': {
                get: function() {return this.duration.quarterLength;},
                set: function(ql) { this.duration.quarterLength = ql;},
                enumerable: true,
            },
            
        });
        
	};
	note.GeneralNote.prototype = new base.Music21Object();
	note.GeneralNote.prototype.constructor = note.GeneralNote;
	
	note.GeneralNote.prototype.setStemDirectionFromClef = function (clef) {
	    return undefined;
	};
    /**
     * Sets the vexflow accidentals (if any), the dots, and the stem direction
     * @param {Vex.Flow.StaveNote} vfn - a Vex.Flow note
     */
    note.GeneralNote.prototype.vexflowAccidentalsAndDisplay = function (vfn, options) {
        if (this.duration.dots == 1) {
            vfn.addDotToAll();
        }
        if (this.stemDirection === undefined && options.clef != undefined) {
            this.setStemDirectionFromClef(options.clef);
        }
        vfn.setStemDirection(this.stemDirection == 'down' ? 
                                Vex.Flow.StaveNote.STEM_DOWN : 
                                Vex.Flow.StaveNote.STEM_UP);
        if (this.stemDirection == 'noStem') {
            vfn.hasStem = function() { return false; }; // need to override... 
            //vfn.render_options.stem_height = 0;
        } else {
            // correct VexFlow stem length for notes far from the center line;
            var staveDNNSpacing = 5;
            if (options.stave) {
                staveDNNSpacing = Math.floor(options.stave.options.spacing_between_lines_px / 2);
            }
            if (options.clef && this.pitch !== undefined) {
                var midLine = options.clef.firstLine + 4;
                //console.log(midLine);
                var absDNNfromCenter = Math.abs(this.pitch.diatonicNoteNum - midLine);
                var absOverOctave = absDNNfromCenter - 7;
                //console.log(absOverOctave);
                if (absOverOctave > 0) {
                    vfn.stem.stem_extension = absOverOctave * staveDNNSpacing;                      
                    //console.log(absOverOctave, vfn.stem, vfn.stem.stem_extension);
                }
            }
        }
    };
    
    /**
     * Play the current element as a MIDI note.
     * 
     * @name playMidi
     * @memberof GeneralNote
     * @param {number} tempo - tempo in bpm
     * @param {(base.Music21Object|undefined)} nextElement - for ties...
     * @returns {Number} - delay time in milliseconds until the next element (may be ignored)
     */
    note.GeneralNote.prototype.playMidi = function (tempo, nextElement) {
        // returns the number of milliseconds to the next element in
        // case that can't be determined otherwise.
        var volume = 60;
        if (this.articulations !== undefined) {
            this.articulations.forEach( function (a) { 
               volume *= a.dynamicShift;
               //console.log(volume);
               if (volume > 127) { volume = 127; }
            });
        }
        volume = Math.floor(volume);
        var milliseconds = 60 * 1000 / tempo;
        var ql = this.duration.quarterLength;
        milliseconds = 60 * ql * 1000 / tempo;
        if (this.isClassOrSubclass('Note')) { // Note, not rest
            var midNum = this.pitch.midi;                         
            var stopTime = milliseconds/1000;
            if (nextElement !== undefined && nextElement.isClassOrSubclass('Note')) {
                if (nextElement.pitch.midi != this.pitch.midi) {
                    stopTime += 60 * .25 / tempo; // legato -- play 16th note longer
                } else if (this.tie != undefined && (this.tie.type == 'start' || this.tie.type =='continue')) {
                    stopTime += 60 * nextElement.duration.quarterLength / tempo;
                    // this does not take into account 3 or more notes tied.
                    // TODO: look ahead at next nexts, etc.
                }
            } else if (nextElement === undefined) {
                // let last note ring an extra beat...
                stopTime += 60 * 1 / tempo;
            }
            //console.log(stopTime);
            if (this.tie === undefined || this.tie.type == 'start') {
                music21.MIDI.noteOn(0, midNum, volume, 0);                              
                music21.MIDI.noteOff(0, midNum, stopTime);
            } // else { console.log ('not going to play ', el.nameWithOctave) }
        } else if (this.isClassOrSubclass('Chord')) {
            // TODO: Tied Chords.
            for (var j = 0; j < this._noteArray.length; j++) {
                var midNum = this._noteArray[j].pitch.midi;
                music21.MIDI.noteOn(0, midNum, volume, 0);                      
                music21.MIDI.noteOff(0, midNum, milliseconds/1000);                     
            }
        } // it's a note.Rest -- do nothing -- milliseconds takes care of it...
        
        return milliseconds;   
    };	
	/**
	 * @class NotRest
	 * @memberof music21
	 * @extends note.GeneralNote
	 * @param {number} ql - length in quarter notes
	 */
	note.NotRest = function (ql) {
		note.GeneralNote.call(this, ql);
		this.classes.push('NotRest');
		this.notehead = 'normal';
	    this.noteheadFill = 'default';
        this.noteheadColor = undefined;
	    this.noteheadParenthesis = false;
	    this.volume = undefined; // not a real object yet.
	    this.beams = undefined; // no support yet.
	    /* TODO: this.duration.linkage -- need durationUnits */
	    this.stemDirection = undefined; // ['up','down','noStem', undefined] -- 'double' not supported
	};

	/* TODO: check stemDirection, notehead, noteheadFill, noteheadParentheses */
	note.NotRest.prototype = new note.GeneralNote();
	note.NotRest.prototype.constructor = note.NotRest;
	


	/* ------- Note ----------- */
    /**
     * @class Note
     * @memberof music21
     * @extends NotRest
     * @param {(string|undefined)} nn - pitch name
     * @param {(number|undefined)} ql - length in quarter notes
     */
	note.Note = function (nn, ql) {
		note.NotRest.call(this, ql);
		this.classes.push('Note');
		this.isNote = true; // for speed
		this.isRest = false; // for speed
	    this.pitch = new pitch.Pitch(nn);
        Object.defineProperties(this, {
            'name': {
                get: function() {return this.pitch.name;},
                set: function(nn) { this.pitch.name = nn;},
                enumerable: true,
            },
            'nameWithOctave': {
                get: function() {return this.pitch.nameWithOctave;},
                set: function(nn) { this.pitch.nameWithOctave = nn;},
                enumerable: true,
            },
            'step': {
                get: function() {return this.pitch.step;},
                set: function(nn) { this.pitch.step = nn;},
                enumerable: true,
            },
            // no Frequency
            'octave': {
                get: function() {return this.octave;},
                set: function(nn) { this.pitch.octave = nn;},
                enumerable: true,
            },
            // no microtone, pitchclass, pitchClassString
        });
        
        /* TODO: transpose, fullName */
        
	};

	note.Note.prototype = new note.NotRest();
	note.Note.prototype.constructor = note.Note;

    note.Note.prototype.setStemDirectionFromClef = function (clef) {
        if (clef === undefined) {
            return this;
        } else {
            var midLine = clef.firstLine + 4;
            var DNNfromCenter = this.pitch.diatonicNoteNum - midLine;
            //console.log(DNNfromCenter, this.pitch.nameWithOctave);
            if (DNNfromCenter >= 0) { this.stemDirection = 'down'; }
            else { this.stemDirection = 'up'; }            
            return this;
        }
    };
    note.Note.prototype.vexflowNote = function (options) {
        var clef = options.clef;
        
        if (this.duration === undefined) {
            //console.log(this);
            return undefined;
        }
        var vfd = this.duration.vexflowDuration;
        if (vfd === undefined) {
            return undefined;
        }
        var vexflowKey = this.pitch.vexflowName(clef);
        var vfn = new Vex.Flow.StaveNote({keys: [vexflowKey], 
                                      duration: vfd});
        this.vexflowAccidentalsAndDisplay(vfn, options); // clean up stuff...
        if (this.pitch.accidental != undefined) {
            if (this.pitch.accidental.vexflowModifier != 'n' && this.pitch.accidental.displayStatus != false) {
                vfn.addAccidental(0, new Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));
            } else if (this.pitch.accidental.displayType == 'always' || this.pitch.accidental.displayStatus == true) {
                vfn.addAccidental(0, new Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));           
            }
        }
        
        if (this.articulations[0] != undefined) {
            for (var i = 0; i < this.articulations.length; i++ ) {
                var art = this.articulations[i];
                vfn.addArticulation(0, art.vexflow()); // 0 refers to the first pitch (for chords etc.)...
            }
        }
        if (this.expressions[0] != undefined) {
            for (var i = 0; i < this.expressions.length; i++ ) {
                var exp = this.expressions[i];
                vfn.addArticulation(0, exp.vexflow()); // 0 refers to the first pitch (for chords etc.)...
            }
        }
        
        if (this.noteheadColor) {
            vfn.setKeyStyle(0, {fillStyle: this.noteheadColor});
        }

        this.activeVexflowNote = vfn;
        return vfn;
    };

    /* ------ TODO: Unpitched ------ */
	
	
	/* ------ Rest ------ */

	/**
	 * @class Rest
	 * @constructor
	 * @extends GeneralNote
	 * @param {number} ql - quarter length
	 */
	note.Rest = function (ql) {
		note.GeneralNote.call(this, ql);
		this.classes.push('Rest');
        this.isNote = false; // for speed
        this.isRest = true; // for speed		
		this.name = 'rest'; // for note compatibility
	    
	};

	note.Rest.prototype = new note.GeneralNote();
	note.Rest.prototype.constructor = note.Rest;
	note.Rest.prototype.vexflowNote = function () {
        var keyLine = 'b/4';
        if (this.duration.type == 'whole') {
            keyLine = 'd/5';
        }
        var vfn = new Vex.Flow.StaveNote({keys: [keyLine], 
                                        duration: this.duration.vexflowDuration + 'r'});
        if (this.duration.dots == 1) {
            vfn.addDotToAll();
        }
        this.activeVexflowNote = vfn;
        return vfn;
    };
    /* ------ SpacerRest ------ */
	
	
	note.tests = function () {
	    test( "music21.note.Note", function() {
	        var n = new note.Note("D#5");
	        equal ( n.pitch.name, "D#", "Pitch Name set to D#");
	        equal ( n.pitch.step, "D",  "Pitch Step set to D");
	        equal ( n.pitch.octave, 5, "Pitch octave set to 5");
	    });
	};
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.note = note;
	}	
	return note;
});
