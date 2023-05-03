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

    test('music21.note.Note.vexflowNote stems', assert => {
        const n1 = new music21.note.Note('C');
        const vfn1 = n1.vexflowNote();
        assert.ok(vfn1.hasStem());

        const n2 = new music21.note.Note('C');
        n2.stemDirection = 'noStem';
        const vfn2 = n2.vexflowNote();
        assert.notOk(vfn2.hasStem());
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
