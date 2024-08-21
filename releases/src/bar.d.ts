/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/bar -- Barline objects
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 */
import * as base from './base';
import { Music21Exception } from './exceptions21';
export declare class BarException extends Music21Exception {
}
export declare class Barline extends base.Music21Object {
    _type: string;
    location: string;
    static get className(): string;
    constructor(type?: string, location?: string);
    get type(): string;
    set type(v: string);
    musicXMLBarStyle(): string;
}
export default Barline;
//# sourceMappingURL=bar.d.ts.map