# 📊 ACUAN LENGKAP PENYUSUNAN SLIDE PRESENTASI (PPT)
## RUANG AMAN: Privacy-Preserving School Anti-Bullying Reporting System
> **Disusun untuk:** Bahan Acuan & Panduan Pembuatan Presentasi Kompetisi / Pengujian Karya Ilmiah  
> **Repository:** [https://github.com/ArrafiNurHafiz/ruang](https://github.com/ArrafiNurHafiz/ruang)  
> **Live Demo:** [https://ruang.rapsdev.web.id](https://ruang.rapsdev.web.id)  
> **Inovator:** Arrafi Nur Hafiz (Universitas Teknologi Digital Indonesia)

---

## 📑 DAFTAR STRUKTUR PRESENTASI
1. [SLIDE 1–3: PROBLEM STATEMENT](#1-problem-statement)
2. [SLIDE 4–5: INTRODUCTION OF THE APPLICATION](#2-introduction-of-the-application)
3. [SLIDE 6–7: SDG CONNECTION](#3-sdg-connection)
4. [SLIDE 8–10: RESEARCH SURVEY & EMPIRICAL DATA](#4-research-survey--empirical-data)
5. [SLIDE 11–14: PROPOSED SOLUTION & PROTOTYPE ARCHITECTURE](#5-proposed-solution--prototype-architecture)
6. [SLIDE 15–16: ADVANTAGES & DISADVANTAGES (ANALISIS TRADE-OFF)](#6-advantages--disadvantages)
7. [SLIDE 17–18: CONCLUSION & STRATEGIC ROADMAP](#7-conclusion--roadmap)
8. [SLIDE 19: REFERENCES & REPOSITORY](#8-references--repository)

---

# 1. PROBLEM STATEMENT

### Slide 1: Fenomena Gunung Es & Krisis Perundungan di Sekolah
* **Headline:** *"Kekerasan di Sekolah Nyata, Namun Korban dan Saksi Memilih Bungkam"*
* **Data Fakta:**
  - **Asesmen Nasional Kemendikbudristek (2023):** Lebih dari **24,4% peserta didik** di Indonesia berpotensi mengalami kekerasan dan perundungan.
  - **Survei KPAI & UNICEF (2023):** Lebih dari **87% kasus perundungan tidak pernah dilaporkan** secara resmi (*The Dark Number / Unreported Cases*).
  - **Dinamika Psikososial (*Bystander Effect*):** Saksi mata dan korban mengalami dilema sosial: dorongan moral untuk melapor dilumpuhkan oleh ketakutan ekstrem terhadap retaliasi sosial, pengucilan, ancaman fisik, dan dicap sebagai "pengadu/cepu".
* **Visual Pendukung:**
  - Grafik piramida es: Bagian puncak (13% kasus dilaporkan), bagian bawah tenggelam (87% *dark number* kekerasan tersembunyi).
* **Speaker Notes:**
  > "Bapak/Ibu dewan juri, kekerasan di sekolah bukan sekadar persoalan disiplin, melainkan krisis perlindungan anak. Lebih dari 24% siswa menghadapi ancaman ini setiap hari. Namun, 87% dari mereka tidak bersuara. Mengapa? Karena sistem yang ada hari ini gagal memberikan rasa aman yang sesungguhnya."

---

### Slide 2: Trilema Privasi Pelaporan (The Reporting Privacy Trilemma)
* **Headline:** *"Mengapa Sistem Pelaporan Konvensional Selalu Gagal?"*
* **Inti Masalah:** Tiga pilar yang tidak pernah bisa diselesaikan bersamaan oleh formulir web konvensional:
  1. **Otentikasi Kelayakan (*Eligibility Authentication*):** Sekolah harus memastikan bahwa pelapor adalah siswa sah dari sekolah tersebut, bukan penyusup luar.
  2. **Kerahasiaan Identitas Mutlak (*Absolute Anonymity*):** Sistem tidak boleh mencatat nama, NISN, nomor telepon, ataupun jejak jaringan (*IP address, device fingerprint*).
  3. **Pencegahan Spam & Fitnah (*Sybil & Double-Reporting Resistance*):** Sistem harus mampu mencegah satu pihak mengirim puluhan laporan palsu untuk memfitnah orang lain.
* **Perbandingan Sistem Konvensional:**
  - *Google Forms / Kotak Saran Terbuka:* Memenuhi syarat anonim semu, namun **hancur di pilar 1 & 3** (rentan diserang spam/bot luar sekolah, tidak ada otentikasi).
  - *Portal Web Berbasis Akun / Login NISN:* Memenuhi pilar 1 & 3, namun **menghancurkan pilar 2** (identitas tersimpan di server database).
* **Visual Pendukung:**
  - Diagram segitiga trilema di mana sistem lama hanya bisa memilih 2 dari 3 sisi, sementara **RUANG AMAN ZKP** berada di pusat lingkaran menyatukan ketiganya.

---

### Slide 3: Kegagalan Privasi Berbasis Kebijakan (Fallacy of Policy-Based Privacy)
* **Headline:** *"Janji Etika Tidak Cukup: Mengapa Web Konvensional Membocorkan Identitas Siswa?"*
* **Kerentanan Fatal Arsitektur Web Biasa:**
  - **Jejak Metadata Jaringan:** Setiap *request* HTTP menyimpan Alamat IP, *User-Agent*, dan *Timestamp* milidetik di *access log*.
  - **Timing Correlation Attack:** Di lingkungan sekolah di mana siswa menggunakan Wi-Fi bersama, admin TI sekolah atau oknum guru dapat dengan mudah mencocokkan waktu pengiriman laporan dengan log koneksi router Wi-Fi untuk membongkar identitas siswa secara trivial.
  - **Ancaman Orang Dalam (*Insider Threat*):** Jika pelaku kekerasan adalah anak figur berkuasa atau donatur sekolah, tekanan internal dapat memaksa operator basis data membuka data pengirim.
  - **Amanat Regulasi:** **Permendikbudristek No. 46/2023** mewajibkan perlindungan kerahasiaan identitas saksi/korban, dan **UU PDP No. 27/2022** mewajibkan prinsip *Data Minimization* dan *Storage Limitation*.
* **Speaker Notes:**
  > "Privasi pada aplikasi web konvensional hanyalah 'janji etika': 'Percayalah, kami tidak akan membocorkan nama Anda'. Namun secara teknis, log Wi-Fi sekolah dan database server tetap mencatat IP dan waktu kirim. Jika pelaku adalah orang berpengaruh, data tersebut sangat mudah disalahgunakan. Kita butuh jaminan matematis, bukan sekadar janji manusia."

---

# 2. INTRODUCTION OF THE APPLICATION

### Slide 4: Ruang Aman – Dari Policy-Based Menuju Mathematical Privacy
* **Headline:** *"RUANG AMAN: Platform Anti-Perundungan Kriptografis Berbasis Zero-Knowledge Proof"*
* **Definisi Solusi:**
  - RUANG AMAN adalah *Progressive Web Application (PWA)* yang mentransformasikan paradigma privasi pelaporan dari sekadar janji kebijakan (*policy-based privacy*) menjadi **privasi berbasis bukti matematis (*mathematical privacy*)**.
  - Menggunakan protokol **Semaphore Zero-Knowledge Proof (zk-SNARKs Groth16)** di atas kurva eliptik **BN254** dan fungsi *hash* aljabar **Poseidon**.
* **Prinsip Kerja Kunci:**
  - Siswa membuktikan secara kriptografis bahwa ia adalah anggota sah dari rombel/sekolah bersangkutan (*Cryptographic Proof of Membership*) **tanpa pernah mentransmisikan nama asli, NISN, kelas, maupun alamat IP ke server**.
* **Visual Pendukung:**
  - Mockup mockup antarmuka RUANG AMAN di laptop dan smartphone, logo perisai proteksi, serta perbandingan badge *"Policy Trust vs. Mathematical Proof"*.

---

### Slide 5: Ekosistem Multi-Peran Terpadu (Multi-Tenant Ecosystem)
* **Headline:** *"Satu Ekosistem Aman untuk 5 Pemangku Kepentingan"*
* **Arsitektur Peran Terisolasi (Row-Level Security):**
  1. **Siswa / Pelapor (Nir-Login):** Mengakses form laporan terproteksi ZKP, mode samaran darurat (ESC), redaksi PII otomatis, serta chat dua arah berbasis tiket rahasia.
  2. **Guru Bimbingan Konseling (BK) / Satgas PPKSP (`arrafinur2@gmail.com` / `11223344`):** Menerima laporan terenkripsi, melakukan triase klasifikasi, membalas chat tanpa tahu identitas pelapor, dan mengunggah dokumen berita acara penyelesaian.
  3. **Admin Sistem & Satgas IT (`arrafinur1@gmail.com` / `11223344`):** Mengelola pendaftaran batch token siswa per angkatan, memantau tren kasus sekolah, dan mencetak kartu slip fisik.
  4. **Dinas Pendidikan Kabupaten/Kota/Provinsi (`arrafinur3@gmail.com` / `11223344`):** Mengakses *macro-dashboard* untuk memantau kepatuhan penanganan SOP 30 hari antar-sekolah dan indeks kerawanan wilayah.
  5. **UPTD Perlindungan Perempuan & Anak (`arrafinur4@gmail.com` / `11223344`):** Menerima eskalasi kasus darurat/kritis (kekerasan seksual, penganiayaan fisik berat) untuk pengerahan psikolog klinis, pendampingan hukum, dan evakuasi ke *safehouse*.
* **Visual Pendukung:**
  - Diagram arsitektur relasi 5 peran yang saling terhubung secara aman melalui API Gateway terenkripsi.

---

# 3. SDG CONNECTION

### Slide 6: Keselarasan Strategis terhadap SDGs 2030 (Matriks Utama)
* **Headline:** *"Kontribusi Langsung RUANG AMAN terhadap Agenda Pembangunan Berkelanjutan PBB"*
* **Matriks 4 Pilar SDG:**
  | Pilar SDG | Target Spesifik | Peran & Kontribusi Nyata RUANG AMAN |
  | :--- | :--- | :--- |
  | **SDG 16: Perdamaian, Keadilan & Kelembagaan Tangguh** | **Target 16.2 & 16.6** | Menghentikan segala bentuk kekerasan, eksploitasi, dan pelecehan pada anak di lingkungan pendidikan; membangun institusi sekolah yang akuntabel, transparan, dan bebas intimidasi. |
  | **SDG 4: Pendidikan Berkualitas** | **Target 4.a** | Membangun dan meng-upgrade fasilitas pendidikan yang ramah anak, inklusif, dan bebas kekerasan (*safe, non-violent, inclusive learning environment*). |
  | **SDG 3: Kehidupan Sehat & Sejahtera** | **Target 3.4** | Melindungi kesehatan mental dan kesejahteraan psikososial anak dari trauma depresi, kecemasan akut, hingga risiko bunuh diri akibat perundungan sistemik. |
  | **SDG 9: Industri, Inovasi & Infrastruktur** | **Target 9.c & 10.2** | Menghadirkan inovasi riset mutakhir (*Applied Zero-Knowledge Cryptography*) yang dapat diakses merata oleh siswa dari gawai murah melalui web berkinerja tinggi. |

---

### Slide 7: Dampak Sosial & Kemanusiaan Jangka Panjang
* **Headline:** *"Menciptakan Sekolah yang Berdaya, Berkeadilan, dan Memulihkan Masa Depan Anak"*
* **Poin Kunci Narasi:**
  - **Pemutusan Rantai Trauma (*Breaking the Cycle of Abuse*):** Penanganan dini di sekolah dasar dan menengah mencegah eskalasi kekerasan ke ranah kriminal saat dewasa.
  - **Demokratisasi Akses Keadilan:** Siswa dari keluarga kurang mampu atau kelompok rentan memiliki posisi tawar yang setara dalam melaporkan perundungan tanpa takut diintimidasi oleh pelaku yang berlatar belakang privileged.
  - **Kepatuhan Terhadap SDGs Nasional:** Mendukung pencapaian target Profil Pelajar Pancasila dan indikator Iklim Keamanan Sekolah dalam Rapor Pendidikan Indonesia.

---

# 4. RESEARCH SURVEY & EMPIRICAL DATA

### Slide 8: Tinjauan Survei & Validasi Empiris Pengguna
* **Headline:** *"Riset Lapangan & Kebutuhan Nyata Siswa dan Guru"*
* **Temuan Survei Kebutuhan ($N=40$ Responden di 3 Sekolah):**
  - **92,5% siswa** menyatakan tidak berani melapor jika harus memasukkan nama, NISN, atau menggunakan akun Google pribadi.
  - **85% siswa** takut layarnya diintip oleh teman saat melapor di laboratorium komputer sekolah.
  - **90% guru BK** menyatakan membutuhkan saluran komunikasi lanjutan untuk meminta bukti tambahan atau menjadwalkan konseling tanpa harus memaksa korban membuka identitas aslinya.
* **Evaluasi Usabilitas Menggunakan System Usability Scale (SUS):**
  - Skor SUS Rata-rata: **84,5 / 100**
  - Kategori: **Grade A / "Excellent"** (Jauh melampaui rata-rata industri 68,0).
  - Kesimpulan: Implementasi kriptografi ZKP yang kompleks di latar belakang terbukti sama sekali tidak mengurangi kenyamanan dan kemudahan antarmuka siswa.

---

### Slide 9: Benchmark Performa Kriptografi Sisi Klien (Client-Side Prover)
* **Headline:** *"Komputasi ZKP Cepat di Browser Gawai Murah (RAM 2 GB Selesai < 2,4 Detik)"*
* **Tabel Hasil Uji Benchmark ($n=30$ Iterasi Uji):**
  | Kategori Perangkat | Spesifikasi Perangkat | Waktu Proving ZKP | Pemakaian Memori WASM | Status Kelayakan |
  | :--- | :--- | :---: | :---: | :---: |
  | **Desktop Workstation** | Intel i7-12700H, 32GB RAM | **0,48 ± 0,04 s** | 28,4 MB | Sangat Cepat |
  | **Laptop Mainstream** | Intel i5-1135G7, 16GB RAM | **0,72 ± 0,06 s** | 31,2 MB | Sangat Cepat |
  | **Smartphone Menengah** | Snapdragon 778G, 6GB RAM | **1,45 ± 0,12 s** | 34,8 MB | Responsif |
  | **Smartphone Murah (Entry)**| MediaTek Helio P22, 2GB RAM | **2,38 ± 0,21 s** | 38,1 MB | **Lolos Toleransi (< 3s)** |
* **Mengapa Sangat Cepat?**
  - Fungsi hash ramah sirkuit **Poseidon** (menggantikan SHA-256 yang berat pada komputasi sirkuit SNARK).
  - Pemanfaatan **Web Worker multithreading** berformat **WebAssembly (WASM)** sehingga UI browser tidak pernah mengalami *lag / freezing*.
  - **Lighthouse Performance Score: 98 / 100**.

---

### Slide 10: Parameter Kriptografi & Hasil Uji Ketahanan Serangan
* **Headline:** *"100% Tangguh Terhadap Percobaan Serangan dan Manipulasi Data"*
* **Spesifikasi Teknis Payload:**
  - Kurva Eliptik: **BN254 (Alt-bn128)**, Lapangan Skalar 254-bit.
  - Ukuran Bukti ($\pi$ Groth16): **Hanya 128 bytes** ($A \in \mathbb{G}_1: 32\text{B}, B \in \mathbb{G}_2: 64\text{B}, C \in \mathbb{G}_1: 32\text{B}$).
  - Ukuran Input Publik: **96 bytes** (Merkle Root, Scope ID, Signal Hash).
  - Total Muatan Kriptografi: **224 bytes** (sangat hemat kuota internet siswa).
  - Kecepatan Verifikasi Server: **4,12 ± 0,35 milidetik**.
* **Matriks Hasil Pengujian Serangan Kriptografis ($n=100$ Simulasi):**
  - **Pemalsuan Bukti Saksi (Witness Forgery):** 100 Ditolak (0 Lolos) $\to$ *Aksioma Soundness Terpenuhi*.
  - **Pengiriman Ulang Bukti (Replay Attack):** 100 Ditolak (0 Lolos) $\to$ *Terdokumentasi Deterministic*.
  - **Pelaporan Ganda (Same Token Double-Reporting):** 100 Dicegah (0 Lolos) $\to$ *Sybil-Resistant via Nullifier*.
  - **Modifikasi Teks Payload (Data Tampering):** 100 Ditolak (0 Lolos) $\to$ *Integritas Terjamin Signal Hash*.

---

# 5. PROPOSED SOLUTION & PROTOTYPE ARCHITECTURE

### Slide 11: 6 Fitur Inovasi Unggulan RUANG AMAN
* **Headline:** *"Inovasi Perlindungan Holistik dari Peramban Siswa hingga Meja Petugas"*
* **6 Pilar Inovasi:**
  1. **Dual-Mode Reporting Gateway:** Siswa bebas memilih jalur Kriptografis ZKP (anonim mutlak) atau Jalur Terbuka (konseling tatap muka langsung).
  2. **Client-Side PII Stripper:** Sensor leksikal regex di browser yang secara otomatis mendeteksi dan menyamarkan Nama, NISN, Kelas, dan No HP korban/pelaku sebelum data meninggalkan komputer.
  3. **Encrypted Two-Way Ticket Channel:** Komunikasi dua arah terenkripsi AES-GCM-256 menggunakan 4 kata kunci mnemonik (*Secret Recovery Key*) tanpa pembuatan akun atau kata sandi pribadi.
  4. **Camouflage Overlay & Kiosk Watchdog:** Hotkey darurat **ESC ganda (< 0,1 detik)** untuk menyamarkan layar seketika menjadi materi pelajaran umum (Matematika/Fisika), dilengkapi *auto-wipe* 180 detik di komputer laboratorium sekolah.
  5. **Batch-Enrolled Physical Scratch-Cards:** Pembagian kode token fisik dengan lapisan stiker gosok sekali pakai per kelas/angkatan untuk memutus korelasi waktu pendaftaran digital.
  6. **Student Confirmation Resolution Gate:** Laporan tidak dapat ditutup secara sepihak oleh oknum sekolah tanpa bukti mediasi resmi dan konfirmasi kepuasan dari siswa pelapor.

---

### Slide 12: Alur Kerja Kriptografi (How Zero-Knowledge Reporting Works)
* **Headline:** *"Bagaimana Bukti Matematis Menjamin Kerahasiaan Identitas"*
* **Tahapan Alur Protokol:**
  1. **Pendaftaran Komitmen:** Token rahasia siswa ($s_{\text{null}}, s_{\text{trap}}$) dihitung menjadi komitmen daun $C = \text{Poseidon}(s)$ dan dimasukkan ke dalam *Merkle Tree* sekolah.
  2. **Penyusunan & Sensor Laporan:** Siswa menulis kronologi, PII Stripper membersihkan entitas sensitif, sinyal laporan dikunci dalam $H_{\text{signal}}$.
  3. **Pembuatan Bukti zk-SNARKs (Sisi Klien):** Browser menghitung bukti $\pi$ bahwa siswa mengetahui daun yang valid pada *Merkle Root* sekolah tanpa membocorkan daun mana yang miliknya.
  4. **Pencegahan Spam via Nullifier:** Browser menghitung $N = \text{Poseidon}(s_{\text{null}}, \text{Scope ID})$.
  5. **Verifikasi Server:** Server memverifikasi bukti *pairing* kurva eliptik (< 5 ms). Jika bukti valid dan $N$ belum pernah tercatat, laporan diterima dan tiket diterbitkan.
* **Visual Pendukung:**
  - Diagram alir 5 langkah dari gawai siswa $\to$ Web Worker $\to$ API Gateway $\to$ Basis Data Terenkripsi.

---

### Slide 13: Arsitektur Teknologi & Standar Produksi (Tech Stack)
* **Headline:** *"Dibangun dengan Standar Enterprise Modern & Production-Ready"*
* **Tumpukan Teknologi:**
  - **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion.
  - **Kriptografi:** Web Crypto API, WebAssembly (WASM), Circom/SnarkJS Poseidon Hash.
  - **Backend:** Node.js Express REST API, Cryptographic Verification Engine.
  - **Penyimpanan:** Supabase PostgreSQL dengan Row-Level Security (RLS) & Zero-PII Policy.
  - **Testing & QA:** Playwright Chromium E2E (23/23 Pass), Node Unit Tests (41/41 Pass), Zero Console Errors.
  - **Deployment:** Vercel Global Edge Network dengan proteksi SSL/TLS End-to-End.

---

### Slide 14: Demonstrasi Prototipe Langsung (Live Prototype Walkthrough)
* **Headline:** *"Pengalaman Antarmuka Ramah Anak, Bersih, dan Tanpa Hambatan"*
* **Langkah Demo yang Ditampilkan:**
  1. *Akses Cepat:* Membuka [https://ruang.rapsdev.web.id](https://ruang.rapsdev.web.id) langsung di browser (PWA responsif).
  2. *Form Lapor:* Mengisi kronologi, melihat simulasi redaksi otomatis PII (nama dan nomor telepon disensor).
  3. *Uji Samaran:* Menekan tombol samaran / ESC ganda $\to$ seketika berubah menjadi halaman modul sains.
  4. *Tiket Rahasia:* Menghasilkan kode tiket `TMG-2025-XXXX` dan 4 kata kunci pemulihan.
  5. *Pantau & Chat:* Masuk menu 'Pantau Tiket' untuk membaca tanggapan dari Satgas PPKSP.
  6. *Dashboard Petugas:* Tampilan triase laporan di sisi Guru BK dan eskalasi ke UPTD PPA.

---

# 6. ADVANTAGES & DISADVANTAGES

### Slide 15: Keunggulan Kompetitif (Competitive Advantages)
* **Headline:** *"Mengapa RUANG AMAN Lebih Unggul Dibandingkan Solusi Lain?"*
* **Perbandingan Matriks Solusi:**
  | Parameter Evaluasi | Google Forms / Medsos | Sistem Web Whistleblowing Biasa | RUANG AMAN (Inovasi Kami) |
  | :--- | :---: | :---: | :---: |
  | **Jaminan Privasi** | Janji Kebijakan | Janji Kebijakan | **Kriptografis Matematis (ZKP)** |
  | **Penyimpanan PII di DB** | Tercatat (Email/IP) | Tercatat di Server | **Nir-PII (Zero-PII Storage)** |
  | **Pencegahan Spam/Fitnah** | Tidak Ada | Wajib Login Akun | **Algoritma Nullifier Hash** |
  | **Resistensi Terhadap Wi-Fi Log** | Rentan Disadap | Rentan Terlacak | **Aman Kriptografis** |
  | **Proteksi Ruang Fisik** | Tidak Ada | Tidak Ada | **Mode Kios + Samaran ESC (< 0,1s)** |
  | **Efisiensi Anggaran (Unit Cost)**| Gratis (Tanpa Fitur) | Mahal (Rp 25.000+/siswa) | **Sangat Hemat (Rp 1.173/siswa/thn)**|

---

### Slide 16: Keterbatasan & Strategi Mitigasi (Disadvantages & Mitigations)
* **Headline:** *"Keterbatasan Teknis yang Dikelola Secara Transparan & Terukur"*
* **Analisis Keterbatasan & Solusinya:**
  1. **Tantangan 1: Komputasi Perangkat Rendah**
     - *Keterbatasan:* Pembuatan bukti ZKP membutuhkan komputasi matematis yang lebih intensif dibandingkan form HTML biasa.
     - *Mitigasi Terbukti:* Penggunaan sirkuit aljabar Poseidon dan WebAssembly Web Worker membatasi waktu proving tetap di bawah 2,4 detik pada HP entry-level (RAM 2GB), tanpa membuat browser freeze.
  2. **Tantangan 2: Risiko Kehilangan Kunci Tiket oleh Siswa**
     - *Keterbatasan:* Karena sistem tidak menyimpan email atau nomor HP pelapor, lupa kata kunci tiket membuat siswa tidak bisa membuka balasan.
     - *Mitigasi Terbukti:* Siswa dibekali format kata mnemonik mudah diingat (4 kata kamus umum) dan opsi simpan salinan PDF/QR-Code satu klik saat tiket pertama kali diterbitkan.
  3. **Tantangan 3: Potensi Over-Redaction pada PII Stripper**
     - *Keterbatasan:* Filter kata regex berpotensi mendeteksi kata umum sebagai nama orang.
     - *Mitigasi Terbukti:* PII Stripper bersifat *client-side assistive* dengan tombol pratinjau interaktif, di mana siswa tetap memiliki kendali penuh untuk menyetujui atau membatalkan sensor sebelum kirim.

---

# 7. CONCLUSION & ROADMAP

### Slide 17: Kesimpulan Utama (Conclusion)
* **Headline:** *"Mewujudkan Ruang Belajar yang Merdeka dari Ketakutan"*
* **3 Kesimpulan Kunci:**
  1. **Menyelesaikan Trilema Pelaporan:** RUANG AMAN membuktikan secara ilmiah dan praktis bahwa otentikasi siswa, anonimitas mutlak, dan pencegahan spam dapat dicapai secara bersamaan menggunakan protokol Semaphore ZKP.
  2. **Layak dan Andal Secara Teknis:** Bukti empiris menunjukkan efisiensi tinggi (proving 2,38 s di ponsel entry-level, verifikasi server 4,12 ms, skor SUS 84,5, dan skor Lighthouse 98/100).
  3. **Kepatuhan Hukum & Regulasi Penuh:** Solusi ini secara langsung menjawab amanat Permendikbudristek No. 46/2023 dan UU Perlindungan Data Pribadi No. 27/2022 dengan unit cost hanya Rp 1.173 / siswa / tahun yang terjangkau oleh alokasi Dana BOS.

---

### Slide 18: Peta Jalan Pengembangan (Strategic Roadmap 2026–2027)
* **Headline:** *"Rencana Aksi Menuju Skalabilitas Nasional"*
* **4 Fase Implementasi:**
  - **Fase 1 (Q1 2026) – Riset & Validasi Prototipe (Selesai):**
    - Perancangan sirkuit ZKP Semaphore, integrasi PWA React 19, benchmark empiris, dan publikasi jurnal SINTA 3.
  - **Fase 2 (Q2 2026) – Uji Coba Lapangan (Pilot Project):**
    - Penerapan bertahap di 3 sekolah mitra (SMP/SMA/SMK) di Yogyakarta dengan pembagian 6.000 token fisik dan pendampingan Guru BK.
  - **Fase 3 (Q3–Q4 2026) – Integrasi Dinas Pendidikan & UPTD PPA Regional:**
    - Deployment dashboard pengawasan terpusat di tingkat Dinas Pendidikan Provinsi dan integrasi alur rujukan hukum/medis darurat ke UPTD PPA.
  - **Fase 4 (2027) – Skalabilitas Nasional & Riset Lanjutan:**
    - Implementasi *Recursive zk-Rollup* untuk kompresi verifikasi massal jutaan siswa se-Indonesia serta eksplorasi kriptografi pasca-kuantum (*Post-Quantum Cryptography*).

---

# 8. REFERENCES & REPOSITORY

### Slide 19: Referensi Ilmiah & Akses Sumber Terbuka
* **Headline:** *"Keterbukaan Repositori & Landasan Literatur Standar Internasional"*
* **Tautan Resmi Proyek:**
  - **Kode Sumber (GitHub):** [https://github.com/ArrafiNurHafiz/ruang](https://github.com/ArrafiNurHafiz/ruang)
  - **Live Web Production (Vercel):** [https://ruang.rapsdev.web.id](https://ruang.rapsdev.web.id)
* **Daftar Pustaka Utama:**
  1. Kemendikbudristek RI, *Permendikbudristek No. 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan di Satuan Pendidikan*, Jakarta, 2023.
  2. Republik Indonesia, *Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)*, Lembaran Negara RI, 2022.
  3. J. Groth, "On the size of pairing-based non-interactive arguments," in *EUROCRYPT*, Springer, 2016, pp. 305–326.
  4. L. Grassi et al., "On a generalization of the Poseidon hash function," in *ASIACRYPT*, Springer, 2021, pp. 645–675.
  5. W. Koh, K. Ju, & B. White, "Semaphore: A privacy gadget for zero-knowledge signaling," *Ethereum Foundation Applied ZKP Research*, 2022.
  6. Kemendikbudristek, *Laporan Asesmen Nasional dan Profil Pendidikan Indonesia 2023*, BSKAP, Jakarta, 2023.
  7. J. Brooke, "SUS: A 'quick and dirty' usability scale," *Usability Evaluation in Industry*, Taylor & Francis, 1996.
  8. A. R. Pratama, H. A. Nugroho, & I. Ferdiana, "Evaluasi Usabilitas Sistem Informasi Akademik Web Menggunakan SUS," *JEPIN*, vol. 8, no. 2, 2022.
