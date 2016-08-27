// order below doesn't matter, but good to give a sense
// of what will be needed by almost everyone, and then
// alphabetical
import { common } from './music21/common';
import { prebase } from './music21/prebase';
import { base } from './music21/base';

import { articulations } from './music21/articulations'; 
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
//import { orchestralScore } from './music21/orchestralScore';
import { pitch } from './music21/pitch';
import { renderOptions } from './music21/renderOptions';
import { roman } from './music21/roman';
import { stream } from './music21/stream';
import { streamInteraction } from './music21/streamInteraction';
import { tempo } from './music21/tempo';
import { tie } from './music21/tie';
import { tinyNotation } from './music21/tinyNotation';
import { vfShow } from './music21/vfShow';
import { webmidi } from './music21/webmidi';
import { widgets } from './music21/widgets';

export var m21 = {}
m21.common = common;
m21.prebase = prebase;
m21.base = base;

m21.articulations = articulations;
m21.audioSearch = audioSearch;
m21.beam = beam;
m21.chord = chord;
m21.clef = clef;
m21.duration = duration;
m21.expressions = expressions;
m21.fromPython = fromPython;
m21.instrument = instrument;
m21.interval = interval;
m21.key = key;
m21.keyboard = keyboard;
m21.layout = layout;
m21.meter = meter;
m21.miditools = miditools;
m21.note = note;
//m21.orchestralScore = orchestralScore;
m21.pitch = pitch;
m21.renderOptions = renderOptions;
m21.roman = roman;
m21.stream = stream;
m21.streamInteraction = streamInteraction;
m21.tempo = tempo;
m21.tie = tie;
m21.tinyNotation = tinyNotation;
m21.vfShow = vfShow;
m21.webmidi = webmidi;
m21.widgets = widgets;
