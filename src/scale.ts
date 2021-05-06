/**
 * Scale module. See {@link music21.scale} namespace
 * @module music21/scale
 */
/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/scale -- Scales
 *
 * Does not implement the full range of scales from music21p
 *
 * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
 *
 *
 *
 * Scale namespace.  Right now only supports very simple scales.
 *
 * @namespace music21.scale
 * @requires music21.base
 * @requires music21.common
 * @requires music21.debug
 * @requires music21.interval
 * @requires music21.pitch
 */
import { Music21Exception } from './exceptions21';
import { debug } from './debug';

import * as base from './base';
import * as common from './common';
import * as interval from './interval';
import * as pitch from './pitch';

// imports just for typechecking
import * as note from './note';

// const DIRECTION_BI = 'bi';
// const DIRECTION_DESCENDING = 'descending';
// const DIRECTION_ASCENDING = 'ascending';

export
/**
 * A generalized Scale object.
 *
 * @memberOf music21.scale
 */
class Scale extends base.Music21Object {
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

export
/**
 * An Abstract Scale
 *
 * @memberOf music21.scale
 */
class AbstractScale extends Scale {
    static get className() { return 'music21.scale.AbstractScale'; }

    protected _net: interval.Interval[] = [];
    tonicDegree: number = 1;
    octaveDuplicating: boolean = true;
    deterministic: boolean = true;
    protected _alteredDegrees = {};
    protected _oneOctaveRealizationCache = undefined;

    constructor() {
        super();
        this.type = 'Abstract';
    }

    /**
     * To be subclassed
     */
    buildNetwork(mode=undefined): void {
        this._net = [];
    }

    /**
     * One scale equals another
     *
     * @param {AbstractScale} other - the scale compared to.
     * @returns {boolean}
     */
    equals(other: AbstractScale): boolean {
        if (
            common.arrayEquals(this.classes, other.classes)
            && this.tonicDegree === other.tonicDegree
            && common.arrayEquals(this._net, other._net)
        ) {
            return true;
        } else {
            return false;
        }
    }

    buildNetworkFromPitches(pitchList: string[]|pitch.Pitch[]|note.Note[]) {
        const pitchListReal: pitch.Pitch[] = [];
        for (const p of pitchList) {
            if (typeof p === 'string') {
                pitchListReal.push(new pitch.Pitch(p));
            } else if (p.classes.includes('Note')) {
                pitchListReal.push((<note.Note> p).pitch);
            } else {
                pitchListReal.push((<pitch.Pitch> p));
            }
        }

        const pLast = pitchListReal[pitchListReal.length - 1];
        if (pLast.name === pitchListReal[0].name) {
            const p = pitchListReal[0].clone();
            if (pLast.ps > pitchListReal[0]) {
                // ascending;
                while (p.ps < pLast.ps) {
                    p.octave += 1;
                }
            } else {
                while (p.ps < pLast.ps) {
                    p.octave += -1;
                }
            }
            pitchListReal.push(p);
        }

        const intervalList = [];
        for (let i = 0; i < pitchListReal.length - 1; i++) {
            const thisInterval = new interval.Interval(
                pitchListReal[i],
                pitchListReal[i + 1]
            );
            intervalList.push(thisInterval);
        }
        this._net = intervalList;
    }

    getDegreeMaxUnique(): number {
        return this._net.length;
    }

    // noinspection JSUnusedLocalSymbols
    getRealization(
        pitchObj,
        unused_stepOfPitch=undefined,
        unused_minPitch=undefined,
        unused_maxPitch=undefined,
        unused_direction=undefined,
        unused_reverse=undefined
    ) {
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
        const post = [pitchObj];
        for (const intV of this._net) {
            pitchObj = intV.transposePitch(pitchObj);
            post.push(pitchObj);
        }
        return post;
    }

    getPitchFromNodeDegree(pitchReference, unused_nodeName, nodeDegreeTarget) {
        const zeroIndexDegree = nodeDegreeTarget - 1;
        for (let i = 0; i < zeroIndexDegree; i++) {
            const thisIntv = this._net[i % this._net.length];
            pitchReference = thisIntv.transposePitch(pitchReference);
        }
        return pitchReference;
    }

