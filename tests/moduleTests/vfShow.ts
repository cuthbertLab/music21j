import * as QUnit from 'qunit';
// import {TextNote as VFTextNote} from 'vexflow';

import * as music21 from '../../src/main';
import type { StreamIterator } from '../../src/stream/iterator';

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

        s.appendNewDOM();

        const svg = document.createElement('svg');
        svg.setAttribute('height', '300');
        svg.setAttribute('width', '300');

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
        s.appendNewDOM();
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

        p.appendNewDOM();
        const renderer = p.activeVFRenderer;
        // @ts-ignore
        assert.deepEqual(renderer.vfTies[0].notes.first_note, n1.activeVexflowNote);
        // @ts-ignore
        assert.deepEqual(renderer.vfTies[0].notes.last_note, n2.activeVexflowNote);
    });

    test('music21.vfShow.Renderer prepareTies in voices across barline', assert => {
        const m1_sop_voice = new music21.stream.Voice();
        m1_sop_voice.id = 'Soprano';
        const n_m1_v1 = new music21.note.Note('C5');
        n_m1_v1.stemDirection = 'up';
        m1_sop_voice.repeatAppend(n_m1_v1, 2);
        const m1_alto_voice = new music21.stream.Voice();
        m1_alto_voice.id = 'Alto';
        const n_m1_v2 = new music21.note.Note('E4');
        n_m1_v2.stemDirection = 'down';
        m1_alto_voice.repeatAppend(n_m1_v2, 2);
        const m1 = new music21.stream.Measure();
        m1.append(m1_sop_voice);
        m1.append(m1_alto_voice);

        const m2_sop_voice = new music21.stream.Voice();
        m2_sop_voice.id = 'Soprano';
        const n_m2_v1 = new music21.note.Note('C5');
        n_m2_v1.stemDirection = 'up';
        m2_sop_voice.repeatAppend(n_m2_v1, 2);
        const m2_alto_voice = new music21.stream.Voice();
        m2_alto_voice.id = 'Alto';
        const n_m2_v2 = new music21.note.Note('E4');
        n_m2_v2.stemDirection = 'down';
        m2_alto_voice.repeatAppend(n_m2_v2, 2);
        const m2 = new music21.stream.Measure();
        m2.append(m2_sop_voice);
        m2.append(m2_alto_voice);

        const p = new music21.stream.Part();
        p.append(m1);
        p.append(m2);
        const s = new music21.stream.Score();
        s.append(p);

        // create tie in alto
        m1_alto_voice.notes.get(1).tie = new music21.tie.Tie('start');
        m2_alto_voice.notes.get(0).tie = new music21.tie.Tie('stop');

        s.appendNewDOM();
        assert.equal(
            // @ts-ignore
            s.activeVFRenderer.vfTies[0].notes.first_note.keys[0],
            // @ts-ignore
            s.activeVFRenderer.vfTies[0].notes.last_note.keys[0]
        );
    });

    test('music21.vfShow.Renderer prepareTies across system break', assert => {
        const p = <music21.stream.Part> music21.tinyNotation.TinyNotation('c1 d e~ e');
        const s = new music21.stream.Score();
        s.append(p);
        s.renderOptions.systemPadding = 0;
        s.renderOptions.heightAboveStaff = 10;
        s.renderOptions.heightBelowStaff = 10;
        s.renderOptions.maxSystemWidth = 60;
        s.appendNewDOM();
        const renderer = s.activeVFRenderer;
        assert.equal(renderer.vfTies.length, 2);
    });

    test('music21.vfShow.Renderer.prepareFlat recalculates accidental display', assert => {
        const p = <music21.stream.Part> music21.tinyNotation.TinyNotation('d4 d# d# d#');
        const s = new music21.stream.Score();
        s.append(p);
        s.appendNewDOM();
        const notes_iter = p.recurse().notes;
        const first_note = notes_iter.get(0) as music21.note.Note;
        const second_note = notes_iter.get(1) as music21.note.Note;
        assert.equal(first_note.pitch.accidental, undefined);
        assert.equal(second_note.pitch.accidental.displayStatus, true);

        // D -> D#
        const aug_1 = new music21.interval.Interval('A1');
        first_note.pitch = aug_1.transposePitch(first_note.pitch);
        s.replaceDOM();
        assert.equal(first_note.pitch.accidental.displayStatus, true);
        assert.equal(second_note.pitch.accidental.displayStatus, false);
    });

    test('music21.vfShow.Renderer obeys measure numbers', assert => {
        const p = new music21.stream.Part();
        const m0 = new music21.stream.Measure();
        m0.append(new music21.note.Note('C4'));
        m0.paddingLeft = 3.0;
        p.append(m0);
        for (const n_name of ['D', 'E', 'E']) {
            const m = new music21.stream.Measure();
            const n = new music21.note.Note(n_name + '4');
            n.duration.type = 'whole';
            m.append(n);
            p.append(m);
        }

        const m_iter = p.getElementsByClass('Measure') as StreamIterator<music21.stream.Measure>;
        for (const [i, m] of Array.from(m_iter).entries()) {
            // Renumber the measures so that pickup is m.0
            m.number = i;
            m.renderOptions.showMeasureNumber = true;
        }
        p.appendNewDOM();
        for (const stack of p.activeVFRenderer.stacks) {
            const vf_voice = stack.voices[0];
            const measure_number = (
                stack.voiceToStreamMapping.get(vf_voice) as music21.stream.Measure
            ).number;
            assert.equal(
                // @ts-ignore
                vf_voice.getStave().measure,
                measure_number,
                `measure_number ${measure_number} is correct`,
            );
        }
    });

    test('music21.vfShow.Renderer no left barline on single part', assert => {
        const p = <music21.stream.Part> music21.tinyNotation.TinyNotation('c1 d e f g');
        const s = new music21.stream.Score();
        // Example 1: multipart -- no action on left barlines
        s.repeatAppend(p, 2);
        s.renderOptions.maxSystemWidth = 200;
        s.appendNewDOM();

        const m_iter = s.parts.last().getElementsByClass('Measure') as StreamIterator<music21.stream.Measure>;
        assert.deepEqual(
            m_iter.map(m => m.renderOptions.startNewSystem),
            [true, false, false, true, false],
            'new system breaks before m1 and 4.',
        );
        assert.deepEqual(
            m_iter.map(m => m.renderOptions.leftBarline),
            [undefined, undefined, undefined, undefined, undefined],
            'left barlines are undefined = Normal',
        );

        // Example 2: single part -- left barlines 'none' on new systems
        s.remove(s.parts.first());
        s.appendNewDOM();
        assert.deepEqual(
            m_iter.map(m => m.renderOptions.leftBarline),
            ['none', undefined, undefined, 'none', undefined],
            'left barlines are omitted at the start of systems.'
        );

        // Example 3: single measure left barline 'none'
        const last_m = m_iter.last();
        last_m.createDOM();
        assert.equal(
            last_m.renderOptions.leftBarline,
            'none',
            'single measure has no left barline.',
        );
    });

    test('music21.vfShow.Renderer multiple lyrics', assert => {
        const m = new music21.stream.Measure();
        const n = new music21.note.Note();
        n.lyrics.push(new music21.note.Lyric('first'));
        n.lyrics.push(new music21.note.Lyric('second'));
        m.append(n);
        m.renderOptions.heightBelowStaff = 40;
        m.appendNewDOM();

        assert.equal(n.lyrics.length, 2, 'note has two lyrics');
        // const t1 = m.activeVFRenderer.stacks[0].textVoices[0].getTickables()[0] as VFTextNote;
        // assert.equal(
        //     // Error: Property 'text' does not exist on type 'Tickable'.
        //     // @ts-ignore
        //     t1.text,
        //     'first',
        //     'first lyric is "first".'
        // );
        // const t2 = m.activeVFRenderer.stacks[0].textVoices[1].getTickables()[0] as VFTextNote;
        // assert.equal(
        //     // Error: Property 'text' does not exist on type 'Tickable'.
        //     // @ts-ignore
        //     t2.text,
        //     'second',
        //     'second lyric is "second".'
        // );
    });
}
