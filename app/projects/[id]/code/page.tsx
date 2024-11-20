"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { MonacoEditor } from "@/components/editor/monaco-editor"

// Placeholder for Preview
const Preview = () => (
  <div className="w-full h-full bg-background border rounded-lg p-4">
    <div className="text-sm text-muted-foreground">Preview coming soon...</div>
  </div>
)

export default function CodePage() {
  const params = useParams()
  const [input, setInput] = useState("")
  const [code, setCode] = useState("")
  const [messages, setMessages] = useState<Array<{role: "user" | "assistant", content: string}>>([])

  const handleSend = () => {
    if (!input.trim()) return
    
    setMessages(prev => [...prev, { role: "user", content: input }])
    // TODO: Implement AI response
    setInput("")
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-[200px] rounded-lg border"
      >
        {/* Chat Interface */}
        <ResizablePanel defaultSize={40}>
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={cn(
                    "mb-4 flex",
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[80%]",
                      message.role === "assistant" 
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </ScrollArea>
            
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 text-sm rounded-md border bg-background"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message or command..."
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button size="icon" onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Editor and Preview */}
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="h-full p-4">
                <MonacoEditor
                  value={code}
                  onChange={setCode}
                  language="typescript"
                />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <div className="h-full p-4">
                <Preview />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
