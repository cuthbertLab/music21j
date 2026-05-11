import { Music21Exception } from '../exceptions21';
import type { Music21Object } from '../base';
import type { StreamIteratorBase } from './iterator';
import type { ClassFilterType } from '../types';
export declare class FilterException extends Music21Exception {
}
declare class _StopIteration {
}
export declare const StopIterationSingleton: _StopIteration;
export declare class StreamFilter {
    static get derivationStr(): string;
    reset(): void;
    call(_item: Music21Object, _iterator: StreamIteratorBase): boolean | _StopIteration;
}
export declare class IsFilter extends StreamFilter {
    static get derivationStr(): string;
    target: any[];
    numToFind: number;
    constructor(target?: any | any[]);
    reset(): void;
    call(item: Music21Object, _iterator: StreamIteratorBase): boolean | _StopIteration;
}
export declare class IsNotFilter extends IsFilter {
    static get derivationStr(): string;
    constructor(target?: any | any[]);
    reset(): void;
    call(item: Music21Object, iterator: StreamIteratorBase): boolean | _StopIteration;
}
export declare class ClassFilter extends StreamFilter {
    static get derivationStr(): string;
    classList: string[] | (new () => Music21Object)[];
    constructor(classList?: ClassFilterType);
    call(item: Music21Object, _iterator: StreamIteratorBase): boolean;
}
export declare class ClassNotFilter extends ClassFilter {
    static get derivationStr(): string;
    call(item: Music21Object, iterator: StreamIteratorBase): boolean;
}
export interface OffsetFilterOptions {
    includeEndBoundary?: boolean;
    mustFinishInSpan?: boolean;
    mustBeginInSpan?: boolean;
    includeElementsThatEndAtStart?: boolean;
}
export declare class OffsetFilter extends StreamFilter {
    static get derivationStr(): string;
    offsetStart: number;
    offsetEnd: number;
    includeEndBoundary: boolean;
    mustFinishInSpan: boolean;
    mustBeginInSpan: boolean;
    includeElementsThatEndAtStart: boolean;
    zeroLengthSearch: boolean;
    constructor(offsetStart: number, offsetEnd?: number, { includeEndBoundary, mustFinishInSpan, mustBeginInSpan, includeElementsThatEndAtStart, }?: OffsetFilterOptions);
    call(item: Music21Object, iterator: StreamIteratorBase): boolean;
    isElementOffsetInRange(e: Music21Object, offset: number): boolean;
}
export {};
//# sourceMappingURL=filters.d.ts.map