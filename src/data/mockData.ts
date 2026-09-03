import {
  ReportTicket,
  SchoolToken,
  CounselorUser,
  HelpArticle,
  FAQItem,
  UserAccount,
  AuditLog,
  SchoolRegionalData,
  ProtectionIntervention,
} from "../types";

export const INITIAL_TICKETS: ReportTicket[] = [
  {
    id: "TMG-2025-78A1",
    category: "Perundungan / Bullying",
    reporterRole: "Siswa (Korban)",
    location: "Area Kantin Belakang Gedung B",
    incidentDate: "28 Februari 2025, saat istirahat kedua",
    urgency: "Tinggi",
    story:
      "Saya kerap didorong dan diintimidasi saat jam istirahat oleh sekelompok siswa kelas atas. Mereka meminta uang jajan dan mengancam akan merusak sepeda saya jika mengadu.",
    redactedStory:
      "Saya kerap didorong dan diintimidasi saat jam istirahat oleh sekelompok siswa [TERLINDUNGI: KELAS / ROMBEL]. Mereka meminta uang jajan dan mengancam akan merusak sepeda saya jika mengadu.",
    detectedPII: ["Kelas XII IPS 3"],
    attachments: [
      {
        id: "att-1",
        name: "bukti_foto_sepeda_dijatuhkan.jpg",
        size: 1420000,
        type: "image/jpeg",
        previewUrl:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231e1b4b"/><circle cx="200" cy="150" r="80" fill="%234338ca" opacity="0.5"/><path d="M120 180 L200 120 L280 180 Z" fill="%23818cf8"/><circle cx="160" cy="200" r="30" stroke="%2334d399" stroke-width="6" fill="none"/><circle cx="240" cy="200" r="30" stroke="%2334d399" stroke-width="6" fill="none"/><text x="200" y="270" fill="%23e0e7ff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Lampiran Bukti Terenkripsi</text></svg>',
      },
    ],
    status: "tindakan",
    createdAt: "2025-02-28T10:15:00Z",
    updatedAt: "2025-03-01T14:30:00Z",
    hashZKP: "zkp-sha256:0x89f410a2bb849c9a01e3",
    recoveryCode: "aman-benteng-suara-fajar-4821",
    assignedCounselor: "Dra. Hj. Nurjanah, M.Pd (Guru BK)",
    actionSummary:
      "Tim Satgas PPKSP telah melakukan pengawasan terselubung di area kantin belakang dan memanggil terduga pelaku untuk konseling terarah tanpa menyebutkan identitas pelapor.",
    messages: [
      {
        id: "msg-1",
        sender: "system",
        text: "Laporan Anda berhasil dienkripsi dan diterima oleh Tim Bimbingan Konseling (BK) & Satgas PPKSP Sekolah. Identitas Anda 100% terlindungi.",
        timestamp: "28 Feb 2025, 10:15",
        isEncrypted: true,
      },
      {
        id: "msg-2",
        sender: "counselor",
        senderTitle: "Dra. Hj. Nurjanah (Guru BK)",
        text: "Halo Ananda yang berani. Terima kasih telah mempercayai kami. Kami sangat prihatin dengan apa yang kamu alami. Mohon jangan khawatir, kamu aman sekarang.",
        timestamp: "28 Feb 2025, 13:40",
        isEncrypted: true,
      },
      {
        id: "msg-3",
        sender: "pelapor",
        text: "Terima kasih Bu. Tapi saya masih takut kalau mereka tahu saya yang lapor lewat aplikasi ini.",
        timestamp: "28 Feb 2025, 15:20",
        isEncrypted: true,
      },
      {
        id: "msg-4",
        sender: "counselor",
        senderTitle: "Dra. Hj. Nurjanah (Guru BK)",
        text: "Tenang Ananda, kami tidak memiliki data pribadi atau nama kamu sama sekali. Kami melakukan tindakan berdasarkan penertiban rutin CCTV & patroli guru di kantin. Jika kamu butuh tempat cerita langsung tanpa tatap muka fisik, kamu bisa terus chat di sini kapan saja.",
        timestamp: "01 Mar 2025, 08:30",
        isEncrypted: true,
      },
    ],
    counselorNotes: [
      "Prioritas pemantauan jam 12.00 - 13.00 di kantin belakang.",
      "Koordinasi dengan security sekolah Pak Hendra untuk patroli sudut mati CCTV.",
    ],
  },
  {
    id: "TMG-2025-44B9",
    category: "Cyberbullying / Teror Online",
    reporterRole: "Siswa (Saksi Mata)",
    location: "Grup WhatsApp & Akun Menfess Sosmed",
    incidentDate: "1 Maret 2025, 20:00 WIB",
    urgency: "Sedang",
    story:
      "Ada teman saya difoto diam-diam di toilet luar lalu disebarkan dengan narasi mengejek di grup WhatsApp angkatan. Saya merasa ini sudah keterlaluan.",
    redactedStory:
      "Ada teman saya difoto diam-diam di toilet luar lalu disebarkan dengan narasi mengejek di grup WhatsApp angkatan. Saya merasa ini sudah keterlaluan.",
    detectedPII: [],
    attachments: [
      {
        id: "att-2",
        name: "screenshot_grup_wa_disensor.png",
        size: 890000,
        type: "image/png",
        previewUrl:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230f172a"/><rect x="40" y="40" width="320" height="220" rx="16" fill="%231e293b" stroke="%2338bdf8" stroke-width="2"/><rect x="60" y="70" width="180" height="36" rx="8" fill="%230284c7"/><rect x="160" y="120" width="180" height="36" rx="8" fill="%23059669"/><rect x="60" y="170" width="220" height="36" rx="8" fill="%230284c7"/><text x="200" y="240" fill="%2394a3b8" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Screenshot Disensor Otomatis</text></svg>',
      },
    ],
    status: "ditinjau",
    createdAt: "2025-03-01T21:10:00Z",
    updatedAt: "2025-03-02T09:00:00Z",
    hashZKP: "zkp-sha256:0x44c98811eef81938ab02",
    recoveryCode: "tegak-kristal-lindung-satria-9032",
    assignedCounselor: "Ahmad Fauzi, S.Pd (Satgas PPKSP)",
    messages: [
      {
        id: "msg-201",
        sender: "system",
        text: "Laporan diterima dalam antrean review Tim Satgas PPKSP.",
        timestamp: "01 Mar 2025, 21:10",
        isEncrypted: true,
      },
      {
        id: "msg-202",
        sender: "counselor",
        senderTitle: "Ahmad Fauzi, S.Pd (Satgas)",
        text: "Terima kasih atas kepedulianmu terhadap sesama siswa. Laporan sudah kami verifikasi dan kami sedang berkoordinasi dengan wali kelas terkait untuk mediasi digital & penurunan konten.",
        timestamp: "02 Mar 2025, 09:00",
        isEncrypted: true,
      },
    ],
    counselorNotes: [
      "Hubungi admin grup dan periksa pelanggaran UU ITE di lingkungan satuan pendidikan.",
      "Sosialisasi etika bermedia sosial pada upacara Senin depan.",
    ],
  },
  {
    id: "TMG-2025-99C2",
    category: "Kekerasan Fisik",
    reporterRole: "Siswa (Korban)",
    location: "Lorong Tangga Lantai 3 Menuju Lab Komputer",
    incidentDate: "Kemarin sore sepulang sekolah",
    urgency: "Kritis (Darurat Segera)",
    story:
      "Saya ditarik ke lorong sepi dan dipukul di bagian perut karena menolak memberikan tugas PR saya. Saya mengalami memar dan takut masuk sekolah besok.",
    redactedStory:
      "Saya ditarik ke lorong sepi dan dipukul di bagian perut karena menolak memberikan tugas PR saya. Saya mengalami memar dan takut masuk sekolah besok.",
    detectedPII: [],
    attachments: [
      {
        id: "att-3",
        name: "rekaman_suara_ancaman.mp3",
        size: 3100000,
        type: "audio/mpeg",
        isAudio: true,
      },
    ],
    status: "diterima",
    createdAt: "2025-03-02T07:45:00Z",
    updatedAt: "2025-03-02T07:45:00Z",
    hashZKP: "zkp-sha256:0x77aa4433d99018caef12",
    recoveryCode: "cahaya-harmoni-merdeka-pandu-1192",
    messages: [
      {
        id: "msg-301",
        sender: "system",
        text: "Laporan berstatus KRITIS (DARURAT) telah langsung diteruskan ke Pimpinan Satgas & Kepala BK.",
        timestamp: "02 Mar 2025, 07:45",
        isEncrypted: true,
      },
    ],
    counselorNotes: [
      "Segera periksa rekaman CCTV tangga lantai 3.",
      "Siapkan ruang UKS dan pendampingan psikologis aman jika siswa hadir.",
    ],
  },
];

