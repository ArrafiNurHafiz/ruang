import React, { useState, useEffect } from "react";
import {
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  Sparkles,
  Printer,
  FileCheck,
  X,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  Paperclip,
  Check,
  Copy,
  KeyRound,
  Plus,
  Trash2,
} from "lucide-react";
import {
  ReportTicket,
  CounselorUser,
  ReportStatus,
  SchoolProfile,
  SchoolToken,
} from "../types";
import { api } from "../lib/api";
import { MOCK_COUNSELOR } from "../data/mockData";
import { formatBytes } from "../utils/crypto";
import { OfficialCaseReportModal } from "./OfficialCaseReportModal";
import { PrintTokenSlipsModal } from "./PrintTokenSlipsModal";

interface AdminCounselorDashboardProps {
  tickets: ReportTicket[];
  loggedCounselor: CounselorUser | null;
  onLogin: (user: CounselorUser) => void;
  onLogout: () => void;
  onUpdateTicketStatus: (
    ticketId: string,
    status: ReportStatus,
    actionSummary?: string,
  ) => void;
  onAddCounselorNote: (ticketId: string, note: string) => void;
  onCounselorReply: (ticketId: string, text: string) => void;
  onEscalateTicket?: (
    ticketId: string,
    target: "Dinas Pendidikan" | "Dinas Perlindungan (UPTD PPA)" | "Keduanya",
    reason: string,
  ) => void;
  onSubmitResolutionEvidence?: (
    ticketId: string,
    evidence: {
      type: string;
      description: string;
      fileUrl?: string;
      submittedBy?: string;
    },
  ) => void;
  onOpenRoleSwitcher?: () => void;
  schoolProfile: SchoolProfile;
  tokens?: SchoolToken[];
  onGenerateBatchTokens?: (
    count: number,
    prefix: string,
    studentLevel?: string,
  ) => Promise<SchoolToken[] | void>;
  onToggleTokenStatus?: (tokenId: string, currentActive?: boolean) => Promise<void>;
  onDeleteToken?: (tokenId: string) => Promise<void>;
}

