/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/keyboard -- PianoKeyboard rendering and display objects
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 * Keyboard module
 *
 * @example Minimum usage:
 * const kd = document.getElementById('keyboardDiv');
 * const k = new music21.keyboard.Keyboard();
 * k.appendKeyboard(kd, 6, 57); // 88 key keyboard
 *
 * // configurable:
 * k.scaleFactor = 1.2;  // default 1
 * k.whiteKeyWidth = 40; // default 23
 *
 */
import * as MIDI from 'midicube';

import * as common from './common';
import * as miditools from './miditools';
import * as pitch from './pitch';
import {coerceHTMLElement, to_el} from './common';

/**
 * Represents a single Key
 */
export class Key {
    classes: string[] = ['Key']; // TODO(msc): resolve name conflict with key.Key

    /**
     *     called when key is clicked/selected
     */
    callbacks = {
        click: undefined,
    };

    scaleFactor: number = 1;
    parent: Keyboard;

    /**
     * MIDI number associated with the key.
     */
    id: number = 0;

    /**
     * Width in pixels
     */
    width: number = 23;

    /**
     * Height in pixels.
     */
    height: number = 120;

    /**
     * A pitch object associated with the key
     */
    pitchObj: pitch.Pitch;

    /**
     * The SVG representing the drawing of the key
     */
    svgObj: SVGElement|undefined;

    /**
     * The SVG representing the note name drawn on the key.
     */
    noteNameSvgObj: SVGElement|undefined;

    /**
     * CSS Style information for the key
     */
    keyStyle: string = '';

    /**
     * CSS class with `keyboardkey${keyClass}` for the key.
     */
    keyClass: string = '';

    /**
     * Gets an SVG object for the key
     *
     * * startX - X position in pixels from left of keyboard to draw key at
     * * returns an SVG rectangle for the key
     */
    makeKey(startX: number): SVGElement {
        const keyAttrs = {
            style: this.keyStyle,
            x: startX,
            y: 0,
            class: 'keyboardkey ' + this.keyClass,
            id: this.id,
            width: this.width * this.scaleFactor,
            height: this.height * this.scaleFactor,
            rx: 3,
            ry: 3,
        };
        const keyDOM = common.makeSVGright('rect', keyAttrs);
        for (const x in this.callbacks) {
            if ({}.hasOwnProperty.call(this.callbacks, x)) {
                keyDOM.addEventListener(x, this.callbacks[x], false);
            }
        }
        this.svgObj = keyDOM;
        return keyDOM;
    }

    /**
     * Adds a circle (red) on the key (to mark middle C etc.)
     */
    addCircle(strokeColor: string = 'red'): SVGElement {
        if (
            this.svgObj === undefined
            || this.parent === undefined
            || this.parent.svgObj === undefined
        ) {
            return undefined;
        }
        const x = parseInt(this.svgObj.getAttribute('x'));
        const cx = x + this.parent.scaleFactor * this.width / 2;
        // console.log('cx', cx);
        const keyAttrs = {
            stroke: strokeColor,
            'stroke-width': 3,
            fill: 'none',
            cx,
            cy: (this.height - 10) * this.parent.scaleFactor,
            class: 'keyboardkeyannotation',
            r: this.width * this.parent.scaleFactor / 4,
        };

        const circleDom = common.makeSVGright('circle', keyAttrs);
        this.parent.svgObj.appendChild(circleDom);
        // console.log(circleDom);
        return circleDom;
    }

    /**
     * Adds the note name on the key
     *
     * if labelOctaves then octave numbers will also appear
     */
    addNoteName(labelOctaves: boolean = false): this {
        if (
            this.svgObj === undefined
            || this.parent === undefined
            || this.parent.svgObj === undefined
        ) {
            return this;
        }
        if (this.id === 0 && this.pitchObj === undefined) {
            return this;
        } else if (this.pitchObj === undefined) {
            this.pitchObj = new pitch.Pitch();
            this.pitchObj.ps = this.id;
        }
        if (
            this.pitchObj.accidental !== undefined
            && this.pitchObj.accidental.alter !== 0
        ) {
            return this;
        }
        let x = parseInt(this.svgObj.getAttribute('x'));
        let idStr = this.pitchObj.name;
        let fontSize = 14;
        if (labelOctaves) {
            idStr = this.pitchObj.nameWithOctave;
            fontSize = 12;
            x -= 2;
        }
        fontSize = Math.floor(fontSize * this.parent.scaleFactor);

        let textFill = 'white';
        if (this.keyClass === 'whitekey') {
            textFill = 'black';
        }
        const textAttrs = {
            fill: textFill,
            x: x + this.parent.scaleFactor * (this.width / 2 - 5),
            y: this.parent.scaleFactor * (this.height - 20),
            class: 'keyboardkeyname',
            'font-size': fontSize,
        };

        const textDom = common.makeSVGright('text', textAttrs);
        const textNode = document.createTextNode(idStr);
        textDom.appendChild(textNode);
        this.noteNameSvgObj = textDom; // store for removing...
        this.parent.svgObj.appendChild(textDom);
        return this;
    }

