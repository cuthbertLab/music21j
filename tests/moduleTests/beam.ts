import * as QUnit from 'qunit';
import * as music21 from '../../src/music21_modules';

const { test } = QUnit;


export default function tests() {
    test('music21.beam.Beams setAll', assert => {
        const a = new music21.beam.Beams();
        a.fill('16th');
        a.setAll('start');

        assert.equal(a.getTypes()[0], 'start');
        assert.equal(a.getTypes()[1], 'start');
    });

    test('music21.beam.Beams setByNumber', assert => {
        const b = new music21.beam.Beams();
        b.fill('16th');
        b.setAll('start');

        b.setByNumber(1, 'continue');
        assert.equal(b.beamsList[0].type, 'continue');
        assert.equal(b.getTypeByNumber(1), 'continue');

        b.setByNumber(2, 'stop');
        assert.equal(b.beamsList[1].type, 'stop');
        assert.equal(b.getTypeByNumber(2), 'stop');

        b.setByNumber(2, 'partial-right');
        assert.equal(b.beamsList[1].type, 'partial');
        assert.equal(b.getTypeByNumber(2), 'partial-right');
        assert.equal(b.beamsList[1].direction, 'right');
    });
}
