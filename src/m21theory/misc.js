/**
 * m21theory -- supplemental routines for music theory teaching  
 * m21theory/misc -- miscellaneous routines.
 * 
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define([], function(require) {
	var misc = {};
	misc.playMotto = function () {
		var delay = 0; // play one note every quarter second
		var note = 65; // the MIDI note
		var velocity = 110; // how hard the note hits
		// play the note
		MIDI.setVolume(0, 127);
		MIDI.noteOn(0, note, velocity - 50, delay);
		MIDI.noteOff(0, note, delay + 0.75);
		MIDI.noteOn(0, note + 6, velocity, delay + 0.4);
		MIDI.noteOff(0, note + 6, delay + 0.75 + 0.8);
		MIDI.noteOn(0, note + 4, velocity - 80, delay + 1.35);
		MIDI.noteOff(0, note + 4, delay + 0.75 + 1.35);
	};
	// end of define
	if (typeof(m21theory) != "undefined") {
		m21theory.misc = misc;
	}		
	return misc;
});