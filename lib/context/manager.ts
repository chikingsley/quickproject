import { create } from 'zustand'
import { Project, ContextEvent } from './types'

interface ContextState {
  currentProject?: Project
  recentProjects: Project[]
  contextHistory: ContextEvent[]
  setCurrentProject: (project: Project) => void
  addToHistory: (event: ContextEvent) => void
  switchContext: (projectId: string) => Promise<void>
}

export const useContextStore = create<ContextState>((set, get) => ({
  currentProject: undefined,
  recentProjects: [],
  contextHistory: [],

  setCurrentProject: (project) => {
    set((state) => ({
      currentProject: project,
      recentProjects: [
        project,
        ...state.recentProjects.filter((p) => p.id !== project.id)
      ].slice(0, 5), // Keep last 5 projects
    }))
  },

  addToHistory: (event) => {
    set((state) => ({
      contextHistory: [event, ...state.contextHistory].slice(0, 100) // Keep last 100 events
    }))
  },

  switchContext: async (projectId) => {
    const { currentProject, addToHistory } = get()
    
    // Save current context if exists
    if (currentProject) {
      addToHistory({ 
        type: 'context.save',
        automatic: true
      })
    }

    // TODO: Load project from backend
    const project = await fetch(`/api/projects/${projectId}`).then(res => res.json())
    
    // Switch to new context
    set({ currentProject: project })
    addToHistory({
      type: 'context.switch',
      projectId
    })
  }
}))

// Hook for components to access context-aware suggestions
export const useContextSuggestions = () => {
  const { currentProject, contextHistory } = useContextStore()

  const getSuggestions = () => {
    if (!currentProject) return []

    // Analyze current context and history to generate suggestions
    const suggestions = []

    // Add suggestions based on project type
    switch (currentProject.type) {
      case 'document':
        suggestions.push(
          { type: 'action', text: 'Export to PDF' },
          { type: 'action', text: 'Share document' }
        )
        break
      case 'code':
        suggestions.push(
          { type: 'action', text: 'Run tests' },
          { type: 'action', text: 'Open terminal' }
        )
        break
      case 'kanban':
        suggestions.push(
          { type: 'action', text: 'Add new card' },
          { type: 'action', text: 'Show my tasks' }
        )
        break
    }

    // Add suggestions based on recent activity
    const recentSwitches = contextHistory
      .filter(event => event.type === 'context.switch')
      .slice(0, 3)

    suggestions.push(
      ...recentSwitches.map(event => ({
        type: 'navigation',
        text: `Switch to project ${event.projectId}`
      }))
    )

    return suggestions
  }

  return { getSuggestions }
}
