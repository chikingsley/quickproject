"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCode, FileText, KanbanSquare, PlusIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock projects - in real app, this would come from your backend
const mockProjects = [
  {
    id: "project-1",
    name: "QuickProject",
    description: "Modern project management tool",
    type: "code"
  },
  {
    id: "project-2",
    name: "Documentation",
    description: "Project documentation and guides",
    type: "docs"
  },
  {
    id: "project-3",
    name: "Sprint Board",
    description: "Current sprint tasks and progress",
    type: "kanban"
  }
]

export default function ProjectsPage() {
  const getProjectIcon = (type: string) => {
    switch (type) {
      case "code":
        return FileCode
      case "docs":
        return FileText
      case "kanban":
        return KanbanSquare
      default:
        return FileCode
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Projects</h1>
          <p className="text-muted-foreground">Manage and organize your projects</p>
        </div>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => {
          const Icon = getProjectIcon(project.type)
          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{project.name}</CardTitle>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Last updated 2 days ago</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
