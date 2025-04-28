"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { InsertList, UpdateList } from "@/lib/supabase/database.types"

// Get all lists for the current user
export async function getLists() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { data, error } = await supabase.from("lists").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching lists:", error)
    throw new Error("Failed to fetch lists")
  }

  return data
}

// Get a single list by ID
export async function getListById(id: string) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { data, error } = await supabase.from("lists").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching list:", error)
    throw new Error("Failed to fetch list")
  }

  return data
}

// Create a new list
export async function createList(list: Omit<InsertList, "user_id">) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("lists")
    .insert({
      ...list,
      user_id: session.user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating list:", error)
    throw new Error("Failed to create list")
  }

  revalidatePath("/lists")
  return data
}

// Update an existing list
export async function updateList(id: string, list: UpdateList) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { data, error } = await supabase.from("lists").update(list).eq("id", id).select().single()

  if (error) {
    console.error("Error updating list:", error)
    throw new Error("Failed to update list")
  }

  revalidatePath(`/lists/${id}`)
  revalidatePath("/lists")
  return data
}

// Delete a list
export async function deleteList(id: string) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { error } = await supabase.from("lists").delete().eq("id", id)

  if (error) {
    console.error("Error deleting list:", error)
    throw new Error("Failed to delete list")
  }

  revalidatePath("/lists")
  return { success: true }
}
