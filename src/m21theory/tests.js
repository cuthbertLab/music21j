/**
 * m21theory -- supplemental routines for music theory teaching  
 * m21theory/tests -- load all tests.
 * 
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

var knownTests = ['interval','chordCreation','chordIdentification','firstSpecies','keySignature',
                  'noteIdentification','scaleEar','scaleMajorMinorWritten'];

var knownTestsPrefixed = [];
for (var i = 0; i < knownTests.length; i ++) {
	knownTestsPrefixed.push("m21theory/tests/" + knownTests[i]);
}
var dependencies = ['require'].concat(knownTestsPrefixed);

define(dependencies, function(require) {
	var tests = {};
	for (var i = 0; i < knownTests.length; i ++) {
		var testModuleName = knownTests[i];
		var testPrefixed = knownTestsPrefixed[i];
		tests[testModuleName] = require(testPrefixed);
	}
	tests.get = function (testName) {
		// return a newly created object by test name...
		thisTest = m21theory.tests[testName];
		return new thisTest();
	}
	
	
	// end of define
	if (typeof(m21theory) != "undefined") {
		m21theory.tests = tests;
	}
	return tests;
});