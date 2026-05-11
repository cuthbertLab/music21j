import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;

export default function tests() {
    test('music21.scale.Scale', assert => {
        const sc = new music21.scale.Scale();
        assert.ok(sc.classes.includes('Scale'));
    });
    test('music21.scale.AbstractDiatonicScale', assert => {
        const sc = new music21.scale.AbstractDiatonicScale('major');
        // noinspection TypeScriptUnresolvedVariable
        // @ts-ignore
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
        assert.equal(sc.getScaleDegreeFromPitch(new music21.pitch.Pitch('B-')), 4);
        assert.equal(sc.getScaleDegreeFromPitch(new music21.pitch.Pitch('B')), undefined);
    });

    test('music21.scale.AbstractScale.buildNetworkFromPitches', assert => {
        const sc = new music21.scale.AbstractScale();
        const notes = ['C4', 'D4', 'E4', 'C5'].map(p => new music21.note.Note(p));
        sc.buildNetworkFromPitches(notes);
        const realized = sc.getRealization(new music21.pitch.Pitch('C4'));
        assert.deepEqual(realized.map(p => p.nameWithOctave), ['C4', 'D4', 'E4', 'C5']);
        assert.equal(sc.octaveDuplicating, true);
    });

    test('music21.scale.AbstractScale.buildNetworkFromPitches closes implicit octave', assert => {
        const sc = new music21.scale.AbstractScale();
        sc.buildNetworkFromPitches(['C', 'F']);
        const realized = sc.getRealization(new music21.pitch.Pitch('G4'));
        assert.deepEqual(realized.map(p => p.nameWithOctave), ['G4', 'C5', 'G5']);
        assert.equal(sc.octaveDuplicating, true);
    });

    test('music21.scale minor variants', assert => {
        const minor = new music21.scale.MinorScale('A');
        const harmonic = new music21.scale.HarmonicMinorScale('A');
        const melodic = new music21.scale.AscendingMelodicMinorScale('A');
        assert.equal(minor.getPitches()[6].name, 'G');
        assert.equal(harmonic.getPitches()[6].name, 'G#');
        assert.equal(melodic.getPitches()[5].name, 'F#');
        assert.equal(melodic.getPitches()[6].name, 'G#');
    });

    test('music21.scale helper functions', assert => {
        const major = music21.scale.ScaleSimpleMajor(new music21.pitch.Pitch('C4'));
        const harmonic = music21.scale.ScaleSimpleMinor(new music21.pitch.Pitch('A4'), 'harmonic minor');
        const melodic = music21.scale.ScaleSimpleMinor(new music21.pitch.Pitch('A4'), 'melodic minor');
        assert.deepEqual(major.slice(0, 4).map(p => p.nameWithOctave), ['C4', 'D4', 'E4', 'F4']);
        assert.equal(harmonic[6].nameWithOctave, 'G#5');
        assert.equal(melodic[5].nameWithOctave, 'F#5');
    });
}
