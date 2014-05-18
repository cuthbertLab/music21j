/*
music21j -- Javascript reimplementation of Core music21 features.  
See http://web.mit.edu/music21/ for more details.

Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab

This version is released in non-minimized form under LGPL or proprietary licenses (your choice; the
former is Free; the latter costs money, but lets you use minimizers, etc. to optimize
web loading).  The license is still under discussion; please contact cuthbert@mit.edu for
more information.

The plan is to implement all core music21 features as Javascript and to expose
more sophisticated features via server-side connections to remote servers running the
python music21 (music21p).

All interfaces are alpha and may change radically from day to day and release to release.
Do not use this in production code yet.

2014-05-16 -- v.0.2.0 (alpha) -- refactor into modules using require.js
2013-10-04 -- v.0.1.0 (alpha) -- initial testing in MIT 21m.051 Fundamentals of Music class

*/

/** Not fully AMD since music21 is given as a global variable.
 *   This is a conscious choice to make development much easier.
 *
 */

if (typeof (music21) == "undefined") {
	music21 = {};
}

music21.VERSION = [0, 2, 0];
music21.VERSION_STR = music21.VERSION.join(", ");
music21.PYTHON_COMPAT_VERSION = [1, 9, 2]; // Python version built to match

music21.debug = false;
music21._inClass = function (testClass) {
	if ($.inArray(testClass, this.classes) != -1) {
		return true;
	} else {
		return false;
	}
};


/* jQuery extensions
 * 
 */
/**
 * Logic for copying events from one jQuery object to another.
 *
 * @private 
 * @name jQuery.event.copy
 * @param jQuery|String|DOM Element jQuery object to copy events from. Only uses the first matched element.
 * @param jQuery|String|DOM Element jQuery object to copy events to. Copies to all matched elements.
 * @type undefined
 * @cat Plugins/copyEvents
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * @author Yannick Albert (mail@yckart.com || http://yckart.com)
 */
if (typeof(jQuery) != "undefined") {
	jQuery.event.copy = function (from, to) {
	    from = from.jquery ? from : jQuery(from);
	    to = to.jquery ? to : jQuery(to);
	
	    var events = from[0].events || jQuery.data(from[0], "events") || jQuery._data(from[0], "events");
	    if (!from.length || !to.length || !events) return;
	
	    return to.each(function () {
	        for (var type in events)
	        for (var handler in events[type])
	        jQuery.event.add(this, type, events[type][handler], events[type][handler].data);
	    });
	};
}

define(['music21/pitch', 'music21/duration', 'music21/base', 'music21/note', 'music21/meter',
        'music21/chord', 'music21/roman', 'music21/key', 'music21/interval', 'music21/clef',
        'music21/renderOptions', 'music21/tinyNotation', 'music21/dynamics', 'music21/stream',
        'music21/jazzMidi','music21/articulations','music21/jsonPickle', 'music21/expressions'], 
        function(require) {
			return music21;
		}
); // end define

