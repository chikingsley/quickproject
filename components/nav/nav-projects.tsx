"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CodeIcon, FileTextIcon, GitBranchIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

const projects = [
  {
    id: "quickproject",
    name: "QuickProject",
    sections: [
      { id: "code", name: "Code", icon: CodeIcon },
      { id: "docs", name: "Docs", icon: FileTextIcon },
      { id: "tasks", name: "Tasks", icon: GitBranchIcon },
    ],
  },
  {
    id: "marketing-site",
    name: "Marketing Site",
    sections: [
      { id: "code", name: "Code", icon: CodeIcon },
      { id: "docs", name: "Docs", icon: FileTextIcon },
      { id: "tasks", name: "Tasks", icon: GitBranchIcon },
    ],
  },
]

export function NavProjects() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.id}>
            <SidebarMenuButton>
              <span>{project.name}</span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              {project.sections.map((section) => {
                const href = `/projects/${project.id}/${section.id}`
                const isActive = pathname === href
                return (
                  <SidebarMenuSubItem key={section.id}>
                    <Link href={href} className="w-full">
                      <div className={cn(
                        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded px-2 py-1 text-sm transition-colors hover:bg-accent",
                        isActive && "bg-accent"
                      )}>
                        <section.icon className="h-4 w-4" />
                        <span>{section.name}</span>
                      </div>
                    </Link>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