    /**
     * Removes the note name from the key (if exists)
     */
    removeNoteName(): void {
        if (
            this.svgObj === undefined
            || this.parent === undefined
            || this.parent.svgObj === undefined
        ) {
            return;
        }
        if (this.noteNameSvgObj === undefined) {
            return;
        }
        if (this.noteNameSvgObj.parentNode === this.parent.svgObj) {
            this.parent.svgObj.removeChild(this.noteNameSvgObj);
        }
        this.noteNameSvgObj = undefined;
    }
}

/**
 * Defaults for a WhiteKey (width, height, keyStyle, keyClass)
 */
export class WhiteKey extends Key {
    constructor() {
        super();
        this.width = 23;
        this.height = 120;
        this.keyStyle = 'fill:#fffff6;stroke:black';
        this.keyClass = 'whitekey';
    }
}

/**
 * Defaults for a BlackKey (width, height, keyStyle, keyClass)
 */
export class BlackKey extends Key {
    constructor() {
        super();
        this.width = 13;
        this.height = 80;
        this.keyStyle = 'fill:black;stroke:black';
        this.keyClass = 'blackkey';
    }
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
 * @property {string} instrumentName - default "acoustic_grand_piano"
 * @property {string} highlightedBlackKeyColor - what color does a black key turn when clicked
 * @property {string} highlightedWhiteKeyColor - what color does a white key turn when clicked.
 * @property {string|number} startPitch - default "C3" (a pitch string or midi number)
 * @property {string|number} endPitch - default "C5" (a pitch string or midi number)
 * @property {Boolean} hideable - default false -- add a way to hide and show keyboard
 * @property {Boolean} scrollable - default false -- add scroll bars to change octave
 */
export class Keyboard {
    whiteKeyWidth: number = 23;
    // these are used to understand how much we have scaled
    protected _defaultWhiteKeyWidth: number = 23;
    protected _defaultBlackKeyWidth: number = 13;
    scaleFactor: number = 1.0;
    height = 120; // does nothing right now...
    keyObjects = new Map();
    svgObj: SVGElement;

    markC = true;
    showNames = false;
    showOctaves = false;

    instrumentName: string = 'acoustic_grand_piano';
    highlightedBlackKeyColor: string = '#c0c000';
    highlightedWhiteKeyColor: string = 'yellow';

    startPitch: string|number|pitch.Pitch = 'C3';
    endPitch: string|number|pitch.Pitch = 'C5';
    _startDNN: number = 22;
    _endDNN: number = 36;

    hideable = false;
    scrollable = false;
    callbacks = {
        click: undefined,
    };

    //   more accurate offsets from http://www.mathpages.com/home/kmath043.htm
    sharpOffsets = {
        0: 14.3333,
        1: 18.6666,
        3: 13.25,
        4: 16.25,
        5: 19.75,
    };

    constructor() {
        /**
         * An object of callbacks on events.
         *
         * default:
         *
         * - click: this.clickHandler
         *
         * @name callbacks
         * @type {Object}
         */
        this.callbacks = {
            click: (keyClicked: SVGRectElement) => this.clickHandler(keyClicked),
        };
    }

    /**
     * Redraws the SVG associated with this Keyboard
     */
    redrawSVG(): SVGSVGElement {
        if (this.svgObj === undefined) {
            return undefined;
        }
        const oldSVG = this.svgObj;
        const svgParent = oldSVG.parentNode;
        this.keyObjects = new Map();
        const svgDOM = this.createSVG();
        svgParent.replaceChild(svgDOM, oldSVG);
        return svgDOM;
    }

