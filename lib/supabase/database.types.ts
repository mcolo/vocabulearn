export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      words: {
        Row: {
          id: string
          list_id: string
          term: string
          definition: string
          part_of_speech: string | null
          example: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          list_id: string
          term: string
          definition: string
          part_of_speech?: string | null
          example?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          term?: string
          definition?: string
          part_of_speech?: string | null
          example?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      learning_progress: {
        Row: {
          id: string
          user_id: string
          word_id: string
          ease_factor: number
          interval: number
          repetitions: number
          next_review: string
          last_reviewed: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word_id: string
          ease_factor?: number
          interval?: number
          repetitions?: number
          next_review?: string
          last_reviewed?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word_id?: string
          ease_factor?: number
          interval?: number
          repetitions?: number
          next_review?: string
          last_reviewed?: string
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      word_tags: {
        Row: {
          word_id: string
          tag_id: string
        }
        Insert: {
          word_id: string
          tag_id: string
        }
        Update: {
          word_id?: string
          tag_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Derived types for easier use in the application
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type List = Database["public"]["Tables"]["lists"]["Row"]
export type Word = Database["public"]["Tables"]["words"]["Row"]
export type LearningProgress = Database["public"]["Tables"]["learning_progress"]["Row"]
export type Tag = Database["public"]["Tables"]["tags"]["Row"]
export type WordTag = Database["public"]["Tables"]["word_tags"]["Row"]

// Types for inserting data
export type InsertProfile = Database["public"]["Tables"]["profiles"]["Insert"]
export type InsertList = Database["public"]["Tables"]["lists"]["Insert"]
export type InsertWord = Database["public"]["Tables"]["words"]["Insert"]
export type InsertLearningProgress = Database["public"]["Tables"]["learning_progress"]["Insert"]
export type InsertTag = Database["public"]["Tables"]["tags"]["Insert"]
export type InsertWordTag = Database["public"]["Tables"]["word_tags"]["Insert"]

// Types for updating data
export type UpdateProfile = Database["public"]["Tables"]["profiles"]["Update"]
export type UpdateList = Database["public"]["Tables"]["lists"]["Update"]
export type UpdateWord = Database["public"]["Tables"]["words"]["Update"]
export type UpdateLearningProgress = Database["public"]["Tables"]["learning_progress"]["Update"]
export type UpdateTag = Database["public"]["Tables"]["tags"]["Update"]
export type UpdateWordTag = Database["public"]["Tables"]["word_tags"]["Update"]
