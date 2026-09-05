const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, "db.json");

app.use(express.json());

// Simple CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const INITIAL_DATA = {
  tickets: [],
  tokens: [],
  users: [
    {
      id: "usr-guru-01",
      name: "Dra. Hj. Nurjanah, M.Pd",
      email: "guru.bk@sekolah.sch.id",
      password_hash:
        "JTI0MmElMTAkcmU3YVl2WkV3VlphcWRSNmFhRldIeS5Nai8ueHVsVzh3LlEuWjYuNHZ2Lnp5dnZ2dnZ2dg==",
      role: "guru",
      roleTitle: "Koordinator Guru BK & Satgas PPKSP",
      organization: "SMA Negeri 1 Jakarta",
      identifier: "NIP: 19780412 200501 2 003",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      permissions: [
        "Triage Laporan",
        "Chat Siswa",
        "Catatan Rahasia",
        "Eskalasi Kasus",
      ],
    },
    {
      id: "usr-admin-01",
      name: "Bambang Prasetyo, S.Kom",
      email: "admin.ppksp@sekolah.sch.id",
      password_hash:
        "JTI0MmElMTAkcmU3YVl2WkV3VlphcWRSNmFhRldIeS5Nai8ueHVsVzh3LlEuWjYuNHZ2Lnp5dnZ2dnZ2dg==",
      role: "admin",
      roleTitle: "Administrator Sistem & Satgas IT Sekolah",
      organization: "SMA Negeri 1 Jakarta",
      identifier: "ID ADMIN: ADM-SMAN1-091",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      permissions: [
        "Manajemen Token",
        "Kelola Petugas BK",
        "Audit Log",
        "Konfigurasi Sistem",
      ],
    },
    {
      id: "usr-disdik-01",
      name: "Dr. H. Hendro Wicaksono, M.Pd",
      email: "h.hendro@disdik.prov.go.id",
      password_hash:
        "JTI0MmElMTAkcmU3YVl2WkV3VlphcWRSNmFhRldIeS5Nai8ueHVsVzh3LlEuWjYuNHZ2Lnp5dnZ2dnZ2dg==",
      role: "dinas-pendidikan",
      roleTitle: "Kabid Pembinaan SMA & Pengawas PPKSP Wilayah",
      organization: "Dinas Pendidikan Provinsi DKI Jakarta",
      identifier: "NIP: 19710815 199603 1 002",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      permissions: [
        "Pengawasan Wilayah",
        "Monitoring Respon Sekolah",
        "Indeks Kerawanan",
        "Pemberian Supervisi",
      ],
    },
    {
      id: "usr-dinas-pppa-01",
      name: "Sri Rahayu, S.Psi., M.Si",
      email: "sri.rahayu@uptd-ppa.go.id",
      password_hash:
        "JTI0MmElMTAkcmU3YVl2WkV3VlphcWRSNmFhRldIeS5Nai8ueHVsVzh3LlEuWjYuNHZ2Lnp5dnZ2dnZ2dg==",
      role: "dinas-perlindungan",
      roleTitle: "Kepala Satuan Pelaksana Penanganan Kasus UPTD PPA",
      organization: "Dinas PPPA / UPTD Perlindungan Perempuan & Anak",
      identifier: "NIP: 19820520 200801 2 015",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      permissions: [
        "Intervensi Kritis",
        "Disposisi Psikolog",
        "Layanan Rumah Aman",
        "Pendampingan Hukum",
      ],
    },
  ],
  audit_logs: [],
  interventions: [],
  news_articles: [
    {
      id: "news-1",
      title:
        "Sosialisasi Permendikbudristek No. 46 Tahun 2023: Sekolah Wajib Bentuk Satgas PPKSP",
      category: "Regulasi & PPKSP",
      publishedAt: "2 Maret 2025",
      author: "Satgas PPKSP Nasional",
      authorRole: "Puspeka Kemendikbudristek",
      readTime: "4 menit baca",
      illustrationType: "ppksp",
      excerpt:
        "Setiap satuan pendidikan kini diwajibkan membentuk Tim Pencegahan dan Penanganan Kekerasan (TPPK).",
      content: [
        "Sesuai dengan amanat Permendikbudristek No. 46 Tahun 2023, sekolah harus menjadi ruang aman bagi seluruh warga pendidikan.",
        "Pembentukan Satgas PPKSP bertujuan untuk merespon laporan kekerasan secara cepat, rahasia, dan berpihak pada korban.",
      ],
    },
  ],
  regional_schools: [
    {
      id: "sch-01",
      schoolName: "SMA Negeri 1 Jakarta",
      district: "Jakarta Pusat",
      level: "SMA",
      activeSatgasCount: 6,
      totalReports: 14,
      resolvedReports: 12,
      avgResponseHours: 1.8,
      complianceStatus: "Patuh (A)",
      principalName: "Drs. H. Mulyadi, M.M",
      lastActive: "10 menit lalu",
    },
  ],
  help_articles: [
    {
      id: "art-1",
      title: "Bagaimana Cara Melapor Secara Anonim di TAMENG?",
      category: "Cara Melapor",
      readTime: "3 menit",
      iconName: "ShieldAlert",
      excerpt:
        "Panduan 4 langkah mudah melapor tanpa khawatir identitas bocor atau diketahui teman sekelas.",
      content: [
        "1. Masuk ke halaman Lapor Anonim (Ruang Aman).",
        "2. Pilih kategori kejadian dan status keterlibatan Anda (sebagai korban atau saksi).",
        "3. Tuliskan kronologi dengan jelas. Fitur deteksi cerdas TAMENG akan otomatis mendeteksi nama atau kelas yang tidak sengaja tertulis untuk disamarkan.",
        "4. Unggah bukti jika ada (foto/rekaman suara). Sistem kami otomatis membersihkan data lokasi GPS (EXIF) dari file.",
        "5. Simpan Nomor Tiket dan Kode Pemulihan unik Anda untuk memantau status dan berkomunikasi 2-arah dengan Guru BK.",
      ],
    },
  ],
  faq_items: [
    {
      id: "faq-1",
      question:
        "Apakah Guru BK atau Wali Kelas bisa mengetahui siapa yang mengirim laporan?",
      answer:
        "Tidak. Sistem TAMENG tidak menyimpan identitas pelapor, email, nomor ponsel, nama perangkat, maupun alamat IP. Laporan hanya berisi nomor acak (Tiket). Guru BK hanya menerima informasi mengenai kejadian yang Anda ceritakan tanpa mengetahui siapa Anda.",
      category: "Privasi & Kerahasiaan",
    },
  ],
  schools: [
    {
      id: "default-school",
      name: "SMA Negeri 1 Jakarta",
      npsn: "12345678",
      district: "Jakarta Pusat",
      province: "DKI Jakarta",
    },
  ],
};

