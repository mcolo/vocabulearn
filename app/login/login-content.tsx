"use client"

import { useSearchParams } from "next/navigation"
import LoginForm from "./login-form"
import { MailCheck, SquareUserRound } from "lucide-react";

export default function LoginContent() {
  const searchParams = useSearchParams();
  const fromEmail = searchParams.get("fromEmail");
  const redirectPath = searchParams.get("redirect") || "/lists";

  return (
    <>
      <div className="text-center mb-8 bg-muted rounded-3xl p-8">
        <div className="flex justify-center mb-2">
          {fromEmail !== null 
            ? <MailCheck className="w-20 h-20 [&_path:last-child]:stroke-emerald-500" /> 
            : <SquareUserRound className="w-20 h-20 [&_path:last-child]:stroke-emerald-500" />}
        </div>
        <h1 className="text-3xl font-bold">{fromEmail !== null ? "Email Confirmed" : "Welcome Back"}</h1>
        <p className="text-muted-foreground">Enter your credentials to sign in to your account</p>
      </div>
      <LoginForm redirectPath={redirectPath}/>
    </>
  )
}
