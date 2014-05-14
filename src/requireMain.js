/*
 
Require file for require.js

Call with

<script data-main="src/requireMain.js" src="ext/require/require.js"></script>

*/

require.config({
    paths: {
        // the left side is the module ID,
        // the right side is the path to
        // the jQuery file, relative to baseUrl. (/src)
        // Also, the path should NOT include
        // the '.js' file extension.
        'jquery': '../ext/jquery/jquery-1.11.1.min',
        'Music21': 'music21/music21jExp',
        'MIDI': '../ext/midijs/js/MIDI',
        'Window': '../ext/midijs/js/Window',
        'Base64': '../ext/midijs/inc/Base64',
        'base64binary': '../ext/midijs/inc/base64binary',
        'Vexflow': '../ext/vexflow/vexflow-min',
        'base': 'music21/base',
    }
});

require(['jquery', 'MIDI/AudioDetect', 'MIDI/LoadPlugin',
           'MIDI/Plugin', 'MIDI/Player', 'Window/DOMLoader.XMLHttp', 
           'Window/DOMLoader.script', 'Base64', 'base64binary',
           'Vexflow', 'Music21', 'base'],
		  function($, MIDI, MIDIPl, MIDIPlay, WindowDOM, WindowDOMScript,
				  Base64, base64binary, Vex, Music21, base) {
	// jquery and Music21 are defined now...

});

