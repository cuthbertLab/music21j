import * as QUnit from 'qunit';
import music21 from '../../src/loadModules';

export default function tests() {
    QUnit.test('music21.streamInteraction.PixelMapper', assert => {
        const s = music21.tinyNotation.TinyNotation('3/4 C4 D4 E4 F2. G2.');
        const can = s.createCanvas();
        const pm = new music21.streamInteraction.PixelMapper(s);
        assert.equal(Math.round(pm.startX), 64);
        assert.equal(Math.round(pm.maxX), 410);
        assert.equal(pm.maxSystemIndex, 0);
        assert.equal(pm.allMaps.length, 6); // 5 notes + end

        // get a PixelMap
        const pm0 = pm.allMaps[0];
        assert.equal(pm0.systemIndex, 0);
        assert.equal(Math.round(pm0.x), 64);
        assert.equal(pm0.offset, 0);
        const pm0els = pm0.elements;
        assert.equal(pm0els.length, 1);
        const pm0note = pm0.elements[0];
        assert.equal(pm0note.pitch.name, 'C');

        const pmLast = pm.allMaps[5];
        assert.equal(pmLast.offset, 9);
        assert.equal(pmLast.x, 410);
        assert.equal(pmLast.elements[0], undefined);

        // find maps
        assert.strictEqual(pm.findMapForExactOffset(1.0), pm.allMaps[1]);
        const pmsAround = pm.getPixelMapsAroundOffset(1.5);
        assert.strictEqual(pmsAround[0], pm.allMaps[1]);
        assert.strictEqual(pmsAround[1], pm.allMaps[2]);
        assert.equal(Math.round(pm.getXAtOffset(0.5)), 115);
        assert.equal(pm.getSystemIndexAtOffset(4.0), 0);

        // long stream
        const longerPart = music21.tinyNotation.TinyNotation(
            '4/4 C1 D E F G A B C D E F G A B C D E F G A B C D E F G'
        );
        const longer = new music21.stream.Score();
        longer.append(longerPart);
        longer.renderOptions.maxSystemWidth = 400;
        longer.createCanvas(400); // width
        const pmLonger = new music21.streamInteraction.PixelMapper(longer);
        assert.equal(pmLonger.maxSystemIndex, 3);
        assert.equal(pmLonger.getSystemIndexAtOffset(31), 0);
        assert.equal(pmLonger.getSystemIndexAtOffset(33), 1);
        const [preBreak, postBreak] = pmLonger.getPixelMapsAroundOffset(31);
        assert.equal(preBreak.systemIndex, 0);
        assert.equal(postBreak.systemIndex, 1);
        assert.ok(postBreak.x < preBreak.x);
    });
}
