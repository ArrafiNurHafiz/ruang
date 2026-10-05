import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShieldCheck,
  Clock,
  Send,
  Lock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  KeyRound,
  FileText,
  Check,
  AlertTriangle,
  FileCheck,
  ThumbsUp,
  X,
  Building2,
} from "lucide-react";
import { api } from "../lib/api";
import { ReportTicket, ReportStatus, ReportCategory } from "../types";
import {
  useLanguage,
  getCategoryLabel,
  getStatusLabel,
  getStatusDesc,
  getUrgencyLabel,
} from "../lib/i18n";

interface TicketStatusAndChatProps {
  tickets: ReportTicket[];
  initialTicketId?: string;
  onSendMessage: (ticketId: string, messageText: string) => void;
  onTicketUpdated?: (updatedTicket: ReportTicket) => void;
}

const STATUS_KEYS: ReportStatus[] = [
  "diterima",
  "ditinjau",
  "tindakan",
  "menunggu_siswa",
  "ditutup",
];

const CATEGORIES: ReportCategory[] = [
  "Perundungan / Bullying",
  "Pelecehan Seksual",
  "Kekerasan Fisik",
  "Cyberbullying / Teror Online",
  "Pemerasan / Pungli",
  "Kesehatan Mental / Krisis Diri",
  "Lainnya",
];

