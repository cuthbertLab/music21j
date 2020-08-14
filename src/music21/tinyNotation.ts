/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/tinyNotation -- TinyNotation implementation
 *
 * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
 *
 * TinyNotation module
 *
 * @exports music21.tinyNotation
 * @memberof music21
 * @requires music21/base
 * @requires music21/clef
 * @requires music21/duration
 * @requires music21/pitch
 * @requires music21/note
 * @requires music21/meter
 * @requires music21/stream
 * @requires music21/tie
 */
import * as $ from 'jquery';

import * as chord from './chord';
import * as clef from './clef';
import * as duration from './duration';
import * as pitch from './pitch';
import * as note from './note';
import * as meter from './meter';
import * as stream from './stream';
import * as tie from './tie';

/**
 * Regular expressions object
 *
 * @memberof music21.tinyNotation
 */
const regularExpressions = {
    REST: /r/,
    OCTAVE2: /([A-G])[A-G]+/,
    OCTAVE3: /([A-G])/,
    OCTAVE5: /([a-g])('+)/,
    OCTAVE4: /([a-g])/,
    EDSHARP: /\((#+)\)/,
    EDFLAT: /\((-+)\)/,
    EDNAT: /\(n\)/,
    SHARP: /^[A-Ga-g]+'*(#+)/,  // simple notation finds
    FLAT: /^[A-Ga-g]+'*(-+)/,  //   double accidentals too
    NAT: /^[A-Ga-g]+'*n/,  // explicit naturals
    TYPE: /(\d+)/,
    TIE: /.~/,  // not preceding ties
    PRECTIE: /~/,  // front ties
    ID_EL: /=([A-Za-z0-9]*)/,
    LYRIC: /_(.*)/,
    DOT: /\.+/,
    TIMESIG: /(\d+)\/(\d+)/,

    PARTBREAK: /partBreak/,  // nonstandard...fix later...

    CHORD: /chord{/,
    TRIP: /trip{/,
    QUAD: /quad{/,
    ENDBRAC: /}($|_)/,
};

/**
 * **Function, not class**.
 *
 * Converts a TinyNotation String into a music21 Stream
 *
 * See music21p for examples of what can go into tinyNotation. It's an
 * adaptation of Lilypond format, by design Extremely simple!
 *
 * @memberof music21.tinyNotation
 * @param {string} textIn - a valid tinyNotation string
 * @returns {music21.stream.Part|music21.stream.Measure} - a Stream or Part object (if multiple measures)
 * @example
 * var t = "3/4 c4 B8 c d4 e2.";
 * var p = music21.tinyNotation.TinyNotation(t);
 * p.duration.quarterLength;
 * // 6.0
 */
export function TinyNotation(textIn): stream.Part|stream.Measure {
    textIn = textIn.trim();
    const tokens = textIn.split(' ');

    let optionalScore;

    let p = new stream.Part();
    let m = new stream.Measure();
    m.number = 1;
    let currentTSBarDuration = 4.0;
    let lastDurationQL = 1.0;
    const storedDict = {
        lastNoteTied: false,
        inTrip: false,
        inQuad: false,
        inChord: false,
        endStateAfterNote: false,
    };
    let chordObj = null;
    const tnre = regularExpressions; // faster typing
    let measureNumber = 1;
    for (let i = 0; i < tokens.length; i++) {
        // check at first so that a full measure but not over full
        // gets returned as a stream.Measure object.
        if ((m.duration.quarterLength >= currentTSBarDuration)
            || (Math.abs(m.duration.quarterLength - currentTSBarDuration) < 0.0001)) {
            p.append(m);
            measureNumber += 1;
            m = new stream.Measure();
            m.number = measureNumber;
        }

        let token = tokens[i];
        /**
         * @type {music21.note.GeneralNote|undefined}
         */
        let noteObj;
        let lyric;
        if (tnre.PARTBREAK.exec(token)) {
            if (m.length > 0) {
                p.append(m);
                m = new stream.Measure();
            }
            if (optionalScore === undefined) {
                optionalScore = new stream.Score();
            }
            optionalScore.insert(0, p);
            p = new stream.Part();

            storedDict.lastNoteTied = false;
            storedDict.inTrip = false;
            storedDict.inQuad = false;
            storedDict.endStateAfterNote = false;

            continue;
        }

        if (tnre.TRIP.exec(token)) {
            token = token.slice(5); // cut...
            storedDict.inTrip = true;
        }
        if (tnre.QUAD.exec(token)) {
            token = token.slice(5); // cut...
            storedDict.inQuad = true;
        }
        if (tnre.CHORD.exec(token)) {
            token = token.slice(6); // cut...
            storedDict.inChord = true;
        }
        if (tnre.ENDBRAC.exec(token)) {
            if (chordObj && tnre.LYRIC.exec(token)) {
                let chordLyric;
                [token, chordLyric] = token.split('_');
                chordObj.lyric = chordLyric;
            }
            token = token.slice(0, -1); // cut...
            storedDict.endStateAfterNote = true;
        }

        // Modifiers
        if (tnre.LYRIC.exec(token)) {
            [token, lyric] = token.split('_');
        }

        if (tnre.TIMESIG.exec(token)) {
            const MATCH = tnre.TIMESIG.exec(token);
            const ts = new meter.TimeSignature();
            ts.numerator = parseInt(MATCH[1]);
            ts.denominator = parseInt(MATCH[2]);
            m.timeSignature = ts;
            currentTSBarDuration = ts.barDuration.quarterLength;
            // console.log(currentTSBarDuration);
            continue;
        } else if (tnre.REST.exec(token)) {
            noteObj = new note.Rest(lastDurationQL);
        } else if (tnre.OCTAVE2.exec(token)) {
            const MATCH = tnre.OCTAVE2.exec(token);
            noteObj = new note.Note(MATCH[1], lastDurationQL);
            noteObj.pitch.octave = 4 - MATCH[0].length;
        } else if (tnre.OCTAVE3.exec(token)) {
            const MATCH = tnre.OCTAVE3.exec(token);
            noteObj = new note.Note(MATCH[1], lastDurationQL);
            noteObj.pitch.octave = 3;
        } else if (tnre.OCTAVE5.exec(token)) {
            // must match octave 5 before 4
            const MATCH = tnre.OCTAVE5.exec(token);
            noteObj = new note.Note(MATCH[1].toUpperCase(), lastDurationQL);
            noteObj.pitch.octave = 3 + MATCH[0].length;
        } else if (tnre.OCTAVE4.exec(token)) {
            const MATCH = tnre.OCTAVE4.exec(token);
            noteObj = new note.Note(MATCH[1].toUpperCase(), lastDurationQL);
            noteObj.pitch.octave = 4;
        }

        if (noteObj === undefined) {
            continue;
        }

        if (lyric !== undefined) {
            noteObj.lyric = lyric;
        }

        if (tnre.TIE.exec(token)) {
            noteObj.tie = new tie.Tie('start');
            if (storedDict.lastNoteTied) {
                noteObj.tie.type = 'continue';
            }
            storedDict.lastNoteTied = true;
        } else if (storedDict.lastNoteTied) {
            noteObj.tie = new tie.Tie('stop');
            storedDict.lastNoteTied = false;
        }
        if (tnre.SHARP.exec(token)) {
            const MATCH = tnre.SHARP.exec(token); // sharp
            noteObj.pitch.accidental = new pitch.Accidental(MATCH[1].length);
        } else if (tnre.FLAT.exec(token)) {
            const MATCH = tnre.FLAT.exec(token); // sharp
            noteObj.pitch.accidental = new pitch.Accidental(-1 * MATCH[1].length);
        } else if (tnre.NAT.exec(token)) {
            noteObj.pitch.accidental = new pitch.Accidental('natural');
            noteObj.pitch.accidental.displayType = 'always';
        }
        let MATCH = tnre.TYPE.exec(token);
        if (MATCH) {
            const durationType = parseInt(MATCH[0]);
            noteObj.duration.quarterLength = 4.0 / durationType;
        }
        MATCH = tnre.DOT.exec(token);
        if (MATCH) {
            const numDots = MATCH[0].length;
            const multiplier = 1 + (1 - 0.5 ** numDots);
            noteObj.duration.quarterLength *= multiplier;
        }
        lastDurationQL = noteObj.duration.quarterLength;
        // do before appending tuplets

        if (storedDict.inTrip) {
            // console.log(noteObj.duration.quarterLength);
            noteObj.duration.appendTuplet(
                new duration.Tuplet(3, 2, noteObj.duration.quarterLength)
            );
        }
        if (storedDict.inQuad) {
            noteObj.duration.appendTuplet(
                new duration.Tuplet(4, 3, noteObj.duration.quarterLength)
            );
        }
        if (storedDict.inChord) {
            if (chordObj) {
                chordObj.add(noteObj);
            } else {
                chordObj = new chord.Chord([noteObj]);
            }
        }
        if (storedDict.endStateAfterNote) {
            storedDict.inTrip = false;
            storedDict.inQuad = false;
            storedDict.inChord = false;
            storedDict.endStateAfterNote = false;

            if (chordObj) {
                m.append(chordObj);
                chordObj = null;
                continue;
            }
        }
        if (!storedDict.inChord) {
            m.append(noteObj);
        }
    }

    if (m.length > 0) {
        p.append(m);
    }

    let returnObject;

    if (optionalScore !== undefined) {
        if (p.length > 0) {
            optionalScore.append(p);
        }
        for (let i = 0; i < optionalScore.parts.length; i++) {
            const innerPart = optionalScore.parts.get(i);
            const innerPartClef = clef.bestClef(innerPart);
            const innerMeasure = innerPart.getElementsByClass('Measure').get(0);
            if (innerMeasure !== undefined) {
                innerMeasure.insert(0, innerPartClef);
            }
        }
        returnObject = optionalScore;
    } else {
        const bestClef = clef.bestClef(p);
        (p.getElementsByClass('Measure').get(0) as stream.Measure).insert(0, bestClef);
        returnObject = p;
    }
    return returnObject;
}

// render notation divs in HTML
/**
 * Render all the TinyNotation classes in the DOM as notation
 *
 * Called automatically when music21 is loaded.
 *
 * @memberof music21.tinyNotation
 * @param {string} [classTypes='.music21.tinyNotation'] - a JQuery selector to find elements to replace.
 * @param {HTMLElement|jQuery} [selector]
 */
export function renderNotationDivs(
    classTypes: string = '.music21.tinyNotation',
    selector=undefined
) {
    let $allRender: JQuery;

    if (selector === undefined) {
        $allRender = $(classTypes);
    } else {
        /**
         * @type {jQuery}
         */
        let $selector;
        if (!(selector instanceof $)) {
            $selector = $(selector);
        } else {
            $selector = selector;
        }
        $allRender = $selector.find(classTypes);
    }

    for (let i = 0; i < $allRender.length; i++) {
        const thisTN = $allRender[i];
        const $thisTN = $(thisTN);
        let thisTNContents;
        if ($thisTN.attr('tinynotationcontents') !== undefined) {
            thisTNContents = $thisTN.attr('tinynotationcontents');
        } else if (thisTN.textContent !== undefined) {
            thisTNContents = thisTN.textContent;
            thisTNContents = thisTNContents.replace(/s+/g, ' '); // no line-breaks, etc.
        }

        if (
            String.prototype.trim !== undefined
            && thisTNContents !== undefined
        ) {
            thisTNContents = thisTNContents.trim(); // remove leading, trailing whitespace
        }
        if (thisTNContents) {
            const st = TinyNotation(thisTNContents);
            if ($thisTN.hasClass('noPlayback')) {
                st.renderOptions.events.click = undefined;
            }
            const newSVG = st.createDOM();

            $thisTN.attr('tinynotationcontents', thisTNContents);
            $thisTN.empty();
            $thisTN.data('stream', st);
            $thisTN.append(newSVG);
            // console.log(thisTNContents);
        }
    }
}
