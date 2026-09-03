import React, { useState } from "react";
import {
  BookOpen,
  X,
  ShieldCheck,
  FileText,
  Award,
  Printer,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Lock,
  Users,
  HelpCircle,
  Building,
  KeyRound,
  Database,
  ArrowRight,
} from "lucide-react";
import { SchoolProfile } from "../types";

interface HibahHandoverGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolProfile: SchoolProfile;
  onOpenSchoolSettings?: () => void;
}

export const HibahHandoverGuideModal: React.FC<
  HibahHandoverGuideModalProps
> = ({ isOpen, onClose, schoolProfile, onOpenSchoolSettings }) => {
  const [activeSection, setActiveSection] = useState<
    "sop" | "hibah" | "token" | "backup"
  >("sop");
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySOP = () => {
    const sopDoc = `
STANDAR OPERASIONAL PROSEDUR (SOP) PENANGANAN LAPORAN KEKERASAN
SATGAS PPKSP ${schoolProfile.schoolName.toUpperCase()}
PEDOMAN PERMENDIKBUDRISTEK NO. 46 TAHUN 2023

1. TAHAP 1: PENERIMAAN LAPORAN (< 24 JAM)
- Guru BK / Anggota Satgas wajib memeriksa notifikasi laporan anonim setiap hari kerja.
- Sistem otomatis menyamarkan PII (Nama/NISN/Kelas) untuk menjamin rasa aman pelapor.

2. TAHAP 2: VERIFIKASI TERTUTUP
- Verifikasi keabsahan kode token siswa sekolah.
- Lakukan pengecekan rekaman CCTV atau observasi lingkungan secara senyap tanpa mengumumkan adanya aduan.

3. TAHAP 3: RESPON & PERCAKAPAN 2-ARAH AMAN
- Gunakan fitur chat terenkripsi dua arah untuk menenangkan pelapor dan menawarkan tempat konseling yang nyaman.

4. TAHAP 4: MEDIASI TERPISAH (NON-RETALIATION)
- Dilarang mempertemukan korban dan terduga pelaku secara langsung pada tahap awal guna mencegah reviktimisasi.
- Berikan pendampingan orang tua/wali dengan pendekatan restorative justice.

5. TAHAP 5: ESKALASI KEDINASAN (BILA DIPERLUKAN)
- Jika kasus berkategori Kritis/Trauma Berat, segera klik tombol Eskalasi ke UPTD PPA / Dinas Pendidikan.

6. TAHAP 6: PENETAPAN SANKSI EDUKATIF & PEMBINAAN
- Pelaku diberikan sanksi edukatif terukur sesuai tata tertib sekolah dengan tetap menjamin hak pendidikannya.

7. TAHAP 7: PEMULIHAN & DOKUMENTASI RESMI (BAP)
- Cetak Berita Acara Penanganan (BAP) resmi untuk arsip satgas dan pelaporan semester ke Kemendikbudristek.
    `.trim();

    navigator.clipboard.writeText(sopDoc);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white p-6 flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Panduan Hibah &amp; SOP Operasional Satgas PPKSP
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  Siap Pakai Resmi
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pedoman implementasi nyata di satuan pendidikan{" "}
                {schoolProfile.schoolName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-sky-300" />
              <span>Cetak SOP</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveSection("sop")}
            className={`py-3 px-3 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSection === "sop"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            📋 SOP 7 Langkah Satgas PPKSP
          </button>

          <button
            onClick={() => setActiveSection("hibah")}
            className={`py-3 px-3 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSection === "hibah"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            📜 Berita Acara &amp; Hak Hibah
          </button>

          <button
            onClick={() => setActiveSection("token")}
            className={`py-3 px-3 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSection === "token"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            🔑 Distribusi Token Bebas Jejak
          </button>

          <button
            onClick={() => setActiveSection("backup")}
            className={`py-3 px-3 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSection === "backup"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            💾 Backup Data &amp; Reset Go-Live
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[70vh] text-slate-800 text-xs sm:text-sm space-y-6">
          {/* TAB 1: SOP 7 LANGKAH SATGAS */}
          {activeSection === "sop" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3.5">
                <ShieldCheck className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-blue-950 text-sm">
                    Alur Baku Penanganan Kasus Sesuai Permendikbudristek No. 46
                    Tahun 2023
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Semua laporan yang masuk melalui platform TAMENG harus
                    ditangani dengan prinsip{" "}
                    <strong>Kepentingan Terbaik bagi Anak</strong>,{" "}
                    <strong>Kerahasiaan Mutlak</strong>, dan{" "}
                    <strong>Bebas Intimidasi Balasan</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h5 className="font-extrabold text-slate-900">
                      Triage &amp; Respons Kilat (&lt; 24 Jam)
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Petugas BK wajib memeriksa laporan masuk. Jika berstatus{" "}
                    <strong>Kritis</strong>, segera hubungi wali kelas dan
                    lakukan pengecekan keselamatan fisik korban secara tertutup.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h5 className="font-extrabold text-slate-900">
                      Investigasi &amp; Observasi Senyap
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Periksa titik lokasi kejadian (misal: kantin belakang,
                    lorong lab) dan rekaman CCTV tanpa menyiarkan adanya
                    pengaduan agar pelaku tidak menghilangkan barang bukti.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h5 className="font-extrabold text-slate-900">
                      Kanal Chat Aman Dua Arah
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Gunakan fitur chat terenkripsi di dashboard untuk memberi
                    pesan penguatan kepada pelapor anonim. Tawarkan waktu dan
                    lokasi pertemuan rahasia jika siswa bersedia.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      4
                    </span>
                    <h5 className="font-extrabold text-slate-900">
                      Mediasi Terpisah Ramah Anak
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hindari konfrontasi langsung antar siswa. Panggil orang
                    tua/wali secara terpisah untuk menyusun kesepakatan tertulis
                    perdamaian dan perlindungan berkelanjutan.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      5
                    </span>
                    <h5 className="font-extrabold text-slate-900">
                      Eskalasi ke UPTD PPA &amp; Disdik
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bila kasus memerlukan bantuan psikolog klinis, visum medis,
                    atau pendampingan hukum, gunakan tombol{" "}
                    <strong>Eskalasi</strong> untuk merujuk langsung ke UPTD PPA
                    daerah.
                  </p>
                </div>

                {/* Step 6 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      6
                    </span>
                    <h5 className="font-extrabold text-slate-900">
                      Pemberian Sanksi Edukatif
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sanksi terhadap terduga pelaku harus bersifat membina dan
                    mendidik (pembinaan konseling rutin, kerja sosial sekolah)
                    tanpa mencabut hak pendidikannya.
                  </p>
                </div>

                {/* Step 7 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 md:col-span-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      7
                    </span>
                    <h5 className="font-extrabold text-slate-900">
                      Penerbitan BAP Resmi &amp; Pelaporan Semester
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cetak <strong>Berita Acara Penanganan Kasus (BAP)</strong>{" "}
                    berstempel digital dari dashboard untuk ditandatangani oleh
                    Guru BK, Ketua Satgas, dan Kepala Sekolah sebagai laporan
                    akuntabilitas resmi.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopySOP}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedText ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>
                    {copiedText ? "SOP Tersalin" : "Salin Teks Lengkap SOP"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BERITA ACARA HIBAH & HAK PAKAI */}
          {activeSection === "hibah" && (
            <div className="space-y-5 animate-fadeIn font-sans">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-blue-700" />
                  <div>
                    <h4 className="font-black text-slate-900 text-base">
                      Naskah Serah Terima Hibah Perangkat Lunak (TAMENG)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Platform Pelaporan Anonim &amp; Ruang Konseling Ramah Anak
                    </p>
                  </div>
                </div>

                <div className="text-xs leading-relaxed text-slate-700 space-y-3 pt-2 text-justify">
                  <p>
                    Dengan ini dinyatakan bahwa platform{" "}
                    <strong>
                      TAMENG (Tata Aman &amp; Mediasi Edukasi Nir-Gelisah)
                    </strong>{" "}
                    dihibahkan secara penuh tanpa biaya royalti untuk
                    kepentingan operasional Satgas PPKSP di satuan pendidikan:
                  </p>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 font-medium space-y-1">
                    <p>
                      <strong>Nama Sekolah:</strong> {schoolProfile.schoolName}
                    </p>
                    <p>
                      <strong>NPSN:</strong> {schoolProfile.npsn}
                    </p>
                    <p>
                      <strong>Alamat:</strong> {schoolProfile.address}
                    </p>
                    <p>
                      <strong>Penerima Manfaat:</strong> Seluruh Siswa, Guru BK,
                      Satgas PPKSP, dan Tenaga Pendidik
                    </p>
                  </div>

                  <p>
                    <strong>Ketentuan Hibah:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Platform ini gratis digunakan selamanya untuk melindungi
                      siswa dari tindak perundungan, kekerasan fisik, pemerasan,
                      dan pelecehan seksual.
                    </li>
                    <li>
                      Pihak sekolah berhak penuh mengelola akun administrator,
                      mengganti nama sekolah, menyesuaikan kop surat, dan
                      menerbitkan kode akses siswa.
                    </li>
                    <li>
                      Seluruh data aduan tersimpan secara aman dalam kendali
                      satuan pendidikan dan terlindungi oleh prinsip
                      Zero-Knowledge Proof.
                    </li>
                  </ul>
                </div>

                {onOpenSchoolSettings && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSchoolSettings();
                      }}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Building className="w-4 h-4" />
                      <span>
                        Sesuaikan Profil &amp; Kop Surat Sekolah Ini Sekarang →
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PANDUAN DISTRIBUSI TOKEN BEBAS JEJAK */}
          {activeSection === "token" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <KeyRound className="w-6 h-6 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-amber-950 text-sm">
                    Cara Membagikan Kode Akses Siswa Tanpa Mengorbankan
                    Anonimitas
                  </h4>
                  <p className="text-xs text-slate-700 mt-1">
                    Tujuan kode token adalah{" "}
                    <strong>mencegah penyusup luar sekolah</strong> mengirim
                    laporan palsu, sekaligus{" "}
                    <strong>mencegah guru mengetahui nama pelapor</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <h5 className="font-bold text-slate-900 text-sm">
                    1. Gunakan Fitur Cetak Lembar Slip Potong
                  </h5>
                  <p>
                    Admin Sekolah membuka menu{" "}
                    <em>Manajemen Token &gt; Cetak Slip Kode Siswa</em>. Cetak
                    slip pada kertas A4 lalu potong menjadi kartu kecil
                    berukuran kartu saku.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <h5 className="font-bold text-slate-900 text-sm">
                    2. Bagikan Secara Acak (Blind Distribution)
                  </h5>
                  <p>
                    Wali Kelas atau Pengurus OSIS membagikan slip dalam kotak
                    tertutup di mana setiap siswa mengambil 1 slip secara acak{" "}
                    <strong>tanpa dicatat siapa mendapat nomor berapa</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <h5 className="font-bold text-slate-900 text-sm">
                    3. Masa Berlaku &amp; Regenerasi Semester
                  </h5>
                  <p>
                    Admin dapat men-generate batch baru setiap tahun ajaran baru
                    (MPLS) untuk angkatan kelas X, XI, dan XII.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & GO-LIVE SLATE */}
          {activeSection === "backup" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <Database className="w-6 h-6 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-sm">
                    Prosedur Cadangan Data &amp; Reset Menuju Operasional Bersih
                    (Go-Live)
                  </h4>
                  <p className="text-xs text-slate-700 mt-1">
                    Sebelum menyerahkan website ini kepada siswa sekolah, Anda
                    disarankan mengunduh cadangan dan mengosongkan data uji coba
                    simulasi.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <h5 className="font-bold text-slate-900 text-sm">
                    1. Cadangan Mingguan (Disaster Recovery)
                  </h5>
                  <p>
                    Admin IT Sekolah mengunduh file cadangan JSON dari menu{" "}
                    <em>Admin Sistem &gt; Cadangan &amp; Pemulihan</em> setiap
                    hari Jumat. File ini dapat dipulihkan kapan saja ke server
                    baru tanpa kehilangan data laporan atau histori chat.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <h5 className="font-bold text-slate-900 text-sm">
                    2. Tombol Reset Bersih Siap Pakai
                  </h5>
                  <p>
                    Tersedia tombol satu-klik untuk menghapus semua tiket
                    pengujian, membuat akun admin &amp; BK resmi sekolah, serta
                    men-generate slip kode token asli siap cetak.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Dokumen Implementasi Hibah TAMENG • Permendikbudristek 46/2023
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
