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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          source: string
          topic: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          source?: string
          topic: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          source?: string
          topic?: string
        }
        Relationships: []
      }
      guide_views: {
        Row: {
          bundle_id: string | null
          created_at: string
          id: string
          product_id: string
          referrer: string | null
          source: string
        }
        Insert: {
          bundle_id?: string | null
          created_at?: string
          id?: string
          product_id: string
          referrer?: string | null
          source?: string
        }
        Update: {
          bundle_id?: string | null
          created_at?: string
          id?: string
          product_id?: string
          referrer?: string | null
          source?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          also_known_as: string[]
          avoid_if: string[]
          avoid_pairing_with: string[]
          category: string
          common_myth: string | null
          created_at: string
          good_for: string[]
          how_to_use: string | null
          id: string
          name_chinese: string | null
          name_english: string
          name_korean: string | null
          pairs_well_with: string[]
          science_note: string | null
          updated_at: string
          what_it_does: string
        }
        Insert: {
          also_known_as?: string[]
          avoid_if?: string[]
          avoid_pairing_with?: string[]
          category: string
          common_myth?: string | null
          created_at?: string
          good_for?: string[]
          how_to_use?: string | null
          id?: string
          name_chinese?: string | null
          name_english: string
          name_korean?: string | null
          pairs_well_with?: string[]
          science_note?: string | null
          updated_at?: string
          what_it_does: string
        }
        Update: {
          also_known_as?: string[]
          avoid_if?: string[]
          avoid_pairing_with?: string[]
          category?: string
          common_myth?: string | null
          created_at?: string
          good_for?: string[]
          how_to_use?: string | null
          id?: string
          name_chinese?: string | null
          name_english?: string
          name_korean?: string | null
          pairs_well_with?: string[]
          science_note?: string | null
          updated_at?: string
          what_it_does?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          circle_since: string | null
          has_active_subscription: boolean
          tier: Database["public"]["Enums"]["member_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          circle_since?: string | null
          has_active_subscription?: boolean
          tier?: Database["public"]["Enums"]["member_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          circle_since?: string | null
          has_active_subscription?: boolean
          tier?: Database["public"]["Enums"]["member_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      newsletter_drafts: {
        Row: {
          approved_at: string | null
          content: Json
          cover_alt: string | null
          cover_url: string | null
          created_at: string
          factcheck: Json | null
          id: string
          issue_number: string | null
          published_at: string | null
          slug: string | null
          source_signal_ids: string[] | null
          status: string
          theme: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          content?: Json
          cover_alt?: string | null
          cover_url?: string | null
          created_at?: string
          factcheck?: Json | null
          id?: string
          issue_number?: string | null
          published_at?: string | null
          slug?: string | null
          source_signal_ids?: string[] | null
          status?: string
          theme?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          content?: Json
          cover_alt?: string | null
          cover_url?: string | null
          created_at?: string
          factcheck?: Json | null
          id?: string
          issue_number?: string | null
          published_at?: string | null
          slug?: string | null
          source_signal_ids?: string[] | null
          status?: string
          theme?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_log: {
        Row: {
          created_at: string
          id: string
          send_date: string
          subject_line: string | null
          theme: string
          topic: string
        }
        Insert: {
          created_at?: string
          id?: string
          send_date: string
          subject_line?: string | null
          theme: string
          topic: string
        }
        Update: {
          created_at?: string
          id?: string
          send_date?: string
          subject_line?: string | null
          theme?: string
          topic?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          discount_cents: number
          environment: string
          fulfillment_status: string
          id: string
          is_subscription_order: boolean
          line_items: Json | null
          points_earned: number
          points_redeemed: number
          shipping_cents: number
          shipping_city: string | null
          shipping_country: string | null
          shipping_line1: string | null
          shipping_line2: string | null
          shipping_method: string | null
          shipping_name: string | null
          shipping_phone: string | null
          shipping_postcode: string | null
          shipping_state: string | null
          status: string
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          tracking_number: string | null
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          discount_cents?: number
          environment?: string
          fulfillment_status?: string
          id?: string
          is_subscription_order?: boolean
          line_items?: Json | null
          points_earned?: number
          points_redeemed?: number
          shipping_cents?: number
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_line1?: string | null
          shipping_line2?: string | null
          shipping_method?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_postcode?: string | null
          shipping_state?: string | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          tracking_number?: string | null
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          discount_cents?: number
          environment?: string
          fulfillment_status?: string
          id?: string
          is_subscription_order?: boolean
          line_items?: Json | null
          points_earned?: number
          points_redeemed?: number
          shipping_cents?: number
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_line1?: string | null
          shipping_line2?: string | null
          shipping_method?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_postcode?: string | null
          shipping_state?: string | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          tracking_number?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      points_ledger: {
        Row: {
          created_at: string
          delta: number
          id: string
          metadata: Json | null
          order_id: string | null
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delta: number
          id?: string
          metadata?: Json | null
          order_id?: string | null
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          delta?: number
          id?: string
          metadata?: Json | null
          order_id?: string | null
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_ledger_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_ingredients: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string
          is_hero_ingredient: boolean
          product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id: string
          is_hero_ingredient?: boolean
          product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string
          is_hero_ingredient?: boolean
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          amount_to_use: string | null
          brand: string
          created_at: string
          frequency: string | null
          how_to_apply: string | null
          id: string
          name: string
          pairs_well_with: string[]
          pro_tip: string | null
          routine_order: number
          routine_step: string
          suggested_bundle: string | null
          updated_at: string
        }
        Insert: {
          amount_to_use?: string | null
          brand: string
          created_at?: string
          frequency?: string | null
          how_to_apply?: string | null
          id: string
          name: string
          pairs_well_with?: string[]
          pro_tip?: string | null
          routine_order: number
          routine_step: string
          suggested_bundle?: string | null
          updated_at?: string
        }
        Update: {
          amount_to_use?: string | null
          brand?: string
          created_at?: string
          frequency?: string | null
          how_to_apply?: string | null
          id?: string
          name?: string
          pairs_well_with?: string[]
          pro_tip?: string | null
          routine_order?: number
          routine_step?: string
          suggested_bundle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          budget_band: string | null
          created_at: string
          current_routine_gaps: string[]
          customer_id: string | null
          email: string | null
          id: string
          marketing_consent: boolean
          name: string | null
          recommended_products: string[]
          skin_concerns: string[]
          skin_type: string | null
          source: string
        }
        Insert: {
          budget_band?: string | null
          created_at?: string
          current_routine_gaps?: string[]
          customer_id?: string | null
          email?: string | null
          id?: string
          marketing_consent?: boolean
          name?: string | null
          recommended_products?: string[]
          skin_concerns?: string[]
          skin_type?: string | null
          source?: string
        }
        Update: {
          budget_band?: string | null
          created_at?: string
          current_routine_gaps?: string[]
          customer_id?: string | null
          email?: string | null
          id?: string
          marketing_consent?: boolean
          name?: string | null
          recommended_products?: string[]
          skin_concerns?: string[]
          skin_type?: string | null
          source?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          is_published: boolean
          product_id: string
          rating: number
          review_text: string | null
          sentiment_score: number | null
          tags: string[]
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          is_published?: boolean
          product_id: string
          rating: number
          review_text?: string | null
          sentiment_score?: number | null
          tags?: string[]
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          is_published?: boolean
          product_id?: string
          rating?: number
          review_text?: string | null
          sentiment_score?: number | null
          tags?: string[]
        }
        Relationships: []
      }
      routine_bundles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          product_names: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          name: string
          product_names?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          product_names?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      signal_items: {
        Row: {
          brand: string | null
          excerpt: string | null
          harvested_at: string
          id: string
          ingredient: string | null
          mentions: number
          published_at: string | null
          raw: Json | null
          score: number
          source: string
          source_url: string
          title: string
          topic: string | null
        }
        Insert: {
          brand?: string | null
          excerpt?: string | null
          harvested_at?: string
          id?: string
          ingredient?: string | null
          mentions?: number
          published_at?: string | null
          raw?: Json | null
          score?: number
          source: string
          source_url: string
          title: string
          topic?: string | null
        }
        Update: {
          brand?: string | null
          excerpt?: string | null
          harvested_at?: string
          id?: string
          ingredient?: string | null
          mentions?: number
          published_at?: string | null
          raw?: Json | null
          score?: number
          source?: string
          source_url?: string
          title?: string
          topic?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          price_id: string | null
          product_id: string | null
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id?: string | null
          product_id?: string | null
          status?: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id?: string | null
          product_id?: string | null
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_signals: {
        Row: {
          created_at: string
          frequency: number
          id: string
          theme: string
          week_starting: string
        }
        Insert: {
          created_at?: string
          frequency?: number
          id?: string
          theme: string
          week_starting: string
        }
        Update: {
          created_at?: string
          frequency?: number
          id?: string
          theme?: string
          week_starting?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      my_points_balance: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      member_tier: "basket" | "restock" | "circle"
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
      app_role: ["admin", "moderator", "user"],
      member_tier: ["basket", "restock", "circle"],
    },
  },
} as const
