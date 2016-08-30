import * as $ from 'jquery';
import { prebase } from './prebase';

/**
 * orchestralScore module. See {@link music21.protopainting} namespace
 * alpha.
 *
 * @exports music21/orchestralScore
 */
/**
 * @namespace music21.orchestralScore
 * @memberof music21
 * @requires music21/prebase
 */
export	const orchestralScore = {};
/**
 * Represents an orchestral score,
 *
 * @class OrchestralScore
 * @memberof music21.orchestralScore
 * @extends music21.prebase.ProtoM21Object
 * @property {Array<music21.stream.Part>} -- stored parts
 * @property {Array<String>} instrument names corresponding to parts
 * @property {number} maxPartLength
 * @property {music21.stream.Score} score
 * @property {music21.stream.Measure} pianoMeasure - the corresponding measure
 */
orchestralScore.OrchestralScore = function(pianoMeasure) {
    prebase.ProtoM21Object.call(this);
    this.classes.push('OrchestralScore');
    this.name = 'undefined';
    this.instrumentNames = [];
    this.parts = [];
    this.maxPartLength = 0;
    this.score = new music21.stream.Score();
    this.pianoMeasure = pianoMeasure;
};
orchestralScore.OrchestralScore.prototype = new prebase.ProtoM21Object();
orchestralScore.OrchestralScore.prototype.constructor = orchestralScore.OrchestralScore;

/**
 * Generates an Orchestral Score
 *
 * @memberof music21.orchestralScore.OrchestralScore
 * @returns {music21.orchestralScore.OrchestralScore}
 */
//orchestralScore.OrchestralScore = function (pianoMeasure) {
//var OrchestralScore = new music21.orchestralScore.OrchestralScore(pianoMeasure);
//return OrchestralScore;
//};
/**
 * Returns the part with a given name
 *
 * @param {string } selectedInstrument - name of instrument corresponding to that split part
 * @returns {music21.stream.Part} part - the split part with the name called
 */
orchestralScore.OrchestralScore.prototype.getPartIndex = function(selectedInstrument) {
    for (let i = 0; i < this.instrumentNames.length; i++) {
        const name = this.instrumentNames[i];
        if (name == selectedInstrument) {
            return i;
        }
    }
};
///**
//* UNUSED
//* Adds corresponding rests to a split part if there are other parts in the score with more notes
//* @param {splitPart} newSplitPart - a SplitPart with fewer notes than the other splitParts that have more notes added
//* @returns {splitPart} splitPartWithRests - SplitPart with rests filled in where there are notes for other parts
//*/
//orchestralScore.OrchestralScore.prototype.addRests = function (newSplitPart) {

//for (var splitPartWithRests = 0; splitPartWithRests < this.partList[0].p.flat.elements.length; splitPartWithRests++ ) {
//r = new music21.note.Rest()
//r.duration.quarterLength
//newSplitPart.p.get(0).append(r);
//while (newSplitPart.p.get(0).elements.length > OrchestralScore.maxPartLength) {
//OrchestralScore.maxPartLength++;
//}
//return splitPartWithRests;
//}
//}

/**
 * Creates a splitPart object from an instrument name and adds rests if necessary
 * Adds the part to the score
 * @param {string} instrument - the name of the instrument that the splitPart is named after
 * @param {music21.stream.Part} p - the part initialized
 */

orchestralScore.OrchestralScore.prototype.makeSplittedPart = function(instrumentStr, p) {
    for (let i = 0; i < this.maxPartLength; i++) {
        const r = new music21.note.Rest();
        if (typeof (this.pianoMeasure) == 'undefined') {
            console.log('no piano measure in OS');
            this.pianoMeasure = orchestralScore.OrchestralScore.pianoMeasure;
        }
        const correspondingPianoNote = this.pianoMeasure.flat.elements[i];
        r.duration.quarterLength = correspondingPianoNote.duration.quarterLength;
        p.get(0).append(r);
    }
    music21.miditools.loadSoundfont(instrumentStr, function(i) {
        p.instrument = i;
    });
    this.parts.push(p);
    this.instrumentNames.push(instrumentStr);
    this.score.insert(0, p);
};
/**
 * Returns the name of instruments selected from check boxes
 * searches for an element called instrumentSelect
 * @returns [string] an array of instrument names
 **/

