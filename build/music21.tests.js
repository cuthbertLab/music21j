/**
 * music21j 0.9.0 built on  * 2017-09-14.
 * Copyright (c) 2013-2016 Michael Scott Cuthbert and cuthbertLab
 * BSD License, see LICENSE
 *
 * http://github.com/cuthbertLab/music21j
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('qunit'), require('jquery'), require('vexflow'), require('MIDI'), require('jsonpickle'), require('eventjs')) :
  typeof define === 'function' && define.amd ? define(['qunit', 'jquery', 'vexflow', 'MIDI', 'jsonpickle', 'eventjs'], factory) :
  (global.music21 = factory(global.QUnit,global.$,global.Vex,global.MIDI,global.jsonpickle,global.eventjs));
}(this, (function (QUnit,$$1,Vex,MIDI,jsonpickle,eventjs) { 'use strict';

  var MIDI__default = MIDI['default'];

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  // not working properly...

  var ExtendableError = function (_Error) {
      inherits(ExtendableError, _Error);

      function ExtendableError(message) {
          classCallCheck(this, ExtendableError);

          var _this = possibleConstructorReturn(this, (ExtendableError.__proto__ || Object.getPrototypeOf(ExtendableError)).call(this, message));

          _this.name = _this.constructor.name;
          _this.message = message;
          if (typeof Error.captureStackTrace === 'function') {
              Error.captureStackTrace(_this, _this.constructor);
          } else {
              _this.stack = new Error(message).stack;
          }
          return _this;
      }

      return ExtendableError;
  }(Error);

  var Music21Exception = function (_ExtendableError) {
      inherits(Music21Exception, _ExtendableError);

      function Music21Exception() {
          classCallCheck(this, Music21Exception);
          return possibleConstructorReturn(this, (Music21Exception.__proto__ || Object.getPrototypeOf(Music21Exception)).apply(this, arguments));
      }

      return Music21Exception;
  }(ExtendableError);

  var StreamException = function (_Music21Exception) {
      inherits(StreamException, _Music21Exception);

      function StreamException() {
          classCallCheck(this, StreamException);
          return possibleConstructorReturn(this, (StreamException.__proto__ || Object.getPrototypeOf(StreamException)).apply(this, arguments));
      }

      return StreamException;
  }(Music21Exception);



  var exceptions21 = Object.freeze({
      Music21Exception: Music21Exception,
      StreamException: StreamException
  });

  var debug = false;

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
  common.merge = function mergeRecursive(destination, source) {
      if (source === undefined || source === null) {
          return destination;
      }
      for (var p in source) {
          if (!{}.hasOwnProperty.call(source, p)) {
              continue;
          }
          try {
              // Property in destination object set; update its value.
              if (source[p].constructor === Object) {
                  destination[p] = mergeRecursive(destination[p], source[p]);
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
   * Mix in another class into this class -- a form of multiple inheritance.
   * See articulations.Marcato for an example.
   *
   */
  common.mixin = function common_mixin(OtherParent, thisClassOrObject) {
      var proto = Object.getPrototypeOf(OtherParent);
      var classProto = Object.getPrototypeOf(thisClassOrObject);

      while (proto) {
          for (var key in Object.keys(proto)) {
              if (!{}.hasOwnProperty.call(proto, key)) {
                  continue;
              }
              if (!(key in classProto)) {
                  classProto[key] = proto[key];
              }
          }
          proto = Object.getPrototypeOf(proto);
      }
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
  common.statisticalMode = function statisticalMode(a) {
      if (a.length === 0) {
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
          modeMap[el] += 1;
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
  common.makeSVGright = function makeSVGright(tag, attrs) {
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
          if (!{}.hasOwnProperty.call(attrs, k)) {
              continue;
          }
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
  common.ordinalAbbreviation = function ordinalAbbreviation(value, plural) {
      var post = '';
      var valueHundreths = value % 100;
      if (valueHundreths === 11 || valueHundreths === 12 || valueHundreths === 13) {
          post = 'th';
      } else {
          var valueMod = value % 10;
          if (valueMod === 1) {
              post = 'st';
          } else if (valueMod === 2) {
              post = 'nd';
          } else if (valueMod === 3) {
              post = 'rd';
          } else {
              post = 'th';
          }
      }
      if (post !== 'st' && plural) {
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
  common.rationalize = function rationalize(ql, epsilon, maxDenominator) {
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
  common.stripPx = function stripPx(str) {
      if (typeof str === 'string') {
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
  common.urlParam = function urlParam(name) {
      name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(location.search);
      return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  /**
   * Copies an event from one jQuery object to another.
   * This is buggy in jQuery 3 -- do not use.  use .clone(true, true);
   * and then replace the elements.
   * 
   * To be removed once I'm sure it is not needed
   *
   * @function music21.common.jQueryEventCopy
   * @param {Event} eventObj - Event to copy from "from" to "to"
   * @param {jQuery|string|DOMObject} from - jQuery object to copy events from. Only uses the first matched element.
   * @param {jQuery|string|DOMObject} to - jQuery object to copy events to. Copies to all matched elements.
   * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
   * @author Yannick Albert (mail@yckart.com || http://yckart.com)
   */
  common.jQueryEventCopy = function jQueryEventCopy(eventObj, from, to) {
      from = from.jquery ? from : $$1(from);
      to = to.jquery ? to : $$1(to);

      var events = from[0].events || $$1.data(from[0], 'events') || $$1._data(from[0], 'events');
      if (!from.length || !to.length || !events) {
          return undefined;
      }
      return to.each(function () {
          for (var type in events) {
              if (!{}.hasOwnProperty.call(events, type)) {
                  continue;
              }
              for (var handler in events[type]) {
                  if (!{}.hasOwnProperty.call(events[type], handler)) {
                      continue;
                  }
                  $$1.event.add(eventObj, type, events[type][handler], events[type][handler].data);
              }
          }
      });
  };
  // common.walk = function (obj, callback, callList, seen, numSeen) {
  // if (depth == undefined) {
  // depth = 0;
  // }
  // if (depth > 20) {
  // throw "max depth reached";
  // }
  // if (callList === undefined) {
  // callList = [];
  // }
  // if (seen === undefined) {
  // seen = new Set();
  // }
  // var next, item;
  // for (item in obj) {
  // if (obj.hasOwnProperty(item)) {
  // next = obj[item];
  // var nextCallList = []
  // nextCallList.push.apply(callList);
  // nextCallList.push(item);
  // if (callback !== undefined) {
  // callback.call(this, item, next, nextCallList);
  // }
  // if (typeof next =='object' && next != null) {
  // if (seen.has(next) == false) {
  // seen.add(next);
  // common.walk(next, callback, nextCallList, seen, depth+1);
  // }
  // }
  // }
  // }
  // };

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
  common.setWindowVisibilityWatcher = function setWindowVisibilityWatcher(callback) {
      var hidden = 'hidden';

      // Standards:
      if (hidden in document) {
          document.addEventListener('visibilitychange', windowFocusChanged);
      } else if ('mozHidden' in document) {
          hidden = 'mozHidden';
          document.addEventListener('mozvisibilitychange', windowFocusChanged);
      } else if ('webkitHidden' in document) {
          hidden = 'webkitHidden';
          document.addEventListener('webkitvisibilitychange', windowFocusChanged);
      } else if ('msHidden' in document) {
          hidden = 'msHidden';
          document.addEventListener('msvisibilitychange', windowFocusChanged);
      } else if ('onfocusin' in document) {
          // IE 9 and lower:
          document.onfocusin = document.onfocusout = windowFocusChanged;
      }

      // Also catch window... -- get two calls for a tab shift, but one for window losing focus
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = windowFocusChanged;

      function windowFocusChanged(evt) {
          var v = 'visible';
          var h = 'hidden';
          var evtMap = {
              focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
          };

          evt = evt || window.event;
          var callbackState = '';
          if (evt.type in evtMap) {
              callbackState = evtMap[evt.type];
          } else {
              callbackState = this[hidden] ? 'hidden' : 'visible';
          }
          callback(callbackState, evt);
      }
      // set the initial state
      var initialState = document.visibilityState === 'visible' ? 'focus' : 'blur';
      var initialStateEvent = { 'type': initialState };
      windowFocusChanged(initialStateEvent);
  };

  common.urls = {
      css: '/css',
      webResources: '/webResources',
      midiPlayer: '/webResources/midiPlayer',
      soundfontUrl: '/src/ext/soundfonts/FluidR3_GM/'
  };

  /**
   * module for things that all music21-created objects, not just objects that can live in
   * Stream.elements should inherit. See the {@link music21.prebase} namespace.
   *
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
  var ProtoM21Object = function () {
      function ProtoM21Object() {
          classCallCheck(this, ProtoM21Object);

          this.classes = ['ProtoM21Object'];
          this.isProtoM21Object = true;
          this.isMusic21Object = false;
          this._cloneCallbacks = {};
      }
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


      createClass(ProtoM21Object, [{
          key: 'clone',
          value: function clone() {
              var ret = new this.constructor();

              // todo: do Arrays work?
              for (var key in this) {
                  // not that we ONLY copy the keys in Ret -- it's easier that way.
                  if ({}.hasOwnProperty.call(this, key) === false) {
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
                  } else if (typeof this[key] === 'function') {
                      // do nothing -- events might not be copied.
                  } else if (_typeof(this[key]) === 'object' && this[key] !== null && this[key].isProtoM21Object) {
                      // console.log('cloning ', key);
                      ret[key] = this[key].clone();
                  } else {
                      try {
                          ret[key] = this[key];
                          // music21.common.merge(ret[key], this[key]); // not really necessary?
                      } catch (e) {
                          if (e instanceof TypeError) {
                              console.log('typeError:', e, key);
                              // do nothing
                          } else {
                              throw e;
                          }
                      }
                  }
              }
              return ret;
          }
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

      }, {
          key: 'isClassOrSubclass',
          value: function isClassOrSubclass(testClass) {
              if (testClass instanceof Array === false) {
                  testClass = [testClass];
              }
              for (var i = 0; i < testClass.length; i++) {
                  if (this.classes.indexOf(testClass[i]) !== -1) {
                      return true;
                  }
              }
              return false;
          }
      }]);
      return ProtoM21Object;
  }();
  prebase.ProtoM21Object = ProtoM21Object;

  /**
   * music21j -- Javascript reimplementation of Core music21 features.
   * music21/duration -- duration routines
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21, Copyright (c) 2006-16, Michael Scott Cuthbert and cuthbertLab
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
  var Duration = function (_prebase$ProtoM21Obje) {
      inherits(Duration, _prebase$ProtoM21Obje);

      function Duration(ql) {
          classCallCheck(this, Duration);

          var _this = possibleConstructorReturn(this, (Duration.__proto__ || Object.getPrototypeOf(Duration)).call(this));

          _this.classes.push('Duration');
          _this._quarterLength = 1.0;
          _this._dots = 0;
          _this._durationNumber = undefined;
          _this._type = 'quarter';
          _this._tuplets = [];
          if (typeof ql === 'string') {
              _this.type = ql;
          } else {
              _this.quarterLength = ql;
          }
          _this._cloneCallbacks._tuplets = _this.cloneCallbacksTupletFunction;
          return _this;
      }
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


      createClass(Duration, [{
          key: 'cloneCallbacksTupletFunction',
          value: function cloneCallbacksTupletFunction(tupletKey, ret, obj) {
              // make sure that tuplets clone properly
              var newTuplets = [];
              for (var i = 0; i < obj[tupletKey].length; i++) {
                  var newTuplet = obj[tupletKey][i].clone();
                  // console.log('cloning tuplets', obj[tupletKey][i], newTuplet);
                  newTuplets.push(newTuplet);
              }
              ret[tupletKey] = newTuplets;
          }
      }, {
          key: '_findDots',
          value: function _findDots(ql) {
              if (ql === 0) {
                  return 0;
              } // zero length stream probably;
              var typeNumber = duration.ordinalTypeFromNum.indexOf(this._type);
              var powerOfTwo = Math.pow(2, duration.quarterTypeIndex - typeNumber);
              // alert(undottedQL * 1.5 + " " + ql)
              // console.log('find dots called on ql: ', ql, typeNumber, powerOfTwo);
              for (var dotsNum = 0; dotsNum <= 4; dotsNum++) {
                  var dotMultiplier = (Math.pow(2, dotsNum) - 1.0) / Math.pow(2, dotsNum);
                  var durationMultiplier = 1 + dotMultiplier;
                  if (Math.abs(powerOfTwo * durationMultiplier - ql) < 0.0001) {
                      return dotsNum;
                  }
              }
              if (debug) {
                  console.log('no dots available for ql; probably a tuplet', ql);
              }
              return 0;
          }
      }, {
          key: 'updateQlFromFeatures',
          value: function updateQlFromFeatures() {
              var typeNumber = duration.ordinalTypeFromNum.indexOf(this._type); // must be set property
              var undottedQuarterLength = Math.pow(2, duration.quarterTypeIndex - typeNumber);
              var dottedMultiplier = 1 + (Math.pow(2, this._dots) - 1) / Math.pow(2, this._dots);
              var unTupletedQl = undottedQuarterLength * dottedMultiplier;
              var tupletCorrectedQl = unTupletedQl;
              this._tuplets.forEach(function (tuplet) {
                  tupletCorrectedQl *= tuplet.tupletMultiplier();
              });
              this._quarterLength = tupletCorrectedQl;
          }
      }, {
          key: 'updateFeaturesFromQl',
          value: function updateFeaturesFromQl() {
              var ql = this._quarterLength;
              var powerOfTwo = Math.floor(Math.log(ql + 0.00001) / Math.log(2));
              var typeNumber = duration.quarterTypeIndex - powerOfTwo;
              this._type = duration.ordinalTypeFromNum[typeNumber];
              // console.log(this._findDots);
              this._dots = this._findDots(ql);

              var undottedQuarterLength = Math.pow(2, duration.quarterTypeIndex - typeNumber);
              var dottedMultiplier = 1 + (Math.pow(2, this._dots) - 1) / Math.pow(2, this._dots);
              var unTupletedQl = undottedQuarterLength * dottedMultiplier;
              if (unTupletedQl !== ql && ql !== 0) {
                  typeNumber -= 1;
                  this._type = duration.ordinalTypeFromNum[typeNumber]; // increase type: eighth to quarter etc.
                  unTupletedQl *= 2;
                  var tupletRatio = ql / unTupletedQl;
                  var ratioRat = common.rationalize(tupletRatio);
                  if (ratioRat === undefined) {
                      // probably a Stream with a length that is inexpressable;
                  } else {
                      var t = new duration.Tuplet(ratioRat.denominator, ratioRat.numerator, new duration.Duration(unTupletedQl));
                      this.appendTuplet(t, true); // skipUpdateQl
                  }
                  // console.log(ratioRat, ql, unTupletedQl);
              }
          }
          /**
           * Add a tuplet to music21j
           *
           * @memberof music21.duration.Duration
           * @param {music21.duration.Tuplet} newTuplet - tuplet to add to `.tuplets`
           * @param {boolean} [skipUpdateQl=false] - update the quarterLength afterwards?
           */

      }, {
          key: 'appendTuplet',
          value: function appendTuplet(newTuplet, skipUpdateQl) {
              newTuplet.frozen = true;
              this._tuplets.push(newTuplet);
              if (skipUpdateQl !== true) {
                  this.updateQlFromFeatures();
              }
          }
      }, {
          key: 'dots',
          get: function get() {
              return this._dots;
          },
          set: function set(numDots) {
              this._dots = numDots;
              this.updateQlFromFeatures();
          }
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

      }, {
          key: 'quarterLength',
          get: function get() {
              return this._quarterLength;
          },
          set: function set(ql) {
              if (ql === undefined) {
                  ql = 1.0;
              }
              this._quarterLength = ql;
              this.updateFeaturesFromQl();
          }
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

      }, {
          key: 'type',
          get: function get() {
              return this._type;
          },
          set: function set(typeIn) {
              var typeNumber = duration.ordinalTypeFromNum.indexOf(typeIn);
              if (typeNumber === -1) {
                  console.log('invalid type ' + typeIn);
                  throw new Music21Exception('invalid type ' + typeIn);
              }
              this._type = typeIn;
              this.updateQlFromFeatures();
          }
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

      }, {
          key: 'tuplets',
          get: function get() {
              return this._tuplets;
          }
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

      }, {
          key: 'vexflowDuration',
          get: function get() {
              var typeNumber = duration.ordinalTypeFromNum.indexOf(this.type);
              var vd = duration.vexflowDurationArray[typeNumber];
              if (this.dots > 0) {
                  for (var i = 0; i < this.dots; i++) {
                      vd += 'd'; // vexflow does not handle double dots .. or does it???
                  }
              }
              return vd;
          }
      }]);
      return Duration;
  }(prebase.ProtoM21Object);

  duration.Duration = Duration;

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
  var Tuplet = function (_prebase$ProtoM21Obje2) {
      inherits(Tuplet, _prebase$ProtoM21Obje2);

      function Tuplet(numberNotesActual, numberNotesNormal, durationActual, durationNormal) {
          classCallCheck(this, Tuplet);

          var _this2 = possibleConstructorReturn(this, (Tuplet.__proto__ || Object.getPrototypeOf(Tuplet)).call(this));

          _this2.classes.push('Tuplet');
          _this2.numberNotesActual = numberNotesActual || 3;
          _this2.numberNotesNormal = numberNotesNormal || 2;
          _this2.durationActual = durationActual || new duration.Duration(0.5);
          if (typeof _this2.durationActual === 'number') {
              _this2.durationActual = new duration.Duration(_this2.durationActual);
          }
          _this2.durationNormal = durationNormal || _this2.durationActual;

          _this2.frozen = false;
          _this2.type = undefined;
          /**
           * Show a bracket above the tuplet
           *
           * @memberof music21.duration.Tuplet#
           * @member {Boolean} bracket
           * @default true
           */
          _this2.bracket = true;
          /**
           * Bracket placement. Options are `above` or `below`.
           *
           * @memberof music21.duration.Tuplet#
           * @member {String} placement
           * @default 'above'
           */
          _this2.placement = 'above';

          /**
           * What to show above the Tuplet. Options are `number`, `type`, or (string) `none`.
           *
           * @memberof music21.duration.Tuplet#
           * @member {String} tupletActualShow
           * @default 'number'
           */
          _this2.tupletActualShow = 'number';
          _this2.tupletNormalShow = undefined; // undefined, 'ratio' for ratios, 'type' for ratioed notes (does not work)
          return _this2;
      }
      /**
       * A nice name for the tuplet.
       *
       * @type String
       * @instance
       * @readonly
       * @memberof music21.duration.Tuplet
       */


      createClass(Tuplet, [{
          key: 'setDurationType',

          /**
           * Set both durationActual and durationNormal for the tuplet.
           *
           * @memberof music21.duration.Tuplet
           * @param {string} type - a duration type, such as `half`, `quarter`
           * @returns {music21.duration.Duration} A converted {@link music21.duration.Duration} matching `type`
           */
          value: function setDurationType(type) {
              if (this.frozen === true) {
                  throw new Music21Exception('A frozen tuplet (or one attached to a duration) is immutable');
              }
              this.durationActual = new duration.Duration(type);
              this.durationNormal = this.durationActual;
              return this.durationActual;
          }
          /**
           * Sets the tuplet ratio.
           *
           * @memberof music21.duration.Tuplet
           * @param {Number} actual - number of notes in actual (e.g., 3)
           * @param {Number} normal - number of notes in normal (e.g., 2)
           * @returns {undefined}
           */

      }, {
          key: 'setRatio',
          value: function setRatio(actual, normal) {
              if (this.frozen === true) {
                  throw new Music21Exception('A frozen tuplet (or one attached to a duration) is immutable');
              }
              this.numberNotesActual = actual || 3;
              this.numberNotesNormal = normal || 2;
          }
          /**
           * Get the quarterLength corresponding to the total length that
           * the completed tuplet (i.e., 3 notes in a triplet) would occupy.
           *
           * @memberof music21.duration.Tuplet
           * @returns {Number} A quarter length.
           */

      }, {
          key: 'totalTupletLength',
          value: function totalTupletLength() {
              return this.numberNotesNormal * this.durationNormal.quarterLength;
          }
          /**
           * The amount by which each quarter length is multiplied to get
           * the tuplet. For instance, in a normal triplet, this is 0.666
           *
           * @memberof music21.duration.Tuplet
           * @returns {Number} A float of the multiplier
           */

      }, {
          key: 'tupletMultiplier',
          value: function tupletMultiplier() {
              var lengthActual = this.durationActual.quarterLength;
              return this.totalTupletLength() / (this.numberNotesActual * lengthActual);
          }
      }, {
          key: 'fullName',
          get: function get() {
              // actual is what is presented to viewer
              var numActual = this.numberNotesActual;
              var numNormal = this.numberNotesNormal;

              if (numActual === 3 && numNormal === 2) {
                  return 'Triplet';
              } else if (numActual === 5 && (numNormal === 4 || numNormal === 2)) {
                  return 'Quintuplet';
              } else if (numActual === 6 && numNormal === 4) {
                  return 'Sextuplet';
              }
              var ordStr = common.ordinalAbbreviation(numNormal, true); // plural
              return 'Tuplet of ' + numActual.toString() + '/' + numNormal.toString() + ordStr;
          }
      }]);
      return Tuplet;
  }(prebase.ProtoM21Object);
  duration.Tuplet = Tuplet;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/base -- objects in base in music21p routines
   *
   * does not load the other modules, music21/moduleLoader.js does that.
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  var Music21Object = function (_prebase$ProtoM21Obje) {
      inherits(Music21Object, _prebase$ProtoM21Obje);

      function Music21Object() {
          classCallCheck(this, Music21Object);

          var _this = possibleConstructorReturn(this, (Music21Object.__proto__ || Object.getPrototypeOf(Music21Object)).call(this));

          _this.classes.push('Music21Object');
          _this.classSortOrder = 20; // default;
          _this._priority = 0; // default;
          _this.offset = null; // default -- simple version of m21.
          _this.activeSite = undefined;
          _this.isMusic21Object = true;
          _this.isStream = false;

          _this._duration = new duration.Duration();
          _this.groups = []; // custom object in m21p
          // this.sites, this.activeSites, this.offset -- not yet...
          // beat, measureNumber, etc.
          // lots to do...
          _this._cloneCallbacks.activeSite = function Music21Object_cloneCallbacks_activeSite(p, ret, obj) {
              ret[p] = undefined;
          };
          return _this;
      }

      createClass(Music21Object, [{
          key: 'getOffsetBySite',

          /**
           * Return the offset of this element in a given site -- use .offset if you are sure that
           * site === activeSite.
           *
           * Does not change activeSite or .offset
           *
           * @memberof music21.base.Music21Object
           * @param {music21.stream.Stream} site
           * @returns Number|undefined
           */
          value: function getOffsetBySite(site) {
              if (site === undefined) {
                  return this.offset;
              }
              for (var i = 0; i < site.length; i++) {
                  if (site._elements[i] === this) {
                      return site._elementOffsets[i];
                  }
              }
              return undefined;
          }
      }, {
          key: 'priority',
          get: function get() {
              return this._priority;
          },
          set: function set(p) {
              this._priority = p;
          }
      }, {
          key: 'duration',
          get: function get() {
              return this._duration;
          },
          set: function set(newDuration) {
              if ((typeof newDuration === 'undefined' ? 'undefined' : _typeof(newDuration)) === 'object') {
                  this._duration = newDuration;
                  // common errors below...
              } else if (typeof newDuration === 'number') {
                  this._duration.quarterLength = newDuration;
              } else if (typeof newDuration === 'string') {
                  this._duration.type = newDuration;
              }
          }
      }, {
          key: 'quarterLength',
          get: function get() {
              return this.duration.quarterLength;
          },
          set: function set(ql) {
              this.duration.quarterLength = ql;
          }
      }]);
      return Music21Object;
  }(prebase.ProtoM21Object);

  base.Music21Object = Music21Object;

  /**
   * articulations module. See {@link music21.articulations} namespace
   *
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
  var Articulation = function (_prebase$ProtoM21Obje) {
      inherits(Articulation, _prebase$ProtoM21Obje);

      function Articulation() {
          classCallCheck(this, Articulation);

          var _this = possibleConstructorReturn(this, (Articulation.__proto__ || Object.getPrototypeOf(Articulation)).call(this));

          _this.classes.push('Articulation');
          _this.name = undefined;
          _this.placement = 'above';
          _this.vexflowModifier = undefined;
          _this.setPosition = undefined;
          _this.dynamicScale = 1.0;
          _this.lengthScale = 1.0;
          return _this;
      }

      /**
       * Generates a Vex.Flow.Articulation for this articulation.
       *
       * @memberof music21.articulations.Articulation
       * @returns {Vex.Flow.Articulation}
       */


      createClass(Articulation, [{
          key: 'vexflow',
          value: function vexflow() {
              var vfa = new Vex.Flow.Articulation(this.vexflowModifier);
              if (this.setPosition) {
                  vfa.setPosition(this.setPosition);
              }
              return vfa;
          }
      }]);
      return Articulation;
  }(prebase.ProtoM21Object);
  articulations.Articulation = Articulation;
  /**
   * base class for articulations that change the length of a note...
   *
   * @class LengthArticulation
   * @memberof music21.articulations
   * @extends music21.articulations.Articulation
   */
  var LengthArticulation = function (_Articulation) {
      inherits(LengthArticulation, _Articulation);

      function LengthArticulation() {
          classCallCheck(this, LengthArticulation);

          var _this2 = possibleConstructorReturn(this, (LengthArticulation.__proto__ || Object.getPrototypeOf(LengthArticulation)).call(this));

          _this2.classes.push('LengthArticulation');
          return _this2;
      }

      return LengthArticulation;
  }(Articulation);
  articulations.LengthArticulation = LengthArticulation;

  /**
   * base class for articulations that change the dynamic of a note...
   *
   * @class DynamicArticulation
   * @memberof music21.articulations
   * @extends music21.articulations.Articulation
   */
  var DynamicArticulation = function (_Articulation2) {
      inherits(DynamicArticulation, _Articulation2);

      function DynamicArticulation() {
          classCallCheck(this, DynamicArticulation);

          var _this3 = possibleConstructorReturn(this, (DynamicArticulation.__proto__ || Object.getPrototypeOf(DynamicArticulation)).call(this));

          _this3.classes.push('DynamicArticulation');
          return _this3;
      }

      return DynamicArticulation;
  }(Articulation);
  articulations.DynamicArticulation = DynamicArticulation;

  /**
   * base class for articulations that change the pitch of a note...
   *
   * @class PitchArticulation
   * @memberof music21.articulations
   * @extends music21.articulations.Articulation
   */
  var PitchArticulation = function (_Articulation3) {
      inherits(PitchArticulation, _Articulation3);

      function PitchArticulation() {
          classCallCheck(this, PitchArticulation);

          var _this4 = possibleConstructorReturn(this, (PitchArticulation.__proto__ || Object.getPrototypeOf(PitchArticulation)).call(this));

          _this4.classes.push('PitchArticulation');
          return _this4;
      }

      return PitchArticulation;
  }(Articulation);
  articulations.PitchArticulation = PitchArticulation;

  /**
   * base class for articulations that change the timbre of a note...
   *
   * @class TimbreArticulation
   * @memberof music21.articulations
   * @extends music21.articulations.Articulation
   */
  var TimbreArticulation = function (_Articulation4) {
      inherits(TimbreArticulation, _Articulation4);

      function TimbreArticulation() {
          classCallCheck(this, TimbreArticulation);

          var _this5 = possibleConstructorReturn(this, (TimbreArticulation.__proto__ || Object.getPrototypeOf(TimbreArticulation)).call(this));

          _this5.classes.push('TimbreArticulation');
          return _this5;
      }

      return TimbreArticulation;
  }(Articulation);
  articulations.TimbreArticulation = TimbreArticulation;

  /**
   * 50% louder than usual
   *
   * @class Accent
   * @memberof music21.articulations
   * @extends music21.articulations.DynamicArticulation
   */
  var Accent = function (_DynamicArticulation) {
      inherits(Accent, _DynamicArticulation);

      function Accent() {
          classCallCheck(this, Accent);

          var _this6 = possibleConstructorReturn(this, (Accent.__proto__ || Object.getPrototypeOf(Accent)).call(this));

          _this6.classes.push('Accent');
          _this6.name = 'accent';
          _this6.vexflowModifier = 'a>';
          _this6.dynamicScale = 1.5;
          return _this6;
      }

      return Accent;
  }(DynamicArticulation);
  articulations.Accent = Accent;

  /**
   * 100% louder than usual
   *
   * @class StrongAccent
   * @memberof music21.articulations
   * @extends music21.articulations.Accent
   */
  var StrongAccent = function (_Accent) {
      inherits(StrongAccent, _Accent);

      function StrongAccent() {
          classCallCheck(this, StrongAccent);

          var _this7 = possibleConstructorReturn(this, (StrongAccent.__proto__ || Object.getPrototypeOf(StrongAccent)).call(this));

          _this7.classes.push('StrongAccent');
          _this7.name = 'strong accent';
          _this7.vexflowModifier = 'a^';
          _this7.dynamicScale = 2.0;
          return _this7;
      }

      return StrongAccent;
  }(Accent);
  articulations.StrongAccent = StrongAccent;

  /**
   * no playback for now.
   *
   * @class Staccato
   * @memberof music21.articulations
   * @extends music21.articulations.LengthArticulation
   */
  var Staccato = function (_LengthArticulation) {
      inherits(Staccato, _LengthArticulation);

      function Staccato() {
          classCallCheck(this, Staccato);

          var _this8 = possibleConstructorReturn(this, (Staccato.__proto__ || Object.getPrototypeOf(Staccato)).call(this));

          _this8.classes.push('Staccato');
          _this8.name = 'staccato';
          _this8.vexflowModifier = 'a.';
          return _this8;
      }

      return Staccato;
  }(LengthArticulation);
  articulations.Staccato = Staccato;

  /**
   * no playback for now.
   *
   * @class Staccatissimo
   * @memberof music21.articulations
   * @extends music21.articulations.Staccato
   */
  var Staccatissimo = function (_Staccato) {
      inherits(Staccatissimo, _Staccato);

      function Staccatissimo() {
          classCallCheck(this, Staccatissimo);

          var _this9 = possibleConstructorReturn(this, (Staccatissimo.__proto__ || Object.getPrototypeOf(Staccatissimo)).call(this));

          _this9.classes.push('Staccatissimo');
          _this9.name = 'staccatissimo';
          _this9.vexflowModifier = 'av';
          return _this9;
      }

      return Staccatissimo;
  }(Staccato);
  articulations.Staccatissimo = Staccatissimo;

  /**
   * no playback or display for now.
   *
   * @class Spiccato
   * @memberof music21.articulations
   * @extends music21.articulations.Staccato
   */
  var Spiccato = function (_Staccato2) {
      inherits(Spiccato, _Staccato2);

      function Spiccato() {
          classCallCheck(this, Spiccato);

          var _this10 = possibleConstructorReturn(this, (Spiccato.__proto__ || Object.getPrototypeOf(Spiccato)).call(this));

          _this10.classes.push('Spiccato');
          _this10.name = 'spiccato';
          _this10.vexflowModifier = undefined;
          return _this10;
      }

      return Spiccato;
  }(Staccato);
  articulations.Spiccato = Spiccato;

  /**
   * @class Marcato
   * @memberof music21.articulations
   * @extends music21.articulations.DynamicArticulation
   * @extends music21.articulations.LengthArticulation
   */
  var Marcato = function (_DynamicArticulation2) {
      inherits(Marcato, _DynamicArticulation2);

      function Marcato() {
          classCallCheck(this, Marcato);

          var _this11 = possibleConstructorReturn(this, (Marcato.__proto__ || Object.getPrototypeOf(Marcato)).call(this));

          common.mixin(LengthArticulation, _this11);
          _this11.classes.push('Marcato');
          _this11.name = 'marcato';
          _this11.vexflowModifier = 'a^';
          _this11.dynamicScale = 1.7;
          return _this11;
      }

      return Marcato;
  }(DynamicArticulation);
  articulations.Marcato = Marcato;

  /**
   * @class Tenuto
   * @memberof music21.articulations
   * @extends music21.articulations.LengthArticulation
   */
  var Tenuto = function (_LengthArticulation2) {
      inherits(Tenuto, _LengthArticulation2);

      function Tenuto() {
          classCallCheck(this, Tenuto);

          var _this12 = possibleConstructorReturn(this, (Tenuto.__proto__ || Object.getPrototypeOf(Tenuto)).call(this));

          _this12.classes.push('Tenuto');
          _this12.name = 'tenuto';
          _this12.vexflowModifier = 'a-';
          return _this12;
      }

      return Tenuto;
  }(LengthArticulation);
  articulations.Tenuto = Tenuto;

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
          'get': function get() {
              if (audioSearch._audioContext !== null) {
                  return audioSearch._audioContext;
              } else {
                  // AudioContext should be a singleton, but MIDI reports loaded before it is!
                  if (MIDI__default !== undefined && MIDI__default.WebAudio !== undefined && MIDI__default.WebAudio.getContext() !== undefined) {
                      window.globalAudioContext = MIDI__default.WebAudio.getContext();
                  } else if (typeof window.globalAudioContext === 'undefined') {
                      window.globalAudioContext = new audioSearch.AudioContextCaller();
                  }
                  audioSearch._audioContext = window.globalAudioContext;
                  return audioSearch._audioContext;
              }
          },
          'set': function set(ac) {
              audioSearch._audioContext = ac;
          }
      } });

  /**
   *
   * @function music21.audioSearch.getUserMedia
   * @memberof music21.audioSearch
   * @param {object} dictionary - optional dictionary to fill
   * @param {function} callback - callback on success
   * @param {function} error - callback on error
   */
  audioSearch.getUserMedia = function getUserMedia(dictionary, callback, error) {
      if (error === undefined) {
          /* eslint no-alert: "off"*/
          error = function error() {
              alert('navigator.getUserMedia either not defined (Safari, IE) or denied.');
          };
      }
      if (callback === undefined) {
          callback = function callback(mediaStream) {
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
              'audio': {
                  'mandatory': {},
                  'optional': []
              }
          };
      }
      n.getUserMedia(dictionary, callback, error);
  };

  audioSearch.sampleBuffer = null;
  audioSearch.currentAnalyser = null;

  audioSearch.userMediaStarted = function userMediaStarted(audioStream) {
      /**
       * This function which patches Safari requires some time to get started
       * so we call it on object creation.
       */
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
  audioSearch.animateLoop = function animateLoop(time) {
      audioSearch.currentAnalyser.getFloatTimeDomainData(audioSearch.sampleBuffer);
      // returns best frequency or -1
      var frequencyDetected = audioSearch.autoCorrelate(audioSearch.sampleBuffer, audioSearch.audioContext.sampleRate, audioSearch.minFrequency, audioSearch.maxFrequency);
      var retValue = audioSearch.sampleCallback(frequencyDetected);
      if (retValue !== -1) {
          audioSearch.animationFrameCallbackId = window.requestAnimationFrame(audioSearch.animateLoop);
      }
  };

  audioSearch.pitchSmoothingSize = 40;
  audioSearch.lastPitchClassesDetected = [];
  audioSearch.lastPitchesDetected = [];
  audioSearch.lastCentsDeviationsDetected = [];

  audioSearch.smoothPitchExtraction = function smoothPitchExtraction(frequency) {
      if (frequency === -1) {
          audioSearch.lastPitchClassesDetected.shift();
          audioSearch.lastPitchesDetected.shift();
          audioSearch.lastCentsDeviationsDetected.shift();
      } else {
          var _audioSearch$midiNumD = audioSearch.midiNumDiffFromFrequency(frequency),
              _audioSearch$midiNumD2 = slicedToArray(_audioSearch$midiNumD, 2),
              midiNum = _audioSearch$midiNumD2[0],
              _centsOff = _audioSearch$midiNumD2[1];

          if (audioSearch.lastPitchClassesDetected.length > audioSearch.pitchSmoothingSize) {
              audioSearch.lastPitchClassesDetected.shift();
              audioSearch.lastPitchesDetected.shift();
              audioSearch.lastCentsDeviationsDetected.shift();
          }
          audioSearch.lastPitchClassesDetected.push(midiNum % 12);
          audioSearch.lastPitchesDetected.push(midiNum);
          audioSearch.lastCentsDeviationsDetected.push(_centsOff);
      }
      var mostCommonPitchClass = common.statisticalMode(audioSearch.lastPitchClassesDetected);
      if (mostCommonPitchClass === null) {
          return [-1, 0];
      }
      var pitchesMatchingClass = [];
      var centsMatchingClass = [];
      for (var i = 0; i < audioSearch.lastPitchClassesDetected.length; i++) {
          if (audioSearch.lastPitchClassesDetected[i] === mostCommonPitchClass) {
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

  audioSearch.sampleCallback = function sampleCallback(frequency) {
      var _audioSearch$smoothPi = audioSearch.smoothPitchExtraction(frequency),
          _audioSearch$smoothPi2 = slicedToArray(_audioSearch$smoothPi, 2),
          unused_midiNum = _audioSearch$smoothPi2[0],
          unused_centsOff = _audioSearch$smoothPi2[1];
  };

  // from Chris Wilson. Replace with Jordi's
  audioSearch.autoCorrelate = function autoCorrelate(buf, sampleRate, minFrequency, maxFrequency) {
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
      if (rms < 0.01) {
          return -1;
      } // not enough signal

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

          for (var _i = 0; _i < MAX_SAMPLES; _i++) {
              correlation += Math.abs(buf[_i] - buf[_i + offset]);
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
  audioSearch.midiNumDiffFromFrequency = function midiNumDiffFromFrequency(frequency) {
      var midiNumFloat = 12 * (Math.log(frequency / 440) / Math.log(2)) + 69;
      var midiNum = Math.round(midiNumFloat);
      var centsOff = Math.round(100 * (midiNumFloat - midiNum));
      return [midiNum, centsOff];
  };

  /**
   * Adopted from Matt Diamond's recorder.js code MIT License
   */
  var Recorder = function () {
      function Recorder(cfg) {
          classCallCheck(this, Recorder);

          var config = cfg || {};
          this.bufferLen = config.bufferLen || 4096;
          this.config = config;
          this.recording = false;
          this.currCallback = undefined;
          this.audioContext = audioSearch.audioContext;
          this.frequencyCanvasInfo = {
              id: 'frequencyAnalyser',
              width: undefined,
              height: undefined,
              canvasContext: undefined,
              animationFrameID: undefined
          };
          this.waveformCanvasInfo = {
              id: 'waveformCanvas',
              width: undefined,
              height: undefined,
              canvasContext: undefined
          };
          this.analyserNode = undefined;
      }

      /**
       * Start here -- polyfills navigator, runs getUserMedia and then sends to audioStreamConnected
       */


      createClass(Recorder, [{
          key: 'initAudio',
          value: function initAudio() {
              var _this = this;

              this.polyfillNavigator();
              navigator.getUserMedia({
                  'audio': {
                      'mandatory': {
                          'googEchoCancellation': 'false',
                          'googAutoGainControl': 'false',
                          'googNoiseSuppression': 'false',
                          'googHighpassFilter': 'false'
                          // 'echoCancellation': false,
                          // 'autoGainControl': false,
                          // 'noiseSuppression': false,
                          // 'highpassFilter': false,
                      },
                      'optional': []
                  }
              }, function (s) {
                  return _this.audioStreamConnected(s);
              }, function (error) {
                  console.log('Error getting audio -- try on google Chrome?');
                  console.log(error);
              });
          }

          /**
           * After the user has given permission to record, this method is called.
           * It creates a gain point, and then connects the input source to the gain.
           * It connects an analyserNode (fftSize 2048) to the gain.
           *
           * It creates a second gain of 0.0 connected to the destination, so that
           * we're not hearing what we're playing in in an infinite loop (SUCKS to turn this off...)
           *
           * And it calls this.connectSource on the inputPoint so that
           * we can do something with all these wonderful inputs.
           */

      }, {
          key: 'audioStreamConnected',
          value: function audioStreamConnected(stream) {
              var inputPoint = this.audioContext.createGain();

              // Create an AudioNode from the stream.
              var audioInput = this.audioContext.createMediaStreamSource(stream);
              audioInput.connect(inputPoint);

              var analyserNode = this.audioContext.createAnalyser();
              analyserNode.fftSize = 2048;
              this.analyserNode = analyserNode;
              inputPoint.connect(analyserNode);

              this.connectSource(inputPoint);

              var zeroGain = this.audioContext.createGain();
              zeroGain.gain.value = 0.0;
              inputPoint.connect(zeroGain);
              zeroGain.connect(this.audioContext.destination);
          }

          /**
           * Creates a worker to receive and process all the messages asychronously.
           */

      }, {
          key: 'connectSource',
          value: function connectSource(source) {
              var _this2 = this;

              this.context = source.context;
              this.setNode();

              // create a Worker with inline code...
              var workerBlob = new Blob(['(', recorderWorkerJs, ')()'], { type: 'application/javascript' });
              var workerURL = URL.createObjectURL(workerBlob);
              this.worker = new Worker(workerURL);
              /**
               * When worker sends a message, we just send it to the currentCallback...
               */
              this.worker.onmessage = function (e) {
                  var blob = e.data;
                  _this2.currCallback(blob);
              };
              URL.revokeObjectURL(workerURL);

              this.worker.postMessage({
                  command: 'init',
                  config: {
                      sampleRate: this.context.sampleRate
                  }
              });

              /**
               * Whenever the ScriptProcessorNode receives enough audio to process
               * (i.e., this.bufferLen stereo samples; default 4096), then it calls onaudioprocess
               * which is set up to send the event's .getChannelData to the WebWorker via a
               * postMessage.
               *
               * The 'record' command sends no message back.
               */
              this.node.onaudioprocess = function (e) {
                  if (!_this2.recording) {
                      return;
                  }
                  _this2.worker.postMessage({
                      command: 'record',
                      buffer: [e.inputBuffer.getChannelData(0), e.inputBuffer.getChannelData(1)]
                  });
              };

              source.connect(this.node);

              /**
               * polyfill for Chrome error.
               *
               * if the ScriptProcessorNode (this.node) is not connected to an output
               * the "onaudioprocess" event is not triggered in Chrome.
               */
              this.node.connect(this.context.destination);
          }

          /**
           * Creates a ScriptProcessorNode (preferably) to allow for direct audio processing.
           *
           * Sets it to this.node and returns it.
           */

      }, {
          key: 'setNode',
          value: function setNode() {
              var numInputChannels = 2;
              var numOutputChannels = 2;
              if (!this.context.createScriptProcessor) {
                  this.node = this.context.createJavaScriptNode(this.bufferLen, numInputChannels, numOutputChannels);
              } else {
                  this.node = this.context.createScriptProcessor(this.bufferLen, numInputChannels, numOutputChannels);
              }
              return this.node;
          }

          /**
           * Configure from another source...
           */

      }, {
          key: 'configure',
          value: function configure(cfg) {
              for (var prop in cfg) {
                  if (Object.hasOwnProperty.call(cfg, prop)) {
                      this.config[prop] = cfg[prop];
                  }
              }
          }
      }, {
          key: 'record',
          value: function record() {
              this.recording = true;
          }
      }, {
          key: 'stop',
          value: function stop() {
              this.recording = false;
          }
      }, {
          key: 'clear',
          value: function clear() {
              this.worker.postMessage({ command: 'clear' });
          }

          /**
           * Directly get the buffers from the worker and then call cb.
           */

      }, {
          key: 'getBuffers',
          value: function getBuffers(cb) {
              this.currCallback = cb || this.config.callback;
              this.worker.postMessage({ command: 'getBuffers' });
          }

          /**
           * call exportWAV or exportMonoWAV on the worker, then call cb or (if undefined) setupDownload.
           */

      }, {
          key: 'exportWAV',
          value: function exportWAV(cb, type, isMono) {
              var _this3 = this;

              var command = 'exportWAV';
              if (isMono === true) {
                  // default false
                  command = 'exportMonoWAV';
              }
              this.currCallback = cb || this.config.callback;
              type = type || this.config.type || 'audio/wav';
              if (!this.currCallback) {
                  this.currCallback = function (blob) {
                      _this3.setupDownload(blob, 'myRecording' + Date.now().toString() + '.wav');
                  };
              }
              this.worker.postMessage({
                  'command': command,
                  'type': type
              });
          }
      }, {
          key: 'exportMonoWAV',
          value: function exportMonoWAV(cb, type) {
              this.exportWAV(cb, type, true);
          }
      }, {
          key: 'setupDownload',
          value: function setupDownload(blob, filename, elementId) {
              elementId = elementId || 'save';
              var url = (window.URL || window.webkitURL).createObjectURL(blob);
              var link = document.getElementById(elementId);
              link.href = url;
              link.download = filename || 'output.wav';
          }

          /**
           * Polyfills for getUserMedia (requestAnimationFrame polyfills not needed.)
           * As of 2016 September, only Edge support unprefixed.
           */

      }, {
          key: 'polyfillNavigator',
          value: function polyfillNavigator() {
              if (!navigator.getUserMedia) {
                  navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
              }
          }
      }, {
          key: 'updateAnalysers',
          value: function updateAnalysers(time) {
              var _this4 = this;

              if (!this.frequencyCanvasInfo.canvasContext) {
                  var canvas = document.getElementById(this.frequencyCanvasInfo.id);
                  if (!canvas) {
                      return;
                  }
                  this.frequencyCanvasInfo.width = canvas.width;
                  this.frequencyCanvasInfo.height = canvas.height;
                  this.frequencyCanvasInfo.canvasContext = canvas.getContext('2d');
              }

              // analyser draw code here
              var SPACING = 3;
              var BAR_WIDTH = 1;
              var numBars = Math.round(this.frequencyCanvasInfo.width / SPACING);
              var freqByteData = new Uint8Array(this.analyserNode.frequencyBinCount);

              this.analyserNode.getByteFrequencyData(freqByteData);

              var canvasContext = this.frequencyCanvasInfo.canvasContext;
              canvasContext.clearRect(0, 0, this.frequencyCanvasInfo.width, this.frequencyCanvasInfo.height);
              canvasContext.fillStyle = '#F6D565';
              canvasContext.lineCap = 'round';
              var multiplier = this.analyserNode.frequencyBinCount / numBars;

              // Draw rectangle for each frequency bin.
              for (var i = 0; i < numBars; ++i) {
                  var magnitude = 0;
                  var offset = Math.floor(i * multiplier);
                  for (var j = 0; j < multiplier; j++) {
                      magnitude += freqByteData[offset + j];
                  }
                  magnitude = magnitude * (this.frequencyCanvasInfo.height / 256) / multiplier;
                  canvasContext.fillStyle = 'hsl( ' + Math.round(i * 360 / numBars) + ', 100%, 50%)';
                  canvasContext.fillRect(i * SPACING, this.frequencyCanvasInfo.height, BAR_WIDTH, -1 * magnitude);
              }

              this.frequencyCanvasInfo.animationFrameID = window.requestAnimationFrame(function (t) {
                  return _this4.updateAnalysers(t);
              });
          }
      }, {
          key: 'drawWaveformCanvas',
          value: function drawWaveformCanvas(buffers) {
              var data = buffers[0]; // one track of stereo recording.
              if (!this.waveformCanvasInfo.context) {
                  var canvas = document.getElementById(this.waveformCanvasInfo.id);
                  if (!canvas) {
                      return;
                  }
                  this.waveformCanvasInfo.width = canvas.width;
                  this.waveformCanvasInfo.height = canvas.height;
                  this.waveformCanvasInfo.context = canvas.getContext('2d');
              }
              var context = this.waveformCanvasInfo.context;
              var step = Math.ceil(data.length / this.waveformCanvasInfo.width);
              var amp = this.waveformCanvasInfo.height / 2;
              context.fillStyle = 'silver';
              context.clearRect(0, 0, this.waveformCanvasInfo.width, this.waveformCanvasInfo.height);
              for (var i = 0; i < this.waveformCanvasInfo.width; i++) {
                  var min = 1.0;
                  var max = -1.0;
                  for (var j = 0; j < step; j++) {
                      var datum = data[i * step + j];
                      if (datum < min) {
                          min = datum;
                      }
                      if (datum > max) {
                          max = datum;
                      }
                  }
                  context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
              }
          }

          /**
           * set this as a callback from getBuffers.  Returns the source so that a stop() command
           * is possible.
           */

      }, {
          key: 'playBuffers',
          value: function playBuffers(buffers) {
              var channels = 2;
              var numFrames = buffers[0].length;
              var audioBuffer = this.context.createBuffer(channels, numFrames, this.context.sampleRate);
              for (var channel = 0; channel < channels; channel++) {
                  var thisChannelBuffer = audioBuffer.getChannelData(channel);
                  for (var i = 0; i < numFrames; i++) {
                      thisChannelBuffer[i] = buffers[channel][i];
                  }
              }
              var source = this.context.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(this.context.destination);
              source.start();
              return source;
          }
      }]);
      return Recorder;
  }();

  /**
   * This code does NOT go through babel, so no arrow functions, let, const, etc.
   */
  var recorderWorkerJs = 'function recorderWorkerJs() {\n    /**\n     *\n     *   Rewritten from Matt Diamond\'s recorderWorker -- MIT License\n     */\n    RecorderWorker = function RecorderWorker(parentContext) {\n            this.parent = parentContext;\n            this.recLength = 0;\n            this.recBuffersL = [];\n            this.recBuffersR = [];\n            this.sampleRate = undefined;\n    };\n    RecorderWorker.prototype.onmessage = function onmessage(e) {\n            switch (e.data.command) {\n            case \'init\':\n                this.init(e.data.config);\n                break;\n            case \'record\':\n                this.record(e.data.buffer);\n                break;\n            case \'exportWAV\':\n                this.exportWAV(e.data.type);\n                break;\n            case \'exportMonoWAV\':\n                this.exportMonoWAV(e.data.type);\n                break;\n            case \'getBuffers\':\n                this.getBuffers();\n                break;\n            case \'clear\':\n                this.clear();\n                break;\n            default:\n                break;\n            }\n   };\n   RecorderWorker.prototype.postMessage = function postMessage(msg) {\n            this.parent.postMessage(msg);\n   };\n\n   RecorderWorker.prototype.init = function init(config) {\n            this.sampleRate = config.sampleRate;\n   };\n\n   RecorderWorker.prototype.record = function record(inputBuffer) {\n            var inputBufferL = inputBuffer[0];\n            var inputBufferR = inputBuffer[1];\n            this.recBuffersL.push(inputBufferL);\n            this.recBuffersR.push(inputBufferR);\n            this.recLength += inputBufferL.length;\n   };\n\n   RecorderWorker.prototype.exportWAV = function exportWAV(type) {\n            var bufferL = this.mergeBuffers(this.recBuffersL);\n            var bufferR = this.mergeBuffers(this.recBuffersR);\n            var interleaved = this.interleave(bufferL, bufferR);\n            var dataview = this.encodeWAV(interleaved);\n            var audioBlob = new Blob([dataview], { \'type\': type });\n\n            this.postMessage(audioBlob);\n   };\n\n   RecorderWorker.prototype.exportMonoWAV = function exportMonoWAV(type) {\n            var bufferL = this.mergeBuffers(this.recBuffersL);\n            var dataview = this.encodeWAV(bufferL);\n            var audioBlob = new Blob([dataview], { \'type\': type });\n\n            this.postMessage(audioBlob);\n   };\n\n   RecorderWorker.prototype.mergeBuffers = function mergeBuffers(recBuffers) {\n            var result = new Float32Array(this.recLength);\n            var offset = 0;\n            for (var i = 0; i < recBuffers.length; i++) {\n                result.set(recBuffers[i], offset);\n                offset += recBuffers[i].length;\n            }\n            return result;\n    };\n\n    RecorderWorker.prototype.getBuffers = function getBuffers() {\n            var buffers = [];\n            buffers.push(this.mergeBuffers(this.recBuffersL));\n            buffers.push(this.mergeBuffers(this.recBuffersR));\n            this.postMessage(buffers);\n        };\n\n    RecorderWorker.prototype.clear = function clear() {\n            this.recLength = 0;\n            this.recBuffersL = [];\n            this.recBuffersR = [];\n        }\n\n    RecorderWorker.prototype.interleave = function interleave(inputL, inputR) {\n            var combinedLength = inputL.length + inputR.length;\n            var result = new Float32Array(combinedLength);\n\n            var index = 0;\n            var inputIndex = 0;\n\n            while (index < combinedLength) {\n                result[index++] = inputL[inputIndex];\n                result[index++] = inputR[inputIndex];\n                inputIndex++;\n            }\n            return result;\n        }\n    RecorderWorker.prototype.encodeWAV = function encodeWAV(samples, mono) {\n            var buffer = new ArrayBuffer(44 + (samples.length * 2));\n            var view = new DataView(buffer);\n\n            /* RIFF identifier */\n            writeString(view, 0, \'RIFF\');\n\n            /* file length */\n            view.setUint32(4, 32 + samples.length * 2, true);\n\n            /* RIFF type */\n            writeString(view, 8, \'WAVE\');\n\n            /* format chunk identifier */\n            writeString(view, 12, \'fmt \');\n\n            /* format chunk length */\n            view.setUint32(16, 16, true);\n\n            /* sample format (raw) */\n            view.setUint16(20, 1, true);\n\n            /* channel count */\n            view.setUint16(22, mono ? 1 : 2, true);\n\n            /* sample rate */\n            view.setUint32(24, this.sampleRate, true);\n\n            /* byte rate (sample rate * block align) */\n            view.setUint32(28, this.sampleRate * 4, true);\n\n            /* block align (channel count * bytes per sample) */\n            view.setUint16(32, 4, true);\n\n            /* bits per sample */\n            view.setUint16(34, 16, true);\n\n            /* data chunk identifier */\n            writeString(view, 36, \'data\');\n\n            /* data chunk length */\n            view.setUint32(40, samples.length * 2, true);\n\n            floatTo16BitPCM(view, 44, samples);\n\n            return view;\n        }\n\n    function floatTo16BitPCM(output, offset, input) {\n        for (var i = 0; i < input.length; i++, offset += 2) {\n            var s = Math.max(-1, Math.min(1, input[i]));\n            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);\n        }\n    }\n\n    function writeString(view, offset, string) {\n        for (var i = 0; i < string.length; i++) {\n            view.setUint8(offset + i, string.charCodeAt(i));\n        }\n    }\n\n    var recordWorker = new RecorderWorker(this);\n    this.onmessage = (function mainOnMessage(e) { recordWorker.onmessage(e) }).bind(this);\n}';

  var audioRecording = { 'Recorder': Recorder };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/beam -- Beams and Beam class
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  var Beam = function (_prebase$ProtoM21Obje) {
      inherits(Beam, _prebase$ProtoM21Obje);

      function Beam(type, direction) {
          classCallCheck(this, Beam);

          var _this = possibleConstructorReturn(this, (Beam.__proto__ || Object.getPrototypeOf(Beam)).call(this));

          _this.classes.push('Beam');
          _this.type = type;
          _this.direction = direction;
          _this.independentAngle = undefined;
          _this.number = undefined;
          return _this;
      }

      return Beam;
  }(prebase.ProtoM21Object);
  beam.Beam = Beam;
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
  var Beams = function (_prebase$ProtoM21Obje2) {
      inherits(Beams, _prebase$ProtoM21Obje2);

      function Beams() {
          classCallCheck(this, Beams);

          var _this2 = possibleConstructorReturn(this, (Beams.__proto__ || Object.getPrototypeOf(Beams)).call(this));

          _this2.classes.push('Beams');
          _this2.beamsList = [];
          _this2.feathered = false;
          return _this2;
      }

      createClass(Beams, [{
          key: 'append',

          /**
           * Append a new {@link music21.beam.Beam} object to this Beams, automatically creating the Beam
           *   object and incrementing the number count.
           *
           * @memberof music21.beam.Beams
           * @param {string} type - the type (passed to {@link music21.beam.Beam})
           * @param {string} [direction=undefined] - the direction if type is "partial"
           * @returns {music21.beam.Beam} newly appended object
           */
          value: function append(type, direction) {
              var obj = new beam.Beam(type, direction);
              obj.number = this.beamsList.length + 1;
              this.beamsList.push(obj);
              return obj;
          }
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

      }, {
          key: 'fill',
          value: function fill(level, type) {
              this.beamsList = [];
              var count = 1;
              if (level === 1 || level === '8th' || level === duration.typeFromNumDict[8]) {
                  count = 1;
              } else if (level === 2 || level === duration.typeFromNumDict[16]) {
                  count = 2;
              } else if (level === 3 || level === duration.typeFromNumDict[32]) {
                  count = 3;
              } else if (level === 4 || level === duration.typeFromNumDict[64]) {
                  count = 4;
              } else if (level === 5 || level === duration.typeFromNumDict[128]) {
                  count = 5;
              } else if (level === 6 || level === duration.typeFromNumDict[256]) {
                  count = 6;
              } else {
                  throw new Music21Exception('cannot fill beams for level ' + level);
              }
              for (var i = 1; i <= count; i++) {
                  var obj = new beam.Beam();
                  obj.number = i;
                  this.beamsList.push(obj);
              }
              if (type !== undefined) {
                  this.setAll(type);
              }
              return this;
          }
          /**
           * Get the beam with the given number or throw an exception.
           *
           * @memberof music21.beam.Beams
           * @param {Int} number - the beam number to retrieve (usually one less than the position in `.beamsList`)
           * @returns {music21.beam.Beam|undefined}
           */

      }, {
          key: 'getByNumber',
          value: function getByNumber(number) {
              if (!this.getNumbers().includes(number)) {
                  throw new Music21Exception('beam number error: ' + number);
              }
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = this.beamsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var thisBeam = _step.value;

                      if (thisBeam.number === number) {
                          return thisBeam;
                      }
                  }
              } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                      }
                  } finally {
                      if (_didIteratorError) {
                          throw _iteratorError;
                      }
                  }
              }

              return undefined;
          }
          /**
           * Get an Array of all the numbers for the beams
           *
           * @memberof music21.beam.Beams
           * @returns {Array<Int>} all the numbers
           */

      }, {
          key: 'getNumbers',
          value: function getNumbers() {
              var numbers = [];
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = this.beamsList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var thisBeam = _step2.value;

                      numbers.push(thisBeam.number);
                  }
              } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                          _iterator2.return();
                      }
                  } finally {
                      if (_didIteratorError2) {
                          throw _iteratorError2;
                      }
                  }
              }
          }
          /**
           * Returns the type + "-" + direction (if direction is defined)
           * for the beam with the given number.
           *
           * @param {Int} number
           * @returns {music21.beam.Beam|undefined}
           */

      }, {
          key: 'getTypeByNumber',
          value: function getTypeByNumber(number) {
              var beamObj = this.getByNumber(number);
              if (beamObj.direction === undefined) {
                  return beamObj.type;
              } else {
                  var x = beamObj.type + '-' + beamObj.direction;
                  return x;
              }
          }
          /**
           * Get an Array of all the types for the beams
           *
           * @memberof music21.beam.Beams
           * @returns {Array<string>} all the types
           */

      }, {
          key: 'getTypes',
          value: function getTypes() {
              var types = [];
              for (var i = 0; i < this.length; i++) {
                  types.push(this.beamsList[i].type);
              }
              return types;
          }
          /**
           * Set all the {@link music21.beam.Beam} objects to a given type/direction
           *
           * @memberof music21.beam.Beams
           * @param {string} type - beam type
           * @param {string} [direction] - beam direction
           * @returns {this}
           */

      }, {
          key: 'setAll',
          value: function setAll(type, direction) {
              if (beam.validBeamTypes[type] === undefined) {
                  throw new Music21Exception('invalid beam type: ' + type);
              }
              for (var i = 0; i < this.length; i++) {
                  var b = this.beamsList[i];
                  b.type = type;
                  b.direction = direction;
              }
              return this;
          }
          /**
           * Set the {@link music21.beam.Beam} object specified by `number` to a given type/direction
           *
           * @memberof music21.beam.Beams
           * @param {Int} number
           * @param {string} type
           * @param {string} [direction]
           * @returns {this}
           */

      }, {
          key: 'setByNumber',
          value: function setByNumber(number, type, direction) {
              if (direction === undefined) {
                  var splitit = type.split('-');
                  type = splitit[0];
                  direction = splitit[1]; // can be undefined...
              }
              if (beam.validBeamTypes[type] === undefined) {
                  throw new Music21Exception('invalid beam type: ' + type);
              }
              for (var i = 0; i < this.length; i++) {
                  if (this.beamsList[i].number === number) {
                      this.beamsList[i].type = type;
                      this.beamsList[i].direction = direction;
                  }
              }
              return this;
          }
      }, {
          key: 'length',
          get: function get() {
              return this.beamsList.length;
          }
      }]);
      return Beams;
  }(prebase.ProtoM21Object);
  beam.Beams = Beams;

  /**
   * music21j -- Javascript reimplementation of Core music21 features.
   * music21/pitch -- pitch routines
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21, Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  var Accidental = function (_prebase$ProtoM21Obje) {
      inherits(Accidental, _prebase$ProtoM21Obje);

      function Accidental(accName) {
          classCallCheck(this, Accidental);

          var _this = possibleConstructorReturn(this, (Accidental.__proto__ || Object.getPrototypeOf(Accidental)).call(this));

          _this.classes.push('Accidental');
          _this._name = '';
          _this._alter = 0.0;
          _this._modifier = '';
          _this._unicodeModifier = '';
          _this.displayType = 'normal'; // "normal", "always" supported currently
          _this.displayStatus = undefined; // true, false, undefined
          _this.set(accName);
          return _this;
      }
      /**
       * Sets a parameter of the accidental and updates name, alter, and modifier to suit.
       *
       * @memberof music21.pitch.Accidental
       * @param {number|string} accName - the name, number, or modifier to set
       * @returns {undefined}
       */


      createClass(Accidental, [{
          key: 'set',
          value: function set(accName) {
              if (accName !== undefined && accName.toLowerCase !== undefined) {
                  accName = accName.toLowerCase();
              }

              if (accName === 'natural' || accName === 'n' || accName === 0 || accName === undefined) {
                  this._name = 'natural';
                  this._alter = 0.0;
                  this._modifier = '';
                  this._unicodeModifier = '♮';
              } else if (accName === 'sharp' || accName === '#' || accName === 1) {
                  this._name = 'sharp';
                  this._alter = 1.0;
                  this._modifier = '#';
                  this._unicodeModifier = '♯';
              } else if (accName === 'flat' || accName === '-' || accName === -1) {
                  this._name = 'flat';
                  this._alter = -1.0;
                  this._modifier = '-';
                  this._unicodeModifier = '♭';
              } else if (accName === 'double-flat' || accName === '--' || accName === -2) {
                  this._name = 'double-flat';
                  this._alter = -2.0;
                  this._modifier = '--';
                  this._unicodeModifier = '&#x1d12b;';
              } else if (accName === 'double-sharp' || accName === '##' || accName === 2) {
                  this._name = 'double-sharp';
                  this._alter = 2.0;
                  this._modifier = '##';
                  this._unicodeModifier = '&#x1d12a;';
              } else if (accName === 'triple-flat' || accName === '---' || accName === -3) {
                  this._name = 'triple-flat';
                  this._alter = -3.0;
                  this._modifier = '---';
                  this._unicodeModifier = '♭&#x1d12b;';
              } else if (accName === 'triple-sharp' || accName === '###' || accName === 3) {
                  this._name = 'triple-sharp';
                  this._alter = 3.0;
                  this._modifier = '###';
                  this._unicodeModifier = '&#x1d12a;';
              }
          }
          /**
           * Return or set the name of the accidental ('flat', 'sharp', 'natural', etc.);
           *
           * When set, updates alter and modifier.
           *
           * @memberof music21.pitch.Accidental#
           * @var {string} name
           */

      }, {
          key: 'name',
          get: function get() {
              return this._name;
          },
          set: function set(n) {
              this.init(n);
          }
          /**
           * Return or set the alteration amount (-1.0 = flat; 1.0 = sharp; etc.)
           *
           * When set, updates name and modifier.
           *
           * @memberof music21.pitch.Accidental#
           * @var {number} alter
           */

      }, {
          key: 'alter',
          get: function get() {
              return this._alter;
          },
          set: function set(alter) {
              this.init(alter);
          }
          /**
           * Return or set the modifier ('-', '#', '')
           *
           * When set, updates alter and name.
            * @memberof music21.pitch.Accidental#
           * @var {string} modifier
           */

      }, {
          key: 'modifier',
          get: function get() {
              return this._modifier;
          },
          set: function set(modifier) {
              this.init(modifier);
          }
          /**
           * Returns the modifier for vexflow ('b', '#', 'n')
           *
           * @memberof music21.pitch.Accidental#
           * @var {string} vexflowModifier
           * @readonly
           */

      }, {
          key: 'vexflowModifier',
          get: function get() {
              // todo -- rewrite with mapping.
              var m = this.modifier;
              if (m === '') {
                  return 'n';
              } else if (m === '#') {
                  return '#';
              } else if (m === '-') {
                  return 'b';
              } else if (m === '##') {
                  return '##';
              } else if (m === '--') {
                  return 'bb';
              } else if (m === '###') {
                  return '###';
              } else if (m === '---') {
                  return 'bbb';
              } else {
                  throw new Music21Exception('Vexflow does not support: ' + m);
              }
          }
          /**
           * Returns the modifier in unicode or
           * for double and triple accidentals, as a hex escape
           *
           * @memberof music21.pitch.Accidental#
           * @var {string} unicodeModifier
           * @readonly
           */

      }, {
          key: 'unicodeModifier',
          get: function get() {
              return this._unicodeModifier;
          }
      }]);
      return Accidental;
  }(prebase.ProtoM21Object);
  pitch.Accidental = Accidental;

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
  var Pitch = function (_prebase$ProtoM21Obje2) {
      inherits(Pitch, _prebase$ProtoM21Obje2);

      function Pitch(pn) {
          classCallCheck(this, Pitch);

          var _this2 = possibleConstructorReturn(this, (Pitch.__proto__ || Object.getPrototypeOf(Pitch)).call(this));

          _this2.classes.push('Pitch');
          if (pn === undefined) {
              pn = 'C';
          }
          _this2._step = 'C';
          _this2._octave = 4;
          _this2._accidental = undefined;

          /* pn can be a nameWithOctave */
          if (typeof pn === 'number') {
              if (pn < 12) {
                  pn += 60; // pitchClass
              }
              _this2.ps = pn;
          } else if (pn.match(/\d+/)) {
              _this2.nameWithOctave = pn;
          } else {
              _this2.name = pn;
          }
          return _this2;
      }

      createClass(Pitch, [{
          key: 'vexflowName',


          /**
           * Returns the vexflow name for the pitch in the given clef.
           *
           * @memberof music21.pitch.Pitch#
           * @param {clef.Clef} clefObj - the active {@link music21.clef.Clef} object
           * @returns {String} - representation in vexflow
           */
          value: function vexflowName(clefObj) {
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
              if (this.accidental !== undefined) {
                  accidentalType = this.accidental.vexflowModifier;
              }
              var outName = tempPitch.step + accidentalType + '/' + tempPitch.octave;
              return outName;
          }
      }, {
          key: 'step',
          get: function get() {
              return this._step;
          },
          set: function set(s) {
              this._step = s;
          }
      }, {
          key: 'octave',
          get: function get() {
              return this._octave;
          },
          set: function set(o) {
              this._octave = o;
          }
      }, {
          key: 'accidental',
          get: function get() {
              return this._accidental;
          },
          set: function set(a) {
              if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object' && a !== undefined) {
                  a = new pitch.Accidental(a);
              }
              this._accidental = a;
          }
      }, {
          key: 'name',
          get: function get() {
              if (this.accidental === undefined) {
                  return this.step;
              } else {
                  return this.step + this.accidental.modifier;
              }
          },
          set: function set(nn) {
              this.step = nn.slice(0, 1).toUpperCase();
              var tempAccidental = nn.slice(1);
              if (tempAccidental) {
                  // not the empty string
                  this.accidental = tempAccidental; // converts automatically
              } else {
                  this.accidental = undefined;
              }
          }
      }, {
          key: 'nameWithOctave',
          get: function get() {
              return this.name + this.octave.toString();
          },
          set: function set(pn) {
              var storedOctave = pn.match(/\d+/);
              if (storedOctave !== undefined) {
                  pn = pn.replace(/\d+/, '');
                  this.octave = parseInt(storedOctave);
                  this.name = pn;
              } else {
                  this.name = pn;
              }
          }
      }, {
          key: 'diatonicNoteNum',
          get: function get() {
              return this.octave * 7 + pitch.nameToSteps[this.step] + 1;
          },
          set: function set(newDNN) {
              newDNN -= 1; // makes math easier
              this.octave = Math.floor(newDNN / 7);
              this.step = pitch.stepsToName[newDNN % 7];
          }
      }, {
          key: 'frequency',
          get: function get() {
              return 440 * Math.pow(2, (this.ps - 69) / 12);
          }
      }, {
          key: 'midi',
          get: function get() {
              return Math.floor(this.ps);
          }
      }, {
          key: 'ps',
          get: function get() {
              var accidentalAlter = 0;
              if (this.accidental !== undefined) {
                  accidentalAlter = parseInt(this.accidental.alter);
              }
              return (this.octave + 1) * 12 + pitch.nameToMidi[this.step] + accidentalAlter;
          },
          set: function set(ps) {
              this.name = pitch.midiToName[ps % 12];
              this.octave = Math.floor(ps / 12) - 1;
          }
      }]);
      return Pitch;
  }(prebase.ProtoM21Object);
  pitch.Pitch = Pitch;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/note -- Note, Rest, NotRest, GeneralNote
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  var Lyric = function (_prebase$ProtoM21Obje) {
      inherits(Lyric, _prebase$ProtoM21Obje);

      function Lyric(text, number, syllabic, applyRaw, identifier) {
          classCallCheck(this, Lyric);

          var _this = possibleConstructorReturn(this, (Lyric.__proto__ || Object.getPrototypeOf(Lyric)).call(this));

          _this.classes.push('Lyric');
          _this.lyricConnector = '-'; // override to place something else between two notes...
          _this.text = text;
          _this._number = number || 1;
          _this.syllabic = syllabic;
          _this.applyRaw = applyRaw || false;
          _this.setTextAndSyllabic(_this.text, _this.applyRaw);
          _this._identifier = identifier;
          return _this;
      }

      createClass(Lyric, [{
          key: 'setTextAndSyllabic',
          value: function setTextAndSyllabic(rawText, applyRaw) {
              if (rawText === undefined) {
                  this.text = undefined;
                  return this;
              }

              if (!applyRaw && rawText.indexOf(this.lyricConnector) === 0 && rawText.slice(-1) === this.lyricConnector) {
                  this.text = rawText.slice(1, -1);
                  this.syllabic = 'middle';
              } else if (!applyRaw && rawText.indexOf(this.lyricConnector) === 0) {
                  this.text = rawText.slice(1);
                  this.syllabic = 'end';
              } else if (!applyRaw && rawText.slice(-1) === this.lyricConnector) {
                  this.text = rawText.slice(0, -1);
                  this.syllabic = 'begin';
              } else {
                  this.text = rawText;
                  if (this.syllabic === undefined) {
                      this.syllabic = 'single';
                  }
              }
              return this;
          }
      }, {
          key: 'identifier',
          get: function get() {
              return this._identifier || this._number;
          },
          set: function set(i) {
              this._identifier = i;
          }
          // a property just to match m21p

      }, {
          key: 'number',
          get: function get() {
              return this._number;
          },
          set: function set(n) {
              this._number = n;
          }
      }, {
          key: 'rawText',
          get: function get() {
              if (this.syllabic === 'begin') {
                  return this.text + this.lyricConnector;
              } else if (this.syllabic === 'middle') {
                  return this.lyricConnector + this.text + this.lyricConnector;
              } else if (this.syllabic === 'end') {
                  return this.lyricConnector + this.text;
              } else {
                  return this.text;
              }
          },
          set: function set(t) {
              this.setTextAndSyllabic(t, false);
          }
      }]);
      return Lyric;
  }(prebase.ProtoM21Object);
  note.Lyric = Lyric;

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
  var GeneralNote = function (_base$Music21Object) {
      inherits(GeneralNote, _base$Music21Object);

      function GeneralNote(ql) {
          classCallCheck(this, GeneralNote);

          var _this2 = possibleConstructorReturn(this, (GeneralNote.__proto__ || Object.getPrototypeOf(GeneralNote)).call(this));

          _this2.classes.push('GeneralNote');
          _this2.isChord = false;
          if (ql !== undefined) {
              _this2.duration.quarterLength = ql;
          }
          _this2.volume = 60;
          _this2.activeVexflowNote = undefined;
          _this2.expressions = [];
          _this2.articulations = [];
          _this2.lyrics = [];
          _this2.tie = undefined;
          /* TODO: editorial objects, color, addLyric, insertLyric, hasLyrics */
          /* Later: augmentOrDiminish, getGrace, */
          return _this2;
      }

      createClass(GeneralNote, [{
          key: 'addLyric',

          /**
           * Add a {@link music21.note.Lyric} object to the Note
           *
           * @memberof music21.note.GeneralNote
           * @param {string} text - text to be added
           * @param {number} [lyricNumber] - integer specifying lyric (defaults to the current `.lyrics.length` + 1)
           * @param {boolean} [applyRaw=false] - if `true`, do not parse the text for cluses about syllable placement.
           * @param {string} [lyricIdentifier] - an optional identifier
           */
          value: function addLyric(text, lyricNumber, applyRaw, lyricIdentifier) {
              applyRaw = applyRaw || false;
              if (lyricNumber === undefined) {
                  var maxLyrics = this.lyrics.length + 1;
                  var newLyric = new note.Lyric(text, maxLyrics, undefined, applyRaw, lyricIdentifier);
                  this.lyrics.push(newLyric);
              } else {
                  var foundLyric = false;
                  for (var i = 0; i < this.lyrics.length; i++) {
                      var thisLyric = this.lyrics[i];
                      if (thisLyric.number === lyricNumber) {
                          thisLyric.text = text;
                          foundLyric = true;
                          break;
                      }
                  }
                  if (foundLyric === false) {
                      var _newLyric = new note.Lyric(text, lyricNumber, undefined, applyRaw, lyricIdentifier);
                      this.lyrics.push(_newLyric);
                  }
              }
          }
          /**
           * Change stem direction according to clef. Does nothing for GeneralNote; overridden in subclasses.
           *
           * @memberof music21.note.GeneralNote
           * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
           * @returns {undefined}
           */

      }, {
          key: 'setStemDirectionFromClef',
          value: function setStemDirectionFromClef(clef) {
              return undefined;
          }
          /**
           * Sets the vexflow accidentals (if any), the dots, and the stem direction
           *
           * @memberof music21.note.GeneralNote
           * @param {Vex.Flow.StaveNote} vfn - a Vex.Flow note
           * @param {object
           */

      }, {
          key: 'vexflowAccidentalsAndDisplay',
          value: function vexflowAccidentalsAndDisplay(vfn, options) {
              if (this.duration.dots > 0) {
                  for (var i = 0; i < this.duration.dots; i++) {
                      vfn.addDotToAll();
                  }
              }
              if (debug) {
                  console.log(this.stemDirection);
              }
              if (this.stemDirection === 'noStem') {
                  vfn.hasStem = function () {
                      return false;
                  }; // need to override...
                  // vfn.render_options.stem_height = 0;
              } else {
                  // correct VexFlow stem length for notes far from the center line;
                  var staveDNNSpacing = 5;
                  if (options.stave) {
                      staveDNNSpacing = Math.floor(options.stave.options.spacing_between_lines_px / 2);
                  }
                  if (options.clef !== undefined && this.pitch !== undefined) {
                      var midLine = options.clef.lowestLine + 4;
                      // console.log(midLine);
                      var absDNNfromCenter = Math.abs(this.pitch.diatonicNoteNum - midLine);
                      var absOverOctave = absDNNfromCenter - 7;
                      // console.log(absOverOctave);
                      if (absOverOctave > 0 && vfn.getStemLength !== undefined) {
                          var stemHeight = absOverOctave * staveDNNSpacing + vfn.getStemLength();
                          vfn.setStemLength(stemHeight);
                      }
                  }
              }
          }
          /**
           * Play the current element as a MIDI note.
           *
           * @memberof music21.note.GeneralNote
           * @param {number} [tempo=120] - tempo in bpm
           * @param {(base.Music21Object)} [nextElement] - for determining the length to play in case of tied notes, etc.
           * @param {object} [options] - other options (currently just `{instrument: {@link music21.instrument.Instrument} }`)
           * @returns {Number} - delay time in milliseconds until the next element (may be ignored)
           */

      }, {
          key: 'playMidi',
          value: function playMidi(tempo, nextElement, options) {
              // returns the number of milliseconds to the next element in
              // case that can't be determined otherwise.
              if (tempo === undefined) {
                  tempo = 120;
              }
              if (options === undefined) {
                  var inst = void 0;
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
              var midNum = void 0;
              if (this.isClassOrSubclass('Note')) {
                  // Note, not rest
                  midNum = this.pitch.midi;
                  var stopTime = milliseconds / 1000;
                  if (nextElement !== undefined && nextElement.isClassOrSubclass('Note')) {
                      if (nextElement.pitch.midi !== this.pitch.midi) {
                          stopTime += 60 * 0.25 / tempo; // legato -- play 16th note longer
                      } else if (this.tie !== undefined && (this.tie.type === 'start' || this.tie.type === 'continue')) {
                          stopTime += 60 * nextElement.duration.quarterLength / tempo;
                          // this does not take into account 3 or more notes tied.
                          // TODO: look ahead at next nexts, etc.
                      }
                  } else if (nextElement === undefined) {
                      // let last note ring an extra beat...
                      stopTime += 60 * 1 / tempo;
                  }
                  // console.log(stopTime);
                  // console.log(this.tie);
                  if (this.tie === undefined || this.tie.type === 'start') {
                      // console.log(volume);
                      MIDI.noteOn(channel, midNum, volume, 0);
                      MIDI.noteOff(channel, midNum, stopTime);
                  } // else { console.log ('not going to play ', this.nameWithOctave); }
              } else if (this.isClassOrSubclass('Chord')) {
                  // TODO: Tied Chords.
                  for (var j = 0; j < this._notes.length; j++) {
                      midNum = this._notes[j].pitch.midi;
                      MIDI.noteOn(channel, midNum, volume, 0);
                      MIDI.noteOff(channel, midNum, milliseconds / 1000);
                  }
              } // it's a note.Rest -- do nothing -- milliseconds takes care of it...
              return milliseconds;
          }
      }, {
          key: 'lyric',
          get: function get() {
              if (this.lyrics.length > 0) {
                  return this.lyrics[0].text;
              } else {
                  return undefined;
              }
          },
          set: function set(value) {
              this.lyrics = [];
              if (value !== undefined && value !== false) {
                  this.lyrics.push(new note.Lyric(value));
              }
          }
      }, {
          key: 'midiVolume',
          get: function get() {
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
      }]);
      return GeneralNote;
  }(base.Music21Object);
  note.GeneralNote = GeneralNote;

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
  var NotRest = function (_GeneralNote) {
      inherits(NotRest, _GeneralNote);

      function NotRest(ql) {
          classCallCheck(this, NotRest);

          var _this3 = possibleConstructorReturn(this, (NotRest.__proto__ || Object.getPrototypeOf(NotRest)).call(this, ql));

          _this3.classes.push('NotRest');
          _this3.notehead = 'normal';
          _this3.noteheadFill = 'default';
          _this3.noteheadColor = undefined;
          _this3.noteheadParenthesis = false;
          _this3.volume = undefined; // not a real object yet.
          _this3.beams = new beam.Beams();
          /* TODO: this.duration.linkage -- need durationUnits */
          _this3.stemDirection = undefined;
          /* TODO: check stemDirection, notehead, noteheadFill, noteheadParentheses */
          return _this3;
      }

      return NotRest;
  }(GeneralNote);
  note.NotRest = NotRest;

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
  var Note = function (_NotRest) {
      inherits(Note, _NotRest);

      function Note(nn, ql) {
          classCallCheck(this, Note);

          var _this4 = possibleConstructorReturn(this, (Note.__proto__ || Object.getPrototypeOf(Note)).call(this, ql));

          _this4.classes.push('Note');
          _this4.isNote = true; // for speed
          _this4.isRest = false; // for speed
          if (nn !== undefined && nn.isClassOrSubclass !== undefined && nn.isClassOrSubclass('Pitch') === true) {
              _this4.pitch = nn;
          } else {
              _this4.pitch = new pitch.Pitch(nn);
          }
          return _this4;
      }

      createClass(Note, [{
          key: 'setStemDirectionFromClef',

          /* TODO: transpose, fullName, microtone, pitchclass, pitchClassString */
          /**
           * Change stem direction according to clef.
           *
           * @memberof music21.note.Note
           * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
           * @returns {music21.note.Note} Original object, for chaining methods
           */
          value: function setStemDirectionFromClef(clef) {
              if (clef === undefined) {
                  return this;
              } else {
                  var midLine = clef.lowestLine + 4;
                  var DNNfromCenter = this.pitch.diatonicNoteNum - midLine;
                  // console.log(DNNfromCenter, this.pitch.nameWithOctave);
                  if (DNNfromCenter >= 0) {
                      this.stemDirection = 'down';
                  } else {
                      this.stemDirection = 'up';
                  }
                  return this;
              }
          }
          /**
           * Returns a `Vex.Flow.StaveNote` that approximates this note.
           *
           * @memberof music21.note.Note
           * @param {object} [options={}] - `{clef: {@link music21.clef.Clef} }`
           * clef to set the stem direction of.
           * @returns {Vex.Flow.StaveNote}
           */

      }, {
          key: 'vexflowNote',
          value: function vexflowNote(options) {
              var params = {};
              common.merge(params, options);
              var clef = params.clef;

              // fixup stem direction -- must happen before Vex.Flow.Note is created...
              if (this.activeSite !== undefined && this.activeSite.renderOptions.stemDirection !== undefined && note.stemDirectionNames.includes(this.activeSite.renderOptions.stemDirection)) {
                  this.stemDirection = this.activeSite.renderOptions.stemDirection;
              } else if (this.stemDirection === undefined && options.clef !== undefined) {
                  this.setStemDirectionFromClef(options.clef);
              }

              if (this.duration === undefined) {
                  // console.log(this);
                  return undefined;
              }
              var vfd = this.duration.vexflowDuration;
              if (vfd === undefined) {
                  return undefined;
              }
              var vexflowKey = this.pitch.vexflowName(clef);

              var vfnStemDirection = this.stemDirection === 'down' ? Vex.Flow.StaveNote.STEM_DOWN : Vex.Flow.StaveNote.STEM_UP;

              //        const vfnStemDirection = -1;
              var vfn = new Vex.Flow.StaveNote({
                  keys: [vexflowKey],
                  duration: vfd,
                  stem_direction: vfnStemDirection
              });
              this.vexflowAccidentalsAndDisplay(vfn, params); // clean up stuff...
              if (this.pitch.accidental !== undefined) {
                  if (this.pitch.accidental.vexflowModifier !== 'n' && this.pitch.accidental.displayStatus !== false) {
                      vfn.addAccidental(0, new Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));
                  } else if (this.pitch.accidental.displayType === 'always' || this.pitch.accidental.displayStatus === true) {
                      vfn.addAccidental(0, new Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));
                  }
              }

              if (this.articulations[0] !== undefined) {
                  for (var i = 0; i < this.articulations.length; i++) {
                      var art = this.articulations[i];
                      // 0 refers to the first pitch (for chords etc.)...
                      vfn.addArticulation(0, art.vexflow());
                  }
              }
              if (this.expressions[0] !== undefined) {
                  for (var j = 0; j < this.expressions.length; j++) {
                      var exp = this.expressions[j];
                      // 0 refers to the first pitch (for chords etc.)...
                      vfn.addArticulation(0, exp.vexflow());
                  }
              }
              if (this.noteheadColor !== undefined) {
                  vfn.setKeyStyle(0, { fillStyle: this.noteheadColor });
              }
              this.activeVexflowNote = vfn;
              return vfn;
          }
      }, {
          key: 'name',
          get: function get() {
              return this.pitch.name;
          },
          set: function set(nn) {
              this.pitch.name = nn;
          }
      }, {
          key: 'nameWithOctave',
          get: function get() {
              return this.pitch.nameWithOctave;
          },
          set: function set(nn) {
              this.pitch.nameWithOctave = nn;
          }
      }, {
          key: 'step',
          get: function get() {
              return this.pitch.step;
          },
          set: function set(nn) {
              this.pitch.step = nn;
          }
          // no Frequency

      }, {
          key: 'octave',
          get: function get() {
              return this.pitch.octave;
          },
          set: function set(nn) {
              this.pitch.octave = nn;
          }
      }]);
      return Note;
  }(NotRest);
  note.Note = Note;

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
  var Rest = function (_GeneralNote2) {
      inherits(Rest, _GeneralNote2);

      function Rest(ql) {
          classCallCheck(this, Rest);

          var _this5 = possibleConstructorReturn(this, (Rest.__proto__ || Object.getPrototypeOf(Rest)).call(this, ql));

          _this5.classes.push('Rest');
          _this5.isNote = false; // for speed
          _this5.isRest = true; // for speed
          _this5.name = 'rest'; // for note compatibility
          _this5.lineShift = undefined;
          return _this5;
      }
      /**
       * Returns a `Vex.Flow.StaveNote` that approximates this rest.
       * Corrects for bug in VexFlow that renders a whole rest too low.
       *
       * @memberof music21.note.Rest
       * @returns {Vex.Flow.StaveNote}
       */


      createClass(Rest, [{
          key: 'vexflowNote',
          value: function vexflowNote(options) {
              var keyLine = 'b/4';
              if (this.duration.type === 'whole') {
                  if (this.activeSite !== undefined && this.activeSite.renderOptions.staffLines !== 1) {
                      keyLine = 'd/5';
                  }
              }
              if (this.lineShift !== undefined) {
                  var p = new pitch.Pitch('B4');
                  var ls = this.lineShift;
                  if (this.duration.type === 'whole') {
                      ls += 2;
                  }
                  p.diatonicNoteNum += ls;
                  keyLine = p.vexflowName(undefined);
              }

              var vfn = new Vex.Flow.StaveNote({ keys: [keyLine],
                  duration: this.duration.vexflowDuration + 'r' });
              if (this.duration.dots > 0) {
                  for (var i = 0; i < this.duration.dots; i++) {
                      vfn.addDotToAll();
                  }
              }
              this.activeVexflowNote = vfn;
              return vfn;
          }
      }]);
      return Rest;
  }(GeneralNote);
  note.Rest = Rest;

  /* ------ SpacerRest ------ */

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/chord -- Chord
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  var Chord = function (_note$NotRest) {
      inherits(Chord, _note$NotRest);

      function Chord(notes) {
          classCallCheck(this, Chord);

          var _this = possibleConstructorReturn(this, (Chord.__proto__ || Object.getPrototypeOf(Chord)).call(this));

          if (typeof notes === 'undefined') {
              notes = [];
          }
          _this.classes.push('Chord');
          _this.isChord = true; // for speed
          _this.isNote = false; // for speed
          _this.isRest = false; // for speed

          _this._notes = [];
          notes.forEach(_this.add, _this);
          return _this;
      }

      createClass(Chord, [{
          key: 'setStemDirectionFromClef',
          value: function setStemDirectionFromClef(clef) {
              if (clef === undefined) {
                  return this;
              } else {
                  var midLine = clef.lowestLine + 4;
                  // console.log(midLine, 'midLine');
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
          }
          /**
           * Adds a note to the chord, sorting the note array
           *
           * TODO: rename to append like music21p, allow for an Array of notes,
           *       and make a runSort=True variable.
           *
           * @memberof music21.chord.Chord
           * @param {string|music21.note.Note|music21.pitch.Pitch} noteObj - the Note or Pitch to be added or a string defining a pitch.
           * @returns {music21.chord.Chord} the original chord.
           */

      }, {
          key: 'add',
          value: function add(noteObj, runSort) {
              if (runSort === undefined) {
                  runSort = true;
              }
              // takes in either a note or a pitch
              if (typeof noteObj === 'string') {
                  noteObj = new note.Note(noteObj);
              } else if (noteObj.isClassOrSubclass('Pitch')) {
                  var pitchObj = noteObj;
                  var noteObj2 = new note.Note();
                  noteObj2.pitch = pitchObj;
                  noteObj = noteObj2;
              }
              this._notes.push(noteObj);
              // inefficient because sorts after each add, but safe and #(p) is small
              if (runSort === true) {
                  this._notes.sort(function (a, b) {
                      return a.pitch.ps - b.pitch.ps;
                  });
              }
              return this;
          }
          /**
           * Removes any pitches that appear more than once (in any octave), removing the higher ones, and returns a new Chord.
           *
           * @memberof music21.chord.Chord
           * @returns {music21.chord.Chord} A new Chord object with duplicate pitches removed.
           */

      }, {
          key: 'removeDuplicatePitches',
          value: function removeDuplicatePitches() {
              var stepsFound = [];
              var nonDuplicatingPitches = [];
              var pitches = this.pitches;
              for (var i = 0; i < pitches.length; i++) {
                  var p = pitches[i];
                  if (stepsFound.indexOf(p.step) === -1) {
                      stepsFound.push(p.step);
                      nonDuplicatingPitches.push(p);
                  }
              }
              var closedChord = new chord.Chord(nonDuplicatingPitches);
              return closedChord;
          }
          /**
           * Finds the Root of the chord.
           *
           * @memberof music21.chord.Chord
           * @returns {music21.pitch.Pitch} the root of the chord.
           */

      }, {
          key: 'root',
          value: function root() {
              var closedChord = this.removeDuplicatePitches();
              /* var chordBass = closedChord.bass(); */
              var closedPitches = closedChord.pitches;
              if (closedPitches.length === 0) {
                  throw new Music21Exception('No notes in Chord!');
              } else if (closedPitches.length === 1) {
                  return this.pitches[0];
              }
              var indexOfPitchesWithPerfectlyStackedThirds = [];
              var testSteps = [3, 5, 7, 2, 4, 6];
              for (var i = 0; i < closedPitches.length; i++) {
                  var p = closedPitches[i];
                  var currentListOfThirds = [];
                  for (var tsIndex = 0; tsIndex < testSteps.length; tsIndex++) {
                      var chordStepPitch = closedChord.getChordStep(testSteps[tsIndex], p);
                      if (chordStepPitch !== undefined) {
                          // console.log(p.name + " " + testSteps[tsIndex].toString() + " " + chordStepPitch.name);
                          currentListOfThirds.push(true);
                      } else {
                          currentListOfThirds.push(false);
                      }
                  }
                  // console.log(currentListOfThirds);
                  var hasFalse = false;
                  for (var j = 0; j < closedPitches.length - 1; j++) {
                      if (currentListOfThirds[j] === false) {
                          hasFalse = true;
                      }
                  }
                  if (hasFalse === false) {
                      indexOfPitchesWithPerfectlyStackedThirds.push(i);
                      return closedChord.pitches[i]; // should do more, but fine...
                      // should test rootedness function, etc. 13ths. etc.
                  }
              }
              return closedChord.pitches[0]; // fallback, just return the bass...
          }
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

      }, {
          key: 'semitonesFromChordStep',
          value: function semitonesFromChordStep(chordStep, testRoot) {
              if (testRoot === undefined) {
                  testRoot = this.root();
              }
              var tempChordStep = this.getChordStep(chordStep, testRoot);
              if (tempChordStep === undefined) {
                  return undefined;
              } else {
                  var semitones = (tempChordStep.ps - testRoot.ps) % 12;
                  if (semitones < 0) {
                      semitones += 12;
                  }
                  return semitones;
              }
          }
          /**
           * Gets the lowest note (based on .ps not name) in the chord.
           *
           * @memberof music21.chord.Chord
           * @returns {music21.pitch.Pitch} bass pitch
           */

      }, {
          key: 'bass',
          value: function bass() {
              var lowest = void 0;
              var pitches = this.pitches;
              for (var i = 0; i < pitches.length; i++) {
                  var p = pitches[i];
                  if (lowest === undefined) {
                      lowest = p;
                  } else if (p.ps < lowest.ps) {
                      lowest = p;
                  }
              }
              return lowest;
          }
          /**
           * Counts the number of non-duplicate pitch MIDI Numbers in the chord.
           *
           * Call after "closedPosition()" to get Forte style cardinality disregarding octave.
           *
           * @memberof music21.chord.Chord
           * @returns {number}
           */

      }, {
          key: 'cardinality',
          value: function cardinality() {
              var uniqueChord = this.removeDuplicatePitches();
              return uniqueChord.pitches.length;
          }
          /**
          *
          * @memberof music21.chord.Chord
          * @returns {Boolean}
          */

      }, {
          key: 'isMajorTriad',
          value: function isMajorTriad() {
              if (this.cardinality() !== 3) {
                  return false;
              }
              var thirdST = this.semitonesFromChordStep(3);
              var fifthST = this.semitonesFromChordStep(5);
              if (thirdST === 4 && fifthST === 7) {
                  return true;
              } else {
                  return false;
              }
          }
          /**
          *
          * @memberof music21.chord.Chord
          * @returns {Boolean}
          */

      }, {
          key: 'isMinorTriad',
          value: function isMinorTriad() {
              if (this.cardinality() !== 3) {
                  return false;
              }
              var thirdST = this.semitonesFromChordStep(3);
              var fifthST = this.semitonesFromChordStep(5);
              if (thirdST === 3 && fifthST === 7) {
                  return true;
              } else {
                  return false;
              }
          }
          /**
           * Returns True if the chord is a major or minor triad
           *
           * @memberof music21.chord.Chord
           * @returns {Boolean}
           */

      }, {
          key: 'canBeTonic',
          value: function canBeTonic() {
              if (this.isMajorTriad() || this.isMinorTriad()) {
                  return true;
              } else {
                  return false;
              }
          }

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

      }, {
          key: 'inversion',
          value: function inversion() {
              var bass = this.bass();
              var root = this.root();
              var chordStepsToInversions = [1, 6, 4, 2, 7, 5, 3];
              for (var i = 0; i < chordStepsToInversions.length; i++) {
                  var testNote = this.getChordStep(chordStepsToInversions[i], bass);
                  if (testNote !== undefined && testNote.name === root.name) {
                      return i;
                  }
              }
              return undefined;
          }
          /**
           * @memberof music21.chord.Chord
           * @param {object} options - a dictionary of options `{clef: {@music21.clef.Clef} }` is especially important
           * @returns {Vex.Flow.StaveNote}
           */

      }, {
          key: 'vexflowNote',
          value: function vexflowNote(options) {
              var clef = options.clef;

              var pitchKeys = [];
              for (var i = 0; i < this._notes.length; i++) {
                  pitchKeys.push(this._notes[i].pitch.vexflowName(clef));
              }
              var vfn = new Vex.Flow.StaveNote({
                  keys: pitchKeys,
                  duration: this.duration.vexflowDuration });
              this.vexflowAccidentalsAndDisplay(vfn, options); // clean up stuff...
              for (var _i = 0; _i < this._notes.length; _i++) {
                  var tn = this._notes[_i];
                  if (tn.pitch.accidental !== undefined) {
                      if (tn.pitch.accidental.vexflowModifier !== 'n' && tn.pitch.accidental.displayStatus !== false) {
                          vfn.addAccidental(_i, new Vex.Flow.Accidental(tn.pitch.accidental.vexflowModifier));
                      } else if (tn.pitch.accidental.displayType === 'always' || tn.pitch.accidental.displayStatus === true) {
                          vfn.addAccidental(_i, new Vex.Flow.Accidental(tn.pitch.accidental.vexflowModifier));
                      }
                  }
              }
              this.activeVexflowNote = vfn;
              return vfn;
          }
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

      }, {
          key: 'getChordStep',
          value: function getChordStep(chordStep, testRoot) {
              if (testRoot === undefined) {
                  testRoot = this.root();
              }
              if (chordStep >= 8) {
                  chordStep %= 7;
              }
              var thisPitches = this.pitches;
              var testRootDNN = testRoot.diatonicNoteNum;
              for (var i = 0; i < thisPitches.length; i++) {
                  var thisPitch = thisPitches[i];
                  var thisInterval = (thisPitch.diatonicNoteNum - testRootDNN + 1) % 7; // fast cludge
                  if (thisInterval <= 0) {
                      thisInterval += 7;
                  }
                  if (thisInterval === chordStep) {
                      return thisPitch;
                  }
              }
              return undefined;
          }
      }, {
          key: 'length',
          get: function get() {
              return this._notes.length;
          }
      }, {
          key: 'pitches',
          get: function get() {
              var tempPitches = [];
              for (var i = 0; i < this._notes.length; i++) {
                  tempPitches.push(this._notes[i].pitch);
              }
              return tempPitches;
          },
          set: function set(tempPitches) {
              this._notes = [];
              for (var i = 0; i < tempPitches.length; i++) {
                  var addNote = void 0;
                  if (typeof tempPitches[i] === 'string') {
                      addNote = new note.Note(tempPitches[i]);
                  } else if (tempPitches[i].isClassOrSubclass('Pitch')) {
                      addNote = new note.Note();
                      addNote.pitch = tempPitches[i];
                  } else if (tempPitches[i].isClassOrSubclass('Note')) {
                      addNote = tempPitches[i];
                  } else {
                      console.warn('bad pitch', tempPitches[i]);
                      throw new Music21Exception('Cannot add pitch from ' + tempPitches[i]);
                  }
                  this._notes.push(addNote);
              }
          }
      }]);
      return Chord;
  }(note.NotRest);
  chord.Chord = Chord;

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
  var Clef = function (_base$Music21Object) {
      inherits(Clef, _base$Music21Object);

      function Clef(name, octaveChange) {
          classCallCheck(this, Clef);

          var _this = possibleConstructorReturn(this, (Clef.__proto__ || Object.getPrototypeOf(Clef)).call(this));

          _this.classes.push('Clef');
          if (name !== undefined) {
              name = name.toLowerCase();
              _this.name = name;
              _this.lowestLine = clef.lowestLines[name];
              _this.lowestLineTrebleOffset = clef.lowestLines.treble - _this.lowestLine;
          } else {
              _this.name = undefined;
              _this.lowestLine = clef.lowestLines.treble;
              _this.lowestLineTrebleOffset = 0;
          }
          if (octaveChange === undefined) {
              _this.octaveChange = 0;
          } else {
              _this.octaveChange = octaveChange;
              _this.lowestLine += 7 * octaveChange;
              _this.lowestLineTrebleOffset -= 7 * octaveChange;
          }
          return _this;
      }
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


      createClass(Clef, [{
          key: 'convertPitchToTreble',
          value: function convertPitchToTreble(p) {
              if (this.lowestLine === undefined) {
                  console.log('no first line defined for clef', this.name, this);
                  return p; // error
              }
              var lowestLineDifference = this.lowestLineTrebleOffset;
              var tempPitch = new pitch.Pitch(p.step);
              tempPitch.octave = p.octave;
              tempPitch.diatonicNoteNum += lowestLineDifference;
              tempPitch.accidental = p.accidental;
              return tempPitch;
          }
      }]);
      return Clef;
  }(base.Music21Object);

  clef.Clef = Clef;

  /**
   * A TrebleClef (same as new music21.clef.Clef('treble')
   *
   * @class TrebleClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  var TrebleClef = function (_Clef) {
      inherits(TrebleClef, _Clef);

      function TrebleClef() {
          classCallCheck(this, TrebleClef);

          var _this2 = possibleConstructorReturn(this, (TrebleClef.__proto__ || Object.getPrototypeOf(TrebleClef)).call(this, 'treble'));

          _this2.classes.push('TrebleClef');
          return _this2;
      }

      return TrebleClef;
  }(Clef);
  clef.TrebleClef = TrebleClef;
  /**
   * A TrebleClef down an octave (same as new music21.clef.Clef('treble', -1)
   *
   * Unlike music21p, currently not a subclass of TrebleClef.
   *
   * @class Treble8vbClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  var Treble8vbClef = function (_Clef2) {
      inherits(Treble8vbClef, _Clef2);

      function Treble8vbClef() {
          classCallCheck(this, Treble8vbClef);

          var _this3 = possibleConstructorReturn(this, (Treble8vbClef.__proto__ || Object.getPrototypeOf(Treble8vbClef)).call(this, 'treble', -1));

          _this3.classes.push('Treble8vbClef');
          return _this3;
      }

      return Treble8vbClef;
  }(Clef);
  clef.Treble8vbClef = Treble8vbClef;

  /**
   * A TrebleClef up an octave (same as new music21.clef.Clef('treble', 1)
   *
   * @class Treble8vaClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  var Treble8vaClef = function (_Clef3) {
      inherits(Treble8vaClef, _Clef3);

      function Treble8vaClef() {
          classCallCheck(this, Treble8vaClef);

          var _this4 = possibleConstructorReturn(this, (Treble8vaClef.__proto__ || Object.getPrototypeOf(Treble8vaClef)).call(this, 'treble', 1));

          _this4.classes.push('Treble8vaClef');
          return _this4;
      }

      return Treble8vaClef;
  }(Clef);
  clef.Treble8vaClef = Treble8vaClef;

  /**
   * A BassClef (same as new music21.clef.Clef('bass')
   *
   * @class BassClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  var BassClef = function (_Clef4) {
      inherits(BassClef, _Clef4);

      function BassClef() {
          classCallCheck(this, BassClef);

          var _this5 = possibleConstructorReturn(this, (BassClef.__proto__ || Object.getPrototypeOf(BassClef)).call(this, 'bass'));

          _this5.classes.push('BassClef');
          return _this5;
      }

      return BassClef;
  }(Clef);
  clef.BassClef = BassClef;

  /**
   * An AltoClef (same as new music21.clef.Clef('alto')
   *
   * @class AltoClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  var AltoClef = function (_Clef5) {
      inherits(AltoClef, _Clef5);

      function AltoClef() {
          classCallCheck(this, AltoClef);

          var _this6 = possibleConstructorReturn(this, (AltoClef.__proto__ || Object.getPrototypeOf(AltoClef)).call(this, 'alto'));

          _this6.classes.push('AltoClef');
          return _this6;
      }

      return AltoClef;
  }(Clef);
  clef.AltoClef = AltoClef;

  /**
   * A Tenor Clef (same as new music21.clef.Clef('tenor')
   *
   * @class TenorClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  var TenorClef = function (_Clef6) {
      inherits(TenorClef, _Clef6);

      function TenorClef() {
          classCallCheck(this, TenorClef);

          var _this7 = possibleConstructorReturn(this, (TenorClef.__proto__ || Object.getPrototypeOf(TenorClef)).call(this, 'tenor'));

          _this7.classes.push('TenorClef');
          return _this7;
      }

      return TenorClef;
  }(Clef);
  clef.TenorClef = TenorClef;
  /**
   * A Soprano Clef (same as new music21.clef.Clef('soprano')
   *
   * @class SopranoClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  var SopranoClef = function (_Clef7) {
      inherits(SopranoClef, _Clef7);

      function SopranoClef() {
          classCallCheck(this, SopranoClef);

          var _this8 = possibleConstructorReturn(this, (SopranoClef.__proto__ || Object.getPrototypeOf(SopranoClef)).call(this, 'soprano'));

          _this8.classes.push('SopranoClef');
          return _this8;
      }

      return SopranoClef;
  }(Clef);
  clef.SopranoClef = SopranoClef;

  /**
   * A Mezzo-Soprano Clef (same as new music21.clef.Clef('mezzo-soprano')
   *
   * @class MezzoSopranoClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  var MezzoSopranoClef = function (_Clef8) {
      inherits(MezzoSopranoClef, _Clef8);

      function MezzoSopranoClef() {
          classCallCheck(this, MezzoSopranoClef);

          var _this9 = possibleConstructorReturn(this, (MezzoSopranoClef.__proto__ || Object.getPrototypeOf(MezzoSopranoClef)).call(this, 'mezzo-soprano'));

          _this9.classes.push('MezzoSopranoClef');
          return _this9;
      }

      return MezzoSopranoClef;
  }(Clef);
  clef.MezzoSopranoClef = MezzoSopranoClef;

  /**
   * A Percussion Clef (same as new music21.clef.Clef('percussion')
   *
   * First line is treated as if it's treble clef. Not available as "bestClef"
   *
   * @class PercussionClef
   * @memberof music21.clef
   * @extends music21.clef.Clef
   */
  var PercussionClef = function (_Clef9) {
      inherits(PercussionClef, _Clef9);

      function PercussionClef() {
          classCallCheck(this, PercussionClef);

          var _this10 = possibleConstructorReturn(this, (PercussionClef.__proto__ || Object.getPrototypeOf(PercussionClef)).call(this, 'percussion'));

          _this10.classes.push('PercussionClef');
          return _this10;
      }

      return PercussionClef;
  }(Clef);
  clef.PercussionClef = PercussionClef;

  /**
   * Looks at the pitches in a Stream and returns the best clef
   * of Treble and Bass
   *
   * @function music21.clef.bestClef
   * @memberof music21.clef
   * @param {music21.stream.Stream} st
   * @returns {music21.clef.Clef}
   */
  clef.bestClef = function bestClef(st) {
      // console.log('calling flat on stream: ', st.elements.length, st.classes[st.classes.length - 1]);
      var stFlat = st.flat;
      var totalNotes = 0;
      var totalPitch = 0.0;
      for (var i = 0; i < stFlat.length; i++) {
          var el = stFlat.get(i);
          if (el.pitch !== undefined) {
              totalNotes += 1;
              totalPitch += el.pitch.diatonicNoteNum;
          } else if (el.pitches !== undefined) {
              for (var j = 0; j < el.pitches.length; j++) {
                  totalNotes += 1;
                  totalPitch += el.pitches[j].diatonicNoteNum;
              }
          }
      }
      var averageHeight = void 0;
      if (totalNotes === 0) {
          averageHeight = 29;
      } else {
          averageHeight = totalPitch / totalNotes;
      }
      // console.log('bestClef: average height', averageHeight);
      if (averageHeight > 28) {
          // 29 = c4
          return new clef.TrebleClef();
      } else {
          return new clef.BassClef();
      }
  };

  clef.clefFromString = function clefFromString(clefString, octaveShift) {
      if (octaveShift === undefined) {
          octaveShift = 0;
      }
      var xnStr = clefString.trim();
      var thisType = void 0;
      var lineNum = void 0;
      if (xnStr.toLowerCase() === 'percussion') {
          return new clef.PercussionClef(clefString, octaveShift);
      } // todo: tab, none, jianpu

      if (xnStr.length === 2) {
          thisType = xnStr[0].toUpperCase();
          lineNum = xnStr[1];
      } else if (xnStr.length === 1) {
          thisType = xnStr[0].toUpperCase();
          if (thisType === 'G') {
              lineNum = 2;
          } else if (thisType === 'F') {
              lineNum = 4;
          } else if (thisType === 'C') {
              lineNum = 3;
          } else {
              lineNum = 0;
          }
      }

      var arrayEqual = function arrayEqual(a, b) {
          return a.length === b.length && a.every(function (el, ix) {
              return el === b[ix];
          });
      };

      var params = [thisType, lineNum, octaveShift];
      if (arrayEqual(params, ['G', 2, 0])) {
          return new clef.TrebleClef();
      } else if (arrayEqual(params, ['G', 2, -1])) {
          return new clef.Treble8vbClef();
      } else if (arrayEqual(params, ['G', 2, 1])) {
          return new clef.Treble8vaClef();
      } else if (arrayEqual(params, ['F', 4, 0])) {
          return new clef.BassClef();
      } else if (arrayEqual(params, ['F', 4, -1])) {
          return new clef.Bass8vbClef();
      } else if (arrayEqual(params, ['C', 3, 0])) {
          return new clef.AltoClef();
      } else if (arrayEqual(params, ['C', 4, 0])) {
          return new clef.TenorClef();
      } else {
          return new clef.Clef(xnStr, octaveShift);
      }
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
  dynamics.longNames = {
      'ppp': ['pianississimo'],
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
  dynamics.englishNames = {
      'ppp': ['extremely soft'],
      'pp': ['very soft'],
      'p': ['soft'],
      'mp': ['moderately soft'],
      'mf': ['moderately loud'],
      'f': ['loud'],
      'ff': ['very loud'],
      'fff': ['extremely loud']
  };
  dynamics.dynamicStrToScalar = {
      'None': [0.5], // default value
      'n': [0.0],
      'pppp': [0.1],
      'ppp': [0.15],
      'pp': [0.25],
      'p': [0.35],
      'mp': [0.45],
      'mf': [0.55],
      'f': [0.7],
      'fp': [0.75],
      'sf': [0.85],
      'ff': [0.85],
      'fff': [0.9],
      'ffff': [0.95]
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
  var Dynamic = function (_base$Music21Object) {
      inherits(Dynamic, _base$Music21Object);

      function Dynamic(value) {
          classCallCheck(this, Dynamic);

          var _this = possibleConstructorReturn(this, (Dynamic.__proto__ || Object.getPrototypeOf(Dynamic)).call(this));

          _this.classes.push('Dynamic');
          _this._value = undefined;
          _this._volumeScalar = undefined;
          _this.longName = undefined;
          _this.englishName = undefined;
          _this.value = value;
          return _this;
      }

      createClass(Dynamic, [{
          key: 'value',
          get: function get() {
              return this._value;
          },
          set: function set(value) {
              if (typeof value !== 'string') {
                  // assume number
                  this._volumeScalar = value;
                  if (value <= 0) {
                      this._value = 'n';
                  } else if (value < 0.11) {
                      this._value = 'pppp';
                  } else if (value < 0.16) {
                      this._value = 'ppp';
                  } else if (value < 0.26) {
                      this._value = 'pp';
                  } else if (value < 0.36) {
                      this._value = 'p';
                  } else if (value < 0.5) {
                      this._value = 'mp';
                  } else if (value < 0.65) {
                      this._value = 'mf';
                  } else if (value < 0.8) {
                      this._value = 'f';
                  } else if (value < 0.9) {
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
      }, {
          key: 'volumeScalar',
          get: function get() {
              if (this._volumeScalar !== undefined) {
                  return this._volumeScalar;
              } else if (this._value in dynamics.dynamicStrToScalar) {
                  return dynamics.dynamicStrToScalar[this._value][0];
              } else {
                  return undefined;
              }
          },
          set: function set(value) {
              if (typeof value === 'number' && value <= 1 && value >= 0) {
                  this._volumeScalar = value;
              }
          }
      }]);
      return Dynamic;
  }(base.Music21Object);
  dynamics.Dynamic = Dynamic;

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
  var Expression = function (_base$Music21Object) {
      inherits(Expression, _base$Music21Object);

      function Expression() {
          classCallCheck(this, Expression);

          var _this = possibleConstructorReturn(this, (Expression.__proto__ || Object.getPrototypeOf(Expression)).call(this));

          _this.classes.push('Expression');
          _this.name = 'expression';
          _this.vexflowModifier = '';
          _this.setPosition = undefined;
          return _this;
      }
      /**
       * Renders this Expression as a Vex.Flow.Articulation
       *
       * (this is not right for all cases)
       *
       * @memberof music21.expressions.Expression
       * @returns {Vex.Flow.Articulation}
       */


      createClass(Expression, [{
          key: 'vexflow',
          value: function vexflow() {
              var vfe = new Vex.Flow.Articulation(this.vexflowModifier);
              if (this.setPosition) {
                  vfe.setPosition(this.setPosition);
              }
              return vfe;
          }
      }]);
      return Expression;
  }(base.Music21Object);
  expressions.Expression = Expression;

  /**
   * A fermata...
   *
   * @class Fermata
   * @memberof music21.expressions
   * @extends music21.expressions.Expression
   */
  var Fermata = function (_Expression) {
      inherits(Fermata, _Expression);

      function Fermata() {
          classCallCheck(this, Fermata);

          var _this2 = possibleConstructorReturn(this, (Fermata.__proto__ || Object.getPrototypeOf(Fermata)).call(this));

          _this2.classes.push('Fermata');
          _this2.name = 'fermata';
          _this2.vexflowModifier = 'a@a';
          _this2.setPosition = 3;
          return _this2;
      }

      return Fermata;
  }(Expression);
  expressions.Fermata = Fermata;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/fromPython -- Conversion from music21p jsonpickle streams
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  var jp = jsonpickle;
  /**
   * fromPython module -- see {@link music21.fromPython}
   */
  var unpickler = jp.unpickler;

  /**
   * Converter for taking a Python-encoded jsonpickle music21p stream
   * and loading it into music21j
   *
   * Very very alpha.  See music21(p).vexflow modules to see how it works.
   *
   * Requires Cuthbert's jsonpickle.js port (included in music21j)
   *
   * @namespace music21.fromPython
   * @extends music21
   * @requires jsonpickle
   */
  var fromPython = {};

  /**
   *
   * @class Converter
   * @memberof music21.fromPython
   * @property {boolean} debug
   * @property {Array<string>} knownUnparsables - list of classes that cannot be parsed
   * @property {object} handlers - object mapping string names of classes to a set of function calls to perform when restoring or post-restoring. (too complicated to explain; read the code)
   */
  var Converter = function () {
      function Converter() {
          var _this = this;

          classCallCheck(this, Converter);

          this.debug = true;
          this.knownUnparsables = ['music21.spanner.Line', 'music21.instrument.Instrument', 'music21.layout.StaffGroup', 'music21.layout.StaffLayout', 'music21.layout.SystemLayout', 'music21.layout.PageLayout', 'music21.expressions.TextExpression', 'music21.bar.Barline', // Soon...
          'music21.tempo.MetronomeMark', // should be possible
          'music21.metadata.Metadata'];
          this.handlers = {
              'music21.duration.Duration': {
                  post_restore: function post_restore(d) {
                      d.quarterLength = d._qtrLength;
                      return d;
                  }
              },
              'music21.meter.TimeSignature': {
                  post_restore: function post_restore(ts) {
                      ts._numerator = ts.displaySequence._numerator;
                      ts._denominator = ts.displaySequence._denominator;
                      return ts;
                  }
              },
              'music21.stream.Part': {
                  post_restore: function post_restore(p) {
                      _this.currentPart = p;
                      _this.lastClef = undefined;
                      _this.lastKeySignature = undefined;
                      _this.lastTimeSignature = undefined;
                      _this.streamPostRestore(p);
                      return p;
                  }
              },
              // TODO: all inherit somehow, through _classes or better, prototype...
              'music21.stream.Score': {
                  post_restore: this.streamPostRestore.bind(this)
              },
              'music21.stream.Stream': {
                  post_restore: this.streamPostRestore.bind(this)
              },
              'music21.stream.Measure': {
                  post_restore: this.streamPostRestore.bind(this)
              },
              'music21.stream.Voice': {
                  post_restore: this.streamPostRestore.bind(this)
              }
          };
          this.currentPart = undefined;
          this.lastClef = undefined;
          this.lastKeySignature = undefined;
          this.lastTimeSignature = undefined;
      }

      /**
       * Fixes up some references that cannot be unpacked from jsonpickle.
       *
       * @method music21.fromPython.Converter#streamPostRestore
       * @memberof music21.fromPython.Converter
       * @param {music21.stream.Stream} s - stream after unpacking from jsonpickle
       * @returns {music21.stream.Stream}
       */


      createClass(Converter, [{
          key: 'streamPostRestore',
          value: function streamPostRestore(s) {
              var st = s._storedElementOffsetTuples;

              s._clef = this.lastClef;
              s._keySignature = this.lastKeySignature;
              s._timeSignature = this.lastTimeSignature;
              for (var i = 0; i < st.length; i++) {
                  var el = st[i][0];
                  el.offset = st[i][1];
                  var classList = el.classes;
                  if (classList === undefined) {
                      console.warn('M21object without classes: ', el);
                      console.warn('Javascript classes are: ', el._py_class);
                      classList = [];
                  }
                  var streamPart = this.currentPart;
                  if (streamPart === undefined) {
                      streamPart = s; // possibly a Stream constructed from .measures()
                  }

                  var appendEl = true;
                  var insertAtStart = false;

                  for (var j = 0; j < classList.length; j++) {
                      var thisClass = classList[j];
                      for (var kn = 0; kn < this.knownUnparsables.length; kn++) {
                          var unparsable = this.knownUnparsables[kn];
                          if (unparsable.indexOf(thisClass) !== -1) {
                              appendEl = false;
                          }
                      }
                      if (thisClass === 'TimeSignature') {
                          // console.log("Got timeSignature", streamPart, newM21pObj, storedElement);
                          s._timeSignature = el;
                          this.lastTimeSignature = el;
                          if (streamPart !== undefined && streamPart.timeSignature === undefined) {
                              streamPart.timeSignature = el;
                          }
                          appendEl = false;
                      } else if (thisClass === 'Clef') {
                          s._clef = el;
                          this.lastClef = el;
                          if (streamPart !== undefined && streamPart.clef === undefined) {
                              streamPart.clef = el;
                          }
                          appendEl = false;
                      } else if (thisClass === 'KeySignature') {
                          s._keySignature = el;
                          this.lastKeySignature = el;
                          if (streamPart !== undefined && streamPart.keySignature === undefined) {
                              streamPart.keySignature = el;
                          }
                          appendEl = false;
                      } else if (thisClass === 'Part') {
                          appendEl = false;
                          insertAtStart = true;
                      }
                  }

                  if (appendEl) {
                      s.append(el); // all but clef, ts, ks
                  } else if (insertAtStart) {
                      s.insert(0, el); // Part
                  }
              }
              return s;
          }

          /**
           * Run the main decoder
           *
           * @method music21.fromPython.Converter#run
           * @memberof music21.fromPython.Converter
           * @param {string} jss - stream encoded as JSON
           * @returns {music21.stream.Stream}
           */

      }, {
          key: 'run',
          value: function run(jss) {
              var outStruct = unpickler.decode(jss, this.handlers);
              return outStruct.stream;
          }
      }]);
      return Converter;
  }();
  fromPython.Converter = Converter;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/instrument -- instrument objects
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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

  var Instrument = function (_base$Music21Object) {
      inherits(Instrument, _base$Music21Object);

      function Instrument(instrumentName) {
          classCallCheck(this, Instrument);

          var _this = possibleConstructorReturn(this, (Instrument.__proto__ || Object.getPrototypeOf(Instrument)).call(this));

          _this.classSortOrder = -25;

          _this.partId = undefined;
          _this.partName = undefined;
          _this.partAbbreviation = undefined;

          _this.instrumentId = undefined;
          _this.instrumentName = undefined;
          _this.instrumentAbbreviation = undefined;
          _this.midiProgram = undefined;
          _this._midiChannel = undefined;

          _this.lowestNote = undefined;
          _this.highestNote = undefined;

          _this.transpostion = undefined;

          _this.inGMPercMap = false;
          _this.soundfontFn = undefined;

          if (instrumentName !== undefined) {
              instrument.find(instrumentName);
          }
          return _this;
      }
      /**
       * Assign an instrument to an unused midi channel.
       *
       * Will use the global list of used channels (`music21.instrument.Instrument.usedChannels`)
       * if not given.  Assigns up to `music21.instrument.maxMidi` channels (16)
       * Skips 10 unless this.inGMPercMap is true
       *
       * @memberof music21.instrument.Instrument
       * @param {Array<Int>} [usedChannels]
       * @returns {Number}
       */


      createClass(Instrument, [{
          key: 'autoAssignMidiChannel',
          value: function autoAssignMidiChannel(usedChannels) {
              if (usedChannels === undefined) {
                  usedChannels = instrument.usedChannels;
              }
              var startChannel = 0;
              if (this.inGMPercMap) {
                  startChannel = 10;
              }
              for (var ch = startChannel; ch < instrument.maxMidi; ch++) {
                  if (ch % 16 === 10 && this.inGMPercMap !== true) {
                      continue; // skip 10 / percussion.
                  }
                  if (usedChannels[ch] === undefined || usedChannels[ch] === this.midiProgram) {
                      usedChannels[ch] = this.midiProgram;
                      this.midiChannel = ch;
                      return ch;
                  }
              }
              // TODO: no channels! throw exception!
              return undefined;
          }
      }, {
          key: 'oggSounfont',
          get: function get() {
              return this.soundfontFn + '-ogg.js';
          }
      }, {
          key: 'mp3Soundfont',
          get: function get() {
              return this.soundfontFn + '-mp3.js';
          }
      }, {
          key: 'midiChannel',
          get: function get() {
              if (this._midiChannel === undefined) {
                  this.autoAssignMidiChannel();
              }
              return this._midiChannel;
          },
          set: function set(ch) {
              this._midiChannel = ch;
          }
      }]);
      return Instrument;
  }(base.Music21Object);

  instrument.Instrument = Instrument;

  instrument.usedChannels = []; // differs from m21p -- stored midiProgram numbers
  instrument.maxMidi = 16;

  instrument.info = [{ 'fn': 'acoustic_grand_piano', 'name': 'Acoustic Grand Piano', 'midiNumber': 0 }, { 'fn': 'bright_acoustic_piano', 'name': 'Bright Acoustic Piano', 'midiNumber': 1 }, { 'fn': 'electric_grand_piano', 'name': 'Electric Grand Piano', 'midiNumber': 2 }, { 'fn': 'honkytonk_piano', 'name': 'Honky-tonk Piano', 'midiNumber': 3 }, { 'fn': 'electric_piano_1', 'name': 'Electric Piano 1', 'midiNumber': 4 }, { 'fn': 'electric_piano_2', 'name': 'Electric Piano 2', 'midiNumber': 5 }, { 'fn': 'harpsichord', 'name': 'Harpsichord', 'midiNumber': 6 }, { 'fn': 'clavinet', 'name': 'Clavinet', 'midiNumber': 7 }, { 'fn': 'celesta', 'name': 'Celesta', 'midiNumber': 8 }, { 'fn': 'glockenspiel', 'name': 'Glockenspiel', 'midiNumber': 9 }, { 'fn': 'music_box', 'name': 'Music Box', 'midiNumber': 10 }, { 'fn': 'vibraphone', 'name': 'Vibraphone', 'midiNumber': 11 }, { 'fn': 'marimba', 'name': 'Marimba', 'midiNumber': 12 }, { 'fn': 'xylophone', 'name': 'Xylophone', 'midiNumber': 13 }, { 'fn': 'tubular_bells', 'name': 'Tubular Bells', 'midiNumber': 14 }, { 'fn': 'dulcimer', 'name': 'Dulcimer', 'midiNumber': 15 }, { 'fn': 'drawbar_organ', 'name': 'Drawbar Organ', 'midiNumber': 16 }, { 'fn': 'percussive_organ', 'name': 'Percussive Organ', 'midiNumber': 17 }, { 'fn': 'rock_organ', 'name': 'Rock Organ', 'midiNumber': 18 }, { 'fn': 'church_organ', 'name': 'Church Organ', 'midiNumber': 19 }, { 'fn': 'reed_organ', 'name': 'Reed Organ', 'midiNumber': 20 }, { 'fn': 'accordion', 'name': 'Accordion', 'midiNumber': 21 }, { 'fn': 'harmonica', 'name': 'Harmonica', 'midiNumber': 22 }, { 'fn': 'tango_accordion', 'name': 'Tango Accordion', 'midiNumber': 23 }, { 'fn': 'acoustic_guitar_nylon', 'name': 'Acoustic Guitar (nylon)', 'midiNumber': 24 }, { 'fn': 'acoustic_guitar_steel', 'name': 'Acoustic Guitar (steel)', 'midiNumber': 25 }, { 'fn': 'electric_guitar_jazz', 'name': 'Electric Guitar (jazz)', 'midiNumber': 26 }, { 'fn': 'electric_guitar_clean', 'name': 'Electric Guitar (clean)', 'midiNumber': 27 }, { 'fn': 'electric_guitar_muted', 'name': 'Electric Guitar (muted)', 'midiNumber': 28 }, { 'fn': 'overdriven_guitar', 'name': 'Overdriven Guitar', 'midiNumber': 29 }, { 'fn': 'distortion_guitar', 'name': 'Distortion Guitar', 'midiNumber': 30 }, { 'fn': 'guitar_harmonics', 'name': 'Guitar Harmonics', 'midiNumber': 31 }, { 'fn': 'acoustic_bass', 'name': 'Acoustic Bass', 'midiNumber': 32 }, { 'fn': 'electric_bass_finger', 'name': 'Electric Bass (finger)', 'midiNumber': 33 }, { 'fn': 'electric_bass_pick', 'name': 'Electric Bass (pick)', 'midiNumber': 34 }, { 'fn': 'fretless_bass', 'name': 'Fretless Bass', 'midiNumber': 35 }, { 'fn': 'slap_bass_1', 'name': 'Slap Bass 1', 'midiNumber': 36 }, { 'fn': 'slap_bass_2', 'name': 'Slap Bass 2', 'midiNumber': 37 }, { 'fn': 'synth_bass_1', 'name': 'Synth Bass 1', 'midiNumber': 38 }, { 'fn': 'synth_bass_2', 'name': 'Synth Bass 2', 'midiNumber': 39 }, { 'fn': 'violin', 'name': 'Violin', 'midiNumber': 40 }, { 'fn': 'viola', 'name': 'Viola', 'midiNumber': 41 }, { 'fn': 'cello', 'name': 'Cello', 'midiNumber': 42 }, { 'fn': 'contrabass', 'name': 'Contrabass', 'midiNumber': 43 }, { 'fn': 'tremolo_strings', 'name': 'Tremolo Strings', 'midiNumber': 44 }, { 'fn': 'pizzicato_strings', 'name': 'Pizzicato Strings', 'midiNumber': 45 }, { 'fn': 'orchestral_harp', 'name': 'Orchestral Harp', 'midiNumber': 46 }, { 'fn': 'timpani', 'name': 'Timpani', 'midiNumber': 47 }, { 'fn': 'string_ensemble_1', 'name': 'String Ensemble 1', 'midiNumber': 48 }, { 'fn': 'string_ensemble_2', 'name': 'String Ensemble 2', 'midiNumber': 49 }, { 'fn': 'synth_strings_1', 'name': 'Synth Strings 1', 'midiNumber': 50 }, { 'fn': 'synth_strings_2', 'name': 'Synth Strings 2', 'midiNumber': 51 }, { 'fn': 'choir_aahs', 'name': 'Choir Aahs', 'midiNumber': 52 }, { 'fn': 'voice_oohs', 'name': 'Voice Oohs', 'midiNumber': 53 }, { 'fn': 'synth_choir', 'name': 'Synth Choir', 'midiNumber': 54 }, { 'fn': 'orchestra_hit', 'name': 'Orchestra Hit', 'midiNumber': 55 }, { 'fn': 'trumpet', 'name': 'Trumpet', 'midiNumber': 56 }, { 'fn': 'trombone', 'name': 'Trombone', 'midiNumber': 57 }, { 'fn': 'tuba', 'name': 'Tuba', 'midiNumber': 58 }, { 'fn': 'muted_trumpet', 'name': 'Muted Trumpet', 'midiNumber': 59 }, { 'fn': 'french_horn', 'name': 'French Horn', 'midiNumber': 60 }, { 'fn': 'brass_section', 'name': 'Brass Section', 'midiNumber': 61 }, { 'fn': 'synth_brass_1', 'name': 'Synth Brass 1', 'midiNumber': 62 }, { 'fn': 'synth_brass_2', 'name': 'Synth Brass 2', 'midiNumber': 63 }, { 'fn': 'soprano_sax', 'name': 'Soprano Sax', 'midiNumber': 64 }, { 'fn': 'alto_sax', 'name': 'Alto Sax', 'midiNumber': 65 }, { 'fn': 'tenor_sax', 'name': 'Tenor Sax', 'midiNumber': 66 }, { 'fn': 'baritone_sax', 'name': 'Baritone Sax', 'midiNumber': 67 }, { 'fn': 'oboe', 'name': 'Oboe', 'midiNumber': 68 }, { 'fn': 'english_horn', 'name': 'English Horn', 'midiNumber': 69 }, { 'fn': 'bassoon', 'name': 'Bassoon', 'midiNumber': 70 }, { 'fn': 'clarinet', 'name': 'Clarinet', 'midiNumber': 71 }, { 'fn': 'piccolo', 'name': 'Piccolo', 'midiNumber': 72 }, { 'fn': 'flute', 'name': 'Flute', 'midiNumber': 73 }, { 'fn': 'recorder', 'name': 'Recorder', 'midiNumber': 74 }, { 'fn': 'pan_flute', 'name': 'Pan Flute', 'midiNumber': 75 }, { 'fn': 'blown_bottle', 'name': 'Blown bottle', 'midiNumber': 76 }, { 'fn': 'shakuhachi', 'name': 'Shakuhachi', 'midiNumber': 77 }, { 'fn': 'whistle', 'name': 'Whistle', 'midiNumber': 78 }, { 'fn': 'ocarina', 'name': 'Ocarina', 'midiNumber': 79 }, { 'fn': 'lead_1_square', 'name': 'Lead 1 (square)', 'midiNumber': 80 }, { 'fn': 'lead_2_sawtooth', 'name': 'Lead 2 (sawtooth)', 'midiNumber': 81 }, { 'fn': 'lead_3_calliope', 'name': 'Lead 3 (calliope)', 'midiNumber': 82 }, { 'fn': 'lead_4_chiff', 'name': 'Lead 4 chiff', 'midiNumber': 83 }, { 'fn': 'lead_5_charang', 'name': 'Lead 5 (charang)', 'midiNumber': 84 }, { 'fn': 'lead_6_voice', 'name': 'Lead 6 (voice)', 'midiNumber': 85 }, { 'fn': 'lead_7_fifths', 'name': 'Lead 7 (fifths)', 'midiNumber': 86 }, { 'fn': 'lead_8_bass__lead', 'name': 'Lead 8 (bass + lead)', 'midiNumber': 87 }, { 'fn': 'pad_1_new_age', 'name': 'Pad 1 (new age)', 'midiNumber': 88 }, { 'fn': 'pad_2_warm', 'name': 'Pad 2 (warm)', 'midiNumber': 89 }, { 'fn': 'pad_3_polysynth', 'name': 'Pad 3 (polysynth)', 'midiNumber': 90 }, { 'fn': 'pad_4_choir', 'name': 'Pad 4 (choir)', 'midiNumber': 91 }, { 'fn': 'pad_5_bowed', 'name': 'Pad 5 (bowed)', 'midiNumber': 92 }, { 'fn': 'pad_6_metallic', 'name': 'Pad 6 (metallic)', 'midiNumber': 93 }, { 'fn': 'pad_7_halo', 'name': 'Pad 7 (halo)', 'midiNumber': 94 }, { 'fn': 'pad_8_sweep', 'name': 'Pad 8 (sweep)', 'midiNumber': 95 }, { 'fn': 'fx_1_rain', 'name': 'FX 1 (rain)', 'midiNumber': 96 }, { 'fn': 'fx_2_soundtrack', 'name': 'FX 2 (soundtrack)', 'midiNumber': 97 }, { 'fn': 'fx_3_crystal', 'name': 'FX 3 (crystal)', 'midiNumber': 98 }, { 'fn': 'fx_4_atmosphere', 'name': 'FX 4 (atmosphere)', 'midiNumber': 99 }, { 'fn': 'fx_5_brightness', 'name': 'FX 5 (brightness)', 'midiNumber': 100 }, { 'fn': 'fx_6_goblins', 'name': 'FX 6 (goblins)', 'midiNumber': 101 }, { 'fn': 'fx_7_echoes', 'name': 'FX 7 (echoes)', 'midiNumber': 102 }, { 'fn': 'fx_8_scifi', 'name': 'FX 8 (sci-fi)', 'midiNumber': 103 }, { 'fn': 'sitar', 'name': 'Sitar', 'midiNumber': 104 }, { 'fn': 'banjo', 'name': 'Banjo', 'midiNumber': 105 }, { 'fn': 'shamisen', 'name': 'Shamisen', 'midiNumber': 106 }, { 'fn': 'koto', 'name': 'Koto', 'midiNumber': 107 }, { 'fn': 'kalimba', 'name': 'Kalimba', 'midiNumber': 108 }, { 'fn': 'bagpipe', 'name': 'Bagpipe', 'midiNumber': 109 }, { 'fn': 'fiddle', 'name': 'Fiddle', 'midiNumber': 110 }, { 'fn': 'shanai', 'name': 'Shanai', 'midiNumber': 111 }, { 'fn': 'tinkle_bell', 'name': 'Tinkle Bell', 'midiNumber': 112 }, { 'fn': 'agogo', 'name': 'Agogo', 'midiNumber': 113 }, { 'fn': 'steel_drums', 'name': 'Steel Drums', 'midiNumber': 114 }, { 'fn': 'woodblock', 'name': 'Woodblock', 'midiNumber': 115 }, { 'fn': 'taiko_drum', 'name': 'Taiko Drum', 'midiNumber': 116 }, { 'fn': 'melodic_tom', 'name': 'Melodic Tom', 'midiNumber': 117 }, { 'fn': 'synth_drum', 'name': 'Synth Drum', 'midiNumber': 118 }, { 'fn': 'reverse_cymbal', 'name': 'Reverse Cymbal', 'midiNumber': 119 }, { 'fn': 'guitar_fret_noise', 'name': 'Guitar Fret Noise', 'midiNumber': 120 }, { 'fn': 'breath_noise', 'name': 'Breath Noise', 'midiNumber': 121 }, { 'fn': 'seashore', 'name': 'Seashore', 'midiNumber': 122 }, { 'fn': 'bird_tweet', 'name': 'Bird Tweet', 'midiNumber': 123 }, { 'fn': 'telephone_ring', 'name': 'Telephone Ring', 'midiNumber': 124 }, { 'fn': 'helicopter', 'name': 'Helicopter', 'midiNumber': 125 }, { 'fn': 'applause', 'name': 'Applause', 'midiNumber': 126 }, { 'fn': 'gunshot', 'name': 'Gunshot', 'midiNumber': 127 }];

  /**
   * Find information for a given instrument (by filename or name)
   * and load it into an instrument object.
   *
   * @function music21.instrument.find
   * @memberof music21.instrument
   * @param {string} fn - name or filename of instrument
   * @param {music21.instrument.Instrument} [inst] - instrument object to load into
   * @returns {music21.instrument.Instrument|undefined}
   */
  instrument.find = function instrument_find(fn, inst) {
      if (inst === undefined) {
          inst = new instrument.Instrument();
      }
      for (var i = 0; i < instrument.info.length; i++) {
          var info = instrument.info[i];
          if (info.fn === fn || info.name === fn) {
              inst.soundfontFn = info.fn;
              inst.instrumentName = info.name;
              inst.midiProgram = info.midiNumber;
              return inst;
          }
      }
      return undefined;
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/interval -- Interval routines
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006-16, Michael Scott Cuthbert and cuthbertLab
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
  var GenericInterval = function (_prebase$ProtoM21Obje) {
      inherits(GenericInterval, _prebase$ProtoM21Obje);

      function GenericInterval(gi) {
          classCallCheck(this, GenericInterval);

          var _this = possibleConstructorReturn(this, (GenericInterval.__proto__ || Object.getPrototypeOf(GenericInterval)).call(this));

          _this.classes.push('GenericInterval');
          if (gi === undefined) {
              gi = 1;
          }
          _this.value = gi; // todo: convertGeneric() from python
          _this.directed = _this.value;
          _this.undirected = Math.abs(_this.value);

          if (_this.directed === 1) {
              _this.direction = interval.IntervalDirections.OBLIQUE;
          } else if (_this.directed < 0) {
              _this.direction = interval.IntervalDirections.DESCENDING;
          } else if (_this.directed > 1) {
              _this.direction = interval.IntervalDirections.ASCENDING;
          }
          // else (raise exception)

          if (_this.undirected > 2) {
              _this.isSkip = true;
          } else {
              _this.isSkip = false;
          }

          if (_this.undirected === 2) {
              _this.isDiatonicStep = true;
          } else {
              _this.isDiatonicStep = false;
          }

          _this.isStep = _this.isDiatonicStep;

          if (_this.undirected === 1) {
              _this.isUnison = true;
          } else {
              _this.isUnison = false;
          }

          var tempSteps = _this.undirected % 7;
          var tempOctaves = parseInt(_this.undirected / 7);
          if (tempSteps === 0) {
              tempOctaves -= 1;
              tempSteps = 7;
          }
          _this.simpleUndirected = tempSteps;
          _this.undirectedOctaves = tempOctaves;
          if (tempSteps === 1 && tempOctaves >= 1) {
              _this.semiSimpleUndirected = 8;
          } else {
              _this.semiSimpleUndirected = _this.simpleUndirected;
          }

          if (_this.direction === interval.IntervalDirections.DESCENDING) {
              _this.octaves = -1 * tempOctaves;
              if (tempSteps !== 1) {
                  _this.simpleDirected = -1 * tempSteps;
              } else {
                  _this.simpleDirected = 1; // no descending unisons...
              }
              _this.semiSimpleDirected = -1 * _this.semiSimpleUndirected;
          } else {
              _this.octaves = tempOctaves;
              _this.simpleDirected = tempSteps;
              _this.semiSimpleDirected = _this.semiSimpleUndirected;
          }
          if (_this.simpleUndirected === 1 || _this.simpleUndirected === 4 || _this.simpleUndirected === 5) {
              _this.perfectable = true;
          } else {
              _this.perfectable = false;
          }

          if (_this.undirected < interval.MusicOrdinals.length) {
              _this.niceName = interval.MusicOrdinals[_this.undirected];
          } else {
              _this.niceName = _this.undirected.toString();
          }

          _this.simpleNiceName = interval.MusicOrdinals[_this.simpleUndirected];
          _this.semiSimpleNiceName = interval.MusicOrdinals[_this.semiSimpleUndirected];

          if (Math.abs(_this.directed) === 1) {
              _this.staffDistance = 0;
          } else if (_this.directed > 1) {
              _this.staffDistance = _this.directed - 1;
          } else if (_this.directed < -1) {
              _this.staffDistance = _this.directed + 1;
          }
          // else: raise IntervalException("Non-integer, -1, or 0 not permitted as a diatonic interval")

          // 2 -> 7; 3 -> 6; 8 -> 1 etc.
          _this.mod7inversion = 9 - _this.semiSimpleUndirected;

          if (_this.direction === interval.IntervalDirections.DESCENDING) {
              _this.mod7 = _this.mod7inversion; // see chord.semitonesFromChordStep for usage...
          } else {
              _this.mod7 = _this.simpleDirected;
          }
          return _this;
      }

      /**
       * Returns a new GenericInterval which is the mod7inversion; 3rds (and 10ths etc.) to 6ths, etc.
       *
       * @memberof music21.interval.GenericInterval
       * @returns {music21.interval.GenericInterval}
       */


      createClass(GenericInterval, [{
          key: 'complement',
          value: function complement() {
              return new interval.GenericInterval(this.mod7inversion);
          }

          /**
           * Returns a new GenericInterval which has the opposite direction (descending becomes ascending, etc.)
           *
           * @memberof music21.interval.GenericInterval
           * @returns {music21.interval.GenericInterval}
           */

      }, {
          key: 'reverse',
          value: function reverse() {
              if (this.undirected === 1) {
                  return new interval.GenericInterval(1);
              } else {
                  return new interval.GenericInterval(this.undirected * (-1 * this.direction));
              }
          }
          /**
           * Given a specifier, return a new DiatonicInterval with this generic.
           *
           * @memberof music21.interval.GenericInterval
           * @param {string|Int} specifier - a specifier such as "P","m","M","A","dd" etc.
           * @returns {music21.interval.DiatonicInterval}
           */

      }, {
          key: 'getDiatonic',
          value: function getDiatonic(specifier) {
              return new interval.DiatonicInterval(specifier, this);
          }

          /**
           * Transpose a pitch by this generic interval, maintaining accidentals
           *
           * @memberof music21.interval.GenericInterval
           * @param {music21.pitch.Pitch} p
           * @returns {music21.pitch.Pitch}
           */

      }, {
          key: 'transposePitch',
          value: function transposePitch(p) {
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
                  pitch2.accidental = new pitch.Accidental(p.accidental.name);
              }
              return pitch2;
          }
      }]);
      return GenericInterval;
  }(prebase.ProtoM21Object);
  interval.GenericInterval = GenericInterval;

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

  interval.IntervalNiceSpecNames = ['ERROR', 'Perfect', 'Major', 'Minor', 'Augmented', 'Diminished', 'Doubly-Augmented', 'Doubly-Diminished', 'Triply-Augmented', 'Triply-Diminished', 'Quadruply-Augmented', 'Quadruply-Diminished'];
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
      'P': 0, 'A': 1, 'AA': 2, 'AAA': 3, 'AAAA': 4,
      'd': -1, 'dd': -2, 'ddd': -3, 'dddd': -4
  }; // offset from Perfect

  interval.IntervalAdjustImperf = {
      'M': 0, 'm': -1, 'A': 1, 'AA': 2, 'AAA': 3, 'AAAA': 4,
      'd': -2, 'dd': -3, 'ddd': -4, 'dddd': -5
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
  var DiatonicInterval = function (_prebase$ProtoM21Obje2) {
      inherits(DiatonicInterval, _prebase$ProtoM21Obje2);

      function DiatonicInterval(specifier, generic) {
          classCallCheck(this, DiatonicInterval);

          var _this2 = possibleConstructorReturn(this, (DiatonicInterval.__proto__ || Object.getPrototypeOf(DiatonicInterval)).call(this));

          _this2.classes.push('DiatonicInterval');

          if (specifier === undefined) {
              specifier = 'P';
          }
          if (generic === undefined) {
              generic = new interval.GenericInterval(1);
          } else if (typeof generic === 'number') {
              generic = new interval.GenericInterval(generic);
          }

          _this2.name = '';
          if (typeof specifier === 'number') {
              _this2.specifier = specifier;
          } else {
              _this2.specifier = interval.IntervalPrefixSpecs.indexOf(specifier); // todo: convertSpecifier();
          }
          _this2.generic = generic;

          if (generic.undirected !== 1 || specifier === interval.IntervalSpecifiersEnum.PERFECT) {
              _this2.direction = generic.direction;
          } else if (interval.IntervalPerfSpecifiers.indexOf(specifier) <= interval.IntervalPerfSpecifiers.indexOf(interval.IntervalSpecifiersEnum.DIMINISHED)) {
              // diminished unisons -- very controversial
              _this2.direction = interval.IntervalDirections.DESCENDING;
          } else {
              _this2.direction = interval.IntervalDirections.ASCENDING;
          }
          var diatonicDirectionNiceName = interval.IntervalDirectionTerms[_this2.direction + 1];
          _this2.name = interval.IntervalPrefixSpecs[_this2.specifier] + generic.undirected.toString();
          _this2.niceName = interval.IntervalNiceSpecNames[_this2.specifier] + ' ' + generic.niceName;
          _this2.simpleName = interval.IntervalPrefixSpecs[_this2.specifier] + generic.simpleUndirected.toString();
          _this2.simpleNiceName = interval.IntervalNiceSpecNames[_this2.specifier] + ' ' + generic.simpleNiceName;
          _this2.semiSimpleName = interval.IntervalPrefixSpecs[_this2.specifier] + generic.semiSimpleUndirected.toString();
          _this2.semiSimpleNiceName = interval.IntervalNiceSpecNames[_this2.specifier] + ' ' + generic.semiSimpleNiceName;
          _this2.directedName = interval.IntervalPrefixSpecs[_this2.specifier] + generic.directed.toString();
          _this2.directedNiceName = diatonicDirectionNiceName + ' ' + _this2.niceName;
          _this2.directedSimpleName = interval.IntervalPrefixSpecs[_this2.specifier] + generic.simpleDirected.toString();
          _this2.directedSimpleNiceName = diatonicDirectionNiceName + ' ' + _this2.simpleNiceName;
          _this2.directedSemiSimpleName = interval.IntervalPrefixSpecs[_this2.specifier] + generic.semiSimpleDirected.toString();
          _this2.directedSemiSimpleNiceName = diatonicDirectionNiceName + ' ' + _this2.semiSimpleNameName;
          _this2.specificName = interval.IntervalNiceSpecNames[_this2.specifier];
          _this2.perfectable = generic.perfectable;
          _this2.isDiatonicStep = generic.isDiatonicStep;
          _this2.isStep = generic.isStep;

          // generate inversions
          if (_this2.perfectable) {
              _this2.orderedSpecifierIndex = interval.IntervalOrderedPerfSpecs.indexOf(interval.IntervalPrefixSpecs[_this2.specifier]);
              _this2.invertedOrderedSpecIndex = interval.IntervalOrderedPerfSpecs.length - 1 - _this2.orderedSpecifierIndex;
              _this2.invertedOrderedSpecifier = interval.IntervalOrderedPerfSpecs[_this2.invertedOrderedSpecIndex];
          } else {
              _this2.orderedSpecifierIndex = interval.IntervalOrderedImperfSpecs.indexOf(interval.IntervalPrefixSpecs[_this2.specifier]);
              _this2.invertedOrderedSpecIndex = interval.IntervalOrderedImperfSpecs.length - 1 - _this2.orderedSpecifierIndex;
              _this2.invertedOrderedSpecifier = interval.IntervalOrderedImperfSpecs[_this2.invertedOrderedSpecIndex];
          }

          _this2.mod7inversion = _this2.invertedOrderedSpecifier + generic.mod7inversion.toString();
          /* ( if (this.direction == interval.IntervalDirections.DESCENDING) {
          this.mod7 = this.mod7inversion;
          } else {
          this.mod7 = this.simpleName;
          } */

          // TODO: reverse()
          // TODO: property cents
          return _this2;
      }

      /**
       * Returns a ChromaticInterval object of the same size.
       *
       * @memberof music21.interval.DiatonicInterval
       * @returns {music21.interval.ChromaticInterval}
       */


      createClass(DiatonicInterval, [{
          key: 'getChromatic',
          value: function getChromatic() {
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

              if (this.generic.direction === interval.IntervalDirections.DESCENDING) {
                  semitones *= -1;
              }
              if (debug) {
                  console.log('DiatonicInterval.getChromatic -- octaveOffset: ' + octaveOffset);
                  console.log('DiatonicInterval.getChromatic -- semitonesStart: ' + semitonesStart);
                  console.log('DiatonicInterval.getChromatic -- specName: ' + specName);
                  console.log('DiatonicInterval.getChromatic -- semitonesAdjust: ' + semitonesAdjust);
                  console.log('DiatonicInterval.getChromatic -- semitones: ' + semitones);
              }
              return new interval.ChromaticInterval(semitones);
          }
      }]);
      return DiatonicInterval;
  }(prebase.ProtoM21Object);
  interval.DiatonicInterval = DiatonicInterval;

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
  var ChromaticInterval = function (_prebase$ProtoM21Obje3) {
      inherits(ChromaticInterval, _prebase$ProtoM21Obje3);

      function ChromaticInterval(value) {
          classCallCheck(this, ChromaticInterval);

          var _this3 = possibleConstructorReturn(this, (ChromaticInterval.__proto__ || Object.getPrototypeOf(ChromaticInterval)).call(this));

          _this3.classes.push('ChromaticInterval');

          _this3.semitones = value;
          _this3.cents = Math.round(value * 100.0, 5);
          _this3.directed = value;
          _this3.undirected = Math.abs(value);

          if (_this3.directed === 0) {
              _this3.direction = interval.IntervalDirections.OBLIQUE;
          } else if (_this3.directed === _this3.undirected) {
              _this3.direction = interval.IntervalDirections.ASCENDING;
          } else {
              _this3.direction = interval.IntervalDirections.DESCENDING;
          }

          _this3.mod12 = _this3.semitones % 12;
          _this3.simpleUndirected = _this3.undirected % 12;
          if (_this3.direction === interval.IntervalDirections.DESCENDING) {
              _this3.simpleDirected = -1 * _this3.simpleUndirected;
          } else {
              _this3.simpleDirected = _this3.simpleUndirected;
          }

          _this3.intervalClass = _this3.mod12;
          if (_this3.mod12 > 6) {
              _this3.intervalClass = 12 - _this3.mod12;
          }

          if (_this3.undirected === 1) {
              _this3.isChromaticStep = true;
          } else {
              _this3.isChromaticStep = false;
          }
          return _this3;
      }

      createClass(ChromaticInterval, [{
          key: 'reverse',
          value: function reverse() {
              return new interval.ChromaticInterval(this.undirected * (-1 * this.direction));
          }

          //  TODO: this.getDiatonic()

          /**
           * Transposes pitches but does not maintain accidentals, etc.
           *
           * @memberof music21.interval.ChromaticInterval
           * @property {music21.pitch.Pitch} p - pitch to transpose
           * @returns {music21.pitch.Pitch}
           */

      }, {
          key: 'transposePitch',
          value: function transposePitch(p) {
              var useImplicitOctave = false;
              if (p.octave === undefined) {
                  // not yet implemented in m21j
                  useImplicitOctave = true;
              }
              var pps = p.ps;
              var newPitch = new pitch.Pitch();
              newPitch.ps = pps + this.semitones;
              if (useImplicitOctave) {
                  newPitch.octave = undefined;
              }
              return newPitch;
          }
      }]);
      return ChromaticInterval;
  }(prebase.ProtoM21Object);
  interval.ChromaticInterval = ChromaticInterval;

  interval.IntervalStepNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  /**
   * @function music21.interval.IntervalConvertDiatonicNumberToStep
   * @memberof music21.interval
   * @param {Int} dn - diatonic number, where 29 = C4, C#4 etc.
   * @returns {Array} two element array of {string} stepName and {Int} octave
   */
  interval.IntervalConvertDiatonicNumberToStep = function IntervalConvertDiatonicNumberToStep(dn) {
      var stepNumber = void 0;
      var octave = void 0;
      if (dn === 0) {
          return ['B', -1];
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
  var Interval = function (_prebase$ProtoM21Obje4) {
      inherits(Interval, _prebase$ProtoM21Obje4);

      function Interval() {
          classCallCheck(this, Interval);

          var _this4 = possibleConstructorReturn(this, (Interval.__proto__ || Object.getPrototypeOf(Interval)).call(this));

          _this4.classes.push('Interval');

          // todo: allow full range of ways of specifying as in m21p

          for (var _len = arguments.length, restArgs = Array(_len), _key = 0; _key < _len; _key++) {
              restArgs[_key] = arguments[_key];
          }

          if (restArgs.length === 1) {
              var arg0 = restArgs[0];
              if (typeof arg0 === 'string') {
                  // simple...
                  var specifier = arg0.slice(0, 1);
                  var generic = parseInt(arg0.slice(1));
                  var gI = new interval.GenericInterval(generic);
                  var dI = new interval.DiatonicInterval(specifier, gI);
                  _this4.diatonic = dI;
                  _this4.chromatic = _this4.diatonic.getChromatic();
              } else if (arg0.specifier !== undefined) {
                  // assume diatonic...
                  _this4.diatonic = arg0;
                  _this4.chromatic = _this4.diatonic.getChromatic();
              } else {
                  console.error('cant parse string arguments to Interval yet');
              }
          } else if (restArgs.length === 2) {
              if (restArgs[0].pitch === undefined && restArgs[0].diatonicNoteNum === undefined) {
                  _this4.diatonic = restArgs[0];
                  _this4.chromatic = restArgs[1];
              } else {
                  var n1 = restArgs[0];
                  var n2 = restArgs[1];
                  var gInt = interval.notesToGeneric(n1, n2);
                  var cInt = interval.notesToChromatic(n1, n2);

                  _this4.diatonic = interval.intervalsToDiatonic(gInt, cInt);
                  _this4.chromatic = cInt;
              }
          }
          _this4.reinit();
          return _this4;
      }

      createClass(Interval, [{
          key: 'reinit',
          value: function reinit() {
              this.direction = this.chromatic.direction;
              this.specifier = this.diatonic.specifier;
              this.diatonicType = this.diatonic.specifier;
              // this.specificName = this.diatonic.specificName;
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
          }

          /**
           * @memberof music21.interval.Interval
           * @returns {Boolean}
           */

      }, {
          key: 'isConsonant',
          value: function isConsonant() {
              var sn = this.simpleName;
              var consonantNames = ['P5', 'm3', 'M3', 'm6', 'M6', 'P1'];
              if (consonantNames.indexOf(sn) !== -1) {
                  return true;
              } else {
                  return false;
              }
          }

          //  todo general: microtones
          /**
           * @memberof music21.interval.Interval
           * @param {music21.pitch.Pitch} p - pitch to transpose
           * @returns {music21.pitch.Pitch}
           */

      }, {
          key: 'transposePitch',
          value: function transposePitch(p) {
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
              if (debug) {
                  console.log('Interval.transposePitch -- new step ' + pitch2.step);
                  console.log('Interval.transposePitch -- new octave ' + pitch2.octave);
                  console.log('Interval.transposePitch -- fixing halfsteps for ' + halfStepsToFix);
              }
              return pitch2;
          }
      }, {
          key: 'complement',
          get: function get() {
              return new interval.Interval(this.diatonic.mod7inversion);
          }
      }]);
      return Interval;
  }(prebase.ProtoM21Object);
  interval.Interval = Interval;
  /**
   * Convert two notes or pitches to a GenericInterval;
   */
  interval.notesToGeneric = function notesToGeneric(n1, n2) {
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

  interval.convertStaffDistanceToInterval = function convertStaffDistanceToInterval(staffDist) {
      if (staffDist === 0) {
          return 1;
      } else if (staffDist > 0) {
          return staffDist + 1;
      } else {
          return staffDist - 1;
      }
  };

  interval.notesToChromatic = function notesToChromatic(n1, n2) {
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

  interval.intervalsToDiatonic = function intervalsToDiatonic(gInt, cInt) {
      var specifier = interval._getSpecifierFromGenericChromatic(gInt, cInt);
      // todo -- convert specifier...
      return new interval.DiatonicInterval(specifier, gInt);
  };

  interval._getSpecifierFromGenericChromatic = function _getSpecifierFromGenericChromatic(gInt, cInt) {
      var noteVals = [undefined, 0, 2, 4, 5, 7, 9, 11];
      var normalSemis = noteVals[gInt.simpleUndirected] + 12 * gInt.undirectedOctaves;
      var theseSemis = 0;
      if (gInt.direction !== cInt.direction && gInt.direction !== interval.IntervalDirections.OBLIQUE && cInt.direction !== interval.IntervalDirections.OBLIQUE) {
          // intervals like d2 and dd2 etc. (the last test doesn't matter, since -1*0 === 0, but in theory it should be there)
          theseSemis = -1 * cInt.undirected;
      } else if (gInt.undirected === 1) {
          theseSemis = cInt.directed; // matters for unison
      } else {
          // all normal intervals
          theseSemis = cInt.undirected;
      }
      var semisRounded = Math.round(theseSemis);
      var specifier = '';
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
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  scale.SimpleDiatonicScale = function SimpleDiatonicScale(tonic, scaleSteps) {
      if (tonic === undefined) {
          tonic = new pitch.Pitch('C4');
      } else if (!(tonic instanceof pitch.Pitch)) {
          throw new Music21Exception('Cannot make a scale not from ' + 'a music21.pitch.Pitch object: ' + tonic);
      }
      if (scaleSteps === undefined) {
          scaleSteps = ['M', 'M', 'm', 'M', 'M', 'M', 'm'];
      }
      var gi = new interval.GenericInterval(2);
      var pitches = [tonic];
      var lastPitch = tonic;
      for (var i = 0; i < scaleSteps.length; i++) {
          var di = new interval.DiatonicInterval(scaleSteps[i], gi);
          var ii = new interval.Interval(di);
          var newPitch = ii.transposePitch(lastPitch);
          if (debug) {
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
  scale.ScaleSimpleMajor = function ScaleSimpleMajor(tonic) {
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
  scale.ScaleSimpleMinor = function ScaleSimpleMinor(tonic, minorType) {
      var scaleSteps = ['M', 'm', 'M', 'M', 'm', 'M', 'M'];
      if (typeof minorType === 'string') {
          // "harmonic minor" -> "harmonic-minor"
          minorType = minorType.replace(/\s/g, '-');
      }
      if (minorType === 'harmonic' || minorType === 'harmonic-minor') {
          scaleSteps[5] = 'A';
          scaleSteps[6] = 'm';
      } else if (minorType === 'melodic' || minorType === 'melodic-ascending' || minorType === 'melodic-minor' || minorType === 'melodic-minor-ascending') {
          scaleSteps[4] = 'M';
          scaleSteps[6] = 'm';
      }
      return new scale.SimpleDiatonicScale(tonic, scaleSteps);
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/key -- KeySignature and Key objects
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  var KeySignature = function (_base$Music21Object) {
      inherits(KeySignature, _base$Music21Object);

      function KeySignature(sharps) {
          classCallCheck(this, KeySignature);

          var _this = possibleConstructorReturn(this, (KeySignature.__proto__ || Object.getPrototypeOf(KeySignature)).call(this));

          _this.classes.push('KeySignature');
          _this._sharps = sharps || 0; // if undefined
          _this._alteredPitchesCache = undefined;

          // 12 flats/sharps enough for now...
          _this.flatMapping = ['C', 'F', 'B-', 'E-', 'A-', 'D-', 'G-', 'C-', 'F-', 'B--', 'E--', 'A--', 'D--'];
          _this.sharpMapping = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'];
          return _this;
      }

      createClass(KeySignature, [{
          key: 'majorName',

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
          value: function majorName() {
              if (this.sharps >= 0) {
                  return this.sharpMapping[this.sharps];
              } else {
                  return this.flatMapping[Math.abs(this.sharps)];
              }
          }
          /**
           * Return the name of the minor key with this many sharps
           * @memberof music21.key.KeySignature
           * @returns {(string|undefined)}
           */

      }, {
          key: 'minorName',
          value: function minorName() {
              var tempSharps = this.sharps + 3;
              if (tempSharps >= 0) {
                  return this.sharpMapping[tempSharps];
              } else {
                  return this.flatMapping[Math.abs(tempSharps)];
              }
          }
          /**
           * returns the vexflow name (just the `majorName()` with "b" for "-") for
           * the key signature.  Does not create the object.
           *
           * Deprecated.
           *
           * @memberof music21.key.KeySignature
           * @returns {string}
           */

      }, {
          key: 'vexflow',
          value: function vexflow() {
              console.log('calling deprecated function KeySignature.vexflow');
              var tempName = this.majorName();
              return tempName.replace(/-/g, 'b');
          }
          /**
           * Returns the accidental associated with a step in this key, or undefined if none.
           *
           * @memberof music21.key.KeySignature
           * @param {string} step - a valid step name such as "C","D", etc., but not "C#" etc.
           * @returns {(music21.pitch.Accidental|undefined)}
           */

      }, {
          key: 'accidentalByStep',
          value: function accidentalByStep(step) {
              var aps = this.alteredPitches;
              for (var i = 0; i < aps.length; i++) {
                  if (aps[i].step === step) {
                      if (aps[i].accidental === undefined) {
                          return undefined;
                      }
                      // make a new accidental;
                      return new pitch.Accidental(aps[i].accidental.alter);
                  }
              }
              return undefined;
          }
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

      }, {
          key: 'transposePitchFromC',
          value: function transposePitchFromC(p) {
              var transInterval = void 0;
              var transTimes = void 0;
              if (this.sharps === 0) {
                  return new pitch.Pitch(p.nameWithOctave);
              } else if (this.sharps < 0) {
                  transTimes = Math.abs(this.sharps);
                  transInterval = new interval.Interval('P4');
              } else {
                  transTimes = this.sharps;
                  transInterval = new interval.Interval('P5');
              }
              var newPitch = p;
              for (var i = 0; i < transTimes; i++) {
                  newPitch = transInterval.transposePitch(newPitch);
                  if (i % 2 === 1) {
                      newPitch.octave -= 1;
                  }
              }
              return newPitch;
          }
      }, {
          key: 'sharps',
          get: function get() {
              return this._sharps;
          },
          set: function set(s) {
              this._alteredPitchesCache = [];
              this._sharps = s;
          }
          /**
           * Gives the width in pixels necessary to represent the key signature.
           *
           * @memberof music21.key.KeySignature#
           * @var {number} width
           * @readonly
           */

      }, {
          key: 'width',
          get: function get() {
              if (this.sharps === 0) {
                  return 0;
              } else {
                  // add 6 to add extra space after the KS...
                  return 12 * Math.abs(this.sharps) + 6;
              }
          }
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

      }, {
          key: 'alteredPitches',
          get: function get() {
              if (this._alteredPitchesCache !== undefined) {
                  return this._alteredPitchesCache;
              }
              var transStr = 'P5';
              var startPitch = 'B';
              if (this.sharps < 0) {
                  transStr = 'P4';
                  startPitch = 'F';
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
      }]);
      return KeySignature;
  }(base.Music21Object);
  key.KeySignature = KeySignature;

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
  var Key = function (_KeySignature) {
      inherits(Key, _KeySignature);

      function Key(keyName, mode) {
          classCallCheck(this, Key);

          if (keyName === undefined) {
              keyName = 'C';
          }
          if (mode === undefined) {
              var lowerCase = keyName.toLowerCase();
              if (keyName === lowerCase) {
                  mode = 'minor';
              } else {
                  mode = 'major';
              }
          }

          var sharpsArray = 'A-- E-- B-- F- C- G- D- A- E- B- F C G D A E B F# C# G# D# A# E# B#'.split(' ');
          var sharpsIndex = sharpsArray.indexOf(keyName.toUpperCase());
          if (sharpsIndex === -1) {
              throw new Music21Exception('Cannot find the key for ' + keyName);
          }
          var modeShift = key.modeSharpsAlter[mode] || 0;
          var sharps = sharpsIndex + modeShift - 11;
          if (debug) {
              console.log('Found sharps ' + sharps + ' for key: ' + keyName);
          }

          var _this2 = possibleConstructorReturn(this, (Key.__proto__ || Object.getPrototypeOf(Key)).call(this, sharps));

          _this2.tonic = keyName;
          _this2.mode = mode;
          return _this2;
      }
      /**
       * returns a {@link music21.scale.ScaleSimpleMajor} or {@link music21.scale.ScaleSimpleMinor}
       * object from the pitch object.
       *
       * @memberof music21.key.Key
       * @param {string|undefined} [scaleType=this.mode] - the type of scale, or the mode.
       * @returns {object} A music21.scale.Scale subclass.
       */


      createClass(Key, [{
          key: 'getScale',
          value: function getScale(scaleType) {
              if (scaleType === undefined) {
                  scaleType = this.mode;
              }
              var pitchObj = new pitch.Pitch(this.tonic);
              if (scaleType === 'major') {
                  return scale.ScaleSimpleMajor(pitchObj);
              } else {
                  return scale.ScaleSimpleMinor(pitchObj, scaleType);
              }
          }
      }]);
      return Key;
  }(KeySignature);
  key.Key = Key;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/miditools -- A collection of tools for midi. See the namespace {@link music21.miditools}
   *
   * Copyright (c) 2014-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
   *
   * @author Michael Scott Cuthbert
   */
  // drag handler...
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
  var Event = function () {
      function Event(t, a, b, c) {
          classCallCheck(this, Event);

          this.timing = t;
          this.data1 = a;
          this.data2 = b;
          this.data3 = c;
          this.midiCommand = a >> 4;

          this.noteOff = this.midiCommand === 8;
          this.noteOn = this.midiCommand === 9;

          this.midiNote = undefined;
          if (this.noteOn || this.noteOff) {
              this.midiNote = this.data2 + 12 * miditools.transposeOctave;
              this.velocity = this.data3;
          }
      }
      /**
       * Calls MIDI.noteOn or MIDI.noteOff for the note
       * represented by the Event (if appropriate)
       *
       * @memberof music21.miditools.Event
       * @returns {undefined}
       */


      createClass(Event, [{
          key: 'sendToMIDIjs',
          value: function sendToMIDIjs() {
              if (MIDI !== undefined) {
                  if (this.noteOn) {
                      MIDI.noteOn(0, this.midiNote, this.velocity, 0);
                  } else if (this.noteOff) {
                      MIDI.noteOff(0, this.midiNote, 0);
                  }
              } else {
                  console.warn('could not playback note because no MIDIout defined');
              }
          }
          /**
           * Makes a {@link music21.note.Note} object from the event's midiNote number.
           *
           * @memberof music21.miditools.Event
           * @returns {music21.note.Note} - the {@link music21.note.Note} object represented by Event.midiNote
           */

      }, {
          key: 'music21Note',
          value: function music21Note() {
              var m21n = new note.Note();
              m21n.pitch.ps = this.midiNote;
              return m21n;
          }
      }]);
      return Event;
  }();
  miditools.Event = Event;

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
          get: function get() {
              if (this.metronome === undefined) {
                  return this._baseTempo;
              } else {
                  return this.metronome.tempo;
              }
          },
          set: function set(t) {
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
  miditools.clearOldChords = function clearOldChords() {
      // clear out notes that may be a chord...
      var nowInMs = Date.now(); // in ms
      if (miditools.heldChordTime + miditools.maxDelay < nowInMs) {
          miditools.heldChordTime = nowInMs;
          if (miditools.heldChordNotes !== undefined) {
              // console.log('to send out chords');
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
  miditools.makeChords = function makeChords(jEvent) {
      // jEvent is a miditools.Event object
      if (jEvent.noteOn) {
          var m21n = jEvent.music21Note();
          if (miditools.heldChordNotes === undefined) {
              miditools.heldChordNotes = [m21n];
          } else {
              for (var i = 0; i < miditools.heldChordNotes.length; i++) {
                  var foundNote = miditools.heldChordNotes[i];
                  if (foundNote.pitch.ps === m21n.pitch.ps) {
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
   * {@link music21.miditools.callBacks.sendOutChord} callback with the Chord or Note as a parameter.
   *
   * @memberof music21.miditools
   * @param {Array<music21.note.Note>} chordNoteList - an Array of {@link music21.note.Note} objects
   * @returns {(music21.note.Note|music21.chord.Chord|undefined)} A {@link music21.chord.Chord} object,
   * most likely, but maybe a {@link music21.note.Note} object)
   */
  miditools.sendOutChord = function sendOutChord(chordNoteList) {
      var appendObject = void 0;
      if (chordNoteList.length > 1) {
          // console.log(chordNoteList[0].name, chordNoteList[1].name);
          appendObject = new chord.Chord(chordNoteList);
      } else if (chordNoteList.length === 1) {
          appendObject = chordNoteList[0]; // note object
      } else {
          return undefined;
      }
      appendObject.stemDirection = 'noStem';
      miditools.quantizeLastNote();
      miditools.lastElement = appendObject;
      if (miditools.callBacks.sendOutChord !== undefined) {
          miditools.callBacks.sendOutChord(appendObject);
      }
      return appendObject;
  };

  /* ----------- callbacks --------- */
  // TODO: all callbacks (incl. raw, sendOutChord) should be able to be a function or an array of functions

  /**
  * callBacks is an object with three keys:
  *
  * - raw: function (t, a, b,c) to call when any midievent arrives. Default: `function (t, a, b, c) { return new miditools.Event(t, a, b, c); }`
  * - general: function ( miditools.Event() ) to call when an Event object has been created. Default: `[miditools.sendToMIDIjs, miditools.quantizeLastNote]`
  * - sendOutChord: function (array_of_note.Note_objects) to call when a sufficient time has passed to build a chord from input. Default: empty function.
  *
  * At present, only "general" can take an Array of event listening functions, but I hope to change that for sendOutChord also.
  *
  * "general" is usually the callback list to play around with.
  *
  * @memberof music21.miditools
  */
  miditools.callBacks = {
      raw: function raw(t, a, b, c) {
          return new miditools.Event(t, a, b, c);
      },
      general: [miditools.sendToMIDIjs, miditools.quantizeLastNote],
      sendOutChord: function sendOutChord(arrayOfNotes) {}
  };

  /**
   * Quantizes the lastElement (passed in) or music21.miditools.lastElement.
   *
   * @memberof music21.miditools
   * @param {music21.note.GeneralNote} lastElement - A {@link music21.note.Note} to be quantized
   * @returns {music21.note.GeneralNote} The same {@link music21.note.Note} object passed in with
   * duration quantized
   */
  miditools.quantizeLastNote = function quantizeLastNote(lastElement) {
      if (lastElement === undefined) {
          lastElement = this.lastElement;
          if (lastElement === undefined) {
              return undefined;
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
      } else if (roundedQuarterLength === 1.25) {
          roundedQuarterLength = 1;
      } else if (roundedQuarterLength === 0.75) {
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
  miditools.postLoadCallback = function postLoadCallback(soundfont, callback) {
      // this should be bound to MIDI
      if (debug) {
          console.log('soundfont loaded about to execute callback.');
          console.log('first playing two notes very softly -- seems to flush the buffer.');
      }
      $$1('.loadingSoundfont').remove();

      var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
      var isAudioTag = MIDI.technology === 'HTML Audio Tag';
      var instrumentObj = instrument.find(soundfont);
      if (instrumentObj !== undefined) {
          MIDI.programChange(instrumentObj.midiChannel, instrumentObj.midiProgram);
          if (debug) {
              console.log(soundfont + ' (' + instrumentObj.midiProgram + ') loaded on ', instrumentObj.midiChannel);
          }
          if (isFirefox === false && isAudioTag === false) {
              var c = instrumentObj.midiChannel;
              // Firefox ignores sound volume! so don't play! as does IE and others using HTML audio tag.
              MIDI.noteOn(c, 36, 1, 0); // if no notes have been played before then
              MIDI.noteOff(c, 36, 1, 0.1); // the second note to be played is always
              MIDI.noteOn(c, 48, 1, 0.2); // very clipped (on Safari at least)
              MIDI.noteOff(c, 48, 1, 0.3); // this helps a lot.
              MIDI.noteOn(c, 60, 1, 0.3); // chrome needs three?
              MIDI.noteOff(c, 60, 1, 0.4);
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
  miditools.loadSoundfont = function loadSoundfont(soundfont, callback) {
      if (miditools.loadedSoundfonts[soundfont] === true) {
          if (callback !== undefined) {
              var instrumentObj = instrument.find(soundfont);
              callback(instrumentObj);
          }
      } else if (miditools.loadedSoundfonts[soundfont] === 'loading') {
          var waitThenCall = function waitThenCall() {
              if (miditools.loadedSoundfonts[soundfont] === true) {
                  if (debug) {
                      console.log('other process has finished loading; calling callback');
                  }
                  if (callback !== undefined) {
                      var _instrumentObj = instrument.find(soundfont);
                      callback(_instrumentObj);
                  }
              } else {
                  if (debug) {
                      console.log('waiting for other process load');
                  }
                  setTimeout(waitThenCall, 100);
              }
          };
          waitThenCall();
      } else {
          miditools.loadedSoundfonts[soundfont] = 'loading';
          if (debug) {
              console.log('waiting for document ready');
          }
          $$1(document).ready(function () {
              if (debug) {
                  console.log('document ready, waiting to load soundfont');
              }
              $$1(document.body).append($$1("<div class='loadingSoundfont'><b>Loading MIDI Instrument</b>: " + 'audio will begin when this message disappears.</div>'));
              MIDI.loadPlugin({
                  soundfontUrl: common.urls.soundfontUrl,
                  instrument: soundfont,
                  onsuccess: miditools.postLoadCallback.bind(MIDI, soundfont, callback)
              });
          });
      }
  };

  /**
   * MidiPlayer -- an embedded midi player including the ability to create a
   * playback device.
   *
   * @class MidiPlayer
   * @memberOf music21.miditools
   * @property {number} speed - playback speed scaling (1=default).
   * @property {JQueryDOMObject|undefined} $playDiv - div holding the player,
   */
  var MidiPlayer = function () {
      function MidiPlayer() {
          classCallCheck(this, MidiPlayer);

          this.player = new MIDI.Players.PlayInstance();
          this.speed = 1.0;
          this.$playDiv = undefined;
      }
      /**
       * @param where
       * @returns DOMElement
       */


      createClass(MidiPlayer, [{
          key: 'addPlayer',
          value: function addPlayer(where) {
              var $where = where;
              if (where === undefined) {
                  where = document.body;
              }
              if (where.jquery === undefined) {
                  $where = $$1(where);
              }
              var $playDiv = $$1('<div class="midiPlayer">');
              var $controls = $$1('<div class="positionControls">');
              var $playPause = $$1('<input type="image" src="' + this.playPng() + '" align="absmiddle" value="play" class="playPause">');
              var $stop = $$1('<input type="image" src="' + this.stopPng() + '" align="absmiddle" value="stop" class="stopButton">');

              $playPause.on('click', this.pausePlayStop.bind(this));
              $stop.on('click', this.stopButton.bind(this));
              $controls.append($playPause);
              $controls.append($stop);
              $playDiv.append($controls);

              var $time = $$1('<div class="timeControls">');
              var $timePlayed = $$1('<span class="timePlayed">0:00</span>');
              var $capsule = $$1('<span class="capsule"><span class="cursor"></span></span>');
              var $timeRemaining = $$1('<span class="timeRemaining">-0:00</span>');
              $time.append($timePlayed);
              $time.append($capsule);
              $time.append($timeRemaining);
              $playDiv.append($time);

              $where.append($playDiv);
              this.$playDiv = $playDiv;
              return $playDiv;
          }
      }, {
          key: 'stopButton',
          value: function stopButton() {
              this.pausePlayStop('yes');
          }
      }, {
          key: 'playPng',
          value: function playPng() {
              return common.urls.midiPlayer + '/play.png';
          }
      }, {
          key: 'pausePng',
          value: function pausePng() {
              return common.urls.midiPlayer + '/pause.png';
          }
      }, {
          key: 'stopPng',
          value: function stopPng() {
              return common.urls.midiPlayer + '/stop.png';
          }
      }, {
          key: 'pausePlayStop',
          value: function pausePlayStop(stop) {
              var d = void 0;
              if (this.$playDiv === undefined) {
                  d = { src: 'doesnt matter' };
              } else {
                  d = this.$playDiv.find('.playPause')[0];
              }
              if (stop === 'yes') {
                  this.player.stop();
                  d.src = this.playPng();
              } else if (this.player.playing || stop === 'pause') {
                  d.src = this.playPng();
                  this.player.pause(true);
              } else {
                  d.src = this.pausePng();
                  this.player.resume();
              }
          }
      }, {
          key: 'base64Load',
          value: function base64Load(b64data) {
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
          }
      }, {
          key: 'songFinished',
          value: function songFinished() {
              this.pausePlayStop('yes');
          }
      }, {
          key: 'fileLoaded',
          value: function fileLoaded() {
              this.updatePlaying();
          }
      }, {
          key: 'startAndUpdate',
          value: function startAndUpdate() {
              this.player.start();
              this.updatePlaying();
          }
      }, {
          key: 'updatePlaying',
          value: function updatePlaying() {
              var _this = this;

              var self = this;
              var player = this.player;
              if (this.$playDiv === undefined) {
                  return;
              }
              var $d = this.$playDiv;
              // update the timestamp
              var timePlayed = $d.find('.timePlayed')[0];
              var timeRemaining = $d.find('.timeRemaining')[0];
              var timeCursor = $d.find('.cursor')[0];
              var $capsule = $d.find('.capsule');
              //
              eventjs.add($capsule[0], 'drag', function (event, self) {
                  eventjs.cancel(event);
                  var player = _this.player;
                  player.currentTime = self.x / 420 * player.endTime;
                  if (player.currentTime < 0) {
                      player.currentTime = 0;
                  }
                  if (player.currentTime > player.endTime) {
                      player.currentTime = player.endTime;
                  }
                  if (self.state === 'down') {
                      _this.pausePlayStop('pause');
                  } else if (self.state === 'up') {
                      _this.pausePlayStop('play');
                  }
              });
              //
              function timeFormatting(n) {
                  var minutes = n / 60 >> 0;
                  var seconds = String(n - minutes * 60 >> 0);
                  if (seconds.length === 1) {
                      seconds = '0' + seconds;
                  }
                  return minutes + ':' + seconds;
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
                  timeCursor.style.width = percent * 100 + '%';
                  timePlayed.innerHTML = timeFormatting(now);
                  timeRemaining.innerHTML = '-' + timeFormatting(end - now);
              });
          }
      }]);
      return MidiPlayer;
  }();
  miditools.MidiPlayer = MidiPlayer;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/keyboard -- PianoKeyboard rendering and display objects
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  var Key$1 = function () {
      function Key() {
          classCallCheck(this, Key);

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
      }
      /**
       * Gets an SVG object for the key
       *
       * @method music21.keyboard.Key#makeKey
       * @memberof music21.keyboard.Key
       * @param {number} startX - X position in pixels from left of keyboard to draw key at
       * @returns {DOMObject} a SVG rectangle for the key
       */


      createClass(Key, [{
          key: 'makeKey',
          value: function makeKey(startX) {
              var keyattrs = {
                  style: this.keyStyle,
                  x: startX,
                  y: 0,
                  'class': 'keyboardkey ' + this.keyClass,
                  'id': this.id,
                  width: this.width * this.scaleFactor,
                  height: this.height * this.scaleFactor,
                  rx: 3,
                  ry: 3
              };
              var keyDOM = common.makeSVGright('rect', keyattrs);
              for (var x in this.callbacks) {
                  if ({}.hasOwnProperty.call(this.callbacks, x)) {
                      keyDOM.addEventListener(x, this.callbacks[x], false);
                  }
              }
              this.svgObj = keyDOM;
              return keyDOM;
          }
          /**
           * Adds a circle (red) on the key (to mark middle C etc.)
           *
           * @method music21.keyboard.Key#addCircle
           * @param {string} [strokeColor='red']
           * @returns {DOMObject}
           */

      }, {
          key: 'addCircle',
          value: function addCircle(strokeColor) {
              if (this.svgObj === undefined || this.parent === undefined || this.parent.svgObj === undefined) {
                  return undefined;
              }
              if (strokeColor === undefined) {
                  strokeColor = 'red';
              }
              var x = parseInt(this.svgObj.getAttribute('x'));
              var cx = x + this.parent.scaleFactor * this.width / 2;
              // console.log('cx', cx);
              var keyattrs = {
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
              // console.log(circleDom);
              return circleDom;
          }
          /**
           * Adds the note name on the key
           *
           * @method music21.keyboard.Key#addNoteName
           * @param {Boolean} [labelOctaves=false] - use octave numbers too?
           * @returns {DOMObject}
           */

      }, {
          key: 'addNoteName',
          value: function addNoteName(labelOctaves) {
              if (this.svgObj === undefined || this.parent === undefined || this.parent.svgObj === undefined) {
                  return this;
              }
              if (this.id === 0 && this.pitchObj === undefined) {
                  return this;
              } else if (this.pitchObj === undefined) {
                  this.pitchObj = new pitch.Pitch();
                  this.pitchObj.ps = this.id;
              }
              if (this.pitchObj.accidental !== undefined && this.pitchObj.accidental.alter !== 0) {
                  return this;
              }
              var x = parseInt(this.svgObj.getAttribute('x'));
              var idStr = this.pitchObj.name;
              var fontSize = 14;
              if (labelOctaves === true) {
                  idStr = this.pitchObj.nameWithOctave;
                  fontSize = 12;
                  x -= 2;
              }
              fontSize = Math.floor(fontSize * parent.scaleFactor);

              var textfill = 'white';
              if (this.keyClass === 'whitekey') {
                  textfill = 'black';
              }
              var textattrs = {
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
              return this;
          }
          /**
           * Removes the note name from the key (if exists)
           *
           * @method music21.keyboard.Key#removeNoteName
           * @returns {undefined}
           */

      }, {
          key: 'removeNoteName',
          value: function removeNoteName() {
              if (this.svgObj === undefined || this.parent === undefined || this.parent.svgObj === undefined) {
                  return;
              }
              if (this.noteNameSvgObj === undefined) {
                  return;
              }
              if (this.noteNameSvgObj.parentNode === this.parent.svgObj) {
                  this.parent.svgObj.removeChild(this.noteNameSvgObj);
              }
              this.noteNameSvgObj = undefined;
          }
      }]);
      return Key;
  }();
  keyboard.Key = Key$1;

  /**
   * Defaults for a WhiteKey (width, height, keyStyle, keyClass)
   *
   * @class WhiteKey
   * @memberof music21.keyboard
   * @extends music21.keyboard.Key
   */
  var WhiteKey = function (_Key) {
      inherits(WhiteKey, _Key);

      function WhiteKey() {
          classCallCheck(this, WhiteKey);

          var _this = possibleConstructorReturn(this, (WhiteKey.__proto__ || Object.getPrototypeOf(WhiteKey)).call(this));

          _this.classes.push('WhiteKey');
          _this.width = 23;
          _this.height = 120;
          _this.keyStyle = 'fill:#fffff6;stroke:black';
          _this.keyClass = 'whitekey';
          return _this;
      }

      return WhiteKey;
  }(Key$1);
  keyboard.WhiteKey = WhiteKey;
  /**
   * Defaults for a BlackKey (width, height, keyStyle, keyClass)
   *
   * @class BlackKey
   * @memberof music21.keyboard
   * @extends music21.keyboard.Key
   */
  var BlackKey = function (_Key2) {
      inherits(BlackKey, _Key2);

      function BlackKey() {
          classCallCheck(this, BlackKey);

          var _this2 = possibleConstructorReturn(this, (BlackKey.__proto__ || Object.getPrototypeOf(BlackKey)).call(this));

          _this2.classes.push('BlackKey');
          _this2.width = 13;
          _this2.height = 80;
          _this2.keyStyle = 'fill:black;stroke:black';
          _this2.keyClass = 'blackkey';
          return _this2;
      }

      return BlackKey;
  }(Key$1);

  keyboard.BlackKey = BlackKey;

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
  var Keyboard = function () {
      function Keyboard() {
          classCallCheck(this, Keyboard);

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

          this.startPitch = 'C3';
          this.endPitch = 'C5';
          this._startDNN = undefined;
          this._endDNN = undefined;

          this.hideable = false;
          this.scrollable = false;
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
          //   more accurate offsets from http://www.mathpages.com/home/kmath043.htm
          this.sharpOffsets = { 0: 14.3333, 1: 18.6666, 3: 13.25, 4: 16.25, 5: 19.75 };
      }
      /**
       * Redraws the SVG associated with this Keyboard
       *
       * @method music21.keyboard.Keyboard#redrawSVG
       * @returns {DOMObject} new svgDOM
       */


      createClass(Keyboard, [{
          key: 'redrawSVG',
          value: function redrawSVG() {
              if (this.svgObj === undefined) {
                  return undefined;
              }
              var oldSVG = this.svgObj;
              var svgParent = oldSVG.parentNode;
              this.keyObjects = {};
              var svgDOM = this.createSVG();
              svgParent.replaceChild(svgDOM, oldSVG);
              return svgDOM;
          }
          /**
           * Appends a keyboard to the `where` parameter
           *
           * @method music21.keyboard.Keyboard#appendKeyboard
           * @param {JQueryDOMObject|DOMObject} [where]
           * @returns {music21.keyboard.Keyboard} this
           */

      }, {
          key: 'appendKeyboard',
          value: function appendKeyboard(where) {
              if (where === undefined) {
                  where = document.body;
              } else if (where.jquery !== undefined) {
                  where = where[0];
              }

              var svgDOM = this.createSVG();

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
          }
          /**
           * Handle a click on a given SVG object
           *
           * @method music21.keyboard.Keyboard#clickhandler
           * @param {DOMObject} keyRect - the dom object with the keyboard.
           */

      }, {
          key: 'clickhandler',
          value: function clickhandler(keyRect) {
              // to-do : integrate with jazzHighlight...
              var id = keyRect.id;
              var thisKeyObject = this.keyObjects[id];
              if (thisKeyObject === undefined) {
                  return; // not on keyboard;
              }
              var storedStyle = thisKeyObject.keyStyle;
              var fillColor = '#c0c000';
              if (thisKeyObject.keyClass === 'whitekey') {
                  fillColor = 'yellow';
              }
              keyRect.setAttribute('style', 'fill:' + fillColor + ';stroke:black');
              miditools.loadSoundfont('acoustic_grand_piano', function (i) {
                  MIDI.noteOn(i.midiChannel, id, 100, 0);
                  MIDI.noteOff(i.midiChannel, id, 500);
              });
              setTimeout(function () {
                  keyRect.setAttribute('style', storedStyle);
              }, 500);
          }

          /**
           * Draws the SVG associated with this Keyboard
           *
           * @method music21.keyboard.Keyboard#createSVG
           * @returns {DOMObject} new svgDOM
           */

      }, {
          key: 'createSVG',
          value: function createSVG() {
              // DNN = pitch.diatonicNoteNum;
              // this._endDNN = final key note. I.e., the last note to be included, not the first note not included.
              // 6, 57 gives a standard 88-key keyboard;
              if (this._startDNN === undefined) {
                  if (typeof this.startPitch === 'string') {
                      var tempP = new pitch.Pitch(this.startPitch);
                      this._startDNN = tempP.diatonicNoteNum;
                  } else {
                      this._startDNN = this.startPitch;
                  }
              }

              if (this._endDNN === undefined) {
                  if (typeof this.endPitch === 'string') {
                      var _tempP = new pitch.Pitch(this.endPitch);
                      this._endDNN = _tempP.diatonicNoteNum;
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
              var movingPitch = new pitch.Pitch('C4');
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
                  wk.callbacks.click = function whitekeyCallbacksClick() {
                      thisKeyboardObject.clickhandler(this);
                  };

                  var wkSVG = wk.makeKey(this.whiteKeyWidth * this.scaleFactor * wki);
                  svgDOM.appendChild(wkSVG);

                  if ((currentIndex === 0 || currentIndex === 1 || currentIndex === 3 || currentIndex === 4 || currentIndex === 5) && wki !== keyboardDiatonicLength - 1) {
                      // create but do not append blackkey to the right of whitekey
                      var bk = new keyboard.BlackKey();
                      bk.id = movingPitch.midi + 1;
                      this.keyObjects[movingPitch.midi + 1] = bk;
                      bk.parent = this;

                      bk.scaleFactor = this.scaleFactor;
                      bk.width = this._defaultBlackKeyWidth * this.whiteKeyWidth / this._defaultWhiteKeyWidth;
                      bk.callbacks.click = function blackKeyClicksCallback() {
                          thisKeyboardObject.clickhandler(this);
                      };

                      var offsetFromWhiteKey = this.sharpOffsets[currentIndex];
                      offsetFromWhiteKey *= this.whiteKeyWidth / this._defaultWhiteKeyWidth * this.scaleFactor;
                      var bkSVG = bk.makeKey(this.whiteKeyWidth * this.scaleFactor * wki + offsetFromWhiteKey);
                      blackKeys.push(bkSVG);
                  }
                  currentIndex += 1;
                  currentIndex %= 7;
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
          }

          /**
           * Puts a circle on middle c.
           *
           * @method music21.keyboard.Keyboard#markMiddleC
           * @param {string} [strokeColor='red']
           */

      }, {
          key: 'markMiddleC',
          value: function markMiddleC(strokeColor) {
              var midC = this.keyObjects[60];
              if (midC !== undefined) {
                  midC.addCircle('red');
              }
          }
          /**
           * Puts note names on every white key.
           *
           * @method music21.keyboard.Keyboard#markNoteNames
           * @param {Boolean} [labelOctaves=false]
           */

      }, {
          key: 'markNoteNames',
          value: function markNoteNames(labelOctaves) {
              this.removeNoteNames(); // in case...
              for (var midi in this.keyObjects) {
                  if ({}.hasOwnProperty.call(this.keyObjects, midi)) {
                      var keyObj = this.keyObjects[midi];
                      keyObj.addNoteName(labelOctaves);
                  }
              }
          }

          /**
           * Remove note names on the keys, if they exist
           *
           * @method music21.keyboard.Keyboard#removeNoteNames
           */

      }, {
          key: 'removeNoteNames',
          value: function removeNoteNames() {
              for (var midi in this.keyObjects) {
                  if ({}.hasOwnProperty.call(this.keyObjects, midi)) {
                      var keyObj = this.keyObjects[midi];
                      keyObj.removeNoteName();
                  }
              }
          }

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

      }, {
          key: 'wrapScrollable',
          value: function wrapScrollable(svgDOM) {
              var _this3 = this;

              var $wrapper = $$1("<div class='keyboardScrollableWrapper'></div>").css({
                  display: 'inline-block'
              });
              var $bDown = $$1("<button class='keyboardOctaveDown'>&lt;&lt;</button>").css({
                  'font-size': Math.floor(this.scaleFactor * 15).toString() + 'px'
              }).bind('click', function () {
                  miditools.transposeOctave -= 1;
                  _this3._startDNN -= 7;
                  _this3._endDNN -= 7;
                  _this3.redrawSVG();
              });
              var $bUp = $$1("<button class='keyboardOctaveUp'>&gt;&gt;</button>").css({
                  'font-size': Math.floor(this.scaleFactor * 15).toString() + 'px'
              }).bind('click', function () {
                  miditools.transposeOctave += 1;
                  _this3._startDNN += 7;
                  _this3._endDNN += 7;
                  _this3.redrawSVG();
              });
              var $kWrapper = $$1("<div style='display:inline-block; vertical-align: middle' class='keyboardScrollableInnerDiv'></div>");
              $kWrapper[0].appendChild(svgDOM);
              $wrapper.append($bDown);
              $wrapper.append($kWrapper);
              $wrapper.append($bUp);
              return $wrapper;
          }
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

      }, {
          key: 'appendHideableKeyboard',
          value: function appendHideableKeyboard(where, keyboardSVG) {
              var $container = $$1("<div class='keyboardHideableContainer'/>");
              var $bInside = $$1("<div class='keyboardToggleInside'>↥</div>").css({
                  display: 'inline-block',
                  'padding-top': '40px',
                  'font-size': '40px'
              });
              var $b = $$1("<div class='keyboardToggleOutside'/>").css({
                  display: 'inline-block',
                  'vertical-align': 'top',
                  background: 'white'
              });
              $b.append($bInside);
              $b.data('defaultDisplay', $container.find('.keyboardSVG').css('display'));
              $b.data('state', 'down');
              $b.click(keyboard.triggerToggleShow);
              var $explain = $$1("<div class='keyboardExplain'>Show keyboard</div>").css({
                  'display': 'none',
                  'background-color': 'white',
                  'padding': '10px 10px 10px 10px',
                  'font-size': '12pt'
              });
              $b.append($explain);
              $container.append($b);
              $container[0].appendChild(keyboardSVG); // svg must use appendChild, not append.
              $$1(where).append($container);
              return $container;
          }
      }]);
      return Keyboard;
  }();

  /**
   * triggerToggleShow -- event for keyboard is shown or hidden.
   *
   * @function music21.keyboard.triggerToggleShow
   * @param {Event} e
   */
  keyboard.triggerToggleShow = function triggerToggleShow(e) {
      // "this" refers to the object clicked
      // e -- event is not used.
      var $t = $$1(this);
      var state = $t.data('state');
      var $parent = $t.parent();
      var $k = $parent.find('.keyboardScrollableWrapper');
      if ($k.length === 0) {
          // not scrollable
          $k = $parent.find('.keyboardSVG');
      }
      var $bInside = $t.find('.keyboardToggleInside');
      var $explain = $parent.find('.keyboardExplain');
      if (state === 'up') {
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
  keyboard.jazzHighlight = function jazzHighlight(e) {
      // e is a miditools.event object -- call with this = keyboard.Keyboard object via bind...
      if (e === undefined) {
          return;
      }
      if (e.noteOn) {
          var midiNote = e.midiNote;
          if (this.keyObjects[midiNote] !== undefined) {
              var keyObj = this.keyObjects[midiNote];
              var svgObj = keyObj.svgObj;
              var intensityRGB = '';
              var normalizedVelocity = (e.velocity + 25) / 127;
              if (normalizedVelocity > 1) {
                  normalizedVelocity = 1.0;
              }

              if (keyObj.keyClass === 'whitekey') {
                  var intensity = normalizedVelocity.toString();
                  intensityRGB = 'rgba(255, 255, 0, ' + intensity + ')';
              } else {
                  var _intensity = Math.floor(normalizedVelocity * 255).toString();
                  intensityRGB = 'rgb(' + _intensity + ',' + _intensity + ',0)';
                  // console.log(intensityRGB);
              }
              svgObj.setAttribute('style', 'fill:' + intensityRGB + ';stroke:black');
          }
      } else if (e.noteOff) {
          var _midiNote = e.midiNote;
          if (this.keyObjects[_midiNote] !== undefined) {
              var _keyObj = this.keyObjects[_midiNote];
              var _svgObj = _keyObj.svgObj;
              _svgObj.setAttribute('style', _keyObj.keyStyle);
          }
      }
  }; // call this with a bind(keyboard.Keyboard object)...

  keyboard.Keyboard = Keyboard;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/meter -- TimeSignature objects
   *
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  var TimeSignature = function (_base$Music21Object) {
      inherits(TimeSignature, _base$Music21Object);

      function TimeSignature(meterString) {
          classCallCheck(this, TimeSignature);

          var _this = possibleConstructorReturn(this, (TimeSignature.__proto__ || Object.getPrototypeOf(TimeSignature)).call(this));

          _this.classes.push('TimeSignature');
          _this._numerator = 4;
          _this._denominator = 4;
          _this.beatGroups = [];
          if (typeof meterString === 'string') {
              _this.ratioString = meterString;
          }
          return _this;
      }

      createClass(TimeSignature, [{
          key: 'computeBeatGroups',

          /**
           * Compute the Beat Group according to this time signature.
           *
           * @memberof music21.meter.TimeSignature
           * @returns {Array<Array<Int>>} a list of numerator and denominators, find a list of beat groups.
           */
          value: function computeBeatGroups() {
              var tempBeatGroups = [];
              var numBeats = this.numerator;
              var beatValue = this.denominator;
              if (beatValue < 8 && numBeats >= 5) {
                  var beatsToEighthNoteRatio = 8 / beatValue; // hopefully Int -- right Brian Ferneyhough?
                  beatValue = 8;
                  numBeats *= beatsToEighthNoteRatio;
              }

              if (beatValue >= 8) {
                  while (numBeats >= 5) {
                      tempBeatGroups.push([3, beatValue]);
                      numBeats -= 3;
                  }
                  if (numBeats === 4) {
                      tempBeatGroups.push([2, beatValue]);
                      tempBeatGroups.push([2, beatValue]);
                  } else if (numBeats > 0) {
                      tempBeatGroups.push([numBeats, beatValue]);
                  }
              } else if (beatValue === 2) {
                  tempBeatGroups.push([1, 2]);
              } else if (beatValue <= 1) {
                  tempBeatGroups.push([1, 1]);
              } else {
                  // 4/4, 2/4, 3/4, standard stuff
                  tempBeatGroups.push([2, 8]);
              }
              return tempBeatGroups;
          }
          /**
           * Compute the Beat Group according to this time signature for VexFlow. For beaming.
           *
           * @memberof music21.meter.TimeSignature
           * @param {Vex} Vex - a reference to the Vex object
           * @returns {Array<Vex.Flow.Fraction>} a list of numerator and denominator groups, for VexFlow
           */

      }, {
          key: 'vexflowBeatGroups',
          value: function vexflowBeatGroups() {
              var tempBeatGroups = void 0;
              if (this.beatGroups.length > 0) {
                  tempBeatGroups = this.beatGroups;
              } else {
                  tempBeatGroups = this.computeBeatGroups();
              }
              // console.log(tempBeatGroups);
              var vfBeatGroups = [];
              for (var i = 0; i < tempBeatGroups.length; i++) {
                  var bg = tempBeatGroups[i];
                  vfBeatGroups.push(new Vex.Flow.Fraction(bg[0], bg[1]));
              }
              return vfBeatGroups;

              //  if (numBeats % 3 == 0 && beatValue < 4) {
              //  // 6/8, 3/8, 9/8, etc.
              //  numBeats = numBeats / 3;
              //  beatValue = beatValue / 3;
              //  }
          }
      }, {
          key: 'numerator',
          get: function get() {
              return this._numerator;
          },
          set: function set(s) {
              this._numerator = s;
          }
      }, {
          key: 'denominator',
          get: function get() {
              return this._denominator;
          },
          set: function set(s) {
              this._denominator = s;
          }
      }, {
          key: 'ratioString',
          get: function get() {
              return this.numerator.toString() + '/' + this.denominator.toString();
          },
          set: function set(meterString) {
              var meterList = meterString.split('/');
              this.numerator = parseInt(meterList[0]);
              this.denominator = parseInt(meterList[1]);
          }
      }, {
          key: 'barDuration',
          get: function get() {
              var ql = 4.0 * this._numerator / this._denominator;
              return new duration.Duration(ql);
          }
      }]);
      return TimeSignature;
  }(base.Music21Object);

  meter.TimeSignature = TimeSignature;

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
  var RenderOptions = function RenderOptions() {
      classCallCheck(this, RenderOptions);

      var defaultOptions = {
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
          staffPadding: 60, // width...
          events: {
              'click': 'play',
              'dblclick': undefined
              // resize
          },
          startNewSystem: false,
          startNewPage: false,
          showMeasureNumber: undefined
      };
      common.merge(this, defaultOptions);
  };
  renderOptions.RenderOptions = RenderOptions;

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
  var ScrollPlayer = function () {
      function ScrollPlayer(s, c) {
          classCallCheck(this, ScrollPlayer);

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
          this.scrollScore = function scrollScore() {
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

              // console.log(x);

              if (x > this.lastX) {
                  this.barDOM.setAttribute('x', x);
                  this.lastX = x;
              }
              // pm is a pixelMap not a Stream
              for (var j = 0; j < pm.allMaps.length; j++) {
                  var pmOff = pm.allMaps[j].offset;
                  if (j <= this.lastNoteIndex) {
                      continue;
                  } else if (Math.abs(offset - pmOff) > 0.1) {
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
              // console.log(x, offset);
              // console.log(barDOM.setAttribute);
              var newTimeout = void 0;
              if (x < pm.maxX || systemIndex < pm.maxSystemIndex) {
                  // console.log(x, pm.maxX);
                  newTimeout = setTimeout(this.scrollScore, this.timingMS);
                  this.lastTimeout = newTimeout;
              } else {
                  var fauxEvent = undefined;
                  this.stopPlaying(fauxEvent);
              }
          }.bind(this);
      }

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


      createClass(ScrollPlayer, [{
          key: 'createScrollBar',
          value: function createScrollBar() {
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
              barDOM.setAttribute('transform', 'scale(' + scaleY + ')');
              svgDOM.appendChild(barDOM);

              var canvasParent = $$1(canvas).parent()[0];
              canvasParent.appendChild(svgDOM);
              this.barDOM = barDOM;
              this.svgDOM = svgDOM;
              this.canvasParent = canvasParent;
              this.eachSystemHeight = eachSystemHeight;
              return barDOM;
          }

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

      }, {
          key: 'startPlaying',
          value: function startPlaying() {
              this.createScrollBar();

              this.savedRenderOptionClick = this.stream.renderOptions.events.click;
              this.stream.renderOptions.events.click = function startPlayingClick(e) {
                  this.stopPlaying(e);
              }.bind(this);
              this.stream.setRenderInteraction(this.canvasParent);
              this.scrollScore();
          }

          /**
           * Called when the ScrollPlayer should stop playing
           *
           * @memberof music21.streamInteraction.ScrollPlayer
           * @param {DOMEvent} [event]
           */

      }, {
          key: 'stopPlaying',
          value: function stopPlaying(event) {
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
          }
      }]);
      return ScrollPlayer;
  }();
  streamInteraction.ScrollPlayer = ScrollPlayer;

  /**
   * A `PixelMapper` is an object that knows how to map offsets to pixels on a flat Stream.
   *
   * Helper for ScrollPlayer and soon other places...
   *
   * @class PixelMapper
   * @memberof music21.streamInteraction
   * @param {music21.stream.Stream} s - stream object
   * @property {Array<music21.streamInteraction.PixelMap>} allMaps - a `PixelMap` object
   *     for each offset in the Stream and one additional one for the end of the Stream.
   * @property {music21.stream.Stream} s - stream object
   * @property {music21.stream.Stream} notesAndRests - `this.stream.flat.notesAndRests`
   * @property {number} pixelScaling - `this.stream.renderOptions.scaleFactor.x`
   * @property {number} startX - (readonly) starting x
   * @property {number} maxX - (readonly) ending x
   * @property {Int} maxSystemIndex - the index of the last system.
   */
  var PixelMapper = function () {
      function PixelMapper(s) {
          classCallCheck(this, PixelMapper);

          this.allMaps = [];
          this.stream = s;
          this.notesAndRests = this.stream.flat.notesAndRests;
          this.pixelScaling = s.renderOptions.scaleFactor.x;
          this.processStream(s);
      }

      createClass(PixelMapper, [{
          key: 'processStream',

          /**
           * Creates `PixelMap` objects for every note in the stream, and an extra
           * one mapping the end of the final offset.
           *
           * @memberof music21.streamInteraction.PixelMapper
           * @returns {Array<music21.streamInteraction.PixelMap>}
           */
          value: function processStream() {
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
          }

          /**
           * Adds a {@link music21.base.Music21Object}, usually a {@link music21.note.Note} object,
           * to the maps for the PixelMapper if a {@link music21.streamInteraction.PixelMap} object
           * already exists at that location, or creates a new `PixelMap` if one does not exist.
           *
           * @memberof music21.streamInteraction.PixelMapper
           * @param {music21.base.Music21Object} n - note or other object
           * @returns {music21.streamInteraction.PixelMap} PixelMap added to.
           */

      }, {
          key: 'addNoteToMap',
          value: function addNoteToMap(n) {
              var currentOffset = n.offset;
              var properMap = this.findMapForExactOffset(currentOffset);
              if (properMap !== undefined) {
                  properMap.elements.push(n);
                  return properMap;
              } else {
                  var pmap = new streamInteraction.PixelMap(this, currentOffset);
                  pmap.elements = [n];
                  this.allMaps.push(pmap);
                  return pmap;
              }
          }
          /**
           * Finds a `PixelMap` object if one matches this exact offset. Otherwise returns undefined
           *
           * @memberof music21.streamInteraction.PixelMapper
           * @param {number} o offset
           * @returns {music21.streamInteraction.PixelMap|undefined}
           */

      }, {
          key: 'findMapForExactOffset',
          value: function findMapForExactOffset(o) {
              for (var j = this.allMaps.length - 1; j >= 0; j -= 1) {
                  // find the last map with this offset. searches backwards for speed.
                  if (this.allMaps[j].offset === o) {
                      return this.allMaps[j];
                  }
              }
              return undefined;
          }

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

      }, {
          key: 'getPixelMapsAroundOffset',
          value: function getPixelMapsAroundOffset(offset) {
              var prevNoteMap = void 0;
              var nextNoteMap = void 0;
              for (var i = 0; i < this.allMaps.length; i++) {
                  var thisMap = this.allMaps[i];
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
          }
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

      }, {
          key: 'getXAtOffset',
          value: function getXAtOffset(offset) {
              // returns the proper
              var twoNoteMaps = this.getPixelMapsAroundOffset(offset);
              var prevNoteMap = twoNoteMaps[0];
              var nextNoteMap = twoNoteMaps[1];
              var pixelScaling = this.pixelScaling;
              var offsetFromPrev = offset - prevNoteMap.offset;
              var offsetDistance = nextNoteMap.offset - prevNoteMap.offset;
              var pixelDistance = nextNoteMap.x - prevNoteMap.x;
              if (nextNoteMap.systemIndex !== prevNoteMap.systemIndex) {
                  var stave = prevNoteMap.elements[0].activeVexflowNote.stave;
                  pixelDistance = (stave.x + stave.width) * pixelScaling - prevNoteMap.x;
              }
              var offsetToPixelScale = 0;
              if (offsetDistance !== 0) {
                  offsetToPixelScale = pixelDistance / offsetDistance;
              } else {
                  offsetToPixelScale = 0;
              }
              var pixelsFromPrev = offsetFromPrev * offsetToPixelScale;
              var offsetX = prevNoteMap.x + pixelsFromPrev;
              return offsetX / pixelScaling;
          }

          /**
           * Uses the stored offsetToPixelMaps to get the systemIndex active at the current time.
           *
           * @memberof music21.streamInteraction.PixelMapper
           * @param {number} offset
           * @returns {number} systemIndex of the offset
           */

      }, {
          key: 'getSystemIndexAtOffset',
          value: function getSystemIndexAtOffset(offset) {
              var twoNoteMaps = this.getPixelMapsAroundOffset(offset);
              var prevNoteMap = twoNoteMaps[0];
              return prevNoteMap.systemIndex;
          }
      }, {
          key: 'startX',
          get: function get() {
              return this.allMaps[0].x;
          }
      }, {
          key: 'maxX',
          get: function get() {
              var m = this.allMaps[this.allMaps.length - 1];
              return m.x;
          }
      }, {
          key: 'maxSystemIndex',
          get: function get() {
              return this.allMaps[this.allMaps.length - 1].systemIndex;
          }
      }]);
      return PixelMapper;
  }();
  streamInteraction.PixelMapper = PixelMapper;

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
  var PixelMap = function () {
      function PixelMap(mapper, offset) {
          classCallCheck(this, PixelMap);

          this.pixelScaling = mapper.pixelScaling; // should be a Weakref...
          this.elements = [];
          this.offset = offset; // important
          this._x = undefined;
          this._systemIndex = undefined;
      }

      createClass(PixelMap, [{
          key: 'x',
          get: function get() {
              if (this._x !== undefined) {
                  return this._x;
              } else if (this.elements.length === 0) {
                  return 0; // error!
              } else {
                  return this.elements[0].x * this.pixelScaling;
              }
          },
          set: function set(x) {
              this._x = x;
          }
      }, {
          key: 'systemIndex',
          get: function get() {
              if (this._systemIndex !== undefined) {
                  return this._systemIndex;
              } else if (this.elements.length === 0) {
                  return 0; // error!
              } else {
                  return this.elements[0].systemIndex;
              }
          },
          set: function set(systemIndex) {
              this._systemIndex = systemIndex;
          }
      }]);
      return PixelMap;
  }();
  streamInteraction.PixelMap = PixelMap;

  /*  NOT DONE YET */
  var CursorSelect = function CursorSelect(s) {
      classCallCheck(this, CursorSelect);

      this.stream = s;
      this.activeElementHierarchy = [undefined];
  };
  streamInteraction.CursorSelect = CursorSelect;

  var SimpleNoteEditor = function () {
      function SimpleNoteEditor(s) {
          classCallCheck(this, SimpleNoteEditor);

          this.stream = s;
          this.activeNote = undefined;
          this.changedCallbackFunction = undefined; // for editable canvases
      }

      /**
       * A function bound to the current stream that
       * will changes the stream. Used in editableAccidentalCanvas, among other places.
       *
       *      var can = s.appendNewCanvas();
       *      $(can).on('click', s.changeClickedNoteFromEvent);
       *
       * @memberof music21.stream.Stream
       * @param {Event} e
       * @returns {music21.base.Music21Object|undefined} - returns whatever changedCallbackFunction does.
       */


      createClass(SimpleNoteEditor, [{
          key: 'changeClickedNoteFromEvent',
          value: function changeClickedNoteFromEvent(e) {
              var canvasElement = e.currentTarget;

              var _findNoteForClick = this.findNoteForClick(canvasElement, e),
                  _findNoteForClick2 = slicedToArray(_findNoteForClick, 2),
                  clickedDiatonicNoteNum = _findNoteForClick2[0],
                  foundNote = _findNoteForClick2[1];

              if (foundNote === undefined) {
                  if (debug) {
                      console.log('No note found');
                  }
                  return undefined;
              }
              return this.noteChanged(clickedDiatonicNoteNum, foundNote, canvasElement);
          }

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

      }, {
          key: 'noteChanged',
          value: function noteChanged(clickedDiatonicNoteNum, foundNote, canvas) {
              var n = foundNote;
              var p = new pitch.Pitch('C');
              p.diatonicNoteNum = clickedDiatonicNoteNum;
              p.accidental = n.pitch.accidental;
              n.pitch = p;
              n.stemDirection = undefined;
              this.activeNote = n;
              this.stream.redrawCanvas(canvas);
              if (this.changedCallbackFunction !== undefined) {
                  return this.changedCallbackFunction({ foundNote: n, canvas: canvas });
              } else {
                  return undefined;
              }
          }

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

      }, {
          key: 'findNoteForClick',
          value: function findNoteForClick(canvas, e, x, y) {
              if (x === undefined || y === undefined) {
                  var _getScaledXYforCanvas = this.getScaledXYforCanvas(canvas, e);

                  var _getScaledXYforCanvas2 = slicedToArray(_getScaledXYforCanvas, 2);

                  x = _getScaledXYforCanvas2[0];
                  y = _getScaledXYforCanvas2[1];
              }
              var clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(y);
              var foundNote = this.noteElementFromScaledX(x);
              return [clickedDiatonicNoteNum, foundNote];
          }
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

      }, {
          key: 'diatonicNoteNumFromScaledY',
          value: function diatonicNoteNumFromScaledY(yPxScaled) {
              var storedVFStave = this.stream.recursiveGetStoredVexflowStave();
              // for (var i = -10; i < 10; i++) {
              //    console.log("line: " + i + " y: " + storedVFStave.getYForLine(i));
              // }
              var lineSpacing = storedVFStave.options.spacing_between_lines_px;
              var linesAboveStaff = storedVFStave.options.space_above_staff_ln;

              var notesFromTop = yPxScaled * 2 / lineSpacing;
              var notesAboveLowestLine = (storedVFStave.options.num_lines - 1 + linesAboveStaff) * 2 - notesFromTop;
              var clickedDiatonicNoteNum = this.stream.clef.lowestLine + Math.round(notesAboveLowestLine);
              return clickedDiatonicNoteNum;
          }
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

      }, {
          key: 'noteElementFromScaledX',
          value: function noteElementFromScaledX(xPxScaled, allowablePixels, unused_systemIndex) {
              var s = this.stream;
              var foundNote = void 0;
              if (allowablePixels === undefined) {
                  allowablePixels = 10;
              }

              for (var i = 0; i < s.length; i++) {
                  var n = s.get(i);
                  /* should also
                   * compensate for accidentals...
                   */
                  if (xPxScaled > n.x - allowablePixels && xPxScaled < n.x + n.width + allowablePixels) {
                      foundNote = n;
                      break; /* O(n); can be made O(log n) */
                  }
              }
              // console.log(n.pitch.nameWithOctave);
              return foundNote;
          }

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

      }, {
          key: 'getScaledXYforCanvas',
          value: function getScaledXYforCanvas(canvas, e) {
              var _getUnscaledXYforCanv = this.getUnscaledXYforCanvas(canvas, e),
                  _getUnscaledXYforCanv2 = slicedToArray(_getUnscaledXYforCanv, 2),
                  xPx = _getUnscaledXYforCanv2[0],
                  yPx = _getUnscaledXYforCanv2[1];

              var pixelScaling = this.stream.renderOptions.scaleFactor;

              var yPxScaled = yPx / pixelScaling.y;
              var xPxScaled = xPx / pixelScaling.x;
              return [xPxScaled, yPxScaled];
          }
          /**
           * Given a mouse click, or other event with .pageX and .pageY,
           * find the x and y for the canvas.
           *
           * @memberof music21.stream.Stream
           * @param {DOMObject} canvas
           * @param {Event} e
           * @returns {Array<number>} two-elements, [x, y] in pixels.
           */

      }, {
          key: 'getUnscaledXYforCanvas',
          value: function getUnscaledXYforCanvas(canvas, e) {
              var offset = null;
              if (canvas === undefined) {
                  offset = { left: 0, top: 0 };
              } else {
                  offset = $$1(canvas).offset();
              }
              /*
               * mouse event handler code from: http://diveintohtml5.org/canvas.html
               */
              var xClick = void 0;
              var yClick = void 0;
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
          }

          /**
           * Renders a stream on a canvas with the ability to edit it and
           * a toolbar that allows the accidentals to be edited.
           *
           * @memberof music21.stream.Stream
           * @param {number} [width]
           * @param {number} [height]
           * @returns {DOMObject} &lt;div&gt; tag around the canvas.
           */

      }, {
          key: 'editableAccidentalCanvas',
          value: function editableAccidentalCanvas(width, height) {
              /*
               * Create an editable canvas with an accidental selection bar.
               */
              var d = $$1('<div/>').css('text-align', 'left').css('position', 'relative');
              var buttonDiv = this.getAccidentalToolbar();
              d.append(buttonDiv);
              d.append($$1("<br clear='all'/>"));
              this.activateClick();
              this.stream.appendNewCanvas(d, width, height);
              return d;
          }

          /**
           * activateClick - sets the stream's renderOptions to activate clickFunction.
           *
           * @param  {undefined|function} clickFunction  arrow function to be called
           *                                              (default changeClickedNoteFromEvent)
           * @return {undefined}
           */

      }, {
          key: 'activateClick',
          value: function activateClick(clickFunction) {
              var _this = this;

              if (clickFunction === undefined) {
                  clickFunction = function clickFunction(e) {
                      return _this.changeClickedNoteFromEvent(e);
                  };
              }
              this.stream.renderOptions.events.click = function (e) {
                  return clickFunction(e);
              };
          }
          /**
           *
           * @memberof music21.stream.Stream
           * @param {Int} minAccidental - alter of the min accidental (default -1)
           * @param {Int} maxAccidental - alter of the max accidental (default 1)
           * @param {jQueryObject} $siblingCanvas - canvas to use for redrawing;
           * @returns {jQueryObject} the accidental toolbar.
           */

      }, {
          key: 'getAccidentalToolbar',
          value: function getAccidentalToolbar(minAccidental, maxAccidental, $siblingCanvas) {
              var _this2 = this;

              if (minAccidental === undefined) {
                  minAccidental = -1;
              }
              if (maxAccidental === undefined) {
                  maxAccidental = 1;
              }
              minAccidental = Math.round(minAccidental);
              maxAccidental = Math.round(maxAccidental);

              var $buttonDiv = $$1('<div/>').attr('class', 'accidentalToolbar scoreToolbar');

              var _loop = function _loop(i) {
                  var acc = new pitch.Accidental(i);
                  $buttonDiv.append($$1('<button>' + acc.unicodeModifier + '</button>').click(function (e) {
                      return _this2.addAccidental(i, e, $siblingCanvas);
                  }));
              };

              for (var i = minAccidental; i <= maxAccidental; i++) {
                  _loop(i);
              }
              return $buttonDiv;
          }
      }, {
          key: 'addAccidental',
          value: function addAccidental(newAlter, clickEvent, $useCanvas) {
              /*
               * To be called on a button...
               */
              if ($useCanvas === undefined) {
                  var $searchParent = $$1(clickEvent.target).parent();
                  while ($searchParent !== undefined && ($useCanvas === undefined || $useCanvas[0] === undefined)) {
                      $useCanvas = $searchParent.find('canvas');
                      $searchParent = $searchParent.parent();
                  }
                  if ($useCanvas[0] === undefined) {
                      console.log('Could not find a canvas...');
                      return;
                  }
              }
              if (this.activeNote !== undefined) {
                  var n = this.activeNote;
                  n.pitch.accidental = new pitch.Accidental(newAlter);
                  /* console.log(n.pitch.name); */
                  this.stream.redrawCanvas($useCanvas[0]);
                  if (this.changedCallbackFunction !== undefined) {
                      this.changedCallbackFunction({ canvas: $useCanvas[0] });
                  }
              }
          }
      }]);
      return SimpleNoteEditor;
  }();

  streamInteraction.SimpleNoteEditor = SimpleNoteEditor;

  var GrandStaffEditor = function GrandStaffEditor(s) {
      classCallCheck(this, GrandStaffEditor);

      this.stream = s;
      if (s.elements.length !== 2) {
          throw new StreamException('Stream must be a grand staff!');
      }
  };

  streamInteraction.GrandStaffEditor = GrandStaffEditor;

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
   * @property {Array<music21.stream.Stream>} streams - {@link music21.stream.Stream} objects
   * associated with the voices
   * @property {Array} textVoices - Vex.Flow.Voice objects for the text.
   */
  var RenderStack = function () {
      function RenderStack() {
          classCallCheck(this, RenderStack);

          this.voices = [];
          this.streams = [];
          this.textVoices = [];
      }
      /**
       * @memberof music21.vfShow.RenderStack
       * @returns {Array} this.voices and this.textVoices as one array
       */


      createClass(RenderStack, [{
          key: 'allTickables',
          value: function allTickables() {
              var t = [];
              t.push.apply(t, toConsumableArray(this.voices));
              t.push.apply(t, toConsumableArray(this.textVoices));
              return t;
          }
          /**
           * @memberof music21.vfShow.RenderStack
           * @returns {Array<Array>} each array represents one staff....
           * where this.voices and this.textVoices are all in that staff...
           */

      }, {
          key: 'tickablesByStave',
          value: function tickablesByStave() {
              var tickablesByStave = []; // a list of lists of tickables being placed on the same Stave.
              var knownStaves = []; // a list of Vex.Flow.Stave objects...

              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = this.allTickables()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var t = _step.value;

                      var thisStaveIndex = knownStaves.indexOf(t.stave);
                      var currentStaveHolder = void 0;
                      if (thisStaveIndex === -1) {
                          knownStaves.push(t.stave);
                          currentStaveHolder = [];
                          tickablesByStave.push(currentStaveHolder);
                      } else {
                          currentStaveHolder = tickablesByStave[thisStaveIndex];
                      }
                      currentStaveHolder.push(t);
                  }
              } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                      }
                  } finally {
                      if (_didIteratorError) {
                          throw _iteratorError;
                      }
                  }
              }

              return tickablesByStave;
          }
      }]);
      return RenderStack;
  }();
  vfShow.RenderStack = RenderStack;

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
   * @property {Vex.Flow.Renderer} vfRenderer - a Vex.Flow.Renderer to use
   * (will create if not existing)
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
  var Renderer = function () {
      function Renderer(s, canvas, where) {
          classCallCheck(this, Renderer);

          this.stream = s;
          // this.streamType = s.classes[-1];

          this.canvas = undefined;
          this.$canvas = undefined;
          this.$where = undefined;
          this.activeFormatter = undefined;
          this._vfRenderer = undefined;
          this._ctx = undefined;
          this.beamGroups = [];
          this.stacks = []; // an Array of RenderStacks: {voices: [Array of Vex.Flow.Voice objects],
          //                                           streams: [Array of Streams, usually Measures]}
          this.ties = [];
          this.systemBreakOffsets = [];
          this.vfTuplets = [];
          // this.measureFormatters = [];
          if (where !== undefined) {
              if (where.jquery !== undefined) {
                  this.$where = where;
              } else {
                  this.$where = $$1(where);
              }
          }
          if (canvas !== undefined) {
              if (canvas.jquery !== undefined) {
                  this.$canvas = canvas;
                  this.canvas = canvas[0];
              } else {
                  this.canvas = canvas;
                  this.$canvas = $$1(canvas);
              }
          }
      }

      createClass(Renderer, [{
          key: 'render',

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
          value: function render(s) {
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
          }
          /**
           * Prepares a scorelike stream (i.e., one with parts or
           * Streams that should be rendered vertically like parts)
           * for rendering and adds Staff Connectors
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Score} s - prepare a stream of parts (i.e., Score)
           */

      }, {
          key: 'prepareScorelike',
          value: function prepareScorelike(s) {
              // console.log('prepareScorelike called');
              for (var i = 0; i < s.length; i++) {
                  var subStream = s.get(i);
                  this.preparePartlike(subStream);
              }
              this.addStaffConnectors(s);
          }
          /**
           *
           * Prepares a Partlike stream (that is one with Measures
           * or substreams that should be considered like Measures)
           * for rendering.
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Part} p
           */

      }, {
          key: 'preparePartlike',
          value: function preparePartlike(p) {
              // console.log('preparePartlike called');
              this.systemBreakOffsets = [];
              for (var i = 0; i < p.length; i++) {
                  var subStream = p.get(i);
                  if (subStream.renderOptions.startNewSystem) {
                      this.systemBreakOffsets.push(subStream.offset);
                  }
                  if (i === p.length - 1) {
                      subStream.renderOptions.rightBarline = 'end';
                  }
                  if (this.stacks[i] === undefined) {
                      this.stacks[i] = new vfShow.RenderStack();
                  }
                  this.prepareMeasure(subStream, this.stacks[i]);
              }
              this.prepareTies(p);
          }
          /**
           *
           * Prepares a score that arrived flat... sets up
           * stacks and ties after calling prepareFlat
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Stream} m - a flat stream (maybe a measure or voice)
           */

      }, {
          key: 'prepareArrivedFlat',
          value: function prepareArrivedFlat(m) {
              var stack = new vfShow.RenderStack();
              this.prepareMeasure(m, stack);
              this.stacks[0] = stack;
              this.prepareTies(m);
          }
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

      }, {
          key: 'prepareMeasure',
          value: function prepareMeasure(m, stack) {
              if (m.hasVoices === undefined || m.hasVoices() === false) {
                  this.prepareFlat(m, stack);
              } else {
                  // TODO: don't assume that all elements are Voices;
                  var stave = void 0;
                  var rendOp = m.renderOptions; // get render options from Measure;
                  for (var voiceIndex = 0; voiceIndex < m.length; voiceIndex++) {
                      var voiceStream = m.get(voiceIndex);
                      stave = this.prepareFlat(voiceStream, stack, stave, rendOp);
                  }
              }
              return stack;
          }
          /**
           * Main internal routine to prepare a flat stream
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Stream} s - a flat stream object
           * @param {music21.vfShow.RenderStack} stack - a RenderStack object to prepare into.
           * @param {Vex.Flow.Stave} [optionalStave] - an optional existing stave.
           * @param {object} [optional_renderOp] - render options.
           * Passed to {@link music21.vfShow.Renderer#renderStave}
           * @returns {Vex.Flow.Stave} staff to return too
           * (also changes the `stack` parameter and runs `makeAccidentals` on s)
           */

      }, {
          key: 'prepareFlat',
          value: function prepareFlat(s, stack, optionalStave, optional_renderOp) {
              s.makeAccidentals();
              var stave = void 0;
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
          }
          /**
           * Render the Vex.Flow.Stave from a flat stream and draws it.
           *
           * Just draws the stave, not the notes, etc.
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Stream} [m=this.stream] - a flat stream
           * @param {object} [optional_rendOp] - render options, passed
           * to {@link music21.vfShow.Renderer#newStave} and {@link music21.vfShow.Renderer#setClefEtc}
           * @returns {Vex.Flow.Stave} stave
           */

      }, {
          key: 'renderStave',
          value: function renderStave(m, optional_rendOp) {
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
          }
          /**
           * Draws the Voices (music and text) from `this.stacks`
           *
           * @memberof music21.vfShow.Renderer
           */

      }, {
          key: 'drawMeasureStacks',
          value: function drawMeasureStacks() {
              var ctx = this.ctx;
              for (var i = 0; i < this.stacks.length; i++) {
                  var voices = this.stacks[i].allTickables();
                  for (var j = 0; j < voices.length; j++) {
                      var v = voices[j];
                      v.draw(ctx);
                  }
              }
          }
          /**
           * draws the tuplets.
           *
           * @memberof music21.vfShow.Renderer
           */

      }, {
          key: 'drawTuplets',
          value: function drawTuplets() {
              var ctx = this.ctx;
              this.vfTuplets.forEach(function (vft) {
                  vft.setContext(ctx).draw();
              });
          }
          /**
           * draws the ties
           *
           * @memberof music21.vfShow.Renderer
           */

      }, {
          key: 'drawTies',
          value: function drawTies() {
              var ctx = this.ctx;
              for (var i = 0; i < this.ties.length; i++) {
                  this.ties[i].setContext(ctx).draw();
              }
          }
          /**
           * Finds all tied notes and creates the proper Vex.Flow.StaveTie objects in
           * `this.ties`.
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Part} p - a Part or similar object
           */

      }, {
          key: 'prepareTies',
          value: function prepareTies(p) {
              var pf = p.flat.notesAndRests;
              // console.log('newSystemsAt', this.systemBreakOffsets);
              for (var i = 0; i < pf.length - 1; i++) {
                  var thisNote = pf.get(i);
                  if (thisNote.tie === undefined || thisNote.tie.type === 'stop') {
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
                      var vfTie = new Vex.Flow.StaveTie({
                          first_note: thisNote.activeVexflowNote,
                          last_note: nextNote.activeVexflowNote,
                          first_indices: [0],
                          last_indices: [0]
                      });
                      this.ties.push(vfTie);
                  } else {
                      // console.log('got me a tie across systemBreaks!');
                      var vfTie1 = new Vex.Flow.StaveTie({
                          first_note: thisNote.activeVexflowNote,
                          first_indices: [0]
                      });
                      this.ties.push(vfTie1);
                      var vfTie2 = new Vex.Flow.StaveTie({
                          last_note: nextNote.activeVexflowNote,
                          first_indices: [0]
                      });
                      this.ties.push(vfTie2);
                  }
              }
          }
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

      }, {
          key: 'getVoice',
          value: function getVoice(s, stave) {
              if (s === undefined) {
                  s = this.stream;
              }

              // gets a group of notes as a voice, but completely unformatted and not drawn.
              var notes = this.vexflowNotes(s, stave);
              var voice = this.vexflowVoice(s);
              voice.setStave(stave);

              voice.addTickables(notes);
              return voice;
          }
          /**
           * Returns a Vex.Flow.Voice with the lyrics set to render in the proper place.
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Stream} s -- usually a Measure or Voice
           * @param {Vex.Flow.Stave} stave
           * @returns {Vex.Flow.Voice}
           */

      }, {
          key: 'getLyricVoice',
          value: function getLyricVoice(s, stave) {
              var textVoice = this.vexflowVoice(s);
              var lyrics = this.vexflowLyrics(s, stave);
              textVoice.setStave(stave);
              textVoice.addTickables(lyrics);
              return textVoice;
          }
          /**
           * Aligns all of `this.stacks` (after they've been prepared) so they align properly.
           *
           * @memberof music21.vfShow.Renderer
           */

      }, {
          key: 'formatMeasureStacks',
          value: function formatMeasureStacks() {
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
          }
          /**
           * Formats a single voice group from a stack.
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.vfShow.RenderStack} stack
           * @param {Boolean} [autoBeam=measures[0].autoBeam]
           * @returns {Vex.Flow.Formatter}
           */

      }, {
          key: 'formatVoiceGroup',
          value: function formatVoiceGroup(stack, autoBeam) {
              // formats a group of voices to use the same formatter; returns the formatter
              // if autoBeam is true then it will apply beams for each voice and put them in
              // this.beamGroups;
              var allTickables = stack.allTickables();
              var voices = stack.voices;
              var measures = stack.streams;
              if (autoBeam === undefined) {
                  autoBeam = measures[0].autoBeam;
              }

              var formatter = new Vex.Flow.Formatter();
              // var minLength = formatter.preCalculateMinTotalWidth([voices]);
              // console.log(minLength);
              if (voices.length === 0) {
                  return formatter;
              }
              var maxGlyphStart = 0; // find the stave with the farthest start point -- diff key sig, etc.
              for (var i = 0; i < allTickables.length; i++) {
                  // console.log(voices[i], voices[i].stave, i);
                  if (allTickables[i].stave.getNoteStartX() > maxGlyphStart) {
                      maxGlyphStart = allTickables[i].stave.getNoteStartX();
                  }
              }
              for (var _i = 0; _i < allTickables.length; _i++) {
                  allTickables[_i].stave.setNoteStartX(maxGlyphStart); // corrected!
              }
              // TODO: should do the same for end_x -- for key sig changes, etc...

              var stave = voices[0].stave; // all staves should be same length, so does not matter;
              var tickablesByStave = stack.tickablesByStave();
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = tickablesByStave[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var staveTickables = _step2.value;

                      formatter.joinVoices(staveTickables);
                  }
              } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                          _iterator2.return();
                      }
                  } finally {
                      if (_didIteratorError2) {
                          throw _iteratorError2;
                      }
                  }
              }

              formatter.formatToStave(allTickables, stave);
              if (autoBeam) {
                  for (var _i2 = 0; _i2 < voices.length; _i2++) {
                      var _beamGroups;

                      // find beam groups -- n.b. this wipes out stemDirection. worth it usually...
                      var voice = voices[_i2];
                      var beatGroups = [new Vex.Flow.Fraction(2, 8)]; // default beam groups
                      if (measures[_i2] !== undefined && measures[_i2].timeSignature !== undefined) {
                          beatGroups = measures[_i2].timeSignature.vexflowBeatGroups(Vex);
                          // TODO: getContextByClass...
                          // console.log(beatGroups);
                      }
                      var beamGroups = Vex.Flow.Beam.applyAndGetBeams(voice, undefined, beatGroups);
                      (_beamGroups = this.beamGroups).push.apply(_beamGroups, toConsumableArray(beamGroups));
                  }
              }
              return formatter;
          }
          /**
           * Draws the beam groups.
           *
           * @memberof music21.vfShow.Renderer
           */

      }, {
          key: 'drawBeamGroups',
          value: function drawBeamGroups() {
              var ctx = this.ctx;
              for (var i = 0; i < this.beamGroups.length; i++) {
                  this.beamGroups[i].setContext(ctx).draw();
              }
          }
          /**
           * Return a new Vex.Flow.Stave object, which represents
           * a single MEASURE of notation in m21j
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Stream} s
           * @returns {Vex.Flow.Stave}
           */

      }, {
          key: 'newStave',
          value: function newStave(s, rendOp) {
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
              // console.log('streamLength: ' + streamLength);
              if (debug) {
                  console.log('creating new stave: left:' + left + ' top: ' + top + ' width: ' + width);
              }
              var stave = new Vex.Flow.Stave(left, top, width);
              return stave;
          }
          /**
           * Sets the number of stafflines, puts the clef on the Stave,
           * adds keySignature, timeSignature, and rightBarline
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Stream} s
           * @param {Vex.Flow.Stave} stave
           * @param {object} [rendOp=s.renderOptions] - a {@link music21.renderOptions.RenderOptions}
           * object that might have
           * `{showMeasureNumber: boolean, rightBarLine: string<{'single', 'double', 'end'}>}`
           */

      }, {
          key: 'setClefEtc',
          value: function setClefEtc(s, stave, rendOp) {
              if (rendOp === undefined) {
                  rendOp = s.renderOptions;
              }
              this.setStafflines(s, stave);
              if (rendOp.showMeasureNumber) {
                  stave.setMeasure(rendOp.measureIndex + 1);
              }
              if (rendOp.displayClef) {
                  var ottava = void 0;
                  var size = 'default';
                  if (s.clef.octaveChange === 1) {
                      ottava = '8va';
                  } else if (s.clef.octaveChange === -1) {
                      ottava = '8vb';
                  }
                  stave.addClef(s.clef.name, size, ottava);
              }
              if (s.keySignature !== undefined && rendOp.displayKeySignature) {
                  stave.addKeySignature(s.keySignature.vexflow());
              }

              if (s.timeSignature !== undefined && rendOp.displayTimeSignature) {
                  stave.addTimeSignature(s.timeSignature.numerator.toString() + '/' + s.timeSignature.denominator.toString()); // TODO: convertToVexflow...
              }
              if (rendOp.rightBarline !== undefined) {
                  var bl = rendOp.rightBarline;
                  var barlineMap = {
                      'single': 'SINGLE',
                      'double': 'DOUBLE',
                      'end': 'END'
                  };
                  var vxBL = barlineMap[bl];
                  if (vxBL !== undefined) {
                      stave.setEndBarType(Vex.Flow.Barline.type[vxBL]);
                  }
              }
          }
          /**
           * Sets the number of stafflines properly for the Stave object.
           *
           * This method does not just set Vex.Flow.Stave#setNumLines() except
           * if the number of lines is 0 or >=4, because the default in VexFlow is
           * to show the bottom(top?), not middle, lines and that looks bad.
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Stream} s - stream to get the `.staffLines`
           * from `s.renderOptions` from -- should allow for overriding.
           * @param {Vex.Flow.Stave} vexflowStave - stave to set the staff lines for.
           */

      }, {
          key: 'setStafflines',
          value: function setStafflines(s, vexflowStave) {
              var rendOp = s.renderOptions;
              if (rendOp.staffLines !== 5) {
                  if (rendOp.staffLines === 0) {
                      vexflowStave.setNumLines(0);
                  } else if (rendOp.staffLines === 1) {
                      // Vex.Flow.Stave.setNumLines hides all but the top line.
                      // this is better
                      vexflowStave.options.line_config = [{ visible: false }, { visible: false }, { visible: true }, // show middle
                      { visible: false }, { visible: false }];
                  } else if (rendOp.staffLines === 2) {
                      vexflowStave.options.line_config = [{ visible: false }, { visible: false }, { visible: true }, // show middle
                      { visible: true }, { visible: false }];
                  } else if (rendOp.staffLines === 3) {
                      vexflowStave.options.line_config = [{ visible: false }, { visible: true }, { visible: true }, // show middle
                      { visible: true }, { visible: false }];
                  } else {
                      vexflowStave.setNumLines(rendOp.staffLines);
                  }
              }
          }
          /**
           * Gets the Vex.Flow.StaveNote objects from a Stream.
           *
           * Also changes `this.vfTuplets`.
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Stream} [s=this.stream] - flat stream to find notes in
           * @param {Vex.Flow.Stave} stave - Vex.Flow.Stave to render notes on to.
           * @returns {Array<Vex.Flow.StaveNote>} notes to return
           */

      }, {
          key: 'vexflowNotes',
          value: function vexflowNotes(s, stave) {
              if (s === undefined) {
                  s = this.stream;
              }
              // runs on a flat stream, returns a list of voices...
              var notes = [];
              var vfTuplets = [];
              var activeTuplet = void 0;
              var activeTupletLength = 0.0;
              var activeTupletVexflowNotes = [];

              var options = { clef: s.clef, stave: stave };
              for (var i = 0; i < s.length; i++) {
                  var thisEl = s.get(i);
                  if (thisEl.isClassOrSubclass('GeneralNote') && thisEl.duration !== undefined) {
                      // sets thisEl.activeVexflowNote -- may be overwritten but not so fast...
                      var vfn = thisEl.vexflowNote(options);
                      if (vfn === undefined) {
                          console.error('Cannot create a vexflowNote from: ', thisEl);
                      }
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
                          // console.log(activeTupletLength, activeTuplet.totalTupletLength());
                          if (activeTupletLength >= activeTuplet.totalTupletLength() || Math.abs(activeTupletLength - activeTuplet.totalTupletLength()) < 0.001) {
                              // console.log(activeTupletVexflowNotes);
                              var tupletOptions = {
                                  num_notes: activeTuplet.numberNotesActual,
                                  notes_occupied: activeTuplet.numberNotesNormal };
                              // console.log('tupletOptions', tupletOptions);
                              var vfTuplet = new Vex.Flow.Tuplet(activeTupletVexflowNotes, tupletOptions);
                              if (activeTuplet.tupletNormalShow === 'ratio') {
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
                  var _vfTuplets;

                  (_vfTuplets = this.vfTuplets).push.apply(_vfTuplets, vfTuplets);
              }
              return notes;
          }

          /**
           * Gets an Array of `Vex.Flow.TextNote` objects from any lyrics found in s
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Stream} s - flat stream to search.
           * @param {Vex.Flow.Stave} stave
           * @returns {Array<Vex.Flow.TextNote>}
           */

      }, {
          key: 'vexflowLyrics',
          value: function vexflowLyrics(s, stave) {
              var getTextNote = function getTextNote(text, font, d) {
                  // console.log(text, font, d);
                  var t1 = new Vex.Flow.TextNote({
                      text: text,
                      font: font,
                      duration: d
                  }).setLine(11).setStave(stave).setJustification(Vex.Flow.TextNote.Justification.LEFT);
                  return t1;
              };

              if (s === undefined) {
                  s = this.stream;
              }
              var font = {
                  family: 'Serif',
                  size: 12,
                  weight: ''
              };
              // runs on a flat, gapless, no-overlap stream, returns a list of TextNote objects...
              var lyricsObjects = [];
              for (var i = 0; i < s.length; i++) {
                  var el = s.get(i);
                  var lyricsArray = el.lyrics;
                  var text = void 0;
                  var d = el.duration.vexflowDuration;
                  var addConnector = false;
                  if (lyricsArray.length === 0) {
                      text = '';
                  } else {
                      text = lyricsArray[0].text;
                      if (text === undefined) {
                          text = '';
                      }
                      if (lyricsArray[0].syllabic === 'middle' || lyricsArray[0].syllabic === 'begin') {
                          addConnector = ' ' + lyricsArray[0].lyricConnector;
                          var tempQl = el.duration.quarterLength / 2.0;
                          d = new duration.Duration(tempQl).vexflowDuration;
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
          }
          /**
           * Creates a Vex.Flow.Voice of the appropriate length given a Stream.
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Stream} s
           * @returns {Vex.Flow.Voice}
           */

      }, {
          key: 'vexflowVoice',
          value: function vexflowVoice(s) {
              var totalLength = s.duration.quarterLength;

              var num1024 = Math.round(totalLength / (1 / 256));
              var beatValue = 1024;

              if (num1024 % 512 === 0) {
                  beatValue = 2;
                  num1024 /= 512;
              } else if (num1024 % 256 === 0) {
                  beatValue = 4;
                  num1024 /= 256;
              } else if (num1024 % 128 === 0) {
                  beatValue = 8;
                  num1024 /= 128;
              } else if (num1024 % 64 === 0) {
                  beatValue = 16;
                  num1024 /= 64;
              } else if (num1024 % 32 === 0) {
                  beatValue = 32;
                  num1024 /= 32;
              } else if (num1024 % 16 === 0) {
                  beatValue = 64;
                  num1024 /= 16;
              } else if (num1024 % 8 === 0) {
                  beatValue = 128;
                  num1024 /= 8;
              } else if (num1024 % 4 === 0) {
                  beatValue = 256;
                  num1024 /= 4;
              } else if (num1024 % 2 === 0) {
                  beatValue = 512;
                  num1024 /= 2;
              }
              // console.log('creating voice');
              if (debug) {
                  console.log('New voice, num_beats: ' + num1024.toString() + ' beat_value: ' + beatValue.toString());
              }
              var vfv = new Vex.Flow.Voice({ num_beats: num1024,
                  beat_value: beatValue,
                  resolution: Vex.Flow.RESOLUTION });

              // from vexflow/src/voice.js
              //
              // Modes allow the addition of ticks in three different ways:
              //
              // STRICT: This is the default. Ticks must fill the voice.
              // SOFT:   Ticks can be added without restrictions.
              // FULL:   Ticks do not need to fill the voice, but can't exceed the maximum
              //         tick length.
              vfv.setMode(Vex.Flow.Voice.Mode.SOFT);
              return vfv;
          }
      }, {
          key: 'staffConnectorsMap',
          value: function staffConnectorsMap(connectorType) {
              var connectorMap = {
                  'brace': Vex.Flow.StaveConnector.type.BRACE,
                  'single': Vex.Flow.StaveConnector.type.SINGLE,
                  'double': Vex.Flow.StaveConnector.type.DOUBLE,
                  'bracket': Vex.Flow.StaveConnector.type.BRACKET
              };
              return connectorMap[connectorType];
          }

          /**
           * If a stream has parts (NOT CHECKED HERE) create and
           * draw an appropriate Vex.Flow.StaveConnector
           *
           * @memberof music21.vfShow.Renderer
           * @param {music21.stream.Score} s
           */

      }, {
          key: 'addStaffConnectors',
          value: function addStaffConnectors(s) {
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
                          var sc = new Vex.Flow.StaveConnector(topVFStaff, bottomVFStaff);
                          var scTypeM21 = s.renderOptions.staffConnectors[i];
                          var scTypeVF = this.staffConnectorsMap(scTypeM21);
                          sc.setType(scTypeVF);
                          sc.setContext(this.ctx);
                          sc.draw();
                      }
                  }
              }
          }

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

      }, {
          key: 'removeFormatterInformation',
          value: function removeFormatterInformation(s, recursive) {
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
          }

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

      }, {
          key: 'applyFormatterInformationToNotes',
          value: function applyFormatterInformationToNotes(stave, s, formatter) {
              if (s === undefined) {
                  s = this.stream;
              }
              var noteOffsetLeft = 0;
              // var staveHeight = 80;
              if (stave !== undefined) {
                  noteOffsetLeft = stave.start_x + stave.glyph_start_x;
                  if (debug) {
                      console.log('noteOffsetLeft: ' + noteOffsetLeft + ' ; stave.start_x: ' + stave.start_x);
                      console.log('Bottom y: ' + stave.getBottomY());
                  }
                  // staveHeight = stave.height;
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
                      var formatterNote = formatter.tickContexts.map[String(nextTicks)];
                      nextTicks += nTicks;
                      el.x = vfn.getAbsoluteX();
                      // these are a bit hacky...
                      el.systemIndex = s.renderOptions.systemIndex;

                      // console.log(i + " " + el.x + " " + formatterNote.x + " " + noteOffsetLeft);
                      if (formatterNote === undefined) {
                          continue;
                      }

                      el.width = formatterNote.width;
                      if (el.pitch !== undefined) {
                          // note only...
                          el.y = stave.getBottomY() - (s.clef.lowestLine - el.pitch.diatonicNoteNum) * stave.options.spacing_between_lines_px;
                          // console.log('Note DNN: ' + el.pitch.diatonicNoteNum + " ; y: " + el.y);
                      }
                  }
              }
              if (debug) {
                  for (var _i3 = 0; _i3 < s.length; _i3++) {
                      var n = s.get(_i3);
                      if (n.pitch !== undefined) {
                          console.log(n.pitch.diatonicNoteNum + ' ' + n.x + ' ' + (n.x + n.width));
                      }
                  }
              }
              s.storedVexflowStave = stave;
          }
      }, {
          key: 'vfRenderer',
          get: function get() {
              if (this._vfRenderer !== undefined) {
                  return this._vfRenderer;
              } else {
                  this._vfRenderer = new Vex.Flow.Renderer(this.canvas, Vex.Flow.Renderer.Backends.CANVAS);
                  return this._vfRenderer;
              }
          },
          set: function set(vfr) {
              this._vfRenderer = vfr;
          }
      }, {
          key: 'ctx',
          get: function get() {
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
          set: function set(ctx) {
              this._ctx = ctx;
          }
      }]);
      return Renderer;
  }();
  vfShow.Renderer = Renderer;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/stream -- Streams -- objects that hold other Music21Objects
   *
   * Does not implement the full features of music21p Streams by a long shot...
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006-16, Michael Scott Cuthbert and cuthbertLab
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
  var Stream = function (_base$Music21Object) {
      inherits(Stream, _base$Music21Object);

      function Stream() {
          classCallCheck(this, Stream);

          var _this = possibleConstructorReturn(this, (Stream.__proto__ || Object.getPrototypeOf(Stream)).call(this));

          _this.classes.push('Stream');
          _this.isStream = true;
          _this._duration = undefined;

          _this._elements = [];
          _this._elementOffsets = [];
          _this._clef = undefined;
          _this.displayClef = undefined;

          _this._keySignature = undefined; // a music21.key.KeySignature object
          _this._timeSignature = undefined; // a music21.meter.TimeSignature object
          _this._instrument = undefined;

          _this._autoBeam = undefined;
          _this.activeVFStave = undefined;
          _this.renderOptions = new renderOptions.RenderOptions();
          _this._tempo = undefined;

          _this.staffLines = 5;

          _this._stopPlaying = false;
          _this._allowMultipleSimultaneousPlays = true; // not implemented yet.
          _this.changedCallbackFunction = undefined; // for editable canvases
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
          _this.canvasChangerFunction = function (e) {
              var canvasElement = e.currentTarget;

              var _this$findNoteForClic = _this.findNoteForClick(canvasElement, e),
                  _this$findNoteForClic2 = slicedToArray(_this$findNoteForClic, 2),
                  clickedDiatonicNoteNum = _this$findNoteForClic2[0],
                  foundNote = _this$findNoteForClic2[1];

              if (foundNote === undefined) {
                  if (debug) {
                      console.log('No note found');
                  }
                  return undefined;
              }
              return _this.noteChanged(clickedDiatonicNoteNum, foundNote, canvasElement);
          };
          return _this;
      }

      createClass(Stream, [{
          key: 'clone',


          /* override protoM21Object.clone() */
          value: function clone(deep) {
              var ret = Object.create(this.constructor.prototype);
              for (var key in this) {
                  if ({}.hasOwnProperty.call(this, key) === false) {
                      continue;
                  }
                  if (key === 'activeSite') {
                      ret[key] = this[key];
                  } else if (key === 'renderOptions') {
                      ret[key] = common.merge({}, this[key]);
                  } else if (deep !== true && (key === '_elements' || key === '_elementOffsets')) {
                      ret[key] = this[key].slice(); // shallow copy...
                  } else if (deep && (key === '_elements' || key === '_elementOffsets')) {
                      if (key === '_elements') {
                          // console.log('got elements for deepcopy');
                          ret._elements = [];
                          ret._elementOffsets = [];
                          for (var j = 0; j < this._elements.length; j++) {
                              ret._elementOffsets[j] = this._elementOffsets[j];
                              var el = this._elements[j];
                              // console.log('cloning el: ', el.name);
                              var elCopy = el.clone(deep);
                              elCopy.activeSite = ret;
                              ret._elements[j] = elCopy;
                          }
                      }
                  } else if (key === 'activeVexflowNote' || key === 'storedVexflowstave') {
                      // do nothing -- do not copy vexflowNotes -- permanent recursion
                  } else if (Object.getOwnPropertyDescriptor(this, key).get !== undefined || Object.getOwnPropertyDescriptor(this, key).set !== undefined) {
                      // do nothing
                  } else if (typeof this[key] === 'function') {
                      // do nothing -- events might not be copied.
                  } else if (this[key] !== null && this[key] !== undefined && this[key].isMusic21Object === true) {
                      // console.log('cloning...', key);
                      ret[key] = this[key].clone(deep);
                  } else {
                      ret[key] = this[key];
                  }
              }
              return ret;
          }

          /**
           * Add an element to the end of the stream, setting its `.offset` accordingly
           *
           * @memberof music21.stream.Stream
           * @param {music21.base.Music21Object} el - element to append
           * @returns {this}
           */

      }, {
          key: 'append',
          value: function append(el) {
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
                  console.error('Cannot append element ', el, ' to stream ', this, ' : ', err);
              }
              return this;
          }

          /**
           * Add an element to the specified place in the stream, setting its `.offset` accordingly
           *
           * @memberof music21.stream.Stream
           * @param {number} offset - offset to place.
           * @param {music21.base.Music21Object} el - element to append
           * @returns {this}
           */

      }, {
          key: 'insert',
          value: function insert(offset, el) {
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
                          return this;
                      }
                  }
                  // no element found. insert at end;
                  this._elementOffsets.push(offset);
                  this._elements.push(el);
                  el.offset = offset;
                  el.activeSite = this; // would prefer weakref, but does not exist in JS.
              } catch (err) {
                  console.error('Cannot insert element ', el, ' to stream ', this, ' : ', err);
              }
              return this;
          }

          /**
           * Remove and return the last element in the stream, or return undefined if the stream is empty
           *
           * @memberof music21.stream.Stream
           * @returns {music21.base.Music21Object|undefined} last element in the stream
           */

      }, {
          key: 'pop',
          value: function pop() {
              // remove last element;
              if (this.length > 0) {
                  var el = this.get(-1);
                  this._elementOffsets.pop();
                  this._elements.pop();
                  return el;
              } else {
                  return undefined;
              }
          }

          /**
           * Get the `index`th element from the Stream.  Equivalent to the
           * music21p format of s[index].  Can use negative indexing to get from the end.
           *
           * @memberof music21.stream.Stream
           * @param {Int} index - can be -1, -2, to index from the end, like python
           * @returns {music21.base.Music21Object|undefined}
           */

      }, {
          key: 'get',
          value: function get(index) {
              // substitute for Python stream __getitem__; supports -1 indexing, etc.
              var el = void 0;
              if (index === undefined) {
                  return undefined;
              } else if (Math.abs(index) > this._elements.length) {
                  return undefined;
              } else if (index === this._elements.length) {
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
          }
          /*  --- ############# END ELEMENT FUNCTIONS ########## --- */

          /**
           * Returns Boolean about whether this stream contains any other streams.
           *
           * @memberof music21.stream.Stream
           * @returns {Boolean}
           */

      }, {
          key: 'hasSubStreams',
          value: function hasSubStreams() {
              var hasSubStreams = false;
              for (var i = 0; i < this.length; i++) {
                  var el = this.elements[i];
                  if (el.isClassOrSubclass('Stream')) {
                      hasSubStreams = true;
                      break;
                  }
              }
              return hasSubStreams;
          }
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

      }, {
          key: 'makeMeasures',
          value: function makeMeasures(options) {
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
              var voiceCount = void 0;
              if (this.hasVoices()) {
                  voiceCount = this.getElementsByClass('Voice').length;
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
              for (var i = 0; i < offsetMap.length; i++) {
                  if (offsetMap[i].endTime > oMax) {
                      oMax = offsetMap[i].endTime;
                  }
              }
              // console.log('oMax: ', oMax);
              var post = new this.constructor();
              // derivation
              var o = 0.0;
              var measureCount = 0;
              var lastTimeSignature = void 0;
              var m = void 0;
              var mStart = void 0;
              while (measureCount === 0 || o < oMax) {
                  m = new stream.Measure();
                  m.number = measureCount + 1;
                  // var thisTimeSignature = meterStream.getElementAtOrBefore(o);
                  var thisTimeSignature = this.timeSignature;
                  if (thisTimeSignature === undefined) {
                      break;
                  }
                  var oneMeasureLength = thisTimeSignature.barDuration.quarterLength;
                  if (oneMeasureLength === 0) {
                      // if for some reason we are advancing not at all, then get out!
                      break;
                  }
                  if (measureCount === 0) {
                      // simplified...
                  }
                  m.clef = clefObj;
                  m.timeSignature = thisTimeSignature.clone();

                  for (var voiceIndex = 0; voiceIndex < voiceCount; voiceIndex++) {
                      var v = new stream.Voice();
                      v.id = voiceIndex;
                      m.insert(0, v);
                  }
                  post.insert(o, m);
                  o += oneMeasureLength;
                  measureCount += 1;
              }
              for (var _i = 0; _i < offsetMap.length; _i++) {
                  var ob = offsetMap[_i];
                  var e = ob.element;
                  var start = ob.offset;
                  var _voiceIndex = ob.voiceIndex;

                  // if 'Spanner' in e.classes;
                  lastTimeSignature = undefined;
                  for (var j = 0; j < post.length; j++) {
                      m = post.get(j); // nothing but measures...
                      if (m.timeSignature !== undefined) {
                          lastTimeSignature = m.timeSignature;
                      }
                      mStart = m.getOffsetBySite(post);
                      var mEnd = mStart + lastTimeSignature.barDuration.quarterLength;
                      if (start >= mStart && start < mEnd) {
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
                  if (_voiceIndex !== undefined) {
                      insertStream = m.getElementsByClass('Voice').get(_voiceIndex);
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
                  for (var _i2 = 0; _i2 < post.length; _i2++) {
                      var _e = post.get(_i2);
                      this.insert(_e.offset, _e);
                  }
                  return this; // javascript style;
              }
          }

          /**
           * Returns true if any note in the stream has lyrics, otherwise false
           *
           * @memberof music21.stream.Stream
           * @returns {Boolean}
           */

      }, {
          key: 'hasLyrics',
          value: function hasLyrics() {
              for (var i = 0; i < this.length; i++) {
                  var el = this.elements[i];
                  if (el.lyric !== undefined) {
                      return true;
                  }
              }
              return false;
          }

          /**
           * Returns a list of OffsetMap objects
           *
           * @memberof music21.stream.Stream
           * @returns [music21.stream.OffsetMap]
           */

      }, {
          key: 'offsetMap',
          value: function offsetMap() {
              var offsetMap = [];
              var groups = [];
              if (this.hasVoices()) {
                  $$1.each(this.getElementsByClass('Voice').elements, function (i, v) {
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
          }

          /**
           * Find all elements with a certain class; if an Array is given, then any
           * matching class will work.
           *
           * @memberof music21.stream.Stream
           * @param {Array<string>|string} classList - a list of classes to find
           * @returns {music21.stream.Stream}
           */

      }, {
          key: 'getElementsByClass',
          value: function getElementsByClass(classList) {
              var tempEls = [];
              for (var i = 0; i < this.length; i++) {
                  var thisEl = this.get(i);
                  // console.warn(thisEl);
                  if (thisEl.isClassOrSubclass === undefined) {
                      console.err('what the hell is a ', thisEl, 'doing in a Stream?');
                  } else if (thisEl.isClassOrSubclass(classList)) {
                      tempEls.push(thisEl);
                  }
              }
              var newSt = new stream.Stream(); // TODO: take Stream class Part, etc.
              newSt.elements = tempEls;
              return newSt;
          }
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

      }, {
          key: 'makeAccidentals',
          value: function makeAccidentals() {
              // cheap version of music21p method
              var extendableStepList = {};
              var stepNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
              for (var i = 0; i < stepNames.length; i++) {
                  var stepName = stepNames[i];
                  var stepAlter = 0;
                  if (this.keySignature !== undefined) {
                      var tempAccidental = this.keySignature.accidentalByStep(stepName);
                      if (tempAccidental !== undefined) {
                          stepAlter = tempAccidental.alter;
                          // console.log(stepAlter + " " + stepName);
                      }
                  }
                  extendableStepList[stepName] = stepAlter;
              }
              var lastOctaveStepList = [];
              var lastStepDict = void 0;
              var p = void 0;
              for (var _i3 = 0; _i3 < 10; _i3++) {
                  lastStepDict = $$1.extend({}, extendableStepList);
                  lastOctaveStepList.push(lastStepDict);
              }
              var lastOctavelessStepDict = $$1.extend({}, extendableStepList); // probably unnecessary, but safe...
              for (var _i4 = 0; _i4 < this.length; _i4++) {
                  var el = this.get(_i4);
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
          }

          //  returns pitch

      }, {
          key: '_makeAccidentalForOnePitch',
          value: function _makeAccidentalForOnePitch(p, lastStepDict, lastOctavelessStepDict) {
              var newAlter = void 0;
              if (p.accidental === undefined) {
                  newAlter = 0;
              } else {
                  newAlter = p.accidental.alter;
              }
              // console.log(p.name + " " + lastStepDict[p.step].toString());
              if (lastStepDict[p.step] !== newAlter || lastOctavelessStepDict[p.step] !== newAlter) {
                  if (p.accidental === undefined) {
                      p.accidental = new pitch.Accidental('natural');
                  }
                  p.accidental.displayStatus = true;
                  // console.log("setting displayStatus to true");
              } else if (lastStepDict[p.step] === newAlter && lastOctavelessStepDict[p.step] === newAlter) {
                  if (p.accidental !== undefined) {
                      p.accidental.displayStatus = false;
                  }
                  // console.log("setting displayStatus to false");
              }
              lastStepDict[p.step] = newAlter;
              lastOctavelessStepDict[p.step] = newAlter;
              return p;
          }

          /**
           * Sets the render options for any substreams (such as placing them
           * in systems, etc.) DOES NOTHING for music21.stream.Stream, but is
           * overridden in subclasses.
           *
           * @memberof music21.stream.Stream
           * @returns {music21.stream.Stream} this
           */

      }, {
          key: 'setSubstreamRenderOptions',
          value: function setSubstreamRenderOptions() {
              /* does nothing for standard streams ... */
              return this;
          }
          /**
           * Resets all the RenderOptions back to defaults. Can run recursively
           * and can also preserve the `RenderOptions.events` object.
           *
           * @memberof music21.stream.Stream
           * @param {Boolean} [recursive=false]
           * @param {Boolean} [preserveEvents=false]
           * @returns {music21.stream.Stream} this
           */

      }, {
          key: 'resetRenderOptions',
          value: function resetRenderOptions(recursive, preserveEvents) {
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
          }

          //  * *********  VexFlow functionality

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

      }, {
          key: 'renderVexflowOnCanvas',
          value: function renderVexflowOnCanvas(canvas) {
              if (canvas.jquery) {
                  canvas = canvas[0];
              }
              var vfr = new vfShow.Renderer(this, canvas);
              vfr.render();
              canvas.storedStream = this;
              this.setRenderInteraction(canvas);
              return this;
          }

          /**
           * Estimate the stream height for the Stream.
           *
           * If there are systems they will be incorporated into the height unless `ignoreSystems` is `true`.
           *
           * @memberof music21.stream.Stream
           * @param {Boolean} [ignoreSystems=false]
           * @returns {number} height in pixels
           */

      }, {
          key: 'estimateStreamHeight',
          value: function estimateStreamHeight(ignoreSystems) {
              var staffHeight = this.renderOptions.naiveHeight;
              var systemPadding = this.systemPadding;
              var numSystems = void 0;
              if (this.isClassOrSubclass('Score')) {
                  var numParts = this.length;
                  numSystems = this.numSystems();
                  if (numSystems === undefined || ignoreSystems) {
                      numSystems = 1;
                  }
                  var scoreHeight = numSystems * staffHeight * numParts + (numSystems - 1) * systemPadding;
                  // console.log('scoreHeight of ' + scoreHeight);
                  return scoreHeight;
              } else if (this.isClassOrSubclass('Part')) {
                  numSystems = 1;
                  if (!ignoreSystems) {
                      numSystems = this.numSystems();
                  }
                  if (debug) {
                      console.log('estimateStreamHeight for Part: numSystems [' + numSystems + '] * staffHeight [' + staffHeight + '] + (numSystems [' + numSystems + '] - 1) * systemPadding [' + systemPadding + '].');
                  }
                  return numSystems * staffHeight + (numSystems - 1) * systemPadding;
              } else {
                  return staffHeight;
              }
          }

          /**
           * Estimates the length of the Stream in pixels.
           *
           * @memberof music21.stream.Stream
           * @returns {number} length in pixels
           */

      }, {
          key: 'estimateStaffLength',
          value: function estimateStaffLength() {
              var i = void 0;
              var totalLength = void 0;
              if (this.renderOptions.overriddenWidth !== undefined) {
                  // console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
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
                  totalLength += rendOp.displayClef ? 30 : 0;
                  totalLength += rendOp.displayKeySignature && this.keySignature ? this.keySignature.width : 0;
                  totalLength += rendOp.displayTimeSignature ? 30 : 0;
                  // totalLength += rendOp.staffPadding;
                  return totalLength;
              }
          }

          //  * ***** MIDI related routines...

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

      }, {
          key: 'playStream',
          value: function playStream(options) {
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

              var playNext = function playNext(elements, params) {
                  if (currentNote < lastNote && !thisStream._stopPlaying) {
                      var el = elements[currentNote];
                      var nextNote = void 0;
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
                  } else if (params && params.done) {
                      params.done.call();
                  }
              };
              playNext(flatEls, params);
              return this;
          }

          /**
           * Stops a stream from playing if it currently is.
           *
           * @memberof music21.stream.Stream
           * @returns {musci21.stream.Stream} this
           */

      }, {
          key: 'stopPlayStream',
          value: function stopPlayStream() {
              // turns off all currently playing MIDI notes (on any stream) and stops playback.
              this._stopPlaying = true;
              for (var i = 0; i < 127; i++) {
                  MIDI.noteOff(0, i, 0);
              }
              return this;
          }
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

      }, {
          key: 'createNewCanvas',
          value: function createNewCanvas(width, height) {
              if (this.hasSubStreams()) {
                  this.setSubstreamRenderOptions();
              }

              var newCanvas = $$1('<canvas/>'); // .css('border', '1px red solid');

              if (width !== undefined) {
                  if (typeof width === 'string') {
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
                  var computedHeight = void 0;
                  if (this.renderOptions.height === undefined) {
                      computedHeight = this.estimateStreamHeight();
                      // console.log('computed Height estim: ' + computedHeight);
                  } else {
                      computedHeight = this.renderOptions.height;
                      // console.log('computed Height: ' + computedHeight);
                  }
                  newCanvas.attr('height', computedHeight * this.renderOptions.scaleFactor.y);
              }
              return newCanvas;
          }

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

      }, {
          key: 'createPlayableCanvas',
          value: function createPlayableCanvas(width, height) {
              this.renderOptions.events.click = 'play';
              return this.createCanvas(width, height);
          }

          /**
           * Creates a new canvas and renders vexflow on it
           *
           * @memberof music21.stream.Stream
           * @param {number|string|undefined} [width]
           * @param {number|string|undefined} [height]
           * @returns {JQueryDOMObject} canvas
           */

      }, {
          key: 'createCanvas',
          value: function createCanvas(width, height) {
              var $newCanvas = this.createNewCanvas(width, height);
              this.renderVexflowOnCanvas($newCanvas);
              return $newCanvas;
          }
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

      }, {
          key: 'appendNewCanvas',
          value: function appendNewCanvas(appendElement, width, height) {
              if (appendElement === undefined) {
                  appendElement = 'body';
              }
              var $appendElement = appendElement;
              if (appendElement.jquery === undefined) {
                  $appendElement = $$1(appendElement);
              }

              //      if (width === undefined && this.renderOptions.maxSystemWidth === undefined) {
              //      var $bodyElement = bodyElement;
              //      if (bodyElement.jquery === undefined) {
              //      $bodyElement = $(bodyElement);
              //      }
              //      width = $bodyElement.width();
              //      };

              var canvasBlock = this.createCanvas(width, height);
              $appendElement.append(canvasBlock);
              return canvasBlock[0];
          }

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

      }, {
          key: 'replaceCanvas',
          value: function replaceCanvas(where, preserveCanvasSize) {
              // if called with no where, replaces all the canvases on the page...
              if (where === undefined) {
                  where = 'body';
              }
              var $where = void 0;
              if (where.jquery === undefined) {
                  $where = $$1(where);
              } else {
                  $where = where;
                  where = $where[0];
              }
              var $oldCanvas = void 0;
              if ($where.prop('tagName') === 'CANVAS') {
                  $oldCanvas = $where;
              } else {
                  $oldCanvas = $where.find('canvas');
              }
              // TODO: Max Width!
              if ($oldCanvas.length === 0) {
                  throw new Music21Exception('No canvas defined for replaceCanvas!');
              } else if ($oldCanvas.length > 1) {
                  // change last canvas...
                  // replacing each with canvasBlock doesn't work
                  // anyhow, it just resizes the canvas but doesn't
                  // draw.
                  $oldCanvas = $$1($oldCanvas[$oldCanvas.length - 1]);
              }

              var canvasBlock = void 0;
              if (preserveCanvasSize) {
                  var width = $oldCanvas.width();
                  var height = $oldCanvas.height();
                  canvasBlock = this.createCanvas(width, height);
              } else {
                  canvasBlock = this.createCanvas();
              }

              $oldCanvas.replaceWith(canvasBlock);
              return canvasBlock;
          }

          /**
           * Renders a canvas which has a scrollbar when clicked.
           *
           * (this is a dumb way of doing this.  Expect it to disappear...)
           *
           * @memberof music21.stream.Stream
           * @param {JQueryDOMObject|DOMObject} [where]
           * @returns {DOMObject} canvas
           */

      }, {
          key: 'renderScrollableCanvas',
          value: function renderScrollableCanvas(where) {
              var $where = where;
              if (where === undefined) {
                  $where = $$1(document.body);
              } else if (where.jquery === undefined) {
                  $where = $$1(where);
              }
              var $innerDiv = $$1('<div>').css('position', 'absolute');
              var c = void 0;
              this.renderOptions.events.click = function renderOptionsOuterEventClick(storedThis) {
                  return function renderOptionsInnerEventClick(event) {
                      storedThis.scrollScoreStart(c, event);
                  };
              }(this); // create new function with this stream as storedThis
              c = this.appendNewCanvas($innerDiv);
              this.setRenderInteraction($innerDiv);
              $where.append($innerDiv);
              return c;
          }

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

      }, {
          key: 'scrollScoreStart',
          value: function scrollScoreStart(c, event) {
              var scrollPlayer = new streamInteraction.ScrollPlayer(this, c);
              scrollPlayer.startPlaying();
              if (event !== undefined) {
                  event.stopPropagation();
              }
              return scrollPlayer;
          }

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

      }, {
          key: 'setRenderInteraction',
          value: function setRenderInteraction(canvasOrDiv) {
              var $canvas = canvasOrDiv;
              if (canvasOrDiv === undefined) {
                  return this;
              } else if (canvasOrDiv.jquery === undefined) {
                  $canvas = $$1(canvasOrDiv);
              }
              // TODO: assumes that canvas has a .storedStream function? can this be done by setting
              // a variable var storedStream = this; and thus get rid of the assumption?
              var playFunc = function playStreamBound() {
                  this.playStream();
              }.bind(this);

              $$1.each(this.renderOptions.events, $$1.proxy(function setRenderInteractionProxy(eventType, eventFunction) {
                  $canvas.off(eventType);
                  if (typeof eventFunction === 'string' && eventFunction === 'play') {
                      $canvas.on(eventType, playFunc);
                  } else if (typeof eventFunction === 'string' && eventType === 'resize' && eventFunction === 'reflow') {
                      this.windowReflowStart($canvas);
                  } else if (eventFunction !== undefined) {
                      $canvas.on(eventType, eventFunction);
                  }
              }, this));
              return this;
          }

          /**
           *
           * Recursively search downward for the closest storedVexflowStave...
           *
           * @memberof music21.stream.Stream
           * @returns {Vex.Flow.Stave|undefined}
           */

      }, {
          key: 'recursiveGetStoredVexflowStave',
          value: function recursiveGetStoredVexflowStave() {
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
          }

          /**
           * Given a mouse click, or other event with .pageX and .pageY,
           * find the x and y for the canvas.
           *
           * @memberof music21.stream.Stream
           * @param {DOMObject} canvas
           * @param {Event} e
           * @returns {Array<number>} two-elements, [x, y] in pixels.
           */

      }, {
          key: 'getUnscaledXYforCanvas',
          value: function getUnscaledXYforCanvas(canvas, e) {
              var offset = null;
              if (canvas === undefined) {
                  offset = { left: 0, top: 0 };
              } else {
                  offset = $$1(canvas).offset();
              }
              /*
               * mouse event handler code from: http://diveintohtml5.org/canvas.html
               */
              var xClick = void 0;
              var yClick = void 0;
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
          }

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

      }, {
          key: 'getScaledXYforCanvas',
          value: function getScaledXYforCanvas(canvas, e) {
              var _getUnscaledXYforCanv = this.getUnscaledXYforCanvas(canvas, e),
                  _getUnscaledXYforCanv2 = slicedToArray(_getUnscaledXYforCanv, 2),
                  xPx = _getUnscaledXYforCanv2[0],
                  yPx = _getUnscaledXYforCanv2[1];

              var pixelScaling = this.renderOptions.scaleFactor;

              var yPxScaled = yPx / pixelScaling.y;
              var xPxScaled = xPx / pixelScaling.x;
              return [xPxScaled, yPxScaled];
          }
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

      }, {
          key: 'diatonicNoteNumFromScaledY',
          value: function diatonicNoteNumFromScaledY(yPxScaled) {
              var storedVFStave = this.recursiveGetStoredVexflowStave();
              // for (var i = -10; i < 10; i++) {
              //    console.log("line: " + i + " y: " + storedVFStave.getYForLine(i));
              // }
              var lineSpacing = storedVFStave.options.spacing_between_lines_px;
              var linesAboveStaff = storedVFStave.options.space_above_staff_ln;

              var notesFromTop = yPxScaled * 2 / lineSpacing;
              var notesAboveLowestLine = (storedVFStave.options.num_lines - 1 + linesAboveStaff) * 2 - notesFromTop;
              var clickedDiatonicNoteNum = this.clef.lowestLine + Math.round(notesAboveLowestLine);
              return clickedDiatonicNoteNum;
          }

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

      }, {
          key: 'noteElementFromScaledX',
          value: function noteElementFromScaledX(xPxScaled, allowablePixels, unused_systemIndex) {
              var foundNote = void 0;
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
              // console.log(n.pitch.nameWithOctave);
              return foundNote;
          }

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

      }, {
          key: 'findNoteForClick',
          value: function findNoteForClick(canvas, e, x, y) {
              if (x === undefined || y === undefined) {
                  var _getScaledXYforCanvas = this.getScaledXYforCanvas(canvas, e);

                  var _getScaledXYforCanvas2 = slicedToArray(_getScaledXYforCanvas, 2);

                  x = _getScaledXYforCanvas2[0];
                  y = _getScaledXYforCanvas2[1];
              }
              var clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(y);
              var foundNote = this.noteElementFromScaledX(x);
              return [clickedDiatonicNoteNum, foundNote];
          }

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

      }, {
          key: 'noteChanged',
          value: function noteChanged(clickedDiatonicNoteNum, foundNote, canvas) {
              var n = foundNote;
              var p = new pitch.Pitch('C');
              p.diatonicNoteNum = clickedDiatonicNoteNum;
              p.accidental = n.pitch.accidental;
              n.pitch = p;
              n.stemDirection = undefined;
              this.activeNote = n;
              this.redrawCanvas(canvas);
              if (this.changedCallbackFunction !== undefined) {
                  return this.changedCallbackFunction({ foundNote: n, canvas: canvas });
              } else {
                  return undefined;
              }
          }
          /**
           * Redraws a canvas, keeping the events of the previous canvas.
           *
           * @memberof music21.stream.Stream
           * @param {DOMObject} canvas
           * @returns {music21.stream.Stream} this
           */

      }, {
          key: 'redrawCanvas',
          value: function redrawCanvas(canvas) {
              // this.resetRenderOptions(true, true); // recursive, preserveEvents
              // this.setSubstreamRenderOptions();
              var $canvas = $$1(canvas); // works even if canvas is already $jquery
              var $newCanv = this.createNewCanvas(canvas.width, canvas.height);
              this.renderVexflowOnCanvas($newCanv);
              $canvas.replaceWith($newCanv);
              // this is no longer necessary.
              // common.jQueryEventCopy($.event, $canvas, $newCanv); /* copy events -- using custom extension... */
              return this;
          }

          /**
           * Renders a stream on a canvas with the ability to edit it and
           * a toolbar that allows the accidentals to be edited.
           *
           * @memberof music21.stream.Stream
           * @param {number} [width]
           * @param {number} [height]
           * @returns {DOMObject} &lt;div&gt; tag around the canvas.
           */

      }, {
          key: 'editableAccidentalCanvas',
          value: function editableAccidentalCanvas(width, height) {
              /*
               * Create an editable canvas with an accidental selection bar.
               */
              var d = $$1('<div/>').css('text-align', 'left').css('position', 'relative');
              var buttonDiv = this.getAccidentalToolbar();
              d.append(buttonDiv);
              d.append($$1("<br clear='all'/>"));
              this.renderOptions.events.click = this.canvasChangerFunction;
              this.appendNewCanvas(d, width, height); // var can =
              return d;
          }

          /*
           * Canvas toolbars...
           */

          /**
           *
           * @memberof music21.stream.Stream
           * @param {Int} minAccidental - alter of the min accidental (default -1)
           * @param {Int} maxAccidental - alter of the max accidental (default 1)
           * @param {jQueryObject} $siblingCanvas - canvas to use for redrawing;
           * @returns {jQueryObject} the accidental toolbar.
           */

      }, {
          key: 'getAccidentalToolbar',
          value: function getAccidentalToolbar(minAccidental, maxAccidental, $siblingCanvas) {
              var _this2 = this;

              if (minAccidental === undefined) {
                  minAccidental = -1;
              }
              if (maxAccidental === undefined) {
                  maxAccidental = 1;
              }
              minAccidental = Math.round(minAccidental);
              maxAccidental = Math.round(maxAccidental);

              var addAccidental = function addAccidental(newAlter, clickEvent) {
                  /*
                   * To be called on a button...
                   */
                  var $useCanvas = $siblingCanvas;
                  if ($useCanvas === undefined) {
                      var $searchParent = $$1(clickEvent.target).parent();
                      while ($searchParent !== undefined && ($useCanvas === undefined || $useCanvas[0] === undefined)) {
                          $useCanvas = $searchParent.find('canvas');
                          $searchParent = $searchParent.parent();
                      }
                      if ($useCanvas[0] === undefined) {
                          console.log('Could not find a canvas...');
                          return;
                      }
                  }
                  if (_this2.activeNote !== undefined) {
                      var n = _this2.activeNote;
                      n.pitch.accidental = new pitch.Accidental(newAlter);
                      /* console.log(n.pitch.name); */
                      _this2.redrawCanvas($useCanvas[0]);
                      if (_this2.changedCallbackFunction !== undefined) {
                          _this2.changedCallbackFunction({ canvas: $useCanvas[0] });
                      }
                  }
              };

              var $buttonDiv = $$1('<div/>').attr('class', 'accidentalToolbar scoreToolbar');

              var _loop = function _loop(i) {
                  var acc = new pitch.Accidental(i);
                  $buttonDiv.append($$1('<button>' + acc.unicodeModifier + '</button>').click(function (e) {
                      return addAccidental(i, e);
                  }
                  //                  .css('font-family', 'Bravura')
                  //                  .css('font-size', '40px')
                  ));
              };

              for (var i = minAccidental; i <= maxAccidental; i++) {
                  _loop(i);
              }
              return $buttonDiv;
          }
          /**
           *
           * @memberof music21.stream.Stream
           * @returns {jQueryObject} a Div containing two buttons -- play and stop
           */

      }, {
          key: 'getPlayToolbar',
          value: function getPlayToolbar() {
              var _this3 = this;

              var $buttonDiv = $$1('<div/>').attr('class', 'playToolbar scoreToolbar');
              var $bPlay = $$1('<button>&#9658</button>');
              $bPlay.click(function () {
                  _this3.playStream();
              });
              $buttonDiv.append($bPlay);
              var $bStop = $$1('<button>&#9724</button>');
              $bStop.click(function () {
                  _this3.stopPlayStream();
              });
              $buttonDiv.append($bStop);
              return $buttonDiv;
          }
          //  reflow

          /**
           * Begins a series of bound events to the window that makes it
           * so that on resizing the stream is redrawn and reflowed to the
           * new size.
           *
           * @memberof music21.stream.Stream
           * @param {JQueryDOMObject} jCanvas
           * @returns {music21.stream.Stream} this
           */

      }, {
          key: 'windowReflowStart',
          value: function windowReflowStart(jCanvas) {
              // set up a bunch of windowReflow bindings that affect the canvas.
              var callingStream = this;
              var jCanvasNow = jCanvas;
              $$1(window).bind('resizeEnd', function () {
                  // do something, window hasn't changed size in 500ms
                  var jCanvasParent = jCanvasNow.parent();
                  var newWidth = jCanvasParent.width();
                  var canvasWidth = newWidth;
                  // console.log(canvasWidth);
                  console.log('resizeEnd triggered', newWidth);
                  // console.log(callingStream.renderOptions.events.click);
                  callingStream.resetRenderOptions(true, true); // recursive, preserveEvents
                  // console.log(callingStream.renderOptions.events.click);
                  callingStream.maxSystemWidth = canvasWidth - 40;
                  jCanvasNow.remove();
                  var canvasObj = callingStream.appendNewCanvas(jCanvasParent);
                  jCanvasNow = $$1(canvasObj);
              });
              $$1(window).resize(function resizeCanvasTo() {
                  if (this.resizeTO) {
                      clearTimeout(this.resizeTO);
                  }
                  this.resizeTO = setTimeout(function resizeToTimeout() {
                      $$1(this).trigger('resizeEnd');
                  }, 200);
              });
              setTimeout(function triggerResizeOnCreateCanvas() {
                  var $window = $$1(window);
                  var doResize = $window.data('triggerResizeOnCreateCanvas');
                  if (doResize === undefined || doResize === true) {
                      $$1(this).trigger('resizeEnd');
                      $window.data('triggerResizeOnCreateCanvas', false);
                  }
              }, 1000);
              return this;
          }
          /**
           * Does this stream have a {@link music21.stream.Voice} inside it?
           *
           * @memberof music21.stream.Stream
           * @returns {Boolean}
           */

      }, {
          key: 'hasVoices',
          value: function hasVoices() {
              for (var i = 0; i < this.length; i++) {
                  var el = this.get(i);
                  if (el.isClassOrSubclass('Voice')) {
                      return true;
                  }
              }
              return false;
          }
      }, {
          key: 'duration',
          get: function get() {
              if (this._duration !== undefined) {
                  return this._duration;
              }
              return new duration.Duration(this.highestTime);
          },
          set: function set(newDuration) {
              this._duration = newDuration;
          }
      }, {
          key: 'highestTime',
          get: function get() {
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
              return highestTime;
          }
      }, {
          key: 'flat',
          get: function get() {
              if (this.hasSubStreams()) {
                  var tempEls = [];
                  for (var i = 0; i < this.length; i++) {
                      var el = this.get(i);
                      // console.log(i, this.length);
                      if (el.elements !== undefined) {
                          var offsetShift = el.offset;
                          // console.log('offsetShift', offsetShift, el.classes[el.classes.length -1]);
                          var elFlat = el.flat;
                          for (var j = 0; j < elFlat.length; j++) {
                              // offset should NOT be null because already in Stream
                              elFlat.get(j).offset += offsetShift;
                          }
                          tempEls.push.apply(tempEls, toConsumableArray(elFlat._elements));
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
      }, {
          key: 'notes',
          get: function get() {
              return this.getElementsByClass(['Note', 'Chord']);
          }
      }, {
          key: 'notesAndRests',
          get: function get() {
              return this.getElementsByClass('GeneralNote');
          }
      }, {
          key: 'tempo',
          get: function get() {
              if (this._tempo === undefined && this.activeSite !== undefined) {
                  return this.activeSite.tempo;
              } else if (this._tempo === undefined) {
                  return 150;
              } else {
                  return this._tempo;
              }
          },
          set: function set(newTempo) {
              this._tempo = newTempo;
          }
      }, {
          key: 'instrument',
          get: function get() {
              if (this._instrument === undefined && this.activeSite !== undefined) {
                  return this.activeSite.instrument;
              } else {
                  return this._instrument;
              }
          },
          set: function set(newInstrument) {
              if (typeof newInstrument === 'string') {
                  newInstrument = new instrument.Instrument(newInstrument);
              }
              this._instrument = newInstrument;
          }
      }, {
          key: 'clef',
          get: function get() {
              if (this._clef === undefined && this.activeSite === undefined) {
                  return new clef.Clef('treble');
              } else if (this._clef === undefined) {
                  return this.activeSite.clef;
              } else {
                  return this._clef;
              }
          },
          set: function set(newClef) {
              this._clef = newClef;
          }
      }, {
          key: 'keySignature',
          get: function get() {
              if (this._keySignature === undefined && this.activeSite !== undefined) {
                  return this.activeSite.keySignature;
              } else {
                  return this._keySignature;
              }
          },
          set: function set(newKeySignature) {
              this._keySignature = newKeySignature;
          }
      }, {
          key: 'timeSignature',
          get: function get() {
              if (this._timeSignature === undefined && this.activeSite !== undefined) {
                  return this.activeSite.timeSignature;
              } else {
                  return this._timeSignature;
              }
          },
          set: function set(newTimeSignature) {
              if (typeof newTimeSignature === 'string') {
                  newTimeSignature = new meter.TimeSignature(newTimeSignature);
              }
              this._timeSignature = newTimeSignature;
          }
      }, {
          key: 'autoBeam',
          get: function get() {
              if (this._autoBeam === undefined && this.activeSite !== undefined) {
                  return this.activeSite.autoBeam;
              } else if (this._autoBeam !== undefined) {
                  return this._autoBeam;
              } else {
                  return true; // default...
              }
          },
          set: function set(ab) {
              this._autoBeam = ab;
          }
      }, {
          key: 'maxSystemWidth',
          get: function get() {
              var baseMaxSystemWidth = 750;
              if (this.renderOptions.maxSystemWidth === undefined && this.activeSite !== undefined) {
                  baseMaxSystemWidth = this.activeSite.maxSystemWidth;
              } else if (this.renderOptions.maxSystemWidth !== undefined) {
                  baseMaxSystemWidth = this.renderOptions.maxSystemWidth;
              }
              return baseMaxSystemWidth / this.renderOptions.scaleFactor.x;
          },
          set: function set(newSW) {
              this.renderOptions.maxSystemWidth = newSW * this.renderOptions.scaleFactor.x;
          }
      }, {
          key: 'parts',
          get: function get() {
              var parts = [];
              for (var i = 0; i < this.length; i++) {
                  var el = this.get(i);
                  if (el.isClassOrSubclass('Part')) {
                      parts.push(el);
                  }
              }
              return parts;
          }
          /* TODO -- make it return a Stream.Part and not list. to match music21p
           * but okay for now */

      }, {
          key: 'measures',
          get: function get() {
              var measures = [];
              for (var i = 0; i < this.length; i++) {
                  var el = this.get(i);
                  if (el.isClassOrSubclass('Measure')) {
                      measures.push(el);
                  }
              }
              return measures;
          }
      }, {
          key: 'length',
          get: function get() {
              return this._elements.length;
          }
      }, {
          key: 'elements',
          get: function get() {
              return this._elements;
          },
          set: function set(newElements) {
              var highestOffsetSoFar = 0.0;
              this._elements = [];
              this._elementOffsets = [];
              var tempInsert = [];
              var i = void 0;
              var thisEl = void 0;
              for (i = 0; i < newElements.length; i++) {
                  thisEl = newElements[i];
                  var thisElOffset = thisEl.offset;
                  if (thisElOffset === null || thisElOffset === highestOffsetSoFar) {
                      // append
                      this._elements.push(thisEl);
                      thisEl.offset = highestOffsetSoFar;
                      this._elementOffsets.push(highestOffsetSoFar);
                      if (thisEl.duration === undefined) {
                          console.error('No duration for ', thisEl, ' in ', this);
                      }
                      highestOffsetSoFar += thisEl.duration.quarterLength;
                  } else {
                      // append -- slow
                      tempInsert.push(thisEl);
                  }
              }
              // console.warn('end', highestOffsetSoFar, tempInsert);
              for (i = 0; i < tempInsert.length; i++) {
                  thisEl = tempInsert[i];
                  this.insert(thisEl.offset, thisEl);
              }
          }
      }]);
      return Stream;
  }(base.Music21Object);
  stream.Stream = Stream;

  /**
   *
   * @class Voice
   * @memberof music21.stream
   * @extends music21.stream.Stream
   */
  var Voice = function (_Stream) {
      inherits(Voice, _Stream);

      function Voice() {
          classCallCheck(this, Voice);

          var _this4 = possibleConstructorReturn(this, (Voice.__proto__ || Object.getPrototypeOf(Voice)).call(this));

          _this4.classes.push('Voice');
          return _this4;
      }

      return Voice;
  }(Stream);
  stream.Voice = Voice;

  /**
   * @class Measure
   * @memberof music21.stream
   * @extends music21.stream.Stream
   */
  var Measure = function (_Stream2) {
      inherits(Measure, _Stream2);

      function Measure() {
          classCallCheck(this, Measure);

          var _this5 = possibleConstructorReturn(this, (Measure.__proto__ || Object.getPrototypeOf(Measure)).call(this));

          _this5.classes.push('Measure');
          _this5.number = 0; // measure number
          return _this5;
      }

      return Measure;
  }(Stream);
  stream.Measure = Measure;

  /**
   * Part -- specialized to handle Measures inside it
   *
   * @class Part
   * @memberof music21.stream
   * @extends music21.stream.Stream
   */
  var Part = function (_Stream3) {
      inherits(Part, _Stream3);

      function Part() {
          classCallCheck(this, Part);

          var _this6 = possibleConstructorReturn(this, (Part.__proto__ || Object.getPrototypeOf(Part)).call(this));

          _this6.classes.push('Part');
          _this6.systemHeight = _this6.renderOptions.naiveHeight;
          return _this6;
      }

      /**
       * How many systems does this Part have?
       *
       * Does not change any reflow information, so by default it's always 1.
       *
       * @memberof music21.stream.Part
       * @returns {Number}
       */


      createClass(Part, [{
          key: 'numSystems',
          value: function numSystems() {
              var numSystems = 1;
              var subStreams = this.getElementsByClass('Stream');
              for (var i = 1; i < subStreams.length; i++) {
                  if (subStreams.get(i).renderOptions.startNewSystem) {
                      numSystems += 1;
                  }
              }
              return numSystems;
          }

          /**
           * Find the width of every measure in the Part.
           *
           * @memberof music21.stream.Part
           * @returns {Array<number>}
           */

      }, {
          key: 'getMeasureWidths',
          value: function getMeasureWidths() {
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
          }
          /**
           * Overrides the default music21.stream.Stream#estimateStaffLength
           *
           * @memberof music21.stream.Part
           * @returns {number}
           */

      }, {
          key: 'estimateStaffLength',
          value: function estimateStaffLength() {
              if (this.renderOptions.overriddenWidth !== undefined) {
                  // console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
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
          }
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

      }, {
          key: 'fixSystemInformation',
          value: function fixSystemInformation(systemHeight) {
              /*
               * console.log('system height: ' + systemHeight);
               */
              if (systemHeight === undefined) {
                  systemHeight = this.systemHeight; /* part.show() called... */
              } else if (debug) {
                  console.log('overridden systemHeight: ' + systemHeight);
              }
              var systemPadding = this.renderOptions.systemPadding || this.renderOptions.naiveSystemPadding;
              var measureWidths = this.getMeasureWidths();
              var maxSystemWidth = this.maxSystemWidth; /* of course fix! */
              var systemCurrentWidths = [];
              var systemBreakIndexes = [];
              var lastSystemBreak = 0; /* needed to ensure each line has at least one measure */
              var startLeft = 20; /* TODO: make it obtained elsewhere */
              var currentLeft = startLeft;
              var i = void 0;
              for (i = 0; i < measureWidths.length; i++) {
                  var currentRight = currentLeft + measureWidths[i];
                  /* console.log("left: " + currentLeft + " ; right: " + currentRight + " ; m: " + i); */
                  if (currentRight > maxSystemWidth && lastSystemBreak !== i) {
                      systemBreakIndexes.push(i - 1);
                      systemCurrentWidths.push(currentLeft);

                      // console.log('setting new width at ' + currentLeft);
                      currentLeft = startLeft + measureWidths[i]; // 20 + this width;
                      lastSystemBreak = i;
                  } else {
                      currentLeft = currentRight;
                  }
              }
              // console.log(systemCurrentWidths);
              // console.log(systemBreakIndexes);

              var currentSystemIndex = 0;
              var leftSubtract = 0;
              var newLeftSubtract = void 0;
              for (i = 0; i < this.length; i++) {
                  var m = this.get(i);
                  if (m.renderOptions === undefined) {
                      continue;
                  }
                  if (i === 0) {
                      m.renderOptions.startNewSystem = true;
                  }
                  currentLeft = m.renderOptions.left;

                  if (systemBreakIndexes.indexOf(i - 1) !== -1) {
                      /* first measure of new System */
                      var oldWidth = m.renderOptions.width;
                      m.renderOptions.displayClef = true;
                      m.renderOptions.displayKeySignature = true;
                      m.renderOptions.startNewSystem = true;

                      var newWidth = m.estimateStaffLength() + m.renderOptions.staffPadding;
                      m.renderOptions.width = newWidth;
                      leftSubtract = currentLeft - 20;
                      // after this one, we'll have a new left subtract...
                      newLeftSubtract = leftSubtract - (newWidth - oldWidth);

                      currentSystemIndex += 1;
                  } else if (i !== 0) {
                      m.renderOptions.startNewSystem = false;
                      m.renderOptions.displayClef = false; // check for changed clef first?
                      m.renderOptions.displayKeySignature = false; // check for changed KS first?
                  }
                  m.renderOptions.systemIndex = currentSystemIndex;
                  var currentSystemMultiplier = void 0;
                  if (currentSystemIndex >= systemCurrentWidths.length) {
                      /* last system... non-justified */
                      currentSystemMultiplier = 1;
                  } else {
                      var currentSystemWidth = systemCurrentWidths[currentSystemIndex];
                      currentSystemMultiplier = maxSystemWidth / currentSystemWidth;
                      // console.log('systemMultiplier: ' + currentSystemMultiplier + ' max: ' + maxSystemWidth + ' current: ' + currentSystemWidth);
                  }
                  /* might make a small gap? fix? */
                  var newLeft = currentLeft - leftSubtract;
                  if (newLeftSubtract !== undefined) {
                      leftSubtract = newLeftSubtract;
                      newLeftSubtract = undefined;
                  }
                  // console.log('M: ' + i + ' ; old left: ' + currentLeft + ' ; new Left: ' + newLeft);
                  m.renderOptions.left = Math.floor(newLeft * currentSystemMultiplier);
                  m.renderOptions.width = Math.floor(m.renderOptions.width * currentSystemMultiplier);
                  var newTop = m.renderOptions.top + currentSystemIndex * (systemHeight + systemPadding);
                  // console.log('M: ' + i + '; New top: ' + newTop + " ; old Top: " + m.renderOptions.top);
                  m.renderOptions.top = newTop;
              }

              return systemCurrentWidths;
          }
          /**
           * overrides music21.stream.Stream#setSubstreamRenderOptions
           *
           * figures out the `.left` and `.top` attributes for all contained measures
           *
           * @memberof music21.stream.Part
           */

      }, {
          key: 'setSubstreamRenderOptions',
          value: function setSubstreamRenderOptions() {
              var currentMeasureIndex = 0; /* 0 indexed for now */
              var currentMeasureLeft = 20;
              var rendOp = this.renderOptions;
              var lastTimeSignature = void 0;
              var lastKeySignature = void 0;
              var lastClef = void 0;

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
                          if (el._clef !== undefined && lastClef !== undefined && el._clef.name !== lastClef.name) {
                              console.log('changing clefs for ', elRendOp.measureIndex, ' from ', lastClef.name, ' to ', el._clef.name);
                              lastClef = el._clef;
                              elRendOp.displayClef = true;
                          } else {
                              elRendOp.displayClef = false;
                          }

                          if (el._keySignature !== undefined && lastKeySignature !== undefined && el._keySignature.sharps !== lastKeySignature.sharps) {
                              lastKeySignature = el._keySignature;
                              elRendOp.displayKeySignature = true;
                          } else {
                              elRendOp.displayKeySignature = false;
                          }

                          if (el._timeSignature !== undefined && lastTimeSignature !== undefined && el._timeSignature.ratioString !== lastTimeSignature.ratioString) {
                              lastTimeSignature = el._timeSignature;
                              elRendOp.displayTimeSignature = true;
                          } else {
                              elRendOp.displayTimeSignature = false;
                          }
                      }
                      elRendOp.width = el.estimateStaffLength() + elRendOp.staffPadding;
                      elRendOp.height = el.estimateStreamHeight();
                      currentMeasureLeft += elRendOp.width;
                      currentMeasureIndex += 1;
                  }
              }
              return this;
          }
          /**
           * Overrides the default music21.stream.Stream#findNoteForClick
           * by taking into account systems
           *
           * @memberof music21.stream.Part
           * @param {DOMObject} canvas
           * @param {Event} e
           * @returns {Array} [clickedDiatonicNoteNum, foundNote]
           */

      }, {
          key: 'findNoteForClick',
          value: function findNoteForClick(canvas, e) {
              var _getScaledXYforCanvas3 = this.getScaledXYforCanvas(canvas, e),
                  _getScaledXYforCanvas4 = slicedToArray(_getScaledXYforCanvas3, 2),
                  x = _getScaledXYforCanvas4[0],
                  y = _getScaledXYforCanvas4[1];

              // debug = true;


              if (debug) {
                  console.log('this.estimateStreamHeight(): ' + this.estimateStreamHeight() + ' / $(canvas).height(): ' + $$1(canvas).height());
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
          }

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

      }, {
          key: 'noteElementFromScaledX',
          value: function noteElementFromScaledX(scaledX, allowablePixels, systemIndex) {
              var gotMeasure = void 0;
              for (var i = 0; i < this.length; i++) {
                  // TODO: if not measure, do not crash...
                  var m = this.get(i);
                  var rendOp = m.renderOptions;
                  var left = rendOp.left;
                  var right = left + rendOp.width;
                  var top = rendOp.top;
                  var bottom = top + rendOp.height;
                  if (debug) {
                      console.log('Searching for X:' + Math.round(scaledX) + ' in M ' + i + ' with boundaries L:' + left + ' R:' + right + ' T: ' + top + ' B: ' + bottom);
                  }
                  if (scaledX >= left && scaledX <= right) {
                      if (systemIndex === undefined) {
                          gotMeasure = m;
                          break;
                      } else if (rendOp.systemIndex === systemIndex) {
                          gotMeasure = m;
                          break;
                      }
                  }
              }
              if (gotMeasure) {
                  return gotMeasure.noteElementFromScaledX(scaledX, allowablePixels);
              } else {
                  return undefined;
              }
          }
      }]);
      return Part;
  }(Stream);
  stream.Part = Part;

  /**
   * Scores with multiple parts
   *
   * @class Score
   * @memberof music21.stream
   * @extends music21.stream.Stream
   */
  var Score = function (_Stream4) {
      inherits(Score, _Stream4);

      function Score() {
          classCallCheck(this, Score);

          var _this7 = possibleConstructorReturn(this, (Score.__proto__ || Object.getPrototypeOf(Score)).call(this));

          _this7.classes.push('Score');
          _this7.measureWidths = [];
          _this7.partSpacing = _this7.renderOptions.naiveHeight;
          return _this7;
      }

      createClass(Score, [{
          key: 'setSubstreamRenderOptions',


          /**
           * overrides music21.stream.Stream#setSubstreamRenderOptions
           *
           * figures out the `.left` and `.top` attributes for all contained parts
           *
           * @memberof music21.stream.Score
           * @returns {music21.stream.Score} this
           */
          value: function setSubstreamRenderOptions() {
              var currentPartNumber = 0;
              var currentPartTop = 0;
              var partSpacing = this.partSpacing;
              for (var i = 0; i < this.length; i++) {
                  var el = this.get(i);

                  if (el.isClassOrSubclass('Part')) {
                      el.renderOptions.partIndex = currentPartNumber;
                      el.renderOptions.top = currentPartTop;
                      el.setSubstreamRenderOptions();
                      currentPartTop += partSpacing;
                      currentPartNumber += 1;
                  }
              }
              this.evenPartMeasureSpacing();
              var ignoreNumSystems = true;
              var currentScoreHeight = this.estimateStreamHeight(ignoreNumSystems);
              for (var _i5 = 0; _i5 < this.length; _i5++) {
                  var _el = this.get(_i5);
                  if (_el.isClassOrSubclass('Part')) {
                      _el.fixSystemInformation(currentScoreHeight);
                  }
              }
              this.renderOptions.height = this.estimateStreamHeight();
              return this;
          }
          /**
           * Overrides the default music21.stream.Stream#estimateStaffLength
           *
           * @memberof music21.stream.Score
           * @returns {number}
           */

      }, {
          key: 'estimateStaffLength',
          value: function estimateStaffLength() {
              // override
              if (this.renderOptions.overriddenWidth !== undefined) {
                  // console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
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
          }

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

      }, {
          key: 'playStream',
          value: function playStream(params) {
              // play multiple parts in parallel...
              for (var i = 0; i < this.length; i++) {
                  var el = this.get(i);
                  if (el.isClassOrSubclass('Part')) {
                      el.playStream(params);
                  }
              }
              return this;
          }
          /**
           * Overrides the default music21.stream.Stream#stopPlayScore()
           *
           * @memberof music21.stream.Score
           * @returns {music21.stream.Score} this
           */

      }, {
          key: 'stopPlayStream',
          value: function stopPlayStream() {
              for (var i = 0; i < this.length; i++) {
                  var el = this.get(i);
                  if (el.isClassOrSubclass('Part')) {
                      el.stopPlayStream();
                  }
              }
              return this;
          }
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

      }, {
          key: 'getMaxMeasureWidths',
          value: function getMaxMeasureWidths() {
              var maxMeasureWidths = [];
              var measureWidthsArrayOfArrays = [];
              var i = void 0;
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
              // console.log(measureWidths);
              return maxMeasureWidths;
          }

          /**
           * @memberof music21.stream.Score
           * @param {DOMObject} canvas
           * @param {Event} e
           * @returns {Array} [diatonicNoteNum, m21Element]
           */

      }, {
          key: 'findNoteForClick',
          value: function findNoteForClick(canvas, e) {
              /**
               * Returns a list of [clickedDiatonicNoteNum, foundNote] for a
               * click event, taking into account that the note will be in different
               * Part objects (and different Systems) given the height and possibly different Systems.
               *
               */
              var _getScaledXYforCanvas5 = this.getScaledXYforCanvas(canvas, e),
                  _getScaledXYforCanvas6 = slicedToArray(_getScaledXYforCanvas5, 2),
                  x = _getScaledXYforCanvas6[0],
                  y = _getScaledXYforCanvas6[1];

              var numParts = this.parts.length;
              var systemHeight = numParts * this.partSpacing + this.systemPadding;
              var systemIndex = Math.floor(y / systemHeight);
              var scaledYFromSystemTop = y - systemIndex * systemHeight;
              var partIndex = Math.floor(scaledYFromSystemTop / this.partSpacing);
              var scaledYinPart = scaledYFromSystemTop - partIndex * this.partSpacing;
              // console.log('systemIndex: ' + systemIndex + " partIndex: " + partIndex);
              var rightPart = this.get(partIndex);
              var clickedDiatonicNoteNum = rightPart.diatonicNoteNumFromScaledY(scaledYinPart);

              var foundNote = rightPart.noteElementFromScaledX(x, undefined, systemIndex);
              return [clickedDiatonicNoteNum, foundNote];
          }

          /**
           * How many systems are there? Calls numSystems() on the first part.
           *
           * @memberof music21.stream.Score
           * @returns {Int}
           */

      }, {
          key: 'numSystems',
          value: function numSystems() {
              return this.getElementsByClass('Part').get(0).numSystems();
          }

          /**
           * Fixes the part measure spacing for all parts.
           *
           * @memberof music21.stream.Score
           * @returns {music21.stream.Score} this
           */

      }, {
          key: 'evenPartMeasureSpacing',
          value: function evenPartMeasureSpacing() {
              var measureStacks = [];
              var currentPartNumber = 0;
              var maxMeasureWidth = [];
              var i = void 0;
              var j = void 0;
              for (i = 0; i < this.length; i++) {
                  var el = this.get(i);
                  if (el.isClassOrSubclass('Part')) {
                      var measureWidths = el.getMeasureWidths();
                      for (j = 0; j < measureWidths.length; j++) {
                          var thisMeasureWidth = measureWidths[j];
                          if (measureStacks[j] === undefined) {
                              measureStacks[j] = [];
                              maxMeasureWidth[j] = thisMeasureWidth;
                          } else if (thisMeasureWidth > maxMeasureWidth[j]) {
                              maxMeasureWidth[j] = thisMeasureWidth;
                          }
                          measureStacks[j][currentPartNumber] = thisMeasureWidth;
                      }
                      currentPartNumber += 1;
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
          }
      }, {
          key: 'systemPadding',
          get: function get() {
              var numParts = this.parts.length;
              var systemPadding = this.renderOptions.systemPadding;
              if (systemPadding === undefined) {
                  if (numParts === 1) {
                      systemPadding = this.renderOptions.naiveSystemPadding; // fix to 0
                  } else {
                      systemPadding = this.renderOptions.naiveSystemPadding;
                  }
              }
              return systemPadding;
          }
      }]);
      return Score;
  }(Stream);
  stream.Score = Score;

  // small Class; a namedtuple in music21p
  var OffsetMap = function OffsetMap(element, offset, endTime, voiceIndex) {
      classCallCheck(this, OffsetMap);

      this.element = element;
      this.offset = offset;
      this.endTime = endTime;
      this.voiceIndex = voiceIndex;
  };
  stream.OffsetMap = OffsetMap;

  // future -- rewrite of Score and Part to Page, System, SystemPart
  // not currently used
  // import * as $ from 'jquery';
  //
  // import { base } from './base.js';
  // import { renderOptions } from './renderOptions.js';
  // import { common } from './common.js';
  /**
   * Does not work yet, so not documented
   *
   */
  var layout = {};
  layout.makeLayoutFromScore = function makeLayoutFromScore(score, containerWidth) {
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
      // var systemHeight = score.systemHeight; /* part.show() called... */
      // var systemPadding = score.systemPadding;
      var parts = score.parts;
      // console.log(parts);
      var numParts = parts.length;
      var partZero = parts[0];
      var numMeasures = partZero.length;

      var measureWidths = partZero.getMeasureWidths();
      var maxSystemWidth = containerWidth || score.maxSystemWidth; /* of course fix! */

      var layoutScore = new layout.LayoutScore();
      var currentPage = new layout.Page(); // to-do multiple pages...
      currentPage.measureStart = 1;
      currentPage.measureEnd = numMeasures;

      layoutScore.insert(0, currentPage);

      var currentSystem = new layout.System();
      var currentSystemNumber = 1;
      currentSystem.measureStart = 1;
      var currentStaves = [];

      var staffMaker = function staffMaker(staffHolder, numParts, measureStart) {
          for (var pNum = 0; pNum < numParts; pNum++) {
              var staff = new layout.Staff();
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
      // let currentSystemTop = 0;
      // var partTopOffsets = [];
      // const ignoreSystemsInCalculatingScoreHeight = true;
      // const systemHeight = score.estimateStreamHeight(ignoreSystemsInCalculatingScoreHeight);

      for (var i = 0; i < measureWidths.length; i++) {
          var currentRight = currentLeft + measureWidths[i];
          /* console.log("left: " + currentLeft + " ; right: " + currentRight + " ; m: " + i); */
          if (currentRight > maxSystemWidth && lastSystemBreak !== i) {
              // new system...
              for (var j = 0; j < currentStaves.length; j++) {
                  currentStaves.measureEnd = i;
                  currentSystem.insert(0, currentStaves[j]);
              }
              currentStaves = [];
              staffMaker(currentStaves, numParts, i + 1);
              // currentSystemTop += systemHeight;
              currentSystem.measureEnd = i;
              currentPage.insert(0, currentSystem);
              currentSystemNumber += 1;
              currentSystem = new layout.System();
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
      for (var _j = 0; _j < currentStaves.length; _j++) {
          currentStaves.measureEnd = measureWidths.length - 1;
          currentSystem.insert(0, currentStaves[_j]);
      }
      currentPage.insert(0, currentSystem);
      return layoutScore;
  };

  var LayoutScore = function (_stream$Score) {
      inherits(LayoutScore, _stream$Score);

      function LayoutScore() {
          classCallCheck(this, LayoutScore);

          var _this = possibleConstructorReturn(this, (LayoutScore.__proto__ || Object.getPrototypeOf(LayoutScore)).call(this));

          _this.classes.push('LayoutScore');
          _this.scoreLayout = undefined;
          _this.measureStart = undefined;
          _this.measureEnd = undefined;
          _this._width = undefined;
          _this.height = undefined;
          _this.top = 0;
          _this.left = 0;
          return _this;
      }

      createClass(LayoutScore, [{
          key: 'getPositionForStaff',

          /**
           * return a tuple of (top, bottom) for a staff, specified by a given pageId,
           * systemId, and staffId in PIXELS.
            * @param pageId
           * @param systemId
           * @param staffId
           * @param units -- "pixels" or "tenths" (not supported)
           */

          value: function getPositionForStaff(pageId, systemId, staffId, units) {
              units = units || 'pixels';
          }
      }, {
          key: 'pages',
          get: function get() {
              return this.getElementsByClass('Page');
          }
      }, {
          key: 'width',
          get: function get() {
              if (this._width) {
                  return this._width;
              } else if (this.activeSite) {
                  return this.activeSite.width;
              } else {
                  return undefined;
              }
          }
      }]);
      return LayoutScore;
  }(stream.Score);
  layout.LayoutScore = LayoutScore;

  /**
   * All music must currently be on page 1.
   */
  var Page = function (_stream$Score2) {
      inherits(Page, _stream$Score2);

      function Page() {
          classCallCheck(this, Page);

          var _this2 = possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).call(this));

          _this2.classes.push('Page');
          _this2.pageNumber = 1;
          _this2.measureStart = undefined;
          _this2.measureEnd = undefined;
          _this2.systemStart = undefined;
          _this2.systemEnd = undefined;
          _this2.pageLayout = undefined;
          return _this2;
      }

      createClass(Page, [{
          key: 'systems',
          get: function get() {
              return this.getElementsByClass('System');
          }
      }, {
          key: 'width',
          get: function get() {
              if (this._width) {
                  return this._width;
              } else if (this.activeSite) {
                  return this.activeSite.width;
              } else {
                  return undefined;
              }
          }
      }]);
      return Page;
  }(stream.Score);
  layout.Page = Page;

  var System = function (_stream$Score3) {
      inherits(System, _stream$Score3);

      function System() {
          classCallCheck(this, System);

          var _this3 = possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).call(this));

          _this3.classes.push('System');
          _this3.systemNumber = 1;
          _this3.systemLayout = undefined;
          _this3.measureStart = undefined;
          _this3.measureEnd = undefined;
          _this3._width = undefined;
          _this3.height = undefined;
          _this3.top = undefined;
          _this3.left = undefined;
          return _this3;
      }

      createClass(System, [{
          key: 'staves',
          get: function get() {
              return this.getElementsByClass('Staff');
          }
      }, {
          key: 'width',
          get: function get() {
              if (this._width) {
                  return this._width;
              } else if (this.activeSite) {
                  return this.activeSite.width;
              } else {
                  return undefined;
              }
          }
      }]);
      return System;
  }(stream.Score);
  layout.System = System;

  var Staff = function (_stream$Part) {
      inherits(Staff, _stream$Part);

      function Staff() {
          classCallCheck(this, Staff);

          var _this4 = possibleConstructorReturn(this, (Staff.__proto__ || Object.getPrototypeOf(Staff)).call(this));

          _this4.classes.push('Staff');
          _this4.staffNumber = 1;
          _this4.optimized = 0;
          _this4.top = undefined;
          _this4.left = undefined;
          _this4._width = undefined;
          _this4.height = undefined;
          _this4.inheritedHeight = undefined;
          _this4.staffLayout = undefined;
          return _this4;
      }

      createClass(Staff, [{
          key: 'width',
          get: function get() {
              if (this._width) {
                  return this._width;
              } else if (this.activeSite) {
                  return this.activeSite.width;
              } else {
                  return undefined;
              }
          }
      }]);
      return Staff;
  }(stream.Part);

  layout.Staff = Staff;

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
  var _tie = {};
  var VALID_TIE_TYPES = ['start', 'stop', 'continue', 'let-ring', undefined];

  /**
   * Tie class. Found in {@link music21.note.GeneralNote} `.tie`.
   *
   * Does not support advanced music21p values `.to` and `.from`
   *
   * @class Tie
   * @memberof music21.tie
   * @extends music21.prebase.ProtoM21Object
   * @param {string} type - 'start', 'stop', 'continue', or 'let-ring'
   * @property {string} type - the tie type
   * @property {string} style - only supports 'normal' for now.
   * @property {string|undefined} placement - undefined = unknown or above/below. (NB curently does nothing)
   */
  var Tie = function (_prebase$ProtoM21Obje) {
      inherits(Tie, _prebase$ProtoM21Obje);

      function Tie(type) {
          classCallCheck(this, Tie);

          var _this = possibleConstructorReturn(this, (Tie.__proto__ || Object.getPrototypeOf(Tie)).call(this));

          _this._type = undefined;
          _this.style = 'normal';
          _this.type = type;
          _this.placement = undefined;
          return _this;
      }

      createClass(Tie, [{
          key: 'type',
          get: function get() {
              return this._type;
          },
          set: function set(newType) {
              if (!VALID_TIE_TYPES.includes(newType)) {
                  throw new Music21Exception('Tie type must be one of "start", "stop", "continue", "let-ring"');
              }
              this._type = newType;
          }
      }]);
      return Tie;
  }(prebase.ProtoM21Object);
  _tie.Tie = Tie;

  var DEFAULTS = {
      divisionsPerQuarter: 32 * 3 * 3 * 5 * 7
  };

  function hyphenToCamelCase(tag) {
      return tag.replace(/-([a-z])/g, function (firstLetter) {
          return firstLetter[1].toUpperCase();
      });
  }

  function seta(m21El, xmlEl, tag, attributeName, transform) {
      var $matchEl = $$1(xmlEl).children(tag);
      if (!$matchEl) {
          return;
      }
      var value = $matchEl.contents().eq(0).text();
      if (value === undefined || value === '') {
          return;
      }
      if (transform !== undefined) {
          value = transform(value);
      }
      if (attributeName === undefined) {
          attributeName = hyphenToCamelCase(tag);
      }
      m21El[attributeName] = value;
  }

  var ScoreParser = function () {
      function ScoreParser() {
          classCallCheck(this, ScoreParser);

          this.xmlText = undefined;
          this.xmlUrl = undefined;
          this.$xmlRoot = undefined;
          this.stream = new stream.Score();

          this.definesExplicitSystemBreaks = false;
          this.definesExplicitPageBreaks = false;

          this.mxScorePartDict = {};
          this.m21PartObjectsById = {};
          this.partGroupList = [];
          this.parts = [];

          this.musicXmlVersion = '1.0';
      }

      createClass(ScoreParser, [{
          key: 'scoreFromUrl',
          value: function scoreFromUrl(url) {
              var _this = this;

              this.xmlUrl = url;
              return $$1.get(url, {}, function (xmlDoc, textStatus) {
                  return _this.scoreFromDOMTree(xmlDoc);
              });
          }
      }, {
          key: 'scoreFromText',
          value: function scoreFromText(xmlText) {
              this.xmlText = xmlText;
              var xmlDoc = $$1.parseXML(xmlText);
              return this.scoreFromDOMTree(xmlDoc);
          }
      }, {
          key: 'scoreFromDOMTree',
          value: function scoreFromDOMTree(xmlDoc) {
              this.$xmlRoot = $$1($$1(xmlDoc).children('score-partwise'));
              this.xmlRootToScore(this.$xmlRoot, this.stream);
              return this.stream;
          }
      }, {
          key: 'xmlRootToScore',
          value: function xmlRootToScore($mxScore, inputM21) {
              var s = inputM21;
              if (inputM21 === undefined) {
                  s = new stream.Score();
              }
              // version
              // defaults
              // credit
              this.parsePartList($mxScore);
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = $mxScore.children('part')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var p = _step.value;

                      var $p = $$1(p);
                      var partId = $p.attr('id');
                      // if (partId === undefined) {
                      //     partId = //something
                      // }
                      var $mxScorePart = this.mxScorePartDict[partId];
                      var part = this.xmlPartToPart($p, $mxScorePart);
                      if (part !== undefined) {
                          // partStreams are undefined
                          s.insert(0.0, part);
                          this.m21PartObjectsById[partId] = part;
                          this.parts.push(part);
                      }
                  }
                  // partGroups;
                  // spanners;
                  // definesExplicitSystemreaks, etc.
                  // sort
              } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                      }
                  } finally {
                      if (_didIteratorError) {
                          throw _iteratorError;
                      }
                  }
              }

              return s;
          }
      }, {
          key: 'xmlPartToPart',
          value: function xmlPartToPart($mxPart, $mxScorePart) {
              var parser = new PartParser($mxPart, $mxScorePart, this);
              parser.parse();
              // handle partStreams
              return parser.stream;
          }
      }, {
          key: 'parsePartList',
          value: function parsePartList($mxScore) {
              var mxPartList = $mxScore.children('part-list');
              if (!mxPartList) {
                  return;
              }
              // const openPartGroups = [];
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = mxPartList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var partListElement = _step2.value;

                      var $partListElement = $$1(partListElement);
                      var partId = $partListElement.attr('id');
                      this.mxScorePartDict[partId] = $partListElement;
                  }
                  // deal with part-groups
              } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                          _iterator2.return();
                      }
                  } finally {
                      if (_didIteratorError2) {
                          throw _iteratorError2;
                      }
                  }
              }
          }
      }]);
      return ScoreParser;
  }();

  var PartParser = function () {
      function PartParser($mxPart, $mxScorePart, parent) {
          classCallCheck(this, PartParser);

          this.$mxPart = $mxPart;
          this.$mxScorePart = $mxScorePart;
          // ignore parent for now
          if ($mxPart !== undefined) {
              this.partId = $mxPart.attr('id');
              // ignore empty partId for now
          }
          // spannerBundles
          this.stream = new stream.Part();
          this.atSoundingPitch = true;
          this.staffReferenceList = [];

          this.lastTimeSignature = undefined;
          this.lastMeasureWasShort = false;
          this.lastMeasureOffset = 0.0;
          this.lastClefs = {
              0: new clef.TrebleClef()
          };
          this.activeTuplets = [];
          this.activeTuplets.length = 7;
          this.activeTuplets.fill(undefined);

          this.maxStaves = 1;
          this.lastMeasureNumber = 0;
          this.lastNumberSuffix = undefined;

          this.multiMeasureRestsToCapture = 0;
          this.activeMultimeasureRestSpanner = undefined;

          this.activeInstrument = undefined;
          this.firstMeasureParsed = false;
          this.$activeAttributes = undefined;
          this.lastDivisions = DEFAULTS.divisionsPerQuarter;

          this.appendToScoreAfterParse = true;
          this.lastMeasureParser = undefined;
      }

      createClass(PartParser, [{
          key: 'parse',
          value: function parse() {
              this.parseXmlScorePart();
              this.parseMeasures();
              // atSoundingPitch;
              // spannerBundles
              // partStaves;
          }
      }, {
          key: 'parseXmlScorePart',
          value: function parseXmlScorePart() {
              var part = this.stream;
              var $mxScorePart = this.$mxScorePart;

              seta(part, $mxScorePart, 'part-name'); // todo -- clean string
              // remainder of part names
              // instruments
          }
      }, {
          key: 'parseMeasures',
          value: function parseMeasures() {
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                  for (var _iterator3 = this.$mxPart.children('measure')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var mxMeasure = _step3.value;

                      var $mxMeasure = $$1(mxMeasure);
                      this.xmlMeasureToMeasure($mxMeasure);
                  }
              } catch (err) {
                  _didIteratorError3 = true;
                  _iteratorError3 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                          _iterator3.return();
                      }
                  } finally {
                      if (_didIteratorError3) {
                          throw _iteratorError3;
                      }
                  }
              }

              if (this.lastMeasureParser !== undefined) {
                  this.lastMeasureParser.parent = undefined; // gc.
              }
          }
      }, {
          key: 'xmlMeasureToMeasure',
          value: function xmlMeasureToMeasure($mxMeasure) {
              var measureParser = new MeasureParser($mxMeasure, this);
              measureParser.parse();
              if (this.lastMeasureParser !== undefined) {
                  this.lastMeasureParser.parent = undefined; // gc.
              }
              this.lastMeasureParser = measureParser;
              // max staves
              // transposition
              this.firstMeasureParsed = true;
              // staffReferenceList

              var m = measureParser.stream;
              this.setLastMeasureInfo(m);
              // fullMeasureRests

              // TODO: offsets!!!
              // this.stream.insert(this.lastMeasureOffset, m);
              this.stream.append(m);

              this.adjustTimeAttributesFromMeasure(m);
          }
      }, {
          key: 'setLastMeasureInfo',
          value: function setLastMeasureInfo(m) {
              if (m.number !== this.lastMeasureNumber) {
                  this.lastMeasureNumber = m.number;
                  this.lastNumberSuffix = m.numberSuffix;
              }

              if (m.timeSignature !== undefined) {
                  this.lastTimeSignature = m.timeSignature;
              } else if (this.lastTimeSignature === undefined) {
                  this.lastTimeSignature = new meter.TimeSignature('4/4');
              }
          }
      }, {
          key: 'adjustTimeAttributesFromMeasure',
          value: function adjustTimeAttributesFromMeasure(m) {
              var mHighestTime = m.highestTime;
              // ignore incomplete measures.
              var mOffsetShift = mHighestTime;
              this.lastMeasureOffset += mOffsetShift;
          }
      }]);
      return PartParser;
  }();

  var MeasureParser = function () {
      function MeasureParser($mxMeasure, parent) {
          classCallCheck(this, MeasureParser);

          this.$mxMeasure = $mxMeasure;
          this.$mxMeasureElements = [];

          this.divisions = undefined;
          this.parent = parent;

          this.transposition = undefined;
          // spannerBundles
          this.staffReference = {};
          // activeTuplets
          this.useVoices = false;
          this.voicesById = {};
          this.voiceIndices = new Set();
          this.staves = 1;
          this.$activeAttributes = undefined;
          this.attributesAreInternal = true;
          this.measureNumber = undefined;
          this.numberSuffix = undefined;

          if (parent !== undefined) {
              this.divisions = parent.lastDivisions;
          } else {
              this.divisions = DEFAULTS.divisionsPerQuarter;
          }

          this.staffLayoutObjects = [];
          this.stream = new stream.Measure();

          this.$mxNoteList = [];
          this.$mxLyricList = [];
          this.nLast = undefined;
          this.chordVoice = undefined;
          this.fullMeasureRest = false;
          this.restAndNoteCount = {
              rest: 0,
              note: 0
          };
          this.lastClefs = {
              0: undefined
          };
          this.parseIndex = 0;
          this.offsetMeasureNote = 0.0;

          // class attributes in m21p
          this.attributeTagsToMethods = {
              'time': 'handleTimeSignature',
              'clef': 'handleClef',
              'key': 'handleKeySignature'
              // 'staff-details': 'handleStaffDetails',
              // 'measure-style': 'handleMeasureStyle',
          };
          this.musicDataMethods = {
              'note': 'xmlToNote',
              // 'backup': 'xmlBackup',
              // 'forward': 'xmlForward',
              // 'direction': 'xmlDirection',
              'attributes': 'parseAttributesTag'
              // 'harmony': 'xmlHarmony',
              // 'figured-bass': undefined,
              // 'sound': undefined,
              // 'barline': 'xmlBarline',
              // 'grouping': undefined,
              // 'link': undefined,
              // 'bookmark': undefined,

              // Note: <print> is handled separately...
          };
      }

      createClass(MeasureParser, [{
          key: 'parse',
          value: function parse() {
              // mxPrint
              this.parseMeasureAttributes();
              // updateVoiceInformation;

              var children = this.$mxMeasure.children();
              this.$mxMeasureElements = [];
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                  for (var _iterator4 = children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var c = _step4.value;

                      var $c = $$1(c);
                      this.$mxMeasureElements.push($c);
                  }
              } catch (err) {
                  _didIteratorError4 = true;
                  _iteratorError4 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion4 && _iterator4.return) {
                          _iterator4.return();
                      }
                  } finally {
                      if (_didIteratorError4) {
                          throw _iteratorError4;
                      }
                  }
              }

              var i = 0;
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                  for (var _iterator5 = this.$mxMeasureElements[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                      var $mxObj = _step5.value;

                      var tag = $mxObj[0].tagName;
                      this.parseIndex = i;
                      var methName = this.musicDataMethods[tag];
                      if (methName !== undefined) {
                          this[methName]($mxObj);
                      }
                      i += 1;
                  }
                  // useVoices
                  // fullMeasureRest
              } catch (err) {
                  _didIteratorError5 = true;
                  _iteratorError5 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion5 && _iterator5.return) {
                          _iterator5.return();
                      }
                  } finally {
                      if (_didIteratorError5) {
                          throw _iteratorError5;
                      }
                  }
              }
          }
      }, {
          key: 'insertInMeasureOrVoice',
          value: function insertInMeasureOrVoice($mxObj, el) {
              // TODO: offsets!
              // this.stream.insert(this.offsetMeasureNote, el);
              this.stream.append(el);
          }
      }, {
          key: 'xmlToNote',
          value: function xmlToNote($mxNote) {
              var nextNoteIsChord = false;
              var $mxObjNext = this.$mxMeasureElements[this.parseIndex + 1];
              if ($mxObjNext !== undefined) {
                  if ($mxObjNext[0].tagName === 'note' && $mxObjNext.children('chord').length > 0) {
                      nextNoteIsChord = true;
                  }
              }
              var isChord = false;
              var isRest = false;

              var offsetIncrement = 0.0;
              if ($mxNote.children('rest').length > 0) {
                  isRest = true;
              }
              if ($mxNote.children('chord').length > 0) {
                  isChord = true;
              }
              if (nextNoteIsChord) {
                  isChord = true;
              }

              var n = void 0;

              if (isChord) {
                  this.$mxNoteList.push($mxNote);
                  // chord lyrics
              } else if (!isChord && !isRest) {
                  // normal note
                  this.restAndNoteCount.note += 1;
                  n = this.xmlToSimpleNote($mxNote);
              } else {
                  this.restAndNoteCount.rest += 1;
                  n = this.xmlToRest($mxNote);
              }

              if (!isChord) {
                  // update lyrics
                  // add to staffReference
                  this.insertInMeasureOrVoice($mxNote, n);
                  offsetIncrement = n.duration.quarterLength;
                  this.nLast = n;
              }

              if (this.$mxNoteList && !nextNoteIsChord) {
                  var c = this.xmlToChord(this.$mxNoteList);
                  // update lyrics
                  // addToStaffRest;

                  // voices;
                  this.insertInMeasureOrVoice($mxNote, c);

                  this.$mxNoteList = [];
                  this.$mxLyricList = [];
                  offsetIncrement = c.duration.quarterLength;
                  this.nLast = c;
              }

              this.offsetMeasureNote += offsetIncrement;
          }
      }, {
          key: 'xmlToChord',
          value: function xmlToChord($mxNoteList) {
              var notes = [];
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                  for (var _iterator6 = $mxNoteList[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                      var $mxNote = _step6.value;

                      var freeSpanners = false;
                      notes.push(this.xmlToSimpleNote($mxNote, freeSpanners));
                  }
              } catch (err) {
                  _didIteratorError6 = true;
                  _iteratorError6 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion6 && _iterator6.return) {
                          _iterator6.return();
                      }
                  } finally {
                      if (_didIteratorError6) {
                          throw _iteratorError6;
                      }
                  }
              }

              var c = new chord.Chord(notes);
              // move beams from first note;
              // move articulations;
              // move expressions;
              // move spanners;

              return c;
          }
      }, {
          key: 'xmlToSimpleNote',
          value: function xmlToSimpleNote($mxNote, freeSpanners) {
              var n = new note.Note();
              this.xmlToPitch($mxNote, n.pitch);
              // beams;
              // stems;
              // noteheads
              return this.xmlNoteToGeneralNoteHelper(n, $mxNote, freeSpanners);
          }

          // xmlToBeam
          // xmlToBeams
          // xmlNotehead

      }, {
          key: 'xmlToPitch',
          value: function xmlToPitch($mxNote, inputM21) {
              var p = inputM21;
              if (inputM21 === undefined) {
                  p = new pitch.Pitch();
              }

              var $mxPitch = void 0;
              if ($mxNote[0].tagName === 'pitch') {
                  $mxPitch = $mxNote;
              } else {
                  $mxPitch = $$1($mxNote.children('pitch')[0]);
                  if ($mxPitch.length === 0) {
                      // whoops!
                      return p;
                  }
              }

              seta(p, $mxPitch, 'step');
              seta(p, $mxPitch, 'octave', undefined, parseInt);
              var $mxAlter = $mxPitch.children('alter');
              var accAlter = void 0;
              if ($mxAlter) {
                  accAlter = parseFloat($mxAlter.text().trim());
              }

              var $mxAccidental = $mxNote.children('accidental');
              // dropping support for musescore 0.9 errors...
              if ($mxAccidental.length > 0) {
                  var accObj = this.xmlToAccidental($mxAccidental);
                  p.accidental = accObj;
                  p.accidental.displayStatus = true;
                  // independent accidental from alter
              } else if (accAlter !== undefined) {
                  p.accidental = new pitch.Accidental(accAlter);
                  p.accidental.displayStatus = false;
              }
              return p;
          }
      }, {
          key: 'xmlToAccidental',
          value: function xmlToAccidental($mxAccidental) {
              var acc = new pitch.Accidental();
              // to-do m21/musicxml accidental name differences;
              var name = $$1($mxAccidental[0]).text().trim().toLowerCase();
              acc.set(name);

              // set print style
              // parentheses
              // bracket
              // editorial
              return acc;
          }
      }, {
          key: 'xmlToRest',
          value: function xmlToRest($mxRest) {
              var r = new note.Rest();
              // full measure rest
              // apply multimeasure rest
              // display-step, octave, etc.
              return this.xmlNoteToGeneralNoteHelper(r, $mxRest);
          }
      }, {
          key: 'xmlNoteToGeneralNoteHelper',
          value: function xmlNoteToGeneralNoteHelper(n, $mxNote, freeSpanners) {
              if (freeSpanners === undefined) {
                  freeSpanners = true;
              }
              // spanners
              // setPrintStyle
              // print-object
              // dynamics
              // pizzacato
              // grace
              this.xmlToDuration($mxNote, n.duration);
              // type styles
              // color
              // position
              if ($mxNote.children('tie').length > 0) {
                  n.tie = this.xmlToTie($mxNote);
              }
              // grace
              // notations
              // editorial
              return n;
          }
      }, {
          key: 'xmlToDuration',
          value: function xmlToDuration($mxNote, inputM21) {
              var d = inputM21;
              if (inputM21 === undefined) {
                  d = new duration.Duration();
              }
              var divisions = this.divisions;
              var mxDuration = $mxNote.children('duration')[0];
              var qLen = 0.0;

              if (mxDuration) {
                  var noteDivisions = parseFloat($$1(mxDuration).text().trim());
                  qLen = noteDivisions / divisions;
              }

              var mxType = $mxNote.children('type')[0];
              if (mxType) {
                  // long vs longa todo
                  var durationType = $$1(mxType).text().trim();
                  var numDots = $mxNote.children('dot').length;
                  // tuplets!!!! big to-do!
                  d.type = durationType;
                  d.dots = numDots;
              } else {
                  d.quarterLength = qLen;
              }

              return d;
          }

          // xmlGraceToGrace
          // xmlNotations
          // xmlTechnicalToArticulation
          // setHarmonic
          // handleFingering
          // xmlToArticulation
          // xmlOrnamentToExpression
          // xmlDirectionTypeToSpanners
          // xmlNotationsToSpanners
          // xmlToTremolo
          // xmlOneSpanner

      }, {
          key: 'xmlToTie',
          value: function xmlToTie($mxNote) {
              var t = new _tie.Tie();
              var allTies = $mxNote.children('tie');
              if (allTies.length > 1) {
                  t.type = 'continue';
              } else {
                  var $t0 = $$1(allTies[0]);
                  t.type = $t0.attr('type');
              }
              // style
              return t;
          }
      }, {
          key: 'insertIntoMeasureOrVoice',
          value: function insertIntoMeasureOrVoice($mxElement, el) {
              this.stream.insert(this.offsetMeasureNote, el);
          }
      }, {
          key: 'parseMeasureAttributes',
          value: function parseMeasureAttributes() {
              this.parseMeasureNumbers();
              // width;
          }
      }, {
          key: 'parseMeasureNumbers',
          value: function parseMeasureNumbers() {
              var mNumRaw = this.$mxMeasure.attr('number');
              var mNum = parseInt(mNumRaw); // no suffixes...
              this.stream.number = mNum;
              if (this.parent) {
                  this.parent.lastMeasureNumber = mNum;
              }
              this.measureNumber = mNum;
          }
      }, {
          key: 'parseAttributesTag',
          value: function parseAttributesTag($mxAttributes) {
              this.attributesAreInternal = false;
              this.$activeAttributes = $mxAttributes;
              var _iteratorNormalCompletion7 = true;
              var _didIteratorError7 = false;
              var _iteratorError7 = undefined;

              try {
                  for (var _iterator7 = $mxAttributes[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                      var mxSub = _step7.value;

                      var tag = mxSub.tagName;
                      var $mxSub = $$1(mxSub);
                      var methName = this.attributeTagsToMethods[tag];
                      if (methName !== undefined) {
                          this[methName]($mxSub);
                      } else if (tag === 'staves') {
                          this.staves = parseInt($mxSub.text());
                      } else if (tag === 'divisions') {
                          this.divisions = parseFloat($mxSub.text());
                      }
                      // transpose;
                  }
              } catch (err) {
                  _didIteratorError7 = true;
                  _iteratorError7 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion7 && _iterator7.return) {
                          _iterator7.return();
                      }
                  } finally {
                      if (_didIteratorError7) {
                          throw _iteratorError7;
                      }
                  }
              }

              if (this.parent !== undefined) {
                  this.parent.lastDivisions = this.divisions;
                  this.parent.$activeAttributes = this.$activeAttributes;
              }
          }
          // xmlTransposeToInterval

      }, {
          key: 'handleTimeSignature',
          value: function handleTimeSignature($mxTime) {
              var ts = this.xmlToTimeSignature($mxTime);
              this.insertIntoMeasureOrVoice($mxTime, ts);
          }
      }, {
          key: 'xmlToTimeSignature',
          value: function xmlToTimeSignature($mxTime) {
              // senza-misura
              // simple time signature only;
              var numerator = $$1($mxTime.children('beats')[0]).text().trim();
              var denominator = $$1($mxTime.children('beat-type')[0]).text().trim();
              return new meter.TimeSignature(numerator + '/' + denominator);
              // symbol
          }
      }, {
          key: 'handleClef',
          value: function handleClef($mxClef) {
              var clefObj = this.xmlToClef($mxClef);
              this.insertIntoMeasureOrVoice($mxClef, clefObj);
              this.lastClefs[0] = clefObj;
          }
      }, {
          key: 'xmlToClef',
          value: function xmlToClef($mxClef) {
              var sign = $$1($mxClef.children('sign')[0]).text().trim();
              // TODO: percussion, etc.
              var line = $$1($mxClef.children('line')[0]).text().trim();

              var clefOctaveChange = 0;
              var $coc = $mxClef.children('clef-octave-change');
              if ($coc.length > 0) {
                  clefOctaveChange = parseInt($$1($coc[0]).text().trim());
              }
              return clef.clefFromString(sign + line, clefOctaveChange);
          }
      }, {
          key: 'handleKeySignature',
          value: function handleKeySignature($mxKey) {
              var keySig = this.xmlToKeySignature($mxKey);
              this.insertIntoMeasureOrVoice($mxKey, keySig);
          }
      }, {
          key: 'xmlToKeySignature',
          value: function xmlToKeySignature($mxKey) {
              var ks = new key.KeySignature();
              seta(ks, $mxKey, 'fifths', 'sharps', parseInt);
              // mode!
              // non-standard and key-octaves
              return ks;
          }
      }]);
      return MeasureParser;
  }();

  var musicxml = {
      ScoreParser: ScoreParser,
      PartParser: PartParser,
      MeasureParser: MeasureParser
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/roman -- roman.RomanNumberal -- Chord subclass
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  var RomanNumeral = function (_chord$Chord) {
      inherits(RomanNumeral, _chord$Chord);

      function RomanNumeral(figure, keyStr) {
          classCallCheck(this, RomanNumeral);

          var _this = possibleConstructorReturn(this, (RomanNumeral.__proto__ || Object.getPrototypeOf(RomanNumeral)).call(this));

          _this.classes.push('RomanNumeral');
          _this.figure = figure;
          _this._scale = undefined;
          _this._key = undefined;
          _this.key = keyStr;
          var currentFigure = figure;

          var impliedQuality = 'major';
          var lowercase = currentFigure.toLowerCase();
          if (currentFigure.match('/o')) {
              impliedQuality = 'half-diminished';
              currentFigure = currentFigure.replace('/o', '');
          } else if (currentFigure.match('o')) {
              impliedQuality = 'diminished';
              currentFigure = currentFigure.replace('o', '');
          } else if (currentFigure === lowercase) {
              impliedQuality = 'minor';
          }

          var numbersArr = currentFigure.match(/\d+/);
          _this.numbers = undefined;
          if (numbersArr != null) {
              currentFigure = currentFigure.replace(/\d+/, '');
              _this.numbers = parseInt(numbersArr[0]);
          }

          var scaleDegree = roman.romanToNumber.indexOf(currentFigure.toLowerCase());
          if (scaleDegree === -1) {
              throw new Music21Exception('Cannot make a romanNumeral from ' + currentFigure);
          }
          _this.scaleDegree = scaleDegree;
          _this.root = _this.scale[_this.scaleDegree - 1];

          if (_this.key.mode === 'minor' && (_this.scaleDegree === 6 || _this.scaleDegree === 7)) {
              if (['minor', 'diminished', 'half-diminished'].indexOf(impliedQuality) !== -1) {
                  var raiseTone = new interval.Interval('A1');
                  _this.root = raiseTone.transposePitch(_this.root);
                  if (debug) {
                      console.log('raised root because minor/dim on scaleDegree 6 or 7');
                  }
              }
          }

          /* temp hack */
          if (_this.numbers === 7) {
              if (scaleDegree === 5 && impliedQuality === 'major') {
                  impliedQuality = 'dominant-seventh';
              } else {
                  impliedQuality += '-seventh';
              }
          }

          _this.impliedQuality = impliedQuality;
          _this.updatePitches();
          return _this;
      }

      createClass(RomanNumeral, [{
          key: 'updatePitches',


          /**
           * Update the .pitches array.  Called at instantiation, but not automatically afterwards.
           *
           * @memberof music21.roman.RomanNumeral
           */
          value: function updatePitches() {
              var impliedQuality = this.impliedQuality;
              var chordSpacing = chord.chordDefinitions[impliedQuality];
              var chordPitches = [this.root];
              var lastPitch = this.root;
              for (var j = 0; j < chordSpacing.length; j++) {
                  // console.log('got them', lastPitch);
                  var thisTransStr = chordSpacing[j];
                  var thisTrans = new interval.Interval(thisTransStr);
                  var nextPitch = thisTrans.transposePitch(lastPitch);
                  chordPitches.push(nextPitch);
                  lastPitch = nextPitch;
              }
              this.pitches = chordPitches;
          }

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

      }, {
          key: 'asString',
          value: function asString(displayType, inversion) {
              var keyObj = this.key;
              var tonic = keyObj.tonic;
              var mode = keyObj.mode;

              if (inversion === undefined) {
                  inversion = 0;
              }
              var inversionName = '';
              if (inversion === 1) {
                  if (displayType === 'roman') {
                      inversionName = '6';
                  } else {
                      inversionName = ' (first inversion)';
                  }
              } else if (inversion === 2) {
                  if (displayType === 'roman') {
                      inversionName = '64';
                  } else {
                      inversionName = ' (second inversion)';
                  }
              }
              var fullChordName = void 0;
              var connector = ' in ';
              var suffix = '';
              if (displayType === 'roman') {
                  fullChordName = this.figure;
              } else if (displayType === 'nameOnly') {
                  // use only with only choice being TONIC
                  fullChordName = '';
                  connector = '';
                  suffix = ' triad';
              } else if (displayType === 'bassName') {
                  fullChordName = this.bass().name.replace(/-/, 'b');
                  connector = ' in ';
                  suffix = '';
              } else {
                  // "default" submediant, etc...
                  fullChordName = this.degreeName;
                  if (this.numbers !== undefined) {
                      fullChordName += ' ' + this.numbers.toString();
                  }
              }
              var tonicDisplay = tonic.replace(/-/, 'b');
              if (mode === 'minor') {
                  tonicDisplay = tonicDisplay.toLowerCase();
              }
              var chordStr = fullChordName + inversionName + connector + tonicDisplay + ' ' + mode + suffix;
              return chordStr;
          }
      }, {
          key: 'scale',
          get: function get() {
              if (this._scale !== undefined) {
                  return this._scale;
              } else {
                  this._scale = this.key.getScale();
                  return this._scale;
              }
          }
      }, {
          key: 'key',
          get: function get() {
              return this._key;
          },
          set: function set(keyStr) {
              if (typeof keyStr === 'string') {
                  this._key = new key.Key(keyStr);
              } else if (typeof keyStr === 'undefined') {
                  this._key = new key.Key('C');
              } else {
                  this._key = keyStr;
              }
          }
      }, {
          key: 'degreeName',
          get: function get() {
              if (this.scaleDegree < 7) {
                  return [undefined, 'Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant'][this.scaleDegree];
              } else {
                  var tonicPitch = new pitch.Pitch(this.key.tonic);
                  var diffRootToTonic = (tonicPitch.ps - this.root.ps) % 12;
                  if (diffRootToTonic < 0) {
                      diffRootToTonic += 12;
                  }
                  if (diffRootToTonic === 1) {
                      return 'Leading-tone';
                  } else {
                      return 'Subtonic';
                  }
              }
          }
      }]);
      return RomanNumeral;
  }(chord.Chord);
  roman.RomanNumeral = RomanNumeral;

  /**
   * music21j -- Javascript reimplementation of Core music21 features.
   * music21/tempo -- tempo and (not in music21p) metronome objects
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21, Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
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
  var Metronome = function (_prebase$ProtoM21Obje) {
      inherits(Metronome, _prebase$ProtoM21Obje);

      function Metronome(tempoInt) {
          classCallCheck(this, Metronome);

          var _this = possibleConstructorReturn(this, (Metronome.__proto__ || Object.getPrototypeOf(Metronome)).call(this));

          _this.classes.push('Metronome');
          _this._tempo = 60; // overridden by music21.tempo.baseTempo;
          if (tempoInt === undefined) {
              _this.tempo = tempo.baseTempo;
          } else {
              _this.tempo = tempoInt;
          }
          _this.numBeatsPerMeasure = 4;
          _this.minTempo = 10;
          _this.maxTempo = 600;
          _this.beat = _this.numBeatsPerMeasure;
          _this.chirpTimeout = undefined;
          _this.silent = false;
          _this.flash = false;
          _this.tempoRanges = [0, 40, 60, 72, 120, 144, 240, 999];
          _this.tempoIncreases = [0, 1, 2, 3, 4, 6, 8, 15, 100];
          return _this;
      }

      createClass(Metronome, [{
          key: '_silentFlash',
          value: function _silentFlash(flashColor) {
              this.$metronomeDiv.find('.metroFlash').css('background-color', flashColor).fadeOut(this.beatLength * 1000 * 1 / 4, function silentFadeOut() {
                  $$1(this).css('background-color', '#ffffff').fadeIn(1);
              });
          }

          /**
           * Play a note (a higher one on the downbeat) and start the metronome chirping.
           *
           * @memberof music21.tempo.Metronome
           */

      }, {
          key: 'chirp',
          value: function chirp() {
              this.beat += 1;
              if (this.beat > this.numBeatsPerMeasure) {
                  this.beat = 1;
                  if (this.silent !== true) {
                      MIDI.noteOn(0, 96, 100, 0);
                      MIDI.noteOff(0, 96, 0.1);
                  }
                  if (this.flash === true) {
                      this._silentFlash('#0000f0');
                  }
              } else {
                  if (this.silent !== true) {
                      MIDI.noteOn(0, 84, 70, 0);
                      MIDI.noteOff(0, 84, 0.1);
                  }
                  if (this.flash === true) {
                      this._silentFlash('#ff0000');
                  }
              }
              var that = this;
              this.chirpTimeout = setTimeout(function () {
                  that.chirp();
              }, 1000 * 60 / this.tempo);
          }

          /**
           * Stop the metronome from chirping.
           *
           * @memberof music21.tempo.Metronome
           */

      }, {
          key: 'stopChirp',
          value: function stopChirp() {
              if (this.chirpTimeout !== undefined) {
                  clearTimeout(this.chirpTimeout);
                  this.chirpTimeout = undefined;
              }
          }

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

      }, {
          key: 'increaseSpeed',
          value: function increaseSpeed(n) {
              // increase by one metronome 'click' for every n
              if (n === undefined) {
                  n = 1;
              }
              for (var i = 0; i < n; i++) {
                  var t = this.tempo;
                  for (var tr = 0; tr < this.tempoRanges.length; tr++) {
                      var tempoExtreme = this.tempoRanges[tr];
                      var tempoIncrease = this.tempoIncreases[tr];
                      if (t < tempoExtreme) {
                          t += tempoIncrease;
                          t = tempoIncrease * Math.round(t / tempoIncrease);
                          break;
                      }
                  }
                  // console.log(t);
                  this.tempo = t;
              }
              return this.tempo;
          }

          /**
           * Decrease the metronome tempo one "click"
           *
           * To change the tempo, just set this.tempo = n
           *
           * @memberof music21.tempo.Metronome
           * @param {Int} n - number of clicks to the left
           * @returns {number} new tempo
           */

      }, {
          key: 'decreaseSpeed',
          value: function decreaseSpeed(n) {
              if (n === undefined) {
                  n = 1;
              }
              for (var i = 0; i < n; i++) {
                  var t = this.tempo;
                  var trL = this.tempoRanges.length;
                  for (var tr = 1; tr <= trL; tr++) {
                      var tempoExtreme = this.tempoRanges[trL - tr];
                      var tempoIncrease = this.tempoIncreases[trL - tr + 1];
                      if (t > tempoExtreme) {
                          t -= tempoIncrease;
                          t = tempoIncrease * Math.floor(t / tempoIncrease);
                          break;
                      }
                  }
                  // console.log(t);
                  this.tempo = t;
              }
          }

          /**
           * add a Metronome interface onto the DOM at where
           *
           * @memberof music21.tempo.Metronome
           * @param {JQueryDOMObject|DOMObject} [where='body']
           * @returns {JQueryDOMObject} - a div holding the metronome.
           */

      }, {
          key: 'addDiv',
          value: function addDiv(where) {
              var jWhere = void 0;
              if (where !== undefined && where.jquery !== undefined) {
                  jWhere = where;
              } else if (where !== undefined) {
                  jWhere = $$1(where);
              } else {
                  jWhere = $$1('body');
              }
              var metroThis = this;
              var tempoHolder = $$1('<span class="tempoHolder">' + this.tempo.toString() + '</span>');
              tempoHolder.css({
                  'font-size': '24px',
                  'padding-left': '10px',
                  'padding-right': '10px'
              });
              var newDiv = $$1('<div class="metronomeRendered"></div>');
              newDiv.append(tempoHolder);

              var b1 = $$1('<button>start</button>');
              b1.on('click', function () {
                  metroThis.chirp();
              });
              var b2 = $$1('<button>stop</button>');
              b2.on('click', function () {
                  metroThis.stopChirp();
              });
              newDiv.prepend(b2);
              newDiv.prepend(b1);
              var b3 = $$1('<button>up</button>');
              b3.on('click', function increaseSpeedButton() {
                  metroThis.increaseSpeed();
                  $$1(this).prevAll('.tempoHolder').html(metroThis.tempo.toString());
              });
              var b4 = $$1('<button>down</button>');
              b4.on('click', function decreaseSpeedButton() {
                  metroThis.decreaseSpeed();
                  $$1(this).prevAll('.tempoHolder').html(metroThis.tempo.toString());
              });
              newDiv.append(b3);
              newDiv.append(b4);
              var $flash = $$1('<span class="metroFlash">' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
              $flash.css('margin-left', '40px');
              $flash.css('height', '40px');

              newDiv.append($flash);

              jWhere.append(newDiv);

              this.$metronomeDiv = newDiv;
              return newDiv;
          }
      }, {
          key: 'tempo',
          get: function get() {
              return this._tempo;
          },
          set: function set(t) {
              this._tempo = t;
              if (this._tempo > this.maxTempo) {
                  this._tempo = this.maxTempo;
              } else if (this._tempo < this.minTempo) {
                  this._tempo = this.minTempo;
              }
          }
      }, {
          key: 'beatLength',
          get: function get() {
              return 60.0 / this.tempo;
          }
      }]);
      return Metronome;
  }(prebase.ProtoM21Object);
  tempo.Metronome = Metronome;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/tinyNotation -- TinyNotation implementation
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
   *
   */
  /**
   * TinyNotation module, see {@link music21.tinyNotation} namespace
   *
   * @exports music21/tinyNotation
   */
  /**
   * @namespace music21.tinyNotation
   * @memberof music21
   * @requires music21/base
   * @requires music21/clef
   * @requires music21/duration
   * @requires music21/pitch
   * @requires music21/note
   * @requires music21/meter
   * @requires music21/stream
   * @requires music21/tie
   */
  var tinyNotation = {};

  /**
   * Regular expressions object
   *
   * @memberof music21.tinyNotation
   */
  tinyNotation.regularExpressions = {
      REST: /r/,
      OCTAVE2: /([A-G])[A-G]+/,
      OCTAVE3: /([A-G])/,
      OCTAVE5: /([a-g])('+)/,
      OCTAVE4: /([a-g])/,
      EDSHARP: /\((#+)\)/,
      EDFLAT: /\((-+)\)/,
      EDNAT: /\(n\)/,
      SHARP: /^[A-Ga-g]+'*(#+)/, // simple notation finds
      FLAT: /^[A-Ga-g]+'*(-+)/, // double sharps too
      NAT: /^[A-Ga-g]+'*n/, // explicit naturals
      TYPE: /(\d+)/,
      TIE: /.~/, // not preceding ties
      PRECTIE: /~/, // front ties
      ID_EL: /=([A-Za-z0-9]*)/,
      LYRIC: /_(.*)/,
      DOT: /\.+/,
      TIMESIG: /(\d+)\/(\d+)/,

      PARTBREAK: /partBreak/, // nonstandard...fix later...

      TRIP: /trip\{/,
      QUAD: /quad\{/,
      ENDBRAC: /\}$/
  };
  /**
   * Function, not class.
   *
   * Converts a TinyNotation String into a music21 Stream
   *
   * See music21p for examples of what can go into tinynotation. It's an
   * adaptation of Lilypond format, by design Extremely simple!
   *
   * @memberof music21.tinyNotation
   * @param {string} textIn - a valid tinyNotation string
   * @returns {music21.stream.Part|music21.stream.Measure} - a Stream or Part object (if multiple measures)
   * @example
   * var t = "3/4 c4 B8 c d4 e2.";
   * var p = music21.tinyNotation.TinyNotation(t);
   * p.duration.quarterLength;
   * // 6.0
   */
  tinyNotation.TinyNotation = function TinyNotation(textIn) {
      textIn = textIn.trim();
      var tokens = textIn.split(' ');

      var optionalScore = void 0;

      var p = new stream.Part();
      var m = new stream.Measure();
      var currentTSBarDuration = 4.0;
      var lastDurationQL = 1.0;
      var storedDict = {
          lastNoteTied: false,
          inTrip: false,
          inQuad: false,
          endTupletAfterNote: false
      };
      var tnre = tinyNotation.regularExpressions; // faster typing
      for (var i = 0; i < tokens.length; i++) {
          // check at first so that a full measure but not over full
          // gets returned as a stream.Measure object.
          if (m.duration.quarterLength >= currentTSBarDuration) {
              p.append(m);
              m = new stream.Measure();
          }

          var token = tokens[i];
          var noteObj = void 0;
          if (tnre.PARTBREAK.exec(token)) {
              if (m.length > 0) {
                  p.append(m);
                  m = new stream.Measure();
              }
              if (optionalScore === undefined) {
                  optionalScore = new stream.Score();
              }
              optionalScore.insert(0, p);
              p = new stream.Part();

              storedDict.lastNoteTied = false;
              storedDict.inTrip = false;
              storedDict.inQuad = false;
              storedDict.endTupletAfterNote = false;

              continue;
          }

          if (tnre.TRIP.exec(token)) {
              token = token.slice(5); // cut...
              storedDict.inTrip = true;
          }
          if (tnre.QUAD.exec(token)) {
              token = token.slice(5); // cut...
              storedDict.inQuad = true;
          }
          if (tnre.ENDBRAC.exec(token)) {
              token = token.slice(0, -1); // cut...
              storedDict.endTupletAfterNote = true;
          }

          if (tnre.TIMESIG.exec(token)) {
              var _MATCH = tnre.TIMESIG.exec(token);
              var ts = new meter.TimeSignature();
              ts.numerator = parseInt(_MATCH[1]);
              ts.denominator = parseInt(_MATCH[2]);
              m.timeSignature = ts;
              currentTSBarDuration = ts.barDuration.quarterLength;
              // console.log(currentTSBarDuration);
              continue;
          } else if (tnre.REST.exec(token)) {
              noteObj = new note.Rest(lastDurationQL);
          } else if (tnre.OCTAVE2.exec(token)) {
              var _MATCH2 = tnre.OCTAVE2.exec(token);
              noteObj = new note.Note(_MATCH2[1], lastDurationQL);
              noteObj.pitch.octave = 4 - _MATCH2[0].length;
          } else if (tnre.OCTAVE3.exec(token)) {
              var _MATCH3 = tnre.OCTAVE3.exec(token);
              noteObj = new note.Note(_MATCH3[1], lastDurationQL);
              noteObj.pitch.octave = 3;
          } else if (tnre.OCTAVE5.exec(token)) {
              // must match octave 5 before 4
              var _MATCH4 = tnre.OCTAVE5.exec(token);
              noteObj = new note.Note(_MATCH4[1].toUpperCase(), lastDurationQL);
              noteObj.pitch.octave = 3 + _MATCH4[0].length;
          } else if (tnre.OCTAVE4.exec(token)) {
              var _MATCH5 = tnre.OCTAVE4.exec(token);
              noteObj = new note.Note(_MATCH5[1].toUpperCase(), lastDurationQL);
              noteObj.pitch.octave = 4;
          }

          if (noteObj === undefined) {
              continue;
          }
          if (tnre.TIE.exec(token)) {
              noteObj.tie = new _tie.Tie('start');
              if (storedDict.lastNoteTied) {
                  noteObj.tie.type = 'continue';
              }
              storedDict.lastNoteTied = true;
          } else if (storedDict.lastNoteTied) {
              noteObj.tie = new _tie.Tie('stop');
              storedDict.lastNoteTied = false;
          }
          if (tnre.SHARP.exec(token)) {
              noteObj.pitch.accidental = new pitch.Accidental('sharp');
          } else if (tnre.FLAT.exec(token)) {
              noteObj.pitch.accidental = new pitch.Accidental('flat');
          } else if (tnre.NAT.exec(token)) {
              noteObj.pitch.accidental = new pitch.Accidental('natural');
              noteObj.pitch.accidental.displayType = 'always';
          }
          var MATCH = tnre.TYPE.exec(token);
          if (MATCH) {
              var durationType = parseInt(MATCH[0]);
              noteObj.duration.quarterLength = 4.0 / durationType;
          }
          MATCH = tnre.DOT.exec(token);
          if (MATCH) {
              var numDots = MATCH[0].length;
              var multiplier = 1 + (1 - Math.pow(0.5, numDots));
              noteObj.duration.quarterLength *= multiplier;
          }
          lastDurationQL = noteObj.duration.quarterLength;
          // do before appending tuplets

          if (storedDict.inTrip) {
              // console.log(noteObj.duration.quarterLength);
              noteObj.duration.appendTuplet(new duration.Tuplet(3, 2, noteObj.duration.quarterLength));
          }
          if (storedDict.inQuad) {
              noteObj.duration.appendTuplet(new duration.Tuplet(4, 3, noteObj.duration.quarterLength));
          }
          if (storedDict.endTupletAfterNote) {
              storedDict.inTrip = false;
              storedDict.inQuad = false;
              storedDict.endTupletAfterNote = false;
          }
          m.append(noteObj);
      }

      var returnObject = void 0;

      if (optionalScore !== undefined) {
          if (m.length > 0) {
              p.append(m);
          }
          if (p.length > 0) {
              optionalScore.append(p);
          }
          for (var _i = 0; _i < optionalScore.length; _i++) {
              var innerPart = optionalScore.get(_i);
              innerPart.clef = clef.bestClef(innerPart);
          }
          returnObject = optionalScore;
      } else if (p.length > 0) {
          p.append(m);
          p.clef = clef.bestClef(p);
          returnObject = p;
      } else {
          m.clef = clef.bestClef(m);
          returnObject = m;
      }
      return returnObject;
  };

  // render notation divs in HTML
  /**
   * Render all the TinyNotation classes in the DOM as notation
   *
   * Called automatically when music21 is loaded.
   *
   * @memberof music21.tinyNotation
   * @param {string} classTypes - a JQuery selector to find elements to replace.
   */
  tinyNotation.renderNotationDivs = function renderNotationDivs(classTypes, selector) {
      if (classTypes === undefined) {
          classTypes = '.music21.tinyNotation';
      }
      var allRender = [];
      if (selector === undefined) {
          allRender = $$1(classTypes);
      } else {
          if (selector.jquery === undefined) {
              selector = $$1(selector);
          }
          allRender = selector.find(classTypes);
      }
      for (var i = 0; i < allRender.length; i++) {
          var thisTN = allRender[i];
          var $thisTN = $$1(thisTN);
          var thisTNContents = void 0;
          if ($thisTN.attr('tinynotationcontents') !== undefined) {
              thisTNContents = $thisTN.attr('tinynotationcontents');
          } else if (thisTN.textContent !== undefined) {
              thisTNContents = thisTN.textContent;
              thisTNContents = thisTNContents.replace(/s+/g, ' '); // no line-breaks, etc.
          }

          if (String.prototype.trim !== undefined && thisTNContents !== undefined) {
              thisTNContents = thisTNContents.trim(); // remove leading, trailing whitespace
          }
          if (thisTNContents) {
              var st = tinyNotation.TinyNotation(thisTNContents);
              if ($thisTN.hasClass('noPlayback')) {
                  st.renderOptions.events.click = undefined;
              }
              var newCanvas = st.createCanvas();

              $thisTN.attr('tinynotationcontents', thisTNContents);
              $thisTN.empty();
              $thisTN.data('stream', st);
              $thisTN.append(newCanvas);
              // console.log(thisTNContents);
          }
      }
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/webmidi -- webmidi or wrapper around the Jazz Plugin
   *
   * For non webmidi --  Uses the cross-platform, cross-browser plugin from
   * http://jazz-soft.net/doc/Jazz-Plugin/Plugin.html
   * P.S. by the standards of divinity of most major religions, Sema Kachalo is a god.
   *
   * Copyright (c) 2014-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
   *
   */
  /**
   * webmidi -- for connecting with external midi devices
   *
   * Uses either the webmidi API or the Jazz plugin
   *
   * See {@link music21.webmidi}
   *
   * @exports music21/webmidi
   */
  /**
   * webmidi -- for connecting with external midi devices
   *
   * Uses either the webmidi API or the Jazz plugin
   *
   * @namespace music21.webmidi
   * @memberof music21
   * @requires music21/miditools
   * @requires jquery
   * @property {JazzObject|undefined} storedPlugin - reference to the Jazz object from the plugin; cached from `createPlugin`.
   * @property {string} selectedJazzInterface - the currently connected interface (note that we can only use one right now)
   */
  var webmidi = {};

  webmidi.selectedOutputPort = undefined;
  webmidi.selectedInputPort = undefined;

  webmidi.access = undefined;
  webmidi.$selectDiv = undefined;

  webmidi.jazzDownloadUrl = 'http://jazz-soft.net/download/Jazz-Plugin/';
  webmidi.storedPlugin = undefined;
  webmidi.selectedJazzInterface = undefined; // not the same as "" etc. uses last selected interface by default.

  /**
   * Called by Jazz MIDI plugin when an event arrives.
   *
   * Shim to convert the data into WebMIDI API format and then call the WebMIDI API midiInArrived
   *
   * See the MIDI spec for information on parameters
   *
   * @memberof music21.webmidi
   * @param {byte} t - timing information
   * @param {byte} a - data 1
   * @param {byte} b - data 2
   * @param {byte} c - data 3
   */
  webmidi.jazzMidiInArrived = function jazzMidiInArrived(t, a, b, c) {
      var webmidiEvent = {
          timestamp: t,
          data: [a, b, c]
      };
      return webmidi.midiInArrived(webmidiEvent);
  };

  /**
   * Called directly when a MIDI event arrives from the WebMIDI API, or via a Shim (jazzMidiInArrived)
   * when MIDI information comes from JazzMIDI
   *
   * Calls the 'raw' and 'general callbacks when a raw midi event (four bytes)
   * arrives.
   *
   * See the MIDI spec for information on the contents of the three parameters.
   *
   * midiMessageEvent should be an object with two keys: timeStamp (int) and data (array of three int values)
   *
   * @memberof music21.webmidi
   * @param {MidiMessageEvent} midiMessageEvent - midi Information
   */
  webmidi.midiInArrived = function midiInArrived(midiMessageEvent) {
      var t = midiMessageEvent.timeStamp;
      var a = midiMessageEvent.data[0];
      var b = midiMessageEvent.data[1];
      var c = midiMessageEvent.data[2];
      var eventObject = miditools.callBacks.raw(t, a, b, c);
      if (miditools.callBacks.general instanceof Array) {
          return miditools.callBacks.general.forEach(function (el, index, array) {
              el(eventObject);
          });
      } else if (miditools.callBacks.general !== undefined) {
          return miditools.callBacks.general(eventObject);
      } else {
          return undefined;
      }
  };

  /**
   * Create a hidden tiny, &lt;object&gt; tag in the DOM with the
   * proper classid (`CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90`) to
   * load the Jazz plugin.
   *
   * It will return the plugin if it can or undefined if it cannot. Caches it in webmidi.storedPlugin.
   *
   * @function music21.webmidi.createPlugin
   * @param {DOMObject} [appendElement=document.body] - where to place this hidden object (does not really matter)
   * @param {Boolean} [override=false] - if this method has been called successfully before return the storedPlugin unless override is true.
   * @returns {Jazz|undefined} Jazz MIDI plugin object
   */
  webmidi.createPlugin = function createPlugin(appendElement, override) {
      if (webmidi.storedPlugin && override !== true) {
          return webmidi.storedPlugin;
      }
      if (typeof appendElement === 'undefined') {
          appendElement = $$1('body')[0];
      }
      var obj = document.createElement('object');
      obj.classid = 'CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90';
      if (!obj.isJazz) {
          obj.type = 'audio/x-jazz';
      }
      obj.style.visibility = 'hidden';
      obj.style.width = '0px';
      obj.style.height = '0px';
      appendElement.appendChild(obj);

      if (obj.isJazz) {
          webmidi.storedPlugin = obj;
          return obj;
      } else {
          appendElement.removeChild(obj);
          console.error('Cannot use jazz plugin; install at ' + webmidi.jazzDownloadUrl);
          return undefined;
      }
  };

  /**
   * Creates a &lt;select&gt; object for selecting among the MIDI choices in Jazz
   *
   * @function music21.webmidi.createJazzSelector
   * @param {JQueryDOMObject|DOMObject} [midiSelectDiv=document.body] - object to append the select to
   * @param {object} [options] - see createSelector for details
   * @returns {DOMObject|undefined} DOM object containing the select tag, or undefined if Jazz cannot be loaded.
   */
  webmidi.createJazzSelector = function createJazzSelector($newSelect, options) {
      var params = {};
      common.merge(params, options);

      var Jazz = webmidi.createPlugin();
      if (Jazz === undefined) {
          return undefined;
      }

      $newSelect.change(function () {
          var selectedInput = $$1('#midiInSelect option:selected').text();
          if (selectedInput !== 'None selected') {
              webmidi.selectedJazzInterface = Jazz.MidiInOpen(selectedInput, webmidi.jazzMidiInArrived);
          } else {
              Jazz.MidiInClose();
          }
          if (debug) {
              console.log('current input changed to: ' + webmidi.selectedInterface);
          }
      });
      var midiOptions = Jazz.MidiInList();
      var noneAppendOption = $$1("<option value='None'>None selected</option>");
      $newSelect.append(noneAppendOption);

      var anySelected = false;
      var allAppendOptions = [];
      for (var i = 0; i < midiOptions.length; i++) {
          var $appendOption = $$1("<option value='" + midiOptions[i] + "'>" + midiOptions[i] + '</option>');
          if (midiOptions[i] === webmidi.selectedJazzInterface) {
              $appendOption.attr('selected', true);
              anySelected = true;
          }
          allAppendOptions.push($appendOption);
          // console.log(appendOption);
          $newSelect.append($appendOption);
      }
      if (anySelected === false && midiOptions.length > 0) {
          $newSelect.val(midiOptions[0]);
          allAppendOptions[0].attr('selected', true);
          webmidi.selectedJazzInterface = Jazz.MidiInOpen(midiOptions[0], webmidi.jazzMidiInArrived);
          anySelected = true;
      } else {
          noneAppendOption.attr('selected', true);
      }
      if (params.onsuccess !== undefined) {
          params.onsuccess();
      }
      if (anySelected === true && params.oninputsuccess !== undefined) {
          params.oninputsuccess();
      } else if (anySelected === false && params.oninputempty !== undefined) {
          params.oninputempty();
      }
      return $newSelect;
  };

  /**
   * Function to be called if the webmidi-api selection changes. (not jazz)
   *
   */
  webmidi.selectionChanged = function selectionChanged() {
      var selectedInput = webmidi.$select.val();
      if (selectedInput === webmidi.selectedInputPort) {
          return false;
      }
      var storedStateChange = webmidi.access.onstatechange; // port.close() fires onstatechange, so turn off for a moment.
      webmidi.access.onstatechange = function () {};
      if (debug) {
          console.log('current input changed to: ' + selectedInput);
      }
      webmidi.selectedInputPort = selectedInput;

      webmidi.access.inputs.forEach(function (port) {
          if (port.name === selectedInput) {
              port.onmidimessage = webmidi.midiInArrived;
          } else {
              port.close();
          }
      });
      webmidi.access.onstatechange = storedStateChange;
      return false;
  };

  /**
   * Creates a &lt;select&gt; object for selecting among the MIDI choices in Jazz
   *
   * The options object has several parameters:
   *
   * {bool} autoupdate -- should this auto update?
   * {function} onsuccess -- function to call on all successful port queries
   * {function} oninputsuccess -- function to call if successful and at least one input device is found
   * {function} oninputempty -- function to call if successful but no input devices are found.
   * {bool} existingMidiSelect -- is there already a select tag for MIDI?
   *
   * @function music21.webmidi.createSelector
   * @param {JQueryDOMObject|DOMObject} [$midiSelectDiv=$('body')] - object to append the select to
   * @param {object} [options] - see above.
   * @returns {DOMObject|undefined} DOM object containing the select tag, or undefined if Jazz cannot be loaded.
   */
  webmidi.createSelector = function createSelector($midiSelectDiv, options) {
      var params = {
          autoUpdate: true,
          existingMidiSelect: false
      };
      common.merge(params, options);

      if (typeof $midiSelectDiv === 'undefined') {
          $midiSelectDiv = $$1('body');
      }
      if ($midiSelectDiv.jquery === undefined) {
          $midiSelectDiv = $$1($midiSelectDiv);
      }
      var $newSelect = void 0;
      var foundMidiSelects = $midiSelectDiv.find('select#midiInSelect');
      if (foundMidiSelects.length > 0) {
          $newSelect = foundMidiSelects[0];
          params.existingMidiSelect = true;
      } else {
          $newSelect = $$1('<select>').attr('id', 'midiInSelect');
          $midiSelectDiv.append($newSelect);
      }
      webmidi.$select = $newSelect;

      if (navigator.requestMIDIAccess === undefined) {
          webmidi.createJazzSelector($newSelect, params);
      } else {
          if (params.existingMidiSelect !== true) {
              $newSelect.change(webmidi.selectionChanged);
          }
          navigator.requestMIDIAccess().then(function (access) {
              webmidi.access = access;
              webmidi.populateSelect();
              if (params.autoUpdate) {
                  access.onstatechange = webmidi.populateSelect;
              }
              webmidi.$select.change();
              if (params.onsuccess !== undefined) {
                  params.onsuccess();
              }
              if (webmidi.selectedInputPort !== 'None' && params.oninputsuccess !== undefined) {
                  params.oninputsuccess();
              } else if (webmidi.selectedInputPort === 'None' && params.oninputempty !== undefined) {
                  params.oninputempty();
              }
          }, function (e) {
              $midiSelectDiv.html(e.message);
          });
      }
      miditools.clearOldChords(); // starts the chord checking process.
      return $newSelect;
  };

  webmidi.populateSelect = function populateSelect() {
      var inputs = webmidi.access.inputs;
      webmidi.$select.empty();

      var $noneAppendOption = $$1("<option value='None'>None selected</option>");
      webmidi.$select.append($noneAppendOption);

      var allAppendOptions = [];
      var midiOptions = [];
      var i = 0;
      inputs.forEach(function (port) {
          var $appendOption = $$1("<option value='" + port.name + "'>" + port.name + '</option>');
          allAppendOptions.push($appendOption);
          midiOptions.push(port.name);
          // console.log(appendOption);
          webmidi.$select.append($appendOption);
          i += 1;
      });

      if (allAppendOptions.length > 0) {
          webmidi.$select.val(midiOptions[0]);
          allAppendOptions[0].attr('selected', true);
      } else {
          $noneAppendOption.attr('selected', true);
      }
      webmidi.$select.change();
  };

  // this allows for the deprecated webmidi.callBacks to still work for now.
  webmidi.callBacks = miditools.callBacks;

  /**
   * Example smallest usage of the webmidi toolkit.  see testHTML/midiInRequire.html

  <html>
  <head>
      <title>MIDI In/Jazz Test for Music21j</title>
      <!-- for MSIE 10 on Windows 8 -->
      <meta http-equiv="X-UA-Compatible" content="requiresActiveX=true"/>
      <script data-main="../src/music21.js" src="../ext/require/require.js"></script>
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />

      <script>
      var s = "";
      function displayStream(me) {
          me.sendToMIDIjs();
          if (me.noteOn) {
              var m21n = me.music21Note();
              if (s.length > 7) {
                  s.elements = s.elements.slice(1)
              }
              s.append(m21n);
              var $canvasDiv = $("#canvasDiv");
              $canvasDiv.empty();
              var canv = s.appendNewCanvas($canvasDiv);
          }
      }

      require(['music21'], function () {
          s = new music21.stream.Stream();
          music21.webmidi.createSelector($("#putMidiSelectHere"));
          music21.miditools.callBacks.general = displayStream;
      });


      </script>
  </head>
  <body>
  <div>
  MIDI Input: <div id="putMidiSelectHere" />
  </div>
  <div id="canvasDiv">
      <canvas />
  </div>
  </body>
  </html>
   **/

  /**
   * Widgets module -- random widgets.  See {@link music21.widgets}
   *
   * @exports music21/widgets
   */

  /**
   * Widgets module -- random widgets to make streams etc. work better
   *
   * To be added to
   *
   * @namespace music21.widgets
   * @memberof music21
   */
  var widgets = {};
  /**
   * A set of DOM Objects for choosing rhythms
   *
   * @class RhythmChooser
   * @memberof music21.widgets
   * @param {music21.stream.Stream} s - to append to, etc.
   * @param {DOMObject} c - canvas
   * @property {Array<string>} values - an array of rhythmic values and editing functions.
   *           Default: ['whole', 'half','quarter','eighth','16th','dot','undo']
   * @property {Boolean} measureMode - whether to use measures when editing
   * @property {Boolean} tieActive - is a tie active?
   * @property {Boolean} autoAddMeasure - add a measure when one is full? default: true
   * @property {music21.stream.Stream} stream
   * @property {DOMObject} [canvasDiv]
   */
  var RhythmChooser = function () {
      function RhythmChooser(streamObj, canvasDiv) {
          var _this = this;

          classCallCheck(this, RhythmChooser);

          this.stream = streamObj;
          this.canvasDiv = canvasDiv;
          this.values = ['whole', 'half', 'quarter', 'eighth', '16th', 'dot', 'undo'];

          if (this.stream.hasSubStreams()) {
              this.measureMode = true;
          } else {
              this.measureMode = false;
          }
          this.tieActive = false;
          this.autoAddMeasure = true;
          /**
           * A mapping of a type to a string of HTML entities to display in
           * BravuraText
           *
           * @name valueMappings
           * @type {object}
           * @memberof music21.widgets.RhythmChooser
           */
          this.valueMappings = {
              whole: '&#xEB9B;&#xE1D2;',
              half: '&#xEB9B;&#xE1D3;',
              quarter: '&#xEB9B;&#xE1D5;',
              eighth: '&#xEB9B;&#xE1D7;',
              '16th': '&#xEB9B;&#xE1D9;',
              '32nd': '&#xEB9B;&#xE1DB;', // BUG in Bravura Text
              addMeasure: '&#xE031',
              dot: '&#xEB9B;&#xE1E7;',
              undo: '&#x232B;',
              tie: '<span style="position: relative; top: -20px;">&#xE1FD</span>',
              rest_whole: '&#xE4F4;',
              rest_half: '&#xE4F5;',
              rest_quarter: '&#xE4E5;',
              rest_eighth: '&#xE4E6;',
              rest_16th: '&#xE4E7;',
              rest_32nd: '&#xE4E8;'
          };
          /**
           * A mapping of a type to a css style
           *
           * @name styles
           * @type {object}
           * @memberof music21.widgets.RhythmChooser
           */
          this.styles = {
              'undo': 'font-family: serif; font-size: 30pt; top: -7px;'
          };
          /**
           * An object mapping a value type to a function when it is clicked
           *
           * the 'default' value handles all types not otherwise given.
           *
           * Each function is passed the type that was clicked. Probably only
           * useful for 'default'
           *
           * @name buttonHandlers
           * @type {object}
           * @memberof music21.widgets.RhythmChooser#
           */
          this.buttonHandlers = {
              'undo': function undo(unused_t) {
                  if (_this.stream.length > 0) {
                      return _this.stream.pop();
                  } else {
                      return undefined;
                  }
              },
              'dot': function dot(unused_t) {
                  if (_this.stream.length > 0) {
                      var el = _this.stream.pop();
                      el.duration.dots += 1;
                      _this.stream.append(el);
                      return el;
                  } else {
                      return undefined;
                  }
              },
              'tie': function tie(unused_t) {
                  if (_this.stream.length > 0) {
                      var el = _this.stream.get(-1);
                      el.tie = new _tie.Tie('start');
                      _this.tieActive = true;
                      return el;
                  } else {
                      return undefined;
                  }
              },
              'default': function _default(buttonM21type) {
                  var newN = new note.Note('B4');
                  newN.stemDirection = 'up';
                  if (buttonM21type.indexOf('rest_') === 0) {
                      newN = new note.Rest();
                      buttonM21type = buttonM21type.slice('rest_'.length);
                  }
                  newN.duration.type = buttonM21type;
                  if (_this.tieActive) {
                      newN.tie = new _tie.Tie('stop');
                      _this.tieActive = false;
                  }
                  _this.stream.append(newN);
                  return newN;
              }
          };
          /**
           * An object mapping a value type to a function when it is clicked if the
           * RhythmChooser is in measureMode
           *
           * the 'default' value handles all types not otherwise given.
           *
           * Each function is passed the type that was clicked. Probably only
           * useful for 'default'
           *
           * @name measureButtonHandlers
           * @type {object}
           * @memberof music21.widgets.RhythmChooser#
           */
          this.measureButtonHandlers = {
              'undo': function undo(unused_t) {
                  if (_this.stream.length > 0) {
                      var lastMeasure = _this.stream.get(-1);
                      var retValue = lastMeasure.pop();
                      if (lastMeasure.length === 0 && _this.stream.length > 1) {
                          _this.stream.pop();
                      }
                      return retValue;
                  } else {
                      return undefined;
                  }
              },
              'dot': function dot(unused_t) {
                  if (_this.stream.length > 0) {
                      var lastMeasure = _this.stream.get(-1);
                      var el = lastMeasure.pop();
                      el.duration.dots += 1;
                      lastMeasure.append(el);
                      return el;
                  } else {
                      return undefined;
                  }
              },
              'addMeasure': function addMeasure(unused_t) {
                  var lastMeasure = _this.stream.get(-1);
                  var m = new stream.Measure();
                  m.renderOptions.staffLines = lastMeasure.renderOptions.staffLines;
                  m.renderOptions.measureIndex = lastMeasure.renderOptions.measureIndex + 1;
                  m.renderOptions.rightBarline = 'end';
                  lastMeasure.renderOptions.rightBarline = 'single';
                  m.autoBeam = lastMeasure.autoBeam;
                  _this.stream.append(m);
              },
              'tie': function tie(unused_t) {
                  var lastMeasure = _this.stream.get(-1);
                  var el = void 0;
                  if (lastMeasure.length > 0) {
                      el = lastMeasure.get(-1);
                  } else {
                      var previousMeasure = _this.stream.get(-2);
                      if (previousMeasure) {
                          el = previousMeasure.get(-1);
                      }
                  }
                  if (el !== undefined) {
                      var tieType = 'start';
                      if (el.tie !== undefined) {
                          tieType = 'continue';
                      }
                      el.tie = new _tie.Tie(tieType);
                      _this.tieActive = true;
                  }
              },
              'default': function _default(buttonM21type) {
                  var newN = new note.Note('B4');
                  newN.stemDirection = 'up';
                  if (buttonM21type.indexOf('rest_') === 0) {
                      newN = new note.Rest();
                      buttonM21type = buttonM21type.slice('rest_'.length);
                  }
                  newN.duration.type = buttonM21type;
                  if (_this.tieActive) {
                      newN.tie = new _tie.Tie('stop');
                      _this.tieActive = false;
                  }
                  var lastMeasure = _this.stream.get(-1);
                  if (_this.autoAddMeasure && lastMeasure.duration.quarterLength >= _this.stream.timeSignature.barDuration.quarterLength) {
                      _this.measureButtonHandlers.addMeasure.apply(_this, [buttonM21type]);
                      lastMeasure = _this.stream.get(-1);
                  }
                  lastMeasure.append(newN);
                  return newN;
              }
          };
      }
      /**
       * adds a RhythmChooser widget somewhere.
       *
       * @memberof music21.widgets.RhythmChooser
       * @param {DOMObject|JQueryDOMObject} where
       */


      createClass(RhythmChooser, [{
          key: 'addDiv',
          value: function addDiv(where) {
              var $where = where;
              if (where !== undefined && where.jquery === undefined) {
                  $where = $$1(where);
              }
              var $outer = $$1('<div class="rhythmButtonDiv"/>');
              for (var i = 0; i < this.values.length; i++) {
                  var value = this.values[i];
                  var entity = this.valueMappings[value];
                  var $inner = $$1('<button class="btButton" m21Type="' + value + '">' + entity + '</button>');
                  if (this.styles[value] !== undefined) {
                      $inner.attr('style', this.styles[value]);
                  }

                  $inner.click(function rhythmButtonDiv_click(value) {
                      this.handleButton(value);
                  }.bind(this, value));
                  $outer.append($inner);
              }
              if (where !== undefined) {
                  $where.append($outer);
              }
              return $outer;
          }
          /**
           * A button has been pressed! Call the appropriate handler and update the stream's canvas (if any)
           *
           * @memberof music21.widgets.RhythmChooser
           * @param {string} t - type of button pressed.
           */

      }, {
          key: 'handleButton',
          value: function handleButton(t) {
              var bhs = this.buttonHandlers;
              if (this.measureMode) {
                  bhs = this.measureButtonHandlers;
              }
              var bh = bhs[t];
              if (bh === undefined) {
                  bh = bhs['default'];
              }
              bh.apply(this, [t]);
              var s = this.stream;

              // redraw score if Part is part of score...
              if (s.isClassOrSubclass('Part') && s.activeSite !== undefined) {
                  s = s.activeSite;
              }
              if (this.canvasDiv !== undefined) {
                  s.replaceCanvas(this.canvasDiv);
              }
          }
      }]);
      return RhythmChooser;
  }();
  widgets.RhythmChooser = RhythmChooser;

  var Augmenter = function () {
      function Augmenter(streamObj, canvasDiv) {
          classCallCheck(this, Augmenter);

          this.streamObj = streamObj;
          this.canvasDiv = canvasDiv;
      }

      createClass(Augmenter, [{
          key: 'performChange',
          value: function performChange(amountToScale, streamObjToWorkOn) {
              var replaceCanvas = false;
              if (streamObjToWorkOn === undefined) {
                  replaceCanvas = true;
                  streamObjToWorkOn = this.streamObj;
              }
              for (var i = 0; i < streamObjToWorkOn.length; i++) {
                  var el = streamObjToWorkOn.get(i);
                  if (el.isStream === true) {
                      this.performChange(amountToScale, el);
                  } else {
                      el.duration.quarterLength *= amountToScale;
                  }
              }
              if (streamObjToWorkOn.timeSignature !== undefined) {
                  streamObjToWorkOn.timeSignature.denominator *= 1 / amountToScale;
              }

              if (this.canvasDiv !== undefined && replaceCanvas === true) {
                  this.canvasDiv = streamObjToWorkOn.replaceCanvas(this.canvasDiv);
              }
          }
      }, {
          key: 'makeSmaller',
          value: function makeSmaller() {
              return this.performChange(0.5);
          }
      }, {
          key: 'makeLarger',
          value: function makeLarger() {
              return this.performChange(2.0);
          }
      }, {
          key: 'addDiv',
          value: function addDiv($where) {
              var _this2 = this;

              var $newDiv = $$1('<div class="augmenterDiv" />');
              var $smaller = $$1('<button class="augmenterButton">Make Smaller</button>');
              var $larger = $$1('<button class="augmenterButton">Make Larger</button>');

              $smaller.on('click', function () {
                  _this2.makeSmaller();
              });
              $larger.on('click', function () {
                  _this2.makeLarger();
              });

              $newDiv.append($smaller);
              $newDiv.append($larger);

              $where.append($newDiv);
              return $newDiv;
          }
      }]);
      return Augmenter;
  }();

  widgets.Augmenter = Augmenter;

  // order below doesn't matter, but good to give a sense
  // of what will be needed by almost everyone, and then
  // alphabetical.
  var music21 = {};

  music21.common = common;
  music21.debug = debug;
  music21.prebase = prebase;
  music21.base = base;

  music21.articulations = articulations;
  music21.audioRecording = audioRecording;
  music21.audioSearch = audioSearch;
  music21.beam = beam;
  music21.chord = chord;
  music21.clef = clef;
  music21.dynamics = dynamics;
  music21.duration = duration;
  music21.exceptions21 = exceptions21;
  music21.expressions = expressions;
  music21.fromPython = fromPython;
  music21.instrument = instrument;
  music21.interval = interval;
  music21.key = key;
  music21.keyboard = keyboard;
  music21.layout = layout;
  music21.meter = meter;
  music21.miditools = miditools;
  music21.musicxml = musicxml;
  music21.note = note;
  music21.pitch = pitch;
  music21.renderOptions = renderOptions;
  music21.roman = roman;
  music21.scale = scale;
  music21.stream = stream;
  music21.streamInteraction = streamInteraction;
  music21.tempo = tempo;
  music21.tie = _tie;
  music21.tinyNotation = tinyNotation;
  music21.vfShow = vfShow;
  music21.webmidi = webmidi;
  music21.widgets = widgets;

  function tests() {
      QUnit.test('music21.articulations.Articulation', function (assert) {
          var acc = new music21.articulations.Accent();
          assert.equal(acc.name, 'accent', 'matching names for accent');
          var ten = new music21.articulations.Tenuto();
          assert.equal(ten.name, 'tenuto', 'matching names for tenuto');
          var n = new music21.note.Note('C');
          n.articulations.push(acc);
          n.articulations.push(ten);
          assert.equal(n.articulations[0].name, 'accent', 'accent in array');
          assert.equal(n.articulations[1].name, 'tenuto', 'tenuto in array');
      });

      QUnit.test('music21.articulations.Articulation display', function (assert) {
          // Marcato is a pseudo multiple inheritance
          var marc = new music21.articulations.Marcato();
          assert.equal(marc.name, 'marcato', 'matching names for marcato');
          var n = new music21.note.Note('D#5');
          n.articulations.push(marc);
          var nBoring = new music21.note.Note('D#5');

          var measure = new music21.stream.Measure();
          measure.append(n);
          measure.append(nBoring);
          measure.append(nBoring.clone());
          measure.append(n.clone());
          measure.appendNewCanvas();
          assert.ok(true, 'something worked');
      });
  }

  function tests$1() {
          QUnit.test('music21.beam.Beams', function (assert) {
                  var a = new music21.beam.Beams();
                  a.fill('16th');
                  a.setAll('start');
                  assert.equal(a.getTypes()[0], 'start');
                  assert.equal(a.getTypes()[1], 'start');

                  var b = new music21.beam.Beams();
                  b.fill('16th');
                  b.setAll('start');
                  b.setByNumber(1, 'continue');
                  assert.equal(b.beamsList[0].type, 'continue');
                  b.setByNumber(2, 'stop');
                  assert.equal(b.beamsList[1].type, 'stop');
                  b.setByNumber(2, 'partial-right');
                  assert.equal(b.beamsList[1].type, 'partial');
                  assert.equal(b.beamsList[1].direction, 'right');
          });
  }

  function tests$2() {
      QUnit.test('music21.chord.Chord', function (assert) {
          var c = new music21.chord.Chord(['C5', 'E5', 'G5']);

          assert.equal(c.length, 3, 'Checking length of Chord');
          assert.equal(c.isMajorTriad(), true, 'C E G should be a major triad');
          assert.equal(c.isMinorTriad(), false, 'C E G should not be minor triad');
          assert.equal(c.canBeTonic(), true, 'C E G can be a tonic');
      });
  }

  function tests$3() {
      QUnit.test('music21.clef.Clef', function (assert) {
          var c1 = new music21.clef.Clef();
          assert.equal(c1.isClassOrSubclass('Clef'), true, 'clef is a Clef');

          var ac = new music21.clef.AltoClef();
          assert.equal(ac.lowestLine, 25, 'first line set');
          var n = new music21.note.Note('C#4');
          n.setStemDirectionFromClef(ac);
          assert.equal(n.stemDirection, 'down', 'stem direction set');
          n.pitch.diatonicNoteNum -= 1;
          n.setStemDirectionFromClef(ac);
          assert.equal(n.stemDirection, 'up', 'stem direction set');
          n.pitch.diatonicNoteNum += 1;
          var p2 = ac.convertPitchToTreble(n.pitch);
          assert.equal(p2.nameWithOctave, 'B#4', 'converted to treble');
      });
      QUnit.test('music21.clef.Clef 8va', function (assert) {
          var ac = new music21.clef.Treble8vaClef();
          assert.equal(ac.lowestLine, 38, 'first line set');
          var n = new music21.note.Note('C#5');
          n.setStemDirectionFromClef(ac);
          assert.equal(n.stemDirection, 'up', 'stem direction set');
          var p2 = ac.convertPitchToTreble(n.pitch);
          assert.equal(p2.nameWithOctave, 'C#4', 'converted to treble');
          var s = new music21.stream.Stream();
          s.clef = ac;
          s.append(n);
          s.appendNewCanvas($('body'));
      });
  }

  function tests$4() {
      QUnit.test('music21.duration.Duration', function (assert) {
          var d = new music21.duration.Duration(1.0);
          assert.equal(d.type, 'quarter', 'got quarter note from 1.0');
          assert.equal(d.dots, 0, 'got no dots');
          assert.equal(d.quarterLength, 1.0, 'got 1.0 from 1.0');
          assert.equal(d.vexflowDuration, 'q', 'vexflow q');
          d.type = 'half';
          assert.equal(d.type, 'half', 'got half note from half');
          assert.equal(d.dots, 0, 'got no dots');
          assert.equal(d.quarterLength, 2.0, 'got 2.0 from half');
          assert.equal(d.vexflowDuration, 'h', 'vexflow h');
          d.quarterLength = 6.0;
          assert.equal(d.type, 'whole');
          assert.equal(d.dots, 1, 'got one dot from 6.0');
          assert.equal(d.quarterLength, 6.0, 'got 6.0');
          assert.equal(d.vexflowDuration, 'wd', 'vexflow duration wd');

          d.quarterLength = 7.75;
          assert.equal(d.type, 'whole');
          assert.equal(d.dots, 4, 'got four dots from 7.75');
      });

      QUnit.test('music21.duration.Tuplet', function (assert) {
          var d = new music21.duration.Duration(0.5);
          var t = new music21.duration.Tuplet(5, 4);
          assert.equal(t.tupletMultiplier(), 0.8, 'tuplet multiplier');
          d.appendTuplet(t);
          assert.equal(t.frozen, true, 'tuplet is frozen');
          assert.equal(d._tuplets[0], t, 'tuplet appended');
          assert.equal(d.quarterLength, 0.4, 'quarterLength Updated');

          var d2 = new music21.duration.Duration(1 / 3);
          assert.equal(d2.type, 'eighth', 'got eighth note from 1/3');
          assert.equal(d2.dots, 0, 'got no dots');
          assert.equal(d2.quarterLength, 1 / 3, 'got 1/3 from 1/3');
          var t2 = d2.tuplets[0];
          assert.equal(t2.numberNotesActual, 3, '3/2 tuplet');
          assert.equal(t2.numberNotesNormal, 2, '3/2 tuplet');
          assert.equal(t2.durationActual.quarterLength, 0.5);
          assert.equal(t2.tupletMultiplier(), 2 / 3, '2/3 tuplet multiplier');
          assert.equal(t2.totalTupletLength(), 1.0, 'total tuplet == 1.0');

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
          assert.ok(true, 'quarter note triplets displayed');

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
          assert.ok(true, 'tuplets beginning with different type than original');
          assert.equal(n6.duration.tuplets[0] !== n6clone.duration.tuplets[0], true, 'tuplet should not be the same object after clone');
      });
      QUnit.test('music21.duration.Tuplet multiple parts', function (assert) {
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
          s3.append(new music21.note.Note('B5', 6.0));
          var p = new music21.stream.Part();
          p.append(s2);
          p.append(s3);

          var m4 = new music21.stream.Measure();
          m4.timeSignature = new music21.meter.TimeSignature('3/2');
          m4.append(new music21.note.Note('B3', 6.0));
          var m5 = new music21.stream.Measure();
          m5.timeSignature = new music21.meter.TimeSignature('3/2');
          m5.append(new music21.note.Note('B3', 6.0));
          var p2 = new music21.stream.Part();
          p2.append(m4);
          p2.append(m5);

          var sc = new music21.stream.Score();
          sc.insert(0, p);
          sc.insert(0, p2);
          sc.appendNewCanvas();
          assert.ok(true, '5:4 tuplets in 3/2 with multiple parts');
      });
  }

  function tests$5() {
      QUnit.test('music21.dynamics.Dynamic', function (assert) {
          var dynamic = new music21.dynamics.Dynamic('pp');
          assert.equal(dynamic.value, 'pp', 'matching dynamic');

          dynamic = new music21.dynamics.Dynamic(0.98);
          assert.equal(dynamic.value, 'fff', 'number conversion successful');
          assert.equal(dynamic.volumeScalar, 0.98, 'correct volume');
          assert.equal(dynamic.longName, 'fortississimo', 'matching long name');
          assert.equal(dynamic.englishName, 'extremely loud', 'matching english names');

          dynamic = new music21.dynamics.Dynamic('other');
          assert.equal(dynamic.value, 'other', 'record non standard dynamic');
          assert.equal(dynamic.longName, undefined, 'no long name for non standard dynamic');
          assert.equal(dynamic.englishName, undefined, 'no english name for non standard dynamic');

          dynamic.value = 0.18;
          assert.equal(dynamic.value, 'pp', 'change in dynamic');
          assert.equal(dynamic.volumeScalar, 0.18, 'change in volume');

          dynamic.value = 'other';
          assert.equal(dynamic.value, 'other', 'change to non standard');
          assert.equal(dynamic.longName, undefined, 'change to non standard dynamic');
          assert.equal(dynamic.englishName, undefined, 'change to non standard dynamic');
      });
  }

  function tests$6() {
      QUnit.test('music21.key.Key', function (assert) {
          var testSharps = [
          // sharps, mode, given name, given mode
          [0, 'minor', 'a'], [0, 'major', 'C'], [0, 'major'], [6, 'major', 'F#'], [3, 'minor', 'f#'], [6, 'major', 'f#', 'major'], [-2, 'major', 'B-'], [-5, 'minor', 'b-']];
          for (var i = 0; i < testSharps.length; i++) {
              var thisTest = testSharps[i];
              var expectedSharps = thisTest[0];
              var expectedMode = thisTest[1];
              var givenKeyName = thisTest[2];
              var givenMode = thisTest[3];
              var _k = new music21.key.Key(givenKeyName, givenMode);
              var foundSharps = _k.sharps;
              var foundMode = _k.mode;
              assert.equal(foundSharps, expectedSharps, 'Test sharps: ' + givenKeyName + ' (mode: ' + givenMode + ') ');
              assert.equal(foundMode, expectedMode, 'Test mode: ' + givenKeyName + ' (mode: ' + givenMode + ') ');
          }

          var k = new music21.key.Key('f#');
          var s = k.getScale();
          assert.equal(s[2].nameWithOctave, 'A4', 'test minor scale');
          assert.equal(s[6].nameWithOctave, 'E5');
          s = k.getScale('major');
          assert.equal(s[2].nameWithOctave, 'A#4', 'test major scale');
          assert.equal(s[6].nameWithOctave, 'E#5');
          s = k.getScale('harmonic minor');
          assert.equal(s[2].nameWithOctave, 'A4', 'test harmonic minor scale');
          assert.equal(s[5].nameWithOctave, 'D5');
          assert.equal(s[6].nameWithOctave, 'E#5');

          assert.equal(k.width, 42, 'checking width');
      });
  }

  function tests$7() {
      QUnit.test('music21.note.Note', function (assert) {
          var n = new music21.note.Note('D#5');

          assert.equal(n.pitch.name, 'D#', 'Pitch Name set to D#');
          assert.equal(n.pitch.step, 'D', 'Pitch Step set to D');
          assert.equal(n.pitch.octave, 5, 'Pitch octave set to 5');
      });
  }

  function tests$8() {
      QUnit.test('music21.pitch.Accidental', function (assert) {
          var a = new music21.pitch.Accidental('-');
          assert.equal(a.alter, -1.0, 'flat alter passed');
          assert.equal(a.name, 'flat', 'flat name passed');
      });

      QUnit.test('music21.pitch.Pitch', function (assert) {
          var p = new music21.pitch.Pitch('D#5');
          assert.equal(p.name, 'D#', 'Pitch Name set to D#');
          assert.equal(p.step, 'D', 'Pitch Step set to D');
          assert.equal(p.octave, 5, 'Pitch octave set to 5');
          var c = new music21.clef.AltoClef();
          var vfn = p.vexflowName(c);
          assert.equal(vfn, 'C#/6', 'Vexflow name set');
      });
  }

  function tests$9() {
      QUnit.test('music21.roman.RomanNumeral', function (assert) {
          var t1 = 'IV';
          var rn1 = new music21.roman.RomanNumeral(t1, 'F');
          assert.equal(rn1.scaleDegree, 4, 'test scale dgree of F IV');
          var scale = rn1.scale;
          assert.equal(scale[0].name, 'F', 'test scale is F');
          assert.equal(rn1.root.name, 'B-', 'test root of F IV');
          assert.equal(rn1.impliedQuality, 'major', 'test quality is major');
          assert.equal(rn1.pitches[0].name, 'B-', 'test pitches[0] == B-');
          assert.equal(rn1.pitches[1].name, 'D', 'test pitches[1] == D');
          assert.equal(rn1.pitches[2].name, 'F', 'test pitches[2] == F');
          assert.equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');

          var t2 = 'viio7';
          rn1 = new music21.roman.RomanNumeral(t2, 'a');
          assert.equal(rn1.scaleDegree, 7, 'test scale dgree of A viio7');
          assert.equal(rn1.root.name, 'G#', 'test root name == G#');
          assert.equal(rn1.impliedQuality, 'diminished-seventh', 'implied quality');
          assert.equal(rn1.pitches[0].name, 'G#', 'test pitches[0] == G#');
          assert.equal(rn1.pitches[1].name, 'B', 'test pitches[1] == B');
          assert.equal(rn1.pitches[2].name, 'D', 'test pitches[2] == D');
          assert.equal(rn1.pitches[3].name, 'F', 'test pitches[3] == F');
          assert.equal(rn1.degreeName, 'Leading-tone', 'test is Leading-tone');

          t2 = 'V7';
          rn1 = new music21.roman.RomanNumeral(t2, 'a');
          assert.equal(rn1.scaleDegree, 5, 'test scale dgree of a V7');
          assert.equal(rn1.root.name, 'E', 'root name is E');
          assert.equal(rn1.impliedQuality, 'dominant-seventh', 'implied quality dominant-seventh');
          assert.equal(rn1.pitches[0].name, 'E', 'test pitches[0] == E');
          assert.equal(rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
          assert.equal(rn1.pitches[2].name, 'B', 'test pitches[2] == B');
          assert.equal(rn1.pitches[3].name, 'D', 'test pitches[3] == D');
          assert.equal(rn1.degreeName, 'Dominant', 'test is Dominant');

          t2 = 'VII';
          rn1 = new music21.roman.RomanNumeral(t2, 'f#');
          assert.equal(rn1.scaleDegree, 7, 'test scale dgree of a VII');
          assert.equal(rn1.root.name, 'E', 'root name is E');
          assert.equal(rn1.impliedQuality, 'major', 'implied quality major');
          assert.equal(rn1.pitches[0].name, 'E', 'test pitches[0] == E');
          assert.equal(rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
          assert.equal(rn1.pitches[2].name, 'B', 'test pitches[2] == B');
          assert.equal(rn1.degreeName, 'Subtonic', 'test is Subtonic');
      });

      QUnit.test('music21.roman.RomanNumeral - inversions', function (assert) {
          var t1 = 'IV';
          var rn1 = new music21.roman.RomanNumeral(t1, 'F');
          assert.equal(rn1.scaleDegree, 4, 'test scale dgree of F IV');
          var scale = rn1.scale;
          assert.equal(scale[0].name, 'F', 'test scale is F');
          assert.equal(rn1.root.name, 'B-', 'test root of F IV');
          assert.equal(rn1.impliedQuality, 'major', 'test quality is major');
          assert.equal(rn1.pitches[0].name, 'B-', 'test pitches[0] == B-');
          assert.equal(rn1.pitches[1].name, 'D', 'test pitches[1] == D');
          assert.equal(rn1.pitches[2].name, 'F', 'test pitches[2] == F');
          assert.equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');
      });
  }

  function tests$10() {
      QUnit.test('music21.stream.Stream', function (assert) {
          var s = new music21.stream.Stream();
          s.append(new music21.note.Note('C#5'));
          s.append(new music21.note.Note('D#5'));
          var n = new music21.note.Note('F5');
          n.duration.type = 'half';
          s.append(n);
          assert.equal(s.length, 3, 'Simple stream length');
      });

      QUnit.test('music21.stream.Stream.duration', function (assert) {
          var s = new music21.stream.Stream();
          assert.equal(s.duration.quarterLength, 0, 'EmptyString QuarterLength');

          s.append(new music21.note.Note('C#5'));
          assert.equal(s.duration.quarterLength, 1.0, '1 quarter QuarterLength');

          var n = new music21.note.Note('F5');
          n.duration.type = 'half';
          s.append(n);
          assert.equal(s.duration.quarterLength, 3.0, '3 quarter QuarterLength');

          s.duration = new music21.duration.Duration(3.0);
          s.append(new music21.note.Note('D#5'));
          assert.equal(s.duration.quarterLength, 3.0, 'overridden duration -- remains');

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
          assert.equal(sc.duration.quarterLength, 4.0, 'duration of streams with nested parts');
          assert.equal(sc.flat.duration.quarterLength, 4.0, 'duration of flat stream with overlapping notes');
          n21.duration.type = 'half';
          assert.equal(sc.duration.quarterLength, 3.5, 'new music21.duration with nested parts');
          assert.equal(sc.flat.duration.quarterLength, 3.5, 'new music21.duration of flat stream');
      });

      QUnit.test('music21.stream.Stream.insert and offsets', function (assert) {
          var s = new music21.stream.Stream();
          s.append(new music21.note.Note('C#5'));
          var n3 = new music21.note.Note('E5');
          s.insert(2.0, n3);
          var n2 = new music21.note.Note('D#5');
          s.insert(1.0, n2);
          assert.equal(s.get(0).name, 'C#');
          assert.equal(s.get(1).name, 'D#');
          assert.equal(s.get(2).name, 'E');
          assert.equal(s.get(0).offset, 0.0);
          assert.equal(s.get(1).offset, 1.0);
          assert.equal(s.get(2).offset, 2.0);
          var p = new music21.stream.Part();
          var m1 = new music21.stream.Measure();
          var n1 = new music21.note.Note('C#');
          n1.duration.type = 'whole';
          m1.append(n1);
          var m2 = new music21.stream.Measure();
          n2 = new music21.note.Note('D#');
          n2.duration.type = 'whole';
          m2.append(n2);
          p.append(m1);
          p.append(m2);
          assert.equal(p.get(0).get(0).offset, 0.0);
          var pf = p.flat;
          assert.equal(pf.get(1).offset, 4.0);
          var pf2 = p.flat; // repeated calls do not change
          assert.equal(pf2.get(1).offset, 4.0, 'repeated calls do not change offset');
          var pf3 = pf2.flat;
          assert.equal(pf3.get(1).offset, 4.0, '.flat.flat does not change offset');
      });

      QUnit.test('music21.stream.Stream.canvas', function (assert) {
          var s = new music21.stream.Stream();
          s.append(new music21.note.Note('C#5'));
          s.append(new music21.note.Note('D#5'));
          var n = new music21.note.Note('F5');
          n.duration.type = 'half';
          s.append(n);
          var c = s.createNewCanvas(100, 50);
          assert.equal(c.attr('width'), 100, 'stored width matches');
          assert.equal(c.attr('height'), 50, 'stored height matches');
      });

      QUnit.test('music21.stream.Stream.getElementsByClass', function (assert) {
          var s = new music21.stream.Stream();
          var n1 = new music21.note.Note('C#5');
          var n2 = new music21.note.Note('D#5');
          var r = new music21.note.Rest();
          var tc = new music21.clef.TrebleClef();
          s.append(tc);
          s.append(n1);
          s.append(r);
          s.append(n2);
          var c = s.getElementsByClass('Note');
          assert.equal(c.length, 2, 'got two notes');
          assert.equal(c.get(0), n1, 'n1 first');
          assert.equal(c.get(1), n2, 'n2 second');
          c = s.getElementsByClass('Clef');
          assert.equal(c.length, 1, 'got clef from subclass');
          c = s.getElementsByClass(['Note', 'TrebleClef']);
          assert.equal(c.length, 3, 'got multiple classes');
          c = s.getElementsByClass('GeneralNote');
          assert.equal(c.length, 3, 'got multiple subclasses');
      });
      QUnit.test('music21.stream.offsetMap', function (assert) {
          var n = new music21.note.Note('G3');
          var o = new music21.note.Note('A3');
          var s = new music21.stream.Measure();
          s.insert(0, n);
          s.insert(0.5, o);
          var om = s.offsetMap();
          assert.equal(om.length, 2, 'offsetMap should have length 2');
          var omn = om[0];
          var omo = om[1];
          assert.equal(omn.element, n, 'omn element should be n');
          assert.equal(omn.offset, 0.0, 'omn offset should be 0');
          assert.equal(omn.endTime, 1.0, 'omn endTime should be 1.0');
          assert.equal(omn.voiceIndex, undefined, 'omn voiceIndex should be undefined');
          assert.equal(omo.element, o, 'omo element should be o');
          assert.equal(omo.offset, 0.5, 'omo offset should be 0.5');
          assert.equal(omo.endTime, 1.5, 'omo endTime should be 1.5');
      });
      QUnit.test('music21.stream.Stream appendNewCanvas ', function (assert) {
          var n = new music21.note.Note('G3');
          var s = new music21.stream.Measure();
          s.append(n);
          s.appendNewCanvas(document.body);
          assert.equal(s.length, 1, 'ensure that should have one note');
          var n1 = new music21.note.Note('G3');
          var s1 = new music21.stream.Measure();
          s1.append(n1);
          var n2 = new music21.note.Note('G3');
          s1.append(n2);
          var n3 = new music21.note.Note('G3');
          s1.append(n3);
          var n4 = new music21.note.Note('G3');
          s1.append(n4);
          var sne1 = new music21.streamInteraction.SimpleNoteEditor(s1);
          var div1 = sne1.editableAccidentalCanvas();
          $(document.body).append(div1);
      });
  };

  function tests$11() {
      QUnit.test('music21.tie.Tie', function (assert) {
          var t = new music21.tie.Tie('start');
          assert.equal(t.type, 'start', 'Tie type is start');
      });
  }

  var allTests = {
          articulations: tests,
          beam: tests$1,
          chord: tests$2,
          clef: tests$3,
          duration: tests$4,
          dynamics: tests$5,
          key: tests$6,
          note: tests$7,
          pitch: tests$8,
          roman: tests$9,
          stream: tests$10,
          tie: tests$11
  };
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefined) {
          window.allTests = allTests;
  }

  return allTests;

})));
//# sourceMappingURL=music21.tests.js.map