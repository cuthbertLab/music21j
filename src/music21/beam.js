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
         * Module holding beam materials. See {@link music21.beam} namespace.
         * 
         * @exports music21/beam
         */
        function(prebase, duration) {
    /**
     * {@link music21.beam.Beam} and {music21.beam.Beams} objects
     * 
     * @namespace music21.beam
     * @memberof music21
     * @requires music21/prebase
     * @requires music21/duration
     */
    var beam = {};
    
    beam.validBeamTypes = {
        'start': true,
        'stop': true,
        'continue': true,
        'partial': true
    };

    /**
     * Object representing a single beam (e.g., a 16th note that is beamed needs two)
     * 
     * @class Beam
     * @memberof music21.beam
     * @extends music21.prebase.ProtoM21Object
     * @param {string} type - "start", "stop", "continue", "partial"
     * @param {string} direction - only needed for partial beams: "left" or "right"
     * @property {Int|undefined} number - which beam line does this refer to; 8th = 1, 16th = 2, etc. 
     * @property {number|undefined} independentAngle - the angle of this beam if it is different than others (feathered beams)
     */
    beam.Beam = function (type, direction) {
        prebase.ProtoM21Object.call(this);
        this.classes.push('Beam');       
        this.type = type;
        this.direction = direction;
        this.independentAngle = undefined;
        this.number = undefined;
    };
    beam.Beam.prototype = new prebase.ProtoM21Object();
    beam.Beam.prototype.constructor = beam.Beam;

    /**
     * Object representing a collection of Beams
     * 
     * @class Beams
     * @memberof music21.beam
     * @extends music21.prebase.ProtoM21Object
     * @property {Array<music21.beam.Beam>} beamsList - a list of Beam objects
     * @property {Boolean} [feathered=false] - is this a feathered beam.
     * @property {Int} length - length of beamsList
     */
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
     * Append a new {@link music21.beam.Beam} object to this Beams, automatically creating the Beam
     *   object and incrementing the number count.
     *   
     * @memberof music21.beam.Beams
     * @param {string} type - the type (passed to {@link music21.beam.Beam})
     * @param {string} [direction=undefined] - the direction if type is "partial"
     * @returns {music21.beam.Beam} newly appended object
     */
    beam.Beams.prototype.append = function (type, direction) {
        var obj = new beam.Beam(type, direction);
        obj.number = this.beamsList.length + 1;
        this.beamsList.push(obj);
        return obj;
    };
    /**
     * A quick way of setting the beams list for a particular duration, for
        instance, fill("16th") will clear the current list of beams in the
        Beams object and add two beams.  fill(2) will do the same (though note
        that that is an int, not a string).

     * It does not do anything to the direction that the beams are going in,
        or by default.  Either set type here or call setAll() on the Beams
        object afterwards.

     * Both "eighth" and "8th" work.  Adding more than six beams (i.e. things
        like 512th notes) raises an error.

     * @memberof music21.beam.Beams
     * @param {string|Int} level - either a string like "eighth" or a number like 1 (="eighth")
     * @param {string} type - type to fill all beams to.
     * @returns {this}
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
        return this;
    };
    
    /**
     * Get the beam with the given number or throw an exception.
     * 
     * @memberof music21.beam.Beams
     * @param {Int} number - the beam number to retrieve (usually one less than the position in `.beamsList`)
     * @returns {music21.beam.Beam}
     */
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
    
    /**
     * Get an Array of all the numbers for the beams
     * 
     * @memberof music21.beam.Beams
     * @returns {Array<Int>} all the numbers
     */
    beam.Beams.prototype.getNumbers = function () {
        var numbers = [];
        for (var i = 0; i < this.length; i++ ) {
            numbers.push(this.beamsList[i].number);            
        }
        return numbers;
    };

    /**
     * Returns the type + "-" + direction (if direction is defined)
     * for the beam with the given number.
     * 
     * @param {Int} number
     * @returns {music21.beam.Beam|undefined}
     */
    beam.Beams.prototype.getTypeByNumber = function(number) {
        var beamObj = this.getByNumber(number);
        if (beamObj.direction === undefined) {
            return beamObj.type;
        } else {
            var x = beamObj.type + '-' + beamObj.direction;
            return x;
        }
    };

    /**
     * Get an Array of all the types for the beams
     * 
     * @memberof music21.beam.Beams
     * @returns {Array<string>} all the types
     */
    beam.Beams.prototype.getTypes = function () {
        var types = [];
        for (var i = 0; i < this.length; i++ ) {
            types.push(this.beamsList[i].type);   
        }
        return types;
    };

    /**
     * Set all the {@link music21.beam.Beam} objects to a given type/direction
     * 
     * @memberof music21.beam.Beams
     * @param {string} type - beam type
     * @param {string} [direction] - beam direction
     * @returns {this}
     */
    beam.Beams.prototype.setAll = function (type, direction) {
        if (beam.validBeamTypes[type] === undefined) {
            throw('invalid beam type');
        }
        for (var i = 0; i < this.length; i++ ) {
            var beam = this.beamsList[i];
            beam.type = type;
            beam.direction = direction;
        }
        return this;
    };
    /**
     * Set the {@link music21.beam.Beam} object specified by `number` to a given type/direction
     * 
     * @memberof music21.beam.Beams
     * @param {Int} number
     * @param {string} type
     * @param {string} [direction]
     * @returns {this}
     */
    beam.Beams.prototype.setByNumber = function (number, type, direction) {
        if (direction === undefined) {
            var splitit = type.split('-');
            type = splitit[0];
            direction = splitit[1];
        }
        if (beam.validBeamTypes[type] === undefined) {
            throw('invalid beam type');
        }
        for (var i = 0; i < this.length; i++) {
            if (this.beamsList[i].number == number) {
                this.beamsList[i].type = type;
                this.beamsList[i].direction = direction;
            }
        }
        return this;
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