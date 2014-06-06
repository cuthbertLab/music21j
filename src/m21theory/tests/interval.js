define("m21theory/tests/interval", ["m21theory/section", "m21theory/random"], 
        function (section, random) {
	var ThisTest = function () {
		section.Generic.call(this);
		
		this.assignmentId = 'interval';
		
		this.noteNames = ['C','D','E','F','G','A','B'];
		this.accidentals = ["", "", "", "#", "-"];
		
		this.allowablePerfectSpecifiers = ["P"];
		this.allowableImperfectSpecifiers = ["m","M"];
			
		this.minInterval = -3;
		this.maxInterval = 5;
		
		this.skipP1 = false;
			
		this.disallowDoubleAccs = true;
		this.disallowWhiteKeyAccidentals = true;
		
		this.lastRenderedNote1 = undefined;
		this.lastRenderedNote2 = undefined;
			
		this.title = "Interval identification (General and Specific)";
		this.instructions = "<p>" +
			"For each set of <b>ascending</b> or <b>descending</b> intervals below, write in the " +
			"yellow box the abbreviated name of the interval using the terms " +	
			"\"<b>m</b>\" for <b>minor</b>, \"<b>M</b>\" for <b>major</b>, or \"<b>P</b>\" " +
			"for <b>perfect</b> (<i>N.B.: capital P</i>). The intervals range in size " +
			"from m2 to P5.  The first four are done for you.<p>" +
			"<p><b>Click any score fragment to hear the intervals played</b>.  Practice " +
			"learning the sounds of these intervals." +
			"</p>	<p>" +
			"When you have entered your response, the box will turn green on" +
			"correct answers or red for incorrect answers. You must have <b>all boxes " +
			"green</b> to submit this problem set and you may not have more than eight " +
			"incorrect answers <b>in one session</b>; if you have gotten than eight " +
			"incorrect, hit <b>Reload</b> " +
			"to get another set of intervals.</p>" +
			"<p>When you enter in an interval you can hit tab to move to the next field.</p>";
		
		this.getRandomInterval = function () {
			var randomGeneric = undefined;		
			do {
				randomGeneric = random.randint(this.minInterval, this.maxInterval);
			} while (randomGeneric == 0 || randomGeneric == -1);

			if (this.skipP1) {
				if (randomGeneric == 1) {
					randomGeneric = 2;
				}
			}

			var genericInterval = new music21.interval.GenericInterval(randomGeneric);
			var diatonicSpecifier = undefined;

			if (genericInterval.perfectable == false) {
				diatonicSpecifier = random.choice(this.allowableImperfectSpecifiers);
			} else {
				diatonicSpecifier = random.choice(this.allowablePerfectSpecifiers);		
			}
			if (diatonicSpecifier == 'd' && randomGeneric == 1) {
				diatonicSpecifier = 'A';
			}

			var diatonicInterval = new music21.interval.DiatonicInterval(diatonicSpecifier, genericInterval);
			var fullInterval = new music21.interval.Interval(diatonicInterval);
			if (m21theory.debug) {
				console.log("m21theory.IntervalTest.getRandomInterval: " + fullInterval.name);
			}
			return fullInterval;
		};	
			
		this.getRandomIntervalAndNotes = function () {
			var fullInterval = this.getRandomInterval();
			var noteNames = this.noteNames;
			var accidentals = this.accidentals;
			var noteName = random.choice(noteNames);
			var accName = random.choice(accidentals);
			var n1 = new music21.note.Note(noteName + accName);
			var p2 = fullInterval.transposePitch(n1.pitch);
			var n2 = new music21.note.Note("C");
			n2.pitch = p2;
			if ((n1.pitch.step == n2.pitch.step) &&
				(n1.pitch.name != n2.pitch.name) &&
				( (n2.pitch.accidental == undefined) || (n2.pitch.accidental.name == 'natural'))
				) {
				n2.pitch.accidental = new music21.pitch.Accidental('natural');
				n2.pitch.accidental.displayStatus = true;
			}
			return [n1, n2, fullInterval];
		};
		
		this.getRandomValidIntervalAndNotes = function () {
			//console.log("starting getRandomValidIntervalAndNotes");
			var validIntervals = false;
			do {
				var _ = this.getRandomIntervalAndNotes(),
					n1 = _[0],
					n2 = _[1],
					fullInterval = _[2];
				validIntervals = true;
				if (m21theory.debug) {
					console.log('Get interval ' + fullInterval.name + ': checking if valid');
				}
				if ((this.lastRenderedNote1 == n1.pitch.nameWithOctave) &&
					(this.lastRenderedNote2 == n2.pitch.nameWithOctave)) {
					validIntervals = false;
					continue;
				} 
				if (this.disallowDoubleAccs) {
					if ((n1.pitch.accidental != undefined) &&
						(Math.abs(n1.pitch.accidental.alter) > 1)) {
						validIntervals = false;	
					} else if ((n2.pitch.accidental != undefined) &&
						(Math.abs(n2.pitch.accidental.alter) > 1)) {
						validIntervals = false;			
					} 
				} else { // triple sharps/flats cannot render
					if ((n1.pitch.accidental != undefined) &&
						(Math.abs(n1.pitch.accidental.alter) > 2)) {
						validIntervals = false;	
					} else if ((n2.pitch.accidental != undefined) &&
						(Math.abs(n2.pitch.accidental.alter) > 2)) {
						validIntervals = false;			
					} 
				
				}
				if (this.disallowWhiteKeyAccidentals) {
					if ((n1.pitch.name == "C-") ||
								(n1.pitch.name == "F-") ||
								(n1.pitch.name == "B#") ||
								(n1.pitch.name == "E#")) {
						validIntervals = false;
						// n.b. we allow intervals that create these notes, but not starting.			
					} else if ((n2.pitch.name == "C-") ||
								(n2.pitch.name == "F-") ||
								(n2.pitch.name == "B#") ||
								(n2.pitch.name == "E#")) {
						// not for assignment 1 we dont...
						validIntervals = false;
					}		
				}
			} while (validIntervals == false);
			this.lastRenderedNote1 = n1.pitch.nameWithOctave;
			this.lastRenderedNote2 = n2.pitch.nameWithOctave;
			return [n1, n2, fullInterval];	
		};

		this.renderOneQ = function (i) {
			var _ = this.getRandomValidIntervalAndNotes(),
				n1 = _[0],
				n2 = _[1],
				fullInterval = _[2];
		
			var s = new music21.stream.Stream();
			if (random.randint(0,1)) {
				s.clef = new music21.clef.Clef('treble');
			} else {
				s.clef = new music21.clef.Clef('bass');
				var octaveShift = 0;
				if (n1.pitch.diatonicNoteNum > 32) {
					octaveShift = -2;
				} else {
					octaveShift = -1;
				}
				n1.pitch.octave = n1.pitch.octave + octaveShift;
				n2.pitch.octave = n2.pitch.octave + octaveShift;
			}		
			if (m21theory.debug) {
				console.log("name1: " + n1.pitch.name);
				console.log("octave: " + n1.pitch.octave);
				console.log("name2: " + n2.pitch.name);
				console.log("octave: " + n2.pitch.octave);
			}
			s.append(n1);
			s.append(n2);
			s.autoBeam = false;
			var nc = s.createPlayableCanvas();
			var niceDiv = $("<div style='width: 180px; float: left; padding-bottom: 20px'></div>");
			niceDiv.append(nc);
			if (i < this.practiceQs) {
				niceDiv.append( $("<div style='padding-left: 50px; position: relative; top: 0px'>" + fullInterval.name + "</div>") );
			} else {
				var inputBox = $("<input type='text' size='5' class='unanswered'/>")
								 .change( function () { this.testHandler.validateAnswer(this, this.storedAnswer); } )
								 .focus( function () { this.storedStream.playStream(); } )
								 ;
				inputBox[0].answerStatus = "unanswered"; // separate from class
				inputBox[0].storedStream = s;
				inputBox[0].storedAnswer = fullInterval.name;
				inputBox[0].testHandler = this;
				niceDiv.append( $("<div style='padding-left: 30px; position: relative; top: 10px'/>")
								 .append(inputBox) );
			}
			return niceDiv;
		};
	};

	ThisTest.prototype = new section.Generic();
	ThisTest.prototype.constructor = ThisTest;
	return ThisTest;
});