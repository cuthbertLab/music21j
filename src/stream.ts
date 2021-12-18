/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/stream -- Streams -- objects that hold other Music21Objects
 *
 * Does not implement the full features of music21p Streams by a long shot...
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * powerful stream module, See music21.stream namespace
 *
 * Streams are powerful music21 objects that hold Music21Object collections,
 * such as music21.note.Note or music21.chord.Chord objects.
 *
 * Understanding the {@link Stream} object is of fundamental
 * importance for using music21.  Definitely read the music21(python) tutorial
 * on using Streams before proceeding
 *
 */

import * as $ from 'jquery';
import * as MIDI from 'midicube';
import Vex from 'vexflow';

import { Music21Exception } from './exceptions21';
import { debug } from './debug';

import * as base from './base';
import * as clef from './clef';
import * as common from './common';
import { Duration } from './duration';
import * as instrument from './instrument';
import * as meter from './meter';
import * as note from './note';
import * as pitch from './pitch';
import * as renderOptions from './renderOptions';
import { svg_accidentals } from './svgs';
import * as tempo from './tempo';
import * as vfShow from './vfShow';

// eslint-disable-next-line import/no-cycle
import { GeneralObjectExporter } from './musicxml/m21ToXml';

import * as filters from './stream/filters';
import * as iterator from './stream/iterator';
import * as makeNotation from './stream/makeNotation';

// for typing only
import type { Chord } from './chord';
import type { KeySignature } from './key';

export { filters };
export { iterator };
export { makeNotation };

export class StreamException extends Music21Exception {}

declare interface Constructable<T> {
    new() : T;
}


function _exportMusicXMLAsText(s) {
    const gox = new GeneralObjectExporter(s);
    return gox.parse();
}

interface MakeAccidentalsParams {
    pitchPast?: pitch.Pitch[],
    pitchPastMeasure?: pitch.Pitch[],
    useKeySignature?: boolean | KeySignature,
    alteredPitches?: pitch.Pitch[],
    searchKeySignatureByContext?: boolean,
    cautionaryPitchClass?: boolean,
    cautionaryAll?: boolean,
    inPlace?: boolean,
    overrideStatus?: boolean,
    cautionaryNotImmediateRepeat?: boolean,
    tiePitchSet?: Set<string>,
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
export class Stream extends base.Music21Object {
    static get className() { return 'music21.stream.Stream'; }

    // from music21p's core.py
    _offsetDict: WeakMap<base.Music21Object, number> = new WeakMap();
    _elements: base.Music21Object[] = [];
    // TODO(msc): endElements
    isSorted: boolean = true;

    // from music21p's __init__.py
    // class attributes.
    isStream: boolean = true;
    isMeasure: boolean = false;
    classSortOrder: number = -20;
    recursionType: string = 'elementsFirst';  // this may change to an enum
    // TODO(msc): _styleClass

    // individual instance attributes
    // TODO(msc): StreamStatus
    // TODO(msc): _unlinkedDuration
    autoSort: boolean = true;
    isFlat: boolean = true;
    // TODO(msc): definesExplicitSystemBreaks
    // TODO(msc): definesExplicitPageBreaks
    // TODO(msc): _atSoundingPitch
    // TODO(msc): _mutable -- experimental

    // music21j specific attributes NOT to remove:

    /**
     * the current Stave object for the Stream
     */
    activeVFStave: Vex.Flow.Stave = undefined;

    /**
     * the current vfShow.Renderer object for the Stream
     */
    activeVFRenderer: vfShow.Renderer = undefined;
    changedCallbackFunction: Function = undefined; // for editable svg objects

    /**
     * A function bound to the current stream that
     * will change the stream. Used in editableAccidentalDOM, among other places.
     *
     *      var can = s.appendNewDOM();
     *      $(can).on('click', s.DOMChangerFunction);
     */
    DOMChangerFunction:
        (e: MouseEvent|TouchEvent|JQuery.MouseEventBase) => base.Music21Object|undefined;

    // music21j specific attributes eventually to remove:
    storedVexflowStave: Vex.Flow.Stave = undefined;  // cannot figure out diff w/ activeVFStave

    activeNote: note.GeneralNote = undefined;
    _clef = undefined;
    displayClef = undefined;
    _keySignature = undefined; // a music21.key.KeySignature object
    _timeSignature = undefined; // a music21.meter.TimeSignature object
    _instrument = undefined;
    _autoBeam: boolean = undefined;
    renderOptions: renderOptions.RenderOptions = new renderOptions.RenderOptions();
    _tempo = undefined;
    staffLines: number = 5;
    _stopPlaying = false;
    _overriddenDuration: Duration = undefined;


    constructor() {
        super();
        this._cloneCallbacks.activeVexflowNote = false;
        this._cloneCallbacks.storedVexflowStave = false;
        this._cloneCallbacks._offsetDict = false;
        this._cloneCallbacks.renderOptions = function cloneRenderOptions(
            keyName,
            newObj,
            self: Stream,
            deep: boolean,
            memo
        ) {
            if (!deep) {
                newObj.renderOptions = self.renderOptions;
            } else {
                newObj.renderOptions = self.renderOptions.deepClone();
            }
        };

        this._cloneCallbacks._elements = function cloneElements(
            keyName,
            newObj,
            self,
            deep,
            memo,
        ) {
            if (!deep) {
                newObj.elements = self;
                return;
            }
            newObj.clear();
            for (let j = 0; j < self._elements.length; j++) {
                const el = self._elements[j];
                const elOffset = self.elementOffset(el);
                // console.log('cloning el: ', el.name);
                const elCopy = el.clone(true, memo);
                // there may be more efficient ways to do this,
                // but for now, safety trumps efficiency.
                newObj.insert(
                    elOffset,
                    elCopy,
                    {
                        ignoreSort: true,
                    }
                );
            }
            // isSorted will be cloned elsewhere.
        };

        this.DOMChangerFunction = (e: MouseEvent|TouchEvent|JQuery.MouseEventBase) => {
            const canvasOrSVGElement = e.currentTarget;
            if (!(canvasOrSVGElement instanceof HTMLElement)
                && !(canvasOrSVGElement instanceof SVGElement)) {
                return undefined;
            }

            const [clickedDiatonicNoteNum, foundNote] = this.findNoteForClick(
                canvasOrSVGElement,
                e
            );
            if (foundNote === undefined) {
                if (debug) {
                    console.log('No note found');
                }
                return undefined;
            }
            return this.noteChanged(
                clickedDiatonicNoteNum,
                foundNote as note.Note,
                canvasOrSVGElement
            );
        };
        // return new Proxy(this, {
        //     get(target, n: PropertyKey) {
        //         let name: PropertyKey;
        //         name = parseInt(n.toString());  // need toString for Symbol.iterator
        //         if (Number.isNaN(name)) {
        //             name = n;
        //         }
        //         if (typeof name === 'number') {
        //             return target.get(name as number);
        //         } else {
        //             return target[name];
        //         }
        //     },
        //     set(target, n: PropertyKey, value) {
        //         let name: PropertyKey;
        //         name = parseInt(n.toString());  // need toString for Symbol.iterator
        //         if (Number.isNaN(name)) {
        //             name = n;
        //         }
        //         if (typeof name === 'number') {
        //             target.set(name, value);
        //         } else { // if (Object.prototype.hasOwnProperty.call(target, name)) {
        //             target[name] = value;
        //         }
        //         return true;
        //     },
        // });
    }

    /**
     *
     * @returns {IterableIterator<Music21Object>}
     */
    * [Symbol.iterator](): IterableIterator<base.Music21Object> {
        if (this.autoSort && !this.isSorted) {
            this.sort();
        }

        for (let i = 0; i < this.length; i++) {
            yield this.get(i);
        }
    }

    forEach(
        callback: (el: base.Music21Object, i: number, innerThis: any) => void,
        thisArg?: any
    ) {
        if (thisArg !== undefined) {
            callback = callback.bind(thisArg);
        }
        let i = 0;
        for (const el of this) {
            callback(el, i, this);
            i += 1;
        }
    }

    get duration(): Duration {
        if (this._overriddenDuration instanceof Duration) {
            // return new duration.Duration(32.0);
            return this._overriddenDuration;
        }
        return new Duration(this.highestTime);
    }

    set duration(newDuration: Duration) {
        this._overriddenDuration = newDuration;
    }

    get highestTime(): number {
        let highestTime = 0.0;
        for (const el of this) {
            let endTime = el.offset;
            if (el.duration !== undefined) {
                endTime += el.duration.quarterLength;
            }
            if (endTime > highestTime) {
                highestTime = endTime;
            }
        }
        return highestTime;
    }

    get semiFlat(): this {
        return this.flatten(true);
    }

    get flat(): this {
        return this.flatten(false);
    }

    flatten(retainContainers: boolean = false): this {
        const newSt = this.clone(false);
        // console.log('done cloning...');
        if (!this.isFlat) {
            // not the most efficient, but safety counts for a lot...
            // namely, do not set inner streams activeSites to be
            // in things that they won't have later.
            newSt.clear();
            const ri = new iterator.RecursiveIterator<base.Music21Object>(this, {
                restoreActiveSites: false,
                includeSelf: false,
                ignoreSorting: true,
            });
            for (const e of ri) {
                if (e.isStream && !retainContainers) {
                    continue;
                }
                newSt.insert(
                    ri.currentHierarchyOffset(),
                    e,
                    {
                        setActiveSite: false,
                        ignoreSort: true,
                    }
                );
            }
        }
        if (!retainContainers) {
            newSt.isFlat = true;
            newSt.coreElementsChanged({ updateIsFlat: false });
        } else {
            newSt.coreElementsChanged();
        }
        return newSt as this;
    }

    get notes(): iterator.StreamIterator<note.NotRest> {
        return this.getElementsByClass(['Note', 'Chord']) as
            iterator.StreamIterator<note.NotRest>;
    }

    get notesAndRests(): iterator.StreamIterator<note.GeneralNote> {
        return this.getElementsByClass('GeneralNote') as iterator.StreamIterator<note.GeneralNote>;
    }

    get tempo(): number {
        if (this._tempo === undefined && this.activeSite !== undefined) {
            return this.activeSite.tempo;
        } else if (this._tempo === undefined) {
            return 150;
        } else {
            return this._tempo;
        }
    }

    set tempo(newTempo: number) {
        this._tempo = newTempo;
    }

    /**
     * Return an array of the outer bounds of each MetronomeMark in the stream.
     * [offsetStart, offsetEnd, tempo.MetronomeMark]
     */
    _metronomeMarkBoundaries(): [number, number, tempo.MetronomeMark][] {
        const mmBoundaries: [number, number, tempo.MetronomeMark][] = [];
        const thisFlat = this.flat;
        const metronomeMarks = thisFlat.getElementsByClass('MetronomeMark');

        const highestTime = thisFlat.highestTime;
        const lowestOffset = 0;

        const mmDefault = new tempo.MetronomeMark({ number: 120 });

        if (!metronomeMarks.length) {
            mmBoundaries.push([lowestOffset, highestTime, mmDefault]);
        } else if (metronomeMarks.length === 1) {
            const metronomeMark = metronomeMarks.get(0) as tempo.MetronomeMark;
            const offset = metronomeMark.getOffsetBySite(thisFlat) as number;
            if (offset > lowestOffset) {
                mmBoundaries.push([lowestOffset, offset, mmDefault]);
                mmBoundaries.push([offset, highestTime, metronomeMark]);
            } else {
                mmBoundaries.push([lowestOffset, highestTime, metronomeMark]);
            }
        } else {
            const offsetPairs = [];
            for (let i = 0; i < metronomeMarks.length; i++) {
                const metronomeMark = metronomeMarks.get(i);
                offsetPairs.push([
                    metronomeMark.getOffsetBySite(thisFlat),
                    metronomeMark
                ]);
            }
            if (offsetPairs[0][0] > lowestOffset) {
                mmBoundaries.push([lowestOffset, offsetPairs[0][0], mmDefault]);
            }
            offsetPairs.forEach((offsetPair, i) => {
                if (i === offsetPairs.length - 1) {
                    mmBoundaries.push([offsetPair[0], highestTime, offsetPair[1]]);
                } else {
                    mmBoundaries.push([offsetPair[0], offsetPairs[i + 1][0], offsetPair[1]]);
                }
            });
        }
        return mmBoundaries;
    }

    /**
     * Return the average tempo within the span indicated by offset start and end.
     *
     * @param {number} oStart - offset start
     * @param {number} oEnd - offset end
     * @returns {number}
     */
    _averageTempo(oStart: number, oEnd: number): number {
        const overallDuration = oEnd - oStart;
        return this._metronomeMarkBoundaries().reduce((tempo, mm) => {
            if (mm[0] >= oStart && mm[0] < oEnd) {
                const overlapDur = mm[1] <= oEnd ? mm[1] - mm[0] : oEnd - mm[0];
                tempo += (overlapDur / overallDuration) * mm[2].number;
            } else if (mm[1] > oStart && mm[1] <= oEnd) {
                const overlapDur = mm[0] >= oStart ? mm[1] - mm[0] : mm[1] - oStart;
                tempo += (overlapDur / overallDuration) * mm[2].number;
            } else if (mm[0] <= oStart && mm[1] >= oEnd) {
                tempo = mm[2].number;
            }
            return tempo;
        }, 0);
    }


