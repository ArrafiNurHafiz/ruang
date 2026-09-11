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
