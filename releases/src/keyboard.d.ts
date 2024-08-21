/// <reference types="jquery" />
/// <reference types="jquery" />
import * as miditools from './miditools';
import * as pitch from './pitch';
/**
 * Represents a single Key
 */
export declare class Key {
    classes: string[];
    /**
     *     called when key is clicked/selected
     */
    callbacks: {
        click: any;
    };
    scaleFactor: number;
    parent: Keyboard;
    /**
     * MIDI number associated with the key.
     */
    id: number;
    /**
     * Width in pixels
     */
    width: number;
    /**
     * Height in pixels.
     */
    height: number;
    /**
     * A pitch object associated with the key
     */
    pitchObj: pitch.Pitch;
    /**
     * The SVG representing the drawing of the key
     */
    svgObj: SVGElement | undefined;
    /**
     * The SVG representing the note name drawn on the key.
     */
    noteNameSvgObj: SVGElement | undefined;
    /**
     * CSS Style information for the key
     */
    keyStyle: string;
    /**
     * CSS class with `keyboardkey${keyClass}` for the key.
     */
    keyClass: string;
    /**
     * Gets an SVG object for the key
     *
     * * startX - X position in pixels from left of keyboard to draw key at
     * * returns an SVG rectangle for the key
     */
    makeKey(startX: number): SVGElement;
    /**
     * Adds a circle (red) on the key (to mark middle C etc.)
     */
    addCircle(strokeColor?: string): SVGElement;
    /**
     * Adds the note name on the key
     *
     * if labelOctaves then octave numbers will also appear
     */
    addNoteName(labelOctaves?: boolean): this;
    /**
     * Removes the note name from the key (if exists)
     */
    removeNoteName(): void;
}
/**
 * Defaults for a WhiteKey (width, height, keyStyle, keyClass)
 */
export declare class WhiteKey extends Key {
    constructor();
}
/**
 * Defaults for a BlackKey (width, height, keyStyle, keyClass)
 */
export declare class BlackKey extends Key {
    constructor();
}
/**
 * A Class representing a whole Keyboard full of keys.
 *
 * @property {number} whiteKeyWidth - default 23
 * @property {number} scaleFactor - default 1
 * @property {Object} keyObjects - a mapping of id to `music21.keyboard.Key` objects
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
     */
    redrawSVG(): SVGSVGElement;
    /**
     * Appends a keyboard to the where parameter
     */
    appendKeyboard(where?: JQuery | HTMLElement): this;
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
    createSVG(): SVGSVGElement;
    /**
     * Puts a circle on middle c.
     */
    markMiddleC(strokeColor?: string): void;
    /**
     * Puts note names on every white key.
     */
    markNoteNames(labelOctaves?: boolean): void;
    /**
     * Remove note names on the keys, if they exist
     */
    removeNoteNames(): this;
    /**
     * Wraps the SVG object inside a scrollable set of buttons
     *
     * Do not call this directly, just use createSVG after changing the
     * scrollable property on the keyboard to True.
     */
    wrapScrollable(svgDOM: SVGSVGElement): HTMLElement;
    /**
     * Puts a hideable keyboard inside a Div with the proper controls.
     *
     * Do not call this directly, just use createSVG after changing the
     * hideable property on the keyboard to True.
     */
    appendHideableKeyboard(where: HTMLElement, keyboardSVG: SVGSVGElement | HTMLElement): HTMLElement;
}
/**
 * triggerToggleShow -- event for keyboard is shown or hidden.
 *
 * @param {Event} [e]
 */
export declare const triggerToggleShow: (e: any) => void;
/**
 * highlight the keyboard stored in "this" appropriately
 *
 * @example
 * var midiCallbacksPlay = [music21.miditools.makeChords,
 *                          music21.miditools.sendToMIDIjs,
 *                          music21.keyboard.jazzHighlight.bind(k)];
 */
export declare function jazzHighlight(e: miditools.Event): void;
//# sourceMappingURL=keyboard.d.ts.map