/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/jsonPickle -- Conversion from music21p jsonpickle streams
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

define(function(require) {
    var jsonPickle = {};
    jsonPickle.Converter = function () {
        this.jsonString = "";
        this.m21Version = undefined;
        this.streamJsonObj = undefined;
        this.debug = false;
        this.currentPart = undefined;
        this.lastClef = undefined;
        this.lastKeySignature = undefined;
        this.lastTimeSignature = undefined;
        
        this.run = function (jsonString) {
            var jsonObject = this.toJSjson(jsonString);
            return this.objFromValue(jsonObject);
        };
        this.toJSjson = function (pickleIn) {
            var jsonObj = JSON.parse(pickleIn);
            if (jsonObj.m21Version == undefined) {
                console.log("Not a music21p JSON object");
                return false;
            } else {
                this.m21Version = jsonObj.m21Version['py/tuple'];       
                this.streamJsonObj = jsonObj.stream;
                return this.streamJsonObj;
            }
        };
        this.representsFromM21 = function (m21Json) {
            // not necessarily a Music21Object per se. includes duration etc.
            // crude will not get custom subclasses:
            var objectRef = m21Json['py/object'];
            if (objectRef.indexOf('music21.') === 0) {
                return true;
            } else {
                return false;
            }
        };
        this.representsStream = function (m21Json) {
            // crude will not get custom subclasses including TinyNotation:
            // returns bool
            var objectRef = m21Json['py/object'];
            if (objectRef == null) {
                return false;
            } else if (objectRef.indexOf('music21.stream') === 0) {
                return true;
            } else {
                return false;
            }
        };

        this.knownUnparseables = ['music21.spanner.Line',
                                  'music21.instrument.Instrument',
                                  'music21.layout.StaffGroup',
                                  'music21.layout.StaffLayout',
                                  'music21.layout.SystemLayout',
                                  'music21.layout.PageLayout',
                                  'music21.expressions.TextExpression',
                                  'music21.bar.Barline', // Soon...
                                  'music21.tempo.MetronomeMark', // should be possible
                                  'music21.metadata.Metadata', // Soon...
                                  'music21.beam.Beams', // Soon
                                  'music21.beam.Beam', // Soon
                                  ];
        this.pyObjToJsObj = function (pyObjString) {
            if (pyObjString.indexOf('music21.') === 0) {
                // music21 object -- probably safe
                var newObj = undefined;
                try {
                    // TODO: fix to not use Eval.
                    newObj = eval("new " + pyObjString + "()");
                } catch(err) {
                    if (this.knownUnparseables.indexOf(pyObjString) == -1) {
                        console.warn("Could not convert object type: ", pyObjString, " => ", err);
                    }
                    newObj = undefined;
                    return newObj;
                }
                if (pyObjString == 'music21.stream.Part') {
                    this.currentPart = newObj;
                }
                return newObj;
            } else {
                console.log("Cannot process non m21 object like this...", pyObjString);
            }
            
        };
        this.skipKeys = ['_elements', ,'_endElements', 'groups', 'py/object', '_fullyQualifiedClasses', 'isFlat', 
                         '_derivation', '_idLastDeepCopyOf', '_classes', '_storedElementOffsetTuples',
                         '_activeSiteId', 'activeSite', '_cache', '_activeSite', '_mutable', 'sites',
                         'flattenedRepresentationOf', '_unlinkedDuration',
                         'id',
                         ];
        this.objFromValue = function (value) {
            var tv = typeof(value);
            if (this.debug) {
                console.log('value: ', value, 'typeof', typeof(value));
            }
            if (value === null) {
                return undefined;
            } else if (tv == 'undefined') {
                return undefined;    
            } else if (value instanceof Array) {
                var newList = [];
                for (var i = 0; i < value.length; i++) {
                    var newEntry = this.objFromValue(value[i]);
                    newList.push(newEntry);
                }
                return newList;
            } else if (tv == 'object') {
                var newObj = undefined;
                if (value['py/object'] !== undefined) {
                    var cls = value['py/object'];
                    newObj = this.pyObjToJsObj(cls);
                    if (cls == 'music21.duration.Duration') {
                        newObj.quarterLength = value['_qtrLength']; // short circuit great complexity...
                        return newObj;
                    }
                    if (cls == 'music21.articulations.Fermata') {
                        console.log('fermata', value, newObj);
                    }
                } else {
                    newObj = value;
                }
                // recurse into dict;
                if (newObj !== undefined) {
                    this.jsonDictToJSObj(value, newObj);
                }
                return newObj;
            } else {
                return value;
            }
        };
        this.jsonDictToJSObj = function (m21Json, m21Obj) {
            // not necessarily a m21Obj...
            keyiterator:
            for (var key in m21Json) {
                for (var i = 0; i < this.skipKeys.length; i++) {
                    if (this.skipKeys[i] == key) {
                        continue keyiterator;
                    }
                }
                if (this.representsFromM21(m21Json) && (key == 'py/seq')) {
                    // skip iterables... like x in Stream(); 
                    continue keyiterator;
                }
                if (key in m21Obj) {
                    if (this.debug) {
                        console.log("match for", key, m21Json[key]);           
                    }
                    m21Obj[key] = this.objFromValue(m21Json[key]);
                } else {
                    if (this.debug) {
                        console.log("No correspondence for ", key, m21Json[key]);
                    }
                }
            }
            if (this.representsStream(m21Json)) {
                var storeTup = m21Json['_storedElementOffsetTuples'];
                m21Obj._clef = this.lastClef;
                m21Obj._keySignature = this.lastKeySignature;
                m21Obj._timeSignature = this.lastTimeSignature;
                    
                processElements:
                for (var i = 0; i < storeTup.length; i++ ) {
                    var storedElement = storeTup[i]['py/tuple'][0];
                    storedElement.offset = storeTup[i]['py/tuple'][1];
                    if (this.debug) {
                        console.log(" recursing into element:", storedElement);
                    }
                    var newM21pObj = this.objFromValue(storedElement);
                    if (newM21pObj == undefined) {
                        continue;
                    } 
                    var classList = newM21pObj.classes;
                    if (classList === undefined) {
                        console.warn("M21object without classes: ", newM21pObj);
                        classList = [];
                    }
                    for (var j = 0; j < classList.length; j++) {
                        var thisClass = classList[j];
                        var streamPart = this.currentPart;
                        if (streamPart == undefined) {
                            streamPart = m21Obj; // possibly a Stream constructed from .measures()
                            this.lastClef = undefined;
                            this.lastKeySignature = undefined;
                            this.lastTimeSignature = undefined;
                        }
                        if (thisClass == "TimeSignature") {
                            //console.log("Got timeSignature", streamPart, newM21pObj, storedElement);
                            newM21pObj._numerator = storedElement.displaySequence._numerator;
                            newM21pObj._denominator = storedElement.displaySequence._denominator;
                            m21Obj._timeSignature = newM21pObj;
                            this.lastTimeSignature = newM21pObj;
                            if (streamPart !== undefined && streamPart.timeSignature === undefined) {
                                streamPart.timeSignature = newM21pObj;                                
                            }
                            continue processElements;
                        } else if (thisClass == "Clef") {
                            m21Obj._clef = newM21pObj;
                            this.lastClef = newM21pObj;
                            if (streamPart !== undefined && streamPart.clef === undefined) {
                                streamPart.clef = newM21pObj;                                
                            }
                            continue processElements;
                        } else if (thisClass == "KeySignature") {
                            this.lastKeySignature = newM21pObj;
                            m21Obj._keySignature = newM21pObj;
                            if (streamPart !== undefined && streamPart.keySignature === undefined) {
                                streamPart.keySignature = newM21pObj;                                
                            }
                            continue processElements;
                        }
                    } // not one of the three special elements...                    
                    // append to stream... TODO: insert!
                    m21Obj.append(newM21pObj);
                    
                }
            }
            return m21Obj;
        };
    };
    jsonPickle.tests = function () {
        test( "music21.jsonPickle.Converter -- startup", function() {
            var pickleIn = '{"m21Version": {"py/tuple": [1, 9, 2]}, "stream": {"_mutable": true, "_activeSite": null, "xPosition": null, "_priority": 0, "_elements": [], "_cache": {}, "definesExplicitPageBreaks": false, "_unlinkedDuration": null, "id": 4424213200, "_duration": null, "py/object": "music21.stream.Stream", "_overriddenLily": null, "streamStatus": {"py/object": "music21.stream.streamStatus.StreamStatus", "_enharmonics": null, "_dirty": null, "_concertPitch": null, "_accidentals": null, "_ties": null, "_rests": null, "_ornaments": null, "_client": null, "_beams": null, "_measures": null}, "sites": {"py/object": "music21.base.Sites", "_lastOffset": null, "_siteIndex": 1, "_definedContexts": {}, "_lastID": -1, "containedById": 4424213200, "_locationKeys": []}, "py/seq": [], "isFlat": true, "autoSort": true, "_storedElementOffsetTuples": [{"py/tuple": [{"lyrics": [], "_notehead": "normal", "_volume": {"py/object": "music21.volume.Volume", "_parent": {"py/id": 6}, "velocityIsRelative": true, "_cachedRealized": null, "_velocity": null}, "_activeSite": null, "xPosition": null, "_priority": 0, "pitch": {"_activeSite": null, "_accidental": null, "_priority": 0, "id": 4424213584, "_duration": {"py/id": 8}, "py/object": "music21.pitch.Pitch", "_overriddenLily": null, "_overridden_freq440": null, "sites": {"py/object": "music21.base.Sites", "_lastOffset": null, "_siteIndex": 1, "_definedContexts": {"None": {"py/object": "music21.base.Site", "obj": null, "globalSiteIndex": 97, "classString": null, "siteIndex": 0, "isDead": false, "offset": 0.0}}, "_lastID": -1, "containedById": 4424213584, "_locationKeys": [null]}, "_microtone": {"py/object": "music21.pitch.Microtone", "_harmonicShift": 1, "_centShift": 0}, "_classes": null, "implicitAccidental": false, "groups": {"py/object": "music21.base.Groups", "py/seq": []}, "defaultOctave": 4, "_fullyQualifiedClasses": null, "_octave": 4, "xPosition": null, "hideObjectOnPrint": false, "_activeSiteId": null, "_step": "C", "fundamental": null, "_idLastDeepCopyOf": 4424212944}, "expressions": [], "id": 4424213328, "_duration": {"py/object": "music21.duration.Duration", "_componentsNeedUpdating": false, "_cachedIsLinked": true, "_qtrLength": 1.0, "_components": [{"py/object": "music21.duration.DurationUnit", "_type": "quarter", "_componentsNeedUpdating": false, "_qtrLength": 1.0, "_tuplets": {"py/tuple": []}, "_link": true, "_typeNeedsUpdating": false, "_quarterLengthNeedsUpdating": false, "_dots": [0]}], "_typeNeedsUpdating": false, "_quarterLengthNeedsUpdating": false, "linkage": "tie"}, "py/object": "music21.note.Note", "_noteheadParenthesis": false, "_overriddenLily": null, "sites": {"py/object": "music21.base.Sites", "_lastOffset": null, "_siteIndex": 6, "_definedContexts": {}, "_lastID": -1, "containedById": 4424213328, "_locationKeys": []}, "_editorial": null, "tie": null, "_noteheadFill": "default", "beams": {"py/object": "music21.beam.Beams", "feathered": false, "beamsList": []}, "_classes": ["Note", "NotRest", "GeneralNote", "Music21Object", "object"], "groups": {"py/object": "music21.base.Groups", "py/seq": []}, "_fullyQualifiedClasses": null, "articulations": [], "_activeSiteId": null, "hideObjectOnPrint": false, "_stemDirection": "unspecified", "_idLastDeepCopyOf": 4424212880}, 0.0]}], "_atSoundingPitch": "unknown", "_classes": ["Stream", "Music21Object", "object"], "groups": {"py/object": "music21.base.Groups", "py/seq": []}, "_fullyQualifiedClasses": null, "isSorted": false, "hideObjectOnPrint": false, "_activeSiteId": null, "flattenedRepresentationOf": null, "_endElements": [], "_derivation": {"py/object": "music21.derivation.Derivation", "_clientId": null, "_client": null, "_originId": null, "_origin": null, "_method": null}, "definesExplicitSystemBreaks": false, "_idLastDeepCopyOf": 4424131600}}';
            var jpc = new music21.jsonPickle.Converter();
            jpc.run(pickleIn);
            equal (jpc.m21Version.toString(), "1,9,2");
            
        });
        test( "music21.jsonPickle.Converter -- pyObj", function() {
            var jpc = new music21.jsonPickle.Converter();
            var thisObj = jpc.pyObjToJsObj('music21.note.Note');
            var tc = thisObj.classes;
            equal (tc.toString(), "Music21Object,GeneralNote,NotRest,Note");            
        });
    };
   
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.jsonPickle = jsonPickle;
    }       
    return jsonPickle;    
});