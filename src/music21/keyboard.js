/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/keyboard -- PianoKeyboard rendering and display objects
 *
 * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
 *
 */

// Minimum usage:

// var kd = document.getElementById('keyboardDiv');
// k = new music21.keyboard.Keyboard();
// k.appendKeyboard(kd, 6, 57); // 88 key keyboard

// configurable:
// k.scaleFactor = 1.2;  // default 1
// k.whiteKeyWidth = 40; // default 23
import * as MIDI from 'MIDI';
import * as $ from 'jquery';

import { common } from './common.js';
import { miditools } from './miditools.js';
import { pitch } from './pitch.js';


/**
 * Keyboard module, see {@link music21.keyboard} namespace
 *
 * @exports music21/keyboard
 */
/**
 * keyboard namespace -- tools for creating an onscreen keyboard and interacting with it.
 *
 * @namespace music21.keyboard
 * @memberof music21
 * @requires music21/pitch
 * @requires music21/common
 * @requires music21/miditools
 * @requires jquery
 * @requires MIDI
 */
export const keyboard = {};
/**
 * Represents a single Key
 *
 * @class Key
 * @memberof music21.keyboard
 * @property {Array<function>} callbacks - called when key is clicked/selected
 * @property {number} [scaleFactor=1]
 * @property {music21.keyboard.Keyboard|undefined} parent
 * @property {Int} id - midinumber associated with the key.
 * @property {music21.pitch.Pitch|undefined} pitchObj
 * @property {DOMObject|undefined} svgObj - SVG representing the drawing of the key
 * @property {DOMObject|undefined} noteNameSvgObj - SVG representing the note name drawn on the key
 * @property {string} keyStyle='' - css style information for the key
 * @property {string} keyClass='' - css class information for the key ("keyboardkey" + this is the class)
 * @property {number} width - width of key
 * @property {number} height - height of key
 */
