define([], 
        /**
         * common functions
         * 
         * @exports music21/common
         */        
        function() {
    /**
     * functions that are useful everywhere...
     * 
     * @namespace music21.common
     * @memberof music21
     */
    var common = {};    

    /**
     * concept borrowed from Vex.Flow.Merge, though here the source can be undefined;
     * http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
     * recursive parts used in .clone()
     * 
     * @function music21.common.merge
     * @param {object} destination - object to have attributes placed into
     * @param {object} source - object to take attributes from.
     * @memberof music21.common
     * @returns {object} destination
     */
    common.merge = function MergeRecursive(destination, source) {
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

    /**
     * 
     * Returns the statistical mode (most commonly appearing element)
     * in a.
     * 
     * In case of tie, returns the first element to reach the maximum
     * number of occurrences.
     * 
     * @function music21.common.statisticalMode
     * @param {Array} a - an array to analyze
     * @returns {object} element with the highest frequency in a
     */
    common.statisticalMode = function(a) {
        if (a.length == 0) { return null }
        var modeMap = {};
        var maxEl = a[0];
        var maxCount = 1;
        for (var i = 0; i < a.length; i++) {
            var el = a[i];
            if (modeMap[el] == null) {
                modeMap[el] = 0;               
            }
            modeMap[el]++;
            if (modeMap[el] > maxCount) {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    }
    
    /**
     * Creates a DOMObject of an SVG figure using the correct `document.createElementNS` call.
     * 
     * @function music21.common.makeSVGright
     * @param {string} [tag='svg'] - a tag, such as 'rect', 'circle', 'text', or 'svg'
     * @param {object} [attrs] - attributes to pass to the tag.
     * @memberof music21.common
     * @returns {DOMObject}
     */
    common.makeSVGright = function (tag, attrs) {
        // see http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
        // normal JQuery does not work.
        if (tag === undefined) {
            tag = 'svg';
        }
        if (attrs === undefined) {
            attrs = {};
        }
        
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs) {
            el.setAttribute(k, attrs[k]);            
        }
        return el;
    };    
    
    /**
     * Take a number such as 32 and return a string such as "nd" 
     * (for "32nd") etc.
     * 
     * @function music21.common.ordinalAbbreviation
     * @param {Int} value
     * @param {Boolean} [plural=false] - make plural (note that "21st" plural is "21st")
     * @return {string}
     */
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
    
    /**
     * Find a rational number approximation of this floating point.
     * 
     * @function music21.common.rationalize
     * @param {number} ql - number to rationalize
     * @param {number} [epsilon=0.001] - how close to get
     * @param {Int} [maxDenominator=50] - maximum denominator
     * @returns {object|undefined} {'numerator: numerator, 'denominator': denominator}
     */
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
    
    /**
     * Change something that could be a string or number and might
     * end with "px" to a number.
     * 
     * "400px" -> 400
     * 
     * @function music21.common.stripPx
     * @param {Int|string} str -- string that might have 'px' at the end or not
     * @returns {Int} a number to use
     */
    common.stripPx = function (str) {
        if (typeof str == 'string') {
            var pxIndex = str.indexOf('px');
            str = str.slice(0, pxIndex);
            return parseInt(str);
        } else {
            return str;
        }
    };
    
    /**
     * Find name in the query string (?name=value) and return value.
     * 
     * @function music21.common.urlParam
     * @param {string} name - url parameter to find
     * @returns {string} may be "" if empty.
     */
    common.urlParam = function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    
    
    /**
     * Copies an event from one jQuery object to another.
     *
     * @function music21.common.jQueryEventCopy
     * @param {Event} eventObj - Event to copy from "from" to "to"
     * @param {jQuery|string|DOMObject} from - jQuery object to copy events from. Only uses the first matched element.
     * @param {jQuery|string|DOMObject} to - jQuery object to copy events to. Copies to all matched elements.
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
     * 
     * @function music21.common.setWindowVisibilityWatcher
     * @param {function} callback
     */
    common.setWindowVisibilityWatcher = function (callback) {
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
            callback(callbackState, evt);
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

