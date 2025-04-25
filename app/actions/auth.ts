"use server"

import { createActionClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Sign up a new user
export async function signUp(email: string, password: string, fullName: string) {
  const supabase = await createActionClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    console.error("Error signing up:", error)
    return { error: error.message }
  }

  // Create profile record
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: fullName,
    })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      return { error: "Failed to create user profile" }
    }
  }

  return { success: true, user: data.user }
}

// Sign in an existing user
export async function signIn(email: string, password: string) {
  const supabase = createActionClient()

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
  const supabase = createActionClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error)
    return { error: error.message }
  }

  redirect("/")
}

// Get the current user
export async function getCurrentUser() {
  const supabase = createActionClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  return session.user
}
