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

    test('music21.vfShow.Renderer prepareTies in voices', assert => {
        const v1 = new music21.stream.Voice();
        const n0 = new music21.note.Note('F4');
        v1.repeatAppend(n0, 2);
        const v2 = new music21.stream.Voice();
        const n1 = new music21.note.Note('C4');
        n1.tie = new music21.tie.Tie('start');
        const n2 = new music21.note.Note('C4');
        n2.tie = new music21.tie.Tie('stop');
        v2.append(n1);
        v2.append(n2);
        const p = new music21.stream.Part();
        const m = new music21.stream.Measure();
        m.append(new music21.clef.TrebleClef());
        m.append(new music21.meter.TimeSignature('2/4'));
        m.insert(0, v1);
        m.insert(0, v2);
        p.append(m);

        const svg = p.appendNewDOM();
        const renderer = new music21.vfShow.Renderer(p, svg);
        renderer.preparePartlike(p);
        assert.deepEqual(renderer.vfTies[0].first_note, n1.activeVexflowNote);
        assert.deepEqual(renderer.vfTies[0].last_note, n2.activeVexflowNote);
    });

    test('music21.vfShow.Renderer prepareTies in voices across barline', assert => {
        const m1_sop_voice = new music21.stream.Voice();
        m1_sop_voice.id = 'Soprano';
        const n_m1_v1 = new music21.note.Note('C5');
        m1_sop_voice.repeatAppend(n_m1_v1, 2);
        const m1_alto_voice = new music21.stream.Voice();
        m1_alto_voice.id = 'Alto';
        const n_m1_v2 = new music21.note.Note('E4');
        m1_alto_voice.repeatAppend(n_m1_v2, 2);
        const m1 = new music21.stream.Measure();
        m1.append(m1_sop_voice);
        m1.append(m1_alto_voice);

        const m2_sop_voice = new music21.stream.Voice();
        m2_sop_voice.id = 'Soprano';
        const n_m2_v1 = new music21.note.Note('C5');
        m2_sop_voice.repeatAppend(n_m2_v1, 2);
        const m2_alto_voice = new music21.stream.Voice();
        m2_alto_voice.id = 'Alto';
        const n_m2_v2 = new music21.note.Note('E4');
        m2_alto_voice.repeatAppend(n_m2_v2, 2);
        const m2 = new music21.stream.Measure();
        m2.append(m1_sop_voice);
        m2.append(m1_alto_voice);

        const p = new music21.stream.Part();
        p.append(m1);
        p.append(m2);
        const s = new music21.stream.Score();
        s.append(p);

        // create tie in alto
        m1_alto_voice.notes.get(1).tie = new music21.tie.Tie('start');
        m2_alto_voice.notes.get(0).tie = new music21.tie.Tie('stop');

        const svg = s.appendNewDOM();
        const renderer = new music21.vfShow.Renderer(p, svg);
        renderer.prepareScorelike(s);
        assert.equal(renderer.vfTies[0].first_note.line, renderer.vfTies[0].last_note.line);

        // now with random IDs
        m1_sop_voice.id = 'aaaa';
        m1_alto_voice.id = 'bbbb';
        m2_sop_voice.id = 'cccc';
        m2_alto_voice.id = 'dddd';

        const svg2 = s.appendNewDOM();
        const renderer2 = new music21.vfShow.Renderer(p, svg2);
        renderer2.prepareScorelike(s);
        assert.equal(renderer2.vfTies[0].first_note.line, renderer2.vfTies[0].last_note.line);
    });

    test('music21.vfShow.Renderer prepareTies across system break', assert => {
        const p = <music21.stream.Part> music21.tinyNotation.TinyNotation('c1 d e~ e');
        const s = new music21.stream.Score();
        s.append(p);
        s.renderOptions.maxSystemWidth = 20;

        const svg = s.appendNewDOM();
        const renderer = new music21.vfShow.Renderer(p, svg);
        renderer.prepareScorelike(s);
        assert.equal(renderer.vfTies.length, 2);
    });
}
