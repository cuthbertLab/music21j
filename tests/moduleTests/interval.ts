import * as QUnit from 'qunit';
import music21 from '../../src/music21';

const interval = music21.interval;
const Interval = music21.interval.Interval;

const { test } = QUnit;


export default function tests() {
    test('music21.interval.intervalFromGenericAndChromatic', assert => {
        const i = interval.intervalFromGenericAndChromatic(2, 2);
        assert.equal(i.name, 'M2');
    });
    test('music21.interval.Interval', assert => {
        const i = new Interval('P5');
        assert.equal(i.name, 'P5', 'name passed');
        assert.equal(i.niceName, 'Perfect Fifth', 'nice name passed');
        assert.equal(i.generic.simpleDirected, 5);
    });
    test('music21.interval.DiatonicInterval', assert => {
        const i = new interval.DiatonicInterval('P', 5);
        assert.equal(i.specifier, 1);
        assert.equal(i.specifierAbbreviation, 'P');
    });
}
