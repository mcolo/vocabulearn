"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { InsertLearningProgress, UpdateLearningProgress } from "@/lib/supabase/database.types"

// Get learning progress for a user
export async function getLearningProgress(userId: string) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("learning_progress")
    .select(`
      *,
      words (
        id,
        term,
        definition,
        list_id,
        part_of_speech,
        example
      )
    `)
    .eq("user_id", userId)
    .order("next_review", { ascending: true })

  if (error) {
    console.error("Error fetching learning progress:", error)
    throw new Error("Failed to fetch learning progress")
  }

  return data
}

// Get words due for review
export async function getWordsForReview(userId: string, limit = 20) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("learning_progress")
    .select(`
      *,
      words (
        id,
        term,
        definition,
        list_id,
        part_of_speech,
        example
      )
    `)
    .eq("user_id", userId)
    .lte("next_review", now)
    .order("next_review", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching words for review:", error)
    throw new Error("Failed to fetch words for review")
  }

  return data
}

// Create or update learning progress
export async function updateLearningProgress(progress: InsertLearningProgress | UpdateLearningProgress) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Check if a record already exists
  const { data: existingProgress } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("user_id", progress.user_id)
    .eq("word_id", progress.word_id)
    .maybeSingle()

  let result

  if (existingProgress) {
    // Update existing record
    const { data, error } = await supabase
      .from("learning_progress")
      .update(progress)
      .eq("id", existingProgress.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating learning progress:", error)
      throw new Error("Failed to update learning progress")
    }

    result = data
  } else {
    // Insert new record
    const { data, error } = await supabase.from("learning_progress").insert(progress).select().single()

    if (error) {
      console.error("Error creating learning progress:", error)
      throw new Error("Failed to create learning progress")
    }

    result = data
  }

  revalidatePath("/learn")
  return result
}

// Calculate next review date using the SuperMemo SM-2 algorithm
export function calculateNextReview(
  easeFactor: number,
  interval: number,
  repetitions: number,
  quality: number, // 0-5 rating of how well the user remembered
): { nextInterval: number; nextEaseFactor: number; nextRepetitions: number } {
  // Quality less than 3 means the user didn't remember well
  if (quality < 3) {
    return {
      nextInterval: 1, // Reset to 1 day
      nextEaseFactor: Math.max(1.3, easeFactor - 0.2), // Decrease ease factor but not below 1.3
      nextRepetitions: 0, // Reset repetitions
    }
  }

  // Calculate new ease factor
  const nextEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  // Calculate new interval
  let nextInterval
  if (repetitions === 0) {
    nextInterval = 1 // First successful review: 1 day
  } else if (repetitions === 1) {
    nextInterval = 6 // Second successful review: 6 days
  } else {
    nextInterval = Math.round(interval * nextEaseFactor) // Subsequent reviews
  }

  return {
    nextInterval,
    nextEaseFactor: Math.max(1.3, nextEaseFactor), // Ensure ease factor doesn't go below 1.3
    nextRepetitions: repetitions + 1,
  }
}
