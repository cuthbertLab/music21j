define("m21theory/tests/scaleMajorMinorWritten", ["m21theory/section"], function () {
	var ThisTest = function () {
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
				keySignatureSharps = m21theory.random.randint(this.minSharps, this.maxSharps);
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
					removedNotes.push( s.get(remEls[j]) );
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

	ThisTest.prototype = new m21theory.section.Generic();
	ThisTest.prototype.constructor = ThisTest;
	return ThisTest;
});