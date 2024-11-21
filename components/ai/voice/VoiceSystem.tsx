"use client"

import * as React from "react"
import { create } from "zustand"

interface VoiceSystemStore {
  status: 'inactive' | 'listening' | 'processing'
  audioLevel: number
  error?: string
  startListening: () => Promise<void>
  stopListening: () => void
  setAudioLevel: (level: number) => void
  setError: (error: string | undefined) => void
}

const useVoiceSystemStore = create<VoiceSystemStore>((set) => ({
  status: 'inactive',
  audioLevel: 0,
  error: undefined,
  startListening: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyzer = audioContext.createAnalyser()
      analyzer.fftSize = 256
      source.connect(analyzer)
      
      const dataArray = new Uint8Array(analyzer.frequencyBinCount)
      
      const updateLevel = () => {
        analyzer.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        const normalizedLevel = average / 255
        set({ audioLevel: normalizedLevel })
        
        if (useVoiceSystemStore.getState().status === 'listening') {
          requestAnimationFrame(updateLevel)
        }
      }
      
      set({ status: 'listening', error: undefined })
      updateLevel()
      
    } catch (error) {
      set({ 
        status: 'inactive', 
        error: 'Could not access microphone' 
      })
    }
  },
  stopListening: () => {
    set({ status: 'inactive', audioLevel: 0 })
  },
  setAudioLevel: (level) => set({ audioLevel: level }),
  setError: (error) => set({ error })
}))

interface VoiceVisualizerProps {
  className?: string
}

export function VoiceVisualizer({ className }: VoiceVisualizerProps) {
  const { audioLevel } = useVoiceSystemStore()
  
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
  )
}

export { useVoiceSystemStore }
