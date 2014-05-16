/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/tinyNotation -- TinyNotation implementation
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define(['music21/baseObjects','music21/pitch','music21/note'], function(require) {
	var tinyNotation = {};
	tinyNotation.regularExpressions = {  
			REST    : /r/,
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

	tinyNotation.TinyNotation = function (textIn) {
		var tokens = textIn.split(" ");
		var s = new music21.stream.Measure();
		var lastDuration = 1.0;
		var tnre = tinyNotation.regularExpressions; // faster typing
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
				noteObj = new music21.note.Rest(lastDuration);
			} else if (MATCH = tnre.OCTAVE2.exec(token)) {
				noteObj = new music21.note.Note(MATCH[1], lastDuration);
				noteObj.pitch.octave = 4 - MATCH[0].length;
			} else if (MATCH = tnre.OCTAVE3.exec(token)) {
				noteObj = new music21.note.Note(MATCH[1], lastDuration);
				noteObj.pitch.octave = 3;
			} else if (MATCH = tnre.OCTAVE5.exec(token)) {
				// must match octave 5 before 4
				noteObj = new music21.note.Note(MATCH[1].toUpperCase(), lastDuration);
				noteObj.pitch.octave = 3 + MATCH[0].length;
			} else if (MATCH = tnre.OCTAVE4.exec(token)) {
				noteObj = new music21.note.Note(MATCH[1].toUpperCase(), lastDuration);
				noteObj.pitch.octave = 4;
			}
			
			if (noteObj == undefined) {
				continue;
			}
			
			if (tnre.SHARP.exec(token)) {
				noteObj.pitch.accidental = new music21.pitch.Accidental('sharp');
			} else if (tnre.FLAT.exec(token)) {
				noteObj.pitch.accidental = new music21.pitch.Accidental('flat');
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

	// end of define
	if (typeof(music21) != "undefined") {
		music21.tinyNotation = tinyNotation;
	}		
	return tinyNotation;
});