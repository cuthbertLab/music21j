import * as derivation from './derivation';
import * as duration from './duration';
import * as editorial from './editorial';
import * as prebase from './prebase';
import * as sites from './sites';
import * as style from './style';
import type { Stream } from './stream';
import type { TimeSignature } from './meter';
import type { ClassFilterType } from './types';
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
    protected _style: style.Style;
    protected _editorial: Record<string, any>;
    protected _duration: duration.Duration;
    protected _derivation: derivation.Derivation;
    protected _priority: number;
    id: number | string;
    groups: string[];
    sites: sites.Sites;
    isMusic21Object: boolean;
    isStream: boolean;
    protected static _styleClass: typeof style.Style;
    constructor(_keywords?: {});
    /**
     * Override clone on prebase to add a derivation.
     */
    clone(deep?: boolean, memo?: any): this;
    stringInfo(): string;
    get activeSite(): any;
    set activeSite(site: any);
    get derivation(): derivation.Derivation;
    set derivation(newDerivation: derivation.Derivation);
    /**
     * Note that the editorial is typed as Record<string, any>
     *     but actually returns an editorial object
     */
    get editorial(): Record<string, any>;
    set editorial(newEditorial: editorial.Editorial | Record<string, any>);
    get hasEditorialInformation(): boolean;
    /**
     * Returns true if there is a style.Style object
     * already associated with this object, false otherwise.
     *
     * Calling .style on an object will always create a new
     * Style object, so even though a new Style object isn't too expensive
     * to create, this property helps to prevent creating new Styles more than
     * necessary.
     */
    get hasStyleInformation(): boolean;
    /**
     * Returns (or Creates and then Returns) the Style object
     * associated with this object, or sets a new
     * style object.  Different classes might use
     * different Style objects because they might have different
     * style needs (such as text formatting or bezier positioning)
     *
     * Eventually will also query the groups to see if they have
     * any styles associated with them.
     */
    get style(): style.Style;
    set style(newStyle: style.Style);
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
    mergeAttributes(other: Music21Object): this;
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
    getContextByClass(className: ClassFilterType, options?: {}): any;
    contextSites(options?: {}): any;
    _getTimeSignatureForBeat(): TimeSignature;
    get beat(): number;
}
//# sourceMappingURL=base.d.ts.map