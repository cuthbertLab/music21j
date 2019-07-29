/**
 * @namespace music21.figuredBass
 * @exports music21/figuredBass
 */
import * as pitch from './pitch.js';

const shorthandNotation = {
    '': [5, 3],
    '5': [5, 3],
    '6': [6, 3],
    '7': [7, 5, 3],
    '9': [9, 7, 5, 3],
    '11': [11, 9, 7, 5, 3],
    '13': [13, 11, 9, 7, 5, 3],
    '6,5': [6, 5, 3],
    '4,3': [6, 4, 3],
    '4,2': [6, 4, 2],
    '2': [6, 4, 2],
};
/**
 * In music21p is in figuredBass.notation -- eventually to be moved there.
 */


/**
 * @memberof music21.figuredBass
 */
export class Notation {
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
    constructor(notationColumn='') {
        this.notationColumn = notationColumn;
        this.figureStrings = undefined;
        this.origNumbers = undefined;
        this.origModStrings = undefined;
        this.numbers = undefined;
        this.modifierStrings = undefined;
        this._parseNotationColumn();
        this._translateToLonghand();

        this.modifiers = undefined;
        this.figures = undefined;
        this._getModifiers();
        this._getFigures();
    }

    /**
     * _parseNotationColumn - Given a notation column below a pitch, defines both this.numbers
     *    and this.modifierStrings, which provide the intervals above the
     *    bass and (if necessary) how to modify the corresponding pitches
     *    accordingly.
     *
     * @return {undefined}
     */

    _parseNotationColumn() {
        const nc = this.notationColumn;
        const figures = nc.split(/,/);
        const numbers = [];
        const modifierStrings = [];
        const figureStrings = [];

        for (let figure of figures) {
            figure = figure.trim();
            figureStrings.push(figure);
            let numberString = '';
            let modifierString = '';
            for (const c of figure) {
                if (c.match(/\d/)) {
                    numberString += c;
                } else {
                    modifierString += c;
                }
            }
            let number;
            if (numberString !== '') {
                number = parseInt(numberString);
            }
            numbers.push(number);
            if (modifierString === '') {
                modifierString = undefined;
            }
            modifierStrings.push(modifierString);
        }
        this.origNumbers = numbers;
        this.numbers = numbers;
        this.modifierStrings = modifierStrings;
        this.figureStrings = figureStrings;
    }

    _translateToLonghand() {
        let oldNumbers = this.numbers;
        let newNumbers = oldNumbers;
        const oldModifierStrings = this.modifierStrings;
        let newModifierStrings = oldModifierStrings;
        const oldNumbersString = oldNumbers.toString();

        if (shorthandNotation[oldNumbersString] !== undefined) {
            newNumbers = shorthandNotation[oldNumbersString];
            newModifierStrings = [];
            const temp = [];
            for (const number of oldNumbers) {
                if (number === undefined) {
                    temp.push(3);
                } else {
                    temp.push(number);
                }
            }
            oldNumbers = temp;

            for (const number of newNumbers) {
                let newModifierString;
                if (oldNumbers.includes(number)) {
                    const modifierStringIndex = oldNumbers.indexOf(number);
                    newModifierString = oldModifierStrings[modifierStringIndex];
                }
                newModifierStrings.push(newModifierString);
            }
        } else {
            const temp = [];
            for (const number of oldNumbers) {
                if (number === undefined) {
                    temp.push(3);
                } else {
                    temp.push(number);
                }
            }
            newNumbers = temp;
        }
        this.numbers = newNumbers;
        this.modifierStrings = newModifierStrings;
    }

    _getModifiers() {
        const modifiers = [];
        for (let i = 0; i < this.numbers.length; i++) {
            const modifierString = this.modifierStrings[i];
            const modifier = new Modifier(modifierString);
            modifiers.push(modifier);
        }
        this.modifiers = modifiers;
    }

    _getFigures() {
        const figures = [];
        for (let i = 0; i < this.numbers.length; i++) {
            const number = this.numbers[i];
            const modifierString = this.modifierStrings[i];
            const figure = new Figure(number, modifierString);
            figures.push(figure);
        }
        this.figures = figures;
    }
}

/**
 * @memberOf music21.figuredBass
 */
export class Figure {
    constructor(number, modifierString) {
        this.number = number;
        this.modifierString = modifierString;
        this.modifier = new Modifier(modifierString);
    }
}

const specialModifiers = {
    '+': '#',
    '/': '-',
    '\\': '#',
    b: '-',
    bb: '--',
    bbb: '---',
    bbbb: '-----',
    '++': '##',
    '+++': '###',
    '++++': '####',
};

/**
 * @memberOf music21.figuredBass
 */
export class Modifier {
    constructor(modifierString) {
        this.modifierString = modifierString;
        this.accidental = this._toAccidental();
    }

    _toAccidental() {
        let modStr = this.modifierString;
        if (modStr === undefined || modStr === '') {
            return undefined;
        }
        const a = new pitch.Accidental();
        if (specialModifiers[modStr] !== undefined) {
            modStr = specialModifiers[modStr];
        }
        a.set(modStr);
        return a;
    }

    modifyPitchName(pitchNameToAlter) {
        const pitchToAlter = new pitch.Pitch(pitchNameToAlter);
        this.modifyPitch(pitchToAlter, true);
        return pitchToAlter.name;
    }

    modifyPitch(pitchToAlter, inPlace) {
        if (inPlace !== true) {
            pitchToAlter = pitchToAlter.clone();
        }

        if (this.accidental === undefined) {
            return pitchToAlter;
        }

        if (
            this.accidental.alter === 0.0
            || pitchToAlter.accidental === undefined
        ) {
            pitchToAlter.accidental = this.accidental.clone();
        } else {
            const newAccidental = new pitch.Accidental();
            const newAlter
                = pitchToAlter.accidental.alter + this.accidental.alter;
            newAccidental.set(newAlter);
            pitchToAlter.accidental = newAccidental;
        }
        return pitchToAlter;
    }
}

