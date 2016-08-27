/**
  * music21j 0.8.0 built on   * 2016-08-27.
 * Copyright (c) 2013-2016 Michael Scott Cuthbert and cuthbertLab
 *
 * http://github.com/cuthbertLab/music21j
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery'), require('vexflow'), require('jsonpickle'), require('MIDI')) :
  typeof define === 'function' && define.amd ? define(['jquery', 'vexflow', 'jsonpickle', 'MIDI'], factory) :
  (factory(global.$,global.Vex,global.jsonpickle,global.MIDI));
}(this, (function (jquery,vexflow,jsonpickle,MIDI) { 'use strict';

  /**
   * common functions
   * 
   * @exports music21/common
   */
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
              if (source[p].constructor == Object) {
                  destination[p] = MergeRecursive(destination[p], source[p]);
              } else {
                  destination[p] = source[p];
              }
          } catch (e) {
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
  common.statisticalMode = function (a) {
      if (a.length == 0) {
          return null;
      }
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
  };

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
              return { 'numerator': numerator, 'denominator': denominator };
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
  common.jQueryEventCopy = function (eventObj, from, to) {
      from = from.jquery ? from : jQuery(from);
      to = to.jquery ? to : jQuery(to);

      var events = from[0].events || jQuery.data(from[0], "events") || jQuery._data(from[0], "events");
      if (!from.length || !to.length || !events) return;

      return to.each(function () {
          for (var type in events) for (var handler in events[type]) jQuery.event.add(eventObj, type, events[type][handler], events[type][handler].data);
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

      function windowFocusChanged(evt) {
          var v = 'visible',
              h = 'hidden',
              evtMap = {
              focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
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
      var initialState = document.visibilityState == "visible" ? "focus" : "blur";
      var initialStateEvent = { 'type': initialState };
      windowFocusChanged(initialStateEvent);
  };

  /**
   * module for things that all music21-created objects, not just objects that can live in
   * Stream.elements should inherit. See the {@link music21.prebase} namespace.
   *
   * @requires music21/common
   * @exports music21/prebase
   */
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
      for (var key in this) {
          // not that we ONLY copy the keys in Ret -- it's easier that way.
          if (this.hasOwnProperty(key) == false) {
              continue;
          }
          if (key in this._cloneCallbacks) {
              if (this._cloneCallbacks[key] === true) {
                  ret[key] = this[key];
              } else if (this._cloneCallbacks[key] === false) {
                  ret[key] = undefined;
              } else {
                  // call the cloneCallbacks function
                  this._cloneCallbacks[key](key, ret, this);
              }
          } else if (Object.getOwnPropertyDescriptor(this, key).get !== undefined || Object.getOwnPropertyDescriptor(this, key).set !== undefined) {
              // do nothing
          } else if (typeof this[key] == 'function') {
              // do nothing -- events might not be copied.
          } else if (typeof this[key] == 'object' && this[key] !== null && this[key].isProtoM21Object) {
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
                      throw e;
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

  /**
   * music21j -- Javascript reimplementation of Core music21 features.  
   * music21/duration -- duration routines
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21, Copyright (c) 2006-14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * Duration module. See {@link music21.duration}
   * 
   * @requires music21/common
   * @requires music21/prebase
   * @exports music21/duration
   */
  /** 
   * Module that holds **music21** classes and
   * tools for dealing with durations, especially
   * the {@link music21.duration.Duration} class.
   * 
   * @namespace music21.duration 
   * @memberof music21
   */
  var duration = {};

  /**
   * Object mapping int to name, as in `{1: 'whole'}` etc.
   * 
   * @memberof music21.duration
   * @type {object}
   */
  duration.typeFromNumDict = {
      1: 'whole',
      2: 'half',
      4: 'quarter',
      8: 'eighth',
      16: '16th',
      32: '32nd',
      64: '64th',
      128: '128th',
      256: '256th',
      512: '512th',
      1024: '1024th',
      0: 'zero',
      '0.5': 'breve',
      '0.25': 'longa',
      '0.125': 'maxima',
      '0.0625': 'duplex-maxima'
  };
  duration.quarterTypeIndex = 6; // where is quarter in the following array.
  duration.ordinalTypeFromNum = ['duplex-maxima', 'maxima', 'longa', 'breve', 'whole', 'half', 'quarter', 'eighth', '16th', '32nd', '64th', '128th', '256th', '512th', '1024th'];
  duration.vexflowDurationArray = [undefined, undefined, undefined, undefined, 'w', 'h', 'q', '8', '16', '32', undefined, undefined, undefined, undefined, undefined];

  /**
   * Duration object; found as the `.duration` attribute on {@link music21.base.Music21Object} instances
   * such as {@link music21.note.Note}
   * 
   * @class Duration
   * @memberof music21.duration
   * @extends music21.prebase.ProtoM21Object
   * @param {(number|undefined)} ql - quarterLength (default 1.0)
   */
  duration.Duration = function (ql) {
      prebase.ProtoM21Object.call(this, ql);
      this.classes.push('Duration');
      this._quarterLength = 1.0;
      this._dots = 0;
      this._durationNumber = undefined;
      this._type = 'quarter';
      this._tuplets = [];

      this._cloneCallbacks._tuplets = function (tupletKey, ret, obj) {
          // make sure that tuplets clone properly
          var newTuplets = [];
          for (var i = 0; i < obj[tupletKey].length; i++) {
              var newTuplet = obj[tupletKey][i].clone();
              //console.log('cloning tuplets', obj[tupletKey][i], newTuplet);
              newTuplets.push(newTuplet);
          }
          ret[tupletKey] = newTuplets;
      };
      Object.defineProperties(this, {
          /**
           * Read or sets the number of dots on the duration.
           * 
           * Updates the quarterLength
           * 
           * @type Number
           * @instance
           * @default 0
           * @memberof music21.duration.Duration
           * @example
           * var d = new music21.duration.Duration(2);
           * d.dots === 0; // true
           * d.dots = 1; 
           * d.quarterLength == 3; // true;
           */
          'dots': {
              get: function () {
                  return this._dots;
              },
              set: function (numDots) {
                  this._dots = numDots;
                  this.updateQlFromFeatures();
              }
          },
          /**
           * Read or sets the quarterLength of the Duration
           * 
           * Updates the type, dots, tuplets(?)
           * 
           * @type Number
           * @instance
           * @default 1.0
           * @memberof music21.duration.Duration
           * @example
           * var d = new music21.duration.Duration(2);
           * d.quarterLength == 2.0; // true;
           * d.quarterLength = 1.75;
           * d.dots == 2; // true
           * d.type == 'quarter'; // true
           */
          'quarterLength': {
              get: function () {
                  return this._quarterLength;
              },
              set: function (ql) {
                  if (ql === undefined) {
                      ql = 1.0;
                  }
                  this._quarterLength = ql;
                  this.updateFeaturesFromQl();
              }
          },
          /**
             * Read or sets the type of the duration.
             * 
             * Updates the quarterLength
             * 
             * @type String
             * @instance
             * @default 'quarter'
             * @memberof music21.duration.Duration
             * @example
             * var d = new music21.duration.Duration(2);
             * d.type == 'half; // true
             * d.type = 'breve';
             * d.quarterLength == 8.0; // true
             * d.dots = 1;
             * d.type = 'quarter'; // will not change dots
             * d.quarterLength == 1.5; // true
             */
          'type': {
              get: function () {
                  return this._type;
              },
              set: function (typeIn) {
                  var typeNumber = jquery.$.inArray(typeIn, duration.ordinalTypeFromNum);
                  if (typeNumber == -1) {
                      console.log('invalid type ' + typeIn);
                      throw 'invalid type ' + typeIn;
                  }
                  this._type = typeIn;
                  this.updateQlFromFeatures();
              }
          },
          /**
           * Reads the tuplet Array for the duration.
           * 
           * The tuplet array should be considered Read Only.
           * Use {@link music21.duration.Duration#appendTuplet} to
           * add a tuplet (no way to remove yet)
           * 
           * @type Array<music21.duration.Tuplet>
           * @instance
           * @default []
           * @memberof music21.duration.Duration
           */
          'tuplets': {
              enumerable: true,
              get: function () {
                  return this._tuplets;
              }
          },
          /**
           * Read-only: the duration expressed for VexFlow
           * 
           * @type String
           * @instance
           * @default 'd'
           * @memberof music21.duration.Duration
           * @example
           * var d = new music21.duration.Duration(2);
           * d.vexflowDuration == 'h'; // true;
           * d.dots = 2;
           * d.vexflowDuration == 'hdd'; // true;
           */
          'vexflowDuration': {
              get: function () {
                  var typeNumber = jquery.$.inArray(this.type, duration.ordinalTypeFromNum);
                  var vd = duration.vexflowDurationArray[typeNumber];
                  if (this.dots > 0) {
                      for (var i = 0; i < this.dots; i++) {
                          vd += "d"; // vexflow does not handle double dots .. or does it???
                      }
                  }
                  return vd;
              }
          }
      });

      if (typeof ql == 'string') {
          this.type = ql;
      } else {
          this.quarterLength = ql;
      }
      //alert(ql + " " + this.type + " " + this.dots);
  };
  duration.Duration.prototype = new prebase.ProtoM21Object();
  duration.Duration.prototype.constructor = duration.Duration;
  duration.Duration.prototype._findDots = function (ql) {
      if (ql === 0) {
          return 0;
      } // zero length stream probably;
      var typeNumber = jquery.$.inArray(this._type, duration.ordinalTypeFromNum);
      var powerOfTwo = Math.pow(2, duration.quarterTypeIndex - typeNumber);
      // alert(undottedQL * 1.5 + " " + ql)
      //console.log('find dots called on ql: ', ql, typeNumber, powerOfTwo);
      for (var dotsNum = 0; dotsNum <= 4; dotsNum++) {
          var dotMultiplier = (Math.pow(2, dotsNum) - 1.0) / Math.pow(2, dotsNum);
          var durationMultiplier = 1 + dotMultiplier;
          if (Math.abs(powerOfTwo * durationMultiplier - ql) < 0.0001) {
              return dotsNum;
          }
      }
      if (music21.debug) {
          console.log('no dots available for ql; probably a tuplet', ql);
      }
      return 0;
  };
  duration.Duration.prototype.updateQlFromFeatures = function () {
      var typeNumber = jquery.$.inArray(this._type, duration.ordinalTypeFromNum); // must be set property
      var undottedQuarterLength = Math.pow(2, duration.quarterTypeIndex - typeNumber);
      var dottedMultiplier = 1 + (Math.pow(2, this._dots) - 1) / Math.pow(2, this._dots);
      var unTupletedQl = undottedQuarterLength * dottedMultiplier;
      var tupletCorrectedQl = unTupletedQl;
      this._tuplets.forEach(function (tuplet) {
          tupletCorrectedQl *= tuplet.tupletMultiplier();
      });
      this._quarterLength = tupletCorrectedQl;
  };

  duration.Duration.prototype.updateFeaturesFromQl = function () {
      var ql = this._quarterLength;
      var powerOfTwo = Math.floor(Math.log(ql + 0.00001) / Math.log(2));
      var typeNumber = duration.quarterTypeIndex - powerOfTwo;
      this._type = duration.ordinalTypeFromNum[typeNumber];
      //alert(this._findDots);
      this._dots = this._findDots(ql);

      var undottedQuarterLength = Math.pow(2, duration.quarterTypeIndex - typeNumber);
      var dottedMultiplier = 1 + (Math.pow(2, this._dots) - 1) / Math.pow(2, this._dots);
      var unTupletedQl = undottedQuarterLength * dottedMultiplier;
      if (unTupletedQl != ql && ql != 0) {
          typeNumber -= 1;
          this._type = duration.ordinalTypeFromNum[typeNumber]; // increase type: eighth to quarter etc.
          unTupletedQl = unTupletedQl * 2;
          var tupletRatio = ql / unTupletedQl;
          var ratioRat = common.rationalize(tupletRatio);
          if (ratioRat === undefined) {
              // probably a Stream with a length that is inexpressable;
          } else {
              var t = new duration.Tuplet(ratioRat.denominator, ratioRat.numerator, new duration.Duration(unTupletedQl));
              this.appendTuplet(t, true); // skipUpdateQl                    
          }
          //console.log(ratioRat, ql, unTupletedQl);
      }
  };

  /**
   * Add a tuplet to music21j
   * 
   * @memberof music21.duration.Duration
   * @param {music21.duration.Tuplet} newTuplet - tuplet to add to `.tuplets`
   * @param {boolean} [skipUpdateQl=false] - update the quarterLength afterwards?
   */
  duration.Duration.prototype.appendTuplet = function (newTuplet, skipUpdateQl) {
      newTuplet.frozen = true;
      this._tuplets.push(newTuplet);
      if (skipUpdateQl !== true) {
          this.updateQlFromFeatures();
      }
  };

  /**
   * Represents a Tuplet; found in {@link music21.duration.Duration#tuplets}
   * 
   * @class Tuplet
   * @memberof music21.duration
   * @extends music21.prebase.ProtoM21Object
   * @param {number} numberNotesActual - numerator of the tuplet, default 3
   * @param {number} numberNotesNormal - denominator of the tuplet, default 2
   * @param {(music21.duration.Duration|number)} durationActual - duration or quarterLength of duration type, default music21.duration.Duration(0.5)
   * @param {(music21.duration.Duration|number)} durationNormal - unused; see music21p for description
   */
  duration.Tuplet = function (numberNotesActual, numberNotesNormal, durationActual, durationNormal) {
      prebase.ProtoM21Object.call(this);
      this.classes.push('Tuplet');
      this.numberNotesActual = numberNotesActual || 3;
      this.numberNotesNormal = numberNotesNormal || 2;
      this.durationActual = durationActual || new duration.Duration(0.5);
      if (typeof this.durationActual == 'number') {
          this.durationActual = new duration.Duration(this.durationActual);
      }
      this.durationNormal = durationNormal || this.durationActual;

      this.frozen = false;
      this.type = undefined;

      /**
       * Show a bracket above the tuplet
       * 
       * @memberof music21.duration.Tuplet#
       * @member {Boolean} bracket
       * @default true
       */
      this.bracket = true;
      /**
       * Bracket placement. Options are `above` or `below`.
       * 
       * @memberof music21.duration.Tuplet#
       * @member {String} placement
       * @default 'above'
       */
      this.placement = 'above';

      /**
          * What to show above the Tuplet. Options are `number`, `type`, or (string) `none`.
          * 
          * @memberof music21.duration.Tuplet#
          * @member {String} tupletActualShow
          * @default 'number'
          */
      this.tupletActualShow = 'number';
      this.tupletNormalShow = undefined; // undefined, 'ratio' for ratios, 'type' for ratioed notes (does not work)

      Object.defineProperties(this, {
          /**
           * A nice name for the tuplet.
           * 
           * @type String
           * @instance
           * @readonly
           * @memberof music21.duration.Tuplet
           */
          'fullName': {
              enumerable: true,
              get: function () {
                  // actual is what is presented to viewer
                  var numActual = this.numberNotesActual;
                  var numNormal = this.numberNotesNormal;

                  if (numActual == 3 && numNormal == 2) {
                      return 'Triplet';
                  } else if (numActual == 5 && (numNormal == 4 || numNormal == 2)) {
                      return 'Quintuplet';
                  } else if (numActual == 6 && numNormal == 4) {
                      return 'Sextuplet';
                  }
                  ordStr = common.ordinalAbbreviation(numNormal, true); // plural
                  return 'Tuplet of ' + numActual.toString() + '/' + numNormal.toString() + ordStr;
              }
          }
      });
  };
  duration.Tuplet.prototype = new prebase.ProtoM21Object();
  duration.Tuplet.prototype.constructor = duration.Tuplet;

  /**
   * Set both durationActual and durationNormal for the tuplet.
   * 
   * @memberof music21.duration.Tuplet
   * @param {string} type - a duration type, such as `half`, `quarter`
   * @returns {music21.duration.Duration} A converted {@link music21.duration.Duration} matching `type` 
   */
  duration.Tuplet.prototype.setDurationType = function (type) {
      if (self.frozen === true) {
          throw "A frozen tuplet (or one attached to a duration) is immutable";
      }
      this.durationActual = new duration.Duration(type);
      this.durationNormal = this.durationActual;
      return this.durationActual;
  };
  /**
   * Sets the tuplet ratio.
   * 
   * @memberof music21.duration.Tuplet
   * @param {Number} actual - number of notes in actual (e.g., 3)
   * @param {Number} normal - number of notes in normal (e.g., 2)
   * @returns {undefined}
   */
  duration.Tuplet.prototype.setRatio = function (actual, normal) {
      if (self.frozen === true) {
          throw "A frozen tuplet (or one attached to a duration) is immutable";
      }
      this.numberNotesActual = actual || 3;
      this.numberNotesNormal = normal || 2;
  };

  /**
   * Get the quarterLength corresponding to the total length that
   * the completed tuplet (i.e., 3 notes in a triplet) would occupy.
   * 
   * @memberof music21.duration.Tuplet
   * @returns {Number} A quarter length.
   */
  duration.Tuplet.prototype.totalTupletLength = function () {
      return this.numberNotesNormal * this.durationNormal.quarterLength;
  };
  /**
   * The amount by which each quarter length is multiplied to get
   * the tuplet. For instance, in a normal triplet, this is 0.666
   * 
   * @memberof music21.duration.Tuplet
   * @returns {Number} A float of the multiplier
   */
  duration.Tuplet.prototype.tupletMultiplier = function () {
      var lengthActual = this.durationActual.quarterLength;
      return this.totalTupletLength() / (this.numberNotesActual * lengthActual);
  };

  duration.tests = function () {
      test("music21.duration.Duration", function () {
          var d = new music21.duration.Duration(1.0);
          equal(d.type, 'quarter', 'got quarter note from 1.0');
          equal(d.dots, 0, 'got no dots');
          equal(d.quarterLength, 1.0, 'got 1.0 from 1.0');
          equal(d.vexflowDuration, 'q', 'vexflow q');
          d.type = 'half';
          equal(d.type, 'half', 'got half note from half');
          equal(d.dots, 0, 'got no dots');
          equal(d.quarterLength, 2.0, 'got 2.0 from half');
          equal(d.vexflowDuration, 'h', 'vexflow h');
          d.quarterLength = 6.0;
          equal(d.type, 'whole');
          equal(d.dots, 1, 'got one dot from 6.0');
          equal(d.quarterLength, 6.0, 'got 6.0');
          equal(d.vexflowDuration, 'wd', 'vexflow duration wd');
          d.quarterLength = 7.75;
          equal(d.type, 'whole');
          equal(d.dots, 4, 'got four dots from 7.75');
      });

      test("music21.duration.Tuplet", function () {
          var d = new music21.duration.Duration(0.5);
          var t = new music21.duration.Tuplet(5, 4);
          equal(t.tupletMultiplier(), 0.8, 'tuplet multiplier');
          d.appendTuplet(t);
          equal(t.frozen, true, 'tuplet is frozen');
          equal(d._tuplets[0], t, 'tuplet appended');
          equal(d.quarterLength, 0.4, 'quarterLength Updated');

          var d2 = new music21.duration.Duration(1 / 3);
          equal(d2.type, 'eighth', 'got eighth note from 1/3');
          equal(d2.dots, 0, 'got no dots');
          equal(d2.quarterLength, 1 / 3, 'got 1/3 from 1/3');
          var t2 = d2.tuplets[0];
          equal(t2.numberNotesActual, 3, '3/2 tuplet');
          equal(t2.numberNotesNormal, 2, '3/2 tuplet');
          equal(t2.durationActual.quarterLength, 0.5);
          equal(t2.tupletMultiplier(), 2 / 3, '2/3 tuplet multiplier');
          equal(t2.totalTupletLength(), 1.0, 'total tuplet == 1.0');

          var s = new music21.stream.Stream();
          s.timeSignature = new music21.meter.TimeSignature('2/2');
          for (var i = 0; i < 6; i++) {
              var n1 = new music21.note.Note('C4');
              n1.duration.quarterLength = 2 / 3;
              if (i % 3 === 0) {
                  n1.articulations.push(new music21.articulations.Accent());
              }
              s.append(n1);
          }
          s.appendNewCanvas();
          ok(true, 'quarter note triplets displayed');

          var m6 = new music21.stream.Measure();
          m6.renderOptions.staffLines = 1;
          m6.timeSignature = new music21.meter.TimeSignature('2/4');
          var n6 = new music21.note.Note('B4');
          n6.duration.quarterLength = 2 / 3;
          n6.duration.tuplets[0].durationNormal.type = 'eighth';
          n6.duration.tuplets[0].tupletNormalShow = 'ratio';

          var n7 = new music21.note.Note('B4');
          n7.duration.quarterLength = 1 / 3;
          n7.duration.tuplets[0].tupletNormalShow = 'ratio';

          m6.append(n6);
          m6.append(n7);
          m6.append(n7.clone());
          var n6clone = n6.clone();
          m6.append(n6clone);
          m6.appendNewCanvas();
          ok(true, 'tuplets beginning with different type than original');
          equal(n6.duration.tuplets[0] !== n6clone.duration.tuplets[0], true, 'tuplet should not be the same object after clone');
      });
      test("music21.duration.Tuplet multiple parts", function () {
          var s2 = new music21.stream.Measure();
          s2.timeSignature = new music21.meter.TimeSignature('3/2');
          var na1 = new music21.note.Note('F4');
          var na2 = new music21.note.Note('E4');
          s2.append(na1);
          s2.append(na2);
          for (var i = 0; i < 10; i++) {
              var n1 = new music21.note.Note('F4');
              n1.pitch.diatonicNoteNum += i;
              n1.duration.quarterLength = 2 / 5;
              n1.duration.tuplets[0].tupletNormalShow = 'ratio';
              if (i % 5 === 0) {
                  n1.articulations.push(new music21.articulations.Accent());
              }
              s2.append(n1);
          }
          var s3 = new music21.stream.Measure();
          s3.timeSignature = new music21.meter.TimeSignature('3/2');
          s3.append(new music21.note.Note("B5", 6.0));
          var p = new music21.stream.Part();
          p.append(s2);
          p.append(s3);

          var m4 = new music21.stream.Measure();
          m4.timeSignature = new music21.meter.TimeSignature('3/2');
          m4.append(new music21.note.Note("B3", 6.0));
          var m5 = new music21.stream.Measure();
          m5.timeSignature = new music21.meter.TimeSignature('3/2');
          m5.append(new music21.note.Note("B3", 6.0));
          var p2 = new music21.stream.Part();
          p2.append(m4);
          p2.append(m5);

          var sc = new music21.stream.Score();
          sc.insert(0, p);
          sc.insert(0, p2);
          sc.appendNewCanvas();
          ok(true, '5:4 tuplets in 3/2 with multiple parts');
      });
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/base -- objects in base in music21p routines
   *
   * does not load the other modules, music21/moduleLoader.js does that.
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * module for Music21Objects, see {@link music21.base}
   * 
   * @requires music21/duration
   * @requires music21/prebase
   * @exports music21/base
   */
  /**
   * Module for Music21Objects.  Does not load other modules, see {@link music21.moduleLoader}
   * for this functionality.
   * 
   * @namespace music21.base
   * @memberof music21
   */
  var base = {};

  /**
      * Base class for any object that can be placed in a {@link music21.stream.Stream}.
   * 
   * @class Music21Object
   * @memberof music21.base
      * @extends music21.prebase.ProtoM21Object
      * @property {object} activeSite - hardlink to a {@link music21.stream.Stream} containing the element.
      * @property {number} classSortOrder - Default sort order for this class (default 20; override in other classes). Lower numbered objects will sort before other objects in the staff if priority and offset are the same.
      * @property {music21.duration.Duration} duration - the duration (object) for the element. (can be set with a quarterLength also)
      * @property {Array} groups - An Array of strings representing group (equivalent to css classes) to assign to the object. (default [])
      * @property {boolean} isMusic21Object - true
      * @property {boolean} isStream - false
      * @property {number|null} offset - offset from the beginning of the stream (in quarterLength)
      * @property {number} priority - The priority (lower = earlier or more left) for elements at the same offset. (default 0)
   */
  base.Music21Object = function () {
      prebase.ProtoM21Object.call(this);
      this.classes.push('Music21Object');
      this.classSortOrder = 20; // default;
      this._priority = 0; // default;
      this.offset = null; // default -- simple version of m21.
      this.activeSite = undefined;
      this.isMusic21Object = true;
      this.isStream = false;

      this._duration = new duration.Duration();
      this.groups = []; // custom object in m21p
      // this.sites, this.activeSites, this.offset -- not yet...
      // beat, measureNumber, etc.
      // lots to do...

      Object.defineProperties(this, {
          'priority': {
              configurable: true,
              enumerable: true,
              get: function () {
                  return this._priority;
              },
              set: function (p) {
                  this._priority = p;
              }
          },
          'duration': {
              configurable: true,
              get: function () {
                  return this._duration;
              },
              set: function (newDuration) {
                  if (typeof newDuration == 'object') {
                      this._duration = newDuration;
                      // common errors below...
                  } else if (typeof newDuration == 'number') {
                      this._duration.quarterLength = newDuration;
                  } else if (typeof newDuration == 'string') {
                      this._duration.type = newDuration;
                  }
              }
          }
      });
      // define how to .clone() difficult objects..
      this._cloneCallbacks.activeSite = function (p, ret, obj) {
          ret[p] = undefined;
      };
  };
  base.Music21Object.prototype = new prebase.ProtoM21Object();
  base.Music21Object.prototype.constructor = base.Music21Object;

  /**
   * Return the offset of this element in a given site -- use .offset if you are sure that
   * site === activeSite.
   * 
   * Does not change activeSite or .offset
   * 
   * @memberof music21.base.Music21Object
   * @param {music21.stream.Stream} site
   * @returns Number
   */
  base.Music21Object.prototype.getOffsetBySite = function (site) {
      if (site === undefined) {
          return this.offset;
      }
      for (var i = 0; i < site.length; i++) {
          if (site._elements[i] === this) {
              return site._elementOffsets[i];
          }
      }
  };

  /**
   * articulations module. See {@link music21.articulations} namespace
   * 
   * @exports articulations
   */

  /**
   * @namespace music21.articulations
   * @memberof music21
   * @requires music21/prebase, Vexflow
   */
  var articulations = {};

  /**
   * Represents a single articulation, usually in the `.articulations` Array
   * on a {@link music21.note.Note} or something like that.
   * 
   * @class Articulation
   * @memberof music21.articulations
   * @extends music21.prebase.ProtoM21Object
   * @property {string} name
   * @property {string} [placement='above']
   * @property {string} vexflowModifier - the string code to get this accidental in Vexflow
   * @property {number} [dynamicScale=1.0] - multiplier for the dynamic of a note that this is attached to
   * @property {number} [lengthScale=1.0] - multiplier for the length of a note that this is attached to.
   */
  articulations.Articulation = function () {
      prebase.ProtoM21Object.call(this);
      this.classes.push('Articulation');
      this.name = undefined;
      this.placement = 'above';
      this.vexflowModifier = undefined;
      this.setPosition = undefined;
      this.dynamicScale = 1.0;
      this.lengthScale = 1.0;
  };
  articulations.Articulation.prototype = new prebase.ProtoM21Object();
  articulations.Articulation.prototype.constructor = articulations.Articulation;

  /**
  * Generates a Vex.Flow.Articulation for this articulation.
  * 
  * @memberof music21.articulations.Articulation
  * @returns {Vex.Flow.Articulation}
  */
  articulations.Articulation.prototype.vexflow = function () {
      var vfa = new vexflow.Vex.Flow.Articulation(this.vexflowModifier);
      if (this.setPosition) {
          vfa.setPosition(this.setPosition);
      }
      return vfa;
  };

  /**
  * base class for articulations that change the length of a note...
  * 
  * @class LengthArticulation
  * @memberof music21.articulations
  * @extends music21.articulations.Articulation
  */
  articulations.LengthArticulation = function () {
      articulations.Articulation.call(this);
      this.classes.push('LengthArticulation');
  };
  articulations.LengthArticulation.prototype = new articulations.Articulation();
  articulations.LengthArticulation.prototype.constructor = articulations.LengthArticulation;

  /**
  * base class for articulations that change the dynamic of a note...
  * 
  * @class DynamicArticulation
  * @memberof music21.articulations
  * @extends music21.articulations.Articulation
  */
  articulations.DynamicArticulation = function () {
      articulations.Articulation.call(this);
      this.classes.push('DynamicArticulation');
  };
  articulations.DynamicArticulation.prototype = new articulations.Articulation();
  articulations.DynamicArticulation.prototype.constructor = articulations.DynamicArticulation;

  /**
  * base class for articulations that change the pitch of a note...
  * 
  * @class PitchArticulation
  * @memberof music21.articulations
  * @extends music21.articulations.Articulation
  */
  articulations.PitchArticulation = function () {
      articulations.Articulation.call(this);
      this.classes.push('PitchArticulation');
  };
  articulations.PitchArticulation.prototype = new articulations.Articulation();
  articulations.PitchArticulation.prototype.constructor = articulations.PitchArticulation;

  /**
  * base class for articulations that change the timbre of a note...
  * 
  * @class TimbreArticulation
  * @memberof music21.articulations
  * @extends music21.articulations.Articulation
  */
  articulations.TimbreArticulation = function () {
      articulations.Articulation.call(this);
      this.classes.push('TimbreArticulation');
  };
  articulations.TimbreArticulation.prototype = new articulations.Articulation();
  articulations.TimbreArticulation.prototype.constructor = articulations.TimbreArticulation;

  /**
  * 50% louder than usual
  * 
  * @class Accent
  * @memberof music21.articulations
  * @extends music21.articulations.DynamicArticulation
  */
  articulations.Accent = function () {
      articulations.DynamicArticulation.call(this);
      this.classes.push('Accent');

      this.name = 'accent';
      this.vexflowModifier = "a>";
      this.dynamicScale = 1.5;
  };
  articulations.Accent.prototype = new articulations.DynamicArticulation();
  articulations.Accent.prototype.constructor = articulations.Accent;

  /**
  * 100% louder than usual
  * 
  * @class StrongAccent
  * @memberof music21.articulations
  * @extends music21.articulations.Accent
  */
  articulations.StrongAccent = function () {
      articulations.Accent.call(this);
      this.classes.push('StrongAccent');
      this.name = 'strong accent';
      this.vexflowModifier = "a^";
      this.dynamicScale = 2.0;
  };
  articulations.StrongAccent.prototype = new articulations.Accent();
  articulations.StrongAccent.prototype.constructor = articulations.StrongAccent;

  /**
  * no playback for now.
  * 
  * @class Staccato
  * @memberof music21.articulations
  * @extends music21.articulations.LengthArticulation
  */
  articulations.Staccato = function () {
      articulations.LengthArticulation.call(this);
      this.classes.push('Staccato');
      this.name = 'staccato';
      this.vexflowModifier = "a.";
  };
  articulations.Staccato.prototype = new articulations.LengthArticulation();
  articulations.Staccato.prototype.constructor = articulations.Staccato;

  /**
  * no playback for now.
  * 
  * @class Staccatissimo
  * @memberof music21.articulations
  * @extends music21.articulations.Staccato
  */
  articulations.Staccatissimo = function () {
      articulations.Staccato.call(this);
      this.classes.push('Staccatissimo');
      this.name = 'staccatissimo';
      this.vexflowModifier = "av";
  };
  articulations.Staccatissimo.prototype = new articulations.Staccato();
  articulations.Staccatissimo.prototype.constructor = articulations.Staccatissimo;

  /**
  * no playback or display for now.
  * 
  * @class Spiccato
  * @memberof music21.articulations
  * @extends music21.articulations.Staccato
  */
  articulations.Spiccato = function () {
      articulations.Staccato.call(this);
      this.classes.push('Spiccato');
      this.name = 'spiccato';
      this.vexflowModifier = undefined;
  };
  articulations.Spiccato.prototype = new articulations.Staccato();
  articulations.Spiccato.prototype.constructor = articulations.Spiccato;

  /**
  * @class Marcato
  * @memberof music21.articulations
  * @extends music21.articulations.LengthArticulation
  * @extends music21.articulations.DynamicArticulation
  */
  articulations.Marcato = function () {
      articulations.LengthArticulation.call(this);
      articulations.DynamicArticulation.call(this);
      this.classes.push('Marcato');
      this.name = 'marcato';
      this.vexflowModifier = "a^";
      this.dynamicScale = 1.7;
  };
  articulations.Marcato.prototype = new articulations.LengthArticulation();
  articulations.Marcato.prototype.constructor = articulations.Marcato;

  /**
  * @class Tenuto
  * @memberof music21.articulations
  * @extends music21.articulations.LengthArticulation
  */
  articulations.Tenuto = function () {
      articulations.LengthArticulation.call(this);
      this.classes.push('Tenuto');

      this.name = 'tenuto';
      this.vexflowModifier = "a-";
  };
  articulations.Tenuto.prototype = new articulations.LengthArticulation();
  articulations.Tenuto.prototype.constructor = articulations.Tenuto;

  articulations.tests = function () {
      test("music21.articulations.Articulation", function () {
          var acc = new music21.articulations.Accent();
          equal(acc.name, 'accent', 'matching names for accent');
          var ten = new music21.articulations.Tenuto();
          equal(ten.name, 'tenuto', 'matching names for tenuto');
          var n = new music21.note.Note("C");
          n.articulations.push(acc);
          n.articulations.push(ten);
          equal(n.articulations[0].name, 'accent', 'accent in array');
          equal(n.articulations[1].name, 'tenuto', 'tenuto in array');
      });

      test("music21.articulations.Articulation display", function () {
          var marc = new music21.articulations.Marcato();
          equal(marc.name, 'marcato', 'matching names for marcato');
          var n = new music21.note.Note("D#5");
          n.articulations.push(marc);
          var nBoring = new music21.note.Note("D#5");

          var measure = new music21.stream.Measure();
          measure.append(n);
          measure.append(nBoring);
          measure.append(nBoring.clone());
          measure.append(n.clone());

          measure.appendNewCanvas();
          ok(true, "something worked");
      });
  };

  /**
   * music21j -- Javascript reimplementation of Core music21 features.  
   * music21/pitch -- pitch routines
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * pitch module.  See {@link music21.pitch} namespace
   * 
   * @exports music21/pitch
   */
  /** 
   * Pitch related objects and methods
   * 
   * @namespace music21.pitch 
   * @memberof music21 
   * @requires music21/prebase
   */
  var pitch = {};
  /**
   * @class Accidental
   * @memberof music21.pitch
   * @param {string|number} accName - an accidental name
   * @extends music21.prebase.ProtoM21Object
   */
  pitch.Accidental = function (accName) {
      prebase.ProtoM21Object.call(this);
      this.classes.push('Accidental');
      this._name = "";
      this._alter = 0.0;
      this._modifier = "";
      this._unicodeModifier = "";
      this.displayType = "normal"; // "normal", "always" supported currently
      this.displayStatus = undefined; // true, false, undefined
      this.set(accName);
  };
  pitch.Accidental.prototype = new prebase.ProtoM21Object();
  pitch.Accidental.prototype.constructor = pitch.Accidental;
  /**
   * Sets a parameter of the accidental and updates name, alter, and modifier to suit.
   * 
   * @memberof music21.pitch.Accidental
   * @param {number|string} accName - the name, number, or modifier to set
   * @returns {undefined}
   */
  pitch.Accidental.prototype.set = function (accName) {
      if (accName != undefined && accName.toLowerCase != undefined) {
          accName = accName.toLowerCase();
      }
      if (accName == 'natural' || accName == 'n' || accName == 0 || accName == undefined) {
          this._name = 'natural';
          this._alter = 0.0;
          this._modifier = "";
          this._unicodeModifier = '♮';
      } else if (accName == 'sharp' || accName == '#' || accName == 1) {
          this._name = 'sharp';
          this._alter = 1.0;
          this._modifier = "#";
          this._unicodeModifier = '♯';
      } else if (accName == 'flat' || accName == '-' || accName == -1) {
          this._name = 'flat';
          this._alter = -1.0;
          this._modifier = "-";
          this._unicodeModifier = '♭';
      } else if (accName == 'double-flat' || accName == '--' || accName == -2) {
          this._name = 'double-flat';
          this._alter = -2.0;
          this._modifier = "--";
          this._unicodeModifier = '&#x1d12b;';
      } else if (accName == 'double-sharp' || accName == '##' || accName == 2) {
          this._name = 'double-sharp';
          this._alter = 2.0;
          this._modifier = "##";
          this._unicodeModifier = '&#x1d12a;';
      } else if (accName == 'triple-flat' || accName == '---' || accName == -3) {
          this._name = 'triple-flat';
          this._alter = -3.0;
          this._modifier = "---";
          this._unicodeModifier = '♭&#x1d12b;';
      } else if (accName == 'triple-sharp' || accName == '###' || accName == 3) {
          this._name = 'triple-sharp';
          this._alter = 3.0;
          this._modifier = "###";
          this._unicodeModifier = '&#x1d12a;';
      }
  };
  Object.defineProperties(pitch.Accidental.prototype, {
      /**
       * Return or set the name of the accidental ('flat', 'sharp', 'natural', etc.);
       * 
       * When set, updates alter and modifier.
       * 
       * @memberof music21.pitch.Accidental#
       * @var {string} name
       */
      'name': {
          enumerable: true,
          configurable: true,
          get: function () {
              return this._name;
          },
          set: function (n) {
              this.set(n);
          }
      },
      /**
       * Return or set the alteration amount (-1.0 = flat; 1.0 = sharp; etc.)
       * 
       * When set, updates name and modifier.
       * 
       * @memberof music21.pitch.Accidental#
       * @var {number} alter
       */
      'alter': {
          enumerable: true,
          configurable: true,
          get: function () {
              return this._alter;
          },
          set: function (n) {
              this.set(n);
          }
      },
      /**
       * Return or set the modifier ('-', '#', '')
       * 
       * When set, updates alter and name.
        * @memberof music21.pitch.Accidental#
       * @var {string} modifier
       */
      'modifier': {
          enumerable: true,
          configurable: true,
          get: function () {
              return this._modifier;
          },
          set: function (n) {
              this.set(n);
          }
      },
      /**
       * Returns the modifier for vexflow ('b', '#', 'n')
       * 
       * @memberof music21.pitch.Accidental#
       * @var {string} vexflowModifier
       * @readonly
       */
      'vexflowModifier': {
          enumerable: true,
          configurable: false,
          get: function () {
              var m = this.modifier;
              if (m == "") {
                  return "n";
              } else if (m == "#") {
                  return "#";
              } else if (m == '-') {
                  return "b";
              } else if (m == "##") {
                  return "##";
              } else if (m == '--') {
                  return "bb";
              } else if (m == "###") {
                  return "###";
              } else if (m == '---') {
                  return "bbb";
              } else {
                  throw "Vexflow does not support: " + m;
              }
          }
      },
      /**
       * Returns the modifier in unicode or
       * for double and triple accidentals, as a hex escape
       * 
       * @memberof music21.pitch.Accidental#
       * @var {string} unicodeModifier
       * @readonly
       */
      'unicodeModifier': {
          enumerable: true,
          configurable: false,
          get: function () {
              return this._unicodeModifier;
          }
      }

  });

  pitch.nameToMidi = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
  pitch.nameToSteps = { 'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6 };
  pitch.stepsToName = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  pitch.midiToName = ['C', 'C#', 'D', 'E-', 'E', 'F', 'F#', 'G', 'A-', 'A', 'B-', 'B'];

  /**
   * Pitch objects are found in {@link music21.note.Note} objects, and many other places.
   * 
   * They do not have a {@link music21.duration.Duration} associated with them, so they
   * cannot be placed inside {@link music21.stream.Stream} objects.
   * 
   * Valid pitch name formats are 
   * - "C", "D', etc. ("B" = American B; "H" is not allowed)
   * - "C#", "C-" (C-flat; do not use "b" for flat), "C##", "C###", "C--" etc.
   * - Octave may be specified after the name + accidental: "C#4" etc.
   * - Octave can be arbitrarily high ("C10") but only as low as "C0" because "C-1" would be interpreted as C-flat octave 1; shift octave later for very low notes.
   * - If octave is not specified, the system will usually use octave 4, but might adjust according to context. If you do not like this behavior, give an octave always.
   * - Microtones are not supported in music21j (they are in music21p)
   * 
   * @class Pitch
   * @memberof music21.pitch
  * @param {string} pn - name of the pitch, with or without octave, see above.
   * @extends music21.prebase.ProtoM21Object
   * @property {music21.pitch.Accidental|undefined} accidental - link to an accidental
   * @property {number} diatonicNoteNum - diatonic number of the pitch, where 29 = C4, C#4, C-4, etc.; 30 = D-4, D4, D#4, etc. updates other properties.
   * @property {number} midi - midi number of the pitch (C4 = 60); readonly. See {@link music21.pitch.Pitch#ps} for setable version.
   * @property {string} name - letter name of pitch + accidental modifier; e.g., B-flat = 'B-'; changes automatically w/ step and accidental
   * @property {string} nameWithOctave - letter name of pitch + accidental modifier + octave; changes automatically w/ step, accidental, and octave
   * @property {number} octave - number for the octave, where middle C = C4, and octaves change between B and C; default 4
   * @property {number} ps - pitch space number, like midi number but floating point and w/ no restriction on range. C4 = 60.0
   * @property {string} step - letter name for the pitch (C-G, A, B), without accidental; default 'C'
  */
  pitch.Pitch = function (pn) {
      prebase.ProtoM21Object.call(this);
      this.classes.push('Pitch');
      if (pn == undefined) {
          pn = "C";
      }
      this._step = 'C';
      this._octave = 4;
      this._accidental = undefined;

      /* pn can be a nameWithOctave */
      if (typeof pn == "number") {
          if (pn < 12) {
              pn += 60; // pitchClass
          }
          this.ps = pn;
      } else if (pn.match(/\d+/)) {
          this.nameWithOctave = pn;
      } else {
          this.name = pn;
      }
  };
  pitch.Pitch.prototype = new prebase.ProtoM21Object();
  pitch.Pitch.prototype.constructor = pitch.Pitch;
  Object.defineProperties(pitch.Pitch.prototype, {
      'step': {
          enumerable: true,
          configurable: true,
          get: function () {
              return this._step;
          },
          set: function (s) {
              this._step = s;
          }
      },
      'octave': {
          enumerable: true,
          configurable: true,
          get: function () {
              return this._octave;
          },
          set: function (o) {
              this._octave = o;
          }
      },
      'accidental': {
          enumerable: true,
          configurable: true,
          get: function () {
              return this._accidental;
          },
          set: function (a) {
              if (typeof a != 'object' && a !== undefined) {
                  a = new music21.pitch.Accidental(a);
              }
              this._accidental = a;
          }
      },
      'name': {
          enumerable: true,
          configurable: true,
          get: function () {
              if (this.accidental == undefined) {
                  return this.step;
              } else {
                  return this.step + this.accidental.modifier;
              }
          },
          set: function (nn) {
              this.step = nn.slice(0, 1).toUpperCase();
              var tempAccidental = nn.slice(1);
              if (tempAccidental != undefined) {
                  this.accidental = tempAccidental; // converts automatically
              } else {
                  this.accidental = undefined;
              }
          }
      },
      'nameWithOctave': {
          enumerable: true,
          configurable: true,
          get: function () {
              return this.name + this.octave.toString();
          },
          set: function (pn) {
              var storedOctave = pn.match(/\d+/);
              if (storedOctave != undefined) {
                  pn = pn.replace(/\d+/, "");
                  this.octave = parseInt(storedOctave);
                  this.name = pn;
              } else {
                  this.name = pn;
              }
          }
      },
      'diatonicNoteNum': {
          enumerable: true,
          configurable: true,
          get: function () {
              return this.octave * 7 + pitch.nameToSteps[this.step] + 1;
          },
          set: function (newDNN) {
              newDNN = newDNN - 1; // makes math easier
              this.octave = Math.floor(newDNN / 7);
              this.step = pitch.stepsToName[newDNN % 7];
          }
      },
      'frequency': {
          enumerable: true,
          configurable: true,
          get: function () {
              return 440 * Math.pow(2, (this.ps - 69) / 12);
          }
      },
      'midi': {
          enumerable: true,
          configurable: true,
          get: function () {
              return Math.floor(this.ps);
          }
      },
      'ps': {
          enumerable: true,
          configurable: true,
          get: function () {
              var accidentalAlter = 0;
              if (this.accidental != undefined) {
                  accidentalAlter = parseInt(this.accidental.alter);
              }
              return (this.octave + 1) * 12 + pitch.nameToMidi[this.step] + accidentalAlter;
          },
          set: function (ps) {
              this.name = pitch.midiToName[ps % 12];
              this.octave = Math.floor(ps / 12) - 1;
          }
      }
  });

  /**
   * Returns the vexflow name for the pitch in the given clef.
   * 
   * @memberof music21.pitch.Pitch#
   * @param {clef.Clef} clefObj - the active {@link music21.clef.Clef} object 
   * @returns {String} - representation in vexflow
   */
  pitch.Pitch.prototype.vexflowName = function (clefObj) {
      // returns a vexflow Key name for this pitch.
      var tempPitch = this;
      if (clefObj !== undefined) {
          try {
              tempPitch = clefObj.convertPitchToTreble(this);
          } catch (e) {
              console.log(e, clefObj);
          }
      }
      var accidentalType = 'n';
      if (this.accidental != undefined) {
          accidentalType = this.accidental.vexflowModifier;
      }
      var outName = tempPitch.step + accidentalType + '/' + tempPitch.octave;
      return outName;
  };

  pitch.tests = function () {
      test("music21.pitch.Accidental", function () {
          var a = new music21.pitch.Accidental("-");
          equal(a.alter, -1.0, "flat alter passed");
          equal(a.name, 'flat', "flat name passed");
      });

      test("music21.pitch.Pitch", function () {
          var p = new music21.pitch.Pitch("D#5");
          equal(p.name, "D#", "Pitch Name set to D#");
          equal(p.step, "D", "Pitch Step set to D");
          equal(p.octave, 5, "Pitch octave set to 5");
          var c = new music21.clef.AltoClef();
          var vfn = p.vexflowName(c);
          equal(vfn, 'C#/6', 'Vexflow name set');
      });
  };

  /**
   * audioSearch module. See {@link music21.audioSearch} namespace
   * 
   * @exports music21/audioSearch
   */
  /**
   * @namespace music21.audioSearch
   * @memberof music21
   * @requires music21/pitch
   * @requires music21/common
   */
  var audioSearch = {};
  // functions based on the prototype created by Chris Wilson's MIT License version
  // and on Jordi Bartolome Guillen's audioSearch module for music21
  audioSearch.fftSize = 2048;

  audioSearch.AudioContextCaller = window.AudioContext || window.webkitAudioContext;
  audioSearch._audioContext = null;
  audioSearch.animationFrameCallbackId = null;

  Object.defineProperties(audioSearch, { 'audioContext': {
          'get': function () {
              if (audioSearch._audioContext !== null) {
                  return audioSearch._audioContext;
              } else {
                  audioSearch._audioContext = new audioSearch.AudioContextCaller();
                  return audioSearch._audioContext;
              }
          },
          'set': function (ac) {
              audioSearch._audioContext = ac;
          }
      } });

  /**
   * 
   * @function music21.audioSearch.getUserMedia
   * @memberof music21.audioSearch
   * @param {object} dictionary - dictionary to fill
   * @param {function} callback - callback on success
   * @param {function} error - callback on error
   */
  audioSearch.getUserMedia = function (dictionary, callback, error) {
      if (error === undefined) {
          error = function () {
              alert("navigator.getUserMedia either not defined (Safari, IE) or denied.");
          };
      }
      if (callback === undefined) {
          callback = function (mediaStream) {
              audioSearch.userMediaStarted(mediaStream);
          };
      }
      var n = navigator;
      // need to polyfill navigator, or binding problems are hard...
      n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia;

      if (n.getUserMedia === undefined) {
          error();
      }
      if (dictionary === undefined) {
          dictionary = {
              "audio": {
                  "mandatory": {},
                  "optional": []
              }
          };
      }
      n.getUserMedia(dictionary, callback, error);
  };

  audioSearch.sampleBuffer = null;
  audioSearch.currentAnalyser = null;

  audioSearch.userMediaStarted = function (audioStream) {
      audioSearch.sampleBuffer = new Float32Array(audioSearch.fftSize / 2);
      var mediaStreamSource = audioSearch.audioContext.createMediaStreamSource(audioStream);
      var analyser = audioSearch.audioContext.createAnalyser();
      analyser.fftSize = audioSearch.fftSize;
      mediaStreamSource.connect(analyser);
      audioSearch.currentAnalyser = analyser;
      audioSearch.animateLoop();
  };

  audioSearch.minFrequency = 55;
  audioSearch.maxFrequency = 1050;
  audioSearch.animateLoop = function (time) {
      audioSearch.currentAnalyser.getFloatTimeDomainData(audioSearch.sampleBuffer);
      // returns best frequency or -1
      var frequencyDetected = audioSearch.autoCorrelate(audioSearch.sampleBuffer, audioSearch.audioContext.sampleRate, audioSearch.minFrequency, audioSearch.maxFrequency);
      var retValue = audioSearch.sampleCallback(frequencyDetected);
      if (retValue != -1) {
          audioSearch.animationFrameCallbackId = window.requestAnimationFrame(audioSearch.animateLoop);
      }
  };

  audioSearch.pitchSmoothingSize = 40;
  audioSearch.lastPitchClassesDetected = [];
  audioSearch.lastPitchesDetected = [];
  audioSearch.lastCentsDeviationsDetected = [];

  audioSearch.smoothPitchExtraction = function (frequency) {
      if (frequency == -1) {
          audioSearch.lastPitchClassesDetected.shift();
          audioSearch.lastPitchesDetected.shift();
          audioSearch.lastCentsDeviationsDetected.shift();
      } else {
          var _ = audioSearch.midiNumDiffFromFrequency(frequency),
              midiNum = _[0],
              centsOff = _[1];
          if (audioSearch.lastPitchClassesDetected.length > audioSearch.pitchSmoothingSize) {
              audioSearch.lastPitchClassesDetected.shift();
              audioSearch.lastPitchesDetected.shift();
              audioSearch.lastCentsDeviationsDetected.shift();
          }
          audioSearch.lastPitchClassesDetected.push(midiNum % 12);
          audioSearch.lastPitchesDetected.push(midiNum);
          audioSearch.lastCentsDeviationsDetected.push(centsOff);
      }
      var mostCommonPitchClass = common.statisticalMode(audioSearch.lastPitchClassesDetected);
      if (mostCommonPitchClass === null) {
          return [-1, 0];
      }
      var pitchesMatchingClass = [];
      var centsMatchingClass = [];
      for (var i = 0; i < audioSearch.lastPitchClassesDetected.length; i++) {
          if (audioSearch.lastPitchClassesDetected[i] == mostCommonPitchClass) {
              pitchesMatchingClass.push(audioSearch.lastPitchesDetected[i]);
              centsMatchingClass.push(audioSearch.lastCentsDeviationsDetected[i]);
          }
      }
      var mostCommonPitch = common.statisticalMode(pitchesMatchingClass);

      // find cents difference; weighing more recent samples more...
      var totalSamplePoints = 0;
      var totalSample = 0;
      for (var j = 0; j < centsMatchingClass.length; j++) {
          var weight = Math.pow(j, 2) + 1;
          totalSample += weight * centsMatchingClass[j];
          totalSamplePoints += weight;
      }
      var centsOff = Math.floor(totalSample / totalSamplePoints);
      return [mostCommonPitch, centsOff];
  };

  audioSearch.sampleCallback = function (frequency) {
      var _ = audioSearch.smoothPitchExtraction(frequency),
          midiNum = _[0],
          centsOff = _[1];
      //console.log(midiNum, centsOff);
  };

  // from Chris Wilson. Replace with Jordi's
  audioSearch.autoCorrelate = function (buf, sampleRate, minFrequency, maxFrequency) {
      var SIZE = buf.length;
      var MAX_SAMPLES = Math.floor(SIZE / 2);
      if (minFrequency === undefined) {
          minFrequency = 0;
      }
      if (maxFrequency === undefined) {
          maxFrequency = sampleRate;
      }

      var best_offset = -1;
      var best_correlation = 0;
      var rms = 0;
      var foundGoodCorrelation = false;
      var correlations = new Array(MAX_SAMPLES);

      for (var i = 0; i < SIZE; i++) {
          var val = buf[i];
          rms += val * val;
      }
      rms = Math.sqrt(rms / SIZE);
      if (rms < 0.01) // not enough signal
          return -1;

      var lastCorrelation = 1;
      for (var offset = 0; offset < MAX_SAMPLES; offset++) {
          var correlation = 0;
          var offsetFrequency = sampleRate / offset;
          if (offsetFrequency < minFrequency) {
              break;
          }
          if (offsetFrequency > maxFrequency) {
              continue;
          }

          for (var i = 0; i < MAX_SAMPLES; i++) {
              correlation += Math.abs(buf[i] - buf[i + offset]);
          }
          correlation = 1 - correlation / MAX_SAMPLES;
          correlations[offset] = correlation; // store it, for the tweaking we need to do below.
          if (correlation > 0.9 && correlation > lastCorrelation) {
              foundGoodCorrelation = true;
              if (correlation > best_correlation) {
                  best_correlation = correlation;
                  best_offset = offset;
              }
          } else if (foundGoodCorrelation) {
              // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
              // Now we need to tweak the offset - by interpolating between the values to the left and right of the
              // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
              // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
              // (anti-aliased) offset.

              // we know best_offset >=1, 
              // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
              // we can't drop into this clause until the following pass (else if).
              var shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset];
              return sampleRate / (best_offset + 8 * shift);
          }
          lastCorrelation = correlation;
      }
      if (best_correlation > 0.01) {
          // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
          return sampleRate / best_offset;
      }
      return -1;
      //  var best_frequency = sampleRate/best_offset;
  };

  /**
   * 
   * @function midiNumDiffFromFrequency
   * @param {Number} frequency 
   * @returns {Array<Int>} [miniNumber, centsOff]
   */
  audioSearch.midiNumDiffFromFrequency = function (frequency) {
      var midiNumFloat = 12 * (Math.log(frequency / 440) / Math.log(2)) + 69;
      var midiNum = Math.round(midiNumFloat);
      var centsOff = Math.round(100 * (midiNumFloat - midiNum));
      return [midiNum, centsOff];
  };

  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

  // requestAnimationFrame polyfill by Erik Möller
  // fixes from Paul Irish and Tino Zijdel

  var rqaPolyFill = function () {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
          window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      }

      if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function () {
              callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
      };

      if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
          clearTimeout(id);
      };
  };
  rqaPolyFill();

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/beam -- Beams and Beam class
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * Module holding beam materials. See {@link music21.beam} namespace.
   * 
   * @exports music21/beam
   */
  /**
   * {@link music21.beam.Beam} and {music21.beam.Beams} objects
   * 
   * @namespace music21.beam
   * @memberof music21
   * @requires music21/prebase
   * @requires music21/duration
   */
  var beam = {};

  beam.validBeamTypes = {
      'start': true,
      'stop': true,
      'continue': true,
      'partial': true
  };

  /**
   * Object representing a single beam (e.g., a 16th note that is beamed needs two)
   * 
   * @class Beam
   * @memberof music21.beam
   * @extends music21.prebase.ProtoM21Object
   * @param {string} type - "start", "stop", "continue", "partial"
   * @param {string} direction - only needed for partial beams: "left" or "right"
   * @property {Int|undefined} number - which beam line does this refer to; 8th = 1, 16th = 2, etc. 
   * @property {number|undefined} independentAngle - the angle of this beam if it is different than others (feathered beams)
   */
  beam.Beam = function (type, direction) {
      prebase.ProtoM21Object.call(this);
      this.classes.push('Beam');
      this.type = type;
      this.direction = direction;
      this.independentAngle = undefined;
      this.number = undefined;
  };
  beam.Beam.prototype = new prebase.ProtoM21Object();
  beam.Beam.prototype.constructor = beam.Beam;

  /**
   * Object representing a collection of Beams
   * 
   * @class Beams
   * @memberof music21.beam
   * @extends music21.prebase.ProtoM21Object
   * @property {Array<music21.beam.Beam>} beamsList - a list of Beam objects
   * @property {Boolean} [feathered=false] - is this a feathered beam.
   * @property {Int} length - length of beamsList
   */
  beam.Beams = function () {
      prebase.ProtoM21Object.call(this);
      this.classes.push('Beams');
      this.beamsList = [];
      this.feathered = false;
  };
  beam.Beams.prototype = new prebase.ProtoM21Object();
  beam.Beams.prototype.constructor = beam.Beams;
  Object.defineProperties(beam.Beams.prototype, {
      'length': {
          enumerable: true,
          'get': function () {
              return this.beamsList.length;
          }
      }
  });

  /**
   * Append a new {@link music21.beam.Beam} object to this Beams, automatically creating the Beam
   *   object and incrementing the number count.
   *   
   * @memberof music21.beam.Beams
   * @param {string} type - the type (passed to {@link music21.beam.Beam})
   * @param {string} [direction=undefined] - the direction if type is "partial"
   * @returns {music21.beam.Beam} newly appended object
   */
  beam.Beams.prototype.append = function (type, direction) {
      var obj = new beam.Beam(type, direction);
      obj.number = this.beamsList.length + 1;
      this.beamsList.push(obj);
      return obj;
  };
  /**
   * A quick way of setting the beams list for a particular duration, for
      instance, fill("16th") will clear the current list of beams in the
      Beams object and add two beams.  fill(2) will do the same (though note
      that that is an int, not a string).
    * It does not do anything to the direction that the beams are going in,
      or by default.  Either set type here or call setAll() on the Beams
      object afterwards.
    * Both "eighth" and "8th" work.  Adding more than six beams (i.e. things
      like 512th notes) raises an error.
    * @memberof music21.beam.Beams
   * @param {string|Int} level - either a string like "eighth" or a number like 1 (="eighth")
   * @param {string} type - type to fill all beams to.
   * @returns {this}
   */
  beam.Beams.prototype.fill = function (level, type) {
      this.beamsList = [];
      var count = 1;
      if (level == 1 || level == '8th' || level == duration.typeFromNumDict[8]) {
          count = 1;
      } else if (level == 2 || level == duration.typeFromNumDict[16]) {
          count = 2;
      } else if (level == 3 || level == duration.typeFromNumDict[32]) {
          count = 3;
      } else if (level == 4 || level == duration.typeFromNumDict[64]) {
          count = 4;
      } else if (level == 5 || level == duration.typeFromNumDict[128]) {
          count = 5;
      } else if (level == 6 || level == duration.typeFromNumDict[256]) {
          count = 6;
      } else {
          throw 'cannot fill beams for level ' + level;
      }
      for (var i = 1; i <= count; i++) {
          var obj = new beam.Beam();
          obj.number = i;
          this.beamsList.push(obj);
      }
      if (type !== undefined) {
          this.setAll(type);
      };
      return this;
  };

  /**
   * Get the beam with the given number or throw an exception.
   * 
   * @memberof music21.beam.Beams
   * @param {Int} number - the beam number to retrieve (usually one less than the position in `.beamsList`)
   * @returns {music21.beam.Beam}
   */
  beam.Beams.prototype.getByNumber = function (number) {
      if (!(number in this.getNumbers())) {
          throw "beam number error";
      }
      for (var i = 0; i < this.length; i++) {
          if (this.beamsList[i].number == number) {
              return this.beamsList[i];
          }
      }
  };

  /**
   * Get an Array of all the numbers for the beams
   * 
   * @memberof music21.beam.Beams
   * @returns {Array<Int>} all the numbers
   */
  beam.Beams.prototype.getNumbers = function () {
      var numbers = [];
      for (var i = 0; i < this.length; i++) {
          numbers.push(this.beamsList[i].number);
      }
      return numbers;
  };

  /**
   * Returns the type + "-" + direction (if direction is defined)
   * for the beam with the given number.
   * 
   * @param {Int} number
   * @returns {music21.beam.Beam|undefined}
   */
  beam.Beams.prototype.getTypeByNumber = function (number) {
      var beamObj = this.getByNumber(number);
      if (beamObj.direction === undefined) {
          return beamObj.type;
      } else {
          var x = beamObj.type + '-' + beamObj.direction;
          return x;
      }
  };

  /**
   * Get an Array of all the types for the beams
   * 
   * @memberof music21.beam.Beams
   * @returns {Array<string>} all the types
   */
  beam.Beams.prototype.getTypes = function () {
      var types = [];
      for (var i = 0; i < this.length; i++) {
          types.push(this.beamsList[i].type);
      }
      return types;
  };

  /**
   * Set all the {@link music21.beam.Beam} objects to a given type/direction
   * 
   * @memberof music21.beam.Beams
   * @param {string} type - beam type
   * @param {string} [direction] - beam direction
   * @returns {this}
   */
  beam.Beams.prototype.setAll = function (type, direction) {
      if (beam.validBeamTypes[type] === undefined) {
          throw 'invalid beam type';
      }
      for (var i = 0; i < this.length; i++) {
          var b = this.beamsList[i];
          b.type = type;
          b.direction = direction;
      }
      return this;
  };
  /**
   * Set the {@link music21.beam.Beam} object specified by `number` to a given type/direction
   * 
   * @memberof music21.beam.Beams
   * @param {Int} number
   * @param {string} type
   * @param {string} [direction]
   * @returns {this}
   */
  beam.Beams.prototype.setByNumber = function (number, type, direction) {
      if (direction === undefined) {
          var splitit = type.split('-');
          type = splitit[0];
          direction = splitit[1];
      }
      if (beam.validBeamTypes[type] === undefined) {
          throw 'invalid beam type';
      }
      for (var i = 0; i < this.length; i++) {
          if (this.beamsList[i].number == number) {
              this.beamsList[i].type = type;
              this.beamsList[i].direction = direction;
          }
      }
      return this;
  };

  beam.tests = function () {
      test('music21.beam.Beams', function () {
          var a = new music21.beam.Beams();
          a.fill('16th');
          a.setAll('start');
          equal(a.getTypes()[0], 'start');
          equal(a.getTypes()[1], 'start');

          var b = new music21.beam.Beams();
          b.fill('16th');
          b.setAll('start');
          b.setByNumber(1, 'continue');
          equal(b.beamsList[0].type, 'continue');
          b.setByNumber(2, 'stop');
          equal(b.beamsList[1].type, 'stop');
          b.setByNumber(2, 'partial-right');
          equal(b.beamsList[1].type, 'partial');
          equal(b.beamsList[1].direction, 'right');
      });
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/note -- Note, Rest, NotRest, GeneralNote
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * Module for note classes. See the namespace {@link music21.note}
   * 
   * @requires music21/common
   * @requires music21/prebase
   * @requires music21/base
   * @requires music21/pitch
   * @requires music21/beam
   * @exports music21/note
   */
  /**
   * Namespace for notes (single pitch) or rests, and some things like Lyrics that go on notes.
   * 
   * @namespace music21.note
   * @memberof music21
   * @property {Array} noteheadTypeNames - an Array of allowable notehead names.
   * @property {Array} stemDirectionNames - an Array of allowable stemDirection names.
   */
  var note = {};

  note.noteheadTypeNames = ['arrow down', 'arrow up', 'back slashed', 'circle dot', 'circle-x', 'cluster', 'cross', 'diamond', 'do', 'fa', 'inverted triangle', 'la', 'left triangle', 'mi', 'none', 'normal', 're', 'rectangle', 'slash', 'slashed', 'so', 'square', 'ti', 'triangle', 'x'];

  note.stemDirectionNames = ['double', 'down', 'noStem', 'none', 'unspecified', 'up'];

  /**
   * Class for a single Lyric attached to a {@link music21.note.GeneralNote}
   * 
   * @class Lyric
   * @memberOf music21.note
   * @extends music21.prebase.ProtoM21Object
   * @param {string} text - the text of the lyric
   * @param {number} number=1 - the lyric number
   * @param {string} syllabic=undefined - placement of the syllable ('begin', 'middle', 'end', 'single'); undefined = interpret from text
   * @param {boolean} applyRaw=false - true = display the text exactly as it is or, false = use "-" etc. to determine syllabic
   * @param {string} identifier=undefined - identifier for the lyric.
   * @property {string} lyricConnector='-' - what to place between two lyrics that are syllabic.
   * @property {string} text - the text of the lyric syllable.
   * @property {string} syllabic - see above
   * @property {boolean} applyRaw - see above
   * @property {string} identifier - see above; gets .number if undefined
   * @property {number} number - see above
   * @property {string} rawText - text + any connectors
   */
  note.Lyric = function (text, number, syllabic, applyRaw, identifier) {
      prebase.ProtoM21Object.call(this);
      this.classes.push('Lyric');
      this.lyricConnector = "-"; // override to place something else between two notes...
      this.text = text;
      this._number = number || 1;
      this.syllabic = syllabic;
      this.applyRaw = applyRaw || false;
      this.setTextAndSyllabic(this.text, this.applyRaw);
      this._identifier = identifier;

      Object.defineProperties(this, {
          'identifier': {
              get: function () {
                  return this._identifier || this._number;
              },
              set: function (i) {
                  this._identifier = i;
              },
              enumerable: true
          },
          'number': {
              get: function () {
                  return this._number;
              },
              set: function (n) {
                  this._number = n;
              },
              enumerable: true
          },
          'rawText': {
              get: function () {
                  if (this.syllabic == 'begin') {
                      return this.text + this.lyricConnector;
                  } else if (this.syllabic == 'middle') {
                      return this.lyricConnector + this.text + this.lyricConnector;
                  } else if (this.syllabic == 'end') {
                      return this.lyricConnector + this.text;
                  } else {
                      return this.text;
                  }
              },
              set: function (t) {
                  this.setTextAndSyllabic(t, false);
              },
              enumerable: true
          }
      });
  };
  note.Lyric.prototype = new prebase.ProtoM21Object();
  note.Lyric.prototype.constructor = note.Lyric;

  note.Lyric.prototype.setTextAndSyllabic = function (rawText, applyRaw) {
      if (rawText === undefined) {
          this.text = undefined;
          return undefined;
      }
      if (!applyRaw && rawText.indexOf(this.lyricConnector) === 0 && rawText.slice(-1) == this.lyricConnector) {
          this.text = rawText.slice(1, -1);
          this.syllabic = 'middle';
      } else if (!applyRaw && rawText.indexOf(this.lyricConnector) === 0) {
          this.text = rawText.slice(1);
          this.syllabic = 'end';
      } else if (!applyRaw && rawText.slice(-1) == this.lyricConnector) {
          this.text = rawText.slice(0, -1);
          this.syllabic = 'begin';
      } else {
          this.text = rawText;
          if (this.syllabic === undefined) {
              this.syllabic = 'single';
          }
      }
  };

  /* Notes and rests etc... */

  /**
   * Superclass for all Note values
   * 
   * @class GeneralNote
   * @memberof music21.note
   * @extends music21.base.Music21Object
      * @param {(number|undefined)} [ql=1.0] - quarterLength of the note
      * @property {boolean} [isChord=false] - is this a chord
      * @property {number} quarterLength - shortcut to `.duration.quarterLength`
      * @property {object} activeVexflowNote - most recent Vex.Flow.StaveNote object to be made from this note (could change); default, undefined
      * @property {Array<music21.expressions.Expression>} expressions - array of attached expressions
      * @property {Array<music21.articulations.Articulation>} articulations - array of attached articulations
      * @property {string} lyric - the text of the first {@link music21.note.Lyric} object; can also set one.
      * @property {Array<music21.note.Lyric>} lyrics - array of attached lyrics
      * @property {number} [volume=60] - how loud is this note, 0-127, before articulations
      * @property {number} midiVolume - how loud is this note, taking into account articulations
      * @property {music21.note.Tie|undefined} [tie=undefined] - a tie object
   	 */
  note.GeneralNote = function (ql) {
      base.Music21Object.call(this);
      this.classes.push('GeneralNote');
      this.isChord = false;
      if (ql !== undefined) {
          this.duration.quarterLength = ql;
      }
      this.volume = 60;
      this.activeVexflowNote = undefined;
      this.expressions = [];
      this.articulations = [];
      this.lyrics = [];
      this.tie = undefined;

      /* TODO: editorial objects, color, addLyric, insertLyric, hasLyrics */
      /* Later: augmentOrDiminish, getGrace, */

      Object.defineProperties(this, {
          'quarterLength': {
              get: function () {
                  return this.duration.quarterLength;
              },
              set: function (ql) {
                  this.duration.quarterLength = ql;
              },
              enumerable: true
          },
          'lyric': {
              get: function () {
                  if (this.lyrics.length > 0) {
                      return this.lyrics[0].text;
                  } else {
                      return undefined;
                  }
              },
              set: function (value) {
                  this.lyrics = [];
                  if (value !== undefined && value !== false) {
                      this.lyrics.push(new note.Lyric(value));
                  }
              },
              enumerable: true
          },
          'midiVolume': {
              enumerable: true,
              get: function () {
                  var volume = this.volume;
                  if (volume === undefined) {
                      volume = 60;
                  }
                  if (this.articulations !== undefined) {
                      this.articulations.forEach(function (a) {
                          volume *= a.dynamicScale;
                          if (volume > 127) {
                              volume = 127;
                          } else if (isNaN(volume)) {
                              volume = 60;
                          }
                      });
                  }
                  volume = Math.floor(volume);
                  return volume;
              }
          }

      });
  };
  note.GeneralNote.prototype = new base.Music21Object();
  note.GeneralNote.prototype.constructor = note.GeneralNote;

  /**
   * Add a {@link music21.note.Lyric} object to the Note
   * 
      * @memberof music21.note.GeneralNote
   * @param {string} text - text to be added
   * @param {number} [lyricNumber] - integer specifying lyric (defaults to the current `.lyrics.length` + 1)
   * @param {boolean} [applyRaw=false] - if `true`, do not parse the text for cluses about syllable placement.
   * @param {string} [lyricIdentifier] - an optional identifier
   */
  note.GeneralNote.prototype.addLyric = function (text, lyricNumber, applyRaw, lyricIdentifier) {
      applyRaw = applyRaw || false;
      if (lyricNumber === undefined) {
          maxLyrics = this.lyrics.length + 1;
          this.lyrics.push(new note.Lyric(text, maxLyrics, undefined, applyRaw, lyricIdentifier));
      } else {
          foundLyric = false;
          for (var i = 0; i < self.lyrics.length; i++) {
              thisLyric = self.lyrics[i];
              if (thisLyric.number == lyricNumber) {
                  thisLyric.text = text;
                  foundLyric = true;
                  break;
              }
          }
          if (foundLyric === false) {
              this.lyrics.push(new note.Lyric(text, lyricNumber, undefined, applyRaw, lyricIdentifier));
          }
      }
  };
  /**
   * Change stem direction according to clef. Does nothing for GeneralNote; overridden in subclasses.
   * 
      * @memberof music21.note.GeneralNote
   * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
   * @returns {undefined}
   */
  note.GeneralNote.prototype.setStemDirectionFromClef = function (clef) {
      return undefined;
  };
  /**
   * Sets the vexflow accidentals (if any), the dots, and the stem direction
   * 
   * @memberof music21.note.GeneralNote
   * @param {Vex.Flow.StaveNote} vfn - a Vex.Flow note
   */
  note.GeneralNote.prototype.vexflowAccidentalsAndDisplay = function (vfn, options) {
      if (this.duration.dots > 0) {
          for (var i = 0; i < this.duration.dots; i++) {
              vfn.addDotToAll();
          }
      }

      if (this.activeSite !== undefined && this.activeSite.renderOptions.stemDirection !== undefined) {
          this.stemDirection = this.activeSite.renderOptions.stemDirection;
      } else if (this.stemDirection === undefined && options.clef !== undefined) {
          this.setStemDirectionFromClef(options.clef);
      }
      if (music21.debug) {
          console.log(this.stemDirection);
      }
      vfn.setStemDirection(this.stemDirection == 'down' ? vexflow.Vex.Flow.StaveNote.STEM_DOWN : vexflow.Vex.Flow.StaveNote.STEM_UP);
      if (this.stemDirection == 'noStem') {
          vfn.hasStem = function () {
              return false;
          }; // need to override... 
          //vfn.render_options.stem_height = 0;
      } else {
          // correct VexFlow stem length for notes far from the center line;
          var staveDNNSpacing = 5;
          if (options.stave) {
              staveDNNSpacing = Math.floor(options.stave.options.spacing_between_lines_px / 2);
          }
          if (options.clef !== undefined && this.pitch !== undefined) {
              var midLine = options.clef.lowestLine + 4;
              //console.log(midLine);
              var absDNNfromCenter = Math.abs(this.pitch.diatonicNoteNum - midLine);
              var absOverOctave = absDNNfromCenter - 7;
              //console.log(absOverOctave);
              if (absOverOctave > 0 && vfn.getStemLength !== undefined) {
                  var stemHeight = absOverOctave * staveDNNSpacing + vfn.getStemLength();
                  vfn.setStemLength(stemHeight);
              }
          }
      }
  };

  /**
   * Play the current element as a MIDI note.
   * 
   * @memberof music21.note.GeneralNote
   * @param {number} [tempo=120] - tempo in bpm
   * @param {(base.Music21Object)} [nextElement] - for determining the length to play in case of tied notes, etc.
   * @param {object} [options] - other options (currently just `{instrument: {@link music21.instrument.Instrument} }`)
   * @returns {Number} - delay time in milliseconds until the next element (may be ignored)
   */
  note.GeneralNote.prototype.playMidi = function (tempo, nextElement, options) {
      // returns the number of milliseconds to the next element in
      // case that can't be determined otherwise.
      if (tempo === undefined) {
          tempo = 120;
      }
      if (options === undefined) {
          var inst;
          if (this.activeSite !== undefined) {
              inst = this.activeSite.instrument;
          }
          options = { instrument: inst };
      }

      var volume = this.midiVolume;
      var channel = 0;
      if (options !== undefined && options.instrument !== undefined) {
          channel = options.instrument.midiChannel;
      }

      var milliseconds = 60 * 1000 / tempo;
      var ql = this.duration.quarterLength;
      milliseconds = 60 * ql * 1000 / tempo;
      var midNum;
      if (this.isClassOrSubclass('Note')) {
          // Note, not rest
          midNum = this.pitch.midi;
          var stopTime = milliseconds / 1000;
          if (nextElement !== undefined && nextElement.isClassOrSubclass('Note')) {
              if (nextElement.pitch.midi != this.pitch.midi) {
                  stopTime += 60 * 0.25 / tempo; // legato -- play 16th note longer
              } else if (this.tie !== undefined && (this.tie.type == 'start' || this.tie.type == 'continue')) {
                  stopTime += 60 * nextElement.duration.quarterLength / tempo;
                  // this does not take into account 3 or more notes tied.
                  // TODO: look ahead at next nexts, etc.
              }
          } else if (nextElement === undefined) {
              // let last note ring an extra beat...
              stopTime += 60 * 1 / tempo;
          }
          //console.log(stopTime);
          //console.log(this.tie);
          if (this.tie === undefined || this.tie.type == 'start') {
              //console.log(volume);
              music21.MIDI.noteOn(channel, midNum, volume, 0);
              music21.MIDI.noteOff(channel, midNum, stopTime);
          } // else { console.log ('not going to play ', this.nameWithOctave); }
      } else if (this.isClassOrSubclass('Chord')) {
          // TODO: Tied Chords.
          for (var j = 0; j < this._notes.length; j++) {
              midNum = this._notes[j].pitch.midi;
              music21.MIDI.noteOn(channel, midNum, volume, 0);
              music21.MIDI.noteOff(channel, midNum, milliseconds / 1000);
          }
      } // it's a note.Rest -- do nothing -- milliseconds takes care of it...

      return milliseconds;
  };
  /**
   * Specifies that a GeneralNote is not a rest (Unpitched, Note, Chord).
   * 
   * @class NotRest
   * @memberof music21.note
   * @extends music21.note.GeneralNote
   * @param {number} [ql=1.0] - length in quarter notes
      * @property {music21.beam.Beams} beams - a link to a beam object
      * @property {string} [notehead='normal'] - notehead type
      * @property {string} [noteheadFill='default'] - notehead fill
      * @property {string|undefined} [noteheadColor=undefined] - notehead color
      * @property {boolean} [noteheadParenthesis=false] - put a parenthesis around the notehead?
      * @property {string|undefined} [stemDirection=undefined] - One of ['up','down','noStem', undefined] -- 'double' not supported
   */
  note.NotRest = function (ql) {
      note.GeneralNote.call(this, ql);
      this.classes.push('NotRest');
      this.notehead = 'normal';
      this.noteheadFill = 'default';
      this.noteheadColor = undefined;
      this.noteheadParenthesis = false;
      this.volume = undefined; // not a real object yet.
      this.beams = new beam.Beams();
      /* TODO: this.duration.linkage -- need durationUnits */
      this.stemDirection = undefined;
  };

  /* TODO: check stemDirection, notehead, noteheadFill, noteheadParentheses */
  note.NotRest.prototype = new note.GeneralNote();
  note.NotRest.prototype.constructor = note.NotRest;

  /* ------- Note ----------- */
  /**
   * A very, very important class! music21.note.Note objects combine a {@link music21.pitch.Pitch}
   * object to describe pitch (highness/lowness) with a {@link music21.duration.Duration} object
   * that defines length, with additional features for drawing the Note, playing it back, etc.
   * 
   * Together with {@link music21.stream.Stream} one of the two most important
   * classes in `music21`.
   * 
   * See {@link music21.note.NotRest}, {@link music21.note.GeneralNote}, {@link music21.base.Music21Object}
   * and {@link music21.prebase.ProtoM21Object} (or in general, the **extends** list below) for other
   * things you can do with a `Note` object.
   * 
   * Missing from music21p: `microtone, pitchClass, pitchClassString, transpose(), fullName`.
   * 
   * @class Note
   * @memberof music21.note
   * @extends music21.note.NotRest
   * @param {(string|music21.pitch.Pitch|undefined)} [nn='C4'] - pitch name ("C", "D#", "E-") w/ or w/o octave ("C#4"), or a pitch.Pitch object
   * @param {(number|undefined)} [ql=1.0] - length in quarter notes
   * @property {Boolean} [isNote=true] - is it a Note? Yes!
   * @property {Boolean} [isRest=false] - is it a Rest? No!
   * @property {music21.pitch.Pitch} pitch - the {@link music21.pitch.Pitch} associated with the Note.
   * @property {string} name - shortcut to `.pitch.name`
   * @property {string} nameWithOctave - shortcut to `.pitch.nameWithOctave`
   * @property {string} step - shortcut to `.pitch.step`
   * @property {number} octave - shortcut to `.pitch.octave`
   */
  note.Note = function (nn, ql) {
      note.NotRest.call(this, ql);
      this.classes.push('Note');
      this.isNote = true; // for speed
      this.isRest = false; // for speed
      if (nn !== undefined && nn.isClassOrSubclass !== undefined && nn.isClassOrSubclass('Pitch') === true) {
          this.pitch = nn;
      } else {
          this.pitch = new pitch.Pitch(nn);
      }
      Object.defineProperties(this, {
          'name': {
              get: function () {
                  return this.pitch.name;
              },
              set: function (nn) {
                  this.pitch.name = nn;
              },
              enumerable: true
          },
          'nameWithOctave': {
              get: function () {
                  return this.pitch.nameWithOctave;
              },
              set: function (nn) {
                  this.pitch.nameWithOctave = nn;
              },
              enumerable: true
          },
          'step': {
              get: function () {
                  return this.pitch.step;
              },
              set: function (nn) {
                  this.pitch.step = nn;
              },
              enumerable: true
          },
          // no Frequency
          'octave': {
              get: function () {
                  return this.pitch.octave;
              },
              set: function (nn) {
                  this.pitch.octave = nn;
              },
              enumerable: true
          }
      });

      /* TODO: transpose, fullName, microtone, pitchclass, pitchClassString */
  };

  note.Note.prototype = new note.NotRest();
  note.Note.prototype.constructor = note.Note;

  /**
   * Change stem direction according to clef.
   * 
   * @memberof music21.note.Note
   * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
   * @returns {music21.note.Note} Original object, for chaining methods
   */
  note.Note.prototype.setStemDirectionFromClef = function (clef) {
      if (clef === undefined) {
          return this;
      } else {
          var midLine = clef.lowestLine + 4;
          var DNNfromCenter = this.pitch.diatonicNoteNum - midLine;
          //console.log(DNNfromCenter, this.pitch.nameWithOctave);
          if (DNNfromCenter >= 0) {
              this.stemDirection = 'down';
          } else {
              this.stemDirection = 'up';
          }
          return this;
      }
  };
  /**
   * Returns a `Vex.Flow.StaveNote` that approximates this note.
   * 
   * @memberof music21.note.Note
   * @param {object} [options={}] - `{clef: {@link music21.clef.Clef} }` clef to set the stem direction of.
   * @returns {Vex.Flow.StaveNote}
   */
  note.Note.prototype.vexflowNote = function (options) {
      var params = {};
      common.merge(params, options);
      var clef = params.clef;

      if (this.duration === undefined) {
          //console.log(this);
          return undefined;
      }
      var vfd = this.duration.vexflowDuration;
      if (vfd === undefined) {
          return undefined;
      }
      var vexflowKey = this.pitch.vexflowName(clef);
      var vfn = new vexflow.Vex.Flow.StaveNote({
          keys: [vexflowKey],
          duration: vfd
      });
      this.vexflowAccidentalsAndDisplay(vfn, params); // clean up stuff...
      if (this.pitch.accidental !== undefined) {
          if (this.pitch.accidental.vexflowModifier != 'n' && this.pitch.accidental.displayStatus !== false) {
              vfn.addAccidental(0, new vexflow.Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));
          } else if (this.pitch.accidental.displayType == 'always' || this.pitch.accidental.displayStatus === true) {
              vfn.addAccidental(0, new vexflow.Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));
          }
      }

      if (this.articulations[0] !== undefined) {
          for (var i = 0; i < this.articulations.length; i++) {
              var art = this.articulations[i];
              vfn.addArticulation(0, art.vexflow()); // 0 refers to the first pitch (for chords etc.)...
          }
      }
      if (this.expressions[0] !== undefined) {
          for (var j = 0; j < this.expressions.length; j++) {
              var exp = this.expressions[j];
              vfn.addArticulation(0, exp.vexflow()); // 0 refers to the first pitch (for chords etc.)...
          }
      }

      if (this.noteheadColor) {
          vfn.setKeyStyle(0, { fillStyle: this.noteheadColor });
      }

      this.activeVexflowNote = vfn;
      return vfn;
  };

  /* ------ TODO: Unpitched ------ */

  /* ------ Rest ------ */

  /**
   * Represents a musical rest.
   * 
   * @class Rest
   * @memberof music21.note
   * @extends music21.note.GeneralNote
   * @param {number} [ql=1.0] - length in number of quarterNotes
   * @property {Boolean} [isNote=false]
   * @property {Boolean} [isRest=true]
   * @property {string} [name='rest']
   * @property {number} [lineShift=undefined] - number of lines to shift up or down from default
   */
  note.Rest = function (ql) {
      note.GeneralNote.call(this, ql);
      this.classes.push('Rest');
      this.isNote = false; // for speed
      this.isRest = true; // for speed		
      this.name = 'rest'; // for note compatibility
      this.lineShift = undefined;
  };

  note.Rest.prototype = new note.GeneralNote();
  note.Rest.prototype.constructor = note.Rest;

  /**
   * Returns a `Vex.Flow.StaveNote` that approximates this rest.
   * Corrects for bug in VexFlow that renders a whole rest too low.
   * 
   * @memberof music21.note.Rest
   * @returns {Vex.Flow.StaveNote}
   */
  note.Rest.prototype.vexflowNote = function () {
      var keyLine = 'b/4';
      if (this.duration.type == 'whole') {
          if (this.activeSite !== undefined && this.activeSite.renderOptions.staffLines != 1) {
              keyLine = 'd/5';
          }
      }
      if (this.lineShift !== undefined) {
          var p = new music21.pitch.Pitch('B4');
          var ls = this.lineShift;
          if (this.duration.type == 'whole') {
              ls += 2;
          }
          p.diatonicNoteNum += ls;
          keyLine = p.vexflowName(undefined);
      }

      var vfn = new vexflow.Vex.Flow.StaveNote({ keys: [keyLine],
          duration: this.duration.vexflowDuration + 'r' });
      if (this.duration.dots > 0) {
          for (var i = 0; i < this.duration.dots; i++) {
              vfn.addDotToAll();
          }
      }
      this.activeVexflowNote = vfn;
      return vfn;
  };
  /* ------ SpacerRest ------ */

  note.tests = function () {
      test("music21.note.Note", function () {
          var n = new note.Note("D#5");
          equal(n.pitch.name, "D#", "Pitch Name set to D#");
          equal(n.pitch.step, "D", "Pitch Step set to D");
          equal(n.pitch.octave, 5, "Pitch octave set to 5");
      });
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/chord -- Chord
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * chord Module. See {@link music21.chord} namespace for more details
   * 
   * @exports music21/chord
   */
  /**
   * Chord related objects (esp. {@link music21.chord.Chord}) and methods.
   * 
   * @namespace music21.chord
   * @memberof music21
   * @requires music21/note
   */
  var chord = {};

  /**
      * Chord related objects (esp. {@link music21.chord.Chord}) and methods.
   * 
   * @class Chord
   * @memberof music21.chord
   * @param {Array<string|music21.note.Note|music21.pitch.Pitch>} [notes] - an Array of strings
   * (see {@link music21.pitch.Pitch} for valid formats), note.Note, or pitch.Pitch objects.
      * @extends music21.note.NotRest
      * @property {number} length - the number of pitches in the Chord (readonly)
      * @property {Array<music21.pitch.Pitch>} pitches - an Array of Pitch objects in the chord. (Consider the Array read only and pass in a new Array to change)
      * @property {Boolean} [isChord=true]
      * @property {Boolean} [isNote=false]
      * @property {Boolean} [isRest=false]
   */
  chord.Chord = function (notes) {
      if (typeof notes == 'undefined') {
          notes = [];
      }
      note.NotRest.call(this);
      this.classes.push('Chord');
      this.isChord = true; // for speed
      this.isNote = false; // for speed
      this.isRest = false; // for speed

      this._notes = [];
      Object.defineProperties(this, {
          'length': {
              enumerable: true,
              get: function () {
                  return this._notes.length;
              }
          },
          'pitches': {
              enumerable: true,
              get: function () {
                  var tempPitches = [];
                  for (var i = 0; i < this._notes.length; i++) {
                      tempPitches.push(this._notes[i].pitch);
                  }
                  return tempPitches;
              },
              set: function (tempPitches) {
                  this._notes = [];
                  for (var i = 0; i < tempPitches.length; i++) {
                      var addNote;
                      if (typeof tempPitches[i] == 'string') {
                          addNote = new note.Note(tempPitches[i]);
                      } else if (tempPitches[i].isClassOrSubclass('Pitch')) {
                          addNote = new note.Note();
                          addNote.pitch = tempPitches[i];
                      } else if (tempPitches[i].isClassOrSubclass('Note')) {
                          addNote = tempPitches[i];
                      } else {
                          console.warn('bad pitch', tempPitches[i]);
                          throw "Cannot add pitch from " + tempPitches[i];
                      }
                      this._notes.push(addNote);
                  }
                  return this._notes;
              }
          }

      });
      notes.forEach(this.add, this);
  };

  chord.Chord.prototype = new note.NotRest();
  chord.Chord.prototype.constructor = chord.Chord;

  chord.Chord.prototype.setStemDirectionFromClef = function (clef) {
      if (clef === undefined) {
          return this;
      } else {
          var midLine = clef.lowestLine + 4;
          //console.log(midLine, 'midLine');
          var maxDNNfromCenter = 0;
          var pA = this.pitches;
          for (var i = 0; i < this.pitches.length; i++) {
              var p = pA[i];
              var DNNfromCenter = p.diatonicNoteNum - midLine;
              // >= not > so that the highest pitch wins the tie and thus stem down.
              if (Math.abs(DNNfromCenter) >= Math.abs(maxDNNfromCenter)) {
                  maxDNNfromCenter = DNNfromCenter;
              }
          }
          if (maxDNNfromCenter >= 0) {
              this.stemDirection = 'down';
          } else {
              this.stemDirection = 'up';
          }
          return this;
      }
  };
  /**
   * Adds a note to the chord, sorting the note array
   * 
   * @memberof music21.chord.Chord
   * @param {string|music21.note.Note|music21.pitch.Pitch} noteObj - the Note or Pitch to be added or a string defining a pitch.
   * @returns {music21.chord.Chord} the original chord.
   */
  chord.Chord.prototype.add = function (noteObj) {
      // takes in either a note or a pitch
      if (typeof noteObj == 'string') {
          noteObj = new note.Note(noteObj);
      } else if (noteObj.isClassOrSubclass('Pitch')) {
          var pitchObj = noteObj;
          var noteObj2 = new note.Note();
          noteObj2.pitch = pitchObj;
          noteObj = noteObj2;
      }
      this._notes.push(noteObj);
      // inefficient because sorts after each add, but safe and #(p) is small
      this._notes.sort(function (a, b) {
          return a.pitch.ps - b.pitch.ps;
      });
      return this;
  };
  /**
   * Removes any pitches that appear more than once (in any octave), removing the higher ones, and returns a new Chord.
   * 
   * @memberof music21.chord.Chord
   * @returns {music21.chord.Chord} A new Chord object with duplicate pitches removed.
   */
  chord.Chord.prototype.removeDuplicatePitches = function () {
      var stepsFound = [];
      var nonDuplicatingPitches = [];
      var pitches = this.pitches;
      for (var i = 0; i < pitches.length; i++) {
          var p = pitches[i];
          if ($.inArray(p.step, stepsFound) == -1) {
              stepsFound.push(p.step);
              nonDuplicatingPitches.push(p);
          }
      }
      var closedChord = new chord.Chord(nonDuplicatingPitches);
      return closedChord;
  };

  /**
   * Finds the Root of the chord.
   * 
   * @memberof music21.chord.Chord
   * @returns {music21.pitch.Pitch} the root of the chord.
   */
  chord.Chord.prototype.root = function () {
      var closedChord = this.removeDuplicatePitches();
      /* var chordBass = closedChord.bass(); */
      var closedPitches = closedChord.pitches;
      if (closedPitches.length == 0) {
          throw "No notes in Chord!";
      } else if (closedPitches.length == 1) {
          return this.pitches[0];
      }
      var indexOfPitchesWithPerfectlyStackedThirds = [];
      var testSteps = [3, 5, 7, 2, 4, 6];
      for (var i = 0; i < closedPitches.length; i++) {
          var p = closedPitches[i];
          var currentListOfThirds = [];
          for (var tsIndex = 0; tsIndex < testSteps.length; tsIndex++) {
              var chordStepPitch = closedChord.getChordStep(testSteps[tsIndex], p);
              if (chordStepPitch != undefined) {
                  //console.log(p.name + " " + testSteps[tsIndex].toString() + " " + chordStepPitch.name);
                  currentListOfThirds.push(true);
              } else {
                  currentListOfThirds.push(false);
              }
          }
          //console.log(currentListOfThirds);
          hasFalse = false;
          for (var j = 0; j < closedPitches.length - 1; j++) {
              if (currentListOfThirds[j] == false) {
                  hasFalse = true;
              }
          }
          if (hasFalse == false) {
              indexOfPitchesWithPerfectlyStackedThirds.push(i);
              return closedChord.pitches[i]; // should do more, but fine...
              // should test rootedness function, etc. 13ths. etc.
          }
      }
      return closedChord.pitches[0]; // fallback, just return the bass...
  };
  /**
   * Returns the number of semitones above the root that a given chordstep is.
   * 
   * For instance, in a G dominant 7th chord (G, B, D, F), would
   * return 4 for chordStep=3, since the third of the chord (B) is four semitones above G.
   * 
   * @memberof music21.chord.Chord
   * @param {number} chordStep - the step to find, e.g., 1, 2, 3, etc.
   * @param {music21.pitch.Pitch} [testRoot] - the pitch to temporarily consider the root.
   * @returns {number|undefined} Number of semitones above the root for this chord step or undefined if no pitch matches that chord step.
   */
  chord.Chord.prototype.semitonesFromChordStep = function (chordStep, testRoot) {
      if (testRoot === undefined) {
          testRoot = this.root();
      }
      var tempChordStep = this.getChordStep(chordStep, testRoot);
      if (tempChordStep == undefined) {
          return undefined;
      } else {
          var semitones = (tempChordStep.ps - testRoot.ps) % 12;
          if (semitones < 0) {
              semitones += 12;
          }
          return semitones;
      }
  };
  /**
   * Gets the lowest note (based on .ps not name) in the chord.
   * 
   * @memberof music21.chord.Chord
   * @returns {music21.pitch.Pitch} bass pitch
   */
  chord.Chord.prototype.bass = function () {
      var lowest = undefined;
      var pitches = this.pitches;
      for (var i = 0; i < pitches.length; i++) {
          var p = pitches[i];
          if (lowest == undefined) {
              lowest = p;
          } else {
              if (p.ps < lowest.ps) {
                  lowest = p;
              }
          }
      }
      return lowest;
  };
  /**
   * Counts the number of non-duplicate pitch MIDI Numbers in the chord.
   * 
   * Call after "closedPosition()" to get Forte style cardinality disregarding octave.
   *  
   * @memberof music21.chord.Chord
   * @returns {number}
   */
  chord.Chord.prototype.cardinality = function () {
      var uniqueChord = this.removeDuplicatePitches();
      return uniqueChord.pitches.length;
  };
  /**
   * 
   * @memberof music21.chord.Chord
   * @returns {Boolean}
   */
  chord.Chord.prototype.isMajorTriad = function () {
      if (this.cardinality() != 3) {
          return false;
      }
      var thirdST = this.semitonesFromChordStep(3);
      var fifthST = this.semitonesFromChordStep(5);
      if (thirdST == 4 && fifthST == 7) {
          return true;
      } else {
          return false;
      }
  };
  /**
   * 
   * @memberof music21.chord.Chord
   * @returns {Boolean}
   */
  chord.Chord.prototype.isMinorTriad = function () {
      if (this.cardinality() != 3) {
          return false;
      }
      var thirdST = this.semitonesFromChordStep(3);
      var fifthST = this.semitonesFromChordStep(5);
      if (thirdST == 3 && fifthST == 7) {
          return true;
      } else {
          return false;
      }
  };
  /**
   * Returns the inversion of the chord as a number (root-position = 0)
   * 
   * Unlike music21 version, cannot set the inversion, yet.
   *
   * TODO: add.
   * 
   * @memberof music21.chord.Chord
   * @returns {number}
   */
  chord.Chord.prototype.inversion = function () {
      var bass = this.bass();
      var root = this.root();
      var chordStepsToInversions = [1, 6, 4, 2, 7, 5, 3];
      for (var i = 0; i < chordStepsToInversions.length; i++) {
          var testNote = this.getChordStep(chordStepsToInversions[i], bass);
          if (testNote != undefined && testNote.name == root.name) {
              return i;
          }
      }
      return undefined;
  };

  /**
   * @memberof music21.chord.Chord
   * @param {object} options - a dictionary of options `{clef: {@music21.clef.Clef} }` is especially important 
   * @returns {Vex.Flow.StaveNote}
   */
  chord.Chord.prototype.vexflowNote = function (options) {
      var clef = options.clef;

      var pitchKeys = [];
      for (var i = 0; i < this._notes.length; i++) {
          pitchKeys.push(this._notes[i].pitch.vexflowName(clef));
      }
      var vfn = new vexflow.Vex.Flow.StaveNote({ keys: pitchKeys,
          duration: this.duration.vexflowDuration });
      this.vexflowAccidentalsAndDisplay(vfn, options); // clean up stuff...
      for (var i = 0; i < this._notes.length; i++) {
          var tn = this._notes[i];
          if (tn.pitch.accidental != undefined) {
              if (tn.pitch.accidental.vexflowModifier != 'n' && tn.pitch.accidental.displayStatus != false) {
                  vfn.addAccidental(i, new vexflow.Vex.Flow.Accidental(tn.pitch.accidental.vexflowModifier));
              } else if (tn.pitch.accidental.displayType == 'always' || tn.pitch.accidental.displayStatus == true) {
                  vfn.addAccidental(i, new vexflow.Vex.Flow.Accidental(tn.pitch.accidental.vexflowModifier));
              }
          }
      }
      this.activeVexflowNote = vfn;
      return vfn;
  };
  /**
   * Returns the Pitch object that is a Generic interval (2, 3, 4, etc., but not 9, 10, etc.) above
   * the `.root()`
   * 
   * In case there is more that one note with that designation (e.g., `[A-C-C#-E].getChordStep(3)`)
   * the first one in `.pitches` is returned.
   * 
   * @memberof music21.chord.Chord
   * @param {Int} chordStep a positive integer representing the chord step
   * @param {music21.pitch.Pitch} [testRoot] - the Pitch to use as a temporary root
   * @returns {music21.pitch.Pitch|undefined}
   */
  chord.Chord.prototype.getChordStep = function (chordStep, testRoot) {
      if (testRoot == undefined) {
          testRoot = this.root();
      }
      if (chordStep >= 8) {
          chordStep = chordStep % 7;
      }
      var thisPitches = this.pitches;
      var testRootDNN = testRoot.diatonicNoteNum;
      for (var i = 0; i < thisPitches.length; i++) {
          var thisPitch = thisPitches[i];
          var thisInterval = (thisPitch.diatonicNoteNum - testRootDNN + 1) % 7; //fast cludge
          if (thisInterval <= 0) {
              thisInterval = thisInterval + 7;
          }
          if (thisInterval == chordStep) {
              return thisPitch;
          }
      }
      return undefined;
  };

  chord.chordDefinitions = {
      'major': ['M3', 'm3'],
      'minor': ['m3', 'M3'],
      'diminished': ['m3', 'm3'],
      'augmented': ['M3', 'M3'],
      'major-seventh': ['M3', 'm3', 'M3'],
      'dominant-seventh': ['M3', 'm3', 'm3'],
      'minor-seventh': ['m3', 'M3', 'm3'],
      'diminished-seventh': ['m3', 'm3', 'm3'],
      'half-diminished-seventh': ['m3', 'm3', 'M3']
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/clef -- Clef objects
   * 
   * note: only defines a single Clef object for now
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * Clef module, see {@link music21.clef} for namespace
   * 
   * @exports music21/clef
   */
  /**
   * Clef related objects and properties
   * 
   * @namespace music21.clef
   * @memberof music21
   * @requires music21/base
   * @requires music21/pitch
   */
  var clef = {};
  /*  music21.Clef
  must be defined before Stream since Stream subclasses call new music21.Clef...
   */
  // TODO: Fix to newest Vexflow format...
  clef.lowestLines = {
      'treble': 31,
      'soprano': 29,
      'mezzo-soprano': 27,
      'alto': 25,
      'tenor': 23,
      'bass': 19,
      'percussion': 31
  };
  /**
   * Clefname can be one of 
   * "treble", "bass", "soprano", "mezzo-soprano", "alto", "tenor", "percussion"
   * 
   * @class Clef
   * @memberof music21.clef
   * @extends music21.base.Music21Object
   * @param {string} name - clef name 
   * @param {Int} [octaveChange=0] - ottava
   * @property {string|undefined} name
   * @property {Int} lowestLine - diatonicNoteNum (C4 = 29) for the lowest line (in a five-line staff)
   * @property {Int} lowestLineTrebleOffset - difference between the first line of this staff and the first line in treble clef
   * @property {Int} octaveChange
   */
  clef.Clef = function (name, octaveChange) {
      base.Music21Object.call(this);
      this.classes.push('Clef');
      if (name != undefined) {
          name = name.toLowerCase();
          this.name = name;
          this.lowestLine = clef.lowestLines[name];
          this.lowestLineTrebleOffset = clef.lowestLines['treble'] - this.lowestLine;
      } else {
          this.name = undefined;
          this.lowestLine = clef.lowestLines['treble'];
          this.lowestLineTrebleOffset = 0;
      }
      if (octaveChange === undefined) {
          this.octaveChange = 0;
      } else {
          this.octaveChange = octaveChange;
          this.lowestLine = this.lowestLine + 7 * octaveChange;
          this.lowestLineTrebleOffset = this.lowestLineTrebleOffset - 7 * octaveChange;
      }
  };

  clef.Clef.prototype = new base.Music21Object();
  clef.Clef.prototype.constructor = clef.Clef;

  /**
      * returns a new pitch object if the clef name is not Treble
      * designed so it would look the same as it would in treble clef.
      * for instance, bass-clef 2nd-space C# becomes treble clef 2nd-space A#
      * used for Vex.Flow which requires all pitches to be input as if they
      * are in treble clef.
   * 
   * @memberof music21.clef.Clef
   * @param {music21.pitch.Pitch} p
   * @returns {music21.pitch.Pitch} new pitch
   */
  clef.Clef.prototype.convertPitchToTreble = function (p) {
      if (this.lowestLine == undefined) {
          console.log('no first line defined for clef', this.name, this);
          return p; // error
      }
      var lowestLineDifference = this.lowestLineTrebleOffset;
      var tempPitch = new pitch.Pitch(p.step);
      tempPitch.octave = p.octave;
      tempPitch.diatonicNoteNum += lowestLineDifference;
      tempPitch.accidental = p.accidental;
      return tempPitch;
  };

  /**
   * A TrebleClef (same as new music21.clef.Clef('treble')
   * 
   * @class TrebleClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  clef.TrebleClef = function () {
      clef.Clef.call(this, 'treble');
      this.classes.push('TrebleClef');
  };
  clef.TrebleClef.prototype = new clef.Clef();
  clef.TrebleClef.prototype.constructor = clef.TrebleClef;

  /**
   * A TrebleClef down an octave (same as new music21.clef.Clef('treble', -1)
   * 
   * @class Treble8vbClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  clef.Treble8vbClef = function () {
      clef.Clef.call(this, 'treble', -1);
      this.classes.push('Treble8vbClef');
  };
  clef.Treble8vbClef.prototype = new clef.Clef();
  clef.Treble8vbClef.prototype.constructor = clef.Treble8vbClef;

  /**
   * A TrebleClef up an octave (same as new music21.clef.Clef('treble', 1)
   * 
   * @class Treble8vaClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  clef.Treble8vaClef = function () {
      // Fixed in cuthbert Vex.Flow -- pull #235
      clef.Clef.call(this, 'treble', 1);
      this.classes.push('Treble8vaClef');
  };
  clef.Treble8vaClef.prototype = new clef.Clef();
  clef.Treble8vaClef.prototype.constructor = clef.Treble8vaClef;

  /**
   * A BassClef (same as new music21.clef.Clef('bass')
   * 
   * @class BassClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  clef.BassClef = function () {
      clef.Clef.call(this, 'bass');
      this.classes.push('BassClef');
  };
  clef.BassClef.prototype = new clef.Clef();
  clef.BassClef.prototype.constructor = clef.BassClef;

  /**
   * An AltoClef (same as new music21.clef.Clef('alto')
   * 
   * @class AltoClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  clef.AltoClef = function () {
      clef.Clef.call(this, 'alto');
      this.classes.push('AltoClef');
  };
  clef.AltoClef.prototype = new clef.Clef();
  clef.AltoClef.prototype.constructor = clef.AltoClef;

  /**
   * A Tenor Clef (same as new music21.clef.Clef('tenor')
   * 
   * @class TenorClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  clef.TenorClef = function () {
      clef.Clef.call(this, 'tenor');
      this.classes.push('TenorClef');
  };
  clef.TenorClef.prototype = new clef.Clef();
  clef.TenorClef.prototype.constructor = clef.TenorClef;

  /**
   * A Soprano Clef (same as new music21.clef.Clef('soprano')
   * 
   * @class SopranoClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  clef.SopranoClef = function () {
      clef.Clef.call(this, 'soprano');
      this.classes.push('SopranoClef');
  };
  clef.SopranoClef.prototype = new clef.Clef();
  clef.SopranoClef.prototype.constructor = clef.SopranoClef;

  /**
   * A Mezzo-Soprano Clef (same as new music21.clef.Clef('mezzo-soprano')
   * 
   * @class MezzoSopranoClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  clef.MezzoSopranoClef = function () {
      clef.Clef.call(this, 'mezzo-soprano');
      this.classes.push('MezzoSopranoClef');
  };
  clef.MezzoSopranoClef.prototype = new clef.Clef();
  clef.MezzoSopranoClef.prototype.constructor = clef.MezzoSopranoClef;

  /**
   * A Percussion Clef (same as new music21.clef.Clef('percussion')
   * 
   * First line is treated as if it's treble clef. Not available as "bestClef"
   * 
   * @class PercussionClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  clef.PercussionClef = function () {
      clef.Clef.call(this, 'percussion');
      this.classes.push('PercussionClef');
  };
  clef.PercussionClef.prototype = new clef.Clef();
  clef.PercussionClef.prototype.constructor = clef.PercussionClef;

  /**
   * Looks at the pitches in a Stream and returns the best clef
   * of Treble and Bass
   * 
   * @function music21.clef.bestClef
   * @memberof music21.clef
   * @param {music21.stream.Stream} st
   * @returns {music21.clef.Clef}
   */
  clef.bestClef = function (st) {
      //console.log('calling flat on stream: ', st.elements.length, st.classes[st.classes.length - 1]);
      var stFlat = st.flat;
      var totalNotes = 0;
      var totalPitch = 0.0;
      for (var i = 0; i < stFlat.length; i++) {
          var el = stFlat.get(i);
          if (el.pitch != undefined) {
              totalNotes += 1;
              totalPitch += el.pitch.diatonicNoteNum;
          } else if (el.pitches != undefined) {
              for (var j = 0; j < el.pitches.length; j++) {
                  totalNotes += 1;
                  totalPitch += el.pitches[j].diatonicNoteNum;
              }
          }
      }
      var averageHeight;
      if (totalNotes == 0) {
          averageHeight = 29;
      } else {
          averageHeight = totalPitch / totalNotes;
      }
      //console.log('bestClef: average height', averageHeight);
      if (averageHeight > 28) {
          // 29 = c4
          return new clef.TrebleClef();
      } else {
          return new clef.BassClef();
      }
  };

  // tests
  clef.tests = function () {
      test("music21.clef.Clef", function () {
          var c1 = new music21.clef.Clef();
          equal(c1.isClassOrSubclass('Clef'), true, 'clef is a Clef');

          var ac = new music21.clef.AltoClef();
          equal(ac.lowestLine, 25, 'first line set');
          var n = new music21.note.Note('C#4');
          n.setStemDirectionFromClef(ac);
          equal(n.stemDirection, 'down', 'stem direction set');
          n.pitch.diatonicNoteNum -= 1;
          n.setStemDirectionFromClef(ac);
          equal(n.stemDirection, 'up', 'stem direction set');
          n.pitch.diatonicNoteNum += 1;
          var p2 = ac.convertPitchToTreble(n.pitch);
          equal(p2.nameWithOctave, 'B#4', 'converted to treble');
      });
      test("music21.clef.Clef 8va", function () {
          var ac = new music21.clef.Treble8vaClef();
          equal(ac.lowestLine, 38, 'first line set');
          var n = new music21.note.Note('C#5');
          n.setStemDirectionFromClef(ac);
          equal(n.stemDirection, 'up', 'stem direction set');
          var p2 = ac.convertPitchToTreble(n.pitch);
          equal(p2.nameWithOctave, 'C#4', 'converted to treble');
          var s = new music21.stream.Stream();
          s.clef = ac;
          s.append(n);
          s.appendNewCanvas($("body"));
      });
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/dynamics -- Dynamics
   * 
   * note that Vex.Flow does not support Dynamics yet and we do not support MIDI dynamics,
   *  so currently of limited value...
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * dynamics Module. See {@link music21.dynamics} for namespace
   * 
   * @exports music21/dynamics
   */
  /**
   * Dynamics related objects.
   * 
   * N.B. Firefox completely ignores dyanmics on playback!
   * 
   * Currently do not export to Vexflow.  :-(
   * 
   * @namespace music21.dynamics
   * @memberof music21
   * @requires music21/base
   */
  var dynamics = {};
  dynamics.shortNames = ['pppppp', 'ppppp', 'pppp', 'ppp', 'pp', 'p', 'mp', 'mf', 'f', 'fp', 'sf', 'ff', 'fff', 'ffff', 'fffff', 'ffffff'];
  dynamics.longNames = { 'ppp': ['pianississimo'],
  	'pp': ['pianissimo'],
  	'p': ['piano'],
  	'mp': ['mezzopiano'],
  	'mf': ['mezzoforte'],
  	'f': ['forte'],
  	'fp': ['fortepiano'],
  	'sf': ['sforzando'],
  	'ff': ['fortissimo'],
  	'fff': ['fortississimo']
  };
  dynamics.englishNames = { 'ppp': ['extremely soft'],
  	'pp': ['very soft'],
  	'p': ['soft'],
  	'mp': ['moderately soft'],
  	'mf': ['moderately loud'],
  	'f': ['loud'],
  	'ff': ['very loud'],
  	'fff': ['extremely loud']
  };
  dynamics.dynamicStrToScalar = { 'None': [.5], //default value
  	'n': [0],
  	'pppp': [0.1],
  	'ppp': [.15],
  	'pp': [.25],
  	'p': [.35],
  	'mp': [.45],
  	'mf': [.55],
  	'f': [.7],
  	'fp': [.75],
  	'sf': [.85],
  	'ff': [.85],
  	'fff': [.9],
  	'ffff': [.95]
  };

  /**
   * A representation of a dynamic.
   * 
   * @class Dynamic
   * @memberof music21.dynamics
   * @extends music21.base.Music21Object
   * @param {number|string} value - either a number between 0 and 1 or a dynamic mark such as "ff" or "mp"
   * @property {string|undefined} value - a name such as "pp" etc.
   * @property {string|undefined} longName - a longer name such as "pianissimo"
   * @property {string|undefined} englishName - a name such as "very soft"
   * @property {number} volumeScalar - a number between 0 and 1.
   */
  dynamics.Dynamic = function (value) {
  	base.Music21Object.call(this);
  	this.classes.push('Dynamic');
  	this._value = undefined;
  	this._volumeScalar = undefined;
  	this.longName = undefined;
  	this.englishName = undefined;
  	Object.defineProperties(this, {
  		'value': {
  			get: function () {
  				return this._value;
  			},
  			set: function (value) {
  				if (typeof value !== 'string') {
  					//assume number
  					this._volumeScalar = value;
  					if (value <= 0) {
  						this._value = 'n';
  					} else if (value < .11) {
  						this._value = 'pppp';
  					} else if (value < .16) {
  						this._value = 'ppp';
  					} else if (value < .26) {
  						this._value = 'pp';
  					} else if (value < .36) {
  						this._value = 'p';
  					} else if (value < .5) {
  						this._value = 'mp';
  					} else if (value < .65) {
  						this._value = 'mf';
  					} else if (value < .8) {
  						this._value = 'f';
  					} else if (value < .9) {
  						this._value = 'ff';
  					} else {
  						this._value = 'fff';
  					}
  				} else {
  					this._value = value;
  					this._volumeScalar = undefined;
  				}
  				if (this._value in dynamics.longNames) {
  					this.longName = dynamics.longNames[this._value][0];
  				} else {
  					this.longName = undefined;
  				}
  				if (this._value in dynamics.englishNames) {
  					this.englishName = dynamics.englishNames[this._value][0];
  				} else {
  					this.englishName = undefined;
  				}
  			}
  		},
  		'volumeScalar': {
  			get: function () {
  				if (this._volumeScalar !== undefined) {
  					return this._volumeScalar;
  				} else {
  					if (this._value in dynamics.dynamicStrToScalar) {
  						return dynamics.dynamicStrToScalar[this._value][0];
  					}
  				}
  			},
  			set: function (value) {
  				if (typeof value === 'number' && value <= 1 && value >= 0) {
  					this._volumeScalar = value;
  				}
  			}
  		}
  	});
  	this.value = value;
  };

  dynamics.Dynamic.prototype = new base.Music21Object();
  dynamics.Dynamic.prototype.constructor = dynamics.Dynamic;

  dynamics.tests = function () {
  	test("music21.dynamics.Dynamic", function () {
  		var dynamic = new music21.dynamics.Dynamic("pp");
  		equal(dynamic.value, "pp", "matching dynamic");
  		dynamic = new music21.dynamics.Dynamic(.98);
  		equal(dynamic.value, "fff", "number conversion successful");
  		equal(dynamic.volumeScalar, .98, "correct volume");
  		equal(dynamic.longName, "fortississimo", "matching long name");
  		equal(dynamic.englishName, "extremely loud", "matching english names");
  		dynamic = new music21.dynamics.Dynamic("other");
  		equal(dynamic.value, "other", "record non standard dynamic");
  		equal(dynamic.longName, undefined, "no long name for non standard dynamic");
  		equal(dynamic.englishName, undefined, "no english name for non standard dynamic");
  		dynamic.value = .18;
  		equal(dynamic.value, "pp", "change in dynamic");
  		equal(dynamic.volumeScalar, .18, "change in volume");
  		dynamic.value = "other";
  		equal(dynamic.value, "other", "change to non standard");
  		equal(dynamic.longName, undefined, "change to non standard dynamic");
  		equal(dynamic.englishName, undefined, "change to non standard dynamic");
  	});
  };

  /**
   * Expressions module.  See {@link music21.expressions}
   * 
   * @exports music21/expressions
   */
  /**
   * Expressions can be note attached (`music21.note.Note.expressions[]`) or floating...
   * 
   * @namespace music21.expressions
   * @memberof music21
   * @requires music21/expressions
   */
  var expressions = {};

  /**
   * Expressions can be note attached (`music21.note.Note.expressions[]`) or floating...
   * 
   * @class Expression
   * @memberof music21.expressions
   * @extends music21.base.Music21Object
   * @property {string} name
   * @property {string} vexflowModifier
   * @property {Int} setPosition
   */
  expressions.Expression = function () {
    base.Music21Object.call(this);
    this.classes.push('Expression');
    this.name = "expression";
    this.vexflowModifier = "";
    this.setPosition = undefined;
  };
  expressions.Expression.prototype = new base.Music21Object();
  expressions.Expression.prototype.constructor = expressions.Expression;

  /**
   * Renders this Expression as a Vex.Flow.Articulation
   * 
   * (this is not right for all cases)
   * 
   * @memberof music21.expressions.Expression
   * @returns {Vex.Flow.Articulation}
   */
  expressions.Expression.prototype.vexflow = function () {
    var vfe = new Vex.Flow.Articulation(this.vexflowModifier);
    if (this.setPosition) {
      vfe.setPosition(this.setPosition);
    }
    return vfe;
  };
  /**
   * A fermata...
   * 
   * @class Fermata
   * @memberof music21.expressions
   * @extends music21.expressions.Expression
   */
  expressions.Fermata = function () {
    expressions.Expression.call(this);
    this.classes.push("Fermata");
    this.name = 'fermata';
    this.vexflowModifier = "a@a";
    this.setPosition = 3;
  };
  expressions.Fermata.prototype = new expressions.Expression();
  expressions.Fermata.prototype.constructor = expressions.Fermata;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/fromPython -- Conversion from music21p jsonpickle streams
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   * usage:
   * 
   * in python:
   * 
   * s = corpus.parse('bwv66.6')
   * stringRepresentingM21JsonPickle = s.freezeStream('jsonpickle')
   * 
   * in js:
   * 
   * pyConv = new music21.fromPython.Converter();
   * s = pyConv.run(stringRepresentingM21JsonPickle);
   * 
   * 
   */

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/instrument -- instrument objects
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * Instrument module, see {@link music21.instrument}
   * 
   * @exports music21/instrument
   */

  /**
   * Looking for the {@link music21.instrument.Instrument} object? :-)
   * 
   * @namespace music21.instrument
   * @memberof music21
   * @requires music21/base
   */
  var instrument = {};

  /**
   * Represents an instrument.  instrumentNames are found in the ext/soundfonts directory
   * 
   * See {@link music21.miditools} and esp. `loadSoundfont` for a way of loading soundfonts into
   * instruments.
   * 
   * @class Instrument
   * @memberof music21.instrument
   * @param {string} instrumentName
   * @property {string|undefined} partId
   * @property {string|undefined} partName
   * @property {string|undefined} partAbbreviation
   * @property {string|undefined} instrumentId
   * @property {string|undefined} instrumentName
   * @property {string|undefined} instrumentAbbreviation
   * @property {Int|undefined} midiProgram
   * @property {Int|undefined} midiChannel
   * @property {Int|undefined} lowestNote
   * @property {Int|undefined} highestNote
   * @property {music21.interval.Interval|undefined} transposition
   * @property {Boolean} inGMPercMap=false
   * @property {string|undefined} soundfontFn
   * @property {string|undefined} oggSoundfont - url of oggSoundfont for this instrument
   * @property {string|undefined} mp3Soundfont - url of mp3Soundfont for this instrument
   */
  instrument.Instrument = function (instrumentName) {
      base.Music21Object.call(this);
      this.classSortOrder = -25;

      this.partId = undefined;
      this.partName = undefined;
      this.partAbbreviation = undefined;

      this.instrumentId = undefined;
      this.instrumentName = undefined;
      this.instrumentAbbreviation = undefined;
      this.midiProgram = undefined;
      this._midiChannel = undefined;

      this.lowestNote = undefined;
      this.highestNote = undefined;

      this.transpostion = undefined;

      this.inGMPercMap = false;
      this.soundfontFn = undefined;

      if (instrumentName !== undefined) {
          instrument.find(instrumentName);
      }
      return this;
  };
  instrument.Instrument.prototype = new base.Music21Object();
  instrument.Instrument.prototype.constructor = instrument.Instrument;

  instrument.Instrument.usedChannels = []; // differs from m21p -- stored midiProgram numbers
  instrument.Instrument.maxMidi = 16;

  /**
   * Assign an instrument to an unused midi channel.
   * 
   * Will use the global list of used channels (`music21.instrument.Instrument.usedChannels`)
   * if not given.  Assigns up to `music21.instrument.Instrument.maxMidi` channels (16)
   * Skips 10 unless this.inGMPercMap is true
   * 
   * @memberof music21.instrument.Instrument
   * @param {Array<Int>} [usedChannels]
   * @returns {Number}
   */
  instrument.Instrument.prototype.autoAssignMidiChannel = function (usedChannels) {
      if (usedChannels === undefined) {
          usedChannels = instrument.Instrument.usedChannels;
      }
      var startChannel = 0;
      if (this.inGMPercMap == true) {
          startChannel = 10;
      }
      for (var ch = startChannel; ch < instrument.Instrument.maxMidi; ch++) {
          if (ch % 16 == 10 && this.inGMPercMap != true) {
              continue; // skip 10 / percussion.
          }
          if (usedChannels[ch] === undefined || usedChannels[ch] === this.midiProgram) {
              usedChannels[ch] = this.midiProgram;
              this.midiChannel = ch;
              return ch;
          }
      }
      // no channels! throw exception!
  };

  Object.defineProperties(instrument.Instrument.prototype, {
      'oggSoundfont': {
          enumerable: true,
          configurable: true,
          get: function () {
              return this.soundfontFn + '-ogg.js';
          }
      },
      'mp3Soundfont': {
          enumerable: true,
          configurable: true,
          get: function () {
              return this.soundfontFn + '-mp3.js';
          }
      },
      'midiChannel': {
          enumerable: true,
          configurable: true,
          get: function () {
              if (this._midiChannel === undefined) {
                  this.autoAssignMidiChannel();
              }
              return this._midiChannel;
          },
          set: function (ch) {
              this._midiChannel = ch;
          }
      }

  });

  instrument.info = [{ "fn": "acoustic_grand_piano", "name": "Acoustic Grand Piano", "midiNumber": 0 }, { "fn": "bright_acoustic_piano", "name": "Bright Acoustic Piano", "midiNumber": 1 }, { "fn": "electric_grand_piano", "name": "Electric Grand Piano", "midiNumber": 2 }, { "fn": "honkytonk_piano", "name": "Honky-tonk Piano", "midiNumber": 3 }, { "fn": "electric_piano_1", "name": "Electric Piano 1", "midiNumber": 4 }, { "fn": "electric_piano_2", "name": "Electric Piano 2", "midiNumber": 5 }, { "fn": "harpsichord", "name": "Harpsichord", "midiNumber": 6 }, { "fn": "clavinet", "name": "Clavinet", "midiNumber": 7 }, { "fn": "celesta", "name": "Celesta", "midiNumber": 8 }, { "fn": "glockenspiel", "name": "Glockenspiel", "midiNumber": 9 }, { "fn": "music_box", "name": "Music Box", "midiNumber": 10 }, { "fn": "vibraphone", "name": "Vibraphone", "midiNumber": 11 }, { "fn": "marimba", "name": "Marimba", "midiNumber": 12 }, { "fn": "xylophone", "name": "Xylophone", "midiNumber": 13 }, { "fn": "tubular_bells", "name": "Tubular Bells", "midiNumber": 14 }, { "fn": "dulcimer", "name": "Dulcimer", "midiNumber": 15 }, { "fn": "drawbar_organ", "name": "Drawbar Organ", "midiNumber": 16 }, { "fn": "percussive_organ", "name": "Percussive Organ", "midiNumber": 17 }, { "fn": "rock_organ", "name": "Rock Organ", "midiNumber": 18 }, { "fn": "church_organ", "name": "Church Organ", "midiNumber": 19 }, { "fn": "reed_organ", "name": "Reed Organ", "midiNumber": 20 }, { "fn": "accordion", "name": "Accordion", "midiNumber": 21 }, { "fn": "harmonica", "name": "Harmonica", "midiNumber": 22 }, { "fn": "tango_accordion", "name": "Tango Accordion", "midiNumber": 23 }, { "fn": "acoustic_guitar_nylon", "name": "Acoustic Guitar (nylon)", "midiNumber": 24 }, { "fn": "acoustic_guitar_steel", "name": "Acoustic Guitar (steel)", "midiNumber": 25 }, { "fn": "electric_guitar_jazz", "name": "Electric Guitar (jazz)", "midiNumber": 26 }, { "fn": "electric_guitar_clean", "name": "Electric Guitar (clean)", "midiNumber": 27 }, { "fn": "electric_guitar_muted", "name": "Electric Guitar (muted)", "midiNumber": 28 }, { "fn": "overdriven_guitar", "name": "Overdriven Guitar", "midiNumber": 29 }, { "fn": "distortion_guitar", "name": "Distortion Guitar", "midiNumber": 30 }, { "fn": "guitar_harmonics", "name": "Guitar Harmonics", "midiNumber": 31 }, { "fn": "acoustic_bass", "name": "Acoustic Bass", "midiNumber": 32 }, { "fn": "electric_bass_finger", "name": "Electric Bass (finger)", "midiNumber": 33 }, { "fn": "electric_bass_pick", "name": "Electric Bass (pick)", "midiNumber": 34 }, { "fn": "fretless_bass", "name": "Fretless Bass", "midiNumber": 35 }, { "fn": "slap_bass_1", "name": "Slap Bass 1", "midiNumber": 36 }, { "fn": "slap_bass_2", "name": "Slap Bass 2", "midiNumber": 37 }, { "fn": "synth_bass_1", "name": "Synth Bass 1", "midiNumber": 38 }, { "fn": "synth_bass_2", "name": "Synth Bass 2", "midiNumber": 39 }, { "fn": "violin", "name": "Violin", "midiNumber": 40 }, { "fn": "viola", "name": "Viola", "midiNumber": 41 }, { "fn": "cello", "name": "Cello", "midiNumber": 42 }, { "fn": "contrabass", "name": "Contrabass", "midiNumber": 43 }, { "fn": "tremolo_strings", "name": "Tremolo Strings", "midiNumber": 44 }, { "fn": "pizzicato_strings", "name": "Pizzicato Strings", "midiNumber": 45 }, { "fn": "orchestral_harp", "name": "Orchestral Harp", "midiNumber": 46 }, { "fn": "timpani", "name": "Timpani", "midiNumber": 47 }, { "fn": "string_ensemble_1", "name": "String Ensemble 1", "midiNumber": 48 }, { "fn": "string_ensemble_2", "name": "String Ensemble 2", "midiNumber": 49 }, { "fn": "synth_strings_1", "name": "Synth Strings 1", "midiNumber": 50 }, { "fn": "synth_strings_2", "name": "Synth Strings 2", "midiNumber": 51 }, { "fn": "choir_aahs", "name": "Choir Aahs", "midiNumber": 52 }, { "fn": "voice_oohs", "name": "Voice Oohs", "midiNumber": 53 }, { "fn": "synth_choir", "name": "Synth Choir", "midiNumber": 54 }, { "fn": "orchestra_hit", "name": "Orchestra Hit", "midiNumber": 55 }, { "fn": "trumpet", "name": "Trumpet", "midiNumber": 56 }, { "fn": "trombone", "name": "Trombone", "midiNumber": 57 }, { "fn": "tuba", "name": "Tuba", "midiNumber": 58 }, { "fn": "muted_trumpet", "name": "Muted Trumpet", "midiNumber": 59 }, { "fn": "french_horn", "name": "French Horn", "midiNumber": 60 }, { "fn": "brass_section", "name": "Brass Section", "midiNumber": 61 }, { "fn": "synth_brass_1", "name": "Synth Brass 1", "midiNumber": 62 }, { "fn": "synth_brass_2", "name": "Synth Brass 2", "midiNumber": 63 }, { "fn": "soprano_sax", "name": "Soprano Sax", "midiNumber": 64 }, { "fn": "alto_sax", "name": "Alto Sax", "midiNumber": 65 }, { "fn": "tenor_sax", "name": "Tenor Sax", "midiNumber": 66 }, { "fn": "baritone_sax", "name": "Baritone Sax", "midiNumber": 67 }, { "fn": "oboe", "name": "Oboe", "midiNumber": 68 }, { "fn": "english_horn", "name": "English Horn", "midiNumber": 69 }, { "fn": "bassoon", "name": "Bassoon", "midiNumber": 70 }, { "fn": "clarinet", "name": "Clarinet", "midiNumber": 71 }, { "fn": "piccolo", "name": "Piccolo", "midiNumber": 72 }, { "fn": "flute", "name": "Flute", "midiNumber": 73 }, { "fn": "recorder", "name": "Recorder", "midiNumber": 74 }, { "fn": "pan_flute", "name": "Pan Flute", "midiNumber": 75 }, { "fn": "blown_bottle", "name": "Blown bottle", "midiNumber": 76 }, { "fn": "shakuhachi", "name": "Shakuhachi", "midiNumber": 77 }, { "fn": "whistle", "name": "Whistle", "midiNumber": 78 }, { "fn": "ocarina", "name": "Ocarina", "midiNumber": 79 }, { "fn": "lead_1_square", "name": "Lead 1 (square)", "midiNumber": 80 }, { "fn": "lead_2_sawtooth", "name": "Lead 2 (sawtooth)", "midiNumber": 81 }, { "fn": "lead_3_calliope", "name": "Lead 3 (calliope)", "midiNumber": 82 }, { "fn": "lead_4_chiff", "name": "Lead 4 chiff", "midiNumber": 83 }, { "fn": "lead_5_charang", "name": "Lead 5 (charang)", "midiNumber": 84 }, { "fn": "lead_6_voice", "name": "Lead 6 (voice)", "midiNumber": 85 }, { "fn": "lead_7_fifths", "name": "Lead 7 (fifths)", "midiNumber": 86 }, { "fn": "lead_8_bass__lead", "name": "Lead 8 (bass + lead)", "midiNumber": 87 }, { "fn": "pad_1_new_age", "name": "Pad 1 (new age)", "midiNumber": 88 }, { "fn": "pad_2_warm", "name": "Pad 2 (warm)", "midiNumber": 89 }, { "fn": "pad_3_polysynth", "name": "Pad 3 (polysynth)", "midiNumber": 90 }, { "fn": "pad_4_choir", "name": "Pad 4 (choir)", "midiNumber": 91 }, { "fn": "pad_5_bowed", "name": "Pad 5 (bowed)", "midiNumber": 92 }, { "fn": "pad_6_metallic", "name": "Pad 6 (metallic)", "midiNumber": 93 }, { "fn": "pad_7_halo", "name": "Pad 7 (halo)", "midiNumber": 94 }, { "fn": "pad_8_sweep", "name": "Pad 8 (sweep)", "midiNumber": 95 }, { "fn": "fx_1_rain", "name": "FX 1 (rain)", "midiNumber": 96 }, { "fn": "fx_2_soundtrack", "name": "FX 2 (soundtrack)", "midiNumber": 97 }, { "fn": "fx_3_crystal", "name": "FX 3 (crystal)", "midiNumber": 98 }, { "fn": "fx_4_atmosphere", "name": "FX 4 (atmosphere)", "midiNumber": 99 }, { "fn": "fx_5_brightness", "name": "FX 5 (brightness)", "midiNumber": 100 }, { "fn": "fx_6_goblins", "name": "FX 6 (goblins)", "midiNumber": 101 }, { "fn": "fx_7_echoes", "name": "FX 7 (echoes)", "midiNumber": 102 }, { "fn": "fx_8_scifi", "name": "FX 8 (sci-fi)", "midiNumber": 103 }, { "fn": "sitar", "name": "Sitar", "midiNumber": 104 }, { "fn": "banjo", "name": "Banjo", "midiNumber": 105 }, { "fn": "shamisen", "name": "Shamisen", "midiNumber": 106 }, { "fn": "koto", "name": "Koto", "midiNumber": 107 }, { "fn": "kalimba", "name": "Kalimba", "midiNumber": 108 }, { "fn": "bagpipe", "name": "Bagpipe", "midiNumber": 109 }, { "fn": "fiddle", "name": "Fiddle", "midiNumber": 110 }, { "fn": "shanai", "name": "Shanai", "midiNumber": 111 }, { "fn": "tinkle_bell", "name": "Tinkle Bell", "midiNumber": 112 }, { "fn": "agogo", "name": "Agogo", "midiNumber": 113 }, { "fn": "steel_drums", "name": "Steel Drums", "midiNumber": 114 }, { "fn": "woodblock", "name": "Woodblock", "midiNumber": 115 }, { "fn": "taiko_drum", "name": "Taiko Drum", "midiNumber": 116 }, { "fn": "melodic_tom", "name": "Melodic Tom", "midiNumber": 117 }, { "fn": "synth_drum", "name": "Synth Drum", "midiNumber": 118 }, { "fn": "reverse_cymbal", "name": "Reverse Cymbal", "midiNumber": 119 }, { "fn": "guitar_fret_noise", "name": "Guitar Fret Noise", "midiNumber": 120 }, { "fn": "breath_noise", "name": "Breath Noise", "midiNumber": 121 }, { "fn": "seashore", "name": "Seashore", "midiNumber": 122 }, { "fn": "bird_tweet", "name": "Bird Tweet", "midiNumber": 123 }, { "fn": "telephone_ring", "name": "Telephone Ring", "midiNumber": 124 }, { "fn": "helicopter", "name": "Helicopter", "midiNumber": 125 }, { "fn": "applause", "name": "Applause", "midiNumber": 126 }, { "fn": "gunshot", "name": "Gunshot", "midiNumber": 127 }];

  /**
   * Find information for a given instrument (by filename or name)
   * and load it into an instrument object.
   * 
   * @function music21.instrument.find
   * @memberof music21.instrument
   * @param {string} fn - name or filename of instrument
   * @param {music21.instrument.Instrument} [inst] - instrument object to load into
   * @returns {music21.instrument.Instrument}
   */
  instrument.find = function (fn, inst) {
      if (inst === undefined) {
          inst = new instrument.Instrument();
      }
      for (var i = 0; i < instrument.info.length; i++) {
          var info = instrument.info[i];
          if (info.fn == fn || info.name == fn) {
              inst.soundfontFn = info.fn;
              inst.instrumentName = info.name;
              inst.midiProgram = info.midiNumber;
              return inst;
          }
      }
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/interval -- Interval routines
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006-14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * interval module. See {@link music21.interval} for namespace
   * 
   * @exports music21/interval
   */
  /**
   * Interval related objects
   * 
   * @namespace music21.interval
   * @memberof music21
   * @requires music21/prebase
   * @requires music21/pitch
   */
  var interval = {};

  /**
   * Interval Directions as an Object/map
   * 
   * @memberof music21.interval
   * @example
   * if (music21.interval.IntervalDirections.OBLIQUE >
   *     music21.interval.IntervalDirections.ASCENDING ) {
   *    console.log(music21.interval.IntervalDirections.DESCENDING);    
   * }
   * 
   */
  interval.IntervalDirections = {
  	DESCENDING: -1,
  	OBLIQUE: 0,
  	ASCENDING: 1
  };

  /**
   * N.B. a dict in music21p -- the indexes here let IntervalDirections call them + 1
   * 
   * @memberof music21.interval
   * @example
   * console.log(music21.interval.IntervalDirectionTerms[music21l.interval.IntervalDirections.OBLIQUE + 1])
   * // "Oblique" 
   */
  interval.IntervalDirectionTerms = ['Descending', 'Oblique', 'Ascending'];

  /**
   * ordinals for music terms...
   * 
   * @memberof music21.interval
   * @example
   * for (var i = 1; // N.B. 0 = undefined
   *      i < music21.interval.MusicOrdinals.length;
   *      i++) {
   *     console.log(i, music21.interval.MusicOrdinals[i]);
   * }
   * // 1, Unison
   * // 2, Second
   * // 3, Third
   * // ...
   * // 8, Octave
   * // ...
   * // 15, Double Octave
   */
  interval.MusicOrdinals = [undefined, 'Unison', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Octave', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Double Octave'];

  /**
   * Represents an interval such as unison, second, etc.
   * 
   * Properties are demonstrated below.
   * 
   * @class GenericInterval
   * @memberof music21.interval
   * @param {Int} [gi=1] - generic interval (1 or higher, or -2 or lower)
   * @example
   * var gi = new music21.interval.GenericInterval(-14)
   * gi.value
   * // -14
   * gi.directed
   * // -14
   * gi.undirected
   * // 14
   * gi.direction == music21.interval.IntervalDirections.DESCENDING
   * // true
   * gi.isSkip
   * // true
   * gi.isStep
   * // false
   * gi.isDiatonicStep
   * // false  // augmented unisons are not diatonicSteps but can't tell yet..
   * gi.isUnison
   * // false
   * gi.simpleUndirected
   * // 7
   * gi.undirectedOctaves
   * // 1
   * gi.semiSimpleUndirected
   * // 7  -- semiSimple distinguishes between 8 and 1; that's all
   * gi.perfectable
   * // false
   * gi.niceName
   * // "Fourteenth"
   * gi.directedNiceName
   * // "Descending Fourteenth"
   * gi.simpleNiceName
   * // "Seventh"
   * gi.staffDistance
   * // -13
   * gi.mod7inversion
   * // 2  // sevenths invert to seconds
   * 
   */
  interval.GenericInterval = function (gi) {
  	prebase.ProtoM21Object.call(this);
  	this.classes.push('GenericInterval');
  	if (gi === undefined) {
  		gi = 1;
  	}
  	this.value = gi; // todo: convertGeneric() from python
  	this.directed = this.value;
  	this.undirected = Math.abs(this.value);

  	if (this.directed == 1) {
  		this.direction = interval.IntervalDirections.OBLIQUE;
  	} else if (this.directed < 0) {
  		this.direction = interval.IntervalDirections.DESCENDING;
  	} else if (this.directed > 1) {
  		this.direction = interval.IntervalDirections.ASCENDING;
  	}
  	// else (raise exception)

  	if (this.undirected > 2) {
  		this.isSkip = true;
  	} else {
  		this.isSkip = false;
  	}

  	if (this.undirected == 2) {
  		this.isDiatonicStep = true;
  	} else {
  		this.isDiatonicStep = false;
  	}

  	this.isStep = this.isDiatonicStep;

  	if (this.undirected == 1) {
  		this.isUnison = true;
  	} else {
  		this.isUnison = false;
  	}

  	var tempSteps = this.undirected % 7;
  	var tempOctaves = parseInt(this.undirected / 7);
  	if (tempSteps === 0) {
  		tempOctaves -= 1;
  		tempSteps = 7;
  	}
  	this.simpleUndirected = tempSteps;
  	this.undirectedOctaves = tempOctaves;
  	if (tempSteps == 1 && tempOctaves >= 1) {
  		this.semiSimpleUndirected = 8;
  	} else {
  		this.semiSimpleUndirected = this.simpleUndirected;
  	}

  	if (this.direction == interval.IntervalDirections.DESCENDING) {
  		this.octaves = -1 * tempOctaves;
  		if (tempSteps != 1) {
  			this.simpleDirected = -1 * tempSteps;
  		} else {
  			this.simpleDirected = 1; // no descending unisons...
  		}
  		this.semiSimpleDirected = -1 * this.semiSimpleUndirected;
  	} else {
  		this.octaves = tempOctaves;
  		this.simpleDirected = tempSteps;
  		this.semiSimpleDirected = this.semiSimpleUndirected;
  	}
  	if (this.simpleUndirected == 1 || this.simpleUndirected == 4 || this.simpleUndirected == 5) {
  		this.perfectable = true;
  	} else {
  		this.perfectable = false;
  	}

  	if (this.undirected < interval.MusicOrdinals.length) {
  		this.niceName = interval.MusicOrdinals[this.undirected];
  	} else {
  		this.niceName = this.undirected.toString();
  	}

  	this.simpleNiceName = interval.MusicOrdinals[this.simpleUndirected];
  	this.semiSimpleNiceName = interval.MusicOrdinals[this.semiSimpleUndirected];

  	if (Math.abs(this.directed) == 1) {
  		this.staffDistance = 0;
  	} else if (this.directed > 1) {
  		this.staffDistance = this.directed - 1;
  	} else if (this.directed < -1) {
  		this.staffDistance = this.directed + 1;
  	}
  	// else: raise IntervalException("Non-integer, -1, or 0 not permitted as a diatonic interval")

  	// 2 -> 7; 3 -> 6; 8 -> 1 etc.
  	this.mod7inversion = 9 - this.semiSimpleUndirected;

  	if (this.direction == interval.IntervalDirections.DESCENDING) {
  		this.mod7 = this.mod7inversion; // see chord.semitonesFromChordStep for usage...
  	} else {
  		this.mod7 = this.simpleDirected;
  	}
  };
  interval.GenericInterval.prototype = new prebase.ProtoM21Object();
  interval.GenericInterval.prototype.constructor = interval.GenericInterval;

  /**
   * Returns a new GenericInterval which is the mod7inversion; 3rds (and 10ths etc.) to 6ths, etc.
   * 
   * @memberof music21.interval.GenericInterval
   * @returns {music21.interval.GenericInterval}
   */
  interval.GenericInterval.prototype.complement = function () {
  	return new interval.GenericInterval(this.mod7inversion);
  };

  /**
   * Returns a new GenericInterval which has the opposite direction (descending becomes ascending, etc.)
   * 
   * @memberof music21.interval.GenericInterval
   * @returns {music21.interval.GenericInterval}
   */
  interval.GenericInterval.prototype.reverse = function () {
  	if (this.undirected == 1) {
  		return new interval.GenericInterval(1);
  	} else {
  		return new interval.GenericInterval(this.undirected * (-1 * this.direction));
  	}
  };
  /**
   * Given a specifier, return a new DiatonicInterval with this generic.
   * 
   * @memberof music21.interval.GenericInterval
   * @param {string|Int} specifier - a specifier such as "P","m","M","A","dd" etc.
   * @returns {music21.interval.DiatonicInterval}
   */
  interval.GenericInterval.prototype.getDiatonic = function (specifier) {
  	return new interval.DiatonicInterval(specifier, this);
  };

  /**
   * Transpose a pitch by this generic interval, maintaining accidentals
   * 
   * @memberof music21.interval.GenericInterval
   * @param {music21.pitch.Pitch} p
   * @returns {music21.pitch.Pitch}
   */
  interval.GenericInterval.prototype.transposePitch = function (p) {
  	var pitch2 = new pitch.Pitch();
  	pitch2.step = p.step;
  	pitch2.octave = p.octave;

  	var oldDiatonicNum = p.diatonicNoteNum;

  	var distanceToMove = this.staffDistance;

  	// if not reverse...
  	var newDiatonicNumber = oldDiatonicNum + distanceToMove;
  	var newInfo = interval.IntervalConvertDiatonicNumberToStep(newDiatonicNumber);
  	pitch2.step = newInfo[0];
  	pitch2.octave = newInfo[1];
  	if (p.accidental !== undefined) {
  		pitch2.accidental = new music21.pitch.Accidental(p.accidental.name);
  	}
  	return pitch2;
  };

  interval.IntervalSpecifiersEnum = {
  	PERFECT: 1,
  	MAJOR: 2,
  	MINOR: 3,
  	AUGMENTED: 4,
  	DIMINISHED: 5,
  	DBLAUG: 6,
  	DBLDIM: 7,
  	TRPAUG: 8,
  	TRPDIM: 9,
  	QUADAUG: 10,
  	QUADDIM: 11
  };

  interval.IntervalNiceSpecNames = ['ERROR', 'Perfect', 'Major', 'Minor', 'Augmented', 'Diminished', 'Doubly-Augmented', 'Doubly-Diminished', 'Triply-Augmented', 'Triply-Diminished', "Quadruply-Augmented", "Quadruply-Diminished"];
  interval.IntervalPrefixSpecs = [undefined, 'P', 'M', 'm', 'A', 'd', 'AA', 'dd', 'AAA', 'ddd', 'AAAA', 'dddd'];

  interval.IntervalOrderedPerfSpecs = ['dddd', 'ddd', 'dd', 'd', 'P', 'A', 'AA', 'AAA', 'AAAA'];

  interval.IntervalPerfSpecifiers = [interval.IntervalSpecifiersEnum.QUADDMIN, interval.IntervalSpecifiersEnum.TRPDIM, interval.IntervalSpecifiersEnum.DBLDIM, interval.IntervalSpecifiersEnum.DIMINISHED, interval.IntervalSpecifiersEnum.PERFECT, interval.IntervalSpecifiersEnum.AUGMENTED, interval.IntervalSpecifiersEnum.DBLAUG, interval.IntervalSpecifiersEnum.TRPAUG, interval.IntervalSpecifiersEnum.QUADAUG];
  interval.IntervalPerfOffset = 4;

  interval.IntervalOrderedImperfSpecs = ['dddd', 'ddd', 'dd', 'd', 'm', 'M', 'A', 'AA', 'AAA', 'AAAA'];

  interval.IntervalSpecifiers = [interval.IntervalSpecifiersEnum.QUADDMIN, interval.IntervalSpecifiersEnum.TRPDIM, interval.IntervalSpecifiersEnum.DBLDIM, interval.IntervalSpecifiersEnum.DIMINISHED, interval.IntervalSpecifiersEnum.MINOR, interval.IntervalSpecifiersEnum.MAJOR, interval.IntervalSpecifiersEnum.AUGMENTED, interval.IntervalSpecifiersEnum.DBLAUG, interval.IntervalSpecifiersEnum.TRPAUG, interval.IntervalSpecifiersEnum.QUADAUG];
  interval.IntervalMajOffset = 5;

  interval.IntervalSemitonesGeneric = {
  	1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11
  };
  interval.IntervalAdjustPerfect = {
  	"P": 0, "A": 1, "AA": 2, "AAA": 3, "AAAA": 4,
  	"d": -1, "dd": -2, "ddd": -3, "dddd": -4
  }; // offset from Perfect

  interval.IntervalAdjustImperf = {
  	"M": 0, "m": -1, "A": 1, "AA": 2, "AAA": 3, "AAAA": 4,
  	"d": -2, "dd": -3, "ddd": -4, "dddd": -5
  }; // offset from major


  /**
   * Represents a Diatonic interval.  See example for usage.
   * 
      * @class DiatonicInterval
      * @memberof music21.interval
      * @param {string|Int|undefined} [specifier='P'] - a specifier such as "P", "d", "m", "M" etc.
      * @param {music21.interval.GenericInterval|Int} [generic=1] - a `GenericInterval` object or a number to be converted to one
      * @example
      * var di = new music21.interval.DiatonicInterval("M", 10);
      * di.generic.isClassOrSubclass('GenericInterval');
      * // true
      * di.specifier;
      * // 'M'
      * di.name;
      * // 'M10'
      * di.direction == music21.interval.IntervalDirections.ASCENDING;
      * // true
      * di.niceName
      * // "Major Tenth"
      * 
      * // See music21p for more possibilities.
   */
  interval.DiatonicInterval = function (specifier, generic) {
  	prebase.ProtoM21Object.call(this);
  	this.classes.push('DiatonicInterval');

  	if (specifier === undefined) {
  		specifier = "P";
  	}
  	if (generic === undefined) {
  		generic = new interval.GenericInterval(1);
  	} else if (typeof generic == 'number') {
  		generic = new interval.GenericInterval(generic);
  	}

  	this.name = "";
  	if (typeof specifier == 'number') {
  		this.specifier = specifier;
  	} else {
  		this.specifier = interval.IntervalPrefixSpecs.indexOf(specifier); // todo: convertSpecifier();		    
  	}
  	this.generic = generic;

  	if (generic.undirected != 1 || specifier == interval.IntervalSpecifiersEnum.PERFECT) {
  		this.direction = generic.direction;
  	} else {
  		// diminished unisons -- very controversial
  		if (interval.IntervalPerfSpecifiers.indexOf(specifier) <= interval.IntervalPerfSpecifiers.indexOf(interval.IntervalSpecifiersEnum.DIMINISHED)) {
  			this.direction = interval.IntervalDirections.DESCENDING;
  		} else {
  			this.direction = interval.IntervalDirections.ASCENDING;
  		}
  	}
  	var diatonicDirectionNiceName = interval.IntervalDirectionTerms[this.direction + 1];
  	this.name = interval.IntervalPrefixSpecs[this.specifier] + generic.undirected.toString();
  	this.niceName = interval.IntervalNiceSpecNames[this.specifier] + " " + generic.niceName;
  	this.simpleName = interval.IntervalPrefixSpecs[this.specifier] + generic.simpleUndirected.toString();
  	this.simpleNiceName = interval.IntervalNiceSpecNames[this.specifier] + " " + generic.simpleNiceName;
  	this.semiSimpleName = interval.IntervalPrefixSpecs[this.specifier] + generic.semiSimpleUndirected.toString();
  	this.semiSimpleNiceName = interval.IntervalNiceSpecNames[this.specifier] + " " + generic.semiSimpleNiceName;
  	this.directedName = interval.IntervalPrefixSpecs[this.specifier] + generic.directed.toString();
  	this.directedNiceName = diatonicDirectionNiceName + " " + this.niceName;
  	this.directedSimpleName = interval.IntervalPrefixSpecs[this.specifier] + generic.simpleDirected.toString();
  	this.directedSimpleNiceName = diatonicDirectionNiceName + " " + this.simpleNiceName;
  	this.directedSemiSimpleName = interval.IntervalPrefixSpecs[this.specifier] + generic.semiSimpleDirected.toString();
  	this.directedSemiSimpleNiceName = diatonicDirectionNiceName + " " + this.semiSimpleNameName;
  	this.specificName = interval.IntervalNiceSpecNames[this.specifier];
  	this.perfectable = generic.perfectable;
  	this.isDiatonicStep = generic.isDiatonicStep;
  	this.isStep = generic.isStep;

  	// generate inversions
  	if (this.perfectable) {
  		this.orderedSpecifierIndex = interval.IntervalOrderedPerfSpecs.indexOf(interval.IntervalPrefixSpecs[this.specifier]);
  		this.invertedOrderedSpecIndex = interval.IntervalOrderedPerfSpecs.length - 1 - this.orderedSpecifierIndex;
  		this.invertedOrderedSpecifier = interval.IntervalOrderedPerfSpecs[this.invertedOrderedSpecIndex];
  	} else {
  		this.orderedSpecifierIndex = interval.IntervalOrderedImperfSpecs.indexOf(interval.IntervalPrefixSpecs[this.specifier]);
  		this.invertedOrderedSpecIndex = interval.IntervalOrderedImperfSpecs.length - 1 - this.orderedSpecifierIndex;
  		this.invertedOrderedSpecifier = interval.IntervalOrderedImperfSpecs[this.invertedOrderedSpecIndex];
  	}

  	this.mod7inversion = this.invertedOrderedSpecifier + generic.mod7inversion.toString();
  	/* ( if (this.direction == interval.IntervalDirections.DESCENDING) {
   	this.mod7 = this.mod7inversion;
   } else {
   	this.mod7 = this.simpleName;
   } */

  	// TODO: reverse()
  	// TODO: property cents

  };
  interval.DiatonicInterval.prototype = new prebase.ProtoM21Object();
  interval.DiatonicInterval.prototype.constructor = interval.DiatonicInterval;

  /**
   * Returns a ChromaticInterval object of the same size.
   * 
   * @memberof music21.interval.DiatonicInterval
   * @returns {music21.interval.ChromaticInterval}
   */
  interval.DiatonicInterval.prototype.getChromatic = function () {
  	var octaveOffset = Math.floor(Math.abs(this.generic.staffDistance) / 7);
  	var semitonesStart = interval.IntervalSemitonesGeneric[this.generic.simpleUndirected];
  	var specName = interval.IntervalPrefixSpecs[this.specifier];

  	var semitonesAdjust = 0;
  	if (this.generic.perfectable) {
  		semitonesAdjust = interval.IntervalAdjustPerfect[specName];
  	} else {
  		semitonesAdjust = interval.IntervalAdjustImperf[specName];
  	}

  	var semitones = octaveOffset * 12 + semitonesStart + semitonesAdjust;

  	// direction should be same as original

  	if (this.generic.direction == interval.IntervalDirections.DESCENDING) {
  		semitones *= -1;
  	}
  	if (music21.debug) {
  		console.log('DiatonicInterval.getChromatic -- octaveOffset: ' + octaveOffset);
  		console.log('DiatonicInterval.getChromatic -- semitonesStart: ' + semitonesStart);
  		console.log('DiatonicInterval.getChromatic -- specName: ' + specName);
  		console.log('DiatonicInterval.getChromatic -- semitonesAdjust: ' + semitonesAdjust);
  		console.log('DiatonicInterval.getChromatic -- semitones: ' + semitones);
  	}
  	return new interval.ChromaticInterval(semitones);
  };

  /**
   * @class ChromaticInterval
   * @memberof music21.interval
   * @param {number} value - number of semitones (positive or negative)
   * @property {number} cents
   * @property {number} value
   * @property {number} undirected - absolute value of value
   * @property {number} mod12 - reduction to one octave
   * @property {number} intervalClass - reduction to within a tritone (11 = 1, etc.)
   * 
   */
  interval.ChromaticInterval = function (value) {
  	prebase.ProtoM21Object.call(this);
  	this.classes.push('ChromaticInterval');

  	this.semitones = value;
  	this.cents = Math.round(value * 100.0, 5);
  	this.directed = value;
  	this.undirected = Math.abs(value);

  	if (this.directed === 0) {
  		this.direction = interval.IntervalDirections.OBLIQUE;
  	} else if (this.directed == this.undirected) {
  		this.direction = interval.IntervalDirections.ASCENDING;
  	} else {
  		this.direction = interval.IntervalDirections.DESCENDING;
  	}

  	this.mod12 = this.semitones % 12;
  	this.simpleUndirected = this.undirected % 12;
  	if (this.direction == interval.IntervalDirections.DESCENDING) {
  		this.simpleDirected = -1 * this.simpleUndirected;
  	} else {
  		this.simpleDirected = this.simpleUndirected;
  	}

  	this.intervalClass = this.mod12;
  	if (this.mod12 > 6) {
  		this.intervalClass = 12 - this.mod12;
  	}

  	if (this.undirected == 1) {
  		this.isChromaticStep = true;
  	} else {
  		this.isChromaticStep = false;
  	}
  };
  interval.ChromaticInterval.prototype = new prebase.ProtoM21Object();
  interval.ChromaticInterval.prototype.constructor = interval.ChromaticInterval;

  interval.ChromaticInterval.prototype.reverse = function () {
  	return new interval.ChromaticInterval(this.undirected * (-1 * this.direction));
  };

  // TODO: this.getDiatonic()

  /**
   * Transposes pitches but does not maintain accidentals, etc.
   * 
   * @memberof music21.interval.ChromaticInterval
   * @property {music21.pitch.Pitch} p - pitch to transpose
   * @returns {music21.pitch.Pitch}
   */
  interval.ChromaticInterval.prototype.transposePitch = function (p) {
  	var useImplicitOctave = false;
  	if (p.octave === undefined) {
  		// not yet implemented in m21j
  		useImplicitOctave = true;
  	}
  	var pps = p.ps;
  	newPitch = new pitch.Pitch();
  	newPitch.ps = pps + this.semitones;
  	if (useImplicitOctave) {
  		newPitch.octave = undefined;
  	}
  	return newPitch;
  };

  interval.IntervalStepNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  /**
   * @function music21.interval.IntervalConvertDiatonicNumberToStep
   * @memberof music21.interval
   * @param {Int} dn - diatonic number, where 29 = C4, C#4 etc.
   * @returns {Array} two element array of {string} stepName and {Int} octave
   */
  interval.IntervalConvertDiatonicNumberToStep = function (dn) {
  	var stepNumber;
  	var octave;
  	if (dn === 0) {
  		return ["B", -1];
  	} else if (dn > 0) {
  		octave = Math.floor((dn - 1) / 7);
  		stepNumber = dn - 1 - octave * 7;
  	} else {
  		// low notes... test, because js(floor) != py(int);
  		octave = Math.floor(dn / 7);
  		stepNumber = dn - 1 - (octave + 1) * 7;
  	}
  	var stepName = interval.IntervalStepNames[stepNumber];
  	return [stepName, octave];
  };

  /**
   * This is the main, powerful Interval class.
   * 
   * Instantiate with either a string ("M3") or two {@link music21.pitch.Pitch} or two {@link music21.note.Note}
   * 
   * See music21p instructions for usage.
   * 
   * @class Interval
   * @memberof music21.interval
   * @example
   * var n1 = new music21.note.Note("C4");
   * var n2 = new music21.note.Note("F#5");
   * var iv = new music21.interval.Interval(n1, n2);
   * iv.isConsonant();
   * // false
   * iv.semitones;
   * // 18
   * iv.niceName
   * // "Augmented Eleventh"
   */
  interval.Interval = function () {
  	prebase.ProtoM21Object.call(this);
  	this.classes.push('Interval');

  	// todo: allow full range of ways of specifying as in m21p
  	if (arguments.length == 1) {
  		var arg0 = arguments[0];
  		if (typeof arg0 == 'string') {
  			// simple...
  			var specifier = arg0.slice(0, 1);
  			var generic = parseInt(arg0.slice(1));
  			var gI = new interval.GenericInterval(generic);
  			var dI = new interval.DiatonicInterval(specifier, gI);
  			this.diatonic = dI;
  			this.chromatic = this.diatonic.getChromatic();
  		} else if (arg0.specifier !== undefined) {
  			// assume diatonic...
  			this.diatonic = arg0;
  			this.chromatic = this.diatonic.getChromatic();
  		} else {
  			console.error('cant parse string arguments to Interval yet');
  		}
  	} else if (arguments.length == 2) {
  		if (arguments[0].pitch === undefined && arguments[0].diatonicNoteNum === undefined) {
  			this.diatonic = arguments[0];
  			this.chromatic = arguments[1];
  		} else {
  			var n1 = arguments[0];
  			var n2 = arguments[1];
  			var gInt = interval.notesToGeneric(n1, n2);
  			var cInt = interval.notesToChromatic(n1, n2);

  			this.diatonic = interval.intervalsToDiatonic(gInt, cInt);
  			this.chromatic = cInt;
  		}
  	}
  	this.reinit();
  	Object.defineProperties(this, {
  		'complement': {
  			enumerable: true,
  			get: function () {
  				return new interval.Interval(this.diatonic.mod7inversion);
  			}
  		}
  	});
  };
  interval.Interval.prototype = new prebase.ProtoM21Object();
  interval.Interval.prototype.constructor = interval.Interval;

  interval.Interval.prototype.reinit = function () {
  	this.direction = this.chromatic.direction;
  	this.specifier = this.diatonic.specifier;
  	this.diatonicType = this.diatonic.specifier;
  	//this.specificName = this.diatonic.specificName;
  	this.generic = this.diatonic.generic;

  	this.name = this.diatonic.name;
  	this.niceName = this.diatonic.niceName;
  	this.simpleName = this.diatonic.simpleName;
  	this.simpleNiceName = this.diatonic.simpleNiceName;
  	this.semiSimpleName = this.diatonic.semiSimpleName;
  	this.semiSimpleNiceName = this.diatonic.semiSimpleNiceName;

  	this.directedName = this.diatonic.directedName;
  	this.directedNiceName = this.diatonic.directedNiceName;
  	this.directedSimpleName = this.diatonic.directedSimpleName;
  	this.directedSimpleNiceName = this.diatonic.directedSimpleNiceName;

  	// other names...
  	this.isDiatonicStep = this.diatonic.isDiatonicStep;

  	this.isChromaticStep = this.chromatic.isChromaticStep;
  	this.semitones = this.chromatic.semitones;
  	this.intervalClass = this.chromatic.intervalClass;
  	this.cents = this.chromatic.cents;
  	this.isStep = this.isChromaticStep || this.isDiatonicStep;
  };

  /**
   * @memberof music21.interval.Interval
   * @returns {Boolean}
   */
  interval.Interval.prototype.isConsonant = function () {
  	var sn = this.simpleName;
  	if (sn == 'P5' || sn == 'm3' || sn == 'M3' || sn == 'm6' || sn == 'M6' || sn == 'P1') {
  		return true;
  	} else {
  		return false;
  	}
  };

  // todo general: microtones
  /**
   * @memberof music21.interval.Interval
   * @param {music21.pitch.Pitch} p - pitch to transpose
   * @returns {music21.pitch.Pitch}
   */
  interval.Interval.prototype.transposePitch = function (p) {
  	// todo: reverse, clearAccidentalDisplay, maxAccidental;

  	/*
   var useImplicitOctave = false;
   if (p.octave === undefined) {
       useImplicitOctave = true;
   }
   */
  	var pitch2 = this.diatonic.generic.transposePitch(p);
  	pitch2.accidental = undefined;
  	// step and octave are right now, but not necessarily accidental
  	var halfStepsToFix = this.chromatic.semitones - parseInt(pitch2.ps - p.ps);
  	if (halfStepsToFix !== 0) {
  		pitch2.accidental = new pitch.Accidental(halfStepsToFix);
  	}
  	if (music21.debug) {
  		console.log('Interval.transposePitch -- distance to move' + distanceToMove);
  		console.log('Interval.transposePitch -- old diatonic num' + oldDiatonicNum);
  		console.log("Interval.transposePitch -- new step " + pitch2.step);
  		console.log("Interval.transposePitch -- new diatonic number " + newDiatonicNumber);
  		console.log("Interval.transposePitch -- new octave " + pitch2.octave);
  		console.log("Interval.transposePitch -- fixing halfsteps for " + halfStepsToFix);
  	}
  	return pitch2;
  };

  /**
   * Convert two notes or pitches to a GenericInterval;
   */
  interval.notesToGeneric = function (n1, n2) {
  	var p1 = n1;
  	if (n1.pitch !== undefined) {
  		p1 = n1.pitch;
  	}
  	var p2 = n2;
  	if (n2.pitch !== undefined) {
  		p2 = n2.pitch;
  	}
  	var staffDist = p2.diatonicNoteNum - p1.diatonicNoteNum;
  	var genDist = interval.convertStaffDistanceToInterval(staffDist);
  	return new interval.GenericInterval(genDist);
  };

  interval.convertStaffDistanceToInterval = function (staffDist) {
  	if (staffDist === 0) {
  		return 1;
  	} else if (staffDist > 0) {
  		return staffDist + 1;
  	} else {
  		return staffDist - 1;
  	}
  };

  interval.notesToChromatic = function (n1, n2) {
  	var p1 = n1;
  	if (n1.pitch !== undefined) {
  		p1 = n1.pitch;
  	}
  	var p2 = n2;
  	if (n2.pitch !== undefined) {
  		p2 = n2.pitch;
  	}
  	return new interval.ChromaticInterval(p2.ps - p1.ps);
  };

  interval.intervalsToDiatonic = function (gInt, cInt) {
  	var specifier = interval._getSpecifierFromGenericChromatic(gInt, cInt);
  	// todo -- convert specifier...
  	return new interval.DiatonicInterval(specifier, gInt);
  };

  interval._getSpecifierFromGenericChromatic = function (gInt, cInt) {
  	var noteVals = [undefined, 0, 2, 4, 5, 7, 9, 11];
  	var normalSemis = noteVals[gInt.simpleUndirected] + 12 * gInt.undirectedOctaves;
  	var theseSemis = 0;
  	if (gInt.direction != cInt.direction && gInt.direction != interval.IntervalDirections.OBLIQUE && cInt.direction != interval.IntervalDirections.OBLIQUE) {
  		// intervals like d2 and dd2 etc. (the last test doesn't matter, since -1*0 === 0, but in theory it should be there)
  		theseSemis = -1 * cInt.undirected;
  	} else if (gInt.undirected == 1) {
  		theseSemis = cInt.directed; // matters for unison            
  	} else {
  		// all normal intervals
  		theseSemis = cInt.undirected;
  	}
  	var semisRounded = Math.round(theseSemis);
  	var specifier = "";
  	if (gInt.perfectable) {
  		specifier = interval.IntervalPerfSpecifiers[interval.IntervalPerfOffset + semisRounded - normalSemis];
  	} else {
  		specifier = interval.IntervalSpecifiers[interval.IntervalMajOffset + semisRounded - normalSemis];
  	}
  	return specifier;
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/scale -- Scales
   * 
   * Does not implement the full range of scales from music21p
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * Scale module. See {@link music21.scale} namespace
   * 
   * @exports music21/scale
   */
  /**
   * Scale namespace.  Right now only supports very simple scales.
   * 
   * @namespace music21.scale
   * @memberof music21
   * @requires music21/pitch
   * @requires music21/interval
   */
  var scale = {};

  /**
   * Function, not class
   * 
   * @function music21.scale.SimpleDiatonicScale
   * @param {music21.pitch.Pitch} tonic
   * @param {Array<string>} scaleSteps - an array of diatonic prefixes, generally 'M' (major) or 'm' (minor) describing the seconds.
   * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
   */
  scale.SimpleDiatonicScale = function (tonic, scaleSteps) {
  	if (tonic == undefined) {
  		tonic = new pitch.Pitch("C4");
  	} else if (!(tonic instanceof pitch.Pitch)) {
  		throw "Cannot make a scale not from a music21.pitch.Pitch object: " + tonic;
  	}
  	if (scaleSteps == undefined) {
  		scaleSteps = ['M', 'M', 'm', 'M', 'M', 'M', 'm'];
  	}
  	var gi = new interval.GenericInterval(2);
  	var pitches = [tonic];
  	var lastPitch = tonic;
  	for (var i = 0; i < scaleSteps.length; i++) {
  		var di = new interval.DiatonicInterval(scaleSteps[i], gi);
  		var ii = new interval.Interval(di);
  		var newPitch = ii.transposePitch(lastPitch);
  		if (music21.debug) {
  			console.log('ScaleSimpleMajor -- adding pitch: ' + newPitch.name);
  		}
  		pitches.push(newPitch);
  		lastPitch = newPitch;
  	}
  	return pitches;
  };

  /**
   * One octave of a major scale
   * 
   * @function music21.scale.ScaleSimpleMajor
      * @param {music21.pitch.Pitch} tonic
      * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
   */
  scale.ScaleSimpleMajor = function (tonic) {
  	var scaleSteps = ['M', 'M', 'm', 'M', 'M', 'M', 'm'];
  	return new scale.SimpleDiatonicScale(tonic, scaleSteps);
  };

  /**
   * One octave of a minor scale
   * 
   * @function music21.scale.ScaleSimpleMinor
   * @param {music21.pitch.Pitch} tonic
   * @param {string} [minorType='natural] - 'harmonic', 'harmonic-minor', 'melodic', 'melodic-minor', 'melodic-minor-ascending', 'melodic-ascending' or other (=natural/melodic-descending)
   * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
   */
  scale.ScaleSimpleMinor = function (tonic, minorType) {
  	var scaleSteps = ['M', 'm', 'M', 'M', 'm', 'M', 'M'];
  	if (typeof minorType == 'string') {
  		// "harmonic minor" -> "harmonic-minor"
  		minorType = minorType.replace(/\s/g, "-");
  	}
  	if (minorType == 'harmonic' || minorType == 'harmonic-minor') {
  		scaleSteps[5] = 'A';
  		scaleSteps[6] = 'm';
  	} else if (minorType == 'melodic' || minorType == 'melodic-ascending' || minorType == 'melodic-minor' || minorType == 'melodic-minor-ascending') {
  		scaleSteps[4] = 'M';
  		scaleSteps[6] = 'm';
  	}
  	return new scale.SimpleDiatonicScale(tonic, scaleSteps);
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/key -- KeySignature and Key objects
   * 
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * key and keysignature module. See {@link music21.key} namespace for details
   * 
   * @exports music21/key
   */
  /**
   * Key and KeySignature related objects and methods
   * 
   * @namespace music21.key
   * @memberof music21
   * @requires music21/base
   * @requires music21/pitch
   * @requires music21/interval
   * @requires music21/scale
   */
  var key = {};

  key.modeSharpsAlter = {
      'major': 0,
      'minor': -3,
      'dorian': -2,
      'phrygian': -4,
      'lydian': 1,
      'mixolydian': -1,
      'locrian': -5
  };

  /**
   * @class KeySignature
   * @memberof music21.key
   * @description Represents a key signature
   * @param {Int} [sharps=0] -- the number of sharps (negative for flats)
      * @property {Int} [sharps=0] -- number of sharps (negative for flats)
      * @extends music21.base.Music21Object
      * @example
      * var ks = new music21.key.KeySignature(-3); //E-flat major or c minor
      * var s = new music21.stream.Stream();
      * s.keySignature = ks;
      * var n = new music21.note.Note('A-'); // A-flat
      * s.append(n);
      * s.appendNewCanvas();
   */
  key.KeySignature = function (sharps) {
      base.Music21Object.call(this);
      this.classes.push('KeySignature');
      this._sharps = sharps || 0; // if undefined
      this._alteredPitchesCache = undefined;

      // 12 flats/sharps enough for now...
      this.flatMapping = ['C', 'F', 'B-', 'E-', 'A-', 'D-', 'G-', 'C-', 'F-', 'B--', 'E--', 'A--', 'D--'];
      this.sharpMapping = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'];

      Object.defineProperties(this, {
          'sharps': {
              enumerable: true,
              configurable: true,
              get: function () {
                  return this._sharps;
              },
              set: function (s) {
                  this._alteredPitchesCache = [];this._sharps = s;
              }
          },
          /**
           * Gives the width in pixels necessary to represent the key signature.
           * 
           * @memberof music21.key.KeySignature#
           * @var {number} width
           * @readonly
           */
          'width': {
              enumerable: true,
              configurable: true,
              get: function () {
                  return 5 * Math.abs(this.sharps);
              }
          },
          /**
           * An Array of Altered Pitches in KeySignature order (i.e., for flats, Bb, Eb, etc.)
           * 
           * @memberof music21.key.KeySignature#
           * @var {Array<music21.pitch.Pitch>} alteredPitches
           * @readonly
           * @example
           * var ks = new music21.key.KeySignature(3)
           * var ap = ks.alteredPitches
           * var apName = [];
           * for (var i = 0; i < ap.length; i++) {
           *     apName.push(ap[i].name);
           * }
           * apName
           * // ["F#", "C#", "G#"]
           */
          'alteredPitches': {
              get: function () {
                  if (this._alteredPitchesCache != undefined) {
                      return this._alteredPitchesCache;
                  }
                  var transStr = "P5";
                  var startPitch = "B";
                  if (this.sharps < 0) {
                      transStr = "P4";
                      startPitch = "F";
                  }
                  var transInterval = new interval.Interval(transStr);
                  var post = [];
                  var pKeep = new pitch.Pitch(startPitch);
                  for (var i = 0; i < Math.abs(this.sharps); i++) {
                      pKeep = transInterval.transposePitch(pKeep);
                      pKeep.octave = 4;
                      post.push(pKeep);
                  }
                  this._alteredPitchesCache = post;
                  return post;
              }
          }
      });
  };

  key.KeySignature.prototype = new base.Music21Object();
  key.KeySignature.prototype.constructor = key.KeySignature;

  /**
   * Return the name of the major key with this many sharps
   * 
   * @memberof music21.key.KeySignature
   * @returns {(string|undefined)} name of key
   * @example
   * var ks = new music21.key.KeySignature(-3)
   * ks.majorName()
   * // "E-"
   */
  key.KeySignature.prototype.majorName = function () {
      if (this.sharps >= 0) {
          return this.sharpMapping[this.sharps];
      } else {
          return this.flatMapping[Math.abs(this.sharps)];
      }
  };
  /**
   * Return the name of the minor key with this many sharps
   * @memberof music21.key.KeySignature
   * @returns {(string|undefined)}
   */
  key.KeySignature.prototype.minorName = function () {
      var tempSharps = this.sharps + 3;
      if (tempSharps >= 0) {
          return this.sharpMapping[tempSharps];
      } else {
          return this.flatMapping[Math.abs(tempSharps)];
      }
  };

  /**
   * returns the vexflow name (just the `majorName()` with "b" for "-") for
   * the key signature.  Does not create the object.
   * 
   * Deprecated.
   * 
   * @memberof music21.key.KeySignature
   * @returns {string}
   */
  key.KeySignature.prototype.vexflow = function () {
      var tempName = this.majorName();
      return tempName.replace(/\-/g, "b");
  };
  /**
   * Returns the accidental associated with a step in this key, or undefined if none.
   * 
   * @memberof music21.key.KeySignature
   * @param {string} step - a valid step name such as "C","D", etc., but not "C#" etc.
   * @returns {(music21.pitch.Accidental|undefined)}
   */
  key.KeySignature.prototype.accidentalByStep = function (step) {
      var aps = this.alteredPitches;
      for (var i = 0; i < aps.length; i++) {
          if (aps[i].step == step) {
              if (aps[i].accidental == undefined) {
                  return undefined;
              }
              // make a new accidental;
              return new pitch.Accidental(aps[i].accidental.alter);
          }
      }
      return undefined;
  };
  /**
   * Takes a pitch in C major and transposes it so that it has
   * the same step position in the current key signature.
   * 
   * @memberof music21.key.KeySignature
   * @returns {music21.pitch.Pitch}
   * @example
   * var ks = new music21.key.KeySignature(-3)
   * var p1 = new music21.pitch.Pitch('B')
   * var p2 = ks.transposePitchFromC(p1)
   * p2.name
   * // "D"
   * var p3 = new music21.pitch.Pitch('G-')
   * var p4 = ks.transposePitchFromC(p3)
   * p4.name
   * // "B--"
   */
  key.KeySignature.prototype.transposePitchFromC = function (p) {
      var transInterval = undefined;
      var transTimes = undefined;
      if (this.sharps == 0) {
          return new pitch.Pitch(p.nameWithOctave);
      } else if (this.sharps < 0) {
          transTimes = Math.abs(this.sharps);
          transInterval = new interval.Interval("P4");
      } else {
          transTimes = this.sharps;
          transInterval = new interval.Interval("P5");
      }
      var newPitch = p;
      for (var i = 0; i < transTimes; i++) {
          newPitch = transInterval.transposePitch(newPitch);
          if (i % 2 == 1) {
              newPitch.octave = newPitch.octave - 1;
          }
      }
      return newPitch;
  };

  /**
   * Create a Key object. Like a KeySignature but with ideas about Tonic, Dominant, etc.
   * 
   * TODO: allow keyName to be a {@link music21.pitch.Pitch}
   * 
   * @class Key
   * @memberof music21.key
   * @extends music21.key.KeySignature
   * @param {string} keyName -- a pitch name representing the key (w/ "-" for flat)
   * @param {string} [mode] -- if not given then the CASE of the keyName will be used ("C" => "major", "c" => "minor")
   */
  key.Key = function (keyName, mode) {
      if (keyName == undefined) {
          keyName = 'C';
      }
      if (mode == undefined) {
          var lowerCase = keyName.toLowerCase();
          if (keyName == lowerCase) {
              mode = 'minor';
          } else {
              mode = 'major';
          }
      }

      var sharpsArray = "A-- E-- B-- F- C- G- D- A- E- B- F C G D A E B F# C# G# D# A# E# B#".split(" ");
      var sharpsIndex = sharpsArray.indexOf(keyName.toUpperCase());
      if (sharpsIndex == -1) {
          throw "Cannot find the key for " + keyName;
      }
      var modeShift = key.modeSharpsAlter[mode] || 0;
      var sharps = sharpsIndex + modeShift - 11;
      if (music21.debug) {
          console.log("Found sharps " + sharps + " for key: " + keyName);
      }
      key.KeySignature.call(this, sharps);
      this.tonic = keyName;
      this.mode = mode;
  };

  key.Key.prototype = new key.KeySignature();
  key.Key.prototype.constructor = key.Key;

  /**
   * returns a {@link music21.scale.ScaleSimpleMajor} or {@link music21.scale.ScaleSimpleMinor}
   * object from the pitch object.
   * 
   * @memberof music21.key.Key
   * @param {string|undefined} [scaleType=this.mode] - the type of scale, or the mode.
   * @returns {object} A music21.scale.Scale subclass.
   */
  key.Key.prototype.getScale = function (scaleType) {
      if (scaleType == undefined) {
          scaleType = this.mode;
      }
      var pitchObj = new pitch.Pitch(this.tonic);
      if (scaleType == 'major') {
          return scale.ScaleSimpleMajor(pitchObj);
      } else {
          return scale.ScaleSimpleMinor(pitchObj, scaleType);
      }
  };

  key.tests = function () {

      test("music21.key.Key", function () {
          var testSharps = [
          // sharps, mode, given name, given mode
          [0, 'minor', 'a'], [0, 'major', 'C'], [0, 'major'], [6, 'major', 'F#'], [3, 'minor', 'f#'], [6, 'major', 'f#', 'major'], [-2, 'major', 'B-'], [-5, 'minor', 'b-']];
          for (var i = 0; i < testSharps.length; i++) {
              var thisTest = testSharps[i];
              var expectedSharps = thisTest[0];
              var expectedMode = thisTest[1];
              var givenKeyName = thisTest[2];
              var givenMode = thisTest[3];
              var k = new music21.key.Key(givenKeyName, givenMode);
              var foundSharps = k.sharps;
              var foundMode = k.mode;
              equal(foundSharps, expectedSharps, "Test sharps: " + givenKeyName + " (mode: " + givenMode + ") ");
              equal(foundMode, expectedMode, "Test mode: " + givenKeyName + " (mode: " + givenMode + ") ");
          }

          var k = new music21.key.Key("f#");
          var s = k.getScale();
          equal(s[2].nameWithOctave, "A4", "test minor scale");
          equal(s[6].nameWithOctave, "E5");
          s = k.getScale('major');
          equal(s[2].nameWithOctave, "A#4", "test major scale");
          equal(s[6].nameWithOctave, "E#5");
          s = k.getScale("harmonic minor");
          equal(s[2].nameWithOctave, "A4", "test harmonic minor scale");
          equal(s[5].nameWithOctave, "D5");
          equal(s[6].nameWithOctave, "E#5");

          equal(k.width, 15, 'checking width is 5 * abs(sharps)');
      });
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/miditools -- A collection of tools for midi. See the namespace {@link music21.miditools}
   * 
   * Copyright (c) 2014, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   * @author Michael Scott Cuthbert
   */
  /**
   * A collection of tools for midi. See the namespace {@link music21.miditools}
   * 
   * @exports music21/miditools
   */
  /** 
   * Module that holds **music21** tools for connecting with MIDI.js and somewhat with the
   * events from the Jazz plugin or the WebMIDI protocol.
   * 
   * @namespace music21.miditools 
   * @memberof music21 
   */
  var miditools = {};

  /**
   * Number of octaves to transpose all incoming midi signals
   * 
   * @type {number}
   * @default 0
   */
  miditools.transposeOctave = 0;
  /**
   * @class Event 
   * @memberof music21.miditools
   * @param {number} t - timing information
   * @param {number} a - midi data 1 (N.B. a >> 4 = midiCommand )
   * @param {number} b - midi data 2
   * @param {number} c - midi data 3
   */
  miditools.Event = function (t, a, b, c) {
      this.timing = t;
      this.data1 = a;
      this.data2 = b;
      this.data3 = c;
      this.midiCommand = a >> 4;

      this.noteOff = this.midiCommand == 8;
      this.noteOn = this.midiCommand == 9;

      this.midiNote = undefined;
      if (this.noteOn || this.noteOff) {
          this.midiNote = this.data2 + 12 * miditools.transposeOctave;
          this.velocity = this.data3;
      }
  };

  /**
   * Calls MIDI.noteOn or MIDI.noteOff for the note
   * represented by the Event (if appropriate)
   * 
   * @memberof music21.miditools.Event
   * @returns {undefined}
   */
  miditools.Event.prototype.sendToMIDIjs = function () {
      if (MIDI.MIDI !== undefined) {
          if (this.noteOn) {
              MIDI.MIDI.noteOn(0, this.midiNote, this.velocity, 0);
          } else if (this.noteOff) {
              MIDI.MIDI.noteOff(0, this.midiNote, 0);
          }
      } else {
          console.warn('could not playback note because no MIDIout defined');
      }
  };
  /**
   * Makes a {@link music21.note.Note} object from the event's midiNote number.
   * 
   * @memberof music21.miditools.Event
   * @returns {music21.note.Note} - the {@link music21.note.Note} object represented by Event.midiNote
   */
  miditools.Event.prototype.music21Note = function () {
      var m21n = new note.Note();
      m21n.pitch.ps = this.midiNote;
      return m21n;
  };

  /**
   * How long to wait in milliseconds before deciding that a note belongs to another chord. Default 100ms
   * 
   * @memberof music21.miditools
   * @type {number}
   */
  miditools.maxDelay = 100; // in ms
  /**
   * At what time (in ms since Epoch) the chord started.
   * 
   * @memberof music21.miditools
   * @type {number}
   */
  miditools.heldChordTime = 0;
  /**
   * An Array (or undefined) of currently held chords that have not been sent out yet.
   * 
   * @memberof music21.miditools
   * @type {Array|undefined}
   */
  miditools.heldChordNotes = undefined;

  /**
   * When, in MS since Jan 1, 1970, was the last {@link music21.note.Note} played.
   * Defaults to the time that the module was loaded.
   * 
   * @memberof music21.miditools
   * @type {number}
   */
  miditools.timeOfLastNote = Date.now(); // in ms

  miditools._baseTempo = 60;
  /**
   * Assign (or query) a Metronome object to run all timing information.
   * 
   * @memberof music21.miditools
   * @type {music21.tempo.Metronome}
   */
  miditools.metronome = undefined;

  Object.defineProperties(miditools, {
      'tempo': {
          enumerable: true,
          get: function () {
              if (this.metronome === undefined) {
                  return this._baseTempo;
              } else {
                  return this.metronome.tempo;
              }
          },
          set: function (t) {
              if (this.metronome === undefined) {
                  this._baseTempo = t;
              } else {
                  this.metronome.tempo = t;
              }
          }
      }
  });

  /* --------- chords ------------- */
  /**
   *  Clears chords that are older than miditools.heldChordTime
   *  
   *  Runs a setTimeout on itself.
   *  Calls miditools.sendOutChord
   *  
   *  @memberof music21.miditools
   */
  miditools.clearOldChords = function () {
      // clear out notes that may be a chord...
      var nowInMs = Date.now(); // in ms
      if (miditools.heldChordTime + miditools.maxDelay < nowInMs) {
          miditools.heldChordTime = nowInMs;
          if (miditools.heldChordNotes !== undefined) {
              //console.log('to send out chords');
              miditools.sendOutChord(miditools.heldChordNotes);
              miditools.heldChordNotes = undefined;
          }
      }
      setTimeout(miditools.clearOldChords, miditools.maxDelay);
  };
  /**
   *  Take a series of jEvent noteOn objects and convert them to a single Chord object
   *  so long as they are all sounded within miditools.maxDelay milliseconds of each other.
   *  this method stores notes in miditools.heldChordNotes (Array).
   *  
   *  @param {music21.miditools.Event} jEvent 
   *  @memberof music21.miditools
   *  @returns undefined
   */
  miditools.makeChords = function (jEvent) {
      // jEvent is a miditools.Event object
      if (jEvent.noteOn) {
          var m21n = jEvent.music21Note();
          if (miditools.heldChordNotes === undefined) {
              miditools.heldChordNotes = [m21n];
          } else {
              for (var i = 0; i < miditools.heldChordNotes.length; i++) {
                  var foundNote = miditools.heldChordNotes[i];
                  if (foundNote.pitch.ps == m21n.pitch.ps) {
                      return; // no duplicates
                  }
              }
              miditools.heldChordNotes.push(m21n);
          }
      }
  };

  /**
   * The last Note or Chord to be sent out from miditools.  This is an important semi-global
   * attribute, since the last element may need to be quantized by quantizeLastNote() to
   * determine its length, since the note may need to be placed into a staff before its total
   * length can be determined.
   *  
   * @memberof music21.miditools
   * @type {music21.chord.Chord|music21.note.Note|undefined}
   */
  miditools.lastElement = undefined;

  /**
   * Take the list of Notes and makes a chord out of it, if appropriate and call 
   * {@link music21.webmidi.callBacks.sendOutChord} callback with the Chord or Note as a parameter.
   * 
   * @memberof music21.miditools
   * @param {Array<music21.note.Note>} chordNoteList - an Array of {@link music21.note.Note} objects
   * @returns {(music21.note.Note|music21.chord.Chord|undefined)} A {@link music21.chord.Chord} object, 
   * most likely, but maybe a {@link music21.note.Note} object)
   */
  miditools.sendOutChord = function (chordNoteList) {
      var appendObject;
      if (chordNoteList.length > 1) {
          //console.log(chordNoteList[0].name, chordNoteList[1].name);
          appendObject = new chord.Chord(chordNoteList);
      } else if (chordNoteList.length == 1) {
          appendObject = chordNoteList[0]; // note object
      } else {
          return undefined;
      }
      appendObject.stemDirection = 'noStem';
      miditools.quantizeLastNote();
      miditools.lastElement = appendObject;
      if (music21.webmidi.callBacks.sendOutChord !== undefined) {
          music21.webmidi.callBacks.sendOutChord(appendObject);
      } else {
          return appendObject;
      }
  };

  /**
   * Quantizes the lastElement (passed in) or music21.miditools.lastElement.
   * 
   * @memberof music21.miditools
   * @param {music21.note.GeneralNote} lastElement - A {@link music21.note.Note} to be quantized
   * @returns {music21.note.GeneralNote} The same {@link music21.note.Note} object passed in with 
   * duration quantized
   */
  miditools.quantizeLastNote = function (lastElement) {
      if (lastElement === undefined) {
          lastElement = this.lastElement;
          if (lastElement === undefined) {
              return;
          }
      }
      lastElement.stemDirection = undefined;
      var nowInMS = Date.now();
      var msSinceLastNote = nowInMS - this.timeOfLastNote;
      this.timeOfLastNote = nowInMS;
      var normalQuarterNoteLength = 1000 * 60 / this.tempo;
      var numQuarterNotes = msSinceLastNote / normalQuarterNoteLength;
      var roundedQuarterLength = Math.round(4 * numQuarterNotes) / 4;
      if (roundedQuarterLength >= 4) {
          roundedQuarterLength = 4;
      } else if (roundedQuarterLength >= 3) {
          roundedQuarterLength = 3;
      } else if (roundedQuarterLength > 2) {
          roundedQuarterLength = 2;
      } else if (roundedQuarterLength == 1.25) {
          roundedQuarterLength = 1;
      } else if (roundedQuarterLength == 0.75) {
          roundedQuarterLength = 0.5;
      } else if (roundedQuarterLength === 0) {
          roundedQuarterLength = 0.125;
      }
      lastElement.duration.quarterLength = roundedQuarterLength;
      return lastElement;
  };

  /* ----------- callbacks --------- */
  /**
   * Callback to midiEvent.sendToMIDIjs.
   * 
   * @memberof music21.miditools
   * @param {music21.miditools.Event} midiEvent - event to send out.
   * @returns undefined
   */
  miditools.sendToMIDIjs = function (midiEvent) {
      midiEvent.sendToMIDIjs();
  };

  /* ------------ MIDI.js ----------- */

  /**
   * a mapping of soundfont text names to true, false, or "loading".
   * 
   * @memberof music21.miditools
   * @type {object}
   */
  miditools.loadedSoundfonts = {};

  /**
   * Called after a soundfont has been loaded. The callback is better to be specified elsewhere
   * rather than overriding this important method.
   * 
   * @memberof music21.miditools
   * @param {String} soundfont The name of the soundfont that was just loaded
   * @param {function} callback A function to be called after the soundfont is loaded.
   */
  miditools.postLoadCallback = function (soundfont, callback) {
      // this should be bound to MIDI
      if (music21.debug) {
          console.log('soundfont loaded about to execute callback.');
          console.log('first playing two notes very softly -- seems to flush the buffer.');
      }
      jquery.$(".loadingSoundfont").remove();

      var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
      var isAudioTag = MIDI.MIDI.technology == 'HTML Audio Tag';
      var instrumentObj = music21.instrument.find(soundfont);
      if (instrumentObj !== undefined) {
          MIDI.MIDI.programChange(instrumentObj.midiChannel, instrumentObj.midiProgram);
          if (music21.debug) {
              console.log(soundfont + ' (' + instrumentObj.midiProgram + ') loaded on ', instrumentObj.midiChannel);
          }
          if (isFirefox === false && isAudioTag === false) {
              var c = instrumentObj.midiChannel;
              // Firefox ignores sound volume! so don't play! as does IE and others using HTML audio tag.
              MIDI.MIDI.noteOn(c, 36, 1, 0); // if no notes have been played before then
              MIDI.MIDI.noteOff(c, 36, 1, 0.1); // the second note to be played is always
              MIDI.MIDI.noteOn(c, 48, 1, 0.2); // very clipped (on Safari at least)
              MIDI.MIDI.noteOff(c, 48, 1, 0.3); // this helps a lot.
              MIDI.MIDI.noteOn(c, 60, 1, 0.3); // chrome needs three?
              MIDI.MIDI.noteOff(c, 60, 1, 0.4);
          }
      }
      if (callback !== undefined) {
          callback(instrumentObj);
      }
      miditools.loadedSoundfonts[soundfont] = true;
  };

  /**
   * method to load soundfonts while waiting for other processes that need them
   * to load first.    
   * 
   * @memberof music21.miditools
   * @param {String} soundfont The name of the soundfont that was just loaded
   * @param {function} callback A function to be called after the soundfont is loaded.
   * @example
   * s = new music21.stream.Stream();
   * music21.miditools.loadSoundfont(
   *     'clarinet', 
   *     function(i) { 
   *         console.log('instrument object', i, 'loaded');
   *         s.instrument = i;
   * });
   */
  miditools.loadSoundfont = function (soundfont, callback) {
      if (miditools.loadedSoundfonts[soundfont] === true) {
          if (callback !== undefined) {
              var instrumentObj = music21.instrument.find(soundfont);
              callback(instrumentObj);
          }
      } else if (miditools.loadedSoundfonts[soundfont] == 'loading') {
          var waitThenCall;
          waitThenCall = function () {
              if (miditools.loadedSoundfonts[soundfont] === true) {
                  if (music21.debug) {
                      console.log('other process has finished loading; calling callback');
                  }
                  if (callback !== undefined) {
                      var instrumentObj = music21.instrument.find(soundfont);
                      callback(instrumentObj);
                  }
              } else {
                  if (music21.debug) {
                      console.log('waiting for other process load');
                  }
                  setTimeout(waitThenCall, 100);
              }
          };
          waitThenCall();
      } else {
          miditools.loadedSoundfonts[soundfont] = "loading";
          if (music21.debug) {
              console.log('waiting for document ready');
          }
          jquery.$(document).ready(function () {
              if (music21.debug) {
                  console.log('document ready, waiting to load soundfont');
              }
              jquery.$(document.body).append(jquery.$("<div class='loadingSoundfont'><b>Loading MIDI Instrument</b>: " + "audio will begin when this message disappears.</div>"));
              MIDI.MIDI.loadPlugin({
                  soundfontUrl: music21.soundfontUrl,
                  instrument: soundfont,
                  onsuccess: miditools.postLoadCallback.bind(MIDI.MIDI, soundfont, callback)
              });
          });
      }
  };

  /**
   * MidiPlayer -- embedded midi player.
   * 
   * @class MidiPlayer
   * @memberOf music21.miditools
   * @property {number} speed - playback speed scaling (1=default).
   * @property {JQueryDOMObject|undefined} $playDiv - div holding the player, 
   */
  miditools.MidiPlayer = function () {
      this.player = new music21.MIDI.Players.PlayInstance();
      this.speed = 1.0;
      this.$playDiv = undefined;
  };

  /**
   * @param where
   * @returns DOMElement
   */
  miditools.MidiPlayer.prototype.addPlayer = function (where) {
      var $where = where;
      if (where === undefined) {
          where = document.body;
      }
      if (where.jquery === undefined) {
          $where = jquery.$(where);
      }
      var $playDiv = jquery.$('<div class="midiPlayer">');
      var $controls = jquery.$('<div class="positionControls">');
      var $playPause = jquery.$('<input type="image" src="' + music21.m21basePath + '/css/play.png" align="absmiddle" value="play" class="playPause">');
      var $stop = jquery.$('<input type="image" src="' + music21.m21basePath + '/css/stop.png" align="absmiddle" value="stop" class="stopButton">');

      $playPause.on('click', this.pausePlayStop.bind(this));
      $stop.on('click', this.stopButton.bind(this));
      $controls.append($playPause);
      $controls.append($stop);
      $playDiv.append($controls);

      var $time = jquery.$('<div class="timeControls">');
      var $timePlayed = jquery.$('<span class="timePlayed">0:00</span>');
      var $capsule = jquery.$('<span class="capsule"><span class="cursor"></span></span>');
      var $timeRemaining = jquery.$('<span class="timeRemaining">-0:00</span>');
      $time.append($timePlayed);
      $time.append($capsule);
      $time.append($timeRemaining);
      $playDiv.append($time);

      $where.append($playDiv);
      this.$playDiv = $playDiv;
      return $playDiv;
  };

  miditools.MidiPlayer.prototype.stopButton = function () {
      this.pausePlayStop("yes");
  };

  miditools.MidiPlayer.prototype.pausePlayStop = function (stop) {
      var d = undefined;
      if (this.$playDiv === undefined) {
          d = { src: 'doesnt matter' };
      } else {
          d = this.$playDiv.find(".playPause")[0];
      }
      if (stop == "yes") {
          this.player.stop();
          d.src = music21.m21basePath + "/css/play.png";
      } else if (this.player.playing || stop == 'pause') {
          d.src = music21.m21basePath + "/css/play.png";
          this.player.pause(true);
      } else {
          d.src = music21.m21basePath + "/css/pause.png";
          this.player.resume();
      }
  };

  miditools.MidiPlayer.prototype.base64Load = function (b64data) {
      var player = this.player;
      player.timeWarp = this.speed;

      var m21midiplayer = this;
      miditools.loadSoundfont('acoustic_grand_piano', function () {
          player.loadFile(b64data, function () {
              // success
              m21midiplayer.fileLoaded();
          }, undefined, // loading
          function (e) {
              // failure
              console.log(e);
          });
      });
  };

  miditools.MidiPlayer.prototype.songFinished = function () {
      this.pausePlayStop("yes");
  };

  miditools.MidiPlayer.prototype.fileLoaded = function () {
      this.updatePlaying();
  };

  miditools.MidiPlayer.prototype.startAndUpdate = function () {
      this.player.start();
      this.updatePlaying();
  };

  miditools.MidiPlayer.prototype.updatePlaying = function () {
      var self = this;
      var player = this.player;
      if (this.$playDiv === undefined) {
          return;
      }
      var $d = this.$playDiv;
      // update the timestamp
      var timePlayed = $d.find(".timePlayed")[0];
      var timeRemaining = $d.find(".timeRemaining")[0];
      var timeCursor = $d.find(".cursor")[0];
      var $capsule = $d.find(".capsule");
      //
      eventjs.add($capsule[0], "drag", function (event, self) {
          eventjs.cancel(event);
          var player = this.player;
          player.currentTime = self.x / 420 * player.endTime;
          if (player.currentTime < 0) {
              player.currentTime = 0;
          }
          if (player.currentTime > player.endTime) {
              player.currentTime = player.endTime;
          }
          if (self.state === "down") {
              this.pausePlayStop('pause');
          } else if (self.state === "up") {
              this.pausePlayStop('play');
          }
      }.bind(this));
      //
      function timeFormatting(n) {
          var minutes = n / 60 >> 0;
          var seconds = String(n - minutes * 60 >> 0);
          if (seconds.length == 1) seconds = "0" + seconds;
          return minutes + ":" + seconds;
      }

      player.setAnimation(function (data) {
          var percent = data.now / data.end;
          var now = data.now >> 0; // where we are now
          var end = data.end >> 0; // end of song
          if (now === end) {
              // go to next song
              self.songFinished();
          }
          // display the information to the user
          timeCursor.style.width = percent * 100 + "%";
          timePlayed.innerHTML = timeFormatting(now);
          timeRemaining.innerHTML = "-" + timeFormatting(end - now);
      });
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/keyboard -- PianoKeyboard rendering and display objects
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */

  // Minimum usage:

  // var kd = document.getElementById('keyboardDiv');
  // k = new music21.keyboard.Keyboard();
  // k.appendKeyboard(kd, 6, 57); // 88 key keyboard

  // configurable:
  // k.scaleFactor = 1.2;  // default 1
  // k.whiteKeyWidth = 40; // default 23

  /**
   * Keyboard module, see {@link music21.keyboard} namespace
   * 
   * @exports music21/keyboard
   */
  /**
   * keyboard namespace -- tools for creating an onscreen keyboard and interacting with it.
   * 
   * @namespace music21.keyboard
   * @memberof music21
   * @requires music21/base
   * @requires music21/pitch
   * @requires music21/common
   * @requires music21/miditools
   * @requires jquery
   * @requires MIDI
   */
  var keyboard = {};
  /**
   * Represents a single Key
   * 
   * @class Key
   * @memberof music21.keyboard
   * @property {Array<function>} callbacks - called when key is clicked/selected
   * @property {number} [scaleFactor=1]
   * @property {music21.keyboard.Keyboard|undefined} parent
   * @property {Int} id - midinumber associated with the key.
   * @property {music21.pitch.Pitch|undefined} pitchObj
   * @property {DOMObject|undefined} svgObj - SVG representing the drawing of the key
   * @property {DOMObject|undefined} noteNameSvgObj - SVG representing the note name drawn on the key
   * @property {string} keyStyle='' - css style information for the key
   * @property {string} keyClass='' - css class information for the key ("keyboardkey" + this is the class)
   * @property {number} width - width of key
   * @property {number} height - height of key
   */
  keyboard.Key = function () {
      this.classes = ['Key']; // name conflict with key.Key
      this.callbacks = [];
      this.scaleFactor = 1;
      this.parent = undefined;
      this.id = 0;
      this.width = 23;
      this.height = 120;
      this.pitchObj = undefined;
      this.svgObj = undefined;
      this.noteNameSvgObj = undefined;
      this.keyStyle = '';
      this.keyClass = '';

      /**
       * Gets an SVG object for the key
       * 
       * @method music21.keyboard.Key#makeKey
       * @memberof music21.keyboard.Key
       * @param {number} startX - X position in pixels from left of keyboard to draw key at
       * @returns {DOMObject} a SVG rectangle for the key
       */
      this.makeKey = function (startX) {
          keyattrs = {
              style: this.keyStyle,
              x: startX,
              y: 0,
              'class': 'keyboardkey ' + this.keyClass,
              'id': this.id,
              width: this.width * this.scaleFactor,
              height: this.height * this.scaleFactor
          };
          var keyDOM = common.makeSVGright('rect', keyattrs);
          for (var x in this.callbacks) {
              keyDOM.addEventListener(x, this.callbacks[x], false);
          }
          this.svgObj = keyDOM;
          return keyDOM;
      };
      /**
       * Adds a circle (red) on the key (to mark middle C etc.)
       * 
       * @method music21.keyboard.Key#addCircle
       * @param {string} [strokeColor='red']
       * @returns {DOMObject}
       */
      this.addCircle = function (strokeColor) {
          if (this.svgObj === undefined || this.parent === undefined || this.parent.svgObj === undefined) {
              return;
          }
          if (strokeColor === undefined) {
              strokeColor = 'red';
          }
          var x = parseInt(this.svgObj.getAttribute('x'));
          var cx = x + this.parent.scaleFactor * this.width / 2;
          //console.log('cx', cx);
          keyattrs = {
              stroke: strokeColor,
              'stroke-width': 3,
              fill: 'none',
              cx: cx,
              cy: (this.height - 10) * this.parent.scaleFactor,
              'class': 'keyboardkeyannotation',
              r: this.width * this.parent.scaleFactor / 4
          };

          var circleDom = common.makeSVGright('circle', keyattrs);
          this.parent.svgObj.appendChild(circleDom);
          //console.log(circleDom);
          return circleDom;
      };
      /**
       * Adds the note name on the key 
       * 
       * @method music21.keyboard.Key#addNoteName
       * @param {Boolean} [labelOctaves=false] - use octave numbers too?
       * @returns {DOMObject}
       */
      this.addNoteName = function (labelOctaves) {
          if (this.svgObj === undefined || this.parent === undefined || this.parent.svgObj === undefined) {
              return;
          }
          if (this.id == 0 && this.pitchObj === undefined) {
              return;
          } else if (this.pitchObj === undefined) {
              this.pitchObj = new pitch.Pitch();
              this.pitchObj.ps = this.id;
          }
          if (this.pitchObj.accidental !== undefined && this.pitchObj.accidental.alter != 0) {
              return;
          }
          var x = parseInt(this.svgObj.getAttribute('x'));
          var idStr = this.pitchObj.name;
          var fontSize = 14;
          if (labelOctaves == true) {
              idStr = this.pitchObj.nameWithOctave;
              fontSize = 12;
              x -= 2;
          }
          fontSize = Math.floor(fontSize * parent.scaleFactor);

          var textfill = 'white';
          if (this.keyClass == 'whitekey') {
              textfill = 'black';
          }
          textattrs = {
              fill: textfill,
              x: x + this.parent.scaleFactor * (this.width / 2 - 5),
              y: this.parent.scaleFactor * (this.height - 20),
              'class': 'keyboardkeyname',
              'font-size': fontSize
          };

          var textDom = common.makeSVGright('text', textattrs);
          var textNode = document.createTextNode(idStr);
          textDom.appendChild(textNode);
          this.noteNameSvgObj = textDom; // store for removing...
          this.parent.svgObj.appendChild(textDom);
      };
      /**
       * Removes the note name from the key (if exists)
       * 
       * @method music21.keyboard.Key#removeNoteName
       * @returns {undefined}
       */
      this.removeNoteName = function () {
          if (this.svgObj === undefined || this.parent === undefined || this.parent.svgObj === undefined) {
              return;
          }
          if (this.noteNameSvgObj === undefined) {
              return;
          }
          if (this.noteNameSvgObj.parentNode == this.parent.svgObj) {
              this.parent.svgObj.removeChild(this.noteNameSvgObj);
          }
          this.noteNameSvgObj = undefined;
      };
  };

  /**
   * Defaults for a WhiteKey (width, height, keyStyle, keyClass)
   * 
   * @class WhiteKey
   * @memberof music21.keyboard
   * @extends music21.keyboard.Key
   */
  keyboard.WhiteKey = function () {
      keyboard.Key.call(this);
      this.classes.push('WhiteKey');
      this.width = 23;
      this.height = 120;
      this.keyStyle = 'fill:#fffff6;stroke:black';
      this.keyClass = 'whitekey';
  };
  keyboard.WhiteKey.prototype = new keyboard.Key();
  keyboard.WhiteKey.prototype.constructor = keyboard.WhiteKey;

  /**
   * Defaults for a BlackKey (width, height, keyStyle, keyClass)
   * 
   * @class BlackKey
   * @memberof music21.keyboard
   * @extends music21.keyboard.Key
   */
  keyboard.BlackKey = function () {
      keyboard.Key.call(this);
      this.classes.push('BlackKey');
      this.width = 13;
      this.height = 80;
      this.keyStyle = 'fill:black;stroke:black';
      this.keyClass = 'blackkey';
  };
  keyboard.BlackKey.prototype = new keyboard.Key();
  keyboard.BlackKey.prototype.constructor = keyboard.BlackKey;

  /**
   * A Class representing a whole Keyboard full of keys.
   * 
   * @class Keyboard
   * @memberof music21.keyboard
   * @property {number} whiteKeyWidth - default 23
   * @property {number} scaleFactor - default 1
   * @property {object} keyObjects - a mapping of id to {@link music21.keyboard.Key} objects
   * @property {DOMObject} svgObj - the SVG object of the keyboard
   * @property {Boolean} markC - default true
   * @property {Boolean} showNames - default false
   * @property {Boolean} showOctaves - default false
   * @property {string} startPitch - default "C3"
   * @property {string} endPitch - default "C5"
   * @property {Boolean} hideable - default false -- add a way to hide and show keyboard
   * @property {Boolean} scrollable - default false -- add scroll bars to change octave
   */
  keyboard.Keyboard = function () {
      this.whiteKeyWidth = 23;
      this._defaultWhiteKeyWidth = 23;
      this._defaultBlackKeyWidth = 13;
      this.scaleFactor = 1;
      this.height = 120; // does nothing right now...
      this.keyObjects = {};
      this.svgObj = undefined;

      this.markC = true;
      this.showNames = false;
      this.showOctaves = false;

      this.startPitch = "C3";
      this.endPitch = "C5";
      this._startDNN = undefined;
      this._endDNN = undefined;

      this.hideable = false;
      this.scrollable = false;

      /**
       * Redraws the SVG associated with this Keyboard
       * 
       * @method music21.keyboard.Keyboard#redrawSVG
       * @returns {DOMObject} new svgDOM
       */
      this.redrawSVG = function () {
          if (this.svgObj === undefined) {
              return;
          }
          var oldSVG = this.svgObj;
          var svgParent = oldSVG.parentNode;
          this.keyObjects = {};
          var svgDOM = this.createSVG();
          svgParent.replaceChild(svgDOM, oldSVG);
          return svgDOM;
      };

      /**
       * Appends a keyboard to the `where` parameter
       * 
       * @method music21.keyboard.Keyboard#appendKeyboard
       * @param {JQueryDOMObject|DOMObject} [where] 
       * @returns {music21.keyboard.Keyboard} this
       */
      this.appendKeyboard = function (where) {
          if (where === undefined) {
              where = document.body;
          } else if (where.jquery !== undefined) {
              where = where[0];
          }

          svgDOM = this.createSVG();

          if (this.scrollable) {
              svgDOM = this.wrapScrollable(svgDOM)[0];
          }

          if (this.hideable) {
              // make it so the keyboard can be shown or hidden...
              this.appendHideableKeyboard(where, svgDOM);
          } else {
              where.appendChild(svgDOM); // svg must use appendChild, not append.
          }
          return this;
      };

      /**
       * An object of callbacks on events.
       * 
       * default:
       * 
       * - click: this.clickhandler
       * 
       * @name callbacks
       * @type {object}
       * @memberof music21.keyboard.Keyboard#
       */
      this.callbacks = {
          click: this.clickhandler
      };
      /**
       * Handle a click on a given SVG object
       * 
       * @method music21.keyboard.Keyboard#clickhandler
       * @param {DOMObject} keyRect - the dom object with the keyboard.
       */
      this.clickhandler = function (keyRect) {
          // to-do : integrate with jazzHighlight...
          var id = keyRect.id;
          var thisKeyObject = this.keyObjects[id];
          if (thisKeyObject === undefined) {
              return; // not on keyboard;
          }
          var storedStyle = thisKeyObject.keyStyle;
          var fillColor = '#c0c000';
          if (thisKeyObject.keyClass == 'whitekey') {
              fillColor = 'yellow';
          }
          keyRect.setAttribute("style", "fill:" + fillColor + ";stroke:black");
          miditools.loadSoundfont('acoustic_grand_piano', function (i) {
              MIDI.MIDI.noteOn(i.midiChannel, id, 100, 0);
              MIDI.MIDI.noteOff(i.midiChannel, id, 500);
          });
          setTimeout(function () {
              keyRect.setAttribute("style", storedStyle);
          }, 500);
      };

      //   more accurate offsets from http://www.mathpages.com/home/kmath043.htm
      this.sharpOffsets = { 0: 14.3333, 1: 18.6666, 3: 13.25, 4: 16.25, 5: 19.75 };
      /**
       * Draws the SVG associated with this Keyboard
       * 
       * @method music21.keyboard.Keyboard#createSVG
       * @returns {DOMObject} new svgDOM
       */
      this.createSVG = function () {
          // DNN = pitch.diatonicNoteNum;
          // this._endDNN = final key note. I.e., the last note to be included, not the first note not included.
          // 6, 57 gives a standard 88-key keyboard;
          if (this._startDNN === undefined) {
              if (typeof this.startPitch == 'string') {
                  var tempP = new music21.pitch.Pitch(this.startPitch);
                  this._startDNN = tempP.diatonicNoteNum;
              } else {
                  this._startDNN = this.startPitch;
              }
          }

          if (this._endDNN === undefined) {
              if (typeof this.endPitch == 'string') {
                  var tempP = new music21.pitch.Pitch(this.endPitch);
                  this._endDNN = tempP.diatonicNoteNum;
              } else {
                  this._endDNN = this.endPitch;
              }
          }

          var currentIndex = (this._startDNN - 1) % 7; // C = 0
          var keyboardDiatonicLength = 1 + this._endDNN - this._startDNN;
          var totalWidth = this.whiteKeyWidth * this.scaleFactor * keyboardDiatonicLength;
          var height = 120 * this.scaleFactor;
          var heightString = height.toString() + 'px';

          var svgDOM = common.makeSVGright('svg', {
              'xml:space': 'preserve',
              'height': heightString,
              'width': totalWidth.toString() + 'px',
              'class': 'keyboardSVG'
          });
          var movingPitch = new pitch.Pitch("C4");
          var blackKeys = [];
          var thisKeyboardObject = this;

          for (var wki = 0; wki < keyboardDiatonicLength; wki++) {
              movingPitch.diatonicNoteNum = this._startDNN + wki;
              var wk = new keyboard.WhiteKey();
              wk.id = movingPitch.midi;
              wk.parent = this;
              this.keyObjects[movingPitch.midi] = wk;
              wk.scaleFactor = this.scaleFactor;
              wk.width = this.whiteKeyWidth;
              wk.callbacks.click = function () {
                  thisKeyboardObject.clickhandler(this);
              };

              var wkSVG = wk.makeKey(this.whiteKeyWidth * this.scaleFactor * wki);
              svgDOM.appendChild(wkSVG);

              if ((currentIndex == 0 || currentIndex == 1 || currentIndex == 3 || currentIndex == 4 || currentIndex == 5) && wki != keyboardDiatonicLength - 1) {
                  // create but do not append blackkey to the right of whitekey
                  var bk = new keyboard.BlackKey();
                  bk.id = movingPitch.midi + 1;
                  this.keyObjects[movingPitch.midi + 1] = bk;
                  bk.parent = this;

                  bk.scaleFactor = this.scaleFactor;
                  bk.width = this._defaultBlackKeyWidth * this.whiteKeyWidth / this._defaultWhiteKeyWidth;
                  bk.callbacks.click = function () {
                      thisKeyboardObject.clickhandler(this);
                  };

                  var offsetFromWhiteKey = this.sharpOffsets[currentIndex];
                  offsetFromWhiteKey = this.whiteKeyWidth / this._defaultWhiteKeyWidth * this.scaleFactor * offsetFromWhiteKey;
                  var bkSVG = bk.makeKey(this.whiteKeyWidth * this.scaleFactor * wki + offsetFromWhiteKey);
                  blackKeys.push(bkSVG);
              }
              currentIndex += 1;
              currentIndex = currentIndex % 7;
          }
          // append blackkeys later since they overlap white keys;
          for (var bki = 0; bki < blackKeys.length; bki++) {
              svgDOM.appendChild(blackKeys[bki]);
          }

          this.svgObj = svgDOM;
          if (this.markC) {
              this.markMiddleC();
          }
          if (this.showNames) {
              this.markNoteNames(this.showOctaves);
          }

          return svgDOM;
      };

      /**
       * Puts a circle on middle c.
       * 
       * @method music21.keyboard.Keyboard#markMiddleC
       * @param {string} [strokeColor='red']
       */
      this.markMiddleC = function (strokeColor) {
          var midC = this.keyObjects[60];
          if (midC !== undefined) {
              midC.addCircle('red');
          }
      };
      /**
       * Puts note names on every white key.
       * 
       * @method music21.keyboard.Keyboard#markNoteNames
       * @param {Boolean} [labelOctaves=false]
       */
      this.markNoteNames = function (labelOctaves) {
          this.removeNoteNames(); // in case...
          for (var midi in this.keyObjects) {
              var keyObj = this.keyObjects[midi];
              keyObj.addNoteName(labelOctaves);
          }
      };

      /**
       * Remove note names on the keys, if they exist
       * 
       * @method music21.keyboard.Keyboard#removeNoteNames
       */
      this.removeNoteNames = function () {
          for (var midi in this.keyObjects) {
              var keyObj = this.keyObjects[midi];
              keyObj.removeNoteName();
          }
      };

      /**
       * Wraps the SVG object inside a scrollable set of buttons
       * 
       * Do not call this directly, just use createSVG after changing the
       * scrollable property on the keyboard to True.
       * 
       * @method music21.keyboard.Keyboard#wrapScrollable
       * @param {DOMObject} svgDOM
       * @returns {JQueryDOMObject} 
       */
      this.wrapScrollable = function (svgDOM) {
          var $wrapper = jquery.$("<div class='keyboardScrollableWrapper'></div>").css({
              display: "inline-block"
          });
          var $bDown = jquery.$("<button class='keyboardOctaveDown'>&lt;&lt;</button>").css({
              'font-size': Math.floor(this.scaleFactor * 15).toString() + 'px'
          }).bind('click', function () {
              music21.miditools.transposeOctave -= 1;
              this._startDNN -= 7;
              this._endDNN -= 7;
              this.redrawSVG();
          }.bind(this));
          var $bUp = jquery.$("<button class='keyboardOctaveUp'>&gt;&gt;</button>").css({
              'font-size': Math.floor(this.scaleFactor * 15).toString() + 'px'
          }).bind('click', function () {
              music21.miditools.transposeOctave += 1;
              this._startDNN += 7;
              this._endDNN += 7;
              this.redrawSVG();
          }.bind(this));
          var $kWrapper = jquery.$("<div style='display:inline-block; vertical-align: middle' class='keyboardScrollableInnerDiv'></div>");
          $kWrapper[0].appendChild(svgDOM);
          $wrapper.append($bDown);
          $wrapper.append($kWrapper);
          $wrapper.append($bUp);
          return $wrapper;
      };

      /**
       * Puts a hideable keyboard inside a Div with the proper controls.
       * 
       * Do not call this directly, just use createSVG after changing the
       * hideable property on the keyboard to True.
       * 
       * @method music21.keyboard.Keyboard#appendHideableKeyboard
       * @param {DOMObject} where
       * @param {DOMObject} keyboardSVG
       */
      this.appendHideableKeyboard = function (where, keyboardSVG) {
          var $container = jquery.$("<div class='keyboardHideableContainer'/>");
          var $bInside = jquery.$("<div class='keyboardToggleInside'>↥</div>").css({
              display: 'inline-block',
              'padding-top': '40px',
              'font-size': '40px'
          });
          var $b = jquery.$("<div class='keyboardToggleOutside'/>").css({
              display: 'inline-block',
              'vertical-align': 'top',
              background: 'white'
          });
          $b.append($bInside);
          $b.data('defaultDisplay', $container.find('.keyboardSVG').css('display'));
          $b.data('state', 'down');
          $b.click(keyboard.triggerToggleShow);
          var $explain = jquery.$("<div class='keyboardExplain'>Show keyboard</div>").css({
              'display': 'none',
              'background-color': 'white',
              'padding': '10px 10px 10px 10px',
              'font-size': '12pt'
          });
          $b.append($explain);
          $container.append($b);
          $container[0].appendChild(keyboardSVG); // svg must use appendChild, not append.
          jquery.$(where).append($container);
          return $container;
      };
  };

  /**
   * triggerToggleShow -- event for keyboard is shown or hidden.
   * 
   * @function music21.keyboard.triggerToggleShow
   * @param {Event} e
   */
  keyboard.triggerToggleShow = function (e) {
      // "this" refers to the object clicked
      // e -- event is not used.
      var $t = jquery.$(this);
      var state = $t.data('state');
      var $parent = $t.parent();
      var $k = $parent.find('.keyboardScrollableWrapper');
      if ($k.length == 0) {
          // not scrollable
          $k = $parent.find('.keyboardSVG');
      }
      var $bInside = $t.find('.keyboardToggleInside');
      var $explain = $parent.find('.keyboardExplain');
      if (state == 'up') {
          $bInside.text('↥');
          $bInside.css('padding-top', '40px');
          $explain.css('display', 'none');
          var dd = $t.data('defaultDisplay');
          if (dd === undefined) {
              dd = 'inline';
          }
          $k.css('display', dd);
          $t.data('state', 'down');
      } else {
          $k.css('display', 'none');
          $explain.css('display', 'inline-block');
          $bInside.text('↧');
          $bInside.css('padding-top', '10px');
          $t.data('state', 'up');
      }
  };

  /**
   * highlight the keyboard stored in "this" appropriately
   * 
   * @function music21.keyboard.jazzHighlight
   * @param {Event} e
   * @example
   * var midiCallbacksPlay = [music21.miditools.makeChords, 
   *                          music21.miditools.sendToMIDIjs,
   *                          music21.keyboard.jazzHighlight.bind(k)];
   */
  keyboard.jazzHighlight = function (e) {
      // e is a miditools.event object -- call with this = keyboard.Keyboard object via bind...
      if (e === undefined) {
          return;
      }
      if (e.noteOn) {
          var midiNote = e.midiNote;
          if (this.keyObjects[midiNote] !== undefined) {
              var keyObj = this.keyObjects[midiNote];
              var svgObj = keyObj.svgObj;
              var intensityRGB = "";
              var normalizedVelocity = (e.velocity + 25) / 127;
              if (normalizedVelocity > 1) {
                  normalizedVelocity = 1.0;
              }

              if (keyObj.keyClass == 'whitekey') {
                  var intensity = normalizedVelocity.toString();
                  intensityRGB = 'rgba(255, 255, 0, ' + intensity + ')';
              } else {
                  var intensity = Math.floor(normalizedVelocity * 255).toString();
                  intensityRGB = 'rgb(' + intensity + ',' + intensity + ',0)';
                  //console.log(intensityRGB);
              }
              svgObj.setAttribute('style', 'fill:' + intensityRGB + ';stroke:black');
          }
      } else if (e.noteOff) {
          var midiNote = e.midiNote;
          if (this.keyObjects[midiNote] !== undefined) {
              var keyObj = this.keyObjects[midiNote];
              var svgObj = keyObj.svgObj;
              svgObj.setAttribute('style', keyObj.keyStyle);
          }
      }
  }; // call this with a bind(keyboard.Keyboard object)...

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/renderOptions -- an object that defines the render options for a Stream
   * 
   * note: no parallel in music21p
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */

  /**
   * renderOptions module, see {@link music21.renderOptions}
   * 
   * @exports music21/renderOptions
   */
  /**
   * Options for rendering a stream
   * 
   * @namespace music21.renderOptions
   * @memberof music21
   */
  var renderOptions = {};

  /**
   * An object that contains information on rendering the current stream
   * 
   * Found on every Stream as `.renderOptions`
   * 
   * @class RenderOptions
   * @memberof music21.renderOptions
   */
  renderOptions.RenderOptions = function () {
  	return {
  		displayClef: true,
  		displayTimeSignature: true,
  		displayKeySignature: true,

  		scaleFactor: { x: 0.7, y: 0.7 },

  		top: 0,
  		left: undefined,
  		width: undefined,
  		overriddenWidth: undefined,
  		height: undefined,
  		naiveHeight: 120,

  		systemIndex: 0,
  		partIndex: 0,
  		measureIndex: 0,

  		systemMeasureIndex: 0,
  		systemPadding: undefined,
  		naiveSystemPadding: 40,

  		stemDirection: undefined,

  		maxSystemWidth: undefined,
  		rightBarline: undefined,
  		staffLines: 5,
  		staffConnectors: ['single', 'brace'],
  		staffPadding: 60,
  		events: {
  			'click': 'play',
  			'dblclick': undefined
  		},
  		startNewSystem: false,
  		startNewPage: false,
  		showMeasureNumber: undefined
  	};
  };

  /**
   * for rendering vexflow. Will eventually go to music21/converter/vexflow
   * 
   * See {@link music21.vfShow} namespace for details
   * 
   * @exports music21/vfShow
   */
  /**
   * Vexflow display related objects and methods.
   * 
   * @namespace music21.vfShow
   * @memberof music21
   * @requires music21/common
   * @requires vexflow
   */
  var vfShow = {};

  /**
   * Represents a stack of objects that need to be rendered together.
   * 
   * An intermediary state for showing created by {@link music21.vfShow.Renderer}.
   * 
   * @class RenderStack
   * @memberof music21.vfShow
   * @property {Array<Vex.Flow.Voice>} voices - Vex.Flow.Voice objects
   * @property {Array<music21.stream.Stream>} streams - {@link music21.stream.Stream} objects associated with the voices
   * @property {Array} textVoices - Vex.Flow.Voice objects for the text.
   */
  vfShow.RenderStack = function () {
      this.voices = [];
      this.streams = [];
      this.textVoices = [];
  };

  /**
   * @memberof music21.vfShow.RenderStack
   * @returns {Array} this.voices and this.textVoices as one array
   */
  vfShow.RenderStack.prototype.allTickables = function () {
      var t = [];
      t.push.apply(t, this.voices);
      t.push.apply(t, this.textVoices);
      return t;
  };

  /**
   * Renderer is a function that takes a stream, an
   * optional existing canvas element and a DOM
   * element where the canvas element should be placed
   * and renders the stream as Vexflow on the
   * canvas element, placing it then in the where
   * DOM.
   * 
   * "s" can be any type of Stream.
   * 
   * "canvas" and "where" can be either a DOM
   * element or a jQuery object.
   * 
   * @class Renderer
   * @memberof music21.vfShow
   * @param {music21.stream.Stream} s - main stream to render
   * @param {canvas} [canvas] - existing canvas element
   * @param {DOMObject|jQueryDOMObject} [where=document.body] - where to render the stream
   * @property {Vex.Flow.Renderer} vfRenderer - a Vex.Flow.Renderer to use (will create if not existing)
   * @property {Vex.Flow.Context} ctx - a Vex.Flow.Context (Canvas or Raphael [not yet]) to use.
   * @property {canvas} canvas - canvas element
   * @property {jQueryDOMObject} $canvas - jQuery canvas element
   * @property {jQueryDOMObject} $where - jQuery element to render onto
   * @property {Vex.Flow.Formatter} activeFormatter - formatter
   * @property {Array<Vex.Flow.Beam>} beamGroups - beamGroups
   * @property {Array<Vex.Flow.StaveTie>} ties - ties
   * @property {Array<number>} systemBreakOffsets - where to break the systems
   * @property {Array<Vex.Flow.Tuplet>} vfTuplets - tuplets represented in Vexflow
   * @property {Array<music21.vfShow.RenderStack>} stacks - array of RenderStack objects
   */
  vfShow.Renderer = function (s, canvas, where) {
      this.stream = s;
      //this.streamType = s.classes[-1];

      this.canvas = undefined;
      this.$canvas = undefined;
      this.$where = undefined;
      this.activeFormatter = undefined;
      this._vfRenderer = undefined;
      this._ctx = undefined;
      this.beamGroups = [];
      this.stacks = []; // an Array of RenderStacks: {voices: [Array of Vex.Flow.Voice objects],
      //                            streams: [Array of Streams, usually Measures]}
      this.ties = [];
      this.systemBreakOffsets = [];
      this.vfTuplets = [];
      //this.measureFormatters = [];

      Object.defineProperties(this, {
          'vfRenderer': {
              get: function () {
                  if (this._vfRenderer !== undefined) {
                      return this._vfRenderer;
                  } else {
                      this._vfRenderer = new vexflow.Vex.Flow.Renderer(this.canvas, vexflow.Vex.Flow.Renderer.Backends.CANVAS);
                      return this._vfRenderer;
                  }
              },
              set: function (vfr) {
                  this._vfRenderer = vfr;
              }
          },
          'ctx': {
              get: function () {
                  if (this._ctx !== undefined) {
                      return this._ctx;
                  } else {
                      this._ctx = this.vfRenderer.getContext();
                      if (this.stream && this.stream.renderOptions) {
                          this._ctx.scale(this.stream.renderOptions.scaleFactor.x, this.stream.renderOptions.scaleFactor.y);
                      }
                      return this._ctx;
                  }
              },
              set: function (ctx) {
                  this._ctx = ctx;
              }
          }
      });

      if (where !== undefined) {
          if (where.jquery !== undefined) {
              this.$where = where;
          } else {
              this.$where = $(where);
          }
      }
      if (canvas !== undefined) {
          if (canvas.jquery !== undefined) {
              this.$canvas = canvas;
              this.canvas = canvas[0];
          } else {
              this.canvas = canvas;
              this.$canvas = $(canvas);
          }
      }
  };

  /**
   * 
   * main function to render a Stream.
   * 
   * if s is undefined, uses the stored Stream from
   * the constructor object.
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} [s=this.stream]
   */
  vfShow.Renderer.prototype.render = function (s) {
      if (s === undefined) {
          s = this.stream;
      }

      var isScorelike = false;
      var isPartlike = false;
      var hasSubStreams = s.hasSubStreams();

      if (s.isClassOrSubclass('Score')) {
          isScorelike = true;
      } else if (hasSubStreams && s.get(0).hasSubStreams()) {
          isScorelike = true;
      } else if (hasSubStreams) {
          isPartlike = true;
      }
      // requires organization Score -> Part -> Measure -> elements...
      if (isScorelike) {
          this.prepareScorelike(s);
      } else if (isPartlike) {
          this.preparePartlike(s);
      } else {
          this.prepareArrivedFlat(s);
      }
      this.formatMeasureStacks();
      this.drawTies();
      this.drawMeasureStacks();
      this.drawBeamGroups();
      this.drawTuplets();
  };

  /**
   * Prepares a scorelike stream (i.e., one with parts or
   * Streams that should be rendered vertically like parts)
   * for rendering and adds Staff Connectors
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Score} s - prepare a stream of parts (i.e., Score)
   */
  vfShow.Renderer.prototype.prepareScorelike = function (s) {
      //console.log('prepareScorelike called');
      for (var i = 0; i < s.length; i++) {
          var subStream = s.get(i);
          this.preparePartlike(subStream);
      }
      this.addStaffConnectors(s);
  };

  /**
   * 
   * Prepares a Partlike stream (that is one with Measures
   * or substreams that should be considered like Measures)
   * for rendering.
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Part} p
   */
  vfShow.Renderer.prototype.preparePartlike = function (p) {
      //console.log('preparePartlike called');
      this.systemBreakOffsets = [];
      for (var i = 0; i < p.length; i++) {
          var subStream = p.get(i);
          if (subStream.renderOptions.startNewSystem) {
              this.systemBreakOffsets.push(subStream.offset);
          }
          if (i == p.length - 1) {
              subStream.renderOptions.rightBarline = 'end';
          }
          if (this.stacks[i] === undefined) {
              this.stacks[i] = new vfShow.RenderStack();
          }
          this.prepareMeasure(subStream, this.stacks[i]);
      }
      this.prepareTies(p);
  };
  /**
   * 
   * Prepares a score that arrived flat... sets up
   * stacks and ties after calling prepareFlat
   *
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} m - a flat stream (maybe a measure or voice)
   */
  vfShow.Renderer.prototype.prepareArrivedFlat = function (m) {
      var stack = new vfShow.RenderStack();
      this.prepareMeasure(m, stack);
      this.stacks[0] = stack;
      this.prepareTies(m);
  };
  /**
   *
   * Prepares a measure (w/ or w/o voices) or generic Stream -- makes accidentals,
   * associates a Vex.Flow.Stave with the stream and
   * returns a vexflow Voice object
   *
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Measure} m - a measure object (w or w/o voices)
   * @param {music21.vfShow.RenderStack} stack - a RenderStack object to prepare into.
   */
  vfShow.Renderer.prototype.prepareMeasure = function (m, stack) {
      if (m.hasVoices === undefined || m.hasVoices() === false) {
          this.prepareFlat(m, stack);
      } else {
          // TODO: don't assume that all elements are Voices;
          var stave;
          var rendOp = m.renderOptions; // get render options from Measure;
          for (var voiceIndex = 0; voiceIndex < m.length; voiceIndex++) {
              var voiceStream = m.get(voiceIndex);
              stave = this.prepareFlat(voiceStream, stack, stave, rendOp);
          }
      }
      return stack;
  };

  /**
  * Main internal routine to prepare a flat stream
  *
  * @memberof music21.vfShow.Renderer
  * @param {music21.stream.Stream} s - a flat stream object
  * @param {music21.vfShow.RenderStack} stack - a RenderStack object to prepare into.
  * @param {Vex.Flow.Stave} [optionalStave] - an optional existing stave.
  * @param {object} [optional_renderOp] - render options. Passed to {@link music21.vfShow.Renderer#renderStave}
  * @returns {Vex.Flow.Stave} staff to return too (also changes the `stack` parameter and runs `makeAccidentals` on s)
  */
  vfShow.Renderer.prototype.prepareFlat = function (s, stack, optionalStave, optional_renderOp) {
      s.makeAccidentals();
      var stave;
      if (optionalStave !== undefined) {
          stave = optionalStave;
      } else {
          stave = this.renderStave(s, optional_renderOp);
      }
      s.activeVFStave = stave;
      var voice = this.getVoice(s, stave);
      stack.voices.push(voice);
      stack.streams.push(s);

      if (s.hasLyrics()) {
          stack.textVoices.push(this.getLyricVoice(s, stave));
      }

      return stave;
  };

  /**
   * Render the Vex.Flow.Stave from a flat stream and draws it.
   * 
   * Just draws the stave, not the notes, etc.
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} [m=this.stream] - a flat stream
   * @param {object} [optional_rendOp] - render options, passed to {@link music21.vfShow.Renderer#newStave} and {@link music21.vfShow.Renderer#setClefEtc}
   * @returns {Vex.Flow.Stave} stave
   */
  vfShow.Renderer.prototype.renderStave = function (m, optional_rendOp) {
      if (m === undefined) {
          m = this.stream;
      }
      var ctx = this.ctx;
      // stave will be passed in from Measure when we have Voices 
      var stave = this.newStave(m, optional_rendOp);

      this.setClefEtc(m, stave, optional_rendOp);
      stave.setContext(ctx);
      stave.draw();
      return stave;
  };

  /**
   * Draws the Voices (music and text) from `this.stacks`
   * 
   * @memberof music21.vfShow.Renderer
   */
  vfShow.Renderer.prototype.drawMeasureStacks = function () {
      var ctx = this.ctx;
      for (var i = 0; i < this.stacks.length; i++) {
          var voices = this.stacks[i].allTickables();
          for (var j = 0; j < voices.length; j++) {
              var v = voices[j];
              v.draw(ctx);
          }
      }
  };

  /**
   * draws the tuplets.
   * 
   * @memberof music21.vfShow.Renderer
   */
  vfShow.Renderer.prototype.drawTuplets = function () {
      var ctx = this.ctx;
      this.vfTuplets.forEach(function (vft) {
          vft.setContext(ctx).draw();
      });
  };
  /**
   * draws the ties
   * 
   * @memberof music21.vfShow.Renderer
   */
  vfShow.Renderer.prototype.drawTies = function () {
      var ctx = this.ctx;
      for (var i = 0; i < this.ties.length; i++) {
          this.ties[i].setContext(ctx).draw();
      }
  };

  /**
   * Finds all tied notes and creates the proper Vex.Flow.StaveTie objects in
   * `this.ties`.
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Part} p - a Part or similar object
   */
  vfShow.Renderer.prototype.prepareTies = function (p) {
      var pf = p.flat.notesAndRests;
      //console.log('newSystemsAt', this.systemBreakOffsets);
      for (var i = 0; i < pf.length - 1; i++) {
          var thisNote = pf.get(i);
          if (thisNote.tie === undefined || thisNote.tie.type == 'stop') {
              continue;
          }
          var nextNote = pf.get(i + 1);
          var onSameSystem = true;
          // this.systemBreakOffsets.length will be 0 for a flat score
          for (var sbI = 0; sbI < this.systemBreakOffsets.length; sbI++) {
              var thisSystemBreak = this.systemBreakOffsets[sbI];
              if (thisNote.offset < thisSystemBreak && nextNote.offset >= thisSystemBreak) {
                  onSameSystem = false;
                  break;
              }
          }
          if (onSameSystem) {
              var vfTie = new vexflow.Vex.Flow.StaveTie({
                  first_note: thisNote.activeVexflowNote,
                  last_note: nextNote.activeVexflowNote,
                  first_indices: [0],
                  last_indices: [0]
              });
              this.ties.push(vfTie);
          } else {
              //console.log('got me a tie across systemBreaks!');
              var vfTie1 = new vexflow.Vex.Flow.StaveTie({
                  first_note: thisNote.activeVexflowNote,
                  first_indices: [0]
              });
              this.ties.push(vfTie1);
              var vfTie2 = new vexflow.Vex.Flow.StaveTie({
                  last_note: nextNote.activeVexflowNote,
                  first_indices: [0]
              });
              this.ties.push(vfTie2);
          }
      }
  };

  /**
   * Returns a Vex.Flow.Voice object with all the tickables (i.e., Notes, Voices, etc.)
   * 
   * Does not draw it...
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} [s=this.stream] -- usually a Measure or Voice
   * @param {Vex.Flow.Stave} stave - not optional (would never fly in Python...)
   * @returns {Vex.Flow.Voice}
   */
  vfShow.Renderer.prototype.getVoice = function (s, stave) {
      if (s === undefined) {
          s = this.stream;
      }

      // gets a group of notes as a voice, but completely unformatted and not drawn.
      var notes = this.vexflowNotes(s, stave);
      var voice = this.vexflowVoice(s);
      voice.setStave(stave);

      voice.addTickables(notes);
      return voice;
  };

  /**
   * Returns a Vex.Flow.Voice with the lyrics set to render in the proper place.
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} s -- usually a Measure or Voice
   * @param {Vex.Flow.Stave} stave
   * @returns {Vex.Flow.Voice}
   */
  vfShow.Renderer.prototype.getLyricVoice = function (s, stave) {
      var textVoice = this.vexflowVoice(s);
      var lyrics = this.vexflowLyrics(s, stave);
      textVoice.setStave(stave);
      textVoice.addTickables(lyrics);
      return textVoice;
  };

  /**
   * Aligns all of `this.stacks` (after they've been prepared) so they align properly.
   * 
   * @memberof music21.vfShow.Renderer
   */
  vfShow.Renderer.prototype.formatMeasureStacks = function () {
      // adds formats the voices, then adds the formatter information to every note in a voice...
      for (var i = 0; i < this.stacks.length; i++) {
          var stack = this.stacks[i];
          var voices = stack.voices;
          var measures = stack.streams;
          var formatter = this.formatVoiceGroup(stack);
          for (var j = 0; j < measures.length; j++) {
              var m = measures[j];
              var v = voices[j];
              this.applyFormatterInformationToNotes(v.stave, m, formatter);
          }
      }
  };

  /**
   * Formats a single voice group from a stack.
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.vfShow.RenderStack} stack
   * @param {Boolean} [autoBeam=measures[0].autoBeam]
   * @returns {Vex.Flow.Formatter}
   */
  vfShow.Renderer.prototype.formatVoiceGroup = function (stack, autoBeam) {
      // formats a group of voices to use the same formatter; returns the formatter
      // if autoBeam is true then it will apply beams for each voice and put them in
      // this.beamGroups;
      var allTickables = stack.allTickables();
      var voices = stack.voices;
      var measures = stack.streams;
      if (autoBeam === undefined) {
          autoBeam = measures[0].autoBeam;
      }

      var formatter = new vexflow.Vex.Flow.Formatter();
      //var minLength = formatter.preCalculateMinTotalWidth([voices]);
      //console.log(minLength);
      if (voices.length === 0) {
          return formatter;
      }
      var maxGlyphStart = 0; // find the stave with the farthest start point -- diff key sig, etc.
      for (var i = 0; i < allTickables.length; i++) {
          //console.log(voices[i], voices[i].stave, i);
          if (allTickables[i].stave.start_x > maxGlyphStart) {
              maxGlyphStart = allTickables[i].stave.start_x;
          }
      }
      for (var i = 0; i < allTickables.length; i++) {
          allTickables[i].stave.start_x = maxGlyphStart; // corrected!
      }
      // TODO: should do the same for end_x -- for key sig changes, etc...

      var stave = voices[0].stave; // all staves should be same length, so does not matter;
      formatter.joinVoices(allTickables);
      formatter.formatToStave(allTickables, stave);
      if (autoBeam) {
          for (i = 0; i < voices.length; i++) {
              // find beam groups -- n.b. this wipes out stemDirection. worth it usually...
              var voice = voices[i];
              var beatGroups = [new vexflow.Vex.Flow.Fraction(2, 8)]; // default beam groups
              if (measures[i] !== undefined && measures[i].timeSignature !== undefined) {
                  beatGroups = measures[i].timeSignature.vexflowBeatGroups(vexflow.Vex); // TODO: getContextByClass...
                  //console.log(beatGroups);
              }
              var beamGroups = vexflow.Vex.Flow.Beam.applyAndGetBeams(voice, undefined, beatGroups);
              this.beamGroups.push.apply(this.beamGroups, beamGroups);
          }
      }
      return formatter;
  };

  /**
   * Draws the beam groups.
   * 
   * @memberof music21.vfShow.Renderer
   */
  vfShow.Renderer.prototype.drawBeamGroups = function () {
      var ctx = this.ctx;
      // draw beams

      for (var i = 0; i < this.beamGroups.length; i++) {
          this.beamGroups[i].setContext(ctx).draw();
      }
  };

  /**
   * Return a new Vex.Flow.Stave object, which represents
   * a single MEASURE of notation in m21j
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} s
   * @returns {Vex.Flow.Stave}
   */
  vfShow.Renderer.prototype.newStave = function (s, rendOp) {
      if (s === undefined) {
          s = this.stream;
      }
      if (rendOp === undefined) {
          rendOp = s.renderOptions;
      }
      // measure level...
      var width = rendOp.width;
      if (width === undefined) {
          width = s.estimateStaffLength() + rendOp.staffPadding;
      }
      var top = rendOp.top; // * rendOp.scaleFactor.y;
      if (top === undefined) {
          top = 0;
      }
      var left = rendOp.left;
      if (left === undefined) {
          left = 10;
      }
      //console.log('streamLength: ' + streamLength);
      if (music21.debug) {
          console.log('creating new stave: left:' + left + ' top: ' + top + ' width: ' + width);
      }
      var stave = new vexflow.Vex.Flow.Stave(left, top, width);
      return stave;
  };

  /**
   * Sets the number of stafflines, puts the clef on the Stave, adds keySignature, timeSignature, and rightBarline
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} s
   * @param {Vex.Flow.Stave} stave
   * @param {object} [rendOp=s.renderOptions] - a {@link music21.renderOptions.RenderOptions} object that might have `{showMeasureNumber: boolean, rightBarLine: string<{'single', 'double', 'end'}>}`
   */
  vfShow.Renderer.prototype.setClefEtc = function (s, stave, rendOp) {
      if (rendOp === undefined) {
          rendOp = s.renderOptions;
      }
      this.setStafflines(s, stave);
      if (rendOp.showMeasureNumber) {
          stave.setMeasure(rendOp.measureIndex + 1);
      }
      if (rendOp.displayClef) {
          var ottava;
          var size = 'default';
          if (s.clef.octaveChange == 1) {
              ottava = '8va';
          } else if (s.clef.octaveChange == -1) {
              ottava = '8vb';
          }
          stave.addClef(s.clef.name, size, ottava);
      }
      if (s.keySignature !== undefined && rendOp.displayKeySignature) {
          stave.addKeySignature(s.keySignature.vexflow());
      }

      if (s.timeSignature !== undefined && rendOp.displayTimeSignature) {
          stave.addTimeSignature(s.timeSignature.numerator.toString() + "/" + s.timeSignature.denominator.toString()); // TODO: convertToVexflow...
      }
      if (rendOp.rightBarline !== undefined) {
          var bl = rendOp.rightBarline;
          var barlineMap = {
              'single': 'SINGLE',
              'double': "DOUBLE",
              'end': 'END'
          };
          var vxBL = barlineMap[bl];
          if (vxBL !== undefined) {
              stave.setEndBarType(vexflow.Vex.Flow.Barline.type[vxBL]);
          }
      }
  };

  /**
   * Sets the number of stafflines properly for the Stave object.
   * 
   * This method does not just set Vex.Flow.Stave#setNumLines() except
   * if the number of lines is 0 or >=4, because the default in VexFlow is
   * to show the bottom(top?), not middle, lines and that looks bad.
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} s - stream to get the `.staffLines` from `s.renderOptions` from -- should allow for overriding.
   * @param {Vex.Flow.Stave} vexflowStave - stave to set the staff lines for.
   */
  vfShow.Renderer.prototype.setStafflines = function (s, vexflowStave) {
      var rendOp = s.renderOptions;
      if (rendOp.staffLines != 5) {
          if (rendOp.staffLines === 0) {
              vexflowStave.setNumLines(0);
          } else if (rendOp.staffLines == 1) {
              // Vex.Flow.Stave.setNumLines hides all but the top line.
              // this is better
              vexflowStave.options.line_config = [{ visible: false }, { visible: false }, { visible: true }, // show middle
              { visible: false }, { visible: false }];
          } else if (rendOp.staffLines == 2) {
              vexflowStave.options.line_config = [{ visible: false }, { visible: false }, { visible: true }, // show middle
              { visible: true }, { visible: false }];
          } else if (rendOp.staffLines == 3) {
              vexflowStave.options.line_config = [{ visible: false }, { visible: true }, { visible: true }, // show middle
              { visible: true }, { visible: false }];
          } else {
              vexflowStave.setNumLines(rendOp.staffLines);
          }
      }
  };
  /**
   * 
   * Gets the Vex.Flow.StaveNote objects from a Stream.
   * 
   * Also changes `this.vfTuplets`.
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} [s=this.stream] - flat stream to find notes in
   * @param {Vex.Flow.Stave} stave
   * @returns {Array<Vex.Flow.StaveNote>} notes to return
   */
  vfShow.Renderer.prototype.vexflowNotes = function (s, stave) {
      if (s === undefined) {
          s = this.stream;
      }
      // runs on a flat stream, returns a list of voices...
      var notes = [];
      var vfTuplets = [];
      var activeTuplet;
      var activeTupletLength = 0.0;
      var activeTupletVexflowNotes = [];

      var options = { clef: s.clef, stave: stave };
      for (var i = 0; i < s.length; i++) {
          var thisEl = s.get(i);
          if (thisEl.isClassOrSubclass('GeneralNote') && thisEl.duration !== undefined) {
              var vfn = thisEl.vexflowNote(options);
              if (vfn === undefined) {
                  console.error('Cannot create a vexflowNote from: ', thisEl);
              }
              // sets thisEl.activeVexflowNote -- may be overwritten but not so fast...
              if (stave !== undefined) {
                  vfn.setStave(stave);
              }
              notes.push(vfn);

              // account for tuplets...
              if (thisEl.duration.tuplets.length > 0) {
                  // only support one tuplet -- like vexflow
                  var m21Tuplet = thisEl.duration.tuplets[0];
                  if (activeTuplet === undefined) {
                      activeTuplet = m21Tuplet;
                  }
                  activeTupletVexflowNotes.push(vfn);
                  activeTupletLength += thisEl.duration.quarterLength;
                  //console.log(activeTupletLength, activeTuplet.totalTupletLength());
                  if (activeTupletLength >= activeTuplet.totalTupletLength() || Math.abs(activeTupletLength - activeTuplet.totalTupletLength()) < 0.001) {
                      //console.log(activeTupletVexflowNotes);
                      var tupletOptions = { num_notes: activeTuplet.numberNotesActual,
                          beats_occupied: activeTuplet.numberNotesNormal };
                      //console.log('tupletOptions', tupletOptions);
                      var vfTuplet = new vexflow.Vex.Flow.Tuplet(activeTupletVexflowNotes, tupletOptions);
                      if (activeTuplet.tupletNormalShow == 'ratio') {
                          vfTuplet.setRatioed(true);
                      }

                      vfTuplets.push(vfTuplet);
                      activeTupletLength = 0.0;
                      activeTuplet = undefined;
                      activeTupletVexflowNotes = [];
                  }
              }
          }
      }
      if (activeTuplet !== undefined) {
          console.warn('incomplete tuplet found in stream: ', s);
      }
      if (vfTuplets.length > 0) {
          this.vfTuplets.push.apply(this.vfTuplets, vfTuplets);
      }
      return notes;
  };

  /**
   * Gets an Array of `Vex.Flow.TextNote` objects from any lyrics found in s
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} s - flat stream to search.
   * @param {Vex.Flow.Stave} stave
   * @returns {Array<Vex.Flow.TextNote>}
   */
  vfShow.Renderer.prototype.vexflowLyrics = function (s, stave) {
      var getTextNote = function (text, font, d) {
          //console.log(text, font, d);
          var t1 = new vexflow.Vex.Flow.TextNote({
              text: text,
              font: font,
              duration: d
          }).setLine(11).setStave(stave).setJustification(vexflow.Vex.Flow.TextNote.Justification.LEFT);
          return t1;
      };

      if (s === undefined) {
          s = this.stream;
      }
      var font = {
          family: "Serif",
          size: 12,
          weight: ""
      };
      // runs on a flat, gapless, no-overlap stream, returns a list of TextNote objects...
      var lyricsObjects = [];
      for (var i = 0; i < s.length; i++) {
          var el = s.get(i);
          var lyricsArray = el.lyrics;
          var text;
          var d = el.duration.vexflowDuration;
          var addConnector = false;
          if (lyricsArray.length === 0) {
              text = "";
          } else {
              text = lyricsArray[0].text;
              if (text === undefined) {
                  text = "";
              }
              if (lyricsArray[0].syllabic == 'middle' || lyricsArray[0].syllabic == 'begin') {
                  addConnector = " " + lyricsArray[0].lyricConnector;
                  var tempQl = el.duration.quarterLength / 2.0;
                  d = new music21.duration.Duration(tempQl).vexflowDuration;
              }
          }
          var t1 = getTextNote(text, font, d);
          lyricsObjects.push(t1);
          if (addConnector !== false) {
              var connector = getTextNote(addConnector, font, d);
              lyricsObjects.push(connector);
          }
      }
      return lyricsObjects;
  };
  /**
   * Creates a Vex.Flow.Voice of the appropriate length given a Stream.
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} s
   * @returns {Vex.Flow.Voice}
   */
  vfShow.Renderer.prototype.vexflowVoice = function (s) {
      var vfv;
      var totalLength = s.duration.quarterLength;

      var num1024 = Math.round(totalLength / (1 / 256));
      var beatValue = 1024;

      if (num1024 % 512 === 0) {
          beatValue = 2;num1024 = num1024 / 512;
      } else if (num1024 % 256 === 0) {
          beatValue = 4;num1024 = num1024 / 256;
      } else if (num1024 % 128 === 0) {
          beatValue = 8;num1024 = num1024 / 128;
      } else if (num1024 % 64 === 0) {
          beatValue = 16;num1024 = num1024 / 64;
      } else if (num1024 % 32 === 0) {
          beatValue = 32;num1024 = num1024 / 32;
      } else if (num1024 % 16 === 0) {
          beatValue = 64;num1024 = num1024 / 16;
      } else if (num1024 % 8 === 0) {
          beatValue = 128;num1024 = num1024 / 8;
      } else if (num1024 % 4 === 0) {
          beatValue = 256;num1024 = num1024 / 4;
      } else if (num1024 % 2 === 0) {
          beatValue = 512;num1024 = num1024 / 2;
      }
      //console.log('creating voice');
      if (music21.debug) {
          console.log("New voice, num_beats: " + num1024.toString() + " beat_value: " + beatValue.toString());
      }
      vfv = new vexflow.Vex.Flow.Voice({ num_beats: num1024,
          beat_value: beatValue,
          resolution: vexflow.Vex.Flow.RESOLUTION });

      // from vexflow/src/voice.js
      //
      // Modes allow the addition of ticks in three different ways:
      //
      // STRICT: This is the default. Ticks must fill the voice.
      // SOFT:   Ticks can be added without restrictions.
      // FULL:   Ticks do not need to fill the voice, but can't exceed the maximum
      //         tick length.
      vfv.setMode(vexflow.Vex.Flow.Voice.Mode.SOFT);
      return vfv;
  };
  vfShow.Renderer.prototype.staffConnectorsMap = {
      'brace': vexflow.Vex.Flow.StaveConnector.type.BRACE,
      'single': vexflow.Vex.Flow.StaveConnector.type.SINGLE,
      'double': vexflow.Vex.Flow.StaveConnector.type.DOUBLE,
      'bracket': vexflow.Vex.Flow.StaveConnector.type.BRACKET
  };

  /**
   * If a stream has parts (NOT CHECKED HERE) create and draw an appropriate Vex.Flow.StaveConnector
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Score} s
   */
  vfShow.Renderer.prototype.addStaffConnectors = function (s) {
      if (s === undefined) {
          s = this.stream;
      }
      var numParts = s.length;
      if (numParts < 2) {
          return;
      }

      var firstPart = s.get(0);
      var lastPart = s.get(-1);
      var numMeasures = firstPart.length;
      for (var mIndex = 0; mIndex < numMeasures; mIndex++) {
          var thisPartMeasure = firstPart.get(mIndex);
          var lastPartMeasure = lastPart.get(mIndex); // only needed once per system but
          // good for symmetry.
          if (thisPartMeasure.renderOptions.startNewSystem) {
              var topVFStaff = thisPartMeasure.activeVFStave;
              var bottomVFStaff = lastPartMeasure.activeVFStave;
              /* TODO: warning if no staves... */
              for (var i = 0; i < s.renderOptions.staffConnectors.length; i++) {
                  var sc = new vexflow.Vex.Flow.StaveConnector(topVFStaff, bottomVFStaff);
                  var scTypeM21 = s.renderOptions.staffConnectors[i];
                  var scTypeVF = this.staffConnectorsMap[scTypeM21];
                  sc.setType(scTypeVF);
                  sc.setContext(this.ctx);
                  sc.draw();
              }
          }
      }
  };

  /**
   * The process of putting a Stream onto a canvas affects each of the
   * elements in the Stream by adding pieces of information to
   * each {@link music21.base.Music21Object} -- see `applyFormatterInformationToNotes`
   * 
   * You might want to remove this information; this routine does that.
   * 
   * @memberof music21.vfShow.Renderer
   * @param {music21.stream.Stream} s - can have parts, measures, etc.
   * @param {boolean} [recursive=false]
   */
  vfShow.Renderer.prototype.removeFormatterInformation = function (s, recursive) {
      s.storedVexflowStave = undefined;
      for (var i = 0; i < s.length; i++) {
          var el = s.get(i);
          el.x = undefined;
          el.y = undefined;
          el.width = undefined;
          el.systemIndex = undefined;
          el.activeVexflowNote = undefined;
          if (recursive && el.isClassOrSubclass('Stream')) {
              this.removeFormatterInformation(el, recursive);
          }
      }
  };

  /**
   * Adds the following pieces of information to each Note
   * 
   * - el.x -- x location in pixels
   * - el.y -- y location in pixels
   * - el.width - width of element in pixels.
   * - el.systemIndex -- which system is it on
   * - el.activeVexflowNote - which Vex.Flow.StaveNote is it connected with.
   *
   * mad props to our friend Vladimir Viro for figuring this out! Visit http://peachnote.com/
   *
   * Also sets s.storedVexflowStave to stave.
   *
   * @memberof music21.vfShow.Renderer
   * @param {Vex.Flow.Stave} stave
   * @param {music21.stream.Stream} [s=this.stream]
   * @param {Vex.Flow.Formatter} formatter
   */
  vfShow.Renderer.prototype.applyFormatterInformationToNotes = function (stave, s, formatter) {
      if (s === undefined) {
          s = this.stream;
      }
      var noteOffsetLeft = 0;
      //var staveHeight = 80;
      if (stave !== undefined) {
          noteOffsetLeft = stave.start_x + stave.glyph_start_x;
          if (music21.debug) {
              console.log("noteOffsetLeft: " + noteOffsetLeft + " ; stave.start_x: " + stave.start_x);
              console.log("Bottom y: " + stave.getBottomY());
          }
          //staveHeight = stave.height;
      }

      var nextTicks = 0;
      for (var i = 0; i < s.length; i++) {
          var el = s.get(i);
          if (el.isClassOrSubclass('GeneralNote')) {
              var vfn = el.activeVexflowNote;
              if (vfn === undefined) {
                  continue;
              }
              var nTicks = parseInt(vfn.ticks);
              var formatterNote = formatter.tContexts.map[String(nextTicks)];
              nextTicks += nTicks;
              el.x = vfn.getAbsoluteX();
              // these are a bit hacky...
              el.systemIndex = s.renderOptions.systemIndex;

              //console.log(i + " " + el.x + " " + formatterNote.x + " " + noteOffsetLeft);
              if (formatterNote === undefined) {
                  continue;
              }

              el.width = formatterNote.width;
              if (el.pitch !== undefined) {
                  // note only...
                  el.y = stave.getBottomY() - (s.clef.lowestLine - el.pitch.diatonicNoteNum) * stave.options.spacing_between_lines_px;
                  //console.log('Note DNN: ' + el.pitch.diatonicNoteNum + " ; y: " + el.y);
              }
          }
      }
      if (music21.debug) {
          for (i = 0; i < s.length; i++) {
              var n = s.get(i);
              if (n.pitch !== undefined) {
                  console.log(n.pitch.diatonicNoteNum + " " + n.x + " " + (n.x + n.width));
              }
          }
      }
      s.storedVexflowStave = stave;
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/meter -- TimeSignature objects
   * 
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * meter module. See {@link music21.meter} namespace for details.
   * 
   * @exports music21/meter
   */

  /** 
   * Meter and TimeSignature Classes (esp. {@link music21.meter.TimeSignature} ) and methods.
   * 
   * @namespace music21.meter 
   * @memberof music21 
   * @requires music21/base
   * @requires music21/duration
   */
  var meter = {};

  /**
   * A MUCH simpler version of the music21p TimeSignature object.
   * 
   * @class TimeSignature
   * @memberof music21.meter 
   * @param {string} meterString - a string ("4/4", "3/8" etc.) to initialize the TimeSignature.
   * @property {Int} [numerator=4]
   * @property {Int} [denominator=4]
   * @property {Array<Array<Int>>} beatGroups - groupings of beats; inner arrays are numerator, denominator
   * @property {string} ratioString - a string like "4/4"
   * @property {music21.duration.Duration} barDuration - a Duration object representing the expressed total length of the TimeSignature.
   */
  meter.TimeSignature = function (meterString) {
      base.Music21Object.call(this);
      this.classes.push('TimeSignature');
      this._numerator = 4;
      this._denominator = 4;
      this.beatGroups = [];

      Object.defineProperties(this, {
          'numerator': {
              enumerable: true,
              configurable: true,
              get: function () {
                  return this._numerator;
              },
              set: function (s) {
                  this._numerator = s;
              }
          },
          'denominator': {
              enumerable: true,
              configurable: true,
              get: function () {
                  return this._denominator;
              },
              set: function (s) {
                  this._denominator = s;
              }
          },
          'ratioString': {
              enumerable: true,
              configurable: true,
              get: function () {
                  return this.numerator.toString() + '/' + this.denominator.toString();
              },
              set: function (meterString) {
                  var meterList = meterString.split('/');
                  this.numerator = parseInt(meterList[0]);
                  this.denominator = parseInt(meterList[1]);
              }
          },
          'barDuration': {
              enumerable: true,
              configurable: true,
              get: function () {
                  var ql = 4.0 * this._numerator / this._denominator;
                  return new duration.Duration(ql);
              }
          }
      });

      if (typeof meterString == 'string') {
          this.ratioString = meterString;
      }
  };
  meter.TimeSignature.prototype = new base.Music21Object();
  meter.TimeSignature.prototype.constructor = meter.TimeSignature;
  /**
   * Compute the Beat Group according to this time signature.
   * 
   * @memberof music21.meter.TimeSignature
   * @returns {Array<Array<Int>>} a list of numerator and denominators, find a list of beat groups.
   */
  meter.TimeSignature.prototype.computeBeatGroups = function () {
      var tempBeatGroups = [];
      var numBeats = this.numerator;
      var beatValue = this.denominator;
      if (beatValue < 8 && numBeats >= 5) {
          var beatsToEighthNoteRatio = 8 / beatValue; // hopefully Int -- right Brian Ferneyhough?
          beatValue = 8;
          numBeats = numBeats * beatsToEighthNoteRatio;
      }

      if (beatValue >= 8) {
          while (numBeats >= 5) {
              tempBeatGroups.push([3, beatValue]);
              numBeats -= 3;
          }
          if (numBeats == 4) {
              tempBeatGroups.push([2, beatValue]);
              tempBeatGroups.push([2, beatValue]);
          } else if (numBeats > 0) {
              tempBeatGroups.push([numBeats, beatValue]);
          }
      } else if (beatValue == 2) {
          tempBeatGroups.push([1, 2]);
      } else if (beatValue <= 1) {
          tempBeatGroups.push([1, 1]);
      } else {
          // 4/4, 2/4, 3/4, standard stuff                
          tempBeatGroups.push([2, 8]);
      }
      return tempBeatGroups;
  };
  /**
   * Compute the Beat Group according to this time signature for VexFlow. For beaming.
   * 
   * @memberof music21.meter.TimeSignature
   * @param {Vex} Vex - a reference to the Vex object
   * @returns {Array<Vex.Flow.Fraction>} a list of numerator and denominator groups, for VexFlow
   */
  meter.TimeSignature.prototype.vexflowBeatGroups = function (Vex) {
      var tempBeatGroups;
      if (this.beatGroups.length > 0) {
          tempBeatGroups = this.beatGroups;
      } else {
          tempBeatGroups = this.computeBeatGroups();
      }
      //console.log(tempBeatGroups);
      var vfBeatGroups = [];
      for (var i = 0; i < tempBeatGroups.length; i++) {
          var bg = tempBeatGroups[i];
          vfBeatGroups.push(new Vex.Flow.Fraction(bg[0], bg[1]));
      }
      return vfBeatGroups;

      //          if (numBeats % 3 == 0 && beatValue < 4) {
      //              // 6/8, 3/8, 9/8, etc.
      //              numBeats = numBeats / 3;
      //              beatValue = beatValue / 3;
      //          }            
  };

  //    meter.MeterTerminal = function(slashNotation, weight) {
  //        this._duration = undefined;
  //        this._numerator = 0;
  //        this._denominator = 1;
  //        this._weight = None;
  //        this._overriddenDuration = None;
  //        
  //        if (weight === undefined) {
  //            weight = 1;
  //        }
  //        
  //        
  //    };

  /**
   * module with tools for working with Streams. See {@link music21.streamInteraction} namespace.
   * 
   * @exports music21/streamInteraction
   */
  /**
   * Objects that work with Streams to provide interactions
   * 
   * @namespace music21.streamInteraction
   * @memberof music21
   * @requires music21/common
   * @requires music21/stream
   */
  var streamInteraction = {};

  /**
   * Object for adding scrolling while playing.
   * 
   * @class ScrollPlayer
   * @memberof music21.streamInteraction
   * @param {music21.stream.Stream} s -- Stream
   * @param {canvas} c -- canvas
   * @property {music21.streamInteraction.PixelMapper} pixelMapper - an object that can map current pixel to notes and vice versa.
   * @property {number} [tempo=s.tempo]
   * @property {number} lastX - last X value
   * @property {Int} lastNoteIndex - index of last note played
   * @property {SVGDOMObject} barDOM - DOM object representing the scrolling bar
   * @property {SVGDOMObject} svgDOM - DOM object holding the scrolling bar (overlaid on top of canvas)
   * @property {DOMObject} canvasParent - the parent DOM object for `this.canvas`
   * @property {Int} lastTimeout - a numerical reference to a timeout object created by `setTimeout`
   * @property {number} startTime - the time in ms when the scrolling started
   * @property {Int} [previousSystemIndex=0] - the last systemIndex being scrolled
   * @property {number} [eachSystemHeight=120] - currently all systems need to have the same height.
   * @property {Int} [timingMS=50] - amount of time between polls to scroll
   * @property {function} savedRenderOptionClick - starting ScrollPlayer overrides the `'click'` event for the stream, switching it to Stop. this saves it for restoring later.
   */
  streamInteraction.ScrollPlayer = function (s, c) {
      this.pixelMapper = new streamInteraction.PixelMapper(s);
      this.stream = s;
      this.canvas = c;
      this.tempo = s.tempo;
      this.lastX = 0;
      this.lastNoteIndex = -1;
      this.barDOM = undefined;
      this.svgDOM = undefined;
      this.canvasParent = undefined;
      this.lastTimeout = undefined;
      this.startTime = new Date().getTime();
      this.previousSystemIndex = 0;
      this.eachSystemHeight = 120;
      this.timingMS = 50;
      this.savedRenderOptionClick = undefined;

      /**
       * function, bound to `this` to scroll the barDOM.
       * 
       * calls itself until a stop click is received or the piece ends.
       * 
       * @method streamInteraction.ScrollPlayer#scrollScore
       * @memberof music21.streamInteraction.ScrollPlayer
       */
      this.scrollScore = function () {
          var timeSinceStartInMS = new Date().getTime() - this.startTime;
          var offset = timeSinceStartInMS / 1000 * this.tempo / 60;
          var pm = this.pixelMapper;
          var systemIndex = pm.getSystemIndexAtOffset(offset);

          if (systemIndex > this.previousSystemIndex) {
              this.lastX = -100; // arbitrary negative...
              this.previousSystemIndex = systemIndex;
              this.barDOM.setAttribute('y', systemIndex * this.eachSystemHeight);
          }
          var x = pm.getXAtOffset(offset);
          x = Math.floor(x);

          //console.log(x);

          if (x > this.lastX) {
              this.barDOM.setAttribute('x', x);
              this.lastX = x;
          }
          // pm is a pixelMap not a Stream
          for (var j = 0; j < pm.allMaps.length; j++) {
              var pmOff = pm.allMaps[j].offset;
              if (j <= this.lastNoteIndex) {
                  continue;
              } else if (Math.abs(offset - pmOff) > .1) {
                  continue;
              }
              var elList = pm.allMaps[j].elements;
              for (var elIndex = 0; elIndex < elList.length; elIndex++) {
                  var el = elList[elIndex];
                  if (el !== undefined && el.playMidi !== undefined) {
                      el.playMidi(this.tempo);
                  }
              }
              this.lastNoteIndex = j;
          }
          //console.log(x, offset);
          //console.log(barDOM.setAttribute);
          var newTimeout = undefined;
          if (x < pm.maxX || systemIndex < pm.maxSystemIndex) {
              //console.log(x, pm.maxX);
              newTimeout = setTimeout(this.scrollScore, this.timingMS);
              this.lastTimeout = newTimeout;
          } else {
              var fauxEvent = undefined;
              this.stopPlaying(fauxEvent);
          }
      }.bind(this);
  };

  /**
   * Create the scrollbar (barDOM), the svg to place it in (svgDOM)
   * and append it over the stream.
   * 
   * Sets as a consequence:
   * - this.barDOM
   * - this.svgDOM
   * - this.eachSystemHeight
   * - this.canvasParent
   * 
   * @memberof music21.streamInteraction.ScrollPlayer
   * @returns {SVGDOMObject} scroll bar
   */
  streamInteraction.ScrollPlayer.prototype.createScrollBar = function () {
      var canvas = this.canvas;
      var svgDOM = common.makeSVGright('svg', {
          'height': canvas.height.toString() + 'px',
          'width': canvas.width.toString() + 'px',
          'style': 'position:absolute; top: 0px; left: 0px;'
      });
      var scaleY = this.stream.renderOptions.scaleFactor.y;
      var eachSystemHeight = canvas.height / (scaleY * (this.pixelMapper.maxSystemIndex + 1));
      var barDOM = common.makeSVGright('rect', {
          width: 10,
          height: eachSystemHeight - 6, // small fudge for separation
          x: this.pixelMapper.startX,
          y: 3,
          style: 'fill: rgba(255, 255, 20, .5);stroke:white'
      });
      barDOM.setAttribute("transform", "scale(" + scaleY + ")");
      svgDOM.appendChild(barDOM);

      var canvasParent = jquery.$(canvas).parent()[0];
      canvasParent.appendChild(svgDOM);
      this.barDOM = barDOM;
      this.svgDOM = svgDOM;
      this.canvasParent = canvasParent;
      this.eachSystemHeight = eachSystemHeight;
      return barDOM;
  };

  /**
   * start playing! Create a scroll bar and start scrolling
   * 
   * (set this to an event on stream, or something...)
   * 
   * currently called from {@link music21.stream.Stream#scrollScoreStart} via
   * {@link music21.stream.Stream#renderScrollableCanvas}. Will change.
   * 
   * @memberof music21.streamInteraction.ScrollPlayer
   */
  streamInteraction.ScrollPlayer.prototype.startPlaying = function () {
      this.createScrollBar();

      this.savedRenderOptionClick = this.stream.renderOptions.events.click;
      this.stream.renderOptions.events.click = function (e) {
          this.stopPlaying(e);
      }.bind(this);
      this.stream.setRenderInteraction(this.canvasParent);
      this.scrollScore();
  };

  /**
   * Called when the ScrollPlayer should stop playing
   * 
   * @memberof music21.streamInteraction.ScrollPlayer
   * @param {DOMEvent} [event]
   */
  streamInteraction.ScrollPlayer.prototype.stopPlaying = function (event) {
      this.stream.renderOptions.events.click = this.savedRenderOptionClick;
      this.barDOM.setAttribute('style', 'display:none');
      // TODO: generalize...
      this.canvasParent.removeChild(this.svgDOM);
      if (this.lastTimeout !== undefined) {
          clearTimeout(this.lastTimeout);
      }
      this.stream.setRenderInteraction(this.canvasParent);
      if (event !== undefined) {
          event.stopPropagation();
      }
  };

  /**
   * A `PixelMapper` is an object that knows how to map offsets to pixels on a flat Stream.
   * 
   * Helper for ScrollPlayer and soon other places...
   * 
   * @class PixelMapper
   * @memberof music21.streamInteraction
   * @param {music21.stream.Stream} s - stream object
   * @property {Array<music21.streamInteraction.PixelMap>} allMaps - a `PixelMap` object for each offset in the Stream and one additional one for the end of the Stream.
   * @property {music21.stream.Stream} s - stream object
   * @property {music21.stream.Stream} notesAndRests - `this.stream.flat.notesAndRests`
   * @property {number} pixelScaling - `this.stream.renderOptions.scaleFactor.x`
   * @property {number} startX - (readonly) starting x
   * @property {number} maxX - (readonly) ending x
   * @property {Int} maxSystemIndex - the index of the last system.
   */
  streamInteraction.PixelMapper = function (s) {
      this.allMaps = [];
      this.stream = s;
      this.notesAndRests = this.stream.flat.notesAndRests;
      this.pixelScaling = s.renderOptions.scaleFactor.x;

      Object.defineProperties(this, {
          'startX': {
              enumerable: true,
              configurable: false,
              get: function () {
                  return this.allMaps[0].x;
              }
          },
          'maxX': {
              enumerable: true,
              configurable: false,
              get: function () {
                  var m = this.allMaps[this.allMaps.length - 1];
                  return m.x;
              }
          },
          'maxSystemIndex': {
              enumerable: true,
              configurable: false,
              get: function () {
                  return this.allMaps[this.allMaps.length - 1].systemIndex;
              }
          }
      });
      this.processStream(s);
  };

  /**
   * Creates `PixelMap` objects for every note in the stream, and an extra
   * one mapping the end of the final offset.
   * 
   * @memberof music21.streamInteraction.PixelMapper
   * @returns {Array<music21.streamInteraction.PixelMap>}
   */
  streamInteraction.PixelMapper.prototype.processStream = function () {
      var ns = this.notesAndRests;
      for (var i = 0; i < ns.length; i++) {
          var n = ns.get(i);
          this.addNoteToMap(n);
      }
      // prepare final map.
      var finalStave = ns.get(-1).activeVexflowNote.stave;
      var finalX = finalStave.x + finalStave.width;
      var endOffset = ns.get(-1).duration.quarterLength + ns.get(-1).offset;

      var lastMap = new streamInteraction.PixelMap(this, endOffset);
      lastMap.elements = [undefined];
      lastMap.x = finalX;
      lastMap.systemIndex = this.allMaps[this.allMaps.length - 1].systemIndex;
      this.allMaps.push(lastMap);
      return this.allMaps;
  };

  /**
   * Adds a {@link music21.base.Music21Object}, usually a {@link music21.note.Note} object,
   * to the maps for the PixelMapper if a {@link music21.streamInteraction.PixelMap} object
   * already exists at that location, or creates a new `PixelMap` if one does not exist.
   * 
   * @memberof music21.streamInteraction.PixelMapper
   * @param {music21.base.Music21Object} n - note or other object
   * @returns {music21.streamInteraction.PixelMap} PixelMap added to.
   */
  streamInteraction.PixelMapper.prototype.addNoteToMap = function (n) {
      var currentOffset = n.offset;
      var properMap = this.findMapForExactOffset(currentOffset);
      if (properMap !== undefined) {
          properMap.elements.push(n);
          return properMap;
      } else {
          var map = new streamInteraction.PixelMap(this, currentOffset);
          map.elements = [n];
          this.allMaps.push(map);
          return map;
      }
  };
  /**
   * Finds a `PixelMap` object if one matches this exact offset. Otherwise returns undefined
   * 
   * @memberof music21.streamInteraction.PixelMapper
   * @param {number} o offset
   * @returns {music21.streamInteraction.PixelMap|undefined}
   */
  streamInteraction.PixelMapper.prototype.findMapForExactOffset = function (o) {
      for (var j = this.allMaps.length - 1; j >= 0; j = j - 1) {
          // find the last map with this offset. searches backwards for speed.
          if (this.allMaps[j].offset == o) {
              return this.allMaps[j];
          }
      }
      return undefined;
  };

  /**
   *  returns an array of two pixel maps: the previous/current one and the
      next/current one (i.e., if the offset is exactly the offset of a pixel map
      the prevNoteMap and nextNoteMap will be the same; similarly if the offset is
      beyond the end of the score)
    * @memberof music21.streamInteraction.PixelMapper
   * @param {number} offset
   * @returns {Array<music21.streamInteraction.PixelMap|undefined>} returns two PixelMaps; or either (but not both) can be undefined
   * @example
   * var s = new music21.tinyNotation.TinyNotation('3/4 c4 d8 e f4 g4 a4 b4');
   * var can = s.appendNewCanvas();
   * var pm = new music21.streamInteraction.PixelMapper(s);
   * var pmaps = pm.getPixelMapsAropundOffset(1.25);
   * var prev = pmaps[0];
   * var next = pmaps[1];
   * prev.offset
   * // 1
   * next.offset
   * // 1.5
   * prev.x
   * // 97...
   * next.x
   * // 123...
   */
  streamInteraction.PixelMapper.prototype.getPixelMapsAroundOffset = function (offset) {
      var prevNoteMap = undefined;
      var nextNoteMap = undefined;
      for (var i = 0; i < this.allMaps.length; i++) {
          thisMap = this.allMaps[i];
          if (thisMap.offset <= offset) {
              prevNoteMap = thisMap;
          }
          if (thisMap.offset >= offset) {
              nextNoteMap = thisMap;
              break;
          }
      }
      if (prevNoteMap === undefined && nextNoteMap === undefined) {
          var lastNoteMap = this.allMaps[this.allMaps.length - 1];
          prevNoteMap = lastNoteMap;
          nextNoteMap = lastNoteMap;
      } else if (prevNoteMap === undefined) {
          prevNoteMap = nextNoteMap;
      } else if (nextNoteMap === undefined) {
          nextNoteMap = prevNoteMap;
      }
      return [prevNoteMap, nextNoteMap];
  };
  /**
   * Uses the stored offsetToPixelMaps to get the pixel X for the offset.
   * 
   * @memberof music21.streamInteraction.PixelMapper
   * @param {number} offset
   * @param {Array<music21.streamInteraction.PixelMap>} offsetToPixelMaps
   * @returns {number}
   * @example
   * var s = new music21.tinyNotation.TinyNotation('3/4 c4 d8 e f4 g4 a4 b4');
   * var can = s.appendNewCanvas();
   * var pm = new music21.streamInteraction.PixelMapper(s);
   * pm.getXAtOffset(0.0); // exact placement of a note
   * // 89.94...
   * pm.getXAtOffset(0.5); // between two notes
   * // 138.63...
   */
  streamInteraction.PixelMapper.prototype.getXAtOffset = function (offset) {
      // returns the proper 
      var twoNoteMaps = this.getPixelMapsAroundOffset(offset);
      var prevNoteMap = twoNoteMaps[0];
      var nextNoteMap = twoNoteMaps[1];
      var pixelScaling = this.pixelScaling;
      var offsetFromPrev = offset - prevNoteMap.offset;
      var offsetDistance = nextNoteMap.offset - prevNoteMap.offset;
      var pixelDistance = nextNoteMap.x - prevNoteMap.x;
      if (nextNoteMap.systemIndex != prevNoteMap.systemIndex) {
          var stave = prevNoteMap.elements[0].activeVexflowNote.stave;
          pixelDistance = (stave.x + stave.width) * pixelScaling - prevNoteMap.x;
      }
      var offsetToPixelScale = 0;
      if (offsetDistance != 0) {
          offsetToPixelScale = pixelDistance / offsetDistance;
      } else {
          offsetToPixelScale = 0;
      }
      var pixelsFromPrev = offsetFromPrev * offsetToPixelScale;
      var offsetX = prevNoteMap.x + pixelsFromPrev;
      return offsetX / pixelScaling;
  };

  /**
   * Uses the stored offsetToPixelMaps to get the systemIndex active at the current time.
   * 
   * @memberof music21.streamInteraction.PixelMapper
   * @param {number} offset
   * @returns {number} systemIndex of the offset
   */
  streamInteraction.PixelMapper.prototype.getSystemIndexAtOffset = function (offset) {
      var twoNoteMaps = this.getPixelMapsAroundOffset(offset);
      var prevNoteMap = twoNoteMaps[0];
      return prevNoteMap.systemIndex;
  };

  /*  PIXEL MAP */

  /**
   * A PixelMap maps one offset to one x location.
   * 
   * The offset does NOT have to be the offset of an element. Offsets are generally
   * measured from the start of the flat stream.
   * 
   * @class PixelMap
   * @memberof music21.streamInteraction
   * @param {music21.streamInteraction.PixelMapper} mapper - should eventually be a weakref...
   * @param {number} offset - the offset that is being mapped.
   * @property {Array<music21.base.Music21Object>} elements -- elements being mapped to.
   * @property {number} offset - the offset inputted
   * @property {number} x - x value in pixels for this offset 
   * @property {Int} systemIndex - the systemIndex at which this offset appears.
   * @example
   * // not a particularly realistic example, since it requires so much setup...
   * var s = new music21.tinyNotation.TinyNotation('3/4 c4 d8 e f4 g4 a4 b4');
   * var can = s.appendNewCanvas();
   * var pmapper = new music21.streamInteraction.PixelMapper(s);
   * var pmapA = new music21.streamInteraction.PixelMap(pmapper, 2.0);
   * pmapA.elements = [s.flat.get(3)];
   * pmapA.offset;
   * // 2
   * pmapA.x;
   * // 149.32...
   * pmapA.systemIndex
   * // 0
   */
  streamInteraction.PixelMap = function (mapper, offset) {
      this.pixelScaling = mapper.pixelScaling; // should be a Weakref...
      this.elements = [];
      this.offset = offset; // important
      this._x = undefined;
      this._systemIndex = undefined;

      Object.defineProperties(this, {
          'x': {
              enumerable: true,
              configurable: true,
              get: function () {
                  if (this._x !== undefined) {
                      return this._x;
                  } else {
                      if (this.elements.length == 0) {
                          return 0; // error!
                      } else {
                          return this.elements[0].x * this.pixelScaling;
                      }
                  }
              },
              set: function (x) {
                  this._x = x;
              }
          },
          'systemIndex': {
              enumerable: true,
              configurable: true,
              get: function () {
                  if (this._systemIndex !== undefined) {
                      return this._systemIndex;
                  } else {
                      if (this.elements.length == 0) {
                          return 0; // error!
                      } else {
                          return this.elements[0].systemIndex;
                      }
                  }
              },
              set: function (systemIndex) {
                  this._systemIndex = systemIndex;
              }
          }

      });
  };

  /*  NOT DONE YET */
  streamInteraction.CursorSelect = function (s) {
      this.stream = s;
      this.activeElementHierarchy = [undefined];
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/stream -- Streams -- objects that hold other Music21Objects
   * 
   * Does not implement the full features of music21p Streams by a long shot...
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006-14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * powerful stream module, See {@link music21.stream} namespace
   * @exports music21/stream
   */
  /**
   * Streams are powerful music21 objects that hold Music21Object collections,
   * such as {@link music21.note.Note} or {@link music21.chord.Chord} objects.
   * 
   * Understanding the {@link music21.stream.Stream} object is of fundamental
   * importance for using music21.  Definitely read the music21(python) tutorial
   * on using Streams before proceeding
   * 
   * @namespace music21.stream
   * @memberof music21
   * @requires music21/base
   * @requires music21/renderOptions
   * @requires music21/clef
   * @requires music21/vfShow
   * @requires music21/duration
   * @requires music21/common
   * @requires music21/meter
   * @requires music21/pitch
   * @requires music21/streamInteraction
   * @requires jquery
   */
  var stream = {};

  /**
   * A generic Stream class -- a holder for other music21 objects
   * Will be subclassed into {@link music21.stream.Score},
   * {@link music21.stream.Part},
   * {@link music21.stream.Measure},
   * {@link music21.stream.Voice}, but most functions will be found here.
   * 
   * @class Stream
   * @memberof music21.stream
   * @extends music21.base.Music21Object
   * 
   * @property {Array<music21.base.Music21Object>} elements - the elements in the stream. DO NOT MODIFY individual components (consider it like a Python tuple)
   * @property {Int} length - (readonly) the number of elements in the stream.
   * @property {music21.duration.Duration} duration - the total duration of the stream's elements
   * @property {music21.clef.Clef} clef - the clef for the Stream (if there is one; if there are multiple, then the first clef)
   * @property {music21.meter.TimeSignature} timeSignature - the first TimeSignature of the Stream
   * @property {music21.key.KeySignature} keySignature - the first KeySignature for the Stream
   * @property {music21.renderOptions.RenderOptions} renderOptions - an object specifying how to render the stream
   * @property {music21.stream.Stream} flat - (readonly) a flattened representation of the Stream
   * @property {music21.stream.Stream} notes - (readonly) the stream with only {@link music21.note.Note} and {@link music21.chord.Chord} objects included
   * @property {music21.stream.Stream} notesAndRests - (readonly) like notes but also with {@link music21.note.Rest} objects included
   * @property {music21.stream.Stream} parts - (readonly) a filter on the Stream to just get the parts (NON-recursive)
   * @property {music21.stream.Stream} measures - (readonly) a filter on the Stream to just get the measures (NON-recursive)
   * @property {number} tempo - tempo in beats per minute (will become more sophisticated later, but for now the whole stream has one tempo
   * @property {music21.instrument.Instrument|undefined} instrument - an instrument object associated with the stream (can be set with a string also, but will return an `Instrument` object)
   * @property {Boolean} autoBeam - whether the notes should be beamed automatically or not (will be moved to `renderOptions` soon)
   * @property {Int} [staffLines=5] - number of staff lines
   * @property {function|undefined} changedCallbackFunction - function to call when the Stream changes through a standard interface
   * @property {number} maxSystemWidth - confusing... should be in renderOptions
   */
  stream.Stream = function () {
      base.Music21Object.call(this);
      this.classes.push('Stream');
      this._duration = undefined;

      this._elements = [];
      this._elementOffsets = [];
      this._clef = undefined;
      this.displayClef = undefined;

      this._keySignature = undefined; // a music21.key.KeySignature object
      this._timeSignature = undefined; // a music21.meter.TimeSignature object
      this._instrument = undefined;

      this._autoBeam = undefined;
      this.activeVFStave = undefined;
      this.renderOptions = new renderOptions.RenderOptions();
      this._tempo = undefined;

      this.staffLines = 5;

      this._stopPlaying = false;
      this._allowMultipleSimultaneousPlays = true; // not implemented yet.
      this.changedCallbackFunction = undefined; // for editable canvases

      Object.defineProperties(this, {
          'duration': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this._duration !== undefined) {
                      return this._duration;
                  }
                  var highestTime = 0.0;
                  for (var i = 0; i < this.length; i++) {
                      var el = this.get(i);
                      var endTime = el.offset;
                      if (el.duration !== undefined) {
                          endTime += el.duration.quarterLength;
                      }
                      if (endTime > highestTime) {
                          highestTime = endTime;
                      }
                  }
                  return new duration.Duration(highestTime);
              },
              set: function (newDuration) {
                  this._duration = newDuration;
              }
          },
          'flat': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this.hasSubStreams()) {
                      var tempEls = [];
                      for (var i = 0; i < this.length; i++) {
                          var el = this.get(i);
                          //console.log(i, this.length);
                          if (el.elements !== undefined) {
                              var offsetShift = el.offset;
                              //console.log('offsetShift', offsetShift, el.classes[el.classes.length -1]);
                              var elFlat = el.flat;
                              for (var j = 0; j < elFlat.length; j++) {
                                  // offset should NOT be null because already in Stream
                                  elFlat.get(j).offset += offsetShift;
                              }
                              tempEls.push.apply(tempEls, elFlat._elements);
                          } else {
                              tempEls.push(el);
                          }
                      }
                      var newSt = this.clone(false);
                      newSt.elements = tempEls;
                      return newSt;
                  } else {
                      return this;
                  }
              }
          },
          'notes': {
              configurable: true,
              enumerable: true,
              get: function () {
                  return this.getElementsByClass(['Note', 'Chord']);
              }
          },
          'notesAndRests': {
              configurable: true,
              enumerable: true,
              get: function () {
                  return this.getElementsByClass('GeneralNote');
              }
          },

          'tempo': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this._tempo === undefined && this.activeSite !== undefined) {
                      return this.activeSite.tempo;
                  } else if (this._tempo === undefined) {
                      return 150;
                  } else {
                      return this._tempo;
                  }
              },
              set: function (newTempo) {
                  this._tempo = newTempo;
              }
          },
          'instrument': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this._instrument === undefined && this.activeSite !== undefined) {
                      return this.activeSite.instrument;
                  } else {
                      return this._instrument;
                  }
              },
              set: function (newInstrument) {
                  if (typeof newInstrument == 'string') {
                      newInstrument = new music21.instrument.Instrument(newInstrument);
                  }
                  this._instrument = newInstrument;
              }
          },
          'clef': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this._clef === undefined && this.activeSite === undefined) {
                      return new clef.Clef('treble');
                  } else if (this._clef === undefined) {
                      return this.activeSite.clef;
                  } else {
                      return this._clef;
                  }
              },
              set: function (newClef) {
                  this._clef = newClef;
              }
          },
          'keySignature': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this._keySignature === undefined && this.activeSite !== undefined) {
                      return this.activeSite.keySignature;
                  } else {
                      return this._keySignature;
                  }
              },
              set: function (newKeySignature) {
                  this._keySignature = newKeySignature;
              }
          },
          'timeSignature': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this._timeSignature === undefined && this.activeSite !== undefined) {
                      return this.activeSite.timeSignature;
                  } else {
                      return this._timeSignature;
                  }
              },
              set: function (newTimeSignature) {
                  if (typeof newTimeSignature == 'string') {
                      newTimeSignature = new meter.TimeSignature(newTimeSignature);
                  }
                  this._timeSignature = newTimeSignature;
              }
          },
          'autoBeam': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this._autoBeam === undefined && this.activeSite !== undefined) {
                      return this.activeSite.autoBeam;
                  } else if (this._autoBeam !== undefined) {
                      return this._autoBeam;
                  } else {
                      return true; // default...
                  }
              },
              set: function (ab) {
                  this._autoBeam = ab;
              }
          },
          'maxSystemWidth': {
              configurable: true,
              enumerable: true,
              get: function () {
                  var baseMaxSystemWidth = 750;
                  if (this.renderOptions.maxSystemWidth === undefined && this.activeSite !== undefined) {
                      baseMaxSystemWidth = this.activeSite.maxSystemWidth;
                  } else if (this.renderOptions.maxSystemWidth !== undefined) {
                      baseMaxSystemWidth = this.renderOptions.maxSystemWidth;
                  }
                  return baseMaxSystemWidth / this.renderOptions.scaleFactor.x;
              },
              set: function (newSW) {
                  this.renderOptions.maxSystemWidth = newSW * this.renderOptions.scaleFactor.x;
              }
          },
          'parts': {
              configurable: true,
              enumerable: true,
              get: function () {
                  var parts = [];
                  for (var i = 0; i < this.length; i++) {
                      var el = this.get(i);
                      if (el.isClassOrSubclass('Part')) {
                          parts.push(el);
                      }
                  }
                  return parts;
              }
          },
          'measures': {
              configurable: true,
              enumerable: true,
              /* TODO -- make it return a Stream.Part and not list. to match music21p
               * but okay for now */
              get: function () {
                  var measures = [];
                  for (var i = 0; i < this.length; i++) {
                      var el = this.get(i);
                      if (el.isClassOrSubclass('Measure')) {
                          measures.push(el);
                      }
                  }
                  return measures;
              }
          },
          'length': {
              configurable: true,
              enumerable: true,
              get: function () {
                  return this._elements.length;
              }
          },
          'elements': {
              configurable: true,
              enumerable: true,
              get: function () {
                  return this._elements;
              },
              set: function (newElements) {
                  //				    this._elements = newElements;
                  //				    
                  var highestOffsetSoFar = 0.0;
                  this._elements = [];
                  this._elementOffsets = [];
                  var tempInsert = [];
                  var i;
                  var thisEl;
                  for (i = 0; i < newElements.length; i++) {
                      thisEl = newElements[i];
                      var thisElOffset = thisEl.offset;
                      if (thisElOffset === null || thisElOffset == highestOffsetSoFar) {
                          // append
                          this._elements.push(thisEl);
                          thisEl.offset = highestOffsetSoFar;
                          this._elementOffsets.push(highestOffsetSoFar);
                          if (thisEl.duration === undefined) {
                              console.error("No duration for ", thisEl, " in ", this);
                          }
                          highestOffsetSoFar += thisEl.duration.quarterLength;
                      } else {
                          // append -- slow
                          tempInsert.push(thisEl);
                      }
                  }
                  //console.warn('end', highestOffsetSoFar, tempInsert);
                  for (i = 0; i < tempInsert.length; i++) {
                      thisEl = tempInsert[i];
                      this.insert(thisEl.offset, thisEl);
                  }
              }
          }
      });

      /**
       * A function bound to the current stream that
       * will changes the stream. Used in editableAccidentalCanvas, among other places.
       * 
       *      var can = s.appendNewCanvas();
       *      $(can).on('click', s.canvasChangerFunction);
       * 
       * @memberof music21.stream.Stream
       * @param {Event} e
       * @returns {music21.base.Music21Object|undefined} - returns whatever changedCallbackFunction does.
       */
      this.canvasChangerFunction = function (e) {
          var canvasElement = e.currentTarget;
          var _ = this.findNoteForClick(canvasElement, e),
              clickedDiatonicNoteNum = _[0],
              foundNote = _[1];
          if (foundNote === undefined) {
              if (music21.debug) {
                  console.log('No note found');
              }
              return undefined;
          }
          return this.noteChanged(clickedDiatonicNoteNum, foundNote, canvasElement);
      }.bind(this);
  };

  stream.Stream.prototype = new base.Music21Object();
  stream.Stream.prototype.constructor = stream.Stream;

  /* override protoM21Object.clone() */
  stream.Stream.prototype.clone = function (deep) {
      var ret = Object.create(this.constructor.prototype);
      for (var key in ret) {
          // not that we ONLY copy the keys in Ret -- it's easier that way.
          // maybe we should do (var key in this) -- but DANGEROUS...
          if (this.hasOwnProperty(key) === false) {
              continue;
          }
          if (key == 'activeSite') {
              ret[key] = this[key];
          } else if (key == 'renderOptions') {
              ret[key] = common.merge({}, this[key]);
          } else if (deep !== true && (key == '_elements' || key == '_elementOffsets')) {
              ret[key] = this[key].slice(); // shallow copy...
          } else if (deep && (key == '_elements' || key == '_elementOffsets')) {
              if (key == '_elements') {
                  //console.log('got elements for deepcopy');
                  ret._elements = [];
                  ret._elementOffsets = [];
                  for (var j = 0; j < this._elements.length; j++) {
                      ret._elementOffsets[j] = this._elementOffsets[j];
                      var el = this._elements[j];
                      //console.log('cloning el: ', el.name);
                      var elCopy = el.clone(deep);
                      elCopy.activeSite = ret;
                      ret._elements[j] = elCopy;
                  }
              }
          } else if (key == 'activeVexflowNote' || key == 'storedVexflowstave') {
              // do nothing -- do not copy vexflowNotes -- permanent recursion
          } else if (Object.getOwnPropertyDescriptor(this, key).get !== undefined || Object.getOwnPropertyDescriptor(this, key).set !== undefined) {
              // do nothing
          } else if (typeof this[key] == 'function') {
              // do nothing -- events might not be copied.
          } else if (this[key] !== null && this[key] !== undefined && this[key].isMusic21Object === true) {
              //console.log('cloning...', key);
              ret[key] = this[key].clone(deep);
          } else {
              ret[key] = this[key];
          }
      }
      return ret;
  };

  /**
   * Add an element to the end of the stream, setting its `.offset` accordingly
   * 
   * @memberof music21.stream.Stream
   * @param {music21.base.Music21Object} el - element to append
   * @returns {this}
   */
  stream.Stream.prototype.append = function (el) {
      try {
          if (el.isClassOrSubclass !== undefined && el.isClassOrSubclass('NotRest')) {
              // set stem direction on output...;         
          }
          var elOffset = 0.0;
          if (this._elements.length > 0) {
              var lastQL = this._elements[this._elements.length - 1].duration.quarterLength;
              elOffset = this._elementOffsets[this._elementOffsets.length - 1] + lastQL;
          }
          this._elementOffsets.push(elOffset);
          this._elements.push(el);
          el.offset = elOffset;
          el.activeSite = this; // would prefer weakref, but does not exist in JS.
      } catch (err) {
          console.error("Cannot append element ", el, " to stream ", this, " : ", err);
      }
      return this;
  };

  /**
   * Add an element to the specified place in the stream, setting its `.offset` accordingly
   * 
   * @memberof music21.stream.Stream
   * @param {number} offset - offset to place.
   * @param {music21.base.Music21Object} el - element to append
   * @returns {this}
   */
  stream.Stream.prototype.insert = function (offset, el) {
      try {
          if (el.isClassOrSubclass !== undefined && el.isClassOrSubclass('NotRest')) {
              // set stem direction on output
              // this.clef.setStemDirection(el);         
          }
          for (var i = 0; i < this._elements.length; i++) {
              var testOffset = this._elementOffsets[i];
              if (testOffset <= offset) {
                  continue;
              } else {
                  this._elementOffsets.splice(i, 0, offset);
                  this._elements.splice(i, 0, el);
                  el.offset = offset;
                  el.activeSite = this;
                  return;
              }
          }
          // no element found. insert at end;
          this._elementOffsets.push(offset);
          this._elements.push(el);
          el.offset = offset;
          el.activeSite = this; // would prefer weakref, but does not exist in JS.
      } catch (err) {
          console.error("Cannot insert element ", el, " to stream ", this, " : ", err);
      }
      return this;
  };

  /**
   * Remove and return the last element in the stream, or return undefined if the stream is empty
   * 
   * @memberof music21.stream.Stream
   * @returns {music21.base.Music21Object|undefined} last element in the stream
   */
  stream.Stream.prototype.pop = function () {
      //remove last element;
      if (this.length > 0) {
          var el = this.get(-1);
          this._elementOffsets.pop();
          this._elements.pop();
          return el;
      } else {
          return undefined;
      }
  };

  /**
   * Get the `index`th element from the Stream.  Equivalent to the
   * music21p format of s[index].  Can use negative indexing to get from the end.
   * 
   * @memberof music21.stream.Stream
   * @param {Int} index - can be -1, -2, to index from the end, like python
   * @returns {music21.base.Music21Object|undefined}
   */
  stream.Stream.prototype.get = function (index) {
      // substitute for Python stream __getitem__; supports -1 indexing, etc.
      var el;
      if (index === undefined) {
          return undefined;
      } else if (Math.abs(index) > this._elements.length) {
          return undefined;
      } else if (index == this._elements.length) {
          return undefined;
      } else if (index < 0) {
          el = this._elements[this._elements.length + index];
          el.offset = this._elementOffsets[this._elements.length + index];
          return el;
      } else {
          el = this._elements[index];
          el.offset = this._elementOffsets[index];
          return el;
      }
  };
  /*  --- ############# END ELEMENT FUNCTIONS ########## --- */

  /**
   * Returns Boolean about whether this stream contains any other streams.
   * 
   * @memberof music21.stream.Stream
   * @returns {Boolean}
   */
  stream.Stream.prototype.hasSubStreams = function () {
      var hasSubStreams = false;
      for (var i = 0; i < this.length; i++) {
          var el = this.elements[i];
          if (el.isClassOrSubclass('Stream')) {
              hasSubStreams = true;
              break;
          }
      }
      return hasSubStreams;
  };
  /**
   * Takes a stream and places all of its elements into
   * measures (:class:`~music21.stream.Measure` objects)
   * based on the :class:`~music21.meter.TimeSignature` objects
   * placed within
   * the stream. If no TimeSignatures are found in the
   * stream, a default of 4/4 is used.
    * If `options.inPlace` is true, the original Stream is modified and lost
   * if `options.inPlace` is False, this returns a modified deep copy.
    * @memberof music21.stream.Stream
   * @param {object} options
   * @returns {music21.stream.Stream}
   */
  stream.Stream.prototype.makeMeasures = function (options) {
      var params = {
          meterStream: undefined,
          refStreamOrTimeRange: undefined,
          searchContext: false,
          innerBarline: undefined,
          finalBarline: 'final',
          bestClef: false,
          inPlace: false
      };
      common.merge(params, options);
      if (this.hasVoices()) {
          voiceCount = srcObj.getElementsByClass('Voice').length;
      } else {
          voiceCount = 0;
      }
      // meterStream
      var meterStream = this.getElementsByClass('TimeSignature');
      if (meterStream.length === 0) {
          meterStream.append(this.timeSignature);
      }
      // getContextByClass('Clef')
      var clefObj = this.clef;
      var offsetMap = this.offsetMap();
      var oMax = 0;
      var i;
      for (i = 0; i < offsetMap.length; i++) {
          if (offsetMap[i].endTime > oMax) {
              oMax = offsetMap[i].endTime;
          }
      }
      //console.log('oMax: ', oMax);
      var post = new this.constructor();
      // derivation
      var o = 0.0;
      var measureCount = 0;
      var lastTimeSignature;
      var m;
      var mStart;
      while (true) {
          m = new stream.Measure();
          m.number = measureCount + 1;
          // var thisTimeSignature = meterStream.getElementAtOrBefore(o);
          var thisTimeSignature = this.timeSignature;
          if (measureCount === 0) {
              // simplified...
          }
          m.clef = clefObj;
          m.timeSignature = thisTimeSignature.clone();

          for (i = 0; i < voiceCount; i++) {
              var v = new stream.Voice();
              v.id = voiceIndex;
              m.insert(0, v);
          }
          post.insert(o, m);
          o += thisTimeSignature.barDuration.quarterLength;
          if (o >= oMax) {
              break;
          } else {
              measureCount += 1;
          }
      }
      var e;
      for (i = 0; i < offsetMap.length; i++) {
          var ob = offsetMap[i];
          e = ob.element;
          var start = ob.offset;
          var end = ob.endTime;
          var voiceIndex = ob.voiceIndex;

          // if 'Spanner' in e.classes;

          var match = false;
          lastTimeSignature = undefined;
          for (var j = 0; j < post.length; j++) {
              m = post.get(j); // nothing but measures...
              if (m.timeSignature !== undefined) {
                  lastTimeSignature = m.timeSignature;
              }
              mStart = m.getOffsetBySite(post);
              var mEnd = mStart + lastTimeSignature.barDuration.quarterLength;
              if (start >= mStart && start < mEnd) {
                  match = true;
                  break;
              }
          }
          // if not match, raise Exception;
          var oNew = start - mStart;
          if (m.clef === e) {
              continue;
          }
          if (oNew === 0 && e.isClassOrSubclass('TimeSignature')) {
              continue;
          }
          var insertStream = m;
          if (voiceIndex !== undefined) {
              insertStream = m.getElementsByClass('Voice').get(voiceIndex);
          }
          insertStream.insert(oNew, e);
      }
      // set barlines, etc.
      if (params.inPlace !== true) {
          return post;
      } else {
          this.elements = [];
          // endElements
          // elementsChanged;
          for (i = 0; i < post.length; i++) {
              e = post.get(i);
              this.insert(e.offset, e);
          }
          return this; // javascript style;
      }
  };

  /**
   * Returns true if any note in the stream has lyrics, otherwise false
   * 
   * @memberof music21.stream.Stream
   * @returns {Boolean}
   */
  stream.Stream.prototype.hasLyrics = function () {
      for (var i = 0; i < this.length; i++) {
          var el = this.elements[i];
          if (el.lyric !== undefined) {
              return true;
          }
      }
      return false;
  };

  /**
   * Returns a list of OffsetMap objects
   * 
   * @memberof music21.stream.Stream
   * @returns [music21.stream.OffsetMap]
   */
  stream.Stream.prototype.offsetMap = function () {
      var offsetMap = [];
      var groups = [];
      if (this.hasVoices()) {
          jquery.$.each(srcObj.getElementsByClass('Voice').elements, function (i, v) {
              groups.push([v.flat, i]);
          });
      } else {
          groups = [[this, undefined]];
      }
      for (var i = 0; i < groups.length; i++) {
          var group = groups[i][0];
          var voiceIndex = groups[i][1];
          for (var j = 0; j < group.length; j++) {
              var e = group.get(j);
              var dur = e.duration.quarterLength;
              var offset = e.offset; // TODO: getOffsetBySite(group)
              var endTime = offset + dur;
              var thisOffsetMap = new stream.OffsetMap(e, offset, endTime, voiceIndex);
              offsetMap.push(thisOffsetMap);
          }
      }
      return offsetMap;
  };

  /**
   * Find all elements with a certain class; if an Array is given, then any
   * matching class will work.
   * 
   * @memberof music21.stream.Stream
   * @param {Array<string>|string} classList - a list of classes to find
   * @returns {music21.stream.Stream}
   */
  stream.Stream.prototype.getElementsByClass = function (classList) {
      var tempEls = [];
      for (var i = 0; i < this.length; i++) {
          var thisEl = this.get(i);
          //console.warn(thisEl);
          if (thisEl.isClassOrSubclass === undefined) {
              console.err('what the hell is a ', thisEl, 'doing in a Stream?');
          } else if (thisEl.isClassOrSubclass(classList)) {
              tempEls.push(thisEl);
          }
      }
      var newSt = new stream.Stream(); // TODO: take Stream class Part, etc.
      newSt.elements = tempEls;
      return newSt;
  };
  /**
   * Sets Pitch.accidental.displayStatus for every element with a
   * pitch or pitches in the stream. If a natural needs to be displayed
   * and the Pitch does not have an accidental object yet, adds one.
   * 
   * Called automatically before appendCanvas routines are called.
   * 
   * @memberof music21.stream.Stream
   * @returns {music21.stream.Stream} this
   */
  stream.Stream.prototype.makeAccidentals = function () {
      // cheap version of music21p method
      var extendableStepList = {};
      var stepNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      var i;
      for (i = 0; i < stepNames.length; i++) {
          var stepName = stepNames[i];
          var stepAlter = 0;
          if (this.keySignature !== undefined) {
              var tempAccidental = this.keySignature.accidentalByStep(stepName);
              if (tempAccidental !== undefined) {
                  stepAlter = tempAccidental.alter;
                  //console.log(stepAlter + " " + stepName);
              }
          }
          extendableStepList[stepName] = stepAlter;
      }
      var lastOctaveStepList = [];
      var lastStepDict;
      var p;
      for (i = 0; i < 10; i++) {
          lastStepDict = jquery.$.extend({}, extendableStepList);
          lastOctaveStepList.push(lastStepDict);
      }
      var lastOctavelessStepDict = jquery.$.extend({}, extendableStepList); // probably unnecessary, but safe...
      for (var i = 0; i < this.length; i++) {
          var el = this.get(i);
          if (el.pitch !== undefined) {
              // note
              p = el.pitch;
              lastStepDict = lastOctaveStepList[p.octave];
              this._makeAccidentalForOnePitch(p, lastStepDict, lastOctavelessStepDict);
          } else if (el._notes !== undefined) {
              // chord
              for (var j = 0; j < el._notes.length; j++) {
                  p = el._notes[j].pitch;
                  lastStepDict = lastOctaveStepList[p.octave];
                  this._makeAccidentalForOnePitch(p, lastStepDict, lastOctavelessStepDict);
              }
          }
      }
      return this;
  };

  // returns pitch
  stream.Stream.prototype._makeAccidentalForOnePitch = function (p, lastStepDict, lastOctavelessStepDict) {
      var newAlter;
      if (p.accidental === undefined) {
          newAlter = 0;
      } else {
          newAlter = p.accidental.alter;
      }
      //console.log(p.name + " " + lastStepDict[p.step].toString());
      if (lastStepDict[p.step] != newAlter || lastOctavelessStepDict[p.step] != newAlter) {
          if (p.accidental === undefined) {
              p.accidental = new pitch.Accidental('natural');
          }
          p.accidental.displayStatus = true;
          //console.log("setting displayStatus to true");
      } else if (lastStepDict[p.step] == newAlter && lastOctavelessStepDict[p.step] == newAlter) {
          if (p.accidental !== undefined) {
              p.accidental.displayStatus = false;
          }
          //console.log("setting displayStatus to false");
      }
      lastStepDict[p.step] = newAlter;
      lastOctavelessStepDict[p.step] = newAlter;
      return p;
  };

  /**
   * Sets the render options for any substreams (such as placing them
   * in systems, etc.) DOES NOTHING for music21.stream.Stream, but is
   * overridden in subclasses.
   * 
   * @memberof music21.stream.Stream
   * @returns {music21.stream.Stream} this
   */
  stream.Stream.prototype.setSubstreamRenderOptions = function () {
      /* does nothing for standard streams ... */
      return this;
  };
  /**
   * Resets all the RenderOptions back to defaults. Can run recursively
   * and can also preserve the `RenderOptions.events` object.
   * 
   * @memberof music21.stream.Stream
   * @param {Boolean} [recursive=false]
   * @param {Boolean} [preserveEvents=false]
   * @returns {music21.stream.Stream} this
   */
  stream.Stream.prototype.resetRenderOptions = function (recursive, preserveEvents) {
      var oldEvents = this.renderOptions.events;
      this.renderOptions = new renderOptions.RenderOptions();
      if (preserveEvents) {
          this.renderOptions.events = oldEvents;
      }

      if (recursive) {
          for (var i = 0; i < this.length; i++) {
              var el = this.get(i);
              if (el.isClassOrSubclass('Stream')) {
                  el.resetRenderOptions(recursive, preserveEvents);
              }
          }
      }
      return this;
  };

  //**********  VexFlow functionality

  /**
   * Uses {@link music21.vfShow.Renderer} to render Vexflow onto an
   * existing canvas object.
   * 
   * Sets canvas.storedStream to this
   * 
   * Runs `this.setRenderInteraction` on the canvas.
   * 
   * Will be moved to vfShow eventually when converter objects are enabled...maybe.
   * 
   * @memberof music21.stream.Stream
   * @param {DOMObject|JQueryDOMObject} canvas - a canvas object
   * @returns {music21.stream.Stream} this
   */
  stream.Stream.prototype.renderVexflowOnCanvas = function (canvas) {
      if (canvas.jquery) {
          canvas = canvas[0];
      }
      var vfr = new vfShow.Renderer(this, canvas);
      vfr.render();
      canvas.storedStream = this;
      this.setRenderInteraction(canvas);
      return this;
  };

  /**
   * Estimate the stream height for the Stream.
   * 
   * If there are systems they will be incorporated into the height unless `ignoreSystems` is `true`.
   * 
   * @memberof music21.stream.Stream
   * @param {Boolean} [ignoreSystems=false]
   * @returns {number} height in pixels
   */
  stream.Stream.prototype.estimateStreamHeight = function (ignoreSystems) {
      var staffHeight = this.renderOptions.naiveHeight;
      var systemPadding = this.systemPadding;
      var numSystems;
      if (this.isClassOrSubclass('Score')) {
          var numParts = this.length;
          numSystems = this.numSystems();
          if (numSystems === undefined || ignoreSystems) {
              numSystems = 1;
          }
          var scoreHeight = numSystems * staffHeight * numParts + (numSystems - 1) * systemPadding;
          //console.log('scoreHeight of ' + scoreHeight);
          return scoreHeight;
      } else if (this.isClassOrSubclass('Part')) {
          numSystems = 1;
          if (!ignoreSystems) {
              numSystems = this.numSystems();
          }
          if (music21.debug) {
              console.log("estimateStreamHeight for Part: numSystems [" + numSystems + "] * staffHeight [" + staffHeight + "] + (numSystems [" + numSystems + "] - 1) * systemPadding [" + systemPadding + "].");
          }
          return numSystems * staffHeight + (numSystems - 1) * systemPadding;
      } else {
          return staffHeight;
      }
  };

  /**
   * Estimates the length of the Stream in pixels.
   * 
   * @memberof music21.stream.Stream
   * @returns {number} length in pixels
   */
  stream.Stream.prototype.estimateStaffLength = function () {
      var i;
      var totalLength;
      if (this.renderOptions.overriddenWidth !== undefined) {
          //console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
          return this.renderOptions.overriddenWidth;
      }
      if (this.hasVoices()) {
          var maxLength = 0;
          for (i = 0; i < this.length; i++) {
              var v = this.get(i);
              if (v.isClassOrSubclass('Stream')) {
                  var thisLength = v.estimateStaffLength() + v.renderOptions.staffPadding;
                  if (thisLength > maxLength) {
                      maxLength = thisLength;
                  }
              }
          }
          return maxLength;
      } else if (this.hasSubStreams()) {
          // part
          totalLength = 0;
          for (i = 0; i < this.length; i++) {
              var m = this.get(i);
              if (m.isClassOrSubclass('Stream')) {
                  totalLength += m.estimateStaffLength() + m.renderOptions.staffPadding;
                  if (i !== 0 && m.renderOptions.startNewSystem === true) {
                      break;
                  }
              }
          }
          return totalLength;
      } else {
          var rendOp = this.renderOptions;
          totalLength = 30 * this.length;
          totalLength += rendOp.displayClef ? 20 : 0;
          totalLength += rendOp.displayKeySignature && this.keySignature ? this.keySignature.width : 0;
          totalLength += rendOp.displayTimeSignature ? 30 : 0;
          //totalLength += rendOp.staffPadding;
          return totalLength;
      }
  };

  //****** MIDI related routines...

  /**
   * Plays the Stream through the MIDI/sound playback (for now, only MIDI.js is supported)
   * 
   * `options` can be an object containing:
   * - instrument: {@link music21.instrument.Instrument} object (default, `this.instrument`)
   * - tempo: number (default, `this.tempo`)
   * 
   * Does not have functionality for stopping etc., will be removed eventually
   * and replaced with something better in {@link music21.streamInteraction}
   * 
   * @memberof music21.stream.Stream
   * @param {object} [options] - object of playback options
   * @returns {music21.stream.Stream} this
   */
  stream.Stream.prototype.playStream = function (options) {
      var params = {
          instrument: this.instrument,
          tempo: this.tempo,
          done: undefined,
          startNote: undefined
      };
      common.merge(params, options);
      var startNote = params.startNote;
      var currentNote = 0;
      if (startNote !== undefined) {
          currentNote = startNote;
      }
      var flatEls = this.flat.elements;
      var lastNote = flatEls.length;
      this._stopPlaying = false;
      var thisStream = this;

      var playNext = function (elements, params) {
          if (currentNote < lastNote && !thisStream._stopPlaying) {
              var el = elements[currentNote];
              var nextNote;
              if (currentNote < lastNote + 1) {
                  nextNote = elements[currentNote + 1];
              }
              var milliseconds = 0;
              if (el.playMidi !== undefined) {
                  milliseconds = el.playMidi(params.tempo, nextNote, params);
              }
              currentNote += 1;
              setTimeout(function () {
                  playNext(elements, params);
              }, milliseconds);
          } else {
              if (params && params.done) {
                  params.done.call();
              }
          }
      };
      playNext(flatEls, params);
      return this;
  };

  /**
   * Stops a stream from playing if it currently is.
   * 
   * @memberof music21.stream.Stream
   * @returns {musci21.stream.Stream} this
   */
  stream.Stream.prototype.stopPlayStream = function () {
      // turns off all currently playing MIDI notes (on any stream) and stops playback.
      this._stopPlaying = true;
      for (var i = 0; i < 127; i++) {
          music21.MIDI.noteOff(0, i, 0);
      }
      return this;
  };
  /* ----------------------------------------------------------------------
   * 
   *  Canvas routines -- to be factored out eventually.
   * 
   */

  /**
   * Creates and returns a new `&lt;canvas&gt;` object.
   * 
   * Calls setSubstreamRenderOptions() first.
   * 
   * Does not render on canvas.
   * 
   * @memberof music21.stream.Stream
   * @param {number|string|undefined} width - will use `this.estimateStaffLength()` + `this.renderOptions.staffPadding` if not given
   * @param {number|string|undefined} height - if undefined will use `this.renderOptions.height`. If still undefined, will use `this.estimateStreamHeight()`
   * @returns {JQueryDOMObject} canvas in jquery.
   */
  stream.Stream.prototype.createNewCanvas = function (width, height) {
      if (this.hasSubStreams()) {
          this.setSubstreamRenderOptions();
      }

      var newCanvas = jquery.$('<canvas/>'); //.css('border', '1px red solid');

      if (width !== undefined) {
          if (typeof width == 'string') {
              width = common.stripPx(width);
          }
          newCanvas.attr('width', width);
      } else {
          var computedWidth = this.estimateStaffLength() + this.renderOptions.staffPadding + 0;
          newCanvas.attr('width', computedWidth);
      }
      if (height !== undefined) {
          newCanvas.attr('height', height);
      } else {
          var computedHeight;
          if (this.renderOptions.height === undefined) {
              computedHeight = this.estimateStreamHeight();
              //console.log('computed Height estim: ' + computedHeight);
          } else {
              computedHeight = this.renderOptions.height;
              //console.log('computed Height: ' + computedHeight);
          }
          newCanvas.attr('height', computedHeight * this.renderOptions.scaleFactor.y);
      }
      return newCanvas;
  };

  /**
   * Creates a rendered, playable canvas where clicking plays it.
   * 
   * Called from appendNewCanvas() etc.
   * 
   * @memberof music21.stream.Stream
   * @param {number|string|undefined} width
   * @param {number|string|undefined} height
   * @returns {JQueryDOMObject} canvas
   */
  stream.Stream.prototype.createPlayableCanvas = function (width, height) {
      this.renderOptions.events.click = 'play';
      return this.createCanvas(width, height);
  };

  /**
   * Creates a new canvas and renders vexflow on it
   * 
   * @memberof music21.stream.Stream
   * @param {number|string|undefined} [width]
   * @param {number|string|undefined} [height]
   * @returns {JQueryDOMObject} canvas
   */
  stream.Stream.prototype.createCanvas = function (width, height) {
      var $newCanvas = this.createNewCanvas(width, height);
      this.renderVexflowOnCanvas($newCanvas);
      return $newCanvas;
  };
  /**
   * Creates a new canvas, renders vexflow on it, and appends it to the DOM.
   * 
   * @memberof music21.stream.Stream
   * @param {JQueryDOMObject|DOMObject} [appendElement=document.body] - where to place the canvas
   * @param {number|string} [width]
   * @param {number|string} [height]
   * @returns {DOMObject} canvas (not the jQueryDOMObject -- this is a difference with other routines and should be fixed. TODO: FIX)
   * 
   */
  stream.Stream.prototype.appendNewCanvas = function (appendElement, width, height) {
      if (appendElement === undefined) {
          appendElement = 'body';
      }
      var $appendElement = appendElement;
      if (appendElement.jquery === undefined) {
          $appendElement = jquery.$(appendElement);
      }

      //        if (width === undefined && this.renderOptions.maxSystemWidth === undefined) {
      //            var $bodyElement = bodyElement;
      //            if (bodyElement.jquery === undefined) {
      //                $bodyElement = $(bodyElement);
      //            }
      //            width = $bodyElement.width();
      //        };
      //        
      var canvasBlock = this.createCanvas(width, height);
      $appendElement.append(canvasBlock);
      return canvasBlock[0];
  };

  /**
   * Replaces a particular Canvas with a new rendering of one.
   * 
   * Note that if 'where' is empty, will replace all canvases on the page.
   * 
   * @memberof music21.stream.Stream
   * @param {JQueryDOMObject|DOMObject} [where] - the canvas to replace or a container holding the canvas(es) to replace.
   * @param {Boolean} [preserveCanvasSize=false]
   * @returns {JQueryDOMObject} the canvas
   */
  stream.Stream.prototype.replaceCanvas = function (where, preserveCanvasSize) {
      // if called with no where, replaces all the canvases on the page...
      if (where === undefined) {
          where = 'body';
      }
      var $where;
      if (where.jquery === undefined) {
          $where = jquery.$(where);
      } else {
          $where = where;
          where = $where[0];
      }
      var $oldCanvas;
      if ($where.prop('tagName') == 'CANVAS') {
          $oldCanvas = $where;
      } else {
          $oldCanvas = $where.find('canvas');
      }
      // TODO: Max Width!
      if ($oldCanvas.length === 0) {
          throw "No canvas defined for replaceCanvas!";
      } else if ($oldCanvas.length > 1) {
          // change last canvas...
          // replacing each with canvasBlock doesn't work
          // anyhow, it just resizes the canvas but doesn't
          // draw.
          $oldCanvas = jquery.$($oldCanvas[$oldCanvas.length - 1]);
      }

      var canvasBlock;
      if (preserveCanvasSize) {
          var width = $oldCanvas.width();
          var height = $oldCanvas.height();
          canvasBlock = this.createCanvas(width, height);
      } else {
          canvasBlock = this.createCanvas();
      }

      $oldCanvas.replaceWith(canvasBlock);
      return canvasBlock;
  };

  /**
   * Renders a canvas which has a scrollbar when clicked.
   * 
   * (this is a dumb way of doing this.  Expect it to disappear...)
   * 
   * @memberof music21.stream.Stream
   * @param {JQueryDOMObject|DOMObject} [where]
   * @returns {DOMObject} canvas
   */
  stream.Stream.prototype.renderScrollableCanvas = function (where) {
      var $where = where;
      if (where === undefined) {
          $where = jquery.$(document.body);
      } else if (where.jquery === undefined) {
          $where = jquery.$(where);
      }
      var $innerDiv = jquery.$("<div>").css('position', 'absolute');
      var c;
      this.renderOptions.events.click = function (storedThis) {
          return function (event) {
              storedThis.scrollScoreStart(c, event);
          };
      }(this); // create new function with this stream as storedThis
      c = this.appendNewCanvas($innerDiv);
      this.setRenderInteraction($innerDiv);
      $where.append($innerDiv);
      return c;
  };

  /**
   * Sets up a {@link music21.streamInteraction.ScrollPlayer} for this
   * canvas.
   * 
   * @memberof music21.stream.Stream
   * @param {DOMObject} c - canvas
   * @param {Event} [event] - the event that caused the scrolling to start
   * (needed because `event.stopPropagation()` is called)
   * @returns {music21.streamInteraction.ScrollPlayer}
   */
  stream.Stream.prototype.scrollScoreStart = function (c, event) {
      var scrollPlayer = new streamInteraction.ScrollPlayer(this, c);
      scrollPlayer.startPlaying();
      if (event !== undefined) {
          event.stopPropagation();
      }
      return scrollPlayer;
  };

  /**
   * Set the type of interaction on the canvas based on 
   *    - Stream.renderOptions.events.click
   *    - Stream.renderOptions.events.dblclick
   *    - Stream.renderOptions.events.resize
   *    
   * Currently the only options available for each are:
   *    - 'play' (string)
   *    - 'reflow' (string; only on event.resize)
   *    - customFunction (will receive event as a first variable; should set up a way to
   *                    find the original stream; var s = this; var f = function () { s...}
   *                   )
   * @memberof music21.stream.Stream
   * @param {DOMObject} canvasOrDiv - canvas or the Div surrounding it.
   * @returns {music21.stream.Stream} this
   */
  stream.Stream.prototype.setRenderInteraction = function (canvasOrDiv) {
      var $canvas = canvasOrDiv;
      if (canvasOrDiv === undefined) {
          return;
      } else if (canvasOrDiv.jquery === undefined) {
          $canvas = jquery.$(canvasOrDiv);
      }
      // TODO: assumes that canvas has a .storedStream function? can this be done by setting
      // a variable var storedStream = this; and thus get rid of the assumption?
      var playFunc = function () {
          this.playStream();
      }.bind(this);

      jquery.$.each(this.renderOptions.events, jquery.$.proxy(function (eventType, eventFunction) {
          $canvas.off(eventType);
          if (typeof eventFunction == 'string' && eventFunction == 'play') {
              $canvas.on(eventType, playFunc);
          } else if (typeof eventFunction == 'string' && eventType == 'resize' && eventFunction == 'reflow') {
              this.windowReflowStart($canvas);
          } else if (eventFunction !== undefined) {
              $canvas.on(eventType, eventFunction);
          }
      }, this));
      return this;
  };

  /**
   * 
   * Recursively search downward for the closest storedVexflowStave...
   *
   * @memberof music21.stream.Stream
   * @returns {Vex.Flow.Stave|undefined}
   */
  stream.Stream.prototype.recursiveGetStoredVexflowStave = function () {
      var storedVFStave = this.storedVexflowStave;
      if (storedVFStave === undefined) {
          if (!this.hasSubStreams()) {
              return undefined;
          } else {
              var subStreams = this.getElementsByClass('Stream');
              storedVFStave = subStreams.get(0).storedVexflowStave;
              if (storedVFStave === undefined) {
                  // TODO: bad programming ... should support continuous recurse
                  // but good enough for now...
                  if (subStreams.get(0).hasSubStreams()) {
                      storedVFStave = subStreams.get(0).get(0).storedVexflowStave;
                  }
              }
          }
      }
      return storedVFStave;
  };

  /**
   * Given a mouse click, or other event with .pageX and .pageY,
   * find the x and y for the canvas.
   * 
   * @memberof music21.stream.Stream
   * @param {DOMObject} canvas
   * @param {Event} e
   * @returns {Array<number>} two-elements, [x, y] in pixels.
   */
  stream.Stream.prototype.getUnscaledXYforCanvas = function (canvas, e) {
      var offset = null;
      if (canvas === undefined) {
          offset = { left: 0, top: 0 };
      } else {
          offset = jquery.$(canvas).offset();
      }
      /*
       * mouse event handler code from: http://diveintohtml5.org/canvas.html
       */
      var xClick, yClick;
      if (e.pageX !== undefined && e.pageY !== undefined) {
          xClick = e.pageX;
          yClick = e.pageY;
      } else {
          xClick = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          yClick = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      var xPx = xClick - offset.left;
      var yPx = yClick - offset.top;
      return [xPx, yPx];
  };

  /**
   * return a list of [scaledX, scaledY] for
   * a canvas element.
   * 
   * xScaled refers to 1/scaleFactor.x -- for instance, scaleFactor.x = 0.7 (default)
   * x of 1 gives 1.42857...
   * 
   * @memberof music21.stream.Stream
   * @param {DOMObject} canvas
   * @param {Event} e
   * @returns {Array<number>} [scaledX, scaledY]
   */
  stream.Stream.prototype.getScaledXYforCanvas = function (canvas, e) {
      var _ = this.getUnscaledXYforCanvas(canvas, e);
      var xPx = _[0];
      var yPx = _[1];
      var pixelScaling = this.renderOptions.scaleFactor;

      var yPxScaled = yPx / pixelScaling.y;
      var xPxScaled = xPx / pixelScaling.x;
      return [xPxScaled, yPxScaled];
  };
  /**
   * 
   * Given a Y position find the diatonicNoteNum that a note at that position would have.
   * 
   * searches this.storedVexflowStave
   * 
   * Y position must be offset from the start of the stave...
   *
   * @memberof music21.stream.Stream
   * @param {number} yPxScaled
   * @returns {Int}
   */
  stream.Stream.prototype.diatonicNoteNumFromScaledY = function (yPxScaled) {
      var storedVFStave = this.recursiveGetStoredVexflowStave();
      //for (var i = -10; i < 10; i++) {
      //    console.log("line: " + i + " y: " + storedVFStave.getYForLine(i));
      //}
      var lineSpacing = storedVFStave.options.spacing_between_lines_px;
      var linesAboveStaff = storedVFStave.options.space_above_staff_ln;

      var notesFromTop = yPxScaled * 2 / lineSpacing;
      var notesAboveLowestLine = (storedVFStave.options.num_lines - 1 + linesAboveStaff) * 2 - notesFromTop;
      var clickedDiatonicNoteNum = this.clef.lowestLine + Math.round(notesAboveLowestLine);
      return clickedDiatonicNoteNum;
  };

  /**
   * 
   * Return the note at pixel X (or within allowablePixels [default 10])
   * of the note.
   * 
   * systemIndex element is not used on bare Stream
    * @memberof music21.stream.Stream
   * @param {number} xPxScaled
   * @param {number} [allowablePixels=10]
   * @param {number} [unused_systemIndex]
   * @returns {music21.base.Music21Object|undefined}
   */
  stream.Stream.prototype.noteElementFromScaledX = function (xPxScaled, allowablePixels, unused_systemIndex) {
      var foundNote;
      if (allowablePixels === undefined) {
          allowablePixels = 10;
      }

      for (var i = 0; i < this.length; i++) {
          var n = this.get(i);
          /* should also
           * compensate for accidentals...
           */
          if (xPxScaled > n.x - allowablePixels && xPxScaled < n.x + n.width + allowablePixels) {
              foundNote = n;
              break; /* O(n); can be made O(log n) */
          }
      }
      //console.log(n.pitch.nameWithOctave);
      return foundNote;
  };

  /**
   * Given an event object, and an x and y location, returns a two-element array
   * of the pitch.Pitch.diatonicNoteNum that was clicked (i.e., if C4 was clicked this
   * will return 29; if D4 was clicked this will return 30) and the closest note in the
   * stream that was clicked.
   * 
   * Return a list of [diatonicNoteNum, closestXNote]
   * for an event (e) called on the canvas (canvas)
   *
   * @memberof music21.stream.Stream
   * @param {DOMObject} canvas
   * @param {Event} e
   * @param {number} x
   * @param {number} y
   * @returns {Array} [diatonicNoteNum, closestXNote]
   */
  stream.Stream.prototype.findNoteForClick = function (canvas, e, x, y) {
      if (x === undefined || y === undefined) {
          var _ = this.getScaledXYforCanvas(canvas, e);
          x = _[0];
          y = _[1];
      }
      var clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(y);
      var foundNote = this.noteElementFromScaledX(x);
      return [clickedDiatonicNoteNum, foundNote];
  };

  /**
   * Change the pitch of a note given that it has been clicked and then
   * call changedCallbackFunction
   * 
   * To be removed...
   * 
   * @memberof music21.stream.Stream
   * @param {Int} clickedDiatonicNoteNum
   * @param {music21.base.Music21Object} foundNote
   * @param {DOMObject} canvas
   * @returns {any} output of changedCallbackFunction
   */
  stream.Stream.prototype.noteChanged = function (clickedDiatonicNoteNum, foundNote, canvas) {
      var n = foundNote;
      p = new pitch.Pitch("C");
      p.diatonicNoteNum = clickedDiatonicNoteNum;
      p.accidental = n.pitch.accidental;
      n.pitch = p;
      n.stemDirection = undefined;
      this.activeNote = n;
      this.redrawCanvas(canvas);
      if (this.changedCallbackFunction !== undefined) {
          return this.changedCallbackFunction({ foundNote: n, canvas: canvas });
      }
  };
  /**
   * Redraws a canvas, keeping the events of the previous canvas.
   * 
   * @memberof music21.stream.Stream
   * @param {DOMObject} canvas
   * @returns {music21.stream.Stream} this
   */
  stream.Stream.prototype.redrawCanvas = function (canvas) {
      //this.resetRenderOptions(true, true); // recursive, preserveEvents
      //this.setSubstreamRenderOptions();
      var $canvas = jquery.$(canvas); // works even if canvas is already $jquery
      var $newCanv = this.createNewCanvas(canvas.width, canvas.height);
      this.renderVexflowOnCanvas($newCanv);
      $canvas.replaceWith($newCanv);
      common.jQueryEventCopy(jquery.$.event, $canvas, $newCanv); /* copy events -- using custom extension... */
      return this;
  };

  /**
   * Renders a stream on a canvas with the ability to edit it and
   * a toolbar that allows the accidentals to be edited.
   * 
   * @memberof music21.stream.Stream
   * @param {number} [width]
   * @param {number} [height]
   * @returns {DOMObject} &lt;div&gt; tag around the canvas.
   */
  stream.Stream.prototype.editableAccidentalCanvas = function (width, height) {
      /*
       * Create an editable canvas with an accidental selection bar.
       */
      var d = jquery.$("<div/>").css('text-align', 'left').css('position', 'relative');
      var buttonDiv = this.getAccidentalToolbar();
      d.append(buttonDiv);
      d.append(jquery.$("<br clear='all'/>"));
      this.renderOptions.events.click = this.canvasChangerFunction;
      this.appendNewCanvas(d, width, height); // var can =
      return d;
  };

  /*
   * Canvas toolbars...
   */

  /**
   * 
   * @memberof music21.stream.Stream
   * @param {Int} minAccidental - alter of the min accidental (default -1)
   * @param {Int} maxAccidental - alter of the max accidental (default 1)
   * @returns {DOMObject} the accidental toolbar.
   */
  stream.Stream.prototype.getAccidentalToolbar = function (minAccidental, maxAccidental) {
      if (minAccidental === undefined) {
          minAccidental = -1;
      }
      if (maxAccidental === undefined) {
          maxAccidental = 1;
      }
      minAccidental = Math.round(minAccidental);
      maxAccidental = Math.round(maxAccidental);

      var addAccidental = function (clickedButton, alter) {
          /*
           * To be called on a button...
           *   this will usually refer to a window Object
           */
          var accidentalToolbar = jquery.$(clickedButton).parent();
          var siblingCanvas = accidentalToolbar.parent().find("canvas");
          var s = siblingCanvas[0].storedStream;
          if (s.activeNote !== undefined) {
              n = s.activeNote;
              n.pitch.accidental = new pitch.Accidental(alter);
              /* console.log(n.pitch.name); */
              s.redrawCanvas(siblingCanvas[0]);
              if (s.changedCallbackFunction !== undefined) {
                  s.changedCallbackFunction({ canvas: siblingCanvas[0] });
              }
          }
      };

      var buttonDiv = jquery.$("<div/>").attr('class', 'buttonToolbar vexflowToolbar').css('position', 'absolute').css('top', '10px');
      buttonDiv.append(jquery.$("<span/>").css('margin-left', '50px'));
      var clickFunc = function () {
          addAccidental(this, jquery.$(this).data('alter'));
      };
      for (var i = minAccidental; i <= maxAccidental; i++) {
          var acc = new music21.pitch.Accidental(i);
          buttonDiv.append(jquery.$("<button>" + acc.unicodeModifier + "</button>").data('alter', i).click(clickFunc)
          //                                .css('font-family', 'Bravura')
          //                                .css('font-size', '40px')
          );
      }
      return buttonDiv;
  };
  /**
   * 
   * @memberof music21.stream.Stream
   * @returns {DOMObject} a play toolbar
   */
  stream.Stream.prototype.getPlayToolbar = function () {
      var buttonDiv = jquery.$("<div/>").attr('class', 'playToolbar vexflowToolbar').css('position', 'absolute').css('top', '10px');
      buttonDiv.append(jquery.$("<span/>").css('margin-left', '50px'));
      buttonDiv.append(jquery.$("<button>&#9658</button>").click(function () {
          this.playStream();
      }.bind(this)));
      buttonDiv.append(jquery.$("<button>&#9724</button>").click(function () {
          this.stopPlayStream();
      }.bind(this)));
      return buttonDiv;
  };
  // reflow

  /**
   * Begins a series of bound events to the window that makes it
   * so that on resizing the stream is redrawn and reflowed to the 
   * new size.
   * 
   * @memberof music21.stream.Stream
   * @param {JQueryDOMObject} jCanvas
   * @returns {music21.stream.Stream} this
   */
  stream.Stream.prototype.windowReflowStart = function (jCanvas) {
      // set up a bunch of windowReflow bindings that affect the canvas.
      var callingStream = this;
      var jCanvasNow = jCanvas;
      jquery.$(window).bind('resizeEnd', function () {
          //do something, window hasn't changed size in 500ms
          var jCanvasParent = jCanvasNow.parent();
          var newWidth = jCanvasParent.width();
          var canvasWidth = newWidth;
          //console.log(canvasWidth);
          console.log('resizeEnd triggered', newWidth);
          //console.log(callingStream.renderOptions.events.click);
          callingStream.resetRenderOptions(true, true); // recursive, preserveEvents
          //console.log(callingStream.renderOptions.events.click);
          callingStream.maxSystemWidth = canvasWidth - 40;
          jCanvasNow.remove();
          var canvasObj = callingStream.appendNewCanvas(jCanvasParent);
          jCanvasNow = jquery.$(canvasObj);
      });
      jquery.$(window).resize(function () {
          if (this.resizeTO) {
              clearTimeout(this.resizeTO);
          }
          this.resizeTO = setTimeout(function () {
              jquery.$(this).trigger('resizeEnd');
          }, 200);
      });
      setTimeout(function () {
          var $window = jquery.$(window);
          var doResize = $window.data('triggerResizeOnCreateCanvas');
          if (doResize === undefined || doResize === true) {
              jquery.$(this).trigger('resizeEnd');
              $window.data('triggerResizeOnCreateCanvas', false);
          }
      }, 1000);
      return this;
  };
  /**
   * Does this stream have a {@link music21.stream.Voice} inside it?
   * 
   * @memberof music21.stream.Stream
   * @returns {Boolean}
   */
  stream.Stream.prototype.hasVoices = function () {
      for (var i = 0; i < this.length; i++) {
          var el = this.get(i);
          if (el.isClassOrSubclass('Voice')) {
              return true;
          }
      }
      return false;
  };

  /**
   * 
   * @class Voice
   * @memberof music21.stream
   * @extends music21.stream.Stream
   */
  stream.Voice = function () {
      stream.Stream.call(this);
      this.classes.push('Voice');
  };

  stream.Voice.prototype = new stream.Stream();
  stream.Voice.prototype.constructor = stream.Voice;

  /**
   * @class Measure
   * @memberof music21.stream
   * @extends music21.stream.Stream
   */
  stream.Measure = function () {
      stream.Stream.call(this);
      this.classes.push('Measure');
      this.number = 0; // measure number
  };

  stream.Measure.prototype = new stream.Stream();
  stream.Measure.prototype.constructor = stream.Measure;

  /**
   * Part -- specialized to handle Measures inside it
   * 
   * @class Part
      * @memberof music21.stream 
      * @extends music21.stream.Stream
   */
  stream.Part = function () {
      stream.Stream.call(this);
      this.classes.push('Part');
      this.systemHeight = this.renderOptions.naiveHeight;
  };

  stream.Part.prototype = new stream.Stream();
  stream.Part.prototype.constructor = stream.Part;
  /**
   * How many systems does this Part have? 
   * 
   * Does not change any reflow information, so by default it's always 1.
   * 
      * @memberof music21.stream.Part
   * @returns {Number}
   */
  stream.Part.prototype.numSystems = function () {
      var numSystems = 0;
      var subStreams = this.getElementsByClass('Stream');
      for (var i = 0; i < subStreams.length; i++) {
          if (subStreams.get(i).renderOptions.startNewSystem) {
              numSystems++;
          }
      }
      if (numSystems === 0) {
          numSystems = 1;
      }
      return numSystems;
  };

  /**
   * Find the width of every measure in the Part.
   * 
   * @memberof music21.stream.Part
   * @returns {Array<number>}
   */
  stream.Part.prototype.getMeasureWidths = function () {
      /* call after setSubstreamRenderOptions */
      var measureWidths = [];
      for (var i = 0; i < this.length; i++) {
          var el = this.get(i);
          if (el.isClassOrSubclass('Measure')) {
              var elRendOp = el.renderOptions;
              measureWidths[elRendOp.measureIndex] = elRendOp.width;
          }
      }
      /* console.log(measureWidths);
       * 
       */
      return measureWidths;
  };
  /**
   * Overrides the default music21.stream.Stream#estimateStaffLength
   * 
   * @memberof music21.stream.Part
   * @returns {number}
   */
  stream.Part.prototype.estimateStaffLength = function () {
      if (this.renderOptions.overriddenWidth !== undefined) {
          //console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
          return this.renderOptions.overriddenWidth;
      }
      if (this.hasSubStreams()) {
          // part with Measures underneath
          var totalLength = 0;
          var subStreams = this.getElementsByClass('Measure');
          for (var i = 0; i < subStreams.length; i++) {
              var m = subStreams.get(i);
              // this looks wrong, but actually seems to be right. moving it to
              // after the break breaks things.
              totalLength += m.estimateStaffLength() + m.renderOptions.staffPadding;
              if (i !== 0 && m.renderOptions.startNewSystem === true) {
                  break;
              }
          }
          return totalLength;
      }
      // no measures found in part... treat as measure
      var tempM = new stream.Measure();
      tempM.elements = this.elements;
      return tempM.estimateStaffLength();
  };
  /**
   * Divide a part up into systems and fix the measure
   * widths so that they are all even.
   * 
   * Note that this is done on the part level even though
   * the measure widths need to be consistent across parts.
   * 
   * This is possible because the system is deterministic and
   * will come to the same result for each part.  Opportunity
   * for making more efficient through this...
   * 
   * @memberof music21.stream.Part
   * @param systemHeight
   * @returns {Array}
   */
  stream.Part.prototype.fixSystemInformation = function (systemHeight) {
      /* 
       * console.log('system height: ' + systemHeight);
       */
      if (systemHeight === undefined) {
          systemHeight = this.systemHeight; /* part.show() called... */
      } else {
          if (music21.debug) {
              console.log('overridden systemHeight: ' + systemHeight);
          }
      }
      var systemPadding = this.renderOptions.systemPadding || this.renderOptions.naiveSystemPadding;
      var measureWidths = this.getMeasureWidths();
      var maxSystemWidth = this.maxSystemWidth; /* of course fix! */
      var systemCurrentWidths = [];
      var systemBreakIndexes = [];
      var lastSystemBreak = 0; /* needed to ensure each line has at least one measure */
      var startLeft = 20; /* TODO: make it obtained elsewhere */
      var currentLeft = startLeft;
      var i;
      for (i = 0; i < measureWidths.length; i++) {
          var currentRight = currentLeft + measureWidths[i];
          /* console.log("left: " + currentLeft + " ; right: " + currentRight + " ; m: " + i); */
          if (currentRight > maxSystemWidth && lastSystemBreak != i) {
              systemBreakIndexes.push(i - 1);
              systemCurrentWidths.push(currentLeft);
              //console.log('setting new width at ' + currentLeft);
              currentLeft = startLeft + measureWidths[i];
              lastSystemBreak = i;
          } else {
              currentLeft = currentRight;
          }
      }
      //console.log(systemCurrentWidths);
      //console.log(systemBreakIndexes);

      var currentSystemIndex = 0;
      var leftSubtract = 0;
      for (i = 0; i < this.length; i++) {
          var m = this.get(i);
          if (m.renderOptions === undefined) {
              continue;
          }
          if (i === 0) {
              m.renderOptions.startNewSystem = true;
          }
          currentLeft = m.renderOptions.left;

          if (jquery.$.inArray(i - 1, systemBreakIndexes) != -1) {
              /* first measure of new System */
              leftSubtract = currentLeft - 20;
              m.renderOptions.displayClef = true;
              m.renderOptions.displayKeySignature = true;
              m.renderOptions.startNewSystem = true;
              currentSystemIndex++;
          } else if (i !== 0) {
              m.renderOptions.startNewSystem = false;
              m.renderOptions.displayClef = false;
              m.renderOptions.displayKeySignature = false;
          }
          m.renderOptions.systemIndex = currentSystemIndex;
          var currentSystemMultiplier;
          if (currentSystemIndex >= systemCurrentWidths.length) {
              /* last system... non-justified */
              currentSystemMultiplier = 1;
          } else {
              var currentSystemWidth = systemCurrentWidths[currentSystemIndex];
              currentSystemMultiplier = maxSystemWidth / currentSystemWidth;
              //console.log('systemMultiplier: ' + currentSystemMultiplier + ' max: ' + maxSystemWidth + ' current: ' + currentSystemWidth);
          }
          /* might make a small gap? fix? */
          var newLeft = currentLeft - leftSubtract;
          //console.log('M: ' + i + ' ; old left: ' + currentLeft + ' ; new Left: ' + newLeft);
          m.renderOptions.left = Math.floor(newLeft * currentSystemMultiplier);
          m.renderOptions.width = Math.floor(m.renderOptions.width * currentSystemMultiplier);
          var newTop = m.renderOptions.top + currentSystemIndex * (systemHeight + systemPadding);
          //console.log('M: ' + i + '; New top: ' + newTop + " ; old Top: " + m.renderOptions.top);
          m.renderOptions.top = newTop;
      }

      return systemCurrentWidths;
  };
  /**
   * overrides music21.stream.Stream#setSubstreamRenderOptions
   * 
   * figures out the `.left` and `.top` attributes for all contained measures
   * 
   * @memberof music21.stream.Part
   */
  stream.Part.prototype.setSubstreamRenderOptions = function () {
      var currentMeasureIndex = 0; /* 0 indexed for now */
      var currentMeasureLeft = 20;
      var rendOp = this.renderOptions;
      var lastTimeSignature;
      var lastKeySignature;
      var lastClef;

      for (var i = 0; i < this.length; i++) {
          var el = this.get(i);
          if (el.isClassOrSubclass('Measure')) {
              var elRendOp = el.renderOptions;
              elRendOp.measureIndex = currentMeasureIndex;
              elRendOp.top = rendOp.top;
              elRendOp.partIndex = rendOp.partIndex;
              elRendOp.left = currentMeasureLeft;

              if (currentMeasureIndex === 0) {
                  lastClef = el._clef;
                  lastTimeSignature = el._timeSignature;
                  lastKeySignature = el._keySignature;

                  elRendOp.displayClef = true;
                  elRendOp.displayKeySignature = true;
                  elRendOp.displayTimeSignature = true;
              } else {
                  if (el._clef !== undefined && lastClef !== undefined && el._clef.name != lastClef.name) {
                      console.log('changing clefs for ', elRendOp.measureIndex, ' from ', lastClef.name, ' to ', el._clef.name);
                      lastClef = el._clef;
                      elRendOp.displayClef = true;
                  } else {
                      elRendOp.displayClef = false;
                  }

                  if (el._keySignature !== undefined && lastKeySignature !== undefined && el._keySignature.sharps != lastKeySignature.sharps) {
                      lastKeySignature = el._keySignature;
                      elRendOp.displayKeySignature = true;
                  } else {
                      elRendOp.displayKeySignature = false;
                  }

                  if (el._timeSignature !== undefined && lastTimeSignature !== undefined && el._timeSignature.ratioString != lastTimeSignature.ratioString) {
                      lastTimeSignature = el._timeSignature;
                      elRendOp.displayTimeSignature = true;
                  } else {
                      elRendOp.displayTimeSignature = false;
                  }
              }
              elRendOp.width = el.estimateStaffLength() + elRendOp.staffPadding;
              elRendOp.height = el.estimateStreamHeight();
              currentMeasureLeft += elRendOp.width;
              currentMeasureIndex++;
          }
      }
      return this;
  };
  /**
   * Overrides the default music21.stream.Stream#findNoteForClick
   * by taking into account systems
   * 
   * @memberof music21.stream.Part
   * @param {DOMObject} canvas
   * @param {Event} e
   * @returns {Array} [clickedDiatonicNoteNum, foundNote]
   */
  stream.Part.prototype.findNoteForClick = function (canvas, e) {
      var _ = this.getScaledXYforCanvas(canvas, e);
      var x = _[0];
      var y = _[1];

      //music21.debug = true;
      if (music21.debug) {
          console.log('this.estimateStreamHeight(): ' + this.estimateStreamHeight() + " / $(canvas).height(): " + jquery.$(canvas).height());
      }
      var systemPadding = this.renderOptions.systemPadding;
      if (systemPadding === undefined) {
          systemPadding = this.renderOptions.naiveSystemPadding;
      }
      var systemIndex = Math.floor(y / (this.systemHeight + systemPadding));
      var scaledYRelativeToSystem = y - systemIndex * (this.systemHeight + systemPadding);
      var clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(scaledYRelativeToSystem);

      var foundNote = this.noteElementFromScaledX(x, undefined, systemIndex);
      return [clickedDiatonicNoteNum, foundNote];
  };

  /**
   * Override the noteElementFromScaledX for Stream
   * to take into account sub measures...
   * 
   * @memberof music21.stream.Part
   * @param {number} scaledX
   * @param {number} allowablePixels
   * @param {Int} systemIndex
   * @returns {music21.base.Music21Object|undefined}
   */
  stream.Part.prototype.noteElementFromScaledX = function (scaledX, allowablePixels, systemIndex) {
      var gotMeasure;
      for (var i = 0; i < this.length; i++) {
          // TODO: if not measure, do not crash...
          var m = this.get(i);
          var rendOp = m.renderOptions;
          var left = rendOp.left;
          var right = left + rendOp.width;
          var top = rendOp.top;
          var bottom = top + rendOp.height;
          if (music21.debug) {
              console.log("Searching for X:" + Math.round(scaledX) + " in M " + i + " with boundaries L:" + left + " R:" + right + " T: " + top + " B: " + bottom);
          }
          if (scaledX >= left && scaledX <= right) {
              if (systemIndex === undefined) {
                  gotMeasure = m;
                  break;
              } else if (rendOp.systemIndex == systemIndex) {
                  gotMeasure = m;
                  break;
              }
          }
      }
      if (gotMeasure) {
          return gotMeasure.noteElementFromScaledX(scaledX, allowablePixels);
      }
  };

  /**
   * Scores with multiple parts
   * 
   * @class Score
   * @memberof music21.stream
   * @extends music21.stream.Stream
   */
  stream.Score = function () {
      stream.Stream.call(this);
      this.classes.push('Score');
      this.measureWidths = [];
      this.partSpacing = this.renderOptions.naiveHeight;

      Object.defineProperties(this, {
          'systemPadding': {
              enumerable: true,
              configurable: true,
              get: function () {
                  var numParts = this.parts.length;
                  var systemPadding = this.renderOptions.systemPadding;
                  if (systemPadding === undefined) {
                      if (numParts == 1) {
                          systemPadding = this.renderOptions.naiveSystemPadding; // fix to 0
                      } else {
                          systemPadding = this.renderOptions.naiveSystemPadding;
                      }
                  }
                  return systemPadding;
              }
          }
      });
  };

  stream.Score.prototype = new stream.Stream();
  stream.Score.prototype.constructor = stream.Score;
  /**
   * overrides music21.stream.Stream#setSubstreamRenderOptions
   * 
   * figures out the `.left` and `.top` attributes for all contained parts
   * 
   * @memberof music21.stream.Score
   * @returns {music21.stream.Score} this
   */
  stream.Score.prototype.setSubstreamRenderOptions = function () {
      var currentPartNumber = 0;
      var currentPartTop = 0;
      var partSpacing = this.partSpacing;
      var i, el;
      for (i = 0; i < this.length; i++) {
          el = this.get(i);

          if (el.isClassOrSubclass('Part')) {
              el.renderOptions.partIndex = currentPartNumber;
              el.renderOptions.top = currentPartTop;
              el.setSubstreamRenderOptions();
              currentPartTop += partSpacing;
              currentPartNumber++;
          }
      }
      this.evenPartMeasureSpacing();
      var ignoreNumSystems = true;
      var currentScoreHeight = this.estimateStreamHeight(ignoreNumSystems);
      for (i = 0; i < this.length; i++) {
          el = this.get(i);
          if (el.isClassOrSubclass('Part')) {
              el.fixSystemInformation(currentScoreHeight);
          }
      }
      this.renderOptions.height = this.estimateStreamHeight();
      return this;
  };
  /**
   * Overrides the default music21.stream.Stream#estimateStaffLength
   * 
   * @memberof music21.stream.Score
   * @returns {number}
   */
  stream.Score.prototype.estimateStaffLength = function () {
      // override
      if (this.renderOptions.overriddenWidth !== undefined) {
          //console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
          return this.renderOptions.overriddenWidth;
      }
      for (var i = 0; i < this.length; i++) {
          var p = this.get(i);
          if (p.isClassOrSubclass('Part')) {
              return p.estimateStaffLength();
          }
      }
      // no parts found in score... use part...
      console.log('no parts found in score');
      var tempPart = new stream.Part();
      tempPart.elements = this.elements;
      return tempPart.estimateStaffLength();
  };

  /* MIDI override */
  /**
   * Overrides the default music21.stream.Stream#playStream
   * 
   * Works crappily -- just starts *n* midi players.
   * 
   * Render scrollable score works better...
   * 
   * @memberof music21.stream.Score
   * @param {object} params -- passed to each part
   * @returns {music21.stream.Score} this
   */
  stream.Score.prototype.playStream = function (params) {
      // play multiple parts in parallel...
      for (var i = 0; i < this.length; i++) {
          var el = this.get(i);
          if (el.isClassOrSubclass('Part')) {
              el.playStream(params);
          }
      }
      return this;
  };
  /**
   * Overrides the default music21.stream.Stream#stopPlayScore()
   * 
   * @memberof music21.stream.Score
   * @returns {music21.stream.Score} this
   */
  stream.Score.prototype.stopPlayStream = function () {
      for (var i = 0; i < this.length; i++) {
          var el = this.get(i);
          if (el.isClassOrSubclass('Part')) {
              el.stopPlayStream();
          }
      }
      return this;
  };
  /*
   * Canvas routines
   */
  /**
   * call after setSubstreamRenderOptions
   * gets the maximum measure width for each measure
   * by getting the maximum for each measure of
   * Part.getMeasureWidths();
   * 
   * Does this work? I found a bug in this and fixed it that should have
   * broken it!
   * 
   * @memberof music21.stream.Score
   * @returns {Array<number>}
   */
  stream.Score.prototype.getMaxMeasureWidths = function () {
      var maxMeasureWidths = [];
      var measureWidthsArrayOfArrays = [];
      var i;
      // TODO: Do not crash on not partlike...
      for (i = 0; i < this.length; i++) {
          var el = this.get(i);
          measureWidthsArrayOfArrays.push(el.getMeasureWidths());
      }
      for (i = 0; i < measureWidthsArrayOfArrays[0].length; i++) {
          var maxFound = 0;
          for (var j = 0; j < this.length; j++) {
              if (measureWidthsArrayOfArrays[j][i] > maxFound) {
                  maxFound = measureWidthsArrayOfArrays[j][i];
              }
          }
          maxMeasureWidths.push(maxFound);
      }
      //console.log(measureWidths);
      return maxMeasureWidths;
  };

  /**
   * @memberof music21.stream.Score
   * @param {DOMObject} canvas
   * @param {Event} e
   * @returns {Array} [diatonicNoteNum, m21Element]
   */
  stream.Score.prototype.findNoteForClick = function (canvas, e) {
      /**
       * Returns a list of [clickedDiatonicNoteNum, foundNote] for a
       * click event, taking into account that the note will be in different
       * Part objects (and different Systems) given the height and possibly different Systems.
       * 
       */
      var _ = this.getScaledXYforCanvas(canvas, e);
      var x = _[0];
      var y = _[1];

      var numParts = this.parts.length;
      var systemHeight = numParts * this.partSpacing + this.systemPadding;
      var systemIndex = Math.floor(y / systemHeight);
      var scaledYFromSystemTop = y - systemIndex * systemHeight;
      var partIndex = Math.floor(scaledYFromSystemTop / this.partSpacing);
      var scaledYinPart = scaledYFromSystemTop - partIndex * this.partSpacing;
      //console.log('systemIndex: ' + systemIndex + " partIndex: " + partIndex);
      var rightPart = this.get(partIndex);
      var clickedDiatonicNoteNum = rightPart.diatonicNoteNumFromScaledY(scaledYinPart);

      var foundNote = rightPart.noteElementFromScaledX(x, undefined, systemIndex);
      return [clickedDiatonicNoteNum, foundNote];
  };

  /**
   * How many systems are there? Calls numSystems() on the first part.
   * 
   * @memberof music21.stream.Score
   * @returns {Int}
   */
  stream.Score.prototype.numSystems = function () {
      return this.getElementsByClass('Part').get(0).numSystems();
  };

  /**
   * Fixes the part measure spacing for all parts.
   * 
   * @memberof music21.stream.Score
   * @returns {music21.stream.Score} this
   */
  stream.Score.prototype.evenPartMeasureSpacing = function () {
      var measureStacks = [];
      var currentPartNumber = 0;
      var maxMeasureWidth = [];
      var i, j;
      for (i = 0; i < this.length; i++) {
          var el = this.get(i);
          if (el.isClassOrSubclass('Part')) {
              var measureWidths = el.getMeasureWidths();
              for (j = 0; j < measureWidths.length; j++) {
                  var thisMeasureWidth = measureWidths[j];
                  if (measureStacks[j] === undefined) {
                      measureStacks[j] = [];
                      maxMeasureWidth[j] = thisMeasureWidth;
                  } else {
                      if (thisMeasureWidth > maxMeasureWidth[j]) {
                          maxMeasureWidth[j] = thisMeasureWidth;
                      }
                  }
                  measureStacks[j][currentPartNumber] = thisMeasureWidth;
              }
              currentPartNumber++;
          }
      }
      var currentLeft = 20;
      for (i = 0; i < maxMeasureWidth.length; i++) {
          // TODO: do not assume, only elements in Score are Parts and in Parts are Measures...
          var measureNewWidth = maxMeasureWidth[i];
          for (j = 0; j < this.length; j++) {
              var part = this.get(j);
              var measure = part.get(i);
              var rendOp = measure.renderOptions;
              rendOp.width = measureNewWidth;
              rendOp.left = currentLeft;
          }
          currentLeft += measureNewWidth;
      }
      return this;
  };

  // small Class; a namedtuple in music21p
  stream.OffsetMap = function (element, offset, endTime, voiceIndex) {
      this.element = element;
      this.offset = offset;
      this.endTime = endTime;
      this.voiceIndex = voiceIndex;
  };

  // Tests...

  stream.tests = function () {
      test("music21.stream.Stream", function () {
          var s = new music21.stream.Stream();
          s.append(new music21.note.Note("C#5"));
          s.append(new music21.note.Note("D#5"));
          var n = new music21.note.Note("F5");
          n.duration.type = 'half';
          s.append(n);
          equal(s.length, 3, "Simple stream length");
      });

      test("music21.stream.Stream.duration", function () {
          var s = new music21.stream.Stream();
          equal(s.duration.quarterLength, 0, "EmptyString QuarterLength");
          s.append(new music21.note.Note("C#5"));
          equal(s.duration.quarterLength, 1.0, "1 quarter QuarterLength");
          var n = new music21.note.Note("F5");
          n.duration.type = 'half';
          s.append(n);
          equal(s.duration.quarterLength, 3.0, "3 quarter QuarterLength");
          s.duration = new music21.duration.Duration(3.0);
          s.append(new music21.note.Note("D#5"));
          equal(s.duration.quarterLength, 3.0, "overridden duration -- remains");

          var sc = new music21.stream.Score();
          var p1 = new music21.stream.Part();
          var p2 = new music21.stream.Part();
          var m1 = new music21.stream.Measure();
          var m2 = new music21.stream.Measure();
          var n11 = new music21.note.Note();
          var n12 = new music21.note.Note();
          n12.duration.type = 'half';
          var n13 = new music21.note.Note();
          n13.duration.type = 'eighth'; // incomplete measure
          m1.append(n11);
          m1.append(n12);
          m1.append(n13);
          var n21 = new music21.note.Note();
          n21.duration.type = 'whole';
          m2.append(n21);
          p1.append(m1);
          p2.append(m2);
          sc.insert(0, p1);
          sc.insert(0, p2);
          equal(sc.duration.quarterLength, 4.0, 'duration of streams with nested parts');
          equal(sc.flat.duration.quarterLength, 4.0, 'duration of flat stream with overlapping notes');
          n21.duration.type = 'half';
          equal(sc.duration.quarterLength, 3.5, 'new duration with nested parts');
          equal(sc.flat.duration.quarterLength, 3.5, 'new duration of flat stream');
      });

      test("music21.stream.Stream.insert and offsets", function () {
          var s = new music21.stream.Stream();
          s.append(new music21.note.Note("C#5"));
          var n3 = new music21.note.Note("E5");
          s.insert(2.0, n3);
          var n2 = new music21.note.Note("D#5");
          s.insert(1.0, n2);
          equal(s.get(0).name, 'C#');
          equal(s.get(1).name, 'D#');
          equal(s.get(2).name, 'E');
          equal(s.get(0).offset, 0.0);
          equal(s.get(1).offset, 1.0);
          equal(s.get(2).offset, 2.0);
          var p = new music21.stream.Part();
          var m1 = new music21.stream.Measure();
          var n1 = new music21.note.Note("C#");
          n1.duration.type = 'whole';
          m1.append(n1);
          var m2 = new music21.stream.Measure();
          n2 = new music21.note.Note("D#");
          n2.duration.type = 'whole';
          m2.append(n2);
          p.append(m1);
          p.append(m2);
          equal(p.get(0).get(0).offset, 0.0);
          var pf = p.flat;
          equal(pf.get(1).offset, 4.0);
          var pf2 = p.flat; // repeated calls do not change
          equal(pf2.get(1).offset, 4.0, 'repeated calls do not change offset');
          var pf3 = pf2.flat;
          equal(pf3.get(1).offset, 4.0, '.flat.flat does not change offset');
      });

      test("music21.stream.Stream.canvas", function () {
          var s = new music21.stream.Stream();
          s.append(new music21.note.Note("C#5"));
          s.append(new music21.note.Note("D#5"));
          var n = new music21.note.Note("F5");
          n.duration.type = 'half';
          s.append(n);
          var c = s.createNewCanvas(100, 50);
          equal(c.attr('width'), 100, 'stored width matches');
          equal(c.attr('height'), 50, 'stored height matches');
      });

      test("music21.stream.Stream.getElementsByClass", function () {
          var s = new music21.stream.Stream();
          var n1 = new music21.note.Note("C#5");
          var n2 = new music21.note.Note("D#5");
          var r = new music21.note.Rest();
          var tc = new music21.clef.TrebleClef();
          s.append(tc);
          s.append(n1);
          s.append(r);
          s.append(n2);
          var c = s.getElementsByClass('Note');
          equal(c.length, 2, 'got two notes');
          equal(c.get(0), n1, 'n1 first');
          equal(c.get(1), n2, 'n2 second');
          c = s.getElementsByClass('Clef');
          equal(c.length, 1, 'got clef from subclass');
          c = s.getElementsByClass(['Note', 'TrebleClef']);
          equal(c.length, 3, 'got multiple classes');
          c = s.getElementsByClass('GeneralNote');
          equal(c.length, 3, 'got multiple subclasses');
      });
      test("music21.stream.offsetMap", function () {
          var n = new music21.note.Note("G3");
          var o = new music21.note.Note("A3");
          var s = new music21.stream.Measure();
          s.insert(0, n);
          s.insert(0.5, o);
          var om = s.offsetMap();
          equal(om.length, 2, 'offsetMap should have length 2');
          var omn = om[0];
          var omo = om[1];
          equal(omn.element, n, 'omn element should be n');
          equal(omn.offset, 0.0, 'omn offset should be 0');
          equal(omn.endTime, 1.0, 'omn endTime should be 1.0');
          equal(omn.voiceIndex, undefined, 'omn voiceIndex should be undefined');
          equal(omo.element, o, 'omo element should be o');
          equal(omo.offset, 0.5, 'omo offset should be 0.5');
          equal(omo.endTime, 1.5, 'omo endTime should be 1.5');
      });
      test("music21.stream.Stream appendNewCanvas ", function () {
          var n = new music21.note.Note("G3");
          var s = new music21.stream.Measure();
          s.append(n);
          s.appendNewCanvas(document.body);
          equal(s.length, 1, 'ensure that should have one note');
          var n1 = new music21.note.Note("G3");
          var s1 = new music21.stream.Measure();
          s1.append(n1);
          var n2 = new music21.note.Note("G3");
          s1.append(n2);
          var n3 = new music21.note.Note("G3");
          s1.append(n3);
          var n4 = new music21.note.Note("G3");
          s1.append(n4);
          var div1 = s1.editableAccidentalCanvas();
          jquery.$(document.body).append(div1);
      });
  };

  // future -- rewrite of Score and Part to Page, System, SystemPart
  //     not currently used
  /**
   * Does not work yet, so not documented
   * 
   */
  var layout = {};
  layout.makeLayoutFromScore = function (score, containerWidth) {
      /*
       * Divide a part up into systems and fix the measure
       * widths so that they are all even.
       * 
       * Note that this is done on the part level even though
       * the measure widths need to be consistent across parts.
       * 
       * This is possible because the system is deterministic and
       * will come to the same result for each part.  Opportunity
       * for making more efficient through this...
       */
      //var systemHeight = score.systemHeight; /* part.show() called... */
      //var systemPadding = score.systemPadding;
      var parts = score.parts;
      //console.log(parts);
      var numParts = parts.length;
      var partZero = parts[0];
      var numMeasures = partZero.length;

      var measureWidths = partZero.getMeasureWidths();
      var maxSystemWidth = containerWidth || score.maxSystemWidth; /* of course fix! */

      var layoutScore = new music21.layout.LayoutScore();
      var currentPage = new music21.layout.Page(); // to-do multiple pages...
      currentPage.measureStart = 1;
      currentPage.measureEnd = numMeasures;

      layoutScore.insert(0, currentPage);

      var currentSystem = new music21.layout.System();
      currentSystemNumber = 1;
      currentSystem.measureStart = 1;

      //var currentStaves = [];
      var staffMaker = function (staffHolder, numParts, measureStart) {
          for (var pNum = 0; pNum < numParts; pNum++) {
              var staff = new music21.layout.Staff();
              staff.measureStart = measureStart;
              staff.staffNumber = pNum + 1;
              staffHolder.push(staff);
          }
      };
      staffMaker(currentStaves, numParts, 1);

      var systemCurrentWidths = [];
      var systemBreakIndexes = [];
      var lastSystemBreak = 0; /* needed to ensure each line has at least one measure */
      var startLeft = 20; /* TODO: make it obtained elsewhere */
      var currentLeft = startLeft;
      var currentSystemTop = 0;
      //var partTopOffsets = [];
      var ignoreSystemsInCalculatingScoreHeight = true;
      var systemHeight = score.estimateStreamHeight(ignoreSystemsInCalculatingScoreHeight);

      for (var i = 0; i < measureWidths.length; i++) {
          var currentRight = currentLeft + measureWidths[i];
          /* console.log("left: " + currentLeft + " ; right: " + currentRight + " ; m: " + i); */
          if (currentRight > maxSystemWidth && lastSystemBreak != i) {
              // new system...
              for (var j = 0; j < currentStaves.length; j++) {
                  currentStaves.measureEnd = i;
                  currentSystem.insert(0, currentStaves[j]);
              }
              currentStaves = [];
              staffMaker(currentStaves, numParts, i + 1);
              currentSystemTop += systemHeight;
              currentSystem.measureEnd = i;
              currentPage.insert(0, currentSystem);
              currentSystemNumber += 1;
              currentSystem = new music21.layout.System();
              currentSystem.measureStart = i + 1;
              currentSystem.systemNumber = currentSystemNumber;

              systemBreakIndexes.push(i - 1);
              systemCurrentWidths.push(currentLeft);
              console.log('setting new width at ' + currentLeft + ' measure ' + i);
              currentLeft = startLeft + measureWidths[i];
              lastSystemBreak = i;
          } else {
              currentLeft = currentRight;
          }
          for (var pNum = 0; pNum < currentStaves.length; pNum++) {
              currentStaves[pNum].append(parts[pNum].get(i));
          }
      }
      for (var j = 0; j < currentStaves.length; j++) {
          currentStaves.measureEnd = measureWidths.length - 1;
          currentSystem.insert(0, currentStaves[j]);
      }
      currentPage.insert(0, currentSystem);
      return layoutScore;
  };

  layout.LayoutScore = function () {
      stream.Score.call(this);
      this.classes.push('LayoutScore');
      this.scoreLayout = undefined;
      this.measureStart = undefined;
      this.measureEnd = undefined;
      this._width = undefined;
      this.height = undefined;
      this.top = 0;
      this.left = 0;
      Object.defineProperties(this, {
          'pages': {
              configurable: true,
              enumerable: true,
              get: function () {
                  return this.getElementsByClass('Page');
              }
          },
          'width': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this._width) {
                      return this._width;
                  } else if (this.activeSite) {
                      return this.activeSite.width;
                  }
              }
          }
      });
  };
  layout.LayoutScore.prototype = new stream.Score();
  layout.LayoutScore.prototype.constructor = layout.LayoutScore;

  /**
   * return a tuple of (top, bottom) for a staff, specified by a given pageId,
   * systemId, and staffId in PIXELS.
    * @param pageId
   * @param systemId
   * @param staffId
   * @param units -- "pixels" or "tenths" (not supported)
   */

  layout.LayoutScore.prototype.getPositionForStaff = function (pageId, systemId, staffId, units) {
      units = units || "pixels";
  };

  /**
   * All music must currently be on page 1.
   */
  layout.Page = function () {
      stream.Score.call(this);
      this.classes.push('Page');
      this.pageNumber = 1;
      this.measureStart = undefined;
      this.measureEnd = undefined;
      this.systemStart = undefined;
      this.systemEnd = undefined;
      this.pageLayout = undefined;
      Object.defineProperties(this, {
          'systems': {
              configurable: true,
              enumerable: true,
              get: function () {
                  return this.getElementsByClass('System');
              }
          },
          'width': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this._width) {
                      return this._width;
                  } else if (this.activeSite) {
                      return this.activeSite.width;
                  }
              }
          }
      });
  };
  layout.Page.prototype = new stream.Score();
  layout.Page.prototype.constructor = layout.Page;

  layout.System = function () {
      stream.Score.call(this);
      this.classes.push('System');
      this.systemNumber = 1;
      this.systemLayout = undefined;
      this.measureStart = undefined;
      this.measureEnd = undefined;
      this._width = undefined;
      this.height = undefined;
      this.top = undefined;
      this.left = undefined;
      Object.defineProperties(this, {
          'staves': {
              configurable: true,
              enumerable: true,
              get: function () {
                  return this.getElementsByClass('Staff');
              }
          },
          'width': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this._width) {
                      return this._width;
                  } else if (this.activeSite) {
                      return this.activeSite.width;
                  }
              }
          }
      });
  };
  layout.System.prototype = new stream.Score();
  layout.System.prototype.constructor = layout.System;

  layout.Staff = function () {
      stream.Part.call(this);
      this.classes.push('Staff');
      this.staffNumber = 1;
      this.optimized = 0;
      this.top = undefined;
      this.left = undefined;
      this._width = undefined;
      this.height = undefined;
      this.inheritedHeight = undefined;
      this.staffLayout = undefined;
      Object.defineProperties(this, {
          'width': {
              configurable: true,
              enumerable: true,
              get: function () {
                  if (this._width) {
                      return this._width;
                  } else if (this.activeSite) {
                      return this.activeSite.width;
                  }
              }
          }
      });
  };
  layout.Staff.prototype = new stream.Part();
  layout.Staff.prototype.constructor = layout.Staff;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/roman -- roman.RomanNumberal -- Chord subclass
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /**
   * Roman numeral module. See {@link music21.roman} namespace
   * 
   * @exports music21/roman
   */
  /**
   * music21.roman -- namespace for dealing with RomanNumeral analysis.
   * 
   * @namespace music21.roman
   * @memberof music21
   * @requires music21/chord
   * @requires music21/key
   * @requires music21/pitch
   * @requires music21/interval
   */
  var roman = {};

  /**
   * maps an index number to a roman numeral in lowercase 
   * 
   * @memberof music21.roman
   * @example
   * music21.roman.romanToNumber[4]
   * // 'iv'
   */
  roman.romanToNumber = [undefined, 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

  /**
   * Represents a RomanNumeral.  By default, capital Roman Numerals are
   * major chords; lowercase are minor.
   * 
   * see music21p's roman module for better instructions.
   * 
      * current limitations:
      * 
      * no inversions
      * no numeric figures except 7
      * no d7 = dominant 7
      * no frontAlterationAccidentals
      * no secondary dominants
      * no Aug6th chords
   * 
   * @class RomanNumeral
   * @memberof music21.roman
   * @extends music21.chord.Chord
   * @param {string} figure - the roman numeral as a string, e.g., 'IV', 'viio', 'V7'
   * @param {string|music21.key.Key} [keyStr='C']
   * @property {Array<music21.pitch.Pitch>} scale - (readonly) returns the scale associated with the roman numeral
   * @property {music21.key.Key} key - the key associated with the RomanNumeral (not allowed to be undefined yet)
   * @property {string} figure - the figure as passed in
   * @property {string} degreeName - the name associated with the scale degree, such as "mediant" etc., scale 7 will be "leading tone" or "subtonic" appropriately
   * @property {Int} scaleDegree
   * @property {string} impliedQuality - "major", "minor", "diminished", "augmented"
   * @property {Array<music21.pitch.Pitch>} pitches - RomanNumerals are Chord objects, so .pitches will work for them also.
   */
  roman.RomanNumeral = function (figure, keyStr) {
  				this.figure = figure;
  				this._scale = undefined;
  				this._key = undefined;
  				chord.Chord.call(this);
  				this.classes.push('RomanNumeral');

  				Object.defineProperties(this, {
  								'scale': {
  												enumerable: true,
  												get: function () {
  																if (this._scale != undefined) {
  																				return this._scale;
  																} else {
  																				this._scale = this.key.getScale();
  																				return this._scale;
  																}
  												}
  								},
  								'key': {
  												enumerable: true,
  												get: function () {
  																return this._key;
  												},
  												set: function (keyStr) {
  																if (typeof keyStr == 'string') {
  																				this._key = new key.Key(keyStr);
  																} else if (typeof keyStr == 'undefined') {
  																				this._key = new key.Key('C');
  																} else {
  																				this._key = keyStr;
  																}
  												}
  								},
  								'degreeName': {
  												enumerable: true,
  												get: function () {
  																if (this.scaleDegree < 7) {
  																				return [undefined, 'Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant'][this.scaleDegree];
  																} else {
  																				var tonicPitch = new pitch.Pitch(this.key.tonic);
  																				var diffRootToTonic = (tonicPitch.ps - this.root.ps) % 12;
  																				if (diffRootToTonic < 0) {
  																								diffRootToTonic += 12;
  																				}
  																				if (diffRootToTonic == 1) {
  																								return "Leading-tone";
  																				} else {
  																								return "Subtonic";
  																				}
  																}
  												}
  								}
  				});

  				this.key = keyStr;
  				var currentFigure = figure;

  				var impliedQuality = 'major';
  				var lowercase = currentFigure.toLowerCase();
  				if (currentFigure.match('/o')) {
  								impliedQuality = 'half-diminished';
  								currentFigure = currentFigure.replace('/o', '');
  				} else if (currentFigure.match('o')) {
  								impliedQuality = 'diminished';
  								currentFigure = currentFigure.replace('o', '');
  				} else if (currentFigure == lowercase) {
  								impliedQuality = 'minor';
  				}

  				var numbersArr = currentFigure.match(/\d+/);
  				this.numbers = undefined;
  				if (numbersArr != null) {
  								currentFigure = currentFigure.replace(/\d+/, '');
  								this.numbers = parseInt(numbersArr[0]);
  				}

  				var scaleDegree = roman.romanToNumber.indexOf(currentFigure.toLowerCase());
  				if (scaleDegree == -1) {
  								throw "Cannot make a romanNumeral from " + currentFigure;
  				}
  				this.scaleDegree = scaleDegree;
  				this.root = this.scale[this.scaleDegree - 1];

  				if (this.key.mode == 'minor' && (this.scaleDegree == 6 || this.scaleDegree == 7)) {
  								if (['minor', 'diminished', 'half-diminished'].indexOf(impliedQuality) != -1) {
  												var raiseTone = new interval.Interval('A1');
  												this.root = raiseTone.transposePitch(this.root);
  												if (music21.debug) {
  																console.log('raised root because minor/dim on scaleDegree 6 or 7');
  												}
  								}
  				}

  				/* temp hack */
  				if (this.numbers == 7) {
  								if (scaleDegree == 5 && impliedQuality == 'major') {
  												impliedQuality = 'dominant-seventh';
  								} else {
  												impliedQuality += '-seventh';
  								}
  				}

  				this.impliedQuality = impliedQuality;
  				this.updatePitches();
  };

  roman.RomanNumeral.prototype = new chord.Chord();
  roman.RomanNumeral.prototype.constructor = roman.RomanNumeral;

  /**
   * Update the .pitches array.  Called at instantiation, but not automatically afterwards.
   * 
   * @memberof music21.roman.RomanNumeral
   */
  roman.RomanNumeral.prototype.updatePitches = function () {
  				var impliedQuality = this.impliedQuality;
  				var chordSpacing = chord.chordDefinitions[impliedQuality];
  				var chordPitches = [this.root];
  				var lastPitch = this.root;
  				for (var j = 0; j < chordSpacing.length; j++) {
  								//console.log('got them', lastPitch);
  								var thisTransStr = chordSpacing[j];
  								var thisTrans = new interval.Interval(thisTransStr);
  								var nextPitch = thisTrans.transposePitch(lastPitch);
  								chordPitches.push(nextPitch);
  								lastPitch = nextPitch;
  				}
  				this.pitches = chordPitches;
  };

  /**
   * Gives a string display.  Note that since inversion is not yet supported
   * it needs to be given separately.
   * 
   * Inverting 7th chords does not work.
   * 
   * @memberof music21.roman.RomanNumeral
   * @param {string} displayType - ['roman', 'bassName', 'nameOnly', other]
   * @param {Int} [inversion=0]
   * @returns {String}
   */
  roman.RomanNumeral.prototype.asString = function (displayType, inversion) {
  				var keyObj = this.key;
  				var tonic = keyObj.tonic;
  				var mode = keyObj.mode;

  				if (inversion === undefined) {
  								inversion = 0;
  				}
  				var inversionName = "";
  				if (inversion == 1) {
  								if (displayType == 'roman') {
  												inversionName = '6';
  								} else {
  												inversionName = ' (first inversion)';
  								}
  				} else if (inversion == 2) {
  								if (displayType == 'roman') {
  												inversionName = '64';
  								} else {
  												inversionName = ' (second inversion)';
  								}
  				}
  				var fullChordName;
  				var connector = ' in ';
  				var suffix = '';
  				if (displayType == 'roman') {
  								fullChordName = this.figure;
  				} else if (displayType == 'nameOnly') {
  								// use only with only choice being TONIC
  								fullChordName = "";
  								connector = '';
  								suffix = ' triad';
  				} else if (displayType == 'bassName') {
  								fullChordName = this.bass().name.replace(/\-/, 'b');
  								connector = ' in ';
  								suffix = '';
  				} else {
  								// "default" submediant, etc...
  								fullChordName = this.degreeName;
  								if (this.numbers != undefined) {
  												fullChordName += " " + this.numbers.toString();
  								}
  				}
  				var tonicDisplay = tonic.replace(/\-/, 'b');
  				if (mode == 'minor') {
  								tonicDisplay = tonicDisplay.toLowerCase();
  				}
  				var chordStr = fullChordName + inversionName + connector + tonicDisplay + " " + mode + suffix;
  				return chordStr;
  };

  roman.tests = function () {
  				test("music21.roman.RomanNumeral", function () {
  								var t1 = "IV";
  								var rn1 = new music21.roman.RomanNumeral(t1, "F");
  								equal(rn1.scaleDegree, 4, 'test scale dgree of F IV');
  								var scale = rn1.scale;
  								equal(scale[0].name, "F", 'test scale is F');
  								equal(rn1.root.name, "B-", 'test root of F IV');
  								equal(rn1.impliedQuality, 'major', 'test quality is major');
  								equal(rn1.pitches[0].name, 'B-', 'test pitches[0] == B-');
  								equal(rn1.pitches[1].name, 'D', 'test pitches[1] == D');
  								equal(rn1.pitches[2].name, 'F', 'test pitches[2] == F');
  								equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');

  								var t2 = 'viio7';
  								rn1 = new music21.roman.RomanNumeral(t2, "a");
  								equal(rn1.scaleDegree, 7, 'test scale dgree of A viio7');
  								equal(rn1.root.name, "G#", 'test root name == G#');
  								equal(rn1.impliedQuality, 'diminished-seventh', 'implied quality');
  								equal(rn1.pitches[0].name, 'G#', 'test pitches[0] == G#');
  								equal(rn1.pitches[1].name, 'B', 'test pitches[1] == B');
  								equal(rn1.pitches[2].name, 'D', 'test pitches[2] == D');
  								equal(rn1.pitches[3].name, 'F', 'test pitches[3] == F');
  								equal(rn1.degreeName, 'Leading-tone', 'test is Leading-tone');

  								t2 = 'V7';
  								rn1 = new music21.roman.RomanNumeral(t2, "a");
  								equal(rn1.scaleDegree, 5, 'test scale dgree of a V7');
  								equal(rn1.root.name, "E", 'root name is E');
  								equal(rn1.impliedQuality, 'dominant-seventh', 'implied quality dominant-seventh');
  								equal(rn1.pitches[0].name, 'E', 'test pitches[0] == E');
  								equal(rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
  								equal(rn1.pitches[2].name, 'B', 'test pitches[2] == B');
  								equal(rn1.pitches[3].name, 'D', 'test pitches[3] == D');
  								equal(rn1.degreeName, 'Dominant', 'test is Dominant');

  								t2 = 'VII';
  								rn1 = new music21.roman.RomanNumeral(t2, "f#");
  								equal(rn1.scaleDegree, 7, 'test scale dgree of a VII');
  								equal(rn1.root.name, "E", 'root name is E');
  								equal(rn1.impliedQuality, 'major', 'implied quality major');
  								equal(rn1.pitches[0].name, 'E', 'test pitches[0] == E');
  								equal(rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
  								equal(rn1.pitches[2].name, 'B', 'test pitches[2] == B');
  								equal(rn1.degreeName, 'Subtonic', 'test is Subtonic');
  				});

  				test("music21.roman.RomanNumeral - inversions", function () {
  								var t1 = "IV";
  								var rn1 = new music21.roman.RomanNumeral(t1, "F");
  								equal(rn1.scaleDegree, 4, 'test scale dgree of F IV');
  								var scale = rn1.scale;
  								equal(scale[0].name, "F", 'test scale is F');
  								equal(rn1.root.name, "B-", 'test root of F IV');
  								equal(rn1.impliedQuality, 'major', 'test quality is major');
  								equal(rn1.pitches[0].name, 'B-', 'test pitches[0] == B-');
  								equal(rn1.pitches[1].name, 'D', 'test pitches[1] == D');
  								equal(rn1.pitches[2].name, 'F', 'test pitches[2] == F');
  								equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');
  				});
  };

  /**
   * music21j -- Javascript reimplementation of Core music21 features.  
   * music21/tempo -- tempo and (not in music21p) metronome objects
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */
  /* a Music21Object in m21p; the overhead is too high here to follow ... */
  /**
   * tempo module, see {@link music21.tempo}
   * 
   * @exports music21/tempo
   */
  /**
   * tempo namespace
   * 
   * @namespace music21.tempo
   * @memberof music21
   * @requires music21/prebase
   * @requires music21/base
   * @requires MIDI
   * @property {number} [baseTempo=60] - basic tempo
   */
  var tempo = {};

  /**
   * Object mapping names to tempo values
   * 
   * @name music21.tempo.defaultTempoValues
   * @memberof music21.tempo
   * @example
   * music21.tempo.defaultTempoValues.grave
   * // 40
   */
  tempo.defaultTempoValues = {
      'larghissimo': 16,
      'largamente': 32,
      'grave': 40,
      'molto adagio': 40,
      'largo': 46,
      'lento': 52,
      'adagio': 56,
      'slow': 56,
      'langsam': 56,
      'larghetto': 60,
      'adagietto': 66,
      'andante': 72,
      'andantino': 80,
      'andante moderato': 83,
      'maestoso': 88,
      'moderato': 92,
      'moderate': 92,
      'allegretto': 108,
      'animato': 120,
      'allegro moderato': 128,
      'allegro': 132,
      'fast': 132,
      'schnell': 132,
      'allegrissimo': 140,
      'molto allegro': 144,
      'très vite': 144,
      'vivace': 160,
      'vivacissimo': 168,
      'presto': 184,
      'prestissimo': 208
  };

  tempo.baseTempo = 60;

  /* --------- metronome ---------- */
  /**
   * 
   * @class Metronome
   * @memberof music21.tempo
   * @extends music21.prebase.ProtoM21Object
   * @param {number} [tempo=music21.tempo.baseTempo] - the tempo of the metronome to start
   * @property {number} tempo
   * @property {Int} [numBeatsPerMeasure=4]
   * @property {number} [minTempo=10]
   * @property {number} [maxTempo=600]
   * @property {bool} [flash=false] - flash the tempo
   * @property {bool} [silent=false] - play silently
   * @property {Int} beat - current beat number
   * @property {Int} chirpTimeout - an index of a timeout object for chirping
   */
  tempo.Metronome = function (tempoInt) {
      prebase.ProtoM21Object.call(this);
      this.classes.push('Metronome');
      this._tempo = 60; // overridden by music21.tempo.baseTempo;
      if (tempoInt === undefined) {
          this.tempo = tempo.baseTempo;
      } else {
          this.tempo = tempoInt;
      }
      this.numBeatsPerMeasure = 4;
      this.minTempo = 10;
      this.maxTempo = 600;
      this.beat = this.numBeatsPerMeasure;
      this.chirpTimeout = undefined;
      this.silent = false;
      this.flash = false;

      Object.defineProperties(this, {
          'tempo': {
              enumerable: true,
              get: function () {
                  return this._tempo;
              },
              set: function (t) {
                  this._tempo = t;
                  if (this._tempo > this.maxTempo) {
                      this._tempo = this.maxTempo;
                  } else if (this._tempo < this.minTempo) {
                      this._tempo = this.minTempo;
                  }
              }
          },
          'beatLength': {
              enumerable: true,
              get: function () {
                  return 60.0 / this.tempo;
              }
          }

      });
  };

  tempo.Metronome.prototype = new prebase.ProtoM21Object();
  tempo.Metronome.prototype.constructor = tempo.Metronome;

  tempo.Metronome.prototype._silentFlash = function (flashColor) {
      this.$metronomeDiv.find('.metroFlash').css('background-color', flashColor).fadeOut(this.beatLength * 1000 * 1 / 4, function () {
          $(this).css('background-color', '#ffffff').fadeIn(1);
      });
  };

  /**
   * Play a note (a higher one on the downbeat) and start the metronome chirping.
   * 
   * @memberof music21.tempo.Metronome
   */
  tempo.Metronome.prototype.chirp = function () {
      this.beat += 1;
      if (this.beat > this.numBeatsPerMeasure) {
          this.beat = 1;
          if (this.silent != true) {
              music21.MIDI.noteOn(0, 96, 100, 0);
              music21.MIDI.noteOff(0, 96, .1);
          }
          if (this.flash == true) {
              this._silentFlash('#0000f0');
          }
      } else {
          if (this.silent != true) {
              music21.MIDI.noteOn(0, 84, 70, 0);
              music21.MIDI.noteOff(0, 84, .1);
          }
          if (this.flash == true) {
              this._silentFlash('#ff0000');
          }
      }
      var that = this;
      this.chirpTimeout = setTimeout(function () {
          that.chirp();
      }, 1000 * 60 / this.tempo);
  };

  /**
   * Stop the metronome from chirping.
   * 
   * @memberof music21.tempo.Metronome
   */
  tempo.Metronome.prototype.stopChirp = function () {
      if (this.chirpTimeout != undefined) {
          clearTimeout(this.chirpTimeout);
          this.chirpTimeout = undefined;
      }
  };
  tempo.Metronome.prototype.tempoRanges = [0, 40, 60, 72, 120, 144, 240, 999];
  tempo.Metronome.prototype.tempoIncreases = [0, 1, 2, 3, 4, 6, 8, 15, 100];

  /**
   * Increase the metronome tempo one "click".
   * 
   * Value changes depending on the current tempo.  Uses standard metronome guidelines.
   * 
   * To change the tempo, just set this.tempo = n
   * 
   * @memberof music21.tempo.Metronome
   * @param {Int} n - number of clicks to the right
   * @returns {number} new tempo
   */
  tempo.Metronome.prototype.increaseSpeed = function (n) {
      // increase by one metronome 'click' for every n
      if (n === undefined) {
          n = 1;
      }
      for (var i = 0; i < n; i++) {
          t = this.tempo;
          for (var tr = 0; tr < this.tempoRanges.length; tr++) {
              var tempoExtreme = this.tempoRanges[tr];
              var tempoIncrease = this.tempoIncreases[tr];
              if (t < tempoExtreme) {
                  t += tempoIncrease;
                  t = tempoIncrease * Math.round(t / tempoIncrease);
                  break;
              }
          }
          //console.log(t);
          this.tempo = t;
      }
      return this.tempo;
  };

  /**
   * Decrease the metronome tempo one "click"
   * 
   * To change the tempo, just set this.tempo = n
   * 
   * @memberof music21.tempo.Metronome
   * @param {Int} n - number of clicks to the left
   * @returns {number} new tempo
   */
  tempo.Metronome.prototype.decreaseSpeed = function (n) {
      if (n === undefined) {
          n = 1;
      }
      for (var i = 0; i < n; i++) {
          t = this.tempo;
          trL = this.tempoRanges.length;
          for (var tr = 1; tr <= trL; tr++) {
              var tempoExtreme = this.tempoRanges[trL - tr];
              var tempoIncrease = this.tempoIncreases[trL - tr + 1];
              if (t > tempoExtreme) {
                  t -= tempoIncrease;
                  t = tempoIncrease * Math.floor(t / tempoIncrease);
                  break;
              }
          }
          //console.log(t);
          this.tempo = t;
      }
  };

  /**
   * add a Metronome interface onto the DOM at where
   * 
   * @memberof music21.tempo.Metronome
   * @param {JQueryDOMObject|DOMObject} [where='body']
   * @returns {JQueryDOMObject} - a div holding the metronome.
   */
  tempo.Metronome.prototype.addDiv = function (where) {
      var jWhere = undefined;
      if (where !== undefined && where.jquery !== undefined) {
          jWhere = where;
      } else if (where !== undefined) {
          jWhere = $(where);
      } else {
          jWhere = $('body');
      }
      var metroThis = this;
      var tempoHolder = $('<span class="tempoHolder">' + this.tempo.toString() + '</span>').css({
          'font-size': '24px',
          'padding-left': '10px',
          'padding-right': '10px'
      });
      var newDiv = $('<div class="metronomeRendered"></div>');
      newDiv.append(tempoHolder);
      var b1 = $('<button>start</button>');
      b1.on('click', function () {
          metroThis.chirp();
      });
      var b2 = $('<button>stop</button>');
      b2.on('click', function () {
          metroThis.stopChirp();
      });
      newDiv.prepend(b2);
      newDiv.prepend(b1);
      var b3 = $('<button>up</button>');
      b3.on('click', function () {
          metroThis.increaseSpeed();$(this).prevAll('.tempoHolder').html(metroThis.tempo.toString());
      });
      var b4 = $('<button>down</button>');
      b4.on('click', function () {
          metroThis.decreaseSpeed();$(this).prevAll('.tempoHolder').html(metroThis.tempo.toString());
      });
      newDiv.append(b3);
      newDiv.append(b4);
      var $flash = $('<span class="metroFlash">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
      $flash.css('margin-left', '40px').css('height', '40px');
      newDiv.append($flash);

      jWhere.append(newDiv);
      this.$metronomeDiv = newDiv;
      return newDiv;
  };

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
  var tie = {};

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

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/tinyNotation -- TinyNotation implementation
   *
   * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
   * 
   */

  /**
   * music21j -- Javascript reimplementation of Core music21p features.  
   * music21/webmidi -- webmidi or wrapper around the Jazz Plugin
   * 
   * For non webmidi --  Uses the cross-platform, cross-browser plugin from 
   * http://jazz-soft.net/doc/Jazz-Plugin/Plugin.html
   * P.S. by the standards of divinity of most major religions, Sema Kachalo is a god.
   *
   * Copyright (c) 2014-15, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–15, Michael Scott Cuthbert and cuthbertLab
   * 
   */

  // order below doesn't matter, but good to give a sense
  // of what will be needed by almost everyone, and then
  // alphabetical
  //import { orchestralScore } from './music21/orchestralScore';

  /**
   * If you are a programmer, this is probably not the script you are looking for.  
   * The guts of music21j begin at src/music21/moduleLoader.js
   * 
   * @exports music21
   */
  // Not strict mode

  if (typeof music21 === "undefined") {
      /**
       * **music21j**: Javascript reimplementation of Core music21 features.  
       * 
       * See http://web.mit.edu/music21/ for more details.
       * 
       * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
       * 
       * Based on music21, Copyright (c) 2006-16, Michael Scott Cuthbert and cuthbertLab
       * The plan is to implement all core music21 features as Javascript and to expose
       * more sophisticated features via server-side connections to remote servers running the
       * python music21 (music21p).
       * 
       * Requires an ECMAScript 5 compatible browser w/ SVG and Canvas. IE 11 or any recent 
       * version of Firefox, Safari, Edge,  Chrome, etc. will do. To disable the warning, 
       * set an attribute in the &lt;script&gt; tag that calls requirejs, warnBanner="no".
       * 
       * All interfaces are alpha and may change radically from day to day and release to release.
       * Do not use this in production code yet. 
       * 
       * See src/moduleLoader.js for version and version history.
       * 
       * music21j acknowledges VexFlow, MIDI.js, jUnit, jQuery for their great efforts without which 
       * this module would not be possible.
       *  
       * @namespace 
       */
      music21 = { VERSION: 0.8 }; // update in README.md also
  }
  //console.log('hi before: ' + require.toUrl('hi'));
  //console.log('./hi before: ' + require.toUrl('./hi'));

  require.config({
      context: 'music21'
  });
  //console.log('hi context: ' + require.toUrl('hi'));
  //console.log('./hi context: ' + require.toUrl('./hi'));


  //must be defined before loading, jQuery, etc. because needed to see if warnBanner is defined

  // place a JSON obj into the <script> tag for require...
  // <script data-main='music21' src='require.js' m21conf='{"loadSoundfont": false}'>

  var pathSimplify = function (path) {
      var pPrefix = "";
      if (path.indexOf('//') === 0) {
          pPrefix = '//'; //cdn loading;
          path = path.slice(2);
          console.log('cdn load: ', pPrefix, " into ", path);
      } else if (path.indexOf('://') !== -1) {
          // for cross site requests...
          var protoSpace = path.indexOf('://');
          pPrefix = path.slice(0, protoSpace + 3);
          path = path.slice(protoSpace + 3);
          console.log('cross-site split', pPrefix, path);
      }
      var ps = path.split('/');
      var addSlash = path.slice(path.length - 1, path.length) === '/' ? true : false;
      var pout = [];
      for (var i = 0; i < ps.length; i++) {
          var el = ps[i];
          if (el === '..') {
              if (pout.length > 0) {
                  if (pout[pout.length - 1] !== '..') {
                      pout.pop();
                  } else {
                      pout.push('..');
                  }
              } else {
                  pout.push('..');
              }
              //} else if (el == '') { 
              //   // pass
          } else {
              pout.push(el);
          }
      }
      var pnew = pout.join('/');
      if (addSlash) {
          pnew += '/';
      }
      pnew = pPrefix + pnew;
      return pnew;
  };

  /**
   * Get an attribute from the script tag that invokes music21 via its data-main 
   * attribute.
   * 
   * E.g. if you invoked music21 with:
   *     <script src="require.js" data-main="src/music21" quiet="2" hi="hello"></script>
   * 
   * then "getM21attribute('quiet')" would return "2".
   * 
   */
  var getM21attribute = function (attrName) {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
          var s = scripts[i];
          var dataMain = s.getAttribute('data-main');
          if (dataMain && (/music21/.test(dataMain) || /m21/.test(dataMain))) {
              var m21Attribute = s.getAttribute(attrName);
              //console.log(m21Attribute);
              return m21Attribute;
          }
      }
  };

  /**
   *  Should we warn about obsolete web browsers? default Yes.
   */
  var warnBanner = getM21attribute('warnBanner') !== 'no' ? true : false;

  // get scriptConfig
  if (typeof m21conf === 'undefined') {
      m21conf = {};
      var m21browserAttribute = getM21attribute('m21conf');
      if (m21browserAttribute !== null && m21browserAttribute !== undefined) {
          try {
              m21conf = JSON.parse(m21browserAttribute);
          } catch (e) {
              console.log('Unable to JSON parse ' + m21browserAttribute.toString() + ' into m21conf');
          }
      }
  }

  if (typeof m21srcPath === 'undefined') {
      if (typeof require !== 'undefined') {
          m21srcPath = pathSimplify(require.toUrl('music21').replace(/\?bust=\w*/, '') + '/..');
          //console.log('m21srcPath: ' + m21srcPath);
      }
  }

  music21.m21basePath = pathSimplify(m21srcPath + '/..');
  music21.m21srcPath = m21srcPath;
  //console.log('m21srcPath', m21srcPath);
  //console.log('m21srcPath non simplified', require.toUrl('music21'));
  music21.soundfontUrl = music21.m21srcPath + '/ext/soundfonts/FluidR3_GM/';

  var m21requireConfig = {
      paths: {
          'jquery': pathSimplify(m21srcPath + '/ext/jquery/jquery-2.1.1.min'),
          'attrchange': pathSimplify(m21srcPath + '/ext/jqueryPlugins/attrchange'),
          'jquery-ui': pathSimplify(m21srcPath + '/ext/jqueryPlugins/jqueryUI/jquery-ui.min'),
          'vexflow': pathSimplify(m21srcPath + '/ext/vexflow/vexflow-min'),
          'MIDI': pathSimplify(m21srcPath + '/ext/midijs/build/MIDI'),
          'jasmidMidifile': pathSimplify(m21srcPath + '/ext/midijs/inc/jasmid/midifile'),
          'jasmidReplayer': pathSimplify(m21srcPath + '/ext/midijs/inc/jasmid/replayer'),
          'jasmidStream': pathSimplify(m21srcPath + '/ext/midijs/inc/jasmid/stream'),
          // a very nice event handler from Mudcu.be that handles drags 
          'eventjs': pathSimplify(m21srcPath + '/ext/midijs/examples/inc/event'),
          // read binary data in base64.  In "shim" but is not a shim.
          'base64Binary': pathSimplify(m21srcPath + '/ext/midijs/inc/shim/Base64binary'),

          // browser shims
          'webMidiApiShim': pathSimplify(m21srcPath + '/ext/midijs/inc/shim/WebMIDIAPI'), //not currently loaded/used?
          'webAudioShim': pathSimplify(m21srcPath + '/ext/midijs/inc/shim/WebAudioAPI'), // Safari prefixed to <= 9; IE <= Edge
          'es6Shim': pathSimplify(m21srcPath + '/ext/es6-shim')

      },
      packages: [{ name: 'jsonpickle',
          location: pathSimplify(m21srcPath + '/ext/jsonpickle'),
          main: 'main'
      }],
      shim: {
          'eventjs': {
              exports: 'eventjs'
          },
          'webMidiApiShim': {
              deps: ['es6Shim'],
              exports: 'window'
          },
          'MIDI': {
              deps: [//'base64Shim',  // Bye-bye IE9!
              'base64Binary', 'webAudioShim', 'jasmidMidifile', 'jasmidReplayer', 'jasmidStream', 'eventjs'],
              exports: 'MIDI'
          },
          'attrchange': {
              deps: ['jquery'],
              exports: 'jQuery.attrchange'
          },
          'jquery-ui': {
              deps: ['jquery'],
              exports: 'jQuery.ui'
          },
          'vexflow': {
              deps: ['jquery'],
              exports: 'Vex'
          }
      }
  };
  //console.log('jsonpickle in music21: ', m21requireConfig.packages[0].location);


  var m21modules = ['MIDI', 'vexflow', 'jquery', 'jsonpickle', 'jquery-ui', 'attrchange', 'es6Shim',
  //'webmidiapi',
  './music21/moduleLoader'];
  //BUG: will this work if multiple files are listed in noLoad???
  if (m21conf.noLoad !== undefined) {
      m21conf.noLoad.forEach(function (val, i, noLoad) {
          var mi = m21modules.indexOf(val);
          if (mi !== -1) {
              m21modules.splice(mi, 1);
          }
      });
  }

  if (Object.defineProperties === undefined && warnBanner) {
      var newDiv = document.createElement("div");
      newDiv.setAttribute('style', 'font-size: 40px; padding: 40px 20px 40px 20px; margin-top: 20px; line-height: 50px; width: 500px; height: 400px; color: #ffffff; background-color: #900000;');
      var textInside = document.createTextNode('Unfortunately, IE9, Safari 4 or 5 (Leopard/Snow Leopard), and other out-of-date browsers do not work with music21j. Please upgrade your browser w/ the link above.');
      newDiv.appendChild(textInside);
      document.body.appendChild(newDiv);
      var $buoop = { test: false, reminder: 0 }; // used by update.js...
      var e = document.createElement("script");
      e.setAttribute("type", "text/javascript");
      e.setAttribute("src", "http://browser-update.org/update.js");
      document.body.appendChild(e);
  } else {
      if (typeof define === "function" && define.amd) {
          require.config(m21requireConfig);
          //console.log(require.nameToUrl('jquery'));
          define(m21modules, function (midi, vexflow, $, jsonpickle) {
              // BUG, what if midi is in noLoad?     
              //console.log('inside of require...');
              music21.scriptConfig = m21conf;
              //console.log(music21.chord);
              if (midi) {
                  music21.MIDI = midi;
              }
              if (vexflow) {
                  music21.Vex = vexflow;
              } else {
                  console.log('could not load VexFlow');
              }
              if (music21.MIDI) {
                  if (music21.scriptConfig.loadSoundfont === undefined || music21.scriptConfig.loadSoundfont !== false) {
                      music21.miditools.loadSoundfont('acoustic_grand_piano');
                  } else {
                      console.log('skipping loading sound font');
                  }
              }
              if (music21.scriptConfig.renderHTML === undefined || music21.scriptConfig.renderHTML !== false) {
                  $(document).ready(function () {
                      music21.tinyNotation.renderNotationDivs();
                  });
              }
              //console.log('end inside of require...');
              return music21;
          });
      }
  }

})));
//# sourceMappingURL=music21.debug.js.map