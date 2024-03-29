import { StreamException } from '../exceptions21';
import * as filters from './filters';

// just for declaration
import type { Music21Object } from '../base';
import type { GeneralNote, NotRest } from '../note';
import type { Part, Stream, Voice } from '../stream';
import type {ClassFilterType} from '../types';

const StopIterationSingleton = filters.StopIterationSingleton;

// noinspection JSUnusedGlobalSymbols
export class StreamIteratorException extends StreamException {

}

export class StreamIteratorBase<T extends Music21Object = Music21Object> {
    srcStream: Stream<T>;
    index: number = 0;
    srcStreamElements: T[];
    streamLength: number;
    iterSection: string = '_elements';
    cleanupOnStop: boolean = false;
    restoreActiveSites: boolean;
    overrideDerivation;
    filters: filters.StreamFilter[];

    protected _len: number;
    protected _matchingElements: T[];

    sectionIndex: number = 0;
    activeInformation: any;

    constructor(
        srcStream: Stream<T>,
        {
            filterList = [],
            restoreActiveSites=true,
            activeInformation=undefined,
            ignoreSorting=false,
        }={}
    ) {
        if (!ignoreSorting && !srcStream.isSorted && srcStream.autoSort) {
            srcStream.sort();
        }
        this.srcStream = srcStream;
        this.srcStreamElements = srcStream.elements as T[];
        this.streamLength = this.srcStreamElements.length;

        this.restoreActiveSites = restoreActiveSites;
        this.overrideDerivation = undefined;
        if (!Array.isArray(filterList)) {
            filterList = [filterList];
        }
        this.filters = filterList;

        this.sectionIndex = 0;  // no endElements yet...

        if (activeInformation === undefined) {
            this.activeInformation = {};
            this.updateActiveInformation();
        } else {
            this.activeInformation = activeInformation;
        }
    }

    * [Symbol.iterator](): Generator<any, void, void> {
        this.reset();
        for (const el of this.srcStreamElements) {
            yield el;
        }
    }

    clone<TT extends Music21Object = T>(): StreamIteratorBase<TT> {
        const constructor = <typeof StreamIteratorBase><unknown> this.constructor;
        return <StreamIteratorBase<TT>><unknown> new constructor(
            this.srcStream,
            {
                filterList: [...this.filters],
                restoreActiveSites: this.restoreActiveSites,
                activeInformation: {...this.activeInformation},
            }
        );
    }

    map(func: (el: T) => any): any[] {
        return Array.from(this).map(func);
    }

    first(): T {
        // noinspection LoopStatementThatDoesntLoopJS
        for (const el of this) {  // eslint-disable-line no-unreachable-loop
            return el;
        }
        return undefined;
    }

    last(): T {
        const fe = this.matchingElements();
        if (!fe.length) {
            return undefined;
        }
        return fe[fe.length - 1];
    }

    get(k: number): T {
        const fe = this.matchingElements();
        if (k < 0) {
            k = fe.length + k;
        }
        return fe[k];
    }

    get length(): number {
        if (this._len !== undefined) {
            return this._len;
        }
        this._len = this.matchingElements().length;
        this.reset();
        return this._len;
    }

    updateActiveInformation(): void {
        const ai = this.activeInformation;
        ai.stream = this.srcStream;
        ai.index = this.index - 1;
        ai.iterSection = this.iterSection;
        ai.sectionIndex = this.sectionIndex;
    }

    reset(): void {
        this.index = 0;
        this.iterSection = '_elements';
        this.updateActiveInformation();
        for (const f of this.filters) {
            if (f.reset !== undefined) {
                f.reset();
            }
        }
    }

    resetCaches(): void {
        this._len = undefined;
        this._matchingElements = undefined;
    }

    cleanup(): void {
        if (this.cleanupOnStop) {
            this.reset();
            this.srcStream = undefined;
            this.srcStreamElements = [];
        }
    }

