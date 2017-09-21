import { audioSearch } from './audioSearch.js';

/**
 * Adopted from Matt Diamond's recorder.js code MIT License
 */
export class Recorder {
    constructor(cfg) {
        const config = cfg || {};
        this.bufferLen = config.bufferLen || 4096;
        this.config = config;
        this.recording = false;
        this.currCallback = undefined;
        this.audioContext = audioSearch.audioContext;
        this.frequencyCanvasInfo = {
            id: 'frequencyAnalyser',
            width: undefined,
            height: undefined,
            canvasContext: undefined,
            animationFrameID: undefined,
        };
        this.waveformCanvasInfo = {
            id: 'waveformCanvas',
            width: undefined,
            height: undefined,
            canvasContext: undefined,
        };
        this.analyserNode = undefined;
    }

    /**
     * Start here -- polyfills navigator, runs getUserMedia and then sends to audioStreamConnected
     */
    initAudio() {
        this.polyfillNavigator();
        navigator.getUserMedia(
            {
                audio: {
                    mandatory: {
                        googEchoCancellation: 'false',
                        googAutoGainControl: 'false',
                        googNoiseSuppression: 'false',
                        googHighpassFilter: 'false',
                        // 'echoCancellation': false,
                        // 'autoGainControl': false,
                        // 'noiseSuppression': false,
                        // 'highpassFilter': false,
                    },
                    optional: [],
                },
            },
            s => this.audioStreamConnected(s),
            error => {
                console.log('Error getting audio -- try on google Chrome?');
                console.log(error);
            }
        );
    }

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
    audioStreamConnected(stream) {
        const inputPoint = this.audioContext.createGain();

        // Create an AudioNode from the stream.
        const audioInput = this.audioContext.createMediaStreamSource(stream);
        audioInput.connect(inputPoint);

        const analyserNode = this.audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        this.analyserNode = analyserNode;
        inputPoint.connect(analyserNode);

        this.connectSource(inputPoint);

        const zeroGain = this.audioContext.createGain();
        zeroGain.gain.value = 0.0;
        inputPoint.connect(zeroGain);
        zeroGain.connect(this.audioContext.destination);
    }

