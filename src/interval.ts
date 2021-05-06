/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/interval -- Interval routines
 *
 * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006-19, Michael Scott Cuthbert and cuthbertLab
 *
 * interval module. See {@link music21.interval} for namespace
 * Interval related objects
 *
 * @exports music21/interval
 *
 * @namespace music21.interval
 * @memberof music21
 * @requires music21/prebase
 * @requires music21/pitch
 */
import { debug } from './debug';

import * as common from './common';
import * as note from './note';
import * as prebase from './prebase';
import * as pitch from './pitch';

/**
 * Interval Directions as an Object/map
 *
 * @memberof music21.interval
 * @example
 * if (music21.interval.Direction.OBLIQUE >
 *     music21.interval.Direction.ASCENDING ) {
 *    console.log(music21.interval.Direction.DESCENDING);
 * }
 *
 */
export const Direction = {
    DESCENDING: -1,
    OBLIQUE: 0,
    ASCENDING: 1,
};

/**
 * N.B. a dict in music21p -- the indexes here let Direction call them + 1
 *
 * @memberof music21.interval
 * @example
 * console.log(music21.interval.IntervalDirectionTerms[music21l.interval.Direction.OBLIQUE + 1])
 * // "Oblique"
 */
export const IntervalDirectionTerms = ['Descending', 'Oblique', 'Ascending'];

/**
 * ordinals for music terms...
 *
 * @memberof music21.interval
 * @example
 * for (var i = 1; // N.B. 0 = undefined
 *      i < music21.interval.MusicOrdinals.length;
 *      i++) {
 *     console.log(i, music21.interval.MusicOrdinals[i]);
 * }
 * // 1, Unison
 * // 2, Second
 * // 3, Third
 * // ...
 * // 8, Octave
 * // ...
 * // 15, Double Octave
 */
export const MusicOrdinals = [
    undefined,
    'Unison',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Octave',
    'Ninth',
    'Tenth',
    'Eleventh',
    'Twelfth',
    'Thirteenth',
    'Fourteenth',
    'Double Octave',
];

/**
 * Represents an interval such as unison, second, etc.
 *
 * Properties are demonstrated below.
 *
 * @class GenericInterval
 * @memberof music21.interval
 * @param {number} [gi=1] - generic interval (1 or higher, or -2 or lower)
 * @example
 * var gi = new music21.interval.GenericInterval(-14)
 * gi.value
 * // -14
 * gi.directed
 * // -14
 * gi.undirected
 * // 14
 * gi.direction == music21.interval.Direction.DESCENDING
 * // true
 * gi.isSkip
 * // true
 * gi.isStep
 * // false
 * gi.isDiatonicStep
 * // false  // augmented unisons are not diatonicSteps but can't tell yet..
 * gi.isUnison
 * // false
 * gi.simpledDirected
 * // -7
 * gi.simpleUndirected
 * // 7
 * gi.undirectedOctaves
 * // 1
 * gi.semiSimpleUndirected
 * // 7  -- semiSimple distinguishes between 8 and 1; that's all
 * gi.semiSimpleDirected
 * // 7  -- semiSimple distinguishes between 8 and 1; that's all
 * gi.perfectable
 * // false
 * gi.niceName
 * // "Fourteenth"
 * gi.directedNiceName
 * // "Descending Fourteenth"
 * gi.simpleNiceName
 * // "Seventh"
 * gi.staffDistance
 * // -13
 * gi.mod7inversion
 * // 2  // sevenths invert to seconds
 *
 */
export class GenericInterval extends prebase.ProtoM21Object {
    static get className() { return 'music21.interval.GenericInterval'; }
    value: number;
    directed: number;
    undirected: number;
    direction: number;  // TODO: enum...
    isSkip: boolean;
    isDiatonicStep: boolean;
    isStep: boolean;
    isUnison: boolean;
    simpleUndirected: number;
    undirectedOctaves: number;
    semiSimpleUndirected: number;
    octaves: number;
    simpleDirected: number;
    semiSimpleDirected: number;
    perfectable: boolean;
    niceName: string;
    simpleNiceName: string;
    semiSimpleNiceName: string;
    staffDistance: number;
    mod7inversion: number;
    mod7: number;

