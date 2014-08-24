/**
 * music21j -- Javascript reimplementation of Core music21 features.  
 * music21/duration -- duration routines
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

define(['./common', './prebase', 'jquery'], 
        function(common, prebase, $) {

	var duration = {};

	duration.typeFromNumDict = {
	        1: 'whole',
	        2: 'half',
	        4: 'quarter',
	        8: 'eighth',
	        16: '16th',
	        32: '32nd',
	        64: '64th',
	        128: '128th',
	        256: '256th',
	        512: '512th',
	        1024: '1024th',
	        0: 'zero',
	        '0.5': 'breve',
	        '0.25': 'longa',
	        '0.125': 'maxima',
	        '0.0625': 'duplex-maxima',
	};
	duration.quarterTypeIndex = 6; // where is quarter in this?
	duration.ordinalTypeFromNum = ['duplex-maxima','maxima','longa','breve','whole','half','quarter','eighth','16th','32nd','64th','128th', '256th', '512th', '1024th'];
	duration.vexflowDurationArray = [undefined, undefined, undefined, undefined, 'w', 'h', 'q', '8', '16', '32', undefined, undefined, undefined, undefined, undefined];
	
	duration.Duration = function (ql) {
	    prebase.ProtoM21Object.call(this, ql);
	    this.classes.push('Duration');
	    this._quarterLength = 1.0;
	    this._dots = 0;
		this._durationNumber = undefined;
		this._type = 'quarter';
		this._tuplets = [];
		
        this._cloneCallbacks._tuplets = function (tupletKey, ret, obj) {
            // make sure that tuplets clone properly
            var newTuplets = [];
            for (var i = 0; i < obj[tupletKey].length; i++) {
                var newTuplet = obj[tupletKey][i].clone();
                //console.log('cloning tuplets', obj[tupletKey][i], newTuplet);
                newTuplets.push(newTuplet);
            }
            ret[tupletKey] = newTuplets;
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
					var typeNumber = $.inArray(typeIn, duration.ordinalTypeFromNum);
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
		            var typeNumber = $.inArray(this.type, duration.ordinalTypeFromNum);
					var vd = duration.vexflowDurationArray[typeNumber];
					if (this.dots > 0) {
					    for (var i = 0; i < this.dots; i++) {
	                        vd += "d"; // vexflow does not handle double dots .. or does it???					        
					    }
					}
					return vd;
				}
			}
		});
		

	    if (typeof(ql) == 'string') {
	    	this.type = ql;
	    } else {
	    	this.quarterLength = ql;
	    }
	    //alert(ql + " " + this.type + " " + this.dots);
	};
    duration.Duration.prototype = new prebase.ProtoM21Object();
    duration.Duration.prototype.constructor = duration.Duration;
    duration.Duration.prototype._findDots = function (ql) {
        if (ql == 0) { return 0; } // zero length stream probably;
        var typeNumber = $.inArray(this._type, duration.ordinalTypeFromNum);
        var powerOfTwo = Math.pow(2, duration.quarterTypeIndex - typeNumber);
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
    duration.Duration.prototype.updateQlFromFeatures = function () {
        var typeNumber = $.inArray(this._type, duration.ordinalTypeFromNum); // must be set property
        var undottedQuarterLength = Math.pow(2, duration.quarterTypeIndex - typeNumber);
        var dottedMultiplier = 1 + ( (Math.pow(2, this._dots) - 1) / Math.pow(2, this._dots) );
        var unTupletedQl = undottedQuarterLength * dottedMultiplier;
        var tupletCorrectedQl = unTupletedQl;
        this._tuplets.forEach( function(tuplet) {
            tupletCorrectedQl *= tuplet.tupletMultiplier();
        });
        this._quarterLength = tupletCorrectedQl;
    };
    
    duration.Duration.prototype.updateFeaturesFromQl = function () {
        var ql = this._quarterLength;
        var powerOfTwo = Math.floor(Math.log(ql+.00001)/Math.log(2));
        var typeNumber = duration.quarterTypeIndex - powerOfTwo;
        this._type = duration.ordinalTypeFromNum[typeNumber];
        //alert(this._findDots);
        this._dots = this._findDots(ql);

        var undottedQuarterLength = Math.pow(2, duration.quarterTypeIndex - typeNumber);
        var dottedMultiplier = 1 + ( (Math.pow(2, this._dots) - 1) / Math.pow(2, this._dots) );
        var unTupletedQl = undottedQuarterLength * dottedMultiplier;
        if (unTupletedQl != ql && ql != 0) {
            typeNumber -= 1;
            this._type = duration.ordinalTypeFromNum[typeNumber]; // increase type: eighth to quarter etc.
            unTupletedQl = unTupletedQl * 2;
            var tupletRatio = ql/unTupletedQl;
            var ratioRat = common.rationalize(tupletRatio);
            if (ratioRat === undefined) {
                // probably a Stream with a length that is inexpressable;
            } else {
                var t = new duration.Tuplet(ratioRat.denominator, ratioRat.numerator, new duration.Duration(unTupletedQl));
                this.appendTuplet(t, true); // skipUpdateQl                    
            }
            //console.log(ratioRat, ql, unTupletedQl);
        }
    };
    
    duration.Duration.prototype.appendTuplet = function (newTuplet, skipUpdateQl) {
        newTuplet.frozen = true;
        this._tuplets.push(newTuplet);
        if (skipUpdateQl != true) {
            this.updateQlFromFeatures();                
        }
    };

    
    /**
     * Tuplet
     * @constructor
     */
	duration.Tuplet = function (numberNotesActual, numberNotesNormal, 
	        durationActual, durationNormal) {
	    prebase.ProtoM21Object.call(this);
	    this.classes.push('Tuplet');
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
	    this.tupletNormalShow = undefined; // undefined, 'ratio' for ratios, 'type' for ratioed notes (does not work)
	    
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
	               ordStr = common.ordinalAbbreviation(numNormal, true); // plural
	               return 'Tuplet of ' + numActual.toString() + '/' + numNormal.toString() + ordStr;
	           },
	       },
	    });
	    
	};
    duration.Tuplet.prototype = new prebase.ProtoM21Object();
    duration.Tuplet.prototype.constructor = duration.Tuplet;

    duration.Tuplet.prototype.setDurationType = function (type) {
        if (self.frozen == true) {
            throw ("A frozen tuplet (or one attached to a duration) is immutable");    
        }
        this.durationActual = new duration.Duration(type);
        this.durationNormal = this.durationActual;
        return this.durationActual;
    };
    
    duration.Tuplet.prototype.setRatio = function (actual, normal) {
        if (self.frozen == true) {
            throw ("A frozen tuplet (or one attached to a duration) is immutable");    
        }
        this.numberNotesActual = actual || 3;
        this.numberNotesNormal = normal || 2;
    };
    duration.Tuplet.prototype.totalTupletLength = function () {
        return this.numberNotesNormal * this.durationNormal.quarterLength;
    };
    duration.Tuplet.prototype.tupletMultiplier = function () {
        var lengthActual = this.durationActual.quarterLength;
        return (this.totalTupletLength() / (
                this.numberNotesActual * lengthActual));
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
            ok(true, 'quarter note triplets displayed');
            
            
            var m6 = new music21.stream.Measure();
            m6.renderOptions.staffLines = 1;
            m6.timeSignature = new music21.meter.TimeSignature('2/4');
            var n6 = new music21.note.Note('B4');
            n6.duration.quarterLength = 2/3;
            n6.duration.tuplets[0].durationNormal.type = 'eighth';
            n6.duration.tuplets[0].tupletNormalShow = 'ratio';
            
            var n7 = new music21.note.Note('B4');
            n7.duration.quarterLength = 1/3;
            n7.duration.tuplets[0].tupletNormalShow = 'ratio';

            m6.append(n6);
            m6.append(n7);
            m6.append(n7.clone());
            var n6clone = n6.clone();
            m6.append(n6clone);
            m6.appendNewCanvas();
            ok(true, 'tuplets beginning with different type than original');
            equal(n6.duration.tuplets[0] !== n6clone.duration.tuplets[0], true, 'tuplet should not be the same object after clone');
	    });
        test( "music21.duration.Tuplet multiple parts", function () { 
            var s2 = new music21.stream.Measure();
            s2.timeSignature = new music21.meter.TimeSignature('3/2');
            var na1 = new music21.note.Note('F4');
            var na2 = new music21.note.Note('E4');
            s2.append(na1);
            s2.append(na2);
            for (var i = 0; i < 10; i++) {
                var n1 = new music21.note.Note('F4');
                n1.pitch.diatonicNoteNum += i;
                n1.duration.quarterLength = 2/5;
                n1.duration.tuplets[0].tupletNormalShow = 'ratio';
                if (i % 5 == 0) {
                    n1.articulations.push( new music21.articulations.Accent() );
                }
                s2.append(n1);
            }
            var s3 = new music21.stream.Measure();
            s3.timeSignature = new music21.meter.TimeSignature('3/2');
            s3.append( new music21.note.Note("B5", 6.0));
            var p = new music21.stream.Part();
            p.append(s2);
            p.append(s3);
            
            var m4 = new music21.stream.Measure();
            m4.timeSignature = new music21.meter.TimeSignature('3/2');
            m4.append( new music21.note.Note("B3", 6.0));
            var m5 = new music21.stream.Measure();
            m5.timeSignature = new music21.meter.TimeSignature('3/2');
            m5.append( new music21.note.Note("B3", 6.0));
            var p2 = new music21.stream.Part();
            p2.append(m4);
            p2.append(m5);
        
            var sc = new music21.stream.Score();
            sc.insert(0, p);
            sc.insert(0, p2);
            sc.appendNewCanvas();
            ok(true, '5:4 tuplets in 3/2 with multiple parts');            
        });
	};
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.duration = duration;
	}
	return duration;	
});
