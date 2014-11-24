
msDEBUG = true;

/**
 * Finds value of radio buttons for selected staves
 * 
 * @returns {Array<Boolean>} First element is whether selection is treble only; Second element is whether selection is bass only
 */
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
 * @returns undefined
 */
function appendElement(appendObject) {
	if (msDEBUG) { console.log('appendElement called with object: ', appendObject); }		
	if (appendObject.isNote) {
		appendNoteToScore(appendObject);
	} else if (appendObject.isChord) {
		appendChordToScore(appendObject);
	} else {
		console.error('Can only take notes or chords');
	}		
    var $canvasDivScore = $("#canvasDivScore");    
    $canvasDivScore.empty();        
	sc.appendNewCanvas($canvasDivScore);
}

function appendChordToScore(appendObject) {
	var seperatedChords = seperateChord(appendObject);
	console.log(seperatedChords);

	var treblePartOfChord = seperatedChords[0];
	var bassPartOfChord = seperatedChords[1];
	
	var newRest = new music21.note.Rest();
	newRest.duration = appendObject.duration.clone();
    fixRestDuration(lastRestStream, lastNoteStream);
    console.log(treblePartOfChord.quarterLength);
    console.log(bassPartOfChord.quarterLength);
    appendChordsToStreams(t, treblePartOfChord, newRest);
    appendChordsToStreams(b, bassPartOfChord, newRest);	
}

function appendChordsToStreams(s, chordToAppend, newRest) {
	if (chordToAppend.pitches.length > 0) {
		s.append(chordToAppend);
		lastNoteStream = s;
	} else if (chordToAppend.pitches.length == 0) {
        s.append(newRest);
        lastRestStream = s;
	}
	shortenStream(s);
}

/**
 * 
 * @param rawChord Chord
 * @returns {Array<music21.chord.Chord>} Two element array: [0] Treble; [1] Bass
 */
function seperateChord(rawChord) {
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

function appendNoteToScore(appendNote) {
    appendNoteToPart(appendNote, 'treble', t);
    appendNoteToPart(appendNote, 'bass', b);
};

function getStaffToAppendNoteTo (appendNote){
	var trebleOnly = getSelectedStaff()[0];
	var bassOnly = getSelectedStaff()[1];
	octave=getOctave(appendNote);
	var staffToAppendNoteTo = undefined;
	if ((octave >= 4  && bassOnly != true)|| trebleOnly==true){
		staffToAppendNoteTo = 'treble';
	}if ((octave < 4  && trebleOnly != true )|| bassOnly==true) {
		staffToAppendNoteTo = 'bass';
	}
	if (msDEBUG) { console.log("getStaffToAppendNoteTo: ", staffToAppendNoteTo); }
	
	return staffToAppendNoteTo;
	
};

function getOctave(appendingNote) {
    var p = appendingNote.pitch;
    var octave = p.octave;
	return octave;
}

function appendNoteToPart(appendNote, staff, s) {
	staffToAppendNoteTo = getStaffToAppendNoteTo(appendNote);
	var newRest = new music21.note.Rest();
	newRest.duration = appendNote.duration.clone();
    fixRestDuration(lastRestStream, lastNoteStream);
    
	if (staff != staffToAppendNoteTo) {
		s.append(newRest);
		lastRestStream = s;
	} else if (staff==staffToAppendNoteTo){
		s.append(appendNote);
		lastNoteStream = s;
	}
	shortenStream(s);
	
};	
	
function fixRestDuration(streamToBeFixed, correctStream){
	if (streamToBeFixed.elements.length == 0 || correctStream.elements.length == 0 ){
		return undefined;
	}
	var previousNote=(streamToBeFixed.elements[streamToBeFixed.elements.length-1]);
	if (msDEBUG) { console.log ("fixRestDuration: previousNote duration: ", previousNote.duration.quarterLength) }
	previousNote.duration = correctStream.elements[correctStream.elements.length-1].duration.clone();
	if (msDEBUG) { console.log ("fixRestDuration: previousNote duration: ", previousNote.duration.quarterLength) }
	
	return streamToBeFixed;
}	

function shortenStream(s) {
	if (s.length > 7) {
			s.elements = s.elements.slice(1);  		    
	}
	return s;
}

require(['music21'], function () { 
    t = new music21.stream.Measure();
    b = new music21.stream.Measure();
    //someNote= new music21.note.Note();
    //otherNote=new music21.note.Note('B3');
    //t.append(someNote);
    //b.append(otherNote);
    tPart = new music21.stream.Part();
    bPart = new music21.stream.Part();
    tPart.append(t);
    bPart.append(b);
    sc= new music21.stream.Score();
    sc.insert(0, tPart);
    sc.insert(0, bPart);
    t.clef = new music21.clef.TrebleClef();
    b.clef = new music21.clef.BassClef();
    //sc.appendNewCanvas();
    metro = new music21.tempo.Metronome();
    metro.addDiv($("#metronomeDiv"));
    
    lastRestStream = t;
    lastNoteStream = b;
    
    music21.miditools.metronome = metro;
    k = new music21.keyboard.Keyboard();
    var kd = document.getElementById('keyboardDiv');
    k.startPitch = 18; // 6
    k.endPitch = 39; // 57
    
    k.appendKeyboard(kd); // 37key keyboard

    var Jazz = music21.jazzMidi.createPlugin();
    music21.jazzMidi.createSelector($("#putMidiSelectHere"), Jazz);
    music21.jazzMidi.callBacks.general = [music21.miditools.makeChords, 
                                          music21.miditools.sendToMIDIjs,
                                          music21.keyboard.jazzHighlight.bind(k)];
    music21.jazzMidi.callBacks.sendOutChord = appendElement;
});
		
