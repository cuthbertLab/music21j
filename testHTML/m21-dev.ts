/**
 * m21-dev.ts -- a way of loading music21 for Hot Module Reloading (HMR) in
 *               testHTML files.
 */
import * as music21 from '../src/main';

declare global {
    interface Window {
        music21: typeof music21;
        MIDI: typeof music21.MIDI;
    }
}

window.music21 = music21;
window.MIDI = music21.MIDI;
