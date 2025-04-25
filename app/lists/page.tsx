"use client"

import { AuthGuard } from "@/components/auth-guard"
import ListsContent from "./lists-content"

export default function ListsPage() {
  return (
    <AuthGuard>
      <ListsContent />
    </AuthGuard>
  )
}
