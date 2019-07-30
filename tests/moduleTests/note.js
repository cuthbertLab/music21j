import * as QUnit from '../../node_modules/qunit/qunit/qunit.js';
import * as music21 from '../../src/music21_modules.js';

export default function tests() {
    QUnit.test('music21.note.Note', assert => {
        const n = new music21.note.Note('D#5');

        assert.equal(n.pitch.name, 'D#', 'Pitch Name set to D#');
        assert.equal(n.pitch.step, 'D', 'Pitch Step set to D');
        assert.equal(n.pitch.octave, 5, 'Pitch octave set to 5');
    });
}
