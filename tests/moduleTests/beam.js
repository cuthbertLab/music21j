import * as QUnit from '../../node_modules/qunit/qunit/qunit.js';
import * as music21 from '../../src/music21_modules.js';

export default function tests() {
    QUnit.test('music21.beam.Beams', assert => {
        const a = new music21.beam.Beams();
        a.fill('16th');
        a.setAll('start');
        assert.equal(a.getTypes()[0], 'start');
        assert.equal(a.getTypes()[1], 'start');

        const b = new music21.beam.Beams();
        b.fill('16th');
        b.setAll('start');
        b.setByNumber(1, 'continue');
        assert.equal(b.beamsList[0].type, 'continue');
        b.setByNumber(2, 'stop');
        assert.equal(b.beamsList[1].type, 'stop');
        b.setByNumber(2, 'partial-right');
        assert.equal(b.beamsList[1].type, 'partial');
        assert.equal(b.beamsList[1].direction, 'right');
    });
}