export const MOCK_SCHOOL_TOKENS: SchoolToken[] = [
  {
    tokenCode: "SCH-X1-8831",
    schoolName: "SMA Negeri 1 Jakarta",
    studentLevel: "Kelas X - MIPA 1 (Angkatan 2026)",
    batchId: "BATCH-2026-X1",
    isActivated: false,
    isUsedForReport: false,
    status: "Tersedia",
    createdAt: "2025-02-01T08:00:00Z",
    notes: "Slip Kode MPLS Kelas X-1",
  },
  {
    tokenCode: "SCH-X1-4019",
    schoolName: "SMA Negeri 1 Jakarta",
    studentLevel: "Kelas X - MIPA 1 (Angkatan 2026)",
    batchId: "BATCH-2026-X1",
    isActivated: false,
    isUsedForReport: false,
    status: "Tersedia",
    createdAt: "2025-02-01T08:00:00Z",
    notes: "Slip Kode MPLS Kelas X-1",
  },
  {
    tokenCode: "SCH-X1-9924",
    schoolName: "SMA Negeri 1 Jakarta",
    studentLevel: "Kelas X - MIPA 1 (Angkatan 2026)",
    batchId: "BATCH-2026-X1",
    isActivated: true,
    isUsedForReport: true,
    status: "Aktif",
    pinHash: "e10adc3949ba59abbe56e057f20f883e",
    recoveryKey: "berani-langit-kristal-satria-9924",
    activatedAt: "2025-02-15T09:30:00Z",
    usageCount: 1,
    notes: "Slip Kode MPLS Kelas X-1",
  },
  {
    tokenCode: "SCH-XI2-5512",
    schoolName: "SMA Negeri 1 Jakarta",
    studentLevel: "Kelas XI - IPS 2 (Angkatan 2025)",
    batchId: "BATCH-2025-XI2",
    isActivated: false,
    isUsedForReport: false,
    status: "Tersedia",
    createdAt: "2025-01-10T08:00:00Z",
    notes: "Batch Pembagian Semester Genap",
  },
  {
    tokenCode: "SCH-XI2-7733",
    schoolName: "SMA Negeri 1 Jakarta",
    studentLevel: "Kelas XI - IPS 2 (Angkatan 2025)",
    batchId: "BATCH-2025-XI2",
    isActivated: true,
    isUsedForReport: true,
    status: "Aktif",
    pinHash: "e10adc3949ba59abbe56e057f20f883e",
    recoveryKey: "harmoni-sinar-mentari-garuda-7733",
    activatedAt: "2025-01-15T08:00:00Z",
    usageCount: 2,
    notes: "Batch Pembagian Semester Genap",
  },
  {
    tokenCode: "SCH-XII-1204",
    schoolName: "SMA Negeri 1 Jakarta",
    studentLevel: "Kelas XII - MIPA 3 (Angkatan 2024)",
    batchId: "BATCH-2024-XII",
    isActivated: false,
    isUsedForReport: false,
    status: "Tersedia",
    createdAt: "2025-01-05T08:00:00Z",
    notes: "Batch Khusus Konseling Ujian Akhir",
  },
  {
    tokenCode: "SCH-XII-3389",
    schoolName: "SMA Negeri 1 Jakarta",
    studentLevel: "Kelas XII - MIPA 3 (Angkatan 2024)",
    batchId: "BATCH-2024-XII",
    isActivated: false,
    isUsedForReport: false,
    status: "Tersedia",
    createdAt: "2025-01-05T08:00:00Z",
    notes: "Batch Khusus Konseling Ujian Akhir",
  },
];

