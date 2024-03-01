import { StreamException } from '../exceptions21';
import type { Music21Object } from '../base';
import type { GeneralNote, NotRest } from '../note';
import type { Part, Stream, Voice } from '../stream';
import type { ClassFilterType } from '../types';
export declare class StreamIteratorException extends StreamException {
}
export declare class StreamIteratorBase<T extends Music21Object = Music21Object> {
    srcStream: Stream<T>;
    index: number;
    srcStreamElements: T[];
    streamLength: number;
    iterSection: string;
    cleanupOnStop: boolean;
    restoreActiveSites: boolean;
    overrideDerivation: any;
    filters: any[];
    protected _len: number;
    protected _matchingElements: T[];
    sectionIndex: number;
    activeInformation: any;
    constructor(srcStream: Stream<T>, { filterList, restoreActiveSites, activeInformation, ignoreSorting, }?: {
        filterList?: any[];
        restoreActiveSites?: boolean;
        activeInformation?: any;
        ignoreSorting?: boolean;
    });
    [Symbol.iterator](): Generator<any, void, void>;
    map(func: (el: T) => any): any[];
    first(): T;
    last(): T;
    get(k: number): T;
    get length(): number;
    updateActiveInformation(): void;
    reset(): void;
    resetCaches(): void;
    cleanup(): void;
    matchingElements(): T[];
    matchesFilters(e: Music21Object): any;
    stream(): Stream<T>;
    get activeElementList(): any;
    addFilter(newFilter: any): this;
    removeFilter(oldFilter: any): this;
    getElementsByClass(classFilterList: ClassFilterType): this;
    getElementsNotOfClass(classFilterList: ClassFilterType): this;
    getElementsByOffset(offsetStart: number, ...args: any[]): this;
    get notes(): StreamIteratorBase<NotRest>;
    get notesAndRests(): StreamIteratorBase<GeneralNote>;
    get parts(): StreamIteratorBase<Part>;
    get spanners(): this;
    get voices(): StreamIteratorBase<Voice>;
}
export declare class StreamIterator<T extends Music21Object = Music21Object> extends StreamIteratorBase<T> {
    [Symbol.iterator](): Generator<T, void, void>;
}
export declare class OffsetIterator<T extends Music21Object = Music21Object> extends StreamIteratorBase<T> {
    [Symbol.iterator](): Generator<T[], void, void>;
}
export declare class RecursiveIterator<T extends Music21Object = Music21Object> extends StreamIteratorBase<T> {
    returnSelf: boolean;
    includeSelf: boolean;
    ignoreSorting: boolean;
    iteratorStartOffsetInHierarchy: number;
    childRecursiveIterator: RecursiveIterator<T>;
    constructor(srcStream: Stream<T>, { filterList, restoreActiveSites, activeInformation, streamsOnly, includeSelf, ignoreSorting, }?: {
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
    streamStack(): Stream<T>[];
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
//# sourceMappingURL=iterator.d.ts.map