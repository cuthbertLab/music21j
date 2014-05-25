if ( typeof define === "function" && define.amd) {
    require.config({
        paths: {
            'MIDI/AudioDetect': 'ext/midijs/js/MIDI/AudioDetect',
            'MIDI/LoadPlugin': 'ext/midijs/js/MIDI/LoadPlugin',
            'MIDI/Plugin': 'ext/midijs/js/MIDI/Plugin',
            'MIDI/Player': 'ext/midijs/js/MIDI/Player',
            'Window/DOMLoader.XMLHttp': 'ext/midijs/js/Window/DOMLoader.XMLHttp',
            'Window/DOMLoader.script': 'ext/midijs/js/Window/DOMLoader.script',            
            'Base64': 'ext/midijs/inc/Base64',            
            'base64binary': 'ext/midijs/inc/base64binary',
        },
        shim: {
            'MIDI/AudioDetect': {
                exports: 'MIDI'
            }
        }
    });
    
    define(['../ext/require/order!MIDI/AudioDetect',
            '../ext/require/order!MIDI/LoadPlugin',
            '../ext/require/order!MIDI/Plugin',
            '../ext/require/order!MIDI/Player',
            '../ext/require/order!Window/DOMLoader.XMLHttp',
            '../ext/require/order!Window/DOMLoader.script',                        
            '../ext/require/order!Base64',
            '../ext/require/order!base64binary',
            'jquery'], 
           function(midi) {
                $(document).ready( function() {
	                    midi.audioDetect(function(){return true;} );
	            });
				return midi;
	});
}