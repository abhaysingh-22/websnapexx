export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          role: "user" | "assistant"
          content: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          role: "user" | "assistant"
          content: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          role?: "user" | "assistant"
          content?: string
          image_url?: string | null
          created_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          rating: number | null
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rating?: number | null
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rating?: number | null
          message?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
  }
}
