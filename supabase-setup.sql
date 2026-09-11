-- TAMENG Supabase Schema
-- Jalankan di Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Enable UUID
create extension if not exists "uuid-ossp";

-- Schools
create table if not exists schools (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  npsn text unique,
  district text,
  province text,
  created_at timestamptz default now()
);

-- Users
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  role text not null,
  role_title text,
  organization text,
  identifier text,
  avatar_url text,
  permissions text[] default '{}',
  is_active boolean default true,
  status text default 'Aktif',
  created_at timestamptz default now()
);

-- Tokens
create table if not exists tokens (
  id uuid primary key default uuid_generate_v4(),
  token_code text unique not null,
  school_id text default 'default-school',
  student_level text,
  batch_id text,
  is_activated boolean default false,
  is_used_for_report boolean default false,
  password_hash text,
  pin_hash text,
  recovery_key text,
  status text default 'Tersedia',
  usage_count integer default 0,
  max_usage integer default 1,
  notes text,
  created_at timestamptz default now(),
  activated_at timestamptz,
  last_used_at timestamptz,
  expires_at timestamptz
);

-- Tickets
create table if not exists tickets (
  id uuid primary key default uuid_generate_v4(),
  ticket_number text unique not null,
  school_id text default 'default-school',
  category text not null,
  reporter_role text,
  location text,
  incident_date text,
  urgency text,
  story text,
  redacted_story text,
  detected_pii text[] default '{}',
  status text default 'diterima',
  recovery_code text unique,
  secret_pin text,
  action_summary text,
  resolution_evidence jsonb,
  student_confirmation jsonb,
  is_escalated_to_dinas boolean default false,
  escalated_to text,
  escalation_reason text,
  protection_stage text,
  assigned_expert text,
  assigned_counselor_id text,
  hash_zkp text,
  is_kiosk_submission boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ticket Messages
create table if not exists ticket_messages (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid references tickets(id) on delete cascade,
  sender_type text,
  sender_title text,
  message_text text not null,
  is_encrypted boolean default true,
  created_at timestamptz default now()
);

-- Counselor Notes
create table if not exists counselor_notes (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid references tickets(id) on delete cascade,
  note text not null,
  created_at timestamptz default now()
);

-- Audit Logs
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  school_id text default 'default-school',
  action text not null,
  actor_role text,
  actor_name text,
  details text,
  zkp_proof_status text,
  created_at timestamptz default now()
);

-- Interventions
create table if not exists interventions (
  id text primary key,
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

-- Contact Messages
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  subject text,
  category text,
  message text,
  status text default 'Baru',
  created_at timestamptz default now()
);

-- Account Requests
create table if not exists account_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  role text not null,
  organization text,
  identifier text,
  reason text,
  status text default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- News Articles
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

-- Help Articles
create table if not exists help_articles (
  id text primary key,
  title text not null,
  category text,
  read_time text,
  excerpt text,
  content text[] default '{}',
  icon_name text
);

-- FAQ Items
create table if not exists faq_items (
  id text primary key,
  question text not null,
  answer text not null,
  category text
);

-- Regional Schools
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

-- Insert default data
insert into schools (id, name, npsn, district, province) values ('a0000000-0000-0000-0000-000000000001', 'SMA Negeri 1 Jakarta', '12345678', 'Jakarta Pusat', 'DKI Jakarta') on conflict do nothing;

