import * as QUnit from 'qunit';
import music21 from '../../src/loadModules';

export default function tests() {
    QUnit.test('music21.chord.Chord', assert => {
        let c = new music21.chord.Chord(['C5', 'E5', 'G5']);

        assert.equal(c.length, 3, 'Checking length of Chord');
        assert.ok(c.isMajorTriad(), 'C E G should be a major triad');
        assert.equal(
            c.isMinorTriad(),
            false,
            'C E G should not be minor triad'
        );
        assert.equal(c.canBeTonic(), true, 'C E G can be a tonic');

        // string construction
        c = new music21.chord.Chord('C5 E5 G5');
        assert.equal(c.length, 3, 'Checking length of Chord');
        assert.ok(c.isMajorTriad(), 'test chord construction from string');

        c = new music21.chord.Chord(['B', 'G', 'D', 'F']);
        assert.ok(c.isDominantSeventh());
        
        // test is sorted:
        c = new music21.chord.Chord('C5 E4 G3');
        const pitches = c.pitches;
        assert.equal(pitches[0].nameWithOctave, 'G3');
        assert.equal(pitches[2].nameWithOctave, 'C5');
        
    });
}
