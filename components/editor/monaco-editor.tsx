"use client"

import { useEffect, useRef } from "react"
import * as monaco from "monaco-editor"
import { useTheme } from "next-themes"
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
  const editorRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor>()

  useEffect(() => {
    if (editorRef.current) {
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: theme === "dark" ? "vs-dark" : "vs",
        minimap: { enabled: true },
        fontSize: 14,
        fontFamily: "var(--font-mono)",
        lineNumbers: "on",
        roundedSelection: true,
        scrollBeyondLastLine: false,
        readOnly,
        automaticLayout: true,
        padding: { top: 16 },
      })

      // Handle changes
      monacoRef.current.onDidChangeModelContent(() => {
        const value = monacoRef.current?.getValue()
        onChange?.(value || "")
      })

      // Handle theme changes
      const updateTheme = () => {
        monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs")
      }

      return () => {
        monacoRef.current?.dispose()
      }
    }
  }, [])

  // Update value when prop changes
  useEffect(() => {
    if (monacoRef.current) {
      const currentValue = monacoRef.current.getValue()
      if (currentValue !== value) {
        monacoRef.current.setValue(value)
      }
    }
  }, [value])

  // Update theme when it changes
  useEffect(() => {
    monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs")
  }, [theme])

  return (
    <div
      ref={editorRef}
      className={cn(
        "w-full h-full min-h-[300px] rounded-lg border bg-background",
        className
      )}
    />
  )
}
