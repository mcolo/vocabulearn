"use client"

import { AuthGuard } from "@/components/auth-guard"
import ListDetailContent from "./list-detail-content"

export default function ListDetailPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <ListDetailContent id={params.id} />
    </AuthGuard>
  )
}
