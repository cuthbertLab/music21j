import { Stave as VFStave } from 'vexflow';
import { Music21Exception } from './exceptions21';
import * as base from './base';
import * as clef from './clef';
import { Duration } from './duration';
import * as instrument from './instrument';
import * as meter from './meter';
import * as note from './note';
import * as pitch from './pitch';
import * as renderOptions from './renderOptions';
import * as tempo from './tempo';
import * as vfShow from './vfShow';
import * as filters from './stream/filters';
import * as iterator from './stream/iterator';
import * as makeNotation from './stream/makeNotation';
import type { KeySignature } from './key';
export { filters };
export { iterator };
export { makeNotation };
export declare class StreamException extends Music21Exception {
}
export interface PlayStreamParams {
    instrument?: instrument.Instrument;
    tempo?: number;
    done?: () => any;
    startNote?: number;
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
 * @property {RenderOptions} renderOptions - an object
 *     specifying how to render the stream
 * @property {Stream} flat - (readonly) a flattened representation of the Stream
 * @property {StreamIterator} notes - (readonly) the stream with
 *     only note.NotRest (music21.note.Note and music21.chord.Chord) objects included
 * @property {StreamIterator} notesAndRests - (readonly) like notes but
 *     also with music21.note.Rest objects included
 * @property {StreamIterator} parts - (readonly) a filter on the Stream
 *     to just get the parts (NON-recursive)
 * @property {StreamIterator} measures - (readonly) a filter on the
 *     Stream to just get the measures (NON-recursive)
 * @property {number} tempo - tempo in beats per minute (will become more
 *     sophisticated later, but for now the whole stream has one tempo
 * @property {boolean} autoBeam - whether the notes should be beamed automatically
 *    or not (will be moved to `renderOptions` soon)
 * @property {int} [staffLines=5] - number of staff lines
 * @property {function|undefined} changedCallbackFunction - function to
 *     call when the Stream changes through a standard interface
 * @property {number} maxSystemWidth - confusing... should be in renderOptions
 */
export declare class Stream<ElementType extends base.Music21Object = base.Music21Object> extends base.Music21Object {
    static get className(): string;
    _offsetDict: WeakMap<base.Music21Object, number>;
    _svgEventMap: WeakMap<HTMLElement, Record<keyof HTMLElementEventMap, Array<(e: any) => any>>>;
    _elements: base.Music21Object[];
    isSorted: boolean;
    isStream: boolean;
    isMeasure: boolean;
    classSortOrder: number;
    recursionType: string;
    autoSort: boolean;
    isFlat: boolean;
    /**
     * the current Stave object for the Stream
     */
    activeVFStave: VFStave;
    /**
     * the current vfShow.Renderer object for the Stream
     */
    activeVFRenderer: vfShow.Renderer;
    changedCallbackFunction: Function;
    /**
     * A function bound to the current stream that
     * will change the stream. Used in editableAccidentalDOM, among other places.
     *
     *      var can = s.appendNewDOM();
     *      can.addEventListener('click', () => s.DOMChangerFunction());
     */
    DOMChangerFunction: (e: MouseEvent | TouchEvent) => base.Music21Object | undefined;
    storedVexflowStave: VFStave;
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
     *  Iterator for use in `for (const x of new Stream())` contexts.
     */
    [Symbol.iterator](): IterableIterator<base.Music21Object>;
    forEach(callback: (el: base.Music21Object, i: number, innerThis: any) => void, thisArg?: any): void;
    get duration(): Duration;
    set duration(newDuration: Duration);
    get highestTime(): number;
    get semiFlat(): this;
    get flat(): this;
    /**
     * Returns a new Stream with all nested elements inserted at their offset from
     * the top level Stream.
     *
     * @param retainContainers - if true, retain the containers (e.g., Measure, Part, etc.)
     */
    flatten(retainContainers?: boolean): this;
    get notes(): iterator.StreamIterator<note.NotRest>;
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
     * The instrument object (NOT stored in the stream!) -- this is a difference from
     * music21p and expect this to change soon.
     */
    get instrument(): instrument.Instrument;
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
     */
    get elements(): base.Music21Object[];
    set elements(newElements: base.Music21Object[] | Stream);
    /**
     * getSpecialContext is a transitional replacement for
     * .clef, .keySignature, .timeSignature that looks
     * for context to get the appropriate element as ._clef, etc.
     * as a way of making the older music21j attributes still work while
     * transitioning to a more music21p-like approach.
     *
     * May be removed.
     */
    getSpecialContext(context: string, warnOnCall?: boolean): any;
    /**
     * Map as if this were an Array
     */
    map(func: (el: ElementType) => any): any[];
    filter(func: (el: ElementType) => boolean): ElementType[];
    clear(): void;
    coreElementsChanged({ updateIsFlat, clearIsSorted, }?: {
        updateIsFlat?: boolean;
        clearIsSorted?: boolean;
    }): void;
    recurse({ streamsOnly, restoreActiveSites, classFilter, skipSelf, }?: {
        streamsOnly?: boolean;
        restoreActiveSites?: boolean;
        classFilter?: any;
        skipSelf?: boolean;
    }): iterator.RecursiveIterator;
    /**
     * Add an element (or a list of elements) to the end of the stream,
     * setting each element's `.offset` accordingly
     */
    append(elOrElList: ElementType | ElementType[]): this;
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
    Given an object and a number, run append that many times on
    a clone of the object.
    numberOfTimes should of course be a positive integer.

    a = stream.Stream()
    n = note.Note('D--')
    n.duration.type = 'whole'
    a.repeatAppend(n, 10)
    */
    repeatAppend(item: ElementType, numberOfTimes: number): void;
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
     * music21p format of s[index] using __getitem__.  Can use negative indexing
     * to get from the end.
     *
     * for the recursing by class method of `__getitem__` see `rc` below.
     *
     * index - can be -1, -2, to index from the end, like python
     */
    get(index: number): base.Music21Object;
    /**
     * Return a RecursiveIterator by class for a stream.  Equivalent to the
     * music21p format of s[note.Note] using __getitem__.  (rc = recurse by class)
     *
     * for the get-by-index form of music21p's `__getitem__` see `get()`.
     *
     * See also `rcf(Class)` which returns the first item by class.  For
     * quickly working.
     */
    rc<TT extends base.Music21Object = base.Music21Object>(klass: (new () => TT)): iterator.RecursiveIterator<TT>;
    /**
     * A pure convenience method for `s.recurse().getElementsByClass(klass).first()`
     *
     * Requires a Class (type), does not take a string.
     */
    rcf<TT extends base.Music21Object = base.Music21Object>(klass: (new () => TT)): TT;
    /**
     * Added for compatability with StreamIterator.  Gets the first element
     * or undefined if none.  No speedups from `.get(0)`, but makes coding
     * in a mix of Stream and StreamIterator environments easier.
     */
    first(): base.Music21Object;
    /**
     * Added for compatability with StreamIterator.  Gets the last element
     * or undefined if none.  No speedups from `.get(-1)`, but makes coding
     * in a mix of Stream and StreamIterator environments easier.
     */
    last(): base.Music21Object;
    /**
     *
     */
    set(index: number, newEl: base.Music21Object): this;
    setElementOffset(el: base.Music21Object, value: number, addElement?: boolean): void;
    elementOffset(element: base.Music21Object, _stringReturns?: boolean): number;
    /**
     * Takes a stream and places all of its elements into
     * measures (:class:`~music21.stream.Measure` objects)
     * based on the :class:`~music21.meter.TimeSignature` objects
     * placed within
     * the stream. If no TimeSignatures are found in the
     * stream, a default of 4/4 is used.

     * If `options.inPlace` is true, the original Stream is modified and lost
     * if `options.inPlace` is False, this returns a modified deep copy.
     */
    makeMeasures(options?: any): Stream;
    containerInHierarchy(el: base.Music21Object, { setActiveSite }?: {
        setActiveSite?: boolean;
    }): Stream | undefined;
    /**
     * chordify does not yet work...
     */
    chordify({ addTies, addPartIdAsGroup, removeRedundantPitches, toSoundingPitch, }?: {
        addTies?: boolean;
        addPartIdAsGroup?: boolean;
        removeRedundantPitches?: boolean;
        toSoundingPitch?: boolean;
    }): Stream<base.Music21Object>;
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
    makeNotation({ inPlace, overrideStatus }?: {
        inPlace?: boolean;
        overrideStatus?: boolean;
    }): this;
    /**
     * Return a new Stream or modify this stream
     * to have beams.
     *
     * Called from renderVexflow()
     */
    makeBeams({ inPlace, setStemDirections, failOnNoTimeSignature, }?: makeNotation.MakeBeamsOptions): this;
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
     */
    getElementsByClass<TT extends base.Music21Object = base.Music21Object>(classList: new () => TT): iterator.StreamIterator<TT>;
    getElementsByClass<TT extends base.Music21Object = base.Music21Object>(classList: string): iterator.StreamIterator<TT>;
    getElementsByClass<TT extends base.Music21Object = base.Music21Object>(classList: string[]): iterator.StreamIterator<TT>;
    getElementsByClass<TT extends base.Music21Object = base.Music21Object>(classList: (new () => base.Music21Object)[]): iterator.StreamIterator<TT>;
    /**
     * Find all elements NOT with a certain class; if an Array is given, then any
     * matching class will work.
     */
    getElementsNotOfClass(classList: string | string[]): iterator.StreamIterator;
    /**
     * Returns a new StreamIterator
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
    }): iterator.StreamIterator;
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
     *  elStream is a place to get el's offset from.  Otherwise, activeSite is used
     */
    playingWhenAttacked(el: base.Music21Object, elStream?: Stream): base.Music21Object | undefined;
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

        If `overrideStatus` is true, this method will ignore any current `displayStatus` setting
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

        Called automatically before appendDOM routines are called.
     */
    makeAccidentals({ pitchPast, pitchPastMeasure, useKeySignature, alteredPitches, cautionaryPitchClass, cautionaryAll, inPlace, overrideStatus, cautionaryNotImmediateRepeat, tiePitchSet, }?: MakeAccidentalsParams): this;
    /**
     * Sets the render options for any substreams (such as placing them
     * in systems, etc.) DOES NOTHING for music21.stream.Stream, but is
     * overridden in subclasses.
     *
     * @returns {this}
     */
    setSubstreamRenderOptions(): this;
    /**
     * Resets all the RenderOptions back to default values. Can run recursively
     * and can also preserve the `RenderOptions.events` object.
     *
     * @param {boolean} [recursive=false]
     * @param {boolean} [preserveEvents=false]
     * @returns {this}
     */
    resetRenderOptions(recursive?: boolean, preserveEvents?: boolean): this;
    write(_format?: string): string;
    /**
     * Uses music21.vfShow.Renderer to render Vexflow onto an
     * existing canvas or SVG object.
     *
     * Runs `this.setRenderInteraction` on the canvas.
     *
     * Will be moved to vfShow eventually when converter objects are enabled...maybe.
     *
     * Takes in a canvas or the div surrounding an SVG object
     */
    renderVexflow(where?: HTMLDivElement | HTMLCanvasElement): vfShow.Renderer;
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
    estimateStaffLength(): number;
    stripTies({ inPlace, matchByPitch, }?: {
        inPlace?: boolean;
        matchByPitch?: boolean;
    }): this;
    /**
     * Returns either (1) a Stream containing Elements
     * (that wrap the null object) whose offsets and durations
     * are the length of gaps in the Stream
     * or (2) null if there are no gaps.
     * @returns {object}
     */
    findGaps(): Stream | null;
    /**
     * Returns True if there are no gaps between the lowest offset and the highest time.
     * Otherwise returns False
     */
    get isGapless(): boolean;
    /**
     * Plays the Stream through the MIDI/sound playback (for now, only MIDI.js is supported)
     *
     * `options` can be an object containing:
     * - instrument: {@link `music`21.instrument.Instrument} object (default, `this.instrument`)
     * - tempo: number (default, `this.tempo`)
     */
    playStream(options?: PlayStreamParams): this;
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
     * returns an HTMLDivElement encompassing either the SVG or Canvas element.
     *
     * if width is undefined, will use `this.estimateStaffLength()`
     *     + `this.renderOptions.staffPadding`
     *
     * if height is undefined  will use
     *     `this.renderOptions.height`. If still undefined, will use
     *     `this.estimateStreamHeight()`
     */
    createNewDOM(width?: number | string, height?: number | string, elementType?: string): HTMLDivElement | HTMLCanvasElement;
    /**
     * Creates a rendered, playable svg where clicking plays it.
     *
     * Called from appendNewDOM() etc.
     *
     */
    createPlayableDOM(width?: number | string | undefined, height?: number | string | undefined, elementType?: string): HTMLDivElement | HTMLCanvasElement;
    /**
     * Creates a new svg and renders vexflow on it
     *
     * @param {number|string|undefined} [width]
     * @param {number|string|undefined} [height]
     * @param {string} elementType - what type of element svg or canvas, default = svg
     * @returns {HTMLDivElement|HTMLCanvasElement} Div containing SVG or the Canvas element
     */
    createDOM(width?: number | string | undefined, height?: number | string | undefined, elementType?: string): HTMLDivElement | HTMLCanvasElement;
    /**
     * Creates a new canvas, renders vexflow on it, and appends it to the DOM.
     *
     * @param {HTMLElement} [where=document.body] - where to place the svg
     * @param {number|string} [width]
     * @param {number|string} [height]
     * @param {string} elementType - what type of element, default = svg
     * @returns {HTMLDivElement|HTMLCanvasElement} svg or canvas
     *
     */
    appendNewDOM(where?: HTMLElement | string, width?: number | string, height?: number | string, elementType?: string): HTMLDivElement | HTMLCanvasElement;
    /**
     * Replaces a particular Svg with a new rendering of one.
     *
     * Note that if 'where' is empty, will replace all svg elements on the page.
     *
     * @param {HTMLElement} [where] - the canvas or SVG to replace or
     *     a container holding the canvas(es) to replace.
     * @param {boolean} [preserveSvgSize=false]
     * @param {string} elementType - what type of element, default = svg
     * @returns {HTMLDivElement} the svg
     */
    replaceDOM(where?: HTMLElement, preserveSvgSize?: boolean, elementType?: string): HTMLElement;
    /**
     * Set the type of interaction on the svg based on
     *    - Stream.renderOptions.events.click
     *    - Stream.renderOptions.events.dblclick
     *    - Stream.renderOptions.events.resize
     *
     * Currently, the only options available for each are:
     *    - 'play' (string)
     *    - 'reflow' (string; only on event.resize)
     *    - customFunction (will receive event as a first variable; should set up a way to
     *                    find the original stream; var s = this; var f = function () { s...}
     */
    setRenderInteraction(where: HTMLDivElement | HTMLCanvasElement): this;
    /**
     *
     * Recursively search downward for the closest storedVexflowStave...
     */
    recursiveGetStoredVexflowStave(): VFStave | undefined;
    /**
     * Given a mouse click, or other event with .pageX and .pageY,
     * find the x and y for the svg.
     *
     * returns {Array<number>} two-elements, [x, y] in pixels.
     */
    getUnscaledXYforDOM(svg: HTMLElement, e: MouseEvent | TouchEvent): [number, number];
    /**
     * return a list of [scaledX, scaledY] for
     * a svg element.
     *
     * xScaled refers to 1/scaleFactor.x -- for instance, scaleFactor.x = 0.7 (default)
     * x of 1 gives 1.42857...
     *
     */
    getScaledXYforDOM(svg: HTMLElement, e: MouseEvent | TouchEvent): [number, number];
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
     */
    getStreamFromScaledXandSystemIndex(_xPxScaled: number, _systemIndex?: number): Stream;
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
     */
    noteElementFromScaledX(xPxScaled: number, allowablePixels?: number, systemIndex?: number, options?: {}): note.GeneralNote;
    /**
     * Given an event object, and an x and y location, returns a two-element array
     * of the pitch.Pitch.diatonicNoteNum that was clicked (i.e., if C4 was clicked this
     * will return 29; if D4 was clicked this will return 30) and the closest note in the
     * stream that was clicked.
     *
     * Return a list of [diatonicNoteNum, closestXNote]
     * for an event (e) called on the svg (svg)
     */
    findNoteForClick(svg?: HTMLDivElement | HTMLCanvasElement, e?: MouseEvent | TouchEvent, x?: number, y?: number): [number, note.GeneralNote];
    /**
     * Change the pitch of a note given that it has been clicked and then
     * call changedCallbackFunction and return it
     */
    noteChanged(clickedDiatonicNoteNum: number, foundNote: note.Note, svg: HTMLDivElement | HTMLCanvasElement): any;
    /**
     * Redraws an svgDiv, keeping the events of the previous svg.
     */
    redrawDOM(svg: HTMLDivElement | HTMLCanvasElement): HTMLDivElement | HTMLCanvasElement;
    /**
     * Renders a stream on svg with the ability to edit it and
     * a toolbar that allows the accidentals to be edited.
     */
    editableAccidentalDOM(width?: number, height?: number, { minAccidental, maxAccidental, }?: {
        minAccidental?: number;
        maxAccidental?: number;
    }): HTMLDivElement;
    /**
     * Returns an accidental toolbar from minAccidental to maxAccidental.
     *
     * If siblingSvg is defined then this toolbar alters the notes in that
     * toolbar.
     */
    getAccidentalToolbar(minAccidental?: number, maxAccidental?: number, siblingSvg?: HTMLDivElement | HTMLCanvasElement): HTMLDivElement;
    /**
     * get a Div element containing two buttons -- play and stop
     */
    getPlayToolbar(): HTMLDivElement;
    /**
     * Begins a series of bound events to the window that makes it
     * so that on resizing the stream is redrawn and reflowed to the
     * new size.
     *bt
     */
    windowReflowStart(svg: HTMLDivElement | HTMLCanvasElement): this;
    /**
     * Does this stream have a {@link Voice} inside it?
     */
    hasVoices(): boolean;
}
export declare class Voice extends Stream {
    static get className(): string;
    constructor();
}
export declare class Measure extends Stream {
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
 */
export declare class Part extends Stream {
    static get className(): string;
    recursionType: string;
    _partName: string;
    _partAbbreviation: string;
    /**
     * The name of this part; if undefined, look up on the stored instrument.
     */
    get partName(): string;
    set partName(name: string);
    /**
     * The abbreviated name of this part; if undefined, look up on the stored instrument.
     */
    get partAbbreviation(): string;
    set partAbbreviation(name: string);
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
    /**
     * Calculate system breaks and update measure widths as necessary on
     * account of the reiteration of clefs and key signatures on subsequent systems.
     */
    systemWidthsAndBreaks({ setMeasureWidths }?: {
        setMeasureWidths?: boolean;
    }): [number[], number[]];
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
     * returns an array of all the widths of complete systems
     * (last partial system omitted)
     */
    fixSystemInformation({ systemHeight, systemPadding, }?: {
        systemHeight?: number;
        systemPadding?: number;
    }): number[];
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
     */
    systemIndexAndScaledY(y: number): [number, number];
    /**
     * Overrides the default music21.stream.Stream#findNoteForClick
     * by taking into account systems
     *
     * returns a two element array of [clickedDiatonicNoteNum, foundNote]
     */
    findNoteForClick(svg?: HTMLElement, e?: MouseEvent | TouchEvent, x?: number, y?: number): [number, note.GeneralNote];
    /**
     * Returns the measure that is at X location xPxScaled and system systemIndex.
     */
    getStreamFromScaledXandSystemIndex(xPxScaled: number, systemIndex?: number): Measure;
}
/**
 * Scores with multiple parts
 */
export declare class Score extends Stream {
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
    getStreamFromScaledXandSystemIndex(xPxScaled: number, systemIndex?: number): Measure;
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
    playStream(params?: PlayStreamParams): this;
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
    systemIndexAndScaledY(y: number): number[];
    /**
     * Score object
     *
     * Returns a list of [clickedDiatonicNoteNum, foundNote] for a
     * click or other mouse event, taking into account that the note will be in different
     * Part objects (and different Systems) given the height and possibly different Systems.
     *
     * returns [diatonicNoteNum, m21Element]
     */
    findNoteForClick(svg?: HTMLElement, e?: MouseEvent | TouchEvent, x?: number, y?: number): [number, note.GeneralNote];
    /**
     * How many systems are there? Calls numSystems() on the first part.
     */
    numSystems(): number;
    /**
     * Makes the width of every Measure object within a measure stack be the same.
     * if setLeft is true then also set the renderOptions.left
     *
     * This does not even out systems.
     */
    evenPartMeasureSpacing({ setLeft }?: {
        setLeft?: boolean;
    }): this;
}
export declare class PartStaff extends Part {
}
export declare class OffsetMap {
    element: base.Music21Object;
    offset: number;
    endTime: number;
    voiceIndex: number;
    constructor(element: base.Music21Object, offset: number, endTime: number, voiceIndex: number);
}
//# sourceMappingURL=stream.d.ts.map