export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          course_type: Database["public"]["Enums"]["course_type"]
          created_at: string
          description_vi: string | null
          description_zh: string | null
          id: string
          is_published: boolean | null
          price: number | null
          sort_order: number | null
          thumbnail_url: string | null
          title_vi: string
          title_zh: string
          updated_at: string
        }
        Insert: {
          course_type?: Database["public"]["Enums"]["course_type"]
          created_at?: string
          description_vi?: string | null
          description_zh?: string | null
          id?: string
          is_published?: boolean | null
          price?: number | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title_vi: string
          title_zh: string
          updated_at?: string
        }
        Update: {
          course_type?: Database["public"]["Enums"]["course_type"]
          created_at?: string
          description_vi?: string | null
          description_zh?: string | null
          id?: string
          is_published?: boolean | null
          price?: number | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title_vi?: string
          title_zh?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          access_type: Database["public"]["Enums"]["content_access"]
          category: string
          content_vi: string | null
          content_zh: string | null
          created_at: string
          description_vi: string | null
          description_zh: string | null
          download_count: number | null
          file_type: string | null
          file_url: string
          id: string
          level: string | null
          title_vi: string
          title_zh: string
        }
        Insert: {
          access_type?: Database["public"]["Enums"]["content_access"]
          category: string
          content_vi?: string | null
          content_zh?: string | null
          created_at?: string
          description_vi?: string | null
          description_zh?: string | null
          download_count?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          level?: string | null
          title_vi: string
          title_zh: string
        }
        Update: {
          access_type?: Database["public"]["Enums"]["content_access"]
          category?: string
          content_vi?: string | null
          content_zh?: string | null
          created_at?: string
          description_vi?: string | null
          description_zh?: string | null
          download_count?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          level?: string | null
          title_vi?: string
          title_zh?: string
        }
        Relationships: []
      }
      exercise_questions: {
        Row: {
          correct_answer: string
          created_at: string
          exercise_id: string
          explanation_vi: string | null
          explanation_zh: string | null
          id: string
          options: Json
          points: number | null
          question_number: number
          question_type: string
          question_vi: string
          question_zh: string
          sort_order: number | null
        }
        Insert: {
          correct_answer: string
          created_at?: string
          exercise_id: string
          explanation_vi?: string | null
          explanation_zh?: string | null
          id?: string
          options?: Json
          points?: number | null
          question_number?: number
          question_type?: string
          question_vi: string
          question_zh: string
          sort_order?: number | null
        }
        Update: {
          correct_answer?: string
          created_at?: string
          exercise_id?: string
          explanation_vi?: string | null
          explanation_zh?: string | null
          id?: string
          options?: Json
          points?: number | null
          question_number?: number
          question_type?: string
          question_vi?: string
          question_zh?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_questions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_results: {
        Row: {
          answers: Json
          completed_at: string
          exercise_id: string
          id: string
          score: number
          time_spent_seconds: number | null
          total_questions: number
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string
          exercise_id: string
          id?: string
          score?: number
          time_spent_seconds?: number | null
          total_questions?: number
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          exercise_id?: string
          id?: string
          score?: number
          time_spent_seconds?: number | null
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_results_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_sets: {
        Row: {
          created_at: string
          description_vi: string | null
          description_zh: string | null
          id: string
          is_published: boolean | null
          level: Database["public"]["Enums"]["exercise_level"]
          set_number: number
          sort_order: number | null
          title_vi: string
          title_zh: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_vi?: string | null
          description_zh?: string | null
          id?: string
          is_published?: boolean | null
          level?: Database["public"]["Enums"]["exercise_level"]
          set_number?: number
          sort_order?: number | null
          title_vi: string
          title_zh: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_vi?: string | null
          description_zh?: string | null
          id?: string
          is_published?: boolean | null
          level?: Database["public"]["Enums"]["exercise_level"]
          set_number?: number
          sort_order?: number | null
          title_vi?: string
          title_zh?: string
          updated_at?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          audio_url: string | null
          category: Database["public"]["Enums"]["exercise_category"]
          created_at: string
          description_vi: string | null
          description_zh: string | null
          exercise_number: number
          exercise_set_id: string
          id: string
          is_published: boolean | null
          reading_passage_vi: string | null
          reading_passage_zh: string | null
          sort_order: number | null
          time_limit_minutes: number | null
          title_vi: string
          title_zh: string
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          category: Database["public"]["Enums"]["exercise_category"]
          created_at?: string
          description_vi?: string | null
          description_zh?: string | null
          exercise_number?: number
          exercise_set_id: string
          id?: string
          is_published?: boolean | null
          reading_passage_vi?: string | null
          reading_passage_zh?: string | null
          sort_order?: number | null
          time_limit_minutes?: number | null
          title_vi: string
          title_zh: string
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          category?: Database["public"]["Enums"]["exercise_category"]
          created_at?: string
          description_vi?: string | null
          description_zh?: string | null
          exercise_number?: number
          exercise_set_id?: string
          id?: string
          is_published?: boolean | null
          reading_passage_vi?: string | null
          reading_passage_zh?: string | null
          sort_order?: number | null
          time_limit_minutes?: number | null
          title_vi?: string
          title_zh?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_exercise_set_id_fkey"
            columns: ["exercise_set_id"]
            isOneToOne: false
            referencedRelation: "exercise_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          id: string
          is_completed: boolean | null
          last_accessed_at: string | null
          lesson_id: string
          progress_percent: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          lesson_id: string
          progress_percent?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          lesson_id?: string
          progress_percent?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          access_type: Database["public"]["Enums"]["content_access"]
          audio_url: string | null
          content_vi: string | null
          content_zh: string | null
          course_id: string
          created_at: string
          description_vi: string | null
          description_zh: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          sort_order: number | null
          title_vi: string
          title_zh: string
          updated_at: string
          video_url: string | null
          vocabulary: Json | null
        }
        Insert: {
          access_type?: Database["public"]["Enums"]["content_access"]
          audio_url?: string | null
          content_vi?: string | null
          content_zh?: string | null
          course_id: string
          created_at?: string
          description_vi?: string | null
          description_zh?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          sort_order?: number | null
          title_vi: string
          title_zh: string
          updated_at?: string
          video_url?: string | null
          vocabulary?: Json | null
        }
        Update: {
          access_type?: Database["public"]["Enums"]["content_access"]
          audio_url?: string | null
          content_vi?: string | null
          content_zh?: string | null
          course_id?: string
          created_at?: string
          description_vi?: string | null
          description_zh?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          sort_order?: number | null
          title_vi?: string
          title_zh?: string
          updated_at?: string
          video_url?: string | null
          vocabulary?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          preferred_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          preferred_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          preferred_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          answers: Json
          completed_at: string
          id: string
          lesson_id: string
          passed: boolean | null
          score: number
          test_id: string
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string
          id?: string
          lesson_id: string
          passed?: boolean | null
          score: number
          test_id: string
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          id?: string
          lesson_id?: string
          passed?: boolean | null
          score?: number
          test_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          passing_score: number | null
          questions: Json
          title_vi: string
          title_zh: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          passing_score?: number | null
          questions?: Json
          title_vi: string
          title_zh: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          passing_score?: number | null
          questions?: Json
          title_vi?: string
          title_zh?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          lesson_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          lesson_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          course_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          starts_at: string | null
          subscription_type: string
          user_id: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          subscription_type: string
          user_id: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          subscription_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          language: string
          updated_at: string
          vocabulary_key: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          language?: string
          updated_at?: string
          vocabulary_key: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          language?: string
          updated_at?: string
          vocabulary_key?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "teacher" | "assistant" | "user"
      content_access: "free" | "paid"
      course_type: "free" | "paid" | "exam"
      exercise_category: "vocabulary" | "reading" | "listening" | "writing"
      exercise_level: "A" | "B" | "C"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "teacher", "assistant", "user"],
      content_access: ["free", "paid"],
      course_type: ["free", "paid", "exam"],
      exercise_category: ["vocabulary", "reading", "listening", "writing"],
      exercise_level: ["A", "B", "C"],
    },
  },
} as const
