import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;


export default function tests() {
    test('music21.tinyNotation.TinyNotation optional prefix', assert => {
        const p = music21.tinyNotation.TinyNotation('tinyNotation: fn1');
        assert.equal(p.recurse().notes.length, 1);
    });

    test('music21.tinyNotation.TinyNotation split space length', assert => {
        const tn = (s: string) => {
            const p = music21.tinyNotation.TinyNotation(s);
            return p.recurse().notes.length;
        };

        assert.equal(tn('C4'), 1);
        assert.equal(tn('C4 D'), 2);
        assert.equal(tn('C4     D'), 2);
        assert.equal(tn('C4_hi there'), 1);
        assert.equal(tn('C4_hi there D'), 2);
        assert.equal(tn('C4\nD4'), 2);
        assert.equal(tn('C4\tD4'), 2);
        assert.equal(tn('C4 partBreak D4'), 2);
    });
}
