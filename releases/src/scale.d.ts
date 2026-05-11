import * as base from './base';
import * as interval from './interval';
import * as pitch from './pitch';
import type { Note } from './note';
type PitchLike = string | pitch.Pitch;
type ScalePitchInput = string | pitch.Pitch | Note;
/**
 * A generalized Scale object.
 */
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
/**
 * An Abstract Scale
 */
export declare class AbstractScale extends Scale {
    static get className(): string;
    protected _net: interval.Interval[];
    tonicDegree: number;
    octaveDuplicating: boolean;
    deterministic: boolean;
    protected _alteredDegrees: Record<string, unknown>;
    protected _oneOctaveRealizationCache: pitch.Pitch[] | undefined;
    constructor();
    /**
     * To be subclassed
     */
    buildNetwork(_mode?: string | undefined): void;
    /**
     * One scale equals another
     *
     * @param {AbstractScale} other - the scale compared to.
     * @returns {boolean}
     */
    equals(other: AbstractScale): boolean;
    /**
     * Builds this scale's interval network from pitches or notes.
     * If the final pitch does not repeat the first pitch name, a closing pitch is added.
     */
    buildNetworkFromPitches(pitchList: ScalePitchInput[]): void;
    getDegreeMaxUnique(): number;
    getRealization(pitchObj: PitchLike, unused_stepOfPitch?: unknown, unused_minPitch?: unknown, unused_maxPitch?: unknown, unused_direction?: unknown, unused_reverse?: unknown): pitch.Pitch[];
    getPitchFromNodeDegree(pitchReference: pitch.Pitch, _nodeName: string | number, nodeDegreeTarget: number): pitch.Pitch;
    getRelativeNodeDegree(pitchReference: pitch.Pitch, unused_nodeName: string | number, pitchTarget: PitchLike, unused_comparisonAttribute?: unknown, unused_direction?: unknown): number | undefined;
}
export declare class AbstractDiatonicScale extends AbstractScale {
    static get className(): string;
    dominantDegree: number;
    relativeMajorDegree: number;
    relativeMinorDegree: number;
    /**
     *
     * @property {string} type
     * @property {number|undefined} tonicDegree
     * @property {number|undefined} dominantDegree
     * @property {boolean} octaveDuplicating
     */
    constructor(mode?: string);
    buildNetwork(mode: string): void;
}
export declare class AbstractHarmonicMinorScale extends AbstractScale {
    static get className(): string;
    constructor();
    buildNetwork(): void;
}
export declare class AbstractAscendingMelodicMinorScale extends AbstractScale {
    static get className(): string;
    constructor();
    buildNetwork(): void;
}
export declare class ConcreteScale extends Scale {
    static get className(): string;
    tonic: pitch.Pitch;
    abstract: AbstractScale | undefined;
    constructor(tonic: string | pitch.Pitch);
    get isConcrete(): boolean;
    getTonic(): pitch.Pitch;
    getPitches(unused_minPitch?: unknown, unused_maxPitch?: unknown, unused_direction?: unknown): pitch.Pitch[];
    pitchFromDegree(degree: number, unused_minPitch?: unknown, unused_maxPitch?: unknown, unused_direction?: unknown, unused_equateTermini?: unknown): pitch.Pitch;
    getScaleDegreeFromPitch(pitchTarget: PitchLike, unused_direction?: unknown, unused_comparisonAttribute?: unknown): number | undefined;
}
export declare class DiatonicScale extends ConcreteScale {
    static get className(): string;
    constructor(tonic: string | pitch.Pitch);
}
export declare class MajorScale extends DiatonicScale {
    static get className(): string;
    constructor(tonic: string | pitch.Pitch);
}
export declare class MinorScale extends DiatonicScale {
    static get className(): string;
    constructor(tonic: string | pitch.Pitch);
}
export declare class HarmonicMinorScale extends ConcreteScale {
    static get className(): string;
    constructor(tonic: string | pitch.Pitch);
}
export declare class AscendingMelodicMinorScale extends ConcreteScale {
    static get className(): string;
    constructor(tonic: string | pitch.Pitch);
}
/**
 * Function, not class.  DEPRECATED: to be removed.
 */
export declare function SimpleDiatonicScale(tonic: pitch.Pitch | undefined, scaleSteps?: string[]): pitch.Pitch[];
/**
 * Function, not class.  DEPRECATED: to be removed.
 * One octave of a major scale
 */
export declare function ScaleSimpleMajor(tonic: pitch.Pitch | undefined): pitch.Pitch[];
/**
 * Function, not class.  DEPRECATED: to be removed.
 * One octave of a minor scale
 * [minorType='natural'] - 'harmonic', 'harmonic-minor',
 *     'melodic', 'melodic-minor', 'melodic-minor-ascending',
 *     'melodic-ascending' or other (=natural/melodic-descending)
 */
export declare function ScaleSimpleMinor(tonic: pitch.Pitch | undefined, minorType?: string): pitch.Pitch[];
export {};
//# sourceMappingURL=scale.d.ts.map