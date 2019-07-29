/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/base -- objects in base in music21p routines
 *
 * does not load the other modules.
 *
 * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–19, Michael Scott Cuthbert and cuthbertLab
 *
 */
import { common } from './common.js';
import * as derivation from './derivation.js';
import { duration } from './duration.js';
import { prebase } from './prebase.js';
import * as sites from './sites.js';

/**
 * module for Music21Objects, see {@link music21.base}
 *
 * @requires music21/common
 * @requires music21/duration
 * @requires music21/prebase
 * @requires music21/sites
 * @exports music21/base
 */
/**
 * Module for Music21Objects.  Does not load other modules.
 *
 * @namespace music21.base
 * @memberof music21
 */
export const base = {};

/**
 * Base class for any object that can be placed in a {@link music21.stream.Stream}.
 *
 * @class Music21Object
 * @memberof music21.base
 * @extends music21.prebase.ProtoM21Object
 * @property {music21.stream.Stream} [activeSite] - hardlink to a {@link music21.stream.Stream} containing the element.
 * @property {number} classSortOrder - Default sort order for this class (default 20; override in other classes). Lower numbered objects will sort before other objects in the staff if priority and offset are the same.
 * @property {music21.duration.Duration} duration - the duration (object) for the element. (can be set with a quarterLength also)
 * @property {string[]} groups - An Array of strings representing group (equivalent to css classes) to assign to the object. (default [])
 * @property {boolean} isMusic21Object - true
 * @property {boolean} isStream - false
 * @property {number} offset - offset from the beginning of the stream (in quarterLength)
 * @property {number} priority - The priority (lower = earlier or more left) for elements at the same offset. (default 0)
 */
export class Music21Object extends prebase.ProtoM21Object {
    constructor(keywords) {
        super(keywords);
        this.classSortOrder = 20; // default;

        this._activeSite = undefined;
        this._naiveOffset = 0;

        // this._derivation = undefined;
        // this._style = undefined;
        // this._editorial = undefined;

        this._duration = new duration.Duration();
        /**
         *
         * @type {music21.derivation.Derivation|undefined}
         * @private
         */
        this._derivation = undefined; // avoid making extra objects...

        this._priority = 0; // default;

        this.id = sites.getId(this);
        this.groups = [];
        // groups
        this.sites = new sites.Sites();

        this.isMusic21Object = true;
        this.isStream = false;

        this.groups = []; // custom object in m21p

        // beat, measureNumber, etc.
        // lots to do...
        // noinspection JSUnusedLocalSymbols
        this._cloneCallbacks._activeSite = function Music21Object_cloneCallbacks_activeSite(
            keyName,
            newObj,
            self
        ) {
            newObj[keyName] = undefined;
        };
        this._cloneCallbacks._derivation = function Music21Music21Object_cloneCallbacks_derivation(
            keyName,
            newObj,
            self
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
            self
        ) {
            newObj[keyName] = new sites.Sites();
        };
    }

    stringInfo() {
        let id16 = this.id;
        if (typeof id16 === 'number') {
            /**
             * @type {number}
             */
            const idNumber = id16;
            id16 = idNumber.toString(16);
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
            try {
                site.elementOffset(this);
            } catch (e) {
                throw new sites.SitesException(
                    'activeSite cannot be set for an object not in the stream'
                );
            }
            this._activeSite = site;
        }
    }

    get derivation() {
        if (this._derivation === undefined) {
            this._derivation = new derivation.Derivation(this);
        }
        return this._derivation;
    }

    set derivation(newDerivation) {
        this._derivation = newDerivation;
    }


    get measureNumber() {
        if (this.activeSite !== undefined && this.activeSite.classes.includes('Measure')) {
            return this.activeSite.number;
        } else {
            const m = this.sites.getObjByClass('Measure');
            if (m !== undefined) {
                return m.number;
            } else {
                return undefined;
            }
        }
    }

    get offset() {
        if (this.activeSite === undefined) {
            return this._naiveOffset;
        } else {
            return this.activeSite.elementOffset(this);
        }
    }

    set offset(newOffset) {
        if (this.activeSite === undefined) {
            this._naiveOffset = newOffset;
        } else {
            this.activeSite.setElementOffset(this, newOffset);
        }
    }

    get priority() {
        return this._priority;
    }

    set priority(p) {
        this._priority = p;
    }

    /**
     * @type {music21.duration.Duration}
     */
    get duration() {
        return this._duration;
    }

    set duration(newDuration) {
        if (typeof newDuration === 'object') {
            this._duration = newDuration;
            // common errors below...
        } else if (typeof newDuration === 'number') {
            this._duration.quarterLength = newDuration;
        } else if (typeof newDuration === 'string') {
            this._duration.type = newDuration;
        }
    }

    /**
     * @type {number}
     */
    get quarterLength() {
        return this.duration.quarterLength;
    }

    set quarterLength(ql) {
        this.duration.quarterLength = ql;
    }

    /**
     *
     * @param {music21.base.Music21Object} other
     * @returns {this}
     */
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
     * @param {music21.stream.Stream} site
     * @param {boolean} [stringReturns=false] -- allow strings to be returned
     * @returns {number|undefined}
     */
    getOffsetBySite(site, stringReturns=false) {
        if (site === undefined) {
            return this._naiveOffset;
        }
        return site.elementOffset(this, stringReturns);
    }

