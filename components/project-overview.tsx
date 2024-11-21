"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, GitBranch, GitCommit, Users, Activity, AlertCircle } from "lucide-react"

interface ProjectOverviewProps {
  project: {
    id: string
    name: string
    description: string
    status: "active" | "completed" | "on-hold"
    progress: number
    lastUpdated: string
    team: {
      totalMembers: number
      activeNow: number
    }
    git: {
      branches: number
      commits: number
      lastCommit: string
    }
    tasks: {
      total: number
      completed: number
    }
    alerts: {
      type: "error" | "warning" | "info"
      message: string
    }[]
  }
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={project.status === "active" ? "default" : project.status === "completed" ? "success" : "secondary"}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Updated {project.lastUpdated}
              </span>
            </div>
            <div className="mt-3">
              <Progress value={project.progress} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">{project.progress}% Complete</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Activity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.team.activeNow}</div>
            <p className="text-xs text-muted-foreground">
              {project.team.totalMembers} team members total
            </p>
            <div className="mt-3">
              <Button variant="outline" size="sm" className="w-full">
                View Team
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Git Activity</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-2xl font-bold">
              <div className="flex items-center space-x-2">
                <GitBranch className="h-4 w-4" />
                <span className="text-sm">{project.git.branches}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GitCommit className="h-4 w-4" />
                <span className="text-sm">{project.git.commits}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last commit {project.git.lastCommit}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.tasks.completed}/{project.tasks.total}</div>
            <p className="text-xs text-muted-foreground">Tasks completed</p>
            <div className="mt-3">
              <Progress 
                value={(project.tasks.completed / project.tasks.total) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {project.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <CardDescription>Recent project alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {project.alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 rounded-lg border p-3"
                >
                  <AlertCircle className={
                    alert.type === "error" ? "text-red-500" :
                    alert.type === "warning" ? "text-yellow-500" :
                    "text-blue-500"
                  } />
                  <p className="text-sm">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
