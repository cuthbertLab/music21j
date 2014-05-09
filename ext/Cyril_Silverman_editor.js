
//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);
define("underscore", (function (global) {
    return function () {
        var ret, fn;
        return ret || global._;
    };
}(this)));

/*! jQuery v1.7.2 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cu(a){if(!cj[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ck||(ck=c.createElement("iframe"),ck.frameBorder=ck.width=ck.height=0),b.appendChild(ck);if(!cl||!ck.createElement)cl=(ck.contentWindow||ck.contentDocument).document,cl.write((f.support.boxModel?"<!doctype html>":"")+"<html><body>"),cl.close();d=cl.createElement(a),cl.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ck)}cj[a]=e}return cj[a]}function ct(a,b){var c={};f.each(cp.concat.apply([],cp.slice(0,b)),function(){c[this]=a});return c}function cs(){cq=b}function cr(){setTimeout(cs,0);return cq=f.now()}function ci(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ch(){try{return new a.XMLHttpRequest}catch(b){}}function cb(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function ca(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function b_(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bD.test(a)?d(a,e):b_(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&f.type(b)==="object")for(var e in b)b_(a+"["+e+"]",b[e],c,d);else d(a,b)}function b$(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bZ(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bS,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bZ(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bZ(a,c,d,e,"*",g));return l}function bY(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bO),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bB(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?1:0,g=4;if(d>0){if(c!=="border")for(;e<g;e+=2)c||(d-=parseFloat(f.css(a,"padding"+bx[e]))||0),c==="margin"?d+=parseFloat(f.css(a,c+bx[e]))||0:d-=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0;return d+"px"}d=by(a,b);if(d<0||d==null)d=a.style[b];if(bt.test(d))return d;d=parseFloat(d)||0;if(c)for(;e<g;e+=2)d+=parseFloat(f.css(a,"padding"+bx[e]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+bx[e]))||0);return d+"px"}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;b.nodeType===1&&(b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?b.outerHTML=a.outerHTML:c!=="input"||a.type!=="checkbox"&&a.type!=="radio"?c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text):(a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value)),b.removeAttribute(f.expando),b.removeAttribute("_submit_attached"),b.removeAttribute("_change_attached"))}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c,i[c][d])}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?+d:j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.2",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){if(typeof c!="string"||!c)return null;var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h,i){var j,k=d==null,l=0,m=a.length;if(d&&typeof d=="object"){for(l in d)e.access(a,c,l,d[l],1,h,f);g=1}else if(f!==b){j=i===b&&e.isFunction(f),k&&(j?(j=c,c=function(a,b,c){return j.call(e(a),c)}):(c.call(a,f),c=null));if(c)for(;l<m;l++)c(a[l],d,j?f.call(a[l],l,c(a[l],d)):f,i);g=1}return g?a:k?c.call(a):m?c(a[0],d):h},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m,n=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?n(g):h==="function"&&(!a.unique||!p.has(g))&&c.push(g)},o=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,j=!0,m=k||0,k=0,l=c.length;for(;c&&m<l;m++)if(c[m].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}j=!1,c&&(a.once?e===!0?p.disable():c=[]:d&&d.length&&(e=d.shift(),p.fireWith(e[0],e[1])))},p={add:function(){if(c){var a=c.length;n(arguments),j?l=c.length:e&&e!==!0&&(k=a,o(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){j&&f<=l&&(l--,f<=m&&m--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&p.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(j?a.once||d.push([b,c]):(!a.once||!e)&&o(b,c));return this},fire:function(){p.fireWith(this,arguments);return this},fired:function(){return!!i}};return p};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p=c.createElement("div"),q=c.documentElement;p.setAttribute("className","t"),p.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=p.getElementsByTagName("*"),e=p.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=p.getElementsByTagName("input")[0],b={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:p.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,pixelMargin:!0},f.boxModel=b.boxModel=c.compatMode==="CSS1Compat",i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete p.test}catch(r){b.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",function(){b.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),i.setAttribute("name","t"),p.appendChild(i),j=c.createDocumentFragment(),j.appendChild(p.lastChild),b.checkClone=j.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,j.removeChild(i),j.appendChild(p);if(p.attachEvent)for(n in{submit:1,change:1,focusin:1})m="on"+n,o=m in p,o||(p.setAttribute(m,"return;"),o=typeof p[m]=="function"),b[n+"Bubbles"]=o;j.removeChild(p),j=g=h=p=i=null,f(function(){var d,e,g,h,i,j,l,m,n,q,r,s,t,u=c.getElementsByTagName("body")[0];!u||(m=1,t="padding:0;margin:0;border:",r="position:absolute;top:0;left:0;width:1px;height:1px;",s=t+"0;visibility:hidden;",n="style='"+r+t+"5px solid #000;",q="<div "+n+"display:block;'><div style='"+t+"0;display:block;overflow:hidden;'></div></div>"+"<table "+n+"' cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",d=c.createElement("div"),d.style.cssText=s+"width:0;height:0;position:static;top:0;margin-top:"+m+"px",u.insertBefore(d,u.firstChild),p=c.createElement("div"),d.appendChild(p),p.innerHTML="<table><tr><td style='"+t+"0;display:none'></td><td>t</td></tr></table>",k=p.getElementsByTagName("td"),o=k[0].offsetHeight===0,k[0].style.display="",k[1].style.display="none",b.reliableHiddenOffsets=o&&k[0].offsetHeight===0,a.getComputedStyle&&(p.innerHTML="",l=c.createElement("div"),l.style.width="0",l.style.marginRight="0",p.style.width="2px",p.appendChild(l),b.reliableMarginRight=(parseInt((a.getComputedStyle(l,null)||{marginRight:0}).marginRight,10)||0)===0),typeof p.style.zoom!="undefined"&&(p.innerHTML="",p.style.width=p.style.padding="1px",p.style.border=0,p.style.overflow="hidden",p.style.display="inline",p.style.zoom=1,b.inlineBlockNeedsLayout=p.offsetWidth===3,p.style.display="block",p.style.overflow="visible",p.innerHTML="<div style='width:5px;'></div>",b.shrinkWrapBlocks=p.offsetWidth!==3),p.style.cssText=r+s,p.innerHTML=q,e=p.firstChild,g=e.firstChild,i=e.nextSibling.firstChild.firstChild,j={doesNotAddBorder:g.offsetTop!==5,doesAddBorderForTableAndCells:i.offsetTop===5},g.style.position="fixed",g.style.top="20px",j.fixedPosition=g.offsetTop===20||g.offsetTop===15,g.style.position=g.style.top="",e.style.overflow="hidden",e.style.position="relative",j.subtractsBorderForOverflowNotVisible=g.offsetTop===-5,j.doesNotIncludeMarginInBodyOffset=u.offsetTop!==m,a.getComputedStyle&&(p.style.marginTop="1%",b.pixelMargin=(a.getComputedStyle(p,null)||{marginTop:0}).marginTop!=="1%"),typeof d.style.zoom!="undefined"&&(d.style.zoom=1),u.removeChild(d),l=p=d=null,f.extend(b,j))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h,i,j=this[0],k=0,m=null;if(a===b){if(this.length){m=f.data(j);if(j.nodeType===1&&!f._data(j,"parsedAttrs")){g=j.attributes;for(i=g.length;k<i;k++)h=g[k].name,h.indexOf("data-")===0&&(h=f.camelCase(h.substring(5)),l(j,h,m[h]));f._data(j,"parsedAttrs",!0)}}return m}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!";return f.access(this,function(c){if(c===b){m=this.triggerHandler("getData"+e,[d[0]]),m===b&&j&&(m=f.data(j,a),m=l(j,a,m));return m===b&&d[1]?this.data(d[0]):m}d[1]=c,this.each(function(){var b=f(this);b.triggerHandler("setData"+e,d),f.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1)},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){var d=2;typeof a!="string"&&(c=a,a="fx",d--);if(arguments.length<d)return f.queue(this[0],a);return c===b?this:this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise(c)}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,f.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,f.prop,a,b,arguments.length>1)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.type]||f.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.type]||f.valHooks[g.nodeName.toLowerCase()];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h,i=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;i<g;i++)e=d[i],e&&(c=f.propFix[e]||e,h=u.test(e),h||f.attr(a,e,""),a.removeAttribute(v?e:c),h&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0,coords:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/(?:^|\s)hover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(
a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler,g=p.selector),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:g&&G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=f.event.special[c.type]||{},j=[],k,l,m,n,o,p,q,r,s,t,u;g[0]=c,c.delegateTarget=this;if(!i.preDispatch||i.preDispatch.call(this,c)!==!1){if(e&&(!c.button||c.type!=="click")){n=f(this),n.context=this.ownerDocument||this;for(m=c.target;m!=this;m=m.parentNode||this)if(m.disabled!==!0){p={},r=[],n[0]=m;for(k=0;k<e;k++)s=d[k],t=s.selector,p[t]===b&&(p[t]=s.quick?H(m,s.quick):n.is(t)),p[t]&&r.push(s);r.length&&j.push({elem:m,matches:r})}}d.length>e&&j.push({elem:this,matches:d.slice(e)});for(k=0;k<j.length&&!c.isPropagationStopped();k++){q=j[k],c.currentTarget=q.elem;for(l=0;l<q.matches.length&&!c.isImmediatePropagationStopped();l++){s=q.matches[l];if(h||!c.namespace&&!s.namespace||c.namespace_re&&c.namespace_re.test(s.namespace))c.data=s.data,c.handleObj=s,o=((f.event.special[s.origType]||{}).handle||s.handler).apply(q.elem,g),o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()))}}i.postDispatch&&i.postDispatch.call(this,c);return c.result}},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),d._submit_attached=!0)})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9||d===11){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));o.match.globalPOS=p;var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.globalPOS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")[\\s/>]","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){return f.access(this,function(a){return a===b?f.text(this):this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f
.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){return f.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(f.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(g){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,function(a,b){b.src?f.ajax({type:"GET",global:!1,url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||f.isXMLDoc(a)||!bc.test("<"+a.nodeName+">")?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g,h,i,j=[];b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);for(var k=0,l;(l=a[k])!=null;k++){typeof l=="number"&&(l+="");if(!l)continue;if(typeof l=="string")if(!_.test(l))l=b.createTextNode(l);else{l=l.replace(Y,"<$1></$2>");var m=(Z.exec(l)||["",""])[1].toLowerCase(),n=bg[m]||bg._default,o=n[0],p=b.createElement("div"),q=bh.childNodes,r;b===c?bh.appendChild(p):U(b).appendChild(p),p.innerHTML=n[1]+l+n[2];while(o--)p=p.lastChild;if(!f.support.tbody){var s=$.test(l),t=m==="table"&&!s?p.firstChild&&p.firstChild.childNodes:n[1]==="<table>"&&!s?p.childNodes:[];for(i=t.length-1;i>=0;--i)f.nodeName(t[i],"tbody")&&!t[i].childNodes.length&&t[i].parentNode.removeChild(t[i])}!f.support.leadingWhitespace&&X.test(l)&&p.insertBefore(b.createTextNode(X.exec(l)[0]),p.firstChild),l=p.childNodes,p&&(p.parentNode.removeChild(p),q.length>0&&(r=q[q.length-1],r&&r.parentNode&&r.parentNode.removeChild(r)))}var u;if(!f.support.appendChecked)if(l[0]&&typeof (u=l.length)=="number")for(i=0;i<u;i++)bn(l[i]);else bn(l);l.nodeType?j.push(l):j=f.merge(j,l)}if(d){g=function(a){return!a.type||be.test(a.type)};for(k=0;j[k];k++){h=j[k];if(e&&f.nodeName(h,"script")&&(!h.type||be.test(h.type)))e.push(h.parentNode?h.parentNode.removeChild(h):h);else{if(h.nodeType===1){var v=f.grep(h.getElementsByTagName("script"),g);j.splice.apply(j,[k+1,0].concat(v))}d.appendChild(h)}}}return j},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bp=/alpha\([^)]*\)/i,bq=/opacity=([^)]*)/,br=/([A-Z]|^ms)/g,bs=/^[\-+]?(?:\d*\.)?\d+$/i,bt=/^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,bu=/^([\-+])=([\-+.\de]+)/,bv=/^margin/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Top","Right","Bottom","Left"],by,bz,bA;f.fn.css=function(a,c){return f.access(this,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)},a,c,arguments.length>1)},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=by(a,"opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bu.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(by)return by(a,c)},swap:function(a,b,c){var d={},e,f;for(f in b)d[f]=a.style[f],a.style[f]=b[f];e=c.call(a);for(f in b)a.style[f]=d[f];return e}}),f.curCSS=f.css,c.defaultView&&c.defaultView.getComputedStyle&&(bz=function(a,b){var c,d,e,g,h=a.style;b=b.replace(br,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b))),!f.support.pixelMargin&&e&&bv.test(b)&&bt.test(c)&&(g=h.width,h.width=c,c=e.width,h.width=g);return c}),c.documentElement.currentStyle&&(bA=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f==null&&g&&(e=g[b])&&(f=e),bt.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),by=bz||bA,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth!==0?bB(a,b,d):f.swap(a,bw,function(){return bB(a,b,d)})},set:function(a,b){return bs.test(b)?b+"px":b}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bq.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bp,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bp.test(g)?g.replace(bp,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){return f.swap(a,{display:"inline-block"},function(){return b?by(a,"margin-right"):a.style.marginRight})}})}),f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)}),f.each({margin:"",padding:"",border:"Width"},function(a,b){f.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bx[d]+b]=e[d]||e[d-2]||e[0];return f}}});var bC=/%20/g,bD=/\[\]$/,bE=/\r?\n/g,bF=/#.*$/,bG=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bH=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bI=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bJ=/^(?:GET|HEAD)$/,bK=/^\/\//,bL=/\?/,bM=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bN=/^(?:select|textarea)/i,bO=/\s+/,bP=/([?&])_=[^&]*/,bQ=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bR=f.fn.load,bS={},bT={},bU,bV,bW=["*/"]+["*"];try{bU=e.href}catch(bX){bU=c.createElement("a"),bU.href="",bU=bU.href}bV=bQ.exec(bU.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bR)return bR.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bM,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bN.test(this.nodeName)||bH.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bE,"\r\n")}}):{name:b.name,value:c.replace(bE,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b$(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b$(a,b);return a},ajaxSettings:{url:bU,isLocal:bI.test(bV[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bW},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bY(bS),ajaxTransport:bY(bT),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?ca(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cb(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bG.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bF,"").replace(bK,bV[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bO),d.crossDomain==null&&(r=bQ.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bV[1]&&r[2]==bV[2]&&(r[3]||(r[1]==="http:"?80:443))==(bV[3]||(bV[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bZ(bS,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bJ.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bL.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bP,"$1_="+x);d.url=y+(y===d.url?(bL.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bW+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bZ(bT,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)b_(g,a[g],c,e);return d.join("&").replace(bC,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cc=f.now(),cd=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cc++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=typeof b.data=="string"&&/^application\/x\-www\-form\-urlencoded/.test(b.contentType);if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(cd.test(b.url)||e&&cd.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(cd,l),b.url===j&&(e&&(k=k.replace(cd,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var ce=a.ActiveXObject?function(){for(var a in cg)cg[a](0,1)}:!1,cf=0,cg;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ch()||ci()}:ch,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,ce&&delete cg[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n);try{m.text=h.responseText}catch(a){}try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cf,ce&&(cg||(cg={},f(a).unload(ce)),cg[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cj={},ck,cl,cm=/^(?:toggle|show|hide)$/,cn=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,co,cp=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cq;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(ct("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),(e===""&&f.css(d,"display")==="none"||!f.contains(d.ownerDocument.documentElement,d))&&f._data(d,"olddisplay",cu(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(ct("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(ct("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o,p,q;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]);if((k=f.cssHooks[g])&&"expand"in k){l=k.expand(a[g]),delete a[g];for(i in l)i in a||(a[i]=l[i])}}for(g in a){h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cu(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cm.test(h)?(q=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),q?(f._data(this,"toggle"+i,q==="show"?"hide":"show"),j[q]()):j[h]()):(m=cn.exec(h),n=j.cur(),m?(o=parseFloat(m[2]),p=m[3]||(f.cssNumber[i]?"":"px"),p!=="px"&&(f.style(this,i,(o||1)+p),n=(o||1)/j.cur()*n,f.style(this,i,n+p)),m[1]&&(o=(m[1]==="-="?-1:1)*o+n),j.custom(n,o,p)):j.custom(n,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:ct("show",1),slideUp:ct("hide",1),slideToggle:ct("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a){return a},swing:function(a){return-Math.cos(a*Math.PI)/2+.5}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cq||cr(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){f._data(e.elem,"fxshow"+e.prop)===b&&(e.options.hide?f._data(e.elem,"fxshow"+e.prop,e.start):e.options.show&&f._data(e.elem,"fxshow"+e.prop,e.end))},h()&&f.timers.push(h)&&!co&&(co=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cq||cr(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(co),co=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(cp.concat.apply([],cp),function(a,b){b.indexOf("margin")&&(f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)})}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cv,cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?cv=function(a,b,c,d){try{d=a.getBoundingClientRect()}catch(e){}if(!d||!f.contains(c,a))return d?{top:d.top,left:d.left}:{top:0,left:0};var g=b.body,h=cy(b),i=c.clientTop||g.clientTop||0,j=c.clientLeft||g.clientLeft||0,k=h.pageYOffset||f.support.boxModel&&c.scrollTop||g.scrollTop,l=h.pageXOffset||f.support.boxModel&&c.scrollLeft||g.scrollLeft,m=d.top+k-i,n=d.left+l-j;return{top:m,left:n}}:cv=function(a,b,c){var d,e=a.offsetParent,g=a,h=b.body,i=b.defaultView,j=i?i.getComputedStyle(a,null):a.currentStyle,k=a.offsetTop,l=a.offsetLeft;while((a=a.parentNode)&&a!==h&&a!==c){if(f.support.fixedPosition&&j.position==="fixed")break;d=i?i.getComputedStyle(a,null):a.currentStyle,k-=a.scrollTop,l-=a.scrollLeft,a===e&&(k+=a.offsetTop,l+=a.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(a.nodeName))&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),g=e,e=a.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),j=d}if(j.position==="relative"||j.position==="static")k+=h.offsetTop,l+=h.offsetLeft;f.support.fixedPosition&&j.position==="fixed"&&(k+=Math.max(c.scrollTop,h.scrollTop),l+=Math.max(c.scrollLeft,h.scrollLeft));return{top:k,left:l}},f.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){f.offset.setOffset(this,a,b)});var c=this[0],d=c&&c.ownerDocument;if(!d)return null;if(c===d.body)return f.offset.bodyOffset(c);return cv(c,d,d.documentElement)},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);f.fn[a]=function(e){return f.access(this,function(a,e,g){var h=cy(a);if(g===b)return h?c in h?h[c]:f.support.boxModel&&h.document.documentElement[e]||h.document.body[e]:a[e];h?h.scrollTo(d?f(h).scrollLeft():g,d?g:f(h).scrollTop()):a[e]=g},a,e,arguments.length,null)}}),f.each({Height:"height",Width:"width"},function(a,c){var d="client"+a,e="scroll"+a,g="offset"+a;f.fn["inner"+a]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,c,"padding")):this[c]():null},f.fn["outer"+a]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,c,a?"margin":"border")):this[c]():null},f.fn[c]=function(a){return f.access(this,function(a,c,h){var i,j,k,l;if(f.isWindow(a)){i=a.document,j=i.documentElement[d];return f.support.boxModel&&j||i.body&&i.body[d]||j}if(a.nodeType===9){i=a.documentElement;if(i[d]>=i[e])return i[d];return Math.max(a.body[e],i[e],a.body[g],i[g])}if(h===b){k=f.css(a,c),l=parseFloat(k);return f.isNumeric(l)?l:k}f(a).css(c,h)},c,a,arguments.length,null)}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);
/**
 * VexFlow Engraver 1.2 Custom
 * A library for rendering musical notation and guitar tablature in HTML5.
 *
 *                    http://www.vexflow.com
 *
 * Copyright (c) 2010 Mohit Muthanna Cheppudira <mohit@muthanna.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * This library makes use of Simon Tatham's awesome font - Gonville.
 *
 * Build ID: 0xFE@git rev-list --max-count=1 HEAD
 * Build date: 2013-10-17 17:32:41 -0700
 */
// Vex Base Libraries.
// Mohit Muthanna Cheppudira <mohit@muthanna.com>
//
// Copyright Mohit Muthanna Cheppudira 2010

/* global window: false */
/* global document: false */

function Vex() {}

/**
 * Enable debug mode for special-case code.
 *
 * @define {boolean}
 */
Vex.Debug = true;

/**
 * Logging levels available to this application.
 * @enum {number}
 */
Vex.LogLevels = {
  DEBUG: 5,
  INFO: 4,
  WARN: 3,
  ERROR: 2,
  FATAL: 1
};

/**
 * Set the debuglevel for this application.
 *
 * @define {number}
 */
Vex.LogLevel = 5;

/**
 * Logs a message to the console.
 *
 * @param {Vex.LogLevels} level A logging level.
 * @param {string|number|!Object} A log message (or object to dump).
 */
Vex.LogMessage = function(level, message) {
  if ((level <= Vex.LogLevel) && window.console) {
    var log_message = message;

    if (typeof(message) == 'object') {
      log_message = {
        level: level,
        message: message
      };
    } else {
      log_message = "VexLog: [" + level + "] " + log_message;
    }

    window.console.log(log_message);
  }
};

/**
 * Logging shortcuts.
 */
Vex.LogDebug = function(message) {
  Vex.LogMessage(Vex.LogLevels.DEBUG, message); };
Vex.LogInfo = function(message) {
  Vex.LogMessage(Vex.LogLevels.INFO, message); };
Vex.LogWarn = function(message) {
  Vex.LogMessage(Vex.LogLevels.WARN, message); };
Vex.LogError = function(message) {
  Vex.LogMessage(Vex.LogLevels.ERROR, message); };
Vex.LogFatal = function(message, exception) {
  Vex.LogMessage(Vex.LogLevels.FATAL, message);
  if (exception) throw exception; else throw "VexFatalError";
};
Vex.Log = Vex.LogDebug;
Vex.L = Vex.LogDebug;

/**
 * Simple assertion checks.
 */

/**
 * An exception for assertions.
 *
 * @constructor
 * @param {string} message The message to display.
 */
Vex.AssertException = function(message) { this.message = message; };
Vex.AssertException.prototype.toString = function() {
  return "AssertException: " + this.message;
};
Vex.Assert = function(exp, message) {
  if (Vex.Debug && !exp) {
    if (!message) message = "Assertion failed.";
    throw new Vex.AssertException(message);
  }
};

/**
 * An generic runtime exception. For example:
 *
 *    throw new Vex.RuntimeError("BadNoteError", "Bad note: " + note);
 *
 * @constructor
 * @param {string} message The exception message.
 */
Vex.RuntimeError = function(code, message) {
  this.code = code;
  this.message = message;
};
Vex.RuntimeError.prototype.toString = function() {
  return "RuntimeError: " + this.message;
};

Vex.RERR = Vex.RuntimeError;

/**
 * Merge "destination" hash with "source" hash, overwriting like keys
 * in "source" if necessary.
 */
Vex.Merge = function(destination, source) {
    for (var property in source)
        destination[property] = source[property];
    return destination;
};

/**
 * Min / Max: If you don't know what this does, you should be ashamed of yourself.
 */
Vex.Min = function(a, b) {
  return (a > b) ? b : a;
};

Vex.Max = function(a, b) {
  return (a > b) ? a : b;
};

// Round number to nearest fractional value (.5, .25, etc.)
Vex.RoundN = function(x, n) {
  return (x % n) >= (n/2) ? 
    parseInt(x / n, 10) * n + n : parseInt(x / n, 10) * n;
};

// Locate the mid point between stave lines. Returns a fractional line if a space
Vex.MidLine = function(a, b) {
  var mid_line = b + (a - b) / 2;
  if (mid_line % 2 > 0) {
    mid_line = Vex.RoundN(mid_line * 10, 5) / 10;
  }
  return mid_line;
};

/**
 * Take 'arr' and return a new list consisting of the sorted, unique,
 * contents of arr.
 */
Vex.SortAndUnique = function(arr, cmp, eq) {
  if (arr.length > 1) {
    var newArr = [];
    var last;
    arr.sort(cmp);

    for (var i = 0; i < arr.length; ++i) {
      if (i === 0 || !eq(arr[i], last)) {
        newArr.push(arr[i]);
      }
      last = arr[i];
    }

    return newArr;
  } else {
    return arr;
  }
};

/**
 * Check if array "a" contains "obj"
 */
Vex.Contains = function(a, obj) {
  var i = a.length;
  while (i--) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
};

/**
 * @param {string} canvas_sel The selector id for the canvas.
 * @return {!Object} A 2D canvas context.
 */
Vex.getCanvasContext = function(canvas_sel) {
  if (!canvas_sel)
    throw new Vex.RERR("BadArgument", "Invalid canvas selector: " + canvas_sel);

  var canvas = document.getElementById(canvas_sel);
  if (!(canvas && canvas.getContext)) {
    throw new Vex.RERR("UnsupportedBrowserError",
        "This browser does not support HTML5 Canvas");
  }

  return canvas.getContext('2d');
};

/**
 * Draw a tiny marker on the specified canvas. A great debugging aid.
 *
 * @param {!Object} ctx Canvas context.
 * @param {number} x X position for dot.
 * @param {number} y Y position for dot.
 */
Vex.drawDot = function(ctx, x, y, color) {
  var c = color || "#f55";
  ctx.save();
  ctx.fillStyle = c;

  //draw a circle
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

Vex.BM = function(s, f) {
  var start_time = new Date().getTime();
  f();
  var elapsed = new Date().getTime() - start_time;
  Vex.L(s + elapsed + "ms");
};

/**
 * Basic classical inheritance helper. Usage:
 *
 * Vex.Inherit(Child, Parent, {
 *    getName: function() {return this.name;},
 *    setName: function(name) {this.name = name}
 * });
 *
 * Returns Child.
 */
Vex.Inherit = (function () {
  var F = function () {};
  return function (C, P, O) {
    F.prototype = P.prototype;
    C.prototype = new F();
    C.superclass = P.prototype;
    C.prototype.constructor = C;
    Vex.Merge(C.prototype, O );
    return C;
  };
}());/**
 * Vex Flow - Mohit Muthanna <mohit@muthanna.com>
 */

/**
 * New namespace.
 */
Vex.Flow = {
  /**
   * The resolution used for all the rhythm timing in this
   * library.
   *
   * @const
   * @type {number}
   */
  RESOLUTION: 16384,

  /* Kerning (DEPRECATED) */
  IsKerned: true
};
// Fraction class that represents a rational number
// @author zz85
// @author incompleteopus (modifications)

Vex.Flow.Fraction = (function() {
  function Fraction(numerator, denominator) {
    this.set(numerator, denominator);
  }

  /**
   * GCD: Find greatest common divisor using Euclidean algorithm
   */
  Fraction.GCD = function(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
      throw new Vex.RERR("BadArgument", "Invalid numbers: " + a + ", " + b);
    }

    var t;

    while (b !== 0) {
      t = b;
      b = a % b;
      a = t;
    }

    return a;
  };

  /**
   * LCM: Lowest common multiple
   */
  Fraction.LCM = function(a, b) {
    return ((a * b) / Fraction.GCD(a, b));
  };

  /**
   * LCMM: Lowest common multiple for more than two numbers
   */
  Fraction.LCMM = function(args) {
    if (args.length === 0) {
      return 0;
    } else if (args.length == 1) {
      return args[0];
    } else if (args.length == 2) {
      return Vex.Flow.Fraction.LCM(args[0], args[1]);
    } else {
      var arg0 = args[0];
      args.shift();
      return Fraction.LCM(arg0, Vex.Flow.Fraction.LCMM(args));
    }
  };

  Fraction.prototype = {
    set: function(numerator, denominator) {
      this.numerator = numerator === undefined ? 1 : numerator;
      this.denominator = denominator === undefined ? 1 : denominator;
      return this;
    },

    value: function() {
      return this.numerator / this.denominator;
    },

    simplify: function() {
      var u = this.numerator;
      var d = this.denominator;

      var gcd = Vex.Flow.Fraction.GCD(u, d);
      u /= gcd;
      d /= gcd;

      if (d < 0) {
        d = -d;
        u = -u;
      }
      return this.set(u, d);
    },

    add: function(param1, param2) {
      var otherNumerator;
      var otherDenominator;

      if (param1 instanceof Vex.Flow.Fraction) {
        otherNumerator = param1.numerator;
        otherDenominator = param1.denominator;
      } else {
        if (param1 !== undefined) {
          otherNumerator = param1;
        } else {
          otherNumerator = 0;
        }

        if (param2 !== undefined) {
          otherDenominator = param2;
        } else {
          otherDenominator = 1;
        }
      }

      var lcm = Vex.Flow.Fraction.LCM(this.denominator, otherDenominator);
      var a = lcm / this.denominator;
      var b = lcm / otherDenominator;

      var u = this.numerator * a + otherNumerator * b;
      return this.set(u, lcm);
    },

    subtract: function(param1, param2) {
      var otherNumerator;
      var otherDenominator;

      if (param1 instanceof Vex.Flow.Fraction) {
        otherNumerator = param1.numerator;
        otherDenominator = param1.denominator;
      } else {
        if (param1 !== undefined) {
          otherNumerator = param1;
        } else {
          otherNumerator = 0;
        }

        if (param2 !== undefined) {
          otherDenominator = param2;
        } else {
          otherDenominator = 1;
        }
      }

      var lcm = Vex.Flow.Fraction.LCM(this.denominator, otherDenominator);
      var a = lcm / this.denominator;
      var b = lcm / otherDenominator;

      var u = this.numerator * a - otherNumerator * b;
      return this.set(u, lcm);
    },

    multiply: function(param1, param2) {
      var otherNumerator;
      var otherDenominator;

      if (param1 instanceof Vex.Flow.Fraction) {
        otherNumerator = param1.numerator;
        otherDenominator = param1.denominator;
      } else {
        if (param1 !== undefined) {
          otherNumerator = param1;
        } else {
          otherNumerator = 1;
        }

        if (param2 !== undefined) {
          otherDenominator = param2;
        } else {
          otherDenominator = 1;
        }
      }

      return this.set(this.numerator * otherNumerator, this.denominator * otherDenominator);
    },

    divide: function(param1, param2) {
      var otherNumerator;
      var otherDenominator;

      if (param1 instanceof Vex.Flow.Fraction) {
        otherNumerator = param1.numerator;
        otherDenominator = param1.denominator;
      } else {
        if (param1 !== undefined) {
          otherNumerator = param1;
        } else {
          otherNumerator = 1;
        }

        if (param2 !== undefined) {
          otherDenominator = param2;
        } else {
          otherDenominator = 1;
        }
      }

      return this.set(this.numerator * otherDenominator, this.denominator * otherNumerator);
    },


    // Simplifies both sides and checks if they are equal
    equals: function(compare) {
      var a = Vex.Flow.Fraction.__compareA.copy(compare).simplify();
      var b = Vex.Flow.Fraction.__compareB.copy(this).simplify();

      return (a.numerator === b.numerator) && (a.denominator === b.denominator);
    },

    // Creates a new copy with this current values
    clone: function() {
      return new Vex.Flow.Fraction(this.numerator, this.denominator);
    },

    // Copies value of another Fraction into itself
    copy: function(copy) {
      return this.set(copy.numerator, copy.denominator);
    },

    // Returns the integer component eg. (4/2) == 2
    quotient: function() {
      return Math.floor(this.numerator / this.denominator);
    },

    // Returns the fraction component when reduced to a mixed number
    fraction: function() {
      return this.numerator % this.denominator;
    },

    // Returns the absolute value
    abs: function() {
      this.denominator = Math.abs(this.denominator);
      this.numerator = Math.abs(this.numerator);
      return this;
    },

    // Returns a raw string representation
    toString: function() {
      return this.numerator + '/' + this.denominator;
    },

    // Returns a simplified string respresentation
    toSimplifiedString: function() {
      return Vex.Flow.Fraction.__tmp.copy(this).simplify().toString();
    },

    // Returns string representation in mixed form
    toMixedString: function() {
      var s = '';
      var q = this.quotient();
      var f = Vex.Flow.Fraction.__tmp.copy(this);

      if (q < 0) {
        f.abs().fraction();
      } else {
        f.fraction();
      }

      if (q !== 0) {
        s += q;

        if (f.numerator !== 0) {
          s += ' ' + f.toSimplifiedString();
        }
      } else {
        if (f.numerator === 0) {
          s = '0';
        } else {
          s = f.toSimplifiedString();
        }
      }

      return s;
    },

    // Parses a fraction string
    parse: function(str) {
      var i = str.split('/');
      var n = parseInt(i[0], 0);
      var d = (i[1]) ? parseInt(i[1], 0) : 1;

      return this.set(n, d);
    }
  };

  // Temporary cached objects
  Fraction.__compareA = new Fraction();
  Fraction.__compareB = new Fraction();
  Fraction.__tmp = new Fraction();

  return Fraction;
}());

// Vex Flow Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010
//
// Requires vex.js.

Vex.Flow.clefProperties = function(clef) {
  if (!clef) throw new Vex.RERR("BadArgument", "Invalid clef: " + clef);

  var props = Vex.Flow.clefProperties.values[clef];
  if (!props) throw new Vex.RERR("BadArgument", "Invalid clef: " + clef);

  return props;
};

Vex.Flow.clefProperties.values = {
  'treble':  { line_shift: 0 },
  'bass':    { line_shift: 6 },
  'tenor':   { line_shift: 4 },
  'alto':    { line_shift: 3 },
  'percussion': { line_shift: 0 }
};

/*
  Take a note in the format "Key/Octave" (e.g., "C/5") and return properties.
*/
Vex.Flow.keyProperties = function(key, clef) {
  if (clef === undefined) {
    clef = 'treble';
  }

  var pieces = key.split("/");

  if (pieces.length < 2) {
    throw new Vex.RERR("BadArguments",
        "Key must have note + octave and an optional glyph: " + key);
  }

  var k = pieces[0].toUpperCase();
  var value = Vex.Flow.keyProperties.note_values[k];
  if (!value) throw new Vex.RERR("BadArguments", "Invalid key name: " + k);
  if (value.octave) pieces[1] = value.octave;

  var o = pieces[1];
  var base_index = (o * 7) - (4 * 7);
  var line = (base_index + value.index) / 2;
  line += Vex.Flow.clefProperties(clef).line_shift;

  var stroke = 0;

  if (line <= 0 && (((line * 2) % 2) === 0)) stroke = 1;  // stroke up
  if (line >= 6 && (((line * 2) % 2) === 0)) stroke = -1; // stroke down

  // Integer value for note arithmetic.
  var int_value = (typeof(value.int_val)!='undefined') ? (o * 12) +
    value.int_val : null;

  /* Check if the user specified a glyph. */
  var code = value.code;
  var shift_right = value.shift_right;
  if ((pieces.length > 2) && (pieces[2])) {
    var glyph_name = pieces[2].toUpperCase();
    var note_glyph = Vex.Flow.keyProperties.note_glyph[glyph_name];
    if (note_glyph) {
      code = note_glyph.code;
      shift_right = note_glyph.shift_right;
    }
  }

  return {
    key: k,
    octave: o,
    line: line,
    int_value: int_value,
    accidental: value.accidental,
    code: code,
    stroke: stroke,
    shift_right: shift_right,
    displaced: false
  };
};

Vex.Flow.keyProperties.note_values = {
  'C':  { index: 0, int_val: 0, accidental: null },
  'CN': { index: 0, int_val: 0, accidental: "n" },
  'C#': { index: 0, int_val: 1, accidental: "#" },
  'C##': { index: 0, int_val: 2, accidental: "##" },
  'CB': { index: 0, int_val: -1, accidental: "b" },
  'CBB': { index: 0, int_val: -2, accidental: "bb" },
  'D':  { index: 1, int_val: 2, accidental: null },
  'DN': { index: 1, int_val: 2, accidental: "n" },
  'D#': { index: 1, int_val: 3, accidental: "#" },
  'D##': { index: 1, int_val: 4, accidental: "##" },
  'DB': { index: 1, int_val: 1, accidental: "b" },
  'DBB': { index: 1, int_val: 0, accidental: "bb" },
  'E':  { index: 2, int_val: 4, accidental: null },
  'EN': { index: 2, int_val: 4, accidental: "n" },
  'E#': { index: 2, int_val: 5, accidental: "#" },
  'E##': { index: 2, int_val: 6, accidental: "##" },
  'EB': { index: 2, int_val: 3, accidental: "b" },
  'EBB': { index: 2, int_val: 2, accidental: "bb" },
  'F':  { index: 3, int_val: 5, accidental: null },
  'FN': { index: 3, int_val: 5, accidental: "n" },
  'F#': { index: 3, int_val: 6, accidental: "#" },
  'F##': { index: 3, int_val: 7, accidental: "##" },
  'FB': { index: 3, int_val: 4, accidental: "b" },
  'FBB': { index: 3, int_val: 3, accidental: "bb" },
  'G':  { index: 4, int_val: 7, accidental: null },
  'GN': { index: 4, int_val: 7, accidental: "n" },
  'G#': { index: 4, int_val: 8, accidental: "#" },
  'G##': { index: 4, int_val: 9, accidental: "##" },
  'GB': { index: 4, int_val: 6, accidental: "b" },
  'GBB': { index: 4, int_val: 5, accidental: "bb" },
  'A':  { index: 5, int_val: 9, accidental: null },
  'AN': { index: 5, int_val: 9, accidental: "n" },
  'A#': { index: 5, int_val: 10, accidental: "#" },
  'A##': { index: 5, int_val: 11, accidental: "##" },
  'AB': { index: 5, int_val: 8, accidental: "b" },
  'ABB': { index: 5, int_val: 7, accidental: "bb" },
  'B':  { index: 6, int_val: 11, accidental: null },
  'BN': { index: 6, int_val: 11, accidental: "n" },
  'B#': { index: 6, int_val: 12, accidental: "#" },
  'B##': { index: 6, int_val: 13, accidental: "##" },
  'BB': { index: 6, int_val: 10, accidental: "b" },
  'BBB': { index: 6, int_val: 9, accidental: "bb" },
  'R': { index: 6, int_val: 9, rest: true }, // Rest
  'X':  {
    index: 6,
    accidental: "",
    octave: 4,
    code: "v3e",
    shift_right: 5.5
  }
};

Vex.Flow.keyProperties.note_glyph = {
  /* Diamond */
  'D0':  { code: "v27", shift_right: -0.5 },
  'D1':  { code: "v2d", shift_right: -0.5 },
  'D2':  { code: "v22", shift_right: -0.5 },
  'D3':  { code: "v70", shift_right: -0.5 },

  /* Triangle */
  'T0':  { code: "v49", shift_right: -2 },
  'T1':  { code: "v93", shift_right: 0.5 },
  'T2':  { code: "v40", shift_right: 0.5 },
  'T3':  { code: "v7d", shift_right: 0.5 },

  /* Cross */
  'X0':  { code: "v92", shift_right: -2 },
  'X1':  { code: "v95", shift_right: -0.5 },
  'X2':  { code: "v7f", shift_right: 0.5 },
  'X3':  { code: "v3b", shift_right: -2 }
};

Vex.Flow.integerToNote = function(integer) {
  if (typeof(integer) == "undefined")
    throw new Vex.RERR("BadArguments", "Undefined integer for integerToNote");

  if (integer < -2)
    throw new Vex.RERR("BadArguments",
        "integerToNote requires integer > -2: " + integer);

  var noteValue = Vex.Flow.integerToNote.table[integer];
  if (!noteValue)
    throw new Vex.RERR("BadArguments", "Unkown note value for integer: " +
        integer);

  return noteValue;
};

Vex.Flow.integerToNote.table = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B"
};


Vex.Flow.tabToGlyph = function(fret) {
  var glyph = null;
  var width = 0;
  var shift_y = 0;

  if (fret.toString().toUpperCase() == "X") {
    glyph = "v7f";
    width = 7;
    shift_y = -4.5;
  } else {
    width = Vex.Flow.textWidth(fret.toString());
  }

  return {
    text: fret,
    code: glyph,
    width: width,
    shift_y: shift_y
  };
};

Vex.Flow.textWidth = function(text) {
  return 6 * text.toString().length;
};

Vex.Flow.articulationCodes = function(artic) {
  return Vex.Flow.articulationCodes.articulations[artic];
};

Vex.Flow.articulationCodes.articulations = {
  "a.": {   // Staccato
    code: "v23",
    width: 4,
    shift_right: -2,
    shift_up: 8,
    shift_down: 0,
    between_lines: true
  },
  "av": {   // Staccatissimo
    code: "v28",
    width: 4,
    shift_right: 0,
    shift_up: 11,
    shift_down: 5,
    between_lines: true
  },
  "a>": {   // Accent
    code: "v42",
    width: 10,
    shift_right: 5,
    shift_up: 8,
    shift_down: 1,
    between_lines: true
  },
  "a-": {   // Tenuto
    code: "v25",
    width: 9,
    shift_right: -4,
    shift_up: 17,
    shift_down: 10,
    between_lines: true
  },
  "a^": {   // Marcato
    code: "va",
    width: 8,
    shift_right: 0,
    shift_up: -4,
    shift_down: -2,
    between_lines: false
  },
  "a+": {   // Left hand pizzicato
    code: "v8b",
    width: 9,
    shift_right: -4,
    shift_up: 12,
    shift_down: 12,
    between_lines: false
  },
  "ao": {   // Snap pizzicato
    code: "v94",
    width: 8,
    shift_right: 0,
    shift_up: -4,
    shift_down: 6,
    between_lines: false
  },
  "ah": {   // Natural harmonic or open note
    code: "vb9",
    width: 7,
    shift_right: 0,
    shift_up: -4,
    shift_down: 4,
    between_lines: false
  },
  "a@a": {   // Fermata above staff
    code: "v43",
    width: 25,
    shift_right: 0,
    shift_up: 8,
    shift_down: 10,
    between_lines: false
  },
  "a@u": {   // Fermata below staff
    code: "v5b",
    width: 25,
    shift_right: 0,
    shift_up: 0,
    shift_down: -4,
    between_lines: false
  },
  "a|": {   // Bow up - up stroke
    code: "v75",
    width: 8,
    shift_right: 0,
    shift_up: 8,
    shift_down: 10,
    between_lines: false
  },
  "am": {   // Bow down - down stroke
    code: "v97",
    width: 13,
    shift_right: 0,
    shift_up: 10,
    shift_down: 12,
    between_lines: false
  },
  "a,": {   // Choked
    code: "vb3",
    width: 6,
    shift_right: 8,
    shift_up: -4,
    shift_down: 4,
    between_lines: false
  }
};

Vex.Flow.accidentalCodes = function(acc) {
  return Vex.Flow.accidentalCodes.accidentals[acc];
};

Vex.Flow.accidentalCodes.accidentals = {
  "#": {
    code: "v18",
    width: 10,
    shift_right: 0,
    shift_down: 0
  },
  "##": {
    code: "v7f",
    width: 13,
    shift_right: -1,
    shift_down: 0
  },
  "b": {
    code: "v44",
    width: 8,
    shift_right: 0,
    shift_down: 0
  },
  "bb": {
    code: "v26",
    width: 14,
    shift_right: -3,
    shift_down: 0
  },
  "n": {
    code: "v4e",
    width: 8,
    shift_right: 0,
    shift_down: 0
  },
  "{": {   // Left paren for cautionary accidentals
    code: "v9c",
    width: 5,
    shift_right: 2,
    shift_down: 0
  },
  "}": {   // Right paren for cautionary accidentals
    code: "v84",
    width: 5,
    shift_right: 0,
    shift_down: 0
  }
};

Vex.Flow.keySignature = function(spec) {
  var keySpec = Vex.Flow.keySignature.keySpecs[spec];

  if (!keySpec) {
    throw new Vex.RERR("BadKeySignature",
        "Bad key signature spec: '" + spec + "'");
  }

  if (!keySpec.acc) {
    return [];
  }

  var code = Vex.Flow.accidentalCodes.accidentals[keySpec.acc].code;
  var notes = Vex.Flow.keySignature.accidentalList(keySpec.acc);

  var acc_list = [];
  for (var i = 0; i < keySpec.num; ++i) {
    var line = notes[i];
    acc_list.push({glyphCode: code, line: line});
  }

  return acc_list;
};

Vex.Flow.keySignature.keySpecs = {
  "C": {acc: null, num: 0},
  "Am": {acc: null, num: 0},
  "F": {acc: "b", num: 1},
  "Dm": {acc: "b", num: 1},
  "Bb": {acc: "b", num: 2},
  "Gm": {acc: "b", num: 2},
  "Eb": {acc: "b", num: 3},
  "Cm": {acc: "b", num: 3},
  "Ab": {acc: "b", num: 4},
  "Fm": {acc: "b", num: 4},
  "Db": {acc: "b", num: 5},
  "Bbm": {acc: "b", num: 5},
  "Gb": {acc: "b", num: 6},
  "Ebm": {acc: "b", num: 6},
  "Cb": {acc: "b", num: 7},
  "Abm": {acc: "b", num: 7},
  "G": {acc: "#", num: 1},
  "Em": {acc: "#", num: 1},
  "D": {acc: "#", num: 2},
  "Bm": {acc: "#", num: 2},
  "A": {acc: "#", num: 3},
  "F#m": {acc: "#", num: 3},
  "E": {acc: "#", num: 4},
  "C#m": {acc: "#", num: 4},
  "B": {acc: "#", num: 5},
  "G#m": {acc: "#", num: 5},
  "F#": {acc: "#", num: 6},
  "D#m": {acc: "#", num: 6},
  "C#": {acc: "#", num: 7},
  "A#m": {acc: "#", num: 7}
};

Vex.Flow.keySignature.accidentalList = function(acc) {
  if (acc == "b") {
    return [2, 0.5, 2.5, 1, 3, 1.5, 3.5];
  }
  else if (acc == "#") {
    return [0, 1.5, -0.5, 1, 2.5, 0.5, 2]; }
};

Vex.Flow.parseNoteDurationString = function(durationString) {
  if (typeof(durationString) !== "string") {
    return null;
  }

  var regexp = /(\d+|[a-z])(d*)([nrhms]|$)/;

  var result = regexp.exec(durationString);
  if (!result) {
    return null;
  }

  var duration = result[1];
  var dots = result[2].length;
  var type = result[3];

  if (type.length === 0) {
    type = "n";
  }

  return {
    duration: duration,
    dots: dots,
    type: type
  };
};

Vex.Flow.parseNoteData = function(noteData) {
  var duration = noteData.duration;

  // Preserve backwards-compatibility
  var durationStringData = Vex.Flow.parseNoteDurationString(duration);
  if (!durationStringData) {
    return null;
  }

  var ticks = Vex.Flow.durationToTicks(durationStringData.duration);
  if (ticks == null) {
    return null;
  }

  var type = noteData.type;

  if (type) {
    if (!(type === "n" || type === "r" || type === "h" ||
          type === "m" || type === "s")) {
      return null;
    }
  } else {
    type = durationStringData.type;
    if (!type) {
      type = "n";
    }
  }

  var dots = 0;
  if (noteData.dots) {
    dots = noteData.dots;
  } else {
    dots = durationStringData.dots;
  }

  if (typeof(dots) !== "number") {
    return null;
  }

  var currentTicks = ticks;

  for (var i = 0; i < dots; i++) {
    if (currentTicks <= 1) {
      return null;
    }

    currentTicks = currentTicks / 2;
    ticks += currentTicks;
  }

  return {
    duration: durationStringData.duration,
    type: type,
    dots: dots,
    ticks: ticks
  };
};

Vex.Flow.durationToTicks = function(duration) {
  var alias = Vex.Flow.durationAliases[duration];
  if (alias !== undefined) {
    duration = alias;
  }

  var ticks = Vex.Flow.durationToTicks.durations[duration];
  if (ticks === undefined) {
    return null;
  }

  return ticks;
};

Vex.Flow.durationToTicks.durations = {
  "1":    Vex.Flow.RESOLUTION / 1,
  "2":    Vex.Flow.RESOLUTION / 2,
  "4":    Vex.Flow.RESOLUTION / 4,
  "8":    Vex.Flow.RESOLUTION / 8,
  "16":   Vex.Flow.RESOLUTION / 16,
  "32":   Vex.Flow.RESOLUTION / 32,
  "64":   Vex.Flow.RESOLUTION / 64,
  "128":  Vex.Flow.RESOLUTION / 128,
  "256":  Vex.Flow.RESOLUTION / 256
};

Vex.Flow.durationAliases = {
  "w": "1",
  "h": "2",
  "q": "4",

  // This is the default duration used to render bars (BarNote). Bars no longer
  // consume ticks, so this should be a no-op.
  //
  // TODO(0xfe): This needs to be cleaned up.
  "b": "256"
};

Vex.Flow.durationToGlyph = function(duration, type) {
  var alias = Vex.Flow.durationAliases[duration];
  if (alias !== undefined) {
    duration = alias;
  }

  var code = Vex.Flow.durationToGlyph.duration_codes[duration];
  if (code === undefined) {
    return null;
  }

  if (!type) {
    type = "n";
  }

  var glyphTypeProperties = code.type[type];
  if (glyphTypeProperties === undefined) {
    return null;
  }

  return Vex.Merge(Vex.Merge({}, code.common), glyphTypeProperties);
};

Vex.Flow.durationToGlyph.duration_codes = {
  "1": {
    common: {
      head_width: 15.5,
      stem: false,
      stem_offset: 0,
      flag: false,
      dot_shiftY: 0,
      line_above: 0,
      line_below: 0
    },
    type: {
      "n": { // Whole note
        code_head: "v1d"
      },
      "h": { // Whole note harmonic
        code_head: "v46"
      },
      "m": { // Whole note muted
        code_head: "v92",
        stem_offset: -3
      },
      "r": { // Whole rest
        code_head: "v5c",
        head_width: 12.5,
        rest: true,
        position: "D/5,",
        dot_shiftY: 0.5
      },
      "s": { // Whole note slash
        // Drawn with canvas primitives
        head_width: 15,
        position: "B/4"
      }
    }
  },
  "2": {
    common: {
      head_width: 9.5,
      stem: true,
      stem_offset: 0,
      flag: false,
      dot_shiftY: 0,
      line_above: 0,
      line_below: 0
    },
    type: {
      "n": { // Half note
        code_head: "v81"
      },
      "h": { // Half note harmonic
        code_head: "v2d"
      },
      "m": { // Half note muted
        code_head: "v95",
        stem_offset: -3
      },
      "r": { // Half rest
        code_head: "vc",
        head_width: 12.5,
        stem: false,
        rest: true,
        position: "B/4",
        dot_shiftY: -0.5
      },
      "s": { // Half note slash
        // Drawn with canvas primitives
        head_width: 15,
        position: "B/4"
      }
    }
  },
  "4": {
    common: {
      head_width: 9.5,
      stem: true,
      stem_offset: 0,
      flag: false,
      dot_shiftY: 0,
      line_above: 0,
      line_below: 0
    },
    type: {
      "n": { // Quarter note
        code_head: "vb"
      },
      "h": { // Quarter harmonic
        code_head: "v22"
      },
      "m": { // Quarter muted
        code_head: "v3e",
        stem_offset: -3
      },
      "r": { // Quarter rest
        code_head: "v7c",
        head_width: 8,
        stem: false,
        rest: true,
        position: "B/4",
        dot_shiftY: -0.5,
        line_above: 1.5,
        line_below: 1.5
      },
      "s": { // Quarter slash
         // Drawn with canvas primitives
         head_width: 15,
         position: "B/4"
      }
    }
  },
  "8": {
    common: {
      head_width: 9.5,
      stem: true,
      stem_offset: 0,
      flag: true,
      beam_count: 1,
      code_flag_upstem: "v54",
      code_flag_downstem: "v9a",
      dot_shiftY: 0,
      line_above: 0,
      line_below: 0
    },
    type: {
      "n": { // Eighth note
        code_head: "vb"
      },
      "h": { // Eighth note harmonic
        code_head: "v22"
      },
      "m": { // Eighth note muted
        code_head: "v3e"
      },
      "r": { // Eighth rest
        code_head: "va5",
        stem: false,
        flag: false,
        rest: true,
        position: "B/4",
        dot_shiftY: -0.5,
        line_above: 1.0,
        line_below: 1.0
      },
      "s": { // Eight slash
        // Drawn with canvas primitives
        head_width: 15,
        position: "B/4"
      }
    }
  },
  "16": {
    common: {
      beam_count: 2,
      head_width: 9.5,
      stem: true,
      stem_offset: 0,
      flag: true,
      code_flag_upstem: "v3f",
      code_flag_downstem: "v8f",
      dot_shiftY: 0,
      line_above: 0,
      line_below: 0
    },
    type: {
      "n": { // Sixteenth note
        code_head: "vb"
      },
      "h": { // Sixteenth note harmonic
        code_head: "v22"
      },
      "m": { // Sixteenth note muted
        code_head: "v3e"
      },
      "r": { // Sixteenth rest
        code_head: "v3c",
        head_width: 13,
        stem: false,
        flag: false,
        rest: true,
        position: "B/4",
        dot_shiftY: -0.5,
        line_above: 1.0,
        line_below: 2.0
      },
      "s": { // Sixteenth slash
        // Drawn with canvas primitives
        head_width: 15,
        position: "B/4"
      }
    }
  },
  "32": {
    common: {
      beam_count: 3,
      head_width: 9.5,
      stem: true,
      stem_offset: 0,
      flag: true,
      code_flag_upstem: "v47",
      code_flag_downstem: "v2a",
      dot_shiftY: 0,
      line_above: 0,
      line_below: 0
    },
    type: {
      "n": { // Thirty-second note
        code_head: "vb"
      },
      "h": { // Thirty-second harmonic
        code_head: "v22"
      },
      "m": { // Thirty-second muted
        code_head: "v3e"
      },
      "r": { // Thirty-second rest
        code_head: "v55",
        head_width: 16,
        stem: false,
        flag: false,
        rest: true,
        position: "B/4",
        dot_shiftY: -1.5,
        line_above: 2.0,
        line_below: 2.0
      },
      "s": { // Thirty-second slash
        // Drawn with canvas primitives
        head_width: 15,
        position: "B/4"
      }
    }
  },
  "64": {
    common: {
      beam_count: 4,
      head_width: 9.5,
      stem: true,
      stem_offset: 0,
      flag: true,
      code_flag_upstem: "va9",
      code_flag_downstem: "v58",
      dot_shiftY: 0,
      line_above: 0,
      line_below: 0
    },
    type: {
      "n": { // Sixty-fourth note
        code_head: "vb"
      },
      "h": { // Sixty-fourth harmonic
        code_head: "v22"
      },
      "m": { // Sixty-fourth muted
        code_head: "v3e"
      },
      "r": { // Sixty-fourth rest
        code_head: "v38",
        head_width: 18,
        stem: false,
        flag: false,
        rest: true,
        position: "B/4",
        dot_shiftY: -1.5,
        line_above: 2.0,
        line_below: 3.0
      },
      "s": { // Sixty-fourth slash
        // Drawn with canvas primitives
        head_width: 15,
        position: "B/4"
      }
    }
  },
  "128": {
      common: {
          beam_count: 5,
          head_width: 9.5,
          stem: true,
          stem_offset:0,
          flag: true,
          code_flag_upstem: "v9b",
          code_flag_downstem: "v30",
          dot_shiftY: 0,
          line_above: 0,
          line_below: 0
      },
      type: {
          "n": {  // Hundred-twenty-eight note
              code_head: "vb"
          },
          "h": { // Hundred-twenty-eight harmonic
              code_head: "v22"
          },
          "m": { // Hundred-twenty-eight muted
              code_head: "v3e"
          },
          "r": {  // Hundred-twenty-eight rest
              code_head: "vaa",
              head_width: 20,
              stem: false,
              flag: false,
              rest: true,
              position: "B/4",
              dot_shiftY: 1.5,
              line_above: 2.0,
              line_below: 3.0
          },
          "s": { // Hundred-twenty-eight rest
              // Drawn with canvas primitives
              head_width: 15,
              position: "B/4"
          }
      }
  }
};

// Some defaults
Vex.Flow.TIME4_4 = {
  num_beats: 4,
  beat_value: 4,
  resolution: Vex.Flow.RESOLUTION
};

Vex.Flow.STEM_WIDTH = 1.5;
Vex.Flow.STAVE_LINE_THICKNESS = 2;

Vex.Flow.Font = {
    "glyphs": {
        "v0": {
            "x_min": 0,
            "x_max": 514.5,
            "ha": 525,
            "o": "m 236 648 b 246 648 238 648 242 648 b 288 646 261 648 283 648 b 472 513 364 634 428 587 b 514 347 502 464 514 413 b 462 163 514 272 499 217 b 257 44 409 83 333 44 b 50 163 181 44 103 83 b 0 347 14 217 0 272 b 40 513 0 413 12 464 b 236 648 87 591 155 638 m 277 614 b 253 616 273 616 261 616 b 242 616 247 616 243 616 b 170 499 193 609 181 589 b 159 348 163 446 159 398 b 166 222 159 308 161 266 b 201 91 174 138 183 106 b 257 76 215 81 235 76 b 311 91 277 76 299 81 b 347 222 330 106 338 138 b 353 348 352 266 353 308 b 344 499 353 398 351 446 b 277 614 333 587 322 606 m 257 -1 l 258 -1 l 255 -1 l 257 -1 m 257 673 l 258 673 l 255 673 l 257 673 "
        },
        "v1": {
            "x_min": -1.359375,
            "x_max": 344.359375,
            "ha": 351,
            "o": "m 126 637 l 129 638 l 198 638 l 266 638 l 269 635 b 274 631 272 634 273 632 l 277 627 l 277 395 b 279 156 277 230 277 161 b 329 88 281 123 295 106 b 344 69 341 81 344 79 b 337 55 344 62 343 59 l 333 54 l 197 54 l 61 54 l 58 55 b 50 69 53 59 50 62 b 65 88 50 79 53 81 b 80 97 72 91 74 93 b 117 156 103 113 112 129 b 117 345 117 161 117 222 l 117 528 l 100 503 l 38 406 b 14 383 24 384 23 383 b -1 398 5 383 -1 390 b 4 415 -1 403 1 409 b 16 437 5 416 10 426 l 72 539 l 100 596 b 121 632 119 631 119 631 b 126 637 122 634 125 635 m 171 -1 l 172 -1 l 170 -1 l 171 -1 m 171 673 l 172 673 l 170 673 l 171 673 "
        },
        "v2": {
            "x_min": -1.359375,
            "x_max": 458.6875,
            "ha": 468,
            "o": "m 197 648 b 216 648 201 648 208 648 b 258 646 232 648 253 648 b 419 546 333 637 393 599 b 432 489 428 528 432 509 b 356 342 432 440 405 384 b 235 278 322 313 288 295 b 69 170 166 256 107 217 b 69 169 69 170 69 169 b 69 169 69 169 69 169 b 74 173 69 169 72 170 b 209 222 112 204 163 222 b 310 195 247 222 274 215 b 371 179 332 184 352 179 b 396 181 379 179 387 179 b 428 202 409 184 423 194 b 442 212 431 209 436 212 b 458 197 450 212 458 206 b 441 148 458 190 449 165 b 299 44 409 84 353 44 b 288 45 295 44 292 44 b 250 61 274 45 268 49 b 122 99 212 86 164 99 b 73 91 104 99 88 97 b 28 63 53 84 34 72 b 14 54 25 56 20 54 b 1 62 9 54 4 56 l -1 65 l -1 79 b 0 99 -1 91 0 95 b 2 113 1 102 2 108 b 164 309 20 197 81 272 b 285 470 232 341 277 398 b 287 487 287 476 287 481 b 171 595 287 551 239 595 b 155 595 166 595 160 595 b 142 592 145 594 142 594 b 145 589 142 592 142 591 b 179 527 168 576 179 551 b 132 455 179 496 163 467 b 104 451 122 452 112 451 b 27 530 62 451 27 487 b 29 555 27 538 27 546 b 197 648 44 601 115 639 m 228 -1 l 230 -1 l 227 -1 l 228 -1 m 228 673 l 230 673 l 227 673 l 228 673 "
        },
        "v3": {
            "x_min": -1.359375,
            "x_max": 409.6875,
            "ha": 418,
            "o": "m 174 648 b 191 648 176 648 183 648 b 225 648 204 648 220 648 b 402 523 317 638 389 588 b 404 503 404 517 404 510 b 402 484 404 495 404 488 b 264 373 389 437 334 394 b 257 370 259 371 257 371 b 257 370 257 370 257 370 b 264 369 258 370 261 369 b 409 202 359 334 409 267 b 318 72 409 152 381 104 b 200 43 281 52 240 43 b 23 113 134 43 69 68 b 0 169 6 129 0 149 b 77 249 0 210 29 249 l 77 249 b 152 174 125 249 152 212 b 103 102 152 145 137 116 b 103 102 103 102 103 102 b 147 94 103 101 132 95 b 153 94 149 94 151 94 b 265 206 219 94 265 141 b 264 226 265 213 265 219 b 147 355 253 299 204 353 b 126 371 133 356 126 362 b 147 388 126 383 132 388 b 254 474 196 391 238 424 b 259 502 258 484 259 494 b 182 592 259 544 228 582 b 156 595 175 595 166 595 b 115 592 142 595 129 594 l 111 591 l 115 588 b 152 524 141 574 152 549 b 92 449 152 491 130 458 b 76 448 87 448 81 448 b -1 530 32 448 -1 488 b 20 581 -1 548 5 566 b 174 648 55 619 108 641 m 204 -1 l 205 -1 l 202 -1 l 204 -1 m 204 673 l 205 673 l 202 673 l 204 673 "
        },
        "v4": {
            "x_min": 0,
            "x_max": 468.21875,
            "ha": 478,
            "o": "m 174 637 b 232 638 175 638 189 638 b 277 638 245 638 259 638 l 378 638 l 381 635 b 389 623 386 632 389 627 b 382 609 389 617 386 613 b 366 589 381 606 372 598 l 313 528 l 245 451 l 209 410 l 155 348 l 84 267 b 59 240 72 252 59 240 b 59 240 59 240 59 240 b 151 238 59 238 68 238 l 242 238 l 242 303 b 243 371 242 369 242 370 b 289 426 245 374 254 385 l 303 441 l 317 456 l 338 483 l 360 506 l 371 520 b 386 527 375 526 381 527 b 400 519 392 527 397 524 b 401 440 401 516 401 514 b 401 377 401 423 401 402 l 401 238 l 426 238 b 453 237 449 238 450 238 b 465 217 461 234 465 226 b 460 202 465 212 464 206 b 426 197 454 197 453 197 l 401 197 l 401 180 b 451 88 402 129 412 109 b 468 69 465 81 468 79 b 461 55 468 62 466 59 l 458 54 l 321 54 l 185 54 l 182 55 b 175 69 176 59 175 62 b 191 88 175 79 176 81 b 240 180 230 109 240 129 l 240 197 l 125 197 b 73 195 104 195 87 195 b 8 197 10 195 9 197 b 0 212 2 199 0 205 b 0 212 0 212 0 212 b 20 242 0 219 0 219 b 163 610 104 344 163 492 b 174 637 163 628 166 634 m 234 -1 l 235 -1 l 232 -1 l 234 -1 m 234 673 l 235 673 l 232 673 l 234 673 "
        },
        "v5": {
            "x_min": 0,
            "x_max": 409.6875,
            "ha": 418,
            "o": "m 47 637 b 53 638 49 638 50 638 b 69 634 55 638 61 637 b 210 610 114 619 161 610 b 363 634 259 610 311 619 b 382 638 372 637 378 638 b 392 634 386 638 389 637 b 397 623 396 630 397 627 b 393 610 397 620 396 616 b 298 505 368 552 338 520 b 212 494 277 498 246 494 b 65 517 163 494 106 502 b 61 517 62 517 61 517 b 61 517 61 517 61 517 b 51 408 61 517 51 412 b 51 408 51 408 51 408 b 51 408 51 408 51 408 b 61 412 53 408 55 409 b 125 434 80 421 103 430 b 185 441 145 440 166 441 b 409 244 310 441 409 353 b 401 191 409 227 406 209 b 197 43 375 105 287 43 b 159 47 183 43 171 44 b 23 123 112 56 61 86 b 0 180 6 140 0 159 b 76 260 0 220 31 260 b 92 259 81 260 87 259 b 152 183 132 251 152 216 b 100 112 152 152 134 122 b 95 111 98 112 95 111 b 95 111 95 111 95 111 b 129 98 95 109 119 101 b 148 97 136 97 141 97 b 264 235 206 97 261 158 b 265 248 265 240 265 244 b 210 398 265 312 243 373 b 179 408 201 406 194 408 b 174 408 178 408 176 408 b 53 369 130 408 88 394 b 34 359 39 359 38 359 b 17 374 24 359 17 365 b 39 628 17 384 38 625 b 47 637 40 631 43 635 m 204 -1 l 205 -1 l 202 -1 l 204 -1 m 204 673 l 205 673 l 202 673 l 204 673 "
        },
        "v6": {
            "x_min": 0,
            "x_max": 475.03125,
            "ha": 485,
            "o": "m 255 648 b 274 648 259 648 266 648 b 314 646 288 648 307 648 b 450 555 374 637 438 594 b 454 530 453 546 454 538 b 375 451 454 485 416 451 b 328 467 359 451 343 455 b 300 526 310 483 300 503 b 352 598 300 557 319 589 b 356 599 355 598 356 599 b 352 602 356 599 355 601 b 288 616 330 612 308 616 b 210 584 257 616 230 605 b 164 433 189 559 174 508 b 160 374 163 415 160 381 b 160 374 160 374 160 374 b 160 374 160 374 160 374 b 168 377 160 374 164 376 b 258 395 200 390 228 395 b 366 367 294 395 328 387 b 475 223 436 333 475 283 b 472 197 475 215 473 206 b 349 65 462 141 419 95 b 259 43 317 51 288 43 b 167 69 230 43 200 52 b 4 290 80 113 20 195 b 0 349 1 309 0 328 b 20 467 0 391 6 433 b 255 648 58 563 155 637 m 269 363 b 257 363 265 363 261 363 b 210 345 236 363 220 356 b 186 226 196 324 186 272 b 187 198 186 216 186 206 b 213 95 191 151 202 112 b 257 76 221 83 238 76 b 270 77 261 76 266 76 b 321 156 299 81 310 99 b 329 229 326 183 329 206 b 321 301 329 252 326 274 b 269 363 311 342 298 359 m 236 -1 l 238 -1 l 235 -1 l 236 -1 m 236 673 l 238 673 l 235 673 l 236 673 "
        },
        "v7": {
            "x_min": 0,
            "x_max": 442.359375,
            "ha": 451,
            "o": "m 147 648 b 166 649 153 649 160 649 b 313 598 217 649 273 630 b 340 587 323 588 328 587 l 341 587 b 412 628 367 587 390 601 b 427 638 416 635 421 638 b 439 632 431 638 435 637 b 442 623 441 630 442 628 b 430 569 442 616 439 603 b 352 369 408 492 377 410 b 300 259 325 324 313 298 b 273 84 283 205 273 140 b 265 55 273 65 272 59 l 261 54 l 181 54 l 99 54 l 96 55 b 91 61 95 56 92 59 l 89 63 l 89 77 b 147 263 89 133 111 202 b 261 401 176 313 212 355 b 378 541 315 449 349 489 l 382 548 l 375 544 b 240 495 333 512 285 495 b 129 535 198 495 160 509 b 84 560 108 552 95 560 b 76 559 81 560 78 560 b 31 487 59 555 43 530 b 14 470 27 473 24 470 b 1 477 8 470 4 471 l 0 480 l 0 553 l 0 627 l 1 630 b 16 638 4 635 9 638 b 23 635 17 638 20 637 b 49 626 36 626 39 626 b 96 638 59 626 80 630 b 104 639 99 638 102 639 b 117 644 107 641 112 642 b 147 648 125 645 137 648 m 220 -1 l 221 -1 l 219 -1 l 220 -1 m 220 673 l 221 673 l 219 673 l 220 673 "
        },
        "v8": {
            "x_min": 0,
            "x_max": 488.640625,
            "ha": 499,
            "o": "m 217 648 b 245 649 225 648 235 649 b 453 516 343 649 430 595 b 458 478 455 503 458 491 b 412 370 458 440 441 398 b 411 369 412 369 411 369 b 415 365 411 367 412 367 b 488 231 462 331 488 281 b 472 165 488 208 483 186 b 243 43 434 86 338 43 b 63 104 178 43 112 62 b 0 233 20 140 0 186 b 73 365 0 283 24 331 l 77 369 l 72 374 b 29 476 42 406 29 441 b 217 648 29 557 103 635 m 258 605 b 242 606 253 605 247 606 b 157 552 198 606 157 580 b 160 541 157 548 159 544 b 319 413 176 503 242 452 l 337 403 l 338 406 b 359 476 352 428 359 452 b 258 605 359 537 318 595 m 138 326 b 130 330 134 328 130 330 b 130 330 130 330 130 330 b 107 305 127 330 112 313 b 84 231 91 281 84 256 b 243 86 84 156 151 86 b 249 87 245 86 246 87 b 347 156 303 88 347 120 b 344 172 347 162 345 167 b 156 319 325 227 257 281 b 138 326 151 322 144 324 m 243 -1 l 245 -1 l 242 -1 l 243 -1 m 243 673 l 245 673 l 242 673 l 243 673 "
        },
        "v9": {
            "x_min": 0,
            "x_max": 475.03125,
            "ha": 485,
            "o": "m 191 646 b 212 649 198 648 205 649 b 255 644 227 649 243 646 b 458 448 348 616 428 539 b 475 342 469 415 475 378 b 460 244 475 308 469 274 b 193 44 421 124 303 44 b 91 69 157 44 122 51 b 19 161 43 97 19 126 b 21 181 19 167 20 174 b 98 241 32 220 65 241 b 170 186 129 241 160 223 b 172 166 171 179 172 173 b 121 94 172 134 152 102 b 117 93 118 94 117 93 b 121 90 117 93 118 91 b 185 76 142 80 164 76 b 270 119 220 76 251 91 b 308 259 287 145 300 194 b 313 317 310 277 313 310 b 313 317 313 317 313 317 b 313 317 313 317 313 317 b 304 315 313 317 308 316 b 216 295 273 302 245 295 b 145 308 193 295 170 299 b 19 398 88 327 42 360 b 0 469 5 420 0 444 b 24 551 0 496 8 526 b 191 646 54 596 125 637 m 227 614 b 215 616 224 616 220 616 b 202 614 210 616 206 616 b 152 535 174 610 163 592 b 144 463 147 509 144 485 b 152 391 144 440 147 417 b 216 328 163 344 179 328 b 280 391 253 328 269 344 b 288 463 285 417 288 440 b 280 535 288 485 285 509 b 227 614 269 594 258 610 m 236 -1 l 238 -1 l 235 -1 l 236 -1 m 236 673 l 238 673 l 235 673 l 236 673 "
        },
        "va": {
            "x_min": -149.71875,
            "x_max": 148.359375,
            "ha": 151,
            "o": "m -8 -1 b -1 0 -5 -1 -4 0 b 16 -11 5 0 13 -4 b 83 -186 17 -12 47 -90 l 148 -358 l 148 -363 b 127 -385 148 -376 138 -385 b 112 -378 122 -385 118 -383 b 54 -226 110 -374 114 -385 b 0 -81 24 -147 0 -81 b -55 -226 -1 -81 -25 -147 b -114 -378 -115 -385 -111 -374 b -129 -385 -119 -383 -123 -385 b -149 -363 -140 -385 -149 -376 l -149 -358 l -84 -186 b -19 -11 -49 -90 -19 -12 b -8 -1 -17 -8 -12 -4 "
        },
        "vb": {
            "x_min": 0,
            "x_max": 428.75,
            "ha": 438,
            "o": "m 262 186 b 273 186 266 186 272 186 b 274 186 273 186 274 186 b 285 186 274 186 280 186 b 428 48 375 181 428 122 b 386 -68 428 12 416 -29 b 155 -187 329 -145 236 -187 b 12 -111 92 -187 38 -162 b 0 -51 4 -91 0 -72 b 262 186 0 58 122 179 "
        },
        "vc": {
            "x_min": 0,
            "x_max": 447.8125,
            "ha": 457,
            "o": "m 0 86 l 0 173 l 223 173 l 447 173 l 447 86 l 447 0 l 223 0 l 0 0 l 0 86 "
        },
        "vf": {
            "x_min": 0,
            "x_max": 370.21875,
            "ha": 378,
            "o": "m 0 0 l 0 277 l 61 277 l 122 277 l 122 0 l 122 -278 l 61 -278 l 0 -278 l 0 0 m 246 -1 l 246 277 l 308 277 l 370 277 l 370 -1 l 370 -278 l 308 -278 l 246 -278 l 246 -1 "
        },
        "v10": {
            "x_min": 0,
            "x_max": 559.421875,
            "ha": 571,
            "o": "m 5 127 b 14 127 6 127 9 127 b 51 126 25 127 43 127 b 175 98 93 122 138 112 l 186 94 b 279 51 210 86 255 65 b 285 47 280 51 283 48 b 319 27 291 44 311 31 l 326 22 b 359 0 332 19 352 4 l 367 -6 b 371 -9 368 -6 370 -8 l 379 -15 b 387 -22 383 -18 386 -20 l 398 -30 l 411 -40 l 417 -47 l 427 -55 l 434 -61 b 441 -66 436 -62 439 -65 l 446 -72 l 453 -77 l 462 -87 b 558 -188 490 -113 549 -176 b 559 -195 559 -191 559 -194 b 548 -205 559 -201 555 -205 b 541 -204 547 -205 544 -205 b 534 -198 539 -201 536 -199 l 525 -191 b 481 -162 518 -187 490 -167 b 472 -155 477 -159 472 -156 b 468 -152 470 -155 469 -154 b 461 -149 466 -152 464 -151 b 428 -130 454 -145 441 -137 b 371 -99 413 -122 372 -99 b 363 -95 371 -99 367 -98 b 353 -91 357 -94 353 -91 b 348 -90 353 -91 352 -91 b 332 -81 343 -87 341 -86 b 27 -12 230 -37 127 -13 b 0 -5 4 -11 2 -11 b 0 58 0 -2 0 27 b 0 122 0 88 0 120 b 5 127 1 124 4 126 "
        },
        "v11": {
            "x_min": -155.171875,
            "x_max": 153.8125,
            "ha": 157,
            "o": "m -137 353 b -130 353 -136 353 -133 353 b -112 349 -125 353 -119 352 b -100 342 -110 347 -104 344 b 0 317 -69 326 -35 317 b 111 349 38 317 76 328 b 129 353 117 352 123 353 b 153 327 142 353 153 344 b 144 302 153 320 153 317 b 27 6 93 226 50 113 b 21 -13 24 -11 24 -11 b 0 -26 17 -22 8 -26 b -24 -12 -9 -26 -19 -22 b -28 5 -24 -9 -27 -2 b -145 302 -53 117 -95 224 b -155 327 -155 317 -155 320 b -137 353 -155 340 -148 349 "
        },
        "v18": {
            "x_min": 0,
            "x_max": 323.9375,
            "ha": 331,
            "o": "m 217 535 b 225 537 220 537 221 537 b 245 524 235 537 242 533 l 246 521 l 247 390 l 247 258 l 273 265 b 306 270 288 269 299 270 b 322 259 315 270 319 267 b 323 208 323 256 323 233 b 322 158 323 184 323 159 b 288 140 318 148 315 147 b 247 130 254 131 247 130 b 247 65 247 130 247 104 b 247 20 247 51 247 36 l 247 -88 l 273 -81 b 306 -76 289 -77 299 -76 b 318 -81 311 -76 315 -77 b 323 -123 323 -87 323 -86 l 323 -138 l 323 -154 b 318 -195 323 -191 323 -190 b 269 -210 314 -199 315 -199 b 249 -216 259 -213 250 -216 l 247 -216 l 247 -349 l 246 -483 l 245 -487 b 225 -499 242 -495 234 -499 b 206 -487 219 -499 210 -495 l 205 -483 l 205 -355 l 205 -227 l 204 -227 l 181 -233 l 138 -244 b 117 -249 127 -247 117 -249 b 115 -385 115 -249 115 -256 l 115 -523 l 114 -526 b 95 -538 110 -534 102 -538 b 74 -526 87 -538 78 -534 l 73 -523 l 73 -391 b 72 -260 73 -269 73 -260 b 72 -260 72 -260 72 -260 b 19 -273 61 -263 23 -273 b 0 -260 10 -273 4 -267 b 0 -209 0 -256 0 -256 l 0 -162 l 1 -158 b 61 -134 5 -148 5 -148 l 73 -131 l 73 -22 b 72 86 73 79 73 86 b 72 86 72 86 72 86 b 19 74 61 83 23 74 b 0 86 10 74 4 79 b 0 137 0 90 0 90 l 0 184 l 1 188 b 61 212 5 198 5 198 l 73 215 l 73 348 l 73 481 l 74 485 b 95 498 78 492 87 498 b 103 495 98 498 100 496 b 114 485 107 494 111 489 l 115 481 l 115 353 l 115 226 l 121 226 b 159 235 123 227 141 231 l 198 247 l 205 248 l 205 384 l 205 521 l 206 524 b 217 535 209 528 212 533 m 205 9 b 205 119 205 70 205 119 l 205 119 b 182 113 204 119 194 116 l 138 102 b 117 97 127 99 117 97 b 115 -12 115 97 115 91 l 115 -122 l 121 -120 b 159 -111 123 -119 141 -115 l 198 -101 l 205 -98 l 205 9 "
        },
        "v1b": {
            "x_min": 0,
            "x_max": 559.421875,
            "ha": 571,
            "o": "m 544 204 b 548 204 545 204 547 204 b 559 194 555 204 559 199 b 559 190 559 192 559 191 b 530 156 559 188 556 184 b 462 86 510 134 481 104 b 453 76 458 81 454 77 l 446 70 l 441 65 b 434 59 439 63 436 61 l 427 54 b 409 37 426 51 416 44 b 392 23 398 29 394 26 b 387 19 389 22 387 20 b 379 13 386 19 383 16 l 371 8 l 367 5 l 359 -1 l 337 -16 b 285 -48 319 -29 298 -41 l 279 -52 b 186 -95 255 -66 210 -87 l 175 -99 b 23 -129 127 -117 68 -129 b 17 -129 20 -129 19 -129 b 1 -123 2 -129 2 -129 b 0 -49 0 -122 0 -83 b 0 4 0 -22 0 1 b 27 11 2 9 4 9 b 185 31 78 12 145 20 b 198 34 186 31 193 33 b 314 73 234 44 277 58 b 349 88 328 79 340 84 b 353 90 352 90 353 90 b 363 94 353 90 357 93 b 371 98 367 97 371 98 b 428 129 372 98 413 120 b 461 148 441 136 454 144 b 468 151 464 149 466 151 b 472 154 469 152 470 154 b 481 161 473 155 477 158 b 525 190 490 166 518 186 l 534 197 b 540 201 536 198 539 199 b 544 204 541 202 544 204 "
        },
        "v1d": {
            "x_min": 0,
            "x_max": 619.3125,
            "ha": 632,
            "o": "m 274 184 b 307 186 285 186 296 186 b 616 22 465 186 597 116 b 619 -1 617 13 619 5 b 308 -187 619 -104 483 -187 b 0 -1 133 -187 0 -102 b 5 36 0 11 1 23 b 274 184 29 115 141 176 m 289 161 b 272 162 284 162 277 162 b 171 41 209 162 171 108 b 205 -73 171 5 182 -34 b 345 -163 243 -133 298 -163 b 436 -98 385 -163 420 -142 b 446 -43 443 -80 446 -62 b 289 161 446 47 377 147 "
        },
        "v1e": {
            "x_min": -402.890625,
            "x_max": 401.53125,
            "ha": 410,
            "o": "m -219 173 b -213 174 -217 174 -215 174 b -202 173 -209 174 -205 173 b -114 86 -200 172 -179 151 b -28 0 -66 37 -28 0 b 40 84 -28 0 2 37 b 117 174 111 173 110 172 b 122 174 118 174 119 174 b 132 173 125 174 129 173 b 295 11 134 172 171 134 l 307 -1 l 336 34 b 374 76 366 72 368 74 b 381 77 375 77 378 77 b 401 56 392 77 401 68 b 400 48 401 54 401 51 b 223 -172 397 41 230 -166 b 210 -176 220 -174 215 -176 b 201 -174 206 -176 204 -176 b 112 -87 198 -173 178 -152 b 27 0 65 -38 27 0 b -42 -86 27 0 -4 -38 b -118 -174 -112 -174 -111 -173 b -123 -176 -119 -176 -121 -176 b -133 -174 -126 -176 -130 -174 b -296 -12 -136 -173 -172 -137 l -308 0 l -337 -34 b -375 -77 -367 -73 -370 -76 b -382 -79 -377 -79 -379 -79 b -402 -58 -393 -79 -402 -69 b -401 -49 -402 -55 -402 -52 b -224 172 -398 -43 -228 167 b -219 173 -223 172 -220 173 "
        },
        "v1f": {
            "x_min": -340.28125,
            "x_max": 338.921875,
            "ha": 346,
            "o": "m -32 520 b -29 521 -31 520 -31 521 b -23 519 -27 521 -24 520 b -20 513 -21 517 -20 516 b -21 506 -20 512 -20 509 b -31 474 -23 502 -27 488 l -53 402 l -66 352 l -68 349 l -57 349 b -32 351 -51 349 -40 351 b 123 370 19 352 74 359 b 137 371 127 370 133 371 b 170 356 152 371 164 366 b 171 355 170 355 170 355 b 216 366 174 355 183 358 b 280 378 268 377 266 377 b 287 378 283 378 284 378 b 332 349 307 378 322 369 b 338 319 336 341 338 330 b 332 301 338 310 336 302 b 242 280 329 299 246 280 b 242 280 242 280 242 280 b 235 288 236 280 235 283 b 235 292 235 290 235 291 b 236 302 236 297 236 299 b 220 337 236 316 230 330 l 216 340 l 210 335 b 159 276 189 322 172 301 b 118 149 152 265 156 274 b 81 34 84 36 85 36 b -8 13 78 33 -4 13 b -8 13 -8 13 -8 13 b -14 20 -12 15 -14 15 b -8 44 -14 24 -12 31 b -2 66 -5 55 -2 65 b -2 66 -2 66 -2 66 l -2 66 b -43 41 -2 66 -21 55 b -114 4 -98 8 -98 8 b -144 0 -123 0 -134 0 b -242 99 -197 0 -242 43 b -242 109 -242 102 -242 105 b -212 219 -240 122 -242 116 b -185 312 -197 270 -185 312 l -185 312 b -189 312 -185 312 -186 312 b -259 312 -200 312 -227 312 b -321 310 -291 312 -310 310 b -334 312 -330 310 -334 312 b -340 319 -338 313 -340 316 b -336 326 -340 322 -338 324 b -291 337 -334 326 -314 331 l -247 347 l -210 348 b -172 348 -190 348 -172 348 b -168 363 -172 348 -171 355 b -145 442 -151 424 -145 441 b -133 452 -144 444 -140 446 l -77 489 b -32 520 -53 506 -32 520 m 57 334 b 53 335 55 335 54 335 b 44 334 50 335 49 335 b -70 316 8 326 -28 320 b -78 309 -78 316 -78 316 b -108 202 -80 305 -88 274 b -141 81 -136 112 -141 93 b -140 74 -141 79 -141 77 b -117 49 -137 59 -127 49 b -107 52 -114 49 -110 51 b 16 127 -106 54 14 126 b 42 217 16 127 42 215 b 49 241 42 222 44 229 b 73 320 53 251 73 317 b 57 334 73 327 65 333 "
        },
        "v22": {
            "x_min": 0,
            "x_max": 432.828125,
            "ha": 442,
            "o": "m 209 186 b 213 187 210 187 212 187 b 216 187 215 187 216 187 b 224 174 216 186 220 180 b 420 -1 269 105 338 43 b 432 -12 431 -8 432 -9 b 421 -23 432 -15 432 -16 b 228 -180 345 -70 264 -137 b 219 -188 221 -188 221 -188 l 219 -188 b 208 -177 215 -188 215 -188 b 10 1 163 -106 93 -44 b 0 11 0 6 0 8 b 10 22 0 13 0 15 b 202 179 87 69 167 136 b 209 186 206 183 209 186 "
        },
        "v23": {
            "x_min": 0,
            "x_max": 133.390625,
            "ha": 136,
            "o": "m 54 66 b 65 68 58 68 61 68 b 122 37 88 68 110 56 b 133 -1 130 26 133 12 b 104 -58 133 -23 123 -44 b 66 -69 92 -65 78 -69 b 10 -38 44 -69 23 -58 b 0 -1 2 -27 0 -13 b 54 66 0 30 20 61 "
        },
        "v25": {
            "x_min": 0,
            "x_max": 318.5,
            "ha": 325,
            "o": "m 20 376 b 167 377 23 377 96 377 b 296 376 231 377 294 377 b 318 347 311 371 318 359 b 296 316 318 333 311 320 b 159 315 294 315 227 315 b 21 316 91 315 24 315 b 0 345 6 320 0 333 b 20 376 0 359 6 371 "
        },
        "v26": {
            "x_min": -21.78125,
            "x_max": 483.1875,
            "ha": 493,
            "o": "m -8 631 b -1 632 -6 632 -4 632 b 19 620 8 632 16 628 b 20 383 20 616 20 616 l 20 148 l 21 151 b 140 199 59 183 102 199 b 206 179 164 199 187 192 l 210 176 l 210 396 l 210 617 l 212 621 b 231 632 216 628 223 632 b 250 620 239 632 247 628 b 251 383 251 616 251 616 l 251 148 l 254 151 b 370 199 291 183 332 199 b 415 191 385 199 400 197 b 483 84 458 176 483 134 b 461 0 483 58 476 29 b 332 -142 439 -40 411 -72 l 255 -215 b 231 -229 240 -229 239 -229 b 216 -223 224 -229 220 -227 b 210 -158 210 -217 210 -223 b 210 -120 210 -148 210 -136 l 210 -29 l 205 -34 b 100 -142 182 -65 159 -88 l 23 -215 b -1 -229 9 -229 6 -229 b -20 -216 -9 -229 -17 -224 l -21 -212 l -21 201 l -21 616 l -20 620 b -8 631 -17 624 -13 630 m 110 131 b 96 133 106 133 100 133 b 89 133 93 133 91 133 b 24 87 63 129 40 113 l 20 80 l 20 -37 l 20 -156 l 23 -152 b 144 81 96 -72 144 20 l 144 83 b 110 131 144 113 134 126 m 341 131 b 328 133 337 133 332 133 b 322 133 326 133 323 133 b 257 87 296 129 273 113 l 251 80 l 251 -37 l 251 -156 l 255 -152 b 375 81 328 -72 375 20 l 375 83 b 341 131 375 113 367 126 "
        },
        "v27": {
            "x_min": 0,
            "x_max": 432.828125,
            "ha": 442,
            "o": "m 208 184 b 213 187 209 186 212 187 b 224 176 217 187 221 183 b 245 147 225 172 235 159 b 419 -1 288 90 347 38 b 431 -8 424 -4 431 -8 b 432 -12 432 -9 432 -11 b 430 -18 432 -13 432 -16 b 364 -61 424 -20 383 -47 b 225 -183 307 -102 250 -152 b 223 -187 224 -184 223 -187 b 220 -188 221 -188 220 -188 b 208 -176 216 -188 210 -184 b 187 -148 205 -173 197 -159 b 12 0 144 -90 84 -38 b 0 11 4 5 0 8 b 16 24 0 13 4 18 b 183 158 83 69 141 115 b 208 184 194 169 198 173 m 183 105 b 176 113 181 109 176 113 b 172 109 176 113 175 112 b 92 45 149 90 117 62 l 88 41 l 102 31 b 247 -105 160 -6 210 -55 l 254 -115 l 257 -112 l 269 -102 b 340 -45 287 -87 319 -61 l 344 -43 l 330 -33 b 183 105 272 6 221 54 "
        },
        "v28": {
            "x_min": -73.5,
            "x_max": 72.140625,
            "ha": 74,
            "o": "m -72 252 l -73 254 l 0 254 l 72 254 l 70 252 b 0 -1 70 248 0 -1 b -72 252 -1 -1 -72 248 "
        },
        "v2a": {
            "x_min": -21.78125,
            "x_max": 366.140625,
            "ha": 374,
            "o": "m 276 1378 b 284 1379 279 1379 281 1379 b 306 1360 292 1379 298 1374 b 352 1247 326 1326 343 1286 b 366 1139 362 1213 366 1175 b 347 1009 366 1093 359 1049 l 344 1002 l 347 992 b 352 971 348 986 351 977 b 366 863 362 936 366 899 b 347 732 366 818 359 773 l 344 725 l 347 716 b 352 695 348 710 351 700 b 366 588 362 659 366 623 b 223 262 366 464 314 345 b 189 233 212 252 212 252 b 35 76 126 183 73 129 b -1 16 20 56 2 27 b -19 4 -4 9 -12 4 l -21 4 l -21 137 l -21 270 l -17 270 b 186 344 59 281 134 308 b 319 606 270 399 319 499 b 317 650 319 620 319 635 l 315 659 l 314 655 b 223 537 288 607 258 570 b 189 509 212 528 212 528 b 35 352 126 459 73 405 b -1 292 20 333 2 303 b -19 280 -4 285 -12 280 l -21 280 l -21 413 l -21 546 l -17 546 b 186 620 59 557 134 584 b 319 882 270 675 319 775 b 317 925 319 896 319 911 l 315 935 l 314 931 b 223 813 288 884 258 846 b 189 785 212 805 212 805 b 35 628 126 735 73 681 b -1 569 20 609 2 580 b -19 556 -4 562 -12 556 l -21 556 l -21 689 l -21 823 l -17 823 b 202 907 68 835 152 867 b 319 1157 280 968 319 1061 b 270 1338 319 1218 303 1281 b 262 1358 264 1349 262 1353 b 262 1364 262 1360 262 1363 b 276 1378 265 1371 269 1376 "
        },
        "v2d": {
            "x_min": 0,
            "x_max": 438.28125,
            "ha": 447,
            "o": "m 212 190 b 219 191 213 191 216 191 b 236 176 225 191 228 190 b 419 18 277 105 341 49 b 436 5 431 13 434 11 b 438 -1 438 4 438 1 b 424 -16 438 -8 432 -13 b 356 -49 409 -20 379 -36 b 234 -180 306 -83 258 -133 b 219 -192 230 -188 224 -192 b 200 -176 213 -192 206 -187 b 9 -15 157 -102 89 -45 b 0 0 2 -12 0 -6 b 16 18 0 9 2 12 b 200 176 93 48 159 104 b 212 190 205 186 208 188 m 239 113 b 236 117 238 116 238 117 b 230 108 235 117 234 115 b 92 -15 196 58 140 8 b 88 -18 91 -16 88 -18 b 92 -20 88 -18 91 -19 b 198 -116 130 -43 166 -74 b 200 -117 200 -117 200 -117 b 201 -117 200 -117 201 -117 b 264 -43 212 -98 242 -62 b 345 15 288 -19 321 4 b 348 18 347 16 348 16 b 344 20 348 18 347 19 b 239 113 307 41 266 79 "
        },
        "v2f": {
            "x_min": -1.359375,
            "x_max": 680.5625,
            "ha": 694,
            "o": "m 597 1042 b 604 1042 600 1042 602 1042 b 642 1002 627 1042 642 1022 b 619 966 642 988 635 974 b 439 927 574 942 503 927 l 426 927 l 426 921 b 430 838 428 893 430 866 b 345 480 430 696 398 560 b 179 391 307 423 249 391 b 156 392 171 391 164 392 b 138 394 149 394 142 394 b 103 434 115 396 103 416 b 129 471 103 451 111 466 b 141 474 133 473 137 474 b 172 459 153 474 164 469 b 181 455 175 456 176 455 b 187 456 182 455 185 455 b 253 520 212 460 234 483 b 315 836 294 605 315 714 b 311 928 315 867 314 898 b 302 945 310 943 311 942 b 245 953 283 950 262 953 b 130 891 193 953 149 931 b 84 860 119 870 102 860 b 36 905 61 860 39 877 b 36 910 36 907 36 909 b 80 970 36 931 50 949 b 249 1017 125 1000 187 1017 b 322 1009 273 1017 299 1014 l 341 1003 b 436 991 372 995 406 991 b 577 1031 495 991 545 1004 b 597 1042 583 1038 590 1041 m 416 360 b 424 360 419 360 421 360 b 481 309 454 360 479 338 b 503 145 484 280 495 199 b 585 -185 525 16 555 -106 b 630 -245 596 -213 613 -237 l 634 -247 l 638 -245 b 647 -244 641 -245 645 -244 b 680 -278 666 -244 680 -262 b 664 -308 680 -290 675 -301 b 638 -312 658 -310 650 -312 b 613 -309 631 -312 623 -310 b 477 -201 555 -303 502 -260 b 417 -2 460 -159 434 -72 b 416 5 417 1 416 5 b 416 5 416 5 416 5 b 411 -5 415 5 413 0 b 359 -97 397 -33 377 -70 b 353 -106 355 -102 353 -105 b 359 -112 353 -108 355 -109 b 409 -130 375 -123 390 -129 b 426 -134 420 -130 421 -131 b 431 -147 428 -137 431 -141 b 420 -162 431 -152 427 -159 b 382 -169 409 -166 396 -169 b 323 -155 363 -169 341 -165 l 317 -152 l 314 -155 b 62 -303 240 -240 148 -295 b 36 -305 55 -305 44 -305 b 23 -303 29 -305 24 -305 b -1 -273 6 -299 -1 -287 b 31 -240 -1 -256 10 -240 b 36 -240 32 -240 34 -240 b 42 -241 38 -241 39 -241 b 134 -204 63 -241 99 -226 b 367 288 265 -115 357 81 b 375 330 368 313 370 320 b 416 360 383 347 400 358 m 360 -359 b 379 -359 363 -359 371 -359 b 424 -360 396 -359 416 -359 b 646 -502 536 -373 624 -430 b 649 -527 649 -510 649 -519 b 530 -673 649 -578 604 -635 l 521 -677 l 529 -681 b 653 -811 592 -714 637 -762 b 660 -853 658 -827 660 -839 b 645 -911 660 -873 656 -892 b 426 -1021 608 -981 519 -1021 b 283 -989 377 -1021 328 -1011 b 235 -949 249 -972 239 -964 b 234 -936 234 -946 234 -941 b 234 -928 234 -934 234 -931 l 235 -925 l 234 -927 l 225 -934 b 87 -982 186 -966 138 -982 b 80 -982 85 -982 83 -982 b 55 -981 70 -981 58 -981 b 17 -943 32 -981 17 -964 b 54 -904 17 -921 35 -904 b 78 -914 62 -904 72 -909 l 83 -918 l 88 -918 b 190 -831 122 -918 166 -881 b 269 -506 242 -727 269 -612 b 268 -462 269 -492 269 -477 b 266 -449 266 -458 266 -452 b 265 -444 266 -445 266 -444 b 257 -446 264 -444 261 -445 b 132 -545 196 -470 152 -505 b 88 -573 122 -563 104 -573 b 39 -523 63 -573 39 -553 b 63 -476 39 -505 44 -494 b 360 -359 136 -408 235 -369 m 419 -424 b 393 -423 411 -423 406 -423 l 375 -423 l 377 -426 b 379 -439 377 -427 378 -434 b 383 -510 382 -463 383 -487 b 314 -811 383 -609 360 -710 b 266 -893 296 -850 285 -870 b 264 -898 265 -896 264 -898 l 264 -898 b 264 -898 264 -898 264 -898 b 268 -898 264 -898 266 -898 b 273 -898 270 -898 272 -898 b 300 -909 283 -898 291 -900 b 426 -957 340 -941 385 -957 b 476 -949 443 -957 460 -954 b 547 -853 522 -931 547 -893 b 485 -745 547 -816 526 -775 b 397 -707 460 -727 432 -714 b 366 -675 375 -703 366 -692 b 396 -642 366 -657 377 -645 b 530 -557 455 -637 511 -601 b 536 -527 534 -548 536 -537 b 419 -424 536 -480 490 -437 "
        },
        "v30": {
            "x_min": -21.78125,
            "x_max": 367.5,
            "ha": 375,
            "o": "m 276 1900 b 284 1901 279 1900 281 1901 b 306 1883 291 1901 298 1896 b 367 1686 347 1825 367 1757 b 343 1558 367 1643 359 1600 l 338 1549 l 343 1537 b 367 1411 359 1497 367 1454 b 343 1282 367 1367 359 1324 l 338 1272 l 343 1261 b 367 1135 359 1221 367 1178 b 343 1007 367 1090 359 1047 l 338 996 l 343 985 b 367 859 359 945 367 902 b 343 731 367 814 359 771 l 338 720 l 343 709 b 367 582 359 667 367 626 b 289 362 367 503 340 426 b 239 312 276 345 259 330 b 29 77 152 237 76 152 b -1 18 14 54 2 30 b -19 4 -4 11 -12 4 l -21 4 l -21 133 l -20 260 l -13 262 b 98 299 17 269 62 284 b 111 305 103 302 110 305 b 167 334 123 310 156 327 b 319 595 264 391 319 491 b 313 659 319 616 318 638 b 310 667 311 664 311 667 b 307 663 310 667 308 666 b 240 588 289 637 269 614 b 16 331 141 505 62 413 b -1 294 8 316 1 302 b -19 280 -4 287 -12 280 l -21 280 l -21 408 l -20 537 l -13 538 b 98 576 17 545 62 560 b 111 581 103 578 110 581 b 167 610 123 587 156 603 b 319 871 264 667 319 767 b 313 935 319 892 318 913 b 310 942 311 941 311 942 b 307 939 310 942 308 941 b 240 864 289 913 269 889 b 16 607 141 781 62 689 b -1 570 8 592 1 578 b -19 556 -4 563 -12 556 l -21 556 l -21 684 l -20 813 l -13 814 b 98 852 17 821 62 836 b 111 857 103 855 110 857 b 167 886 123 863 156 880 b 319 1147 264 943 319 1043 b 313 1211 319 1168 318 1189 b 310 1218 311 1217 311 1218 b 307 1215 310 1218 308 1217 b 240 1140 289 1188 269 1165 b 16 884 141 1057 62 966 b -1 846 8 868 1 855 b -19 832 -4 839 -12 832 l -21 832 l -21 960 l -20 1089 l -13 1090 b 98 1128 17 1097 62 1111 b 111 1134 103 1131 110 1134 b 167 1163 123 1139 156 1156 b 319 1424 264 1220 319 1320 b 313 1486 319 1444 318 1465 b 310 1494 311 1493 311 1494 b 307 1492 310 1494 308 1493 b 240 1417 289 1464 269 1442 b 16 1160 141 1333 62 1242 b -1 1121 8 1145 1 1131 b -19 1109 -4 1115 -12 1109 l -21 1109 l -21 1236 l -20 1365 l -13 1367 b 98 1404 17 1374 62 1388 b 111 1410 103 1407 110 1410 b 250 1508 172 1437 215 1467 b 319 1701 296 1564 319 1633 b 270 1859 319 1757 303 1814 b 262 1882 265 1868 262 1875 b 276 1900 262 1890 266 1896 "
        },
        "v33": {
            "x_min": -423.3125,
            "x_max": 421.9375,
            "ha": 431,
            "o": "m -10 276 b -2 277 -8 277 -5 277 b 17 265 5 277 13 273 b 19 163 19 260 19 260 l 19 68 l 39 45 b 277 -95 122 -34 200 -81 b 289 -97 281 -97 285 -97 b 378 0 332 -97 371 -54 b 378 11 378 4 378 6 b 302 83 378 55 345 83 b 242 66 283 83 262 77 b 208 56 231 59 219 56 b 148 120 175 56 148 81 b 200 186 148 151 164 172 b 261 198 220 194 240 198 b 420 45 341 198 411 137 b 421 22 421 37 421 29 b 257 -198 421 -86 347 -188 b 242 -198 251 -198 247 -198 b 20 -105 181 -198 95 -163 l 19 -104 l 19 -183 b 19 -216 19 -195 19 -206 b 12 -273 19 -272 17 -267 b -2 -278 8 -277 2 -278 b -21 -266 -10 -278 -19 -274 b -23 -165 -23 -263 -23 -262 l -23 -69 l -44 -47 b -250 86 -117 23 -183 66 b -295 94 -270 93 -284 94 b -315 91 -302 94 -308 94 b -381 5 -356 81 -381 43 b -355 -56 -381 -16 -372 -40 b -299 -81 -338 -73 -319 -81 b -246 -68 -283 -81 -265 -77 b -212 -58 -234 -61 -223 -58 b -168 -77 -196 -58 -179 -65 b -151 -122 -156 -90 -151 -105 b -179 -174 -151 -141 -160 -162 b -239 -195 -194 -184 -217 -192 b -257 -197 -245 -195 -250 -197 b -423 -5 -349 -197 -423 -113 b -423 0 -423 -4 -423 -1 b -277 194 -420 97 -362 173 b -247 197 -268 197 -258 197 b -24 104 -185 197 -100 162 l -23 102 l -23 181 b -21 265 -23 260 -23 260 b -10 276 -20 269 -14 274 "
        },
        "v38": {
            "x_min": -1.359375,
            "x_max": 651.96875,
            "ha": 665,
            "o": "m 389 644 b 405 645 394 645 400 645 b 504 566 450 645 492 613 b 507 541 506 557 507 549 b 480 471 507 514 498 489 l 477 467 l 483 470 b 609 591 539 485 586 531 b 613 601 611 595 613 599 b 631 609 619 607 624 609 b 651 588 641 609 651 602 b 200 -946 651 584 204 -941 b 182 -957 197 -953 190 -957 b 163 -945 174 -957 166 -953 b 161 -939 161 -942 161 -942 b 217 -743 161 -931 170 -904 b 272 -555 247 -639 272 -555 b 272 -555 272 -555 272 -555 b 264 -560 272 -555 268 -557 b 140 -603 227 -589 182 -603 b 36 -567 102 -603 65 -592 b -1 -487 12 -548 -1 -517 b 17 -427 -1 -466 5 -445 b 103 -380 38 -395 70 -380 b 191 -433 137 -380 172 -398 b 205 -484 201 -448 205 -466 b 178 -553 205 -509 196 -535 l 175 -557 l 182 -555 b 307 -435 236 -539 284 -494 b 372 -213 308 -430 372 -215 b 372 -213 372 -213 372 -213 b 364 -219 372 -213 368 -216 b 240 -262 328 -247 283 -262 b 137 -226 202 -262 166 -249 b 99 -145 112 -206 99 -176 b 118 -84 99 -124 106 -104 b 204 -38 138 -54 171 -38 b 292 -91 238 -38 273 -56 b 306 -141 302 -106 306 -124 b 279 -212 306 -167 296 -194 l 276 -215 l 281 -213 b 408 -93 336 -198 385 -151 b 473 129 409 -88 473 127 b 473 129 473 129 473 129 b 465 122 473 129 469 126 b 341 80 428 94 383 80 b 236 115 303 80 266 91 b 200 195 213 136 200 165 b 217 256 200 217 206 238 b 304 303 239 287 272 303 b 393 249 338 303 374 285 b 406 199 402 234 406 217 b 379 129 406 173 397 148 l 377 126 l 382 127 b 509 248 436 142 485 190 b 574 470 510 254 574 469 b 574 470 574 470 574 470 b 566 464 574 470 570 467 b 442 421 529 435 484 421 b 337 458 404 421 367 433 b 300 537 313 478 300 508 b 389 644 300 585 334 635 "
        },
        "v3b": {
            "x_min": 0,
            "x_max": 484.5625,
            "ha": 494,
            "o": "m 228 245 b 239 247 234 247 239 247 b 243 247 240 247 242 247 b 303 238 257 247 287 242 b 484 -2 417 208 484 104 b 412 -177 484 -65 461 -127 b 243 -248 363 -226 303 -248 b 6 -63 138 -248 36 -180 b 0 -1 1 -41 0 -20 b 228 245 0 127 98 240 m 255 181 b 240 183 247 183 245 183 b 232 181 238 183 235 183 b 142 152 200 180 168 170 l 138 149 l 190 97 l 242 44 l 294 97 l 345 149 l 340 152 b 255 181 315 169 284 180 m 147 -54 l 197 -1 l 147 51 l 95 104 l 91 99 b 62 -1 72 70 62 34 b 66 -43 62 -15 63 -29 b 91 -101 72 -63 80 -84 l 95 -106 l 147 -54 m 393 99 b 389 104 390 102 389 104 b 337 51 389 104 366 80 l 285 -1 l 337 -54 l 389 -106 l 393 -101 b 421 -1 412 -72 421 -36 b 393 99 421 34 412 69 m 294 -98 b 242 -45 265 -69 242 -45 b 190 -98 242 -45 219 -69 l 138 -151 l 142 -154 b 242 -184 172 -174 206 -184 b 340 -154 276 -184 311 -174 l 345 -151 l 294 -98 "
        },
        "v3c": {
            "x_min": 0,
            "x_max": 450.53125,
            "ha": 460,
            "o": "m 189 302 b 204 303 193 302 198 303 b 303 224 250 303 292 270 b 306 199 304 216 306 208 b 279 129 306 173 296 147 l 276 126 l 281 127 b 408 249 337 142 385 190 b 412 259 409 254 412 258 b 430 267 417 265 423 267 b 450 247 441 267 450 259 b 200 -605 450 242 204 -599 b 182 -616 197 -612 190 -616 b 163 -602 174 -616 166 -610 b 161 -598 161 -601 161 -601 b 217 -402 161 -589 170 -562 b 272 -213 247 -298 272 -213 b 272 -213 272 -213 272 -213 b 264 -219 272 -213 268 -216 b 140 -262 227 -247 182 -262 b 36 -226 102 -262 65 -249 b 0 -145 12 -206 0 -176 b 17 -84 0 -124 5 -104 b 103 -38 38 -54 70 -38 b 191 -91 137 -38 172 -56 b 205 -141 201 -106 205 -124 b 178 -212 205 -167 196 -194 l 175 -215 l 182 -213 b 307 -93 236 -198 284 -151 b 372 129 308 -88 372 127 b 372 129 372 129 372 129 b 364 122 372 129 368 126 b 240 80 328 94 283 80 b 137 115 202 80 166 91 b 99 194 111 136 99 165 b 189 302 99 244 133 292 "
        },
        "v3e": {
            "x_min": 0,
            "x_max": 406.96875,
            "ha": 415,
            "o": "m 21 183 b 28 183 24 183 25 183 b 42 181 34 183 39 183 b 127 108 47 179 47 179 b 202 41 168 72 202 41 b 279 108 204 41 238 72 b 357 177 321 145 356 176 b 375 183 363 181 370 183 b 406 151 392 183 406 169 b 404 137 406 147 405 141 b 322 62 401 131 398 129 b 251 0 284 27 251 0 b 322 -63 251 -1 284 -29 b 404 -138 398 -130 401 -133 b 406 -152 405 -142 406 -148 b 375 -184 406 -170 392 -184 b 357 -179 370 -184 363 -183 b 279 -109 356 -177 321 -147 b 202 -43 238 -73 204 -43 b 127 -109 202 -43 168 -73 b 49 -179 85 -147 50 -177 b 31 -184 43 -183 36 -184 b 0 -152 13 -184 0 -170 b 2 -138 0 -148 0 -142 b 83 -63 5 -133 8 -130 b 155 0 122 -29 155 -1 b 83 62 155 0 122 27 b 8 129 43 97 10 127 b 0 151 2 136 0 144 b 21 183 0 165 8 177 "
        },
        "v3f": {
            "x_min": -24.5,
            "x_max": 317.140625,
            "ha": 324,
            "o": "m -24 -147 l -24 -5 l -20 -5 b -1 -19 -12 -5 -4 -11 b 58 -123 6 -43 31 -86 b 196 -278 93 -173 134 -219 b 317 -570 274 -356 317 -460 b 294 -713 317 -617 308 -666 l 289 -724 l 294 -735 b 317 -873 308 -780 317 -827 b 235 -1132 317 -963 288 -1054 b 209 -1165 228 -1140 224 -1146 b 189 -1177 204 -1172 196 -1177 b 171 -1164 182 -1177 175 -1172 b 168 -1154 170 -1161 168 -1159 b 181 -1132 168 -1149 172 -1142 b 269 -891 238 -1064 269 -975 b 269 -881 269 -886 269 -884 b 262 -814 269 -857 265 -827 b 258 -800 261 -811 259 -806 b 142 -628 240 -731 198 -667 b -8 -589 112 -606 47 -589 b -20 -589 -13 -589 -19 -589 l -24 -589 l -24 -449 l -24 -308 l -20 -308 b -1 -322 -12 -308 -4 -313 b 58 -424 6 -345 31 -388 b 194 -580 93 -476 136 -523 b 259 -660 221 -606 245 -635 b 261 -663 259 -662 261 -663 b 264 -656 262 -663 262 -660 b 269 -587 268 -632 269 -610 b 264 -521 269 -566 268 -544 b 262 -512 264 -517 262 -513 b 258 -498 261 -509 259 -503 b 142 -326 240 -428 198 -365 b -8 -287 112 -303 47 -288 b -20 -287 -13 -287 -19 -287 l -24 -287 l -24 -147 "
        },
        "v40": {
            "x_min": -1.359375,
            "x_max": 436.921875,
            "ha": 446,
            "o": "m 213 205 b 217 205 215 205 216 205 b 234 194 224 205 234 199 b 236 187 234 194 235 190 l 245 167 l 261 129 l 270 106 b 355 -61 294 54 329 -13 b 420 -163 381 -105 402 -138 b 436 -188 435 -184 436 -184 b 436 -191 436 -190 436 -190 b 421 -206 436 -201 431 -206 l 421 -206 l 416 -206 l 405 -201 b 217 -158 347 -172 283 -158 b 31 -201 153 -158 88 -172 l 20 -206 l 14 -206 l 14 -206 b 0 -191 5 -206 0 -201 b -1 -188 0 -190 -1 -190 b 14 -163 -1 -186 0 -184 b 95 -34 36 -136 72 -77 b 166 106 119 8 148 68 l 175 129 l 183 148 l 200 188 b 213 205 205 199 208 202 "
        },
        "v41": {
            "x_min": -1.359375,
            "x_max": 556.6875,
            "ha": 568,
            "o": "m 294 322 b 318 323 299 322 308 323 b 360 320 334 323 352 322 b 526 217 430 310 490 273 b 543 166 537 202 543 184 b 447 70 543 117 503 70 b 445 70 447 70 446 70 b 359 159 394 72 359 113 b 368 201 359 173 362 187 b 442 245 382 229 412 245 b 455 244 446 245 451 245 b 460 244 458 244 460 244 b 460 244 460 244 460 244 b 454 248 460 244 458 245 b 325 291 417 276 372 291 b 285 287 313 291 299 290 b 144 -2 183 269 144 190 b 281 -290 144 -208 179 -280 b 304 -291 289 -291 298 -291 b 524 -105 412 -291 506 -212 b 541 -84 526 -88 530 -84 b 556 -101 551 -84 556 -90 b 549 -138 556 -111 553 -122 b 334 -322 521 -237 435 -310 b 302 -324 323 -323 313 -324 b 13 -101 172 -324 54 -234 b -1 -1 4 -68 -1 -34 b 294 322 -1 161 121 303 "
        },
        "v42": {
            "x_min": -348.4375,
            "x_max": 24.5,
            "ha": 25,
            "o": "m -330 155 b -322 156 -329 156 -326 156 b -315 156 -319 156 -317 156 b -298 147 -311 155 -308 154 b -19 30 -224 98 -122 55 l 2 26 b 24 -1 17 22 24 13 b 2 -27 24 -15 17 -23 l -19 -31 b -298 -148 -122 -56 -224 -99 b -322 -158 -313 -158 -315 -158 b -348 -131 -338 -158 -348 -145 b -344 -117 -348 -127 -347 -122 b -328 -104 -341 -112 -338 -111 b -127 -8 -269 -65 -202 -33 b -106 0 -115 -4 -106 -1 b -127 6 -106 0 -115 2 b -328 102 -202 31 -269 63 b -344 116 -338 109 -341 111 b -348 130 -347 120 -348 124 b -330 155 -348 141 -341 152 "
        },
        "v43": {
            "x_min": -442.359375,
            "x_max": 441,
            "ha": 450,
            "o": "m -31 487 b -1 488 -21 488 -10 488 b 434 104 216 488 397 330 b 441 27 438 79 441 47 b 439 12 441 20 439 15 b 419 0 435 4 427 0 b 404 5 413 0 408 1 b 398 30 400 11 398 13 b 0 351 390 213 213 351 b -59 348 -20 351 -39 349 b -400 30 -251 324 -393 191 b -405 5 -400 13 -401 11 b -420 0 -409 1 -415 0 b -441 12 -428 0 -436 4 b -442 27 -441 15 -442 20 b -435 104 -442 47 -439 79 b -31 487 -401 316 -235 474 m -13 131 b -1 133 -9 133 -5 133 b 51 105 19 133 39 123 b 61 70 58 95 61 83 b 51 34 61 58 58 45 b -1 6 39 16 19 6 b -46 27 -17 6 -34 13 b -62 69 -57 38 -62 54 b -13 131 -62 98 -44 124 "
        },
        "v44": {
            "x_min": -21.78125,
            "x_max": 251.8125,
            "ha": 257,
            "o": "m -8 631 b -1 632 -6 632 -4 632 b 19 620 8 632 16 628 b 20 383 20 616 20 616 l 20 148 l 21 151 b 137 199 59 183 99 199 b 182 191 152 199 167 197 b 251 84 227 176 251 134 b 228 0 251 58 243 29 b 100 -142 206 -40 178 -72 l 23 -215 b 0 -229 9 -229 6 -229 b -20 -216 -9 -229 -17 -224 l -21 -212 l -21 201 l -21 616 l -20 620 b -8 631 -17 624 -13 630 m 110 131 b 96 133 106 133 100 133 b 89 133 93 133 91 133 b 24 87 63 129 40 113 l 20 80 l 20 -37 l 20 -156 l 23 -152 b 144 81 96 -72 144 20 l 144 83 b 110 131 144 113 134 126 "
        },
        "v45": {
            "x_min": -402.890625,
            "x_max": 401.53125,
            "ha": 410,
            "o": "m -10 273 b -4 274 -9 273 -6 274 b 16 262 4 274 12 269 b 17 158 17 259 17 259 l 17 56 l 62 112 b 117 174 110 172 110 172 b 122 174 118 174 119 174 b 132 173 125 174 129 173 b 295 11 134 172 171 134 l 307 -1 l 336 34 b 374 76 366 72 368 74 b 381 77 375 77 378 77 b 401 56 392 77 401 68 b 400 48 401 54 401 51 b 223 -172 397 41 230 -166 b 210 -176 220 -174 215 -176 b 201 -174 206 -176 204 -176 b 112 -87 198 -173 178 -152 b 27 0 65 -38 27 0 b 21 -6 27 0 24 -2 l 17 -12 l 17 -147 b 17 -210 17 -173 17 -194 b 10 -292 17 -297 16 -287 b -2 -299 6 -297 2 -299 b -21 -287 -10 -299 -19 -295 b -24 -174 -23 -284 -23 -284 l -24 -63 l -66 -117 b -121 -176 -110 -170 -114 -176 b -125 -176 -122 -176 -123 -176 b -296 -12 -134 -174 -125 -184 l -308 0 l -337 -34 b -375 -77 -367 -73 -370 -76 b -382 -79 -377 -79 -379 -79 b -402 -58 -393 -79 -402 -69 b -401 -49 -402 -55 -402 -52 b -224 170 -398 -43 -231 165 b -212 174 -221 173 -216 174 b -202 173 -208 174 -205 174 b -39 11 -200 172 -151 122 l -28 -1 l -25 1 l -24 4 l -24 130 b -23 260 -24 256 -24 258 b -10 273 -20 266 -16 270 "
        },
        "v46": {
            "x_min": 0,
            "x_max": 627.46875,
            "ha": 640,
            "o": "m 306 190 b 314 191 308 191 311 191 b 326 184 318 191 322 190 l 336 173 b 510 52 377 127 442 80 b 515 49 513 51 515 49 b 611 16 537 40 579 24 b 627 0 624 13 627 9 b 607 -18 627 -11 624 -13 b 330 -181 490 -49 389 -109 b 314 -192 323 -190 319 -192 b 306 -191 311 -192 308 -192 b 294 -177 302 -188 302 -188 b 257 -140 287 -170 265 -148 b 19 -18 193 -84 114 -44 b 0 0 2 -13 0 -11 b 16 16 0 9 2 13 b 110 49 47 24 89 40 b 117 52 111 49 114 51 b 145 65 126 56 130 58 b 281 163 200 93 245 124 b 300 186 288 170 291 174 b 306 190 300 187 303 188 m 317 137 b 313 142 315 141 314 142 b 308 137 313 142 311 141 b 161 4 276 84 220 33 b 155 0 159 1 155 0 b 163 -4 155 0 159 -2 b 308 -138 220 -34 276 -84 b 313 -142 311 -141 313 -142 b 317 -138 314 -142 315 -141 b 464 -4 351 -84 406 -34 b 470 0 468 -2 470 0 b 464 4 470 0 468 1 b 317 137 406 33 351 84 "
        },
        "v47": {
            "x_min": -24.5,
            "x_max": 315.78125,
            "ha": 322,
            "o": "m -24 -145 l -24 -5 l -20 -5 b 1 -26 -10 -5 -6 -9 b 175 -241 31 -86 96 -166 b 314 -548 259 -323 304 -420 b 315 -589 315 -555 315 -571 b 314 -630 315 -606 315 -623 b 298 -730 311 -664 306 -699 l 295 -742 l 296 -748 b 314 -850 304 -778 311 -813 b 315 -892 315 -857 315 -874 b 314 -932 315 -909 315 -925 b 298 -1032 311 -967 306 -1002 l 295 -1045 l 296 -1050 b 314 -1153 304 -1081 311 -1115 b 315 -1193 315 -1160 315 -1177 b 314 -1235 315 -1211 315 -1228 b 217 -1526 306 -1338 270 -1444 b 201 -1533 213 -1532 208 -1533 b 182 -1522 193 -1533 185 -1529 b 179 -1514 181 -1518 179 -1517 b 189 -1489 179 -1508 182 -1501 b 266 -1217 240 -1403 266 -1308 b 262 -1156 266 -1196 265 -1177 b 110 -907 247 -1043 190 -950 b 0 -889 87 -895 50 -889 l -1 -889 l -24 -889 l -24 -749 l -24 -610 l -20 -610 b 1 -631 -10 -610 -6 -614 b 175 -846 31 -691 96 -771 b 259 -956 213 -884 236 -914 b 265 -966 262 -961 264 -966 b 265 -966 265 -966 265 -966 b 265 -953 265 -964 265 -959 b 266 -920 266 -943 266 -932 b 262 -853 266 -898 265 -873 b 110 -605 247 -741 190 -648 b 0 -587 87 -592 50 -587 l -1 -587 l -24 -587 l -24 -448 l -24 -308 l -20 -308 b 1 -328 -10 -308 -6 -312 b 175 -544 31 -388 96 -469 b 259 -655 213 -581 236 -612 b 265 -663 262 -659 264 -663 b 265 -663 265 -663 265 -663 b 265 -650 265 -663 265 -657 b 266 -617 266 -641 266 -630 b 262 -551 266 -595 265 -570 b 110 -303 247 -438 190 -345 b 0 -284 87 -290 50 -284 l -1 -284 l -24 -284 l -24 -145 "
        },
        "v49": {
            "x_min": 0,
            "x_max": 630.203125,
            "ha": 643,
            "o": "m 308 204 b 314 205 310 205 313 205 b 326 201 319 205 323 204 b 355 154 328 199 338 180 b 401 83 362 142 392 95 l 409 72 b 431 41 412 66 424 49 b 619 -174 498 -51 570 -134 b 630 -192 626 -180 630 -186 b 626 -202 630 -195 628 -199 b 616 -206 623 -205 620 -206 b 552 -188 608 -206 592 -202 b 310 -155 488 -169 392 -155 b 268 -156 295 -155 281 -155 b 77 -188 197 -161 126 -173 b 13 -206 35 -202 20 -206 b 9 -206 12 -206 10 -206 b 0 -191 2 -202 0 -197 b 8 -176 0 -186 2 -180 b 204 49 58 -136 138 -43 l 220 72 l 227 83 b 295 188 245 108 281 166 b 308 204 299 197 304 202 m 315 147 b 314 147 315 147 314 147 b 314 147 314 147 314 147 b 306 129 314 145 310 138 l 296 105 b 281 72 292 97 284 77 l 274 56 b 181 -123 247 -4 212 -72 l 174 -134 l 176 -133 b 314 -123 215 -127 272 -123 b 451 -133 356 -123 413 -127 l 454 -134 l 449 -123 b 353 56 417 -72 381 -4 l 347 72 b 332 105 344 77 336 97 l 322 129 b 315 147 318 138 315 145 "
        },
        "v4a": {
            "x_min": 70.78125,
            "x_max": 378.390625,
            "ha": 315,
            "o": "m 246 373 b 254 373 249 373 251 373 b 372 324 303 373 360 351 b 378 302 377 317 378 309 b 338 251 378 278 362 255 b 328 249 334 249 332 249 b 283 294 303 249 283 270 b 288 315 283 301 284 308 b 289 319 289 317 289 319 b 289 319 289 319 289 319 b 283 320 289 320 287 320 b 270 322 279 322 274 322 b 206 288 242 322 215 308 b 206 283 206 287 206 285 b 257 223 206 267 230 238 b 284 206 272 213 277 210 b 351 90 328 173 351 130 b 340 47 351 74 348 59 b 205 -30 314 -2 264 -30 b 182 -29 198 -30 190 -30 b 84 15 147 -24 103 -5 b 70 48 74 24 70 36 b 108 99 70 70 85 94 b 121 102 112 101 117 102 b 167 56 147 102 167 80 b 159 31 167 48 164 40 l 156 26 l 157 26 b 190 20 167 22 178 20 b 220 26 201 20 212 22 b 258 65 243 34 258 51 b 257 70 258 66 258 69 b 204 126 249 94 234 109 b 114 258 148 158 114 209 b 125 302 114 273 118 288 b 246 373 147 342 193 370 "
        },
        "v4d": {
            "x_min": -311.6875,
            "x_max": 310.328125,
            "ha": 317,
            "o": "m -9 388 b -2 390 -8 390 -5 390 b 5 388 1 390 4 390 b 19 378 10 387 16 383 b 23 333 23 371 23 371 b 24 298 23 299 24 298 b 81 276 34 298 65 285 b 213 91 145 240 190 177 b 224 24 217 76 224 36 b 257 24 224 24 235 24 b 299 19 292 24 292 24 b 310 -1 306 15 310 6 b 299 -23 310 -11 306 -19 b 257 -27 292 -27 292 -27 b 224 -29 235 -27 224 -29 b 213 -95 224 -40 217 -80 b 81 -280 190 -181 145 -244 b 24 -301 65 -290 34 -301 b 23 -335 24 -301 23 -303 l 23 -340 b 17 -381 23 -374 23 -374 b -1 -391 13 -388 5 -391 b -21 -381 -9 -391 -17 -388 b -27 -340 -27 -374 -27 -374 l -27 -335 b -28 -301 -27 -303 -27 -301 b -85 -280 -38 -301 -69 -290 b -217 -95 -149 -244 -194 -181 b -228 -29 -221 -80 -228 -40 b -259 -27 -228 -29 -238 -27 b -300 -23 -294 -27 -294 -27 b -311 -2 -307 -19 -311 -11 b -294 23 -311 8 -304 19 b -259 24 -291 23 -284 24 b -228 24 -239 24 -228 24 b -217 91 -228 36 -221 76 b -85 276 -194 177 -149 240 b -28 298 -69 285 -38 298 b -27 333 -27 298 -27 299 b -27 371 -27 362 -27 369 b -9 388 -24 378 -17 385 m -27 136 b -28 247 -27 197 -28 247 b -61 216 -31 247 -53 226 b -123 33 -95 172 -121 98 l -125 24 l -76 24 l -27 24 l -27 136 m 29 242 b 24 247 27 245 24 247 b 23 136 24 247 23 197 l 23 24 l 72 24 l 121 24 l 119 33 b 29 242 115 116 77 206 m -27 -140 l -27 -27 l -76 -27 l -125 -27 l -123 -36 b -61 -220 -121 -102 -95 -176 b -28 -251 -53 -230 -31 -251 b -27 -140 -28 -251 -27 -201 m 119 -36 l 121 -27 l 72 -27 l 23 -27 l 23 -140 b 24 -251 23 -201 24 -251 b 57 -220 27 -251 49 -230 b 119 -36 91 -176 117 -102 "
        },
        "v4e": {
            "x_min": 0,
            "x_max": 239.5625,
            "ha": 244,
            "o": "m 10 460 b 20 462 13 462 14 462 b 39 449 28 462 35 458 l 40 446 l 40 326 b 40 205 40 259 40 205 b 127 227 40 205 80 215 b 220 249 196 244 213 249 b 227 247 224 249 225 248 b 238 237 231 245 235 241 l 239 233 l 239 -106 l 239 -448 l 238 -451 b 219 -463 234 -459 225 -463 b 198 -451 210 -463 202 -459 l 197 -448 l 197 -324 b 197 -201 197 -248 197 -201 b 110 -223 196 -201 157 -210 b 17 -245 42 -240 24 -245 b 10 -242 13 -245 13 -244 b 0 -233 6 -241 2 -237 l 0 -230 l 0 108 l 0 446 l 0 449 b 10 460 2 453 6 458 m 197 22 b 197 70 197 41 197 58 b 196 116 197 113 197 116 l 196 116 b 118 97 196 116 160 106 l 40 77 l 40 -18 b 40 -112 40 -69 40 -112 l 119 -93 l 197 -73 l 197 22 "
        },
        "v52": {
            "x_min": -10.890625,
            "x_max": 298.078125,
            "ha": 294,
            "o": "m 138 473 b 142 474 140 473 141 474 b 164 459 148 474 153 470 b 191 402 183 442 191 423 b 181 353 191 388 187 371 b 178 349 179 352 178 349 b 179 348 178 348 179 348 b 185 349 181 348 182 348 b 255 376 210 355 234 363 b 272 381 264 381 266 381 b 298 355 287 381 298 370 b 288 330 298 348 298 345 b 171 34 238 254 194 141 b 166 13 168 16 168 16 b 144 1 161 5 152 1 b 121 15 134 1 125 5 b 115 33 119 18 117 24 b 0 330 91 145 49 252 b -10 355 -9 345 -10 348 b 13 381 -10 371 0 381 b 31 376 19 381 25 380 b 132 345 61 358 103 345 l 136 345 l 137 355 b 145 378 138 359 142 370 b 152 415 149 394 152 405 b 137 452 152 427 148 438 b 133 464 134 458 133 460 b 138 473 133 467 134 470 "
        },
        "v54": {
            "x_min": -24.5,
            "x_max": 317.140625,
            "ha": 324,
            "o": "m -24 -161 l -24 -5 l -20 -5 b 0 -24 -9 -5 -2 -12 b 171 -315 21 -124 84 -233 b 317 -660 268 -406 317 -531 b 187 -1014 317 -782 274 -909 b 161 -1034 172 -1034 171 -1034 b 141 -1013 149 -1034 141 -1025 b 152 -991 141 -1004 142 -1002 b 266 -682 228 -899 266 -788 b 174 -430 266 -588 236 -498 b -23 -317 136 -388 66 -348 b -24 -161 -23 -316 -24 -285 "
        },
        "v55": {
            "x_min": 0,
            "x_max": 551.25,
            "ha": 563,
            "o": "m 289 644 b 304 645 294 645 299 645 b 404 566 349 645 392 613 b 406 541 405 557 406 549 b 379 471 406 514 397 489 l 377 467 l 382 470 b 509 591 438 485 485 531 b 513 601 510 595 513 599 b 530 609 518 607 524 609 b 551 588 540 609 551 602 b 200 -605 551 584 204 -599 b 182 -616 197 -612 190 -616 b 163 -602 174 -616 166 -610 b 161 -598 161 -601 161 -601 b 217 -402 161 -589 170 -562 b 272 -213 247 -298 272 -213 b 272 -213 272 -213 272 -213 b 264 -219 272 -213 268 -216 b 140 -262 227 -247 182 -262 b 36 -226 102 -262 65 -249 b 0 -145 12 -206 0 -176 b 17 -84 0 -124 5 -104 b 103 -38 38 -54 70 -38 b 191 -91 137 -38 172 -56 b 205 -141 201 -106 205 -124 b 178 -212 205 -167 196 -194 l 175 -215 l 182 -213 b 307 -93 236 -198 284 -151 b 372 129 308 -88 372 127 b 372 129 372 129 372 129 b 364 122 372 129 368 126 b 240 80 328 94 283 80 b 137 115 202 80 166 91 b 99 195 112 136 99 165 b 118 256 99 217 106 238 b 204 303 138 287 171 303 b 292 249 238 303 273 285 b 306 199 302 234 306 217 b 279 129 306 173 296 148 l 276 126 l 281 127 b 408 248 336 142 385 190 b 473 470 409 254 473 469 b 473 470 473 470 473 470 b 465 464 473 470 469 467 b 341 421 428 435 383 421 b 236 458 303 421 266 433 b 200 537 212 478 200 508 b 289 644 200 585 234 635 "
        },
        "v58": {
            "x_min": -21.78125,
            "x_max": 367.5,
            "ha": 375,
            "o": "m 259 1553 b 265 1553 261 1553 264 1553 b 288 1540 272 1553 277 1550 b 367 1351 340 1493 367 1424 b 336 1221 367 1308 357 1263 l 332 1211 l 333 1208 b 367 1077 356 1170 367 1124 b 336 945 367 1032 357 986 l 332 935 l 333 932 b 367 800 356 893 367 848 b 336 669 367 756 357 710 l 332 659 l 333 656 b 367 523 356 617 367 571 b 345 412 367 485 360 446 b 231 273 322 356 284 310 b -1 19 121 195 27 93 b -17 4 -4 11 -10 5 l -21 4 l -21 134 l -21 265 l -17 265 b 133 291 20 265 96 278 b 318 537 245 328 318 433 b 307 603 318 559 315 582 b 303 614 304 612 304 614 b 298 609 302 614 300 613 b 231 549 281 589 258 567 b -1 295 121 471 27 369 b -17 280 -4 287 -10 281 l -21 280 l -21 410 l -21 541 l -17 541 b 133 567 20 541 96 555 b 318 813 245 605 318 709 b 307 880 318 835 315 859 b 303 891 304 888 304 891 b 298 885 302 891 300 888 b 231 825 281 866 258 843 b -1 571 121 748 27 645 b -17 556 -4 563 -10 557 l -21 556 l -21 687 l -21 817 l -17 817 b 133 843 20 817 96 830 b 318 1089 245 881 318 985 b 307 1156 318 1111 315 1134 b 303 1167 304 1164 304 1167 b 298 1161 302 1167 300 1164 b 231 1102 281 1140 258 1120 b -1 848 121 1024 27 921 b -17 832 -4 839 -10 834 l -21 832 l -21 963 l -21 1093 l -17 1093 b 114 1113 12 1093 78 1103 b 313 1314 215 1142 289 1218 b 318 1364 317 1331 318 1347 b 255 1511 318 1422 295 1478 b 243 1532 247 1519 243 1525 b 259 1553 243 1540 250 1550 "
        },
        "v59": {
            "x_min": 0,
            "x_max": 464.140625,
            "ha": 474,
            "o": "m 0 0 l 0 347 l 76 347 l 153 347 l 153 0 l 153 -348 l 76 -348 l 0 -348 l 0 0 m 308 -1 l 308 347 l 386 347 l 464 347 l 464 -1 l 464 -348 l 386 -348 l 308 -348 l 308 -1 "
        },
        "v5b": {
            "x_min": -441,
            "x_max": 439.640625,
            "ha": 449,
            "o": "m -428 -2 b -421 0 -427 -1 -424 0 b -406 -6 -416 0 -409 -2 b -400 -31 -401 -12 -400 -15 b -1 -352 -392 -215 -215 -352 b 58 -349 19 -352 38 -351 b 398 -31 250 -326 392 -192 b 404 -6 398 -15 400 -12 b 419 -1 408 -2 413 -1 b 439 -13 427 -1 435 -5 b 439 -29 439 -16 439 -22 b 434 -105 439 -48 438 -80 b 0 -489 397 -333 213 -489 b -68 -484 -23 -489 -44 -488 b -441 -36 -280 -452 -436 -263 b -441 -30 -441 -34 -441 -31 b -428 -2 -441 -11 -439 -5 m -13 -9 b -1 -8 -9 -8 -5 -8 b 50 -36 19 -8 39 -19 b 61 -72 57 -47 61 -59 b 50 -106 61 -84 57 -97 b -1 -134 39 -124 19 -134 b -46 -115 -17 -134 -34 -129 b -62 -72 -57 -102 -62 -87 b -13 -9 -62 -44 -44 -16 "
        },
        "v5c": {
            "x_min": 0,
            "x_max": 447.8125,
            "ha": 457,
            "o": "m 0 -87 l 0 0 l 223 0 l 447 0 l 447 -87 l 447 -174 l 223 -174 l 0 -174 l 0 -87 "
        },
        "v62": {
            "x_min": 46.28125,
            "x_max": 669.671875,
            "ha": 563,
            "o": "m 183 376 b 189 376 185 376 187 376 b 212 374 197 376 208 376 b 265 337 234 369 253 355 b 274 317 268 331 273 320 b 274 316 274 317 274 316 b 280 323 276 316 276 319 b 311 358 288 337 299 348 b 319 366 315 360 318 365 b 356 376 326 373 340 376 b 382 371 364 376 374 374 b 428 337 400 366 417 352 b 436 317 431 331 436 320 b 438 316 436 317 436 316 b 442 323 438 316 439 319 b 475 358 451 337 462 348 b 483 366 477 360 481 365 b 518 376 488 373 503 376 b 544 373 528 376 536 376 b 604 285 579 360 604 326 b 597 249 604 273 601 258 b 543 63 596 247 544 70 b 541 54 543 61 541 55 b 540 44 540 51 540 47 b 552 23 540 33 545 23 b 552 23 552 23 552 23 b 647 126 586 29 627 72 b 658 138 651 136 653 138 b 660 138 660 138 660 138 b 669 129 666 137 669 136 b 654 88 669 122 665 109 b 562 -12 631 43 602 9 l 549 -19 b 521 -27 540 -24 530 -27 b 447 30 490 -27 458 -4 b 443 58 445 38 443 48 b 450 93 443 72 446 84 b 504 278 453 97 504 272 b 507 288 506 283 506 287 b 509 298 507 292 509 295 b 491 326 509 310 502 320 b 487 327 490 327 488 327 b 479 324 484 327 483 326 b 441 270 462 316 443 288 b 435 249 441 265 436 254 b 398 127 434 248 419 195 b 362 4 379 61 362 5 b 328 -1 359 -1 362 -1 b 314 -1 323 -1 319 -1 b 302 -1 310 -1 306 -1 b 266 4 266 -1 269 -1 b 265 6 265 5 265 5 b 303 144 265 13 272 34 b 343 278 325 216 343 276 b 344 288 343 281 344 285 b 345 298 345 291 345 295 b 330 326 345 310 340 320 b 323 327 328 327 325 327 b 317 324 322 327 321 326 b 279 270 300 316 281 288 b 273 249 279 265 274 254 b 236 127 272 248 255 195 b 200 4 216 61 200 5 b 164 -1 197 -1 198 -1 b 151 -1 161 -1 156 -1 b 140 -1 147 -1 142 -1 b 103 4 104 -1 106 -1 b 103 6 103 5 103 5 b 141 144 103 13 108 34 b 181 278 161 216 179 276 b 182 288 181 281 181 285 b 183 298 182 291 183 295 b 168 324 183 310 178 320 b 160 327 166 326 163 327 b 141 320 156 327 151 324 b 69 230 112 305 85 272 b 57 215 65 217 62 215 b 55 215 57 215 55 215 b 46 224 49 215 46 217 b 59 260 46 231 50 242 b 151 363 81 306 112 341 b 161 369 155 365 160 367 b 183 376 166 371 174 374 "
        },
        "v70": {
            "x_min": 0,
            "x_max": 436.921875,
            "ha": 446,
            "o": "m 213 190 b 217 191 215 191 216 191 b 231 184 223 191 228 188 b 249 154 240 167 246 159 b 419 18 292 91 348 45 b 436 -1 435 11 436 8 b 424 -16 436 -9 434 -13 b 308 -87 394 -26 340 -59 b 231 -186 276 -117 257 -142 b 219 -192 228 -191 225 -192 b 198 -174 209 -192 208 -191 b 47 -33 161 -113 110 -63 b 10 -16 34 -26 17 -19 b 0 -1 2 -13 0 -9 b 17 18 0 8 1 11 b 198 173 95 48 156 101 b 213 190 206 187 208 188 "
        },
        "v72": {
            "x_min": -423.3125,
            "x_max": 421.9375,
            "ha": 431,
            "o": "m -262 197 b -247 197 -257 197 -253 197 b -118 162 -210 197 -163 184 b 40 45 -61 134 -13 98 b 277 -95 119 -33 200 -81 b 289 -97 281 -97 285 -97 b 378 0 332 -97 371 -55 b 378 11 378 4 378 6 b 302 83 378 55 345 83 b 242 66 283 83 262 77 b 208 56 231 59 219 56 b 148 120 175 56 148 81 b 201 186 148 151 164 172 b 261 198 220 194 240 198 b 420 45 341 198 411 136 b 421 22 421 37 421 29 b 245 -199 421 -93 338 -199 b 238 -198 243 -199 240 -199 b -44 -47 148 -194 50 -141 b -250 86 -114 22 -183 66 b -295 94 -270 91 -283 94 b -315 91 -302 94 -307 94 b -381 4 -356 81 -381 43 b -355 -56 -381 -18 -372 -40 b -298 -81 -338 -73 -319 -81 b -246 -68 -283 -81 -265 -77 b -212 -58 -234 -61 -223 -58 b -178 -69 -200 -58 -189 -62 b -151 -122 -160 -81 -151 -101 b -171 -167 -151 -138 -157 -155 b -239 -195 -185 -181 -213 -192 b -257 -197 -245 -197 -250 -197 b -423 -5 -352 -197 -423 -109 b -412 65 -423 16 -419 40 b -262 197 -389 137 -329 188 "
        },
        "v74": {
            "x_min": -206.890625,
            "x_max": 428.75,
            "ha": 438,
            "o": "m 389 -351 b 394 -351 390 -351 393 -351 b 428 -385 413 -351 428 -367 b 428 -394 428 -388 428 -391 b 394 -428 426 -406 421 -410 l 332 -473 l 269 -516 l 205 -560 l 141 -603 l 77 -648 l 13 -692 l -50 -737 l -114 -780 l -145 -802 b -171 -813 -157 -810 -163 -813 b -175 -813 -172 -813 -174 -813 b -206 -777 -194 -811 -206 -795 b -202 -760 -206 -771 -205 -766 b -87 -675 -197 -752 -206 -757 l -34 -639 l 83 -557 l 145 -514 l 209 -470 l 272 -427 b 389 -351 375 -356 381 -352 "
        },
        "v75": {
            "x_min": -149.71875,
            "x_max": 148.359375,
            "ha": 151,
            "o": "m -137 381 b -130 383 -134 383 -133 383 b -111 371 -122 383 -114 378 b -55 224 -110 370 -85 305 b 0 80 -25 145 -1 80 b 54 224 0 80 24 145 b 112 377 114 384 110 373 b 127 384 118 381 122 384 b 148 362 138 384 148 374 l 148 356 l 83 183 b 16 9 47 88 17 11 b -1 0 12 2 5 0 b -14 5 -5 0 -10 1 b -84 183 -19 9 -13 -6 l -149 356 l -149 362 b -137 381 -149 371 -145 378 "
        },
        "v79": {
            "x_min": -1.359375,
            "x_max": 899.703125,
            "ha": 918,
            "o": "m 307 349 b 332 351 315 351 323 351 b 443 340 367 351 408 347 b 741 47 607 306 720 195 b 744 0 743 31 744 16 b 660 -303 744 -90 713 -206 b 28 -755 534 -531 304 -695 b 14 -756 23 -755 19 -756 b -1 -741 4 -756 -1 -750 b 21 -720 -1 -731 1 -728 b 567 -56 337 -601 548 -344 b 568 -11 568 -41 568 -24 b 442 285 568 129 525 233 b 325 319 406 308 367 319 b 93 177 232 319 137 266 b 84 154 91 170 84 155 b 84 154 84 154 84 154 b 88 156 84 154 85 155 b 159 177 110 170 134 177 b 257 134 194 177 231 162 b 294 41 281 108 294 73 b 171 -97 294 -24 246 -90 b 156 -98 166 -97 161 -98 b 6 74 73 -98 6 -22 b 6 80 6 76 6 79 b 307 349 10 223 141 340 m 839 215 b 845 216 841 216 842 216 b 862 213 852 216 860 215 b 899 163 887 206 899 184 b 872 117 899 145 890 127 b 847 111 865 112 856 111 b 808 130 833 111 818 117 b 796 162 800 140 796 151 b 839 215 796 187 812 212 m 839 -112 b 845 -112 841 -112 842 -112 b 862 -115 852 -112 860 -113 b 899 -165 887 -122 899 -144 b 872 -210 899 -183 890 -201 b 847 -217 865 -215 856 -217 b 808 -198 833 -217 818 -210 b 796 -165 800 -188 796 -177 b 839 -112 796 -140 812 -116 "
        },
        "v7c": {
            "x_min": 0,
            "x_max": 300.8125,
            "ha": 307,
            "o": "m 49 505 b 53 506 50 505 51 506 b 70 496 58 506 62 503 b 81 485 73 492 78 488 l 96 473 l 111 459 l 122 449 l 134 438 l 182 396 l 255 330 b 292 291 292 298 292 298 l 292 290 l 292 284 l 283 270 b 209 36 234 197 209 113 b 288 -170 209 -44 235 -119 b 299 -184 295 -179 299 -181 b 300 -191 300 -187 300 -188 b 285 -206 300 -199 294 -206 b 280 -206 283 -206 281 -206 b 247 -201 270 -202 259 -201 b 176 -222 223 -201 197 -208 b 114 -340 136 -249 114 -292 b 172 -471 114 -384 134 -433 b 185 -492 182 -481 185 -487 b 181 -502 185 -496 183 -499 b 171 -508 176 -505 174 -508 b 152 -498 166 -508 160 -503 b 0 -284 65 -428 12 -352 b 0 -260 0 -278 0 -270 b 1 -238 0 -252 0 -242 b 148 -140 16 -177 73 -140 b 209 -148 167 -140 189 -142 b 215 -149 212 -148 215 -149 b 215 -149 215 -149 215 -149 l 215 -149 b 201 -136 215 -148 209 -142 l 157 -97 l 96 -41 b 17 34 21 24 17 29 b 17 37 17 36 17 36 b 17 38 17 37 17 38 b 25 56 17 44 17 44 b 110 298 81 131 110 219 b 46 474 110 367 88 431 b 38 491 40 480 38 487 b 49 505 38 498 42 502 "
        },
        "v7d": {
            "x_min": -1.359375,
            "x_max": 436.921875,
            "ha": 446,
            "o": "m 213 205 b 217 205 215 205 216 205 b 234 194 224 205 234 199 b 236 187 234 194 235 190 l 245 167 l 261 129 l 270 106 b 355 -61 294 54 329 -13 b 420 -163 381 -105 402 -138 b 436 -188 435 -184 436 -184 b 436 -191 436 -190 436 -190 b 421 -206 436 -201 431 -206 l 421 -206 l 416 -206 l 405 -201 b 217 -158 347 -172 283 -158 b 31 -201 153 -158 88 -172 l 20 -206 l 14 -206 l 14 -206 b 0 -191 5 -206 0 -201 b -1 -188 0 -190 -1 -190 b 14 -163 -1 -186 0 -184 b 95 -34 36 -136 72 -77 b 166 106 119 8 148 68 l 175 129 l 183 148 l 200 188 b 213 205 205 199 208 202 "
        },
        "v7f": {
            "x_min": 0,
            "x_max": 367.5,
            "ha": 375,
            "o": "m 0 124 l 0 187 l 61 187 l 122 187 l 122 138 l 122 91 l 153 61 l 183 30 l 213 61 l 243 91 l 243 138 l 243 187 l 306 187 l 367 187 l 367 124 l 367 61 l 321 61 l 274 61 l 243 30 l 213 0 l 243 -31 l 274 -62 l 321 -62 l 367 -62 l 367 -124 l 367 -188 l 306 -188 l 243 -188 l 243 -140 l 243 -93 l 213 -62 l 183 -31 l 153 -62 l 122 -93 l 122 -140 l 122 -188 l 61 -188 l 0 -188 l 0 -124 l 0 -62 l 46 -62 l 92 -62 l 123 -31 l 153 0 l 123 30 l 92 61 l 46 61 l 0 61 l 0 124 "
        },
        "v80": {
            "x_min": 29.9375,
            "x_max": 420.578125,
            "ha": 371,
            "o": "m 115 345 b 221 347 117 345 166 347 b 411 345 306 347 409 345 b 420 330 416 342 420 335 b 415 319 420 326 419 321 b 178 118 397 303 179 118 b 178 117 178 118 178 117 b 181 117 178 117 178 117 b 189 117 182 117 185 117 b 193 117 190 117 191 117 b 247 98 215 117 232 111 b 296 75 266 83 280 76 b 302 75 299 75 300 75 b 322 91 311 75 315 79 b 322 91 322 91 322 91 b 322 91 322 91 322 91 b 319 91 322 91 321 91 b 313 90 318 90 315 90 b 283 107 300 90 288 97 b 277 126 279 114 277 121 b 319 167 277 149 295 167 b 319 167 319 167 319 167 b 362 118 347 167 362 147 b 355 82 362 108 359 96 b 311 33 349 65 340 55 b 224 1 284 12 253 1 b 194 5 213 1 204 2 b 168 18 183 8 178 11 b 110 36 151 30 130 36 b 57 15 88 36 68 29 b 47 11 54 12 51 11 b 31 20 40 11 34 13 b 29 26 31 22 29 25 b 68 66 29 36 39 45 b 285 250 73 71 281 248 b 285 250 285 250 285 250 b 231 252 285 252 261 252 b 137 250 190 252 141 250 b 93 227 122 248 110 241 b 78 220 88 222 83 220 b 66 227 74 220 70 222 b 63 234 65 229 63 231 b 85 291 63 241 69 252 b 115 345 108 342 108 344 "
        },
        "v81": {
            "x_min": 0,
            "x_max": 428.75,
            "ha": 438,
            "o": "m 262 186 b 273 186 266 186 272 186 b 274 186 273 186 274 186 b 285 186 274 186 280 186 b 428 48 375 181 428 122 b 386 -68 428 12 416 -29 b 155 -187 329 -145 236 -187 b 12 -111 92 -187 38 -162 b 0 -51 4 -91 0 -72 b 262 186 0 58 122 179 m 366 131 b 352 134 362 133 357 134 b 219 81 321 134 269 115 b 47 -111 126 23 50 -62 b 47 -112 47 -111 47 -112 b 77 -136 47 -129 58 -136 b 264 -45 118 -136 194 -101 b 382 109 336 12 382 76 b 366 131 382 120 377 129 "
        },
        "v83": {
            "x_min": -1.359375,
            "x_max": 847.96875,
            "ha": 865,
            "o": "m 488 1499 b 495 1500 490 1500 492 1500 b 541 1465 507 1500 521 1490 b 679 1078 622 1372 679 1210 b 677 1050 679 1068 677 1060 b 477 642 668 893 604 764 l 443 609 l 431 596 l 431 592 l 438 562 l 449 508 l 460 458 b 481 355 475 390 481 355 b 481 355 481 355 481 355 b 490 356 481 355 485 355 b 528 358 495 356 511 358 b 558 356 540 358 552 356 b 839 95 699 338 808 237 b 847 22 845 72 847 47 b 631 -303 847 -113 766 -242 b 620 -309 623 -308 620 -309 l 620 -310 b 631 -359 620 -310 626 -333 l 646 -435 l 660 -496 b 672 -588 668 -535 672 -563 b 664 -653 672 -610 669 -630 b 383 -875 630 -792 509 -875 b 201 -810 321 -875 257 -855 b 129 -680 151 -768 129 -730 b 274 -530 129 -592 200 -530 b 351 -553 300 -530 326 -538 b 412 -669 393 -582 412 -626 b 287 -805 412 -735 366 -800 l 279 -805 l 285 -809 b 383 -830 318 -823 351 -830 b 586 -718 464 -830 540 -789 b 626 -584 612 -678 626 -631 b 619 -528 626 -566 623 -548 b 612 -495 619 -526 616 -510 b 577 -324 590 -387 577 -324 b 577 -324 577 -324 577 -324 b 568 -326 575 -324 571 -324 b 528 -334 558 -328 537 -333 b 465 -338 506 -337 485 -338 b 24 -11 269 -338 87 -206 b -1 145 8 41 -1 93 b 96 442 -1 249 32 351 b 322 714 166 541 236 626 l 352 745 l 345 782 l 332 843 l 315 921 b 303 984 310 950 304 978 b 295 1082 298 1017 295 1049 b 413 1426 295 1208 336 1329 b 488 1499 436 1456 477 1496 m 549 1301 b 541 1301 547 1301 544 1301 b 411 1207 500 1301 447 1263 b 355 1004 374 1152 355 1079 b 359 942 355 984 356 963 b 371 881 362 927 363 917 l 385 818 b 392 782 389 799 392 784 l 392 782 b 434 828 393 782 424 816 b 607 1165 534 941 594 1060 b 608 1193 608 1175 608 1183 b 597 1270 608 1224 604 1254 b 549 1301 589 1286 571 1299 m 398 528 b 393 555 396 542 393 553 b 392 555 393 555 393 555 b 317 470 390 555 347 505 b 190 298 266 408 212 334 b 127 70 148 227 127 148 b 155 -77 127 19 137 -30 b 468 -303 209 -216 333 -303 b 519 -299 484 -303 502 -302 b 568 -284 541 -295 568 -287 l 568 -284 b 563 -263 568 -284 566 -274 l 534 -120 l 511 -13 l 496 61 l 480 133 b 469 187 472 176 469 187 b 468 188 469 187 469 188 b 416 162 462 188 430 172 b 337 13 364 126 337 69 b 413 -124 337 -40 363 -93 b 428 -144 424 -131 428 -137 b 428 -149 428 -145 428 -148 b 409 -166 426 -161 419 -166 b 394 -162 405 -166 400 -165 b 240 77 302 -122 240 -27 l 240 77 b 430 342 240 197 315 301 l 436 344 l 426 394 l 398 528 m 548 194 b 526 195 540 195 532 195 b 519 195 524 195 521 195 l 514 195 l 518 177 l 539 79 l 552 15 l 566 -48 l 594 -187 l 605 -240 b 612 -266 609 -254 611 -266 b 612 -266 612 -266 612 -266 b 641 -248 613 -266 630 -256 b 744 -98 692 -212 730 -156 b 751 -40 749 -79 751 -59 b 548 194 751 76 665 181 "
        },
        "v84": {
            "x_min": 25.859375,
            "x_max": 164.6875,
            "ha": 168,
            "o": "m 34 369 b 40 370 35 370 38 370 b 59 353 49 370 50 367 b 164 40 122 254 155 158 b 164 0 164 33 164 16 b 164 -40 164 -16 164 -34 b 59 -353 155 -158 122 -254 b 40 -371 53 -366 47 -371 b 34 -370 38 -371 36 -370 b 25 -358 28 -367 25 -363 b 31 -337 25 -352 27 -347 b 92 0 72 -234 92 -117 b 31 335 92 116 72 233 b 25 356 27 345 25 352 b 34 369 25 363 28 366 "
        },
        "v8b": {
            "x_min": 0,
            "x_max": 319.859375,
            "ha": 326,
            "o": "m 149 508 b 159 509 152 509 155 509 b 186 494 170 509 181 503 b 190 440 190 487 190 488 l 190 430 l 190 377 l 242 377 l 251 377 b 303 373 298 377 296 377 b 319 345 314 367 319 356 b 304 319 319 335 314 324 b 250 315 296 315 299 315 l 242 315 l 190 315 l 190 262 l 190 252 b 186 198 190 204 190 205 b 159 183 179 188 170 183 b 132 198 148 183 138 188 b 127 252 127 205 127 204 l 127 262 l 127 315 l 76 315 l 68 315 b 14 319 20 315 21 315 b 0 347 4 324 0 335 b 14 373 0 356 4 367 b 68 377 21 377 20 377 l 76 377 l 127 377 l 127 430 l 127 440 b 132 494 127 488 127 487 b 149 508 136 501 142 505 "
        },
        "v8c": {
            "x_min": -330.75,
            "x_max": 329.390625,
            "ha": 336,
            "o": "m -133 483 b -117 484 -127 484 -122 484 b 31 373 -51 484 9 440 b 35 348 34 365 35 356 b -25 285 35 313 10 285 b -87 331 -55 285 -76 302 b -167 402 -100 376 -133 402 b -191 398 -175 402 -183 401 b -227 341 -215 388 -227 369 b -225 320 -227 334 -227 327 b -13 74 -209 230 -125 133 b 6 65 -4 70 5 66 l 9 63 l 10 65 b 117 231 12 68 40 112 l 189 341 l 242 424 b 268 460 262 456 264 458 b 283 464 273 463 277 464 b 308 438 296 464 308 453 l 308 437 b 287 396 308 430 308 428 l 95 98 l 59 43 l 58 41 l 65 37 b 253 -156 151 -8 217 -77 b 281 -285 272 -199 281 -244 b 148 -481 281 -381 231 -463 b 115 -485 137 -484 126 -485 b -32 -376 51 -485 -9 -442 b -36 -349 -35 -366 -36 -358 b 25 -287 -36 -315 -12 -287 b 85 -333 54 -287 74 -302 b 166 -403 99 -377 133 -403 b 190 -399 174 -403 182 -402 b 225 -342 215 -390 225 -370 b 224 -322 225 -335 225 -328 b 12 -76 208 -231 125 -134 b -8 -66 2 -72 -6 -68 l -10 -65 l -12 -66 b -118 -231 -13 -68 -42 -113 l -190 -342 l -243 -426 b -269 -462 -264 -458 -265 -458 b -284 -466 -274 -464 -279 -466 b -310 -440 -298 -466 -310 -455 l -310 -438 b -288 -398 -310 -430 -308 -430 l -96 -99 l -59 -44 l -59 -43 l -66 -38 b -281 284 -198 33 -281 158 l -281 284 b -133 483 -281 392 -220 474 m 254 177 b 266 179 258 177 262 179 b 319 149 287 179 307 167 b 329 115 326 140 329 127 b 319 79 329 102 326 90 b 268 51 307 61 287 51 b 221 72 250 51 234 58 b 205 115 210 84 205 99 b 254 177 205 142 223 170 m -281 -54 b -269 -52 -277 -52 -273 -52 b -223 -73 -253 -52 -235 -59 b -206 -116 -212 -84 -206 -101 b -216 -151 -206 -129 -209 -141 b -269 -179 -228 -170 -249 -179 b -314 -159 -285 -179 -302 -173 b -330 -116 -325 -147 -330 -131 b -281 -54 -330 -88 -313 -61 "
        },
        "v8f": {
            "x_min": -21.78125,
            "x_max": 362.0625,
            "ha": 369,
            "o": "m 302 1031 b 308 1032 304 1032 307 1032 b 330 1016 318 1032 325 1027 b 362 867 351 970 362 920 b 340 738 362 824 353 780 l 336 727 l 340 717 b 362 591 355 677 362 634 b 257 323 362 496 325 401 b 204 272 243 306 227 290 b 20 56 129 206 66 133 b -1 18 12 44 0 22 b -19 4 -4 9 -12 4 l -21 4 l -21 140 l -21 276 l -12 277 b 167 333 61 288 127 309 b 319 598 262 388 319 491 b 311 664 319 620 317 642 l 310 673 l 304 664 b 204 548 279 620 250 587 b 20 333 129 483 66 409 b -1 292 12 320 0 298 b -19 280 -4 285 -12 280 l -21 280 l -21 416 l -21 552 l -12 553 b 167 609 61 564 127 585 b 319 874 264 666 319 770 b 294 992 319 914 311 954 b 288 1011 288 1004 288 1007 b 302 1031 288 1021 294 1028 "
        },
        "v92": {
            "x_min": 0,
            "x_max": 598.890625,
            "ha": 611,
            "o": "m 62 181 b 77 183 66 183 72 183 b 91 181 83 183 88 183 b 202 131 100 180 106 177 l 299 87 l 394 131 b 517 183 499 181 502 183 b 519 183 517 183 518 183 b 598 104 567 183 598 144 b 577 49 598 84 592 65 b 518 15 567 38 563 37 b 484 0 499 6 484 0 b 518 -16 484 -1 499 -8 b 577 -51 563 -38 567 -40 b 598 -105 592 -66 598 -86 b 519 -184 598 -145 567 -184 b 517 -184 518 -184 517 -184 b 394 -133 502 -184 499 -183 l 299 -88 l 202 -133 b 81 -184 99 -183 95 -184 b 77 -184 80 -184 78 -184 b 0 -105 29 -184 0 -145 b 20 -51 0 -86 5 -66 b 80 -16 29 -40 34 -38 b 114 -1 98 -8 114 -1 b 80 15 114 0 98 6 b 20 49 34 37 29 38 b 0 104 6 65 0 84 b 62 181 0 140 23 174 m 88 134 b 74 136 85 134 80 136 b 68 134 72 136 69 136 b 46 104 54 130 46 117 b 55 81 46 95 49 88 b 149 34 59 76 53 80 b 224 -1 190 15 224 0 b 144 -38 224 -1 187 -18 b 54 -84 59 -79 58 -79 b 46 -105 49 -90 46 -98 b 76 -137 46 -122 58 -137 b 78 -137 77 -137 77 -137 b 194 -86 87 -137 76 -141 b 298 -36 250 -58 298 -36 b 298 -36 298 -36 298 -36 b 402 -84 299 -36 345 -58 b 518 -137 522 -141 510 -137 b 521 -137 519 -137 519 -137 b 551 -105 539 -137 551 -122 b 541 -83 551 -98 548 -90 b 447 -36 537 -77 544 -81 b 374 -1 406 -16 374 -1 b 447 34 374 0 406 15 b 541 81 544 80 537 76 b 551 104 548 88 551 97 b 521 136 551 120 539 136 b 518 136 519 136 519 136 b 517 136 518 136 517 136 l 517 136 b 402 83 511 136 511 136 b 298 34 345 56 299 34 b 298 34 298 34 298 34 b 194 84 298 34 250 56 b 88 134 137 111 89 133 "
        },
        "v93": {
            "x_min": 0,
            "x_max": 438.28125,
            "ha": 447,
            "o": "m 212 205 b 219 205 213 205 216 205 b 239 183 228 205 231 204 b 421 -163 298 40 363 -83 b 438 -191 434 -180 438 -186 b 436 -197 438 -192 438 -195 b 424 -206 434 -204 431 -206 b 406 -201 420 -206 415 -205 b 216 -156 347 -172 281 -156 b 23 -205 148 -156 80 -173 b 14 -206 20 -206 17 -206 b 0 -191 6 -206 0 -201 b 6 -176 0 -187 1 -183 b 202 192 63 -104 142 45 b 212 205 205 199 208 202 m 264 48 l 249 81 l 243 94 l 242 91 b 89 -126 208 36 137 -66 b 81 -138 85 -133 81 -138 b 81 -138 81 -138 81 -138 b 81 -138 81 -138 81 -138 b 95 -133 81 -138 87 -136 b 280 -94 156 -108 221 -94 b 334 -98 299 -94 317 -95 b 343 -99 338 -99 343 -99 b 343 -99 343 -99 343 -99 b 338 -94 343 -99 341 -97 b 264 48 318 -58 287 1 "
        },
        "v94": {
            "x_min": -149.71875,
            "x_max": 148.359375,
            "ha": 151,
            "o": "m -9 215 b 0 217 -6 217 -4 217 b 19 205 8 217 14 213 b 20 142 20 202 20 201 l 20 84 l 23 84 b 144 -27 81 74 129 30 b 148 -66 147 -40 148 -54 b 36 -213 148 -134 103 -197 b 0 -219 24 -217 12 -219 b -145 -104 -68 -219 -129 -173 b -149 -68 -148 -91 -149 -79 b -24 84 -149 6 -98 74 l -21 84 l -21 142 b -19 205 -20 201 -20 202 b -9 215 -17 209 -13 213 m -21 -15 b -23 41 -21 37 -21 41 b -23 41 -23 41 -23 41 b -76 11 -35 40 -62 26 b -108 -65 -98 -11 -108 -38 b -1 -176 -108 -122 -65 -176 b 107 -65 63 -176 107 -122 b 74 11 107 -38 96 -11 b 20 41 61 26 32 41 b 20 -15 20 41 20 15 b 19 -74 20 -72 20 -72 b 0 -87 14 -83 6 -87 b -19 -74 -8 -87 -16 -83 b -21 -15 -20 -72 -20 -72 "
        },
        "v95": {
            "x_min": 0,
            "x_max": 406.96875,
            "ha": 415,
            "o": "m 55 181 b 70 183 61 183 66 183 b 111 170 85 183 99 179 b 160 130 115 167 137 149 l 202 95 l 245 130 b 319 181 299 176 302 179 b 334 183 325 183 330 183 b 406 109 375 183 406 148 b 401 81 406 99 405 91 b 348 24 394 65 390 59 b 318 -1 332 11 318 0 b 348 -26 318 -1 332 -12 b 401 -83 390 -61 394 -66 b 406 -111 405 -93 406 -101 b 334 -184 406 -149 375 -184 b 319 -183 330 -184 325 -184 b 245 -131 302 -180 299 -177 l 202 -97 l 160 -131 b 85 -183 107 -177 103 -180 b 70 -184 80 -184 76 -184 b 0 -111 31 -184 0 -149 b 4 -83 0 -101 1 -93 b 58 -26 10 -66 16 -61 b 88 -1 74 -12 88 -1 b 58 24 88 0 74 11 b 10 69 23 54 17 59 b 0 109 2 81 0 95 b 55 181 0 142 21 173 m 83 133 b 72 136 78 136 76 136 b 57 131 66 136 61 134 b 46 109 49 126 46 117 b 50 93 46 104 47 98 b 107 45 51 91 77 70 b 160 0 137 20 160 0 b 107 -47 160 -1 137 -22 b 50 -94 77 -72 51 -93 b 46 -111 47 -99 46 -105 b 59 -134 46 -120 50 -130 b 72 -137 62 -136 68 -137 b 83 -136 76 -137 80 -136 b 144 -84 84 -134 107 -116 b 202 -36 176 -58 202 -36 b 261 -84 202 -36 230 -58 b 323 -136 299 -116 321 -134 b 334 -137 326 -136 330 -137 b 345 -134 338 -137 343 -136 b 360 -111 355 -130 360 -120 b 355 -94 360 -105 359 -99 b 299 -47 353 -93 329 -72 b 245 0 269 -22 245 -1 b 299 45 245 0 269 20 b 355 93 329 70 353 91 b 360 109 359 98 360 104 b 345 133 360 119 355 129 b 334 136 343 134 338 136 b 323 134 330 136 326 134 b 261 83 321 133 299 115 b 202 34 230 56 202 34 b 144 83 202 34 176 56 b 83 133 106 115 84 133 "
        },
        "v97": {
            "x_min": -228.671875,
            "x_max": 227.3125,
            "ha": 232,
            "o": "m -217 487 l -213 488 l 0 488 l 212 488 l 216 487 b 225 476 220 484 224 480 l 227 473 l 227 244 l 227 15 l 225 12 b 206 0 223 4 215 0 b 197 1 204 0 200 0 b 187 12 193 4 189 6 l 186 15 l 186 138 l 186 262 l -1 262 l -187 262 l -187 138 l -187 15 l -189 12 b -208 0 -193 4 -200 0 b -227 12 -216 0 -223 4 l -228 15 l -228 244 l -228 473 l -227 476 b -217 487 -225 480 -221 484 "
        },
        "v9a": {
            "x_min": -21.78125,
            "x_max": 367.5,
            "ha": 375,
            "o": "m 230 1031 b 238 1032 232 1032 235 1032 b 259 1014 245 1032 251 1027 b 367 662 330 906 367 782 b 364 602 367 641 367 621 b 232 317 352 488 304 384 b 57 120 155 245 103 187 b -1 18 31 84 6 40 b -19 4 -4 11 -12 4 l -21 4 l -21 159 l -21 315 l -16 315 b 96 335 10 315 62 324 b 315 695 227 380 315 527 b 313 738 315 709 314 724 b 224 991 304 825 273 916 b 216 1013 219 999 216 1007 b 230 1031 216 1021 220 1028 "
        },
        "v9b": {
            "x_min": -24.5,
            "x_max": 313.0625,
            "ha": 319,
            "o": "m -24 -133 l -24 -5 l -20 -5 b -1 -19 -12 -5 -4 -11 b 142 -213 13 -61 74 -144 b 258 -376 196 -269 230 -315 b 313 -605 295 -449 313 -528 b 292 -742 313 -652 306 -699 b 288 -752 289 -748 288 -752 b 288 -752 288 -752 288 -752 b 292 -764 289 -753 291 -757 b 313 -907 306 -811 313 -860 b 292 -1045 313 -954 306 -1002 b 288 -1054 289 -1050 288 -1054 b 288 -1054 288 -1054 288 -1054 b 292 -1067 289 -1054 291 -1060 b 313 -1210 306 -1113 313 -1161 b 292 -1346 313 -1257 306 -1304 b 288 -1357 289 -1353 288 -1357 b 288 -1357 288 -1357 288 -1357 b 292 -1368 289 -1357 291 -1363 b 313 -1512 306 -1415 313 -1464 b 292 -1648 313 -1560 306 -1605 b 288 -1660 289 -1654 288 -1660 b 288 -1660 288 -1660 288 -1660 b 292 -1671 289 -1660 291 -1665 b 313 -1814 306 -1719 313 -1766 b 250 -2040 313 -1897 291 -1977 b 232 -2062 238 -2057 236 -2059 b 221 -2065 230 -2063 225 -2065 b 200 -2045 210 -2065 201 -2057 b 200 -2043 200 -2044 200 -2044 b 208 -2026 200 -2037 202 -2034 b 269 -1826 249 -1966 269 -1897 b 153 -1544 269 -1726 230 -1625 b -9 -1472 115 -1506 58 -1481 b -21 -1471 -14 -1471 -19 -1471 l -24 -1471 l -24 -1343 l -24 -1215 l -20 -1215 b -1 -1229 -12 -1215 -4 -1221 b 142 -1424 13 -1270 74 -1353 b 257 -1582 196 -1478 228 -1524 b 264 -1594 261 -1589 264 -1594 l 264 -1594 b 265 -1582 264 -1594 264 -1589 b 270 -1525 268 -1562 270 -1544 b 153 -1243 270 -1424 228 -1321 b -9 -1170 115 -1203 58 -1178 b -21 -1168 -14 -1170 -19 -1168 l -24 -1168 l -24 -1041 l -24 -913 l -20 -913 b -1 -927 -12 -913 -4 -918 b 142 -1121 13 -967 74 -1050 b 257 -1281 196 -1175 228 -1221 b 264 -1292 261 -1286 264 -1292 l 264 -1292 b 265 -1279 264 -1292 264 -1286 b 270 -1222 268 -1261 270 -1242 b 153 -941 270 -1121 228 -1018 b -9 -867 115 -900 58 -875 b -21 -866 -14 -867 -19 -866 l -24 -866 l -24 -738 l -24 -610 l -20 -610 b -1 -624 -12 -610 -4 -616 b 142 -818 13 -664 74 -749 b 257 -978 196 -873 228 -918 b 264 -989 261 -984 264 -989 l 264 -989 b 265 -977 264 -989 264 -984 b 270 -920 268 -959 270 -939 b 153 -638 270 -818 228 -716 b -9 -564 115 -598 58 -573 b -21 -563 -14 -564 -19 -563 l -24 -563 l -24 -435 l -24 -308 l -20 -308 b -1 -322 -12 -308 -4 -313 b 142 -516 13 -363 74 -446 b 257 -675 196 -571 228 -616 b 264 -687 261 -681 264 -687 l 264 -687 b 265 -674 264 -687 264 -681 b 270 -617 268 -656 270 -637 b 153 -335 270 -516 228 -413 b -9 -262 115 -295 58 -270 b -21 -260 -14 -262 -19 -260 l -24 -260 l -24 -133 "
        },
        "v9c": {
            "x_min": -166.0625,
            "x_max": -25.859375,
            "ha": 0,
            "o": "m -49 369 b -42 370 -46 369 -44 370 b -27 360 -36 370 -29 366 b -25 355 -27 359 -25 358 b -32 335 -25 351 -28 347 b -92 52 -66 248 -87 159 b -93 -1 -93 43 -93 20 b -92 -54 -93 -23 -93 -45 b -32 -337 -85 -162 -66 -251 b -25 -355 -27 -349 -25 -352 b -42 -371 -25 -365 -32 -371 b -61 -353 -50 -371 -51 -369 b -163 -63 -119 -262 -153 -165 b -166 -1 -166 -37 -166 -31 b -163 62 -166 30 -166 36 b -61 352 -153 163 -119 260 b -49 369 -54 365 -51 366 "
        },
        "va3": {
            "x_min": 58.53125,
            "x_max": 228.671875,
            "ha": 294,
            "o": "m 138 371 b 142 373 140 371 141 373 b 178 342 149 373 156 366 b 228 251 217 297 228 278 b 228 244 228 248 228 247 b 176 147 227 212 212 184 b 123 73 152 122 132 93 b 121 62 122 70 121 66 b 145 13 121 48 129 31 b 153 -2 151 6 153 1 b 149 -9 153 -5 152 -6 b 144 -11 148 -11 145 -11 b 129 -1 140 -11 136 -8 b 61 87 89 37 68 68 b 58 113 59 95 58 105 b 110 215 58 144 74 177 b 163 287 134 240 155 269 b 166 299 166 291 166 295 b 141 348 166 313 157 330 b 133 360 134 356 133 358 b 133 363 133 362 133 362 b 138 371 133 367 136 370 "
        },
        "va5": {
            "x_min": 0,
            "x_max": 349.8125,
            "ha": 357,
            "o": "m 88 302 b 103 303 93 302 98 303 b 202 224 149 303 191 270 b 205 199 204 216 205 208 b 178 129 205 173 196 147 l 175 126 l 182 127 b 307 249 236 142 284 190 b 313 259 308 254 311 258 b 329 267 317 265 323 267 b 349 247 340 267 349 259 b 201 -263 349 242 204 -258 b 182 -273 197 -270 190 -273 b 163 -260 174 -273 166 -269 b 161 -256 161 -259 161 -258 b 217 -59 161 -248 170 -220 b 272 129 247 43 272 127 b 272 129 272 129 272 129 b 264 122 272 129 268 126 b 140 80 227 94 183 80 b 36 115 102 80 65 91 b 0 194 10 136 0 165 b 88 302 0 244 32 292 "
        },
        "va9": {
            "x_min": -24.5,
            "x_max": 314.421875,
            "ha": 321,
            "o": "m -24 -145 l -24 -5 l -20 -5 b 0 -23 -9 -5 -2 -12 b 27 -87 4 -38 14 -66 b 138 -220 53 -136 88 -177 b 235 -328 179 -255 208 -288 b 314 -592 287 -409 314 -501 b 292 -732 314 -639 307 -687 l 289 -742 l 294 -756 b 314 -896 307 -802 314 -849 b 292 -1035 314 -943 307 -991 l 289 -1045 l 294 -1057 b 314 -1197 307 -1104 314 -1152 b 292 -1338 314 -1246 307 -1292 l 289 -1347 l 294 -1360 b 314 -1500 307 -1407 314 -1454 b 273 -1689 314 -1565 300 -1628 b 250 -1712 265 -1710 261 -1712 b 228 -1691 236 -1712 228 -1704 l 228 -1685 l 234 -1675 b 270 -1507 258 -1621 270 -1564 b 98 -1193 270 -1381 209 -1261 b 40 -1174 76 -1179 58 -1174 b -10 -1189 24 -1174 8 -1178 b -20 -1192 -14 -1192 -16 -1192 l -24 -1192 l -24 -1052 l -24 -913 l -20 -913 b 0 -931 -9 -913 -2 -920 b 27 -995 4 -946 14 -974 b 138 -1128 53 -1043 88 -1085 b 257 -1275 190 -1172 228 -1220 b 262 -1283 259 -1279 262 -1283 l 262 -1283 b 269 -1249 264 -1282 268 -1260 b 270 -1206 270 -1233 270 -1220 b 98 -891 270 -1075 206 -957 b 40 -871 76 -877 58 -871 b -10 -886 24 -871 8 -875 b -20 -889 -14 -889 -16 -889 l -24 -889 l -24 -749 l -24 -610 l -20 -610 b 0 -628 -9 -610 -2 -617 b 27 -692 4 -644 14 -671 b 138 -825 53 -741 88 -782 b 257 -973 190 -870 228 -917 b 262 -981 259 -977 262 -981 l 262 -981 b 269 -946 264 -979 268 -957 b 270 -903 270 -931 270 -917 b 98 -588 270 -774 206 -655 b 40 -569 76 -574 58 -569 b -10 -584 24 -569 8 -574 b -20 -587 -14 -587 -16 -587 l -24 -587 l -24 -448 l -24 -308 l -20 -308 b 0 -326 -9 -308 -2 -315 b 27 -390 4 -341 14 -369 b 138 -523 53 -438 88 -480 b 257 -670 190 -567 228 -614 b 262 -678 259 -674 262 -678 b 262 -678 262 -678 262 -678 b 269 -644 264 -677 268 -656 b 270 -601 270 -628 270 -614 b 98 -285 270 -471 206 -352 b 40 -266 76 -273 58 -266 b -10 -281 24 -266 8 -272 b -20 -284 -14 -284 -16 -284 l -24 -284 l -24 -145 "
        },
        "vaa": {
            "x_min": -1.359375,
            "x_max": 752.703125,
            "ha": 768,
            "o": "m 490 985 b 504 986 495 986 500 986 b 604 907 551 986 593 954 b 607 884 607 900 607 892 b 581 813 607 857 597 831 l 578 810 l 583 811 b 710 932 638 827 687 873 b 714 943 711 936 713 942 b 730 952 720 949 725 952 b 752 931 741 952 752 943 b 200 -946 752 927 204 -941 b 182 -957 197 -953 190 -957 b 163 -945 174 -957 166 -953 b 161 -939 161 -942 161 -942 b 217 -743 161 -931 170 -904 b 272 -555 247 -639 272 -555 b 272 -555 272 -555 272 -555 b 264 -560 272 -555 268 -557 b 140 -603 227 -589 182 -603 b 36 -567 102 -603 65 -592 b -1 -487 12 -548 -1 -517 b 17 -427 -1 -466 5 -445 b 103 -380 38 -395 70 -380 b 191 -433 137 -380 172 -398 b 205 -484 201 -448 205 -466 b 178 -553 205 -509 196 -535 l 175 -557 l 182 -555 b 307 -435 236 -539 284 -494 b 372 -213 308 -430 372 -215 b 372 -213 372 -213 372 -213 b 364 -219 372 -213 368 -216 b 240 -262 328 -247 283 -262 b 137 -226 202 -262 166 -249 b 99 -145 112 -206 99 -176 b 118 -84 99 -124 106 -104 b 204 -38 138 -54 171 -38 b 292 -91 238 -38 273 -56 b 306 -141 302 -106 306 -124 b 279 -212 306 -167 296 -194 l 276 -215 l 281 -213 b 408 -93 336 -198 385 -151 b 473 129 409 -88 473 127 b 473 129 473 129 473 129 b 465 122 473 129 469 126 b 341 80 428 94 383 80 b 236 115 303 80 266 91 b 200 195 213 136 200 165 b 217 256 200 217 206 238 b 304 303 239 287 272 303 b 393 249 338 303 374 285 b 406 199 402 234 406 217 b 379 129 406 173 397 148 l 377 126 l 382 127 b 509 248 436 142 485 190 b 574 470 510 254 574 469 b 574 470 574 470 574 470 b 566 464 574 470 570 467 b 442 421 529 435 484 421 b 337 458 404 421 367 433 b 300 538 314 477 300 508 b 318 598 300 559 306 580 b 404 645 340 630 372 645 b 494 592 439 645 475 627 b 507 541 502 577 507 559 b 480 471 507 516 498 489 l 477 467 l 483 470 b 608 589 537 485 586 531 b 675 811 611 595 675 810 b 675 811 675 811 675 811 b 666 806 675 811 671 809 b 543 763 628 777 585 763 b 438 799 504 763 468 775 b 401 878 412 820 401 849 b 490 985 401 928 434 977 "
        },
        "vad": {
            "x_min": 0,
            "x_max": 873.828125,
            "ha": 892,
            "o": "m 0 0 l 0 703 l 81 703 l 164 703 l 164 0 l 164 -705 l 81 -705 l 0 -705 l 0 0 m 225 0 l 225 703 l 246 703 l 268 703 l 268 366 l 268 30 l 274 36 b 314 79 284 44 302 63 b 413 302 357 137 392 213 b 432 327 419 324 421 327 b 449 306 443 327 447 322 b 611 115 457 195 529 115 b 651 122 624 115 638 117 b 728 316 705 140 724 188 b 729 388 728 342 729 366 b 671 635 729 533 711 602 b 581 662 649 652 616 662 b 477 637 545 662 510 653 l 475 635 l 477 634 b 503 627 488 632 495 631 b 545 556 532 612 545 584 b 491 480 545 524 526 491 b 465 474 481 476 473 474 b 379 563 417 474 379 516 b 389 602 379 576 382 588 b 541 691 409 641 479 681 b 582 694 555 692 568 694 b 865 462 714 694 834 598 b 873 392 871 440 873 416 b 865 317 873 367 871 341 b 639 84 839 194 748 101 b 612 83 630 83 620 83 b 511 116 577 83 543 94 b 504 120 509 119 506 120 b 504 120 504 120 504 120 b 469 59 504 120 488 93 l 432 -1 l 469 -61 b 504 -122 488 -94 504 -122 b 504 -122 504 -122 504 -122 b 511 -117 506 -122 509 -120 b 612 -84 543 -95 577 -84 b 665 -91 630 -84 647 -87 b 869 -338 771 -122 850 -216 b 873 -392 872 -356 873 -374 b 798 -595 873 -469 847 -539 b 581 -695 741 -662 660 -695 b 406 -626 517 -695 454 -671 b 381 -563 389 -607 381 -585 b 465 -477 381 -519 413 -477 b 545 -559 514 -477 545 -519 b 503 -628 545 -587 532 -613 b 477 -635 495 -632 488 -634 l 475 -637 l 477 -638 b 581 -663 510 -655 545 -663 b 671 -637 616 -663 649 -653 b 729 -391 711 -603 729 -534 b 728 -317 729 -367 728 -344 b 623 -117 722 -173 698 -124 b 611 -116 619 -116 615 -116 b 449 -308 528 -116 457 -198 b 432 -328 447 -323 443 -328 b 413 -303 421 -328 419 -326 b 314 -80 392 -215 357 -138 b 274 -37 302 -65 284 -45 l 268 -31 l 268 -367 l 268 -705 l 246 -705 l 225 -705 l 225 0 "
        },
        "vb3": {
            "x_min": 0,
            "x_max": 227.3125,
            "ha": 232,
            "o": "m 91 213 b 100 215 93 215 96 215 b 227 58 167 215 224 144 b 227 52 227 56 227 54 b 61 -201 227 -43 164 -138 b 29 -216 44 -212 36 -216 b 23 -210 27 -216 24 -213 b 21 -205 21 -208 21 -206 b 34 -192 21 -201 25 -197 b 122 -55 89 -161 122 -106 b 104 6 122 -33 117 -12 l 103 9 l 96 9 b 4 79 57 9 17 38 b 0 112 1 90 0 101 b 91 213 0 163 36 209 "
        },
        "vb6": {
            "x_min": 0,
            "x_max": 556.6875,
            "ha": 568,
            "o": "m 289 545 b 298 546 292 545 295 546 b 318 533 306 546 315 541 b 319 428 319 530 319 528 l 319 327 l 334 327 b 526 223 412 326 485 285 b 543 172 537 206 543 190 b 447 76 543 122 503 76 b 445 76 446 76 446 76 b 359 165 394 77 359 119 b 368 205 359 179 362 192 b 441 251 382 233 412 251 b 455 249 446 251 451 251 b 460 248 458 249 460 248 b 460 248 460 248 460 248 b 454 254 460 249 458 251 b 334 295 419 280 378 294 l 319 295 l 319 4 l 319 -287 l 321 -285 b 328 -285 322 -285 325 -285 b 524 -99 424 -277 507 -198 b 541 -79 526 -84 530 -79 b 556 -97 551 -79 556 -84 b 548 -133 556 -105 553 -117 b 334 -317 521 -233 434 -306 b 322 -319 329 -317 323 -317 l 319 -319 l 319 -424 b 319 -471 319 -444 319 -459 b 313 -541 319 -544 318 -535 b 298 -548 308 -545 303 -548 b 279 -534 289 -548 281 -542 b 277 -424 277 -531 277 -530 l 277 -317 l 273 -317 b 13 -95 153 -305 51 -217 b 0 2 4 -62 0 -29 b 182 295 0 126 66 238 b 274 324 210 309 249 320 l 277 324 l 277 427 b 279 533 277 528 277 530 b 289 545 281 538 285 542 m 277 2 b 277 291 277 161 277 291 b 268 288 277 291 273 290 b 144 1 179 265 144 184 b 276 -284 144 -199 175 -267 l 277 -285 l 277 2 "
        },
        "vb9": {
            "x_min": -122.5,
            "x_max": 121.140625,
            "ha": 124,
            "o": "m -16 145 b 0 147 -10 147 -5 147 b 121 -1 66 147 121 77 b 114 -49 121 -16 118 -33 b -1 -148 95 -112 47 -148 b -85 -106 -31 -148 -61 -134 b -122 -1 -110 -76 -122 -38 b -16 145 -122 68 -81 134 m 12 111 b 0 113 8 113 4 113 b -68 22 -29 113 -61 73 b -70 0 -69 15 -70 6 b -13 -113 -70 -49 -47 -98 b -1 -115 -9 -115 -5 -115 b 63 -40 24 -115 53 -83 b 68 -1 66 -27 68 -15 b 12 111 68 48 46 97 "
        },
        "vba": {
            "x_min": -118.421875,
            "x_max": 597.53125,
            "ha": 381,
            "o": "m 460 574 b 464 574 461 574 462 574 b 488 574 470 574 481 574 b 500 573 491 574 498 574 b 594 503 543 570 588 538 b 597 488 596 498 597 494 b 528 417 597 449 564 417 b 502 423 519 417 510 419 b 465 481 477 434 465 458 b 488 528 465 499 472 516 b 490 530 490 530 490 530 b 490 530 490 530 490 530 b 468 517 488 530 475 523 b 349 340 419 485 377 420 b 347 330 348 334 347 330 b 383 328 347 328 363 328 b 428 326 423 328 424 328 b 442 302 438 320 442 312 b 430 281 442 294 438 285 b 385 276 424 277 426 276 l 377 276 l 332 276 l 330 269 b 178 -117 303 126 250 -9 b 1 -249 129 -194 69 -237 b -20 -251 -6 -251 -13 -251 b -114 -187 -65 -251 -100 -227 b -118 -156 -117 -177 -118 -166 b -51 -84 -118 -116 -91 -84 b -31 -87 -46 -84 -39 -86 b 16 -152 0 -95 16 -124 b -12 -205 16 -173 8 -194 b -16 -208 -14 -206 -16 -208 b -14 -208 -16 -208 -14 -208 b -9 -206 -14 -208 -12 -208 b 74 -124 23 -197 54 -166 b 172 224 98 -79 125 22 b 185 276 178 252 183 274 b 185 276 185 276 185 276 b 141 276 185 276 181 276 b 91 280 96 276 96 276 b 77 302 83 285 77 294 b 91 326 77 312 83 320 b 148 328 95 328 96 328 l 198 330 l 202 341 b 460 574 249 473 351 566 "
        },
        "vbf": {
            "x_min": -53.078125,
            "x_max": 513.140625,
            "ha": 485,
            "o": "m 185 383 b 196 384 187 383 191 384 b 277 334 230 384 259 365 b 288 301 281 324 288 306 b 288 297 288 298 288 297 b 294 302 289 297 291 299 b 394 370 323 338 367 367 b 404 371 398 370 401 371 b 510 272 453 371 498 328 b 513 237 513 262 513 251 b 507 172 513 217 511 192 b 326 -34 487 59 412 -26 b 314 -36 322 -36 318 -36 b 274 -24 298 -36 283 -31 l 265 -16 b 224 44 246 -1 232 20 b 223 49 224 47 223 49 b 223 49 223 49 223 49 b 149 -197 221 48 149 -194 b 149 -198 149 -197 149 -198 b 170 -210 149 -202 155 -205 b 187 -215 174 -210 175 -212 b 204 -231 201 -219 204 -222 b 197 -245 204 -240 202 -242 l 194 -248 l 76 -248 l -42 -248 l -46 -245 b -53 -231 -51 -242 -53 -240 b -35 -215 -53 -222 -49 -217 b -13 -210 -21 -212 -20 -212 b -6 -208 -10 -209 -8 -208 b 0 -206 -6 -208 -2 -206 b 25 -188 13 -201 21 -195 b 163 280 28 -183 163 276 b 166 291 163 283 164 287 b 167 302 167 295 167 299 b 155 324 167 315 161 324 b 155 324 155 324 155 324 b 65 230 125 322 85 280 b 53 215 61 217 58 215 b 51 215 53 215 51 215 b 42 224 46 215 42 217 b 57 263 42 231 47 244 b 140 360 77 305 104 337 b 152 370 144 365 149 369 b 185 383 157 376 172 381 m 374 306 b 366 308 371 308 368 308 b 300 273 348 308 321 294 b 284 254 288 262 287 259 b 280 242 283 249 281 245 b 257 169 279 240 270 213 l 236 98 l 236 93 b 251 48 238 77 243 61 b 279 27 258 37 272 27 b 281 27 279 27 280 27 b 291 31 281 27 287 30 b 396 170 334 52 378 109 b 406 247 402 197 406 224 b 401 277 406 259 405 270 b 374 306 397 290 383 303 "
        },
        "vc3": {
            "x_min": -10.890625,
            "x_max": 299.4375,
            "ha": 294,
            "o": "m 136 460 b 142 462 137 462 140 462 b 166 449 152 462 161 456 b 171 428 168 446 168 445 b 288 131 194 322 238 209 b 298 115 295 120 296 117 b 299 106 298 112 299 109 b 273 81 299 91 287 81 b 255 86 268 81 261 83 b 155 116 225 104 183 116 l 152 116 l 149 108 b 141 83 148 102 144 91 b 134 48 137 69 134 58 b 149 9 134 34 140 24 b 153 -1 152 5 153 1 b 149 -9 153 -5 152 -6 b 144 -11 148 -11 147 -11 b 122 2 138 -11 133 -6 b 95 61 104 20 95 38 b 107 108 95 74 99 90 b 108 113 107 111 108 112 b 107 113 108 113 108 113 b 102 113 106 113 104 113 b 31 86 76 108 53 98 b 14 80 24 81 20 80 b -10 106 0 80 -10 91 b 0 131 -10 115 -9 116 b 115 430 49 209 91 317 b 136 460 119 451 123 456 "
        }
    },
    "cssFontWeight": "normal",
    "ascender": 1903,
    "underlinePosition": -125,
    "cssFontStyle": "normal",
    "boundingBox": {
        "yMin": -2065.375,
        "xMin": -695.53125,
        "yMax": 1901.578125,
        "xMax": 1159.671875
    },
    "resolution": 1000,
    "descender": -2066,
    "familyName": "VexFlow-18",
    "lineHeight": 4093,
    "underlineThickness": 50
};// Vex Flow
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010
//
// Requires a glyph font to be loaded and Vex.Flow.Font to be set.

/**
 * A quick and dirty static glyph renderer. Renders glyphs from the default
 * font defined in Vex.Flow.Font.
 *
 * @param {!Object} ctx The canvas context.
 * @param {number} x_pos X coordinate.
 * @param {number} y_pos Y coordinate.
 * @param {number} point The point size to use.
 * @param {string} val The glyph code in Vex.Flow.Font.
 * @param {boolean} nocache If set, disables caching of font outline.
 */
Vex.Flow.renderGlyph = function(ctx, x_pos, y_pos, point, val, nocache) {
  var scale = point * 72.0 / (Vex.Flow.Font.resolution * 100.0);
  var metrics = Vex.Flow.Glyph.loadMetrics(Vex.Flow.Font, val, !nocache);
  Vex.Flow.Glyph.renderOutline(ctx, metrics.outline, scale, x_pos, y_pos);
};

/**
 * @constructor
 */
Vex.Flow.Glyph = (function() {
  function Glyph(code, point, options) {
    this.code = code;
    this.point = point;
    this.context = null;
    this.options = {
      cache: true,
      font: Vex.Flow.Font
    };

    this.width = null;
    this.metrics = null;
    this.x_shift = 0;
    this.y_shift = 0;

    if (options) this.setOptions(options); else this.reset();
  }

  Glyph.prototype = {
    setOptions: function(options) {
      Vex.Merge(this.options, options);
      this.reset();
    },

    setStave: function(stave) { this.stave = stave; return this; },
    setXShift: function(x_shift) { this.x_shift = x_shift; return this; },
    setYShift: function(y_shift) { this.y_shift = y_shift; return this; },
    setContext: function(context) { this.context = context; return this; },
    getContext: function() { return this.context; },

    reset: function() {
      this.metrics = Vex.Flow.Glyph.loadMetrics(this.options.font, this.code,
          this.options.cache);
      this.scale = this.point * 72 / (this.options.font.resolution * 100);
    },

    getMetrics: function() {
      if (!this.metrics) throw new Vex.RuntimeError("BadGlyph", "Glyph " +
          this.code + " is not initialized.");
      return {
        x_min: this.metrics.x_min * this.scale,
        x_max: this.metrics.x_max * this.scale,
        width: (this.metrics.x_max - this.metrics.x_min) * this.scale
      };
    },

    render: function(ctx, x_pos, y_pos) {
      if (!this.metrics) throw new Vex.RuntimeError("BadGlyph", "Glyph " +
          this.code + " is not initialized.");

      var outline = this.metrics.outline;
      var scale = this.scale;

      Glyph.renderOutline(ctx, outline, scale, x_pos, y_pos);
    },

    renderToStave: function(x) {
      if (!this.metrics) throw new Vex.RuntimeError("BadGlyph", "Glyph " +
          this.code + " is not initialized.");
      if (!this.stave) throw new Vex.RuntimeError("GlyphError", "No valid stave");
      if (!this.context) throw new Vex.RERR("GlyphError", "No valid context");

      var outline = this.metrics.outline;
      var scale = this.scale;

      Glyph.renderOutline(this.context, outline, scale,
          x + this.x_shift, this.stave.getYForGlyphs() + this.y_shift);
    }
  };

  /* Static methods used to implement loading / unloading of glyphs */
  Glyph.loadMetrics = function(font, code, cache) {
    var glyph = font.glyphs[code];
    if (!glyph) throw new Vex.RuntimeError("BadGlyph", "Glyph " + code +
        " does not exist in font.");

    var x_min = glyph.x_min;
    var x_max = glyph.x_max;

    var outline;

    if (glyph.o) {
      if (cache) {
        if (glyph.cached_outline) {
          outline = glyph.cached_outline;
        } else {
          outline = glyph.o.split(' ');
          glyph.cached_outline = outline;
        }
      } else {
        if (glyph.cached_outline) delete glyph.cached_outline;
        outline = glyph.o.split(' ');
      }

      return {
        x_min: x_min,
        x_max: x_max,
        outline: outline
      };
    } else {
      throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code +
          " has no outline defined.");
    }
  };

  Glyph.renderOutline = function(ctx, outline, scale, x_pos, y_pos) {
    var outlineLength = outline.length;

    ctx.beginPath();

    ctx.moveTo(x_pos, y_pos);

    for (var i = 0; i < outlineLength; ) {
      var action = outline[i++];

      switch(action) {
        case 'm':
          ctx.moveTo(x_pos + outline[i++] * scale,
                     y_pos + outline[i++] * -scale);
          break;
        case 'l':
          ctx.lineTo(x_pos + outline[i++] * scale,
                     y_pos + outline[i++] * -scale);
          break;

        case 'q':
          var cpx = x_pos + outline[i++] * scale;
          var cpy = y_pos + outline[i++] * -scale;

          ctx.quadraticCurveTo(
              x_pos + outline[i++] * scale,
              y_pos + outline[i++] * -scale, cpx, cpy);
          break;

        case 'b':
          var x = x_pos + outline[i++] * scale;
          var y = y_pos + outline[i++] * -scale;

          ctx.bezierCurveTo(
              x_pos + outline[i++] * scale, y_pos + outline[i++] * -scale,
              x_pos + outline[i++] * scale, y_pos + outline[i++] * -scale,
              x, y);
          break;
      }
    }
    ctx.fill();
  };

  return Glyph;
}());
// Vex Flow
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Cheppudira 2010

/** @constructor */
Vex.Flow.Stave = (function() {
  function Stave(x, y, width, options) {
    if (arguments.length > 0) this.init(x, y, width, options);
  }

  var THICKNESS = (Vex.Flow.STAVE_LINE_THICKNESS > 1 ?
        Vex.Flow.STAVE_LINE_THICKNESS : 0);
  Stave.prototype = {
    init: function(x, y, width, options) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.glyph_start_x = x + 5;
      this.start_x = this.glyph_start_x;
      this.context = null;
      this.glyphs = [];
      this.modifiers = [];  // non-glyph stave items (barlines, coda, segno, etc.)
      this.measure = 0;
      this.clef = "treble";
      this.font = {
        family: "sans-serif",
        size: 8,
        weight: ""
      };
      this.options = {
        vertical_bar_width: 10,       // Width around vertical bar end-marker
        glyph_spacing_px: 10,
        num_lines: 5,
        fill_style: "#999999",
        spacing_between_lines_px: 10, // in pixels
        space_above_staff_ln: 4,      // in staff lines
        space_below_staff_ln: 4,      // in staff lines
        top_text_position: 1,         // in staff lines
        bottom_text_position: 6       // in staff lines
      };
      this.bounds = {x: this.x, y: this.y, w: this.width, h: 0};
      Vex.Merge(this.options, options);

      this.options.line_config = [];
      for (var i = 0; i < this.options.num_lines; i++) {
        this.options.line_config.push({ visible: true });
      }

      this.height =
        (this.options.num_lines + this.options.space_above_staff_ln) *
         this.options.spacing_between_lines_px;
      this.modifiers.push(
          new Vex.Flow.Barline(Vex.Flow.Barline.type.SINGLE, this.x)); // beg bar
      this.modifiers.push(
          new Vex.Flow.Barline(Vex.Flow.Barline.type.SINGLE,
          this.x + this.width)); // end bar
    },

    setNoteStartX: function(x) { this.start_x = x; return this; },
    getNoteStartX: function() {
      var start_x = this.start_x;

      // Add additional space if left barline is REPEAT_BEGIN
      if (this.modifiers[0].barline == Vex.Flow.Barline.type.REPEAT_BEGIN)
        start_x += 20;
      return start_x;
    },

    getNoteEndX: function() { return this.x + this.width; },
    getTieStartX: function() { return this.start_x; },
    getTieEndX: function() { return this.x + this.width; },
    setContext: function(context) { this.context = context; return this; },
    getContext: function() { return this.context; },
    getX: function() { return this.x; },
    getNumLines: function() { return this.options.num_lines; },
    setY: function(y) { this.y = y; return this; },

    setWidth: function(width) {
      this.width = width;
      // reset the x position of the end barline
      this.modifiers[1].setX(this.x + this.width);
      return this;
    },

    setMeasure: function(measure) { this.measure = measure; return this; },

      // Bar Line functions
    setBegBarType: function(type) {
      // Only valid bar types at beginning of stave is none, single or begin repeat
      if (type == Vex.Flow.Barline.type.SINGLE ||
          type == Vex.Flow.Barline.type.REPEAT_BEGIN ||
          type == Vex.Flow.Barline.type.NONE) {
          this.modifiers[0] = new Vex.Flow.Barline(type, this.x);
      }
      return this;
    },

    setEndBarType: function(type) {
      // Repeat end not valid at end of stave
      if (type != Vex.Flow.Barline.type.REPEAT_BEGIN)
        this.modifiers[1] = new Vex.Flow.Barline(type, this.x + this.width);
      return this;
    },

    getRepeatBeginXShift: function() {
      var x = this.glyph_start_x;
      var bar_x_shift = 0;

      for (var i = 0; i < this.glyphs.length; ++i) {
        var glyph = this.glyphs[i];
        x += glyph.getMetrics().width;
        bar_x_shift += glyph.getMetrics().width;
      }

      // Add padding after clef, time sig, key sig
      if (bar_x_shift > 0) bar_x_shift += this.options.vertical_bar_width + 10;

      return bar_x_shift;
    },

    // Coda & Segno Symbol functions
    setRepetitionTypeLeft: function(type, y) {
      this.modifiers.push(new Vex.Flow.Repetition(type, this.x, y));
      return this;
    },

    setRepetitionTypeRight: function(type, y) {
      this.modifiers.push(new Vex.Flow.Repetition(type, this.x, y) );
      return this;
    },

    // Volta functions
    setVoltaType: function(type, number_t, y) {
      this.modifiers.push(new Vex.Flow.Volta(type, number_t, this.x, y));
      return this;
    },

    // Section functions
    setSection: function(section, y) {
      this.modifiers.push(new Vex.Flow.StaveSection(section, this.x, y));
      return this;
    },

    // Tempo functions
    setTempo: function(tempo, y) {
      this.modifiers.push(new Vex.Flow.StaveTempo(tempo, this.x, y));
      return this;
    },

    getHeight: function() {
      return this.height;
    },

    getSpacingBetweenLines: function() {
      return this.options.spacing_between_lines_px;
    },

    getBoundingBox: function() {
      return new Vex.Flow.BoundingBox(this.x, this.y, this.width, this.getBottomY() - this.y);
      // body...
    },

    getBottomY: function() {
      var options = this.options;
      var spacing = options.spacing_between_lines_px;
      var score_bottom = this.getYForLine(options.num_lines) +
         (options.space_below_staff_ln * spacing);

      return score_bottom;
    },

    getYForLine: function(line) {
      var options = this.options;
      var spacing = options.spacing_between_lines_px;
      var headroom = options.space_above_staff_ln;

      var y = this.y + ((line * spacing) + (headroom * spacing)) -
        (THICKNESS / 2);

      return y;
    },

    getYForTopText: function(line) {
      var l = line || 0;
      return this.getYForLine(-l - this.options.top_text_position);
    },

    getYForBottomText: function(line) {
      var l = line || 0;
      return this.getYForLine(this.options.bottom_text_position + l);
    },

    getYForNote: function(line) {
      var options = this.options;
      var spacing = options.spacing_between_lines_px;
      var headroom = options.space_above_staff_ln;
      var y = this.y + (headroom * spacing) + (5 * spacing) - (line * spacing);

      return y;
    },

    getYForGlyphs: function() {
      return this.getYForLine(3);
    },

    addGlyph: function(glyph) {
      glyph.setStave(this);
      this.glyphs.push(glyph);
      this.start_x += glyph.getMetrics().width;
      return this;
    },

    addModifier: function(modifier) {
      this.modifiers.push(modifier);
      modifier.addToStave(this, (this.glyphs.length === 0));
      return this;
    },

    addKeySignature: function(keySpec) {
      this.addModifier(new Vex.Flow.KeySignature(keySpec));
      return this;
    },

    addClef: function(clef) {
      this.clef = clef;
      this.addModifier(new Vex.Flow.Clef(clef));
      return this;
    },

    addTimeSignature: function(timeSpec, customPadding) {
      this.addModifier(new Vex.Flow.TimeSignature(timeSpec, customPadding));
      return this;
    },

    addTrebleGlyph: function() {
      this.clef = "treble";
      this.addGlyph(new Vex.Flow.Glyph("v83", 40));
      return this;
    },

    /**
     * All drawing functions below need the context to be set.
     */
    draw: function() {
      if (!this.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw stave without canvas context.");

      var num_lines = this.options.num_lines;
      var width = this.width;
      var x = this.x;
      var y;

      // Render lines
      for (var line=0; line < num_lines; line++) {
        y = this.getYForLine(line);

        this.context.save();
        this.context.setFillStyle(this.options.fill_style);
        this.context.setStrokeStyle(this.options.fill_style);
        if (this.options.line_config[line].visible) {
          this.context.fillRect(x, y, width, Vex.Flow.STAVE_LINE_THICKNESS);
        }
        this.context.restore();
      }

      // render glyphs
      x = this.glyph_start_x;
      for (var i = 0; i < this.glyphs.length; ++i) {
        var glyph = this.glyphs[i];
        if (!glyph.getContext()) {
          glyph.setContext(this.context);
        }
        glyph.renderToStave(x);
        x += glyph.getMetrics().width;
      }

      // Draw the modifiers (bar lines, coda, segno, repeat brackets, etc.)
      for (i = 0; i < this.modifiers.length; i++) {
        // Only draw modifier if it has a draw function
        if (typeof this.modifiers[i].draw == "function")
          this.modifiers[i].draw(this, this.getRepeatBeginXShift());
      }
      if (this.measure > 0) {
        this.context.save();
        this.context.setFont(this.font.family, this.font.size, this.font.weight);
        var text_width = this.context.measureText("" + this.measure).width;
        y = this.getYForTopText(0) + 3;
        this.context.fillText("" + this.measure, this.x - text_width / 2, y);
        this.context.restore();
      }

      return this;
    },

    // Draw Simple barlines for backward compatability
    // Do not delete - draws the beginning bar of the stave
    drawVertical: function(x, isDouble) {
      this.drawVerticalFixed(this.x + x, isDouble);
    },

    drawVerticalFixed: function(x, isDouble) {
      if (!this.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw stave without canvas context.");

      var top_line = this.getYForLine(0);
      var bottom_line = this.getYForLine(this.options.num_lines - 1);
      if (isDouble)
        this.context.fillRect(x - 3, top_line, 1, bottom_line - top_line + 1);
      this.context.fillRect(x, top_line, 1, bottom_line - top_line + 1);
    },

    drawVerticalBar: function(x) {
      this.drawVerticalBarFixed(this.x + x, false);
    },

    drawVerticalBarFixed: function(x) {
      if (!this.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw stave without canvas context.");

      var top_line = this.getYForLine(0);
      var bottom_line = this.getYForLine(this.options.num_lines - 1);
      this.context.fillRect(x, top_line, 1, bottom_line - top_line + 1);
    },

    /**
     * Get the current configuration for the Stave.
     * @return {Array} An array of configuration objects.
     */
    getConfigForLines: function() {
      return this.options.line_config;
    },

    /**
     * Configure properties of the lines in the Stave
     * @param line_number The index of the line to configure.
     * @param line_config An configuration object for the specified line.
     * @throws Vex.RERR "StaveConfigError" When the specified line number is out of
     *   range of the number of lines specified in the constructor.
     */
    setConfigForLine: function(line_number, line_config) {
      if (line_number >= this.options.num_lines || line_number < 0) {
        throw new Vex.RERR("StaveConfigError",
          "The line number must be within the range of the number of lines in the Stave.");
      }
      if (!line_config.hasOwnProperty('visible')) {
        throw new Vex.RERR("StaveConfigError",
          "The line configuration object is missing the 'visible' property.");
      }
      if (typeof(line_config.visible) !== 'boolean') {
        throw new Vex.RERR("StaveConfigError",
          "The line configuration objects 'visible' property must be true or false.");
      }

      this.options.line_config[line_number] = line_config;

      return this;
    },

    /**
     * Set the staff line configuration array for all of the lines at once.
     * @param lines_configuration An array of line configuration objects.  These objects
     *   are of the same format as the single one passed in to setLineConfiguration().
     *   The caller can set null for any line config entry if it is desired that the default be used
     * @throws Vex.RERR "StaveConfigError" When the lines_configuration array does not have
     *   exactly the same number of elements as the num_lines configuration object set in
     *   the constructor.
     */
    setConfigForLines: function(lines_configuration) {
      if (lines_configuration.length !== this.options.num_lines) {
        throw new Vex.RERR("StaveConfigError",
          "The length of the lines configuration array must match the number of lines in the Stave");
      }

      // Make sure the defaults are present in case an incomplete set of
      //  configuration options were supplied.
      for (var line_config in lines_configuration) {
        // Allow 'null' to be used if the caller just wants the default for a particular node.
        if (!lines_configuration[line_config]) {
          lines_configuration[line_config] = this.options.line_config[line_config];
        }
        Vex.Merge(this.options.line_config[line_config], lines_configuration[line_config]);
      }

      this.options.line_config = lines_configuration;

      return this;
    }
  };

  return Stave;
}());// Vex Flow Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010
//
// Requires vex.js.

/** @constructor */
Vex.Flow.StaveConnector = (function() {
  function StaveConnector(top_stave, bottom_stave) {
    this.init(top_stave, bottom_stave);
  }

  // SINGLE_LEFT and SINGLE are the same value for compatibility
  // with older versions of vexflow which didn't have right sided 
  // stave connectors
  StaveConnector.type = {
    SINGLE_RIGHT : 0,
    SINGLE_LEFT : 1,
    SINGLE: 1,
    DOUBLE: 2,
    BRACE: 3,
    BRACKET: 4,
    BOLD_DOUBLE_LEFT: 5,
    BOLD_DOUBLE_RIGHT: 6
  };

  var THICKNESS = Vex.Flow.STAVE_LINE_THICKNESS;

  StaveConnector.prototype = {
    init: function(top_stave, bottom_stave) {
      this.width = 3;
      this.top_stave = top_stave;
      this.bottom_stave = bottom_stave;
      this.type = StaveConnector.type.DOUBLE;
      this.x_shift = 0; // Mainly used to offset Bold Double Left to align with offset Repeat Begin bars
    },

    setContext: function(ctx) {
      this.ctx = ctx;
      return this;
    },

    setType: function(type) {
      if (type >= StaveConnector.type.SINGLE_RIGHT &&
          type <= StaveConnector.type.BOLD_DOUBLE_RIGHT)
        this.type = type;
      return this;
    },

    setXShift: function(x_shift){
      if (typeof x_shift !== 'number') {
        throw Vex.RERR("InvalidType", "x_shift must be a Number");
      }

      this.x_shift = x_shift;
      return this;
    },

    draw: function() {
      if (!this.ctx) throw new Vex.RERR(
          "NoContext", "Can't draw without a context.");
      var topY = this.top_stave.getYForLine(0);
      var botY = this.bottom_stave.getYForLine(this.bottom_stave.getNumLines() - 1) +
        THICKNESS;
      var width = this.width;
      var topX = this.top_stave.getX();

      var isRightSidedConnector = (this.type === StaveConnector.type.SINGLE_RIGHT || 
        this.type === StaveConnector.type.BOLD_DOUBLE_RIGHT);

      if (isRightSidedConnector){
        topX = this.top_stave.getX() + this.top_stave.width;
      }

      var attachment_height = botY - topY;
      switch (this.type) {
        case StaveConnector.type.SINGLE:
          width = 1;
          break;
        case StaveConnector.type.SINGLE_LEFT: 
          width = 1;
          break;
        case StaveConnector.type.SINGLE_RIGHT:
          width = 1;
          break;
        case StaveConnector.type.DOUBLE:
          topX -= (this.width + 2);
          break;
        case StaveConnector.type.BRACE:
          width = 12;
          // May need additional code to draw brace
          var x1 = this.top_stave.getX() - 2;
          var y1 = topY;
          var x3 = x1;
          var y3 = botY;
          var x2 = x1 - width;
          var y2 = y1 + attachment_height/2.0;
          var cpx1 = x2 - (0.90 * width);
          var cpy1 = y1 + (0.2 * attachment_height);
          var cpx2 = x1 + (1.10 * width);
          var cpy2 = y2 - (0.135 * attachment_height);
          var cpx3 = cpx2;
          var cpy3 = y2 + (0.135 * attachment_height);
          var cpx4 = cpx1;
          var cpy4 = y3 - (0.2 * attachment_height);
          var cpx5 = x2 - width;
          var cpy5 = cpy4;
          var cpx6 = x1 + (0.40 * width);
          var cpy6 = y2 + (0.135 * attachment_height);
          var cpx7 = cpx6;
          var cpy7 = y2 - (0.135 * attachment_height);
          var cpx8 = cpx5;
          var cpy8 = cpy1;
          this.ctx.beginPath();
          this.ctx.moveTo(x1, y1);
          this.ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
          this.ctx.bezierCurveTo(cpx3, cpy3, cpx4, cpy4, x3, y3);
          this.ctx.bezierCurveTo(cpx5, cpy5, cpx6, cpy6, x2, y2);
          this.ctx.bezierCurveTo(cpx7, cpy7, cpx8, cpy8, x1, y1);
          this.ctx.fill();
          this.ctx.stroke();
          break;
        case StaveConnector.type.BRACKET:
          topY -= 4;
          botY += 4;
          attachment_height = botY - topY;
          Vex.Flow.renderGlyph(this.ctx, topX - 5, topY - 3, 40, "v1b", true);
          Vex.Flow.renderGlyph(this.ctx, topX - 5, botY + 3, 40, "v10", true);
          topX -= (this.width + 2);
          break;
        case StaveConnector.type.BOLD_DOUBLE_LEFT:
          drawBoldDoubleLine(this.ctx, this.type, topX + this.x_shift, topY, botY);
          break;
        case StaveConnector.type.BOLD_DOUBLE_RIGHT:
          drawBoldDoubleLine(this.ctx, this.type, topX, topY, botY);
          break;
      }

      if (this.type !== StaveConnector.type.BRACE && 
        this.type !== StaveConnector.type.BOLD_DOUBLE_LEFT && 
        this.type !== StaveConnector.type.BOLD_DOUBLE_RIGHT) {
        this.ctx.fillRect(topX , topY, width, attachment_height);
      }
    }
  };

  function drawBoldDoubleLine(ctx, type, topX, topY, botY){
    if (type !== StaveConnector.type.BOLD_DOUBLE_LEFT &&
        type !== StaveConnector.type.BOLD_DOUBLE_RIGHT) {
      throw Vex.RERR("InvalidConnector",
        "A REPEAT_BEGIN or REPEAT_END type must be provided.");
    }
    var x_shift = 3;
    var variableWidth = 3.5; // Width for avoiding anti-aliasing width issues
    var thickLineOffset = 2; // For aesthetics

    if (type === StaveConnector.type.BOLD_DOUBLE_RIGHT) {
      x_shift = -5; // Flips the side of the thin line
      variableWidth = 3; 
    }

    // Thin line
    ctx.fillRect(topX + x_shift, topY, 1, botY - topY);
    // Thick line
    ctx.fillRect(topX - thickLineOffset, topY, variableWidth, botY - topY);
  }

  return StaveConnector;
}());// Vex Flow
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Cheppudira 2010

/** @constructor */
Vex.Flow.TabStave = (function() {
  function TabStave(x, y, width, options) {
    if (arguments.length > 0) this.init(x, y, width, options);
  }

  Vex.Inherit(TabStave, Vex.Flow.Stave, {
    init: function(x, y, width, options) {
      var tab_options = {
        spacing_between_lines_px: 13,
        num_lines: 6,
        top_text_position: 1,
        bottom_text_position: 7
      };

      Vex.Merge(tab_options, options);
      TabStave.superclass.init.call(this, x, y, width, tab_options);
    },

    setNumberOfLines: function(lines) {
      this.options.num_lines = lines; return this;
    },

    getYForGlyphs: function() {
      return this.getYForLine(2.5);
    },

    addTabGlyph: function() {
      var glyphScale;
      var glyphOffset;

      switch(this.options.num_lines) {
        case 6:
          glyphScale = 40;
          glyphOffset = 0;
          break;
        case 5:
          glyphScale = 30;
          glyphOffset = -6;
          break;
        case 4:
          glyphScale = 23;
          glyphOffset = -12;
          break;
      }

      var tabGlyph = new Vex.Flow.Glyph("v2f", glyphScale);
      tabGlyph.y_shift = glyphOffset;
      this.addGlyph(tabGlyph);
      return this;
    }
  });

  return TabStave;
}());// Vex Flow
// Copyright Mohit Cheppudira <mohit@muthanna.com>
//
// A formatter for abstract tickable objects, such as notes, chords,
// tabs, etc.

/** @constructor */
Vex.Flow.TickContext = (function() {
  function TickContext() {
    this.init();
  }

  TickContext.prototype = {
    init: function() {
      this.currentTick = new Vex.Flow.Fraction(0, 1);
      this.maxTicks = new Vex.Flow.Fraction(0, 1);
      this.minTicks = null;
      this.width = 0;
      this.padding = 3;     // padding on each side (width += padding * 2)
      this.pixelsUsed = 0;
      this.x = 0;
      this.tickables = [];   // Notes, tabs, chords, lyrics.
      this.notePx = 0;       // width of widest note in this context
      this.extraLeftPx = 0;  // Extra left pixels for modifers & displace notes
      this.extraRightPx = 0; // Extra right pixels for modifers & displace notes

      // Ignore this tick context for formatting and justification
      this.ignore_ticks = true;
      this.preFormatted = false;
      this.context = null; // Rendering context
    },

    setContext: function(context) { this.context = context; return this; },
    getContext: function() { return this.context; },
    shouldIgnoreTicks: function() { return this.ignore_ticks; },
    getWidth: function() { return this.width + (this.padding * 2); },
    getX: function() { return this.x; },
    setX: function(x) { this.x = x; return this; },
    getPixelsUsed: function() { return this.pixelsUsed; },
    setPixelsUsed: function(pixelsUsed) { this.pixelsUsed = pixelsUsed; return this; },
    setPadding: function(padding) { this.padding = padding; return this; },
    getMaxTicks: function() { return this.maxTicks; },
    getMinTicks: function() { return this.minTicks; },
    getTickables: function() { return this.tickables; },

    // Get widths context, note and left/right modifiers for formatting
    getMetrics: function() {
      return { width: this.width, notePx: this.notePx,
               extraLeftPx: this.extraLeftPx, extraRightPx: this.extraRightPx };
    },

    getCurrentTick: function() { return this.currentTick; },
    setCurrentTick: function(tick) {
      this.currentTick = tick;
      this.preFormatted = false;
    },

    // Get left & right pixels used for modifiers
    getExtraPx: function() {
      var left_shift = 0;
      var right_shift = 0;
      var extraLeftPx = 0;
      var extraRightPx = 0;
      for (var i = 0; i < this.tickables.length; i++) {
        extraLeftPx = Math.max(this.tickables[i].extraLeftPx, extraLeftPx);
        extraRightPx = Math.max(this.tickables[i].extraRightPx, extraRightPx);
        var mContext = this.tickables[i].modifierContext;
        if (mContext && mContext != null) {
          left_shift = Math.max( left_shift, mContext.state.left_shift);
          right_shift = Math.max( right_shift, mContext.state.right_shift);
        }
      }
      return { left: left_shift, right: right_shift,
               extraLeft: extraLeftPx, extraRight: extraRightPx };
    },

    addTickable: function(tickable) {
      if (!tickable) {
        throw new Vex.RERR("BadArgument", "Invalid tickable added.");
      }

      if (!tickable.shouldIgnoreTicks()) {
        this.ignore_ticks = false;

        var ticks = tickable.getTicks();

        if (ticks.value() > this.maxTicks.value()) {
          this.maxTicks = ticks.clone();
        }

        if (this.minTicks == null) {
          this.minTicks = ticks.clone();
        } else if (ticks.value() < this.minTicks.value()) {
          this.minTicks = ticks.clone();
        }
      }

      tickable.setTickContext(this);
      this.tickables.push(tickable);
      this.preFormatted = false;
      return this;
    },

    preFormat: function() {
      if (this.preFormatted) return;

      for (var i = 0; i < this.tickables.length; ++i) {
        var tickable = this.tickables[i];
        tickable.preFormat();
        var metrics = tickable.getMetrics();

        // Maintain max extra pixels from all tickables in the context
        this.extraLeftPx = Math.max(this.extraLeftPx,
                                    metrics.extraLeftPx + metrics.modLeftPx);
        this.extraRightPx = Math.max(this.extraRightPx,
                                     metrics.extraRightPx + metrics.modRightPx);

        // Maintain the widest note for all tickables in the context
        this.notePx = Math.max(this.notePx, metrics.noteWidth);

        // Recalculate the tick context total width
        this.width = this.notePx +
                     this.extraLeftPx +
                     this.extraRightPx;
      }

      return this;
    }
  };

  return TickContext;
}());
// Vex Flow
// Copyright Mohit Cheppudira <mohit@muthanna.com>
//
// The tickable interface. Tickables are things that sit on a score and
// have a duration, i.e., they occupy space in the musical rendering dimension.

/** @constructor */
Vex.Flow.Tickable = (function() {
  function Tickable() {
    this.init();
  }

  Tickable.prototype = {
    init: function() {
      this.intrinsicTicks = 0;
      this.tickMultiplier = new Vex.Flow.Fraction(1, 1);
      this.ticks = new Vex.Flow.Fraction(0, 1);
      this.width = 0;
      this.x_shift = 0; // Shift from tick context
      this.voice = null;
      this.tickContext = null;
      this.modifierContext = null;
      this.modifiers = [];
      this.preFormatted = false;
      this.tuplet = null;

      // This flag tells the formatter to ignore this tickable during
      // formatting and justification. It is set by tickables such as BarNote.
      this.ignore_ticks = false;
      this.context = null;
    },

    setContext: function(context) { this.context = context; },
    getBoundingBox: function() { return null; },
    getTicks: function() { return this.ticks; },
    shouldIgnoreTicks: function() { return this.ignore_ticks; },
    getWidth: function() { return this.width; },
    setXShift: function(x) { this.x_shift = x; },

    // Every tickable must be associated with a voice. This allows formatters
    // and preFormatter to associate them with the right modifierContexts.
    getVoice: function() {
      if (!this.voice) throw new Vex.RERR("NoVoice", "Tickable has no voice.");
      return this.voice;
    },
    setVoice: function(voice) { this.voice = voice; },

    getTuplet: function() { return this.tuplet; },
    setTuplet: function(tuplet) {
      // Detach from previous tuplet
      var noteCount, beatsOccupied;

      if (this.tuplet) {
        noteCount = this.tuplet.getNoteCount();
        beatsOccupied = this.tuplet.getBeatsOccupied();

        // Revert old multiplier
        this.applyTickMultiplier(noteCount, beatsOccupied);
      }

      // Attach to new tuplet
      if (tuplet) {
        noteCount = tuplet.getNoteCount();
        beatsOccupied = tuplet.getBeatsOccupied();

        this.applyTickMultiplier(beatsOccupied, noteCount);
      }

      this.tuplet = tuplet;

      return this;
    },

    /** optional, if tickable has modifiers **/
    addToModifierContext: function(mc) {
      this.modifierContext = mc;
      // Add modifiers to modifier context (if any)
      this.preFormatted = false;
    },

    /** optional, if tickable has modifiers **/
    addModifier: function(mod) {
      this.modifiers.push(mod);
      this.preFormatted = false;
      return this;
    },

    setTickContext: function(tc) {
      this.tickContext = tc;
      this.preFormatted = false;
    },

    preFormat: function() {
      if (this.preFormatted) return;

      this.width = 0;
      if (this.modifierContext) {
        this.modifierContext.preFormat();
        this.width += this.modifierContext.getWidth();
      }
    },

    getIntrinsicTicks: function() {
      return this.intrinsicTicks;
    },
    setIntrinsicTicks: function(intrinsicTicks) {
      this.intrinsicTicks = intrinsicTicks;
      this.ticks = this.tickMultiplier.clone().multiply(this.intrinsicTicks);
    },

    getTickMultiplier: function() {
      return this.tickMultiplier;
    },
    applyTickMultiplier: function(numerator, denominator) {
      this.tickMultiplier.multiply(numerator, denominator);
      this.ticks = this.tickMultiplier.clone().multiply(this.intrinsicTicks);
    }
  };

  return Tickable;
}());
// Vex Flow Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010
//
// Requires vex.js.

/** @constructor */
Vex.Flow.Note = (function() {
  function Note(note_struct) {
    if (arguments.length > 0) this.init(note_struct);
  }

  Vex.Inherit(Note, Vex.Flow.Tickable, {
    init: function(note_struct) {
      Note.superclass.init.call(this);

      // Sanity check
      if (!note_struct) {
        throw new Vex.RuntimeError("BadArguments",
            "Note must have valid initialization data to identify " +
            "duration and type.");
      }

      var initData = Vex.Flow.parseNoteData(note_struct);
      if (!initData) {
        throw new Vex.RuntimeError("BadArguments",
            "Invalid note initialization object: " + JSON.stringify(note_struct));
      }

      // Note properties
      this.duration = initData.duration;
      this.dots = initData.dots;
      this.noteType = initData.type;
      this.setIntrinsicTicks(initData.ticks);
      this.modifiers = [];

      if (this.positions &&
          (typeof(this.positions) != "object" || !this.positions.length)) {
        throw new Vex.RuntimeError(
          "BadArguments", "Note keys must be array type.");
      }

      // Note to play for audio players
      this.playNote = null;

      // Positioning contexts
      this.tickContext = null;    // The current tick context
      this.modifierContext = null;
      this.ignore_ticks = false;

      // Positioning variables
      this.width = 0;             // Width in pixels calculated after preFormat
      this.extraLeftPx = 0;       // Extra room on left for offset note head
      this.extraRightPx = 0;      // Extra room on right for offset note head
      this.x_shift = 0;           // X shift from tick context X
      this.left_modPx = 0;        // Max width of left modifiers
      this.right_modPx = 0;       // Max width of right modifiers
      this.voice = null;          // The voice that this note is in
      this.preFormatted = false;  // Is this note preFormatted?
      this.ys = [];               // list of y coordinates for each note
                                  // we need to hold on to these for ties and beams.
      // Drawing
      this.context = null;
      this.stave = null;
    },

    setPlayNote: function(note) { this.playNote = note; return this; },

    getPlayNote: function() { return this.playNote; },

    // Don't play notes by default, call them rests.
    isRest: function() { return false; },

    addStroke: function(index, stroke) {
      stroke.setNote(this);
      stroke.setIndex(index);
      this.modifiers.push(stroke);
      this.setPreFormatted(false);
      return this;
    },


    getStave: function() { return this.stave; },
    setStave: function(stave) {
      this.stave = stave;
      this.setYs([stave.getYForLine(0)]);
      this.context = this.stave.context;
      return this;
    },

    setContext: function(context) { this.context = context; return this; },
    getExtraLeftPx: function() { return this.extraLeftPx; },
    getExtraRightPx: function() { return this.extraRightPx; },
    setExtraLeftPx: function(x) { this.extraLeftPx = x; return this; },
    setExtraRightPx: function(x) { this.extraRightPx = x; return this; },
    shouldIgnoreTicks: function() { return this.ignore_ticks; },
    getLineNumber: function() { return 0; },

    setYs: function(ys) { this.ys = ys; return this; },
    getYs: function() {
      if (this.ys.length === 0) throw new Vex.RERR("NoYValues",
          "No Y-values calculated for this note.");
      return this.ys;
    },

    getYForTopText: function(text_line) {
      if (!this.stave) throw new Vex.RERR("NoStave",
          "No stave attached to this note.");
      return this.stave.getYForTopText(text_line);
    },

    getBoundingBox: function() { return null; },

    getVoice: function() {
      if (!this.voice) throw new Vex.RERR("NoVoice", "Note has no voice.");
      return this.voice;
    },

    setVoice: function(voice) {
      this.voice = voice;
      this.preFormatted = false;
      return this;
    },

    getTickContext: function() { return this.tickContext; },
    setTickContext: function(tc) {
      this.tickContext = tc;
      this.preFormatted = false;
      return this;
    },

    getDuration: function() { return this.duration; },
    isDotted: function() { return (this.dots > 0); },
    getDots: function() { return this.dots; },
    getNoteType: function() { return this.noteType; },
    setModifierContext: function(mc) { this.modifierContext = mc; return this; },

    addModifier: function(modifier, index) {
      modifier.setNote(this);
      modifier.setIndex(index || 0);
      this.modifiers.push(modifier);
      this.setPreFormatted(false);
      return this;
    },

    getModifierStartXY: function() {
      if (!this.preFormatted) throw new Vex.RERR("UnformattedNote",
          "Can't call GetModifierStartXY on an unformatted note");

      var x = 0;
      return {x: this.getAbsoluteX() + x, y: this.ys[0]};
    },

    getMetrics: function() {
      if (!this.preFormatted) throw new Vex.RERR("UnformattedNote",
          "Can't call getMetrics on an unformatted note.");
      var modLeftPx = 0;
      var modRightPx = 0;
      if (this.modifierContext != null) {
        modLeftPx = this.modifierContext.state.left_shift;
        modRightPx = this.modifierContext.state.right_shift;
      }

      var width = this.getWidth();
      return { width: width,
               noteWidth: width -
                          modLeftPx - modRightPx -  // used by accidentals and modifiers
                          this.extraLeftPx - this.extraRightPx,
               left_shift: this.x_shift,
               modLeftPx: modLeftPx,
               modRightPx: modRightPx,
               extraLeftPx: this.extraLeftPx,
               extraRightPx: this.extraRightPx };
    },

    setWidth: function(width) { this.width = width; },
    getWidth: function() {
      if (!this.preFormatted) throw new Vex.RERR("UnformattedNote",
          "Can't call GetWidth on an unformatted note.");
      return this.width +
        (this.modifierContext ?  this.modifierContext.getWidth() : 0);
    },

    setXShift: function(x) {
      this.x_shift = x;
      return this;
    },

    getX: function() {
      if (!this.tickContext) throw new Vex.RERR("NoTickContext",
          "Note needs a TickContext assigned for an X-Value");
      return this.tickContext.getX() + this.x_shift;
    },

    getAbsoluteX: function() {
      if (!this.tickContext) throw new Vex.RERR("NoTickContext",
          "Note needs a TickContext assigned for an X-Value");

      // position note to left edge of tick context.
      var x = this.tickContext.getX();
      // add padding at beginning of stave
      if (this.stave) x += this.stave.getNoteStartX() + 12;

      return x;
    },

    setPreFormatted: function(value) {
      this.preFormatted = value;

      // Maintain the width of left and right modifiers in pizels
      if (this.preFormatted) {
        var extra = this.tickContext.getExtraPx();
        this.left_modPx = Math.max(this.left_modPx, extra.left);
        this.right_modPx = Math.max(this.right_modPx, extra.right);
      }
    }
  });

  return Note;
}());// Vex Flow Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010
//
// Requires vex.js.

/** @constructor */
Vex.Flow.GhostNote = (function() {
  function GhostNote(duration) {
    if (arguments.length > 0) this.init(duration);
  }

  Vex.Inherit(GhostNote, Vex.Flow.Note, {
    init: function(parameter) {
      // Sanity check
      if (!parameter) {
        throw new Vex.RuntimeError("BadArguments",
            "Ghost note must have valid initialization data to identify " +
            "duration.");
      }

      var note_struct;

      // Preserve backwards-compatibility
      if (typeof(parameter) === "string") {
        note_struct = { duration: parameter };
      } else if (typeof(parameter) === "object") {
        note_struct = parameter;
      } else {
        throw new Vex.RuntimeError("BadArguments",
            "Ghost note must have valid initialization data to identify " +
            "duration.");
      }

      GhostNote.superclass.init.call(this, note_struct);

      // Note properties
      this.setWidth(0);
    },

    isRest: function() { return true; },

    setStave: function(stave) { GhostNote.superclass.setStave.call(this, stave); },

    addToModifierContext: function()
      { /* intentionally overridden */ return this; },

    preFormat: function() {
      this.setPreFormatted(true);
      return this;
    },

    draw: function() {
      if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");

      // Draw the modifiers
      for (var i = 0; i < this.modifiers.length; ++i) {
        var modifier = this.modifiers[i];
        modifier.setContext(this.context);
        modifier.draw();
      }
    }
  });

  return GhostNote;
}());
// Vex Flow - Stave Note implementation.
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010
//
// Requires vex.js.

Vex.Flow.StaveNote = (function() {
  var StaveNote = function(note_struct) {
    if (arguments.length > 0) this.init(note_struct);
  };

  // Stem directions
  StaveNote.STEM_UP = 1;
  StaveNote.STEM_DOWN = -1;

  Vex.Inherit(StaveNote, Vex.Flow.Note, {
    init: function(note_struct) {
      StaveNote.superclass.init.call(this, note_struct);

      this.keys = note_struct.keys;
      this.clef = note_struct.clef;
      this.beam = null;

      // Pull note rendering properties
      this.glyph = Vex.Flow.durationToGlyph(this.duration, this.noteType);
      if (!this.glyph) {
        throw new Vex.RuntimeError("BadArguments",
            "Invalid note initialization data (No glyph found): " +
            JSON.stringify(note_struct));
      }

      this.notes_displaced = false;   // if true, displace note to right
      this.dot_shiftY = 0;
      this.keyProps = [];             // per-note properties
      this.keyStyles = [];            // per-note colors or gradients

      // Pull per-note location and other rendering properties.
      this.displaced = false;
      var last_line = null;
      for (var i = 0; i < this.keys.length; ++i) {
        var key = this.keys[i];

        // All rests use the same position on the line.
        // if (this.glyph.rest) key = this.glyph.position;
        if (this.glyph.rest) this.glyph.position = key;
        var props = Vex.Flow.keyProperties(key, this.clef);
        if (!props) {
          throw new Vex.RuntimeError("BadArguments",
              "Invalid key for note properties: " + key);
        }

        // Calculate displacement of this note
        var line = props.line;
        if (last_line == null) {
          last_line = line;
        } else {
          if (Math.abs(last_line - line) == 0.5) {
            this.displaced = true;
            props.displaced = true;

            // Have to mark the previous note as
            // displaced as well, for modifier placement
            if (this.keyProps.length > 0) {
                this.keyProps[i-1].displaced = true;
            }
          }
        }

        last_line = line;
        this.keyProps.push(props);
        this.keyStyles.push(null);
      }

      // Sort the notes from lowest line to highest line
      this.keyProps.sort(function(a, b) { return a.line - b.line; });

      // Drawing
      this.modifiers = [];

      this.render_options = {
        glyph_font_scale: 35, // font size for note heads and rests
        stem_height: 35,      // in pixels
        stroke_px: 3,         // number of stroke px to the left and right of head
        stroke_spacing: 10,    // spacing between strokes (TODO: take from stave)
        annotation_spacing: 5 // spacing above note for annotations
      };

      // whole note has no stem
      if (this.duration == "w") this.render_options.stem_height = 0;
      // Lengthen 32nd & 64th note stems for additional flags/beams
      if (this.duration == "32") this.render_options.stem_height = 45;
      if (this.duration == "64") this.render_options.stem_height = 50;
      if (this.duration == "128") this.render_options.stem_height = 55;

      var auto_stem_direction;
      if (note_struct.auto_stem) {
        // Figure out optimal stem direction based on given notes
        this.min_line = this.keyProps[0].line;
        if (this.min_line < 3) {
          auto_stem_direction = 1;
        } else {
          auto_stem_direction = -1;
        }
        this.setStemDirection(auto_stem_direction);
      } else {
        this.setStemDirection(note_struct.stem_direction);
      }

      // Calculate left/right padding
      this.calcExtraPx();
    },

    getCategory: function() { return "stavenotes"; },

    getBoundingBox: function() {
      if (!this.preFormatted) throw new Vex.RERR("UnformattedNote",
          "Can't call getBoundingBox on an unformatted note.");

      var metrics = this.getMetrics();

      var w = metrics.width;
      var x = this.getAbsoluteX() - metrics.modLeftPx - metrics.extraLeftPx;

      var min_y = 0;
      var max_y = 0;
      var half_line_spacing = this.getStave().getSpacingBetweenLines() / 2;
      var line_spacing = half_line_spacing * 2;

      if (this.isRest()) {
        var y = this.ys[0];
        if (this.duration == "w" || this.duration == "h") {
          min_y = y - half_line_spacing;
          max_y = y + half_line_spacing;
        } else {
          min_y = y - (this.glyph.line_above * line_spacing);
          max_y = y + (this.glyph.line_below * line_spacing);
        }
      } else if (this.glyph.stem) {
        var ys = this.getStemExtents();
        ys.baseY += half_line_spacing * this.stem_direction;
        min_y = Vex.Min(ys.topY, ys.baseY);
        max_y = Vex.Max(ys.topY, ys.baseY);
      } else {
        min_y = null;
        max_y = null;

        for (var i=0; i < this.ys.length; ++i) {
          var yy = this.ys[i];
          if (i === 0) {
            min_y = yy;
            max_y = yy;
          } else {
            min_y = Vex.Min(yy, min_y);
            max_y = Vex.Max(yy, max_y);
          }
          min_y -= half_line_spacing;
          max_y += half_line_spacing;
        }
      }

      return new Vex.Flow.BoundingBox(x, min_y, w, max_y - min_y);
    },

    /** Gets the line number of the top or bottom note in the chord.
      * If (is_top_note === true), get top note
      * Otherwise, get bottom note */
    getLineNumber: function(is_top_note) {
      if(!this.keyProps.length) throw new Vex.RERR("NoKeyProps",
          "Can't get bottom note line, because note is not initialized properly.");
      var result_line = this.keyProps[0].line;

      // No precondition assumed for sortedness of keyProps array
      for(var i=0; i<this.keyProps.length; i++){
        var this_line = this.keyProps[i].line;
        if(is_top_note)
          if(this_line > result_line)
                result_line = this_line;
        else
          if(this_line < result_line)
            result_line = this_line;
      }

      return result_line;
    },

    isRest: function() {
      return this.glyph.rest;
    },

    hasStem: function() {
      return this.glyph.stem;
    },

    getYForTopText: function(text_line) {
      var extents = this.getStemExtents();
      return Vex.Min(this.stave.getYForTopText(text_line),
          extents.topY - (this.render_options.annotation_spacing * (text_line + 1)));
    },

    getYForBottomText: function(text_line) {
      var extents = this.getStemExtents();
      return Vex.Max(this.stave.getYForTopText(text_line),
          extents.baseY + (this.render_options.annotation_spacing * (text_line)));
    },

    setStave: function(stave) {
      var superclass = Vex.Flow.StaveNote.superclass;
      superclass.setStave.call(this, stave);
      var ys = [];

      // Setup y coordinates for score.
      for (var i = 0; i < this.keyProps.length; ++i) {
        var line = this.keyProps[i].line;
        ys.push(this.stave.getYForNote(line));
      }

      return this.setYs(ys);
    },

    // Get individual note/octave pairs for all notes in this
    // chord.
    getKeys: function() {
      return this.keys;
    },

    // Get the Key Properties for each note in chord
    getKeyProps: function() {
      return this.keyProps;
    },

    getStemLength: function() {
      return this.render_options.stem_height;
    },

    // Determine minimum length of stem
    getStemMinumumLength: function() {
      var length = this.duration == "w" ? 0 : 20;
      // if note is flagged, cannot shorten beam
      switch (this.duration) {
       case "8":
         if (this.beam == null) length = 35;
         break;
       case "16":
         if (this.beam == null)
           length = 35;
         else
           length = 25;
         break;
       case "32":
         if (this.beam == null)
           length = 45;
         else
           length = 35;
         break;
       case "64":
         if (this.beam == null)
           length = 50;
         else
           length = 40;
         break;
       case "128":
         if (this.beam == null)
           length = 55;
         else
           length = 45;
      }
      return length;
    },

    getStemDirection: function() {
      return this.stem_direction;
    },

    getStemX: function() {
      var x_begin = this.getAbsoluteX() + this.x_shift;
      var x_end = this.getAbsoluteX() + this.x_shift + this.glyph.head_width;

      var stem_x = this.stem_direction == Vex.Flow.StaveNote.STEM_DOWN ?
        x_begin : x_end;

      stem_x -= ((Vex.Flow.STEM_WIDTH / 2) * this.stem_direction);

      return stem_x;
    },

    // Check if note is manually shifted to the right
    isDisplaced: function() {
      return this.notes_displaced;
    },
    // Manual setting of note shift to the right
    setNoteDisplaced: function(displaced) {
      this.notes_displaced = displaced;
      return this;
    },

    // Manuallly set note stem length
    setStemLength: function(height) {
      this.render_options.stem_height = height;
      return this;
    },

    getStemExtents: function() {
      if (!this.ys || this.ys.length === 0) throw new Vex.RERR("NoYValues",
          "Can't get top stem Y when note has no Y values.");

      var top_pixel = this.ys[0];
      var base_pixel = this.ys[0];

      for (var i = 0; i < this.ys.length; ++i) {
        var stem_top = this.ys[i] +
          (this.render_options.stem_height * -this.stem_direction);

        if (this.stem_direction == Vex.Flow.StaveNote.STEM_DOWN) {
          top_pixel = (top_pixel > stem_top) ? top_pixel : stem_top;
          base_pixel = (base_pixel < this.ys[i]) ? base_pixel : this.ys[i];
        } else {
          top_pixel = (top_pixel < stem_top) ? top_pixel : stem_top;
          base_pixel = (base_pixel > this.ys[i]) ? base_pixel : this.ys[i];
        }

        if(this.noteType == "s" || this.noteType == 'x') {
          top_pixel -= this.stem_direction * 7;
          base_pixel -= this.stem_direction * 7;
        }
      }

      return { topY: top_pixel, baseY: base_pixel };
    },

    getTieRightX: function() {
      var tieStartX = this.getAbsoluteX();
      tieStartX += this.glyph.head_width + this.x_shift + this.extraRightPx;
      if (this.modifierContext) tieStartX += this.modifierContext.getExtraRightPx();
      return tieStartX;
    },

    getTieLeftX: function() {
      var tieEndX = this.getAbsoluteX();
      tieEndX += this.x_shift - this.extraLeftPx;
      return tieEndX;
    },

    getLineForRest: function() {
      var rest_line = this.keyProps[0].line;
      if (this.keyProps.length > 1) {
        var last_line  = this.keyProps[this.keyProps.length - 1].line;
        var top = Vex.Max(rest_line, last_line);
        var bot = Vex.Min(rest_line, last_line);
        rest_line = Vex.MidLine(top, bot);
      }

      return rest_line;
    },

    getModifierStartXY: function(position, index) {
      if (!this.preFormatted) throw new Vex.RERR("UnformattedNote",
          "Can't call GetModifierStartXY on an unformatted note");

      if (this.ys.length === 0) throw new Vex.RERR("NoYValues",
          "No Y-Values calculated for this note.");

      var x = 0;
      if (position == Vex.Flow.Modifier.Position.LEFT) {
        x = -1 * 2;  // extra_left_px
      } else if (position == Vex.Flow.Modifier.Position.RIGHT) {
        x = this.glyph.head_width + this.x_shift + 2; // extra_right_px
      } else if (position == Vex.Flow.Modifier.Position.BELOW ||
                 position == Vex.Flow.Modifier.Position.ABOVE) {
        x = this.glyph.head_width / 2;
      }

      return { x: this.getAbsoluteX() + x, y: this.ys[index] };
    },

    setStemDirection: function(direction) {
      if (!direction) direction = StaveNote.STEM_UP;
      if (direction != StaveNote.STEM_UP &&
          direction != StaveNote.STEM_DOWN) {
        throw new Vex.RERR("BadArgument", "Invalid stem direction: " + direction);
      }

      this.stem_direction = direction;
      this.beam = null;
      if (this.preFormatted) {
        this.preFormat();
      }
      return this;
    },

    setBeam: function(beam) {
      this.beam = beam;
      return this;
    },

    getGlyph: function() {
      return this.glyph;
    },

    setKeyStyle: function(index, style) {
      this.keyStyles[index] = style;
      return this;
    },

    applyKeyStyle: function(key_style, context) {
      if (key_style) {
        if (key_style.shadowColor) context.setShadowColor(key_style.shadowColor);
        if (key_style.shadowBlur) context.setShadowBlur(key_style.shadowBlur);
        if (key_style.fillStyle) context.setFillStyle(key_style.fillStyle);
        if (key_style.strokeStyle) context.setStrokeStyle(key_style.strokeStyle);
      }
    },

    addToModifierContext: function(mc) {
      this.setModifierContext(mc);
      for (var i = 0; i < this.modifiers.length; ++i) {
        this.modifierContext.addModifier(this.modifiers[i]);
      }
      this.modifierContext.addModifier(this);
      this.setPreFormatted(false);
      return this;
    },

    // Generic function to add modifiers to a note
    addModifier: function(index, modifier) {
      modifier.setNote(this);
      modifier.setIndex(index);
      this.modifiers.push(modifier);
      this.setPreFormatted(false);
      return this;
    },

    addAccidental: function(index, accidental) {
      accidental.setNote(this);
      accidental.setIndex(index);
      this.modifiers.push(accidental);
      this.setPreFormatted(false);
      return this;
    },

    addArticulation: function(index, articulation) {
      articulation.setNote(this);
      articulation.setIndex(index);
      this.modifiers.push(articulation);
      this.setPreFormatted(false);
      return this;
    },

    /* This tends to not work too well on StaveNotes.
     * TODO(0xfe): position annotations below */
    addAnnotation: function(index, annotation) {
      annotation.setNote(this);
      annotation.setIndex(index);
      this.modifiers.push(annotation);
      this.setPreFormatted(false);
      return this;
    },

    addDot: function(index) {
      var dot = new Vex.Flow.Dot();
      dot.setNote(this);
      dot.setIndex(index);
      dot.setDotShiftY(this.glyph.dot_shiftY);
      this.modifiers.push(dot);
      this.setPreFormatted(false);
      this.dots++;
      return this;
    },

    // Convenience method to add dot to all notes in chord
    addDotToAll: function() {
      for (var i = 0; i < this.keys.length; ++i)
        this.addDot(i);
      return this;
    },

    getAccidentals: function() {
      return this.modifierContext.getModifiers("accidentals");
    },

    getDots: function() {
      return this.modifierContext.getModifiers("dots");
    },

    getVoiceShiftWidth: function() {
      // TODO: may need to accomodate for dot here.
      return this.glyph.head_width * (this.displaced ? 2 : 1);
    },

    // I moved this into init() to avoid having to ensure that notes
    // are preformatted before their modifiers.
    calcExtraPx: function() {
      this.setExtraLeftPx((this.displaced && this.stem_direction == -1) ?
          this.glyph.head_width : 0);
      this.setExtraRightPx((this.displaced && this.stem_direction == 1) ?
          this.glyph.head_width : 0);
    },

    // Pre-render formatting
    preFormat: function() {
      if (this.preFormatted) return;
      if (this.modifierContext) this.modifierContext.preFormat();

      var width = this.glyph.head_width + this.extraLeftPx + this.extraRightPx;

      // For upward flagged notes, the width of the flag needs to be added
      if (this.glyph.flag && this.beam == null && this.stem_direction == 1) {
        width += this.glyph.head_width;
      }

      this.setWidth(width);

      this.setPreFormatted(true);
    },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw without a canvas context.");
      if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
      if (this.ys.length === 0) throw new Vex.RERR("NoYValues",
          "Can't draw note without Y values.");

      var ctx = this.context;
      var x = this.getAbsoluteX() + this.x_shift;

      var ys = this.ys;
      var keys = this.keys;
      var glyph = this.glyph;
      var stem_direction = this.stem_direction;
      var default_head_x = null;

      // What elements do we render?
      var render_head = true;
      var render_stem = (this.beam == null);
      var render_flag = (this.beam == null);

      // Begin and end positions for head.
      var x_begin = x;
      var x_end = x + glyph.head_width;

      // Top and bottom Y values for stem.
      var y_top = null;
      var y_bottom = null;

      // Displacement variables.
      var last_line = null;
      var line_diff = null;
      var displaced = false;

      // Draw notes from bottom to top.
      var start_i = 0;
      var end_i = keys.length;
      var step_i = 1;


      // For down-stem notes, we draw from top to bottom.
      if (stem_direction == Vex.Flow.StaveNote.STEM_DOWN) {
        start_i = keys.length - 1;
        end_i = -1;
        step_i = -1;
      }

      // Keep track of highest and lowest lines for drawing strokes.
      var highest_line = 5;
      var lowest_line = 1;

      // Private function to draw slash note heads, glyphs were not slanted enough
      // and too small.
      function drawSlashNoteHead(stavenote, ctx, x, y) {
        var width = 15 + (Vex.Flow.STEM_WIDTH / 2);
        ctx.beginPath();
        ctx.moveTo(x, y + 11);
        ctx.lineTo(x, y + 1);
        ctx.lineTo(x + width, y - 10);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x, y + 11);
        ctx.closePath();

        // only fill if quarter note or smaller
        if (stavenote.duration != 1 &&
            stavenote.duration != 2 &&
            stavenote.duration != "h" &&
            stavenote.duration != "w") {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      }

      var i, key_style, line;
      for (i = start_i; i != end_i; i += step_i) {
        var note_props = this.keyProps[i];
        key_style = this.keyStyles[i];
        line = note_props.line;
        highest_line = line > highest_line ? line : highest_line;
        lowest_line = line < lowest_line ? line : lowest_line;

        // Keep track of last line with a note head, so that consecutive heads
        // are correctly displaced.
        if (last_line == null) {
          last_line = line;
        } else {
          line_diff = Math.abs(last_line - line);
          if (line_diff === 0 || line_diff === 0.5) {
            displaced = !displaced;
          } else {
            displaced = false;
            default_head_x = x;
          }
        }
        last_line = line;

        // Get Y value for this head.
        var y = ys[i];

        // Keep track of top and bottom note for stem
        if (y_top == null || y < y_top) y_top = y;
        if (y_bottom == null || y > y_bottom) y_bottom = y;

        // Get glyph code and initial X position for the head. Displaced heads
        // are shifted exactly one head-width right.
        var code_head = glyph.code_head;
        var head_x = x_begin +
          (displaced ? glyph.head_width * stem_direction : 0);

        // For special notes (such as "X"), use the glyph code from the
        // key properties.
        if (note_props.code) {
          code_head = note_props.code;
          head_x = x_begin + note_props.shift_right;
        }

        // Draw the head.
        if (render_head) {
          head_x = head_x;

          ctx.save();
          this.applyKeyStyle(key_style, ctx);

          // if a slash note, draw 'manually' as font glyphs do not slant enough
          // and are too small.
          if (this.noteType == "s") {
            var displacement = Vex.Flow.STEM_WIDTH / 2;
            drawSlashNoteHead(this, ctx,
              head_x + (this.stem_direction == 1 ? -displacement : displacement), y);
          } else {
            Vex.Flow.renderGlyph(ctx, head_x,
                y, this.render_options.glyph_font_scale, code_head);
          }

          ctx.restore();

          // If note above/below the staff, draw the small staff
          if (line <= 0 || line >= 6) {
            var line_y = y;
            var floor = Math.floor(line);
            if (line < 0 && floor - line == -0.5)
              line_y -= 5;
            else if (line > 6 &&  floor - line == -0.5)
              line_y += 5;
            ctx.fillRect(
              head_x - this.render_options.stroke_px, line_y,
              ((head_x + glyph.head_width) - head_x) +
              (this.render_options.stroke_px * 2), 1);
          }
        }
      }

      // For heads that are off the staff, draw the tiny stroke line.
      var that = this;

      function stroke(y) {
        if (default_head_x != null) head_x = default_head_x;
        ctx.fillRect(
          head_x - that.render_options.stroke_px, y,
          ((head_x + glyph.head_width) - head_x) +
          (that.render_options.stroke_px * 2), 1);
      }

      for (line = 6; line <= highest_line; ++line) {
        stroke(this.stave.getYForNote(line));
      }

      for (line = 0; line >= lowest_line; --line) {
        stroke(this.stave.getYForNote(line));
      }

      // Calculate stem height based on number of notes in this chord.
      var note_stem_height = ((y_bottom - y_top) * stem_direction) +
        (this.render_options.stem_height * stem_direction);

      if (glyph.stem && render_stem) {
        var stem_x, stem_y;

        if (stem_direction == Vex.Flow.StaveNote.STEM_DOWN) {
          // Down stems are rendered to the left of the head.
          stem_x = x_begin;
          stem_y = y_top;

          // Shorten stem length for 1/2 & 1/4 dead note heads (X)
          if (glyph.code_head == "v95" ||
              glyph.code_head == "v3e") {
           stem_y += 4;
          }

        } else {
          // Up stems are rendered to the right of the head.
          stem_x = x_end;
          stem_y = y_bottom;


          // Shorten stem length for 1/2 & 1/4 dead note heads (X)
          if (glyph.code_head == "v95" ||
              glyph.code_head == "v3e")
           stem_y -= 4;
        }

        // Draw the stem
        ctx.fillRect(stem_x,
            stem_y - (note_stem_height < 0 ? 0 : note_stem_height),
            Vex.Flow.STEM_WIDTH,
            Math.abs(note_stem_height));
      }

      // Now it's the flag's turn.
      if (glyph.flag && render_flag) {
        var flag_x, flag_y, flag_code;

        if (stem_direction == Vex.Flow.StaveNote.STEM_DOWN) {
          // Down stems have flags on the left.
          flag_x = x_begin + 1;
          flag_y = y_top - note_stem_height;
          flag_code = glyph.code_flag_downstem;

        } else {
          // Up stems have flags on the left.
          flag_x = x_end + 1;
          flag_y = y_bottom - note_stem_height;
          flag_code = glyph.code_flag_upstem;
        }

        // Draw the Flag
        Vex.Flow.renderGlyph(ctx, flag_x, flag_y,
            this.render_options.glyph_font_scale, flag_code);
      }

      // Draw the modifiers
      for (i = 0; i < this.modifiers.length; ++i) {
        var mod = this.modifiers[i];
        key_style = this.keyStyles[mod.getIndex()]; 
        if(key_style) {
            ctx.save();
            this.applyKeyStyle(key_style, ctx);
        }
        mod.setContext(ctx);
        mod.draw();
        if(key_style) {
            ctx.restore();
        }
      }
    }
  });

  return StaveNote;
}());
// Vex Flow Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010
//
// Requires vex.js.

/** @constructor */
Vex.Flow.TabNote = (function() {
  function TabNote(tab_struct) {
    if (arguments.length > 0) this.init(tab_struct);
  }

  Vex.Inherit(TabNote, Vex.Flow.Note, {
    init: function(tab_struct) {
      var superclass = Vex.Flow.TabNote.superclass;
      superclass.init.call(this, tab_struct);

      // Note properties
      this.positions = tab_struct.positions; // [{ str: X, fret: X }]
      this.render_options = {
        glyph_font_scale: 30 // font size for note heads and rests
      };

      this.noteGlyph =
        Vex.Flow.durationToGlyph(this.duration, this.noteType);
      if (!this.noteGlyph) {
        throw new Vex.RuntimeError("BadArguments",
            "Invalid note initialization data (No glyph found): " +
            JSON.stringify(tab_struct));
      }

      this.ghost = false; // Renders parenthesis around notes
      this.updateWidth();
    },

    getCategory: function() { return "tabnotes"; },
    setGhost: function(ghost) {
      this.ghost = ghost;
      this.updateWidth();
      return this;
    },

    updateWidth: function() {
      this.glyphs = [];
      this.width = 0;
      for (var i = 0; i < this.positions.length; ++i) {
        var fret = this.positions[i].fret;
        if (this.ghost) fret = "(" + fret + ")";
        var glyph = Vex.Flow.tabToGlyph(fret);
        this.glyphs.push(glyph);
        this.width = (glyph.width > this.width) ? glyph.width : this.width;
      }
    },

    setStave: function(stave) {
      var superclass = Vex.Flow.TabNote.superclass;
      superclass.setStave.call(this, stave);
      this.context = stave.context;
      this.width = 0;

      // Calculate the fret number width based on font used
      var i;
      if (this.context) {
        for (i = 0; i < this.glyphs.length; ++i) {
          var text = "" + this.glyphs[i].text;
          if (text.toUpperCase() != "X")
            this.glyphs[i].width = this.context.measureText(text).width;
          this.width = (this.glyphs[i].width > this.width) ?
            this.glyphs[i].width : this.width;
        }
      }

      var ys = [];

      // Setup y coordinates for score.
      for (i = 0; i < this.positions.length; ++i) {
        var line = this.positions[i].str;
        ys.push(this.stave.getYForLine(line - 1));
      }

      return this.setYs(ys);
    },

    // Get the Tab Positions for each note in chord
    getPositions: function() {
      return this.positions;
    },

    addToModifierContext: function(mc) {
      this.setModifierContext(mc);
      for (var i = 0; i < this.modifiers.length; ++i) {
        this.modifierContext.addModifier(this.modifiers[i]);
      }
      this.modifierContext.addModifier(this);
      this.preFormatted = false;
      return this;
    },

    getTieRightX: function() {
      var tieStartX = this.getAbsoluteX();
      var note_glyph_width = this.noteGlyph.head_width;
      tieStartX += (note_glyph_width / 2);
      tieStartX += ((-this.width / 2) + this.width + 2);

      return tieStartX;
    },

    getTieLeftX: function() {
      var tieEndX = this.getAbsoluteX();
      var note_glyph_width = this.noteGlyph.head_width;
      tieEndX += (note_glyph_width / 2);
      tieEndX -= ((this.width / 2) + 2);

      return tieEndX;
    },

    getModifierStartXY: function(position, index) {
      if (!this.preFormatted) throw new Vex.RERR("UnformattedNote",
          "Can't call GetModifierStartXY on an unformatted note");

      if (this.ys.length === 0) throw new Vex.RERR("NoYValues",
          "No Y-Values calculated for this note.");

      var x = 0;
      if (position == Vex.Flow.Modifier.Position.LEFT) {
        x = -1 * 2;  // extra_left_px
      } else if (position == Vex.Flow.Modifier.Position.RIGHT) {
        x = this.width + 2; // extra_right_px
      } else if (position == Vex.Flow.Modifier.Position.BELOW ||
                 position == Vex.Flow.Modifier.Position.ABOVE) {
          var note_glyph_width = this.noteGlyph.head_width;
          x = note_glyph_width / 2;
      }

      return {x: this.getAbsoluteX() + x, y: this.ys[index]};
    },

    // Pre-render formatting
    preFormat: function() {
      if (this.preFormatted) return;
      if (this.modifierContext) this.modifierContext.preFormat();
      // width is already set during init()
      this.setPreFormatted(true);
    },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw without a canvas context.");
      if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
      if (this.ys.length === 0) throw new Vex.RERR("NoYValues",
          "Can't draw note without Y values.");

      var ctx = this.context;
      var x = this.getAbsoluteX();
      var ys = this.ys;

      var i;
      for (i = 0; i < this.positions.length; ++i) {
        var y = ys[i];

        var glyph = this.glyphs[i];

        // Center the fret text beneath the notation note head
        var note_glyph_width = this.noteGlyph.head_width;
        var tab_x = x + (note_glyph_width / 2) - (glyph.width / 2);

        ctx.clearRect(tab_x - 2, y - 3, glyph.width + 4, 6);

        if (glyph.code) {
          Vex.Flow.renderGlyph(ctx, tab_x, y + 5 + glyph.shift_y,
              this.render_options.glyph_font_scale, glyph.code);
        } else {
          var text = glyph.text.toString();
          ctx.fillText(text, tab_x, y + 5);
        }
      }

      // Draw the modifiers
      for (i= 0; i < this.modifiers.length; ++i) {
        var modifier = this.modifiers[i];
        modifier.setContext(this.context);
        modifier.draw();
      }
    }
  });

  return TabNote;
}());// Vex Flow Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010
//
// Requires: vex.js, vexmusic.js, note.js

/**
 * Create a new beam from the specified notes. The notes must
 * be part of the same line, and have the same duration (in ticks).
 *
 * @constructor
 * @param {Array.<Vex.Flow.StaveNote>} A set of notes.
 */
Vex.Flow.Beam = (function() {
  function Beam(notes, auto_stem) {
    if (arguments.length > 0) this.init(notes, auto_stem);
  }

  Beam.prototype = {
    /**
     * Set the notes to attach this beam to.
     *
     * @param {Array.<Vex.Flow.StaveNote>} The notes.
     * @param auto_stem If true, will automatically set stem direction.
     */
    init: function(notes, auto_stem) {
      if (!notes || notes == []) {
        throw new Vex.RuntimeError("BadArguments", "No notes provided for beam.");
      }

      if (notes.length == 1) {
        throw new Vex.RuntimeError("BadArguments", "Too few notes for beam.");
      }

      this.unbeamable = false;
      // Quit if first or last note is a rest.
      if (!notes[0].hasStem() || !notes[notes.length-1].hasStem()) {
        this.unbeamable = true;
        return;
      }

      // Validate beam line, direction and ticks.
      this.stem_direction = notes[0].getStemDirection();
      this.ticks = notes[0].getIntrinsicTicks();

      if (this.ticks >= Vex.Flow.durationToTicks("4")) {
        throw new Vex.RuntimeError("BadArguments",
            "Beams can only be applied to notes shorter than a quarter note.");
      }

      var i; // shared iterator
      var note;
      if (!auto_stem) {
        for (i = 1; i < notes.length; ++i) {
          note = notes[i];
          if (note.getStemDirection() != this.stem_direction) {
            throw new Vex.RuntimeError("BadArguments",
                "Notes in a beam all have the same stem direction");
          }
        }
      }

      var stem_direction = -1;

      if (auto_stem)  {
        // Figure out optimal stem direction based on given notes
        this.min_line = 1000;

        for (i = 0; i < notes.length; ++i) {
          note = notes[i];
          this.min_line = Vex.Min(note.getKeyProps()[0].line, this.min_line);
        }

        if (this.min_line < 3) stem_direction = 1;
      }

      for (i = 0; i < notes.length; ++i) {
        note = notes[i];
        if (auto_stem) {
          note.setStemDirection(stem_direction);
          this.stem_direction = stem_direction;
        }
        note.setBeam(this);
      }

      this.notes = notes;
      this.beam_count = this.notes[0].getGlyph().beam_count;
      this.render_options = {
        beam_width: 5,
        max_slope: 0.25,
        min_slope: -0.25,
        slope_iterations: 20,
        slope_cost: 25
      };
    },

    setContext: function(context) { this.context = context; return this; },

    /**
     * @return {Array.<Vex.Flow.Note>} Returns notes in this beam.
     */
    getNotes: function() { return this.notes; },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw without a canvas context.");

      if (this.unbeamable) return;

      var first_note = this.notes[0];
      var last_note = this.notes[this.notes.length - 1];

      var first_y_px = first_note.getStemExtents().topY;
      var last_y_px = last_note.getStemExtents().topY;

      var first_x_px = first_note.getStemX();

      var beam_width = this.render_options.beam_width * this.stem_direction;
      var x_px, i, note; // shared variables

      // Returns the Y coordinate for the slope at position X.
      function getSlopeY(x) {
        return first_y_px + ((x - first_x_px) * slope);
      }

      var inc = (this.render_options.max_slope - this.render_options.min_slope) /
          this.render_options.slope_iterations;
      var min_cost = Number.MAX_VALUE;
      var best_slope = 0;
      var y_shift = 0;

      // iterate through slope values to find best weighted fit
      for (var slope = this.render_options.min_slope;
           slope <= this.render_options.max_slope;
           slope += inc) {
        var total_stem_extension = 0;
        var y_shift_tmp = 0;

        // iterate through notes, calculating y shift and stem extension
        for (i = 1; i < this.notes.length; ++i) {
          note = this.notes[i];

          x_px = note.getStemX();
          var y_px = note.getStemExtents().topY;
          var slope_y_px = getSlopeY(x_px) + y_shift_tmp;

          // beam needs to be shifted up to accommodate note
          if (y_px * this.stem_direction < slope_y_px * this.stem_direction) {
            var diff =  Math.abs(y_px - slope_y_px);
            y_shift_tmp += diff * -this.stem_direction;
            total_stem_extension += (diff * i);
          } else { // beam overshoots note, account for the difference
            total_stem_extension += (y_px - slope_y_px) * this.stem_direction;
          }

        }
        var cost = this.render_options.slope_cost * Math.abs(slope) +
          Math.abs(total_stem_extension);

        // update state when a more ideal slope is found
        if (cost < min_cost) {
          min_cost = cost;
          best_slope = slope;
          y_shift = y_shift_tmp;
        }
      }

      slope = best_slope;

      // Draw the stems
      for (i = 0; i < this.notes.length; ++i) {
        note = this.notes[i];

        // Do not draw stem for rests
        if (!note.hasStem()) {
          continue;
        }

        x_px = note.getStemX();
        var y_extents = note.getStemExtents();
        var base_y_px = y_extents.baseY;

        // For harmonic note heads, shorten stem length by 3 pixels
        base_y_px += this.stem_direction * note.glyph.stem_offset;

        // Don't go all the way to the top (for thicker stems)
        var y_displacement = Vex.Flow.STEM_WIDTH * this.stem_direction;

        // Draw the stem
        this.context.fillRect(x_px,
            base_y_px, Vex.Flow.STEM_WIDTH,
            (((Math.abs(base_y_px - (getSlopeY(x_px) + y_shift)))) *
              -this.stem_direction) + y_displacement);
      }

      var that = this;
      function getBeamLines(duration) {
        var beam_lines = [];
        var beam_started = false;
        var current_beam;

        for (var i = 0; i < that.notes.length; ++i) {
          var note = that.notes[i];
          var ticks = note.getIntrinsicTicks();

          // Check whether to apply beam(s)
          if (ticks < Vex.Flow.durationToTicks(duration)) {
            if (!beam_started) {
              beam_lines.push({start: note.getStemX(), end: null});
              beam_started = true;
            } else {
              current_beam = beam_lines[beam_lines.length - 1];
              current_beam.end = note.getStemX();
            }
          } else {
            if (!beam_started) {
              // we don't care
            } else {
              current_beam = beam_lines[beam_lines.length - 1];
              if (current_beam.end == null) {
                // single note
                current_beam.end = current_beam.start + 10; // TODO
              } else {
                // we don't care
              }
            }

            beam_started = false;
          }
        }

        if (beam_started === true) {
          current_beam = beam_lines[beam_lines.length - 1];
          if (current_beam.end == null) {
            // single note
            current_beam.end = current_beam.start - 10; // TODO
          }
        }

        return beam_lines;
      }

      var valid_beam_durations = ["4", "8", "16", "32"];

      // Draw the beams.
      for (i = 0; i < valid_beam_durations.length; ++i) {
        var duration = valid_beam_durations[i];
        var beam_lines = getBeamLines(duration);

        for (var j = 0; j < beam_lines.length; ++j) {
          var beam_line = beam_lines[j];
          var first_x = beam_line.start;
          var first_y = getSlopeY(first_x);

          var last_x = beam_line.end + (Vex.Flow.STEM_WIDTH / 2);
          var last_y = getSlopeY(last_x);

          this.context.beginPath();
          this.context.moveTo(first_x, first_y + y_shift);
          this.context.lineTo(first_x, first_y + beam_width + y_shift);
          this.context.lineTo(last_x + 1, last_y + beam_width + y_shift);
          this.context.lineTo(last_x + 1, last_y + y_shift);
          this.context.closePath();
          this.context.fill();
        }

        first_y_px += beam_width * 1.5;
        last_y_px += beam_width * 1.5;
      }

      return true;
    }
  };

  // Static method: Automatically beam notes in "voice". If "stem_direction"
  // is set, then force all stems to that direction (used for multi-voice music).
  Beam.applyAndGetBeams = function(voice, stem_direction) {
    var unprocessedNotes = voice.tickables;
    var ticksPerGroup    = 4096;
    var noteGroups       = [];
    var currentGroup     = [];

    function getTotalTicks(vf_notes){
      return vf_notes.reduce(function(memo,note){
        return note.getTicks().value() + memo;
      }, 0);
    }

    function createGroups(){
      var nextGroup = [];

      unprocessedNotes.forEach(function(unprocessedNote){
        nextGroup    = [];
        if (unprocessedNote.shouldIgnoreTicks()) {
          noteGroups.push(currentGroup);
          currentGroup = nextGroup;
          return; // Ignore untickables (like bar notes)
        }

        currentGroup.push(unprocessedNote);

        // If the note that was just added overflows the group tick total
        if (getTotalTicks(currentGroup) > ticksPerGroup) {
          nextGroup.push(currentGroup.pop());
          noteGroups.push(currentGroup);
          currentGroup = nextGroup;
        } else if (getTotalTicks(currentGroup) == ticksPerGroup) {
          noteGroups.push(currentGroup);
          currentGroup = nextGroup;
        }
      });

      // Adds any remainder notes
      if (currentGroup.length > 0)
        noteGroups.push(currentGroup);
    }

    function getBeamGroups() {
      return noteGroups.filter(function(group){
          if (group.length > 1) {
            var beamable = true;
            group.forEach(function(note) {
              if (note.getIntrinsicTicks() >= Vex.Flow.durationToTicks("4")) {
                beamable = false;
              }
            });
            return beamable;
          }
          return false;
      });
    }

    function formatStems() {
      noteGroups.forEach(function(group){
        var stemDirection = determineStemDirection(group);

        applyStemDirection(group, stemDirection);
      });
    }

    function determineStemDirection(group) {
      if (stem_direction) return stem_direction;

      var lineSum = 0;

      group.forEach(function(note) {
        note.keyProps.forEach(function(keyProp){
          lineSum += (keyProp.line - 3);
        });
      });

      if (lineSum > 0)
        return -1;
      return 1;
    }

    function applyStemDirection(group, direction) {
      group.forEach(function(note){
        note.setStemDirection(direction);
      });
    }

    function getTupletGroups() {
      return noteGroups.filter(function(group){
        if (group[0]) return group[0].tuplet;
      });
    }

    // Using closures to store the variables throughout the various functions
    // IMO Keeps it this process lot cleaner - but not super consistent with
    // the rest of the API's style - Silverwolf90 (Cyril)
    createGroups();
    formatStems();

    // Get the notes to be beamed
    var beamedNoteGroups = getBeamGroups();

    // Get the tuplets in order to format them accurately
    var tupletGroups = getTupletGroups();

    // Create a Vex.Flow.Beam from each group of notes to be beamed
    var beams = [];
    beamedNoteGroups.forEach(function(group){
      beams.push(new Vex.Flow.Beam(group));
    });

    // Reformat tuplets
    tupletGroups.forEach(function(group){
      var firstNote = group[0];
      var tuplet = firstNote.tuplet;

      if (firstNote.beam) tuplet.setBracketed(false);
      if (firstNote.stem_direction == -1) {
        tuplet.setTupletLocation( Vex.Flow.Tuplet.LOCATION_BOTTOM);
      }
    });

    return beams;
  };

  return Beam;
}());
// Vex Music Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010

/** @constructor */
Vex.Flow.Voice = (function() {
  function Voice(time) {
    if (arguments.length > 0) this.init(time);
  }

  // Modes allow the addition of ticks in three different ways:
  //
  // STRICT: This is the default. Ticks must fill the voice.
  // SOFT:   Ticks can be added without restrictions.
  // FULL:   Ticks do not need to fill the voice, but can't exceed the maximum
  //         tick length.
  Voice.Mode = {
    STRICT: 1,
    SOFT:   2,
    FULL:   3
  };

  Voice.prototype = {
    init: function(time) {
      this.time = time;

      // Recalculate total ticks.
      this.totalTicks = new Vex.Flow.Fraction(
        this.time.num_beats * (this.time.resolution / this.time.beat_value), 1);

      this.resolutionMultiplier = 1;

      // Set defaults
      this.tickables = [];
      this.ticksUsed = new Vex.Flow.Fraction(0, 1);
      this.smallestTickCount = this.totalTicks.clone();
      this.largestTickWidth = 0;
      this.stave = null;
      this.boundingBox = null;
      // Do we care about strictly timed notes
      this.mode = Vex.Flow.Voice.Mode.STRICT;

      // This must belong to a VoiceGroup
      this.voiceGroup = null;
    },

    getTotalTicks: function() { return this.totalTicks; },
    getTicksUsed: function() { return this.ticksUsed; },
    getLargestTickWidth: function() { return this.largestTickWidth; },
    getSmallestTickCount: function() { return this.smallestTickCount; },
    getTickables: function() { return this.tickables; },
    getMode: function() { return this.mode; },
    setMode: function(mode) { this.mode = mode; return this; },
    getResolutionMultiplier: function() { return this.resolutionMultiplier; },
    getActualResolution: function() { return this.resolutionMultiplier * this.time.resolution; },

    setStave: function(stave) {
      this.stave = stave;
      this.boundingBox = null; // Reset bounding box so we can reformat
      return this;
    },

    getBoundingBox: function() {
      if (!this.boundingBox) {
        if (!this.stave) throw Vex.RERR("NoStave", "Can't get bounding box without stave.");
        var stave = this.stave;

        var boundingBox = null;
        if (this.tickables[0]) {
          this.tickables[0].setStave(stave);
          boundingBox = this.tickables[0].getBoundingBox();
        }

        for (var i = 0; i < this.tickables.length; ++i) {
          this.tickables[i].setStave(stave);
          if (i > 0 && boundingBox) {
            var bb = this.tickables[i].getBoundingBox();
            if (bb) boundingBox.mergeWith(bb);
          }
        }

        this.boundingBox = boundingBox;
      }
      return this.boundingBox;
    },

    // Every tickable must be associated with a voiceGroup. This allows formatters
    // and preformatters to associate them with the right modifierContexts.
    getVoiceGroup: function() {
      if (!this.voiceGroup)
        throw new Vex.RERR("NoVoiceGroup", "No voice group for voice.");
      return this.voiceGroup;
    },
    setVoiceGroup: function(g) { this.voiceGroup = g; return this; },

    setStrict: function(strict) {
      this.mode = strict ? Vex.Flow.Voice.Mode.STRICT : Vex.Flow.Voice.Mode.SOFT;
      return this;
    },

    isComplete: function() {
      if (this.mode == Vex.Flow.Voice.Mode.STRICT ||
          this.mode == Vex.Flow.Voice.Mode.FULL) {
        return this.ticksUsed.equals(this.totalTicks);
      } else {
        return true;
      }
    },

    addTickable: function(tickable) {
      if (!tickable.shouldIgnoreTicks()) {
        var ticks = tickable.getTicks();

        // Update the total ticks for this line
        this.ticksUsed.add(ticks);

        if ((this.mode == Vex.Flow.Voice.Mode.STRICT ||
             this.mode == Vex.Flow.Voice.Mode.FULL) &&
             this.ticksUsed.value() > this.totalTicks.value()) {
          this.totalTicks.subtract(ticks);
          throw new Vex.RERR("BadArgument", "Too many ticks.");
        }

        // Track the smallest tickable for formatting
        if (ticks.value() < this.smallestTickCount.value()) {
          this.smallestTickCount = ticks.clone();
        }

        this.resolutionMultiplier = this.ticksUsed.denominator;

        // Expand total ticks using denominator from ticks used
        this.totalTicks.add(0, this.ticksUsed.denominator);
      }

      // Add the tickable to the line
      this.tickables.push(tickable);
      tickable.setVoice(this);
      return this;
    },

    addTickables: function(tickables) {
      for (var i = 0; i < tickables.length; ++i) {
        this.addTickable(tickables[i]);
      }

      return this;
    },

    draw: function(context, stave) {
      var boundingBox = null;
      if (this.tickables[0]) {
        this.tickables[0].setStave(stave);
        boundingBox = this.tickables[0].getBoundingBox();
      }

      for (var i = 0; i < this.tickables.length; ++i) {
        this.tickables[i].setStave(stave);
        if (i > 0 && boundingBox) {
          var tickable_bb = this.tickables[i].getBoundingBox();
          if (tickable_bb) boundingBox.mergeWith(tickable_bb);
        }
        this.tickables[i].setContext(context);
        this.tickables[i].setStave(stave);
        this.tickables[i].draw();
      }

      this.boundingBox = boundingBox;
    }
  };

  return Voice;
}());// Vex Music Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010

/** @constructor */
Vex.Flow.VoiceGroup = (function() {
  function VoiceGroup() {
    this.init();
  }

  VoiceGroup.prototype = {
    init: function() {
      this.voices = [];
      this.modifierContexts = [];
    },

    // Every tickable must be associated with a voiceGroup. This allows formatters
    // and preformatters to associate them with the right modifierContexts.
    getVoices: function() { return this.voices; },
    getModifierContexts: function() { return this.modifierContexts; },

    addVoice: function(voice) {
      if (!voice) throw new Vex.RERR("BadArguments", "Voice cannot be null.");
      this.voices.push(voice);
      voice.setVoiceGroup(this);
    }
  };

  return VoiceGroup;
}());// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements varies types of modifiers to notes (e.g. bends,
// fingering positions etc.) Accidentals should also be implemented as
// modifiers, eventually.

/**
 * Create a new modifier for the specified note.
 *
 * @constructor
 */
Vex.Flow.Modifier = (function() {
  function Modifier() { this.init(); }

  Modifier.Position = {
    LEFT: 1,
    RIGHT: 2,
    ABOVE: 3,
    BELOW: 4
  };

  Modifier.prototype = {
    init: function() {
      this.width = 0;
      this.context = null;
      this.note = null;
      this.index = null;
      this.text_line = 0;
      this.position = Modifier.Position.LEFT;
      this.modifier_context = null;
      this.x_shift = 0;
      this.y_shift = 0;
    },

    // Accessors
    getCategory: function() { return "none"; },
    getWidth: function() { return this.width; },
    setWidth: function(width) { this.width = width; return this; },
    getNote: function() { return this.note; },
    setNote: function(note) { this.note = note; return this; },
    getIndex: function() { return this.index; },
    setIndex: function(index) { this.index = index; return this; },
    getContext: function() { return this.context; },
    setContext: function(context) { this.context = context; return this; },
    getModifierContext: function() { return this.modifier_context; },
    setModifierContext: function(c) { this.modifier_context = c; return this; },
    setTextLine: function(line) { this.text_line = line; return this; },
    setYShift: function(y) { this.y_shift = y; return this; },

    // Shift x pixels in the direction of the modifier
    setXShift: function(x) {
      this.x_shift = 0;
      if (this.position == Modifier.Position.LEFT) {
        this.x_shift -= x;
      } else {
        this.x_shift += x;
      }
    },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw without a canvas context.");
      throw new Vex.RERR("MethodNotImplemented",
          "Draw() not implemented for this modifier.");
    }
  };

  return Modifier;
}());
// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements various types of modifiers to notes (e.g. bends,
// fingering positions etc.) Accidentals should also be implemented as
// modifiers, eventually.

/**
 * @constructor
 */
Vex.Flow.ModifierContext = (function() {
  function ModifierContext() {
    // Current modifiers
    this.modifiers = {};

    // Formatting data.
    this.preFormatted = false;
    this.width = 0;
    this.spacing = 0;
    this.state = {
      left_shift: 0,
      right_shift: 0,
      text_line: 0
    };
  }

  // Static method. Called from formatNotes :: shift rests vertically
  var shiftRestVertical = function(rest, note, dir) {
    if (!Vex.Debug) return;

    var delta = 0;
    var padding;

    if (dir == 1) {
      padding = note.isrest ? 0.0 : 0.5;
      delta = note.max_line - rest.min_line;
      delta += padding;
    } else {
      padding = note.isrest ? 0.0 : 0.5;
      delta = note.min_line - rest.max_line;
      delta -= padding;
    }

    rest.line += delta;
    rest.max_line += delta;
    rest.min_line += delta;
    rest.note.keyProps[0].line += delta;
  };

// Called from formatNotes :: center a rest between two notes
  var centerRest = function(rest, noteU, noteL) {
    var delta = rest.line - Vex.MidLine(noteU.min_line, noteL.max_line);
    rest.note.keyProps[0].line -= delta;
    rest.line -= delta;
    rest.max_line -= delta;
    rest.min_line -= delta;
  };

  ModifierContext.prototype = {
    addModifier: function(modifier) {
      var type = modifier.getCategory();
      if (!this.modifiers[type]) this.modifiers[type] = [];
      this.modifiers[type].push(modifier);
      modifier.setModifierContext(this);
      this.preFormatted = false;
      return this;
    },

    getModifiers: function(type) { return this.modifiers[type]; },

    getWidth: function() { return this.width; },

    getExtraLeftPx: function() { return this.state.left_shift; },

    getExtraRightPx: function() { return this.state.right_shift; },

    getMetrics: function() {
      if (!this.formatted) throw new Vex.RERR("UnformattedModifier",
          "Unformatted modifier has no metrics.");

      return {
        width: this.state.left_shift + this.state.right_shift + this.spacing,
        spacing: this.spacing,
        extra_left_px: this.state.left_shift,
        extra_right_px: this.state.right_shift
      };
    },

    formatNotes: function() {
      var notes = this.modifiers['stavenotes'];
      if (!notes || notes.length < 2) return this;

      if (notes[0].getStave() != null)
        return this.formatNotesByY(notes);

      // Assumption: no more than three notes
      Vex.Assert(notes.length < 4,
          "Got more than three notes in Vex.Flow.ModifierContext.formatNotes!");

      var notes_list= [];

      for (var i = 0; i < notes.length; i++) {
        var props = notes[i].getKeyProps();
        var line = props[0].line;
        var minL = props[props.length -1].line;
        var stem_dir = notes[i].getStemDirection();
        var stem_max = notes[i].getStemLength() / 10;
        var stem_min = notes[i].getStemMinumumLength() / 10;

        var maxL;
        if (notes[i].isRest()) {
          maxL = line + notes[i].glyph.line_above;
          minL = line - notes[i].glyph.line_below;
        } else {
          maxL = stem_dir == 1 ? props[props.length -1].line + stem_max
               : props[props.length -1].line;
          minL = stem_dir == 1 ? props[0].line
               : props[0].line - stem_max;
        }
        notes_list.push(
          {line: props[0].line,         // note/rest base line
           max_line: maxL,              // note/rest upper bounds line
           min_line: minL,              // note/rest lower bounds line
           isrest: notes[i].isRest(),
           stem_dir: stem_dir,
           stem_max: stem_max,          // Maximum (default) note stem length;
           stem_min: stem_min,          // minimum note stem length
           voice_shift: notes[i].getVoiceShiftWidth(),
           is_displaced: notes[i].isDisplaced(),   // note manually displaced
           note: notes[i]});
      }

      var voices = notes_list.length;

      var noteU = notes_list[0];
      var noteM = voices > 2 ? notes_list[1] : null;
      var noteL = voices > 2 ? notes_list[2] : notes_list[1];

      // for two voice backward compatibility, ensure upper voice is stems up
      // for three voices, the voices must be in order (upper, middle, lower)
      if (voices == 2 && noteU.stem_dir == -1 && noteL.stem_dir == 1) {
        noteU = notes_list[1];
        noteL = notes_list[0];
      }

      var voice_x_shift = Math.max(noteU.voice_shift, noteL.voice_shift);
      var x_shift = 0;
      var stem_delta;

      // Test for two voice note intersection
      if (voices == 2) {
        var line_spacing = noteU.stem_dir == noteL.stem_dir ? 0.0 : 0.5;
        // if top voice is a middle voice, check stem intersection with lower voice
        if (noteU.stem_dir == noteL.stem_dir &&
            noteU.min_line <= noteL.max_line) {
          if (!noteU.isrest) {
            stem_delta = Math.abs(noteU.line - (noteL.max_line + 0.5));
            stem_delta = Math.max(stem_delta, noteU.stem_min);
            noteU.min_line = noteU.line - stem_delta;
            noteU.note.setStemLength(stem_delta * 10);
          }
        }
        if (noteU.min_line <= noteL.max_line + line_spacing) {
          if (noteU.isrest)
            // shift rest up
            shiftRestVertical(noteU, noteL, 1);
          else if (noteL.isrest)
            // shift rest down
            shiftRestVertical(noteL, noteU, -1);
          else {
            x_shift = voice_x_shift;
            if (noteU.stem_dir == noteL.stem_dir)
              // upper voice is middle voice, so shift it right
              noteU.note.setXShift(x_shift + 3);
            else
              // shift lower voice right
              noteL.note.setXShift(x_shift);
          }
        }

        // format complete
        return this;
      }

      // Check middle voice stem intersection with lower voice
      if (noteM != null && noteM.min_line < noteL.max_line + 0.5) {
        if (!noteM.isrest) {
          stem_delta = Math.abs(noteM.line - (noteL.max_line + 0.5));
          stem_delta = Math.max(stem_delta, noteM.stem_min);
          noteM.min_line = noteM.line - stem_delta;
          noteM.note.setStemLength(stem_delta * 10);
        }
      }

      // For three voices, test if rests can be repositioned
      //
      // Special case 1 :: middle voice rest between two notes
      //
      if (noteM.isrest && !noteU.isrest && !noteL.isrest) {
        if (noteU.min_line <= noteM.max_line ||
            noteM.min_line <= noteL.max_line) {
           var rest_height = noteM.max_line - noteM.min_line;
           var space = noteU.min_line - noteL.max_line;
           if (rest_height < space)
             // center middle voice rest between the upper and lower voices
             centerRest(noteM, noteU, noteL);
           else {
             x_shift = voice_x_shift + 3;    // shift middle rest right
             noteM.note.setXShift(x_shift);
           }
           // format complete
           return this;
        }
      }

      // Special case 2 :: all voices are rests
      if (noteU.isrest && noteM.isrest && noteL.isrest) {
        // Shift upper voice rest up
        shiftRestVertical(noteU, noteM, 1);
        // Shift lower voice rest down
        shiftRestVertical(noteL, noteM, -1);
        // format complete
        return this;
      }

      // Test if any other rests can be repositioned
      if (noteM.isrest && noteU.isrest && noteM.min_line <= noteL.max_line)
        // Shift middle voice rest up
        shiftRestVertical(noteM, noteL, 1);
      if (noteM.isrest && noteL.isrest && noteU.min_line <= noteM.max_line)
        // Shift middle voice rest down
        shiftRestVertical(noteM, noteU, -1);
      if (noteU.isrest && noteU.min_line <= noteM.max_line)
        // shift upper voice rest up;
        shiftRestVertical(noteU, noteM, 1);
      if (noteL.isrest && noteM.min_line <= noteL.max_line)
        // shift lower voice rest down
        shiftRestVertical(noteL, noteM, -1);

      // If middle voice intersects upper or lower voice
      if ((!noteU.isrest && !noteM.isrest && noteU.min_line <= noteM.max_line + 0.5) ||
          (!noteM.isrest && !noteL.isrest && noteM.min_line <= noteL.max_line)) {
        x_shift = voice_x_shift + 3;      // shift middle note right
        noteM.note.setXShift(x_shift);
      }

      // Format complete
      return this;

    },

    formatNotesByY: function(notes) {
      // NOTE: this function does not support more than two voices per stave
      //       use with care.
      var hasStave = true;
      var i;

      for (i = 0; i < notes.length; i++) {
        hasStave = hasStave && notes[i].getStave() != null;
      }

      if (!hasStave) throw new Vex.RERR("Stave Missing",
        "All notes must have a stave - Vex.Flow.ModifierContext.formatMultiVoice!");

      var x_shift = 0;

      for (i = 0; i < notes.length - 1; i++) {
        var top_note = notes[i];
        var bottom_note = notes[i + 1];

        if (top_note.getStemDirection() == Vex.Flow.StaveNote.STEM_DOWN) {
          top_note = notes[i + 1];
          bottom_note = notes[i];
        }

        var top_keys = top_note.getKeyProps();
        var bottom_keys = bottom_note.getKeyProps();

        var topY = top_note.getStave().getYForLine(top_keys[0].line);
        var bottomY = bottom_note.getStave().getYForLine(bottom_keys[bottom_keys.length - 1].line);

        var line_space = top_note.getStave().options.spacing_between_lines_px;
        if (Math.abs(topY - bottomY) == line_space / 2) {
          x_shift = top_note.getVoiceShiftWidth();
          bottom_note.setXShift(x_shift);
        }
      }

      this.state.right_shift += x_shift;
      return this;
    },

    formatDots: function() {
      var right_shift = this.state.right_shift;
      var dots = this.modifiers['dots'];
      var dot_spacing = 1;

      if (!dots || dots.length === 0) return this;

      var i, dot, note, shift;
      var dot_list = [];
      for (i = 0; i < dots.length; ++i) {
        dot = dots[i];
        note = dot.getNote();
        var props = note.getKeyProps()[dot.getIndex()];
        shift = (props.displaced ? note.getExtraRightPx() : 0);
        dot_list.push({ line: props.line, shift: shift, note: note, dot: dot });
      }

      // Sort dots by line number.
      dot_list.sort(function(a, b) { return (b.line - a.line); });

      var dot_shift = right_shift;
      var x_width = 0;
      var last_line = null;
      var last_note = null;
      var prev_dotted_space = null;
      var half_shiftY = 0;

      for (i = 0; i < dot_list.length; ++i) {
        dot = dot_list[i].dot;
        note = dot_list[i].note;
        shift = dot_list[i].shift;
        var line = dot_list[i].line;

        // Reset the position of the dot every line.
        if (line != last_line || note != last_note) {
          dot_shift = shift;
        }

        if (!note.isRest() && line != last_line) {
          if (line % 1 == 0.5) {
            // note is on a space, so no dot shift
            half_shiftY = 0;
          } else if (!note.isRest()) {
            // note is on a line, so shift dot to space above the line
            half_shiftY = 0.5;
            if (last_note != null &&
                !last_note.isRest() && last_line - line == 0.5) {
              // previous note on a space, so shift dot to space below the line
              half_shiftY = -0.5;
            } else if (line + half_shiftY == prev_dotted_space) {
              // previous space is dotted, so shift dot to space below the line
               half_shiftY = -0.5;
            }
          }
        }

        // convert half_shiftY to a multiplier for dots.draw()
        dot.dot_shiftY += (-half_shiftY);
        prev_dotted_space = line + half_shiftY;

        dot.setXShift(dot_shift);
        dot_shift += dot.getWidth() + dot_spacing; // spacing
        x_width = (dot_shift > x_width) ? dot_shift : x_width;
        last_line = line;
        last_note = note;
      }

      this.state.right_shift += x_width;
      return this;
    },

    formatAccidentals: function() {
      var left_shift = this.state.left_shift;
      var accidentals = this.modifiers['accidentals'];
      var accidental_spacing = 2;

      if (!accidentals || accidentals.length === 0) return this;

      var acc_list = [];
      var hasStave = false;
      var prev_note = null;
      var shiftL = 0;

      var i, acc, props_tmp;
      for (i = 0; i < accidentals.length; ++i) {
        acc = accidentals[i];
        var note = acc.getNote();
        var stave = note.getStave();
        var props = note.getKeyProps()[acc.getIndex()];
        if (note != prev_note) {
           // Iterate through all notes to get the displaced pixels
           for (var n = 0; n < note.keys.length; ++n) {
              props_tmp = note.getKeyProps()[n];
              shiftL = (props_tmp.displaced ? note.getExtraLeftPx() : shiftL);
            }
            prev_note = note;
        }
        if (stave != null) {
          hasStave = true;
          var line_space = stave.options.spacing_between_lines_px;
          var y = stave.getYForLine(props.line);
          acc_list.push({ y: y, shift: shiftL, acc: acc, lineSpace: line_space });
        } else {
          acc_list.push({ line: props.line, shift: shiftL, acc: acc });
        }
      }

      // If stave assigned, format based on note y-position
      if (hasStave)
        return this.formatAccidentalsByY(acc_list);

      // Sort accidentals by line number.
      acc_list.sort(function(a, b) { return (b.line - a.line); });

      // If first note left shift in case it is displaced
      var acc_shift = acc_list[0].shift;
      var x_width = 0;
      var top_line = acc_list[0].line;
      for (i = 0; i < acc_list.length; ++i) {
        acc = acc_list[i].acc;
        var line = acc_list[i].line;
        var shift = acc_list[i].shift;

        // Once you hit three stave lines, you can reset the position of the
        // accidental.
        if (line < top_line - 3.0) {
          top_line = line;
          acc_shift = shift;
        }

        acc.setXShift(left_shift + acc_shift);
        acc_shift += acc.getWidth() + accidental_spacing; // spacing
        x_width = (acc_shift > x_width) ? acc_shift : x_width;
      }

      this.state.left_shift += x_width;
      return this;
    },

    formatAccidentalsByY: function(acc_list) {
      var left_shift = this.state.left_shift;
      var accidental_spacing = 2;

      // Sort accidentals by Y-position.
      acc_list.sort(function(a, b) { return (b.y - a.y); });

      // If first note is displaced, get the correct left shift
      var acc_shift = acc_list[0].shift;
      var x_width = 0;
      var top_y = acc_list[0].y;

      for (var i = 0; i < acc_list.length; ++i) {
        var acc = acc_list[i].acc;
        var y = acc_list[i].y;
        var shift = acc_list[i].shift;

        // Once you hit three stave lines, you can reset the position of the
        // accidental.
        if (top_y - y > 3 * acc_list[i].lineSpace) {
          top_y = y;
          acc_shift = shift;
        }

        acc.setXShift(acc_shift + left_shift);
        acc_shift += acc.getWidth() + accidental_spacing; // spacing
        x_width = (acc_shift > x_width) ? acc_shift : x_width;
      }

      this.state.left_shift += x_width;
      return this;
    },

    formatStrokes: function() {
      var left_shift = this.state.left_shift;
      var strokes = this.modifiers['strokes'];
      var stroke_spacing = 0;

      if (!strokes || strokes.length === 0) return this;

      var str_list = [];
      var i, str, shift;
      for (i = 0; i < strokes.length; ++i) {
        str = strokes[i];
        var note = str.getNote();
        var props;
        if (note instanceof Vex.Flow.StaveNote) {
          props = note.getKeyProps()[str.getIndex()];
          shift = (props.displaced ? note.getExtraLeftPx() : 0);
          str_list.push({ line: props.line, shift: shift, str: str });
        } else {
          props = note.getPositions()[str.getIndex()];
          str_list.push({ line: props.str, shift: 0, str: str });
        }
      }

      var str_shift = left_shift;
      var x_shift = 0;

      // There can only be one stroke .. if more than one, they overlay each other
      for (i = 0; i < str_list.length; ++i) {
        str = str_list[i].str;
        shift = str_list[i].shift;

        str.setXShift(str_shift + shift);
        x_shift = Math.max(str.getWidth() + stroke_spacing, x_shift);
      }

      this.state.left_shift += x_shift;
      return this;
    },

    formatStringNumbers: function() {
      var left_shift = this.state.left_shift;
      var right_shift = this.state.right_shift;
      var nums = this.modifiers['stringnumber'];
      var num_spacing = 1;

      if (!nums || nums.length === 0) return this;

      var nums_list = [];
      var prev_note = null;
      var shift_left = 0;
      var shift_right = 0;

      var i, num, note, pos, props_tmp;
      for (i = 0; i < nums.length; ++i) {
        num = nums[i];
        note = num.getNote();

        for (i = 0; i < nums.length; ++i) {
          num = nums[i];
          note = num.getNote();
          pos = num.getPosition();
          var props = note.getKeyProps()[num.getIndex()];

          if (note != prev_note) {
            for (var n = 0; n < note.keys.length; ++n) {
              props_tmp = note.getKeyProps()[n];
              if (left_shift === 0)
                shift_left = (props_tmp.displaced ? note.getExtraLeftPx() : shift_left);
              if (right_shift === 0)
                shift_right = (props_tmp.displaced ? note.getExtraRightPx() : shift_right);
            }
            prev_note = note;
          }

          nums_list.push({ line: props.line, pos: pos, shiftL: shift_left, shiftR: shift_right, note: note, num: num });
        }
      }

      // Sort string numbers by line number.
      nums_list.sort(function(a, b) { return (b.line - a.line); });

      var num_shiftL = 0;
      var num_shiftR = 0;
      var x_widthL = 0;
      var x_widthR = 0;
      var last_line = null;
      var last_note = null;
      for (i = 0; i < nums_list.length; ++i) {
        var num_shift = 0;
        note = nums_list[i].note;
        pos = nums_list[i].pos;
        num = nums_list[i].num;
        var line = nums_list[i].line;
        var shiftL = nums_list[i].shiftL;
        var shiftR = nums_list[i].shiftR;

        // Reset the position of the string number every line.
        if (line != last_line || note != last_note) {
          num_shiftL = left_shift + shiftL;
          num_shiftR = right_shift + shiftR;
        }

        var num_width = num.getWidth() + num_spacing;
        if (pos == Vex.Flow.Modifier.Position.LEFT) {
          num.setXShift(left_shift);
          num_shift = shift_left + num_width; // spacing
          x_widthL = (num_shift > x_widthL) ? num_shift : x_widthL;
        } else if (pos == Vex.Flow.Modifier.Position.RIGHT) {
          num.setXShift(num_shiftR);
          num_shift += num_width; // spacing
          x_widthR = (num_shift > x_widthR) ? num_shift : x_widthR;
        }
        last_line = line;
        last_note = note;
      }

      this.state.left_shift += x_widthL;
      this.state.right_shift += x_widthR;
      return this;
    },

    formatFretHandFingers: function() {
      var left_shift = this.state.left_shift;
      var right_shift = this.state.right_shift;
      var nums = this.modifiers['frethandfinger'];
      var num_spacing = 1;

      if (!nums || nums.length === 0) return this;

      var nums_list = [];
      var prev_note = null;
      var shift_left = 0;
      var shift_right = 0;

      var i, num, note, pos, props_tmp;
      for (i = 0; i < nums.length; ++i) {
        num = nums[i];
        note = num.getNote();
        pos = num.getPosition();
        var props = note.getKeyProps()[num.getIndex()];
        if (note != prev_note) {
          for (var n = 0; n < note.keys.length; ++n) {
            props_tmp = note.getKeyProps()[n];
            if (left_shift === 0)
              shift_left = (props_tmp.displaced ? note.getExtraLeftPx() : shift_left);
            if (right_shift === 0)
              shift_right = (props_tmp.displaced ? note.getExtraRightPx() : shift_right);
          }
          prev_note = note;
        }

        nums_list.push({ line: props.line, pos: pos, shiftL: shift_left, shiftR: shift_right, note: note, num: num });
      }

      // Sort fingernumbers by line number.
      nums_list.sort(function(a, b) { return (b.line - a.line); });

      var num_shiftL = 0;
      var num_shiftR = 0;
      var x_widthL = 0;
      var x_widthR = 0;
      var last_line = null;
      var last_note = null;

      for (i = 0; i < nums_list.length; ++i) {
        var num_shift = 0;
        note = nums_list[i].note;
        pos = nums_list[i].pos;
        num = nums_list[i].num;
        var line = nums_list[i].line;
        var shiftL = nums_list[i].shiftL;
        var shiftR = nums_list[i].shiftR;

        // Reset the position of the string number every line.
        if (line != last_line || note != last_note) {
          num_shiftL = left_shift + shiftL;
          num_shiftR = right_shift + shiftR;
        }

        var num_width = num.getWidth() + num_spacing;
        if (pos == Vex.Flow.Modifier.Position.LEFT) {
          num.setXShift(left_shift + num_shiftL);
          num_shift = left_shift + num_width; // spacing
          x_widthL = (num_shift > x_widthL) ? num_shift : x_widthL;
        } else if (pos == Vex.Flow.Modifier.Position.RIGHT) {
          num.setXShift(num_shiftR);
          num_shift = shift_right + num_width; // spacing
          x_widthR = (num_shift > x_widthR) ? num_shift : x_widthR;
        }
        last_line = line;
        last_note = note;
      }

      this.state.left_shift += x_widthL;
      this.state.right_shift += x_widthR;
      return this;
    },

    formatBends: function() {
      var bends = this.modifiers['bends'];
      if (!bends || bends.length === 0) return this;

      var last_width = 0;
      var text_line = this.state.text_line;

      // Format Bends
      for (var i = 0; i < bends.length; ++i) {
        var bend = bends[i];
        bend.setXShift(last_width);
        last_width = bend.getWidth();
        bend.setTextLine(text_line);
      }

      this.state.right_shift += last_width;
      this.state.text_line += 1;
      return this;
    },

    formatVibratos: function() {
      var vibratos = this.modifiers['vibratos'];
      if (!vibratos || vibratos.length === 0) return this;

      var text_line = this.state.text_line;
      var width = 0;
      var shift = this.state.right_shift - 7;

      // If there's a bend, drop the text line
      var bends = this.modifiers['bends'];
      if (bends && bends.length > 0) {
        text_line--;
      }

      // Format Vibratos
      for (var i = 0; i < vibratos.length; ++i) {
        var vibrato = vibratos[i];
        vibrato.setXShift(shift);
        vibrato.setTextLine(text_line);
        width += vibrato.getWidth();
        shift += width;
      }

      this.state.right_shift += width;
      this.state.text_line += 1;
      return this;
    },

    formatAnnotations: function() {
      var annotations = this.modifiers['annotations'];
      if (!annotations || annotations.length === 0) return this;

      var text_line = this.state.text_line;
      var max_width = 0;

      // Format Annotations
      var width;
      for (var i = 0; i < annotations.length; ++i) {
        var annotation = annotations[i];
        annotation.setTextLine(text_line);
        width = annotation.getWidth() > max_width ?
          annotation.getWidth() : max_width;
        text_line++;
      }

      this.state.left_shift += width / 2;
      this.state.right_shift += width / 2;
      // No need to update text_line because we leave lots of room on the same
      // line.
      return this;
    },

    formatArticulations: function() {
      var articulations = this.modifiers['articulations'];
      if (!articulations || articulations.length === 0) return this;

      var text_line = this.state.text_line;
      var max_width = 0;

      // Format Articulations
      var width;
      for (var i = 0; i < articulations.length; ++i) {
        var articulation = articulations[i];
        articulation.setTextLine(text_line);
        width = articulation.getWidth() > max_width ?
          articulation.getWidth() : max_width;

        var type = Vex.Flow.articulationCodes(articulation.type);
        if(type.between_lines)
          text_line += 1;
        else
          text_line += 1.5;
      }

      this.state.left_shift += width / 2;
      this.state.right_shift += width / 2;
      this.state.text_line = text_line;
      return this;
    },

    preFormat: function() {
      if (this.preFormatted) return;

      // Format modifiers in the following order:
      this.formatNotes().
           formatDots().
           formatFretHandFingers().
           formatAccidentals().
           formatStrokes().
           formatStringNumbers().
           formatArticulations().
           formatAnnotations().
           formatBends().
           formatVibratos();

      // Update width of this modifier context
      this.width = this.state.left_shift + this.state.right_shift;
      this.preFormatted = true;
    }
  };

  return ModifierContext;
}());
// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements accidentals.

/**
 * @constructor
 */
Vex.Flow.Accidental = (function(){
  var Accidental = function(type) {
    if (arguments.length > 0) this.init(type);
  };

  Vex.Inherit(Accidental, Vex.Flow.Modifier, {
    init: function(type) {
      Accidental.superclass.init.call(this);

      this.note = null;
      this.index = null;
      this.type = type;
      this.position = Vex.Flow.Modifier.Position.LEFT;

      this.render_options = {
        font_scale: 38,
        stroke_px: 3,
        stroke_spacing: 10
      };

      this.accidental = Vex.Flow.accidentalCodes(this.type);

      this.cautionary = false;      // true - draw as cautionary accidental
      this.paren_left = null;
      this.paren_right = null;

      this.setWidth(this.accidental.width);
    },

    getCategory: function() { return "accidentals"; },

    setAsCautionary: function() {
      this.cautionary = true;
      // Set accidental size smaller than normal
      this.render_options.font_scale = 28;
      this.paren_left = Vex.Flow.accidentalCodes("{");
      this.paren_right = Vex.Flow.accidentalCodes("}");
      var width_adjust = (this.type == "##" || this.type == "bb") ? 6 : 4;
      this.setWidth(this.paren_left.width + this.accidental.width + this.paren_right.width - width_adjust);
      return this;
    },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoContext",
        "Can't draw accidental without a context.");
      if (!(this.note && (this.index != null))) throw new Vex.RERR("NoAttachedNote",
        "Can't draw accidental without a note and index.");

      var start = this.note.getModifierStartXY(this.position, this.index);
      var acc_x = (start.x + this.x_shift) - this.width;
      var acc_y = start.y + this.y_shift;

      if (!this.cautionary) {
        Vex.Flow.renderGlyph(this.context, acc_x, acc_y,
                             this.render_options.font_scale, this.accidental.code);
      } else {
        acc_x += 3;
        Vex.Flow.renderGlyph(this.context, acc_x, acc_y,
                             this.render_options.font_scale, this.paren_left.code);
        acc_x += 2;
        Vex.Flow.renderGlyph(this.context, acc_x, acc_y,
                             this.render_options.font_scale, this.accidental.code);
        acc_x += this.accidental.width - 2;
        if (this.type == "##" || this.type == "bb") acc_x -= 2;
        Vex.Flow.renderGlyph(this.context, acc_x, acc_y,
                             this.render_options.font_scale, this.paren_right.code);
      }
    }
  });

  return Accidental;
}());// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements dot modifiers for notes.

/**
 * @constructor
 */
Vex.Flow.Dot = (function() {
  function Dot() {
    this.init();
  }

  var Modifier = Vex.Flow.Modifier;
  Vex.Inherit(Dot, Modifier, {
    init: function() {
      Dot.superclass.init.call(this);

      this.note = null;
      this.index = null;
      this.position = Modifier.Position.RIGHT;

      this.radius = 2;
      this.setWidth(5);
      this.dot_shiftY = 0;
    },

    getCategory: function() { return "dots"; },

    setDotShiftY: function(y) { this.dot_shiftY = y; return this; },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoContext",
        "Can't draw dot without a context.");
      if (!(this.note && (this.index != null))) throw new Vex.RERR("NoAttachedNote",
        "Can't draw dot without a note and index.");

      var line_space = this.note.stave.options.spacing_between_lines_px;

      var start = this.note.getModifierStartXY(this.position, this.index);
      var dot_x = (start.x + this.x_shift) + this.width - this.radius;
      var dot_y = start.y + this.y_shift + (this.dot_shiftY * line_space);
      var ctx = this.context;

      ctx.beginPath();
      ctx.arc(dot_x, dot_y, this.radius, 0, Math.PI * 2, false);
      ctx.fill();
    }
  });

  return Dot;
}());
// Vex Music Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010

/** @constructor */
Vex.Flow.Formatter = (function() {
  function Formatter() {
    this.minTotalWidth = 0;
    this.hasMinTotalWidth = false;
    this.minTicks = null;
    this.pixelsPerTick = 0;
    this.totalTicks = new Vex.Flow.Fraction(0, 1);
    this.tContexts = null;
    this.mContexts = null;

    this.render_options = {
      perTickableWidth: 15,
      maxExtraWidthPerTickable: 40
    };
  }

  // Helper function to format and draw a single voice. Returns a bounding
  // box for the notation.
  Formatter.FormatAndDraw = function(ctx, stave, notes, params) {
    var voice = new Vex.Flow.Voice(Vex.Flow.TIME4_4).
      setMode(Vex.Flow.Voice.Mode.SOFT);
    voice.addTickables(notes);

    // For backward compatability, params has three forms:
    //   1. Setting autobeam only (context, stave, notes, true) or (ctx, stave, notes, {autobeam: true})
    //   2. Setting align_rests a struct is needed (context, stave, notes, {align_rests: true})
    //   3. Setting both a struct is needed (context, stave, notes, {autobeam: true, align_rests: true});
    //
    // The default for autobam and align_rests is false
    //
    var opts = {
      auto_beam: false,
      align_rests: false
    };

    if (typeof params == "object") {
      Vex.Merge(opts, params);
    } else if (typeof params == "boolean") {
      opts.auto_beam = params;
    }

    var beams = null;

    if (opts.auto_beam) {
      beams = Vex.Flow.Beam.applyAndGetBeams(voice);
    }

    new Formatter().
      joinVoices([voice], {align_rests: opts.align_rests}).
      formatToStave([voice], stave, {align_rests: opts.align_rests});

    voice.setStave(stave);

    voice.draw(ctx, stave);
    if (beams != null) {
      for (var i=0; i<beams.length; ++i) {
        beams[i].setContext(ctx).draw();
      }
    }

    return voice.getBoundingBox();
  };

  // Helper function to format and draw a single voice
  Formatter.FormatAndDrawTab = function(ctx,
      tabstave, stave, tabnotes, notes, autobeam, params) {

    var notevoice = new Vex.Flow.Voice(Vex.Flow.TIME4_4).
      setMode(Vex.Flow.Voice.Mode.SOFT);
    notevoice.addTickables(notes);

    var tabvoice = new Vex.Flow.Voice(Vex.Flow.TIME4_4).
      setMode(Vex.Flow.Voice.Mode.SOFT);
    tabvoice.addTickables(tabnotes);

    // For backward compatability, params has three forms:
    //   1. Setting autobeam only (context, stave, notes, true) or (ctx, stave, notes, {autobeam: true})
    //   2. Setting align_rests a struct is needed (context, stave, notes, {align_rests: true})
    //   3. Setting both a struct is needed (context, stave, notes, {autobeam: true, align_rests: true});
    //
    // The default for autobam and align_rests is false
    //
    var opts = {
      auto_beam: autobeam,
      align_rests: false
    };

    if (typeof params == "object") {
      Vex.Merge(opts, params);
    } else if (typeof params == "boolean") {
      opts.auto_beam = params;
    }

    var beams = null;

    if (opts.auto_beam) {
      beams = Vex.Flow.Beam.applyAndGetBeams(notevoice);
    }


    new Formatter().
      joinVoices([notevoice], {align_rests: opts.align_rests}).
      joinVoices([tabvoice]).
      formatToStave([notevoice,tabvoice], stave, {align_rests: opts.align_rests});

    notevoice.draw(ctx, stave);
    tabvoice.draw(ctx, tabstave);
    if (beams != null) {
      for (var i=0; i<beams.length; ++i) {
        beams[i].setContext(ctx).draw();
      }
    }

    // Draw a connector between tab and note staves.
    (new Vex.Flow.StaveConnector(stave, tabstave)).setContext(ctx).draw();
  };

  // Helper function to locate the next non-rest note(s)
  Formatter.LookAhead = function(notes, rest_line, i, compare) {
    // If no valid next note group, next_rest_line is same as current
    var next_rest_line = rest_line;
    // get the rest line for next valid non-rest note group
    i++;
    while (i < notes.length) {
      if (!notes[i].isRest() && !notes[i].shouldIgnoreTicks()) {
        next_rest_line = notes[i].getLineForRest();
        break;
      }
      i++;
    }

    // locate the mid point between two lines
    if (compare && rest_line != next_rest_line) {
      var top = Vex.Max(rest_line, next_rest_line);
      var bot = Vex.Min(rest_line, next_rest_line);
      next_rest_line = Vex.MidLine(top, bot);
    }
    return next_rest_line;
  };

  // Auto position rests based on previous/next note positions
  Formatter.AlignRestsToNotes = function(notes, align_all_notes, align_tuplets) {
    for (var i = 0; i < notes.length; ++i) {
      if (notes[i] instanceof Vex.Flow.StaveNote && notes[i].isRest()) {
        var note = notes[i];

        if (note.tuplet && !align_tuplets) continue;

        // If activated rests not on default can be rendered as specified
        var position = note.glyph.position.toUpperCase();
        if (position != "R/4" && position != "B/4") {
          continue;
        }

        if (align_all_notes || note.beam != null) {
          // align rests with previous/next notes
          var props = note.getKeyProps()[0];
          if (i === 0) {
            props.line = Formatter.LookAhead(notes, props.line, i, false);
          } else if (i > 0 && i < notes.length) {
            // if previous note is a rest, use it's line number
            var rest_line;
            if (notes[i-1].isRest()) {
              rest_line = notes[i-1].getKeyProps()[0].line;
              props.line = rest_line;
            } else {
              rest_line = notes[i-1].getLineForRest();
              // get the rest line for next valid non-rest note group
              props.line = Formatter.LookAhead(notes, rest_line, i, true);
            }
          }
        }
      }
    }

    return this;
  };

  /**
     * Take a set of voices and place aligned tickables in the same modifier
     * context.
     */
  function createContexts(voices, context_type, add_fn) {
    if (!voices || !voices.length) throw new Vex.RERR("BadArgument",
        "No voices to format");

    var totalTicks = voices[0].getTotalTicks();
    var tickToContextMap = {};
    var tickList = [];

    var resolutionMultiplier = 1;

    // Find out highest common multiple of resolution multipliers.
    // The purpose of this is to find out a common denominator
    // for all fractional tick values in all tickables of all voices,
    // so that the values can be expanded and the numerator used
    // as an integer tick value.
    //
    var i; // shared iterator
    var voice;
    for (i = 0; i < voices.length; ++i) {
      voice = voices[i];
      if (voice.getTotalTicks().value() != totalTicks.value()) {
        throw new Vex.RERR("TickMismatch",
            "Voices should have same time signature.");
      }

      if (voice.getMode() == Vex.Flow.Voice.Mode.STRICT && !voice.isComplete())
        throw new Vex.RERR("IncompleteVoice",
          "Voice does not have enough notes.");

      var lcm = Vex.Flow.Fraction.LCM(resolutionMultiplier,
          voice.getResolutionMultiplier());
      if (resolutionMultiplier < lcm) {
        resolutionMultiplier = lcm;
      }
    }

    for (i = 0; i < voices.length; ++i) {
      voice = voices[i];

      var tickables = voice.getTickables();

      // Use resolution multiplier as denominator to expand ticks
      // to suitable integer values, so that no additional expansion
      // of fractional tick values is needed.
      var ticksUsed = new Vex.Flow.Fraction(0, resolutionMultiplier);

      for (var j = 0; j < tickables.length; ++j) {
        var tickable = tickables[j];

        var integerTicks = ticksUsed.numerator;

        // If we have no tick context for this tick, create one
        if (!tickToContextMap[integerTicks])
          tickToContextMap[integerTicks] = new context_type();

        // Add this tickable to the TickContext
        add_fn(tickable, tickToContextMap[integerTicks]);

        // Maintain a sorted list of tick contexts
        tickList.push(integerTicks);

        ticksUsed.add(tickable.getTicks());
      }
    }

    return {
      map: tickToContextMap,
      list: Vex.SortAndUnique(tickList, function(a, b) { return a - b; },
          function(a, b) { return a === b; } ),
      resolutionMultiplier: resolutionMultiplier
    };
  }

  // Instance methods.
  Formatter.prototype = {
    alignRests: function(voices, align_all_notes) {
      if (!voices || !voices.length) throw new Vex.RERR("BadArgument",
          "No voices to format rests");
      for (var i = 0; i < voices.length; i++) {
        new Formatter.AlignRestsToNotes(voices[i].tickables, align_all_notes);
      }
    },

    preCalculateMinTotalWidth: function(voices) {
      if (this.hasMinTotalWidth) return;

      if (!this.tContexts) {
        if (!voices) {
          throw new Vex.RERR("BadArgument",
                             "'voices' required to run preCalculateMinTotalWidth");
        }

        this.createTickContexts(voices);
      }

      var contexts = this.tContexts;
      var contextList = contexts.list;
      var contextMap = contexts.map;

      this.minTotalWidth = 0;

      // Go through each tick context and calculate total width.
      for (var i = 0; i < contextList.length; ++i) {
        var context = contextMap[contextList[i]];

        // preFormat() gets them to descend down to their tickables and modifier
        // contexts, and calculate their widths.
        context.preFormat();
        this.minTotalWidth += context.getWidth();
      }

      this.hasMinTotalWidth = true;

      return this.minTotalWidth;
    },

    getMinTotalWidth: function() {
      if (!this.hasMinTotalWidth) {
        throw new Vex.RERR("NoMinTotalWidth",
            "Need to call 'preCalculateMinTotalWidth' or 'preFormat' before" +
            " calling 'getMinTotalWidth'");
      }

      return this.minTotalWidth;
    },

    createModifierContexts: function(voices) {
      var contexts = createContexts(voices,
          Vex.Flow.ModifierContext,
          function(tickable, context) {
            tickable.addToModifierContext(context);
          });
      this.mContexts = contexts;
      return contexts;
    },

    /**
     * Take a set of voices and place aligned tickables in the same modifier
     * tick context.
     */
    createTickContexts: function(voices) {
      var contexts = createContexts(voices,
          Vex.Flow.TickContext,
          function(tickable, context) { context.addTickable(tickable); });

      this.totalTicks = voices[0].getTicksUsed().clone();
      this.tContexts = contexts;
      return contexts;
    },

    /**
     * Take a set of tick contexts and align their X-positions and space usage.
     */
    preFormat: function(justifyWidth, rendering_context) {
      var contexts = this.tContexts;
      var contextList = contexts.list;
      var contextMap = contexts.map;

      if (!justifyWidth) {
        justifyWidth = 0;
        this.pixelsPerTick = 0;
      } else {
        this.pixelsPerTick = justifyWidth / (this.totalTicks.value() * contexts.resolutionMultiplier);
      }

      // Now distribute the ticks to each tick context, and assign them their
      // own X positions.
      var x = 0;
      var white_space = 0; // White space to right of previous note
      var tick_space = 0;  // Pixels from prev note x-pos to curent note x-pos
      var prev_tick = 0;
      var prev_width = 0;
      var lastMetrics = null;
      var initial_justify_width = justifyWidth;
      this.minTotalWidth = 0;

      var i, tick, context;        // shared variables

      // Pass 1: Give each note maximum width requested by context.
      for (i = 0; i < contextList.length; ++i) {
        tick = contextList[i];
        context = contextMap[tick];
        if (rendering_context) context.setContext(rendering_context);
        context.preFormat();

        var thisMetrics = context.getMetrics();
        var width = context.getWidth();
        this.minTotalWidth += width;
        var min_x = 0;

        var pixels_used = width;

        // Pixels to next note x position
        tick_space = Math.min((tick - prev_tick) * this.pixelsPerTick, pixels_used);

        // Calculate note x position
        var set_x = x + tick_space;

        // Calculate the minimum next note position to allow for right modifiers
        if (lastMetrics != null) {
          min_x = x + prev_width - lastMetrics.extraLeftPx;
        }

        // Determine the space required for the previous tick
        // The shouldIgnoreTicks part is a dirty heuristic to accomodate for bar
        // lines. Really, there shouldn't be bar lines inside measures. Bar lines
        // should be implemented with distinct measures.
        set_x = context.shouldIgnoreTicks() ?
            (min_x + context.getWidth()) : Math.max(set_x, min_x);

        if (context.shouldIgnoreTicks() && justifyWidth) {
            // This note stole room... recalculate with new justification width.
            justifyWidth -= context.getWidth();
            this.pixelsPerTick = justifyWidth /
              (this.totalTicks.value() * contexts.resolutionMultiplier);
        }

        // Determine pixels needed for left modifiers
        var left_px = thisMetrics.extraLeftPx;

        // Determine white space to right of previous tick
        if (lastMetrics != null) {
          white_space = (set_x - x) - (prev_width -
                                       lastMetrics.extraLeftPx);
        }

        if (i > 0) {
          if (white_space > 0) {
            if (white_space >= left_px) {
              // Have enough white space for left modifiers - no offset needed
              left_px = 0;
            } else {
              // Decrease left modifier offset by amount of white space
              left_px -= white_space;
            }
          }
        }

        // Adjust the tick x position with the left modifier offset
        set_x += left_px;

        context.setX(set_x);
        context.setPixelsUsed(pixels_used);  // ??? Not sure this is neeeded

        lastMetrics = thisMetrics;
        prev_width = width;
        prev_tick = tick;
        x = set_x;
      }

      this.hasMinTotalWidth = true;

      if (justifyWidth > 0) {
        // Pass 2: Take leftover width, and distribute it to proportionately to
        // all notes.
        var remaining_x = initial_justify_width - (x + prev_width);
        var leftover_pixels_per_tick = remaining_x / (this.totalTicks.value() * contexts.resolutionMultiplier);
        var accumulated_space = 0;
        prev_tick = 0;

        for (i = 0; i < contextList.length; ++i) {
          tick = contextList[i];
          context = contextMap[tick];
          tick_space = (tick - prev_tick) * leftover_pixels_per_tick;
          accumulated_space = accumulated_space + tick_space;
          context.setX(context.getX() + accumulated_space);
          prev_tick = tick;
        }
      }
    },

    joinVoices: function(voices) {
      this.createModifierContexts(voices);
      this.hasMinTotalWidth = false;
      return this;
    },

    format: function(voices, justifyWidth, options) {
      var opts = {
        align_rests: false,
        context: null
      };

      Vex.Merge(opts, options);

      this.alignRests(voices, opts.align_rests);
      this.createTickContexts(voices);
      this.preFormat(justifyWidth, opts.context);

      return this;
    },

    formatToStave: function(voices, stave, options) {
      var justifyWidth = stave.getNoteEndX() - stave.getNoteStartX() - 10;
      var opts = {context: stave.getContext()};
      Vex.Merge(opts, options);
      return this.format(voices, justifyWidth, opts);
    }
  };

  return Formatter;
}());// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements varies types of ties between contiguous notes. The
// ties include: regular ties, hammer ons, pull offs, and slides.

/**
 * Create a new tie from the specified notes. The notes must
 * be part of the same line, and have the same duration (in ticks).
 *
 * @constructor
 * @param {!Object} context The canvas context.
 * @param {!Object} notes The notes to tie up.
 * @param {!Object} Options
 */
Vex.Flow.StaveTie = (function() {
  function StaveTie(notes, text) {
    if (arguments.length > 0) this.init(notes, text);
  }

  StaveTie.prototype = {
    init: function(notes, text) {
      /**
       * Notes is a struct that has:
       *
       *  {
       *    first_note: Note,
       *    last_note: Note,
       *    first_indices: [n1, n2, n3],
       *    last_indices: [n1, n2, n3]
       *  }
       *
       **/
      this.notes = notes;
      this.context = null;
      this.text = text;

      this.render_options = {
          cp1: 8,      // Curve control point 1
          cp2: 15,      // Curve control point 2
          text_shift_x: 0,
          first_x_shift: 0,
          last_x_shift: 0,
          y_shift: 7,
          tie_spacing: 0,
          font: { family: "Arial", size: 10, style: "" }
        };

      this.font = this.render_options.font;
      this.setNotes(notes);
    },

    setContext: function(context) { this.context = context; return this; },
    setFont: function(font) { this.font = font; return this; },

    /**
     * Set the notes to attach this tie to.
     *
     * @param {!Object} notes The notes to tie up.
     */
    setNotes: function(notes) {
      if (!notes.first_note && !notes.last_note)
        throw new Vex.RuntimeError("BadArguments",
            "Tie needs to have either first_note or last_note set.");

      if (!notes.first_indices) notes.first_indices = [0];
      if (!notes.last_indices) notes.last_indices = [0];

      if (notes.first_indices.length != notes.last_indices.length)
        throw new Vex.RuntimeError("BadArguments", "Tied notes must have similar" +
          " index sizes");

      // Success. Lets grab 'em notes.
      this.first_note = notes.first_note;
      this.first_indices = notes.first_indices;
      this.last_note = notes.last_note;
      this.last_indices = notes.last_indices;
      return this;
    },

    /**
     * @return {boolean} Returns true if this is a partial bar.
     */
    isPartial: function() {
      return (!this.first_note || !this.last_note);
    },

    renderTie: function(params) {
      if (params.first_ys.length === 0 || params.last_ys.length === 0)
        throw new Vex.RERR("BadArguments", "No Y-values to render");

      var ctx = this.context;
      var cp1 = this.render_options.cp1;
      var cp2 = this.render_options.cp2;

      if (Math.abs(params.last_x_px - params.first_x_px) < 10) {
        cp1 = 2; cp2 = 8;
      }

      var first_x_shift = this.render_options.first_x_shift;
      var last_x_shift = this.render_options.last_x_shift;
      var y_shift = this.render_options.y_shift * params.direction;

      for (var i = 0; i < this.first_indices.length; ++i) {
        var cp_x = ((params.last_x_px + last_x_shift) +
                    (params.first_x_px + first_x_shift)) / 2;
        var first_y_px = params.first_ys[this.first_indices[i]] + y_shift;
        var last_y_px = params.last_ys[this.last_indices[i]] + y_shift;

        if (isNaN(first_y_px) || isNaN(last_y_px))
          throw new Vex.RERR("BadArguments", "Bad indices for tie rendering.");

        var top_cp_y = ((first_y_px + last_y_px) / 2) + (cp1 * params.direction);
        var bottom_cp_y = ((first_y_px + last_y_px) / 2) + (cp2 * params.direction);

        ctx.beginPath();

        ctx.moveTo(params.first_x_px + first_x_shift, first_y_px);
        ctx.quadraticCurveTo(cp_x, top_cp_y,
                             params.last_x_px + last_x_shift, last_y_px);
        ctx.quadraticCurveTo(cp_x, bottom_cp_y,
                             params.first_x_px + first_x_shift, first_y_px);

        ctx.closePath();
        ctx.fill();
      }
    },

    renderText: function(first_x_px, last_x_px) {
      if (!this.text) return;
      var center_x = (first_x_px + last_x_px) / 2;
      center_x -= this.context.measureText(this.text).width / 2;

      this.context.save();
      this.context.setFont(this.font.family, this.font.size, this.font.style);
      this.context.fillText(
          this.text, center_x + this.render_options.text_shift_x,
          (this.first_note || this.last_note).getStave().getYForTopText() - 1);
      this.context.restore();
    },

    draw: function() {
      if (!this.context)
        throw new Vex.RERR("NoContext", "No context to render tie.");
      var first_note = this.first_note;
      var last_note = this.last_note;
      var first_x_px, last_x_px, first_ys, last_ys, stem_direction;

      if (first_note) {
        first_x_px = first_note.getTieRightX() + this.render_options.tie_spacing;
        stem_direction = first_note.getStemDirection();
        first_ys = first_note.getYs();
      } else {
        first_x_px = last_note.getStave().getTieStartX();
        first_ys = last_note.getYs();
        this.first_indices = this.last_indices;
      }

      if (last_note) {
        last_x_px = last_note.getTieLeftX() + this.render_options.tie_spacing;
        stem_direction = last_note.getStemDirection();
        last_ys = last_note.getYs();
      } else {
        last_x_px = first_note.getStave().getTieEndX();
        last_ys = first_note.getYs();
        this.last_indices = this.first_indices;
      }

      this.renderTie({
        first_x_px: first_x_px,
        last_x_px: last_x_px,
        first_ys: first_ys,
        last_ys: last_ys,
        direction: stem_direction
      });

      this.renderText(first_x_px, last_x_px);
      return true;
    }
  };

  return StaveTie;
}());
// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements varies types of ties between contiguous notes. The
// ties include: regular ties, hammer ons, pull offs, and slides.

/**
 * Create a new tie from the specified notes. The notes must
 * be part of the same line, and have the same duration (in ticks).
 *
 * @constructor
 * @param {!Object} context The canvas context.
 * @param {!Object} notes The notes to tie up.
 * @param {!Object} Options
 */
Vex.Flow.TabTie = (function() {
  function TabTie(notes, text) {
    if (arguments.length > 0) this.init(notes, text);
  }

  TabTie.createHammeron = function(notes) {
    return new TabTie(notes, "H");
  };

  TabTie.createPulloff = function(notes) {
    return new TabTie(notes, "P");
  };

  Vex.Inherit(TabTie, Vex.Flow.StaveTie, {
    init: function(notes, text) {
      /**
       * Notes is a struct that has:
       *
       *  {
       *    first_note: Note,
       *    last_note: Note,
       *    first_indices: [n1, n2, n3],
       *    last_indices: [n1, n2, n3]
       *  }
       *
       **/
      TabTie.superclass.init.call(this, notes, text);
      this.render_options.cp1 = 9;
      this.render_options.cp2 = 11;
      this.render_options.y_shift = 3;

      this.setNotes(notes);
    },

    draw: function() {
      if (!this.context)
        throw new Vex.RERR("NoContext", "No context to render tie.");
      var first_note = this.first_note;
      var last_note = this.last_note;
      var first_x_px, last_x_px, first_ys, last_ys;

      if (first_note) {
        first_x_px = first_note.getTieRightX() + this.render_options.tie_spacing;
        first_ys = first_note.getYs();
      } else {
        first_x_px = last_note.getStave().getTieStartX();
        first_ys = last_note.getYs();
        this.first_indices = this.last_indices;
      }

      if (last_note) {
        last_x_px = last_note.getTieLeftX() + this.render_options.tie_spacing;
        last_ys = last_note.getYs();
      } else {
        last_x_px = first_note.getStave().getTieEndX();
        last_ys = first_note.getYs();
        this.last_indices = this.first_indices;
      }

      this.renderTie({
        first_x_px: first_x_px,
        last_x_px: last_x_px,
        first_ys: first_ys,
        last_ys: last_ys,
        direction: -1           // Tab tie's are always face up.
      });

      this.renderText(first_x_px, last_x_px);
      return true;
    }
  });

  return TabTie;
}());
// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements varies types of ties between contiguous notes. The
// ties include: regular ties, hammer ons, pull offs, and slides.

/**
 * Create a new tie from the specified notes. The notes must
 * be part of the same line, and have the same duration (in ticks).
 *
 * @constructor
 * @param {!Object} context The canvas context.
 * @param {!Object} notes The notes to tie up.
 * @param {!Object} Options
 */
Vex.Flow.TabSlide = (function() {
  function TabSlide(notes, direction) {
    if (arguments.length > 0) this.init(notes, direction);
  }

  TabSlide.SLIDE_UP = 1;
  TabSlide.SLIDE_DOWN = -1;

  TabSlide.createSlideUp = function(notes) {
    return new TabSlide(notes, TabSlide.SLIDE_UP);
  };

  TabSlide.createSlideDown = function(notes) {
    return new TabSlide(notes, TabSlide.SLIDE_DOWN);
  };

  Vex.Inherit(TabSlide, Vex.Flow.TabTie, {
    init: function(notes, direction) {
      /**
       * Notes is a struct that has:
       *
       *  {
       *    first_note: Note,
       *    last_note: Note,
       *    first_indices: [n1, n2, n3],
       *    last_indices: [n1, n2, n3]
       *  }
       *
       **/
      TabSlide.superclass.init.call(this, notes, "sl.");
      if (!direction) {
        var first_fret = notes.first_note.getPositions()[0].fret;
        var last_fret = notes.last_note.getPositions()[0].fret;

        direction = ((parseInt(first_fret, 10) > parseInt(last_fret, 10)) ?
          TabSlide.SLIDE_DOWN : TabSlide.SLIDE_UP);
      }

      this.slide_direction = direction;
      this.render_options.cp1 = 11;
      this.render_options.cp2 = 14;
      this.render_options.y_shift = 0.5;

      this.setFont({font: "Times", size: 10, style: "bold italic"});
      this.setNotes(notes);
    },

    renderTie: function(params) {
      if (params.first_ys.length === 0 || params.last_ys.length === 0)
        throw new Vex.RERR("BadArguments", "No Y-values to render");

      var ctx = this.context;
      var first_x_px = params.first_x_px;
      var first_ys = params.first_ys;
      var last_x_px = params.last_x_px;

      var direction = this.slide_direction;
      if (direction != TabSlide.SLIDE_UP &&
          direction != TabSlide.SLIDE_DOWN) {
        throw new Vex.RERR("BadSlide", "Invalid slide direction");
      }

      for (var i = 0; i < this.first_indices.length; ++i) {
        var slide_y = first_ys[this.first_indices[i]] +
          this.render_options.y_shift;

        if (isNaN(slide_y))
          throw new Vex.RERR("BadArguments", "Bad indices for slide rendering.");

        ctx.beginPath();
        ctx.moveTo(first_x_px, slide_y + (3 * direction));
        ctx.lineTo(last_x_px, slide_y - (3 * direction));
        ctx.closePath();
        ctx.stroke();
      }
    }
  });

  return TabSlide;
}());// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements bends.

/**
   @constructor

   @param text Text for bend ("Full", "Half", etc.) (DEPRECATED)
   @param release If true, render a release. (DEPRECATED)
   @param phrase If set, ignore "text" and "release", and use the more
                 sophisticated phrase specified.

   Example of a phrase:

     [{
       type: UP,
       text: "whole"
       width: 8;
     },
     {
       type: DOWN,
       text: "whole"
       width: 8;
     },
     {
       type: UP,
       text: "half"
       width: 8;
     },
     {
       type: UP,
       text: "whole"
       width: 8;
     },
     {
       type: DOWN,
       text: "1 1/2"
       width: 8;
     }]
 */
Vex.Flow.Bend = (function() {
  function Bend(text, release, phrase) {
    if (arguments.length > 0) this.init(text, release, phrase);
  }

  Bend.UP = 0;
  Bend.DOWN = 1;

  var Modifier = Vex.Flow.Modifier;
  Vex.Inherit(Bend, Modifier, {
    init: function(text, release, phrase) {
      var superclass = Vex.Flow.Bend.superclass;
      superclass.init.call(this);

      this.text = text;
      this.x_shift = 0;
      this.release = release || false;
      this.font = "10pt Arial";
      this.render_options = {
        line_width: 1.5,
        line_style: "#777777",
        bend_width: 8,
        release_width: 8
      };

      if (phrase) {
        this.phrase = phrase;
      } else {
        // Backward compatibility
        this.phrase = [{type: Bend.UP, text: this.text}];
        if (this.release) this.phrase.push({type: Bend.DOWN, text: ""});
      }

      this.updateWidth();
    },

    setXShift: function(value) {
      this.x_shift = value;
      this.updateWidth();
    },

    setFont: function(font) { this.font = font; return this; },

    getCategory: function() { return "bends"; },

    getText: function() { return this.text; },

    updateWidth: function() {
      var that = this;

      function measure_text(text) {
        var text_width;
        if (that.context) {
          text_width = that.context.measureText(text).width;
        } else {
          text_width = Vex.Flow.textWidth(text);
        }

        return text_width;
      }

      var total_width = 0;
      for (var i=0; i<this.phrase.length; ++i) {
        var bend = this.phrase[i];
        if ('width' in bend) {
          total_width += bend.width;
        } else {
          var additional_width = (bend.type == Bend.UP) ?
            this.render_options.bend_width : this.render_options.release_width;

          bend.width = Vex.Max(additional_width, measure_text(bend.text)) + 3;
          bend.draw_width = bend.width / 2;
          total_width += bend.width;
        }
      }

      this.setWidth(total_width + this.x_shift);
      return this;
    },

    draw: function() {
        if (!this.context) throw new Vex.RERR("NoContext",
        "Can't draw bend without a context.");
      if (!(this.note && (this.index != null))) throw new Vex.RERR("NoNoteForBend",
        "Can't draw bend without a note or index.");

      var start = this.note.getModifierStartXY(Modifier.Position.RIGHT,
          this.index);
      start.x += 3;
      start.y += 0.5;
      var x_shift = this.x_shift;

      var ctx = this.context;
      var bend_height = this.note.getStave().getYForTopText(this.text_line) + 3;
      var annotation_y = this.note.getStave().getYForTopText(this.text_line) - 1;
      var that = this;

      function renderBend(x, y, width, height) {
        var cp_x = x + width;
        var cp_y = y;

        ctx.save();
        ctx.beginPath();
        ctx.setLineWidth(that.render_options.line_width);
        ctx.setStrokeStyle(that.render_options.line_style);
        ctx.setFillStyle(that.render_options.line_style);
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(cp_x, cp_y, x + width, height);
        ctx.stroke();
        ctx.restore();
      }

      function renderRelease(x, y, width, height) {
        ctx.save();
        ctx.beginPath();
        ctx.setLineWidth(that.render_options.line_width);
        ctx.setStrokeStyle(that.render_options.line_style);
        ctx.setFillStyle(that.render_options.line_style);
        ctx.moveTo(x, height);
        ctx.quadraticCurveTo(
            x + width, height,
            x + width, y);
        ctx.stroke();
        ctx.restore();
      }

      function renderArrowHead(x, y, direction) {
        var width = 4;
        var dir = direction || 1;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - width, y + width * dir);
        ctx.lineTo(x + width, y + width * dir);
        ctx.closePath();
        ctx.fill();
      }

      function renderText(x, text) {
        ctx.save();
        ctx.font = this.font;
        var render_x = x - (ctx.measureText(text).width / 2);
        ctx.fillText(text, render_x, annotation_y);
        ctx.restore();
      }

      var last_bend = null;
      var last_drawn_width = 0;
      for (var i=0; i<this.phrase.length; ++i) {
        var bend = this.phrase[i];
        if (i === 0) bend.draw_width += x_shift;

        last_drawn_width = bend.draw_width + (last_bend?last_bend.draw_width:0) - (i==1?x_shift:0);
        if (bend.type == Bend.UP) {
          if (last_bend && last_bend.type == Bend.UP) {
            renderArrowHead(start.x, bend_height);
          }

          renderBend(start.x, start.y, last_drawn_width, bend_height);
        }

        if (bend.type == Bend.DOWN) {
          if (last_bend && last_bend.type == Bend.UP) {
            renderRelease(start.x, start.y, last_drawn_width, bend_height);
          }

          if (last_bend && last_bend.type == Bend.DOWN) {
            renderArrowHead(start.x, start.y, -1);
            renderRelease(start.x, start.y, last_drawn_width, bend_height);
          }

          if (last_bend == null) {
            last_drawn_width = bend.draw_width;
            renderRelease(start.x, start.y, last_drawn_width, bend_height);
          }
        }

        renderText(start.x + last_drawn_width, bend.text);
        last_bend = bend;
        last_bend.x = start.x;

        start.x += last_drawn_width;
      }

      // Final arrowhead and text
      if (last_bend.type == Bend.UP) {
        renderArrowHead(last_bend.x + last_drawn_width, bend_height);
      } else if (last_bend.type == Bend.DOWN) {
        renderArrowHead(last_bend.x + last_drawn_width, start.y, -1);
      }
    }
  });

  return Bend;
}());
// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements vibratos.

/**
 * @constructor
 */
Vex.Flow.Vibrato = (function() {
  function Vibrato() { this.init(); }

  var Modifier = Vex.Flow.Modifier;
  Vex.Inherit(Vibrato, Modifier, {
    init: function() {
      var superclass = Vex.Flow.Vibrato.superclass;
      superclass.init.call(this);

      this.harsh = false;
      this.position = Vex.Flow.Modifier.Position.RIGHT;
      this.render_options = {
        vibrato_width: 20,
        wave_height: 6,
        wave_width: 4,
        wave_girth: 2
      };

      this.setVibratoWidth(this.render_options.vibrato_width);
    },

    getCategory: function() { return "vibratos"; },
    setHarsh: function(harsh) { this.harsh = harsh; return this; },
    setVibratoWidth: function(width) {
      this.vibrato_width = width;
      this.setWidth(this.vibrato_width);
      return this;
    },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoContext",
        "Can't draw vibrato without a context.");
      if (!this.note) throw new Vex.RERR("NoNoteForVibrato",
        "Can't draw vibrato without an attached note.");

      var start = this.note.getModifierStartXY(Vex.Flow.Modifier.Position.RIGHT,
          this.index);

      var ctx = this.context;
      var that = this;
      var vibrato_width = this.vibrato_width;

      function renderVibrato(x, y) {
        var wave_width = that.render_options.wave_width;
        var wave_girth = that.render_options.wave_girth;
        var wave_height = that.render_options.wave_height;
        var num_waves = vibrato_width / wave_width;

        ctx.beginPath();

        var i;
        if (that.harsh) {
          ctx.moveTo(x, y + wave_girth + 1);
          for (i = 0; i < num_waves / 2; ++i) {
            ctx.lineTo(x + wave_width, y - (wave_height / 2));
            x += wave_width;
            ctx.lineTo(x + wave_width, y + (wave_height / 2));
            x += wave_width;
          }
          for (i = 0; i < num_waves / 2; ++i) {
            ctx.lineTo(x - wave_width, (y - (wave_height / 2)) + wave_girth + 1);
            x -= wave_width;
            ctx.lineTo(x - wave_width, (y + (wave_height / 2)) + wave_girth + 1);
            x -= wave_width;
          }
          ctx.fill();
        } else {
          ctx.moveTo(x, y + wave_girth);
          for (i = 0; i < num_waves / 2; ++i) {
            ctx.quadraticCurveTo(x + (wave_width / 2), y - (wave_height / 2),
              x + wave_width, y);
            x += wave_width;
            ctx.quadraticCurveTo(x + (wave_width / 2), y + (wave_height / 2),
              x + wave_width, y);
            x += wave_width;
          }

          for (i = 0; i < num_waves / 2; ++i) {
            ctx.quadraticCurveTo(
                x - (wave_width / 2),
                (y + (wave_height / 2)) + wave_girth,
                x - wave_width, y + wave_girth);
            x -= wave_width;
            ctx.quadraticCurveTo(
                x - (wave_width / 2),
                (y - (wave_height / 2)) + wave_girth,
                x - wave_width, y + wave_girth);
            x -= wave_width;
          }
          ctx.fill();
        }
      }

      var vx = start.x + this.x_shift;
      var vy = this.note.getStave().getYForTopText(this.text_line) + 2;

      renderVibrato(vx, vy);
    }
  });

  return Vibrato;
}());
// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements text annotations.

/**
 * @constructor
 */
Vex.Flow.Annotation = (function() {
  function Annotation(text) {
    if (arguments.length > 0) this.init(text);
  }

  Annotation.Justify = {
    LEFT: 1,
    CENTER: 2,
    RIGHT: 3,
    CENTER_STEM: 4
  };

  Annotation.VerticalJustify = {
    TOP: 1,
    CENTER: 2,
    BOTTOM: 3,
    CENTER_STEM: 4
  };

  var Modifier = Vex.Flow.Modifier;
  Vex.Inherit(Annotation, Modifier, {
    init: function(text) {
      Annotation.superclass.init.call(this);

      this.note = null;
      this.index = null;
      this.text_line = 0;
      this.text = text;
      this.justification = Annotation.Justify.CENTER;
      this.vert_justification = Annotation.VerticalJustify.TOP;
      this.font = {
        family: "Arial",
        size: 10,
        weight: ""
      };

      this.setWidth(Vex.Flow.textWidth(text));
    },

    getCategory: function() { return "annotations"; },

    setTextLine: function(line) { this.text_line = line; return this; },

    setFont: function(family, size, weight) {
      this.font = { family: family, size: size, weight: weight };
      return this;
    },

    setBottom: function(bottom) {
      if (bottom) {
        this.vert_justification = Annotation.VerticalJustify.BOTTOM;
      } else {
        this.vert_justification = Annotation.VerticalJustify.TOP;
      }
      return this;
    },

    setVerticalJustification: function(vert_justification) {
      this.vert_justification = vert_justification;
      return this;
    },

    getJustification: function() { return this.justification; },

    setJustification: function(justification) {
      this.justification = justification; return this; },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoContext",
        "Can't draw text annotation without a context.");
      if (!this.note) throw new Vex.RERR("NoNoteForAnnotation",
        "Can't draw text annotation without an attached note.");

      var start = this.note.getModifierStartXY(Modifier.Position.ABOVE,
          this.index);

      this.context.save();
      this.context.setFont(this.font.family, this.font.size, this.font.weight);
      var text_width = this.context.measureText(this.text).width;

      // Estimate text height to be the same as the width of an 'm'.
      //
      // This is a hack to work around the inability to measure text height
      // in HTML5 Canvas.
      var text_height = this.context.measureText("m").width;
      var x, y;

      if (this.justification == Annotation.Justify.LEFT) {
        x = start.x;
      } else if (this.justification == Annotation.Justify.RIGHT) {
        x = start.x - text_width;
      } else if (this.justification == Annotation.Justify.CENTER) {
        x = start.x - text_width / 2;
      } else /* CENTER_STEM */ {
        x = this.note.getStemX() - text_width / 2;
      }

      var stem_ext, spacing;
      if (this.note.getStemExtents) {
        stem_ext = this.note.getStemExtents();
        spacing = this.note.stave.options.spacing_between_lines_px;
      }

      if (this.vert_justification == Annotation.VerticalJustify.BOTTOM) {
        y = this.note.stave.getYForBottomText(this.text_line);
        if (stem_ext) {
          y = Vex.Max(y, (stem_ext.baseY) + (spacing * (this.text_line + 2)));
        }
      } else if (this.vert_justification ==
                 Annotation.VerticalJustify.CENTER) {
        var yt = this.note.getYForTopText(this.text_line) - 1;
        var yb = this.note.stave.getYForBottomText(this.text_line);
        y = yt + ( yb - yt ) / 2 + text_height / 2;
      } else if (this.vert_justification ==
                 Annotation.VerticalJustify.TOP) {
        y = this.note.stave.getYForTopText(this.text_line);
        if (stem_ext)
          y = Vex.Min(y, (stem_ext.topY - 5) - (spacing * this.text_line));
      } else /* CENTER_STEM */{
        var extents = this.note.getStemExtents();
        y = extents.topY + ( extents.baseY - extents.topY ) / 2 +
          text_height / 2;
      }

      this.context.fillText(this.text, x, y);
      this.context.restore();
    }
  });

  return Annotation;
}());// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
// Author Larry Kuhns 2011
// This class implements Accents.

/**
 * @constructor
 */
Vex.Flow.Articulation = (function() {
  function Articulation(type) {
    if (arguments.length > 0) this.init(type);
  }

  var Modifier = Vex.Flow.Modifier;
  Vex.Inherit(Articulation, Modifier, {
    init: function(type) {
      Articulation.superclass.init.call(this);

      this.note = null;
      this.index = null;
      this.type = type;
      this.position = Modifier.Position.BELOW;

      this.render_options = {
        font_scale: 38,
        stroke_px: 3,
        stroke_spacing: 10
      };

      this.articulation = Vex.Flow.articulationCodes(this.type);
      if (!this.articulation) throw new Vex.RERR("InvalidArticulation",
         "Articulation not found: '" + this.type + "'");

      this.setWidth(this.articulation.width);
    },

    getCategory: function() {
      return "articulations";
    },

    getPosition: function() {
      return this.position;
    },

    setPosition: function(position) {
      if (position == Modifier.Position.ABOVE ||
          position == Modifier.Position.BELOW)
        this.position = position;
      return this;
    },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoContext",
        "Can't draw Articulation without a context.");
      if (!(this.note && (this.index !== null))) throw new Vex.RERR("NoAttachedNote",
        "Can't draw Articulation without a note and index.");

      var is_on_head = (this.position === Modifier.Position.ABOVE &&
                        this.note.stem_direction === Vex.Flow.StaveNote.STEM_DOWN) ||
                       (this.position === Modifier.Position.BELOW &&
                        this.note.stem_direction === Vex.Flow.StaveNote.STEM_UP);

      var needsLineAdjustment = function(articulation, note_line, line_spacing){
        var offset_direction = (articulation.position === Modifier.Position.ABOVE) ? 1 : -1;

        if(!is_on_head && articulation.note.duration !== "w"){
          // Add stem length, inless it's on a whole note
          note_line += offset_direction * 3.5;
        }
        var articulation_line = note_line + (offset_direction * line_spacing);

        if(articulation_line >= 1 &&
           articulation_line <= 5 &&
           articulation_line % 1 === 0){
          return true;
        }

        return false;
      };

      // Articulations are centered over/under the note head
      var stave = this.note.stave;
      var start = this.note.getModifierStartXY(this.position, this.index);
      var glyph_y = start.y;
      var shiftY = 0;
      var line_spacing = 1;
      var spacing = stave.options.spacing_between_lines_px;
      var top, bottom;

      if (this.note.getStemExtents) {
        var stem_ext = this.note.getStemExtents();
        top = stem_ext.topY;
        bottom = stem_ext.baseY;
        if (this.note.stem_direction === Vex.Flow.StaveNote.STEM_DOWN) {
          top = stem_ext.baseY;
          bottom = stem_ext.topY;
        }
      }

      var is_above = (this.position === Modifier.Position.ABOVE) ? true : false;
      var note_line = this.note.getLineNumber(is_above);

      // Beamed stems are longer than quarter note stems
      if(!is_on_head && this.note.beam)
        line_spacing += 0.5;

      // If articulation will overlap a line, reposition it
      if(needsLineAdjustment(this, note_line, line_spacing))
        line_spacing += 0.5;

      var glyph_y_between_lines;
      if (this.position === Modifier.Position.ABOVE) {
        shiftY = this.articulation.shift_up;
        glyph_y_between_lines = (top - 7) - (spacing * (this.text_line + line_spacing));

        if (this.articulation.between_lines)
          glyph_y = glyph_y_between_lines;
        else
          glyph_y = Vex.Min(stave.getYForTopText(this.text_line) - 3, glyph_y_between_lines);
      } else {
        shiftY = this.articulation.shift_down - 10;

        glyph_y_between_lines = bottom + 10 + spacing * (this.text_line + line_spacing);
        if (this.articulation.between_lines)
          glyph_y = glyph_y_between_lines;
        else
          glyph_y = Vex.Max(stave.getYForBottomText(this.text_line), glyph_y_between_lines);
      }

      var glyph_x = start.x + this.articulation.shift_right;
      glyph_y += shiftY + this.y_shift;

      Vex.Flow.renderGlyph(this.context, glyph_x, glyph_y,
                           this.render_options.font_scale, this.articulation.code);
    }
  });

  return Articulation;
}());// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements varies types of tunings for tablature.

/**
 * @constructor
 */
Vex.Flow.Tuning = (function() {
  function Tuning(tuningString) {
    this.init(tuningString);
  }

  Tuning.names = {
    "standard": "E/5,B/4,G/4,D/4,A/3,E/3",
    "dagdad": "D/5,A/4,G/4,D/4,A/3,D/3",
    "dropd": "E/5,B/4,G/4,D/4,A/3,D/3",
    "eb": "Eb/5,Bb/4,Gb/4,Db/4,Ab/3,Db/3"
  };

  Tuning.prototype = {
    init: function(tuningString) {
      // Default to standard tuning.
      this.setTuning(tuningString || "E/5,B/4,G/4,D/4,A/3,E/3");
    },

    noteToInteger: function(noteString) {
      return Vex.Flow.keyProperties(noteString).int_value;
    },

    setTuning: function(noteString) {
      if (Vex.Flow.Tuning.names[noteString])
        noteString = Vex.Flow.Tuning.names[noteString];

      this.tuningString = noteString;
      this.tuningValues = [];
      this.numStrings = 0;

      var keys = noteString.split(/\s*,\s*/);
      if (keys.length === 0)
        throw new Vex.RERR("BadArguments", "Invalid tuning string: " + noteString);

      this.numStrings = keys.length;
      for (var i = 0; i < this.numStrings; ++i) {
        this.tuningValues[i] = this.noteToInteger(keys[i]);
      }
    },

    getValueForString: function(stringNum) {
      var s = parseInt(stringNum, 10);
      if (s < 1 || s > this.numStrings)
        throw new Vex.RERR("BadArguments", "String number must be between 1 and " +
            this.numStrings + ": " + stringNum);

      return this.tuningValues[s - 1];
    },

    getValueForFret: function(fretNum, stringNum) {
      var stringValue = this.getValueForString(stringNum);
      var f = parseInt(fretNum, 10);

      if (f < 0) {
        throw new Vex.RERR("BadArguments", "Fret number must be 0 or higher: " +
            fretNum);
      }

      return stringValue + f;
    },

    getNoteForFret: function(fretNum, stringNum) {
      var noteValue = this.getValueForFret(fretNum, stringNum);

      var octave = Math.floor(noteValue / 12);
      var value = noteValue % 12;

      return Vex.Flow.integerToNote(value) + "/" + octave;
    }
  };

  return Tuning;
}());
// VexFlow - Music Engraving for HTML5
//
// A base class for stave modifiers (e.g. clefs, key signatures)
//


/**
 * @constructor
 */
Vex.Flow.StaveModifier = (function() {
  function StaveModifier() {
    this.init();
  }

  StaveModifier.prototype = {
    init: function() {
      this.padding = 10;
    },

    getCategory: function() {return "";},
    makeSpacer: function(padding) {
      return {
        getContext: function() {return true;},
        setStave: function() {},
        renderToStave: function() {},
        getMetrics: function() {
          return {width: padding};
        }
      };
    },

    placeGlyphOnLine: function(glyph, stave, line) {
      glyph.setYShift(stave.getYForLine(line) - stave.getYForGlyphs());
    },

    setPadding: function(padding) {
      this.padding = padding;
    },

    addToStave: function(stave, firstGlyph) {
      if (!firstGlyph) {
        stave.addGlyph(this.makeSpacer(this.padding));
      }

      this.addModifier(stave);
      return this;
    },

    addModifier: function() {
      throw new Vex.RERR("MethodNotImplemented",
          "addModifier() not implemented for this stave modifier.");
    }
  };

  return StaveModifier;
}());

// Vex Flow Notation
// Implements key signatures
//
// Requires vex.js.

/**
 * @constructor
 */
Vex.Flow.KeySignature = (function() {
  function KeySignature(keySpec) {
    if (arguments.length > 0) this.init(keySpec);
  }

  Vex.Inherit(KeySignature, Vex.Flow.StaveModifier, {
    init: function(key_spec) {
      KeySignature.superclass.init();

      this.glyphFontScale = 38; // TODO(0xFE): Should this match StaveNote?
      this.accList = Vex.Flow.keySignature(key_spec);
    },

    addAccToStave: function(stave, acc) {
      var glyph = new Vex.Flow.Glyph(acc.glyphCode, this.glyphFontScale);
      this.placeGlyphOnLine(glyph, stave, acc.line);
      stave.addGlyph(glyph);
    },

    addModifier: function(stave) {
      this.convertAccLines(stave.clef, this.accList[0].glyphCode);
      for (var i = 0; i < this.accList.length; ++i) {
        this.addAccToStave(stave, this.accList[i]);
      }
    },

    addToStave: function(stave, firstGlyph) {
      if (this.accList.length === 0)
        return this;

      if (!firstGlyph) {
        stave.addGlyph(this.makeSpacer(this.padding));
      }

      this.addModifier(stave);
      return this;
    },

    convertAccLines: function(clef, code) {
      var offset = 0.0; // if clef === "treble"
      var tenorSharps;
      var isTenorSharps = ((clef === "tenor") && (code === "v18")) ? true : false;

      switch (clef) {
        case "bass":
          offset = 1;
          break;
        case "alto":
          offset = 0.5;
          break;
        case "tenor":
          if (!isTenorSharps) {
            offset = -0.5;
          }
          break;
      }

      // Special-case for TenorSharps
      var i;
      if (isTenorSharps) {
        tenorSharps = [3, 1, 2.5, 0.5, 2, 0, 1.5];
        for (i = 0; i < this.accList.length; ++i) {
          this.accList[i].line = tenorSharps[i];
        }
      }
      else {
        if (clef != "treble") {
          for (i = 0; i < this.accList.length; ++i) {
            this.accList[i].line += offset;
          }
        }
      }
    }
  });

  return KeySignature;
}());// Vex Flow Notation
// Implements time signatures glyphs for staffs
// See tables.js for the internal time signatures
// representation
//

/**
 * @param {string} timeSpec time signature, i.e. "4/4"
 * @param {number} [customPadding] custom padding when using multi-stave/multi-instrument setting
 * to align key/time signature (in pixels), optional
 * @constructor
 */
Vex.Flow.TimeSignature = (function() {
  function TimeSignature(timeSpec, customPadding) {
    if (arguments.length > 0) this.init(timeSpec, customPadding);
  }

  TimeSignature.glyphs = {
    "C": {
      code: "v41",
      point: 40,
      line: 2
    },
    "C|": {
      code: "vb6",
      point: 40,
      line: 2
    }
  };

  Vex.Inherit(TimeSignature, Vex.Flow.StaveModifier, {
    init: function(timeSpec, customPadding) {
      TimeSignature.superclass.init();
       var padding = customPadding || 15;

      this.setPadding(padding);
      this.point = 40;
      this.topLine = 2;
      this.bottomLine = 4;
      this.timeSig = this.parseTimeSpec(timeSpec);
    },

    parseTimeSpec: function(timeSpec) {
      if (timeSpec == "C" || timeSpec == "C|") {
        var glyphInfo = TimeSignature.glyphs[timeSpec];
        return {num: false, line: glyphInfo.line,
          glyph: new Vex.Flow.Glyph(glyphInfo.code, glyphInfo.point)};
      }

      var topNums = [];
      var i, c;
      for (i = 0; i < timeSpec.length; ++i) {
        c = timeSpec.charAt(i);
        if (c == "/") {
          break;
        }
        else if (/[0-9]/.test(c)) {
          topNums.push(c);
        }
        else {
          throw new Vex.RERR("BadTimeSignature",
              "Invalid time spec: " + timeSpec);
        }
      }

      if (i === 0) {
        throw new Vex.RERR("BadTimeSignature",
              "Invalid time spec: " + timeSpec);
      }

      // skip the "/"
      ++i;

      if (i == timeSpec.length) {
        throw new Vex.RERR("BadTimeSignature",
              "Invalid time spec: " + timeSpec);
      }


      var botNums = [];
      for (; i < timeSpec.length; ++i) {
        c = timeSpec.charAt(i);
        if (/[0-9]/.test(c)) {
          botNums.push(c);
        }
        else {
          throw new Vex.RERR("BadTimeSignature",
              "Invalid time spec: " + timeSpec);
        }
      }


      return {num: true, glyph: this.makeTimeSignatureGlyph(topNums, botNums)};
    },

    makeTimeSignatureGlyph: function(topNums, botNums) {
      var glyph = new Vex.Flow.Glyph("v0", this.point);
      glyph["topGlyphs"] = [];
      glyph["botGlyphs"] = [];

      var topWidth = 0;
      var i, num;
      for (i = 0; i < topNums.length; ++i) {
        num = topNums[i];
        var topGlyph = new Vex.Flow.Glyph("v" + num, this.point);

        glyph.topGlyphs.push(topGlyph);
        topWidth += topGlyph.getMetrics().width;
      }

      var botWidth = 0;
      for (i = 0; i < botNums.length; ++i) {
        num = botNums[i];
        var botGlyph = new Vex.Flow.Glyph("v" + num, this.point);

        glyph.botGlyphs.push(botGlyph);
        botWidth += botGlyph.getMetrics().width;
      }

      var width = (topWidth > botWidth ? topWidth : botWidth);
      var xMin = glyph.getMetrics().x_min;

      glyph.getMetrics = function() {
        return {
          x_min: xMin,
          x_max: xMin + width,
          width: width
        };
      };

      var topStartX = (width - topWidth) / 2.0;
      var botStartX = (width - botWidth) / 2.0;

      var that = this;
      glyph.renderToStave = function(x) {
        var start_x = x + topStartX;
        var i, g;
        for (i = 0; i < this.topGlyphs.length; ++i) {
          g = this.topGlyphs[i];
          Vex.Flow.Glyph.renderOutline(this.context, g.metrics.outline,
              g.scale, start_x + g.x_shift, this.stave.getYForLine(that.topLine));
          start_x += g.getMetrics().width;
        }

        start_x = x + botStartX;
        for (i = 0; i < this.botGlyphs.length; ++i) {
          g = this.botGlyphs[i];
          that.placeGlyphOnLine(g, this.stave, g.line);
          Vex.Flow.Glyph.renderOutline(this.context, g.metrics.outline,
              g.scale, start_x + g.x_shift, this.stave.getYForLine(that.bottomLine));
          start_x += g.getMetrics().width;
        }
      };

      return glyph;
    },

    addModifier: function(stave) {
      if (!this.timeSig.num) {
        this.placeGlyphOnLine(this.timeSig.glyph, stave, this.timeSig.line);
      }
      stave.addGlyph(this.timeSig.glyph);
    }
  });

  return TimeSignature;
}());
// Vex Flow Notation.
// Copyright Mohit Muthanna Cheppudira 2013.
// Implements clefs.

Vex.Flow.Clef = (function() {
  function Clef(clef) {
    if (arguments.length > 0) this.init(clef); 
  }

  Clef.types = {
    "treble": {
      code: "v83",
      point: 40,
      line: 3
    },
    "bass": {
      code: "v79",
      point: 40,
      line: 1
    },
    "alto": {
      code: "vad",
      point: 40,
      line: 2
    },
    "tenor": {
      code: "vad",
      point: 40,
      line: 1
    },
    "percussion": {
      code: "v59",
      point: 40,
      line: 2
    }
  };

  Vex.Inherit(Clef, Vex.Flow.StaveModifier, {
    init: function(clef) {
      var superclass = Vex.Flow.Clef.superclass;
      superclass.init.call(this);

      this.clef = Vex.Flow.Clef.types[clef];
    },

    addModifier: function(stave) {
      var glyph = new Vex.Flow.Glyph(this.clef.code, this.clef.point);
      this.placeGlyphOnLine(glyph, stave, this.clef.line);
      stave.addGlyph(glyph);
    }
  });

  return Clef;
}());// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements some standard music theory routines.
//
// requires: vex.js   (Vex)
// requires: flow.js  (Vex.Flow)

/**
 * @constructor
 */
Vex.Flow.Music = (function() {
  function Music() {
    this.init();
  }

  Music.NUM_TONES = 12;
  Music.roots = [ "c", "d", "e", "f", "g", "a", "b" ];
  Music.root_values = [ 0, 2, 4, 5, 7, 9, 11 ];
  Music.root_indices = {
    "c": 0,
    "d": 1,
    "e": 2,
    "f": 3,
    "g": 4,
    "a": 5,
    "b": 6
  };

  Music.canonical_notes = [
    "c", "c#", "d", "d#",
    "e", "f", "f#", "g",
    "g#", "a", "a#", "b"
  ];

  Music.diatonic_intervals = [
    "unison", "m2", "M2", "m3", "M3",
    "p4", "dim5", "p5", "m6", "M6",
    "b7", "M7", "octave"
  ];

  Music.diatonic_accidentals = {
    "unison": {note: 0, accidental: 0},
    "m2":     {note: 1, accidental: -1},
    "M2":     {note: 1, accidental: 0},
    "m3":     {note: 2, accidental: -1},
    "M3":     {note: 2, accidental: 0},
    "p4":     {note: 3, accidental: 0},
    "dim5":   {note: 4, accidental: -1},
    "p5":     {note: 4, accidental: 0},
    "m6":     {note: 5, accidental: -1},
    "M6":     {note: 5, accidental: 0},
    "b7":     {note: 6, accidental: -1},
    "M7":     {note: 6, accidental: 0},
    "octave": {note: 7, accidental: 0}
  };

  Music.intervals = {
    "u":  0, "unison": 0,
    "m2": 1, "b2": 1, "min2": 1, "S": 1, "H": 1,
    "2": 2, "M2": 2, "maj2": 2, "T": 2, "W": 2,
    "m3": 3, "b3": 3, "min3": 3,
    "M3": 4, "3": 4, "maj3": 4,
    "4":  5, "p4":  5,
    "#4": 6, "b5": 6, "aug4": 6, "dim5": 6,
    "5":  7, "p5":  7,
    "#5": 8, "b6": 8, "aug5": 8,
    "6":  9, "M6":  9, "maj6": 9,
    "b7": 10, "m7": 10, "min7": 10, "dom7": 10,
    "M7": 11, "maj7": 11,
    "8": 12, "octave": 12
  };

  Music.scales = {
    major: [2, 2, 1, 2, 2, 2, 1],
    dorian: [2, 1, 2, 2, 2, 1, 2],
    mixolydian: [2, 2, 1, 2, 2, 1, 2],
    minor: [2, 1, 2, 2, 1, 2, 2]
  };

  Music.accidentals = [ "bb", "b", "n", "#", "##" ];

  Music.noteValues = {
    'c':   { root_index: 0, int_val: 0 },
    'cn':  { root_index: 0, int_val: 0 },
    'c#':  { root_index: 0, int_val: 1 },
    'c##': { root_index: 0, int_val: 2 },
    'cb':  { root_index: 0, int_val: 11 },
    'cbb': { root_index: 0, int_val: 10 },
    'd':   { root_index: 1, int_val: 2 },
    'dn':  { root_index: 1, int_val: 2 },
    'd#':  { root_index: 1, int_val: 3 },
    'd##': { root_index: 1, int_val: 4 },
    'db':  { root_index: 1, int_val: 1 },
    'dbb': { root_index: 1, int_val: 0 },
    'e':   { root_index: 2, int_val: 4 },
    'en':  { root_index: 2, int_val: 4 },
    'e#':  { root_index: 2, int_val: 5 },
    'e##': { root_index: 2, int_val: 6 },
    'eb':  { root_index: 2, int_val: 3 },
    'ebb': { root_index: 2, int_val: 2 },
    'f':   { root_index: 3, int_val: 5 },
    'fn':  { root_index: 3, int_val: 5 },
    'f#':  { root_index: 3, int_val: 6 },
    'f##': { root_index: 3, int_val: 7 },
    'fb':  { root_index: 3, int_val: 4 },
    'fbb': { root_index: 3, int_val: 3 },
    'g':   { root_index: 4, int_val: 7 },
    'gn':  { root_index: 4, int_val: 7 },
    'g#':  { root_index: 4, int_val: 8 },
    'g##': { root_index: 4, int_val: 9 },
    'gb':  { root_index: 4, int_val: 6 },
    'gbb': { root_index: 4, int_val: 5 },
    'a':   { root_index: 5, int_val: 9 },
    'an':  { root_index: 5, int_val: 9 },
    'a#':  { root_index: 5, int_val: 10 },
    'a##': { root_index: 5, int_val: 11 },
    'ab':  { root_index: 5, int_val: 8 },
    'abb': { root_index: 5, int_val: 7 },
    'b':   { root_index: 6, int_val: 11 },
    'bn':  { root_index: 6, int_val: 11 },
    'b#':  { root_index: 6, int_val: 0 },
    'b##': { root_index: 6, int_val: 1 },
    'bb':  { root_index: 6, int_val: 10 },
    'bbb': { root_index: 6, int_val: 9 }
  };

  Music.prototype = {
    init: function() {},

    isValidNoteValue: function(note) {
      if (note == null || note < 0 || note >= Vex.Flow.Music.NUM_TONES)
        return false;
      return true;
    },

    isValidIntervalValue: function(interval) {
      return this.isValidNoteValue(interval);
    },

    getNoteParts: function(noteString) {
      if (!noteString || noteString.length < 1)
        throw new Vex.RERR("BadArguments", "Invalid note name: " + noteString);

      if (noteString.length > 3)
        throw new Vex.RERR("BadArguments", "Invalid note name: " + noteString);

      var note = noteString.toLowerCase();

      var regex = /^([cdefgab])(b|bb|n|#|##)?$/;
      var match = regex.exec(note);

      if (match != null) {
        var root = match[1];
        var accidental = match[2];

        return {
          'root': root,
          'accidental': accidental
        };
      } else {
        throw new Vex.RERR("BadArguments", "Invalid note name: " + noteString);
      }
    },

    getKeyParts: function(keyString) {
      if (!keyString || keyString.length < 1)
        throw new Vex.RERR("BadArguments", "Invalid key: " + keyString);

      var key = keyString.toLowerCase();

      // Support Major, Minor, Melodic Minor, and Harmonic Minor key types.
      var regex = /^([cdefgab])(b|#)?(mel|harm|m|M)?$/;
      var match = regex.exec(key);

      if (match != null) {
        var root = match[1];
        var accidental = match[2];
        var type = match[3];

        // Unspecified type implies major
        if (!type) type = "M";

        return {
          'root': root,
          'accidental': accidental,
          'type': type
        };
      } else {
        throw new Vex.RERR("BadArguments", "Invalid key: " + keyString);
      }
    },

    getNoteValue: function(noteString) {
      var value = Music.noteValues[noteString];
      if (value == null)
        throw new Vex.RERR("BadArguments", "Invalid note name: " + noteString);

      return value.int_val;
    },

    getIntervalValue: function(intervalString) {
      var value = Music.intervals[intervalString];
      if (value == null)
        throw new Vex.RERR("BadArguments",
                           "Invalid interval name: " + intervalString);

      return value;
    },

    getCanonicalNoteName: function(noteValue) {
      if (!this.isValidNoteValue(noteValue))
        throw new Vex.RERR("BadArguments",
                           "Invalid note value: " + noteValue);

      return Music.canonical_notes[noteValue];
    },

    getCanonicalIntervalName: function(intervalValue) {
      if (!this.isValidIntervalValue(intervalValue))
        throw new Vex.RERR("BadArguments",
                           "Invalid interval value: " + intervalValue);

      return Music.diatonic_intervals[intervalValue];
    },

    /* Given a note, interval, and interval direction, product the
     * relative note.
     */
    getRelativeNoteValue: function(noteValue, intervalValue, direction) {
      if (direction == null) direction = 1;
      if (direction != 1 && direction != -1)
        throw new Vex.RERR("BadArguments", "Invalid direction: " + direction);

      var sum = (noteValue + (direction * intervalValue)) % Music.NUM_TONES;
      if (sum < 0) sum += Music.NUM_TONES;

      return sum;
    },

    getRelativeNoteName: function(root, noteValue) {
      var parts = this.getNoteParts(root);
      var rootValue = this.getNoteValue(parts.root);
      var interval = noteValue - rootValue;

      if (Math.abs(interval) > Music.NUM_TONES - 3) {
        var multiplier = 1;
        if (interval > 0 ) multiplier = -1;

        // Possibly wrap around. (Add +1 for modulo operator)
        var reverse_interval = (((noteValue + 1) + (rootValue + 1)) %
          Music.NUM_TONES) * multiplier;

        if (Math.abs(reverse_interval) > 2) {
          throw new Vex.RERR("BadArguments", "Notes not related: " + root + ", " +
                            noteValue);
        } else {
          interval = reverse_interval;
        }
      }

      if (Math.abs(interval) > 2)
          throw new Vex.RERR("BadArguments", "Notes not related: " + root + ", " +
                            noteValue);

      var relativeNoteName = parts.root;
      var i;
      if (interval > 0) {
        for (i = 1; i <= interval; ++i)
          relativeNoteName += "#";
      } else if (interval < 0) {
        for (i = -1; i >= interval; --i)
          relativeNoteName += "b";
      }

      return relativeNoteName;
    },

    /* Return scale tones, given intervals. Each successive interval is
     * relative to the previous one, e.g., Major Scale:
     *
     *   TTSTTTS = [2,2,1,2,2,2,1]
     *
     * When used with key = 0, returns C scale (which is isomorphic to
     * interval list).
     */
    getScaleTones: function(key, intervals) {
      var tones = [];
      tones.push(key);

      var nextNote = key;
      for (var i = 0; i < intervals.length; ++i) {
        nextNote = this.getRelativeNoteValue(nextNote,
                                             intervals[i]);
        if (nextNote != key) tones.push(nextNote);
      }

      return tones;
    },

    /* Returns the interval of a note, given a diatonic scale.
     *
     * E.g., Given the scale C, and the note E, returns M3
     */
    getIntervalBetween: function(note1, note2, direction) {
      if (direction == null) direction = 1;
      if (direction != 1 && direction != -1)
        throw new Vex.RERR("BadArguments", "Invalid direction: " + direction);
      if (!this.isValidNoteValue(note1) || !this.isValidNoteValue(note2))
        throw new Vex.RERR("BadArguments",
                           "Invalid notes: " + note1 + ", " + note2);

      var difference;
      if (direction == 1)
        difference = note2 - note1;
      else
        difference = note1 - note2;

      if (difference < 0) difference += Music.NUM_TONES;
      return difference;
    }
  };

  return Music;
}());
// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements diatonic key management.
//
// requires: vex.js   (Vex)
// requires: flow.js  (Vex.Flow)
// requires: music.js (Vex.Flow.Music)

/**
 * @constructor
 */
Vex.Flow.KeyManager = (function() {
  function KeyManager(key) {
    this.init(key);
  }

  KeyManager.scales = {
    "M": Vex.Flow.Music.scales.major,
    "m": Vex.Flow.Music.scales.minor
  };

  KeyManager.prototype = {
    init: function(key) {
      this.music = new Vex.Flow.Music();
      this.setKey(key);
    },

    setKey: function(key) {
      this.key = key;
      this.reset();
      return this;
    },

    getKey: function() { return this.key; },

    reset: function() {
      this.keyParts = this.music.getKeyParts(this.key);

      this.keyString = this.keyParts.root;
      if (this.keyParts.accidental) this.keyString += this.keyParts.accidental;

      var is_supported_type = KeyManager.scales[this.keyParts.type];
      if (!is_supported_type)
        throw new Vex.RERR("BadArguments", "Unsupported key type: " + this.key);

      this.scale = this.music.getScaleTones(
          this.music.getNoteValue(this.keyString),
          Vex.Flow.KeyManager.scales[this.keyParts.type]);

      this.scaleMap = {};
      this.scaleMapByValue = {};
      this.originalScaleMapByValue = {};

      var noteLocation = Vex.Flow.Music.root_indices[this.keyParts.root];

      for (var i = 0; i < Vex.Flow.Music.roots.length; ++i) {
        var index = (noteLocation + i) % Vex.Flow.Music.roots.length;
        var rootName = Vex.Flow.Music.roots[index];

        var noteName = this.music.getRelativeNoteName(rootName, this.scale[i]);
        this.scaleMap[rootName] = noteName;
        this.scaleMapByValue[this.scale[i]] = noteName;
        this.originalScaleMapByValue[this.scale[i]] = noteName;
      }

      return this;
    },

    getAccidental: function(key) {
      var root = this.music.getKeyParts(key).root;
      var parts = this.music.getNoteParts(this.scaleMap[root]);

      return {
        note: this.scaleMap[root],
        accidental: parts.accidental
      };
    },

    selectNote: function(note) {
      note = note.toLowerCase();
      var parts = this.music.getNoteParts(note);

      // First look for matching note in our altered scale
      var scaleNote = this.scaleMap[parts.root];
      var modparts = this.music.getNoteParts(scaleNote);

      if (scaleNote == note) return {
        "note": scaleNote,
        "accidental": parts.accidental,
        "change": false
      };

      // Then search for a note of equivalent value in our altered scale
      var valueNote = this.scaleMapByValue[this.music.getNoteValue(note)];
      if (valueNote != null) {
        return {
          "note": valueNote,
          "accidental": this.music.getNoteParts(valueNote).accidental,
          "change": false
        };
      }

      // Then search for a note of equivalent value in the original scale
      var originalValueNote = this.originalScaleMapByValue[
        this.music.getNoteValue(note)];
      if (originalValueNote != null) {
        this.scaleMap[modparts.root] = originalValueNote;
        delete this.scaleMapByValue[this.music.getNoteValue(scaleNote)];
        this.scaleMapByValue[this.music.getNoteValue(note)] = originalValueNote;
        return {
          "note": originalValueNote,
          "accidental": this.music.getNoteParts(originalValueNote).accidental,
          "change": true
        };
      }

      // Then try to unmodify a currently modified note.
      if (modparts.root == note) {
        delete this.scaleMapByValue[
          this.music.getNoteValue(this.scaleMap[parts.root])];
        this.scaleMapByValue[this.music.getNoteValue(modparts.root)] =
          modparts.root;
        this.scaleMap[modparts.root] = modparts.root;
        return {
          "note": modparts.root,
          "accidental": null,
          "change": true
        };
      }

      // Last resort -- shitshoot
      delete this.scaleMapByValue[
        this.music.getNoteValue(this.scaleMap[parts.root])];
      this.scaleMapByValue[this.music.getNoteValue(note)] = note;

      delete this.scaleMap[modparts.root];
      this.scaleMap[modparts.root] = note;

      return {
        "note": note,
        "accidental": parts.accidental,
        "change": true
      };
    }
  };

  return KeyManager;
}());
// Vex Flow
// Mohit Muthanna <mohit@muthanna.com>
//
// Support for different rendering contexts: Canvas, Raphael
//
// Copyright Mohit Cheppudira 2010

/* global document: false */

Vex.Flow.Renderer = (function() {
  function Renderer(sel, backend) {
    if (arguments.length > 0) this.init(sel, backend);
  }

  Renderer.Backends = {
    CANVAS: 1,
    RAPHAEL: 2,
    SVG: 3,
    VML: 4
  };

  //End of line types
  Renderer.LineEndType = {
      NONE: 1,        // No leg
      UP: 2,          // Upward leg
      DOWN: 3         // Downward leg
  };

  Renderer.buildContext = function(sel,
      backend, width, height, background) {
    var renderer = new Renderer(sel, backend);
    if (width && height) { renderer.resize(width, height); }

    if (!background) background = "#eed";
    var ctx = renderer.getContext();
    ctx.setBackgroundFillStyle(background);
    return ctx;
  };

  Renderer.getCanvasContext = function(sel, width, height, background) {
    return Renderer.buildContext(sel, Renderer.Backends.CANVAS,
        width, height, background);
  };

  Renderer.getRaphaelContext = function(sel, width, height, background) {
    return Renderer.buildContext(sel, Renderer.Backends.RAPHAEL,
        width, height, background);
  };

  Renderer.bolsterCanvasContext = function(ctx) {
    ctx.clear = function() {
      ctx.clearRect(-10000, -10000, 20000, 20000);
    };
    ctx.setFont = function(family, size, weight) {
      this.font = (weight || "") + " " + size + "pt " + family;
      return this;
    };
    ctx.setFillStyle = function(style) {
      this.fillStyle = style;
      return this;
    };
    ctx.setBackgroundFillStyle = function(style) {
      this.background_fillStyle = style;
      return this;
    };
    ctx.setStrokeStyle = function(style) {
      this.strokeStyle = style;
      return this;
    };
    ctx.setShadowColor = function(style) {
      this.shadowColor = style;
      return this;
    };
    ctx.setShadowBlur = function(blur) {
      this.shadowBlur = blur;
      return this;
    };
    ctx.setLineWidth = function(width) {
      this.lineWidth = width;
      return this;
    };
    return ctx;
  };

  //Draw a dashed line (horizontal, vertical or diagonal
  //dashPattern = [3,3] draws a 3 pixel dash followed by a three pixel space.
  //setting the second number to 0 draws a solid line.
  Renderer.drawDashedLine = function(context, fromX, fromY, toX, toY, dashPattern) {
    context.beginPath();

    var dx = toX - fromX;
    var dy = toY - fromY;
    var angle = Math.atan2(dy, dx);
    var x = fromX;
    var y = fromY;
    context.moveTo(fromX, fromY);
    var idx = 0;
    var draw = true;
    while (!((dx < 0 ? x <= toX : x >= toX) && (dy < 0 ? y <= toY : y >= toY))) {
      var dashLength = dashPattern[idx++ % dashPattern.length];
      var nx = x + (Math.cos(angle) * dashLength);
      x = dx < 0 ? Math.max(toX, nx) : Math.min(toX, nx);
      var ny = y + (Math.sin(angle) * dashLength);
      y = dy < 0 ? Math.max(toY, ny) : Math.min(toY, ny);
      if (draw) {
        context.lineTo(x, y);
      } else {
        context.moveTo(x, y);
      }
        draw = !draw;
    }

    context.closePath();
    context.stroke();
  };

  Renderer.prototype = {
    init: function(sel, backend) {
      // Verify selector
      this.sel = sel;
      if (!this.sel) throw new Vex.RERR("BadArgument",
          "Invalid selector for renderer.");

      // Get element from selector
      this.element = document.getElementById(sel);
      if (!this.element) this.element = sel;

      // Verify backend and create context
      this.ctx = null;
      this.paper = null;
      this.backend = backend;
      if (this.backend == Renderer.Backends.CANVAS) {
        // Create context.
        if (!this.element.getContext) throw new Vex.RERR("BadElement",
          "Can't get canvas context from element: " + sel);
        this.ctx = Renderer.bolsterCanvasContext(
            this.element.getContext('2d'));
      } else if (this.backend == Renderer.Backends.RAPHAEL) {
        this.ctx = new Vex.Flow.RaphaelContext(this.element);
      } else {
        throw new Vex.RERR("InvalidBackend",
          "No support for backend: " + this.backend);
      }
    },

    resize: function(width, height) {
      if (this.backend == Renderer.Backends.CANVAS) {
        if (!this.element.getContext) throw new Vex.RERR("BadElement",
          "Can't get canvas context from element: " + this.sel);
        this.element.width = width;
        this.element.height = height;
        this.ctx = Renderer.bolsterCanvasContext(
            this.element.getContext('2d'));
      } else {
        this.ctx.resize(width, height);
      }

      return this;
    },

    getContext: function() { return this.ctx; }
  };

  return Renderer;
}());


// Vex Flow
// Mohit Muthanna <mohit@muthanna.com>
//
// A rendering context for the Raphael backend.
//
// Copyright Mohit Cheppudira 2010

/** @constructor */
Vex.Flow.RaphaelContext = (function() {
  function RaphaelContext(element) {
    if (arguments.length > 0) this.init(element);
  }

  RaphaelContext.prototype = {
    init: function(element) {
      this.element = element;
      this.paper = Raphael(element);
      this.path = "";
      this.pen = {x: 0, y: 0};
      this.lineWidth = 1.0;
      this.state = {
        scale: { x: 1, y: 1 },
        font_family: "Arial",
        font_size: 8,
        font_weight: 800
      };

      this.attributes = {
        "stroke-width": 0.3,
        "fill": "black",
        "stroke": "black",
        "font": "10pt Arial"
      };

      this.background_attributes = {
        "stroke-width": 0,
        "fill": "white",
        "stroke": "white",
        "font": "10pt Arial"
      };

      this.shadow_attributes = {
        width: 0,
        color: "black"
      };

      this.state_stack= [];
    },

    setFont: function(family, size, weight) {
      this.state.font_family = family;
      this.state.font_size = size;
      this.state.font_weight = weight;
      this.attributes.font = (this.state.font_weight || "") + " " +
        (this.state.font_size * this.state.scale.x) + "pt " +
        this.state.font_family;
      return this;
    },

    setFillStyle: function(style) {
      this.attributes.fill = style;
      return this;
    },

    setBackgroundFillStyle: function(style) {
      this.background_attributes.fill = style;
      this.background_attributes.stroke = style;
      return this;
    },

    setStrokeStyle: function(style) {
      this.attributes.stroke = style;
      return this;
    },

    setShadowColor: function(style) {
      this.shadow_attributes.color = style;
      return this;
    },

    setShadowBlur: function(blur) {
      this.shadow_attributes.width = blur;
      return this;
    },

    setLineWidth: function(width) {
      this.attributes["stroke-width"] = width;
      this.lineWidth = width;
    },

    scale: function(x, y) {
      this.state.scale = { x: x, y: y };
      this.attributes.scale = x + "," + y + ",0,0";
      this.attributes.font = this.state.font_size * this.state.scale.x + "pt " +
        this.state.font_family;
      this.background_attributes.scale = x + "," + y + ",0,0";
      this.background_attributes.font = this.state.font_size *
        this.state.scale.x + "pt " +
        this.state.font_family;
      return this;
    },

    clear: function() { this.paper.clear(); },

    resize: function(width, height) {
      this.element.style.width = width;
      this.paper.setSize(width, height);
      return this;
    },

    rect: function(x, y, width, height) {
      if (height < 0) {
        y += height;
        height = -height;
      }

      this.paper.rect(x, y, width - 0.5, height - 0.5).
        attr(this.attributes).
        attr("fill", "none").
        attr("stroke-width", this.lineWidth); return this;
    },

    fillRect: function(x, y, width, height) {
      if (height < 0) {
        y += height;
        height = -height;
      }

      this.paper.rect(x, y, width - 0.5, height - 0.5).
        attr(this.attributes);
      return this;
    },

    clearRect: function(x, y, width, height) {
      if (height < 0) {
        y += height;
        height = -height;
      }

      this.paper.rect(x, y, width - 0.5, height - 0.5).
        attr(this.background_attributes);
      return this;
    },

    beginPath: function() {
      this.path = "";
      this.pen.x = 0;
      this.pen.y = 0;
      return this;
    },

    moveTo: function(x, y) {
      this.path += "M" + x + "," + y;
      this.pen.x = x;
      this.pen.y = y;
      return this;
    },

    lineTo: function(x, y) {
      this.path += "L" + x + "," + y;
      this.pen.x = x;
      this.pen.y = y;
      return this;
    },

    bezierCurveTo: function(x1, y1, x2, y2, x, y) {
      this.path += "C" +
        x1 + "," +
        y1 + "," +
        x2 + "," +
        y2 + "," +
        x + "," +
        y;
      this.pen.x = x;
      this.pen.y = y;
      return this;
    },

    quadraticCurveTo: function(x1, y1, x, y) {
      this.path += "Q" +
        x1 + "," +
        y1 + "," +
        x + "," +
        y;
      this.pen.x = x;
      this.pen.y = y;
      return this;
    },

    // This is an attempt (hack) to simulate the HTML5 canvas
    // arc method.
    arc: function(x, y, radius, startAngle, endAngle, antiClockwise) {
      function normalizeAngle(angle) {
        while (angle < 0) {
          angle += Math.PI * 2;
        }

        while (angle > Math.PI * 2) {
          angle -= Math.PI * 2;
        }
        return angle;
      }

      startAngle = normalizeAngle(startAngle);
      endAngle = normalizeAngle(endAngle);

      if (startAngle > endAngle) {
          var tmp = startAngle;
          startAngle = endAngle;
          endAngle = tmp;
          antiClockwise = !antiClockwise;
      }

      var delta = endAngle - startAngle;

      if (delta > Math.PI) {
          this.arcHelper(x, y, radius, startAngle, startAngle + delta / 2,
                         antiClockwise);
          this.arcHelper(x, y, radius, startAngle + delta / 2, endAngle,
                         antiClockwise);
      }
      else {
          this.arcHelper(x, y, radius, startAngle, endAngle, antiClockwise);
      }
      return this;
    },

    arcHelper: function(x, y, radius, startAngle, endAngle, antiClockwise) {
      Vex.Assert(endAngle > startAngle, "end angle " + endAngle +
                 " less than or equal to start angle " + startAngle);
      Vex.Assert(startAngle >= 0 && startAngle <= Math.PI * 2);
      Vex.Assert(endAngle >= 0 && endAngle <= Math.PI * 2);

      var x1 = x + radius * Math.cos(startAngle);
      var y1 = y + radius * Math.sin(startAngle);

      var x2 = x + radius * Math.cos(endAngle);
      var y2 = y + radius * Math.sin(endAngle);

      var largeArcFlag = 0;
      var sweepFlag = 0;
      if (antiClockwise) {
        sweepFlag = 1;
        if (endAngle - startAngle < Math.PI)
          largeArcFlag = 1;
      }
      else if (endAngle - startAngle > Math.PI) {
          largeArcFlag = 1;
      }

      this.path += "M" + x1 + "," + y1 + "," + "A" +
        radius + "," + radius + "," + "0," + largeArcFlag + "," + sweepFlag + "," +
        x2 + "," + y2 + "M" + this.pen.x + "," + this.pen.y;
    },

    // Adapted from the source for Raphael's Element.glow
    glow: function() {
      var out = this.paper.set();
      if (this.shadow_attributes.width > 0) {
        var sa = this.shadow_attributes;
        var num_paths = sa.width / 2;
        for (var i = 1; i <= num_paths; i++) {
          out.push(this.paper.path(this.path).attr({
            stroke: sa.color,
            "stroke-linejoin": "round",
            "stroke-linecap": "round",
            "stroke-width": +(sa.width / num_paths * i).toFixed(3),
            opacity: +((sa.opacity || 0.3) / num_paths).toFixed(3)
          }));
        }
      }
      return out;
    },

    fill: function() {
      var elem = this.paper.path(this.path).
        attr(this.attributes).
        attr("stroke-width", 0);
      this.glow(elem);
      return this;
    },

    stroke: function() {
      var elem = this.paper.path(this.path).
        attr(this.attributes).
        attr("fill", "none").
        attr("stroke-width", this.lineWidth);
      this.glow(elem);
      return this;
    },

    closePath: function() {
      this.path += "Z";
      return this;
    },

    measureText: function(text) {
      var txt = this.paper.text(0, 0, text).
        attr(this.attributes).
        attr("fill", "none").
        attr("stroke", "none");

      return {
        width: txt.getBBox().width,
        height: txt.getBBox().height
      };
    },

    fillText: function(text, x, y) {
      this.paper.text(x + (this.measureText(text).width / 2),
          (y - (this.state.font_size / (2.25 * this.state.scale.y))), text).
        attr(this.attributes);
      return this;
    },

    save: function() {
      // TODO(mmuthanna): State needs to be deep-copied.
      this.state_stack.push({
        state: {
          font_family: this.state.font_family
        },
        attributes: {
          font: this.attributes.font,
          fill: this.attributes.fill,
          stroke: this.attributes.stroke,
          "stroke-width": this.attributes["stroke-width"]
        },
        shadow_attributes: {
          width: this.shadow_attributes.width,
          color: this.shadow_attributes.color
        }
      });
      return this;
    },

    restore: function() {
      // TODO(0xfe): State needs to be deep-restored.
      var state = this.state_stack.pop();
      this.state.font_family = state.state.font_family;
      this.attributes.font = state.attributes.font;
      this.attributes.fill = state.attributes.fill;
      this.attributes.stroke = state.attributes.stroke;
      this.attributes["stroke-width"] = state.attributes["stroke-width"];
      this.shadow_attributes.width = state.shadow_attributes.width;
      this.shadow_attributes.color = state.shadow_attributes.color;
      return this;
    }
  };

  return RaphaelContext;
}());
// Vex Flow Notation
// Author Larry Kuhns 2011
// Implements barlines (single, double, repeat, end)
//
// Requires vex.js.

/**
 * @constructor
 */
Vex.Flow.Barline = (function() {
  function Barline(type, x) {
    if (arguments.length > 0) this.init(type, x);
  }

  Barline.type = {
    SINGLE: 1,
    DOUBLE: 2,
    END: 3,
    REPEAT_BEGIN: 4,
    REPEAT_END: 5,
    REPEAT_BOTH: 6,
    NONE: 7
  };

  var THICKNESS = Vex.Flow.STAVE_LINE_THICKNESS;

  Vex.Inherit(Barline, Vex.Flow.StaveModifier, {
    init: function(type, x) {
      Barline.superclass.init.call(this);
      this.barline = type;
      this.x = x;    // Left most x for the stave
    },

    getCategory: function() { return "barlines"; },
    setX: function(x) { this.x = x; return this; },

      // Draw barlines
    draw: function(stave, x_shift) {
      x_shift = typeof x_shift !== 'number' ? 0 : x_shift;

      switch (this.barline) {
        case Barline.type.SINGLE:
          this.drawVerticalBar(stave, this.x, false);
          break;
        case Barline.type.DOUBLE:
          this.drawVerticalBar(stave, this.x, true);
          break;
        case Barline.type.END:
          this.drawVerticalEndBar(stave, this.x);
          break;
        case Barline.type.REPEAT_BEGIN:
          // If the barline is shifted over (in front of clef/time/key)
          // Draw vertical bar at the beginning.
          if (x_shift > 0) {
            this.drawVerticalBar(stave, this.x);
          }
          this.drawRepeatBar(stave, this.x + x_shift, true);
          break;
        case Barline.type.REPEAT_END:
          this.drawRepeatBar(stave, this.x, false);
          break;
        case Barline.type.REPEAT_BOTH:
          this.drawRepeatBar(stave, this.x, false);
          this.drawRepeatBar(stave, this.x, true);
          break;
        default:
          // Default is NONE, so nothing to draw
          break;
      }
    },

    drawVerticalBar: function(stave, x, double_bar) {
      if (!stave.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw stave without canvas context.");
      var top_line = stave.getYForLine(0);
      var bottom_line = stave.getYForLine(stave.options.num_lines - 1) + (THICKNESS / 2);
      if (double_bar)
        stave.context.fillRect(x - 3, top_line, 1, bottom_line - top_line + 1);
      stave.context.fillRect(x, top_line, 1, bottom_line - top_line + 1);
    },

    drawVerticalEndBar: function(stave, x) {
      if (!stave.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw stave without canvas context.");

      var top_line = stave.getYForLine(0);
      var bottom_line = stave.getYForLine(stave.options.num_lines - 1) + (THICKNESS / 2);
      stave.context.fillRect(x - 5, top_line, 1, bottom_line - top_line + 1);
      stave.context.fillRect(x - 2, top_line, 3, bottom_line - top_line + 1);
    },

    drawRepeatBar: function(stave, x, begin) {
      if (!stave.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw stave without canvas context.");

      var top_line = stave.getYForLine(0);
      var bottom_line = stave.getYForLine(stave.options.num_lines - 1) + (THICKNESS / 2);
      var x_shift = 3;

      if (!begin) {
        x_shift = -5;
      }

      stave.context.fillRect(x + x_shift, top_line, 1, bottom_line - top_line + 1);
      stave.context.fillRect(x - 2, top_line, 3, bottom_line - top_line + 1);

      var dot_radius = 2;

      // Shift dots left or right
      if (begin) {
        x_shift += 4;
      } else {
        x_shift -= 4;
      }

      var dot_x = (x + x_shift) + (dot_radius / 2);

      // calculate the y offset based on number of stave lines
      var y_offset = (stave.options.num_lines -1) *
        stave.options.spacing_between_lines_px;
      y_offset = (y_offset / 2) -
                 (stave.options.spacing_between_lines_px / 2);
      var dot_y = top_line + y_offset + (dot_radius / 2);

      // draw the top repeat dot
      stave.context.beginPath();
      stave.context.arc(dot_x, dot_y, dot_radius, 0, Math.PI * 2, false);
      stave.context.fill();

      //draw the bottom repeat dot
      dot_y += stave.options.spacing_between_lines_px;
      stave.context.beginPath();
      stave.context.arc(dot_x, dot_y, dot_radius, 0, Math.PI * 2, false);
      stave.context.fill();
    }
  });

  return Barline;
}());
// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
// This class by Raffaele Viglianti, 2012 http://itisnotsound.wordpress.com/
//
// This class implements hairpins between notes.
// Hairpins can be either Crescendo or Descrescendo.

/**
 * Create a new hairpin from the specified notes.
 *
 * @constructor
 * @param {!Object} notes The notes to tie up.
 * @param {!Object} type The type of hairpin
 */
Vex.Flow.StaveHairpin = (function() {
  function StaveHairpin(notes, type) {
    if (arguments.length > 0) this.init(notes, type);
  }

  StaveHairpin.type = {
    CRESC: 1,
    DECRESC: 2
  };

  /* Helper function to convert ticks into pixels.
   * Requires a Formatter with voices joined and formatted (to
   * get pixels per tick)
   *
   * options is struct that has:
   *
   *  {
   *   height: px,
   *   y_shift: px, //vertical offset
   *   left_shift_ticks: 0, //left horizontal offset expressed in ticks
   *   right_shift_ticks: 0 // right horizontal offset expressed in ticks
   *  }
   *
   **/
  StaveHairpin.FormatByTicksAndDraw = function(ctx, formatter, notes, type, position, options) {
    var ppt = formatter.pixelsPerTick;

    if (ppt == null){
      throw new Vex.RuntimeError("BadArguments",
          "A valid Formatter must be provide to draw offsets by ticks.");}

    var l_shift_px = ppt * options.left_shift_ticks;
    var r_shift_px = ppt * options.right_shift_ticks;

    var hairpin_options = {
      height: options.height,
      y_shift:options.y_shift,
      left_shift_px:l_shift_px,
      right_shift_px:r_shift_px};

    new StaveHairpin({
      first_note: notes.first_note,
      last_note: notes.last_note
    }, type)
      .setContext(ctx)
      .setRenderOptions(hairpin_options)
      .setPosition(position)
      .draw();
  };

  StaveHairpin.prototype = {
    init: function(notes, type) {
      /**
       * Notes is a struct that has:
       *
       *  {
       *    first_note: Note,
       *    last_note: Note,
       *  }
       *
       **/

      this.notes = notes;
      this.hairpin = type;
      this.position = Vex.Flow.Modifier.Position.BELOW;

      this.context = null;

      this.render_options = {
          height: 10,
          y_shift: 0, //vertical offset
          left_shift_px: 0, //left horizontal offset
          right_shift_px: 0 // right horizontal offset
        };

      this.setNotes(notes);
    },

    setContext: function(context) { this.context = context; return this; },

    setPosition: function(position) {
      if (position == Vex.Flow.Modifier.Position.ABOVE ||
          position == Vex.Flow.Modifier.Position.BELOW)
        this.position = position;
      return this;
    },

    setRenderOptions: function(options) {
      if (options.height != null &&
          options.y_shift != null &&
          options.left_shift_px != null &&
          options.right_shift_px != null){
        this.render_options = options;
      }
      return this;
    },

    /**
     * Set the notes to attach this hairpin to.
     *
     * @param {!Object} notes The start and end notes.
     */
    setNotes: function(notes) {
      if (!notes.first_note && !notes.last_note)
        throw new Vex.RuntimeError("BadArguments",
            "Hairpin needs to have either first_note or last_note set.");

      // Success. Lets grab 'em notes.
      this.first_note = notes.first_note;
      this.last_note = notes.last_note;
      return this;
    },

    renderHairpin: function(params) {
      var ctx = this.context;
      var dis = this.render_options.y_shift + 20;
      var y_shift = params.first_y;

      if (this.position == Vex.Flow.Modifier.Position.ABOVE) {
        dis = -dis +30;
        y_shift = params.first_y - params.staff_height;
      }

      var l_shift = this.render_options.left_shift_px;
      var r_shift = this.render_options.right_shift_px;

      switch (this.hairpin) {
        case StaveHairpin.type.CRESC:
          ctx.moveTo(params.last_x + r_shift, y_shift + dis);
          ctx.lineTo(params.first_x + l_shift, y_shift +(this.render_options.height/2) + dis); 
          ctx.lineTo(params.last_x + r_shift, y_shift + this.render_options.height + dis);
          break;
        case StaveHairpin.type.DECRESC:
          ctx.moveTo(params.first_x + l_shift, y_shift + dis);
          ctx.lineTo(params.last_x + r_shift, y_shift +(this.render_options.height/2) + dis); 
          ctx.lineTo(params.first_x + l_shift, y_shift + this.render_options.height + dis);
          break;
        default:
          // Default is NONE, so nothing to draw
          break;
      }

      ctx.stroke();
    },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoContext",
        "Can't draw Hairpin without a context.");

      var first_note = this.first_note;
      var last_note = this.last_note;

      var start = first_note.getModifierStartXY(this.position, 0);
      var end = last_note.getModifierStartXY(this.position, 0);

      this.renderHairpin({
        first_x: start.x,
        last_x: end.x,
        first_y: first_note.getStave().y + first_note.getStave().height,
        last_y: last_note.getStave().y + last_note.getStave().height,
        staff_height: first_note.getStave().height
      });
     return true;
    }
  };
  return StaveHairpin;
}());

// Vex Flow Notation
// Author Larry Kuhns 2011
// Implements voltas (repeat brackets)
//
// Requires vex.js.

Vex.Flow.Volta = (function() {
  function Volta(type, number, x, y_shift) {
    if (arguments.length > 0) this.init(type, number, x, y_shift);
  }

  Volta.type = {
    NONE: 1,
    BEGIN: 2,
    MID: 3,
    END: 4,
    BEGIN_END: 5
  };

  Vex.Inherit(Volta, Vex.Flow.StaveModifier, {
    init: function(type, number, x, y_shift) {
      Volta.superclass.init.call(this);

      this.volta = type;
      this.x = x;
      this.y_shift = y_shift;
      this.number = number;
      this.font = {
        family: "sans-serif",
        size: 9,
        weight: "bold"
      };
    },

    getCategory: function() { return "voltas"; },
    setShiftY: function(y) { this.y_shift = y; return this; },

    draw: function(stave, x) {
      if (!stave.context) throw new Vex.RERR("NoCanvasContext",
        "Can't draw stave without canvas context.");
      var ctx = stave.context;
      var width = stave.width;
      var top_y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
      var vert_height = 1.5 * stave.options.spacing_between_lines_px;
      switch(this.volta) {
        case Vex.Flow.Volta.type.BEGIN:
          ctx.fillRect(this.x + x, top_y, 1, vert_height);
          break;
        case Vex.Flow.Volta.type.END:
          width -= 5;
          ctx.fillRect(this.x + x + width, top_y, 1, vert_height);
          break;
        case Vex.Flow.Volta.type.BEGIN_END:
          width -= 3;
          ctx.fillRect(this.x + x, top_y, 1, vert_height);
          ctx.fillRect(this.x + x + width, top_y, 1, vert_height);
          break;
      }
        // If the beginning of a volta, draw measure number
      if (this.volta == Volta.type.BEGIN ||
          this.volta == Volta.type.BEGIN_END) {
        ctx.save();
        ctx.setFont(this.font.family, this.font.size, this.font.weight);
        ctx.fillText(this.number, this.x + x + 5, top_y + 15);
        ctx.restore();
      }
      ctx.fillRect(this.x + x, top_y, width, 1);
      return this;
    }
  });

  return Volta;
}());// Vex Flow Notation
// Author Larry Kuhns 2011
// Implements Repetitions (Coda, signo, D.C., etc.)
//
// Requires vex.js.

Vex.Flow.Repetition = (function() {
  function Repetition(type, x, y_shift) {
    if (arguments.length > 0) this.init(type, x, y_shift);
  }

  Repetition.type = {
    NONE: 1,         // no coda or segno
    CODA_LEFT: 2,    // coda at beginning of stave
    CODA_RIGHT: 3,   // coda at end of stave
    SEGNO_LEFT: 4,   // segno at beginning of stave
    SEGNO_RIGHT: 5,  // segno at end of stave
    DC: 6,           // D.C. at end of stave
    DC_AL_CODA: 7,   // D.C. al coda at end of stave
    DC_AL_FINE: 8,   // D.C. al Fine end of stave
    DS: 9,           // D.S. at end of stave
    DS_AL_CODA: 10,  // D.S. al coda at end of stave
    DS_AL_FINE: 11,  // D.S. al Fine at end of stave
    FINE: 12         // Fine at end of stave
  };

  Vex.Inherit(Repetition, Vex.Flow.StaveModifier, {
    init: function(type, x, y_shift) {
      Repetition.superclass.init.call(this);

      this.symbol_type = type;
      this.x = x;
      this.x_shift = 0;
      this.y_shift = y_shift;
      this.font = {
        family: "times",
        size: 12,
        weight: "bold italic"
      };
    },

    getCategory: function() { return "repetitions"; },
    setShiftX: function(x) { this.x_shift = x; return this; },
    setShiftY: function(y) { this.y_shift = y; return this; },

    draw: function(stave, x) {
      switch (this.symbol_type) {
        case Repetition.type.CODA_RIGHT:
          this.drawCodaFixed(stave, x + stave.width);
          break;
        case Repetition.type.CODA_LEFT:
          this.drawSymbolText(stave, x, "Coda", true);
          break;
        case Repetition.type.SEGNO_LEFT:
          this.drawSignoFixed(stave, x);
          break;
        case Repetition.type.SEGNO_RIGHT:
          this.drawSignoFixed(stave, x + stave.width);
          break;
        case Repetition.type.DC:
          this.drawSymbolText(stave, x, "D.C.", false);
          break;
        case Repetition.type.DC_AL_CODA:
          this.drawSymbolText(stave, x, "D.C. al", true);
          break;
        case Repetition.type.DC_AL_FINE:
          this.drawSymbolText(stave, x, "D.C. al Fine", false);
          break;
        case Repetition.type.DS:
          this.drawSymbolText(stave, x, "D.S.", false);
          break;
        case Repetition.type.DS_AL_CODA:
          this.drawSymbolText(stave, x, "D.S. al", true);
          break;
        case Repetition.type.DS_AL_FINE:
          this.drawSymbolText(stave, x, "D.S. al Fine", false);
          break;
        case Repetition.type.FINE:
          this.drawSymbolText(stave, x, "Fine", false);
          break;
        default:
          break;
      }

      return this;
    },

    drawCodaFixed: function(stave, x) {
      if (!stave.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw stave without canvas context.");

      var y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
      Vex.Flow.renderGlyph(stave.context, this.x + x + this.x_shift,
                           y + 25, 40, "v4d", true);
      return this;
    },

    drawSignoFixed: function(stave, x) {
      if (!stave.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw stave without canvas context.");
      var y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
      Vex.Flow.renderGlyph(stave.context, this.x + x + this.x_shift,
                           y + 25, 30, "v8c", true);
      return this;
    },

    drawSymbolText: function(stave, x, text, draw_coda) {
      if (!stave.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw stave without canvas context.");

      var ctx = stave.context;
      ctx.save();
      ctx.setFont(this.font.family, this.font.size, this.font.weight);
        // Default to right symbol
      var text_x = 0 + this.x_shift;
      var symbol_x = x + this.x_shift;
      if (this.symbol_type == Vex.Flow.Repetition.type.CODA_LEFT) {
          // Offset Coda text to right of stave beginning
        text_x = this.x + stave.options.vertical_bar_width;
        symbol_x = text_x + ctx.measureText(text).width + 12;
      } else {
          // Offset Signo text to left stave end
        symbol_x = this.x + x + stave.width - 5 + this.x_shift;
        text_x = symbol_x - + ctx.measureText(text).width - 12;
      }
      var y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
      if (draw_coda) {
        Vex.Flow.renderGlyph(ctx, symbol_x, y, 40, "v4d", true);
      }

      ctx.fillText(text, text_x, y + 5);
      ctx.restore();

      return this;
    }
  });

  return Repetition;
}());// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
// Author Larry Kuhns 2011
// Implements stave section names.

/**
 * @constructor
 */
Vex.Flow.StaveSection = (function() {
  function StaveSection(section, x, shift_y) {
    if (arguments.length > 0) this.init(section, x, shift_y);
  }

  var Modifier = Vex.Flow.Modifier;
  Vex.Inherit(StaveSection, Modifier, {
    init: function(section, x, shift_y) {
      StaveSection.superclass.init.call(this);

      this.setWidth(16);
      this.section = section;
      this.position = Modifier.Position.ABOVE;
      this.x = x;
      this.shift_x = 0;
      this.shift_y = shift_y;
      this.font = {
        family: "sans-serif",
        size: 12,
        weight: "bold"
      };
    },

    getCategory: function() { return "stavesection"; },
    setStaveSection: function(section) { this.section = section; return this; },
    setShiftX: function(x) { this.shift_x = x; return this; },
    setShiftY: function(y) { this.shift_y = y; return this; },

    draw: function(stave, shift_x) {
      if (!stave.context) throw new Vex.RERR("NoContext",
        "Can't draw stave section without a context.");

      var ctx = stave.context;

      ctx.save();
      ctx.lineWidth = 2;
      ctx.setFont(this.font.family, this.font.size, this.font.weight);
      var text_width = ctx.measureText("" + this.section).width;
      var width = text_width + 6;  // add left & right padding
      if (width < 18) width = 18;
      var height = 20;
        //  Seems to be a good default y
      var y = stave.getYForTopText(3) + this.shift_y;
      var x = this.x + shift_x;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.rect(x, y, width, height);
      ctx.stroke();
      x += (width - text_width) / 2;
      ctx.fillText("" + this.section, x, y + 16);
      ctx.restore();
      return this;
    }
  });

  return StaveSection;
}());// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
// Author Radosaw Eichler 2012
// Implements tempo marker.

/**
 * @constructor
 * @param {Object} tempo Tempo parameters: { name, duration, dots, bpm }
 */
Vex.Flow.StaveTempo = (function() {
  function StaveTempo(tempo, x, shift_y) {
    if (arguments.length > 0) this.init(tempo, x, shift_y);
  }

  Vex.Inherit(StaveTempo, Vex.Flow.StaveModifier, {
    init: function(tempo, x, shift_y) {
      StaveTempo.superclass.init.call(this);

      this.tempo = tempo;
      this.position = Vex.Flow.Modifier.Position.ABOVE;
      this.x = x;
      this.shift_x = 10;
      this.shift_y = shift_y;
      this.font = {
        family: "times",
        size: 14,
        weight: "bold"
      };
      this.render_options = {
        glyph_font_scale: 30  // font size for note
      };
    },

    getCategory: function() { return "stavetempo"; },
    setTempo: function(tempo) { this.tempo = tempo; return this; },
    setShiftX: function(x) { this.shift_x = x; return this; },
    setShiftY: function(y) { this.shift_y = y; return this; },

    draw: function(stave, shift_x) {
      if (!stave.context) throw new Vex.RERR("NoContext",
        "Can't draw stave tempo without a context.");

      var options = this.render_options;
      var scale = options.glyph_font_scale / 38;
      var name = this.tempo.name;
      var duration = this.tempo.duration;
      var dots = this.tempo.dots;
      var bpm = this.tempo.bpm;
      var font = this.font;
      var ctx = stave.context;
      var x = this.x + this.shift_x + shift_x;
      var y = stave.getYForTopText(1) + this.shift_y;

      ctx.save();

      if (name) {
        ctx.setFont(font.family, font.size, font.weight);
        ctx.fillText(name, x, y);
        x += ctx.measureText(name).width;
      }

      if (duration && bpm) {
        ctx.setFont(font.family, font.size, 'normal');

        if (name) {
          x += ctx.measureText(" ").width;
          ctx.fillText("(", x, y);
          x += ctx.measureText("(").width;
        }

        var code = Vex.Flow.durationToGlyph(duration);

        x += 3 * scale;
        Vex.Flow.renderGlyph(ctx, x, y, options.glyph_font_scale, code.code_head);
        x += code.head_width * scale;

        // Draw stem and flags
        if (code.stem) {
          var stem_height = 30;

          if (code.beam_count) stem_height += 3 * (code.beam_count - 1);

          stem_height *= scale;

          var y_top = y - stem_height;
          ctx.fillRect(x, y_top, scale, stem_height);

          if (code.flag) {
            Vex.Flow.renderGlyph(ctx, x + scale, y_top, options.glyph_font_scale,
                                 code.code_flag_upstem);

            if (!dots) x += 6 * scale;
          }
        }

        // Draw dot
        for (var i = 0; i < dots; i++) {
          x += 6 * scale;
          ctx.beginPath();
          ctx.arc(x, y + 2 * scale, 2 * scale, 0, Math.PI * 2, false);
          ctx.fill();
        }

        ctx.fillText(" = " + bpm + (name ? ")" : ""), x + 3 * scale, y);
      }

      ctx.restore();
      return this;
    }
  });

  return StaveTempo;
}());
// Vex Flow Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010
//
// Requires vex.js.

/** @constructor */
Vex.Flow.BarNote = (function() {
  function BarNote() { this.init(); }

  Vex.Inherit(BarNote, Vex.Flow.Note, {
    init: function() {
      BarNote.superclass.init.call(this, {duration: "b"});

      var TYPE = Vex.Flow.Barline.type;
      this.metrics = {
        widths: {}
      };

      this.metrics.widths[TYPE.SINGLE] = 8;
      this.metrics.widths[TYPE.DOUBLE] = 12;
      this.metrics.widths[TYPE.END] = 15;
      this.metrics.widths[TYPE.REPEAT_BEGIN] = 14;
      this.metrics.widths[TYPE.REPEAT_END] = 14;
      this.metrics.widths[TYPE.REPEAT_BOTH] = 18;
      this.metrics.widths[TYPE.NONE] = 0;

      // Note properties
      this.ignore_ticks = true;
      this.type = TYPE.SINGLE;
      this.setWidth(this.metrics.widths[this.type]);
    },

    setType: function(type) {
      this.type = type;
      this.setWidth(this.metrics.widths[this.type]);
      return this;
    },

    getType: function() {
      return this.type;
    },

    setStave: function(stave) {
      var superclass = Vex.Flow.BarNote.superclass;
      superclass.setStave.call(this, stave);
    },

    getBoundingBox: function() {
      return new Vex.Flow.BoundingBox(0, 0, 0, 0);
    },

    addToModifierContext: function() {
      /* overridden to ignore */
      return this;
    },

    preFormat: function() {
      this.setPreFormatted(true);
      return this;
    },

    draw: function() {
      if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
      var barline = new Vex.Flow.Barline(this.type, this.getAbsoluteX());
      barline.draw(this.stave, this.getAbsoluteX());
    }
  });

  return BarNote;
}());
// VexFlow - Music Engraving for HTML5
// Author: Mike Corrigan <corrigan@gmail.com>
//
// This class implements tremolo notation.

/**
 * @constructor
 */
Vex.Flow.Tremolo = (function() {
  function Tremolo(num) {
    if (arguments.length > 0) this.init(num);
  }

  var Modifier = Vex.Flow.Modifier;
  Vex.Inherit(Tremolo, Modifier, {
    init: function(num) {
      Tremolo.superclass.init.call(this);

      this.num = num;
      this.note = null;
      this.index = null;
      this.position = Modifier.Position.CENTER;
      this.code = "v74";
      this.shift_right = -2;
      this.y_spacing = 4;

      this.render_options = {
        font_scale: 35,
        stroke_px: 3,
        stroke_spacing: 10
      };

      this.font = {
        family: "Arial",
        size: 16,
        weight: ""
      };
    },

    getCategory: function() { return "tremolo"; },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoContext",
        "Can't draw Tremolo without a context.");
      if (!(this.note && (this.index != null))) throw new Vex.RERR("NoAttachedNote",
        "Can't draw Tremolo without a note and index.");

      var start = this.note.getModifierStartXY(this.position, this.index);
      var x = start.x;
      var y = start.y;

      x += this.shift_right;
      for (var i = 0; i < this.num; ++i) {
        Vex.Flow.renderGlyph(this.context, x, y,
                             this.render_options.font_scale, this.code);
        y += this.y_spacing;
      }
    }
  });

  return Tremolo;
}());
/**
 * Create a new tuplet from the specified notes. The notes must
 * be part of the same line, and have the same duration (in ticks).
 *
 * @constructor
 * @param {Array.<Vex.Flow.StaveNote>} A set of notes.
 */
Vex.Flow.Tuplet = (function() {
  function Tuplet(notes, options) {
    if (arguments.length > 0) this.init(notes, options);
  }

  Tuplet.LOCATION_TOP = 1;
  Tuplet.LOCATION_BOTTOM = -1;

  Tuplet.prototype = {
    init: function(notes, options) {
      if (!notes || notes == []) {
        throw new Vex.RuntimeError("BadArguments", "No notes provided for tuplet.");
      }

      if (notes.length == 1) {
        throw new Vex.RuntimeError("BadArguments", "Too few notes for tuplet.");
      }

      this.options = Vex.Merge({}, options);
      this.notes = notes;
      this.num_notes = 'num_notes' in this.options ?
        this.options.num_notes : notes.length;
      this.beats_occupied = 'beats_occupied' in this.options ?
        this.options.beats_occupied : 2;
      this.bracketed = (notes[0].beam == null);
      this.ratioed = false;
      this.point = 28;
      this.y_pos = 16;
      this.x_pos = 100;
      this.width = 200;
      this.location = Tuplet.LOCATION_TOP;

      Vex.Flow.Formatter.AlignRestsToNotes(notes, true, true);
      this.resolveGlyphs();
      this.attach();
    },

    attach: function () {
      for (var i = 0; i < this.notes.length; i++) {
        var note = this.notes[i];
        note.setTuplet(this);
      }
    },

    detach: function () {
      for (var i = 0; i < this.notes.length; i++) {
        var note = this.notes[i];
        note.setTuplet(null);
      }
    },

    setContext: function(context) {
      this.context = context;
      return this;
    },

    /**
     * Set whether or not the bracket is drawn.
     */
    setBracketed: function(bracketed) {
      this.bracketed = bracketed ? true : false;
      return this;
    },

    /**
     * Set whether or not the ratio is shown.
     */
    setRatioed: function(ratioed) {
      this.ratioed = ratioed ? true : false;
      return this;
    },

    /**
     * Set the tuplet to be displayed either on the top or bottom of the stave
     */
    setTupletLocation: function(location) {
      if (!location) location = Tuplet.LOCATION_TOP;
      else if (location != Tuplet.LOCATION_TOP &&
          location != Tuplet.LOCATION_BOTTOM) {
        throw new Vex.RERR("BadArgument", "Invalid tuplet location: " + location);
      }

      this.location = location;
      return this;
    },

    getNotes: function() {
      return this.notes;
    },

    getNoteCount: function() {
      return this.num_notes;
    },

    getBeatsOccupied: function() {
      return this.beats_occupied;
    },

    setBeatsOccupied: function(beats) {
      this.detach();
      this.beats_occupied = beats;
      this.resolveGlyphs();
      this.attach();
    },

    resolveGlyphs: function() {
      this.num_glyphs = [];
      var n = this.num_notes;
      while (n >= 1) {
        this.num_glyphs.push(new Vex.Flow.Glyph("v" + (n % 10), this.point));
        n = parseInt(n / 10, 10);
      }

      this.denom_glyphs = [];
      n = this.beats_occupied;
      while (n >= 1) {
        this.denom_glyphs.push(new Vex.Flow.Glyph("v" + (n % 10), this.point));
        n = parseInt(n / 10, 10);
      }
    },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw without a canvas context.");

      // determine x value of left bound of tuplet
      var first_note = this.notes[0];
      var last_note = this.notes[this.notes.length - 1];

      if (!this.bracketed) {
        this.x_pos = first_note.getStemX();
        this.width = last_note.getStemX() - this.x_pos;
      }
      else {
        this.x_pos = first_note.getTieLeftX() - 5;
        this.width = last_note.getTieRightX() - this.x_pos + 5;
      }

      // determine y value for tuplet
      var i;
      if (this.location == Tuplet.LOCATION_TOP) {
        this.y_pos = first_note.getStave().getYForLine(0) - 15;
        //this.y_pos = first_note.getStemExtents().topY - 10;

        for (i=0; i<this.notes.length; ++i) {
          var top_y = this.notes[i].getStemExtents().topY - 10;
          if (top_y < this.y_pos)
            this.y_pos = top_y;
        }
      }
      else {
        this.y_pos = first_note.getStave().getYForLine(4) + 20;

        for (i=0; i<this.notes.length; ++i) {
          var bottom_y = this.notes[i].getStemExtents().topY + 10;
          if (bottom_y > this.y_pos)
            this.y_pos = bottom_y;
        }
      }

      // calculate total width of tuplet notation
      var width = 0;
      var glyph;
      for (glyph in this.num_glyphs) {
        width += this.num_glyphs[glyph].getMetrics().width;
      }
      if (this.ratioed) {
        for (glyph in this.denom_glyphs) {
          width += this.denom_glyphs[glyph].getMetrics().width;
        }
        width += this.point * 0.32;
      }

      var notation_center_x = this.x_pos + (this.width/2);
      var notation_start_x = notation_center_x - (width/2);

      // draw bracket if the tuplet is not beamed
      if (this.bracketed) {
        var line_width = this.width/2 - width/2 - 5;

        // only draw the bracket if it has positive length
        if (line_width > 0) {
          this.context.fillRect(this.x_pos, this.y_pos,line_width, 1);
          this.context.fillRect(this.x_pos + this.width / 2 + width / 2 + 5,
                                this.y_pos,line_width, 1);
          this.context.fillRect(this.x_pos,
              this.y_pos + (this.location == Tuplet.LOCATION_BOTTOM),
              1, this.location * 10);
          this.context.fillRect(this.x_pos + this.width,
              this.y_pos + (this.location == Tuplet.LOCATION_BOTTOM),
              1, this.location * 10);
        }
      }

      // draw numerator glyphs
      var x_offset = 0;
      var size = this.num_glyphs.length;
      for (glyph in this.num_glyphs) {
        this.num_glyphs[size-glyph-1].render(
            this.context, notation_start_x + x_offset,
            this.y_pos + (this.point/3) - 2);
        x_offset += this.num_glyphs[size-glyph-1].getMetrics().width;
      }

      // display colon and denominator if the ratio is to be shown
      if (this.ratioed) {
        var colon_x = notation_start_x + x_offset + this.point*0.16;
        var colon_radius = this.point * 0.06;
        this.context.beginPath();
        this.context.arc(colon_x, this.y_pos - this.point*0.08,
                         colon_radius, 0, Math.PI*2, true);
        this.context.closePath();
        this.context.fill();
        this.context.beginPath();
        this.context.arc(colon_x, this.y_pos + this.point*0.12,
                         colon_radius, 0, Math.PI*2, true);
        this.context.closePath();
        this.context.fill();
        x_offset += this.point*0.32;
        size = this.denom_glyphs.length;
        for (glyph in this.denom_glyphs) {
          this.denom_glyphs[size-glyph-1].render(
              this.context, notation_start_x + x_offset,
              this.y_pos + (this.point/3) - 2);
          x_offset += this.denom_glyphs[size-glyph-1].getMetrics().width;
        }
      }
    }
  };

  return Tuplet;
}());
// Vex Music Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010

// Bounding boxes for interactive notation

/** @constructor */
Vex.Flow.BoundingBox = (function() {
  function BoundingBox(x, y, w, h) { this.init(x, y, w, h); }

  BoundingBox.prototype = {
    init: function(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    },

    getX: function() { return this.x; },
    getY: function() { return this.y; },
    getW: function() { return this.w; },
    getH: function() { return this.h; },

    setX: function(x) { this.x = x; return this; },
    setY: function(y) { this.y = y; return this; },
    setW: function(w) { this.w = w; return this; },
    setH: function(h) { this.h = h; return this; },

    // Merge my box with given box. Creates a bigger bounding box unless
    // the given box is contained in this one.
    mergeWith: function(boundingBox, ctx) {
      var that = boundingBox;

      var new_x = this.x < that.x ? this.x : that.x;
      var new_y = this.y < that.y ? this.y : that.y;
      var new_w = (this.x + this.w) < (that.x + that.w) ? (that.x + that.w) - this.x : (this.x + this.w) - Vex.Min(this.x, that.x);
      var new_h = (this.y + this.h) < (that.y + that.h) ? (that.y + that.h) - this.y : (this.y + this.h) - Vex.Min(this.y, that.y);

      this.x = new_x;
      this.y = new_y;
      this.w = new_w;
      this.h = new_h;

      if (ctx) this.draw(ctx);
      return this;
    },

    draw: function(ctx) {
      ctx.rect(this.x, this.y, this.w, this.h);
      ctx.stroke();
    }
  };

  return BoundingBox;
}());// Vex Flow Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2013

/** @constructor */
Vex.Flow.TextNote = (function() {
  function TextNote(text_struct) {
    if (arguments.length > 0) this.init(text_struct);
  }

  TextNote.Justification = {
    LEFT: 1,
    CENTER: 2,
    RIGHT: 3
  };

  TextNote.GLYPHS = {
    "segno": {
      code: "v8c",
      point: 40,
      x_shift: 0,
      y_shift: -10
      // width: 10 // optional
    },
    "tr": {
      code: "v1f",
      point: 40,
      x_shift: 0,
      y_shift: 0
      // width: 10 // optional
    },
    "mordent": {
      code: "v1e",
      point: 40,
      x_shift: 0,
      y_shift: 0
      // width: 10 // optional
    },
    "f": {
      code: "vba",
      point: 40,
      x_shift: 0,
      y_shift: 0
      // width: 10 // optional
    },
    "p": {
      code: "vbf",
      point: 40,
      x_shift: 0,
      y_shift: 0
      // width: 10 // optional
    },
    "m": {
      code: "v62",
      point: 40,
      x_shift: 0,
      y_shift: 0
      // width: 10 // optional
    },
    "s": {
      code: "v4a",
      point: 40,
      x_shift: 0,
      y_shift: 0
      // width: 10 // optional
    },
    "coda": {
      code: "v4d",
      point: 40,
      x_shift: 0,
      y_shift: -8
      // width: 10 // optional
    }
  };

  Vex.Inherit(TextNote, Vex.Flow.Note, {
    init: function(text_struct) {
      TextNote.superclass.init.call(this, text_struct);

      // Note properties
      this.text = text_struct.text;
      this.glyph_type = text_struct.glyph;
      this.glyph = null;
      this.font = {
        family: "Arial",
        size: 12,
        weight: ""
      };

      if (text_struct.font) this.font = text_struct.font;

      if (this.glyph_type) {
        var struct = TextNote.GLYPHS[this.glyph_type];
        if (!struct) throw new Vex.RERR("Invalid glyph type: " + this.glyph_type);

        this.glyph = new Vex.Flow.Glyph(struct.code, struct.point, {cache: false});

        if (struct.width)
          this.setWidth(struct.width);
        else
          this.setWidth(this.glyph.getMetrics().width);

        this.glyph_struct = struct;
      } else {
        this.setWidth(Vex.Flow.textWidth(this.text));
      }
      this.line = text_struct.line || 0;
      this.smooth = text_struct.smooth || false;
      this.ignore_ticks = text_struct.ignore_ticks || false;
      this.justification = TextNote.Justification.LEFT;
    },

    setJustification: function(just) {
      this.justification = just;
      return this;
    },

    setLine: function(line) {
      this.line = line;
      return this;
    },

    // Pre-render formatting
    preFormat: function() {
      if (!this.context) throw new Vex.RERR("NoRenderContext",
          "Can't measure text without rendering context.");
      if (this.preFormatted) return;

      if (this.smooth) {
        this.setWidth(0);
      } else {
        if (this.glyph) {
          // Width already set.
        } else {
          this.setWidth(this.context.measureText(this.text).width);
        }
      }

      if (this.justification == TextNote.Justification.CENTER) {
        this.extraLeftPx = this.width / 2;
      } else if (this.justification == TextNote.Justification.RIGHT) {
        this.extraLeftPx = this.width;
      }

      this.setPreFormatted(true);
    },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoCanvasContext",
          "Can't draw without a canvas context.");
      if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");

      var ctx = this.context;
      var x = this.getAbsoluteX();
      if (this.justification == TextNote.Justification.CENTER) {
        x -= this.getWidth() / 2;
      } else if (this.justification == TextNote.Justification.RIGHT) {
        x -= this.getWidth();
      }

      var y;
      if (this.glyph) {
        y = this.stave.getYForLine(this.line + (-3));
        this.glyph.render(this.context,
                          x + this.glyph_struct.x_shift,
                          y + this.glyph_struct.y_shift);
      } else {
        y = this.stave.getYForLine(this.line + (-3));
        ctx.save();
        ctx.setFont(this.font.family, this.font.size, this.font.weight);
        ctx.fillText(this.text, x, y);
        ctx.restore();
      }
    }
  });

  return TextNote;
}());
// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
// Author Larry Kuhns 2013
// Class to draws string numbers into the notation.

/**
 * @constructor
 */
Vex.Flow.FretHandFinger = (function() {
  function FretHandFinger(number) {
    if (arguments.length > 0) this.init(number);
  }

  var Modifier = Vex.Flow.Modifier;
  Vex.Inherit(FretHandFinger, Modifier, {
    init: function(number) {
      var superclass = Vex.Flow.FretHandFinger.superclass;
      superclass.init.call(this);

      this.note = null;
      this.index = null;
      this.finger = number;
      this.width = 7;
      this.position = Modifier.Position.LEFT;  // Default position above stem or note head
      this.x_shift = 0;
      this.y_shift = 0;
      this.x_offset = 0;       // Horizontal offset from default
      this.y_offset = 0;       // Vertical offset from default
      this.font = {
        family: "sans-serif",
        size: 9,
        weight: "bold"
      };
    },

    getCategory: function() { return "frethandfinger"; },
    getNote: function() { return this.note; },
    setNote: function(note) { this.note = note; return this; },
    getIndex: function() { return this.index; },
    setIndex: function(index) { this.index = index; return this; },
    getPosition: function() { return this.position; },
    setPosition: function(position) {
      if (position >= Modifier.Position.LEFT &&
          position <= Modifier.Position.BELOW)
        this.position = position;
      return this;
    },
    setFretHandFinger: function(number) { this.finger = number; return this; },
    setOffsetX: function(x) { this.x_offset = x; return this; },
    setOffsetY: function(y) { this.y_offset = y; return this; },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoContext",
        "Can't draw string number without a context.");
      if (!(this.note && (this.index != null))) throw new Vex.RERR("NoAttachedNote",
        "Can't draw string number without a note and index.");

      var ctx = this.context;
      var start = this.note.getModifierStartXY(this.position, this.index);
      var dot_x = (start.x + this.x_shift + this.x_offset);
      var dot_y = start.y + this.y_shift + this.y_offset + 5;

      switch (this.position) {
        case Modifier.Position.ABOVE:
          dot_x -= 4;
          dot_y -= 12;
          break;
        case Modifier.Position.BELOW:
          dot_x -= 2;
          dot_y += 10;
          break;
        case Modifier.Position.LEFT:
          dot_x -= this.width;
          break;
        case Modifier.Position.RIGHT:
          dot_x += 1;
          break;
      }

      ctx.save();
      ctx.setFont(this.font.family, this.font.size, this.font.weight);
      ctx.fillText("" + this.finger, dot_x, dot_y);

      ctx.restore();
    }
  });

  return FretHandFinger;
}());// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
// Author Larry Kuhns 2013
// Class to draws string numbers into the notation.

Vex.Flow.StringNumber = (function() {
  function StringNumber(number) {
    if (arguments.length > 0) this.init(number);
  }

  var Modifier = Vex.Flow.Modifier;
  Vex.Inherit(StringNumber, Modifier, {
    init: function(number) {
      StringNumber.superclass.init.call(this);

      this.note = null;
      this.last_note = null;
      this.index = null;
      this.string_number = number;
      this.setWidth(20);                                 // ???
      this.position = Modifier.Position.ABOVE;  // Default position above stem or note head
      this.x_shift = 0;
      this.y_shift = 0;
      this.x_offset = 0;                               // Horizontal offset from default
      this.y_offset = 0;                               // Vertical offset from default
      this.dashed = true;                              // true - draw dashed extension  false - no extension
      this.leg = Vex.Flow.Renderer.LineEndType.NONE;   // draw upward/downward leg at the of extension line
      this.radius = 8;
      this.font = {
        family: "sans-serif",
        size: 10,
        weight: "bold"
      };
    },

    getCategory: function() { return "stringnumber"; },
    getNote: function() { return this.note; },
    setNote: function(note) { this.note = note; return this; },
    getIndex: function() { return this.index; },
    setIndex: function(index) { this.index = index; return this; },

    setLineEndType: function(leg) {
      if (leg >= Vex.Flow.Renderer.LineEndType.NONE &&
          leg <= Vex.Flow.Renderer.LineEndType.DOWN)
        this.leg = leg;
      return this;
    },

    getPosition: function() { return this.position; },
    setPosition: function(position) {
      if (position >= Modifier.Position.LEFT &&
          position <= Modifier.Position.BELOW)
        this.position = position;
      return this;
    },

    setStringNumber: function(number) { this.string_number = number; return this; },
    setOffsetX: function(x) { this.x_offset = x; return this; },
    setOffsetY: function(y) { this.y_offset = y; return this; },
    setLastNote: function(note) { this.last_note = note; return this; },
    setDashed: function(dashed) { this.dashed = dashed; return this; },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoContext",
        "Can't draw string number without a context.");
      if (!(this.note && (this.index != null))) throw new Vex.RERR("NoAttachedNote",
        "Can't draw string number without a note and index.");

      var ctx = this.context;
      var line_space = this.note.stave.options.spacing_between_lines_px;

      var start = this.note.getModifierStartXY(this.position, this.index);
      var dot_x = (start.x + this.x_shift + this.x_offset);
      var dot_y = start.y + this.y_shift + this.y_offset;

      switch (this.position) {
        case Modifier.Position.ABOVE:
        case Modifier.Position.BELOW:
          var stem_ext = this.note.getStemExtents();
          var top = stem_ext.topY;
          var bottom = stem_ext.baseY + 2;

          if (this.note.stem_direction == Vex.Flow.StaveNote.STEM_DOWN) {
            top = stem_ext.baseY;
            bottom = stem_ext.topY - 2;
          }

          if (this.position == Modifier.Position.ABOVE) {
            dot_y = this.note.hasStem() ? top - (line_space * 1.75)
                                        : start.y - (line_space * 1.75);
        } else {
            dot_y = this.note.hasStem() ? bottom + (line_space * 1.5)
                                        : start.y + (line_space * 1.75);
          }

          dot_y += this.y_shift + this.y_offset;

          break;
        case Modifier.Position.LEFT:
          dot_x -= (this.radius / 2) + 5;
          break;
        case Modifier.Position.RIGHT:
          dot_x += (this.radius / 2) + 6;
          break;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(dot_x, dot_y, this.radius, 0, Math.PI * 2, false);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setFont(this.font.family, this.font.size, this.font.weight);
      var x = dot_x - ctx.measureText(this.string_number).width / 2;
      ctx.fillText("" + this.string_number, x, dot_y + 4.5);

      if (this.last_note != null) {
        var end = this.last_note.getStemX() - this.note.getX() + 5;
        ctx.strokeStyle="#000000";
        ctx.lineCap = "round";
        ctx.lineWidth = 0.6;
        if (this.dashed)
          Vex.Flow.Renderer.drawDashedLine(ctx, dot_x + 10, dot_y, dot_x + end, dot_y, [3,3]);
        else
          Vex.Flow.Renderer.drawDashedLine(ctx, dot_x + 10, dot_y, dot_x + end, dot_y, [3,0]);

        var len, pattern;
        switch (this.leg) {
          case Vex.Flow.Renderer.LineEndType.UP:
            len = -10;
            pattern = this.dashed ? [3,3] : [3,0];
            Vex.Flow.Renderer.drawDashedLine(ctx, dot_x + end, dot_y, dot_x + end, dot_y + len, pattern);
            break;
          case Vex.Flow.Renderer.LineEndType.DOWN:
            len = 10;
            pattern = this.dashed ? [3,3] : [3,0];
            Vex.Flow.Renderer.drawDashedLine(ctx, dot_x + end, dot_y, dot_x + end, dot_y + len, pattern);
            break;
        }
      }

      ctx.restore();
    }
  });

  return StringNumber;
}());
// VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
// Author Larry Kuhns 2013
// Class implements chord strokes - arpeggiated, brush & rasquedo.

Vex.Flow.Stroke = (function() {
  function Stroke(type, options) {
    if (arguments.length > 0) this.init(type, options);
  }

  Stroke.Type = {
    BRUSH_DOWN: 1,
    BRUSH_UP: 2,
    ROLL_DOWN: 3,        // Arpegiated chord
    ROLL_UP: 4,          // Arpegiated chord
    RASQUEDO_DOWN: 5,
    RASQUEDO_UP: 6
  };

  var Modifier = Vex.Flow.Modifier;
  Vex.Inherit(Stroke, Modifier, {
    init: function(type, options) {
      Stroke.superclass.init.call(this);

      this.note = null;
      this.options = Vex.Merge({}, options);

      // multi voice - span stroke across all voices if true
      this.all_voices = 'all_voices' in this.options ?
        this.options.all_voices : true;

      // multi voice - end note of stroke, set in draw()
      this.note_end = null;
      this.index = null;
      this.type = type;
      this.position = Modifier.Position.LEFT;

      this.render_options = {
        font_scale: 38,
        stroke_px: 3,
        stroke_spacing: 10
      };

      this.font = {
       family: "serif",
       size: 10,
       weight: "bold italic"
     };

      this.setXShift(0);
      this.setWidth(10);
    },

    getCategory: function() { return "strokes"; },
    getPosition: function() { return this.position; },
    addEndNote: function(note) { this.note_end = note; return this; },

    draw: function() {
      if (!this.context) throw new Vex.RERR("NoContext",
        "Can't draw stroke without a context.");
      if (!(this.note && (this.index != null))) throw new Vex.RERR("NoAttachedNote",
        "Can't draw stroke without a note and index.");
      var start = this.note.getModifierStartXY(this.position, this.index);
      var ys = this.note.getYs();
      var topY = start.y;
      var botY = start.y;
      var x = start.x - 5;
      var line_space = this.note.stave.options.spacing_between_lines_px;

      var notes = this.getModifierContext().getModifiers(this.note.getCategory());
      var i;
      for (i = 0; i < notes.length; i++) {
        ys = notes[i].getYs();
        for (var n = 0; n < ys.length; n++) {
          if (this.note == notes[i] || this.all_voices) {
            topY = Vex.Min(topY, ys[n]);
            botY = Vex.Max(botY, ys[n]);
          }
        }
      }

      var arrow, arrow_shift_x, arrow_y, text_shift_x, text_y;
      switch (this.type) {
        case Stroke.Type.BRUSH_DOWN:
          arrow = "vc3";
          arrow_shift_x = -3;
          arrow_y = topY - (line_space / 2) + 10;
          botY += (line_space / 2);
          break;
        case Stroke.Type.BRUSH_UP:
          arrow = "v11";
          arrow_shift_x = 0.5;
          arrow_y = botY + (line_space / 2);
          topY -= (line_space / 2);
          break;
        case Stroke.Type.ROLL_DOWN:
        case Stroke.Type.RASQUEDO_DOWN:
          arrow = "vc3";
          arrow_shift_x = -3;
          text_shift_x = this.x_shift + arrow_shift_x - 2;
          if (this.note instanceof Vex.Flow.StaveNote) {
            topY += 1.5 * line_space;
            if ((botY - topY) % 2 !== 0) {
              botY += 0.5 * line_space;
            } else {
              botY += line_space;
            }
            arrow_y = topY - line_space;
            text_y = botY + line_space + 2;
          } else {
            topY += 1.5 * line_space;
            botY += line_space;
            arrow_y = topY - 0.75 * line_space;
            text_y = botY + 0.25 * line_space;
          }
          break;
        case Stroke.Type.ROLL_UP:
        case Stroke.Type.RASQUEDO_UP:
          arrow = "v52";
          arrow_shift_x = -4;
          text_shift_x = this.x_shift + arrow_shift_x - 1;
          if (this.note instanceof Vex.Flow.StaveNote) {
            arrow_y = line_space / 2;
            topY += 0.5 * line_space;
            if ((botY - topY) % 2 === 0) {
              botY += line_space / 2;
            }
            arrow_y = botY + 0.5 * line_space;
            text_y = topY - 1.25 * line_space;
          } else {
            topY += 0.25 * line_space;
            botY += 0.5 * line_space;
            arrow_y = botY + 0.25 * line_space;
            text_y = topY - line_space;
          }
          break;
      }

      // Draw the stroke
      if (this.type == Stroke.Type.BRUSH_DOWN ||
          this.type == Stroke.Type.BRUSH_UP) {
        this.context.fillRect(x + this.x_shift, topY, 1, botY - topY);
      } else {
        if (this.note instanceof Vex.Flow.StaveNote) {
          for (i = topY; i <= botY; i += line_space) {
            Vex.Flow.renderGlyph(this.context, x + this.x_shift - 4,
                                 i,
                                 this.render_options.font_scale, "va3");
          }
        } else {
          for (i = topY; i <= botY; i+= 10) {
            Vex.Flow.renderGlyph(this.context, x + this.x_shift - 4,
                                 i,
                                 this.render_options.font_scale, "va3");
          }
          if (this.type == Vex.Flow.Stroke.Type.RASQUEDO_DOWN)
            text_y = i + 0.25 * line_space;
        }
      }

      // Draw the arrow head
      Vex.Flow.renderGlyph(this.context, x + this.x_shift + arrow_shift_x, arrow_y,
                           this.render_options.font_scale, arrow);

      // Draw the rasquedo "R"
      if (this.type == Stroke.Type.RASQUEDO_DOWN ||
          this.type == Stroke.Type.RASQUEDO_UP) {
        this.context.save();
        this.context.setFont(this.font.family, this.font.size, this.font.weight);
        this.context.fillText("R", x + text_shift_x, text_y);
        this.context.restore();
      }
    }
  });

  return Stroke;
}());
define("vexflow", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.Vex;
    };
}(this)));

/**
 * Apply these functions to an object to make it selectable. The 
 *     {@link Selection} class will use these functions.
 * @mixin Selectable
 */

define('Selectable',[],function() {



/**
 * @lends  Selectable
 * @constructor
 */
var Selectable = function(){
    this._selected = false;
};

/**
 * Flag object as selected.
 * @private
 */
Selectable.prototype.select = function() {
    if (!this._selectLock) {
        this._selected = true;
    } 

    return this;
};

/**
 * Flag object as unselected
 * @private
 */
Selectable.prototype.deselect = function() {
    if (!this._selectLock) {
        this._selected = false;
    }

    return this;
};

/**
 * Determine if object is selected
 * @return {Boolean}
 * @public
 */
Selectable.prototype.isSelected = function() {
	return this._selected;
};

Selectable.prototype.selectLock = function() {
    this._selectLock = true;
    return this;
};

Selectable.prototype.selectUnlock = function() {
    this._selectLock = false;
    return this;
};

return Selectable;
	
});

/**
 * @class Time Signtaure class
 * @classDesc Time signature class that helps with relevent functions
 * The constructor defaults to 4/4 if nothing is passed 
 * @param {string} timeSigStr The signature string to parse
 */
define('TimeSignature',[],function() {



/**
 * @lends  TimeSignature
 * @constructor
 */
var TimeSignature = function(timeSigStr) {

    // Default to 4/4 time
    this.totalBeats = 4;
    this.beatValue = 4;

    this.setFromStr(timeSigStr);
};

/**
 * Get the total number of beats in the a measure (numerator)
 * @return {Number} Total beats
 */
TimeSignature.prototype.getTotalBeats = function(){
    return this.totalBeats;
};

/**
 * Get the beat value (denominator)
 * @return {[type]} [description]
 */
TimeSignature.prototype.getBeatValue = function(){
    return this.beatValue;
};

/**
 * Set the Time Signature from a string
 * @param  {String} timeSigStr A string representation of the time signature
 */
TimeSignature.prototype.setFromStr = function(timeSigStr)
{
    if (typeof timeSigStr != "string") throw 'InvalidString Input is not of type string';

    //Split the string into the two parts
    var partArray = timeSigStr.split('/');

    if (partArray.length !== 2) throw "InvalidTimeSignatureString When parsed, the time signature string had an invalid number of parts";

    //Assign the parts to the properties
    this.setTotalBeats(parseInt(partArray[0], 10));
    this.setBeatValue(parseInt(partArray[1], 10));

    return this;
};

/**
 * Set the total number of beats in the time signature
 * @param  {Number} totalBeats The total beats in the measure
 */
TimeSignature.prototype.setTotalBeats = function(totalBeats){
    if (typeof totalBeats !== "number") throw 'InvalidNumber totalBeats is not of type Number';
    if (totalBeats > 0)
        this.totalBeats = totalBeats;
    return this;
};

/**
 * Set the beat value in the time signature
 * @param  {Number} beatValue The value of the beat
 */
TimeSignature.prototype.setBeatValue = function(beatValue){
    if (typeof beatValue !== "number") throw 'InvalidNumber beat Value is not of type "number"';
    if (beatValue != 1 &&
        beatValue != 2 &&
        beatValue != 4 &&
        beatValue != 8 &&
        beatValue != 16 &&
        beatValue != 32 &&
        beatValue != 64
        ) throw 'InvalidBeatValue Beat value is not a valid note duration';

    this.beatValue = beatValue;
    return this;
};

/**
 * Return the Time Signature as an Array
 * @return {Array} Array of the time signature
 */
TimeSignature.prototype.toArray = function() {
    return [this.totalBeats, this.beatValue];
};

/**
 * Return the Time Signature as a String
 * @return {String} Representation of time signature in string format
 */
TimeSignature.prototype.toString = function() {
    return this.totalBeats + "/" + this.beatValue;
};

/**
 * Return the Time Signature as an Object. Used specifically for 
 * MusicXML exporting. Don't change the keys.
 * @return {Object} {beat, beat-type}
 */
TimeSignature.prototype.toObject = function() {
    return {
        'beats': this.totalBeats,
        'beat-type': this.beatValue
    };
};

return TimeSignature;

});

define('Helpers',['./TimeSignature', 'underscore'], function(TimeSignature, _){

/**
 * @appName Untitled Editor
 * @author Cyril Silverman - silverwolf90@gmail.com
 * @copyright Cyril Silverman
 * @version Pre-Alpha 0.1
 */

/**
 * @class Contains all the helper methods
 * @static
 */
Helpers = {};

// Helper function to simulate inheritance
Helpers.inherit = function(subclass, superclass) {
    subclass.prototype             = new superclass();
    subclass.prototype.constructor = subclass;
    subclass.superclass            = superclass.prototype;
};


Helpers.mixin = function(target, mixin) {
    _(target).extend(new mixin());
};

Helpers.isContainerItem = function(item) {
    if ("parent" in item)
        return true;
    return false;
};

Helpers.getIndices = function(items) {
var indices = _.map(items, function(item){
        return item.getIndex();
    });

    return indices;
};

Helpers.getClickedMeasure = function(measures, click) {
    var clickedMeasure;

    // Search through the part's measures and...
    for (var i = 0; i < measures.length; i++) {
        var measure = measures[i];
        var stave = measure.view.vf_stave;

        // ...if the click is within the stave
        if (stave.containsPoint(click.x, click.y)) {
            return measure;
        }
    }
    return false;
};

Helpers.findParent = function(obj, parentType) {
    if (!obj){          // Return if no object provided
        return false;
    }

    if (obj.parent) {
        return obj.parent.type === parentType ? obj.parent : Helpers.findParent(obj.parent, parentType);
    } else {
        return false;
    }
};

/**
 * Gets the total ticks from an array of notes
 * 
 * @param {Array} notes Array of notes
 * 
 * @return {number} The total number of ticks 
 */         
Helpers.getTicksSum = function(notes) {
    if (!notes instanceof Array) throw new Vex.RERR("InavlidArray", "getTicksSum() needs input of type Array");

    if (notes.length === 0) 
        return 0 ;

    var sum = _.reduce(notes, function(tickTotal, note){
        return (tickTotal + note.getTicks());
    }, 0);

    return sum;
};

/**
 * Get ticks for a singular note
 * 
 * @param  {Note} note Note to determine ticks
 * 
 * @return {number} Ticks in note
 */
Helpers.getTicks = function(note) {
    var ticks = 0;
    var prevDuration = Vex.Flow.durationToTicks.durations[note.duration.split('r')[0]];
    for (var j = 0;  j < note.dots; j++)
    {
        ticks += (prevDuration/2);
        prevDuration = prevDuration/2;
    }
    ticks += Vex.Flow.durationToTicks.durations[note.duration.split('r')[0]];
    
    return ticks;
};

/**
 * Collects all the notes and outputs an array of all the converted 
 * frequencies
 * @param  {Part} part The part from which to collect the frequencies
 * @returns {Array} An array of all the frequencies for each note/chord in 
 *                  order
 */
Helpers.collectFrequencies = function(part, voiceNum) {
    var frequencies = [];
    part.measures.forEach(function(measure){
        var voice = measure.voices[voiceNum];

        if (!voice) return;

        voice.notes.forEach(function(note){
            // Frequencies to be played simultateously as a chord
            var freqGroup = []; 
            if (note.isRest()) {
                freqGroup.push(0);
            } else {
                note.keys.forEach(function(key){
                    freqGroup.push(key.frequency());
                });
            }

            frequencies.push(freqGroup);
        });
    });

    return frequencies;
};

/**
 * Collects all the lengths of the notes in seconds
 * @param  {Number} bpm      The beats per minute
 * @param  {Part} part     The part to collect the notes from
 * @param  {Number} voiceNum The voice to collect from
 * @return {Number[]}          An array of all the note lengths for the voice
 */
Helpers.collectNoteSeconds = function(bpm, part, voiceNum) {
    if (typeof bpm !== 'number') {
        throw "INVALID BPM , must be a number";
    }
    var durations = [];
    part.measures.forEach(function(measure){
        var voice = measure.voices[voiceNum];

        if (!voice) return;

        voice.notes.forEach(function(note){
            durations.push(note.duration.inSeconds(bpm));
        });
    });

    return durations;
};

/**
 * Collects all the notes and outputs an array of all the durations
 * @param  {Staff} part The part from which to collect the durations
 * @returns {Array} An array of all the durations for each note in 
 *                  order
 */
Helpers.collectDurations = function(part, voiceNum) {
    var durations = [];


    part.measures.forEach(function(measure){

        var voice = measure.voices[voiceNum];

        if (!voice) return;

        voice.notes.forEach(function(note){
            var duration;
            if (note.isRest() && note.fillsMeasure()) {
                var timeSig = new TimeSignature(measure.staffSpecs[0].get('timeSignature'));

                var totalBeats = timeSig.getTotalBeats();
                var schedulerBeatValue = 1 / (timeSig.getBeatValue() * (1/4));

                duration = totalBeats * schedulerBeatValue;
            } else {
                duration = note.duration.getSchedulerDuration();
            }

            durations.push(duration);
        });

    });

    return durations;
};

/**
 * The function is used to find a position with a matching string number as
 * the string parameter. This function is used when moving the selection around
 * on a TabMeasure. We want to be able to select an empty string position, but
 * if the string already has a position, get the index in order to edit it.
 * 
 * @param  {Note} note   The note to search for the position in
 * @param  {number} string The string number to find a position on
 * @return {number}        Returns either the index of the position, 
 *                         or -1 if the string has no position
 */
Helpers.findPositionWithString = function(note, string) {
    var hasRest =/r/;
    if (hasRest.test(note.duration))
        return 0;

    for (var i = 0; note && i < note.keys.length; i++)
    {
        if (note.keys[i].string === string)
            return note.keys[i];
    }
    return false;
};


/**
 * Function for drawing a round rectangle. 
 * Used to make the selection corners rounded and pretty lol
 */
Helpers.roundRect = function(context, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === "undefined" ) {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }

    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();

    if (stroke) {
        context.stroke();
    }
    if (fill) {
        context.fill();
    }        
};

xoff = 0;
yoff = 0;

/**
 * Figures out the click was located relative the X/Y positions of the 
 * canvas element
 */
Helpers.relMouseCoords = function(event, element, scale){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0 + xoff;
    var canvasY = 0 + yoff;
    var currentElement = element;

    do {
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while(currentElement == currentElement.offsetParent);

    canvasX += (event.pageX - totalOffsetX) / (scale) ;
    canvasY +=  (event.pageY - totalOffsetY) / (scale);

    return {x:  canvasX, y:  canvasY};
};

return Helpers;

});


/**
 * @class NoteItem
 * @classDesc A sub-item of Note. A Key or tab Posision
 * @abstract
 * @memberOf ScoreModel
 */

define('NoteItem',[
    './Selectable', 
    './Helpers'], 
function(
    Selectable, 
    Helpers) {



/**
 * @lends NoteItem
 * @constructor
 */
var NoteItem = function() {
	this.init();
};

NoteItem.prototype = {
    /**
     * The parent Note
     * @type {Note|TabNote}
     */
	get note() {
		return this.parent;
	}
};

NoteItem.prototype.init = function() {
	Helpers.mixin(this, Selectable);
    /**
     * The articulations for this specific NoteItem
     * @type {Array}
     */
	this.articulations = [];
};

/**
 * Add articulation to the NoteItem
 * @param  {Vex.Flow.Articulation} articulation
 */
NoteItem.prototype.addArticulation = function(articulation) {
	this.articulations.push(articulation);
	return this;
};

return NoteItem;

});
define('../lib/music2',[],function() {

/*
 *  MUSIC.js - a music creation library containing functions and data sets to generate notes, intervals, chords, scales, ...
 *  (currently for twelve-tone equal temperament tuning only)
 *
 *  developed by Greg Jopa and Piers Titus
 *
 */
var MUSIC = {
    // notes - two dimensional [octave, fifth] - relative to the 'main' note
    notes: {
        'Fb': [6, -10],
        'Cb': [5, -9],
        'Gb': [5, -8],
        'Db': [4, -7],
        'Ab': [4, -6],
        'Eb': [3, -5],
        'Bb': [3, -4],

        'F': [2, -3],
        'C': [1, -2],
        'G': [1, -1],
        'D': [0, 0],
        'A': [0, 1],
        'E': [-1, 2],
        'B': [-1, 3],

        'F#': [-2, 4],
        'C#': [-3, 5],
        'G#': [-3, 6],
        'D#': [-4, 7],
        'A#': [-4, 8],
        'E#': [-5, 9],
        'B#': [-5, 10]
    },

    baseFreq: 440,  // A4 'main' note
    baseOffset: [4, 1],  // offset of base note from D0

    // intervals - two dimensional [octave, fifth] - relative to the 'main' note
    intervals: {
        'unison':           [0, 0],
        'minor second':     [3, -5],
        'major second':     [-1, 2],
        'minor third':      [2, -3],
        'major third':      [-2, 4],
        'fourth':           [1, -1],
        'augmented fourth': [-3, 6],
        'tritone':          [-3, 6],
        'diminished fifth': [4, -6],
        'fifth':            [0, 1],
        'minor sixth':      [3, -4],
        'major sixth':      [-1, 3],
        'minor seventh':    [2, -2],
        'major seventh':    [-2, 5],
        'octave':           [1, 0]
    },

    intervals_semitones: {
        0:  [0, 0],
        1:  [3, -5],
        2:  [-1, 2],
        3:  [2, -3],
        4:  [-2, 4],
        5:  [1, -1],
        6:  [-3, 6],
        7:  [0, 1],
        8:  [3, -4],
        9:  [-1, 3],
        10: [2, -2],
        11: [-2, 5],
        12: [1, 0]
    },

    scales: {
        'major': ['major second', 'major third', 'fourth', 'fifth', 'major sixth', 'major seventh'],
        'natural minor': ['major second', 'minor third', 'fourth', 'fifth', 'minor sixth', 'minor seventh'],
        'harmonic minor': ['major second', 'minor third', 'fourth', 'fifth', 'minor sixth', 'major seventh'],
        'major pentatonic': ['major second', 'major third', 'fifth', 'major sixth'],
        'minor pentatonic': ['minor third', 'fourth', 'minor sixth', 'minor seventh']
    }
};


/**
 * NoteHelper class
 *
 * @param {Number}x2 coord
 *
 * @constructor
*/
var NoteHelper = function(coord) {
    this.coord = coord;
};

MUSIC.NoteHelper = NoteHelper;

NoteHelper.prototype.frequency = function() {
    return MUSIC.baseFreq * Math.pow(2.0, (this.coord[0] * 1200 + this.coord[1] * 700) / 1200);
};

NoteHelper.prototype.accidental = function() {
    return Math.round((this.coord[1] + MUSIC.baseOffset[1]) / 7);
};

NoteHelper.prototype.octave = function() {
    // calculate octave of base note without accidentals
    var acc = this.accidental();
    return this.coord[0] + MUSIC.baseOffset[0] + 4 * acc + Math.floor((this.coord[1] + MUSIC.baseOffset[1] - 7 * acc) / 2);
};

NoteHelper.prototype.latin = function() {
    var noteNames = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
    var accidentals = ['bb', 'b', '', '#', 'x'];
    var acc = this.accidental();
    return noteNames[this.coord[1] + MUSIC.baseOffset[1] - acc * 7 + 3] + accidentals[acc + 2];
};

NoteHelper.fromLatin = function(name) {

    var out = [],
        j = 0,
        i, coord;

    var n = name.split(/(\d+)/);

    if (n.length > 3) {
  
        for (i = 0; i < (n.length - 1) / 2; i++) {

            coord = MUSIC.notes[n[j]];
            coord = [coord[0] + parseInt(n[j + 1], 10), coord[1]];

            coord[0] -= MUSIC.baseOffset[0];
            coord[1] -= MUSIC.baseOffset[1];

            out[i] = new NoteHelper(coord);
            j += 2;
        }
        return out;
    }
    else
    {
        coord = MUSIC.notes[n[0]];
        coord = [coord[0] + parseInt(n[1], 10), coord[1]];

        coord[0] -= MUSIC.baseOffset[0];
        coord[1] -= MUSIC.baseOffset[1];

        return new NoteHelper(coord);
    }
};

NoteHelper.prototype.scale = function(name) {

    var out = [],
        i;  
    
    var scale = MUSIC.scales[name];

    out.push(this.add('unison'));
    
    for (i = 0; i < scale.length; i++) {
        out[i + 1] = this.add(Interval.fromName(scale[i]));
    }

    out.push(this.add('octave'));

    return out;
};

NoteHelper.prototype.add = function(interval) {
  
    var out = [],
        i;
  
    // if input is string try to parse it as interval
    if (typeof(interval) == 'string') {
        interval = Interval.fromName(interval);
    }

    // if input is an array return an array
    if (interval.length) {

        for (i = 0; i < interval.length; i++) {
            out[i] = this.add(interval[i]);
        }
        add_addsubtract_func(out);

        return out;
    } 
    else {
        return new NoteHelper([this.coord[0] + interval.coord[0], this.coord[1] + interval.coord[1]]);
    }
};

NoteHelper.prototype.subtract = function(interval) {
  
    var out = [],
        i, coord;
      
    // if input is string try to parse it as interval 
    if (typeof(interval) == 'string') {
        interval = Interval.fromName(interval);
    }
    
    // if input is an array return an array
    if (interval.length) {

        for (i = 0; i < interval.length; i++) {
            out[i] = this.subtract(interval[i]);
        }

        add_addsubtract_func(out);

        return out;

    } 
    else {
        coord = [this.coord[0] - interval.coord[0], this.coord[1] - interval.coord[1]];
        if (typeof(interval.frequency) == 'function') {
            // if input is another note return the difference as interval
            return new Interval(coord);
        } else {
            return new NoteHelper(coord);
        }
    }
};

/**
 * Interval class
 *
 * @param {Number}x2 coord
 *
 * @constructor
 */
function Interval(coord) {
    this.coord = coord;
}

MUSIC.Interval = Interval;

Interval.fromName = function(name) {
    return new Interval(MUSIC.intervals[name]);
};

Interval.fromSemitones = function(num) {
    return new Interval(MUSIC.intervals_semitones[num]);
};

Interval.fromTonesSemitones = function(tone_semitone) {
    // multiply [tones, semitones] vector with [-1 2;3 -5] to get coordinate from tones and semitones
    return new Interval([tone_semitone[0] * -1 + tone_semitone[1] * 3, tone_semitone[0] * 2 + tone_semitone[1] * -5]);
};

Interval.prototype.tone_semitone = function() {
    // multiply coord vector with [5 2;3 1] to get coordinate in tones and semitones
    // [5 2;3 1] is the inverse of [-1 2;3 -5], which is the coordinates of [tone; semitone]
    return [this.coord[0] * 5 + this.coord[1] * 3, this.coord[0] * 2 + this.coord[1] * 1];
};

Interval.prototype.semitone = function() {
    // number of semitones of interval = tones * 2 + semitones
    var tone_semitone = this.tone_semitone();
    return tone_semitone[0] * 2 + tone_semitone[1];
};

Interval.prototype.add = function(interval) {
    if (typeof(interval) == 'string') {
        interval = Interval.fromName(interval);
    }
    return new Interval([this.coord[0] + interval.coord[0], this.coord[1] + interval.coord[1]]);
};

Interval.prototype.subtract = function(interval) {
    if (typeof(interval) == 'string') {
        interval = Interval.fromName(interval);
    }
    return new NoteHelper([this.coord[0] - interval.coord[0], this.coord[1] - interval.coord[1]]);
};


/**
 * function to add the .add and .subtract functions to an array. Those functions now are executed for each element in an array.
 */
function add_addsubtract_func(array) {
    array.add = function(that) {
        var out = [],
            x;
          
        for (x in this) {
            if (typeof(this[x]) == 'object') {
                out[x] = this[x].add(that);
            }
        }
        add_addsubtract_func(out);
        return out;
    };
    array.subtract = function(that) {
        var out = [],
            x;
          
        for (x in this) {
            if (typeof(this[x]) == 'object') {
                out[x] = this[x].subtract(that);
            }
        }

        add_addsubtract_func(out);

        return out;
    };
    return array;
}

return MUSIC;

});
/*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the Daniel Guerrero nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
 
var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = Math.ceil( (3*input.length) / 4.0);
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);

		return ab;
	},

	decode: function(input, arrayBuffer) {
		//get last chars to see if are valid
		var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));		 
		var lkey2 = this._keyStr.indexOf(input.charAt(input.length-1));		 

		var bytes = Math.ceil( (3*input.length) / 4.0);
		if (lkey1 == 64) bytes--; //padding chars, so skip
		if (lkey2 == 64) bytes--; //padding chars, so skip

		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;

		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}

		return uarray;	
	}
};
define("base64binary", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.Base64Binary;
    };
}(this)));

// http://ntt.cc/2008/01/19/base64-encoder-decoder-with-javascript.html

// window.atob and window.btoa

(function (window) {

	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	
	window.btoa || (window.btoa = function encode64(input) {
		input = escape(input);
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		return output;
	});
	
	window.atob || (window.atob = function(input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		var base64test = /[^A-Za-z0-9\+\/\=]/g;
		if (base64test.exec(input)) {
			alert("There were invalid base64 characters in the input text.\n" + "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" + "Expect errors in decoding.");
		}
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		do {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		return unescape(output);
	});

}(this));
define("base64", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.Base64;
    };
}(this)));

/*
	-------------------------------------
	MIDI.audioDetect : 0.3
	-------------------------------------
	https://github.com/mudcube/MIDI.js
	-------------------------------------
	Probably, Maybe, No... Absolutely!
	-------------------------------------
	Test to see what types of <audio> MIME types are playable by the browser.
	-------------------------------------
*/

if (typeof(MIDI) === "undefined") var MIDI = {};

(function() { 

var supports = {};	
var canPlayThrough = function (src) {
	var audio = new Audio();
	var mime = src.split(";")[0];
	audio.id = "audio";
	audio.setAttribute("preload", "auto");
	audio.setAttribute("audiobuffer", true);
	audio.addEventListener("canplaythrough", function() {
		supports[mime] = true;
	}, false);
	audio.src = "data:" + src;
	document.body.appendChild(audio);
};

MIDI.audioDetect = function(callback) {
	// check whether <audio> tag is supported
	if (typeof(Audio) === "undefined") return callback({});
	// check whether canPlayType is supported
	var audio = new Audio();
	if (typeof(audio.canPlayType) === "undefined") return callback(supports);
	// see what we can learn from the browser
	var vorbis = audio.canPlayType('audio/ogg; codecs="vorbis"');
	vorbis = (vorbis === "probably" || vorbis === "maybe");
	var mpeg = audio.canPlayType('audio/mpeg');
	mpeg = (mpeg === "probably" || mpeg === "maybe");
	// maybe nothing is supported
	if (!vorbis && !mpeg) {
		callback(supports);
		return;
	}
	// or maybe something is supported
	if (vorbis) canPlayThrough("audio/ogg;base64,T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA=");
	if (mpeg) canPlayThrough("audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
	// lets find out!
	var time = (new Date()).getTime(); 
	var interval = window.setInterval(function() {
		for (var key in supports) {}
		var now = (new Date()).getTime();
		var maxExecution = now - time > 5000;
		if (key || maxExecution) {
			window.clearInterval(interval);
			callback(supports);
		}
	}, 1);
};

})();
/*
	-----------------------------------------------------------
	MIDI.loadPlugin : 0.1.2 : 01/18/2012
	-----------------------------------------------------------
	https://github.com/mudcube/MIDI.js
	-----------------------------------------------------------
	MIDI.loadPlugin({
		instrument: "acoustic_grand_piano", // or 1 (default)
		instruments: [ "acoustic_grand_piano", "acoustic_guitar_nylon" ], // or multiple instruments
		callback: function() { }
	});
*/

if (typeof (MIDI) === "undefined") var MIDI = {};
if (typeof (MIDI.Soundfont) === "undefined") MIDI.Soundfont = {};

(function() { 

// Turn on to get "onprogress" event. XHR will not work from file://
var USE_XHR = false; 

MIDI.loadPlugin = function(conf) {
	if (typeof(conf) === "function") conf = { callback: conf };
	/// Get the instrument name.
	var instruments = conf.instruments || conf.instrument || "acoustic_grand_piano";
	if (typeof(instruments) !== "object") instruments = [ instruments ];
	instruments.map(function(data) {
		if (typeof(data) === "number") data = MIDI.GeneralMIDI.byId[data];
		return data;		
	});
	///
	MIDI.soundfontUrl = conf.soundfontUrl || MIDI.soundfontUrl || "./soundfont/";
	/// Detect the best type of audio to use.
	MIDI.audioDetect(function(types) {
		var type = "";
		// use the most appropriate plugin if not specified
		if (typeof(type) === 'undefined') {
			if (plugins[window.location.hash]) {
				type = window.location.hash.substr(1);
			} else { //
				type = "";
			}
		}
		if (type === "") {
			if (navigator.requestMIDIAccess) {
				type = "webmidi";
			} else if (window.webkitAudioContext) { // Chrome
				type = "webaudio";
			} else if (window.Audio) { // Firefox
				type = "audiotag";
			} else { // Internet Explorer
				type = "flash";
			}
		}
		if (!connect[type]) return;
		// use audio/ogg when supported
		var filetype = types["audio/ogg"] ? "ogg" : "mp3";
		// load the specified plugin
		connect[type](filetype, instruments, conf.callback);
	});
};

///

var connect = {};

connect.webmidi = function(filetype, instruments, callback) {
	if (MIDI.loader) MIDI.loader.message("Web MIDI API...");
	MIDI.WebMIDI.connect(callback);
};

connect.flash = function(filetype, instruments, callback) {
	// fairly quick, but requires loading of individual MP3s (more http requests).
	if (MIDI.loader) MIDI.loader.message("Flash API...");
	DOMLoader.script.add({
		src: "./inc/SoundManager2/script/soundmanager2.js",
		verify: "SoundManager",
		callback: function () {
			MIDI.Flash.connect(callback);
		}
	});
};

connect.audiotag = function(filetype, instruments, callback) {
	if (MIDI.loader) MIDI.loader.message("HTML5 Audio API...");
	// works ok, kinda like a drunken tuna fish, across the board.
	var queue = createQueue({
		items: instruments,
		getNext: function(instrumentId) {
			if (USE_XHR) {
				DOMLoader.sendRequest({
					url: MIDI.soundfontUrl + instrumentId + "-" + filetype + ".js",
					onprogress: getPercent,
					onload: function (response) {
						MIDI.Soundfont[instrumentId] = JSON.parse(response.responseText);
						if (MIDI.loader) MIDI.loader.update(null, "Downloading", 100);
						queue.getNext();
					}
				});
			} else {
				DOMLoader.script.add({
					src: MIDI.soundfontUrl + instrumentId + "-" + filetype + ".js",
					verify: "MIDI.Soundfont." + instrumentId,
					callback: function() {
						if (MIDI.loader) MIDI.loader.update(null, "Downloading...", 100);
						queue.getNext();
					}
				});
			}
		},
		onComplete: function() {
			MIDI.AudioTag.connect(callback);
		}
	});
};

connect.webaudio = function(filetype, instruments, callback) {
	if (MIDI.loader) MIDI.loader.message("Web Audio API...");
	// works awesome! safari and chrome support
	var queue = createQueue({
		items: instruments,
		getNext: function(instrumentId) {
			if (USE_XHR) {
				DOMLoader.sendRequest({
					url: MIDI.soundfontUrl + instrumentId + "-" + filetype + ".js",
					onprogress: getPercent,
					onload: function(response) {
						MIDI.Soundfont[instrumentId] = JSON.parse(response.responseText);
						if (MIDI.loader) MIDI.loader.update(null, "Downloading...", 100);
						queue.getNext();
					}
				});
			} else {
				DOMLoader.script.add({
					src: MIDI.soundfontUrl + instrumentId + "-" + filetype + ".js",
					verify: "MIDI.Soundfont." + instrumentId,
					callback: function() {
						if (MIDI.loader) MIDI.loader.update(null, "Downloading...", 100);
						queue.getNext();
					}
				});
			}
		},
		onComplete: function() {
			MIDI.WebAudioAPI.connect(callback);
		}
	});
};

/// Helpers

var plugins = {
	"#webmidi": true, 
	"#webaudio": true, 
	"#audiotag": true, 
	"#flash": true 
};

var getPercent = function(event) {
	if (!this.totalSize) {
		if (this.getResponseHeader("Content-Length-Raw")) {
			this.totalSize = parseInt(this.getResponseHeader("Content-Length-Raw"));
		} else {
			this.totalSize = event.total;
		}
	}
	var percent = this.totalSize ? Math.round(event.loaded / this.totalSize * 100) : "";
	if (MIDI.loader) MIDI.loader.update(null, "Downloading...", percent);
};

var createQueue = function(conf) {
	var self = {};
	self.queue = [];
	for (var key in conf.items) {
		self.queue.push(conf.items[key]);
	}
	self.getNext = function() {
		if (!self.queue.length) return conf.onComplete();
		conf.getNext(self.queue.shift());
	};
	setTimeout(self.getNext, 1);
	return self;
};

})();
/*
	--------------------------------------------
	MIDI.Plugin : 0.3.2 : 2013/01/24
	--------------------------------------------
	https://github.com/mudcube/MIDI.js
	--------------------------------------------
	Inspired by javax.sound.midi (albeit a super simple version): 
		http://docs.oracle.com/javase/6/docs/api/javax/sound/midi/package-summary.html
	--------------------------------------------
	Technologies:
		MIDI.WebMIDIAPI
		MIDI.WebAudioAPI
		MIDI.Flash
		MIDI.HTML5
	--------------------------------------------
	Helpers:
		MIDI.GeneralMIDI
		MIDI.channels
		MIDI.keyToNote
		MIDI.noteToKey
*/

if (typeof (MIDI) === "undefined") var MIDI = {};

(function() { 

/*
	--------------------------------------------
	Web MIDI API - Native Soundbank
	--------------------------------------------
	https://dvcs.w3.org/hg/audio/raw-file/tip/midi/specification.html
*/

(function () {
	var plugin = null;
	var output = null;
	var channels = [];
	var root = MIDI.WebMIDI = {};

	root.setVolume = function (channel, volume) { // set channel volume
		output.send([0xB0 + channel, 0x07, volume]);
	};

	root.programChange = function (channel, program) { // change channel instrument
		output.send([0xC0 + channel, program]);
	};

	root.noteOn = function (channel, note, velocity, delay) {
		output.send([0x90 + channel, note, velocity], delay * 1000);
	};

	root.noteOff = function (channel, note, delay) {
		output.send([0x80 + channel, note], delay * 1000);
	};

	root.chordOn = function (channel, chord, velocity, delay) {
		for (var n = 0; n < chord.length; n ++) {
			var note = chord[n];
			output.send([0x90 + channel, note, velocity], delay * 1000);
		}
	};
	
	root.chordOff = function (channel, chord, delay) {
		for (var n = 0; n < chord.length; n ++) {
			var note = chord[n];
			output.send([0x80, channel, note, velocity], delay * 1000);
		}
	};
	
	root.stopAllNotes = function () {
		for (var channel = 0; channel < 16; channel ++) {
			output.send([0xB0 + channel, 0x7B, 0]);
		}
	};

	root.getInput = function () {
		return plugin.getInputs();
	};
	
	root.getOutputs = function () {
		return plugin.getOutputs();
	};

	root.connect = function (callback) {
		MIDI.technology = "Web MIDI API";
		MIDI.setVolume = root.setVolume;
		MIDI.programChange = root.programChange;
		MIDI.noteOn = root.noteOn;
		MIDI.noteOff = root.noteOff;
		MIDI.chordOn = root.chordOn;
		MIDI.chordOff = root.chordOff;
		MIDI.stopAllNotes = root.stopAllNotes;
		MIDI.getInput = root.getInput;
		MIDI.getOutputs = root.getOutputs;

		navigator.requestMIDIAccess(function (access) {
			plugin = access;
			output = plugin.getOutput(0);
			if (callback) callback();
		}, function (err) {
			console.log("uh-oh! Something went wrong!  Error code: " + err.code );
		});
	};
})();

/*
	--------------------------------------------
	Web Audio API - OGG or MPEG Soundbank
	--------------------------------------------
	https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html
	--------------------------------------------
*/

if (typeof (MIDI.WebAudioAPI) === "undefined") MIDI.WebAudioAPI = {};

if (window.AudioContext || window.webkitAudioContext) (function () {

	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var root = MIDI.WebAudioAPI;
	var ctx;
	var sources = {};
	var masterVolume = 1;
	var audioBuffers = {};
	var audioLoader = function (instrument, urlList, index, bufferList, callback) {
		var synth = MIDI.GeneralMIDI.byName[instrument];
		var instrumentId = synth.number;
		var url = urlList[index];
		var base64 = MIDI.Soundfont[instrument][url].split(",")[1];
		var buffer = Base64Binary.decodeArrayBuffer(base64);
		ctx.decodeAudioData(buffer, function (buffer) {
			var msg = url;
			while (msg.length < 3) msg += "&nbsp;";
			if (typeof (MIDI.loader) !== "undefined") {
				MIDI.loader.update(null, synth.instrument + "<br>Processing: " + (index / 87 * 100 >> 0) + "%<br>" + msg);
			}
			buffer.id = url;
			bufferList[index] = buffer;
			//
			if (bufferList.length === urlList.length) {
				while (bufferList.length) {
					buffer = bufferList.pop();
					if (!buffer) continue;
					var nodeId = MIDI.keyToNote[buffer.id];
					audioBuffers[instrumentId + "" + nodeId] = buffer;
				}
				callback(instrument);
			}
		});
	};

	root.setVolume = function (n) {
		masterVolume = n;
	};

	root.programChange = function (channel, program) {
		MIDI.channels[channel].instrument = program;
	};

	root.noteOn = function (channel, note, velocity, delay) {
		/// check whether the note exists
		if (!MIDI.channels[channel]) return;
		var instrument = MIDI.channels[channel].instrument;
		if (!audioBuffers[instrument + "" + note]) return;
		/// convert relative delay to absolute delay
		if (delay < ctx.currentTime) delay += ctx.currentTime;
		/// crate audio buffer
		var source = ctx.createBufferSource();
		sources[channel + "" + note] = source;
		source.buffer = audioBuffers[instrument + "" + note];
		source.connect(ctx.destination);
		///
		var gainNode = ctx.createGainNode();
		var value = (velocity / 100) * masterVolume * 2 - 1;
		gainNode.connect(ctx.destination);
		gainNode.gain.value = Math.max(-1, value);
		source.connect(gainNode);
		source.noteOn(delay || 0);
		return source;
	};

	root.noteOff = function (channel, note, delay) {
		delay = delay || 0;
		if (delay < ctx.currentTime) delay += ctx.currentTime;
		var source = sources[channel + "" + note];
		if (!source) return;
		// @Miranet: "the values of 0.2 and 0.3 could ofcourse be used as 
		// a 'release' parameter for ADSR like time settings."
		source.gain.linearRampToValueAtTime(1, delay);
		source.gain.linearRampToValueAtTime(0, delay + 0.2);
		source.noteOff(delay + 0.3);
		return source;
	};

	root.chordOn = function (channel, chord, velocity, delay) {
		var ret = {}, note;
		for (var n = 0, length = chord.length; n < length; n++) {
			ret[note = chord[n]] = root.noteOn(channel, note, velocity, delay);
		}
		return ret;
	};

	root.chordOff = function (channel, chord, delay) {
		var ret = {}, note;
		for (var n = 0, length = chord.length; n < length; n++) {
			ret[note = chord[n]] = root.noteOff(channel, note, delay);
		}
		return ret;
	};

	root.connect = function (callback) {
		MIDI.technology = "Web Audio API";
		MIDI.setVolume = root.setVolume;
		MIDI.programChange = root.programChange;
		MIDI.noteOn = root.noteOn;
		MIDI.noteOff = root.noteOff;
		MIDI.chordOn = root.chordOn;
		MIDI.chordOff = root.chordOff;
		//
		MIDI.Player.ctx = ctx = new AudioContext();
		///
		var urlList = [];
		var keyToNote = MIDI.keyToNote;
		for (var key in keyToNote) urlList.push(key);
		var bufferList = [];
		var pending = {};
		var oncomplete = function(instrument) {
			delete pending[instrument];
			for (var key in pending) break;
			if (!key) callback();
		};
		for (var instrument in MIDI.Soundfont) {
			pending[instrument] = true;
			for (var i = 0; i < urlList.length; i++) {
				audioLoader(instrument, urlList, i, bufferList, oncomplete);
			}
		}
	};
})();

/*
	AudioTag <audio> - OGG or MPEG Soundbank
	--------------------------------------
	http://dev.w3.org/html5/spec/Overview.html#the-audio-element
*/

if (window.Audio) (function () {

	var root = MIDI.AudioTag = {};
	var note2id = {};
	var volume = 1; // floating point 
	var channel_nid = -1; // current channel
	var channels = []; // the audio channels
	var notes = {}; // the piano keys
	for (var nid = 0; nid < 12; nid++) {
		channels[nid] = new Audio();
	}

	var playChannel = function (channel, note) {
		if (!MIDI.channels[channel]) return;
		var instrument = MIDI.channels[channel].instrument;
		var id = MIDI.GeneralMIDI.byId[instrument].id;
		var note = notes[note];
		if (!note) return;
		var nid = (channel_nid + 1) % channels.length;
		var time = (new Date()).getTime();
		var audio = channels[nid];
		audio.src = MIDI.Soundfont[id][note.id];
		audio.volume = volume;
		audio.play();
		channel_nid = nid;
	};

	root.programChange = function (channel, program) {
		MIDI.channels[channel].instrument = program;
	};

	root.setVolume = function (n) {
		volume = n;
	};

	root.noteOn = function (channel, note, velocity, delay) {
		var id = note2id[note];
		if (!notes[id]) return;
		if (delay) {
			return window.setTimeout(function () {
				playChannel(channel, id);
			}, delay * 1000);
		} else {
			playChannel(channel, id);
		}
	};
	
	root.noteOff = function (channel, note, delay) {

	};
	
	root.chordOn = function (channel, chord, velocity, delay) {
		for (var key in chord) {
			var n = chord[key];
			var id = note2id[n];
			if (!notes[id]) continue;
			playChannel(channel, id);
		}
	};
	
	root.chordOff = function (channel, chord, delay) {

	};
	
	root.stopAllNotes = function () {
		for (var nid = 0, length = channels.length; nid < length; nid++) {
			channels[nid].pause();
		}
	};
	root.connect = function (callback) {
		var loading = {};
		for (var key in MIDI.keyToNote) {
			note2id[MIDI.keyToNote[key]] = key;
			notes[key] = {
				id: key
			};
		}
		MIDI.technology = "HTML Audio Tag";
		MIDI.setVolume = root.setVolume;
		MIDI.programChange = root.programChange;
		MIDI.noteOn = root.noteOn;
		MIDI.noteOff = root.noteOff;
		MIDI.chordOn = root.chordOn;
		MIDI.chordOff = root.chordOff;
		///
		if (callback) callback();
	};
})();

/*
	--------------------------------------------
	Flash - MP3 Soundbank
	--------------------------------------------
	http://www.schillmania.com/projects/soundmanager2/
	--------------------------------------------
*/
	
(function () {

	var root = MIDI.Flash = {};
	var noteReverse = {};
	var notes = {};

	root.programChange = function (channel, program) {
		MIDI.channels[channel].instrument = program;
	};

	root.setVolume = function (channel, note) {

	};

	root.noteOn = function (channel, note, velocity, delay) {
		if (!MIDI.channels[channel]) return;
		var instrument = MIDI.channels[channel].instrument;
		var id = MIDI.GeneralMIDI.byId[instrument].number;
		note = id + "" + noteReverse[note];
		if (!notes[note]) return;
		if (delay) {
			return window.setTimeout(function() { 
				notes[note].play({ volume: velocity * 2 });
			}, delay * 1000);
		} else {
			notes[note].play({ volume: velocity * 2 });
		}
	};

	root.noteOff = function (channel, note, delay) {

	};

	root.chordOn = function (channel, chord, velocity, delay) {
		if (!MIDI.channels[channel]) return;
		var instrument = MIDI.channels[channel].instrument;
		var id = MIDI.GeneralMIDI.byId[instrument].number;
		for (var key in chord) {
			var n = chord[key];
			var note = id + "" + noteReverse[n];
			if (notes[note]) {
				notes[note].play({ volume: velocity * 2 });
			}
		}
	};

	root.chordOff = function (channel, chord, delay) {

	};

	root.stopAllNotes = function () {

	};

	root.connect = function (callback) {
		soundManager.flashVersion = 9;
		soundManager.useHTML5Audio = true;
		soundManager.url = '../inc/SoundManager2/swf/';
		soundManager.useHighPerformance = true;
		soundManager.wmode = 'transparent';
		soundManager.flashPollingInterval = 1;
		soundManager.debugMode = false;
		soundManager.onload = function () {
			var createBuffer = function(instrument, id, onload) {
				var synth = MIDI.GeneralMIDI.byName[instrument];
				var instrumentId = synth.number;
				notes[instrumentId+""+id] = soundManager.createSound({
					id: id,
					url: MIDI.soundfontUrl + instrument + "-mp3/" + id + ".mp3",
					multiShot: true,
					autoLoad: true,
					onload: onload
				});			
			};
			for (var instrument in MIDI.Soundfont) {
				var loaded = [];
				var onload = function () {
					loaded.push(this.sID);
					if (typeof (MIDI.loader) === "undefined") return;
					MIDI.loader.update(null, "Processing: " + this.sID);
				};
				for (var i = 0; i < 88; i++) {
					var id = noteReverse[i + 21];
					createBuffer(instrument, id, onload);
				}
			}
			///
			MIDI.technology = "Flash";
			MIDI.setVolume = root.setVolume;
			MIDI.programChange = root.programChange;
			MIDI.noteOn = root.noteOn;
			MIDI.noteOff = root.noteOff;
			MIDI.chordOn = root.chordOn;
			MIDI.chordOff = root.chordOff;
			//
			var interval = window.setInterval(function () {
				if (loaded.length !== 88) return;
				window.clearInterval(interval);
				if (callback) callback();
			}, 25);
		};
		soundManager.onerror = function () {

		};
		for (var key in MIDI.keyToNote) {
			noteReverse[MIDI.keyToNote[key]] = key;
		}
	};
})();

/*
	helper functions
*/

// instrument-tracker
MIDI.GeneralMIDI = (function (arr) {
	var clean = function(v) {
		return v.replace(/[^a-z0-9 ]/gi, "").replace(/[ ]/g, "_").toLowerCase();
	};
	var ret = {
		byName: {},
		byId: {},
		byCategory: {}
	};
	for (var key in arr) {
		var list = arr[key];
		for (var n = 0, length = list.length; n < length; n++) {
			var instrument = list[n];
			if (!instrument) continue;
			var num = parseInt(instrument.substr(0, instrument.indexOf(" ")), 10);
			instrument = instrument.replace(num + " ", "");
			ret.byId[--num] = 
			ret.byName[clean(instrument)] = 
			ret.byCategory[clean(key)] = {
				id: clean(instrument),
				instrument: instrument,
				number: num,
				category: key
			};
		}
	}
	return ret;
})({
	'Piano': ['1 Acoustic Grand Piano', '2 Bright Acoustic Piano', '3 Electric Grand Piano', '4 Honky-tonk Piano', '5 Electric Piano 1', '6 Electric Piano 2', '7 Harpsichord', '8 Clavinet'],
	'Chromatic Percussion': ['9 Celesta', '10 Glockenspiel', '11 Music Box', '12 Vibraphone', '13 Marimba', '14 Xylophone', '15 Tubular Bells', '16 Dulcimer'],
	'Organ': ['17 Drawbar Organ', '18 Percussive Organ', '19 Rock Organ', '20 Church Organ', '21 Reed Organ', '22 Accordion', '23 Harmonica', '24 Tango Accordion'],
	'Guitar': ['25 Acoustic Guitar (nylon)', '26 Acoustic Guitar (steel)', '27 Electric Guitar (jazz)', '28 Electric Guitar (clean)', '29 Electric Guitar (muted)', '30 Overdriven Guitar', '31 Distortion Guitar', '32 Guitar Harmonics'],
	'Bass': ['33 Acoustic Bass', '34 Electric Bass (finger)', '35 Electric Bass (pick)', '36 Fretless Bass', '37 Slap Bass 1', '38 Slap Bass 2', '39 Synth Bass 1', '40 Synth Bass 2'],
	'Strings': ['41 Violin', '42 Viola', '43 Cello', '44 Contrabass', '45 Tremolo Strings', '46 Pizzicato Strings', '47 Orchestral Harp', '48 Timpani'],
	'Ensemble': ['49 String Ensemble 1', '50 String Ensemble 2', '51 Synth Strings 1', '52 Synth Strings 2', '53 Choir Aahs', '54 Voice Oohs', '55 Synth Choir', '56 Orchestra Hit'],
	'Brass': ['57 Trumpet', '58 Trombone', '59 Tuba', '60 Muted Trumpet', '61 French Horn', '62 Brass Section', '63 Synth Brass 1', '64 Synth Brass 2'],
	'Reed': ['65 Soprano Sax', '66 Alto Sax', '67 Tenor Sax', '68 Baritone Sax', '69 Oboe', '70 English Horn', '71 Bassoon', '72 Clarinet'],
	'Pipe': ['73 Piccolo', '74 Flute', '75 Recorder', '76 Pan Flute', '77 Blown Bottle', '78 Shakuhachi', '79 Whistle', '80 Ocarina'],
	'Synth Lead': ['81 Lead 1 (square)', '82 Lead 2 (sawtooth)', '83 Lead 3 (calliope)', '84 Lead 4 (chiff)', '85 Lead 5 (charang)', '86 Lead 6 (voice)', '87 Lead 7 (fifths)', '88 Lead 8 (bass + lead)'],
	'Synth Pad': ['89 Pad 1 (new age)', '90 Pad 2 (warm)', '91 Pad 3 (polysynth)', '92 Pad 4 (choir)', '93 Pad 5 (bowed)', '94 Pad 6 (metallic)', '95 Pad 7 (halo)', '96 Pad 8 (sweep)'],
	'Synth Effects': ['97 FX 1 (rain)', '98 FX 2 (soundtrack)', '99 FX 3 (crystal)', '100 FX 4 (atmosphere)', '101 FX 5 (brightness)', '102 FX 6 (goblins)', '103 FX 7 (echoes)', '104 FX 8 (sci-fi)'],
	'Ethnic': ['105 Sitar', '106 Banjo', '107 Shamisen', '108 Koto', '109 Kalimba', '110 Bagpipe', '111 Fiddle', '112 Shanai'],
	'Percussive': ['113 Tinkle Bell', '114 Agogo', '115 Steel Drums', '116 Woodblock', '117 Taiko Drum', '118 Melodic Tom', '119 Synth Drum'],
	'Sound effects': ['120 Reverse Cymbal', '121 Guitar Fret Noise', '122 Breath Noise', '123 Seashore', '124 Bird Tweet', '125 Telephone Ring', '126 Helicopter', '127 Applause', '128 Gunshot']
});

// channel-tracker
MIDI.channels = (function () { // 0 - 15 channels
	var channels = {};
	for (var n = 0; n < 16; n++) {
		channels[n] = { // default values
			instrument: 0,
			// Acoustic Grand Piano
			mute: false,
			mono: false,
			omni: false,
			solo: false
		};
	}
	return channels;
})();

//
MIDI.pianoKeyOffset = 21;

// note conversions
MIDI.keyToNote = {}; // C8  == 108
MIDI.noteToKey = {}; // 108 ==  C8
(function () {
	var A0 = 0x15; // first note
	var C8 = 0x6C; // last note
	var number2key = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
	for (var n = A0; n <= C8; n++) {
		var octave = (n - 12) / 12 >> 0;
		var name = number2key[n % 12] + octave;
		MIDI.keyToNote[name] = n;
		MIDI.noteToKey[n] = name;
	}
})();

})();
/*
	-------------------------------------
	MIDI.Player : 0.3
	-------------------------------------
	https://github.com/mudcube/MIDI.js
	-------------------------------------
	#jasmid
	-------------------------------------
*/

if (typeof (MIDI) === "undefined") var MIDI = {};
if (typeof (MIDI.Player) === "undefined") MIDI.Player = {};

(function() { 

var root = MIDI.Player;
root.callback = undefined; // your custom callback goes here!
root.currentTime = 0;
root.endTime = 0; 
root.restart = 0; 
root.playing = false;
root.timeWarp = 1;

//
root.start =
root.resume = function () {
	if (root.currentTime < -1) root.currentTime = -1;
	startAudio(root.currentTime);
};

root.pause = function () {
	var tmp = root.restart;
	stopAudio();
	root.restart = tmp;
};

root.stop = function () {
	stopAudio();
	root.restart = 0;
	root.currentTime = 0;
};

root.addListener = function(callback) {
	onMidiEvent = callback;
};

root.removeListener = function() {
	onMidiEvent = undefined;
};

root.clearAnimation = function() {
	if (root.interval)  {
		window.clearInterval(root.interval);
	}
};

root.setAnimation = function(config) {
	var callback = (typeof(config) === "function") ? config : config.callback;
	var interval = config.interval || 30;
	var currentTime = 0;
	var tOurTime = 0;
	var tTheirTime = 0;
	//
	root.clearAnimation();
	root.interval = window.setInterval(function () {
		if (root.endTime === 0) return;
		if (root.playing) {
			currentTime = (tTheirTime === root.currentTime) ? tOurTime - (new Date).getTime() : 0;
			if (root.currentTime === 0) {
				currentTime = 0;
			} else {
				currentTime = root.currentTime - currentTime;
			}
			if (tTheirTime !== root.currentTime) {
				tOurTime = (new Date).getTime();
				tTheirTime = root.currentTime;
			}
		} else { // paused
			currentTime = root.currentTime;
		}
		var endTime = root.endTime;
		var percent = currentTime / endTime;
		var total = currentTime / 1000;
		var minutes = total / 60;
		var seconds = total - (minutes * 60);
		var t1 = minutes * 60 + seconds;
		var t2 = (endTime / 1000);
		if (t2 - t1 < -1) return;
		callback({
			now: t1,
			end: t2,
			events: noteRegistrar
		});
	}, interval);
};

// helpers

root.loadMidiFile = function() { // reads midi into javascript array of events
	root.replayer = new Replayer(MidiFile(root.currentData), root.timeWarp);
	root.data = root.replayer.getData();
	root.endTime = getLength();
};

root.loadFile = function (file, callback) {
	root.stop();
	if (file.indexOf("base64,") !== -1) {
		var data = window.atob(file.split(",")[1]);
		root.currentData = data;
		root.loadMidiFile();
		if (callback) callback(data);
		return;
	}
	///
	var title = file.split(" - ")[1] || file;
	document.getElementById("playback-title").innerHTML = title.replace(".mid","");
	///
	var fetch = new XMLHttpRequest();
	fetch.open('GET', file);
	fetch.overrideMimeType("text/plain; charset=x-user-defined");
	fetch.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var t = this.responseText || "";
			var ff = [];
			var mx = t.length;
			var scc = String.fromCharCode;
			for (var z = 0; z < mx; z++) {
				ff[z] = scc(t.charCodeAt(z) & 255);
			}
			var data = ff.join("");
			root.currentData = data;
			root.loadMidiFile();
			if (callback) callback(data);
		}
	};
	fetch.send();
};

// Playing the audio

var eventQueue = []; // hold events to be triggered
var queuedTime; // 
var startTime = 0; // to measure time elapse
var noteRegistrar = {}; // get event for requested note
var onMidiEvent = undefined; // listener callback
var scheduleTracking = function (channel, note, currentTime, offset, message, velocity) {
	var interval = window.setTimeout(function () {
		var data = {
			channel: channel,
			note: note,
			now: currentTime,
			end: root.endTime,
			message: message,
			velocity: velocity
		};
		//
		if (message === 128) {
			delete noteRegistrar[note];
		} else {
			noteRegistrar[note] = data;
		}
		if (onMidiEvent) {
			onMidiEvent(data);
		}
		root.currentTime = currentTime;
		if (root.currentTime === queuedTime && queuedTime < root.endTime) { // grab next sequence
			startAudio(queuedTime, true);
		}
	}, currentTime - offset);
	return interval;
};

var getContext = function() {
	if (MIDI.lang === 'WebAudioAPI') {
		return MIDI.Player.ctx;
	} else if (!root.ctx) {
		root.ctx = { currentTime: 0 };
	}
	return root.ctx;
};

var getLength = function() {
	var data =  root.data;
	var length = data.length;
	var totalTime = 0.5;
	for (var n = 0; n < length; n++) {
		totalTime += data[n][1];
	}
	return totalTime;
};

var startAudio = function (currentTime, fromCache) {
	if (!root.replayer) return;
	if (!fromCache) {
		if (typeof (currentTime) === "undefined") currentTime = root.restart;
		if (root.playing) stopAudio();
		root.playing = true;
		root.data = root.replayer.getData();
		root.endTime = getLength();
	}
	var note;
	var offset = 0;
	var messages = 0;
	var data = root.data;	
	var ctx = getContext();
	var length = data.length;
	//
	queuedTime = 0.5;
	startTime = ctx.currentTime;
	//
	for (var n = 0; n < length && messages < 100; n++) {
		queuedTime += data[n][1];
		if (queuedTime < currentTime) {
			offset = queuedTime;
			continue;
		}
		currentTime = queuedTime - offset;
		var event = data[n][0].event;
		if (event.type !== "channel") continue;
		var channel = event.channel;
		switch (event.subtype) {
			case 'noteOn':
				if (MIDI.channels[channel].mute) break;
				note = event.noteNumber - (root.MIDIOffset || 0);
				eventQueue.push({
					event: event,
					source: MIDI.noteOn(channel, event.noteNumber, event.velocity, currentTime / 1000 + ctx.currentTime),
					interval: scheduleTracking(channel, note, queuedTime, offset, 144, event.velocity)
				});
				messages ++;
				break;
			case 'noteOff':
				if (MIDI.channels[channel].mute) break;
				note = event.noteNumber - (root.MIDIOffset || 0);
				eventQueue.push({
					event: event,
					source: MIDI.noteOff(channel, event.noteNumber, currentTime / 1000 + ctx.currentTime),
					interval: scheduleTracking(channel, note, queuedTime, offset, 128)
				});
				break;
			default:
				break;
		}
	}
};

var stopAudio = function () {
	var ctx = getContext();
	root.playing = false;
	root.restart += (ctx.currentTime - startTime) * 1000;
	// stop the audio, and intervals
	while (eventQueue.length) {
		var o = eventQueue.pop();
		window.clearInterval(o.interval);
		if (!o.source) continue; // is not webaudio
		if (typeof(o.source) === "number") {
			window.clearTimeout(o.source);
		} else { // webaudio
			var source = o.source;
			source.disconnect(0);
			source.noteOff(0);
		}
	}
	// run callback to cancel any notes still playing
	for (var key in noteRegistrar) {
		var o = noteRegistrar[key]
		if (noteRegistrar[key].message === 144 && onMidiEvent) {
			onMidiEvent({
				channel: o.channel,
				note: o.note,
				now: o.now,
				end: o.end,
				message: 128,
				velocity: o.velocity
			});
		}
	}
	// reset noteRegistrar
	noteRegistrar = {};
};

})();
/*

	DOMLoader.XMLHttp
	--------------------------
	DOMLoader.sendRequest({
		url: "./dir/something.extension",
		data: "test!",
		onerror: function(event) {
			console.log(event);
		},
		onload: function(response) {
			console.log(response.responseText);
		}, 
		onprogress: function (event) {
			var percent = event.loaded / event.total * 100 >> 0;
			loader.message("loading: " + percent + "%");
		}
	});
	
*/

if (typeof(DOMLoader) === "undefined") var DOMLoader = {};

// Add XMLHttpRequest when not available

if (typeof (XMLHttpRequest) === "undefined") {
	var XMLHttpRequest;
	(function () { // find equivalent for IE
		var factories = [
		function () {
			return new ActiveXObject("Msxml2.XMLHTTP")
		}, function () {
			return new ActiveXObject("Msxml3.XMLHTTP")
		}, function () {
			return new ActiveXObject("Microsoft.XMLHTTP")
		}];
		for (var i = 0; i < factories.length; i++) {
			try {
				factories[i]();
			} catch (e) {
				continue;
			}
			break;
		}
		XMLHttpRequest = factories[i];
	})();
}

if (typeof ((new XMLHttpRequest()).responseText) === "undefined") {
	// http://stackoverflow.com/questions/1919972/how-do-i-access-xhr-responsebody-for-binary-data-from-javascript-in-ie
    var IEBinaryToArray_ByteStr_Script =
    "<!-- IEBinaryToArray_ByteStr -->\r\n"+
    "<script type='text/vbscript'>\r\n"+
    "Function IEBinaryToArray_ByteStr(Binary)\r\n"+
    "   IEBinaryToArray_ByteStr = CStr(Binary)\r\n"+
    "End Function\r\n"+
    "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n"+
    "   Dim lastIndex\r\n"+
    "   lastIndex = LenB(Binary)\r\n"+
    "   if lastIndex mod 2 Then\r\n"+
    "       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n"+
    "   Else\r\n"+
    "       IEBinaryToArray_ByteStr_Last = "+'""'+"\r\n"+
    "   End If\r\n"+
    "End Function\r\n"+
    "</script>\r\n";

	// inject VBScript
	document.write(IEBinaryToArray_ByteStr_Script);

	DOMLoader.sendRequest = function(conf) {
		// helper to convert from responseBody to a "responseText" like thing
		function getResponseText(binary) {
			var byteMapping = {};
			for (var i = 0; i < 256; i++) {
				for (var j = 0; j < 256; j++) {
					byteMapping[String.fromCharCode(i + j * 256)] = String.fromCharCode(i) + String.fromCharCode(j);
				}
			}
			// call into VBScript utility fns
			var rawBytes = IEBinaryToArray_ByteStr(binary);
			var lastChr = IEBinaryToArray_ByteStr_Last(binary);
			return rawBytes.replace(/[\s\S]/g, function (match) {
				return byteMapping[match];
			}) + lastChr;
		};
		//
		var req = XMLHttpRequest();
		req.open("GET", conf.url, true);
		if (conf.responseType) req.responseType = conf.responseType;
		if (conf.onerror) req.onerror = conf.onerror;
		if (conf.onprogress) req.onprogress = conf.onprogress;
		req.onreadystatechange = function (event) {
			if (req.readyState === 4) {
				if (req.status === 200) {
					req.responseText = getResponseText(req.responseBody);
				} else {
					req = false;
				}
				if (conf.onload) conf.onload(req);
			}
		};
		req.setRequestHeader("Accept-Charset", "x-user-defined");
		req.send(null);
		return req;
	}
} else {
	DOMLoader.sendRequest = function(conf) {
		var req = new XMLHttpRequest();
		req.open(conf.data ? "POST" : "GET", conf.url, true);
		if (req.overrideMimeType) req.overrideMimeType("text/plain; charset=x-user-defined");
		if (conf.data) req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		if (conf.responseType) req.responseType = conf.responseType;
		if (conf.onerror) req.onerror = conf.onerror;
		if (conf.onprogress) req.onprogress = conf.onprogress;
		req.onreadystatechange = function (event) {
			if (req.readyState === 4) {
				if (req.status !== 200 && req.status != 304) {
					if (conf.onerror) conf.onerror(event, false);
					return;
				}
				if (conf.onload) {
					conf.onload(req);
				}
			}
		};
		req.send(conf.data);
		return req;
	};
}
/*
	----------------------------------------------------
	DOMLoader.script.js : 0.1.2 : 2012/09/08 : http://mudcu.be
	----------------------------------------------------
	Copyright 2011-2012 Mudcube. All rights reserved.
	----------------------------------------------------
	/// No verification
	DOMLoader.script.add("../js/jszip/jszip.js");
	/// Strict loading order and verification.
	DOMLoader.script.add({
		strictOrder: true,
		srcs: [
			{
				src: "../js/jszip/jszip.js",
				verify: "JSZip",
				callback: function() {
					console.log(1)
				}
			},
			{ 
				src: "../inc/downloadify/js/swfobject.js",
				verify: "swfobject",
				callback: function() {
					console.log(2)
				}
			}
		],
		callback: function() {
			console.log(3)
		}
	});
	/// Just verification.
	DOMLoader.script.add({
		src: "../js/jszip/jszip.js",
		verify: "JSZip",
		callback: function() {
			console.log(1)
		}
	});
*/

if (typeof(DOMLoader) === "undefined") var DOMLoader = {};

(function() { 

DOMLoader.script = function() {
	this.loaded = {};
	this.loading = {};
	return this;
};

DOMLoader.script.prototype.add = function(config) {
	var that = this;
	if (typeof(config) === "string") {
		config = { src: config };
	}
	var srcs = config.srcs;
	if (typeof(srcs) === "undefined") {
		srcs = [{ 
			src: config.src, 
			verify: config.verify
		}];
	}
	/// adding the elements to the head
	var doc = document.getElementsByTagName("head")[0];
	/// 
	var testElement = function(element, test) {
		if (that.loaded[element.src]) return;
		if (test && typeof(window[test]) === "undefined") return;
		that.loaded[element.src] = true;
		//
		if (that.loading[element.src]) that.loading[element.src]();
		delete that.loading[element.src];
		//
		if (element.callback) element.callback();
		if (typeof(getNext) !== "undefined") getNext();
	};
	///
	var batchTest = [];
	var addElement = function(element) {
		if (typeof(element) === "string") {
			element = {
				src: element,
				verify: config.verify
			};
		}
		if (/([\w\d.])$/.test(element.verify)) { // check whether its a variable reference
			element.test = element.verify;
			if (typeof(element.test) === "object") {
				for (var key in element.test) {
					batchTest.push(element.test[key]);
				}			
			} else {
				batchTest.push(element.test);
			}
		}
		if (that.loaded[element.src]) return;
		var script = document.createElement("script");
		script.onreadystatechange = function() {
			if (this.readyState !== "loaded" && this.readyState !== "complete") return;
			testElement(element);
		};
		script.onload = function() {
			testElement(element);
		};
		script.onerror = function() {

		};
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", element.src);
		doc.appendChild(script);
		that.loading[element.src] = function() {};
	};
	/// checking to see whether everything loaded properly
	var onLoad = function(element) {
		if (element) {
			testElement(element, element.test);
		} else {
			for (var n = 0; n < srcs.length; n ++) {
				testElement(srcs[n], srcs[n].test);
			}
		}
		var istrue = true;
		for (var n = 0; n < batchTest.length; n ++) {
			var test = batchTest[n];
			if (test && test.indexOf(".") !== -1) {
				test = test.split(".");
				var level0 = window[test[0]];
				if (typeof(level0) === "undefined") continue;
				if (test.length === 2) { //- this is a bit messy and could handle more cases
					if (typeof(level0[test[1]]) === "undefined") {
						istrue = false;
					}
				} else if (test.length === 3) {
					if (typeof(level0[test[1]][test[2]]) === "undefined") {
						istrue = false;
					}
				}
			} else {
				if (typeof(window[test]) === "undefined") {
					istrue = false;
				}
			}
		}
		if (!config.strictOrder && istrue) { // finished loading all the requested scripts
			if (config.callback) config.callback();
		} else { // keep calling back the function
			setTimeout(function() { //- should get slower over time?
				onLoad(element);
			}, 10);
		}
	};
	/// loading methods;  strict ordering or loose ordering
	if (config.strictOrder) {
		var ID = -1;
		var getNext = function() {
			ID ++;
			if (!srcs[ID]) { // all elements are loaded
				if (config.callback) config.callback();
			} else { // loading new script
				var element = srcs[ID];
				var src = element.src;
				if (that.loading[src]) { // already loading from another call (attach to event)
					that.loading[src] = function() {
						if (element.callback) element.callback();
						getNext();
					}
				} else if (!that.loaded[src]) { // create script element
					addElement(element);
					onLoad(element);
				} else { // it's already been successfully loaded
					getNext();
				}
			}
		};
		getNext();
	} else { // loose ordering
		for (var ID = 0; ID < srcs.length; ID ++) {
			addElement(srcs[ID]);
		}
		onLoad();
	}
};

DOMLoader.script = (new DOMLoader.script());

})();
define("MIDI", ["base64binary","base64"], (function (global) {
    return function () {
        var ret, fn;
        return ret || global.MIDI;
    };
}(this)));

/**
 * @class Key
 * @classDesc Represents a of a chord/note. Semantically this is weird 
 * since there are multiple notes in a chord. But in the application a Note object
 * is a chord/note/rest.
 * @param  {String} keyString The Key string ("C#/4")
 * @extends NoteItem
 * @memberOf ScoreModel
 */
define('Key',[
	'vexflow', 
	'./NoteItem', 
	'./Helpers', 
	'../lib/music2',
	'MIDI'
], function(
	Vex, 
	NoteItem, 
	Helpers, 
	MUSICJS,
	MIDI)
{



/**
 * @lends Key
 * @constructor
 */
var Key = function(keyString) {
	this.init(keyString);
};

// Inherit from NoteItem type
Key.prototype = new NoteItem();
Key.prototype.constructor = Key;
Key.superclass = NoteItem.prototype;

Key.prototype.init = function(keyString) {
	this.music  = new Vex.Flow.Music();
	var parts       =  this.music.getNoteParts(keyString.split('/')[0]);

	/**
	 * The step of the pitch
	 * @type {String}
	 */
	this.step       = parts.root;
	/**
	 * The accidental for the pitch
	 * @type {String}
	 */
	this.accidental = parts.accidental || "";
	/**
	 * The octave of the pitch
	 * @type {Number}
	 */
	this.octave     = parseInt(keyString.split('/')[1], 10);

	this.color = "black";

	this.type =  'key';

	Key.superclass.init.call(this);


};

Key.prototype.setColor = function(color) {
    this.color = color;
    return this;
};

/**
 * Determine if the Key is displaced
 * @return {Boolean}
 */
Key.prototype.determineDisplaced = function() {
	if (this.hasPrev()) {
		var prevKey = this.getPrev();
		var prevIsHalfStepBelow = (this.toInt() - 1) == prevKey.toInt();
		var prevIsWholeStepBelow = (this.toInt() - 2) == prevKey.toInt();

		if (!prevKey.determineDisplaced() && (prevIsHalfStepBelow || prevIsWholeStepBelow)){
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

/**
 * Return the Key as a frequency
 * @return {Number} Frequency of the pitch
 */
Key.prototype.frequency = function(){

	var acc = this.accidental === "##" ? "x" : this.accidental;
	var n = MUSICJS.NoteHelper.fromLatin(this.step.toUpperCase() + acc + this.octave);
	return n.frequency();
};

/**
 * Return Key as a number value
 * @return {Number} Key as integer
 */
Key.prototype.toInt = function() {
	return this.music.getNoteValue(this.step + this.accidental) + (12 * this.octave);
};

/**
 * Return the Key as a string
 * @return {String} The string representation of the Key
 */
Key.prototype.toString = function() {
	return this.step + this.accidental + "/" + this.octave;
};

/**
 * Return the Key as a string with no forward slash
 * @return {String}
 */
Key.prototype.flatString = function() {
	return this.step.toUpperCase() + this.accidental + this.octave;
};

/**
 * Increase the octave of the Key by 1
 */
Key.prototype.incrementOctave = function() {
	this.octave += 1;
	return this;
};

/**
 * Get the enharmonic equivalent of the note. BUGGY
 * @return {String} The enharmonic equivalent
 */
Key.prototype.toEnharmonic = function() {
	var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

	var accidental = "";
	var step = this.step.toUpperCase();
	var newStep;
	var octave = this.octave;

	if (this.accidental === "#" || this.accidental === "b") {

		var index = alphabet.indexOf(step);
		if (this.accidental === "#") {
			if (index === 6) {
				index = 0;
			} else {
				index += 1;
			}			
		} else {
			if (index === 0) {
				index = alphabet.length - 1;
			} else {
				index -= 1;
			}
		}

		newStep = alphabet[index];

		if (this.accidental == 'b' && step !== 'F' && step !== 'C') {
			accidental = "#";
		} else if (this.accidental === '#' && step !== "E" && step !== 'B') {
			accidental = "b";
		} else if (this.accidental == 'b' && (step === 'F' || step === 'C')){
			this.accidental = "";
			if (step === 'C') {
				octave -= 1;
			}
		} else if (this.accidental === '#' && (step === "E"|| step === 'B')){
			this.accidental = "";
		}
	}

	return (newStep || step) + accidental + octave;
};

/**
 * Return the Key as a MIDI.js note string. Only takes flatted notes.
 * @return {String}
 */
Key.prototype.toMIDI = function(){
	var midiNote = -1;

	if (this.accidental === "#") {
		midiNote =  MIDI.keyToNote[this.toEnharmonic()];
	} else if ((this.step === "c" || this.step === "f") && this.accidental === "b")  {
		midiNote =  MIDI.keyToNote[this.toEnharmonic()];
	} else {
		midiNote = MIDI.keyToNote[this.flatString()];
	}

	if (midiNote === -1) {
		throw 'MIDI NOTE NOT FOUND';
	}

	return midiNote; 
};

/**
 * Decrease the Octave by 1
 */
Key.prototype.decrementOctave = function() {
	this.octave += 1;
	return this;
};

/**
 * Set the accidnetal
 * @param  {String} acc The new accidental
 */
Key.prototype.setAccidental = function(acc) {
	if (acc !== '' && acc !== 'b' && acc !== 'bb' && acc !== '#' && acc !== '##' && acc !== 'n')
		throw "The supplied accidental was not recognized.";
	this.accidental = acc;
};

return Key;

});
/**
 * Mixin for items that are added into a {@link Container}. 
 * Essentially injects a helper methods in order to nagivate 
 * collection items.
 * @mixin  Traversable
 * @param  {Container} parent The parent container
 */

define('Traversable',[],function(){



/**
 * @lends Traversable
 */
var Traversable = function(parent) {
    if (!parent) {
        throw "NoPartAssociated- This measure does not have an associated parent to get previous";
    }

    /**
     * The parent Container
     * @type {Container}
     */
    this.parent = parent;
};

/**
 * Returns the position of the item
 * @return {Number} The index of the item
 */
Traversable.prototype.getIndex = function() {
    return this.parent.items.indexOf(this);
};

/**
 * Gets the next item in the collection
 * @return {Traversable} The following item
 */
Traversable.prototype.getNext = function() {
    var nextIndex = this.getIndex() + 1;
    if (nextIndex >= 0 && nextIndex < this.parent.items.length)
        return this.parent.items[nextIndex];
    return false;
};

/**
 * Gets the previous item in the collection
 * @return {Traversable} The previous item
 */
Traversable.prototype.getPrev = function() {
    var prevIndex = this.getIndex() - 1;
    if (prevIndex >= 0 && prevIndex < this.parent.items.length)
        return this.parent.items[prevIndex];
    return false;
};

/**
 * Determine if there is a following item in the collection
 * @return {Boolean}
 */
Traversable.prototype.hasNext = function() {
    var nextIndex = this.getIndex() + 1;
    if (nextIndex >= 0 && nextIndex < this.parent.items.length)
        return true;
    return false;
};

/**
 * Determine if there is a previous item in the collection
 * @return {Boolean}
 */
Traversable.prototype.hasPrev = function() {
    var prevIndex = this.getIndex() - 1;
    if (prevIndex >= 0 && prevIndex < this.parent.items.length)
        return true;
    return false;
};

/**
 * Determines if it is first in the collection
 * @return {Boolean}
 */
Traversable.prototype.isFirst = function() {
    return this.parent.items[0] === this;
};

/**
 * Determines if it is last in the collection
 * @return {Boolean}
 */
Traversable.prototype.isLast = function() {
    return this.parent.items[this.parent.items.length - 1] === this;
};

return Traversable;

});


/**
 * Serves as a collection baseclass for the different models.
 * @mixin  Container
 * @mixes Selectable
 * @abstract
 */

define('Container',['underscore', './Traversable', './Selectable', './Helpers'], function(_, Traversable, Selectable, Helpers){



/**
 * @lends  Container
 * @private
 * @constructor
 */
var Container = function() {
    Helpers.mixin(this, Selectable);
    
    /**
     * The items in the container
     * @type {Array}
     */
    this.items = [];
};

/**
 * Clear the container of all their items
 */
Container.prototype.clear = function() {
    this.items.forEach(function(item) {
        this.removeItem(item);
    }, this);
    return this;
};

/**
 * Add an item to the container. The item will be augmented with 
 * functions to navigate between its siblings.
 * @param  {Object} item  The item to add to the container
 * @param  {Number} index The index at which to add the item
 * @private
 */
Container.prototype.addItem = function(item, index) {
    // Extend the item with the traversable helper methods
    _(item).extend(new Traversable(this));
    var items = this.items;

    // If index is falsy/malformed, insert last
    if (typeof index !== 'number') {
        index = items.length;
    }
    
    this.items.splice(index, 0, item);
    
    return this;
};

/**
 * Add multiple items to the container
 * @param  {Object[]} items The items to add to the Container
 * @private
 */
Container.prototype.addItems = function(items) {
    items.forEach(function(item){
        this.addItem(item);
    }, this);
    
    return this;
};

/** 
 * Remove an item from the container. Input is polymorphic, can take 
 * an index or the Object and will remove it accordingly.
 * @private
 */
Container.prototype.removeItem = function(item) {
    var removalIndex = -1;

    if (typeof item == "number") {
        if (item > -1 && item < this.items.length) {
                removalIndex = item;
                item = this.items[item];
        } else {
                throw "IndexOutOfBounds - The number provided was no within the bounds of the part's measures";
        }
    } else {
        if (_(this.items).contains(item)){    
            removalIndex = item.getIndex();
        }
    }

    item = this.items[removalIndex];
    item.parent = null;
    this.items.splice(removalIndex, 1);

};

return Container;
    
});

/**
 * @class  Duration
 * @classDesc Represents a duration in beats
 * @param {Number} duration The base duration in beats
 * @param {Object} options The initialization options
 * @config {Number} dots The number of dots
 * @memberOf ScoreModel
 * @example <caption>Dotted Quarter Duration example:</caption>
 * var duration = new Duration(4, { dots : 1 });
 */

define('Duration',['vexflow'], function(Vex){



/**
 * @lends Duration
 * @constructor
 */
var Duration = function(duration, options) {
	this.base = parseInt(duration, 10) || 4 ;
    this.dots      = 0;
    this.tupletMod = '1';
    this.tie       = false;

	// Set from options
	if (options) {
		if ('dots' in options && typeof options.dots == 'number') {
			this.dots = options.dots;
		}
	}
};

/**
 * Get ticks for a singular note
 * 
 * @param  {DurationNote} note Note to determine ticks
 * 
 * @return {number} Ticks in note
 */
Duration.prototype.getTicks = function() {
	// Initialize ticks for the note
    var totalTicks = 0;
    var decimal = this.getTupletDecimal();

    // Add the base ticks to the total
    totalTicks += this.getBaseTicks();
    // Add ticks for dots
    totalTicks += this.getDotTicks();

    return totalTicks * decimal;
};

/**
 * Get the number of ticks for only the additional dot duration
 */
Duration.prototype.getDotTicks = function() {
    var dotTicks  = 0, 
        baseTicks = this.getBaseTicks();

    for (var j = 0;  j < this.dots; j++) {
        dotTicks += (baseTicks/2);
        baseTicks = baseTicks/2;
    }

    return dotTicks;
};

/**
 * Returns the Duration in seconds based on the beats per minute
 * @param  {Number} bpm The beats per minute
 * @return {Number}     Duration in seconds
 */
Duration.prototype.inSeconds = function(bpm) {
    if (typeof bpm !== 'number') {
        throw 'Invalid BPM';
    }
    var bps = bpm / 60; // beats per second
    var numberOfBeats = (4 / this.base) * this.getTupletDecimal();

    var currentDotMultiplier = 1.5;
    for (var i = 0; i < this.dots; i++) {
        currentDotMultiplier = currentDotMultiplier / (i === 0 ? 1 : i * 2);
        numberOfBeats *= currentDotMultiplier;
    }

    return (1 / bps) * numberOfBeats;
};

/**
 * Get the number of ticks for the base (without modifiers)
 */
Duration.prototype.getBaseTicks = function() {
    return Vex.Flow.durationToTicks.durations[this.base];
};

/**
 * Set the number of dots for the duration
 * @param  {Number} dots Amount of dots
 */
Duration.prototype.setDots = function(dots) {
    if (typeof dots !== 'number') 
        throw "InvalidNumber - Input not of number type";
    if (dots < 0)
        throw "OutOfBounds - inavlid input, total dots cannot be less than 0";

    this.dots = dots;
    return this;
};

/**
 * Get the tuplet in decimal format. Useful when using the tuplet 
 * in math equations
 */
Duration.prototype.getTupletDecimal = function() {
    var decimal = 1;
    if (this.tupletMod !== "1") {
        var fraction = this.tupletMod.split('/');
        decimal = parseInt(fraction[0], 10) / parseInt(fraction[1], 10);
    }
    return decimal;
};

/**
 * Set the tuplet modifier
 * @param {String} mod The tuplet modifier string as a fraction
 * @example <caption>Eight Note Triplet Duration:</caption>
 * var duration = new Duration(8)
 * duration.setTupletMod("2/3");
 */
Duration.prototype.setTupletMod = function(mod) {
    this.tupletMod = mod;
    return this;
};

/**
 * Specifically for use with the Audiolet Scheduler. Converts the duration into 
 * a compatible number for the playback library.
 */
Duration.prototype.getSchedulerDuration = function() {
    var editorDuration = parseInt(this.base, 10);
    var dots           = this.dots;

    var schedulerDuration = 1/(editorDuration*(1/4));

    var dotDuration = schedulerDuration/2;
    for(var k = 0; k < this.dots; k++ )
    {
        schedulerDuration += dotDuration;
        dotDuration = dotDuration/2;
    }

    return schedulerDuration * this.getTupletDecimal();
};

return Duration;

});
/**
 * @class  AbstractNote
 * @classDesc The baseclass for all Note types (Note, Rest, TabNote)
 * @abstract
 * @memberOf ScoreModel
 */

define('AbstractNote',['./Duration'], function(Duration){



/**
 * @lends AbstractNote
 * @constructor
 */
var AbstractNote = function() {
	this.init();
};

/*
 * Pseudo properties
 * 
 * Syntactical sugar so that when dealing with Tablature you can type 
 * note.positions instead of note.keys for more semantic sense. If you are
 * unfamiliar with the syntax read here: [http://tinyurl.com/8mvmz8w]
 *
 * Also these maitain backwards compatibility, in case properties change but 
 * should be referred to the same way. Although this situation could lead to
 * confusion and should only occur if absolutely necessary. /tangent
 */
AbstractNote.prototype = {
    /**
     * The {@link Key}s in the Note
     * @type {Key[]}
     * @virtual
     */
    get keys() {
        return this.items;
    },
    /**
     * The parent Voice
     * @type {Voice}
     * @virtual
     */
    get voice() {
        return this.parent;
    },
    /**
     * The finger positions for a TabNote
     * @type {Position[]}
     * @virtual
     */
    get positions() {
        return this.items;
    },
    /**
     * The number of dots
     * @type {Number}
     * @virtual
     */
    get dots() {
        return this.duration.dots;
    },
    /** 
     * The grand-parent measure
     * @type {Measure}
     * @virtual
     */
    get measure() {
        return this.voice.measure;
    }
};


AbstractNote.prototype.init = function() {
    /**
     * The duration of the note
     * @type {Duration}
     */
	this.duration = new Duration();
    /**
     * The index of staff the note will be placed on
     * @type {Number}
     */
    this.staffNumber = 0;
    /**
     * The articulations to apply to the note
     * @type {Array}
     */
    this.articulations = [];
};

/**
 * Get the length of note in ticks
 * @return {Number} Ticks in the note
 */
AbstractNote.prototype.getTicks = function() {
    return this.duration.getTicks();
};

/**
 * Get the base duration of the note. Does not take into account 
 * dots/tuplets
 * @return {Number} The base duration of the note
 */
AbstractNote.prototype.getDuration = function() {
    return this.duration.base;
};

/**
 * Set the Duration
 * @param  {Duration} duration The Duration of the Note
 */
AbstractNote.prototype.setDuration = function(duration) {
    this.duration = duration;
    return this;
};

/**
 * Helper function for quickly retrieving the Vex.Flow.StaveNote creation 
 * string
 * @return {String} The VexFlow StaveNote creation string
 */
AbstractNote.prototype.getVexFlowDurationString = function() {
    return this.duration.base + (this.isRest() ? 'r' : '');
};

/**
 * Helper function to determine if note is Rest
 * @return {Boolean}
 */
AbstractNote.prototype.isRest = function() {
    if (this.type === 'rest')
        return true;
    return false;
};

/**
 * Set the staff number the note is a part of
 * @param  {Number} number The index of the staff
 */
AbstractNote.prototype.setStaffNumber = function(number) {
    this.staffNumber = number;
    return this;
};

/**
 * Helper function to determine if note is a tab note
 * @return {Boolean}
 */
AbstractNote.prototype.isTab = function() {
    if (this.type === 'tab')
        return true;
    return false;
};

/**
 * Helper function to determine if note is standard note
 * @return {Boolean}
 */
AbstractNote.prototype.isNote = function() {
    if (this.type === 'note')
        return true;
    return false;
};

/**
 * Helper function to determine if note is a a chord
 * @return {Boolean}
 */
AbstractNote.prototype.isChord = function() {
    return (this.items && this.items.length > 1);
};

AbstractNote.prototype.addArticulation = function(articulation) {
    this.articulations.push(articulation);
};

/**
 * Set the number of dots on the note
 * @param  {Number} num Amount of dots
 */
AbstractNote.prototype.setDots = function(num){
    this.duration.setDots(num);
};

return AbstractNote;

});
/**
 * @class  ScoreModel.Note
 * @classDesc  The Note class which holds relevent note data
 * @extends Container
 * @extends ScoreModel.AbstractNote
 */

define('Note',['underscore', 
    './Key', 
    './Container', 
    './Helpers', 
    './AbstractNote', 
    './Duration'], 
function(_, 
    Key, 
    Container, 
    Helpers, 
    AbstractNote, 
    Duration){



/**
 * @lends ScoreModel.Note
 * @constructor
 */
var Note = function() {
    this.init();
};
Helpers.inherit(Note, AbstractNote);

/**
 * Main initialization function, called on construction
 * @private
 */
Note.prototype.init = function() {
    Helpers.mixin(this, Container);
    Note.superclass.init.call(this);

    /**
     * The direction of the stem. 0 is auto, 1 is up, -1 is down
     * @type {Number}
     */
    this.stem = 0;
    /**
     * An array of articulations to apply to the note
     * @type {Editor.articulations[]}
     */
    this.articulations = [];
    /**
     * The notes indices that are starting the tie
     * @type {Number[]}
     */
    this.tieStart = []; 
    /**
     * The note indices that are endinga  tie
     * @type {Number[]}
     */
    this.tieEnd = [];
    
    this.type          = 'note';
};

Note.prototype.key = function(index) {
    if (typeof index !== 'number'){
        index = 0;
    }
    return this.items[index];
}

/**
 * Add a Key to the note
 * @param  {Key} key THe key to add
 */
Note.prototype.addKey = function(key) {
    if (!(key instanceof Key))
        throw 'ERROR: Trying to add a non-Key type';

    this.addItem(key);

    this.items = _(this.items).sortBy(function(item){
        if (item instanceof Key)
            return item.toInt();
    });

    return this;
};

/**
 * Find the indexes of selected Keys in the note
 * @return {Number[]} The indices
 */
Note.prototype.getSelectedKeyIndices = function() {
    return _.chain(this.keys)
                .filter(function (key) { return key.isSelected(); })
                .map( function (key) { return key.getIndex(); })
                .value();
};

/**
 * Add multiple Keys at once
 * @param  {Keys[]} keys The Keys to add
 */
Note.prototype.addKeys = function(keys) {
    this.addItems(keys);
    return this;
};

/**
 * Gets the string representations of each Key
 * @return {String[]} Array of strings represting each Key
 */
Note.prototype.getKeyStringArray = function() {
    var arr = [];
    this.keys.forEach(function(key){
        arr.push(key.toString());
    });
    return arr;
};

/**
 * Add an articulation to the Note
 * @param  {Number} articulation Articulation type
 */
Note.prototype.addArticulation = function(articulation) {
    this.articulations.push(articulation);
};

/**
 * Set the stem direction. 1 = up, -1 = down, 0 = auto
 * @param  {Number} direction The of the stem
 */
Note.prototype.setStemDirection = function(direction) {
    if (direction > -2 && direction < 2) {
        this.stem = direction;
    }
    return this;
};

/**
 * Gets the stem direction
 * @return {Number} The stem direction for the note
 */
Note.prototype.getStemDirection = function() {
    return this.stem;
};

return Note;

});

/**
 * @class  Rest
 * @classDesc Represents a Rest note
 * @extends AbstractNote
 * @memberOf ScoreModel
 */

define('Rest',['./AbstractNote', './Helpers'], function(AbstractNote, Helpers){



/**
 * @lends Rest
 * @constructor
 */
var Rest = function() {
	Rest.superclass.init.call(this);
	this.type = "rest";
    /**
     * The position of the rest on the staff
     * as a pitch
     * @type {String}
     */
    this.position = false;
    /**
     * Flag for having the rest fill up the entire measure it is 
     * contained in
     * @type {Boolean}
     */
    this.wholeMeasure = false;	
};
Helpers.inherit(Rest, AbstractNote);

/**
 * Set the staff position of the Rest note
 * @param  {String} position Where to place the rest
 */
Rest.prototype.setPosition = function(position) {
	this.position = position;
	return this;
};

/**
 * Whether the rest fills up the whole measure (whole rests are designated 
 * to do this in standard notation regardless of time signature)
 * @return {Boolean}
 */
Rest.prototype.fillsMeasure = function() {
    return this.wholeMeasure;
};

return Rest;

});
define('Editor',[
    'jquery', 
    './Key', 
    './Note', 
    './Rest', 
    './Duration'], 
function(
    $, 
    Key, 
    Note, 
    Rest, 
    Duration){

/**
 * @namespace Editor
 */
var Editor = {};
var e = Editor;

/**
 * @todo Create configuration object that is seperate to each instance.
 * We want to display multiple scores per page, so seperate canvases for each.
 * @todo Dynamically create extra canvas elements for selection eye candy
 * @memberOf Editor
 */
CONFIG = {
    // Colors
    selectionColor      : 'rgba(0, 100, 255, 0.1)',
    placeholderColor    : 'rgba(0, 100, 255, 0.15)',

    // Misc Config
    DEFAULT_STAVE_WIDTH : 300,
    staffMarginLeft     : 15
};

/**
 * Enum for the different types of articulations for a note
 * @enum {Number}
 * @readOnly
 * @memberOf  Editor
 */
Editor.articulations = {
    STACCATO            : 1,
    STACCATISSIMO       : 2,
    ACCENT              : 3,
    TENUTO              : 4,
    MARCATO             : 5,
    LEFT_HAND_PIZZICATO : 6,
    SNAP_PIZZICATO      : 7,
    NATURAL_HARMONIC    : 8,
    FERMATA_ABOVE       : 9,
    FERMATA_BELOW       : 10,
    UP_STROKE           : 11,
    DOWN_STROKE         : 12,
    VIBRATO             : 13,
    BEND_HALF           : 14,
    LEGATO              : 15
};

/**
 * @class Editor.UI
 */
Editor.UI = {};

/**
 * Get the note from the buttons
 * @memberOf Editor.UI
 * @param  {String} pitch      The pitch of the note
 * @param  {Boolean} perc       Whether to make it percussion or not
 * @param  {Number} instanceId The ID of the instance
 * @return {AbstractNote}            The note
 */
Editor.UI.getTempNote = function(pitch, perc, instanceId) {
    var $ui = $("#ui_" + instanceId);
    var duration  = $ui.find('.active').val();
    var isRest    = $ui.find("#rest.active").val();
    var dots      = $ui.find("#dot.active").val() == 'true' ? 1 : 0;
    var keyString = pitch;

    // Percussion clef hack
    if (perc) {
        keyString = Editor.defaultPercTable[key];
    }

    var key = new Key(keyString);

    var tempNote;
    if (isRest) {
        tempNote = new Rest();
    } else {
        tempNote = new Note().addKey(key);
    }
    
    tempNote.setDuration(new Duration(duration).setDots(dots));

    return tempNote;
};

/**
 * The VexFlow notes for percussion notes. This is what the standard 
 * perc staff should look like.
 * @enum {String}
 * @readOnly
 * @memberOf Editor
 */
Editor.defaultPercTable = {
    "b/5": "b/5/x3",
    "a/5": "a/5/x2",
    "g/5": "g/5/x2",
    "f/5": "f/5/x2",
    "e/5": "e/5",
    "d/5": "d/5",
    "c/5": "c/5",
    "b/4": "b/4",
    "a/4": "a/4",
    "g/4": "g/4",
    "f/4": "f/4",
    "e/4": "e/4",
    "d/4": "d/4/x2"
};

/**
 * @enum {String}
 * @readOnly
 * @memberOf Editor
 */
Editor.trebleNotes = {
    0:    "G/6",
    0.5:  "F/6",
    1:    "E/6",
    1.5:  "D/6",
    2:    "C/6",
    2.5:  "B/5",
    3:    "A/5",
    3.5:  "G/5",
    4:    "F/5",
    4.5:  "E/5",
    5:    "D/5",
    5.5:  "C/5",
    6:    "B/4",
    6.5:  "A/4",
    7:    "G/4",
    7.5:  "F/4",
    8:    "E/4",
    8.5:  "D/4",
    9:    "C/4", 
    9.5:  "B/3",
    10:   "A/3",
    10.5: "G/3",
    11:   "F/3",
    11.5: "E/3",
    12:   "D/3",
    12.5: "C/3",
    13:   "B/2",
    13.5: "A/2",
    14:   "G/2",
    14.5: "F/2",
    15:   "E/2",
    15.5: "D/2",
    16:   "C/2",
    16.5: "B/1",
    17:   "A/1",
    17.5: "G/1",
    18:   "F/1",
    18.5: "E/1"
};

return Editor;

});
//     keymaster.js
//     (c) 2011 Thomas Fuchs
//     keymaster.js may be freely distributed under the MIT license.
(function(a){function h(a,b){var c=a.length;while(c--)if(a[c]===b)return c;return-1}function i(a){var b,g,i,j,k;b=a.keyCode;if(b==93||b==224)b=91;if(b in d){d[b]=!0;for(i in f)f[i]==b&&(l[i]=!0);return}if(!l.filter.call(this,a))return;if(!(b in c))return;for(j=0;j<c[b].length;j++){g=c[b][j];if(g.scope==e||g.scope=="all"){k=g.mods.length>0;for(i in d)if(!d[i]&&h(g.mods,+i)>-1||d[i]&&h(g.mods,+i)==-1)k=!1;(g.mods.length==0&&!d[16]&&!d[18]&&!d[17]&&!d[91]||k)&&g.method(a,g)===!1&&(a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation&&a.stopPropagation(),a.cancelBubble&&(a.cancelBubble=!0))}}}function j(a){var b=a.keyCode,c;if(b==93||b==224)b=91;if(b in d){d[b]=!1;for(c in f)f[c]==b&&(l[c]=!1)}}function k(){for(b in d)d[b]=!1;for(b in f)l[b]=!1}function l(a,b,d){var e,h,i,j;d===undefined&&(d=b,b="all"),a=a.replace(/\s/g,""),e=a.split(","),e[e.length-1]==""&&(e[e.length-2]+=",");for(i=0;i<e.length;i++){h=[],a=e[i].split("+");if(a.length>1){h=a.slice(0,a.length-1);for(j=0;j<h.length;j++)h[j]=f[h[j]];a=[a[a.length-1]]}a=a[0],a=g[a]||a.toUpperCase().charCodeAt(0),a in c||(c[a]=[]),c[a].push({shortcut:e[i],scope:b,method:d,key:e[i],mods:h})}}function m(a){var b=(a.target||a.srcElement).tagName;return b!="INPUT"&&b!="SELECT"&&b!="TEXTAREA"}function n(a){e=a||"all"}function o(){return e||"all"}function p(a){var b,d,e;for(b in c){d=c[b];for(e=0;e<d.length;)d[e].scope===a?d.splice(e,1):e++}}function q(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,function(){c(window.event)})}var b,c={},d={16:!1,18:!1,17:!1,91:!1},e="all",f={"⇧":16,shift:16,"⌥":18,alt:18,option:18,"⌃":17,ctrl:17,control:17,"⌘":91,command:91},g={backspace:8,tab:9,clear:12,enter:13,"return":13,esc:27,escape:27,space:32,left:37,up:38,right:39,down:40,del:46,"delete":46,home:36,end:35,pageup:33,pagedown:34,",":188,".":190,"/":191,"`":192,"-":189,"=":187,";":186,"'":222,"[":219,"]":221,"\\":220};for(b=1;b<20;b++)f["f"+b]=111+b;for(b in f)l[b]=!1;q(document,"keydown",i),q(document,"keyup",j),q(window,"focus",k),a.key=l,a.key.setScope=n,a.key.getScope=o,a.key.deleteScope=p,a.key.filter=m,typeof module!="undefined"&&(module.exports=key)})(this);
define("keymaster", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.key;
    };
}(this)));

/**
 * @class  Voice
 * @classDesc A collection of notes
 * @mixes Container
 * @memberOf ScoreModel
 */

define('Voice',[
    './AbstractNote', 
    './Helpers', 
    './Container', 
    './TimeSignature'], 
function(
    AbstractNote, 
    Helpers, 
    Container, 
    TimeSignature) {



/**
 * @constructor
 * @lends  Voice
 */
var Voice = function() {
    this.init();
};

/**
 * The main initialization function, called on construction
 * @private
 */
Voice.prototype.init = function() {
    Helpers.mixin(this, Container);

    /**
     * The parent {@link Measure}
     * @type {Measure}
     */
    this.measure = this.parent;
    /**
     * The child {@link Note}s contained in the Voice
     * @type {Note[]}
     */
    this.notes = this.items;

    this.type = 'voice';
};

/**
 * Get the note at a specific index
 * @param {Number} index The index of the note to retrieve
 * @return {Note} The note at the index
 */
Voice.prototype.note = function(index) {
    if (typeof index !== 'number'){
        index = 0;
    }

    return this.notes[index];
};

/**
* Get the completion status of the voice. 
*/
Voice.prototype.getStatus = function(timeSig) {
    timeSig    = timeSig || new TimeSignature("4/4"); // Configurable in the future

    // If the measure has a time signature, determine status...
    if (timeSig !== false) {
        var totalBeats = timeSig.getTotalBeats();
        var beatValue  = timeSig.getBeatValue();
        var maxTicks   = 1024 * totalBeats * (16/beatValue);
        var ticksSum   = Helpers.getTicksSum(this.notes);

        if (ticksSum === 0)
            return "empty";
        else if (ticksSum === maxTicks)
            return "complete";
        else if (ticksSum > maxTicks)
            return "overflown";
        else if (ticksSum < maxTicks)
            return "incomplete";
    } else {
        return "empty";
    }
};

/**
 * Add a Note to the voice
 * @param  {Note} note  The Note to add
 * @param  {Number} index The index at which to insert
 */
Voice.prototype.addNote = function(note, index) {
    if (!(note instanceof AbstractNote))
        throw 'ERROR: Trying to add a non-note type';

    this.addItem(note, index);
    return this;
};

/**
 * Add multiple notes to the voice
 * @param  {Note[]} notes An array of Notes to add
 * @param  {Number} index The index at which to insert the notes
 */
Voice.prototype.addNotes = function(notes, index) {
    var that = this;
    notes.forEach(function(note) {
        that.addNote(note);
    });
    return this;
};

/**
 * Remove a note from the voice
 * @param  {Note} note The note to remove
 */
Voice.prototype.removeNote = function(note) {
    this.removeItem(note);
    return this;
};

return Voice;

});
/**
 * @class StaffSectionSpec 
 * @classDesc THis is a simple object to keep track of a staffs modifiers. This
 * will generally relate directly to a specific measure. Has some helper functions 
 * to deal with common functionality when comparing
 * @memberOf ScoreModel
 * 
 * @param {string} clef   Clef
 * @param {string} key    Key signature
 * @param {string} time   Time Signature
 * @param {number} begBar Vexflow barline enum
 * @param {number} endbar Vexflow barline enum
 */
define('StaffSectionSpec',['underscore'], function(_){



/**
 * @lends StaffSectionSpec
 * @constructor
 */
var StaffSectionSpec = function(clef, key, time, begBar, endbar) {
	this.type          = 'notation';
	this.clef          = clef || 'treble';
	this.keySignature  = key || 'C';
	this.timeSignature = time || '4/4';
	this.begBar        = begBar || 1;
	this.endBar        = endbar || 1;
	this.width         = 200;
	this.forceHideTime = 0;
};

/**
 * Returns the prorpety value, if the property doesn't exist, returns false
 */
StaffSectionSpec.prototype.get = StaffSectionSpec.prototype.getProperty = function(property) {
	return this[property] || false;
};

/**
 * Gets the property but throws an error if the property doesn't exist
 */
StaffSectionSpec.prototype.hardGet = function(property) {
	var value = this[property];
	
	if (!value) throw 'Invalid property name';

	return value;
};

/**
 * Compare a property against another StaffSectionSpec 
 * @param  {StaffSectionSpec} spec     The Spec to compare to
 * @param  {String} property The property name to compare
 * @return {Boolean}          Equality of the property values
 */
StaffSectionSpec.prototype.compare = function(spec, property) {
	return spec[property] === this[property];
};

var isEqual = function(value, compare){
	if (value instanceof Array && compare instanceof Array) {
		return value.reduce(function(prev, item, index, arr) {
			if (prev === true) {
				return isEqual(arr[index], compare[index]);
			}
			return prev;
		}, true);
	} else if (!(value instanceof Array) && !(compare instanceof Array)) {
		return value === compare;
	}
	return false;
};

/**
 * Returns what is different between two specs. Can optionally 
 * pass in only specific keys to compare
 * @param  {StaffSectionSpec} spec The StaffSectionSpec to diff against
 * @param  {String[]} keys An array of keys to specifically diff against
 * @return {Object}      An object of the keys/values that are different from 
 *                          the provided StaffSectionSpec
 */
StaffSectionSpec.prototype.diff = function(spec, keys) {
	var diff = {};

	if (!keys) {
		keys = _.keys(this); // All keys
	}
	
	keys.forEach(function(key) {

		if (!isEqual(spec[key], this[key])) {
			diff[key] = this[key];
		}
	}, this);
	
	return diff;
};

/**
 * Clone this StaffSectionSpec
 * @return {StaffSectionSpec} The clone
 */
StaffSectionSpec.prototype.clone = function() {
	return new StaffSectionSpec(this.clef, this.key, this.time, this.begBar, this.endBar);
};

StaffSectionSpec.prototype.resetBarlines = function(){
	this.begBar = 1;
	this.endBar = 1;
	return this;
};

/**
 * Creates a property if it doesn't exist;
 */
StaffSectionSpec.prototype.set = function(property, value) {
	this[property] = value;
	return this;
};

return StaffSectionSpec;

});

/**
 * @class Staff
 * @classDesc The Staff class is a collection of StaffSectionSpec's
 * @param {string} name The name for the staff (probably LH/RH?) unused at the moment
 */
define('Staff',[
    './StaffSectionSpec', 
    './Container', 
    './Helpers'], 
function(
    StaffSectionSpec, 
    Container, 
    Helpers) {



/**
 * @lends Staff
 * @constructor
 */
var Staff = function (name) {
    this.init(name);
};

/**
 * Main initialization function, called on construction
 * @private
 */
Staff.prototype.init = function(name) {
    Helpers.mixin(this, Container);

    this.name = name || "Untitled Staff";

    this.specs = this.items;
    this.part = this.parent;

    return this;   // For method chaining
};

/**
 * Get the current staff index within the entire Score.
 * @return {Number} Staff index
 */
Staff.prototype.getTotalIndex = function() {
    var score = this.part.score;
    var parts = score.parts;

    var staves = parts.reduce(function(total, part){
        return total.concat(part.staves);
    }, []);

    return staves.indexOf(this);
};

/**
 * Get the total number of staves in the entire score
 */
Staff.prototype.totalInScore = function() {
    var score = this.part.score;
    var parts = score.parts;

    var staves = parts.reduce(function(total, part){
        return total.concat(part.staves);
    }, []);

    return staves.length;
};

/**
 * Add a StaffSectionSpec to the Staff. Used for when Adding a Measure. Usually 
 * you want to create the Measure and the Staff Sections related to the measure at the same time.
 * @param  {StaffSectionSpec} spec  The Spec to add
 * @param  {Number} index The position at which to insert the spec
 * @returns {StaffSectionSpec} The Spec that was added
 */
Staff.prototype.addSpec = function(spec, index) {
    this.addItem(spec, index);
    return spec;
};

/**
 * Get a sepecific specs
 * @param  {Number} index The index of the spec to get
 * @return {StaffSectionSpec} 
 */
Staff.prototype.getSpec = function(index) {
    return this.specs[index];
};

/**
 * Add a new default StaffSectionSpec
 * @param  {number} index The index of where to insert the new StaffSectionSpec
 */
Staff.prototype.newSpec = function(index) {
    return this.addSpec(new StaffSectionSpec(), index);
};

/**
 * Get the index of the staff in the part
 * @return {Number}
 */
Staff.prototype.getIndex = function(){
    return this.part.staves.indexOf(this);
};

return Staff;

});
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

(function (root, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else {
    var mustache = {};
    factory(mustache);
    if (typeof define === "function" && define.amd) {
      define('mustache',mustache); // AMD
    } else {
      root.Mustache = mustache; // <script>
    }
  }
}(this, function (mustache) {

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var nonSpaceRe = /\S/;
  var eqRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var RegExp_test = RegExp.prototype.test;
  function testRegExp(re, string) {
    return RegExp_test.call(re, string);
  }

  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var Object_toString = Object.prototype.toString;
  var isArray = Array.isArray || function (obj) {
    return Object_toString.call(obj) === '[object Array]';
  };

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (match && match.index === 0) {
      this.tail = this.tail.substring(match[0].length);
      this.pos += match[0].length;
      return match[0];
    }

    return "";
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var match, pos = this.tail.search(re);

    switch (pos) {
    case -1:
      match = this.tail;
      this.pos += this.tail.length;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, pos);
      this.tail = this.tail.substring(pos);
      this.pos += pos;
    }

    return match;
  };

  function Context(view, parent) {
    this.view = view || {};
    this.parent = parent;
    this._cache = {};
  }

  Context.make = function (view) {
    return (view instanceof Context) ? view : new Context(view);
  };

  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  Context.prototype.lookup = function (name) {
    var value = this._cache[name];

    if (!value) {
      if (name == '.') {
        value = this.view;
      } else {
        var context = this;

        while (context) {
          if (name.indexOf('.') > 0) {
            value = context.view;
            var names = name.split('.'), i = 0;
            while (value && i < names.length) {
              value = value[names[i++]];
            }
          } else {
            value = context.view[name];
          }

          if (value != null) break;

          context = context.parent;
        }
      }

      this._cache[name] = value;
    }

    if (typeof value === 'function') value = value.call(this.view);

    return value;
  };

  function Writer() {
    this.clearCache();
  }

  Writer.prototype.clearCache = function () {
    this._cache = {};
    this._partialCache = {};
  };

  Writer.prototype.compile = function (template, tags) {
    var fn = this._cache[template];

    if (!fn) {
      var tokens = mustache.parse(template, tags);
      fn = this._cache[template] = this.compileTokens(tokens, template);
    }

    return fn;
  };

  Writer.prototype.compilePartial = function (name, template, tags) {
    var fn = this.compile(template, tags);
    this._partialCache[name] = fn;
    return fn;
  };

  Writer.prototype.getPartial = function (name) {
    if (!(name in this._partialCache) && this._loadPartial) {
      this.compilePartial(name, this._loadPartial(name));
    }

    return this._partialCache[name];
  };

  Writer.prototype.compileTokens = function (tokens, template) {
    var self = this;
    return function (view, partials) {
      if (partials) {
        if (typeof partials === 'function') {
          self._loadPartial = partials;
        } else {
          for (var name in partials) {
            self.compilePartial(name, partials[name]);
          }
        }
      }

      return renderTokens(tokens, self, Context.make(view), template);
    };
  };

  Writer.prototype.render = function (template, view, partials) {
    return this.compile(template)(view, partials);
  };

  /**
   * Low-level function that renders the given `tokens` using the given `writer`
   * and `context`. The `template` string is only needed for templates that use
   * higher-order sections to extract the portion of the original template that
   * was contained in that section.
   */
  function renderTokens(tokens, writer, context, template) {
    var buffer = '';

    var token, tokenValue, value;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];
      tokenValue = token[1];

      switch (token[0]) {
      case '#':
        value = context.lookup(tokenValue);

        if (typeof value === 'object') {
          if (isArray(value)) {
            for (var j = 0, jlen = value.length; j < jlen; ++j) {
              buffer += renderTokens(token[4], writer, context.push(value[j]), template);
            }
          } else if (value) {
            buffer += renderTokens(token[4], writer, context.push(value), template);
          }
        } else if (typeof value === 'function') {
          var text = template == null ? null : template.slice(token[3], token[5]);
          value = value.call(context.view, text, function (template) {
            return writer.render(template, context);
          });
          if (value != null) buffer += value;
        } else if (value) {
          buffer += renderTokens(token[4], writer, context, template);
        }

        break;
      case '^':
        value = context.lookup(tokenValue);

        // Use JavaScript's definition of falsy. Include empty arrays.
        // See https://github.com/janl/mustache.js/issues/186
        if (!value || (isArray(value) && value.length === 0)) {
          buffer += renderTokens(token[4], writer, context, template);
        }

        break;
      case '>':
        value = writer.getPartial(tokenValue);
        if (typeof value === 'function') buffer += value(context);
        break;
      case '&':
        value = context.lookup(tokenValue);
        if (value != null) buffer += value;
        break;
      case 'name':
        value = context.lookup(tokenValue);
        if (value != null) buffer += mustache.escape(value);
        break;
      case 'text':
        buffer += tokenValue;
        break;
      }
    }

    return buffer;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var tree = [];
    var collector = tree;
    var sections = [];

    var token;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];
      switch (token[0]) {
      case '#':
      case '^':
        sections.push(token);
        collector.push(token);
        collector = token[4] = [];
        break;
      case '/':
        var section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : tree;
        break;
      default:
        collector.push(token);
      }
    }

    return tree;
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];
      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          lastToken = token;
          squashedTokens.push(token);
        }
      }
    }

    return squashedTokens;
  }

  function escapeTags(tags) {
    return [
      new RegExp(escapeRegExp(tags[0]) + "\\s*"),
      new RegExp("\\s*" + escapeRegExp(tags[1]))
    ];
  }

  /**
   * Breaks up the given `template` string into a tree of token objects. If
   * `tags` is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. ["<%", "%>"]). Of
   * course, the default is to use mustaches (i.e. Mustache.tags).
   */
  function parseTemplate(template, tags) {
    template = template || '';
    tags = tags || mustache.tags;

    if (typeof tags === 'string') tags = tags.split(spaceRe);
    if (tags.length !== 2) throw new Error('Invalid tags: ' + tags.join(', '));

    var tagRes = escapeTags(tags);
    var scanner = new Scanner(template);

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length) {
          delete tokens[spaces.pop()];
        }
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var start, type, value, chr, token;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(tagRes[0]);
      if (value) {
        for (var i = 0, len = value.length; i < len; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push(['text', chr, start, start + 1]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr == '\n') stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(tagRes[0])) break;
      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(eqRe);
        scanner.scan(eqRe);
        scanner.scanUntil(tagRes[1]);
      } else if (type === '{') {
        value = scanner.scanUntil(new RegExp('\\s*' + escapeRegExp('}' + tags[1])));
        scanner.scan(curlyRe);
        scanner.scanUntil(tagRes[1]);
        type = '&';
      } else {
        value = scanner.scanUntil(tagRes[1]);
      }

      // Match the closing tag.
      if (!scanner.scan(tagRes[1])) throw new Error('Unclosed tag at ' + scanner.pos);

      token = [type, value, start, scanner.pos];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        if (sections.length === 0) throw new Error('Unopened section "' + value + '" at ' + start);
        var openSection = sections.pop();
        if (openSection[1] !== value) throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        tags = value.split(spaceRe);
        if (tags.length !== 2) throw new Error('Invalid tags at ' + start + ': ' + tags.join(', '));
        tagRes = escapeTags(tags);
      }
    }

    // Make sure there are no open sections when we're done.
    var openSection = sections.pop();
    if (openSection) throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    tokens = squashTokens(tokens);

    return nestTokens(tokens);
  }

  mustache.name = "mustache.js";
  mustache.version = "0.7.2";
  mustache.tags = ["{{", "}}"];

  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  mustache.parse = parseTemplate;

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // All Mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates and partials in the default writer.
   */
  mustache.clearCache = function () {
    return defaultWriter.clearCache();
  };

  /**
   * Compiles the given `template` to a reusable function using the default
   * writer.
   */
  mustache.compile = function (template, tags) {
    return defaultWriter.compile(template, tags);
  };

  /**
   * Compiles the partial with the given `name` and `template` to a reusable
   * function using the default writer.
   */
  mustache.compilePartial = function (name, template, tags) {
    return defaultWriter.compilePartial(name, template, tags);
  };

  /**
   * Compiles the given array of tokens (the output of a parse) to a reusable
   * function using the default writer.
   */
  mustache.compileTokens = function (tokens, template) {
    return defaultWriter.compileTokens(tokens, template);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function (template, view, partials) {
    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  mustache.to_html = function (template, view, partials, send) {
    var result = mustache.render(template, view, partials);

    if (typeof send === "function") {
      send(result);
    } else {
      return result;
    }
  };

}));

/**
 * @class Measure
 * @classdesc The Measure object mostly acts as a collection for Voices. Most of the data
 * related to the way the measure is displayed is is the {@link StaffSectionSpec}s as each
 * Staff has a set of modifiers (clef, time, etc).
 * @param {StaffSectionSpec[]} staffSpecs An array of the staff specs that relate to 
 *                                   this measure
 * @mixes Container
 * @memberOf ScoreModel 
 */

define('Measure',['mustache', './Container', './Voice', './Helpers', './TimeSignature'], 
    function(Mustache, Container, Voice, Helpers, TimeSignature){




/**
 * @lends Measure
 * @constructor
 */
var Measure = function(staffSpecs)  {
    this.init(staffSpecs);
};

/**
 * The main initialization function, gets called at construction
 * @private
 */
Measure.prototype.init = function(staffSpecs) {
    Helpers.mixin(this, Container);

    /**
     * The {@link Voice}s in the measure
     * @type {Voice[]}
     */
    this.voices = this.items;
    /**
     * The {@link StaffSectionSpec}s attached to this measure. This 
     * really contains most of the information related to the measure.
     * Clef, time sig, width, etc...
     * @type {StaffSectionSpec[]}
     */
    this.staffSpecs = [];
    /**
     * The parent Part the Measure belongs to
     * @type {Part}
     */
    this.parent = null;

    this.center = false;

    this.type = 'measure';

    this.setStaffSpecs(staffSpecs);
    this.initVoices();
};

/**
 * Determine if the measure has a part
 * @return {Boolean}
 */
Measure.prototype.hasPart = function() {
    return this.part ? true : false;
};

/**
 * Get the voice at the index
 * @param  {Number} index
 * @return {Voice}       The Voice
 */
Measure.prototype.voice = function(index) {
    if (typeof index !== 'number') {
        index = 0;
    }

    return this.voices[index];
};

/**
 * Add new empty voice to Measure
 */
Measure.prototype.addNewVoice = function() {
    this.addVoice(new Voice());
};

/**
 * Add a single voice to a Measure
 * @param  {Voice} voice
 * @param  {Number} index Insertion position
 */
Measure.prototype.addVoice = function(voice, index) {
    if (!(voice instanceof Voice)) {
        throw 'ERROR: Trying to add a non-voice type';
    }

    this.addItem(voice, index);

    return this;
};

/**
 * Add multiple voices at once to a measure
 * @param  {Voice[]} voices Array of voices to add
 */
Measure.prototype.addVoices = function(voices) {
    voices.forEach(function(voice) {
        this.addVoice(voice);
    }, this);
    return this;
};

/**
 * Remove voice from measure
 * @param  {Voice} voice Voice to remove
 */
Measure.prototype.removeVoice = function(voice) {
    this.removeItem(voice);
    return this;
};

/**
 * Set the Staff Specifications 
 * @param  {StaffSectionSpecs} specs Specs for each stave in the measure
 */
Measure.prototype.setStaffSpecs = function(specs) {
    this.staffSpecs = specs || [];
    return;
};

/**
 * Initialize the voices based on the staff specs
 * @private
 */
Measure.prototype.initVoices = function(){
    this.staffSpecs.forEach(function() {
        this.addNewVoice();
    }, this);
};

/**
 * Retreive the Spec for a staff
 * @param  {Number} staffNumber The index of the staff
 * @return {StaffSectionSpec}             Staff specifications
 */
Measure.prototype.getSpec = function(staffNumber){
    if (typeof staffNumber !== 'number') {
        staffNumber = 0;
    }
    return this.staffSpecs[staffNumber];
};

/**
 * Get a copy of the Specs for the measure
 * @return {StaffSectionsSpecs[]} The cloned Specs
 */
Measure.prototype.getClonedSpecs = function() {
    return this.staffSpecs.map(function(staffSpec) {
        return staffSpec.clone();
    });
};

/**
 * Find the number of divivisions per quarter note needed for the shortest 
 * length note in the measure.
 * 
 * Primarily used for MusicXML eporting.
 *
 * @return {number} Divisions per quarter note
 */
Measure.prototype.getDivisions = function() {
    var maxMeasureDuration = this.voices.reduce(function(maxDur, voice, index) {
        var maxVoiceDur = voice.notes.reduce(function(maxDuration, note, index) {
            var dottedDuration;
            if (note.duration.dots > 0){
                dottedDuration = note.duration.base * (note.duration.dots * (2/3));
            } else {
                dottedDuration = note.duration.base;
            }

            if (note.duration.getTupletDecimal() !== 1) {
                dottedDuration *=  (1 / note.duration.getTupletDecimal());
            }
            return dottedDuration > maxDuration ? dottedDuration : maxDuration;
        }, 0);

        return maxVoiceDur > maxDur ? maxVoiceDur : maxDur;
    }, 0);

    var divisions = maxMeasureDuration / 4;
    if (divisions % 2 !== 0) {
        divisions *= 2;
    }
    return divisions < 1 ? 1 : divisions;
};

/**
 * Helper function to set the width value of both staves at the same time.
 * @param {number} width In pixels
 */
Measure.prototype.setWidth = function(width) {
    this.staffSpecs.forEach(function(staffSpec) {
        staffSpec.set('width', width);
    });
};

return Measure;

});
/**
 * @class Part
 * @classDesc The Part class is a collection of measures and a collection of staves
 * @mixes Container
 * @param {Object} [options] The initialization options for the part. See example for options list.
 * @example <caption>A sample initialization of a part for Piano</caption>
 * new Part({
 *      name: "Grand Piano",
 *      measures : 4,
 *      numStaves: 2,
 *      clefs : ['treble', 'bass']
 * });
 * @memberOf  ScoreModel
 */
define('Part',[
    'underscore', 
    './Container', 
    './Staff', 
    './Measure', 
    './Helpers', 
    './StaffSectionSpec'], 
function(
     _, 
    Container, 
    Staff, 
    Measure, 
    Helpers, 
    StaffSectionSpec){



/**
 * @lends Part
 * @constructor
 */
var Part = function(options) {
    this.init(options);
};

Part.prototype = {
    /**
     * The parent Score
     * @type {Score}
     */
    get score() {
        return this.parent;
    }
};

/**
 * Initialization function, only called on construction
 * @param  {options} options Initialization options
 * @private
 */
Part.prototype.init = function(options) {
    var defaultOptions = {
        name: "Untitled Part",
        measures : 1,
        numStaves: 1,
        clefs : options.numStaves === 1 ? ['treble'] : ['treble', 'bass']
    };
    // Create default options
    _(options).defaults(defaultOptions);
    // Inherits items/methods from Container
    Helpers.mixin(this, Container);

    /**
     * The {@link Staff}s that belong to this part
     * @type {Staff[]}
     */
    this.staves = [];
    /**
     * The name of the part
     * @type {String}
     */
    this.name = options.name;
    /**
     * The Measures that make up the Part
     * @type {{@link Measure}[]}
     */
    this.measures = this.items;
    /**
     * The parent Score the Part belongs to
     * @type {Score}
     */
    this.parent = null;

    // Initialize the number of staves for the part. 
    _(options.numStaves).times(function(){
        this.addStaff(new Staff());
    }, this);
    // Initialize the measures
    this.initMeasures(options.measures, options.clefs);
};

/**
 * Gets the measure at an index
 * @param  {Number} index The index of the measure to get
 * @return {Measure}       The measure
 */
Part.prototype.measure = function(index) {
    if (typeof index === 'undefined') {
        index = 0;
    }
    return this.items[index];
};

/**
 * Finds the end measure of the part and sets the end barline to the END
 * type if there is a single, plain barline. Signifies the end of a part.
 *
 * @todo: Basically this is an auto-apply-end-bar.  Probably should call it that.
 */
Part.prototype.setEndBar = function(){
    this.staves.forEach(function(staff) {
        var specs     = staff.specs;
        var lastSpec     = specs[specs.length-1];
        var secondToLast = specs[specs.length-2];

        //Set last measure to have end bar if its a SINGLE
        if (lastSpec.get("endBar") == 1) {
            if (secondToLast && secondToLast.get("endBar") == 3) {
                secondToLast.set("endBar", 1);
            }
            lastSpec.set("endBar", 3);
        }
    });
};

/**
 * Initialize the part with measures
 * @param  {Number} amount The number of measures to add
 * @param  {String[]} clefs  The initial clefs for the part
 * @param  {String} key    The initial key signature for the part
 * @param  {String} time   The initial time signature for the part
 */
Part.prototype.initMeasures = function(amount, clefs, key, time) {
    if (clefs.length !== this.staves.length) {
        throw 'Invalid clefs array, doesn\t match number of staves';
    }

    _(amount).times(function() {
        var specs = [];
        this.staves.forEach(function(staff, index){
            specs.push(new StaffSectionSpec(clefs[index], key, time));
        });

        var newMeasure = new Measure(specs);
        this.addMeasure(newMeasure);
    }, this);
};

/**
 * Adds a measure to the part, if an index is specifed it's added after that 
 * index
 * @param {Measure} measure The measure to add to the part
 * @param {StaffSectionSpec[]} staffSectionSpecs The modifier maps for the related StaffSection's
 * @param {number} index  The index after which to insert
 */
Part.prototype.addMeasure = function(measure, staffSectionSpecs, index) {
    staffSectionSpecs = staffSectionSpecs || measure.staffSpecs;
    // Attach StaffSectionSpecs to the measure
    this.staves.forEach(function(staff, staffIndex){
        var spec;
        if (staffSectionSpecs) {
            measure.staffSpecs = staffSectionSpecs;
            spec = staff.addSpec(staffSectionSpecs[staffIndex], index);
        } else {
            spec = staff.newSpec(index);
            measure.staffSpecs.push(spec);
        }
    });

    this.addItem(measure, index);

    this.setEndBar();
    return this;
};

/**
 * Adds an blank measure (no staff modifiers) at the sepcifed index
 * @param {Number} index The index where to insert the measure
 */
Part.prototype.addNewMeasure = function(index) {
    this.addMeasure(new Measure(), null, index);
    return this;
};


/**
 * Remove the provided measure from the part
 * @param  {Measure} measure The measure to remove from the part
 */
Part.prototype.removeMeasure = function(measure) {
    // Don't allow a part to go down to 0 measures
    if (this.measures.length > 1) {
        // Remove the measure
        var staffSpecIndexToDelete = this.measures.indexOf(measure);
        this.removeItem(measure);

        this.staves.forEach(function(staff) {
            staff.removeItem(staffSpecIndexToDelete);
        });
    }
    this.setEndBar();
};

Part.prototype.addStaff= function(staff) {
    this.staves.push(staff);
    staff.parent = this;
    staff.part = this;
    return this;
};

/**
 * Retrieve the staff for a sepcific part at a given index
 * @param  {Number} index Index of staff to get
 * @return {Staff}       The Staff object
 */
Part.prototype.getStaff = function(index) {
    return this.staves[index];
};

return Part;

});
/**
 * @class Score
 * @classDesc The main score container
 * @param {Object} options Constructor options
 * @example <caption>Sample Score initialization:</caption>
 * var  score = new Score({
 *     parts: [{
 *         staffCount : 2,
 *         clefs : ['treble', 'bass']
 *     }, {
 *         staffCount : 1,
 *         clefs : ['bass']
 *     }], 
 *     measures: 2
 * });
 * @memberOf  ScoreModel
 */

define('Score',['underscore', 
    './Part', 
    './Container', 
    './Helpers',
    './AbstractNote'], 
    function(
    _, 
    Part, 
    Container, 
    Helpers,
    AbstractNote){



/**
 * @namespace  ScoreModel
 */

/**
 * @lends Score
 * @constructor
 */
var Score = function(options) {
    if (!options) options = {};

    _(options).defaults({
        parts : [{
            staffCount : 1,
            clefs : ['treble']
        }],   
        measures        : 8     // Number of measures to initialize
    });
    
    this.init(options);
};
Helpers.inherit(Score, Container);

/**
 * The Score initialization method. See constructor pararmeters to see options.
 * @param  {Object} options
 * @private
 */
Score.prototype.init = function(options) {
    Score.superclass.constructor.call(this);
    /**
     * The parts of the Score
     * @type {Part[]}
     */
    this.parts = this.items;

    if (options.parts.length > 0) {
        this.initParts(options.parts, options.measures);
        //this.initMeasures(options.measures);
    }
};

/**
 * Initializes the parts with the provided part specifications
 * @param  {Object[]} partSpecs Array of part initializtion options
 * @param  {Number} measures  The amount of measures to initialize with
 */
Score.prototype.initParts = function(partSpecs, measures) {
    partSpecs.forEach(function(partSpec, index) {
        this.addPart(new Part({
            numStaves: partSpec.staffCount,
            clefs : partSpec.clefs,
            measures : measures
        }));
    }, this);
};

/**
 * Get a Part from the Index
 * @param  {Number} index The index of the part
 * @return {Part}       The part
 */
Score.prototype.part = function(index) {
    if (typeof index === 'undefined'){
        index = 0;
    }
    return this.parts[index];
};

/**
 * Adds a part to the Score 
 * @param {Part} part
 */
Score.prototype.addPart = function(part) {
    this.addItem(part);
    return this;
};

/**
 * Gets the measures in a specfic column. As if the score were a grid.
 * @param  {Number} index The column index to get
 * @return {Measure[]} The measures in the column
 */
Score.prototype.getMeasureColumn = function(index) {
    var measures = [];
    this.parts.forEach(function(part) {
        var measure = part.measures[index];

        if (measure) {
            measures.push(measure);
        }
    });

    return measures;
};

/*
 * @param {Number[]} indices
 * @param {Boolean} returnFlat Flag to flatten array (convenient 
 *                             for some operations)
 * @returns {Measure[]} Measures are grouped by column
 */
Score.prototype.getMeasureColumns = function(indices, returnFlat) {
    var columns = [];
        
    indices.forEach(function(index) {
        var column = this.getMeasureColumn(index);
        columns.push(column);
    }, this);

    if (returnFlat) return _.flatten(columns);

    return columns;
};

/**
 * @return {Measure[]} An array of all the measures in the score.
 */
Score.prototype.measures = function() {
    var measures = [];
    this.parts.forEach(function(part){
        measures = measures.concat(part.measures);
    });
    return measures;
};

/**
 * Helper function to add a new measure to every part at once
 */
Score.prototype.addNewMeasure = function(index) {
    if (this.parts.length === 0) {
        throw 'Score needs to contain parts before you can add measures';
    }

    this.parts.forEach(function(part) {
        part.addNewMeasure();
    });

    return this;
};

Score.prototype.initMeasures = function(total) {
    _(total).times(function(num){
        this.addNewMeasure();
    }, this);
    return this;
};

/**
 * Helper function to add a note directly into a measure
 * @param {Note} note         The note to add
 * @param {number} partIndex    
 * @param {number} measureIndex 
 * @param {number} voiceIndex   
 */
Score.prototype.addNote = function(note, partIndex, measureIndex, voiceIndex) {
    if (! note instanceof AbstractNote) {
        throw "Invalid note type, should be AbstractNote";
    }

    if (partIndex && partIndex > -1) {
        this.parts[partIndex].addNote(note, measureIndex, voiceIndex);
    } else {
        throw "Error: part index out of lower bound";
    }
};

return Score;
    
});

/**
 * @class  Selection
 * @classDesc The Selection class that deals with selecting objects
 */

define('Selection',[
    'underscore', 
    './Measure', 
    './NoteItem', 
    './Note'], 
function(
    _, 
    Measure, 
    Noteitem, 
    Note){



/**
 * @lends Selection
 * @constructor
 */
var Selection = function() {
    this.items = [];
};

/**
 * Select a single item
 * @param  {Selectable} item The item to select
 */
Selection.prototype.selectSingle = function(item) {
    if (typeof item.select !== 'function') {
        throw "Item is not selectable";
    }
    
    this.items.push(item);
    item.select();
    return this;
};

/**
 * Select multiple items
 * @param  {Selectable[]} items The items to select
 */
Selection.prototype.selectMulti = function(items) {
    this.items.forEach(function(item){
        this.selectSingle(item);
    }, this);
    return this;
};

/**
 * Swap the selection of two items
 * @param  {Selectable} selected Item to deselect
 * @param  {Selectable} newSelection Item to select
 */
Selection.prototype.swap = function(selected, newSelection) {
    this.deselect(selected);
    this.select(newSelection);
};

/**
 * Select an item or group of items
 * @param  {Selectable|Selectable[]} input The items to select
 */
Selection.prototype.select = function(input) {
    if (input instanceof Array) {
        this.selectMulti(input);
    } else {
        this.selectSingle(input);
    }
    return this;
};

/**
 * Return only selectable items that match the filter iterator
 * @param  {Function} fn Iterator
 * @return {Selectable[]}      The filtered selected items
 */
Selection.prototype.filter = function(fn) {
    return this.items.filter(fn);
};

/**
 * Determine if the provided item is selected
 * @param  {Object} item Item to check selection for
 * @return {Boolean}      Whether item exists
 */
Selection.prototype.contains = function(item) {
    return _(this.items).contains(item);
};

/**
 * Deselect an item
 * @param  {Selectable} item Item to deselect
 */
Selection.prototype.deselect = function(item) {
    var index = this.items.indexOf(item);

    this.items.splice(index, 1);
    item.deselect();
    return this;
};

/**
 * Get Measures
 * @return {Selectable[]} The selected Measures
 */
Selection.prototype.getM = Selection.prototype.getMeasures = function() {
    return this.filter(function(item){
        return item.type == 'measure';
    });
};

Selection.prototype.getN = Selection.prototype.getNotes = function() {
    return this.filter(function(item){
        return item.type == 'note';
    });
};

Selection.prototype.getKeys = function() {
    return this.filter(function(item) {
        return item.type == 'key';
    });
};

/**
 * Check if selection is empty
 * @return {Boolean}
 */
Selection.prototype.isEmpty = function(){
    return this.items.length === 0;
};

/**
 * Clear selection
 * @param  {Function} [filterIterator] Iterator to clear only matches
 */
Selection.prototype.clear = function(filterIterator) {
    var itemsToRemove;

    if (this.isEmpty()) {
        return this;
    }

    if (filterIterator) {
        itemsToRemove = this.filter(filterIterator, this);
    } else {
        itemsToRemove = _.flatten([this.items]); // Hack to get duplicate array
    }

    if (itemsToRemove) {
        itemsToRemove.forEach(function(item) {
            this.deselect(item);
        }, this);
    }

    return this;
};

return Selection;

});

/**
 * @class Views.View
 * @classDesc Base view class.
 * @abstract
 */

define('View',[],function() {



/**
 * @namespace Views
 */
var Views = {};

/**
 * @lends Views.View
 * @param  {Object} model The view's model
 */
var View = function(model) {
    this.model = model;
};

/**
 * Build the view
 * @override
 */
View.prototype.build = function() {
    throw "Must extend abstract type build() method";
};

/**
 * Render the view
 * @override
 */
View.prototype.render = function(context) {
    throw "Must extend abstract type render() method";
};

/**
 * Set the Canvas context for the view
 * @param  {CanvasRenderingContext2D} context
 */
View.prototype.setContext = function(context) {
    this.context = context;
};

// ViewFactory = {
//     create: function(type, config) {
//         if (type === 'measure') {
//             return new MeasureView(config);
//         }
//     }
// };

return View;

});

/**
 * @class Views.NoteView
 * @classDesc The note rendering class
 * @param {Note} note The Note model to display
 * @param {StaffSectionView[]} staffSectionViews The StaffSectionViews relevent to the 
 *   MeasureView the NoteView is contained in
 * @extends Views.View
 */

define('NoteView',[
    'underscore', 
    './Helpers', 
    './View', 
    './Key', 
    './Editor',
    'vexflow'], 
function(
    _, 
    Helpers,
    View,
    Key,
    Editor,
    Vex){



/**
 * @lends Views.NoteView
 * @constructor
 */
var NoteView = function(note, staffSectionViews) {
    /**
     * The Note model for the view
     * @type {Note}
     */
    this.note = this.model = note;
    /**
     * Flag for marking the View as a rest
     * @type {Boolean}
     */
    this.isRest = note.isRest();
    /**
     * The staff number to render the view on
     * @type {[type]}
     */
    this.staffNumber = note.staffNumber;
    /**
     * The Vexflow duration string for StaveNote creation
     */
    this.durationString = note.getVexFlowDurationString();
    /**
     * The StaffSectionView to render on
     * @type {StaffSectionView}
     */
    this.staffSectionView = staffSectionViews[this.staffNumber];
    /**
     * The clef type the note is associated with
     * @type {String}
     */
    this.clef = this.staffSectionView.spec.get('clef');

    // Note specific properties
    if (!note.isRest()) {
        /**
         * The indexes of the keys that are selected
         * @type {[type]}
         */
        this.selectedKeyIndices = note.getSelectedKeyIndices();
        /**
         * The direction of the Stem
         * @type {Number}
         */
        this.stemDirection = note.getStemDirection ? note.getStemDirection() : 0;
        /**
         * The Keys in the note in String from
         * @type {String}
         */
        this.keyStringArray = note.getKeyStringArray();
    }
    /**
     * The Vex.Flow.StaveNote that the View builds
     * @type {Vex.Flow.StaveNote}
     */
    this.vf_note          = false;

    this.type = 'NoteView';
};
Helpers.inherit(NoteView, View);


/**
 * Build the VexFlow objects to render. 
 * @todo Refactor when it becomes more necessary to seperate into different views
 */
NoteView.prototype.build = function() {
    var note = this.note;

    if (note.isRest()){
        var isRest = true;
        this.buildStaveNote(isRest);
    } else if (note.isNote()) {
        this.buildStaveNote();
    } else if (note.isTab()) {
        this.buildTabNote();
    }
};

/**
 * Render the note onto the canvas
 * @param  {contexts} contexts The canvas contexts
 */
NoteView.prototype.render = function(contexts) {
    this.contexts = contexts;

    this.vf_note.setContext(contexts.main).draw();

    if (this.isRest) {
        return;
    }

    this.renderSelectedKeys(contexts.selection);
};

/**
 * Highlight the selected NoteItems
 */
NoteView.prototype.renderSelectedKeys = function(context) {
    var selectionCtx = context;

    this.note.getSelectedKeyIndices().forEach(function(index){
        this.highlightKey(index, selectionCtx);
    }, this);
};

/**
 * Builds the Vex.Flow.StaveNote
 * @param {Boolean} isRest Flag for building a rest note
 * @todo Extract .buildRest() method
 */
NoteView.prototype.buildStaveNote = function(isRest) {
    var clef = this.clef || 'treble',
        note = this.note;
    
    var noteSpec;
    if (isRest) {
        var restPosition;
        if (note.position) {
            restPosition = note.position;
        } else if (clef === 'treble') {
            if (note.duration.base === 1){
                restPosition = 'd/5';
            } else {
                restPosition = 'b/4';
            }
        } else if (clef === 'bass') {
            if (note.duration.base === 1) {
                restPosition = 'f/3';
            } else {
                restPosition = 'd/3';
            }
        } else if (clef === 'alto') {
            if (note.duration.base === 1) {
                restPosition = "e/4";
            } else {
                restPosition = 'c/4';
            }
        } else if (clef === 'tenor') {
            if (note.duration.base === 1){
                restPosition = 'c/4';
            } else {
                restPosition = 'a/3';
            }
        }

        noteSpec = {
            clef     : clef, 
            keys     : [restPosition], 
            duration : note.getVexFlowDurationString()
        };
    } else {
        noteSpec = {
            clef           : clef, 
            keys           : this.keyStringArray, 
            duration       : this.durationString,
            stem_direction : this.stemDirection
        };
    }

    var newNote = new Vex.Flow.StaveNote(noteSpec);
    newNote.setStave(this.staffSectionView.vf_stave);

    if (!note.isRest()) {
        note.keys.forEach(function(key, index) {
            newNote.setKeyStyle(index, {fillStyle: key.color});
        });
    }

    // For each dot, add one to the note
    _(this.note.dots).times(function(){
       newNote.addDotToAll();
       newNote.applyTickMultiplier(3, 2);
    });

    this.vf_note = newNote;
};

NoteView.prototype.buildTabNote = function() {
    var note      = this.note,
        positions = note.getPositionArray();

    this.vf_note = new Vex.Flow.TabNote({positions: positions, duration: note.getVexFlowDurationString()});
};

/**
 * Get the a new Vex.Flow.Articulation from the code.
 * 
 * @param  {number} code Articulation enum code
 * @return {Vex.Flow.Accidental}
 * @todo Rename to factory. Maybe refactor into hash table with edge case for Vibrato? 
 */
NoteView.prototype.getArticulationFromCode = function(code) {
    var acc = false;
    switch (code) {
        case Editor.articulations.VIBRATO:
            acc = new Vex.Flow.Vibrato();
            break;
        case Editor.articulations.BEND_HALF:
            acc = new Vex.Flow.Bend("1/2");
            break;
        case Editor.articulations.STACCATO:
            acc = new Vex.Flow.Articulation("a.");
            break;
        case Editor.articulations.STACCATISSIMO:
            acc = new Vex.Flow.Articulation("av");
            break;                
        case Editor.articulations.ACCENT:
            acc = new Vex.Flow.Articulation("a>");
            break;                
        case Editor.articulations.TENUTO:
            acc = new Vex.Flow.Articulation("a-");
            break;                        
        case Editor.articulations.MARCATO:
            acc = new Vex.Flow.Articulation("a^");
            break;            
        case Editor.articulations.LEFT_HAND_PIZZICATO:
            acc = new Vex.Flow.Articulation("a+");
            break;            
        case Editor.articulations.SNAP_PIZZICATO:
            acc = new Vex.Flow.Articulation("ao");
            break;            
        case Editor.articulations.UP_STROKE:
            acc = new Vex.Flow.Articulation("a|");
            break;            
        case Editor.articulations.DOWN_STROKE:
            acc = new Vex.Flow.Articulation("am");
            break;            
        case Editor.articulations.FERMATA_ABOVE:
            acc = new Vex.Flow.Articulation("a@a");
            break;                    
        case Editor.articulations.FERMATA_BELOW:
            acc = new Vex.Flow.Articulation("a@u");
            break;
        default:
            return false;        
    }

    return acc;
};

/**
 * Build the Vex.Flow.Articulation objects to render
 */
NoteView.prototype.buildSimpleArticulations = function() {
    var y_shift = 0;
    var vf_note = this.vf_note;

    // Rests can't have articulations
    if (this.note.isRest()){
        return;
    }

    // Build articulations for individual pitches or tab positions
    this.note.items.forEach(function(item){
        if (item.articulations.length > 0) {
            item.articulations.forEach(function(articulationCode){

                var vf_articulation = this.getArticulationFromCode(articulationCode);
                if (!vf_articulation) return;

                if (vf_note instanceof Vex.Flow.StaveNote &&
                    vf_note.getStemDirection() === -1) {
                    vf_articulation.setPosition(Vex.Flow.Modifier.Position.ABOVE);
                }

                vf_articulation.y_shift = y_shift;
                y_shift += 10;

                vf_note.addModifier(item.getIndex(), vf_articulation);
            });
        }
    }, this);

    // Build articulations for particular to the entire chord/note
    this.note.articulations.forEach(function(articulationCode){
        var vf_articulation = this.getArticulationFromCode(articulationCode);
        if (!vf_articulation) return;


        if (vf_note instanceof Vex.Flow.StaveNote &&
            vf_note.getStemDirection() === -1) {
            vf_articulation.setPosition(Vex.Flow.Modifier.Position.ABOVE);
        }

        vf_articulation.y_shift = y_shift;
        y_shift += 10;

        vf_note.addModifier(0, vf_articulation);
    }, this);
};

/**
 * Determine if the click occurs within the width of the notehead
 *
 * Need to test for the entire column since we don't know what specific we might clicking 
 * on in a Vex.Flow.Note. So first we test for column, and then you would need to test 
 * specific y coordinates if they matched up. See NotationVoiceView.handleClick()
 */
NoteView.prototype.clickInColumn = function(click) {
    var note       = this.vf_note;
    var noteStartX = note.getX() +  note.stave.getNoteStartX() + 10;
    var noteEndX   = noteStartX + note.getWidth() + 4;
    if (click.x    >= noteStartX - 2 && click.x <= noteEndX + 2) {
        return true;
    }
    return false;
};

/**
 * Determine if the click occurs to the left of the notehead
 * @param {Object} click {x,y} coordinates
 */
NoteView.prototype.isLeft = function(click) {
    var note       = this.vf_note;
    var noteStartX = note.getX() +  note.stave.getNoteStartX() + 10;
    if (click.x < noteStartX) {
        return true;                  // Point is to the left of the note
    }
    return false;
};

/**
 * Determine if the click occurs to the right of the notehead
 * @param {Object} click {x,y} coordinates
 */
NoteView.prototype.isRight= function(click) {
    var note       = this.vf_note;
    var noteStartX = note.getX() +  note.stave.getNoteStartX() + 10;
    var noteEndX   = noteStartX + note.getWidth() + 4;
    if (click.x > noteEndX) {
            return true;                 // Point is to the right of the note
    }
    return false;
};

/**
 * Handle the click and throw the related events with relevent data
 * @param  {Object} click        {x, y} coordinates
 * @param  {String} clickedPitch The pitch that was specifically clicked on the staff
 * @param  {EventHandler} events       The main Event bus
 */
NoteView.prototype.handleClick = function(click, clickedPitch, events) {
    var tempKeyClicked = new Key(clickedPitch);

    // Get the key clicked in the note
    var keyClicked = _(this.note.keys).filter(function(item){
        return (item.toString()[item.toString().length-1] == tempKeyClicked.toString()[tempKeyClicked.toString().length-1] &&
        item.toString()[0] == tempKeyClicked.toString()[0]);
    })[0];

    if (keyClicked) {
        events.trigger('click', {
            target: keyClicked,
            note : this.note
        });
    } else {
        events.trigger('click', {
            target : this,
            pitch : clickedPitch
        });
    }
};

/**
 * Handle the hover and throw the related events with relevent data
 * @param  {mouse} mouse      {x, y} coordinates
 * @param  {String} hoverPitch the pitch that was specifcally hovered over on the staff
 * @param  {EventHandler} events     The main Event bus
 */
NoteView.prototype.handleHover = function(mouse, hoverPitch, events) {
    var vf_note = this.vf_note;

    var tempKey = new Key(hoverPitch);

    // Determine whether a Key this note was specifically clicked
    // Returns a Key object if found
    var tempKeyHovered = _(this.note.keys).filter(function(item){
        return (item.toString()[item.toString().length-1] == tempKey.toString()[tempKey.toString().length-1] &&
        item.toString()[0] == tempKey.toString()[0]);
    })[0];

    if (tempKeyHovered) {
        events.trigger('hover', {
            mouse : mouse,
            target : this,
            keyIndex : tempKeyHovered.getIndex()
        });
        return true;
    }
    return false;
};

/**
 * Highlight a specific key
 * @param  {Number} index   The Key to highlight
 * @param  {CanvasRenderingContext2D[]} context The canvas context to render on
 */
NoteView.prototype.highlightKey = function(index, context) {
    var vf_note = this.vf_note;

    context.fillStyle = CONFIG.placeholderColor;

    var displacementMap = this.note.items.map(function(key) {
        return key.determineDisplaced();
    });
   
     
    var startX = vf_note.getX() + vf_note.stave.getNoteStartX() +  9;
    if (displacementMap[index]) {
        startX += 10;
    }

    Helpers.roundRect(context, startX, vf_note.getYs()[index]-9, 18 ,18 , 5, true,  false);
};

/**
 * Handle Mouse down event (for right click functionality) and throw related events/data
 * @param  {jqEvent} event     The jQuery event object
 * @param  {String} tempPitch The pitch the mouse is interacting with
 * @param  {EventHandler} events    The application Event bus
 */
NoteView.prototype.handleMousedown = function(event, tempPitch, events) {

    var tempKey = new Key(tempPitch);

    // Determine whether a key in this note was clicked via string comparison
    var keyClicked = _(this.note.keys).filter(function(item){
        return (item.toString()[item.toString().length-1] == tempKey.toString()[tempKey.toString().length-1] &&
        item.toString()[0] == tempKey.toString()[0]);
    })[0];

    if (keyClicked) {
        events.trigger('right-click', {
            pageY : event.pageY,
            pageX : event.pageX,
            keyClicked : keyClicked
        });
    }
};

return NoteView;

}); 
/**
 * @class  VoiceView
 * @classDesc Abstract VoiceView type. Contains a collection of notes.
 * @abstract
 * @extends Views.View
 * @memberOf Views
 */

define('VoiceView',[
    'vexflow',
    './View', 
    './NoteView', 
    './Helpers', 
    './TimeSignature'], 
function(
    Vex,
    View, 
    NoteView, 
    Helpers, 
    TimeSignature){



/**
 * @lends Views.VoiceView
 * @constructor
 */
var VoiceView = function(voice, staffSectionViews) {
	this.init(voice, staffSectionViews);
};
Helpers.inherit(VoiceView, View);

/**
 * The main initialization function, called on construction
 * @private
 */
VoiceView.prototype.init = function(voice, staffSectionViews) {
    /**
     * The main Voice model for the view
     * @type {Voice}
     */
    this.voice = voice;
    /**
     * The StaffSectionViews the VoiceViews are going to render with
     * @type {StaffSectionView[]}
     */
    this.staffSectionViews = staffSectionViews; // Need to hold onto this when we render
    /**
     * The child NoteViews for the VoiceView
     * @type {NoteView[]}
     */
    this.noteViews = [];
    /**
     * The Vex.Flow.Voice to build
     * @type {Boolean}
     */
    this.vf_voice = false;
    /**
     * The Vex.Flow.Tuplet objects 
     * @type {Vex.Flow.Tuplet[]}
     */
    this.vf_tuplets = [];
    /**
     * The Vex.Flow.StaveTie objects to render
     * @type {Vex.Flow.StaveTie}
     */
    this.vf_ties  = [];

    VoiceView.superclass.constructor.call(this, voice);
};

/**
 * @override
 */
VoiceView.prototype.handleClick = function(click) { };
/**
 * @override
 */
VoiceView.prototype.handleMousedown = function(click) { };
/** 
 * @override
 */
VoiceView.prototype.handleHover = function(mouse) { };

/**
 * Build the child NoteViews
 * @param  {String} clef The clef on which the notes are on
 */
VoiceView.prototype.buildNoteViews = function(clef) {
    var noteViews = [], 
        staffSectionViews = this.staffSectionViews;

    this.voice.notes.forEach(function(note){
        var noteView = new NoteView(note, staffSectionViews);
        noteView.build();
        noteViews.push(noteView);
    });

    this.noteViews = noteViews;

};

/**
 * Get the StaffSection that was clicked from the mouse coordinates
 * @param  {Object} mouse {x, y} Coordinates
 * @return {StaffSectionView}       The StaffSectionView the mouse coordinates apply to
 */
VoiceView.prototype.getStaffSectionViewFromMouse = function(mouse) {
    var result = this.staffSectionViews.filter(function(staffSectionView) {
        return staffSectionView.isClicked(mouse);
    });
    return result[0] || false;
};

/**
 * Build the Vex.Flow.Tuplet objects
 */
VoiceView.prototype.buildTuplets = function() {
    var prevNote, prevTupletMod;
    var tupletGroups = [],
        tupletGroup = [];

    this.noteViews.forEach(function(noteView) {
        var note = noteView.note;
        var tupletMod = note.duration.tupletMod;

        if (tupletMod !== "1") {
            if (parseInt(tupletMod.split('/')[1], 10) > tupletGroup.length ){
                tupletGroup.push(noteView.vf_note);
            } else {
                tupletGroups.push(tupletGroup);
                tupletGroup = [noteView.vf_note];
            }
        } else {
            tupletGroups.push(tupletGroup);
            tupletGroup = [];
        }

        prevNote = note;
        prevTupletMod = tupletMod;
    });

    if (tupletGroup.length > 1) tupletGroups.push(tupletGroup);

    var vf_tuplets = [];
    tupletGroups.forEach(function(noteGroup){
        if (noteGroup.length > 1)
            vf_tuplets.push(new Vex.Flow.Tuplet(noteGroup));
    });
    this.vf_tuplets = vf_tuplets;
};

/**
 * Render the Vex.Flow.Tuplets
 * @param  {CanvasRenderContext2D} context The canvas context to draw on
 */
VoiceView.prototype.renderTuplets = function(context) {
    this.vf_tuplets.forEach(function(tuplet){
        tuplet.setContext(context).draw();
    });
};

/**
 * Use this to build the voice for the measure. The Vex.Flow.Voice
 * built is unformatted and must be formatted before it can be drawn. Note that
 * the Vex.Flow.Voice created with strict mode set to false. This allows for a
 * voice to be incomplete within a measure.
 */
VoiceView.prototype.buildVoice = function() {
    // Get Vex.Flow.StaveNotes to wrap into Vex.Flow.Voice
    var vf_notes = this.noteViews.map(function(noteView){
        return noteView.vf_note;
    });

    if (vf_notes.length === 0) {
        this.vf_voice = null;
        return;
    }

    // splits up the time signature string
    var timeSig = new TimeSignature("4/4");

    var timeSigParts = timeSig ? timeSig.toArray() : new TimeSignature().toArray();

    // Initialize new Vex.Flow.Voice using the time signature parts
    var voice = new Vex.Flow.Voice({
            num_beats: timeSigParts[0],
            beat_value: timeSigParts[1],
            resolution: Vex.Flow.RESOLUTION
        });

    // Set the voice to not strict to allow incomplete bars to be used
    voice.setStrict(false);
    // Add the notes to the voice
    voice.addTickables(vf_notes);
    // Return the built voice
    this.vf_voice = voice;
};

/**
 * Render the child NoteViews
 * @param  {CanvasRenderingContext2d} context The Canvas context to draw on
 */
VoiceView.prototype.renderNotes = function(context) {
    this.noteViews.forEach(function(noteView){
        noteView.render(context);
    });
};

/**
 * Render the Ties in the voice
 * @param  {CanvasRenderContext2D} context the canvas context to draw on
 */
VoiceView.prototype.renderTies = function(context) {
    this.vf_ties.forEach(function(tie){
        tie.setContext(context).draw();
    });
};

/**
 * Determine if the Voice has any notes
 * @return {Boolean}
 */
VoiceView.prototype.hasChildren = function() {
    if (this.noteViews.length === 0)
        return false;
    return true;
};

return VoiceView;

});
/**
 * @class Editor.Applicators
 * @static
 */

define('Applicators',['vexflow'], function(Vex){
   


/**
 * @lends  Editor.Applicators
 */
var Applicators = {};

/**
 * Automatically applies Vex.Flow.Accidentals to be rendered according to standard
 * notation
 * 
 * Semantics are confusing here, remember that a Key is a pitch contained within a Note. 
 * Not a musical key signature. The keyManager is a Vex.Flow utility to determine 
 * accidental placement. 
 * @static
 */
Applicators.Accidentals = function(noteViews, keyManager) {
    noteViews.forEach(function(noteView) {
        var accidentals = [];
        var prevKey;

        if (!noteView.note.isRest()) {
            noteView.note.keys.forEach(function(key, keyIndex){
                var accidental;
                var spec_props = Vex.Flow.keyProperties(key.toString());
                var selected_note = keyManager.selectNote(spec_props.key);

                if (selected_note.change) {
                    if (selected_note.accidental === null){
                        accidental = "n";
                    } else {
                        accidental = selected_note.accidental;
                    } 
                } else {
                    accidental = null;
                }
                if (prevKey && prevKey.step == key.step) {
                    var isNatural = prevKey.accidental === "";
                    if (isNatural) accidental = "n";
                }

                var new_note = selected_note.note;
                var new_octave = spec_props.octave;
                
                var music = new Vex.Flow.Music();
                var old_root = music.getNoteParts(spec_props.key).root;
                var new_root = music.getNoteParts(selected_note.note).root;

                accidentals.push(accidental);

                prevKey = key;

            });
        }


        accidentals.forEach(function(acc, index) {
            if (acc && !noteView.note.isRest()) { /** @todo refactor separate rest class */
                noteView.vf_note.addAccidental(index, new Vex.Flow.Accidental(acc));
            }
        });
    });
};

return Applicators;

});
/**
 * @class Editor.StemFormatter
 * @classDesc Used to auto format stems. 
 * @static
 */

define('StemFormatter',[],function() {
    


/**
 * @lends Editor.StemFormatter
 */
var StemFormatter = {};
/**
 * The main function call for the class
 * @static
 * @public
 * @param  {Vex.Flow.StaveNote[][]} noteGroups The notes to format grouped by shared beam
 */
StemFormatter.format = function(noteGroups) {
    this.formatGroups(noteGroups);
};

/**
 * Convenience function to process every group at once
 * @private
 * @param  {Vex.Flow.StaveNote[]} noteGroups The notes to format grouped by shared beam
 */
StemFormatter.formatGroups = function(noteGroups) {
    var _this = this;
    noteGroups.forEach(function(group){
        _this.formatGroup(group);
    });
};

/**
 * Sets the Vex.Flow.StaveNote stem directions for a single group
 * @private
 * @param  {Vex.Flow.StaveNote[]} group A group of notes with a shared beam 
 */
StemFormatter.formatGroup = function(group) {
    var stemDirection = this.determineStemDirection(group);

    this.applyStemDirection(group, stemDirection);
};

/**
 * Determines the stem direction of the entire group. Works with beam
 * groups, chords and single notes.
 * @param  {Vex.Flow.StaveNote[]} group A group of notes with a shared beam 
 * @private
 */
StemFormatter.determineStemDirection = function(group) {
    var lineSum = 0;

    group.forEach(function(note) {
        note.keyProps.forEach(function(keyProp){
            lineSum += (keyProp.line - 3);
        });
    });

    if (lineSum > 0)
        return -1;
    return 1;
};

/**
 * Apply a stem direction to a group of notes
 * @private
 * @param  {Vex.Flow.StaveNote[]} group
 * @param  {Number} direction The direction of the stem, -1 or 1
 */
StemFormatter.applyStemDirection = function(group, direction) {
    group.forEach(function(note){
        note.setStemDirection(direction);
    });
};

return StemFormatter;

});

/**
 * @class  NoteGrouper
 * @classDesc Method object to deal with stem processing since it's kind of dirty
 *
 * @param {Vex.Flow.StaveNote[]} vf_notes The stave notes to be beaming together
 * @param {Number} [ticksPerGroup=4096] The amount of ticks per beam group.
 */

define('NoteGrouper',['underscore'], function(_){



/**
 * @lends NoteGrouper
 * @constructor
 */
var NoteGrouper = function(vf_notes, ticksPerGroup) {
    this.init(vf_notes, ticksPerGroup);
};

NoteGrouper.prototype.init = function(vf_notes, ticksPerGroup) {
    this.unprocessedNotes = vf_notes;
    this.ticksPerGroup    = ticksPerGroup || 4096;
    this.noteGroups       = [];
    this.currentGroup     = [];

    this.createGroups();
};

/**
 * Returns all the groups that contain 2 notes or more (a minimum of twonotes are 
 * needed to beam)
 */
NoteGrouper.prototype.getBeamGroups = function() {
    return _.compact(
        this.noteGroups.map(function(group){
            group = group.filter(function(note){
                return (note.noteType !== 'r');
            });

            if (group.length > 1)
                return group;
        })
    );
};

/**
 * Get the group of notes
 * @return {Vex.Flow.StaveNote[][]} Array of note groups
 */
NoteGrouper.prototype.getStemGroups = function() {
    return this.noteGroups;
};

/**
 * Creates groups of notes based off the 'ticksPerGroup' property
 */
NoteGrouper.prototype.createGroups = function() {
    var currentGroup = this.currentGroup;
    var nextGroup = [];
    var _this = this;

    function getTotalTicks(vf_notes){
        return _(vf_notes).reduce(function(memo,note){
            return note.getTicks().value() + memo;
        }, 0);
    }

    this.unprocessedNotes.forEach(function(unprocessedNote){
        nextGroup    = [];

        if (unprocessedNote.shouldIgnoreTicks()) {
          this.noteGroups.push(currentGroup);
          currentGroup = nextGroup;
          return; // Ignore untickables (like bar notes)
        }

        currentGroup.push(unprocessedNote);

        // If the note that was just added overflows the group tick total
        if (getTotalTicks(currentGroup) > _this.ticksPerGroup) {
            nextGroup.push(currentGroup.pop());
            _this.noteGroups.push(currentGroup);
            currentGroup = nextGroup;
        } else if (getTotalTicks(currentGroup) == _this.ticksPerGroup) {
            _this.noteGroups.push(currentGroup);
            currentGroup = nextGroup;
        }
    });

    // Adds any remainder notes
    if (currentGroup.length > 0)
        this.noteGroups.push(currentGroup);

    return this;
};

return NoteGrouper;

});
/**
 * @class Views.NotationVoiceView
 * @classDesc A Collection of Notes in standard notation
 * @extends Views.VoiceView
 */

define('NotationVoiceView',[
    'underscore',
    'vexflow',
    './VoiceView', 
    './Applicators', 
    './StemFormatter', 
    './NoteGrouper', 
    './Helpers', 
    './TimeSignature', 
    './Editor'],
function(
    _, 
    Vex,
    VoiceView, 
    Applicators, 
    StemFormatter, 
    NoteGrouper, 
    Helpers, 
    TimeSignature,
    Editor){



/**
 * @lends Views.NotationVoiceView
 * @constructor
 */
var NotationVoiceView = function(voice, staffSectionViews, clef) {
    this.init(voice, staffSectionViews, clef);
};
Helpers.inherit(NotationVoiceView, VoiceView);

/**
 * The main initialization function, called on construction
 * @private
 */
NotationVoiceView.prototype.init = function(voice, staffSectionViews, clef) {
    /**
     * The Vex.Flow.Beam objects
     * @type {Vex.Flow.Beam[]}
     */
    this.vf_beams = [];
    /**
     * The clef to render
     * @type {String}
     */
    this.clef          = clef;
    /**
     * The key signature to render
     * @type {String}
     */
    this.keySignature  = staffSectionViews[0].spec.get('keySignature');
    /**
     * The time signature to render
     * @type {String}
     */
    this.timeSignature = staffSectionViews[0].spec.get('timeSignature');
    /**
     * Handles the display of accidentals
     * @static
     * @type {Vex.Flow.KeyManager}
     */
    this.keyManager    = new Vex.Flow.KeyManager(this.keySignature);
    /**
     * Whether or not to auto format the stems in the voice
     * @type {Boolean}
     */
    this.autoStem      = false;

    this.type = "NotationVoiceView";

    NotationVoiceView.superclass.init.call(this, voice, staffSectionViews);
};

/**
 * Returns the max number of ticks allowed in a beam group. Used for figuring 
 * out beam groups are tuple or duple.
 *
 * Currently really naive
 */
NotationVoiceView.prototype.getBeamingTicks = function() {
    var timeSig = new TimeSignature(this.timeSignature);

    var TICKS_QUARTER = 4096,
        TICKS_8TH = 2048;

    // Check for 3/8 based meter
    if (timeSig.getTotalBeats() % 3 === 0 && timeSig.getBeatValue() == 8) {
        return TICKS_QUARTER + TICKS_8TH;
    } else {
        return TICKS_QUARTER; 
    }
};

/**
 * Main building method. 
 */
NotationVoiceView.prototype.build = function() {
    var vf_notes = this.buildNotes();
    this.buildTuplets();

    var grouper = new NoteGrouper(vf_notes, this.getBeamingTicks());
    var stemGroups = grouper.getStemGroups();
    var beamGroups = grouper.getBeamGroups();

    if (this.autoStem) {
        StemFormatter.format(stemGroups);
    }

    this.buildArticulations();
    this.buildBeams(beamGroups);
    this.buildTuplets();            // HACK: We build tuplets again in fix bracketing issues
    this.buildVoice();
    this.buildTies(); // Must comes after buildArticulations()

    // Apply rules of standard notation to the accidentals
    Applicators.Accidentals(this.noteViews, this.keyManager);

    return this;
};

/**
 * Build the note views
 * @return {[type]} [description]
 */
NotationVoiceView.prototype.buildNotes = function() {
    this.buildNoteViews(this.clef);

    var vf_notes = _(this.noteViews).map(function(noteView){
        return noteView.vf_note;
    });

    return vf_notes;
};

NotationVoiceView.prototype.buildTies = function(){
    var starts = [];
    var ends = [];

    this.noteViews.forEach(function(noteView){
        if (noteView.note.isRest()) return;

        if (noteView.note.tieStart.length > 0) {
            noteView.note.tieStart.forEach(function(index) {
                starts.push({
                    first_note : noteView.vf_note,
                    first_indicies : [index] 
                });
            });
        }
        if (noteView.note.tieEnd.length > 0) {
            noteView.note.tieEnd.forEach(function(index) {
                ends.push({
                    last_note : noteView.vf_note,
                    last_indicies : [index]
                });
            });

        }
    });

    var ties = starts.map(function(startData, index) {
        var endData = _.find(ends, function(endData) {
            if (endData.found){
                return false;
            }

            var endKeyIndex = endData.last_indicies[0];
            var startKeyIndex = startData.first_indicies[0];
            var accidentalEqual = endData.last_note.keyProps[endKeyIndex].accidental == startData.first_note.keyProps[startKeyIndex].accidental;
            var octaveEqual = endData.last_note.keyProps[endKeyIndex].octave == startData.first_note.keyProps[startKeyIndex].octave;
            var stepEqual = endData.last_note.keyProps[endKeyIndex].key == startData.first_note.keyProps[startKeyIndex].key;
            
            if (accidentalEqual && octaveEqual && stepEqual){
                endData.found = true;
                return true;
            }
        });

        return new Vex.Flow.StaveTie({
            first_note: startData.first_note,
            last_note: endData.last_note,
            first_indices: startData.first_indices,
            last_indicies: endData.last_indicies
        });
    });

    this.vf_ties = this.vf_ties.concat(ties);
};

/**
 * Build the Vex.Flow.Beam's for the note groups
 * @param  {Array} groups Group of notes to beam together 
 */
NotationVoiceView.prototype.buildBeams = function(groups) {
    // Initialize array that will contain the beams
    var beams = [];

    // Traverse through each note group
    groups.forEach(function(group) {
        // Create new beam and push it into the Beams array
        try {
            var beam = new Vex.Flow.Beam(group);
            beams.push(beam);
        } catch (err) {
            //console.log('beam building error');
        }
    });
    
    this.vf_beams = beams;
};

/**
 * Build articulations for the voice
 */
NotationVoiceView.prototype.buildArticulations = function() {
    this.noteViews.forEach(function(noteView){
        noteView.buildSimpleArticulations();
    });

    this.buildLegato();
};

/**
 * Build legato articulations
 */
NotationVoiceView.prototype.buildLegato = function() {
    var vf_ties = [];

    var firstNote, lastNote;
    this.noteViews.forEach(function(noteView){
        var note = noteView.note;

        if (_.contains(note.articulations, Editor.articulations.LEGATO)) {
            if (!firstNote)
                firstNote = noteView.vf_note;
            else
                lastNote= noteView.vf_note;

            if (!note.hasNext() || !note.getNext().articulations.contains(Editor.articulations.LEGATO)) {
                vf_ties.push(new Vex.Flow.StaveTie({
                    first_note: firstNote,
                    last_note: lastNote,
                    first_indices: [0],
                    last_indicies: [0]
                }));
                firstNote = lastNote = false;
            }
        }
    });

    this.vf_ties = vf_ties;
};

/**
 * Main rendering function
 * @param {Object} contexts The instance's canvas contexts object 
 */
NotationVoiceView.prototype.render = function(contexts) { 
    this.renderNotes(contexts);
    this.renderBeams(contexts.main); 
    this.renderTies(contexts.main);
    this.renderTuplets(contexts.main);
};

/**
 * Render the beams
 * @param  {CanvasRenderContext2D} context The canvas context
 */
NotationVoiceView.prototype.renderBeams = function(context) {
    this.vf_beams.forEach(function(beam){
        beam.setContext(context).draw();
    });
};

/**
 * Handle the click and throw the appropriate events
 * @param {Object} mouseCoords {x,y} coordinates
 * @param {EventHandler} events The application event bus
 */
NotationVoiceView.prototype.handleClick = function(mouseCoords, events) {
    var insertionIndex = -1;

    var staffSectionView  = this.getStaffSectionViewFromMouse(mouseCoords);

    var staffIndexClicked = this.staffSectionViews.indexOf(staffSectionView);
    var staffPitchClicked = staffSectionView.getNoteFromY(mouseCoords.y);
    var line              = staffSectionView.getLineFromY(mouseCoords.y);
    var done = false;
    if (this.noteViews.length > 0) {
        // Hacky use of Array.some as a breakable foreach
        this.noteViews.forEach(function(noteView, index, noteViews){
            var note = noteView.note;

            var nextNote = note.hasNext() ? note.getNext() : note;
            if (noteView.clickInColumn(mouseCoords)) {
                noteView.handleClick(mouseCoords, staffPitchClicked, events);
                done = true;
            } else if (note.isFirst() && noteView.isLeft(mouseCoords)) {
                if (!done)  {
                    insertionIndex = 0;
                    done = true;
                }
            } else if (noteView.isRight(mouseCoords) && note.hasNext() && noteViews[index+1].isLeft(mouseCoords)){
                if (!done) {
                    insertionIndex = note.getIndex() + 1;
                    done = true;
                }
            } else if (note.isLast() && noteView.isRight(mouseCoords)) {
                if (!done) {
                    done = true;
                    insertionIndex = note.voice.notes.length;                
                }

            }
        });
    } else {
        insertionIndex = 0;
    }

    // If no note was clicked
    if (insertionIndex > -1) {
        events.trigger('click', {
            target : this,
            staffIndex : staffIndexClicked,
            voicePosition : insertionIndex,
            line : line,
            pitch : staffPitchClicked
        });
    }

};

NotationVoiceView.prototype.handleHover = function(mouse, hoveredOverPitch, events) {
    this.noteViews.forEach(function(noteView){
        if (noteView.clickInColumn(mouse)) {
            noteView.handleHover(mouse, hoveredOverPitch, events);
        }
    });
};

NotationVoiceView.prototype.handleMousedown = function(jqEvent, mouseCoords, clickedPitch, events) {
    this.noteViews.forEach(function(noteView){
        if (noteView.clickInColumn(mouseCoords)) {
            noteView.handleMousedown(jqEvent, clickedPitch, events);
        }
    });
};

return NotationVoiceView;

});
/**
 * @class  Views.TabVoiceView
 * @classDesc the view for TabVoices. Hanles building and rendering of NoteViews
 * @param  {Voice} voice    The View's model
 * @param  {Vex.Flow.Stave} vf_stave The VexFlow stave object that will be built and rendered
 * @extends Views.View
 */

define('TabVoiceView',['./VoiceView', './Helpers'], function(VoiceView, Helpers){

/**
 * @lends Views.TabVoiceView
 * @constructor
 */
var TabVoiceView = function(voice, vf_stave) {
	this.init(voice, vf_stave);
};
Helpers.inherit(TabVoiceView, VoiceView);

TabVoiceView.prototype.init = function(voice, vf_stave) {
	TabVoiceView.superclass.init.call(this, voice, vf_stave);
};

TabVoiceView.prototype.build = function() {
    this.buildNotes();
    this.buildArticulations();
    this.buildVoice();

    return this;
};

TabVoiceView.prototype.buildNotes = function() {
    this.buildNoteViews();
    // Potentially will have more logic
};

TabVoiceView.prototype.buildArticulations = function() {
    this.noteViews.forEach(function(noteView){
        noteView.buildSimpleArticulations();
    });
};

TabVoiceView.prototype.render = function() {
    this.renderVoice();
};

TabVoiceView.prototype.handleClick = function(click) {
    if (this.hasChildren()){
        /** 
         * @todo Eventually refactor this into a TabNote.handlClick function. 
         * But first you'd need to make a MeasureItem class or something to 
         * represent the abstract object for StandardNotes, TabNotes, Rests(?), 
         * and all other notes/objects that could go in an abstract measure
         */
        var clickedPosition, clickedNote;
        for (var m = 0; m < this.noteViews.length; m++) {
            var vf_note    = this.noteViews[m].vf_note;
            var noteStartX = vf_note.getX() +  this.vf_stave.getNoteStartX() + 10;
            var noteEndX   = noteStartX + vf_note.getWidth() + 4;


            if (noteStartX <= click.x) {
                clickedNote = this.voice.notes[m];
                clickedPosition = clickedNote.findPositionWithString(selection.string+1);
            }
        }
        if (clickedPosition)
            selection.reset().add(clickedPosition);
        else if (clickedNote)
            selection.reset().add(clickedNote);
    }
};

return TabVoiceView;

});

/**
 * @class  Views.MeasureView
 * @classDesc Represents a measure on the Canvas
 * @param {Measure} measure           The model
 * @param {StaffSectionView[]} staffSectionViews The StaffSectionViews to associate with this MeasureView;
 * @extends Views.View
 */
define(
    'MeasureView',['./NotationVoiceView', 
    './TabVoiceView', 
    './View', 
    './Helpers',
    './NoteGrouper', 
    './StemFormatter'], 
function(
    NotationVoiceView, 
    TabVoiceView, 
    View, 
    Helpers, 
    NoteGrouper, 
    StemFormatter){



/**
 * @lends Views.MeasureView
 * @constructor
 */
var MeasureView = function(measure, staffSectionViews) {
    this.init(measure, staffSectionViews);
};
Helpers.inherit(MeasureView, View);

/**
 * The main initialization function
 */
MeasureView.prototype.init = function(measure, staffSectionViews) {
    /**
     * The Measure model
     * @type {Measure}
     */
    this.measure = this.model = measure || false;
    /**
     * The index of the Measure
     * @type {Number}
     */
    this.index   = measure.getIndex();
    /**
     * The StaffSectionView s that belong to this MeasureView
     * @type {StaffSectionView[]}
     */
    this.staffSectionViews = staffSectionViews;
    /**
     * The child VoiceViews which contain the notes
     * @type {VoiceView[]}
     */
    this.voiceViews = [];

    this.type = 'MeasureView';

};

/**
 * Render the child views onto the contexts
 * @param  {Object} contexts The Object containing the contexts for the instance
 */
MeasureView.prototype.render = function(contexts) {  
    this.contexts = contexts;
    this.renderStaffSectionViews(contexts);
    this.renderVoices(contexts);
};

/**
 * REnder the voice views
 * @param  {Object} contexts Object containing the contexts for the instance
 */
MeasureView.prototype.renderVoices = function(contexts) {
    this.voiceViews.forEach(function(voiceView){
        voiceView.render(contexts);
    });
};

/**
 * Render the staff sections views
 * @param  {Object} contexts Object containing the contexts for the instance
 */
MeasureView.prototype.renderStaffSectionViews = function(contexts) {
    var SELECTED_STAFF_COLOR = 'rgba(0,0,0,0.3)'; //'rgba(0,0,255,0.3)';
    var STAFF_COLOR = 'rgba(0,0,0,0.3)';

    var isSelected = this.measure.isSelected();
    this.staffSectionViews.forEach(function(view) {
        if (isSelected) {
            view.setLineColor(SELECTED_STAFF_COLOR);
        } else {
            view.setLineColor(STAFF_COLOR);
        }
        view.render(contexts);
    });
};

/**
 * Build the view
 */
MeasureView.prototype.build = function() {
    this.buildVoiceViews();
};

/**
 * Determine if mouse coordinates are within the boundatires of the measure
 * @param  {Object} mouse {x,y} coordinates
 * @return {Boolean}       If mouse is over measure
 */
MeasureView.prototype.isClicked = function(mouse) {
    var clicked = false;
    this.staffSectionViews.forEach(function(staffSectionView) {
        if (staffSectionView.isClicked(mouse)) {
            clicked = true;
        }
    });

    return clicked;
};

/**
 * Get the StaffSectionView that was clicked based on the mouse coordinates
 * @param  {Object} mouse x,y coordinates
 * @return {StaffSectionView}       The staff view clicked
 */
MeasureView.prototype.getStaffSectionViewFromMouse = function(mouse) {
    var result = this.staffSectionViews.filter(function(staffSectionView) {
        return staffSectionView.isClicked(mouse);
    })[0];
    return result || false;
};

/**
 * Build the child VoiceViews
 */
MeasureView.prototype.buildVoiceViews = function() {
    var voiceViews        = this.voiceViews,
        measure           = this.measure,
        staffSectionViews = this.staffSectionViews,
        voiceView;

    measure.voices.forEach(function(voice){

        if (staffSectionViews[0].isNotation()) {
            var clef = 'treble';
            voiceView = new NotationVoiceView(voice, staffSectionViews, clef).build();
        } else if (staffSectionViews[0].isTab()) {
            voiceView = new TabVoiceView(voice, staffSectionViews).build();
        }

        if (voiceView) {
            voiceViews.push(voiceView);
        } else {
            throw 'VoiceView was not created correctly';
        }
    });
};

/**
 * Returns the Vex.Flow.Voice objects from within the VoiceViews. Not very clean, but its 
 * helps with the already messy task of globally formattting all the vexflow together
 * @return {Vex.Flow.Voice[]}
 */
MeasureView.prototype.getVFVoices = function() {
    return this.voiceViews.map(function(voiceView){
        return voiceView.vf_voice;
    });
};

MeasureView.prototype.handleClick = function(mouseCoords, events) {
    // Currently there is no option for determining which voice you're 
    // attempting to manipulate in the measure.
    var defaultVoiceForStave = [0, 1]; /** @todo Allow selection of a specfiic voice to edit */

    var clickedStaffSection = this.getStaffSectionViewFromMouse(mouseCoords);
    var staffIndex          = this.staffSectionViews.indexOf(clickedStaffSection);
    var activeVoiceIndex    = defaultVoiceForStave[staffIndex];

    if (this.measure.isSelected()) {
        // Only the active voice handles the click
        if (this.voiceViews[activeVoiceIndex]) {
            this.voiceViews[activeVoiceIndex].handleClick(mouseCoords, events);
        } else {
            events.trigger('click', {
                target: this,
                staffSectionIndex : staffIndex
            });
        }
    } else {
        events.trigger('click', {
            target: this,
            staffSectionIndex : staffIndex
        });
    }

};

MeasureView.prototype.handleHover = function(mouseCoords, events) {
    var staffSectionView = this.getStaffSectionViewFromMouse(mouseCoords),
        hoveredOverPitch = staffSectionView.getNoteFromY(mouseCoords.y);
    
    this.voiceViews.forEach(function(voiceView) {
        voiceView.handleHover(mouseCoords, hoveredOverPitch, events);
    });

    events.trigger('hover', {
        mouse: mouseCoords,
        target : this
    });
};

MeasureView.prototype.handleMousedown = function(jqEvent, mouse, events) {
    var defaultVoiceForStave = [0, 1]; // TODO: Make configurable

    var clickedStaffSection = this.getStaffSectionViewFromMouse(mouse);
    var staffIndex          = this.staffSectionViews.indexOf(clickedStaffSection);
    var activeVoiceIndex    = defaultVoiceForStave[staffIndex];

    var clickedPitch = clickedStaffSection.getNoteFromY(mouse.y);

    // Only the active voice handles the click
    if (this.voiceViews[activeVoiceIndex]) {
        this.voiceViews[activeVoiceIndex].handleMousedown(jqEvent, mouse, clickedPitch, events);
    } 

    // else {
    //     events.trigger('right-click', {
    //         target: this,
    //         staffSectionIndex : staffIndex
    //     });
    // }
};

/**
 * Highlight measure by highlighting its containing StaffSectionViews
 * @param  {Object} mouse   {x,y} coordinates
 * @param  {CanvasRenderingContext2D} context The canvas context
 */
MeasureView.prototype.highlight = function(mouse, context) {
    this.staffSectionViews.forEach(function(staffSectionView) {
        staffSectionView.highlight(context);
    });
};

return MeasureView;

});
/**
 * @class Views.StaffSectionView
 * @clasDesc The StaffSectionView draws the Staff based on its relevent properties (Clef, Key, Time, etc).
 * @param {StaffSectionSpec} spec The view model
 * @param {StaffSectionSpec} [prevSpec] For easy creation of consecutive staff sections. Provide the previous 
 *                                    spec to automatically determine what staff modifiers to show. If 
 *                                    two StaffSectionSpecs both have the same clef, the second staff
 *                                    won't render the clef according to the rules of standard notation
 * @extends Views.View
 */

define('StaffSectionView',[
    'vexflow',
    './View', 
    './Helpers', 
    './Editor'], 
function(
    Vex,
    View, 
    Helpers, 
    Editor) {



/**
 * @lends Views.StaffSectionView
 * @constructor
 */
var StaffSectionView = function(spec, prevSpec) {
    var sameClef = false, 
        sameKey = false,
        sameTime = false;

    // If a previous spec was provided, determine what modifiers to show
    if (prevSpec) {
        sameClef = prevSpec.compare(spec, 'clef'),
        sameKey  = prevSpec.compare(spec, 'keySignature'),
        sameTime = prevSpec.compare(spec, 'timeSignature');
    }

    /**
     * The specification for the staff section
     * @type {StaffSectionSpec}
     */
    this.spec = spec;
    /**
     * The StaffSection type, Tab or Notation
     * @type {[type]}
     */
    this.type = spec.get('type');
    /**
     * Flag to render the Clef
     * @type {Boolean}
     */
    this.showClef = !sameClef;
    /**
     * Flag to render the Key Signature
     * @type {Boolean}
     */
    this.showKey  = !sameKey;
    /**
     * Flag to show the Time Signature or not
     * @type {Boolean}
     */
    this.showTime = spec.forceHideTime ? false : !sameTime;
    /**
     * The beginning bar type
     * @type {Vex.Flow.Barline}
     */
    this.begBar = spec.get('begBar');
    /**
     * The ending bar type
     * @type {Vex.Flow.Barline}
     */
    this.endBar = spec.get('endBar');
    /**
     * Flag to render the Measure number
     * @type {Boolean}
     */
    this.showMeasureNumber = false;
    /**
     * The color of the staff lines
     * @type {String}
     */
    this.lineColor = '#000000';
    /**
     * The width of the StaffSection
     * @type {Number}
     */
    this.width = spec.width;
    /**
     * The Vex.Flow.Stave object to render
     * @type {Vex.Flow.Stave}
     */
    this.vf_stave = undefined;

    if (spec.forceTime) {

    }

};
Helpers.inherit(StaffSectionView, View);

/**
 * Build the View by assembling the Vex.Flow.Stave object
 */
StaffSectionView.prototype.build = function() {
    var spec = this.spec;
    var stave;
    if (spec.get('type') === 'tab') {
        stave =  new Vex.Flow.TabStave(0, 0, this.width, {num_lines: this.numLines});
    } else {
        stave =  new Vex.Flow.Stave(0, 0, this.width, {fill_style : this.lineColor});
    }

    if (this.showMeasureNumber) {
        stave.setMeasure(this.spec.getIndex());
    }

    if (this.showClef) {
        stave.addClef(spec.get('clef'));
    }
    if (this.showKey) {
        stave.addKeySignature(spec.get('keySignature'));
    }
    if (this.showTime) {
        stave.addTimeSignature(spec.get('timeSignature'));
    }
    if (this.begBar) {
        stave.setBegBarType(this.begBar);
    }
    if (this.endBar) {
        stave.setEndBarType(this.endBar);
    }

    this.vf_stave = stave;

    return this;
};

/**
 * Render the View
 * @param {Object} contexts The instance canvas contexts
 */
StaffSectionView.prototype.render = function(contexts) {
    // Line color only works with the modded Vexflow source, otherwise it will be
    // black no matter what
    this.vf_stave.setContext(contexts.main).draw(); 
    return this;
};

/**
 * Set the line color of the staff
 * @param  {String} color The color of the staff lines
 */
StaffSectionView.prototype.setLineColor = function(color) {
    if (!color) {
        throw 'Color must be provided';
    }

    this.lineColor = color;
    this.vf_stave.options.fill_style = color;
    return this;
};

/**
 * Helper function for determining the if the staff is Tab
 * @return {Boolean}
 */
StaffSectionView.prototype.isTab = function() {
    return this.type === 'tab';
};

/**
 * Helper function for determining if the staff is standard Notation
 * @return {Boolean}
 */
StaffSectionView.prototype.isNotation = function() {
    return this.type === 'notation';
};

/**
 * Determine if the mouse coordinates interact with the view
 * @param  {Object} click {x,y} coordinates
 * @return {Boolean}
 */
StaffSectionView.prototype.isClicked = function(click) {
    return this.vf_stave.containsPoint(click.x, click.y);
};

/**
 * Primarily used for determining where to move a selection on a tablature 
 * staff. It has to be different than notation because you'll want to 
 * click on an empty string and then input your fret
 */
StaffSectionView.prototype.getLineFromY = function(y){
    var numLines = this.vf_stave.getNumLines();
    var prevLineY;
    for (var i = 0; i < numLines; i++) {
        var line_y = this.vf_stave.getYForLine(i);

        if (y >= (line_y - 6) && y <= (line_y + 6))
            return  i;
        else if (prevLineY && y >= (prevLineY + 3) && y <= line_y-3)
            return  i;

        prevLineY = line_y;
    }
    return -1;
};

/** 
 * Get the note of a staff based on a y coordinate
 * Messsssyyyy. 
 * @todo  Refactor
 * @param  {Number} y Y coordinate to determine the note on the staff
 * @return {String}   The note in string format
 */
StaffSectionView.prototype.getNoteFromY = function(y){
    if (this.type !== 'notation') return false;

    var keySignature = this.spec.get('keySignature');
    var clef = this.spec.get('clef');

    if (!keySignature)
        keySignature = "C";

    var vf_stave = this.vf_stave;
    var numLines = vf_stave.getNumLines();
    var keyMan   = new Vex.Flow.KeyManager(keySignature);
    var modifier = 0; // Offsets the Note hash table for other clefs
    var prevLineY;

    switch(clef)  {
        case "bass":
            modifier = 6; 
            break; 
        case "alto":
            modifier = 3;
            break; 
        case "tenor":
            modifier = 4;
            break;
    }

    for (var i = 0; i < numLines + vf_stave.options.space_below_staff_ln + vf_stave.options.space_above_staff_ln; i++) {
        var line_y = vf_stave.getYForLine(i-4);

        if (y >= (line_y - 2) && y <= (line_y + 2)) {
            return  keyMan.scaleMap[Editor.trebleNotes[i+modifier].split("/")[0][0].toLowerCase()] +"/"+ Editor.trebleNotes[i+modifier].split("/")[1];
        } else if (prevLineY && y >= (prevLineY + 2) && y <= line_y-2) {
            return  keyMan.scaleMap[Editor.trebleNotes[i-0.5+modifier].split("/")[0][0].toLowerCase()] +"/"+ Editor.trebleNotes[i-0.5+modifier].split("/")[1];
        }
        prevLineY = line_y;
    }
    return "b/4";
};

/**
 * Highlight the StaffSectionView
 * @param  {CanvasRenderingContext2D[]} context The canvas context to draw on
 */
StaffSectionView.prototype.highlight = function(context) {
    var width = this.vf_stave.width;
    var x = this.vf_stave.x;
    var y = this.vf_stave.y;

    context.fillStyle = CONFIG.placeholderColor;

    Helpers.roundRect(context, this.vf_stave.x - 10, this.vf_stave.y + 15, this.vf_stave.width + 20, 
        this.vf_stave.getHeight(), 15, true, false);
    };

    return StaffSectionView;

});

/**
 * @class  Editor.StaveAligner
 * @classDesc takes a set of StaffSections and formats them within a width
 * Aligns the staves for a part to be inline. In the future will handle
 * the more complex auto-formatting (line-breaks, page fills, measure 
 * justification, etc)
 * 
 * @param {StaffSectionView[]} staffSectionViews  The StaffSections to format
 * @param {Number} staffIndex The staffIndex to align
 * @param {Number} totalStaves The total number of staves in the Score
 * @param {Object} contexts The Instance's contexts object
 * @todo  Add auto justify functionality.
 * 
 */

define('StaveAligner',['jquery'], function($){



/**
 * Initializes the objects properties.
 * @lends  Editor.StaveAligner
 * @constructor
 */
var StaveAligner = function(staffSectionViews, staffIndex, totalStaves, contexts){
    /**
     * The Staff Section Views to align together
     * @type {Staff}
     */
    this.staffSectionViews = staffSectionViews;
    /**
     * The index of the staff
     * @type {Number}
     */
    this.staffIndex = staffIndex;
    /**
     * The total number of staves in the score
     * @type {Number}
     */
    this.totalStaves = totalStaves;
};

/**
 * Format the staves. Nothing happens to the staves until this function is run.
 */
StaveAligner.prototype.format = function() {
    var prevStave, 
        staffIndex = this.staffIndex, 
        row = 0;

    this.staffSectionViews.forEach(function(sectionView, index, staves) {
        var stave = sectionView.vf_stave;
        var glyphOffset = stave.glyph_start_x - stave.x;
        var noteOffset = stave.start_x - stave.x;
        var STAFF_MARGIN_LEFT = 15;

        if (!prevStave) {
            // Set first measure coordinates
            stave.x = STAFF_MARGIN_LEFT;
            stave.y = staffIndex * 100;
        } else {
            if (prevStave.getNoteEndX() > $('.canvas-wrapper').width()) {
                row += 1;

                prevStave.x              = STAFF_MARGIN_LEFT;
                prevStave.y              += (this.totalStaves * 130);
                prevStave.modifiers[0].x = prevStave.x;
                prevStave.modifiers[1].x = prevStave.getNoteEndX();
                prevStave.start_x        = prevStave.x + noteOffset + 20;
                prevStave.glyph_start_x  = prevStave.x + glyphOffset;

                // CONFIG.mainCanvas.height        = prevStave.y;
                // CONFIG.placeholderCanvas.height = prevStave.y;
                // CONFIG.selectionCanvas.height   = prevStave.y;

                // So it seems like editing the element height resets 
                // the canvas scale?
                // var mainCtx        = contexts.main;
                // var placeholderCtx = contexts.placeholder;
                // var selectionCtx   = contexts.selection;
                // mainCtx.scale(CONFIG.SCALE_WIDTH, CONFIG.SCALE_HEIGHT);
                // placeholderCtx.scale(CONFIG.SCALE_WIDTH, CONFIG.SCALE_HEIGHT);
                // selectionCtx.scale(CONFIG.SCALE_WIDTH, CONFIG.SCALE_HEIGHT);
            
                // HACK: For clef/key on system breaks
                /**
                 * @todo Auto format and set widths/heights for each measure
                 */
                prevStave.addClef(sectionView.spec.get('clef'));
                prevStave.addKeySignature(sectionView.spec.get('keySignature'));

                prevStave.setWidth(prevStave.width+20);
            }
            stave.x = prevStave.getNoteEndX();
            stave.y = prevStave.y;
        }

        stave.start_x        = stave.x + noteOffset;
        stave.glyph_start_x  = stave.x + glyphOffset;
        stave.modifiers[0].x = stave.x;
        stave.modifiers[1].x = stave.x + stave.width;

        prevStave = stave;
    }, this);
};

return StaveAligner;

});

/**
 * @class  Views.StaffView
 * @classDesc A class that renders the Staff This class should probably deal 
 *     with page widths? mabes not
 * @extends Views.View
 * 
 * @param {Staff} staff The Staff to render
 * @param {Number} numMeasures The number of measures in the part
 */

define('StaffView',[
    './View', 
    './StaffSectionView', 
    './StaveAligner', 
    './Helpers'], 
function(
    View, 
    StaffSectionView, 
    StaveAligner, 
    Helpers){



/**
 * @lends  Views.StaffView
 * @constructor
 */
var StaffView = function(staff, numMeasures) {
    /**
     * The Staff model
     * @type {Staff}
     */
    this.staff = staff;
    /**
     * The number of measures in the part (the number of staff sections)
     * @type {Number}
     */
    this.numMeasures = numMeasures || 0;
    /**
     * The current Staff index in the Score
     * @type {Number}
     */
    this.staffIndex = staff.getTotalIndex();
    /**
     * The total number of staves in the score
     * @type {Number}
     */
    this.totalStaves = staff.totalInScore();
    /**
     * The Index of the parrt the staff belongs to
     * @type {Number}
     */
    this.partIndex = staff.part.getIndex();
    /**
     * The staff sections that make up the entire staff
     * @type {StaffSectionView[]}
     */
    this.staffSectionViews = [];
    /**
     * The type of staff, Notation or TAB
     * @type {String}
     */
    this.type =  staff.specs[0] ? staff.specs[0].get('type') : 'unkown';
    /**
     * The number of lines (for TAB only)
     * @type {Number}
     */
    this.numLines = 6;
    /**
     * Flag if StaffSections have been aligned
     * @type {Boolean}
     */
    this.aligned         = false;

};
Helpers.inherit(StaffView, View);

/**
 * Build vexflow staves, each stave is like a staff "slice" that will represent the
 * width of it's relative measure
 */
StaffView.prototype.build = function() {
    this.buildStaves();
    this.alignStaves();

    return this;
};

/**
 * Build the Vex.Flow.Staves
 */
StaffView.prototype.buildStaves = function() {
    var prevSpec;
    this.staff.specs.forEach(function(spec){
        var staffSectionView = new StaffSectionView(spec, prevSpec);
        if (this.staff.getIndex() === 0) {
            staffSectionView.showMeasureNumber = true;
        }
        staffSectionView.build();
        this.staffSectionViews.push(staffSectionView);
        prevSpec = spec;
    }, this);
};

/**
 * Renders the view onto the Canvas
 */
StaffView.prototype.render = function(contexts) {
    this.renderStaves(contexts);
};

StaffView.prototype.renderStaves = function(contexts) {
    this.contexts = contexts;

    this.staffSectionViews.forEach(function(view){
        view.render(contexts);
    });
};

StaffView.prototype.format = function() {
    // empty?
};

StaffView.prototype.alignStaves = function() {
    var formatter = new StaveAligner(this.staffSectionViews, this.staffIndex, this.totalStaves);
    formatter.format();
};

StaffView.prototype.getVFStaves = function() {
    return this.staffSectionViews.map(function(view){
        return view.vf_stave;
    });
};

/**
 * Mark the Staff as unaligned. The MeasureFormatter will be run if unaligned prior to rendering.
 */
StaffView.prototype.unflagAligned = function(){
    this.aligned = false;
};
/**
 * Mark the Staff as aligned. The MeasureFormatter has no need to format this
 * part if already aligned.
 */
StaffView.prototype.flagAligned = function(){
    this.aligned = true;
};

/**
 * Highlight the Staff
 * @param  {[type]} context [description]
 * @param  {[type]} color   [description]
 * @return {[type]}         [description]
 */
StaffView.prototype.highlightStave = function(context, color){
    if (!color) 
        color = 'rgba(0, 100, 255, 0.1)';
    
    context.fillStyle = color;
    var bb  = this.vf_staves[0].getBoundingBox();

    Helpers.roundRect(context, bb.getX(), bb.getY(), bb.getW(), 
        bb.getH() - 10, 15, true, false);
};

/**
 * Determine if the Staff was clicked
 * @param  {Object} mouse {x,y} coordinates
 * @return {Boolean}       Whether the Staff was clicked
 */
StaffView.prototype.isClicked = function(mouse) {
    var clicked = false;
    this.staffSectionViews.forEach(function(staffSectionView) {
        if (staffSectionView.isClicked(mouse)){
            clicked = true;
        }
    });
};

return StaffView;

});
/**
 * @class Views.PartView
 * @classDesc Composite view representing a part.
 * @param {Part} part The model
 * @extends Views.View
 */
define('PartView',[
    'underscore', 
    'vexflow',
    './MeasureView', 
    './StaffView', 
    './View', 
    './Helpers'], 
function(
    _, 
    Vex,
    MeasureView, 
    StaffView, 
    View, 
    Helpers){



/**
 * @lends Views.PartView
 * @constructor
 */
var PartView = function(part) {
    /**
     * The child MeasureViews
     * @type {MeasureView[]}
     */
	this.measureViews    = [];
    /**
     * The StaffViews to render
     * @type {StaffView[]}
     */
	this.staffViews      = [];
    /**
     * The Part taht is being rendered
     * @type {Part}
     */
	this.part            = part;
    /**
     * The Vex.Flow.StaveConnectors to render
     * @type {Vex.Flow.StaveConnector[]}
     */
	this.staffConnectors = [];
};
Helpers.inherit(PartView, View);

/**
 * Builds the view
 */
PartView.prototype.build = function() {
	this.buildStaffViews();
	this.buildMeasureViews();
	this.buildStaffConnectors();
    return this;
};

/**
 * Build the StaffViews
 */
PartView.prototype.buildStaffViews = function() {
	var _this = this, part = this.part;
	this.staffViews = _(this.part.staves).reduce(function(views, staff) {
		views.push(new StaffView(staff, _this.part.measures.length).build());
		return views;
	}, []);
};

/**
 * Build the MeasureViews
 */
PartView.prototype.buildMeasureViews = function() {
    var measureViews = [];

    var _this = this;
	this.part.measures.forEach(function(measure, index){        
        var measureView = new MeasureView(measure, _this.getStaffSlice(index));
        measureView.build();
        measureViews.push(measureView);
	});

    this.measureViews = measureViews;
};

/**
 * Gets the staff slice. Usually will just 1 or 2 StaffSectionViews. Unless you have a 
 * weird 3+ staff part. Utility for .buildMeasureViews(), the method passes in the 
 * relevent StaffSectionViews to each MeasureView it creates
 * 
 * @param  {number} index Slice index
 * @return {StaffSectionView[]}
 */
PartView.prototype.getStaffSlice = function(index) {
	return this.staffViews.map(function(staffView){
		return staffView.staffSectionViews[index];
	});
};

/**
 * Builds the Vex.Flow.StaveConnector objects depending on the barlines
 */
PartView.prototype.buildStaffConnectors = function() {
	var staffConnectors = this.staffConnectors;

	if (this.staffViews.length > 1) {
		
		var vf_staves = this.staffViews.map(function(staffView){
			return staffView.getVFStaves();
		});

		var staveCoupleToConnect = _.zip(vf_staves[0], vf_staves[1]);

		staveCoupleToConnect.forEach(function(couple, index, couples){
			if (index === 0) {
				var bracket = new Vex.Flow.StaveConnector(couple[0], couple[1]).setType(3);
				staffConnectors.push(bracket);
			}
            if (index === (couples.length - 1)) {
                var endConnector = new Vex.Flow.StaveConnector(couple[0], couple[1]).setType(0);
                staffConnectors.push(endConnector);
            }

            var endBar = this.part.measures[index].getSpec().get('endBar');
            if (endBar == 5 ||  endBar == 3){ // REPEAT_END or DOUBLE
                var endRepeatConnector = new Vex.Flow.StaveConnector(couple[0], couple[1]).setType(6);
                staffConnectors.push(endRepeatConnector);
            } else if (endBar === 1) {
                var conn = new Vex.Flow.StaveConnector(couple[0], couple[1]).setType(0);
                staffConnectors.push(conn);
            }

            if(this.part.measures[index].getSpec().get('begBar') == 4){
                var beginRepeatConnector = new Vex.Flow.StaveConnector(couple[0], couple[1]).setType(5);
                var xShift = couple[0].getRepeatBeginXShift();
                if (xShift > 0) {
                    beginRepeatConnector.setXShift(xShift);
                    staffConnectors.push(new Vex.Flow.StaveConnector(couple[0], couple[1]).setType(1));
                }
                staffConnectors.push(beginRepeatConnector);
            } else {
                staffConnectors.push(new Vex.Flow.StaveConnector(couple[0], couple[1]).setType(1));
            }

		}, this);
	}
};

/**
 * Main rendering method
 */
PartView.prototype.render = function(contexts) {
    this.contexts = contexts;
	this.renderMeasures(contexts);
    this.renderStaffConnectors(contexts.main);
};

/**
 * Render the Vex.Flow.StaveConnector objects
 * @param  {CanvasRenderingContext2D[]} context The canvas context to draw on
 */
PartView.prototype.renderStaffConnectors = function(context) {
	this.staffConnectors.forEach(function(connector){
        connector.setContext(context).draw();
    });
};

/**
 * Render the MeasureViews
 * @param  {Object} contexts The instance canvas contexts
 * @return {[type]}          [description]
 */
PartView.prototype.renderMeasures = function(contexts) {
    this.measureViews.forEach(function(measureView){
        measureView.render(contexts);
    });
};

/**
 * Format the part
 */
PartView.prototype.format = function() {
	this.staffViews.forEach(function(staffView, index){
		//console.log('formatting staff index: ' + index);
		staffView.format();
	});
};

PartView.prototype.handleHover = function(mouseCoords, events) {
    this.measureViews.forEach(function(measureView, index){
        if (measureView.isClicked(mouseCoords)) {
            measureView.handleHover(mouseCoords, events);
        }
    });
};

PartView.prototype.handleMousedown = function(event, events){
    this.measureViews.forEach(function(measureView, index){
        var mouseCoords = Helpers.relMouseCoords(event, this.contexts.main.canvas, this.contexts.instance.config.ctxScale);
        if (measureView.isClicked(mouseCoords))
            measureView.handleMousedown(event, mouseCoords, events);
    }, this);
};

PartView.prototype.handleClick = function(mouseCoords, events){
    var targetFound = false;
    for (var i = 0; i < this.measureViews.length; i++){
        var measureView = this.measureViews[i];

        if (measureView.isClicked(mouseCoords)) {
            measureView.handleClick(mouseCoords, events);
            targetFound = true;
        }
    }
    return targetFound;
};

return PartView;

});
/**
 * @class Views.ScoreView
 * @classDesc The ScoreView class is the main entry point for Score rendering;
 * @param {Score} score The Score model
 * @extends Views.View
 */

define('ScoreView',[
    'underscore', 
    'vexflow',
    './PartView', 
    './View',
    './Helpers'], 
function(
    _,
    Vex,
    PartView, 
    View,
    Helpers){



/**
 * @lends Views.ScoreView
 * @constructor
 */
var ScoreView = function(score) {
    /**
     * The model for the view
     * @type {Score}
     */
    this.score = score;
    /**
     * The child part views
     * @type {PartView[]}
     */
    this.partViews = [];
    /**
     * The Vex.Flow.StaveConnectors to render
     * @type {Vex.Flow.StaveConnector[]}
     */
    this.connectors = [];

    this.type = "ScoreView";
};
Helpers.inherit(ScoreView, View);

/**
 * The main Score rendering function. Call this to build/format/render the score.
 * @todo Optimize. Currently everything is rebuilt on the slightest change.
 * @param  {CanvasRenderingContext2D[]} context The canvas contexts
 */
ScoreView.prototype.update = function(contexts) {
    this.build();
    this.format();
    this.render(contexts);

    return this;
};

/**
 * Builds the ScoreView
 */
ScoreView.prototype.build = function() {
    this.buildPartViews();

    return this;
};

/**
 * Builds the child PartViews
 */
ScoreView.prototype.buildPartViews = function() {
    this.partViews = this.score.parts.map(function(part){
        return new PartView(part).build();
    });
};

/**
 * Goes through every measure and formats each measure column/slice
 */
ScoreView.prototype.format = function() {
    this.formatParts();

    var longestPart = _.sortBy(this.score.parts, function(part){
        return -(part.length);
    });

    for (var i = 0; i < longestPart[0].staves[0].specs.length; i++) {
        this.formatSlice(this.getMeasureSlice(i));
    }

    return this;
};

/**
 * Format the PartViews
 */
ScoreView.prototype.formatParts = function() {
    this.partViews.forEach(function(partView, index){
        partView.format();
    });
};

/**
 * Gets the MeasureView slice/column at index.
 * @todo Rename to .getMeasureViewSlice()
 * @param  {Number} index Slice index
 * @return {MeasureView[]}
 */
ScoreView.prototype.getMeasureSlice = function(index) {
    return this.partViews.map(function(partView){
        return partView.measureViews[index];
    });
};

/**
 * Takes all the vexflow voices from the VoiceViews and formats them together. Must 
 * format by Slice because Scores are foramtted by column. TIGHTLY COUPLED WITH VOICEVIEW
 * 
 * @param {MeasureView[]} slice A slice (column) of measure views to format at once.
 */
ScoreView.prototype.formatSlice = function(slice) {
    var formatter = new Vex.Flow.Formatter();
    var vf_voices = [];
    var vf_stave;

    slice.forEach(function(measureView){
        var staffSectionViews = measureView.staffSectionViews;
        measureView.voiceViews.forEach(function(voiceView){
            var vf_voice = voiceView.vf_voice;
            if (vf_voice){
                vf_voices.push(vf_voice);
            }

            vf_stave = staffSectionViews[0].vf_stave;
        });
    });

    vf_voices = _(vf_voices).sortBy(function(vf_voice){
        return -vf_voice.getTicksUsed();
    });

    if (vf_voices.length > 0) {
        formatter.joinVoices(vf_voices).formatToStave(vf_voices, vf_stave);
    }
};

ScoreView.prototype.alignNoteStarts = function() {
    //TODO
};

/**
 * Renders the ScoreView
 * @param  {Object} contexts The contexts for the instance
 */
ScoreView.prototype.render = function(contexts) {
    if (!this.contexts) {
        this.contexts = contexts;
    }

    if (!contexts) {
        contexts = this.contexts;
    }

    if (!contexts) {
        throw "You need to supply a context for rendering";
    }

    contexts.main.clear();
    contexts.selection.clear();
    this.renderPartViews(contexts);
};

/**
 * Render the part views
 * @param  {Objecj} contexts The contexts object for the instance
 */
ScoreView.prototype.renderPartViews = function(contexts) {
    this.partViews.forEach(function(partView) {
        partView.render(contexts);
    });
};

ScoreView.prototype.handleHover = function(mouseCoords, events) {
    for (var i = 0; i < this.partViews.length; i++) {
        var partView = this.partViews[i];
        partView.handleHover(mouseCoords, events);
    }
};

ScoreView.prototype.handleClick = function(mouseCoords, events) {
    var targetFound = false;
    this.partViews.forEach(function(partView) {
        if (!targetFound){
            targetFound = partView.handleClick(mouseCoords, events);
        }
    });

    if (!targetFound) {
        events.trigger('click', {
            target: this
        });
    }
};

ScoreView.prototype.handleRightClick = function(jqEvent, events) {
    this.partViews.forEach(function(partView) {
        partView.handleMousedown(jqEvent, events);
    });
};

/**
 * Set the Canvas context
 */
ScoreView.prototype.setContext = function(context) {
    this.context = context;
    return this;
};

return ScoreView;

});

define('commands',['underscore', './Measure'], function(_, Measure){



/**
 * @namespace Command
 */
var Command = {};

/**
 * @class Command.AbstractCommand
 * @classDesc The base Command class
 * @abstract
 */
Command.AbstractCommand = function(){};
/**
 * Executes the Command
 * @memberOf  Command.AbstractCommand
 */
Command.AbstractCommand.prototype.execute = function(){};
/**
 * Undo's the Command
 * @memberOf  Command.AbstractCommand
 */
Command.AbstractCommand.prototype.undo = function(){};

/**
 * @class  Command.DeleteItem
 * @classDesc Delete an item from a container
 * @param  {Object} item Object to delete
 * @extends Command.AbstractCommand
 */
Command.DeleteItem = function(item) {
    this.item = item;
    this.parent = this.item.parent;
    this.index = item.getIndex();

    this.name = 'Delete' + item.type;
};

Command.DeleteItem.prototype.execute = function() {
    this.parent.removeItem(this.item);
};

Command.DeleteItem.prototype.undo = function() {
    this.parent.addItem(this.item, this.index);
};

/**
 * @class  Command.InsertItem
 * @classDesc Insert an item into a container
 * @param  {Container} parent The collection to insert the item into
 * @param  {Object} item   The item to add to the collection
 * @param  {Number} [index]  The index at which to insert
 * @extends Command.AbstractCommand
 */
Command.InsertItem = function(parent, item, index) {
    this.parent = parent;
    this.item = item;
    this.index = index || this.parent.items.length;

    this.name = 'Insert ' + item.type;
};

Command.InsertItem.prototype.execute = function() {
    this.parent.addItem(this.item, this.index);
};

Command.InsertItem.prototype.undo = function() {
    this.parent.removeItem(this.item);
};

/**
 * @class Command.RemoveMeasure
 * @classDesc Remove a measure from it's parent part
 * @param  {Measure} measure The measure to remove
 * @extends Command.AbstractCommand
 */
Command.RemoveMeasure = function(measure){
    this.measure = measure;
    this.measureIndex = measure.getIndex();
    this.part = measure.part;
};

Command.RemoveMeasure.prototype.execute = function() {
    this.part.removeMeasure(this.measure);
};

Command.RemoveMeasure.prototype.undo = function() {
    this.part.addMeasure(this.measure, null, this.measureIndex);
};

/**
 * @class Command.RemoveMeasures
 * @classDesc Remove multiple measures from their parent parts
 * @param  {Measure[]} measures Measures to remove
 * @extends Command.AbstractCommand
 */
Command.RemoveMeasures = function(measures){
    this.measures = measures;

    this.commands = this.measures.map(function(measure) {
        return new Command.RemoveMeasure(measure);
    }, this);
};

Command.RemoveMeasures.prototype.execute = function() {
    this.commands.forEach(function(command) {
        command.execute();
    });
};

Command.RemoveMeasures.prototype.undo = function() {
    this.commands.forEach(function(command) {
        command.undo();
    });
};

/**
 * @class Command.AddNewMeasureToScore
 * @classDesc Add a new Measure to the score 
 * @param  {Score} score The Score to modify
 * @param  {Number} index The index of where to insert the new measure
 * @extends Command.AbstractCommand
 */
Command.AddNewMeasureToScore = function(score, index) {
    this.score = score;
    this.index = index;

    this.measuresAdded = [];

    this.score.parts.forEach(function(part) {
        var cloneIndex = this.index;
        
        if (this.index >= part.measures.length) {
            cloneIndex -= 1;
        }

        var clonedSpecs = part.measures[cloneIndex].getClonedSpecs();

        clonedSpecs.forEach(function(spec) {
            spec.resetBarlines();
        });
        
        this.measuresAdded.push(new Measure(clonedSpecs));
    }, this);
};

Command.AddNewMeasureToScore.prototype.execute = function() {
    this.score.parts.forEach(function(part, partIndex) {
        part.addMeasure(this.measuresAdded[partIndex], null, this.index);
    }, this);
};

Command.AddNewMeasureToScore.prototype.undo = function() {
    this.score.parts.forEach(function(part, index) {
        part.removeMeasure(this.measuresAdded[index]);
    }, this);
};

/**
 * @class Command.AddKeyToNote
 * @classDesc Adds a Key to a Note
 * @param  {Key} key  A Key to add to a note
 * @param  {Note} note The note to modify
 * @extends Command.AbstractCommand
 */
Command.AddKeyToNote = function(key, note) {
    this.key = key;
    this.note = note;
};

Command.AddKeyToNote.prototype.execute = function() {
    this.note.addKey(this.key);
};

Command.AddKeyToNote.prototype.undo = function() {
    this.note.removeItem(this.key);
};

/**
 * @class Command.RemoveKeyFromNote
 * @class Remove a Key from it's parent Note
 * @param  {Key} key The Key to remove
 * @extends Command.AbstractCommand
 */
Command.RemoveKeyFromNote = function(key) {
    this.key = key;
    this.note = this.key.parent;
};

Command.RemoveKeyFromNote.prototype.execute = function() {
    this.note.removeItem(this.key);
};

Command.RemoveKeyFromNote.prototype.undo = function() {
    this.note.addKey(this.key);
};

/**
 * @class Command.ChangeStaffSectionProperty
 * @param  {StaffSectionSpec} staffSection The Spec to modify
 * @param  {String} propertyName The property name to modify
 * @param  {Number|String} value        The new value of the property
 * @extends Command.AbstractCommand
 */
Command.ChangeStaffSectionProperty = function(staffSection, propertyName, value) {
    if (staffSection.type !== 'notation' && staffSection.type != 'tab') {
        throw 'Invalid StaffSection type, must be notation or tab';
    }
    if (typeof propertyName !== 'string') {
        throw 'Property name should be a string';        
    }
    if (staffSection.get(propertyName) === false) {
        throw 'Property name: "' + propertyName  + '"" does not exist';
    }

    this.staffSection = staffSection;
    this.propertyName = propertyName;
    this.newValue = value;

    this.oldValue = null;
};

Command.ChangeStaffSectionProperty.prototype.execute = function() {
    this.oldValue = this.staffSection.get(this.propertyName);
    this.staffSection.set(this.propertyName, this.newValue);
};

Command.ChangeStaffSectionProperty.prototype.undo = function() {
    if (this.oldValue) {
        this.staffSection.set(this.propertyName, this.oldValue);
    }
};

/**
 * @class Command.ChangeMeasureProperty
 * @classDesc Change the property of a specific measure
 * @param  {Measure} measure  The measure to modify
 * @param  {String} property The property name to modify
 * @param  {String|Number} newValue The new value of the property
 * @extends Command.AbstractCommand
 */
Command.ChangeMeasureProperty = function(measure, property, newValue){
    this.measure = measure;
    this.property = property;
    this.newValue = newValue;

    this.commands = [];

    this.measure.staffSpecs.forEach(function(staffSpec, index) {
        var value = (this.newValue instanceof Array) ? this.newValue[index] : this.newValue;
        if (value) {
            this.commands.push(new Command.ChangeStaffSectionProperty(staffSpec, this.property, value));
        }
    }, this);
};

Command.ChangeMeasureProperty.prototype.execute = function() {
    this.commands.forEach(function(command) {
        command.execute();
    });
};

Command.ChangeMeasureProperty.prototype.undo = function() {
    this.commands.forEach(function(command) {
        command.undo();
    });
};

/**
 * @class Command.ChangeMeasures
 * @classDesc Change the property of multiple measures
 * @param  {Measure[]} measures The measures to alter
 * @param  {String} property The property to alter
 * @param  {String|Number} newValue The new value
 * @extends Command.AbstractCommand
 */
Command.ChangeMeasures = function(measures, property, newValue) {
    this.measures = _.flatten(measures);
    this.newValue = newValue;
    this.property = property;

    this.commands = this.measures.map(function(measure) {
        if (measure.type !== 'measure'){
            throw 'Invalid input, not a Measure type';
        }
        return new Command.ChangeMeasureProperty(measure, this.property, this.newValue);
    }, this);
};

Command.ChangeMeasures.prototype.execute = function() {
    this.commands.forEach(function(command) {
        command.execute();
    });
};

Command.ChangeMeasures.prototype.undo = function() {
    this.commands.forEach(function(command) {
        command.undo();
    });
};

/**
 * @class Command.ChangeAccidental
 * @classDesc Change the accidnetal on a Key
 * @param  {Key} key           The Key to alter
 * @param  {String} newAccidental The new accidental
 * @extends Command.AbstractCommand
 */
Command.ChangeAccidental= function(key, newAccidental) {
    this.key = key;
    this.newAccidental = newAccidental;
    this.oldAccidental = key.accidental;
};

Command.ChangeAccidental.prototype.execute = function() {
    this.key.setAccidental(this.newAccidental);
};

Command.ChangeAccidental.prototype.undo = function() {
    this.key.setAccidental(this.oldAccidental);
};

/**
 * @class Command.ChangeAccidentals
 * @classDesc Change the accidental on multiple keys
 * @param  {Keyp[]} keys          The Keys to change
 * @param  {String} newAccidental The new accidental to apply
 * @extends Command.AbstractCommand
 */
Command.ChangeAccidentals = function(keys, newAccidental) {
    this.keys = keys;
    this.newAccidental = newAccidental;

    this.commands = this.keys.map(function(key) {
        return new Command.ChangeAccidental(key, newAccidental);
    });
};

Command.ChangeAccidentals.prototype.execute = function() {
    this.commands.forEach(function(command) {
        command.execute();
    });
};

Command.ChangeAccidentals.prototype.undo = function() {
    this.commands.forEach(function(command) {
        command.undo();
    });
};


return Command;

});

/**
 * @class  Editor.CommandCenter
 * @classDesc Handles all the command processing of the application. 
 *     Including undo/redo functionality.
 */

define('CommandCenter',[],function() {



/**
 * @lends Editor.CommandCenter
 */
var CommandCenter = function() {
	this.undoStack = [];
	this.redoStack = [];
};

/**
 * Run a command in the command stack
 * @param  {Command} command The command to run
 */
CommandCenter.prototype.run = function(command) {
    command.execute();

    this.undoStack.push(command);
    this.redoStack = [];

    return true;
};

/**
 * Undo last run command
 */
CommandCenter.prototype.undo = function() {
    if (this.undoStack.length === 0) return false;

    var command = this.undoStack.pop();
    command.undo();
    this.redoStack.push(command);

    return true;
};

/**
 * Redo last undone command
 */
CommandCenter.prototype.redo = function() {
    if (this.redoStack.length === 0) return false;

    var command = this.redoStack.pop();
    command.execute();
    this.undoStack.push(command);

    return true;
};

/**
 * Clear the undo and redo stacks.
 */
CommandCenter.prototype.clear = function() {
    this.undoStack = [];
    this.redoStack = [];
    return this;
};

return CommandCenter;

});
/**
 * @class  Editor.EventHandler
 * @classDesc A very basic event bus.
 */

define('EventHandler',[],function(){



/**
 * @lends  Editor.EventHandler
 * @constructor
 */
var EventHandler = function() {
    this.events = {};
};

/**
 * Create a callback for an event name
 * @param  {String}   event    Event name
 * @param  {Function} callback  callback(data)
 * @param {Object} context The function context to bind to
 */
EventHandler.prototype.on = function(event, callback, context) {
    if (context) callback = callback.bind(context);

    if (this.events[event]) {
        this.events[event].push(callback);
    } else {
        this.events[event] = [callback];
    }
};

/**
 * Trigger an event
 * @param  {String} event Event name to trigger
 * @param  {Object} data  Optional data to pass with the event
 */
EventHandler.prototype.trigger = function(event, data) {
    if (!this.events[event]) {
        return;
    }

    var eventCallbacks = this.events[event];

    eventCallbacks.forEach(function(callback){
        callback(data);
    });
};

return EventHandler;

});
define('play',[
    'underscore', 
    './Helpers', 
    './TimeSignature',
    'MIDI'], 
function(
    _, 
    Helpers, 
    TimeSignature,
    MIDI){

/**
 * @class PlayLowQuality. Uses Audiolet, a more low level web audio api wrapper
 * @classDesc Class that handles low quality playback
 * @param  {Score} score The Score to play
 * @param  {Number} bpm   The tempo to playback at
 */
var PlayLowQuality = function(score, bpm) {
    var audiolet     = new Audiolet();  // For playback

    var Synth = function(audiolet, frequency, duration) {
        AudioletGroup.apply(this, [audiolet, 0, 1]);
        this.sine = new Saw(this.audiolet, frequency);
        this.modulator = new Saw(this.audiolet, frequency * 2);
        this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2,
                                          frequency);

        this.gain = new Gain(this.audiolet, 0.01);
        this.envelope = new PercussiveEnvelope(this.audiolet, 0, 0.001, duration*1.1,
            function() {
                this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
            }.bind(this)
        );

        this.modulator.connect(this.modulatorMulAdd);
        this.modulatorMulAdd.connect(this.sine);

        this.envelope.connect(this.gain, 0, 1);
        this.sine.connect(this.gain);

        this.gain.connect(this.outputs[0]);
    };
    extend(Synth, AudioletGroup);

    var AudioletApp = function() {
        this.audiolet = audiolet;
        this.audiolet.scheduler.setTempo(bpm);

        var melodies = [], durations = [], secondaryDurations = [];
        score.parts.forEach(function(part){
            part.measures[0].voices.forEach(function(voice, voiceIndex){
                melodies.push(new PSequence(Helpers.collectFrequencies(part, voiceIndex)));
                durations.push(new PSequence(Helpers.collectDurations(part, voiceIndex)));
                secondaryDurations.push(new PSequence(Helpers.collectDurations(part, voiceIndex)));
            });
        });

        var _this = this;
        _(melodies.length).times(function(num){
            _this.audiolet.scheduler.play([melodies[num], secondaryDurations[num]], durations[num], 
                function(frequency, duration) { 
                    this.playChord(frequency, duration);
                }.bind(_this)
            );
        });
    };

    AudioletApp.prototype.playChord = function(chord, duration) {
        for (var i = 0; i < chord.length; i++) {
            var frequency = chord[i];
            var synth = new Synth(this.audiolet, frequency, (60/(parseInt(this.audiolet.scheduler.bpm,10))*(duration)));
            synth.connect(this.audiolet.output);
        }
    };

    this.audioletApp = new AudioletApp();
};


/**
 * @class PlayHighQuality. Uses MIDI.js 
 * @param  {Score} score The Score to play
 * @param  {Number} bpm   The beats per minute to playback at
 */
var PlayHighQuality = function(score, bpm) {

    this.bpm = parseInt(bpm, 10);
    var player = this;
    MIDI.loadPlugin({
        soundfontUrl: "lib/soundfont/",
        instrument: "acoustic_grand_piano",
        callback: function() {

            var seconds = [];
            var midiEvents = [];
            score.parts.forEach(function(part, partIndex){
                var time = 0;
                var repeat = false;
                var measuresToRepeat = [];
                part.measures.forEach(function(measure, mIndex) {
                    var timeSignature = new TimeSignature(measure.getSpec().get('timeSignature'));
                    if (repeat === false) {
                        // Check to see if a repeat is starting
                        repeat = measure.getSpec().get('begBar') === 4 /* REPEAT_BEGIN*/;
                    }

                    if (repeat === true) {
                        measuresToRepeat.push(measure);
                        // Check to see if the repeat ends
                        repeat = measure.getSpec().get('endBar') === 5 ? false : true;
                    }

                    processVoices(measure.voices);

                    function processVoices(voices){                    
                        voices.forEach(function(voice, voiceIndex, voiceArr){
                            var voiceTime = 0;
                            voice.notes.forEach(function(note, noteIndex) {
                                var velocity = 100; // how hard the note hits
                                var noteDuration = note.duration.inSeconds(bpm);

                                var nextNote = note.getNext();

                                if (note.isChord() || note.isNote()) {
                                    var midiNotes = note.keys.map(function(key) {
                                        return key.toMIDI();
                                    });
                                    
                                    midiNotes.forEach(function(midiNote) {
                                        midiEvents.push({
                                            type : "note",
                                            channel: partIndex,
                                            notes : [midiNote],
                                            velocity : velocity,
                                            timeStart : time,
                                            timeEnd : time + noteDuration
                                        });
                                    });

                                    time += noteDuration;
                                } else if (note.isRest()) {
                                    if (note.fillsMeasure()) {
                                        var beatValue = timeSignature.getBeatValue();
                                        var totalBeats = timeSignature.getTotalBeats();

                                        time += (4 / beatValue) * (1 / (bpm / 60)) * totalBeats;
                                    } else {
                                        time += noteDuration;
                                    }
                                }

                                voiceTime += noteDuration;

                            });

                            if (voiceArr.length - 1 !== voiceIndex) {
                                time -= voiceTime;
                            }
                        });
                    }

                    if (measuresToRepeat.length > 0  && repeat === false) {
                        measuresToRepeat.forEach(function(measure) {
                            processVoices(measure.voices);
                        });
                    }
                });
            });
            
            console.log(midiEvents);

            midiEvents = _.sortBy(midiEvents, "timeStart");

            var currentStart = 0;
            setInterval(function() {
                var midiEventSlice = midiEvents.slice(currentStart, currentStart + 50);
                currentStart += 50;
                _(midiEventSlice).forEach(function(midiEvent) {
                    if(midiEvent.type === "chord") {
                        MIDI.chordOn(midiEvent.channel, midiEvent.notes, midiEvent.velocity, midiEvent.timeStart);
                        MIDI.chordOff(midiEvent.channel, midiEvent.notes, midiEvent.timeEnd);
                    } else if (midiEvent.type === "note") {
                        MIDI.noteOn(midiEvent.channel, midiEvent.notes[0], midiEvent.velocity, midiEvent.timeStart);
                        MIDI.noteOff(midiEvent.channel, midiEvent.notes[0], midiEvent.timeEnd);
                    }
                });
            }, 1000);

        }
    });
};

var Playback = {
    HighQuality : PlayHighQuality,
    LowQuality : PlayLowQuality
};

return Playback;

});
/**
 * @class  NewXmlParser
 * @classDesc Parses an Xml document and returns a ScoreModel object
 * @param  {String|XmlDocument} xml The Xml data
 * @return {Score}     The Score
 */

define('xml/NewXmlParser',[
    'underscore', 
    'jquery', 
    '../Score', 
    '../Measure', 
    '../Part', 
    '../Note', 
    '../Rest', 
    '../Key', 
    '../Staff', 
    '../StaffSectionSpec', 
    '../Voice', 
    '../Duration', 
    '../TimeSignature'],
function(
    _, 
    $, 
    Score, 
    Measure, 
    Part, 
    Note, 
    Rest, 
    Key, 
    Staff, 
    StaffSectionSpec, 
    Voice, 
    Duration, 
    TimeSignature) {



/**
 * READ AT YOUR OWN RISK
 */

/**
 * @lends NewXmlParser
 */
var NewXmlParser = function(xml) {
    if (!$.isXMLDoc(xml)) {
        xml = $.parseXML(xml);
    }

    this.doc = xml;
    this.score = new Score({parts: 0});

    return this.buildScore().getScore();
};

NewXmlParser.prototype.getScore = function() {
    return this.score;
};


NewXmlParser.prototype.buildScore = function() {
    this.createParts();
    return this;
};

NewXmlParser.prototype.createParts = function() {
    var partIDs = this.getPartIDs();

    var _this = this;
    partIDs.forEach(function(partID) {
        var partElement = _this.getPartElementWithID(partID);

        _this.createPartFromElement(partElement);
    });
};

NewXmlParser.prototype.getPartIDs = function() {

    var scorePartElements = this.getScorePartElements();

    var partIDs = [];
    _(scorePartElements).toArray().forEach(function(partXML){
        partIDs.push(partXML.getAttribute('id'));
    });

    return partIDs;
};

NewXmlParser.prototype.getPartElementWithID = function(id) {
    var partsXML = this.doc.getElementsByTagName('part');

    return _(partsXML).find(function(element) {
        return element.getAttribute('id') == id;
    });
};

NewXmlParser.prototype.getPartListElement = function() {
    var partListXML = this.doc.getElementsByTagName('part-list');

    if (partListXML.length === 0) {
        throw "XML document doesn't have a <part-list> elements";
    }

    return partListXML[0];
};


NewXmlParser.prototype.getScorePartElements = function() {
    var partListElement = this.getPartListElement();
    var scorePartElements = partListElement.getElementsByTagName('score-part');

    return scorePartElements;
};

NewXmlParser.prototype.getPartName = function(partId) {
    var partList = this.getPartListElement();

    var name = false;
    _.toArray(partList.getElementsByTagName('score-part')).forEach(function(scorePart) {
        if (scorePart.getAttribute('id') == partId) {
            name =  scorePart.getElementsByTagName('part-name')[0].textContent;
        }
    });

    return name;
};


/**
 * hahahaha this function is spaghetti bullshit
 *
 * @todo Refactor the shit out of this. Probably want to create helper objects 
 * to wrap around each xml tag to extract relevent info for xml
 */
NewXmlParser.prototype.createPartFromElement = function(partElement) {

    var _this = this;

    var partName = this.getPartName(partElement.getAttribute('id'));

    var part = new Part({
        numStaves: this.getStaveCount(partElement),
        name : partName,
        measures: 0
    });

    var measureElements = partElement.getElementsByTagName('measure');

    // Go through each measure element and add it to the part
    var clefs = [], key, time, divisions;
    _(measureElements).toArray().forEach(function(measureElement, measureIndex){
        if (measureIndex > 100) return;
        var measure = new Measure();
        var staffSectionSpecs = [];

        var attributes =  _this.getMeasureAttributes(measureElement);

        part.staves.forEach(function(staff, index){
            // Remember, if attributes are undefined they continue from the previous measure
            // As a result, we only merge in new staff attributes rather than resetting 
            // them every time
            function mergeAttributes() {
                if (attributes) {
                    var tempClef = attributes.getClef(index);
                    if (tempClef) {
                        clefs[index] = tempClef;
                    }

                    var tempKey  = attributes.getKey();
                    if (tempKey) {
                        key = tempKey;
                    }

                    var tempTime = attributes.getTime();
                    if (tempTime) {
                        time = tempTime;
                    }

                    var tempDiv = attributes.getDivisions();
                    if (tempDiv) {
                        divisions = tempDiv;
                    }
                }
            }

            // If the attributes tag is the first tag, then the attributes
            // apply to the notes in the measure

            // We have to this check because VexFlow doesn't support simply 
            // rendering and formatting clefs at the end of staves, so in 
            // the case of a Clef change, we have to apply it to the 
            // following stave section so that VexFlow can render correctly
            // 
            // Downside is an inconsistency with notational standards
            // 
            // todo: fix in vexflow and submit pull request to 0xfe
            if (attributes) {
                mergeAttributes();
            }

            var staffSectionSpec = new StaffSectionSpec()
                                        .set('clef', clefs[index] || 'treble')
                                        .set('keySignature', key || 'C')
                                        .set('timeSignature', time || "4/4");

            staffSectionSpecs.push(staffSectionSpec);

            // See comment from above, we only merge the attributes at the 
            // end if there is a clef change before the following staff section
            if (attributes && attributes.isLast()) {
                mergeAttributes();
            }
        });

        // Sanity check
        if (staffSectionSpecs.length == part.staves.length) {
            part.addMeasure(measure, staffSectionSpecs);
        } else {
            throw "number of StaffSectionSpecs must be equal to the number of staves in the part";
        }
        var width = measureElement.getAttribute("width");
        if (width){
            measure.setWidth(parseInt(width, 10));            
        }

        // Go through each child element of <measure> and build the Notes for the Measure
        var voiceMap = {}, currentNote, currentVoice, voiceIndex, currentStaff;
        _(measureElement.childNodes).toArray().forEach(function(node, index) {
            // Ignore <print>
            if (node.nodeName === 'print') {
                return;
            }

            var restElement;
            // If the element is <note>
            if (node.nodeName === 'note' || node.nodeName === 'forward') {
                // Ignore if the object is hidden (for hidden rests mostly?)
                if (node.getAttribute('print-object') == "no") {
                    return;
                }

                var note = node;
                var duration;
                // Find the  working voice index
                var voiceElement = note.getElementsByTagName('voice')[0];
                if (voiceElement) {
                    if (voiceIndex !== parseInt(voiceElement.textContent, 10)){
                        if (currentNote) {
                            currentVoice.addNote(currentNote);
                            currentNote = undefined;
                        }
                        voiceIndex = parseInt(voiceElement.textContent, 10);
                    }
                } else {
                    // If no voice element exists, the voice index defaults to 1
                    if (!currentVoice) {
                        voiceIndex = 1;
                    }
                }

                // If the voice index does not exist in the voiceMap, initialize it
                if (!voiceMap[voiceIndex]) {
                    voiceMap[voiceIndex] = new Voice();
                }
                currentVoice = voiceMap[voiceIndex];

                // Currently ignnores grace notes;
                if (isGrace(note)){
                    return;
                }

                // Determine what to do with the current note, if it doesn't exist, 
                // initialize it
                if (isRest(note) || isForward(note)) {
                    if (note.nodeName === 'forward') {
                        var yes = true;
                    }

                    if (currentNote)
                        currentVoice.addNote(currentNote);
                    currentNote = new Rest();
                    restElement = note.getElementsByTagName('rest')[0];
                    if (restElement) {
                        var isWholeMeasureRest = restElement.getAttribute('measure');
                        if (isWholeMeasureRest) {
                            // var timeSigHelper  =  new TimeSignature(time);

                            // var beatsInMeasure = timeSigHelper.getTotalBeats();
                            // var beatValue      = timeSigHelper.getBeatValue();

                            // if (time == "2/4") {
                            //     duration = new Duration(2);
                            // } else if (time == "3/4" || time == "6/8") {
                            //     duration = new Duration(2).setDots(1);
                            // } else if (time == "3/8") {
                            //     duration = new Duration(4).setDots(1)
                            // }

                            // currentNote.setDuration(duration);
                            currentNote.wholeMeasure = true;
                        }

                        var displayStepElement = restElement.getElementsByTagName('display-step')[0];
                        var displayOctaveElement = restElement.getElementsByTagName('display-octave')[0];

                        if (displayStepElement && displayOctaveElement)
                            currentNote.setPosition(displayStepElement.textContent.toLowerCase() + '/' + displayOctaveElement.textContent);
                    }

                } else if (note.getElementsByTagName('chord').length === 0) {
                    if (currentNote)
                        currentVoice.addNote(currentNote);
                    currentNote = new Note();
                } else if (!currentNote && isRest(note)) {
                    currentNote = new Rest();
                } else if (!currentNote ) {
                    currentNote = new Note();
                }

                // The following code simply maps the XML data to the current Note object
                /**
                 * @todo throw errors on missing data
                 */

                // Set which staff the note is to be placed on 
                var staffElement = note.getElementsByTagName('staff')[0];
                if (staffElement) {
                    currentStaff = parseInt(staffElement.textContent, 10) - 1;
                } else {
                    currentStaff = 0;
                }

                currentNote.setStaffNumber(currentStaff);

                // Set pitch
                var pitchElement = note.getElementsByTagName('pitch')[0];
                if (pitchElement && !currentNote.isRest()) {
                    currentNote.addKey(new Key(getPitch(pitchElement)));
                }

                // Set the duration
                var durationElement = note.getElementsByTagName('duration')[0];
                var noteDuration;
                if (durationElement) {
                    noteDuration = parseInt(durationElement.textContent, 10);
                }

                var typeElement = note.getElementsByTagName('type')[0];
                if (typeElement) {
                    switch (typeElement.textContent) {
                        case 'whole':
                            duration = new Duration(1);
                            break;
                        case 'half':
                            duration = new Duration(2);
                            break;
                        case 'quarter':
                            duration = new Duration(4);
                            break;
                        case 'eighth':
                            duration = new Duration(8);
                            break;
                        case '16th':
                            duration = new Duration(16);
                            break;                        
                        case '32nd':
                            duration = new Duration(32);
                            break;
                        default:
                            duration = new Duration(1);
                            break;
                    }
                } else {
                    restElement = note.getElementsByTagName('rest')[0];
                    if (currentNote.isRest() && restElement && restElement.getAttribute('measure') === "yes") {
                        currentNote.wholeMeasure = true;
                        duration = new Duration(1);
                    } else if (isForward(note) || currentNote.isRest()) {
                        var noteDurationDecimal = divisions/noteDuration * 4;
                        var durationBase = Math.floor(noteDurationDecimal);
                        duration = new Duration(durationBase);
                    }
                }      



                var tupletNumerator = divisions / noteDuration;

                switch (tupletNumerator) {
                    case 3:
                        duration.setTupletMod("2/3");
                        break;
                    case 5:
                        duration.setTupletMod("4/5");
                        break;
                    case 6:
                        duration.setTupletMod("4/6");
                        break;
                    case 7:
                        duration.setTupletMod("6/7");
                        break;
                }

                currentNote.setDuration(duration);

                // Set the dot amount
                var dots = 0;
                dots  += note.getElementsByTagName('dot').length;
                currentNote.setDots(dots);

                // Set the stem direction
                var stemElement = note.getElementsByTagName('stem')[0];
                if (stemElement && !currentNote.isRest()) {
                    switch(stemElement.textContent) {
                        case "up":
                            currentNote.setStemDirection(1);
                            break;
                        case "down":
                            currentNote.setStemDirection(-1);
                            break;
                    }
                }
            }

            if (node.nodeName === 'barline') {
                var barline = node;

                var repeatElement = barline.getElementsByTagName('repeat')[0];
                if (repeatElement) {
                    var direction = repeatElement.getAttribute('direction');
                    var repeat;
                    var barType;
                    if (direction === "backward") {
                        barType = 'endBar';
                        repeat = 5; // REPEAT_END
                    } else if (direction === "forward") {
                        repeat = 4;
                        barType = 'begBar';
                    }

                    measure.staffSpecs.forEach(function(spec) {
                        spec.set(barType, repeat);
                    });
                }
            }
        });

        // Adds any trailing note note to the last voice
        if (currentNote) {
            currentVoice.addNote(currentNote);
        }

        // Add each voice to the measure
        _(voiceMap).keys().forEach(function(key){
            measure.addVoice(voiceMap[key]);
        });
    });

    this.score.addPart(part);
};


function isRest(noteElement) {
    return noteElement.getElementsByTagName('rest').length > 0;
}

function isGrace(noteElement) {
    return noteElement.getElementsByTagName('grace').length > 0 ;
}

function isChord(noteElement) {
    return noteElement.getElementsByTagName('chord').length > 0;
}

function isForward(noteElement) {
    return noteElement.nodeName == 'forward';
}

function getPitch(pitchElement) {
    var pitch  = '';
    var step   = pitchElement.getElementsByTagName('step')[0];
    var alter  = pitchElement.getElementsByTagName('alter')[0];
    var octave = pitchElement.getElementsByTagName('octave')[0];

    if (step) {
        pitch += step.textContent.toLowerCase();
    }

    if (alter){
        switch (parseInt(alter.textContent, 10)) {
            case -1:
                pitch += 'b';
                break;
            case 1:
                pitch += '#';
        }
    }
    
    if (octave) {
        pitch += '/' + octave.textContent;
    }
    return pitch;
}


NewXmlParser.prototype.getStaveCount = function(partElement) {
    var measureElement = partElement.getElementsByTagName('measure')[0],
        attributes     = measureElement.getElementsByTagName('attributes')[0],
        stavesElement  = attributes.getElementsByTagName('staves')[0];

    if (!stavesElement) {
        return 1;
    }

    return stavesElement.textContent;
};

NewXmlParser.prototype.getMeasureAttributes = function(measureElement) {
    var attributesElement = measureElement.getElementsByTagName('attributes')[0];


    var nodes = _(measureElement.childNodes).reject(function(node){
        return node.nodeName === "print";
    });

    var position = _.toArray(nodes).indexOf(attributesElement);

    if (!attributesElement) {
        return false;
    }
    return new NewXmlParser.XmlAttributes(attributesElement, position);
};

/** 
 * Helper object to wrap around an <attributes> element to conveninently 
 * extract data
 * @class NewXmlParser.XmlAttributes
 * @classDesc A helper object for dealing with parsing of the <attributes> tag
 */ 
NewXmlParser.XmlAttributes = function(element, position, prev) {
    this.xml = element;
    this.position = position;
    this.prev = prev;
};

/**
 * Get the clef string from <clef> data
 * @param  {Number} staffIndex The staff index the clef belongs to
 * @return {String}            The clef
 * @memberOf  NewXmlParser.XmlAttributes
 */
NewXmlParser.XmlAttributes.prototype.getClef = function(staffIndex) {
    var clefElements = this.xml.getElementsByTagName('clef'),
        clefElement;


    // This block determines the clef element based on the staff, or if there are 
    // not multiple staves, it returns the only clef
    _.toArray(clefElements).forEach(function(element){
        if (element.hasAttribute('number')) {
            if (element.getAttribute('number') - 1 === staffIndex) {
                clefElement = element;
            }
        } else {
            clefElement = clefElements[0];
        }
    });

    // If theres no clef return early
    if (!clefElement) 
        return false;

    var clefSignElement = clefElement.getElementsByTagName('sign')[0];

    switch(clefSignElement.textContent){
        case "G":
            return "treble";
        case "F":
            return "bass";
        case "C":
            return "alto";
        default:
            return false;
    }
};

/**
 * Get the key signature
 * @return {String} The key signature
 * @memberOf  NewXmlParser.XmlAttributes
 */
NewXmlParser.XmlAttributes.prototype.getKey = function() {
    var keyElement = this.xml.getElementsByTagName('key')[0];

    if (!keyElement)
        return false;

    var fifths = keyElement.getElementsByTagName('fifths')[0].textContent;

    switch(parseInt(fifths, 10)) {
        case 0: return 'C';
        case 1: return 'G';
        case 2: return 'D';
        case 3: return 'A';
        case 4: return 'E';
        case 5: return 'B';
        case 6: return 'F#';
        case 7: return 'C#';
        case -1: return 'F';
        case -2: return 'Bb';
        case -3: return 'Eb';
        case -4: return 'Ab';
        case -5: return 'Db';
        case -6: return 'Gb';
        case -7: return 'Cb';
    }
};

/**
 * Get the time signature
 * @return {String} The time signature
 * @memberOf  NewXmlParser.XmlAttributes
 */
NewXmlParser.XmlAttributes.prototype.getTime = function() {
    var timeElem = this.xml.getElementsByTagName('time')[0];

    if (!timeElem)
        return false;

    var beatsElem = timeElem.getElementsByTagName('beats')[0],
        beatTypeElem = timeElem.getElementsByTagName('beat-type')[0];

    if (!beatsElem || !beatTypeElem) {
        throw 'Inavlid <time> element, no <beats> and/or <beat-type> child';
    }

    var beats = parseInt(beatsElem.textContent, 10),
        beatType = parseInt(beatTypeElem.textContent, 10);

    return beats + '/' + beatType;
};

/**
 * If the attribute tag is first
 * @return {Boolean}
 * @memberOf  NewXmlParser.XmlAttributes
 */
NewXmlParser.XmlAttributes.prototype.isFirst = function() {
    if (this.position === 0) {
        return true;
    }
    return false;
};

/**
 * If the attribute tag is last
 * @return {Boolean}
 * @memberOf  NewXmlParser.XmlAttributes
 */
NewXmlParser.XmlAttributes.prototype.isLast = function() {
    if (this.position > 0) {
        return true;
    }
    return false;
};

/**
 * Get the divisions
 * @return {Number} The divisions in the measure
 * @memberOf  NewXmlParser.XmlAttributes
 */
NewXmlParser.XmlAttributes.prototype.getDivisions = function() {
    var divisionsElem = this.xml.getElementsByTagName('divisions')[0];

    if (divisionsElem) {
        return parseInt(divisionsElem.textContent, 10);
    }
    return false;
};

return NewXmlParser;

});
/**
 * Template loader
 * @class  Editor.TemplateLoader
 * @classDesc Loads the XML templates
 * @param {String[]} templates The file names of the templates to load
 * @param {String} path The path from where to load the files
 * @param {String} extension The file extention to look for
 * @example
 * ...
 * var templates = new Templates(['measure', 'note', 'part'], "src/xml/templates", "xml");
 * 
 * // template strings are now available from the template object
 * var noteTemplate = templates['note'];
 * var noteXmlString = templateEngine.render(noteTemplate, noteData);
 * ...
 */

define('TemplateLoader',[],function() {

/**
 * @lends Editor.TemplateLoader
 * @constructor
 */
var TemplateLoader = function(templates, path, extension) {
    this.templates = templates;
    this.path = path;
    this.extension = extension;
    this.done = [];
    this.completed = [];

    this.load(this.templates);
};

/**
 * Load a template
 * @param  {String[]} names The file names to load
 */
TemplateLoader.prototype.load = function(names) {
    names.forEach(function(name){
        $.ajax({
            url: this.path + '/'+ name + '.' + this.extension, 
            dataType: 'html', 
            success: function(data){
                this[name] = data;

                this.completed.push(true);

                if (this.isDone()) {
                    this.done.forEach(function(fn) {
                        fn(this);
                    });
                }
            },
            context: this
        });
    }, this);
};

TemplateLoader.prototype.onComplete = function(callback, context) {
    if (context) callback = callback.bind(context);

    if (this.isDone()){
        callback();
    } else {
        this.done.push(callback);
    }
};

TemplateLoader.prototype.isDone = function() {
    return this.completed.length === this.templates.length;
};

return TemplateLoader;

});
/**
 * @namespace Xml
 */


define('xml/export',[
    'jquery', 
    'underscore', 
    'mustache', 
    '../TimeSignature', 
    '../TemplateLoader'], 
function(
    $, 
    _, 
    Mustache, 
    TimeSignature, 
    TemplateLoader) {



var Xml = {};

/** 
 * MusicXML uses fifths instead of an actual letter representation of keys
 * @memberOf Xml
 * @type {Number}
 */
Xml.keyData = {
    'C'  : 0,
    'G'  : 1,
    'D'  : 2,
    'A'  : 3,
    'E'  : 4,
    'B'  : 5,
    'F#' : 6,
    'C#' : 7,
    'F'  : -1,
    'Bb' : -2,
    'Eb' : -3,
    'Ab' : -4,
    'Db' : -5,
    'Gb' : -6,
    'Cb' : -7
};

/**
 * Xml data for each clef
 * @memberOf Xml
 * @enum {Object}
 */
Xml.clefData = {
    'treble' : {
        sign: 'G',
        line: '2'
    },
    'bass' : {
        sign: 'F',
        line: '4'
    },
    'alto' : {
        sign: 'C',
        line: '3'
    }
};

/**
 * Converts accidental string to int representation
 * @enum {Number}
 * @memberOf Xml
 */
Xml.accData = {
    'bb' : -2,
    'b'  : -1,
    'n'  : 0,
    '#'  : 1,
    '##' : 2
};

/**
 * The Xml accidental strings
 * @enum {String}
 * @memberOf Xml
 */
Xml.accStrings = {
    'bb' : "double-flat",
    'b'  : "flat",
    'n'  : "natural",
    '#'  : "sharp",
    '##' : "double-sharp"
};

/** 
 * For converting from duration to the xml note type
 * @enum {String}
 * @memberOf Xml
 */ 
Xml.durationData = {
    1  : "whole",
    2  : "half",
    4  : "quarter",
    8  : "eighth",
    16 : "16th",
    32 : "32nd"
};

var templates = new TemplateLoader(['measure', 'part_list', 'score_partwise', 'note', 'part'], "src/xml/templates", "xml");

/**
 * @class Xml.Export
 * @classDesc The Xml exporting function, takes a Score and exports it as MusicXML
 * @todo  Refactor this class extensively
 * @param  {Score} score The Score to export
 * @return {XmlDocument}       The Xml document
 * @example
 * var score = Score();
 * var xmlScore = Xml.Export(score);
 */
Xml.Export = function(score) {
    /**
     * The XML string
     * @type {String}
     */
    this.xml = "";
    /**
     * The Score to export
     * @type {Score}
     */
    this.score = score;
    this.partIdMap = {};
    this.scorePartMap = null;

    this.xml += this.getScorePartwiseElement();

    return this.xml;
};

Xml.Export.prototype.getPartList = function() {
    var ex = this;
    function generateScorePartMap(parts) {
        return parts.map(function(part, index, parts){
            var partId = "P" + (index + 1);

            ex.partIdMap[partId] = part;

            return {
                id: partId,
                name: part.name
            };
        });
    }

    return Mustache.render(templates['part_list'], {
        parts: generateScorePartMap(this.score.parts)
    });
};

Xml.Export.prototype.getScorePartwiseElement = function() {
    return Mustache.render(templates['score_partwise'], {
        part_list : this.getPartList(),
        parts : this.getParts()
    });
};

Xml.Export.prototype.getParts = function() {
    var exportModule = this;
    return _.keys(this.partIdMap).reduce(function(memo, partId, index, parts) {
        return memo + exportModule.getPart(partId);
    }, "");
};

Xml.Export.prototype.getPart = function(partId) {
    return Mustache.render(templates['part'], {
        measures : this.writeMeasures(this.partIdMap[partId].measures),
        id : partId
    });
};

Xml.Export.prototype.writeParts = function(parts) {
    this.score.parts.forEach(this.writePart, this);

};

Xml.Export.prototype.writePart = function(part, index, parts) {
    this.xml += '<part id="'+ this.scorePartMap[index].id +'">';
    this.writeMeasures(part.measures);
    this.xml += '</part>';
};

Xml.Export.prototype.writeMeasures = function(measures) {
    var exportModule = this;
    return measures.reduce(function(memo, measure, index, measures) {
        return memo + exportModule.writeMeasure(measure, index);
    }, "");
};

Xml.Export.prototype.writeMeasure = function(measure, index, measures) {
    var attr = this.determineMeasureAttributes(measure, measure.getPrev());

    return Mustache.render(templates['measure'], {
        measureNumber: index + 1,
        attr: attr,
        notes : this.writeNotes(measure.voices, measure.getDivisions())
    });
};

Xml.Export.prototype.writeNotes = function(voices, divisions) {
    if (typeof divisions !== 'number' && divisions < 1 ) {
        throw 'Invalid divisions';
    }

    var notesXml = "";

    voices.forEach(function(voice, voiceIndex, voices) {
        var model = {};
        var voiceDuration = 0;
        model['voice'] = voiceIndex + 1;
        voice.notes.forEach(function(note, noteIndex, notes) {
            var duration;

            model['staff'] = note.staffNumber + 1;

            var divisionsPerQuarterNote = divisions;
            model['type'] = Xml.durationData[note.duration.base];

            duration = note.duration.base;
            var fractionOfQuarterNote = 1 / (note.duration.base / 4);
            duration = fractionOfQuarterNote * divisionsPerQuarterNote;
            duration *= note.duration.getTupletDecimal();

            model['dot'] = [];
            _(note.duration.dots).times(function(num) {
                model['dot'][num] = true;
                duration *= 1.5;
            });

            model['duration'] = duration;
            voiceDuration += duration;

            if (note.isRest()) {
                model['pitch'] = false;
                if (note.position) {
                    model['rest'] = {
                        displayStep : note.position[0],
                        displayOctave : note.position[2]
                    };
                } else {
                    model['rest'] = true;
                }
                model['stem'] = false;
                notesXml += Mustache.render(templates['note'], model);
            } else {
                model['rest'] = false;
                model['stem'] = note.stem === 1 ? 'up' : 'down';
                note.keys.forEach(function(key, keyIndex, keys) {
                    model['pitch'] = {
                        step : key.step.toUpperCase(),
                        octave : key.octave
                    };

                    if (keyIndex > 0) {
                        model['chord'] = true;
                    } else {
                        model['chord'] = false;
                    }

                    if (key.accidental) {
                        model.pitch.alter = Xml.accData[key.accidental];
                        //model.accidental = Xml.accStrings[key.accidental];
                    } else {
                        model.pitch.alter = false;
                    }

                    notesXml += Mustache.render(templates['note'], model);
                });
    
            }

        });
        if (voiceIndex < voices.length - 1){
            notesXml += '\r<backup><duration>' + voiceDuration + '</duration></backup>';
        }
    });

    return notesXml;
};

Xml.Export.prototype.determineMeasureAttributes = function(measure, prevMeasure) {
    var newAttributes = {};
    var stavesCount = measure.staffSpecs.length;

    measure.staffSpecs.forEach(function(currentStaffSpec, staffIndex, staves) {
        var clefData;
        if (prevMeasure) {
            var prevStaffSpec = prevMeasure.staffSpecs[staffIndex];
            var attributeChanges = currentStaffSpec.diff(prevStaffSpec);

            if (attributeChanges.keySignature) {
                newAttributes.fifths = Xml.keyData[attributeChanges.keySignature];
            }

            if (attributeChanges.timeSignature) {
                newAttributes.time = new TimeSignature(attributeChanges.timeSignature).toObject();
            }

            if (attributeChanges.clef) {
                if (!newAttributes.clef) {
                    newAttributes.clef = [];
                }
                clefData = Xml.clefData[attributeChanges.clef];

                if (stavesCount > 1) {
                    clefData.staveNumber = staffIndex + 1;
                }
                newAttributes.clef.push(clefData);
            }

            if (measure.getDivisions() !== prevMeasure.getDivisions()) {
                newAttributes.divisions = measure.getDivisions();
            }

            newAttributes.width  = currentStaffSpec.get('width');

            if (newAttributes.clef || newAttributes.timeSignature || newAttributes.keySignature) {
                return newAttributes;
            } else {
                return null;
            }
        } else {
            if (!newAttributes.clef) {
                newAttributes.clef = [];
            }
            clefData = Xml.clefData[currentStaffSpec.get('clef')];

            if (stavesCount > 1) {
                newAttributes.staves = stavesCount;
                clefData.staveNumber = staffIndex + 1;
            }

            newAttributes.clef.push(clefData);

            if (staffIndex === 0) {
                newAttributes.time   = new TimeSignature(currentStaffSpec.get('timeSignature')).toObject();
                newAttributes.fifths = Xml.keyData[currentStaffSpec.get('keySignature')];
                newAttributes.width  = currentStaffSpec.get('width');
                newAttributes.divisions = measure.getDivisions();
            }
        }
    }, this);

    return _.keys(newAttributes).length > 0 ? newAttributes : false;
};

function generateScorePartMap(parts) {
    return parts.map(function(part, index, parts){
        return {
            id: "P" + (index + 1),
            name: part.name
        };
    });
}

Xml.Export.prototype.writeScorePartList = function(parts) {
    this.scorePartMap = generateScorePartMap(parts);

    var partListXml = Mustache.render(templates['part_list'], {
        parts: this.scorePartMap
    });

    this.xml += partListXml;
};

/**
 * Direct the browser to the MusicXml file
 */
Xml.Export.prototype.toFile = function(){
    return "data:text/xml;base64," + btoa(this.xml);
};

return Xml;
});


define('questions/Question',[
    'underscore',
    '../Score',
    '../commands',
    '../Note',
    '../Key',
    'MIDI',
    '../TemplateLoader',
    'mustache'],
function(
    _, 
    Score,
    Comm,
    Note,
    Key,
    MIDI,
    TemplateLoader,
    Mustache) {

/**
 * @class  Question
 * Holds the data for a music notation question
 * @param  {Number} category The category of the Question
 * @param  {String} prompt   The question prompt
 * @param  {String} answer   The answer
 */
var Question = function(category, prompt, answer) {
    Question.type = {
        STAFF_ANSWER : 0,
        KEYBOARD_ANSWER : 1
    };

    this.category = parseInt(category, 10);
    this.prompt = prompt;
    this.answer = answer;
};

/**
 * Determine if the answer is correct
 * @param  {String} answer The answer to compare
 * @return {Boolean}        If the answer is correct
 */
Question.prototype.compareAnswer = function(answer) {
    return this.answer === answer;
};

/**
 * Can take an array of configuration objects
 * @constructor
 * @param  {Object[]|Object} config Question constructor options   
 * @return {Question[]|Question}
 */
Question.create = function(config){
    function createQuestion(config) {
        return new Question(config.category, config.prompt, config.answer);
    }

    if (config instanceof Array) {
        return config.map(createQuestion);
    } else {
        return createQuestion(config);
    }
};

/**
 * Load and store the Virtual Piano mustache template
 * @type {TemplateLoader}
 */
var templates = new TemplateLoader(["virtual_piano_octave"], "html_templates", "mustache");


/**
 * @todo  Factor out VirtualPiano class
 * @todo  Seperate business logic and UI logic
 * @todo  Compatamentalize as much Versal logic here as possible
 * @todo  modularize Main Editing and Assement score interaction, Strategy pattern? 
 */
var Assessment = function(instance, options) {
    this.config = options.config; // Main config object
    this.instance = instance;     // Reference to main Instance
    this.userState = options.userState;
    this.player = options.player || instance.eventHandler;

    this.questions = Question.create(this.config.get("quiz_questions"));

    if (!this.userState.get('started')){
        this.userState.set("questionList", this.questions);
    }
    
    // The measure where all the interaction happens
    this.measure = this.instance.score.part().measure();

    // Learner flags
    this.started = false;         // Whether the quiz has been started
    this.currentQuestion = false;   // Question the user is currently on
    this.currentAnswer = null;  // The selected to the current Question
    this.locked = false;        // Whether the user can interact witht the staff

    // Author flags
    this.addingQuestion = true;     // Whether the author is currently adding a new question
    this.newQuestionParts = false;  // The tempoary data for the new question
    this.editable = false;          // Edit mode


    // Prepare versal property sheet
    options.propertySheetSchema.set('quiz_randomize', 'Checkbox');
    options.propertySheetSchema.set('quiz_showPiano', 'Checkbox');
    options.propertySheetSchema.set('quiz_blockNext', 'Checkbox');
    options.propertySheetSchema.set('quiz_showPianoNoteLabels', 'Checkbox');
    options.propertySheetSchema.set('quiz_startingOctave', {type: 'range', min: 1, max: 8, step: 1});
    options.propertySheetSchema.set('quiz_numberOfOctaves', {type: 'range', min: 1, max: 8, step: 1});

    // Save on any change
    this.config.on('change', function(){
        this.config.save();
        this.render(this.editable);
    }, this);

    this.userState.on('change', function(){
        this.userState.save();
    }, this);

    // Render the piano
    if (this.config.get("quiz_showPiano")){
        templates.onComplete(function() {
            this.renderPiano();
        }, this);
    }

    // Render basic navigation buttons and their jQuery event handlers
    var $toolbar = this.instance.$el.find('.toolbar');
    $toolbar.append("<button class='btn next-challenge' disabled>Next Challenge</button>");
    $toolbar.append("<button style='display:none' class='btn save-challenge'>Save Challenge</button>");
    $toolbar.append("<button style='display:none' class='btn new-challenge'>New Challenge</button>");
    $toolbar.append('<button class="toggle-edit btn">Toggle Edit</button><br><select class="challenge-categories" style="display:none"><option value="0">Answer with the Staff</option><option value="1">Answer with the Virtual Piano</option></select>');
    this.registerEventHandlers(); // jq event handlers

    this.player.on('toggleEdit', this.toggleEdit, this);

    // Load the MIDI.js Piano functionality
    var assessment = this;
    MIDI.loadPlugin({
        soundfontUrl: "lib/soundfont/",
        instrument: "acoustic_grand_piano",
        callback: function() {
            assessment.playNote = function(midiNote, velocity, duration){
                MIDI.noteOn(0, midiNote, velocity, 0);
                MIDI.noteOff(0, midiNote, duration);
            };
        }
    });

    // Select the first Measure (avoid measure selection)
    this.instance.selection.select(this.measure);

    this.start();
};

Assessment.prototype.renderPiano = function() {
    var numberOfOctaves = this.config.get("quiz_numberOfOctaves");
    var startingOctave = this.config.get("quiz_startingOctave");

    var octaves = [];
    for (var i = 0; i < numberOfOctaves; i++){
        octaves.push(startingOctave + i);
    }


    var piano = Mustache.render(templates["virtual_piano_octave"], {
        octaves: octaves,
        showLabels: this.config.get("quiz_showPianoNoteLabels")
    });

    $(".virtual-piano").html(piano);
};

Assessment.prototype.start= function() {
    this.measure.selectLock();

    var cachedCurrentQuestionIndex = this.userState.get("currentQuestionIndex");
    if (cachedCurrentQuestionIndex === 0 && this.config.get("quiz_randomize")) {
        this.randomizeQuestions();
    }

    this.currentQuestion = this.question(cachedCurrentQuestionIndex); 
};

Assessment.prototype.question = function(index) {
    if (typeof index !== 'number') {
        index = 0;
    }

    return this.questions[index];
};

var interval;
Assessment.prototype.toggleEdit = function(editable) {
    var assessment = this;
    if (editable) {

        console.log("Going into Author mode");

        interval = setInterval(function() {
            if (assessment.newQuestionParts) {
                $(".save-challenge").prop('disabled', !this.testForQuestionCompletion());
            } else {
                $(".save-challenge").prop('disabled', !this.testForQuestionCompletion());
            }

            if (assessment.questions.length > 1) {
               assessment.nextQuestionButtonState(true);
            } else {
               assessment.nextQuestionButtonState(false);
            }
        }.bind(this), 250);
        this.locked = false;

        if (this.currentQuestion) {
            this.showCurrentAnswer();
        } else {
            this.startNewQuestion();
        }

        $(".next-challenge").show();
        $(".new-challenge").show();
        $(".challenge-categories").show();
        $(".save-challenge").show();
    } else {
        this.locked = false;
        console.log("Going into Learner mode");
        $(".next-challenge").show();
        $(".new-challenge").hide();
        $(".challenge-categories").hide();
        $(".save-challenge").hide();

        clearInterval(interval);
        this.newQuestionParts = false;
        this.clearMeasure();
        this.start();
    }

    this.instance.render(editable);
};

Assessment.prototype.reset = function() {
    this.userState.set('currentQuestionIndex', 0);
};

Assessment.prototype.initUI = function(){
    this.instance.registerMouseEvents();
    this.instance.registerEditorEvents();
};

Assessment.prototype.createQuestion = function(questionConfig) {
    var question = Question.create(questionConfig);
    this.questions.push(question);
    this.config.save('quiz_questions', this.questions);
    return question;
};

Assessment.prototype.setCurrentAnswer = function(answer){
    this.currentAnswer = answer;
};

Assessment.prototype.answerIsCorrect = function() {
    return this.currentQuestion.compareAnswer(this.currentAnswer);
};

/**
 * @todo EW
 */
Assessment.prototype.onClick = function(click){
    var voiceClicked = click.target.type === 'NotationVoiceView';
    var keyboardClicked = click.target === 'keyboard';
    var currentQuestion = this.currentQuestion;
    
    if (!currentQuestion && !this.newQuestionParts) { 
        insertNote(this);
        this.instance.render(this.editable);
        return;
    }

    var command;
    var newKey;
    var note;
    var voice;
    var Colors = {
        CORRECT_ANSWER : "green",
        INCORRECT_ANSWER : "red",
        DEFAULT : "black"
    };
    var color = Colors.DEFAULT;

    if (this.locked) return;

    // If in edit mode, then a note input is an answer being selected for the question
    if (this.editable && (voiceClicked || keyboardClicked)){

        if (this.newQuestionParts) {
            this.newQuestionParts.answer = click.pitch;
        } else {
            this.currentQuestion.answer = click.pitch;
        }

        insertNote(this);
    }

    var keyboardClickedKeyboardQuestion = false;
    var voiceClickedVoiceQuestion = false;
    if (currentQuestion) {
        keyboardClickedKeyboardQuestion = (keyboardClicked && currentQuestion.category === Question.type.KEYBOARD_ANSWER);
        voiceClickedVoiceQuestion = voiceClicked && currentQuestion.category === Question.type.STAFF_ANSWER;
    }

    // If we're not in edit mode, then we answering a question
    // So we also check if a Question was answered with the correct input (piano/staff)
    if (!this.editable && (keyboardClickedKeyboardQuestion || voiceClickedVoiceQuestion)) {
        this.setCurrentAnswer(click.pitch);

        if (this.answerIsCorrect()) {
            color = Colors.CORRECT_ANSWER;
            console.log('CORRECT ANSWER');
            this.nextQuestionButtonState(true);
            this.locked = true;
        } else {
            this.nextQuestionButtonState(false);
            color = Colors.INCORRECT_ANSWER;
            console.log('INCORRECT ANSWER');
        }

        insertNote(this);
    }

    function insertNote(self){
        if (keyboardClicked) {
            voice = click.measure.voice();
        } else {
            voice = click.target.voice;
        }

        // Insert note
        self.clearMeasure();
        newKey = new Key(click.pitch).setColor(color);
        note = new Note().addKey(newKey).setStaffNumber(click.staffIndex);
        voice.addNote(note);
        self.playNote(note.key().toMIDI(), 110, 1);
    }

    // Render the instance to update the Score
    this.instance.render(this.editable);
};

Assessment.prototype.nextQuestionButtonState = function(enabled) {
    $(".next-challenge").prop('disabled',  !enabled);
};

Assessment.prototype.testForQuestionCompletion = function() {
    var validPrompt = $(".new-question-prompt").val().length > 0;

    var validAnswer = true;
    if (this.newQuestionParts) {
        validAnswer = this.newQuestionParts.answer || false;
    } else {
        validAnswer = this.currentQuestion.answer || false;
    }

    return validAnswer && validPrompt;
};

Assessment.prototype.randomizeQuestions = function() {
    this.questions = _.shuffle(this.questions);
    this.userState.save("quiz_questions_order", this.questions);
};

Assessment.prototype.nextQuestion = function() {
    var currentIndex = this.questions.indexOf(this.currentQuestion);
    var nextIndex = currentIndex + 1;

    // If it's not in edit mode
    if (!this.editable) {
        var answerIsCorrect = this.answerIsCorrect();
        // If we are allowed to move on to the next question
        if ((answerIsCorrect && this.config.get("quiz_blockNext")) || (!answerIsCorrect && !this.config.get("quiz_blockNext"))){        
            console.log("Moving to next question...");
            // If there are more questions to go through
            if (nextIndex < this.questions.length){   
                this.currentQuestion = this.questions[nextIndex];
                this.userState.save("currentQuestionIndex", nextIndex);
                this.clearMeasure();
                this.instance.render();
                this.locked = false;
                this.nextQuestionButtonState(false);
            } else {
                // Mark questions complete
                this.locked = true;
                this.instance.$el.find(".question-prompt").html("COMPLETED CHALLENGES");
                console.log("COMPLETED CHALLENGES");
                this.userState.set('currentQuestionIndex', 0);
                this.nextQuestionButtonState(false);
            }
        } else {
            console.log("Can't move on until challenge is completed");
        }
    } else {
        this.newQuestionParts = false;
        console.log("Moving to next question...");

        // If there are more questions to go through
        if (nextIndex < this.questions.length){
            this.currentQuestion = this.question(nextIndex);
        } else {
            this.currentQuestion = this.question(0);
        }
        this.showCurrentAnswer();
    }
};


Assessment.prototype.showCurrentAnswer = function() {
    this.clearMeasure();
    var newKey = new Key(this.currentQuestion.answer);

    var TOP_STAFF = 0;
    var BOTTOM_STAFF = 1;
    var staffIndex = newKey.octave > 3 ? TOP_STAFF : BOTTOM_STAFF;

    var note = new Note().addKey(newKey).setStaffNumber(staffIndex);
    var voice = this.measure.voice(0);
    voice.addNote(note);
    this.instance.render(this.editable);
};


Assessment.prototype.clearMeasure = function(){
    this.measure.voices.forEach(function(voice) {
        voice.clear();
    });
};

Assessment.prototype.render = function(editable) {
    this.editable = editable;

    if (editable) {
        this.renderPromptInput();
    } else {
        this.renderQuestionPrompt();
    }
};

Assessment.prototype.registerEventHandlers = function(){
    var instance = this.instance;
    var assessment = this;


    $(document).on('click', ".piano-note", function() {
        var measure = assessment.measure;
        var voiceTarget = measure.voice(staffIndex);
        var clickedPitch = $(this).data("pitch");

        var octave = new Key(clickedPitch).octave;

        var TOP_STAFF = 0;
        var BOTTOM_STAFF = 1;
        var staffIndex = octave > 3 ? TOP_STAFF : BOTTOM_STAFF;

        instance.eventHandler.trigger('click', {
            target : 'keyboard',
            measure : measure,
            staffIndex : staffIndex,
            pitch : clickedPitch
        });
    });

    $(document).on('click', ".next-challenge", function() {
        assessment.nextQuestion();
    });

    // Toggle Edit Mock
    $(document).on('click', ".toggle-edit", function() {
        assessment.player.trigger('toggleEdit', !instance.editable);
    });

    $(document).on('click', '.new-challenge', function() {
        assessment.startNewQuestion();
        $(this).hide();
    });

    $(document).on('click', '.save-challenge', function(){
        var newQuestionParts = assessment.newQuestionParts;
        if (newQuestionParts) {
            console.log("Saving New Challenge");
            assessment.createQuestion({
                category: $(".challenge-categories").val(), 
                prompt: $(".new-question-prompt").val(), 
                answer: newQuestionParts.answer
            });
            assessment.startNewQuestion();
        } else {
            console.log("Saving changes to challenege");
            assessment.currentQuestion.prompt = assessment.instance.$el.find(".new-question-prompt").val();
            assessment.currentQuestion.category = parseInt($(".challenge-categories").val(), 10);
            assessment.config.save("quiz_questions", assessment.questions);
        }
    });
};

Assessment.prototype.startNewQuestion = function(){
    $(".new-question-prompt").val("");
    this.clearMeasure();
    this.newQuestionParts = {
        prompt : "",
        answer : undefined
    }; 
    this.instance.render(this.editable);
};

Assessment.prototype.renderQuestionPrompt = function() {
    var instance = this.instance;

    instance.$el.find(".new-question-prompt").hide();

    if (instance.$el.find(".question-prompt").size() === 0){
        instance.$el.find('.toolbar').append('<div style="margin-top:20px" class="question-prompt well"></div>');
    }

    var text;
    if (this.questions.length === 0) {
        text = "<em>No challenges have been created yet.</em>";
    } else {
        var currentIndex = this.userState.get('currentQuestionIndex');
        var totalQuestionsLength = this.questions.length;

        var instructions = {
            0 : "(Answer using the Grand Staff)",
            1 : "(Answer using the Virtual Piano)"
        };

        var progress = "Question " + (currentIndex + 1) + " out of " + totalQuestionsLength + " : ";
        text = progress + this.currentQuestion.prompt + "<br><em>" + instructions[this.currentQuestion.category] + "</em>";
    }

    instance.$el.find(".question-prompt").html(text).show();
};

Assessment.prototype.renderPromptInput = function() {
    var instance = this.instance;

    instance.$el.find(".question-prompt").hide();

    if (instance.$el.find(".new-question-prompt").size() === 0){
        instance.$el.find('.toolbar').append('<input style="display:block" class="new-question-prompt"></input><br>');
    }

    if (!this.newQuestionParts) {
        instance.$el.find(".challenge-categories").val(this.currentQuestion.category);
        instance.$el.find(".new-question-prompt").val(this.currentQuestion.prompt).show();
    }
};

return {
    Question: Question,
    Assessment: Assessment
};

});
define('ConfigObject',['underscore', './EventHandler'], function(_, EventHandler) {



var ConfigObject = function(properties, localStorageName){
    this.properties = properties || {};
    this.events = new EventHandler();
    this.localStorageName = localStorageName;
};
ConfigObject.prototype.get = function(property) {
    return this.properties[property];
};
ConfigObject.prototype.set = function(property, value) {
    this.properties[property] = value;
    this.trigger('change');
};
ConfigObject.prototype.save = function(property, value) {
    if (typeof property !== 'undefined' && typeof value !== 'undefined') {
        this.properties[property] = value;
    }
    localStorage.setItem(this.localStorageName, JSON.stringify(_.omit(this.properties, "score")));
};
ConfigObject.prototype.on = function(event, callback, context){
    this.events.on(event, callback, context);
};
ConfigObject.prototype.trigger = function(event, data) {
    this.events.trigger(event, data);
};

return ConfigObject;

});
/* ===================================================
 * bootstrap-transition.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

   // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

   // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

   // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

   // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.item.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle()
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      })

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
    $target.carousel(options)
    e.preventDefault()
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

   // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

   // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
        $this.focus()
      }

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) return $this.click()

      $items = $('[role=menu] li:not(.divider) a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)
    $parent.length || ($parent = $this.parent())

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api touchstart.dropdown.data-api', clearMenus)
    .on('click.dropdown touchstart.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api touchstart.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api touchstart.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);/* =========================================================
 * bootstrap-modal.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

   // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function (that) {
        this.$element
          .hide()
          .trigger('hidden')

        this.backdrop()
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
            this.removeBackdrop()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

   // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (this.options.trigger != 'manual') {
        eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })
          .insertAfter(this.$element)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .offset(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)
      self[self.tip().hasClass('in') ? 'hide' : 'show']()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  , html: false
  }

}(window.jQuery);/* ===========================================================
 * bootstrap-popover.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

   // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);/* =============================================================
 * bootstrap-scrollspy.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

   // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

   // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

   // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = !~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /*   TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    e.preventDefault()
    $this.typeahead($this.data())
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

   // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);
define("bootstrap-dropdown", ["jquery"], (function (global) {
    return function () {
        var ret, fn;
        return ret || global.$.fn.dropdown;
    };
}(this)));

/**
 * @class Editor.Instance
 * @classDesc The instance class is a collection of measures and a collection of staves
 * @todo  This needs a lot of work still
 * @todo  Factor out a ContextsHelper object or something to help with dealing 
 *        with multiple canvas contexts at once
 * @description The constructor function
 */
define('Instance',['require',
    'underscore',
    'jquery',
    'keymaster',
    './Duration', 
    './Note', 
    './Voice',
    './Score',
    './Selection',
    './ScoreView',
    './Editor', 
    './commands',
    './Key',
    './CommandCenter',
    './Helpers',
    './EventHandler',
    './TimeSignature',
    './play', 
    './xml/NewXmlParser', 
    './xml/export',
    './questions/Question',
    './ConfigObject',
    'bootstrap-dropdown'],
function(require,
    _,
    $,
    keymaster,
    Duration, 
    Note, 
    Voice, 
    Score,
    Selection, 
    ScoreView, 
    Editor,     
    Comm, 
    Key, 
    CommandCenter, 
    Helpers,
    EventHandler, 
    TimeSignature, 
    Playback, 
    NewXmlParser,
    Xml,
    Quiz,
    ConfigObject){

/**
 * @lends Editor.Instance
 * @constructor
 */
var Instance = function(options) {
    if (!options) options = {};
    if (!options.config) options.config = new ConfigObject();

    if (options.config.get("quiz")) {
        // Set up basic 2 stave part (empty)
        var partConfig = {
            staffCount: 2,
            clefs: ['treble', 'bass']
        };

        var score = new Score({
            parts: [partConfig],
            measures : 1
        });

        options.config.set("score", score); 

        score.part(0).measure(0).setWidth(200);
        score.part(0).measure(0).staffSpecs.forEach(function(spec) {
            spec.forceHideTime = true;
        });
    } else if (!options.config.get('quiz') && !options.config.get('score')) {
        // Create blank score
        var blankScore = new Score({
            parts: [{
                staffCount : 2,
                clefs : ['treble', 'bass']
            }, {
                staffCount : 1,
                clefs : ['bass']
            }], 
            measures: 2
        });     
        options.config.set('score', blankScore);
    }

    this.init(options);
};

/**
 * The main initialization function. Initializes the Canvas elements
 * and the UI
 * @param  {Element} div   The <div> element to fill
 * @param  {Object) config The configuration object for the instance
 */
Instance.prototype.init = function(options) {
    (function versalInit(options){
        this.config = options.config;
    }).call(this, options);

    /**
     * The Instance's unique Id
     * @type {Number}
     */
    this.id = _.uniqueId();
    /**
     * The jQuery wrapped element
     * @type {jqElement}
     */
    this.$el = options.$el;
    /**
     * The element in which to attach the UI and canvas elements
     * @type {DOMElement}
     */
    this.el = this.$el.get();
    /**
     * The main Score model
     * @type {Score}
     */
    this.score = options.config.get("score");    // Score Object Model
    /**
     * The main ScoreView
     * @type {ScoreView}
     */
    this.scoreView = false;    // Vexflow View
    /**
     * The main Selection object, deals with all object selection
     * @type {Selection}
     */
    this.selection = new Selection();
    /**
     * The main Command hub, all commands should use this object
     * @type {CommandCenter}
     */
    this.commands  = new CommandCenter();
    /**
     * The main Event bus
     * @type {EventHandler}
     */
    this.eventHandler = new EventHandler();
    /**
     * The canvas elements  
     * @type {Object}
     */
    this.canvas = false;
    /**
     * The canvas contexts to draw on. There are contexts for different 
     * aspects of rendering (main notation, selection, placeholders)
     * @type {Object}
     */
    this.contexts = {};
    /**
     * The Vex.Flow.Renderer
     * @type {Vex.Flow.Renderer}
     */
    this.renderer = false;
    /**
     * The current Playback mode, "high" or "low"
     * @type {String}
     */
    this.playMode = "high";
    /**
     * The current application state
     * @type {Boolean}
     */
    this.editable = false;


    // Instance configuration object
    this.ctxConfig = {
        scale         : 1,       // Range of 0-1
        selectionColor   : 'rgba(0, 100, 255, 0.1)',
        placeholderColor : 'rgba(0, 100, 255, 0.1)'
    };

    this.prepareSections();
    this.prepareCanvases();

    if (this.config.get("quiz")) {
        this.extension = new Quiz.Assessment(this, options);
    }

    this.registerScrollWheelEvents();

    this.initUI();
    this.render(this.editable);
};

/**
 * Import a new score into the Instace, the previous score data 
 * is not stored.
 * @param  {Score} score The new Score to render
 */
Instance.prototype.importScore = function(score) {
    this.selection.clear();
    this.commands.clear();
    this.score = score;
    this.render();
};

/**
 * Export MusicXML of the current score
 * @return {String} A string of the XML representing the score
 */
Instance.prototype.exportScore = function() {
    var xml = new Xml.Export(this.score);
    //console.log(xml);
    return xml;
};

/**
 * Debug function, exports the score and immediately reimports it. Used
 * to test MusicXML export/import functionality.
 */
Instance.prototype.eximp = function() {
    this.importScore(new NewXmlParser(this.exportScore().xml));
};

/**
 * Gets the UI template and attach it to the instance 
 */
Instance.prototype.initUI = function() {
    if (this.extension) {
        this.extension.initUI();
        return;
    }

    var instance = this;
    $.get('ui.html', function(html){
        instance.$el.find(".toolbar").html(html);

        if (instance.editable){
            instance.$el.find('.editor-ui').show();
            instance.registerMouseEvents();
        }

        instance.registerButtonEvents();
        instance.registerEditorEvents();
        instance.registerKeyboardShortcuts();

        instance.resetInterface();
    });
};

/**
 * Render the Hover note placeholder cursor 
 * @param  {Note} note        The note which represents where the 
 *                            mouse is over the measure
 * @param  {Object} mouseCoords x and y coordinates
 * @param  {MeasureView} measureView The MeasureView on which you're rendering 
 *                                    the placeholder
 */
Instance.prototype.renderPlaceholderNote = function(note, mouseCoords, measureView) {
    var staffSectionView = measureView.getStaffSectionViewFromMouse(mouseCoords),
        vf_stave         = staffSectionView.vf_stave;

    // Align note with the mouse with mouse
    note.extraLeftPx = mouseCoords.x - vf_stave.getNoteStartX() - 17;

    var voice = new Vex.Flow.Voice({
        num_beats: 4,
        beat_value: 4,
        resolution: Vex.Flow.RESOLUTION
    }).setStrict(false).addTickables([note]);


    var placeholderContext = measureView.contexts.placeholder;
    placeholderContext.fillStyle = 'rgba(0, 100, 255, 0.5)'; // NOTE_PLACEHOLDER_COLOR

    var formatter        = new Vex.Flow.Formatter(); // Independent formatter
    formatter.formatToStave([voice], vf_stave);

    note.setStave(vf_stave).setContext(placeholderContext).draw();
};

/**
 * Get a Vex.Flow.StaveNote to render as the measure hover placeholder
 * @param  {Object} mouseCoords {x,y} coordinates
 * @param  {MeasureView} measureView The MeasureView the mouse was hovered
 */
Instance.prototype.getPlaceholderNote = function(mouseCoords, measureView) {
    var staffSectionView = measureView.getStaffSectionViewFromMouse(mouseCoords);
    var clef             = staffSectionView.spec.get('clef') || 'treble';
    var noteDuration     = this.$el.find(".editor-ui button[name='noteDuration'].active").val() || 4;
    var isRest           = $(".editor-ui #rest").hasClass("active");
    var durationStr      = noteDuration  +  (isRest ? "r" : "");
    var hoveredOverPitch = staffSectionView.getNoteFromY(mouseCoords.y);

    var note = new Vex.Flow.StaveNote({
        clef      : clef, 
        keys      : [hoveredOverPitch], 
        duration  : durationStr,
        auto_stem : true
    });

    if ($("#dot").hasClass("active")) {
        note.addDotToAll();
    }

    return note;
};

Instance.prototype.prepareSections = function() {
    this.$el.append('<div class="toolbar"></div>');
    this.$el.append('<div class="canvas-wrapper" id="canvasWrapper"></div>');
    this.$el.append('<div class="virtual-piano"></div>');
};

/**
 * Initialize the Canvases in the DOM and store their elements and CanvasRenderingContext2D[]s
 */
Instance.prototype.prepareCanvases = function() {
    var instanceId = this.id;

    var $canvasWrapper = this.$el.find('.canvas-wrapper');
    var width = $canvasWrapper.width() - 100;
    var height = $canvasWrapper.height();
    var canvas = {
        main        : $('<canvas id="main_' + instanceId + '" width="' + width + 'px" height="'+height+'px" style="position:absolute; z-index: 2;border:1px #000 solid"></canvas>').prependTo($canvasWrapper).get(0),
        placeholder : $('<canvas id="placeholder_' + instanceId + '" width="'+ width +'px" height="'+height+'px" style="position:absolute; z-index: 2;border:1px #000 solid"></canvas>').prependTo($canvasWrapper).get(0),
        selection   : $('<canvas id="selection_' + instanceId + '" width="'+ width +'px" height="'+height+'px" style="position:absolute; z-index: 2;border:1px #000 solid"></canvas>').prependTo($canvasWrapper).get(0)
    };

    // Store the canvas elements
    this.canvas = canvas;

    // Store the contexts for each canvas
    this.contexts = {
        main: canvas.main.getContext('2d'),
        placeholder: canvas.placeholder.getContext('2d'),
        selection: canvas.selection.getContext('2d'),
        instance : this
    };

    // Prepare the renderer
    this.renderer = new Vex.Flow.Renderer(this.canvas.main, 
        Vex.Flow.Renderer.Backends.CANVAS);

    // Configure each context
    _(this.contexts).keys().forEach(function(key) {
        if (key === 'instance') return; 

        var contextToModify = this.contexts[key];
        Vex.Flow.Renderer.bolsterCanvasContext(contextToModify); // Attaches useful functions
        contextToModify.scale(this.ctxConfig.scale, this.ctxConfig.scale); // Scales context
    }, this);
};

/**
 * Shift the Size of the Score rendering. Currently tweaks out hover selections.
 * @param  {Float} newScale The ercentage to decimal scale
 */
Instance.prototype.changeScale = function(newScale) {
    /*
     * We need to find a scaling multipler to modify the current contexts with
     *
     * You can't just apply a new scale using context.scale() because it modifies
     * relative to the current size
     */
    
    var oldScale = this.ctxConfig.scale;
    var multiplier = newScale / oldScale;

    _(this.contexts).keys().forEach(function(key) {
        if (key === 'instance') return;

        var contextToModify = this.contexts[key];

        contextToModify.scale(multiplier, multiplier);
    }, this);

    this.ctxConfig.scale = newScale;
    this.render();
};

/**
 * Helper function that created some dummy data
 * @return {Score} Simple dummy Score
 */
Instance.prototype.createNewScore = function() {
    // Initialize the score
    var score = new Score({
        parts: 2, 
        measures: 4
    });

    return score;
};

/**
 * Update the Instace with the current Score data
 */
Instance.prototype.render = function(editable) {
    if (typeof editable === 'undefined'){
        editable = this.editable;
    } else {
        this.editable = editable;
    }

    if (this.extension) {
        this.extension.render(this.editable);
    }
    this.scoreView = new ScoreView(this.score);
    this.scoreView.update(this.contexts);
    this.resetInterface();
    //localStorage.setItem('current-score', this.exportScore().xml);
};


/**
 * Switch to read mode, no mouse interaction, no editing
 */
Instance.prototype.readMode = function() {
    this.deregisterMouseEvents();
    this.$el.find(".editor-ui").slideUp();
    this.editable = false;
};

/**
 * Switch to edit mode
 */
Instance.prototype.editMode = function() {
    this.editable = true;
    this.$el.find(".editor-ui").slideDown();
    this.registerMouseEvents();
};

/**
 * Remove all events attached the the main Editor <div> element
 * @return {[type]} [description]
 */
Instance.prototype.deregisterMouseEvents = function() {
    this.$el.off();
};

/**
 * Register the various mouse events using jQuery
 */
Instance.prototype.registerMouseEvents = function() {
    var placeholderCtx = this.contexts.placeholder;

    var instance = this;
    $canvasWrapper = this.$el.find('.canvas-wrapper');

    //On hover
    $canvasWrapper.on('mousemove', function(event){
        placeholderCtx.clear();
        placeholderCtx.fillStyle = instance.ctxConfig.selectionColor;

        // Convert document xy to Canvas element xy
        var mouseCoords = Helpers.relMouseCoords(event, instance.canvas.main, instance.ctxConfig.scale); 
        instance.scoreView.handleHover(mouseCoords, instance.eventHandler);
    });

    // On hover leave
    // Clear all hover functionality if mouse is no longer over the canvas
    $canvasWrapper.on('mouseleave', function(){
        placeholderCtx.clear();
    });

    // On click
    $canvasWrapper.on('click', function(event) {
        var mouseCoords = Helpers.relMouseCoords(event, instance.canvas.main, instance.ctxConfig.scale);

        instance.scoreView.handleClick(mouseCoords, instance.eventHandler);
        instance.scoreView.render();

        return false;
    });

    $canvasWrapper.on('dblclick', function() {
        return false;
    });


    $canvasWrapper.on('mousedown', function(event){
        // Return early if it's not the right mouse button
        if (event.which !== 3) return;

        instance.scoreView.handleRightClick(event, instance.eventHandler);
    });

    $canvasWrapper.on('mouseup', function(event){
        if (event.which !== 3) return;
        instance.$el.find('#acc').fadeOut(50);
    });

    this.$el.find('#acc button').on('mouseup', function(){
        var command = new Comm.ChangeAccidentals(instance.selection.getKeys(), $(this).val());
        instance.runCommand(command);

        instance.$el.find('#acc').fadeOut(50);
        return;
    });

    $canvasWrapper.on('mouseleave', function() {
        instance.$el.find('#acc').fadeOut(50);
    });

    $canvasWrapper.on('contextmenu', function(){
        return false;
    });
};

Instance.prototype.registerScrollWheelEvents = function() {
    var instance = this;

    $(document).unbind('mousewheel DOMMouseScroll').on('mousewheel DOMMouseScroll', function(e) {
        var evt = event || e || window.event;
        var delta = evt.detail < 0 || evt.wheelDelta > 0 ? 1 : -1;

        var scrollDown = delta < 0;
        if (key.shift) {
            if (scrollDown) {
                instance.changeScale(instance.ctxConfig.scale - 0.1);
            } else {
                instance.changeScale(instance.ctxConfig.scale + 0.1);
            } 
        } else {
            if (scrollDown){
                instance.contexts.main.translate(0,-50);
                instance.contexts.selection.translate(0,-50);
                instance.contexts.placeholder.translate(0,-50);
                yoff += 50;

            } else {
                instance.contexts.main.translate(0,50);
                instance.contexts.selection.translate(0,50);
                instance.contexts.placeholder.translate(0,50);
                yoff -= 50;
            }
        }

        instance.scoreView.render();

        $(this).trigger('mousemove');

        return false;
    });
};

/**
 * Register the shortcuts for the keyboard using keymaster.js
 */
Instance.prototype.registerKeyboardShortcuts = function(){
    var instance = this;
    var $ui =  this.$el.find(".editor-ui");

    keymaster('ctrl+z', function(){
        instance.commands.undo();
        instance.render();
    });    

    keymaster('ctrl+y', function(){
        instance.commands.redo();
        instance.render();
    });

    keymaster('-', function(){
        main.render();
    });

    keymaster('+, =', function(){
        main.render();
    });

    keymaster('p', function(){
        Play(new Audiolet(), $ui.find("#bpm").val());
        return false;
    });
};

/**
 * Register the button events for the UI
 */
Instance.prototype.registerButtonEvents = function() {
    var instance = this;
    var selection = this.selection;

    var $ui =  this.$el.find(".editor-ui");

    $ui.find('#acc').hide();

    $ui.find("button[name='noteDuration']").on('click', function(){
        // if (selection.getM()[0].isTab()) {
        //     var duration = $(this).val(); 
        //     selection.getN().forEach(function(note) {
        //         var isRest = false;
        //         if (note.isRest())
        //             isRest = true;
                
        //         note.setDuration(duration);

        //         if (isRest)
        //             note.convertToRest();

        //     });
        //     this.render();
        // }
        instance.render();
    });

    $ui.find("#addMeasure").on('click',function() {
        var selectedMeasures = selection.getMeasures();
        var lastIndex = selectedMeasures.length -1;
        var lastSelectedMeasure = selectedMeasures[lastIndex];

        var index = lastSelectedMeasure ? lastSelectedMeasure.getIndex() + 1 : instance.score.parts[0].measures.length;

        instance.runCommand(new Comm.AddNewMeasureToScore(instance.score, index));
    });

    $ui.find("#deleteMeasure").click(function() {
        var columnIndicesToRemove = Helpers.getIndices(selection.getMeasures());
        var firstMeasure = selection.getMeasures()[0];
        var measuresToRemove = instance.score.getMeasureColumns(columnIndicesToRemove, true);

        command = new Comm.RemoveMeasures(measuresToRemove);

        if (firstMeasure.hasPrev()){
            selection.swap(firstMeasure, firstMeasure.getPrev());
        } else if (firstMeasure.hasNext()) {
            selection.swap(firstMeasure, firstMeasure.getNext());
        }

        instance.runCommand(command);
    });

    // Change KeySignature
    $ui.find("#keySig").on('change', function () {        
        var keySig           = $(this).val(),
            selectedMeasures = selection.getMeasures();

        var measures = instance.score.getMeasureColumns(Helpers.getIndices(selectedMeasures));
        instance.commands.run(new Comm.ChangeMeasures(measures, 'keySignature', keySig));
        instance.render();
    });

    $ui.find('#clef, #clef2').on('change', function () {
        var clef             = $(this).val(),
            selectedMeasures = selection.getMeasures(),
            clefs;
        if ($(this).attr('id') === 'clef2') {
            clefs = [false, clef];
        } else {
            clefs = [clef, false];
        }

        instance.runCommand(new Comm.ChangeMeasures(selectedMeasures, 'clef', clefs));
    });

    // $ui.find('#strings').on('change', function() {
    //     selection.getM().first().getSpec().setProperty("strings", parseInt($(this).val(), 10));
    //     main.render();
    // });

    $ui.find("#beatsPerMeasure, #beatsValue").on('change', function() {
        var selectedMeasures = selection.getMeasures();
        var measures = instance.score.getMeasureColumns(Helpers.getIndices(selectedMeasures));

        // Get the time signature values from the DOM
        var beatsPerMeasure  = parseInt($ui.find("#beatsPerMeasure").val(), 10),
            beatsValue       = parseInt($ui.find("#beatsValue").val(), 10);

        var timeSignatureString = beatsPerMeasure+"/"+beatsValue;
        command = new Comm.ChangeMeasures(measures, 'timeSignature', timeSignatureString);

        instance.runCommand(command);
    });

    $ui.find('#repStart').on('change', function(){
        var selectedMeasures = selection.getMeasures();
        var measures = instance.score.getMeasureColumns([Helpers.getIndices(selectedMeasures)[0]]);
        var command;

        if ($(this).attr("checked")) {
            command = new Comm.ChangeMeasures(measures, 'begBar', Vex.Flow.Barline.type.REPEAT_BEGIN);
        } else {
            command = new Comm.ChangeMeasures(measures, 'begBar', Vex.Flow.Barline.type.SINGLE);
        }

        instance.runCommand(command);
    });

    $ui.find('#repEnd').on('change', function(){
        var selectedMeasures = selection.getMeasures();
        var measures = instance.score.getMeasureColumns([Helpers.getIndices(selectedMeasures)[0]]);
        var command;

        if ($(this).attr("checked")) {
            command = new Comm.ChangeMeasures(measures, 'endBar', Vex.Flow.Barline.type.REPEAT_END);
        } else {
            command = new Comm.ChangeMeasures(measures, 'endBar', Vex.Flow.Barline.type.SINGLE);
        }

        instance.runCommand(command);
    });

    this.$el.find("#play").click(function() {
        var play;
        if (instance.playMode === "high") {
            play = Playback.HighQuality;
        } else if (instance.playMode === "low") {
            play = Playback.LowQuality;
        }
        var bpm = parseInt(instance.$el.find("#bpm").val(), 10);

        play(instance.score, bpm);
    });

    this.$el.find("#low-quality").on('change', function() {
        if ($(this).prop('checked')) {
            instance.playMode = "low";
        } else {
            instance.playMode = "high";
        }
    });

    this.$el.find("#toPNG").on('click', function() {
        var canvas = instance.canvas.main;
        window.location = canvas.toDataURL("image/png");
    });

    $ui.on('click', "#rest", function(){

    });

    $ui.on('click', "#dot", function(){

    });

    $ui.find("#articulations a").on('click', function(){
        var articulation       = $(this).html().toUpperCase(),
            selectedNotes   = selection.getNotes();

        selectedKeys = selection.getKeys();

        selectedKeys.forEach(function(key) {
            selectedNotes.push(key.note);
        });

        // MAKE INTO COMMAND
        selectedNotes.forEach(function(note){
            note.addArticulation(Editor.articulations[articulation]);
        });

        instance.render(); 
    });

    $ui.find(".tuplet").on('click', function() {
        var groups = [];
        var selectedNotes = selection.getKeys().map(function(key) {
            return key.note;
        });

        var tupletArray = $(this).html().split('/');
        var notesPerGroup = parseInt(tupletArray[0], 10);

        selectedNotes.forEach(function(note, index, notes){
            if (index % notesPerGroup === 0) {
                var tupletSlice = notes.slice(index, index + notesPerGroup);
                groups.push(tupletSlice);
            }
        });

        groups.forEach(function(group){
            if (group.length === notesPerGroup) {
                group.forEach(function(note) {
                    note.duration.setTupletMod(tupletArray[1] + "/" + tupletArray[0]);
                });
            }
        });

        main.render();
    });

    $ui.find("#width").on('change', function() {
        var measure = selection.getMeasures()[0];
        var measures = instance.score.getMeasureColumns([Helpers.getIndices([measure])[0]]);

        var width = parseInt($(this).val(), 10);
        var command = new Comm.ChangeMeasures(measures, 'width', width);

        instance.runCommand(command);

        main.render();

    });
    
    var scrollRight;
    $ui.find("#scrollRight").mousedown( function() {
        scrollRight = setInterval(function() {
            instance.contexts.main.translate(-15,0);
            instance.contexts.placeholder.translate(-15,0);
            instance.contexts.selection.translate(-15,0);
            xoff += 15;
            instance.scoreView.render();
        }, 5);
    });

    $ui.find("#scrollRight").on("mouseup mouseout", function() {
        clearInterval(scrollRight);
    });

    var scrollLeft;
    $ui.find("#scrollLeft").mousedown(function(){
        scrollLeft = setInterval(function() {
            instance.contexts.main.translate(15,0);
            instance.contexts.placeholder.translate(15,0);
            instance.contexts.selection.translate(15,0);
            xoff -= 15;
            instance.scoreView.render();
        }, 5);
    });

    $ui.find("#scrollLeft").on("mouseup mouseout", function() {
        clearInterval(scrollLeft);
    });

    $ui.siblings("#mode").on('change', function() {
        var mode = $(this).val();

        if (mode === 'edit') {
            instance.editMode();
        } else {
            instance.readMode();
        }
    });

    $ui.siblings('#pieces').change(function() {
        var filename;
        switch($(this).val()){
            case 'bach':
                filename = 'bach.xml';
                break;
            case 'bach2':
                filename = 'bach_bwv772.xml';
                break;
            case 'joplin':
                filename = 'joplin.xml';
                break;
            case 'chopin':
                filename = 'chopin_prelude_4.xml';
                break;
            case 'fauvre':
                filename = 'faure_apres_un_reve.xml';
                break;
            case 'brahms':
                filename = 'brahms.xml';
                break;
            case 'moonlight':
                filename = 'moonlight.xml';
                break;
            case 'rondo':
                filename = 'rondo.xml';
                break;
            case 'fur':
                filename = 'fur_elise.xml';
                break;
            case 'harpstrings':
                filename = 'harpstrings.xml';
                break;
            case 'holy':
                filename = 'holy.xml';
                break;

        }
        $.get('src/xml/samples/' + filename, function(xml) {
            instance.importScore(new NewXmlParser(xml));
        });
    });


    function readFile (evt) {
        var files = evt.target.files;
        var file = files[0];           
        var reader = new FileReader();

        reader.onload = function(){
            instance.importScore(new NewXmlParser(this.result));
        };

        reader.readAsText(file);
     }

    document.getElementById('file').addEventListener('change', readFile, false);

    $("#musicXml").click(function() {
        window.open(instance.exportScore().toFile(), "_blank");
    });

};

/**
 * Determine what happens on the Hover event
 * @param  {Object} hover The hover event data
 */
Instance.prototype.onHover = function(hover) {
    if (hover.target.type === 'MeasureView') {
        // Display placeholder note that follows cursor
        var measureView = hover.target;

        if (this.selection.contains(measureView.measure)){
            var note = this.getPlaceholderNote(hover.mouse, measureView);
            this.renderPlaceholderNote(note, hover.mouse, measureView);
        } else {
            measureView.highlight(hover.mouse, this.contexts.placeholder);
        }

    } else if (hover.target.type === 'NoteView') {
        // Highlight Note/Key
        var noteView = hover.target;
        noteView.highlightKey(hover.keyIndex, this.contexts.placeholder);
    }
};

/**
 * The right click event data
 * @param  {Object} click Event data
 */
Instance.prototype.onRightClick = function(click) {

    // Return early if it's not the right mouse button
    // Set the element relative to the mouse
    // 
    var keyClicked = click.keyClicked;

    this.$el.find('#acc').css({
        'top': click.pageY + 25,
        'left': click.pageX - 60
    });

    var buttonValue;

    // Clear the selection and the key
    this.selection.select(keyClicked);

    // Determine the accidental for the note to be used when 
    // selecting the buton in the DOM
    if (keyClicked.accidental === '#')
        buttonValue = '#';
    else if (keyClicked.accidental === 'b')
        buttonValue = 'b';
    else if (keyClicked.accidental === 'n' || keyClicked.accidental === '')
        buttonValue = 'n';
    
    // Remove the previously default 
    this.$el.find('#acc button.active').removeClass('active');
    // Set the default button to the accidental of the note
    this.$el.find('#acc button[value='+buttonValue+']').addClass('active');

    // Fade in the accidental buttons
    this.$el.find('#acc').fadeIn(50);

    this.scoreView.render();
};

/**
 * The on click event handler
 * @param  {Object} click The event data
 * @todo REFACTOR THIS IT SUCKS
 */
Instance.prototype.onClick = function(click){
    var parentMeasure;
    var selection = this.selection;
    var command;

    if (this.config.get("quiz")) {
        if(click.target.type !== "ScoreView"){
            this.extension.onClick(click);
        }
        return;
    }

    if (click.target.type === "MeasureView") {
        parentMeasure = click.target.model;
    } else {
        parentMeasure = Helpers.findParent(click.target.model || click.target, 'measure');
    }
    
    if (parentMeasure && !parentMeasure.isSelected()) {

        if (!key.control) {
            // Clear all measures
            selection.clear(function(item){
                return item.type === 'measure';
            });
        }

        selection.select(parentMeasure);
        this.resetInterface();
        return;   
    }

    if (click.target.type === 'ScoreView') {
        selection.clear();
    } else if (click.target.type === 'NotationVoiceView'){
        var voiceView = click.target;

        // Insert note
        tempNote = Editor.UI.getTempNote(click.pitch, false, this.id);
        tempNote.setStaffNumber(click.staffIndex);

        command = new Comm.InsertItem(voiceView.voice, tempNote, click.voicePosition);
    } else if (click.target.type === 'NoteView') {
        var noteView = click.target;
        var note = noteView.note;

        var k  = new Key(click.pitch);
        command = new Comm.AddKeyToNote(k, note);
    }else if (click.target.type === 'key') {
        var noteItem = click.target;
        var focus = noteItem;

        if (noteItem.isSelected()){
            selection.deselect(noteItem);

            if (!key.control) {
                // Make the focus the parent Note if its the last Key
                // (This is to avoid notes with no children)
                if (!click.note.isChord()) {
                    focus = click.note;       
                }
                command = new Comm.DeleteItem(focus);
            }
        } else {
            if (!key.control) {
                selection.clear(function(item){
                    return item.type === 'key';
                });
            }
            selection.select(focus);
        }
    }

    if (command) {
        // Run command and rebuild the score
        this.runCommand(command);
    } else {
        // Just rerender (selections dont' need rebuilding of the score)
        this.scoreView.render();
    }

    this.resetInterface();
};

/**
 * Register the custom events for the Editor
 */
Instance.prototype.registerEditorEvents = function() {
    this.eventHandler.on('hover', this.onHover.bind(this));
    this.eventHandler.on('click', this.onClick.bind(this));
    this.eventHandler.on('right-click', this.onRightClick.bind(this));
};

/**
 * Run a command. This should be the main interface for running commands
 * @param  {Command} command The command to run
 */
Instance.prototype.runCommand = function(command) {
    if (this.editable) {
        this.commands.run(command);
        this.render();
    }
};

/**
 * LOL FUNCTION
 * Set the interface to reflect the relevent selection.
 * @todo Refactor into a UI class or something.
 */
Instance.prototype.resetInterface = function() {
    var selMeasure = this.selection.getM()[0];
    var selNote = this.selection.getN()[0];
    var $ui = $(".editor-ui");

    if (selMeasure)
    {   

        $ui.find('#measureProps').find('input, select').prop('disabled', false);

        if (selMeasure.staffSpecs[0].get('type') === 'notation') {
            $ui.find("#stringsCell").hide();
            $ui.find("#keyCell").show();
            $ui.find("#keySig").removeAttr('disabled');
            $ui.find("#clefCell").show();
            $ui.find('#clef').removeAttr('disabled');
            if(selMeasure.staffSpecs.length === 2) {
                $ui.find('#clef2').removeAttr('disabled').fadeIn();
                $ui.find("#clef2").val(selMeasure.getSpec(1).getProperty('clef'));
            } else {
                $ui.find('#clef2').removeAttr('disabled').fadeOut();
            }
            $ui.find("#keySig").val(selMeasure.getSpec().getProperty('keySignature'));
            $ui.find("#clef").val(selMeasure.getSpec().getProperty('clef'));
            $ui.find("#width").val(selMeasure.getSpec().getProperty('width'));
        } else {

            $ui.find("#clefCell").hide();
            $ui.find("#keyCell").hide();
            $ui.find("#stringsCell").show();
            $ui.find('#strings').removeAttr('disabled').val(selMeasure.getSpec().getProperty('strings'));
            $ui.find("#keySig").attr('disabled', 'disabled');
            $ui.find("#clef").attr('disabled', 'disabled');
            $ui.find("#clef2").attr('disabled', 'disabled');
        }
        var timeSig = new TimeSignature(selMeasure.getSpec().getProperty('timeSignature'));

        $ui.find("#beatsPerMeasure").val(timeSig.getTotalBeats());
        //fix beats semantics for consistancy
        $ui.find("#beatsValue").val(timeSig.getBeatValue());

        var begBar = selMeasure.getSpec().get('begBar');
        var endBar = selMeasure.getSpec().get('endBar');

        if (begBar === 1)
            $ui.find("#repStart").attr('checked', false);
        else if (begBar === Vex.Flow.Barline.type.REPEAT_BEGIN)
            $ui.find("#repStart").attr('checked', true);        

        if (endBar === 1 || endBar === 3)
            $ui.find("#repEnd").attr('checked', false);
        else if (endBar === Vex.Flow.Barline.type.REPEAT_END)
            $ui.find("#repEnd").attr('checked', true);
    } else {
        $ui.find('#measureProps').find('input, select').prop('disabled', true);
    }

        $ui.find("#rest").removeClass("active");
        $ui.find("#dot").removeClass("active");

    if (selNote) {
        $ui.find("button[name=noteDuration].active").removeClass("active");
        $ui.find("#articulations").show();
        $ui.find("button[value=" + selNote.getDuration() + "]").addClass("active");

        if (selNote.isRest())
            $ui.find("#rest").addClass("active");        

        if (selNote.dots > 0)
            $ui.find("#dot").addClass("active");
    }
};

return Instance;

});

/**
 * @file The RequireJs configuration and main entry point to the application
 * @author Cyril Silverman &lt;Silverwolf90@gmail.com&gt;
 * @email Silverwolf90@gmail.com
 * @copyright 2013
 */

/**
 * The main music notation rendering library. It's a low level library for HTML5 Canvas
 * that renders music notation in the browser.
 * @external VexFlow
 * @see  {@link http://vexflow.com}
 */

/**
 * The requireJS configuration object. Contains all the library modules and
 * Shim configurations for non AMD modules
 */
requirejs.config({
    baseUrl: 'src',
    paths: {
        'underscore': "../lib/underscore",
        'jquery' : "../lib/jquery.min" ,
        'bootstrap-dropdown' : "../lib/bootstrap/js/bootstrap",
        'mustache' : '../lib/mustache',
        'keymaster' : '../lib/keymaster',
        'MIDI' : '../lib/MIDI',
        'base64binary' : '../lib/base64binary',
        'base64' : '../lib/base64',
        'vexflow' : '../lib/vexflow',
    },
    shim: {
        'underscore': {
                exports: '_'
        },
        'bootstrap-dropdown': { 
            deps: ['jquery'],
            exports: '$.fn.dropdown'
        },
        'mustache': {
            exports : "Mustache"
        },
        'keymaster' : {
            exports : 'key'
        },
        'base64binary' : {
            exports: 'Base64Binary'
        },
        'base64' : {
            exports: 'Base64'
        },
        'MIDI' : {
            deps: ['base64binary', 'base64'],
            exports : 'MIDI'
        },
        'vexflow' : {
            exports : 'Vex'
        }
    }
});

/**
 * The main entry point
 */
requirejs([
    'underscore',
    'jquery', 
    './Editor', 
    './Instance', 
    './xml/NewXmlParser', 
    './Score', 
    './ConfigObject'], 
function (
    _,
    $, 
    Editor, 
    Instance, 
    NewXmlParser, 
    Score,
    ConfigObject) {

// VexFlow Extension
Vex.Flow.Stave.prototype.containsPoint = function (x, y) {
    // ...if the click is within the 4 points of the stave, then
    // (note that canvas (0,0) starts in the top left corner)
    if (x >= this.getX() &&              // Initial x point
        x <= this.getNoteEndX() &&       // Ending x point
        y >= this.y + 8 &&               // Initial y point
        y <= this.getBottomY() - 25       // bottom y point
    ) {  
        return true;
    }
    return false;
};


/**
 * Load the Score, either a cached version of the previous used score
 * Or it creates a new blank one
 */
var score;
if (localStorage.getItem('current-score')) {
    try{
        // Try to parse what was found in LocalStorage
        score = new NewXmlParser(localStorage.getItem('current-score'));
    }catch(exception){
        // If an exception happens on parsing, remove from LocalStorage
        localStorage.setItem('current-score', '');
    }
}

var cachedConfigString = localStorage.getItem('music_notation_config');
var cachedConfig;
if (cachedConfigString){
    cachedConfig = JSON.parse(cachedConfigString);
} 

var cachedUserStateString = localStorage.getItem('music_notation_userState');
var cachedUserState;
if (cachedUserStateString){
    cachedUserState = JSON.parse(cachedUserStateString);
}

var configDefaults = {
    "quiz" : false,
    "quiz_questions" : [],
    "quiz_randomize" : true,
    "quiz_blockNext" : true,
    "quiz_showPiano": true,
    "quiz_showPianoNoteLabels": false,
    "quiz_numberOfOctaves": 3,
    "quiz_startingOctave": 3
};

var userStateDefaults = {
    "currentQuestionIndex": 0,
    "questionList": false
};

var userStateProperties = _.defaults(cachedUserState || {}, userStateDefaults);
var configProperties = _.defaults(cachedConfig || {}, configDefaults);

// Change VexFlow configuration
Vex.Flow.STAVE_LINE_THICKNESS = 1;
Vex.Flow.STEM_WIDTH = 1;

// The <div> element we're going to attach the Editor Instance to
var frame = $(".notation-editor-instance");
// Create an instance of the editor with the Score and <div> element
main = new Instance({
    $el: frame,
    config: new ConfigObject(configProperties, 'music_notation_config'),
    userState: new ConfigObject(userStateProperties, 'music_notation_userState'),
    propertySheetSchema: new ConfigObject()
});
        
});
define("init", function(){});
