import { prebase } from './prebase';
import { Music21Exception } from './exceptions21';

/**
 * Simple tie module {@link music21.tie} namespace
 *
 * @exports music21/tie
 */

/**
 * Tie namespace, just has the {@link music21.tie.Tie} object
 *
 * @namespace music21.tie
 * @memberof music21
 * @requires music21/prebase
 */
export const tie = {};
const VALID_TIE_TYPES = ['start', 'stop', 'continue', 'let-ring', undefined];

/**
 * Tie class. Found in {@link music21.note.GeneralNote} `.tie`.
 *
 * Does not support advanced music21p values `.to` and `.from`
 *
 * @class Tie
 * @memberof music21.tie
 * @extends music21.prebase.ProtoM21Object
 * @param {string} type - 'start', 'stop', 'continue', or 'let-ring'
 * @property {string} type - the tie type
 * @property {string} style - only supports 'normal' for now.
 * @property {string|undefined} placement - undefined = unknown or above/below. (NB curently does nothing)
 */
export class Tie extends prebase.ProtoM21Object {
    constructor(type) {
        super();
        this._type = undefined;
        this.style = 'normal';
        this.type = type;
        this.placement = undefined;
    }
    get type() {
        return this._type;
    }
    set type(newType) {
        if (!(VALID_TIE_TYPES.includes(newType))) {
            throw new Music21Exception('Tie type must be one of "start", "stop", "continue", "let-ring"');
        }
        this._type = newType;
    }
}
tie.Tie = Tie;
