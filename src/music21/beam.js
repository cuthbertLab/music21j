/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/beam -- Beams and Beam class
 *
 * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
 *
 */
import { Music21Exception } from './exceptions21.js';

import { prebase } from './prebase.js';
import { duration } from './duration.js';

/**
 * Module holding beam materials. See {@link music21.beam} namespace.
 *
 * @exports music21/beam
 */
/**
 * {@link music21.beam.Beam} and {music21.beam.Beams} objects
 *
 * @namespace music21.beam
 * @memberof music21
 * @requires music21/prebase
 * @requires music21/duration
 */
export const beam = {};

beam.validBeamTypes = {
    start: true,
    stop: true,
    continue: true,
    partial: true,
};

beam.beamableDurationTypes = [
    duration.typeFromNumDict[8],
    duration.typeFromNumDict[16], duration.typeFromNumDict[32],
    duration.typeFromNumDict[64], duration.typeFromNumDict[128],
    duration.typeFromNumDict[256],    
];


/**
 * Object representing a single beam (e.g., a 16th note that is beamed needs two)
 *
 * @class Beam
 * @memberof music21.beam
 * @extends music21.prebase.ProtoM21Object
 * @param {string} type - "start", "stop", "continue", "partial"
 * @param {string} direction - only needed for partial beams: "left" or "right"
 * @property {Int|undefined} number - which beam line does this refer to; 8th = 1, 16th = 2, etc.
 * @property {number|undefined} independentAngle - the angle of this beam if it is different than others (feathered beams)
 */
export class Beam extends prebase.ProtoM21Object {
    constructor(type, direction) {
        super();
        this.type = type;
        this.direction = direction;
        this.independentAngle = undefined;
        this.number = undefined;
    }
}
beam.Beam = Beam;
/**
 * Object representing a collection of Beams
 *
 * @class Beams
 * @memberof music21.beam
 * @extends music21.prebase.ProtoM21Object
 * @property {Array<music21.beam.Beam>} beamsList - a list of Beam objects
 * @property {Boolean} [feathered=false] - is this a feathered beam.
 * @property {Int} length - length of beamsList
 */
export class Beams extends prebase.ProtoM21Object {
    static naiveBeams(srcList) {
        const beamsList = [];
        for (const el of srcList) {
            if (!beam.beamableDurationTypes.includes(el.duration.type)) {
                beamsList.push(undefined);
            } else if (el.isRest) {
                beamsList.push(undefined);
            } else {
                const b = new beam.Beams();
                b.fill(el.duration.type);
                beamsList.push(b);
            }
        }
        return beamsList;
    }
    
    static removeSandwichedUnbeamables(beamsList) {
        let beamLast;
        let beamNext;
        for (let i = 0; i < beamsList.length; i++) {
            if (i !== beamsList.length - 1) {
                beamNext = beamsList[i + 1];
            } else {
                beamNext = undefined;
            }
            if (beamLast === undefined && beamNext === undefined) {
                beamsList[i] = undefined;
            }
            beamLast = beamsList[i];
        }
        return beamsList;
    }
    
    static sanitizePartialBeams(beamsList) {
        for (let i = 0; i < beamsList.length; i++) {
            if (beamsList[i] === undefined) {
                continue;
            }
            const allTypes = beamsList[i].getTypes();
            if (!allTypes.includes('start') 
                    && !allTypes.includes('stop')
                    && !allTypes.includes('continue')) {
                // nothing but partials;
                beamsList[i] = undefined;
                continue;
            }
            let hasStart = false;
            let hasStop = false;
            for (const b of beamsList[i].beamsList) {
                if (b.type === 'start') {
                    hasStart = true;
                    continue;
                }
                if (b.type === 'stop') {
                    hasStop = true;
                    continue;
                }
                if (hasStart && b.type === 'partial' && b.direction === 'left') {
                    b.direction = 'right';
                } else if (hasStop && b.type === 'partial' && b.direction === 'right') {
                    b.direction = 'left';
                }
            }
        }
        return beamsList;
    }
    
