define("m21theory/tests/chordIdentification", ["m21theory/section", "m21theory/random"], 
        function (section, random) {
	var ThisTest = function () {
		section.Generic.call(this);
		this.assignmentId = 'chordIdentificationTest';
		this.totalQs = 15;
		this.practiceQs = 0;
		this.title = "Chord Identification";
		this.instructions = "<p>" +
			"Identify the following chords as <b>Major</b>, <b>Minor</b>, or something else. " +
			"<b>Double click</b> on the chord to listen to it, then drag it to the appropriate space." +
			"</p>";
		this.subtype = 'majorMinor';
	    this.chords = random.shuffle(["C3 E3 G3", "C2 E-3 G3", "C2 G3 E4", "C3 G#3 E4",
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
	        var nc = myStream.createCanvas();
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

	ThisTest.prototype = new section.Generic();
	ThisTest.prototype.constructor = ThisTest;
	return ThisTest;
});