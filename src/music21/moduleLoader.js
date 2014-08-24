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

// order below doesn't matter, but good to give a sense
// of what will be needed by almost everyone, and then
// alphabetical
define(['./prebase',
        './base', 
        './common',
        
        './articulations',
        './beam',
        './chord', 
        './clef',
        './duration', 
        './dynamics', 
        './expressions',
        './fromPython', 
        './interval', 
        './jazzMidi',
        './key', 
        './keyboard',
        './layout',
        './meter',
        './miditools',
        './note', 
        './pitch', 
        './renderOptions', 
        './roman', 
        './stream',
        './streamInteraction',
        './tempo',
        './tie',
        './tinyNotation',
        './vfShow',
        './widgets',
        ], 
        function() {
			return music21;
		}
); // end define

