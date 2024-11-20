"use client"

import {
  BarChart2,
  Folder,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  Settings,
} from "lucide-react"

import { NavMain, type NavMainItem } from "@/components/nav/nav-main"
import { NavProjects, type Project } from "@/components/nav/nav-projects"
import { NavUser } from "@/components/nav/nav-user"
import { Sidebar } from "@/components/ui/sidebar"

const mainNavItems: NavMainItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart2,
    items: [
      {
        title: "Overview",
        url: "/analytics",
      },
      {
        title: "Reports",
        url: "/analytics/reports",
      },
    ],
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderKanban,
    items: [
      {
        title: "All Projects",
        url: "/projects",
      },
      {
        title: "Active",
        url: "/projects/active",
      },
      {
        title: "Archived",
        url: "/projects/archived",
      },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

const projects: Project[] = [
  {
    name: "QuickProject",
    url: "/projects/quickproject",
    icon: Folder,
  },
  {
    name: "Project X",
    url: "/projects/project-x",
    icon: GitBranch,
  },
]

const user = {
  name: "Simon Peacocks",
  email: "simon@example.com",
  avatar: "/avatars/simon.jpg",
}

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 border-r bg-background" {...props}>
      <NavMain items={mainNavItems} />
      <NavProjects projects={projects} />
      <NavUser user={user} />
    </Sidebar>
  )
}
