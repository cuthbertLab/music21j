/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/tie -- ties!
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 */

import * as prebase from './prebase';
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
    static get className() { return 'music21.tie.Tie'; }

    protected _type: string;
    style: string = 'normal';
    placement: string;

    constructor(type='start') {
        super();
        this.type = type;
    }

    stringInfo(): string {
        return this.type;
    }

    get type(): string {
        return this._type;
    }

    set type(newType: string) {
        if (!VALID_TIE_TYPES.includes(newType)) {
            throw new Music21Exception(
                `Type must be one of ${VALID_TIE_TYPES}, not ${newType}`
            );
        }
        this._type = newType;
    }
}

