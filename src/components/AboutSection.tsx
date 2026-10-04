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
import { useLanguage } from "../lib/i18n";

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
  const { t, lang } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 shadow-2xs">
          <ShieldCheck className="w-4 h-4" />
          <span>{t("about.badge")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t("about.title")}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {t("about.lead")}
        </p>
      </div>

      {/* Main Feature Grid with Visual Art */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-100">
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Award className="w-3.5 h-3.5" />
            <span>{lang === "en" ? "National Standards Compliance" : "Kepatuhan Standar Nasional"}</span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">
            {lang === "en" ? "Why Was Ruang Aman Created?" : "Mengapa Ruang Aman Diciptakan?"}
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed">
            {lang === "en"
              ? "Many victims and witnesses of bullying and harassment suffer in silence due to fear of retaliation, identity leaks, or social stigma. Ruang Aman breaks this cycle with mathematical privacy powered by Zero-Knowledge Proof."
              : "Banyak korban dan saksi perundungan (bullying) memilih diam karena takut akan intimidasi balasan, kebocoran data, atau stigma sosial. Ruang Aman memutus rantai ketakutan tersebut dengan sistem pelaporan terenkripsi Zero-Knowledge Proof."}
          </p>

          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>{lang === "en" ? "100% Confidentiality Guaranteed:" : "Kerahasiaan 100% Terjamin:"}</strong>{" "}
                {lang === "en"
                  ? "Reporter identity is never stored in server databases or application logs."
                  : "Identitas pelapor tidak pernah disimpan di basis data server."}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>{lang === "en" ? "Direct Access to School Task Force & Counselors:" : "Akses Langsung ke Tim TPPK & Guru BK:"}</strong>{" "}
                {lang === "en"
                  ? "Reports connect immediately with certified school counselors and PPKSP task force members."
                  : "Laporan langsung terhubung dengan konselor bersertifikasi sekolah."}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>{lang === "en" ? "Anonymous Two-Way Communication:" : "Komunikasi Dua Arah Anonim:"}</strong>{" "}
                {lang === "en"
                  ? "Ask questions and receive psychological support without disclosing who you are."
                  : "Tanya jawab dan pendampingan psikologis tanpa membongkar siapa Anda."}
              </span>
            </li>
          </ul>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onNavigateToReport}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              {lang === "en" ? "Report Anonymously Now" : "Buat Laporan Sekarang"}
            </button>
            <button
              onClick={onNavigateToHowItWorks}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
            >
              {lang === "en" ? "Learn How ZKP Works" : "Pelajari Cara Kerja ZKP"}
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
            {lang === "en" ? "Solid Legal Mandate" : "Payung Hukum Kuat"}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {lang === "en"
              ? "Grounded in Permendikbudristek No. 46/2023, the National Child Protection Act, and official PPKSP protocols."
              : "Berlandaskan Permendikbud No. 46/2023, Undang-Undang Perlindungan Anak, dan Pedoman Penanganan Kekerasan Satgas TPPK."}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">
            {lang === "en" ? "Integrated Coordination" : "Kolaborasi Terpadu"}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {lang === "en"
              ? "Connecting students, parents, counselors, principals, and regional education agencies in a unified loop."
              : "Menghubungkan siswa, orang tua, Guru BK, kepala sekolah, serta dinas pendidikan terkait secara terkoordinasi dan terukur."}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">
            {lang === "en" ? "Holistic Rehabilitation" : "Pemulihan Holistik"}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {lang === "en"
              ? "Prioritizing trauma recovery, psychological safety, and ongoing counseling over punitive measures alone."
              : "Fokus penanganan tidak hanya pada sanksi administratif, tetapi mengedepankan pemulihan trauma psikologis dan pendampingan konseling."}
          </p>
        </div>
      </div>
    </div>
  );
};

