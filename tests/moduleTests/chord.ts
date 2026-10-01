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

    test('music21.chord.Chord.clone does not share _cache or _overrides', assert => {
        const c = new music21.chord.Chord('C4 E4 G4');
        c.root(new music21.pitch.Pitch('E4'));  // sets an override (and caches)
        c._cache.marker = 1;

        for (const deep of [true, false]) {
            const cl = c.clone(deep);
            assert.notStrictEqual(cl._cache, c._cache, `_cache not shared (deep=${deep})`);
            assert.deepEqual(cl._cache, {}, `clone starts with an empty _cache (deep=${deep})`);
            assert.notStrictEqual(
                cl._overrides, c._overrides, `_overrides not shared (deep=${deep})`
            );
            assert.equal(cl.root().name, 'E', `root override preserved (deep=${deep})`);
        }

        // A deep clone also clones music21-object override values.
        const deepClone = c.clone(true);
        assert.notStrictEqual(
            deepClone._overrides.root, c._overrides.root, 'deep clone copies override values'
        );
        // Mutating the clone's containers must not touch the original.
        deepClone._cache.marker = 2;
        deepClone._overrides.extra = 9;
        assert.equal(c._cache.marker, 1, 'mutating clone _cache leaves the original intact');
        assert.notOk(c._overrides.extra, 'mutating clone _overrides leaves the original intact');
    });

    test('music21.chord.Chord.bass setting', assert => {
        const c = new music21.chord.Chord('E##4 F-4 C5');
        assert.equal(c.bass().nameWithOctave, 'F-4', 'lowest by ps');
        const eSharpSharp = c.pitches[0];
        c.bass('E##4');
        assert.strictEqual(c.bass(), eSharpSharp, 'bass set to the pitch in the chord');
        assert.throws(() => c.bass('G--4'), /Pitch G--4 not found in chord/);
        c.bass('G--4', { allowAdd: true });
        assert.equal(c.bass().nameWithOctave, 'G--4');
        assert.equal(c.length, 4, 'allowAdd adds the pitch');

        // matches by name if no octave match
        const c2 = new music21.chord.Chord('C4 E4 G4');
        c2.bass('E5');
        assert.strictEqual(c2.bass(), c2.pitches[1]);
        assert.equal(c2.bass(undefined, { find: true }).nameWithOctave, 'C4');
        assert.equal(c2._overrides.bass, undefined, 'find: true clears the set bass');

        const em = new music21.chord.Chord('E3 G3 B4');
        assert.equal(em.bass(undefined, { find: false }), undefined);
        assert.equal(em.bass().nameWithOctave, 'E3');
    });

    test('music21.chord.Chord.inversion', assert => {
        assert.equal(new music21.chord.Chord('G4 B4 D5 F5').inversion(), 0);
        assert.equal(new music21.chord.Chord('E1 G1 C2').inversion(), 1);
        assert.equal(new music21.chord.Chord('G1 E2 C2').inversion(), 2);

        const d7 = new music21.chord.Chord('C4 B4');
        d7.bass(new music21.pitch.Pitch('B4'));
        assert.equal(d7.inversion(), 3);

        const g9 = new music21.chord.Chord('G4 B4 D5 F5 A4');
        g9.bass(new music21.pitch.Pitch('A4'));
        assert.equal(g9.inversion(), 4);

        const dim7 = new music21.chord.Chord('B4 D5 F5 A-5 C6 E6 G6');
        assert.equal(dim7.inversion(), 0);
        assert.equal(dim7.inversion({ testRoot: new music21.pitch.Pitch('D5') }), 6);

        assert.equal(new music21.chord.Chord('C4 G4').inversion(), 0);

        const bb11 = new music21.chord.Chord('B-4 D4 F4 A4 C4 E-4');
        bb11.root(bb11.pitches.find(p => p.name === 'B-'));
        bb11.bass('E-4');
        assert.equal(bb11.inversion(), 5);

        // interval-based: root need not be a pitch of the chord
        const dMin = new music21.chord.Chord('D4 F4 A4');
        assert.equal(dMin.inversion({ testRoot: new music21.pitch.Pitch('C5') }), 4);
        assert.equal(dMin.inversion({ testRoot: new music21.pitch.Pitch('B-2') }), 1);

        const cEmpty = new music21.chord.Chord();
        assert.equal(cEmpty.inversion(), -1);
        assert.equal(cEmpty.inversion({ testRoot: new music21.pitch.Pitch('C5') }), -1);
    });

    test('music21.chord.Chord.setInversion', assert => {
        const g7 = new music21.chord.Chord('G4 B4 D5 F5');
        const g7First = g7.setInversion(1);
        assert.notStrictEqual(g7First, g7, 'returns a new chord by default');
        assert.equal(g7First.stringInfo(), 'B4 D5 F5 G5');
        assert.equal(g7First.inversion(), 1);
        assert.equal(g7.stringInfo(), 'G4 B4 D5 F5', 'original unchanged');

        assert.strictEqual(g7.setInversion(1, { inPlace: true }), g7);
        assert.equal(g7.stringInfo(), 'B4 D5 F5 G5');

        const gMajRepeats = new music21.chord.Chord('G4 B5 G6 B6 D7');
        gMajRepeats.setInversion(2, { inPlace: true });
        assert.equal(gMajRepeats.stringInfo(), 'D7 G7 B7 G8 B8');
        assert.throws(
            () => gMajRepeats.setInversion(3),
            /Could not invert chord: inversion may not exist/
        );
        assert.throws(() => gMajRepeats.setInversion(1.5), /Inversion must be an integer/);

        // transpose: false only stores the value
        const c = new music21.chord.Chord('C4 E4 G4');
        c.setInversion(2, { transpose: false, inPlace: true });
        assert.equal(c.stringInfo(), 'C4 E4 G4');
        assert.equal(c.inversion(), 2);
        assert.equal(
            c.inversion({ testRoot: c.pitches[0] }), 0, 'testRoot ignores stored inversion'
        );

        const cDerived = new music21.chord.Chord('C4 E4 G4').setInversion(2);
        assert.equal(cDerived.stringInfo(), 'G4 C5 E5');
        assert.equal(cDerived.derivation.method, 'setInversion');
        assert.throws(
            () => new music21.chord.Chord().setInversion(1),
            /Cannot invert a chord without pitches/
        );

        // undefined clears a stored inversion
        const c6 = new music21.chord.Chord('C4 E4 G4 A4');
        assert.equal(c6.inversion(), 1);
        c6.setInversion(0, { transpose: false, inPlace: true });
        assert.equal(c6.inversion(), 0);
        assert.equal(c6.bass().nameWithOctave, 'C4', 'bass unchanged');
        const cleared = c6.setInversion(undefined);
        assert.equal(cleared.inversion(), 1);
        assert.equal(c6.inversion(), 0, 'original keeps its stored inversion');
        c6.setInversion(undefined, { inPlace: true });
        assert.equal(c6.inversion(), 1);
    });

    test('music21.chord.Chord.sortDiatonicAscending', assert => {
        const unsorted = new music21.chord.Chord('C4 E4 G4');
        (unsorted as any)._notes.reverse();
        const sorted = unsorted.sortDiatonicAscending();
        assert.notStrictEqual(sorted, unsorted, 'returns a new chord');
        assert.equal(sorted.stringInfo(), 'C4 E4 G4');
        assert.equal(unsorted.stringInfo(), 'G4 E4 C4', 'original unchanged');
        assert.strictEqual(unsorted.sortDiatonicAscending({ inPlace: true }), unsorted);
        assert.equal(unsorted.stringInfo(), 'C4 E4 G4');

        const sameDNN = new music21.chord.Chord('F#4 F4');
        assert.equal(sameDNN.sortDiatonicAscending().stringInfo(), 'F4 F#4');
    });

    test('music21.chord.Chord.isTriad and isSeventh', assert => {
        assert.ok(new music21.chord.Chord('C4 E4 A4').isTriad());
        assert.notOk(new music21.chord.Chord('C D E F G').isTriad());
        assert.notOk(new music21.chord.Chord('C D# G').isTriad(), 'misspelled triad');
        assert.ok(new music21.chord.Chord('C E- G').isTriad());
        assert.notOk(new music21.chord.Chord().isTriad());
        assert.notOk(new music21.chord.Chord('C4 E4 G4 B#4').isTriad());

        assert.ok(new music21.chord.Chord('C E G B').isSeventh());
        assert.notOk(new music21.chord.Chord('C D E F G B').isSeventh());
        assert.notOk(new music21.chord.Chord().isSeventh());
    });
}
