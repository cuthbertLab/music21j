import * as QUnit from 'qunit';
import * as music21 from '../../src/music21_modules';

const { test } = QUnit;

export default function tests() {
    test('music21.editorial.Editorial', assert => {
        const n = new music21.note.Note();
        assert.notOk(n.hasEditorialInformation, 'newly created note has no editorialInformation');
        assert.ok(n.editorial instanceof music21.editorial.Editorial);
        assert.ok(n.hasEditorialInformation);
        const ed = n.editorial as any;
        ed.hello = true;
        assert.ok(ed.hello);
    });
}
