/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/note -- Note, Rest, NotRest, GeneralNote
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */


define(['music21/base', 'music21/pitch'], function(require) {

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

	note.GeneralNote = function (ql) {
		music21.base.Music21Object.call(this);
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
        
		this.vexflowAccidentalsAndDisplay = function (vfn) {
	        if (this.duration.dots == 1) {
	            vfn.addDotToAll();
	        }
	        vfn.setStemDirection(this.stemDirection == 'down' ? 
									Vex.Flow.StaveNote.STEM_DOWN : 
									Vex.Flow.StaveNote.STEM_UP);
			if (this.stemDirection == 'noStem') {
				vfn.hasStem = function() { return false; }; // need to override... 
				//vfn.render_options.stem_height = 0;
			}
		};
	};

	note.GeneralNote.prototype = new music21.base.Music21Object();
	note.GeneralNote.prototype.constructor = note.GeneralNote;

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

	note.Note = function (nn, ql) {
		note.NotRest.call(this, ql);
		this.classes.push('Note');
		this.isNote = true; // for speed
		this.isRest = false; // for speed
	    this.pitch = new music21.pitch.Pitch(nn);
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
                get: function() {return this.pitch.octave;},
                set: function(nn) { this.pitch.octave = nn;},
                enumerable: true,
            },
            // no microtone, pitchclass, pitchClassString
        });
        
        /* TODO: transpose, fullName */
        
	    this.vexflowNote = function (clefName) {
	    	if (music21.debug) {
	        	console.log("Pitch name for clef " + 
	        				clefName + " ( " + this.pitch.name + " ) : " + 
	        				this.pitch.vexflowName(clefName));
			}
	    	if (this.duration === undefined) {
	    	    //console.log(this);
	    	    return undefined;
	    	}
	    	var vfd = this.duration.vexflowDuration;
	    	if (vfd === undefined) {
	    	    return undefined;
	    	}
	        var vfn = new Vex.Flow.StaveNote({keys: [this.pitch.vexflowName(clefName)], 
										  duration: vfd});
	        this.vexflowAccidentalsAndDisplay(vfn); // clean up stuff...
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
	};

	note.Note.prototype = new note.NotRest();
	note.Note.prototype.constructor = note.Note;

    /* ------ TODO: Unpitched ------ */
	
	
	/* ------ Rest ------ */

	note.Rest = function (ql) {
		note.GeneralNote.call(this, ql);
		this.classes.push('Rest');
        this.isNote = false; // for speed
        this.isRest = true; // for speed		
		this.name = 'rest'; // for note compatibility
	    
	    this.vexflowNote = function () {
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
	};

	note.Rest.prototype = new note.GeneralNote();
	note.Rest.prototype.constructor = note.Rest;

    /* ------ SpacerRest ------ */
	
	
	note.tests = function () {
	    test( "music21.note.Note", function() {
	        var n = new music21.note.Note("D#5");
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
