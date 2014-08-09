/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/renderOptions -- an object that defines the render options for a Stream
 * 
 * note: no parallel in music21p
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

define([], function() {
	var renderOptions = {};
	renderOptions.RenderOptions = function() {
		return {
			displayClef: true,
			displayTimeSignature: true,
			displayKeySignature: true,
			
			scaleFactor: {x: 0.7, y: 0.7},
            
			top: 0,
			left: undefined,
			width: undefined,
            overriddenWidth: undefined,
			height: undefined,
			naiveHeight: 120,
			
			systemIndex: 0,
			partIndex: 0,
			measureIndex: 0,
			
			systemMeasureIndex: 0,
			systemPadding: undefined,
			naiveSystemPadding: 40,
			
			maxSystemWidth: undefined,
			rightBarline: undefined,
			staffLines: 5,
			staffConnectors: ['single', 'brace'],
			staffPadding: 60,
			events: {
				'click': 'play',
				'dblclick': undefined,
				// resize
					},
			startNewSystem: false,
			startNewPage: false,
			showMeasureNumber: undefined,
		};
	};

	// end of define
	if (typeof(music21) != "undefined") {
		music21.renderOptions = renderOptions;
	}		
	return renderOptions;
});