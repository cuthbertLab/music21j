/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/stream -- Streams -- objects that hold other Music21Objects
 *
 * Does not implement the full features of music21p Streams by a long shot...
 *
 * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006-19, Michael Scott Cuthbert
 *     and cuthbertLab
 *
 * powerful stream module, See {@link music21.stream} namespace
 * @exports music21/stream
 *
 * Streams are powerful music21 objects that hold Music21Object collections,
 * such as {@link music21.note.Note} or {@link music21.chord.Chord} objects.
 *
 * Understanding the {@link Stream} object is of fundamental
 * importance for using music21.  Definitely read the music21(python) tutorial
 * on using Streams before proceeding
 *
 * @namespace music21.stream
 * @memberof music21
 * @requires music21/base
 * @requires music21/renderOptions
 * @requires music21/clef
 * @requires music21/vfShow
 * @requires music21/duration
 * @requires music21/common
 * @requires music21/meter
 * @requires music21/pitch
 * @requires jQuery
 *
 */
import * as $ from 'jquery';
import * as MIDI from 'midicube';
import Vex from 'vexflow';

import { Music21Exception } from './exceptions21';
import { debug } from './debug';

import * as base from './base';
import * as beam from './beam';
import * as clef from './clef';
import * as common from './common';
import { Duration } from './duration';
import * as instrument from './instrument';
import * as meter from './meter';
import * as note from './note';
import * as pitch from './pitch';
import * as renderOptions from './renderOptions';
import * as tempo from './tempo';
import * as vfShow from './vfShow';

// eslint-disable-next-line import/no-cycle
import { GeneralObjectExporter } from './musicxml/m21ToXml';

import * as filters from './stream/filters';
import * as iterator from './stream/iterator';
import {chord} from '../music21_modules';

export { filters };
export { iterator };

export class StreamException extends Music21Exception {}

declare interface Constructable<T> {
    new() : T;
}


