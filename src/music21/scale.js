/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/scale -- Scales
 *
 * Does not implement the full range of scales from music21p
 *
 * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
 *
 */
import * as base from './base.js';
import { common } from './common.js';
import { debug } from './debug.js';
import { interval } from './interval.js';
import * as pitch from './pitch.js';

import { Music21Exception } from './exceptions21.js';

// const DIRECTION_BI = 'bi';
// const DIRECTION_DESCENDING = 'descending';
// const DIRECTION_ASCENDING = 'ascending';

/**
 * Scale module. See {@link music21.scale} namespace
 *
 * @exports music21/scale
 */
/**
 * Scale namespace.  Right now only supports very simple scales.
 *
 * @namespace music21.scale
 * @extends music21.base.Music21Object
 * @memberof music21
 * @requires music21/base
 * @requires music21/common
 * @requires music21/debug
 * @requires music21/interval
 * @requires music21/pitch
 */
export class Scale extends base.Music21Object {
    constructor() {
        super();
        this.type = 'Scale';
    }

    get name() {
        return this.type;
    }

    get isConcrete() {
        return false;
    }
}

/**
 * @extends music21.scale.Scale
 *
 */
export class AbstractScale extends Scale {
    constructor() {
        super();
        this._net = []; // simplified -- no IntervalNetwork, just list of intervals
        this.tonicDegree = 1;
        this.octaveDuplicating = true;
        this.deterministic = true;
        this._alteredDegrees = {};
        this._oneOctaveRealizationCache = undefined;
    }

