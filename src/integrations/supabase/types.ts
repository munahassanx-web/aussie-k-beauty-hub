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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      authenticity_card_items: {
        Row: {
          batch_code: string | null
          brand: string | null
          card_id: string
          created_at: string
          id: string
          origin_country: string | null
          position: number
          product_name: string
          quantity: number
          sku: string | null
          supplier_reference: string | null
        }
        Insert: {
          batch_code?: string | null
          brand?: string | null
          card_id: string
          created_at?: string
          id?: string
          origin_country?: string | null
          position?: number
          product_name: string
          quantity?: number
          sku?: string | null
          supplier_reference?: string | null
        }
        Update: {
          batch_code?: string | null
          brand?: string | null
          card_id?: string
          created_at?: string
          id?: string
          origin_country?: string | null
          position?: number
          product_name?: string
          quantity?: number
          sku?: string | null
          supplier_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "authenticity_card_items_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "authenticity_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      authenticity_cards: {
        Row: {
          card_ref: string
          checklist: Json
          created_at: string
          first_scanned_at: string | null
          id: string
          issued_at: string
          issued_by: string | null
          last_scanned_at: string | null
          order_id: string
          revoked_at: string | null
          revoked_reason: string | null
          scan_count: number
          snapshot: Json
          status: string
          token_hash: string
          token_prefix: string
          updated_at: string
          verified_at: string | null
          version: number
        }
        Insert: {
          card_ref: string
          checklist?: Json
          created_at?: string
          first_scanned_at?: string | null
          id?: string
          issued_at?: string
          issued_by?: string | null
          last_scanned_at?: string | null
          order_id: string
          revoked_at?: string | null
          revoked_reason?: string | null
          scan_count?: number
          snapshot?: Json
          status?: string
          token_hash: string
          token_prefix: string
          updated_at?: string
          verified_at?: string | null
          version?: number
        }
        Update: {
          card_ref?: string
          checklist?: Json
          created_at?: string
          first_scanned_at?: string | null
          id?: string
          issued_at?: string
          issued_by?: string | null
          last_scanned_at?: string | null
          order_id?: string
          revoked_at?: string | null
          revoked_reason?: string | null
          scan_count?: number
          snapshot?: Json
          status?: string
          token_hash?: string
          token_prefix?: string
          updated_at?: string
          verified_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "authenticity_cards_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      authenticity_events: {
        Row: {
          actor: string | null
          card_id: string
          created_at: string
          event: string
          id: string
          metadata: Json
        }
        Insert: {
          actor?: string | null
          card_id: string
          created_at?: string
          event: string
          id?: string
          metadata?: Json
        }
        Update: {
          actor?: string | null
          card_id?: string
          created_at?: string
          event?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "authenticity_events_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "authenticity_cards"
            referencedColumns: ["id"]
          },
        ]
      }
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
      inventory: {
        Row: {
          brand: string | null
          created_at: string
          low_stock_threshold: number
          on_hand: number
          opening_stock_set_at: string | null
          product_name: string | null
          sku: string
          track_inventory: boolean
          updated_at: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          low_stock_threshold?: number
          on_hand?: number
          opening_stock_set_at?: string | null
          product_name?: string | null
          sku: string
          track_inventory?: boolean
          updated_at?: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          low_stock_threshold?: number
          on_hand?: number
          opening_stock_set_at?: string | null
          product_name?: string | null
          sku?: string
          track_inventory?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          actor: string | null
          created_at: string
          delta: number
          id: string
          note: string | null
          order_id: string | null
          reason: string
          reference: string | null
          resulting_on_hand: number
          sku: string
        }
        Insert: {
          actor?: string | null
          created_at?: string
          delta: number
          id?: string
          note?: string | null
          order_id?: string | null
          reason: string
          reference?: string | null
          resulting_on_hand: number
          sku: string
        }
        Update: {
          actor?: string | null
          created_at?: string
          delta?: number
          id?: string
          note?: string | null
          order_id?: string | null
          reason?: string
          reference?: string | null
          resulting_on_hand?: number
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_sku_fkey"
            columns: ["sku"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["sku"]
          },
        ]
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
      order_notifications: {
        Row: {
          attempts: number
          created_at: string
          error: string | null
          id: string
          kind: string
          metadata: Json
          order_id: string
          provider: string
          recipient_masked: string | null
          sent_at: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          error?: string | null
          id?: string
          kind: string
          metadata?: Json
          order_id: string
          provider?: string
          recipient_masked?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          error?: string | null
          id?: string
          kind?: string
          metadata?: Json
          order_id?: string
          provider?: string
          recipient_masked?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_cents: number
          cancelled_at: string | null
          created_at: string
          currency: string
          delivered_at: string | null
          discount_cents: number
          dispatched_at: string | null
          environment: string
          fulfillment_status: string
          fulfillment_updated_at: string | null
          fulfillment_updated_by: string | null
          guest_email: string | null
          id: string
          is_subscription_order: boolean
          label_reference: string | null
          label_status: string
          label_url: string | null
          line_items: Json | null
          ops_notes: string | null
          packed_at: string | null
          points_earned: number
          points_redeemed: number
          refunded_at: string | null
          refunded_cents: number | null
          shipment_id: string | null
          shipped_at: string | null
          shipping_carrier: string | null
          shipping_cents: number
          shipping_city: string | null
          shipping_cost_actual_cents: number | null
          shipping_country: string | null
          shipping_line1: string | null
          shipping_line2: string | null
          shipping_method: string | null
          shipping_name: string | null
          shipping_phone: string | null
          shipping_postcode: string | null
          shipping_provider: string
          shipping_service: string | null
          shipping_state: string | null
          status: string
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          discount_cents?: number
          dispatched_at?: string | null
          environment?: string
          fulfillment_status?: string
          fulfillment_updated_at?: string | null
          fulfillment_updated_by?: string | null
          guest_email?: string | null
          id?: string
          is_subscription_order?: boolean
          label_reference?: string | null
          label_status?: string
          label_url?: string | null
          line_items?: Json | null
          ops_notes?: string | null
          packed_at?: string | null
          points_earned?: number
          points_redeemed?: number
          refunded_at?: string | null
          refunded_cents?: number | null
          shipment_id?: string | null
          shipped_at?: string | null
          shipping_carrier?: string | null
          shipping_cents?: number
          shipping_city?: string | null
          shipping_cost_actual_cents?: number | null
          shipping_country?: string | null
          shipping_line1?: string | null
          shipping_line2?: string | null
          shipping_method?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_postcode?: string | null
          shipping_provider?: string
          shipping_service?: string | null
          shipping_state?: string | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          discount_cents?: number
          dispatched_at?: string | null
          environment?: string
          fulfillment_status?: string
          fulfillment_updated_at?: string | null
          fulfillment_updated_by?: string | null
          guest_email?: string | null
          id?: string
          is_subscription_order?: boolean
          label_reference?: string | null
          label_status?: string
          label_url?: string | null
          line_items?: Json | null
          ops_notes?: string | null
          packed_at?: string | null
          points_earned?: number
          points_redeemed?: number
          refunded_at?: string | null
          refunded_cents?: number | null
          shipment_id?: string | null
          shipped_at?: string | null
          shipping_carrier?: string | null
          shipping_cents?: number
          shipping_city?: string | null
          shipping_cost_actual_cents?: number | null
          shipping_country?: string | null
          shipping_line1?: string | null
          shipping_line2?: string | null
          shipping_method?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_postcode?: string | null
          shipping_provider?: string
          shipping_service?: string | null
          shipping_state?: string | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          tracking_number?: string | null
          updated_at?: string
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
          approved: boolean
          created_at: string
          customer_id: string | null
          customer_name: string | null
          id: string
          is_published: boolean
          product_id: string
          rating: number
          review_text: string | null
          sentiment_score: number | null
          tags: string[]
          verified_purchase: boolean
        }
        Insert: {
          approved?: boolean
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          is_published?: boolean
          product_id: string
          rating: number
          review_text?: string | null
          sentiment_score?: number | null
          tags?: string[]
          verified_purchase?: boolean
        }
        Update: {
          approved?: boolean
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          is_published?: boolean
          product_id?: string
          rating?: number
          review_text?: string | null
          sentiment_score?: number | null
          tags?: string[]
          verified_purchase?: boolean
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
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_inventory_movement: {
        Args: {
          _delta: number
          _note?: string
          _order_id?: string
          _reason: string
          _reference?: string
          _sku: string
        }
        Returns: number
      }
      claim_guest_orders: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_fulfillment_staff: { Args: { _user_id: string }; Returns: boolean }
      issue_authenticity_card: {
        Args: {
          _card_ref: string
          _checklist: Json
          _items: Json
          _order_id: string
          _reissue_reason?: string
          _token_hash: string
          _token_prefix: string
        }
        Returns: string
      }
      my_points_balance: { Args: never; Returns: number }
      record_authenticity_scan: {
        Args: { _card_id: string }
        Returns: undefined
      }
      record_order_stock_sale: {
        Args: { _lines: Json; _order_id: string }
        Returns: Json
      }
      revoke_authenticity_card: {
        Args: { _card_id: string; _reason: string }
        Returns: undefined
      }
      set_inventory_settings: {
        Args: {
          _low_stock_threshold: number
          _sku: string
          _track_inventory: boolean
        }
        Returns: undefined
      }
      set_opening_stock: {
        Args: {
          _brand?: string
          _low_stock_threshold?: number
          _note?: string
          _product_name?: string
          _qty: number
          _sku: string
        }
        Returns: number
      }
      sold_out_skus: {
        Args: never
        Returns: {
          sku: string
        }[]
      }
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
