export type ProjectType = 'document' | 'code' | 'kanban' | 'mixed'

export interface DocumentContext {
  content: string
  format: 'markdown' | 'rich-text'
  lastCursor?: { line: number; column: number }
  selections?: { start: number; end: number }[]
}

export interface CodeContext {
  language: string
  openFiles: string[]
  activeFile?: string
  terminal?: {
    command?: string
    cwd: string
  }
}

export interface KanbanContext {
  activeColumn?: string
  filter?: {
    tags: string[]
    assignee?: string
    priority?: 'low' | 'medium' | 'high'
  }
  view: 'board' | 'list' | 'calendar'
}

export interface ProjectMetadata {
  created: Date
  lastAccessed: Date
  tags: string[]
  relations: {
    type: 'related' | 'parent' | 'child' | 'reference'
    projectId: string
  }[]
}

export interface Project {
  id: string
  name: string
  type: ProjectType
  contexts: {
    document?: DocumentContext
    code?: CodeContext
    kanban?: KanbanContext
  }
  metadata: ProjectMetadata
}

// Context events that components can subscribe to
export type ContextEvent = 
  | { type: 'context.switch'; projectId: string }
  | { type: 'context.update'; context: Partial<Project> }
  | { type: 'context.save'; automatic: boolean }
