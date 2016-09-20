import MIDI from 'MIDI';

import { common } from './common';


/**
 * audioSearch module. See {@link music21.audioSearch} namespace
 *
 * @exports music21/audioSearch
 */
/**
 * @namespace music21.audioSearch
 * @memberof music21
 * @requires music21/pitch
 * @requires music21/common
 */

export const audioSearch = {};
// functions based on the prototype created by Chris Wilson's MIT License version
// and on Jordi Bartolome Guillen's audioSearch module for music21

audioSearch.fftSize = 2048;

audioSearch.AudioContextCaller = window.AudioContext || window.webkitAudioContext;
audioSearch._audioContext = null;
audioSearch.animationFrameCallbackId = null;

Object.defineProperties(audioSearch,
        { 'audioContext': {
            'get': () => {
                if (audioSearch._audioContext !== null) {
                    return audioSearch._audioContext;
                } else {
                    // AudioContext should be a singleton...
                    if (MIDI.WebAudio !== undefined && MIDI.WebAudio.getContext() !== undefined) {
                        window.globalAudioContext = MIDI.WebAudio.getContext();
                    } else if (typeof window.globalAudioContext === 'undefined') {
                        window.globalAudioContext = new audioSearch.AudioContextCaller();
                    }
                    audioSearch._audioContext = window.globalAudioContext;
                    return audioSearch._audioContext;
                }
            },
            'set': (ac) => {
                audioSearch._audioContext = ac;
            },
        },
        });


/**
 *
 * @function music21.audioSearch.getUserMedia
 * @memberof music21.audioSearch
 * @param {object} dictionary - optional dictionary to fill
 * @param {function} callback - callback on success
 * @param {function} error - callback on error
 */
audioSearch.getUserMedia = function getUserMedia(dictionary, callback, error) {
    if (error === undefined) {
        /* eslint no-alert: "off"*/
        error = () => { alert('navigator.getUserMedia either not defined (Safari, IE) or denied.'); };
    }
    if (callback === undefined) {
        callback = (mediaStream) => { audioSearch.userMediaStarted(mediaStream); };
    }
    const n = navigator;
    // need to polyfill navigator, or binding problems are hard...
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia;

    if (n.getUserMedia === undefined) {
        error();
    }
    if (dictionary === undefined) {
        dictionary = {
            'audio': {
                'mandatory': {
                },
                'optional': [],
            },
        };
    }
    n.getUserMedia(dictionary, callback, error);
};

audioSearch.sampleBuffer = null;
audioSearch.currentAnalyser = null;

audioSearch.userMediaStarted = function userMediaStarted(audioStream) {
    audioSearch.sampleBuffer = new Float32Array(audioSearch.fftSize / 2);
    const mediaStreamSource = audioSearch.audioContext.createMediaStreamSource(audioStream);
    const analyser = audioSearch.audioContext.createAnalyser();
    analyser.fftSize = audioSearch.fftSize;
    mediaStreamSource.connect(analyser);
    audioSearch.currentAnalyser = analyser;
    audioSearch.animateLoop();
};

audioSearch.minFrequency = 55;
audioSearch.maxFrequency = 1050;
audioSearch.animateLoop = function animateLoop(time) {
    audioSearch.currentAnalyser.getFloatTimeDomainData(audioSearch.sampleBuffer);
    // returns best frequency or -1
    const frequencyDetected = audioSearch.autoCorrelate(
            audioSearch.sampleBuffer,
            audioSearch.audioContext.sampleRate,
            audioSearch.minFrequency,
            audioSearch.maxFrequency);
    const retValue = audioSearch.sampleCallback(frequencyDetected);
    if (retValue !== -1) {
        audioSearch.animationFrameCallbackId = window.requestAnimationFrame(audioSearch.animateLoop);
    }
};

audioSearch.pitchSmoothingSize = 40;
audioSearch.lastPitchClassesDetected = [];
audioSearch.lastPitchesDetected = [];
audioSearch.lastCentsDeviationsDetected = [];

