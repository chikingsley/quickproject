import { useCallback } from "react"

interface CommandResult {
  success: boolean
  output: string
}

export function useTerminal() {
  const executeCommand = useCallback(async (command: string): Promise<CommandResult> => {
    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          output: error.message || 'Failed to execute command',
        }
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : 'An error occurred',
      }
    }
  }, [])

  return {
    executeCommand
  }
}
