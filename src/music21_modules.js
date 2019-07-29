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
import 'es6-shim';
import '@babel/polyfill';

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

import * as bar from './music21/bar.js';
import * as beam from './music21/beam.js';
import * as chordTables from './music21/chordTables.js';
import * as converter from './music21/converter.js';
import * as derivation from './music21/derivation.js';
import * as duration from './music21/duration.js';
import * as figuredBass from './music21/figuredBass.js';
import * as interval from './music21/interval.js';
import * as note from './music21/note.js';
import * as parseLoader from './music21/parseLoader.js';
import * as pitch from './music21/pitch.js';
import * as sites from './music21/sites.js';
import * as tempo from './music21/tempo.js';
import * as tie from './music21/tie.js';
import * as tinyNotation from './music21/tinyNotation.js';
import * as vfShow from './music21/vfShow.js';
import * as voiceLeading from './music21/voiceLeading.js';
import * as webmidi from './music21/webmidi.js';

export { debug } from './music21/debug.js';

// these below need to be rewritten to be like above...

export { articulations } from './music21/articulations.js';
export { audioRecording } from './music21/audioRecording.js';
export { audioSearch } from './music21/audioSearch.js';
export { chord } from './music21/chord.js';
export { clef } from './music21/clef.js';
export { dynamics } from './music21/dynamics.js';
export { expressions } from './music21/expressions.js';
export { fromPython } from './music21/fromPython.js';
export { harmony } from './music21/harmony.js';
export { instrument } from './music21/instrument.js';
export { key } from './music21/key.js';
export { keyboard } from './music21/keyboard.js';
export { layout } from './music21/layout.js';
export { meter } from './music21/meter.js';
export { miditools } from './music21/miditools.js';
export { musicxml } from './music21/musicxml.js';
export { renderOptions } from './music21/renderOptions.js';
export { roman } from './music21/roman.js';
export { scale } from './music21/scale.js';
export { stream } from './music21/stream.js';

export {
    MIDI,

    exceptions21,
    base,
    prebase,
    common,

    bar,
    beam,
    chordTables,
    converter,
    derivation,
    duration,
    figuredBass,
    interval,
    note,
    parseLoader,
    pitch,
    sites,
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