orchestralScore.OrchestralScore.prototype.getSelectedInstruments = function() {
    const selectedInstruments = [];
    $('#instrumentSelect :checked').each(function() {
        selectedInstruments.push($(this).val());
    });
    return selectedInstruments;
};


/**
 * When the canvas is clicked, obtains the selected note, puts the note on the score, then re-renders the canvas.
 * @param {event} e - click event
 *
 */
orchestralScore.OrchestralScore.prototype.clickFunction = function(e) {
    console.log('click event');
    console.log(this);
    const storedScore = this.pianoMeasure;
    const canvasElement = e.currentTarget;
    const _ = storedScore.findNoteForClick(canvasElement, e);
    // var dNN = _[0];
    const c = _[1];
    let noteIndex = undefined;
    for (let i = 0; i < storedScore.flat.elements.length; i++) {
        if (c === storedScore.flat.elements[i]) {
            noteIndex = i;
        }
    }
    const oneNoteChord = this.getNoteFromChordAndDNN(_);
    if (typeof (oneNoteChord) == 'undefined') {
        return;
    }
    this.assignNoteToParts(oneNoteChord, noteIndex);
    this.displayParts();
};
/**
 *
 */
orchestralScore.OrchestralScore.prototype.createCanvases = function() {
    $('#canvases').empty();

    const selectedInstruments = this.getSelectedInstruments();
    for (const i in selectedInstruments) {
        instrumentName = selectedInstruments[i];
        if (true) {
            // if (typeof(this.getPart(instrumentName))=="undefined" ) {
                var p = new music21.stream.Part();
                const newMeasure = new music21.stream.Measure();
                p.append(newMeasure);
                this.makeSplittedPart(instrumentName, p);
        } else {
            var p = parts[this.getPartIndex(instrumentName)];
        }
    }
    const $canvasDiv = $("<div class = 'canvasHolder' id = 'canvasDiv' align = 'left' > </div>");
    $('#canvases').append($canvasDiv);
    $canvasDiv.html('<b>' + 'Score' + '</b>');
    this.score.appendNewCanvas($canvasDiv);
};
/**
 * Changes the appropriate canvases (very similar to createCanvases, might merge them)
 *
 */
orchestralScore.OrchestralScore.prototype.displayParts = function() {
    const $specifiedCanvas = $('#canvasDiv');
    $specifiedCanvas.empty();
    const currentScore = this.score;
    currentScore.appendNewCanvas($specifiedCanvas);
};

orchestralScore.OrchestralScore.prototype.checkIfFilledToNotePlace = function(p, notePlace) {
    if ((p.get(0).elements.length - 1 < notePlace) &&  (notePlace < this.maxPartLength)) {
        return false;
    } else {
        return true;
    }
};
/**
 * Takes in a chord and where it goes in the part, then places the note where it belonds, adding rests in between the last and first note if none exists
 * @param {music21.chord.Chord} c - The chord selected by the mouse
 * @param {number} noteIndex - The index of where the note is the piano score
 * @param {number} partIndex - part number in this.parts[]
 *
 */
orchestralScore.OrchestralScore.prototype.addNoteToPart = function(c, noteIndex, partIndex) {
    if (typeof (this.pianoMeasure) == 'undefined') {
        console.log('no piano measure');
        console.log(this);
    }
    const p = this.parts[partIndex];
    for (let notePlace = 0; notePlace < noteIndex; notePlace++) {
        if (!this.checkIfFilledToNotePlace(p, notePlace)) {
            var r = new music21.note.Rest();
            var correspondingPianoNote = this.pianoMeasure.elements[notePlace];
            r.duration.quarterLength = correspondingPianoNote.duration.quarterLength;
            this.parts[partIndex].get(0).append(r);
            console.log('fills in missing rests');
        }
        if (typeof (p.get(0).get(notePlace)) == 'undefined') {
            var r = new music21.note.Rest();
            if (typeof (orchestralScore.OrchestralScore) == 'undefined') {
                console.log('No orchestral score was created yet');
                return;
            }
            var correspondingPianoNote = this.pianoMeasure.elements[notePlace];
            r.duration.quarterLength = correspondingPianoNote.duration.quarterLength;
            p.get(0).append(r);
        }
    }
    p.get(0).elements[noteIndex] = c;
    if (p.get(0).length > this.maxPartLength) {
        this.maxPartLength = p.get(0).length;
    }
};


