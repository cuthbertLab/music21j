import * as QUnit from 'qunit';
import music21 from '../../src/music21';

const { test } = QUnit;

export default function tests() {
    test('music21.duration.Duration 0', assert => {
        // @ts-ignore
        const d = new music21.duration.Duration(0.0);
        assert.equal(d.type, 'zero', 'got zero');
        assert.equal(d.dots, 0, 'got no dots');
        assert.equal(d.quarterLength, 0.0, 'got 0.0');
    });

    test('music21.duration.Duration', assert => {
        // @ts-ignore
        const d = new music21.duration.Duration(1.0);
        assert.equal(d.type, 'quarter', 'got quarter note from 1.0');
        assert.equal(d.dots, 0, 'got no dots');
        assert.equal(d.quarterLength, 1.0, 'got 1.0 from 1.0');
        assert.equal(d.vexflowDuration, 'q', 'vexflow q');
        d.type = 'half';
        assert.equal(d.type, 'half', 'got half note from half');
        assert.equal(d.dots, 0, 'got no dots');
        assert.equal(d.quarterLength, 2.0, 'got 2.0 from half');
        assert.equal(d.vexflowDuration, 'h', 'vexflow h');
        d.quarterLength = 6.0;
        assert.equal(d.type, 'whole');
        assert.equal(d.dots, 1, 'got one dot from 6.0');
        assert.equal(d.quarterLength, 6.0, 'got 6.0');
        assert.equal(d.vexflowDuration, 'wd', 'vexflow duration wd');

        d.quarterLength = 7.75;
        assert.equal(d.type, 'whole');
        assert.equal(d.dots, 4, 'got four dots from 7.75');
    });

    test('music21.duration.Tuplet', assert => {
        // @ts-ignore
        const d = new music21.duration.Duration(0.5);
        const t = new music21.duration.Tuplet(5, 4);
        assert.equal(t.tupletMultiplier(), 0.8, 'tuplet multiplier should be 0.8');
        d.appendTuplet(t);
        assert.equal(t.frozen, true, 'tuplet is frozen');
        // @ts-ignore
        assert.equal(d._tuplets[0], t, 'tuplet appended');
        assert.equal(d.quarterLength, 0.4, 'quarterLength Updated');

        // @ts-ignore
        const d2 = new music21.duration.Duration(1 / 3);
        assert.equal(d2.type, 'eighth', 'got eighth note from 1/3');
        assert.equal(d2.dots, 0, 'got no dots');
        assert.equal(d2.quarterLength, 1 / 3, 'got 1/3 from 1/3');
        const t2 = d2.tuplets[0];
        assert.equal(t2.numberNotesActual, 3, '3/2 tuplet');
        assert.equal(t2.numberNotesNormal, 2, '3/2 tuplet');
        assert.equal(t2.durationActual.quarterLength, 0.5);
        assert.equal(t2.tupletMultiplier(), 2 / 3, '2/3 tuplet multiplier');
        assert.equal(t2.totalTupletLength(), 1.0, 'total tuplet == 1.0');

        const s = new music21.stream.Stream();
        s.timeSignature = new music21.meter.TimeSignature('2/2');
        for (let i = 0; i < 6; i++) {
            const n1 = new music21.note.Note('C4');
            n1.duration.quarterLength = 2 / 3;
            if (i % 3 === 0) {
                n1.articulations.push(new music21.articulations.Accent());
            }
            s.append(n1);
        }
        s.appendNewDOM();
        assert.ok(true, 'quarter note triplets displayed');

        const m6 = new music21.stream.Measure();
        m6.renderOptions.staffLines = 1;
        m6.timeSignature = new music21.meter.TimeSignature('2/4');
        const n6 = new music21.note.Note('B4');
        n6.duration.quarterLength = 2 / 3;
        n6.duration.tuplets[0].durationNormal.type = 'eighth';
        n6.duration.tuplets[0].tupletNormalShow = 'ratio';

        const n7 = new music21.note.Note('B4');
        n7.duration.quarterLength = 1 / 3;
        n7.duration.tuplets[0].tupletNormalShow = 'ratio';

        m6.append(n6);
        m6.append(n7);
        m6.append(n7.clone());
        const n6clone = n6.clone();
        m6.append(n6clone);
        m6.appendNewDOM();
        assert.ok(true, 'tuplets beginning with different type than original');
        assert.equal(
            n6.duration.tuplets[0] !== n6clone.duration.tuplets[0],
            true,
            'tuplet should not be the same object after clone'
        );
    });
    test('music21.duration.Tuplet multiple parts', assert => {
        const s2 = new music21.stream.Measure();
        s2.timeSignature = new music21.meter.TimeSignature('3/2');
        const na1 = new music21.note.Note('F4');
        const na2 = new music21.note.Note('E4');
        s2.append(na1);
        s2.append(na2);
        for (let i = 0; i < 10; i++) {
            const n1 = new music21.note.Note('F4');
            n1.pitch.diatonicNoteNum += i;
            n1.duration.quarterLength = 2 / 5;
            n1.duration.tuplets[0].tupletNormalShow = 'ratio';
            if (i % 5 === 0) {
                n1.articulations.push(new music21.articulations.Accent());
            }
            s2.append(n1);
        }
        const s3 = new music21.stream.Measure();
        s3.timeSignature = new music21.meter.TimeSignature('3/2');
        s3.append(new music21.note.Note('B5', 6.0));
        const p = new music21.stream.Part();
        p.append(s2);
        p.append(s3);

        const m4 = new music21.stream.Measure();
        m4.timeSignature = new music21.meter.TimeSignature('3/2');
        m4.append(new music21.note.Note('B3', 6.0));
        const m5 = new music21.stream.Measure();
        m5.timeSignature = new music21.meter.TimeSignature('3/2');
        m5.append(new music21.note.Note('B3', 6.0));
        const p2 = new music21.stream.Part();
        p2.append(m4);
        p2.append(m5);

        const sc = new music21.stream.Score();
        sc.insert(0, p);
        sc.insert(0, p2);
        sc.appendNewDOM();
        assert.ok(true, '5:4 tuplets in 3/2 with multiple parts');
    });
}
