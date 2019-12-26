/**
 * articulations module. See {@link music21.articulations} namespace
 *
 * @namespace music21.articulations
 * @memberof music21
 * @requires music21/prebase
 * @requires vexflow
 * @requires music21/common
 */
import Vex from 'vexflow';

import * as common from './common';
import * as prebase from './prebase';

/**
 * Represents a single articulation, usually in the `.articulations` Array
 * on a {@link music21.note.Note} or something like that.
 *
 * @class Articulation
 * @memberof music21.articulations
 * @property {string} name
 * @property {string} [placement='above']
 * @property {string|undefined} vexflowModifier - the string code to get this accidental in Vexflow
 * @property {number} [dynamicScale=1.0] - multiplier for the dynamic of a note that this is attached to
 * @property {number} [lengthScale=1.0] - multiplier for the length of a note that this is attached to.
 */
export class Articulation extends prebase.ProtoM21Object {
    static get className() { return 'music21.articulation.Articulation'; }

    name: string;
    placement: string = 'above';
    vexflowModifier: string;
    setPosition;  // ?
    dynamicScale: number = 1.0;
    lengthScale: number = 1.0;

    /**
     * Generates a Vex.Flow.Articulation for this articulation.
     *
     * @returns {Vex.Flow.Articulation}
     */
    vexflow(): Vex.Flow.Articulation {
        const vfa = new Vex.Flow.Articulation(this.vexflowModifier);
        if (this.setPosition) {
            vfa.setPosition(this.setPosition);
        }
        return vfa;
    }
}

/**
 * base class for articulations that change the length of a note...
 *
 * @class LengthArticulation
 * @memberof music21.articulations
 */
export class LengthArticulation extends Articulation {
    static get className() { return 'music21.articulation.LengthArticulation'; }

    constructor() {
        super();
        this.name = 'length-articulation';
    }
}

/**
 * base class for articulations that change the dynamic of a note...
 *
 * @class DynamicArticulation
 * @memberof music21.articulations
 */
export class DynamicArticulation extends Articulation {
    static get className() { return 'music21.articulation.DynamicArticulation'; }

    constructor() {
        super();
        this.name = 'dynamic-articulation';
    }
}

/**
 * base class for articulations that change the pitch of a note...
 *
 * @class PitchArticulation
 * @memberof music21.articulations
 */
export class PitchArticulation extends Articulation {
    static get className() { return 'music21.articulation.PitchArticulation'; }

    constructor() {
        super();
        this.name = 'pitch-articulation';
    }
}

/**
 * base class for articulations that change the timbre of a note...
 *
 * @class TimbreArticulation
 * @memberof music21.articulations
 */
export class TimbreArticulation extends Articulation {
    static get className() { return 'music21.articulation.TimbreArticulation'; }

    constructor() {
        super();
        this.name = 'timbre-articulation';
    }
}

/**
 * 50% louder than usual
 *
 * @class Accent
 * @memberof music21.articulations
 */
export class Accent extends DynamicArticulation {
    static get className() { return 'music21.articulation.Accent'; }

    constructor() {
        super();
        this.name = 'accent';
        this.vexflowModifier = 'a>';
        this.dynamicScale = 1.5;
    }
}

/**
 * 100% louder than usual
 *
 * @class StrongAccent
 * @memberof music21.articulations
 */
export class StrongAccent extends Accent {
    static get className() { return 'music21.articulation.StrongAccent'; }

    constructor() {
        super();
        this.name = 'strong accent';
        this.vexflowModifier = 'a^';
        this.dynamicScale = 2.0;
    }
}

/**
 * no playback for now.
 *
 * @class Staccato
 * @memberof music21.articulations
 */
export class Staccato extends LengthArticulation {
    static get className() { return 'music21.articulation.Staccato'; }

    constructor() {
        super();
        this.name = 'staccato';
        this.vexflowModifier = 'a.';
    }
}

/**
 * no playback for now.
 *
 * @class Staccatissimo
 * @memberof music21.articulations
 */
export class Staccatissimo extends Staccato {
    static get className() { return 'music21.articulation.Staccatissimo'; }

    constructor() {
        super();
        this.name = 'staccatissimo';
        this.vexflowModifier = 'av';
    }
}

/**
 * no playback or display for now.
 *
 * @class Spiccato
 * @memberof music21.articulations
 */
export class Spiccato extends Staccato {
    static get className() { return 'music21.articulation.Spiccato'; }

    constructor() {
        super();
        this.name = 'spiccato';
        this.vexflowModifier = undefined;
    }
}

/**
 * @class Marcato
 * @memberof music21.articulations
 *
 * is both a DynamicArticulation and a LengthArticulation
 * TODO(msc): check that `.classes` reflects that
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

/**
 * @class Tenuto
 * @memberof music21.articulations
 */
export class Tenuto extends LengthArticulation {
    static get className() { return 'music21.articulation.Tenuto'; }

    constructor() {
        super();
        this.name = 'tenuto';
        this.vexflowModifier = 'a-';
    }
}
