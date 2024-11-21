"use client"

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
