"use client"

import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CommandCenter } from "@/components/command-center"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Header />
        <Sidebar />
        <main className="pl-0 md:pl-64 pt-14">
          <div className="container py-6">
            {children}
          </div>
        </main>
        <CommandCenter />
      </div>
    </SidebarProvider>
  )
}
