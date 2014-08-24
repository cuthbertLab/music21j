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


define(['./prebase', './duration'], 
        /**
         * module for Music21Objects
         * @exports music21/base
         */
        function(prebase, duration) {
	var base = {};

	/**
	 * @class Music21Object
	 * @constructor
	 */
	base.Music21Object = function () {
        prebase.ProtoM21Object.call(this);
        this.classes.push('Music21Object');
		this.classSortOrder = 20; // default;
		this._priority = 0; // default;
		this.offset = null; // default -- simple version of m21.
		this.activeSite = undefined;
		this.isMusic21Object = true;
		this.isStream = false;
		// this.isSpanner = false; // add when supported,
		// this.isVariant = false; // add when supported, if ever...

		this._duration = new duration.Duration();
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
                    if (typeof(newDuration) == 'object') {
                        this._duration = newDuration;     
                        // common errors below...
                    } else if (typeof(newDuration) == 'number') {
                        this._duration.quarterLength = newDuration;
                    } else if (typeof(newDuration) == 'string') {
                        this._duration.type = newDuration;
                    }
                }
            },
		});
        // define how to .clone() difficult objects..
        this._cloneCallbacks.activeSite = function (p, ret, obj) {
            ret[p] = undefined;
        };

	};
    base.Music21Object.prototype = new prebase.ProtoM21Object();
    base.Music21Object.prototype.constructor = base.Music21Object;
	
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.base = base;
	}
	
	return base;
});