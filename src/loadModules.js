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
import * as chordTables from './music21/chordTables.js';
import { clef } from './music21/clef.js';
import * as converter from './music21/converter.js';
import { duration } from './music21/duration.js';
import { dynamics } from './music21/dynamics.js';
import { expressions } from './music21/expressions.js';
import { figuredBass } from './music21/figuredBass.js';
import { fromPython } from './music21/fromPython.js';
import { harmony } from './music21/harmony.js';
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
import * as sites from './music21/sites.js';
import { stream } from './music21/stream.js';
import { tempo } from './music21/tempo.js';
import { tie } from './music21/tie.js';
import { tinyNotation } from './music21/tinyNotation.js';
import { voiceLeading } from './music21/voiceLeading.js';
import { vfShow } from './music21/vfShow.js';
import { webmidi } from './music21/webmidi.js';

const music21 = {
    common,
    debug,
    prebase,
    base,

    articulations,
    audioRecording,
    audioSearch,
    beam,
    chord,
    chordTables,    
    clef,
    converter,
    dynamics,
    duration,
    exceptions21,
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
    pitch,
    renderOptions,
    roman,
    scale,
    sites,
    stream,
    tempo,
    tie,
    tinyNotation,
    voiceLeading,
    vfShow,
    webmidi,
};

music21.Music21Object = base.Music21Object;

export default music21;