// Database Helper
const getDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
    return INITIAL_DATA;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
};

const saveDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// API Routes

// Tickets
app.get("/api/tickets", (req, res) => {
  const db = getDB();
  res.json(db.tickets);
});

app.post("/api/tickets", (req, res) => {
  const db = getDB();
  const newTicket = {
    ...req.body,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    messages: [
      {
        id: crypto.randomUUID(),
        sender_type: "system",
        message_text:
          "Laporan Anda berhasil dienkripsi dan diterima oleh Tim Bimbingan Konseling (BK) & Satgas PPKSP Sekolah.",
        created_at: new Date().toISOString(),
        is_encrypted: true,
      },
    ],
  };
  db.tickets.push(newTicket);

  // Add Audit Log
  db.audit_logs.push({
    id: crypto.randomUUID(),
    school_id: newTicket.school_id || "default-school",
    action: "Laporan Baru Dibuat",
    actor_role: "Siswa (Anonim)",
    actor_name: "Sistem",
    details: `Laporan baru #${newTicket.ticket_number} kategori ${newTicket.category}`,
    zkp_proof_status: "Tervalidasi",
    created_at: new Date().toISOString(),
  });

  saveDB(db);
  res.status(201).json(newTicket);
});

app.get("/api/tickets/:recoveryCode", (req, res) => {
  const db = getDB();
  const ticket = db.tickets.find(
    (t) => t.recovery_code === req.params.recoveryCode,
  );
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
});

