import { create } from 'zustand'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AIContext {
  activeView?: string
  activeFile?: string
  selection?: string
  recentCommands: string[]
}

interface AIStore {
  messages: Message[]
  context: AIContext
  isStreaming: boolean
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  updateContext: (context: Partial<AIContext>) => void
  setStreaming: (streaming: boolean) => void
  clear: () => void
}

export const useAIStore = create<AIStore>((set) => ({
  messages: [],
  context: {
    recentCommands: []
  },
  isStreaming: false,
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      ...message
    }]
  })),
  
  updateContext: (context) => set((state) => ({
    context: { ...state.context, ...context }
  })),
  
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  
  clear: () => set({ messages: [] })
}))
