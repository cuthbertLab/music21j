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
import * as common from './common.js';

/**
 * An object that contains information on rendering the current stream
 *
 * Found on every Stream as `.renderOptions`
 *
 * @class RenderOptions
 * @memberof music21.renderOptions
 */
export class RenderOptions {
    constructor() {
        const defaultOptions = {
            displayClef: true,
            displayTimeSignature: true,
            displayKeySignature: true,

            scaleFactor: { x: 0.7, y: 0.7 },

            top: 0,
            /**
             * @type {number|undefined}
             */
            left: undefined,
            /**
             * @type {number|undefined}
             */
            width: undefined,
            /**
             * @type {number|undefined}
             */
            overriddenWidth: undefined,
            /**
             * @type {number|undefined}
             */
            height: undefined,
            naiveHeight: 120,

            systemIndex: 0,
            partIndex: 0,
            measureIndex: 0,

            systemMeasureIndex: 0,
            /**
             * @type {number|undefined}
             */
            systemPadding: undefined,
            naiveSystemPadding: 40,

            stemDirection: undefined,

            /**
             * @type {number|undefined}
             */
            maxSystemWidth: undefined,
            rightBarline: undefined,
            staffLines: 5,
            staffConnectors: ['single', 'brace'],
            staffPadding: 60, // width...
            events: {
                click: 'play',
                dblclick: undefined,
                // resize
            },
            startNewSystem: false,
            startNewPage: false,
            /**
             * @type {boolean|undefined}
             */
            showMeasureNumber: undefined,
        };
        common.merge(this, defaultOptions);
    }
}
