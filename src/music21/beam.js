/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/beam -- Beams and Beam class
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */


define(['./prebase', './duration'],
        
        /**
         * @exports music21/beam
         */
        function(prebase, duration) {
    var beam = {};
    
    beam.Beam = function (type, direction) {
        prebase.ProtoM21Object.call(this);
        this.classes.push('Beam');       
        this.type = type; // start, stop, continue, partial
        this.direction = direction;  // left or right for partial
        this.independentAngle = undefined;
        // number represents which beam line referred to
        // 8th, 16th, etc represented as 1, 2, ...
        this.number = undefined;
    };
    beam.Beam.prototype = new prebase.ProtoM21Object();
    beam.Beam.prototype.constructor = beam.Beam;

    beam.Beams = function () {
        prebase.ProtoM21Object.call(this);
        this.classes.push('Beams'); 
        this.beamsList = [];
        this.feathered = false;
        
    };
    beam.Beams.prototype = new prebase.ProtoM21Object();
    beam.Beams.prototype.constructor = beam.Beams;
    Object.defineProperties(beam.Beams.prototype, {
        'length': {
            enumerable: true,
            'get': function() { return this.beamsList.length; }
        }
    } );
    
    /**
     * Append a new Beam object to this Beams, automatically creating the Beam
     *   object and incrementing the number count.
     * @param {string} type
     * @param {string} direction
     */
    beam.Beams.prototype.append = function (type, direction) {
        var obj = new beam.Beam(type, direction);
        obj.number = this.beamsList.length + 1;
        this.beamsList.push(obj);
    };
    /**
     * A quick way of setting the beams list for a particular duration, for
        instance, fill("16th") will clear the current list of beams in the
        Beams object and add two beams.  fill(2) will do the same (though note
        that that is an int, not a string).

        It does not do anything to the direction that the beams are going in,
        or by default.  Either set type here or call setAll() on the Beams
        object afterwards.

        Both "eighth" and "8th" work.  Adding more than six beams (i.e. things
        like 512th notes) raises an error.

     * @param {string} level
     * @param {string} type
     */
    beam.Beams.prototype.fill = function (level, type) {
        this.beamsList = [];
        var count = 1;
        if (level == 1 || level == '8th' || level == duration.typeFromNumDict[8]) {
            count = 1;
        } else if (level == 2 || level == duration.typeFromNumDict[16]) {
            count = 2;            
        } else if (level == 3 || level == duration.typeFromNumDict[32]) { 
            count = 3;            
        } else if (level == 4 || level == duration.typeFromNumDict[64]) {   
            count = 4; 
        } else if (level == 5 || level == duration.typeFromNumDict[128]) {
            count = 5;
        } else if (level == 6 || level == duration.typeFromNumDict[256]) {
            count = 6;
        } else {
            throw('cannot fill beams for level ' + level);
        }
        for (var i = 1; i <= count; i++) {
            var obj = new beam.Beam();
            obj.number = i;
            this.beamsList.push(obj);
        }
        if (type !== undefined) {
            this.setAll(type);
        };
    };
    
    beam.Beams.prototype.getByNumber = function (number) {
        if (!( number in this.getNumbers() )) {
            throw("beam number error");
        } 
        for (var i = 0; i < this.length; i++ ) {
            if (this.beamsList[i].number == number) {
                return this.beamsList[i];
            }
        }
    };
    
    beam.Beams.prototype.getNumbers = function () {
        var numbers = [];
        for (var i = 0; i < this.length; i++ ) {
            numbers.push(this.beamsList[i].number);            
        }
        return numbers;
    };

    beam.Beams.prototype.getTypeByNumber = function(number) {
        var beamObj = this.getByNumber(number);
        if (beamObj.direction === undefined) {
            return beamObj.type;
        } else {
            var x = beamObj.type + '-' + beamObj.direction;
            return x;
        }
    };

    beam.Beams.prototype.getTypes = function () {
        var types = [];
        for (var i = 0; i < this.length; i++ ) {
            types.push(this.beamsList[i].type);   
        }
        return types;
    };

    beam.Beams.prototype.setAll = function (type, direction) {
        var validBeamTypes = {
                'start': true,
                'stop': true,
                'continue': true,
                'partial': true
        };
        if (validBeamTypes[type] === undefined) {
            throw('invalid beam type');
        }
        for (var i = 0; i < this.length; i++ ) {
            var beam = this.beamsList[i];
            beam.type = type;
            beam.direction = direction;
        }
    };

    beam.Beams.prototype.setByNumber = function (number, type, direction) {
        var validBeamTypes = {
                'start': true,
                'stop': true,
                'continue': true,
                'partial': true
        };
        if (direction === undefined) {
            var splitit = type.split('-');
            type = splitit[0];
            direction = splitit[1];
        }
        if (validBeamTypes[type] === undefined) {
            throw('invalid beam type');
        }
        for (var i = 0; i < this.length; i++) {
            if (this.beamsList[i].number == number) {
                this.beamsList[i].type = type;
                this.beamsList[i].direction = direction;
            }
        }
    };   
    
    beam.tests = function () {
        test('music21.beam.Beams', function () {
            var a = new music21.beam.Beams();
            a.fill('16th');
            a.setAll('start');
            equal(a.getTypes()[0], 'start');
            equal(a.getTypes()[1], 'start');
            
            var b = new music21.beam.Beams();
            b.fill('16th');
            b.setAll('start');
            b.setByNumber(1, 'continue');
            equal(b.beamsList[0].type, 'continue');
            b.setByNumber(2, 'stop');
            equal(b.beamsList[1].type, 'stop');
            b.setByNumber(2, 'partial-right');
            equal(b.beamsList[1].type, 'partial');
            equal(b.beamsList[1].direction, 'right');
            
            
            
        });
    };
    // end of define
    if (typeof(music21) != "undefined") {
        music21.beam = beam;
    }       
    return beam;
 });