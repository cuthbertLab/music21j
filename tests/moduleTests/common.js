import * as QUnit from 'qunit';
import music21 from '../../src/loadModules';

const common = music21.common;

export default function tests() {
    QUnit.test('music21.common.posMod', assert => {
        assert.equal(common.posMod(8, 7), 1, 'positive posMod passed');
        assert.equal(common.posMod(-1, 7), 6, 'negative posMod passed');
        assert.equal(common.posMod(-15, 7), 6, 'big negative posMod passed');
    });
}
