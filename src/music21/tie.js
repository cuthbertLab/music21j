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

/**
 * Tie class. Found in {@link music21.note.GeneralNote} `.tie`.
 *
 * Does not support advanced music21p values `.to` and `.from`
 *
 * @class Tie
 * @memberof music21.tie
 * @extends music21.prebase.ProtoM21Object
 * @param {string} type - 'start', 'stop', or 'continue'
 * @property {string} type - the tie type
 * @property {string} style - only supports 'normal' for now.
 */
export class Tie extends prebase.ProtoM21Object {
    constructor(type) {
        super();
        this._type = undefined;
        this.style = 'normal';
        this.type = type;
    }
    get type() {
        return this._type;
    }
    set type(t) {
        if (!(['start', 'stop', 'continue', undefined].includes(t))) {
            throw new Music21Exception('Tie type must be one of "start", "stop", "continue"');
        }
        self._type = t;
    }
}
tie.Tie = Tie;
