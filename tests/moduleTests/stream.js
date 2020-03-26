import * as QUnit from 'qunit';
import * as music21 from '../../src/music21_modules';

const { test } = QUnit;

function get_stream_and_note() {
    const s = new music21.stream.Stream();
    s.append(new music21.note.Note('C#5'));
    s.append(new music21.note.Note('D#5'));
    const n = new music21.note.Note('F5');
    n.duration.type = 'half';
    return [s, n];
}


export default function tests() {
    test('music21.stream.Stream', assert => {
        const [s, n] = get_stream_and_note();
        s.append(n);
        assert.equal(s.length, 3, 'Simple stream length = 3');

        // test iteration.
        for (const n of s) {
            const oct = n.pitch.octave;
            assert.equal(oct, 5, 'all notes are octave 5.');
        }
    });
    test('music21.stream.Stream clone', assert => {
        const clickCallback = e => console.log('hi');

        const [s, n] = get_stream_and_note();
        s.renderOptions.left = 20;
        s.renderOptions.scaleFactor.x = 2.0;
        s.renderOptions.events.click = clickCallback;

        s.insert(5.0, n);
        const t = s.clone(true);
        assert.ok(t instanceof music21.stream.Stream);
        assert.equal(t.length, 3);
        assert.equal(t.length, s.length, 't.length should equal s.length');
        const t0 = t.get(0);
        assert.equal(t0.pitch.name, 'C#');
        for (let i = 0; i < t.length; i++) {
            const tEl = t.get(i);
            const sEl = s.get(i);
            assert.equal(tEl.offset, sEl.offset);
            assert.equal(tEl.pitch.name, sEl.pitch.name);
        }
        assert.notStrictEqual(
            s.renderOptions,
            t.renderOptions,
            'after cloning renderOptions should not be shared'
        );
        assert.equal(t.renderOptions.left, 20);
        s.renderOptions.left = 10;
        s.renderOptions.scaleFactor.x = 1.5;
        s.renderOptions.events.click = 'play';
        assert.equal(t.renderOptions.left, 20);
        assert.notStrictEqual(
            s.renderOptions.scaleFactor,
            t.renderOptions.scaleFactor,
            'after cloning renderOptions.scaleFactor should not be shared'
        );
        assert.equal(t.renderOptions.scaleFactor.x, 2.0);
        assert.equal(t.renderOptions.events.click, clickCallback);
    });


    test('music21.stream.Stream iterate and forEach', assert => {
        const s = new music21.stream.Stream();
        s.append(new music21.note.Note('C#5'));
        s.append(new music21.note.Note('D#5'));
        const names = [];
        const indexes = [];
        const lengths = [];
        s.forEach((el, i, stream) => {
            names.push(el.name);
            indexes.push(i);
            lengths.push(stream.length);
        });
        assert.deepEqual(names, ['C#', 'D#']);
        assert.deepEqual(indexes, [0, 1]);
        assert.deepEqual(lengths, [2, 2]);
    });

    test('music21.stream.Stream remove, index, replace, set', assert => {
        const s = new music21.stream.Stream();
        const cs = new music21.note.Note('C#5');
        s.append(cs);
        const d = new music21.note.Note('D#5');
        s.append(d);
        const n = new music21.note.Note('F5');
        s.append(n);
        const lastN = new music21.note.Note('G5');
        s.append(lastN);

        assert.equal(s.index(d), 1, 'index of d is 1');
        assert.equal(s.index(n), 2, 'index of n is 2');
        assert.equal(s.length, 4, 'stream length is 4');

        s.remove(n);
        assert.equal(s.index(d), 1, 'index of d is still 1');
        assert.equal(s.length, 3, 'stream length is 3');
        assert.throws(() => { s.index(n); }, /cannot find/, 'n is no longer in s');

        assert.equal(d.offset, 1.0, 'd offset is 1.0');
        const r = new music21.note.Rest();
        assert.equal(r.offset, 0.0, 'naiveOffset should be 0.0');

        s.replace(d, r);
        assert.equal(d.offset, 0.0, 'offset of d should now be 0.0');
        assert.equal(r.offset, 1.0, 'offset of r should be d-old offset of 1');
        assert.equal(s.index(r), 1, 'index of r in s should be 1');
        assert.throws(() => { s.index(d); }, /cannot find/, 'd is no longer in s');

        const r2 = new music21.note.Rest();
        r2.offset = 10; // ignored
        s.set(0, r2);
        assert.deepEqual(s.get(0), r2);
        assert.equal(s.get(0).offset, 0.0, 'offset is now position in stream.');
        assert.throws(() => { cs.getOffsetBySite(s); }, /not stored/, 'cs is no longer in s');
    });

    test('music21.stream.Stream.elements from stream', assert => {
        const s = new music21.stream.Stream();
        s.append(new music21.note.Note('C#5'));
        const d = new music21.note.Note('D#5');
        s.insert(10, d);
        const t = new music21.stream.Stream();
        t.elements = s;
        assert.deepEqual(t.get(1), d, 't[1] is d');
        assert.equal(t.get(1).offset, 10, 'd offset retained');
    });

    test('music21.stream.Stream.duration', assert => {
        const s = new music21.stream.Stream();
        assert.equal(s.duration.quarterLength, 0, 'EmptyString QuarterLength');

        const n0 = new music21.note.Note('C#5');
        s.append(n0);
        assert.equal(n0.duration.quarterLength, 1.0, 'sanity that note duration works');
        assert.equal(s.duration.quarterLength, 1.0, '1 quarter QuarterLength');

        const n = new music21.note.Note('F5');
        n.duration.type = 'half';
        s.append(n);
        assert.equal(s.highestTime, 3.0);
        assert.equal(s.duration.quarterLength, 3.0, '3 quarter QuarterLength');

        s.duration = new music21.duration.Duration(3.0);
        s.append(new music21.note.Note('D#5'));
        assert.equal(
            s.duration.quarterLength,
            3.0,
            'overridden duration -- remains'
        );

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
        assert.equal(
            sc.duration.quarterLength,
            4.0,
            'duration of streams with nested parts'
        );
        assert.equal(
            sc.flat.duration.quarterLength,
            4.0,
            'duration of flat stream with overlapping notes'
        );
        n21.duration.type = 'half';
        assert.equal(
            sc.duration.quarterLength,
            3.5,
            'new music21.duration with nested parts'
        );
        assert.equal(
            sc.flat.duration.quarterLength,
            3.5,
            'new music21.duration of flat stream'
        );
    });

    test('music21.stream.Stream.append', assert => {
        const s = new music21.stream.Stream();
        s.append(new music21.note.Note('C4'));
        assert.equal(s.length, 1);

        const s2 = new music21.stream.Stream();
        const n1 = new music21.note.Note('C#4');
        const n2 = new music21.note.Note('D4');
        const n3 = new music21.note.Note('D#4');
        n3.duration.type = 'half';
        const l = [n1, n2, n3];
        s2.append(l);
        assert.equal(s2.length, 3);
        assert.equal(s2.duration.quarterLength, 4.0);
    });

    test('music21.stream.Stream.insert and offsets', assert => {
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
        assert.notOk(p.isFlat, 'part has substreams');
        const pf = p.flat;
        assert.equal(pf.get(0).offset, 0.0);
        assert.equal(pf.get(1).offset, 4.0);
        assert.ok(pf.isFlat, 'flat has no substremes');

        const pf2 = p.flat; // repeated calls do not change
        assert.ok(pf2.isFlat, 'flat has no substremes');
        assert.equal(
            pf2.get(0).offset,
            0.0,
            'repeated calls do not change offset 1'
        );
        assert.equal(
            pf2.get(1).offset,
            4.0,
            'repeated calls do not change offset 2'
        );
        const pf3 = pf2.flat;
        assert.equal(
            pf3.get(1).offset,
            4.0,
            '.flat.flat does not change offset'
        );

        const semiFlatP = p.semiFlat;
        assert.equal(
            semiFlatP.length,
            pf.length + 2,
            'SemiFlat is same as flat + 2'
        );
    });

    test('music21.stream.Stream insertAndShift', assert => {
        const s = new music21.stream.Stream();
        s.insert(0, new music21.note.Note('C4'));
        s.insert(1, new music21.note.Note('E4'));
        s.insert(2, new music21.note.Note('F4'));
        s.insertAndShift(1, new music21.note.Note('D4'));
        const outListNames = [];
        const outListOffsets = [];
        for (const n of s) {
            outListNames.push(n.name);
            outListOffsets.push(n.offset);
        }
        assert.equal(outListNames[0], 'C');
        assert.equal(outListOffsets[0], 0.0);
        assert.equal(outListNames[1], 'D');
        assert.equal(outListOffsets[1], 1.0);
        assert.equal(outListNames[2], 'E');
        assert.equal(outListOffsets[2], 2.0);
        assert.equal(outListNames[3], 'F');
        assert.equal(outListOffsets[3], 3.0);
    });

    test('music21.stream.Stream.DOM', assert => {
        const s = new music21.stream.Stream();
        s.append(new music21.note.Note('C#5'));
        s.append(new music21.note.Note('D#5'));
        const n = new music21.note.Note('F5');
        n.duration.type = 'half';
        s.append(n);
        const c = s.createNewDOM(100, 50);
        assert.equal(c.attr('width'), 100, 'stored width matches');
        assert.equal(c.attr('height'), 50, 'stored height matches');
    });

    test('music21.stream.Stream.getElementsByClass', assert => {
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
    test('music21.stream.offsetMap', assert => {
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
        assert.equal(
            omn.voiceIndex,
            undefined,
            'omn voiceIndex should be undefined'
        );
        assert.equal(omo.element, o, 'omo element should be o');
        assert.equal(omo.offset, 0.5, 'omo offset should be 0.5');
        assert.equal(omo.endTime, 1.5, 'omo endTime should be 1.5');
    });
    test('music21.stream.Stream appendNewDOM ', assert => {
        const n = new music21.note.Note('G3');
        const s = new music21.stream.Measure();
        s.append(n);
        s.appendNewDOM(document.body);
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
        const div1 = s1.editableAccidentalDOM();
        window.$(document.body).append(div1);
    });
    test('music21.stream.Stream makeAccidentals ', assert => {
        const n = new music21.note.Note('G#3');
        const n2 = new music21.note.Note('G#3');
        const n3 = new music21.note.Note('C#4');
        const c = new music21.chord.Chord(['C3', 'E-3', 'G3', 'G4']);
        const ks = new music21.key.KeySignature(2);
        const s = new music21.stream.Measure();
        s.keySignature = ks;
        s.append([n, n2, n3, c]);
        s.makeAccidentals();
        assert.ok(n.pitch.accidental.displayStatus);
        assert.notOk(n2.pitch.accidental.displayStatus);
        assert.notOk(n3.pitch.accidental.displayStatus);
        assert.ok(c._notes[0].pitch.accidental);
        assert.ok(c._notes[0].pitch.accidental.displayStatus);
        assert.ok(c._notes[1].pitch.accidental.displayStatus);
        assert.ok(c._notes[2].pitch.accidental.displayStatus);
        assert.notOk(c._notes[3].pitch.accidental); // perhaps should exist?
    });

    test('music21.stream.Stream.flat', assert => {
        const p1 = music21.tinyNotation.TinyNotation('4/4 c2 d2 e2 f2 g1');
        const p2 = music21.tinyNotation.TinyNotation('4/4 A1    C#1   E#1');
        const s = new music21.stream.Score();
        s.insert(0, p1);
        s.insert(0, p2);
        const sf = s.flat.notes;
        const sf_names = Array.from(sf).map(n => n.name);
        assert.deepEqual(sf_names, ['C', 'A', 'D', 'E', 'C#', 'F', 'G', 'E#']);
        const sf_offsets = Array.from(sf).map(n => n.offset);
        assert.deepEqual(sf_offsets, [0, 0, 2, 4, 4, 6, 8, 8]);
    });

    test('music21.stream.Stream isGapless', assert => {
        const testOne = new music21.stream.Stream();
        const n1 = new music21.note.Note('C');
        const n2 = new music21.note.Note('D');
        testOne.insert(0, n1);
        testOne.insert(0, n2);
        assert.equal(testOne.isGapless, true);
        assert.equal(testOne.findGaps(), null);

        const n3 = new music21.note.Note('E');
        testOne.insert(10.0, n3);
        assert.equal(testOne.isGapless, false);
        let gapStream = testOne.findGaps();
        assert.ok(gapStream instanceof music21.stream.Stream);
        assert.equal(gapStream.length, 1);
        assert.equal(gapStream.get(0).duration.quarterLength, 9);

        const n4 = new music21.note.Note('E');
        testOne.insert(4.0, n4);
        gapStream = testOne.findGaps();
        assert.equal(gapStream.length, 2);
        assert.equal(gapStream.get(0).duration.quarterLength, 3);
        assert.equal(gapStream.get(1).duration.quarterLength, 5);
    });
}
