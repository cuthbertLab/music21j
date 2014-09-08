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
    
    /**
     * runs a callback with either "visible" or "hidden" as the argument anytime the
     * window or document state changes.
     * 
     * Depending on the browser, may be called multiple times with the same argument
     * for a single event.  For instance, Safari calls once on losing focus completely
     * but twice for a tab change.
     */
    common.setWindowFocusWatcher = function (callback) {
        var hidden = "hidden";

        // Standards:
        if (hidden in document) {
            document.addEventListener("visibilitychange", windowFocusChanged);                
        } else if ((hidden = "mozHidden") in document) {
            document.addEventListener("mozvisibilitychange", windowFocusChanged);                
        } else if ((hidden = "webkitHidden") in document) {
            document.addEventListener("webkitvisibilitychange", windowFocusChanged);                
        } else if ((hidden = "msHidden") in document) {
            document.addEventListener("msvisibilitychange", windowFocusChanged);                
        } else if ('onfocusin' in document) {
            // IE 9 and lower:
            document.onfocusin = document.onfocusout = windowFocusChanged;
        } 
        
        // Also catch window... -- get two calls for a tab shift, but one for window losing focus
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = windowFocusChanged;                
        
        
        function windowFocusChanged (evt) {
            var v = 'visible', h = 'hidden',
                evtMap = { 
                    focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h, 
                };

            evt = evt || window.event;
            var callbackState = "";
            if (evt.type in evtMap) {
                callbackState = evtMap[evt.type];                
            } else {
                callbackState = this[hidden] ? "hidden" : "visible";                
            }
            callback(callbackState);
        }
        // set the initial state
        var initialState = ((document.visibilityState == "visible") ? "focus" : "blur");
        var initialStateEvent = { 'type': initialState };
        windowFocusChanged(initialStateEvent); 
    };
    // end of define
    if (typeof(music21) != "undefined") {
        music21.common = common;
    }       
    return common;
});

