import * as QUnit from 'qunit';
import music21 from '../../build/music21.debug.js';

export default function tests() {
    QUnit.test('music21.tie.Tie', assert => {
        const t = new music21.tie.Tie('start');
        assert.equal(t.type, 'start', 'Tie type is start');
    });
}
