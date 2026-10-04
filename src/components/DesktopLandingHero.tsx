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

const protections = [
  {
    icon: EyeOff,
    title: "Identitas Rahasia Mutlak",
    text: "Nama, nomor HP, dan informasi pribadi disaring otomatis. Tidak ada catatan digital yang bisa melacak perangkat Anda.",
    tone: "mint" as const,
  },
  {
    icon: MessageCircleMore,
    title: "Konseling Rahasia 2-Arah",
    text: "Dapat berkomunikasi langsung dengan Guru BK melalui ruang chat terenkripsi untuk mendapatkan bantuan dan tindak lanjut.",
    tone: "sky" as const,
  },
  {
    icon: ShieldCheck,
    title: "Pendampingan Satgas PPKSP",
    text: "Laporan ditangani secara profesional oleh Satgas PPKSP sekolah dan berkoordinasi dengan pihak terkait jika diperlukan.",
    tone: "violet" as const,
  },
];

const steps = [
  {
    icon: FileText,
    title: "Tulis Laporan",
    text: "Pilih jenis masalah dan ceritakan peristiwa yang dialami. Tambahkan bukti jika ada.",
  },
  {
    icon: LockKeyhole,
    title: "Simpan Kode Tiket",
    text: "Sistem memberikan nomor tiket rahasia. Simpan baik-baik untuk memantau perkembangan laporan.",
  },
  {
    icon: Send,
    title: "Terima Perlindungan",
    text: "Laporan akan ditindaklanjuti oleh sekolah dan instansi terkait sesuai prosedur yang berlaku.",
  },
];

