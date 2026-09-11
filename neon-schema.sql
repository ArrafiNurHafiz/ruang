-- ==============================================================================
-- TAMENG - RUANG AMAN KELUARGA & SEKOLAH
-- Neon Serverless PostgreSQL Database Schema (Vercel Postgres Native)
-- 100% Free Forever, No Trial, Zero Auto-Pause
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Schools table
create table if not exists schools (
  id text primary key default uuid_generate_v4()::text,
  name text not null,
  npsn text unique,
  district text,
  province text,
  address text,
  phone text,
  email text,
  website text,
  principal_name text,
  principal_nip text,
  satgas_leader_name text,
  satgas_leader_nip text,
  counselor_coordinator_name text,
  counselor_coordinator_nip text,
  hotline_number text,
  satgas_sk_number text,
  satgas_sk_date text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Users table (Petugas Sekolah, Admin, Disdik, UPTD PPA)
create table if not exists users (
  id text primary key default uuid_generate_v4()::text,
  school_id text default 'default-school',
  name text not null,
  email text not null unique,
  password_hash text,
  role text not null check (role in ('guru', 'admin', 'dinas-pendidikan', 'dinas-perlindungan')),
  role_title text,
  organization text,
  identifier text,
  avatar_url text,
  permissions text[] default '{}',
  is_active boolean default true,
  status text default 'Aktif',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Tokens table (Kode Akses Pelajar & Proteksi Sandi 2-Langkah)
create table if not exists tokens (
  id text primary key default uuid_generate_v4()::text,
  token_code text unique not null,
  school_id text default 'default-school',
  student_level text default 'Semua Tingkat',
  batch_id text,
  is_activated boolean default false,
  is_used_for_report boolean default false,
  password_hash text,
  pin_hash text,
  recovery_key text,
  status text default 'Tersedia' check (status in ('Tersedia', 'Aktif', 'Digunakan', 'Kedaluwarsa')),
  usage_count integer default 0,
  max_usage integer default 1,
  notes text,
  created_at timestamptz default now(),
  activated_at timestamptz,
  last_used_at timestamptz,
  expires_at timestamptz
);

-- 4. Tickets table (Laporan Insiden Siswa & Bukti Tindak Lanjut)
create table if not exists tickets (
  id text primary key default uuid_generate_v4()::text,
  ticket_number text unique not null,
  school_id text default 'default-school',
  category text not null,
  reporter_role text default 'Siswa',
  location text,
  incident_date text,
  urgency text default 'Sedang',
  story text not null,
  redacted_story text,
  detected_pii text[] default '{}',
  status text default 'diterima' check (status in ('diterima', 'ditinjau', 'tindakan', 'menunggu_siswa', 'ditutup')),
  hash_zkp text,
  recovery_code text unique,
  secret_pin text,
  assigned_counselor_id text,
  action_summary text,
  resolution_evidence jsonb,
  student_confirmation jsonb,
  is_kiosk_submission boolean default false,
  is_escalated_to_dinas boolean default false,
  escalated_to text,
  escalation_reason text,
  protection_stage text,
  assigned_expert text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Ticket Messages (Percakapan 2 Arah Konselor & Pelapor)
create table if not exists ticket_messages (
  id text primary key default uuid_generate_v4()::text,
  ticket_id text not null,
  sender_type text not null,
  sender_title text,
  message_text text not null,
  is_encrypted boolean default true,
  created_at timestamptz default now()
);

-- 6. Counselor Notes (Catatan Rahasia Konselor)
create table if not exists counselor_notes (
  id text primary key default uuid_generate_v4()::text,
  ticket_id text not null,
  note text not null,
  created_at timestamptz default now()
);

-- 7. Audit Logs (Log Audit Forensik ZKP)
create table if not exists audit_logs (
  id text primary key default uuid_generate_v4()::text,
  school_id text default 'default-school',
  action text not null,
  actor_role text,
  actor_name text,
  details text,
  zkp_proof_status text default 'Tervalidasi',
  created_at timestamptz default now()
);

-- 8. Interventions (Penanganan Kasus UPTD PPA)
create table if not exists interventions (
  id text primary key default uuid_generate_v4()::text,
  ticket_id text,
  victim_alias text,
  school_origin text,
  category text,
  urgency text,
  assigned_psychologist text,
  assigned_legal_aid text,
  stage text default 'Asesmen Awal',
  shelter_required boolean default false,
  notes text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. Supervision Notices (Supervisi Wilayah Disdik / DPPA)
create table if not exists supervision_notices (
  id text primary key default uuid_generate_v4()::text,
  ticket_id text,
  school_id text default 'default-school',
  school_name text,
  target_role text,
  urgency text,
  message text not null,
  sender_role text,
  created_at timestamptz default now()
);

-- 10. Contact Messages (Pengaduan & Pertanyaan Masyarakat)
create table if not exists contact_messages (
  id text primary key default uuid_generate_v4()::text,
  name text,
  email text,
  subject text,
  category text,
  message text not null,
  status text default 'Baru',
  created_at timestamptz default now()
);

-- 11. Regional Schools (Daftar Sekolah Binaan Wilayah)
create table if not exists regional_schools (
  id text primary key,
  "schoolName" text not null,
  district text,
  level text,
  "activeSatgasCount" int default 0,
  "totalReports" int default 0,
  "resolvedReports" int default 0,
  "avgResponseHours" float default 0,
  "complianceStatus" text,
  "principalName" text,
  "lastActive" text
);

-- 12. News Articles (Kanal Berita & Edukasi Anti Kekerasan)
create table if not exists news_articles (
  id text primary key,
  title text not null,
  category text,
  published_at text,
  author text,
  author_role text,
  read_time text,
  illustration_type text,
  excerpt text,
  content text[] default '{}',
  tags text[] default '{}',
  is_featured boolean default false
);

-- 13. Help Articles (Panduan Edukasi)
create table if not exists help_articles (
  id text primary key,
  title text not null,
  category text,
  read_time text,
  excerpt text,
  content text[] default '{}',
  icon_name text
);

-- 14. FAQ Items (Pertanyaan yang Sering Diajukan)
create table if not exists faq_items (
  id text primary key,
  question text not null,
  answer text not null,
  category text
);

-- Indexes for lightning fast queries
create index if not exists idx_tokens_code on tokens(token_code);
create index if not exists idx_tokens_recovery on tokens(recovery_key);
create index if not exists idx_tokens_password on tokens(password_hash);
create index if not exists idx_tickets_number on tickets(ticket_number);
create index if not exists idx_tickets_recovery on tickets(recovery_code);
create index if not exists idx_tickets_pin on tickets(secret_pin);
create index if not exists idx_ticket_messages_tid on ticket_messages(ticket_id);
create index if not exists idx_counselor_notes_tid on counselor_notes(ticket_id);
create index if not exists idx_audit_school on audit_logs(school_id);
create index if not exists idx_users_email_role on users(email, role);

-- Default Initial Seed Data
insert into schools (id, name, npsn, district, province)
values ('default-school', 'SMA Negeri 1 Jakarta', '12345678', 'Jakarta Pusat', 'DKI Jakarta')
on conflict do nothing;

insert into users (id, name, email, role, role_title, organization, identifier, avatar_url, permissions, status)
values
('usr-guru-01', 'Dra. Hj. Nurjanah, M.Pd', 'guru.bk@sekolah.sch.id', 'guru', 'Koordinator Guru BK & Satgas PPKSP', 'SMA Negeri 1 Jakarta', 'NIP: 19780412 200501 2 003', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', '{"Triage Laporan","Chat Siswa","Catatan Rahasia","Eskalasi Kasus"}', 'Aktif'),
('usr-admin-01', 'Bambang Prasetyo, S.Kom', 'admin.ppksp@sekolah.sch.id', 'admin', 'Administrator Sistem & Satgas IT Sekolah', 'SMA Negeri 1 Jakarta', 'ID ADMIN: ADM-SMAN1-091', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', '{"Manajemen Token","Kelola Petugas BK","Audit Log","Konfigurasi Sistem"}', 'Aktif'),
('usr-disdik-01', 'Dr. H. Hendro Wicaksono, M.Pd', 'h.hendro@disdik.prov.go.id', 'dinas-pendidikan', 'Kabid Pembinaan SMA & Pengawas PPKSP Wilayah', 'Dinas Pendidikan Provinsi DKI Jakarta', 'NIP: 19710815 199603 1 002', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', '{"Pengawasan Wilayah","Monitoring Respon Sekolah","Indeks Kerawanan","Pemberian Supervisi"}', 'Aktif'),
('usr-dppa-01', 'Sri Rahayu, S.Psi., M.Si', 'sri.rahayu@uptd-ppa.go.id', 'dinas-perlindungan', 'Kepala Satuan Pelaksana Penanganan Kasus UPTD PPA', 'Dinas PPPA / UPTD Perlindungan Perempuan & Anak', 'NIP: 19820520 200801 2 015', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', '{"Intervensi Kritis","Disposisi Psikolog","Layanan Rumah Aman","Pendampingan Hukum"}', 'Aktif')
on conflict do nothing;

insert into regional_schools (id, "schoolName", district, level, "activeSatgasCount", "totalReports", "resolvedReports", "avgResponseHours", "complianceStatus", "principalName", "lastActive")
values
('sch-01', 'SMA Negeri 1 Jakarta', 'Jakarta Pusat', 'SMA', 6, 14, 12, 1.8, 'Patuh (A)', 'Drs. H. Mulyadi, M.M', '10 menit lalu')
on conflict do nothing;
