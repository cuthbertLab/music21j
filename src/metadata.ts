/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/metadata -- Very basic metadata object
 *
 * Copyright (c) 2013-25, Michael Scott Asato Cuthbert, BSD License
 * Based on music21 (=music21p), Copyright (c) 2006-25, Michael Scott Asato Cuthbert
 */

import { Music21Object } from './base';

export class Metadata extends Music21Object {
    title: string|undefined = undefined;
    composer: string|undefined = undefined;
    override classSortOrder = -30;

    constructor(vars: any = {}) {
        super(vars);
        if ('title' in vars) {
            this.title = vars.title;
        }
        if ('composer' in vars) {
            this.composer = vars.composer;
        }
    }

    static get className() { return 'music21.metadata.Metadata'; }
}

export default Metadata;