    // noinspection JSUnusedLocalSymbols
    getRelativeNodeDegree(
        pitchReference,
        unused_nodeName,
        pitchTarget,
        unused_comparisonAttribute=undefined,
        unused_direction=undefined
    ) {
        if (typeof pitchTarget === 'string') {
            pitchTarget = new pitch.Pitch(pitchTarget);
        }
        let realizedPitches;
        if (this._oneOctaveRealizationCache !== undefined) {
            realizedPitches = this._oneOctaveRealizationCache;
        } else {
            realizedPitches = this.getRealization(pitchReference);
            this._oneOctaveRealizationCache = realizedPitches;
        }
        const realizedNames = [];
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

/**
 * @memberOf music21.scale
 *
 */
export class AbstractDiatonicScale extends AbstractScale {
    static get className() { return 'music21.scale.AbstractDiatonicScale'; }

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
    constructor(mode='major') {
        super();
        this.type = 'Abstract diatonic';
        this.tonicDegree = undefined;
        this.dominantDegree = undefined;
        this.octaveDuplicating = true;
        this.buildNetwork(mode);
    }

    buildNetwork(mode: string) {
        const srcList = ['M2', 'M2', 'm2', 'M2', 'M2', 'M2', 'm2'];
        let intervalList;
        this.tonicDegree = 1;
        this.dominantDegree = 5;
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
    }
}

/**
 * @memberOf music21.scale
 *
 */
export class AbstractHarmonicMinorScale extends AbstractScale {
    static get className() { return 'music21.scale.AbstractHarmonicMinorScale'; }

    constructor() {
        super();
        this.type = 'Abstract harmonic minor';
        this.octaveDuplicating = true;
        this.buildNetwork();
    }

    buildNetwork() {
        const intervalList = ['M2', 'm2', 'M2', 'M2', 'm2', 'A2', 'm2'];
        this._net = [];
        for (const intVStr of intervalList) {
            this._net.push(new interval.Interval(intVStr));
        }
    }
}

// temporary, until bidirectional scales are created
// no need for descending, since minor takes care of that.
/**
 * @memberOf music21.scale
 */
export class AbstractAscendingMelodicMinorScale extends AbstractScale {
    static get className() { return 'music21.scale.AbstractAscendingMelodicMinorScale'; }

    constructor() {
        super();
        this.type = 'Abstract ascending melodic minor';
        this.octaveDuplicating = true;
        this.buildNetwork();
    }

    buildNetwork() {
        const intervalList = ['M2', 'm2', 'M2', 'M2', 'M2', 'M2', 'm2'];
        this._net = [];
        for (const intVStr of intervalList) {
            this._net.push(new interval.Interval(intVStr));
        }
    }
}

/**
 * @memberOf music21.scale
 */
export class ConcreteScale extends Scale {
    static get className() { return 'music21.scale.ConcreteScale'; }

    tonic: pitch.Pitch;
    abstract: AbstractScale;

    constructor(tonic) {
        super();
        if (typeof tonic === 'string') {
            tonic = new pitch.Pitch(tonic);
        }
        this.tonic = tonic;
        this.abstract = undefined;
    }

    // when adding functionality here, must also be added to key.Key.
    get isConcrete() {
        if (this.tonic !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    getTonic() {
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
        unused_minPitch=undefined,
        unused_maxPitch=undefined,
        unused_direction=undefined
    ) {
        let pitchObj;
        if (this.tonic === undefined) {
            pitchObj = new pitch.Pitch('C4');
        } else {
            pitchObj = this.tonic;
        }
        return this.abstract.getRealization(pitchObj);
    }

    // noinspection JSUnusedLocalSymbols
    pitchFromDegree(
        degree,
        unused_minPitch=undefined,
        unused_maxPitch=undefined,
        unused_direction=undefined,
        unused_equateTermini=undefined
    ) {
        return this.abstract.getPitchFromNodeDegree(
            this.tonic,
            this.abstract.tonicDegree,
            degree
        );
    }

    // noinspection JSUnusedLocalSymbols
    getScaleDegreeFromPitch(
        pitchTarget,
        unused_direction=undefined,
        unused_comparisonAttribute=undefined
    ) {
        return this.abstract.getRelativeNodeDegree(
            this.tonic,
            this.abstract.tonicDegree,
            pitchTarget
        );
    }
}

/**
 * @memberOf music21.scale
 */
export class DiatonicScale extends ConcreteScale {
    static get className() { return 'music21.scale.DiatonicScale'; }

    constructor(tonic) {
        super(tonic); // a.k.a. ^2 :-)
        this.abstract = new AbstractDiatonicScale();
        this.type = 'diatonic';
    }
}

/**
 * @memberOf music21.scale
 */
export class MajorScale extends DiatonicScale {
    static get className() { return 'music21.scale.MajorScale'; }

    constructor(tonic) {
        super(tonic); // a.k.a. ^2 :-)
        this.type = 'major';
        this.abstract.buildNetwork(this.type);
    }
}


/**
 * @memberOf music21.scale
 */
export class MinorScale extends DiatonicScale {
    static get className() { return 'music21.scale.MinorScale'; }

    constructor(tonic) {
        super(tonic); // a.k.a. ^2 :-)
        this.type = 'minor';
        this.abstract.buildNetwork(this.type);
    }
}

/**
 * @memberOf music21.scale
 */
export class HarmonicMinorScale extends ConcreteScale {
    static get className() { return 'music21.scale.HarmonicMinorScale'; }

    constructor(tonic) {
        super(tonic); // a.k.a. ^2 :-)
        this.type = 'harmonic minor';
        this.abstract = new AbstractHarmonicMinorScale();
    }
}

/**
 * @memberOf music21.scale
 */
export class AscendingMelodicMinorScale extends ConcreteScale {
    static get className() { return 'music21.scale.AscendingMelodicMinorScale'; }

    constructor(tonic) {
        super(tonic); // a.k.a. ^2 :-)
        this.type = 'harmonic minor';
        this.abstract = new AbstractAscendingMelodicMinorScale();
    }
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
export function SimpleDiatonicScale(tonic, scaleSteps) {
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
 * One octave of a major scale
 *
 * @memberOf music21.scale
 * @function music21.scale.ScaleSimpleMajor
 * @param {pitch.Pitch} tonic
 * @returns {Array<pitch.Pitch>} an octave of scale objects.
 */
export function ScaleSimpleMajor(tonic: pitch.Pitch): pitch.Pitch[] {
    const scaleSteps = ['M', 'M', 'm', 'M', 'M', 'M', 'm'];
    return SimpleDiatonicScale(tonic, scaleSteps);
}

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
export function ScaleSimpleMinor(tonic, minorType) {
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
