/**
 * m21theory -- supplemental routines for music theory teaching  
 * m21theory/bank -- a wrapper for multiple sections.
 * 
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define([], function(require) {
	var bank = {};
	/* Test Bank */

	bank.TestBank = function () {
		this.allTests = [];
		this.addStudentName = true;
		this.startTime = 0;
		this.submissionBox = true;
		this.testId = 'unknownTestBank';
		this.title = "";
		this.instructions = "";
		this.testBankSelector = "#testBank";	

		// test defaults...
		this.profEmail = 'cuthbert';
		this.testResponseURL = "http://ciconia.mit.edu/m21j/testSectionResponse2.cgi";
		this.allowEarlySubmit = true;
		this.allowSubmitWithErrors = false;
		this.studentFeedback = true;
		
		this.render = function () {
			testBank = $(this.testBankSelector);
			if (this.title != "") {
				testBank.append( $("<h1>" + this.title + "</h1>")
									.attr('class','testBankTitle'));
			}
			if (this.instructions != "") {
				testBank.append(  $("<div>" + this.instructions + "</div>")
									.attr('class','testBankInstructions') );
			}

			if (this.addStudentName) {
				m21theory.userData.fillNameDiv();
			}
			for (var i = 0; i < this.allTests.length; i ++) {
				var thisTest = this.allTests[i];
				thisTest.render(this.testBankSelector);
			}
			testBank.append( $("<br clear='all' />") );
			this.startTime = new Date().getTime();
		};
		
		
		this.append = function (newTest) {
			newTest.inTestBank = this;
			this.allTests.push(newTest);
		};
	};
	// end of define
	if (typeof(m21theory) != "undefined") {
		m21theory.bank = bank;
	}		
	return bank;
});