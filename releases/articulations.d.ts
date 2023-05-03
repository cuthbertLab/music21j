/**
 * articulations module.
 */
import { Articulation as VFArticulation, Ornament as VFOrnament } from 'vexflow';
import * as prebase from './prebase';
export declare enum ArticulationPlacement {
    ABOVE = "above",
    BELOW = "below",
    LEFT = "left",
    RIGHT = "right",
    STEM_SIDE = "stemSide",
    NOTE_SIDE = "noteSide"
}
export declare const ArticulationPlacementToVexFlowModifierPosition: Map<ArticulationPlacement, import("vexflow").ModifierPosition>;
export interface VexflowArticulationParams {
    stemDirection?: string;
}
/**
 * This works the same for music21 Articulations and Expressions
 */
export declare function setPlacementOnVexFlowArticulation(vfa: VFArticulation | VFOrnament, placement: ArticulationPlacement, stemDirection: string): void;
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
export declare class Articulation extends prebase.ProtoM21Object {
    static get className(): string;
    name: string;
    placement: ArticulationPlacement;
    vexflowModifier: string;
    dynamicScale: number;
    lengthScale: number;
    /**
     * Generates a Vex.Flow.Articulation for this articulation.
     */
    vexflow({ stemDirection }?: VexflowArticulationParams): VFArticulation;
}
/**
 * base class for articulations that change the length of a note...
 */
export declare class LengthArticulation extends Articulation {
    static get className(): string;
    constructor();
}
/**
 * base class for articulations that change the dynamic of a note...
 */
export declare class DynamicArticulation extends Articulation {
    static get className(): string;
    constructor();
}
/**
 * base class for articulations that change the pitch of a note...
 */
export declare class PitchArticulation extends Articulation {
    static get className(): string;
    constructor();
}
/**
 * base class for articulations that change the timbre of a note...
 */
export declare class TimbreArticulation extends Articulation {
    static get className(): string;
    constructor();
}
/**
 * 50% louder than usual
 */
export declare class Accent extends DynamicArticulation {
    static get className(): string;
    constructor();
}
/**
 * 100% louder than usual
 */
export declare class StrongAccent extends Accent {
    static get className(): string;
    constructor();
}
/**
 * no playback for now.
 */
export declare class Staccato extends LengthArticulation {
    static get className(): string;
    constructor();
}
/**
 * no playback for now.
 */
export declare class Staccatissimo extends Staccato {
    static get className(): string;
    constructor();
}
/**
 * no playback or display for now.
 */
export declare class Spiccato extends Staccato {
    static get className(): string;
    constructor();
}
/**
 * should be both a DynamicArticulation and a LengthArticulation
 * TODO(msc): check that `.classes` reflects that in music21j
 */
export declare class Marcato extends DynamicArticulation {
    static get className(): string;
    constructor();
}
export declare class Tenuto extends LengthArticulation {
    static get className(): string;
    constructor();
}
//# sourceMappingURL=articulations.d.ts.map