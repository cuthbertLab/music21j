define("m21theory/tests/keySignature", ["m21theory/section", "m21theory/random"], 
        function (section, random) {
	var ThisTest = function () {
		section.Generic.call(this);
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
			var s = new music21.stream.Stream();
			if (random.randint(0,1)) {
				s.clef = new music21.clef.Clef('treble');
			} else {
				s.clef = new music21.clef.Clef('bass');
			}
			if (this.usedKeySignatures.length == (this.maxSharps - this.minSharps)) {
				// could be 13; but might as well, let one be unused...
				this.usedKeySignatures = []; // clear for new work.
			}
			var keySignatureSharps = undefined;
			while (keySignatureSharps == undefined) {
				keySignatureSharps = random.randint(this.minSharps, this.maxSharps);
				for (var j = 0; j < this.usedKeySignatures.length; j++) {
					if (this.usedKeySignatures[j] == keySignatureSharps) {
						keySignatureSharps = undefined;
					}
				}
			}
			this.usedKeySignatures.push(keySignatureSharps);
			var ks = new music21.key.KeySignature(keySignatureSharps);
			s.keySignature = ks;
			var tonicName;
			if (this.mode == 'minor') {
				tonicName = ks.minorName();
				tonicName = tonicName.toLowerCase();
			} else {
				tonicName = ks.majorName();
			}
			tonicName = tonicName.replace(/\-/g, "b");
			var nc = s.createCanvas();
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

	ThisTest.prototype = new section.Generic();
	ThisTest.prototype.constructor = ThisTest;
	return ThisTest;
});