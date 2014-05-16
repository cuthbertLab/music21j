/**
 * m21theory -- supplemental routines for music theory teaching and
 * assessment using the javascript reimplementation of music21 (music21j). 
 *
 * See http://web.mit.edu/music21/ for more details.
 * 
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 *
 * This version is released for use in 2013-14 in non-minimized form under LGPL or 
 * proprietary licenses (your choice; the former is Free; the latter costs money,
 * but lets you use minimizers, etc. to optimize web loading).  The permanent license 
 * is still under discussion; please contact cuthbert@mit.edu for more information.
 * 
 * All interfaces are alpha and may change radically from day to day and release to release.
 * Do not use this in production code yet.
 * 
 * 2014-05-01 -- v.0.2.alpha (release)
 * 2013-10-05 -- v.0.1.alpha 
 * 
 */


if (typeof (m21theory) === "undefined") {
	m21theory = {};
}
m21theory.debug = false;

if ( typeof define === "function" && define.amd) {
    define( "m21theory", ['music21', 
                          'm21theory/userData', 'm21theory/random', 'm21theory/misc',
                          'm21theory/bank', 'm21theory/section', 'm21theory/tests'], 
    		function (require) { 

    	// this may get loaded twice, but I think the cache handles it...
        MIDI.loadPlugin({
    		soundfontUrl: "../ext/midijs/soundfont/",
    		instrument: "acoustic_grand_piano",
    		callback: function() {
    			m21theory.misc.playMotto(); // disable this to not play the motto on loading...
    		}
    	});
    });
}