const faqs = [
  {
    q: "Apakah identitas saya benar-benar tidak diketahui siapa pun?",
    a: "Ya, 100% aman. Sistem Ruang Aman tidak mencatat nama, NISN, alamat IP, ataupun perangkat Anda. Data yang diterima Guru BK hanya kronologi kejadian dan bukti yang Anda lampirkan.",
  },
  {
    q: "Bagaimana cara saya membaca tanggapan dari Guru BK?",
    a: "Setelah melapor, Anda akan menerima Nomor Tiket unik. Simpan nomor tersebut. Anda dapat memasukkannya di menu 'Pantau Tiket' kapan saja untuk melihat status dan melakukan chat 2-arah secara rahasia.",
  },
  {
    q: "Apakah saya harus punya kode akses sekolah untuk melapor?",
    a: "Tidak wajib. Siswa tetap dapat membuat laporan kapan saja secara langsung tanpa terhambat kode. Kode sekolah hanya digunakan jika sekolah Anda membagikan token validasi khusus.",
  },
  {
    q: "Jenis kasus apa saja yang bisa dilaporkan?",
    a: "Kekerasan fisik, perundungan (bullying), kekerasan seksual, diskriminasi/intoleransi, pemerasan, kebijakan diskriminatif, dan segala bentuk ketidaknyamanan di lingkungan sekolah sesuai Permendikbudristek No. 46/2023.",
  },
];

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

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToStatus();
  };

  return (
    <div className="w-full flex flex-col bg-background text-foreground">
      {/* 1. HERO SECTION */}
      <section id="beranda" className="hero-section">
        <div className="hero-content">
          <div className="relative z-10 max-w-[720px] pt-4 lg:pt-10">
            <div className="platform-badge">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <strong>Platform Nasional PPKSP</strong>
              <span>Sesuai Permendikbudristek No. 46/2023</span>
            </div>

            <h1>
              Suaramu Berarti.
              <br />
              <span>
                Kami Siap Mendengarkan
                <br />
                &amp; Melindungi.
              </span>
            </h1>

            <p className="hero-copy">
              Kanal resmi pencegahan dan penanganan kekerasan untuk seluruh siswa,
              pendidik, dan warga sekolah di 38 Provinsi Indonesia. Identitasmu
              sepenuhnya terlindungi dengan teknologi privasi tanpa pelacakan
              jejak.
            </p>

            <div className="hero-stats">
              <span>
                <ShieldCheck />
                <span>
                  38 Provinsi
                  <br />
                  Terkoneksi
                </span>
              </span>
              <span>
                <LockKeyhole />
                <span>
                  Sesuai Regulasi
                  <br />
                  PPKSP 46/2023
                </span>
              </span>
              <span>
                <UsersRound />
                <span>
                  Dikelola Sekolah,
                  <br />
                  Dinas &amp; Mitra
                </span>
              </span>
            </div>
          </div>

          {/* Student Hero Illustration with Floating Elements */}
          <div className="student-wrap" aria-hidden="true">
            <div className="trust-chip trust-one">
              <LockKeyhole />
              <span>
                <b>Aman</b>
                <small>
                  Anonim
                  <br />
                  Terenkripsi
                </small>
              </span>
            </div>

            <div className="trust-chip trust-two">
              <UsersRound />
              <span>
                <b>Didengar</b>
                <small>
                  Ditindaklanjuti
                  <br />
                  Dilindungi
                </small>
              </span>
            </div>

            <div className="hero-shield">
              <ShieldCheck />
            </div>

            <img
              src={studentHero}
              alt="Siswi membawa buku dan mengenakan tas sekolah"
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
              <strong>Buat Laporan Baru</strong>
              <small>
                Ceritakan apa yang kamu alami atau saksikan.
                <br />
                100% anonim, tanpa perlu login akun.
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
              <strong>Pantau Tiket &amp; Balas Chat</strong>
              <small>
                Sudah pernah melapor? Cek tanggapan
                <br />
                dan update tanpa mengungkapkan identitas.
              </small>
            </label>
            <div className="ticket-search">
              <input
                aria-label="Kode tiket"
                placeholder="Contoh: TKT-2025-XXXX"
                value={quickTicketCode}
                onChange={(e) => setQuickTicketCode(e.target.value)}
              />
              <button type="submit">Cek</button>
            </div>
          </form>
        </div>

        {/* Privacy Strip */}
        <div className="privacy-strip">
          <span>
            <EyeOff />
            Tanpa Rekam Nama / Akun
          </span>
          <span>
            <LockKeyhole />
            Enkripsi Pesan 2-Arah
          </span>
          <span>
            <Clock3 />
            Respons Tim BK &lt; 24 Jam
          </span>
          <span>
            <ImageIcon />
            Mendukung Bukti Gambar
          </span>
        </div>
      </section>

      {/* 2. THREE PILLARS OF PROTECTION */}
      <section id="tentang" className="section-shell protection-section">
        <div className="section-heading">
          <span>RUANG AMAN UNTUK SEMUA</span>
          <h2>
            Perlindungan Penuh untuk <em>Setiap Siswa</em>
          </h2>
          <p>
            Kami mengutamakan rasa aman Anda agar sekolah menjadi tempat yang
            ramah,
            <br />
            aman, dan bebas dari segala bentuk kekerasan.
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
          <span>ALUR SANGAT MUDAH</span>
          <h2>
            Cara Melapor dalam <em>3 Langkah</em>
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
          <span className="mini-label">TANYA • JAWAB</span>
          <h2>
            Pertanyaan yang
            <br />
            Sering Diajukan
          </h2>
          <p>
            Temukan jawaban atas pertanyaan yang paling sering ditanyakan seputar
            laporan anonim dan perlindungan siswa.
          </p>
          <button
            type="button"
            onClick={onNavigateToHelp}
            className="faq-link"
          >
            Lihat pusat bantuan lengkap <ArrowRight />
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
          <span>JANGAN SIMPAN MASALAHMU SENDIRIAN.</span>
          <h2>Kami Ada untuk Mendengarkan.</h2>
          <p>
            Suara kamu penting untuk menciptakan lingkungan sekolah yang lebih
            aman,
            <br />
            nyaman, dan bebas dari kekerasan.
          </p>
        </div>

        <Send className="cta-plane" />

        <button
          type="button"
          onClick={onNavigateToReport}
          className="cta-btn"
        >
          <Send />
          Buat Laporan Anonim Sekarang
        </button>

        <small>Aman　•　Terenkripsi　•　Respons Cepat</small>
      </section>
    </div>
  );
};
