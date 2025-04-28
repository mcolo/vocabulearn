import { useSearchParams } from "next/navigation"
import LoginForm from "./login-form"
import { MailCheck } from "lucide-react";

export default function LoginContent() {
  const searchParams = useSearchParams();
  const fromEmail = searchParams.get("fromEmail");
  const redirectPath = searchParams.get("redirect") || "/lists";

  return (
    <div>
      <div className="text-center mb-8 bg-muted rounded-3xl p-8">
        {fromEmail !== null ? (
          <>
            <div className="flex justify-center mb-2"><MailCheck className="w-20 h-20 [&_path:last-child]:stroke-emerald-500" /></div>
            <h1 className="text-3xl font-bold">Email Confirmed</h1>
          </>
        ) : (
          <h1 className="text-3xl font-bold">Welcome Back</h1>
        )}
        <p className="text-muted-foreground">Enter your credentials to sign in to your account</p>
      </div>
      <LoginForm redirectPath={redirectPath}/>
    </div>
  )
}
