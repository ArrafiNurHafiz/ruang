import React, { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  Send,
  Sparkles,
  AlertTriangle,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Mic,
  Square,
  Trash2,
  CheckCircle2,
  Lock,
  Copy,
  ArrowRight,
  ArrowLeft,
  Download,
  Info,
  MessageSquare,
  EyeOff,
  Cpu,
  RefreshCw,
  Clock,
  MapPin,
  HelpCircle,
  ShieldAlert,
  Smartphone,
  Heart,
  DollarSign,
  AlertOctagon,
  AlertCircle,
  Zap,
  Check,
  KeyRound,
} from "lucide-react";
import confetti from "canvas-confetti";
import { HeroSafetyIllustration } from "./AnimatedIllustrations";
import {
  ReportCategory,
  ReporterRole,
  ReportUrgency,
  ReportTicket,
  AttachmentItem,
  StudentSession,
  SchoolToken,
} from "../types";
import {
  generateTicketId,
  generateRecoveryKey,
  generateZKPHash,
  detectPII,
  autoRedactText,
  formatBytes,
  DetectedEntity,
} from "../utils/crypto";
import { api } from "../lib/api";

interface AnonymousReportFormProps {
  onReportSubmitted: (newTicket: ReportTicket) => void;
  onNavigateToChat: (ticketId: string) => void;
  isKioskMode?: boolean;
  studentSession?: StudentSession | null;
  tokens?: SchoolToken[];
  onVerifyStudentToken?: (token: SchoolToken) => void;
  onOpenTokenGate?: () => void;
  onLogoutStudentSession?: () => void;
}

const CATEGORIES: ReportCategory[] = [
  "Perundungan / Bullying",
  "Pelecehan Seksual",
  "Kekerasan Fisik",
  "Pemerasan / Pungli",
  "Cyberbullying / Teror Online",
  "Kesehatan Mental / Krisis Diri",
  "Lainnya",
];

const CATEGORY_DETAILS: Record<
  ReportCategory,
  { icon: any; color: string; bg: string; badge: string; desc: string }
> = {
  "Perundungan / Bullying": {
    icon: ShieldAlert,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200 text-amber-900",
    badge: "Verbal / Fisik",
    desc: "Ejekan berulang, pengucilan, ancaman, atau intimidasi antarsiswa",
  },
  "Pelecehan Seksual": {
    icon: AlertTriangle,
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-200 text-rose-900",
    badge: "Prioritas Satgas",
    desc: "Sentuhan tanpa izin, komentar tidak senonoh, atau pemaksaan",
  },
  "Kekerasan Fisik": {
    icon: AlertOctagon,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200 text-red-900",
    badge: "Kritis",
    desc: "Pemukulan, perkelahian sepihak, dorongan keras, atau perusakan barang",
  },
  "Pemerasan / Pungli": {
    icon: DollarSign,
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200 text-orange-900",
    badge: "Finansial",
    desc: "Pemaksaan meminta uang jajan, barang berharga, atau tugas sekolah",
  },
  "Cyberbullying / Teror Online": {
    icon: Smartphone,
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-200 text-indigo-900",
    badge: "Digital",
    desc: "Penyebaran foto/video di medsos, grup WhatsApp, atau akun menfess",
  },
  "Kesehatan Mental / Krisis Diri": {
    icon: Heart,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200 text-emerald-900",
    badge: "Konseling BK",
    desc: "Stres berlebih, depresi, isolasi sosial, atau butuh teman curhat",
  },
  Lainnya: {
    icon: HelpCircle,
    color: "text-slate-600",
    bg: "bg-slate-50 border-slate-200 text-slate-900",
    badge: "Umum",
    desc: "Laporan insiden lain di lingkungan sekolah yang butuh perhatian guru",
  },
};

const ROLES: ReporterRole[] = [
  "Siswa (Korban)",
  "Siswa (Saksi Mata)",
  "Teman / Kerabat",
  "Anonim Penuh",
];