    /**
     * Creates a worker to receive and process all the messages asychronously.
     */
    connectSource(source) {
        this.context = source.context;
        this.setNode();

        // create a Worker with inline code...
        const workerBlob = new Blob(['(', recorderWorkerJs, ')()'], {
            type: 'application/javascript',
        });
        const workerURL = URL.createObjectURL(workerBlob);
        this.worker = new Worker(workerURL);
        /**
         * When worker sends a message, we just send it to the currentCallback...
         */
        this.worker.onmessage = e => {
            const blob = e.data;
            this.currCallback(blob);
        };
        URL.revokeObjectURL(workerURL);

        this.worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate,
            },
        });

        /**
         * Whenever the ScriptProcessorNode receives enough audio to process
         * (i.e., this.bufferLen stereo samples; default 4096), then it calls onaudioprocess
         * which is set up to send the event's .getChannelData to the WebWorker via a
         * postMessage.
         *
         * The 'record' command sends no message back.
         */
        this.node.onaudioprocess = e => {
            if (!this.recording) {
                return;
            }
            this.worker.postMessage({
                command: 'record',
                buffer: [
                    e.inputBuffer.getChannelData(0),
                    e.inputBuffer.getChannelData(1),
                ],
            });
        };

        source.connect(this.node);

        /**
         * polyfill for Chrome error.
         *
         * if the ScriptProcessorNode (this.node) is not connected to an output
         * the "onaudioprocess" event is not triggered in Chrome.
         */
        this.node.connect(this.context.destination);
    }

    /**
     * Creates a ScriptProcessorNode (preferably) to allow for direct audio processing.
     *
     * Sets it to this.node and returns it.
     */
    setNode() {
        const numInputChannels = 2;
        const numOutputChannels = 2;
        if (!this.context.createScriptProcessor) {
            this.node = this.context.createJavaScriptNode(
                this.bufferLen,
                numInputChannels,
                numOutputChannels
            );
        } else {
            this.node = this.context.createScriptProcessor(
                this.bufferLen,
                numInputChannels,
                numOutputChannels
            );
        }
        return this.node;
    }

    /**
     * Configure from another source...
     */
    configure(cfg) {
        for (const prop in cfg) {
            if (Object.hasOwnProperty.call(cfg, prop)) {
                this.config[prop] = cfg[prop];
            }
        }
    }

    record() {
        this.recording = true;
    }
    stop() {
        this.recording = false;
    }
    clear() {
        this.worker.postMessage({ command: 'clear' });
    }

    /**
     * Directly get the buffers from the worker and then call cb.
     */
    getBuffers(cb) {
        this.currCallback = cb || this.config.callback;
        this.worker.postMessage({ command: 'getBuffers' });
    }

    /**
     * call exportWAV or exportMonoWAV on the worker, then call cb or (if undefined) setupDownload.
     */
    exportWAV(cb, type, isMono) {
        let command = 'exportWAV';
        if (isMono === true) {
            // default false
            command = 'exportMonoWAV';
        }
        this.currCallback = cb || this.config.callback;
        type = type || this.config.type || 'audio/wav';
        if (!this.currCallback) {
            this.currCallback = blob => {
                this.setupDownload(
                    blob,
                    'myRecording' + Date.now().toString() + '.wav'
                );
            };
        }
        this.worker.postMessage({
            command,
            type,
        });
    }

    exportMonoWAV(cb, type) {
        this.exportWAV(cb, type, true);
    }

    setupDownload(blob, filename, elementId) {
        elementId = elementId || 'save';
        const url = (window.URL || window.webkitURL).createObjectURL(blob);
        const link = document.getElementById(elementId);
        link.href = url;
        link.download = filename || 'output.wav';
    }

    /**
     * Polyfills for getUserMedia (requestAnimationFrame polyfills not needed.)
     * As of 2016 September, only Edge support unprefixed.
     */
    polyfillNavigator() {
        if (!navigator.getUserMedia) {
            navigator.getUserMedia
                = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        }
        if (window.AnalyserNode && !window.AnalyserNode.prototype.getFloatTimeDomainData) {
            const uint8 = new Uint8Array(2048);
            window.AnalyserNode.prototype.getFloatTimeDomainData = function getFloatTimeDomainData(array) {
                this.getByteTimeDomainData(uint8);
                const imax = array.length;
                for (let i = 0; i < imax; i++) {
                    array[i] = (uint8[i] - 128) * 0.0078125;
                }
            };
        }
    }

    updateAnalysers(time) {
        if (!this.frequencyCanvasInfo.canvasContext) {
            const canvas = document.getElementById(this.frequencyCanvasInfo.id);
            if (!canvas) {
                return;
            }
            this.frequencyCanvasInfo.width = canvas.width;
            this.frequencyCanvasInfo.height = canvas.height;
            this.frequencyCanvasInfo.canvasContext = canvas.getContext('2d');
        }

        // analyser draw code here
        const SPACING = 3;
        const BAR_WIDTH = 1;
        const numBars = Math.round(this.frequencyCanvasInfo.width / SPACING);
        const freqByteData = new Uint8Array(
            this.analyserNode.frequencyBinCount
        );

        this.analyserNode.getByteFrequencyData(freqByteData);

        const canvasContext = this.frequencyCanvasInfo.canvasContext;
        canvasContext.clearRect(
            0,
            0,
            this.frequencyCanvasInfo.width,
            this.frequencyCanvasInfo.height
        );
        canvasContext.fillStyle = '#F6D565';
        canvasContext.lineCap = 'round';
        const multiplier = this.analyserNode.frequencyBinCount / numBars;

        // Draw rectangle for each frequency bin.
        for (let i = 0; i < numBars; ++i) {
            let magnitude = 0;
            const offset = Math.floor(i * multiplier);
            for (let j = 0; j < multiplier; j++) {
                magnitude += freqByteData[offset + j];
            }
            magnitude
                = magnitude
                * (this.frequencyCanvasInfo.height / 256)
                / multiplier;
            canvasContext.fillStyle
                = 'hsl( ' + Math.round(i * 360 / numBars) + ', 100%, 50%)';
            canvasContext.fillRect(
                i * SPACING,
                this.frequencyCanvasInfo.height,
                BAR_WIDTH,
                -1 * magnitude
            );
        }

        this.frequencyCanvasInfo.animationFrameID = window.requestAnimationFrame(
            t => this.updateAnalysers(t)
        );
    }

    drawWaveformCanvas(buffers) {
        const data = buffers[0]; // one track of stereo recording.
        if (!this.waveformCanvasInfo.context) {
            const canvas = document.getElementById(this.waveformCanvasInfo.id);
            if (!canvas) {
                return;
            }
            this.waveformCanvasInfo.width = canvas.width;
            this.waveformCanvasInfo.height = canvas.height;
            this.waveformCanvasInfo.context = canvas.getContext('2d');
        }
        const context = this.waveformCanvasInfo.context;
        const step = Math.ceil(data.length / this.waveformCanvasInfo.width);
        const amp = this.waveformCanvasInfo.height / 2;
        context.fillStyle = 'silver';
        context.clearRect(
            0,
            0,
            this.waveformCanvasInfo.width,
            this.waveformCanvasInfo.height
        );
        for (let i = 0; i < this.waveformCanvasInfo.width; i++) {
            let min = 1.0;
            let max = -1.0;
            for (let j = 0; j < step; j++) {
                const datum = data[i * step + j];
                if (datum < min) {
                    min = datum;
                }
                if (datum > max) {
                    max = datum;
                }
            }
            context.fillRect(
                i,
                (1 + min) * amp,
                1,
                Math.max(1, (max - min) * amp)
            );
        }
    }

    /**
     * set this as a callback from getBuffers.  Returns the source so that a stop() command
     * is possible.
     */
    playBuffers(buffers) {
        const channels = 2;
        const numFrames = buffers[0].length;
        const audioBuffer = this.context.createBuffer(
            channels,
            numFrames,
            this.context.sampleRate
        );
        for (let channel = 0; channel < channels; channel++) {
            const thisChannelBuffer = audioBuffer.getChannelData(channel);
            for (let i = 0; i < numFrames; i++) {
                thisChannelBuffer[i] = buffers[channel][i];
            }
        }
        const source = this.context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.context.destination);
        source.start();
        return source;
    }
}

