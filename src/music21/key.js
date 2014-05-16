/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/key -- KeySignature and Key objects
 * 
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define(['music21/baseObjects', 'music21/pitch', 'music21/interval', 'music21/scale'], function(require) {
	var key = {};

	key.KeySignature = function(sharps) {
		music21.baseObjects.Music21Object.call(this);
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

	key.KeySignature.prototype = new music21.baseObjects.Music21Object();
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

	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.key = key;
	}		
	return key;
});