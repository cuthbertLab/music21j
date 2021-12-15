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
