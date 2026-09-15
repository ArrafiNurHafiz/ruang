# 📑 BANK PERTANYAAN & JAWABAN DEFENSE (Q&A DEFENSE BANK)
### International Web Technology Competition 2026
**Karya Inovasi:** RUANG AMAN (Sistem Pelaporan Anti-Perundungan Berbasis Zero-Knowledge Proof)

---

## 💰 KATEGORI 1: ANGGARAN, BIAYA & SKALABILITAS (BUDGET & UNIT ECONOMICS)

### Q1: "Dari mana Anda mendapatkan angka pada Rencana Anggaran Biaya (RAB)? Apakah ini angka karangan?"
* **Jawaban:**
  > "Angka anggaran dihitung secara empiris berdasarkan 3 sumber rujukan riil:
  > 1. **Infrastruktur Cloud:** Mengacu pada kalkulator resmi *DigitalOcean Droplet* ($6–12/bln) dan *Supabase Pro Tier*. Biaya sangat minim karena komputasi ZKP yang berat dijalankan 100% di peramban klien (*client-side* via Web Worker/WASM), sehingga beban CPU server tetap < 5%.
  > 2. **Cetak Slip Fisik:** Berdasarkan survei harga riil percetakan *offset* untuk kartu bahan Art Carton 260gr dengan stiker gosok (*scratch-off*), yaitu Rp 300–450/lembar untuk volume 6.000+ siswa.
  > 3. **Validasi Empiris:** Mengacu pada Standar Biaya Masukan (SBM) untuk pelaksanaan *Usability Testing* (SUS) bersama 40 responden di 3 sekolah mitra."

---

### Q2: "Bagaimana sistem ini membiayai operasionalnya setelah kompetisi selesai (Sustainability)?"
* **Jawaban:**
  > "Dengan *Unit Cost* hanya **Rp 1.173 / siswa / tahun**, operasional RUANG AMAN dapat didanai langsung melalui komponen pengembangan karakter/PPKSP pada **Dana BOS (Bantuan Operasional Sekolah)** Reguler sesuai Permendikbudristek No. 63/2023 tanpa membebani APBD secara signifikan. Untuk skala provinsi, RUANG AMAN disediakan sebagai *Open-Source Public Goods* yang dapat di-hosting terpusat oleh Pusdatin Disdik."

---

## 🔐 KATEGORI 2: KRIPTOGRAFI & KEAMANAN (ZKP & PRIVACY BY DESIGN)

### Q3: "Mengapa harus menggunakan Zero-Knowledge Proof (ZKP)? Mengapa tidak cukup form anonim biasa tanpa login?"
* **Jawaban:**
  > "Formulir anonim biasa memiliki 2 kelemahan fatal:
  > 1. **Tidak ada jaminan teknis:** Server tetap mencatat IP address, User-Agent, dan waktu kirim. Admin server masih bisa melacak siapa pelapornya.
  > 2. **Rentan Spam & Sybil Attack:** Siapapun dari luar sekolah bisa mengirim ribuan laporan palsu.
  > 
  > ZKP (Protokol Semaphore) menyelesaikan keduanya: siswa membuktikan secara matematis bahwa mereka **anggota sah sekolah tersebut (Proof of Membership)** tanpa pernah membocorkan identitas, nama, atau token ke server."

---

### Q4: "Bagaimana cara RUANG AMAN mencegah laporan palsu/fitnah massal (Spam & Sybil Mitigation)?"
* **Jawaban:**
  > "Melalui mekanisme **Cryptographic Nullifier Hash ($N = H_{Poseidon}(sk, \text{Scope ID})$)**. 
  > Setiap token siswa hanya dapat menghasilkan 1 bukti valid per kategori kasus. Jika siswa mencoba mengirim laporan kedua pada kategori yang sama sebelum jeda waktu selesai, server langsung menolak payload karena nilai nullifier tersebut sudah tercatat di database, tanpa server tahu siapa pemilik tokennya."

---

### Q5: "Bagaimana jika database server RUANG AMAN diretas atau disita pihak ketiga?"
* **Jawaban:**
  > "Prinsip **Zero-PII Storage (Privacy by Design)**: Database server hanya menyimpan *Merkle Root*, *Nullifier Hash*, dan *ciphertext* laporan yang terenkripsi AES-GCM-256. Tidak ada tabel nama siswa, nomor NISN, IP address, ataupun email pelapor. Bahkan pengembang dan peretas tidak dapat merekonstruksi identitas pelapor dari data server."

---

## ⚡ KATEGORI 3: PERFORMA TEKNIS & BROWSER WEB (TECH STACK & WEB VITALS)

### Q6: "Komputasi ZKP terkenal sangat berat. Apakah browser ponsel murah (low-end) sanggup menjalankannya?"
* **Jawaban:**
  > "Sangat sanggup. Kami mengoptimasi komputasi ZKP dengan:
  > 1. Menggunakan fungsi hash **Poseidon** yang ramah sirkuit aritmatika (SNARK-friendly).
  > 2. Menjalankan *proving kernel* di dalam **Web Worker (multithreading)** berformat WebAssembly (WASM), sehingga UI browser tidak pernah mengalami *freeze*.
  > 3. Hasil uji coba hardware rendah (HP chipset Unisoc/Helio RAM 2 GB): pembuatan bukti ZKP selesai dalam **2,41 detik** (jauh di bawah batas toleransi interaksi web 5 detik) dengan **Lighthouse Performance Score 98/100**."

---

