/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/base -- objects in base in music21p routines
 *
 * does not load the other modules.
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * module for Music21Objects, see {@link music21.base}
 *
 * @requires music21/common
 * @requires music21/duration
 * @requires music21/prebase
 * @requires music21/sites
 * @exports music21/base
 * @namespace music21.base
 * @memberof music21
 */
import * as common from './common';
import * as derivation from './derivation';
import * as duration from './duration';
import * as editorial from './editorial';
import * as prebase from './prebase';
import * as sites from './sites';

// imports for typing only
import { Stream, Measure } from './stream';
import {Music21Exception, StreamException} from './exceptions21';
import { TimeSignature } from './meter';


declare interface StreamRecursionLike {
    recursionType: string;
}

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
    static get className() { return 'music21.base.Music21Object'; }

    classSortOrder: number = 20; // default;
    protected _activeSite: any;
    protected _activeSiteStoredOffset: number = 0;
    protected _naiveOffset: number = 0;
    // _derivation = undefined;
    // _style = undefined;
    protected _editorial: editorial.Editorial;
    protected _duration: duration.Duration;
    protected _derivation: derivation.Derivation;
    protected _priority: number = 0;
    id: number|string = 0;
    groups: string[] = []; // custom object in m21p
    sites: sites.Sites;
    isMusic21Object: boolean = true;
    isStream: boolean = false;
    // beat, etc.
    // lots to do...

    constructor(keywords={}) {
        super();
        this._duration = new duration.Duration(0.0);
        this.id = sites.getId(this);
        this.sites = new sites.Sites();
        this._cloneCallbacks._activeSite = false;
        this._cloneCallbacks._activeSiteStoredOffset = false;
        this._cloneCallbacks._derivation = function Music21Music21Object_cloneCallbacks_derivation(
            keyName,
            newObj,
            self,
            deep,
            memo
        ) {
            const newDerivation = new derivation.Derivation(newObj);
            newDerivation.origin = self;
            newDerivation.method = 'clone';
            newObj[keyName] = newDerivation;
        };

        // noinspection JSUnusedLocalSymbols
        this._cloneCallbacks.sites = function Music21Object_cloneCallbacks_sites(
            keyName,
            newObj,
            self,
            deep,
            memo
        ) {
            newObj.sites = new sites.Sites();
        };
    }

    /**
     * Override clone on prebase to add a derivation.
     */
    clone(deep: boolean = true, memo=undefined): this {
        const ret: this = super.clone(deep, memo);
        const newDerivation = new derivation.Derivation(ret);
        newDerivation.origin = this;
        newDerivation.method = 'clone';  // '__deepcopy__' in m21p
        ret.derivation = newDerivation;
        return ret;
    }


    stringInfo(): string {
        let id16 = this.id;
        if (typeof id16 === 'number') {
            const idNumber = <number> id16;
            id16 = <string> idNumber.toString(16);
            while (id16.length < 4) {
                id16 = '0' + id16;
            }
            id16 = '0x' + id16;
        }
        return id16;
    }

    get activeSite() {
        return this._activeSite;
    }

    set activeSite(site) {
        if (site === undefined) {
            this._activeSite = undefined;
            this._activeSiteStoredOffset = undefined;
        } else {
            let offset: number;
            try {
                offset = site.elementOffset(this);
            } catch (e) {
                throw new sites.SitesException(
                    'activeSite cannot be set for an object not in the stream'
                );
            }
            this._activeSite = site;
            this._activeSiteStoredOffset = offset;
        }
    }

    get derivation(): derivation.Derivation {
        if (this._derivation === undefined) {
            this._derivation = new derivation.Derivation(this);
        }
        return this._derivation;
    }

    set derivation(newDerivation: derivation.Derivation) {
        this._derivation = newDerivation;
    }

    get editorial(): editorial.Editorial {
        if (this._editorial === undefined) {
            this._editorial = new editorial.Editorial();
        }
        return this._editorial;
    }

    set editorial(newEditorial: editorial.Editorial) {
        this._editorial = newEditorial;
    }

    get hasEditorialInformation() : boolean {
        return (this._editorial !== undefined);
    }

    get measureNumber() {
        if (this.activeSite !== undefined && this.activeSite.classes.includes('Measure')) {
            const activeMeasure = <Measure> this.activeSite;
            return activeMeasure.number;
        } else {
            const m = this.sites.getObjByClass('Measure');
            if (m !== undefined) {
                return (<Measure> m).number;
            } else {
                return undefined;
            }
        }
    }

    /**
     *  Try to obtain the nearest Measure that contains this object,
        and return the offset of this object within that Measure.

        If a Measure is found, and that Measure has padding
        defined as `paddingLeft` (for pickup measures, etc.), padding will be added to the
        native offset gathered from the object.

     */
    _getMeasureOffset(
        {includeMeasurePadding = true}: {includeMeasurePadding?: boolean} = {}
    ): number {
        const activeS: Stream = this.activeSite;
        let offsetLocal: number;
        if (activeS !== undefined && activeS.isMeasure) {
            offsetLocal = activeS.elementOffset(this);
            if (includeMeasurePadding) {
                offsetLocal += (activeS as Measure).paddingLeft;
            }
        } else {
            const m: Measure = this.getContextByClass('Measure', {sortByCreationTime: true});
            if (m !== undefined) {
                try {
                    offsetLocal = m.elementOffset(this);
                    if (includeMeasurePadding) {
                        offsetLocal += m.paddingLeft;
                    }
                } catch (e) {
                    offsetLocal = this.offset;
                }
            } else {
                offsetLocal = this.offset;
            }
        }
        return offsetLocal;
    }

    get offset(): number {
        if (this.activeSite === undefined) {
            return this._naiveOffset;
        } else {
            return this.activeSite.elementOffset(this);
        }
    }

    set offset(newOffset: number) {
        newOffset = common.opFrac(newOffset);
        if (this.activeSite === undefined) {
            this._naiveOffset = newOffset;
        } else {
            this.activeSite.setElementOffset(this, newOffset);
        }
    }

    get priority(): number {
        return this._priority;
    }

    set priority(p: number) {
        this._priority = p;
    }

    get duration(): duration.Duration {
        return this._duration;
    }

    set duration(newDuration: duration.Duration) {
        if (typeof newDuration === 'object') {
            this._duration = newDuration;
            // common errors below...
        } else if (typeof newDuration === 'number') {
            this._duration.quarterLength = newDuration;
        } else if (typeof newDuration === 'string') {
            this._duration.type = newDuration;
        }
    }

    get quarterLength(): number {
        return this.duration.quarterLength;
    }

    set quarterLength(ql: number) {
        this.duration.quarterLength = ql;
    }

    mergeAttributes(other) {
        // id;
        this.groups = other.groups.slice();
        return this;
    }

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
    getOffsetBySite(
        site: Stream|undefined = undefined,
        stringReturns: boolean=false
    ): number|string|undefined {
        if (site === undefined) {
            return this._naiveOffset;
        }
        return site.elementOffset(this, stringReturns);
    }

    /**
     * setOffsetBySite - sets the offset for a given Stream
     *
     * @param {Stream} site Stream object
     * @param {number} value offset
     */
    setOffsetBySite(
        site: Stream|undefined,
        value: number
    ) {
        if (site !== undefined) {
            site.setElementOffset(this, value);
        } else {
            this._naiveOffset = value;
        }
    }


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
    getOffsetInHierarchy(site: Stream): number|undefined {
        try {
            return <number> this.getOffsetBySite(site);
        } catch (e) {} // eslint-disable-line no-empty
        // noinspection JSUnusedLocalSymbols
        for (const [csSite, csOffset, unused_csRecursionType] of this.contextSites()) {
            if (csSite === site) {
                return csOffset;
            }
        }
        throw new Error(`Element ${this} is not in hierarchy of ${site}`);
    }

    // ---------- Contexts -------------

    getContextByClass(
        className,
        options={}
    ) {
        const params = {
            getElementMethod: 'getElementAtOrBefore',
            sortByCreationTime: false,
        };
        common.merge(params, options);

        const getElementMethod = params.getElementMethod;
        const sortByCreationTime = params.sortByCreationTime;

        if (className !== undefined && !(className instanceof Array)) {
            className = [className];
        }
        if (
            getElementMethod.includes('At')
            && this.isClassOrSubclass(className)
        ) {
            return this;
        }

        for (const [site, positionStart, searchType] of this.contextSites({
            returnSortTuples: true,
            sortByCreationTime,
        })) {
            if (getElementMethod.includes('At')
                    && site.isClassOrSubclass(className)) {
                return site;
            }

            if (searchType === 'elementsOnly' || searchType === 'elementsFirst') {
                const contextEl = getContextByClassPayloadExtractor(
                    site,
                    false,
                    positionStart,
                    getElementMethod,
                    className
                );
                if (contextEl !== undefined) {
                    return contextEl;
                }
            } else if (searchType !== 'elementsOnly') {
                if (getElementMethod.includes('After')
                        && (className === undefined
                            || site.isClassOrSubclass(className))) {
                    if (!getElementMethod.includes('NotSelf')
                        && this !== site) {
                        return site;
                    }
                }
                const contextEl = getContextByClassPayloadExtractor(
                    site,
                    'semiFlat',
                    positionStart,
                    getElementMethod,
                    className
                );
                if (contextEl !== undefined) {
                    return contextEl;
                }
                if (getElementMethod.includes('Before')
                    && (className === undefined
                        || site.isClassOrSubclass(className))) {
                    if (!getElementMethod.includes('NotSelf')
                           || this !== site) {
                        return site;
                    }
                }
            }
        }

        return undefined;
    }

    * contextSites(options={}) {
        const params = {
            callerFirst: undefined,
            memo: new Map(),
            offsetAppend: 0.0,
            sortByCreationTime: false,
            priorityTarget: undefined,
            returnSortTuples: false,
            followDerivation: true,
        };
        common.merge(params, options);
        const memo = params.memo;
        if (params.callerFirst === undefined) {
            params.callerFirst = this;
            if (this.isStream && !(memo.has(this))) {
                const streamThis = <StreamRecursionLike><unknown> this;
                const recursionType = streamThis.recursionType;
                yield [this, 0.0, recursionType];
            }
            memo.set(this, true);
        }

        if (params.priorityTarget === undefined && !params.sortByCreationTime) {
            params.priorityTarget = this.activeSite;
        }
        const topLevel = this;
        for (const siteObj of this.sites.yieldSites(
            params.sortByCreationTime,
            params.priorityTarget,
            true // excludeNone
        )) {
            if (memo.has(siteObj)) {
                continue;
            }
            if (siteObj.classes.includes('SpannerStorage')) {
                continue;
            }

            // let offset = this.getOffsetBySite(siteObj);
            // followDerivation;
            let offsetInStream: number;
            try {
                offsetInStream = siteObj.elementOffset(this);
            } catch (e) {
                console.error(`${this + ''} is not in ${siteObj + ''}`);
                continue;
            }

            const newOffset = offsetInStream + params.offsetAppend;
            const positionInStream = newOffset;
            const recursionType = siteObj.recursionType;
            yield [siteObj, positionInStream, recursionType];
            memo.set(siteObj, true);

            const newParams = {
                callerFirst: params.callerFirst,
                memo,
                offsetAppend: positionInStream, // .offset
                returnSortTuples: true, // always!
                sortByCreationTime: params.sortByCreationTime,
            };
            for (const [
                topLevelInner,
                inStreamPos,
                recurType
            ] of siteObj.contextSites(newParams)) {
                const inStreamOffset = inStreamPos; // .offset;
                // const hypotheticalPosition = inStreamOffset; // more complex w/ sortTuples

                if (!memo.has(topLevelInner)) {
                    // if returnSortTuples...
                    // else
                    yield [topLevelInner, inStreamOffset, recurType];
                    memo.set(topLevelInner, true);
                }
            }
        }
        // if followDerivation...
        if (params.followDerivation) {
            for (const derivedObject of topLevel.derivation.chain()) {
                for (const [derivedSite, derivedOffset, derivedRecurseType]
                    of derivedObject.contextSites({
                        callerFirst: undefined,
                        memo,
                        offsetAppend: 0.0,
                        returnSortTuples: true,
                        sortByCreationTime: params.sortByCreationTime,
                    })) {
                    const offsetAdjustedCsTuple = [
                        derivedSite,
                        derivedOffset + params.offsetAppend,
                        derivedRecurseType,
                    ];
                    yield offsetAdjustedCsTuple;
                }
            }
        }
    }

    _getTimeSignatureForBeat(): TimeSignature {
        // note: getContextByClass does not full support BeforeOffset yet.
        const ts: TimeSignature = this.getContextByClass(
            'TimeSignature', {getElementMethod: 'getElementAtOrBeforeOffset'}
        );
        if (ts === undefined) {
            throw new Music21Exception('this object does not have a TimeSignature in Sites');
        }
        return ts;
    }

    get beat(): number {
        try {
            const ts = this._getTimeSignatureForBeat();
            return ts.getBeatProportion(ts.getMeasureOffsetOrMeterModulusOffset(this));
        } catch (e) {
            return NaN;
        }
    }

    /*
        Given an object and a number, run append that many times on
        a deepcopy of the object.
        numberOfTimes should of course be a positive integer.

        a = stream.Stream()
        n = note.Note('D--')
        n.duration.type = 'whole'
        a.repeatAppend(n, 10)
    */

    repeatAppend(this, item, numberOfTimes) {
        let unused = null;
        try {
            unused = item.isStream;
        } catch (AttributeError) {
            throw new StreamException('to put a non Music21Object in a stream, '
            + 'create a music21.ElementWrapper for the item');

        }
        for (let i = 0; i < numberOfTimes; i++) {
            this.append(item.clone(true));
        }
    }
}

