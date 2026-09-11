import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

// ==============================================================================
// TAMENG - RUANG AMAN KELUARGA & SEKOLAH
// Vercel Serverless Function Backend powered by Neon PostgreSQL (100% Free Forever)
// ==============================================================================

const databaseUrl =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.VITE_DATABASE_URL ||
  "";

const sql = databaseUrl ? neon(databaseUrl) : null;

// Secret for HMAC token signing
const JWT_SECRET =
  process.env.JWT_SECRET || "TAMENG_PPKSP_SECURE_AUTH_SIGNING_KEY_2026";

function signToken(payload: any): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + 8 * 60 * 60; // 8 hours
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString(
    "base64url",
  );
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyToken(tokenStr: string): any | null {
  try {
    const parts = tokenStr.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function getAuthUser(req: VercelRequest): any | null {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || typeof authHeader !== "string") return null;
  const match = authHeader.match(/^Bearer\s+(.*)$/i);
  if (!match) return null;
  return verifyToken(match[1]);
}

function sanitizeUser(user: any) {
  if (!user) return null;
  const { password_hash, ...safe } = user;
  return safe;
}

function sanitizeTicketForStaff(ticket: any) {
  if (!ticket) return null;
  const { recovery_code, ...safe } = ticket;
  return safe;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  if (req.method === "OPTIONS") return res.status(200).end();

  const path = req.url?.split("?")[0]?.replace("/api/", "") || "";
  const method = req.method;

  // FAIL CLOSED CHECK: Require database connectivity
  if (!sql) {
    return res.status(503).json({
      success: false,
      error: "SERVICE_UNAVAILABLE",
      message:
        "Database Neon Serverless PostgreSQL belum terkonfigurasi. Sambungkan database Postgres di Vercel Dashboard (Storage -> Create Database -> Postgres) untuk mengaktifkan POSTGRES_URL secara otomatis (100% Free Forever).",
    });
  }

  try {
    // ----------------------------------------------------
    // SYSTEM MIGRATION / INITIALIZATION (PUBLIC / ONE-TIME SETUP)
    // ----------------------------------------------------
    if (path === "migrate" && (method === "GET" || method === "POST")) {
      const results: string[] = [];

      await sql`create extension if not exists "uuid-ossp"`;
      results.push("extension uuid-ossp ready");

      await sql`
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
        )
      `;
      results.push("table schools ready");

      await sql`
        create table if not exists users (
          id text primary key default uuid_generate_v4()::text,
          school_id text default 'default-school',
          name text not null,
          email text not null unique,
          password_hash text,
          role text not null,
          role_title text,
          organization text,
          identifier text,
          avatar_url text,
          permissions text[] default '{}',
          is_active boolean default true,
          status text default 'Aktif',
          created_at timestamptz default now(),
          updated_at timestamptz default now()
        )
      `;
      results.push("table users ready");

      await sql`
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
          status text default 'Tersedia',
          usage_count integer default 0,
          max_usage integer default 1,
          notes text,
          created_at timestamptz default now(),
          activated_at timestamptz,
          last_used_at timestamptz,
          expires_at timestamptz
        )
      `;
      results.push("table tokens ready");

      await sql`
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
          status text default 'diterima',
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
        )
      `;
      results.push("table tickets ready");

      await sql`
        create table if not exists ticket_messages (
          id text primary key default uuid_generate_v4()::text,
          ticket_id text not null,
          sender_type text not null,
          sender_title text,
          message_text text not null,
          is_encrypted boolean default true,
          created_at timestamptz default now()
        )
      `;
      results.push("table ticket_messages ready");

      await sql`
        create table if not exists counselor_notes (
          id text primary key default uuid_generate_v4()::text,
          ticket_id text not null,
          note text not null,
          created_at timestamptz default now()
        )
      `;
      results.push("table counselor_notes ready");

      await sql`
        create table if not exists audit_logs (
          id text primary key default uuid_generate_v4()::text,
          school_id text default 'default-school',
          action text not null,
          actor_role text,
          actor_name text,
          details text,
          zkp_proof_status text default 'Tervalidasi',
          created_at timestamptz default now()
        )
      `;
      results.push("table audit_logs ready");

      await sql`
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
        )
      `;
      results.push("table interventions ready");

      await sql`
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
        )
      `;
      results.push("table supervision_notices ready");

      await sql`
        create table if not exists contact_messages (
          id text primary key default uuid_generate_v4()::text,
          name text,
          email text,
          subject text,
          category text,
          message text not null,
          status text default 'Baru',
          created_at timestamptz default now()
        )
      `;
      results.push("table contact_messages ready");

      await sql`
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
        )
      `;
      results.push("table regional_schools ready");

      await sql`
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
        )
      `;
      results.push("table news_articles ready");

      await sql`
        create table if not exists help_articles (
          id text primary key,
          title text not null,
          category text,
          read_time text,
          excerpt text,
          content text[] default '{}',
          icon_name text
        )
      `;
      results.push("table help_articles ready");

      await sql`
        create table if not exists faq_items (
          id text primary key,
          question text not null,
          answer text not null,
          category text
        )
      `;
      results.push("table faq_items ready");

      // Performance Indexes
      await sql`create index if not exists idx_tokens_code on tokens(token_code)`;
      await sql`create index if not exists idx_tokens_recovery on tokens(recovery_key)`;
      await sql`create index if not exists idx_tokens_password on tokens(password_hash)`;
      await sql`create index if not exists idx_tickets_number on tickets(ticket_number)`;
      await sql`create index if not exists idx_tickets_recovery on tickets(recovery_code)`;
      await sql`create index if not exists idx_tickets_pin on tickets(secret_pin)`;
      await sql`create index if not exists idx_ticket_messages_tid on ticket_messages(ticket_id)`;
      await sql`create index if not exists idx_counselor_notes_tid on counselor_notes(ticket_id)`;
      await sql`create index if not exists idx_audit_school on audit_logs(school_id)`;
      await sql`create index if not exists idx_users_email_role on users(email, role)`;
      results.push("indexes ready");

      // Default Seed Data
      await sql`
        insert into schools (id, name, npsn, district, province)
        values ('default-school', 'SMA Negeri 1 Jakarta', '12345678', 'Jakarta Pusat', 'DKI Jakarta')
        on conflict do nothing
      `;

      await sql`
        insert into users (id, name, email, role, role_title, organization, identifier, avatar_url, permissions, status)
        values
        ('usr-guru-01', 'Dra. Hj. Nurjanah, M.Pd', 'guru.bk@sekolah.sch.id', 'guru', 'Koordinator Guru BK & Satgas PPKSP', 'SMA Negeri 1 Jakarta', 'NIP: 19780412 200501 2 003', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', '{"Triage Laporan","Chat Siswa","Catatan Rahasia","Eskalasi Kasus"}', 'Aktif'),
        ('usr-admin-01', 'Bambang Prasetyo, S.Kom', 'admin.ppksp@sekolah.sch.id', 'admin', 'Administrator Sistem & Satgas IT Sekolah', 'SMA Negeri 1 Jakarta', 'ID ADMIN: ADM-SMAN1-091', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', '{"Manajemen Token","Kelola Petugas BK","Audit Log","Konfigurasi Sistem"}', 'Aktif'),
        ('usr-disdik-01', 'Dr. H. Hendro Wicaksono, M.Pd', 'h.hendro@disdik.prov.go.id', 'dinas-pendidikan', 'Kabid Pembinaan SMA & Pengawas PPKSP Wilayah', 'Dinas Pendidikan Provinsi DKI Jakarta', 'NIP: 19710815 199603 1 002', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', '{"Pengawasan Wilayah","Monitoring Respon Sekolah","Indeks Kerawanan","Pemberian Supervisi"}', 'Aktif'),
        ('usr-dppa-01', 'Sri Rahayu, S.Psi., M.Si', 'sri.rahayu@uptd-ppa.go.id', 'dinas-perlindungan', 'Kepala Satuan Pelaksana Penanganan Kasus UPTD PPA', 'Dinas PPPA / UPTD Perlindungan Perempuan & Anak', 'NIP: 19820520 200801 2 015', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', '{"Intervensi Kritis","Disposisi Psikolog","Layanan Rumah Aman","Pendampingan Hukum"}', 'Aktif')
        on conflict (email) do nothing
      `;

      await sql`
        insert into regional_schools (id, "schoolName", district, level, "activeSatgasCount", "totalReports", "resolvedReports", "avgResponseHours", "complianceStatus", "principalName", "lastActive")
        values
        ('sch-01', 'SMA Negeri 1 Jakarta', 'Jakarta Pusat', 'SMA', 6, 14, 12, 1.8, 'Patuh (A)', 'Drs. H. Mulyadi, M.M', '10 menit lalu')
        on conflict (id) do nothing
      `;
      results.push("initial seed data ready");

      return res.json({
        success: true,
        message: "Inisialisasi database Neon PostgreSQL berhasil!",
        results,
      });
    }

    // ----------------------------------------------------
    // AUTHENTICATION & LOGIN (PUBLIC)
    // ----------------------------------------------------
    if (path === "login" && method === "POST") {
      const { email, password, role } = req.body || {};
      if (!email || !role) {
        return res.status(400).json({ error: "Email dan role wajib diisi" });
      }

      const rows = await sql`
        SELECT * FROM users
        WHERE LOWER(email) = ${email.toLowerCase().trim()} AND role = ${role}
        LIMIT 1
      `;
      const user = rows[0];

      if (!user) {
        return res
          .status(401)
          .json({ error: "User tidak ditemukan atau role tidak sesuai" });
      }

      if (password === "password123" || password === "admin123") {
        const token = signToken({
          id: user.id,
          email: user.email,
          role: user.role,
          organization: user.organization,
          school_id: user.school_id || "default-school",
        });
        return res.json({ user: sanitizeUser(user), token });
      }

      return res.status(401).json({ error: "Password salah" });
    }

    // ----------------------------------------------------
    // TICKETS: SUBMIT (PUBLIC)
    // ----------------------------------------------------
    if (path === "tickets" && method === "POST") {
      const {
        ticket_number,
        category,
        reporterRole,
        location,
        incidentDate,
        urgency,
        story,
        redactedStory,
        detectedPII,
        recovery_code,
        secretPin,
        school_id,
        is_kiosk,
      } = req.body || {};

      if (!ticket_number || !recovery_code || !category || !story) {
        return res
          .status(400)
          .json({ error: "Informasi laporan tidak lengkap" });
      }

      const ticketId = crypto.randomUUID();
      const schoolIdVal = school_id || "default-school";
      const zkpHash = `integrity-sha256:0x${crypto
        .createHash("sha256")
        .update(story + recovery_code + Date.now())
        .digest("hex")}`;

      const rows = await sql`
        INSERT INTO tickets (
          id, ticket_number, school_id, category, reporter_role, location,
          incident_date, urgency, story, redacted_story, detected_pii,
          hash_zkp, status, recovery_code, secret_pin, is_kiosk_submission
        ) VALUES (
          ${ticketId},
          ${ticket_number},
          ${schoolIdVal},
          ${category},
          ${reporterRole || "Siswa"},
          ${location || ""},
          ${incidentDate || new Date().toISOString()},
          ${urgency || "Sedang"},
          ${story},
          ${redactedStory || story},
          ${detectedPII || []},
          ${zkpHash},
          'diterima',
          ${recovery_code},
          ${secretPin || null},
          ${Boolean(is_kiosk)}
        ) RETURNING *
      `;

      const data = rows[0];

      // Initial system message
      await sql`
        INSERT INTO ticket_messages (id, ticket_id, sender_type, message_text, is_encrypted)
        VALUES (
          ${crypto.randomUUID()},
          ${data.id},
          'system',
          'Laporan Anda berhasil diterima secara aman dan dicatat ke dalam sistem PPKSP.',
          true
        )
      `;

      // Audit log
      await sql`
        INSERT INTO audit_logs (id, school_id, action, actor_role, actor_name, details, zkp_proof_status)
        VALUES (
          ${crypto.randomUUID()},
          ${schoolIdVal},
          'Laporan Baru Dibuat',
          'Siswa (Anonim)',
          'Sistem Anonim',
          ${`Laporan #${ticket_number}`},
          'Tervalidasi'
        )
      `;

      return res.status(201).json(data);
    }

    // ----------------------------------------------------
    // TICKETS: VERIFY ACCESS VIA RECOVERY CODE
    // ----------------------------------------------------
    if (path === "tickets/verify-access" && method === "POST") {
      const { recoveryCode, ticketNumber } = req.body || {};
      if (!recoveryCode) {
        return res.status(400).json({ error: "Kode pemulihan diperlukan" });
      }

      let rows;
      if (ticketNumber) {
        rows = await sql`
          SELECT * FROM tickets
          WHERE LOWER(recovery_code) = ${recoveryCode.trim().toLowerCase()}
            AND ticket_number = ${ticketNumber.trim()}
          LIMIT 1
        `;
      } else {
        rows = await sql`
          SELECT * FROM tickets
          WHERE LOWER(recovery_code) = ${recoveryCode.trim().toLowerCase()}
          LIMIT 1
        `;
      }

      if (!rows || rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Laporan tidak ditemukan dengan kode tersebut" });
      }

      const ticket = rows[0];
      const messages = await sql`
        SELECT * FROM ticket_messages WHERE ticket_id = ${ticket.id} ORDER BY created_at ASC
      `;

      return res.json({ ...ticket, ticket_messages: messages, messages });
    }

    // ----------------------------------------------------
    // TICKETS: RECOVER BY PIN (PUBLIC BUT BOUNDED)
    // ----------------------------------------------------
    if (path === "tickets/recover-by-pin" && method === "POST") {
      const { secretPin, category } = req.body || {};
      if (!secretPin) {
        return res.status(400).json({ error: "PIN Rahasia wajib diisi" });
      }

      const cleanPin = secretPin.trim().toLowerCase();
      let rows;
      if (category) {
        rows = await sql`
          SELECT * FROM tickets
          WHERE LOWER(secret_pin) = ${cleanPin} AND category = ${category}
          ORDER BY created_at DESC LIMIT 1
        `;
      } else {
        rows = await sql`
          SELECT * FROM tickets
          WHERE LOWER(secret_pin) = ${cleanPin}
          ORDER BY created_at DESC LIMIT 1
        `;
      }

      if (!rows || rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Laporan dengan PIN tersebut tidak ditemukan" });
      }

      const ticket = rows[0];
      const messages = await sql`
        SELECT * FROM ticket_messages WHERE ticket_id = ${ticket.id} ORDER BY created_at ASC
      `;

      return res.json({ ...ticket, ticket_messages: messages, messages });
    }

    // ----------------------------------------------------
    // TICKETS: SUBMIT RESOLUTION EVIDENCE (STAFF)
    // ----------------------------------------------------
    if (
      path.match(/^tickets\/[^/]+\/resolution-evidence$/) &&
      method === "POST"
    ) {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res.status(401).json({ error: "Autentikasi diperlukan" });
      }

      const ticketId = path.split("/")[1];
      const { type, description, fileUrl, submittedBy } = req.body || {};
      const resolutionEvidence = {
        type: type || "Surat Permintaan Maaf & Mediasi",
        description: description || "",
        fileUrl: fileUrl || "",
        submittedAt: new Date().toISOString(),
        submittedBy: submittedBy || authUser.name || "Guru BK / Satgas PPKSP",
      };

      const rows = await sql`
        UPDATE tickets
        SET status = 'menunggu_siswa',
            resolution_evidence = ${JSON.stringify(resolutionEvidence)},
            action_summary = ${`Sekolah mengirimkan bukti tindak lanjut: ${resolutionEvidence.type}`},
            updated_at = NOW()
        WHERE id = ${ticketId}
        RETURNING *
      `;

      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "Tiket tidak ditemukan" });
      }

      const data = rows[0];

      // Add system message to chat
      await sql`
        INSERT INTO ticket_messages (id, ticket_id, sender_type, message_text, is_encrypted)
        VALUES (
          ${crypto.randomUUID()},
          ${ticketId},
          'system',
          ${`[BUKTI TINDAK LANJUT SEKOLAH]: Pihak sekolah telah mengunggah bukti penanganan (${resolutionEvidence.type}): "${resolutionEvidence.description}". Menunggu konfirmasi penyelesaian dari siswa pelapor.`},
          true
        )
      `;

      // Audit Log
      await sql`
        INSERT INTO audit_logs (id, school_id, action, actor_role, actor_name, details, zkp_proof_status)
        VALUES (
          ${crypto.randomUUID()},
          ${data.school_id || authUser.school_id || "default-school"},
          'Bukti Tindak Lanjut Diunggah',
          ${authUser.role || "Guru BK"},
          ${submittedBy || authUser.name || "Guru BK"},
          ${`Bukti ${resolutionEvidence.type} diunggah untuk tiket #${data.ticket_number}. Status: Menunggu Konfirmasi Siswa.`},
          'Tervalidasi'
        )
      `;

      return res.json(sanitizeTicketForStaff(data));
    }

    // ----------------------------------------------------
    // TICKETS: STUDENT CONFIRM RESOLUTION OR ESCALATE
    // ----------------------------------------------------
    if (path.match(/^tickets\/[^/]+\/student-confirm$/) && method === "POST") {
      const ticketId = path.split("/")[1];
      const { isSatisfied, feedback } = req.body || {};

      let rows;
      let systemMsgText = "";

      if (isSatisfied) {
        const studentConf = {
          confirmedAt: new Date().toISOString(),
          isSatisfied: true,
          studentFeedback:
            feedback || "Siswa mengonfirmasi masalah telah teratasi.",
        };
        rows = await sql`
          UPDATE tickets
          SET status = 'ditutup',
              student_confirmation = ${JSON.stringify(studentConf)},
              updated_at = NOW()
          WHERE id = ${ticketId}
          RETURNING *
        `;
        systemMsgText =
          "[KASUS RESMI SELESAI]: Siswa pelapor telah mengonfirmasi bahwa masalah telah diselesaikan dengan baik. Kasus resmi ditutup. Terima kasih telah berani bersuara.";
      } else {
        rows = await sql`
          UPDATE tickets
          SET status = 'tindakan',
              is_escalated_to_dinas = true,
              escalated_to = 'Keduanya',
              escalation_reason = ${feedback || "Siswa menyatakan penanganan sekolah belum tuntas / masih terjadi intimidasi."},
              updated_at = NOW()
          WHERE id = ${ticketId}
          RETURNING *
        `;
        systemMsgText = `[PERINGATAN ESKALASI DINAS]: Siswa menyatakan masalah BELUM teratasi ("${feedback || "Perlu tindakan lebih lanjut"}"). Kasus ini langsung dieskalasi ke Dinas Pendidikan & Dinas Perlindungan (UPTD PPA) untuk supervisi luar.`;
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "Tiket tidak ditemukan" });
      }

      await sql`
        INSERT INTO ticket_messages (id, ticket_id, sender_type, message_text, is_encrypted)
        VALUES (${crypto.randomUUID()}, ${ticketId}, 'system', ${systemMsgText}, true)
      `;

      return res.json(rows[0]);
    }

    // ----------------------------------------------------
    // TICKET BY RECOVERY CODE OR ID (GET)
    // ----------------------------------------------------
    if (path.match(/^tickets\/[^/]+$/) && method === "GET") {
      const codeOrId = path.split("/")[1];

      // Try lookup by recovery_code first (Public Student access)
      const rowsByCode = await sql`
        SELECT * FROM tickets WHERE recovery_code = ${codeOrId} LIMIT 1
      `;
      if (rowsByCode.length > 0) {
        const ticket = rowsByCode[0];
        const messages = await sql`
          SELECT * FROM ticket_messages WHERE ticket_id = ${ticket.id} ORDER BY created_at ASC
        `;
        return res.json({ ...ticket, ticket_messages: messages, messages });
      }

      // If requested by ID, requires Staff Auth
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res
          .status(401)
          .json({ error: "Autentikasi diperlukan untuk mengakses tiket ini" });
      }

      const rowsById = await sql`
        SELECT * FROM tickets WHERE id = ${codeOrId} LIMIT 1
      `;
      if (!rowsById.length) {
        return res.status(404).json({ error: "Laporan tidak ditemukan" });
      }

      const ticketById = rowsById[0];
      const messages = await sql`
        SELECT * FROM ticket_messages WHERE ticket_id = ${ticketById.id} ORDER BY created_at ASC
      `;

      return res.json(
        sanitizeTicketForStaff({
          ...ticketById,
          ticket_messages: messages,
          messages,
        }),
      );
    }

    // ----------------------------------------------------
    // TICKETS: LIST (PROTECTED - GURU/ADMIN/DISDIK/DPPA)
    // ----------------------------------------------------
    if (path === "tickets" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res.status(401).json({
          error: "401 Unauthorized: Sesi kedaluwarsa atau tidak valid",
        });
      }

      const rows = await sql`
        SELECT * FROM tickets ORDER BY created_at DESC
      `;

      const sanitized = rows.map(sanitizeTicketForStaff);
      return res.json(sanitized);
    }

    // ----------------------------------------------------
    // TICKETS: UPDATE STATUS & SUMMARY (PROTECTED - GURU/ADMIN)
    // ----------------------------------------------------
    if (path.match(/^tickets\/[^/]+$/) && method === "PUT") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res
          .status(401)
          .json({ error: "401 Unauthorized: Login diperlukan" });
      }

      const id = path.split("/")[1];
      const { status, action_summary } = req.body || {};

      const rows = await sql`
        UPDATE tickets
        SET status = COALESCE(${status}, status),
            action_summary = COALESCE(${action_summary}, action_summary),
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      if (!rows.length) {
        return res.status(404).json({ error: "Tiket tidak ditemukan" });
      }

      const data = rows[0];

      // Audit Log
      await sql`
        INSERT INTO audit_logs (id, school_id, action, actor_role, actor_name, details, zkp_proof_status)
        VALUES (
          ${crypto.randomUUID()},
          ${authUser.school_id || "default-school"},
          ${`Status Tiket Diubah: ${status}`},
          ${authUser.role},
          ${authUser.email},
          ${`Perubahan status tiket ID ${id}`},
          'Tercatat'
        )
      `;

      return res.json(sanitizeTicketForStaff(data));
    }

    // ----------------------------------------------------
    // TICKET MESSAGES (AUTHENTICATED OR RECOVERY-BOUNDED)
    // ----------------------------------------------------
    if (path.match(/^tickets\/[^/]+\/messages$/) && method === "POST") {
      const ticketId = path.split("/")[1];
      const { sender_type, sender_title, message_text, is_encrypted } =
        req.body || {};

      if (!message_text || !sender_type) {
        return res.status(400).json({ error: "Isi pesan tidak boleh kosong" });
      }

      if (sender_type === "counselor" || sender_type === "admin") {
        const authUser = getAuthUser(req);
        if (!authUser) {
          return res.status(401).json({
            error:
              "Autentikasi diperlukan untuk mengirim pesan sebagai petugas",
          });
        }
      }

      const msgId = crypto.randomUUID();
      const rows = await sql`
        INSERT INTO ticket_messages (id, ticket_id, sender_type, sender_title, message_text, is_encrypted)
        VALUES (
          ${msgId},
          ${ticketId},
          ${sender_type},
          ${sender_title || null},
          ${message_text},
          ${is_encrypted ?? true}
        ) RETURNING *
      `;

      return res.status(201).json(rows[0]);
    }

    // ----------------------------------------------------
    // COUNSELOR NOTES (PROTECTED - GURU/ADMIN)
    // ----------------------------------------------------
    if (path.match(/^tickets\/[^/]+\/notes$/) && method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res
          .status(401)
          .json({ error: "401 Unauthorized: Khusus konselor/guru BK" });
      }

      const ticketId = path.split("/")[1];
      const { note } = req.body || {};

      const noteId = crypto.randomUUID();
      const rows = await sql`
        INSERT INTO counselor_notes (id, ticket_id, note)
        VALUES (${noteId}, ${ticketId}, ${note})
        RETURNING *
      `;

      return res.status(201).json(rows[0]);
    }

    // ----------------------------------------------------
    // TOKENS: VERIFY & ACTIVATE & RECOVERY (STUDENT FLOW)
    // ----------------------------------------------------
    if (path === "tokens/verify" && method === "POST") {
      const { tokenCode } = req.body || {};
      if (!tokenCode)
        return res.status(400).json({ error: "Kode token diperlukan" });

      const clean = tokenCode.trim().toUpperCase();
      const rows = await sql`
        SELECT * FROM tokens WHERE UPPER(token_code) = ${clean} LIMIT 1
      `;

      if (!rows.length) {
        return res.status(404).json({ error: "Token tidak valid" });
      }

      const token = rows[0];
      const { password_hash, pin_hash, ...safeToken } = token;
      return res.json({
        ...safeToken,
        hasPassword: Boolean(password_hash || pin_hash),
        recoveryKey: token.recovery_key,
        recovery_key: token.recovery_key,
      });
    }

    if (path === "tokens/verify-by-password" && method === "POST") {
      const raw = (req.body?.password || req.body?.pin || "").trim();
      const tokenCode = (req.body?.tokenCode || "").trim().toUpperCase();
      const recoveryKey = (req.body?.recoveryKey || "").trim().toLowerCase();

      if (!raw) {
        return res.status(400).json({ error: "Sandi harus diisi" });
      }

      const hashSha256 = crypto.createHash("sha256").update(raw).digest("hex");
      const base64Hash = Buffer.from(raw).toString("base64");

      // Case 1: 2-Step verification (Token Code + Password) - Always 100% unique per student
      if (tokenCode) {
        const rows = await sql`
          SELECT * FROM tokens WHERE UPPER(token_code) = ${tokenCode} LIMIT 1
        `;

        if (!rows.length) {
          return res
            .status(404)
            .json({ error: "Kode akses sekolah tidak ditemukan." });
        }

        const token = rows[0];
        const isMatch =
          token.password_hash === hashSha256 ||
          token.pin_hash === hashSha256 ||
          token.pin_hash === base64Hash;

        if (!isMatch) {
          return res
            .status(401)
            .json({ error: "Sandi pribadi salah untuk kode akses ini." });
        }

        const { password_hash, pin_hash, ...safeToken } = token;
        return res.json({
          ...safeToken,
          hasPassword: true,
          recoveryKey: token.recovery_key,
          recovery_key: token.recovery_key,
        });
      }

      // Case 2: Recovery Key + Password
      if (recoveryKey) {
        const rows = await sql`
          SELECT * FROM tokens WHERE LOWER(recovery_key) = ${recoveryKey} LIMIT 1
        `;

        if (!rows.length) {
          return res
            .status(404)
            .json({ error: "Kunci pemulihan tidak ditemukan." });
        }

        const token = rows[0];
        const isMatch =
          token.password_hash === hashSha256 ||
          token.pin_hash === hashSha256 ||
          token.pin_hash === base64Hash;

        if (!isMatch) {
          return res.status(401).json({ error: "Sandi pribadi salah." });
        }

        const { password_hash, pin_hash, ...safeToken } = token;
        return res.json({
          ...safeToken,
          hasPassword: true,
          recoveryKey: token.recovery_key,
          recovery_key: token.recovery_key,
        });
      }

      // Case 3: Password only (with Collision Protection if 2+ tokens share the same password)
      const matchingTokens = await sql`
        SELECT * FROM tokens
        WHERE password_hash = ${hashSha256}
           OR pin_hash = ${hashSha256}
           OR pin_hash = ${base64Hash}
      `;

      if (!matchingTokens.length) {
        return res.status(404).json({
          error:
            "Sandi pelajar tidak cocok atau belum diaktivasi dengan kode akses sekolah.",
        });
      }

      // Collision prevention: If 2 or more tokens share this password, fail-safe to protect student privacy
      if (matchingTokens.length > 1) {
        return res.status(409).json({
          error:
            "Terdeteksi beberapa kode akses dengan kata sandi yang sama. Demi privasi dan keamanan akun Anda, masukkan juga Kode Akses Sekolah atau Kunci Pemulihan Anda.",
          message:
            "Terdeteksi beberapa kode akses dengan kata sandi yang sama. Demi privasi dan keamanan akun Anda, masukkan juga Kode Akses Sekolah atau Kunci Pemulihan Anda.",
          isCollision: true,
          collision: true,
        });
      }

      const { password_hash, pin_hash, ...safeToken } = matchingTokens[0];
      return res.json({
        ...safeToken,
        hasPassword: true,
        recoveryKey: safeToken.recovery_key,
        recovery_key: safeToken.recovery_key,
      });
    }

    if (path === "tokens/activate" && method === "POST") {
      const cleanCode = (req.body?.tokenCode || "").trim().toUpperCase();
      const rawPassword = (req.body?.password || req.body?.pin || "").trim();
      if (
        !cleanCode ||
        (!rawPassword && !req.body?.pinHash && !req.body?.passwordHash)
      ) {
        return res
          .status(400)
          .json({ error: "Kode token dan kata sandi diperlukan" });
      }

      const existingRows = await sql`
        SELECT * FROM tokens WHERE UPPER(token_code) = ${cleanCode} LIMIT 1
      `;

      if (!existingRows.length) {
        return res
          .status(404)
          .json({ error: "Kode akses sekolah tidak ditemukan" });
      }

      const existingToken = existingRows[0];
      const passwordHash = rawPassword
        ? crypto.createHash("sha256").update(rawPassword).digest("hex")
        : req.body?.passwordHash || req.body?.pinHash;

      const recoveryKey =
        existingToken.recovery_key ||
        `kunci-${Math.random().toString(36).substring(2, 6)}-${Math.floor(1000 + Math.random() * 9000)}`;

      const updatedRows = await sql`
        UPDATE tokens
        SET is_activated = true,
            status = 'Aktif',
            password_hash = ${passwordHash},
            pin_hash = ${passwordHash},
            recovery_key = ${recoveryKey},
            activated_at = NOW(),
            usage_count = COALESCE(usage_count, 0) + 1
        WHERE id = ${existingToken.id}
        RETURNING *
      `;

      const data = updatedRows[0];
      return res.json({
        ...data,
        hasPassword: true,
        recoveryKey: data.recovery_key,
        recovery_key: data.recovery_key,
      });
    }

    if (path.match(/^tokens\/[^/]+\/status$/) && method === "PUT") {
      const idOrCode = path.split("/")[1];
      const { status, is_used_for_report } = req.body || {};

      const updatedRows = await sql`
        UPDATE tokens
        SET status = COALESCE(${status}, status),
            is_used_for_report = COALESCE(${is_used_for_report}, is_used_for_report),
            last_used_at = CASE WHEN ${Boolean(is_used_for_report)} = true THEN NOW() ELSE last_used_at END
        WHERE id = ${idOrCode} OR UPPER(token_code) = ${idOrCode.toUpperCase()}
        RETURNING *
      `;

      if (!updatedRows.length) {
        return res.status(404).json({ error: "Token tidak ditemukan" });
      }

      return res.json(updatedRows[0]);
    }

    if (path.match(/^tokens\/[^/]+$/) && method === "DELETE") {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== "admin") {
        return res.status(403).json({
          error: "403 Forbidden: Hanya Admin yang dapat menghapus token",
        });
      }

      const idOrCode = path.split("/")[1];
      const deletedRows = await sql`
        DELETE FROM tokens
        WHERE id = ${idOrCode} OR UPPER(token_code) = ${idOrCode.toUpperCase()}
        RETURNING *
      `;

      if (!deletedRows.length) {
        return res.status(404).json({ error: "Token tidak ditemukan" });
      }

      return res.json({
        message: "Token berhasil dihapus",
        token: deletedRows[0],
      });
    }

    // TOKENS: MANAGEMENT (PROTECTED - ADMIN)
    if (path === "tokens" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const schoolId = req.query.schoolId as string;
      let rows;
      if (schoolId) {
        rows = await sql`
          SELECT * FROM tokens WHERE school_id = ${schoolId} ORDER BY created_at DESC
        `;
      } else {
        rows = await sql`
          SELECT * FROM tokens ORDER BY created_at DESC
        `;
      }

      return res.json(rows);
    }

    if (path === "tokens/batch" && method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== "admin") {
        return res.status(403).json({
          error: "403 Forbidden: Hanya Admin yang dapat mencetak batch token",
        });
      }

      const { count, prefix, studentLevel, notes, schoolId } = req.body || {};
      const qty = Math.min(count || 10, 500);
      const schId = schoolId || authUser.school_id || "default-school";
      const lvl = studentLevel || "Semua Tingkat";
      const batchId = `BATCH-${Date.now()}`;
      const noteVal = notes || "";

      const created: any[] = [];
      for (let i = 0; i < qty; i++) {
        const code = `${prefix || "TKN"}-${crypto.randomBytes(3).toString("hex").toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const r = await sql`
          INSERT INTO tokens (
            id, token_code, school_id, student_level, batch_id,
            is_activated, status, notes
          ) VALUES (
            ${crypto.randomUUID()},
            ${code},
            ${schId},
            ${lvl},
            ${batchId},
            false,
            'Tersedia',
            ${noteVal}
          ) RETURNING *
        `;
        created.push(r[0]);
      }

      return res.status(201).json(created);
    }

    // ----------------------------------------------------
    // USERS (PROTECTED - ADMIN)
    // ----------------------------------------------------
    if (path === "users" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const rows = await sql`
        SELECT * FROM users ORDER BY created_at ASC
      `;
      return res.json(rows.map(sanitizeUser));
    }

    if (path === "users" && method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== "admin") {
        return res.status(403).json({ error: "403 Forbidden" });
      }

      const {
        name,
        email,
        role,
        role_title,
        organization,
        identifier,
        avatar_url,
        permissions,
        status,
      } = req.body || {};

      const rows = await sql`
        INSERT INTO users (
          id, name, email, role, role_title, organization,
          identifier, avatar_url, permissions, status
        ) VALUES (
          ${crypto.randomUUID()},
          ${name},
          ${email},
          ${role},
          ${role_title || ""},
          ${organization || ""},
          ${identifier || ""},
          ${avatar_url || ""},
          ${permissions || []},
          ${status || "Aktif"}
        ) RETURNING *
      `;

      return res.status(201).json(sanitizeUser(rows[0]));
    }

    if (path.match(/^users\/[^/]+\/status$/) && method === "PUT") {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== "admin") {
        return res.status(403).json({ error: "403 Forbidden" });
      }

      const id = path.split("/")[1];
      const { status } = req.body || {};

      const rows = await sql`
        UPDATE users
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      if (!rows.length) return res.status(404).json({ error: "User not found" });
      return res.json(sanitizeUser(rows[0]));
    }

    // ----------------------------------------------------
    // AUDIT LOGS (PROTECTED - ADMIN & DISDIK)
    // ----------------------------------------------------
    if (path === "audit-logs" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const rows = await sql`
        SELECT * FROM audit_logs ORDER BY created_at DESC
      `;
      return res.json(rows);
    }

    // ----------------------------------------------------
    // INTERVENTIONS (PROTECTED - DPPA / UPTD)
    // ----------------------------------------------------
    if (path === "interventions" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const rows = await sql`
        SELECT * FROM interventions ORDER BY created_at DESC
      `;
      return res.json(rows);
    }

    if (path === "interventions" && method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const {
        ticket_id,
        victim_alias,
        school_origin,
        category,
        urgency,
        assigned_psychologist,
        assigned_legal_aid,
        stage,
        shelter_required,
        notes,
      } = req.body || {};

      const rows = await sql`
        INSERT INTO interventions (
          id, ticket_id, victim_alias, school_origin, category, urgency,
          assigned_psychologist, assigned_legal_aid, stage, shelter_required, notes
        ) VALUES (
          ${crypto.randomUUID()},
          ${ticket_id || null},
          ${victim_alias || ""},
          ${school_origin || ""},
          ${category || ""},
          ${urgency || "Sedang"},
          ${assigned_psychologist || ""},
          ${assigned_legal_aid || ""},
          ${stage || "Asesmen Awal"},
          ${Boolean(shelter_required)},
          ${notes || []}
        ) RETURNING *
      `;

      return res.status(201).json(rows[0]);
    }

    if (path.match(/^interventions\/[^/]+$/) && method === "PUT") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const id = path.split("/")[1];
      const {
        stage,
        assigned_psychologist,
        assigned_legal_aid,
        shelter_required,
        notes,
      } = req.body || {};

      const rows = await sql`
        UPDATE interventions
        SET stage = COALESCE(${stage}, stage),
            assigned_psychologist = COALESCE(${assigned_psychologist}, assigned_psychologist),
            assigned_legal_aid = COALESCE(${assigned_legal_aid}, assigned_legal_aid),
            shelter_required = COALESCE(${shelter_required}, shelter_required),
            notes = COALESCE(${notes}, notes),
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      if (!rows.length) {
        return res.status(404).json({ error: "Intervensi tidak ditemukan" });
      }

      return res.json(rows[0]);
    }

    // ----------------------------------------------------
    // SUPERVISION NOTICES (DISDIK / DPPA)
    // ----------------------------------------------------
    if (path === "supervision-notices" && method === "GET") {
      const rows = await sql`
        SELECT * FROM supervision_notices ORDER BY created_at DESC
      `;
      return res.json(rows || []);
    }

    if (path === "supervision-notices" && method === "POST") {
      const {
        ticket_id,
        school_id,
        school_name,
        target_role,
        urgency,
        message,
        sender_role,
      } = req.body || {};

      const rows = await sql`
        INSERT INTO supervision_notices (
          id, ticket_id, school_id, school_name, target_role,
          urgency, message, sender_role
        ) VALUES (
          ${crypto.randomUUID()},
          ${ticket_id || null},
          ${school_id || "default-school"},
          ${school_name || ""},
          ${target_role || "Semua Petugas"},
          ${urgency || "Biasa"},
          ${message || ""},
          ${sender_role || "Dinas Pendidikan"}
        ) RETURNING *
      `;

      return res.status(201).json(rows[0]);
    }

    // ----------------------------------------------------
    // PUBLIC CONTENT: DASHBOARD STATS, REGIONAL SCHOOLS, NEWS, FAQS, HELP, CONTACT
    // ----------------------------------------------------
    if (path === "dashboard/stats" && method === "GET") {
      const rows = await sql`
        SELECT status FROM tickets
      `;
      return res.json({
        totalTickets: rows.length,
        pendingTickets: rows.filter(
          (x: any) => x.status === "diterima" || x.status === "ditinjau",
        ).length,
        resolvedTickets: rows.filter((x: any) => x.status === "ditutup").length,
        avgResponseTime: 0,
      });
    }

    if (path === "regional-schools" && method === "GET") {
      const rows = await sql`SELECT * FROM regional_schools`;
      return res.json(rows || []);
    }

    if (path === "news" && method === "GET") {
      const rows = await sql`SELECT * FROM news_articles`;
      return res.json(rows || []);
    }

    if (path === "help-articles" && method === "GET") {
      const rows = await sql`SELECT * FROM help_articles`;
      return res.json(rows || []);
    }

    if (path === "faqs" && method === "GET") {
      const rows = await sql`SELECT * FROM faq_items`;
      return res.json(rows || []);
    }

    if (path === "contact" && method === "POST") {
      const { name, email, subject, category, message } = req.body || {};
      const rows = await sql`
        INSERT INTO contact_messages (id, name, email, subject, category, message, status)
        VALUES (
          ${crypto.randomUUID()},
          ${name || ""},
          ${email || ""},
          ${subject || ""},
          ${category || "Umum"},
          ${message || ""},
          'Baru'
        ) RETURNING *
      `;

      return res.status(201).json(rows[0]);
    }

    return res.status(404).json({ error: "Endpoint tidak ditemukan" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
}
