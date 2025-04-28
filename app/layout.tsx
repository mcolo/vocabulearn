import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Commissioner } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const commissioner = Commissioner({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vocabulearn - Learn and Remember New Words",
  description: "Create custom word lists and master new vocabulary with spaced repetition",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={commissioner.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
