/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/beam -- Beams and Beam class
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 * Module holding beam materials.
 *
 */
import { Music21Exception } from './exceptions21';

import * as prebase from './prebase';
import * as duration from './duration';
import type * as base from './base';
import type * as note from './note';

export const validBeamTypes = {
    start: true,
    stop: true,
    continue: true,
    partial: true,
};

export const beamableDurationTypes = [
    duration.typeFromNumDict[8],
    duration.typeFromNumDict[16], duration.typeFromNumDict[32],
    duration.typeFromNumDict[64], duration.typeFromNumDict[128],
    duration.typeFromNumDict[256], duration.typeFromNumDict[512],
    duration.typeFromNumDict[1024], duration.typeFromNumDict[2048],
];


/**
 * Object representing a single beam (e.g., a 16th note that is beamed needs two)
 *
 * @param {string} type - "start", "stop", "continue", "partial"
 * @param {string} direction - only needed for partial beams: "left" or "right"
 * @property {number|undefined} number - which beam line does this refer to;
 *     8th = 1, 16th = 2, etc.
 * @property {number|undefined} independentAngle - the angle of this beam
 *     if it is different than others (feathered beams)
 */
export class Beam extends prebase.ProtoM21Object {
    static get className() { return 'music21.beam.Beam'; }
    type: string;
    direction: string|undefined;
    number: number;
    independentAngle: number;

    constructor(type: string, direction=undefined) {
        super();
        this.type = type;
        this.direction = direction;
    }
}

/**
 * Object representing a collection of Beams
 *
 * @property {Beam[]} beamsList - a list of Beam objects
 * @property {boolean} [feathered=false] - is this a feathered beam.
 * @property {number} length - length of beamsList
 */
export class Beams extends prebase.ProtoM21Object {
    static get className() { return 'music21.beam.Beams'; }

    static naiveBeams(srcList: Iterable<base.Music21Object>): Beams[] {
        const beamsList = [];
        for (const el of srcList) {
            if (!beamableDurationTypes.includes(el.duration.type)) {
                beamsList.push(undefined);
            } else if ((<note.GeneralNote><any> el).isRest) {
                beamsList.push(undefined);
            } else {
                const b = new Beams();
                b.fill(el.duration.type);
                beamsList.push(b);
            }
        }
        return beamsList;
    }

    static removeSandwichedUnbeamables(beamsList: Beams[]): Beams[] {
        let beamLast: Beams;
        let beamNext: Beams;
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

    static sanitizePartialBeams(beamsList: Beams[]): Beams[] {
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

    static mergeConnectingPartialBeams(beamsList: Beams[]): Beams[] {
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

    beamsList: Beam[] = [];
    feathered: boolean = false;

    get length(): number {
        return this.beamsList.length;
    }

    /**
     * Append a new {@link Beam} object to this Beams, automatically creating the Beam
     *   object and incrementing the number count.
     *
     * @param {string} type - the type (passed to {@link Beam})
     * @param {string} [direction=undefined] - the direction if type is "partial"
     * @returns {Beam} newly appended object
     */
    append(type: string, direction=undefined): Beam {
        const obj = new Beam(type, direction);
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

     * Both "eighth" and "8th" work.  Adding more than 9 beams (i.e. things
            like 4096th notes) raises an error.

     * @param {string|number} level - either a string like "eighth" or a number like 1 (="eighth")
     * @param {string} [type] - type to fill all beams to.
     * @returns {this}
     */
    fill(level: string|number, type: string|undefined = undefined): Beams {
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
        } else if (level === 7 || level === duration.typeFromNumDict[512]) {
            count = 7;
        } else if (level === 8 || level === duration.typeFromNumDict[1024]) {
            count = 8;
        } else if (level === 9 || level === duration.typeFromNumDict[2048]) {
            count = 9;
        } else {
            throw new Music21Exception('cannot fill beams for level ' + level);
        }
        for (let i = 1; i <= count; i++) {
            const obj = new Beam(type);
            obj.number = i;
            this.beamsList.push(obj);
        }
        return this;
    }

    /**
     * Get the beam with the given number or throw an exception.
     *
     * @param {number} number - the beam number to retrieve (usually one less than the position in `.beamsList`)
     * @returns {Beam|undefined}
     */
    getByNumber(number: number): Beam|undefined {
        if (!this.getNumbers().includes(number)) {
            throw new Music21Exception('beam number ' + number + ' cannot be accessed');
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
     * @returns {Array<number>} all the numbers
     */
    getNumbers(): number[] {
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
     * @param {number} number
     * @returns {string|undefined}
     */
    getTypeByNumber(number: number): string|undefined {
        const beamObj = this.getByNumber(number);
        if (beamObj === undefined) {
            return undefined;
        }
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
     * @returns {Array<string>} all the types
     */
    getTypes(): string[] {
        const types = [];
        for (let i = 0; i < this.length; i++) {
            types.push(this.beamsList[i].type);
        }
        return types;
    }

    /**
     * Set all the {@link Beam} objects to a given type/direction
     *
     * @param {string} type - beam type
     * @param {string} [direction] - beam direction
     * @returns {this}
     */
    setAll(type: string, direction: string = undefined): Beams {
        if (validBeamTypes[type] === undefined) {
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
     * Set the {@link Beam} object specified by `number` to a given type/direction
     *
     * @param {number} number
     * @param {string} type
     * @param {string} [direction]
     * @returns {this}
     */
    setByNumber(
        number: number,
        type: string,
        direction: string|undefined = undefined
    ): Beams {
        if (direction === undefined) {
            const splitIt = type.split('-');
            type = splitIt[0];
            direction = splitIt[1]; // not unpacking because. can be undefined...
        }
        if (validBeamTypes[type] === undefined) {
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