    /**
     * Appends a keyboard to the where parameter
     */
    appendKeyboard(where?: JQuery|HTMLElement): this {
        const svg_holder = coerceHTMLElement(where);

        let svgDOM: HTMLElement|SVGSVGElement = this.createSVG();

        if (this.scrollable) {
            svgDOM = this.wrapScrollable(svgDOM);
        }

        if (this.hideable) {
            // make it so the keyboard can be shown or hidden...
            this.appendHideableKeyboard(svg_holder, svgDOM);
        } else {
            svg_holder.appendChild(svgDOM); // svg must use appendChild, not append.
        }
        return this;
    }

    /**
     * Handle a click on a given SVG object
     *
     * TODO(msc) - 2019-Dec -- separate into two calls, one for highlighting and one for playing.
     *
     * the dom object with the keyboard.
     */
    clickHandler(keyRect: SVGRectElement): void {
        // to-do : integrate with jazzHighlight...
        const id = parseInt(keyRect.getAttribute('id'));
        const thisKeyObject = this.keyObjects.get(id);
        if (thisKeyObject === undefined) {
            return; // not on keyboard;
        }
        const storedStyle = thisKeyObject.keyStyle;
        let fillColor = this.highlightedBlackKeyColor;
        if (thisKeyObject.keyClass === 'whitekey') {
            fillColor = this.highlightedWhiteKeyColor;
        }
        keyRect.setAttribute('style', 'fill:' + fillColor + ';stroke:black');
        miditools.loadSoundfont(this.instrumentName, i => {
            MIDI.noteOn(i.midiChannel, id, 100, 0);
            MIDI.noteOff(i.midiChannel, id, 500);
        });
        setTimeout(() => {
            keyRect.setAttribute('style', storedStyle);
        }, 500);
    }

    /**
     * Draws the SVG associated with this Keyboard
     */
    createSVG(): SVGSVGElement {
        // DNN = pitch.diatonicNoteNum;
        // this._endDNN = final key note. I.e., the last note to be included, not the first note not included.
        // 6, 57 gives a standard 88-key keyboard;
        if (typeof this.startPitch === 'string') {
            const tempP = new pitch.Pitch(this.startPitch);
            this._startDNN = tempP.diatonicNoteNum;
        } else if (typeof this.startPitch === 'number') {
            this._startDNN = this.startPitch;
        } else if (this.startPitch instanceof pitch.Pitch) {
            this._startDNN = this.startPitch.diatonicNoteNum;
        }

        if (typeof this.endPitch === 'string') {
            const tempP = new pitch.Pitch(this.endPitch);
            this._endDNN = tempP.diatonicNoteNum;
        } else if (typeof this.endPitch === 'number') {
            this._endDNN = this.endPitch;
        } else if (this.endPitch instanceof pitch.Pitch) {
            this._endDNN = this.endPitch.diatonicNoteNum;
        }

        let currentIndex = (this._startDNN - 1) % 7; // C = 0
        const keyboardDiatonicLength = 1 + this._endDNN - this._startDNN;
        const totalWidth
            = this.whiteKeyWidth * this.scaleFactor * keyboardDiatonicLength;
        const height = 120 * this.scaleFactor;
        const heightString = height.toString() + 'px';

        const svgDOM = common.makeSVGright('svg', {
            'xml:space': 'preserve',
            height: heightString,
            width: totalWidth.toString() + 'px',
            class: 'keyboardSVG',
        }) as SVGSVGElement;
        const movingPitch = new pitch.Pitch('C4');
        const blackKeys = [];
        const thisKeyboardObject = this;

        for (let wki = 0; wki < keyboardDiatonicLength; wki++) {
            movingPitch.diatonicNoteNum = this._startDNN + wki;
            const wk = new WhiteKey();
            wk.id = movingPitch.midi;
            wk.parent = this;
            this.keyObjects.set(movingPitch.midi, wk);
            wk.scaleFactor = this.scaleFactor;
            wk.width = this.whiteKeyWidth;
            wk.callbacks.click = function whitekeyCallbacksClick() {
                thisKeyboardObject.callbacks.click(this);
            };

            const wkSVG = wk.makeKey(
                this.whiteKeyWidth * this.scaleFactor * wki
            );
            svgDOM.appendChild(wkSVG);

            if (
                (currentIndex === 0
                    || currentIndex === 1  // not 2
                    || currentIndex === 3
                    || currentIndex === 4
                    || currentIndex === 5)
                && wki !== keyboardDiatonicLength - 1
            ) {
                // create but do not append BlackKey to the right of WhiteKey
                const bk = new BlackKey();
                bk.id = movingPitch.midi + 1;
                this.keyObjects.set(movingPitch.midi + 1, bk);
                bk.parent = this;

                bk.scaleFactor = this.scaleFactor;
                bk.width = this._defaultBlackKeyWidth
                    * this.whiteKeyWidth
                    / this._defaultWhiteKeyWidth;
                bk.callbacks.click = function blackKeyClicksCallback() {
                    thisKeyboardObject.callbacks.click(this);
                };

                let offsetFromWhiteKey = this.sharpOffsets[currentIndex];
                offsetFromWhiteKey
                    *= this.whiteKeyWidth
                    / this._defaultWhiteKeyWidth
                    * this.scaleFactor;
                const bkSVG = bk.makeKey(
                    this.whiteKeyWidth * this.scaleFactor * wki
                        + offsetFromWhiteKey
                );
                blackKeys.push(bkSVG);
            }
            currentIndex += 1;
            currentIndex %= 7;
        }
        // append black keys later since they overlap white keys;
        for (let bki = 0; bki < blackKeys.length; bki++) {
            svgDOM.appendChild(blackKeys[bki]);
        }

        this.svgObj = svgDOM;
        if (this.markC) {
            this.markMiddleC();
        }
        if (this.showNames) {
            this.markNoteNames(this.showOctaves);
        }

        return svgDOM;
    }

