"use client"

import { Button } from "@/components/ui/button"
import { Command, Zap } from "lucide-react"
import { useCommandCenter } from "@/components/command-center"

export function Header() {
  const { toggleCommandCenter } = useCommandCenter()
  
  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">QuickProject</span>
          </div>
        </div>

        {/* Command Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 sm:h-8 sm:w-fit sm:px-3"
            onClick={toggleCommandCenter}
          >
            <Command className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline-block">Command</span>
            <kbd className="pointer-events-none ml-2 hidden select-none rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-block">
              ⌘K
            </kbd>
          </Button>
        </div>
      </div>
    </header>
  )
}
