/**
 * m21theory -- supplemental routines for music theory teaching  
 * m21theory/section -- a blank Test for subclassing.
 * 
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define(['m21theory/random'], function(require) {
	var section = {};


	/* Test Type -- general -- inherited by other tests... */

	section.Generic = function () {
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
			if (m21theory.debug) {
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
			if (m21theory.debug) {
				console.log(textCommentsArea);
			}
			var ta = textCommentsArea.find(".commentTextArea");
			if (m21theory.debug) {
				console.log(ta);
			}
			var textComments = ta.val();
			if (m21theory.debug) {
				console.log(textComments);
			}
			if (m21theory.userData.studentName.last == "") {
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
						first: m21theory.userData.studentName.first,
						last: m21theory.userData.studentName.last,
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

	// end of define
	if (typeof(m21theory) != "undefined") {
		m21theory.section = section;
	}		
	return section;
});