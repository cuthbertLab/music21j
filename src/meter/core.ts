/**
 * music21j -- Javascript reimplementation of music21p features.
 * music21/meter/core -- Component objects for meters
 *
 * Module based on work done by Cuthbert and Christopher Ariza
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 */
import {
    divisionOptionsAlgo,
    divisionOptionsPreset,
    MeterOptions,
    slashToTuple,
    validDenominatorsSet
} from './tools';
import type {MeterTerminalTuple} from './tools';
import {Duration} from '../duration';
import {MeterException} from '../exceptions21';
import {ProtoM21Object} from '../prebase';
import {arrayEquals} from '../common';

class MeterTerminal extends ProtoM21Object {
    protected _denominator: number;
    protected _duration: Duration | null;
    protected _numerator: number;
    protected _overriddenDuration: Duration | null;
    protected _weight: number | null;

    constructor(slashNotation: string | null = null, weight: number = 1) {
        super();
        this._duration = null;
        this._numerator = 0;
        this._denominator = 1;
        this._weight = null;
        this._overriddenDuration = null;

        if (slashNotation !== null) {
            const values: MeterTerminalTuple = slashToTuple(slashNotation);
            this._numerator = values.numerator;
            this._denominator = values.denominator;
        }

        this._ratioChanged();
        this._weight = weight;
    }

    protected _ratioChanged(): void {
        if (this._numerator === null || this._denominator === null) {
            this._duration = null;
        } else {
            this._duration = new Duration((4.0 * this._numerator) / this._denominator);
        }
    }

    get weight(): number | null {
        return this._weight;
    }

    set weight(value: number | null) {
        this._weight = value;
    }

    get numerator(): number {
        return this._numerator;
    }

    set numerator(value: number) {
        this._numerator = value;
        this._ratioChanged();
    }

    get denominator(): number {
        return this._denominator;
    }

    set denominator(value: number) {
        if (!validDenominatorsSet.has(value)) {
            throw new MeterException(`bad denominator value: ${value}`);
        }
        this._denominator = value;
        this._ratioChanged();
    }

    get duration(): Duration | null {
        if (this._overriddenDuration) {
            return this._overriddenDuration;
        } else {
            return this._duration;
        }
    }

    set duration(value: Duration | null) {
        this._overriddenDuration = value;
    }

    get depth(): number {
        return 1;
    }

    toString(): string {
        return `${this._numerator}/${this._denominator}`;
    }

    ratioEqual(other: MeterTerminal | null): boolean {
        if (other === null) {
            return false;
        }
        return other.numerator === this._numerator && other.denominator === this._denominator;
    }

    subdivideByCount(countRequest: number | null = null): MeterSequence {
        const ms = new MeterSequence();
        ms.load(this, countRequest, true, this._weight);
        return ms;
    }

    subdivideByList(numeratorList: (number | string)[]): MeterSequence {
        const ms = new MeterSequence();
        ms.load(this);
        ms.partitionByList(numeratorList);
        return ms;
    }

    subdivideByOther(other: MeterSequence): MeterSequence {
        const ms = new MeterSequence();
        if (other.duration.quarterLength !== this.duration?.quarterLength) {
            throw new MeterException(`cannot subdivide by other: ${other}`);
        }
        ms.load(other);
        return ms;
    }

    subdivide(value: any): MeterSequence {
        if (Array.isArray(value)) {
            return this.subdivideByList(value);
        } else if (value instanceof MeterSequence) {
            return this.subdivideByOther(value);
        } else if (typeof value === "number") {
            return this.subdivideByCount(value);
        } else {
            throw new MeterException(`cannot process partition argument ${value}`);
        }
    }
}

export class MeterSequence extends MeterTerminal {
    protected _partition: MeterTerminal[] = [];
    protected _levelListCache = new Map();
    summedNumerator: boolean = false;
    parentheses: boolean = false;

    constructor(value: string|null = null, partitionRequest=null) {
        super();
        this._numerator = null;
        this._denominator = null;
        this._overriddenDuration = null;
        if (value) {
            this.load(value, partitionRequest);
        }
    }

