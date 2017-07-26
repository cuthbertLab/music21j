import * as QUnit from 'qunit';
import music21 from '../../src/loadModules';

export default function tests() {
    QUnit.test('music21.chord.Chord', (assert) => {
        const c = new music21.chord.Chord(['C5', 'E5', 'G5']);

        assert.equal(c.length, 3, 'Checking length of Chord');
        assert.equal(c.isMajorTriad(), true, 'C E G should be a major triad');
        assert.equal(c.isMinorTriad(), false, 'C E G should not be minor triad');
        assert.equal(c.canBeTonic(), true, 'C E G can be a tonic');
    });
}
