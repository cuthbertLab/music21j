/// <reference types="jquery" />
import * as pitch from './pitch';
/**
 * Represents a single Key
 *
 * @class Key
 * @memberof music21.keyboard
 * @property {Array<function>} callbacks - called when key is clicked/selected
 * @property {number} [scaleFactor=1]
 * @property {music21.keyboard.Keyboard|undefined} parent
 * @property {int} id - midi number associated with the key.
 * @property {music21.pitch.Pitch|undefined} pitchObj
 * @property {SVGElement|undefined} svgObj - SVG representing the drawing of the key
 * @property {SVGElement|undefined} noteNameSvgObj - SVG representing the note name drawn on the key
 * @property {string} keyStyle='' - css style information for the key
 * @property {string} keyClass='' - css class information for the key ("keyboardkey" + this is the class)
 * @property {number} width - width of key
 * @property {number} height - height of key
 */
export declare class Key {
    classes: string[];
    callbacks: {
        click: any;
    };
    scaleFactor: number;
    parent: Keyboard;
    id: number;
    width: number;
    height: number;
    pitchObj: pitch.Pitch;
    svgObj: SVGElement;
    noteNameSvgObj: SVGElement;
    keyStyle: string;
    keyClass: string;
    /**
     * Gets an SVG object for the key
     *
     * @param {number} startX - X position in pixels from left of keyboard to draw key at
     * @returns {SVGElement} a SVG rectangle for the key
     */
    makeKey(startX: any): SVGElement;
    /**
     * Adds a circle (red) on the key (to mark middle C etc.)
     *
     * @param {string} [strokeColor='red']
     * @returns {SVGElement}
     */
    addCircle(strokeColor: any): SVGElement;
    /**
     * Adds the note name on the key
     *
     * @param {Boolean} [labelOctaves=false] - use octave numbers too?
     * @returns {this}
     */
    addNoteName(labelOctaves: any): this;
    /**
     * Removes the note name from the key (if exists)
     *
     * @returns {undefined}
     */
    removeNoteName(): void;
}
/**
 * Defaults for a WhiteKey (width, height, keyStyle, keyClass)
 *
 * @class WhiteKey
 * @memberof music21.keyboard
 * @extends music21.keyboard.Key
 */
export declare class WhiteKey extends Key {
    constructor();
}
/**
 * Defaults for a BlackKey (width, height, keyStyle, keyClass)
 *
 * @class BlackKey
 * @memberof music21.keyboard
 * @extends music21.keyboard.Key
 */
export declare class BlackKey extends Key {
    constructor();
}
/**
 * A Class representing a whole Keyboard full of keys.
 *
 * @class Keyboard
 * @memberof music21.keyboard
 * @property {number} whiteKeyWidth - default 23
 * @property {number} scaleFactor - default 1
 * @property {Object} keyObjects - a mapping of id to {@link music21.keyboard.Key} objects
 * @property {SVGElement} svgObj - the SVG object of the keyboard
 * @property {Boolean} markC - default true
 * @property {Boolean} showNames - default false
 * @property {Boolean} showOctaves - default false
 * @property {string|number} startPitch - default "C3" (a pitch string or midi number)
 * @property {string|number} endPitch - default "C5" (a pitch string or midi number)
 * @property {Boolean} hideable - default false -- add a way to hide and show keyboard
 * @property {Boolean} scrollable - default false -- add scroll bars to change octave
 */
export declare class Keyboard {
    whiteKeyWidth: number;
    _defaultWhiteKeyWidth: number;
    _defaultBlackKeyWidth: number;
    scaleFactor: number;
    height: number;
    keyObjects: Map<any, any>;
    svgObj: SVGElement;
    markC: boolean;
    showNames: boolean;
    showOctaves: boolean;
    startPitch: string | number | pitch.Pitch;
    endPitch: string | number | pitch.Pitch;
    _startDNN: number;
    _endDNN: number;
    hideable: boolean;
    scrollable: boolean;
    callbacks: {
        click: any;
    };
    sharpOffsets: {
        0: number;
        1: number;
        3: number;
        4: number;
        5: number;
    };
    constructor();
    /**
     * Redraws the SVG associated with this Keyboard
     *
     * @returns {SVGElement} new svgDOM
     */
    redrawSVG(): SVGElement;
    /**
     * Appends a keyboard to the `where` parameter
     *
     * @param {jQuery|Node} [where]
     * @returns {music21.keyboard.Keyboard} this
     */
    appendKeyboard(where: any): this;
    /**
     * Handle a click on a given SVG object
     *
     * TODO(msc) - 2019-Dec -- separate into two calls, one for highlighting and one for playing.
     *
     * @param {SVGElement} keyRect - the dom object with the keyboard.
     */
    clickHandler(keyRect: any): void;
    /**
     * Draws the SVG associated with this Keyboard
     */
    createSVG(): SVGElement;
    /**
     * Puts a circle on middle c.
     *
     * @param {string} [strokeColor='red']
     */
    markMiddleC(strokeColor?: string): void;
    /**
     * Puts note names on every white key.
     *
     * @param {Boolean} [labelOctaves=false]
     */
    markNoteNames(labelOctaves: any): void;
    /**
     * Remove note names on the keys, if they exist
     *
     * @returns {this}
     */
    removeNoteNames(): this;
    /**
     * Wraps the SVG object inside a scrollable set of buttons
     *
     * Do not call this directly, just use createSVG after changing the
     * scrollable property on the keyboard to True.
     *
     * @param {SVGElement} svgDOM
     * @returns {JQuery}
     */
    wrapScrollable(svgDOM: SVGElement): JQuery;
    /**
     * Puts a hideable keyboard inside a Div with the proper controls.
     *
     * Do not call this directly, just use createSVG after changing the
     * hideable property on the keyboard to True.
     *
     * @param {Node} where
     * @param {SVGElement} keyboardSVG
     */
    appendHideableKeyboard(where: any, keyboardSVG: any): JQuery<HTMLElement>;
}
/**
 * triggerToggleShow -- event for keyboard is shown or hidden.
 *
 * @function music21.keyboard.triggerToggleShow
 * @param {Event} [e]
 */
export declare const triggerToggleShow: (e: any) => void;
/**
 * highlight the keyboard stored in "this" appropriately
 *
 * @function music21.keyboard.jazzHighlight
 * @param {music21.miditools.Event} e
 * @example
 * var midiCallbacksPlay = [music21.miditools.makeChords,
 *                          music21.miditools.sendToMIDIjs,
 *                          music21.keyboard.jazzHighlight.bind(k)];
 */
export declare function jazzHighlight(e: any): void;
//# sourceMappingURL=keyboard.d.ts.map