"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor, Smartphone, Tablet } from "lucide-react"

interface CodePreviewProps {
  code?: string
  className?: string
}

export function CodePreview({ code = "", className }: CodePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document

      if (doc) {
        // Basic HTML template with Tailwind
        doc.open()
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { margin: 0; }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="module">
                try {
                  ${code}
                } catch (error) {
                  document.getElementById('root').innerHTML = \`
                    <div class="p-4 text-red-500">
                      <p class="font-bold">Error:</p>
                      <pre class="mt-2 text-sm">\${error.message}</pre>
                    </div>
                  \`
                }
              </script>
            </body>
          </html>
        `)
        doc.close()
        setIsLoading(false)
      }
    }
  }, [code])

  const deviceStyles = {
    desktop: "w-full h-full",
    tablet: "w-[768px] h-[1024px]",
    mobile: "w-[375px] h-[667px]"
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-2 border-b">
        <Tabs value={device} onValueChange={(v) => setDevice(v as typeof device)}>
          <TabsList>
            <TabsTrigger value="desktop">
              <Monitor className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="tablet">
              <Tablet className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="mobile">
              <Smartphone className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (iframeRef.current) {
              const iframe = iframeRef.current
              const doc = iframe.contentDocument || iframe.contentWindow?.document
              if (doc) {
                doc.location.reload()
              }
            }
          }}
        >
          Refresh
        </Button>
      </div>

      <div className="flex-1 overflow-auto bg-background p-4">
        <div className={cn(
          "mx-auto bg-white rounded-lg shadow-sm transition-all duration-200",
          deviceStyles[device],
          isLoading && "animate-pulse"
        )}>
          <iframe
            ref={iframeRef}
            className="w-full h-full rounded-lg"
            sandbox="allow-scripts"
            title="preview"
          />
        </div>
      </div>
    </div>
  )
}
