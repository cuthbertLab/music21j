import articulations from './moduleTests/articulations.js';
import base from './moduleTests/base.js';
import beam from './moduleTests/beam.js';
import chord from './moduleTests/chord.js';
import clef from './moduleTests/clef.js';
import common from './moduleTests/common.js';
import duration from './moduleTests/duration.js';
import dynamics from './moduleTests/dynamics.js';
import figuredBass from './moduleTests/figuredBass.js';
import interval from './moduleTests/interval.js';
import key from './moduleTests/key.js';
import meter from './moduleTests/meter.js';
import note from './moduleTests/note.js';
import pitch from './moduleTests/pitch.js';
import prebase from './moduleTests/prebase.js';
import roman from './moduleTests/roman.js';
import scale from './moduleTests/scale.js';
import sites from './moduleTests/sites.js';
import stream from './moduleTests/stream.js';
import tie from './moduleTests/tie.js';
import voiceLeading from './moduleTests/voiceLeading.js';

const allTests = {
    articulations,
    base,
    beam,
    chord,
    clef,
    common,
    duration,
    dynamics,
    figuredBass,
    interval,
    key,
    meter,
    note,
    pitch,
    prebase,
    roman,
    scale,
    sites,
    stream,
    tie,
    voiceLeading,
};
if (typeof window !== undefined) {
    window.allTests = allTests;
}
export default allTests;
