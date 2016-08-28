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
import { pitch } from './pitch';
import { interval } from './interval';

        /**
         * Scale module. See {@link music21.scale} namespace
         *
         * @exports music21/scale
         */
    /**
     * Scale namespace.  Right now only supports very simple scales.
     *
     * @namespace music21.scale
     * @memberof music21
     * @requires music21/pitch
     * @requires music21/interval
     */
export	const scale = {};

	/**
	 * Function, not class
	 *
	 * @function music21.scale.SimpleDiatonicScale
	 * @param {music21.pitch.Pitch} tonic
	 * @param {Array<string>} scaleSteps - an array of diatonic prefixes, generally 'M' (major) or 'm' (minor) describing the seconds.
	 * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
	 */
	scale.SimpleDiatonicScale = function(tonic, scaleSteps) {
		                                        if (tonic == undefined) {
			                                        tonic = new pitch.Pitch('C4');
		} else if (!(tonic instanceof pitch.Pitch)) {
			                                        throw ('Cannot make a scale not from a music21.pitch.Pitch object: ' + tonic);
		}
		                                        if (scaleSteps == undefined) {
			                                        scaleSteps = ['M', 'M', 'm', 'M', 'M', 'M', 'm'];
		}
		                                const gi = new interval.GenericInterval(2);
		                                const pitches = [tonic];
		                                    let lastPitch = tonic;
		                                        for (let i = 0; i < scaleSteps.length; i++) {
			                                const di = new interval.DiatonicInterval(scaleSteps[i], gi);
			                                const ii = new interval.Interval(di);
			                                const newPitch = ii.transposePitch(lastPitch);
			                                        if (music21.debug) {
				                                        console.log('ScaleSimpleMajor -- adding pitch: ' + newPitch.name);
			}
			                                        pitches.push(newPitch);
			                                        lastPitch = newPitch;
		}
		                                        return pitches;
	};

	/**
	 * One octave of a major scale
	 *
	 * @function music21.scale.ScaleSimpleMajor
     * @param {music21.pitch.Pitch} tonic
     * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
	 */
	scale.ScaleSimpleMajor = function(tonic) {
		                                const scaleSteps = ['M', 'M', 'm', 'M', 'M', 'M', 'm'];
		                                        return new scale.SimpleDiatonicScale(tonic, scaleSteps);
	};

    /**
     * One octave of a minor scale
     *
     * @function music21.scale.ScaleSimpleMinor
     * @param {music21.pitch.Pitch} tonic
     * @param {string} [minorType='natural] - 'harmonic', 'harmonic-minor', 'melodic', 'melodic-minor', 'melodic-minor-ascending', 'melodic-ascending' or other (=natural/melodic-descending)
     * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
     */
	scale.ScaleSimpleMinor = function(tonic, minorType) {
		                                const scaleSteps = ['M', 'm', 'M', 'M', 'm', 'M', 'M'];
		                                        if (typeof (minorType) == 'string') {
			// "harmonic minor" -> "harmonic-minor"
			                                        minorType = minorType.replace(/\s/g, '-');
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