app.put("/api/tickets/:id", (req, res) => {
  const db = getDB();
  const index = db.tickets.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Ticket not found" });

  db.tickets[index] = {
    ...db.tickets[index],
    ...req.body,
    updated_at: new Date().toISOString(),
  };
  saveDB(db);
  res.json(db.tickets[index]);
});

// Messages
app.post("/api/tickets/:id/messages", (req, res) => {
  const db = getDB();
  const index = db.tickets.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Ticket not found" });

  const newMessage = {
    id: crypto.randomUUID(),
    ...req.body,
    created_at: new Date().toISOString(),
  };

  if (!db.tickets[index].messages) db.tickets[index].messages = [];
  db.tickets[index].messages.push(newMessage);
  db.tickets[index].updated_at = new Date().toISOString();

  saveDB(db);
  res.status(201).json(newMessage);
});

// Tokens
app.get("/api/tokens", (req, res) => {
  const db = getDB();
  const schoolId = req.query.schoolId;
  const tokens = schoolId
    ? db.tokens.filter((t) => t.school_id === schoolId)
    : db.tokens;
  res.json(tokens);
});

app.post("/api/tokens/batch", (req, res) => {
  const db = getDB();
  const { count, prefix, studentLevel, notes, schoolId } = req.body;
  const newTokens = [];
  const batchId = `BATCH-${Date.now()}`;

  for (let i = 0; i < count; i++) {
    const token = {
      id: crypto.randomUUID(),
      token_code: `${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      school_id: schoolId || "default-school",
      student_level: studentLevel,
      batch_id: batchId,
      is_activated: false,
      is_used_for_report: false,
      status: "Tersedia",
      notes: notes,
      created_at: new Date().toISOString(),
    };
    newTokens.push(token);
  }

  db.tokens.push(...newTokens);
  saveDB(db);
  res.status(201).json(newTokens);
});

app.post("/api/tokens/verify", (req, res) => {
  const db = getDB();
  const token = db.tokens.find((t) => t.token_code === req.body.tokenCode);
  if (!token) return res.status(404).json({ error: "Token invalid" });
  res.json(token);
});

app.post("/api/tokens/activate", (req, res) => {
  const db = getDB();
  const index = db.tokens.findIndex((t) => t.token_code === req.body.tokenCode);
  if (index === -1) return res.status(404).json({ error: "Token not found" });

  db.tokens[index] = {
    ...db.tokens[index],
    is_activated: true,
    status: "Aktif",
    pin_hash: req.body.pinHash,
    activated_at: new Date().toISOString(),
    usage_count: (db.tokens[index].usage_count || 0) + 1,
  };

  saveDB(db);
  res.json(db.tokens[index]);
});

app.put("/api/tokens/:id/status", (req, res) => {
  const db = getDB();
  const index = db.tokens.findIndex(
    (t) => t.id === req.params.id || t.token_code === req.params.id,
  );
  if (index === -1) return res.status(404).json({ error: "Token not found" });

  db.tokens[index] = {
    ...db.tokens[index],
    status: req.body.status,
    updated_at: new Date().toISOString(),
  };

  saveDB(db);
  res.json(db.tokens[index]);
});

app.delete("/api/tokens/:id", (req, res) => {
  const db = getDB();
  const index = db.tokens.findIndex(
    (t) => t.id === req.params.id || t.token_code === req.params.id,
  );
  if (index === -1) return res.status(404).json({ error: "Token not found" });

  db.tokens.splice(index, 1);
  saveDB(db);
  res.json({ message: "Token deleted" });
});

// Authentication
app.post("/api/login", (req, res) => {
  const db = getDB();
  const { email, password, role } = req.body;

  const user = db.users.find((u) => u.email === email && u.role === role);

  if (!user) {
    return res
      .status(401)
      .json({ error: "User tidak ditemukan atau role tidak sesuai" });
  }

  // For this local backend, we'll accept 'password123' as the password for demo users
  if (password === "password123" || password === "admin123") {
    const { password_hash, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token: crypto.randomBytes(32).toString("hex"),
    });
  } else {
    res.status(401).json({ error: "Password salah" });
  }
});

// Users
app.get("/api/users", (req, res) => {
  const db = getDB();
  res.json(db.users);
});

app.post("/api/users", (req, res) => {
  const db = getDB();
  const newUser = {
    id: crypto.randomUUID(),
    ...req.body,
    created_at: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDB(db);
  res.status(201).json(newUser);
});

app.put("/api/users/:id/status", (req, res) => {
  const db = getDB();
  const index = db.users.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  db.users[index] = {
    ...db.users[index],
    status: req.body.status,
    updated_at: new Date().toISOString(),
  };

  saveDB(db);
  res.json(db.users[index]);
});

// Audit Logs
app.get("/api/audit-logs", (req, res) => {
  const db = getDB();
  res.json(db.audit_logs);
});

// Interventions
app.get("/api/interventions", (req, res) => {
  const db = getDB();
  res.json(db.interventions || []);
});

app.post("/api/interventions", (req, res) => {
  const db = getDB();
  const newIntervention = {
    id: `PPA-${Date.now().toString().slice(-4)}`,
    ...req.body,
    notes: req.body.notes || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.interventions.push(newIntervention);
  saveDB(db);
  res.status(201).json(newIntervention);
});

app.put("/api/interventions/:id", (req, res) => {
  const db = getDB();
  const index = db.interventions.findIndex((i) => i.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ error: "Intervention not found" });

  db.interventions[index] = {
    ...db.interventions[index],
    ...req.body,
    updated_at: new Date().toISOString(),
  };
  saveDB(db);
  res.json(db.interventions[index]);
});

// Tickets - Add Counselor Notes
app.post("/api/tickets/:id/notes", (req, res) => {
  const db = getDB();
  const index = db.tickets.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Ticket not found" });

  if (!db.tickets[index].counselorNotes) db.tickets[index].counselorNotes = [];
  db.tickets[index].counselorNotes.push(req.body.note);
  db.tickets[index].updated_at = new Date().toISOString();

  saveDB(db);
  res.status(201).json({ note: req.body.note });
});

// Supervision Notices
app.get("/api/supervision-notices", (req, res) => {
  const db = getDB();
  res.json(db.supervision_notices || []);
});

app.post("/api/supervision-notices", (req, res) => {
  const db = getDB();
  if (!db.supervision_notices) db.supervision_notices = [];

  const newNotice = {
    id: crypto.randomUUID(),
    ...req.body,
    created_at: new Date().toISOString(),
  };
  db.supervision_notices.push(newNotice);
  saveDB(db);
  res.status(201).json(newNotice);
});

// Dashboard Stats
app.get("/api/dashboard/stats", (req, res) => {
  const db = getDB();
  const tickets = db.tickets;
  const resolvedTickets = tickets.filter((t) => t.status === "ditutup");

  // Compute real avg response time from ticket creation to first counselor message
  let totalResponseHours = 0;
  let respondedCount = 0;
  tickets.forEach((t) => {
    if (t.messages && t.messages.length > 0) {
      const firstCounselorMsg = t.messages.find(
        (m) => m.sender_type === "counselor",
      );
      if (firstCounselorMsg && t.created_at) {
        const created = new Date(t.created_at).getTime();
        const responded = new Date(firstCounselorMsg.created_at).getTime();
        totalResponseHours += (responded - created) / (1000 * 60 * 60);
        respondedCount++;
      }
    }
  });

  res.json({
    totalTickets: tickets.length,
    pendingTickets: tickets.filter(
      (t) => t.status === "diterima" || t.status === "ditinjau",
    ).length,
    resolvedTickets: resolvedTickets.length,
    avgResponseTime:
      respondedCount > 0
        ? Math.round((totalResponseHours / respondedCount) * 10) / 10
        : 0,
  });
});

// Factory Reset
app.post("/api/factory-reset", (req, res) => {
  saveDB(INITIAL_DATA);
  res.json({ message: "Database reset successfully" });
});

// News Articles
app.get("/api/news", (req, res) => {
  const db = getDB();
  res.json(db.news_articles || []);
});

// Regional Schools (Dinas Dashboard)
app.get("/api/regional-schools", (req, res) => {
  const db = getDB();
  res.json(db.regional_schools || []);
});

// Help Center
app.get("/api/help-articles", (req, res) => {
  const db = getDB();
  res.json(db.help_articles || []);
});

app.get("/api/faqs", (req, res) => {
  const db = getDB();
  res.json(db.faq_items || []);
});

// Contact Messages
app.post("/api/contact", (req, res) => {
  const db = getDB();
  if (!db.contact_messages) db.contact_messages = [];
  const newMessage = {
    id: crypto.randomUUID(),
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    category: req.body.category,
    message: req.body.message,
    status: "Baru",
    created_at: new Date().toISOString(),
  };
  db.contact_messages.push(newMessage);
  saveDB(db);
  res.status(201).json(newMessage);
});

app.get("/api/contact", (req, res) => {
  const db = getDB();
  res.json(db.contact_messages || []);
});

// Account Requests
app.post("/api/account-requests", (req, res) => {
  const db = getDB();
  if (!db.account_requests) db.account_requests = [];
  const existing = db.account_requests.find(
    (r) => r.email === req.body.email && r.status === "pending",
  );
  if (existing)
    return res
      .status(400)
      .json({ error: "Pengajuan dengan email ini sudah dalam antrean." });
  const newRequest = {
    id: crypto.randomUUID(),
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    organization: req.body.organization,
    identifier: req.body.identifier,
    reason: req.body.reason,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  db.account_requests.push(newRequest);
  saveDB(db);
  res.status(201).json(newRequest);
});

app.get("/api/account-requests", (req, res) => {
  const db = getDB();
  res.json(db.account_requests || []);
});

app.put("/api/account-requests/:id", (req, res) => {
  const db = getDB();
  if (!db.account_requests) db.account_requests = [];
  const index = db.account_requests.findIndex((r) => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Request not found" });

  db.account_requests[index] = {
    ...db.account_requests[index],
    status: req.body.status,
    reviewed_at: new Date().toISOString(),
  };

  // If approved, create the user account
  if (req.body.status === "approved") {
    const req_data = db.account_requests[index];
    const newUser = {
      id: crypto.randomUUID(),
      name: req_data.name,
      email: req_data.email,
      role: req_data.role,
      roleTitle: req_data.role,
      organization: req_data.organization,
      identifier: req_data.identifier,
      status: "Aktif",
      created_at: new Date().toISOString(),
    };
    db.users.push(newUser);
  }

  saveDB(db);
  res.json(db.account_requests[index]);
});

// System Config
app.get("/api/config", (req, res) => {
  const db = getDB();
  res.json(
    db.system_config || {
      kioskTimeout: 180,
      autoRedactEnabled: true,
      antiInfiltratorEnforced: true,
    },
  );
});

app.put("/api/config", (req, res) => {
  const db = getDB();
  db.system_config = { ...(db.system_config || {}), ...req.body };
  saveDB(db);
  res.json(db.system_config);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
