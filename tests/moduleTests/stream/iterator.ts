import * as QUnit from 'qunit';
import * as music21 from '../../../src/main';

const { test } = QUnit;

export default function tests() {
    test('music21.stream.iterator.OffsetIterator', assert => {
        const c = new music21.note.Note('C');
        const d = new music21.note.Note('D');
        const e = new music21.note.Note('E');
        const f = new music21.note.Note('F');
        const g = new music21.note.Note('G');
        const a = new music21.note.Note('A');

        const s = new music21.stream.Stream();
        // CEG triad moving to DFA
        s.insert(0, c);
        s.insert(1, d);
        s.insert(0, e);
        s.insert(1, f);
        s.insert(0, g);
        s.insert(1, a);

        const iter = new music21.stream.iterator.OffsetIterator(s);
        assert.equal(iter.length, 2);
        assert.equal(
            iter.map(x => (x[0] as music21.note.Note).pitch.name),
            ['C', 'E', 'G', 'D', 'F', 'A']
        );
    });
}
