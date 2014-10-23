define(['./common'],
        /**
         * module for things that all music21-created objects, not just objects that can live in
         * Stream.elements should inherit
         *
         * @requires music21/common
         * @exports music21/prebase
         */
        function(common) {
    /**
     * module for things that all music21-created objects, not just objects that can live in
     * Stream.elements should inherit
     * 
     * @namespace music21.prebase
     * @memberof music21
     */
    var prebase = {};
    /**
     * Class for pseudo-m21 objects to inherit from. The most important attributes that nearly
     * everything in music21 should inherit from are given below.
     * 
     * @class ProtoM21Object
     * @memberof music21.prebase
     * @property {Array<string>} classes - An Array of strings of classes that the object belongs to (default ['ProtoM21Object'])
     * @property {Boolean} isProtoM21Object - Does this object descend from {@link music21.prebase.ProtoM21Object}: obviously true.
     * @property {Boolean} isMusic21Object - Does this object descend from {@link music21.base.Music21Object}; default false.
     */
    prebase.ProtoM21Object = function () {
        this.classes = ['ProtoM21Object'];
        this.isProtoM21Object = true;
        this.isMusic21Object = false;    
        this._cloneCallbacks = {};
    };

    /**
     * Makes (as much as possible) a complete duplicate copy of the object called with .clone()
     * 
     * Works similarly to Python's copy.deepcopy().
     * 
     * Every ProtoM21Object has a `._cloneCallbacks` object which maps `{attribute: callbackFunction}`
     * to handle custom clone cases.  See, for instance, {@link music21.base.Music21Object} which
     * uses a custom callback to NOT clone the `.activeSite` attribute.
     * 
     * @returns {object}
     * @memberof music21.prebase.ProtoM21Object
     * @example
     * var n1 = new music21.note.Note("C#");
     * n1.duration.quarterLength = 4;
     * var n2 = n1.clone();
     * n2.duration.quarterLength == 4; // true
     * n2 === n1; // false
     */
    prebase.ProtoM21Object.prototype.clone = function () {
        var ret = new this.constructor();
        
        // todo: do Arrays work?
        for(var key in this){ // not that we ONLY copy the keys in Ret -- it's easier that way.
            if (this.hasOwnProperty(key) == false) {
                continue;
            }
            if (key in this._cloneCallbacks) {
                if (this._cloneCallbacks[key] === true) {
                    ret[key] = this[key];
                } else if (this._cloneCallbacks[key] === false) {
                    ret[key] = undefined;
                } else { // call the cloneCallbacks function
                    this._cloneCallbacks[key](key, ret, this);
                }
            } else if (
                    Object.getOwnPropertyDescriptor(this, key).get !== undefined ||
                    Object.getOwnPropertyDescriptor(this, key).set !== undefined
                    ) {
                // do nothing
            } else if (typeof(this[key]) == 'function') {
                // do nothing -- events might not be copied.
            } else if (typeof(this[key]) == 'object' && this[key] !== null &&
                    this[key].isProtoM21Object) {
                //console.log('cloning ', key);
                ret[key] = this[key].clone();
            } else {
                try {
                    ret[key] = this[key];
                    //music21.common.merge(ret[key], this[key]); // not really necessary? 
                } catch (e) {
                    if (e instanceof TypeError) {
                        console.log("typeError:", e, key);
                        // do nothing
                    } else {
                        throw(e);
                    }
                }
            }
        }
        return ret;
    };
    /**
     * Check to see if an object is of this class or subclass.
     * 
     * @memberof music21.prebase.ProtoM21Object
     * @param {(string|string[])} testClass - a class or Array of classes to test
     * @returns {Boolean}
     * @example
     * var n = new music21.note.Note();
     * n.isClassOrSubclass('Note'); // true
     * n.isClassOrSubclass('Music21Object'); // true
     * n.isClassOrSubclass(['Duration', 'NotRest']); // true // NotRest
     */
    prebase.ProtoM21Object.prototype.isClassOrSubclass = function (testClass) {
        if (testClass instanceof Array == false) {
            testClass = [testClass];
        }
        for (var i = 0; i < testClass.length; i++) {
            if ($.inArray(testClass[i], this.classes) != -1) {
                return true;
            }   
        }
        return false;
    };
    
    if (typeof music21 != "undefined") {
        music21.prebase = prebase;
    }
    return prebase;
});