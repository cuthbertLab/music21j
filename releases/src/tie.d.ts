/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/tie -- ties!
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 */
import * as prebase from './prebase';
/**
 * Tie class. Found in music21.note.GeneralNote `.tie`.
 *
 * Does not support advanced music21p values `.to` and `.from`
 *
 * @param {string} type - 'start', 'stop', 'continue', or 'let-ring'
 * @property {string} type - the tie type
 * @property {string} style - only supports 'normal' for now.
 * @property {string|undefined} placement - undefined = unknown or above/below.
 * (NB currently does nothing)
 */
export declare class Tie extends prebase.ProtoM21Object {
    static get className(): string;
    protected _type: string;
    style: string;
    placement: string;
    constructor(type?: string);
    stringInfo(): string;
    get type(): string;
    set type(newType: string);
}
//# sourceMappingURL=tie.d.ts.map