/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/meter -- TimeSignature objects
 * 
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define(['music21/base', 'music21/duration'], function(require) {
    var meter = {};
    
    meter.TimeSignature = function (meterString) {
        music21.base.Music21Object.call(this);
        this.classes.push('TimeSignature');
        this._numerator = 4;
        this._denominator = 4;
        
        Object.defineProperties(this, {
            'numerator' : {
              enumerable: true,
              configurable: true,
              get: function () { return this._numerator; },
              set: function (s) { this._numerator = s; }
            },
            'denominator' : {
                enumerable: true,
                configurable: true,
                get: function () { return this._denominator; },
                set: function (s) { this._denominator = s; }
              },
            'barDuration' : {
                enumerable: true,
                configurable: true,
                get: function () {
                    var ql = 4.0 * this._numerator / this._denominator;
                    return new music21.duration.Duration(ql);
                }
            },
        });

        
        
        if (typeof(meterString) == 'string') {
            var meterList = meterString.split('/');
            this.numerator = parseInt(meterList[0]);
            this.denominator = parseInt(meterList[1]);
        }
    };
    meter.TimeSignature.prototype = new music21.base.Music21Object();
    meter.TimeSignature.prototype.constructor = meter.TimeSignature;
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.meter = meter;
    }       
    return meter;
});