define("m21theory/tests/chordCreation", ["m21theory/section"], function () {
	var ThisTest = function () {
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
				keySignatureSharps = m21theory.random.randint(this.minSharps, this.maxSharps);
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
				givenAnswer.push(s.get(i).pitch);
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

	ThisTest.prototype = new m21theory.section.Generic();
	ThisTest.prototype.constructor = ThisTest;
	return ThisTest;
});