/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/renderOptions -- an object that defines the render options for a Stream
 *
 * note: no parallel in music21p except Style
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 * Options for rendering a stream
 *
 */
import { StaveConnector } from './types';
interface EventInterface {
    click: string | Function | undefined;
    dblclick: string | Function | undefined;
    resize?: string | Function | undefined;
}
interface ScaleFactor {
    x: number;
    y: number;
}
/**
 * An object that contains information on rendering the current stream
 *
 * Found on every Stream as `.renderOptions`
 */
export declare class RenderOptions {
    displayClef: boolean;
    displayTimeSignature: boolean;
    displayKeySignature: boolean;
    scaleFactor: ScaleFactor;
    top: number;
    left: number;
    width: number;
    overriddenWidth: number;
    height: number;
    marginBottom: number;
    lyricsLine: number;
    adjustMarginBottomForLyrics: boolean;
    systemIndex: number;
    partIndex: number;
    measureIndex: number;
    systemPadding: number;
    maxSystemWidth: number;
    leftBarline: string;
    rightBarline: string;
    staffLines: number;
    staffConnectors: StaveConnector[];
    staffPadding: number;
    events: EventInterface;
    useVexflowAutobeam: boolean;
    startNewSystem: boolean;
    startNewPage: boolean;
    showMeasureNumber: boolean;
    heightAboveStaff: number;
    heightOfStaffProper: number;
    heightBelowStaff: number;
    get staffAreaHeight(): number;
    deepClone(): RenderOptions;
}
export {};
//# sourceMappingURL=renderOptions.d.ts.map