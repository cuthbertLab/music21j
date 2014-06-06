/**
 * m21theory -- supplemental routines for music theory teaching  
 * m21theory/userData -- keep track of users
 * 
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

define(['jquery'], function($) {
	// Student Name Routines 
	// calling m21theory.fillNameDiv() will 
	// append a name box to a div called "#studentNameDiv"

	var userData = {};
	userData.studentName = {}; 
	
	
	userData.fillNameDiv = function () {
		var nameDivContents = $("<h3>Enter your name here</h3>" +
								"<p><b>First name: </b><span id='firstName'></span>" +
								" &raquo; " + 
								"<b>Last name: </b><span id='lastName'></span>" +
								"<br/>&nbsp;</p>");
		var nameDiv = $("<div>").attr("id","studentNameDiv");
		nameDiv.append(nameDivContents);
		
		var testBank = $("#testBank");
		if (testBank.length == 0) {
			$("body").append("<div id='testBank'/>");
			testBank = $("#testBank");
		}
		testBank.append(nameDiv);

		var tempStudentInfo = localStorage["studentInfo"];
		if (tempStudentInfo != undefined) {
			userData.studentName = JSON.parse(localStorage["studentInfo"]);
		}
		if (userData.studentName.first == undefined) {
			userData.studentName.first = "";
		}
		if (userData.studentName.last == undefined) {
			userData.studentName.last = "";
		}
		$("<input type='text' size='20' value='" + userData.studentName.first + "'/>")
			.attr('onchange','m21theory.userData.changeName("first",this.value)')
			.attr('class', 'lightInput')
			.appendTo("#firstName");
		$("<input type='text' size='20' value='" + userData.studentName.last + "'/>")
			.attr('onchange','m21theory.userData.changeName("last",this.value)')
			.attr('class', 'lightInput')
			.appendTo("#lastName");	
	};

	userData.changeName = function (which, newName) {
		if (which == 'first') {
			userData.studentName.first = newName;
		} else if (which == 'last') {
			userData.studentName.last = newName;	
		}
	    localStorage["studentInfo"] = JSON.stringify(userData.studentName);
	};

	// end of define
	if (typeof(m21theory) != "undefined") {
		m21theory.userData = userData;
	}		
	return userData;
});