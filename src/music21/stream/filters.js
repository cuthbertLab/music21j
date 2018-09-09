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
// TODO: OffsetFilter (high priority)
// TODO: OffsetHierarchyFilter