    matchingElements(): T[] {
        if (this._matchingElements !== undefined) {
            return <T[]><any[]> this._matchingElements;
        }

        const savedIndex = this.index;
        const savedRestoreActiveSites = this.restoreActiveSites;
        this.restoreActiveSites = true;

        const me = []; // matching elements
        for (const e of this) {
            me.push(e);
        }
        this.reset();
        this.index = savedIndex;
        this.restoreActiveSites = savedRestoreActiveSites;
        this._matchingElements = me;
        return me;
    }

    matchesFilters(e: Music21Object) {
        for (const f of this.filters) {
            const ret = f.call(e, this);
            if (ret === false) {
                return false; // must === false;
            }
            if (ret === StopIterationSingleton) {
                return ret;
            }
        }
        return true;
    }

    stream(): Stream<T> {
        const ss = this.srcStream;
        // let clearIsSorted = false;

        const found = ss.clone(false);
        found.elements = [];
        // derivation;
        const fe = this.matchingElements();
        for (const e of fe) {
            const stringReturns = true;
            const o = ss.elementOffset(e, stringReturns);
            // try: getOffsetInHierarchy...
            // string returns;
            found.insert(o, <Music21Object><any> e);
        }
        // if (fe.length) {
        //     found.coreElementsChanged()
        // }
        return found;
    }

    // noinspection JSUnusedGlobalSymbols
    get activeElementList() {
        return this.activeInformation.stream[this.activeInformation.iterSection];
    }

    /**
     * Returns a new StreamIterator with the filter added.
     */
    addFilter(newFilter: filters.StreamFilter): StreamIteratorBase<T> {
        for (const f of this.filters) {
            if (newFilter === f) {
                return this.clone(); // will not work... because == overrides.
            }
        }
        const clone = this.clone();
        clone.filters = [...clone.filters, newFilter];
        return clone;
    }

    /**
     * Returns a new StreamIterator with the filter removed.
     *
     * Silently ignores
     */
    removeFilter(oldFilter: filters.StreamFilter): StreamIteratorBase<T> {
        const index = this.filters.indexOf(oldFilter);
        const clone = this.clone();
        if (index !== -1) {
            clone.filters = clone.filters.toSpliced(index, 1);
        }
        return clone;
    }

    // getElementById(elementId) {
    //
    // }

    getElementsByClass(classFilterList: ClassFilterType) {
        return this.addFilter(new filters.ClassFilter(classFilterList));
    }

    getElementsNotOfClass(classFilterList: ClassFilterType) {
        return this.addFilter(new filters.ClassNotFilter(classFilterList));
    }

    // getElementsByGroup;
    // getElementsByOffset;
    getElementsByOffset(
        offsetStart: number,
        offsetEnd?: number,
        offsetOptions?: filters.OffsetFilterOptions,
    ) {
        return this.addFilter(new filters.OffsetFilter(offsetStart, offsetEnd, offsetOptions));
    }


    get notes() {
        return this.addFilter(new filters.ClassFilter('NotRest')) as unknown as StreamIteratorBase<NotRest>;
    }

    get notesAndRests() {
        return this.addFilter(new filters.ClassFilter('GeneralNote')) as unknown as StreamIteratorBase<GeneralNote>;
    }

    get parts() {
        return this.addFilter(new filters.ClassFilter('Part')) as unknown as StreamIteratorBase<Part>;
    }

    // noinspection JSUnusedGlobalSymbols
    get spanners() {
        return this.addFilter(new filters.ClassFilter('Spanner'));
    }

    get voices() {
        return this.addFilter(new filters.ClassFilter('Voice')) as unknown as StreamIteratorBase<Voice>;
    }
}

export class StreamIterator<T extends Music21Object = Music21Object> extends StreamIteratorBase<T> {