    /**
     * The instrument object (NOT stored in the stream!) -- this is a difference from
     * music21p and expect this to change soon.
     *
     * Note that .instrument will never return a string, but Typescript <= 4 requires
     * that getter and setter are the same.
     */
    get instrument(): instrument.Instrument|string {
        if (this._instrument === undefined && this.activeSite !== undefined) {
            return this.activeSite.instrument;
        } else {
            return this._instrument;
        }
    }

    set instrument(newInstrument: instrument.Instrument|string) {
        if (typeof newInstrument === 'string') {
            newInstrument = new instrument.Instrument(newInstrument);
        }
        this._instrument = newInstrument;
    }

    /**
     * specialContext gets from a private attribute or from zero-position
     * or from site's first or special context.
     *
     * @private
     */
    _specialContext(attr: string): any {
        const privAttr = '_' + attr;
        if (this[privAttr] !== undefined) {
            return this[privAttr];
        }
        // should be:
        // const contextClef = this.getContextByClass('Clef');
        //        const context = this.getContextByClass('Stream', { getElementMethod: 'getElementBefore' });
        //        let contextObj;
        //        if (context !== undefined && context !== this) {
        //            contextObj = context[privAttr];
        //        }
        for (const site of this.sites.yieldSites()) {
            if (site === undefined) {
                continue;
            }
            let contextObj = site._firstElementContext(attr);
            if (contextObj === undefined) {
                contextObj = site._specialContext(attr);
            }
            if (contextObj !== undefined) {
                return contextObj;
            }
        }
        return undefined;
    }

    /**
     * Get an attribute like 'keySignature' from an element with the
     * same class name (except 'KeySignature' instead of 'keySignature')
     * in the stream at position 0.
     *
     * @private
     */
    _firstElementContext(attr: string): base.Music21Object {
        const firstElements = this
            .getElementsByOffset(0.0)
            .getElementsByClass(attr.charAt(0).toUpperCase() + attr.slice(1));
        if (firstElements.length) {
            return firstElements.get(0);
        } else {
            return undefined;
        }
    }

    get clef(): clef.Clef {
        return this.getSpecialContext('clef', false) as clef.Clef;
    }

    set clef(newClef: clef.Clef) {
        const oldClef = this._firstElementContext('clef');
        if (oldClef !== undefined) {
            this.replace(oldClef, newClef);
        } else {
            this.insert(0.0, newClef);
        }
        this._clef = newClef;
    }

    get keySignature(): KeySignature {
        return this.getSpecialContext('keySignature', false);
    }

    set keySignature(newKeySignature: KeySignature) {
        const oldKS = this._firstElementContext('keySignature');
        if (oldKS !== undefined) {
            this.replace(oldKS, newKeySignature);
        } else {
            this.insert(0.0, newKeySignature);
        }
        this._keySignature = newKeySignature;
    }

    get timeSignature(): meter.TimeSignature {
        return this.getSpecialContext('timeSignature', false);
    }

    set timeSignature(newTimeSignature: meter.TimeSignature) {
        if (typeof newTimeSignature === 'string') {
            newTimeSignature = new meter.TimeSignature(newTimeSignature);
        }
        const oldTS = this._firstElementContext('timeSignature');
        if (oldTS !== undefined) {
            this.replace(oldTS, newTimeSignature);
        } else {
            this.insert(0.0, newTimeSignature);
        }
        this._timeSignature = newTimeSignature;
    }

    get autoBeam() {
        return this._specialContext('autoBeam');
    }

    set autoBeam(ab) {
        this._autoBeam = ab;
    }


    /**
     * maxSystemWidth starts at 750.  It can then be changed
     * by renderOptions.maxSystemWidth, by activeSite's maxSystemWidth
     * (recursively); and then is scaled by renderOptions.scaleFactor.x
     *
     * Smaller scaleFactors lead to LARGER maxSystemWidth
     */
    get maxSystemWidth() {
        let baseMaxSystemWidth = 750;
        if (this.renderOptions.maxSystemWidth === undefined
               && this.activeSite !== undefined) {
            baseMaxSystemWidth = this.activeSite.maxSystemWidth;
        } else if (this.renderOptions.maxSystemWidth !== undefined) {
            baseMaxSystemWidth = this.renderOptions.maxSystemWidth;
        }
        return baseMaxSystemWidth / this.renderOptions.scaleFactor.x;
    }


    /**
     * Sets the renderOptions.maxSystemWidth after accounting for
     * scaleFactor
     */
    set maxSystemWidth(newSW) {
        this.renderOptions.maxSystemWidth
            = newSW * this.renderOptions.scaleFactor.x;
    }

    get parts(): iterator.StreamIterator<Part> {
        return this.getElementsByClass('Part') as iterator.StreamIterator<Part>;
    }

    // TODO -- replace w/ music21p version.
    get measures(): iterator.StreamIterator<Measure> {
        return this.getElementsByClass('Measure') as iterator.StreamIterator<Measure>;
    }

    get voices(): iterator.StreamIterator<Voice> {
        return this.getElementsByClass('Voice') as iterator.StreamIterator<Voice>;
    }

    get length(): number {
        return this._elements.length;
    }

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
    get elements(): base.Music21Object[]|Stream {
        if (!this.isSorted) {
            this.sort();
        }
        return this._elements;
    }

    set elements(newElements: base.Music21Object[]|Stream) {
        let highestOffsetSoFar = 0.0;
        this.clear();
        const tempInsert = [];
        let i;
        let thisEl;
        if (newElements instanceof Stream) {
            // iterate to set active site;
            for (const unused of newElements) {} // eslint-disable-line no-empty
            newElements = newElements.elements;
        }

        for (i = 0; i < newElements.length; i++) {
            thisEl = newElements[i];
            const thisElOffset = thisEl.offset;
            if (thisElOffset === undefined || thisElOffset === highestOffsetSoFar) {
                // append
                this._elements.push(thisEl);
                this.setElementOffset(thisEl, highestOffsetSoFar);
                thisEl.sites.add(this);
                if (thisEl.duration === undefined) {
                    console.error('No duration for ', thisEl, ' in ', this);
                }
                highestOffsetSoFar += thisEl.duration.quarterLength;
            } else {
                // append -- slow
                tempInsert.push(thisEl);
            }
        }
        // console.warn('end', highestOffsetSoFar, tempInsert);
        for (i = 0; i < tempInsert.length; i++) {
            thisEl = tempInsert[i];
            this.insert(thisEl.offset, thisEl);
        }
        this.coreElementsChanged(); // would be called already if newElements != [];
    }

    /**
     * getSpecialContext is a transitional replacement for
     * .clef, .keySignature, .timeSignature that looks
     * for context to get the appropriate element as ._clef, etc.
     * as a way of making the older music21j attributes still work while
     * transitioning to a more music21p-like approach.
     *
     * May be removed
     */
    getSpecialContext(context, warnOnCall=false) {
        const first_el = this._firstElementContext(context);
        if (first_el !== undefined) {
            return first_el;
        }
        const special_context = this._specialContext(context);
        if (special_context === undefined) {
            return undefined;
        }
        if (warnOnCall) {
            console.warn(`Calling special context ${context}!`);
        }
        return special_context;
    }

    /**
     * Map as if this were an Array
     */
    map(func) {
        return Array.from(this).map(func);
    }

    filter(func) {
        return Array.from(this).filter(func);
    }

    clear() {
        for (const e of this._elements) {
            if (e.activeSite === this) {
                e.activeSite = undefined;
            }
            e.sites.remove(this);
        }

        this._elements = [];
        this._offsetDict = new WeakMap();
        this.isFlat = true;
        this.isSorted = true;
    }

    coreElementsChanged({
        updateIsFlat=true,
        clearIsSorted=true,
        memo=undefined, // unused
        keepIndex=false, // unused
    }={}) {
        if (clearIsSorted) {
            this.isSorted = false;
        }
        if (updateIsFlat) {
            this.isFlat = true;
            for (const e of this._elements) {
                if (e.isStream) {
                    this.isFlat = false;
                    break;
                }
            }
        }
    }

    recurse({
        streamsOnly=false,
        restoreActiveSites=true,
        classFilter=undefined,
        skipSelf=true,
    }={}): iterator.RecursiveIterator {
        const includeSelf = !skipSelf;
        const ri = new iterator.RecursiveIterator(
            this,
            {
                streamsOnly,
                restoreActiveSites,
                includeSelf,
            }
        );
        if (classFilter !== undefined) {
            ri.addFilter(new filters.ClassFilter(classFilter));
        }
        return ri;
    }

    /**
     * Add an element to the end of the stream, setting its `.offset` accordingly
     *
     * @param elOrElList - element
     * or list of elements to append
     * @returns {this}
     */
    append(elOrElList: base.Music21Object|base.Music21Object[]) {
        if (Array.isArray(elOrElList)) {
            for (const el of elOrElList) {
                this.append(el);
            }
            return this;
        }

        const el: base.Music21Object = elOrElList;
        if (!(el instanceof base.Music21Object)) {
            throw new Music21Exception('Can only append a music21 object.');
        }
        if (this._elements.includes(el)) {
            throw new StreamException(`Cannot append (${el}): already found in Stream`);
        }
        try {
            if (
                el.isClassOrSubclass !== undefined
                && el.isClassOrSubclass('NotRest')
            ) {
                // set stem direction on output...;
            }
            const elOffset = this.highestTime;
            this._elements.push(el);
            this.setElementOffset(el, elOffset);
            el.offset = elOffset;
            el.sites.add(this);
            el.activeSite = this;
        } catch (err) {
            console.error(
                'Cannot append element ',
                el,
                ' to stream ',
                this,
                ' : ',
                err
            );
        }
        this.coreElementsChanged({ clearIsSorted: false });
        return this;
    }

    sort() {
        if (this.isSorted) {
            return this;
        }
        this._elements.sort((a, b) => this._offsetDict.get(a) - this._offsetDict.get(b)
            || a.priority - b.priority
            || a.classSortOrder - b.classSortOrder);
        this.isSorted = true;
        return this;
    }

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
    insert(
        offset: number,
        el: base.Music21Object,
        {
            ignoreSort=false,
            setActiveSite=true,
        }={}
    ) {
        if (el === undefined) {
            throw new StreamException('Cannot insert without an element.');
        }
        if (this._elements.includes(el)) {
            throw new StreamException(`Cannot insert (${el}): already found in Stream`);
        }
        try {
            if (!ignoreSort) {
                if (offset <= this.highestTime) {
                    this.isSorted = false;
                }
            }
            this._elements.push(el);
            this.setElementOffset(el, offset);
            el.sites.add(this);
            if (setActiveSite) {
                el.activeSite = this;
            }
            this.coreElementsChanged({ clearIsSorted: false });
        } catch (err) {
            console.error(
                'Cannot insert element ',
                el,
                ' to stream ',
                this,
                ' : ',
                err
            );
        }
        return this;
    }

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
    insertAndShift(offset: number|base.Music21Object, elementOrNone?: base.Music21Object): this {
        let element;
        if (elementOrNone === undefined) {
            element = offset;
            offset = element.offset;
        } else {
            element = elementOrNone;
            if (typeof offset !== 'number') {
                throw new Error('offset must be a number if elementOrNone is not given');
            }
        }
        const amountToShift = element.duration.quarterLength;

        let shiftingOffsets = false;
        for (let i = 0; i < this.length; i++) {
            const existingEl = this._elements[i];
            const existingElOffset = this.elementOffset(existingEl);
            if (!shiftingOffsets && existingElOffset >= offset) {
                shiftingOffsets = true;
            }
            if (shiftingOffsets) {
                this.setElementOffset(existingEl, existingElOffset + amountToShift);
            }
        }
        this.insert(offset as number, element);
        return this;
    }

    /**
     * Return the first matched index
     */
    index(el: base.Music21Object) {
        if (!this.isSorted && this.autoSort) {
            this.sort();
        }
        const index = this._elements.indexOf(el);
        if (index === -1) {
            // endElements
            throw new StreamException(
                `cannot find object (${el}) in Stream`
            );
        }
        return index;
    }

    /**
     * Remove and return the last element in the stream,
     * or return undefined if the stream is empty
     */
    pop(): base.Music21Object|undefined {
        if (!this.isSorted && this.autoSort) {
            this.sort();
        }
        // remove last element;
        if (this.length > 0) {
            const el = this.get(-1);
            this._elements.pop();
            this._offsetDict.delete(el);
            el.sites.remove(this);
            this.coreElementsChanged({ clearIsSorted: false });
            return el;
        } else {
            return undefined;
        }
    }

