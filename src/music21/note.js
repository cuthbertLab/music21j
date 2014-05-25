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


	/* Notes and rests etc... */

	note.GeneralNote = function () {
		music21.base.Music21Object.call(this);
		this.classes.push('GeneralNote');
	    this.activeVexflowNote = undefined;
        this.expressions = [];
		
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

	note.NotRest = function () {
		note.GeneralNote.call(this);
		this.classes.push('NotRest');
		this.articulations = [];
	    this.stemDirection = undefined; // ['up','down','noStem', undefined] -- 'double' not supported
	};

	note.NotRest.prototype = new note.GeneralNote();
	note.NotRest.prototype.constructor = note.NotRest;


	note.Note = function (nn, ql) {
		note.NotRest.call(this);
		this.classes.push('Note');
		
	    this.noteheadColor = undefined;
		
	    this.pitch = new music21.pitch.Pitch(nn);
		
		if (ql != undefined) {
		    this.duration.quarterLength = ql;
	    }
	    
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
	        var vfn = new music21.Vex.Flow.StaveNote({keys: [this.pitch.vexflowName(clefName)], 
										  duration: vfd});
	        this.vexflowAccidentalsAndDisplay(vfn); // clean up stuff...
	        if (this.pitch.accidental != undefined) {
				if (this.pitch.accidental.vexflowModifier != 'n' && this.pitch.accidental.displayStatus != false) {
					vfn.addAccidental(0, new music21.Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));
				} else if (this.pitch.accidental.displayType == 'always' || this.pitch.accidental.displayStatus == true) {
					vfn.addAccidental(0, new music21.Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));			
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


	note.Rest = function (ql) {
		note.GeneralNote.call(this);
		this.classes.push('Rest');
		if (ql != undefined) {
		    this.duration.quarterLength = ql;
	    }
	    
	    this.vexflowNote = function () {
	    	var keyLine = 'b/4';
	    	if (this.duration.type == 'whole') {
	    		keyLine = 'd/5';
	    	}
	        var vfn = new music21.Vex.Flow.StaveNote({keys: [keyLine], 
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
