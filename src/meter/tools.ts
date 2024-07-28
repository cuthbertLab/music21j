/**
 * music21j -- Javascript reimplementation of music21p features.
 * music21/meter/tools -- Tools for working with meters
 *
 * Module based on work done by Cuthbert and Christopher Ariza
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 */
import {LRUCache} from 'lru-cache';
import {lcm} from 'compute-lcm';

import * as common from '../common';
import {MeterException, Music21Exception} from '../exceptions21';
import {decimalToFraction, limit_denominator} from '../common';

export interface MeterTerminalTuple {
    numerator: number;
    denominator: number;
    division: MeterDivision;
}

export enum MeterDivision {
    NONE,
    SLOW,
    FAST
}

export type NumDenom = [number, number];
export type NumDenomTuple = NumDenom[];
export type TupleOrNumber = NumDenom | [number, null];
export type MeterOptions = string[][];


export const validDenominators: readonly number[] = [1, 2, 4, 8, 16, 32, 64, 128];
export const validDenominatorsSet: ReadonlySet<number> = new Set(validDenominators);


const slashToTuple_cache = new LRUCache<string, MeterTerminalTuple>({max: 512});

export function slashToTuple(value: string): Readonly<MeterTerminalTuple> {
    if (slashToTuple_cache.has(value)) {
        return slashToTuple_cache.get(value)!;
    }

    const [numberPart, charPart] = common.getNumFromStr(value, '0123456789/.');
    const valueNumbers = numberPart.trim();

    let division: MeterDivision;
    if (!charPart) {
        division = MeterDivision.NONE;  // speed up most common case
    } else {
        const valueChars = charPart.trim();

        if (valueChars.toLowerCase().includes('slow')) {
            division = MeterDivision.SLOW;
        } else if (valueChars.toLowerCase().includes('fast')) {
            division = MeterDivision.FAST;
        } else {
            division = MeterDivision.NONE;
        }
    }

    const matches = valueNumbers.match(/(\d+)\/(\d+)/);
    if (matches !== null) {
        const n = parseInt(matches[1], 10);
        const d = parseInt(matches[2], 10);
        const result = {numerator: n, denominator: d, division};
        slashToTuple_cache.set(value, result);
        return result;
    }

    throw new MeterException(`slashToTuple() cannot find two-part fraction for ${value}`);
}

const slashCompoundToFraction_cache = new LRUCache<string, NumDenomTuple>({max: 512});

export function slashCompoundToFraction(value: string): Readonly<NumDenomTuple> {
    if (slashCompoundToFraction_cache.has(value)) {
        return slashCompoundToFraction_cache.get(value)!;
    }

    const post: NumDenomTuple = [];
    value = value.trim();
    const valueList = value.split('+');
    for (const part of valueList) {
        try {
            const m = slashToTuple(part);
            post.push([m.numerator, m.denominator]);
        } catch (e) {
            if (e instanceof MeterException) {
                // Handle the exception or continue
            }
        }
    }

    slashCompoundToFraction_cache.set(value, post);
    return post;
}

const slashMixedToFraction_cache = new LRUCache<string, [NumDenomTuple, boolean]>({max: 512});

export function slashMixedToFraction(valueSrc: string): [NumDenomTuple, boolean] {
    if (slashMixedToFraction_cache.has(valueSrc)) {
        return slashMixedToFraction_cache.get(valueSrc);
    }

    const pre: TupleOrNumber[] = [];
    let summedNumerator = false;
    let value = valueSrc.trim().split('+');
    for (const part of value) {
        if (part.includes('/')) {
            try {
                const tup = slashToTuple(part);
                pre.push([tup.numerator, tup.denominator]);
            } catch (e) {
                if (e instanceof MeterException) {
                    throw new MeterException(`Cannot create time signature from "${valueSrc}"`);
                }
            }
        } else {  // just a numerator
            try {
                pre.push([parseInt(part, 10), null]);
                summedNumerator = true;
            } catch (e) {
                throw new Music21Exception(
                    `Cannot parse this file -- this error often comes up if the musicxml pickled file is out of date after a change in musicxml/__init__.py . Clear your temp directory of .p and .p.gz files and try again...; Time Signature: ${valueSrc} `
                );
            }
        }
    }

    const post: NumDenomTuple = [];
    for (let i = 0; i < pre.length; i++) {
        let [intNum, intDenom] = pre[i];
        if (intDenom === null) {
            for (const [_, nextDenom] of pre.slice(i + 1)) {
                if (nextDenom !== null) {
                    intDenom = nextDenom;
                    break;
                }
            }
            if (intDenom === null) {
                throw new MeterException(`cannot match denominator to numerator in: ${valueSrc}`);
            }
        }
        post.push([intNum, intDenom]);
    }

    slashMixedToFraction_cache.set(valueSrc, [post, summedNumerator]);

    return [post, summedNumerator];
}


