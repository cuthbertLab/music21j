import * as prebase from './prebase';
import type * as base from './base';
export declare const validBeamTypes: {
    start: boolean;
    stop: boolean;
    continue: boolean;
    partial: boolean;
};
export declare const beamableDurationTypes: string[];
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
export declare class Beam extends prebase.ProtoM21Object {
    static get className(): string;
    type: string;
    direction: string | undefined;
    number: number;
    independentAngle: number;
    constructor(type: string, direction?: any);
}
/**
 * Object representing a collection of Beams
 *
 * @property {Beam[]} beamsList - a list of Beam objects
 * @property {boolean} [feathered=false] - is this a feathered beam.
 * @property {number} length - length of beamsList
 */
export declare class Beams extends prebase.ProtoM21Object {
    static get className(): string;
    static naiveBeams(srcList: Iterable<base.Music21Object>): Beams[];
    static removeSandwichedUnbeamables(beamsList: Beams[]): Beams[];
    static sanitizePartialBeams(beamsList: Beams[]): Beams[];
    static mergeConnectingPartialBeams(beamsList: Beams[]): Beams[];
    beamsList: Beam[];
    feathered: boolean;
    get length(): number;
    /**
     * Append a new {@link Beam} object to this Beams, automatically creating the Beam
     *   object and incrementing the number count.
     *
     * @param {string} type - the type (passed to {@link Beam})
     * @param {string} [direction=undefined] - the direction if type is "partial"
     * @returns {Beam} newly appended object
     */
    append(type: string, direction?: any): Beam;
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
    fill(level: string | number, type?: string | undefined): Beams;
    /**
     * Get the beam with the given number or throw an exception.
     *
     * @param {number} number - the beam number to retrieve (usually one less than the position in `.beamsList`)
     * @returns {Beam|undefined}
     */
    getByNumber(number: number): Beam | undefined;
    /**
     * Get an Array of all the numbers for the beams
     *
     * @returns {Array<number>} all the numbers
     */
    getNumbers(): number[];
    /**
     * Returns the type + "-" + direction (if direction is defined)
     * for the beam with the given number.
     *
     * @param {number} number
     * @returns {string|undefined}
     */
    getTypeByNumber(number: number): string | undefined;
    /**
     * Get an Array of all the types for the beams
     *
     * @returns {Array<string>} all the types
     */
    getTypes(): string[];
    /**
     * Set all the {@link Beam} objects to a given type/direction
     *
     * @param {string} type - beam type
     * @param {string} [direction] - beam direction
     * @returns {this}
     */
    setAll(type: string, direction?: string): Beams;
    /**
     * Set the {@link Beam} object specified by `number` to a given type/direction
     *
     * @param {number} number
     * @param {string} type
     * @param {string} [direction]
     * @returns {this}
     */
    setByNumber(number: number, type: string, direction?: string | undefined): Beams;
}
//# sourceMappingURL=beam.d.ts.map