import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;


export default function tests() {
    test('music21.vfShow.Renderer.beamGroups', assert => {
        // Set up
        const s = new music21.stream.Score();
        const p = new music21.stream.Part();
        const m = new music21.stream.Measure();
        m.timeSignature = new music21.meter.TimeSignature('6/8');
        const notes = ['C', 'D', 'E', 'F', 'G', 'A'].map((pitchStr, i) => {
            const n = new music21.note.Note(pitchStr, 0.5);
            // Explicitly beam incorrectly
            const beatType = i % 2 === 0 ? 'start' : 'stop';
            n.beams.fill('8th', beatType);
            return n;
        });
        m.append(notes);
        p.append(m);
        s.append(p);

        const svg = s.appendNewDOM();

        let renderer = new music21.vfShow.Renderer(s, svg);
        assert.equal(renderer.beamGroups.length, 0);

        renderer.render();
        assert.equal(renderer.beamGroups.length, 3);

        s.autoBeam = true;

        // VexFlow autobeam sets the correct number of beams
        s.renderOptions.useVexflowAutobeam = true;
        renderer = new music21.vfShow.Renderer(s, svg);
        renderer.render();
        assert.equal(renderer.beamGroups.length, 2);

        // Native autobeam also sets the correct number of beams
        s.renderOptions.useVexflowAutobeam = false;
        s.makeBeams({ inPlace: true });
        renderer = new music21.vfShow.Renderer(s, svg);
        renderer.render();
        assert.equal(renderer.beamGroups.length, 2);
    });
}
