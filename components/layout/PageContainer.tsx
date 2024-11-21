"use client"

import * as React from "react"
import { AIPanel } from "@/components/ai/AIPanel"
import { CommandCenter } from "@/components/command-center"

interface PageContainerProps {
  children: React.ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 pb-24">
        {children}
      </div>
      <AIPanel />
      <CommandCenter />
    </div>
  )
}
