/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/bar -- Barline objects
 *
 * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–19, Michael Scott Cuthbert and cuthbertLab
 *
 */
import * as base from './base';
import { Music21Exception } from './exceptions21';

const barTypeList = [
    'regular', 'dotted', 'dashed', 'heavy', 'double', 'final',
    'heavy-light', 'heavy-heavy', 'tick', 'short', 'none',
];
const barTypeDict = {
    'light-light': 'double',
    'light-heavy': 'final',
};

const reverseBarTypeDict = {
    'double': 'light-light',
    'final': 'light-heavy',
};

export class BarException extends Music21Exception {}

function typeToMusicXMLBarStyle(value: string): string {
    if (reverseBarTypeDict[value] !== undefined) {
        return reverseBarTypeDict[value];
    } else {
        return value;
    }
}

function standardizeBarType(value: string='regular'): string {
    value = value.toLowerCase();

    if (barTypeList.includes(value)) {
        return value;
    }
    if (barTypeDict[value] !== undefined) {
        return barTypeDict[value];
    }
    throw new BarException(`cannot process style: ${value}`);
}

export class Barline extends base.Music21Object {
    _type: string;
    location: string;

    static get className() { return 'music21.bar.Barline'; }

    constructor(type='regular', location='right') {
        super();

        this.type = type;
        this.location = location; // left, right, middle, None
    }

    get type(): string {
        return this._type;
    }

    set type(v: string) {
        this._type = standardizeBarType(v);
    }

    musicXMLBarStyle(): string {
        return typeToMusicXMLBarStyle(this.type);
    }
}

export default Barline;
