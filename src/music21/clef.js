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
define(['music21/base','music21/pitch'], function(base, pitch) {
	var clef = {};
	/*  music21.Clef
	must be defined before Stream since Stream subclasses call new music21.Clef...
	 */
	// TODO: Fix to newest Vexflow format...
	clef.firstLines = {
            'treble': 31, 
            'soprano': 29,
            'mezzo-soprano': 27,
            'alto': 25,
            'tenor': 23,
            'bass': 19,
            'percussion': 31,
            };
	clef.Clef = function (name, octaveShift) {
		base.Music21Object.call(this);
		this.classes.push('Clef');
	    if (name != undefined) {
	        name = name.toLowerCase();
	        this.name = name;
			this.firstLine = clef.firstLines[name];
			this.firstLineTrebleOffset = clef.firstLines['treble'] - this.firstLine;
	    } else {
	    	this.name = undefined;
	    	this.firstLine = clef.firstLines['treble'];
	    	this.firstLineTrebleOffset = 0;
	    }
	    if (octaveShift === undefined) {
	        this.octaveShift = 0;
	    } else {
	        this.octaveShift = octaveShift;
	        this.firstLine = this.firstLine + (7 * octaveShift);
	        this.firstLineTrebleOffset = this.firstLineTrebleOffset - (7 * octaveShift);
	    }
	};

	clef.Clef.prototype = new base.Music21Object();
	clef.Clef.prototype.constructor = clef.Clef;
    clef.Clef.prototype.convertPitchToTreble = function (p) {
        // returns a new pitch object if the clef name is not Treble
        // designed so it would look the same as it would in treble clef.
        // for instance, bass-clef 2nd-space C# becomes treble clef 2nd-space A#
        // used for Vex.Flow which requires all pitches to be input as if they
        // are in treble clef.
        if (this.firstLine == undefined) {
            console.log('no first line defined for clef', this.name, this);
            return p; // error
        }
        var firstLineDifference = this.firstLineTrebleOffset;
        var tempPitch = new pitch.Pitch(p.step);
        tempPitch.octave = p.octave;
        tempPitch.diatonicNoteNum += firstLineDifference;
        tempPitch.accidental = p.accidental;
        return tempPitch;
    };

	clef.TrebleClef = function () {
        clef.Clef.call(this, 'treble');
        this.classes.push('TrebleClef');
	};
    clef.TrebleClef.prototype = new clef.Clef();
    clef.TrebleClef.prototype.constructor = clef.TrebleClef;

    clef.Treble8vbClef = function () {
        // temporary Vex.Flow hack -- no 8vb setting; use Bass instead.
        // Fixed in cuthbert Vex.Flow -- pull #235
        clef.Clef.call(this, 'treble', -1);
        this.classes.push('Treble8vbClef');
    };
    clef.Treble8vbClef.prototype = new clef.Clef();
    clef.Treble8vbClef.prototype.constructor = clef.Treble8vbClef;

    clef.Treble8vaClef = function () {
        // Fixed in cuthbert Vex.Flow -- pull #235
        clef.Clef.call(this, 'treble', 1);
        this.classes.push('Treble8vaClef');
    };
    clef.Treble8vaClef.prototype = new clef.Clef();
    clef.Treble8vaClef.prototype.constructor = clef.Treble8vaClef;

    clef.BassClef = function () {
        clef.Clef.call(this, 'bass');
        this.classes.push('BassClef');
    };
    clef.BassClef.prototype = new clef.Clef();
    clef.BassClef.prototype.constructor = clef.BassClef;

    clef.AltoClef = function () {
        clef.Clef.call(this, 'alto');
        this.classes.push('AltoClef');
    };
    clef.AltoClef.prototype = new clef.Clef();
    clef.AltoClef.prototype.constructor = clef.AltoClef;

    clef.TenorClef = function () {
        clef.Clef.call(this, 'tenor');
        this.classes.push('TenorClef');
    };
    clef.TenorClef.prototype = new clef.Clef();
    clef.TenorClef.prototype.constructor = clef.TenorClef;

    clef.SopranoClef = function () {
        clef.Clef.call(this, 'soprano');
        this.classes.push('SopranoClef');
    };
    clef.SopranoClef.prototype = new clef.Clef();
    clef.SopranoClef.prototype.constructor = clef.SopranoClef;
    
    clef.MezzoSopranoClef = function () {
        clef.Clef.call(this, 'mezzo-soprano');
        this.classes.push('MezzoSopranoClef');
    };
    clef.MezzoSopranoClef.prototype = new clef.Clef();
    clef.MezzoSopranoClef.prototype.constructor = clef.MezzoSopranoClef;

    clef.PercussionClef = function () {
        clef.Clef.call(this, 'percussion');
        this.classes.push('PercussionClef');
    };
    clef.PercussionClef.prototype = new clef.Clef();
    clef.PercussionClef.prototype.constructor = clef.PercussionClef;

    
    clef.bestClef = function(st) {
        //console.log('calling flat on stream: ', st.elements.length, st.classes[st.classes.length - 1]);
        var stFlat = st.flat;
        var totalNotes = 0;
        var totalPitch = 0.0;
        for (var i = 0; i < stFlat.length; i++) {
            var el = stFlat.get(i);
            if (el.pitch != undefined) {
                totalNotes += 1;
                totalPitch += el.pitch.diatonicNoteNum;
            } else if (el.pitches != undefined) {
                for (var j = 0; j < el.pitches.length; j++) {
                    totalNotes += 1;
                    totalPitch += el.pitches[j].diatonicNoteNum;
                }
            }      
        }
        var averageHeight;
        if (totalNotes == 0) {
            averageHeight = 29;
        } else {
            averageHeight = totalPitch / totalNotes;            
        }
        //console.log('bestClef: average height', averageHeight);
        if (averageHeight > 28) {    // 29 = c4
            return new clef.TrebleClef();
        } else {
            return new clef.BassClef();
        }
    };
    
    // tests
    clef.tests = function () {
        test ( "music21.clef.Clef" , function() {
            var c1 = new music21.clef.Clef();            
            equal (c1.isClassOrSubclass('Clef'), true, 'clef is a Clef');
            
            var ac = new music21.clef.AltoClef();
            equal (ac.firstLine, 25, 'first line set');
            var n = new music21.note.Note('C#4');
            n.setStemDirectionFromClef(ac);
            equal (n.stemDirection, 'down', 'stem direction set');
            n.pitch.diatonicNoteNum -= 1;
            n.setStemDirectionFromClef(ac);
            equal (n.stemDirection, 'up', 'stem direction set');
            n.pitch.diatonicNoteNum += 1;
            var p2 = ac.convertPitchToTreble(n.pitch);
            equal (p2.nameWithOctave, 'B#4', 'converted to treble');

        });
        test ( "music21.clef.Clef 8va" , function() {
            var ac = new music21.clef.Treble8vaClef();
            equal (ac.firstLine, 38, 'first line set');
            var n = new music21.note.Note('C#5');
            n.setStemDirectionFromClef(ac);
            equal (n.stemDirection, 'up', 'stem direction set');
            var p2 = ac.convertPitchToTreble(n.pitch);
            equal (p2.nameWithOctave, 'C#4', 'converted to treble');
            var s = new music21.stream.Stream();
            s.clef = ac;
            s.append(n);
            s.appendNewCanvas($("body"));
        });
    };
    
	// end of define
	if (typeof(music21) != "undefined") {
		music21.clef = clef;
	}		
	return clef;
});