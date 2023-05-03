import * as QUnit from 'qunit';
import {KeySignature as VFKeySignature, StaveModifierPosition, Glyph as VFGlyph} from 'vexflow';
import * as music21 from '../../src/main';

const { test } = QUnit;


export default function tests() {
    test('music21.key.convertKeyStringToMusic21KeyString', assert => {
        const conv = music21.key.convertKeyStringToMusic21KeyString;
        assert.equal(conv('A'), 'A', 'normal string passed');
        assert.equal(conv('a-'), 'a-', 'normal string passed');
        assert.equal(conv('Bb'), 'B-', 'Bb passed');
        assert.equal(conv('bb'), 'b-', 'bb passed');
        assert.equal(conv('b'), 'b', 'b minor passed');
        assert.equal(conv('B'), 'B', 'B major passed');
        assert.equal(conv('Eb'), 'E-', 'E- major passed');
    });

    test('music21.key vexflow', assert => {
        const ks = new music21.key.KeySignature(3);
        const s = new music21.stream.Stream();
        s.append(ks);
        s.appendNewDOM();
        const vfs = s.activeVFStave;
        const modifiers = vfs.getModifiers(StaveModifierPosition.BEGIN, VFKeySignature.CATEGORY);
        assert.equal(modifiers.length, 1, 'One key signature at beginning in VF');
        // @ts-ignore
        const glyphs: VFGlyph[] = modifiers[0].glyphs;
        assert.equal(glyphs.length, 3, '3 sharp KS should have 3 glyphs');
        const g = glyphs[0];
        assert.equal(g.getCode(), 'accidentalSharp', 'Code is accidentalSharp');
    });

    test('music21.key.Key', assert => {
        const testSharps = [
            // sharps, mode, given name, given mode
            [0, 'minor', 'a'],
            [0, 'major', 'C'],
            [0, 'major'],
            [6, 'major', 'F#'],
            [3, 'minor', 'f#'],
            [6, 'major', 'f#', 'major'],
            [-2, 'major', 'B-'],
            [-5, 'minor', 'b-'],
        ];
        for (let i = 0; i < testSharps.length; i++) {
            const thisTest = testSharps[i];
            const expectedSharps = thisTest[0];
            const expectedMode = thisTest[1];
            const givenKeyName = thisTest[2] as string;
            const givenMode = thisTest[3];
            const k = new music21.key.Key(givenKeyName, givenMode);
            const foundSharps = k.sharps;
            const foundMode = k.mode;
            assert.equal(
                foundSharps,
                expectedSharps,
                'Test sharps: ' + givenKeyName + ' (mode: ' + givenMode + ') '
            );
            assert.equal(
                foundMode,
                expectedMode,
                'Test mode: ' + givenKeyName + ' (mode: ' + givenMode + ') '
            );
        }

        const k = new music21.key.Key('f#');
        let s = k.getScale().getPitches();
        assert.equal(s[2].nameWithOctave, 'A4', 'test minor scale');
        assert.equal(s[6].nameWithOctave, 'E5');
        s = k.getScale('major').getPitches();
        assert.equal(s[2].nameWithOctave, 'A#4', 'test major scale');
        assert.equal(s[6].nameWithOctave, 'E#5');
        s = k.getScale('harmonic minor').getPitches();
        assert.equal(s[2].nameWithOctave, 'A4', 'test harmonic minor scale');
        assert.equal(s[5].nameWithOctave, 'D5');
        assert.equal(s[6].nameWithOctave, 'E#5');

        assert.equal(k.width, 42, 'checking width');
    });

    test('music21.key.KeySignature setting sharps updates alteredPitches', assert => {
        const ks = new music21.key.KeySignature();
        ks.sharps = -4;
        assert.equal(`${ks.alteredPitches.map(p => p.name)}`, 'B-,E-,A-,D-');
    });
}
