// import common from '../common.js';
import { Music21Exception } from '../exceptions21.js';

export class FilterException extends Music21Exception {

}

class _StopIteration {}

export const StopIterationSingleton = new _StopIteration();

export class StreamFilter {
    static get derivationStr() {
        return 'streamFilter';
    }

    reset() {}

    call(item, iterator) {
        return true;
    }
}

export class IsFilter extends StreamFilter {
    static get derivationStr() {
        return 'is';
    }

    constructor(target=[]) {
        super();
        if (!Array.isArray(target)) {
            target = [target];
        }
        this.target = target;
        this.numToFind = target.length;
    }

    reset() {
        this.numToFind = this.target.length;
    }

    call(item, iterator) {
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
    static get derivationStr() {
        return 'IsNot';
    }

    constructor(target) {
        super(target);
        this.numToFind = Number.MAX_SAFE_INTEGER;
    }

    reset() {}

    call(item, iterator) {
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

    constructor(classList=[]) {
        super();
        if (!Array.isArray(classList)) {
            classList = [classList];
        }
        this.classList = classList;
    }
    // TODO: __eq__

    call(item, iterator) {
        return item.isClassOrSubclass(this.classList);
    }
}

export class ClassNotFilter extends ClassFilter {
    static get derivationStr() {
        return 'getElementsNotOfClass';
    }

    call(item, iterator) {
        return !(super.call(item, iterator));
    }
}

// TODO: GroupFilter

export class OffsetFilter extends StreamFilter {
    static get derivationStr() {
        return 'getElementsByOffset';
    }
    
    constructor(
        offsetStart,
        offsetEnd,
        {
            includeEndBoundary=true,
            mustFinishInSpan=false,
            mustBeginInSpan=true,
            includeElementsThatEndAtStart=true,
        }={}) {
        super();
        this.offsetStart = offsetStart;
        this.offsetEnd = offsetEnd;
        this.includeEndBoundary = includeEndBoundary;
        this.mustFinishInSpan = mustFinishInSpan;
        this.mustBeginInSpan = mustBeginInSpan;
        this.includeElementsThatEndAtStart = includeElementsThatEndAtStart;

        
        this.zeroLengthSearch = false;
        if (offsetEnd === undefined) {
            self.offsetEnd = offsetStart;
            this.zeroLengthSearch = true;
        } else if (offsetEnd <= offsetStart) {
            this.zeroLengthSearch = true;
        }

    
    }
    
    call(item, iterator) {
        return this.isElementOffsetInRange(item, item.offset);
    }
    
    isElementOffsetInRange(e, offset) {
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

// TODO: OffsetFilter (high priority)
// TODO: OffsetHierarchyFilter
