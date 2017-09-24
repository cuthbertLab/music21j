import * as QUnit from 'qunit';
import music21 from '../../src/loadModules';

const figuredBass = music21.figuredBass;

export default function tests() {
    QUnit.test('music21.figuredBass.Notation', assert => {
        const n1 = new figuredBass.Notation('4+,2');
        assert.equal(n1.notationColumn, '4+,2');
    });
}