    /**
     * Remove an object from this Stream.  shiftOffsets and recurse do nothing.
     */
    remove(
        targetOrList: base.Music21Object|base.Music21Object[],
        {
            shiftOffsets=false,
            recurse=false,
        } = {}
    ) {
        if (shiftOffsets && recurse) {
            throw new StreamException(
                'Cannot do both shiftOffsets and recurse search at the same time...yet'
            );
        }
        if (shiftOffsets) {
            throw new StreamException('Cannot shift offsets yet.');
        }

        let targetList: base.Music21Object[];
        if (!Array.isArray(targetOrList)) {
            targetList = [targetOrList];
        } else {
            targetList = targetOrList;
            targetList.sort((a, b) => this.elementOffset(a) - this.elementOffset(b));
        }
        //        if (targetList.length > 1) {
        //            sort targetList
        //        }
        // let shiftDur = 0.0; // for shiftOffsets
        let i = -1;
        for (const target of targetList) {
            i += 1;
            let indexInStream;
            try {
                indexInStream = this.index(target);
            } catch (err) {
                if (err instanceof StreamException) {
                    if (recurse) {
                        for (const s of <Stream[]><any> this.recurse({streamsOnly: true})) {
                            try {
                                indexInStream = s.index(target);
                                s.remove(target);
                                break;
                            } catch {
                                // not here...that's normal.  try the next recurse stream.
                            }
                        }
                    }
                    continue;
                }
                throw err;
            }
            // not recursive.

            // const matchOffset = this._offsetDict[indexInStream];
            // let match;
            // handle _endElements
            // let matchedEndElement = false;
            // let baseElementCount = this._elements.length;
            this._elements.splice(indexInStream, 1);
            this._offsetDict.delete(target);
            target.activeSite = undefined;
            target.sites.remove(this);
            // remove from sites if needed.

            //            if (shiftOffsets) {
            //                const matchDuration = target.duration.quarterLength;
            //                const shiftedRegionStart = matchOffset + matchDuration;
            //                shiftDur += matchDuration;
            //                let shiftedRegionEnd;
            //                if ((i + 1) < targetList.length) {
            //                    const nextElIndex = this.index(targetList[i + 1]);
            //                    const nextElOffset = this._offsetDict[nextElIndex];
            //                    shiftedRegionEnd = nextElOffset;
            //                } else {
            //                    shiftedRegionEnd = this.duration.quarterLength;
            //                }
            //                if (shiftDur !== 0.0) {
            //                    for (const e of this.getElementsByOffset(
            //                       shiftedRegionStart,
            //                       shiftedRegionEnd,
            //                       {
            //                           includeEndBoundary: false,
            //                           mustFinishInSpan: false,
            //                           mustBeginInSpan: false,
            //                       }
            //                    )) {
            //                        const elementOffset = this.elementOffset(e);
            //                        this.setElementOffset(e, elementOffset - shiftDur);
            //                    }
            //                }
            //            }
        }
        this.coreElementsChanged({ clearIsSorted: false });
    }

    /**
     *  Given a `target` object, replace it with
     *  the supplied `replacement` object.
     *
     *  `recurse` and `allDerived` do not currently work.
     *
     *  Does nothing if target cannot be found.
     */
    replace(
        target: base.Music21Object,
        replacement: base.Music21Object,
        {
            recurse=false,
            allDerived=true,
        } = {}
    ) {
        try {
            this.index(target);
        } catch (err) {
            if (err instanceof StreamException) {
                return;
            } else {
                throw err;
            }
        }
        const targetOffset = this.elementOffset(target);
        this.remove(target);
        this.insert(targetOffset, replacement);
        this.coreElementsChanged({ clearIsSorted: false });
    }

    /**
     * Get the `index`th element from the Stream.  Equivalent to the
     * music21p format of s[index] using __getitem__.  Can use negative indexing to get from the end.
     *
     * Once Proxy objects are supported by all operating systems for
     *
     * @param {number} index - can be -1, -2, to index from the end, like python
     * @returns {Music21Object|undefined}
     */
    get(index: number): base.Music21Object {
        // substitute for Python stream __getitem__; supports -1 indexing, etc.
        if (!this.isSorted) {
            this.sort();
        }

        let el;
        if (index === undefined || Number.isNaN(index)) {
            return undefined;
        } else if (Math.abs(index) > this._elements.length) {
            return undefined;
        } else if (index === this._elements.length) {
            return undefined;
        } else if (index < 0) {
            el = this._elements[this._elements.length + index];
            el.activeSite = this;
            return el;
        } else {
            el = this._elements[index];
            el.activeSite = this;
            return el;
        }
    }

    /**
     *
     */
    set(index, newEl) {
        const replaceEl = this.get(index);
        if (replaceEl === undefined) {
            throw new StreamException(`Cannot set element at index ${index}.`);
        }
        this.replace(replaceEl, newEl);
        return this;
    }


    setElementOffset(el, value, addElement=false) {
        if (!this._elements.includes(el)) {
            if (addElement) {
                this.insert(value, el);
                return;
            } else {
                throw new StreamException(
                    'Cannot set the offset for element '
                            + el.toString()
                            + ', not in Stream'
                );
            }
        }
        this._offsetDict.set(el, value);
        el.activeSite = this;
    }

    elementOffset(element, stringReturns=false) {
        if (!this._offsetDict.has(element)) {
            throw new StreamException(
                'An entry for this object ' + element.toString() + ' is not stored in this Stream.'
            );
        } else {
            return this._offsetDict.get(element);
        }
    }

    /*  --- ############# END ELEMENT FUNCTIONS ########## --- */

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
    makeMeasures(options?) {
        const params = {
            meterStream: undefined,
            refStreamOrTimeRange: undefined,
            searchContext: false,
            innerBarline: undefined,
            finalBarline: 'final',
            bestClef: false,
            inPlace: false,
        };
        common.merge(params, options);
        let voiceCount;
        if (this.hasVoices()) {
            voiceCount = this.getElementsByClass('Voice').length;
        } else {
            voiceCount = 0;
        }
        // MSC 2019 -- this was not working or even being used.
        // // meterStream
        // const meterStream = this.getElementsByClass('TimeSignature');
        // if (meterStream.length === 0) {
        //     meterStream.append(this.timeSignature);
        // }

        // getContextByClass('Clef')
        const clefObj = this.getSpecialContext('clef') || this.getContextByClass('Clef');
        const offsetMap = this.offsetMap();
        let oMax = 0;
        for (let i = 0; i < offsetMap.length; i++) {
            if (offsetMap[i].endTime > oMax) {
                oMax = offsetMap[i].endTime;
            }
        }

        const classConstructor = <Constructable<Stream>> this.constructor;
        const post = <Stream> new classConstructor();

        // derivation
        let o = 0.0;
        let measureCount = 0;
        let lastTimeSignature;
        let m;
        let mStart;
        while (measureCount === 0 || o < oMax) {
            m = new Measure();
            m.number = measureCount + 1;
            // var thisTimeSignature = meterStream.getElementAtOrBefore(o);
            const thisTimeSignature = this.timeSignature;
            if (thisTimeSignature === undefined) {
                break;
            }
            const oneMeasureLength
                = thisTimeSignature.barDuration.quarterLength;
            if (oneMeasureLength === 0) {
                // if for some reason we are advancing not at all, then get out!
                break;
            }
            if (measureCount === 0) {
                // simplified...
            }
            m.clef = clefObj.clone();
            m.timeSignature = thisTimeSignature.clone();

            for (let voiceIndex = 0; voiceIndex < voiceCount; voiceIndex++) {
                const v = new Voice();
                v.id = voiceIndex;
                m.insert(0, v);
            }
            post.insert(o, m);
            o += oneMeasureLength;
            measureCount += 1;
            lastTimeSignature = thisTimeSignature;
        }
        for (let i = 0; i < offsetMap.length; i++) {
            const ob = offsetMap[i];
            const e = ob.element;
            const start = ob.offset;
            const voiceIndex = ob.voiceIndex;

            // if 'Spanner' in e.classes;
            lastTimeSignature = undefined;
            for (let j = 0; j < post.length; j++) {
                m = post.get(j); // nothing but measures...
                const foundTS = m.getSpecialContext('timeSignature');
                if (foundTS !== undefined) {
                    lastTimeSignature = foundTS;
                }
                mStart = m.getOffsetBySite(post);
                let mEnd;
                if (lastTimeSignature !== undefined) {
                    mEnd
                        = mStart + lastTimeSignature.barDuration.quarterLength;
                } else {
                    mEnd = mStart + 4.0;
                }
                if (start >= mStart && start < mEnd) {
                    break;
                }
            }
            // if not match, raise Exception;
            const oNew = start - mStart;
            if (m.clef === e) {
                continue;
            }
            if (oNew === 0 && e.isClassOrSubclass('TimeSignature')) {
                continue;
            }
            let insertStream = m;
            if (voiceIndex !== undefined) {
                insertStream = m.getElementsByClass('Voice').get(voiceIndex);
            }
            insertStream.insert(oNew, e);
        }
        // set barlines, etc.
        if (params.inPlace !== true) {
            return post;
        } else {
            this.elements = [];
            // endElements
            // elementsChanged;
            for (const e of post) {
                this.insert(e.offset, e);
            }
            return this; // javascript style;
        }
    }

    containerInHierarchy(el: base.Music21Object, { setActiveSite=true }={}): Stream|undefined {
        const elSites = el.sites;
        for (const s of this.recurse({
            skipSelf: false,
            streamsOnly: true,
            restoreActiveSites: false,
        })) {
            if (elSites.includes(s as Stream)) {
                if (setActiveSite) {
                    el.activeSite = s;
                }
                return s as Stream;
            }
        }
        return undefined;
    }

    /**
     * chordify does not yet work...
     */
    chordify({
        addTies=true,
        addPartIdAsGroup=true,
        removeRedundantPitches=true,
        toSoundingPitch=true,
    }={}) {
        const workObj = this;
        let templateStream;
        if (this.hasPartLikeStreams()) {
            templateStream = workObj.getElementsByClass('Stream').get(0);
        } else {
            templateStream = workObj;
        }
        const template = templateStream.template({
            fillWithRests: false,
            removeClasses: ['GeneralNote'],
            retainVoices: false,
        });
        return template;
    }

    template({
        fillWithRests=true,
        removeClasses=[],
        retainVoices=true,
    }={}): this {
        const out = this.cloneEmpty('template');
        const restInfo = {
            offset: undefined,
            endTime: undefined,
        };
        const optionalAddRest = function optionalAddRest() {
            if (!fillWithRests) {
                return;
            }
            if (restInfo.offset === undefined) {
                return;
            }
            const restQL = restInfo.endTime - restInfo.offset;
            const restObj = new note.Rest();
            restObj.duration.quarterLength = restQL;
            out.insert(restInfo.offset, restObj);
            restInfo.offset = undefined;
            restInfo.endTime = undefined;
        };
        for (const el of this) {
            if (el.isStream
                    && (retainVoices || el.classes.includes('Voice'))) {
                optionalAddRest();
                const outEl = (el as Stream).template({
                    fillWithRests,
                    removeClasses,
                    retainVoices,
                });
                out.insert(el.offset, outEl);
            }
        }
        return out;
    }

    cloneEmpty(derivationMethod?: string): this {
        const returnObj = this.constructor();
        // TODO(msc): derivation
        returnObj.mergeAttributes(this);
        return returnObj;
    }

    /**
     *
     * @param {this} other
     * @returns {this}
     */
    mergeAttributes(other: Stream): this {
        super.mergeAttributes(other);
        for (const attr of [
            'autoSort',
            'isSorted',
            'definesExplicitSystemBreaks',
            'definesExplicitPageBreaks',
            '_atSoundingPitch',
            '_mutable',
        ]) {
            if (Object.prototype.hasOwnProperty.call(other, attr)) {
                this[attr] = other[attr];
            }
        }
        return this;
    }


    /**
     * makeNotation does not do anything yet, but it is a placeholder
     * so it can start to be called.
     *
     * TODO: move call to makeBeams from renderVexflow to here.
     */
    makeNotation({ inPlace=true }={}): this {
        let out;
        if (inPlace) {
            out = this;
        } else {
            out = this.clone(true);
        }
        // already made a copy
        this.makeAccidentals({ inPlace: true });
        return out;
    }


    /**
     * Return a new Stream or modify this stream
     * to have beams.
     *
     * Called from renderVexflow()
     */
    makeBeams(
        {
            inPlace=false,
            setStemDirections=true,
        }: makeNotation.MakeBeamsOptions={}
    ): this {
        return makeNotation.makeBeams(this, { inPlace, setStemDirections }) as this;
    }

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
    hasPartLikeStreams() {
        for (const el of this) {
            if (el.classes.includes('Part')) {
                return true;
            }
        }
        return false;
    }