    equals(other) {
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

    buildNetworkFromPitches(pitchList) {
        const pitchListReal = [];
        for (const p of pitchList) {
            if (typeof p === 'string') {
                pitchListReal.push(new pitch.Pitch(p));
            } else if (p.classes.includes('Note')) {
                pitchListReal.push(p.pitch);
            } else {
                pitchListReal.push(p);
            }
        }
        pitchList = pitchListReal;

        const pLast = pitchList[pitchList.length - 1];
        if (pLast.name === pitchList[0]) {
            const p = pitchList[0].clone();
            if (pLast.ps > pitchList[0]) {
                // ascending;
                while (p.ps < pLast.ps) {
                    p.octave += 1;
                }
            } else {
                while (p.ps < pLast.ps) {
                    p.octave += -1;
                }
            }
            pitchList.push(p);
        }

        const intervalList = [];
        for (let i = 0; i < pitchList.length - 1; i++) {
            const thisInterval = new interval.Interval(
                pitchList[i],
                pitchList[i + 1]
            );
            intervalList.push(thisInterval);
        }
        this._net = intervalList;
    }

    getDegreeMaxUnique() {
        return this._net.length;
    }

    // noinspection JSUnusedLocalSymbols
    getRealization(
        pitchObj,
        unused_stepOfPitch,
        unused_minPitch,
        unused_maxPitch,
        unused_direction,
        unused_reverse
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
        unused_comparisonAttribute,
        unused_direction
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
 * @extends music21.scale.AbstractScale
 *
 */
export class AbstractDiatonicScale extends AbstractScale {
    /**
     *
     * @param {string} [mode]
     * @property {string} type
     * @property {number|undefined} tonicDegree
     * @property {number|undefined} dominantDegree
     * @property {boolean} octaveDuplicating
     */
    constructor(mode) {
        super();
        this.type = 'Abstract diatonic';
        this.tonicDegree = undefined;
        this.dominantDegree = undefined;
        this.octaveDuplicating = true;
        this._buildNetwork(mode);
    }

    _buildNetwork(mode) {
        const srcList = ['M2', 'M2', 'm2', 'M2', 'M2', 'M2', 'm2'];
        let intervalList;
        this.tonicDegree = 1;
        this.dominantDegree = 5;
        if (['major', 'ionian', undefined].includes(mode)) {
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
 * @extends music21.scale.AbstractScale
 *
 */
export class AbstractHarmonicMinorScale extends AbstractScale {
    constructor() {
        super();
        this.type = 'Abstract harmonic minor';
        this.octaveDuplicating = true;
        this._buildNetwork();
    }

    _buildNetwork() {
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
 * @extends music21.scale.AbstractScale
 */
export class AbstractAscendingMelodicMinorScale extends AbstractScale {
    constructor() {
        super();
        this.type = 'Abstract ascending melodic minor';
        this.octaveDuplicating = true;
        this._buildNetwork();
    }

    _buildNetwork() {
        const intervalList = ['M2', 'm2', 'M2', 'M2', 'M2', 'M2', 'm2'];
        this._net = [];
        for (const intVStr of intervalList) {
            this._net.push(new interval.Interval(intVStr));
        }
    }
}

/**
 * @extends music21.scale.Scale
 */
export class ConcreteScale extends Scale {
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
    getPitches(unused_minPitch, unused_maxPitch, unused_direction) {
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
        unused_minPitch,
        unused_maxPitch,
        unused_direction,
        unused_equateTermini
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
        unused_direction,
        unused_comparisonAttribute
    ) {
        return this.abstract.getRelativeNodeDegree(
            this.tonic,
            this.abstract.tonicDegree,
            pitchTarget
        );
    }
}

/**
 * @extends music21.scale.ConcreteScale
 */
export class DiatonicScale extends ConcreteScale {
    constructor(tonic) {
        super(tonic); // a.k.a. ^2 :-)
        this.abstract = new AbstractDiatonicScale();
        this.type = 'diatonic';
    }
}

/**
 * @extends music21.scale.DiatonicScale
 */
export class MajorScale extends DiatonicScale {
    constructor(tonic) {
        super(tonic); // a.k.a. ^2 :-)
        this.type = 'major';
        this.abstract._buildNetwork(this.type);
    }
}


/**
 * @extends music21.scale.DiatonicScale
 */
export class MinorScale extends DiatonicScale {
    constructor(tonic) {
        super(tonic); // a.k.a. ^2 :-)
        this.type = 'minor';
        this.abstract._buildNetwork(this.type);
    }
}

/**
 * @extends music21.scale.ConcreteScale
 */
export class HarmonicMinorScale extends ConcreteScale {
    constructor(tonic) {
        super(tonic); // a.k.a. ^2 :-)
        this.type = 'harmonic minor';
        this.abstract = new AbstractHarmonicMinorScale();
    }
}

/**
 * @extends music21.scale.ConcreteScale
 */
export class AscendingMelodicMinorScale extends ConcreteScale {
    constructor(tonic) {
        super(tonic); // a.k.a. ^2 :-)
        this.type = 'harmonic minor';
        this.abstract = new AbstractAscendingMelodicMinorScale();
    }
}

/**
 * Function, not class
 *
 * @function music21.scale.SimpleDiatonicScale
 * @param {music21.pitch.Pitch} [tonic]
 * @param {Array<string>} scaleSteps - an array of diatonic prefixes,
 *     generally 'M' (major) or 'm' (minor) describing the seconds.
 * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
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
    const pitches = [tonic];
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
 * @function music21.scale.ScaleSimpleMajor
 * @param {music21.pitch.Pitch} tonic
 * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
 */
export function ScaleSimpleMajor(tonic) {
    const scaleSteps = ['M', 'M', 'm', 'M', 'M', 'M', 'm'];
    return SimpleDiatonicScale(tonic, scaleSteps);
}

/**
 * One octave of a minor scale
 *
 * @function music21.scale.ScaleSimpleMinor
 * @param {music21.pitch.Pitch} tonic
 * @param {string} [minorType='natural'] - 'harmonic', 'harmonic-minor',
 *     'melodic', 'melodic-minor', 'melodic-minor-ascending',
 *     'melodic-ascending' or other (=natural/melodic-descending)
 * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
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

export const scale = {
    Scale,
    AbstractScale,
    AbstractDiatonicScale,
    AbstractHarmonicMinorScale,
    AbstractAscendingMelodicMinorScale,
    ConcreteScale,
    DiatonicScale,
    MajorScale,
    MinorScale,
    HarmonicMinorScale,
    AscendingMelodicMinorScale,

    ScaleSimpleMinor,
    ScaleSimpleMajor,
    SimpleDiatonicScale,
};
