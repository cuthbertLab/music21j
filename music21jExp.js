/*
music21j -- Javascript reimplementation of Core music21 features.  
See http://web.mit.edu/music21/ for more details.

Copyright (c) 2013, Michael Scott Cuthbert and cuthbertLab

This version is released in non-minimized form under LGPL or proprietary licenses (your choice; the
former is Free; the latter costs money, but lets you use minimizers, etc. to optimize
web loading).  The license is still under discussion; please contact cuthbert@mit.edu for
more information.

The plan is to implement all core music21 features as Javascript and to expose
more sophisticated features via server-side connections to remote servers running the
python music21 (music21p).

All interfaces are alpha and may change radically from day to day and release to release.
Do not use this in production code yet.

2013-10-04 -- v.0.1.alpha 

*/

/* jQuery extensions
 * 
 */
/**
 * Logic for copying events from one jQuery object to another.
 *
 * @private 
 * @name jQuery.event.copy
 * @param jQuery|String|DOM Element jQuery object to copy events from. Only uses the first matched element.
 * @param jQuery|String|DOM Element jQuery object to copy events to. Copies to all matched elements.
 * @type undefined
 * @cat Plugins/copyEvents
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * @author Yannick Albert (mail@yckart.com || http://yckart.com)
 */
if (typeof(jQuery) != "undefined") {
	jQuery.event.copy = function (from, to) {
	    from = from.jquery ? from : jQuery(from);
	    to = to.jquery ? to : jQuery(to);
	
	    var events = from[0].events || jQuery.data(from[0], "events") || jQuery._data(from[0], "events");
	    if (!from.length || !to.length || !events) return;
	
	    return to.each(function () {
	        for (var type in events)
	        for (var handler in events[type])
	        jQuery.event.add(this, type, events[type][handler], events[type][handler].data);
	    });
	};
}

if (typeof (Music21) == "undefined") {
	var Music21 = {};
}

Music21.debug = false;

var Music21DurationArray = ['breve','whole','half','quarter','eighth','16th','32nd','64th','128th'];
var VexflowDurationArray = [undefined, 'w', 'h', 'q', '8', '16', '32', undefined, undefined];
Music21._inClass = function (testClass) {
	if ($.inArray(testClass, this.classes) != -1) {
		return true;
	} else {
		return false;
	}
};

Music21.Duration = function (ql) {
    this.classes = ['Duration'];
    this._quarterLength = 1.0;
    this._dots = 0;
	this._powerOfTwo = undefined;
	this._durationNumber = undefined;
	this._type = 'quarter';

	this.inClass = Music21._inClass;

    this._findDots = function (ql) {
        var undottedQL = Math.pow(2, this._powerOfTwo);
    	// alert(undottedQL * 1.5 + " " + ql)
        if (Math.abs(undottedQL * 1.5 - ql) < 0.0001) {
           return 1;
        } else if (Math.abs(undottedQL * 1.75 - ql) < 0.0001) {
           return 2;
        } else {
           return 0;
        }
    };

    Object.defineProperties(this, {
    	'dots': { 
    		get: function () { 
		       		return this._dots;
    			},
    		set: function (numDots) {
    			var undottedQL = this._powerOfTwo;
    			var dottedMultiplier = 1 + ( (Math.pow(2, numDots) - 1) / Math.pow(2, numDots) );
    			var newQL = undottedQL * dottedMultiplier;
    			this._dots = numDots;
    			this._quarterLength = newQL;
    		}
    	},
    	'quarterLength': {
			get: function () {
				return this._quarterLength;
			},
			set: function (ql) {
				if (ql == undefined) {
					ql = 1.0;
				}
				this._quarterLength = ql;
				this._powerOfTwo = Math.floor(Math.log(ql+.00001)/Math.log(2));
				this._durationNumber = 3 - this._powerOfTwo;
				this._type = Music21DurationArray[this._durationNumber];
				//alert(this._findDots);
				this._dots = this._findDots(ql);	
			}
		},
		'type': {
			get: function () {
				return this._type;
			},
			set: function (typeIn) {
				var typeNumber = $.inArray(typeIn, Music21DurationArray);
				if (typeNumber == -1) {
					console.log('invalid type ' + typeIn);
					return;
				}
				this._durationNumber = typeNumber;
				this._powerOfTwo = Math.pow(2, 3 - typeNumber);
				this._type = typeIn;
				var dottedMultiplier = 1 + ( (Math.pow(2, this.dots) - 1) / Math.pow(2, this.dots) );
				this._quarterLength = this._powerOfTwo * dottedMultiplier;
			}
		},
		'vexflowDuration': {
			get: function() {
				var vd = VexflowDurationArray[this._durationNumber];
				if (this._dots == 1) {
					vd += "d"; // vexflow does not handle double dots
				}
				return vd;
			}
		}
	});
	
    if (typeof(ql) == 'string') {
    	this.type = ql;
    } else {
    	this.quarterLength = ql;
    }
    //alert(ql + " " + this.type + " " + this.dots);
};

/*   main class   from base.py   */

Music21.Music21Object = function () {
	this.classes = ['Music21Object'];
	this.classSortOrder = 20; // default;
	this.priority = 0; // default;
	this.parent = undefined;
	this.isStream = false;
	// this.isSpanner = false; // add when supported,
	// this.isVariant = false; // add when supported, if ever...
	this.duration = new Music21.Duration();
	this.groups = []; // custom object in m21p
	// this.sites, this.activeSites, this.offset -- not yet...
	// beat, measureNumber, etc.
	// lots to do...
	this.inClass = Music21._inClass;
};

/*  pitch based objects; from pitch.py */

Music21.Accidental = function (accName) {
	this.classes = ['Accidental'];

	this.alter = 0.0;
	this.modifier = undefined;
	this.vexflowModifier = "n";
	this.displayType = "normal";
	this.displayStatus = undefined; // true, false, undefined
	this.inClass = Music21._inClass;
	
	this.set = function (accName) {
		if (accName.toLowerCase != undefined) {
	    	accName = accName.toLowerCase();
	    }
	    if (accName == 'natural' || accName == 'n' || accName == 0 || accName == undefined) {
	        this.name = 'natural';
	        this.alter = 0.0;
	        this.modifier = "";
	        this.vexflowModifier = "n";
	    } else if (accName == 'sharp' || accName == '#' || accName == 1) {
	        this.name = 'sharp';
	        this.alter = 1.0;
	        this.modifier = "#";
	        this.vexflowModifier = "#";
	    } else if (accName == 'flat' || accName == '-' || accName == -1) {
	        this.name = 'flat';
	        this.alter = -1.0;
	        this.modifier = "-";
	        this.vexflowModifier = "b";
	    } else if (accName == 'double-flat' || accName == '--' || accName == -2) {
	        this.name = 'double-flat';
	        this.alter = -2.0;
	        this.modifier = "--";
	        this.vexflowModifier = "bb";
	    } else if (accName == 'double-sharp' || accName == '##' || accName == 2) {
	        this.name = 'double-sharp';
	        this.alter = 2.0;
	        this.modifier = "##";
	        this.vexflowModifier = "##";
	    } else if (accName == 'triple-flat' || accName == '---' || accName == -3) {
	        this.name = 'triple-flat';
	        this.alter = -3.0;
	        this.modifier = "---";
	        this.vexflowModifier = "bbb";
	    } else if (accName == 'triple-sharp' || accName == '###' || accName == 3) {
	        this.name = 'triple-sharp';
	        this.alter = 3.0;
	        this.modifier = "###";
	        this.vexflowModifier = "###";
	    }
	};
	this.set(accName);
};

/* a Music21Object in m21p; the overhead is too high here to follow ... */

Music21.Pitch = function (pn) {
    if (pn == undefined) {
    	pn = "C";
    }
    this.step = 'C';
    this.octave = 4;
	this.classes = ['Pitch'];
	this.inClass = Music21._inClass;
    
    Object.defineProperties(this, {
    	'name': {
    		get: function () {
				if (this.accidental == undefined) {
					return this.step;
				} else {
					return this.step + this.accidental.modifier;
				}
			},
    		set: function(nn) {
				this.step = nn.slice(0,1).toUpperCase();
				var tempAccidental = nn.slice(1);
				if (tempAccidental != undefined) {
					this.accidental = new Music21.Accidental(tempAccidental);
				} else {
					this.accidental = undefined;
				}
			}
		},
		'nameWithOctave': {
			get: function () {
				return this.name + this.octave.toString();
			}
		},
    	'diatonicNoteNum': { 
    		get: function () { 
		    	var nameToSteps = {'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6};
       			return (this.octave * 7) + nameToSteps[this.step] + 1;
   			},
    		set: function (newDNN) {
   				var stepsToName = ['C','D','E','F','G','A','B'];
   				newDNN = newDNN - 1; // makes math easier
   				this.octave = Math.floor(newDNN / 7);
   				this.step = stepsToName[newDNN % 7];
   			}
   		},    		
    	'midi': { 
    		get: function () { 
    			return this.ps;
    		}
    	},
    	'ps': {
    		get: function () {
				var nameToMidi = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
				var accidentalAlter = 0;
				if (this.accidental != undefined) {
					accidentalAlter = parseInt(this.accidental.alter);
				}
				return (this.octave + 1) * 12 + nameToMidi[this.step] + accidentalAlter;
			},
    		set: function (ps) {
    			var midiToName = ['C','C#','D','E-','E','F','F#','G','A-','A','B-','B'];
    			this.name = midiToName[ps % 12];
    			this.octave = Math.floor(ps / 12) - 1;
    		}
    	}
    });
    var storedOctave = pn.match(/\d+/);
    if (storedOctave != undefined) {
    	pn = pn.replace(/\d+/, "");
    	this.octave = parseInt(storedOctave);
    }
	this.name = pn;
    	
    this.vexflowName = function (clefName) {
    	//alert(this.octave + " " + clefName);
	    var bassToTrebleMapping = {'E': 'C', 'F': 'D', 'G': 'E', 'A': 'F', 'B': 'G', 'C': 'A', 'D': 'B'};
    	var accidentalType = 'n';
    	if (this.accidental != undefined) {
          	accidentalType = this.accidental.vexflowModifier;
    	}
    	
    	
    	if (clefName == 'treble' || clefName == undefined) {
            var outName = this.step + accidentalType + '/' + this.octave; 
            return outName;
        } else if (clefName == 'bass') {
        	var tempPn = bassToTrebleMapping[this.step];
            var tempPitch = new Music21.Pitch(tempPn);
            tempPitch.octave = this.octave;
            if (this.step == 'C' || this.step == 'D') {
                tempPitch.octave += 1;
            } else {
                tempPitch.octave += 2;
            }
            return tempPitch.step + accidentalType + '/' + tempPitch.octave;
        }
    };
};

/* Notes and rests etc... */

Music21.GeneralNote = function () {
	Music21.Music21Object.call(this);
	this.classes.push('GeneralNote');
    this.activeVexflowNote = undefined;    
	
	this.vexflowAccidentalsAndDisplay = function (vfn) {
        if (this.duration.dots == 1) {
            vfn.addDotToAll();
        }
        vfn.setStemDirection(this.stemDirection == 'down' ? 
								Vex.Flow.StaveNote.STEM_DOWN : 
								Vex.Flow.StaveNote.STEM_UP);
		if (this.stemDirection == 'noStem') {
			vfn.render_options.stem_height = 0;
		}		
	};
};

Music21.GeneralNote.prototype = new Music21.Music21Object();
Music21.GeneralNote.prototype.constructor = Music21.GeneralNote;

Music21.NotRest = function () {
	Music21.GeneralNote.call(this);
	this.classes.push('NotRest');
    this.stemDirection = undefined; // ['up','down','noStem', undefined] -- 'double' not supported
};

Music21.NotRest.prototype = new Music21.GeneralNote();
Music21.NotRest.prototype.constructor = Music21.NotRest;


Music21.Note = function (nn, ql) {
	Music21.NotRest.call(this);
	this.classes.push('Note');
    
    this.pitch = new Music21.Pitch(nn);
	
	if (ql != undefined) {
	    this.duration.quarterLength = ql;
    }
    
    this.vexflowNote = function (clefName) {
    	if (Music21.debug) {
        	console.log("Pitch name for clef " + 
        				clefName + " ( " + this.pitch.name + " ) : " + 
        				this.pitch.vexflowName(clefName));
		}
        var vfn = new Vex.Flow.StaveNote({keys: [this.pitch.vexflowName(clefName)], 
									  duration: this.duration.vexflowDuration});
        this.vexflowAccidentalsAndDisplay(vfn); // clean up stuff...
        if (this.pitch.accidental != undefined) {
			if (this.pitch.accidental.vexflowModifier != 'n' && this.pitch.accidental.displayStatus != false) {
				vfn.addAccidental(0, new Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));
			} else if (this.pitch.accidental.displayType == 'always' || this.pitch.accidental.displayStatus == true) {
				vfn.addAccidental(0, new Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));			
			}
		}

        this.activeVexflowNote = vfn;
	    return vfn;
    };
};

