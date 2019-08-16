/**
 *
 * THIS IS CURRENTLY UNUSED
 * Does not work yet, so not documented
 *
 * @namespace music21.layout
 */
// future -- rewrite of Score and Part to Page, System, SystemPart
// not currently used
// import * as $ from 'jquery';
//
// import { base } from './base.js';
// import { renderOptions } from './renderOptions.js';

import * as stream from './stream.js';

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
 *
 * @param {music21.stream.Score} score
 * @param {number} containerWidth
 * @returns {LayoutScore}
 */
export function makeLayoutFromScore(
    score,
    containerWidth
) {
    // var systemHeight = score.systemHeight; /* part.show() called... */
    // var systemPadding = score.systemPadding;
    const parts = score.parts;
    // console.log(parts);
    const numParts = parts.length;
    const partZero = parts.get(0);
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
    let currentStaves = [];

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
                currentStaves.measureEnd = i;
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
            currentStaves[pNum].append(parts[pNum].get(i));
        }
    }
    for (let j = 0; j < currentStaves.length; j++) {
        currentStaves.measureEnd = measureWidths.length - 1;
        currentSystem.insert(0, currentStaves[j]);
    }
    currentPage.insert(0, currentSystem);
    return layoutScore;
}

/**
 * @extends music21.stream.Score
 * @property {number|undefined} measureStart
 * @property {number|undefined} measureEnd
 * @property {number|undefined} width
 * @property {number|undefined} height
 */
export class LayoutScore extends stream.Score {
    static get className() { return 'music21.layout.LayoutScore'; }

    constructor() {
        super();
        this.scoreLayout = undefined;
        this.measureStart = undefined;
        this.measureEnd = undefined;
        /**
         *
         * @type {number|undefined}
         * @private
         */
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
 *
 * @extends music21.stream.Score
 * @property {number|undefined} measureStart
 * @property {number|undefined} measureEnd
 * @property {number|undefined} systemStart
 * @property {number|undefined} systemEnd
 */
export class Page extends stream.Score {
    static get className() { return 'music21.layout.Page'; }

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
 * @extends music21.stream.Score
 * @property {number|undefined} measureStart
 * @property {number|undefined} measureEnd
 * @property {number|undefined} width
 * @property {number|undefined} height
 * @property {number|undefined} top
 * @property {number|undefined} left
 */
export class System extends stream.Score {
    static get className() { return 'music21.layout.System'; }

    constructor() {
        super();
        this.systemNumber = 1;
        this.systemLayout = undefined;
        this.measureStart = undefined;
        this.measureEnd = undefined;
        /**
         *
         * @type {number|undefined}
         * @private
         */
        this._width = undefined;
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

/**
 * @extends music21.stream.Score
 *
 */
export class Staff extends stream.Part {
    static get className() { return 'music21.layout.Staff'; }

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
