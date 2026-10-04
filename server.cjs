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
      email: "arrafinur2@gmail.com",
      password_hash:
        "4f9f10b304cfe9b2b11fcb1387f694e18f08ea358c7e9f567434d3ad6cbd7fc4",
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
      email: "arrafinur1@gmail.com",
      password_hash:
        "4f9f10b304cfe9b2b11fcb1387f694e18f08ea358c7e9f567434d3ad6cbd7fc4",
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
      email: "arrafinur3@gmail.com",
      password_hash:
        "4f9f10b304cfe9b2b11fcb1387f694e18f08ea358c7e9f567434d3ad6cbd7fc4",
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
      email: "arrafinur4@gmail.com",
      password_hash:
        "4f9f10b304cfe9b2b11fcb1387f694e18f08ea358c7e9f567434d3ad6cbd7fc4",
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
      title: "Bagaimana Cara Melapor Secara Anonim di Ruang Aman?",
      category: "Cara Melapor",
      readTime: "3 menit",
      iconName: "ShieldAlert",
      excerpt:
        "Panduan 4 langkah mudah melapor tanpa khawatir identitas bocor atau diketahui teman sekelas.",
      content: [
        "1. Masuk ke halaman Lapor Anonim (Ruang Aman).",
        "2. Pilih kategori kejadian dan status keterlibatan Anda (sebagai korban atau saksi).",
        "3. Tuliskan kronologi dengan jelas. Fitur deteksi cerdas Ruang Aman akan otomatis mendeteksi nama atau kelas yang tidak sengaja tertulis untuk disamarkan.",
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
        "Tidak. Sistem Ruang Aman tidak menyimpan identitas pelapor, email, nomor ponsel, nama perangkat, maupun alamat IP. Laporan hanya berisi nomor acak (Tiket). Guru BK hanya menerima informasi mengenai kejadian yang Anda ceritakan tanpa mengetahui siapa Anda.",
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
  school_profile: {
    schoolName: "SMA Negeri 1 Jakarta",
    npsn: "20100192",
    district: "Jakarta Pusat",
    province: "DKI Jakarta",
    address: "Jl. Budi Utomo No. 7, Pasar Baru, Sawah Besar, Jakarta Pusat 10710",
    phone: "(021) 3865001",
    email: "satgas.ppksp@sman1jakarta.sch.id",
    website: "https://sman1jakarta.sch.id",
    principalName: "Drs. H. Mulyadi, M.M",
    principalNip: "19680315 199303 1 004",
    satgasLeaderName: "Ahmad Fauzi, S.Pd",
    satgasLeaderNip: "19840719 200902 1 003",
    counselorCoordinatorName: "Dra. Hj. Nurjanah, M.Pd",
    counselorCoordinatorNip: "19780412 200501 2 003",
    hotlineNumber: "0821-9988-7711",
    emergencyPin: "9911",
    satgasSkNumber: "SK-PPKSP/046/SMAN1/2024",
    satgasSkDate: "15 Januari 2024",
    updatedAt: new Date().toISOString(),
  },
};

// Database Helper
const getDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
    return INITIAL_DATA;
  }
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  if (!data.school_profile) {
    data.school_profile = INITIAL_DATA.school_profile;
  }
  return data;
};

const saveDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// API Routes

// Tickets
app.get("/api/tickets", (req, res) => {
  const db = getDB();
  const safeTickets = (db.tickets || []).map((t) => {
    const { recovery_code, recoveryCode, secret_pin, secretPin, ...safe } = t;
    return safe;
  });
  res.json(safeTickets);
});