Music21.Note.prototype = new Music21.NotRest();
Music21.Note.prototype.constructor = Music21.Note;


Music21.Rest = function (ql) {
	Music21.GeneralNote.call(this);
	this.classes.push('Rest');
	if (ql != undefined) {
	    this.duration.quarterLength = ql;
    }
    
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

Music21.Rest.prototype = new Music21.GeneralNote();
Music21.Rest.prototype.constructor = Music21.Rest;

Music21.Chord = function (noteArray) {
	if (typeof(noteArray) == 'undefined') {
		noteArray = [];
	}
	Music21.NotRest.call(this);
	this.classes.push('Chord');
    this._noteArray = [];
	
	this.addNoteFromArray = function (noteObj, index, fullArray ) {
		if (typeof(noteObj) == 'string') {	
			noteObj = new Music21.Note(noteObj);
		} else if (noteObj.inClass('Pitch')) {
			var pitchObj = noteObj;
			var noteObj2 = new Music21.Note();
			noteObj2.pitch = pitchObj;
			noteObj = noteObj2;
		}
		this._noteArray.push(noteObj);
	};
	this.removeDuplicatePitches = function () {
		var stepsFound = [];
		var nonDuplicatingPitches = [];
		var pitches = this.pitches;
		for (var i = 0; i < pitches.length; i++) {
			var p = pitches[i];
			if ($.inArray(p.step, stepsFound) == -1) {
				stepsFound.push(p.step);
				nonDuplicatingPitches.push(p);
			}
		}
		var closedChord = new Music21.Chord(nonDuplicatingPitches);
		return closedChord;
	};
	
	this.root = function () {
		var closedChord = this.removeDuplicatePitches();
		/* var chordBass = closedChord.bass(); */
		var closedPitches = closedChord.pitches;
		if (closedPitches.length == 0) {
			throw "No notes in Chord!";
		} else if (closedPitches.length == 1) {
			return this.pitches[0];
		}
		var indexOfPitchesWithPerfectlyStackedThirds = [];
		var testSteps = [3, 5, 7, 2, 4, 6];
		for (var i = 0; i < closedPitches.length; i ++) {
			var p = closedPitches[i];
			var currentListOfThirds = [];
			for (var tsIndex = 0; tsIndex < testSteps.length; tsIndex++ ) {
				var chordStepPitch = closedChord.getChordStep(testSteps[tsIndex], p);
				if (chordStepPitch != undefined) {
					//console.log(p.name + " " + testSteps[tsIndex].toString() + " " + chordStepPitch.name);
					currentListOfThirds.push(true);
				} else {
					currentListOfThirds.push(false);
				}
			}
			//console.log(currentListOfThirds);
			hasFalse = false;
			for (var j = 0; j < closedPitches.length - 1; j++) {
				if (currentListOfThirds[j] == false) {
					hasFalse = true;
				}
			}
			if (hasFalse == false) {
				indexOfPitchesWithPerfectlyStackedThirds.push(i);
				return closedChord.pitches[i]; // should do more, but fine...
				// should test rootedness function, etc. 13ths. etc.
			}
			
		}
	};
	this.getChordStep = function (chordStep, testRoot) {
		if (testRoot == undefined) {
			testRoot = this.root();
		}
		if (chordStep >= 8) {
			chordStep = chordStep % 7;
		}
		var thisPitches = this.pitches;
		var testRootDNN = testRoot.diatonicNoteNum;
		for (var i = 0; i < thisPitches.length; i++) {
			var thisPitch = thisPitches[i];
			var thisInterval = (thisPitch.diatonicNoteNum - testRootDNN + 1) % 7; //fast cludge
			if (thisInterval <= 0) {
				thisInterval = (thisInterval + 7);
			}
			if (thisInterval == chordStep) {
				return thisPitch;
			}
		}
		return undefined;
	};
	this.semitonesFromChordStep = function (chordStep, testRoot) {
		if (testRoot == undefined) {
			testRoot = this.root();
		}
		var tempChordStep = this.getChordStep(chordStep, testRoot);
		if (tempChordStep == undefined) {
			return undefined;
		} else {
			var semitones = (tempChordStep.ps - testRoot.ps) % 12;
			if (semitones < 0) { semitones += 12; }
			return semitones;
		}
	};
	this.bass = function () {
		var lowest = undefined;
		var pitches = this.pitches;
		for (var i = 0; i< pitches.length; i++) {
			var p = pitches[i];
			if (lowest == undefined) {
				lowest = p;
			} else {
				if (p.ps < lowest.ps) {
					lowest = p;
				}
			}
		}
		return lowest;
	};
	this.cardinality = function() {
		var uniqueChord = this.removeDuplicatePitches();
		return uniqueChord.pitches.length;
	};
	this.isMajorTriad = function() {
		if (this.cardinality() != 3) {
			return false;
		}		
		var thirdST = this.semitonesFromChordStep(3);
		var fifthST = this.semitonesFromChordStep(5);
		if (thirdST == 4 && fifthST == 7) {
			return true;
		} else {
			return false;
		}
	};
	this.isMinorTriad = function() {
		if (this.cardinality() != 3) {
			return false;
		}
		var thirdST = this.semitonesFromChordStep(3);
		var fifthST = this.semitonesFromChordStep(5);
		if (thirdST == 3 && fifthST == 7) {
			return true;
		} else {
			return false;
		}
	};
	this.inversion = function() {
		var bass = this.bass();
		var root = this.root();
		var chordStepsToInversions = [1, 6, 4, 2, 7, 5, 3];
		for (var i = 0; i < chordStepsToInversions.length; i++) {
			var testNote = this.getChordStep(chordStepsToInversions[i], bass);
			if (testNote != undefined && testNote.name == root.name) {
				return i;
			}
		}
		return undefined;
	};

	
    Object.defineProperties(this, {
    	'pitches': {
    		get: function () {
    			var tempPitches = [];
    			for (var i = 0; i < this._noteArray.length; i++) {
    				tempPitches.push(this._noteArray[i].pitch);
    			}
    			return tempPitches;
    		},
    		set: function (tempPitches) {
    			this._noteArray = [];
    			for (var i = 0; i < tempPitches.length; i++ ) {
    				var addNote;
    				if (typeof(tempPitches[i]) == 'string') {
    					addNote = new Music21.Note(tempPitches[i]);
    				} else if (tempPitches[i].inClass('Pitch')) {
    					addNote = new Music21.Note();
    					addNote.pitch = tempPitches[i];
    				} else if (tempPitches[i].inClass('Note')) {
    					addNote = tempPitches[i];
    				} else {
    					throw("Cannot add pitch from " + tempPitches[i]);
    				}
    				this._noteArray.push(addNote);
    			}
    			return this._noteArray;
    		}
    	}
    
    });	
    this.vexflowNote = function (clefName) {
        var pitchKeys = [];
        for (var i = 0; i < this._noteArray.length; i++) {
        	pitchKeys.push(this._noteArray[i].pitch.vexflowName(clefName));	
        }
        var vfn = new Vex.Flow.StaveNote({keys: pitchKeys, 
									  duration: this.duration.vexflowDuration});
        this.vexflowAccidentalsAndDisplay(vfn); // clean up stuff...
        for (var i = 0; i < this._noteArray.length; i++) {
        	var tn = this._noteArray[i];
	        if (tn.pitch.accidental != undefined) {
				if (tn.pitch.accidental.vexflowModifier != 'n' && tn.pitch.accidental.displayStatus != false) {
					vfn.addAccidental(i, new Vex.Flow.Accidental(tn.pitch.accidental.vexflowModifier));
				} else if (tn.pitch.accidental.displayType == 'always' || tn.pitch.accidental.displayStatus == true) {
					vfn.addAccidental(i, new Vex.Flow.Accidental(tn.pitch.accidental.vexflowModifier));			
				}
			}
        }
		this.activeVexflowNote = vfn;
	    return vfn;
    };
	
	noteArray.forEach( this.addNoteFromArray, this );

};

Music21.Chord.prototype = new Music21.NotRest();
Music21.Chord.prototype.constructor = Music21.Chord;

Music21._romanToNumber = [undefined, 'i','ii','iii','iv','v','vi','vii'];

Music21._chordDefinitions = {
		'major': ['M3', 'm3'],
		'minor': ['m3', 'M3'],
		'diminished': ['m3', 'm3'],
		'augmented': ['M3', 'M3'],
		'major-seventh': ['M3', 'm3', 'M3'],
		'dominant-seventh': ['M3','m3','m3'],
		'minor-seventh': ['m3', 'M3', 'm3'],
		'diminished-seventh': ['m3','m3','m3'],
		'half-diminished-seventh': ['m3','m3','M3'],
};

Music21.RomanNumeral = function (figure, keyStr) {
	/*
	 * current limitations:
	 * 
	 * no inversions
	 * no numeric figures except 7
	 * no d7 = dominant 7
	 * no frontAlterationAccidentals
	 * no secondary dominants
	 * no Aug6th chords
	 * 
	 */
	this.figure = figure;
	this._scale = undefined;
	Music21.Chord.call(this);
	
    Object.defineProperties(this, {
    	'scale': {
    		get: function () {
    			if (this._scale != undefined) {
    				return this._scale;
    			} else {
    				this._scale = this.key.getScale();
    				return this._scale;
    			}
    		},
    	},
    	'degreeName': {
    		get: function () {
    			if (this.scaleDegree < 7) {
    				return [undefined, 'Tonic', 'Supertonic','Mediant','Subdominant','Dominant','Submediant'][this.scaleDegree];
    			} else {
    				var tonicPitch = new Music21.Pitch(this.key.tonic);
    				var diffRootToTonic = (tonicPitch.ps - this.root.ps) % 12;
    				if (diffRootToTonic < 0) {
    					diffRootToTonic += 12;
    				}
    				if (diffRootToTonic == 1) {
    					return "Leading-tone";
    				} else {
    					return "Subtonic";
    				}
    			}
    		}
    	}
    });		

    this.updatePitches = function () {
    	var impliedQuality = this.impliedQuality;
    	var chordSpacing = Music21._chordDefinitions[impliedQuality];
    	var chordPitches = [this.root];
		var lastPitch = this.root;
		for (var j = 0; j < chordSpacing.length; j++) {
			var thisTransStr = chordSpacing[j];
			var thisTrans = new Music21.Interval(thisTransStr);
			var nextPitch = thisTrans.transposePitch(lastPitch);
			chordPitches.push(nextPitch);
			lastPitch = nextPitch;
		}
		this.pitches = chordPitches;
    };
    
	this.key = undefined;
	if (typeof(keyStr) == 'string') {
		this.key = new Music21.Key(keyStr);
	} else if (typeof(keyStr) == 'undefined') {
		this.key = new Music21.Key('C');
	} else {
		this.key = keyStr;
	}
	var currentFigure = figure;
	
	var impliedQuality = 'major';
	var lowercase = currentFigure.toLowerCase();
	if (currentFigure.match('/o')) {
		impliedQuality = 'half-diminished';
		currentFigure = currentFigure.replace('/o','');
	} else if (currentFigure.match('o')) {
		impliedQuality = 'diminished';
		currentFigure = currentFigure.replace('o', '');
	} else if (currentFigure == lowercase) {
		impliedQuality = 'minor';
	}
		
	var numbersArr = currentFigure.match(/\d+/); 
	this.numbers = undefined;
	if (numbersArr != null) {
		currentFigure = currentFigure.replace(/\d+/, '');
		this.numbers = parseInt(numbersArr[0]);
	}
	
	var scaleDegree = Music21._romanToNumber.indexOf(currentFigure.toLowerCase());
	if (scaleDegree == -1) {
		throw("Cannot make a romanNumeral from " + currentFigure);
	}
	this.scaleDegree = scaleDegree;
	this.root = this.scale[this.scaleDegree - 1];
	
	if (this.key.mode == 'minor' && (this.scaleDegree == 6 || this.scaleDegree == 7)) {
		if (['minor','diminished','half-diminished'].indexOf(impliedQuality) != -1) {
			var raiseTone = new Music21.Interval('A1');
			this.root = raiseTone.transposePitch(this.root);
			if (Music21.debug) {
				console.log('raised root because minor/dim on scaleDegree 6 or 7');
			}
		}
	}
	
	/* temp hack */
	if (this.numbers == 7) {
		if (scaleDegree == 5 && impliedQuality == 'major') {
			impliedQuality = 'dominant-seventh';
		} else {
			impliedQuality += '-seventh';
		}
	}
	
	
	this.impliedQuality = impliedQuality;

	this.updatePitches();	
};

Music21.RomanNumeral.prototype = new Music21.Chord();
Music21.RomanNumeral.prototype.constructor = Music21.RomanNumeral;


/*  Music21.Clef

	must be defined before Stream since Stream subclasses call new Music21.Clef...

*/

Music21.Clef = function (name) {
	Music21.Music21Object.call(this);
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


Music21.Clef.prototype = new Music21.Music21Object();
Music21.Clef.prototype.constructor = Music21.Clef;

Music21.KeySignature = function(sharps) {
	Music21.Music21Object.call(this);
	this.classes.push('KeySignature');
	this.sharps = sharps || 0; // if undefined
	this.mode = 'major';
	this._alteredPitchesCache = undefined;
	
	// 9 flats/sharps enough for now...
	this.flatMapping = ['C','F','B-','E-','A-','D-','G-','C-','F-','B--'];
	this.sharpMapping = ['C','G','D','A','E','B','F#','C#','G#','D#'];

	this.majorName = function () {
		if (this.sharps >= 0) {
			return this.sharpMapping[this.sharps];
		} else {
			return this.flatMapping[Math.abs(this.sharps)];
		}
	};
	this.minorName = function() {
		var tempSharps = this.sharps + 3;
		if (tempSharps >= 0) {
			return this.sharpMapping[tempSharps];
		} else {
			return this.flatMapping[Math.abs(tempSharps)];
		}
	};
	this.vexflow = function() {
		var tempName = this.majorName();
		return tempName.replace(/\-/g, "b");
	};
	this.accidentalByStep = function(step) {
		var aps = this.alteredPitches;
		for (var i = 0; i < aps.length; i++) {
			if (aps[i].step == step) {
				if (aps[i].accidental == undefined) {
					return undefined;
				}
				// make a new accidental;
				return new Music21.Accidental(aps[i].accidental.alter);
			}
		}
		return undefined;
	};
	this.transposePitchFromC = function(pitch) {
		var transInterval = undefined;
		var transTimes = undefined;
		if (this.sharps == 0) {
			return new Music21.Pitch(pitch.nameWithOctave);
		} else if (this.sharps < 0) {
			transTimes = Math.abs(this.sharps);
			transInterval = new Music21.Interval("P4");
		} else {
			transTimes = this.sharps;
			transInterval = new Music21.Interval("P5");
		}
		var newPitch = pitch;
		for (var i = 0; i < transTimes; i++) {
			newPitch = transInterval.transposePitch(newPitch);
			if ((i % 2) == 1) {
				newPitch.octave = newPitch.octave - 1;
			}
		} 
		return newPitch;
	};
	
    Object.defineProperties(this, {
    	'alteredPitches': {
    		get: function () {
    			if (this._alteredPitchesCache != undefined) {
    				return this._alteredPitchesCache;
    			} 
    			var transStr = "P5";
    			var startPitch = "B";
    			if (this.sharps < 0) {
    				transStr = "P4";
    				startPitch = "F";
    			}
				var transInterval = new Music21.Interval(transStr);
				var post = [];
				var pKeep = new Music21.Pitch(startPitch);
				for (var i = 0; i < Math.abs(this.sharps); i++) {
					pKeep = transInterval.transposePitch(pKeep);
					pKeep.octave = 4;
					post.push(pKeep);
				}
				this._alteredPitchesCache = post;
				return post;
    		}
    	}
    });
};

Music21.KeySignature.prototype = new Music21.Music21Object();
Music21.KeySignature.prototype.constructor = Music21.KeySignature;

Music21.Key = function (keyName, mode) {
	if (keyName == undefined) {
		keyName = 'C';
	}
	if (mode == undefined) {
		var lowerCase = keyName.toLowerCase();
		if (keyName == lowerCase) {
			mode = 'minor';
		} else {
			mode = 'major';
		}
	}
	
	var sharpsArray = "A-- E-- B-- F- C- G- D- A- E- B- F C G D A E B F# C# G# D# A# E# B#".split(" ");
	var sharpsIndex = sharpsArray.indexOf(keyName.toUpperCase());
	if (sharpsIndex == -1) {
		throw("Cannot find the key for " + keyName );
	}
	var modeShift = 0;
	if (mode == 'minor') {
		modeShift = -3;
	}
	var sharps = sharpsIndex + modeShift - 11;
	if (Music21.debug) {
		console.log("Found sharps " + sharps + " for key: " + keyName);
	}
	Music21.KeySignature.call(this, sharps);
	this.tonic = keyName;
	this.mode = mode;
	
	this.getScale = function (scaleType) {
		if (scaleType == undefined) {
			scaleType = this.mode;
		}
		var pitchObj = new Music21.Pitch(this.tonic);
		if (scaleType == 'major') {
			return Music21.ScaleSimpleMajor(pitchObj);
		} else {
			return Music21.ScaleSimpleMinor(pitchObj, scaleType);
		}
	};
};

Music21.Key.prototype = new Music21.KeySignature();
Music21.Key.prototype.constructor = Music21.Key;



/* Stream functions ... */
Music21.RenderOptions = function() {
	return {
		displayClef: true,
		displayTimeSignature: true,
		displayKeySignature: true,
		top: 0,
		left: undefined,
		width: undefined,
		height: undefined,
		systemIndex: 0,
		partIndex: 0,
		measureIndex: 0,
		systemMeasureIndex: 0,
		maxSystemWidth: undefined,
		rightBarline: undefined,
		staffConnectors: ['single', 'brace'],
		events: {
			'click': 'play',
			'dblclick': undefined,
				},
		startNewSystem: false,
		startNewPage: false,
		showMeasureNumber: undefined,
	};
};

Music21.Stream = function () {
	Music21.Music21Object.call(this);
	this.classes.push('Stream');

    this._elements = [];
    this.quarterLength = 0;
    this._clef = undefined;
    this.displayClef = undefined;
    
    this._keySignature =  undefined; // a Music21.KeySignature object
    this._timeSignature = undefined; // temp hack -- a string...
    
    this.autoBeam = true;
    this.activeVFStave = undefined;
    this.renderOptions = new Music21.RenderOptions();
    this._tempo = undefined;
    
    this._stopPlaying = false;
    this._allowMultipleSimultaneousPlays = true; // not implemented yet.

    this.append = function (el) {
    	if (el.inClass('NotRest')) {
        	this.clef.setStemDirection(el);    		
    	}
    	this.elements.push(el);
    	el.parent = this; // would prefer weakref, but does not exist in JS.
    	this.quarterLength += el.duration.quarterLength;
    };
    this.hasSubStreams = function () {
    	var hasSubStreams = false;
    	for (var i = 0; i < this.length; i++) {
    		var el = this.elements[i];
    		if (el.inClass('Stream')) {
    			hasSubStreams = true;
    			break;
    		}
    	}
    	return hasSubStreams;
    };
    
    Object.defineProperties(this, {
    	'flat': {
    		get: function () {
    			if (this.hasSubStreams()) {
        			var tempEls = [];
        			for (var i = 0; i < this.length; i++) {
        				var el = this.elements[i];
        				var tempArray = el.flat;
        				tempEls.push.apply(tempEls, tempArray);
        			}
        			return tempEls;
    			} else {
    				return this.elements;
    			}
    		},
    	},
		'tempo': {
			get: function () {
				if (this._tempo == undefined && this.parent != undefined) {
					return this.parent.tempo;
				} else if (this._tempo == undefined) {
					return 150;
				} else {
					return this._tempo;
				}
			},
			set: function (newTempo) {
				this._tempo = newTempo;
			}
		},
		'clef': {
			get: function () {
				if (this._clef == undefined && this.parent == undefined) {
					return new Music21.Clef('treble');
				} else if (this._clef == undefined) {
					return this.parent.clef;
				} else {
					return this._clef;
				}
			},
			set: function (newClef) {
				this._clef = newClef;
			}
		},
		'keySignature': {
			get: function () {
				if (this._keySignature == undefined && this.parent != undefined) {
					return this.parent.keySignature;
				} else {
					return this._keySignature;
				}
			},
			set: function (newKeySignature) {
				this._keySignature = newKeySignature;
			}
		},
		'timeSignature': {
			get: function () {
				if (this._timeSignature == undefined && this.parent != undefined) {
					return this.parent.timeSignature;
				} else {
					return this._timeSignature;
				}
			},
			set: function (newTimeSignature) {
				this._timeSignature = newTimeSignature;
			}
		},
		'maxSystemWidth': {
			get: function () {
				if (this.renderOptions.maxSystemWidth == undefined && this.parent != undefined) {
					return this.parent.maxSystemWidth;
				} else if (this.renderOptions.maxSystemWidth != undefined) {
					return this.renderOptions.maxSystemWidth;
				} else {
					return 750;
				}
			},
			set: function (newSW) {
				this.renderOptions.maxSystemWidth = newSW;
			}
		},
		'parts': {
			get: function() {
				var parts = [];
				for (var i = 0; i < this.length; i++) {
					if (this.elements[i].inClass('Part')) {
						parts.push(this.elements[i]);
					}
				}
				return parts;
			}
		},
		'measures': {
			get: function() {
				var measures = [];
				for (var i = 0; i < this.length; i++) {
					if (this.elements[i].inClass('Measure')) {
						measures.push(this.elements[i]);
					}
				}
				return measures;
			}
		},
		'length': {
			get: function() {
				return this.elements.length;
			}
		},
		'elements': {
			get: function() {
				return this._elements;
			},
			set: function(newElements) {
				this._elements = newElements;
			}
		}
    });
    
    
    this.makeAccidentals = function () {
		// cheap version of music21p method
		var extendableStepList = {};
		var stepNames = ['C','D','E','F','G','A','B'];
    	for (var i = 0; i < stepNames.length; i++) {
    		var stepName = stepNames[i];
    		var stepAlter = 0;
    		if (this.keySignature != undefined) {
    			var tempAccidental = this.keySignature.accidentalByStep(stepName);
    			if (tempAccidental != undefined) {
    				stepAlter = tempAccidental.alter;
    				//console.log(stepAlter + " " + stepName);
    			}
    		}
    		extendableStepList[stepName] = stepAlter;
    	}
		var lastOctaveStepList = [];
		for (var i =0; i < 10; i++) {
			var lastStepDict = $.extend({}, extendableStepList);
			lastOctaveStepList.push(lastStepDict);
		}
		var lastOctavelessStepDict = $.extend({}, extendableStepList); // probably unnecessary, but safe...
		for (var i = 0; i < this.length; i++) {
			el = this.elements[i];
			if (el.pitch != undefined) {
				var p = el.pitch;
				var lastStepDict = lastOctaveStepList[p.octave];
				this.makeAccidentalForOnePitch(p, lastStepDict, lastOctavelessStepDict);
			} else if (el._noteArray != undefined) {
				for (var j = 0; j < el._noteArray.length; j++) {
					var p = el._noteArray[j].pitch;
					var lastStepDict = lastOctaveStepList[p.octave];
					this.makeAccidentalForOnePitch(p, lastStepDict, lastOctavelessStepDict);
				}
			}
		}
    };

    this.makeAccidentalForOnePitch = function (p, lastStepDict, lastOctavelessStepDict) {
		var newAlter;
		if (p.accidental == undefined) {
			newAlter = 0;
		} else {
			newAlter = p.accidental.alter;
		}
		//console.log(p.name + " " + lastStepDict[p.step].toString());
		if ((lastStepDict[p.step] != newAlter) ||
			(lastOctavelessStepDict[p.step] != newAlter)
			 ) {
			p.accidental.displayStatus = true;
			//console.log("setting displayStatus to true");
		} else if ( (lastStepDict[p.step] == newAlter) &&
					(lastOctavelessStepDict[p.step] == newAlter) ) {
			p.accidental.displayStatus = false;
			//console.log("setting displayStatus to false");
		}
		lastStepDict[p.step] = newAlter;
		lastOctavelessStepDict[p.step] = newAlter;
    };
    /*  VexFlow functionality */
    
    this.vexflowNotes = function () {
        var notes = [];
        for (var i = 0; i < this.length; i++) {
        	var thisEl = this.elements[i];
        	if (thisEl.inClass('GeneralNote')) {
	        	var tn = thisEl.vexflowNote(this.clef.name);
	        	notes.push(tn);
        	}
        }
        //alert(notes.length);
        return notes;
    };
    this.vexflowVoice = function () {
        var totalLength = 0.0;
        for (var i = 0; i < this.length; i++) {
            totalLength += this.elements[i].duration.quarterLength;
        }
        var numSixteenths = totalLength / 0.25;
        var beatValue = 16;
        if (numSixteenths % 8 == 0) { beatValue = 2; numSixteenths = numSixteenths / 8; }
        else if (numSixteenths % 4 == 0) { beatValue = 4; numSixteenths = numSixteenths / 4; }
        else if (numSixteenths % 2 == 0) { beatValue = 8; numSixteenths = numSixteenths / 2; }
        //console.log('creating voice');
        if (Music21.debug) {
        	console.log("New voice, num_beats: " + numSixteenths.toString() + " beat_value: " + beatValue.toString());
        }
        var vfv = new Vex.Flow.Voice({ num_beats: numSixteenths,
                                    beat_value: beatValue,
                                    resolution: Vex.Flow.RESOLUTION });
		//alert(numSixteenths + " " + beatValue);
        //console.log('voice created');
        vfv.setMode(Vex.Flow.Voice.Mode.SOFT);
		return vfv;
    };
    
    this.vexflowStaffWidth = undefined;
    this.estimateStaffLength = function () {
    	if (this.vexflowStaffWidth != undefined) {
    		//console.log("Overridden staff width: " + this.vexflowStaffWidth);
    		return this.vexflowStaffWidth;
    	}
    	if (this.inClass('Score')) {
    		var tl = this.elements[0].estimateStaffLength(); // get from first part... 
    		//console.log('total Length: ' + tl);
    		return tl;
    	} else if (this.hasSubStreams()) { // part
    		var totalLength = 0;
    		for (var i = 0; i < this.length; i++) {
    			var m = this.elements[i];
    			totalLength += m.estimateStaffLength() + m.vexflowStaffPadding;
    			if ((i != 0) && (m.renderOptions.startNewSystem == true)) {
    				break;
    			}
    		}
    		return totalLength;
    	} else {
    		var vfro = this.renderOptions;
	    	var totalLength = 30 * this.length;
			totalLength += vfro.displayClef ? 20 : 0;
			totalLength += (vfro.displayKeySignature && this.keySignature) ? 5 * Math.abs(this.keySignature.sharps) : 0;
			totalLength += vfro.displayTimeSignature ? 30 : 0; 
			//totalLength += this.vexflowStaffPadding;
			return totalLength;
    	}
    };

    this.estimateStreamHeight = function (ignoreSystems) {
    	var staffHeight = 120;
    	var systemPadding = 30;
    	if (this.inClass('Score')) {
    		var numParts = this.length;
    		var numSystems = this.numSystems();
    		if (numSystems == undefined || ignoreSystems) {
    			numSystems = 1;
    		}
    		var scoreHeight = (numSystems * staffHeight * numParts) + ((numSystems - 1) * systemPadding);
    		//console.log('scoreHeight of ' + scoreHeight);
    		return scoreHeight;
    	} else if (this.inClass('Part')) {
    		var numSystems = 1;
    		if (!ignoreSystems) {
    			numSystems = this.numSystems();
    		}
    		if (Music21.debug) {
    			console.log("estimateStreamHeight for Part: numSystems [" + numSystems +
    			"] * staffHeight [" + staffHeight + "] + (numSystems [" + numSystems +
    			"] - 1) * systemPadding [" + systemPadding + "]."
    			);
    		}
    		return numSystems * staffHeight + (numSystems - 1) * systemPadding;
    	} else {
    		return staffHeight;
    	}
    };

    this.setSubstreamRenderOptions = function () {
    	/* does nothing for standard streams ... */
    };
    this.resetRenderOptionsRecursive = function () {
    	this.renderOptions = new Music21.RenderOptions();
    	for (var i = 0; i < this.length; i++) {
    		var el = this.elements[i];
    		if (el.inClass('Stream')) {
    			el.resetRenderOptionsRecursive();
    		}
    	}
    };
    
    this.activeFormatter = undefined;
    
    this.vexflowStaffPadding = 60;

    this.renderVexflowOnCanvas = function (canvas, renderer) {
    	if (renderer == undefined) {
    		renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
    	}
    	var hasSubStreams = this.hasSubStreams();
    	if (hasSubStreams) {
    		for (var i = 0; i < this.length; i++) {
    			var m = this.elements[i];
    			if (i == this.length - 1) {
    				m.renderOptions.rightBarline = 'end';
    			}
    			m.renderVexflowOnCanvas(canvas, renderer);
    		}
    	} else {
    		this.makeAccidentals();
    		var stave = this.renderVexflowNotesOnCanvas(canvas, renderer);
    		this.activeVFStave = stave;
    	}
    	if (this.inClass('Score')) {
    		this.addStaffConnectors(renderer);
    	}
	};
	
    this.renderVexflowNotesOnCanvas = function (canvas, renderer) { 	
    	if (renderer == undefined) {
    		renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
    	}
    	var ctx = renderer.getContext();

		var vfro = this.renderOptions;
		// measure level...
		var width = vfro.width;
		if (width == undefined) {
			width = this.estimateStaffLength() + this.vexflowStaffPadding;
		}
		var top = vfro.top;
		if (top == undefined) {
			top = 0;
		}
		var left = vfro.left;
		if (left == undefined) {
			left = 10;
		}
		//console.log('streamLength: ' + streamLength);
		var stave = new Vex.Flow.Stave(left, top, width);
        if (vfro.showMeasureNumber) {
        	stave.setMeasure(vfro.measureIndex + 1);
        }
		if (vfro.displayClef) {
			stave.addClef(this.clef.name);
		}
		if ((this.keySignature != undefined) && (vfro.displayKeySignature)) {
			stave.addKeySignature(this.keySignature.vexflow());
		}
		
        if ((this.timeSignature != undefined) && (vfro.displayTimeSignature)) {
			stave.addTimeSignature(this.timeSignature); // TODO: convertToVexflow...
		}
        if (this.renderOptions.rightBarline != undefined) {
        	var bl = this.renderOptions.rightBarline;
        	var barlineMap = {
        			'single': 'SINGLE',
        			'double': "DOUBLE",
        			'end': 'END',
        			};
        	var vxBL = barlineMap[bl];
        	if (vxBL != undefined) {
        		stave.setEndBarType(Vex.Flow.Barline.type[vxBL]);
        	}
        }
        
        stave.setContext(ctx);
		stave.draw();

		// add notes...
        var notes = this.vexflowNotes();
        var voice = this.vexflowVoice();

		voice.addTickables(notes);
		
		// find beam groups -- n.b. this wipes out stem direction and
		//      screws up middle line stems -- worth it for now.
		var beamGroups = [];
		if (this.autoBeam) {
			beamGroups = Vex.Flow.Beam.applyAndGetBeams(voice);
		} 
			
		var formatter = new Vex.Flow.Formatter();
		if (Music21.debug) {
			console.log("Voice: ticksUsed: " + voice.ticksUsed + " totalTicks: " + voice.totalTicks);
		}
		//Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notes);
		formatter.joinVoices([voice]);
		formatter.formatToStave([voice], stave);
		//formatter.format([voice], this.estimateStaffLength() );

		voice.draw(ctx, stave);

		// draw beams
		for(var i = 0; i < beamGroups.length; i++){
			 beamGroups[i].setContext(ctx).draw();
		}
		
		this.activeFormatter = formatter;
		this.applyFormatterInformationToNotes(stave);
		//console.log(stave.start_x + " -- stave startx");
		//console.log(stave.glyph_start_x + " -- stave glyph startx");
		return stave;
    };
    this.applyFormatterInformationToNotes = function (stave) {
        // mad props to our friend Vladimir Viro for figuring this out!
        // visit http://peachnote.com/
        
        var formatter = this.activeFormatter;
        var noteOffsetLeft = 0;
        //var staveHeight = 80;
        if (stave != undefined) {
        	noteOffsetLeft = stave.start_x + stave.glyph_start_x;
        	if (Music21.debug) {
        		console.log("noteOffsetLeft: " + noteOffsetLeft + " ; stave.start_x: " + stave.start_x);
            	console.log("Bottom y: " + stave.getBottomY() );	        			
        	}
        	//staveHeight = stave.height;
        }
        
		var nextTicks = 0;
		for (var i = 0; i < this.length; i ++ ) {
			var el = this.elements[i];
			if (el.inClass('Note') || el.inClass('Chord')) { // note or chord.
				var vfn = el.activeVexflowNote;
				var nTicks = parseInt(vfn.ticks);
				var formatterNote = formatter.tContexts.map[String(nextTicks)];
			    nextTicks += nTicks;
			    el.x = vfn.getAbsoluteX();
			    //console.log(i + " " + el.x + " " + formatterNote.x + " " + noteOffsetLeft);
			    el.width = formatterNote.width;		    
			    if (el.pitch != undefined) { // note only...
			    	el.y = stave.getBottomY() - (this.clef.firstLine - el.pitch.diatonicNoteNum) * stave.options.spacing_between_lines_px;
			    	//console.log('Note DNN: ' + el.pitch.diatonicNoteNum + " ; y: " + el.y);
			    }
		    }
		}
		if (Music21.debug) {
	        for (var i = 0; i < this.length; i ++ ) {
	            var n = this.elements[i];
	            if (n.pitch != undefined) {
	            	console.log(n.pitch.diatonicNoteNum + " " + n.x + " " + (n.x + n.width));
	            }
	        }
		}
		this.storedVexflowStave = stave;
    };
    
    /* MIDI related routines... */
    
    this.playStream = function (startNote) {
    	/*
    	 * Play the Stream.  Does not currently do noteOff
    	 */
        var currentNote = 0;
        if (startNote !== undefined) {
        	currentNote = startNote;
        }
        var flatEls = this.flat;
        var lastNote = flatEls.length;
        var tempo = this.tempo;
        this._stopPlaying = false;
        var thisStream = this;
        
        var playNext = function (elements) {
            if (currentNote < lastNote && !thisStream._stopPlaying) {
                var el = elements[currentNote];
                var ql = el.duration.quarterLength;
                var milliseconds = 60 * ql * 1000 / tempo;
                if (el.inClass('Note')) { // Note, not rest
			 	    var midNum = el.pitch.midi;
			 	    MIDI.noteOn(0, midNum, 100, 0);
			    } else if (el.inClass('Chord')) {
				    for (var j = 0; j < el._noteArray.length; j++) {
				 	    var midNum = el._noteArray[j].pitch.midi;
				 	    MIDI.noteOn(0, midNum, 100, 0);					   
				    }
			     }
                 currentNote += 1;
            	 setTimeout( function () { playNext(elements); }, milliseconds);
            }
        };
        playNext(flatEls);
    };
    
    this.stopPlayStream = function () {
    	this._stopPlaying = true;
    	for (var i = 0; i < 127; i++) {
    		MIDI.noteOff(0, midNum, 0);
    	}
	};
    
    // Canvas Routines ... 
    
	this.createNewCanvas = function (scaleInfo, width, height) {
    	if (this.hasSubStreams() ) { 
    		this.setSubstreamRenderOptions();
    	}

		if (scaleInfo == undefined) {
    		scaleInfo = { height: '100px', width: 'auto'};
    	}
		var newCanvas = $('<canvas/>', scaleInfo);

		if (width != undefined) {
			newCanvas.attr('width', width);
		} else {
			newCanvas.attr('width', this.estimateStaffLength() + this.vexflowStaffPadding + 0);
		}
		if (height != undefined) {
			newCanvas.attr('height', height);		
		} else {
			var computedHeight;
			if (this.renderOptions.height == undefined) {
				computedHeight = this.estimateStreamHeight();
				//console.log('computed Height estim: ' + computedHeight);
			} else {
				computedHeight = this.renderOptions.height;
				//console.log('computed Height: ' + computedHeight);
			}
			newCanvas.attr('height', computedHeight );
			newCanvas.css('height', Math.floor(computedHeight * .7).toString() + "px");
		}
		return newCanvas;
	};
    this.createPlayableCanvas = function (scaleInfo, width, height) {
		this.renderOptions.events['click'] = 'play';
		return this.createCanvas();
    };
    this.createCanvas = function(scaleInfo, width, height) {
		var newCanvas = this.createNewCanvas(scaleInfo, width, height);
        this.drawCanvas(newCanvas[0]);
        return newCanvas;    
    };
    
    this.drawCanvas = function (canvas) {
    	this.renderVexflowOnCanvas(canvas);
        canvas.storedStream = this;
        this.setRenderInteraction(canvas);    
    };    
    
    this.appendNewCanvas = function (bodyElement, scaleInfo, width, height) {
        if (bodyElement == undefined) {
            bodyElement = 'body';
        }
        canvasBlock = this.createCanvas(scaleInfo, width, height);
        $(bodyElement).append(canvasBlock);
		return canvasBlock[0];
    };
    
    this.replaceLastCanvas = function (bodyElement, scaleInfo) {
        if (bodyElement == undefined) {
            bodyElement = 'body';
        }
        canvasBlock = this.createCanvas(scaleInfo);
        $(bodyElement + " " + 'canvas').replaceWith(canvasBlock);
		return canvasBlock[0];
	};
	
	this.setRenderInteraction = function (canvas) {
		/*
		 * Set the type of interaction on the canvas based on 
		 *    Stream.renderOptions.events['click']
		 *    Stream.renderOptions.events['dblclick']
		 *    
		 * Currently the only options available for each are:
		 *    'play' (string)
		 *    customFunction
		 */
		jCanvas = $(canvas);
		$.each(this.renderOptions.events, $.proxy(function (eventType, eventFunction) {
			if (typeof(eventFunction) == 'string' && eventFunction == 'play') {
				jCanvas.on(eventType, function () { this.storedStream.playStream(); });
			} else if (eventFunction != undefined) {
				jCanvas.on(eventType, eventFunction);
			}
		} ) );
	};
	this.recursiveGetStoredVexflowStave = function () {
		/*
		 * Recursively search downward for the closest storedVexflowStave...
		 */
		var storedVFStave = this.storedVexflowStave;
		if (storedVFStave == undefined) {
			if (!this.hasSubStreams()) {
				return undefined;
			} else {
				storedVFStave = this.elements[0].storedVexflowStave;
				if (storedVFStave == undefined) {
					// bad programming ... should support continuous recurse
					// but good enough for now...
					if (this.elements[0].hasSubStreams()) {
						storedVFStave = this.elements[0].elements[0].storedVexflowStave;
					}
				}
			}
		}
		return storedVFStave;
	};
	
	this.getPixelScaling = function (canvas) {
		if (canvas == undefined) {
			return 1;
		}
		var canvasHeight = $(canvas).height();
		//var css = parseFloat(jCanvas.css('height'));
		
		var storedVFStave = this.recursiveGetStoredVexflowStave();
		var lineSpacing = storedVFStave.options.spacing_between_lines_px;
		var linesAboveStaff = storedVFStave.options.space_above_staff_ln;
		var totalLines = (storedVFStave.options.num_lines - 1) + linesAboveStaff + storedVFStave.options.space_below_staff_ln;
		/* var firstLineOffset = ( (storedVFStave.options.num_lines - 1) + linesAboveStaff) * lineSpacing; 
		   var actualVFStaffOnlyHeight = (storedVFStave.height - (linesAboveStaff * lineSpacing)); */
		var pixelScaling = totalLines * lineSpacing/canvasHeight;		
		if (Music21.debug) {
			console.log('canvasHeight: ' + canvasHeight + " totalLines*lineSpacing: " + totalLines*lineSpacing + " staveHeight: " + storedVFStave.height);
		}
		return pixelScaling;
	};
	this.getUnscaledXYforCanvas = function (canvas, e) {
		/*
		 * return a list of [Y, X] for
		 * a canvas element
		 */
		var offset;
		if (canvas == undefined) {
			offset = {left: 0, top: 0};
		} else {
			offset = $(canvas).offset();			
		}
		/*
		 * mouse event handler code from: http://diveintohtml5.org/canvas.html
		 */
		var xClick, yClick;
		if (e.pageX != undefined && e.pageY != undefined) {
			xClick = e.pageX;
			yClick = e.pageY;
		} else { 
			xClick = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			yClick = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		var xPx = (xClick - offset.left);
		var yPx = (yClick - offset.top);
		return [yPx, xPx];
	};
	
	this.getScaledXYforCanvas = function (canvas, e) {
		/*
		 * return a list of [scaledY, scaledX] for
		 * a canvas element
		 */
		var _ = this.getUnscaledXYforCanvas(canvas, e);
		var xPx = _[1];
		var yPx = _[0];
		var pixelScaling = this.getPixelScaling(canvas);
		
		var yPxScaled = yPx * pixelScaling;
		var xPxScaled = xPx * pixelScaling;
		return [yPxScaled, xPxScaled];
	};
	this.diatonicNoteNumFromScaledY = function (yPxScaled) {
		/*
		 * Given a Y position find the note at that position.
		 * searches this.storedVexflowStave
		 */
		var storedVFStave = this.recursiveGetStoredVexflowStave();
		var lineSpacing = storedVFStave.options.spacing_between_lines_px;
		var linesAboveStaff = storedVFStave.options.space_above_staff_ln;

		var notesFromTop = yPxScaled * 2 / lineSpacing;
		var notesAboveFirstLine = ((storedVFStave.options.num_lines - 1 + linesAboveStaff) * 2 ) - notesFromTop;
		var clickedDiatonicNoteNum = this.clef.firstLine + Math.round(notesAboveFirstLine);
		return clickedDiatonicNoteNum;
	};
	this.noteElementFromScaledX = function (xPxScaled, allowablePixels, y) {
		/*
		 * Return the note at pixel X (or within allowablePixels [default 10])
		 * of the note.
		 * 
		 * y element is optional and used to discover which part or system
		 * we are on
		 */
		var foundNote = undefined;
		if (allowablePixels == undefined) {
			allowablePixels = 10;	
		}

		for (var i = 0; i < this.length; i ++) {
			var n = this.elements[i];
			/* should also
			 * compensate for accidentals...
			 */
			if (xPxScaled > (n.x - allowablePixels) && 
					xPxScaled < (n.x + n.width + allowablePixels)) {
				foundNote = n;
				break; /* O(n); can be made O(log n) */
			}
		}		
		//console.log(n.pitch.nameWithOctave);
		return foundNote;
	};
	
	this.canvasClickedNotes = function (canvas, e, x, y) {
		/*
		 * Return a list of [diatonicNoteNum, closestXNote]
		 * for an event (e) called on the canvas (canvas)
		 */
		if (x == undefined || y == undefined) {
			var _ = this.getScaledXYforCanvas(canvas, e);
			y = _[0];
			x = _[1];
		}
		var clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(y);
		var foundNote = this.noteElementFromScaledX(x, undefined, y);
		return [clickedDiatonicNoteNum, foundNote];
	};
	
	this.changedCallbackFunction = undefined;
	
	this.canvasChangerFunction = function (e) {
		/* N.B. -- not to be called on a stream -- "this" refers to the CANVAS
		
			var can = s.appendNewCanvas();
			$(can).on('click', s.canvasChangerFunction);
		
		*/
		var ss = this.storedStream;
		var _ = ss.canvasClickedNotes(this, e),
			 clickedDiatonicNoteNum = _[0],
			 foundNote = _[1];
		if (foundNote == undefined) {
			if (Music21.debug) {
				console.log('No note found');				
			}
		}
		return ss.noteChanged(clickedDiatonicNoteNum, foundNote, this);
	};

	this.noteChanged = function (clickedDiatonicNoteNum, foundNote, canvas) {
		if (foundNote != undefined) {
			var n = foundNote;
			p = new Music21.Pitch("C");
			p.diatonicNoteNum = clickedDiatonicNoteNum;
			p.accidental = n.pitch.accidental;
			n.pitch = p;
			n.stemDirection = undefined;
			this.clef.setStemDirection(n);
			this.activeNote = n;
			this.redrawCanvas(canvas);
			if (this.changedCallbackFunction != undefined) {
				this.changedCallbackFunction();
			}
		}
	};
	
	this.redrawCanvas = function (canvas) {
		//this.resetRenderOptionsRecursive();
		//this.setSubstreamRenderOptions();
		var newCanv = this.createNewCanvas( { height: canvas.style.height,
											   width: canvas.style.width },
											canvas.width,
											canvas.height );
		this.drawCanvas(newCanv[0]);
		$(canvas).replaceWith( newCanv );
		$.event.copy($(canvas), newCanv); /* copy events -- using custom extension... */
	};
	
	this.editableAccidentalCanvas = function (scaleInfo, width, height) {
		/*
		 * Create an editable canvas with an accidental selection bar.
		 */
		var d = $("<div/>").css('text-align','left').css('position','relative');
		var buttonDiv = this.getAccidentalToolbar();
		d.append(buttonDiv);
		d.append( $("<br clear='all'/>") );
		this.renderOptions.events['click'] = this.canvasChangerFunction;
		var can = this.appendNewCanvas(d, scaleInfo, width, height);
		if (scaleInfo == undefined) {
			$(can).css('height', '140px');
		}
		return d;
	};

	
	/*
	 * Canvas toolbars...
	 */
	
	this.getAccidentalToolbar = function () {
		
		var addAccidental = function (clickedButton, alter) {
			/*
			 * To be called on a button...
			 *   this will usually refer to a window Object
			 */
			var accidentalToolbar = $(clickedButton).parent();
			var siblingCanvas = accidentalToolbar.parent().find("canvas");
			var s = siblingCanvas[0].storedStream;
			if (s.activeNote != undefined) {
				n = s.activeNote;
				n.pitch.accidental = new Music21.Accidental(alter);
				/* console.log(n.pitch.name); */
				s.redrawCanvas(siblingCanvas[0]);
				if (s.changedCallbackFunction != undefined) {
					s.changedCallbackFunction();
				}
			}
		};

		
		var buttonDiv = $("<div/>").attr('class','buttonToolbar vexflowToolbar').css('position','absolute').css('top','10px');
		buttonDiv.append( $("<span/>").css('margin-left', '50px'));
		buttonDiv.append( $("<button>♭</button>").click( function () { addAccidental(this, -1); } ));
		buttonDiv.append( $("<button>♮</button>").click( function () { addAccidental(this, 0); } ));
		buttonDiv.append( $("<button>♯</button>").click( function () { addAccidental(this, 1); } ));
		return buttonDiv;

	};
	this.getPlayToolbar = function () {
		var playStream = function (clickedButton) {
			var playToolbar = $(clickedButton).parent();
			var siblingCanvas = playToolbar.parent().find("canvas");
			var s = siblingCanvas[0].storedStream;
			s.playStream();
		};
		var stopStream = function (clickedButton) {
			var playToolbar = $(clickedButton).parent();
			var siblingCanvas = playToolbar.parent().find("canvas");
			var s = siblingCanvas[0].storedStream;
			s.stopStream();
		};
		var buttonDiv = $("<div/>").attr('class','playToolbar vexflowToolbar').css('position','absolute').css('top','10px');
		buttonDiv.append( $("<span/>").css('margin-left', '50px'));
		buttonDiv.append( $("<button>&#9658</button>").click( function () { playStream(this); } ));
		buttonDiv.append( $("<button>&#9724</button>").click( function () { stopStream(this); } ));
		return buttonDiv;		
	};

};

Music21.Stream.prototype = new Music21.Music21Object();
Music21.Stream.prototype.constructor = Music21.Stream;


Music21.Measure = function () { 
	Music21.Stream.call(this);
	this.classes.push('Measure');
};

Music21.Measure.prototype = new Music21.Stream();
Music21.Measure.prototype.constructor = Music21.Measure;

Music21.Part = function () {
	Music21.Stream.call(this);
	this.classes.push('Part');
	this.systemHeight = 120;
	
	this.canvasChangerFunction = function (e) {
		/* N.B. -- not to be called on a stream -- "this" refers to the CANVAS
		
			var can = s.appendNewCanvas();
			$(can).on('click', s.canvasChangerFunction);
		
			overrides Stream().canvasChangerFunction
		*/
		var ss = this.storedStream;
		var _ = ss.findSystemForClick(this, e),
			 clickedDiatonicNoteNum = _[0],
			 foundNote = _[1];
		return ss.noteChanged(clickedDiatonicNoteNum, foundNote, this);
	};

	this.findSystemForClick = function(canvas, e) {
		var _ = this.getUnscaledXYforCanvas(canvas, e);
		var y = _[0];
		var x = _[1];
		
		var scalingFunction = this.estimateStreamHeight()/$(canvas).height();
		if (Music21.debug) {
			console.log('Scaling function: ' + scalingFunction + ', i.e. this.estimateStreamHeight(): ' + 
					this.estimateStreamHeight() + " / $(canvas).height(): " + $(canvas).height());
		}
		var scaledY = y * scalingFunction;
		var systemIndex = Math.floor(scaledY / this.systemHeight);
		var clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(scaledY);
		
		var scaledX = x * scalingFunction;
		var foundNote = this.noteElementFromScaledX(scaledX, undefined, scaledY, systemIndex);
		return [clickedDiatonicNoteNum, foundNote];
	};
	
	this.noteElementFromScaledX = function (scaledX, allowablePixels, scaledY, systemIndex) {
		/*
		 * Override the noteElementFromScaledX for Stream
		 * to take into account sub measures...
		 * 
		 */
		var gotMeasure = undefined;
		for (var i = 0; i < this.length; i++) {
			var m = this.elements[i];
			var vfro = m.renderOptions;
			var left = vfro.left;
			var right = left + vfro.width;
			var top = vfro.top;
			var bottom = top + vfro.height;
			if (Music21.debug) {
				console.log("Searching for X:" + Math.round(scaledX) + 
						" Y:" + Math.round(scaledY) + " in M " + i + 
						" with boundaries L:" + left + " R:" + right +
						" T: " + top + " B: " + bottom);
			}
			if (scaledX >= left && scaledX <= right ){
				if (systemIndex == undefined) {
					gotMeasure = m;
					break;
				} else if (vfro.systemIndex == systemIndex) {
					gotMeasure = m;
					break;
				}
			}
		}
		if (gotMeasure) {
			return gotMeasure.noteElementFromScaledX(scaledX, allowablePixels);
		}
	};
	this.setSubstreamRenderOptions = function () {
		var currentMeasureIndex = 0; /* 0 indexed for now */
		var currentMeasureLeft = 20;
		var vfro = this.renderOptions;
		for (var i = 0; i < this.length; i++) {
			var el = this.elements[i];
			if (el.inClass('Measure')) {
				var elvfro = el.renderOptions;
				elvfro.measureIndex = currentMeasureIndex;
				elvfro.top = vfro.top;
				elvfro.partIndex = vfro.partIndex;
				elvfro.left = currentMeasureLeft;
				
				if (currentMeasureIndex == 0) {
					elvfro.displayClef = true;
					elvfro.displayKeySignature = true;
					elvfro.displayTimeSignature = true;
				} else {
					elvfro.displayClef = false;
					elvfro.displayKeySignature = false;
					elvfro.displayTimeSignature = false;					
				}
				elvfro.width = el.estimateStaffLength() + el.vexflowStaffPadding;
				elvfro.height = el.estimateStreamHeight();
				currentMeasureLeft += elvfro.width;
				currentMeasureIndex++;
			}
		}
	};
	
	this.getMeasureWidths = function () {
		/* call after setSubstreamRenderOptions */
		var measureWidths = [];
		for (var i = 0; i < this.length; i++) {
			var el = this.elements[i];
			//console.log(el.classes);
			if (el.inClass('Measure')) {
				var elvfro = el.renderOptions;
				//console.log(i);
				measureWidths[elvfro.measureIndex] = elvfro.width;
			}
		}
		/* console.log(measureWidths);
		 * 
		 */
		return measureWidths;
	};
	
	this.fixSystemInformation = function (systemHeight) {
		/*
		 * Divide a part up into systems and fix the measure
		 * widths so that they are all even.
		 * 
		 * Note that this is done on the part level even though
		 * the measure widths need to be consistent across parts.
		 * 
		 * This is possible because the system is deterministic and
		 * will come to the same result for each part.  Opportunity
		 * for making more efficient through this...
		 */
		/* 
		 * console.log('system height: ' + systemHeight);
		 */
		if (systemHeight == undefined) {
			systemHeight = this.systemHeight; /* part.show() called... */
		} else {
			if (Music21.debug) {
				console.log ('overridden systemHeight: ' + systemHeight);
			}
		}
		var measureWidths = this.getMeasureWidths();
		var maxSystemWidth = this.maxSystemWidth; /* of course fix! */
		var systemCurrentWidths = [];
		var systemBreakIndexes = [];
		var lastSystemBreak = 0; /* needed to ensure each line has at least one measure */
		var startLeft = 20; /* TODO: make it obtained elsewhere */
		var currentLeft = startLeft;
		for (var i = 0; i < measureWidths.length; i++) {
			var currentRight = currentLeft + measureWidths[i];
			/* console.log("left: " + currentLeft + " ; right: " + currentRight + " ; m: " + i); */
			if ((currentRight > maxSystemWidth) && (lastSystemBreak != i)) {
				systemBreakIndexes.push(i-1);
				systemCurrentWidths.push(currentLeft);
				//console.log('setting new width at ' + currentLeft);
				currentLeft = startLeft + measureWidths[i];
				lastSystemBreak = i;
			} else {
				currentLeft = currentRight;
			}
		}
		//console.log(systemCurrentWidths);
		//console.log(systemBreakIndexes);

		var currentSystemIndex = 0;
		var leftSubtract = 0;
		for (var i = 0; i < this.length; i++) {
			var m = this.elements[i];
			if (i == 0) {
				m.renderOptions.startNewSystem = true;
			}
			var currentLeft = m.renderOptions.left;

			if ($.inArray(i - 1, systemBreakIndexes) != -1) {
				/* first measure of new System */
				leftSubtract = currentLeft - 20;
				m.renderOptions.displayClef = true;
				m.renderOptions.displayKeySignature = true;
				m.renderOptions.startNewSystem = true;
				currentSystemIndex++;
			} else if (i != 0) {
				m.renderOptions.startNewSystem = false;
				m.renderOptions.displayClef = false;
				m.renderOptions.displayKeySignature = false;
			}
			m.renderOptions.systemIndex = currentSystemIndex;
			var currentSystemMultiplier;
			if (currentSystemIndex >= systemCurrentWidths.length) {
				/* last system... non-justified */;
				currentSystemMultiplier = 1;
			} else {
				var currentSystemWidth = systemCurrentWidths[currentSystemIndex];
				currentSystemMultiplier = maxSystemWidth / currentSystemWidth;
				//console.log('systemMultiplier: ' + currentSystemMultiplier + ' max: ' + maxSystemWidth + ' current: ' + currentSystemWidth);
			}
			/* might make a small gap? fix? */
			var newLeft = currentLeft - leftSubtract;
			//console.log('M: ' + i + ' ; old left: ' + currentLeft + ' ; new Left: ' + newLeft);
			m.renderOptions.left = Math.floor(newLeft * currentSystemMultiplier);
			m.renderOptions.width = Math.floor(m.renderOptions.width * currentSystemMultiplier);
			var newTop = m.renderOptions.top + (currentSystemIndex * systemHeight);
			//console.log('M: ' + i + '; New top: ' + newTop + " ; old Top: " + m.renderOptions.top);
			m.renderOptions.top = newTop;
		}
		
		return systemCurrentWidths;
	};
	this.numSystems = function () {
		var numSystems = 0;
		for (var i = 0; i < this.length; i++) {
			if (this.elements[i].renderOptions.startNewSystem) {
				numSystems++;
			}
		}
		if (numSystems == 0) {
			numSystems = 1;
		}
		return numSystems;
	};
};

Music21.Part.prototype = new Music21.Stream();
Music21.Part.prototype.constructor = Music21.Part;

Music21.Score = function () {
	Music21.Stream.call(this);
	this.classes.push('Score');
	this.measureWidths = [];
	this.partSpacing = 120;

    this.playStream = function () {
    	// play multiple parts in parallel...
    	for (var i = 0; i < this.length; i++) {
    		var el = this.elements[i];
    		if (el.inClass('Part')) {
    			el.playStream();
    		}
    	}
    };
    this.stopStream = function () {
    	for (var i = 0; i < this.length; i++) {
    		var el = this.elements[i];
    		if (el.inClass('Part')) {
    	    	el._stopPlaying = true;
    		}
    	}
    };
	this.setSubstreamRenderOptions = function () {
		var currentPartNumber = 0;
		var currentPartTop = 0;
		var partSpacing = this.partSpacing;
		for (var i = 0; i < this.length; i++) {
			var el = this.elements[i];
			
			if (el.inClass('Part')) {
				el.renderOptions.partIndex = currentPartNumber;
				el.renderOptions.top = currentPartTop;
				el.setSubstreamRenderOptions();
				currentPartTop += partSpacing;
				currentPartNumber++;
			}
		}
		this.evenPartMeasureSpacing();
		var ignoreNumSystems = true;
		var currentScoreHeight = this.estimateStreamHeight(ignoreNumSystems);
		for (var i = 0; i < this.length; i++) {
			var el = this.elements[i];	
			if (el.inClass('Part')) {
				el.fixSystemInformation(currentScoreHeight);
			}
		}
		this.renderOptions.height =  this.estimateStreamHeight();
	};
	this.getMaxMeasureWidths = function () {
		/*  call after setSubstreamRenderOptions
		 *  gets the maximum measure width for each measure
		 *  by getting the maximum for each measure of
		 *  Part.getMeasureWidths();
		 */
		var maxMeasureWidths = [];
		var measureWidthsArrayOfArrays = [];
		for (var i = 0; i < this.length; i++) {
			var el = this.elements[i];
			measureWidthsArrayOfArrays.push(el.getMeasureWidths());
		}
		for (var i = 0; i < measureWidthsArrayOfArrays[0].length; i++) {
			var maxFound = 0;
			for (var j = 0; j < this.length; j++) {
				if (measureWidthsArrayOfArrays[j][i] > maxFound) {
					maxFound = measureWidthsArrayOfArrays[j][i];
				}
			}
			maxMeasureWidths.append(maxFound);
		}
		//console.log(measureWidths);
		return maxMeasureWidths;
	};

	this.findPartForClick = function(canvas, e) {
		
		var _ = this.getUnscaledXYforCanvas(canvas, e);
		var y = _[0];
		var x = _[1];
		
		var scalingFunction = this.estimateStreamHeight()/$(canvas).height();
		var scaledY = y * scalingFunction;
		var partNum = Math.floor(scaledY / this.partSpacing);
		var scaledYinPart = scaledY - partNum * this.partSpacing;
		

		var systemIndex = undefined;
		if (partNum >= this.length) {
			systemIndex = Math.floor(partNum/this.length);
			partNum = partNum % this.length;
		}
		if (Music21.debug) {
			console.log(y + " scaled = " + scaledY + " part Num: " + partNum + " scaledYinPart: " + scaledYinPart + " systemIndex: " + systemIndex);
		}
		var rightPart = this.elements[partNum];
		var clickedDiatonicNoteNum = rightPart.diatonicNoteNumFromScaledY(scaledYinPart);
		
		var scaledX = x * scalingFunction;
		var foundNote = rightPart.noteElementFromScaledX(scaledX, undefined, scaledYinPart, systemIndex);
		return [clickedDiatonicNoteNum, foundNote];
	};
	
	this.canvasChangerFunction = function (e) {
		/* N.B. -- not to be called on a stream -- "this" refers to the CANVAS
		
			var can = s.appendNewCanvas();
			$(can).on('click', s.canvasChangerFunction);
		
		*/
		var ss = this.storedStream;
		var _ = ss.findPartForClick(this, e),
			 clickedDiatonicNoteNum = _[0],
			 foundNote = _[1];
		return ss.noteChanged(clickedDiatonicNoteNum, foundNote, this);
	};

	this.numSystems = function () {
		return this.elements[0].numSystems();
	};

	
	this.evenPartMeasureSpacing = function () {
		var measureStacks = [];
		var currentPartNumber = 0;
		var maxMeasureWidth = [];

		for (var i = 0; i < this.length; i++) {
			var el = this.elements[i];
			if (el.inClass('Part')) {
				var measureWidths = el.getMeasureWidths();
				for (var j = 0; j < measureWidths.length; j++) {
					thisMeasureWidth = measureWidths[j];
					if (measureStacks[j] == undefined) {
						measureStacks[j] = [];
						maxMeasureWidth[j] = thisMeasureWidth;
					} else {
						if (thisMeasureWidth > maxMeasureWidth[j]) {
							maxMeasureWidth[j] = thisMeasureWidth;
						}
					}
					measureStacks[j][currentPartNumber] = thisMeasureWidth;
				}
				currentPartNumber++;
			}
		}
		var currentLeft = 20;
		for (var i = 0; i < maxMeasureWidth.length; i++) {
			// TODO: do not assume, only elements in Score are Parts and in Parts are Measures...
			var measureNewWidth = maxMeasureWidth[i];
			for (var j = 0; j < this.length; j++) {
				var part = this.elements[j];
				var measure = part.elements[i];
				var vfro = measure.renderOptions;
				vfro.width = measureNewWidth;
				vfro.left = currentLeft;
			}
			currentLeft += measureNewWidth;
		}
	};
	
	this.addStaffConnectors = function (renderer) {
		var numParts = this.length;
		if (numParts < 2) {
			return;
		}
		staffConnectorsMap = {
				'brace': Vex.Flow.StaveConnector.type.BRACE, 
				'single': Vex.Flow.StaveConnector.type.SINGLE, 
				'double': Vex.Flow.StaveConnector.type.DOUBLE, 
				'bracket': Vex.Flow.StaveConnector.type.BRACKET, 
		};
		var firstPart = this.elements[0];
		var lastPart = this.elements[numParts - 1];
		var numMeasures = firstPart.length;
		for (var mIndex = 0; mIndex < numMeasures; mIndex++) {
			var thisPartMeasure = firstPart.elements[mIndex];
			if (thisPartMeasure.renderOptions.startNewSystem) {
				var topVFStaff = thisPartMeasure.activeVFStave;
				var bottomVFStaff = lastPart.elements[mIndex].activeVFStave;
				/* TODO: warning if no staves... */;
				for (var i = 0; i < this.renderOptions.staffConnectors.length; i++) {
					var sc = new Vex.Flow.StaveConnector(topVFStaff, bottomVFStaff);
					var scTypeM21 = this.renderOptions.staffConnectors[i];
					var scTypeVF = staffConnectorsMap[scTypeM21];
					sc.setType(scTypeVF);
					sc.setContext(renderer.getContext()).draw();
				}
			}
		}
	};
};

Music21.Score.prototype = new Music21.Stream();
Music21.Score.prototype.constructor = Music21.Score;

var tinyNotationRegularExpressions = {  REST    : /r/,
                            OCTAVE2 : /([A-G])[A-G]+/,
                            OCTAVE3 : /([A-G])/,
                            OCTAVE5 : /([a-g])(\'+)/, 
                            OCTAVE4 : /([a-g])/,
                            EDSHARP : /\((\#+)\)/,
                            EDFLAT  : /\((\-+)\)/,
                            EDNAT   : /\(n\)/,
                            SHARP   : /^[A-Ga-g]+\'*(\#+)/,  // simple notation finds 
                            FLAT    : /^[A-Ga-g]+\'*(\-+)/,  // double sharps too
                            TYPE    : /(\d+)/,
                            TIE     : /.\~/, // not preceding ties
                            PRECTIE : /\~/,  // front ties
                            ID_EL   : /\=([A-Za-z0-9]*)/,
                            LYRIC   : /\_(.*)/,
                            DOT     : /\.+/,
                            TIMESIG : /(\d+)\/(\d+)/
						  };


Music21.TinyNotation = function (textIn) {
    var tokens = textIn.split(" ");
    var s = new Music21.Measure();
    // s.clef = new Music21.Clef('bass');
    var lastDuration = 1.0;
    var tnre = tinyNotationRegularExpressions; // faster typing
    for (var i = 0; i < tokens.length; i++ ) {
        var token = tokens[i];
        var noteObj = undefined;
        var MATCH;
        if (MATCH = tnre.TIMESIG.exec(token)) {
        	var numerator = MATCH[1];
        	var denominator = MATCH[2];
        	// does nothing...
        	s.timeSignature = numerator + '/' + denominator;
        	continue;
        } else if (tnre.REST.exec(token)) {
            noteObj = new Music21.Rest(lastDuration);
        } else if (MATCH = tnre.OCTAVE2.exec(token)) {
            noteObj = new Music21.Note(MATCH[1], lastDuration);
			noteObj.pitch.octave = 4 - MATCH[0].length;
        } else if (MATCH = tnre.OCTAVE3.exec(token)) {
            noteObj = new Music21.Note(MATCH[1], lastDuration);
			noteObj.pitch.octave = 3;
        } else if (MATCH = tnre.OCTAVE5.exec(token)) {
        	// must match octave 5 before 4
            noteObj = new Music21.Note(MATCH[1].toUpperCase(), lastDuration);
			noteObj.pitch.octave = 3 + MATCH[0].length;
		} else if (MATCH = tnre.OCTAVE4.exec(token)) {
            noteObj = new Music21.Note(MATCH[1].toUpperCase(), lastDuration);
			noteObj.pitch.octave = 4;
		}

		if (noteObj == undefined) {
			continue;
		}
		
		if (tnre.SHARP.exec(token)) {
		    noteObj.pitch.accidental = new Music21.Accidental('sharp');
		} else if (tnre.FLAT.exec(token)) {
		    noteObj.pitch.accidental = new Music21.Accidental('flat');
		}
		
		if (MATCH = tnre.TYPE.exec(token)) {
			var durationType = parseInt(MATCH[0]);
			noteObj.duration.quarterLength = 4.0 / durationType;
		}
		
		if (MATCH = tnre.DOT.exec(token)) {
			var numDots = MATCH[0].length;
			var multiplier = 1 + (1 - Math.pow(.5, numDots));
			noteObj.duration.quarterLength = multiplier * noteObj.duration.quarterLength;
		}
		lastDuration = noteObj.duration.quarterLength;
        s.append(noteObj);
    }
    return s;
};


Music21.IntervalDirections = {
	DESCENDING: -1,
	OBLIQUE: 0,
	ASCENDING: 1
};

// N.B. a dict in music21p -- the indexes here let IntervalDirections call them + 1
Music21.IntervalDirectionTerms = ['Descending', 'Oblique','Ascending'];


Music21.MusicOrdinals = [undefined, 'Unison', 'Second', 'Third', 'Fourth',
						 'Fifth', 'Sixth', 'Seventh', 'Octave',
						 'Ninth', 'Tenth', 'Eleventh', 'Twelfth',
						 'Thirteenth', 'Fourteenth', 'Double Octave'];
						 

Music21.GenericInterval = function (gi) {
	this.classes = ['GenericInterval'];
	if (gi == undefined) {
		gi = 1;
	}
	this.value = gi; // todo: convertGeneric() from python
	this.directed =	this.value;
	this.undirected = Math.abs(this.value);
	
	if (this.directed == 1) { this.direction = Music21.IntervalDirections.OBLIQUE; }
	else if (this.directed < 0) { this.direction = Music21.IntervalDirections.DESCENDING; }
	else if (this.directed > 1) { this.direction = Music21.IntervalDirections.ASCENDING; }
	// else (raise exception)
	
	if (this.undirected > 2) { this.isSkip = true; }
	else { this.isSkip = false; }
	
	if (this.undirected == 2) { this.isDiatonicStep = true; }
	else { this.isDiatonicStep = false; }
	
	this.isStep = this.isDiatonicStep;
	
	if (this.undirected == 1) { this.isUnison = true; }
	else { this.isUnison = false; }
	
	var tempSteps = this.undirected % 7;
	var tempOctaves = parseInt(this.undirected / 7);
	if (tempSteps == 0) {
		tempOctaves += 1;
		tempSteps = 7;
	}
	this.simpleUndirected = tempSteps;
	this.undirectedOctaves = tempOctaves;
	if ((tempSteps == 1) && (tempOctaves >= 1)) {
		this.semiSimpleUndirected = 8;
	} else {
		this.semiSimpleUndirected = this.simpleUndirected;
	}
	
	if (this.direction == Music21.IntervalDirections.DESCENDING) {
		this.octaves = -1 * tempOctaves;
		if (tempSteps != 1) {
			this.simpleDirected = -1 * tempSteps;
		} else {
			this.simpleDirected = 1;  // no descending unisons...
		}
		this.semiSimpleDirected = -1 * this.semiSimpleUndirected;
	} else {
		this.octaves = tempOctaves;
		this.simpleDirected = tempSteps;
		this.semiSimpleDirected = this.semiSimpleUndirected;
	}
	if ((this.simpleUndirected==1) ||
		   (this.simpleUndirected==4) ||
		   (this.simpleUndirected==5)) {
		this.perfectable = true;
	} else {
		this.perfectable = false;
	}

	if (this.undirected < Music21.MusicOrdinals.length) {
		this.niceName = Music21.MusicOrdinals[this.undirected];
	} else {
		this.niceName = this.undirected.toString();
	}
	
	this.simpleNiceName = Music21.MusicOrdinals[this.simpleUndirected];
	this.semiSimpleNiceName = Music21.MusicOrdinals[this.semiSimpleUndirected];
	

	if (Math.abs(this.directed) == 1) {
		this.staffDistance = 0;
	} else if (this.directed > 1) {
		this.staffDistance = this.directed - 1;
	} else if (this.directed < -1) {
		this.staffDistance = this.directed + 1;
	} 
	// else: raise IntervalException("Non-integer, -1, or 0 not permitted as a diatonic interval")

	// 2 -> 7; 3 -> 6; 8 -> 1 etc.
	this.mod7inversion = 9 - this.semiSimpleUndirected ;

	if (this.direction == Music21.IntervalDirections.DESCENDING) {
		this.mod7 = this.mod7inversion;  // see chord.semitonesFromChordStep for usage...
	} else {
		this.mod7 = this.simpleDirected;
	}
	
	this.complement = function () {
		return new Music21.GenericInterval(this.mod7inversion);
	};
	
	this.reverse = function () {
		if (this.undirected == 1) {
			return new Music21.GenericInterval(1);
		} else {
			return new Music21.GenericInterval(this.undirected * (-1 * this.direction));
		}
	};
	
	this.getDiatonic = function (specifier) {
		return new Music21.DiatonicInterval(specifier, this);
	};	
};

Music21.IntervalSpecifiersEnum = { 
	PERFECT:    1,
	MAJOR:      2,
	MINOR:      3,
	AUGMENTED:  4,
	DIMINISHED: 5,
	DBLAUG:     6,
	DBLDIM:     7,
	TRPAUG:     8,
	TRPDIM:     9,
	QUADAUG:   10,
	QUADDIM:   11
};

Music21.IntervalNiceSpecNames = [
	'ERROR', 'Perfect', 'Major', 'Minor', 
	'Augmented', 'Diminished', 'Doubly-Augmented', 'Doubly-Diminished', 
	'Triply-Augmented', 'Triply-Diminished', "Quadruply-Augmented", "Quadruply-Diminished"
];
Music21.IntervalPrefixSpecs = [
	undefined, 'P', 'M', 'm', 'A', 'd', 'AA', 'dd', 'AAA', 'ddd', 'AAAA', 'dddd'
];



Music21.IntervalOrderedPerfSpecs = [
	'dddd', 'ddd', 'dd', 'd', 'P', 'A', 'AA', 'AAA', 'AAAA'
];

Music21.IntervalPerfSpecifiers = [
	Music21.IntervalSpecifiersEnum.QUADDMIN,
	Music21.IntervalSpecifiersEnum.TRPDIM,
	Music21.IntervalSpecifiersEnum.DBLDIM,
	Music21.IntervalSpecifiersEnum.DIMINISHED,
	Music21.IntervalSpecifiersEnum.PERFECT,
	Music21.IntervalSpecifiersEnum.AUGMENTED,
	Music21.IntervalSpecifiersEnum.DBLAUG,
	Music21.IntervalSpecifiersEnum.TRPAUG,
	Music21.IntervalSpecifiersEnum.QUADAUG
];
Music21.IntervalPerfOffset = 4;

Music21.IntervalOrderedImperfSpecs = [
	'dddd', 'ddd', 'dd', 'd', 'm', 'M', 'A', 'AA', 'AAA', 'AAAA'
];

Music21.IntervalSpecifiers = [
	Music21.IntervalSpecifiersEnum.QUADDMIN,
	Music21.IntervalSpecifiersEnum.TRPDIM,
	Music21.IntervalSpecifiersEnum.DBLDIM,
	Music21.IntervalSpecifiersEnum.DIMINISHED,
	Music21.IntervalSpecifiersEnum.MINOR,
	Music21.IntervalSpecifiersEnum.MAJOR,
	Music21.IntervalSpecifiersEnum.AUGMENTED,
	Music21.IntervalSpecifiersEnum.DBLAUG,
	Music21.IntervalSpecifiersEnum.TRPAUG,
	Music21.IntervalSpecifiersEnum.QUADAUG
];
Music21.IntervalMajOffset = 5;

Music21.IntervalSemitonesGeneric = {
	1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11
};
Music21.IntervalAdjustPerfect = {
	"P": 0, "A": 1, "AA": 2, "AAA": 3, "AAAA": 4,
	"d": -1, "dd": -2, "ddd": -3, "dddd": -4
}; // offset from Perfect

Music21.IntervalAdjustImperf = {
	"M": 0, "m": -1, "A": 1, "AA": 2, "AAA": 3, "AAAA": 4,
	"d": -2, "dd": -3, "ddd": -4, "dddd": -5
}; // offset from major




Music21.DiatonicInterval = function (specifier, generic) {
	this.classes = ['DiatonicInterval'];

	if (specifier == undefined) {
		specifier = "P";
	}
	if (generic == undefined) {
		generic = new Music21.GenericInterval();
	}
	
	this.name = "";
	this.specifier = Music21.IntervalPrefixSpecs.indexOf(specifier); // todo: convertSpecifier();
	this.generic = generic;
	
	if ((generic.undirected != 1) || (specifier == Music21.IntervalSpecifiersEnum.PERFECT)) {
		this.direction = generic.direction;
	} else {
		// diminished unisons -- very controversial
		if (Music21.IntervalPerfSpecifiers.indexOf(specifier) <= Music21.IntervalPerfSpecifiers.indexOf(Music21.IntervalSpecifiersEnum.DIMINISHED)) {
			this.direction = Music21.IntervalDirections.DESCENDING;
		} else {
			this.direction = Music21.IntervalDirections.ASCENDING;
		}
	}
	var diatonicDirectionNiceName = Music21.IntervalDirectionTerms[this.direction + 1];
	this.name = Music21.IntervalPrefixSpecs[this.specifier] + generic.undirected.toString();
	this.niceName = Music21.IntervalNiceSpecNames[this.specifier] + " " + generic.niceName;
	this.simpleName = Music21.IntervalPrefixSpecs[this.specifier] + generic.simpleUndirected.toString();
	this.simpleNiceName = Music21.IntervalNiceSpecNames[this.specifier] + " " + generic.simpleNiceName;
	this.semiSimpleName = Music21.IntervalPrefixSpecs[this.specifier] + generic.semiSimpleUndirected.toString();
	this.semiSimpleNiceName = Music21.IntervalNiceSpecNames[this.specifier] + " " + generic.semiSimpleNiceName;
	this.directedName = Music21.IntervalPrefixSpecs[this.specifier] + generic.directed.toString();
	this.directedNiceName = diatonicDirectionNiceName + " " + this.niceName;
	this.directedSimpleName = Music21.IntervalPrefixSpecs[this.specifier] + generic.simpleDirected.toString();
	this.directedSimpleNiceName = diatonicDirectionNiceName + " " + this.simpleNiceName;
	this.directedSemiSimpleName = Music21.IntervalPrefixSpecs[this.specifier] + generic.semiSimpleDirected.toString();
	this.directedSemiSimpleNiceName = diatonicDirectionNiceName + " " + this.semiSimpleNameName;
	this.specificName = Music21.IntervalNiceSpecNames[this.specifier];

	

	this.perfectable = generic.perfectable;
	this.isDiatonicStep = generic.isDiatonicStep;
	this.isStep = generic.isStep;
	
	// generate inversions
	if (this.perfectable) {
		this.orderedSpecifierIndex = Music21.IntervalOrderedPerfSpecs.indexOf(Music21.IntervalPrefixSpecs[this.specifier]);
		this.invertedOrderedSpecIndex = (Music21.IntervalOrderedPerfSpecs.length - 1 - this.orderedSpecifierIndex);
		this.invertedOrderedSpecifier = Music21.IntervalOrderedPerfSpecs[this.invertedOrderedSpecIndex];
	} else {
		this.orderedSpecifierIndex = Music21.IntervalOrderedImperfSpecs.indexOf(Music21.IntervalPrefixSpecs[this.specifier]);
		this.invertedOrderedSpecIndex = (Music21.IntervalOrderedImperfSpecs.length - 1 - this.orderedSpecifierIndex);
		this.invertedOrderedSpecifier = Music21.IntervalOrderedImperfSpecs[this.invertedOrderedSpecIndex];
	}

	this.mod7inversion = this.invertedOrderedSpecifier + generic.mod7inversion.toString();
	/* ( if (this.direction == Music21.IntervalDirections.DESCENDING) {
		this.mod7 = this.mod7inversion;
	} else {
		this.mod7 = this.simpleName;
	} */

	// TODO: reverse()
	// TODO: property cents
	
	
	this.getChromatic = function () {
		var octaveOffset = Math.floor(Math.abs(this.generic.staffDistance)/7);
		var semitonesStart = Music21.IntervalSemitonesGeneric[this.generic.simpleUndirected];
		var specName = Music21.IntervalPrefixSpecs[this.specifier];
		
		var semitonesAdjust = 0;
		if (this.generic.perfectable) {
			semitonesAdjust = Music21.IntervalAdjustPerfect[specName];
		} else {
			semitonesAdjust = Music21.IntervalAdjustImperf[specName];
		}

		var semitones = (octaveOffset * 12) + semitonesStart + semitonesAdjust;
		

		// direction should be same as original
		
		if (this.generic.direction == Music21.IntervalDirections.DESCENDING) {
			semitones *= -1;	
		}
		if (Music21.debug) {
			console.log('DiatonicInterval.getChromatic -- octaveOffset: ' + octaveOffset);
			console.log('DiatonicInterval.getChromatic -- semitonesStart: ' + semitonesStart);
			console.log('DiatonicInterval.getChromatic -- specName: ' + specName);
			console.log('DiatonicInterval.getChromatic -- semitonesAdjust: ' + semitonesAdjust);
			console.log('DiatonicInterval.getChromatic -- semitones: ' + semitones);
		}
		return new Music21.ChromaticInterval(semitones);
	};
};

Music21.ChromaticInterval = function (value) {
	this.classes = ['ChromaticInterval'];
	
	this.semitones = value;
	this.cents = Math.round(value * 100.0, 5);
	this.directed = value;
	this.undirected = Math.abs(value);
	
	if (this.directed == 0) {
		this.direction = Music21.IntervalDirections.OBLIQUE;
	} else if (this.directed == this.undirected) {
		this.direction = Music21.IntervalDirections.ASCENDING;	
	} else {
		this.direction = Music21.IntervalDirections.DESCENDING;
	}

	this.mod12 = this.semitones % 12;
	this.simpleUndirected = this.undirected % 12;
	if (this.direction == Music21.IntervalDirections.DESCENDING) {
		this.simpleDirected = -1 * this.simpleUndirected;
	} else {
		this.simpleDirected = this.simpleUndirected;
	}
	
	this.intervalClass = this.mod12;
	if (this.mod12 > 6) { 
		this.intervalClass = 12 - this.mod12;
	}

	if (this.undirected == 1) {
		this.isChromaticStep = true;
	} else {
		this.isChromaticStep = false;
	}
	
	this.reverse = function () {
		return new Music21.ChromaticInterval(this.undirected * (-1 * this.direction));
	};
	
	// TODO: this.getDiatonic()
	
	// N.B. -- transposePitch will not work until changing ps changes name, etc.
	this.transposePitch = function (p) {
		var useImplicitOctave = false;
		if (p.octave == undefined) {
			// not yet implemented in m21j
			useImplicitOctave = true;
		}
		var pps = p.ps;
		newPitch = new Music21.Pitch();
		newPitch.ps = pps + this.semitones;
		if (useImplicitOctave) {
			newPitch.octave = undefined;
		}
		return newPitch;
	};
};

Music21.IntervalStepNames = ['C','D','E','F','G','A','B'];

Music21.IntervalConvertDiatonicNumberToStep = function (dn) {
	varStepNumber = undefined;
	varOctave = undefined;
	if (dn == 0) {
		return ["B", -1];
	} else if (dn > 0) {
		octave = Math.floor( (dn-1) / 7 );
		stepNumber = (dn - 1) - (octave * 7);
	} else { // low notes... test, because js(floor) != py(int);
		octave = Math.floor(dn/7);
		stepNumber = (dn - 1) - ( (octave + 1) * 7);
	}
	var stepName = Music21.IntervalStepNames[stepNumber];
	return [stepName, octave];
};

Music21.Interval = function () {
	this.classes = ['Interval'];

	// todo: allow full range of ways of specifying as in m21p
	if (arguments.length == 1) {
		var arg0 = arguments[0];
		if (typeof(arg0) == 'string') {
			// simple...
			var specifier = arg0.slice(0,1);
			var generic = parseInt(arg0.slice(1));
			var gI = new Music21.GenericInterval(generic);
			var dI = new Music21.DiatonicInterval(specifier, gI);
			this.diatonic = dI;
			this.chromatic = this.diatonic.getChromatic();			
		} else if (arg0.specifier != undefined) {
			// assume diatonic...
			this.diatonic = arg0;
			this.chromatic = this.diatonic.getChromatic();
		} else {
			console.error('cant parse string arguments to Interval yet');
		}
	} else if (arguments.length == 2) {
		this.diatonic = arguments[0];
		this.chromatic = arguments[1];
	}
	
	this.reinit = function () {
		this.direction = this.chromatic.direction;
		this.specifier = this.diatonic.specifier;
		this.diatonicType = this.diatonic.specifier;
		// this.specificName = this.diatonic.specificName;
		this.generic = this.diatonic.generic;
		this.name = this.diatonic.name;
		// other names...
		this.isDiatonicStep = this.diatonic.isDiatonicStep;
		
		this.isChromaticStep = this.chromatic.isChromaticStep;
		this.semitones = this.chromatic.semitones;
		
		this.isStep = (this.isChromaticStep || this.isDiatonicStep);
	};

	// todo methods: isConsonant();
	// todo properties: complement, intervalClass, cents
	// todo general: microtones

	this.transposePitch = function (p) {
		// todo: reverse, clearAccidentalDisplay, maxAccidental;
		
		/*
		var useImplicitOctave = false;
		if (p.octave == undefined) {
			useImplicitOctave = true;
		}
		*/
		
		var pitch2 = new Music21.Pitch();
		pitch2.step = p.step;
		pitch2.octave = p.octave;
		// no accidental yet...

		var oldDiatonicNum = p.diatonicNoteNum;
		
		var distanceToMove = this.diatonic.generic.staffDistance;

		// if not reverse...
		var newDiatonicNumber = oldDiatonicNum + distanceToMove;
		var newInfo = Music21.IntervalConvertDiatonicNumberToStep(newDiatonicNumber);
		pitch2.step = newInfo[0];
		pitch2.octave = newInfo[1];
		// step and octave are right now, but not necessarily accidental
		var halfStepsToFix = this.chromatic.semitones - parseInt(pitch2.ps - p.ps);
		if (halfStepsToFix != 0) {
			pitch2.accidental = new Music21.Accidental(halfStepsToFix);
		}
		if (Music21.debug) {
			console.log('Interval.transposePitch -- distance to move' + distanceToMove);
			console.log('Interval.transposePitch -- old diatonic num' + oldDiatonicNum);
			console.log("Interval.transposePitch -- new step " + pitch2.step);
			console.log("Interval.transposePitch -- new diatonic number " + newDiatonicNumber);
			console.log("Interval.transposePitch -- new octave " + pitch2.octave);
			console.log("Interval.transposePitch -- fixing halfsteps for " + halfStepsToFix);
		}
		return pitch2;
	};

	this.reinit();
};


Music21.SimpleDiatonicScale = function(tonic, scaleSteps) {
	if (tonic == undefined) {
		tonic = new Music21.Pitch("C4");
	} else if ( ! (tonic instanceof Music21.Pitch) ) {
		throw("Cannot make a scale not from a Music21.Pitch object: " + tonic);
	}
	if (scaleSteps == undefined) {
		scaleSteps = ['M','M','m','M','M','M','m'];		
	}
	var gi = new Music21.GenericInterval(2);
	var pitches = [tonic];
	var lastPitch = tonic;
	for (var i = 0; i < scaleSteps.length; i++ ) {
		var di = new Music21.DiatonicInterval(scaleSteps[i], gi);
		var ii = new Music21.Interval(di);
		var newPitch = ii.transposePitch(lastPitch);
		if (Music21.debug) {
			console.log('ScaleSimpleMajor -- adding pitch: ' + newPitch.name);
		}
		pitches.push(newPitch);
		lastPitch = newPitch;
	}
	return pitches;
};

Music21.ScaleSimpleMajor = function (tonic) {
	var scaleSteps = ['M','M','m','M','M','M','m'];
	return new Music21.SimpleDiatonicScale(tonic, scaleSteps);
};

Music21.ScaleSimpleMinor = function (tonic, type) {
	var scaleSteps = ['M','m','M','M','m','M','M'];
	if (typeof(type) == 'string') {
		type = type.replace(/\s/g, "-");
	}
	if (type == 'harmonic' || type == 'harmonic-minor') {
		scaleSteps[5] = 'A';
		scaleSteps[6] = 'm';
	} else if (type == 'melodic' || type == 'melodic-ascending'
		|| type == 'melodic-minor' || type == 'melodic-minor-ascending') {
		scaleSteps[4] = 'M';
		scaleSteps[6] = 'm';
	}
	return new Music21.SimpleDiatonicScale(tonic, scaleSteps);
};


Music21.RenderNotationDivs = function (classTypes) {
	if (classTypes == undefined) {
		classTypes = '.tinyNotation';
	}
	var allRender = $(classTypes);
	for (var i = 0 ; i < allRender.length ; i ++) {
		var thisTN = allRender[i];
		var thisTNContents = thisTN.innerText;
		if (String.prototype.trim != undefined) {
			thisTNContents = thisTNContents.trim(); // remove leading, trailing whitespace
		}
		if (thisTNContents != "") {
			var st = Music21.TinyNotation(thisTNContents);
			var newCanvas = st.createPlayableCanvas();
			$(thisTN).attr("tinyNotationContents", thisTNContents);
			$(thisTN).empty();
			$(thisTN).append(newCanvas);
			//console.log(thisTNContents);		
		}
	}
};