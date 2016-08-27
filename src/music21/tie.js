import { prebase } from './prebase';

        /**
         * Simple tie module {@link music21.tie} namespace
         * 
         * @exports music21/tie
         */
    /**
     * Tie namespace, just has the {@link music21.tie.Tie} object
     * 
     * @namespace music21.tie
     * @memberof music21
     * @requires music21/prebase
     */
export    var tie = {};

    /**
     * Tie class. Found in {@link music21.note.GeneralNote} `.tie`.
     * 
     * Does not support advanced music21p values `.to` and `.from`
     * 
     * @class Tie
     * @memberof music21.tie
     * @extends music21.prebase.ProtoM21Object
     * @param {string} type - 'start', 'stop', or 'continue'
     * @property {string} type - the tie type
     * @property {string} style - only supports 'normal' for now.
     */
    tie.Tie = function (type) {
        prebase.ProtoM21Object.call(this);
        this.type = type; // start, stop, or continue
        this.style = 'normal';
    };
    tie.Tie.prototype = new prebase.ProtoM21Object();
    tie.Tie.prototype.constructor = tie.Tie;

    