    /**
     * Returns true if any note in the stream has lyrics, otherwise false
     *
     * @returns {boolean}
     */
    hasLyrics() {
        for (const el of this) {
            if ((el as note.Note).lyric !== undefined) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns a list of OffsetMap objects
     */
    offsetMap(): OffsetMap[] {
        const offsetMap = [];
        let groups = [];
        if (this.hasVoices()) {
            // TODO(msc) -- remove jQuery each...
            $.each(this.getElementsByClass('Voice'), (i, v) => {
                groups.push([v.flat, i]);
            });
        } else {
            groups = [[this, undefined]];
        }
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i][0];
            const voiceIndex = groups[i][1];
            for (let j = 0; j < group.length; j++) {
                const e = group.get(j);
                const dur = e.duration.quarterLength;
                const offset = group.elementOffset(e);
                const endTime = offset + dur;
                const thisOffsetMap = new OffsetMap(
                    e,
                    offset,
                    endTime,
                    voiceIndex
                );
                offsetMap.push(thisOffsetMap);
            }
        }
        return offsetMap;
    }

    get iter(): iterator.StreamIterator {
        return new iterator.StreamIterator(this);
    }

    /**
     * Find all elements with a certain class; if an Array is given, then any
     * matching class will work.
     *
     * @param {string[]|string} classList - a list of classes to find
     */
    getElementsByClass(classList: string|string[]): iterator.StreamIterator {
        return this.iter.getElementsByClass(classList);
    }

    /**
     * Find all elements NOT with a certain class; if an Array is given, then any
     * matching class will work.
     *
     * @param {string[]|string} classList - a list of classes to find
     */
    getElementsNotOfClass(classList: string|string[]): iterator.StreamIterator {
        return this.iter.getElementsNotOfClass(classList);
    }

    //    getElementsByClass(classList) {
    //        const tempEls = [];
    //        for (const thisEl of this) {
    //            // console.warn(thisEl);
    //            if (thisEl.isClassOrSubclass === undefined) {
    //                console.error(
    //                    'what the hell is a ',
    //                    thisEl,
    //                    'doing in a Stream?'
    //                );
    //            } else if (thisEl.isClassOrSubclass(classList)) {
    //                tempEls.push(thisEl);
    //            }
    //        }
    //        const newSt = this.clone(false);
    //        newSt.elements = tempEls;
    //        return newSt;
    //    }

    /**
     * Returns a new stream [StreamIterator does not yet exist in music21j]
     * containing all Music21Objects that are found at a certain offset or
     * within a certain offset time range (given the offsetStart and
     * (optional) offsetEnd values).
     *
     * See music21p documentation for the effect of various parameters.
     */
    getElementsByOffset(
        offsetStart: number,
        offsetEnd: number = undefined,
        {
            includeEndBoundary=true,
            mustFinishInSpan=false,
            mustBeginInSpan=true,
            includeElementsThatEndAtStart=true,
            classList=undefined,
        }={}
    ) {

        let s;
        if (classList !== undefined) {
            s = this.iter.getElementsByClass(classList);
        } else {
            s = this.iter;
        }
        s.getElementsByOffset(
            offsetStart,
            offsetEnd,
            {
                includeEndBoundary,
                mustFinishInSpan,
                mustBeginInSpan,
                includeElementsThatEndAtStart,
            }
        );
        return s;
    }

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
    playingWhenAttacked(el: base.Music21Object, elStream?): base.Music21Object|undefined {
        let elOffset;
        if (elStream !== undefined) {
            elOffset = el.getOffsetBySite(elStream);
        } else {
            elOffset = el.offset;
        }

        const otherElements = this.getElementsByOffset(elOffset, elOffset, { mustBeginInSpan: false });
        if (otherElements.length === 0) {
            return undefined;
        } else if (otherElements.length === 1) {
            return otherElements.get(0);
        } else {
            for (const thisEl of otherElements) {
                if (el.constructor === thisEl.constructor) {
                    return thisEl;
                }
            }
            return otherElements.get(0);
        }
    }


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

        Called automatically before appendDOM routines are called.
     */
    makeAccidentals({
        pitchPast=[],
        pitchPastMeasure=[],
        useKeySignature=true,
        alteredPitches=[],
        searchKeySignatureByContext=false,  // not yet used.
        cautionaryPitchClass=true,
        cautionaryAll=false,
        inPlace=false,
        overrideStatus=false,
        cautionaryNotImmediateRepeat=true,
        tiePitchSet=new Set(),
    } : MakeAccidentalsParams = {}) : this {
        let returnObj: this;
        if (inPlace) {
            returnObj = this;
        } else {
            returnObj = this.clone(true);
        }
        let ks: KeySignature;
        if (useKeySignature === true) {
            ks = this.keySignature ?? this.getContextByClass('KeySignature');
        } else if (useKeySignature !== false) {
            ks = useKeySignature as KeySignature;
        }
        if (ks !== undefined) {
            const addAlterPitches = ks.alteredPitches;
            alteredPitches.push(...addAlterPitches);
        }

        const noteIterator = returnObj.recurse().notesAndRests;
        let last_measure: Measure;
        for (const e of noteIterator) {
            if (e.activeSite !== undefined && e.activeSite.isMeasure) {
                // noinspection JSUnusedAssignment
                if (last_measure !== undefined && e.activeSite !== last_measure) {
                    // New measure: move pitchPast to pitchPastMeasure and clear
                    pitchPastMeasure = Array.from(pitchPast);
                    pitchPast = [];
                }
                last_measure = e.activeSite;
            }
            if (e.classes.includes('Note')) {
                const p = (e as note.Note).pitch;
                const lastNoteWasTied: boolean = tiePitchSet.has(p.nameWithOctave);

                p.updateAccidentalDisplay({
                    pitchPast,
                    pitchPastMeasure,
                    alteredPitches,
                    cautionaryPitchClass,
                    cautionaryAll,
                    overrideStatus,
                    cautionaryNotImmediateRepeat,
                    lastNoteWasTied,
                });
                pitchPast.push(p);

                tiePitchSet.clear();
                const tie = e.tie;
                if (tie !== undefined && tie.type !== 'stop') {
                    tiePitchSet.add(p.nameWithOctave);
                }
            } else if (e.classes.includes('Chord')) {
                const chordNotes = (e as Chord).notes;
                const seenPitchNames: Set<string> = new Set();
                for (const n of chordNotes) {
                    const p = n.pitch;
                    const lastNoteWasTied: boolean = tiePitchSet.has(p.nameWithOctave);

                    p.updateAccidentalDisplay({
                        pitchPast,
                        pitchPastMeasure,
                        alteredPitches,
                        cautionaryPitchClass,
                        cautionaryAll,
                        overrideStatus,
                        cautionaryNotImmediateRepeat,
                        lastNoteWasTied,
                    });

                    if (n.tie !== undefined && n.tie.type !== 'stop') {
                        seenPitchNames.add(p.nameWithOctave);
                    }
                }
                tiePitchSet.clear();
                for (const pName of seenPitchNames) {
                    tiePitchSet.add(pName);
                }
                pitchPast.push(...(e as Chord).pitches);
            } else {
                tiePitchSet.clear();
            }

        }
        return returnObj;
    }

    /**
     * Sets the render options for any substreams (such as placing them
     * in systems, etc.) DOES NOTHING for music21.stream.Stream, but is
     * overridden in subclasses.
     *
     * @returns {this}
     */
    setSubstreamRenderOptions() {
        /* does nothing for standard streams ... */
        return this;
    }

    /**
     * Resets all the RenderOptions back to defaults. Can run recursively
     * and can also preserve the `RenderOptions.events` object.
     *
     * @param {boolean} [recursive=false]
     * @param {boolean} [preserveEvents=false]
     * @returns {this}
     */
    resetRenderOptions(recursive, preserveEvents) {
        const oldEvents = this.renderOptions.events;
        this.renderOptions = new renderOptions.RenderOptions();
        if (preserveEvents) {
            this.renderOptions.events = oldEvents;
        }

        if (recursive) {
            for (const el of this) {
                if (el.isClassOrSubclass('Stream')) {
                    (el as Stream).resetRenderOptions(recursive, preserveEvents);
                }
            }
        }
        return this;
    }

    //  * *********  VexFlow functionality

    write(format='musicxml') {
        return _exportMusicXMLAsText(this);
    }


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
    renderVexflow(where?: JQuery|HTMLElement): vfShow.Renderer {
        const canvasOrSVG = common.coerceHTMLElement(where);
        const DOMContains = document.body.contains(canvasOrSVG);
        if (!DOMContains) {
            // temporarily add to DOM so Firefox can measure it...
            document.body.appendChild(canvasOrSVG);
        }
        const tagName = canvasOrSVG.tagName.toLowerCase();

        if (this.autoBeam === true) {
            try {
                this.makeBeams({ inPlace: true });
            } catch (e) {
                if (!e.toString().includes('Time Signature')) {
                    throw e;
                }
            }
        }
        const vfr = new vfShow.Renderer(this, canvasOrSVG);
        if (tagName === 'canvas') {
            vfr.rendererType = 'canvas';
        } else if (tagName === 'svg') {
            vfr.rendererType = 'svg';
        }
        vfr.render();
        this.setRenderInteraction(canvasOrSVG);
        this.activeVFRenderer = vfr;
        if (!DOMContains) {
            // remove the adding to DOM so that Firefox could measure it...
            document.body.removeChild(canvasOrSVG);
        }

        return vfr;
    }

    /**
     * Estimate the stream height for the Stream.
     *
     * If there are systems they will be incorporated into the height unless `ignoreSystems` is `true`.
     *
     * @returns {number} height in pixels
     */
    estimateStreamHeight({ignoreSystems=false, ignoreMarginBottom=false}={}): number {
        const staffHeight = this.renderOptions.staffAreaHeight;
        const marginBottom = this.renderOptions.marginBottom;  // extra at end.
        const systemPadding = this.renderOptions.systemPadding;
        let numSystems;
        if (this instanceof Score) {
            const numParts = this.parts.length;
            numSystems = this.numSystems();
            if (ignoreSystems) {
                numSystems = 1;
            }
            let scoreHeight
                = numSystems * staffHeight * numParts
                + (numSystems - 1) * systemPadding;

            if (!ignoreMarginBottom) {
                scoreHeight += marginBottom;
            }

            // TODO(msc) -- Fix and Remove
            if (numSystems > 1) {
                // needs a little extra padding for some reason...
                scoreHeight += systemPadding / 2;
            }

            // console.log('scoreHeight of ' + scoreHeight);
            return scoreHeight;
        } else if (this instanceof Part) {
            numSystems = 1;
            if (!ignoreSystems) {
                numSystems = this.numSystems();
            }
            if (debug) {
                console.log(
                    'estimateStreamHeight for Part: numSystems ['
                        + numSystems
                        + '] * staffHeight ['
                        + staffHeight
                        + '] + (numSystems ['
                        + numSystems
                        + '] - 1) * systemPadding ['
                        + systemPadding
                        + '].'
                );
            }
            let partHeight = numSystems * staffHeight + (numSystems - 1) * systemPadding;
            if (!ignoreMarginBottom) {
                partHeight += marginBottom;
            }
            return partHeight;
        } else {
            if (!ignoreMarginBottom) {
                return staffHeight + marginBottom;
            } else {
                return staffHeight;
            }
        }
    }

    /**
     * Estimates the length of the Stream in pixels.
     *
     * @returns {number} length in pixels
     */
    estimateStaffLength() {
        let i;
        let totalLength;
        if (this.renderOptions.overriddenWidth !== undefined) {
            // console.log('Overridden staff width: ' + this.renderOptions.overriddenWidth);
            return this.renderOptions.overriddenWidth;
        }
        if (this.hasVoices()) {
            let maxLength = 0;
            for (const v of this) {
                if (v instanceof Stream) {
                    const thisLength
                        = v.estimateStaffLength() + v.renderOptions.staffPadding;
                    if (thisLength > maxLength) {
                        maxLength = thisLength;
                    }
                }
            }
            return maxLength;
        } else if (!this.isFlat) {
            // part
            totalLength = 0;
            for (i = 0; i < this.length; i++) {
                const m = this.get(i);
                if (m instanceof Stream) {
                    totalLength
                        += m.estimateStaffLength() + m.renderOptions.staffPadding;
                    if (i !== 0 && m.renderOptions.startNewSystem === true) {
                        break;
                    }
                }
            }
            return totalLength;
        } else {
            const rendOp = this.renderOptions;
            totalLength = 30 * this.notesAndRests.length;
            if (rendOp.displayClef) {
                // TODO: do not do this if Clef.style.hideObjectOnPrint
                totalLength += 30;
            }
            if (rendOp.displayKeySignature) {
                const ks = this.getSpecialContext('keySignature');
                // TODO: do not do this if Clef.style.hideObjectOnPrint
                totalLength += ks?.width ?? 0;
            }
            if (rendOp.displayTimeSignature) {
                // TODO: do not do this if Clef.style.hideObjectOnPrint
                totalLength += 30;
            }
            // totalLength += rendOp.staffPadding;
            return totalLength;
        }
    }