export const MOCK_COUNSELOR: CounselorUser = {
  id: "csl-01",
  name: "Dra. Hj. Nurjanah, M.Pd",
  email: "guru.bk@sekolah.sch.id",
  role: "Guru Bimbingan Konseling (BK)",
  nip: "19780412 200501 2 003",
  avatar:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  schoolName: "SMA Negeri 1 Jakarta",
};

export const MOCK_USERS: Record<
  string,
  {
    id: string;
    name: string;
    email: string;
    role:
      "siswa" | "guru" | "admin" | "dinas-pendidikan" | "dinas-perlindungan";
    roleTitle: string;
    organization: string;
    identifier: string;
    avatar: string;
    permissions: string[];
  }
> = {
  siswa: {
    id: "usr-siswa-01",
    name: "Siswa / Pelapor Anonim",
    email: "siswa.terlindungi@ruangaman.id",
    role: "siswa",
    roleTitle: "Siswa / Warga Sekolah",
    organization: "SMA Negeri 1 Jakarta",
    identifier: "TOKEN: TMG-SCH-8831",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    permissions: ["Lapor Anonim", "Chat 2-Arah", "Aktivasi Token", "Mode Kios"],
  },
  guru: {
    id: "usr-guru-01",
    name: "Dra. Hj. Nurjanah, M.Pd",
    email: "guru.bk@sekolah.sch.id",
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
  admin: {
    id: "usr-admin-01",
    name: "Bambang Prasetyo, S.Kom",
    email: "admin.ppksp@sekolah.sch.id",
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
  "dinas-pendidikan": {
    id: "usr-disdik-01",
    name: "Dr. H. Hendro Wicaksono, M.Pd",
    email: "h.hendro@disdik.prov.go.id",
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
  "dinas-perlindungan": {
    id: "usr-dinas-pppa-01",
    name: "Sri Rahayu, S.Psi., M.Si",
    email: "sri.rahayu@uptd-ppa.go.id",
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
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "LOG-8821",
    timestamp: "02 Mar 2025, 08:15:20 WIB",
    action: "Verifikasi ZKP Semaphore Token Siswa",
    actorRole: "Sistem Kriptografi",
    actorName: "Node Enklave 01",
    details:
      "Token TMG-SCH-8831 tervalidasi anonim tanpa menyimpan relasi identitas.",
    zkpProofStatus: "Tervalidasi",
  },
  {
    id: "LOG-8820",
    timestamp: "02 Mar 2025, 07:46:11 WIB",
    action: "Sanitasi Otomatis Metadata Bukti Audio",
    actorRole: "Sistem Sanitasi",
    actorName: "Media Cleaner Engine",
    details:
      "Pembersihan geotag GPS EXIF dan waveform voice scrubbing pada file rekaman_suara_ancaman.mp3.",
    zkpProofStatus: "Scrubbed",
  },
  {
    id: "LOG-8819",
    timestamp: "01 Mar 2025, 21:12:04 WIB",
    action: "Triage Kasus #TMG-2025-44B9",
    actorRole: "Guru BK",
    actorName: "Ahmad Fauzi, S.Pd",
    details:
      "Pembaruan status dari DITERIMA ke DITINJAU dan penerusan pesan koordinasi.",
    zkpProofStatus: "Anonymized",
  },
  {
    id: "LOG-8818",
    timestamp: "01 Mar 2025, 14:30:18 WIB",
    action: "Eskalasi Intervensi ke UPTD PPA",
    actorRole: "Satgas PPKSP",
    actorName: "Dra. Hj. Nurjanah, M.Pd",
    details:
      "Rujukan pendampingan psikologis kasus fisik intensitas tinggi #TMG-2025-99C2.",
    zkpProofStatus: "Tervalidasi",
  },
];

export const MOCK_REGIONAL_SCHOOLS: SchoolRegionalData[] = [
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
  {
    id: "sch-02",
    schoolName: "SMK Negeri 2 Surabaya",
    district: "Gubeng",
    level: "SMK",
    activeSatgasCount: 5,
    totalReports: 19,
    resolvedReports: 16,
    avgResponseHours: 2.4,
    complianceStatus: "Patuh (A)",
    principalName: "Ir. Hendra Kusuma, M.T",
    lastActive: "25 menit lalu",
  },
  {
    id: "sch-03",
    schoolName: "SMP Negeri 3 Bandung",
    district: "Coblong",
    level: "SMP",
    activeSatgasCount: 4,
    totalReports: 8,
    resolvedReports: 5,
    avgResponseHours: 4.1,
    complianceStatus: "Cukup (B)",
    principalName: "Siti Rohana, S.Pd., M.Si",
    lastActive: "1 jam lalu",
  },
  {
    id: "sch-04",
    schoolName: "SMA Nusantara Gemilang",
    district: "Kebayoran Baru",
    level: "SMA",
    activeSatgasCount: 3,
    totalReports: 11,
    resolvedReports: 6,
    avgResponseHours: 9.5,
    complianceStatus: "Perlu Perhatian (C)",
    principalName: "Drs. Antonius Wijaya",
    lastActive: "5 jam lalu",
  },
  {
    id: "sch-05",
    schoolName: "SMK Bhakti Bangsa",
    district: "Tanjung Priok",
    level: "SMK",
    activeSatgasCount: 2,
    totalReports: 7,
    resolvedReports: 2,
    avgResponseHours: 18.2,
    complianceStatus: "Kritis (D)",
    principalName: "Hartono, S.T",
    lastActive: "2 hari lalu",
  },
];

export const MOCK_PROTECTION_INTERVENTIONS: ProtectionIntervention[] = [
  {
    id: "INT-PPA-2025-01",
    ticketId: "TMG-2025-99C2",
    victimAlias: "Ananda Melati (Korban)",
    schoolOrigin: "SMA Negeri 1 Jakarta",
    category: "Kekerasan Fisik & Pemerasan Berulang",
    urgency: "Kritis (Darurat Segera)",
    assignedPsychologist: "Dr. Maria Ulfah, M.Psi., Psikolog",
    assignedLegalAid: "LBH Apik / Advokat Ramah Anak",
    stage: "Pemulihan Psikologis",
    shelterRequired: false,
    notes: [
      "Asesmen trauma screening menghasilkan skor kecemasan tinggi (PCL-5: 48).",
      "Sesi konseling trauma healing ke-1 telah dilaksanakan pada 1 Maret 2025.",
      "Rekomendasi isolasi terduga pelaku dari kegiatan ekstrakurikuler bersama.",
    ],
    createdAt: "2025-03-01T15:00:00Z",
    updatedAt: "2025-03-02T10:00:00Z",
  },
  {
    id: "INT-PPA-2025-02",
    ticketId: "TMG-2025-44B9",
    victimAlias: "Ananda Bintang (Korban)",
    schoolOrigin: "SMA Negeri 1 Jakarta",
    category: "Cyberbullying & Pelanggaran Privasi Digital",
    urgency: "Sedang",
    assignedPsychologist: "Faisal Akbar, S.Psi (Konselor Remaja)",
    assignedLegalAid: "Divisi Siber DP3A",
    stage: "Asesmen Awal",
    shelterRequired: false,
    notes: [
      "Take down permintaan konten foto tidak senonoh di grup chat berhasil difasilitasi.",
      "Pendampingan digital resilience dan pemulihan reputasi di lingkungan pertemanan.",
    ],
    createdAt: "2025-03-02T09:30:00Z",
    updatedAt: "2025-03-02T11:15:00Z",
  },
  {
    id: "INT-PPA-2025-03",
    ticketId: "TMG-2025-78A1",
    victimAlias: "Ananda Surya (Korban)",
    schoolOrigin: "SMA Negeri 1 Jakarta",
    category: "Perundungan / Pemalakan",
    urgency: "Tinggi",
    assignedPsychologist: "Dr. Maria Ulfah, M.Psi., Psikolog",
    stage: "Perlindungan & Safehouse",
    shelterRequired: false,
    notes: [
      "Monitoring titik buta kantin dan penyusunan SOP perlindungan jalur pulang sekolah.",
      "Mediasi terpisah antara orang tua siswa dengan jaminan non-retaliation.",
    ],
    createdAt: "2025-02-28T16:00:00Z",
    updatedAt: "2025-03-01T14:00:00Z",
  },
];

export const HELP_ARTICLES: HelpArticle[] = [
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
  {
    id: "art-2",
    title: "Jaminan Privasi Kriptografis & Zero-Knowledge Proof",
    category: "Privasi & Keamanan",
    readTime: "4 menit",
    iconName: "Lock",
    excerpt:
      "Penjelasan teknis bagaimana sistem memastikan server kami tidak pernah menyimpan IP, MAC Address, atau identitas Anda.",
    content: [
      "TAMENG dibangun dengan prinsip Zero-Knowledge Architecture.",
      "Server tidak mencatat alamat IP (IP anonymization), tidak merekam User-Agent perangkat, dan membulatkan timestamp waktu untuk mencegah korelasi log jaringan.",
      "Isi laporan dienkripsi secara end-to-end sehingga hanya Konselor BK yang berwenang yang dapat membaca deskripsi setelah diverifikasi di lingkungan sekolah.",
      "PIN keamanan Anda hanya tersimpan secara lokal di browser dan tidak pernah dikirim ke jaringan internet.",
    ],
  },
  {
    id: "art-3",
    title: "Cara Menggunakan Nomor Tiket & Mengobrol Aman dengan Guru BK",
    category: "Tracking Tiket",
    readTime: "2 menit",
    iconName: "MessageSquare",
    excerpt:
      "Panduan memantau proses tindak lanjut laporan dan menjawab pesan dari Guru BK tanpa login akun.",
    content: [
      "Setelah mengirim laporan, Anda mendapatkan Nomor Tiket (contoh: TMG-2025-XXXX).",
      'Buka menu "Cek Status Tiket", masukkan nomor tersebut untuk melihat perkembangan secara langsung.',
      "Jika Guru BK mengirimkan pesan klarifikasi atau menawarkan waktu pertemuan rahasia di tempat yang aman, Anda dapat membalasnya langsung lewat kolom chat terenkripsi.",
      "Seluruh percakapan dijamin kerahasiaannya di bawah sumpah profesi Bimbingan Konseling.",
    ],
  },
  {
    id: "art-4",
    title: "Panduan Mode Kios untuk Komputer Bersama di Sekolah",
    category: "Akun & Token",
    readTime: "3 menit",
    iconName: "Monitor",
    excerpt:
      "Langkah aman menggunakan komputer lab atau tablet sekolah tanpa meninggalkan jejak riwayat.",
    content: [
      "Jika Anda tidak memiliki gawai pribadi dan ingin melapor dari komputer lab sekolah atau perpustakaan, gunakan Mode Kios.",
      "Mode Kios meminta Kode Sesi sementara (dapat diperoleh dari kartu token atau petugas).",
      "Setiap sesi memiliki batas waktu otomatis 3 menit tanpa aktivitas untuk mencegah orang lain melihat layar Anda.",
      "Saat sesi berakhir atau tombol Keluar ditekan, seluruh cache memori seketika dihapus permanen.",
    ],
  },
  {
    id: "art-5",
    title: "SOP Satgas PPKSP & Kebijakan Perlindungan Korban",
    category: "Kebijakan Sekolah",
    readTime: "5 menit",
    iconName: "FileText",
    excerpt:
      "Hak perlindungan siswa sesuai Permendikbudristek No. 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan.",
    content: [
      "Setiap siswa berhak atas rasa aman dan bebas dari segala bentuk intimidasi, pemalakan, pelecehan, dan diskriminasi di lingkungan pendidikan.",
      "Satgas PPKSP dilarang keras membuka identitas pelapor kepada terduga pelaku maupun pihak luar yang tidak berwenang.",
      "Sekolah menjamin pemulihan psikologis korban melalui konseling gratis dan perlindungan hak belajar.",
      "Pelaku akan mendapatkan sanksi edukatif, administratif, hingga pembinaan disiplin sesuai ketentuan yang berlaku.",
    ],
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    category: "Privasi & Kerahasiaan",
    question:
      "Apakah Guru BK atau Wali Kelas bisa mengetahui siapa yang mengirim laporan?",
    answer:
      "Tidak. Sistem TAMENG tidak menyimpan identitas pelapor, email, nomor ponsel, nama perangkat, maupun alamat IP. Laporan hanya berisi nomor acak (Tiket). Guru BK hanya menerima informasi mengenai kejadian yang Anda ceritakan tanpa mengetahui siapa Anda.",
  },
  {
    id: "faq-2",
    category: "Privasi & Kerahasiaan",
    question:
      "Bagaimana jika saya tidak sengaja menulis nama saya atau kelas saya di dalam cerita?",
    answer:
      "TAMENG dilengkapi fitur Deteksi Otomatis PII (Personally Identifiable Information). Ketika Anda mengetik, sistem langsung mendeteksi nama, rombongan belajar/kelas, NISN, atau nomor kontak, dan memberikan tombol 1-klik untuk menyamarkan (sensor) secara otomatis sebelum dikirim.",
  },
  {
    id: "faq-3",
    category: "Teknis & Tiket",
    question: "Apa yang terjadi jika saya lupa nomor tiket saya?",
    answer:
      "Jika Anda mencatat Kode Pemulihan (Recovery Key) saat mengirim laporan atau aktivasi token, Anda dapat memulihkan akses tiket Anda. Namun, demi alasan privasi mutlak, pihak sekolah tidak bisa mencarikan tiket berdasarkan nama Anda karena kami tidak menyimpan kaitan nama sama sekali.",
  },
  {
    id: "faq-4",
    category: "Keamanan & Tombol Darurat",
    question: 'Apa fungsi tombol "Keluar Cepat" (Quick Exit)?',
    answer:
      'Jika ada orang yang tiba-tiba mendekat saat Anda sedang membuka TAMENG, tekan tombol "Keluar Cepat" (atau tekan tombol ESC dua kali). Layar akan seketika menutup aplikasi, menghapus data tampilan di memori, dan mengarahkan peramban Anda ke halaman pencarian Google.',
  },
  {
    id: "faq-5",
    category: "Aktivasi Token",
    question: "Untuk apa kartu Token Sekolah?",
    answer:
      "Kartu token diberikan oleh pihak sekolah kepada seluruh siswa secara acak saat masa orientasi. Token ini berfungsi memvalidasi bahwa pelapor adalah bagian dari warga sekolah tanpa mengaitkan token dengan nama atau nomor induk siswa manapun.",
  },
  {
    id: "faq-6",
    category: "Kedaruratan",
    question:
      "Apakah TAMENG bisa digunakan saat kondisi bahaya fisik mendesak?",
    answer:
      "TAMENG adalah platform pelaporan dan konseling tindak lanjut. Jika Anda berada dalam bahaya fisik maut atau ancaman kekerasan langsung detik ini, segera hubungi Layanan Darurat Nasional SAPA 129, Polisi 110, atau tekan menu Kontak Darurat di bagian atas layar.",
  },
];

export const EMERGENCY_CONTACTS = [
  {
    name: "Layanan Sahabat Perempuan & Anak (SAPA)",
    number: "129",
    type: "Hotline KemenPPPA 24 Jam",
    description:
      "Layanan gratis pengaduan kekerasan perempuan dan anak dari Kementerian PPPA RI.",
    whatsapp: "08111-129-129",
  },
  {
    name: "Panggilan Darurat Kepolisian RI",
    number: "110",
    type: "Polisi / Kedaruratan Langsung",
    description:
      "Untuk penanganan tindak kekerasan fisik dan ancaman keselamatan jiwa saat ini juga.",
    whatsapp: "-",
  },
  {
    name: "UPTD PPA (Perlindungan Perempuan & Anak Daerah)",
    number: "0813-888-129",
    type: "Pendampingan Hukum & Psikologis",
    description:
      "Pusat penanganan kasus kekerasan anak dan pendampingan trauma tingkat daerah.",
    whatsapp: "0813-888-129",
  },
  {
    name: "Hotline Rahasia Guru BK Sekolah",
    number: "0821-9988-7711",
    type: "Konseling Internal Sekolah",
    description:
      "Jalur siaga pesan rahasia Konselor Sekolah (Senin - Jumat 07.00 - 17.00 WIB).",
    whatsapp: "0821-9988-7711",
  },
];
