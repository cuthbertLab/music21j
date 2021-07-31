/**
 *
 * THIS IS CURRENTLY UNUSED
 * Does not work yet, so not documented
 *
 */
import * as stream from './stream';
/**
 * Divide a part up into systems and fix the measure
 * widths so that they are all even.
 *
 * Note that this is done on the part level even though
 * the measure widths need to be consistent across parts.
 *
 * This is possible because the system is deterministic and
 * will come to the same result for each part.  Opportunity
 * for making more efficient through this...
 */
export declare function makeLayoutFromScore(score: stream.Score, containerWidth: number): LayoutScore;
export declare class LayoutScore extends stream.Score {
    static get className(): string;
    scoreLayout: any;
    measureStart: number;
    measureEnd: number;
    protected _width: number;
    height: number;
    top: number;
    left: number;
    constructor();
    get pages(): stream.iterator.StreamIterator<import("./base").Music21Object>;
    get width(): any;
}
/**
 * All music must currently be on page 1.
 */
export declare class Page extends stream.Score {
    static get className(): string;
    pageNumber: number;
    measureStart: number;
    measureEnd: number;
    systemStart: number;
    systemEnd: number;
    pageLayout: any;
    _width: number;
    constructor();
    get systems(): stream.iterator.StreamIterator<import("./base").Music21Object>;
    get width(): any;
}
/**
 */
export declare class System extends stream.Score {
    static get className(): string;
    systemNumber: number;
    systemLayout: any;
    measureStart: number;
    measureEnd: number;
    protected _width: number;
    height: number;
    top: number;
    left: number;
    constructor();
    get staves(): stream.iterator.StreamIterator<import("./base").Music21Object>;
    get width(): any;
}
export declare class Staff extends stream.Part {
    static get className(): string;
    measureStart: number;
    measureEnd: number;
    staffNumber: number;
    optimized: number;
    top: number;
    left: number;
    protected _width: number;
    height: number;
    inheritedHeight: number;
    staffLayout: any;
    constructor();
    get width(): any;
}
//# sourceMappingURL=layout.d.ts.map