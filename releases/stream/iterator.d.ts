import { StreamException } from '../exceptions21';
import type { Music21Object } from '../base';
import type { GeneralNote, NotRest } from '../note';
import type { Part, Stream, Voice } from '../stream';
export declare class StreamIteratorException extends StreamException {
}
declare class _StreamIteratorBase<T = Music21Object> {
    srcStream: Stream;
    index: number;
    srcStreamElements: Music21Object[];
    streamLength: number;
    iterSection: string;
    cleanupOnStop: boolean;
    restoreActiveSites: boolean;
    overrideDerivation: any;
    filters: any[];
    protected _len: number;
    protected _matchingElements: Music21Object[];
    sectionIndex: number;
    activeInformation: any;
    constructor(srcStream: Stream, { filterList, restoreActiveSites, activeInformation, ignoreSorting, }?: {
        filterList?: any[];
        restoreActiveSites?: boolean;
        activeInformation?: any;
        ignoreSorting?: boolean;
    });
    [Symbol.iterator](): Generator<any, void, void>;
    map(func: any): unknown[];
    first(): T;
    last(): T;
    get(k: any): T;
    get length(): number;
    updateActiveInformation(): void;
    reset(): void;
    resetCaches(): void;
    cleanup(): void;
    matchingElements(): T[];
    matchesFilters(e: Music21Object): any;
    stream(): Stream;
    get activeElementList(): any;
    addFilter(newFilter: any): this;
    removeFilter(oldFilter: any): this;
    getElementsByClass(classFilterList: string | string[] | typeof Music21Object | (typeof Music21Object)[]): this;
    getElementsNotOfClass(classFilterList: any): this;
    getElementsByOffset(offsetStart: any, ...args: any[]): this;
    get notes(): _StreamIteratorBase<NotRest>;
    get notesAndRests(): _StreamIteratorBase<GeneralNote>;
    get parts(): _StreamIteratorBase<Part>;
    get spanners(): this;
    get voices(): _StreamIteratorBase<Voice>;
}
export declare class StreamIterator<T = Music21Object> extends _StreamIteratorBase<T> {
    [Symbol.iterator](): Generator<T, void, void>;
}
export declare class OffsetIterator<T = Music21Object> extends _StreamIteratorBase<T> {
    nextToYield: T[];
    nextOffsetToYield: number;
    constructor(srcStream: any, options?: {});
    [Symbol.iterator](): Generator<T[], void, void>;
    reset(): void;
}
export declare class RecursiveIterator<T = Music21Object> extends _StreamIteratorBase<T> {
    returnSelf: boolean;
    includeSelf: boolean;
    ignoreSorting: boolean;
    iteratorStartOffsetInHierarchy: number;
    childRecursiveIterator: RecursiveIterator<T>;
    constructor(srcStream: Stream, { filterList, restoreActiveSites, activeInformation, streamsOnly, includeSelf, ignoreSorting, }?: {
        filterList?: any[];
        restoreActiveSites?: boolean;
        activeInformation?: any;
        streamsOnly?: boolean;
        includeSelf?: boolean;
        ignoreSorting?: boolean;
    });
    reset(): void;
    [Symbol.iterator](): Generator<T, void, void>;
    matchingElements(): T[];
    /**
     *   Returns a stack of RecursiveIterators at this point in the iteration.
     *   Last is most recent.
     */
    iteratorStack(): RecursiveIterator<T>[];
    /**
     *   Returns a stack of Streams at this point.  Last is most recent.
     */
    streamStack(): Stream[];
    /**
     *  Called on the current iterator, returns the current offset
     *  in the hierarchy. or undefined if we are not currently iterating.
     */
    currentHierarchyOffset(): number;
    get notes(): RecursiveIterator<NotRest>;
    get notesAndRests(): RecursiveIterator<GeneralNote>;
    get parts(): RecursiveIterator<Part>;
    get voices(): RecursiveIterator<Voice>;
}
export {};
//# sourceMappingURL=iterator.d.ts.map