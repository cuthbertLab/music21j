/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 * The infamous vfShims returns!  To fix things that Vexflow makes hard to fix!
 *
 * These were used in 0.15.x on the new lyrics, but are currently unused, since
 * the new lyrics in Vexflow would cause staves to overflow.
 */
import { Annotation, type ModifierContextState } from 'vexflow';
export declare class VFLyricAnnotation extends Annotation {
    static DEBUG: boolean;
    fill: string;
    static format(annotations: VFLyricAnnotation[], state: ModifierContextState): boolean;
    getFill(): string;
    setFill(color: string): void;
    /** Render text below the note at the given staff line */
    draw(): void;
}
//# sourceMappingURL=vfShims.d.ts.map