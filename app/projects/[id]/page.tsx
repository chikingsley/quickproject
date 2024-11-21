"use client"

import { useParams } from "next/navigation"
import { ProjectOverview } from "@/components/project-overview"

const mockProject = {
  id: "1",
  name: "QuickProject",
  description: "A modern development environment",
  status: "active" as const,
  progress: 65,
  lastUpdated: "2 hours ago",
  team: {
    totalMembers: 5,
    activeNow: 3
  },
  git: {
    branches: 4,
    commits: 156,
    lastCommit: "30 minutes ago"
  },
  tasks: {
    total: 24,
    completed: 18
  },
  alerts: [
    {
      type: "warning" as const,
      message: "Dependencies need updating"
    },
    {
      type: "info" as const,
      message: "New pull request ready for review"
    }
  ]
}

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string

  return (
    <div className="container py-6">
      <ProjectOverview project={mockProject} />
    </div>
  )
}
