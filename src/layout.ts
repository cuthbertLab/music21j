/**
 *
 * THIS IS CURRENTLY UNUSED
 * Does not work yet, so not documented
 *
 */
// future -- rewrite of Score and Part to Page, System, SystemPart
// not currently used
// import * as $ from 'jquery';
//
// import { base } from './base';
// import { renderOptions } from './renderOptions';

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
export function makeLayoutFromScore(
    score: stream.Score,
    containerWidth: number,
): LayoutScore {
    const parts = score.parts.stream();
    // console.log(parts);
    const numParts = parts.length;
    const partZero = parts.get(0) as stream.Part;
    const numMeasures = partZero.getElementsByClass('Measure').length;

    const measureWidths = partZero.getMeasureWidths();
    const maxSystemWidth
        = containerWidth || score.maxSystemWidth; /* of course fix! */

    const layoutScore = new LayoutScore();
    const currentPage = new Page(); // to-do multiple pages...
    currentPage.measureStart = 1;
    currentPage.measureEnd = numMeasures;

    layoutScore.insert(0, currentPage);

    let currentSystem = new System();
    let currentSystemNumber = 1;
    currentSystem.measureStart = 1;
    let currentStaves: Staff[] = [];

    const staffMaker = (staffHolder, numParts, measureStart) => {
        for (let pNum = 0; pNum < numParts; pNum++) {
            const staff = new Staff();
            staff.measureStart = measureStart;
            staff.staffNumber = pNum + 1;
            staffHolder.push(staff);
        }
    };
    staffMaker(currentStaves, numParts, 1);

    // noinspection JSMismatchedCollectionQueryUpdate
    const systemCurrentWidths = [];
    // noinspection JSMismatchedCollectionQueryUpdate
    const systemBreakIndexes = [];

    let lastSystemBreak = 0; /* needed to ensure each line has at least one measure */
    const startLeft = 20; /* TODO: make it obtained elsewhere */
    let currentLeft = startLeft;
    // let currentSystemTop = 0;
    // var partTopOffsets = [];
    // const ignoreSystemsInCalculatingScoreHeight = true;
    // const systemHeight = score.estimateStreamHeight(ignoreSystemsInCalculatingScoreHeight);

    for (let i = 0; i < measureWidths.length; i++) {
        const currentRight = currentLeft + measureWidths[i];
        /* console.log("left: " + currentLeft + " ; right: " + currentRight + " ; m: " + i); */
        if (currentRight > maxSystemWidth && lastSystemBreak !== i) {
            // new system...
            for (let j = 0; j < currentStaves.length; j++) {
                currentStaves[j].measureEnd = i;
                currentSystem.insert(0, currentStaves[j]);
            }
            currentStaves = [];
            staffMaker(currentStaves, numParts, i + 1);
            // currentSystemTop += systemHeight;
            currentSystem.measureEnd = i;
            currentPage.insert(0, currentSystem);
            currentSystemNumber += 1;
            currentSystem = new System();
            currentSystem.measureStart = i + 1;
            currentSystem.systemNumber = currentSystemNumber;

            systemBreakIndexes.push(i - 1);
            systemCurrentWidths.push(currentLeft);
            console.log(
                'setting new width at ' + currentLeft + ' measure ' + i
            );
            currentLeft = startLeft + measureWidths[i];
            lastSystemBreak = i;
        } else {
            currentLeft = currentRight;
        }
        for (let pNum = 0; pNum < currentStaves.length; pNum++) {
            currentStaves[pNum].append((parts.get(pNum) as stream.Part).get(i));
        }
    }
    for (let j = 0; j < currentStaves.length; j++) {
        currentStaves[j].measureEnd = measureWidths.length - 1;
        currentSystem.insert(0, currentStaves[j]);
    }
    currentPage.insert(0, currentSystem);
    return layoutScore;
}

export class LayoutScore extends stream.Score {
    static get className() { return 'music21.layout.LayoutScore'; }

    scoreLayout;
    measureStart: number;
    measureEnd: number;
    protected _width: number;
    height: number;
    top: number;
    left: number;

    constructor() {
        super();
        this.scoreLayout = undefined;
        this.measureStart = undefined;
        this.measureEnd = undefined;
        this._width = undefined;
        this.height = undefined;
        this.top = 0;
        this.left = 0;
    }

    get pages() {
        return this.getElementsByClass('Page');
    }

    get width() {
        if (this._width) {
            return this._width;
        } else if (this.activeSite) {
            return this.activeSite.width;
        } else {
            return undefined;
        }
    }
    // /**
    //  * return a tuple of (top, bottom) for a staff, specified by a given pageId,
    //  * systemId, and staffId in PIXELS.
    //
    //  * @param pageId
    //  * @param systemId
    //  * @param staffId
    //  * @param units -- "pixels" or "tenths" (not supported)
    //  */
    //
    // getPositionForStaff(pageId, systemId, staffId, units) {
    //     units = units || 'pixels';
    // }
}

/**
 * All music must currently be on page 1.
 */
export class Page extends stream.Score {
    static get className() { return 'music21.layout.Page'; }

    pageNumber: number;
    measureStart: number;
    measureEnd: number;
    systemStart: number;
    systemEnd: number;
    pageLayout;
    _width: number;

    constructor() {
        super();
        this.pageNumber = 1;
        this.measureStart = undefined;
        this.measureEnd = undefined;
        this.systemStart = undefined;
        this.systemEnd = undefined;
        this.pageLayout = undefined;
    }

    get systems() {
        return this.getElementsByClass('System');
    }

    get width() {
        if (this._width) {
            return this._width;
        } else if (this.activeSite) {
            return this.activeSite.width;
        } else {
            return undefined;
        }
    }
}

/**
 */
export class System extends stream.Score {
    static get className() { return 'music21.layout.System'; }

    systemNumber: number;
    systemLayout;
    measureStart: number;
    measureEnd: number;
    protected _width: number;
    height: number;
    top: number;
    left: number;

    constructor() {
        super();
        this.systemNumber = 1;
        this.systemLayout = undefined;
        this.measureStart = undefined;
        this.measureEnd = undefined;
        this.height = undefined;
        this.top = undefined;
        this.left = undefined;
    }

    get staves() {
        return this.getElementsByClass('Staff');
    }

    get width() {
        if (this._width) {
            return this._width;
        } else if (this.activeSite) {
            return this.activeSite.width;
        } else {
            return undefined;
        }
    }
}

export class Staff extends stream.Part {
    static get className() { return 'music21.layout.Staff'; }

    measureStart: number;
    measureEnd: number;
    staffNumber: number;
    optimized: number;
    top: number;
    left: number;
    protected _width: number;
    height: number;
    inheritedHeight: number;
    staffLayout;

    constructor() {
        super();
        this.staffNumber = 1;
        this.optimized = 0;
        this.top = undefined;
        this.left = undefined;
        this._width = undefined;
        this.height = undefined;
        this.inheritedHeight = undefined;
        this.staffLayout = undefined;
    }

    get width() {
        if (this._width) {
            return this._width;
        } else if (this.activeSite) {
            return this.activeSite.width;
        } else {
            return undefined;
        }
    }
}
