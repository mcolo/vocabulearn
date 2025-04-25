"use client"

import { AuthGuard } from "@/components/auth-guard"
import LearnContent from "./learn-content"

export default function LearnPage() {
  return (
    <AuthGuard>
      <LearnContent />
    </AuthGuard>
  )
}
