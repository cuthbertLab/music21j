/**
 * Objects for keeping track of relationships among Music21Objects. See {@link music21.sites} namespace
 *
 * Copyright 2017, Michael Scott Cuthbert and cuthbertLab
 * License: BSD
 */

import { common } from './common.js';
import { Music21Exception } from './exceptions21';

/**
 * @namespace music21.sites
 * @memberof music21
 * @requires music21/common
 */
export const sites = {};

export class SitesException extends Music21Exception {}
sites.SitesException = SitesException;

export class SiteRef {
    constructor() {
        this.isDead = false;
        this.classString = undefined;
        this.globalSiteIndex = false;
        this.siteIndex = undefined;
        this.siteWeakref = new WeakMap();
        this.siteWeakref.ref = undefined;
    }
    get site() {
        return this.siteWeakref.ref;
    }

    set site(newSite) {
        this.siteWeakref.ref = newSite;
    }
}
sites.SiteRef = SiteRef;

const _NoneSiteRef = new SiteRef();
_NoneSiteRef.globalSiteIndex = -2;
_NoneSiteRef.siteIndex = -2;

const _singletonCounter = new common.SingletonCounter();

const GLOBAL_SITE_STATE_DICT = new WeakMap();

sites.getId = function getId(obj) {
    if (!GLOBAL_SITE_STATE_DICT.has(obj)) {
        const newId = _singletonCounter.call();
        GLOBAL_SITE_STATE_DICT.set(obj, newId);
    }
    return GLOBAL_SITE_STATE_DICT.get(obj);
};

export class Sites {
    constructor() {
        this.siteDict = new Map();
        this.siteDict.set(_NoneSiteRef.siteIndex, _NoneSiteRef);
        this._siteIndex = 0;
        this._lastID = -1;
    }

    get length() {
        return this.siteDict.size;
    }
    includes(checkSite) {
        for (const [unused_key, siteRef] of this.siteDict) {
            if (siteRef.site === checkSite) {
                return true;
            }
        }
        return false;
    }

    _keysByTime(newFirst = true) {
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

    add(obj, idKey, classString) {
        if (idKey === undefined && obj !== undefined) {
            idKey = sites.getId(obj);
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

    remove(obj) {
        const idKey = sites.getId(obj);
        if (idKey === undefined) {
            return false;
        }
        return this.siteDict.delete(idKey);
    }
    
    clear() {
        this.siteDict = new Map();
        this.siteDict.set(_NoneSiteRef.siteIndex, _NoneSiteRef);
        this._lastID = -1;
    }

    * yieldSites(
        sortByCreationTime = false,
        priorityTarget,
        excludeNone = false
    ) {
        let keyRepository;
        if (sortByCreationTime === true) {
            keyRepository = this._keysByTime(false);
        } else if (sortByCreationTime === 'reverse') {
            keyRepository = this._keysByTime(true);
        } else {
            keyRepository = Array.from(this.siteDict.keys());
        }
        if (priorityTarget !== undefined) {
            const priorityId = sites.getId(priorityTarget);
            if (keyRepository.includes(priorityId)) {
                keyRepository.splice(
                    0,
                    0,
                    keyRepository.pop(keyRepository.indexOf(priorityId))
                );
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

    get(sortByCreationTime = false, priorityTarget, excludeNone = false) {
        const post = Array.from(
            this.yieldSites(sortByCreationTime, priorityTarget, excludeNone)
        );

        // we do this resorting again, because the priority target might not match id and we
        // want to be extra safe.  If you want fast, use .yieldSites
        if (priorityTarget !== undefined) {
            if (post.includes(priorityTarget)) {
                post.splice(0, 0, post.pop(post.indexOf(priorityTarget)));
            }
        }
        return post;
    }
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

    getObjByClass(className, options) {
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
        const classNameIsStr = typeof className === 'string';
        for (const obj of objs) {
            if (classNameIsStr) {
                if (obj.classes.includes(className)) {
                    post = obj;
                    break;
                }
            } else if (obj instanceof className) {
                post = obj;
                break;
            }
        }
        if (post !== undefined) {
            return post;
        }
        for (const obj of objs) {
            // TODO: check inside object... perhaps should not be done in m21p
            const objId = sites.getId(obj);
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
sites.Sites = Sites;
