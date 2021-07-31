declare class _ConfigSingletonCreator {
    fftSize: number;
    AudioContextCaller: any;
    _audioContext: AudioContext;
    animationFrameCallbackId: number;
    sampleBuffer: Float32Array;
    currentAnalyser: any;
    minFrequency: number;
    maxFrequency: number;
    pitchSmoothingSize: number;
    lastPitchClassesDetected: number[];
    lastPitchesDetected: number[];
    lastCentsDeviationsDetected: number[];
    constructor();
    get audioContext(): AudioContext;
    set audioContext(ac: AudioContext);
}
export declare const config: _ConfigSingletonCreator;
/**
 * Note: audioRecording uses the newer getUserMedia routines, so
 * this should be ported to be similar to there.
 *
 * @param {Object} dictionary - optional dictionary to fill
 * @param {function} callback - callback on success
 * @param {function} error - callback on error
 */
export declare function getUserMedia(dictionary: any, callback: any, error: any): void;
export declare function userMediaStarted(audioStream: any): void;
export declare const animateLoop: () => void;
export declare function smoothPitchExtraction(frequency: number): [number, number];
export declare function sampleCallback(frequency: number): number;
export declare function autoCorrelate(buf: any, sampleRate: number, minFrequency?: number, maxFrequency?: number): number;
export declare function midiNumDiffFromFrequency(frequency: number): [number, number];
export {};
//# sourceMappingURL=audioSearch.d.ts.map