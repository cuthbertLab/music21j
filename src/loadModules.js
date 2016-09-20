// order below doesn't matter, but good to give a sense
// of what will be needed by almost everyone, and then
// alphabetical.
import * as exceptions21 from './music21/exceptions21';
import { debug } from './music21/debug';
import { common } from './music21/common';
import { prebase } from './music21/prebase';
import { base } from './music21/base';

import { articulations } from './music21/articulations';
import { audioRecording } from './music21/audioRecording';
import { audioSearch } from './music21/audioSearch';
import { beam } from './music21/beam';
import { chord } from './music21/chord';
import { clef } from './music21/clef';
import { duration } from './music21/duration';
import { dynamics } from './music21/dynamics';
import { expressions } from './music21/expressions';
import { fromPython } from './music21/fromPython';
import { instrument } from './music21/instrument';
import { interval } from './music21/interval';
import { key } from './music21/key';
import { keyboard } from './music21/keyboard';
import { layout } from './music21/layout';
import { meter } from './music21/meter';
import { miditools } from './music21/miditools';
import { note } from './music21/note';
import { pitch } from './music21/pitch';
import { renderOptions } from './music21/renderOptions';
import { roman } from './music21/roman';
import { scale } from './music21/scale';
import { stream } from './music21/stream';
import { streamInteraction } from './music21/streamInteraction';
import { tempo } from './music21/tempo';
import { tie } from './music21/tie';
import { tinyNotation } from './music21/tinyNotation';
import { vfShow } from './music21/vfShow';
import { webmidi } from './music21/webmidi';
import { widgets } from './music21/widgets';

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
