"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Sign up a new user
export async function signUp(email: string, password: string) {
  const supabase = await createClient()

  // Construct the full URL dynamically
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const redirectPath = '/login?fromEmail=true'
  const fullRedirectUrl = `${baseUrl}${redirectPath}`

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: fullRedirectUrl,
    },
  })

  if (error) {
    console.error("Error signing up:", error)
    return { success: false, error: error.message }
  } else {
    return { success: true, data }
  }
}

// Sign in an existing user
export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Error signing in:", error)
    return { error: error.message }
  }

  return { success: true, user: data.user }
}

// Sign out the current user
export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error)
    return { error: error.message }
  }

  redirect("/")
}

// Get the current user
export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  return session.user
}
