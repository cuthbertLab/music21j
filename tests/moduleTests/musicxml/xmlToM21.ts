import * as QUnit from 'qunit';
import * as music21 from '../../../src/main';

const { test } = QUnit;


export default function tests() {
    test('regression test for spurious natural accidental', assert => {
        const p = music21.tinyNotation.TinyNotation('tinyNotation: d1 d1');
        const scoreParser = new music21.musicxml.xmlToM21.ScoreParser();
        const parsed = scoreParser.scoreFromText(p.write());
        const accidental_list = parsed.recurse().notes.map(note => note.pitches[0].accidental);
        assert.equal(accidental_list[0], undefined);
        assert.equal(accidental_list[1], undefined);
    });
}