### Q7: "Mengapa memilih arsitektur PWA (Progressive Web App) daripada aplikasi native Android/iOS?"
* **Jawaban:**
  > "1. **Zero Footprint:** Aplikasi native meninggalkan ikon di homescreen yang bisa dilihat pelaku saat merazia HP korban. PWA bisa diakses via browser mode incognito dan ditutup seketika.
  > 2. **Inklusivitas & Akses Cepat:** Siswa tidak perlu mengunduh 50 MB APK di PlayStore atau mendaftar akun. Cukup buka tautan web dan langsung lapor.
  > 3. **Lintas Platform:** Berjalan mulus di Chrome OS, Komputer Lab Windows, Linux, Android, dan iOS."

---

## 🛡️ KATEGORI 4: PRIVASI TEKS & PERLINDUNGAN FISIK (PII & CAMOUFLAGE)

### Q8: "Bagaimana jika siswa secara tidak sengaja menuliskan nama asli atau nomor HP-nya di dalam cerita laporan?"
* **Jawaban:**
  > "Kami membangun **Client-Side PII Stripper** berbasis Regular Expression leksikal di dalam browser. Sebelum laporan dienkripsi dan dikirim, sistem memindai teks secara *real-time*, mendeteksi entitas (Nama, Kelas, No HP, NISN), dan otomatis memberikan tombol 'Sensor Data Pribadi' (*auto-redaction*) untuk mencegah kebocoran identitas yang tidak disengaja."

---

### Q9: "Bagaimana perlindungan siswa saat melapor di laboratorium komputer sekolah jika ada teman yang tiba-tiba melintas?"
* **Jawaban:**
  > "Kami menyediakan dua mekanisme proteksi ruang publik:
  > 1. **Camouflage Overlay (Hotkey ESC ganda):** Dalam waktu **< 0,1 detik**, layar seketika berganti menjadi tampilan materi rumus Fisika/Matematika interaktif.
  > 2. **Kiosk Session Watchdog (180 detik):** Jika komputer ditinggalkan siswa, sesi akan otomatis *time-out* dan membersihkan seluruh `sessionStorage` serta riwayat peramban secara permanen (*Zero-Trace*)."

---

## 💬 KATEGORI 5: TINDAK LANJUT KASUS & HAK KORBAN (TWO-WAY CHAT & RESOLUTION)

### Q10: "Jika pelapor anonim, bagaimana Guru BK meminta bukti tambahan atau memberikan jadwal konseling?"
* **Jawaban:**
  > "Melalui **Saluran Tiket Terenkripsi X25519 & AES-GCM-256**. Siswa memegang *Secret Recovery Key* dan kode tiket unik (misal: `TMG-2025-78A1`). Guru BK dapat membalas laporan dan mengirim tautan ruang konseling aman. Siswa cukup membuka menu 'Pantau Tiket' dengan kuncinya untuk membaca balasan dan melakukan chat 2-arah tanpa login."

---

### Q11: "Bagaimana mencegah Guru BK menutup laporan secara sepihak tanpa menyelesaikan masalah korban?"
* **Jawaban:**
  > "Status kasus tidak bisa langsung berstatus `ditutup` oleh Guru BK. Setelah mengunggah bukti penanganan (*Resolution Evidence* berupa Berita Acara/Surat Mediasi), status berubah menjadi `menunggu_siswa`. Tiket baru resmi selesai jika **siswa pelapor sendiri yang menekan tombol konfirmasi penyelesaian** (*Student Confirmation Gate*). Jika siswa belum puas, kasus dapat dieskalasi ke Dinas Pendidikan."

---

## 🏛️ KATEGORI 6: INTEGRASI DINAS, HUKUM & DAMPAK REGULASI

### Q12: "Bagaimana RUANG AMAN menangani kasus darurat seperti kekerasan seksual atau penganiayaan berat?"
* **Jawaban:**
  > "Sistem dilengkapi **Dashboard Rujukan UPTD PPA (Dinas Pemberdayaan Perempuan dan Perlindungan Anak)**. Untuk laporan berkategori darurat/kritis, Guru BK dapat menekan tombol *Eskalasi Kasus Kritis*. Sistem langsung mendisposisikan data kronologi terenkripsi ke UPTD PPA untuk menerjunkan psikolog klinis, pendampingan hukum gratis, serta evakuasi ke Rumah Aman (*safehouse*)."

---

### Q13: "Apakah sistem ini patuh terhadap regulasi hukum di Indonesia?"
* **Jawaban:**
  > "Sangat patuh pada 2 instrumen hukum nasional:
  > 1. **Permendikbudristek No. 46/2023:** Memenuhi mandat pembentukan kanal pelaporan ramah anak, terintegrasi Satgas PPKSP, dan wajib merahasiakan identitas pelapor.
  > 2. **UU Pelindungan Data Pribadi (UU No. 27/2022):** Menerapkan prinsip *Data Minimization* dan *Storage Limitation* karena server tidak mengumpulkan data pribadi yang tidak relevan."

---

# 🎯 RINGKASAN JAWABAN CEPAT (CHEAT-SHEET PRESENTASI)

| Topik Pertanyaan | Kata Kunci Jawaban Inti |
| :--- | :--- |
| **Kenapa ZKP?** | *"Mathematical privacy, bukan sekadar janji kebijakan (policy-based)."* |
| **Kenapa Web/PWA?** | *"Zero install footprint, tidak meninggalkan ikon di HP korban, Lighthouse 98."* |
| **Cegah Spam?** | *"Cryptographic Nullifier Hash per scope kategori kasus."* |
| **HP Lemah?** | *"Web Worker multithread + WASM Poseidon Hash, selesai dalam 2,4 detik."* |
| **Sumber Biaya?** | *"Kalkulator resmi cloud + survei vendor cetak offset + SBM riset lapangan."* |
| **Biaya per Siswa?** | *"Rp 1.173 / siswa / tahun (sangat terjangkau via Dana BOS Reguler)."* |
