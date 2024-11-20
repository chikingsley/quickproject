"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileCode, FileText, GitBranchIcon } from "lucide-react"

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const handleTabChange = (value: string) => {
    router.push(`/projects/${projectId}/${value}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Overview</h1>
          <p className="text-muted-foreground">Project ID: {projectId}</p>
        </div>
      </div>

      <Tabs defaultValue="code" className="space-y-4" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="code">
            <FileCode className="mr-2 h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="docs">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <GitBranchIcon className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground p-6">
            <h3 className="text-lg font-semibold mb-2">Code Repository</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Access and manage your project's codebase.
            </p>
            <Button onClick={() => router.push(`/projects/${projectId}/code`)}>
              Open Code Editor
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground p-6">
            <h3 className="text-lg font-semibold mb-2">Project Documents</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View and edit project documentation.
            </p>
            <Button onClick={() => router.push(`/projects/${projectId}/docs`)}>
              Open Documents
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground p-6">
            <h3 className="text-lg font-semibold mb-2">Project Tasks</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage project tasks and track progress.
            </p>
            <Button onClick={() => router.push(`/projects/${projectId}/tasks`)}>
              View Tasks
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
