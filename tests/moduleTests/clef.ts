import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;

export default function tests() {
    test('music21.clef.Clef', assert => {
        const c1 = new music21.clef.Clef();
        assert.ok(c1.isClassOrSubclass('Clef'), 'clef is a Clef');

        const ac = new music21.clef.AltoClef();
        assert.equal(ac.lowestLine, 25, 'first line set');
        const n = new music21.note.Note('C#4');
        n.setStemDirectionFromClef(ac);
        assert.equal(n.stemDirection, 'down', 'stem direction set to down');
        n.pitch.diatonicNoteNum -= 1;
        n.setStemDirectionFromClef(ac);
        assert.equal(n.stemDirection, 'up', 'stem direction set');
        n.pitch.diatonicNoteNum += 1;
        const p2 = ac.convertPitchToTreble(n.pitch);
        assert.equal(p2.nameWithOctave, 'B#4', 'converted to treble');
    });
    test('music21.clef.Clef 8va', assert => {
        const ac = new music21.clef.Treble8vaClef();
        assert.equal(ac.lowestLine, 38, 'first line set');
        const n = new music21.note.Note('C#5');
        n.setStemDirectionFromClef(ac);
        assert.equal(n.stemDirection, 'up', 'stem direction set');
        const p2 = ac.convertPitchToTreble(n.pitch);
        assert.equal(p2.nameWithOctave, 'C#4', 'converted to treble');
        const s = new music21.stream.Stream();
        s.clef = ac;
        s.append(n);
        s.appendNewDOM();
    });
    test('music21.clef.Clef Chord setStemDirectionFromClef', assert => {
        const tc = new music21.clef.TrebleClef();
        // Treble clef midLine is on B4 (DNN 32 + 4 = 36 -> wait check)
        // TrebleClef.lowestLine = 31; midLine = 35 -> B4 (DNN 35? Let's just use the result)

        // High chord -- highest pitch furthest from center -> stem down
        const cHigh = new music21.chord.Chord(['F5', 'A5']);
        cHigh.setStemDirectionFromClef(tc);
        assert.equal(cHigh.stemDirection, 'down', 'high chord stem down');

        // Low chord -- lowest pitch furthest from center -> stem up
        const cLow = new music21.chord.Chord(['C4', 'E4']);
        cLow.setStemDirectionFromClef(tc);
        assert.equal(cLow.stemDirection, 'up', 'low chord stem up');

        // Tie at the center -- highest pitch wins, stem down
        // Symmetric around B4: A4 and C#5 -> highest wins -> down
        const cTie = new music21.chord.Chord(['A4', 'C#5']);
        cTie.setStemDirectionFromClef(tc);
        assert.equal(cTie.stemDirection, 'down', 'symmetric chord around midline -> highest wins -> down');

        // chained call returns the chord itself
        const cChain = new music21.chord.Chord(['C5', 'E5', 'G5']);
        const ret = cChain.setStemDirectionFromClef(tc);
        assert.strictEqual(ret, cChain, 'setStemDirectionFromClef returns this');

        // undefined clef -> no change, returns this
        const cUndef = new music21.chord.Chord(['C5', 'E5']);
        const before = cUndef.stemDirection;
        const retU = cUndef.setStemDirectionFromClef(undefined);
        assert.strictEqual(retU, cUndef, 'undefined clef returns this');
        assert.equal(cUndef.stemDirection, before, 'undefined clef leaves stem direction unchanged');
    });
    test('music21.clef.Clef Chord getStemDirectionFromClef', assert => {
        const tc = new music21.clef.TrebleClef();

        const cHigh = new music21.chord.Chord(['F5', 'A5']);
        assert.equal(cHigh.getStemDirectionFromClef(tc), 'down', 'high chord get -> down');

        const cLow = new music21.chord.Chord(['C4', 'E4']);
        assert.equal(cLow.getStemDirectionFromClef(tc), 'up', 'low chord get -> up');

        // get must not mutate the chord
        const cGet = new music21.chord.Chord(['C4', 'E4']);
        const orig = cGet.stemDirection;
        cGet.getStemDirectionFromClef(tc);
        assert.equal(cGet.stemDirection, orig, 'getStemDirectionFromClef does not mutate stemDirection');

        // alto clef: midLine = 25 + 4 = 29 -> C4 (DNN 29).
        const ac = new music21.clef.AltoClef();
        const cAltoHigh = new music21.chord.Chord(['E4', 'G4']);
        assert.equal(cAltoHigh.getStemDirectionFromClef(ac), 'down', 'alto clef high chord -> down');
        const cAltoLow = new music21.chord.Chord(['F3', 'A3']);
        assert.equal(cAltoLow.getStemDirectionFromClef(ac), 'up', 'alto clef low chord -> up');
    });
    test('music21.clef clefFromString', assert => {
        const tc = music21.clef.clefFromString('treble');
        assert.ok(tc.isClassOrSubclass('TrebleClef'), 'tc is TrebleClef');
        const tc2 = music21.clef.clefFromString('treble8va');
        assert.ok(tc2.isClassOrSubclass('Treble8vaClef'), 'tc2 is Treble8vaClef');
        const bc = music21.clef.clefFromString('F4');
        assert.ok(bc.isClassOrSubclass('BassClef'), 'bc is BassClef');
    });
    test('music21.clef bestClef', assert => {
        const s = new music21.stream.Stream();
        s.append(new music21.note.Note('C5'));
        assert.ok(music21.clef.bestClef(s).isClassOrSubclass('TrebleClef'), 'best clef is treble');
        s.append(new music21.chord.Chord(['C2', 'E2', 'G2']));
        assert.ok(music21.clef.bestClef(s).isClassOrSubclass('BassClef'), 'best clef is bass');
        const m = new music21.stream.Measure();
        m.append(new music21.chord.Chord(['E7', 'F7', 'G7', 'A7', 'B7', 'C8']));
        s.append(m);
        assert.ok(music21.clef.bestClef(s).isClassOrSubclass('TrebleClef'), 'best clef is treble');
        assert.ok(
            music21.clef.bestClef(s, {recurse: false}).isClassOrSubclass('BassClef'),
            'best clef is bass'
        );
    });
}
