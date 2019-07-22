// webpack loader for music21j.
import 'es6-shim';
import '@babel/polyfill';
// import './ext/jqueryPlugins/attrchange.js';
// import './ext/jqueryPlugins/jqueryUI/jquery-ui.min.js';

// import './ext/midijs/inc/shim/WebAudioAPI.js';
// import './ext/midijs/inc/jasmid/midifile.js';
// import './ext/midijs/inc/jasmid/replayer.js';
// import './ext/midijs/inc/jasmid/stream.js';
// import './ext/midijs/inc/shim/Base64binary.js';
//
// import './ext/midijs/js/midi/audioDetect.js';
// import './ext/midijs/js/midi/gm.js';
// import './ext/midijs/js/midi/loader.js';
// import './ext/midijs/js/midi/player.js';
// import './ext/midijs/js/midi/plugin.audiotag.js';
// import './ext/midijs/js/midi/plugin.webaudio.js';
// import './ext/midijs/js/midi/synesthesia.js';

export { MIDI } from './ext/midijs/build/MIDI.js';

// order below doesn't matter, but good to give a sense
// of what will be needed by almost everyone, and then
// alphabetical.
export * as exceptions21 from './music21/exceptions21.js';
export { debug } from './music21/debug.js';
export { common } from './music21/common.js';
export { prebase } from './music21/prebase.js';
export { base } from './music21/base.js';

export { articulations } from './music21/articulations.js';
export { audioRecording } from './music21/audioRecording.js';
export { audioSearch } from './music21/audioSearch.js';
export * as bar from './music21/bar.js';
export { beam } from './music21/beam.js';
export { chord } from './music21/chord.js';
export * as chordTables from './music21/chordTables.js';
export { clef } from './music21/clef.js';
export * as converter from './music21/converter.js';
export * as derivation from './music21/derivation.js';
export { duration } from './music21/duration.js';
export { dynamics } from './music21/dynamics.js';
export { expressions } from './music21/expressions.js';
export { figuredBass } from './music21/figuredBass.js';
export { fromPython } from './music21/fromPython.js';
export { harmony } from './music21/harmony.js';
export { instrument } from './music21/instrument.js';
export { interval } from './music21/interval.js';
export { key } from './music21/key.js';
export { keyboard } from './music21/keyboard.js';
export { layout } from './music21/layout.js';
export { meter } from './music21/meter.js';
export { miditools } from './music21/miditools.js';
export { musicxml } from './music21/musicxml.js';
export { note } from './music21/note.js';
export { pitch } from './music21/pitch.js';
export { renderOptions } from './music21/renderOptions.js';
export { roman } from './music21/roman.js';
export { scale } from './music21/scale.js';
export * as sites from './music21/sites.js';
export { stream } from './music21/stream.js';
export { tempo } from './music21/tempo.js';
export { tie } from './music21/tie.js';
export { tinyNotation } from './music21/tinyNotation.js';
export { voiceLeading } from './music21/voiceLeading.js';
export { vfShow } from './music21/vfShow.js';
export { webmidi } from './music21/webmidi.js';
