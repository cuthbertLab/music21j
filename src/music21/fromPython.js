/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/fromPython -- Conversion from music21p jsonpickle streams
 *
 * Copyright (c) 2013-16, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–16, Michael Scott Cuthbert and cuthbertLab
 *
 * usage:
 *
 * in python:
 *
 * s = corpus.parse('bwv66.6')
 * stringRepresentingM21JsonPickle = s.freezeStream('jsonpickle')
 *
 * in js:
 *
 * pyConv = new music21.fromPython.Converter();
 * s = pyConv.run(stringRepresentingM21JsonPickle);
 *
 *
 */
import * as jsonpickle from 'jsonpickle';

const jp = jsonpickle;
/**
 * fromPython module -- see {@link music21.fromPython}
 */
const unpickler = jp.unpickler;

/**
 * Converter for taking a Python-encoded jsonpickle music21p stream
 * and loading it into music21j
 *
 * Very very alpha.  See music21(p).vexflow modules to see how it works.
 *
 * Requires Cuthbert's jsonpickle.js port (included in music21j)
 *
 * @namespace music21.fromPython
 * @extends music21
 * @requires jsonpickle
 */
export const fromPython = {};

/**
 *
 * @class Converter
 * @memberof music21.fromPython
 * @property {boolean} debug
 * @property {Array<string>} knownUnparsables - list of classes that cannot be parsed
 * @property {Object} handlers - object mapping string names of classes to a set of
 * function calls to perform when restoring or post-restoring.
 * (too complicated to explain; read the code)
 */
export class Converter {
    constructor() {
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
        this.handlers = {
            'music21.duration.Duration': {
                post_restore: d => {
                    d.quarterLength = d._qtrLength;
                    return d;
                },
            },
            'music21.meter.TimeSignature': {
                post_restore: ts => {
                    ts._numerator = ts.displaySequence._numerator;
                    ts._denominator = ts.displaySequence._denominator;
                    return ts;
                },
            },
            'music21.stream.Part': {
                post_restore: p => {
                    this.currentPart = p;
                    this.lastClef = undefined;
                    this.lastKeySignature = undefined;
                    this.lastTimeSignature = undefined;
                    this.streamPostRestore(p);
                    return p;
                },
            },
            // TODO: all inherit somehow, through _classes or better, prototype...
            'music21.stream.Score': {
                post_restore: this.streamPostRestore.bind(this),
            },
            'music21.stream.Stream': {
                post_restore: this.streamPostRestore.bind(this),
            },
            'music21.stream.Measure': {
                post_restore: this.streamPostRestore.bind(this),
            },
            'music21.stream.Voice': {
                post_restore: this.streamPostRestore.bind(this),
            },
        };
        this.currentPart = undefined;
        this.lastClef = undefined;
        this.lastKeySignature = undefined;
        this.lastTimeSignature = undefined;
    }

    /**
     * Fixes up some references that cannot be unpacked from jsonpickle.
     *
     * @param {music21.stream.Stream} s - stream after unpacking from jsonpickle
     * @returns {music21.stream.Stream}
     */
    streamPostRestore(s) {
        const st = s._storedElementOffsetTuples;

        s._clef = this.lastClef;
        s._keySignature = this.lastKeySignature;
        s._timeSignature = this.lastTimeSignature;
        for (let i = 0; i < st.length; i++) {
            const el = st[i][0];
            el.offset = st[i][1];
            let classList = el.classes;
            if (classList === undefined) {
                console.warn('M21object without classes: ', el);
                console.warn('Javascript classes are: ', el._py_class);
                classList = [];
            }
            let streamPart = this.currentPart;
            if (streamPart === undefined) {
                streamPart = s; // possibly a Stream constructed from .measures()
            }

            let appendEl = true;
            let insertAtStart = false;

            for (let j = 0; j < classList.length; j++) {
                const thisClass = classList[j];
                for (let kn = 0; kn < this.knownUnparsables.length; kn++) {
                    const unparsable = this.knownUnparsables[kn];
                    if (unparsable.indexOf(thisClass) !== -1) {
                        appendEl = false;
                    }
                }
                if (thisClass === 'TimeSignature') {
                    // console.log("Got timeSignature", streamPart, newM21pObj, storedElement);
                    s._timeSignature = el;
                    this.lastTimeSignature = el;
                    if (
                        streamPart !== undefined
                        && streamPart.timeSignature === undefined
                    ) {
                        streamPart.timeSignature = el;
                    }
                    appendEl = false;
                } else if (thisClass === 'Clef') {
                    s._clef = el;
                    this.lastClef = el;
                    if (
                        streamPart !== undefined
                        && streamPart.clef === undefined
                    ) {
                        streamPart.clef = el;
                    }
                    appendEl = false;
                } else if (thisClass === 'KeySignature') {
                    s._keySignature = el;
                    this.lastKeySignature = el;
                    if (
                        streamPart !== undefined
                        && streamPart.keySignature === undefined
                    ) {
                        streamPart.keySignature = el;
                    }
                    appendEl = false;
                } else if (thisClass === 'Part') {
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
    }

    /**
     * Run the main decoder
     *
     * @param {string} jss - stream encoded as JSON
     * @returns {music21.stream.Stream}
     */
    run(jss) {
        const outStruct = unpickler.decode(jss, this.handlers);
        return outStruct.stream;
    }
}
fromPython.Converter = Converter;
