import { StreamException } from '../exceptions21';
import * as filters from './filters';

// just for declaration
import type { Music21Object } from '../base';
import type { GeneralNote, NotRest } from '../note';
import type { Part, Stream, Voice } from '../stream';

const StopIterationSingleton = filters.StopIterationSingleton;

// noinspection JSUnusedGlobalSymbols
export class StreamIteratorException extends StreamException {

}

class _StreamIteratorBase<T = Music21Object> {
    srcStream: Stream;
    index: number = 0;
    srcStreamElements: Music21Object[];
    streamLength: number;
    iterSection: string = '_elements';
    cleanupOnStop: boolean = false;
    restoreActiveSites: boolean;
    overrideDerivation;
    filters: any[];

    protected _len: number;
    protected _matchingElements: Music21Object[];

    sectionIndex: number = 0;
    activeInformation: any;

    constructor(
        srcStream: Stream,
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
        this.srcStreamElements = srcStream.elements as Music21Object[];
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

    map(func) {
        return Array.from(this).map(func);
    }

    get(k): T {
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

    updateActiveInformation() {
        const ai = this.activeInformation;
        ai.stream = this.srcStream;
        ai.index = this.index - 1;
        ai.iterSection = this.iterSection;
        ai.sectionIndex = this.sectionIndex;
    }

    reset() {
        this.index = 0;
        this.iterSection = '_elements';
        this.updateActiveInformation();
        for (const f of this.filters) {
            if (f.reset !== undefined) {
                f.reset();
            }
        }
    }

    resetCaches() {
        this._len = undefined;
        this._matchingElements = undefined;
    }

    cleanup() {
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

    stream() {
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

    addFilter(newFilter) {
        for (const f of this.filters) {
            if (newFilter === f) {
                return this; // will not work... because == overrides.
            }
        }
        this.filters.push(newFilter);
        this.resetCaches();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    removeFilter(oldFilter) {
        const index = this.filters.indexOf(oldFilter);
        if (index !== -1) {
            this.filters.splice(index, 1);
        }
        this.resetCaches();
        return this;
    }

    // getElementById(elementId) {
    //
    // }

    getElementsByClass(classFilterList) {
        return this.addFilter(new filters.ClassFilter(classFilterList));
    }

    getElementsNotOfClass(classFilterList) {
        return this.addFilter(new filters.ClassNotFilter(classFilterList));
    }

    // getElementsByGroup;
    // getElementsByOffset;
    getElementsByOffset(offsetStart, ...args) {
        return this.addFilter(new filters.OffsetFilter(offsetStart, ...args));
    }


    get notes() {
        return this.addFilter(new filters.ClassFilter('NotRest')) as unknown as _StreamIteratorBase<NotRest>;
    }

    get notesAndRests() {
        return this.addFilter(new filters.ClassFilter('GeneralNote')) as unknown as _StreamIteratorBase<GeneralNote>;
    }

    get parts() {
        return this.addFilter(new filters.ClassFilter('Part')) as unknown as _StreamIteratorBase<Part>;
    }

    // noinspection JSUnusedGlobalSymbols
    get spanners() {
        return this.addFilter(new filters.ClassFilter('Spanner'));
    }

    get voices() {
        return this.addFilter(new filters.ClassFilter('Voice')) as unknown as _StreamIteratorBase<Voice>;
    }
}

export class StreamIterator<T = Music21Object> extends _StreamIteratorBase<T> {

    * [Symbol.iterator](): Generator<T, void, void> {
        this.reset();
        while (this.index < this.streamLength) {
            // noinspection DuplicatedCode
            this.index += 1;
            let e;
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

export class OffsetIterator<T = Music21Object> extends _StreamIteratorBase<T> {
    nextToYield: T[];
    nextOffsetToYield: number;

    constructor(srcStream, options={}) {
        super(srcStream, options);
        this.nextToYield = [];
    }

    * [Symbol.iterator](): Generator<T[], void, void> {
        this.reset();
        // this.sort();

        while (this.index < this.streamLength) {
            // noinspection DuplicatedCode
            this.index += 1;
            let e;
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
            const yieldEls = [e];
            const eOffset = this.srcStream.elementOffset(e);

            for (let forwardIndex = this.index; forwardIndex < this.streamLength; forwardIndex++) {
                let nextE;
                try {
                    nextE = this.srcStreamElements[this.index - 1];
                } catch (exc) {
                    continue;
                }
                const nextOffset = this.srcStream.elementOffset(nextE);
                if (nextOffset !== eOffset) {
                    this.nextToYield = [nextE];
                    this.nextOffsetToYield = nextOffset;
                    break;
                }
                if (!this.matchesFilters(nextE)) {
                    continue;
                }

                yieldEls.push(e);
                this.index = forwardIndex;
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

    reset() {
        super.reset();
        this.nextToYield = [];
        this.nextOffsetToYield = undefined;
    }
}

export class RecursiveIterator<T = Music21Object> extends _StreamIteratorBase<T> {
    returnSelf: boolean;
    includeSelf: boolean;
    ignoreSorting: boolean;
    iteratorStartOffsetInHierarchy: number = 0.0;
    childRecursiveIterator: RecursiveIterator<T>;

    constructor(
        srcStream: Stream,
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
                this.childRecursiveIterator = new RecursiveIterator(
                    <Stream><any> e,
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
    // TODO(msc): getElementsByOffsetInHierarchy
}