export function fractionToSlashMixed(fList: NumDenomTuple): readonly Readonly<[string, number]>[] {
    /**
     * TODO add cache when true Tuple type is possible...
     */
    const pre: [number[], number][] = [];
    for (const [n, d] of fList) {
        if (pre.length && pre[pre.length - 1][1] === d) {
            pre[pre.length - 1][0].push(n);
        } else {
            pre.push([[n], d]);
        }
    }

    const post: [string, number][] = [];
    for (const part of pre) {
        const nStrList = part[0].map(x => x.toString());
        const nStr = nStrList.join('+');
        const dInt = part[1];
        post.push([nStr, dInt]);
    }

    return post;
}


export function fractionSum(numDenomTuple: NumDenomTuple): Readonly<NumDenom> {
    /* TODO: add cache */
    const nList: number[] = [];
    const dList: number[] = [];
    const dListUnique: Set<number> = new Set();

    for (const [n, d] of numDenomTuple) {
        nList.push(n);
        dList.push(d);
        dListUnique.add(d);
    }

    if (dListUnique.size === 1) {
        const n = nList.reduce((acc, val) => acc + val, 0);  // sum...
        const d = dList[0];
        return [n, d];
    } else {
        const dRed = Array.from(dListUnique).reduce((a, b) => lcm(a, b));
        let nRed = 0;
        for (let i = 0; i < numDenomTuple.length; i++) {
            const [nSrc, dSrc] = numDenomTuple[i];
            nRed += nSrc * Math.floor(dRed / dSrc);
        }
        return [nRed, dRed];
    }
}

const proportionToFraction_cache = new LRUCache<number, Readonly<NumDenom>>({max: 512});

export function proportionToFraction(value: number): Readonly<NumDenom> {
    if (proportionToFraction_cache.has(value)) {
        return proportionToFraction_cache.get(value);
    }
    const [n1, n2] = decimalToFraction(value);
    const out = limit_denominator(n1, n2, 16);
    proportionToFraction_cache.set(value, out);
    return out;
}

export function divisionOptionsFractionsUpward(n: number, d: number): string[] {
    const opts: string[] = [];
    if (d < validDenominators[validDenominators.length - 1]) {
        let nMod = n * 2;
        let dMod = d * 2;
        while (dMod <= validDenominators[validDenominators.length - 1]) {
            opts.push(`${nMod}/${dMod}`);
            dMod *= 2;
            nMod *= 2;
        }
    }
    return opts;
}

export function divisionOptionsFractionsDownward(n: number, d: number): string[] {
    const opts: string[] = [];
    if (d > validDenominators[0] && n % 2 === 0) {
        let nMod = n / 2;  // guaranteed divisible by 2
        let dMod = Math.floor(d / 2);
        while (dMod >= validDenominators[0]) {
            opts.push(`${nMod}/${dMod}`);
            if (nMod % 2 !== 0) {
                break;
            }
            dMod = Math.floor(dMod / 2);
            nMod = nMod / 2;  // guaranteed divisible by 2
        }
    }
    return opts;
}

export function divisionOptionsAdditiveMultiplesDownward(n: number, d: number): MeterOptions {
    const opts: MeterOptions = [];
    if (d < validDenominators[validDenominators.length - 1] && n === 1) {
        let i = 2;
        let dMod = d * 2;
        while (dMod <= validDenominators[validDenominators.length - 1]) {
            opts.push(Array(i).fill(`${n}/${dMod}`));
            dMod *= 2;
            i *= 2;
        }
    }
    return opts;
}

