-- TAMENG Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Schools table
create table if not exists schools (
  id uuid primary key default uuid_generate_v4(),
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

-- Users table (linked to Supabase Auth)
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid unique references auth.users(id) on delete cascade,
  school_id uuid references schools(id) on delete set null,
  name text not null,
  email text not null,
  role text not null check (role in ('guru', 'admin', 'dinas-pendidikan', 'dinas-perlindungan')),
  role_title text,
  organization text,
  identifier text,
  avatar_url text,
  permissions text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- School tokens for student access
create table if not exists tokens (
  id uuid primary key default uuid_generate_v4(),
  token_code text unique not null,
  school_id uuid references schools(id) on delete cascade,
  student_level text,
  batch_id text,
  is_activated boolean default false,
  is_used_for_report boolean default false,
  password_hash text,
  pin_hash text,
  recovery_key text,
  status text default 'Aktif' check (status in ('Tersedia', 'Aktif', 'Digunakan', 'Kedaluwarsa')),
  usage_count integer default 0,
  max_usage integer default 1,
  notes text,
  created_at timestamptz default now(),
  activated_at timestamptz,
  last_used_at timestamptz,
  expires_at timestamptz
);

-- Report tickets
create table if not exists tickets (
  id uuid primary key default uuid_generate_v4(),
  ticket_number text unique not null,
  school_id uuid references schools(id) on delete cascade,
  category text not null,
  reporter_role text,
  location text,
  incident_date text,
  urgency text check (urgency in ('Rendah', 'Sedang', 'Tinggi', 'Kritis (Darurat Segera)')),
  story text,
  redacted_story text,
  detected_pii text[] default '{}',
  status text default 'diterima' check (status in ('diterima', 'ditinjau', 'tindakan', 'menunggu_siswa', 'ditutup')),
  hash_zkp text,
  recovery_code text unique,
  secret_pin text,
  assigned_counselor_id uuid references users(id) on delete set null,
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

-- Ticket messages (chat)
create table if not exists ticket_messages (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid references tickets(id) on delete cascade,
  sender_type text check (sender_type in ('pelapor', 'counselor', 'system')),
  sender_title text,
  message_text text not null,
  is_encrypted boolean default true,
  created_at timestamptz default now()
);

-- Counselor notes
create table if not exists counselor_notes (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid references tickets(id) on delete cascade,
  counselor_id uuid references users(id) on delete cascade,
  note text not null,
  created_at timestamptz default now()
);

-- Audit logs
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid references schools(id) on delete cascade,
  action text not null,
  actor_role text,
  actor_name text,
  details text,
  zkp_proof_status text check (zkp_proof_status in ('Tervalidasi', 'Anonymized', 'Scrubbed')),
  created_at timestamptz default now()
);

-- Protection interventions (UPTD PPA)
create table if not exists interventions (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid references tickets(id) on delete cascade,
  victim_alias text,
  school_origin text,
  category text,
  urgency text,
  assigned_psychologist text,
  assigned_legal_aid text,
  stage text check (stage in ('Asesmen Awal', 'Perlindungan & Safehouse', 'Pemulihan Psikologis', 'Pendampingan Hukum', 'Selesai')),
  shelter_required boolean default false,
  notes text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Help articles
create table if not exists help_articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text,
  read_time text,
  excerpt text,
  content text[] default '{}',
  icon_name text,
  created_at timestamptz default now()
);

-- FAQ items
create table if not exists faq_items (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  category text,
  created_at timestamptz default now()
);

-- News articles
create table if not exists news_articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text,
  published_at timestamptz default now(),
  author text,
  author_role text,
  read_time text,
  image_url text,
  illustration_type text,
  excerpt text,
  content text[] default '{}',
  tags text[] default '{}',
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- Contact messages
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

-- Supervision notices
create table if not exists supervision_notices (
  id uuid primary key default uuid_generate_v4(),
  ticket_id text,
  school_id text default 'default-school',
  school_name text,
  target_role text,
  urgency text,
  message text not null,
  sender_role text,
  created_at timestamptz default now()
);

-- Regional schools
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

-- Indexes for performance
create index if not exists idx_tickets_school on tickets(school_id);
create index if not exists idx_tickets_status on tickets(status);
create index if not exists idx_tickets_recovery on tickets(recovery_code);
create index if not exists idx_tickets_secret_pin on tickets(secret_pin);
create index if not exists idx_tokens_school on tokens(school_id);
create index if not exists idx_tokens_code on tokens(token_code);
create index if not exists idx_tokens_recovery on tokens(recovery_key);
create index if not exists idx_tokens_password on tokens(password_hash);
create index if not exists idx_messages_ticket on ticket_messages(ticket_id);
create index if not exists idx_audit_school on audit_logs(school_id);
create index if not exists idx_users_auth on users(auth_id);
create index if not exists idx_users_school on users(school_id);

-- Enable Row Level Security
alter table schools enable row level security;
alter table users enable row level security;
alter table tokens enable row level security;
alter table tickets enable row level security;
alter table ticket_messages enable row level security;
alter table counselor_notes enable row level security;
alter table audit_logs enable row level security;
alter table interventions enable row level security;
alter table help_articles enable row level security;
alter table faq_items enable row level security;
alter table news_articles enable row level security;
alter table contact_messages enable row level security;
alter table supervision_notices enable row level security;
alter table regional_schools enable row level security;

-- RLS Policies for schools
create policy "Schools are viewable by everyone" on schools for select using (true);
create policy "Schools can be inserted by authenticated users" on schools for insert with check (true);
create policy "Schools can be updated by authenticated users" on schools for update using (true);

-- RLS Policies for users
create policy "Users can view own profile" on users for select using (auth.uid() = auth_id);
create policy "Admins can view all users" on users for select using (
  exists (select 1 from users where auth_id = auth.uid() and role = 'admin')
);
create policy "Users can update own profile" on users for update using (auth.uid() = auth_id);

-- RLS Policies for tokens
create policy "Tokens are viewable by authenticated users" on tokens for select using (auth.role() = 'authenticated');
create policy "Tokens can be managed by admins" on tokens for all using (
  exists (select 1 from users where auth_id = auth.uid() and role = 'admin')
);

-- RLS Policies for tickets
create policy "Tickets are viewable by school staff" on tickets for select using (true);
create policy "Anyone can create tickets" on tickets for insert with check (true);
create policy "Tickets can be updated by staff" on tickets for update using (auth.role() = 'authenticated');

-- RLS Policies for messages
create policy "Messages viewable for related ticket" on ticket_messages for select using (true);
create policy "Anyone can insert messages" on ticket_messages for insert with check (true);

-- RLS Policies for audit logs
create policy "Audit logs viewable by authenticated users" on audit_logs for select using (auth.role() = 'authenticated');
create policy "System can insert audit logs" on audit_logs for insert with check (true);

-- RLS Policies for interventions
create policy "Interventions viewable by authenticated users" on interventions for select using (auth.role() = 'authenticated');
create policy "Interventions can be managed by staff" on interventions for all using (auth.role() = 'authenticated');

-- RLS Policies for help articles, FAQs, news, regional_schools, contact, supervision
create policy "Help articles are public" on help_articles for select using (true);
create policy "FAQ items are public" on faq_items for select using (true);
create policy "News articles are public" on news_articles for select using (true);
create policy "Regional schools are public" on regional_schools for select using (true);
create policy "Anyone can submit contact message" on contact_messages for insert with check (true);
create policy "Staff can view contact message" on contact_messages for select using (auth.role() = 'authenticated');
create policy "Supervision notices viewable by staff" on supervision_notices for select using (auth.role() = 'authenticated');
create policy "Staff can create supervision notices" on supervision_notices for insert with check (auth.role() = 'authenticated');

-- Function to handle new user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into users (auth_id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Migration helpers for upgrading existing deployments
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