audioSearch.smoothPitchExtraction = function smoothPitchExtraction(frequency) {
    if (frequency === -1) {
        audioSearch.lastPitchClassesDetected.shift();
        audioSearch.lastPitchesDetected.shift();
        audioSearch.lastCentsDeviationsDetected.shift();
    } else {
        const [midiNum, centsOff] = audioSearch.midiNumDiffFromFrequency(frequency);
        if (audioSearch.lastPitchClassesDetected.length > audioSearch.pitchSmoothingSize) {
            audioSearch.lastPitchClassesDetected.shift();
            audioSearch.lastPitchesDetected.shift();
            audioSearch.lastCentsDeviationsDetected.shift();
        }
        audioSearch.lastPitchClassesDetected.push(midiNum % 12);
        audioSearch.lastPitchesDetected.push(midiNum);
        audioSearch.lastCentsDeviationsDetected.push(centsOff);
    }
    const mostCommonPitchClass = common.statisticalMode(audioSearch.lastPitchClassesDetected);
    if (mostCommonPitchClass === null) {
        return [-1, 0];
    }
    const pitchesMatchingClass = [];
    const centsMatchingClass = [];
    for (let i = 0; i < audioSearch.lastPitchClassesDetected.length; i++) {
        if (audioSearch.lastPitchClassesDetected[i] === mostCommonPitchClass) {
            pitchesMatchingClass.push(audioSearch.lastPitchesDetected[i]);
            centsMatchingClass.push(audioSearch.lastCentsDeviationsDetected[i]);
        }
    }
    const mostCommonPitch = common.statisticalMode(pitchesMatchingClass);

    // find cents difference; weighing more recent samples more...
    let totalSamplePoints = 0;
    let totalSample = 0;
    for (let j = 0; j < centsMatchingClass.length; j++) {
        const weight = (Math.pow(j, 2) + 1);
        totalSample += weight * centsMatchingClass[j];
        totalSamplePoints += weight;
    }
    const centsOff = Math.floor(totalSample / totalSamplePoints);
    return [mostCommonPitch, centsOff];
};

audioSearch.sampleCallback = function sampleCallback(frequency) {
    const [unused_midiNum, unused_centsOff] = audioSearch.smoothPitchExtraction(frequency);
};

// from Chris Wilson. Replace with Jordi's
audioSearch.autoCorrelate = function autoCorrelate(buf, sampleRate, minFrequency, maxFrequency) {
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
            correlation += Math.abs((buf[i]) - (buf[i + offset]));
        }
        correlation = 1 - (correlation / MAX_SAMPLES);
        correlations[offset] = correlation; // store it, for the tweaking we need to do below.
        if ((correlation > 0.9) && (correlation > lastCorrelation)) {
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
            const shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset];
            return sampleRate / (best_offset + (8 * shift));
        }
        lastCorrelation = correlation;
    }
    if (best_correlation > 0.01) {
        // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
        return sampleRate / best_offset;
    }
    return -1;
    //  var best_frequency = sampleRate/best_offset;
};

/**
 *
 * @function midiNumDiffFromFrequency
 * @param {Number} frequency
 * @returns {Array<Int>} [miniNumber, centsOff]
 */
audioSearch.midiNumDiffFromFrequency = function midiNumDiffFromFrequency(frequency) {
    const midiNumFloat = (12 * (Math.log(frequency / 440) / Math.log(2))) + 69;
    const midiNum = Math.round(midiNumFloat);
    const centsOff = Math.round(100 * (midiNumFloat - midiNum));
    return [midiNum, centsOff];
};

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

function requestAnimationFramePolyFill() {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
        || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (callback, element) => {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const timeoutId = window.setTimeout(() => callback(currTime + timeToCall), timeToCall);
            lastTime = currTime + timeToCall;
            return timeoutId;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = (id) => {
            clearTimeout(id);
        };
    }
}
requestAnimationFramePolyFill();

