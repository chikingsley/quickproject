"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export interface NavMainItem {
  title: string
  url: string
  icon: LucideIcon
  badge?: React.ReactNode
  isActive?: boolean
}

interface NavMainProps {
  items: NavMainItem[]
  isCollapsed?: boolean
}

export function NavMain({ items, isCollapsed }: NavMainProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2">
        {items.map((item, index) => {
          const Icon = item.icon
          const link = (
            <Link
              key={index}
              href={item.url}
              className={cn(
                buttonVariants({ variant: item.isActive ? "default" : "ghost", size: "sm" }),
                "h-9 w-full justify-start",
                isCollapsed && "h-9 w-9 justify-center p-0"
              )}
            >
              <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
              {!isCollapsed && (
                <>
                  <span>{item.title}</span>
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
                  {item.title}
                  {item.badge}
                </TooltipContent>
              </Tooltip>
            )
          }

          return link
        })}
      </nav>
    </div>
  )
}
