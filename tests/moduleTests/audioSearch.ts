import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const audioSearch = music21.audioSearch;

const { test } = QUnit;


export default function tests() {
    test('music21.audioSearch.config.sampleCallback is honored', assert => {
        // Regression: the AMD->ES port (commit 066c88c6) made `animateLoop`
        // bind to the module-local `sampleCallback`, so reassigning the public
        // hook silently no-op'd. `animateLoop` must dispatch through
        // `config.sampleCallback` so external code can override it.
        const config = audioSearch.config;

        const originalCallback = config.sampleCallback;
        const originalAnalyser = config.currentAnalyser;
        const originalBuffer = config.sampleBuffer;
        const originalAudioContext = config.audioContext;
        const originalRAF = window.requestAnimationFrame;

        // Stub the live-audio plumbing so animateLoop can run without a mic.
        config.sampleBuffer = new Float32Array(config.fftSize);
        config.currentAnalyser = <any> {
            getFloatTimeDomainData: (_buf: Float32Array) => {},
        };
        config.audioContext = <any> { sampleRate: 44100 };
        // Prevent animateLoop from scheduling a real next-frame tick.
        window.requestAnimationFrame = (() => 0) as typeof window.requestAnimationFrame;

        let receivedFrequency: number = NaN;
        config.sampleCallback = (frequency: number) => {
            receivedFrequency = frequency;
        };

        try {
            audioSearch.animateLoop();
            assert.ok(
                !Number.isNaN(receivedFrequency),
                'override sampleCallback was invoked by animateLoop'
            );
        } finally {
            config.sampleCallback = originalCallback;
            config.currentAnalyser = originalAnalyser;
            config.sampleBuffer = originalBuffer;
            config.audioContext = originalAudioContext;
            window.requestAnimationFrame = originalRAF;
        }
    });
}
