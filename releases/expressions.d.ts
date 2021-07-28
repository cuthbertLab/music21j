/**
 * Expressions module.  See {@link music21.expressions}
 * Expressions can be note attached (`music21.note.Note.expressions[]`) or floating...
 *
 * @exports music21/expressions
 * @namespace music21.expressions
 * @memberof music21
 * @requires music21/expressions
 */
import Vex from 'vexflow';
import * as base from './base';
import { ArticulationPlacement, VexflowArticulationParams } from './articulations';
/**
 * Expressions can be note attached (`music21.note.Note.expressions[]`) or floating...
 *
 * @class Expression
 * @memberof music21.expressions
 * @extends music21.base.Music21Object
 * @property {string} name
 * @property {string} vexflowModifier
 * @property {number} setPosition
 */
export declare class Expression extends base.Music21Object {
    static get className(): string;
    name: string;
    vexflowModifier: string;
    placement: ArticulationPlacement;
    /**
     * Renders this Expression as a Vex.Flow.Articulation
     *
     * (this is not right for all cases)
     *
     * @returns {Vex.Flow.Articulation}
     */
    vexflow({ stemDirection }?: VexflowArticulationParams): Vex.Flow.Articulation;
}
/**
 * A fermata...
 *
 * @class Fermata
 * @memberof music21.expressions
 * @extends music21.expressions.Expression
 */
export declare class Fermata extends Expression {
    static get className(): string;
    constructor();
}
export declare class Ornament extends Expression {
    static get className(): string;
    name: string;
    vexflow({ stemDirection }?: VexflowArticulationParams): Vex.Flow.Articulation;
}
export declare class Trill extends Ornament {
    static get className(): string;
    constructor();
}
export declare class Turn extends Ornament {
    static get className(): string;
    constructor();
}
export declare class InvertedTurn extends Turn {
    static get className(): string;
    constructor();
}
export declare class GeneralMordent extends Ornament {
    static get className(): string;
}
/**
 * note that Vexflow's definition of mordent/inverted mordent is backwards
 * from music theory. -- see music21p for more details.
 */
export declare class Mordent extends GeneralMordent {
    static get className(): string;
    constructor();
}
export declare class InvertedMordent extends GeneralMordent {
    static get className(): string;
    constructor();
}
//# sourceMappingURL=expressions.d.ts.map