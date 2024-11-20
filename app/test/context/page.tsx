"use client"

import { useEffect } from 'react'
import { useContextStore } from '@/lib/context/manager'
import { Project } from '@/lib/context/types'
import { Button } from '@/components/ui/button'
import { useCommandCenter } from '@/components/command-center'

// Mock projects for testing
const mockProjects: Project[] = [
  {
    id: 'doc-1',
    name: 'Product Roadmap',
    type: 'document',
    contexts: {
      document: {
        content: '# Product Roadmap\n\n## Q1 2024\n...',
        format: 'markdown',
        lastCursor: { line: 1, column: 0 }
      }
    },
  },
  {
    id: 'code-1',
    name: 'API Service',
    type: 'code',
    contexts: {
      code: {
        language: 'typescript',
        currentFile: 'src/api/service.ts',
        openFiles: ['src/api/service.ts', 'src/api/types.ts'],
        lastCursor: { line: 42, column: 15 }
      }
    },
  }
]

export default function Page() {
  const { setCurrentProject, currentProject } = useContextStore()
  const { toggleCommandCenter } = useCommandCenter()

  // Helper to format JSON nicely
  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2)
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">QuickProject Context System Test Page</h1>
            <p className="text-xl text-muted-foreground mt-2">
              Test the context-aware command center functionality
            </p>
          </div>
          <Button size="lg" onClick={toggleCommandCenter}>
            Open Command Center
            <kbd className="pointer-events-none ml-2 select-none rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              ⌘K
            </kbd>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Project Switcher</h2>
          <div className="space-y-2">
            {mockProjects.map((project) => (
              <Button
                key={project.id}
                variant={currentProject?.id === project.id ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => setCurrentProject(project)}
              >
                {project.name}
                <span className="ml-2 text-xs text-muted-foreground">
                  ({project.type})
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Current Context</h2>
          {currentProject ? (
            <pre className="p-4 rounded-lg bg-muted font-mono text-sm overflow-auto">
              {formatJSON(currentProject)}
            </pre>
          ) : (
            <p className="text-muted-foreground">No project selected</p>
          )}
        </div>
      </div>
    </div>
  )
}
