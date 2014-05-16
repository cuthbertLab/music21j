/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/baseObjects -- objects in Base in music21p routines
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */


define(['music21/duration'], function(require) {
	var baseObjects = {};

	/*   main class   from base.py   */

	baseObjects.Music21Object = function () {
		this.classes = ['Music21Object'];
		this.classSortOrder = 20; // default;
		this.priority = 0; // default;
		this.parent = undefined;
		this.isStream = false;
		// this.isSpanner = false; // add when supported,
		// this.isVariant = false; // add when supported, if ever...
		this.duration = new music21.duration.Duration();
		this.groups = []; // custom object in m21p
		// this.sites, this.activeSites, this.offset -- not yet...
		// beat, measureNumber, etc.
		// lots to do...
		this.inClass = music21._inClass;
	};
	
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.baseObjects = baseObjects;
	}
	
	return baseObjects;
});