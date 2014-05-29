/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/base -- objects in base in music21p routines
 *
 * does not load the other modules, music21/moduleLoader.js does that.
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */


define(['music21/duration'], function(require) {
	var base = {};

	/*   main class   from base.py   */

	base.Music21Object = function () {
		this.classes = ['Music21Object'];
		this.classSortOrder = 20; // default;
		this._priority = 0; // default;
		this.parent = undefined;
		this.isStream = false;
		// this.isSpanner = false; // add when supported,
		// this.isVariant = false; // add when supported, if ever...
		this._duration = new music21.duration.Duration();
		this.groups = []; // custom object in m21p
		// this.sites, this.activeSites, this.offset -- not yet...
		// beat, measureNumber, etc.
		// lots to do...
		
		Object.defineProperties(this, {
            'priority': {
                configurable: true,
                enumerable: true,
                get: function () { return this._priority; },
                set: function (p) { this._priority = p; }
            },
		    'duration': {
                configurable: true,
                get: function () {
                    return this._duration;
                },
                set: function(newDuration) {
                    this._duration = newDuration;
                }
            },
		});
	};
	base.Music21Object.prototype.isClassOrSubclass = function (testClass) {
        if (testClass instanceof Array == false) {
            testClass = [testClass];
        }
        for (var i = 0; i < testClass.length; i++) {
            if ($.inArray(testClass[i], this.classes) != -1) {
                return true;
            }   
        }
        return false;
    };

	
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.base = base;
	}
	
	return base;
});