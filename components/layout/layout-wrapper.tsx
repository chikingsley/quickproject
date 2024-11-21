"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { CommandIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <TooltipProvider>
      <div className="relative flex min-h-screen">
        {/* Header */}
        <Header 
          isSidebarCollapsed={isSidebarCollapsed}
          className="fixed top-0 z-40 w-full"
        >
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon">
              <CommandIcon className="h-4 w-4" />
            </Button>
          </div>
        </Header>
        
        {/* Sidebar */}
        <Sidebar 
          className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] border-r bg-background transition-all duration-300 ease-in-out" 
          onCollapsedChange={setIsSidebarCollapsed}
        />
        
        {/* Main Content Area */}
        <main className={cn(
          "flex-1 overflow-hidden transition-all duration-300 ease-in-out",
          "pt-14", // Header height
          isSidebarCollapsed ? "md:pl-16" : "md:pl-64" // Sidebar width
        )}>
          <div className="relative h-[calc(100vh-3.5rem)] w-full overflow-auto">
            <div className="container h-full p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
