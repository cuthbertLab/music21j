import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;


export default function tests() {
    test('music21.tinyNotation.TinyNotation optional prefix', assert => {
        const p = music21.tinyNotation.TinyNotation('tinyNotation: fn1');
        assert.equal(p.recurse().notes.length, 1);
    });
}
