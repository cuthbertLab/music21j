define("m21theory/tests/scaleEar", ["m21theory/section"], function () {
    var ThisTest = function () {
        m21theory.section.Generic.call(this);
        this.assignmentId = 'scaleEar';
        this.totalQs = 16;
        this.practiceQs = 2;
        this.screwyFraction = .6;
        this.minSharps = -6;
        this.maxSharps = 6;
        
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
            var s = new music21.stream.Stream();
            s.tempo = 60;
            if (m21theory.random.randint(0,1)) {
                s.clef = new music21.clef.Clef('treble');
            } else {
                s.clef = new music21.clef.Clef('bass');
            }
            if (this.usedKeySignatures.length == 12) {
                // could be 13; but might as well, let one be unused...
                this.usedKeySignatures = []; // clear for new work.
            }
            var keySignatureSharps = undefined;
            while (keySignatureSharps == undefined) {
                keySignatureSharps = m21theory.random.randint(this.minSharps, this.maxSharps);
                for (var j = 0; j < this.usedKeySignatures.length; j++) {
                    if (this.usedKeySignatures[j] == keySignatureSharps) {
                        keySignatureSharps = undefined;
                    }
                }
            }
            var ks = new music21.key.KeySignature(keySignatureSharps);
            var tonic = ks.majorName();
            var tonicPitch = new music21.pitch.Pitch(tonic);
            if (s.clef.name == 'bass') {
                if (tonicPitch.step == 'B' || tonicPitch.step == 'A' || tonicPitch.step == 'G') {
                    tonicPitch.octave = 2;
                } else {
                    tonicPitch.octave = 3;      
                }
            }
            var scalePitches = music21.scale.ScaleSimpleMajor(tonicPitch); // no new needed yet...
            for (var j = 0; j < scalePitches.length; j ++ ) {
                var n = new music21.note.Note();
                //n.duration.quarterLength = 0.5;
                n.pitch = scalePitches[j];
                n.stemDirection = 'noStem';
                s.append(n);
            }
            s.autoBeam = false;
            var nc = s.createPlayableCanvas({'height': '100px', 'width': 'auto'}, 320);
            var niceDiv = $("<div style='width: 330px; float: left; padding-bottom: 20px'></div>");
            niceDiv.append(nc);
            
            var doIt = m21theory.random.randint(0,10);

            // always make it so that the first two are normal, screwy
            if (i == 0) { doIt = 10; }
            else if (i == 1) { doIt = 0; } 
            var whichNote = 0;
            if (doIt < 10 * this.screwyFraction ) {
                // screw a note...
                whichNote = m21theory.random.randint(2,8);
                var thisDirection = 0;
                if (whichNote == 3 || whichNote == 7) {
                    // only down...
                    thisDirection = -1;
                } else if (whichNote == 4 || whichNote == 8) {
                    // only up...
                    thisDirection = 1;
                } else {
                    // down 2/3 of the time
                    thisDirection = m21theory.random.randint(-1,1);
                    if (thisDirection == 0) { 
                        thisDirection = -1;
                    }
                }
                var tempPitch = s.elements[whichNote - 1].pitch;
                //console.log(whichNote + " " + tempPitch.name + " ");
                if (tempPitch.accidental == undefined) {
                    tempPitch.accidental = new music21.pitch.Accidental(thisDirection);
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
    
    ThisTest.prototype = new m21theory.section.Generic();
    ThisTest.prototype.constructor = ThisTest;
    return ThisTest;
});