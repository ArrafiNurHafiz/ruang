export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          npsn: string;
          district: string;
          province: string;
          address: string;
          phone: string;
          email: string;
          website: string;
          principal_name: string;
          principal_nip: string;
          satgas_leader_name: string;
          satgas_leader_nip: string;
          counselor_coordinator_name: string;
          counselor_coordinator_nip: string;
          hotline_number: string;
          satgas_sk_number: string;
          satgas_sk_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["schools"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["schools"]["Insert"]>;
      };
      users: {
        Row: {
          id: string;
          auth_id: string | null;
          school_id: string | null;
          name: string;
          email: string;
          role: "guru" | "admin" | "dinas-pendidikan" | "dinas-perlindungan";
          role_title: string;
          organization: string;
          identifier: string;
          avatar_url: string | null;
          permissions: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["users"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      tokens: {
        Row: {
          id: string;
          token_code: string;
          school_id: string;
          student_level: string;
          batch_id: string;
          is_activated: boolean;
          is_used_for_report: boolean;
          pin_hash: string | null;
          recovery_key: string | null;
          status: "Tersedia" | "Aktif" | "Digunakan" | "Kedaluwarsa";
          usage_count: number;
          max_usage: number;
          notes: string;
          created_at: string;
          activated_at: string | null;
          last_used_at: string | null;
          expires_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["tokens"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["tokens"]["Insert"]>;
      };
      tickets: {
        Row: {
          id: string;
          ticket_number: string;
          school_id: string;
          category: string;
          reporter_role: string;
          location: string;
          incident_date: string;
          urgency: "Rendah" | "Sedang" | "Tinggi" | "Kritis (Darurat Segera)";
          story: string;
          redacted_story: string;
          detected_pii: string[];
          status: "diterima" | "ditinjau" | "tindakan" | "ditutup";
          hash_zkp: string;
          recovery_code: string;
          assigned_counselor_id: string | null;
          action_summary: string | null;
          is_kiosk_submission: boolean;
          is_escalated_to_dinas: boolean;
          escalated_to: string | null;
          escalation_reason: string | null;
          protection_stage: string | null;
          assigned_expert: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["tickets"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["tickets"]["Insert"]>;
      };
      ticket_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_type: "pelapor" | "counselor" | "system";
          sender_title: string | null;
          message_text: string;
          is_encrypted: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["ticket_messages"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["ticket_messages"]["Insert"]
        >;
      };
      counselor_notes: {
        Row: {
          id: string;
          ticket_id: string;
          counselor_id: string;
          note: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["counselor_notes"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["counselor_notes"]["Insert"]
        >;
      };
      audit_logs: {
        Row: {
          id: string;
          school_id: string;
          action: string;
          actor_role: string;
          actor_name: string;
          details: string;
          zkp_proof_status: "Tervalidasi" | "Anonymized" | "Scrubbed";
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["audit_logs"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
      };
      interventions: {
        Row: {
          id: string;
          ticket_id: string;
          victim_alias: string;
          school_origin: string;
          category: string;
          urgency: string;
          assigned_psychologist: string | null;
          assigned_legal_aid: string | null;
          stage:
            | "Asesmen Awal"
            | "Perlindungan & Safehouse"
            | "Pemulihan Psikologis"
            | "Pendampingan Hukum"
            | "Selesai";
          shelter_required: boolean;
          notes: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["interventions"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["interventions"]["Insert"]
        >;
      };
      help_articles: {
        Row: {
          id: string;
          title: string;
          category: string;
          read_time: string;
          excerpt: string;
          content: string[];
          icon_name: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["help_articles"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["help_articles"]["Insert"]
        >;
      };
      faq_items: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["faq_items"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["faq_items"]["Insert"]>;
      };
      news_articles: {
        Row: {
          id: string;
          title: string;
          category: string;
          published_at: string;
          author: string;
          author_role: string;
          read_time: string;
          image_url: string | null;
          illustration_type: string | null;
          excerpt: string;
          content: string[];
          tags: string[];
          is_featured: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["news_articles"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["news_articles"]["Insert"]
        >;
      };
    };
  };
}