    stripTies(
        {
            inPlace=false,
            matchByPitch=true,
        }: {
            inPlace?: boolean,
            matchByPitch?: boolean,
       } = {}
    ): this {
        let returnObj: this;
        if (inPlace) {
            returnObj = this;
        } else {
            returnObj = this.clone(true) as this;
        }

        // returnObj.streamStatus.beams = false;
        if (returnObj.parts.length) {
            for (const p of returnObj.parts) {
                p.stripTies({inPlace: true, matchByPitch});
            }
            return returnObj;
        }

        if (returnObj.voices.length) {
            for (const v of returnObj.voices) {
                v.stripTies({inPlace: true, matchByPitch});
            }
            return returnObj;
        }
        const f = returnObj.flatten();
        const notes = Array.from(f.notesAndRests);

        let posConnected: number[] = [];
        const posDelete: number[] = [];

        let nLast: note.GeneralNote;
        let iLast: number;

        const updateEndMatch = nInner => {
            const ni_is_chord = nInner.classes.includes('Chord');
            const nLast_is_chord = nLast?.classes.includes('Chord');

            // m21p case 1
            if (!ni_is_chord && nInner.tie?.type === 'stop') {
                return true;
            }
            // skip case 2 for now.
            if (!matchByPitch) {
                return false;
            }
            if (!ni_is_chord
                && nLast
                && posConnected.includes(iLast)
                && !nLast_is_chord
                && (nLast as note.Note).pitch?.eq(nInner.pitch)
            ) {
                return true;
            }

            if (nLast
                && !(nInner.classes.includes('Note'))
                && nLast_is_chord
                && ni_is_chord
            ) {
                if ((nLast as Chord).pitches.length !==
                    (nInner as Chord).pitches.length
                ) {
                    return false;
                }

                for (let pitchIndex = 0; pitchIndex < (nLast as Chord).pitches.length; pitchIndex++) {
                    if ((nLast as Chord).pitches[pitchIndex] !== nInner.pitches[pitchIndex]) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        };

        const allTiesAreContinue: (nr: note.NotRest) => boolean = nr => {
            if (!nr.tie) {
                return false;
            }
            if (nr.tie.type !== 'continue') {
                return false;
            }
            // TODO: check chords...
            return true;
        };

        for (let i = 0; i < notes.length; i++) {
            let endMatch;
            const n = <note.NotRest> notes[i];
            if (i > 0) {
                iLast = i - 1;
                nLast = notes[iLast];
            } else {
                iLast = undefined;
                nLast = undefined;
            }
            if (n.tie?.type === 'start') {
                if (iLast === undefined || !posConnected.includes(iLast)) {
                    posConnected = [i];
                } else if (posConnected.includes(iLast)) {
                    posConnected.push(i);
                }
                endMatch = false;
            } else if (n.tie?.type === 'continue') {
                if (!posConnected.length) {
                    posConnected.push(i);
                    endMatch = false;
                } else if (matchByPitch) {
                    const tempEndMatch = updateEndMatch(n);
                    if (tempEndMatch) {
                        posConnected.push(i);
                        endMatch = false;
                    } else {
                        posConnected = [i];
                        endMatch = false;
                    }
                } else if (allTiesAreContinue(n)) {
                    if (nLast && (nLast as note.NotRest).pitches?.length !== n.pitches?.length) {
                        posConnected = [i];
                    } else {
                        posConnected.push(i);
                    }
                    endMatch = false;
                } else {
                    posConnected = [];
                    endMatch = false;
                }
            }

            if (endMatch === undefined) {
                endMatch = updateEndMatch(n);
            }

            if (endMatch) {
                posConnected.push(i);
                if (posConnected.length < 2) {
                    posConnected = [];
                    continue;
                }

                let durSum: number = 0;
                for (let q_index = 1; q_index < posConnected.length; q_index++) {
                    const q = posConnected[q_index];
                    durSum += notes[q].quarterLength;
                    posDelete.push(q);
                }
                if (durSum === 0) {
                    throw new StreamException('aggregated ties have a zero duration sum');
                }
                const qLen = notes[posConnected[0]].quarterLength;
                notes[posConnected[0]].quarterLength = qLen + durSum;
                notes[posConnected[0]].tie = undefined;

                // TODO: spanners;
                posConnected = [];
            }
        }

        posDelete.reverse();

        for (const i of posDelete) {
            const nTarget = notes[i];
            returnObj.remove(nTarget, {recurse: true});
        }

        return returnObj;
    }


    /**
     * Returns either (1) a Stream containing Elements
     * (that wrap the null object) whose offsets and durations
     * are the length of gaps in the Stream
     * or (2) null if there are no gaps.
     * @returns {object}
     */
    findGaps() {
        if (!this.isSorted && this.autoSort) {
            this.sort();
        }
        const sortedElements = this.elements;
        let elementDuration = 0;
        const gapStream = new Stream(); // cloneEmpty does not work, created new obj
        let highestCurrentEndTime = 0.0;
        for (const element of sortedElements) {
            if (element) {
                if (element.offset > highestCurrentEndTime) {
                    const gapElement = new base.Music21Object();
                    const gapQuarterLength = element.offset - highestCurrentEndTime;
                    gapElement.duration = this.duration;
                    gapElement.duration.quarterLength = gapQuarterLength;
                    gapStream.insert(highestCurrentEndTime, gapElement);
                } if ('duration' in element && element.duration !== null) {
                    elementDuration = element.duration.quarterLength;
                } else {
                    elementDuration = 0;
                }
                highestCurrentEndTime = (
                    Math.max(highestCurrentEndTime, element.offset + elementDuration)
                );
            }
        }
        gapStream.sort();
        if (gapStream.elements.length) {
            return gapStream;
        }
        return null;
    }

    /**
     * Returns True if there are no gaps between the lowest offset and the highest time.
     * Otherwise returns False
     *
     * @returns {boolean}
     */

    get isGapless() {
        return (this.findGaps() === null);
    }

    //  * ***** MIDI related routines...

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
    playStream(options={}) {
        const params = {
            instrument: this.instrument,
            tempo: this.tempo,
            done: undefined,
            startNote: undefined,
        };
        common.merge(params, options);
        const startNoteIndex = params.startNote;
        let currentNoteIndex = 0;
        if (startNoteIndex !== undefined) {
            currentNoteIndex = startNoteIndex;
        }
        const thisFlat = this.flat;
        const flatEls = [];
        for (const el of thisFlat) {
            flatEls.push(el);
        }
        const lastNoteIndex = flatEls.length - 1;
        this._stopPlaying = false;

        const playNext = (elements, params) => {
            if (currentNoteIndex <= lastNoteIndex && !this._stopPlaying) {
                const el = elements[currentNoteIndex];
                let nextNote;
                let playDuration;
                if (currentNoteIndex < lastNoteIndex) {
                    nextNote = elements[currentNoteIndex + 1];
                    playDuration = thisFlat.elementOffset(nextNote) - thisFlat.elementOffset(el);
                } else {
                    playDuration = el.duration.quarterLength;
                }
                const milliseconds = playDuration * 1000 * 60 / params.tempo;

                // when we're ready to do full-on tempo marks:  from JV.
                // const nextOffset = nextNote ? nextNote.offset : el.offset + el.duration.quarterLength;
                // const tempo = thisStream._averageTempo(el.offset, nextOffset);
                // const milliseconds = playDuration * 1000 * 60 / tempo;

                if (debug) {
                    console.log(
                        'playing: ',
                        el,
                        playDuration,
                        milliseconds,
                        params.tempo
                    );
                }

                if (el.playMidi !== undefined) {
                    el.playMidi(params.tempo, nextNote, params);
                }
                currentNoteIndex += 1;
                setTimeout(() => {
                    playNext(elements, params);
                }, milliseconds);
            } else if (params && params.done) {
                params.done.call();
            }
        };
        playNext(flatEls, params);
        return this;
    }

    /**
     * Stops a stream from playing if it currently is.
     *
     * @returns {this}
     */
    stopPlayStream() {
        // turns off all currently playing MIDI notes (on any stream) and stops playback.
        this._stopPlaying = true;
        for (let i = 0; i < 127; i++) {
            MIDI.noteOff(0, i, 0);
        }
        return this;
    }
    /* ----------------------------------------------------------------------
     *
     *  SVG/Canvas DOM routines -- to be factored out eventually.
     *
     */

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
    createNewDOM(
        width?: number|string,
        height?: number|string,
        elementType='svg'
    ): JQuery<HTMLDivElement>|JQuery<HTMLCanvasElement> {
        if (!this.isFlat) {
            this.setSubstreamRenderOptions();
        }

        let $newCanvasOrDIV;

        if (elementType === 'svg') {
            // we render SVG on a Div for Vexflow
            $newCanvasOrDIV = $('<div/>') as JQuery<HTMLDivElement>;
        } else if (elementType === 'canvas') {
            $newCanvasOrDIV = $('<canvas/>') as JQuery<HTMLCanvasElement>;
        }

        $newCanvasOrDIV.addClass('streamHolding'); // .css('border', '1px red solid');

        if (width !== undefined) {
            if (typeof width === 'string') {
                width = common.stripPx(width);
            }
            $newCanvasOrDIV.attr('width', width);
        } else {
            const computedWidth
                = this.estimateStaffLength()
                + this.renderOptions.staffPadding;
            $newCanvasOrDIV.attr('width', computedWidth);
        }
        if (height !== undefined) {
            $newCanvasOrDIV.attr('height', height);
        } else {
            let computedHeight;
            if (this.renderOptions.height === undefined) {
                computedHeight = this.estimateStreamHeight();
                // console.log('computed Height estimate: ' + computedHeight);
            } else {
                computedHeight = this.renderOptions.height;
                // console.log('computed Height: ' + computedHeight);
            }
            $newCanvasOrDIV.attr(
                'height',
                computedHeight * this.renderOptions.scaleFactor.y
            );
        }
        return $newCanvasOrDIV;
    }

    /**
     * Creates a rendered, playable svg where clicking plays it.
     *
     * Called from appendNewDOM() etc.
     *
     */
    createPlayableDOM(
        width: number|string|undefined = undefined,
        height: number|string|undefined = undefined,
        elementType='svg'
    ): JQuery {
        this.renderOptions.events.click = 'play';
        return this.createDOM(width, height, elementType);
    }

    /**
     * Creates a new svg and renders vexflow on it
     *
     * @param {number|string|undefined} [width]
     * @param {number|string|undefined} [height]
     * @param {string} elementType - what type of element svg or canvas, default = svg
     * @returns {JQuery} canvas or SVG
     */
    createDOM(
        width: number|string|undefined = undefined,
        height: number|string|undefined = undefined,
        elementType: string = 'svg'
    ): JQuery {
        const $newSvg = this.createNewDOM(width, height, elementType);
        // temporarily append the SVG to the document to fix a Firefox bug
        // where nothing can be measured unless is it in the document.
        this.renderVexflow($newSvg);
        return $newSvg;
    }

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
    appendNewDOM(
        appendElement: JQuery|HTMLElement = document.body,
        width: number|string = undefined,
        height: number|string = undefined,
        elementType: string = 'svg'
    ): HTMLElement {
        const $appendElement = common.coerceJQuery(appendElement);
        const $svgOrCanvasBlock = this.createDOM(width, height, elementType);
        $appendElement.append($svgOrCanvasBlock);
        return $svgOrCanvasBlock[0];
    }

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
    replaceDOM(
        where?: JQuery|HTMLElement,
        preserveSvgSize: boolean=false,
        elementType: string='svg'
    ): JQuery {
        let $oldSVGOrCanvas;
        const $where = common.coerceJQuery(where);

        if ($where.hasClass('streamHolding')) {
            $oldSVGOrCanvas = $where;
        } else {
            $oldSVGOrCanvas = $where.find('.streamHolding');
        }
        // TODO: Max Width!
        if ($oldSVGOrCanvas.length === 0) {
            throw new Music21Exception('No svg defined for replaceDOM!');
        } else if ($oldSVGOrCanvas.length > 1) {
            // change last svg...
            // replacing each with svgBlock doesn't work
            // anyhow, it just resizes the svg but doesn't
            // draw.
            $oldSVGOrCanvas = $($oldSVGOrCanvas[$oldSVGOrCanvas.length - 1]);
        }

        let svgBlock;
        if (preserveSvgSize) {
            const width = $oldSVGOrCanvas.width() || parseInt($oldSVGOrCanvas.attr('width'));
            const height = $oldSVGOrCanvas.attr('height'); // height manipulates
            svgBlock = this.createDOM(width, height, elementType);
        } else {
            svgBlock = this.createDOM(undefined, undefined, elementType);
        }

        $oldSVGOrCanvas.replaceWith(svgBlock);
        return svgBlock;
    }


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
     */
    setRenderInteraction(where: JQuery|HTMLElement): this {
        const $svg = common.coerceJQuery(where);
        const playFunc = () => {
            this.playStream();
        };

        for (const [eventType, eventFunction] of Object.entries(this.renderOptions.events)) {
            $svg.off(eventType);
            if (eventFunction === 'play') {
                $svg.on(eventType, playFunc);
            } else if (
                eventType === 'resize'
                && eventFunction === 'reflow'
            ) {
                this.windowReflowStart($svg);
            } else if (eventFunction instanceof Function) {
                $svg.on(eventType, eventFunction);
            }
        }
        return this;
    }

    /**
     *
     * Recursively search downward for the closest storedVexflowStave...
     */
    recursiveGetStoredVexflowStave(): Vex.Flow.Stave|undefined {
        const storedVexflowStave = this.storedVexflowStave;
        if (storedVexflowStave === undefined) {
            if (this.isFlat) {
                return undefined;
            } else {
                const subStreams = this.getElementsByClass('Stream') as
                    iterator.StreamIterator<Stream>;
                const first_subStream = subStreams.get(0);
                return first_subStream.recursiveGetStoredVexflowStave();
            }
        }
        return storedVexflowStave;
    }

    /**
     * Given a mouse click, or other event with .pageX and .pageY,
     * find the x and y for the svg.
     *
     * returns {Array<number>} two-elements, [x, y] in pixels.
     */
    getUnscaledXYforDOM(
        svg,
        e: MouseEvent|TouchEvent|JQuery.MouseEventBase
    ): [number, number] {
        let offset;
        if (svg === undefined) {
            offset = { left: 0, top: 0 };
        } else {
            offset = $(svg).offset();
        }

        /*
         * mouse event handler code originally from: http://diveintohtml5.org/canvas.html
         */
        let xClick: number;
        let yClick: number;
        if ((e as MouseEvent).pageX !== undefined
                && (e as MouseEvent).pageY !== undefined) {
            // MouseEvent or JQuery.MouseEventBase without instanceof checking.
            xClick = (e as MouseEvent).pageX;
            yClick = (e as MouseEvent).pageY;
        } else if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) {
            const touch1 = (e as TouchEvent).touches[0];
            xClick
                = touch1.clientX
                + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            yClick
                = touch1.clientY
                + document.body.scrollTop
                + document.documentElement.scrollTop;
        } else {
            // older MouseEvent such as IE 8 -- unknown support in Firefox
            xClick
                = (e as MouseEvent).clientX
                + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            yClick
                = (e as MouseEvent).clientY
                + document.body.scrollTop
                + document.documentElement.scrollTop;
        }
        const xPx = xClick - offset.left;
        const yPx = yClick - offset.top;
        return [xPx, yPx];
    }

    /**
     * return a list of [scaledX, scaledY] for
     * a svg element.
     *
     * xScaled refers to 1/scaleFactor.x -- for instance, scaleFactor.x = 0.7 (default)
     * x of 1 gives 1.42857...
     *
     */
    getScaledXYforDOM(
        svg: HTMLElement|SVGElement|JQuery,
        e: MouseEvent|TouchEvent|JQuery.MouseEventBase
    ): [number, number] {
        const [xPx, yPx] = this.getUnscaledXYforDOM(svg, e);
        const pixelScaling = this.renderOptions.scaleFactor;

        const yPxScaled = yPx / pixelScaling.y;
        const xPxScaled = xPx / pixelScaling.x;
        return [xPxScaled, yPxScaled];
    }

    /**
     *
     * Given a Y position find the diatonicNoteNum that a note at that position would have.
     *
     * searches this.storedVexflowStave
     *
     * Y position must be offset from the start of the stave...
     */
    diatonicNoteNumFromScaledY(yPxScaled: number): number {
        const storedVexflowStave = this.recursiveGetStoredVexflowStave();
        if (storedVexflowStave === undefined) {
            throw new StreamException('Could not find vexflowStave for getting size');
        }

        // for (var i = -10; i < 10; i++) {
        //    console.log('line: ' + i + ' y: ' + storedVexflowStave.getYForLine(i));
        // }
        const thisClef = this.clef || this.getContextByClass('Clef');

        // TODO: on music21p percussion clef defines no lowest line, but does in music21j...
        const lowestLine: number = (thisClef !== undefined) ? thisClef.lowestLine : 31;

        const lineSpacing: number = storedVexflowStave.options.spacing_between_lines_px;
        const linesAboveStaff: number = storedVexflowStave.options.space_above_staff_ln;

        const notesFromTop = yPxScaled * 2 / lineSpacing;
        const notesAboveLowestLine
            = (storedVexflowStave.options.num_lines - 1 + linesAboveStaff) * 2
            - notesFromTop;
        const clickedDiatonicNoteNum = lowestLine + Math.round(notesAboveLowestLine);
        return clickedDiatonicNoteNum;
    }

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
    getStreamFromScaledXandSystemIndex(xPxScaled, systemIndex=0) {
        return this;
    }

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
    noteElementFromScaledX(
        xPxScaled: number,
        allowablePixels: number = 10,
        systemIndex?: number,
        options={},
    ): note.GeneralNote {
        const params = {
            allowBackup: true,
            backupMaximum: 70,
        };
        common.merge(params, options);
        let foundNote: note.GeneralNote;
        const subStream = this.getStreamFromScaledXandSystemIndex(
            xPxScaled,
            systemIndex
        );
        if (subStream === undefined) {
            return undefined;
        }
        const backup = {
            minDistanceSoFar: params.backupMaximum,
            note: undefined,
        }; // a backup in case we did not find within allowablePixels

        for (const el of subStream.flat.notesAndRests) {
            const n = el as any; // for missing x and width
            /* should also
             * compensate for accidentals...
             */
            const leftDistance = Math.abs(n.x - xPxScaled);
            const rightDistance = Math.abs(n.x + n.width - xPxScaled);
            const minDistance = Math.min(leftDistance, rightDistance);

            if (
                leftDistance < allowablePixels
                && rightDistance < allowablePixels
            ) {
                foundNote = n;
                break; /* O(n); can be made O(log n) */
            } else if (
                leftDistance < params.backupMaximum
                && rightDistance < params.backupMaximum
                && minDistance < backup.minDistanceSoFar
            ) {
                backup.note = n;
                backup.minDistanceSoFar = minDistance;
            }
        }
        // console.log('note here is: ', foundNote);
        if (params.allowBackup && foundNote === undefined) {
            foundNote = backup.note;
            // console.log('used backup: closest was: ', backup.minDistanceSoFar);
        }
        // console.log(foundNote);
        return foundNote;
    }

    /**
     * Given an event object, and an x and y location, returns a two-element array
     * of the pitch.Pitch.diatonicNoteNum that was clicked (i.e., if C4 was clicked this
     * will return 29; if D4 was clicked this will return 30) and the closest note in the
     * stream that was clicked.
     *
     * Return a list of [diatonicNoteNum, closestXNote]
     * for an event (e) called on the svg (svg)
     */
    findNoteForClick(
        svg?: HTMLElement|SVGElement|JQuery,
        e?: MouseEvent|TouchEvent|JQuery.MouseEventBase,
        x?: number,
        y?: number,
    ): [number, note.GeneralNote] {
        // this is Stream.findNoteForClick.
        if (x === undefined || y === undefined) {
            [x, y] = this.getScaledXYforDOM(svg, e);
        }
        const clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(y);
        const foundNote = this.noteElementFromScaledX(x);
        return [clickedDiatonicNoteNum, foundNote];
    }

    /**
     * Change the pitch of a note given that it has been clicked and then
     * call changedCallbackFunction and return it
     */
    noteChanged(
        clickedDiatonicNoteNum: number,
        foundNote: note.Note,
        svg: SVGElement|HTMLElement
    ): any {
        const n = foundNote;
        const p = new pitch.Pitch('C');
        p.diatonicNoteNum = clickedDiatonicNoteNum;
        p.accidental = n.pitch.accidental;
        n.pitch = p;
        n.stemDirection = undefined;
        this.activeNote = n;
        const $newSvg = this.redrawDOM(svg);
        const params = { foundNote: n, svg: $newSvg };
        if (this.changedCallbackFunction !== undefined) {
            return this.changedCallbackFunction(params);
        } else {
            return params;
        }
    }

    /**
     * Redraws an svgDiv, keeping the events of the previous svg.
     */
    redrawDOM(svg: JQuery|HTMLElement|SVGElement): JQuery {
        // this.resetRenderOptions(true, true); // recursive, preserveEvents
        if (!this.isFlat) {
            this.setSubstreamRenderOptions();
        }
        const $svg = $(svg); // works even if svg is already $jquery
        const $newSvg = this.createNewDOM($svg.width(), $svg.height());
        this.renderVexflow($newSvg);
        $svg.replaceWith($newSvg);
        return $newSvg;
    }

    /**
     * Renders a stream on svg with the ability to edit it and
     * a toolbar that allows the accidentals to be edited.
     */
    editableAccidentalDOM(
        width?: number,
        height?: number,
        {
            minAccidental=-1,
            maxAccidental=1,
        }: {minAccidental?: number, maxAccidental?: number} = {}
    ): JQuery<HTMLDivElement> {
        /*
         * Create an editable svg with an accidental selection bar.
         */
        const $d = $('<div/>')
            .css('text-align', 'left')
            .css('position', 'relative') as JQuery<HTMLDivElement>;

        this.renderOptions.events.click = this.DOMChangerFunction;
        if (this.changedCallbackFunction === undefined) {
            this.changedCallbackFunction = this.DOMChangerFunction;
        }
        const $svgDiv = this.createDOM(width, height);
        const $buttonDiv: JQuery<HTMLDivElement> = this.getAccidentalToolbar(
            minAccidental,
            maxAccidental,
            $svgDiv
        );
        $d.append($buttonDiv);
        $d.append($("<br style='clear: both;' />"));
        $d.append($svgDiv);
        return $d;
    }

    /*
     * SVG toolbars...
     */

    /**
     * Returns an accidental toolbar from minAccidental to maxAccidental.
     *
     * If $siblingSvg is defined then this toolbar alters the notes in that
     * toolbar.
     */
    getAccidentalToolbar(
        minAccidental: number = -1,
        maxAccidental: number = 1,
        $siblingSvg?: JQuery
    ): JQuery<HTMLDivElement> {
        minAccidental = Math.round(minAccidental);
        maxAccidental = Math.round(maxAccidental);

        const addAccidental = (newAlter, clickEvent) => {
            /*
             * To be called on a button...
             */
            let $useSvg = $siblingSvg;
            if ($useSvg === undefined) {
                let $searchParent = $(clickEvent.target).parent();
                let maxSearch = 99;
                while (
                    maxSearch > 0
                    && $searchParent !== undefined
                    && ($useSvg === undefined || $useSvg[0] === undefined)
                ) {
                    maxSearch -= 1;
                    $useSvg = $searchParent.find('.streamHolding');
                    $searchParent = $searchParent.parent();
                }
                if ($useSvg[0] === undefined) {
                    console.log('Could not find a svg...');
                    return;
                }
            }
            if (this.activeNote !== undefined && this.activeNote instanceof note.Note) {
                const n = this.activeNote;
                n.pitch.accidental = new pitch.Accidental(newAlter);
                /* console.log(n.pitch.name); */
                const $newSvg = this.redrawDOM($useSvg[0]);
                if (this.changedCallbackFunction !== undefined) {
                    this.changedCallbackFunction({
                        foundNote: n,
                        svg: $newSvg,
                    });
                }
            }
        };

        const $buttonDiv = $('<div/>').attr(
            'class',
            'accidentalToolbar scoreToolbar'
        ) as JQuery<HTMLDivElement>;
        for (let i = minAccidental; i <= maxAccidental; i++) {
            const svg_acc = svg_accidentals.get(i).cloneNode(true);
            const $button = $(
                '<button style="width: 40px; height: 40px;"></button>'
            ).on('click', e => addAccidental(i, e));
            $button[0].appendChild(svg_acc);
            $buttonDiv.append($button);
        }
        return $buttonDiv;
    }

    /**
     * get a JQuery div containing two buttons -- play and stop
     */
    getPlayToolbar(): JQuery<HTMLDivElement> {
        const $buttonDiv = $('<div/>').attr(
            'class',
            'playToolbar scoreToolbar'
        ) as JQuery<HTMLDivElement>;
        const $bPlay = $('<button>&#9658</button>');
        $bPlay.on('click', () => {
            this.playStream();
        });
        $buttonDiv.append($bPlay);
        const $bStop = $('<button>&#9724</button>');
        $bStop.on('click', () => {
            this.stopPlayStream();
        });
        $buttonDiv.append($bStop);
        return $buttonDiv;
    }
    //  reflow

    /**
     * Begins a series of bound events to the window that makes it
     * so that on resizing the stream is redrawn and reflowed to the
     * new size.
     *bt
     */
    windowReflowStart($jSvg: JQuery): this {
        // set up a bunch of windowReflow bindings that affect the svg.
        let $jSvgNow = $jSvg;
        const resizeEnd = () => {
            // do something, window hasn't changed size in 500ms
            const $jSvgParent = $jSvgNow.parent();
            const newWidth = $jSvgParent.width();
            const svgWidth = newWidth;
            // console.log(svgWidth);
            console.log('resizeEnd triggered', newWidth);
            // console.log(callingStream.renderOptions.events.click);
            this.resetRenderOptions(true, true); // recursive, preserveEvents
            // console.log(callingStream.renderOptions.events.click);
            this.maxSystemWidth = svgWidth - 40;
            $jSvgNow.remove();
            const svgObj = this.appendNewDOM($jSvgParent);
            $jSvgNow = $(svgObj);
        };
        let resizeTimeout: number = 0;

        $(window).on('resize', () => {
            if (resizeTimeout) {
                window.clearTimeout(resizeTimeout);
            }
            resizeTimeout = window.setTimeout(() => resizeEnd(), 200);
        });
        setTimeout(() => {
            const $window = $(window);
            const doResize = $window.data('triggerResizeOnCreateSvg');
            if (doResize === undefined || doResize === true) {
                resizeEnd();
                $window.data('triggerResizeOnCreateSvg', false);
            }
        }, 1000);
        return this;
    }

    /**
     * Does this stream have a {@link Voice} inside it?
     */
    hasVoices(): boolean {
        for (const el of this) {
            if (el.isClassOrSubclass('Voice')) {
                return true;
            }
        }
        return false;
    }
}



export class Voice extends Stream {
    static get className() { return 'music21.stream.Voice'; }

