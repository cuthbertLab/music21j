import * as QUnit from 'qunit';
import * as music21 from '../../src/music21_modules.js';

const common = music21.common;

const { test } = QUnit;


export default function tests() {
    test('music21.common.posMod', assert => {
        assert.equal(common.posMod(8, 7), 1, 'positive posMod passed');
        assert.equal(common.posMod(-1, 7), 6, 'negative posMod passed');
        assert.equal(common.posMod(-15, 7), 6, 'big negative posMod passed');
    });

    test('music21.common.fromRoman', assert => {
        assert.equal(common.fromRoman('I'), 1, 'first roman passed');
        assert.equal(common.fromRoman('LX'), 60, 'LX roman passed');
        assert.equal(common.fromRoman('XC'), 90, 'XC subtraction roman passed');
        assert.equal(
            common.fromRoman('xc'),
            90,
            'lowercase subtraction roman passed'
        );
        assert.equal(common.fromRoman('VIII'), 8, 'max RN passed');
        assert.equal(common.fromRoman('MCDLXXXIX'), 1489, 'big roman passed');
    });

    test('music21.common.toRoman', assert => {
        assert.equal(common.toRoman(1), 'I', 'first roman passed');
        assert.equal(common.toRoman(2), 'II', '2 passed');
        assert.equal(common.toRoman(7), 'VII', '7 passed');
        assert.equal(common.toRoman(1999), 'MCMXCIX', '1999 passed');
    });
}
