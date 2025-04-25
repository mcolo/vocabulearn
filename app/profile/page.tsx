import { AuthGuard } from "@/components/auth-guard"
import ProfileContent from "./profile-content"

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
}
