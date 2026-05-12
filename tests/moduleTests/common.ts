import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const common = music21.common;

const { test } = QUnit;


export default function tests() {
    test('music21.common.posMod', assert => {
        assert.equal(common.posMod(8, 7), 1, 'positive posMod passed');
        assert.equal(common.posMod(-1, 7), 6, 'negative posMod passed');
        assert.equal(common.posMod(-15, 7), 6, 'big negative posMod passed');
    });

    test('music21.common.fromRoman', assert => {
        assert.equal(common.fromRoman('I'), 1, 'first roman passed');
        assert.equal(common.fromRoman('LX'), 60, 'LX roman passed');
        assert.equal(common.fromRoman('XC'), 90, 'XC subtraction roman passed');
        assert.equal(
            common.fromRoman('xc'),
            90,
            'lowercase subtraction roman passed'
        );
        assert.equal(common.fromRoman('VIII'), 8, 'max RN passed');
        assert.equal(common.fromRoman('MCDLXXXIX'), 1489, 'big roman passed');
    });

    test('music21.common.toRoman', assert => {
        assert.equal(common.toRoman(1), 'I', 'first roman passed');
        assert.equal(common.toRoman(2), 'II', '2 passed');
        assert.equal(common.toRoman(7), 'VII', '7 passed');
        assert.equal(common.toRoman(1999), 'MCMXCIX', '1999 passed');
    });

    test('music21.common.opFrac', assert => {
        assert.equal(common.opFrac(1), 1);
        assert.equal(common.opFrac((1/5 + 1/5 + 1/5) * 5), 3, 'this is not true w/o opFrac');
        assert.notEqual(common.opFrac(0.3333), 1/3);
        const n = new music21.note.Note();
        n.offset = 0;
        for (let i = 0; i < 3; i++) {
            n.offset += 0.333333333333;
        }
        assert.equal(n.offset, 1, 'offset uses opFrac');
        assert.equal(common.opFrac(0.000001), 0);
    });

    test('music21.common.pathSimplify', assert => {
        const url = music21.common.urls.soundfontUrl;
        assert.ok(url.endsWith('/'));
        assert.equal(common.pathSimplify(url), url);
        const urlWithoutTrailingSlash = url.substring(0, url.length - 1);
        assert.equal(common.pathSimplify(urlWithoutTrailingSlash), url);

        // Internal `//` should collapse to a single `/`.
        // Regression: m21basePath '../' joined with '/soundfonts/...' yielded
        // '..//soundfonts/...', which then resolved to URLs like
        // 'http://localhost:5173//soundfonts/...'.
        assert.equal(
            common.pathSimplify('..//soundfonts/midi-js-soundfonts-master/FluidR3_GM/'),
            '../soundfonts/midi-js-soundfonts-master/FluidR3_GM/'
        );
        assert.equal(common.pathSimplify('/foo//bar/'), '/foo/bar/');
        assert.equal(common.pathSimplify('foo///bar'), 'foo/bar/');

        // Protocol-prefixed URLs keep their `://` and collapse only the body.
        assert.equal(
            common.pathSimplify('https://example.com//a//b/'),
            'https://example.com/a/b/'
        );
        // Protocol-relative (CDN) prefix is preserved.
        assert.equal(common.pathSimplify('//cdn.example.com//a/'), '//cdn.example.com/a/');
    });
}
