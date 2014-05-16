/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/clef -- Clef objects
 * 
 * note: only defines a single Clef object for now
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define(['music21/baseObjects',], function(require) {
	var clef = {};
	/*  music21.Clef
	must be defined before Stream since Stream subclasses call new music21.Clef...
	 */

	clef.Clef = function (name) {
		music21.baseObjects.Music21Object.call(this);
		this.classes.push('Clef');
	    var firstLines = {'treble': 31, 'bass': 19};
	    if (name != undefined) {
	        this.name = name;
			this.firstLine = firstLines[name];
	    } else {
	    	this.name = undefined;
	    	this.firstLine = firstLines['treble'];
	    }
	    
	    this.setStemDirection = function (note) {
	        if (note.stemDirection != undefined) {
	        	return;
	        }
	        if (note.pitch != undefined) {
	            if (note.pitch.diatonicNoteNum != undefined) {
	                if (note.pitch.diatonicNoteNum < this.firstLine + 4) {
	                    note.stemDirection = 'up';
	                } else {
	                    note.stemDirection = 'down';
	                }
	            }
	        }
	    };
	};
	
	
	clef.Clef.prototype = new music21.baseObjects.Music21Object();
	clef.Clef.prototype.constructor = clef.Clef;

	// end of define
	if (typeof(music21) != "undefined") {
		music21.clef = clef;
	}		
	return clef;
});