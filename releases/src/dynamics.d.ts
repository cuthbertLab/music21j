/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/dynamics -- Dynamics
 *
 * note that Vex.Flow does not support Dynamics yet and we do not support MIDI dynamics,
 *  so currently of limited value...
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 * Dynamics related objects.
 *
 * Currently do not export to Vexflow.  :-(
 */
import * as base from './base';
export declare const shortNames: string[];
export declare const longNames: {
    ppp: string[];
    pp: string[];
    p: string[];
    mp: string[];
    mf: string[];
    f: string[];
    fp: string[];
    sf: string[];
    ff: string[];
    fff: string[];
};
export declare const englishNames: {
    ppp: string[];
    pp: string[];
    p: string[];
    mp: string[];
    mf: string[];
    f: string[];
    ff: string[];
    fff: string[];
};
export declare const dynamicStrToScalar: {
    None: number[];
    n: number[];
    pppp: number[];
    ppp: number[];
    pp: number[];
    p: number[];
    mp: number[];
    mf: number[];
    f: number[];
    fp: number[];
    sf: number[];
    ff: number[];
    fff: number[];
    ffff: number[];
};
/**
 * A representation of a dynamic.
 *
 * @param {number|string} value - either a number between 0 and 1 or a dynamic mark such as "ff" or "mp"
 * @property {string|undefined} value - a name such as "pp" etc.
 * @property {string|undefined} longName - a longer name such as "pianissimo"
 * @property {string|undefined} englishName - a name such as "very soft"
 * @property {number} volumeScalar - a number between 0 and 1.
 */
export declare class Dynamic extends base.Music21Object {
    static get className(): string;
    protected _value: string;
    protected _volumeScalar: number;
    longName: string;
    englishName: string;
    constructor(value: string | number);
    get value(): string;
    set value(value: string | number);
    get volumeScalar(): number;
    set volumeScalar(value: number);
}
//# sourceMappingURL=dynamics.d.ts.map