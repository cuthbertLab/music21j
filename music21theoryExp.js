/*

M21Theory -- supplemental routines for music theory teaching and
assessment using the javascript reimplementation of music21 (music21j).  
See http://web.mit.edu/music21/ for more details.

Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab

This version is released for use in 2013-14 in non-minimized form under LGPL or 
proprietary licenses (your choice; the former is Free; the latter costs money,
but lets you use minimizers, etc. to optimize web loading).  The permanent license 
is still under discussion; please contact cuthbert@mit.edu for more information.

All interfaces are alpha and may change radically from day to day and release to release.
Do not use this in production code yet.

2013-10-05 -- v.0.1.alpha 

*/

if (typeof (M21Theory) === "undefined") {
	var M21Theory = {};
}

M21Theory.debug = false;

M21Theory.playMotto = function () {
	var delay = 0; // play one note every quarter second
	var note = 65; // the MIDI note
	var velocity = 110; // how hard the note hits
	// play the note
	MIDI.setVolume(0, 127);
	MIDI.noteOn(0, note, velocity - 50, delay);
	MIDI.noteOff(0, note, delay + 0.75);
	MIDI.noteOn(0, note + 6, velocity, delay + 0.4);
	MIDI.noteOff(0, note + 6, delay + 0.75 + 0.8);
	MIDI.noteOn(0, note + 4, velocity - 80, delay + 1.35);
	MIDI.noteOff(0, note + 4, delay + 0.75 + 1.35);
};

// Student Name Routines 
// calling M21Theory.fillNameDiv() will 
// append a name box to a div called "#studentNameDiv"

var studentName = {}; 

M21Theory.fillNameDiv = function () {
	var nameDivContents = $("<h3>Enter your name here</h3>" +
							"<p><b>First name: </b><span id='firstName'></span>" +
							" &raquo; " + 
							"<b>Last name: </b><span id='lastName'></span>" +
							"<br/>&nbsp;</p>");
	var nameDiv = $("<div>").attr("id","studentNameDiv");
	nameDiv.append(nameDivContents);
	$("#testBank").append(nameDiv);

	var tempStudentInfo = localStorage["studentInfo"];
	if (tempStudentInfo != undefined) {
		studentName = JSON.parse(localStorage["studentInfo"]);
	}
	if (studentName.first == undefined) {
		studentName.first = "";
	}
	if (studentName.last == undefined) {
		studentName.last = "";
	}
	$("<input type='text' size='20' value='" + studentName.first + "'/>")
		.attr('onchange','M21Theory.changeName("first",this.value)')
		.attr('class', 'lightInput')
		.appendTo("#firstName");
	$("<input type='text' size='20' value='" + studentName.last + "'/>")
		.attr('onchange','M21Theory.changeName("last",this.value)')
		.attr('class', 'lightInput')
		.appendTo("#lastName");	
};

M21Theory.changeName = function (which, newName) {
	if (which == 'first') {
		studentName.first = newName;
	} else if (which == 'last') {
		studentName.last = newName;	
	}
    localStorage["studentInfo"] = JSON.stringify(studentName);
};

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

M21Theory.randomGeneratorType = 'random';
M21Theory.randomIndex = undefined;
M21Theory.randomSeed = 0;
M21Theory.random = function () {
	var rgt = M21Theory.randomGeneratorType; 
	if (rgt == 'random') {
		return Math.random();
	} else {
		if (M21Theory.randomIndex == undefined) {
			if (rgt == 'fixed') {
				M21Theory.randomIndex = 1 + M21Theory.randomSeed;
			} else {
				console.error("M21Theory: Unknown random generator type: '" + rgt + "'; using 'fixed'");
				M21Theory.randomIndex = 1 + M21Theory.randomSeed;
			}
		}
		var randOut = parseFloat("." + Math.sin(M21Theory.randomIndex)
										.toString()
										.substr(5));		
		M21Theory.randomIndex += 1;
		return randOut;
	}
};

// same format as python's random.randint() where low <= n <= high

M21Theory.randint = function (low, high) {
	return Math.floor((M21Theory.random() * (high - low + 1)) + low);
};

