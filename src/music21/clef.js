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
define(['music21/base',], function(require) {
	var clef = {};
	/*  music21.Clef
	must be defined before Stream since Stream subclasses call new music21.Clef...
	 */

	clef.Clef = function (name) {
		music21.base.Music21Object.call(this);
		this.classes.push('Clef');
	    var firstLines = {
	            'treble': 31, 
	            'soprano': 29,
	            'mezzo-soprano': 27,
	            'alto': 25,
	            'tenor': 23,
	            'bass': 19,
	            'percussion': 31,
	            };
	    if (name != undefined) {
	        name = name.toLowerCase();
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
	
	
	clef.Clef.prototype = new music21.base.Music21Object();
	clef.Clef.prototype.constructor = clef.Clef;

	clef.TrebleClef = function () {
        music21.clef.Clef.call(this, 'treble');
        this.classes.push('TrebleClef');
	};
    clef.TrebleClef.prototype = new clef.Clef();
    clef.TrebleClef.prototype.constructor = clef.TrebleClef;

    clef.Treble8vbClef = function () {
        // temporary Vex.Flow hack -- no 8vb setting; use Bass instead.
        music21.clef.Clef.call(this, 'bass');
        this.classes.push('Treble8vbClef');
    };
    clef.Treble8vbClef.prototype = new clef.Clef();
    clef.Treble8vbClef.prototype.constructor = clef.Treble8vbClef;

    clef.BassClef = function () {
        music21.clef.Clef.call(this, 'bass');
        this.classes.push('BassClef');
    };
    clef.BassClef.prototype = new clef.Clef();
    clef.BassClef.prototype.constructor = clef.BassClef;

    clef.AltoClef = function () {
        music21.clef.Clef.call(this, 'alto');
        this.classes.push('AltoClef');
    };
    clef.AltoClef.prototype = new clef.Clef();
    clef.AltoClef.prototype.constructor = clef.AltoClef;

    clef.TenorClef = function () {
        music21.clef.Clef.call(this, 'tenor');
        this.classes.push('TenorClef');
    };
    clef.TenorClef.prototype = new clef.Clef();
    clef.TenorClef.prototype.constructor = clef.TenorClef;

    clef.SopranoClef = function () {
        music21.clef.Clef.call(this, 'soprano');
        this.classes.push('SopranoClef');
    };
    clef.SopranoClef.prototype = new clef.Clef();
    clef.SopranoClef.prototype.constructor = clef.SopranoClef;
    
    clef.MezzoSopranoClef = function () {
        music21.clef.Clef.call(this, 'mezzo-soprano');
        this.classes.push('MezzoSopranoClef');
    };
    clef.MezzoSopranoClef.prototype = new clef.Clef();
    clef.MezzoSopranoClef.prototype.constructor = clef.MezzoSopranoClef;

    clef.PercussionClef = function () {
        music21.clef.Clef.call(this, 'percussion');
        this.classes.push('PercussionClef');
    };
    clef.PercussionClef.prototype = new clef.Clef();
    clef.PercussionClef.prototype.constructor = clef.PercussionClef;

	// end of define
	if (typeof(music21) != "undefined") {
		music21.clef = clef;
	}		
	return clef;
});