    constructor() {
        super();
        this.recursionType = 'elementsFirst';
    }
}

export class Measure extends Stream {
    static get className() { return 'music21.stream.Measure'; }

    recursionType: string = 'elementsFirst';
    isMeasure: boolean = true;
    number: number = 0;
    numberSuffix: string = '';
    paddingLeft: number = 0;
    paddingRight: number = 0;

    stringInfo(): string {
        // avoid using 'this.offset' to not infinite loops.
        const offset = this._activeSiteStoredOffset ?? this._naiveOffset;
        return this.measureNumberWithSuffix() + ' offset=' + offset.toString();
    }

    measureNumberWithSuffix(): string {
        return this.number.toString() + this.numberSuffix;
    }
}

/**
 * Part -- specialized to handle Measures inside it
 */
export class Part extends Stream {
    static get className() { return 'music21.stream.Part'; }

    recursionType: string = 'flatten';

    // constructor() {
    //     super();
    // }

    /**
     * How many systems does this Part have?
     *
     * Does not change any reflow information, so by default it's always 1.
     */
    numSystems(): number {
        let numSystems = 1;
        const subStreams = this.getElementsByClass('Stream') as iterator.StreamIterator<Stream>;
        for (let i = 1; i < subStreams.length; i++) {
            if (subStreams.get(i).renderOptions.startNewSystem) {
                numSystems += 1;
            }
        }
        return numSystems;
    }