    get(key: number): MeterTerminal {
        return this._partition[key];
    }

     * [Symbol.iterator](): Generator<MeterTerminal, void, void> {
        for (let i = 0; i < this._partition.length; i++) {
            yield this.get(i);
        }
    }

    get length(): number {
        return this._partition.length;
    }

    set(key: number, value: MeterTerminal): void {
        if (value.ratioEqual(this.get(key))) {
            this._partition[key] = value;
        } else {
            throw new MeterException(`Cannot insert ${value} into space of ${this.get(key)}`);
        }
        this._levelListCache.clear();
    }

    toString(): string {
        return '{' + this.partitionDisplay + '}';
    }

    get partitionDisplay(): string {
        const msg = [];
        for (const mt of this._partition) {
            msg.push(mt.toString());
        }
        return msg.join('+');
    }

    protected _clearPartition(): void {
        this._partition = [];
        this._levelListCache.clear();
    }

    protected _addTerminal(value: MeterTerminal|string): void {
        if (!(value instanceof MeterTerminal)) {
            value = new MeterTerminal(value);
        }
        this._partition.push(value);
        this._levelListCache.clear();
    }

    getPartitionOptions(): MeterOptions {
        const n = Math.floor(this.numerator);
        const d = Math.floor(this.denominator);
        return [...divisionOptionsAlgo(n, d), ...divisionOptionsPreset(n, d)];
    }

    partitionByCount(countRequest: number, loadDefault: boolean = true): void {
        const opts = this.getPartitionOptions();
        let optMatch: string[]|null = null;
        for (const opt of opts) {
            if (opt.length === countRequest) {
                optMatch = opt;
                break;
            }
        }

        if (!optMatch) {
            if (loadDefault && opts.length) {
                optMatch = opts[0];
            } else {
                throw new MeterException(
                    `Cannot set partition by ${countRequest} `
                    + `(${this.numerator}/${this.denominator})`
                )
            }
        }

        const targetWeight = this.weight;
        this._clearPartition();  // weight will now be zero
        for (const mStr of optMatch) {
            this._addTerminal(mStr);
        }
        this.weight = targetWeight;
        this._levelListCache.clear();
    }

    partitionByList(numeratorList: (string|number)[]): void {
        let optMatch: MeterSequence|string[] = [];

        if (typeof(numeratorList[0]) === 'string') {
            const test = new MeterSequence();
            for (const mtStr of <string[]> numeratorList) {
                (test as any)._addTerminal(mtStr);
            }
            (test as any as { _updateRatio: () => {} })._updateRatio();
            if (this.duration.quarterLength === test.duration.quarterLength) {
                optMatch = test;
            } else {
                throw new MeterException(
                    `Cannot set partition by ${numeratorList}`
                );
            }
        } else {
            const sum = (numeratorList as number[]).reduce((acc, val) => acc + val, 0);
            const multiples = Array.from({ length: 8 }, (_, i) => this.numerator * (i + 1));
            if (multiples.includes(sum)) {
                for (let i = 1; i <= 8; i++) {
                    if (sum === this.numerator * i) {
                        optMatch = numeratorList.map(n => `${n}/${this.denominator * i}`);
                        break
                    }
                }
            } else {
                const opts = this.getPartitionOptions();
                for (const opt of opts) {
                    const numerators = opt.map(x => parseInt(x.split('/')[0]));
                    if (arrayEquals(numerators, numeratorList)) {
                        optMatch = opt;
                        break;
                    }
                }
            }

            if (!optMatch) {
                throw new MeterException(
                    `Cannot set partition by ${numeratorList} `
                    + `(${this.numerator}/${this.denominator})`
                );
            }

            const targetWeight = this.weight;
            this._clearPartition();  // weight will now be zero
            for (const mStr of optMatch) {
                this._addTerminal(mStr);
            }
            this.weight = targetWeight;
            this._levelListCache.clear();
        }
    }

    partitionByOtherMeterSequence(other: MeterSequence): void {

    }


    load(meterTerminal: MeterTerminal, countRequest?: number, autoWeight?: boolean, targetWeight?: number): void {
        // Implementation needed
    }
}
