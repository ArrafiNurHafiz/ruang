import React, { useState } from "react";
import {
  ShieldCheck,
  Send,
  Search,
  LockKeyhole,
  MessageCircleMore,
  ArrowRight,
  Clock3,
  EyeOff,
  Image as ImageIcon,
  UsersRound,
  Sparkles,
  ChevronDown,
  FileText,
} from "lucide-react";
import studentHero from "../assets/student-hero.png";
import { StudentSession, SchoolProfile } from "../types";
import { useLanguage } from "../lib/i18n";

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
  const { t, lang } = useLanguage();
  const [quickTicketCode, setQuickTicketCode] = useState("");

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToStatus();
  };

  const protections = [
    {
      icon: EyeOff,
      title: t("prot.oneTitle"),
      text: t("prot.oneText"),
      tone: "mint" as const,
    },
    {
      icon: MessageCircleMore,
      title: t("prot.twoTitle"),
      text: t("prot.twoText"),
      tone: "sky" as const,
    },
    {
      icon: ShieldCheck,
      title: t("prot.threeTitle"),
      text: t("prot.threeText"),
      tone: "violet" as const,
    },
  ];

  const steps = [
    {
      icon: FileText,
      title: t("steps.oneTitle"),
      text: t("steps.oneText"),
    },
    {
      icon: LockKeyhole,
      title: t("steps.twoTitle"),
      text: t("steps.twoText"),
    },
    {
      icon: Send,
      title: t("steps.threeTitle"),
      text: t("steps.threeText"),
    },
  ];

  const faqs = [
    {
      q: t("faq.q1"),
      a: t("faq.a1"),
    },
    {
      q: t("faq.q2"),
      a: t("faq.a2"),
    },
    {
      q: t("faq.q3"),
      a: t("faq.a3"),
    },
    {
      q: t("faq.q4"),
      a: t("faq.a4"),
    },
  ];

  return (
    <div className="w-full flex flex-col bg-background text-foreground">
      {/* 1. HERO SECTION */}
      <section id="beranda" className="hero-section">
        <div className="hero-content">
          <div className="relative z-10 max-w-[720px] pt-4 lg:pt-10">
            <div className="platform-badge">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <strong>{t("hero.badge")}</strong>
              <span>{t("hero.badgeSub")}</span>
            </div>

            <h1>
              {t("hero.title1")}
              <br />
              <span>
                {t("hero.title2")}
              </span>
            </h1>

            <p className="hero-copy">
              {t("hero.copy")}
            </p>

            <div className="hero-stats">
              <span>
                <ShieldCheck />
                <span>
                  {t("hero.stat1")}
                </span>
              </span>
              <span>
                <LockKeyhole />
                <span>
                  {t("hero.stat2")}
                </span>
              </span>
              <span>
                <UsersRound />
                <span>
                  {t("hero.stat3")}
                </span>
              </span>
            </div>
          </div>

          {/* Student Hero Illustration with Floating Elements */}
          <div className="student-wrap" aria-hidden="true">
            <div className="trust-chip trust-one">
              <LockKeyhole />
              <span>
                <b>{t("hero.trustChip1")}</b>
                <small className="whitespace-pre-line">
                  {t("hero.trustChip1Sub")}
                </small>
              </span>
            </div>

            <div className="trust-chip trust-two">
              <UsersRound />
              <span>
                <b>{t("hero.trustChip2")}</b>
                <small className="whitespace-pre-line">
                  {t("hero.trustChip2Sub")}
                </small>
              </span>
            </div>

            <div className="hero-shield">
              <ShieldCheck />
            </div>

            <img
              src={studentHero}
              alt="Student with backpack and books"
              width={912}
              height={1104}
            />
          </div>
        </div>

        {/* Action Panel: Report & Track Cards */}
        <div id="lapor" className="action-panel">
          <button
            id="hero-create-report-btn"
            type="button"
            onClick={onNavigateToReport}
            className="report-action cursor-pointer"
          >
            <span className="action-icon">
              <Send className="w-6 h-6" />
            </span>
            <span>
              <strong>{t("hero.createReport")}</strong>
              <small>
                {t("hero.createReportSub")}
              </small>
            </span>
            <i>
              <ArrowRight className="w-4 h-4" />
            </i>
          </button>

          <form className="ticket-action" onSubmit={handleQuickTrack}>
            <span className="action-icon">
              <Sparkles className="w-6 h-6" />
            </span>
            <label>
              <strong>{t("hero.trackTicket")}</strong>
              <small>
                {t("hero.trackTicketSub")}
              </small>
            </label>
            <div className="ticket-search">
              <input
                aria-label="Ticket code"
                placeholder={t("hero.ticketPlaceholder")}
                value={quickTicketCode}
                onChange={(e) => setQuickTicketCode(e.target.value)}
              />
              <button type="submit">{t("hero.trackBtn")}</button>
            </div>
          </form>
        </div>

        {/* Privacy Strip */}
        <div className="privacy-strip">
          <span>
            <EyeOff />
            {lang === "en" ? "Zero Name / Device Tracking" : "Tanpa Rekam Nama / Akun"}
          </span>
          <span>
            <LockKeyhole />
            {lang === "en" ? "2-Way Encrypted Chat" : "Enkripsi Pesan 2-Arah"}
          </span>
          <span>
            <Clock3 />
            {lang === "en" ? "Counselor Response < 24h" : "Respons Tim BK < 24 Jam"}
          </span>
          <span>
            <ImageIcon />
            {lang === "en" ? "Image Evidence Supported" : "Mendukung Bukti Gambar"}
          </span>
        </div>
      </section>

      {/* 2. THREE PILLARS OF PROTECTION */}
      <section id="tentang" className="section-shell protection-section">
        <div className="section-heading">
          <span>{lang === "en" ? "SAFE SPACE FOR EVERYONE" : "RUANG AMAN UNTUK SEMUA"}</span>
          <h2>
            {lang === "en" ? "Comprehensive Protection for Every Student" : "Perlindungan Penuh untuk Setiap Siswa"}
          </h2>
          <p>
            {t("prot.sub")}
          </p>
        </div>

        <div className="protection-grid">
          {protections.map(({ icon: Icon, title, text, tone }) => (
            <article key={title} className={`protection-card ${tone}`}>
              <span>
                <Icon className="w-6 h-6" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <div className="card-art" aria-hidden="true">
                <Icon />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. THREE EASY STEPS */}
      <section id="cara" className="section-shell steps-section">
        <div className="section-heading">
          <span>{lang === "en" ? "SIMPLE PROCESS" : "ALUR SANGAT MUDAH"}</span>
          <h2>
            {lang === "en" ? "How to Report in 3 Simple Steps" : "Cara Melapor dalam 3 Langkah"}
          </h2>
        </div>

        <div className="steps-grid">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="step-item">
              <span className="step-number">{index + 1}</span>
              <span className="step-icon">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="section-shell faq-section">
        <div>
          <span className="mini-label">{lang === "en" ? "Q & A" : "TANYA • JAWAB"}</span>
          <h2>
            {t("faq.title")}
          </h2>
          <p>
            {lang === "en"
              ? "Find answers to frequently asked questions about confidential reporting and student protection."
              : "Temukan jawaban atas pertanyaan yang paling sering ditanyakan seputar laporan anonim dan perlindungan siswa."}
          </p>
          <button
            type="button"
            onClick={onNavigateToHelp}
            className="faq-link"
          >
            {lang === "en" ? "View full help center" : "Lihat pusat bantuan lengkap"} <ArrowRight />
          </button>
        </div>

        <div id="faq-list" className="faq-list">
          {faqs.map((faq, idx) => (
            <details key={idx} open={idx === 0}>
              <summary>
                <span>{faq.q}</span>
                <ChevronDown />
              </summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="cta-section section-shell">
        <div>
          <span>{lang === "en" ? "NEVER SUFFER IN SILENCE." : "JANGAN SIMPAN MASALAHMU SENDIRIAN."}</span>
          <h2>{lang === "en" ? "We Are Here to Listen and Help." : "Kami Ada untuk Mendengarkan."}</h2>
          <p>
            {lang === "en"
              ? "Your voice is vital to creating a safe, welcoming, and violence-free school environment."
              : "Suara kamu penting untuk menciptakan lingkungan sekolah yang lebih aman, nyaman, dan bebas dari kekerasan."}
          </p>
        </div>

        <Send className="cta-plane" />

        <button
          type="button"
          onClick={onNavigateToReport}
          className="cta-btn"
        >
          <Send />
          {lang === "en" ? "Report Anonymously Now" : "Buat Laporan Anonim Sekarang"}
        </button>

        <small>{lang === "en" ? "Confidential • Encrypted • Fast Response" : "Aman • Terenkripsi • Respons Cepat"}</small>
      </section>
    </div>
  );
};