    /**
     * Puts a circle on middle c.
     */
    markMiddleC(strokeColor: string = 'red') {
        const midC = this.keyObjects.get(60);
        if (midC !== undefined) {
            midC.addCircle(strokeColor);
        }
    }

    /**
     * Puts note names on every white key.
     */
    markNoteNames(labelOctaves: boolean = false) {
        this.removeNoteNames(); // in case...
        for (const keyObj of this.keyObjects.values()) {
            keyObj.addNoteName(labelOctaves);
        }
    }

    /**
     * Remove note names on the keys, if they exist
     */
    removeNoteNames(): this {
        for (const keyObj of this.keyObjects.values()) {
            keyObj.removeNoteName();
        }
        return this;
    }

    /**
     * Wraps the SVG object inside a scrollable set of buttons
     *
     * Do not call this directly, just use createSVG after changing the
     * scrollable property on the keyboard to True.
     */
    wrapScrollable(svgDOM: SVGSVGElement): HTMLElement {
        const wrapper = to_el(
            '<div class="keyboardScrollableWrapper" style="display: inline-block"></div>'
        );
        const bDown = to_el(`
            <button class="keyboardOctaveDown" 
                    style="font-size: ${Math.floor(this.scaleFactor * 15)}px">&lt;&lt;</button>
            `);
        bDown.addEventListener('click', () => {
            miditools.config.transposeOctave -= 1;
            this.startPitch = this._startDNN - 7;
            this.endPitch = this._endDNN - 7;
            this.redrawSVG();
        });
        const bUp = to_el(`
            <button class='keyboardOctaveUp'
                    style="font-size: ${Math.floor(this.scaleFactor * 15)}px"
            >&gt;&gt;</button>`);
        bUp.addEventListener('click', () => {
            miditools.config.transposeOctave += 1;
            this.startPitch = this._startDNN + 7;
            this.endPitch = this._endDNN + 7;
            this.redrawSVG();
        });
        const kWrapperDiv = to_el(
            "<div style='display:inline-block; vertical-align: middle' class='keyboardScrollableInnerDiv'></div>"
        );
        kWrapperDiv.appendChild(svgDOM);
        wrapper.append(bDown);
        wrapper.append(kWrapperDiv);
        wrapper.append(bUp);
        return wrapper;
    }

