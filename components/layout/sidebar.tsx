"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  FolderKanban,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Code2,
  FileText,
  GitBranch,
  Building2,
  LogOut,
  GalleryVerticalEnd,
  ChevronsUpDown,
  BadgeCheck,
  AudioWaveform,
  Command,
  Plus,
  User,
  CreditCard,
  Sparkles,
  Bell,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface NavItem {
  title: string
  icon: any
  href: string
  label?: string
}

interface Project {
  id: string
  name: string
  items: {
    id: string
    name: string
    icon: any
    href: string
    label?: string
  }[]
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Projects",
    icon: FolderKanban,
    href: "/projects",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

const projects = [
  {
    id: "quickproject",
    name: "QuickProject",
    items: [
      {
        id: "overview",
        name: "Overview",
        icon: LayoutDashboard,
        href: "/projects/quickproject",
      },
      {
        id: "code",
        name: "Code",
        icon: Code2,
        href: "/projects/quickproject/code",
      },
      {
        id: "docs",
        name: "Documentation",
        icon: FileText,
        href: "/projects/quickproject/docs",
      },
      {
        id: "tasks",
        name: "Tasks",
        icon: GitBranch,
        href: "/projects/quickproject/tasks",
      },
      {
        id: "settings",
        name: "Settings",
        icon: Settings,
        href: "/projects/quickproject/settings",
      },
    ],
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ className, onCollapsedChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isProjectsOpen, setIsProjectsOpen] = useState(true)
  const pathname = usePathname()

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    onCollapsedChange?.(!isCollapsed)
  }

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        "group relative flex flex-col bg-background",
        isCollapsed ? "w-16" : "w-64",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 z-50 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={handleCollapse}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="flex flex-col flex-1">
        {/* Company Branding */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-14 w-full justify-start px-4 data-[state=open]:bg-accent"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <GalleryVerticalEnd className="h-4 w-4 text-primary-foreground" />
                </div>
                {!isCollapsed && (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="font-semibold">Acme Inc</span>
                    <span className="text-xs text-muted-foreground">Enterprise</span>
                  </div>
                )}
                <ChevronsUpDown className="ml-auto size-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel>Switch Team</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <GalleryVerticalEnd className="mr-2 h-4 w-4" />
                <span>Acme Inc</span>
                <BadgeCheck className="ml-auto h-4 w-4 text-primary" />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AudioWaveform className="mr-2 h-4 w-4" />
                <span>Acme Corp</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Command className="mr-2 h-4 w-4" />
                <span>Evil Corp</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              <span>Create Team</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator />

        {/* Main Navigation */}
        <div className="flex flex-col gap-2 p-4">
          {mainNavItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            const navItem = (
              <Button
                key={index}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed ? "px-0" : "px-2",
                  isCollapsed && "justify-center"
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon className={cn(
                    "h-4 w-4 shrink-0",
                    !isCollapsed && "mr-2"
                  )} />
                  {!isCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                  {!isCollapsed && item.label && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {item.label}
                    </span>
                  )}
                </Link>
              </Button>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={index} delayDuration={0}>
                  <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    {item.title}
                    {item.label && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {item.label}
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return navItem
          })}
        </div>

        <Separator />

        {/* Projects */}
        <div className="flex-1 overflow-auto">
          {projects.map((project) => (
            <Collapsible
              key={project.id}
              open={isProjectsOpen && !isCollapsed}
              onOpenChange={setIsProjectsOpen}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between",
                    isCollapsed ? "px-0" : "px-4",
                    isCollapsed && "justify-center"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FolderKanban className={cn(
                      "h-4 w-4 shrink-0",
                      !isCollapsed && "mr-2"
                    )} />
                    {!isCollapsed && (
                      <span className="truncate">{project.name}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                {project.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  const projectItem = (
                    <Button
                      key={item.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isCollapsed ? "px-0" : "px-8",
                        isCollapsed && "justify-center"
                      )}
                      asChild
                    >
                      <Link href={item.href}>
                        <Icon className={cn(
                          "h-4 w-4 shrink-0",
                          !isCollapsed && "mr-2"
                        )} />
                        {!isCollapsed && (
                          <span className="truncate">{item.name}</span>
                        )}
                        {!isCollapsed && item.label && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </Button>
                  )

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.id} delayDuration={0}>
                        <TooltipTrigger asChild>{projectItem}</TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          {item.name}
                          {item.label && (
                            <span className="ml-auto text-xs text-muted-foreground">
                              {item.label}
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return projectItem
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* User Profile */}
        <div className="mt-auto">
          <Separator />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-14 w-full justify-start px-4 data-[state=open]:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatars/01.jpg" alt="User" />
                    <AvatarFallback className="rounded-lg">SP</AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Simon Peacocks</span>
                      <span className="truncate text-xs text-muted-foreground">simon@acme.com</span>
                    </div>
                  )}
                  <ChevronsUpDown className="ml-auto size-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="right"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatars/01.jpg" alt="User" />
                    <AvatarFallback className="rounded-lg">SP</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Simon Peacocks</span>
                    <span className="truncate text-xs text-muted-foreground">simon@acme.com</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Upgrade to Pro</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