export const AdminCounselorDashboard: React.FC<AdminCounselorDashboardProps> = ({
  tickets,
  loggedCounselor,
  onLogin,
  onLogout,
  onUpdateTicketStatus,
  onAddCounselorNote,
  onCounselorReply,
  onEscalateTicket,
  onSubmitResolutionEvidence,
  onOpenRoleSwitcher,
  schoolProfile,
  tokens = [],
  onGenerateBatchTokens,
  onToggleTokenStatus,
  onDeleteToken,
}) => {
  // Main Top-level Tab: Laporan Konseling vs Kode Akses Siswa
  const [activeMainTab, setActiveMainTab] = useState<"laporan" | "tokens">("laporan");

  // Token Generator & Table State
  const [batchCount, setBatchCount] = useState(10);
  const [customPrefix, setCustomPrefix] = useState("SCH-X1");
  const [selectedStudentLevel, setSelectedStudentLevel] = useState("Kelas X - MIPA 1");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [searchToken, setSearchToken] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tokenSuccessMsg, setTokenSuccessMsg] = useState("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedToken(code);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleGenerateTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onGenerateBatchTokens) return;
    try {
      setIsGenerating(true);
      await onGenerateBatchTokens(batchCount, customPrefix, selectedStudentLevel);
      setTokenSuccessMsg(`Berhasil men-generate ${batchCount} token untuk ${selectedStudentLevel}`);
      setTimeout(() => setTokenSuccessMsg(""), 3500);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredTokens = (tokens || []).filter((t) => {
    const code = (t.tokenCode ?? (t as any).token_code ?? "").toString().toLowerCase();
    const level = (t.studentLevel ?? "").toLowerCase();
    const query = searchToken.toLowerCase();
    const matchQuery = code.includes(query) || level.includes(query);

    const status = t.status || (t.isActivated ? "Aktif" : "Tersedia");
    if (statusFilter === "all") return matchQuery;
    return matchQuery && status === statusFilter;
  });

  // Active Tab in Case Workspace: 'case' or 'chat'
  const [activePane, setActivePane] = useState<"case" | "chat">("case");

  // Queue Filter: 'all' | 'need_action' | 'done'
  const [queueFilter, setQueueFilter] = useState<"all" | "need_action" | "done">("all");
  const [searchTicket, setSearchTicket] = useState("");

  // Modals
  const [showBapModal, setShowBapModal] = useState(false);
  const [bapSelectedTicket, setBapSelectedTicket] = useState<ReportTicket | null>(null);

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceType, setEvidenceType] = useState("Surat Permintaan Maaf Resmi Pelaku");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [evidenceFileName, setEvidenceFileName] = useState("Surat_Pernyataan_Mediasi.pdf");
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const [evidenceSuccess, setEvidenceSuccess] = useState(false);

  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationTarget, setEscalationTarget] = useState<
    "Dinas Pendidikan" | "Dinas Perlindungan (UPTD PPA)" | "Keduanya"
  >("Dinas Perlindungan (UPTD PPA)");
  const [escalationReason, setEscalationReason] = useState("");
  const [escalationSuccess, setEscalationSuccess] = useState(false);

  // Form Inputs
  const [replyText, setReplyText] = useState("");
  const [internalNoteText, setInternalNoteText] = useState("");

  // Login inputs for manual auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Safe Ticket Array
  const safeTickets = tickets.map((t) => ({
    ...t,
    attachments: t.attachments ?? [],
    messages: t.messages ?? [],
    counselorNotes: t.counselorNotes ?? [],
  }));

  const [selectedTicket, setSelectedTicket] = useState<ReportTicket | null>(
    safeTickets[0] || null,
  );

  useEffect(() => {
    if (selectedTicket) {
      const updated = safeTickets.find((t) => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    } else if (safeTickets.length > 0) {
      setSelectedTicket(safeTickets[0]);
    }
  }, [tickets]);

  // SLA Watchdog (>24 hours and still 'diterima')
  const isDelayedResponse = (ticket: ReportTicket) => {
    if (ticket.status !== "diterima") return false;
    if (!ticket.createdAt) return false;
    const created = new Date(ticket.createdAt).getTime();
    if (isNaN(created)) return false;
    return (Date.now() - created) / (1000 * 60 * 60) >= 24;
  };

  // Filtered Queue
  const filteredTickets = safeTickets.filter((t) => {
    const q = searchTicket.toLowerCase();
    const matchesSearch =
      t.id.toLowerCase().includes(q) ||
      t.story.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);

    let matchesFilter = true;
    if (queueFilter === "need_action") {
      matchesFilter = t.status === "diterima" || t.status === "ditinjau" || t.status === "tindakan";
    } else if (queueFilter === "done") {
      matchesFilter = t.status === "menunggu_siswa" || t.status === "ditutup";
    }

    return matchesSearch && matchesFilter;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    onCounselorReply(selectedTicket.id, replyText.trim());
    setReplyText("");
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !internalNoteText.trim()) return;
    onAddCounselorNote(selectedTicket.id, internalNoteText.trim());
    setInternalNoteText("");
  };

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !escalationReason) return;
    if (onEscalateTicket) {
      onEscalateTicket(selectedTicket.id, escalationTarget, escalationReason);
    }
    setEscalationSuccess(true);
    setTimeout(() => {
      setEscalationSuccess(false);
      setShowEscalationModal(false);
      setEscalationReason("");
    }, 1500);
  };

  const handleSubmitResolutionEvidenceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !evidenceDescription.trim()) return;
    setIsSubmittingEvidence(true);

    try {
      const payload = {
        type: evidenceType,
        description: evidenceDescription.trim(),
        fileUrl: evidenceFileName ? `/evidence/${evidenceFileName}` : undefined,
        submittedBy: loggedCounselor?.name || "Guru BK / Satgas",
      };

      if (onSubmitResolutionEvidence) {
        await onSubmitResolutionEvidence(selectedTicket.id, payload);
      } else {
        await api.submitResolutionEvidence(selectedTicket.id, payload);
        onUpdateTicketStatus(
          selectedTicket.id,
          "menunggu_siswa",
          `Bukti tindak lanjut (${evidenceType}) telah dikirim ke siswa.`,
        );
      }

      setEvidenceSuccess(true);
      setTimeout(() => {
        setEvidenceSuccess(false);
        setShowEvidenceModal(false);
        setEvidenceDescription("");
      }, 1500);
    } catch (err) {
      console.error("Gagal mengirim bukti:", err);
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const res = await api.login({ email, password, role: "guru" });
      onLogin({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.roleTitle,
        nip: res.user.identifier.replace("NIP: ", ""),
        avatar: res.user.avatar,
        schoolName: res.user.organization,
      });
    } catch (err: any) {
      setLoginError(err.message || "Email atau kata sandi tidak sesuai.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 1. UNAUTHENTICATED CLEAN SCREEN
  if (!loggedCounselor) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Portal Guru BK &amp; Satgas</h2>
            <p className="text-xs text-slate-500 mt-1">
              {schoolProfile.schoolName || "SMA Negeri 1 Jakarta"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onLogin(MOCK_COUNSELOR)}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Masuk Langsung (Dra. Hj. Nurjanah)</span>
          </button>

          <div className="relative">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 font-medium relative -top-2.5">
              atau login manual
            </span>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-3 text-left text-xs">
            <input
              type="email"
              required
              placeholder="Email Petugas BK"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            />
            <input
              type="password"
              required
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            />
            {loginError && <p className="text-xs text-rose-600">{loginError}</p>}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl cursor-pointer"
            >
              {isLoggingIn ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. MODERN CLEAN WORKSPACE (LINEAR / STRIPE STYLE)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4 animate-fadeIn">
      {/* Clean Top Status Bar (No dark jumbotron!) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
            BK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 leading-none">
                {loggedCounselor.name}
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                Guru BK / Admin Sekolah
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {schoolProfile.schoolName} • {safeTickets.length} Laporan ({safeTickets.filter(t => t.status === "diterima" || t.status === "tindakan").length} Aktif) • {(tokens || []).length} Kode Akses Siswa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sesi Guru Terhubung</span>
          </span>
        </div>
      </div>

      {/* 2 Clean Tabs: Laporan Konseling & Kode Akses Siswa */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveMainTab("laporan")}
          className={`pb-2.5 px-3 transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeMainTab === "laporan"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Laporan &amp; Konseling Siswa</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px]">
            {safeTickets.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab("tokens")}
          className={`pb-2.5 px-3 transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeMainTab === "tokens"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Kode Akses Siswa</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px]">
            {(tokens || []).length}
          </span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      {activeMainTab === "laporan" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Queue List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Queue Filters & Search */}
          <div className="p-3 border-b border-slate-100 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                placeholder="Cari laporan..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              {[
                { id: "all", label: "Semua" },
                { id: "need_action", label: "Perlu Respon" },
                { id: "done", label: "Selesai" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setQueueFilter(tab.id as any)}
                  className={`flex-1 py-1 px-2 rounded-lg font-semibold transition cursor-pointer text-center text-xs ${
                    queueFilter === tab.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Items List */}
          <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Tidak ada laporan dalam daftar ini.
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                const isCritical = t.urgency === "Kritis" || t.urgency === "Tinggi";
                const delayed = isDelayedResponse(t);

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3.5 transition cursor-pointer text-xs border-l-4 ${
                      isSelected
                        ? "bg-blue-50/60 border-l-blue-600"
                        : "hover:bg-slate-50 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                        <span>{t.id}</span>
                        {isCritical && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Urgensi Tinggi/Kritis" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          t.status === "diterima"
                            ? "bg-amber-100 text-amber-800"
                            : t.status === "ditinjau"
                              ? "bg-blue-100 text-blue-800"
                              : t.status === "tindakan"
                                ? "bg-purple-100 text-purple-800"
                                : t.status === "menunggu_siswa"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {t.status === "menunggu_siswa" ? "Menunggu Siswa" : t.status}
                      </span>
                    </div>

                    {delayed && (
                      <div className="mb-1.5 text-[10px] font-bold text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>Respon terlambat (&gt;24 jam)</span>
                      </div>
                    )}

                    <p className="font-semibold text-slate-800 truncate mb-0.5">{t.category}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{t.redactedStory}</p>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/80 text-[10px] text-slate-400">
                      <span>{t.location}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{t.messages.length}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case Work Desk (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {selectedTicket ? (
            <div>
              {/* Header with Case ID, Action & Tab Toggle */}
              <div className="p-4 border-b border-slate-100 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 font-mono">
                        {selectedTicket.id}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {selectedTicket.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Urgensi: <strong className="text-slate-700">{selectedTicket.urgency}</strong> • Lokasi: {selectedTicket.location}
                    </p>
                  </div>

                  {/* Top Action Workflow */}
                  <div className="flex items-center gap-1.5">
                    {selectedTicket.status === "diterima" && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTicketStatus(
                            selectedTicket.id,
                            "ditinjau",
                            "Laporan mulai ditinjau oleh guru BK.",
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Mulai Tinjau
                      </button>
                    )}

                    {selectedTicket.status === "ditinjau" && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTicketStatus(
                            selectedTicket.id,
                            "tindakan",
                            "Satgas memulai tindakan penanganan dan mediasi.",
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Mulai Mediasi
                      </button>
                    )}

                    {selectedTicket.status !== "ditutup" && selectedTicket.status !== "menunggu_siswa" && (
                      <button
                        type="button"
                        onClick={() => setShowEvidenceModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Kirim Solusi</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setBapSelectedTicket(selectedTicket);
                        setShowBapModal(true);
                      }}
                      title="Cetak Berita Acara (BAP)"
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowEscalationModal(true)}
                      title="Eskalasi ke Dinas"
                      className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2 Clean Tabs (Case Details vs Live Chat) */}
                <div className="flex border-b border-slate-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActivePane("case")}
                    className={`pb-2 px-3 transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
                      activePane === "case"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Detail &amp; Solusi Kasus</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePane("chat")}
                    className={`pb-2 px-3 transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
                      activePane === "chat"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat Rahasia Siswa</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                      {selectedTicket.messages.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* PANE 1: CASE DETAIL */}
              {activePane === "case" && (
                <div className="p-4 space-y-4 text-xs">
                  {/* Status Banner */}
                  {selectedTicket.status === "menunggu_siswa" && (
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Bukti solusi telah diserahkan. Menunggu konfirmasi penutupan dari siswa.</span>
                    </div>
                  )}

                  {selectedTicket.status === "ditutup" && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Kasus ini telah selesai dan dikonfirmasi tuntas oleh siswa.</span>
                    </div>
                  )}

                  {/* Incident Chronology */}
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1">
                      Kronologi Kejadian (Terenkripsi &amp; Disanitasi)
                    </span>
                    <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed">
                      {selectedTicket.redactedStory}
                    </p>
                  </div>

                  {/* Attachments */}
                  {selectedTicket.attachments.length > 0 && (
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1">
                        Lampiran Bukti ({selectedTicket.attachments.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedTicket.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="p-2 rounded-lg border border-slate-200 flex items-center justify-between bg-white text-[11px]"
                          >
                            <span className="truncate font-medium text-slate-700">{att.name}</span>
                            <span className="text-slate-400 font-mono">{formatBytes(att.size)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resolution Evidence Box */}
                  {selectedTicket.resolutionEvidence && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                      <span className="font-bold text-emerald-900 block">Bukti Tindak Lanjut Terkirim:</span>
                      <p className="font-semibold text-slate-800">{selectedTicket.resolutionEvidence.type}</p>
                      <p className="text-slate-600 text-[11px]">{selectedTicket.resolutionEvidence.description}</p>
                    </div>
                  )}

                  {/* Counselor Internal Notes */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                      Catatan Rahasia Satgas (Internal)
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {(selectedTicket.counselorNotes || []).length === 0 ? (
                        <p className="text-slate-400 italic text-[11px]">Belum ada catatan internal.</p>
                      ) : (
                        selectedTicket.counselorNotes.map((n, i) => (
                          <div key={i} className="p-2 rounded-lg bg-amber-50/60 border border-amber-200 text-amber-900 text-[11px]">
                            • {n}
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={internalNoteText}
                        onChange={(e) => setInternalNoteText(e.target.value)}
                        placeholder="Tambah catatan internal..."
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold cursor-pointer"
                      >
                        Simpan
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* PANE 2: CHAT WITH STUDENT */}
              {activePane === "chat" && (
                <div className="flex flex-col h-[480px]">
                  <div className="flex-1 p-3.5 overflow-y-auto space-y-2 bg-slate-50 text-xs">
                    {selectedTicket.messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                        Belum ada pesan chat dengan siswa.
                      </div>
                    ) : (
                      selectedTicket.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex ${m.sender === "counselor" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-2.5 rounded-2xl ${
                              m.sender === "counselor"
                                ? "bg-blue-600 text-white"
                                : m.sender === "system"
                                  ? "bg-slate-200 text-slate-700 text-center w-full text-[10px]"
                                  : "bg-white border border-slate-200 text-slate-800"
                            }`}
                          >
                            <div className="text-[10px] opacity-75 mb-0.5 font-semibold">
                              {m.sender === "counselor" ? "Anda" : m.sender === "pelapor" ? "Siswa (Anonim)" : "Sistem"}
                            </div>
                            <p className="leading-relaxed">{m.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendReply} className="p-2.5 bg-white border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Balas pesan siswa secara aman..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs disabled:opacity-50 cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="p-16 text-center text-xs text-slate-400">
              Pilih salah satu laporan di panel kiri untuk membuka meja kerja.
            </div>
          )}
        </div>
      </div>
      ) : (
        <div className="space-y-4">
          {tokenSuccessMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{tokenSuccessMsg}</span>
            </div>
          )}

          {/* Generator Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Buat Batch Kode Akses Siswa
              </h3>
              <p className="text-xs text-slate-500">
                Sebagai Guru BK / Admin Sekolah, buat kode token rahasia untuk memvalidasi siswa saat melapor anonim tanpa meminta identitas pribadi.
              </p>
            </div>

            <form
              onSubmit={handleGenerateTokens}
              className="flex flex-wrap items-center gap-2 pt-1"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Jumlah:</span>
                <select
                  value={batchCount}
                  onChange={(e) => setBatchCount(parseInt(e.target.value))}
                  className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value={10}>10 Kode</option>
                  <option value={25}>25 Kode</option>
                  <option value={50}>50 Kode</option>
                  <option value={100}>100 Kode (1 Angkatan)</option>
                </select>
              </div>

              <input
                type="text"
                value={customPrefix}
                onChange={(e) => setCustomPrefix(e.target.value)}
                placeholder="Prefix (SCH-X1)"
                className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-mono"
              />

              <input
                type="text"
                value={selectedStudentLevel}
                onChange={(e) => setSelectedStudentLevel(e.target.value)}
                placeholder="Rombel / Kelas (contoh: Kelas X - MIPA 1)"
                className="flex-1 min-w-[160px] p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />

              <button
                type="submit"
                disabled={isGenerating}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Membuat..." : "+ Buat Kode"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Slip Token</span>
              </button>
            </form>
          </div>

          {/* Tokens Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    value={searchToken}
                    onChange={(e) => setSearchToken(e.target.value)}
                    placeholder="Cari kode atau kelas..."
                    className="w-56 pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="all">Semua Status</option>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Aktif">Aktif</option>
                </select>
              </div>

              <span className="text-slate-400 text-[11px]">
                {filteredTokens.length} dari {(tokens || []).length} Kode Akses
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-semibold">
                    <th className="py-2.5 px-3">Kode Token</th>
                    <th className="py-2.5 px-3">Rombel / Jenjang</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTokens.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                        Belum ada kode akses untuk filter ini. Silakan buat kode token baru di atas.
                      </td>
                    </tr>
                  ) : (
                    filteredTokens.slice(0, 50).map((t) => {
                      const code = (t.tokenCode ?? (t as any).token_code ?? "").toString();
                      const status = t.status || (t.isActivated ? "Aktif" : "Tersedia");
                      return (
                        <tr key={code} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{code}</td>
                          <td className="py-2.5 px-3 text-slate-500">{t.studentLevel || "Umum"}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                status === "Aktif"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right space-x-1">
                            <button
                              onClick={() => handleCopy(code)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 cursor-pointer inline-flex items-center justify-center"
                              title="Salin Kode"
                            >
                              {copiedToken === code ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {onToggleTokenStatus && (
                              <button
                                onClick={() => onToggleTokenStatus(code, status === "Aktif")}
                                className="px-2 py-1 text-[10px] font-medium rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              >
                                Ubah Status
                              </button>
                            )}
                            {onDeleteToken && (
                              <button
                                onClick={() => onDeleteToken(code)}
                                className="p-1.5 rounded hover:bg-rose-50 text-rose-500 cursor-pointer inline-flex items-center justify-center"
                                title="Hapus Kode"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Print Slip Modal */}
      {isPrintModalOpen && (
        <PrintTokenSlipsModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          tokens={tokens || []}
          schoolName={schoolProfile.schoolName}
        />
      )}

      {/* Modal Unggah Bukti Penyelesaian */}
      {showEvidenceModal && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 text-xs animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Kirim Bukti Solusi #{selectedTicket.id}</h3>
              <button type="button" onClick={() => setShowEvidenceModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {evidenceSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">Bukti Berhasil Diserahkan</p>
                <p className="text-[11px]">Status berubah menjadi Menunggu Konfirmasi Siswa.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitResolutionEvidenceForm} className="space-y-3">
                <div>
                  <label className="font-semibold block mb-1">Jenis Solusi:</label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Surat Permintaan Maaf Resmi Pelaku">Surat Permintaan Maaf Resmi Pelaku</option>
                    <option value="Berita Acara Mediasi Damai Satgas">Berita Acara Mediasi Damai Satgas</option>
                    <option value="Surat Peringatan & Sanksi Edukatif">Surat Peringatan &amp; Sanksi Edukatif</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Ringkasan Kesepakatan:</label>
                  <textarea
                    rows={3}
                    required
                    value={evidenceDescription}
                    onChange={(e) => setEvidenceDescription(e.target.value)}
                    placeholder="Tuliskan hasil mediasi atau sanksi yang telah disepakati..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEvidenceModal(false)}
                    className="px-3 py-1.5 rounded-xl hover:bg-slate-100 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEvidence}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Kirim Solusi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Eskalasi */}
      {showEscalationModal && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 text-xs animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Eskalasi Kasus #{selectedTicket.id}</h3>
              <button type="button" onClick={() => setShowEscalationModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {escalationSuccess ? (
              <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-rose-600 mx-auto" />
                <p className="font-bold">Eskalasi Terkirim</p>
                <p className="text-[11px]">Instansi terkait telah menerima laporan intervensi.</p>
              </div>
            ) : (
              <form onSubmit={handleEscalateSubmit} className="space-y-3">
                <div>
                  <label className="font-semibold block mb-1">Tujuan Eskalasi:</label>
                  <select
                    value={escalationTarget}
                    onChange={(e) => setEscalationTarget(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Dinas Perlindungan (UPTD PPA)">Dinas Perlindungan (UPTD PPA - Bantuan Hukum &amp; Psikolog)</option>
                    <option value="Dinas Pendidikan">Dinas Pendidikan (Supervisi Wilayah)</option>
                    <option value="Keduanya">Keduanya (Lintas Sektoral)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Alasan Eskalasi:</label>
                  <textarea
                    rows={3}
                    required
                    value={escalationReason}
                    onChange={(e) => setEscalationReason(e.target.value)}
                    placeholder="Tulis alasan eskalasi (misal: korban trauma berat)..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEscalationModal(false)}
                    className="px-3 py-1.5 rounded-xl hover:bg-slate-100 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                  >
                    Kirim Eskalasi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* BAP Modal */}
      <OfficialCaseReportModal
        isOpen={showBapModal}
        onClose={() => setShowBapModal(false)}
        ticket={bapSelectedTicket}
        schoolProfile={schoolProfile}
      />
    </div>
  );
};
