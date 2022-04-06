import * as QUnit from 'qunit';

import articulations from './moduleTests/articulations';
import base from './moduleTests/base';
import beam from './moduleTests/beam';
import chord from './moduleTests/chord';
import clef from './moduleTests/clef';
import common from './moduleTests/common';
import duration from './moduleTests/duration';
import dynamics from './moduleTests/dynamics';
import editorial from './moduleTests/editorial';
import figuredBass from './moduleTests/figuredBass';
import interval from './moduleTests/interval';
import iterator from './moduleTests/stream/iterator';
import key from './moduleTests/key';
import meter from './moduleTests/meter';
import note from './moduleTests/note';
import pitch from './moduleTests/pitch';
import prebase from './moduleTests/prebase';
import roman from './moduleTests/roman';
import scale from './moduleTests/scale';
import sites from './moduleTests/sites';
import stream from './moduleTests/stream';
import tempo from './moduleTests/tempo';
import tie from './moduleTests/tie';
import vfShow from './moduleTests/vfShow';
import voiceLeading from './moduleTests/voiceLeading';

import * as music21 from '../src/main';

const allTests = {
    articulations,
    base,
    beam,
    chord,
    clef,
    common,
    duration,
    dynamics,
    editorial,
    figuredBass,
    interval,
    iterator,
    key,
    meter,
    note,
    pitch,
    prebase,
    roman,
    scale,
    sites,
    stream,
    tempo,
    tie,
    vfShow,
    voiceLeading,
};
if (typeof window !== 'undefined') {
    (window as any).allTests = allTests;
    (window as any).music21 = music21;
    (window as any).QUnit = QUnit;
}
// noinspection JSUnusedGlobalSymbols
export default allTests;
