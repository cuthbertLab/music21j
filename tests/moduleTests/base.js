import * as QUnit from 'qunit';
import * as music21 from '../../src/music21_modules';

const { test } = QUnit;


export default function tests() {
    test('music21.base.Music21Object', assert => {
        const m21o = new music21.base.Music21Object();
        assert.equal(m21o.classSortOrder, 20);
        assert.ok(m21o.duration instanceof music21.duration.Duration);
        assert.deepEqual(m21o.classes, [
            'Music21Object',
            'ProtoM21Object',
            'object',
        ]);
        assert.ok(m21o.sites instanceof music21.sites.Sites);
        assert.ok(m21o.isMusic21Object);
        assert.notOk(m21o.isStream);
        assert.equal(m21o.priority, 0, 'priority is 0');
        assert.equal(m21o.quarterLength, 0.0, 'default duration is 0.0');
        m21o.quarterLength = 2.0;
        assert.equal(m21o.quarterLength, 2.0);

        const st = new music21.stream.Measure();
        st.insert(3.0, m21o);
        assert.equal(m21o.offset, 3.0);
        assert.equal(m21o.getOffsetBySite(st), 3.0);

        const st2 = new music21.stream.Measure();
        st2.insert(5.0, m21o);
        assert.equal(m21o.offset, 5.0, 'after insert at 5, offset should be 5.');

        assert.strictEqual(m21o.activeSite, st2);
        assert.equal(m21o.getOffsetBySite(st), 3.0, 'offset of site st should be 3');

        assert.equal(m21o.getOffsetBySite(st2), 5.0);
        m21o.setOffsetBySite(st2, 5.5);
        assert.equal(m21o.getOffsetBySite(st2), 5.5);
    });

    test('music21.base.Music21Object Contexts', assert => {
        const m21o = new music21.base.Music21Object();
        const m = new music21.stream.Measure();
        const p = new music21.stream.Part();
        const sc = new music21.stream.Score();
        m.insert(3.0, m21o);
        p.insert(1.0, m);
        sc.insert(0.0, p);
        assert.strictEqual(
            m21o.getContextByClass('Measure'),
            m,
            'get context by class Measure'
        );
        assert.strictEqual(
            m21o.getContextByClass('Part'),
            p,
            'get context by class Part'
        );
        assert.strictEqual(
            m21o.getContextByClass('Score'),
            sc,
            'get context by class Score'
        );

        const contextS = Array.from(m21o.contextSites());
        assert.equal(contextS.length, 3);
        assert.deepEqual(
            contextS[0],
            [m, 3, 'elementsFirst'],
            'first site is m'
        );
        assert.deepEqual(contextS[1], [p, 4, 'flatten'], 'second site is p');
        assert.deepEqual(
            contextS[2],
            [sc, 4.0, 'elementsOnly'],
            'third site is sc'
        );
    });
    test('music21.base.Music21Object.beat', assert => {

        const noteC = new music21.note.Note('C4', 4); 
        const noteD = new music21.note.Note('D4', 2);
        const noteE = new music21.note.Note('E4', 2);
        const noteF = new music21.note.Note('F4', 2);
        const tsThreeFour = new music21.meter.TimeSignature('3/4');
        const m = new music21.stream.Measure();
        const m2 = new music21.stream.Measure();
        const p = new music21.stream.Part();
        const sc = new music21.stream.Score();
        p.insert(1.0, m);
        p.insert(3.0, m2);
        p.insert(0, tsThreeFour);
        m.append(noteC);
        m2.append(noteD);
        //stream1.append(m);
        m2.append(noteE);
        m2.append(noteF);
        sc.insert(0.0, p);
        sc.appendNewDOM(document.body);
        //console.log('BLANK');
        //console.log(sc);
        //console.log('score', sc.getBeat(sc));
        //console.log('note', noteC.getBeat(noteC));
        //console.log('part', p.getBeat(p));
        assert.deepEqual(sc.getBeat(sc), [4, 2, 4, 6]);
        assert.deepEqual(p.getBeat(p), [4, 2, 4, 6]);
        assert.deepEqual(noteC.getBeat(noteC), [4]);

    });
    
}