    constructor(gi: number) {
        super();
        if (gi === undefined) {
            gi = 1;
        }
        this.value = gi; // todo: convertGeneric() from python
        this.directed = this.value;
        this.undirected = Math.abs(this.value);

        if (this.directed === 1) {
            this.direction = Direction.OBLIQUE;
        } else if (this.directed < 0) {
            this.direction = Direction.DESCENDING;
        } else if (this.directed > 1) {
            this.direction = Direction.ASCENDING;
        }
        // else (raise exception)

        if (this.undirected > 2) {
            this.isSkip = true;
        } else {
            this.isSkip = false;
        }

        if (this.undirected === 2) {
            this.isDiatonicStep = true;
        } else {
            this.isDiatonicStep = false;
        }

        this.isStep = this.isDiatonicStep;

        if (this.undirected === 1) {
            this.isUnison = true;
        } else {
            this.isUnison = false;
        }

        let tempSteps = common.posMod(this.undirected, 7);
        let tempOctaves = Math.floor(this.undirected / 7);
        if (tempSteps === 0) {
            tempOctaves -= 1;
            tempSteps = 7;
        }
        this.simpleUndirected = tempSteps;
        this.undirectedOctaves = tempOctaves;
        if (tempSteps === 1 && tempOctaves >= 1) {
            this.semiSimpleUndirected = 8;
        } else {
            this.semiSimpleUndirected = this.simpleUndirected;
        }

        if (this.direction === Direction.DESCENDING) {
            this.octaves = -1 * tempOctaves;
            if (tempSteps !== 1) {
                this.simpleDirected = -1 * tempSteps;
            } else {
                this.simpleDirected = 1; // no descending unisons...
            }
            this.semiSimpleDirected = -1 * this.semiSimpleUndirected;
        } else {
            this.octaves = tempOctaves;
            this.simpleDirected = tempSteps;
            this.semiSimpleDirected = this.semiSimpleUndirected;
        }
        if (
            this.simpleUndirected === 1
            || this.simpleUndirected === 4
            || this.simpleUndirected === 5
        ) {
            this.perfectable = true;
        } else {
            this.perfectable = false;
        }

        if (this.undirected < MusicOrdinals.length) {
            this.niceName = MusicOrdinals[this.undirected];
        } else {
            this.niceName = this.undirected.toString();
        }

        this.simpleNiceName = MusicOrdinals[this.simpleUndirected];
        this.semiSimpleNiceName
            = MusicOrdinals[this.semiSimpleUndirected];

        if (Math.abs(this.directed) === 1) {
            this.staffDistance = 0;
        } else if (this.directed > 1) {
            this.staffDistance = this.directed - 1;
        } else if (this.directed < -1) {
            this.staffDistance = this.directed + 1;
        }
        // else: raise IntervalException("Non-integer, -1, or 0 not permitted as a diatonic interval")

        // 2 -> 7; 3 -> 6; 8 -> 1 etc.
        this.mod7inversion = 9 - this.semiSimpleUndirected;

        if (this.direction === Direction.DESCENDING) {
            this.mod7 = this.mod7inversion; // see chord.semitonesFromChordStep for usage...
        } else {
            this.mod7 = this.simpleDirected;
        }
    }

    /**
     * Returns a new GenericInterval which is the mod7inversion; 3rds (and 10ths etc.) to 6ths, etc.
     *
     * @returns {music21.interval.GenericInterval}
     */
    complement() {
        return new GenericInterval(this.mod7inversion);
    }

    /**
     * Returns a new GenericInterval which has the opposite direction
     * (descending becomes ascending, etc.)
     *
     * @returns {music21.interval.GenericInterval}
     */
    reverse() {
        if (this.undirected === 1) {
            return new GenericInterval(1);
        } else {
            return new GenericInterval(
                this.undirected * (-1 * this.direction)
            );
        }
    }

    /**
     * Given a specifier, return a new DiatonicInterval with this generic.
     *
     * @param {string|number} specifier - a specifier such as "P", "m", "M", "A", "dd" etc.
     * @returns {music21.interval.DiatonicInterval}
     */
    getDiatonic(specifier: string|number) {
        return new DiatonicInterval(specifier, this);
    }

