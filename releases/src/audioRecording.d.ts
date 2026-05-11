interface RecorderConfig {
    bufferLen?: number;
    callback?: Function;
    type?: string;
}
interface CanvasInfo {
    id: string;
    width: number;
    height: number;
    canvasContext: CanvasRenderingContext2D;
    animationFrameID?: number;
}
/**
 * Adopted from Matt Diamond's recorder.js code MIT License
 */
export declare class Recorder {
    bufferLen: number;
    config: RecorderConfig;
    recording: boolean;
    currCallback: any;
    audioContext: AudioContext;
    frequencyCanvasInfo: CanvasInfo;
    waveformCanvasInfo: CanvasInfo;
    analyserNode: any;
    context: BaseAudioContext;
    worker: Worker;
    node: ScriptProcessorNode;
    constructor(cfg?: RecorderConfig);
    /**
     * Start here -- polyfills navigator, runs getUserMedia and then sends to audioStreamConnected
     */
    initAudio(): void;
    /**
     * After the user has given permission to record, this method is called.
     * It creates a gain point, and then connects the input source to the gain.
     * It connects an analyserNode (fftSize 2048) to the gain.
     *
     * It creates a second gain of 0.0 connected to the destination, so that
     * we're not hearing what we're playing in in an infinite loop (SUCKS to turn this off...)
     *
     * And it calls this.connectSource on the inputPoint so that
     * we can do something with all these wonderful inputs.
     */
    audioStreamConnected(stream: any): void;
    /**
     * Creates a worker to receive and process all the messages asynchronously.
     */
    connectSource(source: GainNode): void;
    /**
     * Creates a ScriptProcessorNode (preferably) to allow for direct audio processing.
     *
     * Sets it to this.node and returns it.
     */
    setNode(): ScriptProcessorNode;
    /**
     * Configure from another source...
     */
    configure(cfg: any): void;
    record(): void;
    stop(): void;
    clear(): void;
    /**
     * Directly get the buffers from the worker and then call cb.
     */
    getBuffers(cb: any): void;
    /**
     * call exportWAV or exportMonoWAV on the worker, then call cb or (if undefined) setupDownload.
     */
    exportWAV(cb: any, type: any, isMono: any): void;
    exportMonoWAV(cb: any, type: any): void;
    setupDownload(blob: any, filename?: string, elementId?: string): void;
    setContextForCanvasInfo(canvasInfo: CanvasInfo): void;
    /**
     * Update the Analysers.
     */
    updateAnalysers(time: number): void;
    drawWaveformCanvas(buffers: number[][]): void;
    /**
     * set this as a callback from getBuffers.  Returns the source so that a stop() command
     * is possible.
     */
    playBuffers(buffers: number[][]): AudioBufferSourceNode;
}
export {};
//# sourceMappingURL=audioRecording.d.ts.map