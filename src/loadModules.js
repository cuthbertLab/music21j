// order below doesn't matter, but good to give a sense
// of what will be needed by almost everyone, and then
// alphabetical.
import * as exceptions21 from './music21/exceptions21.js';
import { debug } from './music21/debug.js';
import { common } from './music21/common.js';
import { prebase } from './music21/prebase.js';
import { base } from './music21/base.js';

import { articulations } from './music21/articulations.js';
import { audioRecording } from './music21/audioRecording.js';
import { audioSearch } from './music21/audioSearch.js';
import { beam } from './music21/beam.js';
import { chord } from './music21/chord.js';
import { clef } from './music21/clef.js';
import { duration } from './music21/duration.js';
import { dynamics } from './music21/dynamics.js';
import { expressions } from './music21/expressions.js';
import { fromPython } from './music21/fromPython.js';
import { instrument } from './music21/instrument.js';
import { interval } from './music21/interval.js';
import { key } from './music21/key.js';
import { keyboard } from './music21/keyboard.js';
import { layout } from './music21/layout.js';
import { meter } from './music21/meter.js';
import { miditools } from './music21/miditools.js';
import { musicxml } from './music21/musicxml.js';
import { note } from './music21/note.js';
import { pitch } from './music21/pitch.js';
import { renderOptions } from './music21/renderOptions.js';
import { roman } from './music21/roman.js';
import { scale } from './music21/scale.js';
import { stream } from './music21/stream.js';
import { streamInteraction } from './music21/streamInteraction.js';
import { tempo } from './music21/tempo.js';
import { tie } from './music21/tie.js';
import { tinyNotation } from './music21/tinyNotation.js';
import { vfShow } from './music21/vfShow.js';
import { webmidi } from './music21/webmidi.js';
import { widgets } from './music21/widgets.js';

const music21 = {};

music21.common = common;
music21.debug = debug;
music21.prebase = prebase;
music21.base = base;

music21.articulations = articulations;
music21.audioRecording = audioRecording;
music21.audioSearch = audioSearch;
music21.beam = beam;
music21.chord = chord;
music21.clef = clef;
music21.dynamics = dynamics;
music21.duration = duration;
music21.exceptions21 = exceptions21;
music21.expressions = expressions;
music21.fromPython = fromPython;
music21.instrument = instrument;
music21.interval = interval;
music21.key = key;
music21.keyboard = keyboard;
music21.layout = layout;
music21.meter = meter;
music21.miditools = miditools;
music21.musicxml = musicxml;
music21.note = note;
music21.pitch = pitch;
music21.renderOptions = renderOptions;
music21.roman = roman;
music21.scale = scale;
music21.stream = stream;
music21.streamInteraction = streamInteraction;
music21.tempo = tempo;
music21.tie = tie;
music21.tinyNotation = tinyNotation;
music21.vfShow = vfShow;
music21.webmidi = webmidi;
music21.widgets = widgets;

export default music21;
