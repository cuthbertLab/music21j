/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/key -- KeySignature and Key objects
 * 
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define(['music21/base', 'music21/pitch', 'music21/interval', 'music21/scale'], function(require) {
	var key = {};

	key.KeySignature = function(sharps) {
		music21.base.Music21Object.call(this);
		this.classes.push('KeySignature');
		this._sharps = sharps || 0; // if undefined
		this.mode = 'major';
		this._alteredPitchesCache = undefined;
		
		// 9 flats/sharps enough for now...
		this.flatMapping = ['C','F','B-','E-','A-','D-','G-','C-','F-','B--'];
		this.sharpMapping = ['C','G','D','A','E','B','F#','C#','G#','D#'];

        Object.defineProperties(this, {
            'sharps' : {
              enumerable: true,
              configurable: true,
              get: function () { return this._sharps },
              set: function (s) { this._alteredPitchesCache = [] ; this._sharps = s }
            },
        });
		
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
					return new music21.pitch.Accidental(aps[i].accidental.alter);
				}
			}
			return undefined;
		};
		this.transposePitchFromC = function(pitch) {
			var transInterval = undefined;
			var transTimes = undefined;
			if (this.sharps == 0) {
				return new music21.pitch.Pitch(pitch.nameWithOctave);
			} else if (this.sharps < 0) {
				transTimes = Math.abs(this.sharps);
				transInterval = new music21.interval.Interval("P4");
			} else {
				transTimes = this.sharps;
				transInterval = new music21.interval.Interval("P5");
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
					var transInterval = new music21.interval.Interval(transStr);
					var post = [];
					var pKeep = new music21.pitch.Pitch(startPitch);
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

	key.KeySignature.prototype = new music21.base.Music21Object();
	key.KeySignature.prototype.constructor = key.KeySignature;

	key.Key = function (keyName, mode) {
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
		if (music21.debug) {
			console.log("Found sharps " + sharps + " for key: " + keyName);
		}
		key.KeySignature.call(this, sharps);
		this.tonic = keyName;
		this.mode = mode;
		
		this.getScale = function (scaleType) {
			if (scaleType == undefined) {
				scaleType = this.mode;
			}
			var pitchObj = new music21.pitch.Pitch(this.tonic);
			if (scaleType == 'major') {
				return music21.scale.ScaleSimpleMajor(pitchObj);
			} else {
				return music21.scale.ScaleSimpleMinor(pitchObj, scaleType);
			}
		};
	};

	key.Key.prototype = new key.KeySignature();
	key.Key.prototype.constructor = key.Key;

	key.tests = function () {

	    test ( "music21.key.Key" , function() {
	        var testSharps = [
	           // sharps, mode, given name, given mode
	           [0, 'minor', 'a'],
	           [0, 'major', 'C'],
	           [0, 'major'],
	           [6, 'major', 'F#'],
	           [3, 'minor', 'f#'],
	           [6, 'major', 'f#', 'major'],
	           [-2, 'major', 'B-'],
	           [-5, 'minor', 'b-'],
	        ];
	        for (var i = 0; i < testSharps.length; i++ ) {
	            var thisTest = testSharps[i];
	            var expectedSharps = thisTest[0];
	            var expectedMode = thisTest[1];
	            var givenKeyName = thisTest[2];
	            var givenMode = thisTest[3];
	            var k = new music21.key.Key(givenKeyName, givenMode);
	            var foundSharps = k.sharps;
	            var foundMode = k.mode;
	            equal (foundSharps, expectedSharps, "Test sharps: " + givenKeyName + " (mode: " + givenMode + ") ");
	            equal (foundMode, expectedMode, "Test mode: " + givenKeyName + " (mode: " + givenMode + ") ");
	        }

	        var k = new music21.key.Key("f#");
	        var s = k.getScale();
	        equal (s[2].nameWithOctave, "A4", "test minor scale");
	        equal (s[6].nameWithOctave, "E5");
	        s = k.getScale('major');
	        equal (s[2].nameWithOctave, "A#4", "test major scale");
	        equal (s[6].nameWithOctave, "E#5");
	        s = k.getScale("harmonic minor");
	        equal (s[2].nameWithOctave, "A4", "test harmonic minor scale");
	        equal (s[5].nameWithOctave, "D5");
	        equal (s[6].nameWithOctave, "E#5");
	    });

	}
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.key = key;
	}		
	return key;
});