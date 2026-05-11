import * as music21 from './main';

declare global {
    interface Window {
        music21: typeof music21;
    }
}
