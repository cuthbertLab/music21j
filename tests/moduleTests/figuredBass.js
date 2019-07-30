import * as QUnit from '../../node_modules/qunit/qunit/qunit.js';
import * as music21 from '../../src/music21_modules.js';

const figuredBass = music21.figuredBass;

export default function tests() {
    QUnit.test('music21.figuredBass.Notation', assert => {
        const n1 = new figuredBass.Notation('4+,2');
        assert.equal(n1.notationColumn, '4+,2');
    });
}
