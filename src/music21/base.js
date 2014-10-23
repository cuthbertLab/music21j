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
         * module for Music21Objects, see {@link music21.base}
         * 
         * @requires music21/duration
         * @requires music21/prebase
         * @exports music21/base
         */
        function(prebase, duration) {
    /**
     * Module for Music21Objects.  Does not load other modules, see {@link music21.moduleLoader}
     * for this functionality.
     * 
     * @namespace music21.base
     * @memberof music21
     */
    var base = {};

	/**
     * Base class for any object that can be placed in a {@link music21.stream.Stream}.
	 * 
	 * @class Music21Object
	 * @memberof music21.base
     * @extends music21.prebase.ProtoM21Object
     * @property {object} activeSite - hardlink to a {@link music21.stream.Stream} containing the element.
     * @property {number} classSortOrder - Default sort order for this class (default 20; override in other classes). Lower numbered objects will sort before other objects in the staff if priority and offset are the same.
     * @property {music21.duration.Duration} duration - the duration (object) for the element. (can be set with a quarterLength also)
     * @property {Array} groups - An Array of strings representing group (equivalent to css classes) to assign to the object. (default [])
     * @property {boolean} isMusic21Object - true
     * @property {boolean} isStream - false
     * @property {number|null} offset - offset from the beginning of the stream (in quarterLength)
     * @property {number} priority - The priority (lower = earlier or more left) for elements at the same offset. (default 0)
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