export function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  
  for (let i = 0; i < float32Array.length; i++) {
    const offset = i * 2;
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  
  return buffer;
}

export function concatenateAudioBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);
  const result = new ArrayBuffer(totalLength);
  const view = new Uint8Array(result);
  
  let offset = 0;
  for (const buffer of buffers) {
    view.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }
  
  return result;
}

export function createAudioContext(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

export async function playAudioBuffer(audioContext: AudioContext, buffer: ArrayBuffer) {
  const audioBuffer = await audioContext.decodeAudioData(buffer);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
  return source;
}

export class AudioProcessor {
  private context: AudioContext;
  private processor: ScriptProcessorNode;
  private source: MediaStreamAudioSourceNode | null = null;
  private onData: (buffer: ArrayBuffer) => void;
  
  constructor(onData: (buffer: ArrayBuffer) => void) {
    this.context = createAudioContext();
    this.processor = this.context.createScriptProcessor(4096, 1, 1);
    this.onData = onData;
    
    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBuffer = floatTo16BitPCM(inputData);
      this.onData(pcmBuffer);
    };
  }
  
  async start(stream: MediaStream) {
    this.source = this.context.createMediaStreamSource(stream);
    this.source.connect(this.processor);
    this.processor.connect(this.context.destination);
  }
  
  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    this.processor.disconnect();
  }
}
