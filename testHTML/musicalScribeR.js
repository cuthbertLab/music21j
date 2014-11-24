
/**
 * Finds value of radio buttons for selected staves
 * 
 * @returns {Array<Boolean>} First element is whether selection is treble only; Second element is whether selection is bass only
 */

function getStreamLength(){
	streamLength=$('#streamLengthDiv').text();
	return streamLength;
}

var useOneStaffAlways = false;

function hideStaff(){
	//hides the canvas that isn't selected
	var $checked = $('#staffSelect').find('input[type="radio"]:checked').val();
		console.log($checked);
		if ($checked == 'bassOnly') {
			$('#canvasDivTreble').hide();
			$('#canvasDivBass').show();
			console.log('treble hidden')
		}
		else if ($checked == 'trebleOnly') {
			$('#canvasDivTreble').show();
			$('#canvasDivBass').hide();
		console.log('bass hidden')	
		}
		if (useOneStaffAlways !== false) {
			return;
		}
		//other case hides the rest stream
		else if ( lastNoteStream != t && t.get(-1).isRest == true) {
			$('#canvasDivBass').show();
			$('#canvasDivTreble').hide();
			console.log('hid treble because it was a rest stream')
		}
		else if (lastNoteStream != b && b.get(-1).isRest == true ) {
			$('#canvasDivTreble').show();
			$('#canvasDivBass').hide();
			console.log('hid bass because it was a rest stream')
		} else { 
			$('#canvasDivTreble').show();
			$('#canvasDivBass').show();
			console.log('Recognized that I should show both')
		}
		
}

function getSelectedStaff() {
		var trebleOnly = false;
		var bassOnly = false;
		var $checked = $('#staffSelect').find('input[type="radio"]:checked').val();
		
		if ($checked == 'bassOnly') {
			bassOnly = true;
			trebleOnly = false;			
		}
		if ($checked=='trebleOnly') {
			trebleOnly = true; 
			bassOnly = false; 
		}
		
		return [trebleOnly, bassOnly];
}


/**
 * Automatically called when a note or chord is played.
 * Calls append functions for notes and chords separately, 
 * then appends the updated stream to the score canvas.
 * 
 * @param appendObject Note or chord; 
 * @param {int} streamLength - length of the measure
 * @returns undefined
 */


function appendElement(appendObject) {	
	streamLength=getStreamLength();
	console.log('appendElement ran');

	if (appendObject.isNote) {
		var appendChord = new music21.chord.Chord();
		appendChord.add(appendObject.pitch);
	} else if (appendObject.isChord) {
		appendChord = appendObject;
	} else {
		console.log('Can only take notes or chords');
		return;
	}
	appendChordToScore(appendChord, streamLength);
	if (t.length > 0 && miditools.lastElement != undefined ) {
		t.get(-1).duration = miditools.lastElement.duration;
	}
	if (b.length > 0 && miditools.lastElement != undefined) {
		b.get(-1).duration = miditools.lastElement.duration;
	}
	if 	($('#separatedValue').text() == 0) {
	    var $canvasDivScore = $("#canvasDivScore");    
	    $canvasDivScore.empty();        
		sc.appendNewCanvas($canvasDivScore);
		
		
	} else if ( $('#separatedValue').text() == 1) {
		var $canvasDivTreble=$("#canvasDivTreble");
		$canvasDivTreble.empty();
		t.appendNewCanvas($canvasDivTreble);
		
		var $canvasDivBass=$("#canvasDivBass");
		$canvasDivBass.empty();
		b.appendNewCanvas($canvasDivBass);
		console.log(lastRestStream.clef)
		console.log(lastNoteStream.clef)
		hideStaff();
		
	} else {
		console.log(" I can't tell if you want the streams separated or not");
	}
}
/**
 * 
 * @param {int} streamLength - length of the measure
 * @param {chord.Chord} appendObject fixes duration of chord and appends it to score
 */
function appendChordToScore(appendObject, streamLength) {
	var separatedChords = separateChord(appendObject);

	var treblePartOfChord = separatedChords[0];
	var bassPartOfChord = separatedChords[1];
	
	var newRest = new music21.note.Rest();
	newRest.duration = appendObject.duration.clone();
    fixRestDuration(lastRestStream, lastNoteStream);
    appendChordsToStreams(t, treblePartOfChord, newRest, streamLength);
    appendChordsToStreams(b, bassPartOfChord, newRest, streamLength);	
}
/**
 * 
 * @param {stream} s -stream that chord will be appended to
 * @param {chord.Chord} chordToAppend 
 * @param {note.Rest} newRest - a rest with the correct duration
 * @param {int} streamLength - length of the measure
 */
function appendChordsToStreams(s, chordToAppend, newRest, streamLength) {
	if (chordToAppend.pitches.length > 0) {
		s.append(chordToAppend);
		lastNoteStream = s;
	} else if (chordToAppend.pitches.length == 0) {
        s.append(newRest);
        lastRestStream = s;
	}
	shortenStream(s, streamLength);
}

/**
 * 
 * @param rawChord Chord
 * @returns {Array<music21.chord.Chord>} Two element array: [0] Treble; [1] Bass
 */
function separateChord(rawChord) {
	var selectedStaves = getSelectedStaff();
	var trebleOnly = selectedStaves[0];
	var bassOnly = selectedStaves[1];
	
	var i = 0;
	var treblePartOfChord = new music21.chord.Chord();
	var bassPartOfChord = new music21.chord.Chord();
	
	while ( i < rawChord.pitches.length) {
		var noteInChord = new music21.note.Note();
		noteInChord.pitch = rawChord.pitches[i];
		noteInChord.duration = rawChord.duration;
	
		if ((noteInChord.pitch.octave >= 4 && bassOnly == false) || trebleOnly == true) {
			treblePartOfChord.add(noteInChord);
		
		} else if ((noteInChord.pitch.octave < 4 && trebleOnly == false) || bassOnly == true) {
			bassPartOfChord.add(noteInChord);
		}
		
		i++;
	}
	return [treblePartOfChord, bassPartOfChord];
}

	
function fixRestDuration(streamToBeFixed, correctStream){
	if (streamToBeFixed.elements.length == 0 || correctStream.elements.length == 0 ){
		return undefined;
	}
	var previousNote=(streamToBeFixed.elements[streamToBeFixed.elements.length-1]);
	previousNote.duration = correctStream.elements[correctStream.elements.length-1].duration.clone();
	
	return streamToBeFixed;
}	

/**
 * 
 * @param {stream} s -any stream with a recently appended object
 * @param {int} streamLength - length of the measure
 * @returns {stream} s -the stream with a length no longer than streamLength
 */
function shortenStream(s, streamLength) {	
	if (s.length > streamLength) {
			s.elements = s.elements.slice(1);  		    
	}
	return s;
}

