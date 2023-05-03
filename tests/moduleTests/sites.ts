import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;


export default function tests() {
    test('music21.sites.SiteRef', assert => {
        const sr = new music21.sites.SiteRef();
        assert.ok(!sr.isDead);
        assert.equal(
            sr.site,
            undefined,
            'SiteRef should start undefined'
        );
        const st = new music21.stream.Measure();
        sr.site = st;
        sr.classString = st.classes[0];
        assert.equal(sr.site, st);
        assert.equal(sr.classString, 'Measure');
    });

    test('music21.sites.Sites', assert => {
        const s = new music21.sites.Sites();
        assert.equal(s.length, 1, 'empty sites has length 1');
        const st = new music21.stream.Measure();
        st.number = 12;
        s.add(st);
        assert.equal(s.length, 2, 'should have two sites now');
        assert.ok(s.includes(st));
        // @ts-ignore
        const first = s._keysByTime()[0];
        assert.equal(first, music21.sites.getId(st));

        let af;
        af = Array.from(s.yieldSites(false, st));
        assert.equal(af.length, 2);
        assert.strictEqual(af[0], st);
        af = Array.from(s.yieldSites(false, st, true));
        assert.equal(af.length, 1);
        assert.strictEqual(af[0], st);

        const mNum = s.getAttrByName('number');
        assert.equal(mNum, 12, 'measure number should be 12');

        assert.strictEqual(s.getObjByClass('Measure'), st);
        assert.strictEqual(s.getObjByClass('Stream'), st);
        assert.notOk(s.getObjByClass('Score'));

        s.clear();
        assert.equal(s.length, 1);
    });
}
