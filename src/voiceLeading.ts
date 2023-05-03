/**
 * music21j -- Javascript reimplementation of Core music21 features.
 * music21/voiceLeading -- voiceLeading objects
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21, Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 */

import * as interval from './interval';
import * as key from './key';
import * as note from './note';
import type * as pitch from './pitch';

import { Music21Object } from './base';

// imports just for type checking
import { ConcreteScale } from './scale';


const intervalCache = [];

export const MotionType = {
    antiParallel: 'Anti-Parallel',
    contrary: 'Contrary',
    noMotion: 'No Motion',
    oblique: 'Oblique',
    parallel: 'Parallel',
    similar: 'Similar',
};

export class VoiceLeadingQuartet extends Music21Object {
    static get className() { return 'music21.voiceLeading.VoiceLeadingQuartet'; }

    unison: interval.Interval;
    fifth: interval.Interval;
    octave: interval.Interval;
    protected _v1n1: note.Note;
    protected _v1n2: note.Note;
    protected _v2n1: note.Note;
    protected _v2n2: note.Note;
    vIntervals: interval.Interval[];
    hIntervals: interval.Interval[];
    _key: key.Key;

    constructor(
        v1n1?: note.Note,
        v1n2?: note.Note,
        v2n1?: note.Note,
        v2n2?: note.Note,
        analyticKey?: key.Key
    ) {
        super();
        if (!intervalCache.length) {
            intervalCache.push(new interval.Interval('P1'));
            intervalCache.push(new interval.Interval('P5'));
            intervalCache.push(new interval.Interval('P8'));
        }
        this.unison = intervalCache[0];
        this.fifth = intervalCache[1];
        this.octave = intervalCache[2];

        this._v1n1 = undefined;
        this._v1n2 = undefined;
        this._v2n1 = undefined;
        this._v2n2 = undefined;

        this.v1n1 = v1n1;
        this.v1n2 = v1n2;
        this.v2n1 = v2n1;
        this.v2n2 = v2n2;

        this.vIntervals = [];
        this.hIntervals = [];

        this._key = undefined;
        if (analyticKey !== undefined) {
            this.key = analyticKey;
        }
        if (
            v1n1 !== undefined
            && v1n2 !== undefined
            && v2n1 !== undefined
            && v2n2 !== undefined
        ) {
            this._findIntervals();
        }
    }

    _setVoiceNote(
        value: note.Note|pitch.Pitch|string|undefined,
        which: '_v1n1'|'_v1n2'|'_v2n1'|'_v2n2'
    ): void {
        if (value === undefined) {
            (this as any)[which] = value;
        } else if (typeof value === 'string') {
            this[which] = new note.Note(value);
        } else if (value instanceof note.Note) {
            this[which] = value;
        } else {
            const n = new note.Note(value.nameWithOctave);
            n.duration.quarterLength = 0.0;
            this[which] = n;
        }
    }

    get v1n1(): note.Note {
        return this._v1n1;
    }

    set v1n1(value: note.Note) {
        this._setVoiceNote(value, '_v1n1');
    }

    get v1n2(): note.Note {
        return this._v1n2;
    }

    set v1n2(value: note.Note) {
        this._setVoiceNote(value, '_v1n2');
    }

    get v2n1(): note.Note {
        return this._v2n1;
    }

    set v2n1(value: note.Note) {
        this._setVoiceNote(value, '_v2n1');
    }

    get v2n2(): note.Note {
        return this._v2n2;
    }

    set v2n2(value: note.Note) {
        this._setVoiceNote(value, '_v2n2');
    }

    get key(): key.Key {
        return this._key;
    }

    // turning off string entry because of Typescript deficiency
    set key(keyValue: key.Key) {
        // if (typeof keyValue === 'string') {
        //     keyValue = new key.Key(
        //         key.convertKeyStringToMusic21KeyString(keyValue)
        //     );
        // }
        this._key = keyValue;
    }

