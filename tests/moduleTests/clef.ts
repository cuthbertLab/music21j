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
