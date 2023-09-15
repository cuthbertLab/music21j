/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/editorial -- Representations of editorial information
 *
 * Copyright (c) 2013-23, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-23, Michael Scott Asato Cuthbert
 */

import { ProtoM21Object } from './prebase';

export class Editorial extends ProtoM21Object implements Record<string, any> {
    static get className() { return 'music21.editorial.Editorial'; }

    comments: any[] = [];
    // noinspection JSUnusedGlobalSymbols
    footnotes: any[] = [];

    // these are already deprecated.
    // noinspection JSUnusedGlobalSymbols
    ficta: any = undefined;
    // noinspection JSUnusedGlobalSymbols
    harmonicInterval: any = undefined;
    // noinspection JSUnusedGlobalSymbols
    melodicInterval: any = undefined;
}

export default Editorial;
