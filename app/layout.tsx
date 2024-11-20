import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { SecondarySidebar } from "@/components/layout/secondary-sidebar"
import { CommandCenter } from "@/components/command-center"
import { SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "QuickProject",
  description: "Modern project management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <SidebarProvider>
          {/* Main Layout Structure */}
          <div className="relative flex min-h-screen">
            {/* Header - Fixed at top */}
            <Header />
            
            {/* Sidebar - Fixed on left */}
            <Sidebar className="fixed left-0 top-14 hidden h-[calc(100vh-3.5rem)] w-64 md:flex" />
            
            {/* Secondary Sidebar - Fixed on right */}
            <SecondarySidebar />
            
            {/* Main Content Area */}
            <main className="flex-1">
              {/* Content wrapper with proper spacing */}
              <div className="min-h-[calc(100vh-3.5rem)] p-6 pt-20 md:mr-64">
                {children}
              </div>
            </main>

            {/* Command Center */}
            <CommandCenter />
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
