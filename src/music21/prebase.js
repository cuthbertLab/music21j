define(['./common'],
        /**
         * module for things that all music21-created objects, not just objects that can live in
         * Stream.elements should inherit
         *
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
     */
    prebase.ProtoM21Object = function () {
        /**
         * An Array of strings of classes that the object belongs to
         * 
         * @name music21.prebase.ProtoM21Object.classes
         * @type {Array<String>}
         * @default ['ProtoM21Object']
         */
        this.classes = ['ProtoM21Object'];
        /**
         * Does this object descend from {@link music21.prebase.ProtoM21Object} -- obviously true.
         * 
         * @name music21.prebase.ProtoM21Object.isProtoM21Object
         * @type {Boolean}
         * @default true
         */
        this.isProtoM21Object = true;
        /**
         * Does this object descend from {@link music21.base.Music21Object} -- default false.
         * 
         * @name music21.prebase.ProtoM21Object.isMusic21Object
         * @type {Boolean}
         * @default false
         */
        this.isMusic21Object = false;    
        this._cloneCallbacks = {};
    };

    /**
     * Makes (as much as possible) a complete duplicate copy of the object called with .clone()
     * 
     * Works similarly to Python's copy.deepcopy().
     * 
     * @returns {object}
     * @memberof music21.prebase.ProtoM21Object
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
     * @param {(string|string[])} testClass
     * @returns {Boolean}
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