import * as QUnit from 'qunit';
import * as music21 from '../../src/music21_modules.js';

const figuredBass = music21.figuredBass;

const { test } = QUnit;

export default function tests() {
    test('music21.figuredBass.Notation', assert => {
        const n1 = new figuredBass.Notation('4+,2');
        assert.equal(n1.notationColumn, '4+,2');
    });
}
