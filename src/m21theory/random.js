/**
 * m21theory -- supplemental routines for music theory teaching  
 * m21theory/random -- a variety of reproduceable pseudoRandom generators.
 * 
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define([], function(require) {
	var random = {};
	// ---------------
	// Random number routines...

	/*  randomGeneratorType -- how to generate random numbers.

	    Javascript does not have a random number seed, so if we
	    want pseudo-pseudo random numbers, we take the trailing
	    values of sine(x) where x is an integer.

	    valid values are:
	        'random' -- use Math.random;
	        'fixed'  -- use a sine generator beginning at a fixed index.
	                    gives the same numbers every time.
		    
		    Not implemented, but TODO for future
		    'day'    -- use a sine generator beginning at an index
		                tied to the current day (so everyone taking a
		                quiz on the same day gets the same Qs, but
		                people taking makeups, etc. get different ones).
		    'hour'	 -- same as day, but tied to the hour.
		    'month'  -- same as day, but tied to the month.
		    'semester' -- same as day, but tied to the half year.
		    'trimester' -- same as day, but tied to the 1/3 year.
		    'year'   -- same as day, but tied to the year.
	*/ 

	random.generatorType = 'random';
	random.index = undefined;
	random.seed = 0;
	random.random = function () {
		var rgt = random.generatorType; 
		if (rgt == 'random') {
			return Math.random();
		} else {
			if (random.index == undefined) {
				if (rgt == 'fixed') {
					random.index = 1 + random.seed;
				} else {
					console.error("m21theory.random: Unknown random generator type: '" + rgt + "'; using 'fixed'");
					random.index = 1 + random.seed;
				}
			}
			var randOut = parseFloat("." + Math.sin(random.index)
											.toString()
											.substr(5));		
			random.index += 1;
			return randOut;
		}
	};

	// same format as python's random.randint() where low <= n <= high

	random.randint = function (low, high) {
		return Math.floor((random.random() * (high - low + 1)) + low);
	};

	random.choice = function (inList) {
		var inListLength = inList.length;
		if (inListLength == undefined) {
			throw("m21theory.random.choice: called without a list");
		} else {
			var choiceNum = random.randint(0, inListLength - 1);
			return inList[choiceNum];
		}
	};

	//+ Jonas Raoni Soares Silva
	//@ http://jsfromhell.com/array/shuffle [v1.0]
	random.shuffle = function (o) { //v1.0
	    for(var j, x, i = o.length; i; j = Math.floor(random.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	    return o;
	};

	// end of define
	if (typeof(m21theory) != "undefined") {
		m21theory.random = random;
	}		
	return random;
});