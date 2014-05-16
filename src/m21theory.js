/**
 * m21theory -- supplemental routines for music theory teaching and
 * assessment using the javascript reimplementation of music21 (music21j). 
 *
 * See http://web.mit.edu/music21/ for more details.
 * 
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 *
 * This version is released for use in 2013-14 in non-minimized form under LGPL or 
 * proprietary licenses (your choice; the former is Free; the latter costs money,
 * but lets you use minimizers, etc. to optimize web loading).  The permanent license 
 * is still under discussion; please contact cuthbert@mit.edu for more information.
 * 
 * All interfaces are alpha and may change radically from day to day and release to release.
 * Do not use this in production code yet.
 * 
 * 2014-05-01 -- v.0.2.alpha (release)
 * 2013-10-05 -- v.0.1.alpha 
 * 
 */


if (typeof (m21theory) === "undefined") {
	m21theory = {};
}
m21theory.debug = false;

if ( typeof define === "function" && define.amd) {
    define( "m21theory", ['music21', 
                          'm21theory/userData', 'm21theory/random', 'm21theory/misc',
                          'm21theory/bank', 'm21theory/section', 'm21theory/tests'], 
    		function (require) { 

    	// this may get loaded twice, but I think the cache handles it...
        MIDI.loadPlugin({
    		soundfontUrl: "../ext/midijs/soundfont/",
    		instrument: "acoustic_grand_piano",
    		callback: function() {
    			m21theory.misc.playMotto(); // disable this to not play the motto on loading...
    		}
    	});

    	/*

    	Interval testing routines...

    	*/


    	m21theory.KeySignatureTest = function () {
    		m21theory.section.Generic.call(this);
    		
    		this.assignmentId = 'keySignatures';
    		this.totalQs = 16;
    		this.minSharps = -6;
    		this.maxSharps = 6;
    		this.practiceQs = 2;
    		this.mode = 'major';
    		
    		this.title = "Major KeySignature Test";
    		this.instructions = "<p>Identify the following major keys by their key signatures. " +
    			'Use <b>"#"</b> for sharps and lowercase <b>"b"</b> for flat, but write the key name ' +
    			'in <b>CAPITAL</b> letters (why? when we get to minor, the convention is lowercase).' +
    			"</p>";

    		this.usedKeySignatures = [];

    		this.renderOneQ = function (i) {
    			var s = new music21.stream.Stream();
    			if (m21theory.randint(0,1)) {
    				s.clef = new music21.clef.Clef('treble');
    			} else {
    				s.clef = new music21.clef.Clef('bass');
    			}
    			if (this.usedKeySignatures.length == (this.maxSharps - this.minSharps)) {
    				// could be 13; but might as well, let one be unused...
    				this.usedKeySignatures = []; // clear for new work.
    			}
    			var keySignatureSharps = undefined;
    			while (keySignatureSharps == undefined) {
    				keySignatureSharps = m21theory.randint(this.minSharps, this.maxSharps);
    				for (var j = 0; j < this.usedKeySignatures.length; j++) {
    					if (this.usedKeySignatures[j] == keySignatureSharps) {
    						keySignatureSharps = undefined;
    					}
    				}
    			}
    			this.usedKeySignatures.push(keySignatureSharps);
    			var ks = new music21.key.KeySignature(keySignatureSharps);
    			s.keySignature = ks;
    			var tonicName;
    			if (this.mode == 'minor') {
    				tonicName = ks.minorName();
    				tonicName = tonicName.toLowerCase();
    			} else {
    				tonicName = ks.majorName();
    			}
    			tonicName = tonicName.replace(/\-/g, "b");
    			var nc = s.createPlayableCanvas();
    			var niceDiv = $("<div style='width: 180px; float: left; padding-bottom: 20px'></div>");
    			niceDiv.append(nc);
    			if (i < this.practiceQs) {
    				niceDiv.append( $("<div style='padding-left: 20px; position: relative; top: 0px'>" + tonicName + "</div>") );
    			} else {
    				var inputBox = $("<input type='text' size='5' class='unanswered'/>")
    								 .change( function () { this.testHandler.validateAnswer(this, this.storedAnswer); } )
    								 ;
    				inputBox[0].answerStatus = "unanswered"; // separate from class
    				inputBox[0].storedStream = s;
    				inputBox[0].storedAnswer = tonicName;
    				inputBox[0].testHandler = this;
    				niceDiv.append( $("<div style='padding-left: 15px; position: relative; top: 0px'/>")
    								 .append(inputBox) );
    			}
    			return niceDiv;
    		};
    	};

    	m21theory.KeySignatureTest.prototype = new m21theory.section.Generic();
    	m21theory.KeySignatureTest.prototype.constructor = m21theory.KeySignatureTest;


    	m21theory.ScaleEarTest = function () {
    		m21theory.section.Generic.call(this);
    		this.assignmentId = 'scaleEar';
    		this.totalQs = 16;
    		this.practiceQs = 2;
    		this.screwyFraction = .6;
    		
    		this.title = "Hearing Major Scales Test";
    		this.instructions = "<p>" +
    			"Each of the following questions presents a properly written major " +
    			"scale in a given key. However! approximately half of the scales will " +
    			"not sound like major scales when they are played back because one scale " +
    			"degree is off by a half step. Identify the incorrect scale degree with a " +
    			"number from <b>'2' to '8'</b>. Or if there is no problem, enter <b>'0'</b>.</p>" +
    			"<p><b>Click the scales to hear them.</b> They do not play automatically." +
    			"</p>";
    		this.usedKeySignatures = [];

    		this.renderOneQ = function (i) {
    			var s = new music21.stream.Stream();
    			s.tempo = 60;
    			if (m21theory.randint(0,1)) {
    				s.clef = new music21.clef.Clef('treble');
    			} else {
    				s.clef = new music21.clef.Clef('bass');
    			}
    			if (this.usedKeySignatures.length == 12) {
    				// could be 13; but might as well, let one be unused...
    				this.usedKeySignatures = []; // clear for new work.
    			}
    			var keySignatureSharps = undefined;
    			while (keySignatureSharps == undefined) {
    				keySignatureSharps = m21theory.randint(-6, 6);
    				for (var j = 0; j < this.usedKeySignatures.length; j++) {
    					if (this.usedKeySignatures[j] == keySignatureSharps) {
    						keySignatureSharps = undefined;
    					}
    				}
    			}
    			var ks = new music21.key.KeySignature(keySignatureSharps);
    			var tonic = ks.majorName();
    			var tonicPitch = new music21.pitch.Pitch(tonic);
    			if (s.clef.name == 'bass') {
    				if (tonicPitch.step == 'B' || tonicPitch.step == 'A' || tonicPitch.step == 'G') {
    					tonicPitch.octave = 2;
    				} else {
    					tonicPitch.octave = 3;		
    				}
    			}
    			var scalePitches = music21.scale.ScaleSimpleMajor(tonicPitch); // no new needed yet...
    			for (var j = 0; j < scalePitches.length; j ++ ) {
    				var n = new music21.note.Note();
    				//n.duration.quarterLength = 0.5;
    				n.pitch = scalePitches[j];
    				n.stemDirection = 'noStem';
    				s.append(n);
    			}
    			s.autoBeam = false;
    			var nc = s.createPlayableCanvas({'height': '100px', 'width': 'auto'}, 320);
    			var niceDiv = $("<div style='width: 330px; float: left; padding-bottom: 20px'></div>");
    			niceDiv.append(nc);
    			
    			var doIt = m21theory.randint(0,10);

    			// always make it so that the first two are normal, screwy
    			if (i == 0) { doIt = 10; }
    			else if (i == 1) { doIt = 0; } 
    			var whichNote = 0;
    			if (doIt < 10 * this.screwyFraction ) {
    				// screw a note...
    				whichNote = m21theory.randint(2,8);
    				var thisDirection = 0;
    				if (whichNote == 3 || whichNote == 7) {
    					// only down...
    					thisDirection = -1;
    				} else if (whichNote == 4 || whichNote == 8) {
    					// only up...
    					thisDirection = 1;
    				} else {
    					// down 2/3 of the time
    					thisDirection = m21theory.randint(-1,1);
    					if (thisDirection == 0) { 
    						thisDirection = -1;
    					}
    				}
    				var tempPitch = s.elements[whichNote - 1].pitch;
    				//console.log(whichNote + " " + tempPitch.name + " ");
    				if (tempPitch.accidental == undefined) {
    					tempPitch.accidental = new music21.pitch.Accidental(thisDirection);
    				} else {
    					tempPitch.accidental.set( parseInt (tempPitch.accidental.alter + thisDirection) );
    				}
    				//console.log(whichNote + " " + tempPitch.name + " ");
    				
    			} else {
    				whichNote = 0;
    			}
    							
    			if (i < this.practiceQs) {
    				niceDiv.append( $("<div style='padding-left: 80px; position: relative; top: 0px'>Example: <b>" + whichNote.toString() + "</b></div>") );
    			} else {
    				var inputBox = $("<input type='text' size='5' class='unanswered'/>")
    								 .change( function () { this.testHandler.validateAnswer(this, this.storedAnswer); } )
    								 ;
    				inputBox[0].answerStatus = "unanswered"; // separate from class
    				inputBox[0].storedStream = s;
    				inputBox[0].storedAnswer = whichNote.toString();
    				inputBox[0].testHandler = this;
    				niceDiv.append( $("<div style='padding-left: 80px; position: relative; top: 0px'/>")
    								 .append(inputBox) );
    			}
    			return niceDiv;
    		};

    	};

    	m21theory.ScaleEarTest.prototype = new m21theory.section.Generic();
    	m21theory.ScaleEarTest.prototype.constructor = m21theory.ScaleEarTest;


    	m21theory.ScaleMajorMinorWrittenTest = function () {
    		m21theory.section.Generic.call(this);
    		this.assignmentId = 'scaleMajorMinor';
    		this.totalQs = 16;
    		this.practiceQs = 4;
    		this.allowableClefs = ['treble', 'bass'];
    		this.allowableScales = ['major', 'natural', 'harmonic', 'melodic'];
    		this.allowableScalesDescending = ['major', 'natural', 'harmonic'];
    		this.allowableDirections = ['ascending', 'descending'];
    		this.minSharps = -3;
    		this.maxSharps = 3;
    		
    		this.hide367 = false; 
    		
    		this.niceScaleNames = {
    				'ascending': {
    					'major': 'Major',
    					'natural': 'Natural minor',
    					'harmonic': 'Harmonic minor collection',
    					'melodic': 'Ascending melodic minor'
    				},
    				'descending': {
    					'major': 'Major',
    					'natural': 'Natural or descending melodic minor',
    					'harmonic': 'Harmonic minor collection'
    				}
    		};
    		
    		this.title = "Major vs. Minor Scale Identification";
    		this.instructions = "<p>" +
    			"Each of the following questions presents a properly written major " +
    			"or minor scale in a given key. Identify the type of scale as major, " +
    			"natural minor (or the identical melodic minor descending), harmonic minor collection, " +
    			"or melodic minor ascending." + 
    			"</p><p><b>Click the scales to hear them.</b> They do not play automatically." +
    			"</p>";
    		this.usedKeySignatures = [];

    		this.renderOneQ = function (i) {
    			var s = new music21.stream.Stream();
    			s.tempo = 60;
    			s.clef = new music21.clef.Clef( m21theory.random.choice(this.allowableClefs) );
    			var direction = m21theory.random.choice(this.allowableDirections);
    			var allowable;
    			if (direction == 'ascending') {
    				allowable = this.allowableScales; 
    			} else {
    				allowable = this.allowableScalesDescending; 
    			}
    			var scaleType = m21theory.random.choice(allowable);
    			
    			if (i < this.practiceQs) {
    				direction = 'ascending';
    				scaleType = this.allowableScales[i % this.allowableScales.length];
    			}
    			
    			
    			if (this.usedKeySignatures.length == this.maxSharps - this.minSharps) {
    				this.usedKeySignatures = []; // clear for new work.
    			}
    			var keySignatureSharps = undefined;
    			while (keySignatureSharps == undefined) {
    				keySignatureSharps = m21theory.randint(this.minSharps, this.maxSharps);
    				for (var j = 0; j < this.usedKeySignatures.length; j++) {
    					if (this.usedKeySignatures[j] == keySignatureSharps) {
    						keySignatureSharps = undefined;
    					}
    				}
    			}
    			var ks = new music21.key.KeySignature(keySignatureSharps);
    			var tonic;
    			if (scaleType == 'major') {
    				tonic = ks.majorName();	
    			} else {
    				tonic = ks.minorName();
    			}
    			var tonicPitch = new music21.pitch.Pitch(tonic);
    			if (s.clef.name == 'bass') {
    				if (tonicPitch.step == 'B' || tonicPitch.step == 'A' || tonicPitch.step == 'G') {
    					tonicPitch.octave = 2;
    				} else {
    					tonicPitch.octave = 3;		
    				}
    			}
    			var scalePitches = undefined;
    			if (scaleType == 'major') {
    				scalePitches = music21.scale.ScaleSimpleMajor(tonicPitch); // no new needed yet...
    			} else {
    				scalePitches = music21.scale.ScaleSimpleMinor(tonicPitch, scaleType);
    			}
    			if (direction == 'descending' ) {
    				scalePitches.reverse();
    			}
    			for (var j = 0; j < scalePitches.length; j ++ ) {
    				var n = new music21.note.Note();
    				//n.duration.quarterLength = 0.5;
    				n.pitch = scalePitches[j];
    				n.stemDirection = 'noStem';
    				s.append(n);
    			}
    			s.autoBeam = false;
    			
    			var removedNotes = [];
    			var remEls; 
    			if (direction == 'descending') {
    				remEls = [1, 2, 5]; // 7th, 6th, third...
    			} else {
    				remEls = [2, 5, 6]; // third, 6th, 7th...
    			}
    			if (this.hide367) {
    				for (var j = 0; j < remEls.length; j++) {
    					removedNotes.push( s.elements[remEls[j]] );
    					s.elements[remEls[j]] = new music21.note.Rest();
    				}
    			}
    			
    			var nc = s.createPlayableCanvas({'height': '100px', 'width': 'auto'}, 320);
    			if (this.hide367) {
    				for (j = 0; j < remEls.length; j++) {
    					s.elements[remEls[j]] = removedNotes[j];
    				}
    			}
    			
    			var niceDiv = $("<div style='width: 330px; float: left; padding-bottom: 20px;'></div>");
    			if (i >= this.practiceQs) {
    				niceDiv.css('height', '190px');
    			}
    			niceDiv.append(nc);
    									
    			if (i < this.practiceQs) {
    				var niceAnswer = this.niceScaleNames[direction][scaleType];
    				niceDiv.append( $("<div style='padding-left: 20px; position: relative; top: 0px'>Example: <b>" + niceAnswer + "</b></div>") );
    			} else {
    				
    				var inputBox = $('<div class="unanswered"/>').css('position', 'relative');
    				inputBox[0].answerStatus = "unanswered"; // separate from class
    				inputBox[0].storedStream = s;
    				inputBox[0].storedAnswer = scaleType;
    				inputBox[0].testHandler = this;
    				for (var j = 0; j < allowable.length; j++) {
    					var thisOption = allowable[j];
    					var niceChoice = this.niceScaleNames[direction][thisOption];
    					var fieldInput =  $('<label><input type="radio" name="' + 
    								this.assignmentId + i.toString() + '" value="' + thisOption + '" /> ' + 
    								niceChoice + '<br/></label>').change( function () { 
    									var jQthis = $(this);
    									var thisVal = jQthis.find('input').attr('value');
    									var divBox = jQthis.parent()[0];
    									divBox.testHandler.validateAnswer(divBox, divBox.storedAnswer, thisVal); // returns bool for correct
    									//var questionDivTop = jQthis.parent().parent().position().top - 30;
    									//if (!correct) {
    									//	divBox.testHandler.showAlert('Sorry; click here to hear what the', 'alert', {top: questionDivTop});
    									//};
    								});
    					inputBox.append(fieldInput);
    				}
    				if (allowable.length < 4) {
    					inputBox.append($('<br/>'));
    				}
    				niceDiv.append( $("<div style='position: relative; top: 0px;'/>")
    								 .append(inputBox) );

    			}
    			return niceDiv;
    		};

    	};

    	m21theory.ScaleMajorMinorWrittenTest.prototype = new m21theory.section.Generic();
    	m21theory.ScaleMajorMinorWrittenTest.prototype.constructor = m21theory.ScaleMajorMinorWrittenTest;




    	m21theory.NoteIdentificationTest = function () {
    		m21theory.section.Generic.call(this);
    		this.assignmentId = 'noteIdentificationTest';
    		this.totalQs = 6;
    		this.practiceQs = 1;
    		this.allowableLedgerLines = 0;
    		this.allowableClefs = ['treble','bass'];
    		this.allowableAccidentals = [0, 1, -1];
    		this.title = "Note Identification";
    		this.instructions = "<p>" +
    			"Identify the notes in the following excerpts. Use <b>#</b> and <b>b</b> " +
    			"for sharp and flat.  You may write in uppercase or lowercase.  Place a space " +
    			"after each note for clarity (optional, but highly recommended)." +
    			"</p>";
    		this.lastPs = 0.0;

    		this.checkAnswer = function (storedAnswer, answerGiven) {
    			return (storedAnswer.toLowerCase().replace(/\s*/g, "") == answerGiven.toLowerCase().replace(/\s*/g, "") );
    		};

    		this.renderOneQ = function (i) {
    			var s = new music21.stream.Stream();
    			s.tempo = 80;
    			s.autoBeam = true;
    			// s.vexflowStaffWidth = 250;
    			//s.vexflowStaffPadding = 200;
    			s.clef = new music21.clef.Clef( m21theory.random.choice(this.allowableClefs) );
    			s.timeSignature = '4/4';
    			var minDiatonicNoteNum = s.clef.firstLine - 1 - (2 * this.allowableLedgerLines);
    			var maxDiatonicNoteNum = s.clef.firstLine + 9 + (2 * this.allowableLedgerLines);
    			var answerList = [];
    			for (var j = 0; j < 7; j++) {
    				var n;
    				do {
    					var chosenDiatonicNoteNum = m21theory.randint(minDiatonicNoteNum,
    																	maxDiatonicNoteNum);
    					var p = new music21.pitch.Pitch("C");
    					p.diatonicNoteNum = chosenDiatonicNoteNum;
    					var newAlter = m21theory.random.choice(this.allowableAccidentals);
    					p.accidental = new music21.pitch.Accidental( newAlter );

    					n = new	music21.note.Note("C");
    					n.duration.quarterLength = 0.5; // Not Working: type = 'eighth';
    					n.pitch = p;
    				} while ( (n.pitch.name == 'B#') ||
    						  (n.pitch.name == 'E#') ||
    						  (n.pitch.name == 'F-') ||
    						  (n.pitch.name == 'C-') );
    				s.append(n);
    				answerList.push(n.pitch.name.replace(/\-/, 'b'));
    			}
    			// last answer is always an earlier note with same accidental
    			var foundPitch = undefined;
    			for (var j = 0; j < 7; j++) {
    				if (s.elements[j].pitch.accidental.alter != 0) {
    					foundPitch = s.elements[j].pitch;
    					break;
    				}
    			}
    			if (foundPitch == undefined) {
    				// default
    				var chosenDiatonicNoteNum = m21theory.randint(minDiatonicNoteNum,
    																maxDiatonicNoteNum);
    				foundPitch = new music21.pitch.Pitch("C");
    				foundPitch.diatonicNoteNum = chosenDiatonicNoteNum;
    				var newAlter = m21theory.random.choice(this.allowableAccidentals);
    				foundPitch.accidental = new music21.pitch.Accidental( newAlter );
    			}
    			var n = new music21.note.Note("C");
    			n.duration.quarterLength = 0.5; // Not Working: type = 'eighth';
    			n.pitch.diatonicNoteNum = foundPitch.diatonicNoteNum;
    			n.pitch.accidental = new music21.pitch.Accidental(foundPitch.accidental.alter);
    			s.append(n);
    			answerList.push(n.pitch.name.replace(/\-/, 'b'));
    			
    			// done adding pitches
    			s.makeAccidentals();
    			var streamAnswer = answerList.join(' ');
    			s.renderOptions.events['click'] = undefined;
    			var nc = s.createPlayableCanvas({'height': '100px', 'width': 'auto'}, 400);
    			var niceDiv = $("<div style='width: 420px; float: left; padding-bottom: 20px'></div>");
    			niceDiv.append(nc);
    									
    			if (i < this.practiceQs) {
    				niceDiv.append( $("<div style='padding-left: 10px; position: relative; top: 0px'>Example: <b>" + streamAnswer + "</b></div>") );
    			} else {
    				var inputBox = $("<input type='text' size='24' class='unanswered'/>")
    								 .change( function () { this.testHandler.validateAnswer(this, this.storedAnswer); } );
    				inputBox[0].answerStatus = "unanswered"; // separate from class
    				inputBox[0].storedStream = s;
    				inputBox[0].storedAnswer = streamAnswer;
    				inputBox[0].testHandler = this;
    				niceDiv.append( $("<div style='padding-left: 30px; position: relative; top: 0px'/>")
    								 .append(inputBox) );
    			}
    			return niceDiv;
    		};

    	};

    	m21theory.NoteIdentificationTest.prototype = new m21theory.section.Generic();
    	m21theory.NoteIdentificationTest.prototype.constructor = m21theory.NoteIdentificationTest;

    	m21theory.ChordCreationTest = function () {
    		m21theory.section.Generic.call(this);
    		this.assignmentId = 'chordCreationTest';
    		this.totalQs = 9;
    		this.practiceQs = 0;
    		this.maxMistakes = 999999; // okay...
    		this.allowEarlySubmit = true; // necessary
    		this.minSharps = -4;
    		this.maxSharps = 4;
    		this.inversionChoices = undefined;
    		this.displayChoices = ['roman','degreeName'];
    		this.chordChoices = ['Tonic', 'Dominant','Subdominant', 'Submediant', 'Supertonic', 'Mediant', 'Leading-tone'];
    		this.modeChoices = ['major','minor'];
    		this.chordChoicesMode = {
    				'major': ['I','ii','iii','IV','V','vi','viio'],
    				'minor': ['i','iio','III','iv','V','VI','viio']
    		};
    		
    		this.chordDefinitions = {
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
    		this.chordTranspositions = {
    				'Tonic': ["P1", 'major'],
    				'Dominant': ["P5", 'major'], 
    				'Dominant-seventh': ["P5", 'dominant-seventh'], 
    				'Subdominant': ["P4", 'major'], 
    				'Submediant': ["M6", 'minor'],
    				'Supertonic': ["M2", 'minor'],
    				'Mediant': ["M3", 'minor'],
    				'Leading-tone': ["M7", 'diminished'],
    				'Leading-tone-seventh': ["M7", "diminished-seventh"]
    				}; 

    		this.title = "Chord Spelling";
    		this.instructions = "<p>" +
    			"Give the notes in the following chords from lowest to highest.<br/>" +
    			"The notes will be written melodically to make them easier to edit, " +
    			"but imagine that they would be played together</p>" +
    			"<p>" +
    			"Click above or below a note on a line or space to move it up or down, and " +
    			"click the accidental buttons above the staff to add the appropriate accidental " +
    			"to the last edited note. " +
    			"</p><p>&nbsp;</p>";

    		this.usedKeySignatures = [];
    			
    		this.renderOneQ = function (i) {
    			if (this.usedKeySignatures.length == (this.maxSharps - this.minSharps)) {
    				this.usedKeySignatures = []; // clear for new work.
    			}
    			var keySignatureSharps = undefined;
    			while (keySignatureSharps == undefined) {
    				keySignatureSharps = m21theory.randint(this.minSharps, this.maxSharps);
    				for (var j = 0; j < this.usedKeySignatures.length; j++) {
    					if (this.usedKeySignatures[j] == keySignatureSharps) {
    						keySignatureSharps = undefined;
    					}
    				}
    			}
    			this.usedKeySignatures.push(keySignatureSharps);
    			var mode = m21theory.random.choice(this.modeChoices);
    			
    			var ks = new music21.key.KeySignature(keySignatureSharps);
    			var tonic;
    			if (mode == 'major') {
    				tonic = ks.majorName();
    			} else {
    				tonic = ks.minorName();
    			}
    			var key = new music21.key.Key(tonic, mode);
    			var modalChoices = this.chordChoicesMode[mode];
    			var chordRNstr = m21theory.random.choice(modalChoices);
    			var displayType = m21theory.random.choice(this.displayChoices);

    			var chordRN = new music21.roman.RomanNumeral(chordRNstr, key);	
    			var inversionName = "";
    			if (this.inversionChoices != undefined) {
    				var thisInversion = m21theory.random.choice(this.inversionChoices);
    				if (thisInversion != 0) {
    					if (thisInversion == 1) {
    						chordRN.pitches[0].octave += 1;
    						if (displayType == 'roman') {
    							inversionName = '6';
    						} else {
    							inversionName = ' (first inversion)';
    						}
    					} else if (thisInversion == 2) {
    						chordRN.pitches[0].octave += 1;
    						chordRN.pitches[1].octave += 1;
    						if (displayType == 'roman') {
    							inversionName = '64';
    						} else {
    							inversionName = ' (second inversion)';
    						}
    					}
    				}
    			}
    			var fullChordName;
    			if (displayType == 'roman') {
    				fullChordName = chordRN.figure;
    			} else {
    				fullChordName = chordRN.degreeName;
    				if (chordRN.numbers != undefined) {
    					fullChordName += " " + chordRN.numbers.toString();
    				}
    			}
    			var tonicDisplay = tonic.replace(/\-/, 'b');
    			if (mode == 'minor') {
    				tonicDisplay = tonicDisplay.toLowerCase();
    			}
    			var infoDiv = $("<div style='padding-left: 20px; margin-top: -18px; margin-bottom: 50px'>" +
    					fullChordName + inversionName + " in " + tonicDisplay + " " + mode + "</div>");
    			
    			var chordPitches = chordRN.pitches;
    			
    			var s = new music21.stream.Measure();
    			for (var j =0; j < chordPitches.length; j++ ) {
    				var gPitch = new music21.note.Note("G2");
    				s.append(gPitch);
    			}
    			s.clef = new music21.clef.Clef('bass');

    			var d = $("<div/>").css('text-align','left').css('position','relative');
    			var buttonDivPlay = s.getPlayToolbar();
    			buttonDivPlay.css('top', '0px');
    			d.append(buttonDivPlay);
    			d.append( $("<br clear='all'/>") );
    			var buttonDiv = s.getAccidentalToolbar();
    			buttonDiv.css('top', '15px');
    			d.append(buttonDiv);
    			d.append( $("<br clear='all'/>") );
    			s.renderOptions.events['click'] = s.canvasChangerFunction;
    			var can = s.appendNewCanvas(d);
    			$(can).css('height', '140px');
    			d.css('float', 'left');
    			
    			d.append(infoDiv);

    			if (m21theory.Debug) {
    				var answerStr = "";
    				for (var j =0; j < chordPitches.length; j++ ) {
    					answerStr += chordPitches[j].nameWithOctave + " ";
    				}
    				console.log(answerStr);
    			}
    			
    			var answerChord = new music21.chord.Chord(chordPitches);
    			// store answers, etc. on Stream!
    			s.storedAnswer = answerChord;
    			s.answerStatus = 'unanswered';
    			s.storedTest = this;
    			s.storedDiv = d;
    			s.changedCallbackFunction = function () { this.storedTest.validateAnswer(this); };
    			return d;
    		};


    		this.validateAnswer = function (s) {
    			//console.log(s);
    			var storedAnswer = s.storedAnswer.pitches;
    			var givenAnswer = [];
    			for (var i = 0; i < s.length; i++) {
    				givenAnswer.push(s.elements[i].pitch);
    			}
    			if (m21theory.debug) {
    				var answerStr = "";
    				for (var j =0; j < storedAnswer.length; j++ ) {
    					answerStr += storedAnswer[j].name + " ";
    				}
    				console.log(answerStr);
    			}
    			var correct = true;
    			for (var i = 0; i < storedAnswer.length; i++) {
    				var foundIt = false;
    				for (var j = 0; j < givenAnswer.length; j++) {
    					if (storedAnswer[i].name == givenAnswer[j].name) {
    						foundIt = true;
    						break;
    					}
    				}
    				if (foundIt != true) {
    					correct = false;
    					break;
    				}
    			}
    			if (correct) { // possible correct 
    				//find bass note -- for inversion, etc...
    				var givenChord = new music21.chord.Chord(givenAnswer);
    				var givenBass = givenChord.bass();
    				var storedBass = s.storedAnswer.bass();
    				if (givenBass.name != storedBass.name) {
    					correct = false;
    				}
    			}
    			

    			if (correct) {
    				if (m21theory.debug) {
    					console.log('correct');
    				}
    				if (s.answerStatus == 'unanswered') {
    					this.numRight += 1;
    				} else if (s.answerStatus == 'incorrect') {
    					// do not decrement numMistakes...
    					this.numRight += 1;
    					this.numWrong -= 1;
    				} 
    				s.answerStatus = 'correct';

    				if (this.studentFeedback === true) {
    					s.storedDiv.css('background', '#ccffcc');
    					s.playStream();
    				}
    			} else { // incorrect
    				if (s.answerStatus == 'unanswered') {
    					this.numWrong += 1;
    				} else if (s.answerStatus == 'correct') {
    					this.numRight += -1;
    					this.numWrong += 1;
    					if (this.studentFeedback === true) {
    						s.storedDiv.css('background', 'white');
    					}				
    				}
    				s.answerStatus = 'incorrect';
    			}
    			if (m21theory.debug != false) {
    				console.log("Right " + this.numRight + " ; Wrong " + this.numWrong + 
    							" ; Mistakes " + this.numMistakes);
    			}
    			this.checkEndCondition();
    		};
    	};

    	m21theory.ChordCreationTest.prototype = new m21theory.section.Generic();
    	m21theory.ChordCreationTest.prototype.constructor = m21theory.ChordCreationTest;

    	m21theory.ChordIdentificationTest = function () {
    		m21theory.section.Generic.call(this);
    		this.assignmentId = 'chordIdentificationTest';
    		this.totalQs = 15;
    		this.practiceQs = 0;
    		this.title = "Chord Identification";
    		this.instructions = "<p>" +
    			"Identify the following chords as <b>Major</b>, <b>Minor</b>, or something else. " +
    			"<b>Double click</b> on the chord to listen to it, then drag it to the appropriate space." +
    			"</p>";
    		this.subtype = 'majorMinor';
    	    this.chords = m21theory.random.shuffle(["C3 E3 G3", "C2 E-3 G3", "C2 G3 E4", "C3 G#3 E4",
    	                                           "F#2 C#3 A3", "B2 F3 D#4", "G2 D3 B-3",
    	                                           "E-2 G2 B-2", "E2 B2 G3", "A2 C3 E3", "A2 E3 C#4",
    	                                           "E3 F3 G3 A3 B3", "C3 E3 G3 C4 E4", "B-2 D-3 F4",
    	                                           "A-3 C4 E-4", "D#3 F#3 A#3 D#4", "F3 A3 C4", "B2 D3 F3 A-3",
    	                                           "D-3 A-3 F4", "D3 F3 A3", "C3 G3 E-4", "F3 A-3 C4", "E2 G2 B2",
    	                                           "C#4 E4 G#4",
    	                                           ]);

    		this.checkAnswer = function (storedAnswer, answerGiven) {
    			return (storedAnswer.toLowerCase().replace(/\s*/g, "") == answerGiven.toLowerCase().replace(/\s*/g, "") );
    		};

    		this.renderOneQ = function (i) {
    	        var thisChordArr = this.chords[i % this.chords.length].split(" ");
    	        //console.log(thisChordArr);
    	        var thisChord = new music21.chord.Chord(thisChordArr);
    			thisChord.duration.type = 'whole';
    			var storedAnswer = 'other';
    			if (this.subtype == 'majorMinor') {
    				if (thisChord.isMajorTriad()) {
    					storedAnswer = 'major';
    				} else if (thisChord.isMinorTriad()) {
    					storedAnswer = 'minor';
    				}
    			} else if (this.subtype == 'inversions') {
    				var dnnDiff = (thisChord.root().diatonicNoteNum - thisChord.bass().diatonicNoteNum) % 7;
    				if (dnnDiff == 0) {
    					storedAnswer = 'root';
    				} else if (dnnDiff == 5) {
    					storedAnswer = 'first inversion';
    				} else if (dnnDiff == 3) {
    					storedAnswer = 'second inversion';
    				}
    			}
    			var myStream = new music21.stream.Stream();
    	        myStream.clef = new music21.clef.Clef('bass');
    	        myStream.append(thisChord);
    	        
    	        myStream.renderOptions.events['dblclick'] = 'play';
    	        myStream.renderOptions.events['click'] = undefined;
    	        var nc = myStream.createPlayableCanvas();
    	        nc.attr('class','draggableCanvas');
    	        nc.draggable( {
    			  containment: 'body',
    			  stack: '.draggableCanvas canvas',
    			  cursor: 'move',
    			  revert: true} ).data('storedAnswer', storedAnswer).data('storedStream', myStream);
    			var niceDiv = $("<div style='width: 150px; float: left; padding-bottom: 20px'></div>");
    			niceDiv.append(nc);
    									
    			nc[0].answerStatus = "unanswered"; // separate from class
    			nc[0].testHandler = this;
    			return niceDiv;
    		};
    		this.renderPostBody = function (newTestSection) {
    			var display = '<div style="display: table">';
    			if (this.subtype == 'majorMinor') {
    				display += '<div class="dropAccepts" type="major">Drop <i>Major</i> Chords Here</div>' +
    					'<div class="dropAccepts" type="minor">Drop <i>Minor</i> Chords Here</div>' +
    					'<div class="dropAccepts" type="other">Drop <i>Other</i> Chords Here</div>';
    			} else if (this.subtype == 'inversions') {
    				display += '<div class="dropAccepts" type="root"><i>Root pos.</i> Chords Here</div>' +
    				'<div class="dropAccepts" type="first inversion"><i>1st inv.</i> Chords Here</div>' +
    				'<div class="dropAccepts" type="second inversion"><i>2nd inv.</i> Chords Here</div>';
    			}
    			var nts = $('<div style="display: table">' + display + 
    					'</div>' + 
    					'<style>' +
    					'.dropAccepts {	display: table-cell !important;	width: 130px; height: 130px; text-align: center; ' +
    					'    vertical-align:middle;	border: 15px gray dashed; -moz-border-radius: 15px; -webkit-border-radius: 15px;' +
    					'    -khtml-border-radius: 15px;   border-radius: 15px;  float: left;   margin-right: 5px;   font-size: 30px;' +
    					'    color: gray;   line-height: 32px;  background-color: rgba(221, 221, 20, .2) ' +
    					' } </style>');
    			newTestSection.append(nts);
    		};
    		this.renderPostAppend = function () {
    			$('.dropAccepts').droppable( {
    			      accept: 'canvas',
    			      hoverClass: 'hovered',
    			      drop:  function (event, ui) { 
    			    	  var draggedCanvas = ui.draggable;
    			    	  var containedStream = draggedCanvas.data('storedStream');
    			    	  var soughtType = $(this).attr('type');
    			    	  draggedCanvas[0].testHandler.validateAnswer(draggedCanvas[0], soughtType, draggedCanvas.data('storedAnswer'));
    			    	  containedStream.playStream();
    			    	  //console.log('looking for: ' + soughtType);
    			      }
    		    } );
    		};
    		
    	};

    	m21theory.ChordIdentificationTest.prototype = new m21theory.section.Generic();
    	m21theory.ChordIdentificationTest.prototype.constructor = m21theory.ChordIdentificationTest;

    	m21theory.FirstSpecies = function () {
    		/*
    		 * First species counterpoint in a tonal context.
    		 */
    		
    		
    		m21theory.section.Generic.call(this);
    		this.assignmentId = 'firstSpeciesTest';
    		this.totalQs = 1;
    		this.practiceQs = 0;
    		this.title = "Counterpoint (Two part) in First Species";
    		this.instructions = 'Create a two part counterpoint by altering one line to fit the other. ' +
    			'Hit play to get an update on your work. Your piece will play automatically when it\'s right! ' +
    			'<b>To be done and submitted THREE TIMES with different given lines.</b><br/><br/>' +
    			'Remember the 21m.051 rules:<ul>' +
    			'<li>Each note must be a Unison, m3 or M3, P5, m6 or M6, P8 above (or an octave + those intervals)</li>'+
    			'<li>No more than two 3rds (major or minor), 6ths (major or minor), or P5s in a row (better, no 2 P5s in a row).</li>' +
    			'<li>No Parallel Octaves/Unisons</li>' +
    			'<li>Do not repeat notes.</li>' +
    			'<li>Do not make melodic leaps larger than a melodic perfect 4th.</li>' +
    			'<li>No more than two leaps per 4 melodic intervals.</li>' +
    			'<li>No accidentals (the system won\'t let you).</li>' +
    			'<li>Watch out for the tritone (fifth that is not perfect).</li>' +
    			'</ul>' +
    			'Beyond all those rules, try to make the most beautiful, singable line you can.'
    			;
    		this.minSharps = -3;
    		this.maxSharps = 2;
    		this.cfs = ["C1 D E D F E G A G E F D E D C",
    		            "G1 A F G c B A F D E G F D C",
    		            "C1 E D F E F D E AA BB C E D C BB C",
    		            "c1 B A E F F G A G E D C",
    		            "c1 c B A G A G F E F E G A B c"];
    		
    		this.noteChanged = function (clickedDiatonicNoteNum, foundNote, canvas) {
    			if (foundNote != undefined) {
    				var n = foundNote;
    				var part = n.parent.parent;
    				var score = part.parent;
    				if (part == score.elements[1]) {
    					this.testHandler.showAlert(
    							"No...you can't alter the given line.  That'd be too easy. :-)", 'alert');
    					return;
    				}
    				n.unchanged = false;
    				p = new music21.pitch.Pitch("C");
    				p.diatonicNoteNum = clickedDiatonicNoteNum;
    				var stepAccidental = this.keySignature.accidentalByStep(p.step);
    				if (stepAccidental == undefined) {
    					stepAccidental = new music21.pitch.Accidental(0);
    				}
    				p.accidental = stepAccidental;
    				n.pitch = p;
    				n.stemDirection = undefined;
    				this.clef.setStemDirection(n);
    				this.activeNote = n;
    				this.redrawCanvas(canvas);
    				if (this.changedCallbackFunction != undefined) {
    					this.changedCallbackFunction();
    				}
    			} else {
    				if (music21.debug) {
    					console.log("No note found at: " + xPx);		
    				}
    			}

    		};
    		this.evaluateCtp = function () {
    			var th = this.testHandler;
    			if (th.testHandler != undefined) {
    				return;
    			}
    			var existingAlerts = $(th.testSectionDiv).find('#alertDiv');
    			if (existingAlerts.length > 0) {
    				$(existingAlerts[0]).remove();
    			}
    			var studentLine = this.elements[0].flat;
    			var cf = this.elements[1].flat;
    			var totalUnanswered = 0;
    			var niceNames = {
    					1: "unison or octave",
    					2: "second",
    					3: "third",
    					4: "fourth",
    					5: "fifth",
    					6: "sixth",
    					7: "seventh",
    			};
    			var allowableIntervalStr = "thirds, perfect fifths, sixths, or perfect octaves/unisons (or octave equivalents).";
    			var prevNote = undefined;
    			var prevInt = undefined;
    			var prevPrevInt = undefined;
    			var unansweredNumbers = [];
    			for (var i = 0; i < this.elements[0].length; i++) {
    				var measureNumber = i + 1;
    				var studentNote = studentLine[i];
    				var cfNote = cf[i];
    				var genericInterval = 1 + (studentNote.pitch.diatonicNoteNum - cfNote.pitch.diatonicNoteNum) % 7;
    				if (studentNote.unchanged) {
    					totalUnanswered ++;
    					unansweredNumbers.push(measureNumber);
    					prevPrevInt = prevInt;
    					prevInt = genericInterval;
    					prevNote = studentNote;
    					continue;
    				}
    				if (genericInterval <= 0) {
    					th.showAlert("Your lines cross in measure " + measureNumber + "; keep your line above the given line.");				
    					return;
    				}
    				if (genericInterval != 1 && genericInterval != 3 && genericInterval != 5 && genericInterval != 6) {
    					th.showAlert("You have a " + niceNames[genericInterval] + " in measure " + measureNumber +
    							".  Acceptable intervals are " + allowableIntervalStr);
    					return;
    				}
    				if (genericInterval == 5) {
    					var semitones = (studentNote.pitch.ps - cfNote.pitch.ps) % 12;
    					if (semitones == 6) {
    						th.showAlert("Not all fifths are perfect fifths! In measure " +
    								measureNumber + " you wrote a diminished fifth. Listen to " +
    								" what you wrote and hit Play to listen to it in context before " +
    								" fixing it."
    						);
    						var newS = new music21.stream.Stream();
    						var oldCFNoteParent = cfNote.parent; 
    						var oldStudentNoteParent = studentNote.parent;
    						newS.append(cfNote);
    						newS.append(studentNote);
    						newS.playStream();
    						cfNote.parent = oldCFNoteParent; 
    						studentNote.parent = oldStudentNoteParent;
    						return;
    					}
    				}
    				if (prevInt != undefined) {
    					var prevMeasure = measureNumber - 1;
    					if (prevNote.pitch.ps == studentNote.pitch.ps) {
    						th.showAlert("Remember, you cannot repeat notes, like you do between measures " +
    								prevMeasure + " and " + measureNumber);
    						return;
    					}
    					if (prevInt == 1 && genericInterval == 1) {
    						th.showAlert("You have parallel unisons or octaves between measures " + prevMeasure + " and " +
    								measureNumber);
    						return;
    					}
    					if (Math.abs(studentNote.pitch.diatonicNoteNum - prevNote.pitch.diatonicNoteNum) >= 4) {
    						th.showAlert("Between measures " + prevMeasure + " and " +
    								measureNumber + " you have a leap greater than a Perfect 4th.");
    						return;
    					}
    					if (prevPrevInt != undefined) {
    						if (prevPrevInt == prevInt && prevInt == genericInterval) {
    							th.showAlert("In measures " + (prevMeasure - 1) + "-" + measureNumber + 
    									" you have used three " + niceNames[genericInterval] + "s in a row. " +
    									"The limit is two in a row."
    							);
    							return;
    						}	
    					}
    				}
    				if (measureNumber > 4) {
    					var numSkips = 0;
    					for (var j = measureNumber - 4; j < measureNumber; j++) {
    						if (Math.abs(
    								studentLine[j-1].pitch.diatonicNoteNum - 
    								studentLine[j].pitch.diatonicNoteNum
    						) >= 2) {
    							numSkips++;
    						}
    					}
    					if (numSkips > 2) {
    						th.showAlert("You have " + numSkips + " skips " + 
    								"between measures " + (measureNumber - 4) + " and " +
    								measureNumber + ". The maximum is 2 per 4 melodic intervals."
    						);
    						return;
    					}
    				}
    				prevPrevInt = prevInt;
    				prevInt = genericInterval;
    				prevNote = studentNote;
    			}
    			if (totalUnanswered > 5) {
    				th.showAlert(":-)", 'update');
    			} else if (totalUnanswered > 0) {
    				th.showAlert("Almost there... you need to give an answer for measures " +
    						unansweredNumbers.join(', ') + ". (If the note is right, just click it again).",
    						'update');
    			} else {
    				th.showAlert("Great Work! It's all set; listen to what you've done, then click Submit.", 'ok');
    				this.playStream();
    				th.numRight += 1;
    				th.checkEndCondition();
    			}
    		};
    		
    		this.renderOneQ = function (i) {
    			var thisSharps = m21theory.randint(this.minSharps, this.maxSharps);
    			var thisCf = m21theory.random.choice(this.cfs);
    			var s = new music21.stream.Score();
    			var ks = new music21.key.KeySignature(thisSharps);
    			var pStudent = new music21.stream.Part();
    			var pCF = new music21.stream.Part();
    			var tnCF = music21.tinyNotation.TinyNotation(thisCf);
    			
    			
    			$.each(tnCF.elements, function(j, el) { 
    				var mStudent = new music21.stream.Measure();
    				if (j != 0) {
    					mStudent.renderOptions.showMeasureNumber = true;
    					mStudent.renderOptions.measureIndex = j;
    				}
    				
    				var studentNote = new music21.note.Note('C4');
    				studentNote.duration.type = 'whole';
    				studentNote.pitch = ks.transposePitchFromC(studentNote.pitch);
    				studentNote.unchanged = true;
    				mStudent.append(studentNote);
    				
    				pStudent.append(mStudent);
    				var mCF = new music21.stream.Measure();
    				el.pitch = ks.transposePitchFromC(el.pitch);
    				mCF.append(el);
    				pCF.append(mCF);
    			});
    			pStudent.clef = new music21.clef.Clef('treble');
    			pCF.clef = new music21.clef.Clef('bass');
    			s.append(pStudent);
    			s.append(pCF);
    			s.timeSignature = '4/4';
    			s.keySignature = ks;
    			s.tempo = 200;
    			s.renderOptions.maxSystemWidth = 800;
    			s.noteChanged = this.noteChanged;
    			s.renderOptions.events['click'] = s.canvasChangerFunction;
    			s.testHandler = this;
    			s.changedCallbackFunction = this.evaluateCtp;
    			var niceDiv = $("<div style='width: 700px; float: left; padding-bottom: 20px'></div>").css('position','relative');
    			var buttonDiv = s.getPlayToolbar();
    			niceDiv.append(buttonDiv);
    			var can = s.appendNewCanvas(niceDiv);
    			can.answerStatus = "unanswered"; // separate from class
    			can.testHandler = this;
    			return niceDiv;
    		};


    	};


    	m21theory.FirstSpecies.prototype = new m21theory.section.Generic();
    	m21theory.FirstSpecies.prototype.constructor = m21theory.FirstSpecies;
    	
    });
}