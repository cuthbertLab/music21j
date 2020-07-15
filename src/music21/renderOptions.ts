/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/renderOptions -- an object that defines the render options for a Stream
 *
 * note: no parallel in music21p except Style
 *
 * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–19, Michael Scott Cuthbert and cuthbertLab
 *
 * renderOptions module, see {@link music21.renderOptions}
 * Options for rendering a stream
 *
 * @exports music21/renderOptions
 * @namespace music21.renderOptions
 * @memberof music21
 */

interface EventInterface {
    click: string|Function|undefined,
    dblclick: string|Function|undefined,
    resize?: string|Function|undefined,
}


/**
 * An object that contains information on rendering the current stream
 *
 * Found on every Stream as `.renderOptions`
 *
 * @memberof music21.renderOptions
 */
export class RenderOptions {
    displayClef: boolean = true;
    displayTimeSignature: boolean = true;
    displayKeySignature: boolean = true;

    scaleFactor = {
        x: 0.7,
        y: 0.7,
    };

    top: number = 0;
    left: number = undefined;
    width: number = undefined;
    overriddenWidth: number = undefined;
    height: number = undefined;
    naiveHeight: number = 120;

    // additional padding at the bottom of the stream (not every system).
    marginBottom: number = 0;

    systemIndex: number = 0;
    partIndex: number = 0;
    measureIndex: number = 0;

    systemPadding: number = undefined;
    naiveSystemPadding: number = 40;

    stemDirection: any = undefined;

    // this sets a fixed width for a system, not accounting for
    // scaleFactors.
    maxSystemWidth: number = undefined;

    rightBarline: string = undefined;
    staffLines: number = 5;
    staffConnectors: string[] = ['single', 'brace'];
    staffPadding: number = 60; // width...
    events: EventInterface = {
        click: 'play',
        dblclick: undefined,
        // resize
    };

    startNewSystem: boolean = false;
    // noinspection JSUnusedGlobalSymbols
    startNewPage: boolean = false;
    showMeasureNumber: boolean = undefined;
}
