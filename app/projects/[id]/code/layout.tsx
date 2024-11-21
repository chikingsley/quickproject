"use client"

import { useState, useEffect, useLayoutEffect } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { cn } from "@/lib/utils"

// Use a layout effect for panel sizes to prevent flicker
const useBrowserLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Clear any stored panel sizes
if (typeof window !== 'undefined') {
  localStorage.removeItem('mainPanelSize')
  localStorage.removeItem('chatPanelSize')
}

export default function CodeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAIChatOpen, setIsAIChatOpen] = useState(true)
  const [mainSize, setMainSize] = useState(75)
  const [chatSize, setChatSize] = useState(25)

  // Force initial sizes
  useEffect(() => {
    setMainSize(75)
    setChatSize(25)
  }, [])

  const handleResize = (sizes: number[]) => {
    const [newMainSize, newChatSize] = sizes
    if (newChatSize > 30) {
      // Force the chat size to stay under 30%
      setMainSize(70)
      setChatSize(30)
      return
    }
    setMainSize(newMainSize)
    setChatSize(newChatSize)
    localStorage.setItem('mainPanelSize', String(newMainSize))
    localStorage.setItem('chatPanelSize', String(newChatSize))
  }

  // Reset sizes when chat is toggled
  const handleChatToggle = (open: boolean) => {
    setIsAIChatOpen(open)
    if (open) {
      setMainSize(75)
      setChatSize(25)
    }
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <PanelGroup 
        direction="horizontal" 
        onLayout={handleResize}
      >
        {/* Main Code Area */}
        <Panel 
          defaultSize={75}
          minSize={60}
        >
          <div className="h-full w-full overflow-auto">
            {children}
          </div>
        </Panel>

        {/* Resize Handle */}
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

        {/* AI Chat Panel */}
        <Panel 
          defaultSize={25}
          minSize={15}
          maxSize={30}
          className={cn(
            "transition-all duration-300",
            !isAIChatOpen && "hidden"
          )}
        >
          <div className="flex h-full flex-col overflow-hidden border-l">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <h2 className="text-sm font-semibold">AI Assistant</h2>
              <button
                onClick={() => handleChatToggle(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Close AI Chat</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {/* AI Chat Content */}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
