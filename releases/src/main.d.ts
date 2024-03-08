/**!
 * **music21j**: Javascript reimplementation of Core music21 features.
 *
 * See http://web.mit.edu/music21/ for more details.
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Released under a BSD-3-clause license
 *
 */
/**
 *
 * Based on music21, Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 * The plan is to implement all core music21 features as Javascript and to expose
 * more sophisticated features via server-side connections to remote servers running the
 * python music21 (music21p).
 *
 * Requires an ECMAScript 5 compatible browser w/ SVG and Canvas. Any recent
 * version of Firefox, Safari, Edge,  Chrome, etc. will do.
 *
 * All interfaces are beta and may change radically from day to day and release to release.
 * Do not use this in production code yet.
 *
 * music21j acknowledges VexFlow and MIDI.js in particular for their great efforts without which
 * this module would not be possible.
 *
 */
import 'regenerator-runtime/runtime';
import * as MIDI from 'midicube';
import * as Vex from 'vexflow';
import * as exceptions21 from './exceptions21';
import * as prebase from './prebase';
import * as base from './base';
import * as common from './common';
import * as articulations from './articulations';
import * as audioRecording from './audioRecording';
import * as audioSearch from './audioSearch';
import * as bar from './bar';
import * as beam from './beam';
import * as chord from './chord';
import * as chordTables from './chordTables';
import * as clef from './clef';
import * as converter from './converter';
import defaults from './defaults';
import * as derivation from './derivation';
import * as duration from './duration';
import * as dynamics from './dynamics';
import * as editorial from './editorial';
import * as expressions from './expressions';
import * as figuredBass from './figuredBass';
import * as fromPython from './fromPython';
import * as harmony from './harmony';
import * as instrument from './instrument';
import * as interval from './interval';
import * as key from './key';
import * as keyboard from './keyboard';
import * as layout from './layout';
import * as meter from './meter';
import * as miditools from './miditools';
import * as musicxml from './musicxml';
import * as note from './note';
import * as parseLoader from './parseLoader';
import * as pitch from './pitch';
import * as renderOptions from './renderOptions';
import * as roman from './roman';
import * as scale from './scale';
import * as sites from './sites';
import * as stream from './stream';
import * as style from './style';
import * as svgs from './svgs';
import * as tempo from './tempo';
import * as tie from './tie';
import * as tinyNotation from './tinyNotation';
import * as vfShims from './vfShims';
import * as vfShow from './vfShow';
import * as voiceLeading from './voiceLeading';
import * as webmidi from './webmidi';
import { debug } from './debug';
export { MIDI, Vex, exceptions21, base, prebase, common, debug, articulations, audioRecording, audioSearch, bar, beam, chord, chordTables, clef, converter, defaults, derivation, duration, dynamics, editorial, expressions, figuredBass, fromPython, harmony, instrument, interval, key, keyboard, layout, meter, miditools, musicxml, note, parseLoader, pitch, renderOptions, roman, scale, sites, stream, style, svgs, tempo, tie, tinyNotation, vfShims, vfShow, voiceLeading, webmidi, };
export declare const VERSION = "0.15.8";
//# sourceMappingURL=main.d.ts.map