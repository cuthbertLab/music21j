import * as QUnit from '../../node_modules/qunit/qunit/qunit.js';
import * as music21 from '../../src/music21_modules.js';

export default function tests() {
    QUnit.test('music21.tie.Tie', assert => {
        const t = new music21.tie.Tie('start');
        assert.equal(t.type, 'start', 'Tie type is start');
    });
}
