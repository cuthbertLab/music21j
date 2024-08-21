/**
 * music21j -- Javascript reimplementation of Core music21 features.
 * music21/voiceLeading -- voiceLeading objects
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21, Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 */
import * as interval from './interval';
import * as key from './key';
import * as note from './note';
import type * as pitch from './pitch';
import { Music21Object } from './base';
export declare const MotionType: {
    antiParallel: string;
    contrary: string;
    noMotion: string;
    oblique: string;
    parallel: string;
    similar: string;
};
export declare class VoiceLeadingQuartet extends Music21Object {
    static get className(): string;
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
    constructor(v1n1?: note.Note, v1n2?: note.Note, v2n1?: note.Note, v2n2?: note.Note, analyticKey?: key.Key);
    _setVoiceNote(value: note.Note | pitch.Pitch | string | undefined, which: '_v1n1' | '_v1n2' | '_v2n1' | '_v2n2'): void;
    get v1n1(): note.Note;
    set v1n1(value: note.Note);
    get v1n2(): note.Note;
    set v1n2(value: note.Note);
    get v2n1(): note.Note;
    set v2n1(value: note.Note);
    get v2n2(): note.Note;
    set v2n2(value: note.Note);
    get key(): key.Key;
    set key(keyValue: key.Key);
    protected _findIntervals(): void;
    motionType(): string;
    noMotion(): boolean;
    obliqueMotion(): boolean;
    similarMotion(): boolean;
    parallelMotion(requiredInterval?: interval.Interval | string | undefined): boolean;
    contraryMotion(): boolean;
    outwardContraryMotion(): boolean;
    inwardContraryMotion(): boolean;
    antiParallelMotion(simpleName?: interval.Interval | string | undefined): boolean;
    parallelInterval(thisInterval: interval.Interval | string): boolean;
    parallelFifth(): boolean;
    parallelOctave(): boolean;
    parallelUnison(): boolean;
    parallelUnisonOrOctave(): boolean;
    hiddenInterval(thisInterval: interval.Interval | string): boolean;
    hiddenFifth(): boolean;
    hiddenOctave(): boolean;
    voiceCrossing(): boolean;
    voiceOverlap(): boolean;
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
    isProperResolution(): boolean;
}
//# sourceMappingURL=voiceLeading.d.ts.map