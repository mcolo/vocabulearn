import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Confirm() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-start px-4 py-8">
        <div className="w-80">
          <Card>
            <CardHeader>
              <CardTitle>Registration Successful</CardTitle>
              <CardDescription>
                Please check your email to confirm your account.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}