insert into users (id, name, email, role, role_title, organization, identifier, avatar_url, permissions, status) values
('b0000000-0000-0000-0000-000000000001', 'Dra. Hj. Nurjanah, M.Pd', 'guru.bk@sekolah.sch.id', 'guru', 'Koordinator Guru BK & Satgas PPKSP', 'SMA Negeri 1 Jakarta', 'NIP: 19780412 200501 2 003', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', '{"Triage Laporan","Chat Siswa","Catatan Rahasia","Eskalasi Kasus"}', 'Aktif'),
('b0000000-0000-0000-0000-000000000002', 'Bambang Prasetyo, S.Kom', 'admin.ppksp@sekolah.sch.id', 'admin', 'Administrator Sistem & Satgas IT Sekolah', 'SMA Negeri 1 Jakarta', 'ID ADMIN: ADM-SMAN1-091', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', '{"Manajemen Token","Kelola Petugas BK","Audit Log","Konfigurasi Sistem"}', 'Aktif'),
('b0000000-0000-0000-0000-000000000003', 'Dr. H. Hendro Wicaksono, M.Pd', 'h.hendro@disdik.prov.go.id', 'dinas-pendidikan', 'Kabid Pembinaan SMA & Pengawas PPKSP Wilayah', 'Dinas Pendidikan Provinsi DKI Jakarta', 'NIP: 19710815 199603 1 002', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', '{"Pengawasan Wilayah","Monitoring Respon Sekolah","Indeks Kerawanan","Pemberian Supervisi"}', 'Aktif'),
('b0000000-0000-0000-0000-000000000004', 'Sri Rahayu, S.Psi., M.Si', 'sri.rahayu@uptd-ppa.go.id', 'dinas-perlindungan', 'Kepala Satuan Pelaksana Penanganan Kasus UPTD PPA', 'Dinas PPPA / UPTD Perlindungan Perempuan & Anak', 'NIP: 19820520 200801 2 015', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', '{"Intervensi Kritis","Disposisi Psikolog","Layanan Rumah Aman","Pendampingan Hukum"}', 'Aktif')
on conflict do nothing;

insert into regional_schools (id, "schoolName", district, level, "activeSatgasCount", "totalReports", "resolvedReports", "avgResponseHours", "complianceStatus", "principalName", "lastActive") values
('sch-01', 'SMA Negeri 1 Jakarta', 'Jakarta Pusat', 'SMA', 6, 14, 12, 1.8, 'Patuh (A)', 'Drs. H. Mulyadi, M.M', '10 menit lalu')
on conflict do nothing;

-- RLS: Allow all for anon (demo app)
alter table schools enable row level security;
alter table users enable row level security;
alter table tokens enable row level security;
alter table tickets enable row level security;
alter table ticket_messages enable row level security;
alter table counselor_notes enable row level security;
alter table audit_logs enable row level security;
alter table interventions enable row level security;
alter table contact_messages enable row level security;
alter table account_requests enable row level security;
alter table news_articles enable row level security;
alter table help_articles enable row level security;
alter table faq_items enable row level security;
alter table regional_schools enable row level security;
alter table supervision_notices enable row level security;

-- Policies: allow all for anon (demo)
create policy "Allow all" on schools for all using (true) with check (true);
create policy "Allow all" on users for all using (true) with check (true);
create policy "Allow all" on tokens for all using (true) with check (true);
create policy "Allow all" on tickets for all using (true) with check (true);
create policy "Allow all" on ticket_messages for all using (true) with check (true);
create policy "Allow all" on counselor_notes for all using (true) with check (true);
create policy "Allow all" on audit_logs for all using (true) with check (true);
create policy "Allow all" on interventions for all using (true) with check (true);
create policy "Allow all" on contact_messages for all using (true) with check (true);
create policy "Allow all" on account_requests for all using (true) with check (true);
create policy "Allow all" on news_articles for all using (true) with check (true);
create policy "Allow all" on help_articles for all using (true) with check (true);
create policy "Allow all" on faq_items for all using (true) with check (true);
create policy "Allow all" on regional_schools for all using (true) with check (true);
create policy "Allow all" on supervision_notices for all using (true) with check (true);

-- Enable Realtime for live chat
alter publication supabase_realtime add table ticket_messages;
alter publication supabase_realtime add table tickets;

-- Migration: Add columns if table was created in an earlier version
alter table tokens add column if not exists password_hash text;
alter table tokens add column if not exists pin_hash text;
alter table tokens add column if not exists recovery_key text;
alter table tokens add column if not exists usage_count integer default 0;
alter table tokens add column if not exists max_usage integer default 1;
alter table tokens add column if not exists last_used_at timestamptz;
alter table tokens add column if not exists expires_at timestamptz;

alter table tickets add column if not exists hash_zkp text;
alter table tickets add column if not exists secret_pin text;
alter table tickets add column if not exists resolution_evidence jsonb;
alter table tickets add column if not exists student_confirmation jsonb;
alter table tickets add column if not exists is_escalated_to_dinas boolean default false;
alter table tickets add column if not exists escalated_to text;
alter table tickets add column if not exists escalation_reason text;
alter table tickets add column if not exists protection_stage text;
alter table tickets add column if not exists assigned_expert text;
alter table tickets add column if not exists assigned_counselor_id text;

-- Performance Indexes
create index if not exists idx_tokens_token_code on tokens(token_code);
create index if not exists idx_tokens_recovery_key on tokens(recovery_key);
create index if not exists idx_tokens_password_hash on tokens(password_hash);
create index if not exists idx_tickets_recovery_code on tickets(recovery_code);
create index if not exists idx_tickets_secret_pin on tickets(secret_pin);
