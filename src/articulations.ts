/**
 * articulations module.
 */
import { Articulation as VFArticulation, Modifier as VFModifier, Ornament as VFOrnament } from 'vexflow';

import * as common from './common';
import * as prebase from './prebase';

export enum ArticulationPlacement {
    ABOVE = 'above',
    BELOW = 'below',
    LEFT = 'left',
    RIGHT = 'right',
    STEM_SIDE = 'stemSide',
    NOTE_SIDE = 'noteSide',
}

export const ArticulationPlacementToVexFlowModifierPosition = new Map(
    [
        [ArticulationPlacement.ABOVE, VFModifier.Position.ABOVE],
        [ArticulationPlacement.BELOW, VFModifier.Position.BELOW],
        [ArticulationPlacement.LEFT, VFModifier.Position.LEFT],
        [ArticulationPlacement.RIGHT, VFModifier.Position.RIGHT],
    ]
);

export interface VexflowArticulationParams {
    stemDirection?: string;
}

/**
 * This works the same for music21 Articulations and Expressions
 */
export function setPlacementOnVexFlowArticulation(
    vfa: VFArticulation|VFOrnament,
    placement: ArticulationPlacement,
    stemDirection: string,
): void {
    if (placement === undefined) {
        return;
    }
    if ((!stemDirection || stemDirection === 'none')
        && (placement === ArticulationPlacement.STEM_SIDE
            || placement === ArticulationPlacement.NOTE_SIDE)) {
        placement = ArticulationPlacement.ABOVE;
    }
    if (placement === ArticulationPlacement.STEM_SIDE) {
        if (stemDirection === 'up') {
            placement = ArticulationPlacement.ABOVE;
        } else {
            placement = ArticulationPlacement.BELOW;
        }
    } else if (placement === ArticulationPlacement.NOTE_SIDE) {
        if (stemDirection === 'up') {
            placement = ArticulationPlacement.BELOW;
        } else {
            placement = ArticulationPlacement.ABOVE;
        }
    }
    if (ArticulationPlacementToVexFlowModifierPosition.has(placement)) {
        vfa.setPosition(ArticulationPlacementToVexFlowModifierPosition.get(placement));
    }
}

/**
 * Represents a single articulation, usually in the `.articulations` Array
 * on a music21.note.Note or something like that.
 *
 * @property {string} name
 * @property {string} [placement='above']
 * @property {string|undefined} vexflowModifier - the string code to get this accidental in Vexflow
 * @property {number} [dynamicScale=1.0] - multiplier for the dynamic of a note that this is attached to
 * @property {number} [lengthScale=1.0] - multiplier for the length of a note that this is attached to.
 */
export class Articulation extends prebase.ProtoM21Object {
    static get className() { return 'music21.articulation.Articulation'; }

    name: string;
    placement: ArticulationPlacement = ArticulationPlacement.NOTE_SIDE;
    vexflowModifier: string = '';
    dynamicScale: number = 1.0;
    lengthScale: number = 1.0;

    /**
     * Generates a Vex.Flow.Articulation for this articulation if it is something
     * vexflow can display.
     */
    vexflow({stemDirection}: VexflowArticulationParams = {}): VFArticulation|null {
        if (!this.vexflowModifier) {
            return null;
        }
        const vfa = new VFArticulation(this.vexflowModifier);
        setPlacementOnVexFlowArticulation(vfa, this.placement, stemDirection);
        return vfa;
    }
}

/**
 * base class for articulations that change the length of a note...
 */
export class LengthArticulation extends Articulation {
    static get className() { return 'music21.articulation.LengthArticulation'; }

    override name = 'length-articulation';
}

/**
 * base class for articulations that change the dynamic of a note...
 */
export class DynamicArticulation extends Articulation {
    static get className() { return 'music21.articulation.DynamicArticulation'; }

    override name ='dynamic-articulation';
}

/**
 * base class for articulations that change the pitch of a note...
 */
export class PitchArticulation extends Articulation {
    static get className() { return 'music21.articulation.PitchArticulation'; }

    override name = 'pitch-articulation';
}

/**
 * base class for articulations that change the timbre of a note...
 */
export class TimbreArticulation extends Articulation {
    static get className() { return 'music21.articulation.TimbreArticulation'; }

    override name = 'timbre-articulation';
}

/**
 * 50% louder than usual
 */
export class Accent extends DynamicArticulation {
    static get className() { return 'music21.articulation.Accent'; }

    override name = 'accent';
    override vexflowModifier = 'a>';
    override dynamicScale = 1.5;
}

/**
 * 100% louder than usual
 */
export class StrongAccent extends Accent {
    static get className() { return 'music21.articulation.StrongAccent'; }

    override name = 'strong accent';
    override vexflowModifier = 'a^';
    override dynamicScale = 2.0;
}

export class Staccato extends LengthArticulation {
    static get className() { return 'music21.articulation.Staccato'; }

    override name = 'staccato';
    override vexflowModifier = 'a.';
    override lengthScale = 0.6;
}

export class Staccatissimo extends Staccato {
    static get className() { return 'music21.articulation.Staccatissimo'; }

    override name = 'staccatissimo';
    override vexflowModifier = 'av';
    override lengthScale = 0.3;
}

/**
 * no difference in playback from staccato.  no display.
 */
export class Spiccato extends Staccato {
    static get className() { return 'music21.articulation.Spiccato'; }

    override name = 'spiccato';
    override vexflowModifier = '';
}

/**
 * should be both a DynamicArticulation and a LengthArticulation
 * TODO(msc): check that `.classes` reflects that in music21j
 */
export class Marcato extends DynamicArticulation {
    static get className() { return 'music21.articulation.Marcato'; }

    constructor() {
        super();
        common.mixin(LengthArticulation, this);
        this.name = 'marcato';
        this.vexflowModifier = 'a^';
        this.dynamicScale = 1.7;
    }
}

export class Tenuto extends LengthArticulation {
    static get className() { return 'music21.articulation.Tenuto'; }

    override name = 'tenuto';
    override vexflowModifier = 'a-';
}
