"use client"

import { SecondarySidebar } from "@/components/layout/secondary-sidebar"

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return (
    <div className="relative">
      <SecondarySidebar />
      {children}
    </div>
  )
}
