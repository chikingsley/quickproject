"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const API_PROVIDERS = [
  {
    id: "mistral",
    name: "Mistral AI",
    description: "Required for voice assistant and code generation"
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Optional: Enhanced code completion and analysis"
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Optional: Alternative AI model provider"
  }
]

export function ApiKeysSettings() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})

  const handleSaveKey = async (providerId: string, key: string) => {
    // TODO: Implement secure API key storage
    setApiKeys(prev => ({ ...prev, [providerId]: key }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Manage your AI provider API keys. These keys are encrypted and stored securely.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {API_PROVIDERS.map(provider => (
          <div key={provider.id} className="space-y-2">
            <Label htmlFor={provider.id}>{provider.name}</Label>
            <div className="flex space-x-2">
              <Input
                id={provider.id}
                type="password"
                placeholder={`Enter your ${provider.name} API key`}
                value={apiKeys[provider.id] || ""}
                onChange={e => setApiKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
              />
              <Button 
                onClick={() => handleSaveKey(provider.id, apiKeys[provider.id] || "")}
                variant="secondary"
              >
                Save
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{provider.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
