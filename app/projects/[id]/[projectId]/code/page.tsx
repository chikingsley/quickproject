"use client"

import { FileIcon, FolderIcon } from "lucide-react"

export default function CodePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Code Explorer</h1>
        <p className="text-muted-foreground">Browse and manage project files</p>
      </div>

      {/* Example content - this would be replaced with actual file viewer */}
      <div className="rounded-lg border">
        <div className="grid gap-4 p-4">
          <div className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5 text-blue-500" />
            <span>src</span>
          </div>
          <div className="flex items-center gap-2 pl-6">
            <FileIcon className="h-5 w-5 text-gray-500" />
            <span>main.tsx</span>
          </div>
        </div>
      </div>
    </div>
  )
}
