"use client"

import { CheckCircle2Icon, CircleIcon, GitBranchIcon } from "lucide-react"

export default function TasksPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Project tasks and sprints</p>
      </div>

      {/* Example content - this would be replaced with actual task viewer */}
      <div className="rounded-lg border">
        <div className="grid gap-4 p-4">
          <div className="flex items-center gap-2">
            <GitBranchIcon className="h-5 w-5 text-blue-500" />
            <span className="font-semibold">Sprint 1</span>
          </div>
          
          <div className="space-y-3 pl-6">
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-green-500" />
              <span>Set up project infrastructure</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleIcon className="h-4 w-4 text-gray-500" />
              <span>Implement authentication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
