/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/editorial -- Representations of editorial information
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 */
import { ProtoM21Object } from './prebase';
export declare class Editorial extends ProtoM21Object implements Record<string, any> {
    static get className(): string;
    comments: any[];
    footnotes: any[];
    ficta: any;
    harmonicInterval: any;
    melodicInterval: any;
}
export default Editorial;
//# sourceMappingURL=editorial.d.ts.map