define([], function() {
    var common = {};    
    
    common.merge = function MergeRecursive(destination, source) {
        //concept borrowed from Vex.Flow.Merge, though source can be undefined;
        // http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
        // recursive parts used in .clone()
        if (source === undefined || source === null) {
            return destination;
        }
        for (var p in source) {
          try {
            // Property in destination object set; update its value.
            if ( source[p].constructor == Object ) {
                destination[p] = MergeRecursive(destination[p], source[p]);
            } else {
                destination[p] = source[p];
            }
          } catch(e) {
            // Property in destination object not set; create it and set its value.
              destination[p] = source[p];
          }
        }
        return destination;
    };
    
    common.makeSVGright = function (tag, attrs) {
        // see http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
        // normal JQuery does not work.
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs) {
            el.setAttribute(k, attrs[k]);            
        }
        return el;
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
    
    /* from "400px" to 400 */
    common.stripPx = function (str) {
        if (typeof str == 'string') {
            var pxIndex = str.indexOf('px');
            str = str.slice(0, pxIndex);
            return parseInt(str);
        } else {
            return str;
        }
    };
    
    common.urlParam = function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    
    
    /**
     * Logic for copying events from one jQuery object to another.
     *
     * @private 
     * @name music21.common.jQueryEventCopy
     * @param jQuery|String|DOM Element jQuery object to copy events from. Only uses the first matched element.
     * @param jQuery|String|DOM Element jQuery object to copy events to. Copies to all matched elements.
     * @type undefined
     * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
     * @author Yannick Albert (mail@yckart.com || http://yckart.com)
     */
    common.jQueryEventCopy = function  (eventObj, from, to) {
        from = from.jquery ? from : jQuery(from);
        to = to.jquery ? to : jQuery(to);
    
        var events = from[0].events || jQuery.data(from[0], "events") || jQuery._data(from[0], "events");
        if (!from.length || !to.length || !events) return;
    
        return to.each(function () {
            for (var type in events)
                for (var handler in events[type])
                    jQuery.event.add(eventObj, type, events[type][handler], events[type][handler].data);
        });
    };
//    common.walk = function (obj, callback, callList, seen, numSeen) {
//        if (depth == undefined) {
//            depth = 0;
//        }
//        if (depth > 20) {
//            throw "max depth reached";
//        }
//        if (callList === undefined) {
//            callList = [];
//        }
//        if (seen === undefined) {
//            seen = new Set();
//        }
//        var next, item;
//        for (item in obj) {
//            if (obj.hasOwnProperty(item)) {
//                next = obj[item];
//                var nextCallList = []
//                nextCallList.push.apply(callList);
//                nextCallList.push(item);
//                if (callback !== undefined) {
//                    callback.call(this, item, next, nextCallList);
//                }
//                if (typeof next =='object' && next != null) {
//                    if (seen.has(next) == false) {
//                        seen.add(next);
//                        common.walk(next, callback, nextCallList, seen, depth+1);
//                    }
//                }
//            }
//        }
//    };

    // end of define
    if (typeof(music21) != "undefined") {
        music21.common = common;
    }       
    return common;
});