    static mergeConnectingPartialBeams(beamsList) {
        for (let i = 0; i < beamsList.length - 1; i++) {
            const bThis = beamsList[i];
            const bNext = beamsList[i + 1];
            if (!bThis || !bNext) {
                continue;
            }
            const bThisNum = bThis.getNumbers();
            if (!bThisNum || bThisNum.length === 0) {
                continue;
            }
            for (const thisNum of bThisNum) {
                const thisBeam = bThis.getByNumber(thisNum);
                if (thisBeam.type !== 'partial' || thisBeam.direction !== 'right') {
                    continue;
                }
                if (!(bNext.getNumbers().includes(thisNum))) {
                    continue;
                }
                const nextBeam = bNext.getByNumber(thisNum);
                if (nextBeam.type === 'partial' || nextBeam.direction === 'right') {
                    continue;
                }
                if (nextBeam.type === 'continue' || nextBeam.type === 'stop') {
                    // should not happen.
                    continue;
                }
                thisBeam.type = 'start';
                thisBeam.direction = undefined;
                if (nextBeam.type === 'partial') {
                    nextBeam.type = 'stop';
                } else if (nextBeam.type === 'start') {
                    nextBeam.type = 'continue';
                }
                nextBeam.direction = undefined;
            }
        }
        // now fix partial-lefts that follow stops:
        for (let i = 1; i < beamsList.length; i++) {
            const bThis = beamsList[i];
            const bPrev = beamsList[i - 1];
            if (!bThis || !bPrev) {
                continue;
            }
            const bThisNum = bThis.getNumbers();
            if (!bThisNum || bThisNum.length === 0) {
                continue;
            }
            for (const thisNum of bThisNum) {
                const thisBeam = bThis.getByNumber(thisNum);
                if (thisBeam.type !== 'partial' || thisBeam.direction !== 'left') {
                    continue;
                }
                if (!(bPrev.getNumbers().includes(thisNum))) {
                    continue;
                }
                const prevBeam = bPrev.getByNumber(thisNum);
                if (prevBeam.type !== 'stop') {
                    continue;
                }
                thisBeam.type = 'stop';
                thisBeam.direction = undefined;
                prevBeam.type = 'continue';
            }
        }
        return beamsList;
    }
    