    /**
     * Transpose a pitch by this generic interval, maintaining accidentals
     *
     * @param {music21.pitch.Pitch} p
     * @returns {music21.pitch.Pitch}
     */
    transposePitch(p: pitch.Pitch): pitch.Pitch {
        const pitch2 = new pitch.Pitch();
        pitch2.step = p.step;
        pitch2.octave = p.octave;

        const oldDiatonicNum = p.diatonicNoteNum;

        const distanceToMove = this.staffDistance;

        // if not reverse...
        const newDiatonicNumber = oldDiatonicNum + distanceToMove;
        const [newStep, newOctave] = convertDiatonicNumberToStep(
            newDiatonicNumber
        );
        pitch2.step = newStep;
        pitch2.octave = newOctave;
        if (p.accidental !== undefined) {
            pitch2.accidental = new pitch.Accidental(p.accidental.name);
        }
        return pitch2;
    }
}

export const IntervalSpecifiersEnum = {
    PERFECT: 1,
    MAJOR: 2,
    MINOR: 3,
    AUGMENTED: 4,
    DIMINISHED: 5,
    DBLAUG: 6,
    DBLDIM: 7,
    TRPAUG: 8,
    TRPDIM: 9,
    QUADAUG: 10,
    QUADDMIN: 11,
};

export const IntervalNiceSpecNames = [
    'ERROR',
    'Perfect',
    'Major',
    'Minor',
    'Augmented',
    'Diminished',
    'Doubly-Augmented',
    'Doubly-Diminished',
    'Triply-Augmented',
    'Triply-Diminished',
    'Quadruply-Augmented',
    'Quadruply-Diminished',
];

export const IntervalPrefixSpecs = [
    undefined,
    'P',
    'M',
    'm',
    'A',
    'd',
    'AA',
    'dd',
    'AAA',
    'ddd',
    'AAAA',
    'dddd',
];

export const IntervalOrderedPerfSpecs = [
    'dddd',
    'ddd',
    'dd',
    'd',
    'P',
    'A',
    'AA',
    'AAA',
    'AAAA',
];

export const IntervalPerfSpecifiers = [
    IntervalSpecifiersEnum.QUADDMIN,
    IntervalSpecifiersEnum.TRPDIM,
    IntervalSpecifiersEnum.DBLDIM,
    IntervalSpecifiersEnum.DIMINISHED,
    IntervalSpecifiersEnum.PERFECT,
    IntervalSpecifiersEnum.AUGMENTED,
    IntervalSpecifiersEnum.DBLAUG,
    IntervalSpecifiersEnum.TRPAUG,
    IntervalSpecifiersEnum.QUADAUG,
];

export const IntervalPerfOffset = 4;

export const IntervalOrderedImperfSpecs = [
    'dddd',
    'ddd',
    'dd',
    'd',
    'm',
    'M',
    'A',
    'AA',
    'AAA',
    'AAAA',
];

export const IntervalSpecifiers = [
    IntervalSpecifiersEnum.QUADDMIN,
    IntervalSpecifiersEnum.TRPDIM,
    IntervalSpecifiersEnum.DBLDIM,
    IntervalSpecifiersEnum.DIMINISHED,
    IntervalSpecifiersEnum.MINOR,
    IntervalSpecifiersEnum.MAJOR,
    IntervalSpecifiersEnum.AUGMENTED,
    IntervalSpecifiersEnum.DBLAUG,
    IntervalSpecifiersEnum.TRPAUG,
    IntervalSpecifiersEnum.QUADAUG,
];
export const IntervalMajOffset = 5;

export const IntervalSemitonesGeneric = {
    1: 0,
    2: 2,
    3: 4,
    4: 5,
    5: 7,
    6: 9,
    7: 11,
};
export const IntervalAdjustPerfect = {
    P: 0,
    A: 1,
    AA: 2,
    AAA: 3,
    AAAA: 4,
    d: -1,
    dd: -2,
    ddd: -3,
    dddd: -4,
}; // offset from Perfect

export const IntervalAdjustImperf = {
    M: 0,
    m: -1,
    A: 1,
    AA: 2,
    AAA: 3,
    AAAA: 4,
    d: -2,
    dd: -3,
    ddd: -4,
    dddd: -5,
}; // offset from major

/**
 * Represents a Diatonic interval.  See example for usage.
 *
 * @class DiatonicInterval
 * @memberof music21.interval
 * @param {string|number|undefined} [specifier='P'] - a specifier such as "P", "d", "m", "M" etc.
 * @param {music21.interval.GenericInterval|number} [generic=1] - a `GenericInterval`
 *              object or a number to be converted to one
 * @example
 * var di = new music21.interval.DiatonicInterval("M", 10);
 * di.generic.isClassOrSubclass('GenericInterval');
 * // true
 * di.specifierAbbreviation;
 * // 'M'
 * di.name;
 * // 'M10'
 * di.direction == music21.interval.Direction.ASCENDING;
 * // true
 * di.niceName
 * // "Major Tenth"
 *
 * // See music21p for more possibilities.
 */
