/*
 
Require file for require.js

Call with

<script data-main="src/requireMain.js" src="ext/require/require.js"></script>

*/

require(['music21'], function(music21) {
	var n = new music21.note.Note("C#4");
	n.duration.type="half";
	var n2 = new music21.chord.Chord(["F#4", "A#4","C5"]);
	n2.duration.type="half";
	var s = new music21.Stream();
	s.append(n);
	s.append(n2);
	// s.clef = new music21.clef.Clef('treble');

	var k = new music21.key.Key('C#');
	s.keySignature = k;
	
	s.appendNewCanvas();	
});