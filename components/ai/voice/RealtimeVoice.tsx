"use client"

import * as React from "react"
import { create } from "zustand"
import { RealtimeClient } from '@/lib/openai-realtime/client'
import { RealtimeUtils } from '@/lib/openai-realtime/utils'
import { MicrophoneIcon } from '@heroicons/react/24/outline'

interface VoiceSystemStore {
  status: 'inactive' | 'listening' | 'processing' | 'speaking'
  audioLevel: number
  error?: string
  transcript: string
  assistantResponse: string
  client: RealtimeClient | null
  micStream: MediaStream | null
  audioContext: AudioContext | null
  startListening: () => Promise<void>
  stopListening: () => void
  setAudioLevel: (level: number) => void
  setError: (error: string | undefined) => void
  setTranscript: (text: string) => void
  setAssistantResponse: (text: string) => void
}

const useVoiceSystemStore = create<VoiceSystemStore>((set, get) => ({
  status: 'inactive',
  audioLevel: 0,
  error: undefined,
  transcript: '',
  assistantResponse: '',
  client: null,
  micStream: null,
  audioContext: null,

  initialize: async (apiKey: string) => {
    try {
      console.log('Initializing voice system...');
      const client = new RealtimeClient({
        apiKey,
        dangerouslyAllowAPIKeyInBrowser: true,
      });

      // Debug event handlers
      client.on('realtime.event', (event) => {
        console.log('🎯 Realtime event:', JSON.stringify(event, null, 2));
      });

      client.on('conversation.item.appended', (event) => {
        console.log('📝 Item appended:', JSON.stringify(event, null, 2));
        const { item } = event;
        if (item.type === 'message') {
          console.log('Message role:', item.role);
          console.log('Message content:', item.content);
        }
      });

      client.on('conversation.item.completed', (event) => {
        console.log('Item completed:', JSON.stringify(event, null, 2));
      });

      client.on('conversation.interrupted', (event) => {
        console.log('Conversation interrupted:', JSON.stringify(event, null, 2));
      });

      // Set up event handling before connecting
      client.on('conversation.updated', (event) => {
        console.log('🔄 Conversation updated:', JSON.stringify(event, null, 2));
        const { item, delta } = event;
        
        if (delta?.content) {
          // Handle user message updates
          if (item.type === 'message' && item.role === 'user') {
            const textContent = delta.content.find(c => c.type === 'text');
            if (textContent && textContent.text) {
              const currentTranscript = get().transcript || '';
              const newTranscript = currentTranscript + textContent.text;
              console.log('🎤 Setting transcript to:', newTranscript);
              set(state => ({ 
                ...state,
                transcript: newTranscript,
                status: 'listening'
              }));
            }
          }
          
          // Handle assistant responses
          if (item.type === 'message' && item.role === 'assistant') {
            const textContent = delta.content.find(c => c.type === 'text');
            if (textContent && textContent.text) {
              const currentResponse = get().assistantResponse || '';
              const newResponse = currentResponse + textContent.text;
              console.log('🤖 Setting assistant response to:', newResponse);
              set(state => ({ 
                ...state,
                assistantResponse: newResponse,
                status: 'speaking'
              }));
            }
          }
        }
      });

      // Add handler for final transcripts
      client.on('response.audio_transcript.done', (event) => {
        console.log('🎯 Final audio transcript:', event);
        if (event.transcript) {
          console.log('📝 Setting final transcript:', event.transcript);
          set(state => ({
            ...state,
            assistantResponse: event.transcript,
            status: 'speaking'
          }));
        }
      });

      // Configure session
      console.log('Configuring session...');
      await client.updateSession({
        modalities: ['text', 'audio'],
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: { 
          model: 'whisper-1',
          language: 'en'
        },
        output_text: {
          model: 'gpt-4',
          format: 'text'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.3,
          prefix_padding_ms: 500,
          silence_duration_ms: 600
        },
        temperature: 0.7,
        max_response_output_tokens: 4096,
        instructions: "You are a helpful voice assistant. Keep your responses concise and natural.",
      });

      console.log('Connecting to OpenAI...');
      await client.connect();
      console.log('Waiting for session...');
      await client.waitForSessionCreated();

      set({ client });
      console.log('✅ Voice system initialized');

    } catch (error) {
      console.error('❌ Failed to initialize voice system:', error);
      set({ error: 'Failed to initialize voice system' });
    }
  },

  startListening: async () => {
    try {
      const state = get();
      if (!state.client) {
        set({ error: 'Voice system not initialized' });
        return;
      }

      // Reset the conversation state
      console.log('🎤 Starting new recording...');
      set({ 
        transcript: '',
        assistantResponse: '',
        status: 'listening',
        error: undefined 
      });

      console.log('🎙️ Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 24000
        } 
      });
      
      console.log('Setting up audio processing...');
      const audioContext = new AudioContext({ sampleRate: 24000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      const analyzer = audioContext.createAnalyser();
      
      analyzer.fftSize = 256;
      source.connect(analyzer);
      source.connect(processor);
      processor.connect(audioContext.destination);
      
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const audioBuffer = new Int16Array(inputData.length);
        
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          audioBuffer[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        
        try {
          state.client.appendInputAudio(audioBuffer);
        } catch (error) {
          console.error('Error sending audio:', error);
        }
      };
      
      const updateLevel = () => {
        analyzer.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalizedLevel = average / 255;
        set(state => ({ 
          ...state,
          audioLevel: normalizedLevel
        }));
        
        if (get().status === 'listening') {
          requestAnimationFrame(updateLevel);
        }
      };
      
      set(state => ({ 
        ...state,
        status: 'listening', 
        micStream: stream,
        audioContext
      }));
      
      updateLevel();
      console.log('Started listening');
      
    } catch (error) {
      console.error('Could not access microphone:', error);
      set(state => ({ 
        ...state,
        status: 'inactive', 
        error: 'Could not access microphone: ' + (error as Error).message 
      }));
      throw error; // Re-throw to handle in UI
    }
  },

  stopListening: () => {
    const { micStream, audioContext, client } = get();
    
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
    }
    
    if (audioContext) {
      audioContext.close();
    }

    if (client) {
      try {
        console.log('Creating response...');
        client.createResponse();
        set(state => ({ 
          ...state,
          status: 'processing'
        }));
      } catch (error) {
        console.error('Error creating response:', error);
        set(state => ({ 
          ...state,
          error: 'Error creating response: ' + (error as Error).message
        }));
      }
    }
    
    set(state => ({ 
      ...state,
      audioLevel: 0,
      micStream: null,
      audioContext: null
    }));
  },

  setAudioLevel: (level) => set(state => ({ 
    ...state,
    audioLevel: level
  })),
  setError: (error) => set(state => ({ 
    ...state,
    error
  })),
  setTranscript: (text) => set(state => ({ 
    ...state,
    transcript: text
  })),
  setAssistantResponse: (text) => set(state => ({ 
    ...state,
    assistantResponse: text
  }))
}));

