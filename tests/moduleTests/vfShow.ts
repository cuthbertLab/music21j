import * as QUnit from 'qunit';
import * as music21 from '../../src/music21_modules';

const { test } = QUnit;

function get_test_stream() {
    const s = new music21.stream.Score();
    const p = new music21.stream.Part();

    for (let i = 0; i < 2; i++) {
        const m = new music21.stream.Measure();
        m.timeSignature = new music21.meter.TimeSignature('6/8');
        const note_strs = ['C', 'D', 'E', 'F', 'G', 'A'];
        const notes = note_strs.map((pitch_str, i) => {
            const n = new music21.note.Note(pitch_str);
            n.duration.quarterLength = 0.5;
            const type = i % 2 === 0 ? 'start' : 'stop';
            n.beams.fill('8th', type);
            return n;
        });
        m.append(notes);
        p.append(m);
    }
    s.append(p);

    return s;
}
export default function tests() {
    test('music21.vfShow.Renderer', assert => {
        const s = get_test_stream();
        const svg = s.appendNewDOM();

        let renderer = new music21.vfShow.Renderer(s, svg);
        assert.equal(renderer.beamGroups.length, 0);

        renderer.render();
        assert.equal(renderer.beamGroups.length, 6);

        renderer = new music21.vfShow.Renderer(s, svg);
        s.autoBeam = true;
        renderer.render();
        assert.equal(renderer.beamGroups.length, 4);
    });
}