export class DiatonicInterval extends prebase.ProtoM21Object {
    static get className() { return 'music21.interval.DiatonicInterval'; }

    name: string;
    specifier: number;
    generic: GenericInterval;
    direction: number;
    niceName: string;
    simpleName: string;
    simpleNiceName: string;
    semiSimpleName: string;
    semiSimpleNiceName: string;
    directedName: string;
    directedNiceName: string;
    directedSimpleName: string;
    directedSimpleNiceName: string;
    directedSemiSimpleNiceName: string;
    directedSemiSimpleName: string;
    specificName: string;
    perfectable: boolean;
    isDiatonicStep: boolean;
    isStep: boolean;
    isSkip: boolean;
    orderedSpecifierIndex: number;
    invertedOrderedSpecIndex: number;
    invertedOrderedSpecifier: string;  // this is messed up -- should be number...
    mod7inversion: string;

    constructor(specifier: string|number, generic) {
        super();

        if (specifier === undefined) {
            specifier = 'P';
        }
        if (generic === undefined) {
            generic = new GenericInterval(1);
        } else if (typeof generic === 'number') {
            generic = new GenericInterval(generic);
        }

        this.name = '';
        if (typeof specifier === 'number') {
            this.specifier = specifier;
        } else {
            this.specifier = IntervalPrefixSpecs.indexOf(specifier);
            // TODO: convertSpecifier();
        }
        this.generic = generic;

        if (
            generic.undirected !== 1
            || specifier === IntervalSpecifiersEnum.PERFECT
        ) {
            this.direction = generic.direction;
        } else if (
            IntervalPerfSpecifiers.indexOf(this.specifier)
            <= IntervalPerfSpecifiers.indexOf(
                IntervalSpecifiersEnum.DIMINISHED
            )
        ) {
            // diminished unisons -- very controversial
            this.direction = Direction.DESCENDING;
        } else {
            this.direction = Direction.ASCENDING;
        }
        const diatonicDirectionNiceName
            = IntervalDirectionTerms[this.direction + 1];
        this.name
            = IntervalPrefixSpecs[this.specifier]
            + generic.undirected.toString();
        this.niceName
            = IntervalNiceSpecNames[this.specifier]
            + ' '
            + generic.niceName;
        this.simpleName
            = IntervalPrefixSpecs[this.specifier]
            + generic.simpleUndirected.toString();
        this.simpleNiceName
            = IntervalNiceSpecNames[this.specifier]
            + ' '
            + generic.simpleNiceName;
        this.semiSimpleName
            = IntervalPrefixSpecs[this.specifier]
            + generic.semiSimpleUndirected.toString();
        this.semiSimpleNiceName
            = IntervalNiceSpecNames[this.specifier]
            + ' '
            + generic.semiSimpleNiceName;
        this.directedName
            = IntervalPrefixSpecs[this.specifier]
            + generic.directed.toString();
        this.directedNiceName = diatonicDirectionNiceName + ' ' + this.niceName;
        this.directedSimpleName
            = IntervalPrefixSpecs[this.specifier]
            + generic.simpleDirected.toString();
        this.directedSimpleNiceName
            = diatonicDirectionNiceName + ' ' + this.simpleNiceName;
        this.directedSemiSimpleName
            = IntervalPrefixSpecs[this.specifier]
            + generic.semiSimpleDirected.toString();
        this.directedSemiSimpleNiceName
            = diatonicDirectionNiceName + ' ' + this.semiSimpleNiceName;
        this.specificName = IntervalNiceSpecNames[this.specifier];
        this.perfectable = generic.perfectable;
        this.isDiatonicStep = generic.isDiatonicStep;
        this.isStep = generic.isStep;
        this.isSkip = generic.isSkip;

        // generate inversions
        if (this.perfectable) {
            this.orderedSpecifierIndex = IntervalOrderedPerfSpecs.indexOf(
                IntervalPrefixSpecs[this.specifier]
            );
            this.invertedOrderedSpecIndex
                = IntervalOrderedPerfSpecs.length
                - 1
                - this.orderedSpecifierIndex;
            this.invertedOrderedSpecifier
                = IntervalOrderedPerfSpecs[
                    this.invertedOrderedSpecIndex
                ];
        } else {
            this.orderedSpecifierIndex = IntervalOrderedImperfSpecs.indexOf(
                IntervalPrefixSpecs[this.specifier]
            );
            this.invertedOrderedSpecIndex
                = IntervalOrderedImperfSpecs.length
                - 1
                - this.orderedSpecifierIndex;
            this.invertedOrderedSpecifier
                = IntervalOrderedImperfSpecs[
                    this.invertedOrderedSpecIndex
                ];
        }

        this.mod7inversion
            = this.invertedOrderedSpecifier + generic.mod7inversion.toString();
        // if (this.direction == Direction.DESCENDING) {
        //     this.mod7 = this.mod7inversion;
        // } else {
        //    this.mod7 = this.simpleName;
        // }


        // TODO: reverse()
        // TODO: property cents
    }

