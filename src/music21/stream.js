/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/stream -- Streams -- objects that hold other Music21Objects
 * 
 * Does not implement the full features of music21p Streams by a long shot...
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define(['./base','./renderOptions','./clef', './vfShow', './duration', 
        './common', './meter', './pitch', './streamInteraction', 'jquery'], 
        /**
         * powerful stream module, See {@link music21.stream} namespace
         * @exports music21/stream
         */
        function(base, renderOptions, clef, vfShow, duration, 
                 common, meter, pitch, streamInteraction, $) {   
    /**
     * Streams are powerful music21 objects that hold Music21Object collections,
     * such as {@link music21.note.Note} or {@link music21.chord.Chord} objects.
     * 
     * Understanding the {@link music21.stream.Stream} object is of fundamental
     * importance for using music21.  Definitely read the music21(python) tutorial
     * on using Streams before proceeding
     * 
     * @namespace music21.stream
     * @memberof music21
     * @requires music21/base
     * @requires music21/renderOptions
     * @requires music21/clef
     * @requires music21/vfShow
     * @requires music21/duration
     * @requires music21/common
     * @requires music21/meter
     * @requires music21/pitch
     * @requires music21/streamInteraction
     * @requires jquery
     */
    var stream = {};
	
    /**
     * A generic Stream class -- a holder for other music21 objects
     * Will be subclassed into {@link music21.stream.Score},
     * {@link music21.stream.Part},
     * {@link music21.stream.Measure},
     * {@link music21.stream.Voice}, but most functions will be found here.
     * 
     * @class Stream
     * @memberof music21.stream
     * @extends music21.base.Music21Object
     * 
     * @property {Array<music21.base.Music21Object>} elements - the elements in the stream. DO NOT MODIFY individual components (consider it like a Python tuple)
     * @property {Int} length - (readonly) the number of elements in the stream.
     * @property {music21.duration.Duration} duration - the total duration of the stream's elements
     * @property {music21.clef.Clef} clef - the clef for the Stream (if there is one; if there are multiple, then the first clef)
     * @property {music21.meter.TimeSignature} timeSignature - the first TimeSignature of the Stream
     * @property {music21.key.KeySignature} keySignature - the first KeySignature for the Stream
     * @property {music21.renderOptions.RenderOptions} renderOptions - an object specifying how to render the stream
     * @property {music21.stream.Stream} flat - (readonly) a flattened representation of the Stream
     * @property {music21.stream.Stream} notes - (readonly) the stream with only {@link music21.note.Note} and {@link music21.chord.Chord} objects included
     * @property {music21.stream.Stream} notesAndRests - (readonly) like notes but also with {@link music21.note.Rest} objects included
     * @property {music21.stream.Stream} parts - (readonly) a filter on the Stream to just get the parts (NON-recursive)
     * @property {music21.stream.Stream} measures - (readonly) a filter on the Stream to just get the measures (NON-recursive)
     * @property {number} tempo - tempo in beats per minute (will become more sophisticated later, but for now the whole stream has one tempo
     * @property {music21.instrument.Instrument|undefined} instrument - an instrument object associated with the stream (can be set with a string also, but will return an `Instrument` object)
     * @property {Boolean} autoBeam - whether the notes should be beamed automatically or not (will be moved to `renderOptions` soon)
     * @property {Int} [staffLines=5] - number of staff lines
     * @property {function|undefined} changedCallbackFunction - function to call when the Stream changes through a standard interface
     * @property {number} maxSystemWidth - confusing... should be in renderOptions
     */
	stream.Stream = function () {
		base.Music21Object.call(this);
		this.classes.push('Stream');
		this._duration = undefined;
		
	    this._elements = [];
	    this._elementOffsets = [];
	    this._clef = undefined;
	    this.displayClef = undefined;
	    
	    this._keySignature =  undefined; // a music21.key.KeySignature object
	    this._timeSignature = undefined; // a music21.meter.TimeSignature object
	    this._instrument = undefined;
	    
	    this._autoBeam = undefined;
	    this.activeVFStave = undefined;
	    this.renderOptions = new renderOptions.RenderOptions();
	    this._tempo = undefined;

        this.staffLines = 5;

	    this._stopPlaying = false;
	    this._allowMultipleSimultaneousPlays = true; // not implemented yet.
        this.changedCallbackFunction = undefined; // for editable canvases

	    Object.defineProperties(this, {
            'duration': {
                configurable: true,
                enumerable: true,
                get: function () {
                    if (this._duration !== undefined) {
                        return this._duration;
                    }
                    var highestTime = 0.0;
                    for (var i = 0; i < this.length; i++) {
                        var el = this.get(i);
                        var endTime = el.offset;
                        if (el.duration !== undefined) {
                            endTime += el.duration.quarterLength;                            
                        } 
                        if (endTime > highestTime) {
                            highestTime = endTime;
                        }
                    }
                    return new duration.Duration(highestTime);
                },
                set: function(newDuration) {
                    this._duration = newDuration;
                }
            },
	        'flat': {
                configurable: true,
                enumerable: true,
	    		get: function () {
	    			if (this.hasSubStreams()) {
	        			var tempEls = [];
	        			for (var i = 0; i < this.length; i++) {
	        				var el = this.get(i);
	        				//console.log(i, this.length);
	        				if (el.elements !== undefined) {
	                            var offsetShift = el.offset;
	                            //console.log('offsetShift', offsetShift, el.classes[el.classes.length -1]);
	                            var elFlat = el.flat;
	                            for (var j = 0; j < elFlat.length; j++) {
	                                // offset should NOT be null because already in Stream
	                                elFlat.get(j).offset += offsetShift;
	                            }
	                            tempEls.push.apply(tempEls, elFlat._elements);
	        				} else {
	        				    tempEls.push(el);
	        				}	        				
	        			}
	                    var newSt = this.clone(false);
	                    newSt.elements = tempEls;
	        			return newSt;
	    			} else {
	    				return this;
	    			}
	    		},
	    	},
	    	'notes': {
                configurable: true,
                enumerable: true,
                get: function () { return this.getElementsByClass(['Note','Chord']); },
	    	},
            'notesAndRests': {
                configurable: true,
                enumerable: true,
                get: function () { return this.getElementsByClass('GeneralNote'); },
            },

	    	'tempo': {
                configurable: true,
                enumerable: true,
				get: function () {
					if (this._tempo == undefined && this.activeSite != undefined) {
						return this.activeSite.tempo;
					} else if (this._tempo == undefined) {
						return 150;
					} else {
						return this._tempo;
					}
				},
				set: function (newTempo) {
					this._tempo = newTempo;
				}
			},
            'instrument': {
                configurable: true,
                enumerable: true,
                get: function () {
                    if (this._instrument == undefined && this.activeSite != undefined) {
                        return this.activeSite.instrument;
                    } else {
                        return this._instrument;
                    }
                },
                set: function (newInstrument) {
                    if (typeof newInstrument == 'string') {
                        newInstrument = new music21.instrument.Instrument(newInstrument);
                    }
                    this._instrument = newInstrument;
                }
            },
			'clef': {
                configurable: true,
                enumerable: true,
				get: function () {
					if (this._clef == undefined && this.activeSite == undefined) {
						return new clef.Clef('treble');
					} else if (this._clef == undefined) {
						return this.activeSite.clef;
					} else {
						return this._clef;
					}
				},
				set: function (newClef) {
					this._clef = newClef;
				}
			},
			'keySignature': {
                configurable: true,
                enumerable: true,
				get: function () {
					if (this._keySignature == undefined && this.activeSite != undefined) {
						return this.activeSite.keySignature;
					} else {
						return this._keySignature;
					}
				},
				set: function (newKeySignature) {
					this._keySignature = newKeySignature;
				}
			},
			'timeSignature': {
                configurable: true,
                enumerable: true,
				get: function () {
					if (this._timeSignature == undefined && this.activeSite != undefined) {
						return this.activeSite.timeSignature;
					} else {
						return this._timeSignature;
					}
				},
				set: function (newTimeSignature) {
					if (typeof(newTimeSignature) == 'string') {
					    newTimeSignature = new meter.TimeSignature(newTimeSignature);
					}
				    this._timeSignature = newTimeSignature;
				}
			},
            'autoBeam': {
                configurable: true,
                enumerable: true,
                get: function () {
                    if (this._autoBeam === undefined && this.activeSite != undefined) {
                        return this.activeSite.autoBeam;
                    } else if (this._autoBeam !== undefined) {
                        return this._autoBeam;
                    } else {
                        return true; // default...
                    }
                },
                set: function (ab) {
                    this._autoBeam = ab;
                }
            },
			'maxSystemWidth': {
                configurable: true,
                enumerable: true,
				get: function () {
				    var baseMaxSystemWidth = 750;
					if (this.renderOptions.maxSystemWidth == undefined && this.activeSite != undefined) {
					    baseMaxSystemWidth = this.activeSite.maxSystemWidth;
					} else if (this.renderOptions.maxSystemWidth != undefined) {
					    baseMaxSystemWidth = this.renderOptions.maxSystemWidth;
					}
					return baseMaxSystemWidth / this.renderOptions.scaleFactor.x;
				},
				set: function (newSW) {
					this.renderOptions.maxSystemWidth = newSW * this.renderOptions.scaleFactor.x;
				}
			},
			'parts': {
                configurable: true,
                enumerable: true,
				get: function() {
					var parts = [];
					for (var i = 0; i < this.length; i++) {
					    var el = this.get(i);
						if (el.isClassOrSubclass('Part')) {
							parts.push(el);
						}
					}
					return parts;
				}
			},
			'measures': {
                configurable: true,
                enumerable: true,
                /* TODO -- make it return a Stream.Part and not list. to match music21p
                 * but okay for now */
				get: function() {
					var measures = [];
					for (var i = 0; i < this.length; i++) {
						var el = this.get(i);
					    if (el.isClassOrSubclass('Measure')) {
							measures.push(el);
						}
					}
					return measures;
				}
			},
			'length': {
                configurable: true,
                enumerable: true,
				get: function() {
					return this._elements.length;
				}
			},
			'elements': {
                configurable: true,
                enumerable: true,
				get: function() {
					return this._elements;
				},
				set: function(newElements) {
//				    this._elements = newElements;
//				    
				    var highestOffsetSoFar = 0.0;
				    this._elements = [];
				    this._elementOffsets = [];
				    var tempInsert = [];
				    for (var i = 0; i < newElements.length; i++) {
				        var thisEl = newElements[i];
				        var thisElOffset = thisEl.offset;
				        if (thisElOffset == null || thisElOffset == highestOffsetSoFar) {
				            // append
				            this._elements.push(thisEl);
				            thisEl.offset = highestOffsetSoFar;
				            this._elementOffsets.push(highestOffsetSoFar);
				            if (thisEl.duration === undefined) {
				                console.error("No duration for ", thisEl, " in ", this);
				            }
				            highestOffsetSoFar += thisEl.duration.quarterLength;
				        } else { // append -- slow
				            tempInsert.push(thisEl);
				        }
				    }
				    //console.warn('end', highestOffsetSoFar, tempInsert);
				    for (var i = 0; i < tempInsert.length; i++ ) {
				        var thisEl = tempInsert[i];
				        this.insert(thisEl.offset, thisEl);
				    }
				}
			}
	    });
	    
	    /**
	     * A function bound to the current stream that
	     * will changes the stream. Used in editableAccidentalCanvas, among other places.
	     * 
	     *      var can = s.appendNewCanvas();
	     *      $(can).on('click', s.canvasChangerFunction);
	     * 
	     * @memberof music21.stream.Stream
	     * @param {Event} e
	     * @returns {music21.base.Music21Object|undefined} - returns whatever changedCallbackFunction does.
	     */
	    this.canvasChangerFunction = (function (e) {
	        var canvasElement = e.currentTarget;
	        var _ = this.findNoteForClick(canvasElement, e),
	             clickedDiatonicNoteNum = _[0],
	             foundNote = _[1];
	        if (foundNote === undefined) {
	            if (music21.debug) {
	                console.log('No note found');           
	            }
	            return undefined;
	        }
	        return this.noteChanged(clickedDiatonicNoteNum, foundNote, canvasElement);
	    }).bind(this);

	};

	stream.Stream.prototype = new base.Music21Object();
	stream.Stream.prototype.constructor = stream.Stream;

    /* override protoM21Object.clone() */
    stream.Stream.prototype.clone = function(deep) {
        var ret = Object.create(this.constructor.prototype);
        for(var key in ret){ 
            // not that we ONLY copy the keys in Ret -- it's easier that way.
            // maybe we should do (var key in this) -- but DANGEROUS...
            if (this.hasOwnProperty(key) == false) {
                continue;
            }
            if (key == 'activeSite') {
                ret[key] = this[key];
            } else if (key == 'renderOptions') {
                ret[key] = common.merge({}, this[key]);
            } else if (deep != true && (key == '_elements' || key == '_elementOffsets')) {
                ret[key] = this[key].slice(); // shallow copy...
            } else if (deep && (key == '_elements' || key == '_elementOffsets')) {
                if (key == '_elements') {
                    //console.log('got elements for deepcopy');
                    ret['_elements'] = [];
                    ret['_elementOffsets'] = [];
                    for (var j = 0; j < this['_elements'].length; j++ ) {
                        ret['_elementOffsets'][j] = this['_elementOffsets'][j];
                        var el = this['_elements'][j];
                        //console.log('cloning el: ', el.name);
                        var elCopy = el.clone(deep);
                        elCopy.activeSite = ret;
                        ret['_elements'][j] = elCopy;
                    }
                }
            
            } else if (key == 'activeVexflowNote' || key == 'storedVexflowstave') {
                // do nothing -- do not copy vexflowNotes -- permanent recursion
            } else if (
                    Object.getOwnPropertyDescriptor(this, key).get !== undefined ||
                    Object.getOwnPropertyDescriptor(this, key).set !== undefined
                    ) {
                // do nothing
            } else if (typeof(this[key]) == 'function') {
                // do nothing -- events might not be copied.
            } else if (this[key] != null && this[key].isMusic21Object == true) {
                //console.log('cloning...', key);
                ret[key] = this[key].clone(deep);
            } else {
                ret[key] = this[key];
            }
        }
        return ret;  
    };
	
    /**
     * Add an element to the end of the stream, setting its `.offset` accordingly
     * 
     * @memberof music21.stream.Stream
     * @param {music21.base.Music21Object} el - element to append
     * @returns {this}
     */
	stream.Stream.prototype.append = function (el) {
        try {
            if ((el.isClassOrSubclass !== undefined) && el.isClassOrSubclass('NotRest')) {
                // set stem direction on output...;         
            }
            var elOffset = 0.0;
            if (this._elements.length > 0) {
                var lastQL = this._elements[this._elements.length - 1].duration.quarterLength;
                elOffset = this._elementOffsets[this._elementOffsets.length - 1] + lastQL;
            }
            this._elementOffsets.push(elOffset);
            this._elements.push(el);
            el.offset = elOffset;
            el.activeSite = this; // would prefer weakref, but does not exist in JS.
        } catch (err) {
            console.error("Cannot append element ", el, " to stream ", this, " : ", err);
        }
        return this;

    };

    /**
     * Add an element to the specified place in the stream, setting its `.offset` accordingly
     * 
     * @memberof music21.stream.Stream
     * @param {number} offset - offset to place.
     * @param {music21.base.Music21Object} el - element to append
     * @returns {this}
     */
    stream.Stream.prototype.insert = function (offset, el) {
        try {
            if ((el.isClassOrSubclass !== undefined) && el.isClassOrSubclass('NotRest')) {
                // set stem direction on output
                // this.clef.setStemDirection(el);         
            }
            for (var i = 0; i < this._elements.length; i++) {
                var testOffset = this._elementOffsets[i];
                if (testOffset <= offset) {
                    continue;
                } else {
                    this._elementOffsets.splice(i, 0, offset);
                    this._elements.splice(i, 0, el);
                    el.offset = offset;
                    el.activeSite = this;
                    return;
                }
            }
            // no element found. insert at end;
            this._elementOffsets.push(offset);
            this._elements.push(el);
            el.offset = offset;
            el.activeSite = this; // would prefer weakref, but does not exist in JS.
        } catch (err) {
            console.error("Cannot insert element ", el, " to stream ", this, " : ", err);
        }
        return this;
    };
    
    /**
     * Remove and return the last element in the stream, or return undefined if the stream is empty
     * 
     * @memberof music21.stream.Stream
     * @returns {music21.base.Music21Object|undefined} last element in the stream
     */
    stream.Stream.prototype.pop = function () {
        //remove last element;
        if (this.length > 0) {
            var el = this.get(-1);
            this._elementOffsets.pop();
            this._elements.pop();
            return el;            
        } else {
            return undefined;
        }
    };
    
    /**
     * Get the `index`th element from the Stream.  Equivalent to the
     * music21p format of s[index].  Can use negative indexing to get from the end.
     * 
     * @memberof music21.stream.Stream
     * @param {Int} index - can be -1, -2, to index from the end, like python
     * @returns {music21.base.Music21Object|undefined}
     */
    stream.Stream.prototype.get = function (index) {
        // substitute for Python stream __getitem__; supports -1 indexing, etc.
        if (index === undefined) { 
            return undefined;
        } else if (Math.abs(index) > this._elements.length) {
            return undefined;
        } else if (index == this._elements.length) {
            return undefined;
        } else if (index < 0) {
            var el = this._elements[this._elements.length + index];
            el.offset = this._elementOffsets[this._elements.length + index];
            return el;
        } else {
            var el = this._elements[index];
            el.offset = this._elementOffsets[index];
            return el;
        }  
    };
    /*  --- ############# END ELEMENT FUNCTIONS ########## --- */
    
    /**
     * Returns Boolean about whether this stream contains any other streams.
     * 
     * @memberof music21.stream.Stream
     * @returns {Boolean}
     */
    stream.Stream.prototype.hasSubStreams = function () {
        var hasSubStreams = false;
        for (var i = 0; i < this.length; i++) {
            var el = this.elements[i];
            if (el.isClassOrSubclass('Stream')) {
                hasSubStreams = true;
                break;
            }
        }
        return hasSubStreams;
    };
    
    /**
     * Returns true if any note in the stream has lyrics, otherwise false
     * 
     * @memberof music21.stream.Stream
     * @returns {Boolean}
     */
    stream.Stream.prototype.hasLyrics = function () {
        for (var i = 0; i < this.length; i++) {
            var el = this.elements[i];
            if (el.lyric !== undefined) {
                return true;
            }
        }        
        return false;
    };
    
    /**
     * Find all elements with a certain class; if an Array is given, then any
     * matching class will work.
     * 
     * @memberof music21.stream.Stream
     * @param {Array<string>|string} classList - a list of classes to find
     * @returns {music21.stream.Stream}
     */
    stream.Stream.prototype.getElementsByClass = function (classList) {
        var tempEls = [];
        for (var i = 0; i < this.length; i++ ) {
            var thisEl = this.get(i);
            //console.warn(thisEl);
            if (thisEl.isClassOrSubclass === undefined) {
                console.err('what the hell is a ', thisEl, 'doing in a Stream?');
            } else if (thisEl.isClassOrSubclass(classList)) {
                tempEls.push(thisEl);
            }
        }
        var newSt = new stream.Stream(); // TODO: take Stream class Part, etc.
        newSt.elements = tempEls;
        return newSt;           
    };
    /**
     * Sets Pitch.accidental.displayStatus for every element with a
     * pitch or pitches in the stream. If a natural needs to be displayed
     * and the Pitch does not have an accidental object yet, adds one.
     * 
     * Called automatically before appendCanvas routines are called.
     * 
     * @memberof music21.stream.Stream
     * @returns {music21.stream.Stream} this
     */
    stream.Stream.prototype.makeAccidentals = function () {
        // cheap version of music21p method
        var extendableStepList = {};
        var stepNames = ['C','D','E','F','G','A','B'];
        for (var i = 0; i < stepNames.length; i++) {
            var stepName = stepNames[i];
            var stepAlter = 0;
            if (this.keySignature != undefined) {
                var tempAccidental = this.keySignature.accidentalByStep(stepName);
                if (tempAccidental != undefined) {
                    stepAlter = tempAccidental.alter;
                    //console.log(stepAlter + " " + stepName);
                }
            }
            extendableStepList[stepName] = stepAlter;
        }
        var lastOctaveStepList = [];
        for (var i = 0; i < 10; i++) {
            var lastStepDict = $.extend({}, extendableStepList);
            lastOctaveStepList.push(lastStepDict);
        }
        var lastOctavelessStepDict = $.extend({}, extendableStepList); // probably unnecessary, but safe...
        for (var i = 0; i < this.length; i++) {
            var el = this.get(i);
            if (el.pitch != undefined) { // note
                var p = el.pitch;
                var lastStepDict = lastOctaveStepList[p.octave];                
                this._makeAccidentalForOnePitch(p, lastStepDict, lastOctavelessStepDict);
            } else if (el._noteArray != undefined) { // chord
                for (var j = 0; j < el._noteArray.length; j++) {
                    var p = el._noteArray[j].pitch;
                    var lastStepDict = lastOctaveStepList[p.octave];
                    this._makeAccidentalForOnePitch(p, lastStepDict, lastOctavelessStepDict);
                }
            }
        }
        return this;
    };

    // returns pitch
    stream.Stream.prototype._makeAccidentalForOnePitch = function (p, lastStepDict, lastOctavelessStepDict) {
        var newAlter;
        if (p.accidental == undefined) {
            newAlter = 0;
        } else {
            newAlter = p.accidental.alter;
        }
        //console.log(p.name + " " + lastStepDict[p.step].toString());
        if ((lastStepDict[p.step] != newAlter) ||
            (lastOctavelessStepDict[p.step] != newAlter)
             ) {
            if (p.accidental === undefined) {
                p.accidental = new pitch.Accidental('natural');
            }
            p.accidental.displayStatus = true;
            //console.log("setting displayStatus to true");
        } else if ( (lastStepDict[p.step] == newAlter) &&
                    (lastOctavelessStepDict[p.step] == newAlter) ) {
            if (p.accidental !== undefined) {
                p.accidental.displayStatus = false;
            }
            //console.log("setting displayStatus to false");
        }
        lastStepDict[p.step] = newAlter;
        lastOctavelessStepDict[p.step] = newAlter;
        return p;
    };	

    /**
     * Sets the render options for any substreams (such as placing them
     * in systems, etc.) DOES NOTHING for music21.stream.Stream, but is
     * overridden in subclasses.
     * 
     * @memberof music21.stream.Stream
     * @returns {music21.stream.Stream} this
     */
    stream.Stream.prototype.setSubstreamRenderOptions = function () {
        /* does nothing for standard streams ... */
        return this;
    };
    /**
     * Resets all the RenderOptions back to defaults. Can run recursively
     * and can also preserve the `RenderOptions.events` object.
     * 
     * @memberof music21.stream.Stream
     * @param {Boolean} [recursive=false]
     * @param {Boolean} [preserveEvents=false]
     * @returns {music21.stream.Stream} this
     */
    stream.Stream.prototype.resetRenderOptions = function (recursive, preserveEvents) {
        var oldEvents = this.renderOptions.events;
        this.renderOptions = new renderOptions.RenderOptions();
        if (preserveEvents) {
            this.renderOptions.events = oldEvents;
        }
        
        if (recursive) {
            for (var i = 0; i < this.length; i++) {
                var el = this.get(i);
                if (el.isClassOrSubclass('Stream')) {
                    el.resetRenderOptions(recursive, preserveEvents);
                }
            }            
        }
        return this;
    };
    
    
    //**********  VexFlow functionality
    
    /**
     * Uses {@link music21.vfShow.Renderer} to render Vexflow onto an
     * existing canvas object.
     * 
     * Sets canvas.storedStream to this
     * 
     * Runs `this.setRenderInteraction` on the canvas.
     * 
     * Will be moved to vfShow eventually when converter objects are enabled...maybe.
     * 
     * @memberof music21.stream.Stream
     * @param {DOMObject|JQueryDOMObject} canvas - a canvas object
     * @returns {music21.stream.Stream} this
     */
    stream.Stream.prototype.renderVexflowOnCanvas = function (canvas) {
        if (canvas.jquery) {
            canvas = canvas[0];
        }
        var vfr = new vfShow.Renderer(this, canvas);
        vfr.render();
        canvas.storedStream = this;
        this.setRenderInteraction(canvas);
        return this;
    };    

    /**
     * Estimate the stream height for the Stream.
     * 
     * If there are systems they will be incorporated into the height unless `ignoreSystems` is `true`.
     * 
     * @memberof music21.stream.Stream
     * @param {Boolean} [ignoreSystems=false]
     * @returns {number} height in pixels
     */
    stream.Stream.prototype.estimateStreamHeight = function (ignoreSystems) {
        var staffHeight = this.renderOptions.naiveHeight;
        var systemPadding = this.systemPadding;
        if (this.isClassOrSubclass('Score')) {
            var numParts = this.length;
            var numSystems = this.numSystems();
            if (numSystems == undefined || ignoreSystems) {
                numSystems = 1;
            }
            var scoreHeight = (numSystems * staffHeight * numParts) + ((numSystems - 1) * systemPadding);
            //console.log('scoreHeight of ' + scoreHeight);
            return scoreHeight;
        } else if (this.isClassOrSubclass('Part')) {
            var numSystems = 1;
            if (!ignoreSystems) {
                numSystems = this.numSystems();
            }
            if (music21.debug) {
                console.log("estimateStreamHeight for Part: numSystems [" + numSystems +
                "] * staffHeight [" + staffHeight + "] + (numSystems [" + numSystems +
                "] - 1) * systemPadding [" + systemPadding + "]."
                );
            }
            return (numSystems * staffHeight) + ((numSystems - 1) * systemPadding);
        } else {
            return staffHeight;
        }
    };    
    
    /**
     * Estimates the length of the Stream in pixels.
     * 
     * @memberof music21.stream.Stream
     * @returns {number} length in pixels
     */
    stream.Stream.prototype.estimateStaffLength = function () {
        if (this.renderOptions.overriddenWidth != undefined) {
            //console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
            return this.renderOptions.overriddenWidth;
        }
        if (this.hasVoices()) {
            var maxLength = 0;
            for (var i = 0; i < this.length; i++) {
                var v = this.get(i);
                if (v.isClassOrSubclass('Stream')) {
                    var thisLength = v.estimateStaffLength() + v.renderOptions.staffPadding;
                    if (thisLength > maxLength) {
                        maxLength = thisLength;
                    }                    
                }
            }
            return maxLength;
        } else if (this.hasSubStreams()) { // part
            var totalLength = 0;
            for (var i = 0; i < this.length; i++) {
                var m = this.get(i);
                if (m.isClassOrSubclass('Stream')) {
                    totalLength += m.estimateStaffLength() + m.renderOptions.staffPadding;
                    if ((i != 0) && (m.renderOptions.startNewSystem == true)) {
                        break;
                    }
                }
            }
            return totalLength;
        } else {
            var rendOp = this.renderOptions;
            var totalLength = 30 * this.length;
            totalLength += rendOp.displayClef ? 20 : 0;
            totalLength += (rendOp.displayKeySignature && this.keySignature) ? this.keySignature.width : 0;
            totalLength += rendOp.displayTimeSignature ? 30 : 0; 
            //totalLength += rendOp.staffPadding;
            return totalLength;
        }
    };

    //****** MIDI related routines...

    /**
     * Plays the Stream through the MIDI/sound playback (for now, only MIDI.js is supported)
     * 
     * `options` can be an object containing:
     * - instrument: {@link music21.instrument.Instrument} object (default, `this.instrument`)
     * - tempo: number (default, `this.tempo`)
     * 
     * Does not have functionality for stopping etc., will be removed eventually
     * and replaced with something better in {@link music21.streamInteraction}
     * 
     * @memberof music21.stream.Stream
     * @param {object} [options] - object of playback options
     * @returns {music21.stream.Stream} this
     */
    stream.Stream.prototype.playStream = function (options) {
        var params = {
            instrument: this.instrument,
            tempo: this.tempo
        };
        common.merge(params, options);
        var startNote = params.startNote;
        var currentNote = 0;
        if (startNote !== undefined) {
            currentNote = startNote;
        }
        var flatEls = this.flat.elements;
        var lastNote = flatEls.length;
        this._stopPlaying = false;
        var thisStream = this;
        
        var playNext = function (elements, params) {
            if (currentNote < lastNote && !thisStream._stopPlaying) {
                var el = elements[currentNote];
                var nextNote = undefined;
                if (currentNote < lastNote + 1) {
                    nextNote = elements[currentNote + 1];
                }
                var milliseconds = 0;
                if (el.playMidi !== undefined) {
                    milliseconds = el.playMidi(params.tempo, nextNote, params);                        
                }
                currentNote += 1;
                setTimeout( function () { playNext(elements, params); }, milliseconds);
            } else {
                if (params && params.done) {
                    params.done.call();
                }
            }
        };
        playNext(flatEls, params);
        return this;
    };
    
    /**
     * Stops a stream from playing if it currently is.
     * 
     * @memberof music21.stream.Stream
     * @returns {musci21.stream.Stream} this
     */
    stream.Stream.prototype.stopPlayStream = function () {
        // turns off all currently playing MIDI notes (on any stream) and stops playback.
        this._stopPlaying = true;
        for (var i = 0; i < 127; i++) {
            music21.MIDI.noteOff(0, i, 0);
        }
        return this;
    };
    /* ----------------------------------------------------------------------
     * 
     *  Canvas routines -- to be factored out eventually.
     * 
     */

    /**
     * Creates and returns a new `&lt;canvas&gt;` object.
     * 
     * Calls setSubstreamRenderOptions() first.
     * 
     * Does not render on canvas.
     * 
     * @memberof music21.stream.Stream
     * @param {number|string|undefined} width - will use `this.estimateStaffLength()` + `this.renderOptions.staffPadding` if not given
     * @param {number|string|undefined} height - if undefined will use `this.renderOptions.height`. If still undefined, will use `this.estimateStreamHeight()`
     * @returns {JQueryDOMObject} canvas in jquery.
     */
    stream.Stream.prototype.createNewCanvas = function (width, height) {
        if (this.hasSubStreams() ) { 
            this.setSubstreamRenderOptions();
        }

        var newCanvas = undefined;
        newCanvas = $('<canvas/>'); //.css('border', '1px red solid');
            
        if (width != undefined) {
            if (typeof width == 'string') {
                width = common.stripPx(width);
            }
            newCanvas.attr('width', width);
        } else {
            var computedWidth = this.estimateStaffLength() + this.renderOptions.staffPadding + 0;
            newCanvas.attr('width', computedWidth);
        }
        if (height != undefined) {
            newCanvas.attr('height', height);       
        } else {
            var computedHeight;
            if (this.renderOptions.height == undefined) {
                computedHeight = this.estimateStreamHeight();
                //console.log('computed Height estim: ' + computedHeight);
            } else {
                computedHeight = this.renderOptions.height;
                //console.log('computed Height: ' + computedHeight);
            }
            newCanvas.attr('height', computedHeight * this.renderOptions.scaleFactor.y );
        }
        return newCanvas;
    };
    
    /**
     * Creates a rendered, playable canvas where clicking plays it.
     * 
     * Called from appendNewCanvas() etc.
     * 
     * @memberof music21.stream.Stream
     * @param {number|string|undefined} width
     * @param {number|string|undefined} height
     * @returns {JQueryDOMObject} canvas
     */
    stream.Stream.prototype.createPlayableCanvas = function (width, height) {
        this.renderOptions.events['click'] = 'play';
        return this.createCanvas(width, height);
    };

    /**
     * Creates a new canvas and renders vexflow on it
     * 
     * @memberof music21.stream.Stream
     * @param {number|string|undefined} [width]
     * @param {number|string|undefined} [height]
     * @returns {JQueryDOMObject} canvas
     */
    stream.Stream.prototype.createCanvas = function(width, height) {
        var $newCanvas = this.createNewCanvas(width, height);
        this.renderVexflowOnCanvas($newCanvas);
        return $newCanvas;    
    };
    /**
     * Creates a new canvas, renders vexflow on it, and appends it to the DOM.
     * 
     * @memberof music21.stream.Stream
     * @param {JQueryDOMObject|DOMObject} [appendElement=document.body] - where to place the canvas
     * @param {number|string} [width]
     * @param {number|string} [height]
     * @returns {DOMObject} canvas (not the jQueryDOMObject -- this is a difference with other routines and should be fixed. TODO: FIX)
     * 
     */
    stream.Stream.prototype.appendNewCanvas = function (appendElement, width, height) {
        if (appendElement == undefined) {
            appendElement = 'body';
        };
        var $appendElement = appendElement;
        if (appendElement.jquery === undefined) {
            $appendElement = $(appendElement);
        }
        
//        if (width === undefined && this.renderOptions.maxSystemWidth === undefined) {
//            var $bodyElement = bodyElement;
//            if (bodyElement.jquery === undefined) {
//                $bodyElement = $(bodyElement);
//            }
//            width = $bodyElement.width();
//        };
//        
        var canvasBlock = this.createCanvas(width, height);
        $appendElement.append(canvasBlock);
        return canvasBlock[0];
    };
    
    /**
     * Replaces a particular Canvas with a new rendering of one.
     * 
     * Note that if 'where' is empty, will replace all canvases on the page.
     * 
     * @memberof music21.stream.Stream
     * @param {JQueryDOMObject|DOMObject} [where] - the canvas to replace or a container holding the canvas(es) to replace.
     * @param {Boolean} [preserveCanvasSize=false]
     * @returns {JQueryDOMObject} the canvas
     */
    stream.Stream.prototype.replaceCanvas = function (where, preserveCanvasSize) {
        // if called with no where, replaces all the canvases on the page...
        if (where == undefined) {
            where = 'body';
        }
        var $where = undefined;
        if (where.jquery === undefined) {
            $where = $(where);
        } else {
            $where = where;
            where = $where[0];
        }
        var $oldCanvas = undefined;
        if ($where.prop('tagName') == 'CANVAS') {
            $oldCanvas = $where;
        } else {
            $oldCanvas = $where.find('canvas');
        }
        // TODO: Max Width!
        if ($oldCanvas.length == 0) {
            throw ("No canvas defined for replaceCanvas!");
        } else if ($oldCanvas.length > 1) {
            // change last canvas...
            // replacing each with canvasBlock doesn't work
            // anyhow, it just resizes the canvas but doesn't
            // draw.
            $oldCanvas = $($oldCanvas[$oldCanvas.length -1]);
        }
        
        var canvasBlock;
        if (preserveCanvasSize) {
            var width = $oldCanvas.width();
            var height = $oldCanvas.height();
            canvasBlock = this.createCanvas(width, height);
        } else {
            canvasBlock = this.createCanvas();            
        }        
        
        $oldCanvas.replaceWith(canvasBlock);
        return canvasBlock;
    };

    /**
     * Renders a canvas which has a scrollbar when clicked.
     * 
     * (this is a dumb way of doing this.  Expect it to disappear...)
     * 
     * @memberof music21.stream.Stream
     * @param {JQueryDOMObject|DOMObject} [where]
     * @returns {DOMObject} canvas
     */
    stream.Stream.prototype.renderScrollableCanvas = function (where) {
        var $where = where;
        if (where === undefined) {
            $where = $(document.body);
        } else if (where.jquery === undefined) {
            $where = $(where);
        }
        var $innerDiv = $("<div>").css('position', 'absolute');
        var c = undefined;            
        this.renderOptions.events.click = function(storedThis) { 
            return function (event) {
                storedThis.scrollScoreStart(c, event);
            };
        }(this); // create new function with this stream as storedThis
        c = this.appendNewCanvas( $innerDiv );
        this.setRenderInteraction( $innerDiv );
        $where.append( $innerDiv );
        return c;
    };
    
    /**
     * Sets up a {@link music21.streamInteraction.ScrollPlayer} for this
     * canvas.
     * 
     * @memberof music21.stream.Stream
     * @param {DOMObject} c - canvas
     * @param {Event} [event] - the event that caused the scrolling to start
     * (needed because `event.stopPropagation()` is called)
     * @returns {music21.streamInteraction.ScrollPlayer}
     */
    stream.Stream.prototype.scrollScoreStart = function (c, event) {
        var scrollPlayer = new streamInteraction.ScrollPlayer(this, c);
        scrollPlayer.startPlaying();
        if (event !== undefined) {
            event.stopPropagation();
        }
        return scrollPlayer;
    };

    
    /**
     * Set the type of interaction on the canvas based on 
     *    - Stream.renderOptions.events['click']
     *    - Stream.renderOptions.events['dblclick']
     *    - Stream.renderOptions.events['resize']
     *    
     * Currently the only options available for each are:
     *    - 'play' (string)
     *    - 'reflow' (string; only on event['resize'])
     *    - customFunction (will receive event as a first variable; should set up a way to
     *                    find the original stream; var s = this; var f = function () { s...}
     *                   )
     * @memberof music21.stream.Stream
     * @param {DOMObject} canvasOrDiv - canvas or the Div surrounding it.
     * @returns {music21.stream.Stream} this
     */
    stream.Stream.prototype.setRenderInteraction = function (canvasOrDiv) {
        var $canvas = canvasOrDiv;
        if (canvasOrDiv === undefined) {
            return;
        } else if (canvasOrDiv.jquery === undefined) {
            $canvas = $(canvasOrDiv);
        }
        // TODO: assumes that canvas has a .storedStream function? can this be done by setting
        // a variable var storedStream = this; and thus get rid of the assumption?
        var playFunc = (function () { this.playStream(); }).bind(this);
        
        $.each(this.renderOptions.events, $.proxy(function (eventType, eventFunction) {
            $canvas.off(eventType);
            if (typeof(eventFunction) == 'string' && eventFunction == 'play') {
                $canvas.on(eventType, playFunc);
            } else if (typeof(eventFunction) == 'string' && eventType == 'resize' && eventFunction == 'reflow') {
                this.windowReflowStart($canvas);
            } else if (eventFunction != undefined) {
                $canvas.on(eventType, eventFunction);
            }
        }, this ) );
        return this;
    };
    
    /**
     * 
     * Recursively search downward for the closest storedVexflowStave...
     *
     * @memberof music21.stream.Stream
     * @returns {Vex.Flow.Stave|undefined}
     */
    stream.Stream.prototype.recursiveGetStoredVexflowStave = function () {
        var storedVFStave = this.storedVexflowStave;
        if (storedVFStave == undefined) {
            if (!this.hasSubStreams()) {
                return undefined;
            } else {
                storedVFStave = this.get(0).storedVexflowStave;
                if (storedVFStave == undefined) {
                    // bad programming ... should support continuous recurse
                    // but good enough for now...
                    if (this.get(0).hasSubStreams()) {
                        storedVFStave = this.get(0).get(0).storedVexflowStave;
                    }
                }
            }
        }
        return storedVFStave;
    };

    /**
     * Given a mouse click, or other event with .pageX and .pageY,
     * find the x and y for the canvas.
     * 
     * @memberof music21.stream.Stream
     * @param {DOMObject} canvas
     * @param {Event} e
     * @returns {Array<number>} two-elements, [x, y] in pixels.
     */
    stream.Stream.prototype.getUnscaledXYforCanvas = function (canvas, e) {
        var offset = null;
        if (canvas == undefined) {
            offset = {left: 0, top: 0};
        } else {
            offset = $(canvas).offset();            
        }
        /*
         * mouse event handler code from: http://diveintohtml5.org/canvas.html
         */
        var xClick, yClick;
        if (e.pageX != undefined && e.pageY != undefined) {
            xClick = e.pageX;
            yClick = e.pageY;
        } else { 
            xClick = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            yClick = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        var xPx = (xClick - offset.left);
        var yPx = (yClick - offset.top);
        return [xPx, yPx];
    };
    
    /**
     * return a list of [scaledX, scaledY] for
     * a canvas element.
     * 
     * xScaled refers to 1/scaleFactor.x -- for instance, scaleFactor.x = 0.7 (default)
     * x of 1 gives 1.42857...
     * 
     * @memberof music21.stream.Stream
     * @param {DOMObject} canvas
     * @param {Event} e
     * @returns {Array<number>} [scaledX, scaledY]
     */
    stream.Stream.prototype.getScaledXYforCanvas = function (canvas, e) {
        var _ = this.getUnscaledXYforCanvas(canvas, e);
        var xPx = _[0];
        var yPx = _[1];
        var pixelScaling = this.renderOptions.scaleFactor;
        
        var yPxScaled = yPx / pixelScaling.y;
        var xPxScaled = xPx / pixelScaling.x;
        return [xPxScaled, yPxScaled];
    };
    /**
     * 
     * Given a Y position find the diatonicNoteNum that a note at that position would have.
     * 
     * searches this.storedVexflowStave
     * 
     * Y position must be offset from the start of the stave...
     *
     * @memberof music21.stream.Stream
     * @param {number} yPxScaled
     * @returns {Int}
     */
    stream.Stream.prototype.diatonicNoteNumFromScaledY = function (yPxScaled) {
        var storedVFStave = this.recursiveGetStoredVexflowStave();
        //for (var i = -10; i < 10; i++) {
        //    console.log("line: " + i + " y: " + storedVFStave.getYForLine(i));
        //}
        var lineSpacing = storedVFStave.options.spacing_between_lines_px;
        var linesAboveStaff = storedVFStave.options.space_above_staff_ln;

        var notesFromTop = yPxScaled * 2 / lineSpacing;
        var notesAboveFirstLine = ((storedVFStave.options.num_lines - 1 + linesAboveStaff) * 2 ) - notesFromTop;
        var clickedDiatonicNoteNum = this.clef.firstLine + Math.round(notesAboveFirstLine);
        return clickedDiatonicNoteNum;
    };
    
    /**
     * 
     * Return the note at pixel X (or within allowablePixels [default 10])
     * of the note.
     * 
     * systemIndex element is not used on bare Stream

     * @memberof music21.stream.Stream
     * @param {number} xPxScaled
     * @param {number} [allowablePixels=10]
     * @param {number} [unused_systemIndex]
     * @returns {music21.base.Music21Object|undefined}
     */
    stream.Stream.prototype.noteElementFromScaledX = function (xPxScaled, allowablePixels, unused_systemIndex) {
        var foundNote = undefined;
        if (allowablePixels == undefined) {
            allowablePixels = 10;   
        }

        for (var i = 0; i < this.length; i ++) {
            var n = this.get(i);
            /* should also
             * compensate for accidentals...
             */
            if (xPxScaled > (n.x - allowablePixels) && 
                    xPxScaled < (n.x + n.width + allowablePixels)) {
                foundNote = n;
                break; /* O(n); can be made O(log n) */
            }
        }       
        //console.log(n.pitch.nameWithOctave);
        return foundNote;
    };
    
    /**
     * Given an event object, and an x and y location, returns a two-element array
     * of the pitch.Pitch.diatonicNoteNum that was clicked (i.e., if C4 was clicked this
     * will return 29; if D4 was clicked this will return 30) and the closest note in the
     * stream that was clicked.
     * 
     * Return a list of [diatonicNoteNum, closestXNote]
     * for an event (e) called on the canvas (canvas)
     *
     * @memberof music21.stream.Stream
     * @param {DOMObject} canvas
     * @param {Event} e
     * @param {number} x
     * @param {number} y
     * @returns {Array} [diatonicNoteNum, closestXNote]
     */
    stream.Stream.prototype.findNoteForClick = function (canvas, e, x, y) {
        if (x == undefined || y == undefined) {
            var _ = this.getScaledXYforCanvas(canvas, e);
            x = _[0];
            y = _[1];
        }
        var clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(y);
        var foundNote = this.noteElementFromScaledX(x);
        return [clickedDiatonicNoteNum, foundNote];
    };
      
    /**
     * Change the pitch of a note given that it has been clicked and then
     * call changedCallbackFunction
     * 
     * To be removed...
     * 
     * @memberof music21.stream.Stream
     * @param {Int} clickedDiatonicNoteNum
     * @param {music21.base.Music21Object} foundNote
     * @param {DOMObject} canvas
     * @returns {any} output of changedCallbackFunction
     */
    stream.Stream.prototype.noteChanged = function (clickedDiatonicNoteNum, foundNote, canvas) {
        var n = foundNote;
        p = new pitch.Pitch("C");
        p.diatonicNoteNum = clickedDiatonicNoteNum;
        p.accidental = n.pitch.accidental;
        n.pitch = p;
        n.stemDirection = undefined;
        this.activeNote = n;
        this.redrawCanvas(canvas);
        if (this.changedCallbackFunction != undefined) {
            return this.changedCallbackFunction({foundNote: n, canvas: canvas});
        }
    };
    /**
     * Redraws a canvas, keeping the events of the previous canvas.
     * 
     * @memberof music21.stream.Stream
     * @param {DOMObject} canvas
     * @returns {music21.stream.Stream} this
     */
    stream.Stream.prototype.redrawCanvas = function (canvas) {
        //this.resetRenderOptions(true, true); // recursive, preserveEvents
        //this.setSubstreamRenderOptions();
        var $canvas = $(canvas); // works even if canvas is already $jquery
        var $newCanv = this.createNewCanvas( canvas.width,
                                            canvas.height );
        this.renderVexflowOnCanvas($newCanv);
        $canvas.replaceWith( $newCanv );
        common.jQueryEventCopy($.event, $canvas, $newCanv); /* copy events -- using custom extension... */
        return this;
    };
    
    /**
     * Renders a stream on a canvas with the ability to edit it and
     * a toolbar that allows the accidentals to be edited.
     * 
     * @memberof music21.stream.Stream
     * @param {number} [width]
     * @param {number} [height]
     * @returns {DOMObject} &lt;div&gt; tag around the canvas.
     */
    stream.Stream.prototype.editableAccidentalCanvas = function (width, height) {
        /*
         * Create an editable canvas with an accidental selection bar.
         */
        var d = $("<div/>").css('text-align','left').css('position','relative');
        var buttonDiv = this.getAccidentalToolbar();
        d.append(buttonDiv);
        d.append( $("<br clear='all'/>") );
        this.renderOptions.events['click'] = this.canvasChangerFunction;
        this.appendNewCanvas(d, width, height); // var can =
        return d;
    };

    
    /*
     * Canvas toolbars...
     */
    
    /**
     * 
     * @memberof music21.stream.Stream
     * @returns {DOMObject} the accidental toolbar.
     */
    stream.Stream.prototype.getAccidentalToolbar = function () {
        
        var addAccidental = function (clickedButton, alter) {
            /*
             * To be called on a button...
             *   this will usually refer to a window Object
             */
            var accidentalToolbar = $(clickedButton).parent();
            var siblingCanvas = accidentalToolbar.parent().find("canvas");
            var s = siblingCanvas[0].storedStream;
            if (s.activeNote != undefined) {
                n = s.activeNote;
                n.pitch.accidental = new pitch.Accidental(alter);
                /* console.log(n.pitch.name); */
                s.redrawCanvas(siblingCanvas[0]);
                if (s.changedCallbackFunction != undefined) {
                    s.changedCallbackFunction({canvas: siblingCanvas[0]});
                }
            }
        };

        
        var buttonDiv = $("<div/>").attr('class','buttonToolbar vexflowToolbar').css('position','absolute').css('top','10px');
        buttonDiv.append( $("<span/>").css('margin-left', '50px'));
        buttonDiv.append( $("<button>♭</button>").click( function () { addAccidental(this, -1); } ));
        buttonDiv.append( $("<button>♮</button>").click( function () { addAccidental(this, 0); } ));
        buttonDiv.append( $("<button>♯</button>").click( function () { addAccidental(this, 1); } ));
        return buttonDiv;

    };
    /**
     * 
     * @memberof music21.stream.Stream
     * @returns {DOMObject} a play toolbar
     */
    stream.Stream.prototype.getPlayToolbar = function () {
        var buttonDiv = $("<div/>").attr('class','playToolbar vexflowToolbar').css('position','absolute').css('top','10px');
        buttonDiv.append( $("<span/>").css('margin-left', '50px'));
        buttonDiv.append( $("<button>&#9658</button>").click( (function () { this.playStream(); } ).bind(this) ) );
        buttonDiv.append( $("<button>&#9724</button>").click( (function () { this.stopPlayStream(); } ).bind(this) ) );
        return buttonDiv;       
    };
    // reflow
    
    /**
     * Begins a series of bound events to the window that makes it
     * so that on resizing the stream is redrawn and reflowed to the 
     * new size.
     * 
     * @memberof music21.stream.Stream
     * @param {JQueryDOMObject} jCanvas
     * @returns {music21.stream.Stream} this
     */
    stream.Stream.prototype.windowReflowStart = function (jCanvas) {
        // set up a bunch of windowReflow bindings that affect the canvas.
        var callingStream = this;
        var jCanvasNow = jCanvas;
        $(window).bind('resizeEnd', function() {
            //do something, window hasn't changed size in 500ms
            var jCanvasParent = jCanvasNow.parent();
            var newWidth = jCanvasParent.width();
            var canvasWidth = newWidth;
            //console.log(canvasWidth);
            console.log('resizeEnd triggered', newWidth);
            //console.log(callingStream.renderOptions.events.click);
            callingStream.resetRenderOptions(true, true); // recursive, preserveEvents
            //console.log(callingStream.renderOptions.events.click);
            callingStream.maxSystemWidth = canvasWidth - 40;
            jCanvasNow.remove();
            var canvasObj = callingStream.appendNewCanvas(jCanvasParent);
            jCanvasNow = $(canvasObj);
        });
        $(window).resize( function() {
            if (this.resizeTO) {
                clearTimeout(this.resizeTO);
            }
            this.resizeTO = setTimeout(function() {
                $(this).trigger('resizeEnd');
            }, 200);
        });
        setTimeout(function() {
            var $window = $(window);
            var doResize = $window.data('triggerResizeOnCreateCanvas');
            if (doResize === undefined || doResize === true) {
                $(this).trigger('resizeEnd');
                $window.data('triggerResizeOnCreateCanvas', false);
            }
        }, 1000);
        return this;
    };
    /**
     * Does this stream have a {@link music21.stream.Voice} inside it?
     * 
     * @memberof music21.stream.Stream
     * @returns {Boolean}
     */
    stream.Stream.prototype.hasVoices = function () {
        for (var i = 0; i < this.length; i++) {
            var el = this.get(i);
            if (el.isClassOrSubclass('Voice')) {
                return true;
            }
        }
        return false;
    };

    /**
     * 
     * @class Voice
     * @memberof music21.stream
     * @extends music21.stream.Stream
     */ 
    stream.Voice = function () { 
        stream.Stream.call(this);
        this.classes.push('Voice');
    };

    stream.Voice.prototype = new stream.Stream();
    stream.Voice.prototype.constructor = stream.Voice;

    
    /**
     * @class Measure
     * @memberof music21.stream
     * @extends music21.stream.Stream
     */
	stream.Measure = function () { 
		stream.Stream.call(this);
		this.classes.push('Measure');
	};

	stream.Measure.prototype = new stream.Stream();
	stream.Measure.prototype.constructor = stream.Measure;

	
	/**
	 * Part -- specialized to handle Measures inside it
	 * 
	 * @class Part
     * @memberof music21.stream 
     * @extends music21.stream.Stream
	 */
	stream.Part = function () {
		stream.Stream.call(this);
		this.classes.push('Part');
		this.systemHeight = this.renderOptions.naiveHeight;
	};

	stream.Part.prototype = new stream.Stream();
	stream.Part.prototype.constructor = stream.Part;
	/**
	 * How many systems does this Part have? 
	 * 
	 * Does not change any reflow information, so by default it's always 1.
	 * 
     * @memberof music21.stream.Part
	 * @returns {Number}
	 */
	stream.Part.prototype.numSystems = function () {
        var numSystems = 0;
        for (var i = 0; i < this.length; i++) {
            if (this.get(i).renderOptions.startNewSystem) {
                numSystems++;
            }
        }
        if (numSystems == 0) {
            numSystems = 1;
        }
        return numSystems;
    };

    /**
     * Find the width of every measure in the Part.
     * 
     * @memberof music21.stream.Part
     * @returns {Array<number>}
     */
    stream.Part.prototype.getMeasureWidths = function () {
        /* call after setSubstreamRenderOptions */
        var measureWidths = [];
        for (var i = 0; i < this.length; i++) {
            var el = this.get(i);
            if (el.isClassOrSubclass('Measure')) {
                var elRendOp = el.renderOptions;
                measureWidths[elRendOp.measureIndex] = elRendOp.width;
            }
        }
        /* console.log(measureWidths);
         * 
         */
        return measureWidths;
    };
    /**
     * Overrides the default music21.stream.Stream#estimateStaffLength
     * 
     * @memberof music21.stream.Part
     * @returns {number}
     */
    stream.Part.prototype.estimateStaffLength = function () {
        if (this.renderOptions.overriddenWidth != undefined) {
            //console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
            return this.renderOptions.overriddenWidth;
        }
        if (this.hasSubStreams()) { // part with Measures underneath
            var totalLength = 0;
            for (var i = 0; i < this.length; i++) {
                var m = this.get(i);
                // this looks wrong, but actually seems to be right. moving it to
                // after the break breaks things.
                totalLength += m.estimateStaffLength() + m.renderOptions.staffPadding;
                if ((i != 0) && (m.renderOptions.startNewSystem == true)) {
                    break;
                }
            }
            return totalLength;
        };          
        // no measures found in part... treat as measure
        var tempM = new stream.Measure();
        tempM.elements = this.elements;
        return tempM.estimateStaffLength();
    };
    /**
     * Divide a part up into systems and fix the measure
     * widths so that they are all even.
     * 
     * Note that this is done on the part level even though
     * the measure widths need to be consistent across parts.
     * 
     * This is possible because the system is deterministic and
     * will come to the same result for each part.  Opportunity
     * for making more efficient through this...
     * 
     * @memberof music21.stream.Part
     * @param systemHeight
     * @returns {Array}
     */
    stream.Part.prototype.fixSystemInformation = function (systemHeight) {
        /* 
         * console.log('system height: ' + systemHeight);
         */
        if (systemHeight == undefined) {
            systemHeight = this.systemHeight; /* part.show() called... */
        } else {
            if (music21.debug) {
                console.log ('overridden systemHeight: ' + systemHeight);
            }
        }
        var systemPadding = this.renderOptions.systemPadding || this.renderOptions.naiveSystemPadding;
        var measureWidths = this.getMeasureWidths();
        var maxSystemWidth = this.maxSystemWidth; /* of course fix! */
        var systemCurrentWidths = [];
        var systemBreakIndexes = [];
        var lastSystemBreak = 0; /* needed to ensure each line has at least one measure */
        var startLeft = 20; /* TODO: make it obtained elsewhere */
        var currentLeft = startLeft;
        for (var i = 0; i < measureWidths.length; i++) {
            var currentRight = currentLeft + measureWidths[i];
            /* console.log("left: " + currentLeft + " ; right: " + currentRight + " ; m: " + i); */
            if ((currentRight > maxSystemWidth) && (lastSystemBreak != i)) {
                systemBreakIndexes.push(i-1);
                systemCurrentWidths.push(currentLeft);
                //console.log('setting new width at ' + currentLeft);
                currentLeft = startLeft + measureWidths[i];
                lastSystemBreak = i;
            } else {
                currentLeft = currentRight;
            }
        }
        //console.log(systemCurrentWidths);
        //console.log(systemBreakIndexes);

        var currentSystemIndex = 0;
        var leftSubtract = 0;
        for (var i = 0; i < this.length; i++) {
            var m = this.get(i);
            if (i == 0) {
                m.renderOptions.startNewSystem = true;
            }
            var currentLeft = m.renderOptions.left;

            if ($.inArray(i - 1, systemBreakIndexes) != -1) {
                /* first measure of new System */
                leftSubtract = currentLeft - 20;
                m.renderOptions.displayClef = true;
                m.renderOptions.displayKeySignature = true;
                m.renderOptions.startNewSystem = true;
                currentSystemIndex++;
            } else if (i != 0) {
                m.renderOptions.startNewSystem = false;
                m.renderOptions.displayClef = false;
                m.renderOptions.displayKeySignature = false;
            }
            m.renderOptions.systemIndex = currentSystemIndex;
            var currentSystemMultiplier;
            if (currentSystemIndex >= systemCurrentWidths.length) {
                /* last system... non-justified */;
                currentSystemMultiplier = 1;
            } else {
                var currentSystemWidth = systemCurrentWidths[currentSystemIndex];
                currentSystemMultiplier = maxSystemWidth / currentSystemWidth;
                //console.log('systemMultiplier: ' + currentSystemMultiplier + ' max: ' + maxSystemWidth + ' current: ' + currentSystemWidth);
            }
            /* might make a small gap? fix? */
            var newLeft = currentLeft - leftSubtract;
            //console.log('M: ' + i + ' ; old left: ' + currentLeft + ' ; new Left: ' + newLeft);
            m.renderOptions.left = Math.floor(newLeft * currentSystemMultiplier);
            m.renderOptions.width = Math.floor(m.renderOptions.width * currentSystemMultiplier);
            var newTop = m.renderOptions.top + (currentSystemIndex * (systemHeight + systemPadding));
            //console.log('M: ' + i + '; New top: ' + newTop + " ; old Top: " + m.renderOptions.top);
            m.renderOptions.top = newTop;
        }
        
        return systemCurrentWidths;
    };
    /**
     * overrides music21.stream.Stream#setSubstreamRenderOptions
     * 
     * figures out the `.left` and `.top` attributes for all contained measures
     * 
     * @memberof music21.stream.Part
     */    
    stream.Part.prototype.setSubstreamRenderOptions = function () {
        var currentMeasureIndex = 0; /* 0 indexed for now */
        var currentMeasureLeft = 20;
        var rendOp = this.renderOptions;
        var lastTimeSignature = undefined;
        var lastKeySignature = undefined;
        var lastClef = undefined;
        
        for (var i = 0; i < this.length; i++) {
            var el = this.get(i);
            if (el.isClassOrSubclass('Measure')) {
                var elRendOp = el.renderOptions;
                elRendOp.measureIndex = currentMeasureIndex;
                elRendOp.top = rendOp.top;
                elRendOp.partIndex = rendOp.partIndex;
                elRendOp.left = currentMeasureLeft;
                
                if (currentMeasureIndex == 0) {
                    lastClef = el._clef;
                    lastTimeSignature = el._timeSignature;
                    lastKeySignature = el._keySignature;
                    
                    elRendOp.displayClef = true;
                    elRendOp.displayKeySignature = true;
                    elRendOp.displayTimeSignature = true;
                } else {
                    if (el._clef !== undefined && lastClef !== undefined && el._clef.name != lastClef.name) {
                        console.log('changing clefs for ', elRendOp.measureIndex, ' from ', 
                                lastClef.name, ' to ', el._clef.name);
                        lastClef = el._clef;
                        elRendOp.displayClef = true;
                    } else {
                        elRendOp.displayClef = false;                           
                    }
                    
                    if (el._keySignature !== undefined && lastKeySignature !== undefined && 
                            el._keySignature.sharps != lastKeySignature.sharps) {
                        lastKeySignature = el._keySignature;
                        elRendOp.displayKeySignature = true;
                    } else {
                        elRendOp.displayKeySignature = false;                           
                    }
                    
                    if (el._timeSignature !== undefined && lastTimeSignature !== undefined && 
                            el._timeSignature.ratioString != lastTimeSignature.ratioString) {
                        lastTimeSignature = el._timeSignature;
                        elRendOp.displayTimeSignature = true;
                    } else {
                        elRendOp.displayTimeSignature = false;          
                    }
                }
                elRendOp.width = el.estimateStaffLength() + elRendOp.staffPadding;
                elRendOp.height = el.estimateStreamHeight();
                currentMeasureLeft += elRendOp.width;
                currentMeasureIndex++;
            }
        }        
        return this;

    };
    /**
     * Overrides the default music21.stream.Stream#findNoteForClick
     * by taking into account systems
     * 
     * @memberof music21.stream.Part
     * @param {DOMObject} canvas
     * @param {Event} e
     * @returns {Array} [clickedDiatonicNoteNum, foundNote]
     */
    stream.Part.prototype.findNoteForClick = function(canvas, e) {
        var _ = this.getScaledXYforCanvas(canvas, e);
        var x = _[0];
        var y = _[1];
        
        //music21.debug = true;
        if (music21.debug) {
            console.log('this.estimateStreamHeight(): ' + 
                    this.estimateStreamHeight() + " / $(canvas).height(): " + $(canvas).height());
        }
        var systemPadding = this.renderOptions.systemPadding;
        if (systemPadding === undefined) {
            systemPadding =  this.renderOptions.naiveSystemPadding;
        }
        var systemIndex = Math.floor(y / (this.systemHeight + systemPadding));
        var scaledYRelativeToSystem = y - systemIndex * (this.systemHeight + systemPadding);
        var clickedDiatonicNoteNum = this.diatonicNoteNumFromScaledY(scaledYRelativeToSystem);
        
        var foundNote = this.noteElementFromScaledX(x, undefined, systemIndex);
        return [clickedDiatonicNoteNum, foundNote];
    };

    /**
     * Override the noteElementFromScaledX for Stream
     * to take into account sub measures...
     * 
     * @memberof music21.stream.Part
     * @param {number} scaledX
     * @param {number} allowablePixels
     * @param {Int} systemIndex
     * @returns {music21.base.Music21Object|undefined}
     */
    stream.Part.prototype.noteElementFromScaledX = function (scaledX, allowablePixels, systemIndex) {
        var gotMeasure = undefined;
        for (var i = 0; i < this.length; i++) {
            var m = this.get(i);
            var rendOp = m.renderOptions;
            var left = rendOp.left;
            var right = left + rendOp.width;
            var top = rendOp.top;
            var bottom = top + rendOp.height;
            if (music21.debug) {
                console.log("Searching for X:" + Math.round(scaledX) + 
                        " in M " + i + 
                        " with boundaries L:" + left + " R:" + right +
                        " T: " + top + " B: " + bottom);
            }
            if (scaledX >= left && scaledX <= right ){
                if (systemIndex == undefined) {
                    gotMeasure = m;
                    break;
                } else if (rendOp.systemIndex == systemIndex) {
                    gotMeasure = m;
                    break;
                }
            }
        }
        if (gotMeasure) {
            return gotMeasure.noteElementFromScaledX(scaledX, allowablePixels);
        }
    };

	
    /**
     * Scores with multiple parts
     * 
     * @class Score
     * @memberof music21.stream
     * @extends music21.stream.Stream
     */
	stream.Score = function () {
		stream.Stream.call(this);
		this.classes.push('Score');
		this.measureWidths = [];
		this.partSpacing = this.renderOptions.naiveHeight;		

		Object.defineProperties(this, {
		   'systemPadding': {
		       enumerable: true,
		       configurable: true,
		       get: function () {
		           var numParts = this.parts.length;
		           var systemPadding = this.renderOptions.systemPadding;
		           if (systemPadding === undefined) {
		               if (numParts == 1) {
		                   systemPadding = this.renderOptions.naiveSystemPadding; // fix to 0
		               } else {
		                   systemPadding = this.renderOptions.naiveSystemPadding;
		               }
		           }
		           return systemPadding;
		       },
		   } 
		});
	};

	stream.Score.prototype = new stream.Stream();
	stream.Score.prototype.constructor = stream.Score;
    /**
     * overrides music21.stream.Stream#setSubstreamRenderOptions
     * 
     * figures out the `.left` and `.top` attributes for all contained parts
     * 
     * @memberof music21.stream.Score
     * @returns {music21.stream.Score} this
     */    
    stream.Score.prototype.setSubstreamRenderOptions = function () {
        var currentPartNumber = 0;
        var currentPartTop = 0;
        var partSpacing = this.partSpacing;
        for (var i = 0; i < this.length; i++) {
            var el = this.get(i);
            
            if (el.isClassOrSubclass('Part')) {
                el.renderOptions.partIndex = currentPartNumber;
                el.renderOptions.top = currentPartTop;
                el.setSubstreamRenderOptions();
                currentPartTop += partSpacing;
                currentPartNumber++;
            }
        }
        this.evenPartMeasureSpacing();
        var ignoreNumSystems = true;
        var currentScoreHeight = this.estimateStreamHeight(ignoreNumSystems);
        for (var i = 0; i < this.length; i++) {
            var el = this.get(i);   
            if (el.isClassOrSubclass('Part')) {
                el.fixSystemInformation(currentScoreHeight);
            }
        }
        this.renderOptions.height =  this.estimateStreamHeight();
        return this;

    };
    /**
     * Overrides the default music21.stream.Stream#estimateStaffLength
     * 
     * @memberof music21.stream.Score
     * @returns {number}
     */
    stream.Score.prototype.estimateStaffLength = function () {
        // override
        if (this.renderOptions.overriddenWidth != undefined) {
            //console.log("Overridden staff width: " + this.renderOptions.overriddenWidth);
            return this.renderOptions.overriddenWidth;
        }
        for (var i = 0; i < this.length; i++) {
            var p = this.get(i);
            if (p.isClassOrSubclass('Part')) {
                return p.estimateStaffLength();
            }
        }
        // no parts found in score... use part...
        console.log('no parts found in score');
        var tempPart = new stream.Part();
        tempPart.elements = this.elements;
        return tempPart.estimateStaffLength();            
    };
    
    /* MIDI override */
    /**
     * Overrides the default music21.stream.Stream#playStream
     * 
     * Works crappily -- just starts *n* midi players.
     * 
     * Render scrollable score works better...
     * 
     * @memberof music21.stream.Score
     * @param {object} params -- passed to each part
     * @returns {music21.stream.Score} this
     */
    stream.Score.prototype.playStream = function (params) {
        // play multiple parts in parallel...
        for (var i = 0; i < this.length; i++) {
            var el = this.get(i);
            if (el.isClassOrSubclass('Part')) {
                el.playStream(params);
            }
        }
        return this;

    };
    /**
     * Overrides the default music21.stream.Stream#stopPlayScore()
     * 
     * @memberof music21.stream.Score
     * @returns {music21.stream.Score} this
     */
    stream.Score.prototype.stopPlayStream = function () {
        for (var i = 0; i < this.length; i++) {
            var el = this.get(i);
            if (el.isClassOrSubclass('Part')) {
                el.stopPlayStream();
            }
        }
        return this;
    };
    /*
     * Canvas routines
     */
    /**
     * call after setSubstreamRenderOptions
     * gets the maximum measure width for each measure
     * by getting the maximum for each measure of
     * Part.getMeasureWidths();
     * 
     * Does this work? I found a bug in this and fixed it that should have
     * broken it!
     * 
     * @memberof music21.stream.Score
     * @returns {Array<number>}
     */
    stream.Score.prototype.getMaxMeasureWidths = function () {
        var maxMeasureWidths = [];
        var measureWidthsArrayOfArrays = [];
        for (var i = 0; i < this.length; i++) {
            var el = this.get(i);
            measureWidthsArrayOfArrays.push(el.getMeasureWidths());
        }
        for (var i = 0; i < measureWidthsArrayOfArrays[0].length; i++) {
            var maxFound = 0;
            for (var j = 0; j < this.length; j++) {
                if (measureWidthsArrayOfArrays[j][i] > maxFound) {
                    maxFound = measureWidthsArrayOfArrays[j][i];
                }
            }
            maxMeasureWidths.push(maxFound);
        }
        //console.log(measureWidths);
        return maxMeasureWidths;
    };

    /**
     * @memberof music21.stream.Score
     * @param {DOMObject} canvas
     * @param {Event} e
     * @returns {Array} [diatonicNoteNum, m21Element]
     */
    stream.Score.prototype.findNoteForClick = function(canvas, e) {
        /**
         * Returns a list of [clickedDiatonicNoteNum, foundNote] for a
         * click event, taking into account that the note will be in different
         * Part objects (and different Systems) given the height and possibly different Systems.
         * 
         */
        var _ = this.getScaledXYforCanvas(canvas, e);
        var x = _[0];
        var y = _[1];
        
        var numParts = this.parts.length; 
        var systemHeight = numParts * this.partSpacing + this.systemPadding;
        var systemIndex = Math.floor(y / systemHeight);
        var scaledYFromSystemTop = y - systemIndex * systemHeight;
        var partIndex = Math.floor(scaledYFromSystemTop / this.partSpacing);
        var scaledYinPart = scaledYFromSystemTop - partIndex * this.partSpacing;
        //console.log('systemIndex: ' + systemIndex + " partIndex: " + partIndex);
        var rightPart = this.get(partIndex);
        var clickedDiatonicNoteNum = rightPart.diatonicNoteNumFromScaledY(scaledYinPart);
        
        var foundNote = rightPart.noteElementFromScaledX(x, undefined, systemIndex);
        return [clickedDiatonicNoteNum, foundNote];
    };
    
    /**
     * How many systems are there? Calls numSystems() on the first part.
     * 
     * @memberof music21.stream.Score
     * @returns {Int}
     */
    stream.Score.prototype.numSystems = function () {
        return this.get(0).numSystems();
    };
    
    /**
     * Fixes the part measure spacing for all parts.
     * 
     * @memberof music21.stream.Score
     * @returns {music21.stream.Score} this
     */
    stream.Score.prototype.evenPartMeasureSpacing = function () {
        var measureStacks = [];
        var currentPartNumber = 0;
        var maxMeasureWidth = [];

        for (var i = 0; i < this.length; i++) {
            var el = this.get(i);
            if (el.isClassOrSubclass('Part')) {
                var measureWidths = el.getMeasureWidths();
                for (var j = 0; j < measureWidths.length; j++) {
                    var thisMeasureWidth = measureWidths[j];
                    if (measureStacks[j] == undefined) {
                        measureStacks[j] = [];
                        maxMeasureWidth[j] = thisMeasureWidth;
                    } else {
                        if (thisMeasureWidth > maxMeasureWidth[j]) {
                            maxMeasureWidth[j] = thisMeasureWidth;
                        }
                    }
                    measureStacks[j][currentPartNumber] = thisMeasureWidth;
                }
                currentPartNumber++;
            }
        }
        var currentLeft = 20;
        for (var i = 0; i < maxMeasureWidth.length; i++) {
            // TODO: do not assume, only elements in Score are Parts and in Parts are Measures...
            var measureNewWidth = maxMeasureWidth[i];
            for (var j = 0; j < this.length; j++) {
                var part = this.get(j);
                var measure = part.get(i);
                var rendOp = measure.renderOptions;
                rendOp.width = measureNewWidth;
                rendOp.left = currentLeft;
            }
            currentLeft += measureNewWidth;
        }
        return this;
    };    

	
	
	stream.tests = function () {
	    test( "music21.stream.Stream", function() {
	        var s = new music21.stream.Stream();
	        s.append( new music21.note.Note("C#5"));
	        s.append( new music21.note.Note("D#5"));
	        var n =  new music21.note.Note("F5");
	        n.duration.type = 'half';
	        s.append(n);
	        equal (s.length, 3, "Simple stream length");
	    });

       test( "music21.stream.Stream.duration", function() {
            var s = new music21.stream.Stream();
            equal (s.duration.quarterLength, 0, "EmptyString QuarterLength");
            s.append( new music21.note.Note("C#5"));
            equal (s.duration.quarterLength, 1.0, "1 quarter QuarterLength");
            var n =  new music21.note.Note("F5");
            n.duration.type = 'half';
            s.append(n);
            equal (s.duration.quarterLength, 3.0, "3 quarter QuarterLength");
            s.duration = new music21.duration.Duration(3.0);
            s.append( new music21.note.Note("D#5"));
            equal (s.duration.quarterLength, 3.0, "overridden duration -- remains");
            
            var sc = new music21.stream.Score();
            var p1 = new music21.stream.Part();
            var p2 = new music21.stream.Part();
            var m1 = new music21.stream.Measure();
            var m2 = new music21.stream.Measure();
            var n11 = new music21.note.Note();
            var n12 = new music21.note.Note();
            n12.duration.type = 'half';
            var n13 = new music21.note.Note();
            n13.duration.type = 'eighth'; // incomplete measure
            m1.append(n11);
            m1.append(n12);
            m1.append(n13);
            var n21 = new music21.note.Note();
            n21.duration.type = 'whole';
            m2.append(n21);
            p1.append(m1);
            p2.append(m2);
            sc.insert(0, p1);
            sc.insert(0, p2);
            equal (sc.duration.quarterLength, 4.0, 'duration of streams with nested parts');
            equal (sc.flat.duration.quarterLength, 4.0, 'duration of flat stream with overlapping notes');
            n21.duration.type = 'half';
            equal (sc.duration.quarterLength, 3.5, 'new duration with nested parts');
            equal (sc.flat.duration.quarterLength, 3.5, 'new duration of flat stream');       
        });
       
       
        test( "music21.stream.Stream.insert and offsets", function () {
            var s = new music21.stream.Stream();
            s.append( new music21.note.Note("C#5"));
            var n3 = new music21.note.Note("E5");
            s.insert(2.0, n3);
            var n2 = new music21.note.Note("D#5");
            s.insert(1.0, n2);
            equal (s.get(0).name, 'C#');
            equal (s.get(1).name, 'D#');
            equal (s.get(2).name, 'E');
            equal (s.get(0).offset, 0.0);
            equal (s.get(1).offset, 1.0);
            equal (s.get(2).offset, 2.0);
            var p = new music21.stream.Part();
            var m1 = new music21.stream.Measure();
            var n1 = new music21.note.Note("C#");
            n1.duration.type = 'whole';
            m1.append(n1);
            var m2 = new music21.stream.Measure();
            var n2 = new music21.note.Note("D#");
            n2.duration.type = 'whole';
            m2.append(n2);
            p.append(m1);
            p.append(m2);
            equal (p.get(0).get(0).offset, 0.0);
            var pf = p.flat;
            equal (pf.get(1).offset, 4.0);
            var pf2 = p.flat; // repeated calls do not change
            equal (pf2.get(1).offset, 4.0, 'repeated calls do not change offset');
            var pf3 = pf2.flat;
            equal (pf3.get(1).offset, 4.0, '.flat.flat does not change offset');
            
        });
	    
	    test( "music21.stream.Stream.canvas", function() {
	        var s = new music21.stream.Stream();
	        s.append( new music21.note.Note("C#5"));
	        s.append( new music21.note.Note("D#5"));
	        var n =  new music21.note.Note("F5");
	        n.duration.type = 'half';
	        s.append(n);
	        var c = s.createNewCanvas(100, 50);
	        equal (c.attr('width'), 100, 'stored width matches');
	        equal (c.attr('height'), 50, 'stored height matches');
	    });  

        test( "music21.stream.Stream.getElementsByClass", function() {
            var s = new music21.stream.Stream();
            var n1 = new music21.note.Note("C#5");
            var n2 = new music21.note.Note("D#5");
            var r = new music21.note.Rest();
            var tc = new music21.clef.TrebleClef();
            s.append( tc );
            s.append( n1 );
            s.append( r );
            s.append( n2 );
            var c = s.getElementsByClass('Note');
            equal (c.length, 2, 'got two notes');
            equal (c.get(0), n1, 'n1 first');
            equal (c.get(1), n2, 'n2 second');
            c = s.getElementsByClass('Clef');
            equal (c.length, 1, 'got clef from subclass');
            c = s.getElementsByClass(['Note', 'TrebleClef']);
            equal (c.length, 3, 'got multiple classes');
            c = s.getElementsByClass('GeneralNote');            
            equal (c.length, 3, 'got multiple subclasses');
        });  
        test( "music21.stream.Stream appendNewCanvas ", function() { 
            var n = new music21.note.Note("G3");
            var s = new music21.stream.Measure();
            s.append(n);
            s.appendNewCanvas(document.body);
            equal (s.length, 1, 'ensure that should have one note');
            var n1 = new music21.note.Note("G3");
            var s1 = new music21.stream.Measure();
            s1.append(n1);
            var n2 = new music21.note.Note("G3");
            s1.append(n2);
            var n3 = new music21.note.Note("G3");
            s1.append(n3);
            var n4 = new music21.note.Note("G3");
            s1.append(n4);
            var div1 = s1.editableAccidentalCanvas();
            $(document.body).append(div1);
        });
	};
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.stream = stream;
	}		
	return stream;
});