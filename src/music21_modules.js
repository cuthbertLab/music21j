// webpack loader for music21j.
import 'es6-shim';
import 'jquery';
import './ext/jqueryPlugins/attrchange.js';
import './ext/jqueryPlugins/jqueryUI/jquery-ui.min.js';
import './ext/midijs/inc/jasmid/midifile.js';
import './ext/midijs/inc/jasmid/replayer.js';
import './ext/midijs/inc/jasmid/stream.js';
import './ext/midijs/inc/shim/Base64binary.js';
import './ext/midijs/inc/shim/WebMIDIAPI.js';
import './ext/midijs/inc/shim/WebAudioAPI.js';
import './ext/jsonpickle/build/jsonpickle.debug.js';
import './ext/midijs/build/MIDI.js';

import music21 from './loadModules.js';
export default music21;
