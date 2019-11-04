import * as QUnit from 'qunit';
import * as music21 from '../../src/music21_modules';

const { test } = QUnit;

export default function tests() {
    test('music21.scale.Scale', assert => {
        const sc = new music21.scale.Scale();
        assert.ok(sc.classes.includes('Scale'));
    });
    test('music21.scale.AbstractDiatonicScale', assert => {
        const sc = new music21.scale.AbstractDiatonicScale('major');
        const net = sc._net;
        assert.equal(net.length, 7);
        assert.equal(net[0].name, 'M2');
        const p = new music21.pitch.Pitch('A-');
        const pitches = sc.getRealization(p);
        assert.equal(pitches.length, 8);
        assert.equal(pitches[3].name, 'D-');
        assert.equal(sc.getPitchFromNodeDegree(p, undefined, 4).name, 'D-');
    });

    test('music21.scale.MajorScale', assert => {
        const sc = new music21.scale.MajorScale('F');
        assert.equal(sc.tonic.name, 'F');
        const pitches = sc.getPitches();
        assert.equal(pitches[0].name, 'F');
        assert.equal(pitches[1].name, 'G');
        assert.equal(pitches[2].name, 'A');
        assert.equal(pitches[3].name, 'B-');
        assert.equal(pitches[4].name, 'C');
        assert.equal(pitches[5].name, 'D');
        assert.equal(pitches[6].name, 'E');
        assert.equal(pitches[7].name, 'F');
        assert.equal(sc.pitchFromDegree(5).name, 'C');
        assert.equal(sc.getScaleDegreeFromPitch('B-'), 4);
    });
}
