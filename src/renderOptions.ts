/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/renderOptions -- an object that defines the render options for a Stream
 *
 * note: no parallel in music21p except Style
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * Options for rendering a stream
 *
 */

interface EventInterface {
    click: string|Function|undefined,
    dblclick: string|Function|undefined,
    resize?: string|Function|undefined,
}

interface ScaleFactor {
    x: number,
    y: number,
}


/**
 * An object that contains information on rendering the current stream
 *
 * Found on every Stream as `.renderOptions`
 */
export class RenderOptions {
    displayClef: boolean = true;
    displayTimeSignature: boolean = true;
    displayKeySignature: boolean = true;

    scaleFactor: ScaleFactor = {
        x: 0.7,
        y: 0.7,
    };

    top: number = 0;
    left: number = undefined;
    width: number = undefined;
    overriddenWidth: number = undefined;
    height: number = undefined;

    // additional padding at the bottom of the stream
    // (not every system).
    marginBottom: number = 0;

    systemIndex: number = 0;
    partIndex: number = 0;
    measureIndex: number = 0;

    // amount of space between systems on a Score object
    // does nothing on any other object.  Defaults to 0 for everything
    // except Score which overrides in constructor to 40.
    systemPadding: number = 0;

    // this sets a fixed width for a system, not accounting for
    // scaleFactors.
    maxSystemWidth: number = undefined;

    leftBarline: string = undefined;  // render() sets to 'none' for system beginnings
    rightBarline: string = undefined;

    staffLines: number = 5;
    staffConnectors: string[] = ['single', 'brace'];
    staffPadding: number = 60; // width...
    events: EventInterface = {
        click: 'play',
        dblclick: undefined,
        // resize
    };

    useVexflowAutobeam: boolean = false;

    startNewSystem: boolean = false;
    // noinspection JSUnusedGlobalSymbols
    startNewPage: boolean = false;
    showMeasureNumber: boolean = undefined;

    heightAboveStaff: number = 20;
    heightOfStaffProper: number = 80;
    heightBelowStaff: number = 20;

    // was naiveHeight
    get staffAreaHeight(): number {
        return this.heightAboveStaff + this.heightOfStaffProper + this.heightBelowStaff;
    }

    deepClone(): RenderOptions {
        // TODO(MSC): allow for subclassing...
        const out = new RenderOptions();
        for (const [key, value] of Object.entries(this)) {
            if (['scaleFactor', 'staffConnectors', 'events'].includes(key)) {
                continue;
            }
            out[key] = value;
        }
        out.scaleFactor.x = this.scaleFactor.x;
        out.scaleFactor.y = this.scaleFactor.y;
        out.staffConnectors = [...this.staffConnectors];
        out.events = {...this.events};
        return out;
    }
}
