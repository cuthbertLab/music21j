import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;

export default function tests() {
    test('music21.dynamics.Dynamic', assert => {
        let dynamic = new music21.dynamics.Dynamic('pp');
        assert.equal(dynamic.value, 'pp', 'matching dynamic');

        dynamic = new music21.dynamics.Dynamic(0.98);
        assert.equal(dynamic.value, 'fff', 'number conversion successful');
        assert.equal(dynamic.volumeScalar, 0.98, 'correct volume');
        assert.equal(dynamic.longName, 'fortississimo', 'matching long name');
        assert.equal(
            dynamic.englishName,
            'extremely loud',
            'matching english names'
        );

        dynamic = new music21.dynamics.Dynamic('other');
        assert.equal(dynamic.value, 'other', 'record non standard dynamic');
        assert.equal(
            dynamic.longName,
            '',
            'no long name for non standard dynamic'
        );
        assert.equal(
            dynamic.englishName,
            '',
            'no english name for non standard dynamic'
        );

        dynamic.value = 0.18;
        assert.equal(dynamic.value, 'pp', 'change in dynamic');
        assert.equal(dynamic.volumeScalar, 0.18, 'change in volume');

        dynamic.value = 'other';
        assert.equal(dynamic.value, 'other', 'change to non standard');
        assert.equal(
            dynamic.longName,
            '',
            'change to non standard dynamic'
        );
        assert.equal(
            dynamic.englishName,
            '',
            'change to non standard dynamic'
        );
    });
}
