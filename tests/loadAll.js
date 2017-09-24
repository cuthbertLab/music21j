import articulations from './moduleTests/articulations';
import beam from './moduleTests/beam';
import chord from './moduleTests/chord';
import clef from './moduleTests/clef';
import common from './moduleTests/common';
import duration from './moduleTests/duration';
import dynamics from './moduleTests/dynamics';
import interval from './moduleTests/interval';
import key from './moduleTests/key';
import note from './moduleTests/note';
import pitch from './moduleTests/pitch';
import roman from './moduleTests/roman';
import scale from './moduleTests/scale';
import stream from './moduleTests/stream';
import tie from './moduleTests/tie';
import voiceLeading from './moduleTests/voiceLeading';

const allTests = {
    articulations,
    beam,
    chord,
    clef,
    common,
    duration,
    dynamics,
    interval,
    key,
    note,
    pitch,
    roman,
    scale,
    stream,
    tie,
    voiceLeading,
};
if (typeof window !== undefined) {
    window.allTests = allTests;
}
export default allTests;
