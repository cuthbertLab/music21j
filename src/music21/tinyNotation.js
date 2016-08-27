/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/tinyNotation -- TinyNotation implementation
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
import { base } from './base';
import { clef } from './clef';
import { duration } from './duration';
import { pitch } from './pitch';
import { note } from './note';
import { meter } from './meter';
import { stream } from './stream';
import { tie } from './tie';

/**
 * TinyNotation module, see {@link music21.tinyNotation} namespace
 * 
 * @exports music21/tinyNotation
 */        
/**
 * @namespace music21.tinyNotation
 * @memberof music21
 * @requires music21/base
 * @requires music21/clef
 * @requires music21/duration
 * @requires music21/pitch
 * @requires music21/note
 * @requires music21/meter
 * @requires music21/stream
 * @requires music21/tie
 */    
export var tinyNotation = {};

/**
 * Regular expressions object
 * 
 * @memberof music21.tinyNotation
 */
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
        NAT     : /^[A-Ga-g]+\'*n/,  // explicit naturals
        TYPE    : /(\d+)/,
        TIE     : /.\~/, // not preceding ties
        PRECTIE : /\~/,  // front ties
        ID_EL   : /\=([A-Za-z0-9]*)/,
        LYRIC   : /\_(.*)/,
        DOT     : /\.+/,
        TIMESIG : /(\d+)\/(\d+)/,
        
        TRIP    : /trip\{/,
        QUAD    : /quad\{/,
        ENDBRAC : /\}$/,
	  };
/**
 * Function, not class.
 * 
 * Converts a TinyNotation String into a music21 Stream
 * 
 * See music21p for examples of what can go into tinynotation. It's an
 * adaptation of Lilypond format, by design Extremely simple!
 * 
 * @memberof music21.tinyNotation
 * @param {string} textIn - a valid tinyNotation string
 * @returns {music21.stream.Part|music21.stream.Measure} - a Stream or Part object (if multiple measures)
 * @example
 * var t = "3/4 c4 B8 c d4 e2.";
 * var p = music21.tinyNotation.TinyNotation(t);
 * p.duration.quarterLength;
 * // 6.0
 */