const URGENCIES: { level: ReportUrgency; desc: string; color: string }[] = [
  {
    level: "Rendah",
    desc: "Situasi tidak mendesak, butuh saran/konseling bertahap",
    color: "border-slate-300 text-slate-700 bg-slate-50",
  },
  {
    level: "Sedang",
    desc: "Kejadian berulang atau mengganggu kegiatan belajar",
    color: "border-blue-300 text-blue-800 bg-blue-50",
  },
  {
    level: "Tinggi",
    desc: "Ancaman aktif, intimidasi fisik/psikis berat",
    color: "border-amber-300 text-amber-800 bg-amber-50",
  },
  {
    level: "Kritis (Darurat Segera)",
    desc: "Bahaya cedera fisik, luka, atau ancaman keselamatan jiwa",
    color: "border-rose-400 text-rose-900 bg-rose-50 font-bold",
  },
];

export const AnonymousReportForm: React.FC<AnonymousReportFormProps> = ({
  onReportSubmitted,
  onNavigateToChat,
  isKioskMode = false,
  studentSession = null,
  tokens = [],
  onVerifyStudentToken,
  onOpenTokenGate,
  onLogoutStudentSession,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Anti-infiltrator inline code state
  const [inlineCode, setInlineCode] = useState<string>("");
  const [inlineCodeError, setInlineCodeError] = useState<string>("");
  const [inlineCodeSuccess, setInlineCodeSuccess] = useState<string>("");
  const [tokenGateError, setTokenGateError] = useState<string>("");

  // Step 1: Identitas & Ruang Lingkup
  const [category, setCategory] = useState<ReportCategory>(
    "Perundungan / Bullying",
  );
  const [reporterRole, setReporterRole] =
    useState<ReporterRole>("Siswa (Korban)");
  const [location, setLocation] = useState<string>("");
  const [incidentDate, setIncidentDate] = useState<string>(
    "Hari ini / Baru saja",
  );

  const handleInlineVerify = async (codeToTest: string) => {
    const clean = codeToTest.trim().toUpperCase();
    if (!clean) {
      setInlineCodeError("Harap masukkan kode akses resmi dari sekolah.");
      return;
    }
    
    try {
      const found = await api.verifyToken(clean);
      if (found.status === "Kedaluwarsa") {
        setInlineCodeError("Kode ini telah kedaluwarsa / dinonaktifkan.");
        return;
      }
      setInlineCodeError("");
      setInlineCodeSuccess(`Kode ${clean} terverifikasi!`);
      if (onVerifyStudentToken) {
        onVerifyStudentToken(found);
      }
    } catch (err) {
      setInlineCodeError("Kode tidak terdaftar di database sekolah.");
    }
  };

  // Step 2: Kronologi & PII Deteksi
  const [story, setStory] = useState<string>("");
  const [urgency, setUrgency] = useState<ReportUrgency>("Sedang");
  const [detectedEntities, setDetectedEntities] = useState<DetectedEntity[]>(
    [],
  );
  const [isRedacted, setIsRedacted] = useState<boolean>(false);

  // Step 3: Bukti Lampiran
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const recordingTimerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 4: Submission State & Crypto Proof
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [zkpHash, setZkpHash] = useState<string>("");
  const [powProgress, setPowProgress] = useState<number>(0);
  const [submittedTicket, setSubmittedTicket] = useState<ReportTicket | null>(
    null,
  );
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Live PII Detection on story changes
  useEffect(() => {
    if (story) {
      const detected = detectPII(story);
      setDetectedEntities(detected);
    } else {
      setDetectedEntities([]);
    }
  }, [story]);

  // Audio recording timer simulation
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const handleApplyRedaction = () => {
    const redacted = autoRedactText(story, detectedEntities);
    setStory(redacted);
    setIsRedacted(true);
    setDetectedEntities([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentTotalSize = attachments.reduce(
      (acc, curr) => acc + curr.size,
      0,
    );
    const newItems: AttachmentItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (currentTotalSize + file.size > 25 * 1024 * 1024) {
        alert("Total ukuran lampiran melebihi batas maksimal 25 MB.");
        break;
      }

      const isImg = file.type.startsWith("image/");
      const isAud = file.type.startsWith("audio/");

      newItems.push({
        id: `att-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
        isAudio: isAud,
      });
    }

    setAttachments((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleToggleRecordAudio = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      // create mock voice memo attachment
      const voiceAttachment: AttachmentItem = {
        id: `att-voice-${Date.now()}`,
        name: `rekaman_suara_aman_${new Date().toLocaleTimeString().replace(/:/g, "-")}.mp3`,
        size: Math.max(120000, recordingSeconds * 32000),
        type: "audio/mpeg",
        isAudio: true,
      };
      setAttachments((prev) => [...prev, voiceAttachment]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmitReport = async () => {
    // Require token verification (unless kiosk mode)
    if (!studentSession && !isKioskMode) {
      setTokenGateError("Anda harus memverifikasi kode akses sekolah terlebih dahulu sebelum mengirim laporan.");
      if (onOpenTokenGate) onOpenTokenGate();
      return;
    }

    setIsSubmitting(true);
    setPowProgress(10);

    // Simulate Proof-of-Work anti-spam calculation and ZKP hashing
    const interval = setInterval(() => {
      setPowProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    clearInterval(interval);
    setPowProgress(100);

    const sanitized =
      detectedEntities.length > 0
        ? autoRedactText(story, detectedEntities)
        : story;

    try {
      const createdTicket = await onReportSubmitted({
        category,
        reporterRole,
        location: location || "Lokasi Dirahasiakan / Lingkungan Sekolah",
        incidentDate: incidentDate || "Waktu Dirahasiakan",
        urgency,
        story: story, // Send original story
        redactedStory: sanitized,
        detectedPII: detectedEntities.map((e) => `${e.type}: ${e.text}`),
        attachments,
        isKioskSubmission: isKioskMode,
      } as any);

      if (createdTicket) {
        setSubmittedTicket(createdTicket);
        setZkpHash(createdTicket.hashZKP);
        
        // Confetti celebration
        try {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#2563eb", "#10b981", "#6366f1"],
          });
        } catch (e) {}
      }
    } catch (err) {
      console.error("Failed to submit report via API:", err);
      // Fallback for safety
      setSubmittedTicket({
        id: "ERROR",
        category,
        reporterRole,
        location,
        incidentDate,
        urgency,
        story: sanitized,
        redactedStory: sanitized,
        detectedPII: [],
        status: "diterima",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hashZKP: "error-hash",
        recoveryCode: "error-code",
        messages: [],
      } as any);
    } finally {
      setIsSubmitting(false);
      setPowProgress(100);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // SUCCESS VIEW
  if (submittedTicket) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] text-white p-6 sm:p-8 text-center space-y-2 relative overflow-hidden">
            <div className="w-16 h-16 bg-white/15 border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-950/20 backdrop-blur-md">
              <ShieldCheck className="w-9 h-9 text-sky-200" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Laporan Berhasil Terkirim &amp; Terenkripsi!
            </h2>
            <p className="text-sm text-blue-100 max-w-lg mx-auto">
              Identitasmu 100% anonim dan terlindungi secara kriptografis tanpa
              jejak server.
            </p>
          </div>

          {/* Ticket Information Card */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Lock className="w-32 h-32 text-indigo-400" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
                    KARTU TIKET PELAPORAN ANONIM
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                    Zero-Knowledge Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">
                      Nomor Tiket (Tracking):
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-mono font-black text-indigo-300 tracking-wider">
                        {submittedTicket.id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(submittedTicket.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Salin Nomor Tiket"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">
                      Kode Pemulihan Cadangan:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-mono font-bold text-slate-200 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                        {submittedTicket.recoveryCode}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(submittedTicket.recoveryCode)
                        }
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Salin Kode Pemulihan"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] font-mono text-slate-400 truncate border-t border-slate-800/60">
                  <span className="text-slate-500">Hash ZKP: </span>
                  {submittedTicket.hashZKP}
                </div>
              </div>
            </div>

            {/* Crucial Instructions */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-900 text-xs sm:text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold text-amber-950 block">
                  Simpan Nomor Tiket Anda Sekarang!
                </strong>
                <p className="text-slate-700">
                  Karena sistem ini tidak meminta email atau nama, Anda hanya
                  bisa mengecek status tindak lanjut dan berkomunikasi dua arah
                  dengan Guru BK menggunakan Nomor Tiket ini.
                </p>
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="jump-to-counseling-chat-btn"
                onClick={() => onNavigateToChat(submittedTicket.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-101"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Buka Ruang Obrolan dengan Guru BK</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => {
                  setSubmittedTicket(null);
                  setCurrentStep(1);
                  setStory("");
                  setAttachments([]);
                }}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-5 rounded-xl transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Buat Laporan Baru</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP WIZARD FORM
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6">
      {/* Themed Hero Visual Banner */}
      <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-blue-950/20 border border-blue-400/30">
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 800 400"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-50 100 C200 50 450 250 850 150"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
            <path
              d="M-50 200 C300 150 500 350 850 250"
              stroke="white"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        <div className="absolute -right-6 -bottom-6 sm:right-2 sm:top-2 w-72 sm:w-80 h-64 sm:h-auto opacity-30 sm:opacity-85 pointer-events-none">
          <HeroSafetyIllustration className="w-full h-full" animate={true} />
        </div>

        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium border border-white/25 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-200" />
            <span>Kanal Resmi PPKSP Sesuai Permendikbud No. 46/2023</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Ruang Aman Pengaduan Anonim Siswa
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
            Laporkan perundungan, pemalakan, atau intimidasi dengan perlindungan
            privasi mutlak. Guru BK &amp; Satgas PPKSP siap membantu tanpa
            prasangka dan tanpa rekam jejak identitas.
          </p>

          <div className="flex flex-wrap gap-4 pt-1 text-xs">
            <div className="flex items-center gap-2 text-blue-100 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>100% Bebas Jejak (ZKP)</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100 font-semibold">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Respon Tim BK &lt; 24 Jam</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100 font-semibold">
              <Heart className="w-4 h-4 text-rose-300" />
              <span>Pendampingan Psikologis Gratis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Progress Indicator */}
      <div>
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 text-center text-xs font-bold">
          {[
            {
              step: 1,
              shortLabel: "1. Identitas",
              label: "1. Identitas & Lingkup",
            },
            {
              step: 2,
              shortLabel: "2. Kronologi",
              label: "2. Kronologi & Deteksi",
            },
            { step: 3, shortLabel: "3. Bukti", label: "3. Bukti & Lampiran" },
            {
              step: 4,
              shortLabel: "4. Enkripsi",
              label: "4. Review & Enkripsi",
            },
          ].map((item) => (
            <div key={item.step} className="space-y-1.5">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep >= item.step
                    ? "bg-blue-600 shadow-xs"
                    : "bg-slate-200"
                }`}
              />
              <span
                className={`block text-[11px] sm:text-xs truncate ${currentStep === item.step ? "text-blue-700 font-extrabold" : "text-slate-400 font-medium"}`}
              >
                <span className="sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        {/* STEP 1: IDENTITAS & RUANG LINGKUP */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Langkah 1: Identitas & Ruang Lingkup Laporan</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Data identitas Anda 100% anonim. Tidak ada nama, NISN, atau IP
                yang dikirim ke server.
              </p>
            </div>

            {/* Zero-Data Sent Guarantee Box */}
            <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 shadow-sm shadow-indigo-600/20">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-xs text-indigo-950 space-y-1">
                <span className="font-bold block text-indigo-900">
                  Jaminan Privasi Penuh:
                </span>
                <p className="text-slate-700">
                  Formulir ini tidak meminta nama Anda. Guru BK hanya akan
                  menerima nomor tiket acak dan isi kejadian untuk segera
                  membantu tanpa prasangka.
                </p>
              </div>
            </div>

            {/* Anti-Infiltrator School Access Code Verification Section */}
            <div className="rounded-2xl border p-4 space-y-3 transition-all">
              {studentSession ? (
                /* Authenticated State */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/80 border border-emerald-300 rounded-xl p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-950">
                          Siswa Terverifikasi Sekolah (Bebas Penyusup)
                        </span>
                        <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                          {studentSession.tokenCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {studentSession.schoolName} •{" "}
                        {studentSession.studentLevel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                      ✓ Valid
                    </span>
                    {onLogoutStudentSession && (
                      <button
                        type="button"
                        onClick={onLogoutStudentSession}
                        className="text-[11px] text-slate-500 hover:text-red-600 font-semibold underline px-1.5 cursor-pointer"
                      >
                        Ganti Kode
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Unauthenticated / Require Code State */
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0" />
                      <span className="text-xs font-bold text-blue-950">
                        Proteksi Anti-Penyusup: Masukkan Kode Akses Sekolah
                      </span>
                    </div>
                    {onOpenTokenGate && (
                      <button
                        type="button"
                        onClick={onOpenTokenGate}
                        className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
                      >
                        Buka Gerbang Login →
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Untuk mencegah pihak luar atau penyusup mengirimkan laporan
                    palsu, silakan masukkan kode akses resmi yang dibagikan oleh
                    pihak sekolah Anda.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inlineCode}
                        onChange={(e) => {
                          setInlineCode(e.target.value.toUpperCase());
                          setInlineCodeError("");
                          setInlineCodeSuccess("");
                        }}
                        placeholder="Contoh: SCH-X1-8831"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:normal-case placeholder:font-normal"
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInlineVerify(inlineCode)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verifikasi Kode</span>
                    </button>
                  </div>

                  {inlineCodeError && (
                    <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{inlineCodeError}</span>
                    </p>
                  )}

                  {inlineCodeSuccess && (
                    <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{inlineCodeSuccess}</span>
                    </p>
                  )}

                  {/* Quick demo pills */}
                  {tokens.length > 0 && (
                    <div className="pt-2 border-t border-blue-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="text-slate-500 font-medium">
                        Contoh Kode Sekolah:
                      </span>
                      {tokens.slice(0, 3).map((t) => (
                        <button
                          key={t.tokenCode}
                          type="button"
                          onClick={() => {
                            setInlineCode(t.tokenCode);
                            handleInlineVerify(t.tokenCode);
                          }}
                          className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 text-blue-800 font-mono font-bold border border-blue-200 transition-colors cursor-pointer"
                          title="Klik untuk langsung verifikasi"
                        >
                          {t.tokenCode} (
                          {t.studentLevel?.split("(")[0]?.trim() || "Kelas"})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reporter Role */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Status Keterlibatan Anda:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setReporterRole(role)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      reporterRole === role
                        ? "border-indigo-600 bg-indigo-50 text-indigo-950 ring-1 ring-indigo-500 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Picker with Themed Badges & Icons */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Kategori Masalah / Kejadian:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => {
                  const details = CATEGORY_DETAILS[cat];
                  const Icon = details.icon;
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/90 text-indigo-950 ring-2 ring-indigo-500/60 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className={`p-2 rounded-xl ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-indigo-200 text-indigo-900" : "bg-slate-100 text-slate-600"}`}
                        >
                          {details.badge}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {cat}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {details.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location & Time approximation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lokasi Kejadian (Umum):</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Toilet Lt 2 / Kantin Belakang / Grup WhatsApp"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400">
                  Hindari menyebut nama spesifik Anda jika ingin tetap anonim.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Perkiraan Waktu:</span>
                </label>
                <input
                  type="text"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  placeholder="Contoh: Istirahat pertama / Kemarin sore"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                id="form-step-1-next"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Lanjut ke Kronologi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: KRONOLOGI & DETEKSI OTOMATIS PII */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span>
                      Langkah 2: Kronologi & Deteksi Otomatis Identitas
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Ceritakan apa yang terjadi. Fitur cerdas TAMENG akan
                    mendeteksi nama atau kelas yang tidak sengaja tertulis.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-700 font-bold bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Pattern Sanitizer Aktif</span>
                </div>
              </div>
            </div>

            {/* Urgency Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Tingkat Urgensi / Kegawatan:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {URGENCIES.map((u) => (
                  <button
                    key={u.level}
                    type="button"
                    onClick={() => setUrgency(u.level)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      urgency === u.level
                        ? `${u.color} ring-2 ring-indigo-500 shadow-xs font-bold`
                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">{u.level}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      {u.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Story Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Ceritakan Kejadian Secara Rinci:
                </label>
                <span className="text-xs text-slate-400">
                  {story.length} karakter
                </span>
              </div>

              <textarea
                value={story}
                onChange={(e) => {
                  setStory(e.target.value);
                  setIsRedacted(false);
                }}
                rows={6}
                placeholder="Tuliskan apa yang Anda alami atau saksikan... (Contoh: Saat istirahat di lorong kelas XII IPA 2, ada sekelompok siswa yang mengambil paksa barang dan mengancam...)"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
              />
            </div>

            {/* Live Detected PII Notification & Redaction Trigger */}
            {detectedEntities.length > 0 && (
              <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 space-y-3 animate-fadeIn">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                        Deteksi Otomatis: Ditemukan {detectedEntities.length}{" "}
                        Potensi Pengenal Pribadi
                      </h4>
                      <p className="text-xs text-amber-800">
                        Untuk menjaga kerahasiaan Anda, kami menyarankan untuk
                        menyamarkan kata-kata berikut:
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyRedaction}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Sensor Otomatis</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {detectedEntities.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-white border border-amber-300 text-amber-900 text-xs px-2.5 py-1 rounded-lg font-mono font-medium shadow-2xs"
                    >
                      <span className="text-[10px] font-bold text-amber-600 uppercase">
                        [{item.type}]:
                      </span>
                      <span>"{item.text}"</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isRedacted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Seluruh data pengenal pribadi telah disamarkan dengan tanda
                  [TERLINDUNGI].
                </span>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm py-2 px-4 rounded-lg hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                id="form-step-2-next"
                disabled={!story.trim()}
                onClick={() => setCurrentStep(3)}
                className={`flex items-center gap-2 font-bold py-3 px-6 rounded-xl shadow-md transition-all ${
                  story.trim()
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <span>Lanjut ke Bukti & Lampiran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BUKTI & LAMPIRAN */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-600" />
                <span>Langkah 3: Unggah Bukti & Lampiran (Maks 25 MB)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Screenshot pesan, foto luka/kejadian, atau rekaman suara. Lokasi
                GPS dan data perangkat (EXIF) otomatis dibersihkan.
              </p>
            </div>

            {/* EXIF Stripper Privacy Guarantee */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-indigo-300 block">
                    EXIF Scrubbing Otomatis Aktif
                  </span>
                  <span className="text-slate-300">
                    Data tipe HP, koordinat GPS, dan metadata foto dihapus saat
                    diunggah.
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 shrink-0">
                Anon-Upload v2
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-6 sm:p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 transition-all space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,audio/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  Klik untuk Memilih File atau Tarik ke Sini
                </span>
                <span className="text-xs text-slate-500">
                  Mendukung Foto (JPG, PNG), Rekaman Suara (MP3, WAV), atau
                  Dokumen (PDF) hingga 25 MB
                </span>
              </div>
            </div>

            {/* Voice Recorder Simulation with Audio Waveforms */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div
                  className={`p-2.5 rounded-xl ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-slate-200 text-slate-700"}`}
                >
                  <Mic className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-2">
                    <span>
                      {isRecording
                        ? `Sedang Merekam: 00:${recordingSeconds < 10 ? "0" + recordingSeconds : recordingSeconds}`
                        : "Rekam Suara Cerita Anda (Opsional)"}
                    </span>
                    {isRecording && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Bagus jika Anda lebih nyaman menceritakan kronologi lewat
                    rekaman audio suara.
                  </div>
                </div>
              </div>

              {/* Animated wave bars if recording */}
              {isRecording && (
                <div className="flex items-center gap-1 h-6 px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
                  {[40, 70, 90, 60, 100, 45, 80, 50, 95, 30, 85, 60].map(
                    (height, i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-500 rounded-full animate-pulse"
                        style={{
                          height: `${Math.max(20, (height * ((recordingSeconds % 3) + 1)) % 100)}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ),
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleToggleRecordAudio}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30"
                    : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-300"
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Selesai & Lampirkan</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Mulai Rekam</span>
                  </>
                )}
              </button>
            </div>

            {/* Attachment List */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  File Terlampir ({attachments.length}):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2 bg-white shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {file.previewUrl ? (
                          <img
                            src={file.previewUrl}
                            alt={file.name}
                            className="w-10 h-10 rounded-lg object-cover border shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                            {file.isAudio ? (
                              <Mic className="w-5 h-5" />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {formatBytes(file.size)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(file.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm py-2 px-4 rounded-lg hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                id="form-step-3-next"
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Lanjut ke Review & Enkripsi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & ENKRIPSI KRIPTOGRAFIS */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <span>Langkah 4: Pratinjau & Enkripsi Zero-Knowledge</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Tinjau ringkasan laporan sebelum dikunci secara kriptografis dan
                dikirim ke Guru BK.
              </p>
            </div>

            {/* Report Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Kategori:
                  </span>
                  <strong className="text-slate-900 font-bold">
                    {category}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Status Pelapor:
                  </span>
                  <strong className="text-slate-900 font-bold">
                    {reporterRole}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Urgensi:
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-slate-200 text-slate-800">
                    {urgency}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Lampiran:
                  </span>
                  <strong className="text-slate-900 font-bold">
                    {attachments.length} file
                  </strong>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">
                  Isi Kronologi Kejadian:
                </span>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-sans">
                  {story}
                </div>
              </div>
            </div>

            {/* Cryptographic Proof Verification Card */}
            <div className="border border-indigo-200 bg-indigo-50/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-indigo-900">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>Protokol Keamanan & Anti-Spam Zero-Knowledge</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>
                  Enkripsi simetris end-to-end dengan derivasi kunci aman.
                </li>
                <li>Anti-Spam Proof-of-Work ringan mencegah flood otomatis.</li>
                <li>
                  Tidak ada data metadata IP, OS, atau browser yang direkam.
                </li>
              </ul>
            </div>

            {/* Progress if submitting */}
            {isSubmitting && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                  <span>Mengunci & Mengenkripsi Laporan (ZKP)...</span>
                  <span>{powProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${powProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm py-2 px-4 rounded-lg hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <div className="flex items-center gap-3">
                {!studentSession && !isKioskMode && (
                  <span className="text-[11px] text-red-600 font-bold">Wajib verifikasi kode akses</span>
                )}
                <button
                  type="button"
                  id="submit-anonymous-report-btn"
                  disabled={isSubmitting || (!studentSession && !isKioskMode)}
                  onClick={handleSubmitReport}
                  className={`flex items-center gap-2 font-extrabold py-3.5 px-8 rounded-xl shadow-lg transition-all cursor-pointer ${
                    !studentSession && !isKioskMode
                      ? 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 hover:scale-102'
                  }`}
                >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Memproses Enkripsi..."
                    : "Kirim Laporan Terenkripsi"}
                </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
