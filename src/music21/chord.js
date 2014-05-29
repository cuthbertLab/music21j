/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/chord -- Chord
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */


define(['music21/note'], function(require) {
	var chord = {};
	chord.Chord = function (noteArray) {
		if (typeof(noteArray) == 'undefined') {
			noteArray = [];
		}
		music21.note.NotRest.call(this);
		this.classes.push('Chord');
		this.isChord = true; // for speed
        this.isNote = false; // for speed
        this.isRest = false; // for speed
		
	    this._noteArray = [];
		
		this.add = function (noteObj) {
		    // takes in either a note or a pitch
			if (typeof(noteObj) == 'string') {	
				noteObj = new music21.note.Note(noteObj);
			} else if (noteObj.isClassOrSubclass('Pitch')) {
				var pitchObj = noteObj;
				var noteObj2 = new music21.note.Note();
				noteObj2.pitch = pitchObj;
				noteObj = noteObj2;
			}
			this._noteArray.push(noteObj);
			// inefficient because sorts after each add, but safe and #(p) is small
	        this._noteArray.sort( function(a,b) { return a.pitch.ps - b.pitch.ps; }); 
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
			var closedChord = new chord.Chord(nonDuplicatingPitches);
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
	        'length' : {
                enumerable: true,
	            get: function () { return this._noteArray.length; }
	        },
	    	'pitches': {
	    	    enumerable: true,
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
	    					addNote = new music21.note.Note(tempPitches[i]);
	    				} else if (tempPitches[i].isClassOrSubclass('Pitch')) {
	    					addNote = new music21.note.Note();
	    					addNote.pitch = tempPitches[i];
	    				} else if (tempPitches[i].isClassOrSubclass('Note')) {
	    					addNote = tempPitches[i];
	    				} else {
	    				    console.warn('bad pitch', tempPitches[i]);
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
		noteArray.forEach( this.add, this );

	};

	chord.Chord.prototype = new music21.note.NotRest();
	chord.Chord.prototype.constructor = chord.Chord;

	chord.chordDefinitions = {
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
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.chord = chord;
	}		
	return chord;
});