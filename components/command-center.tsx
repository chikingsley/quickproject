"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  MessageSquare, 
  Search, 
  Command as CommandIcon,
  Sparkles,
  X,
  Plus,
  FolderKanban,
  FileSearch,
  Calendar,
  Settings,
  User,
  CreditCard
} from "lucide-react"

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { create } from "zustand"
import { useContextStore, useContextSuggestions } from "@/lib/context/manager"

interface CommandCenterStore {
  isExpanded: boolean
  toggleExpanded: () => void
  setExpanded: (expanded: boolean) => void
}

const useCommandCenterStore = create<CommandCenterStore>((set) => ({
  isExpanded: false,
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  setExpanded: (expanded) => set({ isExpanded: expanded }),
}))

// Hook for other components to control the command center
export const useCommandCenter = () => {
  const toggleCommandCenter = useCommandCenterStore((state) => state.toggleExpanded)
  return { toggleCommandCenter }
}

type CommandMode = 'command' | 'chat' | 'search' | 'navigate'

interface CommandCenterProps {
  className?: string
}

export function CommandCenter({ className }: CommandCenterProps) {
  const { isExpanded, setExpanded } = useCommandCenterStore()
  const [mode, setMode] = React.useState<CommandMode>('command')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { currentProject } = useContextStore()
  const { getSuggestions } = useContextSuggestions()

  // Toggle expansion with ⌘K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setExpanded(!isExpanded)
        if (!isExpanded) {
          inputRef.current?.focus()
        }
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isExpanded, setExpanded])

  const getPlaceholder = () => {
    switch (mode) {
      case 'chat':
        return 'Chat with your project assistant...'
      case 'search':
        return 'Search across all projects...'
      case 'navigate':
        return 'Go to...'
      default:
        return currentProject 
          ? `Commands for ${currentProject.name}...`
          : 'Type a command...'
    }
  }

  const getIcon = () => {
    switch (mode) {
      case 'chat':
        return <MessageSquare className="h-5 w-5" />
      case 'search':
        return <Search className="h-5 w-5" />
      case 'navigate':
        return <CommandIcon className="h-5 w-5" />
      default:
        return <Sparkles className="h-5 w-5" />
    }
  }

  const runCommand = React.useCallback((command: () => void) => {
    setExpanded(false)
    command()
  }, [setExpanded])

  const contextSuggestions = React.useMemo(() => getSuggestions(), [currentProject])

  return (
    <motion.div
      initial={false}
      animate={{
        y: isExpanded ? 0 : '100%',
        opacity: isExpanded ? 1 : 0.5,
      }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4",
        className
      )}
    >
      <div className="w-full max-w-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <Command className="rounded-lg border shadow-2xl">
          <div className="flex items-center border-b px-3">
            {getIcon()}
            <CommandInput 
              ref={inputRef}
              placeholder={getPlaceholder()}
              className="ml-2"
            />
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  mode === 'command' && "bg-accent"
                )}
                onClick={() => setMode('command')}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  mode === 'chat' && "bg-accent"
                )}
                onClick={() => setMode('chat')}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  mode === 'search' && "bg-accent"
                )}
                onClick={() => setMode('search')}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  mode === 'navigate' && "bg-accent"
                )}
                onClick={() => setMode('navigate')}
              >
                <CommandIcon className="h-4 w-4" />
              </Button>
              <CommandSeparator orientation="vertical" className="mx-2 h-8" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setExpanded(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {mode === 'command' && (
              <>
                {currentProject && (
                  <>
                    <CommandGroup heading="Context-Aware Suggestions">
                      {contextSuggestions.map((suggestion, index) => (
                        <CommandItem 
                          key={index}
                          onSelect={() => runCommand(() => {
                            // TODO: Handle context-aware actions
                            console.log('Running suggestion:', suggestion)
                          })}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          <span>{suggestion.text}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator className="my-2" />
                  </>
                )}
                <CommandGroup heading="Quick Actions">
                  <CommandItem onSelect={() => runCommand(() => window.location.href = "/projects/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Create New Project</span>
                    <CommandShortcut>⌘N</CommandShortcut>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => window.location.href = "/projects")}>
                    <FolderKanban className="mr-2 h-4 w-4" />
                    <span>View All Projects</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => window.location.href = "/search")}>
                    <FileSearch className="mr-2 h-4 w-4" />
                    <span>Search Projects</span>
                    <CommandShortcut>⌘F</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator className="my-2" />
                <CommandGroup heading="Navigation">
                  <CommandItem onSelect={() => runCommand(() => window.location.href = "/")}>
                    <CommandIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => window.location.href = "/calendar")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Calendar</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => window.location.href = "/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    <CommandShortcut>⌘,</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator className="my-2" />
                <CommandGroup heading="Profile">
                  <CommandItem onSelect={() => runCommand(() => window.location.href = "/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => window.location.href = "/billing")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
            {mode === 'chat' && (
              <div className="p-4 text-sm text-muted-foreground">
                Chat interface coming soon...
              </div>
            )}
          </CommandList>
        </Command>
      </div>
    </motion.div>
  )
}