    /**
     * Find the width of every measure in the Part.
     */
    getMeasureWidths(): number[] {
        /* call after setSubstreamRenderOptions */
        const measureWidths: number[] = [];
        for (const el of this.getElementsByClass('Measure')) {
            const elRendOp = (el as Measure).renderOptions;
            measureWidths[elRendOp.measureIndex] = elRendOp.width;
        }
        return measureWidths;
    }

    /**
     * Overrides the default music21.stream.Stream#estimateStaffLength
     */
    estimateStaffLength(): number {
        if (this.renderOptions.overriddenWidth !== undefined) {
            // console.log('Overridden staff width: ' + this.renderOptions.overriddenWidth);
            return this.renderOptions.overriddenWidth;
        }
        if (!this.isFlat) {
            // part with Measures underneath
            let totalLength = 0;
            let isFirst = true;
            for (const el of this.getElementsByClass('Measure')) {
                const m = el as Measure;
                // this looks wrong, but actually seems to be right. moving it to
                // after the break breaks things.
                totalLength
                    += m.estimateStaffLength() + m.renderOptions.staffPadding;
                if (!isFirst && m.renderOptions.startNewSystem === true) {
                    break;
                }
                isFirst = false;
            }
            return totalLength;
        }
        // no measures found in part... treat as measure
        const tempM = new Measure();
        tempM.elements = <Stream> this;
        return tempM.estimateStaffLength();
    }

    /**
     * Calculate system breaks and update measure widths as necessary on
     * account of the reiteration of clefs and key signatures on subsequent systems.
     */
    systemWidthsAndBreaks({setMeasureWidths=true}: {setMeasureWidths?: boolean} = {}): [number[], number[]] {
        const maxSystemWidth = this.maxSystemWidth;
        const systemCurrentWidths: number[] = [];
        const systemBreakIndexes: number[] = [];
        let lastSystemBreak = 0; /* needed to ensure each line has at least one measure */
        // add this padding to each system: it might be needed for a brace
        const firstMeasurePadding = 20; /* TODO: make it obtained elsewhere */

        let currentSystemIndex = 0;
        let currentLeft = firstMeasurePadding;
        for (const [i, m] of Array.from(this.measures).entries()) {
            if (i === 0) {
                m.renderOptions.startNewSystem = true;
                m.renderOptions.displayClef = true;
                m.renderOptions.displayKeySignature = true;
                if (setMeasureWidths) {
                    m.renderOptions.width = Math.min(m.renderOptions.width, maxSystemWidth);
                }
            }
            const currentRight = currentLeft + m.renderOptions.width;
            /* console.log('left: ' + currentLeft + ' ; right: ' + currentRight + ' ; m: ' + i); */
            if (currentRight > maxSystemWidth && lastSystemBreak !== i) {
                /* first measure of new System */
                systemBreakIndexes.push(i - 1);
                systemCurrentWidths.push(currentLeft);
                lastSystemBreak = i;
                currentSystemIndex += 1;

                m.renderOptions.displayClef = true;
                m.renderOptions.displayKeySignature = true;
                m.renderOptions.startNewSystem = true;
                m.renderOptions.left = firstMeasurePadding;
                if (setMeasureWidths) {
                    const estimated_width = m.estimateStaffLength() + m.renderOptions.staffPadding;
                    m.renderOptions.width = Math.min(estimated_width, maxSystemWidth);
                }
            } else if (i !== 0) {
                m.renderOptions.startNewSystem = false;
                m.renderOptions.displayClef = false; // check for changed clef first?
                m.renderOptions.displayKeySignature = false; // check for changed KS first?
                m.renderOptions.left = currentLeft;
                if (setMeasureWidths) {
                    m.renderOptions.width = m.estimateStaffLength() + m.renderOptions.staffPadding;
                }
            }
            currentLeft = m.renderOptions.left + m.renderOptions.width;
            m.renderOptions.systemIndex = currentSystemIndex;
        }
        return [systemCurrentWidths, systemBreakIndexes];
    }

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
    fixSystemInformation({
        systemHeight = undefined,
        systemPadding = undefined,
        setMeasureRenderOptions = true,
    }: {
        systemHeight?: number,
        systemPadding?: number,
        setMeasureRenderOptions?: boolean,
    } = {}): number[] {
        // this is a method on Part!
        if (systemHeight === undefined) {
            /* part.show() called... */
            systemHeight = this.renderOptions.staffAreaHeight;
        } else if (debug) {
            console.log('overridden systemHeight: ' + systemHeight);
        }
        let systemCurrentWidths = [];
        let systemBreakIndexes = [];
        if (setMeasureRenderOptions) {
            [systemCurrentWidths, systemBreakIndexes] = this.systemWidthsAndBreaks();
        }
        else {
            // read from measure render options
            let lastSystemIndex = 0;
            let workingSystemWidth = 0;
            const measure_iter = this.getElementsByClass('Measure') as iterator.StreamIterator<Measure>;
            for (const [i, m] of Array.from(measure_iter).entries()) {
                if (m.renderOptions.systemIndex === lastSystemIndex) {
                    workingSystemWidth += m.renderOptions.width;
                } else {
                    systemCurrentWidths.push(workingSystemWidth);
                    systemBreakIndexes.push(i - 1);
                    workingSystemWidth = m.renderOptions.width;
                }
                lastSystemIndex = m.renderOptions.systemIndex;
            }
        }
        if (systemPadding === undefined) {
            systemPadding = this.renderOptions.systemPadding;
        }
        // last system is not contained in systemCurrentWidths
        // possible, but unlikely that the last system would be the
        // longest and thus left out of the calculation
        const maxSystemWidth = Math.max(...systemCurrentWidths);

        let currentSystemIndex = 0;

        const measure_iter = this.getElementsByClass('Measure') as iterator.StreamIterator<Measure>;
        for (const [i, m] of Array.from(measure_iter).entries()) {
            // values of systemBreakIndices are the measure indices
            // corresponding to the last measure on a system
            // here, looking for first measure of new system
            if (systemBreakIndexes && (i - 1) === systemBreakIndexes[0]) {
                systemBreakIndexes.shift();
                currentSystemIndex += 1;
            }
            let currentSystemMultiplier: number;
            if (currentSystemIndex >= systemCurrentWidths.length) {
                /* last system... non-justified */
                currentSystemMultiplier = 1;
            } else {
                const currentSystemWidth = systemCurrentWidths[currentSystemIndex];
                currentSystemMultiplier = maxSystemWidth / currentSystemWidth;
            }
            m.renderOptions.left = Math.floor(m.renderOptions.left * currentSystemMultiplier);
            m.renderOptions.width = Math.floor(m.renderOptions.width * currentSystemMultiplier);
            m.renderOptions.top += currentSystemIndex * (systemHeight + systemPadding);
        }
        return systemCurrentWidths;
    }

    /**
     * overrides music21.stream.Stream#setSubstreamRenderOptions
     *
     * figures out the `.left` and `.top` attributes for all contained measures
     *
     */
    setSubstreamRenderOptions() {
        let currentMeasureIndex = 0; /* 0 indexed for now */
        let currentMeasureLeft = 20;
        const rendOp = this.renderOptions;
        let lastTimeSignature: meter.TimeSignature;
        let lastKeySignature: KeySignature;
        let lastClef: clef.Clef;

        for (const el of this.getElementsByClass('Measure')) {
            const m = el as Measure;
            const mRendOp = m.renderOptions;
            mRendOp.measureIndex = currentMeasureIndex;
            mRendOp.top = rendOp.top;
            mRendOp.partIndex = rendOp.partIndex;
            mRendOp.left = currentMeasureLeft;

            if (currentMeasureIndex === 0) {
                lastClef = m._clef;
                lastTimeSignature = m._timeSignature;
                lastKeySignature = m._keySignature;

                mRendOp.displayClef = true;
                mRendOp.displayKeySignature = true;
                mRendOp.displayTimeSignature = true;
            } else {
                // noinspection JSUnusedAssignment
                if (
                    m._clef !== undefined
                    && lastClef !== undefined
                    && m._clef.name !== lastClef.name
                ) {
                    // noinspection JSUnusedAssignment
                    console.log(
                        'changing clefs for ',
                        mRendOp.measureIndex,
                        ' from ',
                        lastClef.name,
                        ' to ',
                        m._clef.name
                    );
                    lastClef = m._clef;
                    mRendOp.displayClef = true;
                } else {
                    mRendOp.displayClef = false;
                }

                // noinspection JSUnusedAssignment
                if (
                    m._keySignature !== undefined
                    && lastKeySignature !== undefined
                    && m._keySignature.sharps !== lastKeySignature.sharps
                ) {
                    lastKeySignature = m._keySignature;
                    mRendOp.displayKeySignature = true;
                } else {
                    mRendOp.displayKeySignature = false;
                }

                // noinspection JSUnusedAssignment
                if (
                    m._timeSignature !== undefined
                    && lastTimeSignature !== undefined
                    && m._timeSignature.ratioString
                        !== lastTimeSignature.ratioString
                ) {
                    lastTimeSignature = m._timeSignature;
                    mRendOp.displayTimeSignature = true;
                } else {
                    mRendOp.displayTimeSignature = false;
                }
            }
            mRendOp.width
                = m.estimateStaffLength() + mRendOp.staffPadding;
            mRendOp.height = m.estimateStreamHeight();
            currentMeasureLeft += mRendOp.width;
            currentMeasureIndex += 1;
        }
        return this;
    }

    /**
     * systemIndexAndScaledY - given a scaled Y, return the systemIndex
     * and the scaledYRelativeToSystem
     *
     * @param  {number} y the scaled Y
     * @return {number[]}  systemIndex, scaledYRelativeToSystem
     */
    systemIndexAndScaledY(y) {
        // this is Part.systemIndexAndScaledY
        const systemHeight = this.renderOptions.staffAreaHeight;
        const systemPadding = this.renderOptions.systemPadding;
        const systemIndex = Math.floor(y / (systemHeight + systemPadding));
        const scaledYRelativeToSystem
            = y - systemIndex * (systemHeight + systemPadding);
        return [systemIndex, scaledYRelativeToSystem];
    }

