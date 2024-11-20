"use client"

import { usePathname } from "next/navigation"
import { FileIcon, FolderIcon, GitBranchIcon, FileTextIcon, MessagesSquareIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface FileItem {
  name: string
  path: string
  type: "file" | "folder"
  icon?: typeof FileIcon
  children?: FileItem[]
}

interface DocItem {
  title: string
  path: string
  type: "guide" | "reference" | "tutorial"
  children?: DocItem[]
}

// Example project structure
const codeStructure: FileItem[] = [
  {
    name: "src",
    path: "/src",
    type: "folder",
    children: [
      {
        name: "components",
        path: "/src/components",
        type: "folder",
        children: [
          { name: "Button.tsx", path: "/src/components/Button.tsx", type: "file" },
          { name: "Card.tsx", path: "/src/components/Card.tsx", type: "file" },
        ],
      },
      {
        name: "pages",
        path: "/src/pages",
        type: "folder",
        children: [
          { name: "index.tsx", path: "/src/pages/index.tsx", type: "file" },
          { name: "about.tsx", path: "/src/pages/about.tsx", type: "file" },
        ],
      },
    ],
  },
  {
    name: "public",
    path: "/public",
    type: "folder",
    children: [
      { name: "logo.svg", path: "/public/logo.svg", type: "file" },
      { name: "favicon.ico", path: "/public/favicon.ico", type: "file" },
    ],
  },
]

const docsStructure: DocItem[] = [
  {
    title: "Getting Started",
    path: "/getting-started",
    type: "guide",
    children: [
      { title: "Introduction", path: "/getting-started/intro", type: "guide" },
      { title: "Installation", path: "/getting-started/install", type: "guide" },
    ],
  },
  {
    title: "Guides",
    path: "/guides",
    type: "guide",
    children: [
      { title: "Authentication", path: "/guides/auth", type: "guide" },
      { title: "Database", path: "/guides/database", type: "guide" },
    ],
  },
  {
    title: "API Reference",
    path: "/api",
    type: "reference",
    children: [
      { title: "REST API", path: "/api/rest", type: "reference" },
      { title: "GraphQL", path: "/api/graphql", type: "reference" },
    ],
  },
]

const taskStructure = [
  {
    title: "Sprint 1",
    path: "/sprint-1",
    tasks: [
      { title: "Setup Project", status: "completed" },
      { title: "Design System", status: "in-progress" },
    ],
  },
  {
    title: "Sprint 2",
    path: "/sprint-2",
    tasks: [
      { title: "User Authentication", status: "planned" },
      { title: "Dashboard UI", status: "planned" },
    ],
  },
]

function CodeExplorer() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Code Explorer</SidebarGroupLabel>
      <SidebarMenu>
        {codeStructure.map((item) => (
          <FileTreeItem key={item.path} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function DocsExplorer() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Documentation</SidebarGroupLabel>
      <SidebarMenu>
        {docsStructure.map((item) => (
          <DocTreeItem key={item.path} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function TaskExplorer() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tasks</SidebarGroupLabel>
      <SidebarMenu>
        {taskStructure.map((sprint) => (
          <SidebarMenuItem key={sprint.path}>
            <SidebarMenuButton>
              <GitBranchIcon className="h-4 w-4" />
              <span>{sprint.title}</span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              {sprint.tasks.map((task) => (
                <SidebarMenuSubItem key={task.title}>
                  <SidebarMenuSubButton>
                    <span>{task.title}</span>
                    <span className={cn(
                      "ml-auto text-xs",
                      task.status === "completed" && "text-green-500",
                      task.status === "in-progress" && "text-blue-500",
                      task.status === "planned" && "text-gray-500"
                    )}>
                      {task.status}
                    </span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function FileTreeItemContent({ item }: { item: FileItem }) {
  return (
    <>
      {item.type === "folder" ? (
        <FolderIcon className="h-4 w-4" />
      ) : (
        <FileIcon className="h-4 w-4" />
      )}
      <span>{item.name}</span>
    </>
  )
}

function FileTreeItem({ item }: { item: FileItem }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton>
        <FileTreeItemContent item={item} />
      </SidebarMenuButton>
      {item.children && (
        <SidebarMenuSub>
          {item.children.map((child) => (
            <SidebarMenuSubItem key={child.path}>
              <SidebarMenuButton>
                <FileTreeItemContent item={child} />
              </SidebarMenuButton>
              {child.children && (
                <SidebarMenuSub>
                  {child.children.map((grandChild) => (
                    <SidebarMenuSubItem key={grandChild.path}>
                      <SidebarMenuButton>
                        <FileTreeItemContent item={grandChild} />
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  )
}

function DocTreeItemContent({ item }: { item: DocItem }) {
  return (
    <>
      <FileTextIcon className="h-4 w-4" />
      <span>{item.title}</span>
    </>
  )
}

function DocTreeItem({ item }: { item: DocItem }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton>
        <DocTreeItemContent item={item} />
      </SidebarMenuButton>
      {item.children && (
        <SidebarMenuSub>
          {item.children.map((child) => (
            <SidebarMenuSubItem key={child.path}>
              <SidebarMenuButton>
                <DocTreeItemContent item={child} />
              </SidebarMenuButton>
              {child.children && (
                <SidebarMenuSub>
                  {child.children.map((grandChild) => (
                    <SidebarMenuSubItem key={grandChild.path}>
                      <SidebarMenuButton>
                        <DocTreeItemContent item={grandChild} />
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  )
}

export function SecondarySidebar() {
  const pathname = usePathname()
  const segments = pathname.split("/")
  const projectId = segments[2]
  const section = segments[3]

  if (!projectId || !section) {
    return null
  }

  return (
    <aside className="fixed right-0 top-14 hidden h-[calc(100vh-3.5rem)] w-64 border-l bg-background md:flex md:flex-col">
      {section === "code" && <CodeExplorer />}
      {section === "docs" && <DocsExplorer />}
      {section === "tasks" && <TaskExplorer />}
    </aside>
  )
}