    /**
     * Returns a ChromaticInterval object of the same size.
     *
     * @returns {music21.interval.ChromaticInterval}
     */
    getChromatic(): ChromaticInterval {
        const octaveOffset = Math.floor(
            Math.abs(this.generic.staffDistance) / 7
        );
        const semitonesStart
            = IntervalSemitonesGeneric[this.generic.simpleUndirected];
        const specName = IntervalPrefixSpecs[this.specifier];

        let semitonesAdjust: number;
        if (this.generic.perfectable) {
            semitonesAdjust = IntervalAdjustPerfect[specName];
        } else {
            semitonesAdjust = IntervalAdjustImperf[specName];
        }

        let semitones = octaveOffset * 12 + semitonesStart + semitonesAdjust;

        // direction should be same as original

        if (this.generic.direction === Direction.DESCENDING) {
            semitones *= -1;
        }
        if (debug) {
            console.log(
                'DiatonicInterval.getChromatic -- octaveOffset: ' + octaveOffset
            );
            console.log(
                'DiatonicInterval.getChromatic -- semitonesStart: '
                    + semitonesStart
            );
            console.log(
                'DiatonicInterval.getChromatic -- specName: ' + specName
            );
            console.log(
                'DiatonicInterval.getChromatic -- semitonesAdjust: '
                    + semitonesAdjust
            );
            console.log(
                'DiatonicInterval.getChromatic -- semitones: ' + semitones
            );
        }
        return new ChromaticInterval(semitones);
    }

    /**
     *
     * @param {music21.pitch.Pitch} p
     * @returns {music21.pitch.Pitch}
     */
    transposePitch(p: pitch.Pitch): pitch.Pitch {
        const fullIntervalObject = new Interval(this, this.getChromatic());
        return fullIntervalObject.transposePitch(p);
    }

    /**
     *
     * @type {string}
     */
    get specifierAbbreviation(): string {
        return IntervalPrefixSpecs[this.specifier];
    }

    /**
     *
     * @returns {number}
     */
    get cents(): number {
        return this.getChromatic().cents;
    }
}

/**
 * @class ChromaticInterval
 * @memberof music21.interval
 * @param {number} value - number of semitones (positive or negative)
 * @property {number} cents
 * @property {number} value
 * @property {number} undirected - absolute value of value
 * @property {number} mod12 - reduction to one octave
 * @property {number} intervalClass - reduction to within a tritone (11 = 1, etc.)
 *
 */
export class ChromaticInterval extends prebase.ProtoM21Object {
    static get className() { return 'music21.interval.ChromaticInterval'; }

    semitones: number;
    cents: number;
    directed: number;
    undirected: number;
    direction: number;
    mod12: number;
    simpleUndirected: number;
    simpleDirected: number;
    intervalClass: number;
    isChromaticStep: boolean;