function getContextByClassPayloadExtractor(
    useSite: Stream,
    flatten: boolean|string,  // true, false, or semiflat
    positionStart: number,
    getElementMethod: string,
    classList: string[]
) {
    // this should all be done as a tree...
    // do not use .flat or .semiFlat so as not
    // to create new sites.

    // conflict between two linters requires setting lastElement to undefined.
    let lastElement = undefined;  // eslint-disable-line no-undef-init
    const useSiteElements = useSite.elements; // we want sorting.

    for (let i = 0; i < useSiteElements.length; i++) {
        const thisElement = useSiteElements[i];
        const matchClass: boolean = thisElement.isClassOrSubclass(classList);
        if (flatten === false && !matchClass) {
            continue;
        } else if (!thisElement.isStream && !matchClass) {
            continue;
        }
        const indexOffset = useSite.elementOffset(thisElement);

        // thisElement is a stream or has the appropriate class...
        // first check normal elements
        if (getElementMethod.includes('Before')
                && indexOffset >= positionStart) {
            if (getElementMethod.includes('At')
                    && lastElement === undefined) {
                lastElement = thisElement;
            } else if (lastElement !== undefined
                        && lastElement.isClassOrSubclass(classList)) {
                lastElement.activeSite = useSite;
                return lastElement;
            } else if (matchClass) {
                thisElement.activeSite = useSite;
                return thisElement;
            }
        } else {
            lastElement = thisElement;
        }
        if (getElementMethod.includes('After')
                && indexOffset > positionStart
                && matchClass) {
            thisElement.activeSite = useSite;
            return thisElement;
        }
        // now check stream... already filtered out flatten == false;
        if (thisElement.isStream) {
            const potentialElement = getContextByClassPayloadExtractor(
                <Stream> thisElement,
                flatten,
                positionStart + indexOffset,
                getElementMethod,
                classList
            );
            if (potentialElement !== undefined) {
                return potentialElement;
            }
        }
    }
    if (lastElement !== undefined && lastElement.isClassOrSubclass(classList)) {
        lastElement.activeSite = useSite;
        return lastElement;
    } else {
        return undefined;
    }
}



// TODO(msc) -- ElementWrapper

