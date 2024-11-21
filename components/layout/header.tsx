"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { ChevronRight, Command, Zap, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCommandCenter } from "@/components/command-center"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function Header({ isSidebarCollapsed, className }: { isSidebarCollapsed?: boolean, className?: string }) {
  const pathname = usePathname()
  const params = useParams()
  const { toggleCommandCenter } = useCommandCenter()
  const { theme, setTheme } = useTheme()

  // Generate breadcrumbs from pathname
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => {
      const href = "/" + array.slice(0, index + 1).join("/")
      // Handle ID segments differently
      const label = segment.startsWith("[") 
        ? params[segment.slice(1, -1)] as string 
        : segment.charAt(0).toUpperCase() + segment.slice(1)
      return { href, label }
    })

  return (
    <header className={cn(
      "fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-2 transition-all duration-200",
              isSidebarCollapsed ? "w-8" : "w-auto"
            )}
          >
            <Zap className="h-5 w-5 text-primary shrink-0" />
            <span className={cn(
              "font-bold transition-all duration-200",
              isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}>
              QuickProject
            </span>
          </Link>

          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm font-medium">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
                )}
                <Link
                  href={crumb.href}
                  className={cn(
                    "text-muted-foreground transition-colors hover:text-foreground",
                    index === breadcrumbs.length - 1 && "text-foreground"
                  )}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 px-0"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 px-0"
            onClick={toggleCommandCenter}
          >
            <Command className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
