"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CodeIcon, FileTextIcon, GitBranchIcon } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export interface ProjectItem {
  id: string
  name: string
  icon: LucideIcon
  url: string
  badge?: React.ReactNode
}

export interface Project {
  id: string
  name: string
  url: string
  items: ProjectItem[]
}

interface NavProjectsProps {
  projects: Project[]
  activeProjectId?: string
  isCollapsed?: boolean
}

export function NavProjects({ projects, activeProjectId, isCollapsed }: NavProjectsProps) {
  const pathname = usePathname()
  const activeProject = projects.find(project => project.id === activeProjectId)

  return (
    <div
      data-collapsed={isCollapsed}
      className="flex-1 overflow-auto py-2 data-[collapsed=true]:py-2"
    >
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <nav className="grid gap-1 p-2">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId
          return (
            <div key={project.id} className="grid gap-1">
              <Link
                href={project.url}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent"
                )}
              >
                {isActive ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                {project.name}
              </Link>
              {isActive && (
                <div
                  data-collapsed={isCollapsed}
                  className="grid gap-1 pl-6 data-[collapsed=true]:py-2"
                >
                  {project.items.map((item, index) => {
                    const Icon = item.icon
                    const link = (
                      <Link
                        key={index}
                        href={item.url}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "h-9 w-full justify-start",
                          isCollapsed && "h-9 w-9 justify-center p-0"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                        {!isCollapsed && (
                          <>
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto">{item.badge}</span>
                            )}
                          </>
                        )}
                      </Link>
                    )

                    if (isCollapsed) {
                      return (
                        <Tooltip key={index} delayDuration={0}>
                          <TooltipTrigger asChild>
                            {link}
                          </TooltipTrigger>
                          <TooltipContent side="right" className="flex items-center gap-4">
                            {item.name}
                            {item.badge}
                          </TooltipContent>
                        </Tooltip>
                      )
                    }

                    return link
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
