declare module 'music21j/main' {
  /**!
   * **music21j**: Javascript reimplementation of Core music21 features.
   *
   * See http://web.mit.edu/music21/ for more details.
   *
   * Copyright (c) 2013-20, Michael Scott Cuthbert and cuthbertLab
   * Released under a BSD-3-clause license
   *
   */
  /**
   *
   * Based on music21, Copyright (c) 2006-20, Michael Scott Cuthbert and cuthbertLab
   * The plan is to implement all core music21 features as Javascript and to expose
   * more sophisticated features via server-side connections to remote servers running the
   * python music21 (music21p).
   *
   * Requires an ECMAScript 5 compatible browser w/ SVG and Canvas. IE 11 or any recent
   * version of Firefox, Safari, Edge,  Chrome, etc. will do.
   *
   * All interfaces are alpha and may change radically from day to day and release to release.
   * Do not use this in production code yet.
   *
   * music21j acknowledges VexFlow, MIDI.js in particular for their great efforts without which
   * this module would not be possible.
   *
   * @namespace music21
   * @exports music21
   */
  import 'regenerator-runtime/runtime';
  import 'jquery-ui-bundle';
  import * as exceptions21 from 'music21j/music21/exceptions21';
  import * as prebase from 'music21j/music21/prebase';
  import * as base from 'music21j/music21/base';
  import * as common from 'music21j/music21/common';
  import * as articulations from 'music21j/music21/articulations';
  import * as audioRecording from 'music21j/music21/audioRecording';
  import * as audioSearch from 'music21j/music21/audioSearch';
  import * as bar from 'music21j/music21/bar';
  import * as beam from 'music21j/music21/beam';
  import * as chord from 'music21j/music21/chord';
  import * as clef from 'music21j/music21/clef';
  import * as converter from 'music21j/music21/converter';
  import * as derivation from 'music21j/music21/derivation';
  import * as duration from 'music21j/music21/duration';
  import * as dynamics from 'music21j/music21/dynamics';
  import * as editorial from 'music21j/music21/editorial';
  import * as expressions from 'music21j/music21/expressions';
  import * as figuredBass from 'music21j/music21/figuredBass';
  import * as fromPython from 'music21j/music21/fromPython';
  import * as harmony from 'music21j/music21/harmony';
  import * as instrument from 'music21j/music21/instrument';
  import * as interval from 'music21j/music21/interval';
  import * as key from 'music21j/music21/key';
  import * as keyboard from 'music21j/music21/keyboard';
  import * as layout from 'music21j/music21/layout';
  import * as meter from 'music21j/music21/meter';
  import * as miditools from 'music21j/music21/miditools';
  import * as musicxml from 'music21j/music21/musicxml';
  import * as note from 'music21j/music21/note';
  import * as parseLoader from 'music21j/music21/parseLoader';
  import * as pitch from 'music21j/music21/pitch';
  import * as renderOptions from 'music21j/music21/renderOptions';
  import * as roman from 'music21j/music21/roman';
  import * as scale from 'music21j/music21/scale';
  import * as sites from 'music21j/music21/sites';
  import * as stream from 'music21j/music21/stream';
  import * as svgs from 'music21j/music21/svgs';
  import * as tempo from 'music21j/music21/tempo';
  import * as tie from 'music21j/music21/tie';
  import * as tinyNotation from 'music21j/music21/tinyNotation';
  import * as vfShow from 'music21j/music21/vfShow';
  import * as voiceLeading from 'music21j/music21/voiceLeading';
  import * as webmidi from 'music21j/music21/webmidi';
  const music21: {
      MIDI: any;
      Vex: any;
      exceptions21: typeof exceptions21;
      base: typeof base;
      prebase: typeof prebase;
      common: typeof common;
      debug: boolean;
      articulations: typeof articulations;
      audioRecording: typeof audioRecording;
      audioSearch: typeof audioSearch;
      bar: typeof bar;
      beam: typeof beam;
      chord: typeof chord;
      chordTables: typeof chord.chordTables;
      clef: typeof clef;
      converter: typeof converter;
      derivation: typeof derivation;
      duration: typeof duration;
      dynamics: typeof dynamics;
      editorial: typeof editorial;
      expressions: typeof expressions;
      figuredBass: typeof figuredBass;
      fromPython: typeof fromPython;
      harmony: typeof harmony;
      instrument: typeof instrument;
      interval: typeof interval;
      key: typeof key;
      keyboard: typeof keyboard;
      layout: typeof layout;
      meter: typeof meter;
      miditools: typeof miditools;
      musicxml: typeof musicxml;
      note: typeof note;
      parseLoader: typeof parseLoader;
      pitch: typeof pitch;
      renderOptions: typeof renderOptions;
      roman: typeof roman;
      scale: typeof scale;
      sites: typeof sites;
      stream: typeof stream;
      svgs: typeof svgs;
      tempo: typeof tempo;
      tie: typeof tie;
      tinyNotation: typeof tinyNotation;
      vfShow: typeof vfShow;
      voiceLeading: typeof voiceLeading;
      webmidi: typeof webmidi;
  };
  export const VERSION = "0.11.7";
  export default music21;

}
declare module 'music21j/music21/articulations' {
  /**
   * articulations module. See {@link music21.articulations} namespace
   *
   * @namespace music21.articulations
   * @memberof music21
   * @requires music21/prebase
   * @requires vexflow
   * @requires music21/common
   */
  import Vex from 'vexflow';
  import * as prebase from 'music21j/music21/prebase';
  export enum ArticulationPlacement {
      ABOVE = "above",
      BELOW = "below",
      LEFT = "left",
      RIGHT = "right",
      STEM_SIDE = "stemSide",
      NOTE_SIDE = "noteSide"
  }
  export const ArticulationPlacementToVexFlowModifierPosition: Map<ArticulationPlacement, any>;
  export interface VexflowArticulationParams {
      stemDirection?: string;
  }
  /**
   * This works the same for music21 Articulations and Expressions
   */
  export function setPlacementOnVexFlowArticulation(vfa: Vex.Flow.Articulation | Vex.Flow.Ornament, placement: ArticulationPlacement, stemDirection: string): void;
  /**
   * Represents a single articulation, usually in the `.articulations` Array
   * on a {@link music21.note.Note} or something like that.
   *
   * @class Articulation
   * @memberof music21.articulations
   * @property {string} name
   * @property {string} [placement='above']
   * @property {string|undefined} vexflowModifier - the string code to get this accidental in Vexflow
   * @property {number} [dynamicScale=1.0] - multiplier for the dynamic of a note that this is attached to
   * @property {number} [lengthScale=1.0] - multiplier for the length of a note that this is attached to.
   */
  export class Articulation extends prebase.ProtoM21Object {
      static get className(): string;
      name: string;
      placement: ArticulationPlacement;
      vexflowModifier: string;
      dynamicScale: number;
      lengthScale: number;
      /**
       * Generates a Vex.Flow.Articulation for this articulation.
       *
       * @returns {Vex.Flow.Articulation}
       */
      vexflow({ stemDirection }?: VexflowArticulationParams): Vex.Flow.Articulation;
  }
  /**
   * base class for articulations that change the length of a note...
   *
   * @class LengthArticulation
   * @memberof music21.articulations
   */
  export class LengthArticulation extends Articulation {
      static get className(): string;
      constructor();
  }
  /**
   * base class for articulations that change the dynamic of a note...
   *
   * @class DynamicArticulation
   * @memberof music21.articulations
   */
  export class DynamicArticulation extends Articulation {
      static get className(): string;
      constructor();
  }
  /**
   * base class for articulations that change the pitch of a note...
   *
   * @class PitchArticulation
   * @memberof music21.articulations
   */
  export class PitchArticulation extends Articulation {
      static get className(): string;
      constructor();
  }
  /**
   * base class for articulations that change the timbre of a note...
   *
   * @class TimbreArticulation
   * @memberof music21.articulations
   */
  export class TimbreArticulation extends Articulation {
      static get className(): string;
      constructor();
  }
  /**
   * 50% louder than usual
   *
   * @class Accent
   * @memberof music21.articulations
   */
  export class Accent extends DynamicArticulation {
      static get className(): string;
      constructor();
  }
  /**
   * 100% louder than usual
   *
   * @class StrongAccent
   * @memberof music21.articulations
   */
  export class StrongAccent extends Accent {
      static get className(): string;
      constructor();
  }
  /**
   * no playback for now.
   *
   * @class Staccato
   * @memberof music21.articulations
   */
  export class Staccato extends LengthArticulation {
      static get className(): string;
      constructor();
  }
  /**
   * no playback for now.
   *
   * @class Staccatissimo
   * @memberof music21.articulations
   */
  export class Staccatissimo extends Staccato {
      static get className(): string;
      constructor();
  }
  /**
   * no playback or display for now.
   *
   * @class Spiccato
   * @memberof music21.articulations
   */
  export class Spiccato extends Staccato {
      static get className(): string;
      constructor();
  }
  /**
   * @class Marcato
   * @memberof music21.articulations
   *
   * should be both a DynamicArticulation and a LengthArticulation
   * TODO(msc): check that `.classes` reflects that in music21j
   */
  export class Marcato extends DynamicArticulation {
      static get className(): string;
      constructor();
  }
  /**
   * @class Tenuto
   * @memberof music21.articulations
   */
  export class Tenuto extends LengthArticulation {
      static get className(): string;
      constructor();
  }

}
declare module 'music21j/music21/audioRecording' {
  interface RecorderConfig {
      bufferLen?: number;
      callback?: Function;
      type?: string;
  }
  interface CanvasInfo {
      id: string;
      width: number;
      height: number;
      canvasContext: CanvasRenderingContext2D;
      animationFrameID?: number;
  }
  /**
   * Adopted from Matt Diamond's recorder.js code MIT License
   */
  export class Recorder {
      bufferLen: number;
      config: RecorderConfig;
      recording: boolean;
      currCallback: any;
      audioContext: AudioContext;
      frequencyCanvasInfo: CanvasInfo;
      waveformCanvasInfo: CanvasInfo;
      analyserNode: any;
      context: BaseAudioContext;
      worker: Worker;
      node: ScriptProcessorNode;
      constructor(cfg?: RecorderConfig);
      /**
       * Start here -- polyfills navigator, runs getUserMedia and then sends to audioStreamConnected
       */
      initAudio(): void;
      /**
       * After the user has given permission to record, this method is called.
       * It creates a gain point, and then connects the input source to the gain.
       * It connects an analyserNode (fftSize 2048) to the gain.
       *
       * It creates a second gain of 0.0 connected to the destination, so that
       * we're not hearing what we're playing in in an infinite loop (SUCKS to turn this off...)
       *
       * And it calls this.connectSource on the inputPoint so that
       * we can do something with all these wonderful inputs.
       */
      audioStreamConnected(stream: any): void;
      /**
       * Creates a worker to receive and process all the messages asynchronously.
       *
       * @param {GainNode} source;
       */
      connectSource(source: any): void;
      /**
       * Creates a ScriptProcessorNode (preferably) to allow for direct audio processing.
       *
       * Sets it to this.node and returns it.
       */
      setNode(): ScriptProcessorNode;
      /**
       * Configure from another source...
       */
      configure(cfg: any): void;
      record(): void;
      stop(): void;
      clear(): void;
      /**
       * Directly get the buffers from the worker and then call cb.
       */
      getBuffers(cb: any): void;
      /**
       * call exportWAV or exportMonoWAV on the worker, then call cb or (if undefined) setupDownload.
       */
      exportWAV(cb: any, type: any, isMono: any): void;
      exportMonoWAV(cb: any, type: any): void;
      setupDownload(blob: any, filename?: string, elementId?: string): void;
      setContextForCanvasInfo(canvasInfo: CanvasInfo): void;
      /**
       * Update the Analysers.
       *
       * @param {number} [time]
       */
      updateAnalysers(time: any): void;
      /**
       *
       * @param {number[][]} buffers
       */
      drawWaveformCanvas(buffers: any): void;
      /**
       * set this as a callback from getBuffers.  Returns the source so that a stop() command
       * is possible.
       */
      playBuffers(buffers: any): AudioBufferSourceNode;
  }
  export {};

}
declare module 'music21j/music21/audioSearch' {
  class _ConfigSingletonCreator {
      fftSize: number;
      AudioContextCaller: any;
      _audioContext: AudioContext;
      animationFrameCallbackId: number;
      sampleBuffer: Float32Array;
      currentAnalyser: any;
      minFrequency: number;
      maxFrequency: number;
      pitchSmoothingSize: number;
      lastPitchClassesDetected: number[];
      lastPitchesDetected: number[];
      lastCentsDeviationsDetected: number[];
      constructor();
      get audioContext(): AudioContext;
      set audioContext(ac: AudioContext);
  }
  export const config: _ConfigSingletonCreator;
  /**
   * Note: audioRecording uses the newer getUserMedia routines, so
   * this should be ported to be similar to there.
   *
   * @function music21.audioSearch.getUserMedia
   * @memberof music21.audioSearch
   * @param {Object} dictionary - optional dictionary to fill
   * @param {function} callback - callback on success
   * @param {function} error - callback on error
   */
  export function getUserMedia(dictionary: any, callback: any, error: any): void;
  export function userMediaStarted(audioStream: any): void;
  export const animateLoop: () => void;
  export function smoothPitchExtraction(frequency: number): [number, number];
  export function sampleCallback(frequency: number): number;
  export function autoCorrelate(buf: any, sampleRate: number, minFrequency?: number, maxFrequency?: number): number;
  export function midiNumDiffFromFrequency(frequency: number): [number, number];
  export {};

}
declare module 'music21j/music21/bar' {
  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/bar -- Barline objects
   *
   * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–19, Michael Scott Cuthbert and cuthbertLab
   *
   */
  import * as base from 'music21j/music21/base';
  import { Music21Exception } from 'music21j/music21/exceptions21';
  export class BarException extends Music21Exception {
  }
  export class Barline extends base.Music21Object {
      _type: string;
      location: string;
      static get className(): string;
      constructor(type?: string, location?: string);
      get type(): string;
      set type(v: string);
      musicXMLBarStyle(): string;
  }
  export default Barline;

}
declare module 'music21j/music21/base' {
  import * as derivation from 'music21j/music21/derivation';
  import * as duration from 'music21j/music21/duration';
  import * as editorial from 'music21j/music21/editorial';
  import * as prebase from 'music21j/music21/prebase';
  import * as sites from 'music21j/music21/sites';
  import { Stream } from 'music21j/music21/stream';
  import { TimeSignature } from 'music21j/music21/meter';
  /**
   * Base class for any object that can be placed in a {@link Stream}.
   *
   * @property {Stream} [activeSite] - hardlink to a
   *     {@link Stream} containing the element.
   * @property {number} classSortOrder - Default sort order for this class
   *     (default 20; override in other classes). Lower numbered objects will sort
   *     before other objects in the staff if priority and offset are the same.
   * @property {music21.duration.Duration} duration - the duration (object) for
   *     the element. (can be set with a quarterLength also)
   * @property {string[]} groups - An Array of strings representing group
   *     (equivalent to css classes) to assign to the object. (default [])
   * @property {boolean} isMusic21Object - true
   * @property {boolean} isStream - false
   * @property {number} offset - offset from the beginning of the stream (in quarterLength)
   * @property {number} priority - The priority (lower = earlier or more left) for
   *     elements at the same offset. (default 0)
   */
  export class Music21Object extends prebase.ProtoM21Object {
      static get className(): string;
      classSortOrder: number;
      protected _activeSite: any;
      protected _activeSiteStoredOffset: number;
      protected _naiveOffset: number;
      protected _editorial: editorial.Editorial;
      protected _duration: duration.Duration;
      protected _derivation: derivation.Derivation;
      protected _priority: number;
      id: number | string;
      groups: string[];
      sites: sites.Sites;
      isMusic21Object: boolean;
      isStream: boolean;
      constructor(keywords?: {});
      /**
       * Override clone on prebase to add a derivation.
       */
      clone(deep?: boolean, memo?: any): this;
      stringInfo(): string;
      get activeSite(): any;
      set activeSite(site: any);
      get derivation(): derivation.Derivation;
      set derivation(newDerivation: derivation.Derivation);
      get editorial(): editorial.Editorial;
      set editorial(newEditorial: editorial.Editorial);
      get hasEditorialInformation(): boolean;
      get measureNumber(): number;
      /**
       *  Try to obtain the nearest Measure that contains this object,
          and return the offset of this object within that Measure.

          If a Measure is found, and that Measure has padding
          defined as `paddingLeft` (for pickup measures, etc.), padding will be added to the
          native offset gathered from the object.

       */
      _getMeasureOffset({ includeMeasurePadding }?: {
          includeMeasurePadding?: boolean;
      }): number;
      get offset(): number;
      set offset(newOffset: number);
      get priority(): number;
      set priority(p: number);
      get duration(): duration.Duration;
      set duration(newDuration: duration.Duration);
      get quarterLength(): number;
      set quarterLength(ql: number);
      mergeAttributes(other: any): this;
      /**
       * Return the offset of this element in a given site -- use .offset if you are sure that
       * site === activeSite.
       *
       * Raises an Error if not in site.
       *
       * Does not change activeSite or .offset
       *
       * @param {Stream} site
       * @param {boolean} [stringReturns=false] -- allow strings to be returned
       * @returns {number|string|undefined}
       */
      getOffsetBySite(site?: Stream | undefined, stringReturns?: boolean): number | string | undefined;
      /**
       * setOffsetBySite - sets the offset for a given Stream
       *
       * @param {Stream} site Stream object
       * @param {number} value offset
       */
      setOffsetBySite(site: Stream | undefined, value: number): void;
      /**
       * For an element which may not be in site, but might be in a Stream
       * in site (or further in streams), find the cumulative offset of the
       * clement in that site.
       *
       * See also music21.stream.iterator.RecursiveIterator.currentHierarchyOffset for
       * a method that is about 10x faster when running through a recursed stream.
       *
       * @param {Stream} site
       * @returns {number|undefined}
       */
      getOffsetInHierarchy(site: Stream): number | undefined;
      getContextByClass(className: any, options?: {}): any;
      contextSites(options?: {}): any;
      _getTimeSignatureForBeat(): TimeSignature;
      get beat(): number;
      repeatAppend(this: any, item: any, numberOfTimes: any): void;
  }

}
declare module 'music21j/music21/beam' {
  import * as prebase from 'music21j/music21/prebase';
  export const validBeamTypes: {
      start: boolean;
      stop: boolean;
      continue: boolean;
      partial: boolean;
  };
  export const beamableDurationTypes: string[];
  /**
   * Object representing a single beam (e.g., a 16th note that is beamed needs two)
   *
   * @class Beam
   * @memberof music21.beam
   * @param {string} type - "start", "stop", "continue", "partial"
   * @param {string} direction - only needed for partial beams: "left" or "right"
   * @property {number|undefined} number - which beam line does this refer to;
   *     8th = 1, 16th = 2, etc.
   * @property {number|undefined} independentAngle - the angle of this beam
   *     if it is different than others (feathered beams)
   */
  export class Beam extends prebase.ProtoM21Object {
      static get className(): string;
      type: string;
      direction: string | undefined;
      number: number;
      independentAngle: number;
      constructor(type: any, direction?: any);
  }
  /**
   * Object representing a collection of Beams
   *
   * @class Beams
   * @memberof music21.beam
   * @property {Beam[]} beamsList - a list of Beam objects
   * @property {boolean} [feathered=false] - is this a feathered beam.
   * @property {number} length - length of beamsList
   */
  export class Beams extends prebase.ProtoM21Object {
      static get className(): string;
      static naiveBeams(srcList: any): Beams[];
      static removeSandwichedUnbeamables(beamsList: any): any;
      static sanitizePartialBeams(beamsList: Beams[]): Beams[];
      static mergeConnectingPartialBeams(beamsList: Beams[]): Beams[];
      beamsList: Beam[];
      feathered: boolean;
      get length(): number;
      /**
       * Append a new {@link Beam} object to this Beams, automatically creating the Beam
       *   object and incrementing the number count.
       *
       * @param {string} type - the type (passed to {@link Beam})
       * @param {string} [direction=undefined] - the direction if type is "partial"
       * @returns {Beam} newly appended object
       */
      append(type: string, direction?: any): Beam;
      /**
       * A quick way of setting the beams list for a particular duration, for
              instance, fill("16th") will clear the current list of beams in the
              Beams object and add two beams.  fill(2) will do the same (though note
              that that is an int, not a string).

       * It does not do anything to the direction that the beams are going in,
              or by default.  Either set type here or call setAll() on the Beams
              object afterwards.

       * Both "eighth" and "8th" work.  Adding more than six beams (i.e. things
              like 512th notes) raises an error.

       * @param {string|number} level - either a string like "eighth" or a number like 1 (="eighth")
       * @param {string} [type] - type to fill all beams to.
       * @returns {this}
       */
      fill(level: string | number, type?: string | undefined): Beams;
      /**
       * Get the beam with the given number or throw an exception.
       *
       * @param {number} number - the beam number to retrieve (usually one less than the position in `.beamsList`)
       * @returns {Beam|undefined}
       */
      getByNumber(number: number): Beam | undefined;
      /**
       * Get an Array of all the numbers for the beams
       *
       * @returns {Array<number>} all the numbers
       */
      getNumbers(): number[];
      /**
       * Returns the type + "-" + direction (if direction is defined)
       * for the beam with the given number.
       *
       * @param {number} number
       * @returns {string|undefined}
       */
      getTypeByNumber(number: number): string | undefined;
      /**
       * Get an Array of all the types for the beams
       *
       * @returns {Array<string>} all the types
       */
      getTypes(): string[];
      /**
       * Set all the {@link Beam} objects to a given type/direction
       *
       * @param {string} type - beam type
       * @param {string} [direction] - beam direction
       * @returns {this}
       */
      setAll(type: string, direction?: string): Beams;
      /**
       * Set the {@link Beam} object specified by `number` to a given type/direction
       *
       * @param {number} number
       * @param {string} type
       * @param {string} [direction]
       * @returns {this}
       */
      setByNumber(number: number, type: string, direction?: string | undefined): Beams;
  }

}
declare module 'music21j/music21/chord' {
  import * as note from 'music21j/music21/note';
  import * as chordTables from 'music21j/music21/chordTables';
  import type * as clef from 'music21j/music21/clef';
  import type { Pitch } from 'music21j/music21/pitch';
  export { chordTables };
  /**
   * Chord related objects (esp. {@link music21.chord.Chord}) and methods.
   *
   * @param {Array<string|note.Note|Pitch>} [notes] -
   *     an Array of strings
   *     (see {@link Pitch} for valid formats), note.Note,
   *     or pitch.Pitch objects.
   * @property {number} length - the number of pitches in the Chord (readonly)
   * @property {Pitch[]} pitches - an Array of Pitch objects in the
   *     chord. (Consider the Array read only and pass in a new Array to change)
   * @property {Boolean} [isChord=true]
   * @property {Boolean} [isNote=false]
   * @property {Boolean} [isRest=false]
   */
  export class Chord extends note.NotRest {
      static get className(): string;
      protected _notes: note.Note[];
      isChord: boolean;
      isNote: boolean;
      isRest: boolean;
      _overrides: any;
      _cache: any;
      protected _chordTablesAddress: any;
      protected _chordTablesAddressNeedsUpdating: boolean;
      constructor(notes?: string | note.Note[] | Pitch[] | string[]);
      stringInfo(): string;
      get length(): number;
      get pitches(): Pitch[];
      set pitches(tempPitches: Pitch[]);
      get notes(): note.Note[];
      set notes(newNotes: note.Note[]);
      get orderedPitchClasses(): number[];
      get chordTablesAddress(): any;
      get commonName(): string;
      get forteClass(): string;
      get forteClassNumber(): any;
      get forteClassTnI(): string;
      get(i: any): note.Note;
      [Symbol.iterator](): Generator<note.Note, void, unknown>;
      areZRelations(other: any): boolean;
      getZRelation(): Chord;
      get hasZRelation(): boolean;
      get intervalVector(): any;
      setStemDirectionFromClef(clef?: clef.Clef): this;
      /**
       * Adds a note to the chord, sorting the note array
       *
       * @param {
       *     string|string[]|note.Note|Pitch|
       *     music21.note.Note[]|Pitch[]} notes - the
       *     Note or Pitch to be added or a string defining a pitch.
       * @param {boolean} runSort - Sort after running (default true)
       * @returns {music21.chord.Chord} the original chord.
       */
      add(notes: any, runSort?: boolean): this;
      sortPitches(): void;
      /**
       * Removes any pitches that appear more than once (in any octave),
       * removing the higher ones, and returns a new Chord.
       *
       * returns A new Chord object with duplicate pitches removed.
       */
      removeDuplicatePitches(): Chord;
      /**
       * Finds the Root of the chord, or sets it as an override.
       */
      root(newroot?: Pitch): Pitch;
      /**
       * Returns the number of semitones above the root that a given chordstep is.
       *
       * For instance, in a G dominant 7th chord (G, B, D, F), would
       * return 4 for chordStep=3, since the third of the chord (B) is four semitones above G.
       *
       * @param {number} chordStep - the step to find, e.g., 1, 2, 3, etc.
       * @param {Pitch} [testRoot] - the pitch to temporarily consider the root.
       * @returns {number|undefined} Number of semitones above the root for this
       *     chord step or undefined if no pitch matches that chord step.
       */
      semitonesFromChordStep(chordStep: number, testRoot?: Pitch): number | undefined;
      /**
       * Gets the lowest note (based on .ps not name) in the chord.
       *
       * return bass pitch or undefined
       */
      bass(newBass?: Pitch): Pitch | undefined;
      /**
       * Counts the number of non-duplicate pitch MIDI Numbers in the chord.
       *
       * Call after "closedPosition()" to get Forte style cardinality disregarding octave.
       */
      cardinality(): number;
      isMajorTriad(): boolean;
      isMinorTriad(): boolean;
      isDiminishedTriad(): boolean;
      isAugmentedTriad(): boolean;
      isDominantSeventh(): boolean;
      isDiminishedSeventh(): boolean;
      isSeventhOfType(intervalArray: number[]): boolean;
      /**
       * canBeDominantV - Returns true if the chord is a Major Triad or a Dominant Seventh
       */
      canBeDominantV(): boolean;
      /**
       * Returns true if the chord is a major or minor triad
       */
      canBeTonic(): boolean;
      /**
       * Returns the inversion of the chord as a number (root-position = 0)
       *
       * Unlike music21p version, cannot set the inversion, yet.
       *
       * TODO: add.
       */
      inversion(): number;
      playMidi(tempo?: number, nextElement?: any, { instrument, channel, }?: {
          instrument?: any;
          channel?: any;
      }): number;
      /**
       * Returns the Pitch object that is a Generic interval (2, 3, 4, etc., but not 9, 10, etc.) above
       * the `.root()`
       *
       * In case there is more that one note with that designation (e.g., `[A-C-C#-E].getChordStep(3)`)
       * the first one in `.pitches` is returned.
       */
      getChordStep(chordStep: number, testRoot?: Pitch): Pitch | undefined;
      get third(): Pitch | undefined;
      get fifth(): Pitch | undefined;
      get seventh(): Pitch | undefined;
  }
  export const chordDefinitions: {
      major: string[];
      minor: string[];
      diminished: string[];
      augmented: string[];
      'major-seventh': string[];
      'dominant-seventh': string[];
      'minor-seventh': string[];
      'diminished-seventh': string[];
      'half-diminished-seventh': string[];
  };

}
declare module 'music21j/music21/chordTables' {
  export const FORTE: any[][];
  export const SCDICT: {
      1: {
          '1,0': any[];
      };
      2: {
          '1,0': any[];
          '2,0': any[];
          '3,0': any[];
          '4,0': any[];
          '5,0': any[];
          '6,0': any[];
      };
      3: {
          '1,0': any[];
          '2,1': any[];
          '2,-1': any[];
          '3,1': any[];
          '3,-1': any[];
          '4,1': any[];
          '4,-1': any[];
          '5,1': any[];
          '5,-1': any[];
          '6,0': any[];
          '7,1': any[];
          '7,-1': any[];
          '8,1': any[];
          '8,-1': any[];
          '9,0': any[];
          '10,0': any[];
          '11,1': any[];
          '11,-1': any[];
          '12,0': any[];
      };
      4: {
          '1,0': any[];
          '2,1': any[];
          '2,-1': any[];
          '3,0': any[];
          '4,1': any[];
          '4,-1': any[];
          '5,1': any[];
          '5,-1': any[];
          '6,0': any[];
          '7,0': any[];
          '8,0': any[];
          '9,0': any[];
          '10,0': any[];
          '11,1': any[];
          '11,-1': any[];
          '12,1': any[];
          '12,-1': any[];
          '13,1': any[];
          '13,-1': any[];
          '14,1': any[];
          '14,-1': any[];
          '15,1': any[];
          '15,-1': any[];
          '16,1': any[];
          '16,-1': any[];
          '17,0': any[];
          '18,1': any[];
          '18,-1': any[];
          '19,1': any[];
          '19,-1': any[];
          '20,0': any[];
          '21,0': any[];
          '22,1': any[];
          '22,-1': any[];
          '23,0': any[];
          '24,0': any[];
          '25,0': any[];
          '26,0': any[];
          '27,1': any[];
          '27,-1': any[];
          '28,0': any[];
          '29,1': any[];
          '29,-1': any[];
      };
      5: {
          '1,0': any[];
          '2,1': any[];
          '2,-1': any[];
          '3,1': any[];
          '3,-1': any[];
          '4,1': any[];
          '4,-1': any[];
          '5,1': any[];
          '5,-1': any[];
          '6,1': any[];
          '6,-1': any[];
          '7,1': any[];
          '7,-1': any[];
          '8,0': any[];
          '9,1': any[];
          '9,-1': any[];
          '10,1': any[];
          '10,-1': any[];
          '11,1': any[];
          '11,-1': any[];
          '12,0': any[];
          '13,1': any[];
          '13,-1': any[];
          '14,1': any[];
          '14,-1': any[];
          '15,0': any[];
          '16,1': any[];
          '16,-1': any[];
          '17,0': any[];
          '18,1': any[];
          '18,-1': any[];
          '19,1': any[];
          '19,-1': any[];
          '20,1': any[];
          '20,-1': any[];
          '21,1': any[];
          '21,-1': any[];
          '22,0': any[];
          '23,1': any[];
          '23,-1': any[];
          '24,1': any[];
          '24,-1': any[];
          '25,1': any[];
          '25,-1': any[];
          '26,1': any[];
          '26,-1': any[];
          '27,1': any[];
          '27,-1': any[];
          '28,1': any[];
          '28,-1': any[];
          '29,1': any[];
          '29,-1': any[];
          '30,1': any[];
          '30,-1': any[];
          '31,1': any[];
          '31,-1': any[];
          '32,1': any[];
          '32,-1': any[];
          '33,0': any[];
          '34,0': any[];
          '35,0': any[];
          '36,1': any[];
          '36,-1': any[];
          '37,0': any[];
          '38,1': any[];
          '38,-1': any[];
      };
      6: {
          '1,0': any[];
          '2,1': any[];
          '2,-1': any[];
          '3,1': any[];
          '3,-1': any[];
          '4,0': any[];
          '5,1': any[];
          '5,-1': any[];
          '6,0': any[];
          '7,0': any[];
          '8,0': any[];
          '9,1': any[];
          '9,-1': any[];
          '10,1': any[];
          '10,-1': any[];
          '11,1': any[];
          '11,-1': any[];
          '12,1': any[];
          '12,-1': any[];
          '13,0': any[];
          '14,1': any[];
          '14,-1': any[];
          '15,1': any[];
          '15,-1': any[];
          '16,1': any[];
          '16,-1': any[];
          '17,1': any[];
          '17,-1': any[];
          '18,1': any[];
          '18,-1': any[];
          '19,1': any[];
          '19,-1': any[];
          '20,0': any[];
          '21,1': any[];
          '21,-1': any[];
          '22,1': any[];
          '22,-1': any[];
          '23,0': any[];
          '24,1': any[];
          '24,-1': any[];
          '25,1': any[];
          '25,-1': any[];
          '26,0': any[];
          '27,1': any[];
          '27,-1': any[];
          '28,0': any[];
          '29,0': any[];
          '30,1': any[];
          '30,-1': any[];
          '31,1': any[];
          '31,-1': any[];
          '32,0': any[];
          '33,1': any[];
          '33,-1': any[];
          '34,1': any[];
          '34,-1': any[];
          '35,0': any[];
          '36,1': any[];
          '36,-1': any[];
          '37,0': any[];
          '38,0': any[];
          '39,1': any[];
          '39,-1': any[];
          '40,1': any[];
          '40,-1': any[];
          '41,1': any[];
          '41,-1': any[];
          '42,0': any[];
          '43,1': any[];
          '43,-1': any[];
          '44,1': any[];
          '44,-1': any[];
          '45,0': any[];
          '46,1': any[];
          '46,-1': any[];
          '47,1': any[];
          '47,-1': any[];
          '48,0': any[];
          '49,0': any[];
          '50,0': any[];
      };
      7: {
          '1,0': any[];
          '2,1': any[];
          '2,-1': any[];
          '3,1': any[];
          '3,-1': any[];
          '4,1': any[];
          '4,-1': any[];
          '5,1': any[];
          '5,-1': any[];
          '6,1': any[];
          '6,-1': any[];
          '7,1': any[];
          '7,-1': any[];
          '8,0': any[];
          '9,1': any[];
          '9,-1': any[];
          '10,1': any[];
          '10,-1': any[];
          '11,1': any[];
          '11,-1': any[];
          '12,0': any[];
          '13,1': any[];
          '13,-1': any[];
          '14,1': any[];
          '14,-1': any[];
          '15,0': any[];
          '16,1': any[];
          '16,-1': any[];
          '17,0': any[];
          '18,1': any[];
          '18,-1': any[];
          '19,1': any[];
          '19,-1': any[];
          '20,1': any[];
          '20,-1': any[];
          '21,1': any[];
          '21,-1': any[];
          '22,0': any[];
          '23,1': any[];
          '23,-1': any[];
          '24,1': any[];
          '24,-1': any[];
          '25,1': any[];
          '25,-1': any[];
          '26,1': any[];
          '26,-1': any[];
          '27,1': any[];
          '27,-1': any[];
          '28,1': any[];
          '28,-1': any[];
          '29,1': any[];
          '29,-1': any[];
          '30,1': any[];
          '30,-1': any[];
          '31,1': any[];
          '31,-1': any[];
          '32,1': any[];
          '32,-1': any[];
          '33,0': any[];
          '34,0': any[];
          '35,0': any[];
          '36,1': any[];
          '36,-1': any[];
          '37,0': any[];
          '38,1': any[];
          '38,-1': any[];
      };
      8: {
          '1,0': any[];
          '2,1': any[];
          '2,-1': any[];
          '3,0': any[];
          '4,1': any[];
          '4,-1': any[];
          '5,1': any[];
          '5,-1': any[];
          '6,0': any[];
          '7,0': any[];
          '8,0': any[];
          '9,0': any[];
          '10,0': any[];
          '11,1': any[];
          '11,-1': any[];
          '12,1': any[];
          '12,-1': any[];
          '13,1': any[];
          '13,-1': any[];
          '14,1': any[];
          '14,-1': any[];
          '15,1': any[];
          '15,-1': any[];
          '16,1': any[];
          '16,-1': any[];
          '17,0': any[];
          '18,1': any[];
          '18,-1': any[];
          '19,1': any[];
          '19,-1': any[];
          '20,0': any[];
          '21,0': any[];
          '22,1': any[];
          '22,-1': any[];
          '23,0': any[];
          '24,0': any[];
          '25,0': any[];
          '26,0': any[];
          '27,1': any[];
          '27,-1': any[];
          '28,0': any[];
          '29,1': any[];
          '29,-1': any[];
      };
      9: {
          '1,0': any[];
          '2,1': any[];
          '2,-1': any[];
          '3,1': any[];
          '3,-1': any[];
          '4,1': any[];
          '4,-1': any[];
          '5,1': any[];
          '5,-1': any[];
          '6,0': any[];
          '7,1': any[];
          '7,-1': any[];
          '8,1': any[];
          '8,-1': any[];
          '9,0': any[];
          '10,0': any[];
          '11,1': any[];
          '11,-1': any[];
          '12,0': any[];
      };
      10: {
          '1,0': any[];
          '2,0': any[];
          '3,0': any[];
          '4,0': any[];
          '5,0': any[];
          '6,0': any[];
      };
      11: {
          '1,0': any[];
      };
      12: {
          '1,0': any[];
      };
  };
  export const TNMAX: {
      0: number;
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
      6: number;
      7: number;
      8: number;
      9: number;
      10: number;
      11: number;
      12: number;
  };
  export const TNIMAX: {
      0: number;
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
      6: number;
      7: number;
      8: number;
      9: number;
      10: number;
      11: number;
      12: number;
  };
  export const TNREF: {
      '1,1,0': number;
      '2,1,0': number;
      '2,2,0': number;
      '2,3,0': number;
      '2,4,0': number;
      '2,5,0': number;
      '2,6,0': number;
      '3,1,0': number;
      '3,2,1': number;
      '3,2,-1': number;
      '3,3,1': number;
      '3,3,-1': number;
      '3,4,1': number;
      '3,4,-1': number;
      '3,5,1': number;
      '3,5,-1': number;
      '3,6,0': number;
      '3,7,1': number;
      '3,7,-1': number;
      '3,8,1': number;
      '3,8,-1': number;
      '3,9,0': number;
      '3,10,0': number;
      '3,11,1': number;
      '3,11,-1': number;
      '3,12,0': number;
      '4,1,0': number;
      '4,2,1': number;
      '4,2,-1': number;
      '4,3,0': number;
      '4,4,1': number;
      '4,4,-1': number;
      '4,5,1': number;
      '4,5,-1': number;
      '4,6,0': number;
      '4,7,0': number;
      '4,8,0': number;
      '4,9,0': number;
      '4,10,0': number;
      '4,11,1': number;
      '4,11,-1': number;
      '4,12,1': number;
      '4,12,-1': number;
      '4,13,1': number;
      '4,13,-1': number;
      '4,14,1': number;
      '4,14,-1': number;
      '4,15,1': number;
      '4,15,-1': number;
      '4,16,1': number;
      '4,16,-1': number;
      '4,17,0': number;
      '4,18,1': number;
      '4,18,-1': number;
      '4,19,1': number;
      '4,19,-1': number;
      '4,20,0': number;
      '4,21,0': number;
      '4,22,1': number;
      '4,22,-1': number;
      '4,23,0': number;
      '4,24,0': number;
      '4,25,0': number;
      '4,26,0': number;
      '4,27,1': number;
      '4,27,-1': number;
      '4,28,0': number;
      '4,29,1': number;
      '4,29,-1': number;
      '5,1,0': number;
      '5,2,1': number;
      '5,2,-1': number;
      '5,3,1': number;
      '5,3,-1': number;
      '5,4,1': number;
      '5,4,-1': number;
      '5,5,1': number;
      '5,5,-1': number;
      '5,6,1': number;
      '5,6,-1': number;
      '5,7,1': number;
      '5,7,-1': number;
      '5,8,0': number;
      '5,9,1': number;
      '5,9,-1': number;
      '5,10,1': number;
      '5,10,-1': number;
      '5,11,1': number;
      '5,11,-1': number;
      '5,12,0': number;
      '5,13,1': number;
      '5,13,-1': number;
      '5,14,1': number;
      '5,14,-1': number;
      '5,15,0': number;
      '5,16,1': number;
      '5,16,-1': number;
      '5,17,0': number;
      '5,18,1': number;
      '5,18,-1': number;
      '5,19,1': number;
      '5,19,-1': number;
      '5,20,1': number;
      '5,20,-1': number;
      '5,21,1': number;
      '5,21,-1': number;
      '5,22,0': number;
      '5,23,1': number;
      '5,23,-1': number;
      '5,24,1': number;
      '5,24,-1': number;
      '5,25,1': number;
      '5,25,-1': number;
      '5,26,1': number;
      '5,26,-1': number;
      '5,27,1': number;
      '5,27,-1': number;
      '5,28,1': number;
      '5,28,-1': number;
      '5,29,1': number;
      '5,29,-1': number;
      '5,30,1': number;
      '5,30,-1': number;
      '5,31,1': number;
      '5,31,-1': number;
      '5,32,1': number;
      '5,32,-1': number;
      '5,33,0': number;
      '5,34,0': number;
      '5,35,0': number;
      '5,36,1': number;
      '5,36,-1': number;
      '5,37,0': number;
      '5,38,1': number;
      '5,38,-1': number;
      '6,1,0': number;
      '6,2,1': number;
      '6,2,-1': number;
      '6,3,1': number;
      '6,3,-1': number;
      '6,4,0': number;
      '6,5,1': number;
      '6,5,-1': number;
      '6,6,0': number;
      '6,7,0': number;
      '6,8,0': number;
      '6,9,1': number;
      '6,9,-1': number;
      '6,10,1': number;
      '6,10,-1': number;
      '6,11,1': number;
      '6,11,-1': number;
      '6,12,1': number;
      '6,12,-1': number;
      '6,13,0': number;
      '6,14,1': number;
      '6,14,-1': number;
      '6,15,1': number;
      '6,15,-1': number;
      '6,16,1': number;
      '6,16,-1': number;
      '6,17,1': number;
      '6,17,-1': number;
      '6,18,1': number;
      '6,18,-1': number;
      '6,19,1': number;
      '6,19,-1': number;
      '6,20,0': number;
      '6,21,1': number;
      '6,21,-1': number;
      '6,22,1': number;
      '6,22,-1': number;
      '6,23,0': number;
      '6,24,1': number;
      '6,24,-1': number;
      '6,25,1': number;
      '6,25,-1': number;
      '6,26,0': number;
      '6,27,1': number;
      '6,27,-1': number;
      '6,28,0': number;
      '6,29,0': number;
      '6,30,1': number;
      '6,30,-1': number;
      '6,31,1': number;
      '6,31,-1': number;
      '6,32,0': number;
      '6,33,1': number;
      '6,33,-1': number;
      '6,34,1': number;
      '6,34,-1': number;
      '6,35,0': number;
      '6,36,1': number;
      '6,36,-1': number;
      '6,37,0': number;
      '6,38,0': number;
      '6,39,1': number;
      '6,39,-1': number;
      '6,40,1': number;
      '6,40,-1': number;
      '6,41,1': number;
      '6,41,-1': number;
      '6,42,0': number;
      '6,43,1': number;
      '6,43,-1': number;
      '6,44,1': number;
      '6,44,-1': number;
      '6,45,0': number;
      '6,46,1': number;
      '6,46,-1': number;
      '6,47,1': number;
      '6,47,-1': number;
      '6,48,0': number;
      '6,49,0': number;
      '6,50,0': number;
      '7,1,0': number;
      '7,2,1': number;
      '7,2,-1': number;
      '7,3,1': number;
      '7,3,-1': number;
      '7,4,1': number;
      '7,4,-1': number;
      '7,5,1': number;
      '7,5,-1': number;
      '7,6,1': number;
      '7,6,-1': number;
      '7,7,1': number;
      '7,7,-1': number;
      '7,8,0': number;
      '7,9,1': number;
      '7,9,-1': number;
      '7,10,1': number;
      '7,10,-1': number;
      '7,11,1': number;
      '7,11,-1': number;
      '7,12,0': number;
      '7,13,1': number;
      '7,13,-1': number;
      '7,14,1': number;
      '7,14,-1': number;
      '7,15,0': number;
      '7,16,1': number;
      '7,16,-1': number;
      '7,17,0': number;
      '7,18,1': number;
      '7,18,-1': number;
      '7,19,1': number;
      '7,19,-1': number;
      '7,20,1': number;
      '7,20,-1': number;
      '7,21,1': number;
      '7,21,-1': number;
      '7,22,0': number;
      '7,23,1': number;
      '7,23,-1': number;
      '7,24,1': number;
      '7,24,-1': number;
      '7,25,1': number;
      '7,25,-1': number;
      '7,26,1': number;
      '7,26,-1': number;
      '7,27,1': number;
      '7,27,-1': number;
      '7,28,1': number;
      '7,28,-1': number;
      '7,29,1': number;
      '7,29,-1': number;
      '7,30,1': number;
      '7,30,-1': number;
      '7,31,1': number;
      '7,31,-1': number;
      '7,32,1': number;
      '7,32,-1': number;
      '7,33,0': number;
      '7,34,0': number;
      '7,35,0': number;
      '7,36,1': number;
      '7,36,-1': number;
      '7,37,0': number;
      '7,38,1': number;
      '7,38,-1': number;
      '8,1,0': number;
      '8,2,1': number;
      '8,2,-1': number;
      '8,3,0': number;
      '8,4,1': number;
      '8,4,-1': number;
      '8,5,1': number;
      '8,5,-1': number;
      '8,6,0': number;
      '8,7,0': number;
      '8,8,0': number;
      '8,9,0': number;
      '8,10,0': number;
      '8,11,1': number;
      '8,11,-1': number;
      '8,12,1': number;
      '8,12,-1': number;
      '8,13,1': number;
      '8,13,-1': number;
      '8,14,1': number;
      '8,14,-1': number;
      '8,15,1': number;
      '8,15,-1': number;
      '8,16,1': number;
      '8,16,-1': number;
      '8,17,0': number;
      '8,18,1': number;
      '8,18,-1': number;
      '8,19,1': number;
      '8,19,-1': number;
      '8,20,0': number;
      '8,21,0': number;
      '8,22,1': number;
      '8,22,-1': number;
      '8,23,0': number;
      '8,24,0': number;
      '8,25,0': number;
      '8,26,0': number;
      '8,27,1': number;
      '8,27,-1': number;
      '8,28,0': number;
      '8,29,1': number;
      '8,29,-1': number;
      '9,1,0': number;
      '9,2,1': number;
      '9,2,-1': number;
      '9,3,1': number;
      '9,3,-1': number;
      '9,4,1': number;
      '9,4,-1': number;
      '9,5,1': number;
      '9,5,-1': number;
      '9,6,0': number;
      '9,7,1': number;
      '9,7,-1': number;
      '9,8,1': number;
      '9,8,-1': number;
      '9,9,0': number;
      '9,10,0': number;
      '9,11,1': number;
      '9,11,-1': number;
      '9,12,0': number;
      '10,1,0': number;
      '10,2,0': number;
      '10,3,0': number;
      '10,4,0': number;
      '10,5,0': number;
      '10,6,0': number;
      '11,1,0': number;
      '12,1,0': number;
  };
  export const SCREF: {
      '1,1,0': {
          name: string[];
      };
      '2,1,0': {
          name: string[];
      };
      '2,2,0': {
          name: string[];
      };
      '2,3,0': {
          name: string[];
      };
      '2,4,0': {
          name: string[];
      };
      '2,5,0': {
          name: string[];
      };
      '2,6,0': {
          name: string[];
      };
      '3,1,0': {
          name: string[];
      };
      '3,2,1': {
          name: string[];
      };
      '3,2,-1': {
          name: string[];
      };
      '3,3,1': {
          name: string[];
      };
      '3,3,-1': {
          name: string[];
      };
      '3,4,1': {
          name: string[];
      };
      '3,4,-1': {
          name: string[];
      };
      '3,5,1': {
          name: string[];
      };
      '3,5,-1': {
          name: string[];
      };
      '3,6,0': {
          name: string[];
      };
      '3,7,1': {
          name: string[];
      };
      '3,7,-1': {
          name: string[];
      };
      '3,8,1': {
          name: string[];
      };
      '3,8,-1': {
          name: string[];
      };
      '3,9,0': {
          name: string[];
      };
      '3,10,0': {
          name: string[];
      };
      '3,11,1': {
          name: string[];
      };
      '3,11,-1': {
          name: string[];
      };
      '3,12,0': {
          name: string[];
      };
      '4,1,0': {
          name: string[];
      };
      '4,2,1': {
          name: string[];
      };
      '4,2,-1': {
          name: string[];
      };
      '4,3,0': {
          name: string[];
      };
      '4,4,1': {
          name: string[];
      };
      '4,4,-1': {
          name: string[];
      };
      '4,5,1': {
          name: string[];
      };
      '4,5,-1': {
          name: string[];
      };
      '4,6,0': {
          name: string[];
      };
      '4,7,0': {
          name: string[];
      };
      '4,8,0': {
          name: string[];
      };
      '4,9,0': {
          name: string[];
      };
      '4,10,0': {
          name: string[];
      };
      '4,11,1': {
          name: string[];
      };
      '4,11,-1': {
          name: string[];
      };
      '4,12,1': {
          name: string[];
      };
      '4,12,-1': {
          name: string[];
      };
      '4,13,1': {
          name: string[];
      };
      '4,13,-1': {
          name: string[];
      };
      '4,14,1': {
          name: string[];
      };
      '4,14,-1': {
          name: string[];
      };
      '4,15,1': {
          name: string[];
      };
      '4,15,-1': {
          name: string[];
      };
      '4,16,1': {
          name: string[];
      };
      '4,16,-1': {
          name: string[];
      };
      '4,17,0': {
          name: string[];
      };
      '4,18,1': {
          name: string[];
      };
      '4,18,-1': {
          name: string[];
      };
      '4,19,1': {
          name: string[];
      };
      '4,19,-1': {
          name: string[];
      };
      '4,20,0': {
          name: string[];
      };
      '4,21,0': {
          name: string[];
      };
      '4,22,1': {
          name: string[];
      };
      '4,22,-1': {
          name: string[];
      };
      '4,23,0': {
          name: string[];
      };
      '4,24,0': {
          name: string[];
      };
      '4,25,0': {
          name: string[];
      };
      '4,26,0': {
          name: string[];
      };
      '4,27,1': {
          name: string[];
      };
      '4,27,-1': {
          name: string[];
      };
      '4,28,0': {
          name: string[];
      };
      '4,29,1': {
          name: string[];
      };
      '4,29,-1': {
          name: string[];
      };
      '5,1,0': {
          name: string[];
      };
      '5,2,1': {
          name: string[];
      };
      '5,2,-1': {
          name: string[];
      };
      '5,3,1': {
          name: string[];
      };
      '5,3,-1': {
          name: string[];
      };
      '5,4,1': {
          name: string[];
      };
      '5,4,-1': {
          name: string[];
      };
      '5,5,1': {
          name: string[];
      };
      '5,5,-1': {
          name: string[];
      };
      '5,6,1': {
          name: string[];
      };
      '5,6,-1': {
          name: string[];
      };
      '5,7,1': {
          name: string[];
      };
      '5,7,-1': {
          name: string[];
      };
      '5,8,0': {
          name: string[];
      };
      '5,9,1': {
          name: string[];
      };
      '5,9,-1': {
          name: string[];
      };
      '5,10,1': {
          name: string[];
      };
      '5,10,-1': {
          name: string[];
      };
      '5,11,1': {
          name: string[];
      };
      '5,11,-1': {
          name: string[];
      };
      '5,12,0': {
          name: string[];
      };
      '5,13,1': {
          name: string[];
      };
      '5,13,-1': {
          name: string[];
      };
      '5,14,1': {
          name: string[];
      };
      '5,14,-1': {
          name: string[];
      };
      '5,15,0': {
          name: string[];
      };
      '5,16,1': {
          name: string[];
      };
      '5,16,-1': {
          name: string[];
      };
      '5,17,0': {
          name: string[];
      };
      '5,18,1': {
          name: string[];
      };
      '5,18,-1': {
          name: string[];
      };
      '5,19,1': {
          name: string[];
      };
      '5,19,-1': {
          name: string[];
      };
      '5,20,1': {
          name: string[];
      };
      '5,20,-1': {
          name: string[];
      };
      '5,21,1': {
          name: string[];
      };
      '5,21,-1': {
          name: string[];
      };
      '5,22,0': {
          name: string[];
      };
      '5,23,1': {
          name: string[];
      };
      '5,23,-1': {
          name: string[];
      };
      '5,24,1': {
          name: string[];
      };
      '5,24,-1': {
          name: string[];
      };
      '5,25,1': {
          name: string[];
      };
      '5,25,-1': {
          name: string[];
      };
      '5,26,1': {
          name: string[];
      };
      '5,26,-1': {
          name: string[];
      };
      '5,27,1': {
          name: string[];
      };
      '5,27,-1': {
          name: string[];
      };
      '5,28,1': {
          name: string[];
      };
      '5,28,-1': {
          name: string[];
      };
      '5,29,1': {
          name: string[];
      };
      '5,29,-1': {
          name: string[];
      };
      '5,30,1': {
          name: string[];
      };
      '5,30,-1': {
          name: string[];
      };
      '5,31,1': {
          name: string[];
      };
      '5,31,-1': {
          name: string[];
      };
      '5,32,1': {
          name: string[];
      };
      '5,32,-1': {
          name: string[];
      };
      '5,33,0': {
          name: string[];
      };
      '5,34,0': {
          name: string[];
      };
      '5,35,0': {
          name: string[];
      };
      '5,36,1': {
          name: string[];
      };
      '5,36,-1': {
          name: string[];
      };
      '5,37,0': {
          name: string[];
      };
      '5,38,1': {
          name: string[];
      };
      '5,38,-1': {
          name: string[];
      };
      '6,1,0': {
          name: string[];
      };
      '6,2,1': {
          name: string[];
      };
      '6,2,-1': {
          name: string[];
      };
      '6,3,1': {};
      '6,3,-1': {};
      '6,4,0': {
          name: string[];
      };
      '6,5,1': {
          name: string[];
      };
      '6,5,-1': {
          name: string[];
      };
      '6,6,0': {
          name: string[];
      };
      '6,7,0': {
          name: string[];
      };
      '6,8,0': {
          name: string[];
      };
      '6,9,1': {
          name: string[];
      };
      '6,9,-1': {
          name: string[];
      };
      '6,10,1': {};
      '6,10,-1': {};
      '6,11,1': {};
      '6,11,-1': {};
      '6,12,1': {};
      '6,12,-1': {};
      '6,13,0': {
          name: string[];
      };
      '6,14,1': {
          name: string[];
      };
      '6,14,-1': {
          name: string[];
      };
      '6,15,1': {
          name: string[];
      };
      '6,15,-1': {
          name: string[];
      };
      '6,16,1': {
          name: string[];
      };
      '6,16,-1': {
          name: string[];
      };
      '6,17,1': {
          name: string[];
      };
      '6,17,-1': {
          name: string[];
      };
      '6,18,1': {
          name: string[];
      };
      '6,18,-1': {
          name: string[];
      };
      '6,19,1': {};
      '6,19,-1': {};
      '6,20,0': {
          name: string[];
      };
      '6,21,1': {
          name: string[];
      };
      '6,21,-1': {
          name: string[];
      };
      '6,22,1': {
          name: string[];
      };
      '6,22,-1': {
          name: string[];
      };
      '6,23,0': {
          name: string[];
      };
      '6,24,1': {};
      '6,24,-1': {
          name: string[];
      };
      '6,25,1': {
          name: string[];
      };
      '6,25,-1': {
          name: string[];
      };
      '6,26,0': {
          name: string[];
      };
      '6,27,1': {
          name: string[];
      };
      '6,27,-1': {
          name: string[];
      };
      '6,28,0': {
          name: string[];
      };
      '6,29,0': {
          name: string[];
      };
      '6,30,1': {
          name: string[];
      };
      '6,30,-1': {
          name: string[];
      };
      '6,31,1': {
          name: string[];
      };
      '6,31,-1': {
          name: string[];
      };
      '6,32,0': {
          name: string[];
      };
      '6,33,1': {
          name: string[];
      };
      '6,33,-1': {
          name: string[];
      };
      '6,34,1': {
          name: string[];
      };
      '6,34,-1': {
          name: string[];
      };
      '6,35,0': {
          name: string[];
      };
      '6,36,1': {};
      '6,36,-1': {};
      '6,37,0': {
          name: string[];
      };
      '6,38,0': {
          name: string[];
      };
      '6,39,1': {};
      '6,39,-1': {};
      '6,40,1': {};
      '6,40,-1': {};
      '6,41,1': {};
      '6,41,-1': {};
      '6,42,0': {
          name: string[];
      };
      '6,43,1': {
          name: string[];
      };
      '6,43,-1': {
          name: string[];
      };
      '6,44,1': {
          name: string[];
      };
      '6,44,-1': {
          name: string[];
      };
      '6,45,0': {
          name: string[];
      };
      '6,46,1': {};
      '6,46,-1': {};
      '6,47,1': {};
      '6,47,-1': {
          name: string[];
      };
      '6,48,0': {
          name: string[];
      };
      '6,49,0': {
          name: string[];
      };
      '6,50,0': {
          name: string[];
      };
      '7,1,0': {
          name: string[];
      };
      '7,2,1': {};
      '7,2,-1': {};
      '7,3,1': {};
      '7,3,-1': {};
      '7,4,1': {};
      '7,4,-1': {};
      '7,5,1': {};
      '7,5,-1': {};
      '7,6,1': {};
      '7,6,-1': {};
      '7,7,1': {};
      '7,7,-1': {};
      '7,8,0': {};
      '7,9,1': {};
      '7,9,-1': {};
      '7,10,1': {};
      '7,10,-1': {};
      '7,11,1': {};
      '7,11,-1': {};
      '7,12,0': {};
      '7,13,1': {};
      '7,13,-1': {};
      '7,14,1': {};
      '7,14,-1': {};
      '7,15,0': {};
      '7,16,1': {
          name: string[];
      };
      '7,16,-1': {};
      '7,17,0': {};
      '7,18,1': {};
      '7,18,-1': {};
      '7,19,1': {};
      '7,19,-1': {};
      '7,20,1': {
          name: string[];
      };
      '7,20,-1': {
          name: string[];
      };
      '7,21,1': {};
      '7,21,-1': {
          name: string[];
      };
      '7,22,0': {
          name: string[];
      };
      '7,23,1': {};
      '7,23,-1': {
          name: string[];
      };
      '7,24,1': {};
      '7,24,-1': {
          name: string[];
      };
      '7,25,1': {};
      '7,25,-1': {};
      '7,26,1': {};
      '7,26,-1': {};
      '7,27,1': {};
      '7,27,-1': {
          name: string[];
      };
      '7,28,1': {};
      '7,28,-1': {};
      '7,29,1': {};
      '7,29,-1': {};
      '7,30,1': {
          name: string[];
      };
      '7,30,-1': {};
      '7,31,1': {
          name: string[];
      };
      '7,31,-1': {
          name: string[];
      };
      '7,32,1': {
          name: string[];
      };
      '7,32,-1': {
          name: string[];
      };
      '7,33,0': {
          name: string[];
      };
      '7,34,0': {
          name: string[];
      };
      '7,35,0': {
          name: string[];
      };
      '7,36,1': {};
      '7,36,-1': {};
      '7,37,0': {};
      '7,38,1': {};
      '7,38,-1': {};
      '8,1,0': {
          name: string[];
      };
      '8,2,1': {};
      '8,2,-1': {};
      '8,3,0': {};
      '8,4,1': {};
      '8,4,-1': {};
      '8,5,1': {};
      '8,5,-1': {};
      '8,6,0': {};
      '8,7,0': {};
      '8,8,0': {};
      '8,9,0': {
          name: string[];
      };
      '8,10,0': {};
      '8,11,1': {};
      '8,11,-1': {
          name: string[];
      };
      '8,12,1': {};
      '8,12,-1': {};
      '8,13,1': {
          name: string[];
      };
      '8,13,-1': {};
      '8,14,1': {};
      '8,14,-1': {};
      '8,15,1': {};
      '8,15,-1': {};
      '8,16,1': {};
      '8,16,-1': {
          name: string[];
      };
      '8,17,0': {};
      '8,18,1': {};
      '8,18,-1': {};
      '8,19,1': {};
      '8,19,-1': {};
      '8,20,0': {};
      '8,21,0': {};
      '8,22,1': {};
      '8,22,-1': {
          name: string[];
      };
      '8,23,0': {
          name: string[];
      };
      '8,24,0': {};
      '8,25,0': {
          name: string[];
      };
      '8,26,0': {
          name: string[];
      };
      '8,27,1': {};
      '8,27,-1': {};
      '8,28,0': {
          name: string[];
      };
      '8,29,1': {};
      '8,29,-1': {};
      '9,1,0': {
          name: string[];
      };
      '9,2,1': {};
      '9,2,-1': {};
      '9,3,1': {};
      '9,3,-1': {};
      '9,4,1': {};
      '9,4,-1': {};
      '9,5,1': {};
      '9,5,-1': {};
      '9,6,0': {};
      '9,7,1': {
          name: string[];
      };
      '9,7,-1': {};
      '9,8,1': {};
      '9,8,-1': {};
      '9,9,0': {};
      '9,10,0': {};
      '9,11,1': {};
      '9,11,-1': {
          name: string[];
      };
      '9,12,0': {
          name: string[];
      };
      '10,1,0': {
          name: string[];
      };
      '10,2,0': {};
      '10,3,0': {};
      '10,4,0': {};
      '10,5,0': {
          name: string[];
      };
      '10,6,0': {
          name: string[];
      };
      '11,1,0': {
          name: string[];
      };
      '12,1,0': {
          name: string[];
      };
  };
  export function forteIndexToInversionsAvailable(card: any, index: any): number[];
  export function addressToTransposedNormalForm(address: any): any;
  export function addressToPrimeForm(address: any): any;
  export function addressToIntervalVector(address: any): any;
  export function intervalVectorToAddress(vector: any): any[];
  export function addressToZAddress(address: any): {
      cardinality: any;
      forteClass: any;
      inversion: any;
      pcOriginal: any;
  };
  export function addressToCommonNames(address: any): any;
  export function addressToForteName(address: any, classification?: string): string;
  export function seekChordTablesAddress(c: any): {
      cardinality: any;
      forteClass: any;
      inversion: any;
      pcOriginal: any;
  };

}
declare module 'music21j/music21/clef' {
  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/clef -- Clef objects
   *
   * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–19, Michael Scott Cuthbert and cuthbertLab
   *
   * Clef module, see {@link music21.clef} for namespace
   * Clef related objects and properties
   *
   * @exports music21/clef
   * @namespace music21.clef
   * @memberof music21
   * @requires music21/base
   * @requires music21/pitch
   */
  import * as base from 'music21j/music21/base';
  import * as pitch from 'music21j/music21/pitch';
  import { Stream } from 'music21j/music21/stream';
  /**
   *
   * @type {
   *     {bass: number, soprano: number, tenor: number, percussion: number,
   *     'mezzo-soprano': number, alto: number, treble: number}}
   */
  export const lowestLines: {
      treble: number;
      soprano: number;
      'mezzo-soprano': number;
      alto: number;
      tenor: number;
      bass: number;
      percussion: number;
  };
  /**
   *
   * @type {
   *     {bass: number, soprano: number, tenor: number, percussion: number,
   *     'mezzo-soprano': number, alto: number, treble: number}}
   */
  export const nameToLine: {
      treble: number;
      soprano: number;
      'mezzo-soprano': number;
      alto: number;
      tenor: number;
      bass: number;
      percussion: number;
  };
  /**
   *
   * @type {
   *     {bass: string, soprano: string, tenor: string, percussion: string,
   *     'mezzo-soprano': string, alto: string, treble: string}}
   */
  export const nameToSign: {
      treble: string;
      soprano: string;
      'mezzo-soprano': string;
      alto: string;
      tenor: string;
      bass: string;
      percussion: string;
  };
  /**
   * Clef name can be one of
   * "treble", "bass", "soprano", "mezzo-soprano", "alto", "tenor", "percussion"
   *
   * @param {string} name - clef name
   * @param {number} [octaveChange=0] - ottava
   * @property {string} [name]
   * @property {number} lowestLine - diatonicNoteNum (C4 = 29) for the
   *     lowest line (in a five-line staff)
   * @property {number} lowestLineTrebleOffset - difference between the first line
   *     of this staff and the first line in treble clef
   * @property {number} octaveChange
   */
  export class Clef extends base.Music21Object {
      static get className(): string;
      name: string;
      sign: string;
      line: number;
      octaveChange: number;
      lowestLine: number;
      lowestLineTrebleOffset: number;
      constructor(name?: string, octaveChange?: number);
      stringInfo(): string;
      /**
       * returns a new pitch object if the clef name is not Treble
       * designed so it would look the same as it would in treble clef.
       * for instance, bass-clef 2nd-space C# becomes treble clef 2nd-space A#
       * used for Vex.Flow which requires all pitches to be input as if they
       * are in treble clef.
       */
      convertPitchToTreble(p: pitch.Pitch): pitch.Pitch;
      getStemDirectionForPitches(pitchList: pitch.Pitch | pitch.Pitch[], { firstLastOnly, extremePitchOnly, }?: {
          firstLastOnly?: boolean;
          extremePitchOnly?: boolean;
      }): string;
  }
  /**
   * A TrebleClef (same as new music21.clef.Clef('treble'))
   *
   * @class TrebleClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  export class TrebleClef extends Clef {
      static get className(): string;
      constructor();
  }
  /**
   * A TrebleClef down an octave (same as new music21.clef.Clef('treble', -1))
   *
   * Unlike music21p, currently not a subclass of TrebleClef.
   *
   * @class Treble8vbClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  export class Treble8vbClef extends Clef {
      static get className(): string;
      constructor();
  }
  /**
   * A TrebleClef up an octave (same as new music21.clef.Clef('treble', 1))
   *
   * @class Treble8vaClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  export class Treble8vaClef extends Clef {
      static get className(): string;
      constructor();
  }
  /**
   * A BassClef (same as new music21.clef.Clef('bass'))
   *
   * @class BassClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  export class BassClef extends Clef {
      static get className(): string;
      constructor();
  }
  /**
   * A BassClef down an octave (same as new music21.clef.Clef('bass', -1))
   *
   * @class Bass8vbClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  export class Bass8vbClef extends Clef {
      static get className(): string;
      constructor();
  }
  /**
   * An AltoClef (same as new music21.clef.Clef('alto'))
   *
   * @class AltoClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  export class AltoClef extends Clef {
      static get className(): string;
      constructor();
  }
  /**
   * A Tenor Clef (same as new music21.clef.Clef('tenor'))
   *
   * @class TenorClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  export class TenorClef extends Clef {
      static get className(): string;
      constructor();
  }
  /**
   * A Soprano Clef (same as new music21.clef.Clef('soprano'))
   *
   * @class SopranoClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  export class SopranoClef extends Clef {
      static get className(): string;
      constructor();
  }
  /**
   * A Mezzo-Soprano Clef (same as new music21.clef.Clef('mezzo-soprano'))
   *
   * @class MezzoSopranoClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  export class MezzoSopranoClef extends Clef {
      static get className(): string;
      constructor();
  }
  /**
   * A Percussion Clef (same as new music21.clef.Clef('percussion'))
   *
   * First line is treated as if it's treble clef. Not available as "bestClef"
   *
   * @class PercussionClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  export class PercussionClef extends Clef {
      static get className(): string;
      constructor();
  }
  export const all_clefs: {
      TrebleClef: typeof TrebleClef;
      Treble8vbClef: typeof Treble8vbClef;
      Treble8vaClef: typeof Treble8vaClef;
      BassClef: typeof BassClef;
      Bass8vbClef: typeof Bass8vbClef;
      AltoClef: typeof AltoClef;
      TenorClef: typeof TenorClef;
      SopranoClef: typeof SopranoClef;
      MezzoSopranoClef: typeof MezzoSopranoClef;
      PercussionClef: typeof PercussionClef;
  };
  /**
   * Looks at the pitches in a Stream and returns the best clef
   * of Treble and Bass
   *
   */
  export function bestClef(st: Stream, { recurse }?: {
      recurse?: boolean;
  }): Clef;
  /**
   *
   * @param {string} clefString
   * @param {number} [octaveShift=0]
   * @returns {music21.clef.Clef}
   */
  export function clefFromString(clefString: any, octaveShift?: number): any;

}
declare module 'music21j/music21/common' {
  /**
   * common functions
   * functions that are useful everywhere...
   *
   * @exports music21/common
   * @memberof music21
   */
  /**
   * concept borrowed from Vex.Flow.Merge, though here the source can be undefined;
   * http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
   * recursive parts used in .clone()
   *
   * @function music21.common.merge
   * @param {Object} destination - object to have attributes placed into
   * @param {Object} source - object to take attributes from.
   * @memberof music21.common
   * @returns {Object} destination
   */
  export function merge(destination: any, source: any): any;
  export function range(start: any, stop: any, step: any): any;
  /**
   * Mix in another class into this class -- a simple form of multiple inheritance.
   * See articulations.Marcato for an example.
   *
   */
  export function mixin(OtherParent: any, thisClassOrObject: any): void;
  /**
   * Aggregation -- closer to true multiple inheritance -- prefers last class's functions.  See
   * https://stackoverflow.com/questions/29879267/es6-class-multiple-inheritance
   *
   *  not currently used...
   */
  /**
   * posMod - return a modulo value that is not negative
   *
   * @param  {int} a value
   * @param  {int} b modulo
   * @return {int}   a mod b between 0 and b - 1
   */
  export function posMod(a: any, b: any): number;
  /**
   *
   * Returns the statistical mode (most commonly appearing element)
   * in a.
   *
   * In case of tie, returns the first element to reach the maximum
   * number of occurrences.
   *
   * @function music21.common.statisticalMode
   * @param {Array<*>} a - an array to analyze
   * @returns {Object} element with the highest frequency in a
   */
  export function statisticalMode(a: any): any;
  /**
   * fromRoman - Convert a Roman numeral (upper or lower) to an int.
   *
   * @param  {string} num roman numeral representation of a number
   * @return {int}     integer value of roman numeral;
   */
  export function fromRoman(num: any): number;
  /**
   * toRoman - Convert a number from 1 to 3999 to a roman numeral
   *
   * @param  {int} num number to convert
   * @return {string}     as roman numeral
   */
  export function toRoman(num: any): string;
  /**
   * Creates an SVGElement of an SVG figure using the correct `document.createElementNS` call.
   *
   * @function music21.common.makeSVGright
   * @param {string} [tag='svg'] - a tag, such as 'rect', 'circle', 'text', or 'svg'
   * @param {Object} [attrs] - attributes to pass to the tag.
   * @memberof music21.common
   * @returns {SVGElement}
   */
  export function makeSVGright(tag?: string, attrs?: {}): SVGElement;
  /**
   * Take a number such as 32 and return a string such as "nd"
   * (for "32nd") etc.
   *
   * @function music21.common.ordinalAbbreviation
   * @param {number} value
   * @param {boolean} [plural=false] - make plural (note that "21st" plural is "21st")
   * @return {string}
   */
  export function ordinalAbbreviation(value: number, plural?: boolean): string;
  /**
   * Find a rational number approximation of this floating point.
   *
   * @function music21.common.rationalize
   * @param {number} ql - number to rationalize
   * @param {number} [epsilon=0.001] - how close to get
   * @param {int} [maxDenominator=50] - maximum denominator
   * @returns {object|undefined} {'numerator: numerator, 'denominator': denominator}
   */
  export function rationalize(ql: number, epsilon?: number, maxDenominator?: number): {
      numerator: number;
      denominator: number;
  };
  /**
   * Change something that could be a string or number and might
   * end with "px" to a number.
   *
   * "400px" -> 400
   *
   * @function music21.common.stripPx
   * @param {number|string} str -- string that might have 'px' at the end or not
   * @returns {number} a number to use
   */
  export function stripPx(str: any): any;
  /**
   * Find name in the query string (?name=value) and return value.
   *
   * @function music21.common.urlParam
   * @param {string} name - url parameter to find
   * @returns {string} may be "" if empty.
   */
  export function urlParam(name: any): string;
  export function arrayEquals(a1: any, a2: any): boolean;
  export class SingletonCounter {
      call(): number;
  }
  export const urls: {
      css: string;
      webResources: string;
      midiPlayer: string;
      soundfontUrl: string;
  };
  export function hyphenToCamelCase(usrStr: string): string;
  export function numToIntOrFloat(value: number): number;
  /**
   *
   * @param {string} path
   * @returns {string}
   */
  export const pathSimplify: (path: any) => string;
  export function isFloat(num: any): boolean;
  /**
   * Returns either the original number (never a fraction, since js does not have them)
   * or the slightly rounded, correct representation.
   *
   * Uses a shared memory buffer to give the conversion.
   */
  export function opFrac(num: any): any;

}
declare module 'music21j/music21/converter' {
  export function parse(txt: string): import("music21j/music21/stream").Score;

}
declare module 'music21j/music21/debug' {
  export const debug: boolean;

}
declare module 'music21j/music21/derivation' {
  import { Music21Object } from 'music21j/music21/base';
  export class Derivation {
      client: Music21Object;
      method: string;
      origin: Music21Object;
      constructor(client: Music21Object);
      clone(): Derivation;
      chain(): Generator<Music21Object, void, void>;
      rootDerivation(): Music21Object | undefined;
  }
  export default Derivation;

}
declare module 'music21j/music21/duration' {
  import * as prebase from 'music21j/music21/prebase';
  /**
   * Object mapping int to name, as in `{1: 'whole'}` etc.
   *
   * @memberof music21.duration
   * @type {Object}
   */
  export const typeFromNumDict: {
      1: string;
      2: string;
      4: string;
      8: string;
      16: string;
      32: string;
      64: string;
      128: string;
      256: string;
      512: string;
      1024: string;
      0: string;
      '0.5': string;
      '0.25': string;
      '0.125': string;
      '0.0625': string;
  };
  export const quarterTypeIndex = 6;
  export const ordinalTypeFromNum: string[];
  export const vexflowDurationArray: string[];
  /**
   * Duration object; found as the `.duration` attribute on Music21Object instances
   * such as {@link music21.note.Note}
   *
   * @class Duration
   * @memberof music21.duration
   * @param {(number|undefined)} ql - quarterLength (default 1.0)
   */
  export class Duration extends prebase.ProtoM21Object {
      static get className(): string;
      isGrace: boolean;
      protected _quarterLength: number;
      protected _dots: number;
      protected _durationNumber: any;
      protected _type: string;
      protected _tuplets: Tuplet[];
      constructor(ql?: string | number);
      stringInfo(): string;
      /**
       * Read or sets the number of dots on the duration.
       *
       * Updates the quarterLength
       *
       * @type {number}
       * @default 0
       * @example
       * var d = new music21.duration.Duration(2);
       * d.dots === 0; // true
       * d.dots = 1;
       * d.quarterLength == 3; // true;
       */
      get dots(): number;
      set dots(numDots: number);
      /**
       * Read or sets the quarterLength of the Duration
       *
       * Updates the type, dots, tuplets(?)
       *
       * @type {number}
       * @default 1.0
       * @example
       * var d = new music21.duration.Duration(2);
       * d.quarterLength == 2.0; // true;
       * d.quarterLength = 1.75;
       * d.dots == 2; // true
       * d.type == 'quarter'; // true
       */
      get quarterLength(): number;
      set quarterLength(ql: number);
      /**
       * Read or sets the type of the duration.
       *
       * Updates the quarterLength
       *
       * @type {string}
       * @default 'quarter'
       * @example
       * var d = new music21.duration.Duration(2);
       * d.type == 'half; // true
       * d.type = 'breve';
       * d.quarterLength == 8.0; // true
       * d.dots = 1;
       * d.type = 'quarter'; // will not change dots
       * d.quarterLength == 1.5; // true
       */
      get type(): string;
      set type(typeIn: string);
      /**
       * Reads the tuplet Array for the duration.
       *
       * The tuplet array should be considered Read Only.
       * Use {@link music21.duration.Duration#appendTuplet} to
       * add a tuplet (no way to remove yet)
       *
       * @type {Tuplet[]}
       * @default []
       */
      get tuplets(): Tuplet[];
      /**
       * Read-only: the duration expressed for VexFlow
       *
       * @type {string}
       * @default 'd'
       * @readonly
       * @example
       * var d = new music21.duration.Duration(2);
       * d.vexflowDuration == 'h'; // true;
       * d.dots = 2;
       * d.vexflowDuration == 'hdd'; // true;
       */
      get vexflowDuration(): string;
      cloneCallbacksTupletFunction(tupletKey: any, ret: any, obj: any, deep: any, memo: any): void;
      /**
       *
       * @param {number} ql
       * @returns {number}
       * @private
       */
      _findDots(ql: any): number;
      updateQlFromFeatures(): void;
      updateFeaturesFromQl(): void;
      /**
       * Add a tuplet to music21j
       *
       * @param {Tuplet} newTuplet - tuplet to add to `.tuplets`
       * @param {boolean} [skipUpdateQl=false] - update the quarterLength afterwards?
       * @returns {this}
       */
      appendTuplet(newTuplet: Tuplet, skipUpdateQl?: boolean): this;
  }
  /**
   * Represents a Tuplet; found in {@link music21.duration.Duration#tuplets}
   *
   * @memberof music21.duration
   * @param {number} [numberNotesActual=3] - numerator of the tuplet
   * @param {number} [numberNotesNormal=2] - denominator of the tuplet
   * @param {(music21.duration.Duration|number)} [durationActual] - duration or
   *     quarterLength of duration type, default music21.duration.Duration(0.5)
   * @param {(music21.duration.Duration|number)} [durationNormal] - unused;
   *     see music21p for description
   */
  export class Tuplet extends prebase.ProtoM21Object {
      static get className(): string;
      numberNotesActual: number;
      numberNotesNormal: number;
      durationActual: Duration;
      durationNormal: Duration;
      frozen: boolean;
      type: any;
      bracket: boolean;
      placement: string;
      tupletActualShow: string;
      tupletNormalShow: string;
      constructor(numberNotesActual?: number, numberNotesNormal?: number, durationActual?: any, durationNormal?: any);
      /**
       * A nice name for the tuplet.
       *
       * @type {string}
       * @readonly
       */
      get fullName(): string;
      /**
       * Set both durationActual and durationNormal for the tuplet.
       *
       * @param {string} type - a duration type, such as `half`, `quarter`
       * @returns {music21.duration.Duration} A converted {@link music21.duration.Duration} matching `type`
       */
      setDurationType(type: any): Duration;
      /**
       * Sets the tuplet ratio.
       *
       * @param {Number} actual - number of notes in actual (e.g., 3)
       * @param {Number} normal - number of notes in normal (e.g., 2)
       * @returns {undefined}
       */
      setRatio(actual: any, normal: any): void;
      /**
       * Get the quarterLength corresponding to the total length that
       * the completed tuplet (i.e., 3 notes in a triplet) would occupy.
       *
       * @returns {Number} A quarter length.
       */
      totalTupletLength(): number;
      /**
       * The amount by which each quarter length is multiplied to get
       * the tuplet. For instance, in a normal triplet, this is 0.666
       *
       * @returns {Number} A float of the multiplier
       */
      tupletMultiplier(): number;
  }

}
declare module 'music21j/music21/dynamics' {
  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/dynamics -- Dynamics
   *
   * note that Vex.Flow does not support Dynamics yet and we do not support MIDI dynamics,
   *  so currently of limited value...
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * dynamics Module. See {@link music21.dynamics} for namespace
   *
   * Dynamics related objects.
   *
   * Currently do not export to Vexflow.  :-(
   *
   * @exports music21/dynamics
   * @namespace music21.dynamics
   * @memberof music21
   * @requires music21/base
   */
  import * as base from 'music21j/music21/base';
  export const shortNames: string[];
  export const longNames: {
      ppp: string[];
      pp: string[];
      p: string[];
      mp: string[];
      mf: string[];
      f: string[];
      fp: string[];
      sf: string[];
      ff: string[];
      fff: string[];
  };
  export const englishNames: {
      ppp: string[];
      pp: string[];
      p: string[];
      mp: string[];
      mf: string[];
      f: string[];
      ff: string[];
      fff: string[];
  };
  export const dynamicStrToScalar: {
      None: number[];
      n: number[];
      pppp: number[];
      ppp: number[];
      pp: number[];
      p: number[];
      mp: number[];
      mf: number[];
      f: number[];
      fp: number[];
      sf: number[];
      ff: number[];
      fff: number[];
      ffff: number[];
  };
  /**
   * A representation of a dynamic.
   *
   * @class Dynamic
   * @memberof music21.dynamics
   * @extends music21.base.Music21Object
   * @param {number|string} value - either a number between 0 and 1 or a dynamic mark such as "ff" or "mp"
   * @property {string|undefined} value - a name such as "pp" etc.
   * @property {string|undefined} longName - a longer name such as "pianissimo"
   * @property {string|undefined} englishName - a name such as "very soft"
   * @property {number} volumeScalar - a number between 0 and 1.
   */
  export class Dynamic extends base.Music21Object {
      static get className(): string;
      protected _value: string;
      protected _volumeScalar: number;
      longName: string;
      englishName: string;
      constructor(value: string | number);
      get value(): string | number;
      set value(value: string | number);
      get volumeScalar(): number;
      set volumeScalar(value: number);
  }

}
declare module 'music21j/music21/editorial' {
  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/editorial -- Representations of editorial information
   *
   * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
   */
  import { ProtoM21Object } from 'music21j/music21/prebase';
  export class Editorial extends ProtoM21Object {
      static get className(): string;
      comments: any[];
      footnotes: any[];
      ficta: any;
      harmonicInterval: any;
      melodicInterval: any;
  }
  export default Editorial;

}
declare module 'music21j/music21/exceptions21' {
  class ExtendableError extends Error {
      constructor(message: any);
  }
  export class Music21Exception extends ExtendableError {
  }
  export class StreamException extends Music21Exception {
  }
  export {};

}
declare module 'music21j/music21/expressions' {
  /**
   * Expressions module.  See {@link music21.expressions}
   * Expressions can be note attached (`music21.note.Note.expressions[]`) or floating...
   *
   * @exports music21/expressions
   * @namespace music21.expressions
   * @memberof music21
   * @requires music21/expressions
   */
  import Vex from 'vexflow';
  import * as base from 'music21j/music21/base';
  import { ArticulationPlacement, VexflowArticulationParams } from 'music21j/music21/articulations';
  /**
   * Expressions can be note attached (`music21.note.Note.expressions[]`) or floating...
   *
   * @class Expression
   * @memberof music21.expressions
   * @extends music21.base.Music21Object
   * @property {string} name
   * @property {string} vexflowModifier
   * @property {number} setPosition
   */
  export class Expression extends base.Music21Object {
      static get className(): string;
      name: string;
      vexflowModifier: string;
      placement: ArticulationPlacement;
      /**
       * Renders this Expression as a Vex.Flow.Articulation
       *
       * (this is not right for all cases)
       *
       * @returns {Vex.Flow.Articulation}
       */
      vexflow({ stemDirection }?: VexflowArticulationParams): Vex.Flow.Articulation;
  }
  /**
   * A fermata...
   *
   * @class Fermata
   * @memberof music21.expressions
   * @extends music21.expressions.Expression
   */
  export class Fermata extends Expression {
      static get className(): string;
      constructor();
  }
  export class Ornament extends Expression {
      static get className(): string;
      name: string;
      vexflow({ stemDirection }?: VexflowArticulationParams): Vex.Flow.Articulation;
  }
  export class Trill extends Ornament {
      static get className(): string;
      constructor();
  }
  export class Turn extends Ornament {
      static get className(): string;
      constructor();
  }
  export class InvertedTurn extends Turn {
      static get className(): string;
      constructor();
  }
  export class GeneralMordent extends Ornament {
      static get className(): string;
  }
  /**
   * note that Vexflow's definition of mordent/inverted mordent is backwards
   * from music theory. -- see music21p for more details.
   */
  export class Mordent extends GeneralMordent {
      static get className(): string;
      constructor();
  }
  export class InvertedMordent extends GeneralMordent {
      static get className(): string;
      constructor();
  }

}
declare module 'music21j/music21/figuredBass' {
  /**
   * @namespace music21.figuredBass
   * @exports music21/figuredBass
   */
  import * as pitch from 'music21j/music21/pitch';
  /**
   * In music21p is in figuredBass.notation -- eventually to be moved there.
   */
  /**
   * @memberof music21.figuredBass
   */
  export class Notation {
      notationColumn: string;
      figureStrings: string[];
      origNumbers: number[];
      origModStrings: any;
      numbers: number[];
      modifierStrings: string[];
      modifiers: Modifier[];
      figures: Figure[];
      /**
       *
       * @param {string} [notationColumn='']
       * @property {string[]} figureStrings
       * @property {int[]} origNumbers
       * @property {int[]} numbers
       * @property {string[]} modifierStrings
       * @property {Modifier[]} modifiers
       * @property {Figure[]} figures
       */
      constructor(notationColumn?: string);
      /**
       * _parseNotationColumn - Given a notation column below a pitch, defines both this.numbers
       *    and this.modifierStrings, which provide the intervals above the
       *    bass and (if necessary) how to modify the corresponding pitches
       *    accordingly.
       *
       * @return {undefined}
       */
      _parseNotationColumn(): void;
      _translateToLonghand(): void;
      _getModifiers(): void;
      _getFigures(): void;
  }
  /**
   * @memberOf music21.figuredBass
   */
  export class Figure {
      number: number;
      modifierString: string;
      modifier: Modifier;
      constructor(number: any, modifierString: any);
  }
  /**
   * @memberOf music21.figuredBass
   */
  export class Modifier {
      modifierString: string;
      accidental: pitch.Accidental;
      constructor(modifierString: string);
      _toAccidental(): pitch.Accidental;
      modifyPitchName(pitchNameToAlter: any): string;
      modifyPitch(pitchToAlter: any, inPlace: any): any;
  }

}
declare module 'music21j/music21/fromPython' {
  /**
   *
   * @class Converter
   * @memberof music21.fromPython
   * @property {boolean} debug
   * @property {Array<string>} knownUnparsables - list of classes that cannot be parsed
   * @property {Object} handlers - object mapping string names of classes to a set of
   * function calls to perform when restoring or post-restoring.
   * (too complicated to explain; read the code)
   */
  export class Converter {
      debug: boolean;
      knownUnparsables: string[];
      handlers: any;
      currentPart: any;
      lastClef: any;
      lastKeySignature: any;
      lastTimeSignature: any;
      constructor();
      /**
       * Fixes up some references that cannot be unpacked from jsonpickle.
       *
       * @param {music21.stream.Stream} s - stream after unpacking from jsonpickle
       * @returns {music21.stream.Stream}
       */
      streamPostRestore(s: any): any;
      /**
       * Run the main decoder
       *
       * @param {string} jss - stream encoded as JSON
       * @returns {music21.stream.Stream}
       */
      run(jss: any): any;
  }

}
declare module 'music21j/music21/harmony' {
  import * as chord from 'music21j/music21/chord';
  import * as key from 'music21j/music21/key';
  export class Harmony extends chord.Chord {
      static get className(): string;
      protected _writeAsChord: boolean;
      protected _roman: any;
      chordStepModifications: any[];
      protected _degreesList: any[];
      protected _key: key.Key;
      protected _figure: string;
      constructor(figure: string, { parseFigure, updatePitches, }?: {
          parseFigure?: boolean;
          updatePitches?: boolean;
      });
      _parseFigure(): void;
      _updatePitches(): void;
      get figure(): string;
      set figure(newFigure: string);
      get key(): key.Key;
      set key(keyOrScale: key.Key);
      findFigure(): void;
  }

}
declare module 'music21j/music21/instrument' {
  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/instrument -- instrument objects
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  import * as base from 'music21j/music21/base';
  export const global_usedChannels: number[];
  export const maxMidi: number;
  /**
   *
   * @type {Array<{fn: string, name: string, midiNumber: number}>}
   */
  export const info: {
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
  export class Instrument extends base.Music21Object {
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
  export function find(fn: any, inst?: any): any;

}
declare module 'music21j/music21/interval' {
  import * as note from 'music21j/music21/note';
  import * as prebase from 'music21j/music21/prebase';
  import * as pitch from 'music21j/music21/pitch';
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
  export const Direction: {
      DESCENDING: number;
      OBLIQUE: number;
      ASCENDING: number;
  };
  /**
   * N.B. a dict in music21p -- the indexes here let Direction call them + 1
   *
   * @memberof music21.interval
   * @example
   * console.log(music21.interval.IntervalDirectionTerms[music21l.interval.Direction.OBLIQUE + 1])
   * // "Oblique"
   */
  export const IntervalDirectionTerms: string[];
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
  export const MusicOrdinals: string[];
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
      static get className(): string;
      value: number;
      directed: number;
      undirected: number;
      direction: number;
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
      constructor(gi: number);
      /**
       * Returns a new GenericInterval which is the mod7inversion; 3rds (and 10ths etc.) to 6ths, etc.
       *
       * @returns {music21.interval.GenericInterval}
       */
      complement(): GenericInterval;
      /**
       * Returns a new GenericInterval which has the opposite direction
       * (descending becomes ascending, etc.)
       *
       * @returns {music21.interval.GenericInterval}
       */
      reverse(): GenericInterval;
      /**
       * Given a specifier, return a new DiatonicInterval with this generic.
       *
       * @param {string|number} specifier - a specifier such as "P", "m", "M", "A", "dd" etc.
       * @returns {music21.interval.DiatonicInterval}
       */
      getDiatonic(specifier: string | number): DiatonicInterval;
      /**
       * Transpose a pitch by this generic interval, maintaining accidentals
       *
       * @param {music21.pitch.Pitch} p
       * @returns {music21.pitch.Pitch}
       */
      transposePitch(p: pitch.Pitch): pitch.Pitch;
  }
  export const IntervalSpecifiersEnum: {
      PERFECT: number;
      MAJOR: number;
      MINOR: number;
      AUGMENTED: number;
      DIMINISHED: number;
      DBLAUG: number;
      DBLDIM: number;
      TRPAUG: number;
      TRPDIM: number;
      QUADAUG: number;
      QUADDMIN: number;
  };
  export const IntervalNiceSpecNames: string[];
  export const IntervalPrefixSpecs: string[];
  export const IntervalOrderedPerfSpecs: string[];
  export const IntervalPerfSpecifiers: number[];
  export const IntervalPerfOffset = 4;
  export const IntervalOrderedImperfSpecs: string[];
  export const IntervalSpecifiers: number[];
  export const IntervalMajOffset = 5;
  export const IntervalSemitonesGeneric: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
      6: number;
      7: number;
  };
  export const IntervalAdjustPerfect: {
      P: number;
      A: number;
      AA: number;
      AAA: number;
      AAAA: number;
      d: number;
      dd: number;
      ddd: number;
      dddd: number;
  };
  export const IntervalAdjustImperf: {
      M: number;
      m: number;
      A: number;
      AA: number;
      AAA: number;
      AAAA: number;
      d: number;
      dd: number;
      ddd: number;
      dddd: number;
  };
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
      static get className(): string;
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
      invertedOrderedSpecifier: string;
      mod7inversion: string;
      constructor(specifier: string | number, generic: any);
      /**
       * Returns a ChromaticInterval object of the same size.
       *
       * @returns {music21.interval.ChromaticInterval}
       */
      getChromatic(): ChromaticInterval;
      /**
       *
       * @param {music21.pitch.Pitch} p
       * @returns {music21.pitch.Pitch}
       */
      transposePitch(p: pitch.Pitch): pitch.Pitch;
      /**
       *
       * @type {string}
       */
      get specifierAbbreviation(): string;
      /**
       *
       * @returns {number}
       */
      get cents(): number;
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
      static get className(): string;
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
      constructor(value?: number);
      /**
       *
       * @returns {music21.interval.ChromaticInterval}
       */
      reverse(): ChromaticInterval;
      /**
       * Transposes pitches but does not maintain accidentals, etc.
       *
       * @property {music21.pitch.Pitch} p - pitch to transpose
       * @returns {music21.pitch.Pitch}
       */
      transposePitch(p: pitch.Pitch): pitch.Pitch;
  }
  export const IntervalStepNames: string[];
  /**
   * @function music21.interval.convertDiatonicNumberToStep
   * @memberof music21.interval
   * @param {number} dn - diatonic number, where 29 = C4, C#4 etc.
   * @returns {Array} two element array of {string} stepName and {number} octave
   */
  export function convertDiatonicNumberToStep(dn: number): [string, number];
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
      static get className(): string;
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
      constructor(...restArgs: any[]);
      /**
       *
       * @returns {music21.interval.Interval}
       */
      get complement(): Interval;
      reinit(): void;
      /**
       *
       * @type {music21.note.Note|undefined}
       */
      get noteStart(): note.Note;
      set noteStart(n: note.Note);
      /**
       *
       * @type {music21.note.Note|undefined}
       */
      get noteEnd(): note.Note;
      set noteEnd(n: note.Note);
      /**
       * @returns {Boolean}
       */
      isConsonant(): boolean;
      /**
       * TODO: maxAccidental
       *
       * @param {music21.pitch.Pitch} p - pitch to transpose
       * @param {Object} config - configuration
       * @param {boolean} [config.reverse=false] -- reverse direction
       * @param {number} [config.maxAccidental=4] -- maximum accidentals to retain (unused)
       * @returns {music21.pitch.Pitch}
       */
      transposePitch(p: any, { reverse, maxAccidental }?: {
          reverse?: boolean;
          maxAccidental?: number;
      }): pitch.Pitch;
  }
  export function intervalFromGenericAndChromatic(gInt: any, cInt: any): Interval;
  /**
   * Convert two notes or pitches to a GenericInterval;
   */
  export function notesToGeneric(n1: any, n2: any): GenericInterval;
  export function convertStaffDistanceToInterval(staffDist: any): any;
  export function notesToChromatic(n1: any, n2: any): ChromaticInterval;
  export function intervalsToDiatonic(gInt: any, cInt: any): DiatonicInterval;
  export function _getSpecifierFromGenericChromatic(gInt: any, cInt: any): number;
  /**
   *
   * @param {music21.interval.Interval[]} intervalList
   * @returns {music21.interval.Interval}
   */
  export function add(intervalList: any): Interval;

}
declare module 'music21j/music21/key' {
  import * as base from 'music21j/music21/base';
  import * as pitch from 'music21j/music21/pitch';
  import * as scale from 'music21j/music21/scale';
  export const modeSharpsAlter: {
      major: number;
      minor: number;
      dorian: number;
      phrygian: number;
      lydian: number;
      mixolydian: number;
      locrian: number;
  };
  /**
   *
   * @param {string} textString
   * @returns {string}
   */
  export function convertKeyStringToMusic21KeyString(textString: any): any;
  /**
   * @class KeySignature
   * @memberof music21.key
   * @description Represents a key signature
   * @param {int} [sharps=0] -- the number of sharps (negative for flats)
   * @property {int} [sharps=0] -- number of sharps (negative for flats)
   * @property {string[]} flatMapping -- flat signatures 0-12 flats
   * @property {string[]} sharpMapping -- sharp signatures 0-12 sharps
   * @extends music21.base.Music21Object
   * @example
   * var ks = new music21.key.KeySignature(-3); //E-flat major or c minor
   * var s = new music21.stream.Stream();
   * s.keySignature = ks;
   * var n = new music21.note.Note('A-'); // A-flat
   * s.append(n);
   * s.appendNewDOM();
   */
  export class KeySignature extends base.Music21Object {
      static get className(): string;
      protected _sharps: number;
      protected _alteredPitchesCache: pitch.Pitch[];
      flatMapping: string[];
      sharpMapping: string[];
      constructor(sharps?: number);
      stringInfo(): string;
      get sharps(): number;
      set sharps(s: number);
      /**
       * Gives the width in pixels necessary to represent the key signature.
       */
      get width(): number;
      /**
       * An Array of Altered Pitches in KeySignature order (i.e., for flats, Bb, Eb, etc.)
       *
       * @type {music21.pitch.Pitch[]}
       * @readonly
       * @example
       * var ks = new music21.key.KeySignature(3)
       * var ap = ks.alteredPitches
       * var apName = [];
       * for (var i = 0; i < ap.length; i++) {
       *     apName.push(ap[i].name);
       * }
       * apName
       * // ["F#", "C#", "G#"]
       */
      get alteredPitches(): pitch.Pitch[];
      /**
       * Return the name of the major key with this many sharps
       *
       * @returns {(string|undefined)} name of key
       * @example
       * var ks = new music21.key.KeySignature(-3)
       * ks.majorName()
       * // "E-"
       */
      majorName(): string;
      /**
       * Return the name of the minor key with this many sharps
       * @returns {(string|undefined)}
       */
      minorName(): string;
      /**
       * returns the vexflow name (just the `majorName()` with "b" for "-") for
       * the key signature.  Does not create the object.
       *
       * Deprecated.
       *
       * @returns {string}
       */
      vexflow(): string;
      /**
       * Returns the accidental associated with a step in this key, or undefined if none.
       *
       * @param {string} step - a valid step name such as "C","D", etc., but not "C#" etc.
       * @returns {(music21.pitch.Accidental|undefined)}
       */
      accidentalByStep(step: string): pitch.Accidental | undefined;
      /**
       * Takes a pitch in C major and transposes it so that it has
       * the same step position in the current key signature.
       *
       * Does not support inPlace unlike music21p v6.
       *
       * @returns {music21.pitch.Pitch}
       * @example
       * var ks = new music21.key.KeySignature(-3)
       * var p1 = new music21.pitch.Pitch('B')
       * var p2 = ks.transposePitchFromC(p1)
       * p2.name
       * // "D"
       * var p3 = new music21.pitch.Pitch('G-')
       * var p4 = ks.transposePitchFromC(p3)
       * p4.name
       * // "B--"
       */
      transposePitchFromC(p: pitch.Pitch): pitch.Pitch;
  }
  /**
   * Create a Key object. Like a KeySignature but with ideas about Tonic, Dominant, etc.
   *
   * TODO: allow keyName to be a {@link music21.pitch.Pitch}
   * TODO: Scale mixin.
   *
   * @class Key
   * @memberof music21.key
   * @extends music21.key.KeySignature
   * @param {string} keyName -- a pitch name representing the key (w/ "-" for flat)
   * @param {string} [mode] -- if not given then the CASE of the keyName will be used ("C" => "major", "c" => "minor")
   */
  export class Key extends KeySignature {
      static get className(): string;
      tonic: pitch.Pitch;
      mode: string;
      _scale: scale.ConcreteScale;
      constructor(keyName?: string, mode?: any);
      stringInfo(): string;
      get tonicPitchNameWithCase(): string;
      /**
       * returns a {@link music21.scale.MajorScale} or {@link music21.scale.MinorScale}
       * object from the pitch object.
       *
       * @param {string|undefined} [scaleType=this.mode] - the type of scale, or the mode.
       * @returns {Object} A music21.scale.Scale subclass.
       */
      getScale(scaleType?: any): scale.ConcreteScale;
      get isConcrete(): boolean;
      getPitches(...args: any[]): any[];
      pitchFromDegree(degree: any, ...args: any[]): any;
      getScaleDegreeFromPitch(pitchTarget: any, ...args: any[]): number;
  }

}
declare module 'music21j/music21/keyboard' {
  /// <reference types="jquery" />
  import * as pitch from 'music21j/music21/pitch';
  /**
   * Represents a single Key
   *
   * @class Key
   * @memberof music21.keyboard
   * @property {Array<function>} callbacks - called when key is clicked/selected
   * @property {number} [scaleFactor=1]
   * @property {music21.keyboard.Keyboard|undefined} parent
   * @property {int} id - midi number associated with the key.
   * @property {music21.pitch.Pitch|undefined} pitchObj
   * @property {SVGElement|undefined} svgObj - SVG representing the drawing of the key
   * @property {SVGElement|undefined} noteNameSvgObj - SVG representing the note name drawn on the key
   * @property {string} keyStyle='' - css style information for the key
   * @property {string} keyClass='' - css class information for the key ("keyboardkey" + this is the class)
   * @property {number} width - width of key
   * @property {number} height - height of key
   */
  export class Key {
      classes: string[];
      callbacks: {
          click: any;
      };
      scaleFactor: number;
      parent: Keyboard;
      id: number;
      width: number;
      height: number;
      pitchObj: pitch.Pitch;
      svgObj: SVGElement;
      noteNameSvgObj: SVGElement;
      keyStyle: string;
      keyClass: string;
      /**
       * Gets an SVG object for the key
       *
       * @param {number} startX - X position in pixels from left of keyboard to draw key at
       * @returns {SVGElement} a SVG rectangle for the key
       */
      makeKey(startX: any): SVGElement;
      /**
       * Adds a circle (red) on the key (to mark middle C etc.)
       *
       * @param {string} [strokeColor='red']
       * @returns {SVGElement}
       */
      addCircle(strokeColor: any): SVGElement;
      /**
       * Adds the note name on the key
       *
       * @param {Boolean} [labelOctaves=false] - use octave numbers too?
       * @returns {this}
       */
      addNoteName(labelOctaves: any): this;
      /**
       * Removes the note name from the key (if exists)
       *
       * @returns {undefined}
       */
      removeNoteName(): void;
  }
  /**
   * Defaults for a WhiteKey (width, height, keyStyle, keyClass)
   *
   * @class WhiteKey
   * @memberof music21.keyboard
   * @extends music21.keyboard.Key
   */
  export class WhiteKey extends Key {
      constructor();
  }
  /**
   * Defaults for a BlackKey (width, height, keyStyle, keyClass)
   *
   * @class BlackKey
   * @memberof music21.keyboard
   * @extends music21.keyboard.Key
   */
  export class BlackKey extends Key {
      constructor();
  }
  /**
   * A Class representing a whole Keyboard full of keys.
   *
   * @class Keyboard
   * @memberof music21.keyboard
   * @property {number} whiteKeyWidth - default 23
   * @property {number} scaleFactor - default 1
   * @property {Object} keyObjects - a mapping of id to {@link music21.keyboard.Key} objects
   * @property {SVGElement} svgObj - the SVG object of the keyboard
   * @property {Boolean} markC - default true
   * @property {Boolean} showNames - default false
   * @property {Boolean} showOctaves - default false
   * @property {string|number} startPitch - default "C3" (a pitch string or midi number)
   * @property {string|number} endPitch - default "C5" (a pitch string or midi number)
   * @property {Boolean} hideable - default false -- add a way to hide and show keyboard
   * @property {Boolean} scrollable - default false -- add scroll bars to change octave
   */
  export class Keyboard {
      whiteKeyWidth: number;
      _defaultWhiteKeyWidth: number;
      _defaultBlackKeyWidth: number;
      scaleFactor: number;
      height: number;
      keyObjects: Map<any, any>;
      svgObj: SVGElement;
      markC: boolean;
      showNames: boolean;
      showOctaves: boolean;
      startPitch: string | number | pitch.Pitch;
      endPitch: string | number | pitch.Pitch;
      _startDNN: number;
      _endDNN: number;
      hideable: boolean;
      scrollable: boolean;
      callbacks: {
          click: any;
      };
      sharpOffsets: {
          0: number;
          1: number;
          3: number;
          4: number;
          5: number;
      };
      constructor();
      /**
       * Redraws the SVG associated with this Keyboard
       *
       * @returns {SVGElement} new svgDOM
       */
      redrawSVG(): SVGElement;
      /**
       * Appends a keyboard to the `where` parameter
       *
       * @param {jQuery|Node} [where]
       * @returns {music21.keyboard.Keyboard} this
       */
      appendKeyboard(where: any): this;
      /**
       * Handle a click on a given SVG object
       *
       * TODO(msc) - 2019-Dec -- separate into two calls, one for highlighting and one for playing.
       *
       * @param {SVGElement} keyRect - the dom object with the keyboard.
       */
      clickHandler(keyRect: any): void;
      /**
       * Draws the SVG associated with this Keyboard
       */
      createSVG(): SVGElement;
      /**
       * Puts a circle on middle c.
       *
       * @param {string} [strokeColor='red']
       */
      markMiddleC(strokeColor?: string): void;
      /**
       * Puts note names on every white key.
       *
       * @param {Boolean} [labelOctaves=false]
       */
      markNoteNames(labelOctaves: any): void;
      /**
       * Remove note names on the keys, if they exist
       *
       * @returns {this}
       */
      removeNoteNames(): this;
      /**
       * Wraps the SVG object inside a scrollable set of buttons
       *
       * Do not call this directly, just use createSVG after changing the
       * scrollable property on the keyboard to True.
       *
       * @param {SVGElement} svgDOM
       * @returns {JQuery}
       */
      wrapScrollable(svgDOM: SVGElement): JQuery;
      /**
       * Puts a hideable keyboard inside a Div with the proper controls.
       *
       * Do not call this directly, just use createSVG after changing the
       * hideable property on the keyboard to True.
       *
       * @param {Node} where
       * @param {SVGElement} keyboardSVG
       */
      appendHideableKeyboard(where: any, keyboardSVG: any): JQuery<HTMLElement>;
  }
  /**
   * triggerToggleShow -- event for keyboard is shown or hidden.
   *
   * @function music21.keyboard.triggerToggleShow
   * @param {Event} [e]
   */
  export const triggerToggleShow: (e: any) => void;
  /**
   * highlight the keyboard stored in "this" appropriately
   *
   * @function music21.keyboard.jazzHighlight
   * @param {music21.miditools.Event} e
   * @example
   * var midiCallbacksPlay = [music21.miditools.makeChords,
   *                          music21.miditools.sendToMIDIjs,
   *                          music21.keyboard.jazzHighlight.bind(k)];
   */
  export function jazzHighlight(e: any): void;

}
declare module 'music21j/music21/layout' {
  /**
   *
   * THIS IS CURRENTLY UNUSED
   * Does not work yet, so not documented
   *
   */
  import * as stream from 'music21j/music21/stream';
  /**
   * Divide a part up into systems and fix the measure
   * widths so that they are all even.
   *
   * Note that this is done on the part level even though
   * the measure widths need to be consistent across parts.
   *
   * This is possible because the system is deterministic and
   * will come to the same result for each part.  Opportunity
   * for making more efficient through this...
   *
   * @param {music21.stream.Score} score
   * @param {number} containerWidth
   * @returns {LayoutScore}
   */
  export function makeLayoutFromScore(score: any, containerWidth: any): LayoutScore;
  /**
   * @extends music21.stream.Score
   * @property {number|undefined} measureStart
   * @property {number|undefined} measureEnd
   * @property {number|undefined} width
   * @property {number|undefined} height
   */
  export class LayoutScore extends stream.Score {
      static get className(): string;
      scoreLayout: any;
      measureStart: any;
      measureEnd: any;
      protected _width: number;
      height: number;
      top: number;
      left: number;
      constructor();
      get pages(): stream.iterator.StreamIterator<import("music21j/music21/base").Music21Object>;
      get width(): any;
  }
  /**
   * All music must currently be on page 1.
   *
   * @extends music21.stream.Score
   * @property {number|undefined} measureStart
   * @property {number|undefined} measureEnd
   * @property {number|undefined} systemStart
   * @property {number|undefined} systemEnd
   */
  export class Page extends stream.Score {
      static get className(): string;
      pageNumber: number;
      measureStart: any;
      measureEnd: any;
      systemStart: any;
      systemEnd: any;
      pageLayout: any;
      _width: number;
      constructor();
      get systems(): stream.iterator.StreamIterator<import("music21j/music21/base").Music21Object>;
      get width(): any;
  }
  /**
   * @extends music21.stream.Score
   * @property {number|undefined} measureStart
   * @property {number|undefined} measureEnd
   * @property {number|undefined} width
   * @property {number|undefined} height
   * @property {number|undefined} top
   * @property {number|undefined} left
   */
  export class System extends stream.Score {
      static get className(): string;
      systemNumber: number;
      systemLayout: any;
      measureStart: any;
      measureEnd: any;
      protected _width: number;
      height: number;
      top: number;
      left: number;
      constructor();
      get staves(): stream.iterator.StreamIterator<import("music21j/music21/base").Music21Object>;
      get width(): any;
  }
  /**
   * @extends music21.stream.Score
   *
   */
  export class Staff extends stream.Part {
      static get className(): string;
      measureStart: number;
      measureEnd: number;
      staffNumber: number;
      optimized: number;
      top: number;
      left: number;
      protected _width: number;
      height: number;
      inheritedHeight: number;
      staffLayout: any;
      constructor();
      get width(): any;
  }

}
declare module 'music21j/music21/meter' {
  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/meter -- TimeSignature objects
   *
   * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
   *
   * meter module. See {@link music21.meter} namespace for details.
   * Meter and TimeSignature Classes (esp. {@link music21.meter.TimeSignature} ) and methods.
   *
   * @exports music21/meter
   *
   * @namespace music21.meter
   * @memberof music21
   * @requires music21/base
   * @requires music21/duration
   */
  import Vex from 'vexflow';
  import * as base from 'music21j/music21/base';
  import * as beam from 'music21j/music21/beam';
  import * as duration from 'music21j/music21/duration';
  import * as stream from 'music21j/music21/stream';
  import { Music21Object } from 'music21j/music21/base';
  /**
   * A MUCH simpler version of the music21p TimeSignature object.
   *
   * @param {string} meterString - a string ("4/4", "3/8" etc.) to initialize the TimeSignature.
   * @property {int} [numerator=4]
   * @property {int} [denominator=4]
   * @property {number[][]} beatGroups - groupings of beats; inner arrays are numerator, denominator
   * @property {string} ratioString - a string like "4/4"
   * @property {music21.duration.Duration} barDuration - a Duration object
   *     representing the expressed total length of the TimeSignature.
   */
  export class TimeSignature extends base.Music21Object {
      static get className(): string;
      _numerator: number;
      _denominator: number;
      _overwrittenBarDuration: any;
      symbol: string;
      symbolizeDenominator: boolean;
      _beatGroups: number[][];
      _overwrittenBeatCount: any;
      _overwrittenBeatDuration: any;
      constructor(value?: string, divisions?: any);
      stringInfo(): string;
      resetValues(value?: string, divisions?: any): void;
      load(value: string, divisions?: any): void;
      get numerator(): number;
      set numerator(s: number);
      get denominator(): number;
      set denominator(s: number);
      get ratioString(): string;
      set ratioString(meterString: string);
      get barDuration(): duration.Duration;
      set barDuration(value: duration.Duration);
      get beatGroups(): number[][];
      set beatGroups(newGroups: number[][]);
      /**
       *  Get the beatCount from the numerator, assuming fast 6/8, etc.
       *  unless .beatCount has been set manually.
       */
      get beatCount(): number;
      /**
       *  Manually set the beatCount to an int.
       */
      set beatCount(overwrite: number);
      /**
       * Gets a single duration.Duration object representing
       * the length of a beat in this time signature (using beatCount)
       * or, if set manually, it can return a list of Durations For
       * asymmetrical meters.
       */
      get beatDuration(): duration.Duration;
      /**
       * Set beatDuration to a duration.Duration object or
       * if the client can handle it, a list of Duration objects...
       */
      set beatDuration(overwrite: duration.Duration);
      /**
       * Compute the Beat Group according to this time signature.
       *
       * returns a list of numerator and denominators,
       *     find a list of beat groups.
       */
      computeBeatGroups(): number[][];
      offsetToIndex(qLenPos: number, { includeCoincidentBoundaries }?: {
          includeCoincidentBoundaries?: boolean;
      }): number;
      /**
       * Return a span of [start, end] for the current beat/beam grouping
       */
      offsetToSpan(offset: number): number[];
      /**
       * srcStream - a stream of elements.
       * options - an object with measureStartOffset
       */
      getBeams(srcStream: stream.Stream, options?: {}): beam.Beams[];
      /**
       *  Return the measure offset based on a Measure, if it exists,
       *  otherwise based on meter modulus of the TimeSignature.
       */
      getMeasureOffsetOrMeterModulusOffset(el: Music21Object): number;
      /**
       *  Given a quarter length position into the meter, return a numerical progress
          through the beat (where beats count from one) with a floating-point or fractional value
          between 0 and 1 appended to this value that gives the proportional progress into the beat.

          For faster, integer values, use simply `.getBeat()`

          NOTE: currently returns floats only, no fractions.

          TODO: this does not allow for irregular beat proportions
       */
      getBeatProportion(qLenPos: number): number;
      /**
       * Compute the Beat Group according to this time signature for VexFlow. For beaming.
       *
       * @returns {Array<Vex.Flow.Fraction>} a list of numerator and denominator groups, for VexFlow
       */
      vexflowBeatGroups(): Vex.Flow.Fraction[];
  }

}
declare module 'music21j/music21/miditools' {
  /// <reference types="jquery" />
  import * as MIDI from 'midicube';
  import '../../css/midiPlayer.css';
  import * as chord from 'music21j/music21/chord';
  import * as note from 'music21j/music21/note';
  import * as tempo from 'music21j/music21/tempo';
  export interface CallbackInterface {
      raw: (t: any, a: any, b: any, c: any) => Event;
      general: Function | Function[];
      sendOutChord: Function;
  }
  class _ConfigSingletonClass {
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
  export const config: _ConfigSingletonClass;
  /**
   * @class Event
   * @memberof music21.miditools
   * @param {number} t - timing information
   * @param {number} a - midi data 1 (N.B. a >> 4 = midiCommand )
   * @param {number} b - midi data 2
   * @param {number} c - midi data 3
   */
  export class Event {
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
       *
       * @returns {undefined}
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
   *
   * @memberof music21.miditools
   * @type {Object}
   */
  export const loadedSoundfonts: {};
  /**
   *  Clears chords that are older than miditools.heldChordTime
   *
   *  Runs a setTimeout on itself.
   *  Calls miditools.sendOutChord
   *
   *  @memberof music21.miditools
   */
  export function clearOldChords(): void;
  /**
   *  Take a series of jEvent noteOn objects and convert them to a single Chord object
   *  so long as they are all sounded within miditools.maxDelay milliseconds of each other.
   *  this method stores notes in miditools.heldChordNotes (Array).
   *
   *  @param {music21.miditools.Event} jEvent
   *  @memberof music21.miditools
   *  @returns undefined
   */
  export function makeChords(jEvent: any): void;
  /**
   * Take the list of Notes and makes a chord out of it, if appropriate and call
   * {@link music21.miditools.callbacks.sendOutChord} callback with the Chord or Note as a parameter.
   *
   * @memberof music21.miditools
   * @param {Array<music21.note.Note>} chordNoteList - an Array of {@link music21.note.Note} objects
   * @returns {(music21.note.Note|music21.chord.Chord|undefined)} A {@link music21.chord.Chord} object,
   * most likely, but maybe a {@link music21.note.Note} object)
   */
  export function sendOutChord(chordNoteList: any): any;
  /**
   * Quantizes the lastElement (passed in) or music21.miditools.lastElement.
   *
   * @memberof music21.miditools
   * @param {music21.note.GeneralNote} [lastElement] - A {@link music21.note.Note} to be quantized
   * @returns {music21.note.GeneralNote} The same {@link music21.note.Note} object passed in with
   * duration quantized
   */
  export function quantizeLastNote(lastElement?: any): any;
  /**
   * Callback to midiEvent.sendToMIDIjs.
   *
   * @memberof music21.miditools
   * @param {music21.miditools.Event} midiEvent - event to send out.
   * @returns undefined
   */
  export const sendToMIDIjs: (midiEvent: any) => void;
  /**
   * Called after a soundfont has been loaded. The callback is better to be specified elsewhere
   * rather than overriding this important method.
   *
   * @memberof music21.miditools
   * @param {string} soundfont The name of the soundfont that was just loaded
   * @param {function} callback A function to be called after the soundfont is loaded.
   */
  export function postLoadCallback(soundfont: any, callback: any): void;
  /**
   * method to load soundfonts while waiting for other processes that need them
   * to load first.
   *
   * @memberof music21.miditools
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
  export function loadSoundfont(soundfont: string, callback?: any): void;
  /**
   * MidiPlayer -- an embedded midi player including the ability to create a
   * playback device.
   *
   * @class MidiPlayer
   * @memberOf music21.miditools
   * @property {number} speed - playback speed scaling (1=default).
   * @property {JQuery|undefined} $playDiv - div holding the player,
   */
  export class MidiPlayer {
      player: MIDI.Player;
      speed: number;
      $playDiv: JQuery;
      state: string;
      constructor();
      /**
       * @param {jQuery|HTMLElement} [where]
       * @returns {jQuery}
       */
      addPlayer(where: any): JQuery<HTMLElement>;
      stopButton(): void;
      /**
       *
       * @returns {string}
       */
      playPng(): string;
      /**
       *
       * @returns {string}
       */
      pausePng(): string;
      /**
       *
       * @returns {string}
       */
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
   *
   * @memberof music21.miditools
   */
  export const callbacks: CallbackInterface;
  export const callBacks: CallbackInterface;
  export {};

}
declare module 'music21j/music21/musicxml/m21ToXml' {
  import { // eslint-disable-line import/no-cycle
  Stream, Measure, Part, Score } from 'music21j/music21/stream';
  import { Music21Object } from 'music21j/music21/base';
  import { GeneralNote } from 'music21j/music21/note';
  export class GeneralObjectExporter {
      generalObj: Music21Object;
      constructor(obj: Music21Object);
      parse(obj?: any): string;
      parseWellformedObject(sc: any): string;
      fromGeneralObj(obj: any): any;
      fromScore(sc: any): any;
      fromPart(p: any): any;
      fromMeasure(m: any): any;
      fromVoice(v: any): any;
      fromGeneralNote(n: any): any;
  }
  /**
   * @memberOf music21.musicxml.m21ToXml
   */
  export class XMLExporterBase {
      doc: XMLDocument;
      xmlRoot: any;
      constructor();
      asBytes({ noCopy }?: {
          noCopy?: boolean;
      }): string;
      xmlHeader(): string;
      /**
       * Note: this is not a method in music21p, but it needs access to this.doc in music21j
       */
      _setTagTextFromAttribute(m21El: any, xmlEl: any, tag: string, attributeName?: string, { transform, forceEmpty }?: {
          transform?: any;
          forceEmpty?: boolean;
      }): HTMLElement;
      seta(m21El: any, xmlEl: any, tag: any, options?: {}): HTMLElement;
      _setAttributeFromAttribute(m21El: any, xmlEl: any, xmlAttributeName: any, { attributeName, transform }?: {
          attributeName?: any;
          transform?: any;
      }): void;
      setb(m21El: any, xmlEl: any, xmlAttributeName: any, options?: {}): void;
      _synchronizeIds(element: any, m21Object: any): void;
      addDividerComment(comment?: string): void;
      /**
       * Helper method since SubElement does not exist in javascript document.implementation
       */
      subElement(el: HTMLElement, tag: string): HTMLElement;
      setColor(mxObject: any, m21Object: any): void;
      setEditorial(mxEl: any, el: any): void;
      accidentalToMx(a: any): HTMLElement;
      getRandomId(): string;
  }
  /**
   * @extends music21.musicxml.m21ToXml.XMLExporterBase
   */
  export class ScoreExporter extends XMLExporterBase {
      stream: Score;
      xmIdentification: any;
      scoreMetadata: any;
      spannerBundle: any;
      meterStream: any;
      scoreLayouts: any;
      firstScoreLayout: any;
      highestTime: number;
      refStreamOrTimeRange: number[];
      partExporterList: any[];
      instrumentList: any[];
      midiChannelList: any[];
      parts: Part[];
      constructor(score: any);
      parse(): any;
      emptyObject(): any;
      scorePreliminaries(): void;
      setPartsAndRefStream(): void;
      parsePartlikeScore(): void;
      postPartProcess(): void;
      setScoreHeader(): void;
      setPartList(): HTMLElement;
  }
  /**
   * @extends music21.musicxml.m21ToXml.XMLExporterBase
   */
  export class PartExporter extends XMLExporterBase {
      stream: Part;
      parent: ScoreExporter;
      meterStream: Stream;
      refStreamOrTimeRange: any;
      midiChannelList: any;
      instrumentStream: any;
      firstInstrumentObject: any;
      lastDivisions: number;
      spannerBundle: any;
      xmlPartId: any;
      constructor(partObj: any, { parent }?: {
          parent?: any;
      });
      parse(): any;
      getXmlScorePart(): HTMLElement;
  }
  /**
   * @extends music21.musicxml.m21ToXml.XMLExporterBase
   */
  export class MeasureExporter extends XMLExporterBase {
      stream: Measure;
      parent: PartExporter;
      currentDivisions: number;
      transpositionInterval: any;
      mxTranspose: any;
      measureOffsetStart: number;
      offsetInMeasure: number;
      currentVoiceId: any;
      rbSpanners: any[];
      spannerBundle: any;
      objectSpannerBundle: any;
      constructor(measureObj: any, { parent }?: {
          parent?: any;
      });
      parse(): any;
      mainElementsParse(): void;
      parseFlatElements(m: any, { backupAfterwards }?: {
          backupAfterwards?: boolean;
      }): void;
      parseOneElement(obj: any): void;
      /**
       *
       * @param {music21.note.GeneralNote} n
       * @param noteIndexInChord
       * @param chordParent
       * @returns {Node}
       */
      noteToXml(n: GeneralNote, { noteIndexInChord, chordParent }?: {
          noteIndexInChord?: number;
          chordParent?: any;
      }): HTMLElement;
      restToXml(r: any): HTMLElement;
      chordToXml(c: any): any[];
      durationXml(dur: any): HTMLElement;
      pitchToXml(p: any): HTMLElement;
      tupletToTimeModification(tup: any): HTMLElement;
      tieToXmlTie(t: any): any[];
      wrapObjectInAttributes(objectToWrap: any, methodToMx: any): HTMLElement;
      lyricToXml(l: any): HTMLElement;
      setMxAttributesObjectForStartOfMeasure(): HTMLElement;
      timeSignatureToXml(ts: any): HTMLTimeElement;
      keySignatureToXml(keyOrKeySignature: any): HTMLElement;
      clefToXml(clefObj: any): HTMLElement;
      setMxAttributes(): void;
  }

}
declare module 'music21j/music21/musicxml/xmlToM21' {
  /// <reference types="jquery" />
  import * as chord from 'music21j/music21/chord';
  import * as key from 'music21j/music21/key';
  import * as meter from 'music21j/music21/meter';
  import * as pitch from 'music21j/music21/pitch';
  import * as stream from 'music21j/music21/stream';
  import * as tie from 'music21j/music21/tie';
  import type { Music21Object } from 'music21j/music21/base';
  export class ScoreParser {
      xmlText: any;
      xmlUrl: any;
      $xmlRoot: any;
      stream: stream.Score;
      definesExplicitSystemBreaks: boolean;
      definesExplicitPageBreaks: boolean;
      mxScorePartDict: {};
      m21PartObjectsById: {};
      partGroupList: any[];
      parts: any[];
      musicXmlVersion: string;
      constructor();
      scoreFromUrl(url: any): JQuery.jqXHR<any>;
      scoreFromText(xmlText: any): stream.Score;
      scoreFromDOMTree(xmlDoc: any): stream.Score;
      xmlRootToScore($mxScore: any, inputM21: any): any;
      xmlPartToPart($mxPart: any, $mxScorePart: any): stream.Part;
      parsePartList($mxScore: any): void;
  }
  /**
   * @property {MeasureParser|undefined} lastMeasureParser
   * @property {music21.meter.TimeSignature|undefined} lastTimeSignature
   * @property {jQuery|undefined} $activeAttributes
   */
  export class PartParser {
      parent: ScoreParser;
      $mxPart: any;
      $mxScorePart: any;
      partId: string;
      stream: stream.Part;
      atSoundingPitch: boolean;
      staffReferenceList: any[];
      lastTimeSignature: any;
      lastMeasureWasShort: boolean;
      lastMeasureOffset: number;
      lastClefs: any;
      activeTuplets: any[];
      maxStaves: number;
      lastMeasureNumber: number;
      lastNumberSuffix: any;
      multiMeasureRestsToCapture: number;
      activeMultimeasureRestSpanner: any;
      activeInstrument: any;
      firstMeasureParsed: boolean;
      $activeAttributes: any;
      lastDivisions: number;
      appendToScoreAfterParse: boolean;
      lastMeasureParser: any;
      constructor($mxPart: any, $mxScorePart: any, parent?: any);
      parse(): void;
      parseXmlScorePart(): void;
      parseMeasures(): void;
      xmlMeasureToMeasure($mxMeasure: any): void;
      setLastMeasureInfo(m: any): void;
      adjustTimeAttributesFromMeasure(m: any): void;
  }
  export class MeasureParser {
      $mxMeasure: any;
      parent: PartParser;
      $mxMeasureElements: any[];
      stream: stream.Measure;
      divisions: any;
      transposition: any;
      staffReference: {};
      useVoices: boolean;
      voicesById: {};
      voiceIndices: any;
      staves: number;
      $activeAttributes: any;
      attributesAreInternal: boolean;
      measureNumber: number;
      numberSuffix: string;
      staffLayoutObjects: any[];
      $mxNoteList: any[];
      $mxLyricList: any[];
      nLast: any;
      chordVoice: any;
      fullMeasureRest: boolean;
      restAndNoteCount: {
          rest: number;
          note: number;
      };
      lastClefs: {
          0: any;
      };
      parseIndex: number;
      offsetMeasureNote: number;
      attributeTagsToMethods: {
          time: string;
          clef: string;
          key: string;
      };
      musicDataMethods: {
          note: string;
          attributes: string;
      };
      /**
       *
       * @param {jQuery} $mxMeasure
       * @param {PartParser} [parent]
       * @property {music21.note.GeneralNote|undefined} nLast
       * @property {jQuery|undefined} $activeAttributes
       */
      constructor($mxMeasure: any, parent?: PartParser);
      parse(): void;
      insertInMeasureOrVoice($mxObj: any, el: any): void;
      xmlToNote($mxNote: any): void;
      xmlToChord($mxNoteList: any): chord.Chord;
      xmlToSimpleNote($mxNote: any, freeSpanners?: boolean): any;
      xmlToPitch($mxNote: any, inputM21: any): any;
      xmlToAccidental($mxAccidental: any): pitch.Accidental;
      xmlToRest($mxRest: any): any;
      xmlNoteToGeneralNoteHelper(n: any, $mxNote: any, freeSpanners?: boolean): any;
      xmlToDuration($mxNote: any, inputM21: any): any;
      /**
       *
       * @param {jQuery} $mxNote
       * @returns {music21.tie.Tie}
       */
      xmlToTie($mxNote: any): tie.Tie;
      updateLyricsFromList(n: any, lyricList: any): void;
      /**
       *
       * @param {jQuery} $mxLyric
       * @param {music21.note.Lyric} [inputM21]
       * @returns {*|music21.note.Lyric|undefined}
       */
      xmlToLyric($mxLyric: any, inputM21?: any): any;
      insertIntoMeasureOrVoice($mxElement: JQuery, el: Music21Object): void;
      parseMeasureAttributes(): void;
      parseMeasureNumbers(): void;
      parseAttributesTag($mxAttributes: any): void;
      handleTimeSignature($mxTime: any): void;
      xmlToTimeSignature($mxTime: any): meter.TimeSignature;
      handleClef($mxClef: any): void;
      xmlToClef($mxClef: any): any;
      handleKeySignature($mxKey: any): void;
      xmlToKeySignature($mxKey: any): key.KeySignature;
  }
  const musicxml: {
      ScoreParser: typeof ScoreParser;
      PartParser: typeof PartParser;
      MeasureParser: typeof MeasureParser;
  };
  export default musicxml;

}
declare module 'music21j/music21/musicxml' {
  import * as m21ToXml from 'music21j/music21/musicxml/m21ToXml';
  import * as xmlToM21 from 'music21j/music21/musicxml/xmlToM21';
  export { m21ToXml, xmlToM21 };

}
declare module 'music21j/music21/note' {
  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/note -- Note, Rest, NotRest, GeneralNote
   *
   * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (music21p), Copyright (c) 2006–19, Michael Scott Cuthbert and cuthbertLab
   *
   * Module for note classes. See the namespace {@link music21.note}
   *
   * @requires music21/prebase
   * @requires music21/base
   * @requires music21/pitch
   * @requires music21/beam
   * @exports music21/note
   * Namespace for notes (single pitch) or rests, and some things like Lyrics that go on notes.
   *
   * @namespace music21.note
   * @memberof music21
   * @property {string[]} noteheadTypeNames - an Array of allowable notehead names.
   * @property {string[]} stemDirectionNames - an Array of allowable stemDirection names.
   */
  import Vex from 'vexflow';
  import * as prebase from 'music21j/music21/prebase';
  import * as base from 'music21j/music21/base';
  import * as pitch from 'music21j/music21/pitch';
  import * as beam from 'music21j/music21/beam';
  import { Music21Exception } from 'music21j/music21/exceptions21';
  import type * as articulations from 'music21j/music21/articulations';
  import type * as expressions from 'music21j/music21/expressions';
  import type * as instrument from 'music21j/music21/instrument';
  export class NotRestException extends Music21Exception {
  }
  export const noteheadTypeNames: string[];
  export const stemDirectionNames: string[];
  /**
   * Class for a single Lyric attached to a {@link GeneralNote}
   *
   * @class Lyric
   * @memberOf music21.note
   * @param {string} text - the text of the lyric
   * @param {number} number=1 - the lyric number
   * @param {string} syllabic=undefined - placement of the syllable
   *     ('begin', 'middle', 'end', 'single'); undefined = interpret from text
   * @param {boolean} applyRaw=false - true = display the text exactly as it
   *     is or, false = use "-" etc. to determine syllabic
   * @param {string} identifier=undefined - identifier for the lyric.
   * @property {string} lyricConnector='-' - what to place between two
   *     lyrics that are syllabic.
   * @property {string} text - the text of the lyric syllable.
   * @property {string} syllabic - see above
   * @property {boolean} applyRaw - see above
   * @property {string} identifier - see above; gets .number if undefined
   * @property {number} number - see above
   * @property {string} rawText - text + any connectors
   */
  export class Lyric extends prebase.ProtoM21Object {
      static get className(): string;
      lyricConnector: string;
      text: string;
      protected _number: number;
      protected _identifier: string | number;
      syllabic: string;
      applyRaw: boolean;
      style: any;
      constructor(text: string, number?: number, syllabic?: any, applyRaw?: boolean, identifier?: string | number);
      get identifier(): string | number;
      set identifier(i: string | number);
      get number(): number;
      set number(n: number);
      /**
       * get rawText - gets the raw text.
       *
       * @return {string}  raw text
       */
      get rawText(): string;
      set rawText(t: string);
      /**
       * setTextAndSyllabic - Given a setting for rawText and applyRaw,
       *     sets the syllabic type for a lyric based on the rawText
       *
       * @param  {string} rawText text
       * @param  {boolean} applyRaw = false if hyphens should not be applied
       * @return {this}
       */
      setTextAndSyllabic(rawText: any, applyRaw?: boolean): this;
  }
  /**
   * Superclass for all Note values
   *
   * @class GeneralNote
   * @memberof music21.note
   * @param {(number|undefined)} [ql=1.0] - quarterLength of the note
   * @property {boolean} [isChord=false] - is this a chord
   * @property {number} quarterLength - shortcut to `.duration.quarterLength`
   * @property {Vex.Flow.StaveNote} [activeVexflowNote] - most recent
   *     Vex.Flow.StaveNote object to be made from this note (could change);
   *     default: undefined
   * @property {Array<music21.expressions.Expression>} expressions - array
   *     of attached expressions
   * @property {Array<music21.articulations.Articulation>} articulations - array
   *     of attached articulations
   * @property {string} lyric - the text of the first
   *     {@link Lyric} object; can also set one.
   * @property {Array<Lyric>} lyrics - array of attached lyrics
   * @property {number} [volume=60] - how loud is this note, 0-127, before
   *     articulations
   * @property {number} midiVolume - how loud is this note, taking into
   *     account articulations
   * @property {music21.tie.Tie|undefined} [tie=undefined] - a tie object
   */
  export class GeneralNote extends base.Music21Object {
      static get className(): string;
      isNote: boolean;
      isRest: boolean;
      isChord: boolean;
      volume: number;
      expressions: expressions.Expression[];
      articulations: articulations.Articulation[];
      lyrics: Lyric[];
      tie: any;
      activeVexflowNote: Vex.Flow.Note;
      constructor(ql?: number);
      get lyric(): string;
      set lyric(value: string);
      get midiVolume(): number;
      /**
       * Add a {@link Lyric} object to the Note
       *
       * @param {string} text - text to be added
       * @param {number} [lyricNumber] - integer specifying lyric (defaults to the current `.lyrics.length` + 1)
       * @param {boolean} [applyRaw=false] - if `true`, do not parse the text for cluses about syllable placement.
       * @param {string} [lyricIdentifier] - an optional identifier
       */
      addLyric(text: any, lyricNumber: any, applyRaw: boolean, lyricIdentifier: any): void;
      /**
       * Change stem direction according to clef. Does nothing for GeneralNote; overridden in subclasses.
       *
       * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
       * @returns {this}
       */
      setStemDirectionFromClef(clef: any): this;
      getStemDirectionFromClef(clef: any): any;
      /**
       * Sets the vexflow accidentals (if any) and the dots
       *
       * @param {Vex.Flow.StaveNote} vfn - a Vex.Flow note
       * @param {Object} options -- a set of Vex Flow options
       */
      vexflowAccidentalsAndDisplay(vfn: any, options?: {}): void;
      /**
       * Return the active channel for the instrument or activeSite's instrument
       */
      activeChannel(instrument?: instrument.Instrument): number;
      /**
       * Play the current element as a MIDI note.
       *
       * For a general note -- same as a rest -- doesn't make a sound.  :-)
       *
       * @param {number} [tempo=120] - tempo in bpm
       * @param {base.Music21Object} [nextElement] - for determining
       *     the length to play in case of tied notes, etc.
       * @param {Object} [options] - other options (currently just
       *     `{instrument: {@link music21.instrument.Instrument} }`)
       * @returns {number} - delay time in milliseconds until the next element (may be ignored)
       */
      playMidi(tempo: number, nextElement: any, { instrument, channel }?: {
          instrument?: any;
          channel?: any;
      }): number;
  }
  /**
   * Specifies that a GeneralNote is not a rest (Unpitched, Note, Chord).
   *
   * @param {number} [ql=1.0] - length in quarter notes
   * @property {music21.beam.Beams} beams - a link to a beam object
   * @property {string} [notehead='normal'] - notehead type
   * @property {string} [noteheadFill='default'] - notehead fill (to be moved to style...)
   * @property {string|undefined} [noteheadColor=undefined] - notehead color
   * @property {boolean} [noteheadParenthesis=false] - put a parenthesis around the notehead?
   * @property {string|undefined} [stemDirection=undefined] - One of
   *     ['up','down','noStem', undefined] -- 'double' not supported
   */
  export class NotRest extends GeneralNote {
      static get className(): string;
      notehead: string;
      noteheadFill: string;
      noteheadColor: string;
      noteheadParenthesis: boolean;
      volume: number;
      beams: beam.Beams;
      protected _stemDirection: string;
      constructor(ql?: number);
      get pitches(): pitch.Pitch[];
      set pitches(_value: pitch.Pitch[]);
      get stemDirection(): string;
      set stemDirection(direction: string);
      /**
       * Returns a `Vex.Flow.StaveNote` that approximates this note.
       *
       * @param {Object} [options={}] - `{clef: {@link music21.clef.Clef} }`
       * clef to set the stem direction of.
       * @returns {Vex.Flow.StaveNote}
       */
      vexflowNote({ clef }?: {
          clef?: any;
      }): Vex.Flow.StaveNote;
  }
  /**
   * A very, very important class! music21.note.Note objects combine a {@link music21.pitch.Pitch}
   * object to describe pitch (highness/lowness) with a {@link music21.duration.Duration} object
   * that defines length, with additional features for drawing the Note, playing it back, etc.
   *
   * Together with {@link Stream} one of the two most important
   * classes in `music21`.
   *
   * See {@link NotRest}, {@link GeneralNote},
   * {@link base.Music21Object}
   * and {@link prebase.ProtoM21Object} (or in general, the **extends** list below) for other
   * things you can do with a `Note` object.
   *
   * Missing from music21p: `transpose(), fullName`.  Transpose cannot be added because of circular imports
   *
   * @class Note
   * @memberof music21.note
   */
  export class Note extends NotRest {
      static get className(): string;
      isNote: boolean;
      isRest: boolean;
      pitch: pitch.Pitch;
      /**
       *
       * @param {(string|music21.pitch.Pitch|undefined)} [nn='C4'] - pitch
       *     name ("C", "D#", "E-") w/ or w/o octave ("C#4"), or a pitch.Pitch object
       * @param {(number|undefined)} [ql=1.0] - length in quarter notes
       * @property {boolean} [isNote=true] - is it a Note? Yes!
       * @property {boolean} [isRest=false] - is it a Rest? No!
       * @property {music21.pitch.Pitch} pitch - the {@link music21.pitch.Pitch} associated with the Note.
       * @property {string} name - shortcut to `.pitch.name`
       * @property {string} nameWithOctave - shortcut to `.pitch.nameWithOctave`
       * @property {string} step - shortcut to `.pitch.step`
       * @property {number} octave - shortcut to `.pitch.octave`
       */
      constructor(nn?: string | pitch.Pitch, ql?: number);
      stringInfo(): string;
      get name(): string;
      set name(nn: string);
      get nameWithOctave(): string;
      set nameWithOctave(nn: string);
      get step(): string;
      set step(nn: string);
      get octave(): number;
      set octave(nn: number);
      get pitches(): pitch.Pitch[];
      set pitches(value: pitch.Pitch[]);
      /**
       * Change stem direction according to clef.
       *
       * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
       * @returns {this} Original object, for chaining methods
       */
      setStemDirectionFromClef(clef: any): this;
      /**
       * Same as setStemDirectionFromClef, but do not set the note, just return it.
       */
      getStemDirectionFromClef(clef: any): string;
      vexflowAccidentalsAndDisplay(vfn: any, { stave, clef }?: {
          stave?: any;
          clef?: any;
      }): void;
      playMidi(tempo?: number, nextElement?: any, { instrument, channel, playLegato, }?: {
          instrument?: any;
          channel?: any;
          playLegato?: boolean;
      }): number;
  }
  /**
   * Represents a musical rest.
   *
   * @class Rest
   * @memberof music21.note
   * @param {number} [ql=1.0] - length in number of quarterNotes
   * @property {Boolean} [isNote=false]
   * @property {Boolean} [isRest=true]
   * @property {string} [name='rest']
   * @property {number} [lineShift=undefined] - number of lines to shift up or down from default
   * @property {string|undefined} [color='black'] - color of the rest
   */
  export class Rest extends GeneralNote {
      static get className(): string;
      isNote: boolean;
      isRest: boolean;
      name: string;
      lineShift: number;
      color: string;
      volume: number;
      constructor(ql?: number);
      /**
       *
       * @returns {string}
       */
      stringInfo(): string;
      /**
       * Returns a `Vex.Flow.StaveNote` that approximates this rest.
       * Corrects for bug in VexFlow that renders a whole rest too low.
       *
       * @param {Object} options -- vexflow options
       * @returns {Vex.Flow.StaveNote}
       */
      vexflowNote(options: any): any;
  }

}
declare module 'music21j/music21/parseLoader' {
  export function runConfiguration(): void;
  export function getBasePath(): string;
  export function fixUrls(conf: any): void;
  /**
   * @returns undefined
   */
  export function renderHTML(): void;
  export function loadDefaultSoundfont(conf: any): void;
  /**
   *
   * @returns {{}}
   */
  export function loadConfiguration(): any;
  /**
   *
   * @param {string} [attribute=m21conf]
   * @returns {undefined|*|string}
   */
  export function getM21attribute(attribute?: string): string;
  /**
   *
   * @returns {boolean}
   */
  export function warnBanner(): boolean;

}
declare module 'music21j/music21/pitch' {
  import * as prebase from 'music21j/music21/prebase';
  interface UpdateAccidentalDisplayParams {
      pitchPast?: Pitch[];
      pitchPastMeasure?: Pitch[];
      alteredPitches?: Pitch[];
      cautionaryPitchClass?: boolean;
      cautionaryAll?: boolean;
      overrideStatus?: boolean;
      cautionaryNotImmediateRepeat?: boolean;
      lastNoteWasTied?: boolean;
  }
  /**
   * @class Accidental
   * @memberof music21.pitch
   * @param {string|number} accName - an accidental name
   * @property {number} alter
   * @property {string} displayType
   * @property {boolean|undefined} displayStatus
   */
  export class Accidental extends prebase.ProtoM21Object {
      static get className(): string;
      protected _name: string;
      protected _alter: number;
      protected _modifier: string;
      protected _unicodeModifier: string;
      displayType: string;
      displayStatus: boolean;
      constructor(accName: string | number);
      stringInfo(): string;
      /**
       * Sets a parameter of the accidental and updates name, alter, and modifier to suit.
       *
       * @param {number|string} accName - the name, number, or modifier to set
       * @returns {undefined}
       */
      set(accName: number | string): void;
      /**
       * Return or set the name of the accidental ('flat', 'sharp', 'natural', etc.);
       *
       * When set, updates alter and modifier.
       *
       * @type {string}
       */
      get name(): string;
      set name(n: string);
      /**
       * Return or set the alter of the accidental
       *
       * When set, updates name and modifier.
       *
       * @type {number}
       */
      get alter(): number;
      set alter(alter: number);
      /**
       * Return or set the modifier ('-', '#', '')
       *
       * When set, updates alter and name.
       *
       * @type {string}
       */
      get modifier(): string;
      set modifier(modifier: string);
      /**
       * Returns the modifier for vexflow ('b', '#', 'n')
       *
       * @type {string}
       * @readonly
       */
      get vexflowModifier(): "b" | "n" | "#" | "##" | "###" | "bb" | "bbb";
      /**
       * Returns the modifier in unicode or
       * for double and triple accidentals, as a hex escape
       *
       * @type {string}
       * @readonly
       */
      get unicodeModifier(): string;
  }
  /**
   *
   * @type {{A: number, B: number, C: number, D: number, E: number, F: number, G: number}}
   */
  export const nameToMidi: {
      C: number;
      D: number;
      E: number;
      F: number;
      G: number;
      A: number;
      B: number;
  };
  /**
   *
   * @type {{A: number, B: number, C: number, D: number, E: number, F: number, G: number}}
   */
  export const nameToSteps: {
      C: number;
      D: number;
      E: number;
      F: number;
      G: number;
      A: number;
      B: number;
  };
  /**
   *
   * @type {string[]}
   */
  export const stepsToName: string[];
  /**
   *
   * @type {string[]}
   */
  export const midiToName: string[];
  /**
   * Pitch objects are found in {@link music21.note.Note} objects, and many other places.
   *
   * They do not have a {@link music21.duration.Duration} associated with them, so they
   * cannot be placed inside music21.stream.Stream objects.
   *
   * Valid pitch name formats are
   * - "C", "D', etc. ("B" = American B; "H" is not allowed)
   * - "C#", "C-" (C-flat; do not use "b" for flat), "C##", "C###", "C--" etc.
   * - Octave may be specified after the name + accidental: "C#4" etc.
   * - Octave can be arbitrarily high ("C10") but only as low as "C0" because
   *     "C-1" would be interpreted as C-flat octave 1; shift octave later for very low notes.
   * - If octave is not specified, the system will usually use octave 4, but might
   *     adjust according to context. If you do not like this behavior, give an octave always.
   * - Microtones are not supported in music21j (they are in music21p)
   *
   * @class Pitch
   * @memberof music21.pitch
   * @param {string|number} pn - name of the pitch, with or without octave, see above.
   * @property {Accidental|undefined} accidental - link to an accidental
   * @property {number} diatonicNoteNum - diatonic number of the pitch,
   *     where 29 = C4, C#4, C-4, etc.; 30 = D-4, D4, D#4, etc. updates other properties.
   * @property {number} midi - midi number of the pitch (C4 = 60); readonly.
   *     See {@link Pitch#ps} for settable version.
   * @property {string} name - letter name of pitch + accidental modifier;
   *     e.g., B-flat = 'B-'; changes automatically w/ step and accidental
   * @property {string} nameWithOctave - letter name of pitch + accidental
   *     modifier + octave; changes automatically w/ step, accidental, and octave
   * @property {number} octave - number for the octave, where middle C = C4, and
   *     octaves change between B and C; default 4
   * @property {number} ps - pitch space number, like midi number but floating
   *     point and w/ no restriction on range. C4 = 60.0
   * @property {string} step - letter name for the pitch (C-G, A, B),
   *     without accidental; default 'C'
   */
  export class Pitch extends prebase.ProtoM21Object {
      static get className(): string;
      protected _step: string;
      protected _octave: number;
      protected _accidental: Accidental | undefined;
      spellingIsInferred: boolean;
      microtone: any;
      constructor(pn?: string | number);
      stringInfo(): string;
      get step(): string;
      set step(s: string);
      get octave(): number;
      set octave(o: number);
      get implicitOctave(): number;
      get accidental(): Accidental | undefined;
      set accidental(a: Accidental | undefined);
      get name(): string;
      set name(nn: string);
      get nameWithOctave(): string;
      set nameWithOctave(pn: string);
      /**
       *
       * @type {number}
       * @readonly
       */
      get pitchClass(): number;
      /**
       *
       * @type {number}
       */
      get diatonicNoteNum(): any;
      set diatonicNoteNum(newDNN: any);
      /**
       *
       * @type {number}
       * @readonly
       */
      get frequency(): number;
      /**
       *
       * @type {number}
       * @readonly
       */
      get midi(): number;
      /**
       *
       * @type {number}
       */
      get ps(): any;
      set ps(ps: any);
      /**
       * @type {string}
       * @readonly
       */
      get unicodeName(): string;
      /**
       * @type {string}
       * @readonly
       */
      get unicodeNameWithOctave(): string;
      /**
       * @param {boolean} inPlace
       * @param {int} directionInt -- -1 = down, 1 = up
       * @returns {Pitch}
       */
      _getEnharmonicHelper(inPlace: boolean, directionInt: any): this;
      /**
       *
       * @param {boolean} [inPlace=false]
       * @returns {Pitch}
       */
      getHigherEnharmonic(inPlace?: boolean): this;
      /**
       *
       * @param {boolean} [inPlace=false]
       * @returns {Pitch}
       */
      getLowerEnharmonic(inPlace?: boolean): this;
      protected _nameInKeySignature(alteredPitches: Pitch[]): boolean;
      protected _stepInKeySignature(alteredPitches: Pitch[]): boolean;
      updateAccidentalDisplay({ pitchPast, pitchPastMeasure, alteredPitches, cautionaryPitchClass, cautionaryAll, overrideStatus, cautionaryNotImmediateRepeat, lastNoteWasTied, }?: UpdateAccidentalDisplayParams): void;
      /**
       * Returns the vexflow name for the pitch in the given clef.
       *
       * if clefObj is undefined, then the clef is treated as TrebleClef.
       *
       * @param {music21.clef.Clef} [clefObj] - the active {@link music21.clef.Clef} object
       * @returns {string} - representation in vexflow
       */
      vexflowName(clefObj?: any): string;
  }
  export {};

}
declare module 'music21j/music21/prebase' {
  /**
   * module for things that all music21-created objects, not just objects that can live in
   * Stream.elements should inherit. See the {@link music21.prebase} namespace.
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   *
   * @exports music21/prebase
   * @namespace music21.prebase
   * @memberof music21
   */
  /**
   * Class for pseudo-m21 objects to inherit from. The most important attributes that nearly
   * everything in music21 should inherit from are given below.
   *
   * @class ProtoM21Object
   * @memberof music21.prebase
   * @property {Array<string>} classes - An Array of strings of classes
   * that the object belongs to (default ['ProtoM21Object'])
   * @property {boolean} isProtoM21Object - Does this object descend
   * from {@link music21.prebase.ProtoM21Object}: obviously true.
   * @property {boolean} isMusic21Object - Does this object descend
   * from Music21Object; default false.
   */
  export class ProtoM21Object {
      static get className(): string;
      protected _storedClasses: string[];
      protected _storedClassSet: Set<any>;
      _cl: string;
      isProtoM21Object: boolean;
      isMusic21Object: boolean;
      protected _cloneCallbacks: any;
      constructor();
      get classSet(): Set<any>;
      /**
       * Gets all classes.  Note that because of webpack mangling of class names,
       * we need to specify `className` as a static property on each class.
       */
      get classes(): string[];
      /**
       * Populates the class caches (.classes and .classSet)
       *
       * Stored on the individual object, not the class, unlike music21p
       */
      private _populateClassCaches;
      /**
       * Makes (as much as possible) a complete duplicate copy of the object called with .clone()
       *
       * Works similarly to Python's copy.deepcopy().
       *
       * Every ProtoM21Object has a `._cloneCallbacks` object which maps
       * `{attribute: callbackFunction|boolean}`
       * to handle custom clone cases.  See, for instance, Music21Object which
       * uses a custom callback to NOT clone the `.derivation` attribute directly.
       *
       * @example
       * var n1 = new music21.note.Note("C#");
       * n1.duration.quarterLength = 4;
       * var n2 = n1.clone();
       * n2.duration.quarterLength == 4; // true
       * n2 === n1; // false
       */
      clone(deep?: boolean, memo?: any): this;
      /**
       * Check to see if an object is of this class or subclass.
       *
       * @param {string|string[]} testClass - a class or Array of classes to test
       * @returns {boolean}
       * @example
       * var n = new music21.note.Note();
       * n.isClassOrSubclass('Note'); // true
       * n.isClassOrSubclass('music21.base.Music21Object'); // true
       * n.isClassOrSubclass(music21.note.GeneralNote); // true
       * n.isClassOrSubclass(['Note', 'Rest']); // true
       * n.isClassOrSubclass(['Duration', 'NotRest']); // true // NotRest
       */
      isClassOrSubclass(testClass: string | typeof ProtoM21Object | (string | typeof ProtoM21Object)[]): boolean;
      /**
       *
       * @returns {string}
       */
      toString(): string;
      /**
       *
       * @returns {string}
       */
      stringInfo(): string;
  }

}
declare module 'music21j/music21/renderOptions' {
  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/renderOptions -- an object that defines the render options for a Stream
   *
   * note: no parallel in music21p except Style
   *
   * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–19, Michael Scott Cuthbert and cuthbertLab
   *
   * renderOptions module, see {@link music21.renderOptions}
   * Options for rendering a stream
   *
   * @exports music21/renderOptions
   * @namespace music21.renderOptions
   * @memberof music21
   */
  interface EventInterface {
      click: string | Function | undefined;
      dblclick: string | Function | undefined;
      resize?: string | Function | undefined;
  }
  interface ScaleFactor {
      x: number;
      y: number;
  }
  /**
   * An object that contains information on rendering the current stream
   *
   * Found on every Stream as `.renderOptions`
   *
   * @memberof music21.renderOptions
   */
  export class RenderOptions {
      displayClef: boolean;
      displayTimeSignature: boolean;
      displayKeySignature: boolean;
      scaleFactor: ScaleFactor;
      top: number;
      left: number;
      width: number;
      overriddenWidth: number;
      height: number;
      marginBottom: number;
      systemIndex: number;
      partIndex: number;
      measureIndex: number;
      systemPadding: number;
      maxSystemWidth: number;
      rightBarline: string;
      staffLines: number;
      staffConnectors: string[];
      staffPadding: number;
      events: EventInterface;
      useVexflowAutobeam: boolean;
      startNewSystem: boolean;
      startNewPage: boolean;
      showMeasureNumber: boolean;
      heightAboveStaff: number;
      heightOfStaffProper: number;
      heightBelowStaff: number;
      get staffAreaHeight(): number;
      deepClone(): RenderOptions;
  }
  export {};

}
declare module 'music21j/music21/roman' {
  import * as chord from 'music21j/music21/chord';
  import * as figuredBass from 'music21j/music21/figuredBass';
  import * as harmony from 'music21j/music21/harmony';
  import * as interval from 'music21j/music21/interval';
  import * as key from 'music21j/music21/key';
  import * as pitch from 'music21j/music21/pitch';
  import * as scale from 'music21j/music21/scale';
  export const figureShorthands: {
      '53': string;
      '3': string;
      '63': string;
      '753': string;
      '75': string;
      '73': string;
      '9753': string;
      '975': string;
      '953': string;
      '97': string;
      '95': string;
      '93': string;
      '653': string;
      '6b53': string;
      '643': string;
      '642': string;
      bb7b5b3: string;
      bb7b53: string;
      b7b5b3: string;
  };
  export const functionalityScores: {
      I: number;
      i: number;
      V7: number;
      V: number;
      V65: number;
      I6: number;
      V6: number;
      V43: number;
      I64: number;
      IV: number;
      i6: number;
      viio7: number;
      V42: number;
      viio65: number;
      viio6: number;
      '#viio65': number;
      ii: number;
      '#viio6': number;
      ii65: number;
      ii43: number;
      ii42: number;
      IV6: number;
      ii6: number;
      VI: number;
      '#VI': number;
      vi: number;
      viio: number;
      '#viio': number;
      iio: number;
      iio42: number;
      bII6: number;
      iio43: number;
      iio65: number;
      '#vio': number;
      '#vio6': number;
      III: number;
      v: number;
      VII: number;
      VII7: number;
      IV65: number;
      IV7: number;
      iii: number;
      iii6: number;
      vi6: number;
  };
  /**
   * expandShortHand - expand a string of numbers into an array
   *
   * N.B. this is NOT where abbreviations get expanded
   *
   * @memberof music21.roman
   * @param  {string} shorthand string of a figure w/o roman to parse
   * @return {Array<string>}           array of shorthands
   */
  export function expandShortHand(shorthand: any): any[];
  /**
   * correctSuffixForChordQuality - Correct a given inversionString suffix given a
   *     chord of various qualities.
   *
   * @memberof music21.roman
   * @param  {chord.Chord} chordObj
   * @param  {string} inversionString a string like '6' to fix.
   * @return {string}           corrected inversionString
    */
  export function correctSuffixForChordQuality(chordObj: chord.Chord, inversionString: string): string;
  /**
   * maps an index number to a roman numeral in lowercase
   *
   * @memberof music21.roman
   * @example
   * music21.roman.romanToNumber[4]
   * // 'iv'
   */
  export const romanToNumber: string[];
  /**
   * Represents a RomanNumeral.  By default, capital Roman Numerals are
   * major chords; lowercase are minor.
   *
   * @class RomanNumeral
   * @memberof music21.roman
   * @param {string} figure - the roman numeral as a string, e.g., 'IV', 'viio', 'V7'
   * @param {string|music21.key.Key} [keyStr='C']
   * @property {Array<music21.pitch.Pitch>} scale - (readonly) returns the scale
   *     associated with the roman numeral
   * @property {music21.key.Key} key - the key associated with the
   *     RomanNumeral (not allowed to be undefined yet)
   * @property {string} figure - the figure as passed in
   * @property {string} degreeName - the name associated with the scale degree,
   *     such as "mediant" etc., scale 7 will be "leading tone" or
   *     "subtonic" appropriately
   * @property {int} scaleDegree
   * @property {string|undefined} impliedQuality - "major", "minor", "diminished", "augmented"
   * @property {music21.roman.RomanNumeral|undefined} secondaryRomanNumeral
   * @property {music21.key.Key|undefined} secondaryRomanNumeralKey
   * @property {string|undefined} frontAlterationString
   * @property {music21.interval.Interval|undefined} frontAlterationTransposeInterval
   * @property {music21.pitch.Accidental|undefined} frontAlterationAccidental
   * @property {string|undefined} romanNumeralAlone
   * @property {scale.Scale|boolean|undefined} impliedScale
   * @property {music21.interval.Interval|undefined} scaleOffset
   * @property {Array<music21.pitch.Pitch>} pitches - RomanNumerals
   *     are Chord objects, so .pitches will work for them also.
   */
  export class RomanNumeral extends harmony.Harmony {
      static get className(): string;
      _parsingComplete: boolean;
      primaryFigure: any;
      secondaryRomanNumeral: RomanNumeral;
      secondaryRomanNumeralKey: key.Key;
      pivotChord: any;
      scaleCardinality: number;
      _figure: string;
      caseMatters: boolean;
      scaleDegree: number;
      frontAlterationString: string;
      frontAlterationTransposeInterval: interval.Interval;
      frontAlterationAccidental: pitch.Accidental;
      romanNumeralAlone: any;
      quality: any;
      impliedQuality: any;
      impliedScale: any;
      scaleOffset: any;
      useImpliedScale: boolean;
      bracketedAlterations: any;
      omittedSteps: any;
      followsKeyChange: boolean;
      protected _functionalityScore: number;
      protected _scale: scale.ConcreteScale;
      protected _tempRoot: pitch.Pitch;
      numbers: number;
      figuresNotationObj: figuredBass.Notation;
      constructor(figure?: string, keyStr?: key.Key | string | undefined, { parseFigure, updatePitches, }?: {
          parseFigure?: boolean;
          updatePitches?: boolean;
      });
      stringInfo(): string;
      _parseFigure(): void;
      _parseFrontAlterations(workingFigure: any): any;
      _correctBracketedPitches(): void;
      _setImpliedQualityFromString(workingFigure: any): any;
      _fixMinorVIandVII(useScale: any): void;
      _parseRNAloneAmidstAug6(workingFigure: any, useScale: any): any[];
      /**
       * get romanNumeral - return either romanNumeralAlone (II) or with frontAlterationAccidental (#II)
       *
       * @return {string}  new romanNumeral;
       */
      get romanNumeral(): any;
      get scale(): scale.ConcreteScale;
      get key(): key.Key;
      set key(keyOrScale: key.Key);
      get figure(): string;
      set figure(newFigure: string);
      get figureAndKey(): string;
      get degreeName(): string;
      /**
       * Update the .pitches array.  Called at instantiation, but not automatically afterwards.
       *
       */
      _updatePitches(): void;
      bassScaleDegreeFromNotation(notationObject: any): number;
      _matchAccidentalsToQuality(impliedQuality: any): void;
      _correctForSecondaryRomanNumeral(useScale: any, figure?: any): any[];
      _parseOmittedSteps(workingFigure: any): any;
      _parseBracketedAlterations(workingFigure: any): any;
      _findSemitoneSizeForQuality(impliedQuality: any): any;
      /**
       * Gives a string display.  Note that since inversion is not yet supported
       * it needs to be given separately.
       *
       * Inverting 7th chords does not work.
       *
       * @param {string} displayType - ['roman', 'bassName', 'nameOnly', other]
       * @param {number} [inversion=0]
       * @returns {string}
       */
      asString(displayType: string, inversion?: number): string;
  }

}
declare module 'music21j/music21/scale' {
  import * as base from 'music21j/music21/base';
  import * as interval from 'music21j/music21/interval';
  import * as pitch from 'music21j/music21/pitch';
  import * as note from 'music21j/music21/note';
  export class Scale extends base.Music21Object {
      static get className(): string;
      type: string;
      constructor();
      /**
       *
       * @returns {string}
       * @readonly
       */
      get name(): string;
      /**
       * @readonly
       * @returns {boolean}
       */
      get isConcrete(): boolean;
  }
  export class AbstractScale extends Scale {
      static get className(): string;
      protected _net: interval.Interval[];
      tonicDegree: number;
      octaveDuplicating: boolean;
      deterministic: boolean;
      protected _alteredDegrees: {};
      protected _oneOctaveRealizationCache: any;
      constructor();
      /**
       * To be subclassed
       */
      buildNetwork(mode?: any): void;
      /**
       * One scale equals another
       *
       * @param {AbstractScale} other - the scale compared to.
       * @returns {boolean}
       */
      equals(other: AbstractScale): boolean;
      buildNetworkFromPitches(pitchList: string[] | pitch.Pitch[] | note.Note[]): void;
      getDegreeMaxUnique(): number;
      getRealization(pitchObj: any, unused_stepOfPitch?: any, unused_minPitch?: any, unused_maxPitch?: any, unused_direction?: any, unused_reverse?: any): any[];
      getPitchFromNodeDegree(pitchReference: any, unused_nodeName: any, nodeDegreeTarget: any): any;
      getRelativeNodeDegree(pitchReference: any, unused_nodeName: any, pitchTarget: any, unused_comparisonAttribute?: any, unused_direction?: any): number;
  }
  /**
   * @memberOf music21.scale
   *
   */
  export class AbstractDiatonicScale extends AbstractScale {
      static get className(): string;
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
      constructor(mode?: string);
      buildNetwork(mode: string): void;
  }
  /**
   * @memberOf music21.scale
   *
   */
  export class AbstractHarmonicMinorScale extends AbstractScale {
      static get className(): string;
      constructor();
      buildNetwork(): void;
  }
  /**
   * @memberOf music21.scale
   */
  export class AbstractAscendingMelodicMinorScale extends AbstractScale {
      static get className(): string;
      constructor();
      buildNetwork(): void;
  }
  /**
   * @memberOf music21.scale
   */
  export class ConcreteScale extends Scale {
      static get className(): string;
      tonic: pitch.Pitch;
      abstract: AbstractScale;
      constructor(tonic: any);
      get isConcrete(): boolean;
      getTonic(): pitch.Pitch;
      getPitches(unused_minPitch?: any, unused_maxPitch?: any, unused_direction?: any): any[];
      pitchFromDegree(degree: any, unused_minPitch?: any, unused_maxPitch?: any, unused_direction?: any, unused_equateTermini?: any): any;
      getScaleDegreeFromPitch(pitchTarget: any, unused_direction?: any, unused_comparisonAttribute?: any): number;
  }
  /**
   * @memberOf music21.scale
   */
  export class DiatonicScale extends ConcreteScale {
      static get className(): string;
      constructor(tonic: any);
  }
  /**
   * @memberOf music21.scale
   */
  export class MajorScale extends DiatonicScale {
      static get className(): string;
      constructor(tonic: any);
  }
  /**
   * @memberOf music21.scale
   */
  export class MinorScale extends DiatonicScale {
      static get className(): string;
      constructor(tonic: any);
  }
  /**
   * @memberOf music21.scale
   */
  export class HarmonicMinorScale extends ConcreteScale {
      static get className(): string;
      constructor(tonic: any);
  }
  /**
   * @memberOf music21.scale
   */
  export class AscendingMelodicMinorScale extends ConcreteScale {
      static get className(): string;
      constructor(tonic: any);
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
  export function SimpleDiatonicScale(tonic: any, scaleSteps: any): pitch.Pitch[];
  /**
   * One octave of a major scale
   *
   * @memberOf music21.scale
   * @function music21.scale.ScaleSimpleMajor
   * @param {pitch.Pitch} tonic
   * @returns {Array<pitch.Pitch>} an octave of scale objects.
   */
  export function ScaleSimpleMajor(tonic: pitch.Pitch): pitch.Pitch[];
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
  export function ScaleSimpleMinor(tonic: any, minorType: any): pitch.Pitch[];

}
declare module 'music21j/music21/sites' {
  /**
   * Objects for keeping track of relationships among Music21Objects. See {@link music21.sites} namespace
   *
   * Copyright 2017-2019, Michael Scott Cuthbert and cuthbertLab
   * License: BSD
   *
   * @namespace music21.sites
   * @memberof music21
   * @requires music21/common
   */
  import { Music21Exception } from 'music21j/music21/exceptions21';
  import { Stream } from 'music21j/music21/stream';
  /**
   */
  export class SitesException extends Music21Exception {
  }
  /**
   * SiteRef.site is held strongly in Javascript.  This is
   * actually NOT a problem because of the difference between
   * the way JS Garbage Collection works from Python (in all
   * browsers since IE6...). They follow reference chains and
   * find unreachable references and don't just check reference
   * counts.  Thus circular references still allow memory to be
   * garbage collected.  Tested in Chrome on 100000 streams, and
   * very small additional memory usage.
   *
   * https://stackoverflow.com/questions/7347203/circular-references-in-javascript-garbage-collector
   */
  export class SiteRef {
      isDead: boolean;
      classString: string;
      globalSiteIndex: boolean | number;
      siteIndex: number;
      site: Stream;
  }
  /**
   * @memberOf music21.sites
   * @param {*} obj
   * @returns {number|string}
   */
  export function getId(obj: any): any;
  /**
   * @memberOf music21.sites
   */
  export class Sites {
      siteDict: any;
      protected _siteIndex: number;
      protected _lastID: number;
      constructor();
      get length(): number;
      includes(checkSite: Stream): boolean;
      /**
       *
       * @returns {Array<*>}
       */
      protected _keysByTime(newFirst?: boolean): any[];
      add(obj: any, idKey?: any, classString?: string): void;
      /**
       * @param obj
       */
      remove(obj: any): boolean;
      clear(): void;
      /**
       */
      yieldSites(sortByCreationTime?: boolean | string, priorityTarget?: Stream, excludeNone?: boolean): Generator<Stream, void, void>;
      get(sortByCreationTime?: boolean, priorityTarget?: Stream, excludeNone?: boolean): Stream[];
      /**
       *
       * @param {string} attrName
       * @returns {undefined|*}
       */
      getAttrByName(attrName: any): any;
      /**
       *
       * @param {string} className
       * @param {Object} [options]
       * @returns {Stream}
       */
      getObjByClass(className: string, options?: {}): Stream;
  }

}
declare module 'music21j/music21/stream/filters' {
  import { Music21Exception } from 'music21j/music21/exceptions21';
  export class FilterException extends Music21Exception {
  }
  class _StopIteration {
  }
  export const StopIterationSingleton: _StopIteration;
  /**
   * @memberof music21.stream.filters
   */
  export class StreamFilter {
      static get derivationStr(): string;
      reset(): void;
      call(item: any, iterator: any): boolean | _StopIteration;
  }
  export class IsFilter extends StreamFilter {
      static get derivationStr(): string;
      target: any[];
      numToFind: number;
      constructor(target?: any | any[]);
      reset(): void;
      call(item: any, iterator: any): boolean | _StopIteration;
  }
  export class IsNotFilter extends IsFilter {
      static get derivationStr(): string;
      constructor(target: any);
      reset(): void;
      call(item: any, iterator: any): _StopIteration;
  }
  export class ClassFilter extends StreamFilter {
      static get derivationStr(): string;
      classList: string[];
      constructor(classList?: string | string[]);
      call(item: any, iterator: any): any;
  }
  export class ClassNotFilter extends ClassFilter {
      static get derivationStr(): string;
      call(item: any, iterator: any): boolean;
  }
  export class OffsetFilter extends StreamFilter {
      static get derivationStr(): string;
      offsetStart: number;
      offsetEnd: number;
      includeEndBoundary: boolean;
      mustFinishInSpan: boolean;
      mustBeginInSpan: boolean;
      includeElementsThatEndAtStart: boolean;
      zeroLengthSearch: boolean;
      constructor(offsetStart: number, offsetEnd?: any, { includeEndBoundary, mustFinishInSpan, mustBeginInSpan, includeElementsThatEndAtStart, }?: {
          includeEndBoundary?: boolean;
          mustFinishInSpan?: boolean;
          mustBeginInSpan?: boolean;
          includeElementsThatEndAtStart?: boolean;
      });
      call(item: any, iterator: any): boolean;
      isElementOffsetInRange(e: any, offset: any): boolean;
  }
  export {};

}
declare module 'music21j/music21/stream/iterator' {
  import { StreamException } from 'music21j/music21/exceptions21';
  import type { Music21Object } from 'music21j/music21/base';
  import type { Stream } from 'music21j/music21/stream';
  export class StreamIteratorException extends StreamException {
  }
  class _StreamIteratorBase<T = Music21Object> {
      srcStream: Stream;
      index: number;
      srcStreamElements: Music21Object[];
      streamLength: number;
      iterSection: string;
      cleanupOnStop: boolean;
      restoreActiveSites: boolean;
      overrideDerivation: any;
      filters: any[];
      protected _len: number;
      protected _matchingElements: Music21Object[];
      sectionIndex: number;
      activeInformation: any;
      constructor(srcStream: Stream, { filterList, restoreActiveSites, activeInformation, ignoreSorting, }?: {
          filterList?: any[];
          restoreActiveSites?: boolean;
          activeInformation?: any;
          ignoreSorting?: boolean;
      });
      [Symbol.iterator](): Generator<any, void, void>;
      map(func: any): unknown[];
      get(k: any): T;
      get length(): number;
      updateActiveInformation(): void;
      reset(): void;
      resetCaches(): void;
      cleanup(): void;
      matchingElements(): T[];
      matchesFilters(e: Music21Object): any;
      stream(): Stream;
      get activeElementList(): any;
      addFilter(newFilter: any): this;
      removeFilter(oldFilter: any): this;
      getElementsByClass(classFilterList: any): this;
      getElementsNotOfClass(classFilterList: any): this;
      getElementsByOffset(offsetStart: any, ...args: any[]): this;
      get notes(): this;
      get notesAndRests(): this;
      get parts(): this;
      get spanners(): this;
      get voices(): this;
  }
  export class StreamIterator<T = Music21Object> extends _StreamIteratorBase<T> {
      [Symbol.iterator](): Generator<T, void, void>;
  }
  export class OffsetIterator<T = Music21Object> extends _StreamIteratorBase<T> {
      nextToYield: any[];
      nextOffsetToYield: number;
      constructor(srcStream: any, options?: {});
      [Symbol.iterator](): Generator<T[], void, void>;
      reset(): void;
  }
  export class RecursiveIterator<T = Music21Object> extends _StreamIteratorBase<T> {
      returnSelf: boolean;
      includeSelf: boolean;
      ignoreSorting: boolean;
      iteratorStartOffsetInHierarchy: number;
      childRecursiveIterator: RecursiveIterator<T>;
      constructor(srcStream: Stream, { filterList, restoreActiveSites, activeInformation, streamsOnly, includeSelf, ignoreSorting, }?: {
          filterList?: any[];
          restoreActiveSites?: boolean;
          activeInformation?: any;
          streamsOnly?: boolean;
          includeSelf?: boolean;
          ignoreSorting?: boolean;
      });
      reset(): void;
      [Symbol.iterator](): Generator<T, void, void>;
      matchingElements(): T[];
      /**
       *   Returns a stack of RecursiveIterators at this point in the iteration.
       *   Last is most recent.
       */
      iteratorStack(): RecursiveIterator<T>[];
      /**
       *   Returns a stack of Streams at this point.  Last is most recent.
       */
      streamStack(): Stream[];
      /**
       *  Called on the current iterator, returns the current offset
       *  in the hierarchy. or undefined if we are not currently iterating.
       */
      currentHierarchyOffset(): number;
  }
  export {};

}
declare module 'music21j/music21/stream/makeNotation' {
  import * as note from 'music21j/music21/note';
  import * as stream from 'music21j/music21/stream';
  export interface MakeBeamsOptions {
      inPlace?: boolean;
      setStemDirections?: boolean;
  }
  export interface StemDirectionBeatGroupOptions {
      setNewStems?: boolean;
      overrideConsistentStemDirections?: boolean;
  }
  export interface IterateBeamGroupsOptions {
      skipNoBeams?: boolean;
      recurse?: boolean;
  }
  export function makeBeams(s: stream.Stream, { inPlace, setStemDirections, }?: MakeBeamsOptions): stream.Stream;
  export function iterateBeamGroups(s: stream.Stream, { skipNoBeams, recurse, }?: IterateBeamGroupsOptions): Generator<note.NotRest[], void, void>;
  export function setStemDirectionForBeamGroups(s: stream.Stream, { setNewStems, overrideConsistentStemDirections, }?: StemDirectionBeatGroupOptions): void;
  export function setStemDirectionOneGroup(group: note.NotRest[], { setNewStems, overrideConsistentStemDirections, }?: StemDirectionBeatGroupOptions): void;

}
declare module 'music21j/music21/stream' {
  /// <reference types="jquery" />
  import Vex from 'vexflow';
  import { Music21Exception } from 'music21j/music21/exceptions21';
  import * as base from 'music21j/music21/base';
  import * as clef from 'music21j/music21/clef';
  import { Duration } from 'music21j/music21/duration';
  import * as instrument from 'music21j/music21/instrument';
  import * as meter from 'music21j/music21/meter';
  import * as note from 'music21j/music21/note';
  import * as pitch from 'music21j/music21/pitch';
  import * as renderOptions from 'music21j/music21/renderOptions';
  import * as tempo from 'music21j/music21/tempo';
  import * as vfShow from 'music21j/music21/vfShow';
  import * as filters from 'music21j/music21/stream/filters';
  import * as iterator from 'music21j/music21/stream/iterator';
  import * as makeNotation from 'music21j/music21/stream/makeNotation';
  import type { KeySignature } from 'music21j/music21/key';
  export { filters };
  export { iterator };
  export { makeNotation };
  export class StreamException extends Music21Exception {
  }
  interface MakeAccidentalsParams {
      pitchPast?: pitch.Pitch[];
      pitchPastMeasure?: pitch.Pitch[];
      useKeySignature?: boolean | KeySignature;
      alteredPitches?: pitch.Pitch[];
      searchKeySignatureByContext?: boolean;
      cautionaryPitchClass?: boolean;
      cautionaryAll?: boolean;
      inPlace?: boolean;
      overrideStatus?: boolean;
      cautionaryNotImmediateRepeat?: boolean;
      tiePitchSet?: Set<string>;
  }
  /**
   * A generic Stream class -- a holder for other music21 objects
   * Will be subclassed into {@link Score},
   * {@link Part},
   * {@link Measure},
   * {@link Voice}, but most functions will be found here.
   *
   * @property {number} length - (readonly) the number of elements in the stream.
   * @property {Duration} duration - the total duration of the stream's elements
   * @property {number} highestTime -- the highest time point in the stream's elements
   * @property {music21.clef.Clef} clef - the clef for the Stream (if there is
   *     one; if there are multiple, then the first clef)
   * @property {music21.meter.TimeSignature} timeSignature - the first TimeSignature of the Stream
   * @property {music21.key.KeySignature} keySignature - the first KeySignature for the Stream
   * @property {renderOptions.RenderOptions} renderOptions - an object
   *     specifying how to render the stream
   * @property {Stream} flat - (readonly) a flattened representation of the Stream
   * @property {StreamIterator} notes - (readonly) the stream with
   *     only {@link music21.note.Note} and music21.chord.Chord objects included
   * @property {StreamIterator} notesAndRests - (readonly) like notes but
   *     also with {@link music21.note.Rest} objects included
   * @property {StreamIterator} parts - (readonly) a filter on the Stream
   *     to just get the parts (NON-recursive)
   * @property {StreamIterator} measures - (readonly) a filter on the
   *     Stream to just get the measures (NON-recursive)
   * @property {number} tempo - tempo in beats per minute (will become more
   *     sophisticated later, but for now the whole stream has one tempo
   * @property {music21.instrument.Instrument|undefined} instrument - an
   *     instrument object associated with the stream (can be set with a
   *     string also, but will return an `Instrument` object)
   * @property {boolean} autoBeam - whether the notes should be beamed automatically
   *    or not (will be moved to `renderOptions` soon)
   * @property {Vex.Flow.Stave|undefined} activeVFStave - the current Stave object for the Stream
   * @property {music21.vfShow.Renderer|undefined} activeVFRenderer - the current
   *     vfShow.Renderer object for the Stream
   * @property {int} [staffLines=5] - number of staff lines
   * @property {function|undefined} changedCallbackFunction - function to
   *     call when the Stream changes through a standard interface
   * @property {number} maxSystemWidth - confusing... should be in renderOptions
   */
  export class Stream extends base.Music21Object {
      static get className(): string;
      _offsetDict: WeakMap<base.Music21Object, number>;
      _elements: base.Music21Object[];
      isSorted: boolean;
      isStream: boolean;
      isMeasure: boolean;
      classSortOrder: number;
      recursionType: string;
      autoSort: boolean;
      isFlat: boolean;
      activeVFStave: Vex.Flow.Stave;
      activeVFRenderer: vfShow.Renderer;
      changedCallbackFunction: Function;
      /**
       * A function bound to the current stream that
       * will change the stream. Used in editableAccidentalDOM, among other places.
       *
       *      var can = s.appendNewDOM();
       *      $(can).on('click', s.DOMChangerFunction);
       */
      DOMChangerFunction: (e: MouseEvent | TouchEvent | JQuery.MouseEventBase) => base.Music21Object | undefined;
      storedVexflowStave: Vex.Flow.Stave;
      activeNote: note.GeneralNote;
      _clef: any;
      displayClef: any;
      _keySignature: any;
      _timeSignature: any;
      _instrument: any;
      _autoBeam: boolean;
      renderOptions: renderOptions.RenderOptions;
      _tempo: any;
      staffLines: number;
      _stopPlaying: boolean;
      _overriddenDuration: Duration;
      constructor();
      /**
       *
       * @returns {IterableIterator<Music21Object>}
       */
      [Symbol.iterator](): IterableIterator<base.Music21Object>;
      forEach(callback: (el: base.Music21Object, i: number, innerThis: any) => void, thisArg?: any): void;
      get duration(): Duration;
      set duration(newDuration: Duration);
      get highestTime(): number;
      get semiFlat(): this;
      get flat(): this;
      _getFlatOrSemiFlat(retainContainers: any): this;
      get notes(): iterator.StreamIterator<note.GeneralNote>;
      get notesAndRests(): iterator.StreamIterator<note.GeneralNote>;
      get tempo(): number;
      set tempo(newTempo: number);
      /**
       * Return an array of the outer bounds of each MetronomeMark in the stream.
       * [offsetStart, offsetEnd, tempo.MetronomeMark]
       */
      _metronomeMarkBoundaries(): [number, number, tempo.MetronomeMark][];
      /**
       * Return the average tempo within the span indicated by offset start and end.
       *
       * @param {number} oStart - offset start
       * @param {number} oEnd - offset end
       * @returns {number}
       */
      _averageTempo(oStart: number, oEnd: number): number;
      /**
       * Note that .instrument will never return a string, but Typescript requires
       * that getter and setter are the same.
       */
      get instrument(): instrument.Instrument | string;
      set instrument(newInstrument: instrument.Instrument | string);
      /**
       * specialContext gets from a private attribute or from zero-position
       * or from site's first or special context.
       *
       * @private
       */
      _specialContext(attr: string): any;
      /**
       * Get an attribute like 'keySignature' from an element with the
       * same class name (except 'KeySignature' instead of 'keySignature')
       * in the stream at position 0.
       *
       * @private
       */
      _firstElementContext(attr: string): base.Music21Object;
      get clef(): clef.Clef;
      set clef(newClef: clef.Clef);
      get keySignature(): KeySignature;
      set keySignature(newKeySignature: KeySignature);
      get timeSignature(): meter.TimeSignature;
      set timeSignature(newTimeSignature: meter.TimeSignature);
      get autoBeam(): any;
      set autoBeam(ab: any);
      /**
       * maxSystemWidth starts at 750.  It can then be changed
       * by renderOptions.maxSystemWidth, by activeSite's maxSystemWidth
       * (recursively); and then is scaled by renderOptions.scaleFactor.x
       *
       * Smaller scaleFactors lead to LARGER maxSystemWidth
       */
      get maxSystemWidth(): number;
      /**
       * Sets the renderOptions.maxSystemWidth after accounting for
       * scaleFactor
       */
      set maxSystemWidth(newSW: number);
      get parts(): iterator.StreamIterator<Part>;
      get measures(): iterator.StreamIterator<Measure>;
      get voices(): iterator.StreamIterator<Voice>;
      get length(): number;
      /**
       * Property: the elements in the stream returned as an Array and set
       * either from an Array or from another Stream.  Setting from another Stream
       * will preserve the offsets.
       * DO NOT MODIFY individual components (consider it like a Python tuple)
       *
       * Note that a Stream is never returned from .elements,
       * but TypeScript requires getter and setters to have the same
       * function signature.
       */
      get elements(): base.Music21Object[] | Stream;
      set elements(newElements: base.Music21Object[] | Stream);
      /**
       * getSpecialContext is a transitional replacement for
       * .clef, .keySignature, .timeSignature that looks
       * for context to get the appropriate element as ._clef, etc.
       * as a way of making the older music21j attributes still work while
       * transitioning to a more music21p-like approach.
       *
       * May be removed
       */
      getSpecialContext(context: any, warnOnCall?: boolean): any;
      /**
       * Map as if this were an Array
       */
      map(func: any): unknown[];
      filter(func: any): base.Music21Object[];
      clear(): void;
      coreElementsChanged({ updateIsFlat, clearIsSorted, memo, // unused
      keepIndex, }?: {
          updateIsFlat?: boolean;
          clearIsSorted?: boolean;
          memo?: any;
          keepIndex?: boolean;
      }): void;
      recurse({ streamsOnly, restoreActiveSites, classFilter, skipSelf, }?: {
          streamsOnly?: boolean;
          restoreActiveSites?: boolean;
          classFilter?: any;
          skipSelf?: boolean;
      }): iterator.RecursiveIterator<base.Music21Object>;
      /**
       * Add an element to the end of the stream, setting its `.offset` accordingly
       *
       * @param elOrElList - element
       * or list of elements to append
       * @returns {this}
       */
      append(elOrElList: base.Music21Object | base.Music21Object[]): this;
      sort(): this;
      /**
       * Add an element to the specified place in the stream, setting its `.offset` accordingly
       *
       * @param {number} offset - offset to place.
       * @param {Music21Object} el - element to append
       * @param {Object} [config] -- configuration options
       * @param {boolean} [config.ignoreSort=false] -- do not sort
       * @param {boolean} [config.setActiveSite=true] -- set the active site for the inserted element.
       * @returns {this}
       */
      insert(offset: number, el: base.Music21Object, { ignoreSort, setActiveSite, }?: {
          ignoreSort?: boolean;
          setActiveSite?: boolean;
      }): this;
      /**
       * Inserts a single element at offset, shifting elements at or after it begins
       * later in the stream.
       *
       * In single argument form, assumes it is an element and takes the offset from the element.
       *
       * Unlike music21p, does not take a list of elements.  TODO(msc): add this feature.
       *
       * @param {number|Music21Object} offset -- offset of the item to insert
       * @param {Music21Object|undefined} [elementOrNone] -- element.
       * @return {this}
       */
      insertAndShift(offset: number | base.Music21Object, elementOrNone?: base.Music21Object): this;
      /**
       * Return the first matched index
       */
      index(el: base.Music21Object): number;
      /**
       * Remove and return the last element in the stream,
       * or return undefined if the stream is empty
       */
      pop(): base.Music21Object | undefined;
      /**
       * Remove an object from this Stream.  shiftOffsets and recurse do nothing.
       */
      remove(targetOrList: base.Music21Object | base.Music21Object[], { shiftOffsets, recurse, }?: {
          shiftOffsets?: boolean;
          recurse?: boolean;
      }): void;
      /**
       *  Given a `target` object, replace it with
       *  the supplied `replacement` object.
       *
       *  `recurse` and `allDerived` do not currently work.
       *
       *  Does nothing if target cannot be found.
       */
      replace(target: base.Music21Object, replacement: base.Music21Object, { recurse, allDerived, }?: {
          recurse?: boolean;
          allDerived?: boolean;
      }): void;
      /**
       * Get the `index`th element from the Stream.  Equivalent to the
       * music21p format of s[index] using __getitem__.  Can use negative indexing to get from the end.
       *
       * Once Proxy objects are supported by all operating systems for
       *
       * @param {number} index - can be -1, -2, to index from the end, like python
       * @returns {Music21Object|undefined}
       */
      get(index: number): base.Music21Object;
      /**
       *
       */
      set(index: any, newEl: any): this;
      setElementOffset(el: any, value: any, addElement?: boolean): void;
      elementOffset(element: any, stringReturns?: boolean): number;
      /**
       * Takes a stream and places all of its elements into
       * measures (:class:`~music21.stream.Measure` objects)
       * based on the :class:`~music21.meter.TimeSignature` objects
       * placed within
       * the stream. If no TimeSignatures are found in the
       * stream, a default of 4/4 is used.

       * If `options.inPlace` is true, the original Stream is modified and lost
       * if `options.inPlace` is False, this returns a modified deep copy.

       * @param {Object} [options]
       * @returns {Stream}
       */
      makeMeasures(options: any): Stream;
      containerInHierarchy(el: any, { setActiveSite }?: {
          setActiveSite?: boolean;
      }): base.Music21Object;
      /**
       * chordify does not yet work...
       */
      chordify({ addTies, addPartIdAsGroup, removeRedundantPitches, toSoundingPitch, }?: {
          addTies?: boolean;
          addPartIdAsGroup?: boolean;
          removeRedundantPitches?: boolean;
          toSoundingPitch?: boolean;
      }): any;
      template({ fillWithRests, removeClasses, retainVoices, }?: {
          fillWithRests?: boolean;
          removeClasses?: any[];
          retainVoices?: boolean;
      }): this;
      cloneEmpty(derivationMethod?: string): this;
      /**
       *
       * @param {this} other
       * @returns {this}
       */
      mergeAttributes(other: Stream): this;
      /**
       * makeNotation does not do anything yet, but it is a placeholder
       * so it can start to be called.
       *
       * TODO: move call to makeBeams from renderVexflow to here.
       */
      makeNotation({ inPlace }?: {
          inPlace?: boolean;
      }): this;
      /**
       * Return a new Stream or modify this stream
       * to have beams.
       *
       * Called from renderVexflow()
       */
      makeBeams({ inPlace, setStemDirections, }?: makeNotation.MakeBeamsOptions): this;
      /**
       * Returns a boolean value showing if this
       * Stream contains any Parts or Part-like
       * sub-Streams.
       *
       * Will deal with Part-like sub-streams later
       * for now just checks for real Part objects.
       *
       * Part-like sub-streams are Streams that
       * contain Measures or Notes. And where no
       * sub-stream begins at an offset besides zero.
       */
      hasPartLikeStreams(): boolean;
      /**
       * Returns true if any note in the stream has lyrics, otherwise false
       *
       * @returns {boolean}
       */
      hasLyrics(): boolean;
      /**
       * Returns a list of OffsetMap objects
       */
      offsetMap(): OffsetMap[];
      get iter(): iterator.StreamIterator;
      /**
       * Find all elements with a certain class; if an Array is given, then any
       * matching class will work.
       *
       * @param {string[]|string} classList - a list of classes to find
       */
      getElementsByClass(classList: string | string[]): iterator.StreamIterator;
      /**
       * Find all elements NOT with a certain class; if an Array is given, then any
       * matching class will work.
       *
       * @param {string[]|string} classList - a list of classes to find
       */
      getElementsNotOfClass(classList: string | string[]): iterator.StreamIterator;
      /**
       * Returns a new stream [StreamIterator does not yet exist in music21j]
       * containing all Music21Objects that are found at a certain offset or
       * within a certain offset time range (given the offsetStart and
       * (optional) offsetEnd values).
       *
       * See music21p documentation for the effect of various parameters.
       */
      getElementsByOffset(offsetStart: number, offsetEnd?: number, { includeEndBoundary, mustFinishInSpan, mustBeginInSpan, includeElementsThatEndAtStart, classList, }?: {
          includeEndBoundary?: boolean;
          mustFinishInSpan?: boolean;
          mustBeginInSpan?: boolean;
          includeElementsThatEndAtStart?: boolean;
          classList?: any;
      }): any;
      /**
       *  Given an element (from another Stream) returns the single element
       *  in this Stream that is sounding while the given element starts.
       *
       *  If there are multiple elements sounding at the moment it is
       *  attacked, the method returns the first element of the same class
       *  as this element, if any. If no element
       *  is of the same class, then the first element encountered is
       *  returned. For more complex usages, use allPlayingWhileSounding.
       *
       *  Returns None if no elements fit the bill.
       *
       *  The optional elStream is the stream in which el is found.
       *  If provided, el's offset
       *  in that Stream is used.  Otherwise, the current offset in
       *  el is used.  It is just
       *  in case you are paranoid that el.offset might not be what
       *  you want, because of some fancy manipulation of
       *  el.activeSite
       *
       *  el is the object with an offset and class to search for.
       *
       *  elStream is a place to get el's offset from.  Otherwise activeSite is used
       */
      playingWhenAttacked(el: base.Music21Object, elStream?: any): base.Music21Object | undefined;
      /**
          A method to set and provide accidentals given various conditions and contexts.

          `pitchPast` is a list of pitches preceding this pitch in this measure.

          `pitchPastMeasure` is a list of pitches preceding this pitch but in a previous measure.

          If `useKeySignature` is True, a :class:`~music21.key.KeySignature` will be searched
          for in this Stream or this Stream's defined contexts. An alternative KeySignature
          can be supplied with this object and used for temporary pitch processing.

          If `alteredPitches` is a list of modified pitches (Pitches with Accidentals) that
          can be directly supplied to Accidental processing. These are the same values obtained
          from a :class:`music21.key.KeySignature` object using the
          :attr:`~music21.key.KeySignature.alteredPitches` property.

          If `cautionaryPitchClass` is True, comparisons to past accidentals are made regardless
          of register. That is, if a past sharp is found two octaves above a present natural,
          a natural sign is still displayed.

          If `cautionaryAll` is true, all accidentals are shown.

          If `overrideStatus` is true, this method will ignore any current `displayStatus` stetting
          found on the Accidental. By default this does not happen. If `displayStatus` is set to
          None, the Accidental's `displayStatus` is set.

          If `cautionaryNotImmediateRepeat` is true, cautionary accidentals will be displayed for
          an altered pitch even if that pitch had already been displayed as altered.

          If `tiePitchSet` is not None it should be a set of `.nameWithOctave` strings
          to determine whether following accidentals should be shown because the last
          note of the same pitch had a start or continue tie.

          If `searchKeySignatureByContext` is true then keySignatures from the context of the
          stream will be used if none found.  (DOES NOT WORK YET)

          The :meth:`~music21.pitch.Pitch.updateAccidentalDisplay` method is used to determine if
          an accidental is necessary.

          This will assume that the complete Stream is the context of evaluation. For smaller context
          ranges, call this on Measure objects.

          If `inPlace` is True, this is done in-place; if `inPlace` is False,
          this returns a modified deep copy.

          TODO: inPlace default will become False in when music21p v.7 is released.

          Called automatically before appendDOM routines are called.
       */
      makeAccidentals({ pitchPast, pitchPastMeasure, useKeySignature, alteredPitches, searchKeySignatureByContext, // not yet used.
      cautionaryPitchClass, cautionaryAll, inPlace, overrideStatus, cautionaryNotImmediateRepeat, tiePitchSet, }?: MakeAccidentalsParams): this;
      /**
       * Sets the render options for any substreams (such as placing them
       * in systems, etc.) DOES NOTHING for music21.stream.Stream, but is
       * overridden in subclasses.
       *
       * @returns {this}
       */
      setSubstreamRenderOptions(): this;
      /**
       * Resets all the RenderOptions back to defaults. Can run recursively
       * and can also preserve the `RenderOptions.events` object.
       *
       * @param {boolean} [recursive=false]
       * @param {boolean} [preserveEvents=false]
       * @returns {this}
       */
      resetRenderOptions(recursive: any, preserveEvents: any): this;
      write(format?: string): string;
      /**
       * Uses {@link music21.vfShow.Renderer} to render Vexflow onto an
       * existing canvas or SVG object.
       *
       * Runs `this.setRenderInteraction` on the canvas.
       *
       * Will be moved to vfShow eventually when converter objects are enabled...maybe.
       *
       * @param {jQuery|HTMLElement} $canvasOrSVG - a canvas or the div surrounding an SVG object
       * @returns {music21.vfShow.Renderer}
       */
      renderVexflow($canvasOrSVG: any): vfShow.Renderer;
      /**
       * Estimate the stream height for the Stream.
       *
       * If there are systems they will be incorporated into the height unless `ignoreSystems` is `true`.
       *
       * @returns {number} height in pixels
       */
      estimateStreamHeight({ ignoreSystems, ignoreMarginBottom }?: {
          ignoreSystems?: boolean;
          ignoreMarginBottom?: boolean;
      }): number;
      /**
       * Estimates the length of the Stream in pixels.
       *
       * @returns {number} length in pixels
       */
      estimateStaffLength(): any;
      /**
       * Returns either (1) a Stream containing Elements
       * (that wrap the null object) whose offsets and durations
       * are the length of gaps in the Stream
       * or (2) null if there are no gaps.
       * @returns {object}
       */
      findGaps(): Stream;
      /**
       * Returns True if there are no gaps between the lowest offset and the highest time.
       * Otherwise returns False
       *
       * @returns {boolean}
       */
      get isGapless(): boolean;
      /**
       * Plays the Stream through the MIDI/sound playback (for now, only MIDI.js is supported)
       *
       * `options` can be an object containing:
       * - instrument: {@link `music`21.instrument.Instrument} object (default, `this.instrument`)
       * - tempo: number (default, `this.tempo`)
       *
       * @param {Object} [options] - object of playback options
       * @returns {this}
       */
      playStream(options?: {}): this;
      /**
       * Stops a stream from playing if it currently is.
       *
       * @returns {this}
       */
      stopPlayStream(): this;
      /**
       * Creates and returns a new `&lt;canvas&gt;` or `&lt;svg&gt;` object.
       *
       * Calls setSubstreamRenderOptions() first.
       *
       * Does not render on the DOM element.
       *
       * elementType can be `svg` (default) or `canvas`
       *
       * returns a $div encompassing either the SVG or Canvas element.
       *
       * if width is undefined, will use `this.estimateStaffLength()`
       *     + `this.renderOptions.staffPadding`
       *
       * if height is undefined  will use
       *     `this.renderOptions.height`. If still undefined, will use
       *     `this.estimateStreamHeight()`
       */
      createNewDOM(width?: number | string, height?: number | string, elementType?: string): JQuery<HTMLDivElement> | JQuery<HTMLCanvasElement>;
      /**
       * Creates a rendered, playable svg where clicking plays it.
       *
       * Called from appendNewDOM() etc.
       *
       */
      createPlayableDOM(width?: number | string | undefined, height?: number | string | undefined, elementType?: string): JQuery;
      /**
       * Creates a new svg and renders vexflow on it
       *
       * @param {number|string|undefined} [width]
       * @param {number|string|undefined} [height]
       * @param {string} elementType - what type of element svg or canvas, default = svg
       * @returns {JQuery} canvas or SVG
       */
      createDOM(width?: number | string | undefined, height?: number | string | undefined, elementType?: string): JQuery;
      /**
       * Creates a new canvas, renders vexflow on it, and appends it to the DOM.
       *
       * @param {JQuery|HTMLElement} [appendElement=document.body] - where to place the svg
       * @param {number|string} [width]
       * @param {number|string} [height]
       * @param {string} elementType - what type of element, default = svg
       * @returns {SVGElement|HTMLElement} svg (not the jQuery object --
       * this is a difference with other routines and should be fixed. TODO: FIX)
       *
       */
      appendNewDOM(appendElement?: JQuery | HTMLElement, width?: number | string, height?: number | string, elementType?: string): HTMLElement;
      /**
       * Replaces a particular Svg with a new rendering of one.
       *
       * Note that if 'where' is empty, will replace all svg elements on the page.
       *
       * @param {JQuery|HTMLElement} [where] - the canvas or SVG to replace or
       *     a container holding the canvas(es) to replace.
       * @param {boolean} [preserveSvgSize=false]
       * @param {string} elementType - what type of element, default = svg
       * @returns {JQuery} the svg
       */
      replaceDOM(where: any, preserveSvgSize?: boolean, elementType?: string): JQuery;
      /**
       * Set the type of interaction on the svg based on
       *    - Stream.renderOptions.events.click
       *    - Stream.renderOptions.events.dblclick
       *    - Stream.renderOptions.events.resize
       *
       * Currently the only options available for each are:
       *    - 'play' (string)
       *    - 'reflow' (string; only on event.resize)
       *    - customFunction (will receive event as a first variable; should set up a way to
       *                    find the original stream; var s = this; var f = function () { s...}
       *                   )
       *
       * @param {JQuery|HTMLElement} canvasOrDiv - canvas or the Div surrounding it.
       * @returns {this}
       */
      setRenderInteraction(canvasOrDiv: JQuery | HTMLElement): this;
      /**
       *
       * Recursively search downward for the closest storedVexflowStave...
       *
       * @returns {Vex.Flow.Stave|undefined}
       */
      recursiveGetStoredVexflowStave(): any;
      /**
       * Given a mouse click, or other event with .pageX and .pageY,
       * find the x and y for the svg.
       *
       * returns {Array<number>} two-elements, [x, y] in pixels.
       */
      getUnscaledXYforDOM(svg: any, e: MouseEvent | TouchEvent | JQuery.MouseEventBase): [number, number];
      /**
       * return a list of [scaledX, scaledY] for
       * a svg element.
       *
       * xScaled refers to 1/scaleFactor.x -- for instance, scaleFactor.x = 0.7 (default)
       * x of 1 gives 1.42857...
       *
       */
      getScaledXYforDOM(svg: HTMLElement | SVGElement, e: MouseEvent | TouchEvent | JQuery.MouseEventBase): [number, number];
      /**
       *
       * Given a Y position find the diatonicNoteNum that a note at that position would have.
       *
       * searches this.storedVexflowStave
       *
       * Y position must be offset from the start of the stave...
       */
      diatonicNoteNumFromScaledY(yPxScaled: number): number;
      /**
       * Returns the stream that is at X location xPxScaled and system systemIndex.
       *
       * Override in subclasses, always returns this; here.
       *
       * @param {number} xPxScaled
       * @param {number} [systemIndex]
       * @returns {this}
       *
       */
      getStreamFromScaledXandSystemIndex(xPxScaled: any, systemIndex?: number): this;
      /**
       *
       * Return the note (or chord or rest) at pixel X (or within allowablePixels [default 10])
       * of the note.
       *
       * systemIndex element is not used on bare Stream
       *
       * options can be a dictionary of: 'allowBackup' which gets the closest
       * note within the window even if it's beyond allowablePixels (default: true)
       * and 'backupMaximum' which specifies a maximum distance even for backup
       * (default: 70);
       *
       * @param {number} xPxScaled
       * @param {number} [allowablePixels=10]
       * @param {number} [systemIndex]
       * @param {Object} [options]
       * @returns {Music21Object|undefined}
       */
      noteElementFromScaledX(xPxScaled: number, allowablePixels?: number, systemIndex?: number, options?: {}): base.Music21Object;
      /**
       * Given an event object, and an x and y location, returns a two-element array
       * of the pitch.Pitch.diatonicNoteNum that was clicked (i.e., if C4 was clicked this
       * will return 29; if D4 was clicked this will return 30) and the closest note in the
       * stream that was clicked.
       *
       * Return a list of [diatonicNoteNum, closestXNote]
       * for an event (e) called on the svg (svg)
       *
       * @returns {Array} [diatonicNoteNum, closestXNote]
       */
      findNoteForClick(svg?: HTMLElement | SVGElement, e?: MouseEvent | TouchEvent | JQuery.MouseEventBase, x?: number, y?: number): [number, base.Music21Object];
      /**
       * Change the pitch of a note given that it has been clicked and then
       * call changedCallbackFunction
       *
       * @param {number} clickedDiatonicNoteNum
       * @param {music21.note.Note} foundNote
       * @param {SVGElement|HTMLElement} svg
       * @returns {*} output of changedCallbackFunction
       */
      noteChanged(clickedDiatonicNoteNum: number, foundNote: note.Note, svg: SVGElement | HTMLElement): any;
      /**
       * Redraws an svgDiv, keeping the events of the previous svg.
       */
      redrawDOM(svg: JQuery | HTMLElement | SVGElement): JQuery;
      /**
       * Renders a stream on svg with the ability to edit it and
       * a toolbar that allows the accidentals to be edited.
       */
      editableAccidentalDOM(width?: number, height?: number, { minAccidental, maxAccidental, }?: {
          minAccidental?: number;
          maxAccidental?: number;
      }): JQuery<HTMLDivElement>;
      /**
       * Returns an accidental toolbar from minAccidental to maxAccidental.
       *
       * If $siblingSvg is defined then this toolbar alters the notes in that
       * toolbar.
       */
      getAccidentalToolbar(minAccidental?: number, maxAccidental?: number, $siblingSvg?: JQuery): JQuery<HTMLDivElement>;
      /**
       * get a JQuery div containing two buttons -- play and stop
       */
      getPlayToolbar(): JQuery<HTMLDivElement>;
      /**
       * Begins a series of bound events to the window that makes it
       * so that on resizing the stream is redrawn and reflowed to the
       * new size.
       *bt
       */
      windowReflowStart($jSvg: JQuery): this;
      /**
       * Does this stream have a {@link Voice} inside it?
       */
      hasVoices(): boolean;
  }
  export class Voice extends Stream {
      static get className(): string;
      constructor();
  }
  export class Measure extends Stream {
      static get className(): string;
      recursionType: string;
      isMeasure: boolean;
      number: number;
      numberSuffix: string;
      paddingLeft: number;
      paddingRight: number;
      stringInfo(): string;
      measureNumberWithSuffix(): string;
  }
  /**
   * Part -- specialized to handle Measures inside it
   *
   * @class Part
   * @memberof music21.stream
   */
  export class Part extends Stream {
      static get className(): string;
      recursionType: string;
      /**
       * How many systems does this Part have?
       *
       * Does not change any reflow information, so by default it's always 1.
       */
      numSystems(): number;
      /**
       * Find the width of every measure in the Part.
       */
      getMeasureWidths(): number[];
      /**
       * Overrides the default music21.stream.Stream#estimateStaffLength
       */
      estimateStaffLength(): number;
      systemWidthsAndBreaks(): [number[], number[]];
      /**
       * Divide a part up into systems and fix the measure
       * widths so that they are all even.
       *
       * Note that this is done on the part level even though
       * the measure widths need to be consistent across parts in a score.
       * This is possible because the system is deterministic and
       * will come to the same result for each part.  Opportunity
       * for making more efficient through this...
       *
       * returns an array of all the widths
       */
      fixSystemInformation(systemHeight?: number, systemPadding?: number): number[];
      /**
       * overrides music21.stream.Stream#setSubstreamRenderOptions
       *
       * figures out the `.left` and `.top` attributes for all contained measures
       *
       */
      setSubstreamRenderOptions(): this;
      /**
       * systemIndexAndScaledY - given a scaled Y, return the systemIndex
       * and the scaledYRelativeToSystem
       *
       * @param  {number} y the scaled Y
       * @return {number[]}  systemIndex, scaledYRelativeToSystem
       */
      systemIndexAndScaledY(y: any): number[];
      /**
       * Overrides the default music21.stream.Stream#findNoteForClick
       * by taking into account systems
       *
       * @returns {Array} [clickedDiatonicNoteNum, foundNote]
       */
      findNoteForClick(svg?: HTMLElement | SVGElement, e?: MouseEvent | TouchEvent | JQuery.MouseEventBase, x?: number, y?: number): [number, base.Music21Object];
      /**
       * Returns the measure that is at X location xPxScaled and system systemIndex.
       *
       * @param {number} [xPxScaled]
       * @param {number} [systemIndex]
       * @returns {Stream}
       *
       */
      getStreamFromScaledXandSystemIndex(xPxScaled: any, systemIndex?: any): any;
  }
  /**
   * Scores with multiple parts
   */
  export class Score extends Stream {
      static get className(): string;
      recursionType: string;
      measureWidths: number[];
      constructor();
      get clef(): clef.Clef;
      set clef(newClef: clef.Clef);
      /**
       * Override main stream makeBeams to call on each part.
       */
      makeBeams({ inPlace, setStemDirections }?: makeNotation.MakeBeamsOptions): this;
      /**
       * Returns the measure that is at X location xPxScaled and system systemIndex.
       *
       * Always returns the measure of the top part...
       *
       * @param {number} xPxScaled
       * @param {number} [systemIndex]
       * @returns {Stream} usually a Measure
       *
       */
      getStreamFromScaledXandSystemIndex(xPxScaled: any, systemIndex?: number): any;
      /**
       * overrides music21.stream.Stream#setSubstreamRenderOptions
       *
       * figures out the `.left` and `.top` attributes for all contained parts
       */
      setSubstreamRenderOptions(): this;
      /**
       * Overrides the default music21.stream.Stream#estimateStaffLength
       *
       * @returns {number}
       */
      estimateStaffLength(): number;
      /**
       * Overrides the default music21.stream.Stream#playStream
       *
       * Works poorly -- just starts *n* midi players.
       *
       * Render scrollable score works better...
       *
       * @param {Object} params -- passed to each part
       */
      playStream(params: any): this;
      /**
       * Overrides the default music21.stream.Stream#stopPlayScore()
       */
      stopPlayStream(): this;
      /**
       * call after setSubstreamRenderOptions
       * gets the maximum measure width for each measure
       * by getting the maximum for each measure of
       * Part.getMeasureWidths();
       *
       * Does this work? I found a bug in this and fixed it that should have
       * broken it!
       *
       * @returns Array<number>
       */
      getMaxMeasureWidths(): any[];
      /**
       * systemIndexAndScaledY - given a scaled Y, return the systemIndex
       * and the scaledYRelativeToSystem
       *
       * @param  {number} y the scaled Y
       * @return Array<number>   systemIndex, scaledYRelativeToSystem
       */
      systemIndexAndScaledY(y: any): number[];
      /**
       * Score object
       *
       * Returns a list of [clickedDiatonicNoteNum, foundNote] for a
       * click or other mouse event, taking into account that the note will be in different
       * Part objects (and different Systems) given the height and possibly different Systems.
       *
       * returns [diatonicNoteNum, m21Element]
       */
      findNoteForClick(svg?: HTMLElement | SVGElement, e?: MouseEvent | TouchEvent | JQuery.MouseEventBase, x?: number, y?: number): [number, base.Music21Object];
      /**
       * How many systems are there? Calls numSystems() on the first part.
       */
      numSystems(): number;
      /**
       * Makes the width of every Measure object within a measure stack be the same.
       * if setLeft is true then also set the renderOptions.left
       *
       * This does not even out systems.
       *
       * @param {Object} options
       * @param {boolean} [options.setLeft=true]
       */
      evenPartMeasureSpacing({ setLeft }?: {
          setLeft?: boolean;
      }): this;
  }
  export class OffsetMap {
      element: base.Music21Object;
      offset: number;
      endTime: number;
      voiceIndex: number;
      constructor(element: base.Music21Object, offset: number, endTime: number, voiceIndex: number);
  }

}
declare module 'music21j/music21/svgs' {
  export const acc_dbl_flat: SVGElement;
  export const acc_flat: SVGElement;
  export const acc_natural: SVGElement;
  export const acc_sharp: SVGElement;
  export const acc_dbl_sharp: SVGElement;
  export const svg_accidentals: Map<any, any>;

}
declare module 'music21j/music21/tempo' {
  /// <reference types="jquery" />
  import * as prebase from 'music21j/music21/prebase';
  import * as base from 'music21j/music21/base';
  import { Music21Exception } from 'music21j/music21/exceptions21';
  export class TempoException extends Music21Exception {
  }
  /**
   * Object mapping names to tempo values
   *
   * @name music21.tempo.defaultTempoValues
   * @memberof music21.tempo
   * @example
   * music21.tempo.defaultTempoValues.grave
   * // 40
   */
  export const defaultTempoValues: {
      larghissimo: number;
      largamente: number;
      grave: number;
      'molto adagio': number;
      largo: number;
      lento: number;
      adagio: number;
      slow: number;
      langsam: number;
      larghetto: number;
      adagietto: number;
      andante: number;
      andantino: number;
      'andante moderato': number;
      maestoso: number;
      moderato: number;
      moderate: number;
      allegretto: number;
      animato: number;
      'allegro moderato': number;
      allegro: number;
      fast: number;
      schnell: number;
      allegrissimo: number;
      'molto allegro': number;
      'tr\u00E8s vite': number;
      vivace: number;
      vivacissimo: number;
      presto: number;
      prestissimo: number;
  };
  export const baseTempo = 60;
  /**
   *
   * @class Metronome
   * @memberof music21.tempo
   * @extends music21.prebase.ProtoM21Object
   * @param {number} [tempo=music21.tempo.baseTempo] - the tempo of the metronome to start
   * @property {number} tempo
   * @property {number} [numBeatsPerMeasure=4]
   * @property {number} [minTempo=10]
   * @property {number} [maxTempo=600]
   * @property {boolean} [flash=false] - flash the tempo
   * @property {boolean} [silent=false] - play silently
   * @property {number} beat - current beat number
   * @property {number} chirpTimeout - an index of a timeout object for chirping
   */
  export class Metronome extends prebase.ProtoM21Object {
      static get className(): string;
      _tempo: number;
      numBeatsPerMeasure: number;
      minTempo: number;
      maxTempo: number;
      beat: number;
      chirpTimeout: number;
      silent: boolean;
      flash: boolean;
      tempoRanges: number[];
      tempoIncreases: number[];
      $metronomeDiv: JQuery;
      constructor(tempoInt?: number);
      get tempo(): number;
      set tempo(t: number);
      get beatLength(): number;
      _silentFlash(flashColor: any): void;
      /**
       * Play a note (a higher one on the downbeat) and start the metronome chirping.
       */
      chirp(): void;
      /**
       * Stop the metronome from chirping.
       */
      stopChirp(): void;
      /**
       * Increase the metronome tempo one "click".
       *
       * Value changes depending on the current tempo.  Uses standard metronome guidelines.
       *
       * To change the tempo, just set this.tempo = n
       *
       * @param {int} [n=1 - number of clicks to the right
       * @returns {number} new tempo
       */
      increaseSpeed(n?: number): number;
      /**
       * Decrease the metronome tempo one "click"
       *
       * To change the tempo, just set this.tempo = n
       *
       * @param {int} [n=1] - number of clicks to the left
       * @returns {number} new tempo
       */
      decreaseSpeed(n?: number): number;
      /**
       * add a Metronome interface onto the DOM at where
       *
       * @param {jQuery|HTMLElement} [where]
       * @returns {jQuery} - a div holding the metronome.
       */
      addDiv(where: any): JQuery<HTMLElement>;
  }
  class TempoText {
      text: string;
      constructor(text?: string);
  }
  /**
   *
   * @class MetronomeMark
   * @memberof music21.tempo
   * @extends base.Music21Object
   * @param {Object} metronome - metronome
   * @param {string} metronome.text - tempo text
   * @param {number} metronome.number - beats per minute
   * @param {number|music21.duration.Duration} metronome.referent - duration value of tempo
   * @param {boolean} metronome.parentheses - ???
   * @property {string} text - tempo text
   * @property {number} number - beats per minute
   * @property {music21.duration.Duration} referent - duration value of tempo
   */
  export class MetronomeMark extends base.Music21Object {
      static get className(): string;
      protected _number: number;
      numberImplicit: boolean;
      protected _tempoText: TempoText;
      textImplicit: any;
      protected _referent: any;
      parentheses: boolean;
      constructor({ text, number, referent, parentheses, }?: {
          text?: any;
          number?: any;
          referent?: any;
          parentheses?: boolean;
      });
      _updateNumberFromText(): void;
      _updateTextFromNumber(): void;
      get text(): undefined | string | TempoText;
      set text(value: undefined | string | TempoText);
      get number(): number;
      set number(value: number);
      get referent(): any;
      set referent(value: any);
      _getDefaultNumber(tempoText: any): any;
      _getDefaultText(number: any, spread?: number): string;
  }
  export {};

}
declare module 'music21j/music21/tie' {
  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/tie -- ties!
   *
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
   *
   */
  import * as prebase from 'music21j/music21/prebase';
  /**
   * Tie class. Found in {@link music21.note.GeneralNote} `.tie`.
   *
   * Does not support advanced music21p values `.to` and `.from`
   *
   * @class Tie
   * @memberof music21.tie
   * @extends music21.prebase.ProtoM21Object
   * @param {string} type - 'start', 'stop', 'continue', or 'let-ring'
   * @property {string} type - the tie type
   * @property {string} style - only supports 'normal' for now.
   * @property {string|undefined} placement - undefined = unknown or above/below.
   * (NB currently does nothing)
   */
  export class Tie extends prebase.ProtoM21Object {
      static get className(): string;
      protected _type: string;
      style: string;
      placement: string;
      constructor(type?: string);
      stringInfo(): string;
      get type(): string;
      set type(newType: string);
  }

}
declare module 'music21j/music21/tinyNotation' {
  import * as stream from 'music21j/music21/stream';
  /**
   * **Function, not class**.
   *
   * Converts a TinyNotation String into a music21 Stream
   *
   * See music21p for examples of what can go into tinyNotation. It's an
   * adaptation of Lilypond format, by design Extremely simple!
   *
   * * textIn - a valid tinyNotation string
   *
   * * returns {music21.stream.Part|music21.stream.Measure} - a Stream or Part object (if multiple measures)
   *
   * @example
   * var t = "3/4 c4 B8 c d4 e2.";
   * var p = music21.tinyNotation.TinyNotation(t);
   * p.duration.quarterLength;
   * // 6.0
   */
  export function TinyNotation(textIn: string): stream.Part | stream.Measure | stream.Score;
  /**
   * Render all the TinyNotation classes in the DOM as notation
   *
   * Called automatically when music21 is loaded.
   *
   * @memberof music21.tinyNotation
   * @param {string} [classTypes='.music21.tinyNotation'] - a JQuery selector to find elements to replace.
   * @param {HTMLElement|jQuery} [selector]
   */
  export function renderNotationDivs(classTypes?: string, selector?: any): void;

}
declare module 'music21j/music21/vfShow' {
  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/vfShow -- Vexflow integration
   *
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
   *
   * for rendering vexflow. Will eventually go to music21/converter/vexflow
   *
   * See {@link music21.vfShow} namespace for details
   *
   * @namespace music21.vfShow
   * @memberof music21
   * @requires music21.common
   * @requires vexflow
   * @exports music21.vfShow
   */
  import Vex from 'vexflow';
  import * as stream from 'music21j/music21/stream';
  /**
   * Represents a stack of objects that need to be rendered together.
   *
   * An intermediary state for showing created by {@link music21.vfShow.Renderer}.
   *
   * @class RenderStack
   * @memberof music21.vfShow
   * @property {Stream[]} streams - {@link Stream} objects
   * associated with the voices
   * @property {Array<Vex.Flow.Voice>} voices - Vex.Flow.Voice objects
   * @property {Array} textVoices - Vex.Flow.Voice objects for the text.
   */
  export class RenderStack {
      streams: stream.Stream[];
      voices: Vex.Flow.Voice[];
      textVoices: Vex.Flow.Voice[];
      voiceToStreamMapping: Map<any, any>;
      /**
       * @returns {Array} this.voices and this.textVoices as one array
       */
      allTickables(): Vex.Flow.Voice[];
      /**
       * @returns {Array<Array>} each array represents one staff....
       * where this.voices and this.textVoices are all in that staff...
       */
      tickablesByStave(): any[];
  }
  /**
   * Renderer is a function that takes a stream, an
   * optional existing canvas or SVG element and a DOM
   * element where the canvas or SVG element should be placed
   * and renders the stream as Vexflow on the
   * canvas or svg element, placing it then in the where
   * DOM.
   *
   * "s" can be any type of Stream.
   *
   * "div" and "where" can be either a DOM
   * element or a jQuery object.
   *
   * @class Renderer
   * @memberof music21.vfShow
   * @param {Stream} s - main stream to render
   * @param {div} [div] - existing canvas or div-surroundingSVG element
   * @param {Node|jQuery} [where=document.body] - where to render the stream
   * @property {Vex.Flow.Renderer} vfRenderer - a Vex.Flow.Renderer to use
   * (will create if not existing)
   * @property {string} rendererType - canvas or svg
   * @property ctx - a Vex.Flow.SVGContext or Vex.Flow.CanvasContext to use.
   * @property {div} div - div-with-svg-or-canvas element
   * @property {jQuery} $div - jQuery div or canvas element
   * @property {jQuery} $where - jQuery element to render onto
   * @property {Vex.Flow.Formatter} activeFormatter - formatter
   * @property {Array<Vex.Flow.Beam>} beamGroups - beamGroups
   * @property {Array<Vex.Flow.StaveTie>} vfTies - ties as instances of Vex.Flow.StaveTie
   * @property {Array<number>} systemBreakOffsets - where to break the systems
   * @property {Array<Vex.Flow.Tuplet>} vfTuplets - tuplets represented in Vexflow
   * @property {Array<music21.vfShow.RenderStack>} stacks - array of RenderStack objects
   */
  export class Renderer {
      stream: stream.Stream;
      rendererType: string;
      div: any;
      $div: any;
      $where: any;
      activeFormatter: any;
      _vfRenderer: any;
      _ctx: any;
      beamGroups: any[];
      stacks: any[];
      vfTies: any[];
      systemBreakOffsets: any[];
      vfTuplets: any[];
      constructor(s: any, div?: any, where?: any);
      get vfRenderer(): any;
      set vfRenderer(vfr: any);
      get ctx(): any;
      set ctx(ctx: any);
      /**
       *
       * main function to render a Stream.
       *
       * if s is undefined, uses the stored Stream from
       * the constructor object.
       *
       * @param {Stream} [s=this.stream]
       */
      render(s?: stream.Stream): void;
      /**
       * Prepares a scorelike stream (i.e., one with parts or
       * Streams that should be rendered vertically like parts)
       * for rendering and adds Staff Connectors
       *
       * @param {music21.stream.Score} s - prepare a stream of parts (i.e., Score)
       */
      prepareScorelike(s: stream.Score): void;
      /**
       *
       * Prepares a Partlike stream (that is one with Measures
       * or substreams that should be considered like Measures)
       * for rendering.
       *
       * @param {music21.stream.Part} p
       */
      preparePartlike(p: stream.Part): void;
      /**
       *
       * Prepares a score that arrived flat... sets up
       * stacks and vfTies after calling prepareFlat
       *
       * @param {Stream} m - a flat stream (maybe a measure or voice)
       */
      prepareArrivedFlat(m: stream.Stream): void;
      /**
       *
       * Prepares a measure (w/ or w/o voices) or generic Stream -- makes accidentals,
       * associates a Vex.Flow.Stave with the stream and
       * returns a vexflow Voice object
       *
       * @param {music21.stream.Measure} m - a measure object (w or w/o voices)
       * @param {music21.vfShow.RenderStack} stack - a RenderStack object to prepare into.
       */
      prepareMeasure(m: any, stack: any): any;
      /**
       * Main internal routine to prepare a flat stream
       *
       * @param {Stream} s - a flat stream object
       * @param {music21.vfShow.RenderStack} stack - a RenderStack object to prepare into.
       * @param {Vex.Flow.Stave} [optionalStave] - an optional existing stave.
       * @param {Object} [optional_renderOp] - render options.
       * Passed to {@link music21.vfShow.Renderer#renderStave}
       * @returns {Vex.Flow.Stave} staff to return too
       * (also changes the `stack` parameter and runs `makeNotation` on s)
       */
      prepareFlat(s: any, stack: any, optionalStave?: any, optional_renderOp?: any): any;
      /**
       * Render the Vex.Flow.Stave from a flat stream and draws it.
       *
       * Just draws the stave, not the notes, etc.
       *
       * @param {Stream} [m=this.stream] - a flat stream
       * @param {Object} [optional_rendOp] - render options, passed
       * to {@link music21.vfShow.Renderer#newStave} and {@link music21.vfShow.Renderer#setClefEtc}
       * @returns {Vex.Flow.Stave} stave
       */
      renderStave(m?: any, optional_rendOp?: any): any;
      /**
       * Draws the Voices (music and text) from `this.stacks`
       *
       */
      drawMeasureStacks(): void;
      /**
       * draws the tuplets.
       *
       */
      drawTuplets(): void;
      /**
       * draws the vfTies
       *
       */
      drawTies(): void;
      /**
       * Finds all tied notes and creates the proper Vex.Flow.StaveTie objects in
       * `this.vfTies`.
       *
       * @param {Stream} p - a Part or similar object
       */
      prepareTies(p: stream.Stream): void;
      /**
       * Returns a Vex.Flow.Voice object with all the tickables (i.e., Notes, Voices, etc.)
       *
       * Does not draw it...
       *
       * @param {Stream} [s=this.stream] -- usually a Measure or Voice
       * @param {Vex.Flow.Stave} stave - not optional (would never fly in Python...)
       * @returns {Vex.Flow.Voice}
       */
      getVoice(s: stream.Stream, stave: any): any;
      /**
       * Returns a Vex.Flow.Voice with the lyrics set to render in the proper place.
       *
       * @param {Stream} s -- usually a Measure or Voice
       * @param {Vex.Flow.Stave} stave
       * @returns {Vex.Flow.Voice}
       */
      getLyricVoice(s: any, stave: any): any;
      /**
       * Aligns all of `this.stacks` (after they've been prepared) so they align properly.
       *
       */
      formatMeasureStacks(): void;
      /**
       * Formats a single voice group from a stack.
       *
       * @param {music21.vfShow.RenderStack} stack
       * @param {boolean} [autoBeam=measures[0].autoBeam]
       * @returns {Vex.Flow.Formatter}
       */
      formatVoiceGroup(stack: any, autoBeam?: boolean): any;
      /**
       * Draws the beam groups.
       *
       */
      drawBeamGroups(): void;
      /**
       * Return a new Vex.Flow.Stave object, which represents
       * a single MEASURE of notation in m21j
       *
       * @param {Stream} s
       * @param {Object} [rendOp]
       * @returns {Vex.Flow.Stave}
       */
      newStave(s: any, rendOp: any): any;
      /**
       * Sets the number of stafflines, puts the clef on the Stave,
       * adds keySignature, timeSignature, and rightBarline
       *
       * @param {Stream} s
       * @param {Vex.Flow.Stave} stave
       * @param {Object} [rendOp=s.renderOptions] - a {@link music21.renderOptions.RenderOptions}
       * object that might have
       * `{showMeasureNumber: boolean, rightBarLine: string<{'single', 'double', 'end'}>}`
       */
      setClefEtc(s: any, stave: any, rendOp: any): void;
      /**
       * Sets the number of stafflines properly for the Stave object.
       *
       * This method does not just set Vex.Flow.Stave#setNumLines() except
       * if the number of lines is 0 or >=4, because the default in VexFlow is
       * to show the bottom(top?), not middle, lines and that looks bad.
       *
       * @param {Stream} s - stream to get the `.staffLines`
       * from `s.renderOptions` from -- should allow for overriding.
       * @param {Vex.Flow.Stave} vexflowStave - stave to set the staff lines for.
       */
      setStafflines(s: any, vexflowStave: any): void;
      /**
       * Gets the Vex.Flow.StaveNote objects from a Stream.
       *
       * Also changes `this.vfTuplets`.
       *
       * @param {Stream} [s=this.stream] - flat stream to find notes in
       * @param {Vex.Flow.Stave} stave - Vex.Flow.Stave to render notes on to.
       * @returns {Array<Vex.Flow.StaveNote>} notes to return
       */
      vexflowNotes(s: any, stave: any): any[];
      /**
       * Gets an Array of `Vex.Flow.TextNote` objects from any lyrics found in s
       *
       * @param {Stream} s - flat stream to search.
       * @param {Vex.Flow.Stave} stave
       * @returns {Array<Vex.Flow.TextNote>}
       */
      vexflowLyrics(s: any, stave: any): any[];
      /**
       * Creates a Vex.Flow.Voice of the appropriate length given a Stream.
       */
      vexflowVoice(s: stream.Stream): Vex.Flow.Voice;
      staffConnectorsMap(connectorType: any): any;
      /**
       * If a stream has parts (NOT CHECKED HERE) create and
       * draw an appropriate Vex.Flow.StaveConnector
       *
       * @param {music21.stream.Score} s
       */
      addStaffConnectors(s: any): void;
      /**
       * The process of putting a Stream onto a div affects each of the
       * elements in the Stream by adding pieces of information to
       * each {@link Music21Object} -- see `applyFormatterInformationToNotes`
       *
       * You might want to remove this information; this routine does that.
       *
       * @param {Stream} s - can have parts, measures, etc.
       * @param {boolean} [recursive=false]
       */
      removeFormatterInformation(s: any, recursive?: boolean): void;
      /**
       * Adds the following pieces of information to each Note
       *
       * - el.x -- x location in pixels
       * - el.y -- y location in pixels
       * - el.width - width of element in pixels.
       * - el.systemIndex -- which system is it on
       * - el.activeVexflowNote - which Vex.Flow.StaveNote is it connected with.
       *
       * mad props to our friend Vladimir Viro for figuring this out! Visit http://peachnote.com/
       *
       * Also sets s.storedVexflowStave to stave.
       *
       * @param {Vex.Flow.Stave} stave
       * @param {Stream} [s=this.stream]
       * @param {Vex.Flow.Formatter} formatter
       */
      applyFormatterInformationToNotes(stave: Vex.Flow.Stave, s?: stream.Stream, formatter?: any): void;
  }

}
declare module 'music21j/music21/voiceLeading' {
  /**
   * music21j -- Javascript reimplementation of Core music21 features.
   * music21/voiceLeading -- voiceLeading objects
   *
   * Copyright (c) 2013-18, Michael Scott Cuthbert and cuthbertLab
   * Based on music21, Copyright (c) 2006–18, Michael Scott Cuthbert and cuthbertLab
   *
   * @namespace music21.voiceLeading
   */
  import * as interval from 'music21j/music21/interval';
  import * as key from 'music21j/music21/key';
  import * as note from 'music21j/music21/note';
  import { Music21Object } from 'music21j/music21/base';
  export const MotionType: {
      antiParallel: string;
      contrary: string;
      noMotion: string;
      oblique: string;
      parallel: string;
      similar: string;
  };
  /**
   * @memberOf music21.voiceLeading
   * @extends Music21Object
   */
  export class VoiceLeadingQuartet extends Music21Object {
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
      constructor(v1n1: any, v1n2: any, v2n1: any, v2n2: any, analyticKey?: any);
      _setVoiceNote(value: note.Note, which: string): void;
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

}
declare module 'music21j/music21/webmidi' {
  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/webmidi -- webmidi or wrapper around the Jazz Plugin
   *
   * For non webmidi --  Uses the cross-platform, cross-browser plugin from
   * http://jazz-soft.net/doc/Jazz-Plugin/Plugin.html
   * P.S. by the standards of divinity of most major religions, Sema Kachalo is a god.
   *
   * Copyright (c) 2014-18, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–18, Michael Scott Cuthbert and cuthbertLab
   *
   */
  /**
   * webmidi -- for connecting with external midi devices
   *
   * Uses either the webmidi API or the Jazz plugin
   * See {@link music21.webmidi}
   *
   * @namespace music21.webmidi
   * @memberof music21
   * @requires music21/miditools
   * @requires jQuery
   * @exports music21/webmidi
   * @example smallest usage of the webmidi toolkit.  see testHTML/midiInRequire.html

  <html>
  <head>
      <title>MIDI In/Jazz Test for Music21j</title>
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  </head>
  <body>
  <div>
  MIDI Input: <div id="putMidiSelectHere" />
  </div>
  <div id="svgDiv">
  </div>
  <script src='music21j.js'></script>
  <script>
      s = new music21.stream.Stream();
      music21.webmidi.createSelector($("#putMidiSelectHere"));

      function displayStream(midiEvent) {
          midiEvent.sendToMIDIjs();
          if (midiEvent.noteOn) {
              var m21n = midiEvent.music21Note();
              if (s.length > 7) {
                  s.elements = s.elements.slice(1)
              }
              s.append(m21n);
              var $svgDiv = $("#svgDiv");
              $svgDiv.empty();
              var svgDiv = s.appendNewDOM($svgDiv);
          }
      }
      music21.miditools.callbacks.general = displayStream;

  </script>
  </body>
  </html>
   */
  /**
   * @typedef {Object} Jazz
   * @extends HTMLObjectElement
   * @property {boolean} isJazz
   * @property {function} MidiInOpen
   * @property {function} MidiInClose
   * @property {function} MidiInList
   *
   */
  /**
   *
   * @type {
   *     {
   *     selectedInputPort: *,
   *     access: *,
   *     jazzDownloadUrl: string,
   *     selectedOutputPort: *,
   *     storedPlugin: *,
   *     selectedJazzInterface: *,
   *     $select: jQuery|undefined
   *     }
   * }
   */
  export const webmidi: {
      selectedOutputPort: any;
      selectedInputPort: any;
      access: any;
      $select: any;
      jazzDownloadUrl: string;
      storedPlugin: any;
      selectedJazzInterface: any;
  };
  /**
   * Called by Jazz MIDI plugin when an event arrives.
   *
   * Shim to convert the data into WebMIDI API format and then call the WebMIDI API midiInArrived
   *
   * See the MIDI spec for information on parameters
   *
   * @memberof music21.webmidi
   * @param {byte} t - timing information
   * @param {byte} a - data 1
   * @param {byte} b - data 2
   * @param {byte} c - data 3
   */
  export function jazzMidiInArrived(t: any, a: any, b: any, c: any): any;
  /**
   * Called directly when a MIDI event arrives from the WebMIDI API, or via a Shim (jazzMidiInArrived)
   * when MIDI information comes from JazzMIDI
   *
   * Calls the 'raw' and 'general callbacks when a raw midi event (four bytes)
   * arrives.
   *
   * See the MIDI spec for information on the contents of the three parameters.
   *
   * midiMessageEvent should be an object with two keys: timeStamp (int) and data (array of three int values)
   *
   * @memberof music21.webmidi
   * @param {Object} midiMessageEvent - midi Information
   */
  export function midiInArrived(midiMessageEvent: any): any;
  /**
   * Create a hidden tiny, &lt;object&gt; tag in the DOM with the
   * proper classid (`CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90`) to
   * load the Jazz plugin.
   *
   * It will return the plugin if it can or undefined if it cannot. Caches it in webmidi.storedPlugin.
   *
   * @function music21.webmidi.createPlugin
   * @param {HTMLElement} [appendElement=document.body] - where to place this hidden object (does not really matter)
   * @param {Boolean} [override=false] - if this method has been called
   *     successfully before return the storedPlugin unless override is true.
   * @returns {Jazz|undefined} Jazz MIDI plugin object
   */
  export function createPlugin(appendElement?: HTMLElement, override?: boolean): any;
  /**
   * Creates a &lt;select&gt; object for selecting among the MIDI choices in Jazz
   *
   * @function music21.webmidi.createJazzSelector
   * @param {jQuery|HTMLElement} [$newSelect=document.body] - object to append the select to
   * @param {Object} [options] - see createSelector for details
   * @returns {HTMLElement|undefined} DOM object containing the select tag, or undefined if Jazz cannot be loaded.
   */
  export function createJazzSelector($newSelect: any, options?: {}): any;
  /**
   * Function to be called if the webmidi-api selection changes. (not jazz)
   *
   */
  export function selectionChanged(): boolean;
  /**
   * Creates a &lt;select&gt; object for selecting among the MIDI choices in Jazz
   *
   * The options object has several parameters:
   *
   *
   * @function music21.webmidi.createSelector
   * @param {jQuery|HTMLElement} [midiSelectDiv=$('body')] - object to append the select to
   * @param {Object} [options] - see above.
   * @param {boolean} options.autoupdate -- should this auto update?
   * @param {function} options.onsuccess -- function to call on all successful port queries
   * @param {function} options.oninputsuccess -- function to call if successful and at least one input device is found
   * @param {function} options.oninputempty -- function to call if successful but no input devices are found.
   * @param {boolean} options.existingMidiSelect -- is there already a select tag for MIDI?
   * @returns {jQuery|undefined} DOM object containing the select tag, or undefined if Jazz cannot be loaded.
   */
  export function createSelector(midiSelectDiv: any, options: any): any;
  export function populateSelect(): void;

}
declare module 'music21j' {
  import main = require('src/music21');
  export = main;
}
