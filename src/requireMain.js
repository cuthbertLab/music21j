/*
 
Require file for require.js

Call with

<script data-main="src/requireMain.js" src="ext/require/require.js"></script>

*/

require(['m21theory'], function() {
	var n = new music21.note.Note("B4");
	n.duration.type="half";
	var n2 = new music21.chord.Chord(["F#4", "A#4","C5"]);
	n2.duration.type="half";
	var s = new music21.stream.Stream();
	s.append(n);
	s.append(n2);
	// s.clef = new music21.clef.Clef('treble');

	var k = new music21.key.Key('C#');
	s.keySignature = k;

	s.appendNewCanvas();	

	var TB = new m21theory.bank.TestBank();
	var itClass = m21theory.tests.keySignature;
	it = new itClass();
	TB.append(it);
	it = m21theory.tests.get('interval');
	TB.append(it);
	TB.render();

});