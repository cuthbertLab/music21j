import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const miditools = music21.miditools;

const { test } = QUnit;


// Construct a fake midicube Player whose `data` array mirrors the parsed
// `[[{event}, delta], ...]` shape produced by midicube's Replayer. Only the
// fields read by initialProgramsByChannel need to be populated. AI-assisted.
function makeFakePlayerData(
    events: { channel: number, subtype: string, programNumber?: number }[],
): any {
    return {
        data: events.map(e => [{ event: { type: 'channel', ...e } }, 0]),
    };
}


export default function tests() {
    test('miditools.initialProgramsByChannel: first programChange wins per channel', assert => {
        const player = makeFakePlayerData([
            { channel: 0, subtype: 'programChange', programNumber: 0 },
            { channel: 1, subtype: 'programChange', programNumber: 71 },
            { channel: 0, subtype: 'noteOn' },
            { channel: 1, subtype: 'noteOn' },
            { channel: 1, subtype: 'programChange', programNumber: 24 },
        ]);
        const programs = miditools.initialProgramsByChannel(player);
        assert.equal(programs.size, 2);
        assert.equal(programs.get(0), 0);
        // First programChange on a channel wins even when a later one appears.
        assert.equal(programs.get(1), 71);
    });

    test('miditools.initialProgramsByChannel: channels without programChange are omitted', assert => {
        const player = makeFakePlayerData([
            { channel: 0, subtype: 'noteOn' },
            { channel: 2, subtype: 'programChange', programNumber: 42 },
            { channel: 0, subtype: 'noteOff' },
        ]);
        const programs = miditools.initialProgramsByChannel(player);
        assert.equal(programs.size, 1);
        assert.equal(programs.has(0), false);
        assert.equal(programs.get(2), 42);
    });

    test('miditools.initialProgramsByChannel: empty or missing data returns empty Map', assert => {
        assert.equal(miditools.initialProgramsByChannel(<any> {}).size, 0);
        assert.equal(miditools.initialProgramsByChannel(<any> { data: [] }).size, 0);
        assert.equal(miditools.initialProgramsByChannel(<any> null).size, 0);
    });
}