    constructor(value: number=0) {
        super();

        this.semitones = value;
        this.cents = Math.round(value * 100.0);
        this.directed = value;
        this.undirected = Math.abs(value);

        if (this.directed === 0) {
            this.direction = Direction.OBLIQUE;
        } else if (this.directed === this.undirected) {
            this.direction = Direction.ASCENDING;
        } else {
            this.direction = Direction.DESCENDING;
        }

        this.mod12 = common.posMod(this.semitones, 12);
        this.simpleUndirected = common.posMod(this.undirected, 12);
        if (this.direction === Direction.DESCENDING) {
            this.simpleDirected = -1 * this.simpleUndirected;
        } else {
            this.simpleDirected = this.simpleUndirected;
        }

        this.intervalClass = this.mod12;
        if (this.mod12 > 6) {
            this.intervalClass = 12 - this.mod12;
        }

        if (this.undirected === 1) {
            this.isChromaticStep = true;
        } else {
            this.isChromaticStep = false;
        }
    }

    /**
     *
     * @returns {music21.interval.ChromaticInterval}
     */
    reverse(): ChromaticInterval {
        return new ChromaticInterval(
            this.undirected * (-1 * this.direction)
        );
    }

    //  TODO: this.getDiatonic()

    /**
     * Transposes pitches but does not maintain accidentals, etc.
     *
     * @property {music21.pitch.Pitch} p - pitch to transpose
     * @returns {music21.pitch.Pitch}
     */
    transposePitch(p: pitch.Pitch): pitch.Pitch {
        let useImplicitOctave = false;
        if (p.octave === undefined) {
            // not yet implemented in m21j
            useImplicitOctave = true;
        }
        const pps = p.ps;
        const newPitch = new pitch.Pitch();
        newPitch.ps = pps + this.semitones;
        if (useImplicitOctave) {
            newPitch.octave = undefined;
        }
        return newPitch;
    }
}

export const IntervalStepNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * @function music21.interval.convertDiatonicNumberToStep
 * @memberof music21.interval
 * @param {number} dn - diatonic number, where 29 = C4, C#4 etc.
 * @returns {Array} two element array of {string} stepName and {number} octave
 */
export function convertDiatonicNumberToStep(
    dn: number
): [string, number] {
    let stepNumber;
    let octave;
    if (dn === 0) {
        return ['B', -1];
    } else if (dn > 0) {
        octave = Math.floor((dn - 1) / 7);
        stepNumber = dn - 1 - octave * 7;
    } else {
        // low notes... test, because js(floor) != py(int);
        octave = Math.floor(dn / 7);
        stepNumber = dn - 1 - (octave + 1) * 7;
    }
    const stepName = IntervalStepNames[stepNumber];
    return [stepName, octave];
}

/**
 * This is the main, powerful Interval class.
 *
 * Instantiate with either a string ("M3") or two {@link music21.pitch.Pitch} or two {@link music21.note.Note}
 *
 * See music21p instructions for usage.
 *
 * @class Interval
 * @memberof music21.interval
 * @example
 * var n1 = new music21.note.Note("C4");
 * var n2 = new music21.note.Note("F#5");
 * var iv = new music21.interval.Interval(n1, n2);
 * iv.isConsonant();
 * // false
 * iv.semitones;
 * // 18
 * iv.niceName
 * // "Augmented Eleventh"
 */
export class Interval extends prebase.ProtoM21Object {
    static get className() { return 'music21.interval.Interval'; }
    diatonic: DiatonicInterval;
    generic: GenericInterval;
    chromatic: ChromaticInterval;
    protected _noteStart: note.Note;
    protected _noteEnd: note.Note;
    direction: number;
    specifier: number;
    diatonicType: number;
    name: string;
    niceName: string;
    simpleName: string;
    simpleNiceName: string;
    semiSimpleName: string;
    semiSimpleNiceName: string;
    directedName: string;
    directedNiceName: string;
    directedSimpleName: string;
    directedSimpleNiceName: string;
    isDiatonicStep: boolean;
    isChromaticStep: boolean;
    semitones: number;
    intervalClass: number;
    cents: number;
    isStep: boolean;
    isSkip: boolean;

