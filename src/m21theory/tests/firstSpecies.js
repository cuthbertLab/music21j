define("m21theory/tests/firstSpecies", ["m21theory/section", "m21theory/random"], 
        function (section, random) {
	var ThisTest = function () {
		/*
		 * First species counterpoint in a tonal context.
		 */		
		section.Generic.call(this);
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
				var part = n.activeSite.activeSite;
				var score = part.activeSite;
				if (part == score.get(1)) {
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
				//this.clef.setStemDirection(n);
				this.activeNote = n;
				this.activeCanvas = canvas;
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
            var activeCanvas = this.activeCanvas;            
            var existingAlerts = $(th.testSectionDiv).find('#alertDiv');
			if (existingAlerts.length > 0) {
				$(existingAlerts[0]).remove();
			}
			var studentLine = this.get(0).flat.elements;
			var cf = this.get(1).flat.elements;
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
			var studentPartObj = this.get(0);
			for (var i = 0; i < studentPartObj.length; i++) {
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
						var oldCFNoteactiveSite = cfNote.activeSite; 
						var oldStudentNoteactiveSite = studentNote.activeSite;
						newS.append(cfNote);
						newS.append(studentNote);
						newS.playStream();
						cfNote.activeSite = oldCFNoteactiveSite; 
						studentNote.activeSite = oldStudentNoteactiveSite;
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
            this.redrawCanvas(activeCanvas);
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
			var thisSharps = random.randint(this.minSharps, this.maxSharps);
			var thisCf = random.choice(this.cfs);
			var s = new music21.stream.Score();
			var ks = new music21.key.KeySignature(thisSharps);
			var pStudent = new music21.stream.Part();
			var pCF = new music21.stream.Part();
			var tnCF = music21.tinyNotation.TinyNotation(thisCf);
			
			
			$.each(tnCF.flat.elements, function(j, el) { 
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
	ThisTest.prototype = new section.Generic();
	ThisTest.prototype.constructor = ThisTest;
	return ThisTest;
});