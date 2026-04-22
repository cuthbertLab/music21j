/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/scale -- Scales
 *
 * Does not implement the full range of scales from music21p
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 */
import deepEqual from 'deep-equal';

import { Music21Exception } from './exceptions21';
import { debug } from './debug';

import * as base from './base';
import * as interval from './interval';
import * as pitch from './pitch';

// imports just for typechecking
import type { Note } from './note';

type PitchLike = string | pitch.Pitch;
type ScalePitchInput = string | pitch.Pitch | Note;

// const DIRECTION_BI = 'bi';
// const DIRECTION_DESCENDING = 'descending';
// const DIRECTION_ASCENDING = 'ascending';

/**
 * A generalized Scale object.
 */
export class Scale extends base.Music21Object {
    static get className() { return 'music21.scale.Scale'; }

    type: string = 'Scale';

    constructor() {
        super();
        this.type = 'Scale';
    }

    /**
     *
     * @returns {string}
     * @readonly
     */
    get name(): string {
        return this.type;
    }

    /**
     * @readonly
     * @returns {boolean}
     */
    get isConcrete(): boolean {
        return false;
    }
}

/**
 * An Abstract Scale
 */
export class AbstractScale extends Scale {
    static get className() { return 'music21.scale.AbstractScale'; }

    protected _net: interval.Interval[] = [];
    tonicDegree: number = 1;
    octaveDuplicating: boolean = true;
    deterministic: boolean = true;
    protected _alteredDegrees: Record<string, unknown> = {};
    protected _oneOctaveRealizationCache: pitch.Pitch[] | undefined = undefined;

    constructor() {
        super();
        this.type = 'Abstract';
    }

    /**
     * To be subclassed
     */
    buildNetwork(_mode: string | undefined = undefined): void {
        this._net = [];
        this._oneOctaveRealizationCache = undefined;
    }