    constructor(...restArgs) {
        super();
        // todo: allow full range of ways of specifying as in m21p
        let noteStart;
        let noteEnd;
        if (restArgs.length === 1) {
            const arg0 = restArgs[0];
            if (typeof arg0 === 'string') {
                // simple...
                const specifier = arg0.replace(/\d+/, '').replace(/-/, '');
                let generic = parseInt(arg0.replace(/\D+/, ''));
                if (arg0.includes('-')) {
                    generic *= -1;
                }
                const gI = new GenericInterval(generic);
                const dI = new DiatonicInterval(specifier, gI);
                this.diatonic = dI;
                this.chromatic = this.diatonic.getChromatic();
            } else if (arg0.specifier !== undefined) {
                // assume diatonic...
                this.diatonic = arg0;
                this.chromatic = this.diatonic.getChromatic();
            } else {
                console.error('cant parse string arguments to Interval yet');
            }
        } else if (restArgs.length === 2) {
            if (
                restArgs[0].pitch === undefined
                && restArgs[0].diatonicNoteNum === undefined
            ) {
                this.diatonic = restArgs[0];
                this.chromatic = restArgs[1];
            } else {
                let n1 = restArgs[0];
                let n2 = restArgs[1];
                if (n1.classes !== undefined && n1.classes.includes('Pitch')) {
                    const p1 = n1;
                    n1 = new note.Note();
                    n1.pitch = p1;
                }
                if (n2.classes !== undefined && n2.classes.includes('Pitch')) {
                    const p2 = n2;
                    n2 = new note.Note();
                    n2.pitch = p2;
                }
                const gInt = notesToGeneric(n1, n2);
                const cInt = notesToChromatic(n1, n2);

                this.diatonic = intervalsToDiatonic(gInt, cInt);
                this.chromatic = cInt;

                noteStart = n1;
                noteEnd = n2;
            }
        }
        this._noteStart = noteStart;
        this._noteEnd = noteEnd;
        this.reinit();
    }

    /**
     *
     * @returns {music21.interval.Interval}
     */
    get complement() {
        return new Interval(this.diatonic.mod7inversion);
    }

    reinit() {
        this.direction = this.chromatic.direction;
        this.specifier = this.diatonic.specifier;
        this.diatonicType = this.diatonic.specifier;
        // this.specificName = this.diatonic.specificName;
        this.generic = this.diatonic.generic;

        this.name = this.diatonic.name;
        this.niceName = this.diatonic.niceName;
        this.simpleName = this.diatonic.simpleName;
        this.simpleNiceName = this.diatonic.simpleNiceName;
        this.semiSimpleName = this.diatonic.semiSimpleName;
        this.semiSimpleNiceName = this.diatonic.semiSimpleNiceName;

        this.directedName = this.diatonic.directedName;
        this.directedNiceName = this.diatonic.directedNiceName;
        this.directedSimpleName = this.diatonic.directedSimpleName;
        this.directedSimpleNiceName = this.diatonic.directedSimpleNiceName;

        // other names...
        this.isDiatonicStep = this.diatonic.isDiatonicStep;

        this.isChromaticStep = this.chromatic.isChromaticStep;
        this.semitones = this.chromatic.semitones;
        this.intervalClass = this.chromatic.intervalClass;
        this.cents = this.chromatic.cents;
        this.isStep = this.isChromaticStep || this.isDiatonicStep;
        this.isSkip = this.diatonic.isSkip;
    }

    /**
     *
     * @type {music21.note.Note|undefined}
     */
    get noteStart() {
        return this._noteStart;
    }

    set noteStart(n: note.Note) {
        this._noteStart = n;
        const p1 = n.pitch;
        const p2 = this.transposePitch(p1);
        this._noteEnd = n.clone();
        this._noteEnd.pitch = p2;
    }

    /**
     *
     * @type {music21.note.Note|undefined}
     */
    get noteEnd() {
        return this._noteEnd;
    }

    set noteEnd(n) {
        this._noteEnd = n;
        const p1 = n.pitch;
        const p2 = this.transposePitch(p1, {reverse: true});
        this._noteStart = n.clone();
        this._noteStart.pitch = p2;
    }


