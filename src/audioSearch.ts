/**
 * audioSearch module. See music21.audioSearch namespace
 */
import * as MIDI from 'midicube';
import * as common from './common';

// functions based on the prototype created by Chris Wilson's MIT License version
// and on Jordi Bartolome Guillen's audioSearch module for music21

// TODO(msc): Rewrite as a class -- config is just a class in disguise

class _ConfigSingletonCreator {
    fftSize: number = 2048;
    AudioContextCaller: any;
    _audioContext: AudioContext = null;
    animationFrameCallbackId: number =-1;
    sampleBuffer: Float32Array = null;
    currentAnalyser;
    minFrequency: number = 55;
    maxFrequency: number =1050;
    pitchSmoothingSize: number =40;
    lastPitchClassesDetected: number[] = [];
    lastPitchesDetected: number[] = [];
    lastCentsDeviationsDetected: number[] = [];

    constructor() {
        this.AudioContextCaller = window.AudioContext || (<any> window).webkitAudioContext;
    }

    get audioContext() {
        if (this._audioContext !== null) {
            return this._audioContext;
        } else {
            // AudioContext should be a singleton, but MIDI reports loaded before it is!
            if (
                MIDI !== undefined
                && MIDI.WebAudio !== undefined
                && MIDI.WebAudio.getContext() !== undefined
            ) {
                (<any> window).globalAudioContext = MIDI.WebAudio.getContext();
            } else if (typeof (<any> window).globalAudioContext === 'undefined') {
                (<any> window).globalAudioContext = new this.AudioContextCaller();
            }
            this._audioContext = (<any> window).globalAudioContext;
            return this._audioContext;
        }
    }

    set audioContext(ac: AudioContext) {
        this._audioContext = ac;
    }
}

export const config = new _ConfigSingletonCreator();

/**
 * Note: audioRecording uses the newer getUserMedia routines, so
 * this should be ported to be similar to there.
 *
 * @param {Object} dictionary - optional dictionary to fill
 * @param {function} callback - callback on success
 * @param {function} error - callback on error
 */
export function getUserMedia(dictionary, callback, error) {
    if (error === undefined) {
        /* eslint no-alert: "off"*/
        error = () => {
            alert(
                'navigator.getUserMedia either not defined (Safari, IE) or denied.'
            );
        };
    }
    if (callback === undefined) {
        callback = mediaStream => {
            userMediaStarted(mediaStream);
        };
    }
    const n = <any> navigator;
    // need to polyfill navigator, or binding problems are hard...
    // noinspection JSUnresolvedVariable
    n.getUserMedia
        = n.getUserMedia
        || n.webkitGetUserMedia
        || n.mozGetUserMedia
        || n.msGetUserMedia;

    if (n.getUserMedia === undefined) {
        error();
    }
    if (dictionary === undefined) {
        dictionary = {
            audio: {
                mandatory: {},
                optional: [],
            },
        };
    }
    n.getUserMedia(dictionary, callback, error);
}

export function userMediaStarted(audioStream) {
    /**
     * This function which patches Safari requires some time to get started
     * so we call it on object creation.
     */
    config.sampleBuffer = new Float32Array(config.fftSize / 2);
    const mediaStreamSource = config.audioContext.createMediaStreamSource(
        audioStream
    );
    const analyser = config.audioContext.createAnalyser();
    analyser.fftSize = config.fftSize;
    mediaStreamSource.connect(analyser);
    config.currentAnalyser = analyser;
    animateLoop();
}

export const animateLoop = () => {
    config.currentAnalyser.getFloatTimeDomainData(
        config.sampleBuffer
    );
    // returns best frequency or -1
    const frequencyDetected = autoCorrelate(
        config.sampleBuffer,
        config.audioContext.sampleRate,
        config.minFrequency,
        config.maxFrequency
    );
    const retValue = <number> sampleCallback(frequencyDetected);
    // callback can be anything.
    // noinspection JSIncompatibleTypesComparison
    if (retValue !== -1) {
        config.animationFrameCallbackId = window.requestAnimationFrame(
            animateLoop
        );
    }
};

