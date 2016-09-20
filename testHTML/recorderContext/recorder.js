/**
 * Adopted from Matt Diamond's recorder.js code MIT License
 */
const WORKER_PATH = '/testHTML/recorderContext/recorderWorker.js';
class Recorder {
    constructor(source, cfg) {
        const config = cfg || {};
        const bufferLen = config.bufferLen || 4096;
        this.config = config;
        this.context = source.context;
        this.setNode();
        this.worker = new Worker(config.workerPath || WORKER_PATH);
        this.worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate
            }
        });
        this.recording = false,
        this.currCallback = undefined;
        this.node.onaudioprocess = e => {
            if (!this.recording) {
                return;
            }
            this.worker.postMessage({
                command: 'record',
                buffer: [
                         e.inputBuffer.getChannelData(0),
                         e.inputBuffer.getChannelData(1)
                         ]
            });
        };
        this.worker.onmessage = e => {
            const blob = e.data;
            this.currCallback(blob);
        }

        source.connect(this.node);
        this.node.connect(this.context.destination);   
        // if the script node is not connected to an output 
        // the "onaudioprocess" event is not triggered in chrome.        
    }

    setNode() {
        if (!this.context.createScriptProcessor){
            this.node = this.context.createJavaScriptNode(this.bufferLen, 2, 2);
        } else {
            this.node = this.context.createScriptProcessor(this.bufferLen, 2, 2);
        }
    }
    configure (cfg) {
        for (var prop in cfg){
            if (cfg.hasOwnProperty(prop)){
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
    getBuffers(cb) {
        this.currCallback = cb || this.config.callback;
        this.worker.postMessage({ command: 'getBuffers' })
    }

    exportWAVorMonoWAV(cb, type, isMono) {
        let command = 'exportWAV';
        if (isMono) {
            command = 'exportMonoWAV';
        }
        this.currCallback = cb || this.config.callback;
        type = type || this.config.type || 'audio/wav';
        if (!this.currCallback) {
            this.currCallback = blob => {
                this.setupDownload(blob, "myRecording" + Date.now().toString() + '.wav');
            }
        }
        this.worker.postMessage({
            command: 'exportWAV',
            type: type
        });
    }

    exportWAV(cb, type) {
        this.exportWAVorMonoWAV(cb, type, false);
    }

    exportMonoWAV(cb, type) {
        this.exportWAVorMonoWAV(cv, type, true);
    }

    setupDownload(blob, filename, elementId) {
        elementId = elementId || 'save';
        let url = (window.URL || window.webkitURL).createObjectURL(blob);
        let link = document.getElementById(elementId);
        link.href = url;
        link.download = filename || 'output.wav';
    }
};

function drawBuffer(width, height, context, data) {
    const step = Math.ceil( data.length / width );
    const amp = height / 2;
    context.fillStyle = "silver";
    context.clearRect(0,0,width,height);
    for (let i = 0; i < width; i++){
        let min = 1.0;
        let max = -1.0;
        for (j = 0; j < step; j++) {
            var datum = data[(i * step) + j]; 
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
                Math.max(1, (max-min) * amp)
        );
    }
}

/**
 * FIX!
 * @returns
 */
var audioRecorder;

function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
    // updateAnalysers();
}


function initAudio() {
    /**
     * Polyfills
     */
    if (!navigator.getUserMedia) {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;        
    }
    if (!navigator.cancelAnimationFrame) {
        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;        
    }
    if (!navigator.requestAnimationFrame) {
        navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;        
    }

    navigator.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },
            }, gotStream, function(e) {
                alert('Error getting audio');
                console.log(e);
            });
}

var isRecording = false;
function toggleRecording() {
    if (isRecording) {
        audioRecorder.stop();
    } else {
        audioRecorder.record();
    }
}
function save() {
    audioRecorder.exportWAV();
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();

window.addEventListener('load', initAudio );