export function divisionOptionsAdditiveMultiples(n: number, d: number): MeterOptions {
    const opts: MeterOptions = [];
    if (n > 3 && n % 2 === 0) {
        let div = 2;
        let i = div;
        let nMod = Math.floor(n / div);
        while (nMod > 1) {
            const seq = Array(i).fill(`${nMod}/${d}`);
            if (!opts.some(opt => JSON.stringify(opt) === JSON.stringify(seq))) {
                opts.push(seq);
            }
            nMod = Math.floor(nMod / div);
            i *= div;
        }
    }
    return opts;
}

export function divisionOptionsAdditiveMultiplesEvenDivision(n: number, d: number): MeterOptions {
    const opts: MeterOptions = [];
    if (n % 2 === 0 && Math.floor(d / 2) >= 1) {
        let nMod = Math.floor(n / 2);
        let dMod = Math.floor(d / 2);
        while (dMod >= 1 && nMod > 1) {
            opts.push(Array(nMod).fill(`1/${dMod}`));
            if (nMod % 2 !== 0) {
                break;
            }
            dMod = Math.floor(dMod / 2);
            nMod = Math.floor(nMod / 2);
        }
    }
    return opts;
}

export function divisionOptionsAdditiveMultiplesUpward(n: number, d: number): MeterOptions {
    const opts: MeterOptions = [];
    if (n > 1 && d >= 1) {
        let dCurrent = d;
        let nCount = n;
        const nCountLimit = n > 16 ? n : 16;
        while (dCurrent <= validDenominators[validDenominators.length - 1] && nCount <= nCountLimit) {
            opts.push(Array(nCount).fill(`1/${dCurrent}`));
            dCurrent *= 2;
            nCount *= 2;
        }
    }
    return opts;
}


const divisionOptionsAlgo_cache = new LRUCache<string, MeterOptions>({max: 512});

export function divisionOptionsAlgo(n: number, d: number): MeterOptions {
    const key = JSON.stringify([n, d]);  // oh, for lack of tuples...
    if (divisionOptionsAlgo_cache.has(key)) {
        return divisionOptionsAlgo_cache.get(key);
    }
    const opts = []

    // Compound meters 6, 9, 12, 15, 18
    // 9/4, 9/2, 6/2 are all considered compound without d>4
    if (n % 3 === 0 && n > 3) {
        const seq = [];
        for (let j = 0; j < Math.floor(n / 3); j++) {
            seq.push(`3/${d}`);
        }
        opts.push(seq);
    } else if (n === 5) {
        // odd meters with common groupings
        opts.push([`2/${d}`, `3/${d}`]);
        opts.push([`3/${d}`, `2/${d}`]);
    } else if (n === 7) {
        opts.push([`2/${d}`, `2/${d}`, `3/${d}`]);
        opts.push([`3/${d}`, `2/${d}`, `2/${d}`]);
        opts.push([`2/${d}`, `3/${d}`, `2/${d}`]);
    } else if (n === 10) {
        opts.push([`2/${d}`, `2/${d}`, `3/${d}`, `3/${d}`])
    }
    opts.push(...divisionOptionsAdditiveMultiplesUpward(n, d));
    opts.push(...divisionOptionsAdditiveMultiplesEvenDivision(n, d));
    opts.push([`${n}/${d}`]);
    opts.push(...divisionOptionsAdditiveMultiples(n, d));
    for (const o of divisionOptionsFractionsDownward(n, d)) {
        opts.push([o]);  // wrap in list
    }
    for (const o of divisionOptionsFractionsUpward(n, d)) {
        opts.push([o]);  // wrap in list
    }
    const seen = new Set<string>();
    const out = [];
    for (const g of opts) {
        if (!g.length) {
            continue;
        }
        const key = JSON.stringify(g);
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        out.push(g);
    }
    return out;
}

export function divisionOptionsPreset(n: number, d: number): MeterOptions {
    if (n !== 5) {
        return [];
    }
    return [
        [`2/${d}`, `2/${d}`, `1/${d}`],
        [`1/${d}`, `2/${d}`, `2/${d}`],
    ]
}