    protected _findIntervals(): void {
        this.vIntervals = [
            new interval.Interval(this.v1n1, this.v2n1),
            new interval.Interval(this.v1n2, this.v2n2),
        ];
        this.hIntervals = [
            new interval.Interval(this.v1n1, this.v1n2),
            new interval.Interval(this.v2n1, this.v2n2),
        ];
    }

    motionType() {
        if (this.obliqueMotion()) {
            return MotionType.oblique;
        } else if (this.parallelMotion()) {
            return MotionType.parallel;
        } else if (this.similarMotion()) {
            return MotionType.similar;
        } else if (this.contraryMotion()) {
            return MotionType.contrary;
        } else if (this.antiParallelMotion()) {
            return MotionType.antiParallel;
        } else if (this.noMotion()) {
            return MotionType.noMotion;
        }
        return undefined;
    }

    noMotion(): boolean {
        for (const iV of this.hIntervals) {
            if (iV.name !== 'P1') {
                return false;
            }
        }
        return true;
    }

    obliqueMotion(): boolean {
        if (this.noMotion()) {
            return false;
        }

        for (const iH of this.hIntervals) {
            if (iH.name === 'P1') {
                return true;
            }
        }
        return false;
    }

    similarMotion(): boolean {
        if (this.noMotion()) {
            return false;
        }

        if (this.hIntervals[0].direction === this.hIntervals[1].direction) {
            return true;
        } else {
            return false;
        }
    }

    parallelMotion(requiredInterval: interval.Interval|string|undefined=undefined): boolean {
        if (!this.similarMotion()) {
            return false;
        }
        if (
            this.vIntervals[0].directedSimpleName
            !== this.vIntervals[1].directedSimpleName
        ) {
            return false;
        }
        if (requiredInterval === undefined) {
            return true;
        }
        if (typeof requiredInterval === 'string') {
            requiredInterval = new interval.Interval(requiredInterval);
        }
        if (this.vIntervals[0].simpleName === requiredInterval.simpleName) {
            return true;
        } else {
            return false;
        }
    }

    contraryMotion(): boolean {
        if (this.noMotion()) {
            return false;
        }
        if (this.obliqueMotion()) {
            return false;
        }
        if (this.hIntervals[0].direction === this.hIntervals[1].direction) {
            return false;
        } else {
            return true;
        }
    }

    outwardContraryMotion(): boolean {
        return (
            this.contraryMotion()
            && this.hIntervals[0].direction === interval.Direction.ASCENDING
        );
    }

    inwardContraryMotion(): boolean {
        return (
            this.contraryMotion()
            && this.hIntervals[0].direction === interval.Direction.DESCENDING
        );
    }

    antiParallelMotion(simpleName: interval.Interval|string|undefined=undefined): boolean {
        if (!this.contraryMotion()) {
            return false;
        }
        if (this.vIntervals[0].simpleName !== this.vIntervals[1].simpleName) {
            return false;
        }
        if (simpleName === undefined) {
            return true;
        }
        if (typeof simpleName === 'string') {
            if (this.vIntervals[0].simpleName === simpleName) {
                return true;
            } else {
                return false;
            }
        } else if (this.vIntervals[0].simpleName === simpleName.simpleName) {
            return true;
        } else {
            return false;
        }
    }

    parallelInterval(thisInterval: interval.Interval|string): boolean {
        if (!(this.parallelMotion() || this.antiParallelMotion())) {
            return false;
        }
        if (typeof thisInterval === 'string') {
            thisInterval = new interval.Interval(thisInterval);
        }

        if (this.vIntervals[0].semiSimpleName === thisInterval.semiSimpleName) {
            return true;
        } else {
            return false;
        }
    }

    parallelFifth(): boolean {
        return this.parallelInterval(this.fifth);
    }

    parallelOctave(): boolean {
        return this.parallelInterval(this.octave);
    }

    parallelUnison(): boolean {
        return this.parallelInterval(this.unison);
    }

    parallelUnisonOrOctave(): boolean {
        return this.parallelUnison() || this.parallelOctave();
    }

