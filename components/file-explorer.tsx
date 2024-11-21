"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, FileIcon, FolderIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface FileNode {
  name: string
  path: string
  type: "file" | "directory"
  children?: FileNode[]
  modifiedTime: number
}

interface FileExplorerProps {
  files: FileNode[]
  onFileSelect: (path: string) => void
  selectedFile?: string
}

const fileTypeIcons: Record<string, JSX.Element> = {
  js: <FileIcon className="h-4 w-4 text-yellow-500" />,
  ts: <FileIcon className="h-4 w-4 text-blue-500" />,
  tsx: <FileIcon className="h-4 w-4 text-blue-600" />,
  jsx: <FileIcon className="h-4 w-4 text-blue-400" />,
  css: <FileIcon className="h-4 w-4 text-purple-500" />,
  html: <FileIcon className="h-4 w-4 text-orange-500" />,
  json: <FileIcon className="h-4 w-4 text-green-500" />,
  md: <FileIcon className="h-4 w-4 text-gray-500" />,
}

function getFileIcon(filename: string) {
  const extension = filename.split('.').pop()?.toLowerCase() || ''
  return fileTypeIcons[extension] || <FileIcon className="h-4 w-4" />
}

export function FileExplorer({ files, onFileSelect, selectedFile }: FileExplorerProps) {
  return (
    <div className="w-64 border-r bg-background">
      <div className="p-2 border-b flex items-center justify-between">
        <h2 className="text-sm font-semibold">Files</h2>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <FileIcon className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-2">
          {files.map((file) => (
            <FileTreeNode
              key={file.path}
              node={file}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function FileTreeNode({ 
  node, 
  depth = 0,
  onFileSelect,
  selectedFile
}: { 
  node: FileNode
  depth?: number
  onFileSelect: (path: string) => void
  selectedFile?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const isDirectory = node.type === "directory"
  const isSelected = selectedFile === node.path

  const button = (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start px-2 gap-2 h-8 hover:bg-muted group",
        isSelected && "bg-muted",
        depth > 0 && "ml-4"
      )}
      onClick={() => {
        if (isDirectory) {
          setIsOpen(!isOpen)
        } else {
          onFileSelect(node.path)
        }
      }}
    >
      {isDirectory ? (
        isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
      ) : (
        getFileIcon(node.name)
      )}
      <span className="truncate flex-1">{node.name}</span>
      {!isDirectory && (
        <Badge 
          variant="outline" 
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {node.name.split('.').pop()?.toUpperCase()}
        </Badge>
      )}
    </Button>
  )

  return (
    <div>
      {isDirectory ? (
        button
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right" align="start">
            <p>{node.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(node.modifiedTime).toLocaleDateString()}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
      {isDirectory && isOpen && node.children?.map((child, index) => (
        <FileTreeNode
          key={child.path}
          node={child}
          depth={depth + 1}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
      ))}
    </div>
  )
}
