import * as QUnit from 'qunit';
import {StaveModifierPosition, TimeSignature as VFTimeSignature} from 'vexflow';
import * as music21 from '../../src/main';

const { test } = QUnit;


export default function tests() {
    test('music21.meter.TimeSignature', assert => {
        const m = new music21.meter.TimeSignature('4/4');

        assert.equal(m.ratioString, '4/4', 'ratioString matches');
        assert.equal(m.barDuration.quarterLength, 4.0, 'bar lasts 4.0 ql');
        assert.deepEqual(m.beatGroups, [[2, 8]], 'beatGroups check out');
        assert.equal(m.beatCount, 4, 'beat count is 4');
        assert.equal(
            m.beatDuration.type,
            'quarter',
            'beatDuration type is quarter'
        );
        assert.equal(m.beatDuration.dots, 0, 'beatDuration has not dots');
    });

    test('music21.meter.TimeSignature.offsetToSpan', assert => {
        let m = new music21.meter.TimeSignature('4/4');
        let [start, end] = m.offsetToSpan(3.2);
        assert.equal(start, 3.0, 'beat starts at 3');
        assert.equal(end, 4.0, 'beat ends at 4');

        m = new music21.meter.TimeSignature('7/8');
        [start, end] = m.offsetToSpan(2.0);
        assert.equal(start, 1.5);
        assert.equal(end, 2.5);
    });

    test('music21.meter.TimeSignature.offsetToIndex', assert => {
        // indexes are for now, integer beat numbers - 1.
        let m = new music21.meter.TimeSignature('4/4');
        assert.equal(m.offsetToIndex(0.0), 0, '0 gives index 0 in 4/4');
        assert.equal(m.offsetToIndex(3.2), 3, '3.2 gives index 3 in 4/4');

        m = new music21.meter.TimeSignature('2/2');
        assert.equal(m.offsetToIndex(0.0), 0, '0 gives index 0 in 2/2');
        assert.equal(m.offsetToIndex(3.2), 1, '3.2 gives index 1 in 2/2');

        m = new music21.meter.TimeSignature('5/8');
        assert.equal(m.offsetToIndex(1.5), 1, '1.5 gives index 1 in 5/8');
        assert.equal(
            m.offsetToIndex(
                1.5,
                {includeCoincidentBoundaries: true},
            ),
            0,
            '1.5 gives index 0 in 5/8 with coincident',
        );
    });

    test('music21.meter.TimeSignature vexflow renders', assert => {
        const ts1 = new music21.meter.TimeSignature('5/4');
        const m = new music21.stream.Measure();
        m.append(ts1);
        m.appendNewDOM();

        const vfs = m.activeVFStave;
        const modifiers = vfs.getModifiers(StaveModifierPosition.BEGIN, VFTimeSignature.CATEGORY);
        assert.equal(modifiers.length, 1, 'One time signature at beginning in VF');

        const p = music21.tinyNotation.TinyNotation('4/4 c1 2/16 d8 12/8 e1.');
        p.appendNewDOM();
    });

    test('music21.meter.TimeSignature getBeams', assert => {
        const m = new music21.stream.Measure();
        m.append(new music21.note.Note('C', 1.5));
        m.append(new music21.note.Note('C', 0.5));
        m.append(new music21.note.Note('C', 0.5));
        m.append(new music21.note.Note('C', 0.5));

        const ts = new music21.meter.TimeSignature('3/4');
        const beamsList = ts.getBeams(m);

        assert.strictEqual(typeof beamsList[0], 'undefined');
        assert.strictEqual(typeof beamsList[1], 'undefined');
        assert.ok(beamsList[2] instanceof music21.beam.Beams);
        assert.ok(beamsList[3] instanceof music21.beam.Beams);

        assert.strictEqual(beamsList[2].beamsList[0].type, 'start');
        assert.strictEqual(beamsList[3].beamsList[0].type, 'stop');
    });

    test('music21.meter.TimeSignature getBeams 3/8, 2/8', assert => {
        const m = new music21.stream.Measure();
        m.append(new music21.note.Note('C', 0.5));
        m.append(new music21.note.Note('C', 0.75));
        m.append(new music21.note.Note('C', 0.25));

        const ts = new music21.meter.TimeSignature('3/8');
        const beamsList = ts.getBeams(m);

        for (const beam of beamsList) {
            assert.strictEqual(
                beam.classes[0],
                'Beams',
                '8th notes in 3/8 get beams.'
            );
        }

        const m2 = new music21.stream.Measure();
        m2.append(new music21.note.Note('C', 0.75));
        m2.append(new music21.note.Note('C', 0.25));

        const ts2 = new music21.meter.TimeSignature('2/8');
        const beamsList2 = ts2.getBeams(m2);

        for (const beam of beamsList2) {
            assert.strictEqual(
                typeof beam,
                'undefined',
                '8th notes should not get beams in 2/8 or 4/8, etc.'
            );
        }
    });

    test('music21.meter.TimeSignature getBeams 5/8 7/8', assert => {
        const m = new music21.stream.Measure();
        const n = new music21.note.Note('C', 0.5);
        m.repeatAppend(n, 5);

        let ts = new music21.meter.TimeSignature('5/8');
        let beamsList = ts.getBeams(m);

        assert.deepEqual(
            beamsList.map(x => x.beamsList[0]?.type),
            ['start', 'continue', 'stop', 'start', 'stop']
        );

        ts = new music21.meter.TimeSignature('7/8');
        m.repeatAppend(n, 2);
        beamsList = ts.getBeams(m);

        assert.deepEqual(
            beamsList.map(x => x.beamsList[0]?.type),
            ['start', 'continue', 'stop', 'start', 'stop', 'start', 'stop']
        );
    });

    test('music21.meter.TimeSignature getBeams 3/4', assert => {
        const m = new music21.stream.Measure();
        m.append(new music21.note.Note('C', 0.5));
        m.append(new music21.note.Note('C', 0.5));
        m.append(new music21.note.Note('C', 0.5));
        m.append(new music21.note.Note('C', 0.5));
        m.append(new music21.note.Note('C', 1.0));
        const ts = new music21.meter.TimeSignature('3/4');
        const beamsList = ts.getBeams(m);  // this was not finding 4th beam before.

        for (let i = 0; i <= 3; i++) {
            assert.ok(beamsList[i] instanceof music21.beam.Beams);
        }
        assert.strictEqual(typeof beamsList[4], 'undefined');

        assert.strictEqual(beamsList[0].beamsList[0].type, 'start');
        assert.strictEqual(beamsList[1].beamsList[0].type, 'stop');
        assert.strictEqual(beamsList[2].beamsList[0].type, 'start');
        assert.strictEqual(beamsList[3].beamsList[0].type, 'stop');

    });

    test('music21.meter.TimeSignature getBeams incomplete measure', assert => {
        const m = new music21.stream.Measure();

        // incomplete measure in 2/4
        m.append(new music21.note.Note('C', 0.5));
        m.append(new music21.note.Note('C', 0.5));
        m.append(new music21.note.Note('C', 0.5));

        const ts = new music21.meter.TimeSignature('2/4');
        const beamsList = ts.getBeams(m);

        assert.ok(beamsList[0] instanceof music21.beam.Beams);
        assert.ok(beamsList[1] instanceof music21.beam.Beams);
        assert.strictEqual(typeof beamsList[2], 'undefined');

        assert.strictEqual(beamsList[0].beamsList[0].type, 'start');
        assert.strictEqual(beamsList[1].beamsList[0].type, 'stop');
    });

    test('music21.meter.TimeSignature getBeams incomplete measure paddingRight', assert => {
        // incomplete measure in 12/8, with paddingRight set
        const m = new music21.stream.Measure();
        m.append(new music21.note.Note('C', 0.5));
        m.append(new music21.note.Note('C', 0.25));
        m.append(new music21.note.Note('C', 1));
        m.append(new music21.note.Note('C', 1));
        m.append(new music21.note.Note('C', 0.5));  // this beam crosses the beat boundary 2.75 -> 3.25
        m.append(new music21.note.Note('C', 0.5));  // and thus cannot be beamed to this one
        m.paddingRight = 2.25;

        const ts = new music21.meter.TimeSignature('12/8');
        const beamsList = ts.getBeams(m);
        assert.strictEqual(typeof beamsList[4], 'undefined');
        assert.strictEqual(typeof beamsList[5], 'undefined');
    });

    test('music21.meter.TimeSignature getBeams singleton stop beams', assert => {
        // This tests a very specific situation where the penultimate note in a measure:
        //   1. is beamable
        //   2. is held across a beat
        //   3. is preceded by a non-beamable note
        //   4. is followed by a beamable note
        // Previously this situation would result in a single 'stop' beam at the final note
        // and no others.
        const m = new music21.stream.Measure();
        m.append(new music21.note.Note('C', 0.5));
        m.append(new music21.note.Note('C', 1.0));
        m.append(new music21.note.Note('C', 0.75));
        m.append(new music21.note.Note('C', 0.75));

        const ts = new music21.meter.TimeSignature('3/4');
        const beamsList = ts.getBeams(m);
        assert.strictEqual(typeof beamsList[2], 'undefined');
        assert.strictEqual(typeof beamsList[3], 'undefined');
    });

    test('music21.meter.TimeSignature compound', assert => {
        const m = new music21.meter.TimeSignature('6/8');

        assert.equal(m.ratioString, '6/8', 'ratioString matches');
        assert.equal(m.barDuration.quarterLength, 3.0, 'bar lasts 3.0 ql');
        assert.deepEqual(
            m.beatGroups,
            [[3, 8], [3, 8]],
            'beatGroups check out'
        );
        assert.equal(m.beatCount, 2, 'beat count is 2');
        assert.equal(
            m.beatDuration.type,
            'quarter',
            'beatDuration type is quarter'
        );
        assert.equal(m.beatDuration.dots, 1, 'beatDuration has dot');
    });

    test('music21.meter.TimeSignature.beatGroups', assert => {
        function assertBeatGroups(meterString: string, expectedBeatGroups: number[][]) {
            const m = new music21.meter.TimeSignature(meterString);
            assert.deepEqual(
                m.beatGroups,
                expectedBeatGroups,
                `${meterString} should have beat groups: ${expectedBeatGroups}`,
            );
        }
        assertBeatGroups('2/2', [[1, 2]]);
        assertBeatGroups('3/2', [[1, 2]]);
        assertBeatGroups('4/2', [[1, 2]]);
        assertBeatGroups('2/4', [[2, 8]]);
        assertBeatGroups('3/4', [[2, 8]]);
        assertBeatGroups('4/4', [[2, 8]]);
        assertBeatGroups('5/4', [[2, 8]]);
        assertBeatGroups('6/4', [[3, 4], [3, 4]]);
        assertBeatGroups('7/4', [[2, 8]]);
        assertBeatGroups('9/4', [[3, 4], [3, 4], [3, 4]]);
        assertBeatGroups('12/4', [[3, 4], [3, 4], [3, 4], [3, 4]]);
        assertBeatGroups('2/8', [[1, 8]]);
        assertBeatGroups('3/8', [[3, 8]]);
        assertBeatGroups('4/8', [[1, 8]]);
        assertBeatGroups('5/8', [[3, 8], [2, 8]]);
        assertBeatGroups('6/8', [[3, 8], [3, 8]]);
        assertBeatGroups('7/8', [[3, 8], [2, 8], [2, 8]]);
        assertBeatGroups('9/8', [[3, 8], [3, 8], [3, 8]]);
        assertBeatGroups('12/8', [[3, 8], [3, 8], [3, 8], [3, 8]]);
        assertBeatGroups('3/16', [[3, 16]]);
        assertBeatGroups('4/16', [[1, 16]]);
        assertBeatGroups('5/16', [[3, 16], [2, 16]]);
        assertBeatGroups('6/16', [[3, 16], [3, 16]]);
        assertBeatGroups('7/16', [[3, 16], [2, 16], [2, 16]]);
        assertBeatGroups('9/16', [[3, 16], [3, 16], [3, 16]]);
        assertBeatGroups('12/16', [[3, 16], [3, 16], [3, 16], [3, 16]]);
    });
}
