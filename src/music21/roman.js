/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/roman -- roman.RomanNumberal -- Chord subclass
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

define(['music21/chord', 'music21/key', 'music21/pitch', 'music21/interval'], function(require) {
	var roman = {};

	roman.romanToNumber = [undefined, 'i','ii','iii','iv','v','vi','vii'];

	roman.RomanNumeral = function (figure, keyStr) {
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
		music21.chord.Chord.call(this);
		
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
	    				var tonicPitch = new music21.pitch.Pitch(this.key.tonic);
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
	    	var chordSpacing = music21.chord.chordDefinitions[impliedQuality];
	    	var chordPitches = [this.root];
			var lastPitch = this.root;
			for (var j = 0; j < chordSpacing.length; j++) {
				var thisTransStr = chordSpacing[j];
				var thisTrans = new music21.interval.Interval(thisTransStr);
				var nextPitch = thisTrans.transposePitch(lastPitch);
				chordPitches.push(nextPitch);
				lastPitch = nextPitch;
			}
			this.pitches = chordPitches;
	    };
	    
		this.key = undefined;
		if (typeof(keyStr) == 'string') {
			this.key = new music21.key.Key(keyStr);
		} else if (typeof(keyStr) == 'undefined') {
			this.key = new music21.key.Key('C');
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
		
		var scaleDegree = roman.romanToNumber.indexOf(currentFigure.toLowerCase());
		if (scaleDegree == -1) {
			throw("Cannot make a romanNumeral from " + currentFigure);
		}
		this.scaleDegree = scaleDegree;
		this.root = this.scale[this.scaleDegree - 1];
		
		if (this.key.mode == 'minor' && (this.scaleDegree == 6 || this.scaleDegree == 7)) {
			if (['minor','diminished','half-diminished'].indexOf(impliedQuality) != -1) {
				var raiseTone = new music21.interval.Interval('A1');
				this.root = raiseTone.transposePitch(this.root);
				if (music21.debug) {
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

	roman.RomanNumeral.prototype = new music21.chord.Chord();
	roman.RomanNumeral.prototype.constructor = roman.RomanNumeral;
	
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.roman = roman;
	}		
	return roman;
});