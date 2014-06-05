/**
 * music21j -- Javascript reimplementation of Core music21 features.  
 * music21/duration -- duration routines
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

define(['music21/common'], function(require) {

	var duration = {};
	
	var Music21DurationArray = ['breve','whole','half','quarter','eighth','16th','32nd','64th','128th'];
	var VexflowDurationArray = [undefined, 'w', 'h', 'q', '8', '16', '32', undefined, undefined];
	
	duration.Duration = function (ql) {
	    this.classes = ['Duration'];
	    this._quarterLength = 1.0;
	    this._dots = 0;
		this._durationNumber = undefined;
		this._type = 'quarter';
		this._tuplets = [];
	
		this.isClassOrSubclass = function (testClass) {
		    if (testClass instanceof Array == false) {
		        testClass = [testClass];
		    }
		    for (var i = 0; i < testClass.length; i++) {
		        if ($.inArray(testClass[i], this.classes) != -1) {
		            return true;
		        }   
		    }
		    return false;
		};
	
	    this._findDots = function (ql) {
	        if (ql == 0) { return 0; } // zero length stream probably;
	        var typeNumber = $.inArray(this._type, Music21DurationArray);
            var powerOfTwo = Math.pow(2, 3 - typeNumber);
	    	// alert(undottedQL * 1.5 + " " + ql)
            //console.log('find dots called on ql: ', ql, typeNumber, powerOfTwo);
            for (var dotsNum = 0; dotsNum <= 4; dotsNum++) {
                var dotMultiplier = (Math.pow(2, dotsNum)-1.0)/(Math.pow(2, dotsNum));
                var durationMultiplier = 1 + dotMultiplier;
                if (Math.abs( (powerOfTwo * durationMultiplier) - ql) < 0.0001) {
                    return dotsNum;
                }
            }
            if (music21.debug) {
                console.log('no dots available for ql; probably a tuplet', ql);
            }
            return 0;
	    };
	
	    Object.defineProperties(this, {
	    	'dots': { 
	    		get: function () { 
			       		return this._dots;
	    			},
	    		set: function (numDots) {
                    this._dots = numDots;
                    this.updateQlFromFeatures();
	    		}
	    	},
	    	'quarterLength': {
				get: function () {
					return this._quarterLength;
				},
				set: function (ql) {
					if (ql === undefined) {
						ql = 1.0;
					}
					this._quarterLength = ql;
					this.updateFeaturesFromQl();
				}
			},
			'type': {
				get: function () {
					return this._type;
				},
				set: function (typeIn) {
					var typeNumber = $.inArray(typeIn, Music21DurationArray);
					if (typeNumber == -1) {
						console.log('invalid type ' + typeIn);
                        throw('invalid type ' + typeIn);
					}
                    this._type = typeIn;
					this.updateQlFromFeatures();
				}
			},
			'tuplets' : {
			    enumerable: true,
			    get: function () { return this._tuplets; }
			},
			'vexflowDuration': {
				get: function() {
		            var typeNumber = $.inArray(this.type, Music21DurationArray);
					var vd = VexflowDurationArray[typeNumber];
					if (this.dots == 1) {
						vd += "d"; // vexflow does not handle double dots
					}
					return vd;
				}
			}
		});
		
	    this.updateQlFromFeatures = function () {
	        var typeNumber = $.inArray(this._type, Music21DurationArray); // must be set property
            var undottedQuarterLength = Math.pow(2, 3 - typeNumber);
            var dottedMultiplier = 1 + ( (Math.pow(2, this._dots) - 1) / Math.pow(2, this._dots) );
            var unTupletedQl = undottedQuarterLength * dottedMultiplier;
            var tupletCorrectedQl = unTupletedQl;
            this._tuplets.forEach( function(tuplet) {
                tupletCorrectedQl *= tuplet.tupletMultiplier();
            });
            this._quarterLength = tupletCorrectedQl;
	    };
	    
        this.updateFeaturesFromQl = function () {
            var ql = this._quarterLength;
            var powerOfTwo = Math.floor(Math.log(ql+.00001)/Math.log(2));
            var typeNumber = 3 - powerOfTwo;
            this._type = Music21DurationArray[typeNumber];
            //alert(this._findDots);
            this._dots = this._findDots(ql);

            var undottedQuarterLength = Math.pow(2, 3 - typeNumber);
            var dottedMultiplier = 1 + ( (Math.pow(2, this._dots) - 1) / Math.pow(2, this._dots) );
            var unTupletedQl = undottedQuarterLength * dottedMultiplier;
            if (unTupletedQl != ql && ql != 0) {
                typeNumber -= 1;
                this._type = Music21DurationArray[typeNumber]; // increase type: eighth to quarter etc.
                unTupletedQl = unTupletedQl * 2;
                var tupletRatio = ql/unTupletedQl;
                var ratioRat = music21.common.rationalize(tupletRatio);
                if (ratioRat === undefined) {
                    console.log("cannot find ratio! ", tupletRatio, ql, unTupletedQl);
                }
                var t = new duration.Tuplet(ratioRat.denominator, ratioRat.numerator, new duration.Duration(unTupletedQl));
                this.appendTuplet(t, true); // skipUpdateQl
                //console.log(ratioRat, ql, unTupletedQl);
            }
        };
	    
	    this.appendTuplet = function (newTuplet, skipUpdateQl) {
            newTuplet.frozen = true;
            this._tuplets.push(newTuplet);
            if (skipUpdateQl != true) {
                this.updateQlFromFeatures();                
            }
	    };

	    if (typeof(ql) == 'string') {
	    	this.type = ql;
	    } else {
	    	this.quarterLength = ql;
	    }
	    //alert(ql + " " + this.type + " " + this.dots);
	};
	
	duration.Tuplet = function (numberNotesActual, numberNotesNormal, 
	        durationActual, durationNormal) {
	    this.numberNotesActual = numberNotesActual || 3;
	    this.numberNotesNormal = numberNotesNormal || 2;
	    this.durationActual = durationActual || new duration.Duration(0.5);
	    if (typeof(this.durationActual) == 'number') {
	        this.durationActual = new duration.Duration(this.durationActual);
	    }
	    this.durationNormal = durationNormal || this.durationActual;
	    
	    this.frozen = false;
	    this.type = undefined;
	    this.bracket = true;
	    this.placement = 'above';
	    this.tupletActualShow = 'number'; // 'number', 'type', or 'none'
	    this.tupletNormalShow = undefined; // for ratios
	    
	    this.setDurationType = function (type) {
	        if (self.frozen == true) {
	            throw ("A frozen tuplet (or one attached to a duration) is immutable");    
	        }
	        this.durationActual = new duration.Duration(type);
	        this.durationNormal = this.durationActual;
	        return this.durationActual;
	    };
	    
	    this.setRatio = function (actual, normal) {
	        if (self.frozen == true) {
                throw ("A frozen tuplet (or one attached to a duration) is immutable");    
            }
	        this.numberNotesActual = actual || 3;
	        this.numberNotesNormal = normal || 2;
	    };
	    this.totalTupletLength = function () {
	        return this.numberNotesNormal * this.durationNormal.quarterLength;
	    };
	    this.tupletMultiplier = function () {
	        var lengthActual = this.durationActual.quarterLength;
	        return (this.totalTupletLength() / (
	                this.numberNotesActual * lengthActual));
	    };
	    Object.defineProperties(this, {
	       'fullName': {
	           enumerable: true,
	           configurable: true,
	           get: function () {
	               // actual is what is presented to viewer
	               var numActual = this.numberNotesActual;
	               var numNormal = this.numberNotesNormal;
	               
	               if (numActual == 3 && numNormal == 2) {
                       return 'Triplet';	                   
	               } else if (numActual == 5 && (numNormal == 4 || numNormal == 2)) {
	                   return 'Quintuplet';
	               } else if (numActual == 6 && numNormal == 4) {
	                   return 'Sextuplet';
	               }
	               ordStr = music21.common.ordinalAbbreviation(numNormal, true); // plural
	               return 'Tuplet of ' + numActual.toString() + '/' + numNormal.toString() + ordStr;
	           },
	       },
	    });
	    
	};

	duration.tests = function () {
	    test( "music21.duration.Duration", function () {
	        var d = new music21.duration.Duration(1.0);
	        equal(d.type, 'quarter', 'got quarter note from 1.0');
	        equal(d.dots, 0, 'got no dots');
	        equal(d.quarterLength, 1.0, 'got 1.0 from 1.0');
            equal(d.vexflowDuration, 'q', 'vexflow q');
            d.type = 'half';
            equal(d.type, 'half', 'got half note from half');
            equal(d.dots, 0, 'got no dots');
            equal(d.quarterLength, 2.0, 'got 2.0 from half');
            equal(d.vexflowDuration, 'h', 'vexflow h');
            d.quarterLength = 6.0;
            equal(d.type, 'whole');
            equal(d.dots, 1, 'got one dot from 6.0');
            equal(d.quarterLength, 6.0, 'got 6.0');
            equal(d.vexflowDuration, 'wd', 'vexflow duration wd');
            d.quarterLength = 7.75;
            equal(d.type, 'whole');
            equal(d.dots, 4, 'got four dots from 7.75');
	    });

	    test( "music21.duration.Tuplet", function () { 
            var d = new music21.duration.Duration(0.5);
            var t = new music21.duration.Tuplet(5, 4);
            equal(t.tupletMultiplier(), 0.8, 'tuplet multiplier');
            d.appendTuplet(t);
            equal(t.frozen, true, 'tuplet is frozen');
            equal(d._tuplets[0], t, 'tuplet appended');
            equal(d.quarterLength, 0.4, 'quarterLength Updated');
            
            
            var d2 = new music21.duration.Duration(1/3);
            equal(d2.type, 'eighth', 'got eighth note from 1/3');
            equal(d2.dots, 0, 'got no dots');
            equal(d2.quarterLength, 1/3, 'got 1/3 from 1/3');
            var t2 = d2.tuplets[0];
            equal(t2.numberNotesActual, 3, '3/2 tuplet');
            equal(t2.numberNotesNormal, 2, '3/2 tuplet');
            equal(t2.durationActual.quarterLength, 0.5);
            equal(t2.tupletMultiplier(), 2/3, '2/3 tuplet multiplier');
            equal(t2.totalTupletLength(), 1.0, 'total tuplet == 1.0');
            
            var s = new music21.stream.Stream();
            s.timeSignature = new music21.meter.TimeSignature('2/2');
            for (var i = 0; i < 6; i++) {
                var n1 = new music21.note.Note('C4');
                n1.duration.quarterLength = 2/3;
                if (i % 3 == 0) {
                    n1.articulations.push( new music21.articulations.Accent() );
                }
                s.append(n1);
            }
            s.appendNewCanvas();
            
            var s2 = new music21.stream.Stream();
            s2.timeSignature = new music21.meter.TimeSignature('3/2');
            var na1 = new music21.note.Note('F4');
            var na2 = new music21.note.Note('E4');
            s2.append(na1);
            s2.append(na2);
            for (var i = 0; i < 10; i++) {
                var n1 = new music21.note.Note('F4');
                n1.pitch.diatonicNoteNum += i;
                n1.duration.quarterLength = 2/5;
                if (i % 5 == 0) {
                    n1.articulations.push( new music21.articulations.Accent() );
                }
                s2.append(n1);
            }
            s2.appendNewCanvas();

	    
	    });
	};
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.duration = duration;
	}
	return duration;	
});
