/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/chord -- Chord
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * Chord related objects (esp. music21.chord.Chord) and methods.
 *
 */
import { StaveNote as VFStaveNote } from 'vexflow';
import * as MIDI from 'midicube';

import { Music21Exception } from './exceptions21';
import * as interval from './interval';
import * as note from './note';
import * as chordTables from './chordTables';

// imports for typing
import type * as clef from './clef';
import type * as pitch from './pitch';

export { chordTables };


/**
 * @param {Array<string|note.Note|pitch.Pitch>} [notes] -
 *     an Array of strings
 *     or pitch.Pitch objects.
 * @property {number} length - the number of pitches in the Chord (readonly)
 * @property {Pitch[]} pitches - an Array of Pitch objects in the
 *     chord. (Consider the Array read only and pass in a new Array to change)
 * @property {Boolean} [isChord=true]
 * @property {Boolean} [isNote=false]
 * @property {Boolean} [isRest=false]
 */
export class Chord extends note.NotRest {
    static get className() { return 'music21.chord.Chord'; }

    protected _notes: note.Note[] = [];
    isChord = true; // for speed
    isNote = false; // for speed
    isRest = false; // for speed
    _overrides: any = {};
    _cache: any = {};
    protected _chordTablesAddress: any = undefined;
    protected _chordTablesAddressNeedsUpdating: boolean = true; // only update when needed

    constructor(notes?: string|string[]|note.Note|note.Note[]|pitch.Pitch|pitch.Pitch[]) {
        super();
        let arrayNotes: Array<string|note.Note|pitch.Pitch>;
        if (typeof notes === 'undefined') {
            arrayNotes = [];
        } else if (typeof notes === 'string') {
            arrayNotes = notes.split(/\s+/);
        } else if (!(notes instanceof Array)) {
            arrayNotes = [notes as (note.Note|pitch.Pitch)];
        } else {
            arrayNotes = notes;
        }

        for (const n of arrayNotes) {
            this.add(n, false);
        }
        if (arrayNotes.length > 0) {
            const n0 = arrayNotes[0];
            if (n0 instanceof note.Note) {
                if (n0.duration.quarterLength !== this.duration.quarterLength) {
                    this.duration = n0.duration;
                }
            }
        }
        this.sortPitches();
    }

    stringInfo(): string {
        const info = this.pitches.map(x => x.nameWithOctave);
        return info.join(' ');
    }

    get length(): number {
        return this._notes.length;
    }

    // Typescript restriction... preventing full allowing of set pitches()
    // to take string[] or Note[].
    // https://github.com/microsoft/TypeScript/issues/2521
    get pitches(): pitch.Pitch[] {
        const tempPitches = [];
        for (let i = 0; i < this._notes.length; i++) {
            tempPitches.push(this._notes[i].pitch);
        }
        return tempPitches;
    }

    set pitches(tempPitches: pitch.Pitch[]) {
        this._notes = [];
        for (let i = 0; i < tempPitches.length; i++) {
            let addNote;
            if (typeof tempPitches[i] === 'string') {
                addNote = new note.Note(tempPitches[i]);
            } else if (tempPitches[i].isClassOrSubclass('Pitch')) {
                addNote = new note.Note();
                addNote.pitch = tempPitches[i];
            } else if (tempPitches[i].isClassOrSubclass('Note')) {
                addNote = tempPitches[i];
            } else {
                console.warn('bad pitch', tempPitches[i]);
                throw new Music21Exception(
                    'Cannot add pitch from ' + tempPitches[i]
                );
            }
            this._notes.push(addNote);
        }
        this._cache = {};
        this._overrides = {};
    }

    get notes(): note.Note[] {
        return [...this._notes];
    }

    set notes(newNotes: note.Note[]) {
        this._notes = [...newNotes];
        this._cache = {};
        this._overrides = {};
    }

    vexflowNote({ clef=undefined }={}): VFStaveNote {
        this.sortPitches();
        return super.vexflowNote({ clef });
    }

