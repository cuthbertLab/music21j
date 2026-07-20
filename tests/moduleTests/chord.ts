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
}
