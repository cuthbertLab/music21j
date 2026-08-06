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

    test('music21.tinyNotation.TinyNotation explicit naturals show', assert => {
        // an explicit `n` shows even on the first note of a part: AI-assisted
        const statuses = (tn: string) => {
            const s = music21.tinyNotation.TinyNotation(tn)
                .makeNotation({overrideStatus: true});
            return Array.from(s.recurse().notes).map(
                (n: music21.note.Note) => n.pitch.accidental?.displayStatus
            );
        };

        assert.deepEqual(statuses('AAn2 Fn'), [true, true]);
        assert.deepEqual(statuses('4/4 AAn2 Fn'), [true, true]);
        assert.deepEqual(
            statuses('AAn2 Fn partBreak Bn Bn'),
            [true, true, true, true],
            'naturals show at the start of every part'
        );
        assert.deepEqual(statuses('AA2 F'), [undefined, undefined], 'no unasked-for naturals');
    });

    test('music21.tinyNotation.TinyNotation explicit naturals reach MusicXML', assert => {
        const p = music21.tinyNotation.TinyNotation('AAn2 Fn');
        const xml = new music21.musicxml.m21ToXml.GeneralObjectExporter(p).parse();
        assert.equal(xml.match(/<accidental>natural<\/accidental>/g).length, 2);
    });
}
