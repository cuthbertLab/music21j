import * as pitch from './pitch';
/**
 * In music21p is in figuredBass.notation -- eventually to be moved there.
 */
export declare class Notation {
    notationColumn: string;
    figureStrings: string[];
    origNumbers: number[];
    origModStrings: any;
    numbers: number[];
    modifierStrings: string[];
    modifiers: Modifier[];
    figures: Figure[];
    /**
     *
     * @param {string} [notationColumn='']
     * @property {string[]} figureStrings
     * @property {int[]} origNumbers
     * @property {int[]} numbers
     * @property {string[]} modifierStrings
     * @property {Modifier[]} modifiers
     * @property {Figure[]} figures
     */
    constructor(notationColumn?: string);
    /**
     * _parseNotationColumn - Given a notation column below a pitch, defines both this.numbers
     *    and this.modifierStrings, which provide the intervals above the
     *    bass and (if necessary) how to modify the corresponding pitches
     *    accordingly.
     */
    _parseNotationColumn(): void;
    _translateToLonghand(): void;
    _getModifiers(): void;
    _getFigures(): void;
}
export declare class Figure {
    number: number;
    modifierString: string;
    modifier: Modifier;
    constructor(number: number, modifierString: string);
}
export declare class Modifier {
    modifierString: string;
    accidental: pitch.Accidental;
    constructor(modifierString: string);
    _toAccidental(): pitch.Accidental;
    modifyPitchName(pitchNameToAlter: string): string;
    modifyPitch(pitchToAlter: pitch.Pitch, inPlace: boolean): pitch.Pitch;
}
//# sourceMappingURL=figuredBass.d.ts.map