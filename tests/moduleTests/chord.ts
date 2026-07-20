import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;

// Note: tests for Chord stem directions (setStemDirectionFromClef,
// getStemDirectionFromClef, and the unison -> 'unspecified' behavior)
// live in tests/moduleTests/clef.ts since they exercise Clef-driven logic.
export default function tests() {
    test('music21.chord.Chord', assert => {
        let c = new music21.chord.Chord(['C5', 'E5', 'G5']);

        assert.equal(c.length, 3, 'Checking length of Chord');
        assert.ok(c.isMajorTriad(), 'C E G should be a major triad');
        assert.equal(
            c.isMinorTriad(),
            false,
            'C E G should not be minor triad'
        );
        assert.equal(c.canBeTonic(), true, 'C E G can be a tonic');

        // string construction
        c = new music21.chord.Chord('C5 E5 G5');
        assert.equal(c.length, 3, 'Checking length of Chord');
        assert.ok(c.isMajorTriad(), 'test chord construction from string');

        c = new music21.chord.Chord(['B', 'G', 'D', 'F']);
        assert.ok(c.isDominantSeventh());

        // test is sorted:
        c = new music21.chord.Chord('C5 E4 G3');
        const pitches = c.pitches;
        assert.equal(pitches[0].nameWithOctave, 'G3');
        assert.equal(pitches[2].nameWithOctave, 'C5');

        const s = new music21.stream.Measure();
        s.append(c);
        s.appendNewDOM();
    });

    test('music21.chord.Chord sortPitches', assert => {
        // Same ps, but diatonicNoteNum is out of order.
        let c = new music21.chord.Chord(['Bb4', 'A#4']);
        let [note1, note2] = c.notes;
        assert.equal(note1.pitch.nameWithOctave, 'A#4');
        assert.equal(note2.pitch.nameWithOctave, 'B-4');

        // Same diatonicNoteNum, but ps is out of order.
        c = new music21.chord.Chord(['B4', 'Bb4']);
        [note1, note2] = c.notes;
        assert.equal(note1.pitch.nameWithOctave, 'B-4');
        assert.equal(note2.pitch.nameWithOctave, 'B4');
    });

    test('music21.chord.Chord.simplifyEnharmonics', assert => {
        const names = (c: music21.chord.Chord) => c.pitches.map(p => p.name);

        // The central request: E, A-flat, B is really an E-major triad.
        const eMajor = new music21.chord.Chord('E A- B');
        eMajor.simplifyEnharmonics(true);
        assert.deepEqual(names(eMajor), ['E', 'G#', 'B'], 'E A- B -> E G# B in place');

        // C# F G# is more logical as C# major (C# E# G#).
        const cSharp = new music21.chord.Chord('C# F G#');
        const simplified = cSharp.simplifyEnharmonics();
        assert.deepEqual(names(simplified), ['C#', 'E#', 'G#'], 'C# F G# -> C# E# G#');
        // not-in-place must leave the original untouched
        assert.deepEqual(names(cSharp), ['C#', 'F', 'G#'], 'original chord unchanged');

        // keyContext biases the spelling
        const withKey = new music21.chord.Chord('C# F G#').simplifyEnharmonics(
            false, new music21.key.Key('A-')
        );
        assert.deepEqual(names(withKey), ['D-', 'F', 'A-'], 'C# F G# in A- -> D- F A-');
    });

    test('music21.chord.Chord.simplifyEnharmonics preserves pitch space', assert => {
        const nwo = (c: music21.chord.Chord) => c.pitches.map(p => p.nameWithOctave);
        const psOf = (c: music21.chord.Chord) => c.pitches.map(p => p.ps);

        // B#3 -> C4 crosses the octave boundary upward: name and octave change
        // but the sounding pitch (ps) does not.
        const up = new music21.chord.Chord('A3 B#3 E4');
        const upPs = psOf(up);
        assert.deepEqual(upPs, [57, 60, 64], 'B#3 has ps 60 (same as C4)');
        up.simplifyEnharmonics(true);
        assert.deepEqual(nwo(up), ['A3', 'C4', 'E4'], 'A3 B#3 E4 respelled to A3 C4 E4');
        assert.deepEqual(psOf(up), upPs, 'ps unchanged after respelling B#3 -> C4');

        // C-4 -> B3 crosses the octave boundary downward, ps still preserved.
        const down = new music21.chord.Chord('G3 C-4 D4');
        const downPs = psOf(down);
        assert.deepEqual(downPs, [55, 59, 62], 'C-4 has ps 59 (same as B3)');
        down.simplifyEnharmonics(true);
        assert.deepEqual(nwo(down), ['G3', 'B3', 'D4'], 'G3 C-4 D4 respelled to G3 B3 D4');
        assert.deepEqual(psOf(down), downPs, 'ps unchanged after respelling C-4 -> B3');
    });

    test('music21.chord.Chord.clone deep-copies notes', assert => {
        const c = new music21.chord.Chord('C4 E4 G4');

        const deep = c.clone(true);
        assert.notStrictEqual(deep.notes[0], c.notes[0], 'deep clone makes new Note objects');
        assert.notStrictEqual(
            deep.pitches[0], c.pitches[0], 'deep clone makes new Pitch objects'
        );
        deep.notes[1].pitch.name = 'F';  // mutate the clone
        assert.equal(c.pitches[1].name, 'E', 'mutating a deep clone leaves the original alone');

        // A shallow clone keeps the same Note objects but in a new array.
        const shallow = c.clone(false);
        assert.strictEqual(shallow.notes[0], c.notes[0], 'shallow clone shares Note objects');
        shallow.add(new music21.note.Note('B4'));
        assert.equal(c.length, 3, 'shallow clone has an independent notes array');
        assert.equal(shallow.length, 4, 'added note lands only on the shallow clone');
    });
}
