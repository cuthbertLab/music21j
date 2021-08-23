import $ from 'jquery';
import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;


function get_stream_and_note(): [music21.stream.Stream, music21.note.Note] {
    const s = new music21.stream.Stream();
    s.append(new music21.note.Note('C#5'));
    s.append(new music21.note.Note('D#5'));
    const n = new music21.note.Note('F5');
    n.duration.type = 'half';
    return [s, n];
}


const alla_breve_test = "2/2 c8 d e f   trip{a b c' a b c'}  f' e' d' G  a b c' d'";


export default function tests() {
    test('music21.stream.Stream', assert => {
        const [s, n] = get_stream_and_note();
        s.append(n);
        assert.equal(s.length, 3, 'Simple stream length = 3');

        // test iteration.
        for (const n of s) {
            const oct = (n as music21.note.Note).pitch.octave;
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
        const t0 = t.get(0) as music21.note.Note;
        assert.equal(t0.pitch.name, 'C#');
        for (let i = 0; i < t.length; i++) {
            const tEl = t.get(i) as music21.note.Note;
            const sEl = s.get(i) as music21.note.Note;
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
            names.push((el as music21.note.Note).name);
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

        const p1 = new music21.stream.Part();
        const m = new music21.stream.Measure();
        const n = new music21.note.Note('C');
        m.append(n);
        p1.append(m);
        const p2 = new music21.stream.Part();
        p2.elements = p1;
        assert.equal(n.getOffsetInHierarchy(p2), 0, 'p2 is in the site hierarchy of n');
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

        // noinspection TypeScriptValidateJSTypes
        // @ts-ignore
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

    test('music21.stream.Stream.repeatAppend', assert => {
        const a = new music21.stream.Stream();
        const n = new music21.note.Note();
        a.repeatAppend(n, 10);
        assert.equal(a.notes.length, 10);
    });

    test('music21.stream.Stream.insert and offsets', assert => {
        const s = new music21.stream.Stream();
        s.append(new music21.note.Note('C#5'));
        const n3 = new music21.note.Note('E5');
        s.insert(2.0, n3);

        let n2 = new music21.note.Note('D#5');
        s.insert(1.0, n2);

        assert.equal((s.get(0) as music21.note.Note).name, 'C#');
        assert.equal((s.get(1) as music21.note.Note).name, 'D#');
        assert.equal((s.get(2) as music21.note.Note).name, 'E');
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

        assert.equal((p.get(0) as music21.stream.Stream).get(0).offset, 0.0);
        assert.notOk(p.isFlat, 'part has substreams');
        const pf = p.flat;
        assert.equal(pf.get(0).offset, 0.0);
        assert.equal(pf.get(1).offset, 4.0);
        assert.ok(pf.isFlat, 'flat has no substreams');

        const pf2 = p.flat; // repeated calls do not change
        assert.ok(pf2.isFlat, 'flat has no substreams');
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

    test('music21.stream.Stream numSystems', assert => {
        const p = new music21.stream.Part();
        for (let i = 0; i < 10; i++) {
            const m = new music21.stream.Measure();
            m.number = i + 1;
            p.append(m);
        }
        for (const m of (Array.from(p.getElementsByClass('Measure')) as music21.stream.Measure[])) {
            if ([1, 3, 6, 9].includes(m.number)) {
                m.renderOptions.startNewSystem = true;
            }
        }
        assert.equal(p.numSystems(), 4);
        // the first measure is assumed to start a new
        // system no matter what...
        const m0 = p.getElementsByClass('Measure').get(0) as music21.stream.Measure;
        m0.renderOptions.startNewSystem = false;
        assert.equal(p.numSystems(), 4);

        // even an empty_part has a system.
        const empty_part = new music21.stream.Part();
        assert.equal(empty_part.numSystems(), 1);

        // numSystems() for a Score is taken from top part.
        const sc = new music21.stream.Score();
        sc.insert(0, p);
        assert.equal(sc.numSystems(), 4);

        const sc_poor = new music21.stream.Score();
        assert.equal(sc_poor.numSystems(), 1);

        sc_poor.insert(0, empty_part);
        sc_poor.insert(0, p);
        assert.equal(sc_poor.numSystems(), 1);

        sc.insert(0, empty_part);
        assert.equal(sc.numSystems(), 4);
    });

    test('music21.stream.Stream maxSystemWidth', assert => {
        // has caused confusion in past...
        const s = new music21.stream.Stream();
        s.renderOptions.scaleFactor = {x: 1.0, y: 1.0};
        assert.equal(s.maxSystemWidth, 750);
        s.renderOptions.maxSystemWidth = 700;
        assert.equal(s.maxSystemWidth, 700);
        s.renderOptions.scaleFactor.x = 1/2;
        assert.equal(s.maxSystemWidth, 1400);

        const m = new music21.stream.Measure();
        const p = new music21.stream.Part();
        const sc = new music21.stream.Score();
        for (const obj of [m, p, sc]) {
            obj.renderOptions.scaleFactor = {x: 1.0, y: 1.0};
        }

        p.append(m);
        sc.append(p);
        assert.equal(m.maxSystemWidth, 750);
        sc.renderOptions.maxSystemWidth = 200;
        assert.equal(m.maxSystemWidth, 200);

        m.renderOptions.scaleFactor.x = 2;
        assert.equal(m.maxSystemWidth, 100);

        m.maxSystemWidth = 500;
        assert.equal(m.maxSystemWidth, 500);
        assert.equal(m.renderOptions.maxSystemWidth, 1000);
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
            outListNames.push((n as music21.note.Note).name);
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
        $(document.body).append(div1);
    });
    test('music21.stream.Stream makeAccidentals ', assert => {
        const n = new music21.note.Note('G#3');
        const n2 = new music21.note.Note('G#3');
        const n3 = new music21.note.Note('C#4');
        const c = new music21.chord.Chord(['C3', 'E-3', 'G3', 'G4', 'F#5']);
        const ks = new music21.key.KeySignature(2);
        const s = new music21.stream.Measure();
        s.keySignature = ks;
        s.append([n, n2, n3, c]);
        s.makeAccidentals({ inPlace: true });
        assert.ok(n.pitch.accidental.displayStatus);
        assert.notOk(
            n2.pitch.accidental.displayStatus,
            `n2.pitch.accidental.displayStatus should be false, not ${n2.pitch.accidental.displayStatus}`
        );
        assert.notOk(
            n3.pitch.accidental.displayStatus,
            `n3.pitch.accidental.displayStatus should be false, not ${n3.pitch.accidental.displayStatus}`
        );
        assert.ok(c.notes[0].pitch.accidental);
        assert.ok(c.notes[0].pitch.accidental.displayStatus);
        assert.ok(c.notes[1].pitch.accidental.displayStatus);
        assert.ok(c.notes[2].pitch.accidental.displayStatus);
        assert.notOk(c.notes[4].pitch.accidental.displayStatus);  // F# from key signature
    });

    test('music21.stream.Stream makeAccidentals multi-measure', assert => {
        const n1 = new music21.note.Note('F#4');
        const m1 = new music21.stream.Measure();
        m1.append(n1);
        const n2 = new music21.note.Note('F#4');
        const m2 = new music21.stream.Measure();
        m2.append(n2);
        const p = new music21.stream.Part();
        p.append(m1);
        p.append(m2);
        p.makeAccidentals({inPlace: true});
        assert.ok(n1.pitch.accidental.displayStatus);
        assert.ok(n2.pitch.accidental.displayStatus);
    });

    test('music21.stream.Stream makeBeams with stemDirection', assert => {
        const n1 = new music21.note.Note('C5', 0.5);
        n1.stemDirection = 'up';
        const n2 = new music21.note.Note('C5', 0.5);
        n2.stemDirection = 'up';
        const n3 = new music21.note.Note('D5');
        n3.stemDirection = 'up';
        const m = new music21.stream.Measure();
        m.renderOptions.useVexflowAutobeam = false;
        m.timeSignature = new music21.meter.TimeSignature('2/4');
        m.append(n1);
        m.append(n2);
        m.append(n3);
        m.makeBeams({inPlace: true});
        assert.ok(n1.beams.getByNumber(1) instanceof music21.beam.Beam, 'one!');
        assert.ok(n2.beams.getByNumber(1) instanceof music21.beam.Beam);
        assert.equal(n1.beams.getByNumber(1).type, 'start');
        assert.equal(n2.beams.getByNumber(1).type, 'stop');
        assert.equal(n1.stemDirection, 'up');
        assert.equal(n2.stemDirection, 'up');

        //
    });

    /**
     * Note that the output here differs slightly from music21 beams, to take
     * into account showing of partial beam measures.
     */
    test('music21.stream.Measure makeBeams with incomplete measure', assert => {
        const ts = new music21.meter.TimeSignature('3/4');
        const n1 = new music21.note.Note('C5', 1.5);
        const n2 = new music21.note.Note('C5', 0.5);
        const n3 = new music21.note.Note('C5', 0.5);
        const m = new music21.stream.Measure();
        m.renderOptions.useVexflowAutobeam = false;
        m.append([ts, n1, n2, n3]);
        m.makeBeams({inPlace: true});
        assert.equal(n1.beams.beamsList.length, 0);
        assert.equal(n2.beams.beamsList.length, 1);
        assert.equal(n3.beams.beamsList.length, 1);
        assert.equal(n2.beams.beamsList[0].type, 'start');
        assert.equal(n3.beams.beamsList[0].type, 'stop');

        // complete the measure
        const n4 = new music21.note.Note('C5', 0.5);
        m.append(n4);
        m.makeBeams({inPlace: true});
        assert.equal(n1.beams.beamsList.length, 0);
        assert.equal(n2.beams.beamsList.length, 0);
        assert.equal(n3.beams.beamsList.length, 1);
        assert.equal(n4.beams.beamsList.length, 1);
        assert.equal(n3.beams.beamsList[0].type, 'start');
        assert.equal(n4.beams.beamsList[0].type, 'stop');
    });

    test('music21.stream.Measure makeBeams with incomplete 6/8 measure', assert => {
        const ts = new music21.meter.TimeSignature('6/8');
        const n1 = new music21.note.Note('C4', 1.0);
        const n2 = new music21.note.Note('C4', 0.5);
        const n3 = new music21.note.Note('C4', 0.5);
        const m = new music21.stream.Measure();
        m.paddingRight = 1.0;
        m.renderOptions.useVexflowAutobeam = false;
        m.append([ts, n1, n2, n3]);
        m.makeBeams({inPlace: true});
        assert.equal(n1.beams.beamsList.length, 0);
        assert.equal(n2.beams.beamsList.length, 0);
        assert.equal(n3.beams.beamsList.length, 0);

        // complete the measure with a quarter
        const n4 = new music21.note.Note('C4', 1.0);
        m.append(n4);
        m.paddingRight = 0;
        m.makeBeams({inPlace: true});
        assert.equal(n1.beams.beamsList.length, 0);
        assert.equal(n2.beams.beamsList.length, 0);
        assert.equal(n3.beams.beamsList.length, 0);
        assert.equal(n4.beams.beamsList.length, 0);

        // make incomplete again by changing last quarter to eighth
        n4.quarterLength = 0.5;
        m.paddingRight = 0.5;
        m.makeBeams({inPlace: true});
        assert.equal(n1.beams.beamsList.length, 0);
        assert.equal(n2.beams.beamsList.length, 0);
        assert.equal(n3.beams.beamsList[0].type, 'start');
        assert.equal(n4.beams.beamsList[0].type, 'stop');
    });

    test('music21.stream.Stream makeAccidentals.KeySignature Context', assert => {
        let p1 = music21.tinyNotation.TinyNotation('4/4 c2 d2 f#2 f#2 g2 b-2 b1');
        p1.makeAccidentals({ inPlace: true });
        let p_list = p1.recurse().notes.map(n => n.pitch) as music21.pitch.Pitch[];
        assert.notOk(p_list[0].accidental, 'p_list[0].accidental should not exist');
        assert.notOk(p_list[1].accidental, 'p_list[1].accidental should not exist');
        assert.ok(p_list[2].accidental.displayStatus);
        assert.notOk(p_list[3].accidental.displayStatus, '2nd F# accidental should not display');  // same measure
        assert.notOk(p_list[4].accidental, 'G should not have accidental');
        assert.ok(p_list[5].accidental.displayStatus);  // B flat
        assert.ok(p_list[6].accidental.displayStatus);  // B natural after b-flat different measures

        p1 = music21.tinyNotation.TinyNotation('4/4 c2 d2 f#2 f#2 g2 b-2 b1');
        const m1 = p1.getElementsByClass('Measure').get(0) as music21.stream.Measure;
        const f_maj = new music21.key.Key('F');
        m1.insert(0, f_maj);
        p1.makeAccidentals({ inPlace: true });
        p_list = p1.recurse().notes.map(n => n.pitch) as music21.pitch.Pitch[];

        assert.notOk(p_list[5].accidental.displayStatus, 'first b-flat should not display');  // B flat
        assert.ok(p_list[6].accidental.displayStatus);  // B natural after b-flat different measures
    });

    test('music21.stream.Stream.flat', assert => {
        const p1 = music21.tinyNotation.TinyNotation('4/4 c2 d2 e2 f2 g1');
        const p2 = music21.tinyNotation.TinyNotation('4/4 A1    C#1   E#1');
        const s = new music21.stream.Score();
        s.insert(0, p1);
        s.insert(0, p2);
        const sf = s.flat.notes;
        const sf_names = (Array.from(sf) as music21.note.Note[]).map(n => n.name);
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

    test('music21.stream.Stream deepcopy renderOptions', assert => {
        // test that renderOptions copies everything but remains separate.
        const testOne = new music21.stream.Score();
        const one_options = testOne.renderOptions;
        one_options.staffLines = 4;
        one_options.scaleFactor.x = 1.5;
        one_options.staffConnectors = ['double'];
        one_options.events.click = 'fake_event';
        one_options.events.dblclick = e => {};
        const testTwo = testOne.clone(true);  // deepcopy
        const two_options = testTwo.renderOptions;
        assert.ok(two_options instanceof music21.renderOptions.RenderOptions);
        assert.notOk(two_options === one_options);
        assert.equal(two_options.staffLines, 4);
        assert.equal(two_options.scaleFactor.x, 1.5);
        assert.equal(two_options.staffConnectors[0], 'double');
        assert.equal(two_options.events.click, 'fake_event');
        assert.ok(two_options.events.dblclick === one_options.events.dblclick);

        // not shared objects
        one_options.staffLines = 2;
        assert.equal(two_options.staffLines, 4);
        one_options.scaleFactor.x = 1.0;
        assert.equal(two_options.scaleFactor.x, 1.5);
        one_options.staffConnectors.push('brace');
        assert.deepEqual(two_options.staffConnectors, ['double']);
        one_options.events.click = 'faker_event';

        const old_one_dblclick = one_options.events.dblclick;
        one_options.events.dblclick = e => 5;
        assert.equal(two_options.events.click, 'fake_event');
        assert.ok(two_options.events.dblclick === old_one_dblclick);
    });

    test('music21.stream.Score.findNoteForClick', assert => {
        const p1 = music21.tinyNotation.TinyNotation('4/4 c2 d2 e2 f2 g1');
        const p2 = music21.tinyNotation.TinyNotation('4/4 A1    C#1   E#1');
        const s = new music21.stream.Score();
        s.insert(0, p1);
        s.insert(0, p2);
        s.appendNewDOM();  // we need to generate a DOM even if we are not using it.
        const x = 100;
        let y = 20;
        let [clickedDNN, foundNote] = s.findNoteForClick(undefined, undefined, x, y);
        assert.equal(clickedDNN, 43);
        assert.strictEqual(foundNote, p1.flat.notes.get(0));
        y = 100;
        [clickedDNN, foundNote] = s.findNoteForClick(undefined, undefined, x, y);
        assert.equal(clickedDNN, 27);
        assert.equal(
            (foundNote as music21.note.Note).pitch.name,
            (p1.flat.notes.get(0) as music21.note.Note).pitch.name
        );

        // check that we eventually move to p2
        y = 150;
        [clickedDNN, foundNote] = s.findNoteForClick(undefined, undefined, x, y);
        assert.equal(clickedDNN, 29);
        assert.equal(
            (foundNote as music21.note.Note).pitch.name,
            (p2.flat.notes.get(0) as music21.note.Note).pitch.name
        );

        // check that we never move to another part even if very low
        y = 300;
        [clickedDNN, foundNote] = s.findNoteForClick(undefined, undefined, x, y);
        assert.equal(clickedDNN, -1);
        assert.equal(
            (foundNote as music21.note.Note).pitch.name,
            (p2.flat.notes.get(0) as music21.note.Note).pitch.name
        );
    });

    test('music21.stream.makeNotation setStemDirectionOneGroup', assert => {
        const p = music21.tinyNotation.TinyNotation(alla_breve_test);
        p.makeBeams({inPlace: true, setStemDirections: false});
        const [a, b, c, d] = Array.from(
            music21.stream.makeNotation.iterateBeamGroups(p)
        );

        const testDirections = (group, expected) => {
            assert.equal(group.length, expected.length, `${group.length} in group, not expected ${expected.length}`);
            for (let j = 0; j < group.length; j++) {
                assert.equal(group[j].stemDirection, expected[j]);
            }
        };

        testDirections(a, ['unspecified', 'unspecified', 'unspecified', 'unspecified']);
        const setStemDirectionOneGroup = music21.stream.makeNotation.setStemDirectionOneGroup;
        setStemDirectionOneGroup(a, { setNewStems: false });
        testDirections(a, ['unspecified', 'unspecified', 'unspecified', 'unspecified']);
        setStemDirectionOneGroup(a);
        testDirections(a, ['up', 'up', 'up', 'up']);
        for (const n of a) {
            n.stemDirection = 'down';
        }
        testDirections(a, ['down', 'down', 'down', 'down']);
        setStemDirectionOneGroup(a, { overrideConsistentStemDirections: true });
        testDirections(a, ['up', 'up', 'up', 'up']);

        setStemDirectionOneGroup(b);
        testDirections(b, ['down', 'down', 'down', 'down', 'down', 'down']);

        setStemDirectionOneGroup(c);
        testDirections(c, ['up', 'up', 'up', 'up']);

        d[0].stemDirection = 'down';
        d[1].stemDirection = 'noStem';
        d[2].stemDirection = 'double';
        d[3].stemDirection = 'up';
        setStemDirectionOneGroup(d);
        testDirections(d, ['down', 'noStem', 'double', 'down']);
    });

    test('music21.stream.makeNotation setStemDirectionForBeamGroups', assert => {
        const p = music21.tinyNotation.TinyNotation(alla_breve_test);
        p.makeBeams({inPlace: true, setStemDirections: false});
        const d = Array.from(music21.stream.makeNotation.iterateBeamGroups(p))[3];
        d[0].stemDirection = 'down';
        d[1].stemDirection = 'noStem';
        d[2].stemDirection = 'double';
        d[3].stemDirection = 'up';

        music21.stream.makeNotation.setStemDirectionForBeamGroups(p);
        const pn2 = Array.from(p.flat.notes) as music21.note.Note[];
        const stemDirections = pn2.map(n => n.stemDirection);
        assert.deepEqual(
            stemDirections,
            [
                'up', 'up', 'up', 'up',
                'down', 'down', 'down', 'down', 'down', 'down',
                'up', 'up', 'up', 'up',
                'down', 'noStem', 'double', 'down',
            ]
        );
    });

    test('music21.stream.makeNotation testSetStemDirectionConsistency', assert => {
        const p = music21.tinyNotation.TinyNotation('2/4 b8 f8 a8 b8');
        p.makeBeams({inPlace: true, setStemDirections: false});
        const note_array = Array.from(p.flat.notes) as music21.note.Note[];
        note_array[0].stemDirection = 'down';
        note_array[1].stemDirection = 'unspecified';
        note_array[2].stemDirection = 'down';
        note_array[3].stemDirection = 'down';

        music21.stream.makeNotation.setStemDirectionForBeamGroups(p);
        const stemDirections = note_array.map(n => n.stemDirection);
        assert.deepEqual(stemDirections, ['up', 'up', 'down', 'down']);
    });

    test('music21.stream.makeNotation testMakeBeamsWithStemDirection', assert => {
        const p = music21.tinyNotation.TinyNotation(alla_breve_test);
        const pn = Array.from(p.flat.notes) as music21.note.Note[];
        pn[14].stemDirection = 'down';
        pn[15].stemDirection = 'noStem';
        pn[16].stemDirection = 'double';
        pn[17].stemDirection = 'up';

        p.makeBeams({inPlace: true});
        const pn2 = Array.from(p.flat.notes) as music21.note.Note[];
        const stemDirections = pn2.map(n => n.stemDirection);
        assert.deepEqual(
            stemDirections,
            [
                'up', 'up', 'up', 'up',
                'down', 'down', 'down', 'down', 'down', 'down',
                'up', 'up', 'up', 'up',
                'down', 'noStem', 'double', 'down',
            ]
        );
    });
}
