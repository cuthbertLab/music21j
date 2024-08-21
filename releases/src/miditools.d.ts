/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/miditools -- A collection of tools for midi.
 *
 * Copyright (c) 2014-19, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 * @author Michael Scott Asato Cuthbert
 *
 * A collection of tools for midi. See the namespace.
 *
 * Module that holds **music21j** tools for connecting with MIDI.js and somewhat with the
 * events from the Jazz plugin or the WebMIDI protocol.
 */
import * as MIDI from 'midicube';
import '../css/midiPlayer.css';
import * as chord from './chord';
import * as instrument from './instrument';
import * as note from './note';
import type * as tempo from './tempo';
export interface CallbackInterface {
    raw: (t: any, a: any, b: any, c: any) => Event;
    general: Function | Function[];
    sendOutChord: Function;
}
declare class _ConfigSingletonClass {
    /**
     * Number of octaves to transpose all incoming midi signals
     */
    transposeOctave: number;
    /**
     * How long to wait in milliseconds before deciding
     * that a note belongs to another chord. Default 100ms
     */
    maxDelay: number;
    /**
     * At what time (in ms since Epoch) the chord started.
     */
    heldChordTime: number;
    /**
     * An Array (or undefined) of currently held Notes that have not been sent out yet.
     */
    heldChordNotes: any[];
    /**
     * When, in MS since Jan 1, 1970, was the last {@link note.Note} played.
     * Defaults to the time that the module was loaded.
     */
    timeOfLastNote: number;
    /**
     * The last Note or Chord to be sent out from miditools.  This is an important semi-global
     * attribute, since the last element may need to be quantized by quantizeLastNote() to
     * determine its length, since the note may need to be placed into a staff before its total
     * length can be determined.
     */
    lastElement: chord.Chord | note.Note;
    protected _baseTempo: number;
    /**
     * Assign (or query) a Metronome object to run all timing information.
     */
    metronome: tempo.Metronome;
    get tempo(): number;
    set tempo(t: number);
}
export declare const config: _ConfigSingletonClass;
/**
 * @param {number} t - timing information
 * @param {number} a - midi data 1 (N.B. a >> 4 = midiCommand )
 * @param {number} b - midi data 2
 * @param {number} c - midi data 3
 */
export declare class Event {
    timing: number;
    data1: number;
    data2: number;
    data3: number;
    midiCommand: number;
    noteOff: boolean;
    noteOn: boolean;
    midiNote: number;
    velocity: number;
    constructor(t: any, a: any, b: any, c: any);
    /**
     * Calls MIDI.noteOn or MIDI.noteOff for the note
     * represented by the Event (if appropriate)
     */
    sendToMIDIjs(): void;
    /**
     * Makes a {@link note.Note} object from the event's midiNote number.
     *
     * @returns {note.Note} - the {@link note.Note} object represented by Event.midiNote
     */
    music21Note(): note.Note;
}
/**
 * a mapping of soundfont text names to true, false, or "loading".
 */
export declare const loadedSoundfonts: {};
/**
 *  Clears chords that are older than miditools.heldChordTime
 *
 *  Runs a setTimeout on itself.
 *  Calls miditools.sendOutChord
 */
export declare function clearOldChords(): void;
/**
 *  Take a series of jEvent noteOn objects and convert them to a single Chord object
 *  so long as they are all sounded within miditools.maxDelay milliseconds of each other.
 *  this method stores notes in miditools.heldChordNotes (Array).
 */
export declare function makeChords(jEvent: Event): void;
/**
 * Take the list of Notes and makes a chord out of it, if appropriate and call
 * music21.miditools.callbacks.sendOutChord callback with the Chord or Note as a parameter.
 */
export declare function sendOutChord(chordNoteList: note.Note[]): note.Note | chord.Chord;
/**
 * Quantizes the lastElement (passed in) or music21.miditools.lastElement.
 *
 * returns the same note.Note object passed in with
 * duration quantized
 */
export declare function quantizeLastNote(lastElement?: note.GeneralNote): note.GeneralNote | undefined;
/**
 * Callback to midiEvent.sendToMIDIjs.
 *
 * sends a MIDIEvent to midicube
 */
export declare const sendToMIDIjs: (midiEvent: Event) => void;
/**
 * Called after a soundfont has been loaded. The callback is better to be specified elsewhere
 * rather than overriding this important method.
 *
 * soundfont -- The name of the soundfont that was just loaded
 * callback -- A function to be called after the soundfont is loaded.
 */
export declare function postLoadCallback(soundfont: string, callback?: (instrumentObj?: instrument.Instrument) => any): void;
/**
 * method to load soundfonts while waiting for other processes that need them
 * to load first.
 *
 * @param {string} soundfont The name of the soundfont that was just loaded
 * @param {function} [callback] A function to be called after the soundfont is loaded.
 * @example
 * s = new music21.stream.Stream();
 * music21.miditools.loadSoundfont(
 *     'clarinet',
 *     function(i) {
 *         console.log('instrument object', i, 'loaded');
 *         s.instrument = i;
 * });
 */
export declare function loadSoundfont(soundfont: string, callback?: (instrumentObj?: instrument.Instrument) => any): void;
/**
 * MidiPlayer -- an embedded midi player including the ability to create a
 * playback device.
 */
export declare class MidiPlayer {
    player: MIDI.Player;
    /**
     * playback speed scaling (1=default)
     */
    speed: number;
    playDiv: HTMLElement;
    state: string;
    constructor();
    addPlayer(where: HTMLElement): HTMLElement;
    stopButton(): void;
    playPng(): string;
    pausePng(): string;
    stopPng(): string;
    pausePlayStop(stop?: string): void;
    base64Load(b64data: any): void;
    songFinished(): void;
    fileLoaded(): void;
    startAndUpdate(): void;
    updatePlaying(): void;
}
/**
 * callbacks is an object with three keys:
 *
 * - raw: function (t, a, b,c) to call when any midi event arrives.
 *     Default: `function (t, a, b, c) { return new miditools.Event(t, a, b, c); }`
 * - general: function ( miditools.Event() ) to call when an Event object
 *     has been created. Default:
 *     `[miditools.sendToMIDIjs, miditools.quantizeLastNote]`
 * - sendOutChord: function (note.Note[]) to call
 *     when a sufficient time has passed to build a chord from input.
 *     Default: empty function.
 *
 * At present, only "general" can take an Array of event listening functions,
 * but I hope to change that for sendOutChord also.
 *
 * "general" is usually the callback list to play around with.
 */
export declare const callbacks: CallbackInterface;
export declare const callBacks: CallbackInterface;
export {};
//# sourceMappingURL=miditools.d.ts.map