/**
 * **music21j**: Javascript reimplementation of Core music21 features.
 *
 * See http://web.mit.edu/music21/ for more details.
 *
 * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
 *
 * Based on music21, Copyright (c) 2006-19, Michael Scott Cuthbert and cuthbertLab
 * The plan is to implement all core music21 features as Javascript and to expose
 * more sophisticated features via server-side connections to remote servers running the
 * python music21 (music21p).
 *
 * Requires an ECMAScript 5 compatible browser w/ SVG and Canvas. IE 11 or any recent
 * version of Firefox, Safari, Edge,  Chrome, etc. will do.
 *
 * All interfaces are alpha and may change radically from day to day and release to release.
 * Do not use this in production code yet.
 *
 * music21j acknowledges VexFlow, MIDI.js in particular for their great efforts without which
 * this module would not be possible.
 *
 * @namespace music21
 * @exports music21
 */

// webpack loader for music21j.
import 'regenerator-runtime/runtime';
import * as MIDI from 'midicube';  // to be removed when export * from is okay.
import * as $ from 'jquery';
import 'jquery-ui-bundle';

// TODO: add attrchange

// order below doesn't matter, but good to give a sense
// of what will be needed by almost everyone, and then
// alphabetical.

import * as exceptions21 from './music21/exceptions21.js';
import * as prebase from './music21/prebase.js';
import * as base from './music21/base.js';
import * as common from './music21/common.js';

import * as articulations from './music21/articulations.js';
import * as audioRecording from './music21/audioRecording.js';
import * as audioSearch from './music21/audioSearch.js';
import * as bar from './music21/bar.js';
import * as beam from './music21/beam.js';
import * as chord from './music21/chord.js';
import * as chordTables from './music21/chordTables.js';
import * as clef from './music21/clef.js';
import * as converter from './music21/converter.js';
import * as derivation from './music21/derivation.js';
import * as duration from './music21/duration.js';
import * as dynamics from './music21/dynamics.js';
import * as expressions from './music21/expressions.js';
import * as figuredBass from './music21/figuredBass.js';
import * as fromPython from './music21/fromPython.js';
import * as harmony from './music21/harmony.js';
import * as instrument from './music21/instrument.js';
import * as interval from './music21/interval.js';
import * as key from './music21/key.js';
import * as keyboard from './music21/keyboard.js';
import * as layout from './music21/layout.js';
import * as meter from './music21/meter.js';
import * as miditools from './music21/miditools.js';
import * as musicxml from './music21/musicxml.js';
import * as note from './music21/note.js';
import * as parseLoader from './music21/parseLoader.js';
import * as pitch from './music21/pitch.js';
import * as renderOptions from './music21/renderOptions.js';
import * as roman from './music21/roman.js';
import * as scale from './music21/scale.js';
import * as sites from './music21/sites.js';
import * as stream from './music21/stream.js';
import * as tempo from './music21/tempo.js';
import * as tie from './music21/tie.js';
import * as tinyNotation from './music21/tinyNotation.js';
import * as vfShow from './music21/vfShow.js';
import * as voiceLeading from './music21/voiceLeading.js';
import * as webmidi from './music21/webmidi.js';

export { debug } from './music21/debug.js';

// these below need to be rewritten to be like above...


export {
    MIDI,

    exceptions21,
    base,
    prebase,
    common,

    articulations,
    audioRecording,
    audioSearch,
    bar,
    beam,
    chord,
    chordTables,
    clef,
    converter,
    derivation,
    duration,
    dynamics,
    expressions,
    figuredBass,
    fromPython,
    harmony,
    instrument,
    interval,
    key,
    keyboard,
    layout,
    meter,
    miditools,
    musicxml,
    note,
    parseLoader,
    pitch,
    renderOptions,
    roman,
    scale,
    sites,
    stream,
    tempo,
    tie,
    tinyNotation,
    vfShow,
    voiceLeading,
    webmidi,
};

export const VERSION = '0.9.5';

window.$ = $;
window.jQuery = $;

parseLoader.runConfiguration();
