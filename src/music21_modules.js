// new-style -- uses module syntax

// this does not currently work, but very promising for the future!

import * as $ from './ext/jquery/jquery-3.2.1.min.js';
import './ext/jqueryPlugins/attrchange.js';
import './ext/jqueryPlugins/jqueryUI/jquery-ui.min.js';
import './ext/midijs/inc/jasmid/midifile.js';
import './ext/midijs/inc/jasmid/replayer.js';
import './ext/midijs/inc/jasmid/stream.js';
import './ext/midijs/examples/inc/event.js';
import './ext/es6-shim.js';
import './ext/midijs/inc/shim/Base64binary.js';
import './ext/midijs/inc/shim/WebMIDIAPI.js';
import './ext/midijs/inc/shim/WebAudioAPI.js';
import './ext/jsonpickle/build/jsonpickle.debug.js';
import './ext/polyfill.js';
import './ext/midijs/build/MIDI.js';
import './ext/vexflow/vexflow-min.js';

import { music21 } from './loadModules.js';
