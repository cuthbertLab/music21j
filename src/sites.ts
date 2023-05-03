/**
 * Objects for keeping track of relationships among Music21Objects.
 *
 * Copyright (c) 2017-2021, Michael Scott Asato Cuthbert
 * License: BSD
 */

import * as common from './common';
import { Music21Exception } from './exceptions21';

// for typing only...
import type { Stream } from './stream';

/**
 */
export class SitesException extends Music21Exception {}
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
    isDead: boolean = false;
    classString: string;
    globalSiteIndex: boolean|number = false;
    siteIndex: number;
    site: Stream;
}

const _NoneSiteRef = new SiteRef();
_NoneSiteRef.globalSiteIndex = -2;
_NoneSiteRef.siteIndex = -2;

const _singletonCounter = new common.SingletonCounter();

const GLOBAL_SITE_STATE_DICT = new WeakMap();

export function getId(obj: any): number|string {
    if (!GLOBAL_SITE_STATE_DICT.has(obj)) {
        const newId = _singletonCounter.call();
        GLOBAL_SITE_STATE_DICT.set(obj, newId);
    }
    return GLOBAL_SITE_STATE_DICT.get(obj);
}

export class Sites {
    siteDict;
    protected _siteIndex: number = 0;
    protected _lastID: number = -1;

    constructor() {
        this.siteDict = new Map();
        this.siteDict.set(_NoneSiteRef.siteIndex, _NoneSiteRef);
    }

    get length(): number {
        return this.siteDict.size;
    }

    includes(checkSite: Stream): boolean {
        // noinspection JSUnusedLocalSymbols
        for (const [unused_key, siteRef] of this.siteDict) {
            if (siteRef.site === checkSite) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @returns {Array<*>}
     */
    protected _keysByTime(newFirst: boolean = true) {
        const post = [];
        for (const [key, siteRef] of this.siteDict) {
            const keyVal = [siteRef.siteIndex, key];
            post.push(keyVal);
        }
        post.sort();
        if (newFirst) {
            post.reverse();
        }
        return post.map(innerList => innerList[1]);
    }

    add(obj, idKey=undefined, classString: string = undefined) {
        if (idKey === undefined && obj !== undefined) {
            idKey = getId(obj);
        }
        let updateNotAdd = false;
        if (this.siteDict.has(idKey)) {
            const tempSiteRef = this.siteDict.get(idKey);
            if (!tempSiteRef.isDead && tempSiteRef.site !== undefined) {
                updateNotAdd = true;
            }
        }
        if (obj !== undefined && classString === undefined) {
            classString = obj.classes[0];
        }

        let siteRef;
        if (updateNotAdd) {
            siteRef = this.siteDict.get(idKey);
            siteRef.isDead = false;
        } else {
            siteRef = new SiteRef();
        }

        siteRef.site = obj; // stores a weakRef;
        siteRef.classString = classString;
        siteRef.siteIndex = this._siteIndex;
        this._siteIndex += 1;
        siteRef.globalSiteIndex = _singletonCounter.call();

        if (!updateNotAdd) {
            this.siteDict.set(idKey, siteRef);
        }
    }

    /**
     * @param obj
     */
    remove(obj): boolean {
        const idKey = getId(obj);
        if (idKey === undefined) {
            return false;
        }
        return this.siteDict.delete(idKey);
    }

    clear(): void {
        this.siteDict = new Map();
        this.siteDict.set(_NoneSiteRef.siteIndex, _NoneSiteRef);
        this._lastID = -1;
    }

    /**
     */
    * yieldSites(
        sortByCreationTime: boolean|string = false,
        priorityTarget: Stream = undefined,
        excludeNone: boolean = false
    ): Generator<Stream, void, void> {
        let keyRepository;
        if (sortByCreationTime === true) {
            keyRepository = this._keysByTime(false);
        } else if (sortByCreationTime === 'reverse') {
            keyRepository = this._keysByTime(true);
        } else {
            keyRepository = Array.from(this.siteDict.keys());
        }
        if (priorityTarget !== undefined) {
            const priorityId = getId(priorityTarget);
            if (keyRepository.includes(priorityId)) {
                const priorityIndex = keyRepository.indexOf(priorityId);
                keyRepository.splice(priorityIndex, 1);
                keyRepository.unshift(priorityId);
            }
        }
        for (const key of keyRepository) {
            const siteRef = this.siteDict.get(key);
            if (siteRef === _NoneSiteRef) {
                if (!excludeNone) {
                    yield siteRef.site;
                }
            } else {
                const obj = siteRef.site;
                if (obj === undefined) {
                    siteRef.isDead = true;
                } else {
                    yield obj;
                }
            }
        }
    }

    get(
        sortByCreationTime: boolean = false,
        priorityTarget: Stream = undefined,
        excludeNone: boolean = false
    ): Stream[] {
        const post = Array.from(
            this.yieldSites(sortByCreationTime, priorityTarget, excludeNone)
        );

        // we do this resorting again, because the priority target might not match id and we
        // want to be extra safe.  If you want fast, use .yieldSites
        if (priorityTarget !== undefined) {
            if (post.includes(priorityTarget)) {
                const priorityIndex = post.indexOf(priorityTarget);
                post.splice(priorityIndex, 1);
                post.unshift(priorityTarget);
            }
        }
        return post;
    }

    /**
     *
     * @param {string} attrName
     * @returns {undefined|*}
     */
    getAttrByName(attrName) {
        for (const obj of this.yieldSites('reverse')) {
            if (obj === undefined) {
                continue;
            }
            if (attrName in obj) {
                return obj[attrName];
            }
        }
        return undefined;
    }

    /**
     *
     * @param {string} className
     * @param {Object} [options]
     * @returns {Stream}
     */
    getObjByClass(className: string, options={}): Stream {
        const params = {
            callerFirst: this,
            sortByCreationTime: false,
            priorityTarget: undefined,
            getElementMethod: 'getElementAtOrBefore',
            memo: {},
        };
        common.merge(params, options);
        const memo = params.memo;
        let post;
        const objs = Array.from(
            this.yieldSites(
                params.sortByCreationTime,
                params.priorityTarget,
                true // excludeNone
            )
        );
        for (const obj of objs) {
            if (obj.isClassOrSubclass(className)) {
                post = obj;
                break;
            }
        }
        if (post !== undefined) {
            return post;
        }
        for (const obj of objs) {
            // TODO: check inside object... perhaps should not be done in m21p
            const objId = getId(obj);
            if (!(objId in memo)) {
                memo[objId] = obj;
            }
            post = obj.getContextByClass(className, params);
            if (post !== undefined) {
                break;
            }
        }
        return post;
    }
}
