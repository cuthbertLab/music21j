import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const key = music21.key;
const { test } = QUnit;

export default function tests() {
    test('music21.voiceLeading.VoiceLeadingQuartet', assert => {
        const VLQ = music21.voiceLeading.VoiceLeadingQuartet;
        const N = music21.note.Note;
        const v1n1 = new N('C4');
        const v1n2 = new N('B3');
        const v2n1 = new N('F3');
        let v2n2 = new N('E3');
        const vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
        assert.ok(vlq1.classes.includes('VoiceLeadingQuartet'));
        assert.equal(vlq1.vIntervals[0].name, 'P5');
        assert.equal(vlq1.vIntervals[1].name, 'P5');
        assert.equal(vlq1.hIntervals[0].name, 'm2');
        assert.equal(vlq1.hIntervals[1].name, 'm2');
        assert.ok(!vlq1.noMotion(), 'not no motion');
        assert.ok(!vlq1.obliqueMotion());
        assert.ok(vlq1.similarMotion());
        assert.ok(vlq1.parallelMotion());
        assert.ok(vlq1.parallelMotion('P5'));
        assert.ok(vlq1.parallelInterval('P5'));
        assert.ok(vlq1.parallelFifth());
        assert.ok(!vlq1.parallelOctave());
        v2n2 = new N('A3');
        const vlq2 = new VLQ(v1n1, v1n2, v2n1, v2n2);
        assert.equal(vlq2.vIntervals[1].name, 'M2');
        assert.equal(vlq2.hIntervals[1].name, 'M3');
        assert.ok(!vlq2.similarMotion(), 'not similar motion');
        assert.ok(vlq2.contraryMotion(), 'contrary motion');
        assert.ok(vlq2.inwardContraryMotion(), 'inward contrary motion');
        assert.ok(!vlq2.outwardContraryMotion(), 'not outward contrary motion');

        const vlq3 = new VLQ(new N('C4'), new N('D4'), new N('A3'), new N('F3'));
        assert.ok(vlq3.contraryMotion(), 'contrary motion set w/ strings');
    });
    test(
        'music21.voiceLeading.VoiceLeadingQuartet proper resolution',
        assert => {
            const VLQ = music21.voiceLeading.VoiceLeadingQuartet;
            const N = music21.note.Note;
            let v1n1 = new N('B-4');
            let v1n2 = new N('A4');
            let v2n1 = new N('E4');
            let v2n2 = new N('F4');
            let vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
            assert.ok(vlq1.isProperResolution(), 'd5 resolves inward');
            v2n2 = new N('D4');
            vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
            assert.ok(!vlq1.isProperResolution(), 'd5 resolves outward');
            vlq1.key = new key.Key('B-');
            assert.ok(
                vlq1.isProperResolution(),
                'not on scale degrees that need resolution'
            );
            v1n1 = new N('E5');
            v1n2 = new N('F5');
            v2n1 = new N('B-4');
            v2n2 = new N('A4');
            vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
            assert.ok(vlq1.isProperResolution(), 'A4 resolves outward');
            v2n2 = new N('D4');
            vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
            assert.ok(!vlq1.isProperResolution(), 'A4 resolves inward');
            vlq1.key = new key.Key('B-');
            assert.ok(
                vlq1.isProperResolution(),
                'not on scale degrees that need resolution'
            );
            v1n1 = new N('B-4');
            v1n2 = new N('A4');
            v2n1 = new N('C4');
            v2n2 = new N('F4');
            vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
            assert.ok(vlq1.isProperResolution(), 'm7 resolves inward');
            // v2n2 = new N('F3');
            // vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
            // Ryan believes that this is ok now...
            // assert.ok(!vlq1.isProperResolution(), 'm7 with similar motion');

            v2n2 = new N('F#4');
            vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
            vlq1.key = new key.Key('B-');
            assert.ok(
                vlq1.isProperResolution(),
                'm7 not on scale degrees that need resolution'
            );
            vlq1.key = new key.Key('F');
            assert.ok(
                !vlq1.isProperResolution(),
                'm7 on scale degrees that need resolution'
            );

            v1n1 = new N('F5');
            v1n2 = new N('G5');
            v2n1 = new N('C4');
            v2n2 = new N('C4');
            vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
            assert.ok(
                !vlq1.isProperResolution(),
                'P4 must move down or remain constant'
            );
            v1n2 = new N('E5');
            vlq1 = new VLQ(v1n1, v1n2, v2n1, v2n2);
            assert.ok(
                vlq1.isProperResolution(),
                'P4 moves down: ' + vlq1.v1n1.pitch.ps + vlq1.v1n2.pitch.ps
            );
        }
    );
}
