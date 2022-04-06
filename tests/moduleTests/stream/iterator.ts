import * as QUnit from 'qunit';
import * as music21 from '../../../src/main';

const { test } = QUnit;

export default function tests() {
    test('music21.stream.iterator.OffsetIterator', assert => {
        const n = new music21.note.Note('C#');
        n.duration.type = 'whole';
        const s = new music21.stream.Stream();
        s.repeatAppend(n, 5);
        const iter = new music21.stream.iterator.OffsetIterator(s);
        assert.equal(iter.length, 5);
    });
}
