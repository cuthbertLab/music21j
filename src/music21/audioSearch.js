/**
 * audioSearch module. See {@link music21.audioSearch} namespace
 *
 * @exports music21/audioSearch
 * @namespace music21.audioSearch
 * @memberof music21
 * @requires music21/pitch
 * @requires music21/common
 */
import * as MIDI from 'midicube';
import * as common from './common.js';

// functions based on the prototype created by Chris Wilson's MIT License version
// and on Jordi Bartolome Guillen's audioSearch module for music21

// TODO(msc): Rewrite as a class -- config is just a class in disguise

// noinspection JSUnresolvedVariable
/**
 *
 * @type {
 *     {
 *     _audioContext: null,
 *     lastCentsDeviationsDetected: [],
 *     sampleBuffer: (Float32Array|null),
 *     maxFrequency: number,
 *     lastPitchesDetected: [],
 *     fftSize: number,
 *     animationFrameCallbackId: number,
 *     AudioContextCaller: *,
 *     currentAnalyser: null,
 *     pitchSmoothingSize: number,
 *     minFrequency: number,
 *     lastPitchClassesDetected: []
 *     }
 * }
 */
export const config = {
    fftSize: 2048,
    AudioContextCaller: window.AudioContext || window.webkitAudioContext,
    _audioContext: null,
    animationFrameCallbackId: -1,
    sampleBuffer: null,
    currentAnalyser: null,
    minFrequency: 55,
    maxFrequency: 1050,
    pitchSmoothingSize: 40,
    lastPitchClassesDetected: [],
    lastPitchesDetected: [],
    lastCentsDeviationsDetected: [],

};

Object.defineProperties(config, {
    audioContext: {
        get: () => {
            if (config._audioContext !== null) {
                return config._audioContext;
            } else {
                // AudioContext should be a singleton, but MIDI reports loaded before it is!
                if (
                    MIDI !== undefined
                    && MIDI.WebAudio !== undefined
                    && MIDI.WebAudio.getContext() !== undefined
                ) {
                    window.globalAudioContext = MIDI.WebAudio.getContext();
                } else if (typeof window.globalAudioContext === 'undefined') {
                    window.globalAudioContext = new config.AudioContextCaller();
                }
                config._audioContext = window.globalAudioContext;
                return config._audioContext;
            }
        },
        set: ac => {
            config._audioContext = ac;
        },
    },
});

/**
 *
 * @function music21.audioSearch.getUserMedia
 * @memberof music21.audioSearch
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
    const n = navigator;
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
    const retValue = sampleCallback(frequencyDetected);
    // callback can be anything.
    // noinspection JSIncompatibleTypesComparison
    if (retValue !== -1) {
        config.animationFrameCallbackId = window.requestAnimationFrame(
            animateLoop
        );
    }
};

export function smoothPitchExtraction(frequency) {
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

export function sampleCallback(frequency) {
    // noinspection JSUnusedLocalSymbols
    const [unused_midiNum, unused_centsOff] = smoothPitchExtraction(
        frequency
    );
}

// from Chris Wilson. Replace with Jordi's
export function autoCorrelate(
    buf,
    sampleRate,
    minFrequency,
    maxFrequency
) {
    const SIZE = buf.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    if (minFrequency === undefined) {
        minFrequency = 0;
    }
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

/**
 *
 * @function midiNumDiffFromFrequency
 * @param {Number} frequency
 * @returns {Array<int>} [miniNumber, centsOff]
 */
export function midiNumDiffFromFrequency(
    frequency
) {
    const midiNumFloat = 12 * (Math.log(frequency / 440) / Math.log(2)) + 69;
    const midiNum = Math.round(midiNumFloat);
    const centsOff = Math.round(100 * (midiNumFloat - midiNum));
    return [midiNum, centsOff];
}
