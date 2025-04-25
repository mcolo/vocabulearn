"use server"

import { revalidatePath } from "next/cache"
import { createActionClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { InsertWord, UpdateWord } from "@/lib/supabase/database.types"

// Get all words for a specific list
export async function getWordsByListId(listId: string) {
  const supabase = createActionClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("words")
    .select("*")
    .eq("list_id", listId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching words:", error)
    throw new Error("Failed to fetch words")
  }

  return data
}

// Get a single word by ID
export async function getWordById(id: string) {
  const supabase = createActionClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { data, error } = await supabase.from("words").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching word:", error)
    throw new Error("Failed to fetch word")
  }

  return data
}

// Create a new word
export async function createWord(word: InsertWord) {
  const supabase = createActionClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { data, error } = await supabase.from("words").insert(word).select().single()

  if (error) {
    console.error("Error creating word:", error)
    throw new Error("Failed to create word")
  }

  revalidatePath(`/lists/${word.list_id}`)
  return data
}

// Update an existing word
export async function updateWord(id: string, word: UpdateWord) {
  const supabase = createActionClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { data, error } = await supabase.from("words").update(word).eq("id", id).select().single()

  if (error) {
    console.error("Error updating word:", error)
    throw new Error("Failed to update word")
  }

  revalidatePath(`/lists/${word.list_id}`)
  return data
}

// Delete a word
export async function deleteWord(id: string, listId: string) {
  const supabase = createActionClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { error } = await supabase.from("words").delete().eq("id", id)

  if (error) {
    console.error("Error deleting word:", error)
    throw new Error("Failed to delete word")
  }

  revalidatePath(`/lists/${listId}`)
  return { success: true }
}

// Search for words in the dictionary API
export async function searchDictionary(term: string) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term.trim())}`)

    if (!response.ok) {
      throw new Error(response.status === 404 ? "No definitions found for this word" : "Failed to fetch definition")
    }

    const data = await response.json()

    // Process and format the results
    const formattedResults = data
      .flatMap((entry) =>
        entry.meanings.flatMap((meaning) =>
          meaning.definitions.map((def) => ({
            word: entry.word,
            partOfSpeech: meaning.partOfSpeech,
            definition: def.definition,
            example: def.example,
          })),
        ),
      )
      .slice(0, 5) // Limit to 5 results for better UX

    return formattedResults
  } catch (error) {
    console.error("Error searching for word:", error)
    throw error
  }
}
