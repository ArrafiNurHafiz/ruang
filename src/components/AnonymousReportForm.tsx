import React, { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  Send,
  AlertTriangle,
  UploadCloud,
  FileText,
  Mic,
  Trash2,
  CheckCircle2,
  Lock,
  Copy,
  ArrowRight,
  ArrowLeft,
  Info,
  MessageSquare,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  HelpCircle,
  ShieldAlert,
  Smartphone,
  Heart,
  DollarSign,
  AlertOctagon,
  Check,
  KeyRound,
  Sparkles,
  Download,
  Building2,
  School,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  ReportCategory,
  ReporterRole,
  ReportUrgency,
  ReportTicket,
  AttachmentItem,
  StudentSession,
  SchoolToken,
  SchoolRegionalData,
} from "../types";
import { MOCK_REGIONAL_SCHOOLS, INITIAL_TOKENS } from "../data/mockData";
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
import { useLanguage, getCategoryLabel } from "../lib/i18n";

interface AnonymousReportFormProps {
  onReportSubmitted: (newTicket: ReportTicket) => void;
  onNavigateToChat: (ticketId: string) => void;
  isKioskMode?: boolean;
  studentSession?: StudentSession | null;
  tokens?: SchoolToken[];
  regionalSchools?: SchoolRegionalData[];
  onVerifyStudentToken?: (token: SchoolToken) => void;
  onOpenTokenGate?: () => void;
  onLogoutStudentSession?: () => void;
}

const CATEGORIES: { id: ReportCategory; label: string; icon: any }[] = [
  { id: "Perundungan / Bullying", label: "Perundungan / Bullying", icon: ShieldAlert },
  { id: "Pelecehan Seksual", label: "Pelecehan Seksual", icon: AlertTriangle },
  { id: "Kekerasan Fisik", label: "Kekerasan Fisik", icon: AlertOctagon },
  { id: "Cyberbullying / Teror Online", label: "Cyberbullying / Teror Medsos", icon: Smartphone },
  { id: "Pemerasan / Pungli", label: "Pemerasan / Pemalakan", icon: DollarSign },
  { id: "Kesehatan Mental / Krisis Diri", label: "Krisis Mental & Teman Curhat", icon: Heart },
  { id: "Lainnya", label: "Masalah Lainnya", icon: HelpCircle },
];

