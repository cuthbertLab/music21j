define([], function() {
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

    common.copyStream = function (obj, deep, memo) {
        if(obj == null || typeof(obj) !== 'object'){
            return obj;
        }
        if (memo === undefined) {
            memo = new Map();
        }
        var newDepth = memo.get('depth');
        if (newDepth === undefined) {
            newDepth = 1;
        }
        newDepth += 1;
        if (newDepth > 100) {
            console.log('im out of here');
            return undefined;
        }
        memo.set('depth', newDepth);
        if (memo.get(obj) !== undefined) {
            console.log('returning obj: ' + obj + ' from memo');
            return memo.get(obj);
        }
        //make sure the returned object has the same prototype as the original
        var ret = Object.create(obj.constructor.prototype);
        for(var key in obj){
            if (obj.hasOwnProperty(key) == false) {
                continue;
            }
            if (key == 'parent') {
                ret[key] = obj[key];
            } else if (deep != true && (key == '_elements' || key == '_elementOffsets')) {
                ret[key] = obj[key].slice(); // shallow copy...
            } else if (key == 'activeVexflowNote' || key == 'storedVexflowstave') {
                // do nothing -- do not copy vexflowNotes -- permanent recursion
            } else if (
                    Object.getOwnPropertyDescriptor(obj, key).get !== undefined ||
                    Object.getOwnPropertyDescriptor(obj, key).set !== undefined
                    ) {
                // do nothing
            } else if (typeof(obj[key]) == 'function') {
                // do nothing -- events might not be copied.
            } else {
                console.log(key, obj, ret);
                ret[key] = common.copyStream(obj[key], deep, memo);                 
            }
        }
        memo.set(obj, ret);
        return ret;
    };
    
    common.ordinalAbbreviation = function (value, plural) {
        var post = "";
        var valueHundreths = value % 100;
        if (valueHundreths == 11 || valueHundreths == 12 || valueHundreths == 13) {
            post = 'th';
        } else {
            var valueMod = value % 10;
            if (valueMod == 1) {
                post = 'st';
            } else if (valueMod == 2) {
                post = 'nd';
            } else if (valueMod == 3) {
                post = 'rd';
            } else {
                post = 'th';
            }
        }
        if (post != 'st' && plural) {
            post += 's';            
        }
        return post;
    };
    
    common.rationalize = function (ql, epsilon, maxDenominator) {
        epsilon = epsilon || 0.001;
        maxDenominator = maxDenominator || 50;
        
        for (var i = 2; i < maxDenominator; i++) {
            if (Math.abs(ql * i - Math.round(ql * i)) < epsilon) {
                var numerator = Math.round(ql * i);
                var denominator = i;
                return {'numerator': numerator, 'denominator': denominator};
            }
        }
        return undefined;
    };
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.common = common;
    }       
    return common;
});

