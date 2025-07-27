export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          criteria: Json
          description: string
          icon: string | null
          id: string
          name: string
          points: number | null
        }
        Insert: {
          created_at?: string
          criteria?: Json
          description: string
          icon?: string | null
          id?: string
          name: string
          points?: number | null
        }
        Update: {
          created_at?: string
          criteria?: Json
          description?: string
          icon?: string | null
          id?: string
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          completed: boolean | null
          created_at: string
          game_data: Json | null
          game_type: string
          id: string
          max_score: number | null
          multiplayer: boolean | null
          player_id: string
          room_code: string | null
          score: number | null
          time_spent: number | null
          unit_id: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          game_data?: Json | null
          game_type: string
          id?: string
          max_score?: number | null
          multiplayer?: boolean | null
          player_id: string
          room_code?: string | null
          score?: number | null
          time_spent?: number | null
          unit_id: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          game_data?: Json | null
          game_type?: string
          id?: string
          max_score?: number | null
          multiplayer?: boolean | null
          player_id?: string
          room_code?: string | null
          score?: number | null
          time_spent?: number | null
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      grammar_rules: {
        Row: {
          created_at: string
          description: string
          examples: Json
          exercises: Json
          id: string
          rule_type: string
          title: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          examples?: Json
          exercises?: Json
          id?: string
          rule_type: string
          title: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          examples?: Json
          exercises?: Json
          id?: string
          rule_type?: string
          title?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grammar_rules_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      multiplayer_rooms: {
        Row: {
          created_at: string
          current_players: number | null
          game_type: string
          host_id: string
          id: string
          max_players: number | null
          room_code: string
          settings: Json | null
          status: string | null
          unit_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_players?: number | null
          game_type: string
          host_id: string
          id?: string
          max_players?: number | null
          room_code: string
          settings?: Json | null
          status?: string | null
          unit_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_players?: number | null
          game_type?: string
          host_id?: string
          id?: string
          max_players?: number | null
          room_code?: string
          settings?: Json | null
          status?: string | null
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "multiplayer_rooms_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "multiplayer_rooms_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      player_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          player_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          player_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_achievements_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_progress: {
        Row: {
          attempts: number | null
          correct_answers: number | null
          created_at: string
          grammar_rule_id: string | null
          id: string
          last_practiced: string | null
          mastery_level: number | null
          player_id: string
          unit_id: string
          updated_at: string
          vocabulary_id: string | null
        }
        Insert: {
          attempts?: number | null
          correct_answers?: number | null
          created_at?: string
          grammar_rule_id?: string | null
          id?: string
          last_practiced?: string | null
          mastery_level?: number | null
          player_id: string
          unit_id: string
          updated_at?: string
          vocabulary_id?: string | null
        }
        Update: {
          attempts?: number | null
          correct_answers?: number | null
          created_at?: string
          grammar_rule_id?: string | null
          id?: string
          last_practiced?: string | null
          mastery_level?: number | null
          player_id?: string
          unit_id?: string
          updated_at?: string
          vocabulary_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_progress_grammar_rule_id_fkey"
            columns: ["grammar_rule_id"]
            isOneToOne: false
            referencedRelation: "grammar_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_progress_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_progress_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_progress_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            isOneToOne: false
            referencedRelation: "vocabulary"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          grade_level: number | null
          id: string
          role: string
          school: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          grade_level?: number | null
          id: string
          role?: string
          school?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          grade_level?: number | null
          id?: string
          role?: string
          school?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      room_participants: {
        Row: {
          id: string
          joined_at: string
          player_id: string
          ready: boolean | null
          room_id: string
          score: number | null
        }
        Insert: {
          id?: string
          joined_at?: string
          player_id: string
          ready?: boolean | null
          room_id: string
          score?: number | null
        }
        Update: {
          id?: string
          joined_at?: string
          player_id?: string
          ready?: boolean | null
          room_id?: string
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "multiplayer_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          title: string
          unit_number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title: string
          unit_number: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string
          unit_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      vocabulary: {
        Row: {
          audio_url: string | null
          created_at: string
          definition: string
          difficulty_level: number | null
          example_sentence: string | null
          id: string
          image_url: string | null
          part_of_speech: string | null
          pronunciation: string | null
          unit_id: string
          updated_at: string
          word: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          definition: string
          difficulty_level?: number | null
          example_sentence?: string | null
          id?: string
          image_url?: string | null
          part_of_speech?: string | null
          pronunciation?: string | null
          unit_id: string
          updated_at?: string
          word: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          definition?: string
          difficulty_level?: number | null
          example_sentence?: string | null
          id?: string
          image_url?: string | null
          part_of_speech?: string | null
          pronunciation?: string | null
          unit_id?: string
          updated_at?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']