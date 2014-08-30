/**
 *  things that all music21-created objects, not just objects that can live in
 *  Stream.elements should inherit
 */

define(['./common'], function() {
    var prebase = {};
    /*   class for pseudo m21 objects to inherit from */
    prebase.ProtoM21Object = function () {
        this.classes = ['ProtoM21Object'];
        this.isProtoM21Object = true;
        this.isMusic21Object = false;    
        this._cloneCallbacks = {};
    };

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
     * 
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