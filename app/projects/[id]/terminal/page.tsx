"use client"

import { useState } from "react"
import { Terminal as TerminalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TerminalPage() {
  const [activeTab, setActiveTab] = useState("terminal-1")
  const [terminals, setTerminals] = useState([{ id: "terminal-1", name: "Terminal 1" }])

  const addTerminal = () => {
    const newId = `terminal-${terminals.length + 1}`
    setTerminals(prev => [...prev, { id: newId, name: `Terminal ${terminals.length + 1}` }])
    setActiveTab(newId)
  }

  return (
    <div className="container h-full py-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-5 w-5" />
            <h1 className="text-xl font-bold">Terminal</h1>
          </div>
          <Button variant="outline" onClick={addTerminal}>
            New Terminal
          </Button>
        </div>

        <Card className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <div className="border-b px-4">
              <TabsList>
                {terminals.map(terminal => (
                  <TabsTrigger key={terminal.id} value={terminal.id}>
                    {terminal.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {terminals.map(terminal => (
              <TabsContent
                key={terminal.id}
                value={terminal.id}
                className="flex-1 p-4 data-[state=active]:flex"
              >
                <div className="h-full w-full rounded-md bg-muted p-4">
                  {/* Terminal component will be integrated here */}
                  <div className="font-mono">
                    <p>$ echo "Terminal integration coming soon..."</p>
                    <p className="text-muted-foreground">
                      Terminal integration coming soon...
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
