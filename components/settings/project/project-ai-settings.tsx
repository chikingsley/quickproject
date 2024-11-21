"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const AI_MODELS = [
  { id: "mistral", name: "Mistral AI", provider: "Mistral" },
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "claude-2", name: "Claude 2", provider: "Anthropic" },
]

export function ProjectAISettings({ projectId }: { projectId: string }) {
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id)
  const [customPrompt, setCustomPrompt] = useState("")
  const [autoComplete, setAutoComplete] = useState(true)
  const [inlineHints, setInlineHints] = useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Settings</CardTitle>
        <CardDescription>
          Configure AI behavior for this project.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label>Default AI Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Project Prompt */}
        <div className="space-y-2">
          <Label>Custom Project Context</Label>
          <Textarea
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder="Add custom context or instructions for the AI when working with this project..."
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            This context will be included in every AI interaction within this project.
          </p>
        </div>

        {/* Auto-complete */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>AI Auto-complete</Label>
            <p className="text-sm text-muted-foreground">
              Show AI code suggestions as you type
            </p>
          </div>
          <Switch
            checked={autoComplete}
            onCheckedChange={setAutoComplete}
          />
        </div>

        {/* Inline Hints */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Inline AI Hints</Label>
            <p className="text-sm text-muted-foreground">
              Show AI explanations and documentation inline
            </p>
          </div>
          <Switch
            checked={inlineHints}
            onCheckedChange={setInlineHints}
          />
        </div>
      </CardContent>
    </Card>
  )
}
