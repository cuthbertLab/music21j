/**!
 * **music21j**: Javascript reimplementation of Core music21 features.
 *
 * See http://web.mit.edu/music21/ for more details.
 *
 * Copyright (c) 2013-20, Michael Scott Cuthbert and cuthbertLab
 * Released under a BSD-3-clause license
 *
 */
/**
 *
 * Based on music21, Copyright (c) 2006-20, Michael Scott Cuthbert and cuthbertLab
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
import * as Vex from 'vexflow';
import 'jquery-ui-bundle';

// TODO: add attrchange

// order below doesn't matter, but good to give a sense
// of what will be needed by almost everyone, and then
// alphabetical.

import * as exceptions21 from './music21/exceptions21';
import * as prebase from './music21/prebase';
import * as base from './music21/base';
import * as common from './music21/common';

import * as articulations from './music21/articulations';
import * as audioRecording from './music21/audioRecording';
import * as audioSearch from './music21/audioSearch';
import * as bar from './music21/bar';
import * as beam from './music21/beam';
import * as chord from './music21/chord';
import * as chordTables from './music21/chordTables';
import * as clef from './music21/clef';
import * as converter from './music21/converter';
import * as derivation from './music21/derivation';
import * as duration from './music21/duration';
import * as dynamics from './music21/dynamics';
import * as editorial from './music21/editorial';
import * as expressions from './music21/expressions';
import * as figuredBass from './music21/figuredBass';
import * as fromPython from './music21/fromPython';
import * as harmony from './music21/harmony';
import * as instrument from './music21/instrument';
import * as interval from './music21/interval';
import * as key from './music21/key';
import * as keyboard from './music21/keyboard';
import * as layout from './music21/layout';
import * as meter from './music21/meter';
import * as miditools from './music21/miditools';
import * as musicxml from './music21/musicxml';
import * as note from './music21/note';
import * as parseLoader from './music21/parseLoader';
import * as pitch from './music21/pitch';
import * as renderOptions from './music21/renderOptions';
import * as roman from './music21/roman';
import * as scale from './music21/scale';
import * as sites from './music21/sites';
import * as stream from './music21/stream';
import * as tempo from './music21/tempo';
import * as tie from './music21/tie';
import * as tinyNotation from './music21/tinyNotation';
import * as vfShow from './music21/vfShow';
import * as voiceLeading from './music21/voiceLeading';
import * as webmidi from './music21/webmidi';

import { debug } from './music21/debug';


export {
    MIDI,
    Vex,

    exceptions21,
    base,
    prebase,
    common,

    debug,

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
    editorial,
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
