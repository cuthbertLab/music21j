import * as QUnit from 'qunit';
import music21 from '../../src/loadModules';

export default function tests() {
    QUnit.test('music21.stream.Stream', (assert) => {
        const s = new music21.stream.Stream();
        s.append(new music21.note.Note('C#5'));
        s.append(new music21.note.Note('D#5'));
        const n = new music21.note.Note('F5');
        n.duration.type = 'half';
        s.append(n);
        assert.equal(s.length, 3, 'Simple stream length');
    });

    QUnit.test('music21.stream.Stream.duration', (assert) => {
        const s = new music21.stream.Stream();
        assert.equal(s.duration.quarterLength, 0, 'EmptyString QuarterLength');

        s.append(new music21.note.Note('C#5'));
        assert.equal(s.duration.quarterLength, 1.0, '1 quarter QuarterLength');

        const n =  new music21.note.Note('F5');
        n.duration.type = 'half';
        s.append(n);
        assert.equal(s.highestTime, 3.0);
        assert.equal(s.duration.quarterLength, 3.0, '3 quarter QuarterLength');

        s.duration = new music21.duration.Duration(3.0);
        s.append(new music21.note.Note('D#5'));
        assert.equal(s.duration.quarterLength, 3.0, 'overridden duration -- remains');

        const sc = new music21.stream.Score();
        const p1 = new music21.stream.Part();
        const p2 = new music21.stream.Part();
        const m1 = new music21.stream.Measure();
        const m2 = new music21.stream.Measure();
        const n11 = new music21.note.Note();
        const n12 = new music21.note.Note();
        n12.duration.type = 'half';
        const n13 = new music21.note.Note();
        n13.duration.type = 'eighth'; // incomplete measure
        m1.append(n11);
        m1.append(n12);
        m1.append(n13);
        const n21 = new music21.note.Note();
        n21.duration.type = 'whole';
        m2.append(n21);
        p1.append(m1);
        p2.append(m2);
        sc.insert(0, p1);
        sc.insert(0, p2);
        assert.equal(sc.duration.quarterLength, 4.0, 'duration of streams with nested parts');
        assert.equal(sc.flat.duration.quarterLength, 4.0, 'duration of flat stream with overlapping notes');
        n21.duration.type = 'half';
        assert.equal(sc.duration.quarterLength, 3.5, 'new music21.duration with nested parts');
        assert.equal(sc.flat.duration.quarterLength, 3.5, 'new music21.duration of flat stream');
    });


    QUnit.test('music21.stream.Stream.insert and offsets', (assert) => {
        const s = new music21.stream.Stream();
        s.append(new music21.note.Note('C#5'));
        const n3 = new music21.note.Note('E5');
        s.insert(2.0, n3);
        let n2 = new music21.note.Note('D#5');
        s.insert(1.0, n2);
        assert.equal(s.get(0).name, 'C#');
        assert.equal(s.get(1).name, 'D#');
        assert.equal(s.get(2).name, 'E');
        assert.equal(s.get(0).offset, 0.0);
        assert.equal(s.get(1).offset, 1.0);
        assert.equal(s.get(2).offset, 2.0);
        const p = new music21.stream.Part();
        const m1 = new music21.stream.Measure();
        const n1 = new music21.note.Note('C#');
        n1.duration.type = 'whole';
        m1.append(n1);
        const m2 = new music21.stream.Measure();
        n2 = new music21.note.Note('D#');
        n2.duration.type = 'whole';
        m2.append(n2);
        p.append(m1);
        p.append(m2);
        assert.equal(p.get(0).get(0).offset, 0.0);
        const pf = p.flat;
        assert.equal(pf.get(1).offset, 4.0);
        const pf2 = p.flat; // repeated calls do not change
        assert.equal(pf2.get(1).offset, 4.0, 'repeated calls do not change offset');
        const pf3 = pf2.flat;
        assert.equal(pf3.get(1).offset, 4.0, '.flat.flat does not change offset');
    });

    QUnit.test('music21.stream.Stream.canvas', (assert) => {
        const s = new music21.stream.Stream();
        s.append(new music21.note.Note('C#5'));
        s.append(new music21.note.Note('D#5'));
        const n = new music21.note.Note('F5');
        n.duration.type = 'half';
        s.append(n);
        const c = s.createNewCanvas(100, 50);
        assert.equal(c.attr('width'), 100, 'stored width matches');
        assert.equal(c.attr('height'), 50, 'stored height matches');
    });

    QUnit.test('music21.stream.Stream.getElementsByClass', (assert) => {
        const s = new music21.stream.Stream();
        const n1 = new music21.note.Note('C#5');
        const n2 = new music21.note.Note('D#5');
        const r = new music21.note.Rest();
        const tc = new music21.clef.TrebleClef();
        s.append(tc);
        s.append(n1);
        s.append(r);
        s.append(n2);
        let c = s.getElementsByClass('Note');
        assert.equal(c.length, 2, 'got two notes');
        assert.equal(c.get(0), n1, 'n1 first');
        assert.equal(c.get(1), n2, 'n2 second');
        c = s.getElementsByClass('Clef');
        assert.equal(c.length, 1, 'got clef from subclass');
        c = s.getElementsByClass(['Note', 'TrebleClef']);
        assert.equal(c.length, 3, 'got multiple classes');
        c = s.getElementsByClass('GeneralNote');
        assert.equal(c.length, 3, 'got multiple subclasses');
    });
    QUnit.test('music21.stream.offsetMap', (assert) => {
        const n = new music21.note.Note('G3');
        const o = new music21.note.Note('A3');
        const s = new music21.stream.Measure();
        s.insert(0, n);
        s.insert(0.5, o);
        const om = s.offsetMap();
        assert.equal(om.length, 2, 'offsetMap should have length 2');
        const omn = om[0];
        const omo = om[1];
        assert.equal(omn.element, n, 'omn element should be n');
        assert.equal(omn.offset, 0.0, 'omn offset should be 0');
        assert.equal(omn.endTime, 1.0, 'omn endTime should be 1.0');
        assert.equal(omn.voiceIndex, undefined, 'omn voiceIndex should be undefined');
        assert.equal(omo.element, o, 'omo element should be o');
        assert.equal(omo.offset, 0.5, 'omo offset should be 0.5');
        assert.equal(omo.endTime, 1.5, 'omo endTime should be 1.5');
    });
    QUnit.test('music21.stream.Stream appendNewCanvas ', (assert) => {
        const n = new music21.note.Note('G3');
        const s = new music21.stream.Measure();
        s.append(n);
        s.appendNewCanvas(document.body);
        assert.equal(s.length, 1, 'ensure that should have one note');
        const n1 = new music21.note.Note('G3');
        const s1 = new music21.stream.Measure();
        s1.append(n1);
        const n2 = new music21.note.Note('G3');
        s1.append(n2);
        const n3 = new music21.note.Note('G3');
        s1.append(n3);
        const n4 = new music21.note.Note('G3');
        s1.append(n4);
        const sne1 = new music21.streamInteraction.SimpleNoteEditor(s1);
        const div1 = sne1.editableAccidentalCanvas();
        $(document.body).append(div1);

    });
};
