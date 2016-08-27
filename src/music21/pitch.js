/**
 * music21j -- Javascript reimplementation of Core music21 features.  
 * music21/pitch -- pitch routines
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
import { prebase } from './prebase';
        /**
         * pitch module.  See {@link music21.pitch} namespace
         * 
         * @exports music21/pitch
         */
    /** 
     * Pitch related objects and methods
     * 
     * @namespace music21.pitch 
     * @memberof music21 
     * @requires music21/prebase
     */
export    var pitch = {};
	/**
	 * @class Accidental
	 * @memberof music21.pitch
	 * @param {string|number} accName - an accidental name
	 * @extends music21.prebase.ProtoM21Object
	 */
	pitch.Accidental = function (accName) {
	    prebase.ProtoM21Object.call(this);
	    this.classes.push('Accidental');
		this._name = "";
		this._alter = 0.0;
		this._modifier = "";
		this._unicodeModifier = "";
		this.displayType = "normal"; // "normal", "always" supported currently
		this.displayStatus = undefined; // true, false, undefined
		this.set(accName);
	};
    pitch.Accidental.prototype = new prebase.ProtoM21Object();
    pitch.Accidental.prototype.constructor = pitch.Accidental;
    /**
     * Sets a parameter of the accidental and updates name, alter, and modifier to suit.
     * 
     * @memberof music21.pitch.Accidental
     * @param {number|string} accName - the name, number, or modifier to set
     * @returns {undefined}
     */
    pitch.Accidental.prototype.set = function (accName) {
        if ((accName != undefined) && (accName.toLowerCase != undefined)) {
            accName = accName.toLowerCase();
        }
        if (accName == 'natural' || accName == 'n' || accName == 0 || accName == undefined) {
            this._name = 'natural';
            this._alter = 0.0;
            this._modifier = "";
            this._unicodeModifier = '♮';
        } else if (accName == 'sharp' || accName == '#' || accName == 1) {
            this._name = 'sharp';
            this._alter = 1.0;
            this._modifier = "#";
            this._unicodeModifier = '♯';
        } else if (accName == 'flat' || accName == '-' || accName == -1) {
            this._name = 'flat';
            this._alter = -1.0;
            this._modifier = "-";
            this._unicodeModifier = '♭';
        } else if (accName == 'double-flat' || accName == '--' || accName == -2) {
            this._name = 'double-flat';
            this._alter = -2.0;
            this._modifier = "--";
            this._unicodeModifier = '&#x1d12b;';
        } else if (accName == 'double-sharp' || accName == '##' || accName == 2) {
            this._name = 'double-sharp';
            this._alter = 2.0;
            this._modifier = "##";
            this._unicodeModifier = '&#x1d12a;';
        } else if (accName == 'triple-flat' || accName == '---' || accName == -3) {
            this._name = 'triple-flat';
            this._alter = -3.0;
            this._modifier = "---";
            this._unicodeModifier = '♭&#x1d12b;';
        } else if (accName == 'triple-sharp' || accName == '###' || accName == 3) {
            this._name = 'triple-sharp';
            this._alter = 3.0;
            this._modifier = "###";
            this._unicodeModifier = '&#x1d12a;';
        }
    };
    Object.defineProperties(pitch.Accidental.prototype, {
        /**
         * Return or set the name of the accidental ('flat', 'sharp', 'natural', etc.);
         * 
         * When set, updates alter and modifier.
         * 
         * @memberof music21.pitch.Accidental#
         * @var {string} name
         */
        'name' : {
          enumerable: true,
          configurable: true,
          get: function () { return this._name; },
          set: function (n) { this.set(n); },
        },
        /**
         * Return or set the alteration amount (-1.0 = flat; 1.0 = sharp; etc.)
         * 
         * When set, updates name and modifier.
         * 
         * @memberof music21.pitch.Accidental#
         * @var {number} alter
         */
        'alter' : {
            enumerable: true,
            configurable: true,
            get: function () { return this._alter; },
            set: function (n) { this.set(n); },
        },
        /**
         * Return or set the modifier ('-', '#', '')
         * 
         * When set, updates alter and name.

         * @memberof music21.pitch.Accidental#
         * @var {string} modifier
         */
        'modifier' : {
              enumerable: true,
              configurable: true,
              get: function () { return this._modifier; },
              set: function (n) { this.set(n); },
        },
        /**
         * Returns the modifier for vexflow ('b', '#', 'n')
         * 
         * @memberof music21.pitch.Accidental#
         * @var {string} vexflowModifier
         * @readonly
         */
        'vexflowModifier' : {
              enumerable: true,
              configurable: false,
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
        },
        /**
         * Returns the modifier in unicode or
         * for double and triple accidentals, as a hex escape
         * 
         * @memberof music21.pitch.Accidental#
         * @var {string} unicodeModifier
         * @readonly
         */
        'unicodeModifier' : {
              enumerable: true,
              configurable: false,
              get: function () { 
                  return this._unicodeModifier;
              },
        }
          
    });     	
	
	pitch.nameToMidi = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
	pitch.nameToSteps = {'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6};
	pitch.stepsToName = ['C','D','E','F','G','A','B'];
	pitch.midiToName = ['C','C#','D','E-','E','F','F#','G','A-','A','B-','B'];
	
    /**
     * Pitch objects are found in {@link music21.note.Note} objects, and many other places.
     * 
     * They do not have a {@link music21.duration.Duration} associated with them, so they
     * cannot be placed inside {@link music21.stream.Stream} objects.
     * 
     * Valid pitch name formats are 
     * - "C", "D', etc. ("B" = American B; "H" is not allowed)
     * - "C#", "C-" (C-flat; do not use "b" for flat), "C##", "C###", "C--" etc.
     * - Octave may be specified after the name + accidental: "C#4" etc.
     * - Octave can be arbitrarily high ("C10") but only as low as "C0" because "C-1" would be interpreted as C-flat octave 1; shift octave later for very low notes.
     * - If octave is not specified, the system will usually use octave 4, but might adjust according to context. If you do not like this behavior, give an octave always.
     * - Microtones are not supported in music21j (they are in music21p)
     * 
     * @class Pitch
     * @memberof music21.pitch
	 * @param {string} pn - name of the pitch, with or without octave, see above.
     * @extends music21.prebase.ProtoM21Object
     * @property {music21.pitch.Accidental|undefined} accidental - link to an accidental
     * @property {number} diatonicNoteNum - diatonic number of the pitch, where 29 = C4, C#4, C-4, etc.; 30 = D-4, D4, D#4, etc. updates other properties.
     * @property {number} midi - midi number of the pitch (C4 = 60); readonly. See {@link music21.pitch.Pitch#ps} for setable version.
     * @property {string} name - letter name of pitch + accidental modifier; e.g., B-flat = 'B-'; changes automatically w/ step and accidental
     * @property {string} nameWithOctave - letter name of pitch + accidental modifier + octave; changes automatically w/ step, accidental, and octave
     * @property {number} octave - number for the octave, where middle C = C4, and octaves change between B and C; default 4
     * @property {number} ps - pitch space number, like midi number but floating point and w/ no restriction on range. C4 = 60.0
     * @property {string} step - letter name for the pitch (C-G, A, B), without accidental; default 'C'
	 */
	pitch.Pitch = function (pn) {
	    prebase.ProtoM21Object.call(this);
	    this.classes.push('Pitch');
	    if (pn == undefined) {
	    	pn = "C";
	    }
	    this._step = 'C';
	    this._octave = 4;
	    this._accidental = undefined;
	    
	    /* pn can be a nameWithOctave */
	    if (typeof pn == "number") {
	        if (pn < 12) {
	            pn += 60; // pitchClass
	        }
	        this.ps = pn;
	    } else if (pn.match(/\d+/)) {
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
                  if (typeof(a) != 'object' && a !== undefined) {
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
        'frequency': {
            enumerable: true,
            configurable: true,
            get: function () { 
                return 440 * Math.pow(2,(this.ps - 69)/12);
            }            
        },
        'midi': { 
            enumerable: true,
            configurable: true,
            get: function () { 
                return Math.floor(this.ps);
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
     * Returns the vexflow name for the pitch in the given clef.
     * 
     * @memberof music21.pitch.Pitch#
     * @param {clef.Clef} clefObj - the active {@link music21.clef.Clef} object 
     * @returns {String} - representation in vexflow
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
