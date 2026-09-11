import React, { useState } from "react";
import {
  ShieldCheck,
  Send,
  Search,
  Lock,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  Clock,
  EyeOff,
  UserCheck,
  KeyRound,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building2,
  Users,
} from "lucide-react";
import { StudentSession, SchoolProfile } from "../types";

interface DesktopLandingHeroProps {
  onNavigateToReport: () => void;
  onNavigateToStatus: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToHelp: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
  onNavigateToLogin: () => void;
  studentSession?: StudentSession | null;
  onOpenTokenGate?: () => void;
  schoolProfile?: SchoolProfile;
  onOpenHibahGuide?: () => void;
}

export const DesktopLandingHero: React.FC<DesktopLandingHeroProps> = ({
  onNavigateToReport,
  onNavigateToStatus,
  onNavigateToHowItWorks,
  onNavigateToHelp,
  onNavigateToAbout,
  onNavigateToContact,
  onNavigateToLogin,
  studentSession,
  onOpenTokenGate,
  schoolProfile,
  onOpenHibahGuide,
}) => {
  const [quickTicketCode, setQuickTicketCode] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTicketCode.trim()) {
      onNavigateToStatus();
    }
  };

  const faqs = [
    {
      q: "Apakah identitas saya benar-benar tidak diketahui siapapun?",
      a: "Ya, 100% aman. Sistem TAMENG tidak mencatat nama, NISN, alamat IP, ataupun perangkat Anda. Data yang diterima Guru BK hanya kronologi kejadian dan bukti yang Anda lampirkan.",
    },
    {
      q: "Bagaimana cara saya membaca tanggapan dari Guru BK?",
      a: "Setelah melapor, Anda akan menerima Nomor Tiket unik. Simpan nomor tersebut. Anda dapat memasukkannya di menu 'Pantau Tiket' kapan saja untuk melihat status dan melakukan chat 2-arah secara rahasia.",
    },
    {
      q: "Apakah saya harus punya kode akses sekolah untuk melapor?",
      a: "Tidak wajib. Siswa tetap dapat membuat laporan kapan saja secara langsung tanpa terhambat kode. Kode sekolah hanya digunakan jika sekolah Anda membagikan token validasi khusus.",
    },
  ];

  return (
    <div className="w-full flex flex-col bg-slate-50 text-slate-800">
      {/* 1. HERO SECTION (Clean, Welcoming & Calming) */}
      <section className="relative overflow-hidden pt-10 pb-14 sm:pt-14 sm:pb-20 border-b border-slate-200/80 bg-gradient-to-b from-sky-50/70 via-white to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-blue-800 text-xs font-semibold mb-6 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>
              Platform Nasional PPKSP • Seluruh Satuan Pendidikan di Indonesia (Permendikbudristek No. 46/2023)
            </span>
          </div>

          {/* Main Reassuring Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
            Suaramu Berarti. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">
              Kami Siap Mendengarkan &amp; Melindungi.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Kanal resmi pencegahan dan penanganan kekerasan untuk seluruh siswa, pendidik, dan warga sekolah di 38 Provinsi Indonesia.
            Identitasmu sepenuhnya terlindungi dengan teknologi privasi tanpa rekam jejak.
          </p>

          {/* National Scope Stats Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>38 Provinsi Terkoneksi</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Seluruh Jenjang: SD, SMP, SMA, SMK &amp; SLB</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>Terintegrasi Satgas PPKSP, Disdik &amp; UPTD PPA</span>
            </span>
          </div>

          {/* TWO PRIMARY ACTION CARDS */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            {/* Action 1: Buat Laporan Baru */}
            <div className="p-6 rounded-2xl bg-white border border-blue-200/90 shadow-md shadow-blue-500/5 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-blue-500/30">
                  <Send className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Buat Laporan Baru
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ceritakan apa yang kamu alami atau saksikan. 100% anonim, tanpa perlu login akun apapun.
                </p>
              </div>

              <button
                id="hero-create-report-btn"
                onClick={onNavigateToReport}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer shadow-xs"
              >
                <span>Buat Laporan Aman</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Action 2: Pantau Laporan & Chat */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Pantau Tiket &amp; Balas Chat
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Sudah pernah melapor? Cek tanggapan Guru BK atau lanjutkan komunikasi rahasia.
                </p>
              </div>

              <form onSubmit={handleQuickTrack} className="mt-6 flex items-center gap-2">
                <input
                  type="text"
                  value={quickTicketCode}
                  onChange={(e) => setQuickTicketCode(e.target.value)}
                  placeholder="Contoh: TMG-2025-XXXX"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={onNavigateToStatus}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Cek
                </button>
              </form>
            </div>
          </div>

          {/* Quick Safety Trust Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Tanpa Rekam Nama / Akun</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Enkripsi Pesan 2-Arah</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Respon Tim BK &lt; 24 Jam</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE PILLARS OF SECURITY (Simple & Informative) */}
      <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Perlindungan Penuh untuk Setiap Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Kami mengutamakan rasa aman Anda agar sekolah menjadi tempat yang ramah dan bebas ketakutan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Identitas Rahasia Mutlak
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Nama, nomor HP, dan informasi pribadi disaring otomatis. Tidak ada catatan digital yang bisa melacak perangkat Anda.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Konseling Rahasia 2-Arah
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Dapat berdiskusi langsung dengan Guru BK melalui ruang chat terenkripsi tanpa perlu tatap muka jika Anda belum siap.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Pendampingan Satgas PPKSP
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Laporan ditangani secara profesional sesuai Permendikbudristek No. 46/2023 dengan bantuan ahli psikologi dan dinas terkait jika dibutuhkan.
            </p>
          </div>
        </div>
      </section>

      {/* 3. THREE EASY STEPS */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Alur Sangat Mudah
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Cara Melapor dalam 3 Langkah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 font-extrabold text-lg flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Tulis Laporan</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Pilih jenis masalah dan ceritakan peristiwa yang dialami. Sertakan foto/bukti jika ada.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 font-extrabold text-lg flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Simpan Kode Tiket</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Sistem memberikan Nomor Tiket rahasia. Simpan baik-baik untuk membuka kembali laporanmu.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 font-extrabold text-lg flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Terima Perlindungan</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Guru BK membaca laporan dan memberikan pendampingan serta tindakan tegas bagi pelaku.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-800 hover:text-blue-600 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. BOTTOM REASSURING CALL TO ACTION */}
      <section className="py-10 bg-gradient-to-r from-blue-600 to-sky-600 text-white text-center px-4">
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Jangan Simpan Masalahmu Sendirian.
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Guru BK dan Satgas PPKSP ada untuk melindungimu, bukan untuk menghakimi.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToReport}
              className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Buat Laporan Anonim Sekarang
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
