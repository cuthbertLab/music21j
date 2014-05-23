if ( typeof define === "function" && define.amd) {
	define(['../ext/require/order!../ext/midijs/js/MIDI/AudioDetect',
            '../ext/require/order!../ext/midijs/js/MIDI/LoadPlugin',
            '../ext/require/order!../ext/midijs/js/MIDI/Plugin',
            '../ext/require/order!../ext/midijs/js/MIDI/Player',
            '../ext/require/order!../ext/midijs/js/Window/DOMLoader.XMLHttp',
            '../ext/require/order!../ext/midijs/js/Window/DOMLoader.script',                        
            '../ext/require/order!../ext/midijs/inc/Base64',
            '../ext/require/order!../ext/midijs/inc/base64binary',], 
           function(require) {
				MIDI.audioDetect(function(){return true;} );
				return MIDI;
	});
}