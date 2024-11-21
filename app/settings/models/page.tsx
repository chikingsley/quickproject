"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const models = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "Most capable GPT-4 model, able to do more complex tasks",
    apiKey: "OPENAI_API_KEY",
  },
  {
    id: "claude-2",
    name: "Claude 2",
    provider: "Anthropic",
    description: "Latest version of Claude, with improved coding capabilities",
    apiKey: "ANTHROPIC_API_KEY",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Google's most capable model for text, code, and analysis",
    apiKey: "GOOGLE_API_KEY",
  },
  {
    id: "codellama",
    name: "CodeLlama",
    provider: "Ollama",
    description: "Open source model specialized for code generation",
    apiKey: "No API key needed",
  },
]

const providers = [...new Set(models.map(m => m.provider))]

export default function ModelsPage() {
  const [activeProvider, setActiveProvider] = useState<string>(providers[0])
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})

  const handleSaveKey = (provider: string, key: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: key }))
    // TODO: Securely store API key
    console.log(`Saving API key for ${provider}`)
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Models</h1>
          <p className="text-muted-foreground">
            Configure your AI models and API keys
          </p>
        </div>

        <Tabs value={activeProvider} onValueChange={setActiveProvider}>
          <TabsList>
            {providers.map(provider => (
              <TabsTrigger key={provider} value={provider}>
                {provider}
              </TabsTrigger>
            ))}
          </TabsList>
          {providers.map(provider => (
            <TabsContent key={provider} value={provider}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {models
                  .filter(m => m.provider === provider)
                  .map(model => (
                    <Card key={model.id}>
                      <CardHeader>
                        <CardTitle>{model.name}</CardTitle>
                        <CardDescription>{model.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          <Label htmlFor={`${model.id}-key`}>API Key</Label>
                          <div className="flex gap-2">
                            <Input
                              id={`${model.id}-key`}
                              type="password"
                              placeholder={model.apiKey === "No API key needed" ? "Not required" : "Enter API key"}
                              disabled={model.apiKey === "No API key needed"}
                              value={apiKeys[model.provider] || ""}
                              onChange={e => setApiKeys(prev => ({ ...prev, [model.provider]: e.target.value }))}
                            />
                            <Button
                              variant="secondary"
                              disabled={model.apiKey === "No API key needed"}
                              onClick={() => handleSaveKey(model.provider, apiKeys[model.provider] || "")}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
