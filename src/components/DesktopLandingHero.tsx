import React from "react";
import {
  ShieldCheck,
  Send,
  Search,
  HelpCircle,
  Lock,
  EyeOff,
  Users,
  ChevronRight,
  Sparkles,
  SquarePen,
  Play,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Shield,
  HeartHandshake,
  ArrowRight,
  ExternalLink,
  Info,
  Check,
  Smartphone,
  Compass,
  KeyRound,
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
  return (
    <div className="w-full flex flex-col bg-slate-50">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (ROYAL BLUE GRADIENT WITH 3D MONITOR & MOBILE SHOWCASE)   */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] text-white overflow-hidden pt-8 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8">
        {/* Ambient Curved Light Waves in Background */}
        <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M-100 200 C300 100 700 450 1540 250"
              stroke="white"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              opacity="0.4"
            />
            <path
              d="M-100 350 C400 250 800 600 1540 400"
              stroke="white"
              strokeWidth="2"
              opacity="0.3"
            />
            <circle
              cx="200"
              cy="150"
              r="300"
              fill="#60a5fa"
              opacity="0.2"
              filter="blur(60px)"
            />
            <circle
              cx="1100"
              cy="350"
              r="350"
              fill="#3b82f6"
              opacity="0.3"
              filter="blur(80px)"
            />
            <circle
              cx="850"
              cy="650"
              r="250"
              fill="#93c5fd"
              opacity="0.15"
              filter="blur(70px)"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT COLUMN: HERO HEADLINE & ACTIONS */}
          <div className="lg:col-span-5 space-y-6 text-left z-10">
            {/* Top Badge: Platform Pelaporan Perundungan Anonim & School Identity */}
            <div className="inline-flex flex-wrap items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-xs sm:text-sm font-medium border border-white/25 backdrop-blur-md shadow-xs transition-transform hover:scale-105">
              <ShieldCheck className="w-4 h-4 text-sky-200" />
              <span>
                {schoolProfile ? (
                  <>
                    Satgas PPKSP • <strong>{schoolProfile.schoolName}</strong>{" "}
                    (NPSN: {schoolProfile.npsn})
                  </>
                ) : (
                  "Platform Pelaporan Perundungan Siswa Berbasis Token Sah"
                )}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Suaramu Berarti.
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Kami <span className="text-[#fca5a5] drop-shadow-xs">Siap</span>{" "}
                Mendengarkan.
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-xs sm:text-sm md:text-base text-blue-100/90 leading-relaxed font-normal max-w-lg">
              Laporkan bullying, kekerasan sosial, atau pelecehan secara aman
              dan rahasia. Bersama, kita ciptakan lingkungan yang lebih aman
              untuk semua.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToReport}
                id="hero-btn-lapor-aman"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-xl shadow-blue-950/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer min-h-[44px]"
              >
                <SquarePen className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Buat Laporan Aman</span>
              </button>

              <button
                onClick={onNavigateToHowItWorks}
                id="hero-btn-cara-kerja"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/30 backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer min-h-[44px]"
              >
                <Play className="w-3.5 h-3.5 fill-white shrink-0" />
                <span>Pelajari Cara Kerja</span>
              </button>
            </div>

            {/* Trust Assurance & School Code Verification Footnote */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-blue-100/80">
                <Lock className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span>
                  Identitasmu aman. Server tidak akan pernah mengetahui siapa
                  kamu.
                </span>
              </div>

              {studentSession ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>
                    Kode Siswa Sah:{" "}
                    <strong className="font-mono text-white">
                      {studentSession.tokenCode}
                    </strong>{" "}
                    ({studentSession.studentLevel})
                  </span>
                </div>
              ) : onOpenTokenGate ? (
                <button
                  type="button"
                  onClick={onOpenTokenGate}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-blue-100 text-xs transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>
                    Punya Kode Sekolah?{" "}
                    <strong>Verifikasi Anti-Penyusup</strong> →
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          {/* RIGHT COLUMN: 3D MONITOR & SMARTPHONE COMPOSITION */}
          <div className="lg:col-span-7 relative flex justify-center items-center">
            {/* The Outer Perspective Frame */}
            <div className="relative w-full max-w-2xl">
              {/* 1. DESKTOP MONITOR DISPLAY */}
              <div className="relative rounded-2xl bg-slate-900/90 p-2 sm:p-3 shadow-2xl shadow-blue-950/60 border border-slate-700/60 backdrop-blur-md">
                {/* Monitor Screen Surface */}
                <div className="bg-slate-50 text-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-200 text-xs select-none">
                  {/* Internal App Navigation Header */}
                  <div className="bg-white px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                        <Shield className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className="font-extrabold text-slate-900 text-xs">
                        Ruang Aman
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Bell className="w-2.5 h-2.5" />
                      </div>
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                        BK
                      </div>
                    </div>
                  </div>

                  {/* Monitor Body Grid: Mini Sidebar + Main Content */}
                  <div className="grid grid-cols-12 min-h-[290px]">
                    {/* Mini Sidebar */}
                    <div className="col-span-3 bg-slate-50/80 border-r border-slate-200/80 p-2 space-y-1">
                      <div className="px-2 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center gap-1.5 text-[10px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        <span>Dashboard</span>
                      </div>
                      <div className="px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 text-[10px]">
                        <span>Laporan</span>
                      </div>
                      <div className="px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 text-[10px]">
                        <span>Pantau Laporan</span>
                      </div>
                      <div className="px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 text-[10px]">
                        <span>Pusat Bantuan</span>
                      </div>
                      <div className="px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 text-[10px]">
                        <span>Pengaturan</span>
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-span-9 p-3 space-y-3 bg-white">
                      {/* Greeting Header */}
                      <div className="border-b border-slate-100 pb-2">
                        <h4 className="font-extrabold text-slate-900 text-xs">
                          Halo, Selamat Datang!
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Kamu tidak sendiri. Kami di sini untuk mendengarkan.
                        </p>
                      </div>

                      {/* 3 Metric Stat Cards */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-blue-600">
                            <span className="text-[14px] font-extrabold text-blue-950">
                              24
                            </span>
                            <Users className="w-3 h-3 text-blue-500" />
                          </div>
                          <div>
                            <div className="text-[9px] font-bold text-slate-700">
                              Laporan Baru
                            </div>
                            <div className="text-[8px] text-emerald-600 font-semibold">
                              +12% kemarin
                            </div>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-amber-600">
                            <span className="text-[14px] font-extrabold text-amber-950">
                              8
                            </span>
                            <Clock className="w-3 h-3 text-amber-500" />
                          </div>
                          <div>
                            <div className="text-[9px] font-bold text-slate-700">
                              Dalam Proses
                            </div>
                            <div className="text-[8px] text-blue-600 font-semibold">
                              Sedang ditangani
                            </div>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-emerald-600">
                            <span className="text-[14px] font-extrabold text-emerald-950">
                              12
                            </span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          </div>
                          <div>
                            <div className="text-[9px] font-bold text-slate-700">
                              Selesai
                            </div>
                            <div className="text-[8px] text-emerald-600 font-semibold">
                              +8% kemarin
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Table Section: Laporan Terbaru */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-bold text-slate-800">
                          Laporan Terbaru
                        </div>

                        <div className="space-y-1">
                          {/* Row 1 */}
                          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[9px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              <div>
                                <div className="font-bold text-slate-800">
                                  Cyberbullying
                                </div>
                                <div className="text-slate-400 text-[8px]">
                                  SMP Negeri 1 Jakarta
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[8px]">
                                Baru
                              </span>
                              <span className="text-slate-400 text-[8px]">
                                10 mnt lalu
                              </span>
                            </div>
                          </div>

                          {/* Row 2 */}
                          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[9px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              <div>
                                <div className="font-bold text-slate-800">
                                  Perundungan Verbal
                                </div>
                                <div className="text-slate-400 text-[8px]">
                                  SMA Negeri 5 Bandung
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[8px]">
                                Proses
                              </span>
                              <span className="text-slate-400 text-[8px]">
                                1 jam lalu
                              </span>
                            </div>
                          </div>

                          {/* Row 3 */}
                          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[9px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <div>
                                <div className="font-bold text-slate-800">
                                  Perundungan Fisik
                                </div>
                                <div className="text-slate-400 text-[8px]">
                                  SMP Negeri 3 Surabaya
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[8px]">
                                Selesai
                              </span>
                              <span className="text-slate-400 text-[8px]">
                                2 jam lalu
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* View all link */}
                        <div className="text-right pt-1">
                          <button
                            onClick={onNavigateToLogin}
                            className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>Lihat Semua Laporan</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitor Stand */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-8 bg-gradient-to-b from-slate-700 to-slate-800 border-x border-slate-600"></div>
                <div className="w-36 h-3 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 rounded-full shadow-lg"></div>
              </div>

              {/* 2. 3D FLOATING GLOWING SHIELD (TOP RIGHT CORNER OF MONITOR) */}
              <div
                className="absolute -top-6 -right-4 sm:-right-8 w-24 h-28 sm:w-32 sm:h-36 pointer-events-none filter drop-shadow-[0_15px_25px_rgba(37,99,235,0.6)] animate-bounce"
                style={{ animationDuration: "4s" }}
              >
                <svg
                  viewBox="0 0 120 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <defs>
                    <linearGradient
                      id="shield3dOuter"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#93c5fd"
                        stopOpacity="0.95"
                      />
                      <stop
                        offset="50%"
                        stopColor="#3b82f6"
                        stopOpacity="0.85"
                      />
                      <stop
                        offset="100%"
                        stopColor="#1d4ed8"
                        stopOpacity="0.95"
                      />
                    </linearGradient>
                    <linearGradient
                      id="shield3dInner"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                  </defs>
                  {/* Outer Glass Shield */}
                  <path
                    d="M60 10 L105 32 V75 C105 105 60 128 60 128 C60 128 15 105 15 75 V32 Z"
                    fill="url(#shield3dOuter)"
                    stroke="#bfdbfe"
                    strokeWidth="3"
                  />
                  {/* Inner Facet */}
                  <path
                    d="M60 22 L94 40 V72 C94 95 60 114 60 114 C60 114 26 95 26 72 V40 Z"
                    fill="url(#shield3dInner)"
                    opacity="0.9"
                  />
                  {/* Glowing 3D Padlock */}
                  <g transform="translate(60, 68)">
                    <path
                      d="M-8 -6 V-14 C-8 -18 -4 -22 0 -22 C4 -22 8 -18 8 -14 V-6"
                      stroke="#ffffff"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <rect
                      x="-12"
                      y="-6"
                      width="24"
                      height="20"
                      rx="4"
                      fill="#ffffff"
                    />
                    <circle cx="0" cy="2" r="2.5" fill="#1d4ed8" />
                    <path d="M-1 4 L-2 9 H2 L1 4 Z" fill="#1d4ed8" />
                  </g>
                </svg>
              </div>

              {/* 3. 3D SMARTPHONE MOCKUP (BOTTOM RIGHT FOREGROUND) */}
              <div className="absolute -bottom-6 -right-2 sm:-right-6 w-44 sm:w-52 rounded-2xl bg-slate-900 p-2 shadow-2xl shadow-blue-950/80 border-2 border-slate-700 backdrop-blur-md transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="bg-slate-50 rounded-xl overflow-hidden text-[10px] text-slate-800">
                  {/* Status Bar */}
                  <div className="bg-slate-100 px-3 py-1 flex items-center justify-between text-[8px] font-bold text-slate-500">
                    <span>9:41</span>
                    <div className="w-10 h-2 bg-slate-800 rounded-full"></div>
                    <span>100%</span>
                  </div>

                  {/* App Header */}
                  <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-md bg-blue-600 text-white flex items-center justify-center">
                        <Shield className="w-2.5 h-2.5" />
                      </div>
                      <span className="font-extrabold text-[10px] text-slate-900">
                        Ruang Aman
                      </span>
                    </div>
                    <Bell className="w-3 h-3 text-slate-400" />
                  </div>

                  {/* Welcome banner inside mobile */}
                  <div className="p-2 space-y-2">
                    <div className="p-2 rounded-lg bg-blue-600 text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-sky-200 shrink-0" />
                      <div className="text-[8px] leading-tight font-medium">
                        Halo! Kamu tidak sendiri. Kami siap mendengarkan.
                      </div>
                    </div>

                    {/* 4-Grid Menu on Mobile */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <div
                        onClick={onNavigateToReport}
                        className="p-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                          <SquarePen className="w-3 h-3" />
                        </div>
                        <div className="font-extrabold text-[8px] text-slate-900">
                          Buat Laporan
                        </div>
                        <div className="text-[7px] text-slate-400">
                          Lapor aman
                        </div>
                      </div>

                      <div
                        onClick={onNavigateToStatus}
                        className="p-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1">
                          <Users className="w-3 h-3" />
                        </div>
                        <div className="font-extrabold text-[8px] text-slate-900">
                          Pantau Laporan
                        </div>
                        <div className="text-[7px] text-slate-400">
                          Cek status
                        </div>
                      </div>

                      <div
                        onClick={onNavigateToHelp}
                        className="p-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-md bg-teal-100 text-teal-600 flex items-center justify-center mb-1">
                          <HelpCircle className="w-3 h-3" />
                        </div>
                        <div className="font-extrabold text-[8px] text-slate-900">
                          Pusat Bantuan
                        </div>
                        <div className="text-[7px] text-slate-400">
                          Info & edukasi
                        </div>
                      </div>

                      <div
                        onClick={onNavigateToAbout}
                        className="p-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center mb-1">
                          <HeartHandshake className="w-3 h-3" />
                        </div>
                        <div className="font-extrabold text-[8px] text-slate-900">
                          Tentang Kami
                        </div>
                        <div className="text-[7px] text-slate-400">
                          Ruang Aman
                        </div>
                      </div>
                    </div>

                    {/* Bottom Full Action Button */}
                    <button
                      onClick={onNavigateToReport}
                      className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[8px] flex items-center justify-center gap-1 shadow-md shadow-blue-500/30"
                    >
                      <Lock className="w-2.5 h-2.5" />
                      <span>Buat Laporan Sekarang</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. DESK DECORATION: 3D PLANT POT */}
              <div className="absolute -bottom-4 -left-6 w-12 h-16 pointer-events-none opacity-85 hidden sm:block">
                <svg
                  viewBox="0 0 60 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Leaves */}
                  <path
                    d="M30 40 C15 30 10 10 30 5 C50 10 45 30 30 40 Z"
                    fill="#10b981"
                    opacity="0.9"
                  />
                  <path
                    d="M30 45 C45 35 55 20 40 10 C25 20 20 35 30 45 Z"
                    fill="#059669"
                  />
                  <path
                    d="M25 45 C10 35 5 20 18 12 C30 22 30 35 25 45 Z"
                    fill="#34d399"
                  />
                  {/* Pot */}
                  <polygon
                    points="18,48 42,48 38,72 22,72"
                    fill="#3b82f6"
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                  />
                  <ellipse cx="30" cy="48" rx="12" ry="3" fill="#1d4ed8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. "3 LANGKAH MUDAH MELAPOR" (WHITE CARD CONTAINER WITH STEP TILES)        */}
      {/* ========================================================================= */}
      <section className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-200/80 border border-slate-100">
          {/* Header Title with Sparkles */}
          <div className="text-center space-y-1 mb-8">
            <div className="inline-flex items-center gap-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3 Langkah Mudah Melapor</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 3 Step Tiles in a Grid with Connecting Chevrons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
            {/* Step 1 */}
            <div
              onClick={onNavigateToReport}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200 group cursor-pointer"
            >
              {/* Number Badge */}
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                1
              </div>

              {/* Icon Box */}
              <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 stroke-[2]" />
              </div>

              {/* Text */}
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-blue-700 transition-colors">
                  Buka Menu Laporan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Klik tombol &ldquo;Lapor&rdquo; pada aplikasi
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              onClick={onNavigateToReport}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200 group cursor-pointer"
            >
              {/* Number Badge */}
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                2
              </div>

              {/* Icon Box */}
              <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <SquarePen className="w-6 h-6 stroke-[2]" />
              </div>

              {/* Text */}
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-blue-700 transition-colors">
                  Isi Detail Laporan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sampaikan informasi mengenai yang terjadi
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={onNavigateToReport}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200 group cursor-pointer"
            >
              {/* Number Badge */}
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                3
              </div>

              {/* Icon Box */}
              <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>

              {/* Text */}
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-blue-700 transition-colors">
                  Kirim Laporan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Laporan Anda akan dikirim secara aman &amp; terenkripsi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BOTTOM ACCENT BANNER (BERANI MELAPOR + 4 PILLARS GRID)                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 sm:p-8 lg:p-10 shadow-2xl shadow-blue-900/40 relative overflow-hidden">
          {/* Subtle Ambient Shapes */}
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-white/5 rounded-full filter blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Headline with Hand & Heart Icon */}
            <div className="lg:col-span-4 flex items-start gap-4">
              {/* Vector Hand Holding Heart */}
              <div className="w-16 h-16 shrink-0 text-white/95">
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Floating Heart */}
                  <path
                    d="M60 20 C50 8 35 12 35 25 C35 38 60 55 60 55 C60 55 85 38 85 25 C85 12 70 8 60 20 Z"
                    stroke="#ffffff"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Supporting Cupped Hand */}
                  <path
                    d="M15 65 C25 65 35 60 45 55 L65 55 C75 55 85 62 82 72 C80 78 72 80 60 80 L35 80 C22 80 15 72 15 65 Z"
                    stroke="#ffffff"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M38 68 C45 68 55 66 65 66"
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Berani Melapor,
                </h2>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Bersama Menciptakan
                </h2>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-200 leading-tight">
                  Ruang yang Aman.
                </h2>
              </div>
            </div>

            {/* Right 4 Pillars Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Feature 1: Aman & Anonim */}
              <div className="space-y-2 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs hover:bg-white/15 transition-all">
                <div className="w-8 h-8 rounded-xl bg-white/20 text-sky-200 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h4 className="font-extrabold text-white text-sm">
                  Aman &amp; Anonim
                </h4>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Identitasmu dilindungi dengan teknologi enkripsi bertingkat
                  tinggi.
                </p>
              </div>

              {/* Feature 2: Privasi Terjamin */}
              <div className="space-y-2 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs hover:bg-white/15 transition-all">
                <div className="w-8 h-8 rounded-xl bg-white/20 text-sky-200 flex items-center justify-center">
                  <EyeOff className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h4 className="font-extrabold text-white text-sm">
                  Privasi Terjamin
                </h4>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Server tidak akan pernah mengetahui siapa kamu. 100% rahasia.
                </p>
              </div>

              {/* Feature 3: Dilindungi Teknologi */}
              <div className="space-y-2 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs hover:bg-white/15 transition-all">
                <div className="w-8 h-8 rounded-xl bg-white/20 text-sky-200 flex items-center justify-center">
                  <Lock className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h4 className="font-extrabold text-white text-sm">
                  Dilindungi Teknologi
                </h4>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Menggunakan Zero-Knowledge Proof untuk menjaga identitas tetap
                  aman.
                </p>
              </div>

              {/* Feature 4: Kita Peduli */}
              <div className="space-y-2 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs hover:bg-white/15 transition-all">
                <div className="w-8 h-8 rounded-xl bg-white/20 text-sky-200 flex items-center justify-center">
                  <Users className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h4 className="font-extrabold text-white text-sm">
                  Kita Peduli
                </h4>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Setiap laporan membantu menciptakan lingkungan yang lebih
                  baik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
