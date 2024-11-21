"use client"

import * as React from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAIStore } from "@/lib/ai/store"

interface AIInputProps {
  className?: string
  onSend?: (message: string) => Promise<void>
}

export function AIInput({ className, onSend }: AIInputProps) {
  const [input, setInput] = React.useState("")
  const { addMessage, setStreaming } = useAIStore()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    if (!input.trim()) return
    
    const message = input.trim()
    setInput("")
    
    addMessage({
      role: 'user',
      content: message
    })
    
    if (onSend) {
      setStreaming(true)
      await onSend(message)
      setStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="pr-12 resize-none"
        rows={1}
      />
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-1.5 h-7 w-7"
        onClick={handleSend}
        disabled={!input.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
