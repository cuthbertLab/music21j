import * as QUnit from 'qunit';
import * as music21 from '../../src/music21_modules';

const { test } = QUnit;

export default function tests() {
    test('music21.articulations.Articulation', assert => {
        const acc = new music21.articulations.Accent();
        assert.equal(acc.name, 'accent', 'matching names for accent');
        const ten = new music21.articulations.Tenuto();
        assert.equal(ten.name, 'tenuto', 'matching names for tenuto');
        const n = new music21.note.Note('C');
        n.articulations.push(acc);
        n.articulations.push(ten);
        assert.equal(n.articulations[0].name, 'accent', 'accent in array');
        assert.equal(n.articulations[1].name, 'tenuto', 'tenuto in array');
    });

    test('music21.articulations.Articulation display', assert => {
        // Marcato is a pseudo multiple inheritance
        const marc = new music21.articulations.Marcato();
        assert.equal(marc.name, 'marcato', 'matching names for marcato');
        const n = new music21.note.Note('D#5');
        n.articulations.push(marc);
        const nBoring = new music21.note.Note('D#5');

        const measure = new music21.stream.Measure();
        measure.append(n);
        measure.append(nBoring);
        measure.append(nBoring.clone());
        measure.append(n.clone());
        measure.appendNewDOM();
        assert.ok(true, 'something worked');
    });
}
