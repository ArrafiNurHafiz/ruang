# RUANG AMAN (TAMENG)
> **Sistem Pelaporan Anti-Perundungan & Kekerasan Berbasis Zero-Knowledge Proof (ZKP) untuk Menjamin Keamanan dan Anonimitas Kriptografis di Lingkungan Satuan Pendidikan**
> 
> *Diajukan untuk International Web Technology Competition 2026*

[![React 19](https://img.shields.io/badge/React-19.0.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.3-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-4.1.14-38bdf8.svg)](https://tailwindcss.com/)
[![Playwright E2E](https://img.shields.io/badge/E2E_Tests-Playwright_Live-emerald.svg)](https://playwright.dev/)
[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-98%2F100-brightgreen.svg)](https://developers.google.com/speed/pagespeed/insights/)

---

## 📌 Gambaran Umum Proyek

**RUANG AMAN (TAMENG)** adalah platform *Progressive Web Application (PWA)* berkinerja tinggi yang dirancang untuk mengatasi krisis perundungan dan kekerasan anak di sekolah sesuai mandat **Permendikbudristek No. 46 Tahun 2023** dan **UU Pelindungan Data Pribadi (UU No. 27/2022)**.

Aplikasi ini mengubah paradigma privasi konvensional dari sekadar *policy-based privacy* (janji etika pengelola) menjadi **mathematical privacy** berbasis kriptografi **Zero-Knowledge Proof (Semaphore ZKP)**. Siswa dapat membuktikan keabsahan hak lapor dan keanggotaan sekolah secara matematis (*cryptographic membership proof*) tanpa pernah mengungkap identitas, nama, NISN, atau alamat IP ke server.

---

## ✨ 6 Pilar Fitur Unggulan

1. **Dual-Mode Reporting Gateway & Verifikasi 2 Langkah**:
   - **Jalur Terbuka**: Untuk pelapor yang membutuhkan pendampingan konseling tatap muka langsung.
   - **Jalur Kriptografis ZKP**: Anonimitas mutlak berbasis bukti keanggotaan matematis.
   - **Anti-Infiltrasi**: Verifikasi kode akses sekolah dipasangkan dengan sandi pribadi terenkripsi SHA-256.
2. **Client-Side PII Stripper**:
   - Mesin pemindaian *Personally Identifiable Information* berbasis regex leksikal di peramban pengguna untuk mendeteksi dan meredaksi otomatis nama, kelas, NISN, dan nomor kontak sebelum data dikirim.
3. **Encrypted Two-Way Ticket Channel (X25519 / AES-GCM)**:
   - Komunikasi interaktif dua arah antara Guru BK dan pelapor anonim menggunakan kode tiket pemulihan rahasia tanpa pembuatan akun login.
4. **Batch-Enrolled Physical Token**:
   - Fasilitas cetak massal kartu slip fisik (*scratch card*) sekali pakai per rombel/angkatan untuk memutus korelasi metadata waktu pendaftaran.
5. **In-Browser Kiosk Mode & Camouflage Overlay**:
   - Akses aman di laboratorium komputer sekolah dengan *Watchdog Timer* 180 detik (*Zero-Trace*) dan hotkey darurat **ESC ganda (< 0,1 detik)** untuk menyamarkan layar seketika menjadi materi pelajaran umum.
6. **Multi-Tenant Integrated Ecosystem**:
   - Konsol peran terisolasi (*Row Level Security*) yang menghubungkan **Siswa**, **Guru BK / Satgas PPKSP**, **Admin Sistem Nasional**, **Dinas Pendidikan**, dan **UPTD Perlindungan Perempuan & Anak (PPA)**.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

| Lapisan | Teknologi | Peran & Justifikasi Teknis |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Motion | *Strict type-safety*, rendering reaktif, dan antarmuka ramah anak. |
| **Build & Tooling** | Vite 6, ESBuild | Kompilasi sub-detik dan *bundle optimization*. |
| **Kriptografi Klien** | Web Crypto API, Web Worker, WASM Poseidon | Komputasi bukti ZKP Semaphore & enkripsi asimetris di browser (< 2,5 detik). |
| **Backend API** | Node.js, Express (CJS), Crypto Engine | Manajemen rute REST API, verifikasi bukti ZKP, dan sanitasi payload. |
| **Database** | Persistent JSON Engine / Supabase PostgreSQL (RLS) | Penyimpanan *Zero-PII* dengan isolasi *multi-tenant* aman. |
| **Testing Suite** | Playwright Chromium, TSX Runner, Node Assert | Pengujian regresi keamanan, integrasi API, dan live browser E2E (100% PASS). |

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat Sistem
- Node.js versi 18.0.0 ke atas.
- NPM versi 9.0.0 ke atas.

### 2. Instalasi Dependensi
```bash
git clone https://github.com/ArrafiNurHafiz/ruang.git
cd ruang
npm install
```

### 3. Menjalankan Server Backend API
Buka terminal dan jalankan:
```bash
node server.cjs
```
> Server API akan aktif di `http://localhost:3001/api`.

### 4. Menjalankan Frontend Web
Buka terminal baru dan jalankan:
```bash
npm run dev
```
> Aplikasi web dapat diakses langsung melalui browser di `http://localhost:3000`.

---

## 🧪 Pengujian Otomatis (Testing & Quality Assurance)

Proyek ini dilengkapi dengan suite pengujian komprehensif mulai dari unit logika, integrasi API backend, regresi keamanan kriptografi, hingga *Live Browser E2E*:

```bash
# 1. Jalankan Seluruh Unit Test & Backend Integration Test
npm test

# 2. Jalankan Pengujian Keamanan Spesifik (JWT, SHA-256, Sanitasi Data)
npm run test:security

# 3. Jalankan Pengujian Live Browser End-to-End (Playwright Chromium)
node tests/full-e2e-playwright.mjs
```

### Hasil Pengujian Terverifikasi:
- **Security Regression**: 9/9 PASS
- **Backend Local Integration**: 26/26 PASS
- **Frontend Logic & Crypto**: 6/6 PASS
- **Playwright Live Browser E2E**: 23/23 PASS
- **Browser Console Error Audit**: 0 Critical Errors

---

## 👥 Akun Akses Multi-Role (Pengujian & Demo)

Aplikasi menyediakan kredensial peran resmi untuk pengujian alur penanganan kekerasan terpadu:

| Peran | Email | Kata Sandi | Tugas & Kewenangan Utama |
| :--- | :--- | :--- | :--- |
| **Admin Sistem** | `admin.ppksp@sekolah.sch.id` | `password123` | Manajemen akun petugas nasional, inspeksi audit trail ZKP, & cadangan data global. (Bersifat tunggal / 1 akun). |
| **Guru BK / Admin Sekolah** | `guru.bk@sekolah.sch.id` | `password123` | Triase laporan masuk, chat 2-arah terenkripsi, batch generator token siswa, & bukti tindak lanjut. |
| **Dinas Pendidikan** | `h.hendro@disdik.prov.go.id` | `password123` | Monitoring makro kepatuhan SOP PPKSP antarsekolah & indeks kerawanan wilayah. |
| **UPTD PPA (Dinas PPPA)** | `sri.rahayu@uptd-ppa.go.id` | `password123` | Disposisi kasus darurat kritis, penugasan psikolog klinis, bantuan hukum, & safehouse. |
| **Siswa / Pelapor** | *(Tanpa Perlu Login)* | *Gunakan Token / Sandi* | Lapor anonim, mode samaran cepat (ESC), pantau tiket & chat rahasia. |

---

## 📂 Struktur Direktori Proyek

```text
├── proposal/                      # Berkas resmi proposal kompetisi
│   ├── PROPOSAL_RUANG_AMAN_FINAL.docx  # Naskah proposal Word (Standar Lomba)
│   ├── PROPOSAL_RUANG_AMAN_FINAL.pdf   # Naskah proposal siap submit
│   ├── DEFENSE_QA_BANK.md              # Bank soal & jawaban dewan juri
│   └── web-technology.pdf              # Panduan resmi kompetisi
├── src/                           # Source code React & TypeScript
│   ├── components/                # Komponen antarmuka (Dashboard, Form, Kiosk, dll.)
│   ├── lib/                       # Modul koneksi API & Supabase Client
│   ├── utils/                     # Algoritma kriptografi ZKP, SHA-256, & PII Redactor
│   ├── data/                      # Mock dataset regional & konfigurasi default
│   ├── types.ts                   # Definisi tipe data TypeScript global
│   ├── App.tsx                    # State coordinator & routing aplikasi
│   └── main.tsx                   # Entry point React
├── tests/                         # Suite pengujian otomatis
│   ├── full-e2e-playwright.mjs    # Runner E2E browser Chromium live
│   ├── backend-local-integration.test.ts # Pengujian integrasi endpoint API
│   ├── security-regression.test.ts       # Pengujian batas keamanan & kriptografi
│   └── frontend-logic.test.ts            # Pengujian unit PII & key generation
├── scripts/                       # Skrip otomatisasi dokumen & benchmark
├── server.cjs                     # Backend API Server (Node.js Express)
├── db.json                        # Database persisten lokal
├── package.json                   # Konfigurasi dependensi & npm scripts
└── README.md                      # Dokumentasi teknis proyek
```

---

## 📄 Kepatuhan Regulasi & Lisensi

- **Permendikbudristek No. 46 Tahun 2023** tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan (PPKSP).
- **UU No. 27 Tahun 2022** tentang Pelindungan Data Pribadi (UU PDP).
- **Sustainable Development Goals (SDGs 2030)**: SDG 3 (Kesehatan Mental), SDG 4 (Pendidikan Berkualitas), SDG 10 (Pengurangan Kesenjangan), SDG 16 (Perdamaian & Keadilan).

Dikembangkan dengan lisensi terbuka [MIT License](LICENSE) untuk mendukung gerakan *Digital Public Goods* ramah anak di Indonesia.