tinyNotation.TinyNotation = function (textIn) {
    textIn = textIn.trim();
	var tokens = textIn.split(" ");
	var p = new stream.Part();
	var m = new stream.Measure();
	var currentTSBarDuration = 4.0;		
	var lastDurationQL = 1.0;
	var storedDict = {
	        lastNoteTied: false,
	        inTrip: false,
	        inQuad: false,
	        endTupletAfterNote: false,
	};
	var tnre = tinyNotation.regularExpressions; // faster typing
	for (var i = 0; i < tokens.length; i++ ) {
	    // check at first so that a full measure but not over full
	    // gets returned as a stream.Measure object.
        if (m.duration.quarterLength >= currentTSBarDuration) {
            p.append(m);
            m = new stream.Measure();
        }

	    var token = tokens[i];
		var noteObj = undefined;
		var MATCH;
		if (MATCH = tnre.TRIP.exec(token)) {
		    token = token.slice(5); // cut...
		    storedDict.inTrip = true;
		}
        if (MATCH = tnre.QUAD.exec(token)) {
            token = token.slice(5); // cut...
            storedDict.inQuad = true;
        }
        if (MATCH = tnre.ENDBRAC.exec(token)) {
            token = token.slice(0,-1); // cut...
            storedDict.endTupletAfterNote = true;
        }

		
		if (MATCH = tnre.TIMESIG.exec(token)) {
            var ts = new meter.TimeSignature();
			ts.numerator = parseInt(MATCH[1]);
			ts.denominator = parseInt(MATCH[2]);
			m.timeSignature = ts;
			currentTSBarDuration = ts.barDuration.quarterLength;
			//console.log(currentTSBarDuration);
			continue;
		} else if (tnre.REST.exec(token)) {
			noteObj = new note.Rest(lastDurationQL);
		} else if (MATCH = tnre.OCTAVE2.exec(token)) {
			noteObj = new note.Note(MATCH[1], lastDurationQL);
			noteObj.pitch.octave = 4 - MATCH[0].length;
		} else if (MATCH = tnre.OCTAVE3.exec(token)) {
			noteObj = new note.Note(MATCH[1], lastDurationQL);
			noteObj.pitch.octave = 3;
		} else if (MATCH = tnre.OCTAVE5.exec(token)) {
			// must match octave 5 before 4
			noteObj = new note.Note(MATCH[1].toUpperCase(), lastDurationQL);
			noteObj.pitch.octave = 3 + MATCH[0].length;
		} else if (MATCH = tnre.OCTAVE4.exec(token)) {
			noteObj = new note.Note(MATCH[1].toUpperCase(), lastDurationQL);
			noteObj.pitch.octave = 4;
		}
		
		if (noteObj == undefined) {
			continue;
		}
		if (tnre.TIE.exec(token)) {
		    noteObj.tie = new tie.Tie('start');
		    if (storedDict['lastNoteTied']) {
		        noteObj.tie.type = 'continue';
		    }
		    storedDict['lastNoteTied'] = true;
		} else {
		    if (storedDict['lastNoteTied']) {
                noteObj.tie = new tie.Tie('stop');
                storedDict['lastNoteTied'] = false;
            }
		}
		if (tnre.SHARP.exec(token)) {
			noteObj.pitch.accidental = new pitch.Accidental('sharp');
		} else if (tnre.FLAT.exec(token)) {
			noteObj.pitch.accidental = new pitch.Accidental('flat');
        } else if (tnre.NAT.exec(token)) {
            noteObj.pitch.accidental = new pitch.Accidental('natural');
            noteObj.pitch.accidental.displayType = "always";
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
        lastDurationQL = noteObj.duration.quarterLength;
        // do before appending tuplets
        
		if (storedDict.inTrip) {
		    //console.log(noteObj.duration.quarterLength);
		    noteObj.duration.appendTuplet( new duration.Tuplet(3, 2, noteObj.duration.quarterLength) );
		}
        if (storedDict.inQuad) {
            noteObj.duration.appendTuplet( new duration.Tuplet(4, 3, noteObj.duration.quarterLength) );
        }
		if (storedDict.endTupletAfterNote) {
		    storedDict.inTrip = false;
		    storedDict.inQuad = false;
		    storedDict.endTupletAfterNote = false;
            
		}
		m.append(noteObj);
	}
	if (p.length > 0) {
        p.append(m);
        var thisClef = clef.bestClef(p);
        p.clef = thisClef;
        return p; // return measure object if one measure or less		    
	} else {
        m.clef = clef.bestClef(m);
	    return m;
	}
};

// render notation divs in HTML
/**
 * Render all the TinyNotation classes in the DOM as notation
 * 
 * Called automatically when music21 is loaded.
 * 
 * @memberof music21.tinyNotation
 * @param {string} classTypes - a JQuery selector to find elements to replace.
 */
tinyNotation.renderNotationDivs = function (classTypes, selector) {
	if (classTypes == undefined) {
		classTypes = '.music21.tinyNotation';
	}
	var allRender = [];
	if (selector == undefined) {
	    allRender = $(classTypes);
	} else {
	    if (selector.jquery == undefined) {
	        selector = $(selector);
	    }
	    allRender = selector.find(classTypes);
	}
	for (var i = 0; i < allRender.length; i++) {
		var thisTN = allRender[i];
		var thisTNJQ = $(thisTN);
        var thisTNContents = undefined;
        if (thisTNJQ.attr("tinynotationcontents") !== undefined) {
            thisTNContents = thisTNJQ.attr("tinynotationcontents");
        } else if (thisTN.textContent != undefined) {
            thisTNContents = thisTN.textContent;
            thisTNContents = thisTNContents.replace(/s+/g, ' '); // no line-breaks, etc.
        }
		
		if ((String.prototype.trim != undefined) && (thisTNContents != undefined)) {
			thisTNContents = thisTNContents.trim(); // remove leading, trailing whitespace
		}
		if (thisTNContents) {
			var st = tinyNotation.TinyNotation(thisTNContents);
			if (thisTNJQ.hasClass('noPlayback')) {
                st.renderOptions.events['click'] = undefined;
			} 
            var newCanvas = st.createCanvas();
			
			thisTNJQ.attr("tinynotationcontents", thisTNContents);
			thisTNJQ.empty();
			thisTNJQ.data("stream", st);
			thisTNJQ.append(newCanvas);
			//console.log(thisTNContents);		
		}
	}
};