    /**
     * setOffsetBySite - sets the offset for a given Stream
     *
     * @param {music21.stream.Stream} site Stream object
     * @param {number} value offset
     */
    setOffsetBySite(site, value) {
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
     * @param {music21.stream.Stream} site
     * @returns {Number|undefined}
     */
    getOffsetInHierarchy(site) {
        try {
            return this.getOffsetBySite(site);
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

    getContextByClass(className, options) {
        const payloadExtractor = function payloadExtractor(
            useSite,
            flatten,
            positionStart,
            getElementMethod,
            classList
        ) {
            // this should all be done as a tree...
            // do not use .flat or .semiFlat so as not
            // to create new sites.

            // VERY HACKY...
            let lastElement;
            for (let i = 0; i < useSite.length; i++) {
                const thisElement = useSite._elements[i];
                const indexOffset = useSite.elementOffset(thisElement);
                const matchClass = thisElement.isClassOrSubclass(classList);
                if (flatten === false && !matchClass) {
                    continue;
                } else if (!thisElement.isStream && !matchClass) {
                    continue;
                }
                // is a stream or an element of the appropriate class...
                // first check normal elements
                if (
                    getElementMethod.includes('Before')
                    && indexOffset >= positionStart
                ) {
                    if (
                        getElementMethod.includes('At')
                        && lastElement === undefined
                    ) {
                        lastElement = thisElement;
                        try {
                            lastElement.activeSite = useSite;
                        } catch (e) {
                            // do nothing... should not happen.
                        }
                    } else if (lastElement !== undefined
                                && lastElement.isClassOrSubclass(classList)) {
                        return lastElement;
                    } else if (matchClass) {
                        return thisElement;
                    }
                } else {
                    lastElement = thisElement;
                }
                if (
                    getElementMethod.includes('After')
                    && indexOffset > positionStart
                    && matchClass
                ) {
                    return thisElement;
                }
                // now check stream... already filtered out flatten == false;
                if (thisElement.isStream) {
                    const potentialElement = payloadExtractor(
                        thisElement,
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
                return lastElement;
            } else {
                return undefined;
            }
        };

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
            if (
                getElementMethod.includes('At')
                && site.isClassOrSubclass(className)
            ) {
                return site;
            }

            if (
                searchType === 'elementsOnly'
                || searchType === 'elementsFirst'
            ) {
                const contextEl = payloadExtractor(
                    site,
                    false,
                    positionStart,
                    getElementMethod,
                    className
                );
                if (contextEl !== undefined) {
                    try {
                        contextEl.activeSite = site;
                    } catch (e) {
                        // do nothing.
                    }
                    return contextEl;
                }
            } else if (searchType !== 'elementsOnly') {
                if (
                    getElementMethod.includes('After')
                    && (className === undefined
                        || site.isClassOrSubclass(className))
                ) {
                    if (
                        !getElementMethod.includes('NotSelf')
                        && this !== site
                    ) {
                        return site;
                    }
                }
                const contextEl = payloadExtractor(
                    site,
                    'semiFlat',
                    positionStart,
                    getElementMethod,
                    className
                );
                if (contextEl !== undefined) {
                    try {
                        contextEl.activeSite = site;
                    } catch (e) {
                        // do nothing.
                    }
                    return contextEl;
                }
                if (
                    getElementMethod.includes('Before')
                    && (className === undefined
                        || site.isClassOrSubclass(className))
                ) {
                    if (
                        !getElementMethod.includes('NotSelf')
                        || this !== site
                    ) {
                        return site;
                    }
                }
            }
        }

        return undefined;
    }

    * contextSites(options) {
        const params = {
            callerFirst: undefined,
            memo: [],
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
            if (this.isStream && !(this in memo)) {
                const recursionType = this.recursionType;
                yield [this, 0.0, recursionType];
            }
            memo.push(this);
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
            if (memo.includes(siteObj)) {
                continue;
            }
            if (siteObj.classes.includes('SpannerStorage')) {
                continue;
            }

            // let offset = this.getOffsetBySite(siteObj);
            // followDerivation;
            const offsetInStream = siteObj.elementOffset(this);
            const newOffset = offsetInStream + params.offsetAppend;
            const positionInStream = newOffset;
            const recursionType = siteObj.recursionType;
            yield [siteObj, positionInStream, recursionType];
            memo.push(siteObj);

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

                if (!memo.includes(topLevelInner)) {
                    // if returnSortTuples...
                    // else
                    yield [topLevelInner, inStreamOffset, recurType];
                    memo.push(topLevelInner);
                }
            }
        }
        // if followDerivation...
        if (params.followDerivation) {
            for (const derivedObject of topLevel.derivation.chain()) {
                for (const [derivedSite, derivedOffset, derivedRecurseType] of derivedObject.contextSites({
                    callerFirst: undefined,
                    memo,
                    offsetAppend: 0.0,
                    returnSortTuples: true,
                    sortByCreationTime: params.sortByCreationTime,
                })) {
                    const offsetAdjustedCsTuple = [derivedSite, derivedOffset + params.offsetAppend, derivedRecurseType];
                    yield offsetAdjustedCsTuple;
                }
            }
        }
    }
}

base.Music21Object = Music21Object;
