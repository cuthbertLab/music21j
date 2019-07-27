/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/tie -- ties!
 *
 * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
 *
 */

import { prebase } from './prebase.js';
import { Music21Exception } from './exceptions21.js';

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

const VALID_TIE_TYPES = ['start', 'stop', 'continue', 'let-ring', 'continue-let-ring'];

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
 * @property {string|undefined} placement - undefined = unknown or above/below.
 * (NB currently does nothing)
 */
export class Tie extends prebase.ProtoM21Object {
    constructor(type='start') {
        super();
        this._type = undefined;
        this.style = 'normal';
        this.type = type;
        this.placement = undefined;
    }
    
    stringInfo() {
        return this.type;
    }
    
    get type() {
        return this._type;
    }

    set type(newType) {
        if (!VALID_TIE_TYPES.includes(newType)) {
            throw new Music21Exception(
                `Type must be one of ${VALID_TIE_TYPES}, not ${newType}`
            );
        }
        this._type = newType;
    }
}