    hiddenInterval(thisInterval: interval.Interval|string): boolean {
        if (this.parallelMotion()) {
            return false;
        }
        if (!this.similarMotion()) {
            return false;
        }

        if (typeof thisInterval === 'string') {
            thisInterval = new interval.Interval(thisInterval);
        }
        if (this.vIntervals[1].simpleName === thisInterval.simpleName) {
            return true;
        } else {
            return false;
        }
    }

    hiddenFifth(): boolean {
        return this.hiddenInterval(this.fifth);
    }

    hiddenOctave(): boolean {
        return this.hiddenInterval(this.octave);
    }

    // True if either note in voice 1 is lower than the corresponding voice 2 note
    voiceCrossing(): boolean {
        return (
            this.v1n1.pitch.ps < this.v2n1.pitch.ps
            || this.v1n2.pitch.ps < this.v2n2.pitch.ps
        );
    }

    voiceOverlap(): boolean {
        return (
            this.v1n2.pitch.ps < this.v2n1.pitch.ps
            || this.v2n2.pitch.ps > this.v1n1.pitch.ps
        );
    }

    /**
     * isProperResolution - Checks whether the voice-leading quartet resolves correctly according to standard
     *         counterpoint rules. If the first harmony is dissonant (d5, A4, or m7) it checks
     *         that these are correctly resolved. If the first harmony is consonant, True is returned.
     *
     *         The key parameter should be specified to check for motion in the bass from specific
     *         note degrees. If it is not set, then no checking for scale degrees takes place.
     *
     *         Diminished Fifth: in by contrary motion to a third, with 7 resolving up to 1 in the bass
     *         Augmented Fourth: out by contrary motion to a sixth, with chordal seventh resolving
     *         down to a third in the bass.
     *         Minor Seventh: Resolves to a third with a leap form 5 to 1 in the bass
     *
     * @return {boolean}  true if proper or rules do not apply; false if improper
     */

    isProperResolution(): boolean {
        if (this.noMotion()) {
            return true;
        }
        let scale;
        let n1degree;
        let n2degree;
        if (this.key !== undefined) {
            scale = this.key.getScale();
            n1degree = scale.getScaleDegreeFromPitch(this.v2n1);
            n2degree = scale.getScaleDegreeFromPitch(this.v2n2);
        }

        // catches case of #7 in minor
        if (
            this.key !== undefined
            && this.key.mode === 'minor'
            && (n1degree === undefined || n2degree === undefined)
        ) {
            const scale2 = <ConcreteScale> this.key.getScale('melodic-minor'); // gets ascending form
            if (n1degree === undefined) {
                n1degree = scale2.getScaleDegreeFromPitch(this.v2n1);
            }
            if (n2degree === undefined) {
                n2degree = scale2.getScaleDegreeFromPitch(this.v2n2);
            }
        }

        const firstHarmony = this.vIntervals[0].simpleName;
        const secondHarmony = this.vIntervals[1].generic.simpleUndirected;

        if (firstHarmony === 'P4') {
            if (this.v1n1.pitch.ps >= this.v1n2.pitch.ps) {
                return true;
            } else {
                return false;
            }
        } else if (firstHarmony === 'd5') {
            if (scale !== undefined && n1degree !== 7) {
                return true;
            }
            if (scale !== undefined && n2degree !== 1) {
                return false;
            }
            return this.inwardContraryMotion() && secondHarmony === 3;
        } else if (firstHarmony === 'A4') {
            if (scale !== undefined && n1degree !== 4) {
                return true;
            }
            if (scale !== undefined && n2degree !== 3) {
                return false;
            }
            return this.outwardContraryMotion() && secondHarmony === 6;
        } else if (firstHarmony === 'm7') {
            if (scale !== undefined && n1degree !== 5) {
                return true;
            }
            if (scale !== undefined && n2degree !== 1) {
                return false;
            }
            return secondHarmony === 3;
        } else {
            return true;
        }
    }
}
