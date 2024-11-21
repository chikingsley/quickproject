"use client"

import * as React from "react"
import { Terminal as TerminalIcon, Maximize2, Minimize2, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTerminal } from "@/hooks/use-terminal"

interface TerminalProps {
  className?: string
}

interface TerminalOutput {
  id: string
  type: "command" | "output" | "error"
  content: string
  timestamp: Date
}

export function Terminal({ className }: TerminalProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [history, setHistory] = React.useState<TerminalOutput[]>([])
  const [currentCommand, setCurrentCommand] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { executeCommand } = useTerminal()

  const addToHistory = (output: Omit<TerminalOutput, "id">) => {
    setHistory(prev => [...prev, { ...output, id: Math.random().toString() }])
  }

  const handleCommand = async (command: string) => {
    addToHistory({
      type: "command",
      content: command,
      timestamp: new Date(),
    })

    if (command === "clear") {
      setHistory([])
      return
    }

    const result = await executeCommand(command)
    
    addToHistory({
      type: result.success ? "output" : "error",
      content: result.output,
      timestamp: new Date(),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentCommand.trim()) return

    handleCommand(currentCommand.trim())
    setCurrentCommand("")
  }

  // Auto-scroll to bottom when new content is added
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  // Focus input on mount and when clicking terminal
  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div
      className={cn(
        "flex flex-col bg-background border rounded-lg shadow-lg",
        isExpanded ? "fixed inset-4 z-50" : "h-64",
        className
      )}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/50">
        <TerminalIcon className="h-4 w-4" />
        <h3 className="text-sm font-medium">Terminal</h3>
        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setHistory([])}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <ScrollArea
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-sm bg-background"
      >
        {history.map((item) => (
          <div
            key={item.id}
            className={cn(
              "whitespace-pre-wrap mb-2",
              item.type === "command" && "text-blue-500",
              item.type === "error" && "text-red-500"
            )}
          >
            {item.type === "command" ? `$ ${item.content}` : item.content}
          </div>
        ))}
      </ScrollArea>

      {/* Command Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            placeholder="Type a command..."
          />
        </div>
      </form>
    </div>
  )
}
