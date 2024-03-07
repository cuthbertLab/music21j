/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/instrument -- instrument objects
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 */
import * as base from './base';
import type * as interval from './interval';
export declare const global_usedChannels: number[];
export declare const maxMidi: number;
interface InstrumentFileInfo {
    fn: string;
    name: string;
    midiNumber: number;
}
export declare const info: InstrumentFileInfo[];
/**
 * Represents an instrument.  instrumentNames are found in the ext/soundfonts directory
 *
 * See music21.miditools and esp. `loadSoundfont` for a way of loading soundfonts into
 * instruments.
 *
 * @param {string} instrumentName
 * @property {string|undefined} partId
 * @property {string|undefined} partName
 * @property {string|undefined} partAbbreviation
 * @property {string|undefined} instrumentId
 * @property {string|undefined} instrumentName
 * @property {string|undefined} instrumentAbbreviation
 * @property {int|undefined} midiProgram
 * @property {int|undefined} midiChannel
 * @property {int|undefined} lowestNote
 * @property {int|undefined} highestNote
 * @property {Boolean} inGMPercMap=false
 * @property {string|undefined} soundfontFn
 * @property {string|undefined} oggSoundfont - url of oggSoundfont for this instrument
 * @property {string|undefined} mp3Soundfont - url of mp3Soundfont for this instrument
 */
export declare class Instrument extends base.Music21Object {
    static get className(): string;
    partId: any;
    partName: any;
    partAbbreviation: any;
    instrumentId: any;
    instrumentName: string;
    instrumentAbbreviation: any;
    midiProgram: any;
    _midiChannel: any;
    lowestNote: any;
    highestNote: any;
    transposition: interval.Interval;
    inGMPercMap: boolean;
    soundfontFn: any;
    constructor(instrumentName?: string);
    /**
     * Assign an instrument to an unused midi channel.
     *
     * Will use the global list of used channels (`music21.instrument.Instrument.usedChannels`)
     * if not given.  Assigns up to `music21.instrument.maxMidi` channels (16)
     * Skips 10 unless this.inGMPercMap is true
     */
    autoAssignMidiChannel(usedChannels?: number[]): number;
    get oggSoundfont(): string;
    get mp3Soundfont(): string;
    get midiChannel(): any;
    set midiChannel(ch: any);
}
/**
 * Find information for a given instrument (by filename or name)
 * and load it into an instrument object.
 *
 * fn - name or filename of instrument
 * [inst] - instrument object to load into
 */
export declare function find(fn: string, inst?: Instrument): Instrument;
export {};
//# sourceMappingURL=instrument.d.ts.map