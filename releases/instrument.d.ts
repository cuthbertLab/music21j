/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/instrument -- instrument objects
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * Instrument module, see {@link music21.instrument}
 * Looking for the {@link music21.instrument.Instrument} object? :-)
 *
 * @exports music21/instrument
 *
 * @namespace music21.instrument
 * @memberof music21
 * @requires music21/base
 */
import * as base from './base';
export declare const global_usedChannels: number[];
export declare const maxMidi: number;
/**
 *
 * @type {Array<{fn: string, name: string, midiNumber: number}>}
 */
export declare const info: {
    fn: string;
    name: string;
    midiNumber: number;
}[];
/**
 * Represents an instrument.  instrumentNames are found in the ext/soundfonts directory
 *
 * See {@link music21.miditools} and esp. `loadSoundfont` for a way of loading soundfonts into
 * instruments.
 *
 * @class Instrument
 * @memberof music21.instrument
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
 * @property {music21.interval.Interval|undefined} transposition
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
    transpostion: any;
    inGMPercMap: boolean;
    soundfontFn: any;
    constructor(instrumentName?: string);
    /**
     * Assign an instrument to an unused midi channel.
     *
     * Will use the global list of used channels (`music21.instrument.Instrument.usedChannels`)
     * if not given.  Assigns up to `music21.instrument.maxMidi` channels (16)
     * Skips 10 unless this.inGMPercMap is true
     *
     * @param {int[]} [usedChannels]
     * @returns {number|undefined}
     */
    autoAssignMidiChannel(usedChannels?: any): number;
    get oggSoundfont(): string;
    get mp3Soundfont(): string;
    get midiChannel(): any;
    set midiChannel(ch: any);
}
/**
 * Find information for a given instrument (by filename or name)
 * and load it into an instrument object.
 *
 * @function music21.instrument.find
 * @memberof music21.instrument
 * @param {string} fn - name or filename of instrument
 * @param {music21.instrument.Instrument} [inst] - instrument object to load into
 * @returns {music21.instrument.Instrument|undefined}
 */
export declare function find(fn: any, inst?: any): any;
//# sourceMappingURL=instrument.d.ts.map