    /**
     * One scale equals another
     *
     * @param {AbstractScale} other - the scale compared to.
     * @returns {boolean}
     */
    equals(other: AbstractScale): boolean {
        if (deepEqual(this.classes, other.classes)
                && this.tonicDegree === other.tonicDegree
                && deepEqual(this._net, other._net)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Builds this scale's interval network from pitches or notes.
     * If the final pitch does not repeat the first pitch name, a closing pitch is added.
     */
    buildNetworkFromPitches(pitchList: ScalePitchInput[]): void {
        const pitchListReal: pitch.Pitch[] = [];
        for (const p of pitchList) {
            if (typeof p === 'string') {
                pitchListReal.push(new pitch.Pitch(p));
            } else if (p.classes.includes('Note')) {
                pitchListReal.push((p as Note).pitch);
            } else {
                pitchListReal.push(p as pitch.Pitch);
            }
        }
        if (pitchListReal.length === 0) {
            this._net = [];
            this._oneOctaveRealizationCache = undefined;
            return;
        }

        const pLast = pitchListReal[pitchListReal.length - 1];
        if (pLast.name !== pitchListReal[0].name) {
            const p = pitchListReal[0].clone();
            if (pLast.ps > pitchListReal[0].ps) {
                // ascending;
                while (p.ps < pLast.ps) {
                    p.octave += 1;
                }
            } else {
                while (p.ps > pLast.ps) {
                    p.octave += -1;
                }
            }
            pitchListReal.push(p);
        }

        const intervalList: interval.Interval[] = [];
        for (let i = 0; i < pitchListReal.length - 1; i++) {
            const thisInterval = new interval.Interval(
                pitchListReal[i],
                pitchListReal[i + 1]
            );
            intervalList.push(thisInterval);
        }
        const span = new interval.Interval(pitchListReal[0], pitchListReal[pitchListReal.length - 1]);
        this.octaveDuplicating = span.name === 'P8';
        this._net = intervalList;
        this._oneOctaveRealizationCache = undefined;
    }

    getDegreeMaxUnique(): number {
        return this._net.length;
    }

    // noinspection JSUnusedLocalSymbols
    getRealization(
        pitchObj: PitchLike,
        unused_stepOfPitch: unknown = undefined,
        unused_minPitch: unknown = undefined,
        unused_maxPitch: unknown = undefined,
        unused_direction: unknown = undefined,
        unused_reverse: unknown = undefined
    ): pitch.Pitch[] {
        // if (direction === undefined) {
        //     direction = DIRECTION_ASCENDING;
        // }
        // if (stepOfPitch === undefined) {
        //     stepOfPitch = 1;
        // }
        if (typeof pitchObj === 'string') {
            pitchObj = new pitch.Pitch(pitchObj);
        } else {
            pitchObj = pitchObj.clone();
        }
        const post: pitch.Pitch[] = [pitchObj];
        for (const intV of this._net) {
            pitchObj = intV.transposePitch(pitchObj);
            post.push(pitchObj);
        }
        return post;
    }

    getPitchFromNodeDegree(
        pitchReference: pitch.Pitch, 
        _nodeName: string|number, 
        nodeDegreeTarget: number
    ): pitch.Pitch {
        const zeroIndexDegree = nodeDegreeTarget - 1;
        for (let i = 0; i < zeroIndexDegree; i++) {
            const thisIntv = this._net[i % this._net.length];
            pitchReference = thisIntv.transposePitch(pitchReference);
        }
        return pitchReference;
    }

    // noinspection JSUnusedLocalSymbols
    getRelativeNodeDegree(
        pitchReference: pitch.Pitch,
        unused_nodeName: string|number,
        pitchTarget: PitchLike,
        unused_comparisonAttribute: unknown = undefined,
        unused_direction: unknown = undefined
    ): number | undefined {
        if (typeof pitchTarget === 'string') {
            pitchTarget = new pitch.Pitch(pitchTarget);
        }
        let realizedPitches: pitch.Pitch[];
        if (this._oneOctaveRealizationCache !== undefined) {
            realizedPitches = this._oneOctaveRealizationCache;
        } else {
            realizedPitches = this.getRealization(pitchReference);
            this._oneOctaveRealizationCache = realizedPitches;
        }
        const realizedNames: string[] = [];
        for (const p of realizedPitches) {
            realizedNames.push(p.name);
        }
        const realizedIndex = realizedNames.indexOf(pitchTarget.name);
        if (realizedIndex === -1) {
            return undefined;
        } else {
            return realizedIndex + 1;
        }
    }
}

export class AbstractDiatonicScale extends AbstractScale {
    static override get className(): string { return 'music21.scale.AbstractDiatonicScale'; }

    dominantDegree: number = 5;
    relativeMajorDegree: number = 1;
    relativeMinorDegree: number = 6;

    /**
     *
     * @property {string} type
     * @property {number|undefined} tonicDegree
     * @property {number|undefined} dominantDegree
     * @property {boolean} octaveDuplicating
     */
    constructor(mode: string='major') {
        super();
        this.type = 'Abstract diatonic';
        this.octaveDuplicating = true;
        this.buildNetwork(mode);
    }

    buildNetwork(mode: string): void {
        const srcList = ['M2', 'M2', 'm2', 'M2', 'M2', 'M2', 'm2'];
        let intervalList: string[] = srcList;
        this.tonicDegree = 1;
        this.dominantDegree = 5;
        this.relativeMajorDegree = 1;
        this.relativeMinorDegree = 6;
        if (['major', 'ionian'].includes(mode)) {
            intervalList = srcList;
            this.relativeMajorDegree = 1;
            this.relativeMinorDegree = 6;
        } else if (['minor', 'aeolian'].includes(mode)) {
            intervalList = srcList.slice(5, 7);
            intervalList.push(...srcList.slice(0, 5));
            this.relativeMajorDegree = 3;
            this.relativeMinorDegree = 1;
        }
        this._net = [];
        for (const intVStr of intervalList) {
            this._net.push(new interval.Interval(intVStr));
        }
        this._oneOctaveRealizationCache = undefined;
    }
}

export class AbstractHarmonicMinorScale extends AbstractScale {
    static get className() { return 'music21.scale.AbstractHarmonicMinorScale'; }

    constructor() {
        super();
        this.type = 'Abstract harmonic minor';
        this.octaveDuplicating = true;
        this.buildNetwork();
    }

    buildNetwork(): void {
        const intervalList = ['M2', 'm2', 'M2', 'M2', 'm2', 'A2', 'm2'];
        this._net = [];
        for (const intVStr of intervalList) {
            this._net.push(new interval.Interval(intVStr));
        }
        this._oneOctaveRealizationCache = undefined;
    }
}

// temporary, until bidirectional scales are created
// no need for descending, since minor takes care of that.
export class AbstractAscendingMelodicMinorScale extends AbstractScale {
    static get className() { return 'music21.scale.AbstractAscendingMelodicMinorScale'; }

    constructor() {
        super();
        this.type = 'Abstract ascending melodic minor';
        this.octaveDuplicating = true;
        this.buildNetwork();
    }

    buildNetwork(): void {
        const intervalList = ['M2', 'm2', 'M2', 'M2', 'M2', 'M2', 'm2'];
        this._net = [];
        for (const intVStr of intervalList) {
            this._net.push(new interval.Interval(intVStr));
        }
        this._oneOctaveRealizationCache = undefined;
    }
}

export class ConcreteScale extends Scale {
    static get className() { return 'music21.scale.ConcreteScale'; }

    tonic: pitch.Pitch;
    abstract: AbstractScale | undefined;

    constructor(tonic: string|pitch.Pitch) {
        super();
        if (typeof tonic === 'string') {
            tonic = new pitch.Pitch(tonic);
        }
        this.tonic = tonic;
        this.abstract = undefined;
    }

    // when adding functionality here, must also be added to key.Key.
    get isConcrete(): boolean {
        if (this.tonic !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    getTonic(): pitch.Pitch {
        return this.tonic;
    }

    // transpose
    // tune
    // No .romanNumeral function because of circular imports...
    // romanNumeral(degree) {
    //     return new roman.RomanNumeral(degree, this);
    // }

    // noinspection JSUnusedLocalSymbols
    getPitches(
        unused_minPitch: unknown = undefined,
        unused_maxPitch: unknown = undefined,
        unused_direction: unknown = undefined
    ): pitch.Pitch[] {
        let pitchObj: pitch.Pitch;
        if (this.tonic === undefined) {
            pitchObj = new pitch.Pitch('C4');
        } else {
            pitchObj = this.tonic;
        }
        if (this.abstract === undefined) {
            throw new Music21Exception('ConcreteScale requires an abstract scale network');
        }
        return this.abstract.getRealization(pitchObj);
    }

    // noinspection JSUnusedLocalSymbols
    pitchFromDegree(
        degree: number,
        unused_minPitch: unknown = undefined,
        unused_maxPitch: unknown = undefined,
        unused_direction: unknown = undefined,
        unused_equateTermini: unknown = undefined
    ): pitch.Pitch {
        if (this.abstract === undefined) {
            throw new Music21Exception('ConcreteScale requires an abstract scale network');
        }
        return this.abstract.getPitchFromNodeDegree(
            this.tonic,
            this.abstract.tonicDegree,
            degree
        );
    }

    // noinspection JSUnusedLocalSymbols
    getScaleDegreeFromPitch(
        pitchTarget: PitchLike,
        unused_direction: unknown = undefined,
        unused_comparisonAttribute: unknown = undefined
    ): number | undefined {
        // music21j currently matches by pitch name only, not by pitchClass or step.
        if (this.abstract === undefined) {
            throw new Music21Exception('ConcreteScale requires an abstract scale network');
        }
        return this.abstract.getRelativeNodeDegree(
            this.tonic,
            this.abstract.tonicDegree,
            pitchTarget
        );
    }
}

export class DiatonicScale extends ConcreteScale {
    static get className() { return 'music21.scale.DiatonicScale'; }

    constructor(tonic: string|pitch.Pitch) {
        super(tonic); 
        this.abstract = new AbstractDiatonicScale();
        this.type = 'diatonic';
    }
}

export class MajorScale extends DiatonicScale {
    static get className() { return 'music21.scale.MajorScale'; }

    constructor(tonic: string|pitch.Pitch) {
        super(tonic); 
        this.type = 'major';
        this.abstract.buildNetwork(this.type);
    }
}


export class MinorScale extends DiatonicScale {
    static get className() { return 'music21.scale.MinorScale'; }

    constructor(tonic: string|pitch.Pitch) {
        super(tonic);
        this.type = 'minor';
        this.abstract.buildNetwork(this.type);
    }
}

export class HarmonicMinorScale extends ConcreteScale {
    static get className() { return 'music21.scale.HarmonicMinorScale'; }

    constructor(tonic: string|pitch.Pitch) {
        super(tonic); 
        this.type = 'harmonic minor';
        this.abstract = new AbstractHarmonicMinorScale();
    }
}

export class AscendingMelodicMinorScale extends ConcreteScale {
    static get className() { return 'music21.scale.AscendingMelodicMinorScale'; }

    constructor(tonic: string|pitch.Pitch) {
        super(tonic); 
        this.type = 'harmonic minor';
        this.abstract = new AbstractAscendingMelodicMinorScale();
    }
}

/**
 * Function, not class.  DEPRECATED: to be removed.
 */
export function SimpleDiatonicScale(
    tonic: pitch.Pitch | undefined,
    scaleSteps?: string[]
): pitch.Pitch[] {
    if (tonic === undefined) {
        tonic = new pitch.Pitch('C4');
    } else if (!(tonic instanceof pitch.Pitch)) {
        throw new Music21Exception(
            'Cannot make a scale not from '
                + 'a music21.pitch.Pitch object: '
                + tonic
        );
    }
    if (scaleSteps === undefined) {
        scaleSteps = ['M', 'M', 'm', 'M', 'M', 'M', 'm'];
    }
    const gi = new interval.GenericInterval(2);
    const pitches: pitch.Pitch[] = [tonic];
    let lastPitch = tonic;
    for (let i = 0; i < scaleSteps.length; i++) {
        const di = new interval.DiatonicInterval(scaleSteps[i], gi);
        const ii = new interval.Interval(di);
        const newPitch = ii.transposePitch(lastPitch);
        if (debug) {
            console.log('ScaleSimpleMajor -- adding pitch: ' + newPitch.name);
        }
        pitches.push(newPitch);
        lastPitch = newPitch;
    }
    return pitches;
}

/**
 * Function, not class.  DEPRECATED: to be removed.
 * One octave of a major scale
 */
export function ScaleSimpleMajor(tonic: pitch.Pitch | undefined): pitch.Pitch[] {
    const scaleSteps = ['M', 'M', 'm', 'M', 'M', 'M', 'm'];
    return SimpleDiatonicScale(tonic, scaleSteps);
}

/**
 * Function, not class.  DEPRECATED: to be removed.
 * One octave of a minor scale
 * [minorType='natural'] - 'harmonic', 'harmonic-minor',
 *     'melodic', 'melodic-minor', 'melodic-minor-ascending',
 *     'melodic-ascending' or other (=natural/melodic-descending)
 */
export function ScaleSimpleMinor(
    tonic: pitch.Pitch | undefined,
    minorType?: string
): pitch.Pitch[] {
    const scaleSteps = ['M', 'm', 'M', 'M', 'm', 'M', 'M'];
    if (typeof minorType === 'string') {
        // "harmonic minor" -> "harmonic-minor"
        minorType = minorType.replace(/\s/g, '-');
    }
    if (minorType === 'harmonic' || minorType === 'harmonic-minor') {
        scaleSteps[5] = 'A';
        scaleSteps[6] = 'm';
    } else if (
        minorType === 'melodic'
        || minorType === 'melodic-ascending'
        || minorType === 'melodic-minor'
        || minorType === 'melodic-minor-ascending'
    ) {
        scaleSteps[4] = 'M';
        scaleSteps[6] = 'm';
    }
    return SimpleDiatonicScale(tonic, scaleSteps);
}