    * [Symbol.iterator](): Generator<T, void, void> {
        this.reset();
        while (this.index < this.streamLength) {
            // noinspection DuplicatedCode
            this.index += 1;
            let e: T;
            try {
                e = this.srcStreamElements[this.index - 1];
            } catch (exc) {
                continue;
            }
            const matches = this.matchesFilters(e);
            if (matches === false) {
                continue;
            }
            if (matches === StopIterationSingleton) {
                break;
            }
            if (this.restoreActiveSites) {
                e.activeSite = this.srcStream;
            }
            this.updateActiveInformation();
            yield e;
        }
        this.cleanup();
    }

}

export class OffsetIterator<T extends Music21Object = Music21Object> extends StreamIteratorBase<T> {

    * [Symbol.iterator](): Generator<T[], void, void> {
        this.reset();
        // this.sort();

        while (this.index < this.streamLength) {
            // noinspection DuplicatedCode
            this.index += 1;  // advance early
            let e: T;
            try {
                e = this.srcStreamElements[this.index - 1];  // backtrack
            } catch (exc) {
                continue;
            }
            const matches = this.matchesFilters(e);
            if (matches === false) {
                continue;
            }
            if (matches === StopIterationSingleton) {
                break;
            }
            const yieldEls = [e];
            const eOffset = this.srcStream.elementOffset(e);

            // allow forwardIndex == this.streamLength because this.index needs
            // to be incremented inside the loop before being decremented by updateActiveInformation
            // (when yielding whatever is in yieldEls)
            for (let forwardIndex = this.index; forwardIndex <= this.streamLength; forwardIndex++) {
                this.index = forwardIndex;
                const nextE = this.srcStreamElements[this.index];
                if (nextE === undefined) {
                    continue;
                }
                const nextOffset = this.srcStream.elementOffset(nextE);
                if (nextOffset !== eOffset) {
                    break;
                }
                if (!this.matchesFilters(nextE)) {
                    continue;
                }

                yieldEls.push(nextE);
            }

            if (this.restoreActiveSites) {
                for (const el of yieldEls) {
                    el.activeSite = this.srcStream;
                }
            }
            this.updateActiveInformation();
            yield yieldEls;
        }
        this.cleanup();
    }

}

