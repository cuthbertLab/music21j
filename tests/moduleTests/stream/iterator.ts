import * as QUnit from 'qunit';
import * as music21 from '../../../src/main';

const { test } = QUnit;

export default function tests() {
    test('music21.stream.iterator.OffsetIterator', assert => {
        const c = new music21.note.Note('C');
        const d = new music21.note.Note('D');
        const e = new music21.note.Note('E');
        const f = new music21.note.Note('F');

        const s = new music21.stream.Stream();
        // C & E dyad moving to D & F
        s.insert(0, c);
        s.insert(1, d);
        s.insert(0, e);
        s.insert(1, f);

        const iter = new music21.stream.iterator.OffsetIterator(s);
        assert.equal(iter.length, 2);
        assert.equal(
            iter.map(x => (x[0] as music21.note.Note).pitch.name),
            ['C', 'E', 'D', 'F']
        );
    });
}