export class Key {
    constructor() {
        this.classes = ['Key']; // name conflict with key.Key
        this.callbacks = [];
        this.scaleFactor = 1;
        this.parent = undefined;
        this.id = 0;
        this.width = 23;
        this.height = 120;
        this.pitchObj = undefined;
        this.svgObj = undefined;
        this.noteNameSvgObj = undefined;
        this.keyStyle = '';
        this.keyClass = '';
    }
    /**
     * Gets an SVG object for the key
     *
     * @method music21.keyboard.Key#makeKey
     * @memberof music21.keyboard.Key
     * @param {number} startX - X position in pixels from left of keyboard to draw key at
     * @returns {DOMObject} a SVG rectangle for the key
     */
    makeKey(startX) {
        const keyattrs = {
            style: this.keyStyle,
            x: startX,
            y: 0,
            'class': 'keyboardkey ' + this.keyClass,
            'id': this.id,
            width: this.width * this.scaleFactor,
            height: this.height * this.scaleFactor,
            rx: 3,
            ry: 3,
        };
        const keyDOM = common.makeSVGright('rect', keyattrs);
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
     *
     * @method music21.keyboard.Key#addCircle
     * @param {string} [strokeColor='red']
     * @returns {DOMObject}
     */
    addCircle(strokeColor) {
        if ((this.svgObj === undefined) ||
                (this.parent === undefined) ||
                (this.parent.svgObj === undefined)
        ) {
            return undefined;
        }
        if (strokeColor === undefined) {
            strokeColor = 'red';
        }
        const x = parseInt(this.svgObj.getAttribute('x'));
        const cx = x + this.parent.scaleFactor * (this.width) / 2;
        // console.log('cx', cx);
        const keyattrs = {
            stroke: strokeColor,
            'stroke-width': 3,
            fill: 'none',
            cx,
            cy: (this.height - 10) * this.parent.scaleFactor,
            'class': 'keyboardkeyannotation',
            r: this.width * this.parent.scaleFactor / 4,
        };

        const circleDom = common.makeSVGright('circle', keyattrs);
        this.parent.svgObj.appendChild(circleDom);
        // console.log(circleDom);
        return circleDom;
    }
    /**
     * Adds the note name on the key
     *
     * @method music21.keyboard.Key#addNoteName
     * @param {Boolean} [labelOctaves=false] - use octave numbers too?
     * @returns {DOMObject}
     */
    addNoteName(labelOctaves) {
        if ((this.svgObj === undefined)
                || (this.parent === undefined)
                || (this.parent.svgObj === undefined)) {
            return this;
        }
        if ((this.id === 0) && (this.pitchObj === undefined)) {
            return this;
        } else if (this.pitchObj === undefined) {
            this.pitchObj = new pitch.Pitch();
            this.pitchObj.ps = this.id;
        }
        if ((this.pitchObj.accidental !== undefined) &&
                (this.pitchObj.accidental.alter !== 0)) {
            return this;
        }
        let x = parseInt(this.svgObj.getAttribute('x'));
        let idStr = this.pitchObj.name;
        let fontSize = 14;
        if (labelOctaves === true) {
            idStr = this.pitchObj.nameWithOctave;
            fontSize = 12;
            x -= 2;
        }
        fontSize = Math.floor(fontSize * parent.scaleFactor);

        let textfill = 'white';
        if (this.keyClass === 'whitekey') {
            textfill = 'black';
        }
        const textattrs = {
            fill: textfill,
            x: x + this.parent.scaleFactor * (this.width / 2 - 5),
            y: this.parent.scaleFactor * (this.height - 20),
            'class': 'keyboardkeyname',
            'font-size': fontSize,
        };

        const textDom = common.makeSVGright('text', textattrs);
        const textNode = document.createTextNode(idStr);
        textDom.appendChild(textNode);
        this.noteNameSvgObj = textDom; // store for removing...
        this.parent.svgObj.appendChild(textDom);
        return this;
    }
    /**
     * Removes the note name from the key (if exists)
     *
     * @method music21.keyboard.Key#removeNoteName
     * @returns {undefined}
     */
    removeNoteName() {
        if ((this.svgObj === undefined)
                || (this.parent === undefined)
                || (this.parent.svgObj === undefined)
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
keyboard.Key = Key;

/**
 * Defaults for a WhiteKey (width, height, keyStyle, keyClass)
 *
 * @class WhiteKey
 * @memberof music21.keyboard
 * @extends music21.keyboard.Key
 */
export class WhiteKey extends Key {
    constructor() {
        super();
        this.classes.push('WhiteKey');
        this.width = 23;
        this.height = 120;
        this.keyStyle = 'fill:#fffff6;stroke:black';
        this.keyClass = 'whitekey';
    }
}
keyboard.WhiteKey = WhiteKey;
/**
 * Defaults for a BlackKey (width, height, keyStyle, keyClass)
 *
 * @class BlackKey
 * @memberof music21.keyboard
 * @extends music21.keyboard.Key
 */
export class BlackKey extends Key {
    constructor() {
        super();
        this.classes.push('BlackKey');
        this.width = 13;
        this.height = 80;
        this.keyStyle = 'fill:black;stroke:black';
        this.keyClass = 'blackkey';
    }
}

keyboard.BlackKey = BlackKey;


/**
 * A Class representing a whole Keyboard full of keys.
 *
 * @class Keyboard
 * @memberof music21.keyboard
 * @property {number} whiteKeyWidth - default 23
 * @property {number} scaleFactor - default 1
 * @property {object} keyObjects - a mapping of id to {@link music21.keyboard.Key} objects
 * @property {DOMObject} svgObj - the SVG object of the keyboard
 * @property {Boolean} markC - default true
 * @property {Boolean} showNames - default false
 * @property {Boolean} showOctaves - default false
 * @property {string} startPitch - default "C3"
 * @property {string} endPitch - default "C5"
 * @property {Boolean} hideable - default false -- add a way to hide and show keyboard
 * @property {Boolean} scrollable - default false -- add scroll bars to change octave
 */
export class Keyboard {
    constructor() {
        this.whiteKeyWidth = 23;
        this._defaultWhiteKeyWidth = 23;
        this._defaultBlackKeyWidth = 13;
        this.scaleFactor = 1;
        this.height = 120; // does nothing right now...
        this.keyObjects = {};
        this.svgObj = undefined;

        this.markC = true;
        this.showNames = false;
        this.showOctaves = false;

        this.startPitch = 'C3';
        this.endPitch = 'C5';
        this._startDNN = undefined;
        this._endDNN = undefined;

        this.hideable = false;
        this.scrollable = false;
        /**
         * An object of callbacks on events.
         *
         * default:
         *
         * - click: this.clickhandler
         *
         * @name callbacks
         * @type {object}
         * @memberof music21.keyboard.Keyboard#
         */
        this.callbacks = {
            click: this.clickhandler,
        };
        //   more accurate offsets from http://www.mathpages.com/home/kmath043.htm
        this.sharpOffsets = { 0: 14.3333, 1: 18.6666, 3: 13.25, 4: 16.25, 5: 19.75 };
    }
    /**
     * Redraws the SVG associated with this Keyboard
     *
     * @method music21.keyboard.Keyboard#redrawSVG
     * @returns {DOMObject} new svgDOM
     */
    redrawSVG() {
        if (this.svgObj === undefined) {
            return undefined;
        }
        const oldSVG = this.svgObj;
        const svgParent = oldSVG.parentNode;
        this.keyObjects = {};
        const svgDOM = this.createSVG();
        svgParent.replaceChild(svgDOM, oldSVG);
        return svgDOM;
    }
    /**
     * Appends a keyboard to the `where` parameter
     *
     * @method music21.keyboard.Keyboard#appendKeyboard
     * @param {JQueryDOMObject|DOMObject} [where]
     * @returns {music21.keyboard.Keyboard} this
     */
    appendKeyboard(where) {
        if (where === undefined) {
            where = document.body;
        } else if (where.jquery !== undefined) {
            where = where[0];
        }

        let svgDOM = this.createSVG();

        if (this.scrollable) {
            svgDOM = this.wrapScrollable(svgDOM)[0];
        }

        if (this.hideable) {
            // make it so the keyboard can be shown or hidden...
            this.appendHideableKeyboard(where, svgDOM);
        } else {
            where.appendChild(svgDOM); // svg must use appendChild, not append.
        }
        return this;
    }
    /**
     * Handle a click on a given SVG object
     *
     * @method music21.keyboard.Keyboard#clickhandler
     * @param {DOMObject} keyRect - the dom object with the keyboard.
     */
    clickhandler(keyRect) {
        // to-do : integrate with jazzHighlight...
        const id = keyRect.id;
        const thisKeyObject = this.keyObjects[id];
        if (thisKeyObject === undefined) {
            return; // not on keyboard;
        }
        const storedStyle = thisKeyObject.keyStyle;
        let fillColor = '#c0c000';
        if (thisKeyObject.keyClass === 'whitekey') {
            fillColor = 'yellow';
        }
        keyRect.setAttribute('style', 'fill:' + fillColor + ';stroke:black');
        miditools.loadSoundfont('acoustic_grand_piano', (i) => {
            MIDI.noteOn(i.midiChannel, id, 100, 0);
            MIDI.noteOff(i.midiChannel, id, 500);
        });
        setTimeout(() => {
            keyRect.setAttribute('style', storedStyle);
        }, 500);
    }

    /**
     * Draws the SVG associated with this Keyboard
     *
     * @method music21.keyboard.Keyboard#createSVG
     * @returns {DOMObject} new svgDOM
     */
    createSVG() {
        // DNN = pitch.diatonicNoteNum;
        // this._endDNN = final key note. I.e., the last note to be included, not the first note not included.
        // 6, 57 gives a standard 88-key keyboard;
        if (this._startDNN === undefined) {
            if (typeof this.startPitch === 'string') {
                const tempP = new pitch.Pitch(this.startPitch);
                this._startDNN = tempP.diatonicNoteNum;
            }  else {
                this._startDNN = this.startPitch;
            }
        }

        if (this._endDNN === undefined) {
            if (typeof this.endPitch === 'string') {
                const tempP = new pitch.Pitch(this.endPitch);
                this._endDNN = tempP.diatonicNoteNum;
            } else {
                this._endDNN = this.endPitch;
            }
        }

        let currentIndex = (this._startDNN - 1) % 7; // C = 0
        const keyboardDiatonicLength = 1 + this._endDNN - this._startDNN;
        const totalWidth = this.whiteKeyWidth * this.scaleFactor * keyboardDiatonicLength;
        const height = 120 * this.scaleFactor;
        const heightString = height.toString() + 'px';

        const svgDOM = common.makeSVGright('svg', {
            'xml:space': 'preserve',
            'height': heightString,
            'width': totalWidth.toString() + 'px',
            'class': 'keyboardSVG',
        });
        const movingPitch = new pitch.Pitch('C4');
        const blackKeys = [];
        const thisKeyboardObject = this;

        for (let wki = 0; wki < keyboardDiatonicLength; wki++) {
            movingPitch.diatonicNoteNum = this._startDNN + wki;
            const wk = new keyboard.WhiteKey();
            wk.id = movingPitch.midi;
            wk.parent = this;
            this.keyObjects[movingPitch.midi] = wk;
            wk.scaleFactor = this.scaleFactor;
            wk.width = this.whiteKeyWidth;
            wk.callbacks.click = function whitekeyCallbacksClick() { thisKeyboardObject.clickhandler(this); };

            const wkSVG = wk.makeKey(this.whiteKeyWidth * this.scaleFactor * wki);
            svgDOM.appendChild(wkSVG);

            if (((currentIndex === 0)
                    || (currentIndex === 1)
                    || (currentIndex === 3)
                    || (currentIndex === 4)
                    || (currentIndex === 5)) && (wki !== keyboardDiatonicLength - 1)) {
                // create but do not append blackkey to the right of whitekey
                const bk = new keyboard.BlackKey();
                bk.id = movingPitch.midi + 1;
                this.keyObjects[movingPitch.midi + 1] = bk;
                bk.parent = this;

                bk.scaleFactor = this.scaleFactor;
                bk.width = this._defaultBlackKeyWidth * this.whiteKeyWidth / this._defaultWhiteKeyWidth;
                bk.callbacks.click = function blackKeyClicksCallback() { thisKeyboardObject.clickhandler(this); };

                let offsetFromWhiteKey = this.sharpOffsets[currentIndex];
                offsetFromWhiteKey *= this.whiteKeyWidth / this._defaultWhiteKeyWidth * this.scaleFactor;
                const bkSVG = bk.makeKey(this.whiteKeyWidth * this.scaleFactor * wki + offsetFromWhiteKey);
                blackKeys.push(bkSVG);
            }
            currentIndex += 1;
            currentIndex %= 7;
        }
        // append blackkeys later since they overlap white keys;
        for (let bki = 0; bki < blackKeys.length; bki++) {
            svgDOM.appendChild(blackKeys[bki]);
        }

        this.svgObj = svgDOM;
        if (this.markC) { this.markMiddleC(); }
        if (this.showNames) { this.markNoteNames(this.showOctaves); }

        return svgDOM;
    }

    /**
     * Puts a circle on middle c.
     *
     * @method music21.keyboard.Keyboard#markMiddleC
     * @param {string} [strokeColor='red']
     */
    markMiddleC(strokeColor) {
        const midC = this.keyObjects[60];
        if (midC !== undefined) {
            midC.addCircle('red');
        }
    }
    /**
     * Puts note names on every white key.
     *
     * @method music21.keyboard.Keyboard#markNoteNames
     * @param {Boolean} [labelOctaves=false]
     */
    markNoteNames(labelOctaves) {
        this.removeNoteNames(); // in case...
        for (const midi in this.keyObjects) {
            if ({}.hasOwnProperty.call(this.keyObjects, midi)) {
                const keyObj = this.keyObjects[midi];
                keyObj.addNoteName(labelOctaves);
            }
        }
    }

    /**
     * Remove note names on the keys, if they exist
     *
     * @method music21.keyboard.Keyboard#removeNoteNames
     */
    removeNoteNames() {
        for (const midi in this.keyObjects) {
            if ({}.hasOwnProperty.call(this.keyObjects, midi)) {
                const keyObj = this.keyObjects[midi];
                keyObj.removeNoteName();
            }
        }
    }


    /**
     * Wraps the SVG object inside a scrollable set of buttons
     *
     * Do not call this directly, just use createSVG after changing the
     * scrollable property on the keyboard to True.
     *
     * @method music21.keyboard.Keyboard#wrapScrollable
     * @param {DOMObject} svgDOM
     * @returns {JQueryDOMObject}
     */
    wrapScrollable(svgDOM) {
        const $wrapper = $("<div class='keyboardScrollableWrapper'></div>").css({
            display: 'inline-block',
        });
        const $bDown = $("<button class='keyboardOctaveDown'>&lt;&lt;</button>").css({
            'font-size': Math.floor(this.scaleFactor * 15).toString() + 'px',
        }).bind('click', () => {
            miditools.transposeOctave -= 1;
            this._startDNN -= 7;
            this._endDNN -= 7;
            this.redrawSVG();
        });
        const $bUp = $("<button class='keyboardOctaveUp'>&gt;&gt;</button>").css({
            'font-size': Math.floor(this.scaleFactor * 15).toString() + 'px',
        }).bind('click', () => {
            miditools.transposeOctave += 1;
            this._startDNN += 7;
            this._endDNN += 7;
            this.redrawSVG();
        });
        const $kWrapper = $("<div style='display:inline-block; vertical-align: middle' class='keyboardScrollableInnerDiv'></div>");
        $kWrapper[0].appendChild(svgDOM);
        $wrapper.append($bDown);
        $wrapper.append($kWrapper);
        $wrapper.append($bUp);
        return $wrapper;
    }
    /**
     * Puts a hideable keyboard inside a Div with the proper controls.
     *
     * Do not call this directly, just use createSVG after changing the
     * hideable property on the keyboard to True.
     *
     * @method music21.keyboard.Keyboard#appendHideableKeyboard
     * @param {DOMObject} where
     * @param {DOMObject} keyboardSVG
     */
    appendHideableKeyboard(where, keyboardSVG) {
        const $container = $("<div class='keyboardHideableContainer'/>");
        const $bInside = $("<div class='keyboardToggleInside'>↥</div>").css({
            display: 'inline-block',
            'padding-top': '40px',
            'font-size': '40px',
        });
        const $b = $("<div class='keyboardToggleOutside'/>").css({
            display: 'inline-block',
            'vertical-align': 'top',
            background: 'white',
        });
        $b.append($bInside);
        $b.data('defaultDisplay', $container.find('.keyboardSVG').css('display'));
        $b.data('state', 'down');
        $b.click(keyboard.triggerToggleShow);
        const $explain = $("<div class='keyboardExplain'>Show keyboard</div>")
        .css({
            'display': 'none',
            'background-color': 'white',
            'padding': '10px 10px 10px 10px',
            'font-size': '12pt',
        });
        $b.append($explain);
        $container.append($b);
        $container[0].appendChild(keyboardSVG); // svg must use appendChild, not append.
        $(where).append($container);
        return $container;
    }
}

/**
 * triggerToggleShow -- event for keyboard is shown or hidden.
 *
 * @function music21.keyboard.triggerToggleShow
 * @param {Event} e
 */
keyboard.triggerToggleShow = function triggerToggleShow(e) {
    // "this" refers to the object clicked
    // e -- event is not used.
    const $t = $(this);
    const state = $t.data('state');
    const $parent = $t.parent();
    let $k = $parent.find('.keyboardScrollableWrapper');
    if ($k.length === 0) { // not scrollable
        $k = $parent.find('.keyboardSVG');
    }
    const $bInside = $t.find('.keyboardToggleInside');
    const $explain = $parent.find('.keyboardExplain');
    if (state === 'up') {
        $bInside.text('↥');
        $bInside.css('padding-top', '40px');
        $explain.css('display', 'none');
        let dd = $t.data('defaultDisplay');
        if (dd === undefined) {
            dd = 'inline';
        }
        $k.css('display', dd);
        $t.data('state', 'down');
    } else {
        $k.css('display', 'none');
        $explain.css('display', 'inline-block');
        $bInside.text('↧');
        $bInside.css('padding-top', '10px');
        $t.data('state', 'up');
    }
};

/**
 * highlight the keyboard stored in "this" appropriately
 *
 * @function music21.keyboard.jazzHighlight
 * @param {Event} e
 * @example
 * var midiCallbacksPlay = [music21.miditools.makeChords,
 *                          music21.miditools.sendToMIDIjs,
 *                          music21.keyboard.jazzHighlight.bind(k)];
 */
keyboard.jazzHighlight = function jazzHighlight(e) {
    // e is a miditools.event object -- call with this = keyboard.Keyboard object via bind...
    if (e === undefined) {
        return;
    }
    if (e.noteOn) {
        const midiNote = e.midiNote;
        if (this.keyObjects[midiNote] !== undefined) {
            const keyObj = this.keyObjects[midiNote];
            const svgObj = keyObj.svgObj;
            let intensityRGB = '';
            let normalizedVelocity = (e.velocity + 25) / 127;
            if (normalizedVelocity > 1) {
                normalizedVelocity = 1.0;
            }

            if (keyObj.keyClass === 'whitekey') {
                const intensity = normalizedVelocity.toString();
                intensityRGB = 'rgba(255, 255, 0, ' + intensity + ')';
            } else {
                const intensity = (Math.floor(normalizedVelocity * 255)).toString();
                intensityRGB = 'rgb(' + intensity + ',' + intensity + ',0)';
                // console.log(intensityRGB);
            }
            svgObj.setAttribute('style', 'fill:' + intensityRGB + ';stroke:black');
        }
    } else if (e.noteOff) {
        const midiNote = e.midiNote;
        if (this.keyObjects[midiNote] !== undefined) {
            const keyObj = this.keyObjects[midiNote];
            const svgObj = keyObj.svgObj;
            svgObj.setAttribute('style', keyObj.keyStyle);
        }
    }
}; // call this with a bind(keyboard.Keyboard object)...

keyboard.Keyboard = Keyboard;