M21Theory.randomChoice = function (inList) {
	var inListLength = inList.length;
	if (inListLength == undefined) {
		throw("M21Theory: randomChoice called without a list");
	} else {
		var choiceNum = M21Theory.randint(0, inListLength - 1);
		return inList[choiceNum];
	}
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
M21Theory.randomShuffle = function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(M21Theory.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


/* Test Bank */

M21Theory.TestBank = function () {
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
			M21Theory.fillNameDiv();
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


/* Test Type -- general -- inherited by other tests... */

M21Theory.TestSection = function () {
	this.inTestBank = undefined;
	this.testSectionDiv = undefined;
	this.assignmentId = 'unknownTestSection';
	this.title = "Assignment";
	this.instructions = "<p>" + "Answer the following questions" + "</p>";

	this.startTime = new Date().getTime();

	this.totalQs = 34;
	this.practiceQs = 4;
	
	this.numRight = 0;
	this.numWrong = 0;
	this.numMistakes = 0;

	this.maxWrong = 0;
	this.maxMistakes = 8;
	
	this.possibleOutcomes = {};
	
	// hidden variables masked by propreties
	this._allowEarlySubmit = undefined;
	this._allowSubmitWithErrors = undefined; // n.b. if allowEarlySubmit is true then this is ignored...

	this._testResponseURL = undefined;
	this._profEmail = undefined;
	this._studentFeedback = undefined;
	
    Object.defineProperties(this, {
    	'testResponseURL': { 
    		get: function () {
    			var tempURL = this._testResponseURL;
    			if (tempURL == undefined) {
    				if (this.inTestBank != undefined) {
    					tempURL = this.inTestBank.testResponseURL;
    				}
    			}
    			return tempURL;
    		},
    		set: function (newURL) {
    				this._testResponseURL = newURL;
    		}
    	},
    	'profEmail': {
    		get: function () {
    			var tempEmail = this._profEmail;
    			if (tempEmail == undefined) {
    				if (this.inTestBank != undefined) {
    					tempEmail = this.inTestBank.profEmail;
    				}
    			}
    			return tempEmail;
			},
			set: function (newEmail) {
				this._profEmail = newEmail;
			}
		},
    	'allowEarlySubmit': {
    		get: function () {
    			var allow = this._allowEarlySubmit;
    			if (allow == undefined) {
    				if (this.inTestBank != undefined) {
    					allow = this.inTestBank.allowEarlySubmit;
    				} else {
    					allow = true;
    				}
    			}
    			return allow;
			},
			set: function (newAllow) {
				this._allowEarlySubmit = newAllow;
			}
		},
    	'allowSubmitWithErrors': {
    		get: function () {
    			var allow = this._allowSubmitWithErrors;
    			if (allow == undefined) {
    				if (this.inTestBank != undefined) {
    					allow = this.inTestBank.allowSubmitWithErrors;
    				} else {
    					allow = true;
    				}
    			}
    			return allow;
			},
			set: function (newAllow) {
				this._allowEarlySubmit = newAllow;
			}
		},
    	'studentFeedback': {
    		get: function () {
    			var allow = this._studentFeedback;
    			if (allow == undefined) {
    				if (this.inTestBank != undefined) {
    					allow = this.inTestBank.studentFeedback;
    				} else {
    					allow = true;
    				}
    			}
    			return allow;
			},
			set: function (newAllow) {
				this._studentFeedback = newAllow;
			}
    	}
    });
	this.showAlert = function (msg, type, params) {
		var bgColor = '#ffff99';
		var fontColor = 'black';
		if (params == undefined) {
			params = {};
		}
		var top = ('top' in params) ? params.top : '280px';
		var delayFade = ('delayFade' in params) ? params.delayFade : 5000;
		var fadeTime = ('fadeTime' in params) ? params.fadeTime : 500;
		
		if (typeof(top) != 'string') {
			top = top + 'px';
		}
		
		if (type == 'alert') {
			bgColor = 'red';
			fontColor = 'white';
		} else if (type == 'ok') {
			bgColor = '#99ff99';
			fontColor = 'black';
			delayFade = 10 * 1000;
			fadeTime = 2 * 1000;
		} else if (type == 'update') {
			bgColor = '#e4f0f0';
			fontColor = 'black';
			delayFade = 4 * 1000;
			
		}
		var tdiv = this.testSectionDiv;
		var alertDiv = $("<div>" + msg + "</div>")
			.attr('id', 'alertDiv')
			.css('position', 'absolute')
			.css('top', top)
			.css('left', '650px')
			.css('padding', '30px 30px 30px 30px')
			.css('width', '200px')
			.css('background', bgColor)
			.css('color', fontColor)
			.css('opacity', .9)
			.css('border-radius', '15px')
			.css('box-shadow', '0px 0px 19px #999')
			.delay(delayFade)
			.fadeOut(fadeTime, function () { this.remove(); } );
		$(tdiv).append(alertDiv);
	};

	this.initPossibleOutcomes = function () { 
		this.possibleOutcomes['noFeedback'] =	$("<br clear='all'/>" + 
			  "<div class='submissionContents' style='float: right'><b>All done!</b>" +
			  "<br>You might want to check your work again just to be sure, but click submit to send. " +
			  "<br> Make sure your <b>name</b> is filled in above and "+
			  "click " + 
			  "<input class='emptyButton' type='button' />" +
			  "to finish. <br/>" + 
			  "Add any comments here: <br/>" + 
			  "<textarea class='commentTextArea' rows='7' cols='80'></textarea>" +
			  "</div><br clear='all'/>");

		this.possibleOutcomes['success'] =	$("<br clear='all'/>" + 
			  "<div class='submissionContents' style='float: right'><b>Great Work!</b>" +
			  "<br> Make sure your <b>name</b> is filled in above and "+
			  "click " + 
			  "<input class='emptyButton' type='button' />" +
			  "to finish. <br/>" + 
			  "Add any comments here: <br/>" + 
			  "<textarea class='commentTextArea' rows='7' cols='80'></textarea>" +
			  "</div><br clear='all'/>");
		this.possibleOutcomes['moreWork'] =  $("<br clear='all'/>" + 
			"<div class='submissionContents' style='float: right'><b>You got them all!</b><br/>" +
			"You can submit your work here... <input class='emptyButton' type='button' /> ..."+
			"<b>But you need more practice</b> (too many mistakes). " +
			"After submitting hit <b>reload to try again</b> and " +
			"see if you can work slowly and have fewer errors next time. Use a piano or " +
			"the keyboard layout in the back of the book or print one from online.<br/>" + 
			"Add any comments here: <br/>" + 
			"<textarea class='commentTextArea' rows='7' cols='80'></textarea>" +
			"</div><br clear='all'/>"
			);

		if (this.allowEarlySubmit || this.allowSubmitWithErrors) {
			this.possibleOutcomes['errors'] =  $("<br clear='all'/>" + 
				"<div class='submissionContents' style='float: right'>" +
				"You still have some errors; look closely at the answers and " +
				"fix any where the answers are red.<br/>" +
				"If you cannot find them, you may submit anyhow.<br/>" +
				"<input class='emptyButton' type='button' /> ...<br/>" +
				"Add any comments here: <br/>" + 
				"<textarea class='commentTextArea' rows='7' cols='80'></textarea>" +
				"</div><br clear='all'/>"
				);

		} else {
			this.possibleOutcomes['errors'] =  $("<br clear='all'/>" + 
				"<div class='submissionContents' style='float: right'>" +
				"You still have some errors; look closely at the answers and " +
				"fix any where the answers are red" +
				"</div><br clear='all'/>"
				);
		}
	
		if (this.allowEarlySubmit) {
			this.possibleOutcomes['incomplete'] =  $("<br clear='all'/>" + 
			"<div class='submissionContents' style='float: right'><i>more work to do...</i><br>" +
			"You can submit your work here if you are out of time <br/> or cannot understand the problems..." +
			"<input class='emptyButton' type='button' /> ...<br/>" +
			"Add any comments here: <br/>" + 
			"<textarea class='commentTextArea' rows='7' cols='80'></textarea>" +
			"</div><br clear='all'/>"
			);
		} else {
			this.possibleOutcomes['incomplete'] = $("<br clear='all'/>" + 
				"<div class='submissionContents' style='float: right'>" +
				"<i>a submission box will appear here when you are done</i>" +
				"</div><br clear='all'/>"
				);
		}

		for (var oc in this.possibleOutcomes) {
			var eb1 = this.possibleOutcomes[oc].find('.emptyButton');
			if (eb1.length == 0) {
				continue;
			}
			var submitButton = $("<input type='button' value='SUBMIT' class='submitButton'/> ");
			submitButton[0].testHandler = this;
			submitButton.click( function () { this.testHandler.submitWork(); } );
			eb1.replaceWith(submitButton);
		}
	};

	this.render = function (jsSelector) {
		if (jsSelector == undefined) {
			jsSelector = '#testBank';
		}
	
		this.initPossibleOutcomes();
		var newTestSection = $("<div>").attr('class','testSection').css('position','relative');
		newTestSection.append( $("<h2>" + this.title + "</h2>")
								.attr('class','testSectionTitle') );
		newTestSection.append( $("<div>" + this.instructions + "</div>")
								.attr('class','testSectionInstructions') );

		var testSectionBody = $("<div>").attr('class','testSectionBody');
		this.renderBody(testSectionBody);
		testSectionBody.append( $("<br clear='all' />") );
		newTestSection.append(testSectionBody);
		
		this.renderPostBody(newTestSection);
		
		var submissionContents = $("<div />").attr('class','submissionContents');
		var submissionSection = $("<div style='text-align: right;'/>").attr('class','testSectionSubmit');
		this.submissionContents = submissionContents;
		this.submissionSection = submissionSection;
		submissionSection.append(submissionContents);
		newTestSection.append(submissionSection);
		this.testSectionDiv = newTestSection;
		this.changeOutcome('incomplete');
		$(jsSelector).append(newTestSection);
		this.renderPostAppend();
		this.startTime = new Date().getTime();
	};	

	this.renderBody = function (testSectionBody) {
		if (testSectionBody == undefined) {
			throw("Cannot renderBody without testSectionBody -- a $('<div>') with class, testSectionBody");
		}
		for (var i = 0; i < this.totalQs; i++) {
			var questionDiv = this.renderOneQ(i);
			testSectionBody.append(questionDiv);
		 }
	};

	this.renderPostBody = function (newTestSection) {
		// does nothing here...
	};
	
	this.renderPostAppend = function () {
		// does nothing here...
	};
	
	this.renderOneQ = function (i) {
		return $("<div>Blank question " + i.toString() + "</div>");
	}; 
	
	this.checkAnswer = function (storedAnswer, answerGiven) {
		return (storedAnswer == answerGiven);
	};

	this.validateAnswer = function (valueBox, storedAnswer, answerGiven) {
		if (answerGiven == undefined) {
			if (valueBox.value != undefined) {
				answerGiven = valueBox.value;				
			} else {
				answerGiven = valueBox; 
			}
		}
		//console.log(storedAnswer);
		//console.log(answerGiven);
		var correct = this.checkAnswer(storedAnswer, answerGiven);
		if (correct) {
			if (valueBox.answerStatus == 'unanswered') {
				this.numRight += 1;
			} else if (valueBox.answerStatus == 'incorrect') {
				// do not decrement numMistakes...
				this.numRight += 1;
				this.numWrong -= 1;
			} 
			valueBox.answerStatus = 'correct';

			if (this.studentFeedback === true) {
				valueBox.className = 'correct';
			}
		} else { // incorrect
			if (valueBox.answerStatus == 'unanswered') {
				this.numWrong += 1;
				this.numMistakes += 1;
			} else if (valueBox.answerStatus == 'correct') {
				this.numRight += -1;
				this.numWrong += 1;
				this.numMistakes += 1;
			}
			valueBox.answerStatus = 'incorrect';

			if (this.studentFeedback === true) {
				valueBox.className = 'incorrect';
			}
		}
		if (M21Theory.debug) {
			console.log("Right " + this.numRight + " ; Wrong " + this.numWrong + 
						" ; Mistakes " + this.numMistakes);
		}
		this.checkEndCondition();
		return correct;
	};
	
	this.currentOutcome = undefined;
	this.checkEndCondition = function () {
		if (this.numRight == this.totalQs - this.practiceQs) {
			console.log("end condition met...");
			var outcome = undefined;
			if (this.studentFeedback === true) {
				if (this.numMistakes <= this.maxMistakes) {
					outcome = 'success';
				} else {
					console.log('more work needed');
					outcome = 'moreWork';
				}
			} else {
				outcome = 'noFeedback';
			}
			this.changeOutcome(outcome);
		} else if (this.numRight + this.numWrong == this.totalQs - this.practiceQs) {
			if (this.studentFeedback === true) {
				this.changeOutcome('errors');
			} else {
				this.changeOutcome('noFeedback');			
			}
		}
	};
	
	this.changeOutcome = function (outcome) {
		if (outcome != this.currentOutcome) {
			thisOutcome = this.possibleOutcomes[outcome];
			this.submissionSection.empty();
			this.submissionSection.append(thisOutcome);
			this.submissionContents = thisOutcome;	
			this.currentOutcome = outcome;
		}
	};
	
	this.answerInformation = function () {
		var answerInformation = {};
		answerInformation['right'] = this.numRight;
		answerInformation['wrong'] = this.numWrong;
		answerInformation['unanswered'] = this.totalQs - this.practiceQs - this.numRight - this.numWrong;
		answerInformation['mistakes'] = this.numMistakes;
		return answerInformation; 
	};
	
	this.submitWork = function () {
		var textCommentsArea = this.submissionContents;
		console.log(textCommentsArea);
		var ta = textCommentsArea.find(".commentTextArea");
		console.log(ta);
		var textComments = ta.val();
		console.log(textComments);
		if (studentName.last == "") {
			alert("You are submitting without a last name! you will not get credit; fill form and submit again...");
			return false;
		}
		if (this.studentFeedback == 'onSubmit') {
			this.showAlert('You got ' + this.numRight + ' right and ' + this.numWrong + ' wrong.', 'update');
		}
		var totalTime = Math.floor((new Date().getTime() - this.startTime)/1000);
		var storedThis = this;
		var profEmail = this.profEmail;
		var testId = 'unknownTestBank';
		if (this.inTestBank != undefined) {
			testId = this.inTestBank.testId;
		}
		$.ajax({
			type: "GET",
			url: this.testResponseURL,
			data: { comments: textComments,
					first: studentName.first,
					last: studentName.last,
					totalTime: totalTime,
					testId: testId,
					assignmentId: this.assignmentId,
					profEmail: profEmail,
					information: JSON.stringify(this.answerInformation()),
					},
			dataType: 'json',
			success: function (data) { 
				var newOutcome = $("<br clear='all'>" + "<div class='submissionContents' style='float: right'>" + 
									data.reply + "</div><br clear='all'>");
				storedThis.submissionSection.empty();
				storedThis.submissionSection.append(newOutcome);
				storedThis.submissionContents = newOutcome;
				},
			error: function (data, errorThrown) { 
					alert("Got a problem -- print this page as a PDF and email it to cuthbert@mit.edu: " + data); 
				}
			});
	};
};

/*

Interval testing routines...

*/

M21Theory.IntervalTest = function () {
	M21Theory.TestSection.call(this);
	
	this.assignmentId = 'interval';
	
	this.noteNames = ['C','D','E','F','G','A','B'];
	this.accidentals = ["", "", "", "#", "-"];
	
	this.allowablePerfectSpecifiers = ["P"];
	this.allowableImperfectSpecifiers = ["m","M"];
		
	this.minInterval = -3;
	this.maxInterval = 5;
	
	// Forgot to teach P1!!! oops...
	this.skipP1 = false;
		
	this.disallowDoubleAccs = true;
	this.disallowWhiteKeyAccidentals = true;
	
	this.lastRenderedNote1 = undefined;
	this.lastRenderedNote2 = undefined;
		
	this.title = "Interval identification (General and Specific)";
	this.instructions = "<p>" +
		"For each set of <b>ascending</b> or <b>descending</b> intervals below, write in the " +
		"yellow box the abbreviated name of the interval using the terms " +	
		"\"<b>m</b>\" for <b>minor</b>, \"<b>M</b>\" for <b>major</b>, or \"<b>P</b>\" " +
		"for <b>perfect</b> (<i>N.B.: capital P</i>). The intervals range in size " +
		"from m2 to P5.  The first four are done for you.<p>" +
		"<p><b>Click any score fragment to hear the intervals played</b>.  Practice " +
		"learning the sounds of these intervals." +
		"</p>	<p>" +
		"When you have entered your response, the box will turn green on" +
		"correct answers or red for incorrect answers. You must have <b>all boxes " +
		"green</b> to submit this problem set and you may not have more than eight " +
		"incorrect answers <b>in one session</b>; if you have gotten than eight " +
		"incorrect, hit <b>Reload</b> " +
		"to get another set of intervals.</p>";
	
	this.getRandomInterval = function () {
		var randomGeneric = undefined;		
		do {
			randomGeneric = M21Theory.randint(this.minInterval, this.maxInterval);
		} while (randomGeneric == 0 || randomGeneric == -1);

		if (this.skipP1) {
			if (randomGeneric == 1) {
				randomGeneric = 2;
			}
		}

		var genericInterval = new Music21.GenericInterval(randomGeneric);
		var diatonicSpecifier = undefined;

		if (genericInterval.perfectable == false) {
			diatonicSpecifier = M21Theory.randomChoice(this.allowableImperfectSpecifiers);
		} else {
			diatonicSpecifier = M21Theory.randomChoice(this.allowablePerfectSpecifiers);		
		}
		if (diatonicSpecifier == 'd' && randomGeneric == 1) {
			diatonicSpecifier = 'A';
		}

		var diatonicInterval = new Music21.DiatonicInterval(diatonicSpecifier, genericInterval);
		var fullInterval = new Music21.Interval(diatonicInterval);
		if (M21Theory.debug) {
			console.log("M21Theory.IntervalTest.getRandomInterval: " + fullInterval.name);
		}
		return fullInterval;
	};	
		
	this.getRandomIntervalAndNotes = function () {
		var fullInterval = this.getRandomInterval();
		var noteNames = this.noteNames;
		var accidentals = this.accidentals;
		var noteName = M21Theory.randomChoice(noteNames);
		var accName = M21Theory.randomChoice(accidentals);
		var n1 = new Music21.Note(noteName + accName);
		var p2 = fullInterval.transposePitch(n1.pitch);
		var n2 = new Music21.Note("C");
		n2.pitch = p2;
		if ((n1.pitch.step == n2.pitch.step) &&
			(n1.pitch.name != n2.pitch.name) &&
			( (n2.pitch.accidental == undefined) || (n2.pitch.accidental.name == 'natural'))
			) {
			n2.pitch.accidental = new Music21.Accidental('natural');
			n2.pitch.accidental.displayStatus = true;
		}
		return [n1, n2, fullInterval];
	};
	
	this.getRandomValidIntervalAndNotes = function () {
		//console.log("starting getRandomValidIntervalAndNotes");
		var validIntervals = false;
		do {
			var _ = this.getRandomIntervalAndNotes(),
				n1 = _[0],
				n2 = _[1],
				fullInterval = _[2];
			validIntervals = true;
			if (M21Theory.debug) {
				console.log('Get interval ' + fullInterval.name + ': checking if valid');
			}
			if ((this.lastRenderedNote1 == n1.pitch.nameWithOctave) &&
				(this.lastRenderedNote2 == n2.pitch.nameWithOctave)) {
				validIntervals = false;
				continue;
			} 
			if (this.disallowDoubleAccs) {
				if ((n1.pitch.accidental != undefined) &&
					(Math.abs(n1.pitch.accidental.alter) > 1)) {
					validIntervals = false;	
				} else if ((n2.pitch.accidental != undefined) &&
					(Math.abs(n2.pitch.accidental.alter) > 1)) {
					validIntervals = false;			
				} 
			} else { // triple sharps/flats cannot render
				if ((n1.pitch.accidental != undefined) &&
					(Math.abs(n1.pitch.accidental.alter) > 2)) {
					validIntervals = false;	
				} else if ((n2.pitch.accidental != undefined) &&
					(Math.abs(n2.pitch.accidental.alter) > 2)) {
					validIntervals = false;			
				} 
			
			}
			if (this.disallowWhiteKeyAccidentals) {
				if ((n1.pitch.name == "C-") ||
							(n1.pitch.name == "F-") ||
							(n1.pitch.name == "B#") ||
							(n1.pitch.name == "E#")) {
					validIntervals = false;
					// n.b. we allow intervals that create these notes, but not starting.			
				} else if ((n2.pitch.name == "C-") ||
							(n2.pitch.name == "F-") ||
							(n2.pitch.name == "B#") ||
							(n2.pitch.name == "E#")) {
					// not for assignment 1 we dont...
					validIntervals = false;
				}		
			}
		} while (validIntervals == false);
		this.lastRenderedNote1 = n1.pitch.nameWithOctave;
		this.lastRenderedNote2 = n2.pitch.nameWithOctave;
		return [n1, n2, fullInterval];	
	};

	this.renderOneQ = function (i) {
		var _ = this.getRandomValidIntervalAndNotes(),
			n1 = _[0],
			n2 = _[1],
			fullInterval = _[2];
	
		var s = new Music21.Stream();
		if (M21Theory.randint(0,1)) {
			s.clef = new Music21.Clef('treble');
		} else {
			s.clef = new Music21.Clef('bass');
			var octaveShift = 0;
			if (n1.pitch.diatonicNoteNum > 32) {
				octaveShift = -2;
			} else {
				octaveShift = -1;
			}
			n1.pitch.octave = n1.pitch.octave + octaveShift;
			n2.pitch.octave = n2.pitch.octave + octaveShift;
		}		
		if (M21Theory.debug) {
			console.log("name1: " + n1.pitch.name);
			console.log("octave: " + n1.pitch.octave);
			console.log("name2: " + n2.pitch.name);
			console.log("octave: " + n2.pitch.octave);
		}
		s.append(n1);
		s.append(n2);
		s.autoBeam = false;
		var nc = s.createPlayableCanvas();
		var niceDiv = $("<div style='width: 180px; float: left; padding-bottom: 20px'></div>");
		niceDiv.append(nc);
		if (i < this.practiceQs) {
			niceDiv.append( $("<div style='padding-left: 50px; position: relative; top: 0px'>" + fullInterval.name + "</div>") );
		} else {
			var inputBox = $("<input type='text' size='5' class='unanswered'/>")
							 .change( function () { this.testHandler.validateAnswer(this, this.storedAnswer); } )
							 .focus( function () { this.storedStream.playStream(); } )
							 ;
			inputBox[0].answerStatus = "unanswered"; // separate from class
			inputBox[0].storedStream = s;
			inputBox[0].storedAnswer = fullInterval.name;
			inputBox[0].testHandler = this;
			niceDiv.append( $("<div style='padding-left: 30px; position: relative; top: 10px'/>")
							 .append(inputBox) );
		}
		return niceDiv;
	};
};

M21Theory.IntervalTest.prototype = new M21Theory.TestSection();
M21Theory.IntervalTest.prototype.constructor = M21Theory.IntervalTest;


M21Theory.KeySignatureTest = function () {
	M21Theory.TestSection.call(this);
	
	this.assignmentId = 'keySignatures';
	this.totalQs = 16;
	this.minSharps = -6;
	this.maxSharps = 6;
	this.practiceQs = 2;
	this.mode = 'major';
	
	this.title = "Major KeySignature Test";
	this.instructions = "<p>Identify the following major keys by their key signatures. " +
		'Use <b>"#"</b> for sharps and lowercase <b>"b"</b> for flat, but write the key name ' +
		'in <b>CAPITAL</b> letters (why? when we get to minor, the convention is lowercase).' +
		"</p>";

	this.usedKeySignatures = [];

	this.renderOneQ = function (i) {
		var s = new Music21.Stream();
		if (M21Theory.randint(0,1)) {
			s.clef = new Music21.Clef('treble');
		} else {
			s.clef = new Music21.Clef('bass');
		}
		if (this.usedKeySignatures.length == (this.maxSharps - this.minSharps)) {
			// could be 13; but might as well, let one be unused...
			this.usedKeySignatures = []; // clear for new work.
		}
		var keySignatureSharps = undefined;
		while (keySignatureSharps == undefined) {
			keySignatureSharps = M21Theory.randint(this.minSharps, this.maxSharps);
			for (var j = 0; j < this.usedKeySignatures.length; j++) {
				if (this.usedKeySignatures[j] == keySignatureSharps) {
					keySignatureSharps = undefined;
				}
			}
		}
		this.usedKeySignatures.push(keySignatureSharps);
		var ks = new Music21.KeySignature(keySignatureSharps);
		s.keySignature = ks;
		var tonicName;
		if (this.mode == 'minor') {
			tonicName = ks.minorName();
			tonicName = tonicName.toLowerCase();
		} else {
			tonicName = ks.majorName();
		}
		tonicName = tonicName.replace(/\-/g, "b");
		var nc = s.createPlayableCanvas();
		var niceDiv = $("<div style='width: 180px; float: left; padding-bottom: 20px'></div>");
		niceDiv.append(nc);
		if (i < this.practiceQs) {
			niceDiv.append( $("<div style='padding-left: 20px; position: relative; top: 0px'>" + tonicName + "</div>") );
		} else {
			var inputBox = $("<input type='text' size='5' class='unanswered'/>")
							 .change( function () { this.testHandler.validateAnswer(this, this.storedAnswer); } )
							 ;
			inputBox[0].answerStatus = "unanswered"; // separate from class
			inputBox[0].storedStream = s;
			inputBox[0].storedAnswer = tonicName;
			inputBox[0].testHandler = this;
			niceDiv.append( $("<div style='padding-left: 15px; position: relative; top: 0px'/>")
							 .append(inputBox) );
		}
		return niceDiv;
	};
};

M21Theory.KeySignatureTest.prototype = new M21Theory.TestSection();
M21Theory.KeySignatureTest.prototype.constructor = M21Theory.KeySignatureTest;


M21Theory.ScaleEarTest = function () {
	M21Theory.TestSection.call(this);
	this.assignmentId = 'scaleEar';
	this.totalQs = 16;
	this.practiceQs = 2;
	this.screwyFraction = .6;
	
	this.title = "Hearing Major Scales Test";
	this.instructions = "<p>" +
		"Each of the following questions presents a properly written major " +
		"scale in a given key. However! approximately half of the scales will " +
		"not sound like major scales when they are played back because one scale " +
		"degree is off by a half step. Identify the incorrect scale degree with a " +
		"number from <b>'2' to '8'</b>. Or if there is no problem, enter <b>'0'</b>.</p>" +
		"<p><b>Click the scales to hear them.</b> They do not play automatically." +
		"</p>";
	this.usedKeySignatures = [];

	this.renderOneQ = function (i) {
		var s = new Music21.Stream();
		s.tempo = 60;
		if (M21Theory.randint(0,1)) {
			s.clef = new Music21.Clef('treble');
		} else {
			s.clef = new Music21.Clef('bass');
		}
		if (this.usedKeySignatures.length == 12) {
			// could be 13; but might as well, let one be unused...
			this.usedKeySignatures = []; // clear for new work.
		}
		var keySignatureSharps = undefined;
		while (keySignatureSharps == undefined) {
			keySignatureSharps = M21Theory.randint(-6, 6);
			for (var j = 0; j < this.usedKeySignatures.length; j++) {
				if (this.usedKeySignatures[j] == keySignatureSharps) {
					keySignatureSharps = undefined;
				}
			}
		}
		var ks = new Music21.KeySignature(keySignatureSharps);
		var tonic = ks.majorName();
		var tonicPitch = new Music21.Pitch(tonic);
		if (s.clef.name == 'bass') {
			if (tonicPitch.step == 'B' || tonicPitch.step == 'A' || tonicPitch.step == 'G') {
				tonicPitch.octave = 2;
			} else {
				tonicPitch.octave = 3;		
			}
		}
		var scalePitches = Music21.ScaleSimpleMajor(tonicPitch); // no new needed yet...
		for (var j = 0; j < scalePitches.length; j ++ ) {
			var n = new Music21.Note();
			//n.duration.quarterLength = 0.5;
			n.pitch = scalePitches[j];
			n.stemDirection = 'noStem';
			s.append(n);
		}
		s.autoBeam = false;
		var nc = s.createPlayableCanvas({'height': '100px', 'width': 'auto'}, 320);
		var niceDiv = $("<div style='width: 330px; float: left; padding-bottom: 20px'></div>");
		niceDiv.append(nc);
		
		var doIt = M21Theory.randint(0,10);

		// always make it so that the first two are normal, screwy
		if (i == 0) { doIt = 10; }
		else if (i == 1) { doIt = 0; } 
		var whichNote = 0;
		if (doIt < 10 * this.screwyFraction ) {
			// screw a note...
			whichNote = M21Theory.randint(2,8);
			var thisDirection = 0;
			if (whichNote == 3 || whichNote == 7) {
				// only down...
				thisDirection = -1;
			} else if (whichNote == 4 || whichNote == 8) {
				// only up...
				thisDirection = 1;
			} else {
				// down 2/3 of the time
				thisDirection = M21Theory.randint(-1,1);
				if (thisDirection == 0) { 
					thisDirection = -1;
				}
			}
			var tempPitch = s.elements[whichNote - 1].pitch;
			//console.log(whichNote + " " + tempPitch.name + " ");
			if (tempPitch.accidental == undefined) {
				tempPitch.accidental = new Music21.Accidental(thisDirection);
			} else {
				tempPitch.accidental.set( parseInt (tempPitch.accidental.alter + thisDirection) );
			}
			//console.log(whichNote + " " + tempPitch.name + " ");
			
		} else {
			whichNote = 0;
		}
						
		if (i < this.practiceQs) {
			niceDiv.append( $("<div style='padding-left: 80px; position: relative; top: 0px'>Example: <b>" + whichNote.toString() + "</b></div>") );
		} else {
			var inputBox = $("<input type='text' size='5' class='unanswered'/>")
							 .change( function () { this.testHandler.validateAnswer(this, this.storedAnswer); } )
							 ;
			inputBox[0].answerStatus = "unanswered"; // separate from class
			inputBox[0].storedStream = s;
			inputBox[0].storedAnswer = whichNote.toString();
			inputBox[0].testHandler = this;
			niceDiv.append( $("<div style='padding-left: 80px; position: relative; top: 0px'/>")
							 .append(inputBox) );
		}
		return niceDiv;
	};

};

M21Theory.ScaleEarTest.prototype = new M21Theory.TestSection();
M21Theory.ScaleEarTest.prototype.constructor = M21Theory.ScaleEarTest;


M21Theory.ScaleMajorMinorWrittenTest = function () {
	M21Theory.TestSection.call(this);
	this.assignmentId = 'scaleMajorMinor';
	this.totalQs = 16;
	this.practiceQs = 4;
	this.allowableClefs = ['treble', 'bass'];
	this.allowableScales = ['major', 'natural', 'harmonic', 'melodic'];
	this.allowableScalesDescending = ['major', 'natural', 'harmonic'];
	this.allowableDirections = ['ascending', 'descending'];
	this.minSharps = -3;
	this.maxSharps = 3;
	
	this.hide367 = false; 
	
	this.niceScaleNames = {
			'ascending': {
				'major': 'Major',
				'natural': 'Natural minor',
				'harmonic': 'Harmonic minor collection',
				'melodic': 'Ascending melodic minor'
			},
			'descending': {
				'major': 'Major',
				'natural': 'Natural or descending melodic minor',
				'harmonic': 'Harmonic minor collection'
			}
	};
	
	this.title = "Major vs. Minor Scale Identification";
	this.instructions = "<p>" +
		"Each of the following questions presents a properly written major " +
		"or minor scale in a given key. Identify the type of scale as major, " +
		"natural minor (or the identical melodic minor descending), harmonic minor collection, " +
		"or melodic minor ascending." + 
		"</p><p><b>Click the scales to hear them.</b> They do not play automatically." +
		"</p>";
	this.usedKeySignatures = [];

	this.renderOneQ = function (i) {
		var s = new Music21.Stream();
		s.tempo = 60;
		s.clef = new Music21.Clef( M21Theory.randomChoice(this.allowableClefs) );
		var direction = M21Theory.randomChoice(this.allowableDirections);
		var allowable;
		if (direction == 'ascending') {
			allowable = this.allowableScales; 
		} else {
			allowable = this.allowableScalesDescending; 
		}
		var scaleType = M21Theory.randomChoice(allowable);
		
		if (i < this.practiceQs) {
			direction = 'ascending';
			scaleType = this.allowableScales[i % this.allowableScales.length];
		}
		
		
		if (this.usedKeySignatures.length == this.maxSharps - this.minSharps) {
			this.usedKeySignatures = []; // clear for new work.
		}
		var keySignatureSharps = undefined;
		while (keySignatureSharps == undefined) {
			keySignatureSharps = M21Theory.randint(this.minSharps, this.maxSharps);
			for (var j = 0; j < this.usedKeySignatures.length; j++) {
				if (this.usedKeySignatures[j] == keySignatureSharps) {
					keySignatureSharps = undefined;
				}
			}
		}
		var ks = new Music21.KeySignature(keySignatureSharps);
		var tonic;
		if (scaleType == 'major') {
			tonic = ks.majorName();	
		} else {
			tonic = ks.minorName();
		}
		var tonicPitch = new Music21.Pitch(tonic);
		if (s.clef.name == 'bass') {
			if (tonicPitch.step == 'B' || tonicPitch.step == 'A' || tonicPitch.step == 'G') {
				tonicPitch.octave = 2;
			} else {
				tonicPitch.octave = 3;		
			}
		}
		var scalePitches = undefined;
		if (scaleType == 'major') {
			scalePitches = Music21.ScaleSimpleMajor(tonicPitch); // no new needed yet...
		} else {
			scalePitches = Music21.ScaleSimpleMinor(tonicPitch, scaleType);
		}
		if (direction == 'descending' ) {
			scalePitches.reverse();
		}
		for (var j = 0; j < scalePitches.length; j ++ ) {
			var n = new Music21.Note();
			//n.duration.quarterLength = 0.5;
			n.pitch = scalePitches[j];
			n.stemDirection = 'noStem';
			s.append(n);
		}
		s.autoBeam = false;
		
		var removedNotes = [];
		var remEls; 
		if (direction == 'descending') {
			remEls = [1, 2, 5]; // 7th, 6th, third...
		} else {
			remEls = [2, 5, 6]; // third, 6th, 7th...
		}
		if (this.hide367) {
			for (var j = 0; j < remEls.length; j++) {
				removedNotes.push( s.elements[remEls[j]] );
				s.elements[remEls[j]] = new Music21.Rest();
			}
		}
		
		var nc = s.createPlayableCanvas({'height': '100px', 'width': 'auto'}, 320);
		if (this.hide367) {
			for (j = 0; j < remEls.length; j++) {
				s.elements[remEls[j]] = removedNotes[j];
			}
		}
		
		var niceDiv = $("<div style='width: 330px; float: left; padding-bottom: 20px;'></div>");
		if (i >= this.practiceQs) {
			niceDiv.css('height', '190px');
		}
		niceDiv.append(nc);
								
		if (i < this.practiceQs) {
			var niceAnswer = this.niceScaleNames[direction][scaleType];
			niceDiv.append( $("<div style='padding-left: 20px; position: relative; top: 0px'>Example: <b>" + niceAnswer + "</b></div>") );
		} else {
			
			var inputBox = $('<div class="unanswered"/>').css('position', 'relative');
			inputBox[0].answerStatus = "unanswered"; // separate from class
			inputBox[0].storedStream = s;
			inputBox[0].storedAnswer = scaleType;
			inputBox[0].testHandler = this;
			for (var j = 0; j < allowable.length; j++) {
				var thisOption = allowable[j];
				var niceChoice = this.niceScaleNames[direction][thisOption];
				var fieldInput =  $('<label><input type="radio" name="' + 
							this.assignmentId + i.toString() + '" value="' + thisOption + '" /> ' + 
							niceChoice + '<br/></label>').change( function () { 
								var jQthis = $(this);
								var thisVal = jQthis.find('input').attr('value');
								var divBox = jQthis.parent()[0];
								divBox.testHandler.validateAnswer(divBox, divBox.storedAnswer, thisVal); // returns bool for correct
								//var questionDivTop = jQthis.parent().parent().position().top - 30;
								//if (!correct) {
								//	divBox.testHandler.showAlert('Sorry; click here to hear what the', 'alert', {top: questionDivTop});
								//};
							});
				inputBox.append(fieldInput);
			}
			if (allowable.length < 4) {
				inputBox.append($('<br/>'));
			}
			niceDiv.append( $("<div style='position: relative; top: 0px;'/>")
							 .append(inputBox) );

		}
		return niceDiv;
	};

};

M21Theory.ScaleMajorMinorWrittenTest.prototype = new M21Theory.TestSection();
M21Theory.ScaleMajorMinorWrittenTest.prototype.constructor = M21Theory.ScaleMajorMinorWrittenTest;




M21Theory.NoteIdentificationTest = function () {
	M21Theory.TestSection.call(this);
	this.assignmentId = 'noteIdentificationTest';
	this.totalQs = 6;
	this.practiceQs = 1;
	this.allowableLedgerLines = 0;
	this.allowableClefs = ['treble','bass'];
	this.allowableAccidentals = [0, 1, -1];
	this.title = "Note Identification";
	this.instructions = "<p>" +
		"Identify the notes in the following excerpts. Use <b>#</b> and <b>b</b> " +
		"for sharp and flat.  You may write in uppercase or lowercase.  Place a space " +
		"after each note for clarity (optional, but highly recommended)." +
		"</p>";
	this.lastPs = 0.0;

	this.checkAnswer = function (storedAnswer, answerGiven) {
		return (storedAnswer.toLowerCase().replace(/\s*/g, "") == answerGiven.toLowerCase().replace(/\s*/g, "") );
	};

	this.renderOneQ = function (i) {
		var s = new Music21.Stream();
		s.tempo = 80;
		s.autoBeam = true;
		// s.vexflowStaffWidth = 250;
		//s.vexflowStaffPadding = 200;
		s.clef = new Music21.Clef( M21Theory.randomChoice(this.allowableClefs) );
		s.timeSignature = '4/4';
		var minDiatonicNoteNum = s.clef.firstLine - 1 - (2 * this.allowableLedgerLines);
		var maxDiatonicNoteNum = s.clef.firstLine + 9 + (2 * this.allowableLedgerLines);
		var answerList = [];
		for (var j = 0; j < 7; j++) {
			var n;
			do {
				var chosenDiatonicNoteNum = M21Theory.randint(minDiatonicNoteNum,
																maxDiatonicNoteNum);
				var p = new Music21.Pitch("C");
				p.diatonicNoteNum = chosenDiatonicNoteNum;
				var newAlter = M21Theory.randomChoice(this.allowableAccidentals);
				p.accidental = new Music21.Accidental( newAlter );

				n = new	Music21.Note("C");
				n.duration.quarterLength = 0.5; // Not Working: type = 'eighth';
				n.pitch = p;
			} while ( (n.pitch.name == 'B#') ||
					  (n.pitch.name == 'E#') ||
					  (n.pitch.name == 'F-') ||
					  (n.pitch.name == 'C-') );
			s.append(n);
			answerList.push(n.pitch.name.replace(/\-/, 'b'));
		}
		// last answer is always an earlier note with same accidental
		var foundPitch = undefined;
		for (var j = 0; j < 7; j++) {
			if (s.elements[j].pitch.accidental.alter != 0) {
				foundPitch = s.elements[j].pitch;
				break;
			}
		}
		if (foundPitch == undefined) {
			// default
			var chosenDiatonicNoteNum = M21Theory.randint(minDiatonicNoteNum,
															maxDiatonicNoteNum);
			foundPitch = new Music21.Pitch("C");
			foundPitch.diatonicNoteNum = chosenDiatonicNoteNum;
			var newAlter = M21Theory.randomChoice(this.allowableAccidentals);
			foundPitch.accidental = new Music21.Accidental( newAlter );
		}
		var n = new Music21.Note("C");
		n.duration.quarterLength = 0.5; // Not Working: type = 'eighth';
		n.pitch.diatonicNoteNum = foundPitch.diatonicNoteNum;
		n.pitch.accidental = new Music21.Accidental(foundPitch.accidental.alter);
		s.append(n);
		answerList.push(n.pitch.name.replace(/\-/, 'b'));
		
		// done adding pitches
		s.makeAccidentals();
		var streamAnswer = answerList.join(' ');
		s.renderOptions.events['click'] = undefined;
		var nc = s.createPlayableCanvas({'height': '100px', 'width': 'auto'}, 400);
		var niceDiv = $("<div style='width: 420px; float: left; padding-bottom: 20px'></div>");
		niceDiv.append(nc);
								
		if (i < this.practiceQs) {
			niceDiv.append( $("<div style='padding-left: 10px; position: relative; top: 0px'>Example: <b>" + streamAnswer + "</b></div>") );
		} else {
			var inputBox = $("<input type='text' size='24' class='unanswered'/>")
							 .change( function () { this.testHandler.validateAnswer(this, this.storedAnswer); } );
			inputBox[0].answerStatus = "unanswered"; // separate from class
			inputBox[0].storedStream = s;
			inputBox[0].storedAnswer = streamAnswer;
			inputBox[0].testHandler = this;
			niceDiv.append( $("<div style='padding-left: 30px; position: relative; top: 0px'/>")
							 .append(inputBox) );
		}
		return niceDiv;
	};

};

M21Theory.NoteIdentificationTest.prototype = new M21Theory.TestSection();
M21Theory.NoteIdentificationTest.prototype.constructor = M21Theory.NoteIdentificationTest;

M21Theory.ChordCreationTest = function () {
	M21Theory.TestSection.call(this);
	this.assignmentId = 'chordCreationTest';
	this.totalQs = 9;
	this.practiceQs = 0;
	this.maxMistakes = 999999; // okay...
	this.allowEarlySubmit = true; // necessary
	this.minSharps = -4;
	this.maxSharps = 4;
	this.inversionChoices = undefined;
	this.displayChoices = ['roman','degreeName'];
	this.chordChoices = ['Tonic', 'Dominant','Subdominant', 'Submediant', 'Supertonic', 'Mediant', 'Leading-tone'];
	this.modeChoices = ['major','minor'];
	this.chordChoicesMode = {
			'major': ['I','ii','iii','IV','V','vi','viio'],
			'minor': ['i','iio','III','iv','V','VI','viio']
	};
	
	this.chordDefinitions = {
		'major': ['M3', 'm3'],
		'minor': ['m3', 'M3'],
		'diminished': ['m3', 'm3'],
		'augmented': ['M3', 'M3'],
		'major-seventh': ['M3', 'm3', 'M3'],
		'dominant-seventh': ['M3','m3','m3'],
		'minor-seventh': ['m3', 'M3', 'm3'],
		'diminished-seventh': ['m3','m3','m3'],
		'half-diminished-seventh': ['m3','m3','M3'],
	};
	this.chordTranspositions = {
			'Tonic': ["P1", 'major'],
			'Dominant': ["P5", 'major'], 
			'Dominant-seventh': ["P5", 'dominant-seventh'], 
			'Subdominant': ["P4", 'major'], 
			'Submediant': ["M6", 'minor'],
			'Supertonic': ["M2", 'minor'],
			'Mediant': ["M3", 'minor'],
			'Leading-tone': ["M7", 'diminished'],
			'Leading-tone-seventh': ["M7", "diminished-seventh"]
			}; 

	this.title = "Chord Spelling";
	this.instructions = "<p>" +
		"Give the notes in the following chords from lowest to highest.<br/>" +
		"The notes will be written melodically to make them easier to edit, " +
		"but imagine that they would be played together</p>" +
		"<p>" +
		"Click above or below a note on a line or space to move it up or down, and " +
		"click the accidental buttons above the staff to add the appropriate accidental " +
		"to the last edited note. " +
		"</p><p>&nbsp;</p>";

	this.usedKeySignatures = [];
		
	this.renderOneQ = function (i) {
		if (this.usedKeySignatures.length == (this.maxSharps - this.minSharps)) {
			this.usedKeySignatures = []; // clear for new work.
		}
		var keySignatureSharps = undefined;
		while (keySignatureSharps == undefined) {
			keySignatureSharps = M21Theory.randint(this.minSharps, this.maxSharps);
			for (var j = 0; j < this.usedKeySignatures.length; j++) {
				if (this.usedKeySignatures[j] == keySignatureSharps) {
					keySignatureSharps = undefined;
				}
			}
		}
		this.usedKeySignatures.push(keySignatureSharps);
		var mode = M21Theory.randomChoice(this.modeChoices);
		
		var ks = new Music21.KeySignature(keySignatureSharps);
		var tonic;
		if (mode == 'major') {
			tonic = ks.majorName();
		} else {
			tonic = ks.minorName();
		}
		var key = new Music21.Key(tonic, mode);
		var modalChoices = this.chordChoicesMode[mode];
		var chordRNstr = M21Theory.randomChoice(modalChoices);
		var displayType = M21Theory.randomChoice(this.displayChoices);

		var chordRN = new Music21.RomanNumeral(chordRNstr, key);	
		var inversionName = "";
		if (this.inversionChoices != undefined) {
			var thisInversion = M21Theory.randomChoice(this.inversionChoices);
			if (thisInversion != 0) {
				if (thisInversion == 1) {
					chordRN.pitches[0].octave += 1;
					if (displayType == 'roman') {
						inversionName = '6';
					} else {
						inversionName = ' (first inversion)';
					}
				} else if (thisInversion == 2) {
					chordRN.pitches[0].octave += 1;
					chordRN.pitches[1].octave += 1;
					if (displayType == 'roman') {
						inversionName = '64';
					} else {
						inversionName = ' (second inversion)';
					}
				}
			}
		}
		var fullChordName;
		if (displayType == 'roman') {
			fullChordName = chordRN.figure;
		} else {
			fullChordName = chordRN.degreeName;
			if (chordRN.numbers != undefined) {
				fullChordName += " " + chordRN.numbers.toString();
			}
		}
		var tonicDisplay = tonic.replace(/\-/, 'b');
		if (mode == 'minor') {
			tonicDisplay = tonicDisplay.toLowerCase();
		}
		var infoDiv = $("<div style='padding-left: 20px; margin-top: -18px; margin-bottom: 50px'>" +
				fullChordName + inversionName + " in " + tonicDisplay + " " + mode + "</div>");
		
		var chordPitches = chordRN.pitches;
		
		var s = new Music21.Measure();
		for (var j =0; j < chordPitches.length; j++ ) {
			var gPitch = new Music21.Note("G2");
			s.append(gPitch);
		}
		s.clef = new Music21.Clef('bass');

		var d = $("<div/>").css('text-align','left').css('position','relative');
		var buttonDivPlay = s.getPlayToolbar();
		buttonDivPlay.css('top', '0px');
		d.append(buttonDivPlay);
		d.append( $("<br clear='all'/>") );
		var buttonDiv = s.getAccidentalToolbar();
		buttonDiv.css('top', '15px');
		d.append(buttonDiv);
		d.append( $("<br clear='all'/>") );
		s.renderOptions.events['click'] = s.canvasChangerFunction;
		var can = s.appendNewCanvas(d);
		$(can).css('height', '140px');
		d.css('float', 'left');
		
		d.append(infoDiv);

		if (M21Theory.Debug) {
			var answerStr = "";
			for (var j =0; j < chordPitches.length; j++ ) {
				answerStr += chordPitches[j].nameWithOctave + " ";
			}
			console.log(answerStr);
		}
		
		var answerChord = new Music21.Chord(chordPitches);
		// store answers, etc. on Stream!
		s.storedAnswer = answerChord;
		s.answerStatus = 'unanswered';
		s.storedTest = this;
		s.storedDiv = d;
		s.changedCallbackFunction = function () { this.storedTest.validateAnswer(this); };
		return d;
	};


	this.validateAnswer = function (s) {
		//console.log(s);
		var storedAnswer = s.storedAnswer.pitches;
		var givenAnswer = [];
		for (var i = 0; i < s.length; i++) {
			givenAnswer.push(s.elements[i].pitch);
		}
		if (M21Theory.debug) {
			var answerStr = "";
			for (var j =0; j < storedAnswer.length; j++ ) {
				answerStr += storedAnswer[j].name + " ";
			}
			console.log(answerStr);
		}
		var correct = true;
		for (var i = 0; i < storedAnswer.length; i++) {
			var foundIt = false;
			for (var j = 0; j < givenAnswer.length; j++) {
				if (storedAnswer[i].name == givenAnswer[j].name) {
					foundIt = true;
					break;
				}
			}
			if (foundIt != true) {
				correct = false;
				break;
			}
		}
		if (correct) { // possible correct 
			//find bass note -- for inversion, etc...
			var givenChord = new Music21.Chord(givenAnswer);
			var givenBass = givenChord.bass();
			var storedBass = s.storedAnswer.bass();
			if (givenBass.name != storedBass.name) {
				correct = false;
			}
		}
		

		if (correct) {
			if (M21Theory.debug) {
				console.log('correct');
			}
			if (s.answerStatus == 'unanswered') {
				this.numRight += 1;
			} else if (s.answerStatus == 'incorrect') {
				// do not decrement numMistakes...
				this.numRight += 1;
				this.numWrong -= 1;
			} 
			s.answerStatus = 'correct';

			if (this.studentFeedback === true) {
				s.storedDiv.css('background', '#ccffcc');
				s.playStream();
			}
		} else { // incorrect
			if (s.answerStatus == 'unanswered') {
				this.numWrong += 1;
			} else if (s.answerStatus == 'correct') {
				this.numRight += -1;
				this.numWrong += 1;
				if (this.studentFeedback === true) {
					s.storedDiv.css('background', 'white');
				}				
			}
			s.answerStatus = 'incorrect';
		}
		if (M21Theory.debug != false) {
			console.log("Right " + this.numRight + " ; Wrong " + this.numWrong + 
						" ; Mistakes " + this.numMistakes);
		}
		this.checkEndCondition();
	};
};

M21Theory.ChordCreationTest.prototype = new M21Theory.TestSection();
M21Theory.ChordCreationTest.prototype.constructor = M21Theory.ChordCreationTest;

M21Theory.ChordIdentificationTest = function () {
	M21Theory.TestSection.call(this);
	this.assignmentId = 'chordIdentificationTest';
	this.totalQs = 15;
	this.practiceQs = 0;
	this.title = "Chord Identification";
	this.instructions = "<p>" +
		"Identify the following chords as <b>Major</b>, <b>Minor</b>, or something else. " +
		"<b>Double click</b> on the chord to listen to it, then drag it to the appropriate space." +
		"</p>";
	this.subtype = 'majorMinor';
    this.chords = M21Theory.randomShuffle(["C3 E3 G3", "C2 E-3 G3", "C2 G3 E4", "C3 G#3 E4",
                                           "F#2 C#3 A3", "B2 F3 D#4", "G2 D3 B-3",
                                           "E-2 G2 B-2", "E2 B2 G3", "A2 C3 E3", "A2 E3 C#4",
                                           "E3 F3 G3 A3 B3", "C3 E3 G3 C4 E4", "B-2 D-3 F4",
                                           "A-3 C4 E-4", "D#3 F#3 A#3 D#4", "F3 A3 C4", "B2 D3 F3 A-3",
                                           "D-3 A-3 F4", "D3 F3 A3", "C3 G3 E-4", "F3 A-3 C4", "E2 G2 B2",
                                           "C#4 E4 G#4",
                                           ]);

	this.checkAnswer = function (storedAnswer, answerGiven) {
		return (storedAnswer.toLowerCase().replace(/\s*/g, "") == answerGiven.toLowerCase().replace(/\s*/g, "") );
	};

	this.renderOneQ = function (i) {
        var thisChordArr = this.chords[i % this.chords.length].split(" ");
        //console.log(thisChordArr);
        var thisChord = new Music21.Chord(thisChordArr);
		thisChord.duration.type = 'whole';
		var storedAnswer = 'other';
		if (this.subtype == 'majorMinor') {
			if (thisChord.isMajorTriad()) {
				storedAnswer = 'major';
			} else if (thisChord.isMinorTriad()) {
				storedAnswer = 'minor';
			}
		} else if (this.subtype == 'inversions') {
			var dnnDiff = (thisChord.root().diatonicNoteNum - thisChord.bass().diatonicNoteNum) % 7;
			if (dnnDiff == 0) {
				storedAnswer = 'root';
			} else if (dnnDiff == 5) {
				storedAnswer = 'first inversion';
			} else if (dnnDiff == 3) {
				storedAnswer = 'second inversion';
			}
		}
		var myStream = new Music21.Stream();
        myStream.clef = new Music21.Clef('bass');
        myStream.append(thisChord);
        
        myStream.renderOptions.events['dblclick'] = 'play';
        myStream.renderOptions.events['click'] = undefined;
        var nc = myStream.createPlayableCanvas();
        nc.attr('class','draggableCanvas');
        nc.draggable( {
		  containment: 'body',
		  stack: '.draggableCanvas canvas',
		  cursor: 'move',
		  revert: true} ).data('storedAnswer', storedAnswer).data('storedStream', myStream);
		var niceDiv = $("<div style='width: 150px; float: left; padding-bottom: 20px'></div>");
		niceDiv.append(nc);
								
		nc[0].answerStatus = "unanswered"; // separate from class
		nc[0].testHandler = this;
		return niceDiv;
	};
	this.renderPostBody = function (newTestSection) {
		var display = '<div style="display: table">';
		if (this.subtype == 'majorMinor') {
			display += '<div class="dropAccepts" type="major">Drop <i>Major</i> Chords Here</div>' +
				'<div class="dropAccepts" type="minor">Drop <i>Minor</i> Chords Here</div>' +
				'<div class="dropAccepts" type="other">Drop <i>Other</i> Chords Here</div>';
		} else if (this.subtype == 'inversions') {
			display += '<div class="dropAccepts" type="root"><i>Root pos.</i> Chords Here</div>' +
			'<div class="dropAccepts" type="first inversion"><i>1st inv.</i> Chords Here</div>' +
			'<div class="dropAccepts" type="second inversion"><i>2nd inv.</i> Chords Here</div>';
		}
		var nts = $('<div style="display: table">' + display + 
				'</div>' + 
				'<style>' +
				'.dropAccepts {	display: table-cell !important;	width: 130px; height: 130px; text-align: center; ' +
				'    vertical-align:middle;	border: 15px gray dashed; -moz-border-radius: 15px; -webkit-border-radius: 15px;' +
				'    -khtml-border-radius: 15px;   border-radius: 15px;  float: left;   margin-right: 5px;   font-size: 30px;' +
				'    color: gray;   line-height: 32px;  background-color: rgba(221, 221, 20, .2) ' +
				' } </style>');
		newTestSection.append(nts);
	};
	this.renderPostAppend = function () {
		$('.dropAccepts').droppable( {
		      accept: 'canvas',
		      hoverClass: 'hovered',
		      drop:  function (event, ui) { 
		    	  var draggedCanvas = ui.draggable;
		    	  var containedStream = draggedCanvas.data('storedStream');
		    	  var soughtType = $(this).attr('type');
		    	  draggedCanvas[0].testHandler.validateAnswer(draggedCanvas[0], soughtType, draggedCanvas.data('storedAnswer'));
		    	  containedStream.playStream();
		    	  //console.log('looking for: ' + soughtType);
		      }
	    } );
	};
	
};

M21Theory.ChordIdentificationTest.prototype = new M21Theory.TestSection();
M21Theory.ChordIdentificationTest.prototype.constructor = M21Theory.ChordIdentificationTest;

M21Theory.FirstSpecies = function () {
	/*
	 * First species counterpoint in a tonal context.
	 */
	
	
	M21Theory.TestSection.call(this);
	this.assignmentId = 'firstSpeciesTest';
	this.totalQs = 1;
	this.practiceQs = 0;
	this.title = "Counterpoint (Two part) in First Species";
	this.instructions = 'Create a two part counterpoint by altering one line to fit the other. ' +
		'Hit play to get an update on your work. Your piece will play automatically when it\'s right! ' +
		'<b>To be done and submitted THREE TIMES with different given lines.</b><br/><br/>' +
		'Remember the 21m.051 rules:<ul>' +
		'<li>Each note must be a Unison, m3 or M3, P5, m6 or M6, P8 above (or an octave + those intervals)</li>'+
		'<li>No more than two 3rds (major or minor), 6ths (major or minor), or P5s in a row (better, no 2 P5s in a row).</li>' +
		'<li>No Parallel Octaves/Unisons</li>' +
		'<li>Do not repeat notes.</li>' +
		'<li>Do not make melodic leaps larger than a melodic perfect 4th.</li>' +
		'<li>No more than two leaps per 4 melodic intervals.</li>' +
		'<li>No accidentals (the system won\'t let you).</li>' +
		'<li>Watch out for the tritone (fifth that is not perfect).</li>' +
		'</ul>' +
		'Beyond all those rules, try to make the most beautiful, singable line you can.'
		;
	this.minSharps = -3;
	this.maxSharps = 2;
	this.cfs = ["C1 D E D F E G A G E F D E D C",
	            "G1 A F G c B A F D E G F D C",
	            "C1 E D F E F D E AA BB C E D C BB C",
	            "c1 B A E F F G A G E D C",
	            "c1 c B A G A G F E F E G A B c"];
	
	this.noteChanged = function (clickedDiatonicNoteNum, foundNote, canvas) {
		if (foundNote != undefined) {
			var n = foundNote;
			var part = n.parent.parent;
			var score = part.parent;
			if (part == score.elements[1]) {
				this.testHandler.showAlert(
						"No...you can't alter the given line.  That'd be too easy. :-)", 'alert');
				return;
			}
			n.unchanged = false;
			p = new Music21.Pitch("C");
			p.diatonicNoteNum = clickedDiatonicNoteNum;
			var stepAccidental = this.keySignature.accidentalByStep(p.step);
			if (stepAccidental == undefined) {
				stepAccidental = new Music21.Accidental(0);
			}
			p.accidental = stepAccidental;
			n.pitch = p;
			n.stemDirection = undefined;
			this.clef.setStemDirection(n);
			this.activeNote = n;
			this.redrawCanvas(canvas);
			if (this.changedCallbackFunction != undefined) {
				this.changedCallbackFunction();
			}
		} else {
			if (Music21.debug) {
				console.log("No note found at: " + xPx);		
			}
		}

	};
	this.evaluateCtp = function () {
		var th = this.testHandler;
		if (th.testHandler != undefined) {
			return;
		}
		var existingAlerts = $(th.testSectionDiv).find('#alertDiv');
		if (existingAlerts.length > 0) {
			$(existingAlerts[0]).remove();
		}
		var studentLine = this.elements[0].flat;
		var cf = this.elements[1].flat;
		var totalUnanswered = 0;
		var niceNames = {
				1: "unison or octave",
				2: "second",
				3: "third",
				4: "fourth",
				5: "fifth",
				6: "sixth",
				7: "seventh",
		};
		var allowableIntervalStr = "thirds, perfect fifths, sixths, or perfect octaves/unisons (or octave equivalents).";
		var prevNote = undefined;
		var prevInt = undefined;
		var prevPrevInt = undefined;
		var unansweredNumbers = [];
		for (var i = 0; i < this.elements[0].length; i++) {
			var measureNumber = i + 1;
			var studentNote = studentLine[i];
			var cfNote = cf[i];
			var genericInterval = 1 + (studentNote.pitch.diatonicNoteNum - cfNote.pitch.diatonicNoteNum) % 7;
			if (studentNote.unchanged) {
				totalUnanswered ++;
				unansweredNumbers.push(measureNumber);
				prevPrevInt = prevInt;
				prevInt = genericInterval;
				prevNote = studentNote;
				continue;
			}
			if (genericInterval <= 0) {
				th.showAlert("Your lines cross in measure " + measureNumber + "; keep your line above the given line.");				
				return;
			}
			if (genericInterval != 1 && genericInterval != 3 && genericInterval != 5 && genericInterval != 6) {
				th.showAlert("You have a " + niceNames[genericInterval] + " in measure " + measureNumber +
						".  Acceptable intervals are " + allowableIntervalStr);
				return;
			}
			if (genericInterval == 5) {
				var semitones = (studentNote.pitch.ps - cfNote.pitch.ps) % 12;
				if (semitones == 6) {
					th.showAlert("Not all fifths are perfect fifths! In measure " +
							measureNumber + " you wrote a diminished fifth. Listen to " +
							" what you wrote and hit Play to listen to it in context before " +
							" fixing it."
					);
					var newS = new Music21.Stream();
					var oldCFNoteParent = cfNote.parent; 
					var oldStudentNoteParent = studentNote.parent;
					newS.append(cfNote);
					newS.append(studentNote);
					newS.playStream();
					cfNote.parent = oldCFNoteParent; 
					studentNote.parent = oldStudentNoteParent;
					return;
				}
			}
			if (prevInt != undefined) {
				var prevMeasure = measureNumber - 1;
				if (prevNote.pitch.ps == studentNote.pitch.ps) {
					th.showAlert("Remember, you cannot repeat notes, like you do between measures " +
							prevMeasure + " and " + measureNumber);
					return;
				}
				if (prevInt == 1 && genericInterval == 1) {
					th.showAlert("You have parallel unisons or octaves between measures " + prevMeasure + " and " +
							measureNumber);
					return;
				}
				if (Math.abs(studentNote.pitch.diatonicNoteNum - prevNote.pitch.diatonicNoteNum) >= 4) {
					th.showAlert("Between measures " + prevMeasure + " and " +
							measureNumber + " you have a leap greater than a Perfect 4th.");
					return;
				}
				if (prevPrevInt != undefined) {
					if (prevPrevInt == prevInt && prevInt == genericInterval) {
						th.showAlert("In measures " + (prevMeasure - 1) + "-" + measureNumber + 
								" you have used three " + niceNames[genericInterval] + "s in a row. " +
								"The limit is two in a row."
						);
						return;
					}	
				}
			}
			if (measureNumber > 4) {
				var numSkips = 0;
				for (var j = measureNumber - 4; j < measureNumber; j++) {
					if (Math.abs(
							studentLine[j-1].pitch.diatonicNoteNum - 
							studentLine[j].pitch.diatonicNoteNum
					) >= 2) {
						numSkips++;
					}
				}
				if (numSkips > 2) {
					th.showAlert("You have " + numSkips + " skips " + 
							"between measures " + (measureNumber - 4) + " and " +
							measureNumber + ". The maximum is 2 per 4 melodic intervals."
					);
					return;
				}
			}
			prevPrevInt = prevInt;
			prevInt = genericInterval;
			prevNote = studentNote;
		}
		if (totalUnanswered > 5) {
			th.showAlert(":-)", 'update');
		} else if (totalUnanswered > 0) {
			th.showAlert("Almost there... you need to give an answer for measures " +
					unansweredNumbers.join(', ') + ". (If the note is right, just click it again).",
					'update');
		} else {
			th.showAlert("Great Work! It's all set; listen to what you've done, then click Submit.", 'ok');
			this.playStream();
			th.numRight += 1;
			th.checkEndCondition();
		}
	};
	
	this.renderOneQ = function (i) {
		var thisSharps = M21Theory.randint(this.minSharps, this.maxSharps);
		var thisCf = M21Theory.randomChoice(this.cfs);
		var s = new Music21.Score();
		var ks = new Music21.KeySignature(thisSharps);
		var pStudent = new Music21.Part();
		var pCF = new Music21.Part();
		var tnCF = Music21.TinyNotation(thisCf);
		
		
		$.each(tnCF.elements, function(j, el) { 
			var mStudent = new Music21.Measure();
			if (j != 0) {
				mStudent.renderOptions.showMeasureNumber = true;
				mStudent.renderOptions.measureIndex = j;
			}
			
			var studentNote = new Music21.Note('C4');
			studentNote.duration.type = 'whole';
			studentNote.pitch = ks.transposePitchFromC(studentNote.pitch);
			studentNote.unchanged = true;
			mStudent.append(studentNote);
			
			pStudent.append(mStudent);
			var mCF = new Music21.Measure();
			el.pitch = ks.transposePitchFromC(el.pitch);
			mCF.append(el);
			pCF.append(mCF);
		});
		pStudent.clef = new Music21.Clef('treble');
		pCF.clef = new Music21.Clef('bass');
		s.append(pStudent);
		s.append(pCF);
		s.timeSignature = '4/4';
		s.keySignature = ks;
		s.tempo = 200;
		s.renderOptions.maxSystemWidth = 800;
		s.noteChanged = this.noteChanged;
		s.renderOptions.events['click'] = s.canvasChangerFunction;
		s.testHandler = this;
		s.changedCallbackFunction = this.evaluateCtp;
		var niceDiv = $("<div style='width: 700px; float: left; padding-bottom: 20px'></div>").css('position','relative');
		var buttonDiv = s.getPlayToolbar();
		niceDiv.append(buttonDiv);
		var can = s.appendNewCanvas(niceDiv);
		can.answerStatus = "unanswered"; // separate from class
		can.testHandler = this;
		return niceDiv;
	};


};


M21Theory.FirstSpecies.prototype = new M21Theory.TestSection();
M21Theory.FirstSpecies.prototype.constructor = M21Theory.FirstSpecies;
