import * as QUnit from 'qunit';
import music21 from '../../src/loadModules';

export default function tests() {
    QUnit.test('music21.roman.RomanNumeral', assert => {
        const t1 = 'IV';
        let rn1 = new music21.roman.RomanNumeral(t1, 'F');
        assert.equal(rn1.scaleDegree, 4, 'test scale dgree of F IV');
        const scale = rn1.scale;
        assert.equal(scale.tonic.name, 'F', 'test scale is F');
        assert.equal(rn1.root.name, 'B-', 'test root of F IV');
        assert.equal(rn1.impliedQuality, 'major', 'test quality is major');
        assert.equal(rn1.pitches[0].name, 'B-', 'test pitches[0] == B-');
        assert.equal(rn1.pitches[1].name, 'D', 'test pitches[1] == D');
        assert.equal(rn1.pitches[2].name, 'F', 'test pitches[2] == F');
        assert.equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');

        let t2 = 'viio7';
        rn1 = new music21.roman.RomanNumeral(t2, 'a');
        assert.equal(rn1.scaleDegree, 7, 'test scale dgree of A viio7');
        assert.equal(rn1.root.name, 'G#', 'test root name == G#');
        assert.equal(
            rn1.impliedQuality,
            'diminished-seventh',
            'implied quality'
        );
        assert.equal(rn1.pitches[0].name, 'G#', 'test pitches[0] == G#');
        assert.equal(rn1.pitches[1].name, 'B', 'test pitches[1] == B');
        assert.equal(rn1.pitches[2].name, 'D', 'test pitches[2] == D');
        assert.equal(rn1.pitches[3].name, 'F', 'test pitches[3] == F');
        assert.equal(rn1.degreeName, 'Leading-tone', 'test is Leading-tone');

        t2 = 'V7';
        rn1 = new music21.roman.RomanNumeral(t2, 'a');
        assert.equal(rn1.scaleDegree, 5, 'test scale dgree of a V7');
        assert.equal(rn1.root.name, 'E', 'root name is E');
        assert.equal(
            rn1.impliedQuality,
            'dominant-seventh',
            'implied quality dominant-seventh'
        );
        assert.equal(rn1.pitches[0].name, 'E', 'test pitches[0] == E');
        assert.equal(rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
        assert.equal(rn1.pitches[2].name, 'B', 'test pitches[2] == B');
        assert.equal(rn1.pitches[3].name, 'D', 'test pitches[3] == D');
        assert.equal(rn1.degreeName, 'Dominant', 'test is Dominant');

        t2 = 'VII';
        rn1 = new music21.roman.RomanNumeral(t2, 'f#');
        assert.equal(rn1.scaleDegree, 7, 'test scale dgree of a VII');
        assert.equal(rn1.root.name, 'E', 'root name is E');
        assert.equal(rn1.impliedQuality, 'major', 'implied quality major');
        assert.equal(rn1.pitches[0].name, 'E', 'test pitches[0] == E');
        assert.equal(rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
        assert.equal(rn1.pitches[2].name, 'B', 'test pitches[2] == B');
        assert.equal(rn1.degreeName, 'Subtonic', 'test is Subtonic');
    });

    QUnit.test('music21.roman.RomanNumeral - inversions', assert => {
        const t1 = 'IV';
        const rn1 = new music21.roman.RomanNumeral(t1, 'F');
        assert.equal(rn1.scaleDegree, 4, 'test scale dgree of F IV');
        const scale = rn1.scale;
        assert.equal(scale.tonic.name, 'F', 'test scale is F');
        assert.equal(rn1.root.name, 'B-', 'test root of F IV');
        assert.equal(rn1.impliedQuality, 'major', 'test quality is major');
        assert.equal(rn1.pitches[0].name, 'B-', 'test pitches[0] == B-');
        assert.equal(rn1.pitches[1].name, 'D', 'test pitches[1] == D');
        assert.equal(rn1.pitches[2].name, 'F', 'test pitches[2] == F');
        assert.equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');
    });
}