export function smoothPitchExtraction(frequency: number): [number, number] {
    if (frequency === -1) {
        config.lastPitchClassesDetected.shift();
        config.lastPitchesDetected.shift();
        config.lastCentsDeviationsDetected.shift();
    } else {
        const [midiNum, centsOff] = midiNumDiffFromFrequency(
            frequency
        );
        if (
            config.lastPitchClassesDetected.length
            > config.pitchSmoothingSize
        ) {
            config.lastPitchClassesDetected.shift();
            config.lastPitchesDetected.shift();
            config.lastCentsDeviationsDetected.shift();
        }
        config.lastPitchClassesDetected.push(midiNum % 12);
        config.lastPitchesDetected.push(midiNum);
        config.lastCentsDeviationsDetected.push(centsOff);
    }
    const mostCommonPitchClass = common.statisticalMode(
        config.lastPitchClassesDetected
    );
    if (mostCommonPitchClass === null) {
        return [-1, 0];
    }
    const pitchesMatchingClass = [];
    const centsMatchingClass = [];
    for (let i = 0; i < config.lastPitchClassesDetected.length; i++) {
        if (config.lastPitchClassesDetected[i] === mostCommonPitchClass) {
            pitchesMatchingClass.push(config.lastPitchesDetected[i]);
            centsMatchingClass.push(config.lastCentsDeviationsDetected[i]);
        }
    }
    const mostCommonPitch = common.statisticalMode(pitchesMatchingClass);

    // find cents difference; weighing more recent samples more...
    let totalSamplePoints = 0;
    let totalSample = 0;
    for (let j = 0; j < centsMatchingClass.length; j++) {
        const weight = (j ** 2) + 1;
        totalSample += weight * centsMatchingClass[j];
        totalSamplePoints += weight;
    }
    const centsOff = Math.floor(totalSample / totalSamplePoints);
    return [mostCommonPitch, centsOff];
}

export function sampleCallback(frequency: number): number {
    // noinspection JSUnusedLocalSymbols
    const [unused_midiNum, unused_centsOff] = smoothPitchExtraction(
        frequency
    );
    return 0;
}

// from Chris Wilson. Replace with Jordi's
export function autoCorrelate(
    buf,
    sampleRate: number,
    minFrequency: number = 0,
    maxFrequency: number = undefined,
) {
    const SIZE = buf.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    if (maxFrequency === undefined) {
        maxFrequency = sampleRate;
    }

    let best_offset = -1;
    let best_correlation = 0;
    let rms = 0;
    let foundGoodCorrelation = false;
    const correlations = new Array(MAX_SAMPLES);

    for (let i = 0; i < SIZE; i++) {
        const val = buf[i];
        rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) {
        return -1;
    } // not enough signal

    let lastCorrelation = 1;
    for (let offset = 0; offset < MAX_SAMPLES; offset++) {
        let correlation = 0;
        const offsetFrequency = sampleRate / offset;
        if (offsetFrequency < minFrequency) {
            break;
        }
        if (offsetFrequency > maxFrequency) {
            continue;
        }

        for (let i = 0; i < MAX_SAMPLES; i++) {
            correlation += Math.abs(buf[i] - buf[i + offset]);
        }
        correlation = 1 - correlation / MAX_SAMPLES;
        correlations[offset] = correlation; // store it, for the tweaking we need to do below.
        if (correlation > 0.9 && correlation > lastCorrelation) {
            foundGoodCorrelation = true;
            if (correlation > best_correlation) {
                best_correlation = correlation;
                best_offset = offset;
            }
        } else if (foundGoodCorrelation) {
            // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
            // Now we need to tweak the offset - by interpolating between the values to the left and right of the
            // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
            // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
            // (anti-aliased) offset.

            // we know best_offset >=1,
            // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
            // we can't drop into this clause until the following pass (else if).
            const shift
                = (correlations[best_offset + 1]
                    - correlations[best_offset - 1])
                / correlations[best_offset];
            return sampleRate / (best_offset + 8 * shift);
        }
        lastCorrelation = correlation;
    }
    if (best_correlation > 0.01) {
        // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
        return sampleRate / best_offset;
    }
    return -1;
    //  var best_frequency = sampleRate/best_offset;
}

export function midiNumDiffFromFrequency(
    frequency: number
): [number, number] {
    const midiNumFloat = 12 * (Math.log2(frequency / 440)) + 69;
    const midiNum = Math.round(midiNumFloat);
    const centsOff = Math.round(100 * (midiNumFloat - midiNum));
    return [midiNum, centsOff];
}
