import * as chord from './chord';
import * as key from './key';

export class Harmony extends chord.Chord {
    static get className() { return 'music21.harmony.Harmony'; }

    protected _writeAsChord: boolean = false;
    protected _roman;
    chordStepModifications = [];
    protected _degreesList = [];
    protected _key: key.Key;
    protected _figure: string;

    constructor(
        figure: string,
        {
            parseFigure=true,
            updatePitches=false,
        }={}
    ) {
        super();
        // this._updateBasedOnXMLInput(keywords);
        figure = figure.replace('/o', 'ø');
        this._figure = figure;
        if (parseFigure !== false && this._figure !== undefined) {
            this._parseFigure();
        }
        if (
            this._overrides.bass === undefined
            && this._overrides.root !== undefined
        ) {
            this.bass(this._overrides.root);
        }
        if (
            (updatePitches && this._figure !== undefined)
            || this._overrides.root !== undefined
            || this._overrides.bass !== undefined
        ) {
            this._updatePitches();
        }
        // this._updateBasedOnXMLInput(keywords);
        if (
            parseFigure !== false
            && this._figure !== undefined
            && this._figure.indexOf('sus') !== -1
            && this._figure.indexOf('sus2') === -1
        ) {
            this.root(this.bass());
        }
    }

    _parseFigure() {}

    _updatePitches() {}

    get figure(): string {
        if (this._figure === undefined) {
            this.findFigure();
        }
        return this._figure;
    }

    set figure(newFigure: string) {
        this._figure = newFigure;
        if (this._figure !== undefined) {
            this._parseFigure();
            this._updatePitches();
        }
    }

    get key(): key.Key {
        return this._key;
    }

    set key(keyOrScale: key.Key) {
        if (typeof keyOrScale === 'string') {
            this._key = new key.Key(keyOrScale);
        } else {
            this._key = keyOrScale;
            this._roman = undefined;
        }
    }

    findFigure() {}
}
