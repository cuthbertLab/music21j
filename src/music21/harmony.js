/**
 * @namespace music21.harmony
 */

import { chord } from './chord.js';
import { key } from './key.js';

/**
 * @memberOf music21.harmony
 * @extends music21.chord.Chord
 */
export class Harmony extends chord.Chord {
    constructor(figure, keywords) {
        if (keywords === undefined) {
            keywords = {};
        }

        super();
        this._writeAsChord = false;
        this._roman = undefined;
        this.chordStepModifications = [];
        this._degreesList = [];

        /**
         *
         * @type {music21.key.Key|undefined}
         * @private
         */
        this._key = undefined;
        // this._updateBasedOnXMLInput(keywords);
        this._figure = figure;
        if (keywords.parseFigure !== false && this._figure !== undefined) {
            this._parseFigure();
        }
        if (
            this._overrides.bass === undefined
            && this._overrides.root !== undefined
        ) {
            this.bass(this._overrides.root);
        }
        if (
            (keywords.updatePitches && this._figure !== undefined)
            || this._overrides.root !== undefined
            || this._overrides.bass !== undefined
        ) {
            this._updatePitches();
        }
        // this._updateBasedOnXMLInput(keywords);
        if (
            keywords.parseFigure !== false
            && this._figure !== undefined
            && this._figure.indexOf('sus') !== -1
            && this._figure.indexOf('sus2') === -1
        ) {
            this.root(this.bass());
        }
    }

    _parseFigure() {}

    _updatePitches() {}

    get figure() {
        if (this._figure === undefined) {
            return this.findFigure();
        } else {
            return this._figure;
        }
    }

    set figure(newFigure) {
        this._figure = newFigure;
        if (this._figure !== undefined) {
            this._parseFigure();
            this._updatePitches();
        }
    }

    get key() {
        return this._key;
    }

    set key(keyOrScale) {
        if (typeof keyOrScale === 'string') {
            this._key = new key.Key(keyOrScale);
        } else {
            this._key = keyOrScale;
            this._roman = undefined;
        }
    }

    findFigure() {}
}
