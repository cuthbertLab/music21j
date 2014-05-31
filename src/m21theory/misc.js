/**
 * m21theory -- supplemental routines for music theory teaching  
 * m21theory/misc -- miscellaneous routines.
 * 
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define(['music21','loadMIDI', 'jquery'], function(require) {
	var misc = {};
	misc.playMotto = function (MIDI) {
	    //return;
		var delay = 0; // play one note every quarter second
		var note = 65; // the MIDI note
		var velocity = 110; // how hard the note hits
		// play the note
		MIDI.noteOn(0, note, velocity - 50, delay);
		MIDI.noteOff(0, note, delay + 0.75);
		MIDI.noteOn(0, note + 6, velocity, delay + 0.4);
		MIDI.noteOff(0, note + 6, delay + 0.75 + 0.8);
		MIDI.noteOn(0, note + 4, velocity - 90, delay + 1.35);
		MIDI.noteOff(0, note + 4, delay + 0.75 + 1.35);
	};
	
	misc.addKeyboard = function(where, startDNN, endDNN) {
	    if (where === undefined) {
	        where = document.body;
	    }
	    if (startDNN === undefined) {
	        startDNN = 18;
	    }
	    if (endDNN === undefined) {
	        endDNN = 39;
	    }
	    if (where.jquery !== undefined) {
	        where = $(where);
	    }
	    
	    var keyboardNewDiv = $('<div id="keyboardGeneratedDiv" style="position: static; z-index: 9"/>');
	    var k = new music21.keyboard.Keyboard();
	    k.appendKeyboard(keyboardNewDiv, startDNN, endDNN);
	    k.markMiddleC();
	    where.append(keyboardNewDiv);
	    var keyboardSpacerDiv = $('<div id="keyboardSpacerDiv" style="height: ' + k.height + 'px; display: none"/>');
        where.append(keyboardSpacerDiv);

	    $(window).scroll( function(unused_event) {
	        var $el = $("#keyboardGeneratedDiv");
	        if ($(this).scrollTop() > $el.offset().top && $el.css('position') != 'fixed') {
	            k.startOffsetTop = $el.offset().top;
                $el.css({'position': 'fixed', 'top': '0px'});
	            var $ksd = $("#keyboardSpacerDiv");
	            $ksd.css({'display': 'block'});            
	        }
	        if ($(this).scrollTop() < k.startOffsetTop && $el.css('position') == 'fixed') {
	            $el.css({'position': 'static', 'top': '0px'});
                var $ksd = $("#keyboardSpacerDiv");
                $ksd.css({'display': 'none'});            
	        }
	    } );
	};
	
	// end of define
	if (typeof(m21theory) != "undefined") {
		m21theory.misc = misc;
	}		
	return misc;
});