import * as QUnit from 'qunit';
import music21 from '../../src/music21';

const { test } = QUnit;

export default function tests() {
    test('music21.prebase.ProtoM21Object.classes', assert => {
        const n = new music21.note.Note();
        assert.deepEqual(n.classes, [
            'Note',
            'NotRest',
            'GeneralNote',
            'Music21Object',
            'ProtoM21Object',
            'object',
        ]);
    });
    test('music21.prebase.ProtoM21Object.isClassOrSubclass', assert => {
        const n = new music21.note.Note();
        assert.ok(n.isClassOrSubclass('Note'));
        assert.ok(n.isClassOrSubclass('GeneralNote'));
        assert.ok(n.isClassOrSubclass('music21.note.Note'));
        assert.ok(n.isClassOrSubclass(music21.note.Note));
        assert.ok(n.isClassOrSubclass(['Rest', music21.note.Note]));
        assert.notOk(n.isClassOrSubclass('Rest'));
    });
    test('music21.prebase.ProtoM21Object.classSet', assert => {
        const n = new music21.note.Note();
        assert.ok(n.classSet.has('Note'));
        assert.ok(n.classSet.has('GeneralNote'));
        assert.ok(n.classSet.has('music21.note.GeneralNote'));
        assert.ok(n.classSet.has(music21.note.GeneralNote));
        assert.notOk(n.classSet.has('Rest'));
    });

    test('clone', assert => {
        const n = new music21.note.Note('D4');
        const n2 = n.clone();
        n.pitch.octave = 5;
        assert.equal(n2.pitch.octave, 4);
        const n3 = n.clone(false);
        n.pitch.octave = 6;
        assert.equal(n3.pitch.octave, 6);
    });
}
