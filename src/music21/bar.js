/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/bar -- Barline objects
 *
 * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–19, Michael Scott Cuthbert and cuthbertLab
 *
 */
import { base } from './base.js';
import { Music21Exception } from './exceptions21.js';

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

function typeToMusicXMLBarStyle(value) {
    if (reverseBarTypeDict[value] !== undefined) {
        return reverseBarTypeDict[value];
    } else {
        return value;
    }
}

function standardizeBarType(value) {
    if (value === undefined) {
        return 'regular';
    }
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
    constructor(type, location) {
        super();
        this._type = undefined;
        
        this.type = type;
        this.location = location; // left, right, middle, None
    }
    
    get type() {
        return this._type;
    }
    
    set type(v) {
        this._type = standardizeBarType(v);
    }
    
    musicXMLBarStyle() {
        return typeToMusicXMLBarStyle(this.type);
    }
}

export default Barline;
