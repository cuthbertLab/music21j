import articulations from './moduleTests/articulations';
import beam from './moduleTests/beam';
import chord from './moduleTests/chord';
import clef from './moduleTests/clef';
import duration from './moduleTests/duration';
import dynamics from './moduleTests/dynamics';
import key from './moduleTests/key';
import note from './moduleTests/note';
import pitch from './moduleTests/pitch';
import roman from './moduleTests/roman';
import stream from './moduleTests/stream';

const allTests = {
        articulations: articulations,
        beam: beam,
        chord: chord,
        clef: clef,
        duration: duration,
        dynamics: dynamics,
        key: key,
        note: note,
        pitch: pitch,
        roman: roman,
        stream: stream,
};
if (typeof window !== undefined) {
    window.allTests = allTests;
}
export default allTests;
