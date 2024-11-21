"use client"

import { useTheme } from "next-themes"
import { Editor } from "@monaco-editor/react"
import { cn } from "@/lib/utils"

interface MonacoEditorProps {
  value?: string
  onChange?: (value: string) => void
  language?: string
  className?: string
  readOnly?: boolean
}

export function MonacoEditor({
  value = "",
  onChange,
  language = "typescript",
  className,
  readOnly = false,
}: MonacoEditorProps) {
  const { theme } = useTheme()

  const handleEditorChange = (value: string | undefined) => {
    onChange?.(value || "")
  }

  return (
    <div className={cn("relative w-full h-full min-h-[300px]", className)}>
      <Editor
        value={value}
        onChange={handleEditorChange}
        language={language}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly,
          automaticLayout: true,
        }}
      />
    </div>
  )
}
