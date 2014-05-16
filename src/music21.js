/*
music21j -- Javascript reimplementation of Core music21 features.  
See http://web.mit.edu/music21/ for more details.

Copyright (c) 2013, Michael Scott Cuthbert and cuthbertLab

This version is released in non-minimized form under LGPL or proprietary licenses (your choice; the
former is Free; the latter costs money, but lets you use minimizers, etc. to optimize
web loading).  The license is still under discussion; please contact cuthbert@mit.edu for
more information.

The plan is to implement all core music21 features as Javascript and to expose
more sophisticated features via server-side connections to remote servers running the
python music21 (music21p).

All interfaces are alpha and may change radically from day to day and release to release.
Do not use this in production code yet.

2013-10-04 -- v.0.1.alpha 

*/

if ( typeof define === "function" && define.amd) {
    define( "music21", ['../ext/jquery/jquery-1.11.1.min', 
                        '../ext/vexflow/vexflow-min',
                        '../ext/midijs/js/MIDI/AudioDetect',
                        '../ext/midijs/js/MIDI/LoadPlugin',
                        '../ext/midijs/js/MIDI/Plugin',
                        '../ext/midijs/js/MIDI/Player',
                        '../ext/midijs/js/Window/DOMLoader.XMLHttp',
                        '../ext/midijs/js/Window/DOMLoader.script',                        
                        '../ext/midijs/inc/Base64',
                        '../ext/midijs/inc/base64binary',
                        'music21/base', ], 
    		function (require) { 
        MIDI.loadPlugin({
    		soundfontUrl: "../ext/midijs/soundfont/",
    		instrument: "acoustic_grand_piano",
    		callback: function() {
    			startTime = new Date().getTime();
    		}
    	});
    	var m21 = Music21;
    	return m21;
    });
}