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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_notes: {
        Row: {
          admin_id: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          note: string
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          note: string
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          note?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string | null
          excerpt: string
          featured_image: string | null
          id: string
          images: Json | null
          keywords: string[] | null
          meta_description: string
          meta_title: string
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category: string
          content: string
          created_at?: string | null
          excerpt: string
          featured_image?: string | null
          id?: string
          images?: Json | null
          keywords?: string[] | null
          meta_description: string
          meta_title: string
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string
          featured_image?: string | null
          id?: string
          images?: Json | null
          keywords?: string[] | null
          meta_description?: string
          meta_title?: string
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          category_id: string | null
          country: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          icon_url: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon_url?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      models: {
        Row: {
          active: boolean | null
          base_price: number
          config_presets: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          series_id: string
          sku: string | null
          slug: string | null
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          base_price: number
          config_presets?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          series_id: string
          sku?: string | null
          slug?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          base_price?: number
          config_presets?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          series_id?: string
          sku?: string | null
          slug?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "models_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_method: string | null
          sell_request_id: string
          status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          sell_request_id: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          sell_request_id?: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_sell_request_id_fkey"
            columns: ["sell_request_id"]
            isOneToOne: false
            referencedRelation: "sell_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      pickups: {
        Row: {
          agent_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          scheduled_at: string | null
          sell_request_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          scheduled_at?: string | null
          sell_request_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          scheduled_at?: string | null
          sell_request_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pickups_sell_request_id_fkey"
            columns: ["sell_request_id"]
            isOneToOne: false
            referencedRelation: "sell_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          accessory_factors: Json | null
          age_brackets: Json | null
          condition_factors: Json | null
          config_premiums: Json | null
          created_at: string | null
          id: string
          is_global: boolean | null
          min_payout_floor: number | null
          model_id: string | null
          updated_at: string | null
        }
        Insert: {
          accessory_factors?: Json | null
          age_brackets?: Json | null
          condition_factors?: Json | null
          config_premiums?: Json | null
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          min_payout_floor?: number | null
          model_id?: string | null
          updated_at?: string | null
        }
        Update: {
          accessory_factors?: Json | null
          age_brackets?: Json | null
          condition_factors?: Json | null
          config_premiums?: Json | null
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          min_payout_floor?: number | null
          model_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referral_code: string
          referred_user_id: string | null
          referrer_user_id: string
          reward_amount: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code: string
          referred_user_id?: string | null
          referrer_user_id: string
          reward_amount?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          referral_code?: string
          referred_user_id?: string | null
          referrer_user_id?: string
          reward_amount?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      repair_requests: {
        Row: {
          brand_id: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          issue_category: string
          issue_details: string | null
          issue_subcategory: string | null
          model_name: string
          order_number: string
          preferred_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          issue_category: string
          issue_details?: string | null
          issue_subcategory?: string | null
          model_name: string
          order_number: string
          preferred_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          issue_category?: string
          issue_details?: string | null
          issue_subcategory?: string | null
          model_name?: string
          order_number?: string
          preferred_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_requests_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      sell_requests: {
        Row: {
          accessories: Json | null
          address: string | null
          age_months: number
          condition: Database["public"]["Enums"]["device_condition"]
          config: Json | null
          created_at: string | null
          estimated_price: number
          final_price: number | null
          id: string
          model_id: string
          pincode: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accessories?: Json | null
          address?: string | null
          age_months: number
          condition: Database["public"]["Enums"]["device_condition"]
          config?: Json | null
          created_at?: string | null
          estimated_price: number
          final_price?: number | null
          id?: string
          model_id: string
          pincode?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accessories?: Json | null
          address?: string | null
          age_months?: number
          condition?: Database["public"]["Enums"]["device_condition"]
          config?: Json | null
          created_at?: string | null
          estimated_price?: number
          final_price?: number | null
          id?: string
          model_id?: string
          pincode?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sell_requests_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      series: {
        Row: {
          brand_id: string
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "series_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_repair_order_number: { Args: never; Returns: string }
      generate_slug: { Args: { name: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      make_user_admin: { Args: { user_email: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
      device_condition: "like_new" | "excellent" | "good" | "average" | "faulty"
      order_status:
        | "quoted"
        | "pickup_scheduled"
        | "picked_up"
        | "inspected"
        | "payment_processing"
        | "paid"
        | "cancelled"
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
      app_role: ["admin", "user"],
      device_condition: ["like_new", "excellent", "good", "average", "faulty"],
      order_status: [
        "quoted",
        "pickup_scheduled",
        "picked_up",
        "inspected",
        "payment_processing",
        "paid",
        "cancelled",
      ],
    },
  },
} as const