/**
 * @params {Array} [chord.Chord, diatomicNoteNum]
 * @returns {chord.Chord} chord made from the selected note and chord
 */
orchestralScore.OrchestralScore.prototype.getNoteFromChordAndDNN = function(_) {
    console.log(_);
    dNN = _[0];
    c = _[1];
    if (typeof (c) == 'undefined') {
        console.log('undefined chord');
        return undefined;
    }
    let minNoteDistance = 100; // some big number
    for (let i = 0; i < c.pitches.length; i++) {
        chordDNN = c.pitches[i].diatonicNoteNum;
        noteDistance = chordDNN - dNN;
        if (noteDistance < 0) {
            noteDistance = -1 * noteDistance;
        }

        if (noteDistance < minNoteDistance) {
            minNoteDistance = noteDistance;
            correctdNN = c.pitches[i].diatonicNoteNum;
        }
    }

    const selectedNote = new music21.note.Note();
    selectedNote.pitch.diatonicNoteNum = correctdNN;
    const oneNoteChord = new music21.chord.Chord();
    oneNoteChord.duration.quarterLength = c.duration.quarterLength;
    oneNoteChord.add(selectedNote);
    console.log(oneNoteChord.pitches[0].name);
    return oneNoteChord;
};


/**
 * Finds the selected instruments, finds the part to append to, then adds the note to the part.
 * @param {music21.chord.Chord} c - chord
 */
orchestralScore.OrchestralScore.prototype.assignNoteToParts = function(c,  noteIndex) {
    console.log('assign note to parts');
    const selectedInstruments = this.getSelectedInstruments();
    for (let i = 0; i < selectedInstruments.length; i++) {
        const instrument = selectedInstruments[i];
        const partNumberToAppendTo = this.getPartIndex(instrument);
        this.addNoteToPart(c, noteIndex, partNumberToAppendTo);
    }
};


/**
 * Creates chords for a demonstration and appends them to a canvas.
 */
orchestralScore.setupDemonstration = function() {
    const cChord = new music21.chord.Chord(['C5', 'E5', 'G5']);
    const c1 = new music21.chord.Chord(['C5']);
    const c2 = new music21.chord.Chord(['D5']);
    const c3 = new music21.chord.Chord(['E5']);
    const c4 = new music21.chord.Chord(['F5']);
    const c5 = new music21.chord.Chord(['G5']);
    const c6 = new music21.chord.Chord(['C5', 'G5']);
    const c7 = new music21.chord.Chord(['C5', 'E5']);
    const c8 = new music21.chord.Chord(['A5']);
    c8.duration.quarterLength = 2;
    const c9 = new music21.chord.Chord(['B5']);
    const c10 = new music21.chord.Chord(['E5', 'G5']);
    const c11 = new music21.chord.Chord(['B5', 'D5']);

    const gChord = new music21.chord.Chord(['G5', 'B5', 'D5']);
    const fChord = new music21.chord.Chord(['F5', 'A5', 'C5']);
    const amChord = new music21.chord.Chord(['A5', 'C5', 'E5']);
    // var shortChord = new music21.chord.Chord(['A5', 'C5']);
    const mixedMeasure = new music21.stream.Measure();
    mixedMeasure.append(amChord);
    mixedMeasure.append(cChord);
    mixedMeasure.append(c1);
    mixedMeasure.append(c2);
    mixedMeasure.append(c3);
    mixedMeasure.append(c4);
    mixedMeasure.append(c5);
    mixedMeasure.append(c6);
    mixedMeasure.append(c7);
    mixedMeasure.append(c8);
    mixedMeasure.append(c9);
    mixedMeasure.append(c10);
    mixedMeasure.append(c11);

    mixedMeasure.append(gChord);
    mixedMeasure.append(fChord);

    $('#playSound').bind('click', function() {
        if (this.checked) {
            music21.webmidi.callBacks.general = midiCallbacksPlay;
        } else {
            music21.webmidi.callBacks.general = midiCallbacksNoPlay;
        }
    });
    return mixedMeasure;
};

