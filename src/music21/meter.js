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
        this.numerator = 4;
        this.denominator = 4;
        
        if (typeof(meterString) == 'string') {
            var meterList = meterString.split('/');
            this.numerator = parseInt(meterList[0])
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