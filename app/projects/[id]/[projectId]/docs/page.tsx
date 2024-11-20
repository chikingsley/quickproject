"use client"

import { FileTextIcon } from "lucide-react"

export default function DocsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">Project documentation and guides</p>
      </div>

      {/* Example content - this would be replaced with actual doc viewer */}
      <div className="rounded-lg border">
        <div className="grid gap-4 p-4">
          <div className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-blue-500" />
            <span>Getting Started</span>
          </div>
          <div className="prose max-w-none p-4">
            <h2>Welcome to the Project</h2>
            <p>This is an example documentation page. The actual content will be loaded from markdown files.</p>
            
            <h3>Quick Links</h3>
            <ul>
              <li>Installation Guide</li>
              <li>API Reference</li>
              <li>Contributing Guidelines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
