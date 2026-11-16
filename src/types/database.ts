import type { SupabaseClient } from '@supabase/supabase-js';

// Database types generated from Supabase
// Run: npm run db:generate to update this file

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'expired' | 'target_reached';
export type ContributionStatus = 'pending' | 'confirmed' | 'failed' | 'refunded' | 'reversed';
export type PetitionStatus = 'collecting' | 'voting' | 'approved' | 'rejected' | 'withdrawn';
export type VoteChoice = 'yes' | 'no';
export type ContactPlatform = 'ko-fi' | 'buy-me-a-coffee';
export type ExpenseCategory = 'housing_deposit' | 'rent' | 'utilities' | 'essential_items' | 'moving_costs' | 'other';
export type ExpensePubStatus = 'draft' | 'published' | 'archived';
export type UpdatePubStatus = 'draft' | 'published';

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          tagline: string;
          target_amount_cents: number;
          max_target_amount_cents: number;
          start_timestamp: string;
          end_timestamp: string;
          status: CampaignStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string;
          description?: string | null;
          tagline?: string;
          target_amount_cents?: number;
          max_target_amount_cents?: number;
          start_timestamp?: string;
          end_timestamp?: string;
          status?: CampaignStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          tagline?: string;
          target_amount_cents?: number;
          max_target_amount_cents?: number;
          start_timestamp?: string;
          end_timestamp?: string;
          status?: CampaignStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      campaign_settings: {
        Row: {
          id: string;
          campaign_id: string;
          hero_title: string;
          hero_subtitle: string;
          hero_description: string;
          campaign_explanation: string;
          bitcoin_address: string | null;
          solana_address: string | null;
          phantom_username: string | null;
          kofi_enabled: boolean;
          kofi_url: string | null;
          kofi_label: string;
          kofi_status: string;
          standard_contribution_cents: number;
          currency: string;
          petition_threshold: number;
          petition_voting_duration_days: number;
          legal_entity_name: string | null;
          legal_address: string | null;
          legal_country: string | null;
          legal_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          hero_title?: string;
          hero_subtitle?: string;
          hero_description?: string;
          campaign_explanation?: string;
          bitcoin_address?: string | null;
          solana_address?: string | null;
          phantom_username?: string | null;
          kofi_enabled?: boolean;
          kofi_url?: string | null;
          kofi_label?: string;
          kofi_status?: string;
          standard_contribution_cents?: number;
          currency?: string;
          petition_threshold?: number;
          petition_voting_duration_days?: number;
          legal_entity_name?: string | null;
          legal_address?: string | null;
          legal_country?: string | null;
          legal_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          hero_title?: string;
          hero_subtitle?: string;
          hero_description?: string;
          campaign_explanation?: string;
          bitcoin_address?: string | null;
          solana_address?: string | null;
          phantom_username?: string | null;
          kofi_enabled?: boolean;
          kofi_url?: string | null;
          kofi_label?: string;
          kofi_status?: string;
          standard_contribution_cents?: number;
          currency?: string;
          petition_threshold?: number;
          petition_voting_duration_days?: number;
          legal_entity_name?: string | null;
          legal_address?: string | null;
          legal_country?: string | null;
          legal_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_settings_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: true;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          }
        ];
      };
      contributions: {
        Row: {
          id: string;
          campaign_id: string;
          payment_method: string;
          transaction_hash: string | null;
          network: string | null;
          amount_cents: number;
          currency: string;
          usd_equivalent_cents: number;
          status: ContributionStatus;
          recorded_at: string;
          confirmed_at: string | null;
          verified_by: string | null;
          verification_note: string | null;
          reconciliation_note: string | null;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          payment_method: string;
          transaction_hash?: string | null;
          network?: string | null;
          amount_cents: number;
          currency?: string;
          usd_equivalent_cents: number;
          status?: ContributionStatus;
          recorded_at?: string;
          confirmed_at?: string | null;
          verified_by?: string | null;
          verification_note?: string | null;
          reconciliation_note?: string | null;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          payment_method?: string;
          transaction_hash?: string | null;
          network?: string | null;
          amount_cents?: number;
          currency?: string;
          usd_equivalent_cents?: number;
          status?: ContributionStatus;
          recorded_at?: string;
          confirmed_at?: string | null;
          verified_by?: string | null;
          verification_note?: string | null;
          reconciliation_note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "contributions_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          }
        ];
      };
      repayment_contacts: {
        Row: {
          id: string;
          campaign_id: string;
          contribution_id: string | null;
          platform: ContactPlatform;
          profile_url: string;
          consent_given: boolean;
          consent_timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          contribution_id?: string | null;
          platform: ContactPlatform;
          profile_url: string;
          consent_given?: boolean;
          consent_timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          contribution_id?: string | null;
          platform?: ContactPlatform;
          profile_url?: string;
          consent_given?: boolean;
          consent_timestamp?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "repayment_contacts_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "repayment_contacts_contribution_id_fkey";
            columns: ["contribution_id"];
            isOneToOne: false;
            referencedRelation: "contributions";
            referencedColumns: ["id"];
          }
        ];
      };
      expenses: {
        Row: {
          id: string;
          campaign_id: string;
          date: string;
          category: ExpenseCategory;
          amount_cents: number;
          currency: string;
          explanation: string;
          evidence_url: string | null;
          publication_status: ExpensePubStatus;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          date?: string;
          category: ExpenseCategory;
          amount_cents: number;
          currency?: string;
          explanation: string;
          evidence_url?: string | null;
          publication_status?: ExpensePubStatus;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          date?: string;
          category?: ExpenseCategory;
          amount_cents?: number;
          currency?: string;
          explanation?: string;
          evidence_url?: string | null;
          publication_status?: ExpensePubStatus;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          }
        ];
      };
      petitions: {
        Row: {
          id: string;
          campaign_id: string;
          requested_target_cents: number;
          reason: string;
          threshold: number;
          status: PetitionStatus;
          created_at: string;
          voting_started_at: string | null;
          voting_ends_at: string | null;
          decided_at: string | null;
          admin_decision: boolean | null;
          admin_decision_reason: string | null;
          admin_decided_by: string | null;
          admin_decided_at: string | null;
          petition_voting_duration_days: number;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          requested_target_cents: number;
          reason: string;
          threshold?: number;
          status?: PetitionStatus;
          created_at?: string;
          voting_started_at?: string | null;
          voting_ends_at?: string | null;
          decided_at?: string | null;
          admin_decision?: boolean | null;
          admin_decision_reason?: string | null;
          admin_decided_by?: string | null;
          admin_decided_at?: string | null;
          petition_voting_duration_days?: number;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          requested_target_cents?: number;
          reason?: string;
          threshold?: number;
          status?: PetitionStatus;
          created_at?: string;
          voting_started_at?: string | null;
          voting_ends_at?: string | null;
          decided_at?: string | null;
          admin_decision?: boolean | null;
          admin_decision_reason?: string | null;
          admin_decided_by?: string | null;
          admin_decided_at?: string | null;
          petition_voting_duration_days?: number;
        };
        Relationships: [
          {
            foreignKeyName: "petitions_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          }
        ];
      };
      votes: {
        Row: {
          id: string;
          petition_id: string;
          token_id: string;
          choice: VoteChoice;
          created_at: string;
        };
        Insert: {
          id?: string;
          petition_id: string;
          token_id: string;
          choice: VoteChoice;
          created_at?: string;
        };
        Update: {
          id?: string;
          petition_id?: string;
          token_id?: string;
          choice?: VoteChoice;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "votes_petition_id_fkey";
            columns: ["petition_id"];
            isOneToOne: false;
            referencedRelation: "petitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_token_id_fkey";
            columns: ["token_id"];
            isOneToOne: false;
            referencedRelation: "browser_participation_tokens";
            referencedColumns: ["id"];
          }
        ];
      };
      browser_participation_tokens: {
        Row: {
          id: string;
          token_hash: string;
          created_at: string;
          last_used_at: string | null;
          request_count: number;
          last_request_at: string | null;
        };
        Insert: {
          id?: string;
          token_hash: string;
          created_at?: string;
          last_used_at?: string | null;
          request_count?: number;
          last_request_at?: string | null;
        };
        Update: {
          id?: string;
          token_hash?: string;
          created_at?: string;
          last_used_at?: string | null;
          request_count?: number;
          last_request_at?: string | null;
        };
        Relationships: [];
      };
      campaign_updates: {
        Row: {
          id: string;
          campaign_id: string;
          title: string;
          content: string;
          image_url: string | null;
          publication_status: UpdatePubStatus;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          created_by: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          title: string;
          content: string;
          image_url?: string | null;
          publication_status?: UpdatePubStatus;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          created_by: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          title?: string;
          content?: string;
          image_url?: string | null;
          publication_status?: UpdatePubStatus;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          created_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_updates_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          }
        ];
      };
      admin_audit_logs: {
        Row: {
          id: string;
          admin_user_id: string;
          action: string;
          affected_table: string | null;
          affected_record_id: string | null;
          before_values: Json | null;
          after_values: Json | null;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_user_id: string;
          action: string;
          affected_table?: string | null;
          affected_record_id?: string | null;
          before_values?: Json | null;
          after_values?: Json | null;
          ip_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_user_id?: string;
          action?: string;
          affected_table?: string | null;
          affected_record_id?: string | null;
          before_values?: Json | null;
          after_values?: Json | null;
          ip_hash?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      petition_signatures: {
        Row: {
          petition_id: string;
          token_id: string;
          created_at: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      compute_campaign_status: {
        Args: { p_campaign_id: string };
        Returns: CampaignStatus;
      };
      update_campaign_status: {
        Args: { p_campaign_id: string };
        Returns: void;
      };
      check_and_advance_petition: {
        Args: { p_petition_id: string };
        Returns: void;
      };
      validate_transaction_hash: {
        Args: { p_network: string; p_hash: string };
        Returns: boolean;
      };
      create_audit_log: {
        Args: {
          p_admin_user_id: string;
          p_action: string;
          p_affected_table?: string | null;
          p_affected_record_id?: string | null;
          p_before_values?: Json | null;
          p_after_values?: Json | null;
          p_ip_hash?: string | null;
        };
        Returns: string;
      };
      hash_sensitive_data: {
        Args: { p_data: string };
        Returns: string;
      };
      get_campaign_stats: {
        Args: { p_campaign_id: string };
        Returns: {
          confirmed_total_cents: number;
          confirmed_count: number;
          pending_count: number;
          failed_count: number;
          expense_total_cents: number;
          expense_count: number;
          balance_cents: number;
        }[];
      };
      get_petition_votes: {
        Args: { p_petition_id: string };
        Returns: {
          yes_count: number;
          no_count: number;
          total_count: number;
        }[];
      };
    };
    Enums: {
      campaign_status: CampaignStatus;
      contribution_status: ContributionStatus;
      petition_status: PetitionStatus;
      vote_choice: VoteChoice;
      contact_platform: ContactPlatform;
      expense_category: ExpenseCategory;
      expense_pub_status: ExpensePubStatus;
      update_pub_status: UpdatePubStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper type for Supabase client
export type TypedSupabaseClient = SupabaseClient<Database>;