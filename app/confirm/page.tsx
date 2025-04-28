import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import SiteLogo from "@/components/ui/site-header/site-logo";

export default function Confirm() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-80">
        <Card>
          <CardHeader>
            <SiteLogo className="w-56" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <CardTitle>Registration Successful</CardTitle>
            <CardDescription>Please check your email to confirm your account.</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}