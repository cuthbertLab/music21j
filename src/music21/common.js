define([], function(require) {
    var common = {};    
    
    common.makeSVGright = function (tag, attrs) {
        // see http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
        // normal JQuery does not work.
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs) {
            el.setAttribute(k, attrs[k]);            
        }
        return el;
    };

    common.copyStream = function (obj, memo) {
        if(obj == null || typeof(obj) !== 'object'){
            return obj;
        }
        if (memo === undefined) {
            memo = {};
        }
        //make sure the returned object has the same prototype as the original
        var ret = Object.create(obj.constructor.prototype);
        for(var key in obj){
            if (obj.hasOwnProperty(key) == false) {
                continue;
            }
            if (key == 'parent') {
                ret[key] = obj[key];
            } else if (key == '_elements' || key == '_elementOffsets') {
                ret[key] = obj[key].slice(); // shallow copy...
            } else if (
                    Object.getOwnPropertyDescriptor(obj, key).get !== undefined ||
                    Object.getOwnPropertyDescriptor(obj, key).set !== undefined
                    ) {
                // do nothing
            } else if (typeof(obj[key]) == 'function') {
                // do nothing -- events might not be copied.
            } else {
                if (!(key in memo)) {
                    //console.log(key, ret[key]);
                    ret[key] = music21.common.copyStream(obj[key], memo);                    
                }
            }
        }
        return ret;
    };
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.common = common;
    }       
    return common;
});

