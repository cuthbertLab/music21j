import * as QUnit from 'qunit';
import music21 from '../../src/loadModules';

export default function tests() {
    QUnit.test('music21.meter.TimeSignature', assert => {
        const m = new music21.meter.TimeSignature('4/4');

        assert.equal(m.ratioString, '4/4', 'ratioString matches');
        assert.equal(m.barDuration.quarterLength, 4.0, 'bar lasts 4.0 ql');
        assert.deepEqual(m.beatGroups, [[2, 8]], 'beatGroups check out');
        assert.equal(m.beatCount, 4, 'beat count is 4');
        assert.equal(
            m.beatDuration.type,
            'quarter',
            'beatDuration type is quarter'
        );
        assert.equal(m.beatDuration.dots, 0, 'beatDuration has not dots');
    });

    QUnit.test('music21.meter.TimeSignature beams', assert => {
        const m = new music21.meter.TimeSignature('4/4');
        const [start, end] = m.offsetToSpan(3.2);
        assert.equal(start, 3.0, 'beat starts at 3');
        assert.equal(end, 4.0, 'beat ends at 4');
     
    });
    
    QUnit.test('music21.meter.TimeSignature compound', assert => {
        const m = new music21.meter.TimeSignature('6/8');

        assert.equal(m.ratioString, '6/8', 'ratioString matches');
        assert.equal(m.barDuration.quarterLength, 3.0, 'bar lasts 3.0 ql');
        assert.deepEqual(
            m.beatGroups,
            [[3, 8], [3, 8]],
            'beatGroups check out'
        );
        assert.equal(m.beatCount, 2, 'beat count is 2');
        assert.equal(
            m.beatDuration.type,
            'quarter',
            'beatDuration type is quarter'
        );
        assert.equal(m.beatDuration.dots, 1, 'beatDuration has dot');
    });
}
