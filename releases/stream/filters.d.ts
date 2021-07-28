import { Music21Exception } from '../exceptions21';
export declare class FilterException extends Music21Exception {
}
declare class _StopIteration {
}
export declare const StopIterationSingleton: _StopIteration;
/**
 * @memberof music21.stream.filters
 */
export declare class StreamFilter {
    static get derivationStr(): string;
    reset(): void;
    call(item: any, iterator: any): boolean | _StopIteration;
}
export declare class IsFilter extends StreamFilter {
    static get derivationStr(): string;
    target: any[];
    numToFind: number;
    constructor(target?: any | any[]);
    reset(): void;
    call(item: any, iterator: any): boolean | _StopIteration;
}
export declare class IsNotFilter extends IsFilter {
    static get derivationStr(): string;
    constructor(target: any);
    reset(): void;
    call(item: any, iterator: any): _StopIteration;
}
export declare class ClassFilter extends StreamFilter {
    static get derivationStr(): string;
    classList: string[];
    constructor(classList?: string | string[]);
    call(item: any, iterator: any): any;
}
export declare class ClassNotFilter extends ClassFilter {
    static get derivationStr(): string;
    call(item: any, iterator: any): boolean;
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
    constructor(offsetStart: number, offsetEnd?: any, { includeEndBoundary, mustFinishInSpan, mustBeginInSpan, includeElementsThatEndAtStart, }?: {
        includeEndBoundary?: boolean;
        mustFinishInSpan?: boolean;
        mustBeginInSpan?: boolean;
        includeElementsThatEndAtStart?: boolean;
    });
    call(item: any, iterator: any): boolean;
    isElementOffsetInRange(e: any, offset: any): boolean;
}
export {};
//# sourceMappingURL=filters.d.ts.map