import React from "react";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  ServerOff,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Cpu,
  BookOpen,
  Users,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { ZKPVectorArt } from "./AnimatedIllustrations";

interface TransparencyPageProps {
  onNavigateToReport: () => void;
  onNavigateToHelp: () => void;
}

export const TransparencyPage: React.FC<TransparencyPageProps> = ({
  onNavigateToReport,
  onNavigateToHelp,
}) => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Keterbukaan &amp; Standar Keamanan Kriptografi</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Transparansi &amp; Jaminan Privasi Mutlak
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Kami percaya rasa aman berawal dari transparansi. Pahami bagaimana
          Ruang Aman melindungi identitas Anda dan batasan teknis sistem.
        </p>
      </div>

      {/* Visual Architectural Banner */}
      <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-950/20 border border-blue-400/30 overflow-hidden">
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-bold border border-white/20 backdrop-blur-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Protokol Kriptografi Terbuka Semaphore</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Server Tidak Pernah Mampu Mengetahui Identitas Anda
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Bukan sekadar janji tidak mencatat, namun sistem dibatasi secara
            matematis. Bukti keanggotaan (Zero-Knowledge Proof) dihitung
            sepenuhnya di browser perangkat Anda sebelum data dikirim.
          </p>
        </div>

        <div className="w-full sm:w-72 h-44 rounded-2xl overflow-hidden border border-white/20 shrink-0 shadow-lg bg-blue-950/40">
          <ZKPVectorArt className="w-full h-full object-cover" />
        </div>
      </div>

      {/* 3 Main Cryptographic Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-3 shadow-md shadow-slate-200/50">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            1. Anonimitas Kriptografis
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Menggunakan arsitektur <strong>Zero-Knowledge Proof (ZKP)</strong>.
            Server memverifikasi bahwa pelapor adalah siswa sah tanpa perlu tahu
            siapa nama siswa tersebut.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-3 shadow-md shadow-slate-200/50">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
            <ServerOff className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            2. Tanpa Jejak Digital (Zero Log)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Server kami <strong>tidak mencatat alamat IP</strong>, tidak
            menyimpan User-Agent perangkat, dan tidak melacak jejak GPS foto
            (EXIF stripping otomatis).
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-3 shadow-md shadow-slate-200/50">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            3. Anti-Spam Kriptografis
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Perangkat menjalankan kalkulasi <em>Proof-of-Work</em> ringan di
            browser sebelum mengirim, mencegah serangan bot flood tanpa
            membatasi hak lapor siswa.
          </p>
        </div>
      </div>

      {/* System Limitations / Keterbatasan Sistem (Crucial Requirement) */}
      <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-600 text-white shrink-0 shadow-md shadow-amber-600/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-amber-950">
              Keterbatasan Sistem yang Wajib Diketahui
            </h2>
            <p className="text-xs text-amber-900">
              Ruang Aman adalah instrumen pengaduan dan konseling, bukan
              pengganti penanganan kepolisian instan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs leading-relaxed text-slate-700">
          <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-1">
            <strong className="text-amber-950 font-bold block">
              Bukan Layanan Darurat Kecepatan Detik:
            </strong>
            <p>
              Jika Anda sedang dalam bahaya fisik maut, pendarahan, atau ancaman
              senjata detik ini juga, segera hubungi <strong>SAPA 129</strong>{" "}
              atau <strong>Polisi 110</strong>, atau cari perlindungan fisik
              langsung ke ruang guru terdekat.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-1">
            <strong className="text-amber-950 font-bold block">
              Isi Cerita Bisa Membocorkan Identitas:
            </strong>
            <p>
              Meskipun sistem kami memiliki sensor otomatis PII, jika Anda
              secara sengaja menuliskan nomor absen atau peristiwa yang hanya
              dialami oleh Anda seorang diri di satu kelas tertentu, pembaca
              laporan mungkin dapat menebak identitas Anda secara kontekstual.
            </p>
          </div>
        </div>
      </div>

      {/* Specific SOP Guides for Students and Guru BK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* For Students */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-4 shadow-md shadow-slate-200/50">
          <div className="flex items-center gap-2 text-blue-800">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Panduan Khusus Siswa
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Gunakan kata-kata yang jelas mengenai lokasi dan bentuk
                perundungan.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Gunakan fitur <strong>Sensor Otomatis</strong> untuk menyamarkan
                nama teman atau kelas.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Simpan Nomor Tiket di tempat yang aman dan jangan bagikan ke
                teman lain.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Manfaatkan tombol <strong>Keluar Cepat (ESC)</strong> jika ada
                orang mendekat.
              </span>
            </li>
          </ul>
        </div>

        {/* For Counselor / Guru BK */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-4 shadow-md shadow-slate-200/50">
          <div className="flex items-center gap-2 text-blue-800">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              SOP Satgas PPKSP &amp; Guru BK
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Dilarang mencari tahu identitas pelapor atau menanyakan nama
                saat berbalas pesan.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Lakukan intervensi berdasarkan patroli rutin atau mediasi umum,
                bukan pemanggilan sepihak.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Berikan respons pada kanal chat dalam kurun waktu maksimal 1x24
                jam kerja.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Jaga kerahasiaan catatan internal BK di bawah sumpah profesi
                konseling.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Action CTA */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-blue-800">
        <div>
          <h3 className="text-lg font-bold">Siap Menggunakan Ruang Aman?</h3>
          <p className="text-xs text-blue-200">
            Laporkan kejadian sekarang dengan jaminan privasi penuh tanpa
            syarat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToReport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors shadow-md shadow-blue-900/30 cursor-pointer"
          >
            <span>Lapor Anonim Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
