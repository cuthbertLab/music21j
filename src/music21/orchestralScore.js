define(['./prebase', 'jquery'],
		/**
		 * orchestralScore module. See {@link music21.protopainting} namespace
		 * 
		 * @exports music21/orchestralScore
		 */
		function(prebase, $) {
	/**
	 * @namespace music21.orchestralScore
	 * @memberof music21
	 * @requires music21/prebase
	 */
	var orchestralScore = {};
	/**
	 * Represents an orchestral score, 
	 * 
	 * @class OrchestralScore
	 * @memberof music21.orchestralScore
	 * @extends music21.prebase.ProtoM21Object
	 * @property {number} notesFilledCount
	 * @property {music21.stream.Score} score
	 * @property {music21.stream.Measure} pianoMeasure - the corresponding measure
	 * @property [SplitPart] partList list of parts in the score
	 */
	orchestralScore.OrchestralScore = function(pianoMeasure){
		prebase.ProtoM21Object.call(this);
		this.classes.push('OrchestralScore');
		this.name = "undefined";
		this.notesFilledCount = 0;
        this.score = new music21.stream.Score();
		this.pianoMeasure = pianoMeasure;
        this.partList = [];
        this.instrumentNameList = [];
	};
	orchestralScore.OrchestralScore.prototype = new prebase.ProtoM21Object();
	orchestralScore.OrchestralScore.prototype.constructor = orchestralScore.OrchestralScore;

	/**
	 * Generates an Orchestral Score
	 * 
	 * @memberof music21.orchestralScore.OrchestralScore
	 * @returns {music21.orchestralScore.OrchestralScore}
	 */
//	orchestralScore.OrchestralScore = function (pianoMeasure) {
//	var OrchestralScore = new music21.orchestralScore.OrchestralScore(pianoMeasure);
//	return OrchestralScore;
//	};
	/**
	 * Returns the splitPart object with a given name
	 * 
	 * @param {string } selectedInstrument - name of instrument corresponding to that split part
	 * @returns {splitPart} splitPath - the split part with the name called 
	 */
	orchestralScore.OrchestralScore.prototype.getSplitPart = function(selectedInstrument) {
		for (var i = 0; i < this.partList.length; i++ ) {
			var splitPart = this.partList[i];
			if (splitPart.instrument == selectedInstrument) {
				return splitPart;
			}
		}
	};
//	/**
//	* UNUSED
//	* Adds corresponding rests to a split part if there are other parts in the score with more notes
//	* @param {splitPart} newSplitPart - a SplitPart with fewer notes than the other splitParts that have more notes added
//	* @returns {splitPart} splitPartWithRests - SplitPart with rests filled in where there are notes for other parts
//	*/
//	orchestralScore.OrchestralScore.prototype.addRests = function (newSplitPart) {

//	for (var splitPartWithRests = 0; splitPartWithRests < this.partList[0].p.flat.elements.length; splitPartWithRests++ ) {
//	r = new music21.note.Rest()
//	r.duration.quarterLength
//	newSplitPart.p.get(0).append(r);
//	while (newSplitPart.p.get(0).elements.length > OrchestralScore.notesFilledCount) {
//	OrchestralScore.notesFilledCount++;
//	}
//	return splitPartWithRests;
//	}
//	}

	/**
	 * Creates a splitPart object from an instrument name and adds rests if necessary
	 * Adds the part to the score
	 * @param {string} instrument - the name of the instrument that the splitPart is named after
	 * @param {music21.stream.Part} p - the part initialized
	 */

	orchestralScore.OrchestralScore.prototype.makeSplittedPart = function (instrument, p) {
		console.log(instrument);
		for (var i = 0; i < this.notesFilledCount; i++) {
			var r = new music21.note.Rest();
            if ( typeof(this.pianoMeasure) == "undefined"){
                console.log("no piano measure in OS")
                this.pianoMeasure = orchestralScore.OrchestralScore.pianoMeasure;
            }
			var correspondingPianoNote = this.pianoMeasure.flat.elements[i];
			r.duration.quarterLength = correspondingPianoNote.duration.quarterLength;
			p.get(0).append(r);
		}
		var newSplitPart = new music21.orchestralScore.SplitPart(instrument, p);
        newSplitPart.pianoMeasure = this.pianoMeasure;
		this.partList.push(newSplitPart);
		this.score.insert(0,newSplitPart.p);
	};
        /** 
         * Returns the name of instruments selected from check boxes
         * searches for an element called instrumentSelect
         * @returns [string] an array of instrument names
         **/

        orchestralScore.OrchestralScore.prototype.getSelectedInstruments = function () {
                var selectedInstruments = [];
                $('#instrumentSelect :checked').each(function() {
                        selectedInstruments.push($(this).val());
                });
                return selectedInstruments;
        }
        


	/**
	 * When the canvas is clicked, obtains the selected note, puts the note on the score, then re-renders the canvas.
	 * @param {event} e - click event
	 * 
	 */
	orchestralScore.OrchestralScore.prototype.clickFunction = function (e) {
        console.log("click event");
        console.log(this);
        var storedScore = this.pianoMeasure;
        var canvasElement = e.currentTarget;
		var _ = storedScore.findNoteForClick(canvasElement, e);
		//var dNN = _[0];
		var c = _[1];
		var noteIndex = undefined;
		for (var i = 0; i < storedScore.flat.elements.length; i++ ){
			if ( c === storedScore.flat.elements[i] ) {
				noteIndex = i;
			}
		}
		var oneNoteChord = this.getNoteFromChordAndDNN(_);
		if (typeof(oneNoteChord) == "undefined") {
			return;
		}
		this.assignNoteToParts(oneNoteChord, noteIndex);
		this.displayParts();
	};
	/**
	 * 
	 */
	orchestralScore.OrchestralScore.prototype.createCanvases = function() {
		$("#canvases").empty();

		var selectedInstruments =this.getSelectedInstruments();
		for (var i in selectedInstruments) {
			instrumentName = selectedInstruments[i];
			if (typeof(this.getSplitPart(instrumentName))=="undefined" ) {
				var p = new music21.stream.Part();
				var newMeasure = new music21.stream.Measure();
				p.append(newMeasure);			
				this.makeSplittedPart(instrumentName, p);
			} else {
				var p = this.getSplitPart(instrumentName).p;
			}
		}
		var $canvasDiv = $("<div class = 'canvasHolder' id = 'canvasDiv' align = 'left' > </div>");
		$("#canvases").append($canvasDiv);
		$canvasDiv.html("<b>" + "Score" + "</b>");
		this.score.appendNewCanvas($canvasDiv);

	};
	/**
	 * Changes the appropriate canvases (very similar to createCanvases, might merge them)
	 * 
	 */
	orchestralScore.OrchestralScore.prototype.displayParts = function(){
		var $specifiedCanvas = $('#canvasDiv');
		$specifiedCanvas.empty();
		var currentScore = this.score;
		currentScore.appendNewCanvas($specifiedCanvas);

	};


	/**
	 * @params {Array} [chord.Chord, diatomicNoteNum]
	 * @returns {chord.Chord} chord made from the selected note and chord
	 */
	orchestralScore.OrchestralScore.prototype.getNoteFromChordAndDNN = function(_){
		console.log(_)
		dNN = _[0];
		c = _[1];
		if (typeof(c) == "undefined") {
			console.log('undefined chord');
			return undefined;
		}
		var minNoteDistance = 100; //some big number
		for (var i = 0; i< c.pitches.length; i++) {
			chordDNN= c.pitches[i].diatonicNoteNum;
			noteDistance = chordDNN-dNN;
			if (noteDistance < 0) {
				noteDistance = -1*noteDistance;
			}

			if (noteDistance < minNoteDistance  ) {
				minNoteDistance = noteDistance;
				correctdNN=c.pitches[i].diatonicNoteNum;
			}
		}

		var selectedNote = new music21.note.Note();
		selectedNote.pitch.diatonicNoteNum = correctdNN;
		var oneNoteChord = new music21.chord.Chord();
		oneNoteChord.duration.quarterLength = c.duration.quarterLength;
		oneNoteChord.add(selectedNote);
		console.log(oneNoteChord.pitches[0].name);
		return oneNoteChord;
	}



	/**
	 * Finds the selected instruments, finds the part to append to, then adds the note to the part. 
	 * @param {music21.chord.Chord} c - chord 
	 */
	orchestralScore.OrchestralScore.prototype.assignNoteToParts = function(c,  noteIndex) {
                console.log("assign note to parts"); 
		var selectedInstruments = this.getSelectedInstruments();
		for (var i = 0; i < selectedInstruments.length; i++) {
			var instrument = selectedInstruments[i];
			partToAppendTo = this.getSplitPart(instrument);
			partToAppendTo.addNoteToPart(c, noteIndex);

		}

	}




	/**
	 * Object that holds the name of a part, and the part itself
	 * 
	 * @param {string} instrument - the name of the instrument that corresponds to that SplitPart
	 * @param {music21.stream.Part} - the music21 part for the SplitPart
	 */
	orchestralScore.SplitPart = function(instrument, p) {
		if (instrument === undefined) {
			instrument = 'piano';
		} 
		if (p  === undefined) {
			p = new music21.stream.Part();
			var m = new music21.stream.Measure();
			p.append(m);
		} 

		this.instrument = instrument;
		this.p = p;
	};

	orchestralScore.SplitPart.prototype = new prebase.ProtoM21Object();
	orchestralScore.SplitPart.prototype.constructor = orchestralScore.SplitPart;

	/**
	 * Takes in a chord and where it goes in the part, then places the note where it belonds, adding rests in between the last and first note if none exists
	 * @param {music21.chord.Chord} c - The chord selected by the mouse
	 * @param {number} noteIndex - The index of where the note is the piano score
	 * 
	 */
	orchestralScore.SplitPart.prototype.addNoteToPart = function (c, noteIndex) {	
                if ( typeof(this.pianoMeasure) == "undefined"){
                       console.log("no piano measure")
                       console.log(this);
                        }
		for (var notePlace = 0; notePlace < noteIndex; notePlace++){
                       var p = this.p; 
			if (this.p.get(0).elements.length-1 < notePlace &&  notePlace < orchestralScore.OrchestralScore.notesFilledCount ){
				var r = new music21.note.Rest();				
				var correspondingPianoNote = orchestralScore.OrchestralScore.pianoMeasure.elements[notePlace];
				r.duration.quarterLength = correspondingPianoNote.duration.quarterLength;
				this.p.get(0).elements[notePlace] = r;
				console.log("fills in missing rests");
			}
			if (typeof(this.p.get(0).elements[notePlace]) == "undefined") {
				var r = new music21.note.Rest();
				if (typeof(orchestralScore.OrchestralScore) == "undefined") {
					console.log("No orchestral score was created yet");
					return;
				}
				var correspondingPianoNote = this.pianoMeasure.elements[notePlace];
				r.duration.quarterLength = correspondingPianoNote.duration.quarterLength;
				this.p.get(0).elements[notePlace] = r;
			}
		}
		this.p.get(0).elements[noteIndex] = c;
		if (this.p.get(0).elements.length > orchestralScore.OrchestralScore.notesFilledCount) {
			orchestralScore.OrchestralScore.notesFilledCount++;
		}
	};

	/**
	 * Creates chords for a demonstration and appends them to a canvas.
	 */
	orchestralScore.setupDemonstration = function(){
		var cChord = new music21.chord.Chord(['C5', 'E5', 'G5']);
		var c1 = new music21.chord.Chord(['C5']);
		var c2 = new music21.chord.Chord(['D5']);
		var c3 = new music21.chord.Chord(['E5']);
		var c4 = new music21.chord.Chord(['F5']);
		var c5 = new music21.chord.Chord(['G5']);
		var c6 = new music21.chord.Chord(['C5', 'G5']);
		var c7 = new music21.chord.Chord(['C5', 'E5']);
		var c8 = new music21.chord.Chord(['A5']);
		c8.duration.quarterLength = 2;
		var c9 = new music21.chord.Chord(['B5']);
		var c10 = new music21.chord.Chord(['E5', 'G5']);
		var c11 = new music21.chord.Chord(['B5', 'D5']);

		var gChord = new music21.chord.Chord(['G5', 'B5', 'D5']);
		var fChord = new music21.chord.Chord(['F5', 'A5', 'C5']);
		var amChord = new music21.chord.Chord(['A5', 'C5', 'E5']); 
		// var shortChord = new music21.chord.Chord(['A5', 'C5']);
		var mixedMeasure = new music21.stream.Measure();
		mixedMeasure.append(amChord);
		mixedMeasure.append(cChord);
		mixedMeasure.append(c1);
		mixedMeasure.append(c2);
		mixedMeasure.append(c3);
		mixedMeasure.append(c4);
		mixedMeasure.append(c5);
		mixedMeasure.append(c6);
		mixedMeasure.append(c7);
		mixedMeasure.append(c8);
		mixedMeasure.append(c9);
		mixedMeasure.append(c10);
		mixedMeasure.append(c11);

		mixedMeasure.append(gChord);
		mixedMeasure.append(fChord);

		$('#playSound').bind('click', function() {
			if (this.checked) {
				music21.jazzMidi.callBacks.general = midiCallbacksPlay;
			} else {
				music21.jazzMidi.callBacks.general = midiCallbacksNoPlay;
			}
		});
		return mixedMeasure;
	};


//	end of define
	if (typeof(music21) != "undefined") {
		music21.orchestralScore = orchestralScore;
	}       
	return orchestralScore;

});





