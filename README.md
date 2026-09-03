# TAMENG - Ruang Aman Pelaporan & Konseling Siswa

TAMENG adalah platform digital untuk pelaporan perundungan (bullying) dan kekerasan di sekolah secara anonim, aman, dan terenkripsi. Aplikasi ini dirancang untuk dihibahkan kepada instansi pendidikan atau satuan pendidikan sebagai alat bantu Satgas PPKSP (Pencegahan dan Penanganan Kekerasan di Satuan Pendidikan).

## Fitur Utama

- **Lapor Anonim (ZKP)**: Siswa dapat melapor tanpa mengungkap identitas menggunakan prinsip Zero-Knowledge Proof.
- **Enkripsi Chat 2-Arah**: Komunikasi rahasia antara pelapor dan Guru BK.
- **Manajemen Token**: Kode akses unik untuk memvalidasi warga sekolah tanpa menyimpan data pribadi.
- **Dashboard Multi-Role**: Akses berbeda untuk Siswa, Guru BK, Admin Sekolah, Dinas Pendidikan, dan Dinas Perlindungan (UPTD PPA).
- **Sanitasi Data Otomatis**: Pembersihan metadata PII (Personally Identifiable Information) pada laporan dan lampiran.

## Teknologi

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js Express (Local API).
- **Database**: Persistent JSON DB (Production-ready SQLite/PostgreSQL recommended for high load).
- **Authentication**: JWT & Role-Based Access Control (RBAC).

## Cara Menjalankan (Development/Production Ready)

### 1. Persiapan
Pastikan Anda memiliki Node.js versi 18 atau lebih tinggi.

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Jalankan Backend Server
Buka terminal baru dan jalankan:
```bash
node server.js
```
Server akan berjalan di `http://localhost:3001`.

### 4. Jalankan Frontend
Buka terminal lain dan jalankan:
```bash
npm run dev
```
Aplikasi dapat diakses di `http://localhost:3000`.

## Akun Demo Default

| Role | Email | Password |
|------|-------|----------|
| Guru BK | `guru.bk@sekolah.sch.id` | `password123` |
| Admin Sekolah | `admin.ppksp@sekolah.sch.id` | `admin123` |

## Struktur Project

- `/src`: Source code React frontend.
- `server.js`: Backend API server menggunakan Express.
- `db.json`: Database lokal persisten.
- `supabase-schema.sql`: Schema untuk migrasi ke Supabase (Production).

---
**Catatan Penting**: Aplikasi ini telah diubah dari prototype statis menjadi aplikasi fungsional penuh dengan backend dan database nyata. Untuk penggunaan skala besar, disarankan menghubungkan aplikasi ke instance Supabase menggunakan schema SQL yang telah disediakan.
