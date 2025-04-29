"use client"

import { AuthGuard } from "@/components/auth-guard"
import ListsContent from "./lists-content"
import SiteHeader from "@/components/ui/site-header"

export default function ListsPage() {
  return (
    <AuthGuard>
      <ListsContent />
    </AuthGuard>
  )
}
