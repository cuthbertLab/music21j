/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/key -- KeySignature and Key objects
 * 
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define(['./base', './pitch', './interval', './scale'], 
        /**
         * key and keysignature module. See {@link music21.key} namespace for details
         * 
         * @exports music21/key
         */
        function(base, pitch, interval, scale) {
    /**
     * Key and KeySignature related objects and methods
     * 
     * @namespace music21.key
     * @memberof music21
     * @requires music21/base
     * @requires music21/pitch
     * @requires music21/interval
     * @requires music21/scale
     */
	var key = {};
	
	key.modeSharpsAlter = {
	        'major': 0,
            'minor': -3,
            'dorian': -2,
            'phrygian': -4,
            'lydian': 1,
            'mixolydian': -1,
            'locrian': -5,
     }
	
	/**
	 * @class KeySignature
	 * @memberof music21.key
	 * @description Represents a key signature
	 * @param {Int} [sharps=0] -- the number of sharps (negative for flats)
     * @property {Int} [sharps=0] -- number of sharps (negative for flats)
     * @extends music21.base.Music21Object
     * @example
     * var ks = new music21.key.KeySignature(-3); //E-flat major or c minor
     * var s = new music21.stream.Stream();
     * s.keySignature = ks;
     * var n = new music21.note.Note('A-'); // A-flat
     * s.append(n);
     * s.appendNewCanvas();
	 */
	key.KeySignature = function(sharps) {
		base.Music21Object.call(this);
		this.classes.push('KeySignature');
		this._sharps = sharps || 0; // if undefined
		this._alteredPitchesCache = undefined;
		
		// 12 flats/sharps enough for now...
		this.flatMapping = ['C','F','B-','E-','A-','D-','G-','C-','F-','B--','E--','A--','D--'];
		this.sharpMapping = ['C','G','D','A','E','B','F#','C#','G#','D#','A#','E#','B#'];

        Object.defineProperties(this, {
            'sharps' : {
              enumerable: true,
              configurable: true,
              get: function () { return this._sharps; },
              set: function (s) { this._alteredPitchesCache = [] ; this._sharps = s; }
            },
            /**
             * Gives the width in pixels necessary to represent the key signature.
             * 
             * @memberof music21.key.KeySignature#
             * @var {number} width
             * @readonly
             */
            'width' : {
                enumerable: true,
                configurable: true,
                get: function () { return 5 * Math.abs(this.sharps) ; },                
            },
            /**
             * An Array of Altered Pitches in KeySignature order (i.e., for flats, Bb, Eb, etc.)
             * 
             * @memberof music21.key.KeySignature#
             * @var {Array<music21.pitch.Pitch>} alteredPitches
             * @readonly
             * @example
             * var ks = new music21.key.KeySignature(3)
             * var ap = ks.alteredPitches
             * var apName = [];
             * for (var i = 0; i < ap.length; i++) {
             *     apName.push(ap[i].name);
             * }
             * apName
             * // ["F#", "C#", "G#"]
             */
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
					var transInterval = new interval.Interval(transStr);
					var post = [];
					var pKeep = new pitch.Pitch(startPitch);
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
	
    key.KeySignature.prototype = new base.Music21Object();
	key.KeySignature.prototype.constructor = key.KeySignature;

	
    /**
     * Return the name of the major key with this many sharps
     * 
     * @memberof music21.key.KeySignature
     * @returns {(string|undefined)} name of key
     * @example
     * var ks = new music21.key.KeySignature(-3)
     * ks.majorName()
     * // "E-"
     */
    key.KeySignature.prototype.majorName = function () {
        if (this.sharps >= 0) {
            return this.sharpMapping[this.sharps];
        } else {
            return this.flatMapping[Math.abs(this.sharps)];
        }
    };
    /**
     * Return the name of the minor key with this many sharps
     * @memberof music21.key.KeySignature
     * @returns {(string|undefined)}
     */
    key.KeySignature.prototype.minorName = function() {
        var tempSharps = this.sharps + 3;
        if (tempSharps >= 0) {
            return this.sharpMapping[tempSharps];
        } else {
            return this.flatMapping[Math.abs(tempSharps)];
        }
    };
    
    /**
     * returns the vexflow name (just the `majorName()` with "b" for "-") for
     * the key signature.  Does not create the object.
     * 
     * Deprecated.
     * 
     * @memberof music21.key.KeySignature
     * @returns {string}
     */
    key.KeySignature.prototype.vexflow = function() {
        var tempName = this.majorName();
        return tempName.replace(/\-/g, "b");
    };
    /**
     * Returns the accidental associated with a step in this key, or undefined if none.
     * 
     * @memberof music21.key.KeySignature
     * @param {string} step - a valid step name such as "C","D", etc., but not "C#" etc.
     * @returns {(music21.pitch.Accidental|undefined)}
     */
    key.KeySignature.prototype.accidentalByStep = function(step) {
        var aps = this.alteredPitches;
        for (var i = 0; i < aps.length; i++) {
            if (aps[i].step == step) {
                if (aps[i].accidental == undefined) {
                    return undefined;
                }
                // make a new accidental;
                return new pitch.Accidental(aps[i].accidental.alter);
            }
        }
        return undefined;
    };
    /**
     * Takes a pitch in C major and transposes it so that it has
     * the same step position in the current key signature.
     * 
     * @memberof music21.key.KeySignature
     * @returns {music21.pitch.Pitch}
     * @example
     * var ks = new music21.key.KeySignature(-3)
     * var p1 = new music21.pitch.Pitch('B')
     * var p2 = ks.transposePitchFromC(p1)
     * p2.name
     * // "D"
     * var p3 = new music21.pitch.Pitch('G-')
     * var p4 = ks.transposePitchFromC(p3)
     * p4.name
     * // "B--"
     */
    key.KeySignature.prototype.transposePitchFromC = function(p) {
        var transInterval = undefined;
        var transTimes = undefined;
        if (this.sharps == 0) {
            return new pitch.Pitch(p.nameWithOctave);
        } else if (this.sharps < 0) {
            transTimes = Math.abs(this.sharps);
            transInterval = new interval.Interval("P4");
        } else {
            transTimes = this.sharps;
            transInterval = new interval.Interval("P5");
        }
        var newPitch = p;
        for (var i = 0; i < transTimes; i++) {
            newPitch = transInterval.transposePitch(newPitch);
            if ((i % 2) == 1) {
                newPitch.octave = newPitch.octave - 1;
            }
        } 
        return newPitch;
    };

    /**
     * Create a Key object. Like a KeySignature but with ideas about Tonic, Dominant, etc.
     * 
     * TODO: allow keyName to be a {@link music21.pitch.Pitch}
     * 
     * @class Key
     * @memberof music21.key
     * @extends music21.key.KeySignature
     * @param {string} keyName -- a pitch name representing the key (w/ "-" for flat)
     * @param {string} [mode] -- if not given then the CASE of the keyName will be used ("C" => "major", "c" => "minor")
     */
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
		var modeShift = key.modeSharpsAlter[mode] || 0;
		var sharps = sharpsIndex + modeShift - 11;
		if (music21.debug) {
			console.log("Found sharps " + sharps + " for key: " + keyName);
		}
		key.KeySignature.call(this, sharps);
		this.tonic = keyName;
		this.mode = mode;
		
	};

	key.Key.prototype = new key.KeySignature();
	key.Key.prototype.constructor = key.Key;
	
	/**
	 * returns a {@link music21.scale.ScaleSimpleMajor} or {@link music21.scale.ScaleSimpleMinor}
	 * object from the pitch object.
	 * 
	 * @memberof music21.key.Key
	 * @param {string|undefined} [scaleType=this.mode] - the type of scale, or the mode.
	 * @returns {object} A music21.scale.Scale subclass.
	 */
    key.Key.prototype.getScale = function (scaleType) {
        if (scaleType == undefined) {
            scaleType = this.mode;
        }
        var pitchObj = new pitch.Pitch(this.tonic);
        if (scaleType == 'major') {
            return scale.ScaleSimpleMajor(pitchObj);
        } else {
            return scale.ScaleSimpleMinor(pitchObj, scaleType);
        }
    };

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
	            equal (foundSharps, 
	                    expectedSharps, 
	                    "Test sharps: " + givenKeyName + " (mode: " + givenMode + ") ");
	            equal (foundMode, 
	                    expectedMode, 
	                    "Test mode: " + givenKeyName + " (mode: " + givenMode + ") ");
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
	        
	        equal(k.width, 15, 'checking width is 5 * abs(sharps)');
	    });

	};
	// end of define
	if (typeof(music21) != "undefined") {
		music21.key = key;
	}		
	return key;
});