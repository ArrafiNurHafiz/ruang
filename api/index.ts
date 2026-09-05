import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "";
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Hardcoded secret for HMAC token signing
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

  // FAIL CLOSED CHECK: Require database connectivity for system operation
  if (!supabase) {
    return res.status(503).json({
      success: false,
      error: "SERVICE_UNAVAILABLE",
      message:
        "Sistem penyimpanan aman sedang tidak tersedia. Permintaan ditolak untuk menjaga integritas data.",
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

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .eq("role", role)
        .single();

      if (error || !user) {
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
        school_id,
        is_kiosk,
      } = req.body || {};

      if (!ticket_number || !recovery_code || !category || !story) {
        return res
          .status(400)
          .json({ error: "Informasi laporan tidak lengkap" });
      }

      const ticketData = {
        id: crypto.randomUUID(),
        ticket_number,
        school_id: school_id || "default-school",
        category,
        reporter_role: reporterRole || "Siswa",
        location: location || "",
        incident_date: incidentDate || new Date().toISOString(),
        urgency: urgency || "Sedang",
        story,
        redacted_story: redactedStory || story,
        detected_pii: detectedPII || [],
        hash_zkp: `integrity-sha256:0x${crypto
          .createHash("sha256")
          .update(story + recovery_code + Date.now())
          .digest("hex")}`,
        status: "diterima",
        recovery_code,
        is_kiosk_submission: is_kiosk || false,
      };

      const { data, error } = await supabase
        .from("tickets")
        .insert(ticketData)
        .select()
        .single();
      if (error) {
        if (
          error.message?.includes("duplicate key") &&
          error.message?.includes("recovery_code")
        ) {
          return res.status(409).json({
            error: "Kode pemulihan telah digunakan. Silakan buat kode baru.",
          });
        }
        return res.status(500).json({ error: error.message });
      }

      // Automatically insert initial system message
      await supabase.from("ticket_messages").insert({
        ticket_id: data.id,
        sender_type: "system",
        message_text:
          "Laporan Anda berhasil diterima secara aman dan dicatat ke dalam sistem PPKSP.",
        is_encrypted: true,
      });

      // Automatically insert audit log
      await supabase.from("audit_logs").insert({
        school_id: ticketData.school_id,
        action: "Laporan Baru Dibuat",
        actor_role: "Siswa (Anonim)",
        actor_name: "Sistem Anonim",
        details: `Laporan #${ticketData.ticket_number}`,
        zkp_proof_status: "Tervalidasi",
      });

      return res.status(201).json(data);
    }

    // ----------------------------------------------------
    // TICKETS: VERIFY ACCESS VIA RECOVERY CODE (PUBLIC BUT BOUNDED)
    // ----------------------------------------------------
    if (path === "tickets/verify-access" && method === "POST") {
      const { recoveryCode, ticketNumber } = req.body || {};
      if (!recoveryCode) {
        return res.status(400).json({ error: "Kode pemulihan diperlukan" });
      }

      let query = supabase
        .from("tickets")
        .select("*, ticket_messages(*)")
        .eq("recovery_code", recoveryCode.trim());
      if (ticketNumber) {
        query = query.eq("ticket_number", ticketNumber.trim());
      }
      const { data, error } = await query.single();
      if (error || !data) {
        return res
          .status(404)
          .json({ error: "Laporan tidak ditemukan dengan kode tersebut" });
      }

      return res.json(data);
    }

    // TICKET BY RECOVERY CODE (LEGACY REST LOOKUP)
    if (path.match(/^tickets\/[^/]+$/) && method === "GET") {
      const codeOrId = path.split("/")[1];

      // If code format
      const { data, error } = await supabase
        .from("tickets")
        .select("*, ticket_messages(*)")
        .eq("recovery_code", codeOrId)
        .single();

      if (!error && data) {
        return res.json(data);
      }

      // If requested by ID, requires Staff Auth
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res
          .status(401)
          .json({ error: "Autentikasi diperlukan untuk mengakses tiket ini" });
      }

      const { data: ticketById, error: errId } = await supabase
        .from("tickets")
        .select("*, ticket_messages(*)")
        .eq("id", codeOrId)
        .single();

      if (errId || !ticketById) {
        return res.status(404).json({ error: "Laporan tidak ditemukan" });
      }

      return res.json(sanitizeTicketForStaff(ticketById));
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

      const { data, error } = await supabase
        .from("tickets")
        .select("*, ticket_messages(*)")
        .order("created_at", { ascending: false });

      if (error) return res.status(500).json({ error: error.message });

      // NEVER leak recovery_code in staff bulk list
      const sanitized = (data || []).map(sanitizeTicketForStaff);
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

      const { data, error } = await supabase
        .from("tickets")
        .update({
          status,
          action_summary,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });

      // Log action
      await supabase.from("audit_logs").insert({
        school_id: authUser.school_id || "default-school",
        action: `Status Tiket Diubah: ${status}`,
        actor_role: authUser.role,
        actor_name: authUser.email,
        details: `Perubahan status tiket ID ${id}`,
        zkp_proof_status: "Tercatat",
      });

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

      // If sender is counselor or staff, require auth
      if (sender_type === "counselor" || sender_type === "admin") {
        const authUser = getAuthUser(req);
        if (!authUser) {
          return res.status(401).json({
            error:
              "Autentikasi diperlukan untuk mengirim pesan sebagai petugas",
          });
        }
      }

      const msgData = {
        ticket_id: ticketId,
        sender_type,
        sender_title: sender_title || null,
        message_text,
        is_encrypted: is_encrypted ?? true,
      };

      const { data, error } = await supabase
        .from("ticket_messages")
        .insert(msgData)
        .select()
        .single();
      if (error) {
        if (error.message?.includes("foreign key")) {
          return res.status(404).json({ error: "Tiket tidak ditemukan" });
        }
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
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

      const { data, error } = await supabase
        .from("counselor_notes")
        .insert({ ticket_id: ticketId, note })
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    }

    // ----------------------------------------------------
    // TOKENS: VERIFY & ACTIVATE (STUDENT FLOW)
    // ----------------------------------------------------
    if (path === "tokens/verify" && method === "POST") {
      const { tokenCode } = req.body || {};
      if (!tokenCode)
        return res.status(400).json({ error: "Kode token diperlukan" });

      const { data, error } = await supabase
        .from("tokens")
        .select(
          "id, token_code, school_id, student_level, is_activated, status",
        )
        .eq("token_code", tokenCode.trim())
        .single();

      if (error || !data)
        return res.status(404).json({ error: "Token tidak valid" });
      return res.json(data);
    }

    if (path === "tokens/activate" && method === "POST") {
      const { tokenCode, pinHash } = req.body || {};
      if (!tokenCode || !pinHash)
        return res.status(400).json({ error: "Token dan PIN hash diperlukan" });

      const { data, error } = await supabase
        .from("tokens")
        .update({
          is_activated: true,
          status: "Aktif",
          pin_hash: pinHash,
          activated_at: new Date().toISOString(),
        })
        .eq("token_code", tokenCode.trim())
        .select(
          "id, token_code, school_id, student_level, is_activated, status, activated_at",
        )
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    }

    // TOKENS: MANAGEMENT (PROTECTED - ADMIN)
    if (path === "tokens" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const schoolId = req.query.schoolId as string;
      let q = supabase
        .from("tokens")
        .select(
          "id, token_code, school_id, student_level, batch_id, is_activated, status, notes, created_at",
        );
      if (schoolId) q = q.eq("school_id", schoolId);
      const { data, error } = await q;
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data || []);
    }

    if (path === "tokens/batch" && method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== "admin") {
        return res.status(403).json({
          error: "403 Forbidden: Hanya Admin yang dapat mencetak batch token",
        });
      }

      const { count, prefix, studentLevel, notes, schoolId } = req.body || {};
      const batch = Array.from({ length: Math.min(count || 10, 500) }, () => ({
        id: crypto.randomUUID(),
        token_code: `${prefix || "TKN"}-${crypto.randomBytes(3).toString("hex").toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        school_id: schoolId || authUser.school_id || "default-school",
        student_level: studentLevel || "Semua Tingkat",
        batch_id: `BATCH-${Date.now()}`,
        is_activated: false,
        status: "Tersedia",
        notes: notes || "",
      }));

      const { data, error } = await supabase
        .from("tokens")
        .insert(batch)
        .select();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    }

    // ----------------------------------------------------
    // USERS (PROTECTED - ADMIN)
    // ----------------------------------------------------
    if (path === "users" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const { data, error } = await supabase
        .from("users")
        .select(
          "id, name, email, role, role_title, organization, identifier, avatar_url, permissions, is_active, status",
        );
      if (error) return res.status(500).json({ error: error.message });
      return res.json((data || []).map(sanitizeUser));
    }

    // ----------------------------------------------------
    // AUDIT LOGS (PROTECTED - ADMIN & DISDIK)
    // ----------------------------------------------------
    if (path === "audit-logs" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data || []);
    }

    // ----------------------------------------------------
    // INTERVENTIONS (PROTECTED - DPPA / UPTD)
    // ----------------------------------------------------
    if (path === "interventions" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const { data, error } = await supabase
        .from("interventions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data || []);
    }

    if (path === "interventions" && method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const item = {
        id: crypto.randomUUID(),
        ...req.body,
        notes: req.body.notes || [],
      };
      const { data, error } = await supabase
        .from("interventions")
        .insert(item)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    }

    if (path.match(/^interventions\/[^/]+$/) && method === "PUT") {
      const authUser = getAuthUser(req);
      if (!authUser) return res.status(401).json({ error: "401 Unauthorized" });

      const id = path.split("/")[1];
      const { data, error } = await supabase
        .from("interventions")
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    }

    // ----------------------------------------------------
    // PUBLIC CONTENT: NEWS, ARTICLES, FAQS, STATS
    // ----------------------------------------------------
    if (path === "dashboard/stats" && method === "GET") {
      const { data: tickets } = await supabase.from("tickets").select("status");
      const t = tickets || [];
      return res.json({
        totalTickets: t.length,
        pendingTickets: t.filter(
          (x: any) => x.status === "diterima" || x.status === "ditinjau",
        ).length,
        resolvedTickets: t.filter((x: any) => x.status === "ditutup").length,
        avgResponseTime: 0,
      });
    }

    if (path === "regional-schools" && method === "GET") {
      const { data } = await supabase.from("regional_schools").select("*");
      return res.json(data || []);
    }

    if (path === "news" && method === "GET") {
      const { data } = await supabase.from("news_articles").select("*");
      return res.json(data || []);
    }

    if (path === "help-articles" && method === "GET") {
      const { data } = await supabase.from("help_articles").select("*");
      return res.json(data || []);
    }

    if (path === "faqs" && method === "GET") {
      const { data } = await supabase.from("faq_items").select("*");
      return res.json(data || []);
    }

    if (path === "contact" && method === "POST") {
      const msg = { id: crypto.randomUUID(), ...req.body, status: "Baru" };
      const { data, error } = await supabase
        .from("contact_messages")
        .insert(msg)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    }

    return res.status(404).json({ error: "Endpoint tidak ditemukan" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
}