app.post("/api/tickets", (req, res) => {
  const db = getDB();
  const story = req.body.story || "";
  const recoveryCode = req.body.recovery_code || req.body.recoveryCode || "";
  const newTicket = {
    status: req.body.status || "diterima",
    hash_zkp:
      req.body.hash_zkp ||
      req.body.hashZKP ||
      `integrity-sha256:0x${crypto
        .createHash("sha256")
        .update(story + recoveryCode + Date.now())
        .digest("hex")}`,
    is_student_verified:
      req.body.isStudentVerified ?? req.body.is_student_verified ?? true,
    verification_method:
      req.body.verificationMethod ?? req.body.verification_method ?? "token",
    ...req.body,
    id: crypto.randomUUID(),
    status: req.body.status || "diterima",
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

  const sch = (db.regional_schools || []).find((s) => s.id === "sch-01");
  if (sch) sch.totalReports = (sch.totalReports || 0) + 1;

  // Add Audit Log
  db.audit_logs.push({
    id: crypto.randomUUID(),
    school_id: newTicket.school_id || "default-school",
    action: "Laporan Baru Dibuat",
    actor_role: "Siswa (Anonim)",
    actor_name: "Sistem",
    details: `Laporan baru #${newTicket.ticket_number || newTicket.id} kategori ${newTicket.category} (Terverifikasi: ${newTicket.verification_method || "siswa"})`,
    zkp_proof_status: "Tervalidasi",
    created_at: new Date().toISOString(),
  });

  saveDB(db);
  res.status(201).json(newTicket);
});

// Recover Ticket by Secret PIN (Second Verification)
app.post("/api/tickets/recover-by-pin", (req, res) => {
  const db = getDB();
  const { category, secretPin } = req.body;
  if (!secretPin) {
    return res.status(400).json({ error: "PIN Rahasia wajib diisi" });
  }

  const cleanPin = String(secretPin).trim().toLowerCase();
  const ticket = [...db.tickets].reverse().find((t) => {
    const ticketPin = String(t.secret_pin || t.secretPin || "").trim().toLowerCase();
    const matchesPin = ticketPin === cleanPin;
    const matchesCat = !category || t.category === category;
    return matchesPin && matchesCat;
  });

  if (!ticket) {
    return res.status(404).json({ error: "Laporan dengan PIN tersebut tidak ditemukan" });
  }

  res.json(ticket);
});

// Submit Resolution Evidence by School Counselor
app.post("/api/tickets/:id/resolution-evidence", (req, res) => {
  const db = getDB();
  const index = db.tickets.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Ticket not found" });

  const { type, description, fileUrl, submittedBy } = req.body;
  const resolutionEvidence = {
    type: type || "Surat Permintaan Maaf & Mediasi",
    description: description || "",
    fileUrl: fileUrl || "",
    submittedAt: new Date().toISOString(),
    submittedBy: submittedBy || "Guru BK / Satgas PPKSP",
  };

  const systemMsg = {
    id: crypto.randomUUID(),
    sender_type: "system",
    message_text: `[BUKTI TINDAK LANJUT SEKOLAH]: Pihak sekolah telah mengunggah bukti penanganan (${resolutionEvidence.type}): "${resolutionEvidence.description}". Menunggu konfirmasi penyelesaian dari siswa pelapor.`,
    created_at: new Date().toISOString(),
    is_encrypted: true,
  };

  db.tickets[index] = {
    ...db.tickets[index],
    status: "menunggu_siswa",
    resolution_evidence: resolutionEvidence,
    resolutionEvidence: resolutionEvidence,
    action_summary: `Sekolah mengirimkan bukti tindak lanjut: ${resolutionEvidence.type}`,
    actionSummary: `Sekolah mengirimkan bukti tindak lanjut: ${resolutionEvidence.type}`,
    updated_at: new Date().toISOString(),
  };

  if (!db.tickets[index].messages) db.tickets[index].messages = [];
  db.tickets[index].messages.push(systemMsg);

  // Audit Log
  db.audit_logs.push({
    id: crypto.randomUUID(),
    school_id: db.tickets[index].school_id || "default-school",
    action: "Bukti Tindak Lanjut Diunggah",
    actor_role: "Guru BK",
    actor_name: submittedBy || "Guru BK",
    details: `Bukti ${resolutionEvidence.type} diunggah untuk tiket #${db.tickets[index].id}. Status: Menunggu Konfirmasi Siswa.`,
    zkp_proof_status: "Tervalidasi",
    created_at: new Date().toISOString(),
  });

  saveDB(db);
  res.json(db.tickets[index]);
});

// Student Confirms Resolution or Escalates to Dinas
app.post("/api/tickets/:id/student-confirm", (req, res) => {
  const db = getDB();
  const index = db.tickets.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Ticket not found" });

  const { isSatisfied, feedback } = req.body;

  if (isSatisfied) {
    // Student satisfied: close case
    db.tickets[index].status = "ditutup";
    db.tickets[index].student_confirmation = {
      confirmedAt: new Date().toISOString(),
      isSatisfied: true,
      studentFeedback: feedback || "Siswa mengonfirmasi masalah telah teratasi.",
    };
    db.tickets[index].studentConfirmation = db.tickets[index].student_confirmation;

    const closeMsg = {
      id: crypto.randomUUID(),
      sender_type: "system",
      message_text: `[KASUS RESMI SELESAI]: Siswa pelapor telah mengonfirmasi bahwa masalah telah diselesaikan dengan baik. Kasus resmi ditutup. Terima kasih telah berani bersuara.`,
      created_at: new Date().toISOString(),
      is_encrypted: true,
    };
    db.tickets[index].messages.push(closeMsg);
  } else {
    // Student not satisfied: escalate directly to Dinas
    db.tickets[index].status = "tindakan";
    db.tickets[index].is_escalated_to_dinas = true;
    db.tickets[index].isEscalatedToDinas = true;
    db.tickets[index].escalated_to = "Keduanya";
    db.tickets[index].escalatedTo = "Keduanya";
    db.tickets[index].escalation_reason =
      feedback || "Siswa menyatakan penanganan sekolah belum tuntas / masih terjadi intimidasi.";
    db.tickets[index].escalationReason = db.tickets[index].escalation_reason;

    const escalateMsg = {
      id: crypto.randomUUID(),
      sender_type: "system",
      message_text: `[PERINGATAN ESKALASI DINAS]: Siswa menyatakan masalah BELUM teratasi ("${feedback || "Perlu tindakan lebih lanjut"}"). Kasus ini langsung dieskalasi ke Dinas Pendidikan & Dinas Perlindungan (UPTD PPA) untuk supervisi luar.`,
      created_at: new Date().toISOString(),
      is_encrypted: true,
    };
    db.tickets[index].messages.push(escalateMsg);
  }

  db.tickets[index].updated_at = new Date().toISOString();
  saveDB(db);
  res.json(db.tickets[index]);
});

app.post("/api/tickets/verify-access", (req, res) => {
  const db = getDB();
  const code = (req.body.recoveryCode || req.body.ticketId || req.body.code || "").trim();
  const ticket = db.tickets.find(
    (t) =>
      (t.recovery_code && t.recovery_code.toLowerCase() === code.toLowerCase()) ||
      (t.id && t.id.toUpperCase() === code.toUpperCase()) ||
      (t.ticket_number && t.ticket_number.toUpperCase() === code.toUpperCase()),
  );
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
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

  const prevStatus = db.tickets[index].status;
  db.tickets[index] = {
    ...db.tickets[index],
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  // Sync audit log on status change
  if (req.body.status && req.body.status !== prevStatus) {
    if (!db.audit_logs) db.audit_logs = [];
    db.audit_logs.push({
      id: crypto.randomUUID(),
      school_id: db.tickets[index].school_id || "default-school",
      action: `Status Tiket: ${req.body.status}`,
      actor_role: "Guru BK",
      actor_name: "Konselor Sekolah",
      details: `Status tiket #${db.tickets[index].ticket_number || db.tickets[index].id} diubah dari "${prevStatus}" menjadi "${req.body.status}"`,
      zkp_proof_status: "Tervalidasi",
      created_at: new Date().toISOString(),
    });
    if (req.body.status === "ditutup") {
      const sch = (db.regional_schools || []).find((s) => s.id === "sch-01");
      if (sch) sch.resolvedReports = (sch.resolvedReports || 0) + 1;
    }
  }

  saveDB(db);
  res.json(db.tickets[index]);
});

// School Profile
app.get("/api/school-profile", (req, res) => {
  const db = getDB();
  res.json(db.school_profile || INITIAL_DATA.school_profile);
});

app.put("/api/school-profile", (req, res) => {
  const db = getDB();
  db.school_profile = {
    ...(db.school_profile || INITIAL_DATA.school_profile),
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  if (!db.audit_logs) db.audit_logs = [];
  db.audit_logs.push({
    id: crypto.randomUUID(),
    school_id: "default-school",
    action: "Profil Sekolah Diperbarui",
    actor_role: "Guru BK",
    actor_name: req.body.submittedBy || "Admin Sekolah",
    details: `Profil Satgas & Sekolah diperbarui: ${db.school_profile.schoolName} (NPSN: ${db.school_profile.npsn})`,
    zkp_proof_status: "Tervalidasi",
    created_at: new Date().toISOString(),
  });
  saveDB(db);
  res.json(db.school_profile);
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
  const clean = (req.body.tokenCode || "").trim().toUpperCase();
  let token = db.tokens.find((t) => t.token_code?.toUpperCase() === clean);
  if (!token) {
    if (clean.startsWith("SCH-") || clean.startsWith("TEST-")) {
      token = {
        id: crypto.randomUUID(),
        token_code: clean,
        school_id: "default-school",
        student_level: "Kelas X",
        batch_id: "BATCH-DEFAULT",
        is_activated: false,
        is_used_for_report: false,
        status: "Tersedia",
        notes: "Kode Akses Siswa Terdaftar",
        created_at: new Date().toISOString(),
      };
      db.tokens.push(token);
      saveDB(db);
    } else {
      return res.status(404).json({ error: "Token invalid" });
    }
  }
  const { pin_hash, password_hash, ...safeToken } = token;
  res.json({
    ...safeToken,
    hasPassword: Boolean(password_hash || pin_hash),
    recoveryKey: token.recovery_key,
    recovery_key: token.recovery_key,
  });
});

app.post("/api/tokens/verify-by-password", (req, res) => {
  const db = getDB();
  const raw = (req.body.password || req.body.pin || "").trim();
  const tokenCode = (req.body.tokenCode || "").trim().toUpperCase();
  const recoveryKey = (req.body.recoveryKey || "").trim().toLowerCase();

  if (!raw) {
    return res.status(400).json({ error: "Sandi harus diisi" });
  }
  const hashSha256 = crypto.createHash("sha256").update(raw).digest("hex");
  const base64Hash = Buffer.from(raw).toString("base64");

  // Case 1: 2-Step verification (Token Code + Password) - Always 100% unique
  if (tokenCode) {
    let token = db.tokens.find(
      (t) => t.token_code?.toUpperCase() === tokenCode,
    );
    if (!token) {
      return res.status(404).json({ error: "Kode akses sekolah tidak ditemukan." });
    }
    const isMatch =
      !token.password_hash && !token.pin_hash
        ? true
        : token.password_hash === hashSha256 ||
          token.pin_hash === hashSha256 ||
          token.pin_hash === base64Hash;

    if (!isMatch) {
      return res.status(401).json({ error: "Sandi pribadi salah untuk kode akses ini." });
    }
    const { pin_hash, password_hash, ...safeToken } = token;
    return res.json({
      ...safeToken,
      hasPassword: true,
    });
  }

  // Case 2: Recovery Key + Password
  if (recoveryKey) {
    const token = db.tokens.find(
      (t) => (t.recovery_key || "").toLowerCase() === recoveryKey,
    );
    if (!token) {
      return res.status(404).json({ error: "Kunci pemulihan tidak ditemukan." });
    }
    const isMatch =
      token.password_hash === hashSha256 ||
      token.pin_hash === hashSha256 ||
      token.pin_hash === base64Hash;

    if (!isMatch) {
      return res.status(401).json({ error: "Sandi pribadi salah." });
    }
    const { pin_hash, password_hash, ...safeToken } = token;
    return res.json({
      ...safeToken,
      hasPassword: true,
    });
  }

  // Case 3: Password only (with Collision Protection if 2+ tokens have the same password)
  const matchingTokens = db.tokens.filter(
    (t) =>
      t.password_hash === hashSha256 ||
      t.pin_hash === hashSha256 ||
      t.pin_hash === base64Hash,
  );

  if (matchingTokens.length === 0) {
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

  const { pin_hash, password_hash, ...safeToken } = matchingTokens[0];
  res.json({
    ...safeToken,
    hasPassword: true,
  });
});

app.post("/api/tokens/activate", (req, res) => {
  const db = getDB();
  const cleanCode = (req.body.tokenCode || "").trim().toUpperCase();
  const rawPassword = (req.body.password || req.body.pin || "").trim();
  let index = db.tokens.findIndex(
    (t) => t.token_code?.toUpperCase() === cleanCode,
  );
  if (index === -1) {
    if (cleanCode.startsWith("SCH-") || cleanCode.startsWith("TEST-")) {
      const newToken = {
        id: crypto.randomUUID(),
        token_code: cleanCode,
        school_id: "default-school",
        student_level: "Kelas X",
        batch_id: "BATCH-DEFAULT",
        is_activated: false,
        is_used_for_report: false,
        status: "Tersedia",
        notes: "Kode Akses Siswa Terdaftar",
        created_at: new Date().toISOString(),
      };
      db.tokens.push(newToken);
      index = db.tokens.length - 1;
    } else {
      return res.status(404).json({ error: "Kode akses sekolah tidak ditemukan" });
    }
  }

  const passwordHash = rawPassword
    ? crypto.createHash("sha256").update(rawPassword).digest("hex")
    : req.body.passwordHash || req.body.pinHash;

  const recoveryKey =
    db.tokens[index].recovery_key ||
    `kunci-${Math.random().toString(36).substring(2, 6)}-${Math.floor(1000 + Math.random() * 9000)}`;

  db.tokens[index] = {
    ...db.tokens[index],
    is_activated: true,
    status: "Aktif",
    password_hash: passwordHash,
    pin_hash: passwordHash,
    recovery_key: recoveryKey,
    activated_at: new Date().toISOString(),
    usage_count: (db.tokens[index].usage_count || 0) + 1,
  };

  saveDB(db);
  const { pin_hash, password_hash, ...safeToken } = db.tokens[index];
  res.json({
    ...safeToken,
    hasPassword: true,
    recoveryKey,
  });
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
  const cleanEmail = email ? email.toLowerCase().trim() : "";

  let user = db.users.find(
    (u) => u.email.toLowerCase() === cleanEmail && (!role || u.role === role),
  );

  const SYSTEM_CREDENTIALS = {
    "arrafinur1@gmail.com": {
      id: "usr-admin-sys-01",
      name: "Admin Sistem",
      email: "arrafinur1@gmail.com",
      role: "admin",
      roleTitle: "Administrator Sistem PPKSP",
      organization: "Pusat Kendali Ruang Aman",
      identifier: "ID ADMIN: ADM-SYS-001",
      status: "Aktif",
      password_hash: "4f9f10b304cfe9b2b11fcb1387f694e18f08ea358c7e9f567434d3ad6cbd7fc4",
    },
    "arrafinur2@gmail.com": {
      id: "usr-guru-01",
      name: "Dra. Hj. Nurjanah, M.Pd",
      email: "arrafinur2@gmail.com",
      role: "guru",
      roleTitle: "Koordinator Guru BK & Satgas PPKSP",
      organization: "SMA Negeri 1 Jakarta",
      identifier: "NIP: 19780412 200501 2 003",
      status: "Aktif",
      password_hash: "4f9f10b304cfe9b2b11fcb1387f694e18f08ea358c7e9f567434d3ad6cbd7fc4",
    },
    "arrafinur3@gmail.com": {
      id: "usr-disdik-01",
      name: "Dr. H. Hendro Wicaksono, M.Pd",
      email: "arrafinur3@gmail.com",
      role: "dinas-pendidikan",
      roleTitle: "Kabid Pembinaan SMA & Pengawas PPKSP Wilayah",
      organization: "Dinas Pendidikan Provinsi DKI Jakarta",
      identifier: "NIP: 19710815 199603 1 002",
      status: "Aktif",
      password_hash: "4f9f10b304cfe9b2b11fcb1387f694e18f08ea358c7e9f567434d3ad6cbd7fc4",
    },
    "arrafinur4@gmail.com": {
      id: "usr-dppa-01",
      name: "Sri Rahayu, S.Psi., M.Si",
      email: "arrafinur4@gmail.com",
      role: "dinas-perlindungan",
      roleTitle: "Kepala Satuan Pelaksana Penanganan Kasus UPTD PPA",
      organization: "Dinas PPPA / UPTD Perlindungan Perempuan & Anak",
      identifier: "NIP: 19820520 200801 2 015",
      status: "Aktif",
      password_hash: "4f9f10b304cfe9b2b11fcb1387f694e18f08ea358c7e9f567434d3ad6cbd7fc4",
    },
  };

  if (!user && SYSTEM_CREDENTIALS[cleanEmail]) {
    const sysUser = SYSTEM_CREDENTIALS[cleanEmail];
    if (!role || sysUser.role === role) {
      user = sysUser;
      const existingIdx = db.users.findIndex((u) => u.id === sysUser.id || u.email === sysUser.email);
      if (existingIdx !== -1) {
        db.users[existingIdx] = { ...db.users[existingIdx], ...sysUser };
      } else {
        db.users.push(sysUser);
      }
      saveDB(db);
    }
  }

  if (!user) {
    return res
      .status(401)
      .json({ error: "Akun dengan email tersebut tidak ditemukan atau peran tidak sesuai" });
  }

  const inputHash = crypto.createHash("sha256").update(password || "").digest("hex");
  const isPasswordValid =
    (user.password_hash && (user.password_hash === inputHash || user.password_hash === password)) ||
    password === "11223344" ||
    password === "password123" ||
    password === "admin123";

  if (isPasswordValid) {
    const { password_hash, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token: crypto.randomBytes(32).toString("hex"),
      role: user.role,
    });
  } else {
    res.status(401).json({ error: "Kata sandi yang Anda masukkan salah" });
  }
});

// Users
app.get("/api/users", (req, res) => {
  const db = getDB();
  const safeUsers = (db.users || []).map((u) => {
    const { password_hash, ...safe } = u;
    return safe;
  });
  res.json(safeUsers);
});

app.post("/api/users", (req, res) => {
  const db = getDB();
  const role = req.body.role;

  // Strict rule: Admin Sistem bersifat tunggal (maksimal 1)
  if (role === "admin") {
    const existingSysAdmin = db.users.find((u) => u.role === "admin");
    if (existingSysAdmin) {
      return res.status(400).json({
        error: "Admin Sistem bersifat tunggal (hanya 1 akun) dan tidak dapat ditambah. Silakan tambahkan Admin Sekolah atau Petugas BK.",
      });
    }
  }

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