/**
 * This code does NOT go through babel, so no arrow functions, let, const, etc.
 */
const recorderWorkerJs = `function recorderWorkerJs() {
    /**
     *
     *   Rewritten from Matt Diamond's recorderWorker -- MIT License
     */
    RecorderWorker = function RecorderWorker(parentContext) {
            this.parent = parentContext;
            this.recLength = 0;
            this.recBuffersL = [];
            this.recBuffersR = [];
            this.sampleRate = undefined;
    };
    RecorderWorker.prototype.onmessage = function onmessage(e) {
            switch (e.data.command) {
            case 'init':
                this.init(e.data.config);
                break;
            case 'record':
                this.record(e.data.buffer);
                break;
            case 'exportWAV':
                this.exportWAV(e.data.type);
                break;
            case 'exportMonoWAV':
                this.exportMonoWAV(e.data.type);
                break;
            case 'getBuffers':
                this.getBuffers();
                break;
            case 'clear':
                this.clear();
                break;
            default:
                break;
            }
   };
   RecorderWorker.prototype.postMessage = function postMessage(msg) {
            this.parent.postMessage(msg);
   };

   RecorderWorker.prototype.init = function init(config) {
            this.sampleRate = config.sampleRate;
   };

   RecorderWorker.prototype.record = function record(inputBuffer) {
            var inputBufferL = inputBuffer[0];
            var inputBufferR = inputBuffer[1];
            this.recBuffersL.push(inputBufferL);
            this.recBuffersR.push(inputBufferR);
            this.recLength += inputBufferL.length;
   };

   RecorderWorker.prototype.exportWAV = function exportWAV(type) {
            var bufferL = this.mergeBuffers(this.recBuffersL);
            var bufferR = this.mergeBuffers(this.recBuffersR);
            var interleaved = this.interleave(bufferL, bufferR);
            var dataview = this.encodeWAV(interleaved);
            var audioBlob = new Blob([dataview], { 'type': type });

            this.postMessage(audioBlob);
   };

   RecorderWorker.prototype.exportMonoWAV = function exportMonoWAV(type) {
            var bufferL = this.mergeBuffers(this.recBuffersL);
            var dataview = this.encodeWAV(bufferL);
            var audioBlob = new Blob([dataview], { 'type': type });

            this.postMessage(audioBlob);
   };

   RecorderWorker.prototype.mergeBuffers = function mergeBuffers(recBuffers) {
            var result = new Float32Array(this.recLength);
            var offset = 0;
            for (var i = 0; i < recBuffers.length; i++) {
                result.set(recBuffers[i], offset);
                offset += recBuffers[i].length;
            }
            return result;
    };

    RecorderWorker.prototype.getBuffers = function getBuffers() {
            var buffers = [];
            buffers.push(this.mergeBuffers(this.recBuffersL));
            buffers.push(this.mergeBuffers(this.recBuffersR));
            this.postMessage(buffers);
        };

    RecorderWorker.prototype.clear = function clear() {
            this.recLength = 0;
            this.recBuffersL = [];
            this.recBuffersR = [];
        }

    RecorderWorker.prototype.interleave = function interleave(inputL, inputR) {
            var combinedLength = inputL.length + inputR.length;
            var result = new Float32Array(combinedLength);

            var index = 0;
            var inputIndex = 0;

            while (index < combinedLength) {
                result[index++] = inputL[inputIndex];
                result[index++] = inputR[inputIndex];
                inputIndex++;
            }
            return result;
        }
    RecorderWorker.prototype.encodeWAV = function encodeWAV(samples, mono) {
            var buffer = new ArrayBuffer(44 + (samples.length * 2));
            var view = new DataView(buffer);

            /* RIFF identifier */
            writeString(view, 0, 'RIFF');

            /* file length */
            view.setUint32(4, 32 + samples.length * 2, true);

            /* RIFF type */
            writeString(view, 8, 'WAVE');

            /* format chunk identifier */
            writeString(view, 12, 'fmt ');

            /* format chunk length */
            view.setUint32(16, 16, true);

            /* sample format (raw) */
            view.setUint16(20, 1, true);

            /* channel count */
            view.setUint16(22, mono ? 1 : 2, true);

            /* sample rate */
            view.setUint32(24, this.sampleRate, true);

            /* byte rate (sample rate * block align) */
            view.setUint32(28, this.sampleRate * 4, true);

            /* block align (channel count * bytes per sample) */
            view.setUint16(32, 4, true);

            /* bits per sample */
            view.setUint16(34, 16, true);

            /* data chunk identifier */
            writeString(view, 36, 'data');

            /* data chunk length */
            view.setUint32(40, samples.length * 2, true);

            floatTo16BitPCM(view, 44, samples);

            return view;
        }

    function floatTo16BitPCM(output, offset, input) {
        for (var i = 0; i < input.length; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }

    function writeString(view, offset, string) {
        for (var i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    var recordWorker = new RecorderWorker(this);
    this.onmessage = (function mainOnMessage(e) { recordWorker.onmessage(e) }).bind(this);
}`;

export const audioRecording = { Recorder };
export default audioRecording;