    get orderedPitchClasses(): number[] {
        const pcGroup = [];
        for (const p of this.pitches) {
            if (pcGroup.includes(p.pitchClass)) {
                continue;
            }
            pcGroup.push(p.pitchClass);
        }
        pcGroup.sort((a, b) => a - b);
        return pcGroup;
    }

    get chordTablesAddress() {
        if (this._chordTablesAddressNeedsUpdating) {
            this._chordTablesAddress = chordTables.seekChordTablesAddress(this);
        }
        this._chordTablesAddressNeedsUpdating = false;
        return this._chordTablesAddress;
    }

    get commonName(): string {
        // TODO: many more exemptions from music21p
        const cta = this.chordTablesAddress;
        const ctn = chordTables.addressToCommonNames(cta);
        const forteClass = this.forteClass;
        const enharmonicTests = {
            '3-11A': () => this.isMinorTriad(),
            '3-11B': () => this.isMajorTriad(),
            '3-10': () => this.isDiminishedTriad(),
            '3-12': () => this.isAugmentedTriad(),
        };
        if (enharmonicTests[forteClass] !== undefined) {
            let out = ctn[0];
            const test = enharmonicTests[forteClass];
            if (!test()) {
                out = 'enharmonic equivalent to ' + out;
            }
            return out;
        }

        if (ctn === undefined) {
            return '';
        } else {
            return ctn[0];
        }
    }

    get forteClass() {
        return chordTables.addressToForteName(this.chordTablesAddress, 'tn');
    }

    get forteClassNumber() {
        return this.chordTablesAddress.forteClass;
    }

    get forteClassTnI() {
        return chordTables.addressToForteName(this.chordTablesAddress, 'tni');
    }

    get(i) {
        if (typeof i === 'number') {
            return this._notes[i];
        } else {
            return undefined; // TODO(msc): add other get methods.
        }
    }

