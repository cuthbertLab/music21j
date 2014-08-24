/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/meter -- TimeSignature objects
 * 
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define(['./base', './duration'], function(base, duration) {
    var meter = {};
    
    meter.TimeSignature = function (meterString) {
        base.Music21Object.call(this);
        this.classes.push('TimeSignature');
        this._numerator = 4;
        this._denominator = 4;
        this.beatGroups = [];
        
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
            'ratioString' : {
                enumerable: true,
                configurable: true,
                get: function () { return this.numerator.toString() + '/' + this.denominator.toString(); },
                set: function (meterString) {
                    var meterList = meterString.split('/');
                    this.numerator = parseInt(meterList[0]);
                    this.denominator = parseInt(meterList[1]);
                },
            },
            'barDuration' : {
                enumerable: true,
                configurable: true,
                get: function () {
                    var ql = 4.0 * this._numerator / this._denominator;
                    return new duration.Duration(ql);
                }
            },
        });

        if (typeof(meterString) == 'string') {
            this.ratioString = meterString;
        }
    };
    meter.TimeSignature.prototype = new base.Music21Object();
    meter.TimeSignature.prototype.constructor = meter.TimeSignature;
    
    meter.TimeSignature.prototype.computeBeatGroups = function () {
        var tempBeatGroups = [];
        var numBeats = this.numerator;
        var beatValue = this.denominator;
        if (beatValue < 8 && numBeats >= 5) {
            var beatsToEighthNoteRatio = 8/beatValue; // hopefully Int -- right Brian Ferneyhough?
            beatValue = 8;
            numBeats = numBeats * beatsToEighthNoteRatio;
        }
        
        if (beatValue >= 8) {
            while (numBeats >= 5) {
                tempBeatGroups.push([3, beatValue]);
                numBeats -= 3;
            }
            if (numBeats == 4) {
                tempBeatGroups.push([2, beatValue]);
                tempBeatGroups.push([2, beatValue]);
            } else if (numBeats > 0) {
                tempBeatGroups.push([numBeats, beatValue]);
            }
        } else if (beatValue == 2) {
            tempBeatGroups.push([1, 2]);
        } else if (beatValue <= 1) {
            tempBeatGroups.push([1, 1]);
        } else { // 4/4, 2/4, 3/4, standard stuff                
            tempBeatGroups.push([2, 8]);
        }
        return tempBeatGroups;
    };
    meter.TimeSignature.prototype.vexflowBeatGroups = function (Vex) {
        var tempBeatGroups;
        if (this.beatGroups.length > 0) {
            tempBeatGroups = this.beatGroups;
        } else {
            tempBeatGroups = this.computeBeatGroups();
        }
        //console.log(tempBeatGroups);
        var vfBeatGroups = [];
        for (var i = 0; i < tempBeatGroups.length; i++ ) {
            var bg = tempBeatGroups[i];
            vfBeatGroups.push( new Vex.Flow.Fraction(bg[0], bg[1]));
        }
        return vfBeatGroups;

//          if (numBeats % 3 == 0 && beatValue < 4) {
//              // 6/8, 3/8, 9/8, etc.
//              numBeats = numBeats / 3;
//              beatValue = beatValue / 3;
//          }            
    };
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.meter = meter;
    }       
    return meter;
});
