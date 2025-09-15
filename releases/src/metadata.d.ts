/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/metadata -- Very basic metadata object
 *
 * Copyright (c) 2013-25, Michael Scott Asato Cuthbert, BSD License
 * Based on music21 (=music21p), Copyright (c) 2006-25, Michael Scott Asato Cuthbert
 */
import { Music21Object } from './base';
export declare class Metadata extends Music21Object {
    title: string | undefined;
    composer: string | undefined;
    constructor(vars?: any);
    static get className(): string;
}
export default Metadata;
//# sourceMappingURL=metadata.d.ts.map