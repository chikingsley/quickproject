"use client"

import { create } from 'zustand';
import { useCallback, useEffect, useRef, useState } from 'react';

interface VoiceState {
  status: 'inactive' | 'listening' | 'processing' | 'speaking';
  transcript: string;
  response: string;
  error?: string;
  audioLevel: number;
  startListening: () => Promise<void>;
  stopListening: () => void;
  setError: (error: string | undefined) => void;
}

const useVoiceStore = create<VoiceState>((set) => ({
  status: 'inactive',
  transcript: '',
  response: '',
  error: undefined,
  audioLevel: 0,
  startListening: async () => {
    try {
      set({ status: 'listening', transcript: '', response: '', error: undefined });
    } catch (error) {
      set({ error: 'Failed to start listening', status: 'inactive' });
    }
  },
  stopListening: () => {
    set({ status: 'processing' });
  },
  setError: (error) => set({ error, status: 'inactive' }),
}));

interface VoiceControlProps {
  className?: string;
}

export function VoiceControl({ className }: VoiceControlProps) {
  const { status, transcript, response, error, startListening, stopListening, setError } = useVoiceStore();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  const getMistralResponse = useCallback(async (text: string) => {
    try {
      console.log('Sending request to chat API...');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get AI response');
      }

      const data = await response.json();
      console.log('Received response from chat API');
      return data.text;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }, []);

  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    try {
      // Create form data for the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob);

      console.log('Sending audio to transcription API...');
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to transcribe audio');
      }

      const data = await response.json();
      console.log('Received transcription from API');
      return data.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }, []);

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      useVoiceStore.setState({ status: 'inactive' });
    };
    window.speechSynthesis.speak(utterance);
  }, []);

  const initializeRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioChunksRef.current = [];

          const transcription = await transcribeAudio(audioBlob);
          useVoiceStore.setState({ transcript: transcription });

          if (transcription.trim()) {
            const aiResponse = await getMistralResponse(transcription);
            useVoiceStore.setState({ response: aiResponse, status: 'speaking' });
            speak(aiResponse);
          } else {
            setError('No speech detected. Please try speaking again.');
            useVoiceStore.setState({ status: 'inactive' });
          }
        } catch (error) {
          console.error('Processing error:', error);
          setError('Failed to process audio. Please try again.');
          useVoiceStore.setState({ status: 'inactive' });
        }
      };

      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      console.error('Microphone access error:', error);
      setError('Please grant microphone access to use voice features');
    }
  }, [getMistralResponse, setError, speak, transcribeAudio]);

  useEffect(() => {
    initializeRecording();
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [initializeRecording]);

  const handlePointerDown = async () => {
    setIsPressed(true);
    try {
      await startListening();
      if (mediaRecorderRef.current) {
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
      }
    } catch (error) {
      setError('Failed to start recording');
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
    stopListening();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className={`${className} space-y-4`}>
      {/* Status Indicator */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              status === 'inactive' ? 'bg-gray-400' :
              status === 'listening' ? 'bg-red-500 animate-pulse' :
              status === 'processing' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
          />
          <span className="text-sm font-medium text-gray-700">
            {status === 'inactive' ? 'Ready' :
             status === 'listening' ? 'Listening...' :
             status === 'processing' ? 'Processing...' :
             'Speaking...'}
          </span>
        </div>
        
        {/* Microphone Button */}
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`p-4 rounded-full transition-all ${
            isPressed 
              ? 'bg-red-100 text-red-700 scale-95' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label={status === 'listening' ? 'Stop recording' : 'Start recording'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
            />
          </svg>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Conversation Display */}
      <div className="space-y-4 border border-gray-200 rounded-lg p-4 min-h-[200px] bg-white">
        {transcript && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">You:</p>
            <p className="text-sm text-gray-700">{transcript}</p>
          </div>
        )}

        {response && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-700">Assistant:</p>
            <p className="text-sm text-blue-700">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
