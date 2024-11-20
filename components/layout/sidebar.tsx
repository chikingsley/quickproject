"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  FolderKanban,
  LayoutDashboard,
  Settings,
  Code2,
  FileText,
  GitBranch,
} from "lucide-react"

import { CreateProjectDialog } from "@/components/project/create-project-dialog"
import { NavMain, type NavMainItem } from "@/components/nav/nav-main"
import { NavProjects, type Project } from "@/components/nav/nav-projects"
import { NavUser } from "@/components/nav/nav-user"
import { cn } from "@/lib/utils"
import { Sidebar as SidebarComponent } from "@/components/ui/sidebar"

// Mock projects - will be replaced with real data
const projects: Project[] = [
  {
    id: "quickproject",
    name: "QuickProject",
    url: "/projects/quickproject",
    items: [
      {
        id: "code",
        name: "Code",
        url: "/projects/quickproject/code",
        icon: Code2,
      },
      {
        id: "docs",
        name: "Documentation",
        url: "/projects/quickproject/docs",
        icon: FileText,
      },
      {
        id: "tasks",
        name: "Tasks",
        url: "/projects/quickproject/tasks",
        icon: GitBranch,
      },
    ],
  },
]

const mainNavItems: NavMainItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

const user = {
  name: "Simon Peacocks",
  email: "simon@example.com",
  avatar: "/avatars/simon.jpg",
  isPro: true,
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [showCreateProject, setShowCreateProject] = useState(false)
  const pathname = usePathname()

  // Update active state based on current path
  const navItems = mainNavItems.map(item => ({
    ...item,
    isActive: pathname === item.url || pathname.startsWith(item.url + '/'),
    isCollapsed: !pathname.startsWith(item.url + '/'),
  }))

  return (
    <>
      <SidebarComponent className={cn("fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 border-r bg-background", className)}>
        <NavMain items={navItems} />
        <NavProjects 
          projects={projects} 
          activeProjectId={pathname.split('/')[2]} 
        />
        <NavUser user={user} />
      </SidebarComponent>
      <CreateProjectDialog 
        open={showCreateProject} 
        onOpenChange={setShowCreateProject} 
      />
    </>
  )
}