    /**
     * Overrides the default music21.stream.Stream#findNoteForClick
     * by taking into account systems
     *
     * @returns {Array} [clickedDiatonicNoteNum, foundNote]
     */
    findNoteForClick(
        svg?: HTMLElement|SVGElement,
        e?: MouseEvent|TouchEvent|JQuery.MouseEventBase,
        x?: number,
        y?: number,
    ): [number, note.GeneralNote] {
        // this is Part.FindNoteForClick
        if (x === undefined || y === undefined) {
            [x, y] = this.getScaledXYforDOM(svg, e);
        }
        // debug = true;
        if (debug && svg !== undefined) {
            console.log(
                'this.estimateStreamHeight(): '
                    + this.estimateStreamHeight()
                    + ' / $(svg).height(): '
                    + $(svg).height()
            );
        }
        // TODO(msc) -- systemPadding was never used -- should it be?
        // let systemPadding = this.renderOptions.systemPadding;
        const [systemIndex, scaledYRelativeToSystem] = this.systemIndexAndScaledY(y);
        const clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(
            scaledYRelativeToSystem
        );

        const foundNote = this.noteElementFromScaledX(
            x,
            undefined,
            systemIndex
        );
        return [clickedDiatonicNoteNum, foundNote];
    }

    /**
     * Returns the measure that is at X location xPxScaled and system systemIndex.
     *
     * @param {number} [xPxScaled]
     * @param {number} [systemIndex]
     * @returns {Stream}
     *
     */
    getStreamFromScaledXandSystemIndex(xPxScaled, systemIndex=undefined) {
        let gotMeasure;
        const measures = this.measures;
        for (const m of measures) {
            const rendOp = m.renderOptions;
            const left = rendOp.left;
            const right = left + rendOp.width;
            const top = rendOp.top;
            const bottom = top + rendOp.height;
            if (debug) {
                console.log(
                    'Searching for X:'
                        + Math.round(xPxScaled)
                        + ' in Measure '
                        + ' with boundaries L:'
                        + left
                        + ' R:'
                        + right
                        + ' T: '
                        + top
                        + ' B: '
                        + bottom
                );
            }
            if (xPxScaled >= left && xPxScaled <= right) {
                if (systemIndex === undefined) {
                    gotMeasure = m;
                    break;
                } else if (rendOp.systemIndex === systemIndex) {
                    gotMeasure = m;
                    break;
                }
            }
        }
        return gotMeasure;
    }
}

/**
 * Scores with multiple parts
 */
export class Score extends Stream {
    static get className() { return 'music21.stream.Score'; }

    recursionType = 'elementsOnly';
    measureWidths: number[] = [];

    constructor() {
        super();
        this.renderOptions.systemPadding = 40;
    }

    get clef() { // TODO: remove -- this is unlike m21p
        const c = super.clef;
        if (c === undefined) {
            return new clef.TrebleClef();
        } else {
            return c;
        }
    }

    set clef(newClef) {
        super.clef = newClef;
    }

    /**
     * Override main stream makeBeams to call on each part.
     */
    makeBeams({ inPlace=false, setStemDirections=true }: makeNotation.MakeBeamsOptions = {}) {
        let returnObj = this;
        if (!inPlace) {
            returnObj = this.clone(true);
        }
        for (const p of returnObj.parts) {
            p.makeBeams({inPlace: true, setStemDirections});
        }
        // returnObj.streamStatus.beams = true;
        return returnObj;
    }

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
    getStreamFromScaledXandSystemIndex(
        xPxScaled,
        systemIndex: number = undefined
    ) {
        const parts = this.parts;
        return parts
            .get(0)
            .getStreamFromScaledXandSystemIndex(xPxScaled, systemIndex);
    }

    /**
     * overrides music21.stream.Stream#setSubstreamRenderOptions
     *
     * figures out the `.left` and `.top` attributes for all contained parts
     */
    setSubstreamRenderOptions() {
        let currentPartNumber = 0;
        let currentPartTop = 0;
        // was this.partSpacing.
        const partSpacing = this.renderOptions.staffAreaHeight;
        for (const p of this.parts) {
            p.renderOptions.partIndex = currentPartNumber;
            p.renderOptions.top = currentPartTop;
            p.setSubstreamRenderOptions();
            currentPartTop += partSpacing;
            currentPartNumber += 1;
        }
        this.evenPartMeasureSpacing();
        const currentScoreHeight = this.estimateStreamHeight(
            {
                ignoreSystems: true,
                ignoreMarginBottom: true,
            }
        );
        for (const p of this.parts) {
            // return value is not used
            // this is done merely to set preliminary measure widths
            p.systemWidthsAndBreaks();
        }
        // synchronize measure widths across all parts
        const measureWidths = this.getMaxMeasureWidths();
        for (const p of this.parts) {
            for (let i = 0; i < measureWidths.length; i++) {
                p.measures.get(i).renderOptions.width = measureWidths[i];
            }
            // refresh system breaks again, and update lefts, but don't update widths
            p.systemWidthsAndBreaks({setMeasureWidths: false});
        }
        for (const p of this.parts) {
            // fix system info, but no need to recalculate measure widths
            // which would undo what we just did
            p.fixSystemInformation({
                systemHeight: currentScoreHeight,
                systemPadding: this.renderOptions.systemPadding,
                setMeasureRenderOptions: false,
            });
        }
        this.renderOptions.height = this.estimateStreamHeight();
        return this;
    }

    /**
     * Overrides the default music21.stream.Stream#estimateStaffLength
     *
     * @returns {number}
     */
    estimateStaffLength() {
        // override
        if (this.renderOptions.overriddenWidth !== undefined) {
            // console.log('Overridden staff width: ' + this.renderOptions.overriddenWidth);
            return this.renderOptions.overriddenWidth;
        }
        let maxWidth = -1;
        for (const p of this.parts) {
            const pWidth = p.estimateStaffLength();
            if (pWidth > maxWidth) {
                maxWidth = pWidth;
            }
        }
        if (maxWidth > -1) {
            return maxWidth;
        }

        // no parts found in score... use part...
        console.log('no parts found in score');
        const tempPart = new Part();
        tempPart.elements = <Stream> this;
        return tempPart.estimateStaffLength();
    }

    /* MIDI override */
    /**
     * Overrides the default music21.stream.Stream#playStream
     *
     * Works poorly -- just starts *n* midi players.
     *
     * Render scrollable score works better...
     *
     * @param {Object} params -- passed to each part
     */
    playStream(params): this {
        // play multiple parts in parallel...
        for (const el of this) {
            if (el.isClassOrSubclass('Part')) {
                (el as Part).playStream(params);
            }
        }
        return this;
    }

    /**
     * Overrides the default music21.stream.Stream#stopPlayScore()
     */
    stopPlayStream(): this {
        for (const el of this) {
            if (el.isClassOrSubclass('Part')) {
                (el as Part).stopPlayStream();
            }
        }
        return this;
    }

    /*
     * Svg routines
     */
    /**
     * call after setSubstreamRenderOptions
     * gets the maximum measure width for each measure
     * by getting the maximum for each measure of
     * Part.getMeasureWidths();
     *
     * @returns Array<number>
     */
    getMaxMeasureWidths() {
        const maxMeasureWidths = [];
        const measureWidthsArrayOfArrays = [];
        let i;
        // TODO: Do not crash on not partlike...
        for (const p of this.parts) {
            measureWidthsArrayOfArrays.push(p.getMeasureWidths());
        }
        for (i = 0; i < measureWidthsArrayOfArrays[0].length; i++) {
            let maxFound = 0;
            for (let j = 0; j < this.parts.length; j++) {
                if (measureWidthsArrayOfArrays[j][i] > maxFound) {
                    maxFound = measureWidthsArrayOfArrays[j][i];
                }
            }
            maxMeasureWidths.push(maxFound);
        }
        // console.log(measureWidths);
        return maxMeasureWidths;
    }

    /**
     * systemIndexAndScaledY - given a scaled Y, return the systemIndex
     * and the scaledYRelativeToSystem
     *
     * @param  {number} y the scaled Y
     * @return Array<number>   systemIndex, scaledYRelativeToSystem
     */
    systemIndexAndScaledY(y) {
        // this is Score.systemIndexAndScaledY
        const numParts = this.parts.length;
        const staffHeight = this.renderOptions.staffAreaHeight;
        const numSystems = this.numSystems();
        let endOfLastSystem = 0;
        for (let tryIndex = 0; tryIndex < numSystems; tryIndex++) {
            const endOfThisSystem = endOfLastSystem + (numParts * staffHeight) + this.renderOptions.systemPadding;
            if (y > endOfThisSystem && tryIndex !== numSystems - 1) {
                endOfLastSystem = endOfThisSystem;
                continue;
            }
            const scaledYRelativeToSystem = y - endOfLastSystem;
            return [tryIndex, scaledYRelativeToSystem];
        }
        console.error('Should not get here!');
        return [0, 0];
    }

    /**
     * Score object
     *
     * Returns a list of [clickedDiatonicNoteNum, foundNote] for a
     * click or other mouse event, taking into account that the note will be in different
     * Part objects (and different Systems) given the height and possibly different Systems.
     *
     * returns [diatonicNoteNum, m21Element]
     */
    findNoteForClick(
        svg?: HTMLElement|SVGElement,
        e?: MouseEvent|TouchEvent|JQuery.MouseEventBase,
        x?: number,
        y?: number,
    ): [number, note.GeneralNote] {
        // this is Score.findNoteForClick()
        if (x === undefined || y === undefined) {
            [x, y] = this.getScaledXYforDOM(svg, e);
        }

        // defaults to 120 and includes ledger line area
        const staffHeight = this.renderOptions.staffAreaHeight;
        const [systemIndex, scaledYFromSystemTop] = this.systemIndexAndScaledY(y);
        let partIndex = Math.floor(scaledYFromSystemTop / staffHeight);
        // console.log('systemIndex: ' + systemIndex + ' partIndex: ' + partIndex);
        let rightPart = this.parts.get(partIndex);
        if (rightPart === undefined) {
            partIndex = this.parts.length - 1;  // may be too low?
            rightPart = this.parts.get(partIndex);
            if (rightPart === undefined) {
                // degenerate Score with no Part objects
                return [undefined, undefined];
            }
        }
        const scaledYinPart = scaledYFromSystemTop - partIndex * staffHeight;

        const clickedDiatonicNoteNum = rightPart.diatonicNoteNumFromScaledY(scaledYinPart);

        // console.log(rightPart, systemIndex, x);
        const foundNote = rightPart.noteElementFromScaledX(
            x,
            undefined,
            systemIndex
        );
        return [clickedDiatonicNoteNum, foundNote];
    }

    /**
     * How many systems are there? Calls numSystems() on the first part.
     */
    numSystems(): number {
        const pIter = (this.getElementsByClass('Part') as iterator.StreamIterator<Part>);
        if (!(pIter.length)) {
            return 1;
        }
        return pIter.get(0).numSystems();
    }

    /**
     * Makes the width of every Measure object within a measure stack be the same.
     * if setLeft is true then also set the renderOptions.left
     *
     * This does not even out systems.
     *
     * @param {Object} options
     * @param {boolean} [options.setLeft=true]
     */
    evenPartMeasureSpacing({ setLeft=true }={}): this {
        const measureStacks: number[][] = [];
        let currentPartNumber = 0;
        const maxMeasureWidth: number[] = []; // the maximum measure width among all parts
        for (const p of this.parts) {
            const measureWidths = (p as Part).getMeasureWidths();
            for (let j = 0; j < measureWidths.length; j++) {
                const thisMeasureWidth = measureWidths[j];
                if (measureStacks[j] === undefined) {
                    measureStacks[j] = [];
                    maxMeasureWidth[j] = thisMeasureWidth;
                } else if (thisMeasureWidth > maxMeasureWidth[j]) {
                    maxMeasureWidth[j] = thisMeasureWidth;
                }
                measureStacks[j][currentPartNumber] = thisMeasureWidth;
            }
            currentPartNumber += 1;
        }

        let currentLeft = 20; // TODO: do not hardcode left start.
        for (let i = 0; i < maxMeasureWidth.length; i++) {
            const measureNewWidth = maxMeasureWidth[i];
            for (const part of this.parts) {
                const measure = part.getElementsByClass('Measure').get(i) as Measure;
                const rendOp = measure.renderOptions;
                rendOp.width = measureNewWidth;
                if (setLeft) {
                    rendOp.left = currentLeft;
                }
            }
            currentLeft += measureNewWidth;
        }
        return this;
    }
}

// TODO(msc) -- Opus

// small Class; a namedtuple in music21p
export class OffsetMap {
    element: base.Music21Object;
    offset: number;
    endTime: number;
    voiceIndex: number;

    constructor(
        element: base.Music21Object,
        offset: number,
        endTime: number,
        voiceIndex: number
    ) {
        this.element = element;
        this.offset = offset;
        this.endTime = endTime;
        this.voiceIndex = voiceIndex;
    }
}
