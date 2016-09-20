/**
 *
 *   Rewritten from Matt Diamond's recorderWorker -- MIT License
 */
class RecorderWorker {
    constructor(parentContext) {
        this.parent = parentContext;
        this.recLength = 0;
        this.recBuffersL = [];
        this.recBuffersR = [];
        this.sampleRate = undefined;
    }
    onmessage(e) {
        switch(e.data.command){
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
        }        
    }
    postMessage(msg) {
        this.parent.postMessage(msg);
    }
    
    
    init(config) {
        this.sampleRate = config.sampleRate;
    }

    record(inputBuffer) {
        const [inputBufferL, inputBufferR] = inputBuffer;
        this.recBuffersL.push(inputBufferL);
        this.recBuffersR.push(inputBufferR);
        this.recLength += inputBufferL.length;        
    }

    exportWAV(type) {
        const bufferL = this.mergeBuffers(this.recBuffersL);
        const bufferR = this.mergeBuffers(this.recBuffersR);
        const interleaved = this.interleave(bufferL, bufferR);
        const dataview = this.encodeWAV(interleaved);
        const audioBlob = new Blob([dataview], { type: type });

        this.postMessage(audioBlob);        
    }

    exportMonoWAV(type) {
        const bufferL = this.mergeBuffers(this.recBuffersL);
        const dataview = this.encodeWAV(interleaved);
        const audioBlob = new Blob([dataview], { type: type });

        this.postMessage(audioBlob);                
    }

    mergeBuffers(recBuffers) {
        const result = new Float32Array(this.recLength);
        let offset = 0;
        for (let i = 0; i < recBuffers.length; i++){
            result.set(recBuffers[i], offset);
            offset += recBuffers[i].length;
        }
        return result;
    }

    getBuffers() {
        const buffers = [];
        buffers.push(this.mergeBuffers(this.recBuffersL));
        buffers.push(this.mergeBuffers(this.recBuffersR));
        this.postMessage(buffers);        
    }

    interleave(inputL, inputR) {
        const combinedLength = inputL.length + inputR.length;
        const result = new Float32Array(combinedLength);

        let index = 0;
        let inputIndex = 0;

        while (index < combinedLength) {
            result[index++] = inputL[inputIndex];
            result[index++] = inputR[inputIndex];
            inputIndex++;
        }
        return result;
    }
    encodeWAV(samples, mono) {
        const buffer = new ArrayBuffer(44 + (samples.length * 2));
        const view = new DataView(buffer);

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

}

function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset+=2){
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }    
}

function writeString(view, offset, string){
    for (let i = 0; i < string.length; i++){
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

const recordWorker = new RecorderWorker(this);
this.onmessage = e => recordWorker.onmessage(e);
