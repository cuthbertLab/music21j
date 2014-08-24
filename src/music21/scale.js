/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/scale -- Scales
 * 
 * Does not implement the full range of scales from music21p
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define(['./pitch', './interval'], 
        function(pitch, interval) {
	var scale = {};

	scale.SimpleDiatonicScale = function(tonic, scaleSteps) {
		if (tonic == undefined) {
			tonic = new pitch.Pitch("C4");
		} else if ( ! (tonic instanceof pitch.Pitch) ) {
			throw("Cannot make a scale not from a music21.pitch.Pitch object: " + tonic);
		}
		if (scaleSteps == undefined) {
			scaleSteps = ['M','M','m','M','M','M','m'];		
		}
		var gi = new interval.GenericInterval(2);
		var pitches = [tonic];
		var lastPitch = tonic;
		for (var i = 0; i < scaleSteps.length; i++ ) {
			var di = new interval.DiatonicInterval(scaleSteps[i], gi);
			var ii = new interval.Interval(di);
			var newPitch = ii.transposePitch(lastPitch);
			if (music21.debug) {
				console.log('ScaleSimpleMajor -- adding pitch: ' + newPitch.name);
			}
			pitches.push(newPitch);
			lastPitch = newPitch;
		}
		return pitches;
	};

	scale.ScaleSimpleMajor = function (tonic) {
		var scaleSteps = ['M','M','m','M','M','M','m'];
		return new scale.SimpleDiatonicScale(tonic, scaleSteps);
	};

	scale.ScaleSimpleMinor = function (tonic, minorType) {
		var scaleSteps = ['M','m','M','M','m','M','M'];
		if (typeof(minorType) == 'string') {
			// "harmonic minor" -> "harmonic-minor"
			minorType = minorType.replace(/\s/g, "-");
		}
		if (minorType == 'harmonic' || minorType == 'harmonic-minor') {
			scaleSteps[5] = 'A';
			scaleSteps[6] = 'm';
		} else if (minorType == 'melodic' || minorType == 'melodic-ascending'
			|| minorType == 'melodic-minor' || minorType == 'melodic-minor-ascending') {
			scaleSteps[4] = 'M';
			scaleSteps[6] = 'm';
		}
		return new scale.SimpleDiatonicScale(tonic, scaleSteps);
	};

	// end of define
	if (typeof(music21) != "undefined") {
		music21.scale = scale;
	}		
	return scale;
});