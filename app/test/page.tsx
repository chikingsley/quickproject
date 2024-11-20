"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">QuickProject Test Pages</h1>
      <div className="space-y-4">
        <Link href="/test/context">
          <Button size="lg" className="w-full justify-start text-xl h-auto py-4">
            Context System Test Page
            <span className="ml-2 text-sm text-muted-foreground">
              Test the context-aware command center
            </span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
