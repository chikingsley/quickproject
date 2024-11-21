"use client"

import { VoiceControl } from '@/components/ai/voice/SimpleVoice'
import { useState, useEffect } from 'react'

export default function VoiceDemoPage() {
  const [configStatus, setConfigStatus] = useState<{
    hasOpenAIKey: boolean;
    hasMistralKey: boolean;
  } | null>(null);

  useEffect(() => {
    // Check API configuration status
    fetch('/api/config')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to check API configuration');
        }
        return response.json();
      })
      .then(status => {
        setConfigStatus(status);
      })
      .catch(error => {
        console.error('Config check error:', error);
      });
  }, []);

  if (!configStatus) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h1 className="text-xl font-bold text-gray-900">Loading...</h1>
            <p className="text-gray-600">Checking API configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!configStatus.hasMistralKey || !configStatus.hasOpenAIKey) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h1 className="text-xl font-bold text-gray-900">API Keys Required</h1>
            <div className="space-y-4">
              {!configStatus.hasMistralKey && (
                <p className="text-gray-600">
                  Please set your MISTRAL_API_KEY environment variable to use the voice assistant.
                </p>
              )}
              {!configStatus.hasOpenAIKey && (
                <p className="text-gray-600">
                  Please set your OPENAI_API_KEY environment variable to use the voice assistant.
                </p>
              )}
              <p className="text-sm text-gray-500">
                Add these to your .env.local file in the project root.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Voice Assistant Demo</h1>
          <p className="text-gray-600">
            Click and hold the microphone button to start speaking. Release to stop.
          </p>
          <VoiceControl className="mt-6" />
        </div>
      </div>
    </div>
  )
}
