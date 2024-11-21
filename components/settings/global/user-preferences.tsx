"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const THEMES = ["system", "light", "dark"]
const EDITOR_THEMES = ["vs-dark", "vs-light", "github-dark", "github-light"]

export function UserPreferences() {
  const [theme, setTheme] = useState("system")
  const [editorTheme, setEditorTheme] = useState("vs-dark")
  const [autoSave, setAutoSave] = useState(true)
  const [telemetry, setTelemetry] = useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Preferences</CardTitle>
        <CardDescription>
          Customize your experience across all projects.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {THEMES.map(t => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Editor Theme */}
        <div className="space-y-2">
          <Label>Editor Theme</Label>
          <Select value={editorTheme} onValueChange={setEditorTheme}>
            <SelectTrigger>
              <SelectValue placeholder="Select editor theme" />
            </SelectTrigger>
            <SelectContent>
              {EDITOR_THEMES.map(t => (
                <SelectItem key={t} value={t}>
                  {t.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Auto Save */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto Save</Label>
            <p className="text-sm text-muted-foreground">
              Automatically save changes as you type
            </p>
          </div>
          <Switch
            checked={autoSave}
            onCheckedChange={setAutoSave}
          />
        </div>

        {/* Telemetry */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Usage Data</Label>
            <p className="text-sm text-muted-foreground">
              Help improve QuickProject by sending anonymous usage data
            </p>
          </div>
          <Switch
            checked={telemetry}
            onCheckedChange={setTelemetry}
          />
        </div>
      </CardContent>
    </Card>
  )
}
