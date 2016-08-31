import * as Vex from 'vexflow';

import { base } from './base';
/**
 * Expressions module.  See {@link music21.expressions}
 *
 * @exports music21/expressions
 */
/**
 * Expressions can be note attached (`music21.note.Note.expressions[]`) or floating...
 *
 * @namespace music21.expressions
 * @memberof music21
 * @requires music21/expressions
 */
export const expressions = {};

/**
 * Expressions can be note attached (`music21.note.Note.expressions[]`) or floating...
 *
 * @class Expression
 * @memberof music21.expressions
 * @extends music21.base.Music21Object
 * @property {string} name
 * @property {string} vexflowModifier
 * @property {Int} setPosition
 */
export class Expression extends base.Music21Object {
    constructor() {
        super();
        this.classes.push('Expression');
        this.name = 'expression';
        this.vexflowModifier = '';
        this.setPosition = undefined;
    }
    /**
     * Renders this Expression as a Vex.Flow.Articulation
     *
     * (this is not right for all cases)
     *
     * @memberof music21.expressions.Expression
     * @returns {Vex.Flow.Articulation}
     */
    vexflow() {
        const vfe =  new Vex.Flow.Articulation(this.vexflowModifier);
        if (this.setPosition) {
            vfe.setPosition(this.setPosition);
        }
        return vfe;
    }
}
expressions.Expression = Expression;

/**
 * A fermata...
 *
 * @class Fermata
 * @memberof music21.expressions
 * @extends music21.expressions.Expression
 */
export class Fermata extends Expression {
    constructor() {
        super();
        this.classes.push('Fermata');
        this.name = 'fermata';
        this.vexflowModifier = 'a@a';
        this.setPosition = 3;
    }
}
expressions.Fermata = Fermata;
