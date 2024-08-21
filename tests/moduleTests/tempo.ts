import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;


export default function tests() {
    test('music21.tempo.MetronomeMark', assert => {
        let mark;
        mark = new music21.tempo.MetronomeMark();
        assert.strictEqual(mark.text, undefined);
        assert.strictEqual(mark.number, undefined);
        assert.strictEqual(mark.referent.quarterLength, 1);

        mark = new music21.tempo.MetronomeMark({ text: 'andante' });
        assert.equal(mark.text, 'andante');
        assert.ok(mark.numberImplicit);
        assert.notOk(mark.textImplicit);
        assert.equal(mark.number, 72);

        mark = new music21.tempo.MetronomeMark({ number: 40 });
        assert.equal(mark.text, 'grave');
        assert.notOk(mark.numberImplicit);
        assert.ok(mark.textImplicit);
        assert.equal(mark.number, 40);

        mark = new music21.tempo.MetronomeMark({
            referent: new music21.duration.Duration('half'),
        });
        assert.strictEqual(mark.referent.quarterLength, 2);

        mark = new music21.tempo.MetronomeMark({
            referent: new music21.duration.Duration(2),
        });
        assert.strictEqual(mark.referent.quarterLength, 2);

        mark = new music21.tempo.MetronomeMark({
            text: 'grave',
            number: 42,
            referent: new music21.duration.Duration('half'),
        });
        assert.equal(mark.text, 'grave', 'Expected to find set text');
        assert.notOk(mark.numberImplicit, 'Expected .numberImplicit to be false');
        assert.notOk(mark.textImplicit, 'Expected .textImplicit to be false');
        assert.equal(mark.number, 42);
        assert.equal(mark.referent.quarterLength, 2);

    });
}