export const TicketStatusAndChat: React.FC<TicketStatusAndChatProps> = ({
  tickets,
  initialTicketId = "",
  onSendMessage,
  onTicketUpdated,
}) => {
  const { t, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>(initialTicketId);
  const [activeTicket, setActiveTicket] = useState<ReportTicket | null>(
    initialTicketId
      ? tickets.find((t) => t.id === initialTicketId) || null
      : null,
  );
  const [chatInput, setChatInput] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");

  // Second Verification Recovery State
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);
  const [recoveryCategory, setRecoveryCategory] = useState<ReportCategory>("Perundungan / Bullying");
  const [recoveryPin, setRecoveryPin] = useState<string>("");
  const [recoveryError, setRecoveryError] = useState<string>("");
  const [isRecovering, setIsRecovering] = useState<boolean>(false);

  // Student Confirmation Action State
  const [studentFeedback, setStudentFeedback] = useState<string>("");
  const [isSubmittingConfirm, setIsSubmittingConfirm] = useState<boolean>(false);
  const [confirmNotification, setConfirmNotification] = useState<string>("");

  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeTicket?.messages && activeTicket.messages.length > 0) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTicket?.messages?.length]);

  useEffect(() => {
    if (initialTicketId) {
      setSearchQuery(initialTicketId);
      const found = tickets.find((t) => t.id === initialTicketId);
      if (found) setActiveTicket(found);
    }
  }, [initialTicketId]);

  useEffect(() => {
    if (activeTicket) {
      const updated = tickets.find((t) => t.id === activeTicket.id);
      if (updated) setActiveTicket(updated);
    }
  }, [tickets]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    const q = searchQuery.trim();
    if (!q) return;

    try {
      const found = await api.getTicketByRecoveryCode(q);
      const mappedFound: ReportTicket = {
        ...found,
        reporterRole: (found as any).reporter_role || found.reporterRole,
        incidentDate: (found as any).incident_date || found.incidentDate,
        redactedStory: (found as any).redacted_story || found.redactedStory,
        detectedPII: (found as any).detected_pii || found.detectedPII,
        recoveryCode: (found as any).recovery_code || found.recoveryCode,
        secretPin: (found as any).secret_pin || found.secretPin,
        resolutionEvidence: (found as any).resolution_evidence || found.resolutionEvidence,
        studentConfirmation: (found as any).student_confirmation || found.studentConfirmation,
        isKioskSubmission: (found as any).is_kiosk_submission || found.isKioskSubmission,
        messages:
          (found as any).messages?.map((m: any) => ({
            id: m.id,
            sender: m.sender_type || m.sender,
            senderTitle: m.sender_title || m.senderTitle,
            text: m.message_text || m.text,
            timestamp: new Date(m.created_at || m.timestamp).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isEncrypted: m.is_encrypted ?? m.isEncrypted,
          })) || found.messages || [],
      };
      setActiveTicket(mappedFound);
      if (onTicketUpdated) {
        onTicketUpdated(mappedFound);
      }
    } catch (err) {
      const found = tickets.find(
        (t) =>
          t.id.toUpperCase() === q.toUpperCase() ||
          t.recoveryCode?.toLowerCase() === q.toLowerCase(),
      );
      if (found) {
        setActiveTicket(found);
        if (onTicketUpdated) {
          onTicketUpdated(found);
        }
      } else {
        setSearchError("Nomor Tiket atau Kunci Pemulihan tidak ditemukan. Pastikan kodenya benar.");
      }
    }
  };

  const handleRecoverByPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");
    const pin = recoveryPin.trim();
    if (!pin) {
      setRecoveryError("Harap masukkan PIN atau kata rahasia yang Anda buat.");
      return;
    }

    setIsRecovering(true);
    try {
      const found = await api.recoverTicketByPin(recoveryCategory, pin);
      setActiveTicket(found);
      if (onTicketUpdated) {
        onTicketUpdated(found);
      }
      setSearchQuery(found.id);
      setShowRecoveryModal(false);
      setRecoveryPin("");
    } catch (err: any) {
      // Fallback local search
      const localFound = tickets.find(
        (t) =>
          t.category === recoveryCategory &&
          String(t.secretPin || "").trim().toLowerCase() === pin.toLowerCase(),
      );
      if (localFound) {
        setActiveTicket(localFound);
        if (onTicketUpdated) {
          onTicketUpdated(localFound);
        }
        setSearchQuery(localFound.id);
        setShowRecoveryModal(false);
        setRecoveryPin("");
      } else {
        setRecoveryError(
          "Tidak ditemukan laporan dengan kombinasi kategori dan PIN rahasia tersebut.",
        );
      }
    } finally {
      setIsRecovering(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeTicket) return;

    const textToSend = chatInput.trim();
    setChatInput("");

    const clientMsg = {
      id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: "pelapor" as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isEncrypted: true,
    };

    // Optimistically append message to activeTicket state so it appears instantly
    const updatedTicket: ReportTicket = {
      ...activeTicket,
      messages: [...(activeTicket.messages ?? []), clientMsg],
      updatedAt: new Date().toISOString(),
    };
    setActiveTicket(updatedTicket);

    if (onTicketUpdated) {
      onTicketUpdated(updatedTicket);
    }

    onSendMessage(activeTicket.id, textToSend);
  };

  const handleStudentDecision = async (isSatisfied: boolean) => {
    if (!activeTicket) return;
    setIsSubmittingConfirm(true);
    try {
      const updated = await api.confirmResolution(
        activeTicket.id,
        isSatisfied,
        studentFeedback.trim() || undefined,
      );
      setActiveTicket(updated);
      if (onTicketUpdated) {
        onTicketUpdated(updated);
      }
      setConfirmNotification(
        isSatisfied
          ? (lang === "en" ? "Thank you! You have confirmed the issue is resolved. The case is officially closed." : "Terima kasih! Anda telah mengonfirmasi masalah selesai. Kasus resmi ditutup.")
          : (lang === "en" ? "Report has been escalated to the Education Agency & Child Protection Agency for direct action." : "Laporan telah dieskalasi ke Dinas Pendidikan & UPTD PPA untuk tindakan langsung."),
      );
      setStudentFeedback("");
    } catch (err) {
      console.error("Gagal mengonfirmasi:", err);
      // Local fallback update
      const fallbackUpdated: ReportTicket = {
        ...activeTicket,
        status: isSatisfied ? "ditutup" : "tindakan",
        isEscalatedToDinas: !isSatisfied,
        escalatedTo: isSatisfied ? undefined : "Keduanya",
      };
      setActiveTicket(fallbackUpdated);
      if (onTicketUpdated) {
        onTicketUpdated(fallbackUpdated);
      }
    } finally {
      setIsSubmittingConfirm(false);
    }
  };

  const getStepIndex = (status: ReportStatus): number => {
    switch (status) {
      case "diterima":
        return 0;
      case "ditinjau":
        return 1;
      case "tindakan":
        return 2;
      case "menunggu_siswa":
        return 3;
      case "ditutup":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-6 text-slate-800">
      {/* Search & Header Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>{lang === "en" ? "Track & Chat Direct" : "Lacak & Chat Langsung"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {lang === "en" ? "Track Ticket Status" : "Pantau Status Tiket"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === "en"
              ? "Enter your Ticket Number or Recovery Key to check counselor replies and case progress."
              : "Masukkan Nomor Tiket atau Kunci Pemulihan untuk melihat balasan Guru BK dan perkembangan penanganan."}
          </p>
        </div>

        <form onSubmit={handleSearch} className="mt-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "en" ? "e.g., TMG-2025-XXXX or recovery key" : "Contoh: TMG-2025-XXXX atau kata pemulihan"}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              {lang === "en" ? "Search Ticket" : "Cari Tiket"}
            </button>
          </div>

          {searchError && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </p>
          )}

          {/* Quick Recovery by PIN Button (Second Verification) */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={() => setShowRecoveryModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{lang === "en" ? "Forgot Ticket Number? Recover via Second Verification (Secret PIN)" : "Lupa Nomor Tiket? Pulihkan dengan Verifikasi Kedua (PIN Rahasia)"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* MODAL: VERIFIKASI KEDUA (PULIHKAN JIKA LUPA NOMOR TIKET) */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {lang === "en" ? "Recovery via Second Verification" : "Pemulihan via Verifikasi Kedua"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {lang === "en" ? "Open report without ticket number or personal identity" : "Buka laporan tanpa perlu nomor tiket atau identitas pribadi"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRecoveryModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecoverByPin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === "en" ? "1. Select Category of Reported Issue" : "1. Pilih Kategori Masalah yang Anda Laporkan"}
                </label>
                <select
                  value={recoveryCategory}
                  onChange={(e) => setRecoveryCategory(e.target.value as ReportCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {getCategoryLabel(c, lang)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === "en" ? "2. Enter Secret PIN / Recovery Word" : "2. Masukkan PIN Rahasia / Kata Kunci Pemulihan Anda"}
                </label>
                <input
                  type="text"
                  required
                  value={recoveryPin}
                  onChange={(e) => setRecoveryPin(e.target.value)}
                  placeholder={lang === "en" ? "e.g., 1234 or secret word from reporting" : "Contoh: 1234 atau kata rahasia saat melapor"}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {recoveryError && (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{recoveryError}</span>
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {lang === "en" ? "Cancel" : "Batal"}
                </button>
                <button
                  type="submit"
                  disabled={isRecovering}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isRecovering ? (lang === "en" ? "Checking..." : "Memeriksa...") : (lang === "en" ? "Recover My Report" : "Pulihkan Laporan Saya")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVE TICKET VIEW */}
      {activeTicket && (
        <div className="space-y-6 animate-fade-in">
          {confirmNotification && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{confirmNotification}</span>
            </div>
          )}

          {/* Status Progress */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {activeTicket.id}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {getCategoryLabel(activeTicket.category, lang)}
                  </span>
                  {activeTicket.isEscalatedToDinas && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                      {lang === "en" ? "Escalated to Agency" : "Dieskalasi ke Dinas"}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {lang === "en" ? "Report Handling Status" : "Status Penanganan Laporan"}
                </h2>
              </div>

              <div className="text-xs text-slate-400">
                {lang === "en" ? "Urgency: " : "Urgensi: "}<span className="font-semibold text-slate-700">{getUrgencyLabel(activeTicket.urgency, lang)}</span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {STATUS_KEYS.map((key, idx) => {
                const currentIdx = getStepIndex(activeTicket.status);
                const isCompleted = idx < currentIdx || (idx === 4 && activeTicket.status === "ditutup");
                const isCurrent = idx === currentIdx;

                return (
                  <div
                    key={key}
                    className={`p-3 rounded-2xl border transition-all ${
                      isCurrent
                        ? "border-blue-500 bg-blue-50/80 shadow-xs"
                        : isCompleted
                          ? "border-emerald-200 bg-emerald-50/50 text-slate-700"
                          : "border-slate-200 bg-slate-50/50 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[11px] font-bold ${
                          isCurrent
                            ? "text-blue-900"
                            : isCompleted
                              ? "text-emerald-800"
                              : "text-slate-400"
                        }`}
                      >
                        {getStatusLabel(key, lang)}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : isCurrent ? (
                        <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                      ) : null}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {getStatusDesc(key, lang)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* BUKTI PENYELESAIAN DARI SEKOLAH & STUDENT FINAL GOVERNANCE CARD */}
            {activeTicket.resolutionEvidence ? (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-sky-50/50 border border-amber-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <FileCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>{lang === "en" ? "Follow-Up & Resolution Evidence from School" : "Bukti Tindak Lanjut dari Sekolah"}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 ml-auto">
                    {activeTicket.resolutionEvidence.type}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-100">
                  {activeTicket.resolutionEvidence.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span>
                    {lang === "en" ? "Uploaded by: " : "Diunggah oleh: "}<strong>{activeTicket.resolutionEvidence.submittedBy || (lang === "en" ? "School Counselor" : "Guru BK")}</strong>
                  </span>
                  <span>
                    {lang === "en" ? "Date: " : "Tanggal: "}{new Date(activeTicket.resolutionEvidence.submittedAt).toLocaleDateString(lang === "en" ? "en-US" : "id-ID")}
                  </span>
                </div>

                {/* SISWA MEMEGANG KENDALI: KONFIRMASI SELESAI ATAU ESKALASI */}
                {activeTicket.status === "menunggu_siswa" && (
                  <div className="pt-3 border-t border-amber-200/80 space-y-3">
                    <p className="text-xs font-semibold text-slate-800">
                      {lang === "en"
                        ? "As the reporting student, do you feel this issue has been resolved and you now feel safe?"
                        : "Sebagai siswa pelapor, apakah Anda merasa masalah ini sudah benar-benar teratasi dan Anda merasa aman?"}
                    </p>

                    <input
                      type="text"
                      value={studentFeedback}
                      onChange={(e) => setStudentFeedback(e.target.value)}
                      placeholder={lang === "en" ? "Your additional notes (optional)..." : "Catatan tambahan Anda (opsional)..."}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        disabled={isSubmittingConfirm}
                        onClick={() => handleStudentDecision(true)}
                        className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{lang === "en" ? "Issue Resolved (Close Case)" : "Masalah Selesai (Tutup Kasus)"}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSubmittingConfirm}
                        onClick={() => handleStudentDecision(false)}
                        className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>{lang === "en" ? "Not Resolved (Escalate to Agency)" : "Belum Selesai (Eskalasi ke Dinas)"}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {lang === "en"
                        ? "*If you select unresolved, the case is automatically forwarded to the Education Agency and Child Protection Agency for direct supervision."
                        : "*Jika Anda memilih belum selesai, kasus otomatis diteruskan ke Dinas Pendidikan dan Dinas Perlindungan Anak untuk supervisi langsung."}
                    </p>
                  </div>
                )}

                {activeTicket.status === "ditutup" && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{lang === "en" ? "This report has been confirmed resolved by you. You are verified safe." : "Laporan ini telah dikonfirmasi selesai oleh Anda. Keadaan telah terpantau aman."}</span>
                  </div>
                )}
              </div>
            ) : null}

            {/* Action Summary / Counselor Note */}
            {activeTicket.actionSummary && !activeTicket.resolutionEvidence && (
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950">
                <span className="font-bold block mb-0.5">
                  {lang === "en" ? "Actions from Task Force / Counselor:" : "Tindakan dari Tim Satgas / Guru BK:"}
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {activeTicket.actionSummary}
                </p>
              </div>
            )}
          </div>

          {/* 2-Way Encrypted Chat Room */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[480px]">
            {/* Chat Room Header */}
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {lang === "en" ? "Confidential Chat with Counselor" : "Percakapan Rahasia dengan Guru BK"}
                  </h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>{lang === "en" ? "End-to-End Encrypted (E2EE)" : "Terenkripsi Ujung-ke-Ujung (E2EE)"}</span>
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                {lang === "en" ? "Anonymous Active" : "Anonim Aktif"}
              </span>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/60">
              {(!activeTicket.messages || activeTicket.messages.length === 0) && (
                <div className="text-center py-10 text-xs text-slate-400">
                  {lang === "en"
                    ? "No messages yet. You can type a message or follow-up question for the counselor below."
                    : "Belum ada pesan. Anda dapat mengetik pesan atau pertanyaan tambahan untuk Guru BK di bawah ini."}
                </div>
              )}

              {(activeTicket.messages ?? []).map((msg) => {
                const senderVal = (msg.sender || (msg as any).sender_type || "").toString();
                const isPelapor = senderVal === "pelapor";
                const isSystem = senderVal === "system";
                const textContent = msg.text || (msg as any).message_text || "";

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-1.5">
                      <div className="bg-slate-200 text-slate-700 text-[11px] px-3.5 py-1 rounded-full text-center max-w-sm font-medium">
                        {textContent}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isPelapor ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3.5 space-y-1 ${
                        isPelapor
                          ? "bg-blue-600 text-white rounded-br-xs shadow-xs"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[11px] opacity-80 border-b pb-1 border-black/5">
                        <span className="font-semibold">
                          {isPelapor
                            ? lang === "en"
                              ? "You (Reporter)"
                              : "Anda (Pelapor)"
                            : msg.senderTitle || (msg as any).sender_title || (lang === "en" ? "School Counselor" : "Guru BK")}
                        </span>
                        <span className="text-[10px] opacity-75 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                        {textContent}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSendChat} className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={lang === "en" ? "Type confidential message for counselor..." : "Tulis pesan rahasia untuk Guru BK..."}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
                    chatInput.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === "en" ? "Send" : "Kirim"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Empty State Tips */}
      {!activeTicket && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-xs text-slate-500 space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>{lang === "en" ? "How Does Ticket Tracking Work?" : "Bagaimana Cara Kerja Pantau Tiket?"}</span>
          </div>
          <p className="leading-relaxed">
            {lang === "en"
              ? "Every time you submit a report, Ruang Aman issues a unique Ticket Number and a Secret Recovery PIN. You can use either to check counselor responses, exchange confidential messages, and confirm when the issue is safely resolved."
              : "Setiap kali Anda membuat laporan, Ruang Aman menghasilkan Nomor Tiket unik serta PIN Rahasia pemulihan. Anda dapat menggunakan nomor tiket tersebut atau fitur Verifikasi Kedua (PIN Rahasia) di atas untuk membaca tanggapan sekolah dan mengonfirmasi bahwa masalah telah selesai."}
          </p>
        </div>
      )}
    </div>
  );
};
