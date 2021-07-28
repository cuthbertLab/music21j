import * as base from './base';
import * as interval from './interval';
import * as pitch from './pitch';
import * as note from './note';
export declare class Scale extends base.Music21Object {
    static get className(): string;
    type: string;
    constructor();
    /**
     *
     * @returns {string}
     * @readonly
     */
    get name(): string;
    /**
     * @readonly
     * @returns {boolean}
     */
    get isConcrete(): boolean;
}
export declare class AbstractScale extends Scale {
    static get className(): string;
    protected _net: interval.Interval[];
    tonicDegree: number;
    octaveDuplicating: boolean;
    deterministic: boolean;
    protected _alteredDegrees: {};
    protected _oneOctaveRealizationCache: any;
    constructor();
    /**
     * To be subclassed
     */
    buildNetwork(mode?: any): void;
    /**
     * One scale equals another
     *
     * @param {AbstractScale} other - the scale compared to.
     * @returns {boolean}
     */
    equals(other: AbstractScale): boolean;
    buildNetworkFromPitches(pitchList: string[] | pitch.Pitch[] | note.Note[]): void;
    getDegreeMaxUnique(): number;
    getRealization(pitchObj: any, unused_stepOfPitch?: any, unused_minPitch?: any, unused_maxPitch?: any, unused_direction?: any, unused_reverse?: any): any[];
    getPitchFromNodeDegree(pitchReference: any, unused_nodeName: any, nodeDegreeTarget: any): any;
    getRelativeNodeDegree(pitchReference: any, unused_nodeName: any, pitchTarget: any, unused_comparisonAttribute?: any, unused_direction?: any): number;
}
/**
 * @memberOf music21.scale
 *
 */
export declare class AbstractDiatonicScale extends AbstractScale {
    static get className(): string;
    dominantDegree: number;
    relativeMajorDegree: number;
    relativeMinorDegree: number;
    /**
     *
     * @param {string} [mode]
     * @property {string} type
     * @property {number|undefined} tonicDegree
     * @property {number|undefined} dominantDegree
     * @property {boolean} octaveDuplicating
     */
    constructor(mode?: string);
    buildNetwork(mode: string): void;
}
/**
 * @memberOf music21.scale
 *
 */
export declare class AbstractHarmonicMinorScale extends AbstractScale {
    static get className(): string;
    constructor();
    buildNetwork(): void;
}
/**
 * @memberOf music21.scale
 */
export declare class AbstractAscendingMelodicMinorScale extends AbstractScale {
    static get className(): string;
    constructor();
    buildNetwork(): void;
}
/**
 * @memberOf music21.scale
 */
export declare class ConcreteScale extends Scale {
    static get className(): string;
    tonic: pitch.Pitch;
    abstract: AbstractScale;
    constructor(tonic: any);
    get isConcrete(): boolean;
    getTonic(): pitch.Pitch;
    getPitches(unused_minPitch?: any, unused_maxPitch?: any, unused_direction?: any): any[];
    pitchFromDegree(degree: any, unused_minPitch?: any, unused_maxPitch?: any, unused_direction?: any, unused_equateTermini?: any): any;
    getScaleDegreeFromPitch(pitchTarget: any, unused_direction?: any, unused_comparisonAttribute?: any): number;
}
/**
 * @memberOf music21.scale
 */
export declare class DiatonicScale extends ConcreteScale {
    static get className(): string;
    constructor(tonic: any);
}
/**
 * @memberOf music21.scale
 */
export declare class MajorScale extends DiatonicScale {
    static get className(): string;
    constructor(tonic: any);
}
/**
 * @memberOf music21.scale
 */
export declare class MinorScale extends DiatonicScale {
    static get className(): string;
    constructor(tonic: any);
}
/**
 * @memberOf music21.scale
 */
export declare class HarmonicMinorScale extends ConcreteScale {
    static get className(): string;
    constructor(tonic: any);
}
/**
 * @memberOf music21.scale
 */
export declare class AscendingMelodicMinorScale extends ConcreteScale {
    static get className(): string;
    constructor(tonic: any);
}
/**
 * Function, not class
 *
 * @memberOf music21.scale
 * @function music21.scale.SimpleDiatonicScale
 * @param {pitch.Pitch} [tonic]
 * @param {Array<string>} scaleSteps - an array of diatonic prefixes,
 *     generally 'M' (major) or 'm' (minor) describing the seconds.
 * @returns {Array<pitch.Pitch>} an octave of scale objects.
 */
export declare function SimpleDiatonicScale(tonic: any, scaleSteps: any): pitch.Pitch[];
/**
 * One octave of a major scale
 *
 * @memberOf music21.scale
 * @function music21.scale.ScaleSimpleMajor
 * @param {pitch.Pitch} tonic
 * @returns {Array<pitch.Pitch>} an octave of scale objects.
 */
export declare function ScaleSimpleMajor(tonic: pitch.Pitch): pitch.Pitch[];
/**
 * One octave of a minor scale
 *
 * @memberOf music21.scale
 * @function music21.scale.ScaleSimpleMinor
 * @param {pitch.Pitch} tonic
 * @param {string} [minorType='natural'] - 'harmonic', 'harmonic-minor',
 *     'melodic', 'melodic-minor', 'melodic-minor-ascending',
 *     'melodic-ascending' or other (=natural/melodic-descending)
 * @returns {Array<pitch.Pitch>} an octave of scale objects.
 */
export declare function ScaleSimpleMinor(tonic: any, minorType: any): pitch.Pitch[];
//# sourceMappingURL=scale.d.ts.map