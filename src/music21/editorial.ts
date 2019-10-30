/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/editorial -- Representations of editorial information
 *
 * Copyright (c) 2013-19, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
 */

import { ProtoM21Object } from './prebase';

export class Editorial extends ProtoM21Object {
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
    // noinspection JSUnusedGlobalSymbols
    misc: any = {};
}

export default Editorial;
