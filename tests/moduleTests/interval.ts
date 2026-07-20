import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

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
    test('music21.interval.intervalToPythagoreanRatio', assert => {
        const cases: [string, number, number][] = [
            ['P4', 4, 3],
            ['P5', 3, 2],
            ['M7', 243, 128],
            ['m23', 2048, 243],
            ['M3', 81, 64],
        ];
        for (const [name, num, den] of cases) {
            const ratio = interval.intervalToPythagoreanRatio(new Interval(name));
            assert.equal(ratio.numerator, num, `${name} numerator`);
            assert.equal(ratio.denominator, den, `${name} denominator`);
        }
    });
    test('music21.interval.convertDiatonicNumberToStep', assert => {
        // regression: negative diatonic numbers (very low notes) must resolve
        assert.deepEqual(interval.convertDiatonicNumberToStep(1), ['C', 0]);
        assert.deepEqual(interval.convertDiatonicNumberToStep(0), ['B', -1]);
        assert.deepEqual(interval.convertDiatonicNumberToStep(-1), ['A', -1]);
        assert.deepEqual(interval.convertDiatonicNumberToStep(-4), ['E', -1]);
        assert.deepEqual(interval.convertDiatonicNumberToStep(-7), ['B', -2]);
    });
}
