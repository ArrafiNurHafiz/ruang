import React, { useState, useEffect, useRef } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  Printer,
  FileCheck,
  X,
  AlertTriangle,
  ChevronRight,
  Paperclip,
  Check,
  Copy,
  KeyRound,
  Plus,
  Trash2,
  Sparkles,
  Users,
  Filter,
  ArrowUpRight,
  Lock,
  Download,
  Building2,
  Save,
  Phone,
  MapPin,
  School,
  BadgeCheck,
} from "lucide-react";
import {
  ReportTicket,
  CounselorUser,
  ReportStatus,
  SchoolProfile,
  SchoolToken,
} from "../types";
import { formatBytes } from "../utils/crypto";
import { OfficialCaseReportModal } from "./OfficialCaseReportModal";
import { PrintTokenSlipsModal } from "./PrintTokenSlipsModal";

const formatSafeTime = (raw: any): string => {
  if (!raw) return "";
  if (
    typeof raw === "string" &&
    (raw.includes(":") || raw.includes(".")) &&
    !raw.includes("T") &&
    !raw.includes("-")
  ) {
    return raw;
  }
  const d = new Date(raw);
  if (isNaN(d.getTime())) return typeof raw === "string" ? raw : "";
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

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
  schoolProfile: SchoolProfile;
  onUpdateSchoolProfile?: (profile: SchoolProfile) => void;
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
  schoolProfile,
  onUpdateSchoolProfile,
  tokens = [],
  onGenerateBatchTokens,
  onToggleTokenStatus,
  onDeleteToken,
}) => {
  // Main view tab: 'laporan' | 'tokens' | 'profil'
  const [activeMainTab, setActiveMainTab] = useState<"laporan" | "tokens" | "profil">("laporan");

  // Filter state for tickets
  const [statusFilter, setStatusFilter] = useState<"all" | "need_action" | "closed">("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [searchTicket, setSearchTicket] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    tickets[0]?.id || null,
  );

  // Active subtab inside selected case: 'detail' | 'chat' | 'resolution'
  const [caseSubTab, setCaseSubTab] = useState<"detail" | "chat" | "resolution">("detail");
  const counselorChatEndRef = useRef<HTMLDivElement | null>(null);


  // Chat message input & Counselor private note input
  const [replyText, setReplyText] = useState("");
  const [counselorNoteText, setCounselorNoteText] = useState("");
  const [noteSavedMsg, setNoteSavedMsg] = useState("");

  // Resolution & Escalation Modals / Forms
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceType, setEvidenceType] = useState("Surat Permintaan Maaf Resmi Pelaku");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [evidenceFileUrl, setEvidenceFileUrl] = useState("");

  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateTarget, setEscalateTarget] = useState<
    "Dinas Pendidikan" | "Dinas Perlindungan (UPTD PPA)" | "Keduanya"
  >("Dinas Perlindungan (UPTD PPA)");
  const [escalateReason, setEscalateReason] = useState("");

  const [showBapModal, setShowBapModal] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Token Generator State
  const [batchCount, setBatchCount] = useState(10);
  const [customPrefix, setCustomPrefix] = useState("SCH-X1");
  const [selectedStudentLevel, setSelectedStudentLevel] = useState("Kelas X - MIPA 1");
  const [searchToken, setSearchToken] = useState("");
  const [tokenStatusFilter, setTokenStatusFilter] = useState("all");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokenSuccessMsg, setTokenSuccessMsg] = useState("");
  const [tokenErrorMsg, setTokenErrorMsg] = useState("");

  // School Profile (Admin Sekolah) State
  const [profileForm, setProfileForm] = useState<SchoolProfile>(schoolProfile);
  const [profileSavedMsg, setProfileSavedMsg] = useState("");

  useEffect(() => {
    setProfileForm(schoolProfile);
  }, [schoolProfile]);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0] || null;

  useEffect(() => {
    if (caseSubTab === "chat") {
      counselorChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [caseSubTab, selectedTicket?.messages]);

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const q = searchTicket.toLowerCase();
    const matchesSearch =
      (t.id || "").toLowerCase().includes(q) ||
      (t.category || "").toLowerCase().includes(q) ||
      (t.story || "").toLowerCase().includes(q);

    let matchesStatus = true;
    if (statusFilter === "need_action") {
      matchesStatus = t.status === "diterima" || t.status === "ditinjau" || t.status === "tindakan";
    } else if (statusFilter === "closed") {
      matchesStatus = t.status === "ditutup" || t.status === "menunggu_siswa";
    }

    const matchesUrgency = urgencyFilter === "all" || t.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  // Token Filter
  const filteredTokens = (tokens || []).filter((t) => {
    const q = searchToken.toLowerCase();
    const code = (t.tokenCode ?? (t as any).token_code ?? "").toString().toLowerCase();
    const level = (t.studentLevel ?? "").toLowerCase();
    return code.includes(q) || level.includes(q);
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedToken(code);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !counselorNoteText.trim()) return;
    onAddCounselorNote(selectedTicket.id, counselorNoteText.trim());
    setCounselorNoteText("");
    setNoteSavedMsg("Catatan konseling tersimpan secara aman.");
    setTimeout(() => setNoteSavedMsg(""), 3000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    onCounselorReply(selectedTicket.id, replyText.trim());
    setReplyText("");
  };

  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !onSubmitResolutionEvidence) return;
    onSubmitResolutionEvidence(selectedTicket.id, {
      type: evidenceType,
      description: evidenceDescription,
      fileUrl: evidenceFileUrl || undefined,
      submittedBy: loggedCounselor?.name || "Guru BK / Satgas PPKSP",
    });
    setShowEvidenceModal(false);
    setEvidenceDescription("");
  };

  const handleConfirmEscalate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !onEscalateTicket) return;
    onEscalateTicket(selectedTicket.id, escalateTarget, escalateReason);
    setShowEscalateModal(false);
    setEscalateReason("");
  };

  const handleGenerateTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onGenerateBatchTokens) return;
    try {
      setIsGenerating(true);
      setTokenErrorMsg("");
      await onGenerateBatchTokens(batchCount, customPrefix, selectedStudentLevel);
      setTokenSuccessMsg(`Berhasil membuat ${batchCount} token untuk ${selectedStudentLevel}`);
      setTimeout(() => setTokenSuccessMsg(""), 3500);
    } catch (err: any) {
      console.error(err);
      setTokenErrorMsg(err.message || "Gagal membuat token. Silakan periksa koneksi.");
      setTimeout(() => setTokenErrorMsg(""), 3500);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSchoolProfile) {
      onUpdateSchoolProfile(profileForm);
      setProfileSavedMsg("Profil Satuan Pendidikan & SK Satgas PPKSP berhasil diperbarui!");
      setTimeout(() => setProfileSavedMsg(""), 3500);
    }
  };

  // Metrics counters
  const criticalCount = tickets.filter((t) => t.urgency === "Kritis").length;
  const pendingCount = tickets.filter((t) => t.status === "diterima" || t.status === "ditinjau").length;
  const inActionCount = tickets.filter((t) => t.status === "tindakan").length;
  const closedCount = tickets.filter((t) => t.status === "ditutup").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* 1. TOP HEADER & METRICS BAR */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md shadow-primary/20 shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-ink leading-tight">
                Ruang Kerja Satgas PPKSP &amp; Guru BK
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                Admin Sekolah • {schoolProfile.schoolName || "SMA Negeri 1 Jakarta"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Konselor / Admin Sekolah: <strong>{loggedCounselor?.name || "Dra. Hj. Nurjanah, M.Pd"}</strong> • Pengelolaan Kasus &amp; Legalitas Satgas
            </p>
          </div>
        </div>

        {/* Quick Metrics Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <span>{criticalCount} Kritis</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold flex items-center gap-1.5">
            <Clock size={13} />
            <span>{pendingCount} Antrean Baru</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-1.5">
            <MessageSquare size={13} />
            <span>{inActionCount} Penanganan</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            <span>{closedCount} Selesai</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION TABS (Laporan Kasus | Token Siswa | Profil Satgas Sekolah) */}
      <div className="flex items-center justify-between border-b border-border pb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveMainTab("laporan")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeMainTab === "laporan"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <FileText size={15} />
            <span>Daftar Laporan Siswa ({tickets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab("tokens")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeMainTab === "tokens"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <KeyRound size={15} />
            <span>Kelola Token Anonim ({tokens.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab("profil")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeMainTab === "profil"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Building2 size={15} />
            <span>Profil Satgas &amp; Satuan Pendidikan</span>
          </button>
        </div>

        {activeMainTab === "tokens" && (
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-ink transition cursor-pointer"
          >
            <Printer size={14} />
            <span>Cetak Slip Token Siswa</span>
          </button>
        )}
      </div>

      {/* 3. WORKSPACE AREA */}
      {activeMainTab === "laporan" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: TICKET LIST & FILTERS (4 Cols) */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-4 space-y-4 shadow-xs">
            {/* Search & Filter Controls */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari ID tiket, kategori, kronologi..."
                  value={searchTicket}
                  onChange={(e) => setSearchTicket(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-muted p-1 rounded-xl text-[11px] font-bold text-center">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`py-1 rounded-lg transition cursor-pointer ${
                    statusFilter === "all" ? "bg-card text-primary shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Semua ({tickets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("need_action")}
                  className={`py-1 rounded-lg transition cursor-pointer ${
                    statusFilter === "need_action" ? "bg-card text-amber-600 shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Tindakan ({pendingCount + inActionCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("closed")}
                  className={`py-1 rounded-lg transition cursor-pointer ${
                    statusFilter === "closed" ? "bg-card text-emerald-600 shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Selesai ({closedCount})
                </button>
              </div>

              {/* Urgency Pill Select */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="text-muted-foreground font-semibold shrink-0">Urgensi:</span>
                {["all", "Kritis", "Tinggi", "Sedang", "Rendah"].map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setUrgencyFilter(urg)}
                    className={`px-2 py-0.5 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                      urgencyFilter === urg
                        ? "bg-ink text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {urg === "all" ? "Semua" : urg}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket Cards List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center bg-muted/40 rounded-xl border border-dashed border-border text-muted-foreground text-xs">
                  <FileText size={24} className="mx-auto mb-2 opacity-50" />
                  <p>Tidak ada laporan yang sesuai kriteria.</p>
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const isSelected = selectedTicket?.id === ticket.id;
                  const isCritical = ticket.urgency === "Kritis" || ticket.urgency === "Tinggi";

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                          : "bg-card border-border hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-ink">{ticket.id}</span>
                        <div className="flex items-center gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isCritical
                                ? "bg-danger/10 text-danger border border-danger/20"
                                : ticket.urgency === "Sedang"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {ticket.urgency}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ticket.status === "ditutup"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : ticket.status === "menunggu_siswa"
                                ? "bg-purple-500/10 text-purple-600"
                                : ticket.status === "tindakan"
                                ? "bg-primary/10 text-primary"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {ticket.status === "diterima" && "Baru"}
                            {ticket.status === "ditinjau" && "Ditinjau"}
                            {ticket.status === "tindakan" && "Proses"}
                            {ticket.status === "menunggu_siswa" && "Verifikasi Siswa"}
                            {ticket.status === "ditutup" && "Selesai"}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-ink line-clamp-1 mb-1">
                        {ticket.category || "Laporan Siswa"}
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {ticket.story}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border/60">
                        <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("id-ID") : "Baru saja"}</span>
                        <span className="font-semibold text-primary">
                          {(ticket.messages ?? (ticket as any).chatMessages ?? []).length} pesan
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: CASE WORKBENCH (8 Cols) */}
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-5 shadow-xs space-y-5">
            {selectedTicket ? (
              <>
                {/* Top Case Summary Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-ink bg-muted px-2.5 py-0.5 rounded-lg">
                        {selectedTicket.id}
                      </span>
                      <h2 className="text-sm font-bold text-ink">{selectedTicket.category}</h2>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Waktu Lapor: {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString("id-ID") : "-"}
                    </p>
                  </div>

                  {/* Actions (BAP, Status Selector, Eskalasi) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowBapModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-ink transition cursor-pointer"
                    >
                      <Printer size={13} />
                      <span>Cetak BAP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowEscalateModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20 text-xs font-bold transition cursor-pointer"
                    >
                      <ArrowUpRight size={13} />
                      <span>Eskalasi ke Dinas</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Tabs: Detail & Catatan | Chat Konseling | Resolusi Kasus */}
                <div className="flex items-center gap-2 border-b border-border pb-1">
                  <button
                    type="button"
                    onClick={() => setCaseSubTab("detail")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      caseSubTab === "detail"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <FileText size={13} />
                    <span>Kronologi &amp; Catatan Internal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCaseSubTab("chat")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      caseSubTab === "chat"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <MessageSquare size={13} />
                    <span>Chat Konseling ({(selectedTicket.messages ?? (selectedTicket as any).chatMessages ?? []).length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCaseSubTab("resolution")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      caseSubTab === "resolution"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <FileCheck size={13} />
                    <span>Bukti Resolusi Kasus</span>
                  </button>
                </div>

                {/* SUBTAB 1: KRONOLOGI & CATATAN */}
                {caseSubTab === "detail" && (
                  <div className="space-y-4">
                    {/* Status Update Ribbon */}
                    <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-ink block">Status Penanganan Saat Ini:</span>
                        <span className="text-[11px] text-muted-foreground">
                          Ubah status untuk mengabari pelapor secara transparan.
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedTicket.status}
                          onChange={(e) => onUpdateTicketStatus(selectedTicket.id, e.target.value as ReportStatus)}
                          className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-bold text-ink focus:outline-none focus:border-primary"
                        >
                          <option value="diterima">1. Diterima (Antrean)</option>
                          <option value="ditinjau">2. Ditinjau Konselor</option>
                          <option value="tindakan">3. Tindakan / Mediasi Aktif</option>
                          <option value="menunggu_siswa">4. Menunggu Konfirmasi Siswa</option>
                          <option value="ditutup">5. Kasus Ditutup / Selesai</option>
                        </select>
                      </div>
                    </div>

                    {/* Incident Story Card */}
                    <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-ink">
                        <span>Uraian Kejadian Siswa (Tersanitasi):</span>
                        <span className="text-muted-foreground font-normal text-[11px]">
                          Lokasi: {selectedTicket.location || "Lingkungan Sekolah"}
                        </span>
                      </div>
                      <p className="text-xs text-ink/90 whitespace-pre-wrap leading-relaxed">
                        {selectedTicket.story}
                      </p>
                    </div>

                    {/* Counselor Internal Private Note */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                          <Lock size={12} className="text-amber-600" />
                          <span>Catatan Rahasia Konselor (Hanya Tim BK / Satgas):</span>
                        </span>
                        {noteSavedMsg && (
                          <span className="text-[11px] font-bold text-emerald-600 animate-fadeIn">
                            {noteSavedMsg}
                          </span>
                        )}
                      </div>

                      {selectedTicket.counselorNotes && selectedTicket.counselorNotes.length > 0 && (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {selectedTicket.counselorNotes.map((note, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15 text-xs text-ink/90">
                              <p className="leading-relaxed">{note}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <form onSubmit={handleSaveNote} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Tambah catatan observasi / hasil pemanggilan pihak terkait..."
                          value={counselorNoteText}
                          onChange={(e) => setCounselorNoteText(e.target.value)}
                          className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer"
                        >
                          Simpan Catatan
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* SUBTAB 2: CHAT KONSELING */}
                {caseSubTab === "chat" && (
                  <div className="space-y-3">
                    {/* Chat Messages Log */}
                    <div className="border border-border rounded-xl p-4 bg-background max-h-80 overflow-y-auto space-y-3">
                      {((selectedTicket.messages ?? (selectedTicket as any).chatMessages ?? []).length === 0) ? (
                        <div className="p-6 text-center text-muted-foreground text-xs">
                          <MessageSquare size={24} className="mx-auto mb-1.5 opacity-40" />
                          <p>Belum ada percakapan konseling. Kirim pesan pertama untuk menyapa pelapor secara rahasia.</p>
                        </div>
                      ) : (
                        (selectedTicket.messages ?? (selectedTicket as any).chatMessages ?? []).map((msg: any) => {
                          const senderVal = (msg.sender || msg.sender_type || "").toString().toLowerCase();
                          const isCounselor =
                            senderVal === "counselor" ||
                            senderVal === "konselor" ||
                            senderVal === "guru" ||
                            msg.senderRole === "counselor";
                          const isSystem = senderVal === "system";
                          const textContent = msg.text || msg.message_text || "";

                          if (isSystem) {
                            return (
                              <div key={msg.id} className="flex justify-center my-1.5">
                                <div className="bg-muted text-muted-foreground text-[10px] px-3 py-1 rounded-full text-center max-w-sm font-medium">
                                  {textContent}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isCounselor ? "items-end" : "items-start"}`}
                            >
                              <div
                                className={`p-3 rounded-2xl max-w-md text-xs ${
                                  isCounselor
                                    ? "bg-primary text-primary-foreground rounded-tr-xs shadow-xs"
                                    : "bg-muted text-ink rounded-tl-xs shadow-xs"
                                }`}
                              >
                                <p className="font-bold text-[10px] mb-0.5 opacity-80">
                                  {isCounselor
                                    ? (msg.senderTitle || msg.sender_title || "Guru BK / Satgas")
                                    : "Siswa Pelapor"}
                                </p>
                                <p className="whitespace-pre-wrap leading-relaxed">{textContent}</p>
                              </div>
                              <span className="text-[10px] text-muted-foreground mt-0.5 px-1 font-mono">
                                {formatSafeTime(msg.timestamp || msg.created_at)}
                              </span>
                            </div>
                          );
                        })
                      )}
                      <div ref={counselorChatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendChat} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ketik pesan konseling kepada siswa..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Send size={14} />
                        <span>Kirim</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* SUBTAB 3: BUKTI RESOLUSI */}
                {caseSubTab === "resolution" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          <span>Penyelesaian &amp; Bukti Tindakan Nyata</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowEvidenceModal(true)}
                          className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold hover:opacity-90 transition cursor-pointer"
                        >
                          Unggah Bukti Baru
                        </button>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Sebelum kasus ditutup, pihak sekolah wajib mengunggah bukti penyelesaian (misal surat permohonan maaf pelaku, berita acara mediasi damai, atau sanksi edukatif) agar siswa dapat memverifikasi bahwa haknya telah terpenuhi.
                      </p>
                    </div>

                    {/* Resolution List */}
                    {selectedTicket.resolutionEvidence && selectedTicket.resolutionEvidence.length > 0 ? (
                      <div className="space-y-2">
                        {selectedTicket.resolutionEvidence.map((ev, i) => (
                          <div key={i} className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-ink">{ev.type}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">{ev.uploadedAt ? new Date(ev.uploadedAt).toLocaleString("id-ID") : ""}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{ev.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center border border-dashed border-border rounded-xl text-muted-foreground text-xs">
                        <FileCheck size={24} className="mx-auto mb-1.5 opacity-40" />
                        <p>Belum ada bukti resolusi yang diunggah untuk kasus ini.</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center text-muted-foreground text-xs">
                <FileText size={32} className="mx-auto mb-2 opacity-40" />
                <p>Pilih laporan dari kolom kiri untuk memulai penanganan kasus.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB 2: KELOLA TOKEN ANONIM SISWA */}
      {activeMainTab === "tokens" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Token Batch Generator Form (4 Cols) */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-ink">Buat Batch Token Siswa</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Generate kode unik acak untuk dibagikan secara adil tanpa mencatat identitas siswa.
              </p>
            </div>

            {tokenSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold">
                {tokenSuccessMsg}
              </div>
            )}

            {tokenErrorMsg && (
              <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold">
                {tokenErrorMsg}
              </div>
            )}

            <form onSubmit={handleGenerateTokens} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-ink block mb-1">Jumlah Token:</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={batchCount}
                  onChange={(e) => setBatchCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">Prefix Kode:</label>
                <input
                  type="text"
                  value={customPrefix}
                  onChange={(e) => setCustomPrefix(e.target.value)}
                  placeholder="Contoh: SCH-X1"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-ink focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">Tingkat Kelas / Sasaran:</label>
                <input
                  type="text"
                  value={selectedStudentLevel}
                  onChange={(e) => setSelectedStudentLevel(e.target.value)}
                  placeholder="Contoh: Kelas X - MIPA 1"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-1.5 mt-2 shadow-xs"
              >
                <Plus size={14} />
                <span>{isGenerating ? "Men-generate..." : "Generate Token"}</span>
              </button>
            </form>
          </div>

          {/* Tokens Table List (8 Cols) */}
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-ink">Daftar Kode Akses Siswa</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Total {tokens.length} token terdaftar dalam sistem sekolah.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Cari kode / kelas..."
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  className="px-3 py-1.5 bg-background border border-border rounded-xl text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="border border-border rounded-xl overflow-hidden max-h-[500px] overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted text-muted-foreground font-bold border-b border-border">
                  <tr>
                    <th className="p-3">Kode Token</th>
                    <th className="p-3">Tingkat Kelas</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTokens.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted-foreground">
                        Tidak ada token yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredTokens.map((tok) => {
                      const code = (tok.tokenCode ?? (tok as any).token_code ?? "").toString();
                      const status = tok.status || (tok.isActivated ? "Aktif" : "Tersedia");

                      return (
                        <tr key={tok.id || code} className="hover:bg-muted/40 transition">
                          <td className="p-3 font-mono font-bold text-ink flex items-center gap-2">
                            <span>{code}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(code)}
                              className="text-muted-foreground hover:text-primary p-0.5 cursor-pointer"
                              title="Salin Kode"
                            >
                              {copiedToken === code ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            </button>
                          </td>
                          <td className="p-3 text-muted-foreground">{tok.studentLevel || "Semua Kelas"}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                status === "Aktif" || status === "Digunakan"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {onDeleteToken && (
                              <button
                                type="button"
                                onClick={() => onDeleteToken(tok.id || code)}
                                className="text-muted-foreground hover:text-danger p-1 transition cursor-pointer"
                                title="Hapus Token"
                              >
                                <Trash2 size={14} />
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

      {/* 5. TAB 3: PROFIL SATUAN PENDIDIKAN & SK SATGAS PPKSP (ADMIN SEKOLAH) */}
      {activeMainTab === "profil" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* School Profile & Satgas Form (8 Cols) */}
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                <span>Profil Satuan Pendidikan &amp; SK Satgas PPKSP</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sebagai <strong>Admin Sekolah</strong>, Guru BK / Koordinator Satgas mengelola identitas resmi sekolah dan legalitas tim Satgas PPKSP yang otomatis tercantum pada Berita Acara Mediasi (BAP) dan surat resmi.
              </p>
            </div>

            {profileSavedMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold">
                {profileSavedMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-ink block mb-1">Nama Satuan Pendidikan:</label>
                  <input
                    type="text"
                    required
                    value={profileForm.schoolName}
                    onChange={(e) => setProfileForm({ ...profileForm, schoolName: e.target.value })}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-ink block mb-1">NPSN Resmi:</label>
                  <input
                    type="text"
                    required
                    value={profileForm.npsn}
                    onChange={(e) => setProfileForm({ ...profileForm, npsn: e.target.value })}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-ink block mb-1">Nomor SK Satgas PPKSP:</label>
                  <input
                    type="text"
                    required
                    value={profileForm.satgasSkNumber || "421.3/1234/SK/2024"}
                    onChange={(e) => setProfileForm({ ...profileForm, satgasSkNumber: e.target.value })}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-ink block mb-1">Ketua Satgas PPKSP:</label>
                  <input
                    type="text"
                    required
                    value={profileForm.satgasLeaderName || "Dra. Hj. Aminah Sucipto, M.M"}
                    onChange={(e) => setProfileForm({ ...profileForm, satgasLeaderName: e.target.value })}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-ink block mb-1">Koordinator Guru BK:</label>
                  <input
                    type="text"
                    required
                    value={profileForm.counselorCoordinatorName || "Dra. Hj. Nurjanah, M.Pd"}
                    onChange={(e) => setProfileForm({ ...profileForm, counselorCoordinatorName: e.target.value })}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-ink block mb-1">Kepala Sekolah:</label>
                  <input
                    type="text"
                    required
                    value={profileForm.principalName || "Dr. H. Surya Wijaya, M.Pd"}
                    onChange={(e) => setProfileForm({ ...profileForm, principalName: e.target.value })}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-ink block mb-1">Kabupaten / Kota:</label>
                  <input
                    type="text"
                    value={profileForm.district || "Jakarta Pusat"}
                    onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-ink"
                  />
                </div>
                <div>
                  <label className="font-bold text-ink block mb-1">Provinsi:</label>
                  <input
                    type="text"
                    value={profileForm.province || "DKI Jakarta"}
                    onChange={(e) => setProfileForm({ ...profileForm, province: e.target.value })}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-ink"
                  />
                </div>
                <div>
                  <label className="font-bold text-ink block mb-1">Hotline Satgas PPKSP:</label>
                  <input
                    type="text"
                    value={profileForm.hotlineNumber || "0812-3456-7890"}
                    onChange={(e) => setProfileForm({ ...profileForm, hotlineNumber: e.target.value })}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-90 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Save size={14} />
                  <span>Simpan Profil Satgas Sekolah</span>
                </button>
              </div>
            </form>
          </div>

          {/* Info Card Legalitas (4 Cols) */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-ink">
              <BadgeCheck size={18} className="text-primary" />
              <span>Legalitas Permendikbudristek 46/2023</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Data yang diinputkan oleh <strong>Admin Sekolah (Guru BK)</strong> ini secara otomatis digunakan pada:
            </p>

            <ul className="text-xs space-y-2 text-ink/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Kop Surat Berita Acara Mediasi (BAP) Resmi</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Kop Cetak Slip Token Akses Siswa</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Identitas Sekolah pada Surat Eskalasi ke Dinas</span>
              </li>
            </ul>

            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-primary font-semibold">
              Sekolah Anda tercatat di bawah supervisi Dinas Pendidikan Wilayah.
            </div>
          </div>
        </div>
      )}

      {/* 6. MODALS */}
      {/* Evidence Submission Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-ink">Unggah Bukti Penyelesaian Kasus</h3>
              <button onClick={() => setShowEvidenceModal(false)} className="text-muted-foreground hover:text-ink cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitEvidence} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">Bentuk / Jenis Resolusi:</label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-semibold"
                >
                  <option value="Surat Permintaan Maaf Resmi Pelaku">Surat Permintaan Maaf Resmi Pelaku</option>
                  <option value="Berita Acara Mediasi Damai Guru BK">Berita Acara Mediasi Damai Guru BK</option>
                  <option value="Sanksi Edukatif & Pembinaan Disiplin">Sanksi Edukatif & Pembinaan Disiplin</option>
                  <option value="Rujukan Selesai Pendampingan Psikologis">Rujukan Selesai Pendampingan Psikologis</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Uraian Tindakan / Ringkasan Mediasi:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan tindakan nyata yang telah dilakukan sekolah untuk melindungi korban..."
                  value={evidenceDescription}
                  onChange={(e) => setEvidenceDescription(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEvidenceModal(false)}
                  className="px-4 py-2 border border-border rounded-xl font-bold hover:bg-muted cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 cursor-pointer"
                >
                  Simpan Bukti Resolusi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Escalation Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-danger flex items-center gap-1.5">
                <AlertTriangle size={16} />
                <span>Eskalasi Kasus ke Tingkat Dinas</span>
              </h3>
              <button onClick={() => setShowEscalateModal(false)} className="text-muted-foreground hover:text-ink cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmEscalate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">Instansi Rujukan Tujuan:</label>
                <select
                  value={escalateTarget}
                  onChange={(e) => setEscalateTarget(e.target.value as any)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-semibold"
                >
                  <option value="Dinas Perlindungan (UPTD PPA)">Dinas Perlindungan (UPTD PPA - Pendampingan Psikolog &amp; Hukum)</option>
                  <option value="Dinas Pendidikan">Dinas Pendidikan (Supervisi Sekolah &amp; Sanksi Administratif)</option>
                  <option value="Keduanya">Keduanya (Dinas Pendidikan &amp; UPTD PPA)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Alasan / Catatan Eskalasi:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Sebutkan pertimbangan keselamatan atau keterlibatan pidana yang membutuhkan bantuan dinas..."
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(false)}
                  className="px-4 py-2 border border-border rounded-xl font-bold hover:bg-muted cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-danger hover:opacity-90 text-white font-bold rounded-xl cursor-pointer"
                >
                  Konfirmasi Eskalasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BAP Official Report Modal */}
      {showBapModal && selectedTicket && (
        <OfficialCaseReportModal
          isOpen={showBapModal}
          onClose={() => setShowBapModal(false)}
          ticket={selectedTicket}
          schoolProfile={schoolProfile}
          counselorName={loggedCounselor?.name || "Guru BK"}
        />
      )}

      {/* Print Token Slips Modal */}
      {isPrintModalOpen && (
        <PrintTokenSlipsModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          tokens={tokens}
          schoolName={schoolProfile.schoolName}
        />
      )}
    </div>
  );
};
