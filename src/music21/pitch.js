/**
 * music21j -- Javascript reimplementation of Core music21 features.  
 * music21/pitch -- pitch routines
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

define(['./prebase'], 
        /**
         * pitch module
         * @exports music21/pitch
         */
        function(prebase) {
    var pitch = {};
	
	/*  pitch based objects; from pitch.py */

	/**
	 * @constructor
	 * @param {string|number} accName - an accidental name
	 */
	pitch.Accidental = function (accName) {
        /**
         * @var {string} name
         * @var {number} alter
         * @var {string} modifier
         * @var {string} vexflowModifier
         * @var {Array} classes
         */
	    prebase.ProtoM21Object.call(this);
	    this.classes.push('Accidental');
		this._name = "";
		this._alter = 0.0;
		this._modifier = "";
		this.displayType = "normal"; // "normal", "always" supported currently
		this.displayStatus = undefined; // true, false, undefined
		this.set(accName);
	};
    pitch.Accidental.prototype = new prebase.ProtoM21Object();
    pitch.Accidental.prototype.constructor = pitch.Accidental;
    /**
     * 
     * @param {number|string} accName
     */
    pitch.Accidental.prototype.set = function (accName) {
        if ((accName != undefined) && (accName.toLowerCase != undefined)) {
            accName = accName.toLowerCase();
        }
        if (accName == 'natural' || accName == 'n' || accName == 0 || accName == undefined) {
            this._name = 'natural';
            this._alter = 0.0;
            this._modifier = "";
        } else if (accName == 'sharp' || accName == '#' || accName == 1) {
            this._name = 'sharp';
            this._alter = 1.0;
            this._modifier = "#";
        } else if (accName == 'flat' || accName == '-' || accName == -1) {
            this._name = 'flat';
            this._alter = -1.0;
            this._modifier = "-";
        } else if (accName == 'double-flat' || accName == '--' || accName == -2) {
            this._name = 'double-flat';
            this._alter = -2.0;
            this._modifier = "--";
        } else if (accName == 'double-sharp' || accName == '##' || accName == 2) {
            this._name = 'double-sharp';
            this._alter = 2.0;
            this._modifier = "##";
        } else if (accName == 'triple-flat' || accName == '---' || accName == -3) {
            this._name = 'triple-flat';
            this._alter = -3.0;
            this._modifier = "---";
        } else if (accName == 'triple-sharp' || accName == '###' || accName == 3) {
            this._name = 'triple-sharp';
            this._alter = 3.0;
            this._modifier = "###";
        }
    };
    Object.defineProperties(pitch.Accidental.prototype, {
        /**
         * @memberof module:music21/pitch~pitch.Pitch
         */
        'name' : {
          enumerable: true,
          configurable: true,
          get: function () { return this._name; },
          set: function (n) { this.set(n); },
        },
        'alter' : {
            enumerable: true,
            configurable: true,
            get: function () { return this._alter; },
            set: function (n) { this.set(n); },
        },
        'modifier' : {
              enumerable: true,
              configurable: true,
              get: function () { return this._modifier; },
              set: function (n) { this.set(n); },
        },
        'vexflowModifier' : {
              enumerable: true,
              configurable: true,
              get: function () { 
                  var m = this.modifier;
                  if (m == "") { return "n"; }
                  else if (m == "#") { return "#"; }
                  else if (m == '-') { return "b"; }
                  else if (m == "##") { return "##"; }
                  else if (m == '--') { return "bb"; }
                  else if (m == "###") { return "###"; }
                  else if (m == '---') { return "bbb"; }
                  else { throw ("Vexflow does not support: " + m); }
              },
        }
          
    });     	
	
	pitch.nameToMidi = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
	pitch.nameToSteps = {'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6};
	pitch.stepsToName = ['C','D','E','F','G','A','B'];
	pitch.midiToName = ['C','C#','D','E-','E','F','F#','G','A-','A','B-','B'];
	
	/**
	 * @constructor
	 * @param {string} pn - name of the pitch, with or without octave.
	 * @property {number} pitch.Pitch.diatonicNoteNum - diatonic number of the pitch, where 29 = C4
	 */
	pitch.Pitch = function (pn) {
	    prebase.ProtoM21Object.call(this);
	    this.classes.push('Pitch');
	    if (pn == undefined) {
	    	pn = "C";
	    }
	    /**
	     * @type {string}
	     */
	    this._step = 'C';
	    /**
	     * @type {int}
	     */
	    this._octave = 4;
	    /**
	     * @type {pitch.Accidental|undefined}
	     */
	    this._accidental = undefined;
	    
	    /* pn can be a nameWithOctave */
	    if (pn.match(/\d+/)) {
	        this.nameWithOctave = pn;
	    } else {
	        this.name = pn;	        
	    }	    
	};
    pitch.Pitch.prototype = new prebase.ProtoM21Object();
    pitch.Pitch.prototype.constructor = pitch.Pitch;
    Object.defineProperties(pitch.Pitch.prototype, {
        'step' : {
          enumerable: true,
          configurable: true,
          get: function () { return this._step; },
          set: function (s) { this._step = s; }
        },
        'octave' : {
            enumerable: true,
            configurable: true,
            get: function () { return this._octave; },
            set: function (o) { this._octave = o; }
          },
        'accidental' : {
              enumerable: true,
              configurable: true,
              get: function () { return this._accidental; },
              set: function (a) { 
                  if (typeof(a) != 'object') {
                      a = new music21.pitch.Accidental(a);
                  }
                  this._accidental = a; 
              }
            },          
        'name': {
            enumerable: true,
            configurable: true,
            get: function () {
                if (this.accidental == undefined) {
                    return this.step;
                } else {
                    return this.step + this.accidental.modifier;
                }
            },
            set: function(nn) {
                this.step = nn.slice(0,1).toUpperCase();
                var tempAccidental = nn.slice(1);
                if (tempAccidental != undefined) {
                    this.accidental = tempAccidental; // converts automatically
                } else {
                    this.accidental = undefined;
                }
            }
        },
        'nameWithOctave': {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.name + this.octave.toString();
            },
            set: function (pn) {
                var storedOctave = pn.match(/\d+/);
                if (storedOctave != undefined) {
                    pn = pn.replace(/\d+/, "");
                    this.octave = parseInt(storedOctave);
                    this.name = pn;
                } else {
                    this.name = pn;
                }
            },
        },
        /**
         * @type Int;
         * @instance
         * @memberof module:music21/pitch~pitch.Pitch
         */
        'diatonicNoteNum': { 
            enumerable: true,
            configurable: true,
            get: function () { 
                return (this.octave * 7) + pitch.nameToSteps[this.step] + 1;
            },
            set: function (newDNN) {
                newDNN = newDNN - 1; // makes math easier
                this.octave = Math.floor(newDNN / 7);
                this.step = pitch.stepsToName[newDNN % 7];
            }
        },          
        'midi': { 
            enumerable: true,
            configurable: true,
            get: function () { 
                return this.ps;
            }
        },
        'ps': {
            enumerable: true,
            configurable: true,
            get: function () {
                var accidentalAlter = 0;
                if (this.accidental != undefined) {
                    accidentalAlter = parseInt(this.accidental.alter);
                }
                return (this.octave + 1) * 12 + pitch.nameToMidi[this.step] + accidentalAlter;
            },
            set: function (ps) {
                this.name = pitch.midiToName[ps % 12];
                this.octave = Math.floor(ps / 12) - 1;
            }
        }
    });

    /**
     * 
     * @param {clef.Clef} clefObj
     * @returns {String}
     */
    pitch.Pitch.prototype.vexflowName = function (clefObj) {
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
        if (this.accidental != undefined) {
            accidentalType = this.accidental.vexflowModifier;
        }
        var outName = tempPitch.step + accidentalType + '/' + tempPitch.octave;
        return outName;
    };
	
	
	pitch.tests = function () {
	    test( "music21.pitch.Accidental", function () {
	        var a = new music21.pitch.Accidental("-");
	        equal(a.alter, -1.0, "flat alter passed");
	        equal(a.name, 'flat', "flat name passed");
	    });

	    test( "music21.pitch.Pitch", function() {
	        var p = new music21.pitch.Pitch("D#5");
	        equal ( p.name, "D#", "Pitch Name set to D#");
	        equal ( p.step, "D",  "Pitch Step set to D");
	        equal ( p.octave, 5, "Pitch octave set to 5");
	        var c = new music21.clef.AltoClef();
	        var vfn = p.vexflowName(c);
	        equal ( vfn, 'C#/6', 'Vexflow name set');
	    });
  
	};
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.pitch = pitch;
	}
	return pitch;	
});



