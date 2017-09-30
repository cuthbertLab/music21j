import * as QUnit from 'qunit';
import music21 from '../../src/loadModules';

export default function tests() {
    QUnit.test('music21.prebase.ProtoM21Object classes', assert => {
        const n = new music21.note.Note();
        assert.deepEqual(n.classes, [
            'Note',
            'NotRest',
            'GeneralNote',
            'Music21Object',
            'ProtoM21Object',
            'object',
        ]);
        assert.ok(n.isClassOrSubclass('Note'));
        assert.ok(n.isClassOrSubclass('GeneralNote'));
        assert.notOk(n.isClassOrSubclass('Rest'));
    });
    QUnit.test('clone', assert => {
        const n = new music21.note.Note('D4');
        const n2 = n.clone();
        n.pitch.octave = 5;
        assert.equal(n2.pitch.octave, 4);
    });
}
