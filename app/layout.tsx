import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout/layout-wrapper"
import { CommandCenter } from "@/components/command-center"
import { ThemeProvider } from "@/components/theme-provider"
import { AIPanel } from "@/components/ai/AIPanel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuickProject",
  description: "Modern project management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative">
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <CommandCenter />
            <AIPanel className="fixed bottom-0 left-0 right-0 z-50" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
