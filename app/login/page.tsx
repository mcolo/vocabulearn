"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MailCheck } from "lucide-react"
import { signIn } from "@/app/actions/auth"
import { useToast } from "@/hooks/use-toast"
import SiteHeader from "@/components/ui/site-header"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/lists"
  const fromEmail = searchParams.get("fromEmail") || null;
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn(email, password)

      if (result.error) {
        setError(result.error)
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
        console.log(redirectPath);
        router.push(redirectPath)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function showToast() {
    toast({
      title: "Email confirmed",
      description: "Thank you for confirming your email.",
      variant: "success",
    })
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div >
              {fromEmail !== null ? (
                <>
                  <div className="flex justify-center mb-2"><MailCheck className="w-20 h-20 [&_path:last-child]:stroke-emerald-600" /></div>
                  <h1 className="text-3xl font-bold">Email Confirmed</h1>
                </>
              ) : (
                <h1 className="text-3xl font-bold">Welcome Back</h1>
              )}
            </div>
            <p className="text-muted-foreground">Enter your credentials to sign in to your account</p>
          </div>
          {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link className="text-sm underline" href="/forgot-password">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link className="underline" href="/register">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
