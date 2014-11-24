
function separateByInstrument (m) {
	getMaxNotes(m);
}
/**
 * @param {stream.Measure} m - measure to be split into separate staves
 */
function getMaxNotes(m) {
	var maxNotes = 0;
	for (i = 0; i < m.length; i++ ) {
		m.elements[i].pitches.length
		if (m.elements[i].pitches.length>maxNotes){
			maxNotes = m.elements[i].pitches.length
		}
	}
	addChordsToNoteList(maxNotes, m)				
}
/**			
 * @param {int} maximum number of notes in a chord
 * @param {stream.Measure} m- measure to be split into separate staves
 */
function addChordsToNoteList(maxNotes, m){
	var partList = [];
	var noteList = []
				
				
	for (var partNumber = 0; partNumber < maxNotes; partNumber++ ) {
		noteList.push([0,0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0]) //hard coded
	}
	for (var chords = 0; chords < m.length; chords++ ) {
		var c = m.elements[chords];
		for (var n = 0; n < maxNotes; n++ ) {
			var noteInPart = new music21.note.Note()
			noteInPart.pitch = c.pitches[n]
			noteList[n][chords] = noteInPart
			if (c.pitches.length < maxNotes && n >= c.pitches.length) {
				noteList[n][chords] = new music21.note.Rest()
			}
		}
	}
	makePartsFromList(noteList);
}
/**
 * @param {[[note.Note]]} -2D array of future parts and notes that go into them
 */			
function makePartsFromList(noteList) {
	var partList=[]
	for ( var p = 0; p < noteList.length; p++) {
		mToAdd = new music21.stream.Measure();
		pToAdd= new music21.stream.Part();
		for (var n = 0; (n < noteList[p].length && noteList[p][n] != 0); n++) {
			mToAdd.append(noteList[p][n])
		}
	pToAdd.append(mToAdd)
	partList.push(pToAdd)
	}
	makeStaff(partList);
}
/**
 * @param {[stream.part]} -1D array of parts 
 */				
			
function makeStaff(partList) {
	for (i = 0; i<partList.length; i++ ) {
		var partToAdd = partList[partList.length-1-i];
		$("#canvases").append("<div class = 'canvas' id='canvasDiv' align = 'left' > </div>");
		var $specifiedCanvas = $('.canvas:eq(' + i + ')');
		partToAdd.appendNewCanvas($specifiedCanvas)
		var $canvas = $('.canvas')
		$canvas.css('display', 'block');
		
	}
}
			
			
			
		