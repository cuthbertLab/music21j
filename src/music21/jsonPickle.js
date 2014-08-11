/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/jsonPickle -- Conversion from music21p jsonpickle streams
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 * usage:
 * 
 * jpc = new music21.jsonPickle.Converter();
 * s = jpc.run(stringRepresentingM21JsonPickle);
 * 
 * 
 */

define(['unpickler'], function (unpickler) {
    var jsonPickle = {};
    jsonPickle.Converter = function () {
        this.debug = true;
        this.knownUnparsables = [
            'music21.spanner.Line',
            'music21.instrument.Instrument',
            'music21.layout.StaffGroup',
            'music21.layout.StaffLayout',
            'music21.layout.SystemLayout',
            'music21.layout.PageLayout',
            'music21.expressions.TextExpression',
            'music21.bar.Barline', // Soon...
            'music21.tempo.MetronomeMark', // should be possible
            'music21.metadata.Metadata', // Soon...
        ];
        
        
        var converterHandler = this;
        this.streamPostRestore = function (s) {
            var ch = converterHandler;
            var st = s._storedElementOffsetTuples;
            
            s._clef = ch.lastClef;
            s._keySignature = ch.lastKeySignature;
            s._timeSignature = ch.lastTimeSignature;
            for (var i = 0; i < st.length; i++ ) {
                var el = st[i][0];
                el.offset = st[i][1];
                var classList = el._classes;
                if (classList === undefined) {
                    console.warn("M21object without classes: ", el);
                    classList = [];
                }
                var streamPart = ch.currentPart;
                if (streamPart == undefined) {
                    streamPart = s; // possibly a Stream constructed from .measures()
                }

                var appendEl = true;
                var insertAtStart = false;

                for (var j = 0; j < classList.length; j++) {
                    var thisClass = classList[j];
                    for (var kn = 0; kn < ch.knownUnparsables.length; kn++) {
                        var unparsable = ch.knownUnparsables[kn];
                        if (unparsable.indexOf(thisClass) != -1) {
                            appendEl = false;
                        }
                    }
                    if (thisClass == "TimeSignature") {
                        //console.log("Got timeSignature", streamPart, newM21pObj, storedElement);
                        s._timeSignature = el;
                        ch.lastTimeSignature = el;
                        if (streamPart !== undefined && streamPart.timeSignature === undefined) {
                            streamPart.timeSignature = el;                                
                        }
                        appendEl = false;
                    } else if (thisClass == "Clef") {
                        s._clef = el;
                        ch.lastClef = el;
                        if (streamPart !== undefined && streamPart.clef === undefined) {
                            streamPart.clef = el;                                
                        }
                        appendEl = false;                        
                    } else if (thisClass == "KeySignature") {
                        s._keySignature = el;
                        this.lastKeySignature = el;
                        if (streamPart !== undefined && streamPart.keySignature === undefined) {
                            streamPart.keySignature = el; 
                        }
                        appendEl = false;                        
                    } else if (thisClass == 'Part') {
                        appendEl = false;
                        insertAtStart = true;
                    }
                } 
                
                if (appendEl) {
                    s.append(el); // all but clef, ts, ks
                } else if (insertAtStart) {
                    s.insert(0, el); // Part
                }                
            }
            return s;
        };
        
        
        this.handlers = {
            'music21.duration.Duration': {
                post_restore: function (d) {
                    d.quarterLength = d._qtrLength;
                    return d;
                },
            },
            'music21.meter.TimeSignature': {
                post_restore: function (ts) {
                    ts._numerator = ts.displaySequence._numerator;
                    ts._denominator = ts.displaySequence._denominator;
                    return ts;
                },
            },
            'music21.stream.Part': {
                post_restore: function (p) {
                    converterHandler.currentPart = p;
                    converterHandler.lastClef = undefined;
                    converterHandler.lastKeySignature = undefined;
                    converterHandler.lastTimeSignature = undefined;
                    converterHandler.streamPostRestore(p);
                    return p;
                }
            },
            // TODO: all inherit somehow, through _classes or better, prototype...
            'music21.stream.Score': { post_restore: converterHandler.streamPostRestore },
            'music21.stream.Stream': { post_restore: converterHandler.streamPostRestore },
            'music21.stream.Measure': { post_restore: converterHandler.streamPostRestore },           
            'music21.stream.Voice': { post_restore: converterHandler.streamPostRestore },           
        };
        this.currentPart = undefined;
        this.lastClef = undefined;
        this.lastKeySignature = undefined;
        this.lastTimeSignature = undefined;

    };
    jsonPickle.Converter.prototype.run = function (jss) {
        var outStruct = unpickler.decode(jss, this.handlers);
        console.log(outStruct.stream);
        return outStruct.stream;
    };
    if (typeof music21 !== undefined) {
        music21.jsonPickle = jsonPickle;
    }
    return jsonPickle;
});