    constructor() {
        super();
        this.beamsList = [];
        this.feathered = false;
    }
    get length() {
        return this.beamsList.length;
    }
    /**
     * Append a new {@link music21.beam.Beam} object to this Beams, automatically creating the Beam
     *   object and incrementing the number count.
     *
     * @memberof music21.beam.Beams
     * @param {string} type - the type (passed to {@link music21.beam.Beam})
     * @param {string} [direction=undefined] - the direction if type is "partial"
     * @returns {music21.beam.Beam} newly appended object
     */
    append(type, direction) {
        const obj = new beam.Beam(type, direction);
        obj.number = this.beamsList.length + 1;
        this.beamsList.push(obj);
        return obj;
    }
    /**
     * A quick way of setting the beams list for a particular duration, for
            instance, fill("16th") will clear the current list of beams in the
            Beams object and add two beams.  fill(2) will do the same (though note
            that that is an int, not a string).

     * It does not do anything to the direction that the beams are going in,
            or by default.  Either set type here or call setAll() on the Beams
            object afterwards.

     * Both "eighth" and "8th" work.  Adding more than six beams (i.e. things
            like 512th notes) raises an error.

     * @memberof music21.beam.Beams
     * @param {string|Int} level - either a string like "eighth" or a number like 1 (="eighth")
     * @param {string} type - type to fill all beams to.
     * @returns {this}
     */
    fill(level, type) {
        this.beamsList = [];
        let count = 1;
        if (
            level === 1
            || level === '8th'
            || level === duration.typeFromNumDict[8]
        ) {
            count = 1;
        } else if (level === 2 || level === duration.typeFromNumDict[16]) {
            count = 2;
        } else if (level === 3 || level === duration.typeFromNumDict[32]) {
            count = 3;
        } else if (level === 4 || level === duration.typeFromNumDict[64]) {
            count = 4;
        } else if (level === 5 || level === duration.typeFromNumDict[128]) {
            count = 5;
        } else if (level === 6 || level === duration.typeFromNumDict[256]) {
            count = 6;
        } else {
            throw new Music21Exception('cannot fill beams for level ' + level);
        }
        for (let i = 1; i <= count; i++) {
            const obj = new beam.Beam();
            obj.number = i;
            this.beamsList.push(obj);
        }
        if (type !== undefined) {
            this.setAll(type);
        }
        return this;
    }
    /**
     * Get the beam with the given number or throw an exception.
     *
     * @memberof music21.beam.Beams
     * @param {Int} number - the beam number to retrieve (usually one less than the position in `.beamsList`)
     * @returns {music21.beam.Beam|undefined}
     */
    getByNumber(number) {
        if (!this.getNumbers().includes(number)) {
            throw new Music21Exception('beam number error: ' + number);
        }
        for (const thisBeam of this.beamsList) {
            if (thisBeam.number === number) {
                return thisBeam;
            }
        }
        return undefined;
    }
    /**
     * Get an Array of all the numbers for the beams
     *
     * @memberof music21.beam.Beams
     * @returns {Array<Int>} all the numbers
     */
    getNumbers() {
        const numbers = [];
        for (const thisBeam of this.beamsList) {
            numbers.push(thisBeam.number);
        }
        return numbers;
    }
    /**
     * Returns the type + "-" + direction (if direction is defined)
     * for the beam with the given number.
     *
     * @param {Int} number
     * @returns {music21.beam.Beam|undefined}
     */
    getTypeByNumber(number) {
        const beamObj = this.getByNumber(number);
        if (beamObj.direction === undefined) {
            return beamObj.type;
        } else {
            const x = beamObj.type + '-' + beamObj.direction;
            return x;
        }
    }
    /**
     * Get an Array of all the types for the beams
     *
     * @memberof music21.beam.Beams
     * @returns {Array<string>} all the types
     */
    getTypes() {
        const types = [];
        for (let i = 0; i < this.length; i++) {
            types.push(this.beamsList[i].type);
        }
        return types;
    }
    /**
     * Set all the {@link music21.beam.Beam} objects to a given type/direction
     *
     * @memberof music21.beam.Beams
     * @param {string} type - beam type
     * @param {string} [direction] - beam direction
     * @returns {this}
     */
    setAll(type, direction) {
        if (beam.validBeamTypes[type] === undefined) {
            throw new Music21Exception('invalid beam type: ' + type);
        }
        for (let i = 0; i < this.length; i++) {
            const b = this.beamsList[i];
            b.type = type;
            b.direction = direction;
        }
        return this;
    }
    /**
     * Set the {@link music21.beam.Beam} object specified by `number` to a given type/direction
     *
     * @memberof music21.beam.Beams
     * @param {Int} number
     * @param {string} type
     * @param {string} [direction]
     * @returns {this}
     */
    setByNumber(number, type, direction) {
        if (direction === undefined) {
            const splitit = type.split('-');
            type = splitit[0];
            direction = splitit[1]; // can be undefined...
        }
        if (beam.validBeamTypes[type] === undefined) {
            throw new Music21Exception('invalid beam type: ' + type);
        }
        for (let i = 0; i < this.length; i++) {
            if (this.beamsList[i].number === number) {
                this.beamsList[i].type = type;
                this.beamsList[i].direction = direction;
            }
        }
        return this;
    }
}
beam.Beams = Beams;
