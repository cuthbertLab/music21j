import { interval } from './interval.js';
import { key } from './key.js';

import { Music21Object } from './base.js';

const intervalCache = [];

const MotionType = {
    antiParallel: 'Anti-Parallel',
    contrary: 'Contrary',
    noMotion: 'No Motion',
    oblique: 'Oblique',
    parallel: 'Parallel',
    similar: 'Similar',
};

class VoiceLeadingQuartet extends Music21Object {
    constructor(v1n1, v1n2, v2n1, v2n2, analyticKey) {
        super();
        this.classes.push('VoiceLeadingQuartet');
        if (!intervalCache.length) {
            intervalCache.push(new interval.Interval('P1'));
            intervalCache.push(new interval.Interval('P5'));
            intervalCache.push(new interval.Interval('P8'));
        }
        this.unison = intervalCache[0];
        this.fifth = intervalCache[1];
        this.octave = intervalCache[2];

        // this._v1n1 = undefined;
        // this._v1n2 = undefined;
        // this._v2n1 = undefined;
        // this._v2n2 = undefined;

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
    get key() {
        return this._key;
    }
    set key(keyValue) {
        if (typeof keyValue === 'string') {
            keyValue = new key.Key(
                key.convertKeyStringToMusic21KeyString(keyValue)
            );
        }
        this._key = keyValue;
    }

    _findIntervals() {
        this.vIntervals.push(new interval.Interval(this.v1n1, this.v2n1));
        this.vIntervals.push(new interval.Interval(this.v1n2, this.v2n2));
        this.hIntervals.push(new interval.Interval(this.v1n1, this.v1n2));
        this.hIntervals.push(new interval.Interval(this.v2n1, this.v2n2));
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

    noMotion() {
        for (const iV of this.hIntervals) {
            if (iV.name !== 'P1') {
                return false;
            }
        }
        return true;
    }

    obliqueMotion() {
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

    similarMotion() {
        if (this.noMotion()) {
            return false;
        }

        if (this.hIntervals[0].direction === this.hIntervals[1].direction) {
            return true;
        } else {
            return false;
        }
    }

    parallelMotion(requiredInterval) {
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

    contraryMotion() {
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

    outwardContraryMotion() {
        return (
            this.contraryMotion()
            && this.hIntervals[0].direction === interval.Direction.ASCENDING
        );
    }

    inwardContraryMotion() {
        return (
            this.contraryMotion()
            && this.hIntervals[0].direction === interval.Direction.DESCENDING
        );
    }

    antiParallelMotion(simpleName) {
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

    parallelInterval(thisInterval) {
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

    parallelFifth() {
        return this.parallelInterval(this.fifth);
    }

    parallelOctave() {
        return this.parallelInterval(this.octave);
    }

    parallelUnison() {
        return this.parallelInterval(this.unison);
    }

    parallelUnisonOrOctave() {
        return this.parallelUnison() || this.parallelOctave();
    }

    hiddenInterval(thisInterval) {
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

    hiddenFifth() {
        return this.hiddenInterval(this.fifth);
    }

    hiddenOctave() {
        return this.hiddenInterval(this.octave);
    }
}

export const voiceLeading = {
    VoiceLeadingQuartet,
};