    * [Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            yield this.get(i);
        }
    }


    areZRelations(other): boolean {
        const zRelationAddress = chordTables.addressToZAddress(this.chordTablesAddress);
        if (zRelationAddress === undefined) {
            return false;
        }
        for (const key of ['cardinality', 'forteClass', 'inversion']) {
            if (other.chordTablesAddress[key] !== zRelationAddress[key]) {
                return false;
            }
        }
        return true;
    }

    getZRelation() {
        if (!this.hasZRelation) {
            return undefined;
        }
        const chordTablesAddress = this.chordTablesAddress;
        const v = chordTables.addressToIntervalVector(chordTablesAddress);
        const addresses = chordTables.intervalVectorToAddress(v);
        let other;
        for (const thisAddress of addresses) {
            if (thisAddress.forteClass !== chordTablesAddress.forteClass) {
                other = thisAddress;
            }
        }
        // other should always be defined;
        const prime = chordTables.addressToTransposedNormalForm(other);
        return new Chord(prime);
    }

    get hasZRelation(): boolean {
        const post = chordTables.addressToZAddress(this.chordTablesAddress);
        if (post !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    get intervalVector() {
        return chordTables.addressToIntervalVector(this.chordTablesAddress);
    }

    //    get intervalVectorString() {
    //
    //    }
    //
    //    static formatVectorString() {
    //        // needs pitch._convertPitchClassToStr
    //    }

    setStemDirectionFromClef(clef?: clef.Clef) {
        if (clef === undefined) {
            return this;
        } else {
            const midLine = clef.lowestLine + 4;
            // console.log(midLine, 'midLine');
            let maxDNNfromCenter = 0;
            const pA = this.pitches;
            for (let i = 0; i < this.pitches.length; i++) {
                const p = pA[i];
                const DNNfromCenter = p.diatonicNoteNum - midLine;
                // >= not > so that the highest pitch wins the tie and thus stem down.
                if (Math.abs(DNNfromCenter) >= Math.abs(maxDNNfromCenter)) {
                    maxDNNfromCenter = DNNfromCenter;
                }
            }
            if (maxDNNfromCenter >= 0) {
                this.stemDirection = 'down';
            } else {
                this.stemDirection = 'up';
            }
            return this;
        }
    }

    /**
     * Adds a note or Array of notes to the chord, sorting the note array
     *
     * runSort - Sort after running (default true)
     */
    add(
        n: string|string[]|note.Note|note.Note[]|pitch.Pitch|pitch.Pitch[],
        runSort: boolean = true
    ): this {
        let notes: Array<string|note.Note|pitch.Pitch>;
        if (!(n instanceof Array)) {
            notes = [<string|note.Note|pitch.Pitch> n];
        } else {
            notes = n;
        }
        for (const noteObj_StrOrNote of notes) {
            // takes in either a note or a pitch
            let noteObj: note.Note;
            if (typeof noteObj_StrOrNote === 'string') {
                noteObj = new note.Note(noteObj_StrOrNote);
            } else if (noteObj_StrOrNote.isClassOrSubclass('Pitch')) {
                const pitchObj = noteObj_StrOrNote;
                const noteObj2 = new note.Note();
                noteObj2.pitch = pitchObj as pitch.Pitch;
                noteObj = noteObj2;
            } else {
                noteObj = noteObj_StrOrNote as note.Note;
            }
            this._notes.push(noteObj);
        }
        // inefficient because sorts after each add, but safe and #(p) is small
        if (runSort === true) {
            this.sortPitches();
        }
        this._cache = {};
        return this;
    }

    sortPitches(): void {
        this._notes.sort((a: note.Note, b: note.Note) => {
            let diff: number = a.pitch.diatonicNoteNum - b.pitch.diatonicNoteNum;
            if (diff === 0) {
                diff = a.pitch.ps - b.pitch.ps;
            }
            return diff;
        });
    }

    // TODO: add remove

    /**
     * Removes any pitches that appear more than once (in any octave),
     * removing the higher ones, and returns a new Chord.
     *
     * returns A new Chord object with duplicate pitches removed.
     */
    removeDuplicatePitches(): Chord {
        const stepsFound = [];
        const nonDuplicatingPitches = [];
        const pitches = this.pitches;
        for (let i = 0; i < pitches.length; i++) {
            const p = pitches[i];
            if (stepsFound.indexOf(p.step) === -1) {
                stepsFound.push(p.step);
                nonDuplicatingPitches.push(p);
            }
        }
        const closedChord = new Chord(nonDuplicatingPitches);
        return closedChord;
    }

    /**
     * Finds the Root of the chord, or sets it as an override.
     */
    root(newroot?: pitch.Pitch): pitch.Pitch {
        if (newroot !== undefined) {
            this._overrides.root = newroot;
            this._cache.root = newroot;
            this._cache.inversion = undefined;
        }

        if (this._overrides.root !== undefined) {
            return this._overrides.root;
        }

        if (this._cache.root !== undefined) {
            return this._cache.root;
        }

        const closedChord = this.removeDuplicatePitches();
        /* var chordBass = closedChord.bass(); */
        const closedPitches = closedChord.pitches;
        if (closedPitches.length === 0) {
            throw new Music21Exception('No notes in Chord!');
        } else if (closedPitches.length === 1) {
            return this.pitches[0];
        }
        // const indexOfPitchesWithPerfectlyStackedThirds = [];
        const testSteps = [3, 5, 7, 2, 4, 6];
        for (let i = 0; i < closedPitches.length; i++) {
            const p = closedPitches[i];
            const currentListOfThirds = [];
            for (let tsIndex = 0; tsIndex < testSteps.length; tsIndex++) {
                const chordStepPitch = closedChord.getChordStep(
                    testSteps[tsIndex],
                    p
                );
                if (chordStepPitch !== undefined) {
                    // console.log(p.name + " " + testSteps[tsIndex].toString() + " " + chordStepPitch.name);
                    currentListOfThirds.push(true);
                } else {
                    currentListOfThirds.push(false);
                }
            }
            // console.log(currentListOfThirds);
            let hasFalse = false;
            for (let j = 0; j < closedPitches.length - 1; j++) {
                if (currentListOfThirds[j] === false) {
                    hasFalse = true;
                }
            }
            if (hasFalse === false) {
                // indexOfPitchesWithPerfectlyStackedThirds.push(i);
                return closedChord.pitches[i]; // should do more, but fine...
                // should test rootedness function, etc. 13ths. etc.
            }
        }
        const newRoot = closedChord.pitches[0]; // fallback, just return the bass...
        this._cache.root = newRoot;
        return newRoot;
    }

    /**
     * Returns the number of semitones above the root that a given chordstep is.
     *
     * For instance, in a G dominant 7th chord (G, B, D, F), would
     * return 4 for chordStep=3, since the third of the chord (B) is four semitones above G.
     *
     * chordStep - the step to find, e.g., 1, 2, 3, etc.
     * [testRoot] - the pitch to temporarily consider the root.
     * returns Number of semitones above the root for this
     *     chord step or undefined if no pitch matches that chord step.
     */
    semitonesFromChordStep(chordStep: number, testRoot?: pitch.Pitch): number|undefined {
        if (testRoot === undefined) {
            testRoot = this.root();
        }
        const tempChordStep = this.getChordStep(chordStep, testRoot);
        if (tempChordStep === undefined) {
            return undefined;
        } else {
            let semitones = (tempChordStep.ps - testRoot.ps) % 12;
            if (semitones < 0) {
                semitones += 12;
            }
            return semitones;
        }
    }

    /**
     * Gets the lowest note (based on .ps not name) in the chord.
     *
     * return bass pitch or undefined
     */
    bass(newBass?: pitch.Pitch): pitch.Pitch|undefined {
        if (newBass !== undefined) {
            this._overrides.bass = newBass;
            this._cache.bass = newBass;
            this._cache.inversion = undefined;
        }

        if (this._overrides.bass !== undefined) {
            return this._overrides.bass;
        }

        if (this._cache.bass !== undefined) {
            return this._cache.bass;
        }

        let lowest;
        const pitches = this.pitches;
        for (let i = 0; i < pitches.length; i++) {
            const p = pitches[i];
            if (lowest === undefined) {
                lowest = p;
            } else { // noinspection JSUnusedAssignment
                if (p.ps < lowest.ps) {
                    lowest = p;
                }
            }
        }
        return lowest;
    }

    /**
     * Counts the number of non-duplicate pitch MIDI Numbers in the chord.
     *
     * Call after "closedPosition()" to get Forte style cardinality disregarding octave.
     */
    cardinality(): number {
        const uniqueChord = this.removeDuplicatePitches();
        return uniqueChord.pitches.length;
    }

    isMajorTriad(): boolean {
        if (this.cardinality() !== 3) {
            return false;
        }
        const thirdST = this.semitonesFromChordStep(3);
        const fifthST = this.semitonesFromChordStep(5);
        if (thirdST === 4 && fifthST === 7) {
            return true;
        } else {
            return false;
        }
    }

    isMinorTriad(): boolean {
        if (this.cardinality() !== 3) {
            return false;
        }
        const thirdST = this.semitonesFromChordStep(3);
        const fifthST = this.semitonesFromChordStep(5);
        if (thirdST === 3 && fifthST === 7) {
            return true;
        } else {
            return false;
        }
    }

    isDiminishedTriad(): boolean {
        if (this.cardinality() !== 3) {
            return false;
        }
        const thirdST = this.semitonesFromChordStep(3);
        const fifthST = this.semitonesFromChordStep(5);
        if (thirdST === 3 && fifthST === 6) {
            return true;
        } else {
            return false;
        }
    }

    isAugmentedTriad(): boolean {
        if (this.cardinality() !== 3) {
            return false;
        }
        const thirdST = this.semitonesFromChordStep(3);
        const fifthST = this.semitonesFromChordStep(5);
        if (thirdST === 4 && fifthST === 8) {
            return true;
        } else {
            return false;
        }
    }


    isDominantSeventh(): boolean {
        return this.isSeventhOfType([0, 4, 7, 10]);
    }

    isDiminishedSeventh(): boolean {
        return this.isSeventhOfType([0, 3, 6, 9]);
    }

    isSeventhOfType(intervalArray: number[]): boolean {
        const third = this.third;
        const fifth = this.fifth;
        const seventh = this.seventh;

        if (
            third === undefined
            || fifth === undefined
            || seventh === undefined
        ) {
            return false;
        }

        const root = this.root();

        for (const thisPitch of this.pitches) {
            const thisInterval = new interval.Interval(root, thisPitch);
            if (!intervalArray.includes(thisInterval.chromatic.mod12)) {
                return false;
            }
            // // check if it doesn't have any other pitches, such as C E F- G Bb != Dominant Seventh
            // if (!ignoreSpelling && !chordalNames.includes(thisPitch.name)) {
            //      return false;
            // }
        }
        return true;


    }


    /**
     * canBeDominantV - Returns true if the chord is a Major Triad or a Dominant Seventh
     */
    canBeDominantV(): boolean {
        if (this.isMajorTriad() || this.isDominantSeventh()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns true if the chord is a major or minor triad
     */
    canBeTonic(): boolean {
        if (this.isMajorTriad() || this.isMinorTriad()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns the inversion of the chord as a number (root-position = 0)
     *
     * Unlike music21p version, cannot set the inversion, yet.
     *
     * TODO: add.
     */
    inversion(): number {
        const bass = this.bass();
        const root = this.root();
        const chordStepsToInversions = [1, 6, 4, 2, 7, 5, 3];
        for (let i = 0; i < chordStepsToInversions.length; i++) {
            const testNote = this.getChordStep(chordStepsToInversions[i], bass);
            if (testNote !== undefined && testNote.name === root.name) {
                return i;
            }
        }
        return undefined;
    }

    playMidi(
        tempo: number = 120,
        nextElement?,
        {
            instrument=undefined,
            channel=undefined,
            playLegato=false,
        }={}
    ) {
        const milliseconds = super.playMidi(tempo, nextElement, { instrument, channel, playLegato });
        if (channel === undefined) {
            channel = this.activeChannel();
        }
        let midNum;
        const volume = this.midiVolume;
        // TODO: Tied Chords.
        for (let j = 0; j < this._notes.length; j++) {
            midNum = this._notes[j].pitch.midi;
            try {
                MIDI.noteOn(channel, midNum, volume, 0);
                MIDI.noteOff(channel, midNum, milliseconds / 1000);
            } catch (e) {
                // do nothing -- might not have an output channel because of audio not connected
            }
        }
        return milliseconds;
    }

    /**
     * Returns the Pitch object that is a Generic interval (2, 3, 4, etc., but not 9, 10, etc.) above
     * the `.root()`
     *
     * In case there is more that one note with that designation (e.g., `[A-C-C#-E].getChordStep(3)`)
     * the first one in `.pitches` is returned.
     */
    getChordStep(chordStep: number, testRoot?: pitch.Pitch): pitch.Pitch|undefined {
        if (testRoot === undefined) {
            testRoot = this.root();
        }
        if (chordStep >= 8) {
            chordStep %= 7;
        }
        const thisPitches = this.pitches;
        const testRootDNN = testRoot.diatonicNoteNum;
        for (let i = 0; i < thisPitches.length; i++) {
            const thisPitch = thisPitches[i];
            let thisInterval
                = (thisPitch.diatonicNoteNum - testRootDNN + 1) % 7; // fast kludge
            if (thisInterval <= 0) {
                thisInterval += 7;
            }
            if (thisInterval === chordStep) {
                return thisPitch;
            }
        }
        return undefined;
    }

    get third(): pitch.Pitch|undefined {
        return this.getChordStep(3);
    }

    get fifth(): pitch.Pitch|undefined {
        return this.getChordStep(5);
    }

    get seventh(): pitch.Pitch|undefined {
        return this.getChordStep(7);
    }
}

export const chordDefinitions = {
    major: ['M3', 'm3'],
    minor: ['m3', 'M3'],
    diminished: ['m3', 'm3'],
    augmented: ['M3', 'M3'],
    'major-seventh': ['M3', 'm3', 'M3'],
    'dominant-seventh': ['M3', 'm3', 'm3'],
    'minor-seventh': ['m3', 'M3', 'm3'],
    'diminished-seventh': ['m3', 'm3', 'm3'],
    'half-diminished-seventh': ['m3', 'm3', 'M3'],
};
