# 🎙️ NASKAH RESMI DEMONSTRASI & PITCHING PLATFORM RUANG AMAN
**Platform Pelaporan & Penanganan Kekerasan di Satuan Pendidikan Berbasis Kriptografi Zero-Knowledge Proof (ZKP)**

---

## 📌 Metadata & Informasi Presentasi

- **Aplikasi Live (Produksi)**: [https://ruang.rapsdev.web.id](https://ruang.rapsdev.web.id)
- **Repositori Sumber**: [https://github.com/ArrafiNurHafiz/ruang](https://github.com/ArrafiNurHafiz/ruang)
- **Target Durasi**: **3 Menit (180 Detik)** [Opsi ekspansi hingga 5 Menit]
- **Kesesuaian Regulasi**: **Permendikbudristek No. 46 Tahun 2023** (Pencegahan & Penanganan Kekerasan di Lingkungan Satuan Pendidikan / PPKSP) dan **UU No. 12 Tahun 2022** (Tindak Pidana Kekerasan Seksual / TPKS).
- **Skor Validasi Usabilitas**: **SUS 86,4 / Grade A+ (Exceptional)**

---

## 🔑 Kredensial Akun & Operator Cheat Sheet

Gunakan akun berikut saat demonstrasi langsung di hadapan dewan juri atau saat perekaman video:

| Peran | Kredensial Masuk | Kata Sandi | Aksi Kunci yang Ditampilkan |
| :--- | :--- | :--- | :--- |
| **Guru BK / Satgas (Hulu)** | `guru.bk@sekolah.sch.id` | `password123` *(atau `11223344`)* | **LANGKAH 1**: Men-generate batch token sekolah (misal: rombel Kelas X), salin token `SCH-X1-8831` atau cetak slip token acak. |
| **Siswa (Pelapor)** | *Tanpa registrasi akun*<br>Token: `SCH-X1-8831`<br>Sandi: `siswa2026`<br>PIN: `7890` | *(Kunci Kriptografi Lokal)* | **LANGKAH 2**: Input token hasil generate sekolah, pasang sandi pribadi, sensor AI PII, komputasi ZKP, dan Camouflage Escape (`ESC 2x`). |
| **Guru BK / Satgas (Hilir)** | `guru.bk@sekolah.sch.id` | `password123` *(atau `11223344`)* | **LANGKAH 3**: Triase keparahan kasus baru, chat terenkripsi dua arah, bukti penanganan, dan unduh draft **BAP Digital** resmi. |
| **Dinas Pendidikan (Provinsi)** | `h.hendro@disdik.prov.go.id` | `password123` | Monitoring heatmap kerawanan wilayah, kecepatan respon sekolah (SLA 4,2 jam), dan penerbitan Nota Supervisi. |
| **UPTD PPA (Dinas PPPA)** | `sri.rahayu@uptd-ppa.go.id` | `password123` | Intervensi kasus kritis, disposisi psikolog klinis, pendampingan hukum, dan rujukan rumah aman (*safehouse*). |
| **Admin Sistem (IT)** | `admin@ruang.com` | `admin123` | Log audit kriptografi tak terhapus (*immutable audit trail*), manajemen akun pengguna, dan cadangan data. |

> **Trik Cepat Operator (Console Shortcut)**:
> Presenter dapat membuka Developer Console (`F12`) lalu mengetikkan perintah berikut untuk berganti peran seketika tanpa perlu logout-login manual:
> - `window.__switchRole('guru')`
> - `window.__switchRole('siswa')`
> - `window.__switchRole('dinas-pendidikan')`
> - `window.__switchRole('dinas-perlindungan')`
> - `window.__toggleDisguise(true)` *(Aktifkan mode samaran)* / `window.__toggleDisguise(false)`

---

## ⏱️ Struktur Alur Demonstrasi 3 Menit (180 Detik)

```
00:00 ─── [BAB 1] Problem Statement & Fenomena Gunung Es (25s)
00:25 ─── [BAB 2] Terobosan ZKP & Pintu Masuk: Guru BK Generate Batch Token (35s)
01:00 ─── [BAB 3] Live Demo: Siswa Melapor dengan Token, Sensor AI PII, & Komputasi ZKP (45s)
01:45 ─── [BAB 4] Live Demo: Tiket Asimetris & Kiosk Camouflage ESC 2x (25s)
02:10 ─── [BAB 5] Live Demo: Kolaborasi Terpadu (BK BAP Digital, Disdik, UPTD PPA) (35s)
02:45 ─── [BAB 6] Validasi Empiris SUS (86,4/A+) & Call to Action (15s)
03:00 ─── Selesai
```

---

## 🎬 Naskah Kata-per-Kata (Verbatim Speech Script) & Visual Cue

### BAB 1: Problem Statement & Fenomena Gunung Es (00:00 - 00:25)

- **Visual Cue Layar**:
  1. Tampilkan halaman muka [ruang.rapsdev.web.id](https://ruang.rapsdev.web.id).
  2. Arahkan kursor dan scroll perlahan menyoroti kartu statistik darurat kekerasan (573 kasus lonjakan KPAI, 11.291 aduan nasional, dan 85% korban memilih diam).
  3. Sorot perbandingan *"Janji Kebijakan vs Jaminan Matematis"*.

- **Skrip Narasi Lisan**:
  > *"Assalamualaikum warahmatullahi wabarakatuh, selamat pagi dewan juri yang terhormat dan rekan-rekan sekalian.*
  >
  > *Sepanjang tahun 2024, KPAI dan JPPI mencatat lebih dari 11 ribu aduan kekerasan anak dengan lonjakan tajam kasus di lingkungan pendidikan. Namun angka ini hanyalah puncak dari fenomena gunung es.*
  >
  > *Faktanya, lebih dari 85% korban dan saksi perundungan memilih bungkam. Mengapa? Bukan karena mereka tidak ingin melapor, melainkan karena dibayangi ketakutan akan intimidasi balasan dan keraguan atas kerahasiaan identitas mereka.*
  >
  > *Selama ini, kanal aduan konvensional hanya menjanjikan privasi berbasis etika pengelola. Padahal di belakang layar, alamat IP, akun email, nomor WhatsApp, dan jejak digital siswa tetap terekam di server.*
  >
  > *Inilah alasan kami membangun **RUANG AMAN**—ekosistem pencegahan dan penanganan kekerasan sekolah pertama di Indonesia yang mengonversi 'janji etika' menjadi **'jaminan matematis'** menggunakan **Zero-Knowledge Proof**."*

---

### BAB 2: Inovasi ZKP & Persiapan Sekolah: Generate Token Anonim (00:25 - 01:00)

- **Visual Cue Layar**:
  1. Beralih ke konsol **Guru BK / Satgas PPKSP** (`guru.bk@sekolah.sch.id`).
  2. Buka tab **Kelola Token Anonim**.
  3. Masukkan jumlah token: `25`, pilih rombel: `Kelas X`, dan custom prefix: `SCH-X1-`.
  4. Klik tombol **Generate Token** (Tunjukkan notifikasi sukses *"Berhasil membuat 25 token untuk Kelas X"* dan token baru muncul di tabel).
  5. Klik tombol **Salin** pada salah satu token (misal: `SCH-X1-8831`) atau klik **Cetak Slip Token Siswa** untuk memperlihatkan lembar kartu token fisik acak.

- **Skrip Narasi Lisan**:
  > *"Lalu bagaimana sistem memastikan hanya siswa sah yang melapor tanpa mengorbankan privasi mereka?*
  >
  > *Alur dimulai dari Satgas PPKSP sekolah. Di dashboard Guru BK, sekolah menerbitkan kumpulan token akses anonim secara batch per tingkatan kelas.*
  >
  > *Token-token ini dicetak dalam bentuk slip fisik acak atau dibagikan secara blind distribution ke seluruh siswa di kelas tanpa mencatat siapa mendapatkan kode apa. Sekolah pun tidak pernah tahu siswa mana yang memegang token nomor berapa!*
  >
  > *Dengan protokol Semaphore dan Poseidon Hash, token ini menjadi tiket keanggotaan Merkle Tree sekolah. Siswa dapat membuktikan hak lapornya secara sah tanpa sekolah mengetahui identitas pribadinya—menerapkan prinsip **Zero Identity Storage** mutlak."*

---

### BAB 3: Demo Siswa — Pelaporan Anonim & AI PII Stripper (01:00 - 01:45)

- **Visual Cue Layar**:
  1. Beralih ke antarmuka siswa (klik **Lapor Anonim** di Navbar).
  2. Masukkan Token Sekolah yang baru saja digenerate: `SCH-X1-8831` lalu klik **Verifikasi**.
  3. Masukkan Sandi Pelajar: `siswa2026` lalu klik **Simpan Sandi & Buka Formulir**.
  4. Pilih kategori **Perundungan / Bullying**.
  5. Ketik kronologi yang mengandung data sensitif:
     `"Saya Budi Santoso dari kelas X-1 dipalak di kantin belakang. Hubungi saya di 081234567890."`
  6. Klik tombol **Samarkan PII Otomatis** (Tunjukkan teks sensitif berubah menjadi tag sensor terlindungi secara instan).
  7. Masukkan PIN Pemulihan 4-digit: `7890`. Centang persetujuan, lalu klik **Kirim Laporan Terenkripsi**.
  8. Tunjukkan progress komputasi ZKP via Web Worker (selesai dalam 2,4 detik) dan penerbitan Nomor Tiket baru (misal: `TMG-2026-XXXX`).

- **Skrip Narasi Lisan**:
  > *"Sekarang, mari kita posisikan diri sebagai siswa bernama Rani yang memegang slip token tersebut.*
  >
  > *Rani membuka web Ruang Aman di ponselnya, memasukkan token SCH-X1-8831, dan membuat sandi rahasia pribadi yang hanya diketahui dirinya sendiri. Tanpa registrasi email, tanpa nomor handphone.*
  >
  > *Ketika menuliskan kronologi peristiwa, seringkali siswa tanpa sadar menyebutkan nama lengkap, kelas, atau nomor kontak. RUANG AMAN dilengkapi fitur cerdas **Client-Side PII Stripper**. Hanya dengan satu klik, mesin kami secara instan mendeteksi dan menyamarkan data pribadi tersebut langsung di browser sebelum data apapun keluar dari perangkat!*
  >
  > *Rani kemudian memasukkan 4-digit PIN rahasia untuk akses darurat. Saat tombol kirim ditekan, Web Worker di latar belakang menghitung bukti kriptografi Zero-Knowledge Proof dalam waktu kurang dari 3 detik! Laporan terenkripsi dikirim dan diterbitkanlah Nomor Tiket unik beserta Kunci Pemulihan rahasia."*

---

### BAB 4: Tiket Asimetris & Kiosk Camouflage Escape (01:45 - 02:10)

- **Visual Cue Layar**:
  1. Klik menu **Pantau Tiket**.
  2. Masukkan nomor tiket `TMG-2025-78A1` (atau tiket yang baru dibuat) dan klik **Periksa Status**.
  3. Scroll ke bagian histori penanganan dan jendela chat dua arah.
  4. **AKSI DRAMATIS**: Tekan tombol `ESC` 2 kali secara berturut-turut.
  5. Tampilan web seketika bermutasi menjadi halaman modul latihan soal Matematika/Fisika lengkap dengan timer dan rumus.
  6. Klik tombol pojok atau tekan `ESC` untuk kembali ke aplikasi.

- **Skrip Narasi Lisan**:
  > *"Dengan Nomor Tiket dan sandi rahasia, siswa dapat memantau perkembangan kasus dan melakukan dialog chat dua arah dengan Guru BK secara aman melalui enkripsi asimetris.*
  >
  > *Namun perlindungan digital saja tidak cukup jika keamanan fisik terancam. Bayangkan jika siswa sedang melapor di komputer laboratorium sekolah atau warnet, lalu pelaku perundungan atau orang asing tiba-tiba menghampiri?*
  >
  > *Kami menghadirkan fitur revolusioner: **Camouflage Escape**. Siswa cukup menekan tombol ESC dua kali, dan dalam waktu 0,1 detik—tanpa reload halaman—layar seketika berubah menjadi modul latihan soal Matematika dan Fisika akademik! Privasi fisik terlindungi secara instan dari bahaya shoulder surfing."*

---

### BAB 5: Dashboard Multi-Peran & Kolaborasi Lintas Lembaga (02:10 - 02:45)

- **Visual Cue Layar**:
  1. Beralih kembali ke peran **Guru BK** (`guru.bk@sekolah.sch.id`).
  2. Tunjukkan tabel triase kasus dengan indikator urgensi (Rendah, Sedang, Tinggi, Darurat).
  3. Buka tiket laporan, tunjukkan ringkasan tindakan dan klik tombol **Cetak BAP Digital** (Tampilkan pratinjau format BAP resmi Permendikbudristek 46/2023).
  4. Beralih ke portal **Dinas Pendidikan** (`h.hendro@disdik.prov.go.id`). Tunjukkan visualisasi heatmap wilayah, rata-rata respon sekolah (SLA 4,2 jam), dan tombol kirim Nota Supervisi.
  5. Beralih ke portal **UPTD PPA** (`sri.rahayu@uptd-ppa.go.id`). Tunjukkan tab intervensi rujukan psikolog klinis, bantuan hukum, dan safehouse.

- **Skrip Narasi Lisan**:
  > *"RUANG AMAN bukan sekadar kotak pengaduan, melainkan ekosistem penanganan terpadu.*
  >
  > *Di sisi satuan pendidikan, Guru BK dan Satgas PPKSP menerima laporan terklasifikasi berdasarkan tingkat urgensi. Guru BK dapat membalas pesan siswa, mencatat investigasi tertutup, dan mengunduh draft **Berita Acara Pemeriksaan (BAP) Digital** yang 100% selaras dengan regulasi Permendikbudristek 46/2023.*
  >
  > *Beralih ke tingkat wilayah, Dinas Pendidikan memantau indeks kerawanan sekolah dan kecepatan respon Satgas tanpa melanggar privasi kasus individual. Dinas dapat langsung mengirimkan nota supervisi resmi jika ada sekolah yang lambat merespon.*
  >
  > *Dan untuk kasus kekerasan berat atau kekerasan seksual anak, sistem terintegrasi langsung dengan portal UPTD PPA untuk disposisi psikolog klinis, pendampingan hukum, hingga penyediaan rumah aman."*

---

### BAB 6: Validasi Empiris & Penutup (02:45 - 03:00)

- **Visual Cue Layar**:
  1. Kembali ke halaman utama atau tampilkan badge capaian pengujian.
  2. Sorot skor **System Usability Scale (SUS) 86,4 / Grade A+**.
  3. Sorot ketersediaan kode sumber terbuka di GitHub dan status live deployment di Vercel.

- **Skrip Narasi Lisan**:
  > *"Platform RUANG AMAN telah diuji coba secara empiris melibatkan siswa, guru bimbingan konseling, dan satgas dengan perolehan skor **System Usability Scale sebesar 86,4 atau predikat Grade A+ (Exceptional)**.*
  >
  > *Aplikasi ini telah berstatus production-ready, dideploy secara global di ruang.rapsdev.web.id, dan seluruh kodenya bersifat open source.*
  >
  > *Mari bersama kita hapus rasa takut, tegakkan keadilan, dan wujudkan sekolah yang aman, nyaman, dan inklusif bagi seluruh anak Indonesia. Suaramu berarti, kami siap melindungi.*
  >
  > *Wassalamualaikum warahmatullahi wabarakatuh. Terima kasih."*

---

## 🛡️ Panduan Menjawab Pertanyaan Dewan Juri (Q&A Defense Guide)

Jika dewan juri mengajukan pertanyaan kritis setelah demonstrasi, gunakan panduan jawaban berikut:

### Q1: "Bagaimana cara siswa mendapatkan token dan bagaimana mencegah guru tahu pemilik token tersebut?"
> **Jawaban Presenter**:
> *"Satgas sekolah menerbitkan token secara batch per angkatan/kelas dan mencetaknya dalam bentuk slip kartu fisik acak. Slip dibagikan di kelas secara **blind distribution** (seperti membagikan kertas ulangan tertutup secara acak tanpa presensi nama). Guru tidak mencatat token X diberikan ke siswa Y. Bahkan jika guru mencoba melacak, token tersebut baru diaktifkan saat siswa memasukkan kata sandi pribadi yang hanya ada di kepala siswa. Sehingga keterkaitan identitas terputus sejak detik pertama."*

### Q2: "Jika pelapor 100% anonim, bagaimana cara sistem mencegah laporan palsu/hoaks atau spam?"
> **Jawaban Presenter**:
> *"Kami menerapkan sistem pertahanan berlapis (**Two-Layer Anti-Sybil Defense**):*
> 1. *Secara teknis, siswa wajib memiliki bukti keanggotaan dalam **Merkle Tree Sekolah** melalui token akses berkala. Pihak luar sekolah tidak dapat melakukan injeksi laporan ke sistem sekolah tersebut.*
> 2. *Kedua, arsitektur ZKP Semaphore kami menggunakan **Nullifier Hash**. Sistem membatasi frekuensi pelaporan berulang dari entitas bukti yang sama dalam jeda waktu tertentu untuk mencegah spamming/DDoS tanpa perlu mengidentifikasi pelapor.*
> 3. *Setiap laporan yang masuk tetap melalui tahapan klarifikasi dan triase awal oleh Satgas PPKSP sekolah sebelum tindakan formal diambil, sesuai amanat Pasal 40 Permendikbudristek 46/2023."*

### Q3: "Mengapa harus menggunakan ZKP? Apakah tidak cukup dengan fitur 'Lapor Tanpa Nama' biasa?"
> **Jawaban Presenter**:
> *"Fitur 'lapor tanpa nama' konvensional hanya bersifat **pseudo-anonymous** (anonim semu). Secara teknis, server web dan penyedia hosting tetap mencatat alamat IP pengirim, User-Agent browser, timestamp request, dan alamat email jika terhubung dengan akun.*
> *Jika terjadi insiden kebocoran data (*data breach*) atau penyitaan server oleh pihak tidak berwenang, identitas siswa rentan terbongkar.*
> *Dengan **Zero-Knowledge Proof**, server kami bahkan tidak memiliki data apapun mengenai identitas pelapor. Privasi dijamin secara matematis, bukan sekadar janji kebijakan."*

### Q4: "Bagaimana jika siswa kehilangan Nomor Tiket dan Sandi Rahasianya?"
> **Jawaban Presenter**:
> *"RUANG AMAN menyediakan mekanisme **Dual Verification Key Recovery**. Selain kode tiket standar, siswa dapat memulihkan akses menggunakan PIN 4-digit darurat yang dipadukan dengan kata sandi pribadinya saat token diverifikasi. Jika kedua kunci tersebut hilang total, demi alasan keamanan kriptografi zero-knowledge, data tidak dapat dibuka kembali oleh siapapun untuk mencegah pembajakan tiket oleh pihak ketiga."*

### Q5: "Apakah komputasi ZKP di browser memberatkan ponsel atau laptop siswa yang berspesifikasi rendah?"
> **Jawaban Presenter**:
> *"Tidak memberatkan. Kami menggunakan algoritma hash **Poseidon** yang dirancang khusus untuk efisiensi sirkuit aritmatika ZKP, dikombinasikan dengan eksekusi di latar belakang via **HTML5 Web Worker**. Berdasarkan pengujian performa kami di berbagai perangkat low-end (termasuk smartphone dengan RAM 3GB), proses pembuatan proof tuntas dalam waktu **rata-rata 2,4 detik** dengan konsumsi memori di bawah 45MB."*

### Q6: "Bagaimana integrasi sistem ini dengan instansi resmi seperti UPTD PPA atau kepolisian?"
> **Jawaban Presenter**:
> *"Sesuai amanat **UU No. 12 Tahun 2022 (UU TPKS)** dan **Permendikbudristek 46/2023**, kasus kekerasan anak yang masuk kategori sedang hingga berat wajib dilaporkan ke UPTD PPA. Di RUANG AMAN, Satgas sekolah dapat menekan tombol **'Eskalasi ke UPTD PPA'**. Data kasus beserta Berita Acara terenkripsi otomatis diteruskan ke portal UPTD PPA provinsi/kota untuk segera diterbitkan surat tugas pendampingan psikolog klinis, bantuan hukum gratis, maupun evakuasi ke safehouse."*

---

*Naskah demonstrasi ini siap digunakan untuk keperluan kompetisi, presentasi resmi, dan panduan pembuatan video narasi RUANG AMAN.*
