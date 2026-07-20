import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;

export default function tests() {
    test('music21.note.Note', assert => {
        const n = new music21.note.Note('D#5');

        assert.equal(n.pitch.name, 'D#', 'Pitch Name set to D#');
        assert.equal(n.pitch.step, 'D', 'Pitch Step set to D');
        assert.equal(n.pitch.octave, 5, 'Pitch octave set to 5');
    });

    test('music21.note.Note.getGrace', assert => {
        const n = new music21.note.Note('C');
        n.quarterLength = 0.5;
        const grace = n.getGrace(false);

        assert.ok(grace.duration.isGrace);
        assert.ok((grace.duration as music21.duration.GraceDuration).slash);
        assert.notOk(grace.duration.linked);
        assert.equal(grace.duration.type, 'eighth');
    });

    test('music21.note.Note.vexflowNote stems', assert => {
        const n1 = new music21.note.Note('C');
        const vfn1 = n1.vexflowNote();
        assert.ok(vfn1.hasStem());

        const n2 = new music21.note.Note('C');
        n2.stemDirection = 'noStem';
        const vfn2 = n2.vexflowNote();
        assert.notOk(vfn2.hasStem());
    });

    test('music21.note.Note setStemDirectionFromClef', assert => {
        const tc = new music21.clef.TrebleClef();
        // Treble clef midLine = lowestLine (31) + 4 = 35 -> B4 (DNN 32).
        // Wait: TrebleClef.lowestLine is 31; midLine is 35 -> B4. >=0 -> down.

        const nHigh = new music21.note.Note('G5');
        nHigh.setStemDirectionFromClef(tc);
        assert.equal(nHigh.stemDirection, 'down', 'high note in treble -> down');

        const nLow = new music21.note.Note('D4');
        nLow.setStemDirectionFromClef(tc);
        assert.equal(nLow.stemDirection, 'up', 'low note in treble -> up');

        // Note exactly on midLine -> 'down' (>= 0).
        const nMid = new music21.note.Note('B4');
        nMid.setStemDirectionFromClef(tc);
        assert.equal(nMid.stemDirection, 'down', 'note on midline -> down');

        // Bass clef: lowestLine = 19 -> midLine = 23 -> D3.
        const bc = new music21.clef.BassClef();
        const nBassHigh = new music21.note.Note('A3');
        nBassHigh.setStemDirectionFromClef(bc);
        assert.equal(nBassHigh.stemDirection, 'down', 'high note in bass -> down');
        const nBassLow = new music21.note.Note('F2');
        nBassLow.setStemDirectionFromClef(bc);
        assert.equal(nBassLow.stemDirection, 'up', 'low note in bass -> up');

        // get does not mutate.
        const nGet = new music21.note.Note('G5');
        const before = nGet.stemDirection;
        const got = nGet.getStemDirectionFromClef(tc);
        assert.equal(got, 'down', 'getStemDirectionFromClef returns "down" for high note');
        assert.equal(nGet.stemDirection, before, 'getStemDirectionFromClef does not mutate');

        // chained call returns the note itself.
        const ret = nLow.setStemDirectionFromClef(tc);
        assert.strictEqual(ret, nLow, 'setStemDirectionFromClef returns this');

        // undefined clef -> no change, returns this.
        const nUndef = new music21.note.Note('C5');
        const beforeU = nUndef.stemDirection;
        const retU = nUndef.setStemDirectionFromClef(undefined);
        assert.strictEqual(retU, nUndef, 'undefined clef returns this');
        assert.equal(nUndef.stemDirection, beforeU, 'undefined clef leaves stem direction unchanged');
    });

    test('music21.note.Rest setStemDirectionFromClef no-op', assert => {
        // Rests have no stems; getStemDirectionFromClef should always return ''
        // and setStemDirectionFromClef should not change anything.
        const tc = new music21.clef.TrebleClef();
        const bc = new music21.clef.BassClef();

        const r = new music21.note.Rest();
        assert.equal(r.getStemDirectionFromClef(tc), '', 'rest get -> "" (treble)');
        assert.equal(r.getStemDirectionFromClef(bc), '', 'rest get -> "" (bass)');
        assert.equal(
            r.getStemDirectionFromClef(undefined),
            '',
            'rest get -> "" even with undefined clef',
        );

        // setStemDirectionFromClef on a Rest must not mutate any stem-related
        // state and must return the rest for chaining.
        const ret = r.setStemDirectionFromClef(tc);
        assert.strictEqual(ret, r, 'rest setStemDirectionFromClef returns this');

        // Even after setting from a clef, getStemDirectionFromClef stays ''.
        r.setStemDirectionFromClef(bc);
        assert.equal(
            r.getStemDirectionFromClef(bc),
            '',
            'rest still returns "" after setStemDirectionFromClef call',
        );
    });

    test('music21.note.Rest.vexflowNote whole rest', assert => {
        const r = new music21.note.Rest();
        r.duration.type = 'whole';
        const m = new music21.stream.Measure();
        m.append(r);

        let vfr = r.vexflowNote({});
        assert.equal(vfr.getKeyLine(0), 4);

        m.renderOptions.staffLines = 1;
        vfr = r.vexflowNote({});
        assert.equal(vfr.getKeyLine(0), 3);
    });
}
