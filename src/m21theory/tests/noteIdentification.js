define("m21theory/tests/noteIdentification", ["m21theory/section"], function () {
	var ThisTest = function () {
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
			s.clef = new music21.clef.Clef( m21theory.random.choice(this.allowableClefs) );
			s.timeSignature = '4/4';
			var minDiatonicNoteNum = s.clef.firstLine - 1 - (2 * this.allowableLedgerLines);
			var maxDiatonicNoteNum = s.clef.firstLine + 9 + (2 * this.allowableLedgerLines);
			var answerList = [];
			for (var j = 0; j < 7; j++) {
				var n;
				do {
					var chosenDiatonicNoteNum = m21theory.random.randint(minDiatonicNoteNum,
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
				var chosenDiatonicNoteNum = m21theory.random.randint(minDiatonicNoteNum,
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

	ThisTest.prototype = new m21theory.section.Generic();
	ThisTest.prototype.constructor = ThisTest;
	return ThisTest;
});