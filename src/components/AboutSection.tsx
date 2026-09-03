import React from "react";
import {
  ShieldCheck,
  HeartHandshake,
  Lock,
  Users,
  Award,
  Scale,
  Building2,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { PPKSPVectorArt } from "./AnimatedIllustrations";

interface AboutSectionProps {
  onNavigateToReport: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToHelp: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onNavigateToReport,
  onNavigateToHowItWorks,
  onNavigateToHelp,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 shadow-2xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Tentang Ruang Aman &amp; Satgas PPKSP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Mewujudkan Lingkungan Sekolah yang Aman, Inklusif, dan Bebas Kekerasan
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Ruang Aman adalah inisiatif teknologi digital berbasis privasi mutlak
          untuk mendukung implementasi
          <strong> Permendikbudristek No. 46 Tahun 2023</strong> tentang
          Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan
          (PPKSP).
        </p>
      </div>

      {/* Main Feature Grid with Visual Art */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-100">
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Award className="w-3.5 h-3.5" />
            <span>Kepatuhan Standar Nasional</span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">
            Mengapa Ruang Aman Diciptakan?
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed">
            Banyak korban dan saksi perundungan (bullying) memilih diam karena
            takut akan intimidasi balasan, kebocoran data, atau stigma sosial.
            Ruang Aman memutus rantai ketakutan tersebut dengan sistem pelaporan
            terenkripsi Zero-Knowledge Proof.
          </p>

          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Kerahasiaan 100% Terjamin:</strong> Identitas pelapor
                tidak pernah disimpan di basis data server.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Akses Langsung ke Tim TPPK &amp; Guru BK:</strong>{" "}
                Laporan langsung terhubung dengan konselor bersertifikasi
                sekolah.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Komunikasi Dua Arah Anonim:</strong> Tanya jawab dan
                pendampingan psikologis tanpa membongkar siapa Anda.
              </span>
            </li>
          </ul>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onNavigateToReport}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              Buat Laporan Sekarang
            </button>
            <button
              onClick={onNavigateToHowItWorks}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
            >
              Pelajari Cara Kerja ZKP
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md h-72 sm:h-80">
          <PPKSPVectorArt className="w-full h-full object-cover" />
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">
            Payung Hukum Kuat
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Berlandaskan Permendikbud No. 46/2023, Undang-Undang Perlindungan
            Anak, dan Pedoman Penanganan Kekerasan Satgas TPPK.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">
            Kolaborasi Terpadu
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Menghubungkan siswa, orang tua, Guru BK, kepala sekolah, serta dinas
            pendidikan terkait secara terkoordinasi dan terukur.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">
            Pemulihan Holistik
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fokus penanganan tidak hanya pada sanksi administratif, tetapi
            mengedepankan pemulihan trauma psikologis dan pendampingan
            konseling.
          </p>
        </div>
      </div>
    </div>
  );
};
