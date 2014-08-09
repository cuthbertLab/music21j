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
define(['music21/prebase',
        'music21/base', 
        'music21/common',
        
        'music21/articulations',
        'music21/beam',
        'music21/chord', 
        'music21/clef',
        'music21/duration', 
        'music21/dynamics', 
        'music21/expressions',
        'music21/interval', 
        'music21/jazzMidi',
        'music21/jsonPickle', 
        'music21/key', 
        'music21/keyboard',
        'music21/layout',
        'music21/meter',
        'music21/miditools',
        'music21/note', 
        'music21/pitch', 
        'music21/renderOptions', 
        'music21/roman', 
        'music21/stream',
        'music21/tempo',
        'music21/tie',
        'music21/tinyNotation', 
        'music21/vfShow',
        ], 
        function() {
			return music21;
		}
); // end define

