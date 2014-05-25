if ( typeof define === "function" && define.amd) {
    require.config({
        paths: {'MIDI': 'ext/midijs/build/MIDI',
            'Base64': 'ext/midijs/inc/Base64',             
          'base64binary': 'ext/midijs/inc/base64binary',
        },
    });
    var DEBUG = false;
    var consolelog = function(msg) {
        if (DEBUG) {
            console.log(msg);
        }
    };
    var MIDI = {music21defined: true};
    define(['MIDI','Base64','base64binary','jquery'], function() {
        MIDI.soundfontUrl = 'http://web.mit.edu/music21/music21j/src/ext/midijs/soundfont/';
        MIDI.loadedSoundfonts = {};
        var tempload = function(soundfont, callback) {
            var callwrapper = function () {
                consolelog('soundfont loaded about to execute callback.');
                callback();
                music21.MIDI.loadedSoundfonts[soundfont] = true;                
            };
            if (music21.MIDI.loadedSoundfonts[soundfont] == true) {
                callback();
            } else if (music21.MIDI.loadedSoundfonts[soundfont] == 'loading'){
                var waitThenCall = undefined;
                waitThenCall = function() {
                    if (music21.MIDI.loadedSoundfonts[soundfont] == true) {
                        consolelog('other process has finished loading; calling callback');
                        callback();
                    } else {
                        consolelog('waiting for other process load');
                        setTimeout(waitThenCall, 100);
                    }
                };
                waitThenCall();
            } else {
                music21.MIDI.loadedSoundfonts[soundfont] = "loading";
                consolelog('waiting for document ready');
                $(document).ready( function() {
                    consolelog('document ready, waiting to load soundfont');
                    music21.MIDI.loadPlugin({
                        soundfontUrl: music21.MIDI.soundfontUrl,
                        instrument: soundfont,
                        callback: callwrapper,
                    });
                });
            }
        };
        MIDI.loadSoundfont = tempload.bind(MIDI);
        return MIDI;

        
    });
}

//                    '../ext/require/order!MIDI/LoadPlugin',
//                    '../ext/require/order!MIDI/Plugin',
//                    '../ext/require/order!MIDI/Player',
//                    '../ext/require/order!Window/DOMLoader.XMLHttp',
//                    '../ext/require/order!Window/DOMLoader.script',                        
//                    '../ext/require/order!Base64',
//                    '../ext/require/order!base64binary',
//                    'jquery'], 
//                   function(audiodetect, loadplugin, plugin, player) {


//if ( typeof define === "function" && define.amd) {
//    require.config({
//        paths: {
//            'MIDI/AudioDetect': 'ext/midijs/js/MIDI/AudioDetect',
//            'MIDI/LoadPlugin': 'ext/midijs/js/MIDI/LoadPlugin',
//            'MIDI/Plugin': 'ext/midijs/js/MIDI/Plugin',
//            'MIDI/Player': 'ext/midijs/js/MIDI/Player',
//            'Window/DOMLoader.XMLHttp': 'ext/midijs/js/Window/DOMLoader.XMLHttp',
//            'Window/DOMLoader.script': 'ext/midijs/js/Window/DOMLoader.script',            
//            'Base64': 'ext/midijs/inc/Base64',            
//            'base64binary': 'ext/midijs/inc/base64binary',
//        },
//        shim: {
//            'MIDI/AudioDetect': { exports: 'audiodetect' },
//            'MIDI/LoadPlugin': { exports: 'loadplugin' },
//            'MIDI/Plugin': { exports: 'plugin' },
//            'MIDI/Player': { exports: 'player' }
//        }
//    });
//    
//    define(['../ext/require/order!MIDI/AudioDetect',
//            '../ext/require/order!MIDI/LoadPlugin',
//            '../ext/require/order!MIDI/Plugin',
//            '../ext/require/order!MIDI/Player',
//            '../ext/require/order!Window/DOMLoader.XMLHttp',
//            '../ext/require/order!Window/DOMLoader.script',                        
//            '../ext/require/order!Base64',
//            '../ext/require/order!base64binary',
//            'jquery'], 
//           function(audiodetect, loadplugin, plugin, player) {
//                console.log(audiodetect);
//                console.log(loadplugin);
//                console.log(plugin);
//                console.log(player);
//                var midi = {};
//                for(var x in audiodetect) {
//                    midi[x] = audiodetect[x];
//                }
//                for(var x in plugin) {
//                    midi[x] = plugin[x];
//                }
//                for(var x in loadplugin) {
//                    midi[x] = loadplugin[x];
//                }
//                for(var x in player) {
//                    midi[x] = player[x];
//                }
//                console.log("MIDI:");
//                console.log(midi);
//                
//                $(document).ready( function() {
//	                    midi.audioDetect(function(){return true;} );
//	            });
//				return midi;
//	});
//}