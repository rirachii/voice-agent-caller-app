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
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          currency: string
          interval: string
          call_limit: number
          stripe_price_id: string
          features: string[]
          is_featured: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          currency: string
          interval: string
          call_limit: number
          stripe_price_id: string
          features?: string[]
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          currency?: string
          interval?: string
          call_limit?: number
          stripe_price_id?: string
          features?: string[]
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      call_service_providers: {
        Row: {
          id: string
          name: string
          api_credentials: Json
          type: string
          concurrency_limit: number
          priority: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          api_credentials: Json
          type: string
          concurrency_limit: number
          priority: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          api_credentials?: Json
          type?: string
          concurrency_limit?: number
          priority?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      call_queue: {
        Row: {
          id: string
          user_id: string
          recipient_number: string
          scheduled_time: string | null
          status: string
          priority: number
          provider_id: string | null
          template_id: string
          custom_variables: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipient_number: string
          scheduled_time?: string | null
          status?: string
          priority?: number
          provider_id?: string | null
          template_id: string
          custom_variables?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipient_number?: string
          scheduled_time?: string | null
          status?: string
          priority?: number
          provider_id?: string | null
          template_id?: string
          custom_variables?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_queue_provider_id_fkey"
            columns: ["provider_id"]
            referencedRelation: "call_service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_queue_template_id_fkey"
            columns: ["template_id"]
            referencedRelation: "call_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_queue_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      provider_availability: {
        Row: {
          provider_id: string
          current_calls: number
          available_slots: number
          health_status: string
          last_updated: string
        }
        Insert: {
          provider_id: string
          current_calls: number
          available_slots: number
          health_status: string
          last_updated?: string
        }
        Update: {
          provider_id?: string
          current_calls?: number
          available_slots?: number
          health_status?: string
          last_updated?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_availability_provider_id_fkey"
            columns: ["provider_id"]
            referencedRelation: "call_service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      call_assignments: {
        Row: {
          id: string
          call_queue_id: string
          provider_id: string
          assignment_status: string
          provider_response: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          call_queue_id: string
          provider_id: string
          assignment_status?: string
          provider_response?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          call_queue_id?: string
          provider_id?: string
          assignment_status?: string
          provider_response?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_assignments_call_queue_id_fkey"
            columns: ["call_queue_id"]
            referencedRelation: "call_queue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_assignments_provider_id_fkey"
            columns: ["provider_id"]
            referencedRelation: "call_service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      call_retries: {
        Row: {
          id: string
          call_queue_id: string
          attempt_number: number
          next_retry_time: string
          created_at: string
        }
        Insert: {
          id?: string
          call_queue_id: string
          attempt_number: number
          next_retry_time: string
          created_at?: string
        }
        Update: {
          id?: string
          call_queue_id?: string
          attempt_number?: number
          next_retry_time?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_retries_call_queue_id_fkey"
            columns: ["call_queue_id"]
            referencedRelation: "call_queue"
            referencedColumns: ["id"]
          }
        ]
      }
      provider_assistants: {
        Row: {
          id: string
          provider_id: string
          name: string
          identifier: string
          capabilities: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          name: string
          identifier: string
          capabilities?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          name?: string
          identifier?: string
          capabilities?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_assistants_provider_id_fkey"
            columns: ["provider_id"]
            referencedRelation: "call_service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      provider_phone_numbers: {
        Row: {
          id: string
          provider_id: string
          phone_number: string
          format: string
          capabilities: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          phone_number: string
          format: string
          capabilities?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          phone_number?: string
          format?: string
          capabilities?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_phone_numbers_provider_id_fkey"
            columns: ["provider_id"]
            referencedRelation: "call_service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      template_variables: {
        Row: {
          id: string
          template_id: string
          variable_name: string
          validation_rules: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          template_id: string
          variable_name: string
          validation_rules?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          template_id?: string
          variable_name?: string
          validation_rules?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_variables_template_id_fkey"
            columns: ["template_id"]
            referencedRelation: "call_templates"
            referencedColumns: ["id"]
          }
        ]
      }
      call_templates: {
        Row: {
          id: string
          name: string
          description: string
          provider_id: string
          assistant_id: string
          phone_number_id: string
          default_variables: Json
          required_variables: string[]
          icon: string | null
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          provider_id: string
          assistant_id: string
          phone_number_id: string
          default_variables?: Json
          required_variables?: string[]
          icon?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          provider_id?: string
          assistant_id?: string
          phone_number_id?: string
          default_variables?: Json
          required_variables?: string[]
          icon?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_templates_assistant_id_fkey"
            columns: ["assistant_id"]
            referencedRelation: "provider_assistants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_templates_phone_number_id_fkey"
            columns: ["phone_number_id"]
            referencedRelation: "provider_phone_numbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_templates_provider_id_fkey"
            columns: ["provider_id"]
            referencedRelation: "call_service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      call_history: {
        Row: {
          id: string
          user_id: string
          call_queue_id: string
          provider_id: string
          assistant_id: string
          phone_number_id: string
          recipient_number: string
          template_id: string
          custom_variables: Json
          transcript: string | null
          status: string
          created_at: string
          updated_at: string
          completed_at: string | null
          duration_seconds: number | null
          error_message: string | null
        }
        Insert: {
          id?: string
          user_id: string
          call_queue_id: string
          provider_id: string
          assistant_id: string
          phone_number_id: string
          recipient_number: string
          template_id: string
          custom_variables?: Json
          transcript?: string | null
          status: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          duration_seconds?: number | null
          error_message?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          call_queue_id?: string
          provider_id?: string
          assistant_id?: string
          phone_number_id?: string
          recipient_number?: string
          template_id?: string
          custom_variables?: Json
          transcript?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          duration_seconds?: number | null
          error_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_history_assistant_id_fkey"
            columns: ["assistant_id"]
            referencedRelation: "provider_assistants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_history_call_queue_id_fkey"
            columns: ["call_queue_id"]
            referencedRelation: "call_queue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_history_phone_number_id_fkey"
            columns: ["phone_number_id"]
            referencedRelation: "provider_phone_numbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_history_provider_id_fkey"
            columns: ["provider_id"]
            referencedRelation: "call_service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_history_template_id_fkey"
            columns: ["template_id"]
            referencedRelation: "call_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_history_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          plan_id: string
          status: string
          current_period_start: string
          current_period_end: string
          calls_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          plan_id: string
          status?: string
          current_period_start: string
          current_period_end: string
          calls_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          plan_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          calls_used?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