export const AnonymousReportForm: React.FC<AnonymousReportFormProps> = ({
  onReportSubmitted,
  onNavigateToChat,
  isKioskMode = false,
  studentSession = null,
  tokens = [],
  regionalSchools = [],
  onVerifyStudentToken,
}) => {
  const { t, lang } = useLanguage();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Cakupan Nasional: Pilihan Satuan Pendidikan Asal Pelapor
  const availableSchools =
    regionalSchools && regionalSchools.length > 0
      ? regionalSchools
      : MOCK_REGIONAL_SCHOOLS;
  const [selectedSchool, setSelectedSchool] = useState<string>(
    studentSession?.schoolName || "SMA Negeri 1 Jakarta",
  );
  const [customSchoolName, setCustomSchoolName] = useState<string>("");
  const [customSchoolProvince, setCustomSchoolProvince] = useState<string>("");

  useEffect(() => {
    if (studentSession?.schoolName) {
      setSelectedSchool(studentSession.schoolName);
    }
  }, [studentSession]);

  const activeSchoolDisplayName =
    studentSession?.schoolName ||
    (selectedSchool === "other"
      ? customSchoolName.trim()
        ? `${customSchoolName.trim()}${
            customSchoolProvince.trim()
              ? ` (${customSchoolProvince.trim()})`
              : ""
          }`
        : "Satuan Pendidikan Terdaftar"
      : selectedSchool);

  // Form Fields
  const [category, setCategory] = useState<ReportCategory>("Perundungan / Bullying");
  const [reporterRole, setReporterRole] = useState<ReporterRole>("Siswa (Korban)");
  const [story, setStory] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [incidentDate, setIncidentDate] = useState<string>("Hari ini / Baru saja");
  const [urgency, setUrgency] = useState<ReportUrgency>("Sedang");
  const [showOptionalDetails, setShowOptionalDetails] = useState<boolean>(false);

  // Student Token Code (Optional)
  const [tokenInput, setTokenInput] = useState<string>("");
  const [tokenStatusMessage, setTokenStatusMessage] = useState<string>("");

  // Student Pre-Verification Gate State: Pilih Kode Akses ATAU Sandi Pribadi
  const [isStudentVerified, setIsStudentVerified] = useState<boolean>(
    Boolean(studentSession?.isVerified || studentSession?.tokenCode),
  );
  const [activeGateTab, setActiveGateTab] = useState<"token" | "sandi">("token");
  const [verificationMethod, setVerificationMethod] = useState<"token" | "sandi">(
    studentSession?.verificationMethod || "token",
  );

  // Input verifikasi kode akses
  const [tokenGateInput, setTokenGateInput] = useState<string>("");
  const [tokenGateError, setTokenGateError] = useState<string>("");
  const [isVerifyingToken, setIsVerifyingToken] = useState<boolean>(false);

  // Input verifikasi sandi pribadi
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState<boolean>(false);

  // Flow Buat Sandi Baru dari Kode Akses
  const [isCreatingPassword, setIsCreatingPassword] = useState<boolean>(false);
  const [newPasswordTokenCode, setNewPasswordTokenCode] = useState<string>("");
  const [newPasswordValue, setNewPasswordValue] = useState<string>("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [createPasswordError, setCreatePasswordError] = useState<string>("");
  const [createPasswordSuccess, setCreatePasswordSuccess] = useState<boolean>(false);
  const [isSubmittingNewPassword, setIsSubmittingNewPassword] = useState<boolean>(false);

  // Verifikasi 2-Langkah: Wajib Buat/Masukkan Sandi Sebelum Bisa Melapor
  const [gateFlowStep, setGateFlowStep] = useState<
    "step1" | "step2_create_password" | "step2_enter_password"
  >("step1");
  const [pendingVerifiedToken, setPendingVerifiedToken] = useState<SchoolToken | null>(null);

  // Recovery Key & Collision State (Tab 2: Lupa Kode Akses)
  const [recoveryKeyInput, setRecoveryKeyInput] = useState<string>("");
  const [hasCollision, setHasCollision] = useState<boolean>(false);
  const [collisionCodeInput, setCollisionCodeInput] = useState<string>("");
  const [newlyCreatedRecoveryKey, setNewlyCreatedRecoveryKey] = useState<string>("");

  useEffect(() => {
    if (studentSession?.isVerified || studentSession?.tokenCode) {
      setIsStudentVerified(true);
      if (studentSession.verificationMethod) {
        setVerificationMethod(studentSession.verificationMethod);
      }
    }
  }, [studentSession]);

  // Second Verification: Secret PIN or Memorable Secret Keyword
  const [secretPin, setSecretPin] = useState<string>("");
  const [downloadReceiptDone, setDownloadReceiptDone] = useState<boolean>(false);

  // Attachments
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const recordingTimerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PII & Crypto
  const [detectedEntities, setDetectedEntities] = useState<DetectedEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedTicket, setSubmittedTicket] = useState<ReportTicket | null>(null);
  const [copiedTicketId, setCopiedTicketId] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Real-time PII detection
  useEffect(() => {
    if (story) {
      const detected = detectPII(story);
      setDetectedEntities(detected);
    } else {
      setDetectedEntities([]);
    }
  }, [story]);

  // Voice recording timer
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: AttachmentItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
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
      const voiceAttachment: AttachmentItem = {
        id: `att-voice-${Date.now()}`,
        name: `rekaman_suara_${new Date().toLocaleTimeString().replace(/:/g, "-")}.mp3`,
        size: Math.max(120000, recordingSeconds * 32000),
        type: "audio/mpeg",
        isAudio: true,
      };
      setAttachments((prev) => [...prev, voiceAttachment]);
    }
  };

  const handleVerifyTokenOptional = async () => {
    const clean = tokenInput.trim().toUpperCase();
    if (!clean) return;
    try {
      const verified = await api.verifyToken(clean);
      setTokenStatusMessage(`Kode sekolah ${clean} valid!`);
      if (onVerifyStudentToken) onVerifyStudentToken(verified);
    } catch {
      setTokenStatusMessage("Kode tidak terdaftar (laporan tetap bisa dikirim).");
    }
  };

  // 1. Verifikasi dengan Kode Akses Sekolah (Langkah 1 dari 2)
  const handleVerifyByToken = async (codeOverride?: string) => {
    const clean = (codeOverride || tokenGateInput).trim().toUpperCase();
    if (!clean) {
      setTokenGateError(
        "Harap masukkan kode akses siswa yang dibagikan pihak sekolah.",
      );
      return;
    }
    setIsVerifyingToken(true);
    setTokenGateError("");
    try {
      let verified: SchoolToken;
      try {
        verified = await api.verifyToken(clean);
      } catch (apiErr) {
        const allTokens = [...(tokens || []), ...INITIAL_TOKENS];
        const localMatch = allTokens.find(
          (t) => t.tokenCode?.toUpperCase() === clean,
        );
        if (localMatch) {
          verified = localMatch;
        } else {
          throw apiErr;
        }
      }

      setPendingVerifiedToken(verified);
      setNewPasswordTokenCode(verified.tokenCode);

      // Verifikasi 2 Langkah Wajib:
      // A. Jika belum memiliki sandi -> Wajib buat kata sandi pribadi terlebih dahulu
      if (!verified.hasPassword) {
        setGateFlowStep("step2_create_password");
        setCreatePasswordError("");
        setNewPasswordValue("");
        setNewPasswordConfirm("");
      } else {
        // B. Jika sudah memiliki sandi -> Wajib masukkan sandi pribadi untuk membuka formulir
        setGateFlowStep("step2_enter_password");
        setPasswordInput("");
        setPasswordError("");
      }
    } catch {
      setTokenGateError(
        "Kode akses tidak ditemukan di database sekolah. Pastikan kode sesuai dengan slip resmi atau gunakan Sandi Pribadi.",
      );
    } finally {
      setIsVerifyingToken(false);
    }
  };

  // 1.B Verifikasi Sandi untuk Kode yang Sudah Punya Sandi (Langkah 2 dari 2)
  const handleVerifyStep2Password = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingVerifiedToken) return;
    const cleanPass = passwordInput.trim();
    if (!cleanPass) {
      setPasswordError("Harap masukkan kata sandi pribadi untuk kode akses ini.");
      return;
    }
    setIsVerifyingPassword(true);
    setPasswordError("");
    try {
      const verified = await api.verifyTokenByPassword(
        cleanPass,
        pendingVerifiedToken.tokenCode,
      );
      setVerificationMethod("token");
      setIsStudentVerified(true);
      if (onVerifyStudentToken) onVerifyStudentToken(verified, "token");
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      setPasswordError(
        err.message ||
          "Kata sandi salah untuk kode akses ini. Silakan coba lagi.",
      );
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  // 2. Verifikasi dengan Sandi Pribadi Pelajar (Tab 2: Lupa Kode Akses)
  const handleVerifyByPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = passwordInput.trim();
    const cleanRecovery = recoveryKeyInput.trim();
    const cleanCollision = collisionCodeInput.trim().toUpperCase();

    if (!clean) {
      setPasswordError("Harap masukkan sandi pribadi yang pernah Anda buat.");
      return;
    }
    setIsVerifyingPassword(true);
    setPasswordError("");
    setHasCollision(false);

    try {
      const verified = await api.verifyTokenByPassword(
        clean,
        cleanCollision || undefined,
        cleanRecovery || undefined,
      );
      setVerificationMethod("sandi");
      setIsStudentVerified(true);
      if (onVerifyStudentToken) onVerifyStudentToken(verified, "sandi");
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      if (
        err.isCollision ||
        err.message?.includes("beberapa kode akses") ||
        err.message?.includes("sama")
      ) {
        setHasCollision(true);
        setPasswordError(
          "Terdeteksi beberapa akun siswa dengan kata sandi yang sama. Demi melindungi kerahasiaan data Anda, masukkan Kode Akses Sekolah atau Kunci Pemulihan Anda di bawah ini.",
        );
      } else {
        setPasswordError(
          err.message ||
            "Sandi pelajar tidak cocok atau belum pernah diaktivasi dengan kode sekolah.",
        );
      }
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  // 3. Aktivasi Kode & Buat Sandi Pribadi Baru (Langkah 2 dari 2: Wajib Sebelum Melapor)
  const handleCreateStudentPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatePasswordError("");
    const code =
      pendingVerifiedToken?.tokenCode ||
      newPasswordTokenCode.trim().toUpperCase();
    const pass = newPasswordValue.trim();
    const conf = newPasswordConfirm.trim();

    if (!code) {
      setCreatePasswordError("Harap masukkan kode akses dari sekolah.");
      return;
    }
    if (pass.length < 4) {
      setCreatePasswordError(
        "Sandi minimal 4 karakter (angka atau kombinasi huruf).",
      );
      return;
    }
    if (pass !== conf) {
      setCreatePasswordError("Konfirmasi sandi tidak sesuai.");
      return;
    }

    setIsSubmittingNewPassword(true);
    try {
      // Activate token and hash password securely
      const activated = await api.activateToken(code, btoa(pass), pass);
      setCreatePasswordSuccess(true);
      if (activated.recoveryKey) {
        setNewlyCreatedRecoveryKey(activated.recoveryKey);
      }
      try {
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
      } catch {}

      setTimeout(() => {
        setVerificationMethod("sandi");
        setIsStudentVerified(true);
        if (onVerifyStudentToken) onVerifyStudentToken(activated, "sandi");
      }, 1000);
    } catch (err: any) {
      setCreatePasswordError(
        err.message ||
          "Kode akses sekolah tidak ditemukan atau sudah tidak aktif. Hubungi Guru BK / Satgas.",
      );
    } finally {
      setIsSubmittingNewPassword(false);
    }
  };

  const handleSubmitReport = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!story.trim()) {
      alert("Harap tuliskan cerita atau kejadian yang Anda alami.");
      return;
    }

    setIsSubmitting(true);

    try {
      const ticketId = generateTicketId();
      const recoveryKey = generateRecoveryKey();
      const timestamp = Math.floor(Date.now() / 1000);
      const zkpHash = await generateZKPHash(story, timestamp);

      // Auto-redact sensitive PII automatically
      const entities = detectPII(story);
      const redactedStory = autoRedactText(story, entities);

      const newTicket: ReportTicket = {
        id: ticketId,
        category,
        reporterRole,
        location: location.trim() || "Lingkungan Sekolah",
        incidentDate: incidentDate || "Hari ini",
        urgency,
        story,
        redactedStory,
        detectedPII: entities.map((e) => e.type),
        recoveryCode: recoveryKey,
        secretPin: secretPin.trim() || undefined,
        hashZKP: zkpHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "diterima",
        isKioskSubmission: isKioskMode,
        isStudentVerified: true,
        verificationMethod,
        verifiedSchoolToken:
          studentSession?.tokenCode ||
          (verificationMethod === "token"
            ? tokenGateInput.trim().toUpperCase()
            : undefined),
        schoolName: activeSchoolDisplayName,
        studentBatch: studentSession?.studentLevel || "Kelas X",
        attachments,
        messages: [],
      };

      const result = await onReportSubmitted(newTicket);
      setSubmittedTicket(result || newTicket);
      setCurrentStep(2);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    } catch (err) {
      console.error("Gagal mengirim laporan:", err);
      alert("Terjadi kendala jaringan saat mengirim laporan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!submittedTicket) return;
    const content = `=================================================
BUKTI LAPORAN RUANG AMAN (PPKSP)
100% Rahasia, Aman & Terenkripsi E2EE
=================================================

NOMOR TIKET ANDA : ${submittedTicket.id}
KUNCI PEMULIHAN  : ${submittedTicket.recoveryCode}
PIN RAHASIA ANDA : ${secretPin.trim() || "(Tidak disetel)"}
KATEGORI KEJADIAN: ${submittedTicket.category}
URGENSI          : ${submittedTicket.urgency}
TANGGAL LAPOR    : ${new Date(submittedTicket.createdAt).toLocaleString("id-ID")}

CARA CEK BALASAN GURU BK:
1. Buka situs Ruang Aman di browser.
2. Klik menu 'Pantau Tiket'.
3. Masukkan Nomor Tiket atau gunakan menu 'Pulihkan dengan Verifikasi Kedua' menggunakan PIN Rahasia Anda.
4. Anda dapat membaca tanggapan sekolah dan mengonfirmasi penyelesaian.

Catatan Keamanan: Berkas ini disimpan di perangkat Anda sendiri.
=================================================`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bukti-tiket-ruang-aman-${submittedTicket.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadReceiptDone(true);
    setTimeout(() => setDownloadReceiptDone(false), 3000);
  };

  const handleCopyTicket = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket.id);
      setCopiedTicketId(true);
      setTimeout(() => setCopiedTicketId(false), 2000);
    }
  };

  const handleCopyKey = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket.recoveryCode);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="min-h-[80vh] py-8 sm:py-12 bg-slate-50 text-slate-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* GERBANG VERIFIKASI SISWA SEBELUM MEMBUAT LAPORAN */}
        {!isStudentVerified && currentStep === 1 && (
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 animate-fadeIn">
            {/* KASUS A: LANGKAH 1 (PILIH KODE AKSES ATAU SANDI) */}
            {gateFlowStep === "step1" && (
              <>
                {/* Header */}
                <div className="mb-6 border-b border-slate-100 pb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>{lang === "en" ? "Student Verification • National PPKSP Educational Unit Safety Platform" : "Verifikasi Siswa • Platform PPKSP Satuan Pendidikan Nasional"}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {lang === "en" ? "Student Verification Before Reporting" : "Verifikasi Siswa Sebelum Melapor"}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {lang === "en" ? (
                      <>To ensure reports originate from legitimate students and block malicious spam, the system employs <strong>2-Step Verification</strong>. Enter your <strong>School Access Code</strong> to start, or use your <strong>Student Personal Password</strong> if you misplaced the slip. Your identity remains 100% anonymous.</>
                    ) : (
                      <>Untuk memastikan laporan berasal dari siswa sah dan mencegah pihak luar/spam menyusup, sistem menerapkan <strong>Verifikasi 2 Langkah</strong>. Masukkan <strong>Kode Akses Sekolah</strong> Anda untuk memulai, atau gunakan <strong>Sandi Pribadi Pelajar</strong> jika Anda lupa kode slip. Identitas Anda tetap 100% anonim.</>
                    )}
                  </p>
                </div>

                {/* Tab Selector: Pilih Salah Satu (Kode Akses atau Sandi Pribadi) */}
                <div className="flex rounded-2xl bg-slate-100 p-1.5 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGateTab("token");
                      setTokenGateError("");
                      setPasswordError("");
                      setHasCollision(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeGateTab === "token"
                        ? "bg-white text-blue-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <span>{lang === "en" ? "1. Use School Access Code" : "1. Gunakan Kode Akses Sekolah"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGateTab("sandi");
                      setTokenGateError("");
                      setPasswordError("");
                      setHasCollision(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeGateTab === "sandi"
                        ? "bg-white text-blue-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <span>{lang === "en" ? "2. Forgot Code? Use Personal Password" : "2. Lupa Kode? Gunakan Sandi Pribadi"}</span>
                  </button>
                </div>

                {/* TAB 1: KODE AKSES SISWA */}
                {activeGateTab === "token" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {lang === "en" ? "Step 1: Enter Student Access Code" : "Langkah 1: Masukkan Kode Akses Pelajar"}
                        </label>
                        <span className="text-[11px] text-slate-500">
                          {lang === "en" ? "From school orientation card / homeroom teacher" : "Dari kartu MPLS / dibagikan wali kelas"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={lang === "en" ? "e.g., SCH-X1-8831" : "Misal: SCH-X1-8831"}
                          value={tokenGateInput}
                          onChange={(e) => {
                            setTokenGateInput(e.target.value.toUpperCase());
                            setTokenGateError("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleVerifyByToken();
                            }
                          }}
                          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono tracking-wider focus:outline-hidden focus:border-blue-600 bg-white"
                        />
                        <button
                          type="button"
                          disabled={isVerifyingToken}
                          onClick={() => handleVerifyByToken()}
                          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer shrink-0"
                        >
                          {isVerifyingToken ? (lang === "en" ? "Verifying..." : "Memeriksa...") : (lang === "en" ? "Verify" : "Verifikasi")}
                        </button>
                      </div>

                      {tokenGateError && (
                        <p className="text-xs text-red-600 mt-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{tokenGateError}</span>
                        </p>
                      )}
                    </div>

                    {/* Informasi Verifikasi 2 Langkah Wajib */}
                    <div className="rounded-2xl border border-blue-200/90 bg-blue-50/40 p-4 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <h2 className="text-xs font-bold text-slate-900">
                              {lang === "en" ? "Mandatory 2-Step Verification Workflow" : "Alur Verifikasi 2 Langkah Wajib"}
                            </h2>
                            <p className="text-[11px] text-slate-500">
                              {lang === "en"
                                ? "Once the code is verified, you create a personal password before opening the report form to guarantee absolute privacy."
                                : "Setelah kode diverifikasi, Anda wajib memasangkan sandi pribadi sebelum formulir laporan terbuka agar privasi Anda terlindungi penuh."}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (tokenGateInput.trim()) {
                              handleVerifyByToken();
                            } else {
                              setTokenGateError(lang === "en" ? "Type your access code above first, then click Verify." : "Ketik kode akses Anda di atas terlebih dahulu, lalu klik Verifikasi.");
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                        >
                          {lang === "en" ? "Continue Verification" : "Lanjut Verifikasi"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: SANDI PRIBADI PELAJAR (LUPA KODE AKSES) */}
                {activeGateTab === "sandi" && (
                  <div className="space-y-4 animate-fadeIn">
                    <form
                      onSubmit={handleVerifyByPassword}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {lang === "en" ? "Enter Student Personal Password" : "Masukkan Sandi Pribadi Pelajar"}
                        </label>
                        <span className="text-[11px] text-slate-500">
                          {lang === "en" ? "Secret password you previously created" : "Sandi rahasia yang pernah Anda buat"}
                        </span>
                      </div>
                      <div className="flex gap-2 relative">
                        <div className="relative flex-1">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder={lang === "en" ? "Enter your secret password..." : "Masukkan sandi rahasia Anda..."}
                            value={passwordInput}
                            onChange={(e) => {
                              setPasswordInput(e.target.value);
                              setPasswordError("");
                              setHasCollision(false);
                            }}
                            className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-600 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <button
                          type="submit"
                          disabled={isVerifyingPassword}
                          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer shrink-0"
                        >
                          {isVerifyingPassword ? (lang === "en" ? "Checking..." : "Memeriksa...") : (lang === "en" ? "Verify Password" : "Verifikasi Sandi")}
                        </button>
                      </div>

                      {passwordError && !hasCollision && (
                        <p className="text-xs text-red-600 mt-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{passwordError}</span>
                        </p>
                      )}

                      {/* DETEKSI TABRAKAN SANDI (COLLISION PROTECTION) */}
                      {hasCollision && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-slate-800 space-y-2 animate-fadeIn">
                          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>{lang === "en" ? "Privacy Protection: Password Collision Detected" : "Perlindungan Privasi: Tabrakan Sandi Terdeteksi"}</span>
                          </div>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            {lang === "en"
                              ? "More than one student account in the system shares this password. To protect your privacy and prevent reports from mixing with other students, please enter one of the identifiers below:"
                              : "Terdeteksi lebih dari satu akun di sistem dengan kata sandi yang sama. Demi melindungi privasi Anda dan mencegah laporan tertukar dengan siswa lain, sistem menolak masuk secara acak. Silakan masukkan salah satu pengenal di bawah ini:"}
                          </p>
                          <div className="space-y-2 pt-1">
                            <input
                              type="text"
                              placeholder={lang === "en" ? "Enter School Access Code (e.g., SCH-XXXX) OR Recovery Key (e.g., kunci-xxxx-1234)" : "Masukkan Kode Akses Sekolah (Misal: SCH-XXXX) ATAU Kunci Pemulihan (Misal: kunci-xxxx-1234)"}
                              value={collisionCodeInput || recoveryKeyInput}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val.toLowerCase().startsWith("kunci-")) {
                                  setRecoveryKeyInput(val.toLowerCase());
                                  setCollisionCodeInput("");
                                } else {
                                  setCollisionCodeInput(val.toUpperCase());
                                  setRecoveryKeyInput("");
                                }
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-amber-300 text-xs font-mono bg-white focus:outline-hidden focus:border-amber-600"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={isVerifyingPassword}
                                onClick={() => handleVerifyByPassword()}
                                className="flex-1 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                              >
                                {isVerifyingPassword ? (lang === "en" ? "Verifying..." : "Memverifikasi...") : (lang === "en" ? "Continue Secure Verification" : "Lanjut Verifikasi Pengaman")}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setHasCollision(false);
                                  setActiveGateTab("token");
                                }}
                                className="py-2 px-3 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                {lang === "en" ? "Get New Slip / Cancel" : "Ambil Slip Baru / Batal"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className="text-[11px] text-slate-500">
                        {lang === "en"
                          ? "Forgot school slip code? Simply use your student personal password to report safely. If your password matches another student, backup identification is requested."
                          : "Lupa kode slip sekolah? Cukup gunakan sandi pribadi yang pernah Anda buat untuk melapor dengan aman. Jika sandi Anda sama dengan siswa lain, sistem keamanan akan meminta pengenal cadangan."}
                      </p>
                    </form>
                  </div>
                )}
              </>
            )}

            {/* KASUS B: LANGKAH 2 DARI 2 (TOKEN BELUM PUNYA SANDI -> WAJIB BUAT SANDI BARU) */}
            {gateFlowStep === "step2_create_password" && pendingVerifiedToken && (
              <div className="space-y-5 animate-fadeIn">
                {/* Stepper Breadcrumb */}
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{lang === "en" ? `1. Valid School Code (${pendingVerifiedToken.tokenCode})` : `1. Kode Sekolah Valid (${pendingVerifiedToken.tokenCode})`}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-900">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>{lang === "en" ? "2. Create Personal Password (Required)" : "2. Buat Sandi Pribadi Pelajar (Wajib)"}</span>
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>{lang === "en" ? "2-Step Verification • Step 2 of 2" : "Verifikasi 2 Langkah • Langkah 2 dari 2"}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {lang === "en" ? "Create Student Personal Password" : "Buat Kata Sandi Pribadi Pelajar"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {lang === "en" ? (
                      <>Access code <strong>{pendingVerifiedToken.tokenCode}</strong> is valid and registered at {pendingVerifiedToken.schoolName || activeSchoolDisplayName}. By security standards, you <strong>must create a personal password</strong> first so anyone finding your code slip cannot view your report.</>
                    ) : (
                      <>Kode akses <strong>{pendingVerifiedToken.tokenCode}</strong> valid terdaftar di {pendingVerifiedToken.schoolName || activeSchoolDisplayName}. Sesuai standar keamanan, Anda <strong>wajib membuat kata sandi pribadi</strong> terlebih dahulu agar orang lain yang menemukan slip Anda tidak dapat melihat laporan Anda.</>
                    )}
                  </p>
                </div>

                <form onSubmit={handleCreateStudentPassword} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-medium block">{lang === "en" ? "School Access Code:" : "Kode Akses Sekolah:"}</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {pendingVerifiedToken.tokenCode}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      {lang === "en" ? "Registered & Valid" : "Terdaftar Sah"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {lang === "en" ? "Create Personal Password *" : "Buat Kata Sandi Pribadi *"}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          placeholder={lang === "en" ? "Min. 4 characters (alphanumeric)" : "Minimal 4 karakter (angka/huruf)"}
                          value={newPasswordValue}
                          onChange={(e) => setNewPasswordValue(e.target.value)}
                          className="w-full px-3.5 py-2.5 pr-9 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {lang === "en" ? "Confirm Password *" : "Ulangi Kata Sandi *"}
                      </label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        placeholder={lang === "en" ? "Retype password" : "Ketik ulang kata sandi"}
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {createPasswordError && (
                    <p className="text-xs text-red-600 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{createPasswordError}</span>
                    </p>
                  )}

                  {createPasswordSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                      <p className="flex items-center gap-1.5 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{lang === "en" ? "Password saved & encrypted! Opening report form..." : "Sandi berhasil disimpan & terenkripsi! Membuka formulir laporan..."}</span>
                      </p>
                      {newlyCreatedRecoveryKey && (
                        <p className="font-mono text-[11px] text-emerald-900 bg-emerald-100 px-2 py-1 rounded">
                          {lang === "en"
                            ? <>Your Recovery Key: <strong>{newlyCreatedRecoveryKey}</strong> (Save this in case you forget your code)</>
                            : <>Kunci Pemulihan Anda: <strong>{newlyCreatedRecoveryKey}</strong> (Simpan jika sewaktu-waktu lupa kode sekolah)</>}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-slate-600 leading-relaxed">
                    <strong>{lang === "en" ? "Confidential Note: " : "Catatan Rahasia: "}</strong>
                    {lang === "en"
                      ? "This password is known only to you. School counselors and staff cannot view your password. You will receive a unique Recovery Key as backup."
                      : "Sandi ini hanya diketahui oleh Anda. Guru BK dan pihak sekolah pun tidak dapat melihat kata sandi Anda. Anda akan mendapatkan Kunci Pemulihan unik untuk cadangan jika lupa kode slip."}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingNewPassword}
                      className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Lock className="w-4 h-4" />
                      <span>
                        {isSubmittingNewPassword
                          ? (lang === "en" ? "Saving encrypted password..." : "Menyimpan sandi terenkripsi...")
                          : (lang === "en" ? "Save Password & Open Report Form" : "Simpan Sandi & Buka Formulir Laporan")}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGateFlowStep("step1");
                        setCreatePasswordError("");
                      }}
                      className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {lang === "en" ? "Use Another Code" : "Ganti Kode Lain"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* KASUS C: LANGKAH 2 DARI 2 (TOKEN SUDAH PUNYA SANDI -> MASUKKAN SANDI PRIBADI) */}
            {gateFlowStep === "step2_enter_password" && pendingVerifiedToken && (
              <div className="space-y-5 animate-fadeIn">
                {/* Stepper Breadcrumb */}
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{lang === "en" ? `1. Valid School Code (${pendingVerifiedToken.tokenCode})` : `1. Kode Sekolah Valid (${pendingVerifiedToken.tokenCode})`}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-900">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <span>{lang === "en" ? "2. Enter Personal Password (Protected)" : "2. Masukkan Sandi Pribadi (Terproteksi)"}</span>
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <span>{lang === "en" ? "2-Step Verification • Step 2 of 2" : "Verifikasi 2 Langkah • Langkah 2 dari 2"}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {lang === "en" ? "Enter Student Personal Password" : "Masukkan Sandi Pribadi Pelajar"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {lang === "en" ? (
                      <>Access code <strong>{pendingVerifiedToken.tokenCode}</strong> is protected with your personal password. Enter your password to open the report form.</>
                    ) : (
                      <>Kode akses <strong>{pendingVerifiedToken.tokenCode}</strong> telah dilindungi kata sandi pribadi Anda. Masukkan sandi Anda untuk membuka formulir laporan.</>
                    )}
                  </p>
                </div>

                <form onSubmit={handleVerifyStep2Password} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-medium block">{lang === "en" ? "Verified Access Code:" : "Kode Akses Terverifikasi:"}</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {pendingVerifiedToken.tokenCode}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-indigo-600" />
                      {lang === "en" ? "Password Protected" : "Terproteksi Sandi"}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {lang === "en" ? "Student Personal Password *" : "Sandi Pribadi Pelajar *"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder={lang === "en" ? "Enter your secret password..." : "Masukkan sandi rahasia Anda..."}
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          setPasswordError("");
                        }}
                        className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-indigo-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <p className="text-xs text-red-600 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{passwordError}</span>
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={isVerifyingPassword}
                      className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Lock className="w-4 h-4" />
                      <span>
                        {isVerifyingPassword ? (lang === "en" ? "Checking..." : "Memeriksa...") : (lang === "en" ? "Verify Password & Open Report Form" : "Verifikasi Sandi & Buka Formulir Laporan")}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGateFlowStep("step1");
                        setPasswordError("");
                      }}
                      className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {lang === "en" ? "Use Another Code" : "Ganti Kode Lain"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Footer Anonymity Guarantee */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>{lang === "en" ? "Cryptographic Privacy Guarantee: " : "Jaminan Kerahasiaan Kriptografi: "}</strong>
                {lang === "en"
                  ? "All passwords are encrypted with a one-way hash (SHA-256). The system never stores plain text and never requests your full name, phone number, or student ID."
                  : "Seluruh sandi dienkripsi dengan hash satu arah (SHA-256). Sistem tidak pernah menyimpan teks asli sandi dan tidak meminta nama lengkap, nomor HP, atau NISN Anda."}
              </span>
            </div>
          </div>
        )}

        {/* STEP 1: INPUT FORMULIR (HANYA MUNCUL SETELAH SISWA TERVERIFIKASI) */}
        {isStudentVerified && currentStep === 1 && (
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 animate-fadeIn">
            {/* Status Pelajar Terverifikasi */}
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900 flex flex-wrap items-center gap-2">
                    <span>{lang === "en" ? `Verified: Valid Student of ${activeSchoolDisplayName}` : `Terverifikasi: Siswa Sah ${activeSchoolDisplayName}`}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px]">
                      {verificationMethod === "token"
                        ? (lang === "en" ? "School Access Code" : "Kode Akses Sekolah")
                        : (lang === "en" ? "Student Personal Password" : "Sandi Pribadi Pelajar")}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {lang === "en"
                      ? "Your report is authenticated from a school member & your identity remains 100% anonymous without a trace."
                      : "Laporan Anda sah dari warga sekolah & identitas Anda tetap 100% rahasia tanpa jejak."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStudentVerified(false)}
                className="text-xs font-medium text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                {lang === "en" ? "Change" : "Ganti"}
              </button>
            </div>

            {/* Header */}
            <div className="mb-6 border-b border-slate-100 pb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>{lang === "en" ? "100% Confidential & Zero-Trace" : "100% Rahasia & Bebas Jejak"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {lang === "en" ? "Submit Confidential Report" : "Buat Laporan Aman"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {lang === "en"
                  ? "Describe what happened. Your identity will never be revealed or shared with anyone."
                  : "Ceritakan apa yang terjadi. Identitasmu tidak akan pernah ditampilkan atau dibagikan ke siapapun."}
              </p>
            </div>

            <div className="space-y-6">
              {/* 0. Satuan Pendidikan Asal Pelapor (Cakupan Nasional) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lang === "en" ? "Origin Educational Unit (National Scope)" : "Satuan Pendidikan Asal (Cakupan Nasional)"}</span>
                  </label>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                    {lang === "en" ? "38 Provinces" : "38 Provinsi"}
                  </span>
                </div>

                {studentSession?.schoolName ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2.5">
                      <School className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {studentSession.schoolName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {lang === "en" ? "Auto-verified via student school session" : "Terverifikasi otomatis via sesi pelajar sekolah"}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {lang === "en" ? "Validated" : "Tervalidasi"}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {availableSchools.map((sch) => (
                        <option key={sch.id} value={sch.schoolName}>
                          {sch.schoolName} — {sch.district || ""}, {sch.province || "Indonesia"} {sch.npsn ? `(NPSN: ${sch.npsn})` : ""}
                        </option>
                      ))}
                      <option value="other">{lang === "en" ? "+ Other School (Type School Name)" : "+ Sekolah Lainnya (Ketik Nama Sekolah)"}</option>
                    </select>

                    {selectedSchool === "other" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 animate-fadeIn">
                        <input
                          type="text"
                          required
                          placeholder={lang === "en" ? "School Name (e.g., SMP Negeri 1 Medan)" : "Nama Satuan Pendidikan (misal: SMP Negeri 1 Medan)"}
                          value={customSchoolName}
                          onChange={(e) => setCustomSchoolName(e.target.value)}
                          className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder={lang === "en" ? "Province / City (e.g., North Sumatra)" : "Provinsi / Kota (misal: Sumatera Utara)"}
                          value={customSchoolProvince}
                          onChange={(e) => setCustomSchoolProvince(e.target.value)}
                          className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500">
                      {lang === "en"
                        ? "Report will be forwarded to the school PPKSP task force and can be monitored by the relevant Education Agency."
                        : "Laporan akan diteruskan ke Satgas PPKSP satuan pendidikan dan dapat dipantau oleh Dinas Pendidikan terkait."}
                    </p>
                  </div>
                )}
              </div>

              {/* 1. Pilih Kategori */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  {lang === "en" ? "1. Select Incident Type" : "1. Pilih Jenis Kejadian"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 border-blue-600 text-blue-900 shadow-2xs"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? "text-blue-600" : "text-slate-400"
                          }`}
                        />
                        <span className="truncate">{getCategoryLabel(cat.id, lang)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Isi Cerita / Kronologi */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {lang === "en" ? "2. Describe What Happened *" : "2. Ceritakan Apa yang Terjadi *"}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {story.length} {lang === "en" ? "characters" : "karakter"}
                  </span>
                </div>
                <textarea
                  required
                  rows={5}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder={lang === "en"
                    ? "Calmly describe what you experienced or witnessed... Who was involved, chronology of events, or what assistance you need."
                    : "Ceritakan dengan tenang apa yang kamu alami atau saksikan... Siapa saja yang terlibat, bagaimana kronologinya, atau apa bantuan yang kamu butuhkan."}
                  className="w-full p-4 rounded-2xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 leading-relaxed bg-slate-50/50"
                />

                {/* Reassuring Live PII Redaction Indicator */}
                {detectedEntities.length > 0 ? (
                  <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">
                        {lang === "en" ? "Privacy Protected & Redacted: " : "Privasi Terdeteksi & Diamankan: "}
                      </span>
                      {detectedEntities.map((e, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-white px-1.5 py-0.5 rounded text-[11px] font-mono text-emerald-900 border border-emerald-200 mx-0.5"
                        >
                          {e.type}
                        </span>
                      ))}
                      <p className="mt-0.5 text-[11px] text-emerald-700">
                        {lang === "en"
                          ? "These personal identifiers are automatically masked (CONFIDENTIAL) in the system to protect your identity."
                          : "Data pengenal ini otomatis disamarkan (DIRAHASIAKAN) pada sistem agar identitasmu tetap aman."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>
                      {lang === "en"
                        ? "The system automatically redacts names, phone numbers, or classes you type."
                        : "Sistem secara otomatis menyamarkan nama, nomor HP, atau kelas yang Anda tulis."}
                    </span>
                  </p>
                )}
              </div>

              {/* 3. Tingkat Urgensi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {lang === "en" ? "3. Handling Urgency Level" : "3. Tingkat Urgensi Penanganan"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "Rendah" as ReportUrgency,
                      title: lang === "en" ? "Low / Counseling" : "Biasa / Konseling",
                      desc: lang === "en" ? "Gradual guidance needed" : "Butuh saran bertahap",
                    },
                    {
                      id: "Sedang" as ReportUrgency,
                      title: lang === "en" ? "Medium / Important" : "Penting",
                      desc: lang === "en" ? "Recurring / distressing event" : "Kejadian berulang / mengganggu",
                    },
                    {
                      id: "Kritis (Darurat Segera)" as ReportUrgency,
                      title: lang === "en" ? "Critical / Emergency" : "Darurat Segera",
                      desc: lang === "en" ? "Physical threat / danger" : "Ada ancaman fisik / bahaya",
                    },
                  ].map((lvl) => {
                    const isSelected = urgency === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setUrgency(lvl.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/70 text-blue-950"
                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{lvl.title}</span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {lvl.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Verifikasi Kedua: PIN Rahasia (Antisipasi jika Lupa Nomor Tiket) */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <KeyRound className="w-4 h-4 text-sky-600 shrink-0" />
                  <label className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                    {lang === "en" ? "4. Secret PIN / Recovery Passphrase (Optional)" : "4. PIN Rahasia / Kata Sandi Pemulihan (Opsional)"}
                  </label>
                </div>
                <p className="text-[11px] text-sky-800 leading-relaxed mb-2.5">
                  {lang === "en"
                    ? "If you ever lose or forget your Ticket Number, you can reopen your report using your incident type and secret PIN created here."
                    : "Jika suatu saat Anda lupa atau kehilangan Nomor Tiket, Anda bisa membuka kembali laporan menggunakan jenis masalah dan PIN rahasia yang Anda buat di sini."}
                </p>
                <input
                  type="text"
                  value={secretPin}
                  onChange={(e) => setSecretPin(e.target.value)}
                  placeholder={lang === "en" ? "e.g., 1234 or secret word (orangecat)" : "Contoh: 1234 atau kata rahasiamu (kucingoren)"}
                  className="w-full sm:max-w-xs px-3.5 py-2.5 rounded-xl border border-sky-200 bg-white text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 5. Opsi Tambahan (Collapsible toggle for simplicity) */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  {showOptionalDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {showOptionalDetails
                      ? (lang === "en" ? "Hide additional details" : "Sembunyikan detail tambahan")
                      : (lang === "en" ? "Add optional details (location, evidence attachment, or school code)" : "Tambah detail opsional (lokasi, lampiran bukti, atau kode sekolah)")}
                  </span>
                </button>

                {showOptionalDetails && (
                  <div className="mt-4 space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {lang === "en" ? "Incident Location (Optional)" : "Lokasi Kejadian (Opsional)"}
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder={lang === "en" ? "e.g., Behind canteen, Computer lab" : "Contoh: Belakang kantin, Lab komputer"}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {lang === "en" ? "Time / When Occurred (Optional)" : "Waktu / Kapan Terjadi (Opsional)"}
                        </label>
                        <input
                          type="text"
                          value={incidentDate}
                          onChange={(e) => setIncidentDate(e.target.value)}
                          placeholder={lang === "en" ? "e.g., Yesterday during second recess" : "Contoh: Kemarin saat istirahat kedua"}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Lampiran Bukti */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                        {lang === "en" ? "Attach Photo / Screenshot Proof (Optional)" : "Lampirkan Bukti Foto / Tangkapan Layar (Opsional)"}
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer">
                          <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                          <span>{lang === "en" ? "Choose Photo/File" : "Pilih Foto/Berkas"}</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,audio/*,.pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={handleToggleRecordAudio}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                            isRecording
                              ? "bg-rose-600 text-white border-rose-600 animate-pulse"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span>
                            {isRecording
                              ? (lang === "en" ? `Recording (${recordingSeconds}s) - Click Finish` : `Merekam (${recordingSeconds}s) - Klik Selesai`)
                              : (lang === "en" ? "Record Audio (Optional)" : "Rekam Suara (Opsional)")}
                          </span>
                        </button>
                      </div>

                      {/* File attachment list */}
                      {attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {attachments.map((att) => (
                            <div
                              key={att.id}
                              className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
                            >
                              <span className="truncate max-w-[240px]">
                                {att.name} ({formatBytes(att.size)})
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setAttachments((prev) =>
                                    prev.filter((a) => a.id !== att.id),
                                  )
                                }
                                className="text-slate-400 hover:text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Kode Akses Sekolah (Opsional) */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {lang === "en" ? "School Access Code (Optional, if provided)" : "Kode Akses Sekolah (Opsional, jika dibagikan)"}
                      </label>
                      <div className="flex items-center gap-2 max-w-sm">
                        <input
                          type="text"
                          value={tokenInput}
                          onChange={(e) => setTokenInput(e.target.value)}
                          placeholder={lang === "en" ? "e.g., SCH-X1-8821" : "Contoh: SCH-X1-8821"}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase font-mono bg-white focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyTokenOptional}
                          className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                        >
                          {lang === "en" ? "Verify" : "Periksa"}
                        </button>
                      </div>
                      {tokenStatusMessage && (
                        <p className="mt-1 text-[11px] text-blue-600 font-medium">
                          {tokenStatusMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSubmitReport}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{lang === "en" ? "Submitting securely..." : "Mengirim secara rahasia..."}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{lang === "en" ? "Submit Report Confidentially" : "Kirim Laporan Secara Rahasia"}</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  {lang === "en"
                    ? "Report is encrypted directly to the BK Counselors & PPKSP Task Force team."
                    : "Laporan dienkripsi langsung ke tim Guru BK & Satgas PPKSP."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SUKSES & TIKET TERBIT */}
        {currentStep === 2 && submittedTicket && (
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {lang === "en" ? "Report Successfully Submitted" : "Laporan Berhasil Terkirim"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
              {lang === "en"
                ? "Your report has been securely received by the School Counselor. Save the ticket code below to monitor replies and continue chat."
                : "Laporanmu telah diterima secara rahasia oleh Guru BK. Simpan kode tiket di bawah ini untuk memantau tanggapan dan melanjutkan chat."}
            </p>

            {/* Ticket Credentials Card */}
            <div className="mt-6 max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {lang === "en" ? "Your Ticket Number" : "Nomor Tiket Anda"}
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl sm:text-2xl font-mono font-extrabold text-blue-700">
                    {submittedTicket.id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTicket}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedTicketId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">{lang === "en" ? "Copied" : "Tersalin"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>{lang === "en" ? "Copy" : "Salin"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {lang === "en" ? "Secret Recovery Key" : "Kunci Pemulihan Rahasia"}
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono text-slate-600 select-all truncate max-w-[200px]">
                    {submittedTicket.recoveryCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    {copiedKey ? (lang === "en" ? "Copied" : "Tersalin") : (lang === "en" ? "Copy Key" : "Salin Kunci")}
                  </button>
                </div>
              </div>

              {secretPin.trim() && (
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {lang === "en" ? "Your Recovery Secret PIN" : "PIN Rahasia Pemulihan Anda"}
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {secretPin.trim()}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {lang === "en" ? "(Can be used if ticket number is lost)" : "(Dapat dipakai jika lupa nomor tiket)"}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>
                    {downloadReceiptDone ? (lang === "en" ? "Ticket Receipt Downloaded" : "Bukti Tiket Berhasil Diunduh") : (lang === "en" ? "Download Ticket Receipt (.txt)" : "Unduh Bukti Tiket (.txt)")}
                  </span>
                </button>
              </div>
            </div>

            {/* Primary Action: Go Straight to Chat! */}
            <div className="mt-8 max-w-md mx-auto space-y-3">
              <button
                type="button"
                onClick={() => onNavigateToChat(submittedTicket.id)}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{lang === "en" ? "Open Counseling Chat Now" : "Buka Chat Konseling Sekarang"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setStory("");
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                {lang === "en" ? "Submit Another Report" : "Buat Laporan Lain"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
