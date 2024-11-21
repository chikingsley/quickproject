"use client"

import { useParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Play, Sparkles, Code2, Eye, Terminal as TerminalIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { MonacoEditor } from "@/components/editor/monaco-editor"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileExplorer } from "@/components/file-explorer"
import path from "path"

// Function to detect language from file extension
function detectLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const languageMap: Record<string, string> = {
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".py": "python",
    ".java": "java",
    ".cpp": "cpp",
    ".cs": "csharp",
    ".go": "go",
    ".rs": "rust",
    ".rb": "ruby",
    ".php": "php",
    ".html": "html",
    ".css": "css",
    ".json": "json",
    ".md": "markdown",
  }
  return languageMap[ext] || "plaintext"
}

export default function CodePage() {
  const params = useParams()
  const [code, setCode] = useState("")
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code")
  const [isEditorReady, setIsEditorReady] = useState(false)
  const terminalInputRef = useRef<HTMLInputElement>(null)
  const [files] = useState([
    {
      name: "src",
      path: "/src",
      type: "directory" as const,
      modifiedTime: Date.now(),
      children: [
        {
          name: "main.ts",
          path: "/src/main.ts",
          type: "file" as const,
          modifiedTime: Date.now(),
        },
        {
          name: "utils",
          path: "/src/utils",
          type: "directory" as const,
          modifiedTime: Date.now(),
          children: [
            {
              name: "helpers.ts",
              path: "/src/utils/helpers.ts",
              type: "file" as const,
              modifiedTime: Date.now(),
            }
          ]
        },
        {
          name: "components",
          path: "/src/components",
          type: "directory" as const,
          modifiedTime: Date.now(),
          children: [
            {
              name: "Button.tsx",
              path: "/src/components/Button.tsx",
              type: "file" as const,
              modifiedTime: Date.now(),
            }
          ]
        }
      ]
    },
    {
      name: "package.json",
      path: "/package.json",
      type: "file" as const,
      modifiedTime: Date.now(),
    },
    {
      name: "README.md",
      path: "/README.md",
      type: "file" as const,
      modifiedTime: Date.now(),
    }
  ])

  useEffect(() => {
    setIsEditorReady(true)
  }, [])

  const handleFileSelect = (file: string) => {
    setSelectedFile(file)
  }

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const command = terminalInput.trim()
      if (command) {
        setTerminalHistory(prev => [...prev, `$ ${command}`, `Executed: ${command}`])
        setTerminalInput("")
      }
    }
  }

  const executeCode = () => {
    setTerminalHistory(prev => [...prev, "Executing code...", "Done!"])
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between border-b px-2">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="h-10">
            <TabsTrigger value="code" className="gap-2">
              <Code2 className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex">
        {/* File Explorer */}
        <FileExplorer
          files={files}
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />

        {/* Editor/Preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <div className={cn(
              "absolute inset-0",
              activeTab === "preview" && "hidden"
            )}>
              {isEditorReady && (
                <MonacoEditor
                  value={code}
                  onChange={setCode}
                  language={selectedFile ? detectLanguage(selectedFile) : "plaintext"}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />
              )}
            </div>
            <div className={cn(
              "absolute inset-0",
              activeTab === "code" && "hidden"
            )}>
              <div className="h-full w-full flex items-center justify-center bg-background">
                <div className="text-muted-foreground">
                  Preview will appear here
                </div>
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="h-64 border-t">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className="flex items-center gap-2">
                <TerminalIcon className="h-4 w-4" />
                <h2 className="text-sm font-semibold">Terminal</h2>
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-41px)]">
              <div className="p-4 font-mono text-sm">
                {terminalHistory.map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">$</span>
                  <input
                    ref={terminalInputRef}
                    className="flex-1 bg-transparent outline-none"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={handleTerminalKeyDown}
                    placeholder="Type a command..."
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 p-1 rounded-lg bg-background/80 backdrop-blur border shadow-lg">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={executeCode}
        >
          <Play className="h-4 w-4 mr-2" />
          Run
        </Button>
        <Button size="sm" variant="ghost">
          <Sparkles className="h-4 w-4 mr-2" />
          Format
        </Button>
      </div>
    </div>
  )
}