function _exportMusicXMLAsText(s) {
    const gox = new GeneralObjectExporter(s);
    return gox.parse();
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
 *     only {@link music21.note.Note} and {@link music21.chord.Chord} objects included
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
    activeVFStave: Vex.Flow.Stave = undefined;
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
        (e: MouseEvent|Touch) => base.Music21Object|undefined;

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
            self,
            deep: boolean,
            memo
        ) {
            if (!deep) {
                newObj.renderOptions = self.renderOptions;
                return;
            }

            const newRenderOptions = JSON.parse(JSON.stringify(self.renderOptions));
            newRenderOptions.events = {...self.renderOptions.events};
            newObj.renderOptions = newRenderOptions;
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

        this.DOMChangerFunction = (e: MouseEvent) => {
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
        thisArg: any
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
        return this._getFlatOrSemiFlat(true);
    }

    get flat(): this {
        return this._getFlatOrSemiFlat(false);
    }

    _getFlatOrSemiFlat(retainContainers): this {
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

    get notes(): iterator.StreamIterator<note.GeneralNote> {
        return this.getElementsByClass(['Note', 'Chord']) as
            iterator.StreamIterator<note.GeneralNote>;
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
     *
     * @returns {Array<number|music21.tempo.MetronomeMark>}
     */
    _metronomeMarkBoundaries() {
        const mmBoundaries = [];
        const thisFlat = this.flat;
        const metronomeMarks = thisFlat.getElementsByClass('MetronomeMark');

        const highestTime = thisFlat.highestTime;
        const lowestOffset = 0;

        const mmDefault = new tempo.MetronomeMark({ number: 120 });

        if (!metronomeMarks.length) {
            mmBoundaries.push([lowestOffset, highestTime, mmDefault]);
        } else if (metronomeMarks.length === 1) {
            const metronomeMark = metronomeMarks.get(0);
            const offset = metronomeMark.getOffsetBySite(thisFlat);
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
     * Note that .instrument will never return a string, but Typescript requires
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

    get keySignature() {
        return this.getSpecialContext('keySignature', false);
    }

    set keySignature(newKeySignature) {
        const oldKS = this._firstElementContext('keySignature');
        if (oldKS !== undefined) {
            this.replace(oldKS, newKeySignature);
        } else {
            this.insert(0.0, newKeySignature);
        }
        this._keySignature = newKeySignature;
    }

    get timeSignature() {
        return this.getSpecialContext('timeSignature', false);
    }

    set timeSignature(newTimeSignature) {
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
    }={}) {
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
        if (shiftOffsets === true) {
            throw new StreamException('sorry cannot shiftOffsets yet');
        }
        if (recurse === true) {
            throw new StreamException('sorry cannot recurse yet');
        }

        let targetList: base.Music21Object[];
        if (!Array.isArray(targetOrList)) {
            targetList = [targetOrList];
        } else {
            targetList = targetOrList;
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
                        // do something
                    }
                    continue;
                }
                throw err;
            }

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
    makeMeasures(options) {
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
            m.clef = clefObj;
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

    containerInHierarchy(el, { setActiveSite=true }={}) {
        const elSites = el.sites;
        for (const s of this.recurse({
            skipSelf: false,
            streamsOnly: true,
            restoreActiveSites: false,
        })) {
            if (elSites.includes(s)) {
                if (setActiveSite) {
                    el.activeSite = s;
                }
                return s;
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
        this.makeAccidentals();
        return out;
    }


    /**
     * Return a new Stream or modify this stream
     * to have beams.
     *
     * Called from renderVexflow()
     */
    makeBeams({ inPlace=false }={}): this {
        let returnObj = this;
        if (!inPlace) {
            returnObj = this.clone(true);
        }
        let mColl;
        if (this.classes.includes('Measure')) {
            mColl = [returnObj];
        } else {
            mColl = [];
            for (const m of returnObj.getElementsByClass('Measure')) {
                mColl.push(m);
            }
        }
        let lastTimeSignature;
        for (const m of mColl) {
            if (m.timeSignature !== undefined) {
                lastTimeSignature = m.timeSignature;
            }
            if (lastTimeSignature === undefined) {
                throw new StreamException('Need a Time Signature to process beams');
            }
            // todo voices!
            if (m.length <= 1) {
                continue; // nothing to beam.
            }
            const noteStream = m.notesAndRests;
            const durList = [];
            for (const n of noteStream) {
                durList.push(n.duration);
            }
            const durSum = durList.map(a => a.quarterLength).reduce((total, val) => total + val);
            const barQL = lastTimeSignature.barDuration.quarterLength;
            if (durSum > barQL) {
                continue;
            }
            let offset = 0.0;
            if (m.paddingLeft !== 0.0 && m.paddingLeft !== undefined) {
                offset = m.paddingLeft;
            } else if (noteStream.highestTime < barQL) {
                offset = barQL - noteStream.highestTime;
            }
            const beamsList = lastTimeSignature.getBeams(noteStream, { measureStartOffset: offset });
            for (let i = 0; i < noteStream.length; i++) {
                const n = noteStream.get(i);
                const thisBeams = beamsList[i];
                if (thisBeams !== undefined) {
                    n.beams = thisBeams;
                } else {
                    n.beams = new beam.Beams();
                }
            }
        }

        // returnObj.streamStatus.beams = true;
        return returnObj;
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
     * Sets Pitch.accidental.displayStatus for every element with a
     * pitch or pitches in the stream. If a natural needs to be displayed
     * and the Pitch does not have an accidental object yet, adds one.
     *
     * Called automatically before appendDOM routines are called.
     *
     * @returns {this}
     */
    makeAccidentals() {
        // cheap version of music21p method
        const extendableStepList = {};
        const stepNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const ks = this.keySignature || this.getContextByClass('KeySignature');
        for (const stepName of stepNames) {
            let stepAlter = 0;
            if (ks !== undefined) {
                const tempAccidental = ks.accidentalByStep(
                    stepName
                );
                if (tempAccidental !== undefined) {
                    stepAlter = tempAccidental.alter;
                    // console.log(stepAlter + " " + stepName);
                }
            }
            extendableStepList[stepName] = stepAlter;
        }
        const lastOctaveStepList = [];
        for (let i = 0; i < 10; i++) {
            const tempOctaveStepDict = {...extendableStepList};  // clone
            lastOctaveStepList.push(tempOctaveStepDict);
        }
        const lastOctavelessStepDict = {...extendableStepList};  // probably unnecessary, but safe...

        for (const el of this) {
            if ((el as note.Note).pitch !== undefined) {
                // note
                const p = (el as note.Note).pitch;
                const lastStepDict = lastOctaveStepList[p.octave];
                this._makeAccidentalForOnePitch(
                    p,
                    lastStepDict,
                    lastOctavelessStepDict
                );
            } else if ((el as chord.Chord).notes !== undefined) {
                // chord
                for (const chordNote of (el as chord.Chord).notes) {
                    const p = chordNote.pitch;
                    const lastStepDict = lastOctaveStepList[p.octave];
                    this._makeAccidentalForOnePitch(
                        p,
                        lastStepDict,
                        lastOctavelessStepDict
                    );
                }
            }
        }
        return this;
    }

    //  returns pitch
    _makeAccidentalForOnePitch(p, lastStepDict, lastOctavelessStepDict) {
        if (lastStepDict === undefined) {
            // octave < 0 or > 10? -- error that appeared sometimes.
            lastStepDict = {};
        }
        let newAlter;
        if (p.accidental === undefined) {
            newAlter = 0;
        } else {
            newAlter = p.accidental.alter;
        }
        // console.log(p.name + " " + lastStepDict[p.step].toString());
        if (
            lastStepDict[p.step] !== newAlter
            || lastOctavelessStepDict[p.step] !== newAlter
        ) {
            if (p.accidental === undefined) {
                p.accidental = new pitch.Accidental('natural');
            }
            p.accidental.displayStatus = true;
            // console.log("setting displayStatus to true");
        } else if (
            lastStepDict[p.step] === newAlter
            && lastOctavelessStepDict[p.step] === newAlter
        ) {
            if (p.accidental !== undefined) {
                p.accidental.displayStatus = false;
            }
            // console.log("setting displayStatus to false");
        }
        lastStepDict[p.step] = newAlter;
        lastOctavelessStepDict[p.step] = newAlter;
        return p;
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

    renderVexflowOnCanvas(canvasOrSVG) {
        console.warn(
            'renderVexflowOnCanvas is deprecated; call renderVexflow instead'
        );
        return this.renderVexflow(canvasOrSVG);
    }

    write(format='musicxml') {
        return _exportMusicXMLAsText(this);
    }


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
    renderVexflow($canvasOrSVG) {
        /**
         * @type {HTMLElement|undefined}
         */
        let canvasOrSVG;
        if ($canvasOrSVG instanceof $) {
            canvasOrSVG = $canvasOrSVG[0];
        } else {
            canvasOrSVG = $canvasOrSVG;
        }
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
     * @param {boolean} [ignoreSystems=false]
     * @returns {number} height in pixels
     */
    estimateStreamHeight(ignoreSystems=false) {
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
                + (numSystems - 1) * systemPadding
                + marginBottom;

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
            return numSystems * staffHeight + (numSystems - 1) * systemPadding + marginBottom;
        } else {
            return staffHeight + marginBottom;
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
            // console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
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
                totalLength += 30;
            }
            if (rendOp.displayKeySignature) {
                const ks = this.getSpecialContext('keySignature');
                totalLength += ks?.width ?? 0;
            }
            if (rendOp.displayTimeSignature) {
                totalLength += 30;
            }
            // totalLength += rendOp.staffPadding;
            return totalLength;
        }
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
        const flatEls = this.flat.elements;
        const lastNoteIndex = flatEls.length - 1;
        this._stopPlaying = false;
        const thisStream = this;

        const playNext = function playNext(elements, params) {
            if (currentNoteIndex <= lastNoteIndex && !thisStream._stopPlaying) {
                const el = elements[currentNoteIndex];
                let nextNote;
                let playDuration;
                if (currentNoteIndex < lastNoteIndex) {
                    nextNote = elements[currentNoteIndex + 1];
                    playDuration = nextNote.offset - el.offset;
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

    createNewCanvas(width, height, elementType='svg') {
        console.warn('createNewCanvas is deprecated, use createNewDOM instead');
        return this.createNewDOM(width, height, elementType);
    }

    /**
     * Creates and returns a new `&lt;canvas&gt;` or `&lt;svg&gt;` object.
     *
     * Calls setSubstreamRenderOptions() first.
     *
     * Does not render on the DOM element.
     *
     * @param {number|string|undefined} width - will use
     *     `this.estimateStaffLength()`
     *     + `this.renderOptions.staffPadding` if not given
     * @param {number|string|undefined} height - if undefined will use
     *     `this.renderOptions.height`. If still undefined, will use
     *     `this.estimateStreamHeight()`
     * @param {string} elementType - what type of element, default = svg
     * @returns {JQuery} svg in jquery.
     */
    createNewDOM(
        width: number|string|undefined = undefined,
        height: number|string|undefined = undefined,
        elementType='svg'
    ): JQuery {
        if (!this.isFlat) {
            this.setSubstreamRenderOptions();
        }

        // we render SVG on a Div for Vexflow
        let renderElementType = 'div';
        if (elementType === 'canvas') {
            renderElementType = 'canvas';
        }

        const $newCanvasOrDIV = $('<' + renderElementType + '/>');
        $newCanvasOrDIV.addClass('streamHolding'); // .css('border', '1px red solid');
        $newCanvasOrDIV.css('display', 'inline-block');

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

    createPlayableCanvas(width, height, elementType = 'svg') {
        console.warn(
            'createPlayableCanvas is deprecated, use createPlayableDOM instead'
        );
        return this.createPlayableDOM(width, height, elementType);
    }

    /**
     * Creates a rendered, playable svg where clicking plays it.
     *
     * Called from appendNewDOM() etc.
     *
     * @param {number|string|undefined} [width]
     * @param {number|string|undefined} [height]
     * @param {string} [elementType='svg'] - what type of element, default = svg
     * @returns {JQuery} canvas or svg
     */
    createPlayableDOM(
        width: number|string|undefined = undefined,
        height: number|string|undefined = undefined,
        elementType='svg'
    ): JQuery {
        this.renderOptions.events.click = 'play';
        return this.createDOM(width, height, elementType);
    }

    createCanvas(width, height, elementType='svg') {
        console.warn('createCanvas is deprecated, use createDOM');
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

    appendNewCanvas(appendElement, width, height, elementType='svg') {
        console.warn('appendNewCanvas is deprecated, use appendNewDOM instead');
        return this.appendNewDOM(appendElement, width, height, elementType);
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
    ) {
        // noinspection JSMismatchedCollectionQueryUpdate
        let $appendElement: JQuery;
        if (appendElement instanceof $) {
            $appendElement = <JQuery><any> appendElement;
        } else {
            $appendElement = $(appendElement);
        }

        //      if (width === undefined && this.renderOptions.maxSystemWidth === undefined) {
        //      var $bodyElement = bodyElement;
        //      if (!(bodyElement instanceof $) {
        //      $bodyElement = $(bodyElement);
        //      }
        //      width = $bodyElement.width();
        //      };

        const $svgOrCanvasBlock = this.createDOM(width, height, elementType);
        $appendElement.append($svgOrCanvasBlock);
        return $svgOrCanvasBlock[0];
    }

    replaceCanvas(where, preserveSvgSize?, elementType='svg') {
        console.warn('replaceCanvas is deprecated, use replaceDOM instead');
        return this.replaceDOM(where, preserveSvgSize, elementType);
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
    replaceDOM(where, preserveSvgSize: boolean=false, elementType: string='svg') {
        // if called with no where, replaces all the svg elements on the page...
        if (where === undefined) {
            where = document.body;
        }
        let $where;
        if (!(where instanceof $)) {
            $where = $(where);
        } else {
            $where = where;
            // where = $where[0];
        }
        let $oldSVGOrCanvas;

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
     *                   )
     *
     * @param {JQuery|HTMLElement} canvasOrDiv - canvas or the Div surrounding it.
     * @returns {this}
     */
    setRenderInteraction(canvasOrDiv: JQuery|HTMLElement) {
        let $svg;
        if (canvasOrDiv === undefined) {
            return this;
        } else if (!(canvasOrDiv instanceof $)) {
            $svg = $(canvasOrDiv);
        } else {
            $svg = <JQuery> canvasOrDiv;
        }
        const playFunc = () => {
            this.playStream();
        };

        for (const [eventType, eventFunction] of Object.entries(this.renderOptions.events)) {
            $svg.off(eventType);
            if (
                typeof eventFunction === 'string'
                && eventFunction === 'play'
            ) {
                $svg.on(eventType, playFunc);
            } else if (
                typeof eventFunction === 'string'
                && eventType === 'resize'
                && eventFunction === 'reflow'
            ) {
                this.windowReflowStart($svg);
            } else if (eventFunction !== undefined) {
                const eventFunctionTyped = <Function><any> eventFunction;
                $svg.on(eventType, eventFunctionTyped);
            }
        }
        return this;
    }

    /**
     *
     * Recursively search downward for the closest storedVexflowStave...
     *
     * @returns {Vex.Flow.Stave|undefined}
     */
    recursiveGetStoredVexflowStave() {
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

    getUnscaledXYforCanvas(svg, e) {
        console.warn(
            'getUnscaledXYforCanvas is deprecated, use getUnscaledXYforDOM instead'
        );
        return this.getUnscaledXYforDOM(svg, e);
    }

    /**
     * Given a mouse click, or other event with .pageX and .pageY,
     * find the x and y for the svg.
     *
     * @param {HTMLElement|SVGElement} svg - a canvas or SVG object
     * @param {MouseEvent|TouchEvent} e
     * @returns {Array<number>} two-elements, [x, y] in pixels.
     */
    getUnscaledXYforDOM(svg, e: MouseEvent|Touch): [number, number] {
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
        if (e instanceof MouseEvent && e.pageX !== undefined && e.pageY !== undefined) {
            xClick = e.pageX;
            yClick = e.pageY;
        } else if (e instanceof Touch) {
            xClick
                = e.clientX
                + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            yClick
                = e.clientY
                + document.body.scrollTop
                + document.documentElement.scrollTop;
        } else {
            console.error(`what are you? ${typeof e}`);
            xClick
                = e.clientX
                + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            yClick
                = e.clientY
                + document.body.scrollTop
                + document.documentElement.scrollTop;
        }
        const xPx = xClick - offset.left;
        const yPx = yClick - offset.top;
        return [xPx, yPx];
    }

    getScaledXYforCanvas(svg: HTMLElement|SVGElement, e: MouseEvent|Touch): [number, number]  {
        console.warn(
            'getScaledXYforCanvas is deprecated, use getScaledXYforDOM instead'
        );
        return this.getScaledXYforDOM(svg, e);
    }

    /**
     * return a list of [scaledX, scaledY] for
     * a svg element.
     *
     * xScaled refers to 1/scaleFactor.x -- for instance, scaleFactor.x = 0.7 (default)
     * x of 1 gives 1.42857...
     *
     */
    getScaledXYforDOM(svg: HTMLElement|SVGElement, e: MouseEvent|Touch): [number, number] {
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
        //    console.log("line: " + i + " y: " + storedVexflowStave.getYForLine(i));
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
    ): base.Music21Object {
        const params = {
            allowBackup: true,
            backupMaximum: 70,
        };
        common.merge(params, options);
        let foundNote;
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

        for (const n of subStream.flat.notesAndRests) {
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
     *
     * @returns {Array} [diatonicNoteNum, closestXNote]
     */
    findNoteForClick(
        svg: HTMLElement|SVGElement,
        e: MouseEvent|Touch,
        x?: number,
        y?: number,
    ): [number, base.Music21Object] {
        if (x === undefined || y === undefined) {
            [x, y] = this.getScaledXYforDOM(svg, e);
        }
        const clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(y);
        const foundNote = this.noteElementFromScaledX(x);
        return [clickedDiatonicNoteNum, foundNote];
    }

    /**
     * Change the pitch of a note given that it has been clicked and then
     * call changedCallbackFunction
     *
     * @param {number} clickedDiatonicNoteNum
     * @param {music21.note.Note} foundNote
     * @param {SVGElement|HTMLElement} svg
     * @returns {*} output of changedCallbackFunction
     */
    noteChanged(
        clickedDiatonicNoteNum: number,
        foundNote: note.Note,
        svg: SVGElement|HTMLElement
    ) {
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

    redrawCanvas(svg) {
        console.warn('redrawCanvas is deprecated, use redrawDOM instead');
        return this.redrawDOM(svg);
    }

    /**
     * Redraws an svgDiv, keeping the events of the previous svg.
     *
     * @param {JQuery|HTMLElement} svg
     * @returns {JQuery}
     */
    redrawDOM(svg) {
        // this.resetRenderOptions(true, true); // recursive, preserveEvents
        if (!this.isFlat) {
            this.setSubstreamRenderOptions();
        }
        const $svg = $(svg); // works even if svg is already $jquery
        const $newSvg = this.createNewDOM(svg.width, svg.height);
        this.renderVexflow($newSvg);
        $svg.replaceWith($newSvg);
        return $newSvg;
    }

    editableAccidentalCanvas(width, height) {
        console.warn(
            'editableAccidentalCanvas is deprecated, use editableAccidentalDOM instead'
        );
        return this.editableAccidentalDOM(width, height);
    }

    /**
     * Renders a stream on svg with the ability to edit it and
     * a toolbar that allows the accidentals to be edited.
     *
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Node} the div tag around the svg.
     */
    editableAccidentalDOM(width, height) {
        /*
         * Create an editable svg with an accidental selection bar.
         */
        const d = $('<div/>')
            .css('text-align', 'left')
            .css('position', 'relative');

        this.renderOptions.events.click = this.DOMChangerFunction;
        const $svgDiv = this.createDOM(width, height);
        const buttonDiv = this.getAccidentalToolbar(
            undefined,
            undefined,
            $svgDiv
        );
        d.append(buttonDiv);
        d.append($("<br style='clear: both;' />"));
        d.append($svgDiv);
        return d;
    }

    /*
     * SVG toolbars...
     */

    /**
     *
     * @param {int} minAccidental - alter of the min accidental (default -1)
     * @param {int} maxAccidental - alter of the max accidental (default 1)
     * @param {jQuery} $siblingSvg - svg to use for redrawing;
     * @returns {jQuery} the accidental toolbar.
     */
    getAccidentalToolbar(minAccidental, maxAccidental, $siblingSvg) {
        if (minAccidental === undefined) {
            minAccidental = -1;
        }
        if (maxAccidental === undefined) {
            maxAccidental = 1;
        }
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
        );
        for (let i = minAccidental; i <= maxAccidental; i++) {
            const acc = new pitch.Accidental(i);
            const $button = $(
                '<button>' + acc.unicodeModifier + '</button>'
            ).on('click', e => addAccidental(i, e));
            if (Math.abs(i) > 1) {
                $button.css('font-family', 'Bravura Text');
                $button.css('font-size', '20px');
            }
            $buttonDiv.append($button);
        }
        return $buttonDiv;
    }

    /**
     * get a JQuery div containing two buttons -- play and stop
     */
    getPlayToolbar(): JQuery {
        const $buttonDiv = $('<div/>').attr(
            'class',
            'playToolbar scoreToolbar'
        );
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
     *
     * @param {JQuery} jSvg
     * @returns {this}
     */
    windowReflowStart(jSvg) {
        // set up a bunch of windowReflow bindings that affect the svg.
        let jSvgNow = jSvg;
        const resizeEnd = () => {
            // do something, window hasn't changed size in 500ms
            const jSvgParent = jSvgNow.parent();
            const newWidth = jSvgParent.width();
            const svgWidth = newWidth;
            // console.log(svgWidth);
            console.log('resizeEnd triggered', newWidth);
            // console.log(callingStream.renderOptions.events.click);
            this.resetRenderOptions(true, true); // recursive, preserveEvents
            // console.log(callingStream.renderOptions.events.click);
            this.maxSystemWidth = svgWidth - 40;
            jSvgNow.remove();
            const svgObj = this.appendNewDOM(jSvgParent);
            jSvgNow = $(svgObj);
        };
        let resizeTimeout: number = 0;

        $(window).on('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => resizeEnd(), 200);
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

    stringInfo(): string {
        // avoid using "this.offset" to not infinite loops.
        const offset = this._activeSiteStoredOffset ?? this._naiveOffset;
        return this.measureNumberWithSuffix() + ' offset=' + offset.toString();
    }

    measureNumberWithSuffix(): string {
        return this.number.toString() + this.numberSuffix;
    }
}

/**
 * Part -- specialized to handle Measures inside it
 *
 * @class Part
 * @memberof music21.stream
 */
export class Part extends Stream {
    static get className() { return 'music21.stream.Part'; }

    recursionType: string = 'flatten';
    systemHeight: number;

    constructor() {
        super();
        this.systemHeight = this.renderOptions.staffAreaHeight;
    }

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
        for (const el of this) {
            if (el.isClassOrSubclass('Measure')) {
                const elRendOp = (el as Measure).renderOptions;
                measureWidths[elRendOp.measureIndex] = elRendOp.width;
            }
        }
        return measureWidths;
    }

    /**
     * Overrides the default music21.stream.Stream#estimateStaffLength
     */
    estimateStaffLength(): number {
        if (this.renderOptions.overriddenWidth !== undefined) {
            // console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
            return this.renderOptions.overriddenWidth;
        }
        if (!this.isFlat) {
            // part with Measures underneath
            let totalLength = 0;
            let isFirst = true;
            for (const m of this.getElementsByClass('Measure')) {
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
     * Divide a part up into systems and fix the measure
     * widths so that they are all even.
     *
     * Note that this is done on the part level even though
     * the measure widths need to be consistent across parts in a score.
     * This is possible because the system is deterministic and
     * will come to the same result for each part.  Opportunity
     * for making more efficient through this...
     *
     * @param {number} systemHeight
     * @returns {Array}
     */
    fixSystemInformation(systemHeight) {
        /*
         * console.log('system height: ' + systemHeight);
         */
        if (systemHeight === undefined) {
            systemHeight = this.systemHeight; /* part.show() called... */
        } else if (debug) {
            console.log('overridden systemHeight: ' + systemHeight);
        }
        const systemPadding = this.renderOptions.systemPadding;
        const measureWidths = this.getMeasureWidths();
        const maxSystemWidth = this.maxSystemWidth; // cryptic note: "of course fix!"?
        const systemCurrentWidths = [];
        const systemBreakIndexes = [];
        let lastSystemBreak = 0; /* needed to ensure each line has at least one measure */
        const startLeft = 20; /* TODO: make it obtained elsewhere */
        let currentLeft = startLeft;
        let i;
        for (i = 0; i < measureWidths.length; i++) {
            const currentRight = currentLeft + measureWidths[i];
            /* console.log("left: " + currentLeft + " ; right: " + currentRight + " ; m: " + i); */
            if (currentRight > maxSystemWidth && lastSystemBreak !== i) {
                systemBreakIndexes.push(i - 1);
                systemCurrentWidths.push(currentLeft);

                // console.log('setting new width at ' + currentLeft);
                currentLeft = startLeft + measureWidths[i]; // 20 + this width;
                lastSystemBreak = i;
            } else {
                currentLeft = currentRight;
            }
        }
        // console.log(systemCurrentWidths);
        // console.log(systemBreakIndexes);

        let currentSystemIndex = 0;
        let leftSubtract = 0;
        let newLeftSubtract;
        for (i = 0; i < this.length; i++) {
            const m = this.get(i);
            if (!(m instanceof Stream)) {
                continue;
            }

            if (m.renderOptions === undefined) {
                continue;
            }
            if (i === 0) {
                m.renderOptions.startNewSystem = true;
            }
            currentLeft = m.renderOptions.left;

            if (systemBreakIndexes.indexOf(i - 1) !== -1) {
                /* first measure of new System */
                const oldWidth = m.renderOptions.width;
                const oldEstimate = m.estimateStaffLength() + m.renderOptions.staffPadding;
                const offsetFromEstimate = oldWidth - oldEstimate;
                // we look at the offset from the current estimate to see how much
                // the staff length may have been adjusted to compensate for other
                // parts with different lengths.

                // but setting these options is bound to change something
                m.renderOptions.displayClef = true;
                m.renderOptions.displayKeySignature = true;
                m.renderOptions.startNewSystem = true;

                // so we get a new estimate.
                const newEstimate = m.estimateStaffLength() + m.renderOptions.staffPadding;

                // and adjust it for the change.
                const newWidth = newEstimate + offsetFromEstimate;
                m.renderOptions.width = newWidth;
                leftSubtract = currentLeft - 20;
                // after this one, we'll have a new left subtract...
                newLeftSubtract = leftSubtract - (newWidth - oldWidth);

                currentSystemIndex += 1;
            } else if (i !== 0) {
                m.renderOptions.startNewSystem = false;
                m.renderOptions.displayClef = false; // check for changed clef first?
                m.renderOptions.displayKeySignature = false; // check for changed KS first?
            }
            m.renderOptions.systemIndex = currentSystemIndex;
            let currentSystemMultiplier;
            if (currentSystemIndex >= systemCurrentWidths.length) {
                /* last system... non-justified */
                currentSystemMultiplier = 1;
            } else {
                const currentSystemWidth
                    = systemCurrentWidths[currentSystemIndex];
                currentSystemMultiplier = maxSystemWidth / currentSystemWidth;
                // console.log('systemMultiplier: ' + currentSystemMultiplier
                // + ' max: ' + maxSystemWidth + ' current: ' + currentSystemWidth);
            }
            /* might make a small gap? fix? */
            const newLeft = currentLeft - leftSubtract;
            if (newLeftSubtract !== undefined) {
                leftSubtract = newLeftSubtract;
                newLeftSubtract = undefined;
            }
            // console.log('M: ' + i + ' ; old left: ' + currentLeft + ' ; new Left: ' + newLeft);
            m.renderOptions.left = Math.floor(
                newLeft * currentSystemMultiplier
            );
            m.renderOptions.width = Math.floor(
                m.renderOptions.width * currentSystemMultiplier
            );
            const newTop
                = m.renderOptions.top
                + currentSystemIndex * (systemHeight + systemPadding);
            // console.log('M: ' + i + '; New top: ' + newTop + " ; old Top: " + m.renderOptions.top);
            m.renderOptions.top = newTop;
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
        let lastTimeSignature;
        let lastKeySignature;
        let lastClef: clef.Clef;

        for (const m of this.getElementsByClass('Measure')) {
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
        const systemPadding = this.renderOptions.systemPadding;
        const systemIndex = Math.floor(y / (this.systemHeight + systemPadding));
        const scaledYRelativeToSystem
            = y - systemIndex * (this.systemHeight + systemPadding);
        return [systemIndex, scaledYRelativeToSystem];
    }

    /**
     * Overrides the default music21.stream.Stream#findNoteForClick
     * by taking into account systems
     *
     * @returns {Array} [clickedDiatonicNoteNum, foundNote]
     */
    findNoteForClick(
        svg: HTMLElement|SVGElement,
        e: MouseEvent|Touch,
        x?: number,
        y?: number,
    ): [number, base.Music21Object] {
        if (x === undefined || y === undefined) {
            [x, y] = this.getScaledXYforDOM(svg, e);
        }
        // debug = true;
        if (debug) {
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
     *
     * @param {boolean} [inPlace=false]
     */
    makeBeams({ inPlace=false }={}) {
        let returnObj = this;
        if (!inPlace) {
            returnObj = this.clone(true);
        }
        for (const p of returnObj.parts) {
            p.makeBeams({inPlace: true});
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
        const ignoreNumSystems = true;
        const currentScoreHeight = this.estimateStreamHeight(ignoreNumSystems);
        for (const p of this.parts) {
            p.fixSystemInformation(currentScoreHeight);
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
            // console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
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
     * Does this work? I found a bug in this and fixed it that should have
     * broken it!
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
            for (let j = 0; j < this.length; j++) {
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
        // TODO(msc) -- systemPadding was not being used; should it be?
        // let systemPadding = this.renderOptions.systemPadding;
        // if (systemPadding === undefined) {
        //     systemPadding = this.renderOptions.naiveSystemPadding;
        // }

        const numParts = this.parts.length;
        const staffHeight = this.renderOptions.staffAreaHeight;
        const systemHeight = numParts * staffHeight + this.renderOptions.systemPadding;
        const systemIndex = Math.floor(y / systemHeight);
        const scaledYRelativeToSystem = y - systemIndex * systemHeight;
        return [systemIndex, scaledYRelativeToSystem];
    }

    /**
     * Returns a list of [clickedDiatonicNoteNum, foundNote] for a
     * click event, taking into account that the note will be in different
     * Part objects (and different Systems) given the height and possibly different Systems.
     *
     * @returns {Array} [diatonicNoteNum, m21Element]
     */
    findNoteForClick(
        svg: HTMLElement|SVGElement,
        e: MouseEvent|Touch,
        x?: number,
        y?: number,
    ): [number, base.Music21Object] {
        if (x === undefined || y === undefined) {
            [x, y] = this.getScaledXYforDOM(svg, e);
        }
        const [systemIndex, scaledYFromSystemTop] = this.systemIndexAndScaledY(
            y
        );
        const partIndex = Math.floor(scaledYFromSystemTop / this.renderOptions.staffAreaHeight);
        const scaledYinPart
            = scaledYFromSystemTop - partIndex * this.renderOptions.staffAreaHeight;
        // console.log('systemIndex: ' + systemIndex + " partIndex: " + partIndex);
        const rightPart = this.parts.get(partIndex);
        if (rightPart === undefined) {
            return [undefined, undefined]; // may be too low?
        }

        const clickedDiatonicNoteNum = rightPart.diatonicNoteNumFromScaledY(
            scaledYinPart
        );

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
                const measure = part.getElementsByClass('Measure').get(i);
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
