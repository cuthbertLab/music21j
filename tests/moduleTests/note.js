import * as QUnit from 'qunit';
import * as music21 from '../../src/music21_modules';

const { test } = QUnit;

export default function tests() {
    test('music21.note.Note', assert => {
        const n = new music21.note.Note('D#5');

        assert.equal(n.pitch.name, 'D#', 'Pitch Name set to D#');
        assert.equal(n.pitch.step, 'D', 'Pitch Step set to D');
        assert.equal(n.pitch.octave, 5, 'Pitch octave set to 5');
    });
}
