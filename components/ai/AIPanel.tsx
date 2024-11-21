"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Bot, X, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { create } from "zustand"
import { useCommandCenter } from "../command-center"
import { VoiceVisualizer, useVoiceSystemStore } from "./voice/VoiceSystem"
import { useAIStore } from "@/lib/ai/store"
import { AIInput } from "./AIInput"

interface AIPanelStore {
  mode: 'collapsed' | 'expanded'
  status: 'idle' | 'listening' | 'processing' | 'responding'
  toggleMode: () => void
  setStatus: (status: AIPanelStore['status']) => void
}

const useAIPanelStore = create<AIPanelStore>((set) => ({
  mode: 'collapsed',
  status: 'idle',
  toggleMode: () => set((state) => ({ 
    mode: state.mode === 'collapsed' ? 'expanded' : 'collapsed' 
  })),
  setStatus: (status) => set({ status })
}))

interface AIPanelProps {
  className?: string
}

export function AIPanel({ className }: AIPanelProps) {
  const { mode, status, toggleMode, setStatus } = useAIPanelStore()
  const { toggleCommandCenter } = useCommandCenter()
  const { startListening, stopListening, status: voiceStatus } = useVoiceSystemStore()
  const { messages, isStreaming, addMessage } = useAIStore()
  
  // Handle keyboard shortcuts
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode === 'expanded') {
        e.preventDefault()
        toggleMode()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [mode, toggleMode])

  // Handle voice button click
  const handleVoiceClick = async () => {
    if (voiceStatus === 'inactive') {
      await startListening()
      setStatus('listening')
    } else {
      stopListening()
      setStatus('idle')
    }
  }

  const handleSendMessage = async (message: string) => {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: message }]
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      const data = await response.json()
      addMessage({
        role: 'assistant',
        content: data.content
      })
    } catch (error) {
      console.error('Error sending message:', error)
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message.'
      })
    }
  }

  const panelHeight = mode === 'collapsed' ? 'h-12' : 'h-96'
  
  return (
    <motion.div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t",
        "transition-all duration-300 ease-in-out",
        panelHeight,
        className
      )}
      initial={false}
      animate={{ 
        height: mode === 'collapsed' ? 48 : 384,
        opacity: 1 
      }}
    >
      {/* Collapsed View */}
      {mode === 'collapsed' && (
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              AI Assistant
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceClick}
              className={cn(
                "transition-colors",
                voiceStatus === 'listening' && "text-red-500"
              )}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMode}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Expanded View */}
      {mode === 'expanded' && (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-12 border-b">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                AI Assistant
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceClick}
                className={cn(
                  "transition-colors",
                  voiceStatus === 'listening' && "text-red-500"
                )}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCommandCenter()}
              >
                <span className="text-xs mr-1">⌘</span>
                <span className="text-xs">K</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMode}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "mb-4 p-3 rounded-lg",
                  message.role === 'assistant' 
                    ? "bg-muted" 
                    : "bg-primary/10"
                )}
              >
                {message.content}
              </div>
            ))}
            {isStreaming && (
              <div className="animate-pulse">
                Thinking...
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <VoiceVisualizer className="mb-2" />
            <AIInput onSend={handleSendMessage} />
          </div>
        </div>
      )}
    </motion.div>
  )
}