interface ConversationDisplayProps {
  className?: string
}

export function ConversationDisplay({ className }: ConversationDisplayProps) {
  const { transcript, assistantResponse } = useVoiceSystemStore();
  
  return (
    <div className={`${className} space-y-4 border border-gray-200 rounded-lg p-4 min-h-[200px] bg-white`}>
      {transcript && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">You:</p>
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}

      {assistantResponse && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-700">Assistant:</p>
          <p className="text-sm text-blue-700">{assistantResponse}</p>
        </div>
      )}
    </div>
  );
}

export function StatusIndicator({ className }: { className?: string }) {
  const { status, error } = useVoiceSystemStore();
  
  return (
    <div className={`${className} flex items-center space-x-2`}>
      <div className={`h-2 w-2 rounded-full ${
        status === 'inactive' ? 'bg-gray-400' :
        status === 'listening' ? 'bg-red-500 animate-pulse' :
        status === 'processing' ? 'bg-yellow-500 animate-pulse' :
        'bg-green-500 animate-pulse'
      }`} />
      <span className="text-sm text-gray-600">
        {status === 'inactive' ? 'Ready' :
         status === 'listening' ? 'Listening...' :
         status === 'processing' ? 'Processing...' :
         'Speaking...'}
      </span>
      
      {error && (
        <div className="ml-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

interface VoiceVisualizerProps {
  className?: string
}

export function VoiceVisualizer({ className }: VoiceVisualizerProps) {
  const { audioLevel } = useVoiceSystemStore();
  
  return (
    <div className={className}>
      <div 
        className="h-1 bg-red-500 rounded transition-all duration-100"
        style={{ 
          width: `${audioLevel * 100}%`,
          opacity: audioLevel > 0 ? 1 : 0
        }}
      />
    </div>
  );
}

interface VoiceControlProps {
  className?: string
  apiKey: string
}

export function VoiceControl({ className, apiKey }: VoiceControlProps) {
  const { initialize, startListening, stopListening, status, error } = useVoiceSystemStore();
  const [isPressed, setIsPressed] = React.useState(false);
  
  React.useEffect(() => {
    console.log('Initializing with API key...');
    initialize(apiKey).catch(error => {
      console.error('Failed to initialize:', error);
    });
  }, [apiKey]);
  
  const handlePointerDown = async () => {
    try {
      setIsPressed(true);
      await startListening();
    } catch (error) {
      console.error('Error starting listening:', error);
      setIsPressed(false);
    }
  };
  
  const handlePointerUp = () => {
    setIsPressed(false);
    stopListening();
  };
  
  return (
    <div className={`${className} space-y-6`}>
      <div className="flex items-center justify-between">
        <StatusIndicator />
        <button
          className={`p-4 rounded-full transition-all ${
            isPressed ? 'bg-red-500 scale-95' : 'bg-blue-500 hover:bg-blue-600'
          } ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          disabled={!!error}
        >
          <MicrophoneIcon className="h-6 w-6 text-white" />
        </button>
      </div>
      
      <VoiceVisualizer className="w-full" />
      <ConversationDisplay className="w-full" />
    </div>
  );
}

export { useVoiceSystemStore };
