import { Music21Exception } from '../exceptions21';
import type {Music21Object} from '../base';
import type {StreamIteratorBase} from './iterator';
import type {ClassFilterType} from '../types';

export class FilterException extends Music21Exception {}

class _StopIteration {}

export const StopIterationSingleton = new _StopIteration();

export class StreamFilter {
    static get derivationStr(): string {
        return 'streamFilter';
    }

    reset() {}

    call(_item: Music21Object, _iterator: StreamIteratorBase): boolean|_StopIteration {
        return true;
    }
}

export class IsFilter extends StreamFilter {
    static override get derivationStr() {
        return 'is';
    }

    target: any[];
    numToFind: number;

    constructor(target: any|any[] =[]) {
        super();
        if (!Array.isArray(target)) {
            target = [target];
        }
        this.target = target;
        this.numToFind = target.length;
    }

    override reset(): void {
        this.numToFind = this.target.length;
    }

    override call(item: Music21Object, _iterator: StreamIteratorBase): boolean|_StopIteration {
        if (this.numToFind === 0) {
            return StopIterationSingleton;
        }
        if (this.target.includes(item)) {
            this.numToFind -= 1;
            return true;
        } else {
            return false;
        }
    }
}

export class IsNotFilter extends IsFilter {
    static override get derivationStr(): string {
        return 'IsNot';
    }

    constructor(target: any|any[] =[]) {
        super(target);
        this.numToFind = Number.MAX_SAFE_INTEGER;
    }

    override reset(): void {}

    override call(item: Music21Object, iterator: StreamIteratorBase): boolean|_StopIteration {
        const ret = super.call(item, iterator);
        if (ret === StopIterationSingleton) {
            return ret;
        } else {
            return !ret;
        }
    }
}

// TODO(msc): IdFilter

export class ClassFilter extends StreamFilter {
    static get derivationStr() {
        return 'getElementsByClass';
    }

    classList: string[]|(new() => Music21Object)[];

    constructor(classList: ClassFilterType = []) {
        super();
        let classListArray: string[]|(new() => Music21Object)[];
        if (!Array.isArray(classList)) {
            classListArray = <string[]|(new() => Music21Object)[]> [classList];
        } else {
            classListArray = classList;
        }
        this.classList = classListArray;
    }
    // TODO: __eq__

    override call(item: Music21Object, _iterator: StreamIteratorBase): boolean {
        return item.isClassOrSubclass(this.classList);
    }
}

export class ClassNotFilter extends ClassFilter {
    static override get derivationStr(): string {
        return 'getElementsNotOfClass';
    }

    override call(item: Music21Object, iterator: StreamIteratorBase): boolean {
        return !(super.call(item, iterator));
    }
}

// TODO: GroupFilter
export interface OffsetFilterOptions {
    includeEndBoundary?: boolean;
    mustFinishInSpan?: boolean;
    mustBeginInSpan?: boolean;
    includeElementsThatEndAtStart?: boolean;
}

export class OffsetFilter extends StreamFilter {
    static override get derivationStr(): string {
        return 'getElementsByOffset';
    }

    offsetStart: number;
    offsetEnd: number;
    includeEndBoundary: boolean;
    mustFinishInSpan: boolean;
    mustBeginInSpan: boolean;
    includeElementsThatEndAtStart: boolean;
    zeroLengthSearch: boolean = false;

    constructor(
        offsetStart: number,
        offsetEnd: number = undefined,
        {
            includeEndBoundary=true,
            mustFinishInSpan=false,
            mustBeginInSpan=true,
            includeElementsThatEndAtStart=true,
        }: OffsetFilterOptions = {}
    ) {
        super();
        this.offsetStart = offsetStart;
        this.offsetEnd = offsetEnd;
        this.includeEndBoundary = includeEndBoundary;
        this.mustFinishInSpan = mustFinishInSpan;
        this.mustBeginInSpan = mustBeginInSpan;
        this.includeElementsThatEndAtStart = includeElementsThatEndAtStart;

        if (offsetEnd === undefined) {
            this.offsetEnd = offsetStart;
            this.zeroLengthSearch = true;
        } else if (offsetEnd <= offsetStart) {
            this.zeroLengthSearch = true;
        }


    }

    override call(item: Music21Object, iterator: StreamIteratorBase): boolean {
        // N.B. iterator.srcStream.elementOffset is necessary instead
        // of elementOffset, because we have not set activeSite yet.
        return this.isElementOffsetInRange(
            item,
            iterator.srcStream.elementOffset(item)
        );
    }

    isElementOffsetInRange(e: Music21Object, offset: number): boolean {
        if (offset > this.offsetEnd) {
            // anything that begins after the span is definitely out.
            return false;
        }
        const dur = e.duration;
        const elementEnd = offset + dur.quarterLength;
        if (elementEnd < this.offsetStart) {
            // anything that finishes before the span ends is definitely out
            return false;
        }

        // some part of the element is at least touching some part of span.

        let elementIsZeroLength = false;
        if (dur.quarterLength === 0) {
            elementIsZeroLength = true;
        }
        if (this.zeroLengthSearch && elementIsZeroLength) {
            return true;
        }

        if (this.mustFinishInSpan) {
            if (elementEnd > this.offsetEnd) {
                return false;
            }
            if (!this.includeEndBoundary && offset === this.offsetEnd) {
                return false;
            }
        }

        if (this.mustBeginInSpan) {
            if (offset < this.offsetStart) {
                return false;
            }
            if (!this.includeEndBoundary && offset === this.offsetEnd) {
                return false;
            }
        } else if (!elementIsZeroLength && elementEnd === this.offsetEnd && this.zeroLengthSearch) {
            return false;
        }

        if (!this.includeEndBoundary && offset === this.offsetEnd) {
            return false;
        }
        if (!this.includeElementsThatEndAtStart && elementEnd === this.offsetStart) {
            return false;
        }
        return true;
    }
}

// TODO: OffsetHierarchyFilter
