import Vex from 'vexflow';

import * as common from './common.js';
import * as prebase from './prebase.js';

/**
 * articulations module. See {@link music21.articulations} namespace
 *
 */

/**
 * @namespace music21.articulations
 * @memberof music21
 * @requires music21/prebase, Vexflow
 */
export const articulations = {};

/**
 * Represents a single articulation, usually in the `.articulations` Array
 * on a {@link music21.note.Note} or something like that.
 *
 * @class Articulation
 * @memberof music21.articulations
 * @extends music21.prebase.ProtoM21Object
 * @property {string} name
 * @property {string} [placement='above']
 * @property {string|undefined} vexflowModifier - the string code to get this accidental in Vexflow
 * @property {number} [dynamicScale=1.0] - multiplier for the dynamic of a note that this is attached to
 * @property {number} [lengthScale=1.0] - multiplier for the length of a note that this is attached to.
 */
export class Articulation extends prebase.ProtoM21Object {
    constructor() {
        super();
        this.name = undefined;
        this.placement = 'above';
        this.vexflowModifier = undefined;
        this.setPosition = undefined;
        this.dynamicScale = 1.0;
        this.lengthScale = 1.0;
    }

    /**
     * Generates a Vex.Flow.Articulation for this articulation.
     *
     * @returns {Vex.Flow.Articulation}
     */
    vexflow() {
        const vfa = new Vex.Flow.Articulation(this.vexflowModifier);
        if (this.setPosition) {
            vfa.setPosition(this.setPosition);
        }
        return vfa;
    }
}
articulations.Articulation = Articulation;
/**
 * base class for articulations that change the length of a note...
 *
 * @class LengthArticulation
 * @memberof music21.articulations
 * @extends music21.articulations.Articulation
 */
export class LengthArticulation extends Articulation {
    constructor() {
        super();
        this.name = 'length-articulation';
    }
}
articulations.LengthArticulation = LengthArticulation;

/**
 * base class for articulations that change the dynamic of a note...
 *
 * @class DynamicArticulation
 * @memberof music21.articulations
 * @extends music21.articulations.Articulation
 */
export class DynamicArticulation extends Articulation {
    constructor() {
        super();
        this.name = 'dynamic-articulation';
    }
}
articulations.DynamicArticulation = DynamicArticulation;

/**
 * base class for articulations that change the pitch of a note...
 *
 * @class PitchArticulation
 * @memberof music21.articulations
 * @extends music21.articulations.Articulation
 */
export class PitchArticulation extends Articulation {
    constructor() {
        super();
        this.name = 'pitch-articulation';
    }
}
articulations.PitchArticulation = PitchArticulation;

/**
 * base class for articulations that change the timbre of a note...
 *
 * @class TimbreArticulation
 * @memberof music21.articulations
 * @extends music21.articulations.Articulation
 */
export class TimbreArticulation extends Articulation {
    constructor() {
        super();
        this.name = 'timbre-articulation';
    }
}
articulations.TimbreArticulation = TimbreArticulation;

/**
 * 50% louder than usual
 *
 * @class Accent
 * @memberof music21.articulations
 * @extends music21.articulations.DynamicArticulation
 */
export class Accent extends DynamicArticulation {
    constructor() {
        super();
        this.name = 'accent';
        this.vexflowModifier = 'a>';
        this.dynamicScale = 1.5;
    }
}
articulations.Accent = Accent;

/**
 * 100% louder than usual
 *
 * @class StrongAccent
 * @memberof music21.articulations
 * @extends music21.articulations.Accent
 */
export class StrongAccent extends Accent {
    constructor() {
        super();
        this.name = 'strong accent';
        this.vexflowModifier = 'a^';
        this.dynamicScale = 2.0;
    }
}
articulations.StrongAccent = StrongAccent;

/**
 * no playback for now.
 *
 * @class Staccato
 * @memberof music21.articulations
 * @extends music21.articulations.LengthArticulation
 */
export class Staccato extends LengthArticulation {
    constructor() {
        super();
        this.name = 'staccato';
        this.vexflowModifier = 'a.';
    }
}
articulations.Staccato = Staccato;

/**
 * no playback for now.
 *
 * @class Staccatissimo
 * @memberof music21.articulations
 * @extends music21.articulations.Staccato
 */
export class Staccatissimo extends Staccato {
    constructor() {
        super();
        this.name = 'staccatissimo';
        this.vexflowModifier = 'av';
    }
}
articulations.Staccatissimo = Staccatissimo;

/**
 * no playback or display for now.
 *
 * @class Spiccato
 * @memberof music21.articulations
 * @extends music21.articulations.Staccato
 */
export class Spiccato extends Staccato {
    constructor() {
        super();
        this.name = 'spiccato';
        this.vexflowModifier = undefined;
    }
}
articulations.Spiccato = Spiccato;

/**
 * @class Marcato
 * @memberof music21.articulations
 * @extends music21.articulations.DynamicArticulation
 * @extends music21.articulations.LengthArticulation
 */
export class Marcato extends DynamicArticulation {
    constructor() {
        super();
        common.mixin(LengthArticulation, this);
        this.name = 'marcato';
        this.vexflowModifier = 'a^';
        this.dynamicScale = 1.7;
    }
}
articulations.Marcato = Marcato;

/**
 * @class Tenuto
 * @memberof music21.articulations
 * @extends music21.articulations.LengthArticulation
 */
export class Tenuto extends LengthArticulation {
    constructor() {
        super();
        this.name = 'tenuto';
        this.vexflowModifier = 'a-';
    }
}
articulations.Tenuto = Tenuto;