    /**
     * @returns {Boolean}
     */
    isConsonant() {
        const sn = this.simpleName;
        const consonantNames = ['P5', 'm3', 'M3', 'm6', 'M6', 'P1'];
        if (consonantNames.indexOf(sn) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    //  todo general: microtones
    // noinspection JSUnusedLocalSymbols
    /**
     * TODO: maxAccidental
     *
     * @param {music21.pitch.Pitch} p - pitch to transpose
     * @param {Object} config - configuration
     * @param {boolean} [config.reverse=false] -- reverse direction
     * @param {number} [config.maxAccidental=4] -- maximum accidentals to retain (unused)
     * @returns {music21.pitch.Pitch}
     */
    transposePitch(p, { reverse=false, maxAccidental=4 }={}) {
        /*
        var useImplicitOctave = false;
        if (p.octave === undefined) {
            useImplicitOctave = true;
        }
         */
        const pitch2 = this.diatonic.generic.transposePitch(p);
        pitch2.accidental = undefined;
        // step and octave are right now, but not necessarily accidental
        let halfStepsToFix;
        if (!reverse) {
            halfStepsToFix = this.chromatic.semitones - Math.floor(pitch2.ps - p.ps);
        } else {
            halfStepsToFix = (-1 * this.chromatic.semitones) - Math.floor(pitch2.ps - p.ps);
        }
        if (halfStepsToFix !== 0) {
            pitch2.accidental = new pitch.Accidental(halfStepsToFix);
        }
        if (debug) {
            console.log('Interval.transposePitch -- new step ' + pitch2.step);
            console.log(
                'Interval.transposePitch -- new octave ' + pitch2.octave
            );
            console.log(
                'Interval.transposePitch -- fixing half steps for '
                    + halfStepsToFix
            );
        }
        return pitch2;
    }
}

export function intervalFromGenericAndChromatic(
    gInt,
    cInt
) {
    if (typeof gInt === 'number') {
        gInt = new GenericInterval(gInt);
    }
    if (typeof cInt === 'number') {
        cInt = new ChromaticInterval(cInt);
    }
    const specifier = _getSpecifierFromGenericChromatic(gInt, cInt);
    const dInt = new DiatonicInterval(specifier, gInt);
    return new Interval(dInt, cInt);
}

/**
 * Convert two notes or pitches to a GenericInterval;
 */
export function notesToGeneric(n1, n2) {
    let p1 = n1;
    if (n1.pitch !== undefined) {
        p1 = n1.pitch;
    }
    let p2 = n2;
    if (n2.pitch !== undefined) {
        p2 = n2.pitch;
    }
    const staffDist = p2.diatonicNoteNum - p1.diatonicNoteNum;
    const genDist = convertStaffDistanceToInterval(staffDist);
    return new GenericInterval(genDist);
}

export function convertStaffDistanceToInterval(
    staffDist
) {
    if (staffDist === 0) {
        return 1;
    } else if (staffDist > 0) {
        return staffDist + 1;
    } else {
        return staffDist - 1;
    }
}

export function notesToChromatic(n1, n2) {
    let p1 = n1;
    if (n1.pitch !== undefined) {
        p1 = n1.pitch;
    }
    let p2 = n2;
    if (n2.pitch !== undefined) {
        p2 = n2.pitch;
    }
    return new ChromaticInterval(p2.ps - p1.ps);
}

export function intervalsToDiatonic(gInt, cInt) {
    const specifier = _getSpecifierFromGenericChromatic(gInt, cInt);
    // todo -- convert specifier...
    return new DiatonicInterval(specifier, gInt);
}

export function _getSpecifierFromGenericChromatic(
    gInt,
    cInt
): number {
    const noteVals = [undefined, 0, 2, 4, 5, 7, 9, 11];
    const normalSemis
        = noteVals[gInt.simpleUndirected] + 12 * gInt.undirectedOctaves;
    let theseSemis = 0;
    if (
        gInt.direction !== cInt.direction
        && gInt.direction !== Direction.OBLIQUE
        && cInt.direction !== Direction.OBLIQUE
    ) {
        // intervals like d2 and dd2 etc. (the last test doesn't matter,
        // since -1 * 0 === 0, but in theory it should be there)
        theseSemis = -1 * cInt.undirected;
    } else if (gInt.undirected === 1) {
        theseSemis = cInt.directed; // matters for unison
    } else {
        // all normal intervals
        theseSemis = cInt.undirected;
    }
    const semisRounded = Math.round(theseSemis);
    let specifier: number;
    if (gInt.perfectable) {
        specifier
            = IntervalPerfSpecifiers[
                IntervalPerfOffset + semisRounded - normalSemis
            ];
    } else {
        specifier
            = IntervalSpecifiers[
                IntervalMajOffset + semisRounded - normalSemis
            ];
    }
    return specifier;
}

/**
 *
 * @param {music21.interval.Interval[]} intervalList
 * @returns {music21.interval.Interval}
 */
export function add(intervalList) {
    const p1 = new pitch.Pitch('C4');
    let p2 = new pitch.Pitch('C4');
    for (const i of intervalList) {
        p2 = i.transposePitch(p2);
    }
    return new Interval(p1, p2);
}
