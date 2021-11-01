import * as derivation from './derivation';
import * as duration from './duration';
import * as editorial from './editorial';
import * as prebase from './prebase';
import * as sites from './sites';
import { Stream } from './stream';
import { TimeSignature } from './meter';
/**
 * Base class for any object that can be placed in a {@link Stream}.
 *
 * @property {Stream} [activeSite] - hardlink to a
 *     {@link Stream} containing the element.
 * @property {number} classSortOrder - Default sort order for this class
 *     (default 20; override in other classes). Lower numbered objects will sort
 *     before other objects in the staff if priority and offset are the same.
 * @property {string[]} groups - An Array of strings representing group
 *     (equivalent to css classes) to assign to the object. (default [])
 * @property {boolean} isMusic21Object - true
 * @property {boolean} isStream - false
 * @property {number} offset - offset from the beginning of the stream (in quarterLength)
 * @property {number} priority - The priority (lower = earlier or more left) for
 *     elements at the same offset. (default 0)
 */
export declare class Music21Object extends prebase.ProtoM21Object {
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
     * element in that site.
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
//# sourceMappingURL=base.d.ts.map