export class RecursiveIterator<T extends Music21Object = Music21Object>
    extends StreamIteratorBase<T> {

    returnSelf: boolean;
    includeSelf: boolean;
    ignoreSorting: boolean;
    iteratorStartOffsetInHierarchy: number = 0.0;
    childRecursiveIterator: RecursiveIterator<T>;

    constructor(
        srcStream: Stream<T>,
        {
            filterList=[],
            restoreActiveSites=true,
            activeInformation=undefined,
            streamsOnly=false,
            includeSelf=false,
            ignoreSorting=false,
        }={}
    ) {
        super(srcStream, {
            filterList,
            restoreActiveSites,
            activeInformation,
            ignoreSorting,
        });
        this.returnSelf = includeSelf;
        this.includeSelf = includeSelf;
        this.ignoreSorting = ignoreSorting;
        if (streamsOnly) {
            this.filters.push(new filters.ClassFilter('Stream'));
        }
        this.childRecursiveIterator = undefined;
    }

    reset() {
        this.returnSelf = this.includeSelf;
        this.childRecursiveIterator = undefined;
        this.activeInformation.lastYielded = undefined;
        super.reset();
    }

    * [Symbol.iterator](): Generator<T, void, void> {
        this.reset(); // in __iter__.

        if (this.returnSelf && this.matchesFilters(this.srcStream)) {
            this.activeInformation.stream = undefined;
            this.activeInformation.index = -1;
            this.activeInformation.lastYielded = this.srcStream;
            this.returnSelf = false;
            yield <T><any> this.srcStream;
        } else if (this.returnSelf) {
            // did not match filters...
            this.returnSelf = false;
        }

        while (this.index < this.streamLength) {
            this.index += 1;
            const e = this.srcStreamElements[this.index - 1];
            if (e === undefined) {
                // maybe can happen if elements changed.
                continue;
            }
            if (this.matchesFilters(e)) {
                if (this.restoreActiveSites) {
                    e.activeSite = this.srcStream;
                }
                this.updateActiveInformation();
                this.activeInformation.lastYielded = e;
                yield <T><any> e;
            }

            if (e.isStream) {
                this.childRecursiveIterator = new RecursiveIterator<T>(
                    <Stream<T>><any> e,
                    {
                        restoreActiveSites: this.restoreActiveSites,
                        filterList: this.filters, // shared list
                        activeInformation: this.activeInformation, // shared
                        includeSelf: false,
                        ignoreSorting: this.ignoreSorting,
                        // parentIterator: this,
                        //
                    }
                );
                const newStartOffset = (
                    this.iteratorStartOffsetInHierarchy
                    + this.srcStream.elementOffset(e)
                );
                this.childRecursiveIterator.iteratorStartOffsetInHierarchy = newStartOffset;
                for (const e of this.childRecursiveIterator) {
                    yield e;
                }
                this.childRecursiveIterator = undefined;
            }
        }
        this.activeInformation.lastYielded = undefined;
        this.cleanup();
    }

    matchingElements() {
        // none of this may be necessary in JavaScript,
        // but perhaps if called during iteration.
        const savedRecursiveIterator = this.childRecursiveIterator;
        const fe = super.matchingElements();
        this.childRecursiveIterator = savedRecursiveIterator;
        return fe;
    }

    /**
     *   Returns a stack of RecursiveIterators at this point in the iteration.
     *   Last is most recent.
     */
    iteratorStack(): RecursiveIterator<T>[] {
        const iterStack: RecursiveIterator<T>[] = [this];
        let x: RecursiveIterator<T> = this;
        while (x.childRecursiveIterator !== undefined) {
            x = x.childRecursiveIterator;
            iterStack.push(x);
        }
        return iterStack;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     *   Returns a stack of Streams at this point.  Last is most recent.
     */
    streamStack() {
        return this.iteratorStack().map(iter => iter.srcStream);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     *  Called on the current iterator, returns the current offset
     *  in the hierarchy. or undefined if we are not currently iterating.
     */
    currentHierarchyOffset() {
        const lastYield = this.activeInformation.lastYielded;
        if (lastYield === undefined) {
            return undefined;
        }

        const iteratorStack = this.iteratorStack();
        const newestIterator = iteratorStack[iteratorStack.length - 1];
        const lastStream = newestIterator.srcStream;
        const lastStartOffset = newestIterator.iteratorStartOffsetInHierarchy;
        if (lastYield === lastStream) {
            return lastStartOffset;
        } else {
            return lastStartOffset + lastStream.elementOffset(lastYield);
        }
    }

    override getElementsByClass<TT extends T = T>(classFilterList: string): RecursiveIterator<TT>;
    override getElementsByClass<TT extends T = T>(classFilterList: string[]): RecursiveIterator<TT>;
    override getElementsByClass<TT extends T = T>(classFilterList: (new () => TT)): RecursiveIterator<TT>;
    override getElementsByClass<TT extends T = T>(classFilterList: (new () => T)[]): RecursiveIterator<TT>;
    override getElementsByClass<TT extends T = T>(classFilterList: ClassFilterType): RecursiveIterator<TT> {
        return super.getElementsByClass(classFilterList) as RecursiveIterator<TT>;
    }


    // TODO(msc): getElementsByOffsetInHierarchy


    // until we can figure out how to do this in pure typescript:
    get notes() {
        return super.notes as RecursiveIterator<NotRest>;
    }

    get notesAndRests() {
        return super.notesAndRests as RecursiveIterator<GeneralNote>;
    }

    get parts() {
        return super.parts as RecursiveIterator<Part>;
    }

    get voices() {
        return super.voices as RecursiveIterator<Voice>;
    }


}
