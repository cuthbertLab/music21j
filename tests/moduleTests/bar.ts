import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;


export default function tests() {
    test('music21.bar.standardizeBarType', assert => {
        const { standardizeBarType } = music21.bar;

        assert.equal(standardizeBarType(), 'regular', 'default barline is regular');
        assert.equal(standardizeBarType('single'), 'regular', 'deprecated single alias maps to regular');
        assert.equal(standardizeBarType('end'), 'final', 'deprecated end alias maps to final');
        assert.equal(standardizeBarType('light-light'), 'double', 'MusicXML light-light maps to double');
        assert.equal(standardizeBarType('light-heavy'), 'final', 'MusicXML light-heavy maps to final');
        assert.equal(standardizeBarType('FINAL'), 'final', 'capitalization is normalized');

        assert.throws(() => {
            standardizeBarType('not-a-barline');
        }, /cannot process style/, 'invalid styles throw BarException');
    });

    test('music21.bar.Barline normalizes deprecated aliases', assert => {
        const single = new music21.bar.Barline('single');
        assert.equal(single.type, 'regular', 'single barline stores regular type');
        assert.equal(single.musicXMLBarStyle(), 'regular', 'regular barline exports as regular');

        const end = new music21.bar.Barline('end');
        assert.equal(end.type, 'final', 'end barline stores final type');
        assert.equal(end.musicXMLBarStyle(), 'light-heavy', 'final barline exports as light-heavy');
    });
}
