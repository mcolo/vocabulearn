"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { signIn } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function LoginForm({ redirectPath }: { redirectPath: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter();
    const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
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

  return (
    <>
    {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}
    <form onSubmit={handleSubmit}>
      <div className="space-y-2 mb-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@email.com"
          required
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
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
      <div className="flex justify-end mt-1 mb-8">
        <Link className="text-sm underline" href="/forgot-password">
          Forgot your password?
        </Link>
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
    </>
  )
}