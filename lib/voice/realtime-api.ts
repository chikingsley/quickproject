import { WebSocket } from 'ws';

export interface RealtimeConfig {
  apiKey: string;
  model?: string;
}

export class RealtimeAPI {
  private ws: WebSocket | null = null;
  private config: RealtimeConfig;

  constructor(config: RealtimeConfig) {
    this.config = {
      model: 'gpt-4o-realtime-preview-2024-10-01',
      ...config
    };
  }

  async connect() {
    const url = `wss://api.openai.com/v1/realtime?model=${this.config.model}`;
    
    this.ws = new WebSocket(url, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    });

    return new Promise((resolve, reject) => {
      if (!this.ws) return reject('WebSocket not initialized');

      this.ws.on('open', () => {
        this.initializeSession();
        resolve(true);
      });

      this.ws.on('error', (error) => {
        reject(error);
      });
    });
  }

  private initializeSession() {
    if (!this.ws) return;
    
    this.ws.send(JSON.stringify({
      type: 'response.create',
      response: {
        modalities: ['text', 'audio'],
        instructions: 'You are a helpful AI assistant.'
      }
    }));
  }

  async sendAudio(audioData: ArrayBuffer) {
    if (!this.ws) throw new Error('WebSocket not connected');
    
    const base64Audio = this.arrayBufferToBase64(audioData);
    
    this.ws.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'audio',
        data: base64Audio
      }
    }));
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  onMessage(callback: (message: any) => void) {
    if (!this.ws) throw new Error('WebSocket not connected');
    
    this.ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      callback(message);
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
