/**
 * music21j -- Javascript reimplementation of Core music21 features.  
 * music21/duration -- duration routines
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

define(function(require) {

	var duration = {};
	
	var Music21DurationArray = ['breve','whole','half','quarter','eighth','16th','32nd','64th','128th'];
	var VexflowDurationArray = [undefined, 'w', 'h', 'q', '8', '16', '32', undefined, undefined];
	
	duration.Duration = function (ql) {
	    this.classes = ['Duration'];
	    this._quarterLength = 1.0;
	    this._dots = 0;
		this._powerOfTwo = undefined;
		this._durationNumber = undefined;
		this._type = 'quarter';
	
		this.inClass = music21._inClass;
	
	    this._findDots = function (ql) {
	        var undottedQL = Math.pow(2, this._powerOfTwo);
	    	// alert(undottedQL * 1.5 + " " + ql)
	        if (Math.abs(undottedQL * 1.5 - ql) < 0.0001) {
	           return 1;
	        } else if (Math.abs(undottedQL * 1.75 - ql) < 0.0001) {
	           return 2;
	        } else {
	           return 0;
	        }
	    };
	
	    Object.defineProperties(this, {
	    	'dots': { 
	    		get: function () { 
			       		return this._dots;
	    			},
	    		set: function (numDots) {
	    			var undottedQL = this._powerOfTwo;
	    			var dottedMultiplier = 1 + ( (Math.pow(2, numDots) - 1) / Math.pow(2, numDots) );
	    			var newQL = undottedQL * dottedMultiplier;
	    			this._dots = numDots;
	    			this._quarterLength = newQL;
	    		}
	    	},
	    	'quarterLength': {
				get: function () {
					return this._quarterLength;
				},
				set: function (ql) {
					if (ql == undefined) {
						ql = 1.0;
					}
					this._quarterLength = ql;
					this._powerOfTwo = Math.floor(Math.log(ql+.00001)/Math.log(2));
					this._durationNumber = 3 - this._powerOfTwo;
					this._type = Music21DurationArray[this._durationNumber];
					//alert(this._findDots);
					this._dots = this._findDots(ql);	
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
						return;
					}
					this._durationNumber = typeNumber;
					this._powerOfTwo = Math.pow(2, 3 - typeNumber);
					this._type = typeIn;
					var dottedMultiplier = 1 + ( (Math.pow(2, this.dots) - 1) / Math.pow(2, this.dots) );
					this._quarterLength = this._powerOfTwo * dottedMultiplier;
				}
			},
			'vexflowDuration': {
				get: function() {
					var vd = VexflowDurationArray[this._durationNumber];
					if (this._dots == 1) {
						vd += "d"; // vexflow does not handle double dots
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

	// end of define
	if (typeof(music21) != "undefined") {
		music21.duration = duration;
	}
	return duration;	
});
