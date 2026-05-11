import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;


export default function tests() {
    test('music21.metadata.Metadata', assert => {
        const m = new music21.metadata.Metadata({title: 'Aloha Oe', composer: 'Liliuokalani'});
        assert.equal(m.title, 'Aloha Oe');
        assert.equal(m.composer, 'Liliuokalani');
    });

    test('music21.metadata.Metadata in Streams', assert => {
        const s = new music21.stream.Score();
        s.insert(0.0, new music21.note.Note('C4'));
        s.metadata.title = 'Aloha Oe';
        assert.equal(s.metadata.title, 'Aloha Oe');
        const old_md = s.metadata;

        const md2 = new music21.metadata.Metadata({title: 'Pink Pony Club'});
        s.metadata = md2;
        assert.equal(s.metadata.title, 'Pink Pony Club');
        assert.equal(old_md.title, 'Aloha Oe');
        assert.ok(Array.from(s).includes(md2));
        assert.notOk(Array.from(s).includes(old_md));
    });
}
