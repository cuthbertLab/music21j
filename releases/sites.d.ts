/**
 * Objects for keeping track of relationships among Music21Objects.
 *
 * Copyright (c) 2017-2021, Michael Scott Asato Cuthbert
 * License: BSD
 */
import { Music21Exception } from './exceptions21';
import type { Stream } from './stream';
/**
 */
export declare class SitesException extends Music21Exception {
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
export declare class SiteRef {
    isDead: boolean;
    classString: string;
    globalSiteIndex: boolean | number;
    siteIndex: number;
    site: Stream;
}
export declare function getId(obj: any): number | string;
export declare class Sites {
    siteDict: Map<number | string, SiteRef>;
    protected _siteIndex: number;
    protected _lastID: number;
    constructor();
    get length(): number;
    includes(checkSite: Stream): boolean;
    protected _keysByTime(newFirst?: boolean): any[];
    add(obj: any, idKey?: any, classString?: string): void;
    remove(obj: any): boolean;
    clear(): void;
    /**
     */
    yieldSites(sortByCreationTime?: boolean | string, priorityTarget?: Stream, excludeNone?: boolean): Generator<Stream, void, void>;
    get(sortByCreationTime?: boolean, priorityTarget?: Stream, excludeNone?: boolean): Stream[];
    getAttrByName(attrName: string): any;
    getObjByClass(className: string, options?: {}): Stream;
}
//# sourceMappingURL=sites.d.ts.map