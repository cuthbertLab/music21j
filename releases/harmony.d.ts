import * as chord from './chord';
import * as key from './key';
export declare class Harmony extends chord.Chord {
    static get className(): string;
    protected _writeAsChord: boolean;
    protected _roman: any;
    chordStepModifications: any[];
    protected _degreesList: any[];
    protected _key: key.Key;
    protected _figure: string;
    constructor(figure: string, { parseFigure, updatePitches, }?: {
        parseFigure?: boolean;
        updatePitches?: boolean;
    });
    _parseFigure(): void;
    _updatePitches(): void;
    get figure(): string;
    set figure(newFigure: string);
    get key(): key.Key;
    set key(keyOrScale: key.Key);
    findFigure(): void;
}
//# sourceMappingURL=harmony.d.ts.map