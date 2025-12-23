/**
 * Expressions can be note-attached (`music21.note.Note.expressions[]`) or floating...
 *
 */

import { Articulation as VFArticulation, Ornament as VFOrnament } from 'vexflow';
import * as base from './base';
import {
    ArticulationPlacement,
    setPlacementOnVexFlowArticulation,
    VexflowArticulationParams,
} from './articulations';

/**
 * Expressions can be note-attached (`music21.note.Note.expressions[]`) or floating...
 *
 * @property {string} name
 * @property {string} vexflowModifier
 * @property {number} setPosition
 */
export class Expression extends base.Music21Object {
    static get className() { return 'music21.expressions.Expression'; }

    name: string = 'expression';
    vexflowModifier: string = '';
    placement: ArticulationPlacement = ArticulationPlacement.ABOVE;

    /**
     * Renders this Expression as a Vex.Flow.Articulation
     *
     * (this is not right for all cases)
     */
    vexflow({stemDirection}: VexflowArticulationParams = {}): VFArticulation | VFOrnament | null {
        if (!this.vexflowModifier) {
            return null;
        }
        const vfe = new VFArticulation(this.vexflowModifier);
        setPlacementOnVexFlowArticulation(vfe, this.placement, stemDirection);
        return vfe;
    }
}

/**
 * A fermata...
 *
 */
export class Fermata extends Expression {
    static get className() { return 'music21.expressions.Fermata'; }

    constructor() {
        super();
        this.name = 'fermata';
        this.vexflowModifier = 'a@a';
    }
}


export class Ornament extends Expression {
    static get className() { return 'music21.expressions.Ornament'; }

    name: string = 'ornament';
    vexflow({stemDirection}: VexflowArticulationParams = {}): VFOrnament | null {
        if (!this.vexflowModifier) {
            return null;
        }
        const vfe = new VFOrnament(this.vexflowModifier);
        setPlacementOnVexFlowArticulation(vfe, this.placement, stemDirection);
        return vfe;
    }
}


export class Trill extends Ornament {
    static get className() { return 'music21.expressions.Trill'; }

    constructor() {
        super();
        this.name = 'trill';
        this.vexflowModifier = 'tr';
    }
}

export class Turn extends Ornament {
    static get className() { return 'music21.expressions.Turn'; }

    constructor() {
        super();
        this.name = 'turn';
        this.vexflowModifier = 'turn';
    }
}

export class InvertedTurn extends Turn {
    static get className() { return 'music21.expressions.InvertedTurn'; }

    constructor() {
        super();
        this.name = 'invertedTurn';
        this.vexflowModifier = 'turn_inverted';
    }
}

export class GeneralMordent extends Ornament {
    static get className() { return 'music21.expressions.GeneralMordent'; }
}


/**
 * note that Vexflow's definition of mordent/inverted mordent is backwards
 * from music theory. -- see music21p for more details.
 */
export class Mordent extends GeneralMordent {
    static get className() { return 'music21.expressions.Mordent'; }

    constructor() {
        super();
        this.name = 'mordent';
        this.vexflowModifier = 'mordent_inverted';
    }
}

export class InvertedMordent extends GeneralMordent {
    static get className() { return 'music21.expressions.InvertedMordent'; }

    constructor() {
        super();
        this.name = 'invertedMordent';
        this.vexflowModifier = 'mordent';
    }
}
