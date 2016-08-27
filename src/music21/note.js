/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/note -- Note, Rest, NotRest, GeneralNote
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
import { Vex } from 'vexflow';

import { prebase } from './prebase';
import { base } from './base';
import { pitch } from './pitch';
import { beam } from './beam';
import { common } from './common';

        /**
         * Module for note classes. See the namespace {@link music21.note}
         * 
         * @requires music21/common
         * @requires music21/prebase
         * @requires music21/base
         * @requires music21/pitch
         * @requires music21/beam
         * @exports music21/note
         */  
    /**
     * Namespace for notes (single pitch) or rests, and some things like Lyrics that go on notes.
     * 
     * @namespace music21.note
     * @memberof music21
     * @property {Array} noteheadTypeNames - an Array of allowable notehead names.
     * @property {Array} stemDirectionNames - an Array of allowable stemDirection names.
     */
export var note = {};

	note.noteheadTypeNames = [
          'arrow down',
          'arrow up',
          'back slashed',
          'circle dot',
          'circle-x',
          'cluster',
          'cross',
          'diamond',
          'do',
          'fa',
          'inverted triangle',
          'la',
          'left triangle',
          'mi',
          'none',
          'normal',
          're',
          'rectangle',
          'slash',
          'slashed',
          'so',
          'square',
          'ti',
          'triangle',
          'x',
          ];
	
	note.stemDirectionNames = [
	                           'double',
	                           'down',
	                           'noStem',
	                           'none',
	                           'unspecified',
	                           'up',
	                           ];

    /**
     * Class for a single Lyric attached to a {@link music21.note.GeneralNote}
     * 
     * @class Lyric
     * @memberOf music21.note
     * @extends music21.prebase.ProtoM21Object
     * @param {string} text - the text of the lyric
     * @param {number} number=1 - the lyric number
     * @param {string} syllabic=undefined - placement of the syllable ('begin', 'middle', 'end', 'single'); undefined = interpret from text
     * @param {boolean} applyRaw=false - true = display the text exactly as it is or, false = use "-" etc. to determine syllabic
     * @param {string} identifier=undefined - identifier for the lyric.
     * @property {string} lyricConnector='-' - what to place between two lyrics that are syllabic.
     * @property {string} text - the text of the lyric syllable.
     * @property {string} syllabic - see above
     * @property {boolean} applyRaw - see above
     * @property {string} identifier - see above; gets .number if undefined
     * @property {number} number - see above
     * @property {string} rawText - text + any connectors
     */  
	note.Lyric = function(text, number, syllabic, applyRaw, identifier) {
	    prebase.ProtoM21Object.call(this);
	    this.classes.push('Lyric');
        this.lyricConnector = "-"; // override to place something else between two notes...
	    this.text = text;
	    this._number = number || 1;
	    this.syllabic = syllabic;
	    this.applyRaw = applyRaw || false;
        this.setTextAndSyllabic(this.text, this.applyRaw);
	    this._identifier = identifier;
	    
        Object.defineProperties(this, {
            'identifier': {
                get: function() {return this._identifier || this._number;},
                set: function(i) { this._identifier = i;},
                enumerable: true,
            },
            'number': { 
                get: function() { return this._number; },
                set: function(n) { this._number = n; },
                enumerable: true,
                // a property just to match m21p
            },
            'rawText': {
                get: function() {
                    if (this.syllabic == 'begin') {
                        return this.text + this.lyricConnector;
                    } else if (this.syllabic == 'middle') {
                        return this.lyricConnector + this.text + this.lyricConnector;
                    } else if (this.syllabic == 'end') {
                        return this.lyricConnector + this.text;
                    } else {
                        return this.text;
                    }
                },
                set: function(t) {
                    this.setTextAndSyllabic(t, false);
                },
                enumerable: true,
            }
        });
	};
    note.Lyric.prototype = new prebase.ProtoM21Object();
    note.Lyric.prototype.constructor = note.Lyric;

    note.Lyric.prototype.setTextAndSyllabic = function (rawText, applyRaw) {
        if (rawText === undefined) {
            this.text = undefined;
            return undefined;
        }
        if (!applyRaw && (rawText.indexOf(this.lyricConnector) === 0) && (rawText.slice(-1) == this.lyricConnector)) {
            this.text = rawText.slice(1,-1);
            this.syllabic = 'middle';
        } else if (!applyRaw && (rawText.indexOf(this.lyricConnector) === 0)) {
            this.text = rawText.slice(1);
            this.syllabic = 'end';
        } else if (!applyRaw && (rawText.slice(-1) == this.lyricConnector)) {
            this.text = rawText.slice(0, -1);
            this.syllabic = 'begin';
        } else {
            this.text = rawText;
            if (this.syllabic === undefined) {
                this.syllabic = 'single';
            }
        }
    };
    
	/* Notes and rests etc... */

	/**
	 * Superclass for all Note values
	 * 
	 * @class GeneralNote
	 * @memberof music21.note
	 * @extends music21.base.Music21Object
     * @param {(number|undefined)} [ql=1.0] - quarterLength of the note
     * @property {boolean} [isChord=false] - is this a chord
     * @property {number} quarterLength - shortcut to `.duration.quarterLength`
     * @property {object} activeVexflowNote - most recent Vex.Flow.StaveNote object to be made from this note (could change); default, undefined
     * @property {Array<music21.expressions.Expression>} expressions - array of attached expressions
     * @property {Array<music21.articulations.Articulation>} articulations - array of attached articulations
     * @property {string} lyric - the text of the first {@link music21.note.Lyric} object; can also set one.
     * @property {Array<music21.note.Lyric>} lyrics - array of attached lyrics
     * @property {number} [volume=60] - how loud is this note, 0-127, before articulations
     * @property {number} midiVolume - how loud is this note, taking into account articulations
     * @property {music21.note.Tie|undefined} [tie=undefined] - a tie object
  	 */
	note.GeneralNote = function (ql) {
		base.Music21Object.call(this);
		this.classes.push('GeneralNote');
		this.isChord = false;
        if (ql !== undefined) {
            this.duration.quarterLength = ql;
        }
        this.volume = 60;
	    this.activeVexflowNote = undefined;
        this.expressions = [];
        this.articulations = [];
        this.lyrics = [];
        this.tie = undefined;
        
        /* TODO: editorial objects, color, addLyric, insertLyric, hasLyrics */
		/* Later: augmentOrDiminish, getGrace, */
        
        Object.defineProperties(this, {
            'quarterLength': {
                get: function() {return this.duration.quarterLength;},
                set: function(ql) { this.duration.quarterLength = ql;},
                enumerable: true,
            },
            'lyric': {
                get: function() {
                    if (this.lyrics.length > 0) {
                        return this.lyrics[0].text;                        
                    } else {
                        return undefined;
                    }
                },
                set: function(value) {
                    this.lyrics = [];
                    if (value !== undefined && value !== false) {
                        this.lyrics.push( new note.Lyric(value) );
                    }
                },
                enumerable: true,
            },
            'midiVolume': {
                enumerable: true,
                get: function() {
                    var volume = this.volume;
                    if (volume === undefined) { volume = 60; }
                    if (this.articulations !== undefined) {
                        this.articulations.forEach( function (a) { 
                           volume *= a.dynamicScale;
                           if (volume > 127) { volume = 127; }
                           else if (isNaN(volume)) { volume = 60; }
                        });
                    }
                    volume = Math.floor(volume);
                    return volume; 
                }
            }
            
        });
        
	};
	note.GeneralNote.prototype = new base.Music21Object();
	note.GeneralNote.prototype.constructor = note.GeneralNote;
	
	/**
	 * Add a {@link music21.note.Lyric} object to the Note
	 * 
     * @memberof music21.note.GeneralNote
	 * @param {string} text - text to be added
	 * @param {number} [lyricNumber] - integer specifying lyric (defaults to the current `.lyrics.length` + 1)
	 * @param {boolean} [applyRaw=false] - if `true`, do not parse the text for cluses about syllable placement.
	 * @param {string} [lyricIdentifier] - an optional identifier
	 */
	note.GeneralNote.prototype.addLyric = function(text,
	        lyricNumber, applyRaw, lyricIdentifier) {
	    applyRaw = applyRaw || false;
	    if (lyricNumber === undefined) {
	        maxLyrics = this.lyrics.length + 1;
	        this.lyrics.push( new note.Lyric(text,
	            maxLyrics, undefined, applyRaw, lyricIdentifier));
	    } else {
	        foundLyric = false;
	        for (var i = 0; i < self.lyrics.length; i++) {
	            thisLyric = self.lyrics[i];
	            if (thisLyric.number == lyricNumber) {
	                thisLyric.text = text;
	                foundLyric = true;
	                break;
	            }
	        }
	        if (foundLyric  === false) {
	            this.lyrics.push( new note.Lyric(text, lyricNumber, undefined, applyRaw, lyricIdentifier));
	        }
	    }
	};
	/**
	 * Change stem direction according to clef. Does nothing for GeneralNote; overridden in subclasses.
	 * 
     * @memberof music21.note.GeneralNote
	 * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
	 * @returns {undefined}
	 */
	note.GeneralNote.prototype.setStemDirectionFromClef = function (clef) {
	    return undefined;
	};
    /**
     * Sets the vexflow accidentals (if any), the dots, and the stem direction
     * 
     * @memberof music21.note.GeneralNote
     * @param {Vex.Flow.StaveNote} vfn - a Vex.Flow note
     */
    note.GeneralNote.prototype.vexflowAccidentalsAndDisplay = function (vfn, options) {
        if (this.duration.dots > 0) {
            for (var i = 0; i < this.duration.dots; i++) {
                vfn.addDotToAll();                
            }
        }
        
        if (this.activeSite !== undefined && this.activeSite.renderOptions.stemDirection !== undefined) {
            this.stemDirection = this.activeSite.renderOptions.stemDirection;
        } else if (this.stemDirection === undefined && options.clef !== undefined) {
            this.setStemDirectionFromClef(options.clef);
        }
        if (music21.debug) {
            console.log(this.stemDirection);
        }
        vfn.setStemDirection(this.stemDirection == 'down' ? 
                                Vex.Flow.StaveNote.STEM_DOWN : 
                                Vex.Flow.StaveNote.STEM_UP);
        if (this.stemDirection == 'noStem') {
            vfn.hasStem = function() { return false; }; // need to override... 
            //vfn.render_options.stem_height = 0;
        } else {
            // correct VexFlow stem length for notes far from the center line;
            var staveDNNSpacing = 5;
            if (options.stave) {
                staveDNNSpacing = Math.floor(options.stave.options.spacing_between_lines_px / 2);
            }
            if (options.clef !== undefined && this.pitch !== undefined) {
                var midLine = options.clef.lowestLine + 4;
                //console.log(midLine);
                var absDNNfromCenter = Math.abs(this.pitch.diatonicNoteNum - midLine);
                var absOverOctave = absDNNfromCenter - 7;
                //console.log(absOverOctave);
                if (absOverOctave > 0 && vfn.getStemLength !== undefined) {
                    var stemHeight = (absOverOctave * staveDNNSpacing) + vfn.getStemLength();
                    vfn.setStemLength(stemHeight);                      
                }
            }
        }
    };
    
    /**
     * Play the current element as a MIDI note.
     * 
     * @memberof music21.note.GeneralNote
     * @param {number} [tempo=120] - tempo in bpm
     * @param {(base.Music21Object)} [nextElement] - for determining the length to play in case of tied notes, etc.
     * @param {object} [options] - other options (currently just `{instrument: {@link music21.instrument.Instrument} }`)
     * @returns {Number} - delay time in milliseconds until the next element (may be ignored)
     */
    note.GeneralNote.prototype.playMidi = function (tempo, nextElement, options) {
        // returns the number of milliseconds to the next element in
        // case that can't be determined otherwise.
        if (tempo === undefined) {
            tempo = 120;
        }
        if (options === undefined) {
            var inst;
            if (this.activeSite !== undefined) {
                inst = this.activeSite.instrument;
            }
            options = { instrument: inst };
        }
        
        var volume = this.midiVolume;
        var channel = 0;
        if (options !== undefined && options.instrument !== undefined) {
            channel = options.instrument.midiChannel;
        } 
        
        
        var milliseconds = 60 * 1000 / tempo;
        var ql = this.duration.quarterLength;
        milliseconds = 60 * ql * 1000 / tempo;
        var midNum;
        if (this.isClassOrSubclass('Note')) { // Note, not rest
            midNum = this.pitch.midi;                         
            var stopTime = milliseconds/1000;
            if (nextElement !== undefined && nextElement.isClassOrSubclass('Note')) {
                if (nextElement.pitch.midi != this.pitch.midi) {
                    stopTime += 60 * 0.25 / tempo; // legato -- play 16th note longer
                } else if (this.tie !== undefined && (this.tie.type == 'start' || this.tie.type =='continue')) {
                    stopTime += 60 * nextElement.duration.quarterLength / tempo;
                    // this does not take into account 3 or more notes tied.
                    // TODO: look ahead at next nexts, etc.
                }
            } else if (nextElement === undefined) {
                // let last note ring an extra beat...
                stopTime += 60 * 1 / tempo;
            }
            //console.log(stopTime);
            //console.log(this.tie);
            if (this.tie === undefined || this.tie.type == 'start') {
            	//console.log(volume);
            	music21.MIDI.noteOn(channel, midNum, volume, 0);                              
                music21.MIDI.noteOff(channel, midNum, stopTime);
            }// else { console.log ('not going to play ', this.nameWithOctave); }
        } else if (this.isClassOrSubclass('Chord')) {
            // TODO: Tied Chords.
            for (var j = 0; j < this._notes.length; j++) {
                midNum = this._notes[j].pitch.midi;
                music21.MIDI.noteOn(channel, midNum, volume, 0);                      
                music21.MIDI.noteOff(channel, midNum, milliseconds/1000);                     
            }
        } // it's a note.Rest -- do nothing -- milliseconds takes care of it...
        
        return milliseconds;   
    };	
	/**
	 * Specifies that a GeneralNote is not a rest (Unpitched, Note, Chord).
	 * 
	 * @class NotRest
	 * @memberof music21.note
	 * @extends music21.note.GeneralNote
	 * @param {number} [ql=1.0] - length in quarter notes
     * @property {music21.beam.Beams} beams - a link to a beam object
     * @property {string} [notehead='normal'] - notehead type
     * @property {string} [noteheadFill='default'] - notehead fill
     * @property {string|undefined} [noteheadColor=undefined] - notehead color
     * @property {boolean} [noteheadParenthesis=false] - put a parenthesis around the notehead?
     * @property {string|undefined} [stemDirection=undefined] - One of ['up','down','noStem', undefined] -- 'double' not supported
	 */
	note.NotRest = function (ql) {
		note.GeneralNote.call(this, ql);
		this.classes.push('NotRest');
		this.notehead = 'normal';
	    this.noteheadFill = 'default';
        this.noteheadColor = undefined;
	    this.noteheadParenthesis = false;
	    this.volume = undefined; // not a real object yet.
	    this.beams = new beam.Beams();
	    /* TODO: this.duration.linkage -- need durationUnits */
	    this.stemDirection = undefined;
	};

	/* TODO: check stemDirection, notehead, noteheadFill, noteheadParentheses */
	note.NotRest.prototype = new note.GeneralNote();
	note.NotRest.prototype.constructor = note.NotRest;
	


	/* ------- Note ----------- */
    /**
     * A very, very important class! music21.note.Note objects combine a {@link music21.pitch.Pitch}
     * object to describe pitch (highness/lowness) with a {@link music21.duration.Duration} object
     * that defines length, with additional features for drawing the Note, playing it back, etc.
     * 
     * Together with {@link music21.stream.Stream} one of the two most important
     * classes in `music21`.
     * 
     * See {@link music21.note.NotRest}, {@link music21.note.GeneralNote}, {@link music21.base.Music21Object}
     * and {@link music21.prebase.ProtoM21Object} (or in general, the **extends** list below) for other
     * things you can do with a `Note` object.
     * 
     * Missing from music21p: `microtone, pitchClass, pitchClassString, transpose(), fullName`.
     * 
     * @class Note
     * @memberof music21.note
     * @extends music21.note.NotRest
     * @param {(string|music21.pitch.Pitch|undefined)} [nn='C4'] - pitch name ("C", "D#", "E-") w/ or w/o octave ("C#4"), or a pitch.Pitch object
     * @param {(number|undefined)} [ql=1.0] - length in quarter notes
     * @property {Boolean} [isNote=true] - is it a Note? Yes!
     * @property {Boolean} [isRest=false] - is it a Rest? No!
     * @property {music21.pitch.Pitch} pitch - the {@link music21.pitch.Pitch} associated with the Note.
     * @property {string} name - shortcut to `.pitch.name`
     * @property {string} nameWithOctave - shortcut to `.pitch.nameWithOctave`
     * @property {string} step - shortcut to `.pitch.step`
     * @property {number} octave - shortcut to `.pitch.octave`
     */
	note.Note = function (nn, ql) {
		note.NotRest.call(this, ql);
		this.classes.push('Note');
		this.isNote = true; // for speed
		this.isRest = false; // for speed
		if (nn !== undefined && nn.isClassOrSubclass !== undefined && nn.isClassOrSubclass('Pitch') === true) {
		    this.pitch = nn;
		} else {
	        this.pitch = new pitch.Pitch(nn);		    
		}
        Object.defineProperties(this, {
            'name': {
                get: function() {return this.pitch.name;},
                set: function(nn) { this.pitch.name = nn;},
                enumerable: true,
            },
            'nameWithOctave': {
                get: function() {return this.pitch.nameWithOctave;},
                set: function(nn) { this.pitch.nameWithOctave = nn;},
                enumerable: true,
            },
            'step': {
                get: function() {return this.pitch.step;},
                set: function(nn) { this.pitch.step = nn;},
                enumerable: true,
            },
            // no Frequency
            'octave': {
                get: function() {return this.pitch.octave;},
                set: function(nn) { this.pitch.octave = nn;},
                enumerable: true,
            },
        });
        
        /* TODO: transpose, fullName, microtone, pitchclass, pitchClassString */
        
	};

	note.Note.prototype = new note.NotRest();
	note.Note.prototype.constructor = note.Note;

    /**
     * Change stem direction according to clef.
     * 
     * @memberof music21.note.Note
     * @param {music21.clef.Clef} [clef] - clef to set the stem direction of.
     * @returns {music21.note.Note} Original object, for chaining methods
     */
    note.Note.prototype.setStemDirectionFromClef = function (clef) {
        if (clef === undefined) {
            return this;
        } else {
            var midLine = clef.lowestLine + 4;
            var DNNfromCenter = this.pitch.diatonicNoteNum - midLine;
            //console.log(DNNfromCenter, this.pitch.nameWithOctave);
            if (DNNfromCenter >= 0) { this.stemDirection = 'down'; }
            else { this.stemDirection = 'up'; }            
            return this;
        }
    };
    /**
     * Returns a `Vex.Flow.StaveNote` that approximates this note.
     * 
     * @memberof music21.note.Note
     * @param {object} [options={}] - `{clef: {@link music21.clef.Clef} }` clef to set the stem direction of.
     * @returns {Vex.Flow.StaveNote}
     */
    note.Note.prototype.vexflowNote = function (options) {
        var params = {
                
        };
        common.merge(params, options);
        var clef = params.clef;
        
        if (this.duration === undefined) {
            //console.log(this);
            return undefined;
        }
        var vfd = this.duration.vexflowDuration;
        if (vfd === undefined) {
            return undefined;
        }
        var vexflowKey = this.pitch.vexflowName(clef);
        var vfn = new Vex.Flow.StaveNote({
            keys: [vexflowKey], 
            duration: vfd,
        });
        this.vexflowAccidentalsAndDisplay(vfn, params); // clean up stuff...
        if (this.pitch.accidental !== undefined) {
            if (this.pitch.accidental.vexflowModifier != 'n' && this.pitch.accidental.displayStatus !== false) {
                vfn.addAccidental(0, new Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));
            } else if (this.pitch.accidental.displayType == 'always' || this.pitch.accidental.displayStatus === true) {
                vfn.addAccidental(0, new Vex.Flow.Accidental(this.pitch.accidental.vexflowModifier));           
            }
        }
        
        if (this.articulations[0] !== undefined) {
            for (var i = 0; i < this.articulations.length; i++ ) {
                var art = this.articulations[i];
                vfn.addArticulation(0, art.vexflow()); // 0 refers to the first pitch (for chords etc.)...
            }
        }
        if (this.expressions[0] !== undefined) {
            for (var j = 0; j < this.expressions.length; j++ ) {
                var exp = this.expressions[j];
                vfn.addArticulation(0, exp.vexflow()); // 0 refers to the first pitch (for chords etc.)...
            }
        }
        
        if (this.noteheadColor) {
            vfn.setKeyStyle(0, {fillStyle: this.noteheadColor});
        }

        this.activeVexflowNote = vfn;
        return vfn;
    };

    /* ------ TODO: Unpitched ------ */
	
	
	/* ------ Rest ------ */

	/**
	 * Represents a musical rest.
	 * 
	 * @class Rest
	 * @memberof music21.note
	 * @extends music21.note.GeneralNote
	 * @param {number} [ql=1.0] - length in number of quarterNotes
	 * @property {Boolean} [isNote=false]
	 * @property {Boolean} [isRest=true]
	 * @property {string} [name='rest']
	 * @property {number} [lineShift=undefined] - number of lines to shift up or down from default
	 */
	note.Rest = function (ql) {
		note.GeneralNote.call(this, ql);
		this.classes.push('Rest');
        this.isNote = false; // for speed
        this.isRest = true; // for speed		
		this.name = 'rest'; // for note compatibility
		this.lineShift = undefined;
	};

	note.Rest.prototype = new note.GeneralNote();
	note.Rest.prototype.constructor = note.Rest;
	
    /**
     * Returns a `Vex.Flow.StaveNote` that approximates this rest.
     * Corrects for bug in VexFlow that renders a whole rest too low.
     * 
     * @memberof music21.note.Rest
     * @returns {Vex.Flow.StaveNote}
     */
	note.Rest.prototype.vexflowNote = function () {
        var keyLine = 'b/4';
        if (this.duration.type == 'whole') {
            if (this.activeSite !== undefined && this.activeSite.renderOptions.staffLines != 1) {
                keyLine = 'd/5';                
            }
        }
        if (this.lineShift !== undefined) {
            var p = new music21.pitch.Pitch('B4');
            var ls = this.lineShift;
            if (this.duration.type == 'whole') {
                ls += 2;
            }
            p.diatonicNoteNum += ls;
            keyLine = p.vexflowName(undefined);            
        }

        var vfn = new Vex.Flow.StaveNote({keys: [keyLine], 
                                        duration: this.duration.vexflowDuration + 'r'});
        if (this.duration.dots > 0) {
            for (var i = 0; i < this.duration.dots; i++) {
                vfn.addDotToAll();                
            }
        }
        this.activeVexflowNote = vfn;
        return vfn;
    };
    /* ------ SpacerRest ------ */
	
	
	note.tests = function () {
	    test( "music21.note.Note", function() {
	        var n = new note.Note("D#5");
	        equal ( n.pitch.name, "D#", "Pitch Name set to D#");
	        equal ( n.pitch.step, "D",  "Pitch Step set to D");
	        equal ( n.pitch.octave, 5, "Pitch octave set to 5");
	    });
	};
	
