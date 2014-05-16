/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/dynamics -- Dynamics
 * 
 * note that Vex.Flow does not support Dynamics yet and we do not support MIDI dynamics,
 *  so currently of limited value...
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */
define([], function(require) {
	var dynamics = {};
	dynamics.shortNames = ['pppppp', 'ppppp', 'pppp', 'ppp', 'pp', 'p', 'mp', 'mf', 'f', 'fp', 'sf', 'ff', 'fff', 'ffff', 'fffff', 'ffffff'];
	dynamics.longNames = {'ppp': ['pianississimo'],
            'pp': ['pianissimo'],
            'p': ['piano'],
            'mp': ['mezzopiano'],
            'mf': ['mezzoforte'],
            'f': ['forte'],
            'fp': ['fortepiano'],
            'sf': ['sforzando'],
            'ff': ['fortissimo'],
            'fff': ['fortississimo']
           };
	dynamics.englishNames = {'ppp': ['extremely soft'],
               'pp': ['very soft'],
               'p': ['soft'],
               'mp': ['moderately soft'],
               'mf': ['moderately loud'],
               'f': ['loud'],
               'ff': ['very loud'],
               'fff': ['extremely loud']
              };
	dynamics.dynamicStrToScalar = {'None': [.5], //default value
                     'n': [0],
                     'pppp': [0.1],
                     'ppp': [.15],
                     'pp': [.25],
                     'p': [.35],
                     'mp': [.45],
                     'mf': [.55],
                     'f': [.7],
                     'fp': [.75],
                     'sf': [.85],
                     'ff': [.85],
                     'fff': [.9],
                     'ffff': [.95]
                    };    
	
	dynamics.Dynamic = function (value) {    
	    this._value = undefined;
	    this._volumeScalar = undefined;
	    this.longName = undefined;
	    this.englishName = undefined;
	    Object.defineProperties(this, {
	        'value': {
	            get: function() {
	                return this._value;
	            },
	            set: function(value){
	                if (typeof(value) !== 'string') {
	                    //assume number
	                    this._volumeScalar=value;
	                    if (value <= 0) {
	                        this._value = 'n';
	                    }
	                    else if (value < .11) {
	                        this._value = 'pppp';
	                    }
	                    else if (value < .16) {
	                        this._value = 'ppp';
	                    }
	                    else if (value < .26) {
	                        this._value = 'pp';
	                    }
	                    else if (value < .36) {
	                        this._value = 'p';
	                    }
	                    else if (value < .5) {
	                        this._value = 'mp';
	                    }
	                    else if (value < .65) {
	                        this._value = 'mf';
	                    }
	                    else if (value < .8) {
	                        this._value = 'f';
	                    }
	                    else if (value < .9) {
	                        this._value = 'ff';
	                    }
	                    else {
	                        this._value = 'fff';
	                    }
	                }
	                else {
	                    this._value = value;
	                    this._volumeScalar = undefined;
	                }
	                if (this._value in dynamics.longNames){
	                    this.longName = dynamics.longNames[this._value][0];
	                }
	                else {
	                    this.longName = undefined;
	                }
	                if (this._value in dynamics.englishNames){
	                    this.englishName = dynamics.englishNames[this._value][0];
	                }
	                else {
	                    this.englishName = undefined;
	                }
	            }
	        },
	        'volumeScalar': {
	            get: function () {
	                if (this._volumeScalar !== undefined) {
	                    return this._volumeScalar;
	                }
	                else {
	                    if (this._value in dynamics.dynamicStrToScalar){
	                        return dynamics.dynamicStrToScalar[this._value][0];
	                    }
	                }
	            },
	            set: function (value) {
	                if ((typeof(value) === 'number') && (value <= 1) && (value >=0)) {
	                    this._volumeScalar = value;
	                }
	            }
	        }
	    });
	    this.value = value;
	};
	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.dynamics = dynamics;
	}		
	return dynamics;
});