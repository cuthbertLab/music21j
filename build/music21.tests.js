/**
 * music21j 0.9.0 built on  * 2018-08-17.
 * Copyright (c) 2013-2016 Michael Scott Cuthbert and cuthbertLab
 * BSD License, see LICENSE
 *
 * http://github.com/cuthbertLab/music21j
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('qunit'), require('vexflow'), require('MIDI'), require('jsonpickle'), require('jquery'), require('eventjs')) :
  typeof define === 'function' && define.amd ? define(['qunit', 'vexflow', 'MIDI', 'jsonpickle', 'jquery', 'eventjs'], factory) :
  (global.music21 = factory(global.QUnit,global.Vex,global.MIDI,global.jsonpickle,global.$,global.eventjs));
}(this, (function (QUnit,Vex,MIDI,jsonpickle,$$1,eventjs) { 'use strict';

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

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

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

  common.range = function common_range(start, stop, step) {
      if (step === undefined) {
          step = 1;
      }
      if (stop === undefined) {
          stop = start;
          start = 0;
      }

      var count = Math.ceil((stop - start) / step);
      return Array.apply(0, Array(count)).map(function (e, i) {
          return i * step + start;
      });
  };

  /**
   * Mix in another class into this class -- a simple form of multiple inheritance.
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
   * Aggregation -- closer to true multiple inheritance -- prefers last class's functions.  See
   * https://stackoverflow.com/questions/29879267/es6-class-multiple-inheritance
   *
   *  not currently used...
   */

  common.aggregation = function (baseClass) {
      for (var _len = arguments.length, mixins = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          mixins[_key - 1] = arguments[_key];
      }

      var base = function (_baseClass) {
          inherits(base, _baseClass);

          function base() {
              var _ref;

              classCallCheck(this, base);

              for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
              }

              var _this = possibleConstructorReturn(this, (_ref = base.__proto__ || Object.getPrototypeOf(base)).call.apply(_ref, [this].concat(args)));

              mixins.forEach(function (mixin) {
                  copyProps(_this, new mixin());
              });
              return _this;
          }

          return base;
      }(baseClass);

      var copyProps = function copyProps(target, source) {
          // this function copies all properties and symbols, filtering out some special ones
          Object.getOwnPropertyNames(source).concat(Object.getOwnPropertySymbols(source)).forEach(function (prop) {
              if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
                  Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
              }
          });
      };
      mixins.forEach(function (mixin) {
          // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
          copyProps(base.prototype, mixin.prototype);
          copyProps(base, mixin);
      });
      return base;
  };

  /**
   * posMod - return a modulo value that is not negative
   *
   * @param  {Int} a value
   * @param  {Int} b modulo
   * @return {Int}   a mod b between 0 and b - 1
   */

  common.posMod = function posMod(a, b) {
      if (a === undefined || b === undefined) {
          throw new Error('Modulo needs two numbers');
      }
      return (a % b + b) % b;
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
   * fromRoman - Convert a Roman numeral (upper or lower) to an int.
   *
   * @param  {string} num roman numeral representation of a number
   * @return {Int}     integer value of roman numeral;
   */

  common.fromRoman = function fromRoman(num) {
      var inputRoman = num.toUpperCase();
      var subtractionValues = [1, 10, 100];
      var nums = ['M', 'D', 'C', 'L', 'X', 'V', 'I'];
      var ints = [1000, 500, 100, 50, 10, 5, 1];
      var places = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
          for (var _iterator = inputRoman[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _c = _step.value;

              if (!nums.includes(_c)) {
                  throw new Error('Value is not a valid roman numeral: ' + inputRoman);
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

      for (var i = 0; i < inputRoman.length; i++) {
          var c = inputRoman[i];
          var value = ints[nums.indexOf(c)];
          if (i < inputRoman.length - 1) {
              var nextValue = ints[nums.indexOf(inputRoman[i + 1])];
              if (nextValue > value && subtractionValues.includes(value)) {
                  value *= -1;
              }
          }
          places.push(value);
      }
      var summation = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
          for (var _iterator2 = places[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var n = _step2.value;

              summation += n;
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

      return summation;
  };

  /**
   * toRoman - Convert a number from 1 to 3999 to a roman numeral
   *
   * @param  {Int} num number to convert
   * @return {string}     as roman numeral
   */

  common.toRoman = function toRoman(num) {
      if (typeof num !== 'number') {
          throw new Error('expected integer, got ' + (typeof num === 'undefined' ? 'undefined' : _typeof(num)));
      }
      if (num < 0 || num > 4000) {
          throw new Error('Argument must be between 1 and 3999');
      }
      var ints = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
      var nums = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
      var result = '';
      for (var i = 0; i < ints.length; i++) {
          var count = Math.floor(num / ints[i]);
          result += nums[i].repeat(count);
          num -= ints[i] * count;
      }
      return result;
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
  common.makeSVGright = function makeSVGright() {
      var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'svg';
      var attrs = arguments[1];

      // see http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
      // normal JQuery does not work.
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
              return { numerator: numerator, denominator: denominator };
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

  common.arrayEquals = function arrayEquals(a1, a2) {
      if (a1.length !== a2.length) {
          return false;
      }
      for (var i = 0; i < a1.length; i++) {
          if (a1[i] instanceof Array && a2[i] instanceof Array) {
              if (!arrayEquals(a1[i], a2[i])) {
                  return false;
              }
          } else if (a1[i] !== a2[i]) {
              return false;
          }
      }
      return true;
  };

  var _singletonCounter = {};
  _singletonCounter.value = 0;

  var SingletonCounter = function () {
      function SingletonCounter() {
          classCallCheck(this, SingletonCounter);
      }

      createClass(SingletonCounter, [{
          key: 'call',
          value: function call() {
              var post = _singletonCounter.value;
              _singletonCounter.value += 1;
              return post;
          }
      }]);
      return SingletonCounter;
  }();
  common.SingletonCounter = SingletonCounter;

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
              focus: v,
              focusin: v,
              pageshow: v,
              blur: h,
              focusout: h,
              pagehide: h
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
      var initialStateEvent = { type: initialState };
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
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
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

          this._storedClasses = undefined;
          this.isProtoM21Object = true;
          this.isMusic21Object = false;
          this._cloneCallbacks = {};
      }

      createClass(ProtoM21Object, [{
          key: 'clone',


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
          value: function clone() {
              var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

              if (!deep) {
                  return _extends(Object.create(Object.getPrototypeOf(this)), this);
              }

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
                  if (this.classes.includes(testClass[i])) {
                      return true;
                  }
              }
              return false;
          }
      }, {
          key: 'classes',
          get: function get() {
              if (this._storedClasses !== undefined) {
                  return this._storedClasses;
              }
              var classList = [];
              var thisConstructor = this.constructor;
              var maxLinks = 20;
              while (thisConstructor !== null && thisConstructor !== undefined && maxLinks) {
                  maxLinks -= 1;
                  if (thisConstructor.name === '') {
                      break;
                  }
                  classList.push(thisConstructor.name);
                  thisConstructor = Object.getPrototypeOf(thisConstructor);
              }
              classList.push('object');
              this._storedClasses = classList;
              return classList;
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
   * Based on music21, Copyright (c) 2006-18, Michael Scott Cuthbert and cuthbertLab
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

          _this._quarterLength = 0.0;
          _this._dots = 0;
          _this._durationNumber = undefined;
          _this._type = 'zero';
          _this._tuplets = [];
          if (typeof ql === 'string') {
              _this.type = ql;
          } else if (ql !== undefined) {
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
              this._tuplets = [];
              if (ql === 0) {
                  this._type = 'zero';
                  this._dots = 0;
                  return;
              }
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
              return;
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
   * Objects for keeping track of relationships among Music21Objects. See {@link music21.sites} namespace
   *
   * Copyright 2017, Michael Scott Cuthbert and cuthbertLab
   * License: BSD
   */

  /**
   * @namespace music21.sites
   * @memberof music21
   * @requires music21/common
   */
  var sites = {};

  var SitesException = function (_Music21Exception) {
      inherits(SitesException, _Music21Exception);

      function SitesException() {
          classCallCheck(this, SitesException);
          return possibleConstructorReturn(this, (SitesException.__proto__ || Object.getPrototypeOf(SitesException)).apply(this, arguments));
      }

      return SitesException;
  }(Music21Exception);
  sites.SitesException = SitesException;

  var SiteRef = function () {
      function SiteRef() {
          classCallCheck(this, SiteRef);

          this.isDead = false;
          this.classString = undefined;
          this.globalSiteIndex = false;
          this.siteIndex = undefined;
          this.siteWeakref = new WeakMap();
          this.siteWeakref.ref = undefined;
      }

      createClass(SiteRef, [{
          key: 'site',
          get: function get() {
              return this.siteWeakref.ref;
          },
          set: function set(newSite) {
              this.siteWeakref.ref = newSite;
          }
      }]);
      return SiteRef;
  }();
  sites.SiteRef = SiteRef;

  var _NoneSiteRef = new SiteRef();
  _NoneSiteRef.globalSiteIndex = -2;
  _NoneSiteRef.siteIndex = -2;

  var _singletonCounter$1 = new common.SingletonCounter();

  var GLOBAL_SITE_STATE_DICT = new WeakMap();

  sites.getId = function getId(obj) {
      if (!GLOBAL_SITE_STATE_DICT.has(obj)) {
          var newId = _singletonCounter$1.call();
          GLOBAL_SITE_STATE_DICT.set(obj, newId);
      }
      return GLOBAL_SITE_STATE_DICT.get(obj);
  };

  var Sites = function () {
      function Sites() {
          classCallCheck(this, Sites);

          this.siteDict = new Map();
          this.siteDict.set(_NoneSiteRef.siteIndex, _NoneSiteRef);
          this._siteIndex = 0;
          this._lastID = -1;
      }

      createClass(Sites, [{
          key: 'includes',
          value: function includes(checkSite) {
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = this.siteDict[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var _step$value = slicedToArray(_step.value, 2),
                          unused_key = _step$value[0],
                          siteRef = _step$value[1];

                      if (siteRef.site === checkSite) {
                          return true;
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

              return false;
          }
      }, {
          key: '_keysByTime',
          value: function _keysByTime() {
              var newFirst = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

              var post = [];
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = this.siteDict[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var _step2$value = slicedToArray(_step2.value, 2),
                          key = _step2$value[0],
                          siteRef = _step2$value[1];

                      var keyVal = [siteRef.siteIndex, key];
                      post.push(keyVal);
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

              post.sort();
              if (newFirst) {
                  post.reverse();
              }
              return post.map(function (innerList) {
                  return innerList[1];
              });
          }
      }, {
          key: 'add',
          value: function add(obj, idKey, classString) {
              if (idKey === undefined && obj !== undefined) {
                  idKey = sites.getId(obj);
              }
              var updateNotAdd = false;
              if (this.siteDict.has(idKey)) {
                  var tempSiteRef = this.siteDict.get(idKey);
                  if (!tempSiteRef.isDead && tempSiteRef.site !== undefined) {
                      updateNotAdd = true;
                  }
              }
              if (obj !== undefined && classString === undefined) {
                  classString = obj.classes[0];
              }

              var siteRef = void 0;
              if (updateNotAdd) {
                  siteRef = this.siteDict.get(idKey);
                  siteRef.isDead = false;
              } else {
                  siteRef = new SiteRef();
              }

              siteRef.site = obj; // stores a weakRef;
              siteRef.classString = classString;
              siteRef.siteIndex = this._siteIndex;
              this._siteIndex += 1;
              siteRef.globalSiteIndex = _singletonCounter$1.call();

              if (!updateNotAdd) {
                  this.siteDict.set(idKey, siteRef);
              }
          }
      }, {
          key: 'remove',
          value: function remove(obj) {
              var idKey = sites.getId(obj);
              if (idKey === undefined) {
                  return false;
              }
              return this.siteDict.delete(idKey);
          }
      }, {
          key: 'clear',
          value: function clear() {
              this.siteDict = new Map();
              this.siteDict.set(_NoneSiteRef.siteIndex, _NoneSiteRef);
              this._lastID = -1;
          }
      }, {
          key: 'yieldSites',
          value: regeneratorRuntime.mark(function yieldSites() {
              var sortByCreationTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
              var priorityTarget = arguments[1];
              var excludeNone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

              var keyRepository, priorityId, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, key, siteRef, obj;

              return regeneratorRuntime.wrap(function yieldSites$(_context) {
                  while (1) {
                      switch (_context.prev = _context.next) {
                          case 0:
                              keyRepository = void 0;

                              if (sortByCreationTime === true) {
                                  keyRepository = this._keysByTime(false);
                              } else if (sortByCreationTime === 'reverse') {
                                  keyRepository = this._keysByTime(true);
                              } else {
                                  keyRepository = Array.from(this.siteDict.keys());
                              }
                              if (priorityTarget !== undefined) {
                                  priorityId = sites.getId(priorityTarget);

                                  if (keyRepository.includes(priorityId)) {
                                      keyRepository.splice(0, 0, keyRepository.pop(keyRepository.indexOf(priorityId)));
                                  }
                              }
                              _iteratorNormalCompletion3 = true;
                              _didIteratorError3 = false;
                              _iteratorError3 = undefined;
                              _context.prev = 6;
                              _iterator3 = keyRepository[Symbol.iterator]();

                          case 8:
                              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                  _context.next = 27;
                                  break;
                              }

                              key = _step3.value;
                              siteRef = this.siteDict.get(key);

                              if (!(siteRef === _NoneSiteRef)) {
                                  _context.next = 17;
                                  break;
                              }

                              if (excludeNone) {
                                  _context.next = 15;
                                  break;
                              }

                              _context.next = 15;
                              return siteRef.site;

                          case 15:
                              _context.next = 24;
                              break;

                          case 17:
                              obj = siteRef.site;

                              if (!(obj === undefined)) {
                                  _context.next = 22;
                                  break;
                              }

                              siteRef.isDead = true;
                              _context.next = 24;
                              break;

                          case 22:
                              _context.next = 24;
                              return obj;

                          case 24:
                              _iteratorNormalCompletion3 = true;
                              _context.next = 8;
                              break;

                          case 27:
                              _context.next = 33;
                              break;

                          case 29:
                              _context.prev = 29;
                              _context.t0 = _context['catch'](6);
                              _didIteratorError3 = true;
                              _iteratorError3 = _context.t0;

                          case 33:
                              _context.prev = 33;
                              _context.prev = 34;

                              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                  _iterator3.return();
                              }

                          case 36:
                              _context.prev = 36;

                              if (!_didIteratorError3) {
                                  _context.next = 39;
                                  break;
                              }

                              throw _iteratorError3;

                          case 39:
                              return _context.finish(36);

                          case 40:
                              return _context.finish(33);

                          case 41:
                          case 'end':
                              return _context.stop();
                      }
                  }
              }, yieldSites, this, [[6, 29, 33, 41], [34,, 36, 40]]);
          })
      }, {
          key: 'get',
          value: function get() {
              var sortByCreationTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
              var priorityTarget = arguments[1];
              var excludeNone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

              var post = Array.from(this.yieldSites(sortByCreationTime, priorityTarget, excludeNone));

              // we do this resorting again, because the priority target might not match id and we
              // want to be extra safe.  If you want fast, use .yieldSites
              if (priorityTarget !== undefined) {
                  if (post.includes(priorityTarget)) {
                      post.splice(0, 0, post.pop(post.indexOf(priorityTarget)));
                  }
              }
              return post;
          }
      }, {
          key: 'getAttrByName',
          value: function getAttrByName(attrName) {
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                  for (var _iterator4 = this.yieldSites('reverse')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var obj = _step4.value;

                      if (obj === undefined) {
                          continue;
                      }
                      if (attrName in obj) {
                          return obj[attrName];
                      }
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

              return undefined;
          }
      }, {
          key: 'getObjByClass',
          value: function getObjByClass(className, options) {
              var params = {
                  callerFirst: this,
                  sortByCreationTime: false,
                  priorityTarget: undefined,
                  getElementMethod: 'getElementAtOrBefore',
                  memo: {}
              };
              common.merge(params, options);
              var memo = params.memo;
              var post = void 0;
              var objs = Array.from(this.yieldSites(params.sortByCreationTime, params.priorityTarget, true // excludeNone
              ));
              var classNameIsStr = typeof className === 'string';
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                  for (var _iterator5 = objs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                      var obj = _step5.value;

                      if (classNameIsStr) {
                          if (obj.classes.includes(className)) {
                              post = obj;
                              break;
                          }
                      } else if (obj instanceof className) {
                          post = obj;
                          break;
                      }
                  }
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

              if (post !== undefined) {
                  return post;
              }
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                  for (var _iterator6 = objs[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                      var _obj = _step6.value;

                      // TODO: check inside object... perhaps should not be done in m21p
                      var objId = sites.getId(_obj);
                      if (!(objId in memo)) {
                          memo[objId] = _obj;
                      }
                      post = _obj.getContextByClass(className, params);
                      if (post !== undefined) {
                          break;
                      }
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

              return post;
          }
      }, {
          key: 'length',
          get: function get() {
              return this.siteDict.size;
          }
      }]);
      return Sites;
  }();
  sites.Sites = Sites;

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
   * @requires music21/common
   * @requires music21/duration
   * @requires music21/prebase
   * @requires music21/sites
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
   * @property {number} offset - offset from the beginning of the stream (in quarterLength)
   * @property {number} priority - The priority (lower = earlier or more left) for elements at the same offset. (default 0)
   */
  var Music21Object = function (_prebase$ProtoM21Obje) {
      inherits(Music21Object, _prebase$ProtoM21Obje);

      function Music21Object(keywords) {
          classCallCheck(this, Music21Object);

          var _this = possibleConstructorReturn(this, (Music21Object.__proto__ || Object.getPrototypeOf(Music21Object)).call(this));

          _this.classSortOrder = 20; // default;

          _this.activeSite = undefined;
          _this.offset = 0; // for now
          _this._naiveOffset = 0;
          // this._activeSite = undefined;
          _this._activeSiteStoredOffset = undefined;

          // this._derivation = undefined;
          // this._style = undefined;
          // this._editorial = undefined;

          _this._duration = new duration.Duration();

          _this._priority = 0; // default;

          // this.id = sites.getId(this);
          _this.groups = [];
          // groups
          _this.sites = new sites.Sites();

          _this.isMusic21Object = true;
          _this.isStream = false;

          _this.groups = []; // custom object in m21p
          // this.sites, this.activeSites, this.offset -- not yet...
          // beat, measureNumber, etc.
          // lots to do...
          _this._cloneCallbacks.activeSite = function Music21Object_cloneCallbacks_activeSite(keyName, newObj, self) {
              newObj[keyName] = undefined;
          };
          _this._cloneCallbacks.sites = function Music21Object_cloneCallbacks_sites(keyName, newObj, self) {
              newObj[keyName] = new sites.Sites();
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
              var stringReturns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

              if (site === undefined) {
                  return this._naiveOffset;
              }
              return site.elementOffset(this, stringReturns);
          }

          /**
           * setOffsetBySite - sets the offset for a given Stream
           *
           * @memberof music21.base.Music21Object
           * @param  {music21.stream.Stream} site  Stream object
           * @param  {number} value offset
           */

      }, {
          key: 'setOffsetBySite',
          value: function setOffsetBySite(site, value) {
              if (site !== undefined) {
                  site.setElementOffset(this, value);
              } else {
                  this._naiveOffset = value;
              }
          }

          // ---------- Contexts -------------

      }, {
          key: 'getContextByClass',
          value: function getContextByClass(className, options) {
              var payloadExtractor = function payloadExtractor(useSite, flatten, positionStart, getElementMethod, classList) {
                  // this should all be done as a tree...
                  // do not use .flat or .semiFlat so as not
                  // to create new sites.

                  // VERY HACKY...
                  var lastElement = void 0;
                  for (var i = 0; i < useSite.length; i++) {
                      var indexOffset = useSite._elementOffsets[i];
                      var thisElement = useSite._elements[i];
                      var matchClass = thisElement.isClassOrSubclass(classList);
                      if (flatten === false && !matchClass) {
                          continue;
                      } else if (!thisElement.isStream && !matchClass) {
                          continue;
                      }
                      // is a stream or an element of the appropriate class...
                      // first check normal elements
                      if (getElementMethod.includes('Before') && indexOffset >= positionStart) {
                          if (getElementMethod.includes('At') && lastElement === undefined) {
                              lastElement = thisElement;
                          } else if (matchClass) {
                              return lastElement;
                          }
                      } else {
                          lastElement = thisElement;
                      }
                      if (getElementMethod.includes('After') && indexOffset > positionStart && matchClass) {
                          return thisElement;
                      }
                      // now cleck stream... already filtered out flatten == false;
                      if (thisElement.isStream) {
                          var potentialElement = payloadExtractor(thisElement, flatten, positionStart + indexOffset, getElementMethod, classList);
                          if (potentialElement !== undefined) {
                              return potentialElement;
                          }
                      }
                  }
                  return undefined;
              };

              var params = {
                  getElementMethod: 'getElementAtOrBefore',
                  sortByCreationTime: false
              };
              common.merge(params, options);

              var getElementMethod = params.getElementMethod;
              var sortByCreationTime = params.sortByCreationTime;

              if (className !== undefined && !(className instanceof Array)) {
                  className = [className];
              }
              if (getElementMethod.includes('At') && this.isClassOrSubclass(className)) {
                  return this;
              }

              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = this.contextSites({
                      returnSortTuples: true,
                      sortByCreationTime: sortByCreationTime
                  })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var _step$value = slicedToArray(_step.value, 3),
                          site = _step$value[0],
                          positionStart = _step$value[1],
                          searchType = _step$value[2];

                      if (getElementMethod.includes('At') && site.isClassOrSubclass(className)) {
                          return site;
                      }

                      if (searchType === 'elementsOnly' || searchType === 'elementsFirst') {
                          var contextEl = payloadExtractor(site, false, positionStart, getElementMethod, className);
                          if (contextEl !== undefined) {
                              contextEl.activeSite = site;
                              return contextEl;
                          }
                      } else if (searchType !== 'elementsOnly') {
                          if (getElementMethod.includes('After') && (className === undefined || site.isClassOrSubclass(className))) {
                              if (!getElementMethod.includes('NotSelf') && this !== site) {
                                  return site;
                              }
                          }
                          var _contextEl = payloadExtractor(site, 'semiFlat', positionStart, getElementMethod, className);
                          if (_contextEl !== undefined) {
                              _contextEl.activeSite = site;
                              return _contextEl;
                          }
                          if (getElementMethod.includes('Before') && (className === undefined || site.isClassOrSubclass(className))) {
                              if (!getElementMethod.includes('NotSelf') || this !== site) {
                                  return site;
                              }
                          }
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
      }, {
          key: 'contextSites',
          value: regeneratorRuntime.mark(function contextSites(options) {
              var params, memo, recursionType, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, siteObj, offsetInStream, newOffset, positionInStream, _recursionType, newParams, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _step3$value, topLevel, inStreamPos, recurType, inStreamOffset;

              return regeneratorRuntime.wrap(function contextSites$(_context) {
                  while (1) {
                      switch (_context.prev = _context.next) {
                          case 0:
                              params = {
                                  callerFirst: undefined,
                                  memo: [],
                                  offsetAppend: 0.0,
                                  sortByCreationTime: false,
                                  priorityTarget: undefined,
                                  returnSortTuples: false,
                                  followDerivation: true
                              };

                              common.merge(params, options);
                              memo = params.memo;

                              if (!(params.callerFirst === undefined)) {
                                  _context.next = 10;
                                  break;
                              }

                              params.callerFirst = this;

                              if (!(this.isStream && !(this in memo))) {
                                  _context.next = 9;
                                  break;
                              }

                              recursionType = this.recursionType;
                              _context.next = 9;
                              return [this, 0.0, recursionType];

                          case 9:
                              memo.push(this);

                          case 10:

                              if (params.priorityTarget === undefined && !params.sortByCreationType) {
                                  params.priorityTarget = this.activeSite;
                              }
                              // const topLevel = this;
                              _iteratorNormalCompletion2 = true;
                              _didIteratorError2 = false;
                              _iteratorError2 = undefined;
                              _context.prev = 14;
                              _iterator2 = this.sites.yieldSites(params.sortByCreationTime, params.priorityTarget, true // excludeNone
                              )[Symbol.iterator]();

                          case 16:
                              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                  _context.next = 62;
                                  break;
                              }

                              siteObj = _step2.value;

                              if (!memo.includes(siteObj)) {
                                  _context.next = 20;
                                  break;
                              }

                              return _context.abrupt('continue', 59);

                          case 20:
                              if (!siteObj.classes.includes('SpannerStorage')) {
                                  _context.next = 22;
                                  break;
                              }

                              return _context.abrupt('continue', 59);

                          case 22:

                              // let offset = this.getOffsetBySite(siteObj);
                              // followDerivation;
                              offsetInStream = siteObj.elementOffset(this);
                              newOffset = offsetInStream + params.offsetAppend;
                              positionInStream = newOffset;
                              _recursionType = siteObj.recursionType;
                              _context.next = 28;
                              return [siteObj, positionInStream, _recursionType];

                          case 28:
                              memo.push(siteObj);

                              newParams = {
                                  callerFirst: params.callerFirst,
                                  memo: memo,
                                  offsetAppend: positionInStream, // .offset
                                  returnSortTuples: true, // always!
                                  sortByCreationTime: params.sortByCreationTime
                              };
                              _iteratorNormalCompletion3 = true;
                              _didIteratorError3 = false;
                              _iteratorError3 = undefined;
                              _context.prev = 33;
                              _iterator3 = siteObj.contextSites(newParams)[Symbol.iterator]();

                          case 35:
                              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                  _context.next = 45;
                                  break;
                              }

                              _step3$value = slicedToArray(_step3.value, 3), topLevel = _step3$value[0], inStreamPos = _step3$value[1], recurType = _step3$value[2];
                              inStreamOffset = inStreamPos; // .offset;
                              // const hypotheticalPosition = inStreamOffset; // more complex w/ sortTuples

                              if (memo.includes(topLevel)) {
                                  _context.next = 42;
                                  break;
                              }

                              _context.next = 41;
                              return [topLevel, inStreamOffset, recurType];

                          case 41:
                              memo.push(topLevel);

                          case 42:
                              _iteratorNormalCompletion3 = true;
                              _context.next = 35;
                              break;

                          case 45:
                              _context.next = 51;
                              break;

                          case 47:
                              _context.prev = 47;
                              _context.t0 = _context['catch'](33);
                              _didIteratorError3 = true;
                              _iteratorError3 = _context.t0;

                          case 51:
                              _context.prev = 51;
                              _context.prev = 52;

                              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                  _iterator3.return();
                              }

                          case 54:
                              _context.prev = 54;

                              if (!_didIteratorError3) {
                                  _context.next = 57;
                                  break;
                              }

                              throw _iteratorError3;

                          case 57:
                              return _context.finish(54);

                          case 58:
                              return _context.finish(51);

                          case 59:
                              _iteratorNormalCompletion2 = true;
                              _context.next = 16;
                              break;

                          case 62:
                              _context.next = 68;
                              break;

                          case 64:
                              _context.prev = 64;
                              _context.t1 = _context['catch'](14);
                              _didIteratorError2 = true;
                              _iteratorError2 = _context.t1;

                          case 68:
                              _context.prev = 68;
                              _context.prev = 69;

                              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                  _iterator2.return();
                              }

                          case 71:
                              _context.prev = 71;

                              if (!_didIteratorError2) {
                                  _context.next = 74;
                                  break;
                              }

                              throw _iteratorError2;

                          case 74:
                              return _context.finish(71);

                          case 75:
                              return _context.finish(68);

                          case 76:
                          case 'end':
                              return _context.stop();
                      }
                  }
              }, contextSites, this, [[14, 64, 68, 76], [33, 47, 51, 59], [52,, 54, 58], [69,, 71, 75]]);
          })
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

          _this2.name = 'length-articulation';
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

          _this3.name = 'dynamic-articulation';
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

          _this4.name = 'pitch-articulation';
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

          _this5.name = 'timbre-articulation';
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

  Object.defineProperties(audioSearch, {
      audioContext: {
          get: function get() {
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
          set: function set(ac) {
              audioSearch._audioContext = ac;
          }
      }
  });

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
              audio: {
                  mandatory: {},
                  optional: []
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
                  audio: {
                      mandatory: {
                          googEchoCancellation: 'false',
                          googAutoGainControl: 'false',
                          googNoiseSuppression: 'false',
                          googHighpassFilter: 'false'
                          // 'echoCancellation': false,
                          // 'autoGainControl': false,
                          // 'noiseSuppression': false,
                          // 'highpassFilter': false,
                      },
                      optional: []
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
              var workerBlob = new Blob(['(', recorderWorkerJs, ')()'], {
                  type: 'application/javascript'
              });
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
                  command: command,
                  type: type
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
              if (window.AnalyserNode && !window.AnalyserNode.prototype.getFloatTimeDomainData) {
                  var uint8 = new Uint8Array(2048);
                  window.AnalyserNode.prototype.getFloatTimeDomainData = function getFloatTimeDomainData(array) {
                      this.getByteTimeDomainData(uint8);
                      var imax = array.length;
                      for (var i = 0; i < imax; i++) {
                          array[i] = (uint8[i] - 128) * 0.0078125;
                      }
                  };
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

  var audioRecording = { Recorder: Recorder };

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
      start: true,
      stop: true,
      continue: true,
      partial: true
  };

  beam.beamableDurationTypes = [duration.typeFromNumDict[8], duration.typeFromNumDict[16], duration.typeFromNumDict[32], duration.typeFromNumDict[64], duration.typeFromNumDict[128], duration.typeFromNumDict[256]];

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
      createClass(Beams, null, [{
          key: 'naiveBeams',
          value: function naiveBeams(srcList) {
              var beamsList = [];
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = srcList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var el = _step.value;

                      if (!beam.beamableDurationTypes.includes(el.duration.type)) {
                          beamsList.push(undefined);
                      } else if (el.isRest) {
                          beamsList.push(undefined);
                      } else {
                          var b = new beam.Beams();
                          b.fill(el.duration.type);
                          beamsList.push(b);
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

              return beamsList;
          }
      }, {
          key: 'removeSandwichedUnbeamables',
          value: function removeSandwichedUnbeamables(beamsList) {
              var beamLast = void 0;
              var beamNext = void 0;
              for (var i = 0; i < beamsList.length; i++) {
                  if (i !== beamsList.length - 1) {
                      beamNext = beamsList[i + 1];
                  } else {
                      beamNext = undefined;
                  }
                  if (beamLast === undefined && beamNext === undefined) {
                      beamsList[i] = undefined;
                  }
                  beamLast = beamsList[i];
              }
              return beamsList;
          }
      }, {
          key: 'sanitizePartialBeams',
          value: function sanitizePartialBeams(beamsList) {
              for (var i = 0; i < beamsList.length; i++) {
                  if (beamsList[i] === undefined) {
                      continue;
                  }
                  var allTypes = beamsList[i].getTypes();
                  if (!allTypes.includes('start') && !allTypes.includes('stop') && !allTypes.includes('continue')) {
                      // nothing but partials;
                      beamsList[i] = undefined;
                      continue;
                  }
                  var hasStart = false;
                  var hasStop = false;
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                      for (var _iterator2 = beamsList[i].beamsList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                          var b = _step2.value;

                          if (b.type === 'start') {
                              hasStart = true;
                              continue;
                          }
                          if (b.type === 'stop') {
                              hasStop = true;
                              continue;
                          }
                          if (hasStart && b.type === 'partial' && b.direction === 'left') {
                              b.direction = 'right';
                          } else if (hasStop && b.type === 'partial' && b.direction === 'right') {
                              b.direction = 'left';
                          }
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
              return beamsList;
          }
      }, {
          key: 'mergeConnectingPartialBeams',
          value: function mergeConnectingPartialBeams(beamsList) {
              for (var i = 0; i < beamsList.length - 1; i++) {
                  var bThis = beamsList[i];
                  var bNext = beamsList[i + 1];
                  if (!bThis || !bNext) {
                      continue;
                  }
                  var bThisNum = bThis.getNumbers();
                  if (!bThisNum || bThisNum.length === 0) {
                      continue;
                  }
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                      for (var _iterator3 = bThisNum[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                          var thisNum = _step3.value;

                          var thisBeam = bThis.getByNumber(thisNum);
                          if (thisBeam.type !== 'partial' || thisBeam.direction !== 'right') {
                              continue;
                          }
                          if (!bNext.getNumbers().includes(thisNum)) {
                              continue;
                          }
                          var nextBeam = bNext.getByNumber(thisNum);
                          if (nextBeam.type === 'partial' || nextBeam.direction === 'right') {
                              continue;
                          }
                          if (nextBeam.type === 'continue' || nextBeam.type === 'stop') {
                              // should not happen.
                              continue;
                          }
                          thisBeam.type = 'start';
                          thisBeam.direction = undefined;
                          if (nextBeam.type === 'partial') {
                              nextBeam.type = 'stop';
                          } else if (nextBeam.type === 'start') {
                              nextBeam.type = 'continue';
                          }
                          nextBeam.direction = undefined;
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
              }
              // now fix partial-lefts that follow stops:
              for (var _i = 1; _i < beamsList.length; _i++) {
                  var _bThis = beamsList[_i];
                  var bPrev = beamsList[_i - 1];
                  if (!_bThis || !bPrev) {
                      continue;
                  }
                  var _bThisNum = _bThis.getNumbers();
                  if (!_bThisNum || _bThisNum.length === 0) {
                      continue;
                  }
                  var _iteratorNormalCompletion4 = true;
                  var _didIteratorError4 = false;
                  var _iteratorError4 = undefined;

                  try {
                      for (var _iterator4 = _bThisNum[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                          var _thisNum = _step4.value;

                          var _thisBeam = _bThis.getByNumber(_thisNum);
                          if (_thisBeam.type !== 'partial' || _thisBeam.direction !== 'left') {
                              continue;
                          }
                          if (!bPrev.getNumbers().includes(_thisNum)) {
                              continue;
                          }
                          var prevBeam = bPrev.getByNumber(_thisNum);
                          if (prevBeam.type !== 'stop') {
                              continue;
                          }
                          _thisBeam.type = 'stop';
                          _thisBeam.direction = undefined;
                          prevBeam.type = 'continue';
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
              }
              return beamsList;
          }
      }]);

      function Beams() {
          classCallCheck(this, Beams);

          var _this2 = possibleConstructorReturn(this, (Beams.__proto__ || Object.getPrototypeOf(Beams)).call(this));

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
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                  for (var _iterator5 = this.beamsList[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                      var thisBeam = _step5.value;

                      if (thisBeam.number === number) {
                          return thisBeam;
                      }
                  }
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
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                  for (var _iterator6 = this.beamsList[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                      var thisBeam = _step6.value;

                      numbers.push(thisBeam.number);
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

              return numbers;
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
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21, Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
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
              } else if (accName === 'flat' || accName === '-' || accName === 'b' || accName === -1) {
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
              } else if (accName === 'quadruple-flat' || accName === '----' || accName === -4) {
                  this._name = 'quadruple-flat';
                  this._alter = -4.0;
                  this._modifier = '----';
                  this._unicodeModifier = '♭&#x1d12b;';
              } else if (accName === 'quadruple-sharp' || accName === '####' || accName === 4) {
                  this._name = 'quadruple-sharp';
                  this._alter = 4.0;
                  this._modifier = '####';
                  this._unicodeModifier = '&#x1d12a;';
              } else {
                  throw new Music21Exception('Accidental is not supported: ' + accName);
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
              this.set(n);
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
              this.set(alter);
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
              this.set(modifier);
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

  pitch.nameToMidi = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  pitch.nameToSteps = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
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

      function Pitch() {
          var pn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'C';
          classCallCheck(this, Pitch);

          var _this2 = possibleConstructorReturn(this, (Pitch.__proto__ || Object.getPrototypeOf(Pitch)).call(this));

          _this2._step = 'C';
          _this2._octave = 4;
          _this2._accidental = undefined;
          _this2.spellingIsInferred = false;

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

      // N.B. cannot use transpose here, because of circular import.

      createClass(Pitch, [{
          key: '_getEnharmonicHelper',


          /**
           * @param {boolean} inPlace
           * @param {Int} directionInt -- -1 = down, 1 = up
           */
          value: function _getEnharmonicHelper() {
              var inPlace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
              var directionInt = arguments[1];

              // differs from Python version because
              // cannot import interval here.
              var octaveStored = true;
              if (this.octave === undefined) {
                  octaveStored = false;
              }
              var p = this.clone();
              p.diatonicNoteNum += directionInt;
              if (p.accidental === undefined) {
                  p.accidental = new Accidental(0);
              }
              while (p.ps % 12 !== this.ps % 12) {
                  // octaveless
                  p.accidental.alter += -1 * directionInt;
              }

              if (!inPlace) {
                  return p;
              }
              this.step = p.step;
              this.accidental = p.accidental;
              if (p.microtone === undefined) {
                  this.microtone = p.microtone;
              }
              if (!octaveStored) {
                  this.octave = undefined;
              } else {
                  this.octave = p.octave;
              }
              return p;
          }
      }, {
          key: 'getHigherEnharmonic',
          value: function getHigherEnharmonic() {
              var inPlace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

              return this._getEnharmonicHelper(inPlace, 1);
          }
      }, {
          key: 'getLowerEnharmonic',
          value: function getLowerEnharmonic() {
              var inPlace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

              return this._getEnharmonicHelper(inPlace, -1);
          }
          /* TODO: isEnharmonic, getEnharmonic, getAllCommonEnharmonics */

          /**
           * Returns the vexflow name for the pitch in the given clef.
           *
           * @memberof music21.pitch.Pitch#
           * @param {clef.Clef} clefObj - the active {@link music21.clef.Clef} object
           * @returns {String} - representation in vexflow
           */

      }, {
          key: 'vexflowName',
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
              if (s === '') {
                  throw new TypeError('All notes must have a step');
              }
              if (typeof s !== 'string') {
                  throw new TypeError('Steps must be strings');
              }
              s = s.toUpperCase();
              if (!pitch.stepsToName.includes(s)) {
                  throw new TypeError(s + ' is not a valid step name.');
              }
              this._step = s;
              this.spellingIsInferred = false;
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
              this.spellingIsInferred = false;
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
              this.step = nn.slice(0, 1);
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
          key: 'pitchClass',
          get: function get() {
              var pc = common.posMod(Math.round(this.ps), 12);
              return pc;
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
              this.spellingIsInferred = true;
          }
      }, {
          key: 'unicodeName',
          get: function get() {
              if (this.accidental !== undefined) {
                  return this.step + this.accidental.unicodeModifier();
              } else {
                  return this.step;
              }
          }
      }, {
          key: 'unicodeNameWithOctave',
          get: function get() {
              if (this.octave === undefined) {
                  return this.unicodeName;
              } else {
                  return this.unicodeName + this.octave.toString();
              }
          }
      }]);
      return Pitch;
  }(prebase.ProtoM21Object);
  pitch.Pitch = Pitch;

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/interval -- Interval routines
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006-18, Michael Scott Cuthbert and cuthbertLab
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
   * if (music21.interval.Direction.OBLIQUE >
   *     music21.interval.Direction.ASCENDING ) {
   *    console.log(music21.interval.Direction.DESCENDING);
   * }
   *
   */
  interval.Direction = {
      DESCENDING: -1,
      OBLIQUE: 0,
      ASCENDING: 1
  };

  /**
   * N.B. a dict in music21p -- the indexes here let Direction call them + 1
   *
   * @memberof music21.interval
   * @example
   * console.log(music21.interval.IntervalDirectionTerms[music21l.interval.Direction.OBLIQUE + 1])
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
   * gi.direction == music21.interval.Direction.DESCENDING
   * // true
   * gi.isSkip
   * // true
   * gi.isStep
   * // false
   * gi.isDiatonicStep
   * // false  // augmented unisons are not diatonicSteps but can't tell yet..
   * gi.isUnison
   * // false
   * gi.simpledDirected
   * // -7
   * gi.simpleUndirected
   * // 7
   * gi.undirectedOctaves
   * // 1
   * gi.semiSimpleUndirected
   * // 7  -- semiSimple distinguishes between 8 and 1; that's all
   * gi.semiSimpleDirected
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

          if (gi === undefined) {
              gi = 1;
          }
          _this.value = gi; // todo: convertGeneric() from python
          _this.directed = _this.value;
          _this.undirected = Math.abs(_this.value);

          if (_this.directed === 1) {
              _this.direction = interval.Direction.OBLIQUE;
          } else if (_this.directed < 0) {
              _this.direction = interval.Direction.DESCENDING;
          } else if (_this.directed > 1) {
              _this.direction = interval.Direction.ASCENDING;
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

          var tempSteps = common.posMod(_this.undirected, 7);
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

          if (_this.direction === interval.Direction.DESCENDING) {
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

          if (_this.direction === interval.Direction.DESCENDING) {
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

              var _interval$convertDiat = interval.convertDiatonicNumberToStep(newDiatonicNumber),
                  _interval$convertDiat2 = slicedToArray(_interval$convertDiat, 2),
                  newStep = _interval$convertDiat2[0],
                  newOctave = _interval$convertDiat2[1];

              pitch2.step = newStep;
              pitch2.octave = newOctave;
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
      1: 0,
      2: 2,
      3: 4,
      4: 5,
      5: 7,
      6: 9,
      7: 11
  };
  interval.IntervalAdjustPerfect = {
      P: 0,
      A: 1,
      AA: 2,
      AAA: 3,
      AAAA: 4,
      d: -1,
      dd: -2,
      ddd: -3,
      dddd: -4
  }; // offset from Perfect

  interval.IntervalAdjustImperf = {
      M: 0,
      m: -1,
      A: 1,
      AA: 2,
      AAA: 3,
      AAAA: 4,
      d: -2,
      dd: -3,
      ddd: -4,
      dddd: -5
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
   * di.specifierAbbreviation;
   * // 'M'
   * di.name;
   * // 'M10'
   * di.direction == music21.interval.Direction.ASCENDING;
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
              _this2.direction = interval.Direction.DESCENDING;
          } else {
              _this2.direction = interval.Direction.ASCENDING;
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
          /* ( if (this.direction == interval.Direction.DESCENDING) {
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

              if (this.generic.direction === interval.Direction.DESCENDING) {
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
      }, {
          key: 'transposePitch',
          value: function transposePitch(p) {
              var fullIntervalObject = new Interval(this, this.getChromatic());
              return fullIntervalObject.transposePitch(p);
          }
      }, {
          key: 'specifierAbbreviation',
          get: function get() {
              return interval.IntervalPrefixSpecs[this.specifier];
          }
      }, {
          key: 'cents',
          get: function get() {
              return this.getChromatic().cents;
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

          _this3.semitones = value;
          _this3.cents = Math.round(value * 100.0, 5);
          _this3.directed = value;
          _this3.undirected = Math.abs(value);

          if (_this3.directed === 0) {
              _this3.direction = interval.Direction.OBLIQUE;
          } else if (_this3.directed === _this3.undirected) {
              _this3.direction = interval.Direction.ASCENDING;
          } else {
              _this3.direction = interval.Direction.DESCENDING;
          }

          _this3.mod12 = common.posMod(_this3.semitones, 12);
          _this3.simpleUndirected = common.posMod(_this3.undirected, 12);
          if (_this3.direction === interval.Direction.DESCENDING) {
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
   * @function music21.interval.convertDiatonicNumberToStep
   * @memberof music21.interval
   * @param {Int} dn - diatonic number, where 29 = C4, C#4 etc.
   * @returns {Array} two element array of {string} stepName and {Int} octave
   */
  interval.convertDiatonicNumberToStep = function convertDiatonicNumberToStep(dn) {
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

          // todo: allow full range of ways of specifying as in m21p
          var _this4 = possibleConstructorReturn(this, (Interval.__proto__ || Object.getPrototypeOf(Interval)).call(this));

          for (var _len = arguments.length, restArgs = Array(_len), _key = 0; _key < _len; _key++) {
              restArgs[_key] = arguments[_key];
          }

          if (restArgs.length === 1) {
              var arg0 = restArgs[0];
              if (typeof arg0 === 'string') {
                  // simple...
                  var specifier = arg0.replace(/\d+/, '').replace(/-/, '');
                  var generic = parseInt(arg0.replace(/\D+/, ''));
                  if (arg0.includes('-')) {
                      generic *= -1;
                  }
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

  interval.intervalFromGenericAndChromatic = function intervalFromGenericAndChromatic(gInt, cInt) {
      if (typeof gInt === 'number') {
          gInt = new GenericInterval(gInt);
      }
      if (typeof cInt === 'number') {
          cInt = new ChromaticInterval(cInt);
      }
      var specifier = interval._getSpecifierFromGenericChromatic(gInt, cInt);
      var dInt = new DiatonicInterval(specifier, gInt);
      return new Interval(dInt, cInt);
  };
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
      if (gInt.direction !== cInt.direction && gInt.direction !== interval.Direction.OBLIQUE && cInt.direction !== interval.Direction.OBLIQUE) {
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
   * music21/note -- Note, Rest, NotRest, GeneralNote
   *
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
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

  note.noteheadTypeNames = ['arrow down', 'arrow up', 'back slashed', 'circle dot', 'circle-x', 'circled', 'cluster', 'cross', 'diamond', 'do', 'fa', 'inverted triangle', 'la', 'left triangle', 'mi', 'none', 'normal', 'other', 're', 'rectangle', 'slash', 'slashed', 'so', 'square', 'ti', 'triangle', 'x'];

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

      function Lyric(text) {
          var number = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
          var syllabic = arguments[2];
          var applyRaw = arguments[3];
          var identifier = arguments[4];
          classCallCheck(this, Lyric);

          var _this = possibleConstructorReturn(this, (Lyric.__proto__ || Object.getPrototypeOf(Lyric)).call(this));

          _this.lyricConnector = '-'; // override to place something else between two notes...
          _this.text = text;
          _this._number = number;
          _this.syllabic = syllabic;
          _this.applyRaw = applyRaw || false;
          _this.setTextAndSyllabic(_this.text, _this.applyRaw);
          _this._identifier = identifier;
          _this.style = {
              fillStyle: 'black',
              strokeStyle: 'black',
              fontFamily: 'Serif',
              fontSize: 12,
              fontWeight: ''
          };
          return _this;
      }

      createClass(Lyric, [{
          key: 'setTextAndSyllabic',


          /**
           * setTextAndSyllabic - Given a setting for rawText and applyRaw,
           *     sets the syllabic type for a lyric based on the rawText
           *
           * @param  {string} rawText text
           * @param  {boolean} applyRaw = false if hyphens should not be applied
           * @return {undefined}
           */
          value: function setTextAndSyllabic(rawText) {
              var applyRaw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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

          /**
           * get rawText - gets the raw text.
           *
           * @return {string}  raw text
           */

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
              this.setTextAndSyllabic(t, true);
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

          _this2.isChord = false;
          if (ql !== undefined) {
              _this2.duration.quarterLength = ql;
          } else {
              _this2.duration.quarterLength = 1.0;
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
          value: function addLyric(text, lyricNumber) {
              var applyRaw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
              var lyricIdentifier = arguments[3];

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
          value: function playMidi() {
              var tempo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 120;
              var nextElement = arguments[1];
              var options = arguments[2];

              // returns the number of milliseconds to the next element in
              // case that can't be determined otherwise.
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
   * @property {string} [noteheadFill='default'] - notehead fill (to be moved to style...)
   * @property {string|undefined} [noteheadColor=undefined] - notehead color
   * @property {boolean} [noteheadParenthesis=false] - put a parenthesis around the notehead?
   * @property {string|undefined} [stemDirection=undefined] - One of ['up','down','noStem', undefined] -- 'double' not supported
   */
  var NotRest = function (_GeneralNote) {
      inherits(NotRest, _GeneralNote);

      function NotRest(ql) {
          classCallCheck(this, NotRest);

          var _this3 = possibleConstructorReturn(this, (NotRest.__proto__ || Object.getPrototypeOf(NotRest)).call(this, ql));

          _this3.notehead = 'normal';
          _this3.noteheadFill = 'default';
          _this3.noteheadColor = 'black';
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
                  vfn.setStyle({ fillStyle: this.noteheadColor, strokeStyle: this.noteheadColor });
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
   * @property {string|undefined} [color='black'] - color of the rest
   */
  var Rest = function (_GeneralNote2) {
      inherits(Rest, _GeneralNote2);

      function Rest(ql) {
          classCallCheck(this, Rest);

          var _this5 = possibleConstructorReturn(this, (Rest.__proto__ || Object.getPrototypeOf(Rest)).call(this, ql));

          _this5.isNote = false; // for speed
          _this5.isRest = true; // for speed
          _this5.name = 'rest'; // for note compatibility
          _this5.lineShift = undefined;
          _this5.color = 'black';
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

              var vfn = new Vex.Flow.StaveNote({
                  keys: [keyLine],
                  duration: this.duration.vexflowDuration + 'r'
              });
              if (this.duration.dots > 0) {
                  for (var i = 0; i < this.duration.dots; i++) {
                      vfn.addDotToAll();
                  }
              }
              if (this.color !== undefined) {
                  vfn.setStyle({ fillStyle: this.color, strokeStyle: this.color });
              }
              this.activeVexflowNote = vfn;
              return vfn;
          }
      }]);
      return Rest;
  }(GeneralNote);
  note.Rest = Rest;

  /* ------ SpacerRest ------ */

  var posMod = common.posMod;

  var t1 = void 0;
  var t2 = void 0;
  var t3 = void 0;
  var t4 = void 0;
  var t5 = void 0;
  var t6 = void 0;
  var t7 = void 0;
  var t8 = void 0;
  var t9 = void 0;
  var t10 = void 0;
  var t11 = void 0;
  var t12 = void 0;
  var t13 = void 0;
  var t14 = void 0;
  var t15 = void 0;
  var t16 = void 0;
  var t17 = void 0;
  var t18 = void 0;
  var t19 = void 0;
  var t20 = void 0;
  var t21 = void 0;
  var t22 = void 0;
  var t23 = void 0;
  var t24 = void 0;
  var t25 = void 0;
  var t26 = void 0;
  var t27 = void 0;
  var t28 = void 0;
  var t29 = void 0;
  var t30 = void 0;
  var t31 = void 0;
  var t32 = void 0;
  var t33 = void 0;
  var t34 = void 0;
  var t35 = void 0;
  var t36 = void 0;
  var t37 = void 0;
  var t38 = void 0;

  t1 = [[0], [0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 11, 11, 11, 11], 0]; // 1-1
  var monad = [undefined, t1];

  t1 = [[0, 1], [1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 9, 9, 8, 8], 0]; // 2-1
  t2 = [[0, 2], [0, 1, 0, 0, 0, 0], [1, 1, 1, 1, 9, 9, 9, 9], 0]; // 2-2
  t3 = [[0, 3], [0, 0, 1, 0, 0, 0], [1, 1, 1, 1, 9, 9, 9, 9], 0]; // 2-3
  t4 = [[0, 4], [0, 0, 0, 1, 0, 0], [1, 1, 1, 1, 9, 9, 9, 9], 0]; // 2-4
  t5 = [[0, 5], [0, 0, 0, 0, 1, 0], [1, 1, 0, 0, 9, 9, 8, 8], 0]; // 2-5
  t6 = [[0, 6], [0, 0, 0, 0, 0, 1], [2, 2, 2, 2, 10, 10, 10], 0]; // 2-6
  var diad = [undefined, t1, t2, t3, t4, t5, t6];

  t1 = [[0, 1, 2], [2, 1, 0, 0, 0, 0], [1, 1, 0, 0, 7, 7, 4, 4], 0]; // 3-1
  t2 = [[0, 1, 3], [1, 1, 1, 0, 0, 0], [1, 0, 0, 0, 5, 6, 5, 5], 0]; // 3-2
  t3 = [[0, 1, 4], [1, 0, 1, 1, 0, 0], [1, 0, 0, 0, 5, 6, 5, 5], 0]; // 3-3
  t4 = [[0, 1, 5], [1, 0, 0, 1, 1, 0], [1, 0, 1, 0, 5, 6, 5, 6], 0]; // 3-4
  t5 = [[0, 1, 6], [1, 0, 0, 0, 1, 1], [1, 0, 0, 1, 6, 7, 7, 6], 0]; // 3-5
  t6 = [[0, 2, 4], [0, 2, 0, 1, 0, 0], [1, 1, 1, 1, 7, 7, 7, 7], 0]; // 3-6
  t7 = [[0, 2, 5], [0, 1, 1, 0, 1, 0], [1, 0, 0, 0, 5, 6, 5, 5], 0]; // 3-7
  t8 = [[0, 2, 6], [0, 1, 0, 1, 0, 1], [1, 0, 0, 1, 6, 7, 7, 6], 0]; // 3-8
  t9 = [[0, 2, 7], [0, 1, 0, 0, 2, 0], [1, 1, 0, 0, 7, 7, 4, 4], 0]; // 3-9
  t10 = [[0, 3, 6], [0, 0, 2, 0, 0, 1], [1, 1, 1, 1, 8, 8, 8, 8], 0]; // 3-10
  t11 = [[0, 3, 7], [0, 0, 1, 1, 1, 0], [1, 0, 0, 0, 5, 6, 5, 5], 0]; // 3-11
  t12 = [[0, 4, 8], [0, 0, 0, 3, 0, 0], [3, 3, 3, 3, 9, 9, 9, 9], 0]; // 3-12
  var trichord = [undefined, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12];

  t1 = [[0, 1, 2, 3], [3, 2, 1, 0, 0, 0], [1, 1, 0, 0, 5, 5, 1, 1], 0]; // 4-1
  t2 = [[0, 1, 2, 4], [2, 2, 1, 1, 0, 0], [1, 0, 0, 0, 3, 4, 1, 1], 0]; // 4-2
  t3 = [[0, 1, 3, 4], [2, 1, 2, 1, 0, 0], [1, 1, 0, 0, 3, 3, 2, 2], 0]; // 4-3
  t4 = [[0, 1, 2, 5], [2, 1, 1, 1, 1, 0], [1, 0, 0, 0, 1, 3, 2, 3], 0]; // 4-4
  t5 = [[0, 1, 2, 6], [2, 1, 0, 1, 1, 1], [1, 0, 0, 0, 2, 4, 3, 2], 0]; // 4-5
  t6 = [[0, 1, 2, 7], [2, 1, 0, 0, 2, 1], [1, 1, 1, 1, 4, 4, 4, 4], 0]; // 4-6
  t7 = [[0, 1, 4, 5], [2, 0, 1, 2, 1, 0], [1, 1, 0, 0, 3, 3, 3, 3], 0]; // 4-7
  t8 = [[0, 1, 5, 6], [2, 0, 0, 1, 2, 1], [1, 1, 1, 1, 4, 4, 4, 4], 0]; // 4-8
  t9 = [[0, 1, 6, 7], [2, 0, 0, 0, 2, 2], [2, 2, 2, 2, 6, 6, 6, 6], 0]; // 4-9
  t10 = [[0, 2, 3, 5], [1, 2, 2, 0, 1, 0], [1, 1, 1, 1, 3, 3, 3, 3], 0]; // 4-10
  t11 = [[0, 1, 3, 5], [1, 2, 1, 1, 1, 0], [1, 0, 1, 0, 1, 3, 1, 3], 0]; // 4-11
  t12 = [[0, 2, 3, 6], [1, 1, 2, 1, 0, 1], [1, 0, 0, 0, 2, 4, 3, 2], 0]; // 4-12
  t13 = [[0, 1, 3, 6], [1, 1, 2, 0, 1, 1], [1, 0, 0, 1, 2, 4, 4, 2], 0]; // 4-13
  t14 = [[0, 2, 3, 7], [1, 1, 1, 1, 2, 0], [1, 0, 0, 0, 1, 3, 2, 3], 0]; // 4-14
  t15 = [[0, 1, 4, 6], [1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 3, 3, 1], 29]; // 4-15z
  t16 = [[0, 1, 5, 7], [1, 1, 0, 1, 2, 1], [1, 0, 0, 0, 2, 4, 3, 2], 0]; // 4-16
  t17 = [[0, 3, 4, 7], [1, 0, 2, 2, 1, 0], [1, 1, 1, 1, 3, 3, 3, 3], 0]; // 4-17
  t18 = [[0, 1, 4, 7], [1, 0, 2, 1, 1, 1], [1, 0, 0, 1, 2, 4, 4, 2], 0]; // 4-18
  t19 = [[0, 1, 4, 8], [1, 0, 1, 3, 1, 0], [1, 0, 1, 0, 3, 5, 3, 5], 0]; // 4-19
  t20 = [[0, 1, 5, 8], [1, 0, 1, 2, 2, 0], [1, 1, 0, 0, 3, 3, 3, 3], 0]; // 4-20
  t21 = [[0, 2, 4, 6], [0, 3, 0, 2, 0, 1], [1, 1, 1, 1, 6, 6, 6, 6], 0]; // 4-21
  t22 = [[0, 2, 4, 7], [0, 2, 1, 1, 2, 0], [1, 0, 0, 0, 3, 4, 1, 1], 0]; // 4-22
  t23 = [[0, 2, 5, 7], [0, 2, 1, 0, 3, 0], [1, 1, 0, 0, 5, 5, 1, 1], 0]; // 4-23
  t24 = [[0, 2, 4, 8], [0, 2, 0, 3, 0, 1], [1, 1, 1, 1, 6, 6, 6, 6], 0]; // 4-24
  t25 = [[0, 2, 6, 8], [0, 2, 0, 2, 0, 2], [2, 2, 2, 2, 6, 6, 6, 6], 0]; // 4-25
  t26 = [[0, 3, 5, 8], [0, 1, 2, 1, 2, 0], [1, 1, 0, 0, 3, 3, 2, 2], 0]; // 4-26
  t27 = [[0, 2, 5, 8], [0, 1, 2, 1, 1, 1], [1, 0, 0, 0, 2, 4, 3, 2], 0]; // 4-27
  t28 = [[0, 3, 6, 9], [0, 0, 4, 0, 0, 2], [4, 4, 4, 4, 8, 8, 8, 8], 0]; // 4-28
  t29 = [[0, 1, 3, 7], [1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 3, 3, 1], 15]; // 4-29z
  var tetrachord = [undefined, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29];

  t1 = [[0, 1, 2, 3, 4], [4, 3, 2, 1, 0, 0], [1, 1, 0, 0, 3, 3, 0, 0], 0]; // 5-1
  t2 = [[0, 1, 2, 3, 5], [3, 3, 2, 1, 1, 0], [1, 0, 0, 0, 1, 2, 1, 1], 0]; // 5-2
  t3 = [[0, 1, 2, 4, 5], [3, 2, 2, 2, 1, 0], [1, 0, 0, 0, 1, 1, 1, 0], 0]; // 5-3
  t4 = [[0, 1, 2, 3, 6], [3, 2, 2, 1, 1, 1], [1, 0, 0, 0, 0, 2, 0, 0], 0]; // 5-4
  t5 = [[0, 1, 2, 3, 7], [3, 2, 1, 1, 2, 1], [1, 0, 0, 0, 0, 1, 1, 1], 0]; // 5-5
  t6 = [[0, 1, 2, 5, 6], [3, 1, 1, 2, 2, 1], [1, 0, 0, 0, 0, 1, 1, 1], 0]; // 5-6
  t7 = [[0, 1, 2, 6, 7], [3, 1, 0, 1, 3, 2], [1, 0, 0, 1, 2, 3, 3, 2], 0]; // 5-7
  t8 = [[0, 2, 3, 4, 6], [2, 3, 2, 2, 0, 1], [1, 1, 0, 0, 2, 2, 0, 0], 0]; // 5-8
  t9 = [[0, 1, 2, 4, 6], [2, 3, 1, 2, 1, 1], [1, 0, 0, 0, 0, 2, 0, 1], 0]; // 5-9
  t10 = [[0, 1, 3, 4, 6], [2, 2, 3, 1, 1, 1], [1, 0, 0, 0, 0, 1, 1, 0], 0]; // 5-10
  t11 = [[0, 2, 3, 4, 7], [2, 2, 2, 2, 2, 0], [1, 0, 1, 0, 1, 1, 1, 1], 0]; // 5-11
  t12 = [[0, 1, 3, 5, 6], [2, 2, 2, 1, 2, 1], [1, 1, 1, 1, 0, 0, 0, 0], [36]]; // 5-12
  t13 = [[0, 1, 2, 4, 8], [2, 2, 1, 3, 1, 1], [1, 0, 0, 0, 0, 2, 0, 1], 0]; // 5-13
  t14 = [[0, 1, 2, 5, 7], [2, 2, 1, 1, 3, 1], [1, 0, 0, 0, 0, 1, 1, 1], 0]; // 5-14
  t15 = [[0, 1, 2, 6, 8], [2, 2, 0, 2, 2, 2], [1, 1, 1, 1, 2, 2, 2, 2], 0]; // 5-15
  t16 = [[0, 1, 3, 4, 7], [2, 1, 3, 2, 1, 1], [1, 0, 0, 0, 0, 1, 1, 0], 0]; // 5-16
  t17 = [[0, 1, 3, 4, 8], [2, 1, 2, 3, 2, 0], [1, 1, 0, 0, 1, 1, 2, 2], [37]]; // 5-17
  t18 = [[0, 1, 4, 5, 7], [2, 1, 2, 2, 2, 1], [1, 0, 0, 0, 0, 1, 1, 0], [38]]; // 5-18
  t19 = [[0, 1, 3, 6, 7], [2, 1, 2, 1, 2, 2], [1, 0, 0, 1, 0, 2, 2, 0], 0]; // 5-19
  t20 = [[0, 1, 3, 7, 8], [2, 1, 1, 2, 3, 1], [1, 0, 0, 0, 0, 1, 1, 1], 0]; // 5-20
  t21 = [[0, 1, 4, 5, 8], [2, 0, 2, 4, 2, 0], [1, 0, 1, 0, 3, 3, 3, 3], 0]; // 5-21
  t22 = [[0, 1, 4, 7, 8], [2, 0, 2, 3, 2, 1], [1, 1, 1, 1, 2, 2, 2, 2], 0]; // 5-22
  t23 = [[0, 2, 3, 5, 7], [1, 3, 2, 1, 3, 0], [1, 0, 0, 0, 1, 2, 1, 1], 0]; // 5-23
  t24 = [[0, 1, 3, 5, 7], [1, 3, 1, 2, 2, 1], [1, 0, 0, 0, 0, 2, 0, 1], 0]; // 5-24
  t25 = [[0, 2, 3, 5, 8], [1, 2, 3, 1, 2, 1], [1, 0, 0, 0, 0, 1, 1, 0], 0]; // 5-25
  t26 = [[0, 2, 4, 5, 8], [1, 2, 2, 3, 1, 1], [1, 0, 1, 0, 0, 2, 0, 2], 0]; // 5-26
  t27 = [[0, 1, 3, 5, 8], [1, 2, 2, 2, 3, 0], [1, 0, 0, 0, 1, 1, 1, 0], 0]; // 5-27
  t28 = [[0, 2, 3, 6, 8], [1, 2, 2, 2, 1, 2], [1, 0, 0, 1, 0, 2, 2, 0], 0]; // 5-28
  t29 = [[0, 1, 3, 6, 8], [1, 2, 2, 1, 3, 1], [1, 0, 0, 0, 0, 2, 0, 0], 0]; // 5-29
  t30 = [[0, 1, 4, 6, 8], [1, 2, 1, 3, 2, 1], [1, 0, 0, 0, 0, 2, 0, 1], 0]; // 5-30
  t31 = [[0, 1, 3, 6, 9], [1, 1, 4, 1, 1, 2], [1, 0, 0, 1, 0, 3, 3, 0], 0]; // 5-31
  t32 = [[0, 1, 4, 6, 9], [1, 1, 3, 2, 2, 1], [1, 0, 0, 0, 0, 1, 1, 0], 0]; // 5-32
  t33 = [[0, 2, 4, 6, 8], [0, 4, 0, 4, 0, 2], [1, 1, 1, 1, 6, 6, 6, 6], 0]; // 5-33
  t34 = [[0, 2, 4, 6, 9], [0, 3, 2, 2, 2, 1], [1, 1, 0, 0, 2, 2, 0, 0], 0]; // 5-34
  t35 = [[0, 2, 4, 7, 9], [0, 3, 2, 1, 4, 0], [1, 1, 0, 0, 3, 3, 0, 0], 0]; // 5-35
  t36 = [[0, 1, 2, 4, 7], [2, 2, 2, 1, 2, 1], [1, 0, 0, 1, 0, 1, 1, 0], 12]; // 5-36
  t37 = [[0, 3, 4, 5, 8], [2, 1, 2, 2, 2, 0], [1, 1, 0, 0, 1, 1, 2, 2], 17]; // 5-37
  t38 = [[0, 1, 2, 5, 8], [2, 1, 2, 2, 2, 1], [1, 0, 0, 0, 0, 1, 1, 0], 18]; // 5-38
  var pentachord = [undefined, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31, t32, t33, t34, t35, t36, t37, t38];

  t1 = [[0, 1, 2, 3, 4, 5], [5, 4, 3, 2, 1, 0], [1, 1, 0, 0, 1, 1, 0, 0], 0]; // 6-1  A
  t2 = [[0, 1, 2, 3, 4, 6], [4, 4, 3, 2, 1, 1], [1, 0, 0, 0, 0, 1, 0, 0], 0]; // 6-2
  t3 = [[0, 1, 2, 3, 5, 6], [4, 3, 3, 2, 2, 1], [1, 0, 0, 0, 0, 0, 0, 0], 36]; // 6-3
  t4 = [[0, 1, 2, 4, 5, 6], [4, 3, 2, 3, 2, 1], [1, 1, 0, 0, 0, 0, 0, 0], 37]; // 6-4
  t5 = [[0, 1, 2, 3, 6, 7], [4, 2, 2, 2, 3, 2], [1, 0, 0, 0, 0, 1, 0, 0], 0]; // 6-5
  t6 = [[0, 1, 2, 5, 6, 7], [4, 2, 1, 2, 4, 2], [1, 1, 0, 0, 0, 0, 1, 1], 38]; // 6-6
  t7 = [[0, 1, 2, 6, 7, 8], [4, 2, 0, 2, 4, 3], [2, 2, 2, 2, 2, 2, 2, 2], 0]; // 6-7 B
  t8 = [[0, 2, 3, 4, 5, 7], [3, 4, 3, 2, 3, 0], [1, 1, 1, 1, 1, 1, 1, 1], 0]; // 6-8 D
  t9 = [[0, 1, 2, 3, 5, 7], [3, 4, 2, 2, 3, 1], [1, 0, 1, 0, 0, 1, 0, 1], 0]; // 6-9
  t10 = [[0, 1, 3, 4, 5, 7], [3, 3, 3, 3, 2, 1], [1, 0, 0, 0, 0, 0, 0, 0], 39]; // 6-10
  t11 = [[0, 1, 2, 4, 5, 7], [3, 3, 3, 2, 3, 1], [1, 0, 0, 0, 0, 0, 1, 0], 40]; // 6-11
  t12 = [[0, 1, 2, 4, 6, 7], [3, 3, 2, 2, 3, 2], [1, 0, 0, 1, 0, 0, 0, 0], 41]; // 6-12
  t13 = [[0, 1, 3, 4, 6, 7], [3, 2, 4, 2, 2, 2], [1, 1, 0, 0, 0, 0, 0, 0], 42]; // 6-13
  t14 = [[0, 1, 3, 4, 5, 8], [3, 2, 3, 4, 3, 0], [1, 0, 1, 0, 1, 0, 1, 0], 0]; // 6-14
  t15 = [[0, 1, 2, 4, 5, 8], [3, 2, 3, 4, 2, 1], [1, 0, 0, 0, 0, 1, 0, 0], 0]; // 6-15
  t16 = [[0, 1, 4, 5, 6, 8], [3, 2, 2, 4, 3, 1], [1, 0, 1, 0, 0, 1, 0, 1], 0]; // 6-16
  t17 = [[0, 1, 2, 4, 7, 8], [3, 2, 2, 3, 3, 2], [1, 0, 0, 1, 0, 0, 0, 0], 43]; // 6-17
  t18 = [[0, 1, 2, 5, 7, 8], [3, 2, 2, 2, 4, 2], [1, 0, 0, 0, 0, 1, 0, 0], 0]; // 6-18
  t19 = [[0, 1, 3, 4, 7, 8], [3, 1, 3, 4, 3, 1], [1, 0, 0, 0, 0, 0, 1, 0], 44]; // 6-19
  t20 = [[0, 1, 4, 5, 8, 9], [3, 0, 3, 6, 3, 0], [3, 3, 3, 3, 3, 3, 3, 3], 0]; // 6-20 E
  t21 = [[0, 2, 3, 4, 6, 8], [2, 4, 2, 4, 1, 2], [1, 0, 0, 0, 0, 1, 0, 0], 0]; // 6-21
  t22 = [[0, 1, 2, 4, 6, 8], [2, 4, 1, 4, 2, 2], [1, 0, 1, 0, 0, 1, 0, 1], 0]; // 6-22
  t23 = [[0, 2, 3, 5, 6, 8], [2, 3, 4, 2, 2, 2], [1, 1, 1, 1, 0, 0, 0, 0], 45]; // 6-23
  t24 = [[0, 1, 3, 4, 6, 8], [2, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0], 46]; // 6-24
  t25 = [[0, 1, 3, 5, 6, 8], [2, 3, 3, 2, 4, 1], [1, 0, 0, 0, 0, 0, 0, 0], 47]; // 6-25
  t26 = [[0, 1, 3, 5, 7, 8], [2, 3, 2, 3, 4, 1], [1, 1, 0, 0, 0, 0, 0, 0], 48]; // 6-26
  t27 = [[0, 1, 3, 4, 6, 9], [2, 2, 5, 2, 2, 2], [1, 0, 0, 1, 0, 1, 1, 0], 0]; // 6-27
  t28 = [[0, 1, 3, 5, 6, 9], [2, 2, 4, 3, 2, 2], [1, 1, 1, 1, 0, 0, 0, 0], 49]; // 6-28
  t29 = [[0, 1, 3, 6, 8, 9], [2, 2, 4, 2, 3, 2], [1, 1, 0, 0, 0, 0, 0, 0], 50]; // 6- d29
  t30 = [[0, 1, 3, 6, 7, 9], [2, 2, 4, 2, 2, 3], [2, 0, 0, 2, 0, 2, 2, 0], 0]; // 6-30
  t31 = [[0, 1, 3, 5, 8, 9], [2, 2, 3, 4, 3, 1], [1, 0, 0, 0, 0, 1, 0, 0], 0]; // 6-31
  t32 = [[0, 2, 4, 5, 7, 9], [1, 4, 3, 2, 5, 0], [1, 1, 0, 0, 1, 1, 0, 0], 0]; // 6-32 C
  t33 = [[0, 2, 3, 5, 7, 9], [1, 4, 3, 2, 4, 1], [1, 0, 0, 0, 0, 1, 0, 0], 0]; // 6-33
  t34 = [[0, 1, 3, 5, 7, 9], [1, 4, 2, 4, 2, 2], [1, 0, 0, 0, 0, 1, 0, 0], 0]; // 6-34
  t35 = [[0, 2, 4, 6, 8, 10], [0, 6, 0, 6, 0, 3], [6, 6, 6, 6, 6, 6, 6, 6], 0]; // 6-35 F
  t36 = [[0, 1, 2, 3, 4, 7], [4, 3, 3, 2, 2, 1], [1, 0, 0, 0, 0, 0, 0, 0], 3]; // 6-36
  t37 = [[0, 1, 2, 3, 4, 8], [4, 3, 2, 3, 2, 1], [1, 1, 0, 0, 0, 0, 0, 0], 4]; // 6-37
  t38 = [[0, 1, 2, 3, 7, 8], [4, 2, 1, 2, 4, 2], [1, 1, 0, 0, 0, 0, 1, 1], 6]; // 6-38
  var t39 = [[0, 2, 3, 4, 5, 8], [3, 3, 3, 3, 2, 1], [1, 0, 0, 0, 0, 0, 0, 0], 10]; // 6-39
  var t40 = [[0, 1, 2, 3, 5, 8], [3, 3, 3, 2, 3, 1], [1, 0, 0, 0, 0, 0, 1, 0], 11]; // 6-40
  var t41 = [[0, 1, 2, 3, 6, 8], [3, 3, 2, 2, 3, 2], [1, 0, 0, 1, 0, 0, 0, 0], 12]; // 6-41
  var t42 = [[0, 1, 2, 3, 6, 9], [3, 2, 4, 2, 2, 2], [1, 1, 0, 0, 0, 0, 0, 0], 13]; // 6-42
  var t43 = [[0, 1, 2, 5, 6, 8], [3, 2, 2, 3, 3, 2], [1, 0, 0, 1, 0, 0, 0, 0], 17]; // 6-43
  var t44 = [[0, 1, 2, 5, 6, 9], [3, 1, 3, 4, 3, 1], [1, 0, 0, 0, 0, 0, 1, 0], 19]; // 6-44
  var t45 = [[0, 2, 3, 4, 6, 9], [2, 3, 4, 2, 2, 2], [1, 1, 1, 1, 0, 0, 0, 0], 23]; // 6-45
  var t46 = [[0, 1, 2, 4, 6, 9], [2, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0], 24]; // 6-46
  var t47 = [[0, 1, 2, 4, 7, 9], [2, 3, 3, 2, 4, 1], [1, 0, 0, 0, 0, 0, 0, 0], 25]; // 6-47
  var t48 = [[0, 1, 2, 5, 7, 9], [2, 3, 2, 3, 4, 1], [1, 1, 0, 0, 0, 0, 0, 0], 26]; // 6-48
  var t49 = [[0, 1, 3, 4, 7, 9], [2, 2, 4, 3, 2, 2], [1, 1, 1, 1, 0, 0, 0, 0], 28]; // 6-49
  var t50 = [[0, 1, 4, 6, 7, 9], [2, 2, 4, 2, 3, 2], [1, 1, 0, 0, 0, 0, 0, 0], 29]; // 6-50
  var hexachord = [undefined, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31, t32, t33, t34, t35, t36, t37, t38, t39, t40, t41, t42, t43, t44, t45, t46, t47, t48, t49, t50];

  t1 = [[0, 1, 2, 3, 4, 5, 6], [6, 5, 4, 3, 2, 1], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 7-1
  t2 = [[0, 1, 2, 3, 4, 5, 7], [5, 5, 4, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-2
  t3 = [[0, 1, 2, 3, 4, 5, 8], [5, 4, 4, 4, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-3
  t4 = [[0, 1, 2, 3, 4, 6, 7], [5, 4, 4, 3, 3, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-4
  t5 = [[0, 1, 2, 3, 5, 6, 7], [5, 4, 3, 3, 4, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-5
  t6 = [[0, 1, 2, 3, 4, 7, 8], [5, 3, 3, 4, 4, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-6
  t7 = [[0, 1, 2, 3, 6, 7, 8], [5, 3, 2, 3, 5, 3], [1, 0, 0, 1, 0, 0, 0, 0], 0]; // 7-7
  t8 = [[0, 2, 3, 4, 5, 6, 8], [4, 5, 4, 4, 2, 2], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 7-8
  t9 = [[0, 1, 2, 3, 4, 6, 8], [4, 5, 3, 4, 3, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-9
  t10 = [[0, 1, 2, 3, 4, 6, 9], [4, 4, 5, 3, 3, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-10
  t11 = [[0, 1, 3, 4, 5, 6, 8], [4, 4, 4, 4, 4, 1], [1, 0, 1, 0, 0, 0, 0, 0], 0]; // 7-11
  t12 = [[0, 1, 2, 3, 4, 7, 9], [4, 4, 4, 3, 4, 2], [1, 1, 1, 1, 0, 0, 0, 0], 36]; // 7-12 z
  t13 = [[0, 1, 2, 4, 5, 6, 8], [4, 4, 3, 5, 3, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-13
  t14 = [[0, 1, 2, 3, 5, 7, 8], [4, 4, 3, 3, 5, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-14
  t15 = [[0, 1, 2, 4, 6, 7, 8], [4, 4, 2, 4, 4, 3], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 7-15
  t16 = [[0, 1, 2, 3, 5, 6, 9], [4, 3, 5, 4, 3, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-16
  t17 = [[0, 1, 2, 4, 5, 6, 9], [4, 3, 4, 5, 4, 1], [1, 1, 0, 0, 0, 0, 0, 0], 37]; // 7-17 z
  t18 = [[0, 1, 2, 3, 5, 8, 9], [4, 3, 4, 4, 4, 2], [1, 0, 0, 0, 0, 0, 0, 0], 38]; // 7-18 z
  t19 = [[0, 1, 2, 3, 6, 7, 9], [4, 3, 4, 3, 4, 3], [1, 0, 0, 1, 0, 0, 0, 0], 0]; // 7-19
  t20 = [[0, 1, 2, 4, 7, 8, 9], [4, 3, 3, 4, 5, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-20
  t21 = [[0, 1, 2, 4, 5, 8, 9], [4, 2, 4, 6, 4, 1], [1, 0, 1, 0, 0, 0, 0, 0], 0]; // 7-21
  t22 = [[0, 1, 2, 5, 6, 8, 9], [4, 2, 4, 5, 4, 2], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 7-22
  t23 = [[0, 2, 3, 4, 5, 7, 9], [3, 5, 4, 3, 5, 1], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-23
  t24 = [[0, 1, 2, 3, 5, 7, 9], [3, 5, 3, 4, 4, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-24
  t25 = [[0, 2, 3, 4, 6, 7, 9], [3, 4, 5, 3, 4, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-25
  t26 = [[0, 1, 3, 4, 5, 7, 9], [3, 4, 4, 5, 3, 2], [1, 0, 1, 0, 0, 0, 0, 0], 0]; // 7-26
  t27 = [[0, 1, 2, 4, 5, 7, 9], [3, 4, 4, 4, 5, 1], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-27
  t28 = [[0, 1, 3, 5, 6, 7, 9], [3, 4, 4, 4, 3, 3], [1, 0, 0, 1, 0, 0, 0, 0], 0]; // 7-28
  t29 = [[0, 1, 2, 4, 6, 7, 9], [3, 4, 4, 3, 5, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-29
  t30 = [[0, 1, 2, 4, 6, 8, 9], [3, 4, 3, 5, 4, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-30
  t31 = [[0, 1, 3, 4, 6, 7, 9], [3, 3, 6, 3, 3, 3], [1, 0, 0, 1, 0, 0, 0, 0], 0]; // 7-31
  t32 = [[0, 1, 3, 4, 6, 8, 9], [3, 3, 5, 4, 4, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 7-32
  t33 = [[0, 1, 2, 4, 6, 8, 10], [2, 6, 2, 6, 2, 3], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 7-33
  t34 = [[0, 1, 3, 4, 6, 8, 10], [2, 5, 4, 4, 4, 2], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 7-34
  t35 = [[0, 1, 3, 5, 6, 8, 10], [2, 5, 4, 3, 6, 1], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 7-35
  t36 = [[0, 1, 2, 3, 5, 6, 8], [4, 4, 4, 3, 4, 2], [1, 0, 0, 1, 0, 0, 0, 0], 12]; // 7-36 z
  t37 = [[0, 1, 3, 4, 5, 7, 8], [4, 3, 4, 5, 4, 1], [1, 1, 0, 0, 0, 0, 0, 0], 17]; // 7-37 z
  t38 = [[0, 1, 2, 4, 5, 7, 8], [4, 3, 4, 4, 4, 2], [1, 0, 0, 0, 0, 0, 0, 0], 18]; // 7-38 z
  var septachord = [undefined, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31, t32, t33, t34, t35, t36, t37, t38];

  t1 = [[0, 1, 2, 3, 4, 5, 6, 7], [7, 6, 5, 4, 4, 2], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 8-1
  t2 = [[0, 1, 2, 3, 4, 5, 6, 8], [6, 6, 5, 5, 4, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 8-2
  t3 = [[0, 1, 2, 3, 4, 5, 6, 9], [6, 5, 6, 5, 4, 2], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 8-3
  t4 = [[0, 1, 2, 3, 4, 5, 7, 8], [6, 5, 5, 5, 5, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 8-4
  t5 = [[0, 1, 2, 3, 4, 6, 7, 8], [6, 5, 4, 5, 5, 3], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 8-5
  t6 = [[0, 1, 2, 3, 5, 6, 7, 8], [6, 5, 4, 4, 6, 3], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 8-6
  t7 = [[0, 1, 2, 3, 4, 5, 8, 9], [6, 4, 5, 6, 5, 2], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 8-7
  t8 = [[0, 1, 2, 3, 4, 7, 8, 9], [6, 4, 4, 5, 6, 3], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 8-8
  t9 = [[0, 1, 2, 3, 6, 7, 8, 9], [6, 4, 4, 4, 6, 4], [2, 2, 2, 2, 0, 0, 0, 0], 0]; // 8-9
  t10 = [[0, 2, 3, 4, 5, 6, 7, 9], [5, 6, 6, 4, 5, 2], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 8-10
  t11 = [[0, 1, 2, 3, 4, 5, 7, 9], [5, 6, 5, 5, 5, 2], [1, 0, 1, 0, 0, 0, 0, 0], 0]; // 8-11
  t12 = [[0, 1, 3, 4, 5, 6, 7, 9], [5, 5, 6, 5, 4, 3], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 8-12
  t13 = [[0, 1, 2, 3, 4, 6, 7, 9], [5, 5, 6, 4, 5, 3], [1, 0, 0, 1, 0, 0, 0, 0], 0]; // 8-13
  t14 = [[0, 1, 2, 4, 5, 6, 7, 9], [5, 5, 5, 5, 6, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 8-14
  t15 = [[0, 1, 2, 3, 4, 6, 8, 9], [5, 5, 5, 5, 5, 3], [1, 0, 0, 0, 0, 0, 0, 0], 29]; // 8-15  zz
  t16 = [[0, 1, 2, 3, 5, 7, 8, 9], [5, 5, 4, 5, 6, 3], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 8-16
  t17 = [[0, 1, 3, 4, 5, 6, 8, 9], [5, 4, 6, 6, 5, 2], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 8-17
  t18 = [[0, 1, 2, 3, 5, 6, 8, 9], [5, 4, 6, 5, 5, 3], [1, 0, 0, 1, 0, 0, 0, 0], 0]; // 8-18
  t19 = [[0, 1, 2, 4, 5, 6, 8, 9], [5, 4, 5, 7, 5, 2], [1, 0, 1, 0, 0, 0, 0, 0], 0]; // 8-19
  t20 = [[0, 1, 2, 4, 5, 7, 8, 9], [5, 4, 5, 6, 6, 2], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 8-20
  t21 = [[0, 1, 2, 3, 4, 6, 8, 10], [4, 7, 4, 6, 4, 3], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 8-21
  t22 = [[0, 1, 2, 3, 5, 6, 8, 10], [4, 6, 5, 5, 6, 2], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 8-22
  t23 = [[0, 1, 2, 3, 5, 7, 8, 10], [4, 6, 5, 4, 7, 2], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 8-23
  t24 = [[0, 1, 2, 4, 5, 6, 8, 10], [4, 6, 4, 7, 4, 3], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 8-24
  t25 = [[0, 1, 2, 4, 6, 7, 8, 10], [4, 6, 4, 6, 4, 4], [2, 2, 2, 2, 0, 0, 0, 0], 0]; // 8-25
  t26 = [[0, 1, 2, 4, 5, 7, 9, 10], [4, 5, 6, 5, 6, 2], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 8-26
  t27 = [[0, 1, 2, 4, 5, 7, 8, 10], [4, 5, 6, 5, 5, 3], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 8-27
  t28 = [[0, 1, 3, 4, 6, 7, 9, 10], [4, 4, 8, 4, 4, 4], [4, 4, 4, 4, 0, 0, 0, 0], 0]; // 8-28
  t29 = [[0, 1, 2, 3, 5, 6, 7, 9], [5, 5, 5, 5, 5, 3], [1, 0, 0, 0, 0, 0, 0, 0], 15]; // 8-29
  var octachord = [undefined, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29];

  t1 = [[0, 1, 2, 3, 4, 5, 6, 7, 8], [8, 7, 6, 6, 6, 3], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 9-1
  t2 = [[0, 1, 2, 3, 4, 5, 6, 7, 9], [7, 7, 7, 6, 6, 3], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 9-2
  t3 = [[0, 1, 2, 3, 4, 5, 6, 8, 9], [7, 6, 7, 7, 6, 3], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 9-3
  t4 = [[0, 1, 2, 3, 4, 5, 7, 8, 9], [7, 6, 6, 7, 7, 3], [1, 0, 1, 0, 0, 0, 0, 0], 0]; // 9-4
  t5 = [[0, 1, 2, 3, 4, 6, 7, 8, 9], [7, 6, 6, 6, 7, 4], [1, 0, 0, 1, 0, 0, 0, 0], 0]; // 9-5
  t6 = [[0, 1, 2, 3, 4, 5, 6, 8, 10], [6, 8, 6, 7, 6, 3], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 9-6
  t7 = [[0, 1, 2, 3, 4, 5, 7, 8, 10], [6, 7, 7, 6, 7, 3], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 9-7
  t8 = [[0, 1, 2, 3, 4, 6, 7, 8, 10], [6, 7, 6, 7, 6, 4], [1, 0, 0, 1, 0, 0, 0, 0], 0]; // 9-8
  t9 = [[0, 1, 2, 3, 5, 6, 7, 8, 10], [6, 7, 6, 6, 8, 3], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 9-9
  t10 = [[0, 1, 2, 3, 4, 6, 7, 9, 10], [6, 6, 8, 6, 6, 4], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 9-10
  t11 = [[0, 1, 2, 3, 5, 6, 7, 9, 10], [6, 6, 7, 7, 7, 3], [1, 0, 0, 0, 0, 0, 0, 0], 0]; // 9-11
  t12 = [[0, 1, 2, 4, 5, 6, 8, 9, 10], [6, 6, 6, 9, 6, 3], [3, 3, 3, 3, 0, 0, 0, 0], 0]; // 9-12
  var nonachord = [undefined, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12];

  t1 = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [9, 8, 8, 8, 8, 4], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 10-1
  t2 = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 10], [8, 9, 8, 8, 8, 4], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 10-2
  t3 = [[0, 1, 2, 3, 4, 5, 6, 7, 9, 10], [8, 8, 9, 8, 8, 4], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 10-3
  t4 = [[0, 1, 2, 3, 4, 5, 6, 8, 9, 10], [8, 8, 8, 9, 8, 4], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 10-4
  t5 = [[0, 1, 2, 3, 4, 5, 7, 8, 9, 10], [8, 8, 8, 8, 9, 4], [1, 1, 0, 0, 0, 0, 0, 0], 0]; // 10-5
  t6 = [[0, 1, 2, 3, 4, 6, 7, 8, 9, 10], [8, 8, 8, 8, 8, 5], [2, 2, 2, 2, 0, 0, 0, 0], 0]; // 10-6
  var decachord = [undefined, t1, t2, t3, t4, t5, t6];

  t1 = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10, 10, 10, 10, 10, 5], [1, 1, 1, 1, 0, 0, 0, 0], 0]; // 11-1
  var undecachord = [undefined, t1];

  t1 = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [12, 12, 12, 12, 12, 6], [12, 12, 12, 12, 0, 0, 0, 0], 0]; // 12-1
  var dodecachord = [undefined, t1];

  // -------------------------------------------------------------------------------
  var FORTE = [undefined, monad, diad, trichord, tetrachord, pentachord, hexachord, septachord, octachord, nonachord, decachord, undecachord, dodecachord];

  // to access the data for a single form, use:
  // forte   [size[tetra]] = 4
  //         [number[forte]] = 3
  //         [data[0=pitches, 1=ICV, 2=invariance vector [morris], 3 = Z-relation]]
  //         [element in list]
  //-------------------------------------------------------------------------------

  // cardinality 1
  var card_1 = { '1,0': [FORTE[1][1][0], // 1
      FORTE[1][1][2], // var
      FORTE[1][1][1]]
  };
  // cardinality 2
  var card_2 = { '1,0': [FORTE[2][1][0], // 2
      FORTE[2][1][2], // var
      FORTE[2][1][1]],
      '2,0': [FORTE[2][2][0], // 3
      FORTE[2][2][2], // var
      FORTE[2][2][1]],
      '3,0': [FORTE[2][3][0], // 4
      FORTE[2][3][2], // var
      FORTE[2][3][1]],
      '4,0': [FORTE[2][4][0], // 5
      FORTE[2][4][2], // var
      FORTE[2][4][1]],
      '5,0': [FORTE[2][5][0], // 6
      FORTE[2][5][2], // var
      FORTE[2][5][1]],
      '6,0': [FORTE[2][6][0], // 7
      FORTE[2][6][2], // var
      FORTE[2][6][1]]
  };
  // cardinality 3
  var card_3 = { '1,0': [FORTE[3][1][0], // 8
      FORTE[3][1][2], // var
      FORTE[3][1][1]],
      '2,1': [FORTE[3][2][0], // 9
      FORTE[3][2][2], // var
      FORTE[3][2][1]],
      '2,-1': [[0, 2, 3], // 10
      FORTE[3][2][2], // var
      FORTE[3][2][1]],
      '3,1': [FORTE[3][3][0], // 11
      FORTE[3][3][2], // var
      FORTE[3][3][1]],
      '3,-1': [[0, 3, 4], // 12
      FORTE[3][3][2], // var
      FORTE[3][3][1]],
      '4,1': [FORTE[3][4][0], // 13
      FORTE[3][4][2], // var
      FORTE[3][4][1]],
      '4,-1': [[0, 4, 5], // 14
      FORTE[3][4][2], // var
      FORTE[3][4][1]],
      '5,1': [FORTE[3][5][0], // 15
      FORTE[3][5][2], // var
      FORTE[3][5][1]],
      '5,-1': [[0, 5, 6], // 16
      FORTE[3][5][2], // var
      FORTE[3][5][1]],
      '6,0': [FORTE[3][6][0], // 17
      FORTE[3][6][2], // var
      FORTE[3][6][1]],
      '7,1': [FORTE[3][7][0], // 18
      FORTE[3][7][2], // var
      FORTE[3][7][1]],
      '7,-1': [[0, 3, 5], // 19
      FORTE[3][7][2], // var
      FORTE[3][7][1]],
      '8,1': [FORTE[3][8][0], // 20
      FORTE[3][8][2], // var
      FORTE[3][8][1]],
      '8,-1': [[0, 4, 6], // 21
      FORTE[3][8][2], // var
      FORTE[3][8][1]],
      '9,0': [FORTE[3][9][0], // 22
      FORTE[3][9][2], // var
      FORTE[3][9][1]],
      '10,0': [FORTE[3][10][0], // 23
      FORTE[3][10][2], // var
      FORTE[3][10][1]],
      '11,1': [FORTE[3][11][0], // 24
      FORTE[3][11][2], // var
      FORTE[3][11][1]],
      '11,-1': [[0, 4, 7], // 25
      FORTE[3][11][2], // var
      FORTE[3][11][1]],
      '12,0': [FORTE[3][12][0], // 26
      FORTE[3][12][2], // var
      FORTE[3][12][1]]
  };
  // cardinality 4
  var card_4 = { '1,0': [FORTE[4][1][0], // 27
      FORTE[4][1][2], // var
      FORTE[4][1][1]],
      '2,1': [FORTE[4][2][0], // 28
      FORTE[4][2][2], // var
      FORTE[4][2][1]],
      '2,-1': [[0, 2, 3, 4], // 29
      FORTE[4][2][2], // var
      FORTE[4][2][1]],
      '3,0': [FORTE[4][3][0], // 30
      FORTE[4][3][2], // var
      FORTE[4][3][1]],
      '4,1': [FORTE[4][4][0], // 31
      FORTE[4][4][2], // var
      FORTE[4][4][1]],
      '4,-1': [[0, 3, 4, 5], // 32
      FORTE[4][4][2], // var
      FORTE[4][4][1]],
      '5,1': [FORTE[4][5][0], // 33
      FORTE[4][5][2], // var
      FORTE[4][5][1]],
      '5,-1': [[0, 4, 5, 6], // 34
      FORTE[4][5][2], // var
      FORTE[4][5][1]],
      '6,0': [FORTE[4][6][0], // 35
      FORTE[4][6][2], // var
      FORTE[4][6][1]],
      '7,0': [FORTE[4][7][0], // 36
      FORTE[4][7][2], // var
      FORTE[4][7][1]],
      '8,0': [FORTE[4][8][0], // 37
      FORTE[4][8][2], // var
      FORTE[4][8][1]],
      '9,0': [FORTE[4][9][0], // 38
      FORTE[4][9][2], // var
      FORTE[4][9][1]],
      '10,0': [FORTE[4][10][0], // 39
      FORTE[4][10][2], // var
      FORTE[4][10][1]],
      '11,1': [FORTE[4][11][0], // 40
      FORTE[4][11][2], // var
      FORTE[4][11][1]],
      '11,-1': [[0, 2, 4, 5], // 41
      FORTE[4][11][2], // var
      FORTE[4][11][1]],
      '12,1': [FORTE[4][12][0], // 42
      FORTE[4][12][2], // var
      FORTE[4][12][1]],
      '12,-1': [[0, 3, 4, 6], // 43
      FORTE[4][12][2], // var
      FORTE[4][12][1]],
      '13,1': [FORTE[4][13][0], // 44
      FORTE[4][13][2], // var
      FORTE[4][13][1]],
      '13,-1': [[0, 3, 5, 6], // 45
      FORTE[4][13][2], // var
      FORTE[4][13][1]],
      '14,1': [FORTE[4][14][0], // 46
      FORTE[4][14][2], // var
      FORTE[4][14][1]],
      '14,-1': [[0, 4, 5, 7], // 47
      FORTE[4][14][2], // var
      FORTE[4][14][1]],
      '15,1': [FORTE[4][15][0], // 48
      FORTE[4][15][2], // var
      FORTE[4][15][1]],
      '15,-1': [[0, 2, 5, 6], // 49
      FORTE[4][15][2], // var
      FORTE[4][15][1]],
      '16,1': [FORTE[4][16][0], // 50
      FORTE[4][16][2], // var
      FORTE[4][16][1]],
      '16,-1': [[0, 2, 6, 7], // 51
      FORTE[4][16][2], // var
      FORTE[4][16][1]],
      '17,0': [FORTE[4][17][0], // 52
      FORTE[4][17][2], // var
      FORTE[4][17][1]],
      '18,1': [FORTE[4][18][0], // 53
      FORTE[4][18][2], // var
      FORTE[4][18][1]],
      '18,-1': [[0, 3, 6, 7], // 54
      FORTE[4][18][2], // var
      FORTE[4][18][1]],
      '19,1': [FORTE[4][19][0], // 55
      FORTE[4][19][2], // var
      FORTE[4][19][1]],
      '19,-1': [[0, 4, 7, 8], // 56
      FORTE[4][19][2], // var
      FORTE[4][19][1]],
      '20,0': [FORTE[4][20][0], // 57
      FORTE[4][20][2], // var
      FORTE[4][20][1]],
      '21,0': [FORTE[4][21][0], // 58
      FORTE[4][21][2], // var
      FORTE[4][21][1]],
      '22,1': [FORTE[4][22][0], // 59
      FORTE[4][22][2], // var
      FORTE[4][22][1]],
      '22,-1': [[0, 3, 5, 7], // 60
      FORTE[4][22][2], // var
      FORTE[4][22][1]],
      '23,0': [FORTE[4][23][0], // 61
      FORTE[4][23][2], // var
      FORTE[4][23][1]],
      '24,0': [FORTE[4][24][0], // 62
      FORTE[4][24][2], // var
      FORTE[4][24][1]],
      '25,0': [FORTE[4][25][0], // 63
      FORTE[4][25][2], // var
      FORTE[4][25][1]],
      '26,0': [FORTE[4][26][0], // 64
      FORTE[4][26][2], // var
      FORTE[4][26][1]],
      '27,1': [FORTE[4][27][0], // 65
      FORTE[4][27][2], // var
      FORTE[4][27][1]],
      '27,-1': [[0, 3, 6, 8], // 66
      FORTE[4][27][2], // var
      FORTE[4][27][1]],
      '28,0': [FORTE[4][28][0], // 67
      FORTE[4][28][2], // var
      FORTE[4][28][1]],
      '29,1': [FORTE[4][29][0], // 68
      FORTE[4][29][2], // var
      FORTE[4][29][1]],
      '29,-1': [[0, 4, 6, 7], // 69
      FORTE[4][29][2], // var
      FORTE[4][29][1]]
  };
  // cardinality 5
  var card_5 = { '1,0': [FORTE[5][1][0], // 70
      FORTE[5][1][2], // var
      FORTE[5][1][1]],
      '2,1': [FORTE[5][2][0], // 71
      FORTE[5][2][2], // var
      FORTE[5][2][1]],
      '2,-1': [[0, 2, 3, 4, 5], // 72
      FORTE[5][2][2], // var
      FORTE[5][2][1]],
      '3,1': [FORTE[5][3][0], // 73
      FORTE[5][3][2], // var
      FORTE[5][3][1]],
      '3,-1': [[0, 1, 3, 4, 5], // 74
      FORTE[5][3][2], // var
      FORTE[5][3][1]],
      '4,1': [FORTE[5][4][0], // 75
      FORTE[5][4][2], // var
      FORTE[5][4][1]],
      '4,-1': [[0, 3, 4, 5, 6], // 76
      FORTE[5][4][2], // var
      FORTE[5][4][1]],
      '5,1': [FORTE[5][5][0], // 77
      FORTE[5][5][2], // var
      FORTE[5][5][1]],
      '5,-1': [[0, 4, 5, 6, 7], // 78
      FORTE[5][5][2], // var
      FORTE[5][5][1]],
      '6,1': [FORTE[5][6][0], // 79
      FORTE[5][6][2], // var
      FORTE[5][6][1]],
      '6,-1': [[0, 1, 4, 5, 6], // 80
      FORTE[5][6][2], // var
      FORTE[5][6][1]],
      '7,1': [FORTE[5][7][0], // 81
      FORTE[5][7][2], // var
      FORTE[5][7][1]],
      '7,-1': [[0, 1, 5, 6, 7], // 82
      FORTE[5][7][2], // var
      FORTE[5][7][1]],
      '8,0': [FORTE[5][8][0], // 83
      FORTE[5][8][2], // var
      FORTE[5][8][1]],
      '9,1': [FORTE[5][9][0], // 84
      FORTE[5][9][2], // var
      FORTE[5][9][1]],
      '9,-1': [[0, 2, 4, 5, 6], // 85
      FORTE[5][9][2], // var
      FORTE[5][9][1]],
      '10,1': [FORTE[5][10][0], // 86
      FORTE[5][10][2], // var
      FORTE[5][10][1]],
      '10,-1': [[0, 2, 3, 5, 6], // 87
      FORTE[5][10][2], // var
      FORTE[5][10][1]],
      '11,1': [FORTE[5][11][0], // 88
      FORTE[5][11][2], // var
      FORTE[5][11][1]],
      '11,-1': [[0, 3, 4, 5, 7], // 89
      FORTE[5][11][2], // var
      FORTE[5][11][1]],
      '12,0': [FORTE[5][12][0], // 90
      FORTE[5][12][2], // var
      FORTE[5][12][1]],
      '13,1': [FORTE[5][13][0], // 91
      FORTE[5][13][2], // var
      FORTE[5][13][1]],
      '13,-1': [[0, 4, 6, 7, 8], // 92
      FORTE[5][13][2], // var
      FORTE[5][13][1]],
      '14,1': [FORTE[5][14][0], // 93
      FORTE[5][14][2], // var
      FORTE[5][14][1]],
      '14,-1': [[0, 2, 5, 6, 7], // 94
      FORTE[5][14][2], // var
      FORTE[5][14][1]],
      '15,0': [FORTE[5][15][0], // 95
      FORTE[5][15][2], // var
      FORTE[5][15][1]],
      '16,1': [FORTE[5][16][0], // 96
      FORTE[5][16][2], // var
      FORTE[5][16][1]],
      '16,-1': [[0, 3, 4, 6, 7], // 97
      FORTE[5][16][2], // var
      FORTE[5][16][1]],
      '17,0': [FORTE[5][17][0], // 98
      FORTE[5][17][2], // var
      FORTE[5][17][1]],
      '18,1': [FORTE[5][18][0], // 99
      FORTE[5][18][2], // var
      FORTE[5][18][1]],
      '18,-1': [[0, 2, 3, 6, 7], // 100
      FORTE[5][18][2], // var
      FORTE[5][18][1]],
      '19,1': [FORTE[5][19][0], // 101
      FORTE[5][19][2], // var
      FORTE[5][19][1]],
      '19,-1': [[0, 1, 4, 6, 7], // 102
      FORTE[5][19][2], // var
      FORTE[5][19][1]],
      '20,1': [FORTE[5][20][0], // 103
      FORTE[5][20][2], // var
      FORTE[5][20][1]],
      '20,-1': [[0, 1, 5, 7, 8], // 104
      FORTE[5][20][2], // var
      FORTE[5][20][1]],
      '21,1': [FORTE[5][21][0], // 105
      FORTE[5][21][2], // var
      FORTE[5][21][1]],
      '21,-1': [[0, 3, 4, 7, 8], // 106
      FORTE[5][21][2], // var
      FORTE[5][21][1]],
      '22,0': [FORTE[5][22][0], // 107
      FORTE[5][22][2], // var
      FORTE[5][22][1]],
      '23,1': [FORTE[5][23][0], // 108
      FORTE[5][23][2], // var
      FORTE[5][23][1]],
      '23,-1': [[0, 2, 4, 5, 7], // 109
      FORTE[5][23][2], // var
      FORTE[5][23][1]],
      '24,1': [FORTE[5][24][0], // 110
      FORTE[5][24][2], // var
      FORTE[5][24][1]],
      '24,-1': [[0, 2, 4, 6, 7], // 111
      FORTE[5][24][2], // var
      FORTE[5][24][1]],
      '25,1': [FORTE[5][25][0], // 112
      FORTE[5][25][2], // var
      FORTE[5][25][1]],
      '25,-1': [[0, 3, 5, 6, 8], // 113
      FORTE[5][25][2], // var
      FORTE[5][25][1]],
      '26,1': [FORTE[5][26][0], // 114
      FORTE[5][26][2], // var
      FORTE[5][26][1]],
      '26,-1': [[0, 3, 4, 6, 8], // 115
      FORTE[5][26][2], // var
      FORTE[5][26][1]],
      '27,1': [FORTE[5][27][0], // 116
      FORTE[5][27][2], // var
      FORTE[5][27][1]],
      '27,-1': [[0, 3, 5, 7, 8], // 117
      FORTE[5][27][2], // var
      FORTE[5][27][1]],
      '28,1': [FORTE[5][28][0], // 118
      FORTE[5][28][2], // var
      FORTE[5][28][1]],
      '28,-1': [[0, 2, 5, 6, 8], // 119
      FORTE[5][28][2], // var
      FORTE[5][28][1]],
      '29,1': [FORTE[5][29][0], // 120
      FORTE[5][29][2], // var
      FORTE[5][29][1]],
      '29,-1': [[0, 2, 5, 7, 8], // 121
      FORTE[5][29][2], // var
      FORTE[5][29][1]],
      '30,1': [FORTE[5][30][0], // 122
      FORTE[5][30][2], // var
      FORTE[5][30][1]],
      '30,-1': [[0, 2, 4, 7, 8], // 123
      FORTE[5][30][2], // var
      FORTE[5][30][1]],
      '31,1': [FORTE[5][31][0], // 124
      FORTE[5][31][2], // var
      FORTE[5][31][1]],
      '31,-1': [[0, 3, 6, 8, 9], // 125
      FORTE[5][31][2], // var
      FORTE[5][31][1]],
      '32,1': [FORTE[5][32][0], // 126
      FORTE[5][32][2], // var
      FORTE[5][32][1]],
      '32,-1': [[0, 3, 5, 8, 9], // 127
      FORTE[5][32][2], // var
      FORTE[5][32][1]],
      '33,0': [FORTE[5][33][0], // 128
      FORTE[5][33][2], // var
      FORTE[5][33][1]],
      '34,0': [FORTE[5][34][0], // 129
      FORTE[5][34][2], // var
      FORTE[5][34][1]],
      '35,0': [FORTE[5][35][0], // 130
      FORTE[5][35][2], // var
      FORTE[5][35][1]],
      '36,1': [FORTE[5][36][0], // 131
      FORTE[5][36][2], // var
      FORTE[5][36][1]],
      '36,-1': [[0, 3, 5, 6, 7], // 132
      FORTE[5][36][2], // var
      FORTE[5][36][1]],
      '37,0': [FORTE[5][37][0], // 133
      FORTE[5][37][2], // var
      FORTE[5][37][1]],
      '38,1': [FORTE[5][38][0], // 134
      FORTE[5][38][2], // var
      FORTE[5][38][1]],
      '38,-1': [[0, 3, 6, 7, 8], // 135
      FORTE[5][38][2], // var
      FORTE[5][38][1]]
  };
  // cardinality 6
  var card_6 = { '1,0': [FORTE[6][1][0], // 136
      FORTE[6][1][2], // var
      FORTE[6][1][1]],
      '2,1': [FORTE[6][2][0], // 137
      FORTE[6][2][2], // var
      FORTE[6][2][1]],
      '2,-1': [[0, 2, 3, 4, 5, 6], // 138
      FORTE[6][2][2], // var
      FORTE[6][2][1]],
      '3,1': [FORTE[6][3][0], // 139
      FORTE[6][3][2], // var
      FORTE[6][3][1]],
      '3,-1': [[0, 1, 3, 4, 5, 6], // 140
      FORTE[6][3][2], // var
      FORTE[6][3][1]],
      '4,0': [FORTE[6][4][0], // 141
      FORTE[6][4][2], // var
      FORTE[6][4][1]],
      '5,1': [FORTE[6][5][0], // 142
      FORTE[6][5][2], // var
      FORTE[6][5][1]],
      '5,-1': [[0, 1, 4, 5, 6, 7], // 143
      FORTE[6][5][2], // var
      FORTE[6][5][1]],
      '6,0': [FORTE[6][6][0], // 144
      FORTE[6][6][2], // var
      FORTE[6][6][1]],
      '7,0': [FORTE[6][7][0], // 145
      FORTE[6][7][2], // var
      FORTE[6][7][1]],
      '8,0': [FORTE[6][8][0], // 146
      FORTE[6][8][2], // var
      FORTE[6][8][1]],
      '9,1': [FORTE[6][9][0], // 147
      FORTE[6][9][2], // var
      FORTE[6][9][1]],
      '9,-1': [[0, 2, 4, 5, 6, 7], // 148
      FORTE[6][9][2], // var
      FORTE[6][9][1]],
      '10,1': [FORTE[6][10][0], // 149
      FORTE[6][10][2], // var
      FORTE[6][10][1]],
      '10,-1': [[0, 2, 3, 4, 6, 7], // 150
      FORTE[6][10][2], // var
      FORTE[6][10][1]],
      '11,1': [FORTE[6][11][0], // 151
      FORTE[6][11][2], // var
      FORTE[6][11][1]],
      '11,-1': [[0, 2, 3, 5, 6, 7], // 152
      FORTE[6][11][2], // var
      FORTE[6][11][1]],
      '12,1': [FORTE[6][12][0], // 153
      FORTE[6][12][2], // var
      FORTE[6][12][1]],
      '12,-1': [[0, 1, 3, 5, 6, 7], // 154
      FORTE[6][12][2], // var
      FORTE[6][12][1]],
      '13,0': [FORTE[6][13][0], // 155
      FORTE[6][13][2], // var
      FORTE[6][13][1]],
      '14,1': [FORTE[6][14][0], // 156
      FORTE[6][14][2], // var
      FORTE[6][14][1]],
      '14,-1': [[0, 3, 4, 5, 7, 8], // 157
      FORTE[6][14][2], // var
      FORTE[6][14][1]],
      '15,1': [FORTE[6][15][0], // 158
      FORTE[6][15][2], // var
      FORTE[6][15][1]],
      '15,-1': [[0, 3, 4, 6, 7, 8], // 159
      FORTE[6][15][2], // var
      FORTE[6][15][1]],
      '16,1': [FORTE[6][16][0], // 160
      FORTE[6][16][2], // var
      FORTE[6][16][1]],
      '16,-1': [[0, 2, 3, 4, 7, 8], // 161
      FORTE[6][16][2], // var
      FORTE[6][16][1]],
      '17,1': [FORTE[6][17][0], // 162
      FORTE[6][17][2], // var
      FORTE[6][17][1]],
      '17,-1': [[0, 1, 4, 6, 7, 8], // 163
      FORTE[6][17][2], // var
      FORTE[6][17][1]],
      '18,1': [FORTE[6][18][0], // 164
      FORTE[6][18][2], // var
      FORTE[6][18][1]],
      '18,-1': [[0, 1, 3, 6, 7, 8], // 165
      FORTE[6][18][2], // var
      FORTE[6][18][1]],
      '19,1': [FORTE[6][19][0], // 166
      FORTE[6][19][2], // var
      FORTE[6][19][1]],
      '19,-1': [[0, 1, 4, 5, 7, 8], // 167
      FORTE[6][19][2], // var
      FORTE[6][19][1]],
      '20,0': [FORTE[6][20][0], // 168
      FORTE[6][20][2], // var
      FORTE[6][20][1]],
      '21,1': [FORTE[6][21][0], // 169
      FORTE[6][21][2], // var
      FORTE[6][21][1]],
      '21,-1': [[0, 2, 4, 5, 6, 8], // 170
      FORTE[6][21][2], // var
      FORTE[6][21][1]],
      '22,1': [FORTE[6][22][0], // 171
      FORTE[6][22][2], // var
      FORTE[6][22][1]],
      '22,-1': [[0, 2, 4, 6, 7, 8], // 172
      FORTE[6][22][2], // var
      FORTE[6][22][1]],
      '23,0': [FORTE[6][23][0], // 173
      FORTE[6][23][2], // var
      FORTE[6][23][1]],
      '24,1': [FORTE[6][24][0], // 174
      FORTE[6][24][2], // var
      FORTE[6][24][1]],
      '24,-1': [[0, 2, 4, 5, 7, 8], // 175
      FORTE[6][24][2], // var
      FORTE[6][24][1]],
      '25,1': [FORTE[6][25][0], // 176
      FORTE[6][25][2], // var
      FORTE[6][25][1]],
      '25,-1': [[0, 2, 3, 5, 7, 8], // 177
      FORTE[6][25][2], // var
      FORTE[6][25][1]],
      '26,0': [FORTE[6][26][0], // 178
      FORTE[6][26][2], // var
      FORTE[6][26][1]],
      '27,1': [FORTE[6][27][0], // 179
      FORTE[6][27][2], // var
      FORTE[6][27][1]],
      '27,-1': [[0, 3, 5, 6, 8, 9], // 180
      FORTE[6][27][2], // var
      FORTE[6][27][1]],
      '28,0': [FORTE[6][28][0], // 181
      FORTE[6][28][2], // var
      FORTE[6][28][1]],
      '29,0': [FORTE[6][29][0], // 182
      FORTE[6][29][2], // var
      FORTE[6][29][1]],
      '30,1': [FORTE[6][30][0], // 183
      FORTE[6][30][2], // var
      FORTE[6][30][1]],
      '30,-1': [[0, 2, 3, 6, 8, 9], // 184
      FORTE[6][30][2], // var
      FORTE[6][30][1]],
      '31,1': [FORTE[6][31][0], // 185
      FORTE[6][31][2], // var
      FORTE[6][31][1]],
      '31,-1': [[0, 1, 4, 6, 8, 9], // 186
      FORTE[6][31][2], // var
      FORTE[6][31][1]],
      '32,0': [FORTE[6][32][0], // 187
      FORTE[6][32][2], // var
      FORTE[6][32][1]],
      '33,1': [FORTE[6][33][0], // 188
      FORTE[6][33][2], // var
      FORTE[6][33][1]],
      '33,-1': [[0, 2, 4, 6, 7, 9], // 189
      FORTE[6][33][2], // var
      FORTE[6][33][1]],
      '34,1': [FORTE[6][34][0], // 190
      FORTE[6][34][2], // var
      FORTE[6][34][1]],
      '34,-1': [[0, 2, 4, 6, 8, 9], // 191
      FORTE[6][34][2], // var
      FORTE[6][34][1]],
      '35,0': [FORTE[6][35][0], // 192
      FORTE[6][35][2], // var
      FORTE[6][35][1]],
      '36,1': [FORTE[6][36][0], // 193
      FORTE[6][36][2], // var
      FORTE[6][36][1]],
      '36,-1': [[0, 3, 4, 5, 6, 7], // 194
      FORTE[6][36][2], // var
      FORTE[6][36][1]],
      '37,0': [FORTE[6][37][0], // 195
      FORTE[6][37][2], // var
      FORTE[6][37][1]],
      '38,0': [FORTE[6][38][0], // 196
      FORTE[6][38][2], // var
      FORTE[6][38][1]],
      '39,1': [FORTE[6][39][0], // 197
      FORTE[6][39][2], // var
      FORTE[6][39][1]],
      '39,-1': [[0, 3, 4, 5, 6, 8], // 198
      FORTE[6][39][2], // var
      FORTE[6][39][1]],
      '40,1': [FORTE[6][40][0], // 199
      FORTE[6][40][2], // var
      FORTE[6][40][1]],
      '40,-1': [[0, 3, 5, 6, 7, 8], // 200
      FORTE[6][40][2], // var
      FORTE[6][40][1]],
      '41,1': [FORTE[6][41][0], // 201
      FORTE[6][41][2], // var
      FORTE[6][41][1]],
      '41,-1': [[0, 2, 5, 6, 7, 8], // 202
      FORTE[6][41][2], // var
      FORTE[6][41][1]],
      '42,0': [FORTE[6][42][0], // 203
      FORTE[6][42][2], // var
      FORTE[6][42][1]],
      '43,1': [FORTE[6][43][0], // 204
      FORTE[6][43][2], // var
      FORTE[6][43][1]],
      '43,-1': [[0, 2, 3, 6, 7, 8], // 205
      FORTE[6][43][2], // var
      FORTE[6][43][1]],
      '44,1': [FORTE[6][44][0], // 206
      FORTE[6][44][2], // var
      FORTE[6][44][1]],
      '44,-1': [[0, 3, 4, 7, 8, 9], // 207
      FORTE[6][44][2], // var
      FORTE[6][44][1]],
      '45,0': [FORTE[6][45][0], // 208
      FORTE[6][45][2], // var
      FORTE[6][45][1]],
      '46,1': [FORTE[6][46][0], // 209
      FORTE[6][46][2], // var
      FORTE[6][46][1]],
      '46,-1': [[0, 3, 5, 7, 8, 9], // 210
      FORTE[6][46][2], // var
      FORTE[6][46][1]],
      '47,1': [FORTE[6][47][0], // 211
      FORTE[6][47][2], // var
      FORTE[6][47][1]],
      '47,-1': [[0, 2, 5, 7, 8, 9], // 212
      FORTE[6][47][2], // var
      FORTE[6][47][1]],
      '48,0': [FORTE[6][48][0], // 213
      FORTE[6][48][2], // var
      FORTE[6][48][1]],
      '49,0': [FORTE[6][49][0], // 214
      FORTE[6][49][2], // var
      FORTE[6][49][1]],
      '50,0': [FORTE[6][50][0], // 215
      FORTE[6][50][2], // var
      FORTE[6][50][1]]
  };
  // cardinality 7
  var card_7 = { '1,0': [FORTE[7][1][0], // 216
      FORTE[7][1][2], // var
      FORTE[7][1][1]],
      '2,1': [FORTE[7][2][0], // 217
      FORTE[7][2][2], // var
      FORTE[7][2][1]],
      '2,-1': [[0, 2, 3, 4, 5, 6, 7], // 218
      FORTE[7][2][2], // var
      FORTE[7][2][1]],
      '3,1': [FORTE[7][3][0], // 219
      FORTE[7][3][2], // var
      FORTE[7][3][1]],
      '3,-1': [[0, 3, 4, 5, 6, 7, 8], // 220
      FORTE[7][3][2], // var
      FORTE[7][3][1]],
      '4,1': [FORTE[7][4][0], // 221
      FORTE[7][4][2], // var
      FORTE[7][4][1]],
      '4,-1': [[0, 1, 3, 4, 5, 6, 7], // 222
      FORTE[7][4][2], // var
      FORTE[7][4][1]],
      '5,1': [FORTE[7][5][0], // 223
      FORTE[7][5][2], // var
      FORTE[7][5][1]],
      '5,-1': [[0, 1, 2, 4, 5, 6, 7], // 224
      FORTE[7][5][2], // var
      FORTE[7][5][1]],
      '6,1': [FORTE[7][6][0], // 225
      FORTE[7][6][2], // var
      FORTE[7][6][1]],
      '6,-1': [[0, 1, 4, 5, 6, 7, 8], // 226
      FORTE[7][6][2], // var
      FORTE[7][6][1]],
      '7,1': [FORTE[7][7][0], // 227
      FORTE[7][7][2], // var
      FORTE[7][7][1]],
      '7,-1': [[0, 1, 2, 5, 6, 7, 8], // 228
      FORTE[7][7][2], // var
      FORTE[7][7][1]],
      '8,0': [FORTE[7][8][0], // 229
      FORTE[7][8][2], // var
      FORTE[7][8][1]],
      '9,1': [FORTE[7][9][0], // 230
      FORTE[7][9][2], // var
      FORTE[7][9][1]],
      '9,-1': [[0, 2, 4, 5, 6, 7, 8], // 231
      FORTE[7][9][2], // var
      FORTE[7][9][1]],
      '10,1': [FORTE[7][10][0], // 232
      FORTE[7][10][2], // var
      FORTE[7][10][1]],
      '10,-1': [[0, 3, 5, 6, 7, 8, 9], // 233
      FORTE[7][10][2], // var
      FORTE[7][10][1]],
      '11,1': [FORTE[7][11][0], // 234
      FORTE[7][11][2], // var
      FORTE[7][11][1]],
      '11,-1': [[0, 2, 3, 4, 5, 7, 8], // 235
      FORTE[7][11][2], // var
      FORTE[7][11][1]],
      '12,0': [FORTE[7][12][0], // 236
      FORTE[7][12][2], // var
      FORTE[7][12][1]],
      '13,1': [FORTE[7][13][0], // 237
      FORTE[7][13][2], // var
      FORTE[7][13][1]],
      '13,-1': [[0, 2, 3, 4, 6, 7, 8], // 238
      FORTE[7][13][2], // var
      FORTE[7][13][1]],
      '14,1': [FORTE[7][14][0], // 239
      FORTE[7][14][2], // var
      FORTE[7][14][1]],
      '14,-1': [[0, 1, 3, 5, 6, 7, 8], // 240
      FORTE[7][14][2], // var
      FORTE[7][14][1]],
      '15,0': [FORTE[7][15][0], // 241
      FORTE[7][15][2], // var
      FORTE[7][15][1]],
      '16,1': [FORTE[7][16][0], // 242
      FORTE[7][16][2], // var
      FORTE[7][16][1]],
      '16,-1': [[0, 3, 4, 6, 7, 8, 9], // 243
      FORTE[7][16][2], // var
      FORTE[7][16][1]],
      '17,0': [FORTE[7][17][0], // 244
      FORTE[7][17][2], // var
      FORTE[7][17][1]],
      '18,1': [FORTE[7][18][0], // 245
      FORTE[7][18][2], // var
      FORTE[7][18][1]],
      '18,-1': [[0, 1, 4, 6, 7, 8, 9], // 246
      FORTE[7][18][2], // var
      FORTE[7][18][1]],
      '19,1': [FORTE[7][19][0], // 247
      FORTE[7][19][2], // var
      FORTE[7][19][1]],
      '19,-1': [[0, 2, 3, 6, 7, 8, 9], // 248
      FORTE[7][19][2], // var
      FORTE[7][19][1]],
      '20,1': [FORTE[7][20][0], // 249
      FORTE[7][20][2], // var
      FORTE[7][20][1]],
      '20,-1': [[0, 1, 2, 5, 7, 8, 9], // 250
      FORTE[7][20][2], // var
      FORTE[7][20][1]],
      '21,1': [FORTE[7][21][0], // 251
      FORTE[7][21][2], // var
      FORTE[7][21][1]],
      '21,-1': [[0, 1, 4, 5, 7, 8, 9], // 252
      FORTE[7][21][2], // var
      FORTE[7][21][1]],
      '22,0': [FORTE[7][22][0], // 253
      FORTE[7][22][2], // var
      FORTE[7][22][1]],
      '23,1': [FORTE[7][23][0], // 254
      FORTE[7][23][2], // var
      FORTE[7][23][1]],
      '23,-1': [[0, 2, 4, 5, 6, 7, 9], // 255
      FORTE[7][23][2], // var
      FORTE[7][23][1]],
      '24,1': [FORTE[7][24][0], // 256
      FORTE[7][24][2], // var
      FORTE[7][24][1]],
      '24,-1': [[0, 2, 4, 6, 7, 8, 9], // 257
      FORTE[7][24][2], // var
      FORTE[7][24][1]],
      '25,1': [FORTE[7][25][0], // 258
      FORTE[7][25][2], // var
      FORTE[7][25][1]],
      '25,-1': [[0, 2, 3, 5, 6, 7, 9], // 259
      FORTE[7][25][2], // var
      FORTE[7][25][1]],
      '26,1': [FORTE[7][26][0], // 260
      FORTE[7][26][2], // var
      FORTE[7][26][1]],
      '26,-1': [[0, 2, 4, 5, 6, 8, 9], // 261
      FORTE[7][26][2], // var
      FORTE[7][26][1]],
      '27,1': [FORTE[7][27][0], // 262
      FORTE[7][27][2], // var
      FORTE[7][27][1]],
      '27,-1': [[0, 2, 4, 5, 7, 8, 9], // 263
      FORTE[7][27][2], // var
      FORTE[7][27][1]],
      '28,1': [FORTE[7][28][0], // 264
      FORTE[7][28][2], // var
      FORTE[7][28][1]],
      '28,-1': [[0, 2, 3, 4, 6, 8, 9], // 265
      FORTE[7][28][2], // var
      FORTE[7][28][1]],
      '29,1': [FORTE[7][29][0], // 266
      FORTE[7][29][2], // var
      FORTE[7][29][1]],
      '29,-1': [[0, 2, 3, 5, 7, 8, 9], // 267
      FORTE[7][29][2], // var
      FORTE[7][29][1]],
      '30,1': [FORTE[7][30][0], // 268
      FORTE[7][30][2], // var
      FORTE[7][30][1]],
      '30,-1': [[0, 1, 3, 5, 7, 8, 9], // 269
      FORTE[7][30][2], // var
      FORTE[7][30][1]],
      '31,1': [FORTE[7][31][0], // 270
      FORTE[7][31][2], // var
      FORTE[7][31][1]],
      '31,-1': [[0, 2, 3, 5, 6, 8, 9], // 271
      FORTE[7][31][2], // var
      FORTE[7][31][1]],
      '32,1': [FORTE[7][32][0], // 272
      FORTE[7][32][2], // var
      FORTE[7][32][1]],
      '32,-1': [[0, 1, 3, 5, 6, 8, 9], // 273
      FORTE[7][32][2], // var
      FORTE[7][32][1]],
      '33,0': [FORTE[7][33][0], // 274
      FORTE[7][33][2], // var
      FORTE[7][33][1]],
      '34,0': [FORTE[7][34][0], // 275
      FORTE[7][34][2], // var
      FORTE[7][34][1]],
      '35,0': [FORTE[7][35][0], // 276
      FORTE[7][35][2], // var
      FORTE[7][35][1]],
      '36,1': [FORTE[7][36][0], // 277
      FORTE[7][36][2], // var
      FORTE[7][36][1]],
      '36,-1': [[0, 2, 3, 5, 6, 7, 8], // 278
      FORTE[7][36][2], // var
      FORTE[7][36][1]],
      '37,0': [FORTE[7][37][0], // 279
      FORTE[7][37][2], // var
      FORTE[7][37][1]],
      '38,1': [FORTE[7][38][0], // 280
      FORTE[7][38][2], // var
      FORTE[7][38][1]],
      '38,-1': [[0, 1, 3, 4, 6, 7, 8], // 281
      FORTE[7][38][2], // var
      FORTE[7][38][1]]
  };
  // cardinality 8
  var card_8 = { '1,0': [FORTE[8][1][0], // 282
      FORTE[8][1][2], // var
      FORTE[8][1][1]],
      '2,1': [FORTE[8][2][0], // 283
      FORTE[8][2][2], // var
      FORTE[8][2][1]],
      '2,-1': [[0, 2, 3, 4, 5, 6, 7, 8], // 284
      FORTE[8][2][2], // var
      FORTE[8][2][1]],
      '3,0': [FORTE[8][3][0], // 285
      FORTE[8][3][2], // var
      FORTE[8][3][1]],
      '4,1': [FORTE[8][4][0], // 286
      FORTE[8][4][2], // var
      FORTE[8][4][1]],
      '4,-1': [[0, 1, 3, 4, 5, 6, 7, 8], // 287
      FORTE[8][4][2], // var
      FORTE[8][4][1]],
      '5,1': [FORTE[8][5][0], // 288
      FORTE[8][5][2], // var
      FORTE[8][5][1]],
      '5,-1': [[0, 1, 2, 4, 5, 6, 7, 8], // 289
      FORTE[8][5][2], // var
      FORTE[8][5][1]],
      '6,0': [FORTE[8][6][0], // 290
      FORTE[8][6][2], // var
      FORTE[8][6][1]],
      '7,0': [FORTE[8][7][0], // 291
      FORTE[8][7][2], // var
      FORTE[8][7][1]],
      '8,0': [FORTE[8][8][0], // 292
      FORTE[8][8][2], // var
      FORTE[8][8][1]],
      '9,0': [FORTE[8][9][0], // 293
      FORTE[8][9][2], // var
      FORTE[8][9][1]],
      '10,0': [FORTE[8][10][0], // 294
      FORTE[8][10][2], // var
      FORTE[8][10][1]],
      '11,1': [FORTE[8][11][0], // 295
      FORTE[8][11][2], // var
      FORTE[8][11][1]],
      '11,-1': [[0, 2, 4, 5, 6, 7, 8, 9], // 296
      FORTE[8][11][2], // var
      FORTE[8][11][1]],
      '12,1': [FORTE[8][12][0], // 297
      FORTE[8][12][2], // var
      FORTE[8][12][1]],
      '12,-1': [[0, 2, 3, 4, 5, 6, 8, 9], // 298
      FORTE[8][12][2], // var
      FORTE[8][12][1]],
      '13,1': [FORTE[8][13][0], // 299
      FORTE[8][13][2], // var
      FORTE[8][13][1]],
      '13,-1': [[0, 2, 3, 5, 6, 7, 8, 9], // 300
      FORTE[8][13][2], // var
      FORTE[8][13][1]],
      '14,1': [FORTE[8][14][0], // 301
      FORTE[8][14][2], // var
      FORTE[8][14][1]],
      '14,-1': [[0, 2, 3, 4, 5, 7, 8, 9], // 302
      FORTE[8][14][2], // var
      FORTE[8][14][1]],
      '15,1': [FORTE[8][15][0], // 303
      FORTE[8][15][2], // var
      FORTE[8][15][1]],
      '15,-1': [[0, 1, 3, 5, 6, 7, 8, 9], // 304
      FORTE[8][15][2], // var
      FORTE[8][15][1]],
      '16,1': [FORTE[8][16][0], // 305
      FORTE[8][16][2], // var
      FORTE[8][16][1]],
      '16,-1': [[0, 1, 2, 4, 6, 7, 8, 9], // 306
      FORTE[8][16][2], // var
      FORTE[8][16][1]],
      '17,0': [FORTE[8][17][0], // 307
      FORTE[8][17][2], // var
      FORTE[8][17][1]],
      '18,1': [FORTE[8][18][0], // 308
      FORTE[8][18][2], // var
      FORTE[8][18][1]],
      '18,-1': [[0, 1, 3, 4, 6, 7, 8, 9], // 309
      FORTE[8][18][2], // var
      FORTE[8][18][1]],
      '19,1': [FORTE[8][19][0], // 310
      FORTE[8][19][2], // var
      FORTE[8][19][1]],
      '19,-1': [[0, 1, 3, 4, 5, 7, 8, 9], // 311
      FORTE[8][19][2], // var
      FORTE[8][19][1]],
      '20,0': [FORTE[8][20][0], // 312
      FORTE[8][20][2], // var
      FORTE[8][20][1]],
      '21,0': [FORTE[8][21][0], // 313
      FORTE[8][21][2], // var
      FORTE[8][21][1]],
      '22,1': [FORTE[8][22][0], // 314
      FORTE[8][22][2], // var
      FORTE[8][22][1]],
      '22,-1': [[0, 2, 4, 5, 7, 8, 9, 10], // 315
      FORTE[8][22][2], // var
      FORTE[8][22][1]],
      '23,0': [FORTE[8][23][0], // 316
      FORTE[8][23][2], // var
      FORTE[8][23][1]],
      '24,0': [FORTE[8][24][0], // 317
      FORTE[8][24][2], // var
      FORTE[8][24][1]],
      '25,0': [FORTE[8][25][0], // 318
      FORTE[8][25][2], // var
      FORTE[8][25][1]],
      '26,0': [FORTE[8][26][0], // 319
      FORTE[8][26][2], // var
      FORTE[8][26][1]],
      '27,1': [FORTE[8][27][0], // 320
      FORTE[8][27][2], // var
      FORTE[8][27][1]],
      '27,-1': [[0, 2, 3, 5, 6, 8, 9, 10], // 321
      FORTE[8][27][2], // var
      FORTE[8][27][1]],
      '28,0': [FORTE[8][28][0], // 322
      FORTE[8][28][2], // var
      FORTE[8][28][1]],
      '29,1': [FORTE[8][29][0], // 323
      FORTE[8][29][2], // var
      FORTE[8][29][1]],
      '29,-1': [[0, 2, 3, 4, 6, 7, 8, 9], // 324
      FORTE[8][29][2], // var
      FORTE[8][29][1]]
  };
  // cardinality 9
  var card_9 = { '1,0': [FORTE[9][1][0], // 325
      FORTE[9][1][2], // var
      FORTE[9][1][1]],
      '2,1': [FORTE[9][2][0], // 326
      FORTE[9][2][2], // var
      FORTE[9][2][1]],
      '2,-1': [[0, 2, 3, 4, 5, 6, 7, 8, 9], // 327
      FORTE[9][2][2], // var
      FORTE[9][2][1]],
      '3,1': [FORTE[9][3][0], // 328
      FORTE[9][3][2], // var
      FORTE[9][3][1]],
      '3,-1': [[0, 1, 3, 4, 5, 6, 7, 8, 9], // 329
      FORTE[9][3][2], // var
      FORTE[9][3][1]],
      '4,1': [FORTE[9][4][0], // 330
      FORTE[9][4][2], // var
      FORTE[9][4][1]],
      '4,-1': [[0, 1, 2, 4, 5, 6, 7, 8, 9], // 331
      FORTE[9][4][2], // var
      FORTE[9][4][1]],
      '5,1': [FORTE[9][5][0], // 332
      FORTE[9][5][2], // var
      FORTE[9][5][1]],
      '5,-1': [[0, 1, 2, 3, 5, 6, 7, 8, 9], // 333
      FORTE[9][5][2], // var
      FORTE[9][5][1]],
      '6,0': [FORTE[9][6][0], // 334
      FORTE[9][6][2], // var
      FORTE[9][6][1]],
      '7,1': [FORTE[9][7][0], // 335
      FORTE[9][7][2], // var
      FORTE[9][7][1]],
      '7,-1': [[0, 2, 3, 5, 6, 7, 8, 9, 10], // 336
      FORTE[9][7][2], // var
      FORTE[9][7][1]],
      '8,1': [FORTE[9][8][0], // 337
      FORTE[9][8][2], // var
      FORTE[9][8][1]],
      '8,-1': [[0, 2, 3, 4, 6, 7, 8, 9, 10], // 338
      FORTE[9][8][2], // var
      FORTE[9][8][1]],
      '9,0': [FORTE[9][9][0], // 339
      FORTE[9][9][2], // var
      FORTE[9][9][1]],
      '10,0': [FORTE[9][10][0], // 340
      FORTE[9][10][2], // var
      FORTE[9][10][1]],
      '11,1': [FORTE[9][11][0], // 341
      FORTE[9][11][2], // var
      FORTE[9][11][1]],
      '11,-1': [[0, 1, 3, 4, 5, 7, 8, 9, 10], // 342
      FORTE[9][11][2], // var
      FORTE[9][11][1]],
      '12,0': [FORTE[9][12][0], // 343
      FORTE[9][12][2], // var
      FORTE[9][12][1]]
  };
  // cardinality 10
  var card_10 = { '1,0': [FORTE[10][1][0], // 344
      FORTE[10][1][2], // var
      FORTE[10][1][1]],
      '2,0': [FORTE[10][2][0], // 345
      FORTE[10][2][2], // var
      FORTE[10][2][1]],
      '3,0': [FORTE[10][3][0], // 346
      FORTE[10][3][2], // var
      FORTE[10][3][1]],
      '4,0': [FORTE[10][4][0], // 347
      FORTE[10][4][2], // var
      FORTE[10][4][1]],
      '5,0': [FORTE[10][5][0], // 348
      FORTE[10][5][2], // var
      FORTE[10][5][1]],
      '6,0': [FORTE[10][6][0], // 349
      FORTE[10][6][2], // var
      FORTE[10][6][1]]
  };
  // cardinality 11
  var card_11 = { '1,0': [FORTE[11][1][0], // 350
      FORTE[11][1][2], // var
      FORTE[11][1][1]]
  };
  // cardinality 12
  var card_12 = { '1,0': [FORTE[12][1][0], // 351
      FORTE[12][1][2], // var
      FORTE[12][1][1]]
  };

  //-------------------------------------------------------------------------------
  var SCDICT = { 1: card_1,
      2: card_2,
      3: card_3,
      4: card_4,
      5: card_5,
      6: card_6,
      7: card_7,
      8: card_8,
      9: card_9,
      10: card_10,
      11: card_11,
      12: card_12
  };

  //-------------------------------------------------------------------------------
  // thes dicts provide index max fr cardinality key
  var TNMAX = { 0: 1, 1: 1, 2: 6, 3: 19, 4: 43, 5: 66, 6: 80,
      7: 66, 8: 43, 9: 19, 10: 6, 11: 1, 12: 1 };
  var TNIMAX = { 0: 1, 1: 1, 2: 6, 3: 12, 4: 29, 5: 38, 6: 50,
      7: 38, 8: 29, 9: 12, 10: 6, 11: 1, 12: 1 };

  // used to find TnI index numbers under Tn classification
  var TNREF = { '1,1,0': 1,
      '2,1,0': 1,
      '2,2,0': 2,
      '2,3,0': 3,
      '2,4,0': 4,
      '2,5,0': 5,
      '2,6,0': 6,
      '3,1,0': 1,
      '3,2,1': 2,
      '3,2,-1': 3,
      '3,3,1': 4,
      '3,3,-1': 5,
      '3,4,1': 6,
      '3,4,-1': 7,
      '3,5,1': 8,
      '3,5,-1': 9,
      '3,6,0': 10,
      '3,7,1': 11,
      '3,7,-1': 12,
      '3,8,1': 13,
      '3,8,-1': 14,
      '3,9,0': 15,
      '3,10,0': 16,
      '3,11,1': 17,
      '3,11,-1': 18,
      '3,12,0': 19,
      '4,1,0': 1,
      '4,2,1': 2,
      '4,2,-1': 3,
      '4,3,0': 4,
      '4,4,1': 5,
      '4,4,-1': 6,
      '4,5,1': 7,
      '4,5,-1': 8,
      '4,6,0': 9,
      '4,7,0': 10,
      '4,8,0': 11,
      '4,9,0': 12,
      '4,10,0': 13,
      '4,11,1': 14,
      '4,11,-1': 15,
      '4,12,1': 16,
      '4,12,-1': 17,
      '4,13,1': 18,
      '4,13,-1': 19,
      '4,14,1': 20,
      '4,14,-1': 21,
      '4,15,1': 22,
      '4,15,-1': 23,
      '4,16,1': 24,
      '4,16,-1': 25,
      '4,17,0': 26,
      '4,18,1': 27,
      '4,18,-1': 28,
      '4,19,1': 29,
      '4,19,-1': 30,
      '4,20,0': 31,
      '4,21,0': 32,
      '4,22,1': 33,
      '4,22,-1': 34,
      '4,23,0': 35,
      '4,24,0': 36,
      '4,25,0': 37,
      '4,26,0': 38,
      '4,27,1': 39,
      '4,27,-1': 40,
      '4,28,0': 41,
      '4,29,1': 42,
      '4,29,-1': 43,
      '5,1,0': 1,
      '5,2,1': 2,
      '5,2,-1': 3,
      '5,3,1': 4,
      '5,3,-1': 5,
      '5,4,1': 6,
      '5,4,-1': 7,
      '5,5,1': 8,
      '5,5,-1': 9,
      '5,6,1': 10,
      '5,6,-1': 11,
      '5,7,1': 12,
      '5,7,-1': 13,
      '5,8,0': 14,
      '5,9,1': 15,
      '5,9,-1': 16,
      '5,10,1': 17,
      '5,10,-1': 18,
      '5,11,1': 19,
      '5,11,-1': 20,
      '5,12,0': 21,
      '5,13,1': 22,
      '5,13,-1': 23,
      '5,14,1': 24,
      '5,14,-1': 25,
      '5,15,0': 26,
      '5,16,1': 27,
      '5,16,-1': 28,
      '5,17,0': 29,
      '5,18,1': 30,
      '5,18,-1': 31,
      '5,19,1': 32,
      '5,19,-1': 33,
      '5,20,1': 34,
      '5,20,-1': 35,
      '5,21,1': 36,
      '5,21,-1': 37,
      '5,22,0': 38,
      '5,23,1': 39,
      '5,23,-1': 40,
      '5,24,1': 41,
      '5,24,-1': 42,
      '5,25,1': 43,
      '5,25,-1': 44,
      '5,26,1': 45,
      '5,26,-1': 46,
      '5,27,1': 47,
      '5,27,-1': 48,
      '5,28,1': 49,
      '5,28,-1': 50,
      '5,29,1': 51,
      '5,29,-1': 52,
      '5,30,1': 53,
      '5,30,-1': 54,
      '5,31,1': 55,
      '5,31,-1': 56,
      '5,32,1': 57,
      '5,32,-1': 58,
      '5,33,0': 59,
      '5,34,0': 60,
      '5,35,0': 61,
      '5,36,1': 62,
      '5,36,-1': 63,
      '5,37,0': 64,
      '5,38,1': 65,
      '5,38,-1': 66,
      '6,1,0': 1,
      '6,2,1': 2,
      '6,2,-1': 3,
      '6,3,1': 4,
      '6,3,-1': 5,
      '6,4,0': 6,
      '6,5,1': 7,
      '6,5,-1': 8,
      '6,6,0': 9,
      '6,7,0': 10,
      '6,8,0': 11,
      '6,9,1': 12,
      '6,9,-1': 13,
      '6,10,1': 14,
      '6,10,-1': 15,
      '6,11,1': 16,
      '6,11,-1': 17,
      '6,12,1': 18,
      '6,12,-1': 19,
      '6,13,0': 20,
      '6,14,1': 21,
      '6,14,-1': 22,
      '6,15,1': 23,
      '6,15,-1': 24,
      '6,16,1': 25,
      '6,16,-1': 26,
      '6,17,1': 27,
      '6,17,-1': 28,
      '6,18,1': 29,
      '6,18,-1': 30,
      '6,19,1': 31,
      '6,19,-1': 32,
      '6,20,0': 33,
      '6,21,1': 34,
      '6,21,-1': 35,
      '6,22,1': 36,
      '6,22,-1': 37,
      '6,23,0': 38,
      '6,24,1': 39,
      '6,24,-1': 40,
      '6,25,1': 41,
      '6,25,-1': 42,
      '6,26,0': 43,
      '6,27,1': 44,
      '6,27,-1': 45,
      '6,28,0': 46,
      '6,29,0': 47,
      '6,30,1': 48,
      '6,30,-1': 49,
      '6,31,1': 50,
      '6,31,-1': 51,
      '6,32,0': 52,
      '6,33,1': 53,
      '6,33,-1': 54,
      '6,34,1': 55,
      '6,34,-1': 56,
      '6,35,0': 57,
      '6,36,1': 58,
      '6,36,-1': 59,
      '6,37,0': 60,
      '6,38,0': 61,
      '6,39,1': 62,
      '6,39,-1': 63,
      '6,40,1': 64,
      '6,40,-1': 65,
      '6,41,1': 66,
      '6,41,-1': 67,
      '6,42,0': 68,
      '6,43,1': 69,
      '6,43,-1': 70,
      '6,44,1': 71,
      '6,44,-1': 72,
      '6,45,0': 73,
      '6,46,1': 74,
      '6,46,-1': 75,
      '6,47,1': 76,
      '6,47,-1': 77,
      '6,48,0': 78,
      '6,49,0': 79,
      '6,50,0': 80,
      '7,1,0': 1,
      '7,2,1': 2,
      '7,2,-1': 3,
      '7,3,1': 4,
      '7,3,-1': 5,
      '7,4,1': 6,
      '7,4,-1': 7,
      '7,5,1': 8,
      '7,5,-1': 9,
      '7,6,1': 10,
      '7,6,-1': 11,
      '7,7,1': 12,
      '7,7,-1': 13,
      '7,8,0': 14,
      '7,9,1': 15,
      '7,9,-1': 16,
      '7,10,1': 17,
      '7,10,-1': 18,
      '7,11,1': 19,
      '7,11,-1': 20,
      '7,12,0': 21,
      '7,13,1': 22,
      '7,13,-1': 23,
      '7,14,1': 24,
      '7,14,-1': 25,
      '7,15,0': 26,
      '7,16,1': 27,
      '7,16,-1': 28,
      '7,17,0': 29,
      '7,18,1': 30,
      '7,18,-1': 31,
      '7,19,1': 32,
      '7,19,-1': 33,
      '7,20,1': 34,
      '7,20,-1': 35,
      '7,21,1': 36,
      '7,21,-1': 37,
      '7,22,0': 38,
      '7,23,1': 39,
      '7,23,-1': 40,
      '7,24,1': 41,
      '7,24,-1': 42,
      '7,25,1': 43,
      '7,25,-1': 44,
      '7,26,1': 45,
      '7,26,-1': 46,
      '7,27,1': 47,
      '7,27,-1': 48,
      '7,28,1': 49,
      '7,28,-1': 50,
      '7,29,1': 51,
      '7,29,-1': 52,
      '7,30,1': 53,
      '7,30,-1': 54,
      '7,31,1': 55,
      '7,31,-1': 56,
      '7,32,1': 57,
      '7,32,-1': 58,
      '7,33,0': 59,
      '7,34,0': 60,
      '7,35,0': 61,
      '7,36,1': 62,
      '7,36,-1': 63,
      '7,37,0': 64,
      '7,38,1': 65,
      '7,38,-1': 66,
      '8,1,0': 1,
      '8,2,1': 2,
      '8,2,-1': 3,
      '8,3,0': 4,
      '8,4,1': 5,
      '8,4,-1': 6,
      '8,5,1': 7,
      '8,5,-1': 8,
      '8,6,0': 9,
      '8,7,0': 10,
      '8,8,0': 11,
      '8,9,0': 12,
      '8,10,0': 13,
      '8,11,1': 14,
      '8,11,-1': 15,
      '8,12,1': 16,
      '8,12,-1': 17,
      '8,13,1': 18,
      '8,13,-1': 19,
      '8,14,1': 20,
      '8,14,-1': 21,
      '8,15,1': 22,
      '8,15,-1': 23,
      '8,16,1': 24,
      '8,16,-1': 25,
      '8,17,0': 26,
      '8,18,1': 27,
      '8,18,-1': 28,
      '8,19,1': 29,
      '8,19,-1': 30,
      '8,20,0': 31,
      '8,21,0': 32,
      '8,22,1': 33,
      '8,22,-1': 34,
      '8,23,0': 35,
      '8,24,0': 36,
      '8,25,0': 37,
      '8,26,0': 38,
      '8,27,1': 39,
      '8,27,-1': 40,
      '8,28,0': 41,
      '8,29,1': 42,
      '8,29,-1': 43,
      '9,1,0': 1,
      '9,2,1': 2,
      '9,2,-1': 3,
      '9,3,1': 4,
      '9,3,-1': 5,
      '9,4,1': 6,
      '9,4,-1': 7,
      '9,5,1': 8,
      '9,5,-1': 9,
      '9,6,0': 10,
      '9,7,1': 11,
      '9,7,-1': 12,
      '9,8,1': 13,
      '9,8,-1': 14,
      '9,9,0': 15,
      '9,10,0': 16,
      '9,11,1': 17,
      '9,11,-1': 18,
      '9,12,0': 19,
      '10,1,0': 1,
      '10,2,0': 2,
      '10,3,0': 3,
      '10,4,0': 4,
      '10,5,0': 5,
      '10,6,0': 6,
      '11,1,0': 1,
      '12,1,0': 1
  };

  // -----------------------------------------------------------------||||||||||||--
  // reference dict stores name and citation references

  // names found from many sources, including:
  // http://solo1.home.mindspring.com/pcsets.htm
  // Larry Solomon, 1997, 2000
  // Larry Solomon's 'The List of Chords, Their Properties and Use in Analysis,'
  // in Interface, Journal of New Music Research , 1982, v11/2.
  // http://www.sweb.cz/vladimir_ladma/english/music/structs/mus_rot.htm
  // Vladimir Ladma, Czech Republic

  // some changes: unison prefered to monad


  var SCREF = {
      '1,1,0': { 'name': ['unison', 'monad', 'singleton'] },
      '2,1,0': { 'name': ['interval class 1', 'minor second', 'm2', 'half step', 'semitone'] },
      '2,2,0': { 'name': ['interval class 2', 'major second', 'M2', 'whole step', 'whole tone'] },
      '2,3,0': { 'name': ['interval class 3', 'minor third', 'm3'] },
      '2,4,0': { 'name': ['interval class 4', 'major third', 'M3'] },
      '2,5,0': { 'name': ['interval class 5', 'perfect fourth', 'P4'] },
      '2,6,0': { 'name': ['tritone', 'diminished fifth', 'augmented fourth'] },
      '3,1,0': { 'name': ['chromatic trimirror'] },
      '3,2,1': { 'name': ['phrygian trichord'] },
      '3,2,-1': { 'name': ['minor trichord'] },
      '3,3,1': { 'name': ['major-minor trichord'] },
      '3,3,-1': { 'name': ['major-minor trichord'] },
      '3,4,1': { 'name': ['incomplete major-seventh chord'] },
      '3,4,-1': { 'name': ['incomplete major-seventh chord'] },
      '3,5,1': { 'name': ['tritone-fourth'] },
      '3,5,-1': { 'name': ['tritone-fourth'] },
      '3,6,0': { 'name': ['whole-tone trichord'] },
      '3,7,1': { 'name': ['incomplete minor-seventh chord'] },
      '3,7,-1': { 'name': ['incomplete dominant-seventh chord'] },
      '3,8,1': { 'name': ['incomplete dominant-seventh chord', 'Italian augmented sixth chord'] },
      '3,8,-1': { 'name': ['incomplete half-diminished seventh chord'] },
      '3,9,0': { 'name': ['quartal trichord'] },
      '3,10,0': { 'name': ['diminished triad'] },
      '3,11,1': { 'name': ['minor triad'] },
      '3,11,-1': { 'name': ['major triad'] },
      '3,12,0': { 'name': ['augmented triad', 'equal 3-part octave division'] },
      '4,1,0': { 'name': ['chromatic tetramirror', 'BACH'] },
      '4,2,1': { 'name': ['major-second tetracluster'] },
      '4,2,-1': { 'name': ['major-second tetracluster'] },
      '4,3,0': { 'name': ['alternating tetramirror'] },
      '4,4,1': { 'name': ['minor third tetracluster'] },
      '4,4,-1': { 'name': ['minor third tetracluster'] },
      '4,5,1': { 'name': ['major third tetracluster'] },
      '4,5,-1': { 'name': ['major third testacluster'] },
      '4,6,0': { 'name': ['perfect fourth tetramirror'] },
      '4,7,0': { 'name': ['Arabian tetramirror'] },
      '4,8,0': { 'name': ['double-fourth tetramirror'] },
      '4,9,0': { 'name': ['double tritone tetramirror'] },
      '4,10,0': { 'name': ['minor tetramirror'] },
      '4,11,1': { 'name': ['phrygian tetrachord'] },
      '4,11,-1': { 'name': ['lydian tetrachord', 'major tetrachord'] },
      '4,12,1': { 'name': ['harmonic minor tetrachord'] },
      '4,12,-1': { 'name': ['major-third diminished terachord'] },
      '4,13,1': { 'name': ['minor-second diminished tetrachord'] },
      '4,13,-1': { 'name': ['perfect-fourth diminished tetrachord'] },
      '4,14,1': { 'name': ['major-second minor tetrachord'] },
      '4,14,-1': { 'name': ['perfect-fourth major tetrachord'] },
      '4,15,1': { 'name': ['all-interval tetrachord'] },
      '4,15,-1': { 'name': ['all-interval tetrachord'] },
      '4,16,1': { 'name': ['minor-second quartal tetrachord'] },
      '4,16,-1': { 'name': ['tritone quartal tetrachord'] },
      '4,17,0': { 'name': ['major-minor tetramirror'] },
      '4,18,1': { 'name': ['major-diminished tetrachord'] },
      '4,18,-1': { 'name': ['minor-diminished tetrachord'] },
      '4,19,1': { 'name': ['minor-augmented tetrachord'] },
      '4,19,-1': { 'name': ['augmented major tetrachord'] },
      '4,20,0': { 'name': ['major seventh chord'] },
      '4,21,0': { 'name': ['whole-tone tetramirror'] },
      '4,22,1': { 'name': ['major-second major tetrachord'] },
      '4,22,-1': { 'name': ['perfect-fourth minor tetrachord'] },
      '4,23,0': { 'name': ['quartal tetramirror'] },
      '4,24,0': { 'name': ['augmented seventh chord'] },
      '4,25,0': { 'name': ["Messiaen's truncated mode 6", 'French augmented sixth chord'] },
      '4,26,0': { 'name': ['minor seventh chord'] },
      '4,27,1': { 'name': ['half-diminished seventh chord'] },
      '4,27,-1': { 'name': ['dominant seventh chord', 'major minor seventh chord', 'German augmented sixth chord', 'Swiss augmented sixth chord'] },
      '4,28,0': { 'name': ['diminished seventh chord', 'equal 4-part octave division'] },
      '4,29,1': { 'name': ['all-interval tetrachord'] },
      '4,29,-1': { 'name': ['all-interval tetrachord'] },
      '5,1,0': { 'name': ['chromatic pentamirror'] },
      '5,2,1': { 'name': ['major-second pentacluster'] },
      '5,2,-1': { 'name': ['major-second pentacluster'] },
      '5,3,1': { 'name': ['minor-second major pentachord'] },
      '5,3,-1': { 'name': ['Spanish pentacluster'] },
      '5,4,1': { 'name': ['blues pentacluster'] },
      '5,4,-1': { 'name': ['minor-third pentacluster'] },
      '5,5,1': { 'name': ['major-third pentacluster'] },
      '5,5,-1': { 'name': ['major-third pentacluster'] },
      '5,6,1': { 'name': ['Asian pentacluster', 'quasi raga Megharanji'] },
      '5,6,-1': { 'name': ['Asian pentacluster'] },
      '5,7,1': { 'name': ['double pentacluster', 'quasi raga Nabhomani '] },
      '5,7,-1': { 'name': ['double pentacluster'] },
      '5,8,0': { 'name': ['tritone-symmetric pentamirror'] },
      '5,9,1': { 'name': ['tritone-expanding pentachord'] },
      '5,9,-1': { 'name': ['tritone-contracting pentachord'] },
      '5,10,1': { 'name': ['alternating pentachord'] },
      '5,10,-1': { 'name': ['alternating pentachord'] },
      '5,11,1': { 'name': ['center-cluster pentachord'] },
      '5,11,-1': { 'name': ['center-cluster pentachord'] },
      '5,12,0': { 'name': ['locrian pentachord'] },
      '5,13,1': { 'name': ['augmented pentacluster'] },
      '5,13,-1': { 'name': ['augmented pentacluster'] },
      '5,14,1': { 'name': ['double-seconds triple-fourth pentachord'] },
      '5,14,-1': { 'name': ['double-seconds triple-fourth pentachord'] },
      '5,15,0': { 'name': ['asssymetric pentamirror'] },
      '5,16,1': { 'name': ['major-minor-diminished pentachord'] },
      '5,16,-1': { 'name': ['major-minor diminished pentachord'] },
      '5,17,0': { 'name': ['minor-major ninth chord'] },
      '5,18,1': { 'name': ['Roma [Gypsy] pentachord'] },
      '5,18,-1': { 'name': ['Roma [Gypsy] pentachord'] },
      '5,19,1': { 'name': ['Javanese pentachord'] },
      '5,19,-1': { 'name': ['Balinese pentachord'] },
      '5,20,1': { 'name': ['Balinese Pelog pentatonic', 'quasi raga Bhupala', 'quasi raga Bibhas'] },
      '5,20,-1': { 'name': ['Hirajoshi pentatonic', 'Iwato', 'Sakura', 'quasi raga Saveri'] },
      '5,21,1': { 'name': ['major-augmented ninth chord', 'Syrian pentatonic', 'quasi raga Megharanji'] },
      '5,21,-1': { 'name': ['Lebanese pentachord', 'augmented-minor chord'] },
      '5,22,0': { 'name': ['Persian pentamirror', 'quasi raga Ramkali'] },
      '5,23,1': { 'name': ['dorian pentachord', 'minor pentachord'] },
      '5,23,-1': { 'name': ['major pentachord'] },
      '5,24,1': { 'name': ['phrygian pentachord'] },
      '5,24,-1': { 'name': ['lydian pentachord'] },
      '5,25,1': { 'name': ['diminished-major ninth chord'] },
      '5,25,-1': { 'name': ['minor-diminished ninth chord'] },
      '5,26,1': { 'name': ['diminished-augmented ninth chord'] },
      '5,26,-1': { 'name': ['augmented-diminished ninth chord'] },
      '5,27,1': { 'name': ['major-ninth chord'] },
      '5,27,-1': { 'name': ['minor-ninth chord'] },
      '5,28,1': { 'name': ['augmented-sixth pentachord'] },
      '5,28,-1': { 'name': ['Javanese pentatonic', 'augmented-sixth pentachord'] },
      '5,29,1': { 'name': ['Kumoi pentachord'] },
      '5,29,-1': { 'name': ['Kumoi pentachord'] },
      '5,30,1': { 'name': ['enigmatic pentachord'] },
      '5,30,-1': { 'name': ['enigmatic pentachord', 'altered pentatonic'] },
      '5,31,1': { 'name': ['diminished minor-ninth chord'] },
      '5,31,-1': { 'name': ['flat-ninth pentachord', 'quasi raga Ranjaniraga'] },
      '5,32,1': { 'name': ['Neapolitan pentachord'] },
      '5,32,-1': { 'name': ['Neapolitan pentachord'] },
      '5,33,0': { 'name': ['whole-tone pentachord'] },
      '5,34,0': { 'name': ['dominant-ninth', 'major-minor', 'Prometheus pentamirror', 'dominant pentatonic'] },
      '5,35,0': { 'name': ['major pentatonic', 'black-key scale', 'blues pentatonic', 'slendro', 'quartal pentamirror'] },
      '5,36,1': { 'name': ['major-seventh pentacluster'] },
      '5,36,-1': { 'name': ['minor-seventh pentacluster'] },
      '5,37,0': { 'name': ['center-cluster pentamirror'] },
      '5,38,1': { 'name': ['diminished pentacluster'] },
      '5,38,-1': { 'name': ['diminished pentacluster'] },
      '6,1,0': { 'name': ['A all combinatorial [P6, I11, RI5, RI11]', 'chromatic hexamirror', 'first-order all-combinatorial'] },
      '6,2,1': { 'name': ['combinatorial I [I11]'] },
      '6,2,-1': { 'name': ['combinatorial I [I1]'] },
      '6,3,1': {},
      '6,3,-1': {},
      '6,4,0': { 'name': ['combinatorial RI [RI6]'] },
      '6,5,1': { 'name': ['combinatorial I [I11]'] },
      '6,5,-1': { 'name': ['combinatorial I [I3]'] },
      '6,6,0': { 'name': ['double cluster hexamirror'] },
      '6,7,0': { 'name': ['B all combinatorial [P3, P9, I5, R6, R12, R8]', "Messiaen's mode 5", 'second-order all combinatorial'] },
      '6,8,0': { 'name': ['D all combinatorial [P6, I1, RI7]'] },
      '6,9,1': { 'name': ['combinatorial I [I11]'] },
      '6,9,-1': { 'name': ['combinatorial I [I3]'] },
      '6,10,1': {},
      '6,10,-1': {},
      '6,11,1': {},
      '6,11,-1': {},
      '6,12,1': {},
      '6,12,-1': {},
      '6,13,0': { 'name': ['alternating hexamirror', 'combinatorial I [I7]'] },
      '6,14,1': { 'name': ['combinatorial P [P6]'] },
      '6,14,-1': { 'name': ['combinatorial P [P6]'] },
      '6,15,1': { 'name': ['combinatorial I [I11]'] },
      '6,15,-1': { 'name': ['combinatorial I [I5]'] },
      '6,16,1': { 'name': ['combinatorial I [I3]'] },
      '6,16,-1': { 'name': ['combinatorial I [I1]', 'quasi raga Megha'] },
      '6,17,1': { 'name': ['all tri-chord hexachord'] },
      '6,17,-1': { 'name': ['all tri-chord hexachord [inverted form]'] },
      '6,18,1': { 'name': ['combinatorial I [I11]'] },
      '6,18,-1': { 'name': ['combinatorial I [I5]'] },
      '6,19,1': {},
      '6,19,-1': {},
      '6,20,0': { 'name': ['E all combinatorial [P2, P6, P10, I3, I7, R4, R8, RI1, RI5, RI9]', "Messiaen's truncated mode 3", 'Genus tertium', 'third-order all combinatorial'] },
      '6,21,1': { 'name': ['combinatorial I [I1]'] },
      '6,21,-1': { 'name': ['combinatorial I [I3]'] },
      '6,22,1': { 'name': ['combinatorial I [I11]'] },
      '6,22,-1': { 'name': ['combinatorial I [I5]'] },
      '6,23,0': { 'name': ['combinatorial RI [RI8]', 'super-locrian hexa mirror'] },
      '6,24,1': {},
      '6,24,-1': { 'name': ['melodic-minor hexachord'] },
      '6,25,1': { 'name': ['locrian hexachord'] },
      '6,25,-1': { 'name': ['minor hexachord'] },
      '6,26,0': { 'name': ['phrygian hexamirror', 'combinatorial RI [RI8]'] },
      '6,27,1': { 'name': ['combinatorial I [I11]'] },
      '6,27,-1': { 'name': ['combinatorial I [I1]', 'pyramid hexachord'] },
      '6,28,0': { 'name': ['double-phrygian heachord', 'combinatorial RI [RI6]'] },
      '6,29,0': { 'name': ['combinatorial RI [RI9]'] },
      '6,30,1': { 'name': ["Messiaen's truncated mode 2", 'minor-bitonal hexachord', 'combinatorial R [R6]', 'combinatorial I [I1, I7]'] },
      '6,30,-1': { 'name': ["Stravinsky's Petrouchka-chord", "Messiaen's truncated mode 2", 'major-bitonal hexachord', 'combinatorial R [R6]', 'combinatorial I [I1, I7]'] },
      '6,31,1': { 'name': ['combinatorial I [I7]'] },
      '6,31,-1': { 'name': ['combinatorial I [I11]'] },
      '6,32,0': { 'name': ['C all combinatorial [P6, I3, RI9]', 'Guidon/Arezzo', 'Arezzo major diatonic', 'major hexamirror', 'quartal hexamirror', 'first-order all combinatorial'] },
      '6,33,1': { 'name': ['dorian hexachord', 'combinatorial I [I6]'] },
      '6,33,-1': { 'name': ['dominant-eleventh', 'lydian hexachord', 'combinatorial I [I1]'] },
      '6,34,1': { 'name': ["Scriabin's Mystic-chord", 'Prometheus hexachord', 'combinatorial I [I11]'] },
      '6,34,-1': { 'name': ['augmented-eleventh', 'harmonic hexachord', 'combinatorial I [I7]'] },
      '6,35,0': { 'name': ['whole tone scale', '6 equal part division', 'F all-combinatorial [P1, P3, P5, P7, P9, P11, I1, I3, I5, I7, ' + 'I9, I11, R2, R4, R6, R8, R10, RI2, RI4, RI6, RI8, RI10]', "Messiaen's mode 1", 'sixth-order all combinatorial'] },
      '6,36,1': {},
      '6,36,-1': {},
      '6,37,0': { 'name': ['combinatorial RI [RI4]'] },
      '6,38,0': { 'name': ['combinatorial RI [RI3]'] },
      '6,39,1': {},
      '6,39,-1': {},
      '6,40,1': {},
      '6,40,-1': {},
      '6,41,1': {},
      '6,41,-1': {},
      '6,42,0': { 'name': ['combinatorial RI [RI3]'] },
      '6,43,1': { 'name': ['complement of all tri-chord hexachord'] },
      '6,43,-1': { 'name': ['complement of all-tri-chord hexachord [inverted form]'] },
      '6,44,1': { 'name': ['Schoenberg Anagram hexachord'] },
      '6,44,-1': { 'name': ['quasi raga Bauli'] },
      '6,45,0': { 'name': ['combinatorial RI [RI6]'] },
      '6,46,1': {},
      '6,46,-1': {},
      '6,47,1': {},
      '6,47,-1': { 'name': ['blues scale'] },
      '6,48,0': { 'name': ['combinatorial RI [RI2]'] },
      '6,49,0': { 'name': ['combinatorial RI [RI4]', 'Prometheus Neapolitan mode'] },
      '6,50,0': { 'name': ['combinatorial RI [RI1]'] },
      '7,1,0': { 'name': ['chromatic heptamirror'] },
      '7,2,1': {},
      '7,2,-1': {},
      '7,3,1': {},
      '7,3,-1': {},
      '7,4,1': {},
      '7,4,-1': {},
      '7,5,1': {},
      '7,5,-1': {},
      '7,6,1': {},
      '7,6,-1': {},
      '7,7,1': {},
      '7,7,-1': {},
      '7,8,0': {},
      '7,9,1': {},
      '7,9,-1': {},
      '7,10,1': {},
      '7,10,-1': {},
      '7,11,1': {},
      '7,11,-1': {},
      '7,12,0': {},
      '7,13,1': {},
      '7,13,-1': {},
      '7,14,1': {},
      '7,14,-1': {},
      '7,15,0': {},
      '7,16,1': { 'name': ["Debussy's heptatonic"] },
      '7,16,-1': {},
      '7,17,0': {},
      '7,18,1': {},
      '7,18,-1': {},
      '7,19,1': {},
      '7,19,-1': {},
      '7,20,1': { 'name': ['chromatic phrygian inverse'] },
      '7,20,-1': { 'name': ['Greek chromatic', 'chromatic mixolydian', 'chromatic dorian', 'quasi raga Pantuvarali', 'mela Kanakangi'] },
      '7,21,1': {},
      '7,21,-1': { 'name': ['Gypsy [Roma] hexatonic'] },
      '7,22,0': { 'name': ['double harmonic scale', 'Persian', 'major Gypsy [Roma]', 'Hungarian minor', 'double harmonic scale', 'Asian', 'quasi raga Mayamdavagaula'] },
      '7,23,1': {},
      '7,23,-1': { 'name': ['tritone major heptachord'] },
      '7,24,1': {},
      '7,24,-1': { 'name': ['mystic heptaachord', 'Enigmatic heptatonic'] },
      '7,25,1': {},
      '7,25,-1': {},
      '7,26,1': {},
      '7,26,-1': {},
      '7,27,1': {},
      '7,27,-1': { 'name': ['modified blues'] },
      '7,28,1': {},
      '7,28,-1': {},
      '7,29,1': {},
      '7,29,-1': {},
      '7,30,1': { 'name': ['Neapolitan-minor mode'] },
      '7,30,-1': {},
      '7,31,1': { 'name': ['alternating heptachord', 'Hungarian major mode'] },
      '7,31,-1': { 'name': ['diminished scale', 'alternating heptachord'] },
      '7,32,1': { 'name': ['harmonic minor scale', 'Spanish Gypsy', 'mela Kiravani'] },
      '7,32,-1': { 'name': ['harmonic major scale', 'harmonic minor inverse', 'mela Cakravana', 'quasi raga Ahir Bhairav'] },
      '7,33,0': { 'name': ['Neapolitan-major mode', 'leading-whole-tone mode'] },
      '7,34,0': { 'name': ['melodic minor ascending scale', 'jazz minor', 'augmented thirteenth heptamirror', 'harmonic/super-locrian'] },
      '7,35,0': { 'name': ['major scale', 'major diatonic heptachord', 'natural minor scale', 'dominant thirteenth', 'locrian', 'phrygian', 'major inverse'] },
      '7,36,1': {},
      '7,36,-1': {},
      '7,37,0': {},
      '7,38,1': {},
      '7,38,-1': {},
      '8,1,0': { 'name': ['chromatic octamirror'] },
      '8,2,1': {},
      '8,2,-1': {},
      '8,3,0': {},
      '8,4,1': {},
      '8,4,-1': {},
      '8,5,1': {},
      '8,5,-1': {},
      '8,6,0': {},
      '8,7,0': {},
      '8,8,0': {},
      '8,9,0': { 'name': ["Messiaen's mode 4"] },
      '8,10,0': {},
      '8,11,1': {},
      '8,11,-1': { 'name': ['blues octatonic'] },
      '8,12,1': {},
      '8,12,-1': {},
      '8,13,1': { 'name': ['blues octatonic'] },
      '8,13,-1': {},
      '8,14,1': {},
      '8,14,-1': {},
      '8,15,1': {},
      '8,15,-1': {},
      '8,16,1': {},
      '8,16,-1': { 'name': ['enigmatic octachord'] },
      '8,17,0': {},
      '8,18,1': {},
      '8,18,-1': {},
      '8,19,1': {},
      '8,19,-1': {},
      '8,20,0': {},
      '8,21,0': {},
      '8,22,1': {},
      '8,22,-1': { 'name': ['Spanish octatonic scale'] },
      '8,23,0': { 'name': ['Greek', 'blues', 'quartal octachord', 'diatonic octad'] },
      '8,24,0': {},
      '8,25,0': { 'name': ["Messiaen's mode 6"] },
      '8,26,0': { 'name': ['blues', 'Spanish phrygian'] },
      '8,27,1': {},
      '8,27,-1': {},
      '8,28,0': { 'name': ['octatonic scale', "Messiaen's mode 2", 'alternating octatonic scale', 'diminished scale'] },
      '8,29,1': {},
      '8,29,-1': {},
      '9,1,0': { 'name': ['chromatic nonamirror'] },
      '9,2,1': {},
      '9,2,-1': {},
      '9,3,1': {},
      '9,3,-1': {},
      '9,4,1': {},
      '9,4,-1': {},
      '9,5,1': {},
      '9,5,-1': {},
      '9,6,0': {},
      '9,7,1': { 'name': ['nonatonic blues'] },
      '9,7,-1': {},
      '9,8,1': {},
      '9,8,-1': {},
      '9,9,0': {},
      '9,10,0': {},
      '9,11,1': {},
      '9,11,-1': { 'name': ['diminishing nonachord'] },
      '9,12,0': { 'name': ["Messiaen's mode 3", 'Tsjerepnin'] },
      '10,1,0': { 'name': ['chromatic decamirror'] },
      '10,2,0': {},
      '10,3,0': {},
      '10,4,0': {},
      '10,5,0': { 'name': ['major-minor mixed'] },
      '10,6,0': { 'name': ["Messiaen's mode 7"] },
      '11,1,0': { 'name': ['chromatic undecamirror'] },
      '12,1,0': { 'name': ['aggregate', 'dodecachord', 'twelve-tone chromatic', 'chromatic scale', 'dodecamirror'] }
  };

  function forteIndexToInversionsAvailable(card, index) {
      if (card < 1 || card > 12) {
          throw new Error('cardinality ' + card + ' is not valid');
      }
      if (index < 1 || index > TNMAX[card]) {
          throw new Error('index ' + index + ' is invalid');
      }
      // get morris invaraince vector
      var morris = FORTE[card][index][2];
      if (morris[1] > 0) {
          // second value stored inversion status
          return [0];
      } else {
          return [-1, 1];
      }
  }

  function _chordTableAddress(cardinality, forteClass, inversion, pcOriginal) {
      return {
          cardinality: cardinality,
          forteClass: forteClass,
          inversion: inversion,
          pcOriginal: pcOriginal
      };
  }

  function _validateAddress(address) {
      if (address !== undefined && address.cardinality !== undefined) {
          // got an object...
          address = [address.cardinality, address.forteClass, address.inversion, address.pcOriginal];
      }

      var _address$slice = address.slice(0, 2),
          _address$slice2 = slicedToArray(_address$slice, 2),
          card = _address$slice2[0],
          index = _address$slice2[1];

      var inversion = void 0;
      if (address.length >= 3 && address[2] !== undefined) {
          inversion = address[2];
      }
      if (card < 1 || card > 13) {
          throw new Error('cardinality ' + card + ' not valid');
      }
      // using TN mode for all comparions
      if (index < 1 || index > TNMAX[card]) {
          throw new Error('index ' + index + ' not valid');
      }
      var inversionsAvailable = forteIndexToInversionsAvailable(card, index);
      if (inversion !== undefined) {
          if (!inversionsAvailable.includes(inversion)) {
              throw new Error('inversion ' + inversion + ' not valid');
          }
      }
      if (inversion === undefined) {
          // get a default inversion
          if (inversionsAvailable.includes(0)) {
              inversion = 0;
          } else {
              inversion = 1;
          }
      }
      return [card, index, inversion];
  }

  function addressToTransposedNormalForm(address) {
      var _validateAddress2 = _validateAddress(address),
          _validateAddress3 = slicedToArray(_validateAddress2, 3),
          card = _validateAddress3[0],
          index = _validateAddress3[1],
          inversion = _validateAddress3[2];

      var i2 = String([index, inversion]);
      return SCDICT[card][i2][0];
  }

  function addressToPrimeForm(address) {
      var _validateAddress4 = _validateAddress(address.slice(0, 2)),
          _validateAddress5 = slicedToArray(_validateAddress4, 3),
          card = _validateAddress5[0],
          index = _validateAddress5[1],
          inversion = _validateAddress5[2];

      var i2 = String([index, inversion]);
      return SCDICT[card][i2][0];
  }

  function addressToIntervalVector(address) {
      var _validateAddress6 = _validateAddress(address),
          _validateAddress7 = slicedToArray(_validateAddress6, 3),
          card = _validateAddress7[0],
          index = _validateAddress7[1],
          inversion = _validateAddress7[2];

      var i2 = String([index, inversion]);
      return SCDICT[card][i2][2];
  }

  function intervalVectorToAddress(vector) {
      var post = [];
      for (var card = 1; card < 13; card++) {
          var num = 0;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
              for (var _iterator = FORTE[card][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var sc = _step.value;

                  if (sc === undefined) {
                      num += 1;
                      continue; // first, used for spacing
                  }
                  // index 1 is vector
                  if (common.arrayEquals(sc[1], vector)) {
                      post.push(_chordTableAddress(card, num));
                  }
                  num += 1;
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
      }
      return post;
  }

  function addressToZAddress(address) {
      var _validateAddress8 = _validateAddress(address),
          _validateAddress9 = slicedToArray(_validateAddress8, 3),
          card = _validateAddress9[0],
          index = _validateAddress9[1],
          unused_inversion = _validateAddress9[2];

      var z = FORTE[card][index][3];
      if (z === 0) {
          return undefined;
      } else {
          var zReal = z;
          if (Array.isArray(z)) {
              zReal = z[0];
          }
          var zAddress = _validateAddress([card, zReal, undefined]);
          return _chordTableAddress(zAddress[0], zAddress[1], zAddress[2]);
      }
  }

  function addressToCommonNames(address) {
      var addressNew = _validateAddress(address);
      var refDict = SCREF[String(addressNew)];
      return refDict.name;
  }

  function addressToForteName(address) {
      var classification = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'tn';

      var _validateAddress10 = _validateAddress(address),
          _validateAddress11 = slicedToArray(_validateAddress10, 3),
          card = _validateAddress11[0],
          index = _validateAddress11[1],
          inversion = _validateAddress11[2];

      var iStr = void 0;
      if (classification.toLowerCase() === 'tn') {
          if (inversion === -1) {
              iStr = 'B';
          } else if (inversion === 1) {
              iStr = 'A';
          } else if (inversion === 0) {
              iStr = '';
          }
      } else {
          // tni, ignore inversion
          iStr = '';
      }
      return card + '-' + index + iStr;
  }

  function seekChordTablesAddress(c) {
      var pcSet = c.orderedPitchClasses;
      if (!pcSet.length) {
          throw new Error('cannot access chord tables address for Chord with no pitches');
      }
      var card = pcSet.length;
      if (card === 1) {
          // its a singleton: return
          return _chordTableAddress(1, 1, 0, pcSet[0]);
      } else if (card === 12) {
          // its the aggregate
          return _chordTableAddress(12, 1, 0, 0);
      }
      // go through each rotation of pcSet
      var candidates = [];
      for (var rot = 0; rot < card; rot++) {
          var testSetOrig = pcSet.slice(rot);
          for (var rotRemainder = 0; rotRemainder < rot; rotRemainder++) {
              testSetOrig.push(pcSet[rotRemainder]);
          }
          // transpose to lead with zero
          var testSetOriginalPC = testSetOrig[0];
          var testSet = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
              for (var _iterator2 = testSetOrig[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var x = _step2.value;

                  var zeroTransposed = posMod(x - testSetOriginalPC, 12);
                  testSet.push(zeroTransposed);
              }
              // create inversion; first take difference from 12 mod 12
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

          var testSetInvert = [];
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
              for (var _iterator3 = testSet[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var _x2 = _step3.value;

                  testSetInvert.push(posMod(12 - _x2, 12));
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

          testSetInvert.reverse(); // reverse order (first steps now last)
          // transpose all steps (were last) to zero, mod 12
          var testSetInvertOriginalPC = testSetInvert[0];
          for (var i = 0; i < testSetInvert.length; i++) {
              testSetInvert[i] = posMod(testSetInvert[i] + (12 - testSetInvertOriginalPC), 12);
          }
          var candidateTuple = [testSet, testSetInvert, testSetOriginalPC];
          candidates.push(candidateTuple);
      }
      // compare sets to those in table
      var match = false;
      var matchedPCOriginal = void 0;
      var index = void 0;
      var inversion = void 0;

      for (var indexCandidate = 0; indexCandidate < FORTE[card].length; indexCandidate++) {
          var dataLine = FORTE[card][indexCandidate];
          if (dataLine === undefined) {
              continue; // spacer lines
          }
          var dataLinePcs = dataLine[0];
          var inversionsAvailable = forteIndexToInversionsAvailable(card, indexCandidate);
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
              for (var _iterator4 = candidates[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var _step4$value = slicedToArray(_step4.value, 3),
                      candidate = _step4$value[0],
                      candidateInversion = _step4$value[1],
                      candidateOriginalPC = _step4$value[2];

                  if (common.arrayEquals(dataLinePcs, candidate)) {
                      index = indexCandidate;
                      if (inversionsAvailable.includes(0)) {
                          inversion = 0;
                      } else {
                          inversion = 1;
                      }
                      matchedPCOriginal = candidateOriginalPC;
                      match = true;
                      break;
                  } else if (common.arrayEquals(dataLinePcs, candidateInversion)) {
                      index = indexCandidate;
                      if (inversionsAvailable.includes(0)) {
                          inversion = 0;
                      } else {
                          inversion = -1;
                      }
                      matchedPCOriginal = candidateOriginalPC;
                      match = true;
                      break;
                  }
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
      }
      if (!match) {
          throw new Error('cannot find a chord table address for ' + pcSet);
      }
      return _chordTableAddress(card, index, inversion, matchedPCOriginal);
  }



  var chordTables = Object.freeze({
      FORTE: FORTE,
      SCDICT: SCDICT,
      TNMAX: TNMAX,
      TNIMAX: TNIMAX,
      TNREF: TNREF,
      SCREF: SCREF,
      forteIndexToInversionsAvailable: forteIndexToInversionsAvailable,
      addressToTransposedNormalForm: addressToTransposedNormalForm,
      addressToPrimeForm: addressToPrimeForm,
      addressToIntervalVector: addressToIntervalVector,
      intervalVectorToAddress: intervalVectorToAddress,
      addressToZAddress: addressToZAddress,
      addressToCommonNames: addressToCommonNames,
      addressToForteName: addressToForteName,
      seekChordTablesAddress: seekChordTablesAddress
  });

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
          } else if (typeof notes === 'string') {
              notes = notes.split(/\s+/);
          }
          _this.isChord = true; // for speed
          _this.isNote = false; // for speed
          _this.isRest = false; // for speed

          _this._overrides = {};
          _this._cache = {};

          _this._notes = [];
          _this._chordTablesAddress = undefined;
          _this._chordTablesAddressNeedsUpdating = true; // only update when needed

          notes.forEach(_this.add, _this, false);
          _this.sortPitches();
          return _this;
      }

      createClass(Chord, [{
          key: 'areZRelations',
          value: function areZRelations(other) {
              var zRelationAddress = addressToZAddress(this.chordTablesAddress);
              if (zRelationAddress === undefined) {
                  return false;
              }
              var _arr = ['cardinality', 'forteClass', 'inversion'];
              for (var _i = 0; _i < _arr.length; _i++) {
                  var key = _arr[_i];
                  if (other.chordTablesAddress[key] !== zRelationAddress[key]) {
                      return false;
                  }
              }
              return true;
          }
      }, {
          key: 'getZRelation',
          value: function getZRelation() {
              if (!this.hasZRelation) {
                  return undefined;
              }
              var chordTablesAddress = this.chordTablesAddress;
              var v = addressToIntervalVector(chordTablesAddress);
              var addresses = intervalVectorToAddress(v);
              var other = void 0;
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = addresses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var thisAddress = _step.value;

                      if (thisAddress.forteClass !== chordTablesAddress.forteClass) {
                          other = thisAddress;
                      }
                  }
                  // other should always be defined;
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

              var prime = addressToTransposedNormalForm(other);
              return new Chord(prime);
          }
      }, {
          key: 'setStemDirectionFromClef',


          //    get intervalVectorString() {
          //        
          //    }
          //    
          //    static formatVectorString() {
          //        // needs pitch._convertPitchClassToStr
          //    }

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
           * @memberof music21.chord.Chord
           * @param {string|music21.note.Note|music21.pitch.Pitch} notes - the Note or Pitch to be added or a string defining a pitch.
           * @param {boolean} runSort - Sort after running (default true)
           * @returns {music21.chord.Chord} the original chord.
           */

      }, {
          key: 'add',
          value: function add(notes) {
              var runSort = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

              if (!(notes instanceof Array)) {
                  notes = [notes];
              }
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = notes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var noteObj = _step2.value;

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
                  }
                  // inefficient because sorts after each add, but safe and #(p) is small
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

              if (runSort === true) {
                  this.sortPitches();
              }
              this._cache = {};
              return this;
          }
      }, {
          key: 'sortPitches',
          value: function sortPitches() {
              this._notes.sort(function (a, b) {
                  return a.pitch.ps - b.pitch.ps;
              });
          }

          // TODO: add remove

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
          value: function root(newroot) {
              if (newroot !== undefined) {
                  this._overrides.root = newroot;
                  this._cache.root = newroot;
                  this._cache.inversion = undefined;
              }

              if (this._overrides.root !== undefined) {
                  return this._cache.root;
              }

              if (this._cache.root !== undefined) {
                  return this._cache.root;
              }

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
              var newRoot = closedChord.pitches[0]; // fallback, just return the bass...
              this._cache.root = newRoot;
              return newRoot;
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
          *
          * @memberof music21.chord.Chord
          * @returns {Boolean}
          */

      }, {
          key: 'isDiminishedTriad',
          value: function isDiminishedTriad() {
              if (this.cardinality() !== 3) {
                  return false;
              }
              var thirdST = this.semitonesFromChordStep(3);
              var fifthST = this.semitonesFromChordStep(5);
              if (thirdST === 3 && fifthST === 6) {
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
          key: 'isAugmentedTriad',
          value: function isAugmentedTriad() {
              if (this.cardinality() !== 3) {
                  return false;
              }
              var thirdST = this.semitonesFromChordStep(3);
              var fifthST = this.semitonesFromChordStep(5);
              if (thirdST === 4 && fifthST === 8) {
                  return true;
              } else {
                  return false;
              }
          }
      }, {
          key: 'isDominantSeventh',
          value: function isDominantSeventh() {
              return this.isSeventhOfType([0, 4, 7, 10]);
          }
      }, {
          key: 'isDiminishedSeventh',
          value: function isDiminishedSeventh() {
              return this.isSeventhOfType([0, 3, 6, 9]);
          }
      }, {
          key: 'isSeventhOfType',
          value: function isSeventhOfType(intervalArray) {
              if (intervalArray === undefined) {
                  throw new Music21Exception('intervalArray is required');
              }
              var third = this.third;
              var fifth = this.fifth;
              var seventh = this.seventh;

              if (third === undefined || fifth === undefined || seventh === undefined) {
                  return false;
              }

              var root = this.root();

              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                  for (var _iterator3 = this.pitches[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var thisPitch = _step3.value;

                      var thisInterval = new interval.Interval(root, thisPitch);
                      if (!intervalArray.includes(thisInterval.chromatic.mod12)) {
                          return false;
                      }
                      //            // check if it doesn't have any other pitches, such as C E F- G Bb != Dominant Seventh
                      //            if (!ignoreSpelling && !chordalNames.includes(thisPitch.name)) {
                      //                return false;
                      //            }
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

              return true;
          }

          /**
           * canBeDominantV - Returns true if the chord is a Major Triad or a Dominant Seventh
           *
           * @return {Boolean}
           */

      }, {
          key: 'canBeDominantV',
          value: function canBeDominantV() {
              if (this.isMajorTriad() || this.isDominantSeventh()) {
                  return true;
              } else {
                  return false;
              }
          }

          /**
           * Returns true if the chord is a major or minor triad
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
                  duration: this.duration.vexflowDuration
              });
              this.vexflowAccidentalsAndDisplay(vfn, options); // clean up stuff...
              for (var _i2 = 0; _i2 < this._notes.length; _i2++) {
                  var tn = this._notes[_i2];
                  if (tn.pitch.accidental !== undefined) {
                      if (tn.pitch.accidental.vexflowModifier !== 'n' && tn.pitch.accidental.displayStatus !== false) {
                          vfn.addAccidental(_i2, new Vex.Flow.Accidental(tn.pitch.accidental.vexflowModifier));
                      } else if (tn.pitch.accidental.displayType === 'always' || tn.pitch.accidental.displayStatus === true) {
                          vfn.addAccidental(_i2, new Vex.Flow.Accidental(tn.pitch.accidental.vexflowModifier));
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
              this._cache = {};
              this._overrides = {};
          }
      }, {
          key: 'orderedPitchClasses',
          get: function get() {
              var pcGroup = [];
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                  for (var _iterator4 = this.pitches[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var p = _step4.value;

                      if (pcGroup.includes(p.pitchClass)) {
                          continue;
                      }
                      pcGroup.push(p.pitchClass);
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

              pcGroup.sort(function (a, b) {
                  return a - b;
              });
              return pcGroup;
          }
      }, {
          key: 'chordTablesAddress',
          get: function get() {
              if (this._chordTablesAddressNeedsUpdating) {
                  this._chordTablesAddress = seekChordTablesAddress(this);
              }
              this._chordTablesAddressNeedsUpdating = false;
              return this._chordTablesAddress;
          }
      }, {
          key: 'commonName',
          get: function get() {
              var _this2 = this;

              // TODO: many more exemptions from music21p
              var cta = this.chordTablesAddress;
              var ctn = addressToCommonNames(cta);
              var forteClass = this.forteClass;
              var enharmonicTests = {
                  '3-11A': function A() {
                      return _this2.isMinorTriad();
                  },
                  '3-11B': function B() {
                      return _this2.isMajorTriad();
                  },
                  '3-10': function _() {
                      return _this2.isDiminishedTriad();
                  },
                  '3-12': function _() {
                      return _this2.isAugmentedTriad();
                  }
              };
              if (enharmonicTests[forteClass] !== undefined) {
                  var out = ctn[0];
                  var test = enharmonicTests[forteClass];
                  if (!test()) {
                      out = 'enharmonic equivalent to ' + out;
                  }
                  return out;
              }

              if (ctn === undefined) {
                  return '';
              } else {
                  return ctn[0];
              }
          }
      }, {
          key: 'forteClass',
          get: function get() {
              return addressToForteName(this.chordTablesAddress, 'tn');
          }
      }, {
          key: 'forteClassNumber',
          get: function get() {
              return this.chordTablesAddress.forteClass;
          }
      }, {
          key: 'forteClassTnI',
          get: function get() {
              return addressToForteName(this.chordTablesAddress, 'tni');
          }
      }, {
          key: 'hasZRelation',
          get: function get() {
              var post = addressToZAddress(this.chordTablesAddress);
              if (post !== undefined) {
                  return true;
              } else {
                  return false;
              }
          }
      }, {
          key: 'intervalVector',
          get: function get() {
              return addressToIntervalVector(this.chordTablesAddress);
          }
      }, {
          key: 'third',
          get: function get() {
              return this.getChordStep(3);
          }
      }, {
          key: 'fifth',
          get: function get() {
              return this.getChordStep(5);
          }
      }, {
          key: 'seventh',
          get: function get() {
              return this.getChordStep(7);
          }
      }]);
      return Chord;
  }(note.NotRest);
  chord.Chord = Chord;

  chord.chordDefinitions = {
      major: ['M3', 'm3'],
      minor: ['m3', 'M3'],
      diminished: ['m3', 'm3'],
      augmented: ['M3', 'M3'],
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
      treble: 31,
      soprano: 29,
      'mezzo-soprano': 27,
      alto: 25,
      tenor: 23,
      bass: 19,
      percussion: 31
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
          return possibleConstructorReturn(this, (TrebleClef.__proto__ || Object.getPrototypeOf(TrebleClef)).call(this, 'treble'));
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
          return possibleConstructorReturn(this, (Treble8vbClef.__proto__ || Object.getPrototypeOf(Treble8vbClef)).call(this, 'treble', -1));
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
          return possibleConstructorReturn(this, (Treble8vaClef.__proto__ || Object.getPrototypeOf(Treble8vaClef)).call(this, 'treble', 1));
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
          return possibleConstructorReturn(this, (BassClef.__proto__ || Object.getPrototypeOf(BassClef)).call(this, 'bass'));
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
          return possibleConstructorReturn(this, (AltoClef.__proto__ || Object.getPrototypeOf(AltoClef)).call(this, 'alto'));
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
          return possibleConstructorReturn(this, (TenorClef.__proto__ || Object.getPrototypeOf(TenorClef)).call(this, 'tenor'));
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
          return possibleConstructorReturn(this, (SopranoClef.__proto__ || Object.getPrototypeOf(SopranoClef)).call(this, 'soprano'));
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
          return possibleConstructorReturn(this, (MezzoSopranoClef.__proto__ || Object.getPrototypeOf(MezzoSopranoClef)).call(this, 'mezzo-soprano'));
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
          return possibleConstructorReturn(this, (PercussionClef.__proto__ || Object.getPrototypeOf(PercussionClef)).call(this, 'percussion'));
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
      ppp: ['pianississimo'],
      pp: ['pianissimo'],
      p: ['piano'],
      mp: ['mezzopiano'],
      mf: ['mezzoforte'],
      f: ['forte'],
      fp: ['fortepiano'],
      sf: ['sforzando'],
      ff: ['fortissimo'],
      fff: ['fortississimo']
  };
  dynamics.englishNames = {
      ppp: ['extremely soft'],
      pp: ['very soft'],
      p: ['soft'],
      mp: ['moderately soft'],
      mf: ['moderately loud'],
      f: ['loud'],
      ff: ['very loud'],
      fff: ['extremely loud']
  };
  dynamics.dynamicStrToScalar = {
      None: [0.5], // default value
      n: [0.0],
      pppp: [0.1],
      ppp: [0.15],
      pp: [0.25],
      p: [0.35],
      mp: [0.45],
      mf: [0.55],
      f: [0.7],
      fp: [0.75],
      sf: [0.85],
      ff: [0.85],
      fff: [0.9],
      ffff: [0.95]
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

          _this2.name = 'fermata';
          _this2.vexflowModifier = 'a@a';
          _this2.setPosition = 3;
          return _this2;
      }

      return Fermata;
  }(Expression);
  expressions.Fermata = Fermata;

  var shorthandNotation = {
      '': [5, 3],
      '5': [5, 3],
      '6': [6, 3],
      '7': [7, 5, 3],
      '9': [9, 7, 5, 3],
      '11': [11, 9, 7, 5, 3],
      '13': [13, 11, 9, 7, 5, 3],
      '6,5': [6, 5, 3],
      '4,3': [6, 4, 3],
      '4,2': [6, 4, 2],
      '2': [6, 4, 2]
  };
  /**
   * In music21p is in figuredBass.notation -- eventually to be moved there.
   */

  var Notation = function () {
      function Notation(notationColumn) {
          classCallCheck(this, Notation);

          if (notationColumn === undefined) {
              notationColumn = '';
          }
          this.notationColumn = notationColumn;
          this.figureStrings = undefined;
          this.origNumbers = undefined;
          this.origModStrings = undefined;
          this.numbers = undefined;
          this.modifierStrings = undefined;
          this._parseNotationColumn();
          this._translateToLonghand();

          this.modifiers = undefined;
          this.figures = undefined;
          this._getModifiers();
          this._getFigures();
      }

      /**
       * _parseNotationColumn - Given a notation column below a pitch, defines both this.numbers
       *    and this.modifierStrings, which provide the intervals above the
       *    bass and (if necessary) how to modify the corresponding pitches
       *    accordingly.
       *
       * @return {undefined}
       */

      createClass(Notation, [{
          key: '_parseNotationColumn',
          value: function _parseNotationColumn() {
              var nc = this.notationColumn;
              var figures = nc.split(/,/);
              var numbers = [];
              var modifierStrings = [];
              var figureStrings = [];

              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = figures[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var figure = _step.value;

                      figure = figure.trim();
                      figureStrings.push(figure);
                      var numberString = '';
                      var modifierString = '';
                      var _iteratorNormalCompletion2 = true;
                      var _didIteratorError2 = false;
                      var _iteratorError2 = undefined;

                      try {
                          for (var _iterator2 = figure[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                              var c = _step2.value;

                              if (c.match(/\d/)) {
                                  numberString += c;
                              } else {
                                  modifierString += c;
                              }
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

                      var number = void 0;
                      if (numberString !== '') {
                          number = parseInt(numberString);
                      }
                      numbers.push(number);
                      if (modifierString === '') {
                          modifierString = undefined;
                      }
                      modifierStrings.push(modifierString);
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

              this.origNumbers = numbers;
              this.numbers = numbers;
              this.modifierStrings = modifierStrings;
              this.figureStrings = figureStrings;
          }
      }, {
          key: '_translateToLonghand',
          value: function _translateToLonghand() {
              var oldNumbers = this.numbers;
              var newNumbers = oldNumbers;
              var oldModifierStrings = this.modifierStrings;
              var newModifierStrings = oldModifierStrings;
              var oldNumbersString = oldNumbers.toString();

              if (shorthandNotation[oldNumbersString] !== undefined) {
                  newNumbers = shorthandNotation[oldNumbersString];
                  newModifierStrings = [];
                  var temp = [];
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                      for (var _iterator3 = oldNumbers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                          var number = _step3.value;

                          if (number === undefined) {
                              temp.push(3);
                          } else {
                              temp.push(number);
                          }
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

                  oldNumbers = temp;

                  var _iteratorNormalCompletion4 = true;
                  var _didIteratorError4 = false;
                  var _iteratorError4 = undefined;

                  try {
                      for (var _iterator4 = newNumbers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                          var _number = _step4.value;

                          var newModifierString = void 0;
                          if (oldNumbers.includes(_number)) {
                              var modifierStringIndex = oldNumbers.indexOf(_number);
                              newModifierString = oldModifierStrings[modifierStringIndex];
                          }
                          newModifierStrings.push(newModifierString);
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
              } else {
                  var _temp = [];
                  var _iteratorNormalCompletion5 = true;
                  var _didIteratorError5 = false;
                  var _iteratorError5 = undefined;

                  try {
                      for (var _iterator5 = oldNumbers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                          var _number2 = _step5.value;

                          if (_number2 === undefined) {
                              _temp.push(3);
                          } else {
                              _temp.push(_number2);
                          }
                      }
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

                  newNumbers = _temp;
              }
              this.numbers = newNumbers;
              this.modifierStrings = newModifierStrings;
          }
      }, {
          key: '_getModifiers',
          value: function _getModifiers() {
              var modifiers = [];
              for (var i = 0; i < this.numbers.length; i++) {
                  var modifierString = this.modifierStrings[i];
                  var modifier = new Modifier(modifierString);
                  modifiers.push(modifier);
              }
              this.modifiers = modifiers;
          }
      }, {
          key: '_getFigures',
          value: function _getFigures() {
              var figures = [];
              for (var i = 0; i < this.numbers.length; i++) {
                  var number = this.numbers[i];
                  var modifierString = this.modifierStrings[i];
                  var figure = new Figure(number, modifierString);
                  figures.push(figure);
              }
              this.figures = figures;
          }
      }]);
      return Notation;
  }();

  var Figure = function Figure(number, modifierString) {
      classCallCheck(this, Figure);

      this.number = number;
      this.modifierString = modifierString;
      this.modifier = new Modifier(modifierString);
  };

  var specialModifiers = {
      '+': '#',
      '/': '-',
      '\\': '#',
      b: '-',
      bb: '--',
      bbb: '---',
      bbbb: '-----',
      '++': '##',
      '+++': '###',
      '++++': '####'
  };

  var Modifier = function () {
      function Modifier(modifierString) {
          classCallCheck(this, Modifier);

          this.modifierString = modifierString;
          this.accidental = this._toAccidental();
      }

      createClass(Modifier, [{
          key: '_toAccidental',
          value: function _toAccidental() {
              var modStr = this.modifierString;
              if (modStr === undefined || modStr === '') {
                  return undefined;
              }
              var a = new pitch.Accidental();
              if (specialModifiers[modStr] !== undefined) {
                  modStr = specialModifiers[modStr];
              }
              a.set(modStr);
              return a;
          }
      }, {
          key: 'modifyPitchName',
          value: function modifyPitchName(pitchNameToAlter) {
              var pitchToAlter = new pitch.Pitch(pitchNameToAlter);
              this.modifyPitch(pitchToAlter, true);
              return pitchToAlter.name;
          }
      }, {
          key: 'modifyPitch',
          value: function modifyPitch(pitchToAlter, inPlace) {
              if (inPlace !== true) {
                  pitchToAlter = pitchToAlter.clone();
              }

              if (this.accidental === undefined) {
                  return pitchToAlter;
              }

              if (this.accidental.alter === 0.0 || pitchToAlter.accidental === undefined) {
                  pitchToAlter.accidental = this.accidental.clone();
              } else {
                  var newAccidental = new pitch.Accidental();
                  var newAlter = pitchToAlter.accidental.alter + this.accidental.alter;
                  newAccidental.set(newAlter);
                  pitchToAlter.accidental = newAccidental;
              }
              return pitchToAlter;
          }
      }]);
      return Modifier;
  }();

  var figuredBass = {
      Notation: Notation,
      Figure: Figure,
      Modifier: Modifier
  };

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
   * music21/scale -- Scales
   *
   * Does not implement the full range of scales from music21p
   *
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
   *
   */
  // const DIRECTION_BI = 'bi';
  // const DIRECTION_DESCENDING = 'descending';
  // const DIRECTION_ASCENDING = 'ascending';

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
   * @requires music21/base
   * @requires music21/common
   * @requires music21/debug
   * @requires music21/interval
   * @requires music21/pitch
   */
  var Scale = function (_base$Music21Object) {
      inherits(Scale, _base$Music21Object);

      function Scale() {
          classCallCheck(this, Scale);

          var _this = possibleConstructorReturn(this, (Scale.__proto__ || Object.getPrototypeOf(Scale)).call(this));

          _this.type = 'Scale';
          return _this;
      }

      createClass(Scale, [{
          key: 'name',
          get: function get() {
              return this.type;
          }
      }, {
          key: 'isConcrete',
          get: function get() {
              return false;
          }
      }]);
      return Scale;
  }(base.Music21Object);

  var AbstractScale = function (_Scale) {
      inherits(AbstractScale, _Scale);

      function AbstractScale() {
          classCallCheck(this, AbstractScale);

          var _this2 = possibleConstructorReturn(this, (AbstractScale.__proto__ || Object.getPrototypeOf(AbstractScale)).call(this));

          _this2._net = []; // simplified -- no IntervalNetwork, just list of intervals
          _this2.tonicDegree = 1;
          _this2.octaveDuplicating = true;
          _this2.deterministic = true;
          _this2._alteredDegrees = {};
          _this2._oneOctaveRealizationCache = undefined;
          return _this2;
      }

      createClass(AbstractScale, [{
          key: 'equals',
          value: function equals(other) {
              if (common.arrayEquals(this.classes, other.classes) && this.tonicDegree === other.tonicDegree && common.arrayEquals(this._net, other._net)) {
                  return true;
              } else {
                  return false;
              }
          }
      }, {
          key: 'buildNetworkFromPitches',
          value: function buildNetworkFromPitches(pitchList) {
              var pitchListReal = [];
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = pitchList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var _p = _step.value;

                      if (typeof _p === 'string') {
                          pitchListReal.push(new pitch.Pitch(_p));
                      } else if (_p.classes.includes('Note')) {
                          pitchListReal.push(_p.pitch);
                      } else {
                          pitchListReal.push(_p);
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

              pitchList = pitchListReal;

              var pLast = pitchList[pitchList.length - 1];
              if (pLast.name === pitchList[0]) {
                  var p = pitchList[0].clone();
                  if (pLast.ps > pitchList[0]) {
                      // ascending;
                      while (p.ps < pLast.ps) {
                          p.octave += 1;
                      }
                  } else {
                      while (p.ps < pLast.ps) {
                          p.octave += -1;
                      }
                  }
                  pitchList.push(p);
              }

              var intervalList = [];
              for (var i = 0; i < pitchList.length - 1; i++) {
                  var thisInterval = new interval.Interval(pitchList[i], pitchList[i + 1]);
                  intervalList.push(thisInterval);
              }
              this._net = intervalList;
          }
      }, {
          key: 'getDegreeMaxUnique',
          value: function getDegreeMaxUnique() {
              return this._net.length;
          }
      }, {
          key: 'getRealization',
          value: function getRealization(pitchObj, unused_stepOfPitch, unused_minPitch, unused_maxPitch, unused_direction, unused_reverse) {
              // if (direction === undefined) {
              //     direction = DIRECTION_ASCENDING;
              // }
              // if (stepOfPitch === undefined) {
              //     stepOfPitch = 1;
              // }
              if (typeof pitchObj === 'string') {
                  pitchObj = new pitch.Pitch(pitchObj);
              } else {
                  pitchObj = pitchObj.clone();
              }
              var post = [pitchObj];
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = this._net[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var intV = _step2.value;

                      pitchObj = intV.transposePitch(pitchObj);
                      post.push(pitchObj);
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

              return post;
          }
      }, {
          key: 'getPitchFromNodeDegree',
          value: function getPitchFromNodeDegree(pitchReference, unused_nodeName, nodeDegreeTarget) {
              var zeroIndexDegree = nodeDegreeTarget - 1;
              for (var i = 0; i < zeroIndexDegree; i++) {
                  var thisIntv = this._net[i % this._net.length];
                  pitchReference = thisIntv.transposePitch(pitchReference);
              }
              return pitchReference;
          }
      }, {
          key: 'getRelativeNodeDegree',
          value: function getRelativeNodeDegree(pitchReference, unused_nodeName, pitchTarget, unused_comparisonAttribute, unused_direction) {
              if (typeof pitchTarget === 'string') {
                  pitchTarget = new pitch.Pitch(pitchTarget);
              }
              var realizedPitches = void 0;
              if (this._oneOctaveRealizationCache !== undefined) {
                  realizedPitches = this._oneOctaveRealizationCache;
              } else {
                  realizedPitches = this.getRealization(pitchReference);
                  this._oneOctaveRealizationCache = realizedPitches;
              }
              var realizedNames = [];
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                  for (var _iterator3 = realizedPitches[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var p = _step3.value;

                      realizedNames.push(p.name);
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

              var realizedIndex = realizedNames.indexOf(pitchTarget.name);
              if (realizedIndex === -1) {
                  return undefined;
              } else {
                  return realizedIndex + 1;
              }
          }
      }]);
      return AbstractScale;
  }(Scale);

  var AbstractDiatonicScale = function (_AbstractScale) {
      inherits(AbstractDiatonicScale, _AbstractScale);

      function AbstractDiatonicScale(mode) {
          classCallCheck(this, AbstractDiatonicScale);

          var _this3 = possibleConstructorReturn(this, (AbstractDiatonicScale.__proto__ || Object.getPrototypeOf(AbstractDiatonicScale)).call(this));

          _this3.type = 'Abstract diatonic';
          _this3.tonicDegree = undefined;
          _this3.dominantDegree = undefined;
          _this3.octaveDuplicating = true;
          _this3._buildNetwork(mode);
          return _this3;
      }

      createClass(AbstractDiatonicScale, [{
          key: '_buildNetwork',
          value: function _buildNetwork(mode) {
              var srcList = ['M2', 'M2', 'm2', 'M2', 'M2', 'M2', 'm2'];
              var intervalList = void 0;
              this.tonicDegree = 1;
              this.dominantDegree = 5;
              if (['major', 'ionian', undefined].includes(mode)) {
                  intervalList = srcList;
                  this.relativeMajorDegree = 1;
                  this.relativeMinorDegree = 6;
              } else if (['minor', 'aeolian'].includes(mode)) {
                  var _intervalList;

                  intervalList = srcList.slice(5, 7);
                  (_intervalList = intervalList).push.apply(_intervalList, toConsumableArray(srcList.slice(0, 5)));
                  this.relativeMajorDegree = 3;
                  this.relativeMinorDegree = 1;
              }
              this._net = [];
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                  for (var _iterator4 = intervalList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var intVStr = _step4.value;

                      this._net.push(new interval.Interval(intVStr));
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
          }
      }]);
      return AbstractDiatonicScale;
  }(AbstractScale);

  var AbstractHarmonicMinorScale = function (_AbstractScale2) {
      inherits(AbstractHarmonicMinorScale, _AbstractScale2);

      function AbstractHarmonicMinorScale() {
          classCallCheck(this, AbstractHarmonicMinorScale);

          var _this4 = possibleConstructorReturn(this, (AbstractHarmonicMinorScale.__proto__ || Object.getPrototypeOf(AbstractHarmonicMinorScale)).call(this));

          _this4.type = 'Abstract harmonic minor';
          _this4.octaveDuplicating = true;
          _this4._buildNetwork();
          return _this4;
      }

      createClass(AbstractHarmonicMinorScale, [{
          key: '_buildNetwork',
          value: function _buildNetwork() {
              var intervalList = ['M2', 'm2', 'M2', 'M2', 'm2', 'A2', 'm2'];
              this._net = [];
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                  for (var _iterator5 = intervalList[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                      var intVStr = _step5.value;

                      this._net.push(new interval.Interval(intVStr));
                  }
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
      }]);
      return AbstractHarmonicMinorScale;
  }(AbstractScale);

  // temporary, until bidirectional scales are created
  // no need for descending, since minor takes care of that.
  var AbstractAscendingMelodicMinorScale = function (_AbstractScale3) {
      inherits(AbstractAscendingMelodicMinorScale, _AbstractScale3);

      function AbstractAscendingMelodicMinorScale() {
          classCallCheck(this, AbstractAscendingMelodicMinorScale);

          var _this5 = possibleConstructorReturn(this, (AbstractAscendingMelodicMinorScale.__proto__ || Object.getPrototypeOf(AbstractAscendingMelodicMinorScale)).call(this));

          _this5.type = 'Abstract ascending melodic minor';
          _this5.octaveDuplicating = true;
          _this5._buildNetwork();
          return _this5;
      }

      createClass(AbstractAscendingMelodicMinorScale, [{
          key: '_buildNetwork',
          value: function _buildNetwork() {
              var intervalList = ['M2', 'm2', 'M2', 'M2', 'M2', 'M2', 'm2'];
              this._net = [];
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                  for (var _iterator6 = intervalList[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                      var intVStr = _step6.value;

                      this._net.push(new interval.Interval(intVStr));
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
          }
      }]);
      return AbstractAscendingMelodicMinorScale;
  }(AbstractScale);

  var ConcreteScale = function (_Scale2) {
      inherits(ConcreteScale, _Scale2);

      function ConcreteScale(tonic) {
          classCallCheck(this, ConcreteScale);

          var _this6 = possibleConstructorReturn(this, (ConcreteScale.__proto__ || Object.getPrototypeOf(ConcreteScale)).call(this));

          if (typeof tonic === 'string') {
              tonic = new pitch.Pitch(tonic);
          }
          _this6.tonic = tonic;
          _this6.abstract = undefined;
          return _this6;
      }

      // when adding functionality here, must also be added to key.Key.


      createClass(ConcreteScale, [{
          key: 'getTonic',
          value: function getTonic() {
              return this.tonic;
          }

          // transpose
          // tune
          // No .romanNumeral function because of circular imports...
          // romanNumeral(degree) {
          //     return new roman.RomanNumeral(degree, this);
          // }

      }, {
          key: 'getPitches',
          value: function getPitches(unused_minPitch, unused_maxPitch, unused_direction) {
              var pitchObj = void 0;
              if (this.tonic === undefined) {
                  pitchObj = new pitch.Pitch('C4');
              } else {
                  pitchObj = this.tonic;
              }
              return this.abstract.getRealization(pitchObj);
          }
      }, {
          key: 'pitchFromDegree',
          value: function pitchFromDegree(degree, unused_minPitch, unused_maxPitch, unused_direction, unused_equateTermini) {
              return this.abstract.getPitchFromNodeDegree(this.tonic, this.abstract.tonicDegree, degree);
          }
      }, {
          key: 'getScaleDegreeFromPitch',
          value: function getScaleDegreeFromPitch(pitchTarget, unused_direction, unused_comparisonAttribute) {
              return this.abstract.getRelativeNodeDegree(this.tonic, this.abstract.tonicDegree, pitchTarget);
          }
      }, {
          key: 'isConcrete',
          get: function get() {
              if (this.tonic !== undefined) {
                  return true;
              } else {
                  return false;
              }
          }
      }]);
      return ConcreteScale;
  }(Scale);

  var DiatonicScale = function (_ConcreteScale) {
      inherits(DiatonicScale, _ConcreteScale);

      function DiatonicScale(tonic) {
          classCallCheck(this, DiatonicScale);

          // a.k.a. ^2 :-)
          var _this7 = possibleConstructorReturn(this, (DiatonicScale.__proto__ || Object.getPrototypeOf(DiatonicScale)).call(this, tonic));

          _this7.abstract = new AbstractDiatonicScale();
          _this7.type = 'diatonic';
          return _this7;
      }

      return DiatonicScale;
  }(ConcreteScale);

  var MajorScale = function (_DiatonicScale) {
      inherits(MajorScale, _DiatonicScale);

      function MajorScale(tonic) {
          classCallCheck(this, MajorScale);

          // a.k.a. ^2 :-)
          var _this8 = possibleConstructorReturn(this, (MajorScale.__proto__ || Object.getPrototypeOf(MajorScale)).call(this, tonic));

          _this8.type = 'major';
          _this8.abstract._buildNetwork(_this8.type);
          return _this8;
      }

      return MajorScale;
  }(DiatonicScale);

  var MinorScale = function (_DiatonicScale2) {
      inherits(MinorScale, _DiatonicScale2);

      function MinorScale(tonic) {
          classCallCheck(this, MinorScale);

          // a.k.a. ^2 :-)
          var _this9 = possibleConstructorReturn(this, (MinorScale.__proto__ || Object.getPrototypeOf(MinorScale)).call(this, tonic));

          _this9.type = 'minor';
          _this9.abstract._buildNetwork(_this9.type);
          return _this9;
      }

      return MinorScale;
  }(DiatonicScale);

  var HarmonicMinorScale = function (_ConcreteScale2) {
      inherits(HarmonicMinorScale, _ConcreteScale2);

      function HarmonicMinorScale(tonic) {
          classCallCheck(this, HarmonicMinorScale);

          // a.k.a. ^2 :-)
          var _this10 = possibleConstructorReturn(this, (HarmonicMinorScale.__proto__ || Object.getPrototypeOf(HarmonicMinorScale)).call(this, tonic));

          _this10.type = 'harmonic minor';
          _this10.abstract = new AbstractHarmonicMinorScale();
          return _this10;
      }

      return HarmonicMinorScale;
  }(ConcreteScale);

  var AscendingMelodicMinorScale = function (_ConcreteScale3) {
      inherits(AscendingMelodicMinorScale, _ConcreteScale3);

      function AscendingMelodicMinorScale(tonic) {
          classCallCheck(this, AscendingMelodicMinorScale);

          // a.k.a. ^2 :-)
          var _this11 = possibleConstructorReturn(this, (AscendingMelodicMinorScale.__proto__ || Object.getPrototypeOf(AscendingMelodicMinorScale)).call(this, tonic));

          _this11.type = 'harmonic minor';
          _this11.abstract = new AbstractAscendingMelodicMinorScale();
          return _this11;
      }

      return AscendingMelodicMinorScale;
  }(ConcreteScale);

  /**
   * Function, not class
   *
   * @function music21.scale.SimpleDiatonicScale
   * @param {music21.pitch.Pitch} tonic
   * @param {Array<string>} scaleSteps - an array of diatonic prefixes,
   *     generally 'M' (major) or 'm' (minor) describing the seconds.
   * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
   */
  function SimpleDiatonicScale(tonic, scaleSteps) {
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
  }

  /**
   * One octave of a major scale
   *
   * @function music21.scale.ScaleSimpleMajor
   * @param {music21.pitch.Pitch} tonic
   * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
   */
  function ScaleSimpleMajor(tonic) {
      var scaleSteps = ['M', 'M', 'm', 'M', 'M', 'M', 'm'];
      return SimpleDiatonicScale(tonic, scaleSteps);
  }

  /**
   * One octave of a minor scale
   *
   * @function music21.scale.ScaleSimpleMinor
   * @param {music21.pitch.Pitch} tonic
   * @param {string} [minorType='natural'] - 'harmonic', 'harmonic-minor',
   *     'melodic', 'melodic-minor', 'melodic-minor-ascending',
   *     'melodic-ascending' or other (=natural/melodic-descending)
   * @returns {Array<music21.pitch.Pitch>} an octave of scale objects.
   */
  function ScaleSimpleMinor(tonic, minorType) {
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
      return SimpleDiatonicScale(tonic, scaleSteps);
  }

  var scale = {
      Scale: Scale,
      AbstractScale: AbstractScale,
      AbstractDiatonicScale: AbstractDiatonicScale,
      AbstractHarmonicMinorScale: AbstractHarmonicMinorScale,
      AbstractAscendingMelodicMinorScale: AbstractAscendingMelodicMinorScale,
      ConcreteScale: ConcreteScale,
      DiatonicScale: DiatonicScale,
      MajorScale: MajorScale,
      MinorScale: MinorScale,
      HarmonicMinorScale: HarmonicMinorScale,
      AscendingMelodicMinorScale: AscendingMelodicMinorScale,

      ScaleSimpleMinor: ScaleSimpleMinor,
      ScaleSimpleMajor: ScaleSimpleMajor,
      SimpleDiatonicScale: SimpleDiatonicScale
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/key -- KeySignature and Key objects
   *
   * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
   *
   */
  // import { common } from './common.js';
  /* key and keysignature module. See {@link music21.key} namespace for details
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
      major: 0,
      minor: -3,
      dorian: -2,
      phrygian: -4,
      lydian: 1,
      mixolydian: -1,
      locrian: -5
  };

  key.convertKeyStringToMusic21KeyString = function convertKeyStringToMusic21KeyString(textString) {
      if (textString === 'bb') {
          textString = 'b-';
      } else if (textString === 'Bb') {
          textString = 'B-';
      } else if (textString.endsWith('b') && !textString.startsWith('b')) {
          textString = textString.replace(/b$/, '-');
      }
      return textString;
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
   * s.appendNewDOM();
   */
  var KeySignature = function (_base$Music21Object) {
      inherits(KeySignature, _base$Music21Object);

      function KeySignature(sharps) {
          classCallCheck(this, KeySignature);

          var _this = possibleConstructorReturn(this, (KeySignature.__proto__ || Object.getPrototypeOf(KeySignature)).call(this));

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
   * TODO: Scale mixin.
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

          _this2.tonic = new pitch.Pitch(keyName);
          _this2.mode = mode;
          _this2._scale = _this2.getScale();
          return _this2;
      }
      /**
       * returns a {@link music21.scale.MajorScale} or {@link music21.scale.MinorScale}
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
              var pitchObj = this.tonic;
              if (scaleType === 'major') {
                  return new scale.MajorScale(pitchObj);
              } else if (scaleType === 'minor') {
                  return new scale.MinorScale(pitchObj);
              } else if (['harmonic minor', 'harmonic-minor'].includes(scaleType)) {
                  return new scale.HarmonicMinorScale(pitchObj);
              } else if (['melodic minor', 'melodic-minor'].includes(scaleType)) {
                  return new scale.AscendingMelodicMinorScale(pitchObj);
              } else {
                  return new scale.ConcreteScale(pitchObj);
              }
          }

          // when scale.js adds functionality, it must be added here.

      }, {
          key: 'getPitches',
          value: function getPitches() {
              var _scale;

              return (_scale = this._scale).getPitches.apply(_scale, arguments);
          }
      }, {
          key: 'pitchFromDegree',
          value: function pitchFromDegree() {
              var _scale2;

              return (_scale2 = this._scale).pitchFromDegree.apply(_scale2, arguments);
          }
      }, {
          key: 'getScaleDegreeFromPitch',
          value: function getScaleDegreeFromPitch() {
              var _scale3;

              return (_scale3 = this._scale).getScaleDegreeFromPitch.apply(_scale3, arguments);
          }
      }, {
          key: 'isConcrete',
          get: function get() {
              return this._scale.isConcrete;
          }
      }]);
      return Key;
  }(KeySignature);
  key.Key = Key;

  var Harmony = function (_chord$Chord) {
      inherits(Harmony, _chord$Chord);

      function Harmony(figure, keywords) {
          classCallCheck(this, Harmony);

          if (keywords === undefined) {
              keywords = {};
          }

          var _this = possibleConstructorReturn(this, (Harmony.__proto__ || Object.getPrototypeOf(Harmony)).call(this));

          _this._writeAsChord = false;
          _this._roman = undefined;
          _this.chordStepModifications = [];
          _this._degreesList = [];
          _this._key = undefined;
          // this._updateBasedOnXMLInput(keywords);
          _this._figure = figure;
          if (keywords.parseFigure !== false && _this._figure !== undefined) {
              _this._parseFigure();
          }
          if (_this._overrides.bass === undefined && _this._overrides.root !== undefined) {
              _this.bass(_this._overrides.root);
          }
          if (keywords.updatePitches && _this._figure !== undefined || _this._overrides.root !== undefined || _this._overrides.bass !== undefined) {
              _this._updatePitches();
          }
          // this._updateBasedOnXMLInput(keywords);
          if (keywords.parseFigure !== false && _this._figure !== undefined && _this._figure.indexOf('sus') !== -1 && _this._figure.indexOf('sus2') === -1) {
              _this.root(_this.bass());
          }
          return _this;
      }

      createClass(Harmony, [{
          key: '_parseFigure',
          value: function _parseFigure() {}
      }, {
          key: '_updatePitches',
          value: function _updatePitches() {}
      }, {
          key: 'findFigure',
          value: function findFigure() {
              return;
          }
      }, {
          key: 'figure',
          get: function get() {
              if (this._figure === undefined) {
                  return this.findFigure();
              } else {
                  return this._figure;
              }
          },
          set: function set(newFigure) {
              this._figure = newFigure;
              if (this._figure !== undefined) {
                  this._parseFigure();
                  this._updatePitches();
              }
          }
      }, {
          key: 'key',
          get: function get() {
              return this._key;
          },
          set: function set(keyOrScale) {
              if (typeof keyOrScale === 'string') {
                  this._key = new key.Key(keyOrScale);
              } else {
                  this._key = keyOrScale;
                  this._roman = undefined;
              }
          }
      }]);
      return Harmony;
  }(chord.Chord);

  var harmony = {
      Harmony: Harmony
  };

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
          _this.instrumentName = instrumentName;
          _this.instrumentAbbreviation = undefined;
          _this.midiProgram = undefined;
          _this._midiChannel = undefined;

          _this.lowestNote = undefined;
          _this.highestNote = undefined;

          _this.transpostion = undefined;

          _this.inGMPercMap = false;
          _this.soundfontFn = undefined;

          if (instrumentName !== undefined) {
              instrument.find(instrumentName, _this);
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

  instrument.info = [{ fn: 'acoustic_grand_piano', name: 'Acoustic Grand Piano', midiNumber: 0 }, {
      fn: 'bright_acoustic_piano',
      name: 'Bright Acoustic Piano',
      midiNumber: 1
  }, { fn: 'electric_grand_piano', name: 'Electric Grand Piano', midiNumber: 2 }, { fn: 'honkytonk_piano', name: 'Honky-tonk Piano', midiNumber: 3 }, { fn: 'electric_piano_1', name: 'Electric Piano 1', midiNumber: 4 }, { fn: 'electric_piano_2', name: 'Electric Piano 2', midiNumber: 5 }, { fn: 'harpsichord', name: 'Harpsichord', midiNumber: 6 }, { fn: 'clavinet', name: 'Clavinet', midiNumber: 7 }, { fn: 'celesta', name: 'Celesta', midiNumber: 8 }, { fn: 'glockenspiel', name: 'Glockenspiel', midiNumber: 9 }, { fn: 'music_box', name: 'Music Box', midiNumber: 10 }, { fn: 'vibraphone', name: 'Vibraphone', midiNumber: 11 }, { fn: 'marimba', name: 'Marimba', midiNumber: 12 }, { fn: 'xylophone', name: 'Xylophone', midiNumber: 13 }, { fn: 'tubular_bells', name: 'Tubular Bells', midiNumber: 14 }, { fn: 'dulcimer', name: 'Dulcimer', midiNumber: 15 }, { fn: 'drawbar_organ', name: 'Drawbar Organ', midiNumber: 16 }, { fn: 'percussive_organ', name: 'Percussive Organ', midiNumber: 17 }, { fn: 'rock_organ', name: 'Rock Organ', midiNumber: 18 }, { fn: 'church_organ', name: 'Church Organ', midiNumber: 19 }, { fn: 'reed_organ', name: 'Reed Organ', midiNumber: 20 }, { fn: 'accordion', name: 'Accordion', midiNumber: 21 }, { fn: 'harmonica', name: 'Harmonica', midiNumber: 22 }, { fn: 'tango_accordion', name: 'Tango Accordion', midiNumber: 23 }, {
      fn: 'acoustic_guitar_nylon',
      name: 'Acoustic Guitar (nylon)',
      midiNumber: 24
  }, {
      fn: 'acoustic_guitar_steel',
      name: 'Acoustic Guitar (steel)',
      midiNumber: 25
  }, {
      fn: 'electric_guitar_jazz',
      name: 'Electric Guitar (jazz)',
      midiNumber: 26
  }, {
      fn: 'electric_guitar_clean',
      name: 'Electric Guitar (clean)',
      midiNumber: 27
  }, {
      fn: 'electric_guitar_muted',
      name: 'Electric Guitar (muted)',
      midiNumber: 28
  }, { fn: 'overdriven_guitar', name: 'Overdriven Guitar', midiNumber: 29 }, { fn: 'distortion_guitar', name: 'Distortion Guitar', midiNumber: 30 }, { fn: 'guitar_harmonics', name: 'Guitar Harmonics', midiNumber: 31 }, { fn: 'acoustic_bass', name: 'Acoustic Bass', midiNumber: 32 }, {
      fn: 'electric_bass_finger',
      name: 'Electric Bass (finger)',
      midiNumber: 33
  }, { fn: 'electric_bass_pick', name: 'Electric Bass (pick)', midiNumber: 34 }, { fn: 'fretless_bass', name: 'Fretless Bass', midiNumber: 35 }, { fn: 'slap_bass_1', name: 'Slap Bass 1', midiNumber: 36 }, { fn: 'slap_bass_2', name: 'Slap Bass 2', midiNumber: 37 }, { fn: 'synth_bass_1', name: 'Synth Bass 1', midiNumber: 38 }, { fn: 'synth_bass_2', name: 'Synth Bass 2', midiNumber: 39 }, { fn: 'violin', name: 'Violin', midiNumber: 40 }, { fn: 'viola', name: 'Viola', midiNumber: 41 }, { fn: 'cello', name: 'Cello', midiNumber: 42 }, { fn: 'contrabass', name: 'Contrabass', midiNumber: 43 }, { fn: 'tremolo_strings', name: 'Tremolo Strings', midiNumber: 44 }, { fn: 'pizzicato_strings', name: 'Pizzicato Strings', midiNumber: 45 }, { fn: 'orchestral_harp', name: 'Orchestral Harp', midiNumber: 46 }, { fn: 'timpani', name: 'Timpani', midiNumber: 47 }, { fn: 'string_ensemble_1', name: 'String Ensemble 1', midiNumber: 48 }, { fn: 'string_ensemble_2', name: 'String Ensemble 2', midiNumber: 49 }, { fn: 'synth_strings_1', name: 'Synth Strings 1', midiNumber: 50 }, { fn: 'synth_strings_2', name: 'Synth Strings 2', midiNumber: 51 }, { fn: 'choir_aahs', name: 'Choir Aahs', midiNumber: 52 }, { fn: 'voice_oohs', name: 'Voice Oohs', midiNumber: 53 }, { fn: 'synth_choir', name: 'Synth Choir', midiNumber: 54 }, { fn: 'orchestra_hit', name: 'Orchestra Hit', midiNumber: 55 }, { fn: 'trumpet', name: 'Trumpet', midiNumber: 56 }, { fn: 'trombone', name: 'Trombone', midiNumber: 57 }, { fn: 'tuba', name: 'Tuba', midiNumber: 58 }, { fn: 'muted_trumpet', name: 'Muted Trumpet', midiNumber: 59 }, { fn: 'french_horn', name: 'French Horn', midiNumber: 60 }, { fn: 'brass_section', name: 'Brass Section', midiNumber: 61 }, { fn: 'synth_brass_1', name: 'Synth Brass 1', midiNumber: 62 }, { fn: 'synth_brass_2', name: 'Synth Brass 2', midiNumber: 63 }, { fn: 'soprano_sax', name: 'Soprano Sax', midiNumber: 64 }, { fn: 'alto_sax', name: 'Alto Sax', midiNumber: 65 }, { fn: 'tenor_sax', name: 'Tenor Sax', midiNumber: 66 }, { fn: 'baritone_sax', name: 'Baritone Sax', midiNumber: 67 }, { fn: 'oboe', name: 'Oboe', midiNumber: 68 }, { fn: 'english_horn', name: 'English Horn', midiNumber: 69 }, { fn: 'bassoon', name: 'Bassoon', midiNumber: 70 }, { fn: 'clarinet', name: 'Clarinet', midiNumber: 71 }, { fn: 'piccolo', name: 'Piccolo', midiNumber: 72 }, { fn: 'flute', name: 'Flute', midiNumber: 73 }, { fn: 'recorder', name: 'Recorder', midiNumber: 74 }, { fn: 'pan_flute', name: 'Pan Flute', midiNumber: 75 }, { fn: 'blown_bottle', name: 'Blown bottle', midiNumber: 76 }, { fn: 'shakuhachi', name: 'Shakuhachi', midiNumber: 77 }, { fn: 'whistle', name: 'Whistle', midiNumber: 78 }, { fn: 'ocarina', name: 'Ocarina', midiNumber: 79 }, { fn: 'lead_1_square', name: 'Lead 1 (square)', midiNumber: 80 }, { fn: 'lead_2_sawtooth', name: 'Lead 2 (sawtooth)', midiNumber: 81 }, { fn: 'lead_3_calliope', name: 'Lead 3 (calliope)', midiNumber: 82 }, { fn: 'lead_4_chiff', name: 'Lead 4 chiff', midiNumber: 83 }, { fn: 'lead_5_charang', name: 'Lead 5 (charang)', midiNumber: 84 }, { fn: 'lead_6_voice', name: 'Lead 6 (voice)', midiNumber: 85 }, { fn: 'lead_7_fifths', name: 'Lead 7 (fifths)', midiNumber: 86 }, { fn: 'lead_8_bass__lead', name: 'Lead 8 (bass + lead)', midiNumber: 87 }, { fn: 'pad_1_new_age', name: 'Pad 1 (new age)', midiNumber: 88 }, { fn: 'pad_2_warm', name: 'Pad 2 (warm)', midiNumber: 89 }, { fn: 'pad_3_polysynth', name: 'Pad 3 (polysynth)', midiNumber: 90 }, { fn: 'pad_4_choir', name: 'Pad 4 (choir)', midiNumber: 91 }, { fn: 'pad_5_bowed', name: 'Pad 5 (bowed)', midiNumber: 92 }, { fn: 'pad_6_metallic', name: 'Pad 6 (metallic)', midiNumber: 93 }, { fn: 'pad_7_halo', name: 'Pad 7 (halo)', midiNumber: 94 }, { fn: 'pad_8_sweep', name: 'Pad 8 (sweep)', midiNumber: 95 }, { fn: 'fx_1_rain', name: 'FX 1 (rain)', midiNumber: 96 }, { fn: 'fx_2_soundtrack', name: 'FX 2 (soundtrack)', midiNumber: 97 }, { fn: 'fx_3_crystal', name: 'FX 3 (crystal)', midiNumber: 98 }, { fn: 'fx_4_atmosphere', name: 'FX 4 (atmosphere)', midiNumber: 99 }, { fn: 'fx_5_brightness', name: 'FX 5 (brightness)', midiNumber: 100 }, { fn: 'fx_6_goblins', name: 'FX 6 (goblins)', midiNumber: 101 }, { fn: 'fx_7_echoes', name: 'FX 7 (echoes)', midiNumber: 102 }, { fn: 'fx_8_scifi', name: 'FX 8 (sci-fi)', midiNumber: 103 }, { fn: 'sitar', name: 'Sitar', midiNumber: 104 }, { fn: 'banjo', name: 'Banjo', midiNumber: 105 }, { fn: 'shamisen', name: 'Shamisen', midiNumber: 106 }, { fn: 'koto', name: 'Koto', midiNumber: 107 }, { fn: 'kalimba', name: 'Kalimba', midiNumber: 108 }, { fn: 'bagpipe', name: 'Bagpipe', midiNumber: 109 }, { fn: 'fiddle', name: 'Fiddle', midiNumber: 110 }, { fn: 'shanai', name: 'Shanai', midiNumber: 111 }, { fn: 'tinkle_bell', name: 'Tinkle Bell', midiNumber: 112 }, { fn: 'agogo', name: 'Agogo', midiNumber: 113 }, { fn: 'steel_drums', name: 'Steel Drums', midiNumber: 114 }, { fn: 'woodblock', name: 'Woodblock', midiNumber: 115 }, { fn: 'taiko_drum', name: 'Taiko Drum', midiNumber: 116 }, { fn: 'melodic_tom', name: 'Melodic Tom', midiNumber: 117 }, { fn: 'synth_drum', name: 'Synth Drum', midiNumber: 118 }, { fn: 'reverse_cymbal', name: 'Reverse Cymbal', midiNumber: 119 }, { fn: 'guitar_fret_noise', name: 'Guitar Fret Noise', midiNumber: 120 }, { fn: 'breath_noise', name: 'Breath Noise', midiNumber: 121 }, { fn: 'seashore', name: 'Seashore', midiNumber: 122 }, { fn: 'bird_tweet', name: 'Bird Tweet', midiNumber: 123 }, { fn: 'telephone_ring', name: 'Telephone Ring', midiNumber: 124 }, { fn: 'helicopter', name: 'Helicopter', midiNumber: 125 }, { fn: 'applause', name: 'Applause', midiNumber: 126 }, { fn: 'gunshot', name: 'Gunshot', midiNumber: 127 }];

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
   * music21/miditools -- A collection of tools for midi. See the namespace {@link music21.miditools}
   *
   * Copyright (c) 2014-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
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
              if (MIDI !== undefined && MIDI.noteOn !== undefined) {
                  // noteOn check because does not exist if no audio context
                  // or soundfont has been loaded, such as if a play event
                  // is triggered before soundfont has been loaded.
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
      tempo: {
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
              // Firefox ignores sound volume! so don't play! 
              // as does IE and others using HTML audio tag.
              var channel = instrumentObj.midiChannel;
              MIDI.noteOn(channel, 36, 1, 0); // if no notes have been played before then
              MIDI.noteOff(channel, 36, 1, 0.1); // the second note to be played is always
              MIDI.noteOn(channel, 48, 1, 0.2); // very clipped (on Safari at least)
              MIDI.noteOff(channel, 48, 1, 0.3); // this helps a lot.
              MIDI.noteOn(channel, 60, 1, 0.3); // chrome needs three notes?
              MIDI.noteOff(channel, 60, 1, 0.4);
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
          // this soundfont has already been loaded once, so just call the callback.
          if (callback !== undefined) {
              var instrumentObj = instrument.find(soundfont);
              callback(instrumentObj);
          }
      } else if (miditools.loadedSoundfonts[soundfont] === 'loading') {
          // we are still waiting for this instrument to load, so
          // wait for it before calling callback.
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
          // soundfont we have not seen before:
          // set its status to loading and then load it.
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
   * Copyright (c) 2013-18, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
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
                  class: 'keyboardkey ' + this.keyClass,
                  id: this.id,
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
                  class: 'keyboardkeyannotation',
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
                  class: 'keyboardkeyname',
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
          var _this3 = this;

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
           * - click: this.clickHandler
           *
           * @name callbacks
           * @type {object}
           * @memberof music21.keyboard.Keyboard#
           */
          this.callbacks = {
              click: function click(keyClicked) {
                  return _this3.clickHandler(keyClicked);
              }
          };
          //   more accurate offsets from http://www.mathpages.com/home/kmath043.htm
          this.sharpOffsets = {
              0: 14.3333,
              1: 18.6666,
              3: 13.25,
              4: 16.25,
              5: 19.75
          };
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
           * @method music21.keyboard.Keyboard#clickHandler
           * @param {DOMObject} keyRect - the dom object with the keyboard.
           */

      }, {
          key: 'clickHandler',
          value: function clickHandler(keyRect) {
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
                  height: heightString,
                  width: totalWidth.toString() + 'px',
                  class: 'keyboardSVG'
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
                      thisKeyboardObject.callbacks.click(this);
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
                          thisKeyboardObject.callbacks.click(this);
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
              var _this4 = this;

              var $wrapper = $$1("<div class='keyboardScrollableWrapper'></div>").css({
                  display: 'inline-block'
              });
              var $bDown = $$1("<button class='keyboardOctaveDown'>&lt;&lt;</button>").css({
                  'font-size': Math.floor(this.scaleFactor * 15).toString() + 'px'
              }).bind('click', function () {
                  miditools.transposeOctave -= 1;
                  _this4._startDNN -= 7;
                  _this4._endDNN -= 7;
                  _this4.redrawSVG();
              });
              var $bUp = $$1("<button class='keyboardOctaveUp'>&gt;&gt;</button>").css({
                  'font-size': Math.floor(this.scaleFactor * 15).toString() + 'px'
              }).bind('click', function () {
                  miditools.transposeOctave += 1;
                  _this4._startDNN += 7;
                  _this4._endDNN += 7;
                  _this4.redrawSVG();
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
                  display: 'none',
                  'background-color': 'white',
                  padding: '10px 10px 10px 10px',
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
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
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

          _this._numerator = 4;
          _this._denominator = 4;
          _this._beatGroups = [];
          _this._overwrittenBeatCount = undefined;
          _this._overwrittenBeatDuration = undefined;
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
           * Return a span of [start, end] for the current beat/beam grouping
           */

      }, {
          key: 'offsetToSpan',
          value: function offsetToSpan(offset) {
              var beatDuration = this.beatDuration.quarterLength;
              var beatsFromStart = Math.floor(offset / beatDuration);
              var start = beatsFromStart * beatDuration;
              var end = start + beatDuration;
              return [start, end];
          }

          /**
           * @param {Iterable} srcStream - a stream of elements.
           * @param {object} options - an object with measureStartOffset
           */

      }, {
          key: 'getBeams',
          value: function getBeams(srcStream, options) {
              var _this2 = this;

              var params = { measureStartOffset: 0.0 };
              common.merge(params, options);
              var measureStartOffset = params.measureStartOffset;
              var beamsList = beam.Beams.naiveBeams(srcStream);
              beamsList = beam.Beams.removeSandwichedUnbeamables(beamsList);
              var fixBeamsOneElementDepth = function fixBeamsOneElementDepth(i, el, depth) {
                  var beams = beamsList[i];
                  if (!beams || beams === undefined) {
                      return;
                  }
                  var beamNumber = depth + 1;
                  if (!beams.getNumbers().includes(beamNumber)) {
                      return;
                  }
                  var dur = el.duration;
                  var pos = el.offset + measureStartOffset;

                  var start = pos; // opFrac
                  var end = pos + dur.quarterLength; // opFrac;
                  var startNext = end;
                  var isLast = i === srcStream.length - 1;
                  var isFirst = i === 0;
                  var beamNext = void 0;
                  var beamPrevious = void 0;
                  if (!isFirst) {
                      beamPrevious = beamsList[i - 1];
                  }
                  if (!isLast) {
                      beamNext = beamsList[i + 1];
                  }

                  var _offsetToSpan = _this2.offsetToSpan(start),
                      _offsetToSpan2 = slicedToArray(_offsetToSpan, 2),
                      archetypeSpanStart = _offsetToSpan2[0],
                      archetypeSpanEnd = _offsetToSpan2[1];

                  var archetypeSpanNextStart = 0.0;
                  if (beamNext !== undefined) {
                      archetypeSpanNextStart = _this2.offsetToSpan(startNext)[0];
                  }
                  if (start === archetypeSpanStart && end === archetypeSpanEnd) {
                      beamsList[i] = undefined;
                      return;
                  }

                  var beamType = void 0;
                  if (isFirst) {
                      beamType = 'start';
                      if (beamNext === undefined || !beamNext.getNumbers().includes(beamNumber)) {
                          beamType = 'partial-right';
                      }
                  } else if (isLast) {
                      beamType = 'start';
                      if (beamPrevious === undefined || !beamPrevious.getNumbers().includes(beamNumber)) {
                          beamType = 'partial-left';
                      }
                  } else if (beamPrevious === undefined || !beamPrevious.getNumbers().includes(beamNumber)) {
                      if (beamNumber === 1 && beamNext === undefined) {
                          beamsList[i] = undefined;
                          return;
                      } else if (beamNext === undefined && beamNumber > 1) {
                          beamType = 'partial-left';
                      } else if (startNext >= archetypeSpanEnd) {
                          beamType = 'partial-left';
                      } else if (beamNext === undefined || !beamNext.getNumbers().includes(beamNumber)) {
                          beamType = 'partial-right';
                      } else {
                          beamType = 'start';
                      }
                  } else if (beamPrevious !== undefined && beamPrevious.getNumbers().includes(beamNumber) && ['stop', 'partial-left'].includes(beamPrevious.getTypeByNumber(beamNumber))) {
                      if (beamNext !== undefined) {
                          beamType = 'start';
                      } else {
                          beamType = 'partial-left';
                      }
                  } else if (beamNext === undefined || !beamNext.getNumbers().includes(beamNumber)) {
                      beamType = 'stop';
                  } else if (startNext < archetypeSpanEnd) {
                      beamType = 'continue';
                  } else if (startNext >= archetypeSpanNextStart) {
                      beamType = 'stop';
                  } else {
                      console.warn('Cannot match beamType');
                      return;
                  }
                  beams.setByNumber(beamNumber, beamType);
              };

              for (var depth = 0; depth < beam.beamableDurationTypes.length; depth++) {
                  var i = 0;
                  var _iteratorNormalCompletion = true;
                  var _didIteratorError = false;
                  var _iteratorError = undefined;

                  try {
                      for (var _iterator = srcStream[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                          var el = _step.value;

                          fixBeamsOneElementDepth(i, el, depth);
                          i += 1;
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
              }

              beamsList = beam.Beams.sanitizePartialBeams(beamsList);
              beamsList = beam.Beams.mergeConnectingPartialBeams(beamsList);
              return beamsList;
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
              var tempBeatGroups = this.beatGroups;
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
              this._beatGroups = [];
          }
      }, {
          key: 'barDuration',
          get: function get() {
              var ql = 4.0 * this._numerator / this._denominator;
              return new duration.Duration(ql);
          }
      }, {
          key: 'beatGroups',
          get: function get() {
              if (this._beatGroups.length === 0) {
                  this._beatGroups = this.computeBeatGroups();
              }
              return this._beatGroups;
          },
          set: function set(newGroups) {
              this._beatGroups = newGroups;
          }

          /**
           *  Get the beatCount from the numerator, assuming fast 6/8, etc.
           *  unless .beatCount has been set manually.
           */

      }, {
          key: 'beatCount',
          get: function get() {
              if (this._overwrittenBeatCount !== undefined) {
                  return this._overwrittenBeatCount;
              }
              if (this.numerator > 3 && this.numerator % 3 === 0) {
                  return this.numerator / 3;
              } else {
                  return this.numerator;
              }
          }
          /**
           *  Manually set the beatCount to an int.
           */
          ,
          set: function set(overwrite) {
              this._overwrittenBeatCount = overwrite;
              return overwrite;
          }

          /**
           * Gets a single duration.Duration object representing
           * the length of a beat in this time signature (using beatCount)
           * or, if set manually, it can return a list of Durations For
           * asymmetrical meters.
           */

      }, {
          key: 'beatDuration',
          get: function get() {
              var dur = this.barDuration;
              dur.quarterLength /= this.beatCount;
              return dur;
          }
          /**
           * Set beatDuration to a duration.Duration object or
           * if the client can handle it, a list of Duration objects...
           */
          ,
          set: function set(overwrite) {
              this._overwrittenBeatDuration = overwrite;
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
              click: 'play',
              dblclick: undefined
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
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/vfShow -- Vexflow integration
   *
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
   *
   */

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
          this.voiceToStreamMapping = new Map();
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
   * optional existing canvas or SVG element and a DOM
   * element where the canvas or SVG element should be placed
   * and renders the stream as Vexflow on the
   * canvas or svg element, placing it then in the where
   * DOM.
   *
   * "s" can be any type of Stream.
   *
   * "div" and "where" can be either a DOM
   * element or a jQuery object.
   *
   * @class Renderer
   * @memberof music21.vfShow
   * @param {music21.stream.Stream} s - main stream to render
   * @param {div} [div] - existing canvas or div-surroundingSVG element
   * @param {DOMObject|jQueryDOMObject} [where=document.body] - where to render the stream
   * @property {Vex.Flow.Renderer} vfRenderer - a Vex.Flow.Renderer to use
   * (will create if not existing)
   * @property {string} rendererType - canvas or svg
   * @property {Vex.Flow.Context} ctx - a Vex.Flow.Context (Canvas or SVG) to use.
   * @property {div} div - div-with-svg-or-canvas element
   * @property {jQueryDOMObject} $div - jQuery div or canvas element
   * @property {jQueryDOMObject} $where - jQuery element to render onto
   * @property {Vex.Flow.Formatter} activeFormatter - formatter
   * @property {Array<Vex.Flow.Beam>} beamGroups - beamGroups
   * @property {Array<Vex.Flow.StaveTie>} vfTies - ties as instances of Vex.Flow.StaveTie
   * @property {Array<number>} systemBreakOffsets - where to break the systems
   * @property {Array<Vex.Flow.Tuplet>} vfTuplets - tuplets represented in Vexflow
   * @property {Array<music21.vfShow.RenderStack>} stacks - array of RenderStack objects
   */
  var Renderer = function () {
      function Renderer(s, div, where) {
          classCallCheck(this, Renderer);

          this.stream = s;
          // this.streamType = s.classes[-1];
          this.rendererType = 'svg';

          this.div = undefined;
          this.$div = undefined;
          this.$where = undefined;
          this.activeFormatter = undefined;
          this._vfRenderer = undefined;
          this._ctx = undefined;
          this.beamGroups = [];
          this.stacks = []; // an Array of RenderStacks: {voices: [Array of Vex.Flow.Voice objects],
          //                                           streams: [Array of Streams, usually Measures]}
          this.vfTies = [];
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
          if (div !== undefined) {
              if (div.jquery !== undefined) {
                  this.$div = div;
                  this.div = div[0];
              } else {
                  this.div = div;
                  this.$div = $$1(div);
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
              //
              var parts = s.parts;
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = parts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var subStream = _step2.value;

                      this.preparePartlike(subStream);
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
              var measureList = p.measures;
              for (var i = 0; i < measureList.length; i++) {
                  var subStream = measureList.get(i);
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
           * stacks and vfTies after calling prepareFlat
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
              stack.voiceToStreamMapping.set(voice, s);

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
           * draws the vfTies
           *
           * @memberof music21.vfShow.Renderer
           */

      }, {
          key: 'drawTies',
          value: function drawTies() {
              var ctx = this.ctx;
              for (var i = 0; i < this.vfTies.length; i++) {
                  this.vfTies[i].setContext(ctx).draw();
              }
          }
          /**
           * Finds all tied notes and creates the proper Vex.Flow.StaveTie objects in
           * `this.vfTies`.
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
                      this.vfTies.push(vfTie);
                  } else {
                      // console.log('got me a tie across systemBreaks!');
                      var vfTie1 = new Vex.Flow.StaveTie({
                          first_note: thisNote.activeVexflowNote,
                          first_indices: [0]
                      });
                      this.vfTies.push(vfTie1);
                      var vfTie2 = new Vex.Flow.StaveTie({
                          last_note: nextNote.activeVexflowNote,
                          first_indices: [0]
                      });
                      this.vfTies.push(vfTie2);
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
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                  for (var _iterator3 = tickablesByStave[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var staveTickables = _step3.value;

                      formatter.joinVoices(staveTickables);
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

              formatter.formatToStave(allTickables, stave);

              //        const vf_auto_stem = false;
              //        for (const voice of voices) {            
              //            let activeBeamGroupNotes = [];
              //            for (let j = 0; j < voice.notes.length; j++) {
              //                const n = voice.notes[j];
              //                if (n.beams === undefined || !n.beams.getNumbers().includes(1)) {
              //                    continue;
              //                }
              //                const eighthNoteBeam = n.beams.getByNumber(1);
              //                if (eighthNoteBeam.type === 'start') {
              //                    activeBeamGroupNotes = [n];
              //                } else {
              //                    activeBeamGroupNotes.push(n);
              //                }
              //                if (eighthNoteBeam.type === 'stop') {
              //                    const vfBeam = new Vex.Flow.Beam(activeBeamGroupNotes, vf_auto_stem);
              //                    this.beamGroups.push(vfBeam);
              //                    activeBeamGroupNotes = []; // housekeeping, not really necessary...
              //                }
              //            }
              //        }

              if (autoBeam) {
                  for (var _i2 = 0; _i2 < voices.length; _i2++) {
                      var _beamGroups;

                      // find beam groups -- n.b. this wipes out stemDirection. worth it usually...
                      var voice = voices[_i2];
                      var associatedStream = stack.voiceToStreamMapping.get(voice);
                      var beatGroups = void 0;
                      if (associatedStream !== undefined && associatedStream.timeSignature !== undefined) {
                          beatGroups = associatedStream.timeSignature.vexflowBeatGroups(Vex);
                          // TODO: getContextByClass...
                          // console.log(beatGroups);
                      } else {
                          beatGroups = [new Vex.Flow.Fraction(2, 8)]; // default beam groups
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
                  var ksVFName = s.keySignature.majorName().replace(/-/g, 'b');
                  stave.addKeySignature(ksVFName);
              }

              if (s.timeSignature !== undefined && rendOp.displayTimeSignature) {
                  stave.addTimeSignature(s.timeSignature.numerator.toString() + '/' + s.timeSignature.denominator.toString());
              }
              if (rendOp.rightBarline !== undefined) {
                  var bl = rendOp.rightBarline;
                  var barlineMap = {
                      single: 'SINGLE',
                      double: 'DOUBLE',
                      end: 'END'
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
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                  for (var _iterator4 = s[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var thisEl = _step4.value;

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
                              // only support one tuplet per note -- like vexflow
                              if (activeTuplet === undefined) {
                                  activeTuplet = thisEl.duration.tuplets[0];
                              }
                              activeTupletVexflowNotes.push(vfn);
                              activeTupletLength += thisEl.duration.quarterLength;
                              // console.log(activeTupletLength, activeTuplet.totalTupletLength());
                              //
                              // Add tuplet when complete.
                              if (activeTupletLength >= activeTuplet.totalTupletLength() || Math.abs(activeTupletLength - activeTuplet.totalTupletLength()) < 0.001) {
                                  // console.log(activeTupletVexflowNotes);
                                  var tupletOptions = {
                                      num_notes: activeTuplet.numberNotesActual,
                                      notes_occupied: activeTuplet.numberNotesNormal
                                  };
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
              var getTextNote = function getTextNote(text, font, d, lyricObj) {
                  // console.log(text, font, d);
                  var t1 = new Vex.Flow.TextNote({
                      text: text,
                      font: font,
                      duration: d.vexflowDuration
                  }).setLine(11).setStave(stave).setJustification(Vex.Flow.TextNote.Justification.LEFT);
                  if (lyricObj) {
                      t1.setStyle(lyricObj.style);
                  }
                  if (d.tuplets.length > 0) {
                      t1.applyTickMultiplier(d.tuplets[0].numberNotesNormal, d.tuplets[0].numberNotesActual);
                  }
                  return t1;
              };

              if (s === undefined) {
                  s = this.stream;
              }
              // runs on a flat, gapless, no-overlap stream, returns a list of TextNote objects...
              var lyricsObjects = [];
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                  for (var _iterator5 = s[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                      var el = _step5.value;

                      var lyricsArray = el.lyrics;
                      var text = void 0;
                      var d = el.duration;
                      var addConnector = false;
                      var firstLyric = void 0;
                      var font = {
                          family: 'Serif',
                          size: 12,
                          weight: ''
                      };

                      if (lyricsArray.length === 0) {
                          text = '';
                      } else {
                          firstLyric = lyricsArray[0];
                          text = firstLyric.text;
                          if (text === undefined) {
                              text = '';
                          }
                          if (firstLyric.syllabic === 'middle' || firstLyric.syllabic === 'begin') {
                              addConnector = ' ' + firstLyric.lyricConnector;
                              var tempQl = el.duration.quarterLength / 2.0;
                              d = new duration.Duration(tempQl);
                          }
                          if (firstLyric.style.fontFamily) {
                              font.family = firstLyric.style.fontFamily;
                          }
                          if (firstLyric.style.fontSize) {
                              font.size = firstLyric.style.fontSize;
                          }
                          if (firstLyric.style.fontWeight) {
                              font.weight = firstLyric.style.fontWeight;
                          }
                      }
                      var t1 = getTextNote(text, font, d, firstLyric);
                      lyricsObjects.push(t1);
                      if (addConnector !== false) {
                          var connector = getTextNote(addConnector, font, d);
                          lyricsObjects.push(connector);
                      }
                  }
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
              var vfv = new Vex.Flow.Voice({
                  num_beats: num1024,
                  beat_value: beatValue,
                  resolution: Vex.Flow.RESOLUTION
              });

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
                  brace: Vex.Flow.StaveConnector.type.BRACE,
                  single: Vex.Flow.StaveConnector.type.SINGLE,
                  double: Vex.Flow.StaveConnector.type.DOUBLE,
                  bracket: Vex.Flow.StaveConnector.type.BRACKET
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
              var parts = s.parts;
              var numParts = parts.length;
              if (numParts < 2) {
                  return;
              }

              var firstPart = parts.get(0);
              var lastPart = parts.get(-1);

              var firstPartMeasures = firstPart.measures;
              var lastPartMeasures = lastPart.measures;
              var numMeasures = firstPartMeasures.length;

              for (var mIndex = 0; mIndex < numMeasures; mIndex++) {
                  var thisPartMeasure = firstPartMeasures.get(mIndex);
                  var lastPartMeasure = lastPartMeasures.get(mIndex); // only needed once per system but
                  // good for symmetry.
                  if (thisPartMeasure.renderOptions.startNewSystem) {
                      var topVFStaff = thisPartMeasure.activeVFStave;
                      var bottomVFStaff = lastPartMeasure.activeVFStave;
                      if (topVFStaff === undefined) {
                          if (thisPartMeasure.hasSubStreams()) {
                              var thisPartVoice = thisPartMeasure.getElementsByClass('Stream').get(0);
                              topVFStaff = thisPartVoice.activeVFStave;
                              if (topVFStaff === undefined) {
                                  console.warn('No active VexFlow Staves defined for at least one measure');
                                  continue;
                              }
                          }
                      }
                      if (bottomVFStaff === undefined) {
                          if (lastPartMeasure.hasSubStreams()) {
                              var lastPartVoice = lastPartMeasure.getElementsByClass('Stream').get(0);
                              bottomVFStaff = lastPartVoice.activeVFStave;
                              if (bottomVFStaff === undefined) {
                                  console.warn('No active VexFlow Staves defined for at least one measure');
                                  continue;
                              }
                          }
                      }
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
           * The process of putting a Stream onto a div affects each of the
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
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                  for (var _iterator6 = s[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                      var el = _step6.value;

                      el.x = undefined;
                      el.y = undefined;
                      el.width = undefined;
                      el.systemIndex = undefined;
                      el.activeVexflowNote = undefined;
                      if (recursive && el.isClassOrSubclass('Stream')) {
                          this.removeFormatterInformation(el, recursive);
                      }
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
              var _iteratorNormalCompletion7 = true;
              var _didIteratorError7 = false;
              var _iteratorError7 = undefined;

              try {
                  for (var _iterator7 = s[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                      var el = _step7.value;

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

                          // console.log(el.x + " " + formatterNote.x + " " + noteOffsetLeft);
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

              if (debug) {
                  var _iteratorNormalCompletion8 = true;
                  var _didIteratorError8 = false;
                  var _iteratorError8 = undefined;

                  try {
                      for (var _iterator8 = s[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                          var n = _step8.value;

                          if (n.pitch !== undefined) {
                              console.log(n.pitch.diatonicNoteNum + ' ' + n.x + ' ' + (n.x + n.width));
                          }
                      }
                  } catch (err) {
                      _didIteratorError8 = true;
                      _iteratorError8 = err;
                  } finally {
                      try {
                          if (!_iteratorNormalCompletion8 && _iterator8.return) {
                              _iterator8.return();
                          }
                      } finally {
                          if (_didIteratorError8) {
                              throw _iteratorError8;
                          }
                      }
                  }
              }
              s.storedVexflowStave = stave;
          }
      }, {
          key: 'vfRenderer',
          get: function get() {
              var backend = void 0;
              if (this.rendererType === 'canvas') {
                  backend = Vex.Flow.Renderer.Backends.CANVAS;
              } else {
                  backend = Vex.Flow.Renderer.Backends.SVG;
              }

              if (this._vfRenderer !== undefined) {
                  return this._vfRenderer;
              } else {
                  this._vfRenderer = new Vex.Flow.Renderer(this.div, backend);
                  if (this.rendererType === 'svg') {
                      this._vfRenderer.resize(this.$div.attr('width'), this.$div.attr('height'));
                  }
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
                  if (this.stream && this.stream.renderOptions && this.stream.renderOptions.scaleFactor.x && this.stream.renderOptions.scaleFactor.y) {
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
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006-17, Michael Scott Cuthbert and cuthbertLab
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
   * @requires jquery
   */
  var stream = {};

  var StreamException$1 = function (_Music21Exception) {
      inherits(StreamException, _Music21Exception);

      function StreamException() {
          classCallCheck(this, StreamException);
          return possibleConstructorReturn(this, (StreamException.__proto__ || Object.getPrototypeOf(StreamException)).apply(this, arguments));
      }

      return StreamException;
  }(Music21Exception);

  stream.StreamException = StreamException$1;

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
   * @property {number} highestTime -- the highest time point in the stream's elements
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

          // class variables;
          var _this2 = possibleConstructorReturn(this, (Stream.__proto__ || Object.getPrototypeOf(Stream)).call(this));

          _this2.isStream = true;
          _this2.isMeasure = false;
          _this2.classSortOrder = -20;
          _this2.recursionType = 'elementsFirst';

          _this2._duration = undefined;

          _this2._elements = [];
          _this2._elementOffsets = [];
          _this2._clef = undefined;
          _this2.displayClef = undefined;

          _this2._keySignature = undefined; // a music21.key.KeySignature object
          _this2._timeSignature = undefined; // a music21.meter.TimeSignature object
          _this2._instrument = undefined;

          _this2._autoBeam = undefined;
          _this2.activeVFStave = undefined;
          _this2.activeVFRenderer = undefined;
          _this2.renderOptions = new renderOptions.RenderOptions();
          _this2._tempo = undefined;

          _this2.staffLines = 5;

          _this2._stopPlaying = false;
          _this2._allowMultipleSimultaneousPlays = true; // not implemented yet.
          _this2.changedCallbackFunction = undefined; // for editable svges
          /**
           * A function bound to the current stream that
           * will changes the stream. Used in editableAccidentalDOM, among other places.
           *
           *      var can = s.appendNewDOM();
           *      $(can).on('click', s.DOMChangerFunction);
           *
           * @memberof music21.stream.Stream
           * @param {Event} e
           * @returns {music21.base.Music21Object|undefined} - returns whatever changedCallbackFunction does.
           */
          _this2.DOMChangerFunction = function (e) {
              var canvasOrSVGElement = e.currentTarget;

              var _this2$findNoteForCli = _this2.findNoteForClick(canvasOrSVGElement, e),
                  _this2$findNoteForCli2 = slicedToArray(_this2$findNoteForCli, 2),
                  clickedDiatonicNoteNum = _this2$findNoteForCli2[0],
                  foundNote = _this2$findNoteForCli2[1];

              if (foundNote === undefined) {
                  if (debug) {
                      console.log('No note found');
                  }
                  return undefined;
              }
              return _this2.noteChanged(clickedDiatonicNoteNum, foundNote, canvasOrSVGElement);
          };
          return _this2;
      }

      createClass(Stream, [{
          key: Symbol.iterator,
          value: regeneratorRuntime.mark(function value() {
              var i;
              return regeneratorRuntime.wrap(function value$(_context) {
                  while (1) {
                      switch (_context.prev = _context.next) {
                          case 0:
                              i = 0;

                          case 1:
                              if (!(i < this.length)) {
                                  _context.next = 7;
                                  break;
                              }

                              _context.next = 4;
                              return this.get(i);

                          case 4:
                              i++;
                              _context.next = 1;
                              break;

                          case 7:
                          case 'end':
                              return _context.stop();
                      }
                  }
              }, value, this);
          })
      }, {
          key: '_getFlatOrSemiFlat',
          value: function _getFlatOrSemiFlat(retainContainers) {
              if (!this.hasSubStreams()) {
                  return this;
              }
              var tempEls = [];
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var el = _step.value;

                      if (el.isStream) {
                          if (retainContainers) {
                              tempEls.push(el);
                          }
                          var offsetShift = el.offset;
                          // console.log('offsetShift', offsetShift, el.classes[el.classes.length -1]);
                          var elFlat = el._getFlatOrSemiFlat(retainContainers);
                          for (var j = 0; j < elFlat.length; j++) {
                              // offset should NOT be null because already in Stream
                              elFlat.get(j).offset += offsetShift;
                          }
                          tempEls.push.apply(tempEls, toConsumableArray(elFlat._elements));
                      } else {
                          tempEls.push(el);
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

              var newSt = this.clone(false);
              newSt.elements = tempEls;
              return newSt;
          }
      }, {
          key: 'clone',


          /* override protoM21Object.clone() */
          value: function clone() {
              var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

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
                  } else if (key in this._cloneCallbacks) {
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
           * @param {music21.base.Music21Object|Array} el - element or list of elements to append
           * @returns {this}
           */

      }, {
          key: 'append',
          value: function append(elOrElList) {
              if (Array.isArray(elOrElList)) {
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                      for (var _iterator2 = elOrElList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                          var _el = _step2.value;

                          this.append(_el);
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

                  return this;
              }

              var el = elOrElList;
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
                  el.sites.add(this);
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
                  el.sites.add(this);
                  el.activeSite = this; // would prefer weakref, but does not exist in JS.
              } catch (err) {
                  console.error('Cannot insert element ', el, ' to stream ', this, ' : ', err);
              }
              return this;
          }

          /**
           * Inserts a single element at offset, shifting elements at or after it begins
           * later in the stream.
           *
           * In single argument form, assumes it is an element and takes the offset from the element.
           *
           * Unlike music21p, does not take a list of elements.  TODO(msc): add this.
           */

      }, {
          key: 'insertAndShift',
          value: function insertAndShift(offset, elementOrNone) {
              var element = void 0;
              if (elementOrNone === undefined) {
                  element = offset;
                  offset = element.offset;
              } else {
                  element = elementOrNone;
              }
              var amountToShift = element.duration.quarterLength;

              var shiftingOffsets = false;
              for (var i = 0; i < this.length; i++) {
                  if (!shiftingOffsets && this._elementOffsets[i] >= offset) {
                      shiftingOffsets = true;
                  }
                  if (shiftingOffsets) {
                      this._elementOffsets[i] += amountToShift;
                      this._elements[i].offset = this._elementOffsets[i];
                  }
              }
              this.insert(offset, element);
          }

          /**
           * Return the first matched index
           */

      }, {
          key: 'index',
          value: function index(el) {
              var count = 0;
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                  for (var _iterator3 = this._elements[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var e = _step3.value;

                      if (el === e) {
                          return count;
                      }
                      count += 1;
                  }
                  // endElements
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

              throw new StreamException$1('cannot find object (' + el + ') in Stream');
          }

          /**
           * Remove and return the last element in the stream,
           * or return undefined if the stream is empty
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
                  el.sites.remove(this);
                  return el;
              } else {
                  return undefined;
              }
          }

          /**
           * Remove an object from this Stream
           */

      }, {
          key: 'remove',
          value: function remove(targetOrList) {
              var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                  _ref$firstMatchOnly = _ref.firstMatchOnly,
                  firstMatchOnly = _ref$firstMatchOnly === undefined ? true : _ref$firstMatchOnly,
                  _ref$shiftOffsets = _ref.shiftOffsets,
                  shiftOffsets = _ref$shiftOffsets === undefined ? false : _ref$shiftOffsets,
                  _ref$recurse = _ref.recurse,
                  recurse = _ref$recurse === undefined ? false : _ref$recurse;

              if (shiftOffsets === true) {
                  throw new StreamException$1('sorry cannot shiftOffsets yet');
              }
              if (recurse === true) {
                  throw new StreamException$1('sorry cannot recurse yet');
              }

              var targetList = void 0;
              if (!Array.isArray(targetOrList)) {
                  targetList = [targetOrList];
              } else {
                  targetList = targetOrList;
              }
              //        if (targetList.length > 1) {
              //            sort targetList
              //        }        
              // let shiftDur = 0.0; // for shiftOffsets
              var i = -1;
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                  for (var _iterator4 = targetList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var target = _step4.value;

                      i += 1;
                      var indexInStream = void 0;
                      try {
                          indexInStream = this.index(target);
                      } catch (err) {
                          if (err instanceof StreamException$1) {
                              if (recurse) {
                                  // do something
                              }
                              continue;
                          }
                          throw err;
                      }

                      // const matchOffset = this._elementOffsets[indexInStream];
                      // let match;
                      // handle _endElements
                      // let matchedEndElement = false;
                      // let baseElementCount = this._elements.length;
                      this._elements.splice(indexInStream, 1);
                      this._elementOffsets.splice(indexInStream, 1);
                      // remove from sites if needed.

                      //            if (shiftOffsets) {
                      //                const matchDuration = target.duration.quarterLength;
                      //                const shiftedRegionStart = matchOffset + matchDuration;
                      //                shiftDur += matchDuration;
                      //                let shiftedRegionEnd;
                      //                if ((i + 1) < targetList.length) {
                      //                    const nextElIndex = this.index(targetList[i + 1]);
                      //                    const nextElOffset = this._elementOffsets[nextElIndex];
                      //                    shiftedRegionEnd = nextElOffset;
                      //                } else {
                      //                    shiftedRegionEnd = this.duration.quarterLength;
                      //                }
                      //                if (shiftDur !== 0.0) {
                      //                    for (const e of this.getElementsByOffset(
                      //                       shiftedRegionStart,
                      //                       shiftedRegionEnd,
                      //                       {
                      //                           includeEndBoundary: false,
                      //                           mustFinishInSpan: false,
                      //                           mustBeginInSpan: false,                           
                      //                       }
                      //                    )) {
                      //                        const elementOffset = this.elementOffset(e);
                      //                        this.setElementOffset(e, elementOffset - shiftDur);
                      //                    }
                      //                }
                      //            }
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
          }

          /**
           *  Given a `target` object, replace it with
           *  the supplied `replacement` object.
           *  
           *  `recurse` and `allDerived` do not currently work.
           *  
           *  Does nothing if target cannot be found.
           */

      }, {
          key: 'replace',
          value: function replace(target, replacement) {
              var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                  _ref2$recurse = _ref2.recurse,
                  recurse = _ref2$recurse === undefined ? false : _ref2$recurse,
                  _ref2$allDerivated = _ref2.allDerivated,
                  allDerivated = _ref2$allDerivated === undefined ? true : _ref2$allDerivated;

              var i = void 0;
              try {
                  i = this.index(target);
              } catch (err) {
                  if (err instanceof StreamException$1) {
                      return;
                  } else {
                      throw err;
                  }
              }
              replacement.offset = this._elementOffsets[i];
              this._elements[i] = replacement;
              target.offset = 0.0;
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
      }, {
          key: 'setElementOffset',
          value: function setElementOffset(el, value) {
              var addElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

              for (var i = 0; i < this.length; i++) {
                  if (this._elements[i] === el) {
                      this._elementOffsets[i] = value;
                      return;
                  }
              }
              if (!addElement) {
                  throw new StreamException$1('Cannot set the offset for elemenet ' + el.toString() + ', not in Stream');
              } else {
                  this.insert(value, el);
              }
          }
      }, {
          key: 'elementOffset',
          value: function elementOffset(element) {
              var stringReturns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

              for (var i = 0; i < this.length; i++) {
                  if (this._elements[i] === element) {
                      return this._elementOffsets[i];
                  }
              }
              throw new StreamException$1('An entry for this object is not stored in this Stream.');
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
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                  for (var _iterator5 = this[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                      var el = _step5.value;

                      if (el.isClassOrSubclass('Stream')) {
                          hasSubStreams = true;
                          break;
                      }
                  }
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
                  var _iteratorNormalCompletion6 = true;
                  var _didIteratorError6 = false;
                  var _iteratorError6 = undefined;

                  try {
                      for (var _iterator6 = post[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                          var _e = _step6.value;

                          this.insert(_e.offset, _e);
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

                  return this; // javascript style;
              }
          }

          /**
           * Return a new Stream or modify this stream
           * to have beams.
           *
           * NOT yet being called March 2018
           */

      }, {
          key: 'makeBeams',
          value: function makeBeams(options) {
              var params = { inPlace: false };
              common.merge(params, options);
              var returnObj = this;
              if (!params.inPlace) {
                  returnObj = this.clone(true);
              }
              var mColl = void 0;
              if (this.classes.includes('Measure')) {
                  mColl = [returnObj];
              } else {
                  mColl = [];
                  var _iteratorNormalCompletion7 = true;
                  var _didIteratorError7 = false;
                  var _iteratorError7 = undefined;

                  try {
                      for (var _iterator7 = returnObj.getElementsByClass('Measure').elements[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                          var m = _step7.value;

                          mColl.push(m);
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
              }
              var lastTimeSignature = void 0;
              var _iteratorNormalCompletion8 = true;
              var _didIteratorError8 = false;
              var _iteratorError8 = undefined;

              try {
                  for (var _iterator8 = mColl[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                      var _m = _step8.value;

                      if (_m.timeSignature !== undefined) {
                          lastTimeSignature = _m.timeSignature;
                      }
                      if (lastTimeSignature === undefined) {
                          throw new StreamException$1('Need a Time Signature to process beams');
                      }
                      // todo voices!
                      if (_m.length <= 1) {
                          continue; // nothing to beam.
                      }
                      var noteStream = _m.notesAndRests;
                      var durList = [];
                      var _iteratorNormalCompletion9 = true;
                      var _didIteratorError9 = false;
                      var _iteratorError9 = undefined;

                      try {
                          for (var _iterator9 = noteStream[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                              var _n = _step9.value;

                              durList.push(_n.duration);
                          }
                      } catch (err) {
                          _didIteratorError9 = true;
                          _iteratorError9 = err;
                      } finally {
                          try {
                              if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                  _iterator9.return();
                              }
                          } finally {
                              if (_didIteratorError9) {
                                  throw _iteratorError9;
                              }
                          }
                      }

                      var durSum = durList.map(function (a) {
                          return a.quarterLength;
                      }).reduce(function (total, val) {
                          return total + val;
                      });
                      var barQL = lastTimeSignature.barDuration.quarterLength;
                      if (durSum > barQL) {
                          continue;
                      }
                      var offset = 0.0;
                      if (_m.paddingLeft !== 0.0 && _m.paddingLeft !== undefined) {
                          offset = _m.paddingLeft;
                      } else if (noteStream.highestTime < barQL) {
                          offset = barQL - noteStream.highestTime;
                      }
                      var beamsList = lastTimeSignature.getBeams(noteStream, { measureStartOffset: offset });
                      for (var i = 0; i < noteStream.length; i++) {
                          var n = noteStream.get(i);
                          var thisBeams = beamsList[i];
                          if (thisBeams !== undefined) {
                              n.beams = thisBeams;
                          } else {
                              n.beams = new beam.Beams();
                          }
                      }
                  }

                  // returnObj.streamStatus.beams = true;
              } catch (err) {
                  _didIteratorError8 = true;
                  _iteratorError8 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion8 && _iterator8.return) {
                          _iterator8.return();
                      }
                  } finally {
                      if (_didIteratorError8) {
                          throw _iteratorError8;
                      }
                  }
              }

              return returnObj;
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
              var _iteratorNormalCompletion10 = true;
              var _didIteratorError10 = false;
              var _iteratorError10 = undefined;

              try {
                  for (var _iterator10 = this[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                      var el = _step10.value;

                      if (el.lyric !== undefined) {
                          return true;
                      }
                  }
              } catch (err) {
                  _didIteratorError10 = true;
                  _iteratorError10 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion10 && _iterator10.return) {
                          _iterator10.return();
                      }
                  } finally {
                      if (_didIteratorError10) {
                          throw _iteratorError10;
                      }
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
              var _iteratorNormalCompletion11 = true;
              var _didIteratorError11 = false;
              var _iteratorError11 = undefined;

              try {
                  for (var _iterator11 = this[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                      var thisEl = _step11.value;

                      // console.warn(thisEl);
                      if (thisEl.isClassOrSubclass === undefined) {
                          console.error('what the hell is a ', thisEl, 'doing in a Stream?');
                      } else if (thisEl.isClassOrSubclass(classList)) {
                          tempEls.push(thisEl);
                      }
                  }
              } catch (err) {
                  _didIteratorError11 = true;
                  _iteratorError11 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion11 && _iterator11.return) {
                          _iterator11.return();
                      }
                  } finally {
                      if (_didIteratorError11) {
                          throw _iteratorError11;
                      }
                  }
              }

              var newSt = this.clone(false);
              newSt.elements = tempEls;
              return newSt;
          }
          /**
           * Sets Pitch.accidental.displayStatus for every element with a
           * pitch or pitches in the stream. If a natural needs to be displayed
           * and the Pitch does not have an accidental object yet, adds one.
           *
           * Called automatically before appendDOM routines are called.
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
              var _iteratorNormalCompletion12 = true;
              var _didIteratorError12 = false;
              var _iteratorError12 = undefined;

              try {
                  for (var _iterator12 = stepNames[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                      var stepName = _step12.value;

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
              } catch (err) {
                  _didIteratorError12 = true;
                  _iteratorError12 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion12 && _iterator12.return) {
                          _iterator12.return();
                      }
                  } finally {
                      if (_didIteratorError12) {
                          throw _iteratorError12;
                      }
                  }
              }

              var lastOctaveStepList = [];
              for (var i = 0; i < 10; i++) {
                  var tempOctaveStepDict = $$1.extend({}, extendableStepList);
                  lastOctaveStepList.push(tempOctaveStepDict);
              }
              var lastOctavelessStepDict = $$1.extend({}, extendableStepList); // probably unnecessary, but safe...

              var _iteratorNormalCompletion13 = true;
              var _didIteratorError13 = false;
              var _iteratorError13 = undefined;

              try {
                  for (var _iterator13 = this[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                      var el = _step13.value;

                      if (el.pitch !== undefined) {
                          // note
                          var p = el.pitch;
                          var lastStepDict = lastOctaveStepList[p.octave];
                          this._makeAccidentalForOnePitch(p, lastStepDict, lastOctavelessStepDict);
                      } else if (el._notes !== undefined) {
                          // chord
                          var _iteratorNormalCompletion14 = true;
                          var _didIteratorError14 = false;
                          var _iteratorError14 = undefined;

                          try {
                              for (var _iterator14 = el._notes[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                                  var chordNote = _step14.value;

                                  var _p = chordNote.pitch;
                                  var _lastStepDict = lastOctaveStepList[_p.octave];
                                  this._makeAccidentalForOnePitch(_p, _lastStepDict, lastOctavelessStepDict);
                              }
                          } catch (err) {
                              _didIteratorError14 = true;
                              _iteratorError14 = err;
                          } finally {
                              try {
                                  if (!_iteratorNormalCompletion14 && _iterator14.return) {
                                      _iterator14.return();
                                  }
                              } finally {
                                  if (_didIteratorError14) {
                                      throw _iteratorError14;
                                  }
                              }
                          }
                      }
                  }
              } catch (err) {
                  _didIteratorError13 = true;
                  _iteratorError13 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion13 && _iterator13.return) {
                          _iterator13.return();
                      }
                  } finally {
                      if (_didIteratorError13) {
                          throw _iteratorError13;
                      }
                  }
              }

              return this;
          }

          //  returns pitch

      }, {
          key: '_makeAccidentalForOnePitch',
          value: function _makeAccidentalForOnePitch(p, lastStepDict, lastOctavelessStepDict) {
              if (lastStepDict === undefined) {
                  // octave < 0 or > 10? -- error that appeared sometimes.
                  lastStepDict = {};
              }
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
                  var _iteratorNormalCompletion15 = true;
                  var _didIteratorError15 = false;
                  var _iteratorError15 = undefined;

                  try {
                      for (var _iterator15 = this[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                          var el = _step15.value;

                          if (el.isClassOrSubclass('Stream')) {
                              el.resetRenderOptions(recursive, preserveEvents);
                          }
                      }
                  } catch (err) {
                      _didIteratorError15 = true;
                      _iteratorError15 = err;
                  } finally {
                      try {
                          if (!_iteratorNormalCompletion15 && _iterator15.return) {
                              _iterator15.return();
                          }
                      } finally {
                          if (_didIteratorError15) {
                              throw _iteratorError15;
                          }
                      }
                  }
              }
              return this;
          }

          //  * *********  VexFlow functionality

      }, {
          key: 'renderVexflowOnCanvas',
          value: function renderVexflowOnCanvas(canvasOrSVG) {
              console.warn('renderVexflowOnCanvas is deprecated; call renderVexflow instead');
              return this.renderVexflow(canvasOrSVG);
          }

          /**
           * Uses {@link music21.vfShow.Renderer} to render Vexflow onto an
           * existing canvas or SVG object.
           *
           * Runs `this.setRenderInteraction` on the canvas.
           *
           * Will be moved to vfShow eventually when converter objects are enabled...maybe.
           *
           * @memberof music21.stream.Stream
           * @param {DOMObject|JQueryDOMObject} canvasOrSVG - a canvas or the div surrounding an SVG object
           * @returns {vfShow.Renderer}
           */

      }, {
          key: 'renderVexflow',
          value: function renderVexflow(canvasOrSVG) {
              if (canvasOrSVG.jquery) {
                  canvasOrSVG = canvasOrSVG[0];
              }
              var DOMContains = document.body.contains(canvasOrSVG);
              if (!DOMContains) {
                  // temporarily add to DOM so Firefox can measure it...
                  document.body.appendChild(canvasOrSVG);
              }

              var tagName = canvasOrSVG.tagName.toLowerCase();

              if (this.autoBeam === true) {
                  try {
                      this.makeBeams({ inPlace: true });
                  } catch (e) {
                      if (!e.toString().includes('Time Signature')) {
                          throw e;
                      }
                  }
              }
              var vfr = new vfShow.Renderer(this, canvasOrSVG);
              if (tagName === 'canvas') {
                  vfr.rendererType = 'canvas';
              } else if (tagName === 'svg') {
                  vfr.rendererType = 'svg';
              }
              vfr.render();
              this.setRenderInteraction(canvasOrSVG);
              this.activeVFRenderer = vfr;
              if (!DOMContains) {
                  // remove the adding to DOM so that Firefox could measure it...
                  document.body.removeChild(canvasOrSVG);
              }

              return vfr;
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
              if (systemPadding === undefined) {
                  systemPadding = 0;
              }
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
                  var _iteratorNormalCompletion16 = true;
                  var _didIteratorError16 = false;
                  var _iteratorError16 = undefined;

                  try {
                      for (var _iterator16 = this[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                          var v = _step16.value;

                          if (v.isClassOrSubclass('Stream')) {
                              var thisLength = v.estimateStaffLength() + v.renderOptions.staffPadding;
                              if (thisLength > maxLength) {
                                  maxLength = thisLength;
                              }
                          }
                      }
                  } catch (err) {
                      _didIteratorError16 = true;
                      _iteratorError16 = err;
                  } finally {
                      try {
                          if (!_iteratorNormalCompletion16 && _iterator16.return) {
                              _iterator16.return();
                          }
                      } finally {
                          if (_didIteratorError16) {
                              throw _iteratorError16;
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
              var startNoteIndex = params.startNote;
              var currentNoteIndex = 0;
              if (startNoteIndex !== undefined) {
                  currentNoteIndex = startNoteIndex;
              }
              var flatEls = this.flat.elements;
              var lastNoteIndex = flatEls.length - 1;
              this._stopPlaying = false;
              var thisStream = this;

              var playNext = function playNext(elements, params) {
                  if (currentNoteIndex <= lastNoteIndex && !thisStream._stopPlaying) {
                      var el = elements[currentNoteIndex];
                      var nextNote = void 0;
                      var playDuration = void 0;
                      if (currentNoteIndex < lastNoteIndex) {
                          nextNote = elements[currentNoteIndex + 1];
                          playDuration = nextNote.offset - el.offset;
                      } else {
                          playDuration = el.duration.quarterLength;
                      }
                      var milliseconds = playDuration * 1000 * 60 / params.tempo;
                      if (debug) {
                          console.log('playing: ', el, playDuration, milliseconds, params.tempo);
                      }

                      if (el.playMidi !== undefined) {
                          el.playMidi(params.tempo, nextNote, params);
                      }
                      currentNoteIndex += 1;
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
           * @returns {music21.stream.Stream} this
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
           *  SVG/Canvas DOM routines -- to be factored out eventually.
           *
           */

      }, {
          key: 'createNewCanvas',
          value: function createNewCanvas(width, height) {
              var elementType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'svg';

              console.warn('createNewCanvas is deprecated, use createNewDOM instead');
              return this.createNewDOM(width, height, elementType);
          }

          /**
           * Creates and returns a new `&lt;canvas&gt;` or `&lt;svg&gt;` object.
           *
           * Calls setSubstreamRenderOptions() first.
           *
           * Does not render on the DOM element.
           *
           * @memberof music21.stream.Stream
           * @param {number|string|undefined} width - will use `this.estimateStaffLength()` + `this.renderOptions.staffPadding` if not given
           * @param {number|string|undefined} height - if undefined will use `this.renderOptions.height`. If still undefined, will use `this.estimateStreamHeight()`
           * @param {string} elementType - what type of element, default = svg
           * @returns {JQueryDOMObject} svg in jquery.
           */

      }, {
          key: 'createNewDOM',
          value: function createNewDOM(width, height) {
              var elementType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'svg';

              if (this.hasSubStreams()) {
                  this.setSubstreamRenderOptions();
              }

              // we render SVG on a Div for Vexflow
              var renderElementType = 'div';
              if (elementType === 'canvas') {
                  renderElementType = 'canvas';
              }

              var $newCanvasOrDIV = $$1('<' + renderElementType + '/>');
              $newCanvasOrDIV.addClass('streamHolding'); // .css('border', '1px red solid');
              $newCanvasOrDIV.css('display', 'inline-block');

              if (width !== undefined) {
                  if (typeof width === 'string') {
                      width = common.stripPx(width);
                  }
                  $newCanvasOrDIV.attr('width', width);
              } else {
                  var computedWidth = this.estimateStaffLength() + this.renderOptions.staffPadding + 0;
                  $newCanvasOrDIV.attr('width', computedWidth);
              }
              if (height !== undefined) {
                  $newCanvasOrDIV.attr('height', height);
              } else {
                  var computedHeight = void 0;
                  if (this.renderOptions.height === undefined) {
                      computedHeight = this.estimateStreamHeight();
                      // console.log('computed Height estim: ' + computedHeight);
                  } else {
                      computedHeight = this.renderOptions.height;
                      // console.log('computed Height: ' + computedHeight);
                  }
                  $newCanvasOrDIV.attr('height', computedHeight * this.renderOptions.scaleFactor.y);
              }
              return $newCanvasOrDIV;
          }
      }, {
          key: 'createPlayableCanvas',
          value: function createPlayableCanvas(width, height) {
              var elementType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'svg';

              console.warn('createPlayableCanvas is deprecated, use createPlayableDOM instead');
              return this.createPlayableDOM(width, height, elementType);
          }

          /**
           * Creates a rendered, playable svg where clicking plays it.
           *
           * Called from appendNewDOM() etc.
           *
           * @memberof music21.stream.Stream
           * @param {number|string|undefined} width
           * @param {number|string|undefined} height
           * @param {string} elementType - what type of element, default = svg
           * @returns {JQueryDOMObject} canvas or svg
           */

      }, {
          key: 'createPlayableDOM',
          value: function createPlayableDOM(width, height) {
              var elementType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'svg';

              this.renderOptions.events.click = 'play';
              return this.createDOM(width, height, elementType);
          }
      }, {
          key: 'createCanvas',
          value: function createCanvas(width, height) {
              var elementType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'svg';

              console.warn('createCanvas is deprecated, use createDOM');
              return this.createDOM(width, height, elementType);
          }
          /**
           * Creates a new svg and renders vexflow on it
           *
           * @memberof music21.stream.Stream
           * @param {number|string|undefined} [width]
           * @param {number|string|undefined} [height]
           * @param {string} elementType - what type of element svg or canvas, default = svg
           * @returns {JQueryDOMObject} canvas or SVG
           */

      }, {
          key: 'createDOM',
          value: function createDOM(width, height) {
              var elementType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'svg';

              var $newSvg = this.createNewDOM(width, height, elementType);
              // temporarily append the SVG to the document to fix a Firefox bug
              // where nothing can be measured unless is it in the document.
              this.renderVexflow($newSvg);
              return $newSvg;
          }
      }, {
          key: 'appendNewCanvas',
          value: function appendNewCanvas(appendElement, width, height) {
              var elementType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'svg';

              console.warn('appendNewCanvas is deprecated, use appendNewDOM instead');
              return this.appendNewDOM(appendElement, width, height, elementType);
          }

          /**
           * Creates a new canvas, renders vexflow on it, and appends it to the DOM.
           *
           * @memberof music21.stream.Stream
           * @param {JQueryDOMObject|DOMObject} [appendElement=document.body] - where to place the svg
           * @param {number|string} [width]
           * @param {number|string} [height]
           * @param {string} elementType - what type of element, default = svg
           * @returns {DOMObject} svg (not the jQueryDOMObject -- this is a difference with other routines and should be fixed. TODO: FIX)
           *
           */

      }, {
          key: 'appendNewDOM',
          value: function appendNewDOM(appendElement, width, height) {
              var elementType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'svg';

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

              var svgOrCanvasBlock = this.createDOM(width, height, elementType);
              $appendElement.append(svgOrCanvasBlock);
              return svgOrCanvasBlock[0];
          }
      }, {
          key: 'replaceCanvas',
          value: function replaceCanvas(where, preserveSvgSize) {
              var elementType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'svg';

              console.warn('replaceCanvas is deprecated, use replaceDOM instead');
              return this.replaceDOM(where, preserveSvgSize, elementType);
          }

          /**
           * Replaces a particular Svg with a new rendering of one.
           *
           * Note that if 'where' is empty, will replace all svges on the page.
           *
           * @memberof music21.stream.Stream
           * @param {JQueryDOMObject|DOMObject} [where] - the canvas or SVG to replace or a container holding the canvas(es) to replace.
           * @param {Boolean} [preserveSvgSize=false]
           * @param {string} elementType - what type of element, default = svg
           * @returns {JQueryDOMObject} the svg
           */

      }, {
          key: 'replaceDOM',
          value: function replaceDOM(where, preserveSvgSize) {
              var elementType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'svg';

              // if called with no where, replaces all the svges on the page...
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
              var $oldSVGOrCanvas = void 0;

              if ($where.hasClass('streamHolding')) {
                  $oldSVGOrCanvas = $where;
              } else {
                  $oldSVGOrCanvas = $where.find('.streamHolding');
              }
              // TODO: Max Width!
              if ($oldSVGOrCanvas.length === 0) {
                  throw new Music21Exception('No svg defined for replaceDOM!');
              } else if ($oldSVGOrCanvas.length > 1) {
                  // change last svg...
                  // replacing each with svgBlock doesn't work
                  // anyhow, it just resizes the svg but doesn't
                  // draw.
                  $oldSVGOrCanvas = $$1($oldSVGOrCanvas[$oldSVGOrCanvas.length - 1]);
              }

              var svgBlock = void 0;
              if (preserveSvgSize) {
                  var width = $oldSVGOrCanvas.width() || parseInt($oldSVGOrCanvas.attr('width'));
                  var height = $oldSVGOrCanvas.attr('height'); // height manipulates
                  svgBlock = this.createDOM(width, height, elementType);
              } else {
                  svgBlock = this.createDOM(undefined, undefined, elementType);
              }

              $oldSVGOrCanvas.replaceWith(svgBlock);
              return svgBlock;
          }

          /**
           * Set the type of interaction on the svg based on
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
              var _this3 = this;

              var $svg = canvasOrDiv;
              if (canvasOrDiv === undefined) {
                  return this;
              } else if (canvasOrDiv.jquery === undefined) {
                  $svg = $$1(canvasOrDiv);
              }
              var playFunc = function playFunc() {
                  _this3.playStream();
              };

              $$1.each(this.renderOptions.events, $$1.proxy(function setRenderInteractionProxy(eventType, eventFunction) {
                  $svg.off(eventType);
                  if (typeof eventFunction === 'string' && eventFunction === 'play') {
                      $svg.on(eventType, playFunc);
                  } else if (typeof eventFunction === 'string' && eventType === 'resize' && eventFunction === 'reflow') {
                      this.windowReflowStart($svg);
                  } else if (eventFunction !== undefined) {
                      $svg.on(eventType, eventFunction);
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
      }, {
          key: 'getUnscaledXYforCanvas',
          value: function getUnscaledXYforCanvas(svg, e) {
              console.warn('getUnscaledXYforCanvas is deprecated, use getUnscaledXYforDOM instead');
              return this.getUnscaledXYforDOM(svg, e);
          }

          /**
           * Given a mouse click, or other event with .pageX and .pageY,
           * find the x and y for the svg.
           *
           * @memberof music21.stream.Stream
           * @param {DOMObject} svg - a canvas or SVG object
           * @param {Event} e
           * @returns {Array<number>} two-elements, [x, y] in pixels.
           */

      }, {
          key: 'getUnscaledXYforDOM',
          value: function getUnscaledXYforDOM(svg, e) {
              var offset = null;
              if (svg === undefined) {
                  offset = { left: 0, top: 0 };
              } else {
                  offset = $$1(svg).offset();
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
      }, {
          key: 'getScaledXYforCanvas',
          value: function getScaledXYforCanvas(svg, e) {
              console.warn('getScaledXYforCanvas is deprecated, use getScaledXYforDOM instead');
              return this.getScaledXYforDOM(svg, e);
          }

          /**
           * return a list of [scaledX, scaledY] for
           * a svg element.
           *
           * xScaled refers to 1/scaleFactor.x -- for instance, scaleFactor.x = 0.7 (default)
           * x of 1 gives 1.42857...
           *
           * @memberof music21.stream.Stream
           * @param {DOMObject} svg -- a canvas or SVG object
           * @param {Event} e
           * @returns {Array<number>} [scaledX, scaledY]
           */

      }, {
          key: 'getScaledXYforDOM',
          value: function getScaledXYforDOM(svg, e) {
              var _getUnscaledXYforDOM = this.getUnscaledXYforDOM(svg, e),
                  _getUnscaledXYforDOM2 = slicedToArray(_getUnscaledXYforDOM, 2),
                  xPx = _getUnscaledXYforDOM2[0],
                  yPx = _getUnscaledXYforDOM2[1];

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
           * Returns the stream that is at X location xPxScaled and system systemIndex.
           *
           * Override in subclasses, always returns this; here.
           *
           * @memberof music21.stream.Stream
           * @param {number} [xPxScaled]
           * @param {number} [allowablePixels=10]
           * @param {number} [systemIndex]
           * @returns {music21.stream.Stream}
           *
           */

      }, {
          key: 'getStreamFromScaledXandSystemIndex',
          value: function getStreamFromScaledXandSystemIndex(xPxScaled, systemIndex) {
              return this;
          }

          /**
           *
           * Return the note at pixel X (or within allowablePixels [default 10])
           * of the note.
           *
           * systemIndex element is not used on bare Stream
           *
           * options can be a dictionary of: 'allowBackup' which gets the closest
           * note within the window even if it's beyond allowablePixels (default: true)
           * and 'backupMaximum' which specifies a maximum distance even for backup
           * (default: 70);
           *
           * @memberof music21.stream.Stream
           * @param {number} xPxScaled
           * @param {number} [allowablePixels=10]
           * @param {number} [systemIndex]
           * @param {object} [options]
           * @returns {music21.base.Music21Object|undefined}
           */

      }, {
          key: 'noteElementFromScaledX',
          value: function noteElementFromScaledX(xPxScaled, allowablePixels, systemIndex, options) {
              var params = {
                  allowBackup: true,
                  backupMaximum: 70
              };
              common.merge(params, options);
              var foundNote = void 0;
              if (allowablePixels === undefined) {
                  allowablePixels = 10;
              }
              var subStream = this.getStreamFromScaledXandSystemIndex(xPxScaled, systemIndex);
              if (subStream === undefined) {
                  return undefined;
              }
              var backup = {
                  minDistanceSoFar: params.backupMaximum,
                  note: undefined
              }; // a backup in case we did not find within allowablePixels

              var _iteratorNormalCompletion17 = true;
              var _didIteratorError17 = false;
              var _iteratorError17 = undefined;

              try {
                  for (var _iterator17 = subStream.flat.notesAndRests.elements[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                      var n = _step17.value;

                      /* should also
                       * compensate for accidentals...
                       */
                      var leftDistance = Math.abs(n.x - xPxScaled);
                      var rightDistance = Math.abs(n.x + n.width - xPxScaled);
                      var minDistance = Math.min(leftDistance, rightDistance);

                      if (leftDistance < allowablePixels && rightDistance < allowablePixels) {
                          foundNote = n;
                          break; /* O(n); can be made O(log n) */
                      } else if (leftDistance < params.backupMaximum && rightDistance < params.backupMaximum && minDistance < backup.minDistanceSoFar) {
                          backup.note = n;
                          backup.minDistanceSoFar = minDistance;
                      }
                  }
                  // console.log('note here is: ', foundNote);
              } catch (err) {
                  _didIteratorError17 = true;
                  _iteratorError17 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion17 && _iterator17.return) {
                          _iterator17.return();
                      }
                  } finally {
                      if (_didIteratorError17) {
                          throw _iteratorError17;
                      }
                  }
              }

              if (params.allowBackup && foundNote === undefined) {
                  foundNote = backup.note;
                  // console.log('used backup: closest was: ', backup.minDistanceSoFar);
              }
              // console.log(foundNote);
              return foundNote;
          }

          /**
           * Given an event object, and an x and y location, returns a two-element array
           * of the pitch.Pitch.diatonicNoteNum that was clicked (i.e., if C4 was clicked this
           * will return 29; if D4 was clicked this will return 30) and the closest note in the
           * stream that was clicked.
           *
           * Return a list of [diatonicNoteNum, closestXNote]
           * for an event (e) called on the svg (svg)
           *
           * @memberof music21.stream.Stream
           * @param {DOMObject} svg
           * @param {Event} e
           * @param {number} x
           * @param {number} y
           * @returns {Array} [diatonicNoteNum, closestXNote]
           */

      }, {
          key: 'findNoteForClick',
          value: function findNoteForClick(svg, e, x, y) {
              if (x === undefined || y === undefined) {
                  var _getScaledXYforDOM = this.getScaledXYforDOM(svg, e);

                  var _getScaledXYforDOM2 = slicedToArray(_getScaledXYforDOM, 2);

                  x = _getScaledXYforDOM2[0];
                  y = _getScaledXYforDOM2[1];
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
           * @param {DOMObject} svg
           * @returns {any} output of changedCallbackFunction
           */

      }, {
          key: 'noteChanged',
          value: function noteChanged(clickedDiatonicNoteNum, foundNote, svg) {
              var n = foundNote;
              var p = new pitch.Pitch('C');
              p.diatonicNoteNum = clickedDiatonicNoteNum;
              p.accidental = n.pitch.accidental;
              n.pitch = p;
              n.stemDirection = undefined;
              this.activeNote = n;
              var $newSvg = this.redrawDOM(svg);
              var params = { foundNote: n, svg: $newSvg };
              if (this.changedCallbackFunction !== undefined) {
                  return this.changedCallbackFunction(params);
              } else {
                  return params;
              }
          }
      }, {
          key: 'redrawCanvas',
          value: function redrawCanvas(svg) {
              console.warn('redrawCanvas is deprecated, use redrawDOM instead');
              return this.redrawDOM(svg);
          }

          /**
           * Redraws an svgDiv, keeping the events of the previous svg.
           *
           * @memberof music21.stream.Stream
           * @param {DOMObject} svg
           * @returns {music21.stream.Stream} this
           */

      }, {
          key: 'redrawDOM',
          value: function redrawDOM(svg) {
              // this.resetRenderOptions(true, true); // recursive, preserveEvents
              // this.setSubstreamRenderOptions();
              var $svg = $$1(svg); // works even if svg is already $jquery
              var $newSvg = this.createNewDOM(svg.width, svg.height);
              this.renderVexflow($newSvg);
              $svg.replaceWith($newSvg);
              // this is no longer necessary.
              // common.jQueryEventCopy($.event, $svg, $newCanv); /* copy events -- using custom extension... */
              return $newSvg;
          }
      }, {
          key: 'editableAccidentalCanvas',
          value: function editableAccidentalCanvas(width, height) {
              console.warn('editableAccidentalCanvas is deprecated, use editableAccidentalDOM instead');
              return this.editableAccidentalDOM(width, height);
          }

          /**
           * Renders a stream on svg with the ability to edit it and
           * a toolbar that allows the accidentals to be edited.
           *
           * @memberof music21.stream.Stream
           * @param {number} [width]
           * @param {number} [height]
           * @returns {DOMObject} &lt;div&gt; tag around the svg.
           */

      }, {
          key: 'editableAccidentalDOM',
          value: function editableAccidentalDOM(width, height) {
              /*
               * Create an editable svg with an accidental selection bar.
               */
              var d = $$1('<div/>').css('text-align', 'left').css('position', 'relative');

              this.renderOptions.events.click = this.DOMChangerFunction;
              var $svgDiv = this.createDOM(width, height);
              var buttonDiv = this.getAccidentalToolbar(undefined, undefined, $svgDiv);
              d.append(buttonDiv);
              d.append($$1("<br clear='all'/>"));
              d.append($svgDiv);
              return d;
          }

          /*
           * SVG toolbars...
           */

          /**
           *
           * @memberof music21.stream.Stream
           * @param {Int} minAccidental - alter of the min accidental (default -1)
           * @param {Int} maxAccidental - alter of the max accidental (default 1)
           * @param {jQueryObject} $siblingSvg - svg to use for redrawing;
           * @returns {jQueryObject} the accidental toolbar.
           */

      }, {
          key: 'getAccidentalToolbar',
          value: function getAccidentalToolbar(minAccidental, maxAccidental, $siblingSvg) {
              var _this4 = this;

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
                  var $useSvg = $siblingSvg;
                  if ($useSvg === undefined) {
                      var $searchParent = $$1(clickEvent.target).parent();
                      var maxSearch = 99;
                      while (maxSearch > 0 && $searchParent !== undefined && ($useSvg === undefined || $useSvg[0] === undefined)) {
                          maxSearch -= 1;
                          $useSvg = $searchParent.find('.streamHolding');
                          $searchParent = $searchParent.parent();
                      }
                      if ($useSvg[0] === undefined) {
                          console.log('Could not find a svg...');
                          return;
                      }
                  }
                  if (_this4.activeNote !== undefined) {
                      var n = _this4.activeNote;
                      n.pitch.accidental = new pitch.Accidental(newAlter);
                      /* console.log(n.pitch.name); */
                      var $newSvg = _this4.redrawDOM($useSvg[0]);
                      if (_this4.changedCallbackFunction !== undefined) {
                          _this4.changedCallbackFunction({
                              foundNote: n,
                              svg: $newSvg
                          });
                      }
                  }
              };

              var $buttonDiv = $$1('<div/>').attr('class', 'accidentalToolbar scoreToolbar');

              var _loop = function _loop(i) {
                  var acc = new pitch.Accidental(i);
                  var $button = $$1('<button>' + acc.unicodeModifier + '</button>').click(function (e) {
                      return addAccidental(i, e);
                  });
                  if (Math.abs(i) > 1) {
                      $button.css('font-family', 'Bravura Text');
                      $button.css('font-size', '20px');
                  }
                  $buttonDiv.append($button);
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
              var _this5 = this;

              var $buttonDiv = $$1('<div/>').attr('class', 'playToolbar scoreToolbar');
              var $bPlay = $$1('<button>&#9658</button>');
              $bPlay.click(function () {
                  _this5.playStream();
              });
              $buttonDiv.append($bPlay);
              var $bStop = $$1('<button>&#9724</button>');
              $bStop.click(function () {
                  _this5.stopPlayStream();
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
           * @param {JQueryDOMObject} jSvg
           * @returns {music21.stream.Stream} this
           */

      }, {
          key: 'windowReflowStart',
          value: function windowReflowStart(jSvg) {
              // set up a bunch of windowReflow bindings that affect the svg.
              var callingStream = this;
              var jSvgNow = jSvg;
              $$1(window).bind('resizeEnd', function () {
                  // do something, window hasn't changed size in 500ms
                  var jSvgParent = jSvgNow.parent();
                  var newWidth = jSvgParent.width();
                  var svgWidth = newWidth;
                  // console.log(svgWidth);
                  console.log('resizeEnd triggered', newWidth);
                  // console.log(callingStream.renderOptions.events.click);
                  callingStream.resetRenderOptions(true, true); // recursive, preserveEvents
                  // console.log(callingStream.renderOptions.events.click);
                  callingStream.maxSystemWidth = svgWidth - 40;
                  jSvgNow.remove();
                  var svgObj = callingStream.appendNewDOM(jSvgParent);
                  jSvgNow = $$1(svgObj);
              });
              $$1(window).resize(function resizeSvgTo() {
                  if (this.resizeTO) {
                      clearTimeout(this.resizeTO);
                  }
                  this.resizeTO = setTimeout(function resizeToTimeout() {
                      $$1(this).trigger('resizeEnd');
                  }, 200);
              });
              setTimeout(function triggerResizeOnCreateSvg() {
                  var $window = $$1(window);
                  var doResize = $window.data('triggerResizeOnCreateSvg');
                  if (doResize === undefined || doResize === true) {
                      $$1(this).trigger('resizeEnd');
                      $window.data('triggerResizeOnCreateSvg', false);
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
              var _iteratorNormalCompletion18 = true;
              var _didIteratorError18 = false;
              var _iteratorError18 = undefined;

              try {
                  for (var _iterator18 = this[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                      var el = _step18.value;

                      if (el.isClassOrSubclass('Voice')) {
                          return true;
                      }
                  }
              } catch (err) {
                  _didIteratorError18 = true;
                  _iteratorError18 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion18 && _iterator18.return) {
                          _iterator18.return();
                      }
                  } finally {
                      if (_didIteratorError18) {
                          throw _iteratorError18;
                      }
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
              var _iteratorNormalCompletion19 = true;
              var _didIteratorError19 = false;
              var _iteratorError19 = undefined;

              try {
                  for (var _iterator19 = this[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                      var el = _step19.value;

                      var endTime = el.offset;
                      if (el.duration !== undefined) {
                          endTime += el.duration.quarterLength;
                      }
                      if (endTime > highestTime) {
                          highestTime = endTime;
                      }
                  }
              } catch (err) {
                  _didIteratorError19 = true;
                  _iteratorError19 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion19 && _iterator19.return) {
                          _iterator19.return();
                      }
                  } finally {
                      if (_didIteratorError19) {
                          throw _iteratorError19;
                      }
                  }
              }

              return highestTime;
          }
      }, {
          key: 'semiFlat',
          get: function get() {
              return this._getFlatOrSemiFlat(true);
          }
      }, {
          key: 'flat',
          get: function get() {
              return this._getFlatOrSemiFlat(false);
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
              return this.getElementsByClass('Part');
          }
      }, {
          key: 'measures',
          get: function get() {
              return this.getElementsByClass('Measure');
          }
      }, {
          key: 'voices',
          get: function get() {
              return this.getElementsByClass('Voice');
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

          var _this6 = possibleConstructorReturn(this, (Voice.__proto__ || Object.getPrototypeOf(Voice)).call(this));

          _this6.recursionType = 'elementsFirst';
          return _this6;
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

          var _this7 = possibleConstructorReturn(this, (Measure.__proto__ || Object.getPrototypeOf(Measure)).call(this));

          _this7.recursionType = 'elementsFirst';
          _this7.isMeasure = true;
          _this7.number = 0; // measure number
          return _this7;
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

          var _this8 = possibleConstructorReturn(this, (Part.__proto__ || Object.getPrototypeOf(Part)).call(this));

          _this8.recursionType = 'flatten';
          _this8.systemHeight = _this8.renderOptions.naiveHeight;
          return _this8;
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
              var _iteratorNormalCompletion20 = true;
              var _didIteratorError20 = false;
              var _iteratorError20 = undefined;

              try {
                  for (var _iterator20 = this[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                      var el = _step20.value;

                      if (el.isClassOrSubclass('Measure')) {
                          var elRendOp = el.renderOptions;
                          measureWidths[elRendOp.measureIndex] = elRendOp.width;
                      }
                  }
                  /* console.log(measureWidths);
                   *
                   */
              } catch (err) {
                  _didIteratorError20 = true;
                  _iteratorError20 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion20 && _iterator20.return) {
                          _iterator20.return();
                      }
                  } finally {
                      if (_didIteratorError20) {
                          throw _iteratorError20;
                      }
                  }
              }

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
                  var isFirst = true;
                  var _iteratorNormalCompletion21 = true;
                  var _didIteratorError21 = false;
                  var _iteratorError21 = undefined;

                  try {
                      for (var _iterator21 = this.getElementsByClass('Measure')[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
                          var m = _step21.value;

                          // this looks wrong, but actually seems to be right. moving it to
                          // after the break breaks things.
                          totalLength += m.estimateStaffLength() + m.renderOptions.staffPadding;
                          if (!isFirst && m.renderOptions.startNewSystem === true) {
                              break;
                          }
                          isFirst = false;
                      }
                  } catch (err) {
                      _didIteratorError21 = true;
                      _iteratorError21 = err;
                  } finally {
                      try {
                          if (!_iteratorNormalCompletion21 && _iterator21.return) {
                              _iterator21.return();
                          }
                      } finally {
                          if (_didIteratorError21) {
                              throw _iteratorError21;
                          }
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

              var _iteratorNormalCompletion22 = true;
              var _didIteratorError22 = false;
              var _iteratorError22 = undefined;

              try {
                  for (var _iterator22 = this[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
                      var el = _step22.value;

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
              } catch (err) {
                  _didIteratorError22 = true;
                  _iteratorError22 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion22 && _iterator22.return) {
                          _iterator22.return();
                      }
                  } finally {
                      if (_didIteratorError22) {
                          throw _iteratorError22;
                      }
                  }
              }

              return this;
          }

          /**
           * systemIndexAndScaledY - given a scaled Y, return the systemIndex
           * and the scaledYRelativeToSystem
           *
           * @memberof music21.stream.Part
           * @param  {number} y the scaled Y
           * @return Array<int, number>   systemIndex, scaledYRelativeToSystem
           */

      }, {
          key: 'systemIndexAndScaledY',
          value: function systemIndexAndScaledY(y) {
              var systemPadding = this.renderOptions.systemPadding;
              if (systemPadding === undefined) {
                  systemPadding = this.renderOptions.naiveSystemPadding;
              }
              var systemIndex = Math.floor(y / (this.systemHeight + systemPadding));
              var scaledYRelativeToSystem = y - systemIndex * (this.systemHeight + systemPadding);
              return [systemIndex, scaledYRelativeToSystem];
          }

          /**
           * Overrides the default music21.stream.Stream#findNoteForClick
           * by taking into account systems
           *
           * @memberof music21.stream.Part
           * @param {DOMObject} svg
           * @param {Event} e
           * @returns {Array} [clickedDiatonicNoteNum, foundNote]
           */

      }, {
          key: 'findNoteForClick',
          value: function findNoteForClick(svg, e) {
              var _getScaledXYforDOM3 = this.getScaledXYforDOM(svg, e),
                  _getScaledXYforDOM4 = slicedToArray(_getScaledXYforDOM3, 2),
                  x = _getScaledXYforDOM4[0],
                  y = _getScaledXYforDOM4[1];

              // debug = true;


              if (debug) {
                  console.log('this.estimateStreamHeight(): ' + this.estimateStreamHeight() + ' / $(svg).height(): ' + $$1(svg).height());
              }
              var systemPadding = this.renderOptions.systemPadding;
              if (systemPadding === undefined) {
                  systemPadding = this.renderOptions.naiveSystemPadding;
              }

              var _systemIndexAndScaled = this.systemIndexAndScaledY(y),
                  _systemIndexAndScaled2 = slicedToArray(_systemIndexAndScaled, 2),
                  systemIndex = _systemIndexAndScaled2[0],
                  scaledYRelativeToSystem = _systemIndexAndScaled2[1];

              var clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(scaledYRelativeToSystem);

              var foundNote = this.noteElementFromScaledX(x, undefined, systemIndex);
              return [clickedDiatonicNoteNum, foundNote];
          }

          /**
           * Returns the measure that is at X location xPxScaled and system systemIndex.
           *
           * @memberof music21.stream.Part
           * @param {number} [xPxScaled]
           * @param {number} [systemIndex]
           * @returns {music21.stream.Stream}
           *
           */

      }, {
          key: 'getStreamFromScaledXandSystemIndex',
          value: function getStreamFromScaledXandSystemIndex(xPxScaled, systemIndex) {
              var gotMeasure = void 0;
              var measures = this.measures;
              var _iteratorNormalCompletion23 = true;
              var _didIteratorError23 = false;
              var _iteratorError23 = undefined;

              try {
                  for (var _iterator23 = measures[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
                      var m = _step23.value;

                      var rendOp = m.renderOptions;
                      var left = rendOp.left;
                      var right = left + rendOp.width;
                      var top = rendOp.top;
                      var bottom = top + rendOp.height;
                      if (debug) {
                          console.log('Searching for X:' + Math.round(xPxScaled) + ' in Measure ' + ' with boundaries L:' + left + ' R:' + right + ' T: ' + top + ' B: ' + bottom);
                      }
                      if (xPxScaled >= left && xPxScaled <= right) {
                          if (systemIndex === undefined) {
                              gotMeasure = m;
                              break;
                          } else if (rendOp.systemIndex === systemIndex) {
                              gotMeasure = m;
                              break;
                          }
                      }
                  }
              } catch (err) {
                  _didIteratorError23 = true;
                  _iteratorError23 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion23 && _iterator23.return) {
                          _iterator23.return();
                      }
                  } finally {
                      if (_didIteratorError23) {
                          throw _iteratorError23;
                      }
                  }
              }

              return gotMeasure;
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

          var _this9 = possibleConstructorReturn(this, (Score.__proto__ || Object.getPrototypeOf(Score)).call(this));

          _this9.recursionType = 'elementsOnly';
          _this9.measureWidths = [];
          _this9.partSpacing = _this9.renderOptions.naiveHeight;
          return _this9;
      }

      createClass(Score, [{
          key: 'getStreamFromScaledXandSystemIndex',


          /**
           * Returns the measure that is at X location xPxScaled and system systemIndex.
           *
           * Always returns the measure of the top part...
           *
           * @memberof music21.stream.Score
           * @param {number} [xPxScaled]
           * @param {number} [systemIndex]
           * @returns {music21.stream.Stream} usually a Measure
           *
           */
          value: function getStreamFromScaledXandSystemIndex(xPxScaled, systemIndex) {
              var parts = this.parts;
              return parts.get(0).getStreamFromScaledXandSystemIndex(xPxScaled, systemIndex);
          }
          /**
           * overrides music21.stream.Stream#setSubstreamRenderOptions
           *
           * figures out the `.left` and `.top` attributes for all contained parts
           *
           * @memberof music21.stream.Score
           * @returns {music21.stream.Score} this
           */

      }, {
          key: 'setSubstreamRenderOptions',
          value: function setSubstreamRenderOptions() {
              var currentPartNumber = 0;
              var currentPartTop = 0;
              var partSpacing = this.partSpacing;
              var _iteratorNormalCompletion24 = true;
              var _didIteratorError24 = false;
              var _iteratorError24 = undefined;

              try {
                  for (var _iterator24 = this[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
                      var el = _step24.value;

                      if (el.isClassOrSubclass('Part')) {
                          el.renderOptions.partIndex = currentPartNumber;
                          el.renderOptions.top = currentPartTop;
                          el.setSubstreamRenderOptions();
                          currentPartTop += partSpacing;
                          currentPartNumber += 1;
                      }
                  }
              } catch (err) {
                  _didIteratorError24 = true;
                  _iteratorError24 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion24 && _iterator24.return) {
                          _iterator24.return();
                      }
                  } finally {
                      if (_didIteratorError24) {
                          throw _iteratorError24;
                      }
                  }
              }

              this.evenPartMeasureSpacing();
              var ignoreNumSystems = true;
              var currentScoreHeight = this.estimateStreamHeight(ignoreNumSystems);
              var _iteratorNormalCompletion25 = true;
              var _didIteratorError25 = false;
              var _iteratorError25 = undefined;

              try {
                  for (var _iterator25 = this[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
                      var _el2 = _step25.value;

                      if (_el2.isClassOrSubclass('Part')) {
                          _el2.fixSystemInformation(currentScoreHeight);
                      }
                  }
              } catch (err) {
                  _didIteratorError25 = true;
                  _iteratorError25 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion25 && _iterator25.return) {
                          _iterator25.return();
                      }
                  } finally {
                      if (_didIteratorError25) {
                          throw _iteratorError25;
                      }
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
              var _iteratorNormalCompletion26 = true;
              var _didIteratorError26 = false;
              var _iteratorError26 = undefined;

              try {
                  for (var _iterator26 = this[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
                      var p = _step26.value;

                      if (p.isClassOrSubclass('Part')) {
                          return p.estimateStaffLength();
                      }
                  }
                  // no parts found in score... use part...
              } catch (err) {
                  _didIteratorError26 = true;
                  _iteratorError26 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion26 && _iterator26.return) {
                          _iterator26.return();
                      }
                  } finally {
                      if (_didIteratorError26) {
                          throw _iteratorError26;
                      }
                  }
              }

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
              var _iteratorNormalCompletion27 = true;
              var _didIteratorError27 = false;
              var _iteratorError27 = undefined;

              try {
                  for (var _iterator27 = this[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
                      var el = _step27.value;

                      if (el.isClassOrSubclass('Part')) {
                          el.playStream(params);
                      }
                  }
              } catch (err) {
                  _didIteratorError27 = true;
                  _iteratorError27 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion27 && _iterator27.return) {
                          _iterator27.return();
                      }
                  } finally {
                      if (_didIteratorError27) {
                          throw _iteratorError27;
                      }
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
              var _iteratorNormalCompletion28 = true;
              var _didIteratorError28 = false;
              var _iteratorError28 = undefined;

              try {
                  for (var _iterator28 = this[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
                      var el = _step28.value;

                      if (el.isClassOrSubclass('Part')) {
                          el.stopPlayStream();
                      }
                  }
              } catch (err) {
                  _didIteratorError28 = true;
                  _iteratorError28 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion28 && _iterator28.return) {
                          _iterator28.return();
                      }
                  } finally {
                      if (_didIteratorError28) {
                          throw _iteratorError28;
                      }
                  }
              }

              return this;
          }
          /*
           * Svg routines
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
           * @returns Array<number>
           */

      }, {
          key: 'getMaxMeasureWidths',
          value: function getMaxMeasureWidths() {
              var maxMeasureWidths = [];
              var measureWidthsArrayOfArrays = [];
              var i = void 0;
              // TODO: Do not crash on not partlike...
              var _iteratorNormalCompletion29 = true;
              var _didIteratorError29 = false;
              var _iteratorError29 = undefined;

              try {
                  for (var _iterator29 = this[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
                      var el = _step29.value;

                      measureWidthsArrayOfArrays.push(el.getMeasureWidths());
                  }
              } catch (err) {
                  _didIteratorError29 = true;
                  _iteratorError29 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion29 && _iterator29.return) {
                          _iterator29.return();
                      }
                  } finally {
                      if (_didIteratorError29) {
                          throw _iteratorError29;
                      }
                  }
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
           * systemIndexAndScaledY - given a scaled Y, return the systemIndex
           * and the scaledYRelativeToSystem
           *
           * @memberof music21.stream.Score
           * @param  {number} y the scaled Y
           * @return Array<int, number>   systemIndex, scaledYRelativeToSystem
           */

      }, {
          key: 'systemIndexAndScaledY',
          value: function systemIndexAndScaledY(y) {
              var systemPadding = this.renderOptions.systemPadding;
              if (systemPadding === undefined) {
                  systemPadding = this.renderOptions.naiveSystemPadding;
              }

              var numParts = this.parts.length;
              var systemHeight = numParts * this.partSpacing + this.systemPadding;
              var systemIndex = Math.floor(y / systemHeight);
              var scaledYRelativeToSystem = y - systemIndex * systemHeight;
              return [systemIndex, scaledYRelativeToSystem];
          }

          /**
           * Returns a list of [clickedDiatonicNoteNum, foundNote] for a
           * click event, taking into account that the note will be in different
           * Part objects (and different Systems) given the height and possibly different Systems.
           *
           * @memberof music21.stream.Score
           * @param {DOMObject} svg
           * @param {Event} e
           * @returns {Array} [diatonicNoteNum, m21Element]
           */

      }, {
          key: 'findNoteForClick',
          value: function findNoteForClick(svg, e) {
              var _getScaledXYforDOM5 = this.getScaledXYforDOM(svg, e),
                  _getScaledXYforDOM6 = slicedToArray(_getScaledXYforDOM5, 2),
                  x = _getScaledXYforDOM6[0],
                  y = _getScaledXYforDOM6[1];

              var _systemIndexAndScaled3 = this.systemIndexAndScaledY(y),
                  _systemIndexAndScaled4 = slicedToArray(_systemIndexAndScaled3, 2),
                  systemIndex = _systemIndexAndScaled4[0],
                  scaledYFromSystemTop = _systemIndexAndScaled4[1];

              var partIndex = Math.floor(scaledYFromSystemTop / this.partSpacing);
              var scaledYinPart = scaledYFromSystemTop - partIndex * this.partSpacing;
              // console.log('systemIndex: ' + systemIndex + " partIndex: " + partIndex);
              var rightPart = this.get(partIndex);
              if (rightPart === undefined) {
                  return [undefined, undefined]; // may be too low?
              }

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
              var j = void 0;
              var _iteratorNormalCompletion30 = true;
              var _didIteratorError30 = false;
              var _iteratorError30 = undefined;

              try {
                  for (var _iterator30 = this[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
                      var el = _step30.value;

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
              } catch (err) {
                  _didIteratorError30 = true;
                  _iteratorError30 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion30 && _iterator30.return) {
                          _iterator30.return();
                      }
                  } finally {
                      if (_didIteratorError30) {
                          throw _iteratorError30;
                      }
                  }
              }

              var currentLeft = 20;
              for (var i = 0; i < maxMeasureWidth.length; i++) {
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
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/tie -- ties!
   *
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
   *
   */

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
  tie.Tie = Tie;

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
              time: 'handleTimeSignature',
              clef: 'handleClef',
              key: 'handleKeySignature'
              // 'staff-details': 'handleStaffDetails',
              // 'measure-style': 'handleMeasureStyle',
          };
          this.musicDataMethods = {
              note: 'xmlToNote',
              // 'backup': 'xmlBackup',
              // 'forward': 'xmlForward',
              // 'direction': 'xmlDirection',
              attributes: 'parseAttributesTag'
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
              var t = new tie.Tie();
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
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
   *
   */
  // import { debug } from './debug.js';
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
   * @requires music21/common
   * @requires music21/figuredBass
   * @requires music21/harmony
   * @requires music21/key
   * @requires music21/pitch
   * @requires music21/interval
   */
  var roman = {};

  roman.figureShorthands = {
      '53': '',
      '3': '',
      '63': '6',
      '753': '7',
      '75': '7', // controversial perhaps
      '73': '7', // controversial perhaps
      '9753': '9',
      '975': '9', // controversial perhaps
      '953': '9', // controversial perhaps
      '97': '9', // controversial perhaps
      '95': '9', // controversial perhaps
      '93': '9', // controversial perhaps
      '653': '65',
      '6b53': '6b5',
      '643': '43',
      '642': '42',
      bb7b5b3: 'o7',
      bb7b53: 'o7',
      // '6b5bb3': 'o65',
      b7b5b3: '/o7'
  };

  roman.functionalityScores = {
      I: 100,
      i: 90,
      V7: 80,
      V: 70,
      V65: 68,
      I6: 65,
      V6: 63,
      V43: 61,
      I64: 60,
      IV: 59,
      i6: 58,
      viio7: 57,
      V42: 55,
      viio65: 53,
      viio6: 52,
      '#viio65': 51,
      ii: 50,
      '#viio6': 49,
      ii65: 48,
      ii43: 47,
      ii42: 46,
      IV6: 45,
      ii6: 43,
      VI: 42,
      '#VI': 41,
      vi: 40,
      viio: 39,
      '#viio': 39,
      iio: 37, // common in Minor
      iio42: 36,
      bII6: 35, // Neapolitan
      iio43: 32,
      iio65: 31,
      '#vio': 28,
      '#vio6': 28,
      III: 22,
      v: 20,
      VII: 19,
      VII7: 18,
      IV65: 17,
      IV7: 16,
      iii: 15,
      iii6: 12,
      vi6: 10
  };

  /**
   * expandShortHand - expand a string of numbers into an array
   *
   * N.B. this is NOT where abbreviations get expanded
   *
   * @memberof music21.roman
   * @param  {string} shorthand string of a figure w/o roman to parse
   * @return {Array<string>}           array of shorthands
   */

  roman.expandShortHand = function expandShortHand(shorthand) {
      shorthand = shorthand.replace('/', '');
      if (shorthand.match(/[b-]$/)) {
          shorthand += '3';
      }
      shorthand = shorthand.replace('11', 'x');
      shorthand = shorthand.replace('13', 'y');
      shorthand = shorthand.replace('15', 'z');
      var rx = new RegExp('#*-*b*o*[1-9xyz]', 'g');
      var shorthandGroups = [];
      var match = rx.exec(shorthand);
      while (match !== null) {
          shorthandGroups.push(match[0]);
          match = rx.exec(shorthand);
      }
      if (shorthandGroups.length === 1 && shorthandGroups[0].endsWith('3')) {
          shorthandGroups = ['5', shorthandGroups[0]];
      }
      var shGroupOut = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
          for (var _iterator = shorthandGroups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var sh = _step.value;

              sh = sh.replace('x', '11');
              sh = sh.replace('y', '13');
              sh = sh.replace('z', '15');
              shGroupOut.push(sh);
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

      return shGroupOut;
  };

  /**
   * correctSuffixForChordQuality - Correct a given inversionString suffix given a
   *     chord of various qualities.
   *
   * @memberof music21.roman
   * @param  {music21.chord.Chord} chordObj
   * @param  {string} inversionString a string like '6' to fix.
   * @return {string}           corrected inversionString
    */

  roman.correctSuffixForChordQuality = function correctSuffixForChordQuality(chordObj, inversionString) {
      var fifthType = chordObj.semitonesFromChordStep(5);
      var qualityName = '';
      if (fifthType === 6) {
          qualityName = 'o';
      } else if (fifthType === 8) {
          qualityName = '+';
      }

      if (inversionString !== undefined && (inversionString.startsWith('o') || inversionString.startsWith('/o'))) {
          if (qualityName === 'o') {
              // don't call viio7, viioo7.
              qualityName = '';
          }
      }

      var seventhType = chordObj.semitonesFromChordStep(7);
      if (seventhType !== undefined && fifthType === 6) {
          // there is a seventh and this is a diminished 5
          if (seventhType === 10 && qualityName === 'o') {
              qualityName = '/o';
          } else if (seventhType !== 9) {
              // do something for very odd chords built on diminished triad.
          }
      }
      return qualityName + inversionString;
  };

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
  var RomanNumeral = function (_harmony$Harmony) {
      inherits(RomanNumeral, _harmony$Harmony);

      function RomanNumeral() {
          var figure = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          var keyStr = arguments[1];
          var keywords = arguments[2];
          classCallCheck(this, RomanNumeral);

          var params = { updatePitches: false, parseFigure: false };
          common.merge(params, keywords);

          var _this = possibleConstructorReturn(this, (RomanNumeral.__proto__ || Object.getPrototypeOf(RomanNumeral)).call(this, figure, params));

          _this._parsingComplete = false;

          // not yet used...
          _this.primaryFigure = undefined;
          _this.secondaryRomanNumeral = undefined;
          _this.secondaryRomanNumeralKey = undefined;

          _this.pivotChord = undefined;
          _this.scaleCardinality = 7;
          _this._figure = undefined;

          _this.caseMatters = true;
          if (typeof figure === 'number') {
              _this.caseMatters = false;
          }

          _this.scaleDegree = undefined;
          _this.frontAlterationString = undefined;
          _this.frontAlterationTransposeInterval = undefined;
          _this.frontAlterationAccidental = undefined;
          _this.romanNumeralAlone = undefined;

          _this.impliedQuality = undefined;
          _this.impliedScale = undefined;
          _this.scaleOffset = undefined;
          _this.useImpliedScale = false;
          _this.bracketedAlterations = [];
          _this.omittedSteps = [];
          _this.followsKeyChange = false;
          _this._functionalityScore = undefined;

          _this._scale = undefined; // the key

          _this.figure = figure;
          _this.key = keyStr;

          // to remove...
          _this.numbers = '';

          if (figure !== '') {
              _this._parseFigure();
              _this._parsingComplete = true;
              _this._updatePitches();
          }
          return _this;
      }

      createClass(RomanNumeral, [{
          key: '_parseFigure',
          value: function _parseFigure() {
              var workingFigure = this.figure;

              var useScale = this.impliedScale;
              if (!this.useImpliedScale) {
                  useScale = this.key;
              }

              var _correctForSecondaryR = this._correctForSecondaryRomanNumeral(useScale);

              var _correctForSecondaryR2 = slicedToArray(_correctForSecondaryR, 2);

              workingFigure = _correctForSecondaryR2[0];
              useScale = _correctForSecondaryR2[1];

              this.primaryFigure = workingFigure;

              workingFigure = this._parseOmittedSteps(workingFigure);
              workingFigure = this._parseBracketedAlterations(workingFigure);
              workingFigure = workingFigure.replace(/^N6/, 'bII6');
              workingFigure = workingFigure.replace(/^N/, 'bII6');
              workingFigure = this._parseFrontAlterations(workingFigure);

              var _parseRNAloneAmidstAu = this._parseRNAloneAmidstAug6(workingFigure, useScale);

              var _parseRNAloneAmidstAu2 = slicedToArray(_parseRNAloneAmidstAu, 2);

              workingFigure = _parseRNAloneAmidstAu2[0];
              useScale = _parseRNAloneAmidstAu2[1];

              workingFigure = this._setImpliedQualityFromString(workingFigure);

              this._tempRoot = useScale.pitchFromDegree(this.scaleDegree);
              this._fixMinorVIandVII(useScale);
              var expandedFigure = roman.expandShortHand(workingFigure);
              this.figuresNotationObj = new figuredBass.Notation(expandedFigure.toString());

              var numbersArr = workingFigure.match(/\d+/);
              if (numbersArr != null) {
                  workingFigure = workingFigure.replace(/\d+/, '');
                  this.numbers = parseInt(numbersArr[0]);
              }
          }
      }, {
          key: '_parseFrontAlterations',
          value: function _parseFrontAlterations(workingFigure) {
              var frontAlterationString = '';
              var frontAlterationTransposeInterval = void 0;
              var frontAlterationAccidental = void 0;
              var _alterationRegex = new RegExp('^(b+|-+|#+)');
              var match = _alterationRegex.exec(workingFigure);
              if (match != null) {
                  var group = match[1];
                  var alteration = group.length;
                  if (group[0] === 'b' || group[0] === '-') {
                      alteration *= -1;
                  }
                  frontAlterationTransposeInterval = interval.intervalFromGenericAndChromatic(1, alteration);
                  frontAlterationAccidental = new pitch.Accidental(alteration);
                  frontAlterationString = group;
                  workingFigure = workingFigure.replace(_alterationRegex, '');
              }
              this.frontAlterationString = frontAlterationString;
              this.frontAlterationTransposeInterval = frontAlterationTransposeInterval;
              this.frontAlterationAccidental = frontAlterationAccidental;
              return workingFigure;
          }
      }, {
          key: '_correctBracketedPitches',
          value: function _correctBracketedPitches() {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = this.bracketedAlterations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var innerAlteration = _step2.value;

                      var _innerAlteration = slicedToArray(innerAlteration, 2),
                          alterNotation = _innerAlteration[0],
                          chordStep = _innerAlteration[1];

                      var alterPitch = this.getChordStep(chordStep);
                      if (alterPitch === undefined) {
                          continue;
                      }
                      var newAccidental = new pitch.Accidental(alterNotation);
                      if (alterPitch.accidental === undefined) {
                          alterPitch.accidental = newAccidental;
                      } else {
                          alterPitch.accidental.set(alterPitch.accidental.alter + newAccidental.alter);
                      }
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
      }, {
          key: '_setImpliedQualityFromString',
          value: function _setImpliedQualityFromString(workingFigure) {
              var impliedQuality = '';
              if (workingFigure.startsWith('o')) {
                  impliedQuality = 'diminished';
                  workingFigure = workingFigure.replace(/^o/, '');
              } else if (workingFigure.startsWith('/o')) {
                  impliedQuality = 'half-diminished';
                  workingFigure = workingFigure.replace(/^\/o/, '');
              } else if (workingFigure.startsWith('+')) {
                  impliedQuality = 'augmented';
                  workingFigure = workingFigure.replace(/^\+/, '');
              } else if (workingFigure.endsWith('d7')) {
                  impliedQuality = 'dominant-seventh';
                  workingFigure = workingFigure.replace(/d7$/, '7');
              } else if (this.caseMatters && this.romanNumeralAlone.toUpperCase() === this.romanNumeralAlone) {
                  impliedQuality = 'major';
              } else if (this.caseMatters && this.romanNumeralAlone.toLowerCase() === this.romanNumeralAlone) {
                  impliedQuality = 'minor';
              }
              this.impliedQuality = impliedQuality;
              return workingFigure;
          }
      }, {
          key: '_fixMinorVIandVII',
          value: function _fixMinorVIandVII(useScale) {
              if (useScale.mode !== 'minor') {
                  return;
              }
              if (!this.caseMatters) {
                  return;
              }
              if (this.scaleDegree !== 6 && this.scaleDegree !== 7) {
                  return;
              }
              if (!['minor', 'diminished', 'half-diminished'].includes(this.impliedQuality)) {
                  return;
              }

              var fati = this.frontAlterationTransposeInterval;
              if (fati !== undefined) {
                  var newFati = interval.add([fati, new interval.Interval('A1')]);
                  this.frontAlterationTransposeInterval = newFati;
                  this.frontAlterationAccidental.alter = this.frontAlterationAccidental.alter + 1;
              } else {
                  this.frontAlterationTransposeInterval = new interval.Interval('A1');
                  this.frontAlterationAccidental = new pitch.Accidental(1);
              }

              this._tempRoot = this.frontAlterationTransposeInterval.transposePitch(this._tempRoot);

              return;
          }
      }, {
          key: '_parseRNAloneAmidstAug6',
          value: function _parseRNAloneAmidstAug6(workingFigure, useScale) {
              var romanNumeralAlone = '';
              var _romanNumeralAloneRegex = new RegExp('(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2}|N)');
              var _augmentedSixthRegex = new RegExp('(It|Ger|Fr|Sw)');
              var rm = _romanNumeralAloneRegex.exec(workingFigure);
              var a6match = _augmentedSixthRegex.exec(workingFigure);
              if (rm === null && a6match === null) {
                  throw new Music21Exception('No roman numeral found in ' + workingFigure);
              }
              if (a6match !== null) {
                  if (useScale.mode === 'major') {
                      useScale = new key.Key(useScale.tonic.name, 'minor');
                      this.impliedScale = useScale;
                      this.useImpliedScale = true;
                  }
                  romanNumeralAlone = a6match[1];
                  if (['It', 'Ger'].includes(romanNumeralAlone)) {
                      this.scaleDegree = 4;
                  } else {
                      this.scaleDegree = 2;
                  }
                  workingFigure = workingFigure.replace(_augmentedSixthRegex, '');
                  this.romanNumeralAlone = romanNumeralAlone;
                  if (romanNumeralAlone !== 'Fr') {
                      this.bracketedAlterations.push(['#', 1]);
                  }
                  if (romanNumeralAlone === 'Fr' || romanNumeralAlone === 'Sw') {
                      this.bracketedAlterations.push(['#', 3]);
                  }
              } else {
                  romanNumeralAlone = rm[1];
                  this.scaleDegree = common.fromRoman(romanNumeralAlone);
                  workingFigure = workingFigure.replace(_romanNumeralAloneRegex, '');
                  this.romanNumeralAlone = romanNumeralAlone;
              }
              return [workingFigure, useScale];
          }

          /**
           * get romanNumeral - return either romanNumeralAlone (II) or with frontAlterationAccidental (#II)
           *
           * @return {string}  new romanNumeral;
           */

      }, {
          key: '_updatePitches',


          /**
           * Update the .pitches array.  Called at instantiation, but not automatically afterwards.
           *
           * @memberof music21.roman.RomanNumeral
           */
          value: function _updatePitches() {
              var useScale = void 0;
              if (this.secondaryRomanNumeralKey !== undefined) {
                  useScale = this.secondaryRomanNumeralKey;
              } else if (!this.useImpliedScale) {
                  useScale = this.key;
              } else {
                  useScale = this.impliedScale;
              }

              this.scaleCardinality = 7; // simple speedup;
              var bassScaleDegree = this.bassScaleDegreeFromNotation(this.figuresNotationObj);
              var bassPitch = useScale.pitchFromDegree(bassScaleDegree, 'ascending');
              var pitches = [bassPitch];
              var lastPitch = bassPitch;
              var numberNotes = this.figuresNotationObj.numbers.length;

              for (var j = 0; j < numberNotes; j++) {
                  var i = numberNotes - j - 1;
                  var thisScaleDegree = bassScaleDegree + this.figuresNotationObj.numbers[i] - 1;
                  var newPitch = useScale.pitchFromDegree(thisScaleDegree, 'ascending');
                  var pitchName = this.figuresNotationObj.modifiers[i].modifyPitchName(newPitch.name);
                  var newNewPitch = new pitch.Pitch(pitchName);
                  newNewPitch.octave = newPitch.octave;
                  if (newNewPitch.ps < lastPitch.ps) {
                      newNewPitch.octave += 1;
                  }
                  pitches.push(newNewPitch);
                  lastPitch = newNewPitch;
              }
              if (this.frontAlterationTransposeInterval !== undefined) {
                  var newPitches = [];
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                      for (var _iterator3 = pitches[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                          var thisPitch = _step3.value;

                          var _newPitch = this.frontAlterationTransposeInterval.transposePitch(thisPitch);
                          newPitches.push(_newPitch);
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

                  this.pitches = newPitches;
              } else {
                  this.pitches = pitches;
              }

              this._matchAccidentalsToQuality(this.impliedQuality);

              this.scaleOffset = this.frontAlterationTransposeInterval;

              if (this.omittedSteps.length) {
                  var omittedPitches = [];
                  var _iteratorNormalCompletion4 = true;
                  var _didIteratorError4 = false;
                  var _iteratorError4 = undefined;

                  try {
                      for (var _iterator4 = this.omittedSteps[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                          var thisCS = _step4.value;

                          var p = this.getChordStep(thisCS);
                          if (p !== undefined) {
                              omittedPitches.push(p.name);
                          }
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

                  var _newPitches = [];
                  var _iteratorNormalCompletion5 = true;
                  var _didIteratorError5 = false;
                  var _iteratorError5 = undefined;

                  try {
                      for (var _iterator5 = pitches[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                          var _thisPitch = _step5.value;

                          if (!omittedPitches.includes(_thisPitch.name)) {
                              _newPitches.push(_thisPitch);
                          }
                      }
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

                  this.pitches = _newPitches;
                  // do something...
              }
              this._correctBracketedPitches();
          }
      }, {
          key: 'bassScaleDegreeFromNotation',
          value: function bassScaleDegreeFromNotation(notationObject) {
              var c = new pitch.Pitch('C3');
              var cDNN = c.diatonicNoteNum; // always 22
              var pitches = [c];
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                  for (var _iterator6 = notationObject.numbers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                      var i = _step6.value;

                      var distanceToMove = i - 1;
                      var newDiatonicNumber = cDNN + distanceToMove;

                      var _interval$convertDiat = interval.convertDiatonicNumberToStep(newDiatonicNumber),
                          _interval$convertDiat2 = slicedToArray(_interval$convertDiat, 2),
                          newStep = _interval$convertDiat2[0],
                          newOctave = _interval$convertDiat2[1];

                      var newPitch = new pitch.Pitch('C3');
                      newPitch.step = newStep;
                      newPitch.octave = newOctave;
                      pitches.push(newPitch);
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

              var tempChord = new chord.Chord(pitches);
              var rootDNN = tempChord.root().diatonicNoteNum;
              var staffDistanceFromBassToRoot = rootDNN - cDNN;
              var bassSD = common.posMod(this.scaleDegree - staffDistanceFromBassToRoot, 7);
              if (bassSD === 0) {
                  bassSD = 7;
              }
              return bassSD;
          }
      }, {
          key: '_matchAccidentalsToQuality',
          value: function _matchAccidentalsToQuality(impliedQuality) {
              var correctSemitones = this._findSemitoneSizeForQuality(impliedQuality);
              var chordStepsToExamine = [3, 5, 7];
              for (var i = 0; i < chordStepsToExamine.length; i++) {
                  var thisChordStep = chordStepsToExamine[i];
                  var thisCorrect = correctSemitones[i];
                  var thisSemis = this.semitonesFromChordStep(thisChordStep);
                  if (thisCorrect === undefined) {
                      continue;
                  }
                  if (thisSemis === undefined) {
                      continue;
                  }
                  if (thisSemis === thisCorrect) {
                      continue;
                  }

                  var correctedSemis = thisCorrect - thisSemis;
                  if (correctedSemis >= 6) {
                      correctedSemis = -1 * (12 - correctedSemis);
                  } else if (correctedSemis <= -6) {
                      correctedSemis += 12;
                  }

                  var faultyPitch = this.getChordStep(thisChordStep);
                  // TODO: check for faultyPitch is undefined

                  if (faultyPitch.accidental === undefined) {
                      faultyPitch.accidental = new pitch.Accidental(correctedSemis);
                  } else {
                      var acc = faultyPitch.accidental;
                      correctedSemis += acc.alter;
                      if (correctedSemis >= 6) {
                          correctedSemis = -1 * (12 - correctedSemis);
                      } else if (correctedSemis <= -6) {
                          correctedSemis += 12;
                      }
                      acc.set(correctedSemis);
                  }
              }
          }
      }, {
          key: '_correctForSecondaryRomanNumeral',
          value: function _correctForSecondaryRomanNumeral(useScale, figure) {
              if (figure === undefined) {
                  figure = this._figure;
              }
              var workingFigure = figure;
              var rx = new RegExp('(.*?)/([#a-np-zA-NP-Z].*)');
              var match = rx.exec(figure);
              if (match !== null) {
                  var primaryFigure = match[1];
                  var secondaryFigure = match[2];
                  var secondaryRomanNumeral = new RomanNumeral(secondaryFigure, useScale, this.caseMatters);
                  this.secondaryRomanNumeral = secondaryRomanNumeral;
                  var secondaryMode = void 0;
                  if (secondaryRomanNumeral.quality === 'minor') {
                      secondaryMode = 'minor';
                  } else if (secondaryRomanNumeral.quality === 'major') {
                      secondaryMode = 'minor';
                  } else if (secondaryRomanNumeral.semitonesFromChordStep(3) === 3) {
                      secondaryMode = 'minor';
                  } else {
                      secondaryMode = 'major';
                  }
                  this.secondaryRomanNumeralKey = new key.Key(secondaryRomanNumeral.root().name, secondaryMode);
                  useScale = this.secondaryRomanNumeralKey;
                  workingFigure = primaryFigure;
              }
              return [workingFigure, useScale];
          }
      }, {
          key: '_parseOmittedSteps',
          value: function _parseOmittedSteps(workingFigure) {
              var omittedSteps = [];
              var rx = new RegExp(/\[no(\d+)\]s*/);
              var match = rx.exec(workingFigure);
              while (match !== null) {
                  var thisStep = match[1];
                  thisStep = parseInt(thisStep);
                  thisStep = thisStep % 7 || 7;
                  omittedSteps.push(thisStep);
                  workingFigure = workingFigure.replace(rx, '');
                  match = rx.exec(workingFigure);
              }
              this.omittedSteps = omittedSteps;
              return workingFigure;
          }
      }, {
          key: '_parseBracketedAlterations',
          value: function _parseBracketedAlterations(workingFigure) {
              var bracketedAlterations = this.bracketedAlterations;
              var rx = new RegExp(/\[(b+|-+|#+)(\d+)\]/);
              var match = rx.exec(workingFigure);
              while (match !== null) {
                  var matchAlteration = match[1];
                  var matchDegree = parseInt(match[2]);
                  bracketedAlterations.push([matchAlteration, matchDegree]);
                  workingFigure = workingFigure.replace(rx, '');
                  match = rx.exec(workingFigure);
              }
              return workingFigure;
          }
      }, {
          key: '_findSemitoneSizeForQuality',
          value: function _findSemitoneSizeForQuality(impliedQuality) {
              var correctSemitones = void 0;
              if (impliedQuality === 'major') {
                  correctSemitones = [4, 7];
              } else if (impliedQuality === 'minor') {
                  correctSemitones = [3, 7];
              } else if (impliedQuality === 'diminished') {
                  correctSemitones = [3, 6, 9];
              } else if (impliedQuality === 'half-diminished') {
                  correctSemitones = [3, 6, 10];
              } else if (impliedQuality === 'augmented') {
                  correctSemitones = [4, 8];
              } else if (impliedQuality === 'dominant-seventh') {
                  correctSemitones = [4, 7, 10];
              } else {
                  correctSemitones = [];
              }

              return correctSemitones;
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
              var tonicName = keyObj.tonic.name;
              var mode = keyObj.mode;

              // specifying inversion is for backwards compatibility only.
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
                  fullChordName = fullChordName.replace('/o', 'ø');
              } else if (displayType === 'nameOnly') {
                  // use only with only choice being tonicName
                  fullChordName = '';
                  connector = '';
                  suffix = ' triad';
              } else if (displayType === 'bassName') {
                  fullChordName = this.bass().name.replace(/-/, 'b');
              } else {
                  // "default" submediant, etc...
                  fullChordName = this.degreeName;
                  if (this.numbers !== undefined) {
                      fullChordName += ' ' + this.numbers.toString();
                  }
              }
              var tonicDisplay = tonicName.replace(/-/, 'b');
              if (mode === 'minor') {
                  tonicDisplay = tonicDisplay.toLowerCase();
              }
              var chordStr = fullChordName + inversionName + connector + tonicDisplay + ' ' + mode + suffix;
              return chordStr;
          }
      }, {
          key: 'romanNumeral',
          get: function get() {
              if (this.frontAlterationAccidental === undefined) {
                  return this.romanNumeralAlone;
              } else {
                  return this.frontAlterationAccidental.modifier + this.romanNumeralAlone;
              }
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
              return this._scale;
          },
          set: function set(keyOrScale) {
              if (typeof keyOrScale === 'string') {
                  this._scale = new key.Key(keyOrScale);
              } else if (typeof keyOrScale === 'undefined') {
                  this._scale = new key.Key('C');
              } else {
                  this._scale = keyOrScale;
              }
              if (keyOrScale === undefined) {
                  this.useImpliedScale = true;
                  this.impliedScale = new scale.MajorScale('C');
              } else {
                  this.useImpliedScale = false;
                  this.impliedScale = false;
              }
              if (this._parsingComplete) {
                  this._updatePitches();
              }
          }
      }, {
          key: 'figure',
          get: function get() {
              return this._figure;
          },
          set: function set(newFigure) {
              this._figure = newFigure;
              if (this._parsingComplete) {
                  this._parseFigure();
                  this._updatePitches();
              }
          }
      }, {
          key: 'figureAndKey',
          get: function get() {
              var tonicName = this.key.tonic.name;
              var mode = '';
              if (this.key.mode !== undefined) {
                  mode = ' ' + this.key.mode;
              }

              if (mode === ' minor') {
                  tonicName = tonicName.toLowerCase();
              } else if (mode === ' major') {
                  tonicName = tonicName.toUpperCase();
              }
              return this.figure + ' in ' + tonicName + mode;
          }
      }, {
          key: 'degreeName',
          get: function get() {
              if (this.scaleDegree < 7) {
                  return [undefined, 'Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant'][this.scaleDegree];
              } else {
                  var tonicPitch = this.key.tonic;
                  var diffRootToTonic = (tonicPitch.ps - this.root().ps) % 12;
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
  }(harmony.Harmony);
  roman.RomanNumeral = RomanNumeral;

  /**
   * music21j -- Javascript reimplementation of Core music21 features.
   * music21/tempo -- tempo and (not in music21p) metronome objects
   *
   * Copyright (c) 2013-18, Michael Scott Cuthbert and cuthbertLab
   * Based on music21, Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
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
      larghissimo: 16,
      largamente: 32,
      grave: 40,
      'molto adagio': 40,
      largo: 46,
      lento: 52,
      adagio: 56,
      slow: 56,
      langsam: 56,
      larghetto: 60,
      adagietto: 66,
      andante: 72,
      andantino: 80,
      'andante moderato': 83,
      maestoso: 88,
      moderato: 92,
      moderate: 92,
      allegretto: 108,
      animato: 120,
      'allegro moderato': 128,
      allegro: 132,
      fast: 132,
      schnell: 132,
      allegrissimo: 140,
      'molto allegro': 144,
      'très vite': 144,
      vivace: 160,
      vivacissimo: 168,
      presto: 184,
      prestissimo: 208
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
   * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
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
          if (m.duration.quarterLength >= currentTSBarDuration || Math.abs(m.duration.quarterLength - currentTSBarDuration) < 0.0001) {
              p.append(m);
              m = new stream.Measure();
          }

          var token = tokens[i];
          var noteObj = void 0;
          var lyric = void 0;
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

          // Modifiers
          if (tnre.LYRIC.exec(token)) {
              var _token$split = token.split('_');

              var _token$split2 = slicedToArray(_token$split, 2);

              token = _token$split2[0];
              lyric = _token$split2[1];
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

          if (lyric !== undefined) {
              noteObj.lyric = lyric;
          }

          if (tnre.TIE.exec(token)) {
              noteObj.tie = new tie.Tie('start');
              if (storedDict.lastNoteTied) {
                  noteObj.tie.type = 'continue';
              }
              storedDict.lastNoteTied = true;
          } else if (storedDict.lastNoteTied) {
              noteObj.tie = new tie.Tie('stop');
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
              var newSVG = st.createDOM();

              $thisTN.attr('tinynotationcontents', thisTNContents);
              $thisTN.empty();
              $thisTN.data('stream', st);
              $thisTN.append(newSVG);
              // console.log(thisTNContents);
          }
      }
  };

  /**
   * music21j -- Javascript reimplementation of Core music21 features.
   * music21/voiceLeading -- voiceLeading objects
   *
   * Copyright (c) 2013-18, Michael Scott Cuthbert and cuthbertLab
   * Based on music21, Copyright (c) 2006–18, Michael Scott Cuthbert and cuthbertLab
   *
   */

  var intervalCache = [];

  var MotionType = {
      antiParallel: 'Anti-Parallel',
      contrary: 'Contrary',
      noMotion: 'No Motion',
      oblique: 'Oblique',
      parallel: 'Parallel',
      similar: 'Similar'
  };

  var VoiceLeadingQuartet = function (_Music21Object) {
      inherits(VoiceLeadingQuartet, _Music21Object);

      function VoiceLeadingQuartet(v1n1, v1n2, v2n1, v2n2, analyticKey) {
          classCallCheck(this, VoiceLeadingQuartet);

          var _this = possibleConstructorReturn(this, (VoiceLeadingQuartet.__proto__ || Object.getPrototypeOf(VoiceLeadingQuartet)).call(this));

          if (!intervalCache.length) {
              intervalCache.push(new interval.Interval('P1'));
              intervalCache.push(new interval.Interval('P5'));
              intervalCache.push(new interval.Interval('P8'));
          }
          _this.unison = intervalCache[0];
          _this.fifth = intervalCache[1];
          _this.octave = intervalCache[2];

          _this._v1n1 = undefined;
          _this._v1n2 = undefined;
          _this._v2n1 = undefined;
          _this._v2n2 = undefined;

          _this.v1n1 = v1n1;
          _this.v1n2 = v1n2;
          _this.v2n1 = v2n1;
          _this.v2n2 = v2n2;

          _this.vIntervals = [];
          _this.hIntervals = [];

          _this._key = undefined;
          if (analyticKey !== undefined) {
              _this.key = analyticKey;
          }
          if (v1n1 !== undefined && v1n2 !== undefined && v2n1 !== undefined && v2n2 !== undefined) {
              _this._findIntervals();
          }
          return _this;
      }

      createClass(VoiceLeadingQuartet, [{
          key: '_setVoiceNote',
          value: function _setVoiceNote(value, which) {
              if (value === undefined) {
                  this[which] = value;
              } else if (typeof value === 'string') {
                  this[which] = new note.Note(value);
              } else if (value.classes.includes('Note')) {
                  this[which] = value;
              } else {
                  var n = new note.Note(value.nameWithOctave);
                  n.duration.quarterLength = 0.0;
                  this[which] = n;
              }
          }
      }, {
          key: '_findIntervals',
          value: function _findIntervals() {
              this.vIntervals.push(new interval.Interval(this.v1n1, this.v2n1));
              this.vIntervals.push(new interval.Interval(this.v1n2, this.v2n2));
              this.hIntervals.push(new interval.Interval(this.v1n1, this.v1n2));
              this.hIntervals.push(new interval.Interval(this.v2n1, this.v2n2));
          }
      }, {
          key: 'motionType',
          value: function motionType() {
              if (this.obliqueMotion()) {
                  return MotionType.oblique;
              } else if (this.parallelMotion()) {
                  return MotionType.parallel;
              } else if (this.similarMotion()) {
                  return MotionType.similar;
              } else if (this.contraryMotion()) {
                  return MotionType.contrary;
              } else if (this.antiParallelMotion()) {
                  return MotionType.antiParallel;
              } else if (this.noMotion()) {
                  return MotionType.noMotion;
              }
              return undefined;
          }
      }, {
          key: 'noMotion',
          value: function noMotion() {
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = this.hIntervals[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var iV = _step.value;

                      if (iV.name !== 'P1') {
                          return false;
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

              return true;
          }
      }, {
          key: 'obliqueMotion',
          value: function obliqueMotion() {
              if (this.noMotion()) {
                  return false;
              }

              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = this.hIntervals[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var iH = _step2.value;

                      if (iH.name === 'P1') {
                          return true;
                      }
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

              return false;
          }
      }, {
          key: 'similarMotion',
          value: function similarMotion() {
              if (this.noMotion()) {
                  return false;
              }

              if (this.hIntervals[0].direction === this.hIntervals[1].direction) {
                  return true;
              } else {
                  return false;
              }
          }
      }, {
          key: 'parallelMotion',
          value: function parallelMotion(requiredInterval) {
              if (!this.similarMotion()) {
                  return false;
              }
              if (this.vIntervals[0].directedSimpleName !== this.vIntervals[1].directedSimpleName) {
                  return false;
              }
              if (requiredInterval === undefined) {
                  return true;
              }
              if (typeof requiredInterval === 'string') {
                  requiredInterval = new interval.Interval(requiredInterval);
              }
              if (this.vIntervals[0].simpleName === requiredInterval.simpleName) {
                  return true;
              } else {
                  return false;
              }
          }
      }, {
          key: 'contraryMotion',
          value: function contraryMotion() {
              if (this.noMotion()) {
                  return false;
              }
              if (this.obliqueMotion()) {
                  return false;
              }
              if (this.hIntervals[0].direction === this.hIntervals[1].direction) {
                  return false;
              } else {
                  return true;
              }
          }
      }, {
          key: 'outwardContraryMotion',
          value: function outwardContraryMotion() {
              return this.contraryMotion() && this.hIntervals[0].direction === interval.Direction.ASCENDING;
          }
      }, {
          key: 'inwardContraryMotion',
          value: function inwardContraryMotion() {
              return this.contraryMotion() && this.hIntervals[0].direction === interval.Direction.DESCENDING;
          }
      }, {
          key: 'antiParallelMotion',
          value: function antiParallelMotion(simpleName) {
              if (!this.contraryMotion()) {
                  return false;
              }
              if (this.vIntervals[0].simpleName !== this.vIntervals[1].simpleName) {
                  return false;
              }
              if (simpleName === undefined) {
                  return true;
              }
              if (typeof simpleName === 'string') {
                  if (this.vIntervals[0].simpleName === simpleName) {
                      return true;
                  } else {
                      return false;
                  }
              } else if (this.vIntervals[0].simpleName === simpleName.simpleName) {
                  return true;
              } else {
                  return false;
              }
          }
      }, {
          key: 'parallelInterval',
          value: function parallelInterval(thisInterval) {
              if (!(this.parallelMotion() || this.antiParallelMotion())) {
                  return false;
              }
              if (typeof thisInterval === 'string') {
                  thisInterval = new interval.Interval(thisInterval);
              }

              if (this.vIntervals[0].semiSimpleName === thisInterval.semiSimpleName) {
                  return true;
              } else {
                  return false;
              }
          }
      }, {
          key: 'parallelFifth',
          value: function parallelFifth() {
              return this.parallelInterval(this.fifth);
          }
      }, {
          key: 'parallelOctave',
          value: function parallelOctave() {
              return this.parallelInterval(this.octave);
          }
      }, {
          key: 'parallelUnison',
          value: function parallelUnison() {
              return this.parallelInterval(this.unison);
          }
      }, {
          key: 'parallelUnisonOrOctave',
          value: function parallelUnisonOrOctave() {
              return this.parallelUnison() || this.parallelOctave();
          }
      }, {
          key: 'hiddenInterval',
          value: function hiddenInterval(thisInterval) {
              if (this.parallelMotion()) {
                  return false;
              }
              if (!this.similarMotion()) {
                  return false;
              }

              if (typeof thisInterval === 'string') {
                  thisInterval = new interval.Interval(thisInterval);
              }
              if (this.vIntervals[1].simpleName === thisInterval.simpleName) {
                  return true;
              } else {
                  return false;
              }
          }
      }, {
          key: 'hiddenFifth',
          value: function hiddenFifth() {
              return this.hiddenInterval(this.fifth);
          }
      }, {
          key: 'hiddenOctave',
          value: function hiddenOctave() {
              return this.hiddenInterval(this.octave);
          }

          // True if either note in voice 1 is lower than the corresponding voice 2 note

      }, {
          key: 'voiceCrossing',
          value: function voiceCrossing() {
              return this.v1n1.pitch.ps < this.v2n1.pitch.ps || this.v1n2.pitch.ps < this.v2n2.pitch.ps;
          }
      }, {
          key: 'voiceOverlap',
          value: function voiceOverlap() {
              return this.v1n2.pitch.ps <= this.v2n1.pitch.ps || this.v2n2.pitch.ps >= this.v1n1.pitch.ps;
          }

          /**
           * isProperResolution - Checks whether the voice-leading quartet resolves correctly according to standard
           *         counterpoint rules. If the first harmony is dissonant (d5, A4, or m7) it checks
           *         that these are correctly resolved. If the first harmony is consonant, True is returned.
           *
           *         The key parameter should be specified to check for motion in the bass from specific
           *         note degrees. If it is not set, then no checking for scale degrees takes place.
           *
           *         Diminished Fifth: in by contrary motion to a third, with 7 resolving up to 1 in the bass
           *         Augmented Fourth: out by contrary motion to a sixth, with chordal seventh resolving
           *         down to a third in the bass.
           *         Minor Seventh: Resolves to a third with a leap form 5 to 1 in the bass
           *
           * @return {boolean}  true if proper or rules do not apply; false if improper
           */

      }, {
          key: 'isProperResolution',
          value: function isProperResolution() {
              if (this.noMotion()) {
                  return true;
              }
              var scale = void 0;
              var n1degree = void 0;
              var n2degree = void 0;
              if (this.key !== undefined) {
                  scale = this.key.getScale();
                  n1degree = scale.getScaleDegreeFromPitch(this.v2n1);
                  n2degree = scale.getScaleDegreeFromPitch(this.v2n2);
              }

              // catches case of #7 in minor
              if (this.key !== undefined && this.key.mode === 'minor' && (n1degree === undefined || n2degree === undefined)) {
                  var scale2 = this.key.getScale('melodic-minor'); // gets ascending form
                  if (n1degree === undefined) {
                      n1degree = scale2.getScaleDegreeFromPitch(this.v2n1);
                  }
                  if (n2degree === undefined) {
                      n2degree = scale2.getScaleDegreeFromPitch(this.v2n2);
                  }
              }

              var firstHarmony = this.vIntervals[0].simpleName;
              var secondHarmony = this.vIntervals[1].generic.simpleUndirected;

              if (firstHarmony === 'P4') {
                  if (this.v1n1.pitch.ps >= this.v1n2.pitch.ps) {
                      return true;
                  } else {
                      return false;
                  }
              } else if (firstHarmony === 'd5') {
                  if (scale !== undefined && n1degree !== 7) {
                      return true;
                  }
                  if (scale !== undefined && n2degree !== 1) {
                      return false;
                  }
                  return this.inwardContraryMotion() && secondHarmony === 3;
              } else if (firstHarmony === 'A4') {
                  if (scale !== undefined && n1degree !== 4) {
                      return true;
                  }
                  if (scale !== undefined && n2degree !== 3) {
                      return false;
                  }
                  return this.outwardContraryMotion() && secondHarmony === 6;
              } else if (firstHarmony === 'm7') {
                  if (scale !== undefined && n1degree !== 5) {
                      return true;
                  }
                  if (scale !== undefined && n2degree !== 1) {
                      return false;
                  }
                  return secondHarmony === 3;
              } else {
                  return true;
              }
          }
      }, {
          key: 'v1n1',
          get: function get() {
              return this._v1n1;
          },
          set: function set(value) {
              this._setVoiceNote(value, '_v1n1');
          }
      }, {
          key: 'v1n2',
          get: function get() {
              return this._v1n2;
          },
          set: function set(value) {
              this._setVoiceNote(value, '_v1n2');
          }
      }, {
          key: 'v2n1',
          get: function get() {
              return this._v2n1;
          },
          set: function set(value) {
              this._setVoiceNote(value, '_v2n1');
          }
      }, {
          key: 'v2n2',
          get: function get() {
              return this._v2n2;
          },
          set: function set(value) {
              this._setVoiceNote(value, '_v2n2');
          }
      }, {
          key: 'key',
          get: function get() {
              return this._key;
          },
          set: function set(keyValue) {
              if (typeof keyValue === 'string') {
                  keyValue = new key.Key(key.convertKeyStringToMusic21KeyString(keyValue));
              }
              this._key = keyValue;
          }
      }]);
      return VoiceLeadingQuartet;
  }(Music21Object);

  var voiceLeading = {
      VoiceLeadingQuartet: VoiceLeadingQuartet
  };

  /**
   * music21j -- Javascript reimplementation of Core music21p features.
   * music21/webmidi -- webmidi or wrapper around the Jazz Plugin
   *
   * For non webmidi --  Uses the cross-platform, cross-browser plugin from
   * http://jazz-soft.net/doc/Jazz-Plugin/Plugin.html
   * P.S. by the standards of divinity of most major religions, Sema Kachalo is a god.
   *
   * Copyright (c) 2014-18, Michael Scott Cuthbert and cuthbertLab
   * Based on music21 (=music21p), Copyright (c) 2006–18, Michael Scott Cuthbert and cuthbertLab
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
              var $svgDiv = $("#svgDiv");
              $svgDiv.empty();
              var svgDiv = s.appendNewDOM($svgDiv);
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
  <div id="svgDiv">
  </div>
  </body>
  </html>
   **/

  // order below doesn't matter, but good to give a sense
  // of what will be needed by almost everyone, and then
  // alphabetical.
  var music21 = {
      common: common,
      debug: debug,
      prebase: prebase,
      base: base,

      articulations: articulations,
      audioRecording: audioRecording,
      audioSearch: audioSearch,
      beam: beam,
      chord: chord,
      chordTables: chordTables,
      clef: clef,
      dynamics: dynamics,
      duration: duration,
      exceptions21: exceptions21,
      expressions: expressions,
      figuredBass: figuredBass,
      fromPython: fromPython,
      harmony: harmony,
      instrument: instrument,
      interval: interval,
      key: key,
      keyboard: keyboard,
      layout: layout,
      meter: meter,
      miditools: miditools,
      musicxml: musicxml,
      note: note,
      pitch: pitch,
      renderOptions: renderOptions,
      roman: roman,
      scale: scale,
      sites: sites,
      stream: stream,
      tempo: tempo,
      tie: tie,
      tinyNotation: tinyNotation,
      voiceLeading: voiceLeading,
      vfShow: vfShow,
      webmidi: webmidi
  };

  music21.Music21Object = base.Music21Object;

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
          measure.appendNewDOM();
          assert.ok(true, 'something worked');
      });
  }

  function tests$1() {
      QUnit.test('music21.base.Music21Object', function (assert) {
          var m21o = new music21.base.Music21Object();
          assert.equal(m21o.classSortOrder, 20);
          assert.ok(m21o.duration instanceof music21.duration.Duration);
          assert.deepEqual(m21o.classes, ['Music21Object', 'ProtoM21Object', 'object']);
          assert.ok(m21o.sites instanceof music21.sites.Sites);
          assert.ok(m21o.isMusic21Object);
          assert.notOk(m21o.isStream);
          assert.equal(m21o.priority, 0, 'priority is 0');
          assert.equal(m21o.quarterLength, 0.0, 'default duration is 0.0');
          m21o.quarterLength = 2.0;
          assert.equal(m21o.quarterLength, 2.0);
          var st = new music21.stream.Measure();
          st.insert(3.0, m21o);
          assert.equal(m21o.offset, 3.0);
          assert.equal(m21o.getOffsetBySite(st), 3.0);
          var st2 = new music21.stream.Measure();
          st2.insert(5.0, m21o);
          assert.equal(m21o.offset, 5.0);
          assert.strictEqual(m21o.activeSite, st2);
          assert.equal(m21o.getOffsetBySite(st), 3.0);
          assert.equal(m21o.getOffsetBySite(st2), 5.0);
          m21o.setOffsetBySite(st2, 5.5);
          assert.equal(m21o.getOffsetBySite(st2), 5.5);
      });
      QUnit.test('music21.base.Music21Object Contexts', function (assert) {
          var m21o = new music21.base.Music21Object();
          var m = new music21.stream.Measure();
          var p = new music21.stream.Part();
          var sc = new music21.stream.Score();
          m.insert(3.0, m21o);
          p.insert(1.0, m);
          sc.insert(0.0, p);
          assert.strictEqual(m21o.getContextByClass('Measure'), m, 'get context by class Measure');
          assert.strictEqual(m21o.getContextByClass('Part'), p, 'get context by class Part');
          assert.strictEqual(m21o.getContextByClass('Score'), sc, 'get context by class Score');

          var contextS = Array.from(m21o.contextSites());
          assert.equal(contextS.length, 3);
          assert.deepEqual(contextS[0], [m, 3, 'elementsFirst'], 'first site is m');
          assert.deepEqual(contextS[1], [p, 4, 'flatten'], 'second site is p');
          assert.deepEqual(contextS[2], [sc, 4.0, 'elementsOnly'], 'third site is sc');
      });
  }

  function tests$2() {
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

  function tests$3() {
      QUnit.test('music21.chord.Chord', function (assert) {
          var c = new music21.chord.Chord(['C5', 'E5', 'G5']);

          assert.equal(c.length, 3, 'Checking length of Chord');
          assert.ok(c.isMajorTriad(), 'C E G should be a major triad');
          assert.equal(c.isMinorTriad(), false, 'C E G should not be minor triad');
          assert.equal(c.canBeTonic(), true, 'C E G can be a tonic');

          // string construction
          c = new music21.chord.Chord('C5 E5 G5');
          assert.equal(c.length, 3, 'Checking length of Chord');
          assert.ok(c.isMajorTriad(), 'test chord construction from string');

          c = new music21.chord.Chord(['B', 'G', 'D', 'F']);
          assert.ok(c.isDominantSeventh());

          // test is sorted:
          c = new music21.chord.Chord('C5 E4 G3');
          var pitches = c.pitches;
          assert.equal(pitches[0].nameWithOctave, 'G3');
          assert.equal(pitches[2].nameWithOctave, 'C5');
      });
  }

  function tests$4() {
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
          s.appendNewDOM($('body'));
      });
  }

  var common$1 = music21.common;

  function tests$5() {
      QUnit.test('music21.common.posMod', function (assert) {
          assert.equal(common$1.posMod(8, 7), 1, 'positive posMod passed');
          assert.equal(common$1.posMod(-1, 7), 6, 'negative posMod passed');
          assert.equal(common$1.posMod(-15, 7), 6, 'big negative posMod passed');
      });

      QUnit.test('music21.common.fromRoman', function (assert) {
          assert.equal(common$1.fromRoman('I'), 1, 'first roman passed');
          assert.equal(common$1.fromRoman('LX'), 60, 'LX roman passed');
          assert.equal(common$1.fromRoman('XC'), 90, 'XC subtraction roman passed');
          assert.equal(common$1.fromRoman('xc'), 90, 'lowercase subtraction roman passed');
          assert.equal(common$1.fromRoman('VIII'), 8, 'max RN passed');
          assert.equal(common$1.fromRoman('MCDLXXXIX'), 1489, 'big roman passed');
      });

      QUnit.test('music21.common.toRoman', function (assert) {
          assert.equal(common$1.toRoman(1), 'I', 'first roman passed');
          assert.equal(common$1.toRoman(2), 'II', '2 passed');
          assert.equal(common$1.toRoman(7), 'VII', '7 passed');
          assert.equal(common$1.toRoman(1999), 'MCMXCIX', '1999 passed');
      });
  }

  function tests$6() {
      QUnit.test('music21.duration.Duration 0', function (assert) {
          var d = new music21.duration.Duration(0.0);
          assert.equal(d.type, 'zero', 'got zero');
          assert.equal(d.dots, 0, 'got no dots');
          assert.equal(d.quarterLength, 0.0, 'got 0.0');
      });

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
          s.appendNewDOM();
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
          m6.appendNewDOM();
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
          sc.appendNewDOM();
          assert.ok(true, '5:4 tuplets in 3/2 with multiple parts');
      });
  }

  function tests$7() {
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

  var figuredBass$1 = music21.figuredBass;

  function tests$8() {
      QUnit.test('music21.figuredBass.Notation', function (assert) {
          var n1 = new figuredBass$1.Notation('4+,2');
          assert.equal(n1.notationColumn, '4+,2');
      });
  }

  var interval$1 = music21.interval;
  var Interval$1 = music21.interval.Interval;

  function tests$9() {
      QUnit.test('music21.interval.intervalFromGenericAndChromatic', function (assert) {
          var i = void 0;
          i = interval$1.intervalFromGenericAndChromatic(2, 2);
          assert.equal(i.name, 'M2');
      });
      QUnit.test('music21.interval.Interval', function (assert) {
          var i = void 0;
          i = new Interval$1('P5');
          assert.equal(i.name, 'P5', 'name passed');
          assert.equal(i.niceName, 'Perfect Fifth', 'nice name passed');
          assert.equal(i.generic.simpleDirected, 5);
      });
      QUnit.test('music21.interval.DiatonicInterval', function (assert) {
          var i = void 0;
          i = new interval$1.DiatonicInterval('P', 5);
          assert.equal(i.specifier, 1);
          assert.equal(i.specifierAbbreviation, 'P');
      });
  }

  function tests$10() {
      QUnit.test('music21.key.convertKeyStringToMusic21KeyString', function (assert) {
          var conv = music21.key.convertKeyStringToMusic21KeyString;
          assert.equal(conv('A'), 'A', 'normal string passed');
          assert.equal(conv('a-'), 'a-', 'normal string passed');
          assert.equal(conv('Bb'), 'B-', 'Bb passed');
          assert.equal(conv('bb'), 'b-', 'bb passed');
          assert.equal(conv('b'), 'b', 'b minor passed');
          assert.equal(conv('B'), 'B', 'B major passed');
          assert.equal(conv('Eb'), 'E-', 'E- major passed');
      });

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
          var s = k.getScale().getPitches();
          assert.equal(s[2].nameWithOctave, 'A4', 'test minor scale');
          assert.equal(s[6].nameWithOctave, 'E5');
          s = k.getScale('major').getPitches();
          assert.equal(s[2].nameWithOctave, 'A#4', 'test major scale');
          assert.equal(s[6].nameWithOctave, 'E#5');
          s = k.getScale('harmonic minor').getPitches();
          assert.equal(s[2].nameWithOctave, 'A4', 'test harmonic minor scale');
          assert.equal(s[5].nameWithOctave, 'D5');
          assert.equal(s[6].nameWithOctave, 'E#5');

          assert.equal(k.width, 42, 'checking width');
      });
  }

  function tests$11() {
      QUnit.test('music21.meter.TimeSignature', function (assert) {
          var m = new music21.meter.TimeSignature('4/4');

          assert.equal(m.ratioString, '4/4', 'ratioString matches');
          assert.equal(m.barDuration.quarterLength, 4.0, 'bar lasts 4.0 ql');
          assert.deepEqual(m.beatGroups, [[2, 8]], 'beatGroups check out');
          assert.equal(m.beatCount, 4, 'beat count is 4');
          assert.equal(m.beatDuration.type, 'quarter', 'beatDuration type is quarter');
          assert.equal(m.beatDuration.dots, 0, 'beatDuration has not dots');
      });

      QUnit.test('music21.meter.TimeSignature beams', function (assert) {
          var m = new music21.meter.TimeSignature('4/4');

          var _m$offsetToSpan = m.offsetToSpan(3.2),
              _m$offsetToSpan2 = slicedToArray(_m$offsetToSpan, 2),
              start = _m$offsetToSpan2[0],
              end = _m$offsetToSpan2[1];

          assert.equal(start, 3.0, 'beat starts at 3');
          assert.equal(end, 4.0, 'beat ends at 4');
      });

      QUnit.test('music21.meter.TimeSignature compound', function (assert) {
          var m = new music21.meter.TimeSignature('6/8');

          assert.equal(m.ratioString, '6/8', 'ratioString matches');
          assert.equal(m.barDuration.quarterLength, 3.0, 'bar lasts 3.0 ql');
          assert.deepEqual(m.beatGroups, [[3, 8], [3, 8]], 'beatGroups check out');
          assert.equal(m.beatCount, 2, 'beat count is 2');
          assert.equal(m.beatDuration.type, 'quarter', 'beatDuration type is quarter');
          assert.equal(m.beatDuration.dots, 1, 'beatDuration has dot');
      });
  }

  function tests$12() {
      QUnit.test('music21.note.Note', function (assert) {
          var n = new music21.note.Note('D#5');

          assert.equal(n.pitch.name, 'D#', 'Pitch Name set to D#');
          assert.equal(n.pitch.step, 'D', 'Pitch Step set to D');
          assert.equal(n.pitch.octave, 5, 'Pitch octave set to 5');
      });
  }

  function tests$13() {
      QUnit.test('music21.pitch.Accidental', function (assert) {
          var a = new music21.pitch.Accidental('-');
          assert.equal(a.alter, -1.0, 'flat alter passed');
          assert.equal(a.name, 'flat', 'flat name passed');
          a.name = 'sharp';
          assert.equal(a.alter, 1.0, 'flat alter passed');
          assert.equal(a.name, 'sharp', 'flat name passed');

          var b = new music21.pitch.Accidental('b');
          assert.equal(b.alter, -1.0, 'flat alter passed');
          assert.equal(b.name, 'flat', 'flat name passed');
      });

      QUnit.test('music21.pitch.Pitch', function (assert) {
          var p = new music21.pitch.Pitch('D#5');
          assert.equal(p.name, 'D#', 'Pitch Name set to D#');
          assert.equal(p.step, 'D', 'Pitch Step set to D');
          assert.equal(p.octave, 5, 'Pitch octave set to 5');
          assert.equal(p.nameWithOctave, 'D#5', 'Name with octave');
          var c = new music21.clef.AltoClef();
          var vfn = p.vexflowName(c);
          assert.equal(vfn, 'C#/6', 'Vexflow name set');
      });

      QUnit.test('music21.pitch.Pitch enharmonics', function (assert) {
          var es = new music21.pitch.Pitch('E-5');
          var dis = es.getLowerEnharmonic();
          assert.equal(es.name, 'E-', 'Original Pitch Name unchanged');
          assert.equal(dis.name, 'D#', 'Pitch Name set to D#');
          assert.equal(dis.step, 'D', 'Pitch Step set to D');
          assert.equal(dis.octave, 5, 'Pitch octave set to 5');

          // inPlace
          dis.getHigherEnharmonic(true); // inPlace
          assert.equal(dis.nameWithOctave, es.nameWithOctave);

          var cDblSharp = new music21.pitch.Pitch('C##5');
          var dNatural = cDblSharp.getHigherEnharmonic();
          assert.equal(cDblSharp.ps, dNatural.ps);
          assert.equal(dNatural.name, 'D', 'C## higher is D');
          assert.equal(dNatural.octave, 5, 'Octave is 5');
          var bTripleSharp = cDblSharp.getLowerEnharmonic();
          assert.equal(cDblSharp.ps, bTripleSharp.ps);
          assert.equal(bTripleSharp.octave, 4, 'Octave is 4 [B###]');

          var cDblFlat = new music21.pitch.Pitch('C--5');
          var bFlat = cDblFlat.getLowerEnharmonic();
          assert.equal(cDblFlat.ps, bFlat.ps);

          // once octaveless pitches exist...
          //        const octaveless = new music21.pitch.Pitch('C');
          //        const bsharp = octaveless.getLowerEnharmonic();
          //        assert.equal(octaveless.octave, undefined, 'octave should be undefined');
          //        assert.equal(bsharp.octave, undefined, 'octave should be undefined');
          //        assert.equal(bsharp.name, 'B#');
      });
  }

  function tests$14() {
      QUnit.test('music21.prebase.ProtoM21Object classes', function (assert) {
          var n = new music21.note.Note();
          assert.deepEqual(n.classes, ['Note', 'NotRest', 'GeneralNote', 'Music21Object', 'ProtoM21Object', 'object']);
          assert.ok(n.isClassOrSubclass('Note'));
          assert.ok(n.isClassOrSubclass('GeneralNote'));
          assert.notOk(n.isClassOrSubclass('Rest'));
      });
      QUnit.test('clone', function (assert) {
          var n = new music21.note.Note('D4');
          var n2 = n.clone();
          n.pitch.octave = 5;
          assert.equal(n2.pitch.octave, 4);
          var n3 = n.clone(false);
          n.pitch.octave = 6;
          assert.equal(n3.pitch.octave, 6);
      });
  }

  function tests$15() {
      QUnit.test('music21.roman.expandShortHand', function (assert) {
          var outGroups = void 0;
          outGroups = music21.roman.expandShortHand('64');
          assert.equal(outGroups.length, 2);
          assert.equal(outGroups[0], 6);
          assert.equal(outGroups[1], 4);

          outGroups = music21.roman.expandShortHand('973');
          assert.equal(outGroups.toString(), '9,7,3');

          outGroups = music21.roman.expandShortHand('11b3');
          assert.equal(outGroups.toString(), '11,b3');

          outGroups = music21.roman.expandShortHand('b13#9-6');
          assert.equal(outGroups.toString(), 'b13,#9,-6');

          outGroups = music21.roman.expandShortHand('-');
          assert.equal(outGroups.toString(), '5,-3');

          outGroups = music21.roman.expandShortHand('6/4');
          assert.equal(outGroups.toString(), '6,4');

          // no shorthand expansion here
          outGroups = music21.roman.expandShortHand('7');
          assert.equal(outGroups.toString(), '7');

          outGroups = music21.roman.expandShortHand('4/3');
          assert.equal(outGroups.toString(), '4,3');

          outGroups = music21.roman.expandShortHand('6');
          assert.equal(outGroups.toString(), '6');
      });
      QUnit.test('music21.roman.correctSuffixForChordQuality', function (assert) {
          var c = void 0;
          c = new music21.chord.Chord('E3 C4 G4');
          assert.equal(music21.roman.correctSuffixForChordQuality(c, '6'), '6');
          c = new music21.chord.Chord('E3 C4 G-4');
          assert.equal(music21.roman.correctSuffixForChordQuality(c, '6'), 'o6');
      });
      QUnit.test('music21.roman.RomanNumeral', function (assert) {
          var t1 = 'IV';
          var rn1 = new music21.roman.RomanNumeral(t1, 'F');
          assert.equal(rn1.scaleDegree, 4, 'test scale dgree of F IV');
          var rnKey = rn1.key;
          assert.equal(rnKey.tonic.name, 'F', 'test scale is F');
          assert.equal(rn1.root().name, 'B-', 'test root of F IV');
          assert.equal(rn1.impliedQuality, 'major', 'test quality is major');
          assert.equal(rn1.pitches.length, 3, 'should be three pitches');
          assert.equal(rn1.pitches[0].name, 'B-', 'test pitches[0] == B-');
          assert.equal(rn1.pitches[1].name, 'D', 'test pitches[1] == D');
          assert.equal(rn1.pitches[2].name, 'F', 'test pitches[2] == F');
          assert.equal(rn1.figureAndKey, 'IV in F major');
          assert.equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');

          var t2 = void 0;
          t2 = 'viio7';
          assert.equal(t2, 'viio7', 'beginning viio7 test');
          rn1 = new music21.roman.RomanNumeral(t2, 'a');
          assert.equal(rn1.scaleDegree, 7, 'test scale dgree of A viio7');
          assert.equal(rn1.root().name, 'G#', 'test root name == G#');
          assert.equal(rn1.impliedQuality, 'diminished', 'implied quality');
          assert.equal(rn1.pitches[0].name, 'G#', 'test viio7 pitches[0] == G#');
          assert.equal(rn1.pitches[1].name, 'B', 'test viio7 pitches[1] == B');
          assert.equal(rn1.pitches[2].name, 'D', 'test viio7 pitches[2] == D');
          assert.equal(rn1.pitches[3].name, 'F', 'test viio7 pitches[3] == F');
          assert.equal(rn1.degreeName, 'Leading-tone', 'test is Leading-tone');
          assert.equal(rn1.figureAndKey, 'viio7 in a minor');

          t2 = 'V7';
          rn1 = new music21.roman.RomanNumeral(t2, 'a');
          assert.equal(rn1.scaleDegree, 5, 'test scale dgree of a V7');
          assert.equal(rn1.romanNumeralAlone, 'V', 'test romanNumeralAlone');
          assert.equal(rn1.root().name, 'E', 'root name is E');
          assert.equal(rn1.impliedQuality, 'major', 'implied quality major');
          assert.equal(rn1.pitches[0].name, 'E', 'test pitches[0] == E');
          assert.equal(rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
          assert.equal(rn1.pitches[2].name, 'B', 'test pitches[2] == B');
          assert.equal(rn1.pitches[3].name, 'D', 'test pitches[3] == D');
          assert.equal(rn1.degreeName, 'Dominant', 'test is Dominant');

          t2 = 'VII';
          rn1 = new music21.roman.RomanNumeral(t2, 'f#');
          assert.equal(rn1.scaleDegree, 7, 'test scale dgree of a VII');
          assert.equal(rn1.root().name, 'E', 'root name is E');
          assert.equal(rn1.impliedQuality, 'major', 'implied quality major');
          assert.equal(rn1.pitches[0].name, 'E', 'test pitches[0] == E');
          assert.equal(rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
          assert.equal(rn1.pitches[2].name, 'B', 'test pitches[2] == B');
          assert.equal(rn1.degreeName, 'Subtonic', 'test is Subtonic');

          t2 = '#IV';
          rn1 = new music21.roman.RomanNumeral(t2, 'F');
          assert.equal(rn1.scaleDegree, 4, 'test scale dgree of F #IV');
          assert.equal(rn1.root().name, 'B', 'test root of F #IV');
          assert.equal(rn1.impliedQuality, 'major', 'test quality is major');
          assert.equal(rn1.pitches.length, 3, 'should be three pitches');
          assert.equal(rn1.pitches[0].name, 'B', 'test pitches[0] == B');
          assert.equal(rn1.pitches[1].name, 'D#', 'test pitches[1] == D#');
          assert.equal(rn1.pitches[2].name, 'F#', 'test pitches[2] == F#');
          assert.equal(rn1.figureAndKey, '#IV in F major');
          assert.equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');
      });

      QUnit.test('music21.roman.RomanNumeral - inversions', function (assert) {
          var t1 = 'IV6';
          var rn1 = void 0;
          rn1 = new music21.roman.RomanNumeral(t1, 'F');
          assert.equal(rn1.scaleDegree, 4, 'test scale dgree of F IV6');
          var rnKey = rn1.key;
          assert.equal(rnKey.tonic.name, 'F', 'test scale is F');
          assert.equal(rn1.root().name, 'B-', 'test root of F IV6');
          assert.equal(rn1.bass().name, 'D', 'test bass of F IV6');
          assert.equal(rn1.impliedQuality, 'major', 'test quality is major');
          assert.equal(rn1.pitches[0].name, 'D', 'test pitches[0] == D');
          assert.ok(rn1.pitches.map(function (p) {
              return p.name;
          }).includes('B-'), 'B- in pitches');
          assert.ok(rn1.pitches.map(function (p) {
              return p.name;
          }).includes('F'), 'F in pitches');
          assert.equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');

          var t2 = 'V43';
          rn1 = new music21.roman.RomanNumeral(t2, 'a');
          assert.equal(rn1.scaleDegree, 5, 'test scale dgree of a V43');
          assert.equal(rn1.romanNumeralAlone, 'V', 'test romanNumeralAlone');
          assert.equal(rn1.root().name, 'E', 'root name is E');
          assert.equal(rn1.bass().name, 'B', 'bass name is B');
          assert.equal(rn1.impliedQuality, 'major', 'implied quality major');
          assert.equal(rn1.pitches[0].name, 'B', 'test pitches[0] == B');
          assert.equal(rn1.pitches[1].name, 'D', 'test pitches[1] == D');
          assert.equal(rn1.pitches[2].name, 'E', 'test pitches[2] == E');
          assert.equal(rn1.pitches[3].name, 'G#', 'test pitches[3] == G#');
          assert.equal(rn1.degreeName, 'Dominant', 'test is Dominant');

          t2 = 'ii/o65';
          rn1 = new music21.roman.RomanNumeral(t2, 'g');
          assert.equal(rn1.scaleDegree, 2, 'test scale dgree of a ii/o65');
          assert.equal(rn1.romanNumeralAlone, 'ii', 'test romanNumeralAlone is ii');
          assert.equal(rn1.root().name, 'A', 'root name is A');
          assert.equal(rn1.bass().name, 'C', 'bass name is C');
          assert.equal(rn1.impliedQuality, 'half-diminished', 'implied quality half-diminished');
          assert.equal(rn1.pitches[0].name, 'C', 'test ii/o65 pitches[0] == C');
          assert.equal(rn1.pitches[1].name, 'E-', 'test ii/o65 pitches[1] == E-');
          assert.equal(rn1.pitches[2].name, 'G', 'test ii/o65 pitches[2] == G');
          assert.equal(rn1.pitches[3].name, 'A', 'test ii/o65 pitches[3] == A');
          assert.equal(rn1.degreeName, 'Supertonic', 'test is Supertonic');
      });

      QUnit.test('music21.roman.RomanNumeral - front alterations', function (assert) {
          var rn1 = void 0;
          rn1 = new music21.roman.RomanNumeral('#II', 'C');
          assert.equal(rn1.root().name, 'D#', 'root name is D#');
          assert.equal(rn1.bass().name, 'D#', 'bass name is D#');
          assert.equal(rn1.pitches[1].name, 'F##', 'next pitch is F##');
          assert.equal(rn1.pitches[2].name, 'A#', 'last pitch is A#');
      });

      QUnit.test('music21.roman.RomanNumeral - neapolitan', function (assert) {
          var rn1 = void 0;
          rn1 = new music21.roman.RomanNumeral('N6', 'C');
          assert.equal(rn1.root().name, 'D-', 'root name is D-');
          assert.equal(rn1.bass().name, 'F', 'bass name is F');
      });

      QUnit.test('music21.roman.RomanNumeral - omittedSteps', function (assert) {
          var rn1 = void 0;
          rn1 = new music21.roman.RomanNumeral('V7[no5][no3]', 'C');
          assert.equal(rn1.omittedSteps[0], 5, '5 is omitted');
          assert.equal(rn1.omittedSteps[1], 3, '3 is omitted');
          assert.equal(rn1.root().name, 'G', '#1 root name is G');
          assert.equal(rn1.pitches.length, 2, '#1 length is 2');
          assert.equal(rn1.pitches[0].name, 'G');
          assert.equal(rn1.pitches[1].name, 'F');

          rn1 = new music21.roman.RomanNumeral('V13[no11][no9][no7]', 'C');
          assert.equal(rn1.omittedSteps[0], 4, '4 =11 is omitted');
          assert.equal(rn1.omittedSteps[1], 2, '2 =9 is omitted');
          assert.equal(rn1.omittedSteps[2], 7, '7 is omitted');
          // root of 13th is undefined...
          // assert.equal(rn1.root().name, 'G', 'root is G');
          assert.equal(rn1.bass().name, 'G', 'bass is G');
          assert.equal(rn1.pitches.length, 4, '#2 length is 4');
          assert.equal(rn1.pitches[0].name, 'G', 'first pitch is G');
          assert.equal(rn1.pitches[1].name, 'B');
          assert.equal(rn1.pitches[2].name, 'D');
          assert.equal(rn1.pitches[3].name, 'E');
      });

      QUnit.test('music21.roman.RomanNumeral - bracketedAlterations', function (assert) {
          var rn1 = void 0;
          rn1 = new music21.roman.RomanNumeral('V7[#5][b3]', 'C');
          assert.deepEqual(rn1.bracketedAlterations[0], ['#', 5], '5 is sharped: ' + rn1.bracketedAlterations[0]);
          assert.deepEqual(rn1.bracketedAlterations[1], ['b', 3], '3 is flattened:  ' + rn1.bracketedAlterations[1]);
          assert.equal(rn1.root().name, 'G', '#1 root name is G');
          assert.equal(rn1.pitches.length, 4, '#1 length is 3');
          assert.equal(rn1.third.name, 'B-', 'third is B-');
          assert.equal(rn1.fifth.name, 'D#', 'fifth is D#');
      });

      QUnit.test('music21.roman.RomanNumeral - vio, VI, vii, VII in minor', function (assert) {
          var rn1 = void 0;
          rn1 = new music21.roman.RomanNumeral('vio', 'c');
          assert.equal(rn1.root().name, 'A', 'root name is A');
          assert.equal(rn1.fifth.name, 'E-', 'fifth name is E-');

          rn1 = new music21.roman.RomanNumeral('vi', 'c');
          assert.equal(rn1.root().name, 'A', 'root name is A');
          assert.equal(rn1.fifth.name, 'E', 'fifth name is E');

          rn1 = new music21.roman.RomanNumeral('VI', 'c');
          assert.equal(rn1.root().name, 'A-', 'root name is A-');
          assert.equal(rn1.fifth.name, 'E-', 'fifth name is E-');

          rn1 = new music21.roman.RomanNumeral('viio', 'c');
          assert.equal(rn1.root().name, 'B', 'root name is B');
          assert.equal(rn1.fifth.name, 'F', 'fifth name is F');

          rn1 = new music21.roman.RomanNumeral('vii', 'c');
          assert.equal(rn1.root().name, 'B', 'root name is B');
          assert.equal(rn1.fifth.name, 'F#', 'fifth name is F#');

          rn1 = new music21.roman.RomanNumeral('VII', 'c');
          assert.equal(rn1.root().name, 'B-', 'root name is B-');
          assert.equal(rn1.fifth.name, 'F', 'fifth name is F');
      });

      QUnit.test('music21.roman.RomanNumeral - secondary roman numerals', function (assert) {
          var rn1 = void 0;
          rn1 = new music21.roman.RomanNumeral('V/V', 'C');
          assert.equal(rn1.root().name, 'D', 'root name is D');
          assert.equal(rn1.bass().name, 'D', 'bass name is D');
          assert.equal(rn1.pitches[1].name, 'F#', 'third is F#');

          rn1 = new music21.roman.RomanNumeral('V65/V', 'C');
          assert.equal(rn1.root().name, 'D', 'root name is F#');
          assert.equal(rn1.bass().name, 'F#', 'bass name is F#');

          rn1 = new music21.roman.RomanNumeral('V65/IV', 'C');
          assert.equal(rn1.figure, 'V65/IV', 'figure is unchanged');
          assert.equal(rn1.secondaryRomanNumeral.figure, 'IV', 'secondary to IV');
          assert.equal(rn1.secondaryRomanNumeralKey.tonic.name, 'F');
          assert.equal(rn1.root().name, 'C', 'root name is C');
          assert.equal(rn1.bass().name, 'E', 'bass name is E');
          assert.equal(rn1.seventh.name, 'B-', 'seventh is B-');

          rn1 = new music21.roman.RomanNumeral('V7/V/V', 'B-');
          assert.equal(rn1.root().name, 'G');
          assert.equal(rn1.third.name, 'B');
          assert.equal(rn1.secondaryRomanNumeral.figure, 'V/V');
          assert.equal(rn1.secondaryRomanNumeral.secondaryRomanNumeral.figure, 'V');
      });

      QUnit.test('music21.roman.RomanNumeral - augmented6ths', function (assert) {
          var k = new music21.key.Key('a');
          var p = function p(rn) {
              var rn1 = new music21.roman.RomanNumeral(rn, k);
              var x = '';
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = rn1.pitches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var pi = _step.value;

                      x += pi.nameWithOctave + ' ';
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

              return x.trim();
          };
          var empty = new music21.roman.RomanNumeral();
          var out = empty._parseRNAloneAmidstAug6('It6', new music21.key.Key('C'));
          assert.equal(empty.useImpliedScale, true);
          assert.equal(out[0], '6');
          assert.equal(out[1].mode, 'minor');
          assert.equal(empty.scaleDegree, 4);
          assert.deepEqual(empty.bracketedAlterations[0], ['#', 1]);

          assert.equal(p('V'), 'E5 G#5 B5');
          assert.equal(p('It6'), 'F5 A5 D#6');
          assert.equal(p('Ger65'), 'F5 A5 C6 D#6');
          assert.equal(p('Ger6/5'), 'F5 A5 C6 D#6');
          assert.equal(p('Fr43'), 'F5 A5 B5 D#6');
          assert.equal(p('Fr4/3'), 'F5 A5 B5 D#6');
          assert.equal(p('Sw43'), 'F5 A5 B#5 D#6');

          k = new music21.key.Key('A');
          assert.equal(p('V'), 'E5 G#5 B5');
          assert.equal(p('It6'), 'F5 A5 D#6');
          assert.equal(p('Ger65'), 'F5 A5 C6 D#6');
          assert.equal(p('Ger6/5'), 'F5 A5 C6 D#6');
          assert.equal(p('Fr43'), 'F5 A5 B5 D#6');
          assert.equal(p('Fr4/3'), 'F5 A5 B5 D#6');
          assert.equal(p('Sw43'), 'F5 A5 B#5 D#6');
      });
  }

  function tests$16() {
      QUnit.test('music21.scale.Scale', function (assert) {
          var sc = new music21.scale.Scale();
          assert.ok(sc.classes.includes('Scale'));
      });
      QUnit.test('music21.scale.AbstractDiatonicScale', function (assert) {
          var sc = new music21.scale.AbstractDiatonicScale('major');
          var net = sc._net;
          assert.equal(net.length, 7);
          assert.equal(net[0].name, 'M2');
          var p = new music21.pitch.Pitch('A-');
          var pitches = sc.getRealization(p);
          assert.equal(pitches.length, 8);
          assert.equal(pitches[3].name, 'D-');
          assert.equal(sc.getPitchFromNodeDegree(p, undefined, 4).name, 'D-');
      });

      QUnit.test('music21.scale.MajorScale', function (assert) {
          var sc = new music21.scale.MajorScale('F');
          assert.equal(sc.tonic.name, 'F');
          var pitches = sc.getPitches();
          assert.equal(pitches[0].name, 'F');
          assert.equal(pitches[1].name, 'G');
          assert.equal(pitches[2].name, 'A');
          assert.equal(pitches[3].name, 'B-');
          assert.equal(pitches[4].name, 'C');
          assert.equal(pitches[5].name, 'D');
          assert.equal(pitches[6].name, 'E');
          assert.equal(pitches[7].name, 'F');
          assert.equal(sc.pitchFromDegree(5).name, 'C');
          assert.equal(sc.getScaleDegreeFromPitch('B-'), 4);
      });
  }

  function tests$17() {
      QUnit.test('music21.sites.SiteRef', function (assert) {
          var sr = new music21.sites.SiteRef();
          assert.ok(!sr.isDead);
          assert.equal(sr.siteWeakref.ref, undefined, 'SiteRef should start undefined');
          var st = new music21.stream.Measure();
          sr.site = st;
          sr.classString = st.classes[0];
          assert.equal(sr.site, st);
          assert.equal(sr.classString, 'Measure');
      });

      QUnit.test('music21.sites.Sites', function (assert) {
          var s = new music21.sites.Sites();
          assert.equal(s.length, 1, 'empty sites has length 1');
          var st = new music21.stream.Measure();
          st.number = 12;
          s.add(st);
          assert.equal(s.length, 2, 'should have two sites now');
          assert.ok(s.includes(st));
          var first = s._keysByTime()[0];
          assert.equal(first, music21.sites.getId(st));

          var af = void 0;
          af = Array.from(s.yieldSites(false, st));
          assert.equal(af.length, 2);
          assert.strictEqual(af[0], st);
          af = Array.from(s.yieldSites(false, st, true));
          assert.equal(af.length, 1);
          assert.strictEqual(af[0], st);

          var mNum = s.getAttrByName('number');
          assert.equal(mNum, 12, 'measure number should be 12');

          assert.strictEqual(s.getObjByClass('Measure'), st);
          assert.strictEqual(s.getObjByClass('Stream'), st);
          assert.notOk(s.getObjByClass('Score'));

          s.clear();
          assert.equal(s.length, 1);
      });
  }

  function tests$18() {
      QUnit.test('music21.stream.Stream', function (assert) {
          var s = new music21.stream.Stream();
          s.append(new music21.note.Note('C#5'));
          s.append(new music21.note.Note('D#5'));
          var n = new music21.note.Note('F5');
          n.duration.type = 'half';
          s.append(n);
          assert.equal(s.length, 3, 'Simple stream length');

          // test iteration.
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
              for (var _iterator = s[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var _n = _step.value;

                  var oct = _n.pitch.octave;
                  assert.equal(oct, 5, 'all notes are octave 5');
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
      });
      QUnit.test('music21.stream.Stream remove, index, replace', function (assert) {
          var s = new music21.stream.Stream();
          s.append(new music21.note.Note('C#5'));
          var d = new music21.note.Note('D#5');
          s.append(d);
          var n = new music21.note.Note('F5');
          s.append(n);
          assert.equal(s.index(d), 1);
          assert.equal(s.index(n), 2);
          assert.equal(s.length, 3);

          s.remove(n);
          assert.equal(s.length, 2);
          assert.throws(function () {
              s.index(n);
          }, /cannot find/, 'n is no longer in s');

          assert.equal(d.offset, 1.0);
          var r = new music21.note.Rest();
          assert.equal(r.offset, 0.0);

          s.replace(d, r);
          assert.equal(d.offset, 0.0);
          assert.equal(r.offset, 1.0);
          assert.equal(s.index(r), 1.0);
          assert.throws(function () {
              s.index(d);
          }, /cannot find/, 'd is no longer in s');
      });

      QUnit.test('music21.stream.Stream.duration', function (assert) {
          var s = new music21.stream.Stream();
          assert.equal(s.duration.quarterLength, 0, 'EmptyString QuarterLength');

          s.append(new music21.note.Note('C#5'));
          assert.equal(s.duration.quarterLength, 1.0, '1 quarter QuarterLength');

          var n = new music21.note.Note('F5');
          n.duration.type = 'half';
          s.append(n);
          assert.equal(s.highestTime, 3.0);
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

      QUnit.test('music21.stream.Stream.append', function (assert) {
          var s = new music21.stream.Stream();
          s.append(new music21.note.Note('C4'));
          assert.equal(s.length, 1);

          var s2 = new music21.stream.Stream();
          var n1 = new music21.note.Note('C#4');
          var n2 = new music21.note.Note('D4');
          var n3 = new music21.note.Note('D#4');
          n3.duration.type = 'half';
          var l = [n1, n2, n3];
          s2.append(l);
          assert.equal(s2.length, 3);
          assert.equal(s2.duration.quarterLength, 4.0);
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

      QUnit.test('music21.stream.Stream insertAndShift', function (assert) {
          var s = new music21.stream.Stream();
          s.insert(0, new music21.note.Note('C4'));
          s.insert(1, new music21.note.Note('E4'));
          s.insert(2, new music21.note.Note('F4'));
          s.insertAndShift(1, new music21.note.Note('D4'));
          var outListNames = [];
          var outListOffsets = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
              for (var _iterator2 = s[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var n = _step2.value;

                  outListNames.push(n.name);
                  outListOffsets.push(n.offset);
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

          assert.equal(outListNames[0], 'C');
          assert.equal(outListOffsets[0], 0.0);
          assert.equal(outListNames[1], 'D');
          assert.equal(outListOffsets[1], 1.0);
          assert.equal(outListNames[2], 'E');
          assert.equal(outListOffsets[2], 2.0);
          assert.equal(outListNames[3], 'F');
          assert.equal(outListOffsets[3], 3.0);
      });

      QUnit.test('music21.stream.Stream.DOM', function (assert) {
          var s = new music21.stream.Stream();
          s.append(new music21.note.Note('C#5'));
          s.append(new music21.note.Note('D#5'));
          var n = new music21.note.Note('F5');
          n.duration.type = 'half';
          s.append(n);
          var c = s.createNewDOM(100, 50);
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
      QUnit.test('music21.stream.Stream appendNewDOM ', function (assert) {
          var n = new music21.note.Note('G3');
          var s = new music21.stream.Measure();
          s.append(n);
          s.appendNewDOM(document.body);
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
          var div1 = s1.editableAccidentalDOM();
          $(document.body).append(div1);
      });
      QUnit.test('music21.stream.Stream makeAccidentals ', function (assert) {
          var n = new music21.note.Note('G#3');
          var n2 = new music21.note.Note('G#3');
          var n3 = new music21.note.Note('C#4');
          var c = new music21.chord.Chord(['C3', 'E-3', 'G3', 'G4']);
          var ks = new music21.key.KeySignature(2);
          var s = new music21.stream.Measure();
          s.keySignature = ks;
          s.append([n, n2, n3, c]);
          s.makeAccidentals();
          assert.ok(n.pitch.accidental.displayStatus);
          assert.notOk(n2.pitch.accidental.displayStatus);
          assert.notOk(n3.pitch.accidental.displayStatus);
          assert.ok(c._notes[0].pitch.accidental);
          assert.ok(c._notes[0].pitch.accidental.displayStatus);
          assert.ok(c._notes[1].pitch.accidental.displayStatus);
          assert.ok(c._notes[2].pitch.accidental.displayStatus);
          assert.notOk(c._notes[3].pitch.accidental); // perhaps should exist?
      });
  }

  function tests$19() {
      QUnit.test('music21.tie.Tie', function (assert) {
          var t = new music21.tie.Tie('start');
          assert.equal(t.type, 'start', 'Tie type is start');
      });
  }

  function tests$20() {
      QUnit.test('music21.voiceLeading.VoiceLeadingQuartet', function (assert) {
          var VLQ = music21.voiceLeading.VoiceLeadingQuartet;
          var sc = new VLQ();
          assert.ok(sc.classes.includes('VoiceLeadingQuartet'));
          var N = music21.note.Note;
          var v1n1 = new N('C4');
          var v1n2 = new N('B3');
          var v2n1 = new N('F3');
          var v2n2 = new N('E3');
          var vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
          assert.equal(vlq1.vIntervals[0].name, 'P5');
          assert.equal(vlq1.vIntervals[1].name, 'P5');
          assert.equal(vlq1.hIntervals[0].name, 'm2');
          assert.equal(vlq1.hIntervals[1].name, 'm2');
          assert.ok(!vlq1.noMotion(), 'not no motion');
          assert.ok(!vlq1.obliqueMotion());
          assert.ok(vlq1.similarMotion());
          assert.ok(vlq1.parallelMotion());
          assert.ok(vlq1.parallelMotion('P5'));
          assert.ok(vlq1.parallelInterval('P5'));
          assert.ok(vlq1.parallelFifth());
          assert.ok(!vlq1.parallelOctave());
          v2n2 = new N('A3');
          var vlq2 = new VLQ(v1n1, v1n2, v2n1, v2n2);
          assert.equal(vlq2.vIntervals[1].name, 'M2');
          assert.equal(vlq2.hIntervals[1].name, 'M3');
          assert.ok(!vlq2.similarMotion(), 'not similar motion');
          assert.ok(vlq2.contraryMotion(), 'contrary motion');
          assert.ok(vlq2.inwardContraryMotion(), 'inward contrary motion');
          assert.ok(!vlq2.outwardContraryMotion(), 'not outward contrary motion');

          var vlq3 = new VLQ('C4', 'D4', 'A3', 'F3');
          assert.ok(vlq3.contraryMotion(), 'contrary motion set w/ strings');
      });
      QUnit.test('music21.voiceLeading.VoiceLeadingQuartet proper resolution', function (assert) {
          var VLQ = music21.voiceLeading.VoiceLeadingQuartet;
          var sc = new VLQ();
          assert.ok(sc.classes.includes('VoiceLeadingQuartet'));
          var N = music21.note.Note;
          var v1n1 = new N('B-4');
          var v1n2 = new N('A4');
          var v2n1 = new N('E4');
          var v2n2 = new N('F4');
          var vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
          assert.ok(vlq1.isProperResolution(), 'd5 resolves inward');
          v2n2 = new N('D4');
          vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
          assert.ok(!vlq1.isProperResolution(), 'd5 resolves outward');
          vlq1.key = 'B-';
          assert.ok(vlq1.isProperResolution(), 'not on scale degrees that need resolution');
          v1n1 = new N('E5');
          v1n2 = new N('F5');
          v2n1 = new N('B-4');
          v2n2 = new N('A4');
          vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
          assert.ok(vlq1.isProperResolution(), 'A4 resolves outward');
          v2n2 = new N('D4');
          vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
          assert.ok(!vlq1.isProperResolution(), 'A4 resolves inward');
          vlq1.key = 'B-';
          assert.ok(vlq1.isProperResolution(), 'not on scale degrees that need resolution');
          v1n1 = new N('B-4');
          v1n2 = new N('A4');
          v2n1 = new N('C4');
          v2n2 = new N('F4');
          vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
          assert.ok(vlq1.isProperResolution(), 'm7 resolves inward');
          // v2n2 = new N('F3');
          // vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
          // Ryan believes that this is ok now...
          // assert.ok(!vlq1.isProperResolution(), 'm7 with similar motion');

          v2n2 = new N('F#4');
          vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
          vlq1.key = 'B-';
          assert.ok(vlq1.isProperResolution(), 'm7 not on scale degrees that need resolution');
          vlq1.key = 'F';
          assert.ok(!vlq1.isProperResolution(), 'm7 on scale degrees that need resolution');

          v1n1 = new N('F5');
          v1n2 = new N('G5');
          v2n1 = new N('C4');
          v2n2 = new N('C4');
          vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
          assert.ok(!vlq1.isProperResolution(), 'P4 must move down or remain constant');
          v1n2 = new N('E5');
          vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
          assert.ok(vlq1.isProperResolution(), 'P4 moves down: ' + vlq1.v1n1.ps + vlq1.v1n2.ps);
      });
  }

  var allTests = {
      articulations: tests,
      base: tests$1,
      beam: tests$2,
      chord: tests$3,
      clef: tests$4,
      common: tests$5,
      duration: tests$6,
      dynamics: tests$7,
      figuredBass: tests$8,
      interval: tests$9,
      key: tests$10,
      meter: tests$11,
      note: tests$12,
      pitch: tests$13,
      prebase: tests$14,
      roman: tests$15,
      scale: tests$16,
      sites: tests$17,
      stream: tests$18,
      tie: tests$19,
      voiceLeading: tests$20
  };
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefined) {
      window.allTests = allTests;
  }

  return allTests;

})));
//# sourceMappingURL=music21.tests.js.map