    /**
     * Puts a hideable keyboard inside a Div with the proper controls.
     *
     * Do not call this directly, just use createSVG after changing the
     * hideable property on the keyboard to True.
     */
    appendHideableKeyboard(where: HTMLElement, keyboardSVG: SVGSVGElement|HTMLElement): HTMLElement {
        const container = to_el('<div class="keyboardHideableContainer"></div>');
        const bInside = to_el(`
            <div class="keyboardToggleInside"
                 style="display: inline-block; padding-top: 40px; font-size: 40px;"
            >↥</div>`);
        const b = to_el(`
            <div class="keyboardToggleOutside"
                 style="display: inline-block; vertical-align: top; background: white"
            ></div>`);
        b.append(bInside);
        b.setAttribute(
            'data-defaultDisplay',
            (container.querySelector('.keyboardSVG') as HTMLElement)?.style.display,
        );
        b.setAttribute('data-state', 'down');
        b.addEventListener('click', e => triggerToggleShow(e));
        const explain = to_el(
            `<div class="keyboardExplain"
                  style="display: none; background-color: white; padding: 10px 10px 10px 10px; font-size: 12pt;"
             >Show keyboard</div>`
        );
        b.append(explain);
        container.append(b);
        container.appendChild(keyboardSVG);  // SVG safer with appendChild
        where.append(container);
        return container;
    }
}

// noinspection JSUnusedLocalSymbols
/**
 * triggerToggleShow -- event for keyboard is shown or hidden.
 */
export const triggerToggleShow = (e: Event): void => {
    const t = e.currentTarget as HTMLElement;
    const state = t.getAttribute('data-state');
    const parent = t.parentElement;
    if (!parent) {
        throw new Error('Clicked toggle has no parent (ShadowDOM?)');
    }

    let k = parent.querySelector<HTMLElement>('.keyboardScrollableWrapper');
    if (!k) {
        // not scrollable
        k = parent.querySelector<HTMLElement>('.keyboardSVG');
        if (!k) {
            throw new Error('Cannot find parent element to put hide/show controls');
        }
    }
    const bInside = t.querySelector<HTMLElement>('.keyboardToggleInside');
    const explain = parent.querySelector<HTMLElement>('.keyboardExplain');

    if (!bInside || !explain) {
        throw new Error('Cannot find toggle button or explanation');
    }

    if (state === 'up') {
        bInside.innerText = '↥';
        bInside.style.paddingTop = '40px';
        explain.style.display = 'none';
        let dd = t.getAttribute('data-defaultDisplay');
        if (dd === undefined) {
            dd = 'inline';
        }
        k.style.display = dd;
        t.setAttribute('data-state', 'down');
    } else {
        k.style.display = 'none';
        explain.style.display = 'inline-block';
        bInside.innerText = '↧';
        bInside.style.paddingTop = '10px';
        t.setAttribute('data-state', 'up');
    }
};

/**
 * highlight the keyboard stored in "this" appropriately
 *
 * @example
 * var midiCallbacksPlay = [music21.miditools.makeChords,
 *                          music21.miditools.sendToMIDIjs,
 *                          music21.keyboard.jazzHighlight.bind(k)];
 */
export function jazzHighlight(e: miditools.Event) {
    // e is a miditools.event object -- call with this = keyboard.Keyboard object via bind...
    if (e === undefined) {
        return;
    }
    if (e.noteOn) {
        const midiNote: number = e.midiNote;
        if (this.keyObjects.has(midiNote)) {
            const keyObj = this.keyObjects.get(midiNote);
            const svgObj = keyObj.svgObj;
            let normalizedVelocity = (e.velocity + 25) / 127;
            if (normalizedVelocity > 1) {
                normalizedVelocity = 1.0;
            }

            let intensityRGB: string;
            if (keyObj.keyClass === 'whitekey') {
                const intensity = normalizedVelocity.toString();
                intensityRGB = 'rgba(255, 255, 0, ' + intensity + ')';
            } else {
                const intensity = Math.floor(
                    normalizedVelocity * 255
                ).toString();
                intensityRGB = 'rgb(' + intensity + ',' + intensity + ',0)';
                // console.log(intensityRGB);
            }
            svgObj.setAttribute(
                'style',
                'fill:' + intensityRGB + ';stroke:black'
            );
        }
    } else if (e.noteOff) {
        const midiNote = e.midiNote;
        if (this.keyObjects.has(midiNote)) {
            const keyObj = this.keyObjects.get(midiNote);
            const svgObj = keyObj.svgObj;
            svgObj.setAttribute('style', keyObj.keyStyle);
        }
    }
} // call this with a bind(keyboard.Keyboard object)...
