import { UserRoundCheck } from "lucide-react";
import SiteHeader from "@/components/ui/site-header";

export default function Confirm() {
  return (
    <div className="min-h-screen">
      <SiteHeader logoOnly={true} />
      <section className="flex flex-col items-center justify-start p-8">
        <div className="bg-muted rounded-3xl p-8 flex flex-col items-center">
          <UserRoundCheck className="w-20 h-20 [&_path:last-child]:stroke-emerald-500 mb-2" />
          <h2 className="text-3xl font-bold">Registration Successful</h2>
          <p className="text-muted-foreground">Please check your email to confirm your account.</p>
        </div>
      </section>
    </div>
  )
}