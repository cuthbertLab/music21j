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

define([], function(require) {
	var renderOptions = {};
	renderOptions.RenderOptions = function() {
		return {
			displayClef: true,
			displayTimeSignature: true,
			displayKeySignature: true,
			top: 0,
			left: undefined,
			width: undefined,
			height: undefined,
			systemIndex: 0,
			partIndex: 0,
			measureIndex: 0,
			systemMeasureIndex: 0,
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
			vexflowRenderStafflines: function(vexflowStave) {
			    if (this.staffLines != 5) {
	                if (this.staffLines == 0) {
	                    vexflowStave.setNumLines(0);
	                } else if (this.staffLines == 1) {
	                    // Vex.Flow.Stave.setNumLines hides all but the top line.
	                    // this is better
	                    vexflowStave.options.line_config = [{visible: false},
	                                                 {visible: false},
	                                                 {visible: true}, // show middle
	                                                 {visible: false},
	                                                 {visible: false},];
	                } else if (this.staffLines == 2) {
	                    vexflowStave.options.line_config = [{visible: false},
	                                                 {visible: false},
	                                                 {visible: true}, // show middle
	                                                 {visible: true},
	                                                 {visible: false},];
	                } else if (this.staffLines == 3) {
	                    vexflowStave.options.line_config = [{visible: false},
	                                                 {visible: true},
	                                                 {visible: true}, // show middle
	                                                 {visible: true},
	                                                 {visible: false},];
	                } else {
	                    vexflowStave.setNumLines(vfro.staffLines);                 
	                }
	            }
			},
		};
	};

	// end of define
	if (typeof(music21) != "undefined") {
		music21.renderOptions = renderOptions;
	}		
	return renderOptions;
});